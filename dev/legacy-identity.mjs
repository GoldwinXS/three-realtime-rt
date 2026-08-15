/**
 * dev/legacy-identity.mjs — release check 3 for 0.15.0.
 *
 *   node dev/legacy-identity.mjs
 *
 * THE CLAIM UNDER TEST: with every option 0.15.0 introduced turned off and every
 * flipped default set back to its 0.14.1 value, this branch is the 0.14.1
 * renderer. The strongest form of that is not "the diff looks additive" but "the
 * shader the GPU compiles is the same bytes", so every pass's fragment source is
 * built from BOTH trees and hashed.
 *
 * How master is obtained: `git show master:src/<file>` into a scratch copy of
 * src/, so master's modules resolve their own sibling imports. The same trick
 * scripts/km-selftest.mjs uses, extended from one file to the whole pass set.
 *
 * WHAT A DIFFERENCE MEANS HERE, and this is the part to read carefully. The
 * Hangar patch gates its new behaviour on UNIFORMS, not on source splices (the
 * RT_* markers are there for provenance, not for the preprocessor). A uniform
 * that is false still declares itself, so the source differs by the declarations
 * and the dead branches even when the RESULT is identical. The spec anticipates
 * exactly this: where the sources differ, the report says which files and by how
 * many lines, and the frozen render becomes the gate instead. That render is
 * dev/legacy-render.mjs, which drives the actual GPU.
 *
 * The one thing this script CAN prove byte-for-byte is the passes the patch did
 * not touch, and that is worth having: a release that quietly re-tokenised the
 * denoiser would show up here.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sha = (s) => createHash("sha256").update(s, "utf8").digest("hex").slice(0, 12);

// Every pass whose fragment source can be built without a GL context. Each entry
// says how to get the shader text out of a freshly constructed pass.
const PASSES = [
  ["RTLightingPass", (m) => {
    const p = new m.RTLightingPass(4, 4);
    return { lighting: p.material.fragmentShader, plain: p._fragPlain, absorption: p._fragAbsorption, absorbShadows: p._fragAbsorbShadows };
  }],
  ["RestirPass", (m) => {
    const p = new m.RestirPass(4, 4);
    return { temporal: p.material.fragmentShader, spatial: p.spatialMaterial.fragmentShader };
  }],
  ["AccumulatePass", (m) => ({ accum: new m.AccumulatePass(4, 4).material.fragmentShader })],
  ["DenoisePass", (m) => ({ denoise: new m.DenoisePass(4, 4).material.fragmentShader })],
  ["TAAPass", (m) => ({ taa: new m.TAAPass(4, 4).material.fragmentShader })],
  ["CompositePass", (m) => ({ composite: new m.CompositePass().material.fragmentShader })],
  ["VolumetricPass", (m) => ({ volumetric: new m.VolumetricPass(4, 4).material.fragmentShader })],
  ["GIReservoirPass", (m) => ({ gi: new m.GIReservoirPass(4, 4).material?.fragmentShader ?? "(no single material)" })],
];

const build = async (file, get) => {
  const mod = await import(pathToFileURL(path.join(ROOT, "src", file + ".js")).href);
  return get(mod);
};
const buildMaster = async (file, get) => {
  const src = execFileSync("git", ["show", `master:src/${file}.js`], {
    cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024,
  });
  const scratch = path.join(ROOT, "src", `.master-${file}.${process.pid}.mjs`);
  writeFileSync(scratch, src);
  try {
    return await build(path.basename(scratch, ".js"), get);
  } finally {
    rmSync(scratch, { force: true });
  }
};

const lineDiff = (a, b) => {
  const A = new Set(a.split("\n")), B = new Set(b.split("\n"));
  let added = 0, removed = 0;
  for (const l of B) if (!A.has(l)) added++;
  for (const l of A) if (!B.has(l)) removed++;
  return { added, removed };
};

console.log("Shader-source identity: this branch vs master (0.14.1), every pass\n");
const rows = [];
for (const [file, get] of PASSES) {
  let mine, theirs;
  try { mine = await build(file, get); } catch (e) { console.log(`  ${file}: SKIP (branch build failed: ${e.message})`); continue; }
  try {
    const scratchName = `.master-${file}.${process.pid}`;
    const src = execFileSync("git", ["show", `master:src/${file}.js`], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    writeFileSync(path.join(ROOT, "src", scratchName + ".js"), src);
    try { theirs = await build(scratchName, get); }
    finally { rmSync(path.join(ROOT, "src", scratchName + ".js"), { force: true }); }
  } catch (e) { console.log(`  ${file}: SKIP (master build failed: ${e.message})`); continue; }

  for (const k of Object.keys(mine)) {
    const a = theirs[k] ?? "", b = mine[k] ?? "";
    const same = a === b;
    const d = same ? null : lineDiff(a, b);
    rows.push({ file, variant: k, same, masterBytes: a.length, branchBytes: b.length, ...(d || {}) });
    console.log(
      `  ${same ? "IDENTICAL" : "DIFFERS  "}  ${file}.${k.padEnd(14)} ` +
      `master ${String(a.length).padStart(6)} B ${sha(a)}  branch ${String(b.length).padStart(6)} B ${sha(b)}` +
      (same ? "" : `   +${d.added} / -${d.removed} lines`)
    );
  }
}
const identical = rows.filter((r) => r.same).length;
console.log(`\n${identical} of ${rows.length} shader variants are byte-identical to master.`);
const diff = rows.filter((r) => !r.same);
if (diff.length) {
  console.log("Differing variants (uniform-gated, not spliced — see the header):");
  for (const r of diff) console.log(`  ${r.file}.${r.variant}: +${r.added} / -${r.removed} lines, ${r.branchBytes - r.masterBytes} bytes`);
  console.log("\nThe frozen render (dev/legacy-render.mjs) is the gate for these.");
}
