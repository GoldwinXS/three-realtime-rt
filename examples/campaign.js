/**
 * three-realtime-rt — QUALITY CAMPAIGN harness.
 *
 * A measurement instrument, not a demo. It renders three fixed scenes at a
 * fixed drawing-buffer size with a scripted camera and reports, per config:
 *
 *   fps            fence-timed ms/frame (see timeConfig)
 *   still noise    mean |RGB| diff/px/frame on a parked camera, 3 patches
 *   spatial noise  high-pass std + blotch ratio in a flat patch
 *   vs reference   RMSE against a long-converged high-res reference image
 *   moving         in-motion error vs per-pose converged references, in-motion
 *                  churn, and the bench.html-comparable ghost decay
 *
 * Every capture is archived as a PNG under quality-campaign/images/ with a
 * config-stamped name, and every number lands in quality-campaign/*.json.
 * The measurement contract is pre-registered in quality-campaign/PLAN.json —
 * read that first; this file implements it.
 *
 * DETERMINISM RULES (violating them silently corrupts every number):
 *  - adaptiveQuality and overloadProtection are OFF; nothing may move quality
 *    under us mid-measurement.
 *  - gl.finish() does not block in Chrome. Fence with a 1x1 readPixels.
 *  - readPixels must run in the SAME JS task as the render that produced the
 *    frame: the default framebuffer is presented and cleared between tasks.
 *  - Camera steps are driven inside that same synchronous task, one step per
 *    render, so no scheduler jitter can change the path.
 *  - Nothing in the scenes animates: no physics, no water deform, no skinning
 *    update is driven. The camera is the only thing that moves.
 *
 * URL params:
 *   ?scene=cornell|museum|tokyo   which stop to measure
 *   &plan=recon|main|denoise      which config list to run
 *   &rep=1                        repeat index (stamped into every filename)
 *   &autorun=1                    start immediately
 */
import * as THREE from "three";
import { RealtimeRaytracer } from "../src/index.js";
import { SCENES as GALLERY } from "./gallery-scenes.js";
import { buildScene } from "./scene.js";

// ---------------------------------------------------------------------------
// parameters
// ---------------------------------------------------------------------------
const P = new URLSearchParams(location.search);
const SCENE_ID = P.get("scene") || "cornell";
const PLAN = P.get("plan") || "main";
const REP = parseInt(P.get("rep") || "1", 10);
// &moving=0 runs the same config list with the (expensive) moving tests off —
// used for the timing/quality REPEATS, where the still metrics and fps are what
// need replicating and the moving numbers are already in hand from repeat 1.
const MOVING_OFF = P.get("moving") === "0";

const BASE_W = 1280;
const BASE_H = 720;
const DS_W = 320;   // common comparison grid
const DS_H = 180;

const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");
const setStatus = (t) => { statusEl.textContent = t; };
const log = (t) => { logEl.textContent += t + "\n"; logEl.scrollTop = logEl.scrollHeight; };

// ---------------------------------------------------------------------------
// scene registry — three points on the triangle-count curve
// ---------------------------------------------------------------------------
const SCENE_DEFS = {
  cornell: {
    tris: 86,
    fov: 55,
    cam: [0, 2.8, 7.8],
    target: [0, 2.7, 0],
    build: async () => {
      const s = await GALLERY.cornell();
      return { scene: s.scene, sky: s.sky, env: s.env };
    },
    // Fractional (x, y) centres, y measured from the TOP of the image. Chosen
    // by eye from quality-campaign/images/recon__cornell__grid.png.
    patches: {
      center: [0.50, 0.50],   // image centre — tall block silhouette vs back wall
      shadow: [0.70, 0.90],   // short block's contact shadow on the floor
      spec: [0.32, 0.10],     // ceiling beside the lamp. NOTE: the Cornell box has
                              // no specular material (everything is roughness 0.9),
                              // so this slot measures the indirect-only ceiling —
                              // the slowest-converging region in the scene.
      flat: [0.60, 0.30],     // clean back wall above the blocks
      lit: [0.45, 0.93],      // open, directly lit floor
      probe: [0.565, 0.775],  // short block's flat front face — where the a-trous
                              // grid artifact shows up most clearly (128px patch)
    },
  },
  museum: {
    tris: 50000,
    fov: 58,
    cam: [4.5, 4.2, 11.0],
    target: [-1.0, 1.8, -2.8],
    build: async () => {
      const built = buildScene();
      await built.ready;
      // Force the demo's initially-hidden lights on so the scene is fully lit
      // and comparable run to run.
      return { scene: built.scene, sky: built.sky, env: { color: new THREE.Color(0x0a0f18), intensity: 1.0 } };
    },
    // From quality-campaign/images/recon__museum__grid.png.
    patches: {
      center: [0.50, 0.50],   // helmet pedestal / mint sphere, mid-room
      shadow: [0.33, 0.66],   // floor shadowed by the vitrine + pool kerb
      spec: [0.88, 0.45],     // the gold torus knot (metalness 0.85)
      flat: [0.22, 0.70],     // clean GI-lit floor, left of the spotlight pool
      lit: [0.55, 0.70],      // the spotlight pool on the same floor
      probe: [0.22, 0.70],    // same clean floor, 128px, for the grid probe
    },
  },
  // Added for the ReSTIR GI artifact study (plan=restirgi): the user reported
  // the artifact "in the gallery especially", and the gallery's streamed Khronos
  // PBR assets sit on a big, flat, GI-lit ground disc under a sky — the largest
  // uninterrupted indirect-light surface any of these scenes has, and therefore
  // the clearest read on coarse GI structure.
  lantern: {
    tris: 6000,
    fov: 55,
    cam: [7, 5, 9],
    target: [0, 3, 0],
    build: async () => {
      const s = await GALLERY.lantern();
      return { scene: s.scene, sky: s.sky, env: s.env };
    },
    // From quality-campaign/images/recon__lantern__grid.png.
    patches: {
      center: [0.50, 0.50],    // the post — the model itself
      shadow: [0.55, 0.655],   // the post's cast shadow on the ground disc
      spec: [0.575, 0.26],     // the lantern's black metal housing
      flat: [0.80, 0.80],      // clean ground disc, right of the lantern
      lit: [0.20, 0.80],       // clean sunlit ground disc, left of the lantern
      probe: [0.80, 0.80],     // same clean ground, 128px grid probe
    },
  },
  tokyo: {
    tris: 141000,
    fov: 55,
    cam: [11, 7, 12],
    target: [0, 3.4, 0],
    build: async () => {
      const s = await GALLERY.tokyo();
      return { scene: s.scene, sky: s.sky, env: s.env };
    },
    // From quality-campaign/images/recon__tokyo__grid.png.
    patches: {
      center: [0.50, 0.50],   // the building facade — dense geometry + textures
      shadow: [0.42, 0.93],   // ground disc directly under the building
      spec: [0.72, 0.655],    // the tram's glossy body
      flat: [0.80, 0.80],     // clean ground disc, right of the base plate
      lit: [0.24, 0.86],      // clean ground disc, left of the base plate
      probe: [0.82, 0.86],    // ground disc clear of the tram, 128px grid probe
    },
  },
};

// ---------------------------------------------------------------------------
// the pre-registered baseline (see quality-campaign/PLAN.json)
// ---------------------------------------------------------------------------
const BASELINE = {
  renderScale: 0.5,
  canvasScale: 1.0,
  denoise: true,
  denoiseIterations: 2,
  taa: true,
  giHalfRate: false,
  restir: true,
  restirGI: false,
  gi: true,
  emissiveNEE: true,
  reflections: true,
  refraction: true,
  specular: true,
  transparency: true,
  absorptionShadows: true,
  kmScattering: false,
  volumetric: false,
  stochasticLights: false,
  // Temporal-response knobs. maxHistory 48 matches the demo (the library default
  // is 128); taaBlend 0.1 is the library default. The rest are the EXPERIMENTAL
  // mitigations this campaign added — all inert at these values, so the baseline
  // arm renders exactly what master renders.
  maxHistory: 48,
  taaBlend: 0.1,
  motionAdaptive: false,
  maxHistoryMoving: 6,
  taaBlendMoving: 0.4,
  restirMCap: 40,
  restirMCapMoving: 40,
  denoiseMaxStep: 0,
  denoiseStepJitter: 0,
  denoiseWideDamp: 0,
  // ReSTIR GI knobs, all at their library defaults so every pre-existing arm
  // renders exactly what it rendered before (restirGI is false in BASELINE, so
  // none of them is even reachable outside the restirgi plan).
  restirGIMCap: 20,
  restirGISpatialTaps: 2,
  restirGIValidate: 8,
  restirGIResolveAlpha: 1.0,
  restirGIConfLow: 0.3,
  restirGIChromaMean: true,
  restirGIVisFallback: true,
};

/** The stand-in for ground truth: full lighting resolution, long convergence. */
const REFERENCE = { ...BASELINE, renderScale: 1.0, canvasScale: 1.0, denoiseIterations: 2 };

// ---------------------------------------------------------------------------
// renderer + fence
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(BASE_W, BASE_H, false);
document.getElementById("app").appendChild(renderer.domElement);
const gl = renderer.getContext();
const camera = new THREE.PerspectiveCamera(55, BASE_W / BASE_H, 0.1, 200);

const fenceBuf = new Uint8Array(4);
/** Force the driver to finish queued GPU work (gl.finish is a no-op in Chrome). */
function fence() {
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, fenceBuf);
}

// rAF can stall in a backgrounded tab; race it against a timeout so the suite
// always advances even if the window loses focus.
const nextFrame = () => new Promise((r) => { requestAnimationFrame(r); setTimeout(r, 40); });

// ---------------------------------------------------------------------------
// pixel maths
// ---------------------------------------------------------------------------
const LUMA = [0.299, 0.587, 0.114];

/** Box-downsample an RGBA byte frame to dw x dh float RGB (0-255). */
function downsample(buf, w, h, dw, dh) {
  const out = new Float32Array(dw * dh * 3);
  const sx = w / dw, sy = h / dh;
  for (let y = 0; y < dh; y++) {
    const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < dw; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let r = 0, g = 0, b = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * w + xx) * 4;
          r += buf[i]; g += buf[i + 1]; b += buf[i + 2]; n++;
        }
      }
      const o = (y * dw + x) * 3;
      out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n;
    }
  }
  return out;
}

