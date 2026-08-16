/**
 * dev/lights-cost.js: the 0.16.0 cost gate, with both trees in ONE page so the
 * arms can be INTERLEAVED.
 *
 *   /dev/lights-cost.html?mode=arms&scene=museum&pairs=5
 *   /dev/lights-cost.html?mode=grid&scene=hotel&lights=96
 *   /dev/lights-cost.html?mode=vol&scene=hotel
 *
 * WHY NOT bench.html. Same timing method as bench.js, deliberately: warm up 20
 * frames, fence with a 1x1 readPixels (gl.finish does not block in Chrome), time
 * 60, fence. What bench.html cannot do is hold TWO libraries at once, and this
 * machine's GPU is shared: the 0.15.0 report measured a 158 ms run-to-run floor
 * against a 77 ms effect when arms were run in sequence. Here master and branch
 * are constructed on the same renderer over the same scene and timed back to
 * back inside one pair, so drift lands on both and the per-pair RATIO survives
 * it. Medians and spreads of the raw milliseconds are printed too, as the floor.
 *
 * `master` is dev/_masterref/src (a copy of the main checkout at d75c0da =
 * 0.15.0; see dev/lights-identity.js for the copy command).
 */
import * as THREE from "three";
import { SCENES } from "../examples/gallery-scenes.js";
import { buildScene } from "../examples/scene.js";

const P = new URLSearchParams(location.search);
const MODE = P.get("mode") || "arms";
const SCENE = P.get("scene") || "museum";
const PAIRS = parseInt(P.get("pairs") || "5", 10);
const MAXLIGHTS = parseInt(P.get("maxlights") || "128", 10);
const W = 1280, H = 720;

const outEl = document.getElementById("out");
const lines = [];
const say = (t) => { lines.push(t); outEl.textContent = lines.join("\n"); };
const done = (obj) => {
  const node = document.createElement("div");
  node.id = "selftest-verdict";
  node.style.cssText = "position:fixed;left:-99999px;top:0;white-space:pre;";
  node.textContent = JSON.stringify(obj);
  document.body.appendChild(node);
  console.log("[lights-cost] " + node.textContent);
};

const masterLib = await import("./_masterref/src/index.js");
const branchLib = await import("../src/index.js");

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
document.getElementById("app").appendChild(renderer.domElement);
const gl = renderer.getContext();
const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 400);

const fenceBuf = new Uint8Array(4);
const fence = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, fenceBuf);
/** bench.js's own method: warm up 20, fence, time 60, fence. ms per frame. */
function timeFrames(render, warm = 20, n = 60) {
  for (let i = 0; i < warm; i++) render();
  fence();
  const t0 = performance.now();
  for (let i = 0; i < n; i++) render();
  fence();
  return (performance.now() - t0) / n;
}
const med = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const spread = (xs) => Math.max(...xs) - Math.min(...xs);
const f = (x, d = 3) => (Number.isFinite(x) ? x.toFixed(d) : "n/a");

/**
 * A deliberately WORST-CASE grid: a cube-shaped room, so the resolution rule
 * (24 cells on the longest axis) lands near the cell cap instead of the long
 * thin 6 x 1 x 24 a corridor produces, and 128 lights so the per-row loop is at
 * its maximum. This is the arm the spec's "8192 cells x 128 lights" target is
 * about; nothing renders it, it exists to be rebuilt.
 */
function buildStress(n = 128) {
  const scene = new THREE.Scene();
  const S = 40;
  const mat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.9 });
  const box = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    scene.add(m);
  };
  box(S, 0.4, S, 0, -0.2, 0);
  box(S, 0.4, S, 0, S + 0.2, 0);
  box(S, S, 0.4, 0, S / 2, -S / 2);
  box(0.4, S, S, -S / 2, S / 2, 0);
  box(0.4, S, S, S / 2, S / 2, 0);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 * 7;
    const l = new THREE.PointLight(0xffffff, 2.0, 0, 2);
    l.position.set(Math.cos(a) * (S / 2 - 3), 1 + (i / n) * (S - 3), Math.sin(a) * (S / 2 - 3));
    l.userData.rtRadius = 0.1;
    scene.add(l);
  }
  return { scene, cam: [0, 3, S / 2 - 2], target: [0, 3, 0], def: null };
}

async function buildTheScene() {
  if (SCENE === "stress") return buildStress(parseInt(P.get("lights") || "128", 10));
  if (SCENE === "museum") {
    const built = buildScene();
    await built.ready;
    built.scene.traverse((o) => { if (o.isLight) o.visible = true; });
    return { scene: built.scene, cam: [6, 3.8, 8], target: [0, 1.2, 0], def: null };
  }
  const def = await SCENES[SCENE]();
  return { scene: def.scene, cam: def.cam, target: def.target, def };
}

function makeRt(lib, extra) {
  const rt = new lib.RealtimeRaytracer(renderer, {
    renderScale: 0.5,
    denoiseIterations: 2,
    adaptiveQuality: false,
    overloadProtection: false,
    taa: true,
    denoise: true,
    sky: { enabled: false },
    envColor: new THREE.Color(0x121821),
    envIntensity: 1.0,
    maxLights: MAXLIGHTS,
    ...extra,
  });
  return rt;
}

