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
const PANE_T = 0.06;
const pane = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, PANE_T), amber);
pane.position.set(1.1, 0.42, -0.33); // 90 mm of air in front of its panel
scene.add(pane);

// ---------------------------------------------------------------------------
// COLOURED-SHADOW exhibit (phase 2 — starts hidden, see the phase notes below)
// ---------------------------------------------------------------------------
// Everything above reads absorption on the VIEW path. This reads it on the
// SHADOW path: two overlapping slabs between a light and a white floor, so the
// floor shows amber where only the amber slab is overhead, blue where only the
// blue one is, and their PRODUCT where both are. The product is the assertion
// that matters — it is what an unordered signed-sum accumulator gets wrong and
// what the ordered medium-state march gets right.
//
// Geometry is chosen so the readout is analytic, not just qualitative:
//   * The emitter sits 8 m straight up. Over the +-1.2 m of receiver that is
//     probed the incidence stays within 8.5 deg of vertical, so every probe sees
//     the same 1/d^2 and cosine to within a couple of percent (quantified in the
//     assertion) and the in-slab path length is the slab thickness to within
//     0.3%. A close emitter would make the geometry term, not the glass, the
//     thing being measured.
//   * Slab thickness == the materials' attenuationDistance (0.04 m), so each
//     slab's analytic transmittance IS its attenuationColor: amber
//     (1.00, 0.55, 0.25), blue (0.35, 0.62, 1.00), product (0.350, 0.341, 0.250).
//   * The receiver is coplanar with the lightbox (both y = 0), so the lightbox
//     — a huge emitter that would otherwise wash the exhibit out — contributes
//     EXACTLY zero here (its direction to any receiver point is horizontal, so
//     cosS = 0). The only other light, the fill point light, is switched off for
//     phase 2 because it arrives at 55 deg and would lay its own displaced set
//     of tinted bands across the same floor.
// Hidden until phase 2 so phase 1 compiles the exact scene it compiled before
// this exhibit existed (hidden meshes never reach the BVH or the material table).
const shadowRig = new THREE.Group();
shadowRig.name = "colored-shadow-rig";
const RIG_Z = -2.1;      // clear of the lightbox (z >= -1.1), still in frame
const EMIT_H = 8.0;      // emitter height above the receiver
const SLAB_T = 0.04;     // == attenuationDistance, so transmittance == attenuationColor
const receiver = new THREE.Mesh(
  new THREE.PlaneGeometry(3.0, 1.2),
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 })
);
receiver.rotation.x = -Math.PI / 2;
receiver.position.set(0, 0, RIG_Z);
shadowRig.add(receiver);
// Small, high, and bright: E = Le * A / h^2 = 360 * 0.16 / 64 = 0.9, which lands
// the bare floor mid-range (bright, nowhere near the 8-bit clip) so every tinted
// region still has headroom AND resolution.
const shadowLamp = new THREE.Mesh(
  new THREE.PlaneGeometry(0.4, 0.4),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xffffff,
    emissiveIntensity: 360,
    roughness: 1,
  })
);
shadowLamp.rotation.x = Math.PI / 2; // face down at the receiver
shadowLamp.position.set(0, EMIT_H, RIG_Z);
shadowRig.add(shadowLamp);
// Slabs overlap over x in [-0.2, 0.2]; amber alone owns [-0.8, -0.2], blue alone
// [0.2, 0.8]; bare floor outside +-0.8. Different heights so they never touch
// (coincident faces would make the entry/exit pairing ambiguous — the very case
// the march tolerates, but not one to bake into the reference rig).
const shadowSlab = (mat, cx, cy) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(1.0, SLAB_T, 1.0), mat);
  m.position.set(cx, cy, RIG_Z);
  shadowRig.add(m);
  return m;
};
shadowSlab(amber, -0.3, 0.5);
shadowSlab(blue, 0.3, 0.62);
shadowRig.traverse((o) => (o.visible = false));
scene.add(shadowRig);
// Probe columns on the receiver: bare | amber | amber+blue | blue | bare.
const SHADOW_PROBE_X = { bareL: -1.2, amber: -0.5, both: 0.0, blue: 0.5, bareR: 1.2 };

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

