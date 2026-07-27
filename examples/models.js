/**
 * three-realtime-rt — tour stop 3: the model scenes.
 *
 * Stock glTF that was never authored for this library, dropped in with the same
 * two calls as any other app:
 *
 *   rt.compileScene(scene);
 *   rt.render(scene, camera);   // instead of renderer.render
 *
 * The catalogue is examples/gallery-scenes.js, shared verbatim with gallery.html
 * — no new assets, no second copy of the scene code. One stop with a picker
 * rather than a stop per model, so the tour stays three steps long.
 *
 * ONE RealtimeRaytracer serves every model: switching swaps the scene, re-points
 * the sky/env, and recompiles. That matters here in a way it does not in the flat
 * gallery — the shared panel's rows hold a reference to `rt`, so a tracer rebuilt
 * per scene would leave every control wired to a disposed object.
 *
 * Deep-linkable per model: models.html#tokyo.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RealtimeRaytracer } from "../src/index.js";
import { SCENES, SCENE_LIST } from "./gallery-scenes.js";
import { buildPanel, section, el, selectRow, ICON } from "./panel.js";
import { buildTourChrome, loadTourSettings, applyTourSettings, persistOnExit } from "./tour.js";

const PARAMS = new URLSearchParams(location.search);
const bootEl = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const setBoot = (t) => { bootEl?.classList.remove("hidden"); if (bootMsg) bootMsg.textContent = t; };

// The picker's contents: the whole catalogue minus the entries the tour already
// covers elsewhere (the Cornell box is stop 1, rebuilt procedurally).
const MODELS = SCENE_LIST.filter(([, , opt]) => !(opt && opt.galleryOnly));
// The stop opens on a STREAMED Khronos sample, not on a repo asset. The default
// used to be the Damaged Helmet, which is also the museum's hero one stop
// upstream — so the tour showed the same model twice and stop 3's "stock glTF
// the library never met" claim landed on something the visitor had just seen.
// BoomBox instead: a canonical Khronos sample, ~11 MB streamed from its
// canonical host, and a dense normal/ORM-mapped asset whose speaker grille and
// chrome trim are exactly what the G-buffer feeds the tracer.
const DEFAULT_MODEL = "boombox";
// The one entry that needs no network: both of its assets are committed. Used
// as the automatic fallback when a streamed model cannot be fetched, so an
// offline visitor gets a ray-traced scene and a reason instead of a dead page.
const FALLBACK_MODEL = "helmet";

async function main() {
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: PARAMS.has("pdb") });
  const TIER = RealtimeRaytracer.detectTier(renderer);
  renderer.setPixelRatio(1);
  let canvasScale = TIER === "mid" ? 0.85 : 1.0;
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
  applyCanvasSize();
  document.getElementById("app").appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Deterministic defaults, not tier presets: this stop exists to show what the
  // glass/metal paths do to a real asset, so they start ON and the fps readout
  // says what that costs. Auto-quality stays off so the number means something.
  const rt = new RealtimeRaytracer(renderer, {
    renderScale: 0.5,
    denoiseIterations: 3,
    stochasticLights: false,
    adaptiveQuality: false,
    gi: true,
    emissiveNEE: true,
    reflections: true,
    refraction: true,
    absorptionShadows: false,
    targetFps: 55,
    canvasScaleHook: (s) => setCanvasScale(s),
    envColor: new THREE.Color(0x121821),
  });

  const carried = applyTourSettings(rt, loadTourSettings());
  const state = { rtEnabled: carried.rtEnabled ?? true };

  const setCanvasScale = (s) => {
    canvasScale = s;
    applyCanvasSize();
    rt.setSize(...bufferSize());
    rt.taaJitterScale = s;
  };
  if (carried.canvasScale != null && carried.canvasScale !== canvasScale) setCanvasScale(carried.canvasScale);

  let scene = null;
  let triCount = 0;

  // The two scene-revealing feature toggles have nothing to reveal here — these
  // are other people's models and none of them is authored with an absorbing or
  // a scattering material — so they collapse to their renderer flag. Said out
  // loud in the exhibit note rather than hidden, because "tinted glass" doing
  // nothing visible on a Khronos sample is information, not a bug.
  const setFeature = (name, on) => {
    switch (name) {
      case "gi": rt.gi = on; break;
      case "emissive": rt.emissiveNEE = on; break;
      case "reflections": rt.reflections = on; break;
      case "refraction": rt.refraction = on; break;
      case "absorption": break;              // per-material; nothing here absorbs
      case "scattering": rt.kmScattering = on; break;
    }
    rt.resetAccumulation();
  };

  const ui = buildPanel({
    rt, state, setFeature, setCanvasScale, canvasScale,
    initial: carried.initial,
    hint: "drag to orbit · scroll to zoom · pick a model in the panel",
  });

  const xSec = section(ICON.frame, "Model");
  const NOTE =
    "Stock glTF, unmodified — no <i>rt</i> userData, no authoring for this " +
    "library, and every model but the last one <b>streamed from its canonical " +
    "public host</b> (nothing but the two small .glb files is committed). " +
    "<b>Tinted glass</b> and <b>scattering</b> are per-material opt-ins, " +
    "so on these assets they cost nothing and show nothing; the room upstream is " +
    "where they have something to act on.";
  const note = el("div", "caption");
  note.innerHTML = NOTE;
  /** Say a streamed model could not be fetched, above the standing note. */
  const offlineNote = (key, err) => {
    const label = (MODELS.find(([k]) => k === key) || [, key])[1];
    note.innerHTML =
      `<b style="color:#ff9d7a">${label} could not be streamed</b> ` +
      `(${err?.message ?? err}). Showing the bundled scene instead — it is the ` +
      `one entry in the picker whose assets live in the repo. ` + NOTE;
  };
  const picker = selectRow("showing", MODELS.map(([k, label]) => [label, k]), DEFAULT_MODEL,
    (v) => {
      note.innerHTML = NOTE; // a fresh pick clears a previous stream failure
      switchScene(v).catch(fail);
    });
  xSec.append(picker.row, note);
  ui.exhibits.append(xSec);

  buildTourChrome({ stopId: "models", panel: ui });
  persistOnExit(() => ({ rt, state, canvasScale, panel: ui }));

  /** Free the previous scene's GPU objects — every scene builds its own. */
  const disposeScene = (s) => {
    if (!s) return;
    s.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      for (const m of Array.isArray(o.material) ? o.material : o.material ? [o.material] : []) {
        for (const k of Object.keys(m)) {
          const v = m[k];
          if (v && v.isTexture) v.dispose();
        }
        m.dispose();
      }
    });
  };

  // rt.sky is a live object the render loop reads field by field, so it is
  // updated in place rather than replaced — a scene that wants no sky (the
  // Cornell box) supplies only `enabled`, and the rest must keep their values.
  const applySky = (s) => {
    rt.sky.enabled = !!(s && s.enabled);
    if (!s) return;
    if (s.sunDir) rt.sky.sunDir = s.sunDir;
    if (s.sunColor) rt.sky.sunColor = s.sunColor;
    if (s.zenith) rt.sky.zenith = s.zenith;
    if (s.horizon) rt.sky.horizon = s.horizon;
    if (typeof s.intensity === "number") rt.sky.intensity = s.intensity;
  };

  let current = null;
  async function switchScene(key) {
    if (!SCENES[key]) key = DEFAULT_MODEL;
    setBoot(key === FALLBACK_MODEL ? "loading scene…" : "streaming model…");
    let def;
    try {
      def = await SCENES[key]();
    } catch (err) {
      // Every model but one is streamed from a public host. If the fetch fails
      // (offline, blocked, host down) fall back to the bundled scene and SAY so
      // — the picker keeps the failed entry, it just isn't what you are looking
      // at. Only one hop: a fallback that fails is a real error.
      console.warn(`[three-realtime-rt models] ${key} failed to stream:`, err?.message ?? err);
      if (key === FALLBACK_MODEL) throw err;
      offlineNote(key, err);
      return switchScene(FALLBACK_MODEL);
    }
    const old = scene;
    scene = def.scene;
    current = key;
    picker.select.value = key;
    history.replaceState(null, "", `#${key}`);
    camera.position.set(...def.cam);
    controls.target.set(...def.target);
    controls.update();
    applySky(def.sky);
    rt.envColor = def.env?.color ?? new THREE.Color(0x121821);
    rt.envIntensity = def.env?.intensity ?? 1.0;

    setBoot("building BVH…");
    await new Promise((r) => setTimeout(r, 30)); // let the boot message paint
    const t0 = performance.now();
    rt.compileScene(scene);
    rt.resetAccumulation();
    triCount = rt.compiled ? rt.compiled.triangleCount : 0;
    console.log(
      `[three-realtime-rt models] ${key}: compiled ${triCount.toLocaleString()} tris in ` +
        `${Math.round(performance.now() - t0)}ms`
    );
    if (old && old !== scene) disposeScene(old);
    bootEl?.classList.add("hidden");
  }

  const fail = (err) => {
    console.error(err);
    bootEl?.classList.remove("hidden");
    if (bootEl) bootEl.innerHTML = `<div class="err"><b>Failed.</b>\n\n${err?.message ?? err}</div>`;
  };

  addEventListener("hashchange", () => {
    const id = (location.hash || "").replace(/^#/, "");
    if (id && id !== current && SCENES[id]) switchScene(id).catch(fail);
  });
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    applyCanvasSize();
    rt.setSize(...bufferSize());
  });

  // Expose for debugging / automated verification. SCENE is replaced on every
  // switch, so it is a live getter (Object.assign would freeze the value).
  Object.defineProperty(window, "SCENE", { get: () => scene, configurable: true });
  Object.assign(window, {
    RT: rt, CAMERA: camera, CONTROLS: controls, SWITCH: switchScene,
    RTDEMO: { rt, renderer, canvas: renderer.domElement, setFeature, switchScene, MODELS },
  });

  const wanted = (location.hash || "").replace(/^#/, "");
  await switchScene(SCENES[wanted] && wanted !== "cornell" ? wanted : DEFAULT_MODEL);

  let frames = 0, lastFps = performance.now();
  let lastRtEnabled = null;
  (function animate() {
    if (document.visibilityState === "hidden") setTimeout(animate, 100);
    else requestAnimationFrame(animate);
    if (!scene) return;

    // Fair "ray tracing off" comparison: shadow maps + ACES on the raster side,
    // flipped only on the toggle's edge (needsUpdate on every material rebuilds).
    if (state.rtEnabled !== lastRtEnabled) {
      lastRtEnabled = state.rtEnabled;
      renderer.shadowMap.enabled = !state.rtEnabled;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = state.rtEnabled ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
    }

    controls.update();
    if (state.rtEnabled) rt.render(scene, camera);
    else renderer.render(scene, camera);

    frames++;
    const now = performance.now();
    if (now - lastFps >= 500) {
      const fps = Math.round((frames * 1000) / (now - lastFps));
      frames = 0; lastFps = now;
      ui.setStats(
        `<b>${fps}</b> fps   ·   frame ${rt.frame}\n` +
          `${triCount.toLocaleString()} tris · ${current}\n` +
          `${state.rtEnabled ? `RT · lighting @ ${Math.round(rt.renderScale * 100)}%` : "plain raster"}`
      );
    }
  })();
}

main().catch((err) => {
  console.error(err);
  if (bootEl) {
    bootEl.classList.remove("hidden");
    bootEl.innerHTML =
      `<div class="err"><b>Failed to start.</b>\n\n${err && err.message ? err.message : err}\n\nSee the console for details.</div>`;
  }
});
