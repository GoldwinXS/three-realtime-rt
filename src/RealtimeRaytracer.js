import * as THREE from "three";
import { compileScene, syncLights } from "./SceneCompiler.js";
import { GBufferPass } from "./GBufferPass.js";
import { RTLightingPass } from "./RTLightingPass.js";
import { DenoisePass } from "./DenoisePass.js";
import { CompositePass } from "./CompositePass.js";
import { TAAPass } from "./TAAPass.js";
import { VolumetricPass } from "./VolumetricPass.js";
import { RestirPass } from "./RestirPass.js";
import { GIReservoirPass } from "./GIReservoirPass.js";
import { CopyPass } from "./CopyPass.js";
import { makeMRT } from "./mrtCompat.js";

// Van der Corput / Halton radical inverse — deterministic low-discrepancy
// sub-pixel offsets for temporal jitter.
function halton(index, base) {
  let f = 1;
  let r = 0;
  let i = index;
  while (i > 0) {
    f /= base;
    r += f * (i % base);
    i = Math.floor(i / base);
  }
  return r;
}

/**
 * Drop-in ray traced renderer for three.js scenes.
 *
 *   const rt = new RealtimeRaytracer(renderer);
 *   rt.compileScene(scene);          // once (static scenes, stage 1)
 *   rt.render(scene, camera);        // per frame, instead of renderer.render
 *
 * Hybrid deferred: rasterized G-buffer for primary visibility, BVH-traced
 * shadow rays + 1-bounce GI for lighting, progressive temporal accumulation.
 */
export class RealtimeRaytracer {
  /**
   * Can this renderer run the ray tracing pipeline at all? Requires WebGL2
   * with float render targets on a hardware GPU (software rasterizers like
   * SwiftShader technically work but are unusably slow — treated as no).
   */
  static isSupported(renderer) {
    try {
      const gl = renderer.getContext();
      if (typeof WebGL2RenderingContext === "undefined" || !(gl instanceof WebGL2RenderingContext)) return false;
      if (!gl.getExtension("EXT_color_buffer_float")) return false;
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
        if (/swiftshader|llvmpipe|software/i.test(r)) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Rough capability tier for choosing defaults: "none" (can't trace — see
   * isSupported), "mid" (phones/tablets), "high" (desktop-class). WebGPU
   * presence is not used as a backend (this library is WebGL2), only as a
   * modern-browser signal; a WGSL compute backend is roadmap.
   */
  static detectTier(renderer) {
    if (renderer && !RealtimeRaytracer.isSupported(renderer)) return "none";
    const nav = typeof navigator !== "undefined" ? navigator : {};
    const mobile =
      (nav.maxTouchPoints ?? 0) > 1 || /Android|iPhone|iPad|Mobile/i.test(nav.userAgent || "");
    return mobile ? "mid" : "high";
  }

  /** Sensible constructor options for a tier (spread them, then override). */
  static recommendedOptions(tier) {
    if (tier === "none") return {};
    if (tier === "mid") {
      return {
        renderScale: 0.375,
        ...RealtimeRaytracer._qualityFor(0.375),
        adaptiveQuality: true,
      };
    }
    // High: full per-light direct shadows (stochasticLights pinned false).
    // Pinned explicitly because the constructor default is now `true` (the
    // conservative-default change) — high must keep its original behaviour.
    return { renderScale: 0.5, denoiseIterations: 3, stochasticLights: false, adaptiveQuality: true };
  }

  /**
   * GPU tier probe. An OPTIONAL, async companion to {@link detectTier}: when the
   * browser exposes WebGPU it inspects the real adapter limits, otherwise it
   * falls back to the WebGL heuristic. Returns
   * `{ tier: "none"|"mid"|"high", source: "webgpu"|"webgl"|"fallback", details }`.
   *
   *   const probe = await RealtimeRaytracer.probeGPUTier();
   *   const rt = new RealtimeRaytracer(renderer, RealtimeRaytracer.recommendedOptions(probe.tier));
   *
   * HONEST-HEURISTIC CAVEAT: WebGPU does NOT expose VRAM. `adapter.limits`
   * advertises binding/allocation ceilings (`maxBufferSize` etc.), which are a
   * driver-reported proxy for "how beefy is this GPU", not a memory size — a
   * card with 8GB and a card with 24GB can report the identical 2GB
   * `maxBufferSize`. `adapter.info` (vendor/architecture/description) is masked
   * on many browsers for fingerprinting reasons, so it is treated as a hint
   * only. The classification is therefore deliberately coarse.
   *
   * Classification (WebGPU path), all thresholds echoed back in `details`:
   *  - Software signature in adapter.info (swiftshader / llvmpipe / "basic
   *    render" / paravirtual) → `"none"`.
   *  - "strong" = `maxBufferSize >= 2GiB` AND `maxTextureDimension2D >= 16384`
   *    (integrated GPUs typically report an 8192 texture limit and a smaller
   *    buffer ceiling).
   *  - Screen-demand factor: `screenPixels = screen.width * screen.height *
   *    min(devicePixelRatio, 2)` (DPR clamped so a 3× phone doesn't read as a
   *    workstation). A 4K-class panel (`screenPixels >= 6e6`) has to fill ~4×
   *    the pixels of 1080p for the same lighting resolution, so a "strong" GPU
   *    is only called `"high"` on such a screen when it ALSO clears a 4GiB
   *    `maxBufferSize` bar; otherwise it is demoted to `"mid"`.
   *  - strong (clearing the screen bar) → `"high"`, else → `"mid"`.
   *
   * No WebGPU (or requestAdapter fails) → the existing {@link detectTier} WebGL
   * heuristic, `source: "webgl"` when a renderer was supplied to probe, or
   * `source: "fallback"` when the tier is a pure user-agent guess (no context).
   */
  static async probeGPUTier(renderer) {
    const GiB = 1024 * 1024 * 1024;
    const details = {};

    // Screen-demand factor (used by every path). DPR clamped to 2 so a phone's
    // 3×/4× ratio doesn't inflate demand past what its tiny CSS area needs.
    const dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
    const scr =
      typeof window !== "undefined" && window.screen
        ? window.screen
        : { width: 1920, height: 1080 };
    const screenPixels = Math.round(scr.width * scr.height * Math.min(dpr, 2));
    const demanding = screenPixels >= 6e6; // 4K-class panel
    details.screenPixels = screenPixels;
    details.demanding = demanding;

    if (typeof navigator !== "undefined" && navigator.gpu) {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          const L = adapter.limits || {};
          const maxBufferSize = Number(L.maxBufferSize || 0);
          const maxStorageBufferBindingSize = Number(L.maxStorageBufferBindingSize || 0);
          const maxTextureDimension2D = Number(L.maxTextureDimension2D || 0);
          const maxComputeWorkgroupStorageSize = Number(L.maxComputeWorkgroupStorageSize || 0);
          Object.assign(details, {
            maxBufferSize,
            maxStorageBufferBindingSize,
            maxTextureDimension2D,
            maxComputeWorkgroupStorageSize,
          });

          // adapter.info is a plain property in newer specs; older Chromium
          // exposed it via the async requestAdapterInfo(). Both are masked on
          // some browsers — treat any of it as an optional hint.
          let info = {};
          try {
            info =
              adapter.info ||
              (adapter.requestAdapterInfo ? await adapter.requestAdapterInfo() : {}) ||
              {};
          } catch {
            info = {};
          }
          details.vendor = info.vendor || null;
          details.architecture = info.architecture || null;
          details.description = info.description || null;
          const infoStr = `${info.vendor || ""} ${info.architecture || ""} ${
            info.description || ""
          } ${info.device || ""}`.toLowerCase();

          if (/swiftshader|llvmpipe|software|basic render|microsoft basic|paravirtual/.test(infoStr)) {
            details.reason = "software renderer signature in adapter.info";
            return { tier: "none", source: "webgpu", details };
          }

          const strong = maxBufferSize >= 2 * GiB && maxTextureDimension2D >= 16384;
          const hugeBuffer = maxBufferSize >= 4 * GiB;
          let tier;
          if (strong && (!demanding || hugeBuffer)) {
            tier = "high";
            details.reason =
              demanding && hugeBuffer
                ? "strong limits + >=4GiB buffer clears 4K-class screen demand -> high"
                : "large buffer + textures -> high";
          } else if (strong && demanding) {
            tier = "mid";
            details.reason =
              "strong limits but 4K-class screen without a >=4GiB buffer budget -> mid";
          } else {
            tier = "mid";
            details.reason = "modest adapter limits -> mid";
          }
          return { tier, source: "webgpu", details };
        }
        details.reason = "navigator.gpu present but requestAdapter returned no adapter";
      } catch (err) {
        details.error = String((err && err.message) || err);
      }
    } else {
      details.reason = "no navigator.gpu (WebGPU unavailable)";
    }

    // WebGL heuristic fallback. With a renderer we actually probe the GL
    // context (source "webgl"); without one the tier is a pure user-agent guess
    // (source "fallback").
    const tier = RealtimeRaytracer.detectTier(renderer);
    return { tier, source: renderer ? "webgl" : "fallback", details };
  }

  /**
   * Probe whether this context accepts a framebuffer with mixed fp16/fp32
   * color attachments (legal WebGL2; some drivers reject it anyway). Runs raw
   * GL before three renders anything, and restores null bindings after.
   */
  static _mixedMrtSupported(gl) {
    try {
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      const mk = (ifmt) => {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texStorage2D(gl.TEXTURE_2D, 1, ifmt, 4, 4);
        return t;
      };
      const t0 = mk(gl.RGBA16F);
      const t1 = mk(gl.RGBA32F);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t0, 0);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, t1, 0);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.deleteFramebuffer(fb);
      gl.deleteTexture(t0);
      gl.deleteTexture(t1);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok;
    } catch {
      return false;
    }
  }

  /**
   * FUNCTIONAL probe: can this context actually DRAW into a 2-attachment
   * half-float MRT? A checkFramebufferStatus probe is not enough — WebKit
   * (every iOS browser) reports the framebuffer complete and then renders
   * black, which killed the whole lighting pass on iPhone/iPad in 0.4.0.
   * So: render one 2-output quad into a tiny fp16 MRT, resolve attachment 0
   * into an RGBA8 target through a sampler, and read the pixel back. Only a
   * round-trip that returns the written value counts as support.
   */
  static _specMrtSupported(renderer) {
    let mrt, out, mat, copy, quad, scene2, cam;
    const prevTarget = renderer.getRenderTarget();
    try {
      mrt = makeMRT(2, 2, 2, {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        depthBuffer: false,
        stencilBuffer: false,
      });
      for (const tex of mrt.texture) tex.generateMipmaps = false;
      out = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false, stencilBuffer: false });
      const vert = `out vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
      mat = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: vert,
        fragmentShader: `precision highp float;
layout(location = 0) out vec4 o0; layout(location = 1) out vec4 o1;
void main(){ o0 = vec4(0.5, 0.25, 0.75, 1.0); o1 = vec4(0.125); }`,
        depthTest: false,
        depthWrite: false,
      });
      copy = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: vert,
        fragmentShader: `precision highp float; in vec2 vUv; out vec4 outColor;
