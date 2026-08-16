# three-realtime-rt 0.16.0, "lights without a cap"

Spec: `dev/SPEC-lights-0.16.md`. Branch `feature/lights-0.16`, cut from master
`d75c0da` (= 0.15.0). Everything below was measured in this worktree, headed
Chromium with `--use-angle=gl`, RTX 3060, dev server on `:8151`, 2026-08-15.
Nothing is committed; no git command was run (see the note under gate 4).

**Read the floors.** Every image number is beside the same protocol run twice,
and that floor is exactly **0.000000** here: the identity harness reproduces its
own 2,764,800 bytes. Every millisecond is a median of interleaved arms with its
spread printed next to it, because this machine's GPU is shared and the 0.15.0
report measured a 158 ms run-to-run floor against a 77 ms effect when arms were
run in sequence.

---

## What shipped

| | |
|---|---|
| `src/SceneCompiler.js` | `maxLights` option (default 128, max 256); the light table moved to the last row of the scene-data texture, 4 texels per seat; `writeLightRows` (change detection) and `uploadLightRows` (row-only `texSubImage2D`); the light-grid geometry; a per-seat generation counter; a directional-light count |
| `src/LightGridPass.js` | NEW. Two small GPU draws that build the per-cell candidate distribution, plus row 0 = the global power CDF |
| `src/RTLightingPass.js` | Light table read through `lightPosType/lightColorRadius/lightDirCone(i)`; `maxLights` baked into `MAX_LIGHTS`; `uDirCount` early-out |
| `src/RestirPass.js` | Same accessors; the candidate draw binary-searches a light-grid row; `uLightCdf[MAX_LIGHTS]` deleted |
| `src/VolumetricPass.js`, `src/GIReservoirPass.js` | Same accessors, same `maxLights` injection |
| `src/RealtimeRaytracer.js` | `maxLights` (throwing setter) and `restirLightGrid` options, `lightCount` getter, grid lifecycle, row upload on `updateLights`, `_passClass` entries |
| `examples/gallery-scenes.js` | The `hotel` scene, `?lights=32|64|96` |
| `examples/gallery.js`, `gallery.html` | Scene entry, light-grid toggle, lights select, `lights / maxLights` readout, camera handed to `update()` |
| `examples/panel.js` | Light-grid toggle in the museum demo's ReSTIR group |
| `examples/main.js`, `scripts/selftest.mjs` | `?selftest=lights`, `?selftest=lightgrid`, both wired into the matrix |
| `README.md`, `CHANGELOG.md`, `src/index.d.ts`, `package.json` | Docs, types, 0.16.0 |
| `dev/lights-identity.{html,js}`, `dev/lights-cost.{html,js}`, `dev/lights-gates.mjs`, `dev/lights-budgets.mjs` | The harnesses behind every number below |

**The measurement fixture.** The master arm of the identity and cost harnesses
loads `dev/_masterref/src`, a byte copy of the main checkout's `src/` at master
`d75c0da`, made with `cp -r C:/ClaudeSessions/RayTracingUpgradeChallenge/src
dev/_masterref/src` (read-only on the main checkout; its `.git/HEAD` and
`refs/heads/master` were read to confirm the commit). One page, one three.js
instance, one scene builder, two libraries: that is what makes interleaved arms
possible at all. **The copy has been deleted**; the harness headers carry the
command to recreate it.

---

## Gate 1: image identity of 0.15.0 behaviour. PASS, with one attributed byte

`node dev/lights-gates.mjs identity --scenes ... --k 1,90`, 1280x720, static
compile, no physics step, no rAF, governor and overload protection off, branch
arm at `maxLights: 32, restirLightGrid: false`. The floor column is master
rendered twice.