/** Bilinearly resample an RGBA byte frame to dw x dh float RGB (0-255). */
function bilinearTo(buf, w, h, dw, dh) {
  const out = new Float32Array(dw * dh * 3);
  for (let y = 0; y < dh; y++) {
    const fy = Math.min(h - 1, (y + 0.5) * (h / dh) - 0.5);
    const y0 = Math.max(0, Math.floor(fy)), y1 = Math.min(h - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < dw; x++) {
      const fx = Math.min(w - 1, (x + 0.5) * (w / dw) - 0.5);
      const x0 = Math.max(0, Math.floor(fx)), x1 = Math.min(w - 1, x0 + 1), tx = fx - x0;
      const i00 = (y0 * w + x0) * 4, i10 = (y0 * w + x1) * 4;
      const i01 = (y1 * w + x0) * 4, i11 = (y1 * w + x1) * 4;
      const o = (y * dw + x) * 3;
      for (let c = 0; c < 3; c++) {
        const a = buf[i00 + c] * (1 - tx) + buf[i10 + c] * tx;
        const b = buf[i01 + c] * (1 - tx) + buf[i11 + c] * tx;
        out[o + c] = a * (1 - ty) + b * ty;
      }
    }
  }
  return out;
}

/** Root-mean-square per-channel difference of two float RGB buffers (0-255). */
function rmse(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; }
  return Math.sqrt(s / a.length);
}

/** Mean absolute per-channel difference of two buffers (0-255). */
function meanAbs(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

/** Mean |Laplacian| of luma over a float RGB image — a detail-retention proxy. */
function sharpness(rgb, w, h) {
  let s = 0, n = 0;
  const l = (x, y) => {
    const i = (y * w + x) * 3;
    return rgb[i] * LUMA[0] + rgb[i + 1] * LUMA[1] + rgb[i + 2] * LUMA[2];
  };
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      s += Math.abs(4 * l(x, y) - l(x - 1, y) - l(x + 1, y) - l(x, y - 1) - l(x, y + 1));
      n++;
    }
  }
  return s / n;
}

/** Whole-frame luma plane (float, 0-255) from an RGBA byte frame. */
function lumaPlane(buf, w, h) {
  const out = new Float32Array(w * h);
  for (let i = 0, j = 0; i < out.length; i++, j += 4) {
    out[i] = buf[j] * LUMA[0] + buf[j + 1] * LUMA[1] + buf[j + 2] * LUMA[2];
  }
  return out;
}

/** Extract a luma patch (float) from an RGBA byte frame. */
function lumaPatch(buf, w, h, px, py, ps) {
  const out = new Float32Array(ps * ps);
  for (let y = 0; y < ps; y++) {
    for (let x = 0; x < ps; x++) {
      const i = ((py + y) * w + (px + x)) * 4;
      out[y * ps + x] = buf[i] * LUMA[0] + buf[i + 1] * LUMA[1] + buf[i + 2] * LUMA[2];
    }
  }
  return out;
}

function mean(arr) { let s = 0; for (let i = 0; i < arr.length; i++) s += arr[i]; return s / arr.length; }
function std(arr) {
  const m = mean(arr);
  let s = 0;
  for (let i = 0; i < arr.length; i++) { const d = arr[i] - m; s += d * d; }
  return Math.sqrt(s / arr.length);
}
/** Pearson correlation of two equal-length series (0 when either is flat). */
function corr(a, b) {
  const ma = mean(a), mb = mean(b);
  let sab = 0, saa = 0, sbb = 0;
  for (let i = 0; i < a.length; i++) {
    const da = a[i] - ma, db = b[i] - mb;
    sab += da * db; saa += da * da; sbb += db * db;
  }
  return saa > 1e-12 && sbb > 1e-12 ? sab / Math.sqrt(saa * sbb) : 0;
}

/**
 * Remove a least-squares plane (a + b*x + c*y) from a luma patch. Real surfaces
 * carry a lighting gradient; without this, a "flatness" statistic just measures
 * the ramp. The first smoke run showed exactly that (blockStd 27.7 on a smooth
 * Cornell back wall), which is why every structure statistic below is detrended.
 */
function detrend(patch, ps) {
  let sx = 0, sy = 0, sv = 0, sxx = 0, syy = 0, sxy = 0, sxv = 0, syv = 0;
  const n = ps * ps;
  for (let y = 0; y < ps; y++) {
    for (let x = 0; x < ps; x++) {
      const v = patch[y * ps + x];
      sx += x; sy += y; sv += v;
      sxx += x * x; syy += y * y; sxy += x * y;
      sxv += x * v; syv += y * v;
    }
  }
  // Normal equations for [a b c] over [1 x y].
  const m = [[n, sx, sy], [sx, sxx, sxy], [sy, sxy, syy]];
  const r = [sv, sxv, syv];
  for (let i = 0; i < 3; i++) {
    let p = i;
    for (let j = i + 1; j < 3; j++) if (Math.abs(m[j][i]) > Math.abs(m[p][i])) p = j;
    [m[i], m[p]] = [m[p], m[i]]; [r[i], r[p]] = [r[p], r[i]];
    if (Math.abs(m[i][i]) < 1e-9) continue;
    for (let j = i + 1; j < 3; j++) {
      const f = m[j][i] / m[i][i];
      for (let k = i; k < 3; k++) m[j][k] -= f * m[i][k];
      r[j] -= f * r[i];
    }
  }
  const c = [0, 0, 0];
  for (let i = 2; i >= 0; i--) {
    let s = r[i];
    for (let k = i + 1; k < 3; k++) s -= m[i][k] * c[k];
    c[i] = Math.abs(m[i][i]) < 1e-9 ? 0 : s / m[i][i];
  }
  const out = new Float32Array(n);
  for (let y = 0; y < ps; y++) {
    for (let x = 0; x < ps; x++) out[y * ps + x] = patch[y * ps + x] - (c[0] + c[1] * x + c[2] * y);
  }
  return out;
}

/**
 * Spatial-noise decomposition of a luma patch, after plane detrending:
 *   hpStd    std of (pixel - its 3x3 box mean) — pixel-scale grain
 *   blockStd std of `block`-sized tile MEANS — mid-frequency structure (blotches)
 *   blotch   blockStd / hpStd — rises when the filter trades grain for blotches
 */
function spatialStats(patch, ps, block = 16) {
  const d = detrend(patch, ps);
  const hp = new Float32Array((ps - 2) * (ps - 2));
  let k = 0;
  for (let y = 1; y < ps - 1; y++) {
    for (let x = 1; x < ps - 1; x++) {
      let s = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += d[(y + dy) * ps + (x + dx)];
      hp[k++] = d[y * ps + x] - s / 9;
    }
  }
  const nb = Math.floor(ps / block);
  const blockMeans = [];
  const withinStds = [];
  for (let by = 0; by < nb; by++) {
    for (let bx = 0; bx < nb; bx++) {
      const tile = new Float32Array(block * block);
      let t = 0;
      for (let y = 0; y < block; y++) for (let x = 0; x < block; x++) tile[t++] = d[(by * block + y) * ps + bx * block + x];
      blockMeans.push(mean(tile));
      withinStds.push(std(tile));
    }
  }
  const hpStd = std(hp);
  const blockStd = std(Float32Array.from(blockMeans));
  return {
    hpStd,
    pixStd: mean(withinStds),
    blockStd,
    blotch: hpStd > 1e-4 ? blockStd / hpStd : 0,
    patchStd: std(d),
    patchMean: mean(patch),
  };
}

/**
 * GRID-PERIODICITY probe — the artifact metric for the a-trous filter.
 *
 * Pass i of the filter taps its 3x3 neighbourhood at a spacing of 2^i LIGHTING
 * texels. Because the edge-avoiding weights vary from pixel to pixel, adjacent
 * output pixels blend disjoint tap sets, and the filter stops being stationary:
 * a periodic, axis-aligned pattern appears whose period IS the tap spacing. This
 * measures that directly. The detrended patch is collapsed to its column means
 * and row means, and a single-bin DFT reports the amplitude at each candidate
 * SCREEN-pixel period (a lighting-texel step of s shows up at s / renderScale
 * screen pixels). Reported as amplitude in 0-255 luma units.
 */
function gridEnergy(patch, ps, periods) {
  const d = detrend(patch, ps);
  const cols = new Float32Array(ps);
  const rows = new Float32Array(ps);
  for (let y = 0; y < ps; y++) {
    for (let x = 0; x < ps; x++) {
      const v = d[y * ps + x];
      cols[x] += v / ps;
      rows[y] += v / ps;
    }
  }
  const amp = (sig, p) => {
    if (p < 2 || p > ps) return 0;
    let re = 0, im = 0;
    for (let i = 0; i < ps; i++) {
      const a = (2 * Math.PI * i) / p;
      re += sig[i] * Math.cos(a);
      im += sig[i] * Math.sin(a);
    }
    return (2 * Math.sqrt(re * re + im * im)) / ps;
  };
  const out = {};
  let peak = 0, peakP = 0;
  for (const p of periods) {
    const v = Math.max(amp(cols, p), amp(rows, p));
    out[`grid${p}`] = v;
    if (v > peak) { peak = v; peakP = p; }
  }
  out.gridPeak = peak;
  out.gridPeakPeriod = peakP;
  return out;
}

/**
 * WHOLE-FRAME STRUCTURE SWEEP. The single 128px `probe` window is a fine place
 * to LOOK at the a-trous lattice, but it is a poor place to MEASURE amplitude:
 * one window holds 64 detrended tiles, and its blockStd / gridPeak swing ~2x
 * between configs whose GI statistics differ by a few percent — the numbers are
 * deterministic (this renderer is), but they are one arbitrary realization, and
 * ranking configs on them ranks realizations. This tiles the WHOLE frame into
 * overlapping windows, drops the ones that are mostly background, and averages,
 * which is what makes the on/off ratio in the fix bar mean something.
 *
 * `periods` are SCREEN-pixel periods (the caller converts from a-trous texels).
 * Returns per-period mean amplitudes plus mean block/high-pass structure, all in
 * the same 0-255 luma units the single-window statistics use.
 */
