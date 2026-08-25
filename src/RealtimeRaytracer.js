import * as THREE from "three";
import {
  compileScene,
  syncLights,
  uploadLightRows,
  clampMaxLights,
  DEFAULT_MAX_LIGHTS,
  MAX_LIGHTS_LIMIT,
} from "./SceneCompiler.js";
import { GBufferPass } from "./GBufferPass.js";
import { RTLightingPass } from "./RTLightingPass.js";
import { DenoisePass } from "./DenoisePass.js";
import { AccumulatePass } from "./AccumulatePass.js";
import { CompositePass } from "./CompositePass.js";
import { TAAPass } from "./TAAPass.js";
import { VolumetricPass } from "./VolumetricPass.js";
import { RestirPass } from "./RestirPass.js";
import { GIReservoirPass } from "./GIReservoirPass.js";
import { LightGridPass } from "./LightGridPass.js";
import { CopyPass } from "./CopyPass.js";
import { GpuTimer } from "./GpuTimer.js";
import { makeMRT } from "./mrtCompat.js";
import { setRectUniforms } from "./lightingRect.js";

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
    // High: the constructor defaults at desktop lighting resolution. Since
    // 0.15.0 `stochasticLights` defaults to false, so this no longer has to
    // undo it — it is still passed EXPLICITLY, because an explicit option is
    // pinned against the adaptive governor and this tier is saying "do not
    // trade my light rays away", not merely restating a default.
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
   * FUNCTIONAL probe for the motion-vector MRT: can this context DRAW into a
   * FIVE-attachment G-buffer whose fifth target is RG32F? WebGL2 only
   * guarantees 4 draw buffers (MAX_DRAW_BUFFERS >= 4), so a 5-attachment MRT is
   * NOT guaranteed — check the count, then do a real draw + readback (a
   * checkFramebufferStatus probe alone is what misleads on WebKit/iOS). If this
   * returns false, `motionVectors` degrades to camera-only reprojection.
   */
  static _motionMrtSupported(renderer) {
    const gl = renderer.getContext();
    if (gl.getParameter(gl.MAX_DRAW_BUFFERS) < 5) return false;
    let mrt, out, mat, copy, quad, scene2, cam;
    const prevTarget = renderer.getRenderTarget();
    try {
      mrt = makeMRT(2, 2, 5, {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        depthBuffer: false,
        stencilBuffer: false,
      });
      for (const tex of mrt.texture) tex.generateMipmaps = false;
      mrt.texture[4].format = THREE.RGFormat;
      mrt.texture[4].type = THREE.FloatType;
      out = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false, stencilBuffer: false });
      const vert = `out vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
      mat = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: vert,
        fragmentShader: `precision highp float;
layout(location = 0) out vec4 o0; layout(location = 1) out vec4 o1;
layout(location = 2) out vec4 o2; layout(location = 3) out vec4 o3;
layout(location = 4) out vec4 o4;
void main(){
  o0 = vec4(0.5); o1 = vec4(0.25); o2 = vec4(0.125); o3 = vec4(0.0625);
  o4 = vec4(0.375, 0.625, 0.0, 1.0);
}`,
        depthTest: false,
        depthWrite: false,
      });
      copy = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: vert,
        fragmentShader: `precision highp float; in vec2 vUv; out vec4 outColor;