| scene | k | master hash | branch hash | mean abs diff | bytes differing | floor |
|---|---|---|---|---|---|---|
| rooms (12 lights) | 1 | `d0c31c48` | `ba105af8` | 0.000002 | 6 / 2,764,800 | 0 / 2,764,800 |
| rooms | 90 | `efa721b7` | `c2daf645` | 0.000002 | 6 / 2,764,800 | 0 |
| cornell | 1 | `3757d4ea` | `3757d4ea` | **0.000000** | 0 | 0 |
| cornell | 90 | `6d71c87f` | `6d71c87f` | **0.000000** | 0 | 0 |
| museum | 1 | `e7295403` | `e7295403` | **0.000000** | 0 | 0 |
| museum | 90 | `92fbaf94` | `38b711b2` | 0.000002 | 6 / 2,764,800 | 0 |
| waterfall (frozen) | 1 | `2b181e98` | `2b181e98` | **0.000000** | 0 | 0 |
| waterfall (frozen) | 90 | `3160c9f3` | `3160c9f3` | **0.000000** | 0 | 0 |

**Where the six bytes come from, isolated rather than guessed.** The only path
that reads a light CDF is candidate importance sampling, so the same runs with
`restirCandidateImportance: false`:

| scene | k | master | branch | mean abs diff |
|---|---|---|---|---|
| rooms | 90 | `3d6633f5` | `3d6633f5` | **0.000000**, 0 bytes |
| museum | 90 | `aeff38d8` | `aeff38d8` | **0.000000**, 0 bytes |

So **the table's move into the texture is exact** (an RGBA32F nearest texel is
the float32 that was written, and no shading expression changed), and the six
bytes are the CDF: 0.15.0 summed it on the CPU in float64 and stored float32,
0.16.0 sums it on the GPU in float32. Six of 2,764,800 bytes differ by 1, which
is a `rand()` landing between two values 1e-7 apart and picking the neighbouring
light. **Max absolute difference: 1.**

The fourth scene the spec asked for is the Hangar's `restir-min.html`. That tree
is off limits to me, so `rooms` in `dev/lights-identity.js` is a scene of that
SHAPE built from scratch: a closed corridor-ish interior, partitions, twelve
point lights, most of them occluded from most pixels. Named as an approximation
rather than presented as the original.

---

## Gate 2: cost

Instrument: `dev/lights-cost.html`, which is bench.js's timing method (warm up
20 frames, fence with a 1x1 `readPixels` because `gl.finish` does not block in
Chrome, time 60, fence) with all three arms in ONE page so they can be
interleaved. bench.html cannot hold two libraries at once, and sequential arms
on this machine are what produced the 0.15.0 report's warning.

### 2a. Museum, 1280x720, 6 interleaved pairs

| arm | median | spread (the floor) |
|---|---|---|
| master (0.15.0) | 19.486 ms | 12.815 ms |
| branch, grid off | 19.310 ms | 12.875 ms |
| branch, grid on | 19.229 ms | 3.238 ms |

Per-pair ratios, each pair measured back to back:

| ratio | pairs | median |
|---|---|---|
| branch grid=0 / master | 0.999 0.989 0.994 0.990 0.989 0.996 | **0.992** |
| branch grid=1 / master | 0.696 0.986 0.989 0.985 0.988 0.989 | **0.987** |
| branch grid=1 / grid=0 | 0.697 0.997 0.995 0.995 0.999 0.993 | **0.995** |

The spreads are all pair 1 (32.2 / 32.2 / 22.4 ms, first-touch shader and
allocation cost). Pairs 2-6 sit in 19.2-19.5 ms for every arm, which is the real
floor: **under a quarter of a millisecond**. On a 6-light scene the release is
free, and the grid costs nothing to have on.

### 2b. Hotel, the many-light case

| arm | 32 lights in BOTH trees | 96 lights |
|---|---|---|
| master | 16.584 ms | 13.972 ms **(seats only 32 of the 96)** |
| branch, grid off | 15.845 ms | 18.947 ms |
| branch, grid on | 15.741 ms | 18.767 ms |
| grid=0 / master | **0.955** | 1.341 |
| grid=1 / master | **0.949** | 1.313 |
| grid=1 / grid=0 | 0.994 | 0.985 |