function frameStructure(plane, w, h, ps, periods, block, floor = 12, gate = null) {
  const stride = Math.round(ps / 2);
  const acc = {};
  for (const p of periods) acc[`sgrid${p}`] = 0;
  let block2 = 0, hp2 = 0, n = 0;
  const sub = (src, x0, y0) => {
    const out = new Float32Array(ps * ps);
    for (let y = 0; y < ps; y++) out.set(src.subarray((y0 + y) * w + x0, (y0 + y) * w + x0 + ps), y * ps);
    return out;
  };
  for (let y = 0; y + ps <= h; y += stride) {
    for (let x = 0; x + ps <= w; x += stride) {
      const patch = sub(plane, x, y);
      // Skip windows that are mostly letterbox / empty background: they carry no
      // lighting, and their near-zero structure would dilute the average. For a
      // DIFFERENCE plane (mean ~0 everywhere) the caller passes a `gate` plane —
      // the restirGI-off luma — so the same windows are used on both sides.
      if (mean(gate ? sub(gate, x, y) : patch) < floor) continue;
      const sp = spatialStats(patch, ps, block);
      const g = gridEnergy(patch, ps, periods);
      for (const p of periods) acc[`sgrid${p}`] += g[`grid${p}`];
      block2 += sp.blockStd;
      hp2 += sp.hpStd;
      n++;
    }
  }
  if (!n) return { structWindows: 0 };
  const out = { structWindows: n, structBlock: block2 / n, structHp: hp2 / n };
  let peak = 0, peakP = 0;
  for (const p of periods) {
    const v = acc[`sgrid${p}`] / n;
    out[`sgrid${p}`] = v;
    if (v > peak) { peak = v; peakP = p; }
  }
  out.structGridPeak = peak;
  out.structGridPeakPeriod = peakP;
  return out;
}

/**
 * CHROMATICITY STRUCTURE — the instrument the ReSTIR GI artifact actually needs.
 *
 * Everything above (rmse, gridEnergy, blockStd, hpStd, stillNoise) is luma or
 * luma-dominated, and the artifact this measures is not: the ReSTIR resolve's
 * luminance is a running mean over the reservoir's history while its COLOUR was
 * one selected sample's chromaticity, so the error is almost purely chromatic.
 * That is exactly why the campaign's rmse read "free" — the mean colour is
 * right — and why its gridPeak signal was weak and unstable: it was seeing a
 * second-order luma consequence of a first-order colour problem.
 *
 * Per window, r/luma and b/luma are formed (x100, so the units are percent of
 * chromaticity), plane-detrended like every other statistic here, and reduced to
 * a block std (coarse colour blotching), a high-pass std (colour grain) and the
 * a-trous grid amplitudes. Dark windows are skipped: chromaticity is meaningless
 * where there is no light, and dividing by a near-zero luma would dominate the
 * average with noise.
 */
function frameChromaStructure(buf, w, h, ps, periods, block, floor = 12) {
  const stride = Math.round(ps / 2);
  const acc = {};
  for (const p of periods) acc[p] = 0;
  let blockSum = 0, hpSum = 0, n = 0;
  for (let y = 0; y + ps <= h; y += stride) {
    for (let x = 0; x + ps <= w; x += stride) {
      const cr = new Float32Array(ps * ps);
      const cb = new Float32Array(ps * ps);
      let lsum = 0;
      for (let py = 0; py < ps; py++) {
        for (let px = 0; px < ps; px++) {
          const i = ((y + py) * w + (x + px)) * 4;
          const l = buf[i] * LUMA[0] + buf[i + 1] * LUMA[1] + buf[i + 2] * LUMA[2];
          lsum += l;
          const k = py * ps + px;
          const d = Math.max(l, 1e-3);
          cr[k] = (buf[i] / d) * 100;
          cb[k] = (buf[i + 2] / d) * 100;
        }
      }
      if (lsum / (ps * ps) < floor) continue;
      for (const plane of [cr, cb]) {
        const sp = spatialStats(plane, ps, block);
        const g = gridEnergy(plane, ps, periods);
        for (const p of periods) acc[p] += g[`grid${p}`] / 2;
        blockSum += sp.blockStd / 2;
        hpSum += sp.hpStd / 2;
      }
      n++;
    }
  }
  if (!n) return { chromaWindows: 0 };
  const out = { chromaWindows: n, chromaBlock: blockSum / n, chromaHp: hpSum / n };
  let peak = 0, peakP = 0;
  for (const p of periods) {
    const v = acc[p] / n;
    out[`cgrid${p}`] = v;
    if (v > peak) { peak = v; peakP = p; }
  }
  out.chromaGridPeak = peak;
  out.chromaGridPeakPeriod = peakP;
  return out;
}

/**
 * Border bias: the a-trous filter drops taps that fall outside the image, so at
 * wide steps the kernel becomes one-sided near the frame edge. Measured as the
 * relative luma difference between a border ring and the interior on the
 * 320x180 downsample. A pass-count-dependent value is a real edge artifact.
 */
function borderBias(rgb, w, h, ringFrac = 0.08) {
  const rw = Math.max(2, Math.round(w * ringFrac));
  const rh = Math.max(2, Math.round(h * ringFrac));
  let ringSum = 0, ringN = 0, innSum = 0, innN = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const l = rgb[i] * LUMA[0] + rgb[i + 1] * LUMA[1] + rgb[i + 2] * LUMA[2];
      const isRing = x < rw || x >= w - rw || y < rh || y >= h - rh;
      if (isRing) { ringSum += l; ringN++; } else { innSum += l; innN++; }
    }
  }
  const ring = ringSum / ringN, inner = innSum / innN;
  return inner > 1e-3 ? (ring - inner) / inner : 0;
}

// ---------------------------------------------------------------------------
// framebuffer capture + PNG archive
// ---------------------------------------------------------------------------
let capW = BASE_W, capH = BASE_H;
let capBuf = new Uint8Array(BASE_W * BASE_H * 4);

/** Read the whole drawing buffer. MUST be called in the same task as the render. */
function readFrame() {
  if (capBuf.length !== capW * capH * 4) capBuf = new Uint8Array(capW * capH * 4);
  gl.readPixels(0, 0, capW, capH, gl.RGBA, gl.UNSIGNED_BYTE, capBuf);
  return capBuf;
}

// ---------------------------------------------------------------------------
// RAW ReSTIR-GI probe (plan=restirgi)
// ---------------------------------------------------------------------------
/**
 * Read GIReservoirPass attachment 2 — the resolved, demodulated GI irradiance —
 * straight off the GPU at LIGHTING resolution, BEFORE the à-trous denoiser, the
 * (1-metalness) weight, the composite or the tonemap have touched it.
 *
 * Every other instrument in this file sees the filtered, tonemapped sum, which
 * cannot separate "the ReSTIR resolve is itself structured" from "the denoiser
 * amplifies an otherwise fine signal" — the two live hypotheses. This can.
 *
 * GIReservoirPass.render() swaps its ping-pong targets and returns the OLD
 * targetA, so after a render the just-written attachments live in targetB.
 * Same-task rule applies exactly as it does to readFrame().
 */
function readGiRaw() {
  const target = rt?.giReservoirPass?.targetB;
  if (!target) return null;
  const props = renderer.properties.get(target);
  let fb = props.__webglFramebuffer;
  if (Array.isArray(fb)) fb = fb[0];
  if (!fb) return null;
  const w = target.width, h = target.height;
  const buf = new Float32Array(w * h * 4);
  renderer.state.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.readBuffer(gl.COLOR_ATTACHMENT2);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, buf);
  gl.readBuffer(gl.COLOR_ATTACHMENT0);
  renderer.state.bindFramebuffer(gl.FRAMEBUFFER, null);
  renderer.setRenderTarget(null);
  return { buf, w, h };
}

/**
 * A size x size window of a raw-GI buffer, split into a luma plane and the two
 * CHROMATICITY planes r/luma and b/luma. The split matters: the resolve's luma
 * is algebraically wSum/(PI*M) — an M-frame running mean — while its colour is
 * the chromaticity of ONE stochastically selected sample, so the two planes have
 * completely different noise characters and have to be measured apart.
 * `frac` is (x, y-from-top) as everywhere else; the GL buffer is bottom-up.
 */
function giWindow(g, frac, size) {
  const s = Math.min(size, g.w, g.h);
  const x0 = Math.min(g.w - s, Math.max(0, Math.round(frac[0] * g.w - s / 2)));
  const yTop = Math.min(g.h - s, Math.max(0, Math.round(frac[1] * g.h - s / 2)));
  const y0 = g.h - s - yTop;
  const lum = new Float32Array(s * s);
  const cr = new Float32Array(s * s);
  const cb = new Float32Array(s * s);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const i = ((y0 + y) * g.w + (x0 + x)) * 4;
      const r = g.buf[i], gg = g.buf[i + 1], b = g.buf[i + 2];
      const l = r * LUMA[0] + gg * LUMA[1] + b * LUMA[2];
      const k = y * s + x;
      lum[k] = l;
      cr[k] = l > 1e-7 ? r / l : 1;
      cb[k] = l > 1e-7 ? b / l : 1;
    }
  }
  return { lum, cr, cb, size: s };
}

/**
 * Structure statistics of one raw-GI window, in PERCENT OF THE WINDOW MEAN so
 * scenes of different brightness are comparable. Grid periods are the à-trous
 * tap spacings in LIGHTING texels (1,2,4,8,16,32) — this buffer IS at lighting
 * resolution, so no renderScale conversion is needed.
 */
function giStats(win) {
  const mu = mean(win.lum);
  if (!(mu > 1e-7)) return { giMean: mu, giHp: 0, giBlock: 0, giBlotch: 0, giGridPeak: 0, giChroma: 0 };
  const scaled = new Float32Array(win.lum.length);
  for (let i = 0; i < scaled.length; i++) scaled[i] = (win.lum[i] * 100) / mu;
  const sp = spatialStats(scaled, win.size, 16);
  const g = gridEnergy(scaled, win.size, [1, 2, 4, 8, 16, 32].filter((p) => p >= 2 && p <= win.size / 2));
  // Chromaticity spread: std of r/luma and b/luma over the window. A resolve
  // whose colour is one held sample scatters this; a colour-averaged one does not.
  const chroma = (std(win.cr) + std(win.cb)) / 2;
  // Same split at BLOCK scale — coarse colour blotching specifically.
  const nb = Math.floor(win.size / 16);
  const cmr = [], cmb = [];
  for (let by = 0; by < nb; by++) {
    for (let bx = 0; bx < nb; bx++) {
      let sr = 0, sb = 0;
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const k = (by * 16 + y) * win.size + bx * 16 + x;
        sr += win.cr[k]; sb += win.cb[k];
      }
      cmr.push(sr / 256); cmb.push(sb / 256);
    }
  }
  return {
    giMean: mu,
    giHp: sp.hpStd,
    giBlock: sp.blockStd,
    giBlotch: sp.blotch,
    giGrid: g,
    giGridPeak: g.gridPeak,
    giGridPeakPeriod: g.gridPeakPeriod,
    giChroma: chroma,
    giChromaBlock: (std(Float32Array.from(cmr)) + std(Float32Array.from(cmb))) / 2,
  };
}

