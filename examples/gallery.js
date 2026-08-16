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
import { SCENES, SCENE_LIST } from "./gallery-scenes.js";

const boot = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const captionEl = document.getElementById("scene-caption");
const appEl = document.getElementById("app");
const hudEl = document.getElementById("hud");
// The control card stays invisible while the hero is on screen, so the two
// never overlap during the fade.
hudEl.classList.add("boot");
// On phones the card would sit over the model for the whole session (the fold
// collapses it to title + picker), so it starts collapsed there — the scene is
// the star, every control one tap away.
if (matchMedia("(max-width: 700px)").matches) hudEl.classList.add("min");
// Collapse / expand the card (the fold button in its title row).
hudEl.querySelector(".hud-fold")?.addEventListener("click", () => hudEl.classList.toggle("min"));
// Mobile first impression: Littlest Tokyo is the showpiece on a desktop, but at
// 375px wide it opens near 6fps on mid hardware. A lighter scene makes the
// gallery feel responsive on the first interaction; the heavy scenes stay one
// pick away.
const DEFAULT_SCENE = window.innerWidth < 700 ? "boombox" : "tokyo";
// `compact` collapses the full landing hero into a small status pill, so scene
// switches keep the viewport on screen instead of flashing the intro again.
const setBoot = (t, compact = false) => {
  boot.classList.remove("hidden");
  boot.classList.toggle("compact", compact);
  if (bootMsg) bootMsg.textContent = t;
};
// The landing hero deserves a moment on screen even on a fast load, so the
// opening seconds read as an intro rather than a flash; later scene switches
// hide it immediately.
const BOOT_MIN_MS = 700;
const bootT0 = performance.now();
let firstBoot = true;
const hideBoot = () => {
  boot.classList.remove("compact");
  // The canvas stays dimmed until the overlay has faded, so the scene never
  // shows through the departing loading screen.
  const hide = () => {
    boot.classList.add("hidden");
    setTimeout(() => {
      appEl.classList.remove("dim");
      hudEl.classList.remove("boot", "busy");
    }, 340);
  };
  if (firstBoot) {
    firstBoot = false;
    const wait = Math.max(0, BOOT_MIN_MS - (performance.now() - bootT0));
    setTimeout(hide, wait);
  } else {
    hide();
  }
};

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
// The catalogue is almost all STILL LIFES, but not quite: a scene may hand back
// `dynamicMeshes` (meshes whose transforms change every frame, refitted into the
// BVH rather than recompiled) and an `update()` the render loop calls before
// each frame. `sceneDef` holds whichever scene is loaded so the loop can ask.
let sceneDef = null;
let rtEnabled = true;
let forceRaster = false; // momentary "hold: raster" override (see holdBtn below)
let triCount = 0;

// Single source of truth for the feature toggles. The gallery builds a fresh
// RealtimeRaytracer on every scene switch, so `settings` outlives any one `rt`
// and is re-applied after each switchScene() creates one. Controls write here
// then call applySettings().
//
// The STARTING values are the library's own, read from RealtimeRaytracer.DEFAULTS
// rather than restated here: the gallery is a place to see what the library does
// out of the box, so a hand-written copy of these opinions would be the one thing
// it must not have. `volumetric` is flattened because the strip's checkbox is a
// boolean; everything else is a straight key match, which is what makes
// defaultSettings() below a one-liner.
const defaultSettings = () => ({
  gi: RealtimeRaytracer.DEFAULTS.gi,
  ambient: RealtimeRaytracer.DEFAULTS.ambient,
  emissiveNEE: RealtimeRaytracer.DEFAULTS.emissiveNEE,
  reflections: RealtimeRaytracer.DEFAULTS.reflections,
  refraction: RealtimeRaytracer.DEFAULTS.refraction,
  restir: RealtimeRaytracer.DEFAULTS.restir,
  restirDirectionalBypass: RealtimeRaytracer.DEFAULTS.restirDirectionalBypass,
  restirReprojectionRescue: RealtimeRaytracer.DEFAULTS.restirReprojectionRescue,
  restirCandidateImportance: RealtimeRaytracer.DEFAULTS.restirCandidateImportance,
  restirLightGrid: RealtimeRaytracer.DEFAULTS.restirLightGrid,
  motionVectors: RealtimeRaytracer.DEFAULTS.motionVectors,
  denoise: RealtimeRaytracer.DEFAULTS.denoise,
  taa: RealtimeRaytracer.DEFAULTS.taa,
  volumetric: RealtimeRaytracer.DEFAULTS.volumetric.enabled,
  renderScale: RealtimeRaytracer.DEFAULTS.renderScale,
  // Auto quality ON out of the box — the governor steers renderScale, denoise,
  // and (via canvasScaleHook) canvas scale to hold the frame-rate target on
  // whatever hardware loads the gallery.
  adaptiveQuality: RealtimeRaytracer.DEFAULTS.adaptiveQuality,
});
const settings = defaultSettings();

