/**
 * GPU frame-cost timer built on EXT_disjoint_timer_query_webgl2.
 *
 * WHY THIS EXISTS. The adaptive governor used to steer on the wall-clock
 * interval between frames, which is the one number a vsync-capped display
 * refuses to give up. Measured on an RTX 3060 in headless Chromium, the same
 * scene at four lighting resolutions:
 *
 *     renderScale   GPU time     wall-clock interval
 *     0.375         16.2 ms      16.6 ms
 *     0.5           27.3 ms      16.6 ms
 *     0.75          52.3 ms      16.6 ms
 *     1.0           81.9 ms      16.6 ms
 *
 * Wall clock is a constant. GPU cost varies by 5x across the same rows. A
 * controller reading the right-hand column cannot see the difference between
 * "comfortably inside budget" and "five times over it", which is why the
 * governor could only ever walk quality DOWN on a 60Hz display and never back
 * up (verified by simulation: sixty seconds of idle 60Hz frames moved
 * renderScale 0.375 -> 0.375, while the same code at 8.33ms per frame walked
 * 0.375 -> 1.0).
 *
 * WHAT IT COSTS. One begin/end pair per sampled frame and a poll of the oldest
 * outstanding query. Nothing here stalls the pipeline: results are read only
 * once QUERY_RESULT_AVAILABLE reports true, never with a blocking get.
 *
 * WHERE IT IS UNAVAILABLE (Safari, and anywhere the extension is withheld)
 * `supported` is false and `costMs` stays null, and the caller is expected to
 * fall back to a signal that does not need it.
 */

/** Queries in flight before sampling pauses. Deep enough to ride out the
 *  couple of frames of latency a result normally takes, shallow enough that a
 *  backlogged GPU stops us allocating rather than growing without bound (an
 *  unpooled version reached 385 outstanding queries at renderScale 1.0). */
const POOL = 4;

/** Samples kept for the median. Odd, so the median is a real sample. */
const WINDOW = 9;

export class GpuTimer {
  constructor(renderer) {
    this.supported = false;
    this._gl = null;
    this._ext = null;
    this._active = null; // the query currently between begin and end
    this._pending = [];  // queries submitted, results not yet read
    this._free = [];
    this._samples = [];
    this._disjointCount = 0;
    try {
      const gl = renderer.getContext();
      // WebGL1 contexts expose a different (query-object-less) extension; this
      // engine is WebGL2 only, so require the WebGL2 spelling.
      const ext = gl.getExtension("EXT_disjoint_timer_query_webgl2");
      if (gl && ext) {
        this._gl = gl;
        this._ext = ext;
        this.supported = true;
      }
    } catch {
      // A context that refuses getExtension is simply unsupported.
      this.supported = false;
    }
  }

  /**
   * Median GPU milliseconds over the recent window, or null until enough
   * samples have arrived. Median rather than mean: a single compositor hiccup
   * or a shader recompile should not move the controller, and the median of an
   * odd window ignores outliers on both sides for free.
   */
  get costMs() {
    if (this._samples.length < 3) return null;
    const s = [...this._samples].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  }

  /** Most recent sample, for diagnostics. */
  get lastMs() {
    return this._samples.length ? this._samples[this._samples.length - 1] : null;
  }

  /** True once a stable measurement exists. */
  get ready() {
    return this.costMs !== null;
  }

  /**
   * Open a timed region. Returns false when this frame is not being sampled
   * (pool exhausted, or unsupported), in which case end() is a no-op and the
   * caller does not need to branch.
   */
  begin() {
    if (!this.supported || this._active) return false;
    const gl = this._gl;
    // Only one TIME_ELAPSED query may be active at a time, and a query object
    // cannot be re-used while its result is outstanding, hence the free list.
    if (!this._free.length && this._pending.length >= POOL) return false;
    const q = this._free.pop() || gl.createQuery();
    if (!q) return false;
    gl.beginQuery(this._ext.TIME_ELAPSED_EXT, q);
    this._active = q;
    return true;
  }

  /** Close the timed region opened by begin(), then harvest what is ready. */
  end() {
    if (!this.supported || !this._active) return;
    this._gl.endQuery(this._ext.TIME_ELAPSED_EXT);
    this._pending.push(this._active);
    this._active = null;
    this._drain();
  }

  _drain() {
    const gl = this._gl;
    // GPU_DISJOINT_EXT latches: reading it clears it, and while it is set every
    // outstanding timing is untrustworthy (the GPU was interrupted, clocked
    // down, or context-switched away). Throw the whole batch away rather than
    // feed the controller a fabricated spike.
    if (gl.getParameter(this._ext.GPU_DISJOINT_EXT)) {
      this._disjointCount++;
      for (const q of this._pending) this._free.push(q);
      this._pending.length = 0;
      this._samples.length = 0;
      return;
    }
    while (this._pending.length) {
      const head = this._pending[0];
      if (!gl.getQueryParameter(head, gl.QUERY_RESULT_AVAILABLE)) break;
      const ns = gl.getQueryParameter(head, gl.QUERY_RESULT);
      this._pending.shift();
      this._free.push(head);
      // Nanoseconds. Implementations may quantize this for timing-attack
      // reasons; the values stay monotonic in real cost, which is all the
      // controller needs.
      const ms = ns / 1e6;
      if (ms > 0 && ms < 10000) {
        this._samples.push(ms);
        if (this._samples.length > WINDOW) this._samples.shift();
      }
    }
  }

  /** Drop accumulated samples. Call when the cost profile changes (a quality
   *  step, a scene recompile) so the controller measures the new regime rather
   *  than a blend of both. */
  reset() {
    this._samples.length = 0;
  }

  dispose() {
    if (!this.supported) return;
    const gl = this._gl;
    if (this._active) {
      try { gl.endQuery(this._ext.TIME_ELAPSED_EXT); } catch { /* context lost */ }
      this._free.push(this._active);
      this._active = null;
    }
    for (const q of this._pending) { try { gl.deleteQuery(q); } catch { /* ignore */ } }
    for (const q of this._free) { try { gl.deleteQuery(q); } catch { /* ignore */ } }
    this._pending.length = 0;
    this._free.length = 0;
    this._samples.length = 0;
  }
}
