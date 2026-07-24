/**
 * three-realtime-rt — world-space 3D-texture albedo ("volumetric surface albedo").
 *
 * A torus knot is coloured by a procedurally generated 3D scalar field (smooth
 * value noise, colour-mapped to a turbo-style gradient) baked into a
 * THREE.Data3DTexture. The tracer samples that texture at the world-space HIT
 * POINT for the surface's albedo — in BOTH primary visibility (the G-buffer, so
 * the raster/hybrid view agrees) and the traced GI / reflection bounces — so the
 * field's colours bleed onto the white walls and floor through global illumination.
 *
 * This is the same mechanism scientific / medical tools use to paint a volumetric
 * data field (stress, temperature, density) onto a surface in a path tracer, where
 * a custom fragment shader can't run. The library samples an ALREADY-colourmapped
 * RGB texture; no colormap logic lives inside the tracer.
 *
 *   material.userData.rtVolumeAlbedo = { texture, origin, size };
 *
 * origin = world position of the texel-(0,0,0) corner, size = world extent of the
 * whole volume. uvw = clamp((hitPoint - origin) / size, 0, 1), trilinear.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RealtimeRaytracer } from "../src/index.js";

const statsEl = document.getElementById("stats");
const rtBtn = document.getElementById("rt-toggle");
const viewSel = document.getElementById("view-pick");
const spinBox = document.getElementById("opt-spin");

// ---------------------------------------------------------------------------
// Procedural 3D field -> colour-mapped Data3DTexture
// ---------------------------------------------------------------------------

// Deterministic 3D value-noise lattice, trilinearly interpolated with a
// smoothstep fade — organic, band-free blobs that read as a "data field".
function hash3(ix, iy, iz) {
  let n = (ix * 374761393 + iy * 668265263 + iz * 1442695040) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  n = n ^ (n >>> 16);
  return ((n >>> 0) % 100000) / 100000; // [0,1)
}
function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function valueNoise(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = smootherstep(x - ix), fy = smootherstep(y - iy), fz = smootherstep(z - iz);
  const c000 = hash3(ix, iy, iz), c100 = hash3(ix + 1, iy, iz);
  const c010 = hash3(ix, iy + 1, iz), c110 = hash3(ix + 1, iy + 1, iz);
  const c001 = hash3(ix, iy, iz + 1), c101 = hash3(ix + 1, iy, iz + 1);
  const c011 = hash3(ix, iy + 1, iz + 1), c111 = hash3(ix + 1, iy + 1, iz + 1);
  const x00 = c000 + (c100 - c000) * fx, x10 = c010 + (c110 - c010) * fx;
  const x01 = c001 + (c101 - c001) * fx, x11 = c011 + (c111 - c011) * fx;
  const y0 = x00 + (x10 - x00) * fy, y1 = x01 + (x11 - x01) * fy;
  return y0 + (y1 - y0) * fz;
}
function fbm(x, y, z) {
  let sum = 0, amp = 0.5, freq = 1, norm = 0;
  for (let o = 0; o < 4; o++) {
    sum += amp * valueNoise(x * freq, y * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm; // ~[0,1]
}

// Compact "turbo"-style colormap (deep blue -> cyan -> green -> yellow -> red)
// over five anchors. Values are used directly as LINEAR albedo, so the tracer's
// composite tint/GI bleed reads as the mapped colour.
const TURBO = [
  [0.19, 0.07, 0.23],
  [0.10, 0.55, 0.85],
  [0.15, 0.80, 0.30],
  [0.95, 0.85, 0.12],
  [0.90, 0.16, 0.12],
];
function colormap(t) {
  t = Math.min(1, Math.max(0, t));
  const s = t * (TURBO.length - 1);
  const i = Math.min(TURBO.length - 2, Math.floor(s));
  const f = s - i;
  const a = TURBO[i], b = TURBO[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

// Bake the field into an N^3 RGBA8 Data3DTexture. The scalar combines a smooth
// radial gradient (so the field clearly varies across the knot) with fbm detail.
function makeFieldTexture(N = 64) {
  const data = new Uint8Array(N * N * N * 4);
  let p = 0;
  for (let z = 0; z < N; z++) {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const u = x / (N - 1), v = y / (N - 1), w = z / (N - 1);
        // Centred radius (0 at centre, ~1 at corners) + swirling fbm detail.
        const dx = u - 0.5, dy = v - 0.5, dz = w - 0.5;
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz) * 1.9;
        const n = fbm(u * 3.5, v * 3.5, w * 3.5);
        let s = 0.55 * r + 0.75 * n; // blend radial + noise
        s = Math.min(1, Math.max(0, s));
        const c = colormap(s);
        data[p++] = Math.round(c[0] * 255);
        data[p++] = Math.round(c[1] * 255);
        data[p++] = Math.round(c[2] * 255);
        data[p++] = 255;
      }
    }
  }
  const tex = new THREE.Data3DTexture(data, N, N, N);
  tex.format = THREE.RGBAFormat;
  tex.type = THREE.UnsignedByteType;
  // The library sets Linear filtering + ClampToEdge on compile, but set them here
  // too so the texture is correct even outside this tracer.
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2.9, 2.4, 7.0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.6, 0);
controls.enableDamping = true;

// White-ish room (floor + two walls) to catch the field's colour bleed through GI.
const wallMat = () => new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.85, metalness: 0 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), wallMat());
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.4;
scene.add(floor);
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), wallMat());
backWall.position.set(0, 6.6, -4.2);
scene.add(backWall);
const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 16), wallMat());
sideWall.rotation.y = Math.PI / 2;
sideWall.position.set(-4.2, 6.6, 0);
scene.add(sideWall);

// The field-coloured hero: a torus knot. Its material's base colour is irrelevant
// (the volume texture replaces albedo); roughness/metalness still compose normally.
const knotGeo = new THREE.TorusKnotGeometry(1.35, 0.42, 220, 32);
const knotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.0 });
const knot = new THREE.Mesh(knotGeo, knotMat);
knot.position.set(0, 0.7, 0);
scene.add(knot);

// World-space bounds of the knot -> the volume transform. origin = min corner of
// the (slightly padded) world AABB, size = its extent. The field then fills the
// mesh exactly, so the whole knot is coloured.
knot.updateMatrixWorld(true);
const box = new THREE.Box3().setFromObject(knot);
const pad = 0.02;
const origin = box.min.clone().addScalar(-pad);
const size = box.getSize(new THREE.Vector3()).addScalar(2 * pad);

const fieldTex = makeFieldTexture(64);
knotMat.userData.rtVolumeAlbedo = { texture: fieldTex, origin, size };

// A warm emissive panel above the knot: a real area light (NEE), so the knot is
// lit and its field colours bounce onto the walls/floor through 1-bounce GI.
const panel = new THREE.Mesh(
  new THREE.PlaneGeometry(4.5, 4.5),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(1.0, 0.93, 0.82),
    emissiveIntensity: 6.0,
    roughness: 1,
  })
);
panel.rotation.x = Math.PI / 2; // face down
panel.position.set(1.5, 6.0, 1.5);
scene.add(panel);

// A dim fill point light so the shadow side of the knot still reads.
const fill = new THREE.PointLight(0xffffff, 12);
fill.position.set(4, 3, 5);
scene.add(fill);

// ---------------------------------------------------------------------------
// Raytracer
// ---------------------------------------------------------------------------

const rt = new RealtimeRaytracer(renderer, {
  ...RealtimeRaytracer.recommendedOptions(RealtimeRaytracer.detectTier(renderer)),
  envColor: new THREE.Color(0.05, 0.06, 0.08),
  envIntensity: 1.0,
  restir: true, // emissive area light -> keep ReSTIR on (README caveat)
});
rt.compileScene(scene);

let rtOn = true;
rtBtn.addEventListener("click", () => {
  rtOn = !rtOn;
  rtBtn.textContent = `ray tracing: ${rtOn ? "ON" : "OFF"}`;
  rtBtn.classList.toggle("on", rtOn);
  rt.resetAccumulation();
});
viewSel.addEventListener("change", () => {
  rt.outputMode = parseInt(viewSel.value, 10);
  rt.resetAccumulation();
});

addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const db = renderer.getDrawingBufferSize(new THREE.Vector2());
  rt.setSize(db.x, db.y);
});

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------

let last = performance.now();
let fps = 0;
function loop() {
  requestAnimationFrame(loop);
  const now = performance.now();
  const dt = now - last;
  last = now;
  fps = fps * 0.9 + (1000 / Math.max(dt, 1e-3)) * 0.1;

  controls.update();

  if (spinBox.checked) {
    knot.rotation.y += dt * 0.0004;
    // The knot rotates, but its volume transform is the STATIC world AABB set at
    // compile time — so the field stays fixed in WORLD space and the knot appears
    // to move THROUGH the coloured field (a deliberate, legible demonstration
    // that albedo is sampled at the world hit point). Hold spin off to inspect a
    // fixed mapping.
  }

  if (rtOn) rt.render(scene, camera);
  else renderer.render(scene, camera);

  if (statsEl) {
    const secondary = rt.compiled && rt.compiled.volumeAlbedo && rt._maxFragTexUnits >= 17;
    statsEl.textContent =
      `${fps.toFixed(0)} fps\n` +
      `volume: ${rt.compiled && rt.compiled.volumeAlbedo ? "on" : "off"}` +
      `  bounces: ${secondary ? "field" : "flat"}\n` +
      `tex units: ${rt._maxFragTexUnits}`;
  }
}
loop();
