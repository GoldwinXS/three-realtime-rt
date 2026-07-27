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
import { RealtimeRaytracer } from "../src/index.js";
// The scene catalogue lives in its own module because the guided tour's model
// stop (models.html) shows the same scenes — one definition, two pages.
import { SCENES } from "./gallery-scenes.js";

const boot = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const setBoot = (t) => { boot.classList.remove("hidden"); if (bootMsg) bootMsg.textContent = t; };

const statsEl = document.getElementById("stats");
const pickEl = document.getElementById("scene-pick");
const rtBtn = document.getElementById("rt-toggle");
const holdBtn = document.getElementById("rt-hold");

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);

// Canvas resolution scale (same win as the main demo): shrink the drawing
// buffer while the CSS canvas stays fullscreen, so the browser upscales a
// cheaper buffer — every full-res pass gets quadratically cheaper. This is the
// governor's deepest lever, driven through canvasScaleHook below.
let canvasScale = 1;
const bufferSize = () => {
  const pr = renderer.getPixelRatio();
  return [
    Math.floor(window.innerWidth * canvasScale * pr),
    Math.floor(window.innerHeight * canvasScale * pr),
  ];
};
const applyCanvasSize = () => {
  renderer.setSize(
    Math.floor(window.innerWidth * canvasScale),
    Math.floor(window.innerHeight * canvasScale),
    false
  );
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
};
// Manual/governor canvas-scale setter — resizes the buffer and re-syncs the
// live rt's targets. Guarded because rt is built lazily per scene.
const setCanvasScale = (s) => {
  canvasScale = s;
  applyCanvasSize();
  if (rt) rt.setSize(...bufferSize());
};
applyCanvasSize();
document.getElementById("app").appendChild(renderer.domElement);

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
  // Auto quality ON out of the box — the governor steers renderScale, denoise,
  // and (via canvasScaleHook) canvas scale to hold the frame-rate target on
  // whatever hardware loads the gallery.
  adaptiveQuality: true,
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
    // Governor's deepest lever. A fresh rt is built per scene, but this closure
    // captures the module-level canvasScale/renderer so it keeps working across
    // switches.
    canvasScaleHook: (s) => setCanvasScale(s),
  });
  applySettings();
  // Re-apply the current canvas scale so the new rt's buffers match (its ctor
  // read the renderer size, but be explicit in case scale changed mid-session).
  rt.setSize(...bufferSize());
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
const canvasSelect = document.getElementById("opt-canvas");
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
// Canvas resolution select — same override pattern as lighting res: manual
// choice sets canvas scale directly and turns auto quality off so the governor
// stops steering it.
if (canvasSelect) {
  canvasSelect.value = String(canvasScale);
  canvasSelect.addEventListener("change", () => {
    setCanvasScale(parseFloat(canvasSelect.value));
    settings.adaptiveQuality = false; // manual res selection overrides auto
    if (autoBox) autoBox.checked = false;
    applySettings();
  });
}

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  applyCanvasSize();
  if (rt) rt.setSize(...bufferSize());
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
