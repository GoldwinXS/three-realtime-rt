/**
 * dev/dynamic-partial-gates.mjs: run the 0.16.1 dynamic-partial gates in
 * HEADLESS chromium on the GPU and print the numbers.
 *
 *   node dev/dynamic-partial-gates.mjs identity   [--base http://localhost:8167]
 *   node dev/dynamic-partial-gates.mjs timing     [--base http://localhost:8167]
 *
 * identity: the same 90 deterministic frames run through the new partial path
 * and the old full path (compiled.forceFullDynamicUpdate = true) must produce
 * the same dynamic BVH root buffer, the same bounds texture, and the same
 * rendered pixels at frames 1 / 30 / 60 / 90, plus the rebuild gate (all parked
 * meshes moved 3000 units in one frame, volume x27) and a "full run twice" floor.
 *
 * timing: updateDynamic() CPU ms, partial vs full, 5 runs of 40 averaged
 * iterations each, for 1 mover + 380 parked / 1 mover only / all 381 moving /
 * nothing moving.
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
const BASE = flag("--base", "http://localhost:8167");
const TIMEOUT = parseInt(flag("--ms", "600000"), 10);

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-angle=gl",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

async function run(mode) {
  const url = `${BASE}/dev/dynamic-partial.html?mode=${mode}`;
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const logs = [];
  page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`PAGEERROR: ${e.message}`));
  try {
    // waitUntil "commit" (not "domcontentloaded"): under vite dev the module
    // graph is served on demand and DOMContentLoaded can lag well past the point
    // the harness script is already running; we poll for the verdict instead.
    await page.goto(url, { waitUntil: "commit", timeout: 120000 });
    await page.waitForFunction(
      () => {
        const n = document.querySelector("#selftest-verdict");
        return !!(n && n.textContent);
      },
      undefined,
      { timeout: TIMEOUT }
    );
    const verdict = JSON.parse(await page.$eval("#selftest-verdict", (n) => n.textContent));
    return { verdict, logs };
  } catch (err) {
    console.error(`RUN FAILED ${url}: ${err.message}`);
    for (const l of logs.slice(-15)) console.error("   " + l);
    throw err;
  } finally {
    await page.close();
  }
}

const f = (x, d = 3) => (Number.isFinite(x) ? x.toFixed(d) : "n/a");

if (MODE === "identity") {
  const { verdict } = await run("identity");
  if (verdict.threw) {
    console.error("identity arm threw:", verdict.error);
    process.exit(1);
  }
  console.log(`identity: ${verdict.triCount} total tris, ${Math.round(verdict.dynTriCount)} dynamic tris, ${verdict.segments} segments`);
  console.log(`last partial stat (frame 90): ${JSON.stringify(verdict.partialLastStat)}`);
  console.log(`last full stat (frame 90): ${JSON.stringify(verdict.fullLastStat)}`);
  console.log("\nBIT-EXACT (partial vs full), frames 1/30/60/90:");
  console.log("frame  rootU32   rootF32   boundsTex  contentsTex  pixels(diff)  pixelMean  | full-floor pixels(diff)");
  for (const fk of [1, 30, 60, 90]) {
    const r = verdict.identity[fk];
    const p = r.partialVsFull;
    const fl = r.fullFloor;
    console.log(
      `${String(fk).padEnd(6)} ${String(p.rootU32.diff).padEnd(9)} ${String(p.rootF32.diff).padEnd(9)} ${String(p.boundsTex.diff).padEnd(10)} ${String(p.contentsTex.diff).padEnd(12)} ` +
        `${String(p.pixels.diff).padEnd(12)} ${f(p.pixels.mean, 6).padEnd(10)} | ${String(fl.pixels.diff).padEnd(12)} ${f(fl.pixels.mean, 6)}`
    );
  }
  console.log("\nREBUILD gate (all parked moved +3000 at frame 11, volume x27):");
  console.log(`identity (steady) build volume: ${verdict.identityBuildVolume}`);
  console.log(`build volume after rebuild:     ${verdict.buildVolumeAfterRebuild}`);
  console.log(`rebuild-frame stat (partial):   ${JSON.stringify(verdict.rebuildFramePartialStat)}`);
  console.log(`rebuild-frame stat (full):      ${JSON.stringify(verdict.rebuildFrameFullStat)}`);
  console.log("frame  rootU32   rootF32   boundsTex  contentsTex  pixels(diff)  pixelMean");
  for (const fk of [5, 12, 15, 20]) {
    const r = verdict.rebuild[fk];
    console.log(
      `${String(fk).padEnd(6)} ${String(r.rootU32.diff).padEnd(9)} ${String(r.rootF32.diff).padEnd(9)} ${String(r.boundsTex.diff).padEnd(10)} ${String(r.contentsTex.diff).padEnd(12)} ` +
        `${String(r.pixels.diff).padEnd(12)} ${f(r.pixels.mean, 6)}`
    );
  }
} else if (MODE === "timing") {
  const { verdict } = await run("timing");
  if (verdict.threw) {
    console.error("timing arm threw:", verdict.error);
    process.exit(1);
  }
  console.log("TIMING (updateDynamic CPU ms, 5 runs x 40 iters; min / median):");
  console.log("scenario                full min/med      partial min/med    partial-vs-full");
  for (const [name, t] of Object.entries(verdict.timing)) {
    const fr = f(t.full.min / t.full.median, 3);
    const ratio = t.full.median > 0 ? (t.partial.median / t.full.median).toFixed(3) : "n/a";
    console.log(
      `${name.padEnd(23)} ${f(t.full.min, 3)}/${f(t.full.median, 3)}      ${f(t.partial.min, 3)}/${f(t.partial.median, 3)}      ${ratio}x`
    );
    console.log(`  full runs:    ${t.full.runs.map((x) => f(x, 3)).join(" ")}`);
    console.log(`  partial runs: ${t.partial.runs.map((x) => f(x, 3)).join(" ")}`);
  }
} else {
  console.error(`unknown mode "${MODE}"`);
}

await browser.close();
