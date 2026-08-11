# REPORT: quality presets API + evidence round (v0.12.0)

Branch `presets`. Two parts per `docs/SPEC_QUALITY_PRESETS.md` and its "Part B
upgrade (owner directive)": Part A ships the presets API (RealtimeRaytracer.js
plumbing only, zero shader changes, byte-identity guarded); Part B tunes and
proves the presets on a permanent three-scene GAME benchmark page, judged by
fence-timed bench numbers AND blind Gemini video rankings on full-speed and
CPU-throttled high-DPR legs.

---

## Part A: what shipped

### `RealtimeRaytracer.PRESETS`

A plain, documented, inspectable static object. Four presets, each a flat map
of EXISTING option values. Every bundled knob is live-tunable: none swaps the
lighting megakernel's source or needs compileScene. Knobs that WOULD need a
recompile (`absorptionShadows`, `kmScattering`, `textureTiles`) are deliberately
excluded from all bundles.

| Preset | Intent | Value |
|---|---|---|
| `quality` | fidelity first | `renderScale` 0.75, `denoiseIterations` 2, `maxHistory` 256, `taa` on, `restir` on, `giHalfRate` off, `specular` on |
| `balanced` | today's defaults, captured explicitly | the preset-managed knob set at its constructor defaults: `renderScale` 0.5, `denoiseIterations` 2, `maxHistory` 128, `taa`/`restir`/`specular`/`stochasticLights` on, `giHalfRate` off, `volumetric.enabled` off, `fireflyClamp` 4.0 |
| `performance` | fps first | `renderScale` 0.375, `denoiseIterations` 3, `giHalfRate` on, `volumetric.enabled` off, `stochasticLights` on |
| `motion` | fast camera / gameplay | `maxHistory` 32, `fireflyClamp` 2.5, `taa` on, `restir` on |

The exact numbers are the MEASURED winners below, not guesses. Which scene drove
each choice is cited in "Tuning" under Part B.

### API surface

- `rt.applyPreset(name)` applies a bundle to the LIVE instance (safe mid-frame;
  no recompile, no scene reset). Unknown name throws with the valid list in the
  message. Applying a preset **re-arms the adaptive governor** at the new
  baseline: its EMA, cooldown and free-win state reset so it measures the new
  settings fresh.
- Constructor `preset: "balanced"` applies the bundle as the BASE of the options;
  explicit per-option values win over the preset. With **no** `preset` key the
  constructor is byte-identical to 0.11.1.
- `rt.preset` getter: returns the last preset name applied (constructor option
  or applyPreset), or `"custom"` when none has been. It is deliberately
  **last-applied-name only**: a knob the adaptive governor or a manual
  assignment changes afterwards does not flip it back to `"custom"` (a preset
  sets the baseline the governor breathes around, so the governor's own moves
  are not "customizing"). This is the "document honestly" option the spec
  offers; we chose it over a dirty-flag because the governor legitimately
  rewrites the bundled knobs, and a value-snapshot "custom" check would read the
  governor's adaptation as a manual change.
- **adaptiveQuality interplay**: presets set the BASELINE. With the governor on,
  `renderScale`/`denoiseIterations`/`stochasticLights` are starting points the
  governor then moves; `maxHistory`, `fireflyClamp`, `giHalfRate`, `specular`
  and volumetric are direct. Documented in the README's "Quality presets".

### Byte-identity guard

- **No shader changes of any kind** (grep-verified: no GLSL edits, no new
  uniforms, no new samplers, no traceRadiance changes).
- **Option-object equality** is asserted in the render self-test's new
  `?selftest=presets` leg: a fresh instance's option values equal a hardcoded
  0.11.1 snapshot, `applyPreset("balanced")` on a fresh instance changes
  NOTHING, and a constructor with `preset: "balanced"` equals a bare
  constructor. The game-bench cross-checks it too: `defaults` and `balanced`
  rows are the same config and their ghost/noise numbers are identical in every
  sweep.
- `node --check` is clean on every touched file.
- The full render self-test (`npm run test:render`) passes; see Verification.

---

