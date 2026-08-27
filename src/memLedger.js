// memLedger.js - the byte ledger for GPU render-target memory.
//
// [wave 14K] WHY. The owner's iPhone 12 Pro loses the WebGL context after
// ~12 minutes of play with FLAT texture/geometry/program counts (444 / 1807 /
// 47 across six samples). Flat counts mean "no logical-object leak", but on
// iOS WebKit sits on Metal and defers render-target deallocation past fences
// and often several frames, so the real quantity is PEAK CONCURRENT BYTES:
// two or three generations of the full target set can be resident at once
// while the JS counts stay flat. Nobody had ever measured that number, so
// every render-target allocation and disposal reports its COMPUTED bytes here
// (width x height x attachments x bytes-per-texel), the ledger tracks live
// bytes and the peak concurrent bytes under the pessimistic assumption that a
// disposal does not actually free for N frames (freeAfterFrames, default 3:
// WebKit commonly sits on a generation for a few frames after the GL calls
// that should release it, and the peak is what a context loss actually sees).
//
// [wave 37] THE WALL-CLOCK FLOOR. The N-frame deferral above decays per
// RENDERED FRAME, so a stalled or crawling loop (a friend's public-build boot
// held 3.2 s frames at the title screen) keeps the retired bytes on the books
// for ever and the forensics report a peak that may already be free. A retired
// generation is now presumed freed after freeAfterFrames frames OR freeAfterMs
// milliseconds, whichever comes first (default 2000 ms: ~6x the frame floor at
// 10 fps, so a healthy loop still frees on the frame count and the pessimism
// wave 14K wanted is untouched; a stalled loop just cannot hold the bytes
// open-ended). The clock is read on every read as well as on tick, so a
// stopped loop's summary is honest without a frame ever rendering.
//
// The game reads this through rt.memLedger (the app creates one ledger, hands
// it to the tracer, and logs the drawing buffer through it), and the loss
// forensics (src/gl-guard.js) carries live + peak so the next phone screenshot
// of the overlay names the number that matters.

const now = (typeof performance !== 'undefined' && typeof performance.now === 'function')
  ? () => performance.now()
  : () => Date.now();

export function createMemLedger({ freeAfterFrames = 3, freeAfterMs = 2000 } = {}) {
  const live = new Map();       // key -> { bytes, detail }
  const counts = new Map();     // key -> number of NEW generations allocated
  const retired = [];           // { bytes, remaining, retiredAt } waiting out the deferral
  let liveBytes = 0;
  let retiredBytes = 0;
  let peakBytes = 0;            // peak CONCURRENT (live + not-yet-freed) bytes

  function retire(bytes, t) {
    retired.push({ bytes, remaining: Math.max(0, freeAfterFrames), retiredAt: t });
    retiredBytes += bytes;
  }

  // Free every retired generation that is due: out of frames, or past the
  // wall-clock floor. A stalled loop renders few frames, so the millisecond
  // test is what stops it holding bytes on the books for ever.
  function decay(t) {
    if (!retired.length) return;
    for (let i = retired.length - 1; i >= 0; i--) {
      const r = retired[i];
      if (r.remaining <= 0 || t - r.retiredAt >= freeAfterMs) {
        retiredBytes -= r.bytes;
        retired.splice(i, 1);
      }
    }
  }

  return {
    get freeAfterFrames() { return freeAfterFrames; },
    get freeAfterMs() { return freeAfterMs; },

    // A new generation of `key` is now allocated. If `key` already had a live
    // generation, the old one is retired (presumed still resident for
    // freeAfterFrames frames / freeAfterMs ms) and the new one becomes live.
    // Re-allocating the same key at the SAME size (e.g. a resize that did not
    // change anything) is a no-op so a spurious call cannot inflate the peak
    // or the per-key allocation count.
    alloc(key, bytes, detail) {
      const t = now();
      decay(t);
      const cur = live.get(key);
      if (cur) {
        if (cur.bytes === bytes) { cur.detail = detail; return; }
        retire(cur.bytes, t);
        liveBytes -= cur.bytes;
      }
      live.set(key, { bytes, detail });
      liveBytes += bytes;
      counts.set(key, (counts.get(key) || 0) + 1);
      const resident = liveBytes + retiredBytes;
      if (resident > peakBytes) peakBytes = resident;
    },

    // The current generation of `key` is disposed. Its bytes stay counted
    // (retired) until the deferral (frames OR wall clock) has passed.
    free(key) {
      const t = now();
      decay(t);
      const cur = live.get(key);
      if (!cur) return;
      live.delete(key);
      retire(cur.bytes, t);
      liveBytes -= cur.bytes;
    },

    // Called once per frame (gl-guard.frame): a rendered frame passes for every
    // retired generation, and the wall-clock floor is applied at the same time.
    tick() {
      const t = now();
      if (!retired.length) return;
      for (let i = retired.length - 1; i >= 0; i--) {
        const r = retired[i];
        r.remaining--;
        if (r.remaining <= 0 || t - r.retiredAt >= freeAfterMs) {
          retiredBytes -= r.bytes;
          retired.splice(i, 1);
        }
      }
    },

    liveBytes() { return liveBytes; },
    // These reads apply the wall-clock decay first, so a stalled loop's summary
    // (the forensics' one number that matters) never over-reports.
    retiredBytes() { decay(now()); return retiredBytes; },
    residentBytes() { decay(now()); return liveBytes + retiredBytes; },
    peakBytes() { return peakBytes; },
    has(key) { return live.has(key); },

    // How many times `key` has been given a NEW generation (a genuine
    // (re)allocation; a same-size no-op does not count). A host gate uses this
    // to prove a boot allocated each pass target exactly once.
    allocCount(key) { return counts.get(key) || 0; },

    entries() {
      decay(now());
      return [...live.entries()].map(([key, v]) => ({ key, bytes: v.bytes, detail: v.detail }));
    },

    summary() {
      decay(now());
      return {
        freeAfterFrames,
        freeAfterMs,
        liveBytes,
        retiredBytes,
        residentBytes: liveBytes + retiredBytes,
        peakBytes,
        counts: Object.fromEntries(counts),
        entries: this.entries(),
      };
    },

    reset() {
      live.clear();
      counts.clear();
      retired.length = 0;
      liveBytes = 0;
      retiredBytes = 0;
      peakBytes = 0;
    },
  };
}

export default createMemLedger;