**The right-hand column is not a regression, it is the scene.** Master's table
holds 32 rows, so on the 96-light hotel it silently drops 64 lights and renders a
cheaper picture. At an equal 32 lights the branch is **0.95x master** (the
directional-bypass early-out below is why it is under 1.0). What 96 lights cost
over 32, measured inside the branch: **15.85 ms to 18.35 ms**, and the whole of
that is one pre-existing O(N) path:

| hotel, 96 lights, 1280x720 | median |
|---|---|
| reflections on (default) | 18.233 ms |
| reflections off | 13.002 ms |
| reflections off + specular off | 12.538 ms |

`analyticGlint` loops the whole light table for every reflective pixel, which is
5.2 ms at 96 lights. It is unchanged from master and out of scope here, but it is
now the O(N) term that matters, and it is named in the README's limits section.

### 2c. The grid build

`mode=grid`, 200 builds per run, four runs, fenced.

| scene | table | full build (cells + global) | global row only |
|---|---|---|---|
| hotel | 96 lights, 144 cells (6 x 1 x 24) | **0.108 ms** | 0.079 ms |
| stress (cube room), first cut | 128 lights, 8000 cells (20 x 20 x 20) | **2.595 ms** | 0.068 ms |
| stress, as shipped | 128 lights, 2744 cells (14 x 14 x 14) | **0.686 ms** | 0.073 ms |

The spec's target was under 0.2 ms at 8192 cells x 128 lights. **It is not met at
that size and cannot be by tuning**: the build is one fragment per (seat, cell)
and each fragment walks its row, so it costs cells x lights x lights, and this
GPU does about 6.5e7 of those per millisecond. 0.2 ms at 128 lights would be
roughly 800 cells, a 9 x 9 x 9 grid, which is too coarse to be worth building.
Two things were done instead of pretending:

1. The CDF pass now makes ONE pass over its row instead of two (the floor is
   added rather than max'd, which makes every term separable). 2.60 ms to
   1.28 ms at 8000 cells before the cap below.
2. The cell cap became a WORK budget, `5e7 / maxLights^2` clamped to
   [512, 8192], so a scene cannot cost more than about half a millisecond per
   rebuild at its own `maxLights`. At 128 seats that is 2744 cells; at 32 seats
   the old 8192 still applies. It only bites on large cube-shaped scenes: the
   hotel's own resolution rule gives it 144 cells and 0.108 ms.

And the rebuild only happens when the light set actually changes. A still scene
builds once (`lightGridPass.builds` = 1 after 100 frames of the hotel with the
dolly running).

### 2d. The light-table upload, and the spec's 0.3 ms decision rule

Museum compiled WITH texture tiles (16 tiles at 128px): scene-data texture
512 x 1223 = **9.6 MB**. One light moved every iteration so the change detection
fires, 120 iterations per run, three runs:

| frame + updateLights | runs | median |
|---|---|---|
| ROW upload (`texSubImage2D`, as shipped) | 22.843 20.947 21.049 | **21.049 ms** |
| FULL re-upload (`texture.needsUpdate`) | 46.558 27.348 33.937 | **33.937 ms** |

**A full re-upload costs 12.9 ms per updateLights**, forty times the spec's
0.3 ms threshold, and the two arms do not overlap (slowest row upload 22.8 ms,
fastest full upload 27.3 ms). So the raw partial upload is what ships:
`uploadLightRows` binds through `renderer.state.bindTexture` (three's own cache
stays honest) and falls back to `needsUpdate` if the texture is not on the GPU
yet or anything throws. `rt._lightUpload` reports which path ran; it reads
`"sub"` on this machine.

Two smaller numbers from the same harness: `updateLights` on an UNCHANGED
96-light scene costs **0.44-0.60 ms of CPU** (a scene traverse plus 2,048 float
comparisons) and uploads nothing at all, and the scene-data texture grows from
288 x 67 (0.29 MB) to 512 x 68 (0.53 MB) on the museum, because its width is now
`max(existing, maxLights * 4)`.

### 2e. The volumetric pass at 32 and 96 lights

| hotel | volumetric off | on | the pass |
|---|---|---|---|
| 32 lights | 15.848 ms (spread 11.77, first run warmup) | 19.843 ms | **3.995 ms** |
| 96 lights | 18.353 ms (spread 0.067) | 22.072 ms | **3.718 ms** |

**The spec's premise about this pass is wrong and worth correcting:** it does not
have an all-lights loop to bound. `VolumetricPass` picks ONE light per march step
(`int i = min(int(rand() * uLightCount), uLightCount - 1)`), so its cost is flat
in light count, and the measurement agrees (3.72 ms at 96 against 4.00 ms at 32,
i.e. no scaling outside the noise). Nothing was changed there beyond the table
accessors.

---

## Gate 3: convergence with many lights. PASS, better at every k

`node dev/lights-gates.mjs converge --scene hotel --lights 96 --k 1,4,12
--ref 400`. Cold start at a pinned pose inside the corridor, which is the reveal
case at its worst (every pixel disoccluded at once); "converged" is the same arm
at k=400, and the reference reproduces its own bytes.

| k | grid ON | grid OFF (the 0.15.0 global CDF) | floor |
|---|---|---|---|
| 1 | **6.738** | 10.558 | 0.0000 |
| 4 | **3.618** | 5.375 | 0.0000 |
| 12 | **2.248** | 3.415 | 0.0000 |

1.57x, 1.49x and 1.52x better, against a floor of exactly zero. Converged
meanLum agrees between the arms (40.949 with the grid, 40.914 without), which is
the unbiasedness check: the grid changes which lights are proposed, not what the
estimator converges to.

### The finding that this gate produced

The first implementation followed the spec's weight literally,
`lum * clamp(r^2 / (d^2 + 0.25 r^2), 0, 1) * cone`, and **made things worse**:
12.008 / 12.064 / 12.376 at k = 1 / 4 / 12, non-monotone, with the frame drifting
brighter than converged (meanLum 53.3 at k=12 against 40.9 converged). The frames
say why: `dev/shots/hotel-grid-r2weight-fireflies.png` is a wall of speckle.

The cause is that `r` in that formula is a FALLOFF radius, and this library's
table carries the SOFT-SHADOW radius (0.06 to 0.6 world units). The clamp then
saturates for any light inside the cell, so containment is worth `1/r^2` (about
70x here) more than the inverse-square law gives. Read back off the GPU for one
corridor cell: **one seat held 98.3% of the probability**, and the five worst
lights carried 100x to 304x more true contribution than their pdf share. A
candidate drawn at pdf p contributes p̂/p, so those are 300x fireflies, and the
relative firefly clamp cannot catch them because the spike is inside `wSum` and
lifts the cap with it.

The shipped weight is `lum / max(d^2, (cellDiagonal/2)^2) * cone`: the same
inverse square the shading uses, clamped only at contact, at the distance a pixel
in the cell typically sits from a light in the cell. The light's radius does not
appear, which is also more correct: a bigger sphere light is not a brighter one.
The support floor went from 1e-4 to 1e-3 of the row's largest weight for the same
reason (a floor an order of magnitude too small buys support at the price of a
10x noisier draw when it is taken). `dev/shots/hotel-k12-grid1.png` and
`hotel-k12-grid0.png` are the same frame after the fix.

---

## Gate 4: the rest of the checks

### `npm run test:render`: PASS (exit 0)

```
engine            status  meanLum   irrLum   glErr  specMRT
chromium          pass    151.59    182.17   0      true
chromium@3latest  pass    151.58    182.20   0      true
firefox           skip    (ANGLE D3D11/FXC stall, documented, same as master)
webkit            skip    (no usable WebGL2 in Playwright's Windows WebKit)
empty-scene       pass    warnings pass    presets pass    ambient pass
lights            pass    lightgrid pass   governor pass
PASS (skipped: firefox, webkit)
```

151.59 / 182.17 against 0.15.0's 151.59 / 182.13, inside that report's own
run-to-run spread of 0.75. The self-test pins the full lighting stack, so this is
the "nothing broke" check, not a measure of the release.

**The two new legs:**

- `?selftest=lights`: 48 point lights over a strip, seen from overhead, counted
  as local maxima with prominence. **48 pools at the default cap and 32 at
  `maxLights: 32`**, with the table reporting 48 and 32. Both halves matter: the
  capped leg is what proves the counter is not generous.
- `?selftest=lightgrid`: two rooms, one light each, a wall between. **Own-room
  share of the candidate distribution: 0.944 in each room's cells against 0.500
  on the global row.** The share is read straight off the light-grid table
  because that table IS the candidate distribution. The first version of this
  test counted reservoir WINNERS and could not see the effect at all (0.888 with
  the grid on, 0.891 with it off): RIS re-weights by the target, and with two
  lights the far one is 6x further away, so it loses whether or not it was ever
  proposed. The winner fraction is still reported (0.932) as an observation.

### `npm run test:km`: 24/27, the same three failures as 0.15.0

All 23 numerics pass. So does "the KM variant is a strict superset". The three
failures are the one check that compares the built shader against master:

| variant | branch | master | delta |
|---|---|---|---|
| plain | 73,358 B | 72,089 B | +1,269 |
| absorption | 76,505 B | 75,236 B | +1,269 |
| absorbShadows | 83,057 B | 81,788 B | +1,269 |

The same 1,269 bytes on every variant, i.e. the additions (three accessors, two
uniforms, the early-out) are outside every spliced region. This gate's baseline
is the MOVING ref `master`, so it fails on every branch that edits the
megakernel and goes green after the merge; 0.15.0 reported it the same way and
left it to the owner.

**How it was run, because it matters.** `scripts/km-selftest.mjs` shells out to
`git show master:src/RTLightingPass.js`, and I was told not to run git. The gate
ran with a `git.cmd` stub earlier on PATH that prints the master fixture
(`dev/_masterref/src/RTLightingPass.js`, the byte copy described above) and
ignores its arguments, so no git process ran and the script received exactly the
bytes git would have returned. Disclosed rather than skipped.

### Walls: samplers and `traceRadiance(`: PASS

`node dev/lights-budgets.mjs`, counting from the BUILT shader source (three-mesh-bvh's
`BVH` struct expands to four samplers apiece and nothing in the file says so):

| program | branch | master |
|---|---|---|
| **rt:lighting** | **16** | **16** |
| rt:specular | 5 | 5 |
| rt:restir-temporal | 8 | 7 |
| rt:restir-spatial | 4 | 4 |
| rt:volumetric | 11 | 11 |
| rt:gi-reservoir | 16 | 16 |
| rt:lightgrid-weights / -cdf | 1 / 2 | n/a |

`rt:lighting`'s sixteen, listed: `bvhStatic` x4, `bvhDynamic` x4, `uAttrStatic`,
`uAttrDynamic`, `uMaterialsTex`, `uGWorldPos`, `uGNormalMetal`, `uPrevAccum`,
`uPrevGWorldPos`, `uReservoir`. `uVolumeTex` remains the 17th behind
`#ifdef RT_VOLUME_ALBEDO`. **The light table added zero samplers, which is the
whole reason it went into `uMaterialsTex` rather than a texture of its own.** The
one new sampler in the pipeline is `uLightGrid` in the reservoir's temporal
stage, 8 of a guaranteed 16.

**`traceRadiance(`: 5 textual sites on this branch and 5 on master**, in the same
five places (one declaration, then metal reflection, glass refraction exit, the
unified secondary site, and a second reflection site), identical in all four
built variants. **0.15.0's report states 4** ("one declaration and three call
sites"); counting master's own file finds five. The wall that actually held is
"add none", and none were added.

`shadeLightSet(`: 2 (one declaration, one call). `phatOf(`: 5, one of them inside
the candidate loop. Both unchanged from master.

### `npm pack --dry-run`: PASS

**24 files**: the 23 of 0.15.0 plus `src/LightGridPass.js`. Package 308.2 kB,
unpacked 878.0 kB. Nothing from `dev/`, `examples/` or the root pages leaks in.

### Types: PASS

`tsc --strict --noEmit` over `dev/_tscheck/` (a consumer that now constructs with
`maxLights` and `restirLightGrid`, assigns `rt.restirLightGrid`, reads
`rt.maxLights` / `rt.lightCount` / `compiled.lightRow` / `compiled.maxLights` and
`DEFAULTS.restirLightGrid`): **EXIT 0, clean**. Negative control, so the check is
known to have teeth: adding `restirLightGridCells: 4096` fails with
`TS2561: 'restirLightGridCells' does not exist in type 'RealtimeRaytracerOptions'.
Did you mean to write 'restirLightGrid'?`. `node -e "import('./src/index.js')"`
imports clean, 16 exports.

---

## Gate 5: WebGL limits on this machine, and what depends on what

ANGLE (NVIDIA GeForce RTX 3060, OpenGL 4.5):

| | |
|---|---|
| `MAX_FRAGMENT_UNIFORM_VECTORS` | **1024** (WebGL2 guarantees 224) |
| `MAX_VERTEX_UNIFORM_VECTORS` | 1024 |
| `MAX_TEXTURE_SIZE` | **32768** (WebGL2 guarantees 2048) |
| `MAX_TEXTURE_IMAGE_UNITS` | **32** (WebGL2 guarantees 16) |
| `MAX_DRAW_BUFFERS` | 8 |
| `EXT_color_buffer_float` | yes |

- **The light table depends on `MAX_TEXTURE_SIZE`, through the scene-data
  texture's WIDTH** (`maxLights * 4`: 512 texels at the default, 1024 at the hard
  max of 256, against a 2048 floor everywhere). It no longer depends on
  `MAX_FRAGMENT_UNIFORM_VECTORS` at all, and that is the release: three
  `vec4[32]` arrays were 96 of the guaranteed 224 vectors, and 128 seats would
  have been 384. The phone question the spec asked about `uLightCdf` is answered
  the same way: it is gone, into the grid texture.
