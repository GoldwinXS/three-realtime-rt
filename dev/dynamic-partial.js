/**
 * dev/dynamic-partial.js: the 0.16.1 gates for "updateDynamic() does work
 * proportional to what moved". Drives the real RealtimeRaytracer render path on
 * the GPU for bit-exactness, and the pure-CPU updateDynamic() for timing.
 *
 *   /dev/dynamic-partial.html?mode=identity   (bit-exact + rebuild, once)
 *   /dev/dynamic-partial.html?mode=timing     (5 runs x 40 iters per scenario)
 *
 * WHAT IT PROVES
 *  - IMAGE / BUFFER IDENTITY: the same 90 deterministic frames run through the
 *    new partial path and through the old full path (compiled.forceFullDynamicUpdate
 *    = true) produce the same dynamic BVH root buffer, the same bounds texture
 *    and the same rendered pixels at frames 1 / 30 / 60 / 90. Deterministic by
 *    construction: no rAF, no wall clock, no physics, governor and overload
 *    protection off, one manual rt.render() per frame.
 *  - REBUILD: one frame moves every parked mesh 3000 units (volume x27), the
 *    rebuild triggers, and the frames AFTER it are again bit-exact.
 *  - TIMING: updateDynamic() CPU cost, partial vs full, for 1 mover + 380 parked,
 *    1 mover only, all 381 moving, and nothing moving.
 */
import * as THREE from "three";
import { RealtimeRaytracer, compileScene } from "../src/index.js";

const P = new URLSearchParams(location.search);
const MODE = P.get("mode") === "timing" ? "timing" : "identity";
const W = parseInt(P.get("w") || "800", 10);
const H = parseInt(P.get("h") || "600", 10);

const out = document.getElementById("verdict");
const say = (t) => { out.textContent = t; };
const log = (...a) => console.log("[dynamic-partial]", ...a);

function finalize(verdict) {
  const line = JSON.stringify(verdict);
  say(line);
  let node = document.getElementById("selftest-verdict");
  if (!node) {
    node = document.createElement("div");
    node.id = "selftest-verdict";
    node.style.cssText = "position:fixed;left:-99999px;top:0;white-space:pre;";
    document.body.appendChild(node);
  }
  node.textContent = line;
  console.log("[dynamic-partial] verdict " + line);
}

function fail(err) {
  finalize({ mode: MODE, threw: true, error: String((err && err.message) || err) });
  console.error(err);
}

// ---------------------------------------------------------------------------
// Deterministic gate scene: a static room (~5k tris, two lights), a parked pile
// of 380 meshes at y = -1000, one moving aircraft, one CPU-deforming mesh, and
// one small dynamic emitter (so the gated emissive-refresh path is exercised).
// ---------------------------------------------------------------------------
function buildGateScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070a);

  const roomMat = new THREE.MeshStandardMaterial({ color: 0x8b8578, roughness: 0.95 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x5c6068, roughness: 0.9 });
  const mk = (geo, mat, x, y, z, rx, ry) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    scene.add(m);
    return m;
  };
  const floor = new THREE.PlaneGeometry(30, 30, 24, 24);
  const ceil = new THREE.PlaneGeometry(30, 30, 24, 24);
  const wall = new THREE.PlaneGeometry(30, 12, 24, 10);
  mk(floor, floorMat, 0, 0, 0, -Math.PI / 2, 0);
  mk(ceil, roomMat, 0, 12, 0, Math.PI / 2, 0);
  mk(wall, roomMat, 0, 6, -15, 0, 0);
  mk(wall, roomMat, 0, 6, 15, 0, Math.PI);
  mk(wall, roomMat, -15, 6, 0, 0, Math.PI / 2);
  mk(wall, roomMat, 15, 6, 0, 0, -Math.PI / 2);

  const l1 = new THREE.PointLight(0xffe0b0, 60, 0, 2);
  l1.position.set(0, 9, 0);
  l1.userData.rtRadius = 0.2;
  const l2 = new THREE.PointLight(0xcfe8ff, 25, 0, 2);
  l2.position.set(-7, 4, 6);
  l2.userData.rtRadius = 0.2;
  scene.add(l1, l2);

  const dyn = [];
  const parked = [];
  const pileMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, roughness: 0.8 });
  const icoGeo = new THREE.IcosahedronGeometry(0.62, 1); // 80 tris
  for (let i = 0; i < 380; i++) {
    const m = new THREE.Mesh(icoGeo, pileMat);
    m.position.set((i % 20) - 9.5 + Math.sin(i) * 0.2, -1000 + (i % 5), Math.floor(i / 20) - 9 + Math.cos(i) * 0.2);
    m.rotation.set(i * 0.31, i * 0.17, i * 0.23);
    scene.add(m);
    dyn.push(m);
    parked.push(m);
  }

  const aircraft = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.3, 0.4, 70, 12), // ~1680 tris
    new THREE.MeshStandardMaterial({ color: 0xff8c2a, roughness: 0.45, metalness: 0.2 })
  );
  aircraft.position.set(0, 3.5, 0);
  scene.add(aircraft);
  dyn.push(aircraft);

  const defGeo = new THREE.PlaneGeometry(2.6, 2.6, 14, 14); // ~392 tris
  const def = new THREE.Mesh(defGeo, new THREE.MeshStandardMaterial({ color: 0x35c77e, roughness: 0.6 }));
  def.userData.rtDeforming = true;
  def.position.set(6, 2.5, 5);
  def.rotation.x = -Math.PI / 2;
  scene.add(def);
  dyn.push(def);

  const emit = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff4422, emissiveIntensity: 4 })
  );
  emit.position.set(-3, 3, 3);
  scene.add(emit);
  dyn.push(emit);

  scene.updateMatrixWorld(true);
  scene.dyn = dyn;
  scene.parked = parked;
  scene.aircraft = aircraft;
  scene.def = def;
  scene.emit = emit;
  return scene;
}