uniform sampler2D uTex; void main(){ outColor = texture(uTex, vUv); }`,
        uniforms: { uTex: { value: mrt.texture[0] } },
        depthTest: false,
        depthWrite: false,
      });
      scene2 = new THREE.Scene();
      cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
      quad.frustumCulled = false;
      scene2.add(quad);
      renderer.setRenderTarget(mrt);
      renderer.render(scene2, cam);
      quad.material = copy;
      renderer.setRenderTarget(out);
      renderer.render(scene2, cam);
      const px = new Uint8Array(4);
      renderer.readRenderTargetPixels(out, 0, 0, 1, 1, px);
      // 0.5 -> ~128; accept a generous tolerance (fp16 + dithering).
      return Math.abs(px[0] - 128) < 24 && Math.abs(px[1] - 64) < 24;
    } catch {
      return false;
    } finally {
      renderer.setRenderTarget(prevTarget);
      if (quad) quad.geometry.dispose();
      if (mat) mat.dispose();
      if (copy) copy.dispose();
      if (mrt) mrt.dispose();
      if (out) out.dispose();
    }
  }

  /**
   * Companion settings for a given lighting resolution, and the governor's
   * denoise-pass CAP.
   *
   * This used to read "LOW resolution wants MORE denoise passes" (3 / 4 / 5 as
   * the scale fell) on the theory that the filter runs at lighting res, so extra
   * iterations are nearly free. The frame-time half of that is true. The image
   * half is not, and the quality campaign measured it: past 2 passes rmse-vs-
   * reference degrades monotonically in every scene, and the coarse-period
   * energy that reads as the plaid/lattice artifact rises 4-5x between 2 and 4
   * passes (cornell renderScale 0.5, period-32px bin 0.25 -> 0.99). The peak
   * lands wherever the WIDEST a-trous tap spacing reaches ~16 SCREEN pixels —
   * pass 4 at renderScale 0.5, pass 3 at 0.25 — so the old ladder was raising
   * the pass count exactly where the artifact is worst. The governor now never
   * exceeds 3 (the panel slider keeps its full range; this is the automatic
   * policy, not a clamp on the user).
   *
   * The stochasticLights threshold is deliberately NOT touched. The campaign
   * measured it at 0.03-0.06 ms — nothing — but all three campaign scenes have
   * three lights or fewer, and this switch exists for MANY-light scenes on weak
   * GPUs, which is precisely the case the measurement cannot speak to.
   */
  static GOVERNOR_MAX_DENOISE = 3;

  static _qualityFor(scale) {
    return {
      denoiseIterations: scale > 0.45 ? 2 : RealtimeRaytracer.GOVERNOR_MAX_DENOISE,
      stochasticLights: scale <= 0.55,
    };
  }

  // Canvas-scale ladder for the governor's deepest lever. Canvas scale shrinks
  // the drawing buffer, so EVERY pass (raster G-buffer, lighting, denoise, TAA,
  // resolve) gets quadratically cheaper — unlike renderScale, which only touches
  // the lighting buffer. It's app-owned (the demo/gallery own the canvas + CSS
  // stretch), so the governor drives it through canvasScaleHook rather than
  // touching the renderer directly.
  static CANVAS_LEVELS = [1, 0.85, 0.75, 0.62, 0.5];

  // Sample count the carried-over irradiance history is clamped to when the
  // targets are reallocated (renderScale step / canvas resize). Small enough
  // that the EMA visibly reconverges onto the new-resolution samples, large
  // enough that the image doesn't flash back to raw 1-spp noise — "keep ~8
  // frames of confidence". See RTLightingPass.resizeCarry.
  static HISTORY_CARRY_FRAMES = 8;

  // Compile-failure diagnosis polling window (see _scanPrograms). three checks
  // link status lazily at a program's first USE, and under
  // KHR_parallel_shader_compile it may hold a mesh back for a few frames until
  // its program is ready — so a single frame-1 scan can miss a failure. Poll
  // from frame 1 up to DIAG_WINDOW_FRAMES, and early-out once the set of rt:*
  // programs has been stable (no new programs, no unhandled failures) for
  // DIAG_STABLE_FRAMES past a DIAG_MIN_FRAMES warmup floor.
  static DIAG_MIN_FRAMES = 8;
  static DIAG_STABLE_FRAMES = 4;
  static DIAG_WINDOW_FRAMES = 45;

  // Staleness scan (see _checkStale): a static mesh edited after compileScene()
  // keeps tracing its compile-time shape/place. Checked every Nth frame only —
  // the comparison is an int and 16 floats per static source, and each source
  // stops being checked as soon as it has reported — and capped so a scene that
  // moves everything can never flood the console.
  static STALE_CHECK_FRAMES = 30;
  static MAX_STALE_WARNINGS = 8;

  // Largest renderScale change the adaptive governor may commit in one step
  // (0.25 = five 0.05 ladder steps). Bounds the reaction to a single very slow
  // frame now that 100ms-2s frames feed the EMA; see _adaptQuality.
  static MAX_SCALE_STEP = 0.25;

  /**
   * Named quality presets: flat maps of EXISTING option values, for an app that
   * wants "quality", "balanced", "performance" or "motion" without understanding
   * fifteen sliders. Four presets, each a plain, inspectable object:
   *
   *   quality     fidelity first: high lighting resolution, long history.
   *   balanced    today's defaults, captured explicitly. Applying it to a fresh
   *               instance is a no-op (asserted in the render self-test); a
   *               constructor with no `preset` key is byte-identical to the
   *               build without the feature.
   *   performance fps first: low lighting resolution, more denoise passes
   *               (cheap at low res), half-rate GI, stochastic lights.
   *   motion      fast camera/gameplay: short history + a stronger firefly
   *               clamp to cut ghosting, accepting a little extra noise.
   *
   * EVERY bundled knob is a live-tunable setting: none of them swaps the
   * lighting megakernel's source or needs a recompile (renderScale reallocates
   * lighting targets, which the renderer carries history across; the rest are
   * uniforms or pass toggles read per frame). Knobs that WOULD require
   * compileScene  -  absorptionShadows, kmScattering, textureTiles  -  are
   * deliberately excluded from all bundles.
   *
   * The exact numbers below are the MEASURED winners from the v0.12.0 quality
   * presets round (see REPORT_PRESETS.md), not guesses.
   */
  static PRESETS = {
    quality: {
      renderScale: 0.75,
      denoiseIterations: 2,
      maxHistory: 256,
      taa: true,
      restir: true,
      giHalfRate: false,
      specular: true,
    },
    balanced: {
      renderScale: 0.5,
      denoiseIterations: 2,
      maxHistory: 48,
      taa: true,
      restir: true,
      giHalfRate: false,
      specular: true,
      volumetric: { enabled: false },
      stochasticLights: true,
      fireflyClamp: 4.0,
    },
    performance: {
      renderScale: 0.375,
      denoiseIterations: 3,
      giHalfRate: true,
      volumetric: { enabled: false },
      stochasticLights: true,
    },
    motion: {
      maxHistory: 32,
      fireflyClamp: 2.5,
      taa: true,
      restir: true,
    },
  };

  constructor(renderer, options = {}) {
    this.renderer = renderer;

    /**
     * False when the platform can't run the tracer — render() then simply
     * forwards to renderer.render (plain rasterized three.js), so apps work
     * everywhere without their own capability checks.
     */
    this.supported = RealtimeRaytracer.isSupported(renderer);
    if (!this.supported) {
      console.warn(
        "three-realtime-rt: ray tracing unavailable on this system " +
          "(needs WebGL2 + EXT_color_buffer_float on a hardware GPU). " +
          "Falling back to plain three.js rendering."
      );
      this.compiled = null;
      this.frame = 0;
      // Status surface (see the supported path for the shapes). Unsupported =
      // the RT pipeline is not operational at all; `supported` is the primary
      // signal, but status is kept consistent so integrators can read one field.
      this.compileError = null;
      this.status = { ok: false, disabled: [], coreFailure: null, warnings: [] };
      this._diagDone = true;
      return;
    }

    // Quality presets (see PRESETS): a named bundle applied as the BASE of the
    // constructor options, so an explicit option always wins over the preset.
    // With no `preset` key this is the identity  -  the constructor then behaves
    // exactly as it did before the feature (byte-identical option values and
    // shader source, guarded by the render self-test's option-object equality).
    if (options.preset !== undefined) {
      const presetName = options.preset;
      if (
        typeof presetName !== "string" ||
        !Object.prototype.hasOwnProperty.call(RealtimeRaytracer.PRESETS, presetName)
      ) {
        throw new Error(
          `three-realtime-rt: unknown preset "${presetName}". ` +
            `Valid presets: ${Object.keys(RealtimeRaytracer.PRESETS).join(", ")}.`
        );
      }
      options = { ...RealtimeRaytracer.PRESETS[presetName], ...options };
    }

    const size = renderer.getSize(new THREE.Vector2());
    const pr = renderer.getPixelRatio();
    // Canvas (on-screen) drawing-buffer size. Everything internal renders at the
    // OVERSCAN-padded size derived from this; the final on-screen draw crops the
    // centre back to it.
    this._canvasW = Math.floor(size.x * pr);
    this._canvasH = Math.floor(size.y * pr);
    /**
     * Overscan: render internally at a padded resolution with a proportionally
     * widened field of view, then crop the centre to the canvas on the final
     * draw. Disocclusion pixels at the leading screen edge during camera motion
     * are then born OFF-screen, hiding their several-frame temporal-convergence
     * noise. Fraction of padding PER EDGE (clamped 0–0.25); 0.1 on a 1000×600
     * canvas renders 1200×720 internally (1.44× the pixels). 0 disables it.
     */
    this._overscan = Math.min(0.25, Math.max(0, options.overscan ?? 0));
    /**
     * Resolution scale for the ray traced lighting (G-buffer and final image
     * stay full res). 0.5 traces 4x fewer rays; the bilateral upsample +
     * denoiser reconstruct the difference. Set 1.0 for maximum quality.
     */
    this._renderScale = options.renderScale ?? 0.5;
    // Padded internal render size (canvas × the overscan factor). All passes
    // work here; _crop maps it back to the canvas on the final draw.
    this._width = Math.round(this._canvasW * this._padFactor);
    this._height = Math.round(this._canvasH * this._padFactor);
    // Central-crop UV transform (scale.xy, offset.zw): padded → canvas. Identity
    // when overscan is 0. Recomputed by _updateCrop() on every size/overscan change.
    this._crop = new THREE.Vector4(1, 1, 0, 0);
    this._updateCrop();

    const mixedPrecision = RealtimeRaytracer._mixedMrtSupported(renderer.getContext());
    if (!mixedPrecision) {
      console.info("three-realtime-rt: mixed fp16/fp32 G-buffer not supported here — using fp32 for all targets.");
    }
    // Functional probe, not just a status check: WebKit (all iOS browsers)
    // reports the 2-attachment fp16 MRT complete but silently renders black,
    // which blanks the whole lighting pass. On such devices the lighting pass
    // runs single-attachment (0.3.x layout): the specular buffer is disabled
    // and blend surfaces degrade to opaque — everything else keeps working.
    this.specMRTSupported = RealtimeRaytracer._specMrtSupported(renderer);
    if (!this.specMRTSupported) {
      console.info(
        "three-realtime-rt: multi-attachment lighting buffer failed the draw probe here " +
          "(WebKit/iOS) — specular buffer disabled, alpha-blend surfaces render opaque."
      );
    }
    // Fragment-shader texture-unit budget. The lighting megakernel already binds
    // exactly the WebGL2-guaranteed minimum of 16 fragment samplers, so the
    // world-space 3D-texture-albedo feature's SECONDARY-ray path (an extra
    // sampler3D) can only be compiled in on a GPU that exposes >= 17. Primary
    // visibility (the G-buffer, which has ample headroom) samples the volume
    // regardless; only the traced GI/reflection bounce is gated on this. Most
    // desktop GPUs report 32.
    this._maxFragTexUnits = renderer.getContext().getParameter(
      renderer.getContext().MAX_TEXTURE_IMAGE_UNITS
    );
    this._volumeUnitWarned = false;

    this.gbuffer = new GBufferPass(this._width, this._height, { mixedPrecision });
    this.rtPass = new RTLightingPass(this._scaledW, this._scaledH, {
      specMRT: this.specMRTSupported,
    });
    this.denoisePass = new DenoisePass(this._scaledW, this._scaledH);
    // Separate à-trous instance for the specular buffer (its own ping-pong
    // targets, so the specular denoise cannot clobber the irradiance result).
    this.specDenoisePass = new DenoisePass(this._scaledW, this._scaledH, {
      blendIsSpec: true, // blend pixels here hold the behind-the-pane image
    });
    this.composite = new CompositePass();
    this.taaPass = new TAAPass(this._width, this._height);
    this._sceneColor = this._makeColorTarget(this._width, this._height);
    // Fullscreen blit used to carry history buffers across target reallocation
    // (renderScale steps / canvas resizes) instead of hard-clearing them.
    this._copyPass = new CopyPass();

    this.compiled = null;
    this.frame = 0;

    /** Debug view: 0 composite, 1 albedo, 2 normal, 3 irradiance, 4 worldPos, 5 emissive, 6 specular, 7 bvh cost */
    this.outputMode = 0;
    /**
     * BVH-cost heatmap scale (outputMode 7): the per-pixel shadow-ray node-visit
     * count is multiplied by this before the palette, so 1/costScale visits map
     * to the hot (white) end. Default 1/96 — ~96 visits saturate. Live-tunable
     * (the demo's "cost scale" slider drives it).
     */
    this.costScale = options.costScale ?? 1 / 96;
    /** Environment (sky) color used for GI rays that miss + composite background. */
    this.envColor = options.envColor ?? new THREE.Color(0.03, 0.04, 0.06);
    this.envIntensity = options.envIntensity ?? 1.0;
    /**
     * Ray offset epsilon. When not set explicitly it is auto-scaled from the
     * scene's size at compile time (dense scenes need a larger offset or
     * shadow rays self-intersect). Set it manually if you see acne (raise) or
     * light leaking through thin walls (lower).
     */
    this.eps = options.eps ?? 1e-3;
    this._autoEps = options.eps == null;
    /** Reproject accumulated lighting through camera motion (stage 2). */
    this.temporalReprojection = options.temporalReprojection ?? true;
    /** History length cap: higher = smoother but slower to react. 128 until
     *  0.12.0; lowered to 48 on the presets round's evidence (arena ghost@40
     *  -21% for +4% still-noise, and the blind video review called out 128's
     *  light-toggle lag). See REPORT_PRESETS.md "Defaults recommendation". */
    this.maxHistory = options.maxHistory ?? 48;
    /**
     * EXPERIMENTAL — MOTION-ADAPTIVE TEMPORAL RESPONSE. Default OFF, and with it
     * off every uniform below keeps the value it had before this option existed,
     * so the rendered frame is byte-identical to a build without the feature.
     *
     * The pipeline holds THREE independent temporal accumulators, and all three
     * are tuned for a parked camera:
     *   - the irradiance/specular EMA in RTLightingPass (capped by maxHistory)
     *   - the TAA resolve's history blend (taaBlend)
     *   - the ReSTIR direct-lighting reservoir (staleness cap restirMCap)
     * Under camera motion each one keeps feeding a stale estimate into a pixel
     * whose geometry has moved on, which is where post-motion residual comes
     * from. `motion` (0..1, read-only, see _updateMotion) measures how far the
     * frame moved this step; when motionAdaptive is on, each accumulator is
     * lerped toward its *Moving counterpart by that amount, so history is short
     * while the camera moves and long again the instant it stops.
     */
    this.motionAdaptive = options.motionAdaptive ?? false;
    /** EMA history cap at full motion (motionAdaptive only). */
    this.maxHistoryMoving = options.maxHistoryMoving ?? 6;
    /** TAA fresh-sample weight at full motion (motionAdaptive only). */
    this.taaBlendMoving = options.taaBlendMoving ?? 0.4;
    /**
     * ReSTIR reservoir staleness cap — how many samples' worth of confidence a
     * direct-lighting reservoir may carry before new candidates stop being able
     * to displace it.
     *
     * 16, lowered from 40 on measurement. The quality campaign's ghosting arm
     * varied one temporal store at a time and this was the only unconditional
     * win in the whole campaign — better on EVERY metric in BOTH scenes, for
     * ~0.3 ms (museum 42.78 -> 43.05 ms, cornell unchanged at 11.27):
     *
     *              rmse320      strafe in-motion err   post-motion ghost
     *   cornell    5.39 -> 4.92      9.13 -> 8.65        1.90 -> 1.25 (10 frames)
     *   museum     5.13 -> 4.70      6.89 -> 6.73        2.35 -> 2.13
     *
     * A 40-sample reservoir is simply staler than the rest of the pipeline: the
     * irradiance EMA it feeds is re-estimated far more often than once every 40
     * frames, so the extra "confidence" only buys resistance to change.
     */
    this.restirMCap = options.restirMCap ?? 16;
    /**
     * ReSTIR reservoir staleness cap at full motion (motionAdaptive only).
     * Defaults to whatever restirMCap is, so this axis stays inert unless an app
     * opts in — the two were both 40 before restirMCap moved to 16, and a
     * *Moving value LONGER than the parked one would be an inversion.
     */
    this.restirMCapMoving = options.restirMCapMoving ?? this.restirMCap;
    /**
     * Screen motion (in UV) that counts as "full motion" for the lerp above.
     * 0.015 = the frame content moved 1.5% of the screen in one step, which at
     * 60fps is a brisk-but-normal orbit.
     */
    this.motionRefUv = options.motionRefUv ?? 0.015;
    /** Read-only: this frame's normalized camera motion, 0 (still) .. 1. */
    this.motion = 0;
    this._vpNow = new THREE.Matrix4();
    this._vpPrevUnjittered = new THREE.Matrix4();
    this._motionValid = false;
    this._mv = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this._mq = new THREE.Quaternion();
    /**
     * EXPERIMENTAL — à-trous tap-spacing controls, both default 0 = shipped
     * behaviour. See DenoisePass.render. `denoiseMaxStep` caps the doubling
     * cascade; `denoiseStepJitter` (0..1) jitters the tap radius per frame so
     * the filter's periodic lattice has no fixed phase for TAA to preserve.
     */
    this.denoiseMaxStep = options.denoiseMaxStep ?? 0;
    this.denoiseStepJitter = options.denoiseStepJitter ?? 0;
    /** EXPERIMENTAL — wavelet shrinkage of the coarse à-trous passes; 0 = off. */
    this.denoiseWideDamp = options.denoiseWideDamp ?? 0;
    /** Clamp on indirect luminance to suppress fireflies. 0 disables. */
    this.fireflyClamp = options.fireflyClamp ?? 4.0;
    /** 1-bounce global illumination (traced indirect). Toggle for a direct-only look. */
    this.gi = options.gi ?? true;
    /**
     * Half-rate GI: trace the bounce on alternating checkerboard parity each
     * frame (doubled — unbiased, temporal accumulation converges to the same
     * brightness). Halves GI's ray cost for a small convergence-speed hit;
     * the cheapest way to keep GI "worth turning on" on weaker GPUs.
     */
    this.giHalfRate = options.giHalfRate ?? false;
    /**
     * Sample static emissive meshes as area lights (next-event estimation).
     * Dramatically less noise than waiting for GI rays to hit the emitter, and
     * emitters gain direct lighting + shadows. Off = legacy hit-only behaviour.
     */
    this.emissiveNEE = options.emissiveNEE ?? true;
    /**
     * Importance-sample WHICH emissive triangle NEE shoots at, proportional to
     * area x emitted luminance (a compile-time power CDF), instead of a uniform
     * 1-of-N pick. Same mean, far less sparkle in scenes whose emitters differ
     * in size/brightness. Off = legacy uniform pick (A/B comparison hook).
     */
    this.emissiveImportance = options.emissiveImportance ?? true;
    /**
     * PBR direct specular: Cook-Torrance GGX highlights for all surfaces, in a
     * separate specular buffer added without the albedo multiply (dielectric
     * highlights are white, F0 ~= 0.04). Off = the old Lambert-only look.
     */
    this.specular = options.specular ?? true;
    /** Traced mirror/glossy reflections on metallic surfaces. */
    this.reflections = options.reflections ?? true;
    /** Traced refraction for transmissive (MeshPhysicalMaterial.transmission) surfaces. */
    this.refraction = options.refraction ?? true;
    /**
     * Alpha-blended transparency: a `transparent: true` mesh is primary-visible
     * but kept out of the BVH, and the lighting pass traces a straight-through
     * ray to composite the geometry behind it (weighted by `opacity`, tinted by
     * the pane's albedo). Default ON — it fixes silently-wrong behaviour and
     * costs only on blend pixels. Off = blend surfaces render fully opaque.
     */
    this.transparency = options.transparency ?? true;
    /**
     * Coloured shadows: shadow rays crossing an ABSORBING glass material are
     * attenuated exp(-sigma*d) per channel instead of blocked. Backing field for
     * the accessor below (which recompiles the lighting megakernel); assigned
     * directly here because the pass does not exist yet at this point in the
     * constructor and compileScene pushes the state anyway.
     */
    this._absorptionShadows = options.absorptionShadows ?? true;
    /**
     * Kubelka-Munk two-flux scattering: physically-parameterized translucent
     * solids (jade, wax, marble, soap, foliage, a lampshade, pigmented plastic)
     * whose reflectance and transmittance are computed from a per-material
     * absorption K and scattering S over the thickness the view ray actually
     * travels through the real geometry. Backing field for the accessor below
     * (which recompiles the lighting megakernel); assigned directly here for the
     * same reason absorptionShadows is.
     *
     * Default OFF, unlike absorptionShadows: this one changes how opted-in
     * materials LOOK rather than fixing a wrong result, so it stays an explicit
     * choice. With it off — or in a scene where no material set
     * userData.rtScattering — the compiled program is byte-identical to 0.9.0's.
     */
    this._kmScattering = options.kmScattering ?? false;
    /**
     * Texture-tile sampling for secondary rays: when enabled AND the compiled
     * scene has textured materials, map/emissiveMap texels are sampled at
     * secondary hit points (through glass, reflections, GI bounces). Rides the
     * existing scene-data texture (rows 69+). When `false` or the scene has no
     * textured materials, the shader is byte-identical to today's.
     * `{ size: 128, max: 16 }` or `false` to disable entirely.
     */
    this._textureTiles = options.textureTiles ?? false;
    /** Index of refraction used for transmissive surfaces. */
    this.ior = options.ior ?? 1.5;
    /**
     * Chromatic dispersion strength for glass (0..0.5, clamped on upload,
     * default 0 = off). Splits refracted white light into a spectrum: each
     * frame every glass pixel estimates ONE colour channel through a
     * channel-shifted ior and the temporal accumulator blends the three into a
     * rainbow (stochastic spectral sampling — no extra rays). It shimmers
     * slightly while converging, so it needs temporal accumulation to settle.
     * Global control only for now (there is no free G-buffer channel for a
     * per-material MeshPhysicalMaterial.dispersion).
     */
    this.dispersion = options.dispersion ?? 0;
    /**
     * One stochastic direct shadow ray per pixel per frame (source picked at
     * random) instead of one per light — the biggest ray-count lever for
     * many-light scenes and mobile GPUs. Slightly noisier moving shadows;
     * temporal accumulation + the denoiser absorb it. Defaults ON so the
     * zero-config renderer stays cheap on weak GPUs; the governor turns it off
     * again once it has scaled resolution up on a strong machine.
     */
    this.stochasticLights = options.stochasticLights ?? true;
    /**
     * Adaptive quality governor: watches the app's real frame time and walks
     * QUALITY_LADDER — degrading when frames run long, cautiously probing a
     * better level when there is headroom (reverting if the probe fails). The
     * portable way to "work well" on unknown hardware. Drives renderScale,
     * denoiseIterations and stochasticLights; setting those manually while
     * enabled will be overridden — turn this off for manual control. Defaults
     * ON so the conservative default resolution scales UP toward targetFps on
     * capable hardware instead of being stuck low.
     */
    this.adaptiveQuality = options.adaptiveQuality ?? true;
    /** Frame-rate target for the adaptive governor. */
    this.targetFps = options.targetFps ?? 55;
    /**
     * Emergency overload brake — independent of adaptiveQuality and ON by
     * default. Two protections: an oversized first buffer gets its lighting
     * scale clamped (with a loud warning), and consecutive catastrophic
     * frames (>400ms) force quality down before the GPU driver gives up.
     * Weak GPUs fed high settings can otherwise hang the whole machine
     * (observed: full system crash on an Intel-Mac in Chrome). Set
     * overloadProtection: false to opt out.
     */
    this.overloadProtection = options.overloadProtection ?? true;
    this._overloadStrikes = 0;
    this._obLastT = null;
    this._qEma = null;
    this._qLastT = null;
    this._qLastChange = 0;
    // Direction of the last committed quality change (+1 up / -1 down) and an
    // oscillation flag: when two consecutive steps reverse direction the
    // governor is hunting around the frame-time boundary, so it widens its
    // deadband and lengthens its cooldown to settle down (see _adaptQuality).
    this._qLastDir = 0;
    this._qOscillating = false;
    /**
     * The governor's FREE WINS: settings the quality campaign measured as
     * cheaper AND no worse (usually better) than the state they replace, so they
     * are spent BEFORE any resolution is given up. Null until taken; then it
     * holds the previous values plus the renderScale at which they were taken,
     * so the ascent can hand every one of them back (see _adaptQuality).
     */
    this._qFreeWins = null;
    // Consecutive adaptations that measured "comfortably fast". Only the free-win
    // release reads it — see _adaptQuality for why that one step needs a dwell.
    this._qFastStreak = 0;
    /**
     * Name of the quality preset governing this instance (constructor `preset`
     * option, or the last applyPreset() call). "custom" = no named preset has
     * been applied; a fresh instance's VALUES equal `balanced`, but that name
     * only sticks once the preset is applied. See the `preset` getter.
     */
    this._presetName = options.preset !== undefined ? String(options.preset) : "custom";
    /**
     * App-owned canvas-scale setter, driven by the governor as its deepest
     * lever once renderScale bottoms out. The app owns the canvas + CSS stretch,
     * so it must apply the buffer resize itself; null disables this level.
     */
    this.canvasScaleHook = options.canvasScaleHook ?? null;
    this._canvasLevelIdx = 0;
    /** Edge-aware à-trous denoise on the irradiance buffer. */
    this.denoise = options.denoise ?? true;
    /**
     * À-trous iterations (steps 1, 2, 4, ...). Defaults to a lean 2; the
     * adaptive governor raises it (via _qualityFor) as it lowers resolution,
     * where the extra passes run at lighting res and are nearly free.
     */
    this.denoiseIterations = options.denoiseIterations ?? 2;

    /**
     * Temporal anti-aliasing: sub-pixel projection jitter + a full-res history
     * resolve with neighbourhood clamp. Supersamples silhouettes over time and
     * clears the bright disocclusion speckles at edges. Analytic (FSR2 / TAAU
     * family), not a learned upscaler.
     */
    this.taa = options.taa ?? true;
    /** Fresh-sample weight in the TAA blend (lower = smoother/more AA, more lag). */
    this.taaBlend = options.taaBlend ?? 0.1;
    /**
     * Scales the TAA sub-pixel jitter amplitude. Set this to your canvas scale
     * when you render a reduced drawing buffer CSS-stretched to the screen
     * (canvasScaleHook), so the jitter stays constant in SCREEN pixels instead
     * of being magnified by the stretch (visible wobble at low quality).
     */
    this.taaJitterScale = options.taaJitterScale ?? 1;

    /**
     * Volumetric lighting — real "god rays": single-scatter fog integrated
     * along each primary ray with one jittered, BVH-shadowed light sample per
     * pixel per frame, temporally accumulated like the surface lighting.
     * Shafts are carved by actual occluders and work for off-screen sources.
     * Off by default; costs roughly one extra shadow ray per lighting pixel.
     */
    this.volumetric = {
      enabled: options.volumetric?.enabled ?? false,
      density: options.volumetric?.density ?? 0.015,
      maxDist: options.volumetric?.maxDist ?? 40,
      // Localized fog: up to 8 AABBs whose densities ADD to the global term at
      // any point they contain. Empty = global-only (original behavior).
      zones: options.volumetric?.zones ?? [],
    };
    // Quarter CANVAS resolution, independent of renderScale: fog is
    // low-frequency, so resolution buys nothing — the budget goes into
    // multiple march steps per ray instead (see VolumetricPass).
    this.volumetricPass = new VolumetricPass(this._volW, this._volH);

    /**
     * ReSTIR direct lighting: per-pixel reservoirs converge onto the light
     * that matters most to each pixel (temporal reuse, one visibility ray at
     * shading). Cost is flat in light count; also greatly reduces emissive
     * area-light noise. On by default — turn off to compare estimators.
     */
    this.restir = options.restir ?? true;
    this.restirPass = new RestirPass(this._scaledW, this._scaledH);

    /**
     * EXPERIMENTAL — ReSTIR GI (v1, temporal-only): per-pixel reservoirs reuse
     * the 1-bounce global-illumination sample across frames (at the reprojected
     * same-surface point, no spatial reuse / no Jacobian). Runs in a standalone
     * pass with its own sampler budget; when on, the lighting pass skips its
     * inline GI trace and this pass's resolved GI is added at the denoise stage.
     * Only meaningful when `gi` is on, and injected via the à-trous denoise, so
     * it requires `denoise` (denoiseIterations >= 1). Default OFF. Its mean
     * matches the inline GI path — see GIReservoirPass. Live-toggleable.
     */
    this.restirGI = options.restirGI ?? false;
    /** Temporal M-cap for the ReSTIR GI reservoir (staleness limit). */
    this.restirGIMCap = options.restirGIMCap ?? 20;
    /**
     * ReSTIR GI (v2) spatial-reuse taps per frame, taken after the temporal
     * merge from the previous frame's reservoirs (reconnection-Jacobian
     * reweighted, with a final visibility ray). Clamped to 0..4; `0` reproduces
     * the v1 temporal-only behaviour. Default 2.
     */
    // Default 2. It was lowered to 1 because "each reconnection tap adds its own
    // estimator noise" — true of the old resolve, where an adopted neighbour
    // SWAPPED IN a different sample's colour, so every tap was a fresh chance to
    // draw the wrong one. restirGIChromaMean inverts that: a tap is now folded
    // into the resolve's chromaticity mean by its own RIS weight, so it is extra
    // averaged evidence, and the resolve gets cleaner with every tap. Measured on
    // Cornell (2026-07-27), raw-resolve chromaticity spread by tap count:
    // 0.089 / 0.062 / 0.051 / 0.045 for 1 / 2 / 3 / 4 taps, at 8.9 / 9.0 / 9.1 /
    // 9.2 ms. 2 is where the curve flattens.
    this.restirGISpatialTaps = options.restirGISpatialTaps ?? 2;
    /**
     * EXPERIMENTAL — ReSTIR GI reservoir-sample validation period. Every frame a
     * rotating 1-in-N subset of pixels (decorrelated by a per-pixel hash) re-aims
     * its ONE candidate ray at the reservoir's STORED hit instead of a fresh
     * cosine bounce and re-shades it; the reservoir is killed (so fresh candidates
     * rebuild) when the geometry moved or the re-shaded target collapsed to
     * near-black (a light switched off), and left untouched otherwise. This reuses
     * the existing candidate trace (no extra bounce rays) and is the fix for stale
     * bounce light: a switched-off light stops haunting the reservoir instead of
     * fading slowly, while a static scene does not drift. `0` disables it
     * (byte-identical to before the feature); default 8.
     */
    this.restirGIValidate = options.restirGIValidate ?? 8;
    /**
     * EXPERIMENTAL — weight of THIS frame's resolve in the resolve EMA; 1 = no
     * EMA, which is now the default.
     *
     * The EMA was added to damp near-emitter selection churn, but its partner is
     * a reconstruction of the PREVIOUS frame's TEMPORAL-ONLY resolve — a noisier
     * estimator than the spatially-merged one it is smoothing — carried at 0.85
     * weight, so it added variance instead of removing it. Measured on Cornell
     * (2026-07-27) at otherwise-identical settings, raw-resolve high-pass noise
     * was 50% of the mean at alpha 0.35 against 26% at alpha 1, and the on-minus-
     * off chroma artifact 0.68x against 0.60x of the pre-fix baseline, with still
     * noise unchanged (0.178 vs 0.180). What the EMA was for — the colour of the
     * selected sample jumping frame to frame — is what restirGIChromaMean now
     * removes at the source, so the smoothing has nothing left to do.
     */
    this.restirGIResolveAlpha = options.restirGIResolveAlpha ?? 1.0;
    /**
     * EXPERIMENTAL — firefly-clamp multiplier at zero reservoir confidence;
     * relaxes to 1 as M reaches the cap.
     */
    this.restirGIConfLow = options.restirGIConfLow ?? 0.3;
    /**
     * EXPERIMENTAL — Rao-Blackwellized ReSTIR GI resolve colour. The resolve's
     * luminance is algebraically a running mean over the reservoir's whole
     * history, but its COLOUR was the chromaticity of one stochastically
     * selected sample — measured at 37% per-pixel spread, which the à-trous
     * filter turns into coarse coloured blotches (and which rmse cannot see,
     * because the mean colour is right). With this on, the resolve uses the
     * RIS-weighted MEAN chromaticity instead: same mean, far lower variance, no
     * extra ray, sampler or storage. Default ON; `false` restores the old path.
     */
    this.restirGIChromaMean = options.restirGIChromaMean ?? true;
    /**
     * EXPERIMENTAL — ReSTIR GI final-visibility policy. Old behaviour tested the
     * selected sample whatever its origin and zeroed the whole pixel on a hit.
     * With this on, only a SPATIALLY adopted sample is tested (a temporal one is
     * visible by construction), and a rejection falls back to this pixel's
     * temporal-only estimate instead of to black. Default ON; `false` restores
     * the old path.
     */
    this.restirGIVisFallback = options.restirGIVisFallback ?? true;
    this.giReservoirPass = new GIReservoirPass(this._scaledW, this._scaledH);
    this._giMissWarned = false;

    /** Distance fog (composited in linear space before tonemap). */
    this.fog = {
      enabled: options.fog?.enabled ?? false,
      color: options.fog?.color ?? new THREE.Color(0.5, 0.6, 0.7),
      density: options.fog?.density ?? 0.05,
    };

    /**
     * Procedural sky. When enabled it is BOTH the background and the ambient
     * light for GI rays that escape the scene — the core of natural outdoor
     * lighting. `sunDir` points toward the sun (keep it in sync with your
     * DirectionalLight for matching direct shadows).
     */
    this.sky = {
      enabled: options.sky?.enabled ?? false,
      sunDir: options.sky?.sunDir ?? new THREE.Vector3(0.4, 0.8, 0.45).normalize(),
      sunColor: options.sky?.sunColor ?? new THREE.Color(1.0, 0.9, 0.75),
      zenith: options.sky?.zenith ?? new THREE.Color(0.18, 0.34, 0.62),
      horizon: options.sky?.horizon ?? new THREE.Color(0.7, 0.8, 0.9),
      intensity: options.sky?.intensity ?? 1.0,
    };
    this._invViewProj = new THREE.Matrix4();
    this._jitterIndex = 0;
    this._jitteredViewProj = new THREE.Matrix4();
    this._jitterUv = new THREE.Vector2(); // this frame's jitter in UV space
    this._prevJitterUv = new THREE.Vector2();

    this._prevViewProj = new THREE.Matrix4();
    this._camWorldPos = new THREE.Vector3();
    this._needsClear = true;

    // First-frame guard: a 4K/5K drawing buffer at high lighting scale can
    // hang a weak GPU on the very first frame — before any frame-time
    // measurement can react. Start those safe; adaptiveQuality (or the app)
    // can raise quality once frames are proven survivable.
    if (this.overloadProtection && this._width * this._height > 3.2e6 && this._renderScale > 0.375) {
      console.warn(
        `three-realtime-rt: ${(this._width * this._height / 1e6).toFixed(1)}M-pixel drawing buffer — ` +
          `clamping lighting renderScale to 0.375 (overloadProtection). Raise renderScale manually, ` +
          `enable adaptiveQuality, or pass overloadProtection: false to opt out.`
      );
      this._renderScale = 0.375;
    }

    // ---- compile-failure status surface -----------------------------------
    // The pipeline is a stack of ShaderMaterial passes; a program that fails to
    // LINK renders black with no exception (three logs to the console and sets
    // program.diagnostics.runnable=false, but rendering proceeds). Before this,
    // a broken pass looked identical to `supported:false` from the outside — the
    // failure that shipped the r166+ black image. These two fields let an
    // integrator render honestly ("raster (reason)") instead of guessing:
    //
    //   compileError : string | null
    //       First/most-severe failure summary ("rt:lighting: <driver log>"), or
    //       null while every rt:* pass is compiling clean.
    //   status : { ok, disabled, coreFailure }
    //       ok          false once ANY rt:* pass failed to link (a core pass, or
    //                   a feature that was auto-disabled). true = pipeline is
    //                   running as intended.
    //       disabled    [{ pass, feature, reason }] — optional features turned
    //                   off to keep the image lit (e.g. taa, denoise, restir).
    //       coreFailure string | null — a core pass (gbuffer/lighting/composite)
    //                   failed and has no fallback; the image is black-but-diagnosed.
    //       warnings    [{ code, message }] — USAGE diagnostics (a flag that is
    //                   being ignored, an object type that cannot be traced, a
    //                   static mesh edited after compileScene()). Each is also
    //                   console.warn'd once. These never affect `ok`: the
    //                   pipeline is healthy, the SCENE SETUP is not what the app
    //                   probably intended.
    this.compileError = null;
    this.status = { ok: true, disabled: [], coreFailure: null, warnings: [] };
    this._diagDone = false; // set once the polling window settles
    this._diagFrames = 0; // rendered frames scanned so far
    this._diagStable = 0; // consecutive scans with an unchanged rt:* program set
    this._diagSig = ""; // signature of the rt:* program-name set last scan
    this._diagHandled = new Set(); // rt:* names already acted on (warn-once)
    this._compileErrSev = -1; // severity behind the current compileError (2/1/0)

    // Usage-diagnostic state (see _checkStale / _warn).
    this._staleDone = false; // nothing left worth scanning
    this._staleWarnings = 0; // stale reports emitted (capped)
    this._implicitCompileWarned = false;
  }

  /**
   * Name of the preset governing this instance. Returns the LAST preset name
   * applied (constructor `preset` option, or applyPreset()), or "custom" when no
   * named preset has been applied. Deliberately LAST-APPLIED-NAME only: a knob
   * the adaptive governor or a manual assignment changes afterwards does not
   * flip this back to "custom" (a preset sets the baseline the governor breathes
   * around, so its own moves are not "customizing"). See REPORT_PRESETS.md.
   */
  get preset() {
    return this._presetName;
  }

  /**
   * Apply a named quality preset (see {@link PRESETS}) to this LIVE instance.
   * Every bundled knob is live-tunable  -  none needs compileScene  -  so this is
   * safe to call at any time, including mid-frame. Because a preset changes the
   * cost profile AND the baseline the adaptive governor breathes around, it
   * re-arms the governor at the new baseline (its EMA, cooldown and free-win
   * state are reset so it measures the new settings fresh). Explicit per-option
   * constructor values always win over a constructor `preset`; there is no
   * equivalent per-knob override here  -  the preset IS the bundle, apply it and
   * then assign the knob you want to differ.
   *
   * @param {string} name one of the keys of {@link PRESETS}
   * @returns {this} for chaining
   * @throws {Error} for an unknown name, listing the valid presets.
   */
  applyPreset(name) {
    const preset = RealtimeRaytracer.PRESETS[name];
    if (!preset) {
      throw new Error(
        `three-realtime-rt: unknown preset "${name}". ` +
          `Valid presets: ${Object.keys(RealtimeRaytracer.PRESETS).join(", ")}.`
      );
    }
    for (const key of Object.keys(preset)) {
      const value = preset[key];
      // A preset may carry a PARTIAL object (e.g. performance sets only
      // `volumetric.enabled`). Merge into the live object so the untouched
      // fields (density, maxDist, zones) survive; scalar knobs assign directly
      // (renderScale's setter reallocates lighting targets, carrying history).
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        this[key] &&
        typeof this[key] === "object"
      ) {
        Object.assign(this[key], value);
      } else {
        this[key] = value;
      }
    }
    this._presetName = name;
    this._rearmGovernor();
    return this;
  }

  // Re-arm the adaptive governor: a preset changes the cost profile AND the
  // baseline the governor breathes around, so the EMA / cooldown / free-win
  // state accumulated under the OLD baseline is stale. Reset it so the next
  // adaptation measures the new settings fresh instead of comparing them to an
  // average from before the switch.
  _rearmGovernor() {
    this._qEma = null;
    this._qLastT = null;
    this._qLastChange = 0;
    this._qLastDir = 0;
    this._qOscillating = false;
    this._qFastStreak = 0;
    this._qFreeWins = null;
    if (this.adaptiveQuality) {
      console.info(
        `three-realtime-rt: preset "${this._presetName}" applied  -  ` +
          "adaptive quality re-armed at this baseline."
      );
    }
  }

  // Classify an rt:* pass program by how a LINK failure degrades. CORE passes
  // have no fallback (record and keep rendering the black result so it is
  // DIAGNOSED, not silent). Optional passes map to the EXACT runtime toggle that
  // already gates them, so disabling one keeps the image lit. Unknown rt:* names
  // (history-carry blits) are auxiliary: non-fatal, warn only. Returns one of
  // { core:true } | { feature, disable } | { aux:true }.
  _passClass(name) {
    switch (name) {
      case "rt:gbuffer":
      case "rt:lighting":
      case "rt:composite":
        return { core: true };
      case "rt:restir-temporal":
      case "rt:restir-spatial":
        return { feature: "restir", disable: () => { this.restir = false; } };
      case "rt:gi-reservoir":
        return { feature: "restirGI", disable: () => { this.restirGI = false; } };
      case "rt:denoise":
        return { feature: "denoise", disable: () => { this.denoise = false; } };
      case "rt:volumetric":
        return { feature: "volumetric", disable: () => { this.volumetric.enabled = false; } };
      case "rt:taa":
      case "rt:taa-copy":
        return { feature: "taa", disable: () => { this.taa = false; } };
      case "rt:specular":
        return { feature: "specular", disable: () => { this.specular = false; } };
      default:
        return { aux: true };
    }
  }

  // Compact one-line driver message from three's program.diagnostics. The
  // GLSL-frontend error lives in the fragment (or vertex) shader log; programLog
  // is the linker fallback. First line, capped, so it fits a console.warn / a UI.
  _diagLog(diag) {
    const pick = [
      diag && diag.fragmentShader && diag.fragmentShader.log,
      diag && diag.vertexShader && diag.vertexShader.log,
      diag && diag.programLog,
    ].find((s) => s && s.trim());
    return (pick || "(no driver log)").trim().split("\n")[0].slice(0, 200);
  }

  // Keep compileError at the FIRST failure of the HIGHEST severity seen
  // (core 2 > feature 1 > aux 0): a later core failure overrides an earlier
  // feature summary, but two failures of equal severity keep the first.
  _noteCompileError(summary, severity) {
    if (severity > this._compileErrSev) {
      this.compileError = summary;
      this._compileErrSev = severity;
    }
  }

  // Act on one failed rt:* program (called at most once per pass name).
  _handleFailedProgram(name, diag) {
    const log = this._diagLog(diag);
    const cls = this._passClass(name);
    const summary = `${name}: ${log}`;
    this.status.ok = false;
    if (cls.core) {
      if (!this.status.coreFailure) this.status.coreFailure = summary;
      this._noteCompileError(summary, 2);
      console.warn(
        `three-realtime-rt: core pass ${name} failed to link — the image will ` +
          `be black (no fallback for a core pass). Driver log: ${log}`
      );
    } else if (cls.feature) {
      cls.disable();
      this.status.disabled.push({ pass: name, feature: cls.feature, reason: log });
      this._noteCompileError(summary, 1);
      console.warn(
        `three-realtime-rt: pass ${name} failed to link — auto-disabled ` +
          `"${cls.feature}" to keep the image lit. Driver log: ${log}`
      );
    } else {
      this._noteCompileError(summary, 0);
      console.warn(
        `three-realtime-rt: auxiliary pass ${name} failed to link (non-fatal — ` +
          `resize history is not carried). Driver log: ${log}`
      );
    }
  }

  // Scan renderer.info.programs for failed rt:* pass programs. Called each frame
  // until the window settles (see the DIAG_* constants). Cheap: ~a dozen entries,
  // string prefix check, warn-once via _diagHandled.
  _scanPrograms() {
    if (this._diagDone) return;
    const programs = this.renderer.info && this.renderer.info.programs;
    if (!programs) { this._diagDone = true; return; }
    this._diagFrames++;
    let names = "";
    for (const p of programs) {
      const name = p && p.name;
      if (!name || name.slice(0, 3) !== "rt:") continue;
      names += name + "|";
      const diag = p.diagnostics; // set at first USE; runnable:false = link failed
      if (diag && diag.runnable === false && !this._diagHandled.has(name)) {
        this._diagHandled.add(name);
        this._handleFailedProgram(name, diag);
      }
    }
    // Early-out: the rt:* program set has stopped growing and nothing new failed
    // for DIAG_STABLE_FRAMES past the warmup floor → every active pass has been
    // seen and validated. Otherwise stop at the hard window.
    if (names === this._diagSig) this._diagStable++;
    else { this._diagStable = 0; this._diagSig = names; }
    if (
      (this._diagFrames >= RealtimeRaytracer.DIAG_MIN_FRAMES &&
        this._diagStable >= RealtimeRaytracer.DIAG_STABLE_FRAMES) ||
      this._diagFrames >= RealtimeRaytracer.DIAG_WINDOW_FRAMES
    ) {
      this._diagDone = true;
    }
  }

  // Consecutive catastrophic frames mean the GPU is drowning — cut quality
  // hard and loudly before the driver resets (or takes the machine with it).
  // Hidden tabs are exempt (browser throttling looks like huge frame times).
  _overloadBrake() {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      this._obLastT = null;
      return;
    }
    const now = performance.now();
    const dt = this._obLastT == null ? null : now - this._obLastT;
    this._obLastT = now;
    if (dt == null) return;
    if (dt > 400 && dt < 10000) this._overloadStrikes++;
    else if (dt < 200) this._overloadStrikes = 0;
    if (this._overloadStrikes < 3) return;
    this._overloadStrikes = 0;

    if (this._renderScale > 0.2) {
      this.denoiseIterations = Math.min(this.denoiseIterations, 3);
      this.stochasticLights = true;
      this.renderScale = Math.max(0.2, Math.round(this._renderScale * 0.5 * 20) / 20);
      console.warn(
        `three-realtime-rt: frames exceeding 400ms — overload brake cut lighting to ` +
          `${Math.round(this._renderScale * 100)}%. Lower your canvas resolution or enable adaptiveQuality.`
      );
    } else if (this.volumetric.enabled || this.reflections || this.refraction) {
      this.volumetric.enabled = false;
      this.reflections = false;
      this.refraction = false;
      console.warn(
        "three-realtime-rt: still overloaded at minimum lighting scale — " +
          "disabling volumetric/reflections/refraction."
      );
    }
  }

  // ---- usage diagnostics (status.warnings) ---------------------------------
  // A usage warning is console.warn'd ONCE and recorded on status.warnings so a
  // UI (or an automated check) can read the same signal. `ok` is untouched: the
  // pipeline is fine, the scene setup is what looks wrong. Duplicate
  // code+message pairs are collapsed so a recompile can't grow the array.
  _warn(code, message) {
    console.warn(message);
    this._recordWarning(code, message);
  }

  _recordWarning(code, message) {
    const list = this.status && this.status.warnings;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      if (list[i].code === code && list[i].message === message) return;
    }
    list.push({ code, message });
  }

  // Mirror the compiler's usage diagnostics onto the status surface. The
  // compiler already wrote them to the console (once per offending object);
  // this only makes them readable.
  _absorbCompilerWarnings(compiled) {
    const w = compiled && compiled.warnings;
    if (!w || w.length === 0) return;
    for (let i = 0; i < w.length; i++) this._recordWarning(w[i].code, w[i].message);
  }

  // Detect a STATIC mesh that was edited after compileScene(): its vertices were
  // deformed, or it was moved. Either way the traced lighting still uses the
  // shape/place baked into the static BVH, which reads as "the shadow doesn't
  // move" or "rays still hit the original shape" — the single most common
  // integration mistake, and completely silent before this.
  //
  // Cost: runs on every STALE_CHECK_FRAMES-th frame only, over a plain array of
  // fingerprints, with no allocation; each source is checked until it warns once
  // (or its mesh is collected), and the whole scan switches off when nothing is
  // left to report or the warning cap is reached.
  _checkStale() {
    if (this._staleDone) return;
    const srcs = this.compiled && this.compiled.staticSources;
    if (!srcs || srcs.length === 0) { this._staleDone = true; return; }
    let live = 0;
    for (let i = 0; i < srcs.length; i++) {
      const s = srcs[i];
      if (s.warned) continue;
      const mesh = s.ref.deref();
      if (!mesh) { s.warned = true; continue; } // collected — nothing to report
      let stale = null;
      const geo = mesh.geometry;
      const pos = geo ? geo.getAttribute("position") : null;
      if (!pos || pos.version !== s.version) {
        stale = "geometry";
      } else {
        // Relative tolerance rather than an exact compare: an app that rebuilds
        // an unchanged transform each frame (setFromEuler, a physics engine
        // writing back the same pose) can land a few ULPs away, and a sub-micron
        // "move" is not what this diagnostic is about.
        const e = mesh.matrixWorld.elements;
        const m = s.matrix;
        for (let k = 0; k < 16; k++) {
          const d = e[k] - m[k];
          if ((d < 0 ? -d : d) > 1e-6 * (1 + (m[k] < 0 ? -m[k] : m[k]))) {
            stale = "transform";
            break;
          }
        }
      }
      if (!stale) { live++; continue; }
      s.warned = true;
      this._staleWarnings++;
      if (stale === "geometry") {
        this._warn(
          "stale-geometry",
          `three-realtime-rt: position buffer of ${s.name} changed after compileScene() ` +
            `but it is not a dynamic mesh — traced lighting still uses the ORIGINAL shape. ` +
            `Add it to compileScene(scene, {dynamicMeshes:[...]}) and set ` +
            `mesh.userData.rtDeforming = true, then call updateDynamic() each frame.`
        );
      } else {
        this._warn(
          "stale-transform",
          `three-realtime-rt: ${s.name} was moved after compileScene() but it is not a ` +
            `dynamic mesh — traced lighting still uses the ORIGINAL transform (its shadow ` +
            `stays behind). Recompile with compileScene(scene), or declare it in ` +
            `compileScene(scene, {dynamicMeshes:[...]}) and call updateDynamic() each frame.`
        );
      }
      if (this._staleWarnings >= RealtimeRaytracer.MAX_STALE_WARNINGS) {
        this._staleDone = true; // enough — do not flood the console
        return;
      }
    }
    if (live === 0) this._staleDone = true;
  }

  _makeColorTarget(width, height) {
    const t = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    t.texture.generateMipmaps = false;
    return t;
  }

  /**
   * Build/rebuild BVH + material and light tables from the scene. Call after
   * structural scene changes. Pass `{ dynamicMeshes: [...] }` to mark meshes
   * whose transforms will change every frame (drive them with updateDynamic()).
   */
  compileScene(scene, options) {
    if (!this.supported) return null;
    // "Construct the tracer, then add meshes" is a natural call order, so a
    // scene with no traceable meshes is a NO-OP, not a throw: warn once and keep
    // any previously compiled scene. Compile the new scene BEFORE disposing the
    // old one so an empty-scene call never destroys a good scene. Only the
    // SceneCompiler's specific "no meshes" signal is swallowed here; every other
    // compile error (bad geometry, oversized attribute) still propagates.
    // Merge instance-level textureTiles into compileScene options so the CPU-side
    // tile build and stride-2 layout follow the constructor setting. An explicit
    // option passed to compileScene wins over the instance default.
    const compileOpts = options?.textureTiles !== undefined
      ? options
      : { ...options, textureTiles: this._textureTiles };
    let compiled;
    try {
      compiled = compileScene(scene, compileOpts);
    } catch (err) {
      if (/no meshes found/.test(String(err && err.message))) {
        if (!this._emptyWarned) {
          console.warn(
            "three-realtime-rt: compileScene() called on a scene with no traceable " +
              "meshes — keeping the current scene. Until meshes are added and " +
              "recompiled, render() falls back to plain rasterization (no crash, no black)."
          );
          this._emptyWarned = true;
        }
        return this.compiled; // unchanged (may still be null)
      }
      throw err;
    }
    if (this.compiled) this.compiled.dispose();
    this.compiled = compiled;
    // Usage diagnostics raised while compiling (already console.warn'd once per
    // offending object) become readable on status.warnings. A fresh compile also
    // re-arms the staleness scan against the NEW fingerprints.
    this._absorbCompilerWarnings(compiled);
    this._staleDone = false;
    // Emissive area lights are the noisiest direct-light path: one triangle
    // sample per pixel per frame, and the 1/dist^2 term spikes near a small
    // emitter (fireflies). ReSTIR's reservoirs are what tame this — warn when
    // a scene relies on emissive NEE without them. (fireflyClamp and the
    // denoiser absorb the rest; see the README's emissive caveats.)
    if (this.compiled.emissiveTriCount > 0 && this.emissiveNEE && !this.restir) {
      console.info(
        "[three-realtime-rt] this scene has emissive area lights but restir is off — " +
          "emissive NEE alone is the noisiest sampling path; enable restir for a large noise win."
      );
    }
    if (this._autoEps) {
      // ~1/1000 of the scene diagonal, floored at the classic 1e-3.
      this.eps = Math.min(Math.max(1e-3, this.compiled.sceneDiagonal * 1.2e-3), 0.05);
    }
    // Coloured shadows are an AND with absorption inside the pass, so push the
    // caller's flag BEFORE setCompiledScene decides the splice from
    // compiled.absorption — otherwise a recompile would silently re-enable them.
    this.rtPass.setAbsorptionShadows(this._absorptionShadows);
    // Same ordering rule for Kubelka-Munk: push the caller's flag BEFORE
    // setCompiledScene reads the new scene's scattering table and performs the
    // single splice, so a recompile can neither enable nor drop the feature
    // behind the app's back.
    this.rtPass.setKmScattering(this._kmScattering);
    // Texture tiles likewise: push the caller's flag before the splice.
    this.rtPass.setTextureTiles(this._textureTiles);
    this.giReservoirPass.setTextureTiles(this._textureTiles);
    this.rtPass.setCompiledScene(this.compiled);
    this.volumetricPass.setCompiledScene(this.compiled);
    this.restirPass.setCompiledScene(this.compiled);
    this.giReservoirPass.setCompiledScene(this.compiled);
    this._syncVolumeAlbedo();
    this.resetAccumulation();
    return this.compiled;
  }

  /**
   * Push the compiled scene's world-space 3D-texture albedo (if any) into the
   * passes. Primary visibility (G-buffer) always gets it — it has spare samplers.
   * The traced SECONDARY-ray path (GI/reflection colour) needs a 17th fragment
   * sampler, so it is only enabled on a GPU that exposes one; on a bare-minimum
   * 16-unit device the bounces fall back to the material's flat table albedo
   * (primary visibility still shows the full field), logged once.
   */
  _syncVolumeAlbedo() {
    const vol = this.compiled ? this.compiled.volumeAlbedo : null;
    this.gbuffer.setVolume(!!vol);
    const secondaryOk = !!vol && this._maxFragTexUnits >= 17;
    // NOTE: only the inline-GI lighting pass (rtPass.traceRadiance) samples the
    // volume for the traced bounce. The experimental ReSTIR GI pass
    // (giReservoirPass, off by default) has its own GI kernel and is NOT wired
    // for volume albedo in v1 — a volume surface's indirect bounce falls back to
    // its flat table colour while restirGI is on (documented limitation).
    this.rtPass.setVolumeAlbedo(secondaryOk ? vol : null);
    if (vol && !secondaryOk && !this._volumeUnitWarned) {
      this._volumeUnitWarned = true;
      console.info(
        "[three-realtime-rt] volume albedo: this GPU exposes only " +
          `${this._maxFragTexUnits} fragment texture units (< 17 needed for the ` +
          "traced-bounce sampler), so GI / reflection bounces use the material's flat " +
          "base colour. Primary visibility still shows the full 3D-texture field."
      );
    }
  }

  /**
   * Re-bake moving (dynamic) meshes into the dynamic BVH level. Call each frame
   * after moving them. Only the dynamic level is touched — the static BVH was
   * uploaded once at compile time — so cost scales with the moving triangle
   * count, not the scene size.
   */
  updateDynamic() {
    if (this.compiled) this.compiled.updateDynamic();
  }

  /**
   * Refresh light positions/colors from the scene without a full recompile —
   * lets the demo toggle, move, and recolor lights live. Lights with intensity
   * 0 (or invisible) are dropped so they can be switched off.
   */
  updateLights(scene) {
    if (!this.supported || !this.compiled) return;
    syncLights(scene, this.compiled);
    this.rtPass.setTextureTiles(this._textureTiles);
    this.giReservoirPass.setTextureTiles(this._textureTiles);
    this.rtPass.setCompiledScene(this.compiled);
    this.volumetricPass.setCompiledScene(this.compiled);
    this.restirPass.setCompiledScene(this.compiled);
    this.giReservoirPass.setCompiledScene(this.compiled);
  }

  resetAccumulation() {
    if (!this.supported) return;
    this._needsClear = true;
    if (this.taaPass) this.taaPass.reset();
  }

  // Padded/canvas size ratio per axis: 1 + 2×overscan (padding is per edge).
  get _padFactor() {
    return 1 + 2 * this._overscan;
  }

  // Recompute the central-crop transform that maps the padded internal image
  // back to the canvas on the final draw. UV: canvas_uv × scale + offset →
  // padded_uv, sampling the central canvas-sized region. Identity at overscan 0.
  _updateCrop() {
    this._crop.set(
      this._canvasW / this._width,
      this._canvasH / this._height,
      (this._width - this._canvasW) * 0.5 / this._width,
      (this._height - this._canvasH) * 0.5 / this._height
    );
  }

  get _scaledW() {
    return Math.max(1, Math.floor(this._width * this._renderScale));
  }
  get _scaledH() {
    return Math.max(1, Math.floor(this._height * this._renderScale));
  }
  get _volW() {
    return Math.max(1, this._width >> 2);
  }
  get _volH() {
    return Math.max(1, this._height >> 2);
  }

  /**
   * Coloured shadows (see the constructor field). Live-assignable, but it swaps
   * the lighting megakernel's SOURCE — the same splice mechanism absorption
   * itself uses — so treat it as a settings-time knob, not a per-frame one: the
   * first frame after a change pays a shader compile. Meaningful only while the
   * compiled scene has an absorbing material; with none, the program is the
   * byte-identical no-absorption one either way.
   */
  get absorptionShadows() {
    return this._absorptionShadows;
  }
  set absorptionShadows(v) {
    const on = !!v;
    if (on === this._absorptionShadows) return;
    this._absorptionShadows = on;
    if (!this.supported) return;
    this.rtPass.setAbsorptionShadows(on);
    this.resetAccumulation();
  }

  /**
   * Kubelka-Munk two-flux scattering (see the constructor field). Live-assignable
   * but it swaps the lighting megakernel's SOURCE, so treat it as a settings-time
   * knob: the first frame after a change pays a shader compile. Meaningful only
   * while the compiled scene has a material carrying `userData.rtScattering`;
   * with none, the program is the byte-identical no-scattering one either way.
   *
   * Turning this on also turns on coloured shadows for the compiled program —
   * the two-flux transmittance is evaluated inside the very same shadow march,
   * so they are one code path, not two (`absorptionShadows` still reports what
   * the app asked for, and takes effect again the moment this goes off).
   */
  get kmScattering() {
    return this._kmScattering;
  }
  set kmScattering(v) {
    const on = !!v;
    if (on === this._kmScattering) return;
    this._kmScattering = on;
    if (!this.supported) return;
    this.rtPass.setKmScattering(on);
    this.resetAccumulation();
  }

  /**
   * Texture-tile sampling for secondary rays. When not `false` AND the compiled
   * scene has textured materials, per-texel albedo and emissive colour is sampled
   * at secondary hit points — a textured surface seen through glass, in a
   * reflection, or via a GI bounce shows its actual texel pattern rather than an
   * averaged flat colour. Pass `{ size: 128, max: 16 }` to configure (defaults
   * shown), or `false` to disable entirely. Takes effect on the next
   * `compileScene()`.
   */
  get textureTiles() {
    return this._textureTiles;
  }
  set textureTiles(v) {
    this._textureTiles = v !== false ? (v && typeof v === "object" ? v : { size: 128, max: 16 }) : false;
    // Attribute-texture layout changes need a recompile; the value is read by the
    // next compileScene() call. No live shader swap — stride-2 vs stride-1 is
    // structural.
  }

  get renderScale() {
    return this._renderScale;
  }
  set renderScale(v) {
    this._renderScale = v;
    this.setSize(this._canvasW, this._canvasH);
  }

  get overscan() {
    return this._overscan;
  }
  // Live-assignable like renderScale. Changing the padded size reallocates every
  // pass, so this hard-resets accumulation (a settings-time knob, not per-frame).
  set overscan(v) {
    const c = Math.min(0.25, Math.max(0, v || 0));
    if (c === this._overscan) return;
    this._overscan = c;
    this.setSize(this._canvasW, this._canvasH);
    this.resetAccumulation();
  }

  // Resize (or re-scale) the pipeline WITHOUT dumping temporal history. A
  // renderScale step only resizes the lighting-resolution targets; a genuine
  // canvas resize also resizes the full-res ones. Each history-bearing buffer
  // is carried over (resampled) rather than cleared — a hard reset here is what
  // strobed the image on every governor tick. Compares desired vs currently
  // allocated size per pass, so it is correct no matter when _renderScale was
  // updated (the renderScale setter changes it before calling us).
  setSize(width, height) {
    if (!this.supported) return;
    // Arguments are the CANVAS (on-screen) size; the internal targets are the
    // overscan-padded size derived from it. The only place the two diverge is
    // the final on-screen crop (see _crop / _updateCrop).
    this._canvasW = Math.floor(width);
    this._canvasH = Math.floor(height);
    this._width = Math.round(this._canvasW * this._padFactor);
    this._height = Math.round(this._canvasH * this._padFactor);
    this._updateCrop();

    const sw = this._scaledW;
    const sh = this._scaledH;
    const scaledChanged =
      this.rtPass.targetA.width !== sw || this.rtPass.targetA.height !== sh;
    const canvasChanged =
      this.taaPass.targetA.width !== this._width ||
      this.taaPass.targetA.height !== this._height;

    // Lighting-resolution targets (change on both a renderScale step and a
    // canvas resize). Carry the irradiance history — the buffer whose reset
    // causes the flash — and reallocate the rest.
    if (scaledChanged) {
      this.rtPass.resizeCarry(
        this.renderer,
        this._copyPass,
        sw,
        sh,
        RealtimeRaytracer.HISTORY_CARRY_FRAMES
      );
      this.denoisePass.setSize(sw, sh); // display-only, no temporal state
      this.specDenoisePass.setSize(sw, sh); // ditto; spec history lives in rtPass
      // ReSTIR reservoirs store packed id·64+M encodings — invalid to linearly
      // resample — but they reconverge in a few frames, so just reallocate and
      // clear them.
      this.restirPass.setSize(sw, sh);
      this.restirPass.clearHistory(this.renderer);
      // Reservoir GI history is packed (hit position + M + radiance + W) —
      // invalid to linearly resample — but reconverges in a few frames, so
      // reallocate and clear like the DI reservoirs.
      this.giReservoirPass.setSize(sw, sh);
      this.giReservoirPass.clearHistory(this.renderer);
    }

    // Full-res / canvas-res targets: only touched on a real canvas resize (a
    // renderScale step leaves them alone, so TAA keeps its resolved history).
    if (canvasChanged) {
      this.gbuffer.setSize(this._width, this._height);
      // Quarter-canvas fog: low-frequency and reconverges instantly, so a plain
      // reallocation + clear is fine.
      this.volumetricPass.setSize(this._volW, this._volH);
      this.volumetricPass.clearHistory(this.renderer);
      // TAA history is full-canvas-res: carry it across the resize (linear
      // resample) so the ladder step doesn't reset AA.
      this.taaPass.resizeCarry(this.renderer, this._copyPass, this._width, this._height);
      this._sceneColor.setSize(this._width, this._height);
    }
  }

  /**
   * FREE WINS — the first thing the governor spends, before a single pixel of
   * resolution. Returns true if it changed anything.
   *
   * The quality campaign timed every feature per scene and found three settings
   * that are cheaper AND no worse than the state they replace, so giving up
   * resolution before taking them is simply leaving frame time on the table:
   *
   *   giHalfRate on   -9.6% cornell / -19.1% museum / -21.9% tokyo frame time,
   *                   at rmse320 -0.004 / -0.09 / +0.30 (i.e. a wash)
   *   restirMCap 16   ~0.3 ms, better rmse/ghosting/in-motion error in both
   *                   measured scenes (now the library default; this only fires
   *                   for an app that raised it)
   *
   *   restirGI on     -14.2% / -7.9% / -27.4%, at rmse320 flat-or-better --
   *                   a SPEED feature; briefly vetoed (2026-07-27) for a
   *                   chromatic confetti artifact, reinstated after the
   *                   Rao-Blackwellized chroma resolve fixed it and on-device
   *                   review approved. Paired with the denoise cap of 3.
   *
   * Taken as ONE step (they are independent of each other and of resolution) and
   * released as one on the way back up, so the governor's state is either "free
   * wins spent" or not — no half-ladder to reason about.
   */
  _takeFreeWins(now) {
    if (this._qFreeWins) return false;
    // Nothing to take in a scene without GI: giHalfRate and restirGI both act on
    // the indirect bounce. Recorded as an empty take so the check is not redone
    // every adaptation (and so the ascent still has something to release).
    const prev = { scale: this._renderScale };
    let took = false;
    if (this.gi && !this.giHalfRate) {
      prev.giHalfRate = false;
      this.giHalfRate = true;
      took = true;
    }
    // restirGI: vetoed from the free wins on 2026-07-27 (chromatic confetti,
    // worst in colourful-bounce scenes), reinstated the same day after the
    // Rao-Blackwellized chroma resolve fixed it and on-device review approved
    // the look. History in docs/QUALITY_CAMPAIGN_2026-07.md.
    if (this.gi && this.denoise && this.denoiseIterations > 0 && !this.restirGI) {
      prev.restirGI = false;
      this.restirGI = true;
      took = true;
      if (this.denoiseIterations > RealtimeRaytracer.GOVERNOR_MAX_DENOISE) {
        prev.denoiseIterations = this.denoiseIterations;
        this.denoiseIterations = RealtimeRaytracer.GOVERNOR_MAX_DENOISE;
      }
    }
    if (this.restirMCap > 16) {
      prev.restirMCap = this.restirMCap;
      this.restirMCap = 16;
      took = true;
    }
    this._qFreeWins = prev; // even when empty: the check is now settled
    if (!took) return false;
    this._recordChange(-1, now);
    this._qEma = null; // cost profile changed — measure fresh
    console.info(
      "three-realtime-rt: adaptive quality → free wins first (" +
        Object.keys(prev).filter((k) => k !== "scale").join(", ") +
        "), resolution untouched"
    );
    return true;
  }

  /** Hand the free wins back (ascent). Returns true if it changed anything. */
  _releaseFreeWins(now) {
    const prev = this._qFreeWins;
    if (!prev) return false;
    this._qFreeWins = null;
    const keys = Object.keys(prev).filter((k) => k !== "scale");
    if (!keys.length) return false;
    for (const k of keys) this[k] = prev[k];
    this._recordChange(1, now);
    this._qEma = null;
    console.info(`three-realtime-rt: adaptive quality → returned ${keys.join(", ")}`);
    return true;
  }

  // ---- adaptive quality governor: continuous dynamic resolution scaling ----
  // Measures real call-to-call frame time (EMA) and steers renderScale
  // proportionally toward targetFps, in 0.05 steps with a cooldown so target
  // reallocation and accumulation resets stay rare. Lighting cost ≈ scale², so
  // the correction uses a damped power of the error. Limitation: under a vsync
  // cap the frame time can't reveal headroom, so upscaling only happens when
  // frames are measurably faster than the target — it never thrashes.
  //
  // SPENDING ORDER (down), cheapest-in-quality first:
  //   1. free wins            _takeFreeWins — no resolution given up at all
  //   2. renderScale          0.05 steps to 0.2 (lighting buffer only)
  //   3. canvasScale          the CANVAS_LEVELS ladder, quadratic on every pass
  // and the exact reverse on the way up, so everything taken is given back.
  // renderScale before canvas is the campaign's clearest ladder result: at
  // MATCHED cost, renderScale 0.2 at full canvas beats canvas 0.85 at
  // renderScale 0.2 by 14-22% rmse and ~40% detail retention (sharpRatio 0.96
  // vs 0.65) — canvas scale throws away the G-buffer's edges, which is the one
  // thing the tracer gets for free from the rasterizer.
  _adaptQuality() {
    // Hidden tabs are exempt: browser throttling makes every frame look
    // catastrophic, and adapting on that would drop quality for a tab nobody is
    // watching (same rule as _overloadBrake).
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      this._qLastT = null;
      return;
    }
    const now = performance.now();
    const dt = this._qLastT == null ? null : now - this._qLastT;
    this._qLastT = now;
    if (dt == null) return; // first frame — no interval yet
    // Only a genuine stall/resume (a blocked main thread, a tab coming back, a
    // debugger pause) is discarded. The old guard bailed above 100ms, which left
    // every device running slower than 10fps unable to adapt AT ALL: the
    // governor never saw a sample, and _overloadBrake only reacts past 400ms
    // with three consecutive strikes. Frames from 100ms to 2s now feed the EMA,
    // so a 3fps device walks down the ladder like any other.
    if (dt > 2000) return;
    this._qEma = this._qEma == null ? dt : this._qEma * 0.9 + dt * 0.1;
    // Calmness: normally 2s between changes. When the last two steps reversed
    // direction the governor is hunting the boundary, so hold for 5s AND widen
    // the "comfortable" deadband — both push it to commit to a level instead of
    // ping-ponging (each ping-pong is a target reallocation).
    const cooldown = this._qOscillating ? 5000 : 2000;
    if (now - this._qLastChange < cooldown) return;

    const ratio = this._qEma / (1000 / this.targetFps);
    const dbLo = this._qOscillating ? 0.6 : 0.8;
    const dbHi = this._qOscillating ? 1.24 : 1.12;
    if (ratio < dbHi && ratio > dbLo) return; // comfortable — leave it alone

    // STEP 1 (down): the free wins, before any resolution is given up.
    if (ratio > dbHi && this._takeFreeWins(now)) return;

    let s = this._renderScale * Math.pow(1 / ratio, 0.35);
    // Per-step clamp. Now that multi-hundred-millisecond frames feed the EMA, a
    // single very slow measurement (ratio can reach ~100 at dt 2s) would
    // otherwise slam the scale from 1.0 to the 0.2 floor in ONE step and throw
    // away the image on a transient. Move at most MAX_SCALE_STEP per adaptation
    // (5 ladder steps) and let the cooldown take the next one if it is still slow.
    const step = RealtimeRaytracer.MAX_SCALE_STEP;
    s = Math.min(this._renderScale + step, Math.max(this._renderScale - step, s));
    s = Math.round(Math.min(1, Math.max(0.2, s)) * 20) / 20; // 0.05 steps

    // When we're fast, give back the deepest lever FIRST: restore canvas scale
    // one step before touching renderScale, since canvas is the coarsest/most
    // valuable resolution to recover and it's quadratic on every pass.
    if (ratio < dbLo && this.canvasScaleHook && this._canvasLevelIdx > 0) {
      this._canvasLevelIdx--;
      this.canvasScaleHook(RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx]);
      this._recordChange(1, now); // restoring resolution = quality up
      this._qEma = null; // cost profile changed — measure fresh
      console.info(
        `three-realtime-rt: adaptive quality → ${Math.round(
          RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx] * 100
        )}% canvas`
      );
      return;
    }

    // When we're slow and renderScale has ALREADY BOTTOMED OUT — it is at the
    // 0.2 floor, not merely near it — step DOWN the canvas ladder, the deepest,
    // quadratic-on-every-pass lever. The old condition fired at renderScale
    // 0.25, one rung early; the campaign's cost-matched A/B says that rung
    // belongs to renderScale (full canvas at renderScale 0.2 beats canvas 0.85
    // at renderScale 0.2: rmse 9.53 vs 11.42 museum, 7.05 vs 8.98 tokyo, and
    // sharpRatio 0.96 vs 0.65-0.69 in both), so renderScale now walks all the
    // way to its floor before the canvas is touched at all.
    if (
      ratio > dbHi &&
      s <= 0.2 &&
      this._renderScale <= 0.2 &&
      this.canvasScaleHook &&
      this._canvasLevelIdx < RealtimeRaytracer.CANVAS_LEVELS.length - 1
    ) {
      this._canvasLevelIdx++;
      this.canvasScaleHook(RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx]);
      this._recordChange(-1, now); // deeper downscale = quality down
      this._qEma = null; // cost profile changed — measure fresh
      console.info(
        `three-realtime-rt: adaptive quality → ${Math.round(
          RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx] * 100
        )}% canvas`
      );
      return;
    }

    // STEP 3 (up): the free wins are the LAST thing handed back, and the bar for
    // handing them back is deliberately much higher than for any other step:
    //
    //   - the canvas is whole and renderScale is at its CEILING, so there is
    //     nothing cheaper left to restore (LIFO with the descent), and
    //   - the frame is running at DOUBLE the headroom an ordinary up-step needs
    //     (ratio < 0.5, i.e. under half the target frame period), for two
    //     consecutive adaptations.
    //
    // Measured, not guessed: with a plain `ratio < dbLo` test this oscillated —
    // take, return, take, return, three cycles in twenty seconds on the tokyo
    // scene — because giving the wins back makes the frame 10-27% slower, which
    // lands straight back in "slow". They are cheaper AND no worse, so holding
    // them one level too long costs nothing and churning them costs a reset
    // every two seconds.
    if (ratio < dbLo) this._qFastStreak = (this._qFastStreak || 0) + 1;
    else this._qFastStreak = 0;
    if (
      ratio < 0.5 &&
      this._qFastStreak >= 2 &&
      this._qFreeWins &&
      this._canvasLevelIdx === 0 &&
      this._renderScale >= 1 &&
      this._releaseFreeWins(now)
    ) {
      return;
    }

    if (Math.abs(s - this._renderScale) < 0.045) return;

    const dir = Math.sign(s - this._renderScale);
    const q = RealtimeRaytracer._qualityFor(s);
    this.denoiseIterations = q.denoiseIterations;
    this.stochasticLights = q.stochasticLights;
    this.renderScale = s; // reallocates targets, carrying history over (no reset)
    this._recordChange(dir, now);
    this._qEma = null; // cost profile changed — measure fresh
    console.info(
      `three-realtime-rt: adaptive quality → ${Math.round(s * 100)}% lighting, ` +
        `${q.denoiseIterations} denoise passes, ` +
        `${q.stochasticLights ? "stochastic" : "full"} direct light`
    );
  }

  /**
   * Normalized screen motion for this frame, 0 (parked) .. 1 (>= motionRefUv).
   *
   * Four world points are placed a scene-scale distance in front of the CURRENT
   * camera and projected with both this frame's and last frame's UNJITTERED
   * view-projection; `motion` is the largest UV displacement between the two,
   * divided by motionRefUv. Measuring the CONTENT's screen displacement (rather
   * than a camera position/angle delta) is what makes one number cover rotation,
   * translation and dolly at once, and makes it scale-free: a 1-unit pan means
   * something different in a Cornell box than in a city block, but "the image
   * moved 2% of the screen" does not.
   *
   * Must be called BEFORE render() mutates camera.projectionMatrix for overscan
   * and TAA jitter, so the sub-pixel jitter never leaks into the measurement.
   */
  _updateMotion(camera) {
    this._vpNow.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    if (!this._motionValid) {
      this._vpPrevUnjittered.copy(this._vpNow);
      this._motionValid = true;
      this.motion = 0;
      return;
    }
    const [pos, fwd, right, up, a, b] = this._mv;
    camera.getWorldPosition(pos);
    camera.getWorldQuaternion(this._mq);
    fwd.set(0, 0, -1).applyQuaternion(this._mq);
    right.set(1, 0, 0).applyQuaternion(this._mq);
    up.set(0, 1, 0).applyQuaternion(this._mq);
    const d = this.compiled ? Math.max(this.compiled.sceneDiagonal * 0.35, 1e-3) : 10;
    let maxUv = 0;
    for (let i = 0; i < 4; i++) {
      const sx = i & 1 ? 0.3 : -0.3;
      const sy = i & 2 ? 0.3 : -0.3;
      a.copy(pos).addScaledVector(fwd, d).addScaledVector(right, sx * d).addScaledVector(up, sy * d);
      b.copy(a).applyMatrix4(this._vpPrevUnjittered); // perspective divide included
      a.applyMatrix4(this._vpNow);
      // Guard a point that fell behind last frame's camera (applyMatrix4 divides
      // by a w that can go negative): treat it as full motion rather than NaN.
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const uv = Number.isFinite(dx) && Number.isFinite(dy) ? Math.hypot(dx, dy) * 0.5 : 1;
      if (uv > maxUv) maxUv = uv;
    }
    this.motion = Math.min(1, maxUv / Math.max(1e-6, this.motionRefUv));
    this._vpPrevUnjittered.copy(this._vpNow);
  }

  // Record a committed quality step and update oscillation state: two
  // consecutive steps in OPPOSITE directions mean the governor is hunting the
  // frame-time boundary (drives the wider deadband + longer cooldown above).
  _recordChange(dir, now) {
    this._qOscillating = dir !== 0 && this._qLastDir !== 0 && dir !== this._qLastDir;
    if (dir !== 0) this._qLastDir = dir;
    this._qLastChange = now;
  }

  render(scene, camera) {
    if (!this.supported) {
      this.renderer.render(scene, camera);
      return;
    }
    if (this.adaptiveQuality) this._adaptQuality();
    if (this.overloadProtection) this._overloadBrake();
    if (!this.compiled) {
      this.compileScene(scene);
      // An implicit compile is the zero-config path: it works, but it takes NO
      // options, so every mesh is static forever. Anything that moves needs the
      // explicit call — say so once, and only once the compile actually produced
      // a scene (an empty scene has its own warning).
      if (this.compiled && !this._implicitCompileWarned) {
        this._implicitCompileWarned = true;
        this._warn(
          "implicit-compile",
          "three-realtime-rt: render() compiled the scene implicitly (no compileScene() " +
            "call), so it was compiled with NO options — every mesh is static and " +
            "updateDynamic() has nothing to update. Call compileScene(scene, options) " +
            "yourself (e.g. {dynamicMeshes:[...]}) before the first render() if anything moves."
        );
      }
    }
    // Still nothing to trace (empty scene — tracer built before meshes were
    // added). Show the user's raster scene rather than crashing or rendering
    // black; the pipeline picks up automatically once compileScene() succeeds.
    if (!this.compiled) {
      this.renderer.render(scene, camera);
      return;
    }

    this.frame += 1;
    // Cheap periodic check that no STATIC mesh was edited behind the BVH's back.
    if (this.frame % RealtimeRaytracer.STALE_CHECK_FRAMES === 0) this._checkStale();
    camera.updateMatrixWorld();

    // --- sub-pixel jitter (TAA): offset the projection a fraction of a pixel
    // each frame so the whole pipeline (raster G-buffer + traced lighting)
    // samples slightly different positions; the TAA resolve averages them into
    // supersampled edges. Restored after the frame so callers see a clean matrix.
    const proj = camera.projectionMatrix;
    const savedProj0 = proj.elements[0];
    const savedProj5 = proj.elements[5];
    const savedProj8 = proj.elements[8];
    const savedProj9 = proj.elements[9];
    // Screen motion, measured on the CLEAN matrix before overscan/jitter touch
    // it. Cheap (four point projections) and always maintained, so `rt.motion`
    // is readable by apps even when motionAdaptive is off.
    this._updateMotion(camera);
    // Overscan: widen the frustum so the padded image covers proportionally
    // more FOV. Scaling elements[0]/[5] (the x/y projection scale) by 1/padFactor
    // makes each axis see (1 + 2·overscan)× as much — the extra content lands in
    // the padding that the final crop discards. Applied like the TAA jitter
    // (temporary; the caller's matrix is restored at frame end), and BEFORE the
    // jitter so the two compose. Previous-frame matrices captured below are the
    // widened ones, keeping temporal reprojection consistent in padded space.
    if (this._overscan > 0) {
      const inv = 1 / this._padFactor;
      proj.elements[0] *= inv;
      proj.elements[5] *= inv;
    }
    // Debug views (outputMode != 0) bypass the TAA resolve, so skip the jitter
    // too — otherwise the raw buffers visibly shake.
    if (this.taa && this.outputMode === 0) {
      this._jitterIndex = (this._jitterIndex + 1) % 16;
      // taaJitterScale: when the app renders a REDUCED drawing buffer and CSS-
      // stretches it to the screen (the canvas-scale ladder), a half-buffer-pixel
      // jitter is magnified by the stretch and reads as visible screen wobble.
      // The app sets this to its canvas scale (see canvasScaleHook) so the
      // jitter stays constant in SCREEN pixels — slightly less sub-pixel AA
      // coverage at low canvas scales, in exchange for a steady image.
      const js = this.taaJitterScale;
      const jx = (halton(this._jitterIndex + 1, 2) - 0.5) * 2 * js / this._width;
      const jy = (halton(this._jitterIndex + 1, 3) - 0.5) * 2 * js / this._height;
      proj.elements[8] += jx;
      proj.elements[9] += jy;
      // Where this jitter moves the image, in UV space: elements[8/9] multiply
      // view-space z (= -w), so NDC shifts by -j → UV by -j/2. The TAA resolve
      // uses this to unjitter its input back onto a stable grid.
      this._jitterUv.set(-jx * 0.5, -jy * 0.5);
    } else {
      this._jitterUv.set(0, 0);
    }
    // View-projection actually used to render this frame (jittered if TAA on).
    this._jitteredViewProj
      .copy(proj)
      .multiply(camera.matrixWorldInverse);

    const prevAutoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;

    if (this._needsClear) {
      this.rtPass.clearHistory(this.renderer);
      this.volumetricPass.clearHistory(this.renderer);
      this.restirPass.clearHistory(this.renderer);
      this.giReservoirPass.clearHistory(this.renderer);
      this._needsClear = false;
    }

    // 1. rasterize G-buffer (ping-pongs internally; previous frame kept)
    this.gbuffer.render(this.renderer, scene, camera);

    // 2. ray traced lighting with temporal reprojection
    const rtU = this.rtPass.material.uniforms;
    rtU.uEnvColor.value.copy(this.envColor);
    rtU.uEnvIntensity.value = this.envIntensity;
    rtU.uEps.value = this.eps;
    rtU.uCostView.value = this.outputMode === 7;
    rtU.uCostScale.value = this.costScale;
    rtU.uTemporalReprojection.value = this.temporalReprojection;
    // Motion-adaptive temporal response (default off -> exactly this.maxHistory).
    const mt = this.motionAdaptive ? this.motion : 0;
    rtU.uMaxHistory.value = this.maxHistory + (this.maxHistoryMoving - this.maxHistory) * mt;
    rtU.uFireflyClamp.value = this.fireflyClamp > 0 ? this.fireflyClamp : 1e6;
    rtU.uGIEnabled.value = this.gi;
    rtU.uGIHalfRate.value = this.giHalfRate;
    // ReSTIR GI (experimental) supplies the 1-bounce indirect externally when
    // on; the lighting pass then skips its inline GI trace so it isn't double
    // counted. It's injected at the denoise stage, so it needs denoise on.
    const giExternal =
      this.restirGI && this.gi && this.denoise && this.denoiseIterations > 0;
    rtU.uExternalGI.value = giExternal;
    if (this.restirGI && this.gi && !giExternal && !this._giMissWarned) {
      console.info(
        "[three-realtime-rt] restirGI is on but denoise is off — ReSTIR GI is " +
          "injected during the à-trous denoise, so enable denoise " +
          "(denoiseIterations >= 1) to see its contribution."
      );
      this._giMissWarned = true;
    }
    if (giExternal) this._giMissWarned = false;
    rtU.uEmissiveCount.value = this.emissiveNEE ? this.compiled.emissiveTriCount : 0;
    rtU.uEmissiveCDF.value = this.emissiveImportance;
    rtU.uReflEnabled.value = this.reflections;
    rtU.uRefrEnabled.value = this.refraction;
    rtU.uBlendEnabled.value = this.transparency;
    rtU.uIor.value = this.ior;
    rtU.uDispersion.value = Math.min(0.5, Math.max(0, this.dispersion));
    rtU.uLightStochastic.value = this.stochasticLights;
    rtU.uSkyEnabled.value = this.sky.enabled;
    rtU.uSunDir.value.copy(this.sky.sunDir);
    rtU.uSunColor.value.copy(this.sky.sunColor);
    rtU.uSkyZenith.value.copy(this.sky.zenith);
    rtU.uSkyHorizon.value.copy(this.sky.horizon);
    rtU.uSkyIntensity.value = this.sky.intensity;
    rtU.uPrevViewProj.value.copy(this._prevViewProj);
    rtU.uViewProj.value.copy(this._jitteredViewProj);
    rtU.uCameraPos.value.copy(camera.getWorldPosition(this._camWorldPos));

    // 2a. ReSTIR reservoirs (ALU-only, no rays) — the lighting pass shades
    // each pixel's winner with a single visibility ray.
    let reservoirTex = null;
    if (this.restir) {
      // Emissive candidates follow the emissiveNEE toggle — without this the
      // reservoir keeps proposing panel samples the user has switched off.
      this.restirPass.setEmissiveCount(this.emissiveNEE ? this.compiled.emissiveTriCount : 0);
      reservoirTex = this.restirPass.render(
        this.renderer,
        this.gbuffer,
        this._prevViewProj,
        this._camWorldPos,
        this.frame,
        this.eps,
        this.restirMCap + (this.restirMCapMoving - this.restirMCap) * mt
      );
    }
    // 2b. ReSTIR GI reservoirs (experimental). Runs after the lighting pass's
    // inline GI is skipped (uExternalGI); the resolved GI is added at denoise.
    let giTex = null;
    if (giExternal) {
      this.giReservoirPass.setEmissiveCount(
        this.emissiveNEE ? this.compiled.emissiveTriCount : 0
      );
      giTex = this.giReservoirPass.render(
        this.renderer,
        this.gbuffer,
        this._prevViewProj,
        this._camWorldPos,
        this.frame,
        this.eps,
        {
          fireflyClamp: this.fireflyClamp > 0 ? this.fireflyClamp : 1e6,
          mCap: this.restirGIMCap,
          spatialTaps: Math.max(0, Math.min(4, this.restirGISpatialTaps | 0)),
          validateInterval: Math.max(0, this.restirGIValidate | 0),
          resolveAlpha: Math.min(1, Math.max(0.01, this.restirGIResolveAlpha)),
          confLow: Math.min(1, Math.max(0, this.restirGIConfLow)),
          chromaMean: this.restirGIChromaMean,
          visFallback: this.restirGIVisFallback,
          emissiveCDF: this.emissiveImportance,
          envColor: this.envColor,
          envIntensity: this.envIntensity,
          skyEnabled: this.sky.enabled,
          sunDir: this.sky.sunDir,
          sunColor: this.sky.sunColor,
          skyZenith: this.sky.zenith,
          skyHorizon: this.sky.horizon,
          skyIntensity: this.sky.intensity,
        }
      );
    }

    let { irradiance, specular } = this.rtPass.render(this.renderer, this.gbuffer, this.frame, reservoirTex);

    // 3. denoise (display-only: history keeps accumulating raw samples). The
    // experimental ReSTIR GI (giTex) is added on the first à-trous iteration —
    // downstream of the lighting pass's temporal history, so it never
    // double-counts through it. The bvh-cost heatmap (mode 7) is a per-pixel
    // debug signal, not lighting — the edge-aware blur would smear its bands,
    // so it bypasses the denoiser (which also keeps the GI add out of mode 7).
    if (this.denoise && this.denoiseIterations > 0 && this.outputMode !== 7) {
      irradiance = this.denoisePass.render(
        this.renderer,
        irradiance,
        this.gbuffer,
        this._camWorldPos,
        this.eps,
        this.denoiseIterations,
        giTex,
        {
          maxStep: this.denoiseMaxStep,
          stepJitter: this.denoiseStepJitter,
          wideDamp: this.denoiseWideDamp,
          frame: this.frame,
        }
      );
    }

    // 3a. light denoise on the specular buffer. specKeep (DenoisePass) already
    // spares near-mirror pixels, so reflections stay crisp; capped at 2 passes
    // to avoid washing out sharp dielectric highlights.
    let specularTex = this.specular ? specular : null;
    if (specularTex && this.denoise && this.denoiseIterations > 0) {
      specularTex = this.specDenoisePass.render(
        this.renderer,
        specularTex,
        this.gbuffer,
        this._camWorldPos,
        this.eps,
        Math.min(this.denoiseIterations, 2)
      );
    }

    // 3b. volumetric single-scatter (optional): one BVH-shadowed light sample
    // per lighting pixel along the camera ray, accumulated temporally. The
    // composite adds the result before fog and tonemap.
    let volumetricTex = null;
    // Runs when a global density is set OR when localized zones are present
    // (a zone can add fog even where the global term is 0).
    const hasZones = this.volumetric.zones && this.volumetric.zones.length > 0;
    if (
      this.volumetric.enabled &&
      this.outputMode === 0 &&
      (this.volumetric.density > 0 || hasZones)
    ) {
      volumetricTex = this.volumetricPass.render(
        this.renderer,
        this.gbuffer,
        this._prevViewProj,
        this._camWorldPos,
        this.frame,
        this.eps,
        this.volumetric.density,
        this.volumetric.maxDist,
        this.volumetric.zones
      );
    }

    // 4. composite (bilateral upsample if lighting is sub-res). With TAA on,
    // render to an offscreen colour target so the resolve can accumulate it;
    // otherwise straight to screen. Debug views bypass TAA (raw buffers).
    const useTaa = this.taa && this.outputMode === 0;
    const cU = this.composite.material.uniforms;
    cU.uOutputMode.value = this.outputMode;
    cU.uUpsample.value = this._renderScale < 1;
    cU.uIrrTexelSize.value.set(1 / this._scaledW, 1 / this._scaledH);
    cU.uCameraPos.value.copy(this._camWorldPos);
    cU.uFogEnabled.value = this.fog.enabled;
    cU.uFogColor.value.copy(this.fog.color);
    cU.uFogDensity.value = this.fog.density;
    cU.uSkyEnabled.value = this.sky.enabled;
    cU.uInvViewProj.value.copy(this._invViewProj.copy(this._jitteredViewProj).invert());
    cU.uSunDir.value.copy(this.sky.sunDir);
    cU.uSunColor.value.copy(this.sky.sunColor);
    cU.uSkyZenith.value.copy(this.sky.zenith);
    cU.uSkyHorizon.value.copy(this.sky.horizon);
    cU.uSkyIntensity.value = this.sky.intensity;
    cU.uVolumetric.value = volumetricTex;
    cU.uVolEnabled.value = volumetricTex !== null;
    cU.uVolTexelSize.value.set(1 / this._volW, 1 / this._volH);
    // With TAA on we composite into the padded offscreen target (no crop — the
    // TAA copy crops on its way to screen). Without TAA the composite IS the
    // on-screen draw, so it applies the central crop itself.
    this.composite.render(
      this.renderer,
      irradiance,
      this.gbuffer,
      scene.background,
      useTaa ? this._sceneColor : null,
      specularTex,
      useTaa ? null : this._crop
    );

    // 5. temporal anti-aliasing resolve (jitter + neighbourhood-clamped history).
    if (useTaa) {
      this.taaPass.render(
        this.renderer,
        this._sceneColor.texture,
        this.gbuffer,
        this._prevViewProj, // last frame's jittered VP
        this._jitterUv,
        this._prevJitterUv,
        this.taaBlend + (this.taaBlendMoving - this.taaBlend) * mt,
        null, // outputTarget: null = screen (the final on-screen draw)
        this._crop // central-crop the padded resolve onto the canvas
      );
    } else if (this.taa) {
      // In a debug view: keep history fresh so switching back doesn't ghost.
      this.taaPass.reset();
    }

    this.renderer.autoClear = prevAutoClear;

    // Restore the caller's projection matrix (remove this frame's jitter + the
    // overscan widening) so callers always see their own clean matrix.
    proj.elements[0] = savedProj0;
    proj.elements[5] = savedProj5;
    proj.elements[8] = savedProj8;
    proj.elements[9] = savedProj9;

    // Record this frame's (jittered) view-projection + jitter for next frame.
    this._prevViewProj.copy(this._jitteredViewProj);
    this._prevJitterUv.copy(this._jitterUv);

    // Compile-failure diagnosis: every pass program used this frame has now had
    // its link status checked by three (diagnostics populated on first use), so
    // scan for failures. Runs at frame END (downstream of the passes) and only
    // until the polling window settles — a no-op on the healthy steady state.
    if (!this._diagDone) this._scanPrograms();
  }

  dispose() {
    if (!this.supported) return;
    this.gbuffer.dispose();
    this.rtPass.dispose();
    this.denoisePass.dispose();
    this.specDenoisePass.dispose();
    this.composite.dispose();
    this.taaPass.dispose();
    this.volumetricPass.dispose();
    this.restirPass.dispose();
    this.giReservoirPass.dispose();
    this._sceneColor.dispose();
    this._copyPass.dispose();
    if (this.compiled) this.compiled.dispose();
  }
}
