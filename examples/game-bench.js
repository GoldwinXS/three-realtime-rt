/**
 * three-realtime-rt  -  GAME benchmark driver (game-bench.html).
 *
 * A permanent regression asset for the quality-presets round (see the spec's
 * "Part B upgrade": tune against game scenes, not gallery orbits). Three
 * deterministic scenes (chase / stealth / arena, from game-scenes.js) each run
 * a scripted ~20s loop, and every mode below is deterministic: fixed camera
 * path, fixed event timings, no unseeded randomness.
 *
 *   ?scene=chase|stealth|arena    which scene (default chase)
 *   &preset=quality|balanced|performance|motion   (omitted = today's defaults)
 *   &mode=bench|clip              bench = measure + POST to /__bench;
 *                                 clip (default) = run the loop for video capture
 *   &label=A..D                   clip-only: badge shown in the corner (blind)
 *   &autorun=1                    start bench immediately
 *
 * BENCH mode measures, per scene x preset:
 *   - fence-timed ms/frame at a fixed "home" pose (parked, converged)  -  the
 *     same readPixels fence bench.html uses,
 *   - a ghost probe: reference at pose B, settle at A, sweep A->B over 24
 *     frames, park at B and read the centred 96x96 patch diff vs the reference
 *     after 1/5/10/20/40 frames (bench.html-comparable),
 *   - still temporal noise: 30 parked frames, mean |diff| vs the previous frame
 *     on a 320x180 downsample.
 * Results POST to /__bench with a `gameBench: true` flag and print a table.
 *
 * CLIP mode runs the deterministic loop (update(t) each frame) continuously,
 * with adaptiveQuality ON (the default) so the fps badge shows the governor
 * breathing around the preset's baseline. Light visibility changes (the arena's
 * mid-clip toggle, the stealth sweep targets) call rt.updateLights() on edge.
 */
import * as THREE from "three";
import { RealtimeRaytracer } from "../src/index.js";
import { GAME_SCENES } from "./game-scenes.js";

const P = new URLSearchParams(location.search);
const SCENE_NAME = P.get("scene") || "chase";
const PRESET = P.get("preset") || P.get("p") || null;
const MODE = P.get("mode") || (P.has("autorun") ? "bench" : "clip");
const LABEL = (P.get("label") || PRESET || "D").toUpperCase().slice(0, 6);

// ?tune=renderScale:0.375,maxHistory:32,fireflyClamp:2.5  -  explicit knob
// overrides applied AFTER the preset (or to the defaults when no preset), so a
// candidate preset can be measured without editing the shipped PRESETS object.
// Permanent A/B hook for the regression asset.
const TUNE = {};
if (P.has("tune")) {
  for (const part of P.get("tune").split(",")) {
    const eq = part.indexOf(":");
    if (eq < 0) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (!k) continue;
    if (v === "true") TUNE[k] = true;
    else if (v === "false") TUNE[k] = false;
    else if (/^-?\d*\.?\d+$/.test(v)) TUNE[k] = Number(v);
    else TUNE[k] = v;
  }
}

const metaEl = document.getElementById("meta");
const statusEl = document.getElementById("status");
const outEl = document.getElementById("out");
const badgeEl = document.getElementById("badge");
const labelEl = document.getElementById("label");
const setStatus = (t) => { statusEl.textContent = t; };

const def = GAME_SCENES[SCENE_NAME];
if (!def) {
  setStatus(`unknown scene "${SCENE_NAME}"  -  valid: ${Object.keys(GAME_SCENES).join(", ")}`);
  throw new Error(`unknown scene ${SCENE_NAME}`);
}
metaEl.textContent =
  `scene ${def.name} (${def.label}) · preset ${PRESET || "defaults"} · mode ${MODE} · label ${LABEL}`;
labelEl.textContent = `preset ${LABEL}`;