/** Encode a raw-GI buffer as a viewable RGBA byte frame at a fixed gain. */
function giToBytes(g, gain) {
  const out = new Uint8Array(g.w * g.h * 4);
  for (let i = 0; i < g.w * g.h; i++) {
    for (let c = 0; c < 3; c++) {
      const v = Math.pow(Math.max(0, g.buf[i * 4 + c] * gain), 1 / 2.2) * 255;
      out[i * 4 + c] = Math.min(255, Math.max(0, Math.round(v)));
    }
    out[i * 4 + 3] = 255;
  }
  return out;
}

const pngCanvas = document.createElement("canvas");
const pngCtx = pngCanvas.getContext("2d");

/** Encode an RGBA byte frame (GL bottom-up) as a PNG data URL, flipped upright. */
function encodePng(buf, w, h, gridOverlay = false) {
  pngCanvas.width = w; pngCanvas.height = h;
  const img = pngCtx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const src = (h - 1 - y) * w * 4;
    img.data.set(buf.subarray(src, src + w * 4), y * w * 4);
  }
  for (let i = 3; i < img.data.length; i += 4) img.data[i] = 255;
  pngCtx.putImageData(img, 0, 0);
  if (gridOverlay) {
    pngCtx.strokeStyle = "rgba(255,0,255,0.55)";
    pngCtx.fillStyle = "rgba(255,0,255,0.95)";
    pngCtx.font = "12px monospace";
    pngCtx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      const x = (w * i) / 10, y = (h * i) / 10;
      pngCtx.beginPath(); pngCtx.moveTo(x, 0); pngCtx.lineTo(x, h); pngCtx.stroke();
      pngCtx.beginPath(); pngCtx.moveTo(0, y); pngCtx.lineTo(w, y); pngCtx.stroke();
      pngCtx.fillText((i / 10).toFixed(1), x + 2, 12);
      pngCtx.fillText((i / 10).toFixed(1), 2, y - 2);
    }
  }
  return pngCanvas.toDataURL("image/png");
}

const archive = [];   // index.json rows

async function savePng(name, buf, w, h, gridOverlay = false) {
  const url = encodePng(buf, w, h, gridOverlay);
  const b64 = url.slice(url.indexOf(",") + 1);
  await fetch(`/__campaign/img?name=${encodeURIComponent(name)}`, { method: "POST", body: b64 });
  return `${name}.png`;
}

async function saveJson(name, obj) {
  await fetch(`/__campaign/json?name=${encodeURIComponent(name)}`, {
    method: "POST", body: JSON.stringify(obj, null, 2),
  });
}

// ---------------------------------------------------------------------------
// config application
// ---------------------------------------------------------------------------
let rt = null;
let scene = null;
let sceneDef = null;
let currentCanvasScale = 1;

function setCanvasScale(s) {
  const w = Math.round(BASE_W * s), h = Math.round(BASE_H * s);
  if (w === capW && h === capH) return;
  renderer.setSize(w, h, false);
  rt.setSize(w, h);
  capW = w; capH = h;
  currentCanvasScale = s;
}

/** Apply a full config to the renderer. One axis differs from BASELINE at a time. */
function applyConfig(cfg) {
  rt.adaptiveQuality = false;
  rt.overloadProtection = false;
  setCanvasScale(cfg.canvasScale);
  rt.taaJitterScale = cfg.canvasScale;
  rt.gi = cfg.gi;
  rt.giHalfRate = cfg.giHalfRate;
  rt.emissiveNEE = cfg.emissiveNEE;
  rt.reflections = cfg.reflections;
  rt.refraction = cfg.refraction;
  rt.specular = cfg.specular;
  rt.transparency = cfg.transparency;
  rt.restir = cfg.restir;
  rt.restirGI = cfg.restirGI;
  rt.stochasticLights = cfg.stochasticLights;
  rt.denoise = cfg.denoise;
  rt.denoiseIterations = cfg.denoiseIterations;
  rt.taa = cfg.taa;
  rt.volumetric.enabled = cfg.volumetric;
  rt.maxHistory = cfg.maxHistory;
  rt.taaBlend = cfg.taaBlend;
  rt.motionAdaptive = cfg.motionAdaptive;
  rt.maxHistoryMoving = cfg.maxHistoryMoving;
  rt.taaBlendMoving = cfg.taaBlendMoving;
  rt.restirMCap = cfg.restirMCap;
  rt.restirMCapMoving = cfg.restirMCapMoving;
  rt.denoiseMaxStep = cfg.denoiseMaxStep;
  rt.denoiseStepJitter = cfg.denoiseStepJitter;
  rt.denoiseWideDamp = cfg.denoiseWideDamp;
  rt.restirGIMCap = cfg.restirGIMCap ?? 20;
  rt.restirGISpatialTaps = cfg.restirGISpatialTaps ?? 2;
  rt.restirGIValidate = cfg.restirGIValidate ?? 8;
  rt.restirGIResolveAlpha = cfg.restirGIResolveAlpha ?? 1.0;
  rt.restirGIConfLow = cfg.restirGIConfLow ?? 0.3;
  rt.restirGIChromaMean = cfg.restirGIChromaMean ?? true;
  rt.restirGIVisFallback = cfg.restirGIVisFallback ?? true;
  // These two are accessors that recompile the lighting megakernel — set last
  // and let the caller settle a few frames before timing.
  rt.absorptionShadows = cfg.absorptionShadows;
  rt.kmScattering = cfg.kmScattering;
  rt.renderScale = cfg.renderScale;  // setter reallocates lighting targets
  rt.resetAccumulation();
}

function setCam(pos, target) {
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(target[0], target[1], target[2]);
  camera.updateMatrixWorld();
}

/** Render n frames, chunked so the tab stays responsive. Temporal state persists. */
async function renderN(n, chunk = 30) {
  let done = 0;
  while (done < n) {
    const k = Math.min(chunk, n - done);
    for (let i = 0; i < k; i++) rt.render(scene, camera);
    done += k;
    if (done < n) await nextFrame();
  }
}

/** Fence-timed ms/frame: warmup 20, fence, time `frames`, fence. One task. */
function timeBlock(frames = 60) {
  for (let i = 0; i < 20; i++) rt.render(scene, camera);
  fence();
  const t0 = performance.now();
  for (let i = 0; i < frames; i++) rt.render(scene, camera);
  fence();
  return (performance.now() - t0) / frames;
}

// ---------------------------------------------------------------------------
// camera paths (identical across configs — the deterministic part cancels)
// ---------------------------------------------------------------------------
const PATH_STEPS = 60;
const ORBIT_DEG_PER_FRAME = 0.35;
const STRAFE_FRAC_PER_FRAME = 0.009;

function pathPose(kind, step) {
  const t = new THREE.Vector3(...sceneDef.target);
  const p0 = new THREE.Vector3(...sceneDef.cam);
  const rel = p0.clone().sub(t);
  if (kind === "orbit") {
    const a = THREE.MathUtils.degToRad(ORBIT_DEG_PER_FRAME * step);
    const x = rel.x * Math.cos(a) - rel.z * Math.sin(a);
    const z = rel.x * Math.sin(a) + rel.z * Math.cos(a);
    return { pos: [t.x + x, t.y + rel.y, t.z + z], target: sceneDef.target };
  }
  // strafe: slide the camera sideways (and its look-at with it) so the whole
  // frame translates — the disocclusion-heaviest motion for a temporal renderer.
  const dir = rel.clone().normalize();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
  const d = rel.length() * STRAFE_FRAC_PER_FRAME * step;
  return {
    pos: [p0.x + right.x * d, p0.y + right.y * d, p0.z + right.z * d],
    target: [t.x + right.x * d, t.y + right.y * d, t.z + right.z * d],
  };
}

const CHECKPOINTS = [30, 60];

// ---------------------------------------------------------------------------
// per-scene references (built once per scene per repeat, at REFERENCE config)
// ---------------------------------------------------------------------------
const refs = { still: null, stillFull: null, sharp: 0, poses: {} };
/** restirGI-off luma frames, keyed by denoise setting (see the diff structure). */
const offRefs = new Map();

async function buildReferences(convergeRef) {
  setStatus("building references…");
  applyConfig(REFERENCE);
  await nextFrame();

  setCam(sceneDef.cam, sceneDef.target);
  rt.resetAccumulation();
  await renderN(convergeRef);
  rt.render(scene, camera);
  const buf = readFrame();
  refs.still = downsample(buf, capW, capH, DS_W, DS_H);
  refs.stillFull = bilinearTo(buf, capW, capH, BASE_W, BASE_H);
  refs.sharp = sharpness(refs.stillFull, BASE_W, BASE_H);
  archive.push({
    file: await savePng(nameFor("REFERENCE", "still"), buf, capW, capH),
    scene: SCENE_ID, rep: REP, kind: "reference-still", config: REFERENCE,
  });

  if (MOVING_OFF) { setStatus("references built (still only)."); return; }
  for (const kind of ["orbit", "strafe"]) {
    for (const step of CHECKPOINTS) {
      const pose = pathPose(kind, step);
      setCam(pose.pos, pose.target);
      rt.resetAccumulation();
      await renderN(Math.round(convergeRef * 0.5));
      rt.render(scene, camera);
      const b = readFrame();
      refs.poses[`${kind}${step}`] = downsample(b, capW, capH, DS_W, DS_H);
      archive.push({
        file: await savePng(nameFor("REFERENCE", `pose-${kind}${step}`), b, capW, capH),
        scene: SCENE_ID, rep: REP, kind: "reference-pose", path: kind, step, config: REFERENCE,
      });
      await nextFrame();
    }
  }
  setStatus("references built.");
}

// ---------------------------------------------------------------------------
// naming
// ---------------------------------------------------------------------------
function stamp(cfg) {
  return [
    `rs${String(cfg.renderScale).replace(".", "")}`,
    `cs${String(cfg.canvasScale).replace(".", "")}`,
    `dn${cfg.denoise ? cfg.denoiseIterations : "off"}`,
    `taa${cfg.taa ? 1 : 0}`,
    `hr${cfg.giHalfRate ? 1 : 0}`,
    `re${cfg.restir ? 1 : 0}`,
    `gi${cfg.gi ? 1 : 0}`,
  ].join("_");
}
function nameFor(label, kind, cfg) {
  const s = cfg ? stamp(cfg) : "ref";
  return `${SCENE_ID}__${PLAN}__${label}__${s}__${kind}__r${REP}`;
}

