/**
 * three-realtime-rt — premade scene gallery.
 *
 * Loads stock glTF scenes that were never authored for this library and drops
 * the raytracer in with the same two calls as any other app:
 *
 *   rt.compileScene(scene);
 *   rt.render(scene, camera);   // instead of renderer.render
 *
 * The HUD's "ray tracing" button A/Bs against plain rasterized three.js, with
 * an fps + triangle readout, so you can judge the visual difference and the
 * cost on real content.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RealtimeRaytracer } from "../src/index.js";

// The two big showcase models are streamed from their canonical public hosts
// rather than committed — cloning the library shouldn't cost 14 MB of demo
// assets. (Helmet + Duck are small and were already part of the repo.)
const tokyoUrl =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/LittlestTokyo.glb";
const lanternUrl =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Lantern/glTF-Binary/Lantern.glb";
const khronos = (name) =>
  `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/${name}/glTF-Binary/${name}.glb`;
const cameraUrl = khronos("AntiqueCamera");
const boomBoxUrl = khronos("BoomBox");
const corsetUrl = khronos("Corset");
const waterBottleUrl = khronos("WaterBottle");
const toyCarUrl = khronos("ToyCar");
const iridescenceLampUrl = khronos("IridescenceLamp");
const mosquitoUrl = khronos("MosquitoInAmber");
const foxUrl = khronos("Fox");
import helmetUrl from "./assets/DamagedHelmet.glb?url";
import duckUrl from "./assets/Duck.glb?url";

const boot = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const setBoot = (t) => { boot.classList.remove("hidden"); if (bootMsg) bootMsg.textContent = t; };

const statsEl = document.getElementById("stats");
const pickEl = document.getElementById("scene-pick");
const rtBtn = document.getElementById("rt-toggle");
const holdBtn = document.getElementById("rt-hold");

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

// Google-hosted DRACO decoder (same one the official three.js examples use).
const draco = new DRACOLoader().setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);
const loader = new GLTFLoader().setDRACOLoader(draco);
const loadGltf = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));

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

function groundPlane(color = 0x9aa3ac) {
  const g = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 0.3, 48),
    new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
  );
  g.position.y = -0.15;
  return g;
}

function sunAndSky(scene, intensity = 3.2, pos = [8, 14, 6]) {
  const sun = new THREE.DirectionalLight(0xfff2dd, intensity);
  sun.position.set(...pos);
  sun.userData.rtRadius = 0.04;
  scene.add(sun, sun.target);
  return {
    enabled: true,
    sunDir: sun.position.clone().normalize(),
    sunColor: new THREE.Color(1.0, 0.93, 0.82),
    zenith: new THREE.Color(0.2, 0.36, 0.62),
    horizon: new THREE.Color(0.74, 0.82, 0.9),
    intensity: 1.0,
  };
}

const SCENES = {
  async tokyo() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10151d);
    const gltf = await loadGltf(tokyoUrl);
    normalize(gltf.scene, 12);
    scene.add(gltf.scene, groundPlane(0x2a2f36));
    // Sun on the camera side so the street facade reads.
    const sky = sunAndSky(scene, 2.4, [14, 16, 15]);
    const fill = new THREE.PointLight(0xaac8ff, 4);
    fill.position.set(-6, 7, -4);
    fill.userData.rtRadius = 0.4;
    scene.add(fill);
    return {
      scene, sky, cam: [11, 7, 12], target: [0, 3.4, 0],
      env: { color: new THREE.Color(0.35, 0.42, 0.55), intensity: 0.8 },
    };
  },
  async lantern() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(lanternUrl);
    normalize(gltf.scene, 8);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.2);
    return { scene, sky, cam: [7, 5, 9], target: [0, 3, 0] };
  },
  async helmet() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const [helmet, duck] = await Promise.all([loadGltf(helmetUrl), loadGltf(duckUrl)]);
    helmet.scene.scale.setScalar(2.2);
    helmet.scene.position.set(0, 2.6, 0);
    duck.scene.position.set(3.2, 0, 1.8);
    duck.scene.scale.setScalar(1.2);
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.6, 1.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.5 })
    );
    plinth.position.y = 0.75;
    const mirror = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 48, 32),
      new THREE.MeshStandardMaterial({ color: 0xf2f4f8, roughness: 0.06, metalness: 1.0 })
    );
    mirror.position.set(-3.0, 0.9, 1.4);
    scene.add(helmet.scene, duck.scene, plinth, mirror, groundPlane());
    const sky = sunAndSky(scene, 2.8);
    return { scene, sky, cam: [6, 4, 8], target: [0, 2, 0] };
  },
  async camera() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(cameraUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6, [10, 15, 8]);
    return { scene, sky, cam: [6, 5, 8], target: [0, 3, 0] };
  },
  async boombox() {
    // BoomBox is authored a few centimetres tall — normalize large so it fills
    // the view, then a tighter camera to read the metal + label textures.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(boomBoxUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x777d85));
    const sky = sunAndSky(scene, 2.8);
    return { scene, sky, cam: [5, 4, 7], target: [0, 2.2, 0] };
  },
  async corset() {
    // Another sub-centimetre asset — scaled up so the glossy fabric shows.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(corsetUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.4, 0] };
  },
  async waterbottle() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(waterBottleUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.2, 0] };
  },
  async toycar() {
    // Sub-centimetre clearcoat asset — scaled up so the metallic paint and the
    // reflective clearcoat over it read on the raytraced side.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(toyCarUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x777d85));
    const sky = sunAndSky(scene, 2.8);
    return { scene, sky, cam: [5, 4, 7], target: [0, 2.2, 0] };
  },
  async iridescence() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(iridescenceLampUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [6, 5, 8], target: [0, 3.2, 0] };
  },
  async mosquito() {
    // Amber block — a refractive/transmissive hero, so it shows best with the
    // glass paths on.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(mosquitoUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.4, 0] };
  },
  async fox() {
    // Fox is a skinned/animated asset — we load it and render the bind pose
    // (no mixer), which is fine for a static lighting showcase.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(foxUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.8, [10, 15, 8]);
    return { scene, sky, cam: [6, 5, 8], target: [0, 3, 0] };
  },
};

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let rt = null;
let scene = null;
let rtEnabled = true;
let forceRaster = false; // momentary "hold: raster" override (see holdBtn below)
let triCount = 0;

// Single source of truth for the feature toggles. The gallery builds a fresh
// RealtimeRaytracer on every scene switch, so `settings` outlives any one `rt`
// and is re-applied after each switchScene() creates one. Controls write here
// then call applySettings().
const settings = {
  gi: true,
  emissiveNEE: true,
  reflections: true,
  refraction: true,
  restir: true,
  denoise: true,
  taa: true,
  volumetric: false,
  renderScale: 0.5,
  adaptiveQuality: false,
};

function applySettings() {
  if (!rt) return;
  rt.gi = settings.gi;
  rt.emissiveNEE = settings.emissiveNEE;
  rt.reflections = settings.reflections;
  rt.refraction = settings.refraction;
  rt.restir = settings.restir;
  rt.denoise = settings.denoise;
  rt.taa = settings.taa;
  rt.volumetric.enabled = settings.volumetric;
  rt.adaptiveQuality = settings.adaptiveQuality;
  // renderScale reallocates targets, so only touch it when it actually changed.
  if (rt.renderScale !== settings.renderScale) rt.renderScale = settings.renderScale;
  rt.resetAccumulation();
}

async function switchScene(key) {
  setBoot("loading scene…");
  if (rt) { rt.dispose(); rt = null; }
  const def = await SCENES[key]();
  scene = def.scene;
  camera.position.set(...def.cam);
  controls.target.set(...def.target);
  controls.update();

  setBoot("building BVH…");
  await new Promise((r) => setTimeout(r, 30)); // let the boot message paint
  rt = new RealtimeRaytracer(renderer, {
    ...RealtimeRaytracer.recommendedOptions(RealtimeRaytracer.detectTier(renderer)),
    sky: def.sky,
    envColor: def.env?.color ?? new THREE.Color(0x121821),
    envIntensity: def.env?.intensity ?? 1.0,
  });
  applySettings();
  const t0 = performance.now();
  rt.compileScene(scene);
  triCount = rt.compiled.triangleCount;
  console.log(
    `[gallery] ${key}: compiled ${triCount.toLocaleString()} tris in ` +
    `${Math.round(performance.now() - t0)}ms`
  );
  boot.classList.add("hidden");
}

pickEl.addEventListener("change", () => switchScene(pickEl.value).catch(fail));
rtBtn.addEventListener("click", () => {
  rtEnabled = !rtEnabled;
  rtBtn.textContent = `ray tracing: ${rtEnabled ? "ON" : "OFF"}`;
  rtBtn.classList.toggle("on", rtEnabled);
  if (rt) rt.resetAccumulation();
});

// Hold-to-compare: while the button is held, forceRaster routes the loop through
// plain renderer.render (same path as rtEnabled === false) for an instant
// before/after. On release we reset accumulation so RT re-converges cleanly.
const holdRaster = (on) => {
  forceRaster = on;
  holdBtn.classList.toggle("on", on);
  if (!on && rt) rt.resetAccumulation();
};
holdBtn.addEventListener("pointerdown", () => holdRaster(true));
holdBtn.addEventListener("pointerup", () => holdRaster(false));
holdBtn.addEventListener("pointerleave", () => holdRaster(false));
holdBtn.addEventListener("touchstart", (e) => { e.preventDefault(); holdRaster(true); });
holdBtn.addEventListener("touchend", (e) => { e.preventDefault(); holdRaster(false); });

// Options strip — each checkbox mirrors a boolean in `settings`; the lighting-res
// select drives renderScale (and forces auto-quality off, matching the main
// demo's manual override). Everything routes through applySettings().
const resSelect = document.getElementById("opt-res");
const autoBox = document.getElementById("opt-adaptive");
document.querySelectorAll("#options input[data-flag]").forEach((box) => {
  box.checked = settings[box.dataset.flag];
  box.addEventListener("change", () => {
    settings[box.dataset.flag] = box.checked;
    applySettings();
  });
});
if (resSelect) {
  resSelect.value = String(settings.renderScale);
  resSelect.addEventListener("change", () => {
    settings.renderScale = parseFloat(resSelect.value);
    settings.adaptiveQuality = false; // manual res selection overrides auto
    if (autoBox) autoBox.checked = false;
    applySettings();
  });
}

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  if (rt) rt.setSize(innerWidth, innerHeight);
});

const fail = (err) => {
  console.error(err);
  boot.classList.remove("hidden");
  boot.innerHTML = `<div class="err"><b>Failed.</b>\n\n${err?.message ?? err}</div>`;
};

let frames = 0, fps = 0, lastFps = performance.now();
function animate() {
  if (document.visibilityState === "hidden") setTimeout(animate, 100);
  else requestAnimationFrame(animate);
  if (!scene || !rt) return;
  controls.update();
  if (rtEnabled && !forceRaster) rt.render(scene, camera);
  else renderer.render(scene, camera);

  frames++;
  const now = performance.now();
  if (now - lastFps >= 500) {
    fps = Math.round((frames * 1000) / (now - lastFps));
    frames = 0; lastFps = now;
    statsEl.textContent =
      `${fps} fps · ${triCount.toLocaleString()} tris\n` +
      `${rtEnabled ? `RT @ ${Math.round(rt.renderScale * 100)}% lighting res` : "plain raster"}`;
  }
}

// Expose for debugging / automated verification. Live getters — RT and SCENE
// are replaced on every scene switch (Object.assign would freeze the values).
Object.defineProperties(window, {
  RT: { get: () => rt },
  SCENE: { get: () => scene },
});
Object.assign(window, { CAMERA: camera, SWITCH: switchScene });
switchScene("tokyo").catch(fail);
animate();