function buildCamera() {
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 400);
  camera.position.set(0, 2.6, 11);
  camera.lookAt(0, 2.6, 0);
  camera.updateMatrixWorld();
  return camera;
}

function step(scene, frame) {
  const t = frame;
  const a = scene.aircraft;
  a.position.set(Math.sin(t * 0.07) * 6, 3.5 + Math.sin(t * 0.13) * 1.4, Math.cos(t * 0.06) * 4);
  a.rotation.set(t * 0.021, t * 0.033, t * 0.011);
  const pos = scene.def.geometry.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, Math.sin(x * 1.7 + t * 0.18) * 0.4 + Math.cos(y * 1.7 + t * 0.12) * 0.3);
  }
  pos.needsUpdate = true;
  scene.def.geometry.computeVertexNormals();
  scene.emit.position.set(-3 + Math.sin(t * 0.08) * 1.5, 3 + Math.cos(t * 0.07) * 0.8, 3);
  scene.updateMatrixWorld(true);
}

function bigMove(scene) {
  for (const p of scene.parked) p.position.x += 3000;
  scene.updateMatrixWorld(true);
}

// ---------------------------------------------------------------------------
// Snapshot + comparison helpers
// ---------------------------------------------------------------------------
function readPixels(gl) {
  const buf = new Uint8Array(W * H * 4);
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  return buf;
}

function snapshot(rt, gl) {
  const bvh = rt.compiled.dynamicBvh;
  return {
    rootU32: new Uint32Array(bvh._roots[0]).slice(),
    rootF32: new Float32Array(bvh._roots[0]).slice(),
    boundsTex: new Float32Array(rt.compiled.dynamicBvhUniform.bvhBounds.image.data),
    contentsTex: new Uint32Array(rt.compiled.dynamicBvhUniform.bvhContents.image.data),
    pixels: readPixels(gl),
  };
}

const eqf = (a, b) => a === b || (Number.isNaN(a) && Number.isNaN(b));
function diffCount(a, b, floatCompare) {
  if (a.length !== b.length) return { diff: Infinity, lenA: a.length, lenB: b.length };
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    const d = floatCompare ? !eqf(a[i], b[i]) : a[i] !== b[i];
    if (d) n++;
  }
  return { diff: n, lenA: a.length, lenB: b.length };
}
function pixelDiff(a, b) {
  if (a.length !== b.length) return { diff: Infinity, mean: NaN, max: NaN, lenA: a.length, lenB: b.length };
  let sum = 0;
  let max = 0;
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    const d = Math.abs(a[i] - b[i]);
    sum += d;
    if (d > max) max = d;
    if (d !== 0) n++;
  }
  return { diff: n, mean: sum / a.length, max, lenA: a.length, lenB: b.length };
}

function compareSnaps(sA, sB) {
  return {
    rootU32: diffCount(sA.rootU32, sB.rootU32, false),
    rootF32: diffCount(sA.rootF32, sB.rootF32, true),
    boundsTex: diffCount(sA.boundsTex, sB.boundsTex, true),
    contentsTex: diffCount(sA.contentsTex, sB.contentsTex, false),
    pixels: pixelDiff(sA.pixels, sB.pixels),
  };
}

