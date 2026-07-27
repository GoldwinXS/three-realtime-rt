/**
 * three-realtime-rt — Kubelka-Munk scattering validation rig.
 *
 * The question this page answers is not "does it look plausible" but "is the
 * number on the screen the number the analytic model predicts". It renders
 * scattering bodies of KNOWN K and S, reads pixels back, and compares them
 * against src/kubelkaMunk.js — the same closed form the shader evaluates,
 * independently implemented in fp64 on the CPU.
 *
 * THE MEASUREMENT. CompositePass writes albedo x irradiance, and for a
 * scattering body the shader has already replaced that irradiance with
 * R * E + T * behind. So a white (albedo 1) Lambert patch under the SAME
 * directional light reads exactly E, and
 *
 *     pixel(body) / pixel(white patch) = R          (when behind is dark)
 *
 * with no exposure, light intensity or unit conversion left in it. Everything
 * that could contaminate that ratio is removed by construction rather than
 * corrected for: the backdrop is black so `behind` contributes nothing, the
 * light is DIRECTIONAL so both patches receive identical irradiance regardless
 * of where they sit, GI is off so no bounce differs between them, and PBR
 * specular is off so no white highlight rides outside the albedo multiply. ACES
 * and the 1/2.2 gamma are inverted exactly (both are invertible below clipping).
 *
 * PHASE 1 — SLAB STAIRCASE. Five slabs of one pigment at 10/20/40/80/160 mm over
 * a black backing. R must rise monotonically with thickness and converge on
 * R_inf = 1/(a + b), per channel, matching the reference at every step. The
 * in-medium chord is computed through Snell for the actual (perspective) view
 * angle, because that is the path the shader measures.
 *
 * PHASE 2 — CURVED GEOMETRY. A sphere of the same pigment, probed along a
 * horizontal line through its centre. Thickness here is not authored anywhere:
 * it is whatever the geometry gives the ray, which is the entire point of
 * measuring it per ray instead of painting a thickness map. For impact parameter
 * b and refractive index n the chord is 2*R*sqrt(1 - (b/(n*R))^2), and the
 * surface normal (hence N.L) is known analytically, so every probe has a
 * predicted reflectance. This also exercises the numerical guards: near the rim
 * the chord goes to zero (b*S*t -> 0, where coth diverges) and at the centre it
 * is longest, so one object sweeps both degenerate ends.
 *
 * Assertions land in #scattering-verdict (data-pass="true|false") for a
 * Playwright driver, with the full comparison table in the JSON. Zero GL errors
 * is part of the gate.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RealtimeRaytracer } from "../src/index.js";
import { kmReflectance, kmReflectanceInfinite, kmAB } from "../src/kubelkaMunk.js";

const statsEl = document.getElementById("stats");

const W = 960, H = 540;
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
document.getElementById("app").appendChild(renderer.domElement);
const gl = renderer.getContext();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 100);

// ---------------------------------------------------------------------------
// The pigment under test
// ---------------------------------------------------------------------------
// S is stated directly and K is derived from the colour + distance pair, so both
// authoring routes are exercised. The values are chosen to give a strongly
// per-channel result (R_inf around 0.42 / 0.64 / 0.54) — a flat grey would pass
// a broken channel-mixing implementation.
const S_RGB = [30, 30, 30];
const K_COLOR = [Math.exp(-12 * 0.25), Math.exp(-3 * 0.25), Math.exp(-6 * 0.25)];
const K_DIST = 0.25;
const K_RGB = K_COLOR.map((c) => -Math.log(Math.max(c, 1e-4)) / K_DIST); // = [12, 3, 6]
const IOR = 1.5;

const pigment = () => {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,      // white: K and S carry the pigment, the composite re-applies this
    roughness: 1.0,       // no sharp highlight to contaminate a probe
    metalness: 0,
    transmission: 1.0,
    ior: IOR,
  });
  m.userData.rtAttenuation = { color: K_COLOR, distance: K_DIST };
  m.userData.rtScattering = { coefficient: S_RGB };
  return m;
};

// A black backing, so the `behind` term contributes nothing measurable and the
// ratio is R over a black backing exactly.
const blackMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1 });
const table = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 5), blackMat);
table.position.y = -0.1;
table.name = "table-black";
scene.add(table);

// The references: white Lambert patches whose pixel value IS the light's
// irradiance term. One per phase, because a phase-1 patch lying flat is seen
// almost edge-on by the phase-2 camera. Each divides its OWN cosine out, so both
// recover the same li and disagreeing would itself be a finding.
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
const whiteFlat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.5), whiteMat);
whiteFlat.position.set(0.85, 0.01, 0.1); // normal +y
whiteFlat.name = "reference-white-flat";
scene.add(whiteFlat);
const whiteUp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.03), whiteMat);
whiteUp.position.set(0.75, 0.275, 1.6); // normal +z, standing on the table
whiteUp.name = "reference-white-upright";
scene.add(whiteUp);

// Phase 1: the slab staircase. Slabs are lifted 10 mm clear of the table so the
// exit interface is unambiguously the slab's own bottom face (a coplanar pair
// would z-fight, and the tracer would measure a chord of zero).
const THICK = [0.01, 0.02, 0.04, 0.08, 0.16];
const slabX = [-1.1, -0.55, 0.0, 0.55, 1.1];
const LIFT = 0.01;
const slabs = THICK.map((t, i) => {
  const s = new THREE.Mesh(new THREE.BoxGeometry(0.45, t, 0.45), pigment());
  s.position.set(slabX[i], LIFT + t / 2, -0.5);
  s.name = `slab-${i}`;
  scene.add(s);
  return s;
});

// Phase 2: a sphere, seated on the table, with a much WEAKER pigment.
//
// It cannot share the slabs' pigment, for a reason that is itself a finding: a
// refracting sphere's chord does not go to zero at the rim. A grazing ray is
// bent inward, and as the impact parameter approaches R the internal angle
// approaches asin(1/n), so the chord floors at 2*R*sqrt(1 - 1/n^2) — about 75%
// of the diameter at ior 1.5. The whole visible disc therefore spans only a
// 34% range of thickness, and the slab pigment (S = 30) is saturated across all
// of it: every probe would read R_inf and the profile would be flat. That would
// LOOK like a pass while testing nothing about thickness.
//
// At S = 1 the same 34% chord range straddles the interesting part of the curve
// instead, so the radial profile has something to be right about.
const S_SPHERE = [1, 1, 1];
const K_SPHERE_COLOR = [Math.exp(-1.6 * 0.25), Math.exp(-0.4 * 0.25), Math.exp(-0.9 * 0.25)];
const K_SPHERE = K_SPHERE_COLOR.map((c) => -Math.log(Math.max(c, 1e-4)) / K_DIST);
const spherePigment = () => {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 1.0, metalness: 0, transmission: 1.0, ior: IOR,
  });
  m.userData.rtAttenuation = { color: K_SPHERE_COLOR, distance: K_DIST };
  m.userData.rtScattering = { coefficient: S_SPHERE };
  return m;
};
const SPHERE_R = 0.25;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(SPHERE_R, 64, 48), spherePigment());
sphere.position.set(0, SPHERE_R, 1.6);
sphere.name = "sphere-pigment";
scene.add(sphere);

// ONE directional light, zero soft radius: every surface with the same normal
// receives identical irradiance, which is what makes the white patch a valid
// exposure reference for the flat slabs.
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(0.0, 4.5, 4.0); // three reads direction from position -> target
sun.userData.rtRadius = 0;
scene.add(sun);
const L = sun.position.clone().normalize(); // unit vector toward the light

const rt = new RealtimeRaytracer(renderer, {
  renderScale: 1.0,
  adaptiveQuality: false,
  stochasticLights: false,
  restir: false,        // deterministic per-light shadow rays
  gi: false,            // no bounce to differ between patch and body
  specular: false,      // no white highlight outside the albedo multiply
  emissiveNEE: false,
  reflections: false,
  refraction: true,     // the scattering view path rides the glass chord
  kmScattering: true,
  taa: false,
  denoise: false,
  envColor: new THREE.Color(0x000000),
  envIntensity: 0,
  // Small scene, small epsilon — and it MUST be passed as an option, not
  // assigned afterwards: the auto-scaler is armed by `options.eps == null` and
  // would overwrite a later assignment on the next compile. It bit this rig
  // first time round: the auto value (9.5 mm here) put the refraction entry
  // point BELOW the 10 mm slab entirely, which read as a black tile.
  //
  // eps bounds the thinnest body that can resolve its own exit face, because the
  // tracer starts the in-medium trace 2*eps inside the surface. At 2 mm the
  // thinnest slab here (10 mm) clears it 2.5x over.
  eps: 2e-3,
});
rt.compileScene(scene);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

Object.assign(window, { RT: rt, SCENE: scene, CAMERA: camera });

// ---------------------------------------------------------------------------
// Probes + display-transform inversion
// ---------------------------------------------------------------------------
const _v = new THREE.Vector3();
function probeAt(wx, wy, wz, radius = 3) {
  _v.set(wx, wy, wz).project(camera);
  const px = Math.round((_v.x * 0.5 + 0.5) * W);
  const py = Math.round((_v.y * 0.5 + 0.5) * H);
  const n = 2 * radius + 1;
  const buf = new Uint8Array(n * n * 4);
  gl.readPixels(px - radius, py - radius, n, n, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < buf.length; i += 4) { r += buf[i]; g += buf[i + 1]; b += buf[i + 2]; }
  const c = buf.length / 4;
  return [r / c, g / c, b / c];
}

// ACES (Narkowicz) then 1/2.2 gamma, both exactly invertible below clipping —
// so a probe can be read as scene-linear radiance rather than a display code.
// A ratio of raw 8-bit values would understate every value, because ACES is
// strongly compressive at the top.
function acesInv(y) {
  if (y >= 0.999) return Infinity; // clipped: carries no information
  if (y <= 0) return 0;
  const a = 2.43 * y - 2.51;
  const b = 0.59 * y - 0.03;
  const c = 0.14 * y;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return Infinity;
  const s = Math.sqrt(disc);
  const roots = [(-b + s) / (2 * a), (-b - s) / (2 * a)].filter((r) => r > 0 && Number.isFinite(r));
  return roots.length ? Math.min(...roots) : Infinity;
}
const toLinear = (v) => acesInv(Math.pow(v / 255, 2.2));
const linRGB = (c) => c.map(toLinear);

// Snell: the in-medium direction is refracted, so a slab of thickness t seen at
// incidence theta has a chord of t / cos(theta_refracted), not t / cos(theta).
function slabChord(t, viewDir, normal) {
  const cosI = Math.abs(viewDir.dot(normal));
  const sinR = Math.sqrt(Math.max(1 - cosI * cosI, 0)) / IOR;
  return t / Math.sqrt(Math.max(1 - sinR * sinR, 1e-6));
}

const R_INF = [0, 1, 2].map((i) => kmReflectanceInfinite(K_RGB[i], S_RGB[i]));
const fmt3 = (a) => a.map((v) => (Number.isFinite(v) ? v.toFixed(3) : "inf")).join("/");

let glErrors = 0;
let frames = 0;
let verdict = null;
let phase = 0;
let phase1 = null;

function postShot(name) {
  try {
    const b64 = renderer.domElement.toDataURL("image/png").split(",")[1];
    fetch(`/__shot?name=${name}`, { method: "POST", body: b64 }).catch(() => {});
  } catch { /* readback unavailable in a production build */ }
}

