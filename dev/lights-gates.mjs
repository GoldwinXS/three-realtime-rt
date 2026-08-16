/**
 * dev/lights-gates.mjs: run the 0.16.0 identity / convergence gate in headed
 * chromium and print numbers WITH THEIR FLOOR.
 *
 *   node dev/lights-gates.mjs identity  [--scenes museum,cornell,waterfall,rooms] [--k 1,90]
 *   node dev/lights-gates.mjs converge  --scene hotel --lights 96 --k 1,4,12 [--ref 400]
 *
 * Every comparison runs the IDENTICAL arm twice first, so the number beside each
 * result is the protocol's own reproducibility, not an assumption about it. The
 * launch flags are the ones this machine needs (headed, --use-angle=gl).
 */
import { pathToFileURL } from "node:url";
import path from "node:path";

const PLAYWRIGHT_DIR = "C:/ClaudeSessions/WebsiteDesignSniper/node_modules/playwright";
const { chromium } = await import(pathToFileURL(path.join(PLAYWRIGHT_DIR, "index.mjs")).href);

const argv = process.argv.slice(2);
const MODE = argv[0] || "identity";
const flag = (name, dflt = null) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : dflt;
};
const BASE = flag("--base", "http://localhost:8151");
const SCENES = flag("--scenes", "museum,cornell,waterfall,rooms").split(",");
const KS = flag("--k", "1,90").split(",").map(Number);
const LIGHTS = flag("--lights", null);
const MAXLIGHTS = flag("--maxlights", "32");
const REF = parseInt(flag("--ref", "400"), 10);
const TIMEOUT = parseInt(flag("--ms", "300000"), 10);

const browser = await chromium.launch({
  headless: false,
  args: [
    "--use-angle=gl",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

/** Load one arm and return { verdict, pixels: Buffer }. */
async function run(params) {
  const q = new URLSearchParams(params).toString();
  const url = `${BASE}/dev/lights-identity.html?${q}`;
  const page = await browser.newPage({ viewport: { width: 1400, height: 820 } });
  const logs = [];
  page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`PAGEERROR: ${e.message}`));
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForFunction(
      () => {
        const n = document.querySelector("#selftest-verdict");
        return !!(n && n.textContent);
      },
      undefined,
      { timeout: TIMEOUT }
    );
    const verdict = JSON.parse(await page.$eval("#selftest-verdict", (n) => n.textContent));
    if (verdict.threw) throw new Error(verdict.error);
    const b64 = params.dump === "0" ? null : await page.evaluate(() => window.__PIXB64 || null);
    return { verdict, pixels: b64 ? Buffer.from(b64, "base64") : null };
  } catch (err) {
    console.error(`RUN FAILED ${url}: ${err.message}`);
    for (const l of logs.slice(-12)) console.error("   " + l);
    throw err;
  } finally {
    await page.close();
  }
}

/** Mean |diff| per RGB byte, and the share of bytes that differ at all. */
function diff(a, b) {
  if (!a || !b || a.length !== b.length) return { mean: NaN, maxAbs: NaN, differing: NaN };
  let sum = 0;
  let max = 0;
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    const d = Math.abs(a[i] - b[i]);
    sum += d;
    if (d > max) max = d;
    if (d !== 0) n++;
  }
  return {
    mean: sum / a.length,
    maxAbs: max,
    differing: n / a.length,
    bytes: n,
    total: a.length,
  };
}
const f = (x, d = 4) => (Number.isFinite(x) ? x.toFixed(d) : "n/a");

if (MODE === "identity") {
  console.log("scene      k    arm            hash      meanLum    mean|diff| vs master  (floor: master twice)");
  for (const scene of SCENES) {
    for (const k of KS) {
      const common = { scene, k: String(k), maxlights: MAXLIGHTS, grid: "0" };
      if (flag("--candcdf")) common.candcdf = flag("--candcdf");
      if (LIGHTS) common.lights = LIGHTS;
      const m1 = await run({ ...common, src: "master" });
      const m2 = await run({ ...common, src: "master" });
      const b1 = await run({ ...common, src: "branch" });
      const floor = diff(m1.pixels, m2.pixels);
      const d = diff(m1.pixels, b1.pixels);
      console.log(
        `${scene.padEnd(10)} ${String(k).padEnd(4)} master         ${m1.verdict.hash}  ${String(m1.verdict.meanLum).padEnd(9)} ` +
          `floor mean ${f(floor.mean, 6)}  max ${floor.maxAbs}  differing ${floor.bytes}/${floor.total}`
      );
      console.log(
        `${"".padEnd(10)} ${String(k).padEnd(4)} branch(32,g0)  ${b1.verdict.hash}  ${String(b1.verdict.meanLum).padEnd(9)} ` +
          `mean ${f(d.mean, 6)}  max ${d.maxAbs}  differing ${d.bytes}/${d.total}  ` +
          `[lights ${b1.verdict.lights}, row ${b1.verdict.lightRow}, cells ${b1.verdict.gridCells}]`
      );
    }
  }
} else if (MODE === "converge") {
  const scene = flag("--scene", "hotel");
  console.log(`converge: ${scene} lights=${LIGHTS} ref k=${REF}`);
  const base = { scene, maxlights: flag("--maxlights", "128") };
  if (LIGHTS) base.lights = LIGHTS;
  for (const grid of ["1", "0"]) {
    const ref = await run({ ...base, grid, k: String(REF), src: "branch" });
    const ref2 = await run({ ...base, grid, k: String(REF), src: "branch" });
    const refFloor = diff(ref.pixels, ref2.pixels);
    console.log(
      `  grid=${grid} reference k=${REF}: hash ${ref.verdict.hash} meanLum ${ref.verdict.meanLum} ` +
        `(reference reproducibility: mean ${f(refFloor.mean)})`
    );
    for (const k of KS) {
      const a = await run({ ...base, grid, k: String(k), src: "branch" });
      const b = await run({ ...base, grid, k: String(k), src: "branch" });
      const d = diff(a.pixels, ref.pixels);
      const fl = diff(a.pixels, b.pixels);
      console.log(
        `  grid=${grid} k=${String(k).padEnd(3)} mean|k - converged| ${f(d.mean)}  ` +
          `(same-arm floor ${f(fl.mean)})  meanLum ${a.verdict.meanLum}  lights ${a.verdict.lights}`
      );
    }
  }
} else {
  console.error(`unknown mode "${MODE}"`);
}

await browser.close();
