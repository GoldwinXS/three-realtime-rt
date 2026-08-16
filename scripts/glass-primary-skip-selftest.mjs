import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL("../src/RTLightingPass.js", import.meta.url));
const source = readFileSync(here, "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(source.includes("uGlassPrimarySkip: { value: false }"),
  "glass-primary uniform is missing");
assert(source.includes("uniform bool uGlassPrimarySkip;"),
  "glass-primary uniform declaration is missing");
assert(source.includes(
  "skipGlassPrimary = uGlassPrimarySkip && uRefrEnabled && transmission == 1.0"
), "skip must require refraction and exact full transmission");
assert(source.includes("if (!skipGlassPrimary) {"),
  "primary direct/GI block is not guarded");
assert(source.includes("if (!skipGlassPrimary && uReflEnabled && metal > 0.001)"),
  "primary metal reflection must remain guarded");
assert(source.includes("this._transmissionData && !(this._kmOn && this._kmData)"),
  "transmission/KM compile state must control the optimization");
assert(!source.includes("glassprimaryskip") && !source.includes("_glassPrimarySkipRequested"),
  "temporary URL/debug gate must not ship");
assert(source.includes(
  "vec3 reflRad = traceRadiance(P + N * uEps, refl, true) + analyticGlint(P, refl);"
), "glass reflection path must remain intact; no Fresnel shortcut allowed");

const shaderMatch = source.match(/const rtLightingFrag = \/\* glsl \*\/ `([\s\S]*?)`;/);
assert(shaderMatch, "lighting shader source marker is missing");
const stripMarked = (src, tag) => {
  let drop = false;
  return src.split("\n").filter((line) => {
    if (line.includes(">>> " + tag)) {
      drop = true;
      return false;
    }
    if (line.includes("<<< " + tag)) {
      drop = false;
      return false;
    }
    return !drop;
  }).join("\n");
};
const opaqueShader = stripMarked(shaderMatch[1], "RT_REFRACTION");
assert(opaqueShader.includes("bool skipGlassPrimary = false;"),
  "opaque shader needs a false base value");
assert(!opaqueShader.includes("uGlassPrimarySkip"),
  "opaque shader must not reference the refraction-only uniform");

console.log("glass-primary-skip source invariants: passed");