// --- phase 1: the slab staircase -------------------------------------------
function assertSlabs() {
  // The patch's pixel is li * (N.L); dividing its own cosine out recovers li,
  // the light's irradiance term, which is what every other surface is scaled by.
  const refLin = linRGB(probeAt(whiteFlat.position.x, 0.02, whiteFlat.position.z, 5));
  const li = refLin.map((v) => v / Math.max(L.y, 1e-6));
  const rows = [];
  for (let i = 0; i < slabs.length; i++) {
    const s = slabs[i];
    const topY = LIFT + THICK[i];
    const pt = new THREE.Vector3(s.position.x, topY, s.position.z);
    const viewDir = pt.clone().sub(camera.position).normalize();
    const chord = slabChord(THICK[i], viewDir, new THREE.Vector3(0, 1, 0));
    // Slab tops share the patch's normal, so their irradiance is li * L.y too.
    const raw = probeAt(pt.x, pt.y, pt.z, 3);
    const meas = linRGB(raw).map((v, c) => v / Math.max(li[c] * L.y, 1e-6));
    const pred = [0, 1, 2].map((c) => kmReflectance(K_RGB[c], S_RGB[c], chord, 0));
    rows.push({
      t_mm: Math.round(THICK[i] * 1000),
      raw: raw.map((v) => Math.round(v)),
      chord_mm: +(chord * 1000).toFixed(1),
      measured: meas.map((v) => +v.toFixed(4)),
      predicted: pred.map((v) => +v.toFixed(4)),
      err_pct: meas.map((v, c) => +((v / Math.max(pred[c], 1e-6) - 1) * 100).toFixed(1)),
    });
  }
  // The reference patch has to be unclipped or every ratio is meaningless.
  const refOK = refLin.every((v) => Number.isFinite(v) && v > 0.05);
  // CURVE SHAPE is the real assertion: monotone rise with thickness, per channel,
  // converging on R_inf. Tonemapping and exposure cannot fake this.
  let monotone = true;
  for (let i = 1; i < rows.length; i++) {
    for (let c = 0; c < 3; c++) {
      if (rows[i].measured[c] < rows[i - 1].measured[c] - 0.005) monotone = false;
    }
  }
  const thickest = rows[rows.length - 1].measured;
  const nearInf = [0, 1, 2].every((c) => Math.abs(thickest[c] / R_INF[c] - 1) < 0.2);
  // Absolute agreement, loose enough for readback quantisation and the shader's
  // fp32 vs the reference's fp64, tight enough that a wrong model cannot pass.
  const TOL = 0.12;
  const absOK = rows.every((r) => r.err_pct.every((e) => Math.abs(e) / 100 < TOL));
  const finite = rows.every((r) => r.measured.every((v) => Number.isFinite(v) && v >= 0 && v <= 1.05));
  phase1 = {
    pass: refOK && monotone && nearInf && absOK && finite,
    refOK, monotone, nearInf, absOK, finite,
    refLinear: refLin.map((v) => +v.toFixed(4)),
    li: li.map((v) => +v.toFixed(4)),
    rInf: R_INF.map((v) => +v.toFixed(4)),
    rows,
  };
  return phase1;
}