uniform sampler2D uTex; void main(){ outColor = vec4(texture(uTex, vUv).rg, 0.0, 1.0); }`,
        uniforms: { uTex: { value: mrt.texture[4] } },
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
      // 0.375 -> ~96, 0.625 -> ~159 through the RGBA8 round-trip.
      return Math.abs(px[0] - 96) < 24 && Math.abs(px[1] - 159) < 24;
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
  /**
   * Frames the adaptive governor observes before it is allowed to change
   * anything. Covers shader compilation and the first BVH upload, whose cost
   * lands in the first handful of frames and is not representative of steady
   * state. 60 frames is about a second at 60Hz.
   */
  static GOVERNOR_WARMUP_FRAMES = 60;

  static MAX_SCALE_STEP = 0.25;

  /**
   * 0.16.8: the hard floor under every renderScale bound. It used to be 0.2
   * everywhere, which was right while the lighting grid WAS the output grid: a
   * fifth-resolution image upscaled to the canvas is already at the edge of
   * usable. An upsampling denoiser plugin breaks that assumption (it traces at
   * the low grid and reconstructs to a higher one), so a plugin that advertises
   * `preferences.renderScale.min` below 0.2 may now have it. The DEFAULT floor
   * for an app that says nothing is still 0.2: only an explicit request goes
   * lower, and the governor still never goes below what it is given.
   */
  static MIN_RENDER_SCALE = 0.05;

  /**
   * Largest renderScale change the governor may commit UPWARD in one step. One
   * 0.05 rung, against the 0.25 (five rungs) it may drop in one step. The
   * asymmetry is deliberate and is the whole reason a raise is safe to enable at
   * all: a drop that is one rung too deep costs a little sharpness for two
   * seconds, whereas a raise that is one rung too high costs dropped frames, so
   * the ladder is climbed one rung at a time and fallen down five at a time.
   */
  static MAX_SCALE_UP_STEP = 0.05;

  /**
   * THE LADDER (0.16.10). The governor no longer picks a renderScale off a
   * continuous 0.05 grid; it picks a RUNG, and a rung is a fixed fraction of
   * the renderScale CAP. Five rungs spanning cap..0.4*cap is enough range to
   * rescue a struggling device (0.4x the cap is 0.16 of the frame's lighting
   * pixels) and few enough that the whole session's states are enumerable,
   * which is what makes the allocation gate below checkable at all.
   */
  static SCALE_LADDER = [1.0, 0.85, 0.7, 0.55, 0.4];

  /**
   * HYSTERESIS, and the numbers are the point of this wave. The owner's phone
   * trace has renderScale moving roughly ONCE A SECOND for seven minutes
   * (0.13, 0.25, 0.2, 0.3, 0.15 ...) before the context died. Three independent
   * locks now make that impossible by construction rather than unlikely:
   *
   *   DOWN_STREAK 10   consecutive slow governor samples (~0.2s at 60fps, ~0.5s
   *                    at 20fps) before a rung is given up. Small on purpose: a
   *                    device in trouble has to escape quickly, and a step down
   *                    is the cheap direction.
   *   UP_STREAK  180   consecutive samples with real headroom before one is
   *                    taken back (18x the down streak, ~3s at 60fps and
   *                    ~9s at 20fps. N << M is what stops the ladder hunting:
   *                    a device that is borderline spends almost all its time
   *                    at the lower rung instead of trading between two.
   *   DWELL     4000ms minimum between ANY two rung moves, whatever the streaks
   *                    say.
   *   REVERSAL 20000ms minimum before a move in the OPPOSITE direction to the
   *                    last one. This is the lock that bounds the flapping: a
   *                    complete down-up (or up-down) cycle cannot take less
   *                    than 20 seconds, so the trace's 1Hz cycle is not a
   *                    tuning question any more, it is unreachable.
   */
  static LADDER_DOWN_STREAK = 10;
  static LADDER_UP_STREAK = 180;
  static LADDER_DWELL_MS = 4000;
  static LADDER_REVERSAL_MS = 20000;

  /**
   * The tracer's GPU cost as a fraction of the frame period, at which the
   * governor calls the frame OVER budget. Deliberately 1.0, i.e. "the whole
   * period": this is a safety net behind the wall clock, not a second opinion
   * about how much resolution to keep.
   *
   * Measured on an RTX 3060 at 960x600 (dev/gpu-budget-sweep.py, rAF-paced as
   * the game runs, great hall at canvas 0.75): traced GPU 15.96ms / wall 16.80,
   * 19.55 / 20.40, 24.55 / 25.30, 28.43 / 29.30. The wall clock is the GPU cost
   * plus a flat ~0.85ms of non-tracer work, so once the GPU cost passes the
   * period the wall clock passes it too and the ORIGINAL wall-clock gate fires
   * on its own. A lower threshold here would take real resolution away from
   * scenes the display is currently keeping up with: the great hall's settled
   * 15.96ms is 96% of a 60Hz period and delivers a 16.8ms frame, and a governor
   * that dropped the canvas a rung for that would be optimising its own proxy
   * rather than the frame rate it was asked for.
   */
  static GPU_BUDGET_DROP = 1.0;
  /** As above, while the governor knows it is hunting a boundary. */
  static GPU_BUDGET_DROP_OSC = 1.15;

  /**
   * The highest GPU utilisation the governor will COMMIT to outright when it
   * raises quality. Not a trigger — a predicted-cost ceiling: a step predicted
   * to land under this is taken on the model's word (see _takeUpStep), and one
   * predicted above it is either probed or refused. 0.85 keeps roughly a sixth
   * of the period in hand for scene variation (the aeroplane flying into a lit
   * room, a door opening onto more lights) so a committed raise does not have to
   * be undone the moment the view changes.
   *
   * The gap between this and GPU_BUDGET_DROP is the anti-oscillation deadband:
   * the governor never commits a step it can predict will need undoing, and the
   * borderline band above it is entered only through a probe that carries its
   * own undo and its own backoff.
   */
  static GPU_TARGET_UTIL = 0.85;
  /** Stricter while hunting: only an obviously affordable step gets through. */
  static GPU_TARGET_UTIL_OSC = 0.6;

  /**
   * Predicted utilisation above which an up-step is refused outright rather than
   * verified by probing it.
   *
   * Between GPU_TARGET_UTIL and this, the model is not confident enough to
   * commit and not confident enough to refuse — so the step is TAKEN AS A PROBE
   * and judged on what it actually costs 1.5s later. That band matters: this
   * game's great hall settles at 96% utilisation, so a governor that only ever
   * committed steps predicted under 85% could never climb back to the level it
   * was already running at before a transient, and every hitch would cost a
   * permanent rung. Measurement decides; the model only decides what is worth
   * measuring.
   */
  static GPU_PROBE_CEIL = 1.05;

  /**
   * Cost model for an up-step, used to refuse steps that would overshoot.
   *
   * Canvas scale is quadratic on EVERY pass and measures as such: great hall,
   * renderScale 0.2, canvas 1.0 = 27.06ms against canvas 0.75 = 15.96ms, a ratio
   * of 1.70 where the quadratic says 1.78. So canvas steps are charged the
   * quadratic, which is right and marginally conservative.
   *
   * renderScale is quadratic only on the TRACED LIGHTING, which is a fraction of
   * the frame — the G-buffer raster, TAA and the resolve are full-resolution
   * whatever it is set to. Measured share of frame cost that actually scales
   * with renderScale (dev/gpu-budget-sweep.py): 0.40 at 0.2->0.25, 0.35 at
   * 0.2->0.3, 0.80 at 0.5->0.6, 0.84 at 0.75->1.0 — it grows as the lighting
   * comes to dominate. SCALE_COST_SHARE is the top of that range, so the model
   * `1 + share*(area - 1)` is exact at the top of the ladder and conservative
   * everywhere below it. A flat quadratic was tried first and over-charged a
   * 0.30->0.35 step by 15%, which left the last rung of a recovery dependent on
   * catching a low sample — it got there, in 32 seconds instead of 4.
   */
  static SCALE_COST_SHARE = 0.85;
  static STOCHASTIC_STEP_FACTOR = 1.5;

  /**
   * Adaptations a "there is headroom" reading must survive before the governor
   * acts on it. At the 2s cooldown this is a ~4s dwell before the first up-step,
   * and it is what keeps a single quiet moment in a heavy scene from starting a
   * climb the scene cannot pay for.
   */
  static GOVERNOR_UP_DWELL = 2;

  /**
   * How long the governor waits for a GPU timing result before giving up on the
   * timer and falling back to probing. GPU_DISJOINT (a driver clock change, a
   * context switch away from the tab) empties the sample window legitimately, so
   * a gap is not a fault; a permanent one is, and a governor that simply waited
   * for a number that never came would be worse than the bug being fixed.
   */
  static GPU_STALE_MS = 5000;

  /**
   * How long a direction reversal keeps the governor in its cautious
   * "oscillating" mode (wider deadband, longer cooldown, stricter raise).
   *
   * The flag is set by ONE reversal, which is right for catching a hunt early
   * and wrong as a permanent state: a descent followed by a recovery is a single
   * reversal too, and before this timeout existed the first step back up latched
   * the strict thresholds for the rest of the page. Observed exactly that —
   * after a transient the canvas recovered one rung, that recovery counted as a
   * reversal, and the stricter raise threshold (0.6) then refused every further
   * step at a measured 0.67 utilisation, permanently. Fifteen seconds of no
   * changes at all is not a hunt; three normal cooldowns is long enough that a
   * real ping-pong (which changes something every 5s) never sees this expire.
   */
  static OSCILLATION_FORGET_MS = 15000;

  /**
   * Speculative up-probe (used only where the GPU timer is unavailable — Safari
   * and iOS withhold the extension, and the owner ships to iPad).
   *
   * PROBE_BASE_MS is the quiet period before the first probe, doubling to
   * PROBE_MAX_MS after each failure and resetting to base after each success, so
   * a machine that genuinely has headroom finds it in tens of seconds while a
   * machine that does not stops asking. PROBE_SETTLE_MS is how long the raised
   * level runs before the verdict: the wall-clock EMA is reseeded from scratch
   * after a quality change (alpha 0.1, so ~90% converged in 22 frames) and a
   * missed vsync has to actually happen to be seen.
   */
  static PROBE_BASE_MS = 8000;
  static PROBE_MAX_MS = 120000;
  static PROBE_SETTLE_MS = 1500;
  /** A probe fails if the wall clock got this much worse than before it. */
  static PROBE_FAIL_RATIO = 1.1;

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
  /**
   * The constructor's defaults for every LIVE-ASSIGNABLE option, as one flat
   * object, so an app can put a "reset to defaults" button in its own UI
   * without hard-coding a second copy of this library's opinions (both demos
   * here do exactly that). Frozen: read it, spread it, do not mutate it.
   *
   * `volumetric` is the one nested entry and it carries only `enabled`, for the
   * same reason the presets do: density / maxDist / zones are the app's scene
   * description, not a quality setting to reset.
   *
   * NOT the full option list. Options that need a `compileScene()`
   * (`absorptionShadows`, `kmScattering`, `textureTiles`), options that are
   * scene data (`envColor`, `sky`, `fog`, `ior`) and constructor-only wiring
   * (`canvasScaleHook`, `preset`) are deliberately absent — a reset button
   * should not silently recompile your scene or repaint your sky.
   *
   * DRIFT IS GATED, not promised: `?selftest=presets` asserts that every key
   * here equals the same-named property on a freshly constructed instance
   * (`staticDefaultsMatch`), so this object cannot quietly fall behind the
   * constructor it documents.
   */
  static DEFAULTS = Object.freeze({
    // resolution and the governor
    renderScale: 0.5,
    overscan: 0,
    adaptiveQuality: true,
    targetFps: 55,
    denoise: true,
    denoiseIterations: 2,
    taa: true,
    // what is traced
    gi: false,
    giHalfRate: false,
    ambient: true,
    emissiveNEE: true,
    emissiveImportance: true,
    specular: true,
    reflections: true,
    refraction: true,
    transparency: true,
    dispersion: 0,
    volumetric: Object.freeze({ enabled: false }),
    // direct-light estimator
    restir: true,
    restirGI: false,
    stochasticLights: false,
    restirMCap: 16,
    restirWarmAge: 0,
    restirDirectionalBypass: true,
    restirReprojectionRescue: true,
    restirCandidateImportance: true,
    restirLightGrid: true,
    restirClampRel: 2,
    restirSamples: 1,
    restirSampleRadius: 10,
    restirDynamicAccept: false,
    restirDynamicFreeze: false,
    // temporal
    motionVectors: true,
    temporalReprojection: true,
    motionAdaptive: false,
    maxHistory: 48,
    fireflyClamp: 4.0,
    // debug views
    outputMode: 0,
    costScale: 1 / 96,
  });

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
      // Tracks the constructor default, which flipped to false in 0.15.0.
      // `balanced` is DEFINED as "the constructor defaults, written out", and
      // the render self-test asserts it is a no-op on a fresh instance
      // (?selftest=presets, gate `balancedNoop`) — so this value is not a
      // choice, it is a mirror.
      stochasticLights: false,
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
    // Snapshot the caller's own options before the preset merge, so we know
    // which keys the caller PASSED EXPLICITLY (as opposed to defaulted). Used
    // by the adaptive governor to honour pinned options — see _takeFreeWins.
    // `!== undefined` rather than Object.hasOwn because an explicit `undefined`
    // is indistinguishable from "not passed" in intent: spreading defaults with
    // `{ ...base, key: undefined }` is a common erase pattern, and `??` treats
    // undefined the same way, so this is consistent with every default in the
    // constructor.
    const _userOpts = options;

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

    /**
     * Governor-pinned options: keys the caller passed explicitly at construction,
     * which the adaptive governor must never change (neither take as a free win
     * nor restore on the way back up). Detected as `_userOpts[key] !== undefined`
     * rather than Object.hasOwn, so `restirGI: undefined` (an erase pattern) does
     * not pin. Includes every option `_takeFreeWins` may modify.
     *
     * RUNTIME WRITES (rt.restirGI = false after construction) do NOT pin. The
     * governor itself writes these properties, so a naive "any write pins" rule
     * would have the governor pin its own changes. Pinning is a constructor
     * contract: set it at construction to declare "never touch this." To change
     * at runtime, turn adaptiveQuality off, set the property, and turn it back on.
     */
    this._qPinned = new Set();
    for (const key of ["restirGI", "giHalfRate", "restirMCap"]) {
      if (_userOpts[key] !== undefined) this._qPinned.add(key);
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
    /** Split-accumulation pipeline (AccumulatePass). Default on; `splitAccum:
     *  false` falls back to the megakernel's inline EMA — the escape hatch if
     *  a platform misbehaves, and the engine-level A/B for benches. */
    this._splitAccum = options.splitAccum ?? true;
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
    // Largest texture this GPU can allocate. The light GRID is one texture ROW
    // per cell, so this is the only limit its cell count depends on (WebGL2
    // guarantees 2048; desktop reports 16384).
    this._maxTextureSize = renderer.getContext().getParameter(
      renderer.getContext().MAX_TEXTURE_SIZE
    );
    /**
     * LIGHT-TABLE CAPACITY (default 128, hard max 256). COMPILE-TIME, like
     * `textureTiles`: every pass bakes it into a `#define` and the scene-data
     * texture into its width, so the setter throws rather than lying.
     *
     * Through 0.15.0 this was a fixed 32 and it was a UNIFORM budget, not a
     * taste: three vec4[32] arrays in four shaders. 0.16.0 moved the table into
     * rows of the scene-data texture, so a seat now costs 4 texels and the cap
     * became a number you can choose. A light costs NOTHING per frame under
     * ReSTIR (the reservoir shades one winner however many lights exist); it
     * costs a shadow ray per light per pixel on the exact path (`restir: false`,
     * or a cold pixel under `restirWarmAge`).
     */
    this._maxLights = clampMaxLights(options.maxLights);
    if (options.maxLights !== undefined && this._maxLights !== Math.floor(Number(options.maxLights))) {
      console.warn(
        `three-realtime-rt: maxLights ${options.maxLights} is out of range; using ${this._maxLights} ` +
          `(1..${MAX_LIGHTS_LIMIT}).`
      );
    }

    // [wave 14K] the render-target byte ledger the app hands in (src/memLedger.js
    // in the library; the game creates one, sets rt.memLedger, and logs the
    // drawing buffer through it). Every pass-target group reallocation logs a NEW
    // generation with its computed bytes; the ledger retires the old generation
    // under the deferred-free assumption, which is the peak-concurrent-bytes
    // measurement the iOS context-loss hunt needs. Null when no app attaches one,
    // and then every call below is a two-field check.
    this.memLedger = null;
    this._ledgerKeys = null;

    this.gbuffer = new GBufferPass(this._width, this._height, {
      mixedPrecision,
      materialPooling: options.gbufferMaterialPooling ?? true,
    });
    this.rtPass = new RTLightingPass(this._allocW, this._allocH, {
      specMRT: this.specMRTSupported,
      maxLights: this._maxLights,
    });
    this.denoisePass = new DenoisePass(this._allocW, this._allocH);
    // Separate à-trous instance for the specular buffer (its own ping-pong
    // targets, so the specular denoise cannot clobber the irradiance result).
    this.specDenoisePass = new DenoisePass(this._allocW, this._allocH, {
      blendIsSpec: true, // blend pixels here hold the behind-the-pane image
    });
    this.accumulatePass = new AccumulatePass(this._allocW, this._allocH);
    this.composite = new CompositePass();
    this.taaPass = new TAAPass(this._width, this._height);
    this._sceneColor = this._makeColorTarget(this._width, this._height);
    // Fullscreen blit used to carry history buffers across target reallocation
    // (renderScale steps / canvas resizes) instead of hard-clearing them.
    this._copyPass = new CopyPass();

    this.compiled = null;
    this.frame = 0;

    /**
     * OPTIONAL DENOISER PLUGIN (see setDenoiserPlugin). Null by default and
     * never touched when null, so the default render path is byte-identical to
     * a build without this hook. When set, the plugin replaces AccumulatePass +
     * the a-trous denoise + the specular denoise: it is handed the raw 1-spp
     * irradiance/specular pair and the G-buffer, and returns the clean pair the
     * composite consumes.
     */
    this._denoiserPlugin = null;
    /**
     * A-trous iterations run on the plugin's OUTPUT irradiance (0.16.4). 0 (the
     * default) runs nothing and the plugin path is byte-identical to 0.16.3; N
     * runs the same DenoisePass the built-in pipeline uses, N times, after the
     * plugin, as a spatial post-filter for a network that still flickers or
     * leaves residual noise. Live: assign at any time.
     */
    this.denoiserPluginPostIterations = options.denoiserPluginPostIterations ?? 0;
    /**
     * Temporal smoothing of the plugin's OUTPUT (0.16.4): frames of reprojected
     * exponential history blended over the network's irradiance (the same
     * AccumulatePass the built-in pipeline runs on RAW samples, here run on the
     * network's clean-but-flickering frames), before the spatial post passes.
     * 0 (default) = off, byte-identical; 4-16 = a young network's flicker
     * settles at the cost of a little lag on moving lights.
     */
    this.denoiserPluginPostHistory = options.denoiserPluginPostHistory ?? 0;
    /** Debug view: 0 composite, 1 albedo, 2 normal, 3 irradiance, 4 worldPos, 5 emissive, 6 specular, 7 bvh cost */
    this.outputMode = 0;
    /**
     * DEBUG VIEW: composite the RAW 1-spp lighting instead of the cleaned-up
     * lighting, i.e. show what the denoiser (the a-trous chain or a plugin) is
     * FED rather than what it produces. Off by default and inert when off, so
     * every existing mode renders byte-identically to a build without it.
     *
     * The buffer shown is exactly `rtPass.renderRaw()`'s output, so it needs the
     * split-accumulate MRT path; on a device without it the flag is simply
     * unavailable and does not half-apply.
     *
     * When it is on, three things are bypassed so nothing on screen is
     * smoothed: AccumulatePass (the temporal EMA), DenoisePass (the a-trous
     * blur), and the TAA resolve + its jitter. The composite's joint-bilateral
     * upsample is swapped for nearest-neighbour as well, so a lighting-res
     * noise pixel stays a square on screen instead of being filtered into its
     * neighbours.
     *
     * It does NOT change whether a denoiser plugin runs: the plugin still
     * executes and still advances its temporal history, so switching back shows
     * the picture it would have shown anyway.
     */
    this.rawInputView = false;
    /**
     * BVH-cost heatmap scale (outputMode 7): the per-pixel shadow-ray node-visit
     * count is multiplied by this before the palette, so 1/costScale visits map
     * to the hot (white) end. Default 1/96 — ~96 visits saturate. Live-tunable
     * (the demo's "cost scale" slider drives it).
     */
    this.costScale = options.costScale ?? 1 / 96;
    /**
     * Honour three's AmbientLight and HemisphereLight as an UNOCCLUDED ambient
     * term (default true, new in 0.15.0). Both were ignored before: neither has
     * a position to trace a shadow ray at, so neither can be a row in the light
     * table, and the renderer had no non-traced light path at all. That was
     * survivable while `gi` defaulted ON, because a GI ray that escapes the
     * scene returns `envColor` and every surface got SOMETHING; with `gi: false`
     * as the 0.15.0 default it is not, and a surface no light faces would render
     * pure black.
     *
     * SceneCompiler sums the visible AmbientLights into one colour and the
     * visible HemisphereLights into (sky, ground, up), and the lighting pass
     * adds `flat + mix(ground, sky, 0.5*dot(N, up) + 0.5)` to the DIRECT
     * irradiance — demodulated, so the composite multiplies it by albedo like
     * everything else. Three uniforms and a dot product: no ray, no shadow, no
     * loop, no sampler.
     *
     * It is NOT global illumination and is not sold as one. Nothing occludes it
     * (a closed box lit only by an AmbientLight renders flat), nothing carries
     * colour from one surface to another, and GI bounces do not pick it up.
     * `gi: true` remains the real thing. `false` here uploads zeros, which the
     * shader adds unconditionally, so OFF is bit-for-bit the pre-0.15 result.
     */
    this.ambient = options.ambient ?? true;
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
    /**
     * LIGHT-MOTION TEMPORAL RESPONSE. Default ON, because unlike camera motion
     * there is no case where keeping the stale result is correct.
     *
     * Every temporal validation the engine performs asks a geometric question:
     * is this pixel still the same surface (plane distance, normal agreement,
     * reprojection). A parked camera looking at a static wall answers "yes" to
     * all of them, so the EMA happily averages across a light that MOVED, and
     * keeps serving light that is no longer there. Measured on the
     * probe-lightghost bench (a light jumping A to B, camera and geometry
     * static): at maxHistory 48 the frame is still 47x the noise floor away
     * from correct 40 frames after the jump. That is the wispy tail behind a
     * moving light.
     *
     * updateLights() is the only way light data reaches the GPU (render() does
     * not re-read the scene's lights), which makes it the exact place to notice
     * the change. It measures how far the lights moved relative to the scene
     * size and how much their colour changed, and drives `lightMotion` (0..1)
     * from that, decaying over the following frames. The three temporal
     * accumulators are then lerped toward their *Moving counterparts by the
     * larger of camera motion and light motion, so a swept spotlight keeps a
     * short, responsive history and a parked scene keeps a long, quiet one.
     */
    this.lightAdaptive = options.lightAdaptive ?? true;
    /**
     * Light motion that counts as "full" response, as a fraction of the scene
     * diagonal moved since the previous updateLights call. 0.01 (1 percent of
     * the scene per update) is deliberately small: a swept spotlight crossing a
     * room in two seconds moves ~0.8 percent per frame, and that should already
     * read as fully moving.
     */
    this.lightMotionRef = options.lightMotionRef ?? 0.01;
    /** Per-frame decay of lightMotion once the lights stop changing. */
    this.lightMotionDecay = options.lightMotionDecay ?? 0.72;
    /**
     * Temporal-gradient rejection threshold, in standard deviations of the
     * pixel's own accumulated luminance. Only consulted while lightMotion > 0.
     * Lower = more eager to drop history when the light changes (faster
     * response, more noise); higher = more conservative.
     */
    this.lightGradK = options.lightGradK ?? 3.0;
    /**
     * Firefly cap for the traced glass path, in units of `fireflyClamp`
     * (so the default 4 means 4 x 4.0 = 16 luminance, the same budget the
     * specular path uses). 0 disables it, which is the pre-0.14 behaviour:
     * glass was the one radiance in the shader with no bound at all.
     */
    this.glassClampScale = options.glassClampScale ?? 4.0;
    /** Normalized light motion, 0 (lights parked) .. 1. Read-only. */
    this.lightMotion = 0;
    this._lightSig = null;
    this._mt = 0;
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
    /**
     * 1-bounce global illumination (traced indirect). DEFAULT OFF since 0.15.0.
     *
     * It is the most expensive thing in the renderer — one extra traced ray per
     * pixel per frame, which shades its hit with the full direct + NEE stack —
     * and it is the one feature whose absence a scene can be authored around.
     * The defaults must run well on hardware nobody sent us, so the heavy path
     * is the opt-in and the correctness fixes are the default. Turn it on for
     * colour bleed; it is a one-line change and the demo panel's most visible
     * switch.
     *
     * `ambient` (below) is what keeps `gi: false` from rendering every
     * light-facing-away surface pure black: an AmbientLight / HemisphereLight in
     * the scene now contributes an unoccluded flat term. That is not GI and the
     * docs say so.
     */
    this.gi = options.gi ?? false;
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
     * temporal accumulation + the denoiser absorb it.
     *
     * DEFAULT OFF since 0.15.0, and this is a correctness flip rather than a
     * cost one. It only ever applies when ReSTIR is OFF (the shader reads
     * `uRestirEnabled ? reservoir : uLightStochastic ? oneRandomLight : exact`),
     * and ReSTIR is on by default and is the cheap many-light path now. What
     * the old default actually did was silently redefine what `restir: false`
     * MEANS: not the exact per-light loop but one random light per pixel per
     * frame, which is the noisiest estimator in the renderer. Every "ReSTIR off"
     * reference taken in this project by flipping one flag was that estimator
     * (found the hard way — see the Hangar cold-fallback report). Off, `restir:
     * false` is the exact path, which is what a reference is for. The governor
     * still turns it ON when it needs the rays back.
     */
    this.stochasticLights = options.stochasticLights ?? false;
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
    /**
     * renderScaleMax (0.16.5): the CEILING the adaptive governor may climb to,
     * 0.2..1 (default 1 = unchanged behaviour). A phone or tablet GPU that
     * finds headroom otherwise walks renderScale up rung by rung, and every
     * rung reallocates every pass at the bigger size; on iOS Safari that
     * memory spike is what loses the WebGL context minutes into a session
     * (Hangar, 2026-08-17: flat texture/geometry counts, then a loss). The
     * app pins the ceiling instead of turning the governor off, so the
     * governor still steps DOWN freely. Live-assignable; lowering it below
     * the current scale clamps the scale on the next frame.
     */
    /**
     * 0.16.10: the lighting-resolution targets are allocated ONCE, at the
     * renderScale CAP, and a renderScale step renders into a SUB-RECT of them
     * (see lightingRect.js). Default ON. `false` restores the pre-0.16.10
     * behaviour (every step reallocates the whole lighting-resolution set)
     * and exists so a host can A/B the two paths (dev/governor-check.py does).
     */
    this.fixedLightingTargets = options.fixedLightingTargets !== false;
    // `renderScaleCap` is an alias for renderScaleMax: with fixed targets the
    // ceiling IS the allocation size, and that is what a host means by "cap".
    this._renderScaleMax = Math.min(
      1,
      Math.max(
        RealtimeRaytracer.MIN_RENDER_SCALE,
        options.renderScaleCap ?? options.renderScaleMax ?? 1
      )
    );
    /**
     * Allocation counters, for hosts and gates that need to PROVE the governor
     * stopped churning render targets. `lightingAllocations` counts (re)allocations
     * of the lighting-resolution set, `lightingRectChanges` counts governor steps
     * that only moved the sub-rect, `denoiserPluginAllocations` counts the
     * resizes handed to an attached plugin that has no setRect of its own.
     */
    this.lightingAllocations = 0;
    this.lightingRectChanges = 0;
    this.denoiserPluginAllocations = 0;
    this._rectW = 0;
    this._rectH = 0;
    this._ladder = null;
    this._ladderKey = null;
    this._ladderIdx = 0;
    this._ladderSlow = 0;      // consecutive slow governor samples
    this._ladderFast = 0;      // consecutive samples with headroom
    this._ladderLastMove = 0;  // performance.now() of the last rung move
    this._ladderLastDir = 0;   // -1 down, +1 up, 0 none yet
    /**
     * 0.16.6: the governor's FLOOR (0.2 default; a plugin's preferences may
     * raise it, and since 0.16.8 an upsampling plugin may lower it as far as
     * MIN_RENDER_SCALE).
     */
    this.renderScaleMin = Math.min(
      this.renderScaleMax,
      Math.max(RealtimeRaytracer.MIN_RENDER_SCALE, options.renderScaleMin ?? 0.2)
    );
    this._pluginRan = false;
    // 0.16.8: the post passes (temporal smoothing + a-trous) for a plugin whose
    // output pair sits OFF the lighting grid, e.g. a network that takes quarter
    // rays and upsamples. Created lazily at the OUTPUT size the first time such
    // a frame arrives with a non-zero knob, so a plugin that stays on the
    // lighting grid allocates nothing and that path stays byte-identical.
    this._pluginPostAccum = null;
    this._pluginPostDenoise = null;
    this._pluginPostW = 0;
    this._pluginPostH = 0;
    this._pluginPostRw = 0;
    this._pluginPostRh = 0;
    this._pluginPostGrid = null;   // [w, h] of the last post pass that ran, else null
    this._zeroSpec = null;         // 1x1 black: stands in for a specular the plugin did not return
    if (this._renderScale > this.renderScaleMax) this._renderScale = this.renderScaleMax;
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
    /**
     * GPU-cost timing for the adaptive governor (EXT_disjoint_timer_query_webgl2).
     *
     * "auto" (default) uses the extension where the browser exposes it and falls
     * back to speculative probing where it does not (Safari/iOS withhold it).
     * `false` forces the probe path — useful for testing the fallback on hardware
     * that HAS the extension, and for an app that would rather not issue timer
     * queries at all. `true` is the same as "auto" (there is nothing to force:
     * where the extension is missing there is no measurement to be had).
     *
     * WHY IT MATTERS. The governor's only signal used to be wall-clock frame
     * time, and a vsync-capped display pins that at the refresh period no matter
     * how much GPU headroom exists — so every gate that RAISES quality was
     * unreachable and the ladder was one-way. See _adaptQuality.
     */
    this.gpuTiming = options.gpuTiming ?? "auto";
    this._gpuTimer = this.gpuTiming === false ? null : new GpuTimer(renderer);
    // supported AND not disabled AND not given up on (see the staleness guard in
    // _adaptQuality: a timer that stops producing results must not freeze the
    // governor, so it degrades to the probe path rather than blocking).
    this._gpuActive = !!(this._gpuTimer && this._gpuTimer.supported);
    this._gpuNullSince = null;  // when costMs first went null (staleness guard)
    this._gpuGaveUp = false;
    /**
     * Speculative up-probe (the fallback when there is no GPU timer). Null when
     * none is in flight; otherwise { kind, from, at, ema } — see _adaptQuality's
     * probe section for why this exists and how a failed probe is unwound.
     */
    this._qProbe = null;
    this._qProbeBackoff = RealtimeRaytracer.PROBE_BASE_MS;
    /** The last up-step a probe tried and had to undo, as { kind, from, at }.
     *  Keyed by the STEP, so backing off a rung the scene cannot afford does not
     *  also slow down the climb back to it from further down. */
    this._qProbeFail = null;
    this._qEma = null;
    this._qLastT = null;
    this._qLastChange = 0;
    /** Frames observed by the governor; gates the first decision (see the
     *  warm-up note in _adaptQuality). */
    this._qSamples = 0;
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
    this.volumetricPass = new VolumetricPass(this._volW, this._volH, {
      maxLights: this._maxLights,
    });

    /**
     * ReSTIR direct lighting: per-pixel reservoirs converge onto the light
     * that matters most to each pixel (temporal reuse, one visibility ray at
     * shading). Cost is flat in light count; also greatly reduces emissive
     * area-light noise. On by default — turn off to compare estimators.
     */
    this.restir = options.restir ?? true;
    /**
     * How many reservoir winners the lighting pass shades per pixel, each with
     * its own visibility ray. DEFAULT 1 = the shipped behaviour, bit-identical.
     *
     * ReSTIR is not noisier than the full per-light loop because it samples
     * badly — it picks its one sample well. It is noisier because it spends ONE
     * sample where the full loop spends one per light plus one for the emissive
     * set. This is the dial for that: 2..4 shade the pixel's own winner plus
     * 1..3 NEIGHBOURING pixels' winners (the spatial stage already produced a
     * reservoir per pixel, so the extra winners are free to obtain — only the
     * extra shadow ray is paid for), averaged with a 1/N weight.
     *
     * Neighbours are validated exactly as the spatial stage validates a tap
     * (same plane, normal within ~26 degrees); an invalid tap falls back to the
     * pixel's own reservoir rather than being dropped, because dropping it
     * while still dividing by N would darken geometry edges.
     */
    this.restirSamples = options.restirSamples ?? 1;
    /** Neighbour-tap radius ceiling for restirSamples > 1, in lighting-buffer
     *  texels. 10 matches the spatial stage's own tap radius; larger taps
     *  decorrelate the extra samples more but fail validation more often. */
    this.restirSampleRadius = options.restirSampleRadius ?? 10;
    /**
     * COLD-PIXEL EXACT FALLBACK. Frames of validated temporal history a pixel's
     * reservoir must have carried before that reservoir is allowed to shade it.
     * DEFAULT 0 = off = the shipped behaviour.
     *
     * A just-revealed pixel — a camera move, an object sliding aside, a doorway
     * crossing — has no history at all: its reservoir is 8 uniform candidates
     * out of S = lights + emissive triangles, and shading it means one
     * visibility ray on the RIS winner. That is a bimodal estimate of the whole
     * light sum, neighbouring cold pixels pick different winners, and it takes
     * roughly a second of temporal accumulation to converge. That second is the
     * speckle people see at newly revealed edges.
     *
     * With this set, a pixel younger than N frames is shaded by the EXACT
     * per-light loop (one shadow ray per light plus one for the emissive set) —
     * the same path `restir: false` with `stochasticLights: false` uses. That
     * path is NOT cheap: measured 5-6x a ReSTIR frame at 29 lights (449 vs 74 ms
     * at rs 0.5, 124 vs 25 at rs 0.2, RTX 3060 under load), so this only pays
     * while the cold pixels are a small minority, and it is only a win once the
     * reprojection keeps thin-geometry pixels warm (see the game's notes). The reservoir
     * keeps streaming candidates underneath, so a pixel crossing the threshold
     * arrives with N x 8 candidates of history behind it.
     */
    this.restirWarmAge = options.restirWarmAge ?? 0;
    /**
     * DIRECTIONAL LIGHTS BYPASS THE RESERVOIR (DEFAULT ON since 0.15.0; false
     * restores the pre-0.15 behaviour). With it on, a directional light is
     * never a ReSTIR candidate
     * and never survives as an inherited winner; the lighting pass shades every
     * directional light exactly instead, once, in the same single call site the
     * exact path uses.
     *
     * WHY. A reservoir's target function is UNSHADOWED, and a directional light
     * has a large unshadowed contribution on every surface facing it while
     * being occluded on most interior surfaces. So the reservoir keeps electing
     * the sun, spends its one visibility ray on the wall between, and the pixel
     * resolves to zero — with the odd frame's runner-up showing through as a
     * bright speck. Measured in this game (dev/sun-edges-REPORT.md): turning
     * into the great-hall doorway, the entering wall renders nearly black with
     * bright specks under stock ReSTIR and cleanly with the sun's intensity
     * zeroed. Production ReSTIR renderers exclude directional lights for the
     * same reason.
     *
     * COST is one extra shadow ray per pixel per directional light — the
     * smallest light class in any scene here — and the RIS estimator stays
     * unbiased: the source pdf is untouched, the target function simply
     * excludes those lights, so a candidate slot spent on one is wasted rather
     * than wrong (one sun among 16-29 lights = 3-6% of candidates).
     */
    this.restirDirectionalBypass = options.restirDirectionalBypass ?? true;
    /**
     * RESERVOIR REPROJECTION THAT SURVIVES JITTER AND THIN GEOMETRY (DEFAULT ON
     * since 0.15.0; false restores the pre-0.15 behaviour). Two halves of one
     * fix in the ReSTIR temporal stage, both gated by this switch:
     *   1. the SUB-TEXEL correction AccumulatePass has always applied
     *      (`prevUv -= currUv - vUv`), because the G-buffer sample under a
     *      reservoir texel is TAA-jittered and so P does not project to the
     *      texel centre;
     *   2. a four-neighbour RESCUE: if the plane test at the reprojected texel
     *      fails, try the four axis neighbours and take the one whose surface
     *      agrees best, before declaring the history invalid.
     *
     * WHY. Without them, thin geometry never accumulates: TAA jitter walks the
     * lighting-res G-buffer sample across a baluster, the single-texel lookup
     * lands on the other surface, the plane test rejects it, and the reservoir
     * restarts from eight uniform candidates every frame. Measured before this
     * change: 22% of shaded pixels never reached age 12 at a frozen pose, as a
     * stipple tracing the balusters, the handrail, the chandelier arms and the
     * picture frames.
     *
     * COST is bounded and ALU-only: at most four extra uPrevGWorldPos fetches
     * and still exactly one uPrevReservoir fetch, on the pixels that failed.
     */
    this.restirReprojectionRescue = options.restirReprojectionRescue ?? true;
    /**
     * RESERVOIR CANDIDATES ARE DRAWN THE WAY NEE DRAWS THEM (DEFAULT ON since
     * 0.15.0; false restores the pre-0.15 behaviour, byte for byte).
     *
     * WHY. The temporal stage streams 8 candidates UNIFORMLY out of S = analytic
     * lights + emissive NEE triangles. In a room with 26 lights and 256 emissive
     * triangles a light bulb's triangle is a 1-in-282 pick, and most picks land
     * on lampshade, television and candle triangles that contribute nothing to
     * the pixel being shaded, so a cold reservoir holds 8 near-useless
     * candidates and needs a second of temporal reuse to find anything. The
     * EXACT path never had this problem: sampleEmissiveTri importance-samples the
     * emissive set through the power CDF the scene compiler already writes.
     *
     * With this on, each candidate first picks a POOL (analytic lights with
     * probability PL/(PL+PE), by power, clamped to [0.1, 0.9]) and then a member
     * of it by that pool's own power CDF, and the RIS weight divides by the
     * resulting pdf instead of by 1/S. RIS is unbiased for any source pdf whose
     * support covers the target's, and this one covers every candidate the
     * uniform pick could produce.
     *
     * COST is the 8-step binary search per emissive candidate plus one extra
     * rand() per candidate (pool choice), all ALU: no extra rays, no extra
     * texture rows. Measured in this game: see dev/candidates-REPORT.md.
     */
    this.restirCandidateImportance = options.restirCandidateImportance ?? true;
    /**
     * FIREFLY CAP ON THE RESTIR DIRECT TERM, RELATIVE TO THE PIXEL'S OWN
     * RESERVOIR TOTAL (DEFAULT 2 since 0.15.0; 0 = off = the absolute cap alone
     * = the pre-0.15 behaviour).
     *
     * WHY. The direct term out of a reservoir is capped at 2 x fireflyClamp,
     * while the exact per-light loop caps analytic lights nowhere. Because ReSTIR
     * spends ONE sample on the WHOLE light sum, f(Y)·W lands near the total when
     * the winner is visible and on zero when it is not: the distribution is
     * bimodal, the cap clips the peaks, nothing lifts the zeros, and a bright
     * surface converges DARK: the halo of missing light around each bulb.
     *
     * The reservoir already knows the answer: wSum/M is its own estimate of the
     * unshadowed light total at this pixel, so the cap becomes
     * max(2 x fireflyClamp, restirClampRel x that). 2 is "no more than twice
     * everything this pixel could receive", which still catches a genuine 1/d^2
     * spike (those are 100x) and lets a fully lit surface reach its own total.
     */
    this.restirClampRel = options.restirClampRel ?? 2;
    this.restirPass = new RestirPass(this._allocW, this._allocH, {
      maxLights: this._maxLights,
    });
    /**
     * LOCAL CANDIDATES (DEFAULT ON, new in 0.16.0). Draw the reservoir's
     * analytic-light candidates from a per-cell distribution (see LightGridPass)
     * instead of one scene-wide power CDF.
     *
     * WHY IT IS ON BY DEFAULT. The global CDF is fine while a scene has a
     * handful of lights and useless when it has eighty: in a corridor with three
     * lights per room, one candidate in thirty-two can reach the pixel at all,
     * and the reservoir spends its stream on lights behind walls — the same
     * "reveal noise" the 0.15.0 fixes removed, arriving by a different door. The
     * grid weights each light by what it could deliver to the pixel's own cell,
     * which is what makes a 96-light scene converge like an 8-light one.
     *
     * `false` = the 0.15.0 global CDF, from row 0 of the same texture, so the
     * candidate stream is the one 0.15.0 drew.
     */
    this.restirLightGrid = options.restirLightGrid ?? true;
    this.lightGridPass = new LightGridPass({ maxLights: this._maxLights });
    // Rebuild flags: the table is a function of the light set, the grid geometry
    // and the directional bypass, so exactly those three set it dirty.
    this._lightGridDirty = true;
    this._lightGridState = null;
    /**
     * Dynamic-mesh reservoir treatments, both DEFAULT OFF (nothing changes until
     * switched on). A moving mesh's pixels reject their reprojected history every
     * frame (camera-only reprojection lands on whatever was behind it last frame,
     * the plane test fails, M collapses to the fresh-candidate count), so the
     * moving aeroplane is permanently the noisiest thing on screen. Two fixes:
     *   restirDynamicAccept — on a dynamic-mesh pixel, skip the plane test and
     *     offer the co-located previous reservoir as a candidate (its light is
     *     re-evaluated at the true surface, so a wrong one loses on weight).
     *   restirDynamicFreeze — on a dynamic-mesh pixel, pass the previous
     *     reservoir through to history instead of overwriting it, so the wall
     *     behind the aeroplane keeps its history and the trailing edge stops
     *     disoccluding. Only sound for a SMALL dynamic object against a broadly
     *     similar background.
     */
    this.restirDynamicAccept = options.restirDynamicAccept ?? false;
    this.restirDynamicFreeze = options.restirDynamicFreeze ?? false;

    /**
     * MOTION VECTORS for temporal reprojection (DEFAULT ON since 0.15.0; false
     * restores the pre-0.15 camera-only reprojection). The G-buffer
     * writes, into a fifth RG32F attachment, each fragment's PREVIOUS screen
     * position (its last-frame clip position from the dynamic mesh's PREVIOUS
     * model matrix and uPrevViewProj), and the three temporal stages — the
     * irradiance EMA (AccumulatePass), the ReSTIR reservoir, and the TAA resolve
     * — look up history at that previous position instead of reprojecting the
     * CURRENT world position through uPrevViewProj.
     *
     * That camera-only reprojection is the bug for MOVING meshes: a point on
     * the aeroplane occupied different world space last frame, so the
     * reprojected history lands on whatever was behind it and every validation
     * test fails. For STATIC geometry the motion vector reduces exactly to the
     * camera-only path (the previous model matrix IS the current one), so a
     * static scene renders byte-identically with the option on or off.
     *
     * Rigid transforms only: a DEFORMING mesh (userData.rtDeforming) or a
     * SkinnedMesh needs previous-frame VERTEX positions, not a previous matrix,
     * so its motion vector uses the rigid previous matrix — it degrades to
     * today's camera-only-style reprojection for those vertices rather than
     * producing a wrong vector.
     *
     * Requires a GPU with >= 5 draw buffers (WebGL2 guarantees only 4). On a
     * device without it the option is ignored with a one-time warning and every
     * stage keeps camera-only reprojection.
     */
    this.motionVectors = options.motionVectors ?? true;
    this.motionVectorsSupported = RealtimeRaytracer._motionMrtSupported(renderer);
    this._motionVectorsActive = false;
    this._motionWarned = false;
    this._prevModelMatrices = new Map(); // dynamic mesh -> previous Matrix4
    // Per-stage consumption switches. NOT all on: measured on the Hangar great
    // hall, frame-to-frame residual in a crop that follows the moving aircraft,
    // mean / p95 over 61 frames —
    //
    //   off                5.39 / 8.69
    //   accumulation only  4.70 / 6.57     <- the win: -13% mean, -24% p95
    //   all three          6.44 / 7.69     <- WORSE on the mean than off
    //
    // The accumulation stage (the irradiance EMA) is where moving-object noise
    // actually lives, which is why it is the one that pays. TAA consuming the
    // same vectors is a clear regression here (taa-only measured 7.81 mean,
    // +46%) and raising taaBlend makes it worse, not better, so it is not a
    // simple history-lag. Until that is understood TAA stays on camera-only
    // reprojection, which is exactly what it did before motion vectors existed.
    this._motionAccum = true;
    this._motionRestir = true;
    this._motionTaa = false;

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
    this.giReservoirPass = new GIReservoirPass(this._allocW, this._allocH, {
      maxLights: this._maxLights,
    });
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

    // Scratch handed to a denoiser plugin every frame (see setDenoiserPlugin):
    // the history warp matrix and the four projection terms it needs to
    // reproject last frame's output. Allocated once, filled in render(), and
    // only read while a plugin is attached.
    this._denoiseWarp = new THREE.Matrix4();
    this._denoiseProj = [1, 1, 0, 0];

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

    // 0.16.10: the passes above were built at the ALLOCATION size; point them
    // at the live rect once, before the first frame. No history to carry yet,
    // so oldW/oldH are 0 (see _applyLightingRect).
    this._ladderIdx = this._nearestRung(this._renderScale);
    this._applyLightingRect(this._scaledW, this._scaledH, 0, 0);
    this._rectW = this._scaledW;
    this._rectH = this._scaledH;

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
    this._freshMeasurement();
    this._qLastT = null;
    this._qLastChange = 0;
    this._qLastDir = 0;
    this._qOscillating = false;
    this._qFastStreak = 0;
    this._qFreeWins = null;
    // An in-flight probe belonged to the OLD baseline; its "from" state is no
    // longer the thing to revert to, so drop it rather than let it undo a step
    // of the new preset.
    this._qProbe = null;
    this._qProbeBackoff = RealtimeRaytracer.PROBE_BASE_MS;
    this._qProbeFail = null;
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
      case "rt:lightgrid-weights":
      case "rt:lightgrid-cdf":
        // The grid only chooses which lights are PROPOSED, so losing it costs
        // candidate quality and nothing else. It takes importance sampling down
        // with it on purpose: the CDF now lives in this table, so a table that
        // was never built means the uniform-pick path (which reads none of it)
        // is the only correct fallback. Both are live toggles; the image stays
        // lit, noisier in a many-light scene.
        return {
          feature: "restirLightGrid",
          disable: () => {
            this.restirLightGrid = false;
            this.restirCandidateImportance = false;
          },
        };
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

    if (this._renderScale > this.renderScaleMin) {
      this.denoiseIterations = Math.min(this.denoiseIterations, 3);
      this.stochasticLights = true;
      this.renderScale = Math.max(this.renderScaleMin, Math.round(this._renderScale * 0.5 * 20) / 20);
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
    // maxLights rides along the same way: the compiled table's width and the
    // shaders' #define MUST agree, so the instance value always wins over a
    // stray option (a caller who passes a different one gets told).
    const compileOpts = options?.textureTiles !== undefined
      ? { ...options, maxLights: this._maxLights }
      : { ...options, textureTiles: this._textureTiles, maxLights: this._maxLights };
    if (options?.maxLights !== undefined && clampMaxLights(options.maxLights) !== this._maxLights) {
      console.warn(
        `three-realtime-rt: compileScene({ maxLights: ${options.maxLights} }) ignored — the ` +
          `shaders were built for maxLights: ${this._maxLights}. Pass it to the constructor instead.`
      );
    }
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
    this._syncLightGrid(true);
    // Tell the G-buffer which meshes are dynamic so it can flag their pixels
    // (gEmissive.a) for the reservoir passes.
    this.gbuffer.setDynamicMeshes(
      this.compiled.hasDynamic ? this.compiled.dynamic.map((s) => s.mesh) : null
    );
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
    this._measureLightMotion();
    this.rtPass.setTextureTiles(this._textureTiles);
    this.giReservoirPass.setTextureTiles(this._textureTiles);
    this.rtPass.setCompiledScene(this.compiled);
    this.volumetricPass.setCompiledScene(this.compiled);
    this.restirPass.setCompiledScene(this.compiled);
    this.giReservoirPass.setCompiledScene(this.compiled);
    // The table lives in the scene-data texture now, so this is where it reaches
    // the GPU. Only the light ROW is uploaded (see uploadLightRows) —
    // `needsUpdate` would re-send the whole texture, tile block included.
    // syncLights already decided whether anything actually changed, so an app
    // that calls updateLights every frame out of habit pays one compare loop.
    if (this.compiled.lightsChanged) {
      this._lightUpload = uploadLightRows(this.compiled, this.renderer);
      this._lightGridDirty = true;
    }
  }

  /**
   * Keep the light-grid table in step with the compiled scene and with the two
   * knobs its contents depend on, and rebuild it when something moved. Called
   * from compileScene (reallocate) and once per render (rebuild if dirty), so a
   * still scene pays nothing per frame.
   */
  _syncLightGrid(realloc) {
    if (!this.compiled || !this.lightGridPass) return;
    if (realloc) {
      this.lightGridPass.setCompiledScene(this.compiled, this._maxTextureSize);
      this._lightGridDirty = true;
      this._lightGridState = null;
    }
    // Contents depend on the light SET (updateLights sets the dirty flag), the
    // directional bypass (a bypassed sun is weighted zero) and whether the cell
    // rows are wanted at all — those last two are live toggles, so they are
    // compared rather than trusted.
    const state =
      (this.restirLightGrid ? 1 : 0) +
      "|" + (this.restirDirectionalBypass ? 1 : 0) +
      "|" + this.compiled.lightCount;
    if (state !== this._lightGridState) {
      this._lightGridState = state;
      this._lightGridDirty = true;
    }
    if (!this._lightGridDirty) return;
    this.lightGridPass.setCompiledScene(this.compiled, this._maxTextureSize);
    this.lightGridPass.build(this.renderer, {
      dirBypass: !!this.restirDirectionalBypass,
      cellRows: !!this.restirLightGrid,
    });
    this._lightGridDirty = false;
    this.restirPass.setLightGrid(this.lightGridPass.texture, !!this.restirLightGrid);
  }

  /**
   * Attach (or detach, with null) an EXTERNAL denoiser.
   *
   * The library ships one denoiser: the temporal EMA (AccumulatePass) followed
   * by the edge-aware a-trous blur (DenoisePass). This hook lets an application
   * replace that stage wholesale with its own - a different filter, a learned
   * denoiser, anything - without forking the renderer. Nothing about the plugin
   * is assumed beyond the four methods below; the library ships no plugin and
   * no plugin-specific code.
   *
   * WHERE IT SITS. The frame runs the G-buffer, the lighting pass (ReSTIR,
   * GI, the works) and then, instead of AccumulatePass + a-trous, calls
   *
   *   plugin.render(renderer, rawIrradiance, rawSpecular, gbuffer, viewMatrix,
   *                 { warp, proj, motion, frame })
   *
   * and composites the `{ irradiance, specular }` textures it returns exactly
   * where the a-trous output would have gone. Everything downstream is
   * unchanged: the composite's bilateral upsample, fog, sky, the volumetric
   * add, tonemapping and the TAA resolve all still run.
   *
   * WHAT IT IS GIVEN.
   *   rawIrradiance / rawSpecular  this frame's 1-spp lighting, at lighting
   *                                resolution, RGBA16F - `rtPass.renderRaw()`,
   *                                i.e. NO temporal history has been applied.
   *   gbuffer                      the live GBufferPass (albedoRough, normalMetal,
   *                                worldPos, emissive, and motion when active),
   *                                at canvas resolution.
   *   viewMatrix                   camera.matrixWorldInverse.
   *   warp                         prevViewProj * camera.matrixWorld: takes a
   *                                view-space position from this frame to the
   *                                previous frame's clip space, which is what a
   *                                temporal plugin needs to fetch its own
   *                                history. `prevViewProj` is the JITTERED,
   *                                overscan-widened matrix the previous frame
   *                                actually rendered with.
   *   proj                         [P00, P11, P02, P12] of this frame's
   *                                projection, jitter and overscan included, so
   *                                a plugin can rebuild view-space position
   *                                from depth on the exact grid the G-buffer
   *                                was rasterized on.
   *   motion                       gbuffer.motion when per-object motion
   *                                vectors are active (see `motionVectors`),
   *                                else null.
   *   frame                        the renderer's frame counter.
   *
   * REQUIREMENTS. The raw pair only exists on the split-accumulate MRT path
   * (`specMRTSupported && splitAccum`, the default on any device with
   * 2-attachment half-float MRT). On a device without it the plugin is skipped
   * and the built-in denoiser runs, so an app must not assume it ran; check
   * `rt.denoiserPluginActive`.
   *
   * LIFECYCLE. The renderer calls `plugin.setSize(w, h)` with the LIGHTING
   * resolution whenever that changes (a renderScale step or a canvas resize),
   * `plugin.resetHistory()` wherever every other temporal history in the
   * pipeline is dropped (resetAccumulation: scene recompile, camera cut, mode
   * switch, resize), and `plugin.dispose()` from `rt.dispose()`. Attaching a
   * plugin sizes it, drops its history and resets accumulation; detaching
   * resets accumulation. Swapping plugins does NOT dispose the outgoing one:
   * the application owns it and may re-attach it later.
   *
   * @param {{render: Function, setSize: Function, resetHistory: Function,
   *          dispose: Function} | null} plugin
   */
  /**
   * 0.16.8: the grid the plugin post passes last ran on, `[width, height]`, or
   * null if they did not run this frame (no plugin, a declined frame, the raw
   * debug view, or both knobs at 0). Read it to confirm the smoothing and the
   * a-trous are working on the resolution the plugin actually returned.
   * @returns {number[]|null}
   */
  get denoiserPluginPostGrid() {
    return this._pluginPostGrid ? [this._pluginPostGrid[0], this._pluginPostGrid[1]] : null;
  }

  /**
   * Allocate (or resize) the off-grid plugin post passes. Called only on a
   * frame whose plugin output is off the lighting grid AND has a non-zero post
   * knob, so nothing is allocated for a plugin that never needs them.
   * @private
   */
  /**
   * The post passes for a plugin output that is NOT on the lighting grid.
   * `w x h` is the ALLOCATION they are sized to; `rw x rh` is the live rect
   * inside it (0.16.11: a sub-rect plugin's output is an allocation with a rect
   * of its own, so these follow it the same way the lighting passes follow the
   * engine's). `rw/rh` default to the whole target, which is what a plugin
   * without `setRect` always hands over.
   * @private
   */
  _ensurePluginPost(w, h, rw = w, rh = h) {
    const resized = this._pluginPostW !== w || this._pluginPostH !== h;
    if (!this._pluginPostAccum) this._pluginPostAccum = new AccumulatePass(w, h);
    else if (resized) this._pluginPostAccum.setSize(w, h);
    if (!this._pluginPostDenoise) this._pluginPostDenoise = new DenoisePass(w, h);
    else if (resized) this._pluginPostDenoise.setSize(w, h);
    this._pluginPostW = w;
    this._pluginPostH = h;
    if (rw !== this._pluginPostRw || rh !== this._pluginPostRh || resized) {
      this._pluginPostAccum.setRect(rw, rh);
      this._pluginPostDenoise.setRect(rw, rh);
      this._pluginPostRw = rw;
      this._pluginPostRh = rh;
    }
  }

  /** 1x1 black, lazily made: a specular stand-in on a grid that has no raw pair. @private */
  _zeroSpecTex() {
    if (!this._zeroSpec) {
      this._zeroSpec = new THREE.DataTexture(new Float32Array([0, 0, 0, 1]), 1, 1, THREE.RGBAFormat, THREE.FloatType);
      this._zeroSpec.needsUpdate = true;
    }
    return this._zeroSpec;
  }

  /** @private */
  _disposePluginPost() {
    if (this._pluginPostAccum) { this._pluginPostAccum.dispose(); this._pluginPostAccum = null; }
    if (this._pluginPostDenoise) { this._pluginPostDenoise.dispose(); this._pluginPostDenoise = null; }
    if (this._zeroSpec) { this._zeroSpec.dispose(); this._zeroSpec = null; }
    this._pluginPostW = 0;
    this._pluginPostH = 0;
    this._pluginPostRw = 0;
    this._pluginPostRh = 0;
    this._pluginPostGrid = null;
  }

  setDenoiserPlugin(plugin) {
    if (plugin) {
      for (const m of ["render", "setSize", "resetHistory", "dispose"]) {
        if (typeof plugin[m] !== "function") {
          throw new Error(
            `RealtimeRaytracer.setDenoiserPlugin: plugin is missing ${m}(). A ` +
            "denoiser plugin must implement render, setSize, resetHistory and dispose."
          );
        }
      }
    }
    this._denoiserPlugin = plugin || null;
    this._pluginRan = false;
    // 0.16.8: the off-grid post passes belong to the plugin that needed them.
    // Detaching (or swapping) frees them; the next plugin that needs them
    // allocates its own at its own output size.
    this._disposePluginPost();
    if (!this.supported) return;
    if (this._denoiserPlugin) {
      // Size it to the CURRENT lighting resolution before its first frame: a
      // plugin constructed at some other size would otherwise read and write
      // the wrong texels for one frame.
      if (typeof this._denoiserPlugin.setRect === "function") {
        this._denoiserPlugin.setSize(this._allocW, this._allocH);
        this._denoiserPlugin.setRect(this._scaledW, this._scaledH, this._allocW, this._allocH);
      } else {
        this._denoiserPlugin.setSize(this._scaledW, this._scaledH);
      }
      this._denoiserPlugin.resetHistory();
      // 0.16.6: plugin PREFERENCES for the adaptive governor (NeuralRT's
      // LIBRARY-HOOKS.md hook 2: "plugin advertises, engine decides, game passes
      // through"). Plain data: { renderScale: { min, max, preferred } }. min/max
      // become the governor's bounds (never wider than the app's own
      // renderScaleMax); preferred is where the scale starts if it lies inside.
      const pref = this._denoiserPlugin.preferences && this._denoiserPlugin.preferences.renderScale;
      if (pref) {
        const appMax = this._appRenderScaleMax ?? this.renderScaleMax;
        this._appRenderScaleMax = appMax;
        // 0.16.8: the clamp is MIN_RENDER_SCALE, not the old 0.2. An upsampling
        // plugin traces at the low grid and reconstructs above it, so 0.2 was a
        // floor on the wrong quantity for it. An app that never attaches such a
        // plugin is unaffected: its own default floor is still 0.2.
        const FLOOR = RealtimeRaytracer.MIN_RENDER_SCALE;
        if (Number.isFinite(pref.max)) this.renderScaleMax = Math.min(appMax, Math.max(FLOOR, pref.max));
        if (Number.isFinite(pref.min)) this.renderScaleMin = Math.min(this.renderScaleMax, Math.max(FLOOR, pref.min));
        if (Number.isFinite(pref.preferred)) {
          const start = Math.min(this.renderScaleMax, Math.max(this.renderScaleMin, pref.preferred));
          if (Math.abs(start - this._renderScale) > 1e-6) this.renderScale = start;
        }
      }
      // 0.16.7: the plugin may also advertise how much of the built-in post
      // filtering its output wants (`postHistoryFrames`, `postIterations`, the
      // knobs 0.16.4 added). They fill the app's DEFAULTS only: a value the app
      // already set (non-zero) wins, and whatever came from the plugin is
      // cleared again when the plugin is removed.
      const p2 = this._denoiserPlugin.preferences || {};
      if (this._postFromPlugin) { this.denoiserPluginPostHistory = 0; this.denoiserPluginPostIterations = 0; }
      this._postFromPlugin = false;
      if (!(this.denoiserPluginPostHistory > 0) && Number.isFinite(p2.postHistoryFrames) && p2.postHistoryFrames > 0) {
        this.denoiserPluginPostHistory = Math.round(p2.postHistoryFrames);
        this._postFromPlugin = true;
      }
      if (!(this.denoiserPluginPostIterations > 0) && Number.isFinite(p2.postIterations) && p2.postIterations > 0) {
        this.denoiserPluginPostIterations = Math.round(p2.postIterations);
        this._postFromPlugin = true;
      }
    } else {
      if (this._appRenderScaleMax !== undefined) {
        // Plugin removed: the app's own ceiling comes back, the floor resets.
        this.renderScaleMax = this._appRenderScaleMax;
        this._appRenderScaleMax = undefined;
        this.renderScaleMin = 0.2;
      }
      if (this._postFromPlugin) {
        this.denoiserPluginPostHistory = 0;
        this.denoiserPluginPostIterations = 0;
        this._postFromPlugin = false;
      }
    }
    this.resetAccumulation();
  }

  /** 0.16.6: did the attached plugin resolve the LAST frame (false while it compiles or is unsupported)? */
  get denoiserPluginRan() { return !!this._pluginRan; }

  /** The attached denoiser plugin, or null. */
  get denoiserPlugin() { return this._denoiserPlugin; }

  /**
   * True when a plugin is attached AND the raw split-accumulate path it needs
   * is available, i.e. when the next frame will actually route the lighting
   * through it. False on a device without 2-attachment half-float MRT (or with
   * `splitAccum: false`), where the built-in denoiser runs instead.
   */
  get denoiserPluginActive() {
    return !!(this._denoiserPlugin && this.specMRTSupported && this._splitAccum);
  }

  resetAccumulation() {
    if (!this.supported) return;
    this._needsClear = true;
    if (this.taaPass) this.taaPass.reset();
    // A denoiser plugin's temporal history is accumulation too: every other
    // history in the pipeline is dropped here, and leaving the plugin's alone
    // would feed it a frame from before a scene recompile / mode switch /
    // resize. It costs one frame of stability and buys correctness.
    if (this._denoiserPlugin) this._denoiserPlugin.resetHistory();
  }

  /**
   * Compare the freshly synced light arrays against the previous ones and
   * update `lightMotion`. Called from updateLights, so it costs a few dozen
   * float compares per light on the frames the app already decided to re-upload
   * lights, and nothing at all otherwise.
   *
   * The signature is the flat uniform data itself (world position + type in
   * lightPosType, colour * intensity + radius in lightColorRadius), so it
   * catches everything the shader can see: movement, recolouring, dimming,
   * switching a light off, and a spot changing its cone. Position deltas are
   * normalized by the scene diagonal so the same code behaves the same in a
   * doll house and a city block; colour deltas are relative to the brighter of
   * the two values so a dim light changing by half counts as much as a bright
   * one doing the same.
   */
  _measureLightMotion() {
    const c = this.compiled;
    if (!c) return;
    const pos = c.lightPosType;
    const col = c.lightColorRadius;
    // Spotlight AIM lives in its own array. A swept spotlight is the single
    // most common animated light there is, and it usually rotates from a fixed
    // mount: position and colour never change, so a signature without this
    // reads a sweeping searchlight as perfectly still. (Measured: the stealth
    // game scene, whose whole premise is sweeping spotlights, reported light
    // motion 0.0000 at every percentile until this was added.)
    const dir = c.lightDirCone;
    const prev = this._lightSig;
    // Store a copy, not a reference: syncLights mutates these arrays in place.
    this._lightSig = {
      pos: Float32Array.from(pos),
      col: Float32Array.from(col),
      dir: Float32Array.from(dir),
    };
    if (!this.lightAdaptive) { this.lightMotion = 0; return; }
    // First sync, or the light SET changed (added, removed, switched off). No
    // per-light correspondence to compare, so treat it as a full change.
    if (!prev || prev.pos.length !== pos.length || prev.dir.length !== dir.length) {
      if (prev) this.lightMotion = 1;
      return;
    }
    const diag = c.sceneDiagonal > 0 ? c.sceneDiagonal : 1;
    let worst = 0;
    for (let i = 0; i < pos.length; i += 4) {
      const dx = pos[i] - prev.pos[i];
      const dy = pos[i + 1] - prev.pos[i + 1];
      const dz = pos[i + 2] - prev.pos[i + 2];
      // pos.w carries the type and, for spots, the inner-cone cosine, so a
      // cone that narrows registers here too.
      const dw = Math.abs(pos[i + 3] - prev.pos[i + 3]);
      const moved = Math.sqrt(dx * dx + dy * dy + dz * dz) / diag;
      worst = Math.max(worst, moved / this.lightMotionRef, dw);
      // Aim change. For a unit direction the chord length is the rotation angle
      // in radians for small angles, and a beam rotating by theta sweeps its
      // pool across the floor by roughly theta times the throw distance. Taking
      // the throw as about half the scene, theta/2 is the equivalent
      // fraction-of-scene motion, which puts it on the same scale as the
      // positional term above and lets one reference constant serve both.
      // dirCone.w is cos(outer angle), so a cone opening or closing lands here.
      const ddx = dir[i] - prev.dir[i];
      const ddy = dir[i + 1] - prev.dir[i + 1];
      const ddz = dir[i + 2] - prev.dir[i + 2];
      const aimed = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz) * 0.5;
      const dCone = Math.abs(dir[i + 3] - prev.dir[i + 3]);
      worst = Math.max(worst, aimed / this.lightMotionRef, dCone);
      for (let k = 0; k < 3; k++) {
        const a = col[i + k], b = prev.col[i + k];
        const scale = Math.max(Math.abs(a), Math.abs(b), 1e-4);
        worst = Math.max(worst, Math.abs(a - b) / scale);
      }
    }
    this.lightMotion = Math.max(this.lightMotion, Math.min(1, worst));
  }

  /**
   * The temporal-response blend factor for this frame: how "moving" the image
   * is, 0 (nothing changing) to 1. Camera motion only counts when the app opted
   * into motionAdaptive; light motion always counts, since stale lighting is
   * never the right answer.
   */
  _temporalMotion() {
    const cam = this.motionAdaptive ? this.motion : 0;
    return Math.max(cam, this.lightAdaptive ? this.lightMotion : 0);
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

  // The scale the lighting-resolution targets are ALLOCATED at: the cap with
  // fixed targets (and never below the live scale, so a host that sets
  // renderScale above its own ceiling still gets a target it fits in), the live
  // scale without them (the pre-0.16.10 behaviour).
  get _allocScale() {
    if (!this.fixedLightingTargets) return this._renderScale;
    return Math.min(1, Math.max(this._renderScale, this._renderScaleMax));
  }
  get _allocW() {
    return Math.max(1, Math.floor(this._width * this._allocScale));
  }
  get _allocH() {
    return Math.max(1, Math.floor(this._height * this._allocScale));
  }
  // The LIVE lighting rect: what renderScale actually asks for, never larger
  // than the allocation. Every pass's resolution/texel uniform is this size, so
  // shader-side arithmetic is identical to the reallocating path.
  get _scaledW() {
    return Math.min(this._allocW, Math.max(1, Math.floor(this._width * this._renderScale)));
  }
  get _scaledH() {
    return Math.min(this._allocH, Math.max(1, Math.floor(this._height * this._renderScale)));
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
   * Light-table capacity: how many analytic lights this instance can shade at
   * once (default 128, hard max 256). READ-ONLY after construction, and the
   * setter says so rather than accepting a value it cannot honour: the number is
   * baked into four shaders' `#define MAX_LIGHTS` and into the compiled scene's
   * texture width, so changing it means new programs and a recompile.
   *
   * Lights beyond the cap are dropped in traversal order, with survivors keeping
   * their seats (see SceneCompiler.syncLights).
   */
  get maxLights() {
    return this._maxLights;
  }
  set maxLights(v) {
    if (clampMaxLights(v) === this._maxLights) return;
    throw new Error(
      `three-realtime-rt: maxLights is a constructor option (currently ${this._maxLights}) and ` +
        "cannot be changed on a live renderer — it is compiled into every lighting shader and " +
        `into the scene-data texture. Construct with new RealtimeRaytracer(renderer, { maxLights: ${v} }).`
    );
  }

  /** Lights currently in the compiled table (0 with no compiled scene). */
  get lightCount() {
    return this.compiled ? this.compiled.lightCount : 0;
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
    this._ladderIdx = this._nearestRung(v);
    this.setSize(this._canvasW, this._canvasH);
  }

  /**
   * The ceiling the adaptive governor may climb to, and since 0.16.10 also the
   * size the lighting-resolution targets are ALLOCATED at. An accessor rather
   * than a field because those two jobs cannot drift apart: raising or lowering
   * the cap is now the one governor-adjacent thing that legitimately
   * reallocates, and it has to happen when the cap moves, not at some later
   * resize. Apps change it rarely (a quality preset, a plugin's preferences),
   * which is exactly why it is a safe place to put the allocation.
   */
  get renderScaleMax() {
    return this._renderScaleMax;
  }
  set renderScaleMax(v) {
    const next = Math.min(1, Math.max(RealtimeRaytracer.MIN_RENDER_SCALE, v));
    if (next === this._renderScaleMax) return;
    this._renderScaleMax = next;
    this._ladder = null; // rungs are fractions of the cap; rebuild on next use
    if (!this.supported || !this.rtPass) return;
    if (this._renderScale > next) this.renderScale = next; // setSize via the setter
    else this.setSize(this._canvasW, this._canvasH);
  }

  /** The renderScale ladder in force: descending absolute scales. */
  get scaleLadder() {
    const cap = this._renderScaleMax;
    const floor = Math.max(RealtimeRaytracer.MIN_RENDER_SCALE, this.renderScaleMin || 0.2);
    if (!this._ladder || this._ladderKey !== cap + ":" + floor) {
      this._ladderKey = cap + ":" + floor;
      const seen = new Set();
      this._ladder = [];
      for (const f of RealtimeRaytracer.SCALE_LADDER) {
        const v = Math.round(Math.min(cap, Math.max(floor, cap * f)) * 1000) / 1000;
        if (seen.has(v)) continue;
        seen.add(v);
        this._ladder.push(v);
      }
    }
    return this._ladder;
  }

  /** Index of the ladder rung closest to `s`. */
  _nearestRung(s) {
    const L = this.scaleLadder;
    let best = 0;
    for (let i = 1; i < L.length; i++) {
      if (Math.abs(L[i] - s) < Math.abs(L[best] - s)) best = i;
    }
    return best;
  }

  /**
   * What the sub-rect machinery is doing right now. Hosts (and dev/governor-check.py)
   * read this rather than guessing from sizes.
   */
  get lightingRect() {
    return {
      fixed: !!this.fixedLightingTargets,
      allocW: this._allocW,
      allocH: this._allocH,
      rectW: this._rectW,
      rectH: this._rectH,
      scale: this._renderScale,
      cap: this._renderScaleMax,
      ladder: this.scaleLadder.slice(),
      rung: this._ladderIdx || 0,
      allocations: this.lightingAllocations,
      rectChanges: this.lightingRectChanges,
      pluginAllocations: this.denoiserPluginAllocations,
      // A plugin that cannot follow a sub-rect keeps reallocating its own
      // targets on every step; the engine's do not. See setDenoiserPlugin.
      pluginFixed: !this._denoiserPlugin || typeof this._denoiserPlugin.setRect === "function",
    };
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

    // 0.16.10: two independent quantities. The ALLOCATION (aw x ah) is the
    // renderScale cap and changes only when the cap or the canvas does; the
    // RECT (sw x sh) is what renderScale asks for this instant and is free.
    const aw = this._allocW;
    const ah = this._allocH;
    const sw = this._scaledW;
    const sh = this._scaledH;
    const oldAw = this.rtPass.targetA.width;
    const oldAh = this.rtPass.targetA.height;
    const oldRectW = this._rectW || oldAw;
    const oldRectH = this._rectH || oldAh;
    const scaledChanged = oldAw !== aw || oldAh !== ah;
    const rectChanged = !scaledChanged && (oldRectW !== sw || oldRectH !== sh);
    const canvasChanged =
      this.taaPass.targetA.width !== this._width ||
      this.taaPass.targetA.height !== this._height;

    // Lighting-resolution targets (change on both a renderScale step and a
    // canvas resize). Carry the irradiance history, the buffer whose reset
    // causes the flash, and reallocate the rest. The ledger logs the NEW
    // generation first; it retires the old bytes under the deferred-free
    // assumption, which is the peak-concurrent-bytes reading a ladder move
    // produces on iOS.
    if (scaledChanged) {
      this._ledgerScaled();
      this.lightingAllocations++;
      this.rtPass.resizeCarry(
        this.renderer,
        this._copyPass,
        aw,
        ah,
        RealtimeRaytracer.HISTORY_CARRY_FRAMES,
        // Read the OLD allocation's live rect, write the NEW allocation's.
        { srcScaleX: oldRectW / oldAw, srcScaleY: oldRectH / oldAh, rectW: sw, rectH: sh }
      );
      this.denoisePass.setSize(aw, ah); // display-only, no temporal state
      this.specDenoisePass.setSize(aw, ah); // ditto; spec history lives in rtPass
      this.accumulatePass.setSize(aw, ah);
      // ReSTIR reservoirs store packed id·64+M encodings — invalid to linearly
      // resample — but they reconverge in a few frames, so just reallocate and
      // clear them.
      this.restirPass.setSize(aw, ah);
      this.restirPass.clearHistory(this.renderer);
      // Reservoir GI history is packed (hit position + M + radiance + W) —
      // invalid to linearly resample — but reconverges in a few frames, so
      // reallocate and clear like the DI reservoirs.
      this.giReservoirPass.setSize(aw, ah);
      this.giReservoirPass.clearHistory(this.renderer);
      // The rect inside the fresh allocation, plus the plugin's own resize.
      this._applyLightingRect(sw, sh, 0, 0);
    } else if (rectChanged) {
      // THE GOVERNOR'S PATH since 0.16.10: no allocation at all, just a smaller
      // (or larger) rect of the same targets, with the temporal history carried
      // across it. This is the line the owner's iPhone was paying for.
      this.lightingRectChanges++;
      this._applyLightingRect(sw, sh, oldRectW, oldRectH);
    }
    this._rectW = sw;
    this._rectH = sh;

    // Full-res / canvas-res targets: only touched on a real canvas resize (a
    // renderScale step leaves them alone, so TAA keeps its resolved history).
    if (canvasChanged) {
      this._ledgerFull();
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
   * Point every lighting-resolution pass at a `sw x sh` rect of the (already
   * allocated) targets. `oldW/oldH` is the rect the temporal history was
   * written at; 0 means there is no history worth carrying (a fresh allocation
   * just wrote it, or this is the first call).
   *
   * WHAT SURVIVES A RUNG STEP, and it is exactly what survived a reallocation:
   *   irradiance + specular EMA   carried (resampled rect -> rect, count clamped
   *                               to HISTORY_CARRY_FRAMES, no reset flash)
   *   TAA resolved history        untouched: it is canvas-res, and a rung step
   *                               does not touch canvas-res targets at all
   *   volumetric history          untouched (quarter-canvas, same reason)
   *   AccumulatePass EMA          cleared, as setSize always cleared it: a count
   *                               written on another grid freezes the EMA
   *   ReSTIR / GI reservoirs      cleared, as before: packed encodings cannot be
   *                               resampled, and they reconverge in a few frames
   */
  _applyLightingRect(sw, sh, oldW, oldH) {
    this.rtPass.setRect(sw, sh);
    if (oldW > 0 && oldH > 0 && (oldW !== sw || oldH !== sh)) {
      this.rtPass.rectCarry(
        this.renderer,
        this._copyPass,
        oldW,
        oldH,
        RealtimeRaytracer.HISTORY_CARRY_FRAMES
      );
    }
    this.denoisePass.setRect(sw, sh);
    this.specDenoisePass.setRect(sw, sh);
    this.accumulatePass.setRect(sw, sh);
    this.restirPass.setRect(sw, sh);
    this.giReservoirPass.setRect(sw, sh);
    if (oldW > 0) {
      this.restirPass.clearHistory(this.renderer);
      this.giReservoirPass.clearHistory(this.renderer);
    }
    // An external denoiser runs on the lighting grid too. A plugin that
    // implements the optional `setRect(rectW, rectH, allocW, allocH)` follows
    // the sub-rect and allocates nothing; one that does not gets the old
    // `setSize(rect)` contract and reallocates its own targets, which is
    // counted (denoiserPluginAllocations) rather than hidden.
    const p = this._denoiserPlugin;
    if (p) {
      if (typeof p.setRect === "function") p.setRect(sw, sh, this._allocW, this._allocH);
      else {
        p.setSize(sw, sh);
        this.denoiserPluginAllocations++;
      }
    }
  }

  // -------------------------------------------------- [wave 14K] byte ledger ---
  // The app hands in a memLedger (src/memLedger.js). Every render-target group
  // this engine allocates/reallocates reports its COMPUTED bytes here, named, so
  // the loss forensics can say what was resident and what the peak was across a
  // ladder move. A reallocation is logged as a NEW generation (the ledger retires
  // the old bytes under the deferred-free assumption), which is exactly the
  // concurrent-resident measurement the ladder suspect needs.
  _ledgerAlloc(key, w, h, attachments, bpp, label) {
    const ml = this.memLedger;
    if (!ml) return;
    const bytes = Math.max(0, Math.round(w * h * attachments * bpp));
    if (!this._ledgerKeys) this._ledgerKeys = new Set();
    this._ledgerKeys.add(key);
    ml.alloc(key, bytes, { w, h, attachments, bpp, label });
  }

  // The lighting-resolution set: reallocated on both a renderScale step and a
  // canvas resize. Attachments and bytes-per-texel per pass target group, from
  // each pass class's makeTarget/_makeTarget (fp16 RGBA = 8 B/texel, fp32 RGBA
  // = 16).
  _ledgerScaled() {
    // The ALLOCATION, not the live rect: this ledger measures resident bytes,
    // and since 0.16.10 those are the cap's, whatever rung the governor is on.
    const w = this._allocW, h = this._allocH;
    if (w < 1 || h < 1) return;
    const spec = this.specMRTSupported;
    this._ledgerAlloc('rt.lighting', w, h, spec ? 4 : 2, 8,
      'lighting main+history' + (spec ? ' (2x2 fp16)' : ' (2x1 fp16)'));
    if (spec) this._ledgerAlloc('rt.lighting.spec', w, h, 2, 8, 'specular main+history');
    this._ledgerAlloc('rt.denoise', w, h, 2, 8, 'a-trous ping-pong');
    this._ledgerAlloc('rt.specDenoise', w, h, 2, 8, 'specular a-trous ping-pong');
    this._ledgerAlloc('rt.accumulate', w, h, 6, 8, 'EMA irradiance+spec+moments (2x3)');
    this._ledgerAlloc('rt.restir', w, h, 5, 16, 'reservoirs (2x2 fp32) + spatial');
    this._ledgerAlloc('rt.giReservoir', w, h, 6, 16, 'GI reservoirs (2x3 fp32)');
  }

  // The canvas-res set (plus the quarter-canvas fog): reallocated only on a real
  // canvas resize, never on a renderScale step.
  _ledgerFull() {
    const w = this._width, h = this._height;
    if (w < 1 || h < 1) return;
    const motion = !!(this.gbuffer && this.gbuffer._motionEnabled);
    // 3x fp16 + 1x fp32 position (+1x RG32F motion) + depth24, mixed precision:
    // 4 attachments at ~13 B/texel, 5 at ~12.
    this._ledgerAlloc('rt.gbuffer', w, h, motion ? 5 : 4, motion ? 12 : 13,
      'G-buffer MRT mixed + depth' + (motion ? ' + motion' : ''));
    this._ledgerAlloc('rt.taa', w, h, 2, 8, 'TAA ping-pong');
    this._ledgerAlloc('rt.sceneColor', w, h, 1, 8, 'final composite target');
    this._ledgerAlloc('rt.volumetric', this._volW, this._volH, 2, 8, 'quarter-canvas fog ping-pong');
  }

  // Log the whole current footprint at once. The app calls this right after
  // attaching the ledger at boot, so the ledger starts from the real state
  // rather than empty (the passes are constructed before the app can attach).
  _ledgerSync() {
    if (!this.memLedger) return;
    this._ledgerScaled();
    this._ledgerFull();
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
    //
    // PINNED options: an option passed explicitly at construction (e.g. restirGI:
    // false) is recorded in _qPinned and must never be changed by the governor —
    // not taken as a free win, and not restored on the way back up. The simplest
    // rule that also meets the symmetry requirement ("pinned true must equally
    // not be turned off") is: never write a pinned key. That means never recording
    // it in `prev`, so _releaseFreeWins has nothing to restore for it either.
    const prev = { scale: this._renderScale };
    let took = false;
    if (this.gi && !this.giHalfRate && !this._qPinned.has("giHalfRate")) {
      prev.giHalfRate = false;
      this.giHalfRate = true;
      took = true;
    }
    // restirGI: vetoed from the free wins on 2026-07-27 (chromatic confetti,
    // worst in colourful-bounce scenes), reinstated the same day after the
    // Rao-Blackwellized chroma resolve fixed it and on-device review approved
    // the look. History in docs/QUALITY_CAMPAIGN_2026-07.md.
    if (this.gi && this.denoise && this.denoiseIterations > 0 && !this.restirGI && !this._qPinned.has("restirGI")) {
      prev.restirGI = false;
      this.restirGI = true;
      took = true;
      if (this.denoiseIterations > RealtimeRaytracer.GOVERNOR_MAX_DENOISE) {
        prev.denoiseIterations = this.denoiseIterations;
        this.denoiseIterations = RealtimeRaytracer.GOVERNOR_MAX_DENOISE;
      }
    }
    // restirMCap: the campaign's one unconditional win (better on every metric),
    // so the governor lowers it from the old default 40 to 16. Unlike the two
    // boolean toggles above, this is a numeric quality knob, but the principle is
    // the same: if the caller explicitly picked a value, the governor must not
    // override it.
    if (this.restirMCap > 16 && !this._qPinned.has("restirMCap")) {
      prev.restirMCap = this.restirMCap;
      this.restirMCap = 16;
      took = true;
    }
    this._qFreeWins = prev; // even when empty: the check is now settled
    if (!took) return false;
    this._recordChange(-1, now);
    this._freshMeasurement(); // cost profile changed — measure fresh
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
    this._freshMeasurement();
    console.info(`three-realtime-rt: adaptive quality → returned ${keys.join(", ")}`);
    return true;
  }

  // ---- adaptive quality governor: continuous dynamic resolution scaling ----
  // Measures the frame's cost and steers renderScale toward targetFps, in 0.05
  // steps with a cooldown so target reallocation and accumulation resets stay
  // rare.
  //
  // TWO CLOCKS, AND WHY. Wall-clock frame time is what the user experiences, and
  // it is the right signal for "we are too slow" — but under a vsync cap it is
  // the ONLY thing it can say. A 60Hz display returns 16.7ms whether the GPU
  // spent 3ms or 16ms on the frame, so every gate that RAISED quality
  // (`ratio < dbLo`, and the free-win release's `ratio < 0.5`) was unreachable
  // on ordinary hardware and the ladder was one-way: any transient — a shader
  // compile, an asset load, another window taking the GPU — cost quality that
  // was never given back for the life of the page. Measured in this game before
  // the fix: renderScale 0.5 at load, 0.2 (the floor) plus a 0.75 canvas within
  // twelve seconds, and then 0.20 for every one of the next sixty-three samples
  // at a steady 16.7ms. 0.2 means the ray traced LIGHTING was being solved at a
  // twenty-fifth of the pixels, permanently, on a card with headroom to spare.
  //
  // So DOWN is judged on the wall clock exactly as before (plus a GPU safety
  // net), and UP is judged on measured GPU milliseconds — the one number a
  // vsync cap cannot flatten. Where the timer extension is missing (Safari and
  // iOS withhold it) UP falls back to speculative probing: raise one rung, keep
  // it if the wall clock does not degrade, put it back and wait longer if it
  // does. Both paths are asymmetric by construction — a raise needs a dwell, a
  // predicted-cost check and one rung at a time; a drop needs one measurement
  // and may take five rungs at once.
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
    // A ceiling lowered live (the app's quality preset) clamps the scale here,
    // once, through the same setter a manual change uses.
    if (this._renderScale > this.renderScaleMax) this.renderScale = this.renderScaleMax;
    // Ladder mode: a scale set from outside the ladder (a URL override, an app
    // preset, a plugin's preferred start) is snapped to the nearest rung once,
    // so every later move is a rung move and the rung set is closed.
    if (this._ladderOn && !this._ladderSnapped) {
      this._ladderSnapped = true;
      const L = this.scaleLadder;
      const r = L[this._nearestRung(this._renderScale)];
      if (Math.abs(r - this._renderScale) > 1e-6) this._commitScale(r, 0, performance.now());
    }
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
    // WARM-UP. The EMA used to seed from a SINGLE sample and _qLastChange
    // initialised to 0, so the cooldown was already satisfied on the first
    // call: the governor's first decision was made from one frame that
    // typically contained compileScene and the megakernel shader link. On a
    // vsync-capped display that decision took the free wins (giHalfRate and
    // restirGI) permanently, because their release gate needs ratio < 0.5, i.e.
    // a refresh above 110Hz. Verified on the shipped gallery before this
    // change: giHalfRate and restirGI were both on by frame 3 of every page
    // load, and still on, unreleasable, at frame 476.
    //
    // Requiring a real sample count before the first decision costs a second of
    // conservative rendering at startup and removes an entire class of
    // permanent, invisible quality loss. It does not weaken the emergency
    // path: _overloadBrake is independent of the governor and still reacts to
    // catastrophic frames from the very first one.
    this._qSamples = (this._qSamples || 0) + 1;
    if (this._qSamples < RealtimeRaytracer.GOVERNOR_WARMUP_FRAMES) return;
    // A reversal marks the governor as hunting a boundary; a long quiet spell
    // un-marks it. See OSCILLATION_FORGET_MS — without this, one recovery step
    // after a transient pins the cautious thresholds on for the whole page.
    if (
      this._qOscillating &&
      now - this._qLastChange > RealtimeRaytracer.OSCILLATION_FORGET_MS
    ) {
      this._qOscillating = false;
    }

    const budget = 1000 / this.targetFps;
    const wall = this._qEma / budget;
    const util = this._gpuUtilisation(now, budget);

    // LADDER HYSTERESIS (0.16.10). Counted on EVERY governor sample, not only
    // on the ones that survive the cooldown: the streaks are the evidence that
    // a condition PERSISTED, and sampling them once per cooldown window would
    // make them a second cooldown rather than a second opinion.
    if (this._ladderOn) {
      const slowNow = wall > (this._qOscillating ? 1.24 : 1.12) ||
        (util != null && util > (this._qOscillating
          ? RealtimeRaytracer.GPU_BUDGET_DROP_OSC
          : RealtimeRaytracer.GPU_BUDGET_DROP));
      // Headroom. With a GPU timer that is a measurement. Without one (Safari,
      // iOS) a vsync-capped wall clock can never read "fast", so a COMFORTABLE
      // frame counts instead: the speculative climb, but now it has to hold for
      // LADDER_UP_STREAK samples and clear the dwell and reversal locks before
      // it moves anything.
      const fastNow = util != null
        ? util < (this._qOscillating
            ? RealtimeRaytracer.GPU_TARGET_UTIL_OSC
            : RealtimeRaytracer.GPU_TARGET_UTIL)
        : !slowNow && (wall < (this._qOscillating ? 0.6 : 0.8) || !this.gpuTimingActive);
      this._ladderSlow = slowNow ? this._ladderSlow + 1 : 0;
      this._ladderFast = fastNow ? this._ladderFast + 1 : 0;
    }

    // A probe in flight is judged on its OWN clock, which is shorter than the
    // cooldown, and nothing else may move until it has been judged: the probe
    // is a controlled experiment and a second change during it would make the
    // result unattributable.
    if (this._qProbe) {
      this._judgeProbe(now, wall, util);
      return;
    }

    // Calmness: normally 2s between changes. When the last two steps reversed
    // direction the governor is hunting the boundary, so hold for 5s AND widen
    // the "comfortable" deadband — both push it to commit to a level instead of
    // ping-ponging (each ping-pong is a target reallocation).
    const cooldown = this._qOscillating ? 5000 : 2000;
    if (now - this._qLastChange < cooldown) return;

    const dbLo = this._qOscillating ? 0.6 : 0.8;
    const dbHi = this._qOscillating ? 1.24 : 1.12;
    const dropUtil = this._qOscillating
      ? RealtimeRaytracer.GPU_BUDGET_DROP_OSC
      : RealtimeRaytracer.GPU_BUDGET_DROP;

    // SLOW is the wall clock's call, exactly as it always was, with the GPU
    // clock as a second opinion that can only ever ADD a drop. Note the wall
    // clock is deliberately never overruled by a comfortable GPU reading: a
    // CPU-bound frame is still a slow frame, and while dropping resolution will
    // not fix it, the alternative (a governor that decides the problem is not
    // its department) is how a scene becomes unplayable.
    const slow = wall > dbHi || (util != null && util > dropUtil);
    // FAST — meaning "there is headroom worth spending" — cannot be read off a
    // vsync-capped wall clock at all. With a GPU measurement it is a real
    // question; without one, wall < dbLo still detects headroom on an UNCAPPED
    // display (a 144Hz panel, a headless capture), and the probe path covers
    // the capped case.
    const raiseUtil = this._qOscillating
      ? RealtimeRaytracer.GPU_TARGET_UTIL_OSC
      : RealtimeRaytracer.GPU_TARGET_UTIL;
    const fast = util != null ? util < raiseUtil : wall < dbLo;

    if (!slow && !fast) {
      this._qFastStreak = 0;
      // Comfortable. On a capped display with NO GPU timer this is the only
      // place the governor can ever be — "fast" is unreachable there — so it is
      // where the speculative climb has to be driven from. Gated on
      // gpuTimingActive rather than on `util == null` so a momentary gap in the
      // timer's samples (a GPU_DISJOINT, the window just after a quality step)
      // does not start a probe on a machine that has a real measurement coming.
      if (!this.gpuTimingActive) this._raiseQuality(now, null, wall);
      return;
    }

    if (slow) {
      this._qFastStreak = 0;
      // STEP 1 (down): the free wins, before any resolution is given up.
      if (this._takeFreeWins(now)) return;

      // STEP 2 (down), ladder mode: one rung, and only once the slow condition
      // has held for LADDER_DOWN_STREAK samples and the dwell / reversal locks
      // allow it. The canvas ladder still takes over at the bottom rung.
      if (this._ladderOn) {
        if (this._ladderIdx >= this.scaleLadder.length - 1) {
          if (
            this.canvasScaleHook &&
            this._canvasLevelIdx < RealtimeRaytracer.CANVAS_LEVELS.length - 1 &&
            this._ladderSlow >= RealtimeRaytracer.LADDER_DOWN_STREAK
          ) {
            this._setCanvasLevel(this._canvasLevelIdx + 1, -1, now);
            this._ladderSlow = 0;
          }
          return;
        }
        this._ladderMove(-1, now);
        return;
      }

      // Proportional step, on whichever clock is the more alarmed. Lighting cost
      // ≈ scale², so the correction is a damped power of the error.
      const err = Math.max(wall, util == null ? 0 : util);
      let s = this._renderScale * Math.pow(1 / err, 0.35);
      // Per-step clamp. Now that multi-hundred-millisecond frames feed the EMA, a
      // single very slow measurement (err can reach ~100 at dt 2s) would
      // otherwise slam the scale from 1.0 to the 0.2 floor in ONE step and throw
      // away the image on a transient. Move at most MAX_SCALE_STEP per adaptation
      // (5 ladder steps) and let the cooldown take the next one if it is still slow.
      s = Math.max(this._renderScale - RealtimeRaytracer.MAX_SCALE_STEP, s);
      s = Math.round(Math.min(1, Math.max(this.renderScaleMin || 0.2, s)) * 20) / 20; // 0.05 steps (0.16.6: floor)

      // When renderScale has ALREADY BOTTOMED OUT — it is at the 0.2 floor, not
      // merely near it — step DOWN the canvas ladder, the deepest,
      // quadratic-on-every-pass lever. The old condition fired at renderScale
      // 0.25, one rung early; the campaign's cost-matched A/B says that rung
      // belongs to renderScale (full canvas at renderScale 0.2 beats canvas 0.85
      // at renderScale 0.2: rmse 9.53 vs 11.42 museum, 7.05 vs 8.98 tokyo, and
      // sharpRatio 0.96 vs 0.65-0.69 in both), so renderScale walks all the way
      // to its floor before the canvas is touched at all.
      if (
        s <= 0.2 &&
        this._renderScale <= 0.2 &&
        this.canvasScaleHook &&
        this._canvasLevelIdx < RealtimeRaytracer.CANVAS_LEVELS.length - 1
      ) {
        this._setCanvasLevel(this._canvasLevelIdx + 1, -1, now);
        return;
      }
      if (this._renderScale - s < 0.045) return;
      this._commitScale(s, -1, now);
      return;
    }

    // UP. A dwell first: the headroom has to still be there on the next
    // adaptation (~2s later) before anything moves. One quiet moment in a heavy
    // scene is not headroom, it is a pause between two hard frames.
    this._qFastStreak = (this._qFastStreak || 0) + 1;
    if (this._qFastStreak < RealtimeRaytracer.GOVERNOR_UP_DWELL) return;
    this._raiseQuality(now, util, wall);
  }

  /**
   * The tracer's GPU cost as a fraction of the frame budget, or null when there
   * is no usable measurement — which is the fallback path's cue, not an error.
   *
   * A timer that is SUPPORTED but silent is treated as broken after
   * GPU_STALE_MS and abandoned for good, because the alternative is a governor
   * that waits forever for a number and never adapts again. GPU_DISJOINT (a
   * clock change, a context switch away from the tab) legitimately empties the
   * window, so short gaps are normal and only a sustained one counts.
   */
  _gpuUtilisation(now, budget) {
    // gpuTimingActive (not the raw _gpuActive) so that `rt.gpuTiming = false` at
    // runtime really does move the governor onto the probe path: the two must
    // agree, or the governor lands in a dead zone where it has no measurement
    // AND does not think it needs to probe. Observed exactly that. Turning it
    // off leaves the timer allocated and running (one begin/end pair per frame);
    // pass gpuTiming: false to the constructor to not build it at all.
    if (!this.gpuTimingActive) return null;
    const ms = this._gpuTimer.costMs;
    if (ms == null) {
      if (this._gpuNullSince == null) this._gpuNullSince = now;
      else if (now - this._gpuNullSince > RealtimeRaytracer.GPU_STALE_MS) {
        this._gpuGaveUp = true;
        console.info(
          "three-realtime-rt: GPU timing stopped returning results — adaptive " +
            "quality falls back to speculative probing for headroom."
        );
      }
      return null;
    }
    this._gpuNullSince = null;
    return ms / budget;
  }

  /** Predicted cost multiplier of moving renderScale from `from` to `to`. */
  static _scaleStepCost(from, to) {
    let m = 1 + RealtimeRaytracer.SCALE_COST_SHARE * ((to / from) ** 2 - 1);
    // Crossing 0.55 also switches direct lighting from stochastic (one light per
    // pixel per frame) to the full per-light loop, which no resolution model
    // sees. Charge for it, generously: in this game's great hall the full loop
    // against stochastic is the difference between one shadow ray and 23.
    if (
      RealtimeRaytracer._qualityFor(to).stochasticLights !==
      RealtimeRaytracer._qualityFor(from).stochasticLights
    ) {
      m *= RealtimeRaytracer.STOCHASTIC_STEP_FACTOR;
    }
    return m;
  }

  /**
   * One rung UP, in the exact reverse of the descent's spending order, and at
   * most one rung per call. Returns true if anything moved.
   *
   * LIFO with the descent: canvas scale is restored first (the coarsest and
   * most valuable resolution, quadratic on every pass), then renderScale one
   * 0.05 rung at a time, and the free wins last of all — they are cheaper AND
   * no worse than what they replace, so they are the last thing worth paying
   * resolution for.
   */
  _raiseQuality(now, util, wall) {
    const L = RealtimeRaytracer.CANVAS_LEVELS;
    if (this.canvasScaleHook && this._canvasLevelIdx > 0) {
      const from = this._canvasLevelIdx;
      return this._takeUpStep("canvas", from, (L[from - 1] / L[from]) ** 2, util, now);
    }
    if (this._ladderOn) {
      // Ladder mode has NO scale probe. A probe is "raise, then maybe put it
      // back a second later", which is the flapping this wave exists to end;
      // the streak plus the dwell plus the reversal lock do the same job with a
      // floor under the period. A rung that does not pay is given back through
      // the ordinary down path, no sooner than LADDER_DWELL_MS later.
      if (this._ladderIdx > 0) return this._ladderMove(1, now);
    } else if (this._renderScale < this.renderScaleMax) {
      const from = this._renderScale;
      const to = Math.min(this.renderScaleMax, RealtimeRaytracer._scaleUpFrom(from));
      return this._takeUpStep("scale", from, RealtimeRaytracer._scaleStepCost(from, to), util, now);
    }
    // The free wins are the LAST thing handed back, and the bar is deliberately
    // much higher than for any other step: nothing cheaper is left to restore
    // (canvas whole, renderScale at its ceiling) AND the frame is running at
    // DOUBLE the headroom an ordinary up-step needs. Measured, not guessed:
    // with a plain "we are fast" test this oscillated — take, return, take,
    // return, three cycles in twenty seconds on the tokyo scene — because giving
    // the wins back makes the frame 10-27% slower, which lands straight back in
    // "slow". They are cheaper AND no worse, so holding them one level too long
    // costs nothing and churning them costs a reset every two seconds.
    const doubled = util != null ? util < 0.5 : wall < 0.5;
    if (doubled && this._qFreeWins && this._canvasLevelIdx === 0 && this._renderScale >= this.renderScaleMax) {
      return this._releaseFreeWins(now);
    }
    return false;
  }

  /**
   * Is the governor on the discrete ladder? Tied to fixedLightingTargets: the
   * ladder exists so the set of renderScales is closed and small, which is what
   * makes one allocation at the cap the right size for every one of them.
   * Turning the fixed targets off restores the continuous 0.05 governor too, so
   * an A/B of the two paths is one flag.
   */
  get _ladderOn() {
    return !!this.fixedLightingTargets && this.scaleLadder.length > 1;
  }

  /**
   * Move one rung, if the hysteresis allows it. `dir` is -1 (down, cheaper) or
   * +1 (up). Returns true if the rung moved.
   *
   * Three locks, checked in this order. Each is a separate claim:
   *   streak    the condition has persisted (10 samples down, 180 up)
   *   dwell     at least LADDER_DWELL_MS since the last rung move, whatever the
   *             streak says
   *   reversal  a move in the opposite direction to the last one waits
   *             LADDER_REVERSAL_MS, which puts a hard 20s floor under the
   *             period of any down-up-down cycle
   */
  _ladderMove(dir, now) {
    const L = this.scaleLadder;
    const idx = Math.min(L.length - 1, Math.max(0, this._ladderIdx + (dir < 0 ? 1 : -1)));
    if (idx === this._ladderIdx) return false;
    const streak = dir < 0 ? this._ladderSlow : this._ladderFast;
    const need = dir < 0
      ? RealtimeRaytracer.LADDER_DOWN_STREAK
      : RealtimeRaytracer.LADDER_UP_STREAK;
    if (streak < need) return false;
    if (now - this._ladderLastMove < RealtimeRaytracer.LADDER_DWELL_MS) return false;
    if (
      this._ladderLastDir !== 0 &&
      this._ladderLastDir !== dir &&
      now - this._ladderLastMove < RealtimeRaytracer.LADDER_REVERSAL_MS
    ) {
      return false;
    }
    this._ladderIdx = idx;
    this._ladderLastMove = now;
    this._ladderLastDir = dir;
    this._ladderSlow = 0;
    this._ladderFast = 0;
    this._commitScale(L[idx], dir, now);
    return true;
  }

  /** The next renderScale rung above `from`, on the 0.05 ladder. */
  static _scaleUpFrom(from) {
    return Math.min(1, Math.round((from + RealtimeRaytracer.MAX_SCALE_UP_STEP) * 20) / 20);
  }

  /**
   * Take one up-step — either committed on the strength of the prediction, or
   * TAKEN AS A PROBE and judged on what it actually costs. Returns true if
   * anything moved.
   *
   * Three outcomes, and which one applies is the whole ascent policy:
   *
   *   predicted <= target        commit. The measurement says this fits with
   *                              room to spare; there is nothing to find out.
   *   target < predicted <= ceil commit AS A PROBE. The model is not accurate
   *                              enough to settle a borderline step (it is
   *                              deliberately conservative: a quadratic charged
   *                              for a renderScale rung that measures 0.35-0.84
   *                              quadratic), so measure the real thing and put
   *                              it back if the answer is no. Rate-limited by
   *                              the same exponential backoff the no-timer path
   *                              uses, so a step that keeps failing stops being
   *                              retried.
   *   predicted > ceil           refuse. Even a generous reading of the model
   *                              says this does not fit; probing it would just
   *                              be 1.5s of dropped frames to learn that.
   *
   * With no GPU measurement at all (Safari/iOS) every up-step lands in the
   * middle case: trying it IS the only test available.
   */
  _takeUpStep(kind, from, mult, util, now) {
    const target = this._qOscillating
      ? RealtimeRaytracer.GPU_TARGET_UTIL_OSC
      : RealtimeRaytracer.GPU_TARGET_UTIL;
    const predicted = util == null ? null : util * mult;
    const speculative = predicted == null || predicted > target;
    if (speculative) {
      if (predicted != null && predicted > RealtimeRaytracer.GPU_PROBE_CEIL) return false;
      // Re-probing THE SAME rung that just failed is what would turn probing
      // into oscillation, so that case waits out the doubling backoff measured
      // from the failure. Any OTHER step only waits the base quiet period —
      // which is what lets a recovery from a transient climb 0.20 -> 0.25 ->
      // 0.30 -> 0.35 briskly and then stop, rather than being slowed by a
      // backoff earned at a rung it has not reached yet.
      const f = this._qProbeFail;
      const repeat = !!f && f.kind === kind && f.from === from;
      const since = now - (repeat ? f.at : this._qLastChange);
      if (since < (repeat ? this._qProbeBackoff : RealtimeRaytracer.PROBE_BASE_MS)) {
        return false;
      }
    }
    const ema = this._qEma;
    if (kind === "canvas") this._setCanvasLevel(from - 1, 1, now);
    else this._commitScale(RealtimeRaytracer._scaleUpFrom(from), 1, now);
    if (speculative) {
      this._qProbe = { kind, from, at: now, ema };
      console.info(
        `three-realtime-rt: adaptive quality → that ${kind} step is a PROBE ` +
          `(predicted ${predicted == null ? "unknown" : Math.round(predicted * 100) + "%"} ` +
          "of frame budget); it will be reverted if it does not pay"
      );
    }
    return true;
  }

  /** Commit a renderScale rung, with the quality ladder that goes with it. */
  _commitScale(s, dir, now) {
    const q = RealtimeRaytracer._qualityFor(s);
    this.denoiseIterations = q.denoiseIterations;
    this.stochasticLights = q.stochasticLights;
    // 0.16.10: with fixedLightingTargets this moves the sub-rect and carries the
    // history across it, allocating nothing. Without them it is the old realloc.
    this.renderScale = s;
    this._ladderIdx = this._nearestRung(s);
    this._recordChange(dir, now);
    this._freshMeasurement();
    console.info(
      `three-realtime-rt: adaptive quality → ${Math.round(s * 100)}% lighting, ` +
        `${q.denoiseIterations} denoise passes, ` +
        `${q.stochasticLights ? "stochastic" : "full"} direct light`
    );
  }

  /** Commit a canvas-ladder rung through the app's hook. */
  _setCanvasLevel(idx, dir, now) {
    // [wave 14K] session pin: rt.pinCanvasLevel stops EVERY canvas-ladder move
    // (down, up and probe revert all funnel through here) without touching the
    // renderScale ladder. One line of policy, no damping: the owner's phone can
    // run a whole session with the canvas rung fixed while this wave measures
    // whether the ladder is what loses the context.
    if (this.pinCanvasLevel) return;
    this._canvasLevelIdx = idx;
    this.canvasScaleHook(RealtimeRaytracer.CANVAS_LEVELS[idx]);
    this._recordChange(dir, now);
    this._freshMeasurement();
    console.info(
      `three-realtime-rt: adaptive quality → ${Math.round(
        RealtimeRaytracer.CANVAS_LEVELS[idx] * 100
      )}% canvas`
    );
  }

  /** The cost profile just changed: throw away both clocks' history so the next
   *  decision measures the new regime rather than a blend of both. */
  _freshMeasurement() {
    this._qEma = null;
    this._gpuNullSince = null;
    if (this._gpuTimer) this._gpuTimer.reset();
  }

  /**
   * Verdict on an in-flight probe: keep it, or put it back and wait longer.
   *
   * WHY PROBING EXISTS AT ALL. On a platform with no timer extension — Safari
   * and iOS withhold EXT_disjoint_timer_query_webgl2, and this library ships to
   * iPad — raising one rung and looking at what happens is the only test
   * available. Under a vsync cap it is a better test than it sounds, because the
   * cap quantises the answer: a step the GPU can absorb leaves the frame time at
   * the refresh period, and a step it cannot immediately doubles it. The cost of
   * being wrong is bounded to PROBE_SETTLE_MS of degraded frames, and the
   * exponential backoff means a machine with nothing to spare stops paying that
   * cost within a minute.
   *
   * Not probed: the free wins. They are cheaper AND no worse than what they
   * replace, so the only thing a probe could discover is that giving them back
   * made the frame slower, which is already known.
   */
  _judgeProbe(now, wall, util) {
    const p = this._qProbe;
    if (now - p.at < RealtimeRaytracer.PROBE_SETTLE_MS) return;
    if (this._qEma == null) return; // no post-probe measurement yet
    // Where a GPU measurement exists it is the verdict, because it is the
    // quantity the step actually changed: the wall clock at the new level is
    // pinned to the refresh period again the moment the step fits, so it cannot
    // tell "fits comfortably" from "fits by a hair".
    if (util != null) {
      const overUtil = util > (this._qOscillating
        ? RealtimeRaytracer.GPU_BUDGET_DROP_OSC
        : RealtimeRaytracer.GPU_BUDGET_DROP);
      this._qProbe = null;
      if (!overUtil && wall <= (this._qOscillating ? 1.24 : 1.12)) {
        this._acceptProbe(p, now);
        console.info(
          "three-realtime-rt: adaptive quality → probe held at " +
            `${Math.round(util * 100)}% of the GPU frame budget`
        );
        return;
      }
      this._revertProbe(p, now);
      return;
    }
    // No GPU measurement: two ways to fail, because either alone misses a case.
    // An absolute test (the frame is now over budget) catches a probe that
    // pushed a comfortable frame over the line, and a relative one (the frame
    // got materially slower than it was) catches a display whose cap is well
    // above targetFps, where a real slowdown can happen without ever crossing
    // the budget.
    const overBudget = wall > (this._qOscillating ? 1.24 : 1.12);
    const degraded =
      p.ema != null && this._qEma > p.ema * RealtimeRaytracer.PROBE_FAIL_RATIO;
    this._qProbe = null;
    if (!overBudget && !degraded) {
      this._acceptProbe(p, now);
      console.info("three-realtime-rt: adaptive quality → probe held (no frame-time cost)");
      return;
    }
    this._revertProbe(p, now);
  }

  /** Keep a probe. The backoff is only forgiven if THIS was the step that had
   *  been failing — a success one rung lower says nothing about the rung above,
   *  and clearing it there is what made a failing rung get retried every 16s. */
  _acceptProbe(p, now) {
    const f = this._qProbeFail;
    if (f && f.kind === p.kind && f.from === p.from) {
      this._qProbeFail = null;
      this._qProbeBackoff = RealtimeRaytracer.PROBE_BASE_MS;
    }
    // Start the next quiet period from the VERDICT, not from the step, so a
    // successful probe is followed by a full interval at the new level before
    // the next one is attempted.
    this._qLastChange = now;
  }

  /** Undo a failed probe and back off, so a step that cannot be paid for is
   *  retried at 8s, 16s, 32s ... rather than every quiet moment. */
  _revertProbe(p, now) {
    if (p.kind === "canvas") this._setCanvasLevel(p.from, -1, now);
    else this._commitScale(p.from, -1, now);
    const repeat =
      this._qProbeFail && this._qProbeFail.kind === p.kind && this._qProbeFail.from === p.from;
    this._qProbeBackoff = repeat
      ? Math.min(RealtimeRaytracer.PROBE_MAX_MS, this._qProbeBackoff * 2)
      : RealtimeRaytracer.PROBE_BASE_MS * 2;
    this._qProbeFail = { kind: p.kind, from: p.from, at: now };
    console.info(
      "three-realtime-rt: adaptive quality → probe reverted (frame time " +
        `${p.ema == null ? "?" : p.ema.toFixed(1)} → ` +
        `${this._qEma == null ? "?" : this._qEma.toFixed(1)} ms); ` +
        `next probe in ${Math.round(this._qProbeBackoff / 1000)}s`
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

  // Apply the motion-vector option to every stage. The G-buffer (the expensive
  // part — it reallocates targets and recompiles programs) is only touched when
  // the effective on/off state changes; the per-stage consumer switches are a
  // cheap uniform write and are pushed every frame so `_motionAccum/_motionRestir/
  // _motionTaa` (measurement isolation) and the live `motionVectors` toggle both
  // take effect.
  _syncMotionVectors() {
    const want = !!(this.motionVectors && this.motionVectorsSupported);
    if (want !== this._motionVectorsActive) {
      this._motionVectorsActive = want;
      this.gbuffer.setMotionVectors(want);
      if (!want) this._prevModelMatrices.clear();
      this.resetAccumulation();
      if (this.motionVectors && !this.motionVectorsSupported && !this._motionWarned) {
        this._motionWarned = true;
        console.warn(
          "three-realtime-rt: motionVectors requested but this GPU lacks the " +
            "5-attachment motion MRT (needs MAX_DRAW_BUFFERS >= 5) — falling back " +
            "to camera-only reprojection."
        );
      }
    }
    if (this._motionVectorsActive) {
      this.gbuffer.setPrevModelMatrices(this._prevModelMatrices);
      this.gbuffer.setMotionMatrices(this._prevViewProj);
    }
    this.accumulatePass.setMotionVectors(this._motionVectorsActive && this._motionAccum);
    this.restirPass.setMotionVectors(this._motionVectorsActive && this._motionRestir);
    this.taaPass.setMotionVectors(this._motionVectorsActive && this._motionTaa);
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
    // Open the GPU timing region around EVERYTHING this renderer submits. It
    // measures the tracer's own GPU milliseconds, which is the quantity the
    // governor actually controls; the browser's compositing and any draws the
    // app makes outside render() are deliberately outside it and are paid for
    // out of the budget margin (GPU_BUDGET_DROP < 1). No-op when unsupported.
    if (this._gpuTimer) this._gpuTimer.begin();
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
    // The raw-input debug view, resolved ONCE for the whole frame. It needs the
    // split-accumulate path, because that is the only configuration in which the
    // raw samples exist as their own textures; on a device without the
    // 2-attachment half-float MRT the flag is simply unavailable and must not
    // half-apply (bypassing TAA and the bilateral upsample for a picture that
    // would still be the DENOISED one is worse than not offering the view).
    const rawView = this.rawInputView && this.specMRTSupported && this._splitAccum;
    // Debug views (outputMode != 0) bypass the TAA resolve, so skip the jitter
    // too — otherwise the raw buffers visibly shake. rawView is a debug view of
    // the composite itself (outputMode stays 0), so it joins them: TAA would
    // average the 1-spp noise away, which is the one thing this view exists to
    // show.
    if (this.taa && this.outputMode === 0 && !rawView) {
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

    // Motion-vector plumbing: needs this frame's VP (above) and last frame's
    // (still in _prevViewProj, copied at the END of the previous render).
    this._syncMotionVectors();

    const prevAutoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;

    if (this._needsClear) {
      this.rtPass.clearHistory(this.renderer);
      this.accumulatePass.clearHistory(this.renderer);
      this.volumetricPass.clearHistory(this.renderer);
      this.restirPass.clearHistory(this.renderer);
      this.giReservoirPass.clearHistory(this.renderer);
      this._needsClear = false;
    }

    // 1. rasterize G-buffer (ping-pongs internally; previous frame kept)
    this.gbuffer.render(this.renderer, scene, camera);

    // 2. ray traced lighting with temporal reprojection
    const rtU = this.rtPass.material.uniforms;
    // Unoccluded ambient. `ambient: false` uploads zeros, which is not a
    // shortcut but the definition: the shader adds these four uniforms
    // unconditionally, so all-zero IS "no ambient", bit for bit. A scene with
    // no AmbientLight/HemisphereLight already reads zero here, so the option
    // costs nothing to leave on.
    if (this.ambient && this.compiled) {
      rtU.uAmbientFlat.value.copy(this.compiled.ambientColor);
      rtU.uHemiSky.value.copy(this.compiled.hemiSky);
      rtU.uHemiGround.value.copy(this.compiled.hemiGround);
      rtU.uHemiUp.value.copy(this.compiled.hemiUp);
    } else {
      rtU.uAmbientFlat.value.setRGB(0, 0, 0);
      rtU.uHemiSky.value.setRGB(0, 0, 0);
      rtU.uHemiGround.value.setRGB(0, 0, 0);
    }
    rtU.uEnvColor.value.copy(this.envColor);
    rtU.uEnvIntensity.value = this.envIntensity;
    rtU.uEps.value = this.eps;
    rtU.uCostView.value = this.outputMode === 7;
    rtU.uCostScale.value = this.costScale;
    rtU.uTemporalReprojection.value = this.temporalReprojection;
    // Motion-adaptive temporal response. Camera motion is opt-in
    // (motionAdaptive, default off); light motion is always counted, because
    // history that describes lights which have since moved is simply wrong.
    // With the camera opt-out and the lights parked this is exactly
    // this.maxHistory, i.e. byte-identical to the pre-feature build.
    const mt = this._temporalMotion();
    this._mt = mt;
    // Decay after sampling, so THIS frame gets the full response and the next
    // one gets less. An app that moves lights every frame re-raises it in
    // updateLights (which takes the max), so a swept spotlight sits at its
    // motion level and a one-off jump fades back to a long history over about
    // ten frames. Camera motion is not decayed here: _updateMotion recomputes
    // it from scratch every frame.
    this.lightMotion *= this.lightMotionDecay;
    if (this.lightMotion < 1e-3) this.lightMotion = 0;
    rtU.uMaxHistory.value = this.maxHistory + (this.maxHistoryMoving - this.maxHistory) * mt;
    rtU.uFireflyClamp.value = this.fireflyClamp > 0 ? this.fireflyClamp : 1e6;
    rtU.uGlassClampScale.value = this.glassClampScale;
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
    // ReSTIR direct samples per pixel (1 = one winner, one shadow ray — the
    // shipped behaviour). Read every frame so it can be changed at runtime.
    rtU.uRestirSamples.value = Math.max(1, Math.min(4, this.restirSamples | 0));
    rtU.uRestirTapRadius.value = Math.max(2, this.restirSampleRadius);
    // Cold-pixel exact fallback threshold, in frames of reservoir history. Read
    // every frame like the two above, so it is a live knob rather than a
    // construction-time one. 0 = off.
    rtU.uRestirWarmAge.value = Math.max(0, this.restirWarmAge || 0);
    // Relative firefly cap on the ReSTIR direct term, same live-knob treatment.
    // 0 = off = the absolute cap alone. The reservoir pass writes the p̂ total
    // this scales unconditionally, so nothing has to be kept in step.
    rtU.uRestirClampRel.value = Math.max(0, this.restirClampRel || 0);
    // Directional-light bypass, read every frame so it is a live A/B knob. The
    // lighting pass and the reservoir pass MUST agree: the shader shades
    // directional lights exactly whenever this is on, and the reservoir must
    // then refuse to select them, or the sun is counted twice.
    rtU.uDirBypass.value = !!this.restirDirectionalBypass;
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
      this.restirPass.setDynamic(this.restirDynamicAccept, this.restirDynamicFreeze);
      this.restirPass.setDirectionalBypass(this.restirDirectionalBypass);
      this.restirPass.setReprojectionRescue(this.restirReprojectionRescue);
      // Candidates drawn by power instead of uniformly, and the emissive half of
      // that following the SAME importance toggle the exact path uses. If the
      // two disagree about a triangle's pick probability, the reservoir weights
      // by one pdf and the estimator converges to the other one's answer.
      this.restirPass.setCandidateImportance(this.restirCandidateImportance);
      this.restirPass.setEmissiveImportance(this.emissiveImportance);
      // The candidate distribution itself: row 0 is the global power CDF the
      // draw used to read from a uniform array, rows 1+ localise it per grid
      // cell. Rebuilt only when the light set or one of its two knobs moved.
      this._syncLightGrid(false);
      reservoirTex = this.restirPass.render(
        this.renderer,
        this.gbuffer,
        this._prevViewProj,
        this._camWorldPos,
        this.frame,
        this.eps,
        this.restirMCap + (this.restirMCapMoving - this.restirMCap) * mt,
        // THIS frame's jittered VP, for the sub-texel reprojection correction
        // (the same matrix AccumulatePass gets, for the same reason).
        this._jitteredViewProj
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

    // Part 2: lighting resolve. With a denoiser plugin attached, the raw 1-spp
    // samples + G-buffer go to the plugin, which replaces AccumulatePass +
    // DenoisePass + the specular denoise below; otherwise the original
    // split-accumulate + a-trous pipeline runs byte-identical.
    let irradiance, specular;
    let specularTex;
    // 0.16.10: the composite has to know, for each lighting texture it is
    // handed, how much of it is LIVE: an engine target is allocated at the
    // renderScale cap and only its rect carries this frame's lighting, while a
    // plugin's output is a whole target of its own size. Guessing from the
    // texture's dimensions is not safe (a plugin may return a texture with no
    // image metadata at all), so each assignment below states its grid as
    // [validW, validH, allocW, allocH].
    const engineGrid = () => [this._rectW, this._rectH, this._allocW, this._allocH];
    const wholeGrid = (tex) => {
      const im = tex && tex.image;
      const w = (im && im.width) || this._rectW;
      const h = (im && im.height) || this._rectH;
      return [w, h, w, h];
    };
    // 0.16.11: a plugin that follows the sub-rect (one with `setRect`) has the
    // same problem the engine's own targets have - its output texture is the
    // ALLOCATION and only a rect of it is this frame's picture - so it may say
    // so, by returning `grid: [validW, validH, allocW, allocH]` beside the
    // pair. Absent or malformed, the texture's own dimensions still decide,
    // which is byte-identical to 0.16.10 for every plugin that predates this.
    const pluginGrid = (out, tex) => {
      const g = out && out.grid;
      if (Array.isArray(g) && g.length === 4) {
        const vw = g[0] | 0, vh = g[1] | 0, aw = g[2] | 0, ah = g[3] | 0;
        if (vw > 0 && vh > 0 && aw >= vw && ah >= vh) return [vw, vh, aw, ah];
      }
      return wholeGrid(tex);
    };
    let irrGrid = null;
    let specGrid = null;
    // Resolved once: a plugin only runs on the split-accumulate MRT path, and
    // the three blocks below (the branch, the a-trous denoise, the specular
    // denoise) must all agree on whether it did.
    const pluginResolved = !!(this._denoiserPlugin && this.specMRTSupported && this._splitAccum);
    if (pluginResolved) {
      const raw = this.rtPass.renderRaw(this.renderer, this.gbuffer, this.frame, reservoirTex);
      // Temporal history warp. `camera.projectionMatrix` is the JITTERED matrix
      // here (the jitter is applied at the top of render() and restored at the
      // bottom), which is exactly the projection the G-buffer was rasterized
      // with, so reconstructing view-space position from depth and projecting
      // it back lands on the pixel centre and needs no jitter-correction term.
      this._denoiseWarp.multiplyMatrices(this._prevViewProj, camera.matrixWorld);
      const pe = camera.projectionMatrix.elements;
      this._denoiseProj[0] = pe[0];  // P00
      this._denoiseProj[1] = pe[5];  // P11
      this._denoiseProj[2] = pe[8];  // P02 (carries the x jitter)
      this._denoiseProj[3] = pe[9];  // P12 (carries the y jitter)
      const ls = this._ctxLightingSize || (this._ctxLightingSize = [0, 0]);
      const gs = this._ctxGbufferSize || (this._ctxGbufferSize = [0, 0]);
      ls[0] = this._scaledW; ls[1] = this._scaledH;
      gs[0] = this._width; gs[1] = this._height;
      const out = this._denoiserPlugin.render(
        this.renderer,
        raw.rawIrradiance,
        raw.rawSpecular,
        this.gbuffer,
        camera.matrixWorldInverse,
        {
          warp: this._denoiseWarp,
          proj: this._denoiseProj,
          // Per-object motion vectors when the G-buffer is carrying them: a
          // temporal plugin's history then reprojects moving surfaces correctly
          // instead of sampling whatever was behind them. Null when motion
          // vectors are off, and a plugin still needs its own disocclusion test
          // either way - motion vectors answer "where did this surface come
          // from", not "was it visible at all".
          motion: this._motionVectorsActive ? this.gbuffer.motion : null,
          frame: this.frame,
          // 0.16.7: the two grids the plugin is looking at, so a network that
          // takes rays at lighting resolution and the G-buffer at canvas
          // resolution (a "quarter" model at renderScale 0.5) knows the ratio
          // without measuring textures. Reused arrays, no per-frame garbage.
          lightingSize: this._ctxLightingSize,
          gbufferSize: this._ctxGbufferSize,
        }
      );
      // 0.16.6: a plugin may decline a frame by returning false (neuralrt while
      // its shaders compile asynchronously, or once it has given up as
      // unsupported on this GPU): the built-in split-accumulate path then
      // carries the frame from the same raw pair, exactly as if no plugin were
      // attached, and `denoiserPluginRan` says which happened.
      const pluginOk = !!(out && out.irradiance);
      this._pluginRan = pluginOk;
      // 0.16.8: reported per frame, so a declined frame or the raw debug view
      // reads null rather than last frame's grid.
      this._pluginPostGrid = null;
      if (!pluginOk) {
        const acc = this.accumulatePass.render(
          this.renderer, raw.rawIrradiance, raw.rawSpecular, this.gbuffer,
          this._prevViewProj, this._jitteredViewProj, this._camWorldPos, this.eps,
          this.maxHistory + (this.maxHistoryMoving - this.maxHistory) * this._mt,
          { preFireflyClamp: 0.0, historyClampK: 0.0,
            lightMotion: this.lightAdaptive ? this.lightMotion : 0, gradK: this.lightGradK });
        irradiance = acc.irradiance;
        specular = acc.specular;
        this._momentsTex = acc.moments;
        irrGrid = specGrid = engineGrid();
      } else {
      irradiance = out.irradiance;
      specularTex = this.specular ? out.specular : null;
      irrGrid = pluginGrid(out, irradiance);
      specGrid = specularTex ? pluginGrid(out, specularTex) : irrGrid;
      this._momentsTex = null;
      // 0.16.7: the plugin may return its pair at ANY resolution from the
      // lighting grid up to the G-buffer grid (a network that takes quarter
      // rays and the full G-buffer and writes full-resolution output). The
      // composite reads the size below; the post passes are sized for the
      // lighting grid and would downsample such an output, so they only run
      // when the output is on the lighting grid (a network that upsamples
      // itself does its own temporal work).
      // 0.16.11: the LIVE size, off irrGrid, not the texture's dimensions - a
      // sub-rect plugin's output texture is its whole allocation and reads
      // "off the lighting grid" by size alone while sitting exactly on it.
      const outOnLightingGrid = irrGrid[0] === this._scaledW && irrGrid[1] === this._scaledH;
      // Debug view: show the plugin's INPUT instead of its output. The plugin
      // above still ran (and still advanced its history), so this only changes
      // which pair of textures the composite gets.
      if (rawView) {
        irradiance = raw.rawIrradiance;
        specularTex = this.specular ? raw.rawSpecular : null;
        irrGrid = specGrid = engineGrid(); // the plugin's INPUT is an engine target
      } else {
        // Optional spatial post-filter on the plugin's output (0 = nothing,
        // byte-identical to the plain plugin path): the same edge-aware a-trous
        // the built-in pipeline uses, for a network that still flickers.
        // Optional temporal smoothing first: the network output goes through
        // the split-accumulate EMA (reprojected history) as if it were the raw
        // sample stream, so frame-to-frame flicker averages out.
        //
        // 0.16.8: these run on ANY output grid. Until 0.16.7 they were skipped
        // unless the plugin returned its pair on the lighting grid, because the
        // shared passes are allocated there and would have downsampled a larger
        // output. That was plumbing, not a principle: both passes are already
        // grid-agnostic (AccumulatePass separates uTexSize from uGbSize,
        // DenoisePass taps at its own texel size and reads the G-buffer by
        // vUv), so an off-grid output just needs its own pair of passes at the
        // output size. A network that upsamples still needed the smoothing.
        const hist = Math.max(0, Math.round(this.denoiserPluginPostHistory || 0));
        const post = Math.max(0, Math.round(this.denoiserPluginPostIterations || 0));
        // The output's own grid: live size, then the allocation it sits in.
        // The off-grid post passes are ALLOCATED at [oaw, oah] and RECTED to
        // [ow, oh], so they carry the plugin's rect through instead of being
        // rebuilt on every step (and DenoisePass, which samples its input by
        // uv, then has the same rect/allocation ratio as the texture it reads).
        const ow = irrGrid[0];
        const oh = irrGrid[1];
        const oaw = irrGrid[2];
        const oah = irrGrid[3];
        if (!outOnLightingGrid && (hist > 0 || post > 0) && this.outputMode !== 7) {
          this._ensurePluginPost(oaw, oah, ow, oh);
        }
        const accum = outOnLightingGrid ? this.accumulatePass : this._pluginPostAccum;
        const den = outOnLightingGrid ? this.denoisePass : this._pluginPostDenoise;
        if (hist > 0 && this.outputMode !== 7 && accum) {
          // The specular the accumulate pass reads must be on the SAME grid as
          // the irradiance it is fed. On the lighting grid the raw specular is,
          // and is the long-standing fallback; off it, the raw pair is the
          // wrong size, so a 1x1 black stands in (it is only ever consumed when
          // the plugin returned a specular of its own, which is used instead).
          const spec = specularTex
            || (outOnLightingGrid ? raw.rawSpecular : this._zeroSpecTex());
          const acc = accum.render(
            this.renderer, irradiance, spec, this.gbuffer,
            this._prevViewProj, this._jitteredViewProj, this._camWorldPos, this.eps, hist,
            { preFireflyClamp: 0.0, historyClampK: 0.0,
              lightMotion: this.lightAdaptive ? this.lightMotion : 0, gradK: this.lightGradK });
          irradiance = acc.irradiance;
          irrGrid = outOnLightingGrid ? engineGrid() : [ow, oh, oaw, oah];
          if (this.specular && specularTex) {
            specularTex = acc.specular;
            specGrid = irrGrid;
          }
          this._pluginPostGrid = [ow, oh];
        }
        if (post > 0 && this.outputMode !== 7 && den) {
          irradiance = den.render(
            this.renderer, irradiance, this.gbuffer, this._camWorldPos, this.eps, post, giTex,
            { maxStep: this.denoiseMaxStep, stepJitter: this.denoiseStepJitter, wideDamp: this.denoiseWideDamp,
              frame: this.frame, momentsTexture: null });
          irrGrid = outOnLightingGrid ? engineGrid() : [ow, oh, oaw, oah];
          this._pluginPostGrid = [ow, oh];
        }
      }
      }   // pluginOk
    } else if (rawView) {
      // Same view with no plugin attached: the raw 1-spp samples, straight to
      // the composite. AccumulatePass and the a-trous denoise are not run at
      // all, so this is the honest cost of the input as well as the honest look
      // of it.
      const raw = this.rtPass.renderRaw(this.renderer, this.gbuffer, this.frame, reservoirTex);
      irradiance = raw.rawIrradiance;
      specularTex = this.specular ? raw.rawSpecular : null;
      this._momentsTex = null;
      irrGrid = specGrid = engineGrid();
    } else if (this.specMRTSupported && this._splitAccum) {
      const raw = this.rtPass.renderRaw(this.renderer, this.gbuffer, this.frame, reservoirTex);
      const acc = this.accumulatePass.render(
        this.renderer,
        raw.rawIrradiance,
        raw.rawSpecular,
        this.gbuffer,
        this._prevViewProj,
        this._jitteredViewProj,
        this._camWorldPos,
        this.eps,
        // Same motion-adaptive cap the inline path applies above: the split
        // pipeline owns the EMA now, so it must honour it too or a moving
        // light keeps its tail on every device that has MRT.
        this.maxHistory + (this.maxHistoryMoving - this.maxHistory) * this._mt,
        {
          preFireflyClamp: 0.0,
          historyClampK: 0.0,
          lightMotion: this.lightAdaptive ? this.lightMotion : 0,
          gradK: this.lightGradK,
        }
      );
      irradiance = acc.irradiance;
      specular = acc.specular;
      this._momentsTex = acc.moments;
      irrGrid = specGrid = engineGrid();
    } else {
      ({ irradiance, specular } = this.rtPass.render(this.renderer, this.gbuffer, this.frame, reservoirTex));
      this._momentsTex = null;
      irrGrid = specGrid = engineGrid();
    }

    // 3. denoise (display-only: history keeps accumulating raw samples). The
    // experimental ReSTIR GI (giTex) is added on the first à-trous iteration —
    // downstream of the lighting pass's temporal history, so it never
    // double-counts through it. The bvh-cost heatmap (mode 7) is a per-pixel
    // debug signal, not lighting — the edge-aware blur would smear its bands,
    // so it bypasses the denoiser (which also keeps the GI add out of mode 7).
    // Skipped when a plugin already resolved the lighting above, and when the
    // raw view is showing the denoiser's input rather than its output.
    if (!pluginResolved && !rawView &&
        this.denoise && this.denoiseIterations > 0 && this.outputMode !== 7) {
      irrGrid = engineGrid();
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
          // Variance-guided sigmaL failed its fences (spikes 9 -> 35): the
          // sqrt(var)-to-sigma mapping collapses to the clamp floor and
          // weakens the denoise exactly where motion needs it. Moments stay
          // available here; re-enable only behind a fresh A/B.
          momentsTexture: null,
        }
      );
    }

    // 3a. light denoise on the specular buffer. specKeep (DenoisePass) already
    // spares near-mirror pixels, so reflections stay crisp; capped at 2 passes
    // to avoid washing out sharp dielectric highlights.
    // The plugin and raw-view branches above set specularTex themselves.
    if (!pluginResolved && !rawView) {
      specularTex = this.specular ? specular : null;
      specGrid = engineGrid();
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
      // In-scatter is a separate, temporally accumulated buffer, not part of
      // what the denoiser is fed, and smooth by construction.
      !rawView &&
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
    const useTaa = this.taa && this.outputMode === 0 && !rawView;
    const cU = this.composite.material.uniforms;
    cU.uOutputMode.value = this.outputMode;
    // 0.16.7: the lighting pair the composite receives is normally on the
    // lighting grid (renderScale x canvas), but a denoiser plugin may hand back
    // a pair on a finer grid, up to the G-buffer's own; the guided upsample
    // must tap at THAT texel size, and is skipped entirely when the pair is
    // already at canvas resolution. Byte-identical on every built-in path
    // (the sizes below equal _scaledW/_scaledH there).
    // 0.16.10: tap at the LIVE size of the lighting pair (irrGrid/specGrid,
    // stated by whichever branch above produced them) and remap every tap into
    // that live rect. On an engine target the rect is a sub-rect of the cap
    // allocation; on a plugin's own target it is the whole thing and the remap
    // is the identity, which is byte-identical to the pre-0.16.10 composite.
    const ig = irrGrid || engineGrid();
    const sg = specGrid || ig;
    const tapW = ig[0];
    const tapH = ig[1];
    setRectUniforms(this.composite.material, ig[0], ig[1], ig[2], ig[3]);
    cU.uSpecRectScale.value.set(sg[0] / sg[2], sg[1] / sg[3]);
    cU.uSpecRectMax.value.set(sg[0] / sg[2] - 0.5 / sg[2], sg[1] / sg[3] - 0.5 / sg[3]);
    cU.uUpsample.value = tapW < this._width || tapH < this._height;
    // Nearest-neighbour the lighting taps in the raw view: the guided bilateral
    // upsample is a filter, and filtering the 1-spp noise is exactly the lie
    // this view is here to avoid. Inert (false) on every other path.
    cU.uNearestLighting.value = rawView;
    cU.uIrrTexelSize.value.set(1 / tapW, 1 / tapH);
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

    // Capture each dynamic mesh's world matrix as its "previous-frame model"
    // for the motion-vector path (rigid transforms only). Done AFTER every pass
    // so next frame's G-buffer sees THIS frame's transform as "previous". A mesh
    // the app moves without calling updateDynamic() still updates matrixWorld
    // inside renderer.render, so the raster stays coherent here even though its
    // traced BVH is (by contract) stale.
    if (this._motionVectorsActive && this.compiled && this.compiled.hasDynamic) {
      for (const seg of this.compiled.dynamic) {
        let m = this._prevModelMatrices.get(seg.mesh);
        if (!m) {
          m = new THREE.Matrix4();
          this._prevModelMatrices.set(seg.mesh, m);
        }
        m.copy(seg.mesh.matrixWorld);
      }
    }

    // Close the GPU timing region and harvest whatever results are ready. Never
    // blocks: GpuTimer only reads a query once the driver reports it available.
    if (this._gpuTimer) this._gpuTimer.end();

    // Compile-failure diagnosis: every pass program used this frame has now had
    // its link status checked by three (diagnostics populated on first use), so
    // scan for failures. Runs at frame END (downstream of the passes) and only
    // until the polling window settles — a no-op on the healthy steady state.
    if (!this._diagDone) this._scanPrograms();
  }

  /**
   * Median GPU milliseconds the tracer spent over the recent window, or null
   * when the platform has no timer extension (Safari/iOS) or no stable sample
   * yet. This is the governor's honest headroom signal: unlike the wall-clock
   * frame time it is not pinned to the display's refresh period.
   */
  get gpuCostMs() {
    return this._gpuTimer ? this._gpuTimer.costMs : null;
  }

  /** True where EXT_disjoint_timer_query_webgl2 is available and enabled. */
  get gpuTimingSupported() {
    return !!(this._gpuTimer && this._gpuTimer.supported);
  }

  /**
   * True when the governor is steering on GPU milliseconds. False means it is on
   * the speculative-probe fallback — either the extension is missing, gpuTiming
   * was set false, or the timer stopped producing results and was given up on.
   */
  get gpuTimingActive() {
    return this.gpuTiming !== false && this._gpuActive && !this._gpuGaveUp;
  }

  dispose() {
    if (!this.supported) return;
    // [wave 14K] retire every engine target in the ledger (the deferred-free
    // countdown then drains them on the next ticks, exactly as a real teardown
    // on iOS would).
    if (this.memLedger && this._ledgerKeys) {
      for (const k of this._ledgerKeys) this.memLedger.free(k);
    }
    this.gbuffer.dispose();
    this.rtPass.dispose();
    this.denoisePass.dispose();
    this.specDenoisePass.dispose();
    if (this._denoiserPlugin) this._denoiserPlugin.dispose();
    this._disposePluginPost();
    this.composite.dispose();
    this.taaPass.dispose();
    this.volumetricPass.dispose();
    this.restirPass.dispose();
    this.giReservoirPass.dispose();
    this.lightGridPass.dispose();
    this._sceneColor.dispose();
    this._copyPass.dispose();
    if (this._gpuTimer) this._gpuTimer.dispose();
    if (this.compiled) this.compiled.dispose();
  }
}