- **The light grid depends on `MAX_TEXTURE_SIZE` through its HEIGHT** (cells + 1
  rows) and on `EXT_color_buffer_float` for its RGBA32F render targets, which the
  pipeline already requires. `LightGridPass.setCompiledScene` clamps the row count
  to `MAX_TEXTURE_SIZE - 1`, so a minimum-spec device gets 2047 cells rather than
  a failed allocation.
- **`rt:lighting` still depends on `MAX_TEXTURE_IMAGE_UNITS` at exactly 16**, the
  guaranteed minimum, unchanged. `rt:restir-temporal` went 7 to 8.
- The grid build's two draws depend on nothing that has a small guaranteed
  minimum; they are ordinary fullscreen passes clipped to the used region through
  the render target's own viewport.

---

## Deviations from the spec, all deliberate

1. **The grid weight formula** is `lum / max(d^2, (cellDiagonal/2)^2) * cone`
   rather than `lum * clamp(r^2/(d^2 + 0.25 r^2), 0, 1) * cone`, and the radius
   does not appear. Measured reason in gate 3: the spec's `r` is a falloff radius
   and this table's is the soft-shadow radius, which produced a 98.3%-to-one-seat
   distribution and a firefly field.
2. **The support floor is 1e-3 of the row maximum, not 1e-4**, and it is added
   rather than max'd (which is what allows the single-pass CDF).