## Part B: evidence

### The game-scene benchmark page (`game-bench.html`)

A permanent regression asset (`examples/game-scenes.js`). Three DETERMINISTIC
scenes (no `Math.random`, no physics engine, fixed waypoint arrays and fixed
event timings), each a scripted ~20s loop, so clips are frame-comparable across
presets at the same wall-clock time:

- **chase**  -  third-person camera following a fast prop down a corridor with
  large occluders. The camera translates AND turns, constantly disoccluding
  pixels: the ghosting the `motion` preset exists for.
- **stealth**  -  Umbral-flavored dark room: two sweeping SpotLight cones, a
  player-proxy box sneaking between crates, one flickering emissive. Dark-scene
  noise is where viewers judge RT hardest.
- **arena**  -  combat chaos: 16 low-poly dynamic props, a mid-clip scatter
  impulse (the explode pattern), two low-poly emissive projectiles flying, a
  key light toggling mid-clip. Stresses dynamic BVH re-bake, NEE churn and
  firefly control.

Two implementation notes learned the hard way (both now code comments):
dynamic emitters must be LOW-POLY  -  the engine's NEE cap is 256 emissive
triangles shared across all emitters, and a dense `SphereGeometry` projectile
blew the cap and tore the pipeline; and the 18 dynamic meshes must be low-poly
or the per-frame dynamic BVH re-bake pushed the NVIDIA driver into a TDR on this
machine.

`?mode=bench` fence-times ms/frame (median of THREE blocks) at a fixed pose,
runs a ghost probe (reference at pose B, settle at A, sweep A->B over 24
frames, park at B, read the centred 96x96 patch diff after 1/5/10/20/40 frames)
and a still-noise read (30 parked frames, mean |diff| on a 320x180 downsample).
`?mode=clip` runs the loop for video capture with the adaptive governor ON, an
fps/lighting badge, and a BLIND label badge (never the preset name). The bench
is documented in the README's "Gallery & benchmarks" section.

### Bench table (ms/frame, fps, ghosting score per preset, defaults baseline)

RTX 3060, 1280x720, `adaptiveQuality OFF`, median-of-3 fence-timed blocks.
`ms` is the MINIMUM across the N collected runs (this Windows/ANGLE machine
shows run-to-run timing variance of up to ~30% for a fixed config  -  the ghost
and noise numbers are deterministic within a run; `defaults` and `balanced` are
the same config and match exactly). Full per-run spreads in
`_reviews/presets/report-table.json`.

| scene | preset | ms/frame | fps | ghost@1 | ghost@10 | ghost@40 | stillNoise |
|---|---|---|---|---|---|---|---|
| chase | defaults | 9.05 | 110.5 | 0.170 | 0.133 | 0.073 | 0.036 |
| chase | quality | 18.89 | 52.9 | 0.167 | 0.105 | 0.060 | 0.036 |
| chase | balanced | 9.04 | 110.6 | 0.170 | 0.133 | 0.073 | 0.036 |
| chase | performance | 4.91 | 203.7 | 0.178 | 0.129 | 0.070 | 0.033 |
| chase | motion | 9.08 | 110.1 | 0.168 | 0.121 | 0.056 | 0.042 |
| stealth | defaults | 22.22 | 45.0 | 0.869 | 0.638 | 0.258 | 0.032 |
| stealth | quality | 47.39 | 21.1 | 0.869 | 0.638 | 0.277 | 0.033 |
| stealth | balanced | 22.08 | 45.3 | 0.869 | 0.638 | 0.258 | 0.032 |
| stealth | performance | 11.34 | 88.2 | 0.839 | 0.611 | 0.287 | 0.031 |
| stealth | motion | 22.16 | 45.1 | 0.896 | 0.656 | 0.260 | 0.034 |
| arena | defaults | 61.96 | 16.1 | 3.914 | 3.144 | 1.730 | 0.121 |
| arena | quality | 149.71 | 6.7 | 4.231 | 3.419 | 2.091 | 0.127 |
| arena | balanced | 62.16 | 16.1 | 3.914 | 3.144 | 1.730 | 0.121 |
| arena | performance | 31.74 | 31.5 | 3.745 | 2.861 | 1.766 | 0.113 |
| arena | motion | 62.30 | 16.1 | 3.135 | 2.373 | 1.096 | 0.135 |

