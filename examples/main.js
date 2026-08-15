/**
 * three-realtime-rt — reference example.
 *
 * This file shows, end to end, how to add ray traced lighting to an ordinary
 * three.js project. The recipe is:
 *
 *   1. Build a normal three.js Scene + Camera (see scene.js — nothing in it
 *      knows about ray tracing; it's just meshes, materials and lights).
 *   2. Create a WebGLRenderer as usual, then wrap it in a RealtimeRaytracer.
 *   3. Compile the scene once (builds the BVH + material/light tables). Pass
 *      `dynamicMeshes` for anything that will move each frame.
 *   4. In the render loop, call `rt.render(scene, camera)` instead of
 *      `renderer.render(...)`. For moving objects call `rt.updateDynamic()`
 *      first; when lights change call `rt.updateLights(scene)`.
 *
 * Everything else here (physics, UI) is ordinary three.js / app code.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RealtimeRaytracer } from "../src/index.js";
import { buildScene } from "./scene.js";
import { Physics } from "./physics.js";
import { buildUI } from "./ui.js";
import { createSelftest } from "./selftest.js";
import { buildTourChrome, loadTourSettings, applyTourSettings, persistOnExit } from "./tour.js";

const boot = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const setBoot = (t) => { if (bootMsg) bootMsg.textContent = t; };
// The landing hero should be readable before the canvas takes over, even on a
// fast load; the fade is delayed to a short minimum display time.
const BOOT_MIN_MS = 700;
const bootT0 = performance.now();
const hideBoot = () => {
  const wait = Math.max(0, BOOT_MIN_MS - (performance.now() - bootT0));
  setTimeout(() => boot?.classList.add("hidden"), wait);
};

// Compatibility mode: some mobile GPUs (notably iOS Safari's watchdog) kill the
// tab during the heavy RT shader compile or run out of texture memory. When
// that happens we reload with ?safe=1 and render plain rasterized three.js
// instead of crashing the browser.
// iOS now defaults to full ray tracing — recent perf work runs at 60fps on an
// iPad, so the old "iOS starts in compatibility mode" opt-out is gone. Safe
// mode is now purely reactive (webglcontextlost / RT setup failure, below)
// plus an explicit ?safe=1 opt-in.
const PARAMS = new URLSearchParams(location.search);
const SAFE = PARAMS.has("safe");
// ?selftest=1: run the render self-test (examples/selftest.js). Forces the full
// lighting stack on, then reads the drawing buffer back after 90 rendered frames
// and emits a machine-readable verdict. Needs preserveDrawingBuffer to read the
// canvas — enabled only in this mode so normal runs keep the cheaper default.
const SELFTEST = PARAMS.has("selftest");
let safeModeTriggered = false;
const enterSafeMode = (why) => {
  if (SAFE || safeModeTriggered) return;
  safeModeTriggered = true;
  console.warn("[three-realtime-rt demo] switching to compatibility mode:", why);
  // Surface the reason after the reload — on iOS there's no console to check,
  // so this is the only way to know WHY ray tracing bailed.
  try { sessionStorage.setItem("rtSafeReason", String(why)); } catch {}
  const u = new URL(location.href);
  u.searchParams.set("safe", "1");
  location.replace(u);
};

async function main() {
  // ?selftest=empty: the empty-scene no-op check (see runEmptySceneSelftest).
  // Self-contained and returns before the demo scene is built, so it exercises
  // exactly the "construct the tracer, then add meshes" call order.
  if (PARAMS.get("selftest") === "empty") {
    await runEmptySceneSelftest();
    return;
  }
  // ?selftest=warnings: the usage-diagnostics check (see runWarningsSelftest).
  // Also self-contained — it builds a deliberately MIS-configured scene.
  if (PARAMS.get("selftest") === "warnings") {
    await runWarningsSelftest();
    return;
  }
  // ?selftest=governor: the governor-pinning regression check (see runGovernorSelftest).
  // No scene, no render — pure constructor + _takeFreeWins / _releaseFreeWins assertions.
  if (PARAMS.get("selftest") === "governor") {
    await runGovernorSelftest();
    return;
  }
  // ?selftest=presets: the quality-presets API check (see runPresetsSelftest).
  // No scene, no render — pure constructor + applyPreset assertions.
  if (PARAMS.get("selftest") === "presets") {
    await runPresetsSelftest();
    return;
  }

  // 1. An ordinary three.js scene (coloured room, lights, hero props).
  const { scene, camera, bounds, lights, sky, ready, showcase, water, windows, fox } = buildScene();

  // A Rapier physics playground drops a pool of props onto the ground. Their
  // meshes are plain three.js meshes — we'll hand them to the raytracer as the
  // "dynamic" set so their motion produces correct ray traced shadows.
  setBoot("warming up the physics…");
  const physics = await Physics.create();
  physics.buildStaticColliders(bounds);
  // The prop pile is opt-in (UI "Spawn pile" button) — the default scene stays
  // clean so the hero pieces and lighting read clearly.

  setBoot("loading the models…");
  await ready; // wait for glTF hero models before compiling the BVH

  // 2. Renderer + raytracer. The raytracer takes over lighting; three.js still
  //    rasterizes primary visibility (the G-buffer) for free.
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: SELFTEST || PARAMS.has("pdb") });
  // Keep the CANVAS sharp (geometry/texture edges carry readability) and let
  // the adaptive governor cut cost on the lighting side instead. Phones get up
  // to 1.5× DPR — pixelRatio 1 on a 3× phone screen reads as mush.
  const TIER = RealtimeRaytracer.detectTier(renderer);
  // Sharpness within a PIXEL BUDGET: small phone screens can afford extra DPR
  // (their CSS resolution is tiny), big tablets cannot — a 13" iPad at 1.5×
  // is a ~2049×1536 buffer stack, enough for iOS to jetsam the tab.
  const cssPixels = window.innerWidth * window.innerHeight;
  const budgetPr = Math.sqrt(1.6e6 / cssPixels); // ~1600×1000 worst case
  renderer.setPixelRatio(
    TIER === "mid" ? Math.max(1, Math.min(window.devicePixelRatio || 1, 1.5, budgetPr)) : 1
  );
  // Canvas resolution scale (user-discovered win: browser zoom shrinks the
  // buffer with barely visible quality loss on dense screens — every full-res
  // pass gets quadratically cheaper). The canvas CSS size stays fullscreen;
  // the browser upscales the smaller drawing buffer.
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

  // If the GPU process dies (iOS Safari memory/watchdog kill), fall back
  // instead of taking the whole tab down with us.
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    if (!SAFE) enterSafeMode("webgl context lost");
    else setBoot("graphics context lost — please reload");
  });

  if (SAFE) {
    // Plain rasterized three.js: same scene, no ray tracing. Keeps the demo
    // browsable on devices that can't handle the RT pipeline.
    boot?.classList.add("hidden");
    const note = document.createElement("div");
    note.id = "hint";
    note.style.cssText =
      "position:fixed;top:12px;left:14px;z-index:30;color:#8fa3b3;font:11px ui-monospace,Consolas,monospace;" +
      "background:rgba(14,18,24,0.8);border:1px solid #26323c;border-radius:6px;padding:6px 10px;";
    let reason = "";
    try { reason = sessionStorage.getItem("rtSafeReason") || ""; } catch {}
    note.textContent =
      "compatibility mode — ray tracing off on this device" +
      (reason ? ` (reason: ${reason})` : " (works on desktop)");
    document.body.append(note);

    const controls2 = new OrbitControls(camera, renderer.domElement);
    controls2.target.set(0, 1.2, 0);
    controls2.enableDamping = true;
    (function rasterLoop() {
      requestAnimationFrame(rasterLoop);
      controls2.update();
      physics.step();
      renderer.render(scene, camera);
    })();
    return;
  }

  // Debug hook: ?nospecmrt=1 forces the WebKit/iOS single-attachment lighting
  // fallback on ANY machine, so the iOS code path can be exercised (and eye-
  // balled) without an Apple device in hand.
  const urlFlags = new URLSearchParams(location.search);
  if (urlFlags.has("nospecmrt")) {
    RealtimeRaytracer._specMrtSupported = () => false;
  }
  // ?gitaps=N: override ReSTIR GI spatial tap count (0 = v1 temporal-only) —
  // lets a devtools-less device bisect spatial-vs-temporal artifacts.
  const giTapsOverride = urlFlags.has("gitaps") ? parseInt(urlFlags.get("gitaps"), 10) : null;

  // ?diag=1: on-page console capture for devices with no reachable devtools
  // (iPads in the field). Shader compile/link failures land in console.error —
  // this surfaces the ERROR lines right on the screen so a photo of the device
  // is a usable bug report.
  if (urlFlags.has("diag")) {
    const box = document.createElement("div");
    box.style.cssText =
      "position:fixed;top:48px;left:8px;right:8px;max-height:45vh;overflow-y:auto;z-index:99;" +
      "background:rgba(10,5,5,0.92);color:#ff8f7a;border:1px solid #703030;border-radius:6px;" +
      "font:10px/1.4 ui-monospace,Consolas,monospace;padding:8px;white-space:pre-wrap;word-break:break-all;";
    box.textContent = "diag: capturing console…";
    document.body.append(box);
    const add = (tag, args) => {
      const raw = args.map((a) => String(a)).join(" ");
      // Shader dumps run thousands of lines — keep the ERROR lines + head.
      const errLines = raw.split("\n").filter((l) => /ERROR|error:|failed|Failed/.test(l));
      const text = (errLines.length ? errLines.join("\n") : raw).slice(0, 700);
      box.textContent += `\n[${tag}] ${text}\n`;
    };
    for (const level of ["error", "warn"]) {
      const orig = console[level].bind(console);
      console[level] = (...args) => {
        add(level, args);
        orig(...args);
      };
    }
    window.addEventListener("error", (e) => add("window", [e.message]));
    window.addEventListener("unhandledrejection", (e) => add("promise", [e.reason]));
  }

  // The demo starts at the user's tested MINIMAL config on every tier: a lean
  // stochastic-light core with the heavy paths (GI, emissive NEE, reflections,
  // refraction) off. Each is an opt-in add-on in the panel so its frame cost is
  // visible on whatever hardware this actually is. Explicit — no tier presets —
  // so the starting point is identical everywhere. targetFps stays set so the
  // "auto quality" toggle has a target to walk quality toward.
  const rt = new RealtimeRaytracer(renderer, {
    renderScale: 0.375,
    denoiseIterations: 5,
    stochasticLights: true,
    adaptiveQuality: false,
    // GI is ON at boot now, deliberately: this room's pitch is "every feature,
    // one lit room", and the owner's glow-up ask (a natural feel) plus the
    // procedural-sky experiment both need the one-bounce path — the sky only
    // lights the room through GI-miss rays, and the critic's "objects float,
    // no contact shadows" read is the flat no-bounce look. Everything else
    // stays at the tested minimal boot so the per-feature cost rows in the
    // panel keep their A/B meaning. The added frame cost is fenced in the
    // report.
    gi: true,
    emissiveNEE: false,
    reflections: false,
    refraction: false,
    // Coloured shadows default ON in the library (they cost nothing until a
    // material actually absorbs), but the demo starts them OFF so the museum's
    // reveal is a real before/after: "tinted glass" brings the Lumiere screen in
    // casting one flat dark rectangle — what a rasterizer draws — and "tinted
    // shadows" turns that rectangle into the coloured light quilt. Boot is
    // unaffected either way: with nothing absorbing, the megakernel uses the
    // byte-identical no-absorption source regardless of this flag.
    absorptionShadows: false,
    targetFps: 55,
    // Deepest governor lever: canvas scale is app-owned (we own the canvas + CSS
    // stretch), so hand the governor our setter. setCanvasScale is declared
    // below; the closure only fires at render time, after it exists.
    canvasScaleHook: (s) => setCanvasScale(s),
    maxHistory: 48,     // shorter history so moving shadows keep up
    envColor: new THREE.Color(0x0a0f18), // low ambient for GI rays that escape the room
    sky,                // (disabled indoors) procedural sky as GI ambient + background
    fog: { enabled: false, color: new THREE.Color(0.5, 0.55, 0.62), density: 0.04 },
  });
  if (giTapsOverride !== null && Number.isFinite(giTapsOverride)) {
    rt.restirGISpatialTaps = giTapsOverride;
  }

  // Self-test mode turns the full lighting stack on (GI + emissive NEE +
  // reflections + refraction) at 50% lighting resolution, matching the config
  // the render verdicts are calibrated against. The scene, physics and UI stay
  // exactly as a human sees them so the test exercises the real pipeline.
  let selftest = null;
  if (SELFTEST) {
    rt.gi = true;
    rt.emissiveNEE = true;
    rt.reflections = true;
    rt.refraction = true;
    rt.renderScale = 0.5;
    rt.adaptiveQuality = false; // hold the resolution fixed so the count is meaningful
    rt.resetAccumulation();
    selftest = createSelftest({ rt, renderer });
  }

  // Tour stop 2. Renderer settings carried from the previous stop are copied on
  // here BEFORE the panel is built, so its rows come up showing them; the
  // scene-revealing features (tinted glass, tinted shadows, scattering) come
  // back as intents and are replayed through the panel's own toggle handlers.
  // Skipped entirely under ?selftest so the self-test always drives the
  // documented defaults regardless of what a previous page left behind.
  const carried = SELFTEST ? { initial: {}, canvasScale: null, rtEnabled: null }
                           : applyTourSettings(rt, loadTourSettings());

  // The dynamic set = the (opt-in) physics pile PLUS the CPU-deformed water
  // pool PLUS the animated fox PLUS the orbit light's emissive orb. The water is
  // flagged rtDeforming in scene.js, so the raytracer reads its live geometry
  // each frame; the fox's SkinnedMesh is auto-detected and CPU-skinned each
  // frame; the physics meshes are rigid movers; the orb is a rigid dynamic
  // EMITTER (a moving NEE area light) — invisible until the orbit light is on, so
  // compileScene skips it while hidden.
  const dynamicMeshes = () => [...physics.meshes, water.mesh, ...fox.meshes, showcase.orbitOrb];

  // 3. Compile once. `dynamicMeshes` marks meshes that move every frame — they
  //    get re-baked into the BVH on updateDynamic() (see the loop below).
  setBoot("optimizing the scene…");
  const t0 = performance.now();
  rt.compileScene(scene, { dynamicMeshes: dynamicMeshes() });
  console.log(
    `[three-realtime-rt] compiled in ${Math.round(performance.now() - t0)}ms: ` +
      `${rt.compiled.triangleCount.toLocaleString()} tris ` +
      `(${physics.meshes.length} dynamic), ${rt.compiled.lightCount} lights`
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  // Expose for debugging / automated verification.
  Object.assign(window, { RT: rt, SCENE: scene, CAMERA: camera, PHYSICS: physics, CONTROLS: controls, FOX: fox });
  controls.target.set(0.4, 1.6, -3.2); // centred on the hero frieze (see scene.js camera)
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.5; // stay above the ground
  controls.minPolarAngle = Math.PI * 0.28; // don't climb to a void-exposing top-down
  controls.minDistance = 4;
  controls.maxDistance = 26; // keep the view inside the room's context
  controls.update();

  // Lights only need re-reading when they actually change, so the UI calls this
  // instead of us polling every frame.
  const refreshLights = () => rt.updateLights(scene);
  const state = {
    rtEnabled: carried.rtEnabled ?? true,
    physicsPaused: false,
    waterEnabled: true,
    foxEnabled: true,
  };

  // The orbiting ceiling light is animated in the loop (below) — find it once.
  const orbitDesc = lights.find((l) => l.label === "orbit light");
  const orbitLight = orbitDesc.light;
  const orbitOrb = showcase.orbitOrb;
  // Toggling the "orbit light" toggles BOTH the analytic point light and its
  // emissive orb. The orb is an emissive mesh, so adding/removing it from the
  // scene changes the NEE light table — a recompile, same deliberate hitch as
  // the clerestory windows. lightRow (ui.js) sets light.visible + updateLights
  // first, then calls this to sync the orb and rebuild.
  orbitDesc.onToggle = (on) => {
    orbitOrb.visible = on;
    rt.compileScene(scene, { dynamicMeshes: dynamicMeshes() });
    rt.resetAccumulation();
  };

  // Clerestory windows: emissive area lights are snapshotted at compile time,
  // so changing how many are open rebuilds the light tables (a deliberate,
  // visible cost — same hitch as spawning the pile).
  const setWindows = (n) => {
    windows.forEach((w, i) => (w.visible = i < n));
    rt.compileScene(scene, { dynamicMeshes: dynamicMeshes() });
    rt.resetAccumulation();
  };

  // Panel feature toggles route through here. Every case ends by resetting
  // accumulation so the change isn't smeared by stale history.
  const setFeature = (name, on) => {
    switch (name) {
      case "gi":
        rt.gi = on;
        break;
      case "emissive":
        rt.emissiveNEE = on;
        break;
      // Reflections/refraction transform the materials-bench spheres in place
      // (chrome/gold/glass are always in the scene), so no visibility change
      // and no recompile — just the flag and a fresh accumulation.
      case "reflections":
        rt.reflections = on;
        break;
      case "refraction":
        rt.refraction = on;
        break;
      // Tinted glass (Beer-Lambert absorption): show/hide the GLASS ENSEMBLE —
      // the "Sunset" backlit relief on the red wall AND the "Lumiere" stained-
      // glass screen on centre stage — then recompile. The absorbing materials
      // are compiled in WITH the pieces, so OFF really is today's program: the
      // lighting megakernel strips back to the byte-identical no-absorption
      // source (see RTLightingPass.setAbsorption). That makes this toggle the
      // feature's cost A/B: flip it and watch the fps readout.
      case "absorption":
        showcase.tintedArt.traverse((o) => (o.visible = on));
        showcase.lumiere.traverse((o) => (o.visible = on));
        rt.compileScene(scene, { dynamicMeshes: dynamicMeshes() });
        break;
      // Kubelka-Munk scattering: show/hide "Alabaster" — the reading lamp and
      // the absorb-vs-scatter sphere pair — then recompile, because the
      // scattering materials only exist while the piece does. The rt flag is
      // pushed FIRST so the recompile's single shader splice already knows about
      // it. With the piece hidden nothing in the scene scatters, so OFF really
      // is 0.9.0's program: the megakernel strips back to the byte-identical
      // no-scattering source, which makes this toggle the feature's cost A/B.
      case "scattering":
        rt.kmScattering = on;
        showcase.alabaster.traverse((o) => (o.visible = on));
        rt.compileScene(scene, { dynamicMeshes: dynamicMeshes() });
        break;
    }
    rt.resetAccumulation();
  };

  // Spawn the physics pile on demand and rebuild the BVH with the new
  // dynamic set (a one-time hitch, same as the initial compile).
  //
  // The drop pad moved out of the centre floor (2.6, 2.4) — that floor is now
  // the Lumiere projection screen — into the right-hand DYNAMICS half beside the
  // fox platform. The 5x5 resting pyramid spans x 5.86..8.34, z -1.09..1.39, so
  // with 0.5m props the occupied box is x 5.61..8.59 by z -1.34..1.64. That
  // clears every static body in the corner, which matters because the plinths
  // carry no physics colliders — a prop resting inside one would sink through
  // the stone:
  //   fox plinth     x 8.75..11.25, z 3.5..5.5  -> 1.86m of z clearance
  //   teapot plinth  circle r1.035 at (10.0,-1.4) -> 0.38m clear (x 9.17..8.59)
  //   knot plinth    circle r0.75 at (9.3,-4.5) -> z -1.34..1.64, knot z max -3.75
  //   Lumiere floor projection  x 0.2..5.0      -> 0.6m of x clearance
  // and it stays inside the default camera frame (ndc x ~0.75) — the true
  // back-right corner is past the right edge at 16:10 and 16:9 alike, which
  // would hide the pile at boot. A "Drop" still jitters props +-1.5m, which can
  // throw one onto a plinth for a moment; that was true before this move too.
  const spawnPile = () => {
    if (physics.meshes.length > 0) return;
    physics.spawnPool(scene, 40, new THREE.Vector3(7.1, 0, 0.15));
    rt.compileScene(scene, { dynamicMeshes: dynamicMeshes() });
  };

  // "Party lights" — spawn N extra point lights at deterministic pseudo-random
  // positions/colours to stress the many-light path (ReSTIR). The scene already
  // has 3 lights and the light table caps at 16, so N tops out at 13. Same slider
  // value always yields the same lights (seeded per index), so it's reproducible.
  const extraLights = [];
  // mulberry32 — tiny deterministic PRNG; one stream per light index.
  const mulberry32 = (a) => () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const setExtraLights = (n) => {
    n = Math.max(0, Math.min(13, Math.round(n)));
    if (n === extraLights.length) return;
    while (extraLights.length < n) {
      const i = extraLights.length;
      const rand = mulberry32(i * 2654435761 + 1);
      const light = new THREE.PointLight(
        new THREE.Color().setHSL(rand(), 0.85, 0.6), 6, 0, 2
      );
      light.position.set(
        (rand() * 2 - 1) * 6,   // x in ±6
        2.5 + rand() * 3,       // y in 2.5..5.5
        (rand() * 2 - 1) * 6    // z in ±6
      );
      light.userData.rtRadius = 0.2; // soft shadows
      // A small glowing marker so the party light is visibly a source. It's a
      // CHILD of the light so it tracks its position, and rtExclude keeps it out
      // of the BVH — otherwise the marker would occlude its own light's shadow
      // rays (same trick the Shadow Heist game uses). rtExclude also keeps its
      // emissive off the RT light lists, so the glow is purely cosmetic via the
      // G-buffer — intended.
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 8),
        new THREE.MeshStandardMaterial({ color: 0x000000, emissive: light.color, emissiveIntensity: 3 })
      );
      marker.userData.rtExclude = true;
      light.add(marker);
      scene.add(light);
      extraLights.push(light);
    }
    while (extraLights.length > n) {
      const light = extraLights.pop();
      // Dispose the cosmetic marker's geometry/material before dropping the light.
      const marker = light.children.find((c) => c.userData && c.userData.rtExclude);
      if (marker) {
        marker.geometry.dispose();
        marker.material.dispose();
      }
      scene.remove(light);
      light.dispose();
    }
    refreshLights();
    rt.resetAccumulation();
  };

  const setCanvasScale = (s) => {
    canvasScale = s;
    applyCanvasSize();
    rt.setSize(...bufferSize());
    // Keep TAA jitter constant in SCREEN pixels: at reduced canvas scale the
    // CSS stretch magnifies buffer-pixel jitter into visible wobble.
    rt.taaJitterScale = s;
  };
  if (carried.canvasScale != null && carried.canvasScale !== canvasScale) {
    setCanvasScale(carried.canvasScale);
  }
  const ui = buildUI({ rt, physics, lights, scene, state, refreshLights, spawnPile, setFeature, setExtraLights, setWindows, setCanvasScale, canvasScale, initial: carried.initial });
  // Persistent tour chrome: PREV / NEXT and the prominent RT ON/OFF switch. The
  // switch and the panel's "ray tracing" row are two faces of one state.
  buildTourChrome({ stopId: "museum", panel: ui });
  persistOnExit(() => ({ rt, state, canvasScale, panel: ui }));

  // Test/automation surface (also read by scripts/selftest.mjs). The raytracer
  // instance carries all live properties (gi, restirGI, restirGIValidate, …);
  // the hooks drive the demo-owned actions (window count, feature toggles) that
  // are not raytracer properties.
  window.RT = rt;
  window.RTDEMO = { rt, renderer, setWindows, setFeature, setExtraLights, refreshLights, scene, lights, canvas: renderer.domElement };

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    applyCanvasSize();
    rt.setSize(...bufferSize());
  });

  // 4. Render loop.
  let frames = 0, fps = 0, lastFps = performance.now(), lastT = performance.now();
  let booted = false;
  let orbitAngle = 0;      // orbiting ceiling light phase (advanced only when lit)
  let orbitManual = false; // when true the verification probe owns the orbit angle
  let lastRtEnabled = null; // reconfigure the raster path only on RT on/off edges
  let waterPerfLogged = false; // one-shot updateDynamic() cost probe (water active)

  // Verification hooks (used by the headed-chromium emissive probe). Harmless in
  // normal use: they just script the same operations the UI exposes, plus manual
  // control of the orbit angle so a fixed floor point can be sampled per pose.
  const positionOrbit = (a) => {
    orbitLight.position.set(Math.cos(a) * 4.0, 5.4, Math.sin(a) * 4.0);
    refreshLights();
  };
  window.__demoTest = {
    rt, scene, state, orbitLight, orbitOrb, sign: showcase.sign,
    // Enable/disable both the orbit point light and its emissive orb, with the
    // recompile that adds/removes the orb from the NEE table.
    setOrbit(on) {
      orbitLight.visible = on;
      orbitOrb.visible = on;
      rt.compileScene(scene, { dynamicMeshes: dynamicMeshes() });
      rt.resetAccumulation();
    },
    // Isolate the orb's NEE: keep orbitLight VISIBLE (so updateDynamic keeps
    // refreshing the orb) but zero its analytic intensity, so any floor light is
    // the orb emitter's NEE cast alone. syncLights drops intensity<=0 lights.
    setOrbitAnalytic(on) { orbitLight.intensity = on ? 13 : 0; refreshLights(); },
    setOrbitManual(on) { orbitManual = on; },
    setOrbitAngle(a) { orbitAngle = a; positionOrbit(a); },
    setWater(on) { state.waterEnabled = on; },
    setFox(on) { state.foxEnabled = on; },
    resetAccum() { rt.resetAccumulation(); },
  };

  function animate() {
    if (document.visibilityState === "hidden") setTimeout(animate, 100);
    else requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    // Fair "ray tracing off" comparison: the raster fallback gets shadow maps +
    // ACES tone mapping so it isn't a flat unlit strawman. Flip these only when
    // the toggle changes — needsUpdate on every material is a rebuild.
    if (state.rtEnabled !== lastRtEnabled) {
      lastRtEnabled = state.rtEnabled;
      renderer.shadowMap.enabled = !state.rtEnabled;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = state.rtEnabled ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
    }

    controls.update();
    if (!state.physicsPaused) physics.step();

    // Sweep the orbiting light + its emissive orb when on — moving ray traced
    // shadows AND a moving NEE area light. Only the (cheap) light-list update is
    // needed here; temporal reprojection carries the lighting, so we deliberately
    // do NOT reset accumulation each frame. The orb (child of the light) tracks
    // the position for free; updateDynamic() below refreshes its NEE triangles.
    // orbitManual lets the verification probe own the angle (window.__demoTest).
    if (orbitLight.visible && !orbitManual) {
      orbitAngle += dt * 0.6;
      orbitLight.position.set(Math.cos(orbitAngle) * 4.0, 5.4, Math.sin(orbitAngle) * 4.0);
      refreshLights();
    }

    // The water deforms continuously, so its geometry must be advanced (and the
    // dynamic BVH refit) every frame — INDEPENDENTLY of whether the physics pile
    // is awake. Advance it before updateDynamic() so the fresh vertices/normals
    // are what gets baked in.
    if (state.waterEnabled) water.update(now / 1000);
    // Advance the fox's gait and pose its skeleton (bones -> world matrices) so
    // this frame's CPU skinning in updateDynamic() matches the raster.
    if (state.foxEnabled && fox.update) fox.update(dt);

    if (state.rtEnabled) {
      // Re-bake the dynamic BVH when anything moved: the water (if enabled), the
      // fox (if walking), or an awake physics body. At full rest with water/fox
      // off, the whole step (and its BVH upload) is skipped, which is most of the
      // frame.
      const physicsActive = !state.physicsPaused && physics.anyAwake();
      try {
        // The orbit orb is a moving emitter, so its dynamic BVH + NEE rows must
        // refresh every frame the orbit light is on, even at physics rest.
        if (state.waterEnabled || state.foxEnabled || physicsActive || orbitLight.visible) {
          const tDyn = performance.now();
          rt.updateDynamic();
          // One-shot perf probe: what does re-baking the deforming water +
          // CPU-skinning the fox cost?
          if (!waterPerfLogged && (state.waterEnabled || state.foxEnabled)) {
            waterPerfLogged = true;
            const foxVerts = fox.meshes.reduce(
              (n, m) => n + m.geometry.getAttribute("position").count, 0
            );
            console.log(
              `[three-realtime-rt demo] updateDynamic() (water=${state.waterEnabled}, ` +
                `fox=${state.foxEnabled}, ${foxVerts.toLocaleString()} skinned src verts): ` +
                `${(performance.now() - tDyn).toFixed(2)} ms ` +
                `(${rt.compiled.triangleCount.toLocaleString()} dynamic+static tris)`
            );
          }
        }
        rt.render(scene, camera); // <- the one call that replaces renderer.render
      } catch (err) {
        enterSafeMode(err && err.message ? err.message : String(err));
        return;
      }
    } else {
      renderer.render(scene, camera);
    }

    if (!booted) { booted = true; hideBoot(); }

    // Render self-test: evaluate verdicts off the drawing buffer once enough
    // frames have accumulated. No-op after the verdict is emitted.
    if (selftest) selftest.onFrame();

    frames++;
    if (now - lastFps >= 500) {
      fps = Math.round((frames * 1000) / (now - lastFps));
      frames = 0;
      lastFps = now;
      ui.setStats(
        `<b>${fps}</b> fps   ·   frame ${rt.frame}\n` +
          `${rt.compiled.triangleCount.toLocaleString()} tris · ${physics.meshes.length} dynamic\n` +
          `${rt.compiled.lightCount} lights · lighting @ ${Math.round(rt.renderScale * 100)}%`
      );
    }
  }
  animate();
}

/**
 * Empty-scene regression check (?selftest=empty). compileScene() on a scene with
 * no meshes must be a no-op (warn once, keep the current scene) and render() must
 * not crash — the natural "construct the tracer, then add meshes" order. Drives
 * that order end to end, then confirms adding meshes and recompiling brings the
 * tracer online. Emits a machine-readable verdict into the same #selftest-verdict
 * node the Playwright driver reads (scripts/selftest.mjs), with `emptyScene:true`.
 */