// ---------------------------------------------------------------------------
// the measurement of ONE config
// ---------------------------------------------------------------------------
async function measure(label, cfg, opts = {}) {
  const converge = opts.converge ?? 180;
  const doMoving = !!opts.moving && !MOVING_OFF;
  setStatus(`${SCENE_ID} r${REP}: ${label}`);

  applyConfig(cfg);
  await nextFrame();
  setCam(sceneDef.cam, sceneDef.target);
  rt.resetAccumulation();

  const ps = Math.max(32, Math.round(96 * cfg.canvasScale));
  const px = (frac) => {
    // fractional (x, y-from-top) -> GL pixel origin of a ps x ps patch
    const x = Math.min(capW - ps, Math.max(0, Math.round(frac[0] * capW - ps / 2)));
    const yTop = Math.min(capH - ps, Math.max(0, Math.round(frac[1] * capH - ps / 2)));
    return [x, capH - ps - yTop];   // GL origin is bottom-left
  };
  // The grid probe wants a bigger window than the 96px metric patches: the
  // widest a-trous step is 32 lighting texels = 64 screen px at renderScale 0.5,
  // and a DFT bin needs at least two cycles inside the window.
  const probeS = Math.max(48, Math.round(128 * cfg.canvasScale));
  const pxN = (frac, size) => {
    const x = Math.min(capW - size, Math.max(0, Math.round(frac[0] * capW - size / 2)));
    const yTop = Math.min(capH - size, Math.max(0, Math.round(frac[1] * capH - size / 2)));
    return [x, capH - size - yTop];
  };
  const sites = {};
  for (const [k, frac] of Object.entries(sceneDef.patches)) sites[k] = px(frac);
  const probeSite = pxN(sceneDef.patches.probe ?? sceneDef.patches.flat, probeS);

  // --- converge, then the still-frame image metrics --------------------------
  await renderN(converge);
  rt.render(scene, camera);
  const conv = readFrame();
  const convDs = downsample(conv, capW, capH, DS_W, DS_H);
  const convFull = bilinearTo(conv, capW, capH, BASE_W, BASE_H);
  const stillFile = await savePng(nameFor(label, "still", cfg), conv, capW, capH);

  const flatPatch = lumaPatch(conv, capW, capH, sites.flat[0], sites.flat[1], ps);
  const litPatch = lumaPatch(conv, capW, capH, sites.lit[0], sites.lit[1], ps);
  const shadowPatch = lumaPatch(conv, capW, capH, sites.shadow[0], sites.shadow[1], ps);
  const sp = spatialStats(flatPatch, ps, Math.max(8, Math.round(16 * cfg.canvasScale)));
  const litM = mean(litPatch), shM = mean(shadowPatch);

  const sharpNow = sharpness(convFull, BASE_W, BASE_H);
  const m = {
    rmse320: rmse(convDs, refs.still),
    rmseFull: rmse(convFull, refs.stillFull),
    sharp: sharpNow,
    sharpRatio: refs.sharp > 1e-6 ? sharpNow / refs.sharp : 0,
    hpStd: sp.hpStd,
    pixStd: sp.pixStd,
    blockStd: sp.blockStd,
    blotch: sp.blotch,
    borderBias: borderBias(convDs, DS_W, DS_H),
    shadowContrast: litM > 1e-3 ? (litM - shM) / litM : 0,
    litMean: litM,
    shadowMean: shM,
  };
  // Grid-periodicity probe. Candidate periods are the a-trous tap spacings
  // (1,2,4,8,16,32 lighting texels) expressed in SCREEN pixels, which is what
  // the framebuffer sees: texels / renderScale, then * canvasScale for a
  // reduced drawing buffer.
  const texToScreen = (cfg.canvasScale / cfg.renderScale);
  const periods = [1, 2, 4, 8, 16, 32].map((s) => Math.round(s * texToScreen)).filter((p) => p >= 2 && p <= probeS / 2);
  const probePatch = lumaPatch(conv, capW, capH, probeSite[0], probeSite[1], probeS);
  const g = gridEnergy(probePatch, probeS, [...new Set(periods)]);
  m.grid = g;
  m.gridPeak = g.gridPeak;
  m.gridPeakPeriod = g.gridPeakPeriod;
  // Amplitude at the widest step this config actually runs — the direct
  // "is the top pass ringing?" number.
  const topStepScreen = Math.round((1 << Math.max(0, (cfg.denoise ? cfg.denoiseIterations : 1) - 1)) * texToScreen);
  m.gridAtTopStep = g[`grid${topStepScreen}`] ?? null;
  m.topStepScreenPx = topStepScreen;
  const probeStats = spatialStats(probePatch, probeS, Math.max(8, Math.round(16 * cfg.canvasScale)));
  m.probeBlotch = probeStats.blotch;
  m.probeHpStd = probeStats.hpStd;
  m.probeBlockStd = probeStats.blockStd;
  // The same statistics averaged over the WHOLE frame.
  const uniqPeriods = [...new Set(periods)];
  const blockPx = Math.max(8, Math.round(16 * cfg.canvasScale));
  const convL = lumaPlane(conv, capW, capH);
  Object.assign(m, frameStructure(convL, capW, capH, probeS, uniqPeriods, blockPx));
  if (PLAN.startsWith("restirgi")) {
    Object.assign(m, frameChromaStructure(conv, capW, capH, probeS, uniqPeriods, blockPx));
  }

  // --- ARTIFACT-ISOLATING structure (restirgi plans) -------------------------
  // Absolute frame structure is dominated by the SCENE — walls, silhouettes,
  // shading gradients — which the plane detrend only partly removes, so a
  // whole-frame average reads 1.02x for a config with visible confetti and a
  // single window reads whatever its one realization happens to be. Neither
  // ranks configs. The DIFFERENCE against the restirGI-off frame at the same
  // denoise setting has no scene content in it at all: this renderer is
  // deterministic, so on-minus-off is exactly what swapping the inline GI path
  // for the ReSTIR one did to the image. Its detrended block/grid structure is
  // the artifact amplitude, full stop — and it is the same field the amplified
  // difference crops show the eye.
  if (PLAN.startsWith("restirgi")) {
    const key = `dn${cfg.denoise ? cfg.denoiseIterations : 0}`;
    const cr = new Float32Array(convL.length);
    const cb = new Float32Array(convL.length);
    for (let i = 0, j = 0; i < convL.length; i++, j += 4) {
      const d = Math.max(convL[i], 1e-3);
      cr[i] = (conv[j] / d) * 100;
      cb[i] = (conv[j + 2] / d) * 100;
    }
    if (!cfg.restirGI) {
      offRefs.set(key, { L: convL, cr, cb });
    } else if (offRefs.has(key)) {
      const ref = offRefs.get(key);
      const dL = new Float32Array(convL.length);
      const dcr = new Float32Array(convL.length);
      const dcb = new Float32Array(convL.length);
      let mad = 0;
      for (let i = 0; i < dL.length; i++) {
        dL[i] = convL[i] - ref.L[i];
        dcr[i] = cr[i] - ref.cr[i];
        dcb[i] = cb[i] - ref.cb[i];
        mad += Math.abs(dL[i]);
      }
      m.diffMeanAbs = mad / dL.length;
      const ds = frameStructure(dL, capW, capH, probeS, uniqPeriods, blockPx, 12, ref.L);
      for (const [k, v] of Object.entries(ds)) {
        m[k.startsWith("struct") ? "diff" + k.slice(6) : "d" + k] = v;
      }
      // ...and the same on the two CHROMATICITY planes. This is THE number: a
      // difference field carries no scene content, and chromaticity is the axis
      // the artifact lives on, so this is the artifact's amplitude with nothing
      // else mixed in.
      const a = frameStructure(dcr, capW, capH, probeS, uniqPeriods, blockPx, 12, ref.L);
      const b = frameStructure(dcb, capW, capH, probeS, uniqPeriods, blockPx, 12, ref.L);
      m.dChromaBlock = (a.structBlock + b.structBlock) / 2;
      m.dChromaHp = (a.structHp + b.structHp) / 2;
      let peak = 0, peakP = 0;
      for (const p of uniqPeriods) {
        const v = ((a[`sgrid${p}`] ?? 0) + (b[`sgrid${p}`] ?? 0)) / 2;
        m[`dcgrid${p}`] = v;
        if (v > peak) { peak = v; peakP = p; }
      }
      m.dChromaGridPeak = peak;
      m.dChromaGridPeakPeriod = peakP;
    }
  }

  // --- still temporal noise: 30 frames, patch read in the render's own task ---
  const noiseFrames = 30;
  const prev = {};
  const acc = { center: 0, shadow: 0, spec: 0 };
  let fullAcc = 0;
  let prevFull = null;
  for (let f = 0; f < noiseFrames; f++) {
    rt.render(scene, camera);
    const patches = {};
    for (const k of ["center", "shadow", "spec"]) {
      const b = new Uint8Array(ps * ps * 4);
      gl.readPixels(sites[k][0], sites[k][1], ps, ps, gl.RGBA, gl.UNSIGNED_BYTE, b);
      patches[k] = b;
    }
    const full = downsample(readFrame(), capW, capH, DS_W, DS_H);
    if (f > 0) {
      for (const k of ["center", "shadow", "spec"]) acc[k] += meanAbs(patches[k], prev[k]);
      fullAcc += meanAbs(full, prevFull);
    }
    Object.assign(prev, patches);
    prevFull = full;
    if (f % 10 === 9) await nextFrame();
  }
  m.stillNoiseCenter = acc.center / (noiseFrames - 1);
  m.stillNoiseShadow = acc.shadow / (noiseFrames - 1);
  m.stillNoiseSpec = acc.spec / (noiseFrames - 1);
  m.stillNoiseFull = fullAcc / (noiseFrames - 1);

  // --- timing: two independent fence-timed blocks ----------------------------
  await nextFrame();
  setCam(sceneDef.cam, sceneDef.target);
  const b1 = timeBlock(60);
  await nextFrame();
  const b2 = timeBlock(60);
  m.frameMsBlocks = [b1, b2];
  m.frameMs = (b1 + b2) / 2;
  m.fps = 1000 / m.frameMs;
  m.timingSpread = Math.abs(b1 - b2) / m.frameMs;
  m.timingNoisy = m.timingSpread > 0.10;

  const files = { still: stillFile };

  // --- RAW ReSTIR-GI probe: the resolve as the denoiser receives it ----------
  // Runs on the converged, parked camera (the still-noise loop and the timing
  // blocks above added ~190 more static frames, so the reservoir is as settled
  // as it will ever get). Reports the resolve's own structure, its colour
  // spread, and how much of the pattern survives 8 frames — the direct test of
  // "quasi-static blotch the temporal filters cannot average".
  if (PLAN.startsWith("restirgi") && cfg.restirGI) {
    rt.render(scene, camera);
    const g0 = readGiRaw();
    if (g0) {
      const frac = sceneDef.patches.probe ?? sceneDef.patches.flat;
      const winSize = Math.max(32, Math.round(128 * cfg.renderScale));
      const a = giWindow(g0, frac, winSize);
      Object.assign(m, giStats(a));
      const aBytes = giToBytes(g0, 3);
      files.giRaw = await savePng(nameFor(label, "giraw", cfg), aBytes, g0.w, g0.h);
      for (let k = 0; k < 8; k++) rt.render(scene, camera);
      const g1 = readGiRaw();
      if (g1) {
        const b = giWindow(g1, frac, winSize);
        m.giTemporalCorr = corr(detrend(a.lum, a.size), detrend(b.lum, b.size));
        m.giChromaCorr = corr(detrend(a.cr, a.size), detrend(b.cr, b.size));
        const mu = mean(a.lum);
        let d = 0;
        for (let i = 0; i < a.lum.length; i++) d += Math.abs(a.lum[i] - b.lum[i]);
        m.giFrameDelta = mu > 1e-7 ? d / a.lum.length / mu : 0;
      }
    } else {
      m.giProbeFailed = true;
    }
  }

  // --- moving ---------------------------------------------------------------
  if (doMoving) {
    for (const kind of ["orbit", "strafe"]) {
      const start = pathPose(kind, 0);
      setCam(start.pos, start.target);
      rt.resetAccumulation();
      await renderN(120);

      let churn = 0, churnN = 0, motionSum = 0;
      let prevDs = null;
      const errs = [];
      // ONE synchronous task per step: move the camera, render, read back.
      for (let s = 1; s <= PATH_STEPS; s++) {
        const pose = pathPose(kind, s);
        setCam(pose.pos, pose.target);
        rt.render(scene, camera);
        motionSum += rt.motion ?? 0;
        const ds = downsample(readFrame(), capW, capH, DS_W, DS_H);
        if (prevDs && s >= 8) { churn += meanAbs(ds, prevDs); churnN++; }
        prevDs = ds;
        if (CHECKPOINTS.includes(s)) {
          const ref = refs.poses[`${kind}${s}`];
          if (ref) errs.push(rmse(ds, ref));
          if (s === CHECKPOINTS[0]) {
            files[`move-${kind}`] = await savePng(nameFor(label, `move-${kind}`, cfg), capBuf, capW, capH);
          }
        }
        if (s % 12 === 0) await nextFrame();
      }
      m[`moveChurn_${kind}`] = churnN ? churn / churnN : null;
      m[`moveErr_${kind}`] = errs.length ? mean(errs) : null;
      m[`motion_${kind}`] = motionSum / PATH_STEPS;

      // one frame after the motion stops — the "smear" frame
      rt.render(scene, camera);
      files[`settle-${kind}`] = await savePng(nameFor(label, `settle1-${kind}`, cfg), readFrame(), capW, capH);
      await nextFrame();
    }

    // --- ghost decay, bench.html-comparable -------------------------------
    Object.assign(m, await ghostProbe(cfg, "orbit", "ghost"));
    // The ghosting arm also runs the strafe probe (far more disocclusion), plus
    // a capture of the worst frame so a trail can be looked at, not just scored.
    if (opts.ghostStrafe) {
      Object.assign(m, await ghostProbe(cfg, "strafe", "ghostS"));
      rt.render(scene, camera);
      files["ghost-settle"] = await savePng(nameFor(label, "ghostSettle1", cfg), readFrame(), capW, capH);
    }
  }

  for (const [kind, file] of Object.entries(files)) {
    archive.push({ file, scene: SCENE_ID, plan: PLAN, rep: REP, label, kind, config: cfg, metrics: m });
  }
  return { label, config: cfg, metrics: m, files };
}

