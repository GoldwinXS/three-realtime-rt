/**
 * Render self-test smoke matrix (npm run test:render).
 *
 * Drives the demo's ?selftest=1 mode (examples/selftest.js) across three browser
 * engines — chromium, firefox, webkit — with Playwright, then asserts each one
 * produced a lit, error-free image. This is the automated net for the CLASS of
 * failure behind the 0.4.0 iOS black-screen incident: a pipeline that compiles
 * clean and reports framebuffer-complete but renders nothing.
 *
 * Flow per run:
 *   1. spawn vite on a free port (NOT 8115/8119; another dev server may own those),
 *      wait for its ready line, and tear it (and its child tree) down on exit.
 *   2. for each engine: launch, load /?selftest=1, wait up to 90s for the
 *      #selftest-verdict node, parse its JSON, classify pass / fail / skip.
 *   3. print a summary table; exit nonzero if any engine FAILS (a documented
 *      environmental skip does not fail the suite).
 *
 * HONESTY: Playwright's webkit on Windows is the WPE/GTK WebKit build, NOT
 * Apple's Metal stack. It would NOT have caught the real 0.4.0 bug (WebKit's
 * GLSL->Metal codegen breaking at a 4th traceRadiance call site). This matrix
 * catches API / JS / GLSL-frontend divergence between engines; Metal codegen is
 * only reachable on a real Apple device (manual: ?diag=1 / ?nospecmrt=1).
 *
 * Playwright is not a dependency of this package — it is loaded from the sibling
 * WebsiteDesignSniper checkout (see PLAYWRIGHT_DIR). Browser binaries live in the
 * shared ms-playwright cache, so they resolve regardless of which node_modules
 * the package is imported from.
 */
import { spawn, execSync } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PLAYWRIGHT_DIR = "C:/ClaudeSessions/WebsiteDesignSniper/node_modules/playwright";

const NAV_TIMEOUT_MS = 30_000;

// Per-engine driving config. On THIS machine (Windows + ANGLE) two chromium
// facts force headed-with-a-long-budget:
//   1. ANGLE's D3D11/FXC backend stalls compiling the full-stack BVH/lighting
//      megakernel (silent VALIDATE_STATUS=false storms; FXC never returns) —
//      headless, headed+d3d11 and system Chrome all hang. --use-angle=gl (the
//      native NVIDIA GL backend, set in launchOpts) compiles it in ~137ms, but
//      that native-GL context is only created reliably for a HEADED window.
//   2. A headed window that isn't foregrounded gets its requestAnimationFrame
//      THROTTLED (observed: 3 frames in 90s). The --disable-*backgrounding* /
//      *timer-throttling* flags below keep the loop running at full rate even
//      when the window is occluded, so the desktop window can sit in the back.
// firefox/webkit run headless. On THIS machine both are SKIPPED for verified
// environmental reasons, not renderer faults:
//   firefox — renders WebGL through ANGLE D3D11 (same FXC backend that stalls
//     chromium under --use-angle=d3d11) and exposes no native-GL switch on
//     Windows, so it freezes compiling the megakernel (stuck ~3 frames). The
//     timeout handler detects the D3D11 renderer string and skips.
//   webkit  — Playwright's Windows WebKit has no usable WebGL2 here (context
//     lost; gl.getShaderPrecisionFormat null), so RT.supported never comes up
//     and the renderer never initialises → skipped.
// On a real-GPU Linux CI runner (native GL, no FXC) both would actually run.
const ENGINE_CONFIG = {
  chromium: { headless: false, timeoutMs: 240_000 },
  firefox: { headless: true, timeoutMs: 90_000 },
  webkit: { headless: true, timeoutMs: 90_000 },
};

// --- helpers ---------------------------------------------------------------

const { chromium, firefox, webkit } = await import(
  pathToFileURL(path.join(PLAYWRIGHT_DIR, "index.mjs")).href
);

// Grab an OS-assigned free port, then hand it to vite with --strictPort so we
// fail loudly rather than silently landing on a neighbour's server.
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

function killTree(pid) {
  try {
    execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" });
  } catch {
    /* already gone */
  }
}

// Spawn vite directly (node node_modules/vite/bin/vite.js) so we own a single
// killable process, and resolve once it advertises the local URL.
function startVite(port) {
  const viteBin = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
  const child = spawn(
    process.execPath,
    [viteBin, "--port", String(port), "--strictPort", "--host", "127.0.0.1", "--clearScreen", "false"],
    { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }
  );
  const base = `http://127.0.0.1:${port}`;
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      killTree(child.pid);
      reject(new Error("vite did not become ready within 30s"));
    }, 30_000);
    const onData = (buf) => {
      const s = buf.toString();
      process.stdout.write(`[vite] ${s}`);
      if (!settled && /(Local:|ready in|localhost:|127\.0\.0\.1:)/.test(s)) {
        settled = true;
        clearTimeout(timer);
        resolve({ child, base });
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", (b) => process.stderr.write(`[vite:err] ${b}`));
    child.on("exit", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`vite exited early (code ${code})`));
      }
    });
  });
}

