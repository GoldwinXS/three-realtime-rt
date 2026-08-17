// Consumer-shaped construction, the same check the 0.14.1 "Types" commit used
// (tsc --strict against a real call site rather than tsc over the .d.ts alone,
// which never exercises the option object).
import * as THREE from "three";
import { RealtimeRaytracer, makeMRT } from "../../src/index.js";
import type { DenoiserPlugin } from "../../src/index.js";

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();

// Every option 0.15.0 introduced or flipped, passed explicitly.
const rt = new RealtimeRaytracer(renderer, {
  gi: false,
  ambient: true,
  stochasticLights: false,
  motionVectors: true,
  restirDirectionalBypass: true,
  restirReprojectionRescue: true,
  restirCandidateImportance: true,
  restirClampRel: 2,
  restirWarmAge: 0,
  restirSamples: 1,
  restirSampleRadius: 10,
  restirDynamicAccept: false,
  restirDynamicFreeze: false,
  gpuTiming: "auto",
  // 0.16.0
  maxLights: 96,
  restirLightGrid: true,
});

// Live-assignable properties.
rt.ambient = false;
rt.gi = true;
rt.motionVectors = false;
rt.restirClampRel = 0;
rt.restirSamples = 3;
rt.restirDynamicFreeze = true;
// 0.16.0 live + read-only surface.
rt.restirLightGrid = false;
const cap: number = rt.maxLights;
const lit: number = rt.lightCount;
const supported: boolean = rt.motionVectorsSupported;
const cost: number | null = rt.gpuCostMs;

// The new static, and the shape a reset button actually uses.
const D = RealtimeRaytracer.DEFAULTS;
const g: boolean | undefined = D.gi;
const a: boolean | undefined = D.ambient;
const clamp: number | undefined = D.restirClampRel;
const gridDefault: boolean | undefined = D.restirLightGrid;

// The compiled scene's new field.
rt.compileScene(scene);
const power: number = rt.compiled!.emissivePower;
const row: number = rt.compiled!.lightRow;
const compiledCap: number = rt.compiled!.maxLights;

// The denoiser plugin hook: a minimal conforming plugin, attached and detached.
const plugin: DenoiserPlugin = {
  render(_renderer, rawIrr, rawSpec, gbuffer, _viewMatrix, ctx) {
    const hasMotion: boolean = ctx.motion !== null && gbuffer.motion !== null;
    const p00: number = ctx.proj[0];
    void hasMotion; void p00; void ctx.warp; void ctx.frame;
    return { irradiance: rawIrr, specular: rawSpec };
  },
  setSize(_w: number, _h: number) {},
  resetHistory() {},
  dispose() {},
};
rt.setDenoiserPlugin(plugin);
const pluginActive: boolean = rt.denoiserPluginActive;
const attached: DenoiserPlugin | null = rt.denoiserPlugin;
rt.rawInputView = true;
rt.setDenoiserPlugin(null);
// The MRT shim a plugin uses for its own targets.
const mrt = makeMRT(64, 64, 3, { depthBuffer: false });

rt.render(scene, camera);
export { supported, cost, g, a, clamp, power, cap, lit, gridDefault, row, compiledCap,
         pluginActive, attached, mrt };