async function runEmptySceneSelftest() {
  const emit = (v) => {
    const line = JSON.stringify({ emptyScene: true, ...v });
    console.log("[selftest:empty] " + line);
    let node = document.getElementById("selftest-verdict");
    if (!node) {
      node = document.createElement("div");
      node.id = "selftest-verdict";
      node.style.cssText =
        "position:fixed;left:-99999px;top:0;white-space:pre;pointer-events:none;";
      document.body.appendChild(node);
    }
    node.textContent = line;
    node.setAttribute("data-pass", String(!!v.pass));
  };

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(64, 64);
    const rt = new RealtimeRaytracer(renderer);
    const supported = !!rt.supported;

    // The status surface must exist immediately after construction.
    const statusPresent =
      !!rt.status && Array.isArray(rt.status.disabled) && "ok" in rt.status;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    // 1. compileScene on the empty scene: no throw, no compiled scene yet.
    const compiledEmpty = rt.compileScene(scene);
    const emptyIsNoop = rt.compiled == null && compiledEmpty == null;

    // 2. render() a few frames with nothing to trace: must fall back to plain
    //    rasterization instead of crashing or dereferencing a null scene.
    for (let i = 0; i < 3; i++) rt.render(scene, camera);
    const framesAfterEmpty = rt.frame; // stays 0 — the fallback returns early

    // 3. now add meshes + a light and recompile: the tracer must come online.
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x88aaff, roughness: 0.6 })
    );
    scene.add(mesh);
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 3, 2);
    scene.add(light);
    rt.compileScene(scene);
    const compiledAfterAdd = supported ? rt.compiled != null : true;
    for (let i = 0; i < 3; i++) rt.render(scene, camera);

    rt.dispose();

    const pass = statusPresent && emptyIsNoop && compiledAfterAdd;
    emit({
      pass,
      threw: false,
      supported,
      statusPresent,
      emptyIsNoop,
      framesAfterEmpty,
      compiledAfterAdd,
    });
  } catch (err) {
    emit({ pass: false, threw: true, error: (err && err.message) || String(err) });
  } finally {
    try { if (renderer) renderer.dispose(); } catch { /* ignore */ }
  }
}