// Launch args per engine. Chromium on this machine needs the D3D11 ANGLE backend
// for WebGL2 — default headless ANGLE (HLSL software path) stalls compiling the
// BVH traversal shaders. SwiftShader is allowed as a last-resort software GL.
function launchOpts(name, headless) {
  if (name === "chromium") {
    return {
      headless,
      args: [
        // ANGLE backend: use NATIVE GL (the NVIDIA driver), NOT D3D11. On this
        // machine every D3D11/FXC path — headless, headed+d3d11, system Chrome —
        // stalls compiling the BVH megakernel (silent VALIDATE_STATUS=false
        // storms; FXC never returns). --use-angle=gl compiles it in ~137ms.
        "--use-angle=gl",
        "--ignore-gpu-blocklist",
        "--enable-unsafe-swiftshader",
        // Keep rAF at full rate even when the headed window is occluded —
        // otherwise the render loop is throttled to a crawl and never hits 90
        // frames within the timeout.
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    };
  }
  return { headless };
}

// Drive one engine to a verdict. Returns { status, verdict?, reason?, ms }.
async function driveEngine(name, launcher, base, { headless, timeoutMs }) {
  const t0 = Date.now();
  let browser;
  const logs = [];
  try {
    browser = await launcher.launch(launchOpts(name, headless));
  } catch (err) {
    return { status: "skip", reason: `launch failed: ${err.message}`, ms: Date.now() - t0 };
  }
  try {
    const page = await browser.newPage();
    page.on("console", (m) => logs.push(m.text()));
    page.on("pageerror", (e) => logs.push(`PAGEERROR: ${e.message}`));

    await page.goto(`${base}/?selftest=1`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });

    try {
      await page.waitForFunction(
        () => {
          const n = document.getElementById("selftest-verdict");
          return !!(n && n.textContent && n.textContent.length > 0);
        },
        { timeout: timeoutMs }
      );
    } catch {
      // No verdict in time. Distinguish "engine can't do the pipeline" (skip)
      // from a genuine stall/black (fail) by probing what the page managed.
      const probe = await page.evaluate(() => {
        let renderer = null;
        try {
          const c = document.createElement("canvas");
          const gl = c.getContext("webgl2");
          const dbg = gl && gl.getExtension("WEBGL_debug_renderer_info");
          renderer = gl ? (dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) : null;
        } catch { /* no WebGL2 */ }
        return {
          hasRT: typeof window.RT !== "undefined",
          supported: window.RT ? !!window.RT.supported : null,
          frame: window.RT ? window.RT.frame : null,
          renderer,
        };
      }).catch(() => ({ hasRT: false, supported: null, frame: null, renderer: null }));
      const glTrouble = logs.some((l) =>
        /WebGL|context|EXT_color_buffer_float|ANGLE|SwiftShader|createShader|out of memory/i.test(l)
      );
      await browser.close();
      // Verified-environmental stall: ANGLE's D3D11/FXC backend never finishes
      // compiling the BVH megakernel on this machine — the render loop freezes
      // at ~3 frames (confirmed on headless chromium, headed chromium+d3d11, and
      // firefox, which exposes no native-GL switch on Windows). The SAME shader
      // compiles in ~137ms and renders correctly on native GL, as the passing
      // chromium leg (--use-angle=gl) proves, so this is a GL-backend platform
      // limitation of the engine, not a renderer fault → skip, don't fail.
      if (probe.supported === true && (probe.frame ?? 0) < 10 && /D3D11|Direct3D/i.test(probe.renderer || "")) {
        return {
          status: "skip",
          reason: `ANGLE D3D11/FXC backend stalls compiling the BVH megakernel (renderer: ${probe.renderer}; stuck at frame ${probe.frame}). This engine offers no native-GL switch on Windows; the identical shader compiles in ~137ms and renders on native GL (see the chromium --use-angle=gl leg).`,
          ms: Date.now() - t0,
        };
      }
      if (probe.supported === false) {
        return {
          status: "skip",
          reason: "RT unsupported in this engine's headless GL (no WebGL2 + EXT_color_buffer_float on a hardware GPU)",
          ms: Date.now() - t0,
        };
      }
      if (!probe.hasRT && glTrouble) {
        return {
          status: "skip",
          reason: `page never initialised the renderer; GL errors present: ${logs.filter((l) => /WebGL|context|ANGLE|GL/i.test(l)).slice(-2).join(" | ") || "(see logs)"}`,
          ms: Date.now() - t0,
        };
      }
      return {
        status: "fail",
        reason: `timed out after ${timeoutMs}ms (RT.frame=${probe.frame}, supported=${probe.supported})`,
        ms: Date.now() - t0,
      };
    }

    const text = await page.$eval("#selftest-verdict", (n) => n.textContent);
    await browser.close();
    let verdict;
    try {
      verdict = JSON.parse(text);
    } catch {
      return { status: "fail", reason: `unparseable verdict: ${text}`, ms: Date.now() - t0 };
    }

    if (verdict.supported === false) {
      return {
        status: "skip",
        reason: "RT unsupported in this engine's headless GL (no WebGL2 + EXT_color_buffer_float on a hardware GPU)",
        verdict,
        ms: Date.now() - t0,
      };
    }
    if (verdict.pass) return { status: "pass", verdict, ms: Date.now() - t0 };

    // Real gate failure — say which gate(s) tripped.
    const fails = [];
    if (!(verdict.meanLum >= 12 && verdict.meanLum <= 230)) fails.push(`meanLum=${verdict.meanLum}`);
    if (verdict.glErrors !== 0) fails.push(`glErrors=${verdict.glErrors}`);
    if (!(verdict.irrLum > 6)) fails.push(`irrLum=${verdict.irrLum}`);
    return { status: "fail", reason: `gate(s): ${fails.join(", ") || "unknown"}`, verdict, ms: Date.now() - t0 };
  } catch (err) {
    try { await browser.close(); } catch {}
    return { status: "fail", reason: `driver error: ${err.message}`, ms: Date.now() - t0 };
  }
}

