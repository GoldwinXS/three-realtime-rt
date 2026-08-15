# Porting the Hangar engine work into the library: 0.15.0

Spec: `dev/SPEC-0.15.md`. Branch `feature/restir-0.15`, cut from master `47b4422`
(= 0.14.1 exactly). Everything below was measured on this worktree's dev server
(`:8149`), headed Chromium with `--use-angle=gl`, RTX 3060, 2026-08-15.

**Read the caveat first, because it decides how to read every millisecond in
this document.** This machine's GPU is shared with other sessions and was at
**100% utilisation for most of this work**, dropping to 0% twice. That is not a
footnote: the first attempt at the defaults benchmark produced a run-to-run
floor of **158 ms against a 77 ms delta**, i.e. the drift between the two halves
of one run was twice the size of the effect being measured. Every timing below
is therefore either (a) taken during a verified-idle window and labelled as
such, or (b) reported as a per-pair RATIO measured back to back so the
contention lands on both arms. Absolute milliseconds on this machine are
indicative; ratios are not.

## Commits

| | |
|---|---|
| `d57e6d0` | The Hangar engine work, verbatim |
| `cdc118b` | Defaults that just work: correctness on, expense off |
| `31c69d3` | Ambient and hemisphere lights, so gi:false is not black |
| `19f6088` | Demo knobs for every new option, and a Reset that means it |
| `169433f` | Waterfall: the gallery's first scene that moves |
| `a991e94` | 0.15.0: README, CHANGELOG, version, and the release gates |

`dev/hangar-engine.patch` applied with `patch -p1`, nine files, no fuzz, as one
commit before anything else, exactly as the spec required.

---

# Part 5: the checks that gate this release

## 1. `npm run test:render` — PASS

Both chromium legs pass, and so do all five check pages. Full matrix, GPU
verified idle (0%) at the start of the run:

```
engine            status  meanLum   irrLum   glErr  specMRT
chromium          pass    151.59    182.13   0      true
firefox           skip    -         -        -      -
webkit            skip    -         -        -      -
chromium@3latest  pass    151.59    182.19   0      true
empty-scene       pass    warnings  pass     presets pass
ambient           pass    governor  pass
PASS (skipped: firefox, webkit)
```

firefox and webkit are the same documented environmental skips as on master
(ANGLE D3D11/FXC stalls compiling the megakernel; Playwright's Windows WebKit
has no usable WebGL2). They skipped identically on the master baseline.

### meanLum / irrLum, before and after

The comparison holds the DEMO constant and swaps only `src/`, so the number
isolates the renderer rather than the demo's boot config. Master's `src/` was
checked out over the tree and the dev server was confirmed to be serving it
(`curl … | grep -c restirDirectionalBypass` → 0; the page also reports
`hasAmbientOption: "undefined"`, which is the chain of custody).

| leg | master `src/` | this branch | delta |
|---|---|---|---|
| chromium, three 0.160.1 | meanLum **151.50**, irrLum **181.93** | **151.59**, **182.13** | +0.09, +0.20 |
| chromium@3latest, three 0.185.1 | **151.45**, **181.89** | **151.59**, **182.19** | +0.14, +0.30 |

Branch run-to-run on the pinned leg, four runs: 151.59, 151.60, 152.22, 152.34 —
**spread 0.75**. Every delta above is inside that spread, so **the difference is
at the floor and is not a measurement**.

**The spec expected these numbers to move because GI is now off. They do not,
and the reason is worth stating plainly: `?selftest=1` explicitly sets
`rt.gi = true`, `emissiveNEE`, `reflections`, `refraction` and
`renderScale = 0.5` before it measures.** The self-test deliberately drives the
full lighting stack so its verdict is calibrated against a fixed configuration —
so the defaults change cannot reach it, by design. What little movement there is
(+0.1 to +0.3, at the floor) is in the direction the Hangar work predicts: the
relative cap and importance-sampled candidates recover light the old estimator
lost. The place the defaults change IS visible is check 5.

The ambient assertion passes:
`{"ambientLit":true,"ambientOffDark":true,"hemiLit":true,"hemiSplit":true,
"ambLum":235,"ambOffLum":0,"hemiUpLum":213,"hemiDownLum":38.76}`.
Read `ambOffLum: 0` twice: **before this release, a scene whose only light was
an `AmbientLight` rendered pure black.** That is the bug the option fixes and
the reason `gi: false` is safe to ship.