// --- display-transform inversion -------------------------------------------
// Every assertion that compares against an ANALYTIC transmittance has to undo
// what CompositePass did on the way to the framebuffer: ACES (the Narkowicz
// curve) then a 1/2.2 gamma. Both are exactly invertible, so probes can be read
// as scene-linear radiance instead of display codes — without this, a ratio of
// 8-bit values understates every deep tint (ACES is strongly compressive up top)
// and no absolute comparison means anything.
//
// y = (x(2.51x + 0.03)) / (x(2.43x + 0.59) + 0.14)  =>
//   (2.43y - 2.51)x^2 + (0.59y - 0.03)x + 0.14y = 0
// The physical root is the positive one; y >= 1 has clipped and carries no
// information, so it returns Infinity and the caller's clip guards catch it.
function acesInv(y) {
  if (y >= 0.999) return Infinity;
  if (y <= 0) return 0;
  const a = 2.43 * y - 2.51;
  const b = 0.59 * y - 0.03;
  const c = 0.14 * y;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return Infinity;
  const s = Math.sqrt(disc);
  const r1 = (-b + s) / (2 * a);
  const r2 = (-b - s) / (2 * a);
  const roots = [r1, r2].filter((r) => r > 0 && Number.isFinite(r));
  return roots.length ? Math.min(...roots) : Infinity;
}
/** One 0..255 probe channel -> scene-linear radiance. */
const toLinear = (v) => acesInv(Math.pow(v / 255, 2.2));
/** A probe triple -> scene-linear radiance triple. */
const linRGB = (c) => c.map(toLinear);

// sigma = -ln(attenuationColor) / attenuationDistance, the SAME derivation
// SceneCompiler.absorptionSigmaFor runs — recomputed here from the demo's own
// material inputs so the assertions test the pipeline, not a copied constant.
const sigmaOf = (attColor, attDist) => attColor.map((c) => -Math.log(Math.max(c, 1e-4)) / attDist);
const SIGMA_AMBER = sigmaOf([1.0, 0.55, 0.25], 0.04);
const SIGMA_BLUE = sigmaOf([0.35, 0.62, 1.0], 0.04);
const beer = (sigma, d) => sigma.map((s) => Math.exp(-s * d));
// Schlick's approximation, matching the shader's schlick(cosT, eta) exactly:
// the glass pixel is mix(transmitted, reflected, fres), so an absolute
// comparison of the transmitted term has to divide the Fresnel share back out.
const schlick = (cosT, eta) => {
  const r0 = ((1 - eta) / (1 + eta)) ** 2;
  return r0 + (1 - r0) * Math.pow(1 - cosT, 5);
};

let glErrors = 0;
let frames = 0;
let verdict = null;
let phase1 = null;
let shadowResult = null;

