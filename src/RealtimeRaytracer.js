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
    this.sampleCount = 0;
    this.frame = 0;

    /** Debug view: 0 composite, 1 albedo, 2 normal, 3 irradiance, 4 worldPos, 5 emissive */
    this.outputMode = 0;
    /** Environment (sky) color used for GI rays that miss + composite background. */
    this.envColor = options.envColor ?? new THREE.Color(0.03, 0.04, 0.06);
    this.envIntensity = options.envIntensity ?? 1.0;
    /** Ray offset epsilon — raise for large scenes if you see acne. */
    this.eps = options.eps ?? 1e-3;

    this._prevCameraMatrix = new THREE.Matrix4();
    this._prevProjMatrix = new THREE.Matrix4();
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
    this.sampleCount = 0;
  }

  setSize(width, height) {
    this._width = Math.floor(width);
    this._height = Math.floor(height);
    this.gbuffer.setSize(this._width, this._height);
    this.rtPass.setSize(this._width, this._height);
    this.resetAccumulation();
  }

  _cameraMoved(camera) {
    camera.updateMatrixWorld();
    const m = camera.matrixWorld.elements;
    const p = camera.projectionMatrix.elements;
    const pm = this._prevCameraMatrix.elements;
    const pp = this._prevProjMatrix.elements;
    let moved = false;
    for (let i = 0; i < 16; i++) {
      if (Math.abs(m[i] - pm[i]) > 1e-6 || Math.abs(p[i] - pp[i]) > 1e-6) {
        moved = true;
        break;
      }
    }
    this._prevCameraMatrix.copy(camera.matrixWorld);
    this._prevProjMatrix.copy(camera.projectionMatrix);
    return moved;
  }

  render(scene, camera) {
    if (!this.compiled) this.compileScene(scene);

    if (this._cameraMoved(camera)) this.resetAccumulation();
    this.sampleCount += 1;
    this.frame += 1;

    const prevAutoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;

    // 1. rasterize G-buffer
    this.gbuffer.render(this.renderer, scene, camera);

    // 2. ray traced lighting, accumulated
    const rtU = this.rtPass.material.uniforms;
    rtU.uEnvColor.value.copy(this.envColor);
    rtU.uEnvIntensity.value = this.envIntensity;
    rtU.uEps.value = this.eps;
    const irradiance = this.rtPass.render(
      this.renderer,
      this.gbuffer,
      this.sampleCount,
      this.frame
    );

    // 3. composite to screen
    this.composite.material.uniforms.uOutputMode.value = this.outputMode;
    this.composite.render(this.renderer, irradiance, this.gbuffer, scene.background);

    this.renderer.autoClear = prevAutoClear;
  }

  dispose() {
    this.gbuffer.dispose();
    this.rtPass.dispose();
    this.composite.dispose();
    if (this.compiled) this.compiled.dispose();
  }
}
