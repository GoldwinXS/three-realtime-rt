import * as THREE from "three";
import { compileScene, syncLights } from "./SceneCompiler.js";
import { GBufferPass } from "./GBufferPass.js";
import { RTLightingPass } from "./RTLightingPass.js";
import { DenoisePass } from "./DenoisePass.js";
import { CompositePass } from "./CompositePass.js";
import { TAAPass } from "./TAAPass.js";
import { VolumetricPass } from "./VolumetricPass.js";
import { RestirPass } from "./RestirPass.js";

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
    return { renderScale: 0.5, denoiseIterations: 3, adaptiveQuality: true };
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
   * Companion settings for a given lighting resolution. LOW resolution wants
   * MORE denoise passes, not fewer — the filter runs at lighting res so extra
   * iterations are nearly free there, and they're what makes 25% lighting look
   * good. Stochastic lights kick in once the budget is clearly constrained.
   */
  static _qualityFor(scale) {
    return {
      denoiseIterations: scale <= 0.3 ? 5 : scale <= 0.45 ? 4 : 3,
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
      return;
    }

    const size = renderer.getSize(new THREE.Vector2());
    const pr = renderer.getPixelRatio();
    this._width = Math.floor(size.x * pr);
    this._height = Math.floor(size.y * pr);
    /**
     * Resolution scale for the ray traced lighting (G-buffer and final image
     * stay full res). 0.5 traces 4x fewer rays; the bilateral upsample +
     * denoiser reconstruct the difference. Set 1.0 for maximum quality.
     */
    this._renderScale = options.renderScale ?? 0.5;

    const mixedPrecision = RealtimeRaytracer._mixedMrtSupported(renderer.getContext());
    if (!mixedPrecision) {
      console.info("three-realtime-rt: mixed fp16/fp32 G-buffer not supported here — using fp32 for all targets.");
    }
    this.gbuffer = new GBufferPass(this._width, this._height, { mixedPrecision });
    this.rtPass = new RTLightingPass(this._scaledW, this._scaledH);
    this.denoisePass = new DenoisePass(this._scaledW, this._scaledH);
    this.composite = new CompositePass();
    this.taaPass = new TAAPass(this._width, this._height);
    this._sceneColor = this._makeColorTarget(this._width, this._height);

    this.compiled = null;
    this.frame = 0;

    /** Debug view: 0 composite, 1 albedo, 2 normal, 3 irradiance, 4 worldPos, 5 emissive */
    this.outputMode = 0;
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
    /** History length cap: higher = smoother but slower to react. */
    this.maxHistory = options.maxHistory ?? 128;
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
    /** Traced mirror/glossy reflections on metallic surfaces. */
    this.reflections = options.reflections ?? true;
    /** Traced refraction for transmissive (MeshPhysicalMaterial.transmission) surfaces. */
    this.refraction = options.refraction ?? true;
    /** Index of refraction used for transmissive surfaces. */
    this.ior = options.ior ?? 1.5;
    /**
     * One stochastic direct shadow ray per pixel per frame (source picked at
     * random) instead of one per light — the biggest ray-count lever for
     * many-light scenes and mobile GPUs. Slightly noisier moving shadows;
     * temporal accumulation + the denoiser absorb it.
     */
    this.stochasticLights = options.stochasticLights ?? false;
    /**
     * Adaptive quality governor: watches the app's real frame time and walks
     * QUALITY_LADDER — degrading when frames run long, cautiously probing a
     * better level when there is headroom (reverting if the probe fails). The
     * portable way to "work well" on unknown hardware. Drives renderScale,
     * denoiseIterations and stochasticLights; setting those manually while
     * enabled will be overridden — turn this off for manual control.
     */
    this.adaptiveQuality = options.adaptiveQuality ?? false;
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
    /**
     * App-owned canvas-scale setter, driven by the governor as its deepest
     * lever once renderScale bottoms out. The app owns the canvas + CSS stretch,
     * so it must apply the buffer resize itself; null disables this level.
     */
    this.canvasScaleHook = options.canvasScaleHook ?? null;
    this._canvasLevelIdx = 0;
    /** Edge-aware à-trous denoise on the irradiance buffer. */
    this.denoise = options.denoise ?? true;
    /** À-trous iterations (steps 1, 2, 4, ...). */
    this.denoiseIterations = options.denoiseIterations ?? 3;

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
    if (this.compiled) this.compiled.dispose();
    this.compiled = compileScene(scene, options);
    if (this._autoEps) {
      // ~1/1000 of the scene diagonal, floored at the classic 1e-3.
      this.eps = Math.min(Math.max(1e-3, this.compiled.sceneDiagonal * 1.2e-3), 0.05);
    }
    this.rtPass.setCompiledScene(this.compiled);
    this.volumetricPass.setCompiledScene(this.compiled);
    this.restirPass.setCompiledScene(this.compiled);
    this.resetAccumulation();
    return this.compiled;
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
    this.rtPass.setCompiledScene(this.compiled);
    this.volumetricPass.setCompiledScene(this.compiled);
    this.restirPass.setCompiledScene(this.compiled);
  }

  resetAccumulation() {
    if (!this.supported) return;
    this._needsClear = true;
    if (this.taaPass) this.taaPass.reset();
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

  get renderScale() {
    return this._renderScale;
  }
  set renderScale(v) {
    this._renderScale = v;
    this.setSize(this._width, this._height);
  }

  setSize(width, height) {
    if (!this.supported) return;
    this._width = Math.floor(width);
    this._height = Math.floor(height);
    this.gbuffer.setSize(this._width, this._height);
    this.rtPass.setSize(this._scaledW, this._scaledH);
    this.denoisePass.setSize(this._scaledW, this._scaledH);
    this.volumetricPass.setSize(this._volW, this._volH);
    this.restirPass.setSize(this._scaledW, this._scaledH);
    this.taaPass.setSize(this._width, this._height);
    this._sceneColor.setSize(this._width, this._height);
    this.resetAccumulation();
  }

  // ---- adaptive quality governor: continuous dynamic resolution scaling ----
  // Measures real call-to-call frame time (EMA) and steers renderScale
  // proportionally toward targetFps, in 0.05 steps with a cooldown so target
  // reallocation and accumulation resets stay rare. Lighting cost ≈ scale², so
  // the correction uses a damped power of the error. Limitation: under a vsync
  // cap the frame time can't reveal headroom, so upscaling only happens when
  // frames are measurably faster than the target — it never thrashes.
  _adaptQuality() {
    const now = performance.now();
    const dt = this._qLastT == null ? null : now - this._qLastT;
    this._qLastT = now;
    if (dt == null || dt > 100) return; // first frame or hidden-tab stall
    this._qEma = this._qEma == null ? dt : this._qEma * 0.9 + dt * 0.1;
    if (now - this._qLastChange < 2000) return;

    const ratio = this._qEma / (1000 / this.targetFps);
    if (ratio < 1.12 && ratio > 0.8) return; // comfortable — leave it alone

    let s = this._renderScale * Math.pow(1 / ratio, 0.35);
    s = Math.round(Math.min(1, Math.max(0.2, s)) * 20) / 20; // 0.05 steps

    // When we're fast, give back the deepest lever FIRST: restore canvas scale
    // one step before touching renderScale, since canvas is the coarsest/most
    // valuable resolution to recover and it's quadratic on every pass.
    if (ratio < 0.8 && this.canvasScaleHook && this._canvasLevelIdx > 0) {
      this._canvasLevelIdx--;
      this.canvasScaleHook(RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx]);
      this._qLastChange = now;
      this._qEma = null; // cost profile changed — measure fresh
      console.info(
        `three-realtime-rt: adaptive quality → ${Math.round(
          RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx] * 100
        )}% canvas`
      );
      return;
    }

    // When we're slow and renderScale has already bottomed out (clamped to its
    // 0.2 floor while we're already near it), step DOWN the canvas ladder — the
    // deepest, quadratic-on-every-pass lever — instead of a no-op renderScale.
    if (
      ratio > 1.12 &&
      s <= 0.2 &&
      this._renderScale <= 0.25 &&
      this.canvasScaleHook &&
      this._canvasLevelIdx < RealtimeRaytracer.CANVAS_LEVELS.length - 1
    ) {
      this._canvasLevelIdx++;
      this.canvasScaleHook(RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx]);
      this._qLastChange = now;
      this._qEma = null; // cost profile changed — measure fresh
      console.info(
        `three-realtime-rt: adaptive quality → ${Math.round(
          RealtimeRaytracer.CANVAS_LEVELS[this._canvasLevelIdx] * 100
        )}% canvas`
      );
      return;
    }

    if (Math.abs(s - this._renderScale) < 0.045) return;

    const q = RealtimeRaytracer._qualityFor(s);
    this.denoiseIterations = q.denoiseIterations;
    this.stochasticLights = q.stochasticLights;
    this.renderScale = s; // reallocates targets + resets accumulation
    this._qLastChange = now;
    this._qEma = null; // cost profile changed — measure fresh
    console.info(
      `three-realtime-rt: adaptive quality → ${Math.round(s * 100)}% lighting, ` +
        `${q.denoiseIterations} denoise passes, ` +
        `${q.stochasticLights ? "stochastic" : "full"} direct light`
    );
  }

  render(scene, camera) {
    if (!this.supported) {
      this.renderer.render(scene, camera);
      return;
    }
    if (this.adaptiveQuality) this._adaptQuality();
    if (this.overloadProtection) this._overloadBrake();
    if (!this.compiled) this.compileScene(scene);

    this.frame += 1;
    camera.updateMatrixWorld();

    // --- sub-pixel jitter (TAA): offset the projection a fraction of a pixel
    // each frame so the whole pipeline (raster G-buffer + traced lighting)
    // samples slightly different positions; the TAA resolve averages them into
    // supersampled edges. Restored after the frame so callers see a clean matrix.
    const proj = camera.projectionMatrix;
    const savedProj8 = proj.elements[8];
    const savedProj9 = proj.elements[9];
    // Debug views (outputMode != 0) bypass the TAA resolve, so skip the jitter
    // too — otherwise the raw buffers visibly shake.
    if (this.taa && this.outputMode === 0) {
      this._jitterIndex = (this._jitterIndex + 1) % 16;
      const jx = (halton(this._jitterIndex + 1, 2) - 0.5) * 2 / this._width;
      const jy = (halton(this._jitterIndex + 1, 3) - 0.5) * 2 / this._height;
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
      this._needsClear = false;
    }

    // 1. rasterize G-buffer (ping-pongs internally; previous frame kept)
    this.gbuffer.render(this.renderer, scene, camera);

    // 2. ray traced lighting with temporal reprojection
    const rtU = this.rtPass.material.uniforms;
    rtU.uEnvColor.value.copy(this.envColor);
    rtU.uEnvIntensity.value = this.envIntensity;
    rtU.uEps.value = this.eps;
    rtU.uTemporalReprojection.value = this.temporalReprojection;
    rtU.uMaxHistory.value = this.maxHistory;
    rtU.uFireflyClamp.value = this.fireflyClamp > 0 ? this.fireflyClamp : 1e6;
    rtU.uGIEnabled.value = this.gi;
    rtU.uGIHalfRate.value = this.giHalfRate;
    rtU.uEmissiveCount.value = this.emissiveNEE ? this.compiled.emissiveTriCount : 0;
    rtU.uReflEnabled.value = this.reflections;
    rtU.uRefrEnabled.value = this.refraction;
    rtU.uIor.value = this.ior;
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
        this.eps
      );
    }
    let irradiance = this.rtPass.render(this.renderer, this.gbuffer, this.frame, reservoirTex);

    // 3. denoise (display-only: history keeps accumulating raw samples)
    if (this.denoise && this.denoiseIterations > 0) {
      irradiance = this.denoisePass.render(
        this.renderer,
        irradiance,
        this.gbuffer,
        this._camWorldPos,
        this.eps,
        this.denoiseIterations
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
    this.composite.render(
      this.renderer,
      irradiance,
      this.gbuffer,
      scene.background,
      useTaa ? this._sceneColor : null
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
        this.taaBlend
      );
    } else if (this.taa) {
      // In a debug view: keep history fresh so switching back doesn't ghost.
      this.taaPass.reset();
    }

    this.renderer.autoClear = prevAutoClear;

    // Restore the caller's projection matrix (remove this frame's jitter).
    proj.elements[8] = savedProj8;
    proj.elements[9] = savedProj9;

    // Record this frame's (jittered) view-projection + jitter for next frame.
    this._prevViewProj.copy(this._jitteredViewProj);
    this._prevJitterUv.copy(this._jitterUv);
  }

  dispose() {
    if (!this.supported) return;
    this.gbuffer.dispose();
    this.rtPass.dispose();
    this.denoisePass.dispose();
    this.composite.dispose();
    this.taaPass.dispose();
    this.volumetricPass.dispose();
    this.restirPass.dispose();
    this._sceneColor.dispose();
    if (this.compiled) this.compiled.dispose();
  }
}