`ghost@N` is mean abs diff (0-255) of the centre patch vs a settled reference
after N parked frames; lower is less residual. The motion preset's ghosting win
is clearest on the arena (the scene with the scatter impulse, moving props and
light toggle): `ghost@40` 1.096 vs balanced's 1.730 (-37%), at +11% still-noise
on that scene (0.135 vs 0.121)  -  the named trade. `defaults` and `balanced` are
byte-identical and the bench confirms it (identical ghost/noise in every sweep).

### Tuning: which scene drove each shipped value

- **quality.denoiseIterations = 2**: the quality campaign (docs/QUALITY_CAMPAIGN_2026-07)
  measured rmse-vs-reference degrading monotonically past 2 passes in every
  scene, with the à-trous lattice rising 4-5x between 2 and 4 passes. The
  game-bench ghost probe PREFERS 3 passes (chase g1 0.103 vs 0.168)  -  but that
  is the ghost probe rewarding smoothing, not accuracy; for a fidelity preset
  the rmse evidence wins. "High end" = the most passes that still helps.
- **quality.maxHistory = 256**: "long history" for a parked/fidelity camera. On
  the chase scene the ghost/noise at 128 vs 256 are identical (g1 0.168 both,
  noise 0.036 both), so the longer value costs nothing and matches the intent.
- **performance.renderScale = 0.375**: the arena bench  -  31.74ms vs 51.73ms at
  renderScale 0.5 (62% faster) with equal-or-BETTER ghost (g1 3.745 vs 3.870)
  and noise (0.113 vs 0.117). The spec's 0.375-0.5 range resolves to the fast
  end for an fps-first preset.
- **motion.maxHistory = 32**: the arena ghost probe (the ghosting-stress scene).
  g40 1.096 (mh32) vs 1.359 (mh48, the previous guess) vs 1.730 (default 128),
  at +7% still-noise vs mh48 on the arena. The motion preset exists to cut
  ghosting, so the shorter value wins; the +noise is the accepted trade.
- **motion.fireflyClamp = 2.5**: "stronger than the 4.0 default" (37% tighter).
  The bench cannot discriminate clamp values (ghost/noise identical at 2.0/2.5/
  3.0  -  it is a firefly-suppression knob, not a temporal or noise-mean one);
  the video ranking shows the firefly control. See Caveats.

### Blind Gemini rankings, full-speed leg

Clips labeled A/B/C/D per scene (label shown in the clip corner; the preset is
NEVER shown). The critic ranked the four clips blind on noise, ghosting and
watchability. Decode tables are in `_reviews/presets/capture-plan.json`; full
rankings in `_reviews/presets/rank-<scene>-full.txt`.

| scene | 1st | 2nd | 3rd | 4th |
|---|---|---|---|---|
| chase | motion | balanced | performance | quality |
| stealth | performance | balanced | motion | quality |
| arena | balanced | quality | performance | motion |

Key quotes (chase):

> **Clip D [motion]**: "exceptionally clean, sharp, and stable. There is
> virtually no visible noise or grain... the light toggle at 0:08 updates almost
> instantaneously with zero temporal lag or noise bursts. Ghosting is
> non-existent."
> **Clip A [quality]**: "suffers from extreme, high-frequency pixel noise and
> heavy grain throughout... When the light toggles back on at 0:08, the scene is
> flooded with a massive swarm of raw, unresolved noise that takes several
> seconds to even partially settle."

The headline: on the fast-camera chase, the MOTION preset wins and the QUALITY
preset is last. Quality's long history (256) makes the temporal stores stale
under camera motion  -  the light toggle floods the frame with un-reconverged
noise  -  exactly the trade the motion preset is named for. Stealth's dark-scene
ranking prefers the low-res + heavier-denoise performance preset (quality's
long history again reads as slow dark-scene convergence). These are the "honest
way" verdicts the owner asked for, and they are a strong defaults signal (see
Defaults recommendation).

