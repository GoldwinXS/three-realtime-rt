import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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

// Objects
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.85, 0.3, 160, 24),
  new THREE.MeshStandardMaterial({ color: 0xc0c8d0, roughness: 0.35 })
);
knot.position.set(0, 1.6, 0);
scene.add(knot);

const tallBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.4, 3.2, 1.4),
  new THREE.MeshStandardMaterial({ color: 0x8d97a5, roughness: 0.7 })
);
tallBox.position.set(-3.1, 1.6, -2.2);
tallBox.rotation.y = 0.5;
scene.add(tallBox);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.0, 48, 32),
  new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.5 })
);
sphere.position.set(3, 1.0, -1.4);
scene.add(sphere);

const smallBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.MeshStandardMaterial({ color: 0x9c4d7c, roughness: 0.8 })
);
smallBox.position.set(1.3, 0.6, 2.6);
smallBox.rotation.y = -0.4;
scene.add(smallBox);

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
rt.compileScene(scene);
console.log(
  `[three-realtime-rt] compiled: ${rt.compiled.triangleCount} triangles, ` +
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