// --- phase 2: the sphere radial profile ------------------------------------
function assertSphere() {
  const C = sphere.position;
  const refLin = linRGB(probeAt(whiteUp.position.x, 0.35, whiteUp.position.z + 0.02, 4));
  const li = refLin.map((v) => v / Math.max(L.z, 1e-6)); // upright patch: normal +z
  // Impact parameters as a fraction of the radius, from the centre out to a rim
  // well inside the silhouette (the outermost band is a few pixels wide and
  // would average in the background).
  const FRACS = [0.0, 0.3, 0.55, 0.75, 0.9];
  const rows = [];
  // The probe line is horizontal through the sphere centre and perpendicular to
  // the view, so the impact parameter is a plain world-space x offset.
  for (const f of FRACS) {
    const b = f * SPHERE_R;
    // Front-surface hit point for this impact parameter, and its normal.
    const nx = b / SPHERE_R;
    const nz = Math.sqrt(Math.max(1 - nx * nx, 0)); // toward the camera (+z)
    const nrm = new THREE.Vector3(nx, 0, nz);
    const pt = C.clone().add(nrm.clone().multiplyScalar(SPHERE_R));
    // Chord through a sphere with refraction: 2*R*sqrt(1 - (b/(n*R))^2), exact by
    // symmetry (the ray enters and leaves at the same angle).
    const sinR = nx / IOR;
    const chord = 2 * SPHERE_R * Math.sqrt(Math.max(1 - sinR * sinR, 0));
    const NdotL = Math.max(nrm.dot(L), 0);
    const meas = linRGB(probeAt(pt.x, pt.y, pt.z, 2));
    // Irradiance at this point: the same li, scaled by this point's own cosine.
    const E = li.map((v) => v * NdotL);
    const ratio = meas.map((v, c) => v / Math.max(E[c], 1e-6));
    const pred = [0, 1, 2].map((c) => kmReflectance(K_SPHERE[c], S_SPHERE[c], chord, 0));
    rows.push({
      b_over_R: f,
      chord_mm: +(chord * 1000).toFixed(1),
      NdotL: +NdotL.toFixed(3),
      measured: ratio.map((v) => +v.toFixed(4)),
      predicted: pred.map((v) => +v.toFixed(4)),
      err_pct: ratio.map((v, c) => +((v / Math.max(pred[c], 1e-6) - 1) * 100).toFixed(1)),
    });
  }
  // GUARDS. Nothing on a curved body may produce a NaN, a negative, or a value
  // above 1 — the rim is where the chord collapses toward zero and the textbook
  // expressions divide by it.
  const finite = rows.every((r) => r.measured.every((v) => Number.isFinite(v) && v >= -0.02 && v <= 1.1));
  // THE CURVED-GEOMETRY CLAIM: thickness is measured per ray from the real
  // geometry, so reflectance must FALL from centre to rim as the chord shortens,
  // monotonically, with no thickness map anywhere in the scene. The green channel
  // is the sensitive one here (its K/S puts it on the steepest part of the curve).
  const centre = rows[0].measured;
  const rim = rows[rows.length - 1].measured;
  const thickerIsBrighter = centre[1] > rim[1] + 0.02;
  let monotoneFalloff = true;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].measured[1] > rows[i - 1].measured[1] + 0.006) monotoneFalloff = false;
  }
  const TOL = 0.2; // looser than the flat case: the cosine correction is analytic
  const absOK = rows.every((r) => r.err_pct.every((e) => Math.abs(e) / 100 < TOL));
  // A whole-silhouette scan for blown-out or NaN pixels, which is what a bad
  // guard actually looks like on screen.
  const box = new THREE.Box3().setFromObject(sphere);
  const corners = [];
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) {
    corners.push(new THREE.Vector3(x, y, C.z).project(camera));
  }
  const xs = corners.map((c) => (c.x * 0.5 + 0.5) * W);
  const ys = corners.map((c) => (c.y * 0.5 + 0.5) * H);
  const x0 = Math.max(0, Math.floor(Math.min(...xs)) - 4);
  const y0 = Math.max(0, Math.floor(Math.min(...ys)) - 4);
  const bw = Math.min(W - x0, Math.ceil(Math.max(...xs) - Math.min(...xs)) + 8);
  const bh = Math.min(H - y0, Math.ceil(Math.max(...ys) - Math.min(...ys)) + 8);
  const scan = new Uint8Array(bw * bh * 4);
  gl.readPixels(x0, y0, bw, bh, gl.RGBA, gl.UNSIGNED_BYTE, scan);
  let blown = 0;
  for (let i = 0; i < scan.length; i += 4) {
    if (scan[i] >= 254 && scan[i + 1] >= 254 && scan[i + 2] >= 254) blown++;
  }
  const blownFrac = blown / (bw * bh);
  return {
    pass: finite && thickerIsBrighter && monotoneFalloff && absOK && blownFrac < 0.01,
    finite, thickerIsBrighter, monotoneFalloff, absOK,
    K: K_SPHERE.map((v) => +v.toFixed(3)),
    S: S_SPHERE,
    chordFloorNote: "a refracting sphere's chord floors at 2R*sqrt(1 - 1/ior^2)",
    li: li.map((v) => +v.toFixed(4)),
    blownPixels: blown,
    scanPixels: bw * bh,
    rows,
  };
}