/**
 * Usage-diagnostics regression check (?selftest=warnings).
 *
 * The library's silent-mistake diagnostics (rt.status.warnings + one console
 * warning each) are only worth anything if they FIRE on a wrong scene, fire
 * EXACTLY ONCE, and stay quiet on a right one (the healthy half of that contract
 * is asserted by the main ?selftest=1 leg, which requires warnings === 0).
 *
 * So this builds a deliberately mis-configured scene — every diagnostic's
 * trigger, in one place — drives it through the real render loop, and asserts:
 *
 *   1. implicit compile (render() with no compileScene() call)   -> warns
 *   2. userData.rtDeforming on a mesh not in dynamicMeshes       -> warns
 *   3. an InstancedMesh                                          -> warns
 *   4. a transparent mesh listed in dynamicMeshes                -> warns
 *   5. a visible Sprite/Line                                     -> warns, AND
 *      zero GL errors across the frames it is visible for (it is auto-hidden
 *      from the 4-attachment G-buffer instead of being drawn into it — the
 *      GL_INVALID_OPERATION this replaced)
 *   6. a static mesh whose position buffer is edited after compileScene()
 *      -> warns once the 30-frame staleness scan comes around
 *   7. every one of the above fires EXACTLY ONCE across ~100 rendered frames
 *   8. rt.status.warnings carries the expected codes
 *   9. rt.status.ok stays TRUE (usage warnings are not pipeline failures)
 *
 * Emits its verdict into the same #selftest-verdict node the Playwright driver
 * reads (scripts/selftest.mjs), tagged `warningsScene:true`.
 */
