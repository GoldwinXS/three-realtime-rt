import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";
import { RealtimeRaytracer } from "../src/index.js";

// ---------------------------------------------------------------------------
// A completely ordinary three.js scene — nothing here knows about ray tracing.
// ---------------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070c);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5.5, 3.5, 7);

// Ground + back walls form a partial box so GI has something to bounce off.
const white = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.9 });
const orange = new THREE.MeshStandardMaterial({ color: 0xd96a1e, roughness: 0.85 });
const teal = new THREE.MeshStandardMaterial({ color: 0x1e8f8a, roughness: 0.85 });

const ground = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 14), white);
ground.position.y = -0.1;
scene.add(ground);

const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 0.2), white);
backWall.position.set(0, 3, -7);
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 14), orange);
leftWall.position.set(-7, 3, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 14), teal);
rightWall.position.set(7, 3, 0);
scene.add(rightWall);

// --- objects: a mix of procedural geometry and real glTF models -------------

// Pedestals for the showcase pieces.
function pedestal(x, z, height = 1.0) {
  const p = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1.05, height, 48),
    new THREE.MeshStandardMaterial({ color: 0x777d88, roughness: 0.6 })
  );
  p.position.set(x, height / 2, z);
  scene.add(p);
  return p;
}

// Classic Utah teapot, heavily tessellated.
const teapot = new THREE.Mesh(
  new TeapotGeometry(0.8, 24),
  new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.4 })
);
pedestal(3.4, -2.2);
teapot.position.set(3.4, 1.8, -2.2);
scene.add(teapot);

// Torus knot family.
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.7, 0.24, 200, 32),
  new THREE.MeshStandardMaterial({ color: 0xc0c8d0, roughness: 0.35 })
);
pedestal(0, 0, 0.8);
knot.position.set(0, 1.9, 0);
scene.add(knot);

const knot2 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.5, 0.18, 180, 28, 3, 7),
  new THREE.MeshStandardMaterial({ color: 0x9c4d7c, roughness: 0.55 })
);
knot2.position.set(-4.6, 0.75, 2.8);
scene.add(knot2);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.9, 64, 48),
  new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.5 })
);
sphere.position.set(4.6, 0.9, 2.4);
scene.add(sphere);

// glTF models: completely standard three.js loading — the raytracer picks
// them (and their textures/materials) up automatically at compileScene time.
async function loadModels() {
  const loader = new GLTFLoader();
  const load = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));

  const [helmet, duck, lantern] = await Promise.all([
    load("/examples/assets/DamagedHelmet.glb"),
    load("/examples/assets/Duck.glb"),
    load("/examples/assets/Lantern.glb"),
  ]);

  helmet.scene.scale.setScalar(1.4);
  helmet.scene.position.set(-2.6, 2.4, -1.6);
  helmet.scene.rotation.y = 0.7;
  pedestal(-2.6, -1.6, 1.4);
  scene.add(helmet.scene);

  duck.scene.scale.setScalar(0.9);
  duck.scene.position.set(1.6, 0.0, 3.2);
  duck.scene.rotation.y = -0.9;
  scene.add(duck.scene);

  lantern.scene.scale.setScalar(0.22);
  lantern.scene.position.set(-5.6, 0, -4.6);
  scene.add(lantern.scene);
}

// An emissive panel — lights the scene through GI alone (no three.js light attached).
const emissivePanel = new THREE.Mesh(
  new THREE.BoxGeometry(2.4, 1.4, 0.1),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xfff2d8,
    emissiveIntensity: 6,
  })
);
emissivePanel.position.set(-2.2, 2.2, -6.85);
scene.add(emissivePanel);

// Ordinary three.js lights — picked up automatically by the raytracer.
const warm = new THREE.PointLight(0xffd9a0, 13);
warm.position.set(-3.5, 4.6, 3.2);
warm.userData.rtRadius = 0.35; // soft shadow size (rt extension parameter)
scene.add(warm);

const cool = new THREE.PointLight(0x9fc4ff, 9);
cool.position.set(4.2, 5.2, 1.8);
cool.userData.rtRadius = 0.3;
scene.add(cool);

const sun = new THREE.DirectionalLight(0xfff4e0, 0.7);
sun.position.set(6, 10, 4);
sun.target.position.set(0, 0, 0);
sun.userData.rtRadius = 0.03;
scene.add(sun);
scene.add(sun.target);

// ---------------------------------------------------------------------------
// Renderer setup: one extra line vs. vanilla three.js.
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

const rt = new RealtimeRaytracer(renderer, {
  envColor: new THREE.Color(0x0a0f18),
  envIntensity: 1.0,
});

await loadModels();
const t0 = performance.now();
rt.compileScene(scene);
const compileMs = Math.round(performance.now() - t0);
console.log(
  `[three-realtime-rt] compiled in ${compileMs}ms: ${rt.compiled.triangleCount} triangles, ` +
    `${rt.compiled.materials.length} materials, ${rt.compiled.lightCount} lights`
);
// for automated verification/debugging
window.RT = rt;
window.SCENE = scene;
window.CAMERA = camera;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.2, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.update();

// HUD
const rtToggle = document.getElementById("rtToggle");
const reprojToggle = document.getElementById("reprojToggle");
const viewMode = document.getElementById("viewMode");
const statsEl = document.getElementById("stats");
viewMode.addEventListener("change", () => {
  rt.outputMode = parseInt(viewMode.value, 10);
});
reprojToggle.addEventListener("change", () => {
  rt.temporalReprojection = reprojToggle.checked;
});
const denoiseToggle = document.getElementById("denoiseToggle");
denoiseToggle.addEventListener("change", () => {
  rt.denoise = denoiseToggle.checked;
});
const scaleMode = document.getElementById("scaleMode");
scaleMode.addEventListener("change", () => {
  rt.renderScale = parseFloat(scaleMode.value);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  rt.setSize(window.innerWidth, window.innerHeight);
});

// FPS
let frames = 0;
let fps = 0;
let lastFpsTime = performance.now();

function animate() {
  // rAF pauses in hidden tabs; fall back to a timer so headless/preview keeps rendering
  if (document.visibilityState === "hidden") {
    setTimeout(animate, 100);
  } else {
    requestAnimationFrame(animate);
  }
  controls.update();

  if (rtToggle.checked) {
    rt.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }

  frames++;
  const now = performance.now();
  if (now - lastFpsTime >= 1000) {
    fps = frames;
    frames = 0;
    lastFpsTime = now;
    statsEl.textContent =
      `${fps} fps\n` +
      `frame ${rt.frame}\n` +
      `tris ${rt.compiled ? rt.compiled.triangleCount : 0}`;
  }
}
animate();