/** 95th percentile of per-pixel |luma difference| between two float RGB buffers. */
function p95Abs(a, b) {
  const n = a.length / 3;
  const d = new Float32Array(n);
  for (let i = 0, j = 0; i < n; i++, j += 3) {
    const la = a[j] * LUMA[0] + a[j + 1] * LUMA[1] + a[j + 2] * LUMA[2];
    const lb = b[j] * LUMA[0] + b[j + 1] * LUMA[1] + b[j + 2] * LUMA[2];
    d[i] = Math.abs(la - lb);
  }
  d.sort();
  return d[Math.min(n - 1, Math.floor(n * 0.95))];
}

/**
 * Ghosting probe. `orbit` reproduces bench.html exactly so the numbers stay
 * comparable with the repo's saved history: settle at B (this config) for the
 * reference patch, settle at A, sweep A->B over 24 frames, park at B and read
 * the centered 96x96 patch after 1/5/10/20/40 further frames.
 *
 * Two additions, because a centre patch is the WRONG place to look for a trail:
 * ghosting lives at disocclusion edges, which are spread over the frame and are
 * a small fraction of its pixels. `ghostFull*` is the same difference over the
 * whole frame at 320x180, and `ghostP95*` is its 95th percentile — the one that
 * actually tracks "there is a visible smear somewhere". A `strafe` run is
 * available too: sliding sideways disoccludes far more than orbiting does.
 */
async function ghostProbe(cfg, kind = "orbit", prefix = "ghost") {
  const ps = Math.max(32, Math.round(96 * cfg.canvasScale));
  const gx = Math.round((capW - ps) / 2), gy = Math.round((capH - ps) / 2);
  const readG = () => {
    const b = new Uint8Array(ps * ps * 4);
    gl.readPixels(gx, gy, ps, ps, gl.RGBA, gl.UNSIGNED_BYTE, b);
    return b;
  };
  const poseB = pathPose(kind, 0);
  const poseA = pathPose(kind, 60);

  setCam(poseB.pos, poseB.target);
  rt.resetAccumulation();
  await renderN(150);
  rt.render(scene, camera);
  const ref = readG();
  const refFull = downsample(readFrame(), capW, capH, DS_W, DS_H);

  setCam(poseA.pos, poseA.target);
  rt.resetAccumulation();
  await renderN(60);
  const a = new THREE.Vector3(...poseA.pos), b = new THREE.Vector3(...poseB.pos);
  const at = new THREE.Vector3(...poseA.target), bt = new THREE.Vector3(...poseB.target);
  const p = new THREE.Vector3(), t = new THREE.Vector3();
  for (let s = 1; s <= 24; s++) {
    p.lerpVectors(a, b, s / 24);
    t.lerpVectors(at, bt, s / 24);
    camera.position.copy(p);
    camera.lookAt(t.x, t.y, t.z);
    camera.updateMatrixWorld();
    rt.render(scene, camera);
  }

  setCam(poseB.pos, poseB.target);
  const checkpoints = [1, 5, 10, 20, 40];
  const out = {};
  let rendered = 0;
  for (const c of checkpoints) {
    while (rendered < c) { rt.render(scene, camera); rendered++; }
    const patch = readG();
    const full = downsample(readFrame(), capW, capH, DS_W, DS_H);
    out[`${prefix}${c}`] = meanAbs(patch, ref);
    out[`${prefix}Full${c}`] = meanAbs(full, refFull);
    out[`${prefix}P95_${c}`] = p95Abs(full, refFull);
    await nextFrame();
  }
  return out;
}

// ---------------------------------------------------------------------------
// config lists
// ---------------------------------------------------------------------------
function qualityAxisConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over }, moving: true });
  add("baseline", {});
  for (const v of [0.125, 0.25, 0.375, 1.0]) add(`rs-${v}`, { renderScale: v });
  for (const v of [0.5, 0.75, 0.85]) add(`cs-${v}`, { canvasScale: v });
  for (const v of [0, 1, 3, 4, 5, 6]) add(`dn-${v}`, { denoiseIterations: v, denoise: v > 0 });
  add("taa-off", { taa: false });
  add("halfrate-on", { giHalfRate: true });
  add("restir-off", { restir: false });
  return out;
}

function featureCostConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over }, moving: false });
  // OFF from baseline: the delta IS the feature's cost.
  add("cost-gi-off", { gi: false });
  add("cost-nee-off", { emissiveNEE: false });
  add("cost-refl-off", { reflections: false });
  add("cost-refr-off", { refraction: false });
  add("cost-spec-off", { specular: false });
  add("cost-transp-off", { transparency: false });
  add("cost-absorb-off", { absorptionShadows: false });
  add("cost-denoise-off", { denoise: false, denoiseIterations: 0 });
  add("cost-taa-off", { taa: false });
  add("cost-restir-off", { restir: false });
  // ON from baseline: opt-in features.
  add("cost-km-on", { kmScattering: true });
  add("cost-vol-on", { volumetric: true });
  add("cost-restirgi-on", { restirGI: true });
  add("cost-halfrate-on", { giHalfRate: true });
  add("cost-stochastic-on", { stochasticLights: true });
  return out;
}

/**
 * The 4+ pass artifact study. Two lighting resolutions, because the à-trous tap
 * spacing is measured in LIGHTING texels and lands on screen at texels /
 * renderScale — halving the resolution doubles the artifact's screen period, and
 * the adaptive governor happens to raise the pass count exactly as it lowers the
 * resolution (_qualityFor: <=0.45 -> 4 passes, <=0.3 -> 5). Arms:
 *   dn-        the shipped filter, 0..6 passes (the control)
 *   dnfixCap-  denoiseMaxStep 8: cascade 1,2,4,8,8,8 instead of ...,16,32
 *   dnfixJit-  denoiseStepJitter 1: per-frame tap-radius jitter
 */
function denoiseStudyConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over }, moving: true });
  for (const rs of [0.25, 0.5]) {
    const t = String(rs).replace(".", "");
    for (const it of [0, 1, 2, 3, 4, 5, 6]) {
      add(`dn-rs${t}-p${it}`, { renderScale: rs, denoiseIterations: it, denoise: it > 0 });
    }
    for (const it of [4, 5, 6]) {
      // maxStep 8 is a no-op at 4 passes (the cascade already stops at 8).
      if (it > 4) add(`dnfixCap-rs${t}-p${it}`, { renderScale: rs, denoiseIterations: it, denoiseMaxStep: 8 });
      add(`dnfixJit-rs${t}-p${it}`, { renderScale: rs, denoiseIterations: it, denoiseStepJitter: 1 });
      add(`dnfixDamp-rs${t}-p${it}`, { renderScale: rs, denoiseIterations: it, denoiseWideDamp: 1 });
    }
  }
  return out;
}

/**
 * The ghosting arm. First half isolates WHICH temporal store carries the stale
 * signal by varying one store at a time; second half A/Bs the motion-adaptive
 * mitigation for each store, and all of them together.
 */
function ghostConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over }, moving: true, ghostStrafe: true });
  add("gh-base", {});
  for (const v of [8, 16, 128]) add(`gh-maxhist-${v}`, { maxHistory: v });
  for (const v of [0.05, 0.25, 0.5]) add(`gh-taablend-${String(v).replace(".", "")}`, { taaBlend: v });
  for (const v of [6, 16]) add(`gh-mcap-${v}`, { restirMCap: v });
  add("gh-taa-off", { taa: false });
  add("gh-restir-off", { restir: false });
  // Mitigations: each lerps ONE store toward a short-history value with motion.
  add("gh-fixHist", { motionAdaptive: true, maxHistoryMoving: 6, taaBlendMoving: 0.1, restirMCapMoving: 40 });
  add("gh-fixTaa", { motionAdaptive: true, maxHistoryMoving: 48, taaBlendMoving: 0.4, restirMCapMoving: 40 });
  add("gh-fixMcap", { motionAdaptive: true, maxHistoryMoving: 48, taaBlendMoving: 0.1, restirMCapMoving: 6 });
  add("gh-fixAll", { motionAdaptive: true, maxHistoryMoving: 6, taaBlendMoving: 0.4, restirMCapMoving: 6 });
  return out;
}

/**
 * The ReSTIR GI ARTIFACT STUDY (plan=restirgi). The main campaign found restirGI
 * raises coarse structure through the à-trous filter (Cornell gridPeak 0.66 ->
 * 1.37) at flat rmse, and on-device review vetoed the look. Four hypotheses,
 * one arm each, all against the same `off`/`on` pair:
 *
 *  (a) RESERVOIR CORRELATION — a long M-cap freezes each pixel's selected sample
 *      for ~M frames, so the estimate is quasi-static rather than averaged, and
 *      spatial reuse spreads one pixel's frozen sample over a neighbourhood.
 *      Arm: mcap-* and taps-*.
 *  (b) STATIC TAP PATTERN — if the spatial offsets do not decorrelate per frame,
 *      the correlation is structured at the tap radius. Arm: taps-* read against
 *      the raw-GI grid probe (the tap radius is 4..20 lighting texels).
 *  (c) RESOLVE EMA / CONFIDENCE CLAMP locking the blotch in. Arm: ema-*, conf-*.
 *  (d) À-TROUS AMPLIFICATION — the filter treats the correlated add as
 *      geometry-consistent signal and spreads it at wide steps. Arm: dn*-on vs
 *      dn*-off (the on/off gap as a function of pass count) and dn2-on-damp.
 *
 * Every restirGI arm also reports the RAW resolve (readGiRaw), so "the resolve
 * is structured" and "the denoiser amplifies it" are separately observable.
 */
function restirGiConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over } });
  // Pinned to the PRE-FIX defaults, not to BASELINE: this ladder is the record
  // of what the artifact was, so it must keep rendering the code that had it
  // even though the library's defaults have since moved.
  const on = (over) => ({
    restirGI: true, restirGIChromaMean: false, restirGIVisFallback: false,
    restirGIResolveAlpha: 0.15, restirGISpatialTaps: 1, restirGIMCap: 20,
    restirGIValidate: 8, ...over,
  });
  add("off", {});
  add("on", on({}));
  // (a) temporal M-cap ladder, at the shipped 1 spatial tap.
  for (const v of [4, 8, 12, 20]) add(`mcap-${v}`, on({ restirGIMCap: v }));
  // (a)+(b) spatial taps at the shipped M-cap.
  for (const v of [0, 2]) add(`taps-${v}`, on({ restirGISpatialTaps: v }));
  add("taps0-mcap4", on({ restirGISpatialTaps: 0, restirGIMCap: 4 }));
  // (c) resolve EMA and the confidence-weighted clamp.
  for (const v of [0.05, 0.35, 1.0]) add(`ema-${String(v).replace(".", "")}`, on({ restirGIResolveAlpha: v }));
  add("conf-1", on({ restirGIConfLow: 1.0 }));
  // validation: is the 1-in-8 kill-only pass injecting its own pattern?
  add("val-0", on({ restirGIValidate: 0 }));
  // (d) à-trous pass count, both sides, plus the wide-pass damping option.
  for (const it of [1, 2, 3]) {
    add(`dn${it}-off`, { denoiseIterations: it });
    add(`dn${it}-on`, on({ denoiseIterations: it }));
  }
  add("dn2-on-damp", on({ denoiseWideDamp: 1 }));
  return out;
}

/**
 * Round 2 of the artifact study (plan=restirgi-fix): the FIX ladder. Round 1
 * (plan=restirgi) found the artifact in the resolve itself, not in the denoiser
 * — the resolve's luminance is a running mean but its COLOUR was one selected
 * sample's chromaticity, 37% spread per pixel, red/green confetti in the raw
 * probe. This ladder A/Bs the two mechanisms that answer it, then tunes the
 * knobs round 1 flagged (the mis-specified resolve EMA, the M-cap's averaging
 * window, and the cost of the validation pass) on top of them.
 *
 * `pre` is the PRE-FIX default (both mechanisms off) — the arm every "before"
 * number in the report comes from, measured on this same commit so the
 * comparison carries no other differences.
 */
function restirGiFixConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over } });
  // The pre-fix defaults in full — the library's have since moved to the fix.
  const OLD = {
    restirGIChromaMean: false, restirGIVisFallback: false,
    restirGIResolveAlpha: 0.15, restirGISpatialTaps: 1, restirGIMCap: 20,
  };
  // Every arm starts from the PRE-FIX settings and turns things ON, so each row
  // isolates what it names. Pinning them here (rather than inheriting BASELINE)
  // keeps this ladder reproducing its recorded numbers now that the library's
  // defaults have moved to the fix.
  const on = (over) => ({ restirGI: true, ...OLD, restirGISpatialTaps: 1, ...over });
  add("off", {});
  add("pre", on({}));
  // Each mechanism alone, then together.
  add("chroma", on({ restirGIChromaMean: true }));
  add("vis", on({ restirGIVisFallback: true }));
  add("both", on({ restirGIChromaMean: true, restirGIVisFallback: true }));
  const fixed = (over) => on({ restirGIChromaMean: true, restirGIVisFallback: true, ...over });
  // The resolve EMA on top of the fix: round 1 measured alpha 1 (EMA off) as the
  // single best structure knob, because the EMA's partner is the PREVIOUS
  // frame's TEMPORAL-ONLY resolve — a noisier estimator than the merged one it
  // is smoothing, weighted 0.85.
  for (const v of [0.35, 1.0]) add(`both-ema${String(v).replace(".", "")}`, fixed({ restirGIResolveAlpha: v }));
  // M-cap = the resolve's averaging window: luminance noise falls as
  // 1/sqrt(2M+1), and staleness is what the validation pass is for.
  for (const v of [32, 48]) add(`both-ema1-mcap${v}`, fixed({ restirGIResolveAlpha: 1.0, restirGIMCap: v }));
  // Validation interval: round 1 measured the 1-in-8 pass at ~30% of the frame
  // (8 NEE samples on the validating pixels) AND as a noise source, because each
  // kill resets a pixel to M=0 and it takes M frames to re-converge.
  for (const v of [16, 32]) add(`both-ema1-val${v}`, fixed({ restirGIResolveAlpha: 1.0, restirGIValidate: v }));
  const cand = { restirGIResolveAlpha: 1.0, restirGIMCap: 48, restirGIValidate: 16 };
  add("cand", fixed(cand));
  add("cand-taps0", fixed({ ...cand, restirGISpatialTaps: 0 }));
  add("cand-taps2", fixed({ ...cand, restirGISpatialTaps: 2 }));
  // (d) re-checked on the fixed resolve: does the à-trous gap close at every
  // pass count, or only at the shipped 2?
  for (const it of [1, 3]) {
    add(`dn${it}-off`, { denoiseIterations: it });
    add(`dn${it}-cand`, fixed({ ...cand, denoiseIterations: it }));
  }
  return out;
}

/**
 * Round 3 (plan=restirgi-tune): pick the shipped defaults. Round 2 established
 * the two mechanisms; this tunes the three numbers around them, and in
 * particular re-asks the spatial-tap question, because the fix INVERTS its
 * answer. Before, an adopted neighbour swapped in a different sample's colour,
 * so each tap was a variance SOURCE (round 1: taps 2 was the worst arm). Now
 * every tap is folded into the chromaticity mean by its own RIS weight, so a
 * tap is extra averaged evidence and taps are a variance SINK.
 */
function restirGiTuneConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over } });
  // The pre-fix defaults in full — the library's have since moved to the fix.
  const OLD = {
    restirGIChromaMean: false, restirGIVisFallback: false,
    restirGIResolveAlpha: 0.15, restirGISpatialTaps: 1, restirGIMCap: 20,
  };
  const C = {
    restirGI: true, restirGIChromaMean: true, restirGIVisFallback: true,
    restirGIResolveAlpha: 1.0, restirGIMCap: 48, restirGIValidate: 16,
  };
  add("off", {});
  add("pre", { restirGI: true, ...OLD });
  for (const t of [1, 2, 3, 4]) add(`t${t}`, { ...C, restirGISpatialTaps: t });
  for (const v of [20, 32, 64]) add(`t2-mcap${v}`, { ...C, restirGISpatialTaps: 2, restirGIMCap: v });
  for (const v of [8, 32]) add(`t2-val${v}`, { ...C, restirGISpatialTaps: 2, restirGIValidate: v });
  add("t2-ema035", { ...C, restirGISpatialTaps: 2, restirGIResolveAlpha: 0.35 });
  add("t2-conf1", { ...C, restirGISpatialTaps: 2, restirGIConfLow: 1.0 });
  return out;
}

/**
 * The VERDICT arm (plan=restirgi-move): the small config set the fix bar is
 * judged on — restirGI off vs on — with the moving tests enabled, so in-motion
 * error and churn are on the record alongside the still numbers. Run this on the
 * SAME commit before and after the fix; the pair of results files is the
 * before/after table.
 */
function restirGiVerdictConfigs() {
  const PRE = {
    restirGIChromaMean: false, restirGIVisFallback: false,
    restirGIResolveAlpha: 0.15, restirGISpatialTaps: 1,
  };
  return [
    { label: "off", cfg: { ...BASELINE }, moving: true },
    { label: "pre", cfg: { ...BASELINE, restirGI: true, ...PRE }, moving: true },
    { label: "new", cfg: { ...BASELINE, restirGI: true }, moving: true },
    { label: "new-mcap32", cfg: { ...BASELINE, restirGI: true, restirGIMCap: 32 }, moving: true },
  ];
}

