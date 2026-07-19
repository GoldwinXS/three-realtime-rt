/**
 * three-realtime-rt — repeatable benchmark.
 *
 * Times plain raster vs. three RT feature tiers on two scenes at a fixed
 * 1280x720 / pixelRatio 1, plus a ghosting probe that measures how quickly the
 * temporal history reconverges after camera motion. Results are printed as a
 * table and POSTed to the dev server's /__bench sink (see vite.config.js).
 *
 * Determinism notes:
 *  - Fixed canvas size + pixelRatio 1 so every run traces the same ray count.
 *  - gl.finish() does NOT block in Chrome; we fence with a 1x1 readPixels, which
 *    forces the driver to flush the queued frames before performance.now().
 *  - readPixels must run in the SAME JS task as the render that produced the
 *    frame — the default framebuffer is cleared between tasks — so every patch
 *    read happens immediately after its render with no await in between.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RealtimeRaytracer } from "../src/index.js";
import { buildScene } from "./scene.js";

const W = 1280, H = 720;

const tokyoUrl =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/LittlestTokyo.glb";

const runBtn = document.getElementById("run");
const statusEl = document.getElementById("status");
const outEl = document.getElementById("out");
const setStatus = (t) => { statusEl.textContent = t; };

// --- renderer (fixed size, no MSAA, no pixel-ratio scaling) ------------------
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
document.getElementById("app").appendChild(renderer.domElement);
const gl = renderer.getContext();

const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);

// --- DRACO glTF loader (scene B), same decoder as the gallery ----------------
const draco = new DRACOLoader().setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);
const gltfLoader = new GLTFLoader().setDRACOLoader(draco);
const loadGltf = (url) =>
  new Promise((res, rej) => gltfLoader.load(url, res, undefined, rej));

/** Normalize a loaded model to `size` world units and rest it on y=0. */
function normalize(root, size) {
  const box = new THREE.Box3().setFromObject(root);
  const span = box.getSize(new THREE.Vector3());
  const s = size / Math.max(span.x, span.y, span.z);
  root.scale.setScalar(s);
  box.setFromObject(root);
  root.position.y -= box.min.y;
  root.position.x -= (box.min.x + box.max.x) / 2;
  root.position.z -= (box.min.z + box.max.z) / 2;
}

function groundDisc(color = 0x2a2f36) {
  const g = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 0.3, 48),
    new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
  );
  g.position.y = -0.15;
  return g;
}

// --- timing helpers ----------------------------------------------------------
const fenceBuf = new Uint8Array(4);
/** Force the driver to complete queued GPU work (gl.finish is a no-op here). */
function fence() {
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, fenceBuf);
}

/** Warmup 20, fence, time 60 frames, fence; return ms/frame. */
function timeConfig(renderFrame) {
  for (let i = 0; i < 20; i++) renderFrame();
  fence();
  const t0 = performance.now();
  for (let i = 0; i < 60; i++) renderFrame();
  fence();
  return (performance.now() - t0) / 60;
}

const CONFIGS = {
  rtMin: { gi: false, emissiveNEE: false, reflections: false, refraction: false,
           stochasticLights: true, renderScale: 0.25, denoiseIterations: 5 },
  rtCore: { gi: true, emissiveNEE: false, reflections: false, refraction: false,
            stochasticLights: true, renderScale: 0.5, denoiseIterations: 3 },
  rtFull: { gi: true, emissiveNEE: true, reflections: true, refraction: true,
            stochasticLights: false, renderScale: 0.5, denoiseIterations: 3 },
};

function applyConfig(rt, c) {
  rt.adaptiveQuality = false; // never let quality drift while benching
  rt.gi = c.gi;
  rt.emissiveNEE = c.emissiveNEE;
  rt.reflections = c.reflections;
  rt.refraction = c.refraction;
  rt.stochasticLights = c.stochasticLights;
  rt.denoiseIterations = c.denoiseIterations;
  rt.renderScale = c.renderScale; // setter re-sizes lighting targets + clears
  rt.resetAccumulation();
}

function setCam(pos, look) {
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  camera.updateMatrixWorld();
}