// Screenshot into .shots/ via the dev server's /__shot sink (best effort —
// absent in a production build).
function postShot(name) {
  try {
    const b64 = renderer.domElement.toDataURL("image/png").split(",")[1];
    fetch(`/__shot?name=${name}`, { method: "POST", body: b64 }).catch(() => {});
  } catch { /* readback unavailable — the verdict already stands */ }
}

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

  // 7. QUANTITATIVE backlit readout: the covered panel over the uncovered one,
  //    in SCENE-LINEAR radiance, must equal exp(-sigma * d) over the refracted
  //    chord through the pane. Two contaminants stand between the pixel and
  //    that number, and both are removed with quantities the shader itself
  //    computes rather than fitted constants:
  //      (a) Fresnel. The glass pixel is mix(transmitted, reflected, fres), so
  //          only (1 - fres) of it is the term Beer-Lambert governs.
  //      (b) An untinted additive leak — the reflected environment in that
  //          Fresnel share, plus the pane's own dielectric highlight, which
  //          CompositePass adds outside the albedo multiply. It is measured,
  //          not assumed: amber's attenuationColor.r is exactly 1.0, so
  //          sigma.r == 0 and the RED channel's transmitted term is analytically
  //          1.0 — whatever red reads above (1 - fres) IS the leak. Calibrating
  //          on red makes the red assertion vacuous by construction (stated in
  //          the verdict as backlitRedIsCalibration); green and blue are the test.
  //    The chord: Snell through the pane's front face along the actual view
  //    direction, less the shader's 2*eps entry offset (which starts the trace
  //    already inside the glass, so it never traverses that first sliver).
  const paneFrontZ = pane.position.z + PANE_T / 2;
  const vd = new THREE.Vector3(pane.position.x, pane.position.y, paneFrontZ)
    .sub(camera.position)
    .normalize();
  const cosI = Math.abs(vd.z); // pane normal is +z
  const sinR = Math.sqrt(Math.max(1 - cosI * cosI, 0)) / 1.5; // material ior
  const cosR = Math.sqrt(Math.max(1 - sinR * sinR, 0));
  const paneChord = (PANE_T - 2 * rt.eps) / cosR;
  const fres = schlick(cosI, 1 / 1.5);
  const refLin = linRGB(reference);
  const covLin = linRGB(covered);
  const tRaw = covLin.map((c, i) => c / Math.max(refLin[i], 1e-6));
  const leak = tRaw[0] - (1 - fres);
  const tCorr = tRaw.map((t) => (t - leak) / (1 - fres));
  const backlitAnalytic = beer(SIGMA_AMBER, paneChord);
  // Tolerance 30%, and this one really does need it — the VIEW path is a much
  // dirtier measurement than the shadow path below. Measured residual on this
  // machine: +4.7% green, +21.8% blue. Solving the two channels for a common
  // chord says they want a leak of ~0.093 where the red channel calibrates
  // 0.072, i.e. the leak is not perfectly channel-neutral (it is not the
  // reflected env either — that is 0.001 of this signal). It is a property of
  // the 0.8.0 view path, unchanged by coloured shadows, and it is recorded here
  // rather than tuned away. The band still catches real breakage, which shows up
  // as factors of 2-10, and the geometry-free tau-ratio check below is tight.
  const BACKLIT_TOL = 0.3;
  const backlitErr = tCorr.map((t, i) => t / backlitAnalytic[i] - 1);
  const backlitAnalyticOK =
    Math.abs(backlitErr[1]) < BACKLIT_TOL && Math.abs(backlitErr[2]) < BACKLIT_TOL;
  // The same data with the path length divided out: tau = -ln(T) is linear in
  // sigma, so tau_B / tau_G must be sigma_B / sigma_G no matter how long the
  // chord actually was. This is the geometry-free half of the claim, so it gets
  // the tighter 15% band.
  const tauRatio = Math.log(tCorr[2]) / Math.log(tCorr[1]);
  const tauRatioAnalytic = SIGMA_AMBER[2] / SIGMA_AMBER[1];
  const backlitTauRatioOK = Math.abs(tauRatio / tauRatioAnalytic - 1) < 0.15;

  phase1 = {
    pass: mono && satMono && unclipped && stackDiffers && stackDarker &&
      refUnclipped && backlitTinted && backlitGlows && absorptionActive &&
      backlitAnalyticOK && backlitTauRatioOK && glErrors === 0,
    mono, satMono, unclipped, stackDiffers, stackDarker, refUnclipped, backlitTinted,
    backlitGlows, absorptionActive, backlitAnalyticOK, backlitTauRatioOK,
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
    backlitRedIsCalibration: true,
    backlitChordM: +paneChord.toFixed(5),
    backlitFresnel: +fres.toFixed(4),
    backlitLeak: +leak.toFixed(4),
    backlitMeasuredT: tCorr.map((x) => +x.toFixed(4)),
    backlitAnalyticT: backlitAnalytic.map((x) => +x.toFixed(4)),
    backlitRelErr: backlitErr.map((x) => +x.toFixed(3)),
    backlitTauRatio: +tauRatio.toFixed(3),
    backlitTauRatioAnalytic: +tauRatioAnalytic.toFixed(3),
  };
  console.log("[absorption] phase1 " + JSON.stringify(phase1));
  postShot("absorption");
}