One incidental: `rtPrograms` goes 10 → 12. Two more `rt:*` programs link on this
branch (the motion-vector G-buffer variant and the extra reservoir stage). The
gate only requires > 0; noted because it is a real change in what the driver
compiles.

## 2. `npm run test:km` — 24/27, and this is the one gate that does NOT pass

All 23 numerics checks pass. So does "the KM variant is a strict superset". The
three failures are all the same check: **"variant X byte-identical to master"**,
for `plain`, `absorption` and `absorbShadows`.

**It is the patch that does this, not the port.** Attributed by stashing the
port work and running the gate at the patch commit alone:

| | plain variant |
|---|---|
| master (0.14.1) | 58286 B |
| patch commit `d57e6d0` | 70346 B (+12060) |
| this branch (patch + ambient) | 72088 B (+1742 on top) |

**The gate as written cannot pass on any branch that edits the lighting
megakernel.** Its stated contract is the KM feature's zero-cost-when-unused
promise, but its baseline is the MOVING ref `master`, which is now 0.14.1 rather
than the pre-KM commit — so it has quietly become "the lighting shader must
never change again", and it goes green only after a merge, by definition.

**Reported rather than fixed**, per the spec's instruction not to paper over a
failing check. The obvious remedy — pin the comparison to the pre-KM commit
instead of `master` — is a change to a release gate and belongs to the owner,
not to this pass. What the KM contract actually needs is already covered by the
surviving check (`km` strips back cleanly to `absorbShadows`) plus check 3 below.

## 3. Byte-identity of the legacy path — PASS, on the frozen render

Two halves, as the spec anticipated.

### 3a. Shader source (`node dev/legacy-identity.mjs`)

Every pass's fragment source built from BOTH trees and hashed:

| pass.variant | master | branch | verdict |
|---|---|---|---|
| RTLightingPass.lighting | 58286 B `c74c266d` | 72088 B `2170dc3f` | +223 / −22 lines |
| RTLightingPass.plain | 58286 B | 72088 B | +223 / −22 lines |
| RTLightingPass.absorption | 61433 B | 75235 B | +223 / −22 lines |
| RTLightingPass.absorbShadows | 67985 B | 81787 B | +223 / −22 lines |
| RestirPass.temporal | 7405 B `588809bb` | 18997 B `8cb0001d` | +233 / −29 lines |
| RestirPass.spatial | 6721 B `c678f3f8` | 9703 B `ef7e210a` | +48 / −2 lines |
| AccumulatePass.accum | 9563 B `f4e35711` | 10612 B `50d1e03f` | +24 / −7 lines |
| TAAPass.taa | 3577 B `d6da8283` | 4255 B `b91a11a8` | +15 / −4 lines |
| **DenoisePass.denoise** | 11718 B `b8a19f47` | 11718 B `b8a19f47` | **IDENTICAL** |
| **CompositePass.composite** | 9378 B `223b9482` | 9378 B `223b9482` | **IDENTICAL** |
| **VolumetricPass.volumetric** | 19107 B `2c068d15` | 19107 B `2c068d15` | **IDENTICAL** |
| **GIReservoirPass.gi** | 54248 B `386767c2` | 54248 B `386767c2` | **IDENTICAL** |

Six variants differ, exactly as the spec predicted they might: **the Hangar work
is uniform-gated, not source-spliced** — the `RT_*` markers are provenance, not
preprocessor directives — so a uniform that is `false` still declares itself and
its dead branch still occupies source. The four passes the patch did not touch
are byte-identical, which is itself worth having: no accidental re-tokenisation
crept in.

My ambient work is **+1742 bytes** of that 13802 in the lighting pass (four
uniform declarations and one statement) and is likewise uniform-gated. Splicing
it would have made `ambient` a fifth dimension of the absorption/KM variant
ladder and a full megakernel recompile on every toggle, which is not a trade
worth making for four uniforms.

### 3b. The frozen render (`dev/legacy-render.{html,js}`) — the gate, and it passes bit for bit

The museum, compiled **static** (no `dynamicMeshes`, no `updateDynamic`, so
nothing rides a wall clock), one pinned pose, `adaptiveQuality` and
`overloadProtection` off, 120 renders from a fresh renderer at 1280×720, FNV-1a
over all 2,764,800 RGB bytes of the drawing buffer.