// --- renderer ---------------------------------------------------------------
const BENCH_W = 1280, BENCH_H = 720;
const renderer = new THREE.WebGLRenderer({ antialias: false });
// CLIP mode respects devicePixelRatio (capped at 2): the full-speed leg records
// at DPR 1 (1280x800 buffer), the throttled leg's high-DPR context (factor 2)
// pushes the buffer to 2560x1600  -  the resolution half of the weak-hardware
// proxy. BENCH mode pins 720p so the timing numbers are resolution-comparable.
renderer.setPixelRatio(MODE === "bench" ? 1 : Math.min(window.devicePixelRatio || 1, 2));
if (MODE === "bench") renderer.setSize(BENCH_W, BENCH_H, false);
else renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
document.getElementById("app").appendChild(renderer.domElement);
const gl = renderer.getContext();

const built = def.build();
const scene = built.scene;
const camera = built.camera;
const dynamicMeshes = built.dynamicMeshes || [];
const lights = built.lights || [];
camera.aspect = (MODE === "bench" ? BENCH_W : window.innerWidth) / (MODE === "bench" ? BENCH_H : window.innerHeight);
camera.updateProjectionMatrix();

// CLIP mode: the canvas is the video subject  -  on-screen, and the bench chrome
// hidden. BENCH mode: #app parks off-screen (readPixels needs a real buffer).
const appEl = document.getElementById("app");
if (MODE === "clip") {
  appEl.classList.remove("offscreen");
  document.body.classList.add("clip");
} else {
  appEl.classList.add("offscreen");
}

// The scenes use a dark indoor ambient (their own lights do the work).
const rt = new RealtimeRaytracer(renderer, {
  envColor: new THREE.Color(0x05070c),
  envIntensity: 1.0,
  ...(PRESET ? { preset: PRESET } : {}),
  ...TUNE, // explicit tune overrides win over the preset (they sit after it)
  // bench: quality must not drift under us. clip: leave adaptiveQuality ON so
  // the capture shows the governor breathing around the preset baseline.
  ...(MODE === "bench" ? { adaptiveQuality: false, overloadProtection: false } : {}),
});
rt.compileScene(scene, { dynamicMeshes });
scene.traverse((o) => { if (o.isLight) o.visible = true; });
rt.updateLights(scene);
window.RT = rt;
window.SCENE = scene;
window.CAMERA = camera;

function setCam(pos, look) {
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  camera.updateMatrixWorld();
}

// --- timing / probe helpers (same fences as bench.html) ---------------------
const fenceBuf = new Uint8Array(4);
function fence() { gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, fenceBuf); }
const nextFrame = () => new Promise((r) => { requestAnimationFrame(r); setTimeout(r, 50); });

function timeConfig(renderFrame, warm = 20, n = 60) {
  for (let i = 0; i < warm; i++) renderFrame();
  fence();
  const t0 = performance.now();
  for (let i = 0; i < n; i++) renderFrame();
  fence();
  return (performance.now() - t0) / n;
}