// ---------------------------------------------------------------------------
// One arm: fresh renderer + scene + compile, run `frames` deterministic frames,
// snapshotting at the requested frame numbers. `moveAt` optionally applies a big
// move right before frame (moveAt+1).
// ---------------------------------------------------------------------------
function runArm({ forceFull, frames, snapAt, moveAt, captureStatAt }) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  const holder = document.createElement("div");
  holder.style.cssText = "position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
  document.body.appendChild(holder);
  holder.appendChild(renderer.domElement);
  const gl = renderer.getContext();

  const scene = buildGateScene();
  const camera = buildCamera();
  const rt = new RealtimeRaytracer(renderer, {
    renderScale: 0.5,
    denoiseIterations: 2,
    adaptiveQuality: false,
    overloadProtection: false,
    taa: true,
    denoise: true,
    envColor: new THREE.Color(0x121821),
    envIntensity: 1.0,
    sky: { enabled: false },
  });
  rt.compileScene(scene, { dynamicMeshes: scene.dyn });
  if (rt.compiled) rt.compiled.forceFullDynamicUpdate = forceFull;
  rt.updateLights(scene);

  const snaps = {};
  let capturedStat = null;
  for (let f = 1; f <= frames; f++) {
    if (moveAt !== undefined && f === moveAt + 1) bigMove(scene);
    step(scene, f);
    rt.updateDynamic();
    rt.render(scene, camera);
    if (snapAt.includes(f)) snaps[f] = snapshot(rt, gl);
    if (captureStatAt !== undefined && f === captureStatAt) {
      capturedStat = { ...rt.compiled.lastDynamicUpdate };
    }
  }

  const triCount = rt.compiled ? rt.compiled.triangleCount : 0;
  const dynTriCount = rt.compiled && rt.compiled.dynamicMerged
    ? rt.compiled.dynamicMerged.getAttribute("position").count / 3
    : 0;
  const lastStat = rt.compiled ? { ...rt.compiled.lastDynamicUpdate } : null;
  const buildVolume = rt.compiled ? rt.compiled._dynBuildVolume : null;

  renderer.dispose();
  holder.remove();
  return { snaps, triCount, dynTriCount, lastStat, buildVolume, capturedStat };
}

// ---------------------------------------------------------------------------
// Identity mode
// ---------------------------------------------------------------------------
async function identityMode() {
  say("identity: running partial arm…");
  const partial = runArm({ forceFull: false, frames: 90, snapAt: [1, 30, 60, 90] });
  say("identity: running full arm…");
  const full = runArm({ forceFull: true, frames: 90, snapAt: [1, 30, 60, 90] });
  say("identity: running full arm twice (pixel floor)…");
  const full2 = runArm({ forceFull: true, frames: 90, snapAt: [1, 30, 60, 90] });

  const identity = {};
  for (const f of [1, 30, 60, 90]) {
    identity[f] = {
      partialVsFull: compareSnaps(partial.snaps[f], full.snaps[f]),
      fullFloor: compareSnaps(full.snaps[f], full2.snaps[f]),
    };
  }

  say("identity: running rebuild arms…");
  const rbPartial = runArm({ forceFull: false, frames: 20, snapAt: [5, 12, 15, 20], moveAt: 10, captureStatAt: 11 });
  const rbFull = runArm({ forceFull: true, frames: 20, snapAt: [5, 12, 15, 20], moveAt: 10, captureStatAt: 11 });
  const rebuild = {};
  for (const f of [5, 12, 15, 20]) {
    rebuild[f] = compareSnaps(rbPartial.snaps[f], rbFull.snaps[f]);
  }

  finalize({
    mode: MODE,
    triCount: partial.triCount,
    dynTriCount: partial.dynTriCount,
    segments: 383,
    identity,
    rebuild,
    partialLastStat: partial.lastStat,
    fullLastStat: full.lastStat,
    rebuildFramePartialStat: rbPartial.capturedStat,
    rebuildFrameFullStat: rbFull.capturedStat,
    identityBuildVolume: partial.buildVolume,
    buildVolumeAfterRebuild: rbPartial.buildVolume,
  });
}