| tree | options | hash | meanLum |
|---|---|---|---|
| this branch | 0.14.1 set, run 1 | **`31a25b4d`** | 160.51 |
| this branch | 0.14.1 set, run 2 | **`31a25b4d`** | 160.51 |
| **master `src/`** | 0.14.1 set, run 1 | **`31a25b4d`** | 160.51 |
| **master `src/`** | 0.14.1 set, run 2 | **`31a25b4d`** | 160.51 |
| this branch | 0.15.0 defaults | `fc6b17c2` | 155.85 |

**The protocol reproduces its own bytes** (same hash twice on each tree), so the
floor for this comparison is exactly zero — and across that zero floor, **this
branch with every new option off is master, bit for bit.** The option set passed
in both arms is written out in `dev/legacy-render.js`: `gi: true`,
`stochasticLights: true`, `ambient: false`, `motionVectors: false`,
`restirWarmAge: 0`, `restirDirectionalBypass: false`,
`restirReprojectionRescue: false`, `restirCandidateImportance: false`,
`restirClampRel: 0`, `restirSamples: 1`, `restirSampleRadius: 10`,
`restirDynamicAccept: false`, `restirDynamicFreeze: false`.

Chain of custody: the served file was checked with `curl` before each swap
(`grep -c restirDirectionalBypass` → 0 on master, 4 after restoring), and the
page's own verdict reports `hasAmbientOption` as `"undefined"` on master and
`"boolean"` on the branch.

## 4. WebKit budgets — PASS, nothing added

**`traceRadiance(` call sites in `src/RTLightingPass.js`: 4 on master, 4 on this
branch.** Counted textually, one declaration and three call sites, at the same
three places (metal reflection, glass refraction exit, the unified secondary
site). The limit is 3 call sites; a fourth silently emits a broken program in
WebKit's GLSL→Metal translation.

**The per-light loop has exactly ONE call site.** `shadeLightSet` is declared
once and called once, with a `mode` argument (0 = every light + emissive, 1 =
directional only, 2 = nothing and no RNG consumed) doing the work a second
helper would have done. That shape is not a preference: the Hangar established
that a SECOND copy of the per-light loop compiles as GLSL and then fails to LINK
on ANGLE/GL with "too many temporaries" — a black screen with
`status.coreFailure = "rt:lighting"`.

**`phatOf` has one call site inside the candidate loop** (`RestirPass.js:328`),
for the same reason; the other three are the history/neighbour/final evaluations
outside it.

**Samplers.** Counted from the built shader source rather than from the file,
because `three-mesh-bvh`'s `BVH` struct expands to **4** samplers apiece and
nothing in the file says so. The lighting megakernel binds **exactly 16**, the
WebGL2 guaranteed minimum, unchanged from master:

1–4 `bvhStatic` · 5–8 `bvhDynamic` · 9 `uAttrStatic` · 10 `uAttrDynamic` ·
11 `uMaterialsTex` · 12 `uGWorldPos` · 13 `uGNormalMetal` · 14 `uPrevAccum` ·
15 `uPrevGWorldPos` · 16 `uReservoir`

(`uVolumeTex` would be the 17th; it lives behind `#ifdef RT_VOLUME_ALBEDO`,
which is only defined when a scene registers a volume AND the GPU exposes ≥ 17
fragment texture units, so it is not part of the default budget.)

**My ambient work added four `vec3` uniforms and zero samplers**, which was the
constraint the design was written under.

Other programs: `specAccumFrag` 5, `copyFrag` 0. **RestirPass**: `temporalFrag`
**7** (master 5; the patch adds `uGDynamic` and `uGMotion`), `spatialFrag` **4**.
Both comfortably inside 16.

## 5. bench.html, museum, 720p, defaults-old vs defaults-new — PASS

`bench.html?defaults=1`, added for this check. Three arms so the result can be
attributed rather than just stated, five interleaved pairs, GPU verified idle:

| arm | pair 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 0.14.1 defaults | 104.76 | 114.19 | 100.17 | 129.89 | 109.53 ms |
| 0.15.0 + gi back on | 114.03 | 102.14 | 108.26 | 129.61 | 110.75 ms |
| 0.15.0 defaults | 82.26 | 60.69 | 88.85 | 94.99 | 66.22 ms |

Per-pair ratios, each pair measured back to back so drift cancels:

| ratio | pairs | median | spread |
|---|---|---|---|
| **0.15.0 / 0.14.1** (the whole change) | 0.785 0.531 0.887 0.731 0.605 | **0.731** | 0.355 |
| **0.15.0+gi / 0.14.1** (everything EXCEPT gi) | 1.089 0.894 1.081 0.998 1.011 | **1.011** | 0.194 |
| **0.15.0 / 0.15.0+gi** (gi alone) | 0.721 0.594 0.821 0.733 0.598 | **0.721** | 0.227 |

Across-pair spread of the SAME arm (this is the contention, not the change):
old 29.7 ms, new 34.3 ms. Median delta −34.90 ms.

**The 0.15.0 defaults are 0.73× the frame time of 0.14.1's on this scene — about
1.37× the frame rate — and every one of the five pairs agrees in sign.**

**What drives it, which is the part the spec asked for: all of it is GI.** The
"everything except gi" ratio has a median of **1.011** with a spread of 0.194
that straddles 1, so the four ReSTIR correctness fixes plus motion vectors cost
**nothing measurable**; the gi-only ratio is **0.721** with all five pairs below
1. That is the release's thesis measured directly: correctness is free, the
expensive feature going off is the entire saving.

Two of the spec's three predictions about the drivers are confirmed by the
scene's contents rather than by the timer, and it is worth saying which:
**the museum has NO `DirectionalLight`** (only `PointLight` and `SpotLight`,
`examples/scene.js`), so the sun bypass costs zero rays there and its "+8.7%
where a sun exists" does not appear in this table at all. And **the museum has
no `AmbientLight` or `HemisphereLight`**, so `ambient` uploads zeros and is free
in the literal sense — the same four uniforms, all zero.

A first attempt at this check, run while other sessions held the GPU at 100%,
is preserved here as a warning: it reported a −77 ms delta against a run-to-run
floor of **158 ms** and would have been read as a large win by anyone who did
not print the floor beside it. A second contaminated attempt swung the SAME arm
from 63 ms to 253 ms and produced ratios from 0.593 to 2.189. Neither is used
for any claim above.

An earlier clean two-arm run of the same instrument gave a median ratio of
**0.759** against this run's **0.731** — two independent idle-GPU runs agreeing
on the headline to within 0.03.

## 6. Types — PASS

`git log --grep d.ts` says the previous types commit was "Verified with tsc
--strict against a consumer-shaped construction", so that is what was done
rather than a bare `tsc --noEmit` over the `.d.ts`, which never exercises the
option object. `dev/_tscheck/` holds a consumer that constructs with every
option 0.15.0 introduced or flipped, assigns each live property, reads
`motionVectorsSupported` / `gpuCostMs`, uses `RealtimeRaytracer.DEFAULTS`, and
reads `compiled.emissivePower`.

```
tsc --strict --noEmit  →  EXIT=0, clean
```

three@0.160 ships no type declarations and this repo has no `@types/three`, so
`dev/_tscheck/three-shim.d.ts` declares the handful of three types
`index.d.ts` imports. It is deliberately loose: the subject of the check is our
`.d.ts`, not three's API.

**Negative control**, so the check is known to have teeth: adding
`restirSpatialTaps: 4` (one of the six phantom options removed in `cdc118b`)
now fails with
`TS2561: 'restirSpatialTaps' does not exist in type 'RealtimeRaytracerOptions'`.
`node -e "import('./src/index.js')"` also imports clean.

## 7. `npm pack --dry-run` — PASS

**23 files at 0.15.0, the same list as 0.14.1**: LICENSE, README.md,
package.json and 20 files under `src/`. The `src/` file list is byte-for-byte the
same set as master's (`git ls-tree -r master --name-only -- src`, diff empty, 20
files). Nothing from `dev/`, `examples/` or the root `.html` pages leaks in.
Package 287.8 kB, unpacked 830.6 kB.

---

# Parts 1-4: what was built

## Part 1: defaults (`cdc118b`)

Flipped exactly as the spec listed. ON: `restirDirectionalBypass`,
`restirReprojectionRescue`, `restirCandidateImportance`, `restirClampRel: 2`,
`motionVectors`. OFF: `gi`. Also `stochasticLights` → false. Everything the spec
said should already be right, was.

Each flip carries its JSDoc rewrite, its `index.d.ts` entry, its README row and
its CHANGELOG line, each stating the measurement that justifies it.