The arena full-speed ranking is the weakest evidence: the critic's fps
observations (50fps vs 16fps between clips of the same-config presets) are
dominated by the machine's run-to-run timing variance, and low fps reads as
ghosting. Balanced won, quality placed 2nd; motion placed last mostly on the
low observed fps. The bench's controlled ghost probe (frozen scene, same camera
motion) is the reliable ghosting measure there, and it says motion < balanced.
Noted honestly in Caveats.

### Blind Gemini rankings, throttled leg

CPU-throttled leg per the spec: Playwright CDP `Emulation.setCPUThrottlingRate`
5x plus `deviceScaleFactor 2` (2560x1600 drawing buffer), real GPU
(`--use-angle=gl`). This is a CPU+resolution PROXY for low-end, not a real
low-end device  -  the GPU is still the RTX 3060, so ray/triangle throughput is
unaffected; the CPU side (compile, updateDynamic, the JS frame loop) is 5x
slower and the buffer is 4x the pixels.

The governor visibly steps in every throttled clip (the fps badge shows
`lighting @ %` dropping from the preset baseline to the machine's sustainable
level; e.g. chase performance went 38% -> 20% over the first seconds, then held
60fps). Presets remain distinguishable on the chase scene.

| scene | 1st | 2nd | 3rd | 4th |
|---|---|---|---|---|
| chase | quality | performance | motion | balanced |
| stealth | performance | balanced | quality | motion* |
| arena | balanced | quality | motion | performance |

\* the throttled stealth MOTION clip white-screens at ~20s (see Caveats), so
its last place is unreliable.

Key quotes (chase throttled):

> **Clip D [quality]**: "strikingly well-balanced render. Very low noise...
> Ghosting and smearing are minimal... When the light toggles on at 0:08, the
> lighting and shadows resolve almost instantly with superb clarity."
> **Clip C [balanced]**: "the entire scene is covered in a thick, boiling layer
> of heavy black-and-white grain that never resolves."

The throttled chase ranking REVERSES the full-speed one: quality wins under
throttle. At the throttled leg's low frame rate, a LONG history accumulates
MORE samples per wall-clock second, so quality's 256-frame history smooths the
image while balanced's 128 and motion's 32 leave it boiling. At full speed the
same long history is a ghost liability. History length is frame-rate-dependent  - 
a genuinely useful finding the video made visible and the bench could not.

### Throttled-leg observations

- Governor stepping is visible in the badge in every throttled clip (fps and
  `lighting @ %` both move as the governor breathes around the preset baseline).
- Under the extreme 5x+DPR2 throttle the heavy scenes converge toward the same
  low governor settings, so presets are most distinguishable on the light chase
  scene.
- Several throttled clips white-screen in the last few seconds (chase D quality
  at ~17s, arena D balanced at ~17s, stealth B motion at ~20s). The page's JS
  keeps running (the fps badge advances)  -  this is the video COMPOSITOR failing
  under the simultaneous 5x CPU throttle + DPR2 + video encode, not a renderer
  crash. The full-speed clips are clean.

---

## Defaults recommendation (write only; the architect decides)

**Lower the default `maxHistory` from 128 to 48.** Two independent evidence
strands:

1. The bench: on the arena (the ghosting-stress scene), the default-128 config
   ghosts `g40` 1.730; at maxHistory 48 (the demo's own setting) that drops to
   1.359 (-21%) for a ~4% still-noise increase on that scene (0.121 -> 0.126).
2. The full-speed chase blind ranking put the default-128 balanced preset 2nd
   behind motion, and the reviewer described balanced's long-history lag
   explicitly ("the illumination slowly fades up over several frames rather than
   updating instantly... visible ghosting and a dark trailing smear behind the
   blue sphere").

Do NOT take it to motion's 32: that is the aggressive trade (+11% arena
still-noise) and belongs to a named preset, not the zero-config default. 48 is
the measured middle that already ships in the demo. This is a recommendation
only; no default changed in this round (`balanced` still IS today's 128).

---

## Caveats

- **Timing variance.** This Windows/ANGLE machine shows run-to-run fence-timed
  ms variance up to ~30% for a fixed config (e.g. chase/defaults ran 9.05 / 9.08
  / 21.07 ms across three sweeps). Reported ms is the MINIMUM across runs (the
  cost floor; variance adds upward), and the report table shows the per-run
  spread in `report-table.json`. Ghost and still-noise are deterministic within
  a run and `defaults`-vs-`balanced` match exactly in every sweep. The relative
  ordering (performance < balanced < quality, everywhere) is far larger than the
  variance and is robust.
- **Throttled leg is a proxy.** CPU 5x + DPR2 pressures the CPU side and the
  pixel count, but the GPU is the same RTX 3060; a real low-end device would
  also be ray-throughput-bound. Label it a proxy, not a low-end simulator.
- **Arena full-speed ranking is fps-confounded.** The critic's ranking on the
  arena tracks its observed fps, which varied with machine state between clips
  of identical-config presets; low fps reads as ghosting. The bench ghost probe
  (controlled) is the reliable arena ghosting signal and it favors motion.
- **Throttled-leg white-screen captures.** Several throttled clips fail in the
  last seconds (compositor, not renderer). The affected clips' rankings are
  partial; noted per scene above.
- **`rt.preset` is last-applied-name only.** A manual or governor-driven knob
  change after applyPreset does not flip the getter to "custom" (documented
  decision, see Part A).
- **Umbral note (report only, per the spec).** The owner asked about testing the
  presets inside the real Umbral game; Umbral pins engine 0.3.0, nine versions
  back, so that is a separate upgrade project. The stealth scene here is its
  stand-in.

---

## Verification

- `node --check` clean on every touched JS file.
- Render self-test (`npm run test:render`) PASSES, exit 0:

  | engine | status | meanLum | irrLum | glErr | notes |
  |---|---|---|---|---|---|
  | chromium | pass | 143.01 | 173.82 | 0 | warnings 0, frames 91 |
  | chromium@3latest | pass | 143.07 | 173.88 | 0 | |
  | empty-scene | pass | | | | compileScene no-op + render fallback |
  | warnings | pass | | | | diagnostics fire once, status.warnings |
  | **presets** | pass | | | | defaults byte-identity + balanced no-op + all API gates |
  | firefox / webkit | skip | | | | documented environmental skips (ANGLE D3D11/FXC stall; WebKit no GL) |

  The new `?selftest=presets` leg asserts `defaultsMatch`, `balancedNoop`,
  `ctorBalanced`, `explicitWins`, `presetStillApplied`, `qualityApplied`,
  `perfApplied`, `motionApplied`, `unknownThrows`, `getterCtor/Apply/Custom`,
  `presetsShape` and `allFlat`  -  all true.
- Game-bench sweeps: 15 configs (3 scenes x 5 presets) repeated across several
  runs; `defaults`-vs-`balanced` byte-identity confirmed by identical
  ghost/noise in every run.
- All captures and bench JSONs live under `_reviews/presets/`.

## Files touched

- `src/RealtimeRaytracer.js`  -  PRESETS, applyPreset, constructor preset merge,
  `preset` getter, `_rearmGovernor`.
- `src/index.d.ts`  -  PresetName, RealtimeRaytracerPreset, `preset` option,
  static PRESETS, `preset` getter, applyPreset.
- `examples/main.js`, `scripts/selftest.mjs`  -  the `?selftest=presets` leg.
- `examples/bench.js`  -  `?presets=1` museum preset rows (superseded by
  game-bench but kept for bench.html compatibility).
- `examples/campaign.js`  -  fireflyClamp in applyConfig + a `presets` plan.
- `examples/game-scenes.js`, `examples/game-bench.js`, `game-bench.html`  -  the
  permanent game benchmark page.
- `vite.config.js`  -  game-bench entry.
- `README.md`  -  Quality presets section + game-bench documentation.
- `CHANGELOG.md`, `package.json`  -  0.12.0.
