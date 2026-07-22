/**
 * three-realtime-rt — movement-artifact harness.
 *
 * Purpose: make the edge-of-screen convergence noise that appears WHILE THE
 * CAMERA MOVES both measurable and eyeball-able. Ray traced lighting is
 * temporally accumulated; pixels that were just disoccluded (revealed) at the
 * screen edges as the camera pans have little history, so they shimmer. The
 * "overscan" feature (added on another branch — feature-detected below) trades a
 * slightly larger lighting buffer for history at those edges; this page is how
 * you tell whether it helped.
 *
 * What it does:
 *  - Reuses the demo scene (examples/scene.js).
 *  - Drives the camera on a DETERMINISTIC path (pose is a pure function of an
 *    accumulated sim-time): "strafe" (sinusoidal side-to-side) or "orbit".
 *  - Every couple of frames it reads three vertical bands off the drawing
 *    buffer — the outer 10% at the left, the outer 10% at the right, and the
 *    central 10% — and tracks per-pixel LUMINANCE VARIANCE over a sliding window
 *    of N frames. High variance = the pixels are still churning = visible noise.
 *  - HUD shows the three mean-variance numbers; the headline is the
 *    edge-vs-center ratio (>1 means the edges are noisier than the middle — the
 *    artifact overscan targets).
 *  - A magnified side-by-side inset shows the left edge strip next to a center
 *    strip for human comparison.
 *  - Logs the metric triple as one JSON line to the console every 2s so an
 *    automated run can scrape it (also on window.HARNESS).
 */
import * as THREE from "three";
import { RealtimeRaytracer } from "../src/index.js";
import { buildScene } from "./scene.js";

const boot = document.getElementById("boot");
const setBoot = (t) => { if (boot) boot.textContent = t; };

// Fixed drawing buffer — deterministic ray count and stable band geometry for
// the metric. The canvas is CSS-stretched to fill the window.
const W = 1280, H = 720;

