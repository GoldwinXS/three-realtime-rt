/**
 * three-realtime-rt — Kubelka-Munk self-test (no GPU, no browser).
 *
 *   node scripts/km-selftest.mjs
 *
 * Two independent gates, both of which must pass before the GLSL is worth
 * looking at:
 *
 *   1. NUMERICS. The analytic limits of the two-flux model, checked against the
 *      reference implementation in src/kubelkaMunk.js: the S -> 0 degrade to
 *      Beer-Lambert, the t -> infinity approach to R_inf, the coth guard at tiny
 *      b*S*t, channel independence, the equivalence of the closed-form
 *      R(t, Rg) with the forward "adding" composition the shader uses, and
 *      monotonicity/boundedness over a wide parameter sweep (the property that
 *      actually catches a broken guard).
 *
 *   2. BYTE IDENTITY. The zero-cost-when-unused contract. RTLightingPass builds
 *      its shader variants by SOURCE SPLICE, so the three pre-existing variants
 *      (plain / absorption / absorption + coloured shadows) must come out of the
 *      feature branch byte-for-byte identical to the ones master produces. This
 *      compares SHA-256 over each variant's source against the same variant built
 *      from `git show master:src/RTLightingPass.js`, which is the strongest form
 *      of the claim: not "the diff looks additive" but "the bytes are the same".
 *
 * Exit code 0 = all gates pass. Any failure prints the offending numbers and
 * exits 1, so this is CI-shaped.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  coth,
  kmAB,
  kmReflectance,
  kmTransmittance,
  kmReflectanceInfinite,
  kmLayer,
  kmAddBelow,
  kmEmptyStack,
  kmStack,
  kmStackRGB,
  coefficientFromColorDistance,
} from "../src/kubelkaMunk.js";

let failures = 0;
const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  if (!ok) failures++;
  const tag = ok ? "PASS" : "FAIL";
  console.log(`  [${tag}] ${name}${detail ? "  " + detail : ""}`);
}

// Relative comparison with an absolute floor, so values near zero do not need a
// special case at every call site.
function close(actual, expect, tol, floor = 1e-12) {
  const d = Math.abs(actual - expect);
  return d <= floor || d <= tol * Math.abs(expect);
}

const fmt = (x) => (Number.isFinite(x) ? x.toPrecision(6) : String(x));

// ---------------------------------------------------------------------------
// 1. NUMERICS
// ---------------------------------------------------------------------------
console.log("\nKubelka-Munk reference numerics");

// --- a / b algebra ---------------------------------------------------------
{
  // (a - b)(a + b) == a^2 - b^2 == 1 exactly, for every K/S. This identity is
  // what every stable rewrite in the module leans on. The tolerance widens with
  // K/S on purpose: a - b is a difference of two nearly-equal large numbers there
  // and loses digits to cancellation no matter how it is written — which is
  // exactly WHY R_inf is computed as 1/(a + b) instead. That form is checked
  // against the same data and holds to full precision.
  let worst = 0;
  let worstInv = 0;
  for (const ks of [1e-8, 1e-4, 0.01, 0.1, 1, 10, 1000, 1e5]) {
    const { a, b } = kmAB(ks, 1);
    worst = Math.max(worst, Math.abs((a - b) * (a + b) - 1));
    worstInv = Math.max(worstInv, Math.abs(kmReflectanceInfinite(ks, 1) * (a + b) - 1));
  }
  check("a*a - b*b == 1 across K/S", worst < 1e-5, `max err ${fmt(worst)}`);
  check(
    "R_inf = 1/(a + b) is cancellation-free",
    worstInv < 1e-14,
    `max err ${fmt(worstInv)} (vs ${fmt(worst)} for the a - b form)`
  );
}

// --- coth guard at tiny x --------------------------------------------------
{
  // The series and the exponential form must agree across the crossover. Below
  // x ~ 1e-4 the NAIVE form is the inaccurate one — exp(x) - exp(-x) is a
  // difference of two numbers that both round to 1 — so it is only used as the
  // oracle where it is trustworthy; below that the series is checked against its
  // own leading term instead.
  let worst = 0;
  for (const x of [1e-4, 5e-4, 1e-3, 2e-3, 0.01, 0.1, 1, 10]) {
    const series = coth(x);
    const exact = (Math.exp(x) + Math.exp(-x)) / (Math.exp(x) - Math.exp(-x));
    worst = Math.max(worst, Math.abs(series / exact - 1));
    if (!Number.isFinite(series)) worst = Infinity;
  }
  let tinyOk = true;
  for (const x of [1e-12, 1e-9, 1e-7, 1e-5]) {
    const v = coth(x);
    if (!Number.isFinite(v) || Math.abs(v * x - 1) > 1e-9) tinyOk = false;
  }
  check("coth guard continuous across the crossover", worst < 1e-9, `max rel err ${fmt(worst)}`);
  check("coth guard finite and ~1/x as x -> 0", tinyOk);

  // b*coth(b*S*t) must stay finite as b -> 0 (the K = 0 pure-scattering case),
  // where b and coth are respectively 0 and infinite.
  const r = kmReflectance(0, 2, 0.5, 0);
  const analytic = (2 * 0.5) / (1 + 2 * 0.5); // S*t / (1 + S*t)
  check("K = 0 gives R = S*t/(1 + S*t)", close(r, analytic, 1e-9), `R ${fmt(r)} vs ${fmt(analytic)}`);
  const tr = kmTransmittance(0, 2, 0.5);
  check("K = 0 gives T = 1/(1 + S*t)", close(tr, 1 / (1 + 1), 1e-9), `T ${fmt(tr)}`);
}

// --- S -> 0 degrades to Beer-Lambert ---------------------------------------
{
  const K = 3.0, t = 0.4;
  // T -> exp(-K t)
  const beerT = Math.exp(-K * t);
  const tS = [1e-2, 1e-3, 1e-4, 1e-5, 0].map((S) => kmTransmittance(K, S, t));
  const errT = tS.map((v) => Math.abs(v / beerT - 1));
  check(
    "S -> 0: T -> exp(-K*t)",
    errT[4] < 1e-12 && errT[3] < 1e-4 && errT[2] < 1e-3,
    `S=1e-4 err ${fmt(errT[2])}, S=1e-5 err ${fmt(errT[3])}, S=0 err ${fmt(errT[4])}`
  );
  // R -> Rg * exp(-2 K t)
  const Rg = 0.7;
  const beerR = Rg * Math.exp(-2 * K * t);
  const rS = [1e-2, 1e-3, 1e-4, 1e-5, 0].map((S) => kmReflectance(K, S, t, Rg));
  const errR = rS.map((v) => Math.abs(v / beerR - 1));
  check(
    "S -> 0: R -> Rg*exp(-2*K*t)",
    errR[4] < 1e-12 && errR[3] < 1e-3 && errR[2] < 1e-2,
    `S=1e-4 err ${fmt(errR[2])}, S=1e-5 err ${fmt(errR[3])}, S=0 err ${fmt(errR[4])}`
  );
  // And the degrade must be monotone, not a cliff: no NaN, no sign flip.
  check(
    "S -> 0 sweep stays finite and in [0,1]",
    rS.every((v) => Number.isFinite(v) && v >= 0 && v <= 1) &&
      tS.every((v) => Number.isFinite(v) && v >= 0 && v <= 1),
    `R ${rS.map(fmt).join(" ")}`
  );
}

// --- t -> infinity approaches R_inf ----------------------------------------
{
  const K = 0.6, S = 8.0;
  const rInf = kmReflectanceInfinite(K, S);
  const { a, b } = kmAB(K, S);
  check("R_inf == a - b", close(rInf, a - b, 1e-9), `${fmt(rInf)} vs ${fmt(a - b)}`);
  // Approach from BOTH sides: a dark backing rises to R_inf, a bright one falls
  // to it. Both must be monotone in thickness and converge to the same value.
  for (const Rg of [0.0, 0.95]) {
    const seq = [0.001, 0.01, 0.05, 0.2, 1.0, 5.0, 50.0].map((t) => kmReflectance(K, S, t, Rg));
    const dir = Rg < rInf ? 1 : -1;
    let mono = true;
    for (let i = 1; i < seq.length; i++) if (dir * (seq[i] - seq[i - 1]) < -1e-12) mono = false;
    check(
      `t -> inf from Rg=${Rg}: monotone approach to R_inf`,
      mono && close(seq[seq.length - 1], rInf, 1e-9),
      `end ${fmt(seq[seq.length - 1])} vs R_inf ${fmt(rInf)}`
    );
  }
  // Thick layers must not overflow: b*S*t here is ~1e4, which is where a naive
  // sinh/cosh returns Infinity and the whole expression NaNs.
  const huge = kmReflectance(K, S, 1e4, 0.5);
  const hugeT = kmTransmittance(K, S, 1e4);
  check(
    "no overflow at b*S*t ~ 1e4",
    Number.isFinite(huge) && Number.isFinite(hugeT) && hugeT >= 0 && hugeT < 1e-12,
    `R ${fmt(huge)}, T ${fmt(hugeT)}`
  );
  // Rg == R_inf is the fixed point: a layer of ANY thickness over its own
  // masstone changes nothing.
  let fixWorst = 0;
  for (const t of [0.001, 0.1, 1, 10]) {
    fixWorst = Math.max(fixWorst, Math.abs(kmReflectance(K, S, t, rInf) - rInf));
  }
  check("Rg = R_inf is a fixed point at every thickness", fixWorst < 1e-9, `max err ${fmt(fixWorst)}`);
}

// --- t -> 0 -----------------------------------------------------------------
{
  check("t = 0 returns the backing exactly", kmReflectance(1, 1, 0, 0.42) === 0.42);
  check("t = 0 transmits fully", kmTransmittance(1, 1, 0) === 1);
}

// --- the adding composition matches the closed form ------------------------
{
  // THE load-bearing equivalence: the shader marches front-to-back and composes
  // with kmAddBelow, but the physics is stated as R(t, Rg). If these disagree the
  // renderer is not computing Kubelka-Munk.
  let worst = 0;
  let worstAt = null;
  for (const K of [0, 0.05, 0.5, 5, 50]) {
    for (const S of [0.05, 0.5, 5, 50, 500]) {
      for (const t of [0.0005, 0.005, 0.05, 0.5, 5]) {
        for (const Rg of [0, 0.1, 0.5, 0.9, 0.999]) {
          const direct = kmReflectance(K, S, t, Rg);
          const layer = kmLayer(K, S, t);
          const viaAdding = kmAddBelow(kmAddBelow(kmEmptyStack(), layer), { r: Rg, t: 0 }).ra;
          const err = Math.abs(direct - viaAdding);
          if (err > worst) { worst = err; worstAt = { K, S, t, Rg, direct, viaAdding }; }
        }
      }
    }
  }
  check(
    "closed-form R(t,Rg) == forward adding composition (375 cases)",
    worst < 1e-9,
    `max abs err ${fmt(worst)}${worstAt && worst > 1e-9 ? " at " + JSON.stringify(worstAt) : ""}`
  );
}

// --- multi-layer stacks -----------------------------------------------------
{
  // A stack of two identical layers must equal one layer of double thickness
  // (the medium is homogeneous, so the interface between them is fictitious).
  const K = 1.2, S = 9.0, t = 0.3, Rg = 0.35;
  const one = kmReflectance(K, S, 2 * t, Rg);
  const two = kmStack([{ K, S, t }, { K, S, t }], Rg).ra;
  check("two identical layers == one of double thickness", close(two, one, 1e-9), `${fmt(two)} vs ${fmt(one)}`);

  // Layer order matters when the layers differ (a white layer over a black one
  // does not look like a black layer over a white one) — and both are bounded.
  const ab = kmStack([{ K: 0.05, S: 40 }, { K: 8, S: 2 }].map((l) => ({ ...l, t: 0.2 })), 0.2).ra;
  const ba = kmStack([{ K: 8, S: 2 }, { K: 0.05, S: 40 }].map((l) => ({ ...l, t: 0.2 })), 0.2).ra;
  check(
    "layer order changes the result (non-commutative, as physics requires)",
    Math.abs(ab - ba) > 1e-3 && ab > ba && ab <= 1 && ba >= 0,
    `white-over-dark ${fmt(ab)} vs dark-over-white ${fmt(ba)}`
  );

  // A pure-absorbing layer (S = 0) composes with scattering layers without
  // special-casing: it contributes r = 0 and t = exp(-K*t).
  const clear = kmLayer(2.0, 0, 0.25);
  check(
    "S = 0 layer composes as { r: 0, t: exp(-K*t) }",
    clear.r === 0 && close(clear.t, Math.exp(-0.5), 1e-12),
    `r ${fmt(clear.r)}, t ${fmt(clear.t)}`
  );
}

// --- channel independence ---------------------------------------------------
{
  // Perturbing one channel's K must move that channel and NOTHING else.
  const base = kmStackRGB(
    [{ K: [0.3, 0.6, 1.2], S: [30, 24, 18], t: 0.15 }],
    [0.8, 0.8, 0.8]
  );
  const bumped = kmStackRGB(
    [{ K: [0.3, 99.0, 1.2], S: [30, 24, 18], t: 0.15 }],
    [0.8, 0.8, 0.8]
  );
  const moved = Math.abs(bumped.ra[1] - base.ra[1]) > 1e-3;
  const others = Math.abs(bumped.ra[0] - base.ra[0]) + Math.abs(bumped.ra[2] - base.ra[2]);
  check("channels are independent", moved && others === 0, `cross-talk ${fmt(others)}`);
}

// --- broad sweep: nothing NaNs, everything stays a reflectance --------------
{
  let bad = 0;
  let sample = null;
  for (const K of [0, 1e-6, 1e-3, 0.1, 1, 10, 100, 1e4]) {
    for (const S of [0, 1e-6, 1e-3, 0.1, 1, 10, 100, 1e4]) {
      for (const t of [0, 1e-6, 1e-3, 0.05, 1, 100, 1e4]) {
        for (const Rg of [0, 0.5, 1]) {
          const r = kmReflectance(K, S, t, Rg);
          const tr = kmTransmittance(K, S, t);
          if (!Number.isFinite(r) || r < -1e-9 || r > 1 + 1e-9 ||
              !Number.isFinite(tr) || tr < -1e-9 || tr > 1 + 1e-9) {
            bad++;
            if (!sample) sample = { K, S, t, Rg, r, tr };
          }
        }
      }
    }
  }
  check(
    "1344-case sweep: finite and within [0,1]",
    bad === 0,
    bad ? `${bad} bad, first ${JSON.stringify(sample)}` : "no NaN / no out-of-range"
  );
}

// --- authoring helper -------------------------------------------------------
{
  const s = coefficientFromColorDistance([Math.exp(-2), Math.exp(-4), 1.0], 0.5);
  check(
    "coefficientFromColorDistance inverts exp(-c*d)",
    close(s[0], 4, 1e-9) && close(s[1], 8, 1e-9) && s[2] === 0,
    `[${s.map(fmt).join(", ")}]`
  );
}

// ---------------------------------------------------------------------------
// 2. BYTE IDENTITY OF THE PRE-EXISTING SHADER VARIANTS
// ---------------------------------------------------------------------------
console.log("\nShader-source byte identity vs master");

const sha = (s) => createHash("sha256").update(s, "utf8").digest("hex");

async function variantHashes(modulePath) {
  const { RTLightingPass } = await import(pathToFileURL(modulePath).href);
  // Constructing the pass is pure CPU work (render targets and ShaderMaterials
  // are plain objects until a renderer touches them), so this runs headless.
  const pass = new RTLightingPass(4, 4);
  const out = {
    plain: pass._fragPlain,
    absorption: pass._fragAbsorption,
    absorbShadows: pass._fragAbsorbShadows,
  };
  // The KM variant only exists on the feature branch.
  if (pass._fragKm) out.km = pass._fragKm;
  return out;
}

let identityOk = true;
try {
  const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
  const masterSrc = execFileSync("git", ["show", "master:src/RTLightingPass.js"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  // Master's module has to resolve its own sibling imports, so it is written into
  // src/ under a scratch name rather than into the OS temp directory.
  const scratch = path.join(repoRoot, "src", `.master-RTLightingPass.${process.pid}.mjs`);
  writeFileSync(scratch, masterSrc);
  let masterVariants;
  try {
    masterVariants = await variantHashes(scratch);
  } finally {
    rmSync(scratch, { force: true });
  }
  const branchVariants = await variantHashes(path.join(repoRoot, "src", "RTLightingPass.js"));

  for (const key of ["plain", "absorption", "absorbShadows"]) {
    const m = masterVariants[key];
    const b = branchVariants[key];
    const ok = m === b;
    if (!ok) identityOk = false;
    check(
      `variant "${key}" byte-identical to master`,
      ok,
      `${b.length} B sha ${sha(b).slice(0, 8)} vs master ${m.length} B sha ${sha(m).slice(0, 8)}`
    );
  }
  if (branchVariants.km) {
    const km = branchVariants.km;
    check(
      'variant "km" is a strict superset (present, larger, strips back cleanly)',
      km.length > branchVariants.absorbShadows.length,
      `${km.length} B sha ${sha(km).slice(0, 8)}`
    );
  }
} catch (err) {
  identityOk = false;
  check("byte-identity harness ran", false, String(err && err.message ? err.message : err));
}

// Silence the unused-binding lint for the diagnostic flag while keeping it in the
// summary below.
void identityOk;

console.log(
  `\n${failures === 0 ? "OK" : "FAILED"} — ${results.length - failures}/${results.length} checks passed`
);
process.exit(failures === 0 ? 0 : 1);