// ---------------------------------------------------------------------------
// Phase 2 — COLOURED SHADOWS on the stacked-slab receiver
// ---------------------------------------------------------------------------

// Irradiance a receiver column at x receives from the lamp, up to the constant
// Le*A: cosS * cosL / d^2 with both cosines h/d and d^2 = h^2 + x^2. This is the
// same geometry the emissive-NEE estimator evaluates, so dividing it out turns a
// column-vs-column ratio into a pure TRANSMITTANCE ratio. The columns are only
// +-1.2 m apart under an 8 m lamp so the whole correction is under 4%, but it is
// exactly known — no reason to spend it as tolerance.
const gAt = (x) => (EMIT_H * EMIT_H) / Math.pow(EMIT_H * EMIT_H + x * x, 2);
const G_REF = (gAt(SHADOW_PROBE_X.bareL) + gAt(SHADOW_PROBE_X.bareR)) / 2;

/** Read the five receiver columns as scene-linear radiance. */
function readShadowColumns() {
  const at = (x) => linRGB(probe(x, 0, RIG_Z));
  const bareL = at(SHADOW_PROBE_X.bareL);
  const bareR = at(SHADOW_PROBE_X.bareR);
  return {
    // Average the two bare bands. They bracket the tinted columns symmetrically,
    // so the average sits at the same geometric falloff on both sides.
    bare: bareL.map((v, i) => (v + bareR[i]) / 2),
    bareL,
    bareR,
    amber: at(SHADOW_PROBE_X.amber),
    both: at(SHADOW_PROBE_X.both),
    blue: at(SHADOW_PROBE_X.blue),
  };
}