async function main() {
  const { scene, camera: builtCam, sky, ready } = buildScene();
  setBoot("loading models…");
  await ready;

  // preserveDrawingBuffer so the magnified inset can drawImage() the WebGL
  // canvas after the frame is composited. Costs a little on the harness — it is
  // a diagnostic page, not a perf target.
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  document.getElementById("app").appendChild(renderer.domElement);
  const gl = renderer.getContext();

  const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 100);
  const CENTER = new THREE.Vector3(0, 1.4, 0);

  // A lean but genuinely ray traced config. adaptiveQuality is OFF on purpose —
  // a moving renderScale would confound the variance metric — so renderScale is
  // whatever the control says and nothing else touches it.
  const rt = new RealtimeRaytracer(renderer, {
    renderScale: 0.5,
    adaptiveQuality: false,
    gi: true,
    emissiveNEE: true,
    reflections: false,
    refraction: false,
    envColor: new THREE.Color(0x0a0f18),
    sky,
  });
  rt.compileScene(scene);

  // ---- metric: sliding-window temporal luminance variance in 3 bands --------
  const BAND_FRAC = 0.10;           // outer/center band width as a fraction of W
  const bandW = Math.max(1, Math.floor(W * BAND_FRAC));
  const DS = 2;                     // spatial stride within a band (cheaper reads)
  const N = 20;                     // sliding-window length (frames)
  const CAPTURE_EVERY = 2;          // capture cadence (frames)
  const cols = Math.ceil(bandW / DS);
  const rows = Math.ceil(H / DS);
  const nSamp = cols * rows;

  // One band = a vertical strip. x0 is its left edge in drawing-buffer pixels.
  const makeBand = (x0) => ({
    x0,
    buf: new Uint8Array(bandW * H * 4),
    ring: Array.from({ length: N }, () => new Float32Array(nSamp)),
    head: 0,
    count: 0,
    variance: 0,
  });
  const bands = {
    left: makeBand(0),
    right: makeBand(W - bandW),
    center: makeBand(Math.floor(W / 2 - bandW / 2)),
  };

  // Read a band's pixels (same JS task as the render) and fold luminance into
  // its ring buffer, then recompute the band's mean per-pixel variance.
  function captureBand(b) {
    gl.readPixels(b.x0, 0, bandW, H, gl.RGBA, gl.UNSIGNED_BYTE, b.buf);
    const dst = b.ring[b.head];
    let si = 0;
    for (let y = 0; y < H; y += DS) {
      const rowOff = y * bandW * 4;
      for (let x = 0; x < bandW; x += DS) {
        const p = rowOff + x * 4;
        // Rec.709 luma, kept in 0-255 so the variance reads in intuitive units.
        dst[si++] = 0.2126 * b.buf[p] + 0.7152 * b.buf[p + 1] + 0.0722 * b.buf[p + 2];
      }
    }
    b.head = (b.head + 1) % N;
    if (b.count < N) b.count++;
    if (b.count < N) return; // window not full yet

    // Two-pass mean/variance across the N frames, averaged over all samples.
    let acc = 0;
    for (let i = 0; i < nSamp; i++) {
      let sum = 0;
      for (let f = 0; f < N; f++) sum += b.ring[f][i];
      const mean = sum / N;
      let ss = 0;
      for (let f = 0; f < N; f++) { const d = b.ring[f][i] - mean; ss += d * d; }
      acc += ss / N;
    }
    b.variance = acc / nSamp;
  }

  const resetMetric = () => {
    for (const b of Object.values(bands)) { b.head = 0; b.count = 0; b.variance = 0; }
  };
  const windowFull = () =>
    bands.left.count >= N && bands.right.count >= N && bands.center.count >= N;

  // ---- magnified inset (left edge strip vs. center strip) -------------------
  const zoom = document.getElementById("zoom");
  const zx = zoom.getContext("2d");
  zx.imageSmoothingEnabled = false;
  const SRC_W = 64, SRC_H = 80;                 // source strip in canvas pixels
  const PANE_W = zoom.width / 2;                // two panes side by side
  const srcY = Math.floor((H - SRC_H) / 2);     // vertically centered strip
  function drawInset() {
    zx.clearRect(0, 0, zoom.width, zoom.height);
    // Left-edge strip (source x = 0) on the left pane; center strip on the right.
    zx.drawImage(renderer.domElement, 0, srcY, SRC_W, SRC_H, 0, 0, PANE_W, zoom.height);
    zx.drawImage(
      renderer.domElement,
      Math.floor(W / 2 - SRC_W / 2), srcY, SRC_W, SRC_H,
      PANE_W, 0, PANE_W, zoom.height
    );
    zx.fillStyle = "#26323c";
    zx.fillRect(PANE_W - 1, 0, 2, zoom.height); // divider
  }

  // ---- deterministic camera motion (pose = f(simTime)) ----------------------
  const state = { mode: "strafe", speed: 1.0, paused: false, simTime: 0 };
  function poseFor(t) {
    if (state.mode === "orbit") {
      const a = t * 0.5;
      camera.position.set(Math.cos(a) * 10.5, 3.6, Math.sin(a) * 10.5);
    } else {
      // strafe: slide along world-X on a sinusoid; look stays on center.
      const x = Math.sin(t * 0.18 * Math.PI * 2) * 5.0;
      camera.position.set(x, 3.4, 9.5);
    }
    camera.lookAt(CENTER);
    camera.updateMatrixWorld();
  }

  // ---- controls -------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  $("mode").addEventListener("change", (e) => {
    state.mode = e.target.value;
    rt.resetAccumulation();
    resetMetric();
  });
  const speedVal = $("speed-val");
  $("speed").addEventListener("input", (e) => {
    state.speed = parseFloat(e.target.value);
    speedVal.textContent = state.speed.toFixed(1);
  });
  $("res").addEventListener("change", (e) => {
    rt.renderScale = parseFloat(e.target.value); // setter reallocates lighting targets
    rt.resetAccumulation();
    resetMetric();
  });
  const pauseBtn = $("pause");
  pauseBtn.addEventListener("click", () => {
    state.paused = !state.paused;
    pauseBtn.classList.toggle("on", state.paused);
    pauseBtn.textContent = state.paused ? "resume" : "pause";
  });

  // Feature-detect overscan: only show the control if THIS build of the
  // raytracer has the property (another branch adds it). Hidden otherwise.
  if ("overscan" in rt) {
    const row = $("overscan-row");
    const slider = $("overscan");
    const label = $("overscan-val");
    row.style.display = "flex";
    slider.style.display = "block";
    const init = Number(rt.overscan) || 0;
    slider.value = String(init);
    label.textContent = init.toFixed(2);
    slider.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      rt.overscan = v;
      label.textContent = v.toFixed(2);
      rt.resetAccumulation();
      resetMetric();
    });
  }

  // ---- HUD + console log ----------------------------------------------------
  const hud = {
    left: $("m-left"), right: $("m-right"), center: $("m-center"),
    ratio: $("m-ratio"), note: $("m-note"),
  };
  let lastHud = 0, lastLog = 0;
  function metricTriple() {
    const left = bands.left.variance;
    const right = bands.right.variance;
    const center = bands.center.variance;
    const edge = (left + right) / 2;
    const ratio = center > 1e-4 ? edge / center : 0;
    return { left, right, center, ratio };
  }
  function updateHud(now) {
    const m = metricTriple();
    hud.left.textContent = m.left.toFixed(2);
    hud.right.textContent = m.right.toFixed(2);
    hud.center.textContent = m.center.toFixed(2);
    if (!windowFull()) {
      hud.ratio.textContent = "—";
      hud.note.textContent = "warming up window…";
      return;
    }
    hud.ratio.textContent = m.ratio.toFixed(2) + "x";
    hud.ratio.className = m.ratio > 1.15 ? "bad" : "good";
    hud.note.textContent =
      m.ratio > 1.15 ? "edges noisier than center" : "edges on par with center";
  }
  function logLine(now) {
    const m = metricTriple();
    // One JSON line per ~2s for automated scraping.
    console.log(JSON.stringify({
      t: Math.round(now),
      mode: state.mode,
      speed: state.speed,
      renderScale: rt.renderScale,
      overscan: "overscan" in rt ? Number(rt.overscan) || 0 : null,
      windowFull: windowFull(),
      left: +bands.left.variance.toFixed(3),
      right: +bands.right.variance.toFixed(3),
      center: +bands.center.variance.toFixed(3),
      edgeCenterRatio: +m.ratio.toFixed(3),
    }));
  }

  // Expose for automated verification / scraping.
  window.HARNESS = { rt, state, bands, metricTriple, windowFull };

  // ---- loop -----------------------------------------------------------------
  let frame = 0, lastT = performance.now(), booted = false;
  function animate() {
    if (document.visibilityState === "hidden") setTimeout(animate, 100);
    else requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    if (!state.paused) state.simTime += dt * state.speed;

    poseFor(state.simTime);
    rt.render(scene, camera); // replaces renderer.render

    // Capture the bands in the SAME task as the render (default framebuffer is
    // cleared between tasks) at the chosen cadence.
    frame++;
    if (frame % CAPTURE_EVERY === 0) {
      captureBand(bands.left);
      captureBand(bands.right);
      captureBand(bands.center);
    }
    drawInset();

    if (!booted) { booted = true; boot?.classList.add("hidden"); }
    if (now - lastHud >= 250) { updateHud(now); lastHud = now; }
    if (now - lastLog >= 2000) { logLine(now); lastLog = now; }
  }
  animate();
}

main().catch((err) => {
  console.error(err);
  if (boot) {
    boot.classList.remove("hidden");
    boot.innerHTML = `<div class="err"><b>Failed to start.</b>\n\n${
      err && err.message ? err.message : err
    }\n\nSee the console for details.</div>`;
  }
});