// ---------------------------------------------------------------------------
// Timing mode (CPU only; no renderer needed)
// ---------------------------------------------------------------------------
function buildTimingScene(kind) {
  const scene = new THREE.Scene();
  const roomMat = new THREE.MeshStandardMaterial({ color: 0x8b8578 });
  const room = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 30), roomMat);
  room.position.set(0, 6, 0);
  scene.add(room);
  const dyn = [];
  const parked = [];
  const mat = new THREE.MeshStandardMaterial({ color: 0x8899aa });
  const icoGeo = new THREE.IcosahedronGeometry(0.62, 1); // 80 tris
  const aircraftGeo = new THREE.TorusKnotGeometry(1.3, 0.4, 70, 12); // ~1680 tris
  const mk = (geo) => {
    const m = new THREE.Mesh(geo, mat);
    scene.add(m);
    dyn.push(m);
    return m;
  };
  let aircraft = null;
  const addPile = (y) => {
    for (let i = 0; i < 380; i++) {
      const m = mk(icoGeo);
      m.position.set((i % 20) - 9.5, y + (i % 5), Math.floor(i / 20) - 9);
      m.rotation.set(i * 0.31, i * 0.17, i * 0.23);
      parked.push(m);
    }
  };
  if (kind === "1only") {
    aircraft = mk(aircraftGeo);
    aircraft.position.set(0, 3, 0);
  } else if (kind === "1+380") {
    addPile(-1000);
    aircraft = mk(aircraftGeo);
    aircraft.position.set(0, 3, 0);
  } else if (kind === "all") {
    // Worst case: 380 icosahedra + 1 aircraft, all moving around the origin
    // (not parked at -1000, so their volume never balloons and no rebuild fires
    // during the timed iterations).
    for (let i = 0; i < 380; i++) {
      const m = mk(icoGeo);
      m.position.set((i % 20) - 9.5, (i % 5), Math.floor(i / 20) - 9);
      m.rotation.set(i * 0.31, i * 0.17, i * 0.23);
      parked.push(m);
    }
    aircraft = mk(aircraftGeo);
    aircraft.position.set(0, 8, 0);
  } else {
    // "none": everything parked.
    addPile(-1000);
    aircraft = mk(aircraftGeo);
    aircraft.position.set(0, 3, 0);
  }
  scene.updateMatrixWorld(true);
  return { scene, dyn, parked, aircraft, kind };
}

function moveTiming(built, i) {
  if (built.kind === "none") return;
  if (built.kind === "all") {
    for (let k = 0; k < built.parked.length; k++) {
      const m = built.parked[k];
      m.position.x = Math.sin(i * 0.1 + k) * 8;
      m.position.y = Math.cos(i * 0.09 + k * 0.7) * 4 + 4;
      m.rotation.y = i * 0.03 + k;
    }
  }
  if (built.kind !== "none") {
    const a = built.aircraft;
    a.position.set(Math.sin(i * 0.07) * 6, 3.5 + Math.sin(i * 0.13) * 1.4, Math.cos(i * 0.06) * 4);
    a.rotation.set(i * 0.021, i * 0.033, i * 0.011);
  }
  built.scene.updateMatrixWorld(true);
}

function timeUpdateDynamic({ kind, forceFull, runs = 5, iters = 40 }) {
  const avgs = [];
  for (let r = 0; r < runs; r++) {
    const built = buildTimingScene(kind);
    // Pure-CPU compile: compileScene (exported) needs no WebGL context, so the
    // timing leg does not touch the shared GPU at all.
    const compiled = compileScene(built.scene, { dynamicMeshes: built.dyn });
    compiled.forceFullDynamicUpdate = forceFull;
    // warmup (first call bakes everything; excluded from the timed iterations)
    built.scene.updateMatrixWorld(true);
    compiled.updateDynamic();
    const times = [];
    for (let i = 1; i <= iters; i++) {
      moveTiming(built, i);
      const a = performance.now();
      compiled.updateDynamic();
      const b = performance.now();
      times.push(b - a);
    }
    times.sort((x, y) => x - y);
    const sum = times.reduce((s, x) => s + x, 0);
    avgs.push(sum / times.length);
  }
  avgs.sort((x, y) => x - y);
  const min = avgs[0];
  const median = avgs[avgs.length >> 1];
  return { runs: avgs, min, median };
}

async function timingMode() {
  const scenarios = [
    ["1 mover + 380 parked", "1+380"],
    ["1 mover only", "1only"],
    ["all 381 moving", "all"],
    ["nothing moving", "none"],
  ];
  const result = {};
  for (const [name, kind] of scenarios) {
    say(`timing: ${name} (full path)…`);
    const full = timeUpdateDynamic({ kind, forceFull: true });
    say(`timing: ${name} (partial path)…`);
    const partial = timeUpdateDynamic({ kind, forceFull: false });
    result[name] = { full, partial };
  }
  finalize({ mode: MODE, timing: result });
}

// ---------------------------------------------------------------------------
// Fire-and-forget, like lights-identity.js: the module must finish evaluating
// promptly so the page's DOMContentLoaded fires and the driver's waitForFunction
// can poll for the verdict that appears once the arms finish rendering.
(async () => {
  try {
    if (MODE === "timing") await timingMode();
    else await identityMode();
  } catch (err) {
    fail(err);
  }
})();