function assertShadows(off) {
  const c = readShadowColumns();
  const ratio = (v, x) =>
    v.map((y, i) => y / Math.max(c.bare[i], 1e-6) / (gAt(x) / G_REF));
  const rAmber = ratio(c.amber, SHADOW_PROBE_X.amber);
  const rBlue = ratio(c.blue, SHADOW_PROBE_X.blue);
  const rBoth = ratio(c.both, SHADOW_PROBE_X.both);
  const raw8 = {
    bareL: probe(SHADOW_PROBE_X.bareL, 0, RIG_Z).map((x) => +x.toFixed(1)),
    amber: probe(SHADOW_PROBE_X.amber, 0, RIG_Z).map((x) => +x.toFixed(1)),
    both: probe(SHADOW_PROBE_X.both, 0, RIG_Z).map((x) => +x.toFixed(1)),
    blue: probe(SHADOW_PROBE_X.blue, 0, RIG_Z).map((x) => +x.toFixed(1)),
    bareR: probe(SHADOW_PROBE_X.bareR, 0, RIG_Z).map((x) => +x.toFixed(1)),
  };

  if (off) {
    // A/B control: with rt.absorptionShadows off the SAME scene must put every
    // covered column back in hard shadow. Without this the assertions above
    // could be satisfied by a rig that simply leaks light around the slabs.
    return {
      raw8,
      rAmber: rAmber.map((x) => +x.toFixed(4)),
      rBlue: rBlue.map((x) => +x.toFixed(4)),
      rBoth: rBoth.map((x) => +x.toFixed(4)),
      bareLin: c.bare.map((x) => +x.toFixed(4)),
      occluded: Math.max(...rAmber, ...rBlue, ...rBoth) < 0.02,
    };
  }

  const aAmber = beer(SIGMA_AMBER, SLAB_T); // == amber attenuationColor
  const aBlue = beer(SIGMA_BLUE, SLAB_T);   // == blue attenuationColor
  const aBoth = aAmber.map((v, i) => v * aBlue[i]);
  const rel = (m, a) => m.map((x, i) => x / a[i] - 1);
  const maxAbs = (v) => Math.max(...v.map(Math.abs));

  // The bare columns must be bright and unclipped or every ratio below is
  // measured against a saturated denominator.
  const bareOK =
    c.bare.every((v) => Number.isFinite(v) && v > 0.15) &&
    Math.max(...raw8.bareL, ...raw8.bareR) < 250;

  // Tolerance 0.10 on the single-slab tints, against an analytic value with the
  // geometry divided out (above) — so what is left to absorb is: 8-bit
  // quantisation through the inverted ACES curve (~2-3% on the deepest channel),
  // ~0.3% of extra path length from the off-vertical incidence, the finite
  // 0.4 m lamp treated as a point, and residual emissive-NEE noise after ~280
  // accumulated frames and an 11x11 patch. Measured residual on this machine:
  // +0.2/+1.3/+1.9% (amber), +2.9/-0.4/+0.9% (blue), +3.3/+3.2/+4.6% (overlap),
  // so 10% is roughly 2x headroom. It is deliberately NOT loose: an earlier
  // draft of the march charged optical depth from the stepped-off ray origin
  // instead of interface-to-interface, which under-attenuated by 10-15% here —
  // a 20% band would have shipped that bug.
  const TINT_TOL = 0.1;
  const errAmber = rel(rAmber, aAmber);
  const errBlue = rel(rBlue, aBlue);
  const errBoth = rel(rBoth, aBoth);
  // THE product assertion: the overlap column must be the CHANNEL-WISE PRODUCT
  // of the two single-slab columns. Compared against the two MEASURED singles
  // (not their analytic values), so it isolates the compounding behaviour from
  // any common-mode error in the rig — and it is exactly the quantity a signed
  // any-hit sum gets wrong (it would read brighter than either single, or
  // outright > 1, where the interfaces do not pair).
  // Tighter than the analytic band (0.08): comparing measurement to measurement
  // cancels the geometry model and the display-inversion bias, leaving only
  // noise. Measured residual +0.1/+2.2/+1.8%.
  const productExpected = rAmber.map((v, i) => v * rBlue[i]);
  const errProduct = rBoth.map((v, i) => v / Math.max(productExpected[i], 1e-6) - 1);
  const PRODUCT_TOL = 0.08;

  return {
    raw8,
    bareLin: c.bare.map((x) => +x.toFixed(4)),
    rAmber: rAmber.map((x) => +x.toFixed(4)),
    rBlue: rBlue.map((x) => +x.toFixed(4)),
    rBoth: rBoth.map((x) => +x.toFixed(4)),
    aAmber: aAmber.map((x) => +x.toFixed(4)),
    aBlue: aBlue.map((x) => +x.toFixed(4)),
    aBoth: aBoth.map((x) => +x.toFixed(4)),
    productExpected: productExpected.map((x) => +x.toFixed(4)),
    errAmber: errAmber.map((x) => +x.toFixed(3)),
    errBlue: errBlue.map((x) => +x.toFixed(3)),
    errBoth: errBoth.map((x) => +x.toFixed(3)),
    errProduct: errProduct.map((x) => +x.toFixed(3)),
    bareOK,
    amberTintOK: maxAbs(errAmber) < TINT_TOL,
    blueTintOK: maxAbs(errBlue) < TINT_TOL,
    bothTintOK: maxAbs(errBoth) < TINT_TOL,
    productOK: maxAbs(errProduct) < PRODUCT_TOL,
    // Direction sanity, independent of any tolerance: amber passes red over
    // blue, blue passes blue over red, and the overlap is under both singles.
    huesOK:
      rAmber[0] > rAmber[2] * 2 &&
      rBlue[2] > rBlue[0] * 2 &&
      lum(rBoth) < lum(rAmber) &&
      lum(rBoth) < lum(rBlue),
    shadowsFlag: rt.absorptionShadows,
  };
}

