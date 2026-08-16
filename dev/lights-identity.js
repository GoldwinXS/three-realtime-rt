/**
 * dev/lights-identity.js: the 0.16.0 gates that need one deterministic frame
 * out of two trees.
 *
 *   /dev/lights-identity.html?scene=museum&src=branch&k=90
 *   /dev/lights-identity.html?scene=museum&src=master&k=90
 *
 * WHAT IT IS FOR
 *  1. IMAGE IDENTITY. 0.16.0 moves the analytic light table out of three
 *     vec4[32] uniform arrays and into a row of the scene-data texture. The
 *     values are the same float32s, so with the new features off the render must
 *     be the SAME render. This page pins every source of nondeterminism (static
 *     compile, no physics step, no rAF, no wall clock, governor off), renders k
 *     frames, and hashes the drawing buffer. It also exposes the raw RGB bytes
 *     as base64 on `window.__PIXB64` so the driver can report a mean |diff| when
 *     two hashes disagree, instead of just "different".
 *  2. CONVERGENCE. Same protocol at several k, so "how far is frame k from the
 *     converged image" is measurable per scene and per arm.
 *
 * THE `src=master` ARM reads `dev/_masterref/src/`, a straight copy of the main
 * checkout's `src/` at master d75c0da (= 0.15.0), made with:
 *
 *   cp -r C:/ClaudeSessions/RayTracingUpgradeChallenge/src dev/_masterref/src
 *
 * That copy is a measurement fixture, not part of the branch: delete it when the
 * gates are done. Importing master's library into THIS page (rather than loading
 * master's own pages from a second dev server) is deliberate: it keeps ONE
 * three.js instance, ONE scene builder and ONE camera path across both arms, so
 * the only thing that differs is the library under test.
 */
import * as THREE from "three";
import { SCENES } from "../examples/gallery-scenes.js";
import { buildScene } from "../examples/scene.js";

const P = new URLSearchParams(location.search);
const SRC = P.get("src") === "master" ? "master" : "branch";
const SCENE = P.get("scene") || "museum";
const K = Math.max(1, parseInt(P.get("k") || "1", 10));
const W = parseInt(P.get("w") || "1280", 10);
const H = parseInt(P.get("h") || "720", 10);
const MAXLIGHTS = parseInt(P.get("maxlights") || "32", 10);
const GRID = P.get("grid") === "1";
const LIGHTS = P.get("lights") ? parseInt(P.get("lights"), 10) : null;
const DUMP = P.get("dump") !== "0";
// Candidate importance sampling, the ONE path that reads the CDF: turning it
// off isolates "the light table moved to a texture" from "the CDF that table
// feeds is now computed on the GPU".
const CANDCDF = P.get("candcdf") !== "0";

const out = document.getElementById("verdict");
const say = (t) => { out.textContent = t; };

// Two literal specifiers, not one computed one, so the bundler can see both.
const lib = SRC === "master"
  ? await import("./_masterref/src/index.js")
  : await import("../src/index.js");
const { RealtimeRaytracer } = lib;

/**
 * A minimal many-light interior in the shape of the Hangar's restir-min page: a
 * closed room, a partition wall, a few boxes and a row of point lights, i.e. the
 * case ReSTIR exists for (every pixel sees several lights, most of them
 * occluded). Deterministic by construction: no models, no physics, no random.
 */
function buildRooms(n = 12) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070a);
  const wall = new THREE.MeshStandardMaterial({ color: 0xb9b3a6, roughness: 0.9 });
  const floor = new THREE.MeshStandardMaterial({ color: 0x6d6f75, roughness: 0.85 });
  const prop = new THREE.MeshStandardMaterial({ color: 0x9aa7b4, roughness: 0.6, metalness: 0.1 });
  const box = (w, h, d, x, y, z, mat) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  };
  const L = 18, D = 6, Hh = 3.2;
  box(L, 0.2, D, 0, -0.1, 0, floor);
  box(L, 0.2, D, 0, Hh + 0.1, 0, wall);
  box(L, Hh, 0.2, 0, Hh / 2, -D / 2 - 0.1, wall);
  // No +Z wall: the room is open-fronted so the camera outside it looks INTO a
  // lit interior. A closed box renders its unlit outside face and the whole
  // comparison happens on a near-black image.
  box(0.2, Hh, D, -L / 2 - 0.1, Hh / 2, 0, wall);
  box(0.2, Hh, D, L / 2 + 0.1, Hh / 2, 0, wall);
  // Partitions, so most lights are occluded from most pixels.
  for (let i = -1; i <= 1; i += 2) box(0.25, Hh, D * 0.62, i * 4.5, Hh / 2, -D * 0.19, wall);
  for (let i = 0; i < 6; i++) box(0.8, 0.8, 0.8, -7 + i * 2.8, 0.4, 1.4, prop);
  for (let i = 0; i < n; i++) {
    const l = new THREE.PointLight(0xffe3bb, 3.2, 0, 2);
    l.position.set(-L / 2 + 1.2 + (i * (L - 2.4)) / Math.max(1, n - 1), Hh - 0.5, (i % 2 ? 1 : -1) * 1.6);
    l.userData.rtRadius = 0.12;
    scene.add(l);
  }
  return { scene, sky: { enabled: false }, cam: [0, 1.8, 7.6], target: [0, 1.5, 0] };
}