async function runWarningsSelftest() {
  const emit = (v) => {
    const line = JSON.stringify({ warningsScene: true, ...v });
    console.log("[selftest:warnings] " + line);
    let node = document.getElementById("selftest-verdict");
    if (!node) {
      node = document.createElement("div");
      node.id = "selftest-verdict";
      node.style.cssText =
        "position:fixed;left:-99999px;top:0;white-space:pre;pointer-events:none;";
      document.body.appendChild(node);
    }
    node.textContent = line;
    node.setAttribute("data-pass", String(!!v.pass));
  };

  // Capture console.warn (still forwarding it) so "fired exactly once" is
  // measurable, not just "the status array has an entry".
  const seen = [];
  const origWarn = console.warn.bind(console);
  console.warn = (...args) => {
    seen.push(args.map((a) => String(a)).join(" "));
    origWarn(...args);
  };
  // Substring signatures, one per diagnostic. Kept short and specific so a
  // reworded message still matches on the part that identifies the case.
  const SIGS = {
    implicit: "compiled the scene implicitly",
    deforming: "userData.rtDeforming is set on a mesh",
    instanced: "InstancedMesh is NOT supported",
    transparent: "listed in dynamicMeshes does nothing",
    untraceable: "not traceable geometry",
    stale: "changed after compileScene()",
  };
  const count = (sig) => seen.filter((l) => l.includes(sig)).length;

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(128, 128);
    const gl = renderer.getContext();
    const rt = new RealtimeRaytracer(renderer, { adaptiveQuality: false });
    const supported = !!rt.supported;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 0, 0);

    // (a) a plain static mesh — the one we will edit behind the BVH's back.
    const staticBox = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x88aaff, roughness: 0.6 })
    );
    staticBox.name = "static-box";
    staticBox.position.set(-1.5, 0, 0);
    scene.add(staticBox);

    // (b) rtDeforming WITHOUT dynamicMeshes membership — the flag is ignored.
    const flagged = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xffaa44, roughness: 0.5 })
    );
    flagged.name = "flagged-not-dynamic";
    flagged.userData.rtDeforming = true;
    scene.add(flagged);

    // (c) an InstancedMesh — collapses to one instance.
    const instanced = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x44ff88 }),
      4
    );
    instanced.name = "instanced-crates";
    for (let i = 0; i < 4; i++) {
      instanced.setMatrixAt(i, new THREE.Matrix4().makeTranslation(i * 0.6 - 1, 1.2, 0));
    }
    scene.add(instanced);

    // (d) a transparent mesh — later listed in dynamicMeshes, which does nothing.
    const pane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
    );
    pane.name = "glass-pane";
    pane.position.set(1.6, 0, 1);
    scene.add(pane);

    // (e) untraceable object types, visible, with no rtExclude.
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff4488 }));
    sprite.name = "hud-sprite";
    sprite.position.set(0, 2, 0);
    scene.add(sprite);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, -1, 0),
        new THREE.Vector3(2, -1, 0),
      ]),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    line.name = "debug-line";
    scene.add(line);

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 4, 3);
    scene.add(light);

    // --- phase 1: implicit compile + the compile-time diagnostics ------------
    gl.getError(); // clear any pre-existing flag so the count below is ours
    let glErrors = 0;
    for (let i = 0; i < 3; i++) {
      rt.render(scene, camera);
      if (gl.getError() !== 0) glErrors++;
    }
    const implicitFired = count(SIGS.implicit) === 1;
    const deformingFired = count(SIGS.deforming) === 1;
    const instancedFired = count(SIGS.instanced) === 1;
    const untraceableFired = count(SIGS.untraceable) === 1;
    // The sprite/line are still in the scene and visible — the G-buffer hid and
    // restored them, so this must hold:
    const untraceableStillVisible = sprite.visible === true && line.visible === true;
    // No dynamicMeshes yet, so this one must NOT have fired.
    const transparentQuietSoFar = count(SIGS.transparent) === 0;

    // --- phase 2: edit a STATIC mesh, then cross the staleness scan ----------
    const pos = staticBox.geometry.getAttribute("position");
    pos.setY(0, pos.getY(0) + 0.5);
    pos.needsUpdate = true; // bumps attribute.version — what the scan compares
    // 60+ frames: crosses the 30-frame throttle twice, so a diagnostic that
    // re-fires per scan (rather than once per mesh) is caught here.
    for (let i = 0; i < 60; i++) {
      rt.render(scene, camera);
      if (gl.getError() !== 0) glErrors++;
    }
    const staleFired = count(SIGS.stale) === 1;

    // --- phase 3: an explicit compile that mis-uses dynamicMeshes ------------
    rt.compileScene(scene, { dynamicMeshes: [pane] });
    for (let i = 0; i < 35; i++) {
      rt.render(scene, camera);
      if (gl.getError() !== 0) glErrors++;
    }
    const transparentFired = count(SIGS.transparent) === 1;
    // Nothing re-fired across the recompile + another ~95 frames.
    const firedOnce = Object.values(SIGS).every((sig) => count(sig) === 1);

    // --- status surface ------------------------------------------------------
    const codes = ((rt.status && rt.status.warnings) || []).map((w) => w.code);
    const expected = [
      "implicit-compile",
      "rtdeforming-not-dynamic",
      "instanced-mesh",
      "untraceable-object",
      "transparent-dynamic",
      "stale-geometry",
    ];
    const codesPresent = expected.every((c) => codes.includes(c));
    // Exactly once in the status array too (deduped by code + message).
    const codesUnique = expected.every((c) => codes.filter((x) => x === c).length === 1);
    // Usage warnings must NOT flip the pipeline-health flag.
    const statusOk = !!(rt.status && rt.status.ok === true) && rt.compileError == null;

    const frames = rt.frame;
    rt.dispose();

    const pass =
      supported &&
      implicitFired &&
      deformingFired &&
      instancedFired &&
      untraceableFired &&
      untraceableStillVisible &&
      transparentQuietSoFar &&
      staleFired &&
      transparentFired &&
      firedOnce &&
      codesPresent &&
      codesUnique &&
      statusOk &&
      glErrors === 0;

    emit({
      pass,
      threw: false,
      supported,
      implicitFired,
      deformingFired,
      instancedFired,
      untraceableFired,
      untraceableStillVisible,
      transparentQuietSoFar,
      staleFired,
      transparentFired,
      firedOnce,
      codesPresent,
      codesUnique,
      statusOk,
      glErrors,
      codes,
      frames,
    });
  } catch (err) {
    emit({ pass: false, threw: true, error: (err && err.message) || String(err) });
  } finally {
    console.warn = origWarn;
    try { if (renderer) renderer.dispose(); } catch { /* ignore */ }
  }
}