**`PRESETS.balanced` had to follow `stochasticLights` to `false`.** That preset is
defined as "the constructor defaults, written out", and `?selftest=presets`
asserts `balancedNoop` — applying it to a fresh instance must change nothing.
Leaving it at `true` would have failed that gate, correctly. The preset mirrors
the default; it does not choose.

**`recommendedOptions("high")` keeps passing `stochasticLights: false`** even
though it is now the default, because an explicitly-passed option is PINNED
against the governor (the 0.14.1 contract). The tier is saying "do not trade my
light rays away", not restating a default. Comment updated to say so.

### The surprise in Part 1: six options that do not exist

`index.d.ts` as shipped in the patch declares `restirSpatialTaps`,
`restirSpatialRadius`, `restirSpatialLowM`, `restirSpatialTapsLow`,
`restirSpatialRadiusLow` and `restirSpatialIterations`, with full JSDoc and
stated defaults. **No implementation has any of them** — `grep -c restirSpatial
src/*.js` → 0. They arrived with the patch's `d.ts` from a Hangar increment
whose code did not, so a TypeScript consumer could pass
`restirSpatialTapsLow: 24`, get no error, and get no effect either.

Removed, and the four options the patch DOES implement but never declared
(`restirSamples`, `restirSampleRadius`, `restirDynamicAccept`,
`restirDynamicFreeze`) are declared instead. This is a deviation from "apply the
patch verbatim" made in the commit AFTER the verbatim one, which is where the
spec puts reviewable changes; the negative control in check 6 proves it took.

### New static: `RealtimeRaytracer.DEFAULTS`

The spec offered a choice between building the default object from a fresh
`new RealtimeRaytracer` or adding a static. The static, because constructing a
second raytracer on a live renderer to read a boolean allocates render targets
and probes MRT support as a side effect.

38 keys, frozen, covering every live-assignable option and nothing that needs a
`compileScene()`, no scene description and no constructor-only wiring — a reset
button should not recompile your scene or repaint your sky. **The drift risk is
gated, not promised**: `?selftest=presets` gained `staticDefaultsMatch`, which
compares every key against a fresh instance and names the drifting keys when it
fails.

## Part 2: ambient light support (`31c69d3`)

`SceneCompiler.syncLights` sums the visible `AmbientLight`s into one colour and
the visible `HemisphereLight`s into (sky, ground, up), in the SAME traversal as
the analytic lights and **outside the slot machinery**, because they take no
slot — a scene with all 32 rows full still has an ambient term. Several
hemisphere lights combine as an intensity-weighted mean axis (three points one
along its own world position and has no target; a light left at the origin votes
for +Y).

`RTLightingPass` adds `uAmbientFlat + mix(uHemiGround, uHemiSky, 0.5·dot(N,
uHemiUp) + 0.5)` to the **direct** term, which is the buffer the composite
multiplies by albedo, so it lands as `albedo × ambient` exactly as three's own
lights do on a Lambert surface.

Deviation to flag: **the spec said "byte-identical stock (use the RT_ marker
style)", and I made it uniform-gated rather than source-spliced.** The RT_
markers are there, and `ambient: false` uploads zeros which the shader adds
unconditionally, so the RESULT is bit-for-bit identical (check 3b, and
`ambOffLum: 0.00` in the ambient gate) — but the SOURCE carries four extra
uniform declarations and one statement, 1742 bytes. Splicing would have made
`ambient` a fifth dimension of the cached absorption/KM variant ladder (which is
deliberately a ladder and not a matrix) and a full megakernel recompile on every
toggle. The spec's own check 3 anticipates this outcome and asks for exactly the
line count and the frozen render, both of which are above.

GI bounces do NOT pick ambient up: `traceRadiance` shades its hit with direct
light only, which keeps the three-call-site budget untouched. Documented rather
than hidden.

## Part 3: demo knobs and Reset (`19f6088`)

Six reservoir knobs as sub-rows of the "ReSTIR lights" toggle they modify (sun
bypass, reprojection rescue, candidate importance, relative cap 0–4, warm age
0–64, multi-sample 1–4), each with a tooltip carrying the finding behind it.

Two placements deviate from "group them under the existing ReSTIR section", and
deliberately: **ambient** went to Lighting & Atmosphere, because it is a light
source the compiler used to ignore, not a reservoir knob; **motion vectors**
went to Quality & Performance with the other temporal dials, because the fifth
G-buffer attachment feeds the irradiance EMA and the reservoir and is not
ReSTIR-specific. On a GPU with fewer than 5 draw buffers that row disables
itself and says why.

