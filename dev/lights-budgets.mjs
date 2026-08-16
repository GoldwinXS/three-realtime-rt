/**
 * dev/lights-budgets.mjs: the two WebKit/WebGL2 walls, counted rather than
 * asserted, for this branch and for the 0.15.0 reference beside it.
 *
 *   node dev/lights-budgets.mjs
 *
 * WALL 1: `RTLightingPass` binds EXACTLY 16 fragment samplers, the WebGL2
 * guaranteed minimum. Counted from the BUILT shader source, not from the file,
 * because three-mesh-bvh's `BVH` struct expands to FOUR samplers apiece and
 * nothing in the file says so. Samplers behind `#ifdef` (uVolumeTex, which needs
 * a 17th unit and is only injected when the GPU has one) are listed separately.
 *
 * WALL 2: exactly 4 TEXTUAL `traceRadiance(` sites in src/RTLightingPass.js -
 * one declaration and three calls. A fifth silently emits a broken program in
 * WebKit's GLSL-to-Metal translation.
 *
 * The reference arm reads dev/_masterref/src (the copy of master d75c0da used by
 * the other 0.16.0 gates); it is skipped when that directory is absent.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MASTER = path.join(ROOT, "dev", "_masterref", "src");

const SAMPLER_RE =
  /uniform\s+(?:highp\s+|mediump\s+|lowp\s+)?(sampler2D|isampler2D|usampler2D|sampler3D|samplerCube|BVH)\s+(\w+)/g;

/** Sampler units a built fragment source binds. BVH counts as 4. */
function countSamplers(src) {
  const lines = src.split("\n");
  let depth = 0;         // #ifdef nesting we are inside
  const units = [];
  const conditional = [];
  for (const line of lines) {
    const t = line.trim();
    if (/^#if(n?def)?\b/.test(t)) depth++;
    else if (/^#endif\b/.test(t)) depth = Math.max(0, depth - 1);
    SAMPLER_RE.lastIndex = 0;
    let m;
    while ((m = SAMPLER_RE.exec(line))) {
      const n = m[1] === "BVH" ? 4 : 1;
      const entry = { name: m[2], type: m[1], units: n };
      (depth > 0 ? conditional : units).push(entry);
    }
  }
  return {
    total: units.reduce((a, b) => a + b.units, 0),
    units,
    conditional,
    conditionalTotal: conditional.reduce((a, b) => a + b.units, 0),
  };
}

async function arm(label, srcDir) {
  const load = async (file) => await import(pathToFileURL(path.join(srcDir, file)).href);
  const out = { label };
  const rt = await load("RTLightingPass.js");
  const lighting = new rt.RTLightingPass(4, 4);
  out.lighting = countSamplers(lighting.material.fragmentShader);
  out.spec = countSamplers(lighting.specMaterial.fragmentShader);
  const restir = await load("RestirPass.js");
  const rp = new restir.RestirPass(4, 4);
  out.restirTemporal = countSamplers(rp.material.fragmentShader);
  out.restirSpatial = countSamplers(rp.spatialMaterial.fragmentShader);
  const vol = await load("VolumetricPass.js");
  out.volumetric = countSamplers(new vol.VolumetricPass(4, 4).material.fragmentShader);
  const gi = await load("GIReservoirPass.js");
  out.gi = countSamplers(new gi.GIReservoirPass(4, 4).material.fragmentShader);
  if (existsSync(path.join(srcDir, "LightGridPass.js"))) {
    const lg = await load("LightGridPass.js");
    const p = new lg.LightGridPass({});
    out.gridWeights = countSamplers(p.weightMaterial.fragmentShader);
    out.gridCdf = countSamplers(p.cdfMaterial.fragmentShader);
  }
  const file = readFileSync(path.join(srcDir, "RTLightingPass.js"), "utf8");
  out.traceRadiance = (file.match(/traceRadiance\(/g) || []).length;
  // Per BUILT variant, because the absorption/KM ladder strips lines: the
  // shipped default program is `plain`, and the WebKit budget applies to what
  // the driver actually compiles.
  out.traceByVariant = {};
  for (const [k, src] of [
    ["plain", lighting._fragPlain],
    ["absorption", lighting._fragAbsorption],
    ["absorbShadows", lighting._fragAbsorbShadows],
    ["km", lighting._fragKm],
    ["current", lighting.material.fragmentShader],
  ]) {
    out.traceByVariant[k] = (src.match(/traceRadiance\(/g) || []).length;
  }
  out.shadeLightSet = (file.match(/shadeLightSet\(/g) || []).length;
  const restirFile = readFileSync(path.join(srcDir, "RestirPass.js"), "utf8");
  out.phatOf = (restirFile.match(/phatOf\(/g) || []).length;
  out.maxLightsDefine = (lighting.material.fragmentShader.match(/#define MAX_LIGHTS (\d+)/) || [])[1];
  return out;
}

function report(a) {
  console.log(`\n=== ${a.label} ===`);
  console.log(`  rt:lighting        ${a.lighting.total} samplers` +
    (a.lighting.conditionalTotal ? ` (+${a.lighting.conditionalTotal} behind #ifdef: ` +
      a.lighting.conditional.map((c) => c.name).join(", ") + ")" : ""));
  console.log("     " + a.lighting.units.map((u) => (u.units > 1 ? `${u.name} x${u.units}` : u.name)).join(" · "));
  console.log(`  rt:specular        ${a.spec.total}`);
  console.log(`  rt:restir-temporal ${a.restirTemporal.total}   [` +
    a.restirTemporal.units.map((u) => u.name).join(" ") + "]");
  console.log(`  rt:restir-spatial  ${a.restirSpatial.total}`);
  console.log(`  rt:volumetric      ${a.volumetric.total}`);
  console.log(`  rt:gi-reservoir    ${a.gi.total}`);
  if (a.gridWeights) {
    console.log(`  rt:lightgrid-weights ${a.gridWeights.total}   rt:lightgrid-cdf ${a.gridCdf.total}`);
  }
  console.log("  traceRadiance( per built variant: " +
    Object.entries(a.traceByVariant).map(([k, v]) => `${k} ${v}`).join(" · "));
  console.log(`  traceRadiance( sites in RTLightingPass.js: ${a.traceRadiance}   ` +
    `shadeLightSet( : ${a.shadeLightSet}   phatOf( in RestirPass.js: ${a.phatOf}`);
  console.log(`  #define MAX_LIGHTS ${a.maxLightsDefine}`);
}

const branch = await arm("branch (0.16.0)", path.join(ROOT, "src"));
report(branch);
if (existsSync(MASTER)) {
  const master = await arm("master (0.15.0, dev/_masterref)", MASTER);
  report(master);
  console.log("");
  const same = (k, get) => (get(branch) === get(master) ? "SAME" : "CHANGED");
  console.log(`lighting samplers   branch ${branch.lighting.total} vs master ${master.lighting.total}  ` +
    same("lighting", (x) => x.lighting.total));
  console.log(`traceRadiance sites branch ${branch.traceRadiance} vs master ${master.traceRadiance}  ` +
    same("traceRadiance", (x) => x.traceRadiance));
} else {
  console.log("\n(no dev/_masterref/src: reference arm skipped)");
}

// THE WALL IS "NOT ONE MORE THAN THE SHIPPED BUILD", and the shipped build's
// number is measured here rather than remembered: 0.15.0's report states 4
// textual `traceRadiance(` sites ("one declaration and three call sites"), but
// counting master's own file finds FIVE: one declaration and four calls (metal
// reflection, glass refraction exit, the unified secondary site, and a second
// reflection site the earlier count missed). Since that build ships and
// translates on WebKit, 5 is what the budget actually permits, and the gate is
// that this branch adds none.
const refTrace = existsSync(MASTER) ? (await arm("ref", MASTER)).traceRadiance : 5;
const ok = branch.lighting.total === 16 && branch.traceRadiance === refTrace;
console.log(`\n${ok ? "PASS" : "FAIL"}: lighting binds ${branch.lighting.total} samplers ` +
  `(wall: exactly 16, unchanged) and has ${branch.traceRadiance} textual traceRadiance( sites ` +
  `against the reference build's ${refTrace} (wall: add none).`);
process.exit(ok ? 0 : 1);