// --- ghost probe (bench.html-compatible: centred 96x96 patch) ---------------
const PATCH = 96;
const patchBuf = new Uint8Array(PATCH * PATCH * 4);
function readPatch() {
  const buf = new Uint8Array(PATCH * PATCH * 4);
  const px = Math.floor((gl.drawingBufferWidth - PATCH) / 2);
  const py = Math.floor((gl.drawingBufferHeight - PATCH) / 2);
  gl.readPixels(px, py, PATCH, PATCH, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  return buf;
}
function patchDiff(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

async function ghostProbe(poseA, poseB) {
  // Reference: settle at B.
  setCam(poseB.pos, poseB.look);
  rt.resetAccumulation();
  for (let i = 0; i < 150; i++) rt.render(scene, camera);
  const ref = readPatch();
  const refFull = readFull();

  // Settle at A, sweep A->B over 24 frames (history carries A's image).
  setCam(poseA.pos, poseA.look);
  rt.resetAccumulation();
  for (let i = 0; i < 60; i++) rt.render(scene, camera);
  const aPos = new THREE.Vector3(...poseA.pos), bPos = new THREE.Vector3(...poseB.pos);
  const aLook = new THREE.Vector3(...poseA.look), bLook = new THREE.Vector3(...poseB.look);
  const look = new THREE.Vector3();
  for (let s = 1; s <= 24; s++) {
    camera.position.lerpVectors(aPos, bPos, s / 24);
    look.lerpVectors(aLook, bLook, s / 24);
    camera.lookAt(look);
    camera.updateMatrixWorld();
    rt.render(scene, camera);
  }

  // Parked at B: measure ghost decay over settling frames.
  setCam(poseB.pos, poseB.look);
  const checkpoints = [1, 5, 10, 20, 40];
  const keys = ["g1", "g5", "g10", "g20", "g40"];
  const out = {};
  let rendered = 0;
  for (let ci = 0; ci < checkpoints.length; ci++) {
    while (rendered < checkpoints[ci]) { rt.render(scene, camera); rendered++; }
    out[keys[ci]] = patchDiff(readPatch(), ref);
    await nextFrame();
  }
  return out;
}

// --- still temporal noise ---------------------------------------------------
const DS_W = 320, DS_H = 180;
const LUMA = [0.299, 0.587, 0.114];
function downsampleLuma(buf, w, h, dw, dh) {
  const out = new Float32Array(dw * dh);
  const sx = w / dw, sy = h / dh;
  for (let y = 0; y < dh; y++) {
    const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < dw; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let l = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * w + xx) * 4;
          l += buf[i] * LUMA[0] + buf[i + 1] * LUMA[1] + buf[i + 2] * LUMA[2];
          n++;
        }
      }
      out[y * dw + x] = l / n;
    }
  }
  return out;
}
function readFull() {
  const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
  const buf = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  return downsampleLuma(buf, w, h, DS_W, DS_H);
}
function meanAbs(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

// --- bench mode -------------------------------------------------------------
async function runBench() {
  setStatus(`${def.name} / ${PRESET || "defaults"}: measuring…`);
  outEl.textContent = "";

  // 1. Set the scene state at the home pose and time it (parked, converged).
  //    update() moves props/lights AND the camera; re-bake the dynamic BVH and
  //    refresh the light table so the compiled state matches the pose.
  built.update(built.homeT);
  rt.updateDynamic();
  rt.updateLights(scene);
  setCam(built.cameraAt(built.homeT).pos, built.cameraAt(built.homeT).look);
  await nextFrame();
  // Median of THREE fence-timed blocks with a rAF yield between them: keeps the
  // page event loop alive (the ghost/noise phases after this need it) and lets
  // the driver settle. Single-block timings on this Windows/ANGLE machine swing
  // up to ~20% run to run, so the median matters more than which inter-block
  // spacing is used; the report also cross-checks defaults against balanced
  // (they MUST be the same config) and takes the floor across runs.
  const blocks = [];
  for (let k = 0; k < 3; k++) {
    blocks.push(timeConfig(() => rt.render(scene, camera)));
    await nextFrame();
  }
  blocks.sort((a, b) => a - b);
  const ms = blocks[1];
  const fps = 1000 / ms;

  // 2. Ghost probe: freeze the scene at pose B's time, move only the camera.
  built.update(built.ghostT.b);
  rt.updateDynamic();
  rt.updateLights(scene);
  const poseB = built.cameraAt(built.ghostT.b);
  const poseA = built.cameraAt(built.ghostT.a);
  const ghost = await ghostProbe(poseA, poseB);

  // 3. Still temporal noise: 30 parked frames at the home pose.
  built.update(built.homeT);
  rt.updateDynamic();
  rt.updateLights(scene);
  setCam(built.cameraAt(built.homeT).pos, built.cameraAt(built.homeT).look);
  rt.resetAccumulation();
  for (let i = 0; i < 60; i++) rt.render(scene, camera);
  let noise = 0;
  let prev = null;
  for (let f = 0; f < 30; f++) {
    rt.render(scene, camera);
    const cur = readFull();
    if (prev) noise += meanAbs(cur, prev);
    prev = cur;
  }
  const stillNoise = noise / 29;

  const result = {
    gameBench: true,
    scene: def.name,
    sceneLabel: def.label,
    preset: PRESET || "defaults",
    tune: Object.keys(TUNE).length ? TUNE : undefined,
    date: new Date().toISOString(),
    userAgent: navigator.userAgent,
    resolution: `${BENCH_W}x${BENCH_H}`,
    gpu: (() => {
      const d = gl.getExtension("WEBGL_debug_renderer_info");
      return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : "unknown";
    })(),
    ms, fps, msBlocks: blocks, stillNoise, ghost,
  };

  const lines = [
    `three-realtime-rt game benchmark  -  ${def.name} (${def.label})`,
    `preset ${PRESET || "defaults"} · ${BENCH_W}x${BENCH_H} · adaptiveQuality OFF`,
    `gpu ${result.gpu}`,
    `ms/frame ${ms.toFixed(2)} · fps ${fps.toFixed(1)} · stillNoise ${stillNoise.toFixed(3)}`,
    `ghost (mean abs diff vs settled ref, 0-255, lower=better):`,
    `  g1 ${ghost.g1.toFixed(3)}  g5 ${ghost.g5.toFixed(3)}  g10 ${ghost.g10.toFixed(3)}  g20 ${ghost.g20.toFixed(3)}  g40 ${ghost.g40.toFixed(3)}`,
  ];
  outEl.textContent = lines.join("\n");
  window.GAME_BENCH_RESULT = result;

  setStatus("done. POSTing…");
  try {
    await fetch("/__bench", { method: "POST", body: JSON.stringify(result) });
    setStatus("done  -  results saved.");
  } catch (err) {
    setStatus(`done  -  results NOT saved (${err?.message ?? err}).`);
  }
}

// --- clip mode --------------------------------------------------------------
function runClip() {
  let anchor = null;
  let lastBadge = 0, frames = 0, fps = 0;
  const seqEnd = built.loopSeconds;

  function render(now) {
    requestAnimationFrame(render);
    if (anchor === null && rt.frame >= 1) anchor = now;
    const t = anchor === null ? 0 : (now - anchor) / 1000;

    built.update(t);

    // Analytic lights: a scene with moving lights (stealth's sweeping spots)
    // needs the table refreshed every frame  -  the demo's orbit light does the
    // same. A scene whose lights only toggle (arena) needs it on the edge. The
    // scene defs flip `visible`; we detect and sync either way.
    let lightChanged = false;
    for (const l of lights) {
      if (l.last !== l.light.visible) { l.last = l.light.visible; lightChanged = true; }
    }
    if (def.dynamicLights || lightChanged) rt.updateLights(scene);

    rt.updateDynamic(); // props + projectiles moved this frame
    camera.updateMatrixWorld();
    rt.render(scene, camera);

    frames++;
    if (now - lastBadge >= 500) {
      fps = Math.round((frames * 1000) / (now - lastBadge));
      frames = 0;
      lastBadge = now;
      // NOTE: the badge deliberately shows ONLY the blind label, never the
      // preset name  -  the video rankings must not reveal which preset is which.
      badgeEl.textContent =
        `${fps} fps · lighting @ ${Math.round(rt.renderScale * 100)}%` +
        ` · ${Math.round(t * 10) / 10}s / ${seqEnd}s\n` +
        `clip ${LABEL} · ${def.name}`;
    }
  }
  requestAnimationFrame(render);
  setStatus(`running clip  -  ${def.name} / ${PRESET || "defaults"} (label ${LABEL})`);
}

// --- autorun ----------------------------------------------------------------
if (MODE === "bench") {
  runBench().catch((err) => {
    console.error(err);
    setStatus(`failed: ${err?.message ?? err}`);
    outEl.textContent = String(err?.stack ?? err);
  });
} else {
  runClip();
}