**Reset to defaults** sits in its own bar above the pinned footer, outside every
collapsible group. Twelve panel rows that kept no handle now do, because a reset
that writes a property it cannot re-display leaves a control lying about the
renderer.

Verified rather than asserted, headed on `museum.html`: eight settings changed
by hand through the controls, `sessionStorage` poisoned, Reset pressed —

```
allDefaults  true   (17 properties checked, none wrong)
uiAllAgree   true   (all eight controls match the renderer)
tourCleared  true
```

Gallery strip, same protocol with five checkboxes plus lighting res: `ok: true`,
`uiAgrees: true`, res select back to 50%.

### The demo's boot config

Rewritten. The "tested MINIMAL" block pinned `renderScale 0.375`,
`denoiseIterations 5`, `stochasticLights: true`, `adaptiveQuality: false`,
`gi: true` and `emissiveNEE/reflections/refraction: false`. Every one of those
was a reaction to defaults that were heavy in the wrong places — which is what
this release fixed. And an explicitly-passed option is pinned against the
governor, so that block ALSO forbade the governor from using its own levers.

A desktop tier now boots on the library defaults with the governor on; the mid
tier keeps `renderScale 0.375` / 3 denoise passes, which is what
`recommendedOptions("mid")` picks anyway. Still passed: `targetFps`, the canvas
hook, `envColor`/`sky`/`fog`, and `absorptionShadows: false` (a scene-reveal
choice, not a cost one — it compiles byte-identically either way).

**Two consequences the owner should see before merging**, both of them look
changes rather than faults, and both the owner's call:

1. **The museum now opens without GI** and with emissive area lights,
   reflections and refraction ON, which is a different first frame from
   0.14.1's. That is the "most things off" rule applied to the expensive path
   rather than to the correct one.
2. **The gallery's Cornell box now opens without GI too**, and its caption in
   `SCENE_LIST` promises "colour bleed". It is still lit (the ceiling lamp is an
   emissive NEE area light, and it renders at `lightCount: 0` because it has no
   analytic light at all), but the red and green bleed onto the boxes — the
   thing that scene exists to show — is one click away in the options strip
   rather than on screen at boot. I did NOT special-case it: a scene overriding
   the library's defaults for itself is a design change beyond the spec, and the
   honest reading of "GI is opt-in" is that the GI demo asks for GI. If the
   owner would rather that one scene shipped with `gi: true`, it is a one-line
   addition to `SCENES.cornell`'s returned object once `gallery.js` reads it.

## Part 4: the waterfall scene (`169433f`)

A 6 × 10 × 3 open-fronted shaft, dull grey walls, **no floor**, five staggered
peg rows, three angled deflectors, forty pooled Rapier bodies falling forever;
six bodies emissive, four carrying point lights, one static lamp, one dim fill,
and a `HemisphereLight` for the new ambient. Registered right after `cornell` in
`SCENES`, `SCENE_LIST` and `gallery.html`'s `<select>`.

`examples/gallery.js` learned to drive a moving scene at all: a scene may return
`dynamicMeshes` and an `update()`, and the loop then steps it, calls
`updateDynamic()` and re-reads the light table every frame.