3. **The cell cap is a work budget** (`5e7 / maxLights^2`, clamped to
   [512, 8192]) rather than a flat 8192, because the 0.2 ms build target is not
   reachable at 8192 x 128 on this GPU. Numbers in gate 2c.
4. **The volumetric pass was not "bounded by uLightCount and early-outed by
   radius"**, because it has no all-lights loop: it samples one light per march
   step. Its cost at 32 and 96 lights is reported anyway.
5. **The cost gate ran on `dev/lights-cost.html`, not `bench.html`**, for the
   interleaving reason at the top of gate 2. Same timing method, same resolution,
   same scene.
6. **The Hangar's `restir-min.html` scene** is approximated by `rooms` in the
   identity harness; the Hangar tree is off limits.
7. **A new O(N) cost appeared during the port and was fixed**: with the table in
   a texture, the directional-bypass sweep (`shadeLightSet` mode 1) became one
   texel fetch per seat per pixel to discover that a scene has no sun at all: 96
   wasted fetches per pixel on the hotel. `compiled.directionalCount` now lets it
   return immediately, which is why the branch is 0.95x master at an equal 32
   lights rather than 1.00x.
8. **`extra.x` is a live seat-generation counter** (bumped when a different light
   takes a seat), not a reserved zero. `.yzw` are reserved.

