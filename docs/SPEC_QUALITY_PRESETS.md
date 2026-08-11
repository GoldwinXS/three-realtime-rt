# SPEC: quality presets API + defaults evidence round (v0.12.0)

Author: the architect. Implementer: you. Read fully before coding. Branch is
yours; do not run git commands beyond the read-only `git diff`/`git show` you
may be granted. No emojis, no em dashes. `src/` MAY be touched this round, but
ONLY RealtimeRaytracer.js (option plumbing) and only as described: no shader
changes of any kind, no new uniforms, no new samplers, no traceRadiance
changes. Presets bundle EXISTING knobs.

## Why

The project owner wants (a) named quality presets any product or game can wire
in without understanding fifteen sliders, and (b) evidence-based tuning of the
noise and ghosting people notice, judged the honest way: video, in motion, on
strong AND simulated-weak hardware.

## Part A: the presets API

Add to RealtimeRaytracer:

- `RealtimeRaytracer.PRESETS`: a plain, documented, inspectable object. Four
  presets, each a flat map of existing option values:
  - `quality`: fidelity first. renderScale 0.75, denoiseIterations high end,
    maxHistory long, TAA on, restir on, giHalfRate off, specular on.
  - `balanced`: today's defaults, captured explicitly (this preset must be a
    no-op on a fresh instance, asserted in the selftest).
  - `performance`: fps first. renderScale 0.375-0.5, more denoise passes (they
    are cheap at low res), giHalfRate on, volumetric off, stochasticLights on.
  - `motion`: for fast camera/gameplay. Shorter maxHistory, stronger firefly
    clamp, TAA on, restir on; accepts slight extra noise to cut ghosting.
  Exact values are yours to TUNE in Part B; the shipped numbers must be the
  measured winners, not guesses.
- `rt.applyPreset(name)`: applies the bundle to the live instance. Knobs that
  need a recompile do not exist in these bundles by design (verify: if any
  preset value would require compileScene, redesign the bundle). Unknown name
  throws with the valid list in the message.
- Constructor option `preset: "balanced"` applied before per-option overrides
  (explicit options win over the preset; document the precedence).
- `rt.preset` getter returning the last applied name or "custom" once any
  bundled knob is changed manually (cheap dirty-flag on the setters involved,
  or document honestly that the getter is last-applied-name only; pick one and
  say which in the report).
- adaptiveQuality interplay: presets set the BASELINE the governor breathes
  around; applying a preset re-arms the governor at that baseline. Document.

README gains a "Quality presets" section with a copy-paste integration
snippet for a game loop, and index.d.ts gains the types. CHANGELOG entry for
0.12.0; bump package.json.

## Part B: evidence

Tune and prove the presets with BOTH instruments:

1. **Numbers**: the existing bench harness (bench.html, fence-timed ms, and
   its ghosting metric) run per preset on the museum demo at 720p on this
   machine's RTX 3060. Table in the report: ms/frame, fps, ghosting score per
   preset, plus today's defaults as the baseline row.
2. **Gemini video verdicts**: capture per-preset clips of the SAME scripted
   motion (orbit sweep, a dragged prop, a light toggle mid-clip) via the
   critic in video mode with --gpu, and ask it to rank the clips on noise,
   ghosting, and overall watchability WITHOUT telling it which preset is
   which (label them A/B/C/D). Two hardware legs:
   - Full speed (the 3060 as-is).
   - Throttled leg: Playwright CDP `Emulation.setCPUThrottlingRate` at 4-6x
     plus a high-DPR viewport (deviceScaleFactor 2) to pressure the governor
     the way weak hardware does. The engine needs a real GPU, so this is a
     CPU+resolution proxy for low-end, not a perfect one; label it honestly
     in the report. Verify the governor visibly steps in the clip (fps badge)
     and that presets remain distinguishable under throttle.
3. **Defaults recommendation, not defaults change**: if the evidence says
   today's defaults should change (e.g. balanced should adopt motion's
   history), write the recommendation with the numbers in the report and STOP.
   The architect decides default changes; you ship presets only.

## Guardrails

- Byte-identity: with no preset option passed, generated shader source and
  all default option values are identical to 0.11.1 (assert option-object
  equality in the selftest; the existing km/absorption byte-identity pattern
  is the model).
- The selftest (`npm run test:render` family) must pass, plus a new
  assertion: `applyPreset("balanced")` on a fresh instance changes nothing.
- node --check on touched files.
- Every capture and bench json goes under `_reviews/presets/`.

## Deliverables

Implementation per Part A, evidence per Part B, README + d.ts + CHANGELOG,
and `REPORT_PRESETS.md`: the preset value tables, the bench table, the
critic's blind rankings (quote them), the throttled-leg observations, your
defaults recommendation with reasoning, and honest caveats. Stop there; the
architect gates, decides on defaults, and releases.

## Part B upgrade (owner directive): tune against GAME scenes, not gallery orbits

The presets exist for games. A museum orbit is the wrong benchmark. Build a
permanent game-scene benchmark page, `game-bench.html?scene=<name>`, with
THREE deterministic scenes, each a scripted ~20 second loop (fixed camera
path and fixed event timings, so clips are frame-comparable across presets):

1. `chase`: a third-person camera following a fast-moving prop through
   corridors/around large occluders. Stresses disocclusion ghosting: the
   thing the motion preset exists for. Camera translates AND turns.
2. `stealth`: Umbral-flavored. A dark room, two moving SpotLight cones
   sweeping, a player-proxy box sneaking between crates, one flickering
   emissive. Stresses noise-in-darkness and light-motion churn: dark-scene
   noise is where viewers judge RT hardest.
3. `arena`: combat-flavored chaos. 15-20 dynamic props, a mid-clip scatter
   impulse (the explode pattern from the demo), two emissive projectiles
   flying, a light toggling mid-clip. Stresses dynamic BVH re-bake, NEE
   churn, and firefly control.

Reuse existing repo assets and patterns (museum geometry, Rapier or scripted
kinematics, SpotLight rigs). Deterministic means NO unseeded randomness: fixed
arrays of waypoints/timings.

Part B's evidence then runs per scene x per preset x both hardware legs:
bench numbers AND blind Gemini rankings (clips labeled A/B/C/D per scene).
The report's preset value tables must cite which scene drove each tuning
choice. The bench page ships in the repo as a permanent regression asset;
document it in the README's development section.

Note for the report only (do not act): the owner asked about testing presets
inside the real Umbral game; Umbral pins engine 0.3.0, nine versions back, so
that is a separate upgrade project. The stealth scene here is its stand-in.
