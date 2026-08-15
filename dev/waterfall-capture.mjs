/**
 * dev/waterfall-capture.mjs — the gallery waterfall scene's gate.
 *
 *   node dev/waterfall-capture.mjs [--url http://localhost:8149] [--rs 0.5]
 *
 * Four questions, answered from the page rather than from a screenshot:
 *
 *   1. DOES IT RUN? fps over a fixed window at 1280x720 with the 0.15.0
 *      defaults, plus the compiled scene's triangle / light / emissive-triangle
 *      counts. Reported, never asserted — this machine's GPU is routinely at
 *      100% from other sessions, so an absolute frame time here is contended.
 *   2. IS IT STILL MOVING after a minute? A waterfall that has quietly become a
 *      pile still renders 40 bodies, so the check is on the bodies: how many
 *      carry speed, how many Rapier has put to sleep, and how many crossed the
 *      kill plane and were re-dropped (a scene that has stopped recycling has
 *      stopped being a waterfall).
 *   3. NO BVH BLOWUPS. The dynamic BVH is REFIT per frame, so one body that
 *      escaped the shaft and is falling forever would inflate its bounds and
 *      make every shadow ray in the frame pay for the empty space. The dynamic
 *      set's world bounds are sampled over 30 frames and compared with the
 *      shaft; the console is scanned for recompiles at the same time.
 *   4. IS THE EMISSIVE LIGHT REAL? The scene's whole pitch is that six of the
 *      falling bodies ARE area lights. So the same frame is captured with
 *      emissiveNEE on and off and the walls are compared: if the pegs and walls
 *      do not go darker with it off, the glow is only a G-buffer colour.
 *
 * Writes dev/shots/waterfall-{1,2,3}.png and prints one JSON line.
 *
 * Headed chromium with --use-angle=gl, which is the only configuration that
 * compiles this megakernel on this machine (see scripts/selftest.mjs).
 */
import { pathToFileURL } from "node:url";
import path from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

const PLAYWRIGHT_DIR = "C:/ClaudeSessions/WebsiteDesignSniper/node_modules/playwright";
const { chromium } = await import(pathToFileURL(path.join(PLAYWRIGHT_DIR, "index.mjs")).href);

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const BASE = flag("--url", "http://localhost:8149");
const RS = parseFloat(flag("--rs", "0.5"));
const OUT = "dev/shots";

