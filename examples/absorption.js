/**
 * three-realtime-rt — Beer-Lambert absorption regression rig ("tinted glass").
 *
 * A museum lightbox: a flat emissive panel as the tabletop, with cast-glass
 * slabs lying on it. Because the background seen THROUGH each slab is emissive
 * (self-lit, immune to the engine's opaque glass shadows), the transmitted
 * radiance is very nearly `Le * exp(-sigma * thickness)` — the cleanest
 * possible readout of the absorption math. Exhibits:
 *
 *   - a staircase of four amber slabs, thickness doubling 20/40/80/160 mm:
 *     luminance must fall and the colour must saturate toward the
 *     attenuationColor as thickness grows (blue dies fastest through amber)
 *   - a blue-on-amber two-slab stack plus a lone blue and a lone amber slab of
 *     the same thickness: the stack must differ from both singles (and be
 *     darker — the compounding direction). Honest caveat, and what the numbers
 *     actually show: the second body of a stack resolves via the engine's ONE
 *     behind-trace as a lit SURFACE (not a traced medium), and glass occludes
 *     shadow rays fully — so the overlap region reads near-black (the amber
 *     top sits in the blue slab's opaque shadow). Both are documented library
 *     limits; the assertion pins the behaviour rather than pretending
 *     two-medium compounding exists.
 *   - a BACKLIT standing slab: an emissive panel behind amber glass, with an
 *     identical uncovered reference panel beside it. The covered panel's glow
 *     must come through visibly but tinted (blue/red ratio crushed vs. the
 *     reference) — backlit media tint for free because the glow rides the
 *     refracted view segment.
 *
 * Slab thicknesses are centimetres, not the millimetres of real table glass:
 * the tracer's refraction entry offset is 2 x rt.eps, so media thinner than
 * that cannot resolve an exit interface (rt.eps is pinned to 2e-3 here and the
 * thinnest slab is 20 mm — 5x clear). Assertions run automatically after the
 * accumulator settles and land in #absorption-verdict (data-pass="true|false")
 * for the Playwright driver; a canvas screenshot is POSTed to the dev server's
 * /__shot sink. Zero GL errors is part of the gate.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RealtimeRaytracer } from "../src/index.js";

const statsEl = document.getElementById("stats");

const W = 960, H = 540;
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
document.getElementById("app").appendChild(renderer.domElement);
const gl = renderer.getContext();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0e14);
const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 100);
camera.position.set(0, 2.6, 3.2);
camera.lookAt(0, 0.2, 0);
camera.updateMatrixWorld();

// ---------------------------------------------------------------------------
// Scene: the lightbox table and its glass exhibits
// ---------------------------------------------------------------------------

// The lightbox: an emissive plane as the tabletop. Intensity is chosen so the
// BARE panel reads bright but below the 8-bit clip — the staircase ratios are
// meaningless if the thin slabs saturate (asserted below).
const lightbox = new THREE.Mesh(
  new THREE.PlaneGeometry(5.0, 2.2),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xffffff,
    emissiveIntensity: 1.6,
    roughness: 1,
  })
);
lightbox.rotation.x = -Math.PI / 2;
scene.add(lightbox);

// A dim fill light so non-emissive surroundings aren't pure black.
const fill = new THREE.PointLight(0xffffff, 8);
fill.position.set(3, 4, 3);
scene.add(fill);

// Cast glass: white albedo on purpose — the composite re-multiplies the glass
// pixel's radiance by the material's albedo, and a white albedo keeps that an
// identity so the probes read the Beer-Lambert factor alone.
const castGlass = (attColor, attDist) =>
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.04,
    metalness: 0,
    transmission: 1.0,
    ior: 1.5,
    attenuationColor: new THREE.Color(...attColor),
    attenuationDistance: attDist,
  });
// Amber passes red, eats green somewhat, eats blue hard; blue is the mirror.
const amber = castGlass([1.0, 0.55, 0.25], 0.04);
const blue = castGlass([0.35, 0.62, 1.0], 0.04);

const SLAB = 0.5; // footprint (m)
const LIFT = 0.003; // slabs float 3 mm above the lightbox: no coplanar exit faces
function slab(mat, t, x, z, y = null) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(SLAB, t, SLAB), mat);
  m.position.set(x, y ?? LIFT + t / 2, z);
  scene.add(m);
  return m;
}

// Front row: the amber staircase (thickness doubles), then the lone singles
// that pair with the stack behind them.
const THICK = [0.02, 0.04, 0.08, 0.16];
const stairX = [-1.9, -1.25, -0.6, 0.05];
THICK.forEach((t, i) => slab(amber, t, stairX[i], 0.45));
const LONE_T = 0.06;
slab(amber, LONE_T, 0.85, 0.45);
slab(blue, LONE_T, 1.6, 0.45);

// Back row: the blue-on-amber stack (blue floats 20 mm above the amber).
slab(amber, LONE_T, -0.9, -0.45);
slab(blue, LONE_T, -0.9, -0.45, LIFT + LONE_T + 0.02 + LONE_T / 2);

// Backlit exhibit: an emissive panel standing behind an amber pane, plus an
// identical UNCOVERED reference panel beside it.
// Intensity sits well below the 8-bit clip on purpose: at 2.2 the bare panel
// AND the red/green of the covered one all saturated at ~246, hiding the tint
// (measured) — ratios only mean something with headroom, asserted below.
const panelMat = new THREE.MeshStandardMaterial({
  color: 0x000000,
  emissive: 0xffffff,
  emissiveIntensity: 0.55,
  roughness: 1,
});
const mkPanel = (x) => {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), panelMat);
  p.position.set(x, 0.42, -0.45);
  scene.add(p);
  return p;
};
mkPanel(1.1); // covered by the pane below
mkPanel(1.85); // bare reference
const pane = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.06), amber);
pane.position.set(1.1, 0.42, -0.33); // 90 mm of air in front of its panel
scene.add(pane);

// ---------------------------------------------------------------------------
// Raytracer
// ---------------------------------------------------------------------------

const rt = new RealtimeRaytracer(renderer, {
  renderScale: 1.0,
  gi: false, // direct + emissive only: the lightbox does the lighting
  emissiveNEE: true,
  restir: true, // emissive-heavy scene (README caveat)
  reflections: false,
  refraction: true,
  adaptiveQuality: false,
  envColor: new THREE.Color(0x0b0e14),
});
rt.compileScene(scene);
// Pin the ray-offset epsilon: the auto value scales with the scene diagonal and
// the refraction entry offset is 2 x eps — the 20 mm slab needs it small.
rt.eps = 2e-3;
window.RT = rt; // driver/debug surface

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.2, 0);
controls.enableDamping = true;

// ---------------------------------------------------------------------------
// Probes + verdict
// ---------------------------------------------------------------------------

// Average an 11x11 patch of the freshly rendered drawing buffer around the
// projection of a world point. readPixels is bottom-origin, matching NDC.
const _v = new THREE.Vector3();
function probe(wx, wy, wz) {
  _v.set(wx, wy, wz).project(camera);
  const px = Math.round((_v.x * 0.5 + 0.5) * W);
  const py = Math.round((_v.y * 0.5 + 0.5) * H);
  const R = 5;
  const buf = new Uint8Array((2 * R + 1) * (2 * R + 1) * 4);
  gl.readPixels(px - R, py - R, 2 * R + 1, 2 * R + 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  let r = 0, g = 0, b = 0;
  const n = buf.length / 4;
  for (let i = 0; i < buf.length; i += 4) { r += buf[i]; g += buf[i + 1]; b += buf[i + 2]; }
  return [r / n, g / n, b / n];
}
const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
const rgbDist = (a, b) =>
  (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])) / 3;

let glErrors = 0;
let frames = 0;
let verdict = null;

function assertNow() {
  // Slab tops sit at LIFT + t; probe just inside each footprint centre.
  const stair = THICK.map((t, i) => probe(stairX[i], LIFT + t, 0.45));
  const bare = probe(2.3, 0, 0.45); // uncovered lightbox
  const loneAmber = probe(0.85, LIFT + LONE_T, 0.45);
  const loneBlue = probe(1.6, LIFT + LONE_T, 0.45);
  const stack = probe(-0.9, LIFT + LONE_T * 2 + 0.02 + 0.003, -0.45);
  const covered = probe(1.1, 0.42, -0.45);
  const reference = probe(1.85, 0.42, -0.45);

  const lums = stair.map(lum);
  // 1. Thicker amber = darker (strictly, with a 2-unit slack for noise).
  const mono = lums[0] > lums[1] + 2 && lums[1] > lums[2] + 2 && lums[2] > lums[3] + 2;
  // 2. Thicker amber = more saturated toward the attenuationColor: blue/red
  //    must fall monotonically (blue dies fastest through amber).
  const br = stair.map(([r, , b]) => b / Math.max(r, 1));
  const satMono = br[0] > br[1] && br[1] > br[2] && br[2] > br[3];
  // 3. The bare lightbox is bright but NOT clipped (ratios need headroom).
  const bareLum = lum(bare);
  const unclipped = bareLum > 120 && bareLum < 252 && lums[0] < bareLum;
  // 4. The stack differs clearly from either single slab, and is darker than
  //    both (the compounding direction).
  const stackDiffers = rgbDist(stack, loneBlue) > 8 && rgbDist(stack, loneAmber) > 8;
  const stackDarker = lum(stack) < lum(loneBlue) && lum(stack) < lum(loneAmber);
  // 5. Backlit glow comes through visibly but TINTED: blue/red crushed vs the
  //    uncovered reference panel, red channel still substantially alive. The
  //    reference must itself be unclipped or the ratios are meaningless.
  const tintRatio = (covered[2] / Math.max(covered[0], 1)) /
    Math.max(reference[2] / Math.max(reference[0], 1), 1e-3);
  const refUnclipped = lum(reference) < 252 && lum(reference) > 60;
  const backlitTinted = tintRatio < 0.6;
  const backlitGlows = covered[0] > 0.25 * reference[0] && covered[0] > 40;
  // 6. The feature was actually active, and cleanly.
  const absorptionActive = !!(rt.compiled && rt.compiled.absorption);

  verdict = {
    pass: mono && satMono && unclipped && stackDiffers && stackDarker &&
      refUnclipped && backlitTinted && backlitGlows && absorptionActive && glErrors === 0,
    mono, satMono, unclipped, stackDiffers, stackDarker, refUnclipped, backlitTinted,
    backlitGlows, absorptionActive,
    absorptionCount: rt.compiled && rt.compiled.absorption ? rt.compiled.absorption.count : 0,
    glErrors,
    frames,
    bareLum: +bareLum.toFixed(1),
    stairRGB: stair.map((c) => c.map((x) => +x.toFixed(1))),
    stairBlueOverRed: br.map((x) => +x.toFixed(3)),
    stackRGB: stack.map((x) => +x.toFixed(1)),
    loneBlueRGB: loneBlue.map((x) => +x.toFixed(1)),
    loneAmberRGB: loneAmber.map((x) => +x.toFixed(1)),
    backlitCoveredRGB: covered.map((x) => +x.toFixed(1)),
    backlitReferenceRGB: reference.map((x) => +x.toFixed(1)),
    backlitTintRatio: +tintRatio.toFixed(3),
  };

  const line = JSON.stringify(verdict);
  console.log("[absorption] " + line);
  let node = document.getElementById("absorption-verdict");
  if (!node) {
    node = document.createElement("div");
    node.id = "absorption-verdict";
    node.style.cssText = "position:fixed;left:-99999px;top:0;white-space:pre;pointer-events:none;";
    document.body.appendChild(node);
  }
  node.textContent = line;
  node.setAttribute("data-pass", String(!!verdict.pass));

  // Screenshot into .shots/ via the dev server's /__shot sink (best effort —
  // absent in a production build).
  try {
    const b64 = renderer.domElement.toDataURL("image/png").split(",")[1];
    fetch("/__shot?name=absorption", { method: "POST", body: b64 }).catch(() => {});
  } catch { /* readback unavailable — verdict already stands */ }
}

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------

const ASSERT_AT = 300; // accumulator settled, ratios stable
function loop() {
  requestAnimationFrame(loop);
  controls.update();
  rt.render(scene, camera);
  if (gl.getError() !== 0) glErrors++;
  frames++;
  if (frames === ASSERT_AT) assertNow();
  if (statsEl && frames % 30 === 0) {
    statsEl.textContent =
      `frame ${frames}\n` +
      `absorption: ${rt.compiled && rt.compiled.absorption ? `on (${rt.compiled.absorption.count} materials)` : "off"}\n` +
      (verdict ? `verdict: ${verdict.pass ? "PASS" : "FAIL"}` : `verdict at frame ${ASSERT_AT}`);
  }
}
loop();