// ---------------------------------------------------------------------------
// Frames + phases
// ---------------------------------------------------------------------------
const P1_FRAME = 90;
const P2_FRAME = 200;

function frameSlabs() {
  camera.position.set(0.0, 2.4, 1.4);
  camera.lookAt(0, 0, -0.4);
  controls.target.set(0, 0, -0.4);
  camera.updateMatrixWorld();
  controls.update();
}
function frameSphere() {
  // Straight down -z at the sphere's centre height: the probe line along world x
  // is then exactly perpendicular to the view, so a probe's x offset IS its
  // impact parameter and the chord formula is exact rather than fitted.
  camera.position.set(0.0, SPHERE_R, 3.3);
  camera.lookAt(0, SPHERE_R, 1.6);
  controls.target.set(0, SPHERE_R, 1.6);
  camera.updateMatrixWorld();
  controls.update();
}
frameSlabs();

let sphereResult = null;

function tick() {
  requestAnimationFrame(tick);
  controls.update();
  rt.render(scene, camera);
  frames++;
  if (frames % 10 === 0 && gl.getError() !== 0) glErrors++;

  if (phase === 0 && frames === P1_FRAME) {
    assertSlabs();
    postShot("scattering-slabs");
    phase = 1;
    frameSphere();
    rt.resetAccumulation();
  } else if (phase === 1 && frames === P2_FRAME) {
    sphereResult = assertSphere();
    postShot("scattering-sphere");
    phase = 2;
    verdict = {
      pass: !!(phase1 && phase1.pass && sphereResult.pass && glErrors === 0),
      scatteringActive: !!(rt.compiled && rt.compiled.scattering),
      scatteringCount: rt.compiled && rt.compiled.scattering ? rt.compiled.scattering.count : 0,
      K: K_RGB.map((v) => +v.toFixed(3)),
      S: S_RGB,
      rInf: R_INF.map((v) => +v.toFixed(4)),
      glErrors,
      slabs: phase1,
      sphere: sphereResult,
    };
    const el = document.createElement("div");
    el.id = "scattering-verdict";
    el.style.display = "none";
    el.dataset.pass = String(verdict.pass);
    el.textContent = JSON.stringify(verdict);
    document.body.appendChild(el);
    console.log("[scattering] " + JSON.stringify(verdict));
  }

  if (frames % 15 === 0) {
    const lines = [
      `frame ${frames}   phase ${phase}   gl errors ${glErrors}`,
      `K ${fmt3(K_RGB)}   S ${fmt3(S_RGB)}   R_inf ${fmt3(R_INF)}`,
      `a ${fmt3([0, 1, 2].map((i) => kmAB(K_RGB[i], S_RGB[i]).a))}`,
    ];
    if (phase1) {
      lines.push("", "slab   chord   measured R          predicted R         err %");
      for (const r of phase1.rows) {
        lines.push(
          `${String(r.t_mm).padStart(4)}mm ${String(r.chord_mm).padStart(6)}  ` +
          `${fmt3(r.measured)}  ${fmt3(r.predicted)}  ${r.err_pct.join("/")}`
        );
      }
      lines.push(`verdict: ${phase1.pass ? "PASS" : "FAIL"}`);
    }
    if (sphereResult) {
      lines.push("", "b/R    chord   measured R          predicted R         err %");
      for (const r of sphereResult.rows) {
        lines.push(
          `${r.b_over_R.toFixed(2)}  ${String(r.chord_mm).padStart(6)}  ` +
          `${fmt3(r.measured)}  ${fmt3(r.predicted)}  ${r.err_pct.join("/")}`
        );
      }
      lines.push(`verdict: ${sphereResult.pass ? "PASS" : "FAIL"}  blown ${sphereResult.blownPixels}`);
    }
    statsEl.textContent = lines.join("\n");
  }
}
tick();