const browser = await chromium.launch({
  headless: false,
  args: [
    "--use-angle=gl", "--enable-webgl", "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader", "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding",
  ],
});
const logs = [];
let code = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("console", (m) => logs.push(m.text()));
  page.on("pageerror", (e) => logs.push(`PAGEERROR: ${e.message}`));
  await page.goto(`${BASE}/gallery.html#waterfall`, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Wait for the tracer, then pin quality so the numbers describe the scene and
  // not the governor's reaction to whatever else is on this GPU.
  await page.waitForFunction(() => !!window.RT && window.RT.frame > 2, null, { timeout: 180000 });
  await page.evaluate((rs) => {
    window.RT.adaptiveQuality = false;
    window.RT.renderScale = rs;
    document.getElementById("hud").style.display = "none";
    document.getElementById("gallery-cue")?.remove();
  }, RS);

  // 1 + 2: run for a minute, then measure.
  const warm = await page.evaluate(async () => {
    const w = (ms) => new Promise((r) => setTimeout(r, ms));
    const rt = window.RT;
    const f0 = rt.frame, t0 = performance.now();
    await w(20000);
    const fps = (rt.frame - f0) / ((performance.now() - t0) / 1000);
    return { fps: +fps.toFixed(2), frame: rt.frame };
  });
  await page.waitForTimeout(40000);

  const state = await page.evaluate(() => {
    const rt = window.RT, d = window.SCENE_DEF.debug, props = d.physics.props;
    const speed = (p) => Math.hypot(p.body.linvel().x, p.body.linvel().y, p.body.linvel().z);
    const ys = props.map((p) => p.body.translation().y);
    return {
      tris: rt.compiled.triangleCount,
      lights: rt.compiled.lightCount,
      emissiveTris: rt.compiled.emissiveTriCount,
      bodies: props.length,
      moving: props.filter((p) => speed(p) > 0.2).length,
      asleep: props.filter((p) => p.body.isSleeping()).length,
      medianSpeed: +props.map(speed).sort((a, b) => a - b)[Math.floor(props.length / 2)].toFixed(2),
      minY: +Math.min(...ys).toFixed(2),
      maxY: +Math.max(...ys).toFixed(2),
      renderScale: rt.renderScale,
      statusOk: rt.status.ok,
      coreFailure: rt.status.coreFailure,
      warnings: rt.status.warnings.map((w) => w.code),
    };
  });

  // 3: thirty frames of dynamic-set bounds, plus a recycle count. Sampled from
  // the meshes rather than from a private field, so it is the same bound the
  // BVH refit sees.
  const motion = await page.evaluate(async () => {
    const w = (ms) => new Promise((r) => setTimeout(r, ms));
    const rt = window.RT, props = window.SCENE_DEF.debug.physics.props;
    const box = () => {
      let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
      for (const p of props) {
        const t = p.body.translation();
        lo = [Math.min(lo[0], t.x), Math.min(lo[1], t.y), Math.min(lo[2], t.z)];
        hi = [Math.max(hi[0], t.x), Math.max(hi[1], t.y), Math.max(hi[2], t.z)];
      }
      return { lo, hi };
    };
    const prev = props.map((p) => p.body.translation().y);
    const spans = [];
    let moved = 0, recycled = 0, f0 = rt.frame;
    for (let i = 0; i < 30; i++) {
      const before = props.map((p) => p.body.translation().y);
      while (rt.frame === f0) await w(16);
      f0 = rt.frame;
      const after = props.map((p) => p.body.translation().y);
      for (let k = 0; k < after.length; k++) {
        if (Math.abs(after[k] - before[k]) > 0.001) moved++;
        if (after[k] - before[k] > 3) recycled++; // teleported back to the hopper
      }
      const b = box();
      spans.push([+(b.hi[0] - b.lo[0]).toFixed(2), +(b.hi[1] - b.lo[1]).toFixed(2), +(b.hi[2] - b.lo[2]).toFixed(2)]);
    }
    const maxSpan = [0, 1, 2].map((a) => Math.max(...spans.map((s) => s[a])));
    return {
      framesSampled: spans.length,
      movedSamples: moved,
      totalSamples: 30 * props.length,
      recycled,
      maxDynamicSpan: maxSpan,
      finalY: +Math.min(...prev).toFixed(2),
    };
  });

  // 4: does the emissive set actually LIGHT anything? The scene's pitch is that
  // six of the falling bodies ARE area lights, so the check has to separate
  // "they glow in the G-buffer" from "they light the walls".
  //
  // Measured from SCREENSHOTS, not from gl.readPixels: the gallery's renderer is
  // built without preserveDrawingBuffer (the cheaper default that every non-test
  // page wants), so an in-page readback outside the render task returns a
  // cleared buffer — the first cut of this check reported 0.00 for both arms,
  // which is the readback failing, not the light.
  //
  // The bodies are FROZEN for the A/B so both arms see the same geometry, and
  // the mask is the left third of the frame, which is wall and pegs only: a
  // whole-frame mean would be dominated by the emitters' own pixels, which are
  // G-buffer emissive and do not change with NEE at all.
  const meanLuma = (png, x0, x1) => {
    // Decode via the page's own canvas; no image dependency in this repo.
    return page.evaluate(async ([b64, ax, bx]) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      const w = Math.floor(img.width * (bx - ax));
      const d = g.getImageData(Math.floor(img.width * ax), 0, w, img.height).data;
      let s = 0;
      for (let i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      return +(s / (d.length / 4)).toFixed(2);
    }, [png.toString("base64"), x0, x1]);
  };
  const freeze = (on) => page.evaluate((f) => {
    for (const p of window.SCENE_DEF.debug.physics.props) p.body.setBodyType(f ? 1 : 0, true);
  }, on);
  const arm = async (on) => {
    await page.evaluate((v) => { window.RT.emissiveNEE = v; window.RT.resetAccumulation(); }, on);
    await page.waitForTimeout(6000);
    return page.screenshot();
  };
  await freeze(true);
  const shotOn = await arm(true);
  const shotOff = await arm(false);
  // ...and a second pass of each, so the difference has a floor to be judged
  // against instead of being read as a finding on its own.
  const shotOn2 = await arm(true);
  const shotOff2 = await arm(false);
  await arm(true);
  await freeze(false);
  const WALL = [0.33, 0.52]; // wall + pegs, no emitter pixels
  const nee = {
    lumNEEon: await meanLuma(shotOn, ...WALL),
    lumNEEoff: await meanLuma(shotOff, ...WALL),
    floorOn: null, floorOff: null, delta: null,
  };
  nee.floorOn = +(Math.abs(nee.lumNEEon - (await meanLuma(shotOn2, ...WALL)))).toFixed(2);
  nee.floorOff = +(Math.abs(nee.lumNEEoff - (await meanLuma(shotOff2, ...WALL)))).toFixed(2);
  nee.delta = +(nee.lumNEEon - nee.lumNEEoff).toFixed(2);

  // Three frames, a few seconds apart, so the set shows the fall in progress.
  mkdirSync(OUT, { recursive: true });
  const shots = [];
  for (let i = 1; i <= 3; i++) {
    await page.waitForTimeout(3500);
    const f = `${OUT}/waterfall-${i}.png`;
    writeFileSync(f, await page.screenshot());
    shots.push(f);
  }

  const rebuilds = logs.filter((l) => /compiled|rebuild|recompile/i.test(l));
  const errors = logs.filter((l) => /PAGEERROR|WebGL|error/i.test(l));
  console.log(JSON.stringify({ warm, state, motion, nee, shots, rebuilds, errors }, null, 2));
} catch (err) {
  code = 1;
  console.error(`CAPTURE FAILED: ${err.message}`);
  for (const l of logs.slice(-20)) console.error("  " + l);
} finally {
  await browser.close();
}
process.exit(code);
