import * as THREE from "three";
import { compileScene, syncLights } from "./SceneCompiler.js";
import { GBufferPass } from "./GBufferPass.js";
import { RTLightingPass } from "./RTLightingPass.js";
import { DenoisePass } from "./DenoisePass.js";
import { CompositePass } from "./CompositePass.js";
import { TAAPass } from "./TAAPass.js";

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
  constructor(renderer, options = {}) {
    this.renderer = renderer;

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

    this.gbuffer = new GBufferPass(this._width, this._height);
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
    /** Ray offset epsilon — raise for large scenes if you see acne. */
    this.eps = options.eps ?? 1e-3;
    /** Reproject accumulated lighting through camera motion (stage 2). */
    this.temporalReprojection = options.temporalReprojection ?? true;
    /** History length cap: higher = smoother but slower to react. */
    this.maxHistory = options.maxHistory ?? 128;
    /** Clamp on indirect luminance to suppress fireflies. 0 disables. */
    this.fireflyClamp = options.fireflyClamp ?? 4.0;
    /** 1-bounce global illumination (traced indirect). Toggle for a direct-only look. */
    this.gi = options.gi ?? true;
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

    /** Distance fog (composited in linear space before tonemap). */
    this.fog = {
      enabled: options.fog?.enabled ?? false,
      color: options.fog?.color ?? new THREE.Color(0.5, 0.6, 0.7),
      density: options.fog?.density ?? 0.05,
    };
    this._jitterIndex = 0;
    this._jitteredViewProj = new THREE.Matrix4();

    this._prevViewProj = new THREE.Matrix4();
    this._camWorldPos = new THREE.Vector3();
    this._needsClear = true;
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
    if (this.compiled) this.compiled.dispose();
    this.compiled = compileScene(scene, options);
    this.rtPass.setCompiledScene(this.compiled);
    this.resetAccumulation();
    return this.compiled;
  }

  /** Re-bake moving (dynamic) meshes into the BVH. Call each frame after moving them. */
  updateDynamic() {
    if (this.compiled) this.compiled.updateDynamic(this.frame % 8 === 0);
  }

  /**
   * Refresh light positions/colors from the scene without a full recompile —
   * lets the demo toggle, move, and recolor lights live. Lights with intensity
   * 0 (or invisible) are dropped so they can be switched off.
   */
  updateLights(scene) {
    if (!this.compiled) return;
    syncLights(scene, this.compiled);
    this.rtPass.setCompiledScene(this.compiled);
  }

  resetAccumulation() {
    this._needsClear = true;
    if (this.taaPass) this.taaPass.reset();
  }

  get _scaledW() {
    return Math.max(1, Math.floor(this._width * this._renderScale));
  }
  get _scaledH() {
    return Math.max(1, Math.floor(this._height * this._renderScale));
  }

  get renderScale() {
    return this._renderScale;
  }
  set renderScale(v) {
    this._renderScale = v;
    this.setSize(this._width, this._height);
  }

  setSize(width, height) {
    this._width = Math.floor(width);
    this._height = Math.floor(height);
    this.gbuffer.setSize(this._width, this._height);
    this.rtPass.setSize(this._scaledW, this._scaledH);
    this.denoisePass.setSize(this._scaledW, this._scaledH);
    this.taaPass.setSize(this._width, this._height);
    this._sceneColor.setSize(this._width, this._height);
    this.resetAccumulation();
  }

  render(scene, camera) {
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
    if (this.taa) {
      this._jitterIndex = (this._jitterIndex + 1) % 16;
      const jx = (halton(this._jitterIndex + 1, 2) - 0.5) * 2 / this._width;
      const jy = (halton(this._jitterIndex + 1, 3) - 0.5) * 2 / this._height;
      proj.elements[8] += jx;
      proj.elements[9] += jy;
    }
    // View-projection actually used to render this frame (jittered if TAA on).
    this._jitteredViewProj
      .copy(proj)
      .multiply(camera.matrixWorldInverse);

    const prevAutoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;

    if (this._needsClear) {
      this.rtPass.clearHistory(this.renderer);
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
    rtU.uPrevViewProj.value.copy(this._prevViewProj);
    rtU.uViewProj.value.copy(this._jitteredViewProj);
    rtU.uCameraPos.value.copy(camera.getWorldPosition(this._camWorldPos));
    let irradiance = this.rtPass.render(this.renderer, this.gbuffer, this.frame);

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
        this._camWorldPos,
        this.eps,
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

    // Record this frame's (jittered) view-projection for next frame's reprojection.
    this._prevViewProj.copy(this._jitteredViewProj);
  }

  dispose() {
    this.gbuffer.dispose();
    this.rtPass.dispose();
    this.denoisePass.dispose();
    this.composite.dispose();
    this.taaPass.dispose();
    this._sceneColor.dispose();
    if (this.compiled) this.compiled.dispose();
  }
}