/**
 * Ladder validation: the library's own quality ladder (_qualityFor) against
 * cost-matched rungs built from this campaign's Pareto frontier. Everything else
 * in the sweep varies ONE axis; these are the multi-axis combinations the auto
 * policy would actually ship, measured rather than extrapolated.
 */
function ladderConfigs() {
  const out = [];
  const add = (label, over) => out.push({ label, cfg: { ...BASELINE, ...over }, moving: true });
  add("lib-rs50", { renderScale: 0.5, denoiseIterations: 3, stochasticLights: false });
  add("lib-rs375", { renderScale: 0.375, denoiseIterations: 4, stochasticLights: true });
  add("lib-rs25", { renderScale: 0.25, denoiseIterations: 5, stochasticLights: true });
  add("lib-rs20-cs085", { renderScale: 0.2, denoiseIterations: 5, stochasticLights: true, canvasScale: 0.85 });
  // The proposed rungs bundle four campaign findings: giHalfRate and restirGI
  // are both NEGATIVE cost at equal error; the denoise pass count stops paying
  // for itself past 3; and restirMCap 16 improved every metric in both scenes at
  // ~0 ms. denoiseWideDamp rides along to keep 3 passes accurate.
  const win = { giHalfRate: true, restirGI: true, restirMCap: 16, denoiseWideDamp: 1 };
  add("new-rs50", { renderScale: 0.5, denoiseIterations: 2, ...win });
  add("new-rs375", { renderScale: 0.375, denoiseIterations: 3, ...win });
  add("new-rs25", { renderScale: 0.25, denoiseIterations: 3, stochasticLights: true, ...win });
  add("new-rs20", { renderScale: 0.2, denoiseIterations: 3, stochasticLights: true, ...win });
  return out;
}

// ---------------------------------------------------------------------------
// driver
// ---------------------------------------------------------------------------
async function run() {
  const t0 = performance.now();
  const env = await fetch("/__campaign/env").then((r) => r.json()).catch(() => ({ rev: "unknown" }));
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");

  const results = {
    campaign: "three-realtime-rt quality campaign",
    plan: PLAN,
    scene: SCENE_ID,
    rep: REP,
    movingTestsOff: MOVING_OFF,
    date: new Date().toISOString(),
    gitRev: env.rev,
    three: THREE.REVISION,
    gpu: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "unknown",
    vendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : "unknown",
    userAgent: navigator.userAgent,
    viewport: `${BASE_W}x${BASE_H}`,
    baseline: BASELINE,
    reference: REFERENCE,
    sceneDef: { tris: SCENE_DEFS[SCENE_ID].tris, cam: SCENE_DEFS[SCENE_ID].cam, target: SCENE_DEFS[SCENE_ID].target, patches: SCENE_DEFS[SCENE_ID].patches },
    configs: [],
  };
  log(`gpu: ${results.gpu}`);
  log(`three r${THREE.REVISION}  git ${env.rev}  scene ${SCENE_ID} (${results.sceneDef.tris} tris)  rep ${REP}`);

  sceneDef = SCENE_DEFS[SCENE_ID];
  setStatus("building scene…");
  const built = await sceneDef.build();
  scene = built.scene;
  camera.fov = sceneDef.fov;
  camera.aspect = BASE_W / BASE_H;
  camera.updateProjectionMatrix();

  rt = new RealtimeRaytracer(renderer, {
    sky: built.sky,
    envColor: built.env?.color ?? new THREE.Color(0x101820),
    envIntensity: built.env?.intensity ?? 1.0,
    adaptiveQuality: false,
    overloadProtection: false,
    maxHistory: 48,
  });
  rt.compileScene(scene);
  // The museum hides some lights behind demo toggles; force them all on so the
  // measured scene is the fully-lit one every run.
  scene.traverse((o) => { if (o.isLight) o.visible = true; });
  rt.updateLights(scene);
  window.RT = rt; window.SCENE = scene; window.CAMERA = camera;

  if (PLAN === "recon") {
    applyConfig(REFERENCE);
    await nextFrame();
    setCam(sceneDef.cam, sceneDef.target);
    rt.resetAccumulation();
    await renderN(400);
    rt.render(scene, camera);
    const buf = readFrame();
    await savePng(`recon__${SCENE_ID}`, buf, capW, capH);
    await savePng(`recon__${SCENE_ID}__grid`, buf, capW, capH, true);
    log(`recon: saved recon__${SCENE_ID}.png (+grid)`);
    setStatus("recon done.");
    window.CAMPAIGN_DONE = true;
    return;
  }

  // TIMING plan: the cheap repeat. Headline fps is the only number that is
  // genuinely stochastic run-to-run (the image metrics are near-deterministic on
  // a fixed scene and seed), so the repeats measure THAT and nothing else — no
  // references, no convergence, no readbacks, no PNGs. Three fence-timed blocks
  // per config, and the whole plan is run several times for a median of medians.
  if (PLAN === "timing") {
    const list = [...qualityAxisConfigs(), ...featureCostConfigs(), ...ladderConfigs()];
    log(`timing-only: ${list.length} configs`);
    for (const item of list) {
      setStatus(`${SCENE_ID} r${REP} timing: ${item.label}`);
      applyConfig(item.cfg);
      await nextFrame();
      setCam(sceneDef.cam, sceneDef.target);
      await renderN(60);
      const blocks = [];
      for (let k = 0; k < 3; k++) { blocks.push(timeBlock(60)); await nextFrame(); }
      blocks.sort((a, b) => a - b);
      const frameMs = blocks[1];
      results.configs.push({
        label: item.label,
        config: item.cfg,
        metrics: { frameMs, fps: 1000 / frameMs, frameMsBlocks: blocks, timingSpread: (blocks[2] - blocks[0]) / frameMs, timingNoisy: (blocks[2] - blocks[0]) / frameMs > 0.1 },
      });
      log(`${item.label.padEnd(20)} ${frameMs.toFixed(2).padStart(8)} ms  ${(1000 / frameMs).toFixed(1).padStart(6)} fps  spread ${(((blocks[2] - blocks[0]) / frameMs) * 100).toFixed(1)}%`);
      await saveJson(`results-${SCENE_ID}-${PLAN}-r${REP}`, results);
    }
    results.elapsedS = (performance.now() - t0) / 1000;
    await saveJson(`results-${SCENE_ID}-${PLAN}-r${REP}`, results);
    window.CAMPAIGN_RESULTS = results;
    setStatus(`timing done in ${(results.elapsedS / 60).toFixed(1)} min.`);
    window.CAMPAIGN_DONE = true;
    return;
  }

  const convergeRef = 600;
  await buildReferences(convergeRef);

  let list;
  if (PLAN === "denoise") list = denoiseStudyConfigs();
  else if (PLAN === "ghost") list = ghostConfigs();
  else if (PLAN === "ladder") list = ladderConfigs();
  else if (PLAN === "restirgi") list = restirGiConfigs();
  else if (PLAN === "restirgi-fix") list = restirGiFixConfigs();
  else if (PLAN === "restirgi-tune") list = restirGiTuneConfigs();
  else if (PLAN === "restirgi-move") list = restirGiVerdictConfigs();
  else if (PLAN === "cost") list = featureCostConfigs();
  else if (PLAN === "smoke") {
    // End-to-end validation of every code path (still + moving + ghost + PNG)
    // before committing an hour of GPU time to a real plan.
    list = [
      { label: "baseline", cfg: { ...BASELINE }, moving: true },
      { label: "dn-6", cfg: { ...BASELINE, denoiseIterations: 6 }, moving: true },
      { label: "cost-gi-off", cfg: { ...BASELINE, gi: false }, moving: false },
    ];
  } else list = [...qualityAxisConfigs(), ...featureCostConfigs()];

  log(`running ${list.length} configs…`);
  log("");
  const giPlan = PLAN.startsWith("restirgi");
  log(giPlan
    ? "label                 ms/frame   fps   gridPk   blotch  still(c)  rmse320  giBlot  giChr  giCorr"
    : "label                 ms/frame   fps   rmse320  rmseFull  still(c)  blotch  moveErr");
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    try {
      const r = await measure(item.label, item.cfg, { moving: item.moving, ghostStrafe: item.ghostStrafe });
      results.configs.push(r);
      const m = r.metrics;
      const n = (v, d = 2, w = 8) => (v == null ? "-" : v.toFixed(d)).padStart(w);
      log(giPlan
        ? `${item.label.padEnd(20)} ${n(m.frameMs, 2)} ${n(m.fps, 1, 6)} ` +
          `${n(m.gridPeak, 3)} ${n(m.probeBlotch, 2, 8)} ${n(m.stillNoiseCenter, 3, 9)} ` +
          `${n(m.rmse320, 2)} ${n(m.giBlotch, 2, 7)} ${n(m.giChroma, 3, 6)} ${n(m.giTemporalCorr, 2, 7)}`
        : `${item.label.padEnd(20)} ${n(m.frameMs, 2)} ${n(m.fps, 1, 6)} ` +
          `${n(m.rmse320, 2)} ${n(m.rmseFull, 2, 9)} ` +
          `${n(m.stillNoiseCenter, 3, 9)} ${n(m.blotch, 2, 7)} ${n(m.moveErr_orbit, 2)}`
      );
    } catch (err) {
      console.error(err);
      log(`${item.label}: FAILED ${err?.message ?? err}`);
      results.configs.push({ label: item.label, config: item.cfg, error: String(err?.message ?? err) });
    }
    // Persist after every config so a crash never loses the whole run.
    results.elapsedS = (performance.now() - t0) / 1000;
    await saveJson(`results-${SCENE_ID}-${PLAN}-r${REP}`, results);
    await saveJson(`index-${SCENE_ID}-${PLAN}-r${REP}`, archive);
  }

  results.elapsedS = (performance.now() - t0) / 1000;
  await saveJson(`results-${SCENE_ID}-${PLAN}-r${REP}`, results);
  await saveJson(`index-${SCENE_ID}-${PLAN}-r${REP}`, archive);
  window.CAMPAIGN_RESULTS = results;
  setStatus(`done in ${(results.elapsedS / 60).toFixed(1)} min — ${results.configs.length} configs.`);
  log(`\ndone in ${(results.elapsedS / 60).toFixed(1)} min.`);
  window.CAMPAIGN_DONE = true;
}

window.CAMPAIGN_DONE = false;
run().catch((err) => {
  console.error(err);
  window.CAMPAIGN_ERROR = String(err?.stack ?? err);
  setStatus(`FAILED: ${err?.message ?? err}`);
  log(String(err?.stack ?? err));
  window.CAMPAIGN_DONE = true;
});