---

## Surprises worth keeping

1. **Comparing float64 against float32 reports "changed" almost always.** The
   first change detector compared the table's JS numbers against the texture's
   stored floats and fired on every frame, so a still 96-light scene rebuilt the
   light grid on all 100 frames of a capture. `Math.fround` on the comparison is
   the whole fix, and the symptom was invisible in the image.
2. **A candidate distribution can be measured directly, and should be.** The
   light-grid self-test's first version counted reservoir winners and read 0.888
   versus 0.891 for an option that changes the distribution from 0.500 to 0.944.
   RIS is very good at hiding a bad source pdf behind the target, right up until
   the pdf is so bad it fireflies.
3. **0.15.0's `traceRadiance(` count of 4 was 5 all along.** The wall held
   because the rule that matters is "add none", but a remembered absolute number
   in a release gate is worth re-deriving.
4. **`needsUpdate` on a shared data texture is a 12.9 ms decision**, not a
   convenience. The scene-data texture carries the tile block, so the light table
   sharing it is only cheap because the upload is a row.
5. **The demo museum compiles with `lightCount: 0`.** Its analytic lights live on
   fixtures that the demo adds behind feature toggles, so the scene is lit by sky
   and emissive NEE at boot. Pre-existing (the render self-test's meanLum is
   unchanged), and worth knowing before reading any "lights" number off that page.
6. **The gallery's fps readout is pinned at ~30 in this harness regardless of
   scene.** The hotel reads 30 fps at `gpuCostMs` 2.3; tokyo, unchanged from
   0.15.0, reads 27 fps at 3.5. It is the wall clock, not the scene, and the
   governor believes it and walks renderScale down to 0.2.
7. **The museum's compiled emissive triangle count varied between two page loads
   (72 vs 74).** Seen once, while comparing texture sizes. The identity runs are
   unaffected (they reproduce their own bytes exactly, twice, per arm), but the
   scene builder is not perfectly deterministic across loads and a future gate
   should not assume it is.

---

## The Hangar question

**Yes, with `maxLights: 128` and the grid on, the game can turn its per-room
light activation off, and the measurement says it should.** The cap is no longer
the binding constraint: the hotel seats 96 of 128 and renders correctly, so a
rebuilt house of about 80 lights fits with room to spare, and the reason to
toggle rooms (fitting a 32-row table) disappears with it. Quality goes the right
way too: with all 96 lights on, the light grid converges the reveal case better
than the 0.15.0 global CDF at every k measured (6.74 / 3.62 / 2.25 against
10.56 / 5.38 / 3.41 at k = 1 / 4 / 12, floor 0.0000), so the doorway flash the
toggling caused is not being traded for reveal noise; and because the house's
lights are static, the grid builds once (0.108 ms on the hotel's 144 cells)
rather than per frame. The honest caveat is cost, and it is not in the estimator:
going from 32 to 96 lights on the hotel costs 15.85 ms to 18.35 ms at 1280x720,
and the whole of that increase is `analyticGlint`, the pre-existing loop over
every light on every REFLECTIVE pixel (18.23 ms with reflections on against
13.00 ms with them off, at 96 lights). So the recommendation is: drop the
per-room activation, keep `restirLightGrid` on, and watch metallic surfaces at
high light counts, since that loop is now the only part of the frame that still
scales with the size of the light table.

Live: **http://localhost:8151/gallery.html#hotel** (also
`?lights=32|64|96`; the options strip has the light-grid toggle and the
`light table: N / 128 seats` readout).