function publish() {
  verdict = {
    pass: !!(
      phase1 && phase1.pass &&
      shadowResult && shadowResult.on && shadowResult.off &&
      shadowResult.on.bareOK && shadowResult.on.amberTintOK && shadowResult.on.blueTintOK &&
      shadowResult.on.bothTintOK && shadowResult.on.productOK && shadowResult.on.huesOK &&
      shadowResult.off.occluded &&
      glErrors === 0
    ),
    glErrors,
    frames,
    phase1,
    coloredShadows: shadowResult,
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
}

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
//
// Three phases, because the two halves of the feature live on different code
// paths and one of them is out of v1 scope:
//   1 (frames 1..300)   the original view-path exhibits, scene and settings
//                       UNTOUCHED — restir on, fill light on, shadow rig hidden,
//                       so these assertions measure exactly what they measured
//                       before coloured shadows existed.
//   2 (..P2_ASSERT)     the coloured-shadow exhibit. restir is switched OFF
//                       first: with ReSTIR on, primary direct light is shaded by
//                       the reservoir winner's visibility ray, which stays BINARY
//                       in v1 — coloured shadows live on the two NEE shadow rays.
//                       That limitation is the reason for this switch, and it is
//                       documented in the README/CHANGELOG rather than hidden.
//   3 (..P3_ASSERT)     the same frame with rt.absorptionShadows = false, the
//                       A/B control that proves the light really is arriving
//                       through the glass.
const ASSERT_AT = 300;
const P2_SETTLE = 280;
const P2_ASSERT = ASSERT_AT + P2_SETTLE;
const P3_SETTLE = 200;
const P3_ASSERT = P2_ASSERT + P3_SETTLE;
const P4_ASSERT = P3_ASSERT + P3_SETTLE; // back on, for the screenshot

let phaseLabel = "view-path exhibits";

function enterShadowPhase() {
  phaseLabel = "coloured shadows (shadows ON)";
  shadowRig.traverse((o) => (o.visible = true));
  fill.visible = false; // its 55-degree bands would cross the vertical ones
  rt.restir = false;    // v1 scope: coloured shadows are on the NEE rays
  rt.stochasticLights = false;
  // The a-trous denoiser is EDGE-AWARE on geometry, and the receiver is one flat
  // plane — so nothing stops it blurring the tinted bands into each other and
  // into the bright bare floor beside them. Measured, that leak read as a ~+18%
  // additive floor on the deepest channels. Off is the right setting for a
  // spatial-pattern measurement, and by this point ~280 accumulated frames have
  // already taken the noise well below the tolerances here.
  rt.denoise = false;
  rt.compileScene(scene);
  // compileScene re-derives eps from the (now much taller) scene bounds; re-pin
  // it, exactly as the initial setup does — the 20 mm slabs still need it small.
  rt.eps = 2e-3;
  rt.resetAccumulation();
}

function loop() {
  requestAnimationFrame(loop);
  controls.update();
  rt.render(scene, camera);
  if (gl.getError() !== 0) glErrors++;
  frames++;
  if (frames === ASSERT_AT) { assertNow(); enterShadowPhase(); }
  if (frames === P2_ASSERT) {
    shadowResult = { on: assertShadows(false) };
    console.log("[absorption] shadowsOn " + JSON.stringify(shadowResult.on));
    postShot("absorption-colored-shadows");
    phaseLabel = "coloured shadows (A/B: shadows OFF)";
    rt.absorptionShadows = false;
    rt.resetAccumulation();
  }
  if (frames === P3_ASSERT) {
    shadowResult.off = assertShadows(true);
    console.log("[absorption] shadowsOff " + JSON.stringify(shadowResult.off));
    postShot("absorption-colored-shadows-off");
    phaseLabel = "coloured shadows (restored)";
    rt.absorptionShadows = true;
    rt.resetAccumulation();
  }
  if (frames === P4_ASSERT) publish();
  if (statsEl && frames % 30 === 0) {
    statsEl.textContent =
      `frame ${frames}  [${phaseLabel}]\n` +
      `absorption: ${rt.compiled && rt.compiled.absorption ? `on (${rt.compiled.absorption.count} materials)` : "off"}\n` +
      `tinted shadows: ${rt.absorptionShadows ? "on" : "off"}\n` +
      (verdict
        ? `verdict: ${verdict.pass ? "PASS" : "FAIL"}`
        : `verdict at frame ${P4_ASSERT}`);
  }
}
loop();