/**
 * Quality-presets API check (?selftest=presets).
 *
 * Guards the two contracts the presets round is built on, WITHOUT rendering a
 * scene (pure construction + applyPreset, so it is fast and focused):
 *
 *   1. BYTE-IDENTITY OF DEFAULTS. A fresh instance (no `preset` option) must
 *      carry exactly the 0.11.1 constructor option values. The renderer's
 *      defaults are snapshotted below; if a future change moves one, this fails.
 *      (Shader source is untouched by this round  -  the km/absorption pattern
 *      guards that separately  -  so option equality is the remaining half of the
 *      "identical to 0.11.1" claim.)
 *
 *   2. BALANCED IS A NO-OP. applyPreset("balanced") on a fresh instance changes
 *      nothing, and a constructor with `preset: "balanced"` yields the same
 *      values as a bare constructor.
 *
 * Plus the behavioural surface: the constructor preset applies BEFORE explicit
 * options (explicit wins), applyPreset() actually changes the bundled knobs,
 * unknown names throw listing the valid presets, the `preset` getter reports
 * the last applied name (or "custom"), and the PRESETS object is four flat
 * maps of scalar/plain-object knob values (no nested objects, no arrays).
 *
/**
 * Governor-pinning regression check (?selftest=governor).
 *
 * Guards the four invariants of the option-pinning mechanism (0.14.1):
 *
 *   1. An app that passes `restirGI: false` never has it enabled by the governor,
 *      even under sustained load (_takeFreeWins must skip pinned keys).
 *   2. An app that passes nothing still gets the current free-win behaviour
 *      (regression: pinning must not break the normal path for unpinned options).
 *   3. An app that passes `restirGI: true` never has it disabled (symmetry: the
 *      governor must equally not turn OFF a pinned true).
 *   4. The release path does not resurrect a pinned option (_releaseFreeWins
 *      never sees a pinned key in `prev`, so it cannot restore it).
 *
 * No scene, no render — drives `_takeFreeWins` and `_releaseFreeWins` directly
 * on a WebGLRenderer-backed instance so `isSupported` and the constructor path
 * are real, but no frame is ever drawn.
 *
 * Emits its verdict into the same #selftest-verdict node the Playwright driver
 * reads (scripts/selftest.mjs), tagged `governorScene:true`.
 */