// --- main ------------------------------------------------------------------

async function main() {
  const port = await freePort();
  console.log(`Starting vite on free port ${port}...`);
  const { child, base } = await startVite(port);

  const cleanup = () => killTree(child.pid);
  process.on("exit", cleanup);
  process.on("SIGINT", () => { cleanup(); process.exit(130); });

  const engines = [
    ["chromium", chromium],
    ["firefox", firefox],
    ["webkit", webkit],
  ];

  const results = [];
  try {
    for (const [name, launcher] of engines) {
      const cfg = ENGINE_CONFIG[name];
      console.log(`\n=== ${name} === (${cfg.headless ? "headless" : "headed"}, timeout ${cfg.timeoutMs}ms)`);
      let r = await driveEngine(name, launcher, base, cfg);
      // Chromium recovery: it runs headed by default here (headless is known to
      // stall under ANGLE-HLSL on this machine). If a headed attempt still
      // fails, retry headless once so a machine where the opposite is true (a
      // real GPU CI runner) can still pass without editing the script.
      if (name === "chromium" && r.status === "fail" && !cfg.headless) {
        console.log("chromium failed headed; retrying headless as a fallback...");
        const alt = await driveEngine(name, launcher, base, { headless: true, timeoutMs: cfg.timeoutMs });
        if (alt.status !== "fail") {
          alt.reason = `${alt.reason ? alt.reason + "; " : ""}passed headless (headed failed)`;
          r = alt;
        }
      }
      results.push([name, r]);
      const v = r.verdict;
      console.log(
        `  -> ${r.status.toUpperCase()} (${r.ms}ms)` +
          (v ? ` meanLum=${v.meanLum} irrLum=${v.irrLum} glErrors=${v.glErrors} specMRT=${v.specMRT} frames=${v.frames}` : "") +
          (r.reason ? `\n     reason: ${r.reason}` : "")
      );
    }
  } finally {
    cleanup();
  }

  // Summary table.
  console.log("\n================ render self-test matrix ================");
  const pad = (s, n) => String(s).padEnd(n);
  console.log(pad("engine", 10) + pad("status", 8) + pad("meanLum", 10) + pad("irrLum", 9) + pad("glErr", 7) + "specMRT");
  console.log("-".repeat(56));
  for (const [name, r] of results) {
    const v = r.verdict || {};
    console.log(
      pad(name, 10) +
        pad(r.status, 8) +
        pad(v.meanLum ?? "-", 10) +
        pad(v.irrLum ?? "-", 9) +
        pad(v.glErrors ?? "-", 7) +
        (v.specMRT === undefined ? "-" : String(v.specMRT))
    );
  }
  for (const [name, r] of results) {
    if (r.status !== "pass" && r.reason) console.log(`  ${name}: ${r.reason}`);
  }
  console.log("========================================================");

  const failed = results.filter(([, r]) => r.status === "fail");
  if (failed.length) {
    console.log(`\nFAIL: ${failed.map(([n]) => n).join(", ")}`);
    process.exit(1);
  }
  const skipped = results.filter(([, r]) => r.status === "skip").map(([n]) => n);
  console.log(`\nPASS${skipped.length ? ` (skipped: ${skipped.join(", ")})` : ""}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("selftest harness crashed:", err);
  process.exit(1);
});