function applySettings() {
  if (!rt) return;
  for (const k of [
    "gi", "ambient", "emissiveNEE", "reflections", "refraction", "restir",
    "restirDirectionalBypass", "restirReprojectionRescue",
    "restirCandidateImportance", "restirLightGrid", "motionVectors", "denoise", "taa",
    "adaptiveQuality",
  ]) {
    rt[k] = settings[k];
  }
  rt.volumetric.enabled = settings.volumetric;
  // renderScale reallocates targets, so only touch it when it actually changed.
  if (rt.renderScale !== settings.renderScale) rt.renderScale = settings.renderScale;
  rt.resetAccumulation();
}

async function switchScene(key) {
  const first = firstBoot;
  setBoot(first ? "preparing the scene…" : "loading scene…", !first);
  appEl.classList.add("dim");
  if (!first) hudEl.classList.add("busy");
  if (rt) { rt.dispose(); rt = null; }
  const def = await SCENES[key]();
  sceneDef = def;
  scene = def.scene;
  // A scene may ask for a setting on entry (the Cornell box wants gi, which
  // 0.15 ships off by default). It writes the strip's own state and re-reads
  // the checkboxes, so what the strip shows is what the scene runs; leaving the
  // scene keeps whatever is set, and Reset returns everything to the defaults.
  if (def.settingsOnEnter) {
    Object.assign(settings, def.settingsOnEnter);
    document.querySelectorAll("#options input[data-flag]").forEach((box) => {
      if (box.dataset.flag in def.settingsOnEnter) box.checked = settings[box.dataset.flag];
    });
  }
  camera.position.set(...def.cam);
  controls.target.set(...def.target);
  // Portrait viewports frame the same position too tightly (the narrow aspect
  // crops the model), so back the camera off along its view direction.
  if (window.innerWidth < window.innerHeight) {
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    const dist = camera.position.distanceTo(controls.target);
    camera.position.copy(controls.target).addScaledVector(dir, dist * 1.7);
  }
  controls.update();

  setBoot("optimizing the scene…", !first);
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
  syncLightsRow();
  // Re-apply the current canvas scale so the new rt's buffers match (its ctor
  // read the renderer size, but be explicit in case scale changed mid-session).
  rt.setSize(...bufferSize());
  const t0 = performance.now();
  // A moving scene declares its movers ONCE, here. compileScene bakes them into
  // a separate small BVH that updateDynamic() refits per frame, so nothing about
  // the layout changes while the scene runs and there is no recompile hitch.
  rt.compileScene(scene, def.dynamicMeshes ? { dynamicMeshes: def.dynamicMeshes } : undefined);
  triCount = rt.compiled.triangleCount;
  console.log(
    `[gallery] ${key}: compiled ${triCount.toLocaleString()} tris in ` +
    `${Math.round(performance.now() - t0)}ms`
  );
  // Keep the picker honest: it never lied before, it just never said the scene
  // that actually loaded (boot always started on tokyo while the dropdown sat
  // on its first option). Deep-linking lands on the same selection too.
  pickEl.value = key;
  history.replaceState(null, "", `#${key}`);
  const entry = SCENE_LIST.find(([k]) => k === key);
  if (captionEl) captionEl.textContent = (entry && entry[3]) || "";
  hideBoot();
}