async function runGovernorSelftest() {
  const emit = (v) => {
    const line = JSON.stringify({ governorScene: true, ...v });
    console.log("[selftest:governor] " + line);
    let node = document.getElementById("selftest-verdict");
    if (!node) {
      node = document.createElement("div");
      node.id = "selftest-verdict";
      node.style.cssText =
        "position:fixed;left:-99999px;top:0;white-space:pre;pointer-events:none;";
      document.body.appendChild(node);
    }
    node.textContent = line;
    node.setAttribute("data-pass", String(!!v.pass));
  };

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
    renderer.setSize(64, 64);
    const supported = RealtimeRaytracer.isSupported(renderer);
    const s = (v) => (supported ? v : true);
    const ok = (cond) => (supported ? (cond === true ? true : cond) : true);

    const now = () => performance.now();

    // --- 1. Pinned false stays false under sustained load -----------------
    // Construct with restirGI: false (pinned), gi + denoise on so the free win
    // is otherwise applicable. giHalfRate NOT passed — it should still be taken.
    const a = new RealtimeRaytracer(renderer, {
      gi: true, denoise: true, denoiseIterations: 2,
      restirGI: false,    // pinned false
      adaptiveQuality: false,
    });
    // Set up the GI pass so the restirGI gate would pass if unpinned
    a._giExternal = false; // inline GI path, so restirGI works

    const took1 = a._takeFreeWins(now());
    // restirGI must STAY false (pinned), giHalfRate must be taken (not pinned)
    const pinnedFalseStays = ok(a.restirGI === false);
    const unpinnedStillTakes = ok(a.giHalfRate === true);
    // _takeFreeWins returns true because giHalfRate was taken
    const took1ReturnsTrue = ok(took1 === true);

    // --- 2. Unpinned gets the free wins (regression) -----------------------
    // Construct with NO pinned options — the normal path must still work.
    const b = new RealtimeRaytracer(renderer, {
      gi: true, denoise: true, denoiseIterations: 2,
      adaptiveQuality: false,
    });
    b._giExternal = false;

    const took2 = b._takeFreeWins(now());
    const unpinnedGetsFreeWins = ok(
      b.giHalfRate === true && b.restirGI === true
    );

    // --- 3. Pinned true stays true (symmetry) -----------------------------
    // restirGI: true pinned — the governor must NOT turn it off.
    const c = new RealtimeRaytracer(renderer, {
      gi: true, denoise: true, denoiseIterations: 2,
      restirGI: true,     // pinned true
      adaptiveQuality: false,
    });
    c._giExternal = false;

    // _takeFreeWins only enables (from false to true), so it naturally won't
    // touch a true value. The real risk is _releaseFreeWins restoring a false
    // prev entry. Verify takeFreeWins does NOT record restirGI in prev.
    const took3 = c._takeFreeWins(now());
    const pinnedTrueNotRecorded = ok(
      c._qFreeWins && !("restirGI" in c._qFreeWins)
    );
    // And restirGI stays true after the take
    const pinnedTrueStays = ok(c.restirGI === true);

    // --- 4. Release path does not resurrect a pinned option --------------
    // Use instance `a` from test 1 (restirGI pinned false). Its prev has
    // giHalfRate but NOT restirGI. Simulate: after take, release should
    // restore giHalfRate to false but leave restirGI untouched.
    const restirGIBefore = a.restirGI;
    const released = a._releaseFreeWins(now());
    const releaseRestoresUnpinned = ok(a.giHalfRate === false); // restored
    const releaseDoesNotTouchPinned = ok(a.restirGI === restirGIBefore);
    const releaseReturnsTrue = ok(released === true);

    // --- 5. restirMCap pinned ---------------------------------------------
    const d = new RealtimeRaytracer(renderer, {
      restirMCap: 40,    // pinned above the governor's target of 16
      adaptiveQuality: false,
    });
    const took5 = d._takeFreeWins(now());
    const restirMCapPinned = ok(d.restirMCap === 40); // must not be lowered

    // Unpinned case: construct without restirMCap, then set it at runtime
    // (runtime writes do not pin — the governor may still change it).
    const unpinnedMCap = new RealtimeRaytracer(renderer, {
      adaptiveQuality: false,
    });
    unpinnedMCap.restirMCap = 40;
    const tookMCapUnpinned = unpinnedMCap._takeFreeWins(now());
    const restirMCapUnpinnedStillLowers = ok(unpinnedMCap.restirMCap === 16);

    const pass =
      pinnedFalseStays && unpinnedStillTakes && took1ReturnsTrue &&
      unpinnedGetsFreeWins &&
      pinnedTrueNotRecorded && pinnedTrueStays &&
      releaseRestoresUnpinned && releaseDoesNotTouchPinned && releaseReturnsTrue &&
      restirMCapPinned && restirMCapUnpinnedStillLowers;

    emit({
      pass,
      governorScene: true,
      threw: false,
      pinnedFalseStays,
      unpinnedStillTakes,
      took1ReturnsTrue,
      unpinnedGetsFreeWins,
      pinnedTrueNotRecorded,
      pinnedTrueStays,
      releaseRestoresUnpinned,
      releaseDoesNotTouchPinned,
      releaseReturnsTrue,
      restirMCapPinned,
      restirMCapUnpinnedStillLowers,
    });
  } catch (err) {
    emit({
      pass: false,
      governorScene: true,
      threw: true,
      error: String((err && err.message) || err),
    });
  } finally {
    if (renderer) renderer.dispose();
  }
}