const built = await buildTheScene();
const scene = built.scene;
camera.position.set(...built.cam);
camera.lookAt(...built.target);
camera.updateMatrixWorld();

if (MODE === "arms") {
  say(`scene ${SCENE}, ${W}x${H}, ${PAIRS} interleaved pairs`);
  const arms = [
    ["master        ", makeRt(masterLib, {})],
    ["branch grid=0 ", makeRt(branchLib, { restirLightGrid: false })],
    ["branch grid=1 ", makeRt(branchLib, { restirLightGrid: true })],
  ];
  for (const [, rt] of arms) {
    rt.compileScene(scene);
    rt.updateLights(scene);
  }
  const ms = arms.map(() => []);
  for (let p = 0; p < PAIRS; p++) {
    for (let a = 0; a < arms.length; a++) {
      const rt = arms[a][1];
      ms[a].push(timeFrames(() => rt.render(scene, camera)));
    }
    say(`  pair ${p + 1}: ` + arms.map((a, i) => `${a[0].trim()} ${f(ms[i][p])}`).join("  |  "));
    await new Promise((r) => setTimeout(r, 20));
  }
  say("");
  arms.forEach(([label], i) => {
    say(`${label} median ${f(med(ms[i]))} ms   spread ${f(spread(ms[i]))} ms   (spread IS the floor)`);
  });
  const ratio = (a, b) => ms[a].map((x, i) => x / ms[b][i]);
  const r10 = ratio(1, 0), r20 = ratio(2, 0), r21 = ratio(2, 1);
  say("");
  say(`branch grid=0 / master : per-pair ${r10.map((x) => f(x, 3)).join(" ")}  median ${f(med(r10))}`);
  say(`branch grid=1 / master : per-pair ${r20.map((x) => f(x, 3)).join(" ")}  median ${f(med(r20))}`);
  say(`branch grid=1 / grid=0 : per-pair ${r21.map((x) => f(x, 3)).join(" ")}  median ${f(med(r21))}`);
  const b = arms[2][1];
  say("");
  say(`lights ${b.lightCount}/${b.maxLights}, grid cells ${b.lightGridPass.cells}, builds ${b.lightGridPass.builds}`);
  done({
    mode: "arms", scene: SCENE, pairs: PAIRS,
    medians: arms.map((a, i) => ({ arm: a[0].trim(), medianMs: med(ms[i]), spreadMs: spread(ms[i]) })),
    ratios: { grid0_master: med(r10), grid1_master: med(r20), grid1_grid0: med(r21) },
    lights: b.lightCount, cells: b.lightGridPass.cells,
  });
} else if (MODE === "grid") {
  // Cost of REBUILDING the table, which is what a scene with moving lights pays
  // every frame. Timed the same way: warm up, fence, N builds, fence.
  const rt = makeRt(branchLib, { restirLightGrid: true });
  rt.compileScene(scene);
  rt.updateLights(scene);
  rt.render(scene, camera);
  const pass = rt.lightGridPass;
  const N = 200;
  const runs = [];
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < 20; i++) pass.build(renderer, { dirBypass: true, cellRows: true });
    fence();
    const t0 = performance.now();
    for (let i = 0; i < N; i++) pass.build(renderer, { dirBypass: true, cellRows: true });
    fence();
    runs.push((performance.now() - t0) / N);
  }
  const rows = [];
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i < 20; i++) pass.build(renderer, { dirBypass: true, cellRows: false });
    fence();
    const t0 = performance.now();
    for (let i = 0; i < N; i++) pass.build(renderer, { dirBypass: true, cellRows: false });
    fence();
    rows.push((performance.now() - t0) / N);
  }
  say(`scene ${SCENE}: ${rt.lightCount} lights, ${pass.cells} cells (${rt.compiled.lightGrid.dims.join(" x ")}), ` +
      `table ${pass.maxLights} x ${pass.rows}`);
  say(`full build (cells + global): ${runs.map((x) => f(x, 4)).join(" ")} ms   median ${f(med(runs), 4)}`);
  say(`global row only (grid off): ${rows.map((x) => f(x, 4)).join(" ")} ms   median ${f(med(rows), 4)}`);
  // And the CPU half: what one updateLights costs now that the table is texels.
  const t0 = performance.now();
  for (let i = 0; i < 200; i++) rt.updateLights(scene);
  const upl = (performance.now() - t0) / 200;
  const t1 = performance.now();
  for (let i = 0; i < 200; i++) {
    rt.compiled.materialsTex.needsUpdate = true;
    rt.render(scene, camera);
  }
  fence();
  const fullUp = (performance.now() - t1) / 200;
  const t2 = performance.now();
  for (let i = 0; i < 200; i++) rt.render(scene, camera);
  fence();
  const noUp = (performance.now() - t2) / 200;
  say(`updateLights (unchanged lights, CPU): ${f(upl, 4)} ms   upload path: ${rt._lightUpload || "none"}`);
  say(`frame with a FULL scene-texture re-upload: ${f(fullUp, 3)} ms vs ${f(noUp, 3)} ms without ` +
      `=> full re-upload costs ${f(fullUp - noUp, 3)} ms  (texture ${rt.compiled.materialsTex.image.width}x${rt.compiled.materialsTex.image.height})`);
  done({
    mode: "grid", scene: SCENE, lights: rt.lightCount, cells: pass.cells,
    buildMs: med(runs), globalRowMs: med(rows), updateLightsMs: upl,
    fullUploadDeltaMs: fullUp - noUp,
    texW: rt.compiled.materialsTex.image.width, texH: rt.compiled.materialsTex.image.height,
  });
} else if (MODE === "upload") {
  // THE SPEC'S DECISION RULE, measured: is a whole-texture re-upload per
  // updateLights (three's `needsUpdate`) over 0.3 ms with a big tile block? The
  // museum compiled WITH texture tiles is the case that matters: 16 tiles at
  // 128px is 2048 rows of RGBA32F under the light row.
  const rt = makeRt(branchLib, { restirLightGrid: true, textureTiles: { size: 128, max: 16 } });
  rt.compileScene(scene);
  rt.updateLights(scene);
  rt.render(scene, camera);
  const tex = rt.compiled.materialsTex;
  const bytes = tex.image.width * tex.image.height * 16;
  // A light that actually MOVES, so the change detection fires and the row is
  // really uploaded (an unchanged table uploads nothing at all, by design).
  const light = (() => { let f = null; scene.traverse((o) => { if (!f && o.isPointLight) f = o; }); return f; })();
  const N = 120;
  const sub = [];
  const full = [];
  for (let r = 0; r < 3; r++) {
    // arm A: the shipped path (row-only texSubImage2D inside updateLights)
    for (let i = 0; i < 20; i++) { light.position.x += 0.001; rt.updateLights(scene); rt.render(scene, camera); }
    fence();
    let t0 = performance.now();
    for (let i = 0; i < N; i++) { light.position.x += 0.001; rt.updateLights(scene); rt.render(scene, camera); }
    fence();
    sub.push((performance.now() - t0) / N);
    // arm B: the same frame, but the whole scene-data texture re-uploaded
    for (let i = 0; i < 20; i++) { light.position.x += 0.001; rt.updateLights(scene); tex.needsUpdate = true; rt.render(scene, camera); }
    fence();
    t0 = performance.now();
    for (let i = 0; i < N; i++) { light.position.x += 0.001; rt.updateLights(scene); tex.needsUpdate = true; rt.render(scene, camera); }
    fence();
    full.push((performance.now() - t0) / N);
  }
  say(`scene ${SCENE} with texture tiles: scene-data texture ${tex.image.width} x ${tex.image.height} ` +
      `= ${(bytes / 1048576).toFixed(1)} MB, ${rt.lightCount} lights, upload path "${rt._lightUpload}"`);
  say(`frame + updateLights, ROW upload:   ${sub.map((x) => f(x)).join(" ")}  median ${f(med(sub))} ms`);
  say(`frame + updateLights, FULL upload:  ${full.map((x) => f(x)).join(" ")}  median ${f(med(full))} ms`);
  say(`=> a full re-upload of the scene-data texture costs ${f(med(full) - med(sub))} ms per updateLights`);
  done({ mode: "upload", scene: SCENE, texW: tex.image.width, texH: tex.image.height, mb: bytes / 1048576,
         subMs: med(sub), fullMs: med(full), deltaMs: med(full) - med(sub), path: rt._lightUpload });
} else if (MODE === "vol") {
  // The volumetric pass at two light counts. It picks ONE light per march step
  // (it never looped over the table), so this is the check on whether "the
  // volumetric pass is O(N)" is true here at all.
  const rt = makeRt(branchLib, { restirLightGrid: true });
  const setL = built.def && built.def.debug && built.def.debug.setLights;
  const out = [];
  for (const n of [32, 96]) {
    if (setL) setL(n);
    rt.compileScene(scene);
    rt.updateLights(scene);
    const off = [];
    const on = [];
    for (let r = 0; r < 3; r++) {
      rt.volumetric.enabled = false;
      off.push(timeFrames(() => rt.render(scene, camera)));
      rt.volumetric.enabled = true;
      on.push(timeFrames(() => rt.render(scene, camera)));
    }
    rt.volumetric.enabled = false;
    say(`${n} lights (table says ${rt.lightCount}): volumetric off ${off.map((x) => f(x)).join(" ")} ` +
        `median ${f(med(off))} | on ${on.map((x) => f(x)).join(" ")} median ${f(med(on))} ` +
        `| pass ${f(med(on) - med(off))} ms`);
    out.push({ lights: rt.lightCount, offMs: med(off), onMs: med(on), passMs: med(on) - med(off),
               offSpread: spread(off), onSpread: spread(on) });
  }
  done({ mode: "vol", scene: SCENE, arms: out });
} else {
  say(`unknown mode ${MODE}`);
  done({ mode: MODE, error: "unknown mode" });
}
