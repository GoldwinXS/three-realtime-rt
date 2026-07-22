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

const boot = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const setBoot = (t) => { if (bootMsg) bootMsg.textContent = t; };

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
  // 1. An ordinary three.js scene (coloured room, lights, hero props).
  const { scene, camera, bounds, lights, sky, ready, showcase, water, windows, fox } = buildScene();

  // A Rapier physics playground drops a pool of props onto the ground. Their
  // meshes are plain three.js meshes — we'll hand them to the raytracer as the
  // "dynamic" set so their motion produces correct ray traced shadows.
  setBoot("starting physics…");
  const physics = await Physics.create();
  physics.buildStaticColliders(bounds);
  // The prop pile is opt-in (UI "Spawn pile" button) — the default scene stays
  // clean so the hero pieces and lighting read clearly.

  setBoot("loading models…");
  await ready; // wait for glTF hero models before compiling the BVH

  // 2. Renderer + raytracer. The raytracer takes over lighting; three.js still
  //    rasterizes primary visibility (the G-buffer) for free.
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: SELFTEST });
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
    renderScale: 0.25,
    denoiseIterations: 5,
    stochasticLights: true,
    adaptiveQuality: false,
    gi: false,
    emissiveNEE: false,
    reflections: false,
    refraction: false,
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

  // The dynamic set = the (opt-in) physics pile PLUS the CPU-deformed water
  // pool PLUS the animated fox. The water is flagged rtDeforming in scene.js, so
  // the raytracer reads its live geometry each frame; the fox's SkinnedMesh is
  // auto-detected and CPU-skinned each frame; the physics meshes are rigid movers.
  const dynamicMeshes = () => [...physics.meshes, water.mesh, ...fox.meshes];

  // 3. Compile once. `dynamicMeshes` marks meshes that move every frame — they
  //    get re-baked into the BVH on updateDynamic() (see the loop below).
  setBoot("building BVH…");
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
  controls.target.set(-1.0, 1.8, -2.8); // bias toward the exhibit frieze
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.5; // stay above the ground
  controls.minDistance = 4;
  controls.maxDistance = 40;
  controls.update();

  // Lights only need re-reading when they actually change, so the UI calls this
  // instead of us polling every frame.
  const refreshLights = () => rt.updateLights(scene);
  const state = { rtEnabled: true, physicsPaused: false, waterEnabled: true, foxEnabled: true };

  // The orbiting ceiling light is animated in the loop (below) — find it once.
  const orbitLight = lights.find((l) => l.label === "orbit light").light;

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
    }
    rt.resetAccumulation();
  };

  // Spawn the physics pile on demand and rebuild the BVH with the new
  // dynamic set (a one-time hitch, same as the initial compile).
  const spawnPile = () => {
    if (physics.meshes.length > 0) return;
    physics.spawnPool(scene, 40, new THREE.Vector3(2.6, 0, 2.4));
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
  };
  const ui = buildUI({ rt, physics, lights, scene, state, refreshLights, spawnPile, setFeature, setExtraLights, setWindows, setCanvasScale, canvasScale });

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
  let lastRtEnabled = null; // reconfigure the raster path only on RT on/off edges
  let waterPerfLogged = false; // one-shot updateDynamic() cost probe (water active)

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

    // Sweep the orbiting light when it's on — moving ray traced shadows. Only
    // the (cheap) light-list update is needed; temporal reprojection carries the
    // lighting, so we deliberately do NOT reset accumulation each frame.
    if (orbitLight.visible) {
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
        if (state.waterEnabled || state.foxEnabled || physicsActive) {
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

    if (!booted) { booted = true; boot?.classList.add("hidden"); }

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
