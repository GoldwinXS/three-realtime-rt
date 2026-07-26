export { RealtimeRaytracer } from "./RealtimeRaytracer.js";
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
