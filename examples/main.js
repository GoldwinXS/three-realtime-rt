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

const boot = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const setBoot = (t) => { if (bootMsg) bootMsg.textContent = t; };

// Compatibility mode: some mobile GPUs (notably iOS Safari's watchdog) kill the
// tab during the heavy RT shader compile or run out of texture memory. When
// that happens we reload with ?safe=1 and render plain rasterized three.js
// instead of crashing the browser.
const SAFE = new URLSearchParams(location.search).has("safe");
let safeModeTriggered = false;
const enterSafeMode = (why) => {
  if (SAFE || safeModeTriggered) return;
  safeModeTriggered = true;
  console.warn("[three-realtime-rt demo] switching to compatibility mode:", why);
  const u = new URL(location.href);
  u.searchParams.set("safe", "1");
  location.replace(u);
};

async function main() {
  // 1. An ordinary three.js scene (coloured room, lights, hero props).
  const { scene, camera, bounds, lights, sky, ready } = buildScene();

  // A Rapier physics playground drops a pool of props onto the ground. Their
  // meshes are plain three.js meshes — we'll hand them to the raytracer as the
  // "dynamic" set so their motion produces correct ray traced shadows.
  setBoot("starting physics…");
  const physics = await Physics.create();
  physics.buildStaticColliders(bounds);
  physics.spawnPool(scene, 40, new THREE.Vector3(2.4, 0, 2.2));

  setBoot("loading models…");
  await ready; // wait for glTF hero models before compiling the BVH

  // 2. Renderer + raytracer. The raytracer takes over lighting; three.js still
  //    rasterizes primary visibility (the G-buffer) for free.
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);
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
    note.textContent = "compatibility mode — ray tracing off on this device (works on desktop)";
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

  const rt = new RealtimeRaytracer(renderer, {
    renderScale: 0.5,   // trace lighting at half res; upsample + TAA reconstruct
    maxHistory: 48,     // shorter history so moving shadows keep up
    envColor: new THREE.Color(0x0a0f18), // low ambient for GI rays that escape the room
    sky,                // (disabled indoors) procedural sky as GI ambient + background
    fog: { enabled: false, color: new THREE.Color(0.5, 0.55, 0.62), density: 0.04 },
  });

  // 3. Compile once. `dynamicMeshes` marks meshes that move every frame — they
  //    get re-baked into the BVH on updateDynamic() (see the loop below).
  setBoot("building BVH…");
  const t0 = performance.now();
  rt.compileScene(scene, { dynamicMeshes: physics.meshes });
  console.log(
    `[three-realtime-rt] compiled in ${Math.round(performance.now() - t0)}ms: ` +
      `${rt.compiled.triangleCount.toLocaleString()} tris ` +
      `(${physics.meshes.length} dynamic), ${rt.compiled.lightCount} lights`
  );

  // Expose for debugging / automated verification.
  Object.assign(window, { RT: rt, SCENE: scene, CAMERA: camera, PHYSICS: physics });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.2, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.5; // stay above the ground
  controls.minDistance = 4;
  controls.maxDistance = 40;
  controls.update();

  // Lights only need re-reading when they actually change, so the UI calls this
  // instead of us polling every frame.
  const refreshLights = () => rt.updateLights(scene);
  const state = { rtEnabled: true, physicsPaused: false };
  const ui = buildUI({ rt, physics, lights, scene, state, refreshLights });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rt.setSize(window.innerWidth, window.innerHeight);
  });

  // 4. Render loop.
  let frames = 0, fps = 0, lastFps = performance.now(), lastT = performance.now();
  let booted = false;

  function animate() {
    if (document.visibilityState === "hidden") setTimeout(animate, 100);
    else requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    controls.update();
    if (!state.physicsPaused) physics.step();

    if (state.rtEnabled) {
      // Only re-bake the BVH while something is actually moving — at rest this
      // whole step (and its BVH upload) is skipped, which is most of the frame.
      try {
        if (!state.physicsPaused && physics.anyAwake()) rt.updateDynamic();
        rt.render(scene, camera); // <- the one call that replaces renderer.render
      } catch (err) {
        enterSafeMode(err && err.message ? err.message : String(err));
        return;
      }
    } else {
      renderer.render(scene, camera);
    }

    if (!booted) { booted = true; boot?.classList.add("hidden"); }

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
