export { RealtimeRaytracer } from "./RealtimeRaytracer.js";
// Multiple-render-target constructor that spans the three versions in the peer
// range (three r172 removed WebGLMultipleRenderTargets). Exported because a
// denoiser plugin (see RealtimeRaytracer.setDenoiserPlugin) allocates its own
// MRTs and needs the same compatibility shim the library's passes use.
export { makeMRT } from "./mrtCompat.js";
export { compileScene, CompiledScene, MAX_LIGHTS } from "./SceneCompiler.js";
// The Kubelka-Munk two-flux maths as plain functions — the same expressions the
// scattering shader evaluates, usable on the CPU to predict what a given
// (K, S, thickness) will look like before anything is rendered.
export {
  kmReflectance,
  kmTransmittance,
  kmReflectanceInfinite,
  kmLayer,
  kmAddBelow,
  kmEmptyStack,
  kmStack,
  kmReflectanceRGB,
  kmTransmittanceRGB,
  kmReflectanceInfiniteRGB,
  kmStackRGB,
  coefficientFromColorDistance,
} from "./kubelkaMunk.js";