async function build() {
  if (SCENE === "museum") {
    const built = buildScene();
    await built.ready;
    built.scene.traverse((o) => { if (o.isLight) o.visible = true; });
    return { scene: built.scene, sky: { enabled: false }, cam: [6, 3.8, 8], target: [0, 1.2, 0] };
  }
  if (SCENE === "rooms") return buildRooms(LIGHTS || 12);
  const maker = SCENES[SCENE];
  if (!maker) throw new Error(`unknown scene "${SCENE}"`);
  if (LIGHTS !== null) {
    // Scenes that take a light count (hotel) read it from the URL themselves.
    const u = new URL(location.href);
    u.searchParams.set("lights", String(LIGHTS));
    history.replaceState(null, "", u);
  }
  return await maker();
}

async function main() {
  say(`building ${SCENE} (${SRC}, k=${K})…`);
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  document.getElementById("app").appendChild(renderer.domElement);
  const gl = renderer.getContext();

  const built = await build();
  const scene = built.scene;
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 400);
  camera.position.set(...(built.cam || [6, 3.8, 8]));
  camera.lookAt(...(built.target || [0, 1.2, 0]));
  camera.updateMatrixWorld();

  const rt = new RealtimeRaytracer(renderer, {
    renderScale: 0.5,
    denoiseIterations: 2,
    adaptiveQuality: false,    // the governor must not move under a gate
    overloadProtection: false, // nor the emergency brake
    taa: true,
    denoise: true,
    // Sky and env are SCENE DATA, so they are passed at construction (the
    // constructor fills in every field a partial sky object leaves out).
    envColor: (built.env && built.env.color) || new THREE.Color(0x121821),
    envIntensity: (built.env && built.env.intensity !== undefined) ? built.env.intensity : 1.0,
    sky: built.sky || { enabled: false },
    // Master ignores both of these (it has neither option), which is exactly
    // what makes handing the same object to both arms honest.
    maxLights: MAXLIGHTS,
    restirLightGrid: GRID,
    restirCandidateImportance: CANDCDF,
  });
  if (built.settingsOnEnter) Object.assign(rt, built.settingsOnEnter);
  rt.compileScene(scene); // STATIC: no dynamicMeshes, so nothing moves
  rt.updateLights(scene);

  say(`rendering ${K} frames…`);
  await new Promise((r) => setTimeout(r, 50));
  for (let i = 0; i < K; i++) rt.render(scene, camera);

  // Read back in the SAME task as the last render (a canvas without
  // preserveDrawingBuffer returns zeros outside it; this one preserves, but the
  // habit is what keeps the number real).
  const buf = new Uint8Array(W * H * 4);
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  let h = 0x811c9dc5;
  let lum = 0;
  const rgb = new Uint8Array(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    for (let c = 0; c < 3; c++) {
      h ^= buf[p + c];
      h = Math.imul(h, 0x01000193) >>> 0;
      rgb[i * 3 + c] = buf[p + c];
    }
    lum += 0.2126 * buf[p] + 0.7152 * buf[p + 1] + 0.0722 * buf[p + 2];
  }
  if (DUMP) {
    let s = "";
    const CH = 0x8000;
    for (let i = 0; i < rgb.length; i += CH) {
      s += String.fromCharCode.apply(null, rgb.subarray(i, Math.min(i + CH, rgb.length)));
    }
    window.__PIXB64 = btoa(s);
  }

  const verdict = {
    scene: SCENE,
    src: SRC,
    k: K,
    candCdf: CANDCDF,
    hash: h.toString(16).padStart(8, "0"),
    meanLum: Math.round((lum / (W * H)) * 1000) / 1000,
    tris: rt.compiled.triangleCount,
    lights: rt.compiled.lightCount,
    emissiveTris: rt.compiled.emissiveTriCount,
    // Present on this branch, undefined on master: the chain of custody for
    // "which library did this arm actually run".
    hasMaxLights: typeof rt.maxLights,
    hasLightGrid: typeof rt.restirLightGrid,
    lightRow: rt.compiled.lightRow === undefined ? null : rt.compiled.lightRow,
    gridCells: rt.lightGridPass ? rt.lightGridPass.cells : null,
    gridBuilds: rt.lightGridPass ? rt.lightGridPass.builds : null,
    statusOk: !!(rt.status && rt.status.ok),
    core: (rt.status && rt.status.coreFailure) || null,
    resolution: `${W}x${H}`,
  };
  // Handles for a driver that wants to poke at the arm it just measured (the
  // light-grid table readback in particular).
  window.__RT = rt;
  window.__RENDERER = renderer;
  window.__SCENE = scene;
  window.__CAMERA = camera;
  const line = JSON.stringify(verdict);
  console.log("[lights-identity] " + line);
  say(line);
  let node = document.getElementById("selftest-verdict");
  if (!node) {
    node = document.createElement("div");
    node.id = "selftest-verdict";
    node.style.cssText = "position:fixed;left:-99999px;top:0;white-space:pre;";
    document.body.appendChild(node);
  }
  node.textContent = line;
}

main().catch((err) => {
  const line = JSON.stringify({ scene: SCENE, src: SRC, threw: true, error: String((err && err.message) || err) });
  say(line);
  const node = document.createElement("div");
  node.id = "selftest-verdict";
  node.style.cssText = "position:fixed;left:-99999px;top:0;white-space:pre;";
  node.textContent = line;
  document.body.appendChild(node);
  console.error(err);
});