pickEl.addEventListener("change", () => switchScene(pickEl.value).catch(fail));
// Deep-linkable per scene, same convention as the tour's model stop.
addEventListener("hashchange", () => {
  const id = (location.hash || "").replace(/^#/, "");
  if (id && id !== pickEl.value && SCENES[id]) switchScene(id).catch(fail);
});
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

// SCENE LIGHTS — only the hotel has a light count worth steering (96 fixtures,
// thinned evenly across its rooms), so the row hides itself on every other
// scene rather than pretending to do something. Changing it re-reads the table
// and restarts the image, which is also the cheapest way to SEE what a reveal
// costs: the reservoirs all re-learn at once.
const lightsSelect = document.getElementById("opt-lights");
const lightsRow = document.getElementById("opt-lights-row");
const lightCountEl = document.getElementById("opt-lightcount");
function syncLightsRow() {
  const has = !!(sceneDef && sceneDef.debug && sceneDef.debug.setLights);
  if (lightsRow) lightsRow.style.display = has ? "" : "none";
  if (lightCountEl && rt) {
    lightCountEl.textContent = `light table: ${rt.lightCount} / ${rt.maxLights} seats`;
  }
}
if (lightsSelect) {
  lightsSelect.addEventListener("change", () => {
    if (!sceneDef || !sceneDef.debug || !sceneDef.debug.setLights) return;
    sceneDef.debug.setLights(parseInt(lightsSelect.value, 10));
    if (rt) { rt.updateLights(scene); rt.resetAccumulation(); }
    syncLightsRow();
  });
}

// Reset to defaults: put every control in the strip back to the library's own
// constructor defaults, re-read the DOM from them, and start the image again.
// The canvas scale is the app's rather than the renderer's, so full size is its
// default. Nothing is persisted by this page, so there is no storage to clear —
// if that ever changes, it clears here.
const resetBtn = document.getElementById("opt-reset");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    Object.assign(settings, defaultSettings());
    document.querySelectorAll("#options input[data-flag]").forEach((box) => {
      box.checked = settings[box.dataset.flag];
    });
    if (resSelect) resSelect.value = String(settings.renderScale);
    setCanvasScale(1);
    if (canvasSelect) canvasSelect.value = "1";
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
  // A moving scene steps its own simulation, then the tracer re-bakes the
  // dynamic BVH from the fresh transforms and re-reads the light table. Lights
  // are re-read every frame because this scene's lights RIDE the bodies, and
  // 0.15.0's stable light slots are what keep each one's table index (and so
  // every reservoir pointing at it) valid while it moves.
  if (sceneDef && sceneDef.update) {
    // The camera goes IN because a scene may drive it (the hotel's dolly): it
    // moves camera.position and controls.target together, which keeps
    // OrbitControls' own spherical intact and the mouse still usable.
    sceneDef.update({ camera, controls, renderer });
    rt.updateDynamic();
    rt.updateLights(scene);
  }
  if (rtEnabled && !forceRaster) rt.render(scene, camera);
  else renderer.render(scene, camera);

  frames++;
  const now = performance.now();
  if (now - lastFps >= 500) {
    fps = Math.round((frames * 1000) / (now - lastFps));
    frames = 0; lastFps = now;
    statsEl.textContent =
      `${fps} fps · ${triCount.toLocaleString()} tris · ${rt.lightCount}/${rt.maxLights} lights\n` +
      `${rtEnabled ? `RT @ ${Math.round(rt.renderScale * 100)}% lighting res` : "plain raster"}`;
    syncLightsRow();
  }
}

// Expose for debugging / automated verification. Live getters — RT and SCENE
// are replaced on every scene switch (Object.assign would freeze the values).
Object.defineProperties(window, {
  RT: { get: () => rt },
  SCENE: { get: () => scene },
  SCENE_DEF: { get: () => sceneDef },
});
Object.assign(window, { CAMERA: camera, SWITCH: switchScene });
const wanted = (location.hash || "").replace(/^#/, "");
switchScene(SCENES[wanted] ? wanted : DEFAULT_SCENE).catch(fail);

// Transient "drag to orbit" cue, revealed after the hero fades and dismissed on
// the first pointer interaction or after a few seconds.
const cueEl = document.getElementById("gallery-cue");
let cueGone = false;
const dismissCue = () => {
  if (cueGone) return;
  cueGone = true;
  cueEl.classList.add("gone");
  cueEl.classList.remove("show");
};
setTimeout(() => { if (!cueGone) cueEl.classList.add("show"); }, 1500);
// Dismiss on a real orbit drag or a scroll, not on an incidental tap — the cue
// stays until the visitor actually starts moving the camera.
let downX = null, downY = null;
addEventListener("pointerdown", (e) => { downX = e.clientX; downY = e.clientY; });
addEventListener("pointermove", (e) => {
  if (downX == null) return;
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) dismissCue();
});
addEventListener("wheel", dismissCue, { passive: true });
setTimeout(dismissCue, 10000);

animate();
