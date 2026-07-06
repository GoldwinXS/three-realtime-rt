import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RealtimeRaytracer } from "../src/index.js";
import { buildScene } from "./scene.js";
import { Physics } from "./physics.js";
import { createWaterfall } from "./waterfall.js";
import { buildUI } from "./ui.js";

// ---------------------------------------------------------------------------
// Scene, physics, water — all ordinary three.js; only the render call is swapped.
// ---------------------------------------------------------------------------
const { scene, camera, bounds, lights, ready } = buildScene();

const waterfall = createWaterfall(scene, {
  x: -6.0,
  backZ: bounds.z * -1 + 0.2,
  floorY: bounds.floorY,
});

const physics = await Physics.create();
physics.buildStaticColliders(bounds);
const pad = new THREE.Vector3(2.6, 0, 3.4);
physics.spawnPool(scene, 40, pad);

await ready; // glTF hero models in place before we compile the BVH

// ---------------------------------------------------------------------------
// Renderer: one extra object vs. vanilla three.js.
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

const rt = new RealtimeRaytracer(renderer, {
  envColor: new THREE.Color(0x0b1119),
  envIntensity: 1.0,
  maxHistory: 48, // shorter history so moving shadows keep up
  fog: { enabled: false, color: new THREE.Color(0.42, 0.52, 0.62), density: 0.05 },
});

const t0 = performance.now();
rt.compileScene(scene, { dynamicMeshes: physics.meshes });
console.log(
  `[three-realtime-rt] compiled in ${Math.round(performance.now() - t0)}ms: ` +
    `${rt.compiled.triangleCount} tris (${physics.meshes.length} dynamic), ` +
    `${rt.compiled.materials.length} materials, ${rt.compiled.lightCount} lights`
);

window.RT = rt;
window.SCENE = scene;
window.CAMERA = camera;
window.PHYSICS = physics;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0.4, 1.3, 0.5);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.52;
controls.minDistance = 3;
controls.maxDistance = 20;
controls.update();

// Shared UI state the render loop reads.
const state = { rtEnabled: true, physicsPaused: false };
const ui = buildUI({ rt, physics, waterfall, lights, scene, state });

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  rt.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------------------------------------------
// Render loop.
// ---------------------------------------------------------------------------
let frames = 0;
let fps = 0;
let lastFpsTime = performance.now();
let lastT = performance.now();

function animate() {
  if (document.visibilityState === "hidden") {
    setTimeout(animate, 100);
  } else {
    requestAnimationFrame(animate);
  }
  const now = performance.now();
  const dt = Math.min((now - lastT) / 1000, 0.05);
  lastT = now;

  controls.update();
  if (!state.physicsPaused) physics.step();
  waterfall.update(dt);

  if (state.rtEnabled) {
    physics.sync(); // ensure mesh matrices are current for the BVH bake
    rt.updateDynamic(); // moving props -> BVH refit (correct RT shadows)
    rt.updateLights(scene); // live light toggles / colours
    rt.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }

  frames++;
  if (now - lastFpsTime >= 500) {
    fps = Math.round((frames * 1000) / (now - lastFpsTime));
    frames = 0;
    lastFpsTime = now;
    ui.setStats(
      `<b>${fps}</b> fps   ·   frame ${rt.frame}\n` +
        `${rt.compiled.triangleCount.toLocaleString()} tris · ${physics.meshes.length} dynamic\n` +
        `${rt.compiled.lightCount} lights · lighting @ ${Math.round(rt.renderScale * 100)}%`
    );
  }
}
animate();
