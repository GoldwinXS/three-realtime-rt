/**
 * three-realtime-rt — render self-test (?selftest=1).
 *
 * The net that catches the CLASS of failure behind the 0.4.0 iOS incident: the
 * pipeline compiled clean, checkFramebufferStatus reported complete, no console
 * error fired — and every iOS browser rendered pure black. A "did it compile"
 * check is worthless against that; you have to LOOK AT THE PIXELS. So this does:
 * it drives the real demo scene with the full lighting stack on, then reads the
 * drawing buffer back and asserts the image is actually lit.
 *
 * Contract: after {@link SELFTEST.FRAMES} rendered frames (counted off rt.frame,
 * not wall-time, so a slow CI box just takes longer) it evaluates four gates and
 * emits ONE machine-readable JSON line — to the console (prefixed `[selftest]`)
 * AND into a hidden DOM node `#selftest-verdict` for a Playwright driver to read:
 *
 *   { pass, meanLum, irrLum, glErrors, specMRT, supported, frames, ua }
 *
 *   meanLum  Rec.709 luma (0-255) of the composite over the CENTER 25% of the
 *            drawing buffer (a centred 50%x50% region = a quarter of the pixels).
 *            The black-screen class hard-fails here.
 *   irrLum   same readback with outputMode=3 (raw irradiance) for one frame —
 *            proves the LIGHTING buffer is alive, not just emissive geometry
 *            surviving the composite (0.4.0's black image still showed emitters).
 *   glErrors count of nonzero gl.getError() samples (one per GL_ERROR_EVERY
 *            frames); any nonzero sample fails the gate.
 *   specMRT / supported  the two capability fallbacks, reported for triage.
 *
 * The page keeps rendering after the verdict (outputMode is restored) so a human
 * can watch. Readback uses the drawing buffer directly, which requires the demo
 * to build its renderer with preserveDrawingBuffer:true in this mode — same
 * technique harness.js uses for its band inset.
 *
 * What this does NOT catch: the actual 0.4.0 root cause was WebKit's GLSL->Metal
 * codegen breaking at a 4th traceRadiance call site. Playwright's webkit on a
 * non-Apple OS is not Apple's Metal stack, so this net catches API / JS /
 * GLSL-frontend divergence across engines — not Metal codegen. Real-device iOS
 * testing stays manual (see ?diag=1 / ?nospecmrt=1 in the README).
 */

// Verdict thresholds. meanLum/irrLum are Rec.709 luma in 0-255. Calibrated on
// desktop (see README "Render self-test") — the demo's centre framing points at
// the lit gallery floor/water, so a healthy composite lands mid-range; a black
// screen reads ~0. The band between BLACK_FLOOR and LIT_MIN is the "suspiciously
// dark but not stone black" gap we still want to fail.
export const SELFTEST = {
  FRAMES: 90,          // rendered frames (rt.frame) before verdicts run
  GL_ERROR_EVERY: 10,  // sample gl.getError() once per N frames
  BLACK_FLOOR: 6,      // meanLum below this = "black screen" class (hard fail)
  LIT_MIN: 12,         // composite must be at least this lit to pass
  LIT_MAX: 230,        // ...and not a blown-out all-white readback
  IRR_MIN: 6,          // irradiance readback must clear the black floor
};

const round2 = (x) => Math.round(x * 100) / 100;

/**
 * Build a self-test runner bound to a live renderer + raytracer. Call the
 * returned `onFrame()` once at the end of every render-loop iteration (after
 * rt.render). It is a no-op once the verdict has been emitted.
 */
