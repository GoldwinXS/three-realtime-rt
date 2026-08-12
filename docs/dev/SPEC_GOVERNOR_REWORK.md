# Governor rework: implementable specification

Produced by a nine-agent design campaign (five parallel read-only audits, a
three-way design panel, one judging synthesis), 2026-08-12. Every claim below
was required to carry a file:line citation; the judge independently re-verified
the load-bearing ones and re-fitted the cost model against this repo's own
quality-campaign ladder data.

STATUS: partially implemented in 0.14.0 and 0.14.1. What shipped is the warm-up gate
that stops the governor deciding from shader-compile frames (the boot free-wins
bug), and **option pinning** (0.14.1): an app can pass `restirGI`, `giHalfRate`,
or `restirMCap` explicitly at construction and the governor will never change
that value — `_takeFreeWins` skips pinned keys and never records them in
`_qFreeWins`, so `_releaseFreeWins` cannot resurrect them either. Runtime writes
do not pin (the governor itself writes these properties, so a naive "any write
pins" rule would have the governor pin its own changes). The control-law
replacement below (QualityGovernor, the cadence spine, the timer-query tier) is
NOT implemented and is the next round.

# GOVERNOR REWORK: JUDGEMENT AND IMPLEMENTABLE SPEC

## 0. Two corrections to the brief, verified before judging

**(a) The museum demo does not run the governor at all.** The shipped demo constructs with `adaptiveQuality: false` (`C:/ClaudeSessions/RayTracingUpgradeChallenge/examples/main.js:229`). It only turns on when the user flips the "auto quality" toggle (`examples/panel.js:426`). The only shipped example that boots with the governor live is the gallery (`examples/gallery.js:139`). Every measurement harness disables it: `examples/bench.js:115`, `examples/bench.js:260`, `examples/campaign.js:810`, `examples/campaign.js:1691`, `examples/harness.js:63`, `examples/game-bench.js:118` (bench mode only; clip mode deliberately leaves it on). So "lighting resolution stays at its conservative boot level" on the museum is currently caused by the governor being *off*, and only becomes the ratchet defect after the toggle.

**(b) The premise that the museum has large 60Hz headroom on the 3060 is not supported by this repo's own data, and the data points the other way for the full stack.** From `quality-campaign/results-museum-ladder-r1.json` (ANGLE / RTX 3060 / 1280x720, `new-` series, which already has the free wins taken: `giHalfRate:true, restirGI:true, restirMCap:16`): renderScale 0.5 = 39.56 ms (25.3 fps), 0.375 = 26.06 ms (38.4 fps), 0.25 = 14.10 ms, 0.2 = 9.76 ms. At 720p the museum only clears a 16.67 ms vsync tick at renderScale 0.25 or below, and the demo's fullscreen buffer at DPR 1 (`examples/main.js:116`, `examples/main.js:122`) is roughly 2.2x that pixel count on a 1080p panel. Tokyo is the same story (35.03 / 19.34 / 11.65 / 9.16 ms). Cornell is the only campaign scene with real 60Hz headroom (9.63 / 6.26 / 3.35 / 2.66 ms).

The demo's *boot* config is much leaner than the campaign config (GI on but `emissiveNEE`, `reflections`, `refraction` off and `stochasticLights` true, `examples/main.js:238-241`), so it may well have headroom. But nothing in the repo measures that config. **Pre-register the per-scene expectation before the acceptance run, or a correct cut will be read as a failed fix.** Design 1 is the only one of the three that raised this (its test 13); Designs 2 and 3 both assume a climb.

---

## 1. Scorecard

| Criterion | D1 Measured-Cost | D2 Cadence | D3 Altimeter |
|---|---|---|---|
| Control-law correctness | **9** | 7 | 8 |
| Robustness with no GPU timer | 7 | **9** | 8 |
| Oscillation resistance | 8 | **8** | 6 |
| Implementation risk here (10 = lowest risk) | 4 | **9** | 5 |
| Testability without a GPU | **9** | **9** | 8 |
| Image gain, 3060 @ 60Hz | 8 | 6 | **9** |
| **Weighted** | **7.5** | **8.0** | **7.3** |

### What each got right, verified

**D1's cost model is real, not rhetoric.** I re-fitted `ms = A + B*s²` to the `new-` ladder series myself and reproduced its numbers to three significant figures: museum A=5.037 B=140.6, tokyo A=3.70 B=122.4, cornell A=1.350 B=33.46; worst residual +9.2% at museum s=0.5. Its `A_FRAC_MAX = 0.60` is also checked: museum A/m is 0.127 at s=0.5 and 0.516 at s=0.2. Its argument that the shipped exponent 0.35 (`src/RealtimeRaytracer.js:1847`) is damped in the *wrong direction* follows from that fit and is correct: with A>0 the correct exponent is 0.5/(1-A/m) > 0.5. This is the single most load-bearing piece of analysis in all three designs.

**D2's derived rung is the right fix for the `_canvasLevelIdx` desync.** Deriving the ladder position from live `renderScale` and `canvasScale` every call deletes the state that can desync, instead of reconciling it. That is strictly better than D1's and D3's "reconcile the index" prerequisite. Its miss-debt integrator (`+1` late, `-1/12` on-time, trip at 4) is also the cleanest available fix for the 19.1% single-marginal-frame over-cut, and its refresh-divisor `L` is the only mechanism in any of the three that actually implements the owner's stated preference on a 120/144Hz panel.

**D3's altimeter invisibility claim is true; I verified it.** `DenoisePass.render` starts each call with `read = inputTexture; write = this.targetA` and writes only `targetA`/`targetB` (`src/DenoisePass.js:353-356`, `373-377`), and `setSize` touches only those two targets (`src/DenoisePass.js:302-307`). Extra iterations run after the composite, with the return value dropped, are byte-identical on screen. **D3's convergence-driven denoise is the best image idea in the set and it is free**: the repo's own comment says past 2 passes rmse degrades monotonically and the lattice band energy rises 4-5x (`src/RealtimeRaytracer.js:318-329`), while `_qualityFor` currently forces 3 passes at any scale <= 0.45 (`src/RealtimeRaytracer.js:338-343`) regardless of whether the accumulator is sitting at 48 samples. That is exactly the "softer than the hardware could deliver" complaint, and it needs no signal fix at all.

### Where each fails

**D1**: the implementation surface is the largest in the set and most of it is not the control law. The Tier B runtime fence probe needs a probe-safe render path, and in this pipeline a `render()` call advances the TAA jitter index, `this.frame`, the accumulate history, the ReSTIR DI and GI reservoirs, and the motion vectors. "Skip history advancement" is not one flag; it is a cross-cutting reentrancy contract across six passes. It also buys a fleet split (continuous ms on Windows Chromium, an 8-second hitching probe on Firefox/Safari/mobile) and D1's own risk section admits the two legs will disagree about the same hardware.

**D2**: has no absolute cost number ever, so its up path is pure hill climbing, and every failed probe is a real reallocation plus, on the default `splitAccum` path, a full accumulation clear (`src/AccumulatePass.js:277-291`, whose own comment records a governor step freezing the frame blown out). Its own worst case is roughly 4 visible blips in the first minute at the cliff. Its `INEFF_MAX_MISS = 6` is an admitted guess, and the efficacy check spends up to 6 rungs of image before concluding futility.

**D3**: the altimeter does not escape the fence, it moves it to boot. Converting `K*` passes into a renderScale target needs `c0` in milliseconds, which its `calibrate()` gets by halving `renderScale` and restoring it during load: two reallocations plus two accumulation clears, measured at one camera viewpoint. And "invisible" is true of pixels only. A failed probe burst drops frames: a 6-round bisection at 4 frames per burst drops roughly half of 24 frames, which is a visible judder burst, re-run every 30 s when settled (`PROBE_PERIOD_SETTLED`). A stutter is more noticeable than noise. Its `stillFrames` convergence proxy is also admittedly wrong for the demo, which animates physics, water and a skinned fox before `rt.render` (`examples/main.js:604`).

### Verdict

**Base: Design 2.** It is the only control law that is universal, needs no new GL objects, no extension, no probe-safe render path, and no boot hitch, and it is the only one that fixes the `_canvasLevelIdx` class of bug by construction rather than by prerequisite.

**Graft from Design 1**: the `A + B*s²` cost model and the solve-and-jump up-step; the epoch tag that makes deferred timer results safe; `EXT_disjoint_timer_query_webgl2` as a pure accelerator behind one null check; the never-worse differential test.

**Graft from Design 3**: convergence-driven `denoiseIterations` (ship it first, independently); `spendPolicy` with the "never release free wins where the release gate is already dead" argument; the deferred-probe invisibility property, documented as the designated future upgrade for the no-timer fleet.

---

## 2. THE SPECIFICATION

### 2.1 Shape

New file `src/QualityGovernor.js`: pure. No `this` on the engine, no GL, no `performance.now()`, no THREE import. Exported from `src/index.js` alongside `RealtimeRaytracer` and `compileScene` (`src/index.js:1-2`). `RealtimeRaytracer._adaptQuality` shrinks to: build a plain context object, call `gov.update(ctx)`, apply the returned action.

This split is mandatory, not stylistic: the constructor early-returns at `src/RealtimeRaytracer.js:455-470`, before `targetFps` and every `_q*` field is initialised at `src/RealtimeRaytracer.js:779-813`, so an unsupported instance has no governor to test. The precedent for a pure-node test already exists: `scripts/km-selftest.mjs` ("no GPU, no browser", `scripts/km-selftest.mjs:2`) wired as `npm run test:km` (`package.json:21`).

Ship in three independently revertable commits:

- **C1 (image, no signal change):** convergence denoise, `targetFps` validation, `_qFastStreak` reset, `_releaseFreeWins` denoise-cap fix, `_overloadBrake` recording its own change. Measurable on its own.
- **C2 (control law):** `QualityGovernor` with the cadence spine, replacing `_adaptQuality`'s body.
- **C3 (accelerator):** timer-query tier and the cost model.

### 2.2 Public API

Three new options, all additive, all defaulted so an existing app is byte-identical:

| Option | Type | Default | Meaning |
|---|---|---|---|
| `spendPolicy` | `"auto" \| "quality" \| "fps"` | `"auto"` | What headroom buys. `quality` never releases the free wins and allows a refresh divisor above 1; `fps` is today's semantics; `auto` resolves to `quality` when `targetFps / refreshHz >= 0.5`, i.e. exactly where the current release gate at `src/RealtimeRaytracer.js:1917-1922` is already unreachable. |
| `gpuTiming` | `"auto" \| "off"` | `"auto"` | Whether to use `EXT_disjoint_timer_query_webgl2` when present. |
| `displayHz` | `number \| null` | `null` | Override for refresh estimation. There is no `screen.refreshRate` in any shipping browser, so this is the only escape hatch. |

`canvasScaleHook` gains an optional contract: if it returns a finite number, that is taken as the scale actually applied. A hook returning `undefined` keeps today's behaviour exactly. This is what lets the gallery's module-level `canvasScale`, which persists across per-scene tracer rebuilds (`examples/gallery.js:179` area), report itself into a fresh instance.

Read-only `rt.status.governor = { mode, signalTier, refreshHz, divisor, budgetMs, rung, safeRung, ceilingRung, debt, missRate, failCount, cadenceBound, blackout, modelA, modelB, gpuMs, quantumMs, disjointRate }`.

**Hard constraints on the self-test fences.** `targetFps` default stays 55 and `adaptiveQuality` stays true; the presets leg compares a frozen `DEFAULTS` snapshot by string equality against a hand-enumerated `read()` projection (`examples/main.js:1013`, `examples/main.js:1043-1044`, `examples/main.js:1061-1092`). None of the three new options may be added to `read()` and none may be added to `PRESETS`. Add a separate governor-defaults assertion in the new headless leg instead.

### 2.3 Signal (always on, no extension)

```
RING            = 256    // 4.3s @60Hz. The robust-minimum estimator needs a large
                         // sample to find the display floor from a minority of frames.
STD_HZ          = [50,60,72,75,90,100,120,144,165,240,360]
SNAP_TOL        = 0.04   // snap T to a real refresh period within 4%; turns
                         // 16.66-16.71 jitter into an exact 16.667
T_MIN_MS        = 2.78   // 360Hz
T_MAX_MS        = 20.0   // 50Hz
PACED_TOL       = 0.12   // |dt - n*T|/T to count as "landed on a tick". Firefox and
                         // Safari coarsen performance.now() to 1ms = 6% of 16.67,
                         // comfortably inside 12%.
PACED_FRAC      = 0.70   // fraction of the window on a tick to call the display paced
LATE_MARGIN     = 0.5    // late when dt > (L+0.5)*T: the exact midpoint between a
                         // held frame (L*T) and a missed one ((L+1)*T)
```

`T` is the 3rd smallest of the 4 smallest dt in the ring, clamped and snapped. The 3rd-of-4 rejects two spuriously short intervals while still finding the floor from only 3 of 256 samples.

`_paced` is true when at least `PACED_FRAC` of the window sits within `PACED_TOL` of an integer multiple of `T`. False under `--disable-gpu-vsync --disable-frame-rate-limit` (`quality-campaign/PLAN.json:18-20`, `bench-results/README.md:33`), on VRR, and when render is driven from `setTimeout`.

**Refresh divisor.** `L = max(1, floor(refreshHz / (targetFps * 0.9)))` when the resolved policy is `quality`, else `L = 1`. `budgetMs = L * T`. At 60Hz/55fps, `L = 1` always: reaching `L = 2` needs refresh >= 99 Hz, so the common case is provably unchanged. At 120Hz `L = 2` (16.67 ms budget, quality spent instead of frames); at 144Hz `L = 2` (13.9 ms); at 240Hz `L = 4`.

**Miss-debt.** `debt += 1` on a late frame, `debt -= 1/12` on an on-time frame, clamped `[0, 8]`, trip at `debt >= 4`. Debt only grows above a sustained 7.7% miss rate, so GC and compositor hiccups structurally cannot trip it. Four consecutive late frames trip in 67 ms; a 20% miss rate trips in about 0.5 s. This replaces `_qEma`, `dbLo`/`dbHi`, the 2000/5000 ms cooldown and `_qOscillating` entirely on the down side.

### 2.4 Ladder (one derived integer)

```
rungs 0..3   canvasScale 0.5 / 0.62 / 0.75 / 0.85 at renderScale 0.20
rungs 4..20  canvasScale 1.0 at renderScale 0.20 .. 1.00 in 0.05 steps
freeTaken    a separate boolean, spent before rung 0 down, returned only above rung 20 up
```

Built from `CANVAS_LEVELS` (`src/RealtimeRaytracer.js:351`) reversed. **Derived from live `canvasScale` and `renderScale` on every call, never stored.** This deletes `_canvasLevelIdx` and with it the desync reachable through `examples/panel.js:445-449` and every gallery scene switch. Spending order is unchanged and its measured justification is preserved verbatim (`src/RealtimeRaytracer.js:1802-1811`, `1873-1880`). No lever here recompiles the megakernel: the constructor's preset doc enumerates `renderScale`, `denoiseIterations`, `stochasticLights`, `giHalfRate`, `restirGI` as live-tunable, and `DenoisePass.render` takes `iterations` as a plain call argument (`src/DenoisePass.js:330`).

### 2.5 Cost model (used when an absolute-ms tier exists)

`ms(s) = A + B*s²`, fitted from two distinct rung visits within the same profile key. Verified against this repo's own ladder data (section 0b): museum A=5.04/B=140.6, tokyo A=3.71/B=122.4, cornell A=1.35/B=33.5, worst residual +9.2% across a 6.25x range of `s²`.

```
A = clamp(A, 0, 0.60 * ms)        // measured A/ms ran 0.127 (s=0.5) to 0.516 (s=0.2)
B = max(B, 0.20 * ms / s²)        // guard a degenerate fit
prior when < 2 points: A = 0, B = ms/s²
```

The `A = 0` prior is provably conservative for climbing (true A>0 would permit a larger step) and strictly more aggressive than today for cutting (exponent 0.5 vs the shipped 0.35 at `src/RealtimeRaytracer.js:1847`), so it cannot make a weak device worse.

`_costPts` is keyed on `profileKey = [canvasLevel, overscan, compiledId, freeTaken, gi, reflections, refraction, volumetric.enabled, regime].join("|")` and dropped whole when the key changes.

### 2.6 Timing tier (accelerator only, C3)

```
tier "timer"  gl.getExtension("EXT_disjoint_timer_query_webgl2") non-null AND
              gpuTiming !== "off" AND adaptiveQuality
tier "none"   everything else, including Firefox, Safari, Android, iOS
```

Never probe `EXT_disjoint_timer_query` (WebGL1): removed from Chrome 65 and Firefox 59 over GLitch, and Chrome's later re-add is macOS-only.

`beginQuery(TIME_ELAPSED_EXT)` immediately before the G-buffer raster; `endQuery` immediately after the TAA resolve block, before `this.renderer.autoClear = prevAutoClear` at `src/RealtimeRaytracer.js:2352`. Both inside the `if (!this.compiled)` guard at `src/RealtimeRaytracer.js:2008` so the raster fallback is never bracketed. Gated on `adaptiveQuality`, which is what keeps every published bench number byte-comparable: all measurement harnesses set it false (section 0a).

Drain rules, all from D1 and all kept:

- Poll `QUERY_RESULT_AVAILABLE` **first**, `QUERY_RESULT` only after. Do not copy `node_modules/three/examples/jsm/utils/GPUStatsPanel.js`, which reads the result at line 66 before testing availability at line 77.
- Drain the oldest query only, once per frame, never in a loop (a loop cannot change the answer by spec).
- Read `GPU_DISJOINT_EXT` on every consumed result; on set, discard that result, every other in-flight query, and the whole sample window.
- Every in-flight query carries `_epoch`; epoch mismatches are discarded. This is what makes the spec-mandated 1-3 frame readback latency harmless.
- `gl.getQuery(TIME_ELAPSED_EXT, CURRENT_QUERY)` before every `beginQuery`; if a third party owns it (GPUStatsPanel, Spector), yield and demote after 8 collisions.
- Measure the quantum at runtime as the GCD of the first 32 distinct results. Chromium documents "sufficiently reduced precision" without naming a value. Demote if quantum > `max(0.5 ms, 0.05 * budgetMs)`.
- Demote to `"none"` on 16 consecutive zero results (Babylon.js users see exactly this on mobile), 30 stalls, or a disjoint rate above 30% over 50 consumed results. Demotion is permanent for the session; there is no promotion.
- Decisions require 24 of 32 in-epoch samples.

### 2.7 The decision function

```js
// pure: no clock, no GL, no `this`. S is a plain object built by the adapter.
// S = { now, dt, hidden, motion, profileKey, canvasScale, renderScale,
//       denoiseIterations, freeTaken, targetFps, hasCanvasHook, maxHistory,
//       hasDynamicMeshes, spendPolicy, gpuMs (p50|null), gpuP90, gpuN, gpuFresh }

update(S) {
  if (S.hidden) { this.win.length = 0; this.debt = 0; this.dtValid = false; return null; }
  if (S.profileKey !== this.ctxKey) return this._onProfileChange(S);

  // targetFps validation, once. Closes the NaN-sized-render-target path from
  // `options.targetFps ?? 55` at RealtimeRaytracer.js:781.
  const fps = Number.isFinite(S.targetFps) && S.targetFps >= 5 && S.targetFps <= 480
            ? S.targetFps : 55;

  this._pushDt(S.dt);                      // discard dt > 2000 (unchanged, :1830)
  this.stillFrames = S.motion < 0.05 ? this.stillFrames + 1 : 0;
  if (this.T == null) return null;
  const L = (this._policy(S, fps) === "quality")
          ? Math.max(1, Math.floor((1000 / this.T) / (fps * 0.9))) : 1;
  const budget = this.paced ? L * this.T : 1000 / fps;

  // ---- 1. SEVERE. Never slower to react than the code it replaces. ----------
  if (S.dt > 4 * budget) {
    this.severeRun++;
    if (!S.freeTaken) return this._commit(S, { takeFreeWins: true }, "severe");
    if (this.severeRun >= 2) {
      const n = Math.max(2, Math.round(S.dt / this.T) / L);
      return this._commit(S, { rung: this._rungsDown(S, n, budget) }, "severe");
    }
  } else if (S.dt < 2 * budget) this.severeRun = 0;

  // ---- 2. BLACKOUT. Self-inflicted cost is not evidence. -------------------
  // Discard, do not feed in. This is the defect that lets today's reallocation
  // frame seed the freshly-nulled _qEma (:1936 then :1831).
  if (this.blackoutFrames > 0 && S.now < this.blackoutUntilMs) {
    this.blackoutFrames--; return null;
  }

  // ---- 3. LATE / DEBT ------------------------------------------------------
  const late = this.paced ? S.dt > (L + 0.5) * this.T
                          : S.dt > 1.12 * budget;      // = today's dbHi (:1841)
  this.debt = clamp(this.debt + (late ? 1 : -1/12), 0, 8);
  this.win.push({ late, dt: S.dt });
  if (this.win.length > this._windowLen(S)) this.win.shift();

  // ---- 4. PENDING VERDICT --------------------------------------------------
  if (this.pending) {
    if (this._regimeChangedDuring(S)) {          // unevaluable, never charge the
      this.discards++; this.pending = null;      // ceiling for it
      this.win.length = 0;
      if (this.discards >= 5) this.regimeKey = "mixed";
      return null;
    }
    if (this.pending.kind === "up") {
      const bad = this.debt >= 2 || this._maxRun() >= 2
               || (this.win.length <= 12 && this._lateCount() >= 3)
               || (S.gpuFresh && S.gpuP90 > 0.90 * budget);
      if (bad) {
        this.ceilingRung = this.pending.toRung;
        this.failCount++; this.lastFailMs = S.now; this.jump = 1;
        this.nextProbeMs = S.now + BACKOFF_MS[Math.min(this.failCount - 1, 3)];
        const a = this._commit(S, { rung: this.pending.fromRung }, "probe-revert");
        this.pending = null; return a;
      }
      if (this.win.length >= this.pending.window) {
        this.safeRung = Math.max(this.safeRung, this.pending.toRung);
        this.failCount = 0; this.jump = Math.min(4, this.jump * 2);
        if (S.gpuFresh) this._recordCostPoint(S.renderScale, S.gpuMs);
        this.pending = null;
      }
      return null;
    }
    if (this.pending.kind === "down" && this.win.length >= 32) {
      const eff = this._median() <= this.pending.beforeMedian * 0.90;
      this.ineffRun = eff ? 0 : this.ineffRun + 1;
      const cap = this._median() > 1.4 * this.T ? 6 : 2;
      if (S.gpuFresh) this._recordCostPoint(S.renderScale, S.gpuMs);
      this.pending = null;
      if (!eff && this.ineffRun >= cap) {          // NOT OUR BOTTLENECK
        this.cadenceBound = true; this.cadenceBoundMs = S.now; this.ineffRun = 0;
        return this._commit(S, { rung: this.restoreRung }, "ineffective-restore");
      }
    }
  }

  // ---- 5. DOWN. Union of cadence and (when available) measured cost. -------
  const gpuSlow = S.gpuFresh && S.gpuMs > 0.90 * budget;
  if (this.debt >= 4 || gpuSlow) {
    if (this.cadenceBound && S.now - this.cadenceBoundMs < 30000) { this.debt = 0; return null; }
    if (!S.freeTaken) return this._commit(S, { takeFreeWins: true }, "debt");
    const r = this._rung(S);
    this.ceilingRung = Math.min(this.ceilingRung, r);
    this.safeRung    = Math.min(this.safeRung, r - 1);
    this.failCount   = Math.max(this.failCount, 1);
    this.nextProbeMs = S.now + BACKOFF_MS[0];
    return this._commit(S, { rung: this._rungsDown(S, this._medianN(), budget) }, "debt");
  }

  // ---- 6. UP ---------------------------------------------------------------
  const r       = this._rung(S);
  const clean   = this.debt === 0 && this._maxRun() <= 1
               && this._lateCount() <= 0.10 * this.win.length;
  const frontier = r + 1 > this.safeRung;
  const need     = frontier ? 64 : 32;
  if (!clean || this.win.length < need)              return this._denoise(S);
  if (S.now - this.lastChangeMs < 2000)              return this._denoise(S);
  if (this.cadenceBound)                             return this._denoise(S);
  if (frontier && (S.now < this.nextProbeMs || r + 1 >= this.ceilingRung)) {
    if (S.now - this.lastFailMs > 120000) this.ceilingRung++;   // slow re-explore
    return this._denoise(S);
  }
  if (r >= this.maxRung(S)) {
    if (this._policy(S, fps) === "fps" && S.freeTaken
        && S.now - this.lastChangeMs > 10000 && !frontier
        && (!S.gpuFresh || S.gpuMs * this.freeWinFactor * 1.1 <= 0.60 * budget))
      return this._commitProbe(S, { releaseFreeWins: true }, 64);
    return this._denoise(S);
  }

  // MODEL JUMP when a measurement exists; single-rung PROBE when it does not.
  let target;
  if (S.gpuFresh && this.modelB > 0) {
    if (S.gpuP90 >= 0.60 * budget) return this._denoise(S);   // no headroom
    const n  = 0.60 * budget - this.modelA;
    let sT   = n <= 0 ? 0.2 : Math.sqrt(n / this.modelB);
    // The stochasticLights flip at 0.55 (_qualityFor, :338-343) is a cost the
    // model cannot see and the campaign admits it never measured for many-light
    // scenes (:331-334). Crossing it upward needs an extra 15% of margin.
    if (S.renderScale <= 0.55 && sT > 0.55 && S.gpuP90 >= 0.51 * budget) sT = 0.55;
    target = Math.min(this._rungForScale(sT), r + 4, this.ceilingRung - 1, this.maxRung(S));
  } else {
    const step = frontier ? 1 : Math.min(this.jump, this.safeRung - r, 4);
    target = Math.min(r + Math.max(1, step), this.maxRung(S));
  }
  if (target <= r) return this._denoise(S);

  // Motion cover: commit where the accumulation clear is masked. Bounded at
  // 30 frames so the worst case is 0.5s of latency, not a stall.
  if (S.motion < 0.25 && this.armedFrames++ < 30) return this._denoise(S);
  this.armedFrames = 0;
  return this._commitProbe(S, { rung: target }, need);
}

// nMed == 2 means "over budget by an unknown amount" -> exactly ONE rung. This
// is the fix for the 19.1% over-cut a single marginal frame causes today
// (RealtimeRaytracer.js:1847 with ratio 33.333/18.1818 = 1.8333).
_rungsDown(S, nMed, budget) {
  const r = this._rung(S);
  if (nMed < 3) return Math.max(0, r - 1);
  let sTarget;
  if (S.gpuFresh && this.modelB > 0) {
    const n = 0.90 * budget * 0.95 - this.modelA;
    sTarget = n <= 0 ? 0.2 : Math.sqrt(n / this.modelB);
  } else {
    sTarget = S.renderScale * Math.pow(1 / (nMed - 1), 0.4);
  }
  // NEVER-WORSE CLAMP: at least the step today's code would take.
  const legacy = S.renderScale * Math.pow(1 / nMed, 0.35);
  sTarget = Math.min(sTarget, legacy);
  const rungs = clamp(Math.round((S.renderScale - sTarget) / 0.05), 1, 5); // == MAX_SCALE_STEP
  return Math.max(0, r - rungs);
}

// Denoise follows CONVERGENCE, not scale. Free: a call argument, no realloc,
// no recompile (DenoisePass.js:330, 355). This replaces _qualityFor's
// denoiseIterations half; _qualityFor keeps ownership of stochasticLights.
_denoise(S) {
  const conv  = Math.min(1, this.stillFrames / Math.max(1, S.maxHistory));
  const floor = S.hasDynamicMeshes ? 2 : 1;
  const d = clamp(Math.round(3 - 2 * conv), floor, 3);   // 3 = GOVERNOR_MAX_DENOISE (:336)
  if (d !== S.denoiseIterations && S.now - this.lastDenoiseAt > 500) {
    this.lastDenoiseAt = S.now;
    this.blackoutFrames = 3;                    // no setSize: short blackout
    return { setDenoise: d, why: "convergence" };
  }
  return null;
}
```

Constants not inlined above, with justification:

```
BACKOFF_MS       = [8000, 16000, 32000, 60000]   // one visible blip per rung per
                                                 // interval; worst case ~4 in 60s
CEILING_DECAY_MS = 120000   // one exploratory blip per rung per 2 minutes
BLACKOUT_REALLOC = 8        // == HISTORY_CARRY_FRAMES (RealtimeRaytracer.js:358)
BLACKOUT_FREEWIN = 3        // free wins call no setSize
BLACKOUT_BOOT    = 45       // == DIAG_WINDOW_FRAMES (:369): programs may not be
                            // ready before then, so the first decision must not
                            // read a shader-link frame
BLACKOUT_MAX_MS  = 1000     // never hold a 3fps device hostage for 8 of ITS frames
UP_FRAC          = 0.60     // 40% reserve for present, compositor, other tabs and
                            // app CPU, which TIME_ELAPSED cannot see. A rate
                            // parameter: the real stopping point is the ceiling.
DOWN_FRAC        = 0.90
```

### 2.8 What must be reset on a quality change

Every committed action, from any path including `_overloadBrake`:

| Reset | Value | Why |
|---|---|---|
| `_epoch` | `++` | tags in-flight timer results; mismatches discarded |
| `_gpuN` | `0` | the GPU window measured a configuration we left |
| `debt` | `0` | the old debt was earned at the old cost |
| `win` | cleared | ditto |
| `lastChangeMs` | `now` | dwell |
| `blackoutFrames` / `blackoutUntilMs` | 8 or 3 / `now + 1000` | the reallocation frame is not evidence |
| `armedFrames` | `0` | |
| `restoreRung` | set on the first ineffective down-step only | for the efficacy restore |

**Not reset:** `stillFrames` (motion is independent of quality), `_costPts` (rung visits are the model's data), `safeRung` / `ceilingRung` / `failCount` / `modelA` / `modelB`.

On a **profile-key change** (`applyPreset` via `_rearmGovernor` at `src/RealtimeRaytracer.js:1116`, `compileScene`, canvas ladder step, free-wins take or release, overscan change, feature toggles): additionally clear `_costPts`, `modelA/B`, `safeRung = -1`, `ceilingRung = Infinity`, `failCount = 0`, `cadenceBound = false`, `pending = null`, and set `BLACKOUT_BOOT`.

**Not reset on preset change:** `_qFreeWins` must stop being discarded. Today `_rearmGovernor` drops it without restoring, so `giHalfRate`/`restirGI` stay at governor-forced values with no path back. Either restore before discarding or carry it across.

### 2.9 Fallback path

Two modes sharing one state machine. Mode is decided per window by `residual = median(|dt - T*round(dt/T)|) / T`: below 0.15 for two consecutive windows is `cadence`, at or above for two consecutive windows is `frametime`.

In `frametime` mode exactly two predicates change: `late` becomes `dt > 1.12 * (1000/targetFps)` (today's `dbHi`, `src/RealtimeRaytracer.js:1841`) and `L` is forced to 1. Everything else is identical: same debt, same one-rung minimum, same ladder, same ceiling, same backoff, same efficacy check, same blackouts. This is the mode `--disable-gpu-vsync --disable-frame-rate-limit` produces (`bench-results/README.md:33`), so the existing harnesses keep measuring a governor they can recognise.

When the timer tier is absent or demoted, the model is simply unavailable: the up path degrades from solve-and-jump to single-rung probe-and-revert. Nothing else changes. There is no second controller to maintain.

`_overloadBrake` (`src/RealtimeRaytracer.js:1251-1282`) keeps its thresholds unchanged and stays independent of `adaptiveQuality`. Its one required repair: after it commits a cut at `src/RealtimeRaytracer.js:1265-1268` it must call `gov.onExternalChange(now)`, which runs the full reset table above. Today it mutates `renderScale` with no `_recordChange`, no `_qEma` null and no `_qLastChange` touch, so the governor can commit a second cut on top of it inside the same window.

`_qLastT` invalidation must extend beyond the hidden-tab case at `src/RealtimeRaytracer.js:1816`: add a public `rt.resetFrameTiming()` and call it from the demo's ray-tracing toggle and the gallery's raster hold. Today a 1.5 s hold injects one dt of 1500 ms straight into the signal.

### 2.10 Deterministic test seam

`scripts/governor-selftest.mjs`, `npm run test:governor`, pure node, following `scripts/km-selftest.mjs` (`package.json:21`). Virtual GPU: `cost(rung)` monotone decreasing, `dt = ceil(cost / T) * T` in paced mode, `dt = cost` in unpaced mode, plus injectable noise, dropped frames and disjoint flags.

Mandatory gates:

1. **Never-worse differential (hard CI failure).** Vendor today's `_adaptQuality` body as `legacyAdapt()`. Over 200 synthetic traces (constant-slow, bimodal, spiky, 3 fps, ramping, 200 ms/frame), assert at every timestep `newRung <= legacyRung` and `timeToFirstCut_new <= timeToFirstCut_legacy`.
2. **Vsync ratchet fixed.** dt pinned to 16.667, cost below budget at every rung. Assert it climbs and settles, total commits <= 4, zero commits in the final 60 simulated seconds. The same trace through `legacyAdapt` must produce zero climbs.
3. **Marginal frame does not over-cut.** One late frame from a clean 60Hz trace. Assert exactly one rung down, never five.
4. **Oscillation.** Cost exactly between two rungs, +/-8% then +/-20% noise (the documented block variance). Assert <= 6 then <= 8 commits over 300 simulated seconds and a commit-free final 120 s.
5. **CPU-bound.** Cost independent of rung. Assert at most 6 down-steps, all restored in one move, `cadenceBound` true, zero further steps for 30 s.
6. **Divisor.** 144Hz and 240Hz. Assert `L` = 2 and 4 and budget 13.9 / 16.67 ms, and that the settled rung is higher than the 60Hz result rather than equal.
7. **Model.** Feed the fitter `(renderScale, ms)` pairs from `quality-campaign/results-{museum,tokyo,cornell}-ladder-r1.json` (`new-` series) two at a time; assert held-out prediction within 12%. My own fit gives worst residual +9.2%.
8. **Epoch and latency.** Deliver every synthetic timer result 3 frames late across a commit; assert no out-of-epoch result is ever consumed.
9. **Disjoint storm.** 50% flagged; assert no commit derives from a contaminated window and the tier demotes within 50 consumed results.
10. **Desync regression.** Set `canvasScale` to 0.5 externally, re-enable the governor; assert the first down step *reduces* the canvas. Today it raises it.
11. **Hostile input.** `targetFps` NaN, 0, -1, Infinity, "60"; a single injected 1500 ms gap. Assert no non-finite value reaches any action and the gap causes zero commits.
12. **Unpaced identity.** Assert mode is `frametime` and the governor converges to within one rung of the correct rung, with no over-cut greater than one rung on a marginal sample.

On-GPU acceptance, run **without** vsync flags at 60Hz, because that is the one configuration no published figure has ever used:

- Gallery (governor live at boot, `examples/gallery.js:139`) and museum with auto quality toggled on: log `(t, rung, renderScale, canvasScale, denoiseIterations, gpuMs, missRate, tier, commits)` over 60 s parked, a scripted orbit, then 60 s parked. Accept: <= 4 commits in the first 15 s, 0 commits in the last 30 s of each parked segment, final miss rate 0.
- **Record the per-scene expectation first** (section 0b). Cornell should climb. Museum and tokyo at full stack should cut.
- Image gate: `rmse320` and `sharpRatio` at boot config vs settled config using the campaign's fence method (`quality-campaign/PLAN.json:73`), plus a standalone A/B of the convergence-denoise change alone, whose falsifiable prediction from `src/RealtimeRaytracer.js:318-329` is a large drop in the period-32px band energy on a parked frame.
- Timer cross-check: on the 3060, assert the timer-query ms and a bench fence on the same config agree within the documented 20% block variance. If they disagree, the model tier is invalid and must be disabled.
- `game-bench` clip mode across chase / stealth / arena: <= 1 revert per 20 s loop, no net downward drift.

Ship with `REPORT_GOVERNOR.md` and a `CHANGELOG.md` entry per the convention at `CHANGELOG.md:3`, every number labelled with the tier that produced it.

### 2.11 Prerequisite bug fixes (in C1, not optional)

- `targetFps` validated at `src/RealtimeRaytracer.js:781`.
- `_qFastStreak` reset on the comfortable and take paths (dead once the rewrite lands, but C1 ships before C2).
- `_releaseFreeWins` must not restore `denoiseIterations` above `GOVERNOR_MAX_DENOISE`; today it restores every saved key unconditionally at `src/RealtimeRaytracer.js:1787`, and the demo boots at `denoiseIterations: 5` (`examples/main.js:227`).
- `_releaseFreeWins` nulls `_qFreeWins` at `src/RealtimeRaytracer.js:1784` before the empty bail at `1786`; move the null after.
- `_overloadBrake` records its change.
- Correct the two false load-bearing comments: `src/RealtimeRaytracer.js:1934` ("no reset") and the `setSize` header, both contradicted by `src/AccumulatePass.js:277-291`, whose own comment records the resulting blown-out frame. The anti-churn constants in this spec only look justified if the reader knows a step is expensive.

### 2.12 Documentation surface

`README.md:21`, `:120`, `:674-676`, `:756-766`, `:941-958`, `:960-1005`; `src/index.d.ts:259-265` and `:861-864` (both `RealtimeRaytracerOptions` and the class body need every new option); `examples/panel.js:430-434` and the two `govBadge` tooltips at `examples/panel.js:460-461`, which name the ladder and "a step every 2s at the fastest". Note that the JSDoc at `src/RealtimeRaytracer.js:770-777` already promises "cautiously probing a better level when there is headroom (reverting if the probe fails)" and describes a probe-and-revert governor that does not exist in `_adaptQuality`. This spec makes that sentence true for the first time.

---

## 3. Deliberately rejected

- **Design 1's Tier B runtime fence probe.** Needs a probe-safe render path; in this pipeline one `render()` advances `this.frame`, the TAA jitter index, the accumulate history, ReSTIR DI and GI reservoirs, and motion vectors. That is a cross-cutting reentrancy contract across six passes, and it is the highest-bug-density change available. It also guarantees a multi-frame hitch. The fence stays where it already works and is already validated: `examples/bench.js:91-102`, `examples/campaign.js:221`, `examples/game-bench.js:292`.
- **Design 3's altimeter as the primary instrument.** The invisibility property is real and I verified it (`src/DenoisePass.js:353-356`, `373-377`), but a failed probe still drops a frame, a 6-round bisection at 4 frames per burst drops roughly a dozen, and converting `K*` to a renderScale target still needs `c0` in milliseconds. It is the designated future upgrade for the no-timer fleet, documented in the source, and I would rather ship it as a *pre-commit confirmation* (inject the predicted extra cost, see if the frame still lands, then commit) than as a metrology device, because in that form a failed experiment costs one dropped frame instead of a reallocation plus an accumulation clear plus a revert. Not in v1 because it needs the `B/c0` ratio, which needs an absolute-ms tier, which is exactly the fleet it is meant to serve.
- **Design 3's startup fence calibration.** Halves `renderScale` and restores it: two reallocations plus two accumulation clears during load, measured at one camera viewpoint. The model bootstraps from rung visits the ladder produces anyway.
- **WebGL2 `fenceSync` + `clientWaitSync` polling.** Chromium's SSCA page states the behaviour of `clientWaitSync` and other `*Sync` functions was changed specifically to reduce their effective precision as clocks. Building on a surface the vendor has committed to degrading.
- **dt variance / jitter as a headroom proxy.** A worse-expressed miss rate: under vsync with headroom dt is nearly constant, and near the edge it goes bimodal at T and 2T, which *is* the miss rate. Raw variance additionally cannot separate that from GC or another tab.
- **`requestVideoFrameCallback`.** Video-specific, documented as best effort and possibly one vsync late.
- **Retuning `_overloadBrake`'s 400 ms / 3-strike thresholds.** Independent last-resort protection with a documented system-crash motivation. Integrate, do not touch.
- **`rafTimestamp` minus callback-entry time as a CPU/GPU disambiguator.** Genuinely cheap and genuinely useful, but quantized at 1 ms in Firefox and Safari and it would need its own acceptance evidence. The efficacy check covers the same failure with a lag instead. Record it in the rejection comment block so it is not re-litigated.
- **Keeping today's `_adaptQuality` verbatim as an unpaced branch** (proposed by both D1 and D3). Rejected: every measurement harness disables the governor (section 0a), so no published figure depends on it, and maintaining two controllers doubles the test matrix for no evidence gain. One state machine, two predicates.

---

## 4. What I am uncertain about

1. **Whether the owner's actual complaint is fixable by this change at all.** The museum demo boots with the governor off (`examples/main.js:229`), and the campaign's museum and tokyo numbers say the full-stack config at 720p on a 3060 does not clear 16.67 ms until renderScale 0.25. The demo's boot config is leaner and unmeasured. The gallery is the live case. Resolve this with a single measurement before writing any code: run the demo's boot config at the owner's actual fullscreen resolution and fence-time it. If it comes in above 16.67 ms, the correct fix for the museum is a cut and the image gain will come from C1 (convergence denoise) rather than from the control law.
2. **Chromium's timer-query quantum.** Documented only as "sufficiently reduced precision" with no named value. Measure at runtime; the smallest rung difference in my cornell fit is 1.34 ms, so a 1 ms quantum is usable and a 2 ms quantum is not.
3. **Whether the refresh divisor `L` will be welcome.** On a 120Hz panel it deliberately holds the app at 60 fps and spends the rest on lighting resolution. That is the owner's stated preference and the reason it is gated behind `spendPolicy` resolving to `quality`. A third-party app tuning for input latency will want `spendPolicy: "fps"`. I cannot resolve this without the owner saying which they want on a high-refresh display, and the 3060 owner's monitor refresh rate is not established anywhere in the repo.
4. **`stochasticLights` crossing 0.55.** The comment at `src/RealtimeRaytracer.js:331-334` explicitly says the 0.03-0.06 ms measurement cannot speak to the many-light case the switch exists for. My extra 15% margin on the upward crossing is a guess, not a measurement.
5. **`hasDynamicMeshes` as the denoise floor.** A blunt instrument, as D3 admits. The honest signal is the moments texture the pipeline already writes and then passes to the denoiser as `null` (`src/RealtimeRaytracer.js:2224`, `2254`), which needs an async readback path. Out of scope here; flagged as the follow-up.
6. **The efficacy check's 6-rung budget** when frames are already missing. Inherited from D2 as an admitted guess. A device that needed 7 rungs will be restored one short and re-trip after 30 s. Test 5 above pins the behaviour; it does not justify the number.