/**
 * dev/drive.mjs — drive ONE page of the dev server in headed chromium and print
 * what it says, so a single check can be run without the whole test:render
 * matrix (which launches six browsers and takes about twenty minutes on this
 * machine).
 *
 *   node dev/drive.mjs "<url>" [--wait <selector>] [--ms <timeout>] [--eval <expr>]
 *                              [--shot <path>] [--shot-after <ms>]
 *
 * Launch flags are the ones scripts/selftest.mjs proved on this machine:
 * headed, --use-angle=gl (native NVIDIA GL — every D3D11/FXC path stalls
 * compiling the BVH megakernel here) and the anti-throttling switches so an
 * occluded window still gets full-rate rAF.
 *
 * Playwright is not a dependency of this package; it is loaded from the sibling
 * WebsiteDesignSniper checkout, exactly as scripts/selftest.mjs does.
 */
import { pathToFileURL } from "node:url";
import path from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

const PLAYWRIGHT_DIR = "C:/ClaudeSessions/WebsiteDesignSniper/node_modules/playwright";
const { chromium } = await import(
  pathToFileURL(path.join(PLAYWRIGHT_DIR, "index.mjs")).href
);

const argv = process.argv.slice(2);
const url = argv[0];
const flag = (name, dflt = null) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : dflt;
};
const waitFor = flag("--wait", "#selftest-verdict");
const timeoutMs = parseInt(flag("--ms", "180000"), 10);
const evalExpr = flag("--eval", null);
const shot = flag("--shot", null);
const shotAfter = parseInt(flag("--shot-after", "0"), 10);
const viewport = flag("--viewport", "1280x720").split("x").map(Number);

const browser = await chromium.launch({
  headless: false,
  args: [
    "--use-angle=gl",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});
const logs = [];
let code = 0;
try {
  const page = await browser.newPage({ viewport: { width: viewport[0], height: viewport[1] } });
  page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`PAGEERROR: ${e.message}`));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  if (waitFor && waitFor !== "none") {
    await page.waitForFunction(
      (sel) => {
        const n = document.querySelector(sel);
        return !!(n && n.textContent && n.textContent.length > 0);
      },
      waitFor,
      { timeout: timeoutMs }
    );
    console.log(await page.$eval(waitFor, (n) => n.textContent));
  }

  if (evalExpr) {
    const out = await page.evaluate(`(async () => { ${evalExpr} })()`);
    console.log(typeof out === "string" ? out : JSON.stringify(out));
  }

  if (shot) {
    if (shotAfter > 0) await page.waitForTimeout(shotAfter);
    mkdirSync(path.dirname(shot), { recursive: true });
    const buf = await page.screenshot();
    writeFileSync(shot, buf);
    console.log(`shot: ${shot} (${buf.length} B)`);
  }
} catch (err) {
  code = 1;
  console.error(`DRIVE FAILED: ${err.message}`);
  for (const l of logs.slice(-25)) console.error("  " + l);
} finally {
  await browser.close();
}
process.exit(code);
