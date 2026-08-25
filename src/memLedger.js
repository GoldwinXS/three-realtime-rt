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
// The game reads this through rt.memLedger (the app creates one ledger, hands
// it to the tracer, and logs the drawing buffer through it), and the loss
// forensics (src/gl-guard.js) carries live + peak so the next phone screenshot
// of the overlay names the number that matters.

export function createMemLedger({ freeAfterFrames = 3 } = {}) {
  const live = new Map();       // key -> { bytes, detail }
  const retired = [];           // { bytes, remaining } waiting out the deferral
  let liveBytes = 0;
  let retiredBytes = 0;
  let peakBytes = 0;            // peak CONCURRENT (live + not-yet-freed) bytes

  function retire(bytes) {
    retired.push({ bytes, remaining: Math.max(0, freeAfterFrames) });
    retiredBytes += bytes;
  }

  return {
    get freeAfterFrames() { return freeAfterFrames; },

    // A new generation of `key` is now allocated. If `key` already had a live
    // generation, the old one is retired (presumed still resident for
    // freeAfterFrames frames) and the new one becomes live. Re-allocating the
    // same key at the SAME size (e.g. a resize that did not change anything)
    // is a no-op so a spurious call cannot inflate the peak.
    alloc(key, bytes, detail) {
      const cur = live.get(key);
      if (cur) {
        if (cur.bytes === bytes) { cur.detail = detail; return; }
        retire(cur.bytes);
        liveBytes -= cur.bytes;
      }
      live.set(key, { bytes, detail });
      liveBytes += bytes;
      const resident = liveBytes + retiredBytes;
      if (resident > peakBytes) peakBytes = resident;
    },

    // The current generation of `key` is disposed. Its bytes stay counted
    // (retired) until freeAfterFrames ticks have passed.
    free(key) {
      const cur = live.get(key);
      if (!cur) return;
      live.delete(key);
      retire(cur.bytes);
      liveBytes -= cur.bytes;
    },

    // Called once per frame (gl-guard.frame): a retired generation that has
    // been resident for freeAfterFrames frames is presumed actually freed.
    tick() {
      if (!retired.length) return;
      for (let i = retired.length - 1; i >= 0; i--) {
        const r = retired[i];
        if (--r.remaining <= 0) {
          retiredBytes -= r.bytes;
          retired.splice(i, 1);
        }
      }
    },

    liveBytes() { return liveBytes; },
    retiredBytes() { return retiredBytes; },
    residentBytes() { return liveBytes + retiredBytes; },
    peakBytes() { return peakBytes; },
    has(key) { return live.has(key); },

    entries() {
      return [...live.entries()].map(([key, v]) => ({ key, bytes: v.bytes, detail: v.detail }));
    },

    summary() {
      return {
        freeAfterFrames,
        liveBytes,
        retiredBytes,
        residentBytes: liveBytes + retiredBytes,
        peakBytes,
        entries: this.entries(),
      };
    },

    reset() {
      live.clear();
      retired.length = 0;
      liveBytes = 0;
      retiredBytes = 0;
      peakBytes = 0;
    },
  };
}

export default createMemLedger;