/**
 * Quality-presets API check (?selftest=presets).
 *
 * Guards the two contracts the presets round is built on, WITHOUT rendering a
 * scene (pure construction + applyPreset, so it is fast and focused):
 *
 * Emits its verdict into the same #selftest-verdict node the Playwright driver
 * reads (scripts/selftest.mjs), tagged `presetsScene:true`.
 */
async function runPresetsSelftest() {
  const emit = (v) => {
    const line = JSON.stringify({ presetsScene: true, ...v });
    console.log("[selftest:presets] " + line);
    let node = document.getElementById("selftest-verdict");
    if (!node) {
      node = document.createElement("div");
      node.id = "selftest-verdict";
      node.style.cssText =
        "position:fixed;left:-99999px;top:0;white-space:pre;pointer-events:none;";
      document.body.appendChild(node);
    }
    node.textContent = line;
    node.setAttribute("data-pass", String(!!v.pass));
  };

  // Reference snapshot of the 0.11.1 constructor defaults. `read()` below reads
  // exactly these fields off a live instance; string-equality against this
  // object IS the "option values identical to 0.11.1" assertion.
  const DEFAULTS = {
    renderScale: 0.5,
    overscan: 0,
    denoiseIterations: 2,
    denoise: true,
    taa: true,
    taaBlend: 0.1,
    taaJitterScale: 1,
    gi: true,
    giHalfRate: false,
    emissiveNEE: true,
    emissiveImportance: true,
    specular: true,
    reflections: true,
    refraction: true,
    transparency: true,
    absorptionShadows: true,
    kmScattering: false,
    textureTiles: false,
    restir: true,
    restirMCap: 16,
    restirMCapMoving: 16,
    restirWarmAge: 0,
    restirDirectionalBypass: true,
    restirReprojectionRescue: true,
    restirCandidateImportance: true,
    restirClampRel: 2,
    restirSamples: 1,
    restirSampleRadius: 10,
    restirDynamicAccept: false,
    restirDynamicFreeze: false,
    restirGI: false,
    restirGIMCap: 20,
    restirGISpatialTaps: 2,
    restirGIValidate: 8,
    restirGIResolveAlpha: 1.0,
    restirGIConfLow: 0.3,
    restirGIChromaMean: true,
    restirGIVisFallback: true,
    stochasticLights: false,
    adaptiveQuality: true,
    targetFps: 55,
    overloadProtection: true,
    fireflyClamp: 4.0,
    volumetricEnabled: false,
    motionAdaptive: false,
    maxHistory: 48,
    maxHistoryMoving: 6,
    taaBlendMoving: 0.4,
    temporalReprojection: true,
    motionVectors: true,
    ior: 1.5,
    dispersion: 0,
    denoiseMaxStep: 0,
    denoiseStepJitter: 0,
    denoiseWideDamp: 0,
  };

  const read = (rt) => ({
    renderScale: rt.renderScale,
    overscan: rt.overscan,
    denoiseIterations: rt.denoiseIterations,
    denoise: rt.denoise,
    taa: rt.taa,
    taaBlend: rt.taaBlend,
    taaJitterScale: rt.taaJitterScale,
    gi: rt.gi,
    giHalfRate: rt.giHalfRate,
    emissiveNEE: rt.emissiveNEE,
    emissiveImportance: rt.emissiveImportance,
    specular: rt.specular,
    reflections: rt.reflections,
    refraction: rt.refraction,
    transparency: rt.transparency,
    absorptionShadows: rt.absorptionShadows,
    kmScattering: rt.kmScattering,
    textureTiles: rt.textureTiles,
    restir: rt.restir,
    restirMCap: rt.restirMCap,
    restirMCapMoving: rt.restirMCapMoving,
    restirWarmAge: rt.restirWarmAge,
    restirDirectionalBypass: rt.restirDirectionalBypass,
    restirReprojectionRescue: rt.restirReprojectionRescue,
    restirCandidateImportance: rt.restirCandidateImportance,
    restirClampRel: rt.restirClampRel,
    restirSamples: rt.restirSamples,
    restirSampleRadius: rt.restirSampleRadius,
    restirDynamicAccept: rt.restirDynamicAccept,
    restirDynamicFreeze: rt.restirDynamicFreeze,
    restirGI: rt.restirGI,
    restirGIMCap: rt.restirGIMCap,
    restirGISpatialTaps: rt.restirGISpatialTaps,
    restirGIValidate: rt.restirGIValidate,
    restirGIResolveAlpha: rt.restirGIResolveAlpha,
    restirGIConfLow: rt.restirGIConfLow,
    restirGIChromaMean: rt.restirGIChromaMean,
    restirGIVisFallback: rt.restirGIVisFallback,
    stochasticLights: rt.stochasticLights,
    adaptiveQuality: rt.adaptiveQuality,
    targetFps: rt.targetFps,
    overloadProtection: rt.overloadProtection,
    fireflyClamp: rt.fireflyClamp,
    volumetricEnabled: rt.volumetric.enabled,
    motionAdaptive: rt.motionAdaptive,
    maxHistory: rt.maxHistory,
    maxHistoryMoving: rt.maxHistoryMoving,
    taaBlendMoving: rt.taaBlendMoving,
    temporalReprojection: rt.temporalReprojection,
    motionVectors: rt.motionVectors,
    ior: rt.ior,
    dispersion: rt.dispersion,
    denoiseMaxStep: rt.denoiseMaxStep,
    denoiseStepJitter: rt.denoiseStepJitter,
    denoiseWideDamp: rt.denoiseWideDamp,
  });

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(64, 64);
    const supported = RealtimeRaytracer.isSupported(renderer);
    // On a non-GPU machine the constructor bails before any option is applied, so
    // every value assertion is a no-op there (the supported path is what this
    // gate guards; it is the machine the selftest actually runs on).
    const s = (v) => (supported ? v : true);

    // 1. Byte-identity: a fresh instance (no preset) matches the 0.11.1 defaults.
    const a = new RealtimeRaytracer(renderer);
    const before = JSON.stringify(read(a));
    const defaultsMatch = s(before === JSON.stringify(DEFAULTS));

    // 2. applyPreset("balanced") on that fresh instance changes nothing.
    a.applyPreset("balanced");
    const balancedNoop = s(JSON.stringify(read(a)) === before);

    // 3. A constructor with preset:"balanced" equals the bare constructor.
    const b = new RealtimeRaytracer(renderer, { preset: "balanced" });
    const ctorBalanced = s(JSON.stringify(read(b)) === before);

    // 4. Constructor preset applies BEFORE explicit options: explicit wins,
    //    and the rest of the preset still applies.
    const c = new RealtimeRaytracer(renderer, { preset: "performance", renderScale: 0.9 });
    const explicitWins = s(c.renderScale === 0.9);
    const presetStillApplied = s(c.giHalfRate === true && c.stochasticLights === true);

    // 5. applyPreset actually changes the bundled knobs per preset.
    const q = new RealtimeRaytracer(renderer, { preset: "balanced", adaptiveQuality: false });
    q.applyPreset("quality");
    const qualityApplied = s(
      q.renderScale === RealtimeRaytracer.PRESETS.quality.renderScale &&
      q.maxHistory === RealtimeRaytracer.PRESETS.quality.maxHistory &&
      q.giHalfRate === false
    );
    const per = new RealtimeRaytracer(renderer, { preset: "balanced", adaptiveQuality: false });
    per.applyPreset("performance");
    const perfApplied = s(
      per.renderScale === RealtimeRaytracer.PRESETS.performance.renderScale &&
      per.giHalfRate === true &&
      per.volumetric.enabled === false
    );
    const mo = new RealtimeRaytracer(renderer, { preset: "balanced", adaptiveQuality: false });
    mo.applyPreset("motion");
    const motionApplied = s(
      mo.maxHistory === RealtimeRaytracer.PRESETS.motion.maxHistory &&
      mo.fireflyClamp === RealtimeRaytracer.PRESETS.motion.fireflyClamp
    );

    // 6. Unknown name throws, listing the valid presets.
    let threw = null;
    try { a.applyPreset("bogus"); } catch (err) { threw = String((err && err.message) || err); }
    const unknownThrows = s(
      !!threw &&
      threw.includes("quality") && threw.includes("balanced") &&
      threw.includes("performance") && threw.includes("motion")
    );

    // 7. preset getter: constructor option, applyPreset, and the "custom" default.
    const d = new RealtimeRaytracer(renderer, { preset: "quality" });
    const getterCtor = s(d.preset === "quality");
    d.applyPreset("motion");
    const getterApply = s(d.preset === "motion");
    const getterCustom = s(new RealtimeRaytracer(renderer).preset === "custom");

    // 8. PRESETS shape: exactly the four named presets, flat maps of scalar or
    //    plain-object (partial) values  -  no arrays, no nested objects.
    const presetsShape = s(Object.keys(RealtimeRaytracer.PRESETS).sort().join(",") === "balanced,motion,performance,quality");
    const allFlat = s(
      Object.values(RealtimeRaytracer.PRESETS).every((p) =>
        Object.values(p).every((v) => {
          if (v === null || typeof v !== "object") return true;
          if (Array.isArray(v)) return false;
          return Object.values(v).every((x) => typeof x !== "object");
        })
      )
    );

    const pass =
      defaultsMatch && balancedNoop && ctorBalanced && explicitWins && presetStillApplied &&
      qualityApplied && perfApplied && motionApplied && unknownThrows &&
      getterCtor && getterApply && getterCustom && presetsShape && allFlat;

    emit({
      pass,
      presetsScene: true,
      threw: false,
      supported,
      defaultsMatch,
      balancedNoop,
      ctorBalanced,
      explicitWins,
      presetStillApplied,
      qualityApplied,
      perfApplied,
      motionApplied,
      unknownThrows,
      getterCtor,
      getterApply,
      getterCustom,
      presetsShape,
      allFlat,
    });

    for (const inst of [a, b, c, q, per, mo, d]) {
      try { inst.dispose(); } catch { /* ignore */ }
    }
  } catch (err) {
    emit({ pass: false, presetsScene: true, threw: true, error: (err && err.message) || String(err) });
  } finally {
    try { if (renderer) renderer.dispose(); } catch { /* ignore */ }
  }
}

main().catch((err) => {
  console.error(err);
  // A failure during RT setup (shader compile, buffer allocation) on a weaker
  // device shouldn't be a dead end — retry without ray tracing.
  if (!SAFE) { enterSafeMode(err && err.message ? err.message : String(err)); return; }
  if (boot) {
    boot.classList.remove("hidden");
    boot.innerHTML =
      `<div class="err"><b>Failed to start.</b>\n\n${err && err.message ? err.message : err}\n\nSee the console for details.</div>`;
  }
});