// --- ghosting probe ----------------------------------------------------------
const PATCH = 96;
const PX = ((W - PATCH) / 2) | 0;
const PY = ((H - PATCH) / 2) | 0;
const patchBuf = new Uint8Array(PATCH * PATCH * 4);

/** Read the centered 96x96 patch of the freshly rendered frame (same task). */
function readPatch() {
  const buf = new Uint8Array(PATCH * PATCH * 4);
  gl.readPixels(PX, PY, PATCH, PATCH, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  return buf;
}

/** Mean absolute per-channel difference (0-255). */
function patchDiff(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

// rAF stalls entirely in hidden/backgrounded tabs (where automated bench runs
// live) — race it against a short timeout so the suite always advances.
const nextFrame = () =>
  new Promise((r) => {
    requestAnimationFrame(r);
    setTimeout(r, 50);
  });

/**
 * Ghosting: how fast temporal history clears after motion. Build a clean
 * reference at pose B, then approach B from pose A and measure the residual
 * ghost energy vs. the reference after 1/5/10/20/40 settled frames.
 * Lower = history reconverges faster = less ghosting.
 */
async function ghostTest(rt, scene) {
  applyConfig(rt, CONFIGS.rtCore);
  const look = [0, 1.4, 0];
  const poseB = [4.2, 3.2, 6.5];
  const poseA = [7.5, 4.2, 9.5];

  // Reference frame: settle fully at B.
  setCam(poseB, look);
  rt.resetAccumulation();
  for (let i = 0; i < 150; i++) rt.render(scene, camera);
  const ref = readPatch();

  // Settle at A, then sweep A->B over 24 frames (history now carries A's image).
  setCam(poseA, look);
  rt.resetAccumulation();
  for (let i = 0; i < 60; i++) rt.render(scene, camera);
  const a = new THREE.Vector3(poseA[0], poseA[1], poseA[2]);
  const b = new THREE.Vector3(poseB[0], poseB[1], poseB[2]);
  for (let s = 1; s <= 24; s++) {
    camera.position.lerpVectors(a, b, s / 24);
    camera.lookAt(look[0], look[1], look[2]);
    camera.updateMatrixWorld();
    rt.render(scene, camera);
  }

  // Parked at B: no reset — measure the ghost decay over settling frames.
  setCam(poseB, look);
  const checkpoints = [1, 5, 10, 20, 40];
  const keys = ["g1", "g5", "g10", "g20", "g40"];
  const ghost = {};
  let rendered = 0;
  for (let ci = 0; ci < checkpoints.length; ci++) {
    while (rendered < checkpoints[ci]) { rt.render(scene, camera); rendered++; }
    ghost[keys[ci]] = patchDiff(readPatch(), ref); // read in same task as render
    await nextFrame();
  }
  return ghost;
}

// --- per-scene benchmark -----------------------------------------------------
async function benchScene(label, scene, sky, opts, camPos, camLook, withGhost) {
  camera.aspect = W / H;
  camera.updateProjectionMatrix();

  const rt = new RealtimeRaytracer(renderer, { sky, ...opts });
  rt.compileScene(scene);
  if (opts.forceLightsVisible) {
    scene.traverse((o) => { if (o.isLight) o.visible = true; });
    rt.updateLights(scene);
  }

  const result = {};
  setCam(camPos, camLook);

  setStatus(`${label}: timing raster…`);
  await nextFrame();
  result.raster = timeConfig(() => renderer.render(scene, camera));

  for (const [key, cfg] of [["rtMin", CONFIGS.rtMin], ["rtCore", CONFIGS.rtCore], ["rtFull", CONFIGS.rtFull]]) {
    setStatus(`${label}: timing ${key}…`);
    await nextFrame();
    applyConfig(rt, cfg);
    setCam(camPos, camLook); // applyConfig cleared accumulation; re-fix the pose
    result[key] = timeConfig(() => rt.render(scene, camera));
  }

  if (withGhost) {
    setStatus(`${label}: ghosting probe…`);
    await nextFrame();
    result.ghost = await ghostTest(rt, scene);
  }

  rt.dispose();
  return result;
}

// --- table rendering ---------------------------------------------------------
const fmt = (n) => (typeof n === "number" ? n.toFixed(2) : String(n));

function renderTable(results) {
  const lines = [];
  lines.push(`three-realtime-rt benchmark`);
  lines.push(`date       ${results.date}`);
  lines.push(`resolution ${results.resolution}`);
  lines.push(`ua         ${results.userAgent}`);
  lines.push("");
  lines.push(`scene    raster   rt-min   rt-core  rt-full   (ms/frame, lower=faster)`);
  for (const [name, s] of Object.entries(results.scenes)) {
    if (typeof s === "string") { lines.push(`${name.padEnd(8)} ${s}`); continue; }
    lines.push(
      `${name.padEnd(8)} ${fmt(s.raster).padStart(7)}  ${fmt(s.rtMin).padStart(7)}  ` +
      `${fmt(s.rtCore).padStart(7)}  ${fmt(s.rtFull).padStart(7)}`
    );
  }
  const room = results.scenes.room;
  if (room && typeof room !== "string" && room.ghost) {
    const g = room.ghost;
    lines.push("");
    lines.push(`ghosting (room, rt-core) — mean abs diff vs settled ref, 0-255, lower=less ghosting`);
    lines.push(`  frames   1        5        10       20       40`);
    lines.push(
      `  diff     ${fmt(g.g1).padStart(6)}   ${fmt(g.g5).padStart(6)}   ` +
      `${fmt(g.g10).padStart(6)}   ${fmt(g.g20).padStart(6)}   ${fmt(g.g40).padStart(6)}`
    );
  }
  outEl.textContent = lines.join("\n");
}

// --- driver ------------------------------------------------------------------
async function run() {
  runBtn.disabled = true;
  outEl.textContent = "";
  const results = {
    date: new Date().toISOString(),
    userAgent: navigator.userAgent,
    resolution: `${W}x${H}`,
    scenes: {},
  };

  try {
    // Scene A: Cornell-style room (static, no physics — compile only).
    setStatus("room: building scene…");
    const built = buildScene();
    await built.ready;
    results.scenes.room = await benchScene(
      "room", built.scene, built.sky,
      { envColor: new THREE.Color(0x121821), envIntensity: 1.0, forceLightsVisible: true },
      [6, 3.8, 8], [0, 1.2, 0], true
    );

    // Scene B: Littlest Tokyo (network DRACO glTF). Skip cleanly if it fails.
    setStatus("tokyo: fetching model…");
    try {
      const gltf = await loadGltf(tokyoUrl);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x10151d);
      normalize(gltf.scene, 12);
      scene.add(gltf.scene, groundDisc(0x2a2f36));
      const sun = new THREE.DirectionalLight(0xfff2dd, 2.4);
      sun.position.set(14, 16, 15);
      sun.userData.rtRadius = 0.04;
      scene.add(sun, sun.target);
      const sky = {
        enabled: true,
        sunDir: sun.position.clone().normalize(),
        sunColor: new THREE.Color(1.0, 0.93, 0.82),
        zenith: new THREE.Color(0.2, 0.36, 0.62),
        horizon: new THREE.Color(0.74, 0.82, 0.9),
        intensity: 1.0,
      };
      results.scenes.tokyo = await benchScene(
        "tokyo", scene, sky,
        { envColor: new THREE.Color(0.35, 0.42, 0.55), envIntensity: 0.8 },
        [11, 7, 12], [0, 3.4, 0], false
      );
    } catch (err) {
      results.scenes.tokyo = `skipped: ${err?.message ?? err}`;
    }

    renderTable(results);
    setStatus("done. POSTing results…");
    try {
      await fetch("/__bench", { method: "POST", body: JSON.stringify(results) });
      setStatus("done — results saved.");
    } catch (err) {
      setStatus(`done — results NOT saved (${err?.message ?? err}).`);
    }
  } catch (err) {
    console.error(err);
    setStatus(`failed: ${err?.message ?? err}`);
    outEl.textContent = String(err?.stack ?? err);
  } finally {
    window.BENCH_RESULTS = results;
    window.BENCH_DONE = true;
    runBtn.disabled = false;
  }
}

runBtn.addEventListener("click", () => { run(); });
if (location.search.includes("autorun=1")) run();