export function createSelftest({ rt, renderer }) {
  const gl = renderer.getContext();

  // Read the CENTER 25% of the drawing buffer and return its mean Rec.709 luma.
  // (y-origin is bottom-left for gl.readPixels, but the region is centred and
  // symmetric so orientation is irrelevant to the mean.)
  const readCenterLum = () => {
    const W = gl.drawingBufferWidth;
    const H = gl.drawingBufferHeight;
    const rw = Math.max(1, Math.floor(W * 0.5));
    const rh = Math.max(1, Math.floor(H * 0.5));
    const x0 = Math.floor((W - rw) / 2);
    const y0 = Math.floor((H - rh) / 2);
    const buf = new Uint8Array(rw * rh * 4);
    gl.readPixels(x0, y0, rw, rh, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    let sum = 0;
    const n = rw * rh;
    for (let i = 0; i < n; i++) {
      const p = i * 4;
      sum += 0.2126 * buf[p] + 0.7152 * buf[p + 1] + 0.0722 * buf[p + 2];
    }
    return sum / n;
  };

  let phase = "warmup"; // warmup -> irr -> done
  let glErrors = 0;
  let meanLum = 0;
  let irrLum = 0;

  const emitVerdict = () => {
    // Compile-failure status surface (rt.status / rt.compileError). On the
    // healthy path every rt:* pass links, so status.ok is true and compileError
    // is null — assert both so a regression that silently auto-disables a pass
    // (or blacks out a core pass) trips this gate, not just the pixel readback.
    // Also confirm the DISCOVERY mechanism the diagnosis relies on: the pass
    // programs really are named "rt:*" and visible in renderer.info.programs
    // (rtPrograms > 0). Without that, status.ok:true would be a false pass.
    let rtPrograms = 0;
    try {
      const progs = renderer.info && renderer.info.programs;
      if (progs) {
        for (const p of progs) {
          if (p && typeof p.name === "string" && p.name.slice(0, 3) === "rt:") rtPrograms++;
        }
      }
    } catch { /* info.programs unavailable — leaves rtPrograms 0, fails the gate */ }
    const statusOk =
      !!(rt.status && rt.status.ok === true) && rt.compileError == null && rtPrograms > 0;

    const pass =
      rt.supported === true &&
      meanLum >= SELFTEST.LIT_MIN &&
      meanLum <= SELFTEST.LIT_MAX &&
      glErrors === 0 &&
      irrLum > SELFTEST.IRR_MIN &&
      statusOk;

    const verdict = {
      pass,
      meanLum: round2(meanLum),
      irrLum: round2(irrLum),
      glErrors,
      specMRT: !!rt.specMRTSupported,
      supported: !!rt.supported,
      statusOk,
      rtPrograms,
      compileError: (rt.status && rt.compileError) || null,
      disabled: (rt.status && rt.status.disabled) || [],
      frames: rt.frame,
      ua: navigator.userAgent,
    };
    const line = JSON.stringify(verdict);
    console.log("[selftest] " + line);

    let node = document.getElementById("selftest-verdict");
    if (!node) {
      node = document.createElement("div");
      node.id = "selftest-verdict";
      // Off-screen, not display:none — a driver may want to read it, and some
      // engines skip layout/text on display:none nodes.
      node.style.cssText =
        "position:fixed;left:-99999px;top:0;white-space:pre;pointer-events:none;";
      document.body.appendChild(node);
    }
    node.textContent = line;
    node.setAttribute("data-pass", String(pass));
  };

  return {
    onFrame() {
      if (phase === "done") return;

      if (phase === "warmup") {
        // gl.getError() clears the flag, so sampling on a cadence is fine.
        if (rt.frame % SELFTEST.GL_ERROR_EVERY === 0 && gl.getError() !== 0) {
          glErrors++;
        }
        if (rt.frame >= SELFTEST.FRAMES) {
          // The composite for this frame is already on the drawing buffer.
          meanLum = readCenterLum();
          // Ask for raw irradiance next frame (bypasses TAA, no reset needed).
          rt.outputMode = 3;
          phase = "irr";
        }
        return;
      }

      // phase === "irr": the frame just rendered used outputMode 3.
      irrLum = readCenterLum();
      rt.outputMode = 0; // restore the normal view for anyone watching
      emitVerdict();
      phase = "done";
    },
  };
}