`examples/physics.js` gained three things, all backwards compatible and all
no-ops for the museum: `killY` + a `respawn` hook (the museum's escapee handler
becomes this scene's main loop), `spawnPool` size/segments options, and
`addFixed` for fixed colliders of arbitrary shape and orientation.

### Gate (`node dev/waterfall-capture.mjs`), 1280×720, renderScale 0.5 pinned

| | |
|---|---|
| runs | **8.9** and **14.2** fps in two runs, GPU at 100% from other sessions throughout both |
| scene | 3,376 tris, **6 lights**, **84 emissive tris**, `status.ok` true, no warnings, no `coreFailure` |
| still moving after 60s | **36 of 40** bodies above 0.2 m/s, median speed 3.57, 4 asleep, spread y −0.54 to 9.51 |
| 30-frame capture | **1071 of 1200** body-samples moved between frames (89%); 2 recycles through the kill plane in those 30 frames |
| no BVH blowup | dynamic world span **5.70 × 12.27 × 2.65** against a 6 × 10 × 3 shaft, stable across all 30 frames (the 12.27 is hopper-to-kill-plane, by construction); **ONE** compile in the console, no rebuild storm |
| emissive is real light | wall-and-peg region mean luma **69.31** with `emissiveNEE` on vs **59.72** off, delta **9.59** of 255 against run-to-run floors of **0.12** and **0.05** — 55× to 190× its floor |

Frames: `dev/shots/waterfall-1.png`, `-2.png`, `-3.png`.

The light budget was designed around two numbers rather than taste. The NEE area
list caps at **256 triangles for the whole scene**, so every emitter is a BOX:
seven × 12 = 84, where one 14×10 emissive sphere would have been 240. And the
light table is 32 rows, of which this uses 6.

---

# Surprises worth keeping

1. **`index.d.ts` promised six options that no code implements.** Passing one did
   nothing at all, silently. Types drift the same way docs do, and nothing in
   this repo was checking them against the constructor. `DEFAULTS` +
   `staticDefaultsMatch` now closes that specific hole for the values; the
   phantom-option class is closed by the tsc negative control.

2. **`npm run test:km`'s identity gate compares against a MOVING ref.** It reads
   as "the KM feature adds nothing when unused" and behaves as "the lighting
   shader must never change again". It fails on every feature branch that touches
   the megakernel and goes green after the merge. Not fixed here.

3. **`PRESETS.balanced` is load-bearing.** It looks like a convenience alias and
   is actually asserted to be a no-op, so a default flip that forgets it fails a
   gate three files away. That is a good design and it caught me.

4. **The museum has no directional, ambient or hemisphere light at all.** Two of
   the three cost drivers the spec asked me to attribute simply do not exist in
   the benchmark scene. Worth knowing before reading any future "the sun bypass
   is free" claim measured there.

5. **22° is exactly the critical angle for the default friction.** The
   waterfall's first cut put its deflectors at 24° and 22° against friction 0.4
   and the middle slab became a shelf; the scene was a heap within ten seconds
   while still rendering forty bodies perfectly. A gate that only counted bodies
   would have passed it. The gate now measures SPEED and recycles.

6. **`gl.readPixels` on a canvas without `preserveDrawingBuffer` returns zeros
   outside the render task.** The waterfall's emissive A/B reported 0.00 for both
   arms on its first run — which is the readback failing, not the light. It now
   compares screenshots. Any in-page readback in this project needs to be checked
   against a known-nonzero arm before it is believed.

7. **The self-test cannot see a defaults change**, because it pins the full
   lighting stack on purpose. That is right for what it guards (the black-screen
   class) and worth remembering before anyone reads its `meanLum` as a summary of
   a release.

8. **The GPU on this machine made the first two runs of the cost benchmark
   worthless in opposite directions.** Contention did not add noise around a true
   value; it produced a floor twice the size of the effect, and then a set of
   ratios spanning 0.59 to 2.19. Interleaved pairs plus a printed floor are the
   only reason there is a number in check 5 at all.

9. **A fast emissive mover leaves a short trail** in the waterfall — the
   irradiance EMA following a light that has moved. 0.14.0's light-motion
   response covers ANALYTIC lights; an emissive MESH moving at 3.5 m/s is not yet
   in that signal. Not chased; it is the next obvious thing in that area.

---

# Harnesses added

| file | what it does |
|---|---|
| `dev/drive.mjs` | drives one page in headed chromium with the known-good flags, so a single check can run without the 20-minute matrix |
| `dev/legacy-identity.mjs` | builds every pass's shader from both trees and hashes them |
| `dev/legacy-render.{html,js}` | the frozen-render gate: museum, static, pinned pose, FNV over the drawing buffer |
| `dev/waterfall-capture.mjs` | the waterfall's four-question gate + the three committed frames |
| `dev/_tscheck/` | the `tsc --strict` consumer call site and its three shim |
| `bench.html?defaults=1` | the three-arm, five-pair defaults A/B |
| `?selftest=ambient` | the new render-selftest leg |

# Not done

- **`specular`'s fixed cost was not measured.** The spec made it optional ("if
  you can show with bench.html that `specular` has a fixed cost above ~5% at
  720p on the museum with no glossy pixels") and explicitly said it is a
  defaults decision for the owner rather than this pass. It stays on.
- **Nothing was pushed, tagged or published**, and `master` was not touched. An
  attempted `git checkout master` in this worktree was refused by git's worktree
  protection, which is the correct outcome and is recorded here because it means
  the 0.14.1 pack list in check 7 was derived from `git ls-tree` rather than from
  a checkout.
