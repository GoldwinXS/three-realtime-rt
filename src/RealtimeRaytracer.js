import * as THREE from "three";
import { compileScene } from "./SceneCompiler.js";
import { GBufferPass } from "./GBufferPass.js";
import { RTLightingPass } from "./RTLightingPass.js";
import { CompositePass } from "./CompositePass.js";

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

    this.gbuffer = new GBufferPass(this._width, this._height);
    this.rtPass = new RTLightingPass(this._width, this._height);
    this.composite = new CompositePass();

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

    this._prevViewProj = new THREE.Matrix4();
    this._camWorldPos = new THREE.Vector3();
    this._needsClear = true;
  }

  /** Build/rebuild BVH + material and light tables from the scene. Call after scene changes. */
  compileScene(scene) {
    if (this.compiled) this.compiled.dispose();
    this.compiled = compileScene(scene);
    this.rtPass.setCompiledScene(this.compiled);
    this.resetAccumulation();
    return this.compiled;
  }

  resetAccumulation() {
    this._needsClear = true;
  }

  setSize(width, height) {
    this._width = Math.floor(width);
    this._height = Math.floor(height);
    this.gbuffer.setSize(this._width, this._height);
    this.rtPass.setSize(this._width, this._height);
    this.resetAccumulation();
  }

  render(scene, camera) {
    if (!this.compiled) this.compileScene(scene);

    this.frame += 1;
    camera.updateMatrixWorld();

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
    rtU.uPrevViewProj.value.copy(this._prevViewProj);
    rtU.uCameraPos.value.copy(camera.getWorldPosition(this._camWorldPos));
    const irradiance = this.rtPass.render(this.renderer, this.gbuffer, this.frame);

    // 3. composite to screen
    this.composite.material.uniforms.uOutputMode.value = this.outputMode;
    this.composite.render(this.renderer, irradiance, this.gbuffer, scene.background);

    this.renderer.autoClear = prevAutoClear;

    // Record this frame's view-projection for next frame's reprojection.
    this._prevViewProj
      .copy(camera.projectionMatrix)
      .multiply(camera.matrixWorldInverse);
  }

  dispose() {
    this.gbuffer.dispose();
    this.rtPass.dispose();
    this.composite.dispose();
    if (this.compiled) this.compiled.dispose();
  }
}
