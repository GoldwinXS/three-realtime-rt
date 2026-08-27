# Changelog

## 0.16.15

**The target stack can be deferred and handed back: a raster fallback stops
paying for a tracer it never runs.** Until now a `RealtimeRaytracer` allocated
its whole render-target stack in the constructor, whether or not a traced frame
was ever rendered. A host with a cheap raster mode for weak machines therefore
paid the tracer's full footprint on exactly the machines that mode exists to
rescue. Three new members, all opt-in and inert when unused:

- `deferTargets: true` (constructor option) builds the pipeline with no GPU
  storage at all. The pass objects, programs, status surface and every getter
  read as before; nothing is allocated, nothing is reported to `memLedger`, and
  `setSize` only records the numbers.
- `releaseTargets()` frees the GPU storage of every pass target (the objects,
  materials and caches stay, so three re-creates the textures the next time
  anything binds them) and tells the ledger every `rt.*` key is freed.
  `ensureTargets()` funds the stack again, applies any size that arrived while
  it was released, re-reports the footprint, and resets the temporal histories.
  `render()` calls `ensureTargets()` itself if the host forgot, so a released
  pipeline can never render a broken frame.
- `releaseScene()` drops the compiled scene (the BVH texture arrays, attribute
  and material textures, the light table): tens of megabytes of typed arrays a
  host that has left traced rendering cannot use. The next `compileScene()`
  rebuilds it.

The light-grid table is deliberately not released (a few rows of texels, and
releasing it could leave the grid stale on the way back), and a pipeline that
was never released behaves exactly as it did in 0.16.14.

## 0.16.14

**The adaptive governor climbs back without a GPU timer.** On a machine whose
`EXT_disjoint_timer_query_webgl2` timer is present but silently empty (the
friend's Windows Chrome: `gpuMs` null for nine straight minutes, `gpuTimingActive`
true while `_gpuGaveUp` waits out its stale clock), the ladder's no-measurement
headroom test was `!slowNow && (wall < 0.8 || !gpuTimingActive)`. On a
vsync-capped display whose frame time sits between 0.8x and 1.12x of the budget
("comfortable", never "fast") the `wall < 0.8` term is never true, so
`_ladderFast` never accumulated 180 and a scale dropped to the 0.2 floor during
one bad minute was held there for the whole session. The no-measurement fallback
is now keyed on the honest signal — `util == null` — and simply counts a
comfortable frame as headroom (`fastNow = !slowNow`); the comfortable branch also
drives the ladder climb regardless of `gpuTimingActive`, since the ladder's
up-streak, dwell and reversal lock are the anti-flap protection, not a probe.
Every wave 24 protection is unchanged: no reallocation on a rung move, the
4000 ms dwell, the 20000 ms reversal lock, and the 180-sample up-streak.

## 0.16.13

**The byte ledger stops over-reporting when the render loop stalls.** A retired
render-target generation was presumed freed after `freeAfterFrames` frames
(default 3), and that deferral decayed only in `tick()`, which runs once per
RENDERED frame. A stalled or crawling loop (a public-build boot holding 3.2 s
frames at the title screen) therefore kept the retired bytes on the books for
ever, and the loss forensics reported a resident/peak number that may already
have been free. A generation is now presumed freed after `freeAfterFrames`
frames OR `freeAfterMs` milliseconds, whichever comes first (default 2000 ms,
~6x the frame floor at 10 fps, so a healthy loop still frees on the frame
count and the pessimistic peak is unchanged; a stalled loop simply cannot hold
the bytes open-ended). The wall-clock test is applied on every read
(`retiredBytes`, `residentBytes`, `summary`, `entries`) as well as on `tick()`,
so a stopped loop's summary is honest without a frame ever rendering.
`createMemLedger` also records a per-key allocation count (`allocCount(key)` /
`summary().counts`) so a host can prove a boot allocated each pass target
exactly once.

## 0.16.12

**A denoiser plugin may report its bytes into the app's memory ledger.** Apps
that keep a render-target byte ledger (`rt.memLedger`) could account for every
engine target but not the plugin's own pyramid and history. `setDenoiserPlugin`
now checks the incoming plugin for an optional `reportLedger(ledger)` method:
if the app holds a ledger and the plugin exposes the hook, the engine hands the
ledger over on attach and passes `null` on detach or swap so the plugin
releases its entry. A plugin without the hook, or an app without a ledger, is
unchanged. `neuralrt` 0.2.1 implements the hook (18 targets, reported under
`rt.neuralPlugin`).

## 0.16.11

**A denoiser plugin may state the grid its output is on.** 0.16.10 gave a plugin
the optional `setRect(rectW, rectH, allocW, allocH)` hook, so it can allocate
once at the renderScale cap and write a sub-rect like the renderer does. That
left one thing unsaid: a plugin that does this returns a texture whose OWN
dimensions are the allocation, not this frame's picture, and the composite was
still reading the size off the texture.

So the pair a plugin returns may now carry a grid beside it:

```js
return { irradiance, specular, grid: [validW, validH, allocW, allocH] };
```

Absent or malformed, the texture's dimensions decide exactly as before, so every
plugin written against 0.16.10 and earlier is unaffected. Three things read it:
the composite's tap size and rect remap, the "is this output on the lighting
grid" test (which used to compare texture dimensions and therefore read a
sub-rect plugin as off-grid while it sat exactly on it), and the optional post
filters, which are now ALLOCATED at the plugin's allocation and RECTED to its
live rect (`_ensurePluginPost(allocW, allocH, rectW, rectH)`) instead of being
rebuilt whenever the rect moved.

With `neuralrt` 0.2.0 attached, a renderScale ladder step now costs zero render
target allocations end to end: 64 forced rung steps measured 0 raw GL
render-target allocations with the plugin attached, against 41.0 per step in
0.16.10 (`dev/plugin-rect-check.py`, `dev/governor-check.py` section 6).


## 0.16.10

**The adaptive governor stops reallocating render targets.** A host reported
`webglcontextlost (memory)` on an iPhone 12 Pro after seven minutes of play with
every COUNTED resource flat (533 textures, 1830 geometries, 51 programs stable
for the final half minute, a 23.5 MB live JS ledger) and one thing moving:
renderScale, which this governor stepped roughly once a second for the whole
session (trace samples 0.13, 0.25, 0.2, 0.3, 0.15 ...). Every one of those steps
reallocated the entire lighting-resolution target set: the lighting MRT pair,
the specular pair, two a-trous ping-pongs, the accumulate MRT pair, the ReSTIR
reservoirs and the GI reservoirs. At dpr 3 that is sustained driver-side
reallocation, which is the classic way to fragment GPU memory on iOS until the
context is taken away.

Two changes, and neither of them removes the adaptation.

**1. Fixed targets, sub-rect rendering (`fixedLightingTargets`, default on).**
The lighting-resolution targets are allocated ONCE, at the renderScale CAP
(`renderScaleMax`, also accepted as the `renderScaleCap` option). A renderScale
step now renders into a sub-rect of them, anchored at the origin:

* WRITE through each render target's own `viewport` + `scissor` (never
  `renderer.setViewport`, which would persist onto the canvas). `vUv` still
  spans 0..1 across the rect, `gl_FragCoord` still starts at 0, and every
  resolution / texel-size uniform stays the RECT's, so shader arithmetic is
  unchanged.
* READ through `rectUv()` (new `src/lightingRect.js`), which squeezes a sample
  point into the live rect and clamps it half a texel inside, so a LinearFilter
  tap at the rect edge cannot pull in the unused region. The remap is exact
  rather than approximate: a tap written as `uv + off / rectSize` lands on
  exactly `off` texels of the allocation, so not one texel offset had to change.
  Passes that only `texelFetch` their history (`AccumulatePass`) needed no
  shader change at all.

At the cap rung the remap is the identity and the whole path is byte-identical
to 0.16.9.

`renderScaleMax` is now an accessor: raising or lowering the cap is the one
governor-adjacent thing that legitimately reallocates, and it has to happen when
the cap moves. A genuine canvas resize still reallocates too. Nothing else does.

**2. A discrete ladder with hysteresis.** The governor picks a RUNG, not a
number off a continuous 0.05 grid: `SCALE_LADDER = [1.0, 0.85, 0.7, 0.55, 0.4]`
as fractions of the cap, clamped to the existing bounds. Three locks stand
between it and the trace's 1 Hz flapping:

    LADDER_DOWN_STREAK   10 consecutive slow samples before a rung is given up
    LADDER_UP_STREAK    180 consecutive samples with headroom before one is
                            taken back (18x the down streak)
    LADDER_DWELL_MS    4000 minimum between any two rung moves
    LADDER_REVERSAL_MS 20000 minimum before a move in the opposite direction

The reversal lock is what bounds the period: a complete down-up cycle cannot
take less than twenty seconds. Ladder mode also has no scale PROBE, because a
probe is "raise, then maybe put it back a second later" - the streak plus the
dwell do the same job with a floor under the period. The canvas ladder, the free
wins and the overload brake are untouched.

**History across a rung step.** The carry that a reallocation used to do is now
a rect-to-rect resample of the same allocation (`RTLightingPass.rectCarry`,
`CopyPass.blit(..., srcScaleX, srcScaleY)`), so the irradiance and specular EMAs
survive a step exactly as they survived a reallocation. TAA's resolved history
and the volumetric history are canvas-resolution and a rung step does not touch
them at all. The accumulate EMA and both reservoir sets are cleared on a step,
which is what `setSize` already did to them.

**Denoiser plugins.** The plugin protocol gains an OPTIONAL
`setRect(rectW, rectH, allocW, allocH)`. A plugin that implements it follows the
sub-rect and allocates nothing; a plugin that does not gets the old
`setSize(rect)` contract and reallocates its own targets, which is now COUNTED
(`denoiserPluginAllocations`) rather than hidden.

**New surface.** `fixedLightingTargets` and `renderScaleCap` options;
`lightingRect`, `scaleLadder`, `lightingAllocations`, `lightingRectChanges` and
`denoiserPluginAllocations` on the instance; `setRect` on every
lighting-resolution pass.

## 0.16.9

**No struct crosses a function boundary in the traced shaders any more, so an
Adreno driver that refused to build them now does.** On a Nothing Phone 2 the
game using this library reported

    Ray tracing unavailable on this GPU: a shader failed to build:
    rt:lighting: ERROR: 0:240: '_ubvh' : undeclared identifier

`_ubvh` is the driver's mangled name for `bvh`, the parameter of
`bvhIntersectAnyHit( BVH bvh, vec3 rayOrigin, vec3 rayDirection, float maxDist )`
in `bvhAnyHit.glsl.js`. `BVH` is three-mesh-bvh's struct of four samplers
(`index`, `position`, `bvhBounds`, `bvhContents`). A struct containing samplers
is legal as a UNIFORM, but passing one as a FUNCTION PARAMETER is a corner of
GLSL ES that drivers disagree about: desktop GL, Apple and other Android parts
accept it, this Adreno driver does not, and it fails the whole program, so the
device loses ray tracing entirely.

The any-hit traversal now does what three-mesh-bvh already does for its own
closest-hit traversal: a one-line `#define` expands the struct into its four
samplers AT THE CALL SITE, and the real function `_bvhIntersectAnyHit` takes
four plain samplers. Every call site is unchanged (`bvhIntersectAnyHit( bvhStatic,
ro, rd, d )` still reads the same in RTLightingPass, GIReservoirPass and
VolumetricPass), the `uniform BVH bvhStatic / bvhDynamic` declarations are
unchanged (a struct uniform is fine), and no public API moves: `index.d.ts` is
untouched.

Byte-identical output, checked on the GPU rather than assumed:
`dev/legacy-render.html` (the museum, static compile, pinned camera, 120 renders,
FNV-1a over the drawing buffer) gives the same hash before and after the change,
in both arms: `opts=new` `04bf92af` and, with `?plus=1`, `45022e94`. That second
arm is new here: it turns on `restirGI`, `volumetric` and `reflections/refraction`
so the frozen render compiles and drives every program that includes the shared
traversal chunk, not just the lighting pass.

## 0.16.8

**The plugin post passes apply to output on any grid.** `denoiserPluginPostHistory`
(temporal smoothing) and `denoiserPluginPostIterations` (a-trous) used to run only
when a denoiser plugin returned its pair on the lighting grid, because the passes
that implement them are the shared ones allocated at that grid. An upsampling
network (quarter rays in, higher-resolution pair out, 0.16.7) therefore got no
smoothing at all, which is exactly the network that needs it most. Both passes
were already grid-agnostic (AccumulatePass separates `uTexSize` from `uGbSize`;
DenoisePass taps at its own texel size and reads the G-buffer by `vUv`), so an
off-grid output now gets its own AccumulatePass + DenoisePass sized to the output,
created lazily the first time such a frame arrives with a non-zero knob and freed
on `setDenoiserPlugin(null)` / `dispose()`. Output on the lighting grid is
unchanged and still uses the shared passes. New read-only
`rt.denoiserPluginPostGrid` = `[w, h]` of the grid the post passes last ran on, or
null.

**The renderScale floor is no longer hard-wired at 0.2.** New
`RealtimeRaytracer.MIN_RENDER_SCALE = 0.05` is the hard floor under every bound
(constructor options, the overload brake, and a plugin's `preferences.renderScale`
min/max). The DEFAULT floor for an app that says nothing is still 0.2, so nothing
changes unless something asks: the case that asked is an upsampling plugin, for
which 0.2 was a floor on the wrong quantity (it traces at the low grid and
reconstructs above it).

## 0.16.7

**A denoiser plugin may return its pair at any resolution** from the lighting
grid up to the G-buffer's own. A network that takes quarter-resolution rays and
the full-resolution G-buffer and writes full-resolution output returns
full-resolution textures; the composite now taps `irradiance` / `specular` at
their own texel size (`uIrrTexelSize` from the texture, not from `renderScale`)
and skips the guided upsample when they are already at canvas resolution. The
two must share a size. `denoiserPluginPostHistory` / `PostIterations` apply
only to output on the lighting grid (their passes are sized for it; a network
that upsamples itself does its own temporal work). Byte-identical on every
built-in path and for a plugin that outputs on the lighting grid (the sizes it
reads equal `_scaledW/_scaledH` there).

**`ctx.lightingSize` / `ctx.gbufferSize`** (`[w, h]`, reused arrays) in the
plugin's frame context: the two grids it is looking at, without measuring
textures.

**`preferences.postHistoryFrames` / `postIterations`**: a plugin may advertise
how much of the built-in post filtering its output wants; they fill the app's
DEFAULTS for the two 0.16.4 knobs (a non-zero value the app already set wins)
and are cleared again when the plugin is detached.

Typings: `DenoiserPlugin.render` may return `false | null | undefined`
(0.16.6), `preferences`, `renderScaleMin`, `denoiserPluginRan`,
`denoiserPluginPostIterations` / `PostHistory` (options and live properties)
are declared. README: the plugin section (declining, preferences, output
resolution, the post knobs) and the governor bounds.

## 0.16.6

**A plugin may decline a frame.** `plugin.render()` returning `false` (or
nothing) hands the frame to the built-in split-accumulate denoiser, from the
same raw pair, exactly as if no plugin were attached; `rt.denoiserPluginRan`
reads whether the plugin resolved the LAST frame. This is what an
asynchronously compiling or unsupported plugin needs: no flicker, no detach.

**Plugin preferences for the governor** (`plugin.preferences.renderScale = {
min, max, preferred }`, read on attach): `min` / `max` become the governor's
bounds, never wider than the app's own `renderScaleMax`; `preferred` is where
the scale starts if it lies inside them. Detaching restores the app's bounds.
**`renderScaleMin`** (option + live property, default 0.2) is the floor the
governor steps down to.

## 0.16.5

**`renderScaleMax`** (option + live property, `0.2..1`, default 1): the ceiling
the adaptive governor may raise `renderScale` to. A phone or tablet GPU that
finds headroom otherwise walks the scale up rung by rung, and every rung
reallocates every pass at the bigger size; on iOS Safari that memory spike is
what loses the WebGL context minutes into a session (Hangar, 2026-08-17: flat
texture / geometry counts, then a loss). Pin the ceiling instead of turning the
governor off, so it still steps DOWN freely. Lowering it below the current
scale clamps the scale on the next adaptation, through the same setter a manual
change uses; the up-steps and the free-wins release respect it.

## 0.16.4

**Post filtering on a plugin's output.** `rt.denoiserPluginPostIterations = N`
(default 0) runs the built-in edge-aware a-trous N times on the plugin's OUTPUT
irradiance, a spatial post-filter for a network that still leaves residual
noise; `rt.denoiserPluginPostHistory = N` (default 0) first runs the output
through the split-accumulate EMA (N frames of reprojected history, the same
pass the built-in pipeline runs on raw samples) so frame-to-frame flicker
settles, at the cost of a little lag on moving lights. Both live, both 0 =
byte-identical to 0.16.3. Order: plugin -> temporal history -> a-trous.

## 0.16.3

**Denoiser plugin hook (`rt.setDenoiserPlugin`).** The library ships one
denoiser: the temporal EMA (`AccumulatePass`) followed by the edge-aware a-trous
blur (`DenoisePass`). An application can now replace that stage wholesale with
its own filter, without forking the renderer. While a plugin is attached (and
the split-accumulate MRT path it needs is available, `rt.denoiserPluginActive`),
the frame runs `rtPass.renderRaw()` and calls

```js
plugin.render(renderer, rawIrradiance, rawSpecular, gbuffer, viewMatrix,
              { warp, proj, motion, frame })
```

then composites the `{ irradiance, specular }` textures it returns exactly where
the a-trous output would have gone; everything downstream (guided upsample, fog,
sky, the volumetric add, tonemap and the TAA resolve) is unchanged. `warp` is
`prevViewProj * camera.matrixWorld` and `proj` is `[P00, P11, P02, P12]` of the
jittered, overscan-widened projection, which together are what a temporal plugin
needs to reproject its own history; `motion` is `gbuffer.motion` when motion
vectors are active and `null` otherwise. Lifecycle: `setSize(w, h)` on every
lighting-resolution change, `resetHistory()` wherever every other temporal
history in the pipeline is dropped (`resetAccumulation`), `dispose()` from
`rt.dispose()`. Nothing about the plugin is assumed beyond those four methods,
and the library ships no plugin and no plugin-specific code. With no plugin set
the render path is unchanged and byte-identical (see the gates below).

**`rt.rawInputView`** (debug, default `false`): composite the RAW 1-spp lighting
instead of the denoised lighting, i.e. show what the denoiser is FED rather than
what it produces. Bypasses `AccumulatePass`, the a-trous blur, the TAA resolve
and its jitter, and swaps the composite's guided upsample for nearest-neighbour
so a lighting-res noise pixel stays a square on screen. Needs the
split-accumulate MRT path (it is the only configuration in which the raw samples
exist as their own textures) and is inert otherwise. It does not change whether
a plugin runs: the plugin still executes and still advances its history.

**`makeMRT` is exported** from the package root. It is the multiple-render-target
constructor that spans the three peer range (three r172 removed
`WebGLMultipleRenderTargets`); a denoiser plugin allocates its own MRTs and
needs the same shim the library's own passes use.

Identity gates on this change, all green with no plugin set: `npm run test:km`
(27/27, including the shader-source byte identity against master), `npm run
test:render` (chromium + chromium@3latest + empty-scene + warnings + presets +
ambient + lights + lightgrid + governor), `dev/dynamic-partial-gates.mjs
identity` (0 diff on every buffer at frames 1/30/60/90), and the frozen museum
render (`dev/legacy-render.html`) against master's `src/`. `dev/legacy-identity.mjs`
reports one differing shader variant, `CompositePass.composite` (+8 / -0 lines):
the `uNearestLighting` uniform and its branch, which is uniform-gated and never
reachable with `rawInputView` off; the frozen render is the gate for it and it
matches master's hash bit for bit.

## 0.16.2

**The volumetric pass marches only where there is something to scatter.** With
`density: 0` and localized `zones`, every quarter-canvas pixel used to run the
full stratified march (4 steps, each with a BVH any-hit shadow ray to a random
light) and multiply the result by a local density that was 0.0 for every step
outside the zone: measured 16.8 ms per frame at canvas 1.0 on an RTX 3060, flat
in `renderScale`, for one sun-shaft zone that was not even on screen. Now the
ray segment is slab-tested against every zone AABB first (fattened by `eps` so
a grazing ray is never culled) and the march is skipped when it crosses none;
inside the march the shadow ray is skipped when the local density is zero. The
`rand()` calls are kept in the same order and count, so the output is
byte-identical (0 diff, same boot, both at a pose that does not see the zone
and one that looks straight into it). Cost after: 0.04 ms at the gallery pose,
3.2 ms of in-zone march when looking into the shaft. Global fog (`density > 0`)
is unchanged.

**G-buffer material pooling** (`gbufferMaterialPooling`, default `true`; ported
from a community PR against 0.15.0). Instead of one G-buffer `ShaderMaterial`
per mesh, the pass keeps one shared material per `(vertexColors, side)` key and
syncs the source material's uniforms per draw in `onBeforeRender` (with
`uniformsNeedUpdate`), so three.js switches programs far less often; meshes with
custom `onBeforeRender`/`onAfterRender` callbacks and multi-material meshes keep
the legacy per-mesh proxies. The pooled path honours `material.visible`
(an invisible source material no longer rasterizes into the G-buffer). Raster
output byte-identical; traced within floor. `false` restores the per-mesh path.

**Compiler hardening.** `extractMeshGeometry` reads interleaved and normalized
attributes through `getX/Y/Z` (they pack to contiguous floats now), computes
missing normals on the indexed source before de-indexing (smooth, not flat),
and drops dangling triangle tails per source mesh (`count % 3`), never across
meshes. `updateDynamic()` untouched (bit-exact gate: 0 diff).

## 0.16.1

**`updateDynamic()` does work proportional to what moved.** The dynamic path
re-baked every rigid segment through its matrixWorld, refit the whole dynamic
BVH, and rebuilt every node's bounds/contents texture, every frame, whether or
not anything moved. A Hangar scene with 396 dynamic segments measured 11.8 ms
per frame on that path while 380 of the segments were parked at `y = -1000`
(the engine cannot add a dynamic mesh after `compileScene`, so pools are
compiled in and parked). The parked pool now costs nothing:

- **Per-segment dirty test.** Each rigid segment keeps a `Float64Array` copy of
  the 16 `matrixWorld` elements it was last baked with; a segment is dirty if
  any element differs (exact compare), or it is deforming/skinned, or on the
  first call. Only dirty segments are baked. Each segment also keeps its world
  AABB from its last bake, and the frame's dynamic bounding volume is the union
  of those cached AABBs, so a parked segment costs a box union, not a vertex
  loop.
- **Partial refit.** At compile (and after a rebuild) the dynamic BVH is walked
  once to build, per segment, the sorted `Uint32Array` of node32 indices on the
  paths to every leaf whose triangles overlap the segment. Per frame the dirty
  segments' maps are unioned and `MeshBVH.refit(set)` refits only those nodes;
  when nothing is dirty the refit is skipped entirely. (Leaf offset/count index
  the geometry's index buffer, which MeshBVH's build reorders, so the maps are
  built by routing each leaf triangle's first vertex through that index to its
  segment, not by assuming triangle == vertex/3.)
- **Partial repack.** The bounds Float32Array `bvhToTextures` produced at build
  is kept; per frame only the refit-set node bounds are rewritten and
  `boundsTexture.needsUpdate` is set. Contents and index textures never change
  on a refit and are not touched. Only the dirty segments' position texels are
  rewritten into the BVH position texture.
- **Rebuild path unchanged.** When the dynamic volume grows or shrinks 3x the
  tree is rebuilt, the per-segment maps rebuilt, and every leaf is normalized
  with one full refit so the partial and full paths stay bit-identical after a
  rebuild. The dynamic-emissive refresh runs only when a dirty segment is an
  emitter.
- **New read-only stat** `compiled.lastDynamicUpdate = { dirtySegments,
  refitNodes, bakedTriangles, ms }` for harnesses; documented on
  `CompiledScene`. `updateDynamic()` takes no arguments, as before.

## 0.16.0

**Lights without a cap.** The renderer's light table has been 32 rows since the
first release, and the comment next to it said what it was waiting for: *"stage-1
cap; a data-texture light list is future work"*. This is that work. The cap was
never a cost decision (under ReSTIR a light costs nothing per frame), it was a
UNIFORM BUDGET: three `vec4[32]` arrays in four shaders already spend 96 of the
224 uniform vectors WebGL2 guarantees, and 128 seats would have needed 384. Moved
into the texture the passes already bind, a seat costs four texels.

Every number below was measured on this machine against its own floor
(`dev/LIGHTS-0.16-REPORT.md` has the tables and the protocol).

### The light table lives in the scene-data texture

- **New constructor option `maxLights`, default 128, hard max 256.** It is
  compile-time, like `textureTiles`: the value is a `#define` in four programs
  and the scene-data texture's width, so the setter throws with a clear message
  instead of accepting a number it cannot honour.
- The table moved to the LAST row of the scene-data texture, 4 texels per seat
  (`posType`, `colorRadius`, `dirCone`, `extra`; `extra.x` is a per-seat
  generation counter, bumped when a different light takes the seat). Every pass
  reads it through three accessors (`lightPosType(i)`, `lightColorRadius(i)`,
  `lightDirCone(i)`), so not one line of shading maths changed.
- **`RTLightingPass` still binds exactly 16 samplers, and its textual
  `traceRadiance(` count is unchanged at 5** (one declaration and four calls;
  0.15.0's report said 4, and counting master's own file finds five). Both were
  release walls before this change and are asserted, with counts, in the report.
- **Verified bit-identical.** With the new features off (`restirLightGrid:
  false`, `maxLights: 32`) and candidate importance off, master and this branch
  produce the SAME 2,764,800 bytes on museum / cornell / waterfall / a many-light
  room, at k=1 and k=90, on a protocol whose own floor is exactly zero. With
  candidate importance ON, 6 bytes in 2,764,800 differ by 1, which is the
  candidate CDF now being summed on the GPU in float32 rather than on the CPU in
  float64, and it is the only difference in the release.
- `updateLights` uploads the light ROW only (`texSubImage2D`), not the whole
  texture: `needsUpdate` re-sends the tile block with it, which is tens of
  megabytes on a textured scene. It also compares the table against what is
  already in the texture and does nothing at all when nothing moved.

### The light grid: candidates from lights that matter to this pixel

- **New option `restirLightGrid`, default `true`.** The reservoir's
  analytic-light candidates are drawn from a per-cell distribution over a uniform
  grid on the scene's static bounds (RTXDI's "light grid"), instead of one
  scene-wide power CDF. In a corridor with three lights per room and ninety-six
  in the building, the global CDF put about one candidate in thirty-two in the
  room the pixel is standing in.
- Weight of light i in cell c is `lum / max(d², (cellDiagonal/2)²)`, the same
  inverse square the shading uses, with d measured to the nearest point of the
  cell's box, times a spot-cone factor. Every active light keeps at least 1/1000
  of the cell's largest weight, so RIS support is complete and the estimator
  stays unbiased.
- Built on the GPU in two small draws whenever the light set, the directional
  bypass or the grid toggle changes; a still scene builds it once. **Row 0 of the
  same table is the global power CDF**, which is what `restirLightGrid: false`
  reads, so turning the grid off is the 0.15.0 candidate stream rather than a
  third code path.
- The per-light CDF uniform array (`vec2[MAX_LIGHTS]`) is gone with it.

### Demo, docs, tests

- **New gallery scene `hotel`**: a 53 m corridor, twelve rooms down each side,
  four fixtures in each, so 96 analytic lights at once, with every door open and
  a slow dolly past them. `?lights=32|64|96` thins the fixtures evenly across the
  rooms. The gallery strip gains a **light grid** toggle and a
  `lights / maxLights` readout.
- **New self-tests.** `?selftest=lights`: 48 lights over a strip must render 48
  distinct pools, and the same scene at `maxLights: 32` must render 32.
  `?selftest=lightgrid`: two rooms with one light each and a wall between, and
  the share of the CANDIDATE distribution that belongs to the pixel's own room,
  read off the light-grid table itself: 0.944 per-cell against 0.500 global.

## 0.15.0

**The defaults philosophy of this release, in the owner's words:** *"I would
like the default settings for the library to just work so that anyone can
simply add the RT library to their three js projects and see a beautiful result
right away."* The split is by KIND, not by taste: the algorithm being right is
cheap and is now the default, and the things that cost rays are opt-in.

Everything below the first two sections was proven in a game (the Hangar) against
a measurement gate before it was promoted here; every number quoted was measured
beside its own floor, and a difference under twice its floor is not reported as a
finding.

### Defaults

- **`gi` now defaults to `false`.** It is the most expensive thing in the
  renderer — one extra traced ray per pixel per frame, shaded with the full
  direct + NEE stack — and the one feature a scene can be authored around.
  Measured on the museum at 1280x720, over five back-to-back A/B pairs:
  **0.72x frame time with GI off** (median, spread 0.23). Turn it on for colour
  bleed; it is one line.
- **`ambient` is new and defaults to `true`**, and it is what makes the line
  above safe. See the next section.
- **`stochasticLights` now defaults to `false`.** It only ever applies when
  ReSTIR is off, and ReSTIR is the cheap many-light path and is on by default.
  What the old default really did was redefine `restir: false` to mean *one
  random light per pixel per frame* — the noisiest estimator in the renderer —
  rather than the exact per-light loop, so every "estimator off" reference taken
  by flipping one flag was measuring the wrong thing. The governor still turns
  it on when it needs the rays back.
- **Four ReSTIR correctness fixes and `motionVectors` now default to `true`.**
  Each is the estimator being right rather than fast, and together they measured
  at **1.01x** the 0.14.1 frame time on the museum (median of five pairs, spread
  0.19) — free. Details in the ReSTIR section below.
- `PRESETS.balanced` follows `stochasticLights` to `false`. That preset is
  defined as "the constructor defaults, written out", and `?selftest=presets`
  asserts it is a no-op on a fresh instance.
- **New static `RealtimeRaytracer.DEFAULTS`**: the constructor's defaults for
  every live-assignable option, as one frozen flat object, so an app can offer a
  "reset to defaults" button without hard-coding this library's opinions. It
  excludes options that need a `compileScene()`, scene description
  (`envColor`/`sky`/`fog`/`ior`) and constructor-only wiring — a reset button
  should not recompile your scene or repaint your sky. `?selftest=presets`
  asserts every key in it equals the same-named property on a fresh instance.

### Ambient and hemisphere lights (new)

- **`AmbientLight` and `HemisphereLight` are honoured**, as an unoccluded flat
  term. They were ignored before: neither has a position to aim a shadow ray at,
  so neither can be a row in the light table, and there was no non-traced light
  path at all. That was survivable while `gi` defaulted on, because a GI ray that
  escapes returns `envColor`. With `gi: false` it is not — **a scene whose only
  light was an `AmbientLight` rendered pure black**, and nothing caught it,
  because every demo scene has a traceable light in it.
- `SceneCompiler` sums the visible ones and `RTLightingPass` adds
  `flat + mix(ground, sky, 0.5·dot(N, up) + 0.5)` to the **direct** irradiance —
  demodulated, so the composite multiplies it by albedo exactly as three's own
  lights do. Three uniforms and a dot product: no ray, no shadow, no loop, **no
  new `traceRadiance` call site** (still 4) and **no new sampler** (still 16).
  Several hemisphere lights combine as an intensity-weighted mean axis.
- Option `ambient`, default `true`. `false` uploads zeros, which the shader adds
  unconditionally, so the off state is bit-for-bit the pre-0.15 result.
- **It is not global illumination and is not sold as one.** Nothing occludes it,
  nothing carries colour between surfaces, and GI bounces do not pick it up.
  `gi: true` remains the real thing.
- New gate `?selftest=ambient` in `npm run test:render`: an AmbientLight-only
  scene is not black (mean luma **235.00**), the same scene with `ambient: false`
  is (**0.00**), a HemisphereLight-only scene is not black (**213.00**) and its
  up-facing and down-facing surfaces differ (**213.00 vs 38.76**), so the blend
  is a real function of the normal.

### ReSTIR: the estimator, corrected

- **`restirDirectionalBypass` (new, default `true`).** The sun does not go in the
  reservoir. A reservoir scores its candidates **unshadowed**, and a directional
  light is bright on every surface facing it while being occluded on most
  interior ones — so the reservoir elects it again and again, spends its one
  visibility ray on the wall in between, and the pixel resolves to black with the
  odd frame's runner-up as a bright speck. Measured on a doorway turn, over the
  region stock breaks: **18.67 → 10.90**, against **10.69** for the same scene
  with the sun's intensity zeroed. The sun is counted exactly once (checked
  against the true sun contribution, which in that interior is +0.12 of 255 —
  it contributes almost nothing and cost the reservoir almost everything). Cost:
  one shadow ray per pixel, **+8.7%** in that view.
- **`restirReprojectionRescue` (new, default `true`).** The sub-texel correction
  the irradiance accumulator already applied, plus a four-neighbour rescue when
  the plane test fails. Without them TAA jitter walks the lighting-res G-buffer
  sample across a baluster every frame and the reservoir restarts from eight
  uniform candidates forever. Share of shaded pixels that never warm up at a
  settled pose: **9.81 / 3.28 / 13.37% → 0.51 / 0.17 / 0.82%** across three
  views; in a scene with no thin geometry the permanent 3.2–3.8% floor goes to
  **0.00%**. ALU only. In *motion* it cannot help — a genuinely disoccluded pixel
  has no history anywhere — and that is stated rather than glossed.
- **`restirCandidateImportance` (new, default `true`).** Candidates are drawn the
  way NEE draws them: pool by power, then that pool's own CDF. Uniformly, **91%
  of the candidate budget went to a pool carrying 3.7% of the light** (98% for 2%
  in a smaller scene). Doorway turn at default settings, whole-frame error
  against the exact path, with a run-to-run floor of exactly 0.000:
  **14.24 / 13.09 / 8.29 / 4.90 → 7.00 / 5.62 / 5.41 / 2.06**, and a signed error
  of **−0.001 of 255** at convergence, which is the unbiasedness check. Measured
  **free**, and slightly cheaper: an 8-step binary search on 10% of candidates
  costs less than four texelFetches on 91% of them.
- **`restirClampRel` (new, default `2`).** The firefly cap on the ReSTIR direct
  term is now relative to the pixel's own reservoir estimate of the unshadowed
  total, not an absolute constant. One sample carries the *whole* light sum, so
  the term is bimodal and an absolute cap clips the peaks while nothing lifts the
  zeros: bright surfaces converged **dark**, as a halo of missing light around
  every bulb. Converged signed error **−2.52 → −0.23** (gallery) and
  **−4.75 → −3.80** (great hall), against signed floors of 0.02–0.21.
- **`restirWarmAge` (new, default `0` = off).** A pixel younger than N frames of
  validated reservoir history is shaded by the exact per-light loop. It removes
  reveal speckle outright — a whole-screen reveal at one frame goes **51.80 →
  11.51**, landing on the ReSTIR-off curve — but the exact path is 5–6× a ReSTIR
  frame, and because the cold pixels are a fine **stipple** rather than a region
  the branch is billed at warp granularity: **2.2× the frame in motion** even
  after the reprojection rescue cut the settled cold fraction below 1%. Shipped
  off, with the measurement that says why.
- **`restirSamples` / `restirSampleRadius` (new, default `1` / `10`).** Shade N
  reservoir winners per pixel, each with its own visibility ray, averaged.
  Estimator noise 16.81 → 11.13 from N=1 to N=4 — real, but sub-`1/√N`, because
  neighbouring reservoirs were merged from overlapping taps one stage earlier.
  Through the shipped denoiser the win mostly disappears, so it is a lever for a
  weaker denoiser or a machine with headroom.
- **`restirDynamicAccept` / `restirDynamicFreeze` (new, both default `false`).**
  Two treatments for pixels on a moving mesh. Both work at the mechanism level
  (reservoir M on the mover 17.97 → 23.14, starved pixels 38% → 5%) and **neither
  moved the visible noise**, because the shimmer there is dominated by the
  irradiance EMA. Off, because a change with no measured visible benefit should
  not be on.
- **Stable light slots** (behaviour, not an option). `syncLights` cleared the
  light table and re-pushed only the visible lights, so an index meant "position
  in traversal order over the active set" — and a ReSTIR reservoir stores a light
  INDEX. Any change to which lights are active therefore silently repointed every
  reservoir on screen. Slots are now sticky: a light active before and after a
  re-sync keeps its index. Measured across a room crossing: survivors keeping
  their slot **0/17 → 14/17**, residual spike **3.70 → 1.94**.

### Temporal

- **`motionVectors` (new, default `true`).** The G-buffer writes each fragment's
  previous screen position into a fifth `RG32F` attachment, and the irradiance
  EMA and the ReSTIR reservoir look up history *there* instead of reprojecting
  the current world position through the previous view-projection. That
  camera-only reprojection is correct for static geometry and simply wrong for a
  moving mesh. Residual on a moving mesh **5.39 → 4.70** mean, **8.69 → 6.57**
  p95. **TAA deliberately does not consume it** — it measured as a clear
  regression on its own (7.81 mean). A static mesh's motion vector collapses
  exactly to camera-only reprojection, so a static scene renders byte-identically
  either way. Needs ≥ 5 draw buffers (WebGL2 guarantees 4); without them the
  option is ignored with a one-time warning — read `rt.motionVectorsSupported`.

### The adaptive governor is two-way

- **It could lower quality and never raise it.** Its only signal was wall-clock
  frame time, and a vsync-capped display pins that at the refresh period no
  matter how much GPU headroom exists, so every gate that RAISES quality was
  unreachable. Measured before the fix: renderScale 0.5 at load, the 0.2 floor
  plus a 0.75 canvas by twelve seconds, then 0.20 for every one of the next 63
  one-second samples at a steady 16.7 ms. Any transient — a shader link, an asset
  load, another window taking the GPU — cost lighting resolution *for the life of
  the page*.
- DOWN is still judged on the wall clock. **UP is now judged on measured GPU
  milliseconds**, through the `GpuTimer` this package already shipped **but never
  imported**. That timer had a deadlock of its own: `end()` returned early when
  `begin()` had been skipped, so once queries were outstanding nothing was ever
  drained and the cost read null forever. Both fixed.
- Where the extension is withheld (Safari, iOS), UP falls back to raising one
  rung and reverting if the wall clock degrades, with per-rung exponential
  backoff. New option `gpuTiming` (`"auto"` | `false`); new read-only
  `gpuCostMs`, `gpuTimingSupported`, `gpuTimingActive`.
- Validated against a readPixels-synchronised ground truth: the timer tracks the
  wall clock to a flat ~0.85 ms across 27–258 ms frames. With a GPU hog run for
  20 s, quality falls to the floor and then **climbs all the way back within 20 s
  of the hog stopping, with exactly one direction reversal**; 150 s of steady
  flight after settling produced four changes, all in the first fourteen seconds.

### Materials

- **`material.userData.rtNoAreaLight = true`** keeps a material's triangles out
  of the emissive NEE list without changing anything else — it still renders at
  its full emissive value and still appears in reflections, it simply is not an
  area light. The case is unlit SCENERY: a backdrop carrying its diffuse map as
  an emissiveMap is emissive by construction, and because the list keeps the
  largest 256 triangles by area, one ground quad evicts every real lamp.
  Measured before the flag: of 77,535 candidates the kept 256 were 255 garden and
  1 hedge, and every chandelier, lamp, bulb, TV and candle was evicted. After:
  132 chandelier, 48 lamp shades, 40 bulbs, 36 TV, no outdoor triangle at all.
- `compiled.emissivePower` is exposed (the power CDF's own normaliser), so
  "power" is defined once for both NEE and the ReSTIR candidate split.

### Demos

- **Every new option has a control**, grouped under the ReSTIR toggle it
  modifies, plus ambient with the lights and motion vectors with the temporal
  dials.
- **A "Reset to defaults" button** in both the demo panel and the gallery strip.
  It reads `RealtimeRaytracer.DEFAULTS`, drives the scene-revealing features
  through their own handlers so a room really does hide its pieces, re-syncs
  every control, clears the tour's `sessionStorage` snapshot and restarts the
  image. Verified by changing eight settings by hand, pressing it, and reading
  all seventeen values back.
- **The demo now boots on the library's defaults** on a desktop tier. Its old
  "tested MINIMAL" block pinned renderScale 0.375, five denoise passes,
  stochastic lights and the governor OFF — every one of those a reaction to
  defaults that were heavy in the wrong places. Worse, an explicitly-passed
  option is *pinned against the governor*, so that block also forbade the
  governor from using its own levers. Phones and tablets keep a lean start.
- **New gallery scene: "Waterfall"**, after the Cornell box. Forty pooled bodies
  falling through a peg board forever, six of them emissive area lights and four
  carrying point lights, in a shaft with no floor — the catalogue's only moving
  scene, and the only way to show a dynamic BVH refit, emitters that travel, and
  reservoirs surviving lights in motion. Verified: 36/40 bodies still moving
  after a minute, dynamic bounds stable at 5.70 × 12.27 × 2.65 across 30 frames
  with one compile and no rebuild storm, and the emissive set measurably lighting
  the walls (wall-region luma **69.31 with `emissiveNEE` on vs 59.72 off**,
  against run-to-run floors of 0.12 and 0.05).

### Types

- `index.d.ts` declared six `restirSpatial*` options that **no implementation
  has** — they arrived from an increment whose code did not, and passing one did
  nothing at all. Removed. The four options the library *does* implement but
  never declared (`restirSamples`, `restirSampleRadius`, `restirDynamicAccept`,
  `restirDynamicFreeze`) are declared instead, along with everything above.
  Verified with `tsc --strict` against a consumer-shaped construction, including
  a negative control that the removed options are now a type error.

## 0.14.1

- **The adaptive governor now respects explicitly-pinned options.** `_takeFreeWins`
  unconditionally turned on `giHalfRate` and `restirGI` and lowered `restirMCap`
  to 16, with no record of whether those values were the library's defaults or
  the application's deliberate choice — an app that passed `restirGI: false` (or
  `true`) watched the governor silently override it. The constructor now records
  which of the free-win options were passed explicitly (`options.key !==
  undefined`), and `_takeFreeWins` skips any pinned key. Because a pinned option
  never enters the `prev` record, `_releaseFreeWins` cannot resurrect it either.
  The rule is symmetric: pinning means "the governor may not change this," so an
  explicit `restirGI: true` is equally protected. The three pinnable options are
  `restirGI`, `giHalfRate`, and `restirMCap` — every option the governor's free
  wins may modify. Pinning is a constructor contract: a runtime write
  (`rt.restirGI = false` after construction) does **not** pin, because the
  governor itself writes these properties and a naive "any write pins" rule would
  have it pin its own changes. If you need to change a pinned option at runtime,
  turn `adaptiveQuality` off, set the property, then turn it back on. A new
  `?selftest=governor` check guards the four invariants: pinned `false` stays
  false under sustained load; pinned `true` stays true; unpinned still gets the
  free wins; and the release path does not resurrect a pinned option.

## 0.14.0

- **Moving lights no longer drag a tail.** Every temporal validation in the
  engine asked a geometric question, so a static surface under a light that had
  just moved passed all of them and kept averaging light that was no longer
  there. `updateLights()` now measures how far the lights actually moved
  (position, colour, intensity, spot aim, cone angle, relative to scene size)
  and drives a `lightMotion` signal into the existing motion-adaptive temporal
  response, which until now only ever saw camera motion. AccumulatePass gains a
  temporal-gradient test that drops history per-pixel where the fresh sample
  disagrees with the accumulated mean by more than `lightGradK` sigmas, using
  the pixel's own accumulated variance so a noisy GI pixel is not mistaken for
  a changed one. New bench `probe-lightghost.html` (light jumps A to B, camera
  and geometry static): mean abs diff 40 frames after the jump falls from 31.4
  to 3.6 against a 0.27 noise floor, an 89 percent cut. New options
  `lightAdaptive` (default on), `lightMotionRef`, `lightMotionDecay`,
  `lightGradK`. With lights parked every new branch is skipped and the arena
  fences are unmoved (9 spikes, stillNoise 0.126, ghost@40 1.034, 61-62ms).

- **The adaptive governor no longer decides from shader-compile frames.** Its
  EMA seeded from a SINGLE sample and its change cooldown initialised to zero,
  so the first decision of every page load was made from one frame that
  typically contained compileScene and the megakernel link. On a vsync-capped
  display that decision permanently enabled the "free wins" (giHalfRate and
  restirGI), because their release gate requires a refresh above 110Hz.
  Measured on the shipped gallery: both were on by frame 3 of every load and
  still on, unreleasable, at frame 476. The governor now observes
  `GOVERNOR_WARMUP_FRAMES` (60) before it may change anything; after the fix
  the same page sits at giHalfRate false / restirGI false indefinitely. The
  emergency overload brake is unaffected and still reacts from the first frame.

- **The traced glass path is bounded.** Indirect radiance was capped by
  `fireflyClamp`, emissive NEE and the ReSTIR shade at 2x that, specular at 4x;
  glass had no cap at all. Because a solid dielectric decodes to transmission
  exactly 1.0, `mix(direct + indirect, glassRadiance, transmission)` discarded
  every clamped term and handed the accumulator an unbounded value. New option
  `glassClampScale` (default 4, in `fireflyClamp` units; 0 restores the old
  behaviour). Measured energy shift on mosquito, helmet, fox and cornell at
  pinned options: 0.00 percent. This closes a real hole but is NOT the fix for
  the gallery's close-orbit brightness, which is an exposure question (the
  studio sky alone sits near display white before the subject is considered).

- **ReSTIR GI is no longer added to glass.** The inline GI bounce is scaled by
  (1 - transmission) where it is composed, but the external ReSTIR GI add in
  DenoisePass was gated only by metalness, double-counting indirect light onto
  the pixels least able to receive it.

- Demo fix: game-bench read `dynamicLights` off the scene registry entry rather
  than the built scene, so it was always undefined and the stealth scene's
  sweeping spotlights were never synced to the tracer. Its traced lighting had
  been frozen at the t=0 pose in every bench number and video clip taken of it.

- `docs/SPEC_GOVERNOR_REWORK.md`: the full audited specification for replacing
  the governor's control law, including the verified finding that under a vsync
  cap the current law is a one-way ratchet (input quantized to multiples of the
  refresh period; smallest possible correction is a 19 percent renderScale cut;
  no up-step is reachable below a 68.75Hz refresh). Not yet implemented.


## 0.13.0

- **Temporal quality campaign: split accumulation pipeline (all fences PASS,
  three beat baseline).** Accumulation moves out of the lighting megakernel
  into a dedicated `AccumulatePass` at lighting resolution: texelFetch point
  sampling, SVGF-standard per-tap-validity bilinear reprojection (two-sided
  plane distance AND signed normal agreement against an octahedral previous
  normal stored in a new moments target), optional NRD-style neighbourhood
  rank clamp and history-relative k-sigma clamp (both default off; off won
  the A/B), and the inline path's exact EMA count semantics. Measured on the
  arena fence at a quiet GPU: motion fireflies 9 (baseline 10), stillNoise
  0.126 (baseline 0.127), ghost@40 1.034 (baseline 1.273, -19%), frame time
  61.4-62.2ms (baseline 62.3). Energy shift under 1.6% on every fence scene
  at pinned options. The signed normal-agreement rejection fixes the
  fast-rotation history leak (interior light glowing on a just-revealed
  backface); repro evidence in `_reviews/temporal/cornell-rotate/`. Mosquito
  amber boiling eliminated in the blind critic clip; luminance drift over 300
  frames is flat. `splitAccum: false` falls back to the old inline path
  (also the automatic no-MRT fallback). History clears on resize: an
  adaptive-governor renderScale step used to reallocate the ping-pong
  targets with undefined counts and freeze the frame blown out.
  Full campaign record: `REPORT_TEMPORAL_QUALITY.md`.


## 0.12.0

- **Quality presets.** A product or game can now wire in a named quality tier
  without learning fifteen sliders: `RealtimeRaytracer.PRESETS` ships four
  plain, inspectable bundles  -  `quality` (fidelity first), `balanced`
  (today's defaults, captured explicitly), `performance` (fps first) and
  `motion` (short history + a strong firefly clamp for fast camera movement)  - 
  and `rt.applyPreset(name)` applies one to a live instance at any time. A
  constructor `preset` option applies the bundle as the base, with explicit
  per-option values winning. Every bundled knob is live-tunable: none swaps the
  lighting megakernel's source or needs compileScene (knobs that would  - 
  `absorptionShadows`, `kmScattering`, `textureTiles`  -  are deliberately
  excluded). Because a preset sets the baseline the adaptive governor breathes
  around, applying one re-arms the governor at that baseline. With no `preset`
  key the constructor is byte-identical to 0.11.1 (option values asserted in
  the render self-test, including that `applyPreset("balanced")` is a no-op on
  a fresh instance). The shipped numbers are the measured winners of the
  v0.12.0 evidence round  -  see `REPORT_PRESETS.md` for the bench table, the
  blind Gemini video rankings, and the defaults recommendation (recommendation
  only; the architect decides default changes).
- **Default change: `maxHistory` 128 -> 48** (and the `balanced` preset
  captures the new default). Adopted from the evidence round's recommendation:
  on the ghosting-stress arena scene the shorter history cuts residual ghost
  at 40 frames by 21% for a 4% still-noise increase, and the blind video
  review explicitly flagged the old 128's light-toggle lag ("the illumination
  slowly fades up over several frames"). The throttled-leg finding stands
  documented: at LOW frame rates a longer history is the better trade  -  a
  low-end product can restore it with `maxHistory: 128` or the `quality`
  preset. The 0.11.1 option-snapshot assertion in the self-test is updated to
  the new default.
- **Game-scene benchmark page** `game-bench.html?scene=chase|stealth|arena`.
  The presets exist for games, so the evidence runs on three deterministic
  game scenes (chase / stealth / arena  -  fixed waypoints and event timings, no
  unseeded randomness), each a scripted ~20s loop. `?mode=bench` fence-times
  ms/frame, runs a ghost probe and a still-noise read per scene x preset and
  POSTs to `/__bench`; `?mode=clip` runs the loop for video capture with the
  adaptive governor on and an fps badge. `&tune=key:value,...` overrides knobs
  after the preset for A/B tuning. Permanent regression asset; scenes live in
  `examples/game-scenes.js`.

## 0.11.3

- Fix: normal-less geometry (e.g. Khronos Fox) rendered black under denoising.
  `extractMeshGeometry` computed normals on its clone for the BVH path but left
  the original geometry untouched; the G-buffer swap material read a zero normal
  from the original, `normalize(vec3(0))` produced NaN in the denoiser, and the
  a-trous weights spread the NaN into a black silhouette. The compiler now also
  computes vertex normals on the original mesh geometry when missing.
- Fix: the denoiser spread non-finite (NaN/Inf) irradiance into black blobs
  (observed on the WaterBottle label band edge and as large black squares on
  real GPUs). The a-trous loop now skips taps whose normal length is below 1e-4
  and taps whose irradiance carries NaN/Inf. A degenerate center normal
  short-circuits to the unfiltered center sample.
- Fix: transmission materials with a non-white base-colour map (e.g.
  MosquitoInAmber amber) rendered fully opaque instead of translucent. The
  CompositePass multiplied the glass-path irradiance by the G-buffer albedo,
  double-tinting the transmitted light: the base-colour map intended for the
  diffuse share (1 - transmission) of the mix was also multiplying the
  refraction, making the glass read as an opaque surface. Glass pixels now
  fade the albedo tint out with transmission (t=0 matches the diffuse branch
  exactly, no pop at the band edge; full glass leaves traced radiance
  untouched).
- New: derived glass tint. Glass materials with a non-white base colour or
  base-colour map and NO explicit attenuation now get Beer-Lambert absorption
  derived from the average base colour (characteristic distance 5% of the
  scene diagonal), matching three.js raster's convention that transmission is
  tinted by base colour, but along the refracted in-medium chord where it
  physically belongs (reflections stay untinted, thickness compounds).
  Explicit attenuationColor/attenuationDistance or userData.rtAttenuation
  always wins; an explicit white rtAttenuation opts out. Near-white bases
  derive nothing (the absorption row stays unmaterialized). Known limit:
  meshes ENCLOSED in glass (MosquitoInAmber's insect) end the chord at the
  first interior hit, so heavily occupied glass tints weakly; full in-medium
  accumulation across interior hits is future work.
- Fix (denoiser, follow-up): a non-finite center sample previously kept full
  kernel weight after being zeroed, rendering a black dot per NaN seed; it now
  gets zero weight and the pixel is rebuilt from valid neighbours (0/0 guarded).

## 0.11.2

- Fix: secondary-ray texture tiles rendered vertically mirrored. The tile block
  copied canvas rows top-down (row 0 = image top) while the shader's tileSample
  maps v=0 to the tile's first row and three.js UVs put v=0 at the image
  bottom, so every reflection, refraction, and GI read of a textured surface
  was upside down relative to the raster view. Tiles are now stored bottom-up.
  CPU-side only; generated shader source is unchanged.

## 0.11.1

- Fix: updateDynamic wrote packed attributes at stride 8 unconditionally; scenes compiled WITHOUT texture tiles (stride 4) corrupted normals on every dynamic re-bake, shredding moving meshes into radial artifacts. The re-bake stride now follows the compiled layout.

## 0.11.0 — 2026-08-10

- **Secondary-ray texture maps.** A textured surface seen through glass, in a
  reflection, or via a GI bounce no longer collapses to its average colour — the
  actual texel at the hit point's UV is sampled, so an emissive checkerboard
  viewed through a biconvex glass lens shows an inverted, magnified checkerboard
  instead of a featureless beige disc. Two constraints shaped the design: the
  lighting pass is at the WebGL2 16-sampler minimum (no new sampler), and
  barycentric interpolation of packed data is garbage (UVs must be stored as
  plain floats at separate texels rather than bit-packed). The result rides the
  existing scene-data texture with no new GPU resources.
  - **Map tiles on the scene-data texture.** Row 69 carries per-material tile
    indices (`[albedoTile, emissiveTile, 0, 0]`, `-1.0` = no map). Rows 70+
    hold the tile block: each unique texture image is resampled to 128x128 RGBA
    on a canvas, converted to linear colour for sRGB sources, and written as 128
    consecutive rows. One cache per image (`_mapTileCache`) so a texture shared
    by several materials gets one tile. Caps at 16 unique images by default
    (`textureTiles.max`); further materials keep the averaged-colour behaviour
    with a one-time warning.
  - **Stride-2 vertex attribute layout.** The per-vertex attribute texture now
    stores two vec4 texels per vertex: texel `2v` = `[nx, ny, nz, matIndex]`
    (unchanged content), texel `2v+1` = `[u, v, 0, 0]`. UVs are invariant under
    rigid transforms and skinning, so the UV texel is written once at build and
    never touched by `updateDynamic()`. Geometries without a `uv` attribute get
    a zero-filled one before merging so `mergeGeometries` does not drop the
    attribute. All three updateDynamic paths (rigid, deforming, skinned) were
    audited for the stride-8 offset change.
  - **Shader: `fetchAttrUv` replaces `textureSampleBarycoord` at all four
    sites.** A new GLSL helper replicates `texelFetch1D`'s 1D-to-2D addressing
    at stride 2 and does manual 3-vertex lerp. At each of the four
    `textureSampleBarycoord` call sites (shadow march, traceRadiance, glass exit
    in RTLightingPass; traceRadianceGI in GIReservoirPass), an RT_TEXTURE_TILES
    block adds a `fetchAttrUv` call that overwrites the old result. When the
    block is stripped (no maps), the old `textureSampleBarycoord` at stride 1
    is the only reader — byte-identical shader source. `tileSample` does manual
    bilinear (4 `texelFetch`es with wrap-mode repeat on the UV fract) from the
    tile block in `uMaterialsTex`.
  - **Per-texel shading at secondary hit points.** After `fetchMaterial`, if
    `uHasTextureTiles` is true and the material's tile index is non-negative,
    the averaged table colour is multiplied by the tile sample: `albedo *=
    tileSample(albedoTile, uv)` and `emissive *= tileSample(emissiveTile, uv)`.
    The table colour already carries the material tint (`color` for albedo,
    `emissive * emissiveIntensity` for emissive), so the compose matches
    three.js's `color * map` and `emissive * emissiveMap * emissiveIntensity`.
    The NEE light table and CDF (rows 1 and 66) keep using averaged emissive —
    importance sampling does not need the pattern.
  - **New option `textureTiles`** on `RealtimeRaytracer` constructor and
    `compileScene()`: `{ size: 128, max: 16 }`, or `false` to disable entirely.
    Typed in `index.d.ts`. When `false` or the scene has no textured materials,
    the shader is source-spliced to be byte-identical to the 0.10.0 build.
  - **Probe page** `probe-secondary-textures.html`: a glass sphere in front of a
    checkerboard, with `?mode=emissive` and `?mode=albedo` variants plus
    `&dynamic=1` for a dynamic-mesh test.
  - **GIReservoirPass** also receives the feature: GI bounce albedo samples
    per-texel when tiles exist, so colour bleeding carries the pattern.

## 0.10.0 — 2026-07-27

- **ReSTIR GI: the artifact was chromatic, and now it is gone.** `restirGI`
  shipped measurably *faster* than the inline GI path at flat rmse and was still
  not worth turning on — the picture grew coloured blotches, worst in the gallery
  scenes, that no number in the campaign could find. Write the resolve out in
  full and it says why. A reservoir holds one selected sample and a weight `W`;
  the resolve is `selRad * selCos/PI * W` with
  `W = wSum / (M * rtLum(selRad) * selCos)`. Substitute, and the `selCos` and the
  luminance both cancel:

  ```
  gi = chromaOf(selRad) * wSum / (PI * M)
  ```

  Two very different estimates multiplied together. The **luminance** is a
  running mean over the reservoir's whole M-frame history — that is what ReSTIR
  is for. The **colour** is the chromaticity of the *one* sample the reservoir
  currently holds, so in a Cornell box every pixel shows the colour of whichever
  wall its reservoir picked. Read straight off the GPU before the denoiser, the
  raw resolve is a **red/green confetti field at 37% chromaticity spread per
  pixel**.

  Nothing in the measurement stack could see it. `rmse` is luminance-dominated
  and the *mean* colour is correct — the estimator is unbiased, which is the
  point of RIS — so rmse read "free". The à-trous denoiser's edge-stopping
  weights are luminance-based too, so it cannot detect the error to stop on it;
  it averages the confetti into coarse coloured patches instead. The campaign's
  grid statistic did twitch (0.66 → 1.37), but only as a second-order luminance
  consequence of a first-order colour problem, which is why it read weak and
  unstable. The fix is **Rao-Blackwellization**: accumulate the RIS-weighted sum
  of the candidates' chromaticities beside `wSum` and resolve the colour as
  `chromaAcc / wSum` — the expectation of the very draw the reservoir makes.
  Identical mean, strictly lower variance, one multiply-add per merge point, and
  **no extra ray, sampler or storage** (the pass stays at its 16-sampler
  ceiling). `rtLum(chromaOf(x))` is 1 and `rtLum` is linear, so the mean is
  itself a unit-luminance chromaticity: rescaling by the resolved luminance
  leaves it bit for bit unchanged, and every luminance-derived quantity in the
  pass — `p_hat`, `W`, the merge weights, the validation test — is untouched.
  The store writes the running chromaticity back into the reservoir radiance,
  whose luminance is the only part ever read out again, which makes it recursive:
  one term folds in the entire history at exactly the weight the history carries.
  Option `restirGIChromaMean`, **default on**; `false` restores the old path.
  - **Two smaller corrections ride along, both measured.** The final visibility
    ray used to test the selected sample *whatever its origin* and zero the whole
    pixel on a hit. A temporal sample is visible by construction (the pass says
    so itself), so testing it only produces false rejections from ray epsilon;
    and zeroing threw away a pixel's entire M-frame accumulation over one
    neighbour's failed reconnection, in geometry-correlated patches — a
    structured black-speckle source exactly where contact shadows live. Now only
    a spatially adopted sample is tested (about half the pixels stop casting the
    ray) and a rejection falls back to that pixel's temporal-only estimate
    (`restirGIVisFallback`, default on). And the **resolve EMA is off by
    default** (`restirGIResolveAlpha` `0.15 → 1`): its partner was a
    reconstruction of the *previous* frame's temporal-only resolve, a noisier
    estimator than the merged one it was smoothing, carried at 0.85 weight, so it
    added variance — raw-resolve high-pass noise 50% of the mean at alpha 0.35
    against 26% at alpha 1, with still noise unchanged. What it was for, the
    selected sample's colour jumping frame to frame, is what the chromaticity
    mean now removes at the source.
  - **`restirGISpatialTaps` back to 2 (from 1).** The fix *inverts* the reasoning
    that lowered it. A tap used to swap in a different sample's colour, so each
    one was a fresh chance to draw the wrong one; now a tap is folded into the
    mean by its own RIS weight, so taps are a variance **sink**. Raw-resolve
    chromaticity spread runs 0.089 / 0.062 / 0.051 / 0.045 for 1 / 2 / 3 / 4
    taps, at 8.9 / 9.0 / 9.1 / 9.2 ms; 2 is where the curve flattens.
  - **Measured, `restirGI` on, everything else equal** (1280×720, RTX 3060,
    `renderScale 0.5`, 2 denoise passes). Cornell: raw-resolve chromaticity
    spread **0.388 → 0.106**; the coloured structure the fix targets — block
    structure of the on-minus-off difference field on the two chromaticity
    planes, which contains no scene content at all — **1.43 → 0.89**; rmse
    **5.83 → 5.34**, now *better* than restirGI off (5.39); still noise
    **0.194 → 0.178**; post-motion ghost residual **2.44 → 2.12**; frame time
    9.57 → 9.63 ms against 11.20 ms with restirGI off. Museum (a red wall
    bouncing onto a white floor — the scene where the raw resolve was worst):
    chromaticity spread **0.929 → 0.380**, rmse **5.16 → 5.07**, again better
    than restirGI off (5.13), ghost residual **3.31 → 2.85** and **3.35 → 2.77**
    at 1 and 5 frames after the camera stops. Lantern (a streamed Khronos asset
    on a sky-lit ground disc — the gallery framing the artifact was reported in,
    and the mildest of the four because a grey ground under a blue sky has
    almost no chromatic bounce to get wrong): chromaticity spread
    **0.118 → 0.017**, rmse **2.13 → 2.00**, ghost residual **3.97 → 2.34**,
    single-probe grid amplitude **0.596 → 0.386** against 0.527 with restirGI
    off. **How bad the artifact is scales with how coloured the bounce is** —
    Cornell and the museum are the extremes, a grey-and-sky scene barely shows
    it.
  - **The speed win is intact.** Tokyo (141k tris), the scene the −27% headline
    came from: **47.59 ms off → 34.53 ms on = −27.4%**, slightly *better* than
    the pre-fix path's −26.0%, because the visibility ray now fires on about
    half the pixels instead of all of them. rmse **4.59 → 4.42** (off 4.68),
    chromaticity spread **0.129 → 0.024**, ghost residual **6.53 → 5.82** and
    **6.44 → 4.71**. Across all four scenes the fix costs between −0.7% and
    +0.6% of frame time against the pre-fix path.
  - **Nothing changes with `restirGI` off.** A converged 1280×720 frame rendered
    at the campaign's reference config was byte-compared against `38cb328` with
    only `src/` swapped: identical on both Cornell (sha256 `1d4e395f…`) and the
    museum (`7d7e848a…`). Nothing outside `GIReservoirPass` moved, and that pass
    is not run at all when `restirGI` is off — `test:km`'s shader-source gate
    confirms `RTLightingPass` is still byte-identical to master in all four
    variants.
  - `restirGI` remains **experimental and off by default**, and the adaptive
    governor still does not turn it on by itself — that veto is the user's to
    lift, not a number's.

- **Adaptive governor rebuilt on the quality campaign's measurements.** It now
  spends quality in a fixed, cheapest-first order: **free wins** (`giHalfRate`,
  `restirGI`, `restirMCap` 16 — settings measured *cheaper and no worse*), then
  `renderScale` in 5% steps to `0.2`, then the canvas via `canvasScaleHook`,
  and returns them in reverse. Two measured defects fixed on the way:
  - it **no longer raises `denoiseIterations` past 3**. The old ladder raised
    passes as resolution fell (3 → 4 → 5) on the theory that the filter runs at
    lighting res so extra iterations are nearly free. The frame-time half is
    true; the image half is not. Error against a converged reference degrades
    monotonically past 2 passes, and the coarse à-trous lattice ("plaid") rises
    4–5× between 2 and 4 — peaking wherever the widest tap spacing reaches ~16
    *screen* pixels, which is pass 4 at `renderScale 0.5` and pass 3 at `0.25`.
    The old ladder was adding passes exactly there. The `denoiseIterations`
    option keeps its full range; this is the automatic policy, not a clamp.
  - the **canvas ladder no longer engages a rung early** (it fired at
    `renderScale 0.25`). At matched cost, full canvas at `renderScale 0.2` beats
    canvas `0.85` at `renderScale 0.2` by 14–22% error with ~40% more retained
    detail, measured on both real scenes — canvas scale throws away the
    G-buffer's edges, the one thing the tracer gets sharp for free.
  Observed end-to-end on the tokyo scene (141k tris, 1280×720, the governor's
  own landing state): **3.87 → 3.55 ms and 8.7% less error** than the old
  ladder's, and at the deepest rung **9.16 → 9.12 ms for 20.8% less error**.
- **`restirMCap` default 40 → 16.** The campaign's one unconditional win: better
  on *every* metric in *both* measured scenes for ~0.3 ms — error 5.39 → 4.92
  (Cornell) and 5.13 → 4.70 (museum), in-motion error 9.13 → 8.65 / 6.89 → 6.73,
  post-motion ghost residual 1.90 → 1.25 / 2.35 → 2.13. A 40-sample reservoir is
  simply staler than the pipeline around it. `restirMCapMoving` now defaults to
  `restirMCap` rather than a hard 40 (they were equal before; a *Moving cap
  longer than the parked one would be an inversion). With `adaptiveQuality`
  off, this is the **only** rendering change in this release — verified by
  byte-comparing a converged 1280×720 frame against the previous build with the
  cap forced back to 40: identical, FNV `b997636a` both sides.
- **New page: [`costs.html`](costs.html) — what each feature costs.** Per-feature
  ms, % of frame, fps on both sides of the switch and error delta, for three
  scenes (86 / 50k / 141k triangles), rendered from the committed measurement
  matrix. Linked from the tour chrome and the panel. It leads with the three
  results whose sign contradicts the feature's name: `restir` is a *speed*
  feature (off = 34–39% slower in multi-light scenes), so is `restirGI` (−27%
  on 141k tris, at slightly better accuracy, despite its experimental label),
  and `giHalfRate` buys 10–22% of the frame for an error wash.
- **Demo panel: every control the governor writes now says so.** The two
  resolution rows carry an AUTO badge and follow the governor live (including
  off-ladder values it steps to); `denoise passes`, `fast lights`, `half-rate
  GI` and `ReSTIR GI` mirror it too; and touching any of them switches auto
  quality **off** in one visible interaction instead of silently fighting you.
  The GI modifiers are drawn as sub-rows of `global illumination` and dimmed
  when it is off, and `ReSTIR GI` explains itself when the denoiser is off or
  running more than 3 passes.
- **Demo: a textured-duck exhibit in the Cornell box** — the repo's own
  `Duck.glb` twice, as shipped (one baseColor map) and with a normal + roughness
  map added in-page, which is what the G-buffer hands the tracer. **Stop 3 now
  opens on a streamed Khronos BoomBox** instead of the Damaged Helmet the museum
  already shows, the picker leads with the assets people recognise, and a model
  that cannot be streamed falls back to the bundled scene with a note instead of
  a dead page. No new binaries.
- **`bench-results/` carries a README explaining that it is not a time series**,
  and `bench.html` now dates its scene labels (`museum-2026-07`) and records
  what each key meant. The existing files key three different rooms as `"room"`
  and read as a 7× regression that never happened.

- **Scattering: physically-parameterized translucent solids (Kubelka-Munk
  two-flux).** Jade, wax, marble and alabaster, soap, milky plastic, foliage,
  lampshades — the material class a real-time renderer normally fakes with an
  authored **thickness map**, which stops being right the moment the object
  deforms, is sliced, or is seen from a new angle. Give a material an absorption
  coefficient **K** and a scattering coefficient **S** and the renderer measures
  how far each view ray actually travels inside the real geometry, then solves
  the two-flux equations for that thickness. A sphere thins correctly toward its
  silhouette and a shell wall brightens where it is seen obliquely, with nothing
  baked and nothing painted. New option/property `rt.kmScattering`, **default
  off**; opt in per material with `userData.rtScattering` (`{ coefficient }` in
  1/world-unit, or the same `{ color, distance }` pair absorption already uses).
  K is the material's existing `attenuationColor` + `attenuationDistance`, so a
  material still states its colour in one place.
  - **Why it matters, concretely.** Absorption alone can only ever REMOVE light,
    so a pigmented translucent body lit from the front renders as black murk —
    nothing sends the light back out of the surface. Scattering does, and the
    closed form gives both a reflectance and a transmittance. The museum's new
    exhibit is the A/B: two spheres with identical geometry and identical K,
    differing by one `userData` line, and a lamp whose cast-stone shade goes from
    murky glass to warm alabaster.
  - **It is invertible, which is the point of a physical parameterization.** For
    a body thick enough to hide its backing, `R_inf = 1/(a + b)` rearranges to
    `K/S = (1 - R)^2 / (2R)`: choose the colour the material should be when
    thick, read off K/S, pick S for how fast it gets there, and the thin parts
    follow. The maths is exported (`kmReflectance`, `kmReflectanceInfinite`,
    `kmStackRGB`, ...) so this can be done in a tool or at build time.
  - **NOT volumetric lighting.** Fog and god-rays are light scattering BETWEEN
    objects (`volumetrics`); this is transport INSIDE solid bodies. Unrelated
    features.
  - **Zero new resources.** No new sampler (this pass is at the WebGL2
    16-sampler minimum — S rides a new row 68 of the existing scene-data
    texture), no new uniform, no new `traceRadiance` call site, and **no new BVH
    traversal**.
  - **The design the feature shipped from does not compile, and that is the
    story.** The natural implementation is a dedicated ordered march along the
    view ray composing an arbitrary layered stack — the same machinery coloured
    shadows use. It was written, it works, and NVIDIA's native-GL assembler
    rejects the megakernel with `error: too many temporaries`, the
    register-pressure sibling of the `C5041` failure that killed a 0.9.0
    shadow-march optimisation. Bisected on the GPU rather than guessed at:

    | build | generated NV assembly | links |
    |---|---|---|
    | full feature, dedicated view march | 35 319 lines | no |
    | same, shadow-side maths removed | 33 403 lines | no |
    | same, march compiled but never called | — | yes |

    So the march's own BVH traversal is the blocker and shrinking the surrounding
    arithmetic cannot buy it back — a 5% reduction in emitted assembly moved
    nothing. Reusing `shadowTransmittance` for the view ray is *worse*: it is
    already inlined at roughly EIGHT effective sites (main's direct loop, and
    again inside every `traceRadiance` site by way of `sampleOneAny`), so a third
    explicit call adds a ninth traversal, and anything added to its loop body is
    paid for eight times over. The shipped version evaluates the layer where the
    shader already computes an in-medium view chord, inside `glassRadiance`.
    Cost: **one medium along the view path** instead of an arbitrary stack (the
    shadow path still marches through stacks correctly). The layered composition
    survives in `src/kubelkaMunk.js` and its self-test, ready for a pass with
    register room to spare.
  - **An exact thickness correction the absorption path never needed.** That
    chord is measured from a point `2 x eps` INSIDE the entry surface, so it
    under-reports by `2 x eps / |rd.N|` — a fixed ~7 cm in a room-sized scene,
    which is HALF the wall of a cast shade. Negligible when you are computing a
    tint; fatal when you are computing a reflectance.
  - **Numerics, because fp32 meets every degenerate corner inside one ordinary
    sphere** (the centre is a long chord, the silhouette a vanishing one). `coth`
    diverges as `b*S*t -> 0`, `sinh`/`cosh` overflow as it grows, and `a - b` is
    a difference of two nearly-equal large numbers when the medium barely
    scatters. Every expression is the stable rewrite: `exp(-2x)` forms instead of
    `sinh`/`cosh`, `1/(a + b)` instead of `a - b`, `sqrt((a-1)(a+1))` instead of
    `sqrt(a*a - 1)`. The series branches the textbook needs were removed
    entirely by FLOORING `b` — because `x` is computed as `b*(S*d)` with the same
    floored `b`, the ratio `x/b` stays exactly `S*d` and every limit falls out of
    the exponential form alone. That deleted a `step()`, two branches and their
    live registers, which is what let the feature fit at all.
  - **Zero cost when unused, provably.** Source splice, not `#ifdef`: a third
    marker tag `RT_KM` gives a fourth cached variant, a LADDER rather than a
    matrix (each variant is the next with its outermost feature stripped). With
    `kmScattering: false`, or no material carrying `userData.rtScattering`, the
    generated fragment source is **byte-identical** to 0.9.0's — SHA-256 checked
    against a `master` checkout by the new `npm run test:km` (plain 52 378 B
    `sha 44d6be4e`, absorption-only 55 257 B `sha 1804cf41`, absorption +
    coloured shadows 61 321 B `sha 13a75103`, all three matching). Stripping
    order is now load-bearing and documented: `RT_KM` blocks nest inside the
    coloured-shadow one, and `stripMarked` tracks a single boolean, so the
    innermost tag must be stripped first.
  - **`npm run test:km`** also runs 23 numeric checks on the analytic reference
    with no GPU and no browser: the `S -> 0` degrade to Beer-Lambert, the
    `t -> infinity` approach to `R_inf` from BOTH sides, the `coth` guard at tiny
    `b*S*t`, `Rg = R_inf` as a fixed point, channel independence, a 1344-case
    finiteness sweep, and the equivalence of the closed-form `R(t, Rg)` with the
    forward "adding" composition. That last one is load-bearing and it earned its
    place immediately — it caught a first-order truncation in the small-`x`
    transmittance branch (1.9e-7 -> 4e-14).
  - **Validation rig: `scattering.html`.** Pixels against the analytic model, not
    against taste. A pigment of known K and S is divided by a white Lambert patch
    under the same directional light, which cancels exposure, intensity and units
    exactly and leaves `R`; contaminants are removed by construction rather than
    corrected for (black backdrop, directional light, GI off, specular off), and
    ACES + gamma are inverted exactly.

    | slab | chord | measured R (r/g/b) | analytic R | error |
    |---|---|---|---|---|
    | 10 mm | 11.2 mm | 0.222 / 0.242 / 0.234 | 0.223 / 0.244 / 0.237 | −0.6 / −0.9 / −1.4% |
    | 20 mm | 22.1 mm | 0.317 / 0.370 / 0.353 | 0.321 / 0.377 / 0.357 | −1.5 / −1.8 / −1.0% |
    | 40 mm | 44.1 mm | 0.388 / 0.512 / 0.468 | 0.394 / 0.514 / 0.467 | −1.4 / −0.4 / +0.1% |
    | 80 mm | 88.8 mm | 0.419 / 0.605 / 0.528 | 0.418 / 0.608 / 0.525 | +0.2 / −0.4 / +0.5% |
    | 160 mm | 181 mm | 0.419 / 0.628 / 0.528 | 0.420 / 0.639 / 0.536 | −0.3 / −1.8 / −1.6% |

    The residual is at the 8-bit readback floor (one code step is ~1–4% of a
    linear value up there), and the CURVE SHAPE — monotone rise converging on
    `R_inf` = 0.420 / 0.642 / 0.537 — is the assertion that cannot be faked by
    exposure.
  - **Curved geometry, and a finding.** Phase 2 probes a sphere centre-to-rim,
    where the thickness is authored nowhere and is simply what the geometry gives
    the ray. It needed its OWN, much weaker pigment, because **a refracting
    sphere's chord does not go to zero at the rim**: grazing rays bend inward, so
    the internal angle tops out at `asin(1/n)` and the chord floors at
    `2R*sqrt(1 - 1/n^2)` — about 75% of the diameter at ior 1.5. The visible disc
    spans only a 34% thickness range, and at the slab pigment's `S = 30` every
    probe reads `R_inf`: a flat profile that would LOOK like a pass while testing
    nothing about thickness.

    | b/R | chord | measured R (r/g/b) | analytic R | error |
    |---|---|---|---|---|
    | 0.00 | 500 mm | 0.181 / 0.277 / 0.229 | 0.183 / 0.281 / 0.232 | −1.1 / −1.5 / −1.1% |
    | 0.30 | 490 mm | 0.179 / 0.273 / 0.226 | 0.182 / 0.278 / 0.230 | −1.5 / −1.7 / −1.7% |
    | 0.55 | 465 mm | 0.176 / 0.264 / 0.221 | 0.179 / 0.271 / 0.225 | −1.8 / −2.3 / −2.1% |
    | 0.75 | 433 mm | 0.170 / 0.248 / 0.210 | 0.176 / 0.260 / 0.219 | −3.5 / −4.5 / −4.1% |
    | 0.90 | 400 mm | 0.160 / 0.229 / 0.196 | 0.172 / 0.248 / 0.211 | −6.9 / −7.7 / −7.1% |

    Monotone falloff with the chord, tracking the analytic prediction; the error
    grows toward the rim where partial pixel coverage and the un-modelled Fresnel
    reflection both bite. Zero blown or NaN pixels across the whole 51 529-pixel
    silhouette scan — the guards hold at the degenerate end.
  - **Cost — and the surprise is that there almost isn't one.** Fence-timed
    medians on an RTX 3060, museum scene, 1280x720 canvas at `renderScale 0.5`,
    full stack (GI + emissive + reflections + refraction), ONE foregrounded page
    at a time (two live WebGL contexts contend, and a backgrounded one times
    nonsense — the 0.9.0 notes record 27 ms for work that read 71 ms in front):

    | leg | `restir: true` | `restir: false` |
    |---|---|---|
    | (a) master baseline | 47.31 ms | 56.89 ms |
    | (b) feature branch, nothing scatters | 47.14 ms | 56.80 ms |
    | (c1) exhibit present, absorption only (0.8.0 program) | 51.76 ms | 61.69 ms |
    | (c2) exhibit present, + coloured shadows (0.9.0 program) | 59.13 ms | 81.50 ms |
    | (d) exhibit present, **scattering on** | 59.38 ms | 81.56 ms |
    | **(b) − (a)** off-state | **−0.17 ms** | **−0.09 ms** |
    | **(d) − (c2)** scattering, isolated | **+0.25 ms** | **+0.06 ms** |
    | **(d) − (c1)** what a user actually pays | **+7.62 ms** | **+19.87 ms** |

    The isolated cost is **inside the noise**, against a pre-registered budget of
    +5 ms — because the design the register ceiling forced also turned out to be
    the fast one. Scattering adds no rays and no traversals; it is arithmetic
    hung on a chord the shader was already computing, and a handful of guarded
    branches on the shadow march. What a user actually pays coming from a
    non-shadowed baseline is (d) − (c1), and **that is coloured shadows**, not
    this feature: the KM variant is a superset, so enabling it enables the
    shadow march. (c1) − (b) is 4.6 / 4.9 ms of exhibit GEOMETRY — more
    triangles and more glass pixels on screen — not feature cost at all.
  - **Limitations, stated because they are the difference between this and
    subsurface scattering.** **No lateral bleed**: this is 1-D transport along
    the ray, light leaves where it entered, so a thin edge does not glow from
    light that entered elsewhere. **No in-scattering into shadow rays**: a lit
    body does not add light to its own shadow. **`R` is used as a diffuse albedo
    under `N.L`** — the standard approximation (Kubelka-Munk derives `R` under
    diffuse illumination), exact in the ambient limit, slightly over-bright at
    grazing incidence. **One medium along the view path** (above). **Requires
    `refraction: true`**, for the same structural reason. **Bodies thinner than
    `2 x eps` cannot resolve their own exit face**, which is why the demo's shade
    is cast stone with a 14 cm wall rather than fabric.
  - **Demo: "Alabaster".** A reading lamp on a side table in the front-left
    gallery, hidden until the new **"scattering (Kubelka-Munk)"** toggle. One
    object carries both halves of the feature: the shade's outside is lit by the
    room and shows the two-flux reflectance over its own wall thickness, while
    the bulb inside lights the table THROUGH that wall by the two-flux
    transmittance. Beside it, two spheres identical in geometry and in K,
    differing only by one `userData.rtScattering` line — with the feature on the
    left stays a dark green glass marble and the right becomes jade. The toggle
    borrows ReSTIR the same way "tinted shadows" does (the reservoir path shades
    primary direct light with one BINARY visibility ray, so the transmitted half
    would otherwise never reach the table); both toggles now share one COUNTED
    lease instead of each stashing a private copy, because either can be switched
    while the other is on.
  - **`rt.eps` is a constructor option, not a property** — the auto-scaler is
    armed by `options.eps == null`, so a later assignment is silently overwritten
    on the next compile. The validation rig hit this first time out (the auto
    value put the refraction entry point below a 10 mm slab entirely, which read
    as a black tile); now documented at the call site and in the README.

## 0.9.0 — 2026-07-26

- **Museum demo reorganised into zoned galleries.** Materials pieces (sphere
  bench, gold knot, teapot, vertex-painted ico) consolidated back-right; the
  physics drop pad and the fox share a dynamics corner; the centre floor is
  cleared for the new **"Lumiere"** freestanding stained-glass screen — a 3x3
  grid of absorbing glass tiles with a projector spotlight behind it, revealed
  by the "tinted glass" toggle. With "tinted shadows" on, the beam lays a
  nine-tile colour quilt on the floor; off, the same beam casts a flat dark
  rectangle — the feature's live A/B. Nothing floats: every exhibit is seated
  or visibly wall-mounted (audited programmatically; the wall panes gained
  bronze standoff pegs, the OPEN sign a stand, and the helmet no longer sinks
  0.33 m into its plinth). Turning "tinted shadows" on visibly unchecks ReSTIR
  (reservoir visibility is still binary, so the effect is invisible with it
  on); a manual ReSTIR click always wins, and the previous state is restored
  when the toggle goes off.

- **Coloured shadows: shadow rays through absorbing glass are attenuated, not
  blocked.** A shadow ray crossing a glass material that carries a Beer-Lambert
  σ (0.8.0's `attenuationColor` + `attenuationDistance`, or
  `userData.rtAttenuation`) is now multiplied by `exp(−σ·d)` per RGB channel over
  the distance it spends inside, instead of being occluded outright. Stained
  glass spills tinted light; a lightbox behind stacked translucent bodies now
  **lights** what is in front of them instead of rendering as a black silhouette
  (the 3D-print preview case, where 90-95% of pixels are multi-body stacks);
  clear glass — a glass material with no `attenuationDistance` — stops casting a
  shadow at all, which is the physically right answer and one 0.8.0 could not
  express. New option/property `rt.absorptionShadows`, default `true`,
  meaningful only when the compiled scene has an absorbing material.
  - **An ORDERED closest-hit march with a current-medium state machine**, capped
    at 8 interface events. Deliberately **not** the cheaper unordered any-hit
    signed sum (+σ on front faces, −σ on back faces): real multi-body geometry
    contains body-to-body interfaces where only ONE of two coincident walls
    survives, so entry/exit events do not pair and a signed sum goes **negative**
    — optical gain, bright halos. The march cannot produce negative optical depth
    however unbalanced the interfaces are. Hitting the event cap returns the
    transmittance accumulated so far: a slightly-off tint, never a black
    silhouette. Optical depth is charged **interface to interface**, not from the
    stepped-off ray origin — the difference is the `2 x eps` skipped past each
    hit, which measured as a 10-15% under-attenuation of a 4 cm slab and rather
    more in scenes whose auto-scaled epsilon is larger.
  - **Scope, v1 — the two next-event shadow rays only** (analytic point / spot /
    directional lights, and emissive-mesh area lights). Explicitly NOT: the
    **ReSTIR visibility ray** (so with `restir: true`, the default, primary
    direct light is still binary-shadowed — a real energy mismatch between the
    reservoir path and the NEE path, documented rather than hidden), the
    volumetric march's occlusion samples, and refraction (shadow rays are
    straight segments). Any `transmission > 0` material is fully transmissive to
    shadow rays; `transmission: 0.5` does not half-block. The view path is
    unchanged.
  - **Zero new resources.** No new sampler (this pass is at the WebGL2
    16-sampler minimum), no new uniform, no new `traceRadiance` call site, and
    exactly ONE textual call to the closest-hit kernel inside the march
    (`traceBoth`, reused by the loop) to keep the inlined footprint small. The
    "is this glass to a shadow ray" flag is the material's transmission, written
    into row 67's previously-unused `.w` channel — a channel that was already
    allocated, so it costs nothing. **This budget is real, not theoretical:** an
    experimental any-hit fast path added inside the march (a pure, exact
    short-circuit) failed to link on NVIDIA native GL with
    `C5041: cannot locate suitable resource to bind variable "@_ustack..."` —
    four inlined BVH traversal stacks in one call frame is over the driver's
    budget. It was reverted; the shipped march has two.
  - **Zero cost when unused, provably.** Source splice, not `#ifdef`:
    `stripAbsorption` generalised to `stripMarked(src, tag)` over a second
    `RT_ABSORB_SHADOWS` marker pair, giving three cached variants (plain /
    absorption / absorption+shadows). With no absorbing material, or with
    `absorptionShadows: false`, the generated fragment source is
    **byte-identical** to master's — proved twice: at the module level against a
    master worktree (plain 52 378 B `sha 44d6be4e...`, absorption-only 55 257 B
    `sha 1804cf41...`, both matching) and **live** via `getShaderSource` on the
    running program (54 118 B and 56 997 B after three's preamble, both
    matching). Frame-time difference on the off-paths: **−0.03 ms** and
    **+0.05 ms**, i.e. nothing. Every call site is add-lines-only — the existing
    `occluded()` line survives the strip untouched and is disabled in the spliced
    variant by a constant-false branch rather than by editing it.
  - **Cost — this one is NOT free, and the README says so.** Fence-timed medians
    on an RTX 3060, museum, 1280x720 at `renderScale 0.5`, full stack
    (GI + emissive + reflections + refraction), single foregrounded page,
    alternating master/feature navigation:

    | leg | `restir: true` | `restir: false` |
    |---|---|---|
    | (a) master baseline | 67.20 ms | 78.17 ms |
    | (b) feature, no absorbing material | 67.17 ms | 78.21 ms |
    | (c) tinted glass on, `absorptionShadows: false` | 68.82 ms | 79.85 ms |
    | (d) tinted glass on, `absorptionShadows: true` | 82.65 ms | 108.54 ms |
    | **(d) − (c)** | **+13.83 ms** | **+28.69 ms** |

    `restir: false` is the honest column — that is the configuration in which the
    feature acts on primary direct light, and there it costs about a third of the
    frame. Profiling with the event cap forced to 1 attributes ~21 ms of the
    28.7 ms to the any-hit -> closest-hit swap **alone** (a bounded, unordered,
    early-outing traversal replaced by an unbounded ordered one, on every NEE
    shadow ray) and the rest to marching past glass interfaces. The cost
    therefore scales with shadow-ray count, not with how much glass is on screen.
    There was no pre-registered gate for this number; it is reported, not buried.
    An interleaved two-tab measurement rig was discarded first — a backgrounded
    WebGL context timed 27 ms where the same work read 71 ms in front.
  - **Demo:** a **"tinted shadows"** sub-toggle under **"tinted glass"**, bound
    to `rt.absorptionShadows` and nothing else, so the fps delta beside it is the
    shadow march's isolated cost. The note under it names what the effect needs
    (ReSTIR lights off, emissive area lights on) rather than silently flipping
    them. With the piece revealed in a dimmed room the Sunset backlight now
    lights the bronze frame's inner cheek amber and lays a warm halo on the red
    wall; with the sub-toggle off, both go black
    (`.shots/colored-shadows-museum.png` and its `-off` counterpart).
  - **Regression rig:** `absorption.html` grows a phase 2 and 3. Phase 1 is
    untouched (the new meshes start hidden, so the compiled scene is exactly what
    it was) but gains a **quantitative** backlit assertion: the covered panel over
    the uncovered one in **scene-linear** radiance (ACES and the 1/2.2 gamma are
    inverted exactly) versus `exp(−σ·d)` over the Snell-refracted chord, with the
    Fresnel share divided out and the additive leak **measured** on amber's
    analytically-transparent red channel rather than assumed — plus the
    geometry-free invariant `tau_B/tau_G = sigma_B/sigma_G` (2.213 measured vs
    2.319 analytic). Phase 2 is the new stack case: two overlapping slabs 8 m
    under a small lamp throwing amber, blue and their product onto a white floor
    coplanar with the lightbox (so the lightbox, a huge emitter, contributes
    exactly zero). Slab thickness equals `attenuationDistance`, so each slab's
    analytic transmittance IS its `attenuationColor`. Measured vs analytic:
    amber +0.2/+1.3/+1.9%, blue +2.9/−0.4/+0.9%, overlap +3.3/+3.2/+4.6%
    (tolerance 10%); the **product** assertion — overlap vs measured-amber x
    measured-blue — lands +0.1/+2.2/+1.8% (tolerance 8%). Phase 3 is the A/B
    control: the same frame with `absorptionShadows: false` must put every
    covered column back in hard shadow (max ratio 0.014). The rig is what caught
    the interface-to-interface bookkeeping bug above.
  - **Outstanding: WebKit/iPad verification.** Playwright's Windows WebKit has no
    usable WebGL2 here and is not Apple's Metal stack, so the one engine whose
    GLSL->Metal codegen has broken this megakernel before (the 0.4.0 fourth
    `traceRadiance` call site) is untested with the march compiled in. The NVIDIA
    `C5041` failure above shows the inlining budget is genuinely close. Verify on
    a real iPad with the feature ACTIVE before release.

## 0.8.0 — 2026-07-25

- **Per-material Beer-Lambert absorption — tinted glass done right.** Light
  crossing a glass material's interior is now attenuated `exp(−σ·d)` per RGB
  channel over the **in-medium path length**: a thick slab of the same amber
  tints deeper than a thin one, thickness compounds exponentially, and a
  **backlit** pane glows in the filtered colour for free (an emissive surface
  seen through glass rides the refracted view segment, which is exactly the
  segment being attenuated). Games get tinted bottles, ice, stained glass and
  display cases; the sibling 3D-print project gets translucent stack previews.
  - **Opt-in, three.js-native.** A glass material (`transmission > 0`, not
    `transparent`) with a **finite, positive** `attenuationDistance` and an
    `attenuationColor` (the colour that survives one such distance) absorbs
    with `σ = −ln(attenuationColor) / attenuationDistance` per channel
    (channels floored at 1e-4, so pure black stays finite). three's own default
    `attenuationDistance: Infinity` means "off", which makes the finite value
    the explicit opt-in — nothing changes for existing scenes.
    `userData.rtAttenuation = { color, distance }` is the identical control for
    materials without the physical fields; it wins when both are present, and
    warns (rather than silently mis-rendering) when malformed or set on a
    non-glass material. Recompile after changes, like any material edit.
  - **Where it acts.** The one place the shader already computes an in-medium
    distance: the glass path's entry-to-exit refracted chord in the lighting
    megakernel. The transmitted term (surface shading, emissive glow, sky —
    whatever came back through the exit interface) is multiplied by the
    transmittance; the Fresnel reflection half never entered the medium and is
    untouched. The medium is identified by the **exit** interface's material,
    correct for closed glass volumes (an open sheet's exit lands on a sigma-0
    surface and attenuates nothing — no false tinting over air).
  - **Zero cost when unused, provably.** σ rides a new **row 67** of the
    existing scene-data texture (1 texel per material, appended — both row-0
    material texels were fully packed and every consumer addresses rows by
    absolute constants, so nothing existing moved). No new sampler (the pass
    sits at the WebGL2 16-sampler minimum), no new uniform, and **no new
    traceRadiance call site** (the WebKit/Metal budget). The shader code is
    gated by **source splice, not an `#ifdef`**: when the compiled scene has no
    absorbing material the marked lines are stripped and the program source is
    **byte-identical** to the pre-feature build — verified with a
    `getShaderSource` diff against a v0.7.0 checkout, plus a bit-identical
    400-frame museum render (mean per-pixel diff 0.0). Fence-timed A/B on the
    museum (RTX 3060, 720p canvas): absorption-on vs same-scene-absorption-off
    measured **below the noise floor** at both lighting scales (−0.09 ms @0.5,
    −0.34 ms @1.0, interleaved medians; spreads ±0.2/±0.4 ms).
  - **Demo: "tinted glass" toggle + the "Sunset" cast-glass relief.** A backlit
    shadow-box on the museum's red wall, beside the blue alpha pane (the pair
    contrasts the out-of-BVH blend trick with real refractive glass): a warm
    emissive panel behind a 4×4 grid of chunky cast-glass blocks whose
    **thickness is the palette** — the same amber reads pale at 10 cm and burnt
    orange at 24 cm. The piece and its absorbing materials compile in/out WITH
    the toggle, so OFF really is today's program and flipping it while watching
    the fps readout is the feature's live cost A/B. Turning it on brings
    refraction with it.
  - **Regression rig: `absorption.html`.** Slabs on an emissive lightbox
    (self-lit, so the readout is `Le · exp(−σ·d)` uncontaminated by the
    engine's opaque glass shadows): a ×2 thickness staircase must darken and
    saturate monotonically, a blue-on-amber stack must differ from (and
    undercut) its lone slabs, a backlit panel must glow through amber visibly
    but tinted vs an uncovered reference, all with zero GL errors and clip-free
    probes. Asserted automatically into `#absorption-verdict`.
  - **Honest limits** (also on the README matrix row): tinted transmission
    only, no scattering; closed volumes; glass still occludes shadow rays
    fully (no coloured shadows); one in-medium layer per view path (a stack's
    second body resolves via the single behind-trace as a lit surface); media
    thinner than ~`2 × rt.eps` cannot resolve an exit interface.

## 0.7.0 — 2026-07-25

*(0.7.0 candidate. Also carries the volumetric-albedo entry further down, which
landed on master unreleased.)*

- **Usage diagnostics: `rt.status.warnings`.** A hybrid tracer's worst failure
  mode is the *silent* one — the image renders, nothing throws, and the lighting
  is quietly computed against a scene that isn't the one on screen. The renderer
  now detects the common integration mistakes, prints **one** `console.warn`
  naming the object and the exact fix, and records the same thing as
  `{ code, message }` on the new `status.warnings` array (deduplicated).
  **`status.ok` is unaffected** — these are scene-setup diagnostics, not pipeline
  failures, which keeps the 0.6.1 compile-failure surface (`ok` / `disabled` /
  `coreFailure`) meaning exactly what it meant before. `compileScene()` also
  returns them on the compiled scene (`compiled.warnings`), so the standalone
  export reports too. Documented under *Diagnostics* in the README, with a
  troubleshooting section for the symptoms people actually search for ("black
  patches", "the shadow doesn't move", "still hit the original shape").
  - `stale-geometry` / `stale-transform` — a **static** mesh whose `position`
    buffer changed, or which was moved, after `compileScene()`. This is the
    stale-BVH bug (rasterized image shows the new pose, traced lighting still
    shadows/bounces off the old one) and it was completely silent before. The
    compiler fingerprints every static source mesh (a `WeakRef`, its position
    attribute's `version`, and a `Float64Array` copy of `matrixWorld.elements`);
    `render()` re-checks them on **every 30th frame**, stops checking a mesh once
    it has reported, and caps at 8 reports — no allocation, no measurable
    per-frame cost, and no strong reference to the app's meshes.
  - `rtdeforming-not-dynamic` — `userData.rtDeforming` set on a mesh that is not
    in `dynamicMeshes`. The flag was silently ignored (the mesh compiled static);
    it also meant a *grouped* mesh with the ignored flag skipped the
    groups+deforming throw, so the combination looked supported. The README's
    multi-material-groups row now says the throw applies to the flag **plus**
    membership, which is what the code always did.
  - `implicit-compile` — `render()` compiled the scene itself because no
    `compileScene()` call preceded it. That path takes no options, so everything
    is static and `updateDynamic()` has nothing to update.
  - `untraceable-object` — a visible `Sprite` / `Line` / `Points`.
  - `instanced-mesh` — an `InstancedMesh` (collapses to a single instance).
  - `transparent-dynamic` — a `transparent` mesh listed in `dynamicMeshes`, which
    does nothing (transparent meshes are dropped before dynamic registration).
- **Sprite / Line / Points are excluded from the G-buffer (bug fix).** Their
  materials write a single `gl_FragColor`, and rendering one into the G-buffer's
  4-attachment MRT framebuffer is a `GL_INVALID_OPERATION` — an ESSL1 fragment
  shader cannot feed multiple draw buffers. The G-buffer pass now **hides** such
  objects for the duration of its draw and restores their `visible` flag right
  after (the same save/restore discipline it already used for material swaps), so
  a scene with a HUD sprite no longer errors. They were never traceable geometry
  either — the BVH compiler always skipped them — so this makes the two halves
  agree, and the accompanying `untraceable-object` warning tells you to draw them
  in your own overlay pass on top of `rt.render()`. `userData.rtExclude` silences
  the warning. The new `?selftest=warnings` leg asserts **zero GL errors** across
  frames with a `Sprite` and a `Line` visible.
- **Adaptive quality now works below 10 fps (bug fix).** `_adaptQuality` bailed
  out of any frame longer than 100 ms, on the theory that such a frame is a
  hidden-tab stall. The result was a **dead zone**: a device steadily rendering at
  2.5–10 fps fed the governor *no samples at all*, so it never adapted — and
  `_overloadBrake`, the only other safety net, needs three consecutive frames over
  400 ms. The exact devices that most need dynamic resolution scaling were the
  ones that never got it. Hidden tabs are now excluded properly (a
  `document.visibilityState === "hidden"` check that resets the timer, mirroring
  `_overloadBrake`), only frames over **2 s** are discarded as genuine
  stall/resume, and everything from 100 ms to 2 s feeds the EMA. Because a single
  very slow sample can now imply a huge correction, one adaptation may move
  `renderScale` by at most `MAX_SCALE_STEP` (0.25 — five ladder steps); the
  cooldown takes the next step if the device is still slow. `_overloadBrake` is
  unchanged.
- **Render self-test:** new gating `?selftest=warnings` leg (chromium) that drives
  a deliberately mis-configured scene and asserts each diagnostic fires **exactly
  once** across ~100 frames, that `status.warnings` carries the expected codes,
  that `status.ok` stays true, and that the visible `Sprite`/`Line` produces zero
  GL errors. The healthy `?selftest=1` verdict now reports `warnings` /
  `warningCodes` and its pass gate **requires `warnings === 0`** — so a diagnostic
  that starts false-positiving on a correct scene fails the suite. (It caught one
  immediately: snapshotting `matrixWorld` into a `Float32Array` rounded three's
  doubles enough that 36 of the demo's 41 static meshes read as "moved".)
- **README:** new *Diagnostics* + *Troubleshooting* sections; a
  *Supported object types* table (`Mesh` / `SkinnedMesh` / `InstancedMesh` /
  `Sprite`·`Line`·`Points` / `rtExclude`); first-ever documentation of
  **`canvasScaleHook`** (with the CSS-stretch recipe and the `taaJitterScale`
  rule) plus a *Recommended integration* block wiring `detectTier()` →
  `recommendedOptions()` → `adaptiveQuality` + `canvasScaleHook`; an `alphaMap`
  row in the materials table (unsupported — opacity is a scalar per material);
  `targetFps` / `canvasScaleHook` / `taaJitterScale` in the options table; and
  three additions to the transparency notes (the blend-behind radiance is a
  genuinely traced ray, only BVH geometry shows through so an intermediate
  translucent layer disappears when covered, and behind-radiance bypasses the
  firefly/irradiance clamps so emitters read hotter through glass).

- **World-space 3D-texture albedo (`userData.rtVolumeAlbedo`) — "volumetric
  surface albedo".** A material can now be coloured by a **3D texture sampled at
  the world-space ray hit point** instead of a flat colour or a 2D UV map — the
  path-tracer-native way to paint a **volumetric data field** (stress,
  temperature, density, a distance field) onto a surface, where a custom fragment
  shader can't run. Opt in with
  `material.userData.rtVolumeAlbedo = { texture, origin, size }` (an
  already-colour-mapped `THREE.Data3DTexture` plus a world→texture transform:
  `origin` = world position of the texel-(0,0,0) corner, `size` = the volume's
  world extent). At the hit point `p` the tracer computes
  `uvw = clamp((p - origin) / size, 0, 1)` and samples the texture **trilinearly**
  (Linear + ClampToEdge are set on the texture at compile time), and the sampled
  RGB **replaces the base albedo** — `roughness` / `metalness` / `emissive` still
  compose normally. The substitution runs in **both** the G-buffer (primary
  visibility, so raster/hybrid views agree) **and** the traced GI / reflection
  bounces (so the field's colours bleed correctly through global illumination).
  The library samples `.rgb` directly and contains **no colormap logic** — the
  caller supplies the colours. RGBA8 works (no float-texture filtering required).
  Updating the texture *data* (an animated field) needs only
  `texture.needsUpdate = true`; changing which material carries it, or its
  `origin` / `size`, needs a `compileScene()`.
  - **Off-by-default, byte-identical when unused.** The entire GLSL is behind a
    compile-time `RT_VOLUME_ALBEDO` define, injected only when a scene registers a
    volume material. Scenes that don't use the feature compile the **exact same**
    G-buffer and lighting programs as before (no extra sampler, no extra branch);
    the render self-test's gallery scene is unchanged (`meanLum ≈ 139.8`,
    `rtPrograms = 15`, `statusOk`).
  - **Single-volume in the bounce path (v1); unlimited in primary visibility.**
    The lighting megakernel already binds the WebGL2-guaranteed minimum of **16**
    fragment samplers, so the bounce path's `sampler3D` (the 17th) is compiled in
    only when the GPU exposes ≥ 17 fragment texture units (`MAX_TEXTURE_IMAGE_UNITS`
    — most desktop GPUs report 32). On a 16-unit device the GI/reflection bounce
    falls back to the material's flat base colour (one-time `console.info`) while
    the G-buffer still shows the full field. The G-buffer path is per-mesh, so
    **distinct volumes each render correctly in primary visibility**; only the
    traced bounce is limited to the first volume. Multi-volume bounces are future
    work — the `userData` API doesn't preclude them.
  - **New demo page** [`volumetric-albedo.html`](volumetric-albedo.html): a torus
    knot coloured by a procedural 3D noise field (turbo colormap) under an emissive
    area light, its colours bleeding onto white walls through GI. Wired into the
    vite build inputs and `npm run deploy`.
  - Typed in `src/index.d.ts` (`VolumeAlbedo` interface + `CompiledScene.volumeAlbedo`).

## 0.6.1 — 2026-07-23

- **Compile-failure status + graceful degradation (`rt.compileError` /
  `rt.status`).** A pass whose program fails to *link* renders black without
  throwing (three logs and sets `program.diagnostics.runnable = false`, but
  rendering proceeds), which is exactly how the r166+ `luminance` break looked
  from the outside — indistinguishable from `supported: false`. Every pass
  `ShaderMaterial` now carries a stable `name` (`rt:lighting`,
  `rt:restir-temporal`, `rt:restir-spatial`, `rt:gi-reservoir`, `rt:denoise`,
  `rt:taa`, `rt:volumetric`, `rt:gbuffer`, `rt:composite`, plus `rt:specular` /
  `rt:taa-copy` / `rt:history-carry` helpers), and over the first several
  rendered frames the renderer scans `renderer.info.programs` for failed `rt:*`
  programs (polled, not frame-1-only, since three checks link status lazily and
  can defer it under `KHR_parallel_shader_compile`). On a failure it either
  **auto-disables the mapped optional feature** so the image stays lit
  (`restir` → non-reservoir direct path, `restirGI`/`denoise`/`volumetric`/`taa`/
  `specular` → off) and `console.warn`s once with the pass name + driver log, or,
  for a **core** pass (gbuffer/lighting/composite) with no fallback, records it
  and keeps rendering the now-diagnosed black frame. Results are surfaced as
  `rt.compileError` (`string | null`, first/most-severe summary) and `rt.status`
  (`{ ok, disabled: [{ pass, feature, reason }], coreFailure }`), so an integrator
  can render an honest `raster (reason)` fallback. Typed in `src/index.d.ts`; the
  render self-test now asserts `rt.status.ok` on the healthy path.
- **Self-test three-version matrix + `three@latest` compatibility.** The
  `luminance` break shipped because nothing tested a newer three, so
  `scripts/selftest.mjs` now runs the chromium leg **twice** — once against the
  pinned `three` (0.160.1) and once against a `three-latest` devDependency
  (`npm:three@latest`) via a second vite with `RT_THREE=latest` (aliased in
  `vite.config.js`; default behaviour is byte-identical). Both chromium legs are
  required to pass. Making the `three@latest` leg green surfaced a second
  peer-range break: three **r172 removed `WebGLMultipleRenderTargets`** (its
  successor is `WebGLRenderTarget({ count })`, whose attachments are `.textures`,
  not an array `.texture`). A small JS shim (`src/mrtCompat.js`, `makeMRT`)
  constructs the right target for the installed three and keeps the library's
  `.texture[i]` call sites working on both — no GLSL touched. Verified green on
  three 0.160.1 **and** 0.185.1.
- **Empty-scene `compileScene` is a no-op.** `rt.compileScene(scene)` on a scene
  with no traceable meshes previously threw (`no meshes found`); it now warns once
  and keeps any previously compiled scene, and `render()` with nothing compiled
  falls back to plain rasterization instead of crashing or drawing black. This
  makes "construct the tracer, then add meshes" a valid call order. Covered by a
  new `?selftest=empty` check in the self-test matrix.

- **Fix: black lighting on three r166+ (`'luminance' : function already has a
  body`).** Since r166, three.js prepends its own `float luminance(vec3)` to the
  fragment shader of every non-raw `ShaderMaterial` (`getLuminanceFunction()` in
  `WebGLProgram`). Our ReSTIR, GI-reservoir, and denoise shaders each defined a
  `luminance` of the same signature, which GLSL rejects as a redefinition — the
  affected programs failed to compile and everything those passes fed went black,
  while `rt.supported` still read `true`. The helper is renamed `rtLum` in all
  three passes (an `#ifndef` guard would not help: three's injected copy is
  unguarded). Verified with the render self-test on three 0.169.0 (fail → pass,
  glErrors 9 → 0, irradiance luminance 0 → 170) and on the pinned 0.160.1
  (unchanged). Found in the field by a molecule-viewer integration on three
  0.169; the library's peer range (`three >=0.155.0`) now actually holds again.

## 0.6.0 — 2026-07-22

- **ReSTIR GI reservoir-sample validation (experimental).** Fixes stale bounce
  light: switch a light off and the reservoirs used to keep bouncing its ghost,
  fading slowly instead of going dark. Every frame a rotating 1-in-N subset of
  pixels (`restirGIValidate`, default `8`, `0` = off) re-aims its single GI
  candidate ray AT the reservoir's stored hit instead of a fresh cosine bounce
  (`dir = normalize(storedHit - P)`) and re-shades it. If the hit distance no
  longer matches the stored one (geometry moved / occluder / miss) OR the re-shaded
  target has collapsed to near-black (the light went off), the reservoir is KILLED
  — the stale temporal term is dropped so the pixel's fresh candidates rebuild from
  the current scene; otherwise it is left untouched. The kill is deferred to the
  STORE (the displayed frame still uses the merged history, so a valid pixel never
  drops out), which keeps a static scene from drifting. The re-shade averages a few
  NEE samples so the kill fires on a real collapse, not on single-sample shadow
  noise. Reuses the single existing candidate trace (no extra bounce rays) and adds
  no samplers; the only added cost is a few shadow rays on the ~1/N validating
  pixels. `restirGIValidate=0` is byte-identical to before the feature. Wired as the
  `restirGIValidate` lib option / live property. (The originally-drafted "refresh
  the stored radiance + rescale W by clamp(pHat_old/pHat_new)" path was implemented
  and measured to darken static GI ~25% — the single-sample re-shade is heavy-
  tailed and the reservoir's radiance is RIS-bright-biased — so the kill-only path
  above is used instead.)

- **Fix: ReSTIR GI speckles on metals.** The external ReSTIR GI irradiance is
  added at the denoise stage, downstream of RTLightingPass's `mix(diffuse,
  reflRad, metal)`, so it never received the `(1 - metalness)` diffuse weight the
  inline GI path gets — metals (the gold torus knot, metalness 0.85) were lit by
  full-strength diffuse GI (~6.6x too much), whose residual per-pixel variance
  read as bright gold speckles on the curved surface (worst on iOS/Metal).
  `DenoisePass` now weights the GI add by `(1 - metalness)` per tap, making the
  ReSTIR and inline GI paths energy-consistent on metals and dropping the speckle
  amplitude with the excess brightness. No new samplers or `traceRadiance` sites;
  the firefly stack is untouched; non-metal surfaces and the non-GI/inline-GI
  paths are byte-identical.

- **Chromatic dispersion for glass (`dispersion`).** A new lib option / live
  property (`0..0.5`, clamped, default `0` = off) splits refracted white light
  into a spectrum — a diamond throws a rainbow. It uses **stochastic spectral
  sampling** to fit the shader's hard three-`traceRadiance` Metal call-site
  budget: each frame every glass pixel picks ONE colour channel `c` in R/G/B
  uniformly, traces the *same single* refraction path with a channel-shifted ior
  (`iorC = ior * (1 + dispersion * shift[c])`, `shift = (+1,0,-1)*0.5`), and
  returns the refracted radiance masked to `c` and weighted `x3`. The temporal
  accumulator blends the three per-channel estimates into a converged rainbow —
  **zero extra rays, zero new call sites, unbiased in the mean**. Only the
  transmitted term is channel-estimated; the Fresnel reflection stays full colour
  every frame (its weight uses the base ior). `dispersion == 0` consumes no extra
  `rand()` and is byte-identical to the pre-dispersion image. Because it relies on
  accumulation it shimmers slightly in motion. Global control only for now (no
  free G-buffer channel for a per-material `MeshPhysicalMaterial.dispersion`).
  Exposed in the demo as a **dispersion** slider in the RT-features panel.

- **ReSTIR GI spatial reuse (v2, experimental).** The `restirGI` pass, shipped in
  0.5.0 as temporal-only, now takes `restirGISpatialTaps` spatial taps (default
  `1`, tuned on-device; clamp `0..4`; `0` reproduces the exact v1 temporal-only
  image) of the
  previous frame's reservoirs after the temporal merge, in a single fused
  spatiotemporal pass — no new passes or ping-pongs. Each adopted neighbour
  sample is reweighted by the reconnection solid-angle→area Jacobian
  `|J| = (cosPhi_q/cosPhi_r)·(d_r²/d_q²)` (clamped to `[0.1, 10]`), gated by uv
  bounds + the temporal plane-distance validation + a non-empty reservoir, and
  finalized with one any-hit visibility ray at the reconnection point so reused
  samples cannot leak light through walls. The reconnection hit normal the
  Jacobian needs is bit-packed into the reservoir-position `.w` alongside `M`
  (8-bit `M` + 12+12-bit octahedral normal), keeping the pass at its 16-sampler
  ceiling. Mean matches taps-`0`; per-frame variance is lower. Wired as the
  `restirGISpatialTaps` lib option / live property.

## 0.5.0 — 2026-07-22

- **Fix: TAA wobble at reduced canvas scale** (`taaJitterScale`). The sub-pixel
  jitter is sized in buffer pixels, so a CSS-stretched reduced drawing buffer
  magnified it into visible screen shake — the lower the quality, the worse the
  wobble. The new property (default `1`) scales the jitter amplitude; the demo's
  canvas-scale hook sets it to the canvas scale so jitter stays constant in
  screen pixels.
- **Render self-test (`?selftest=1`) + CI smoke matrix.** A net for the class of
  failure behind the 0.4.0 iOS incident: a pipeline that compiles clean, reports
  framebuffer-complete, logs no error, and still draws black. The demo's new
  `?selftest=1` mode (`examples/selftest.js`) forces the full lighting stack on
  (GI + emissive NEE + reflections + refraction at 50% lighting), renders the
  standard scene, and after 90 rendered frames reads the drawing buffer back to
  assert the image is actually lit — a centre-25% luminance gate on both the
  composite and the raw irradiance buffer (`outputMode 3`), plus a `gl.getError()`
  gate and the `specMRT` / `supported` fallbacks. It emits one JSON verdict line
  to the console and a `#selftest-verdict` DOM node, and keeps rendering after so
  a human can watch. This mode is the only path that builds the renderer with
  `preserveDrawingBuffer: true`.
- **`npm run test:render`** (`scripts/selftest.mjs`) drives `?selftest=1` through
  Playwright across chromium, firefox and webkit, prints a pass/fail/skip table
  and exits nonzero on any failure. **Caveat, documented in the README:**
  Playwright's `webkit` on Windows is the WPE/GTK build, not Apple's Metal stack,
  so this matrix would NOT have caught the original iOS bug (a GLSL-to-Metal
  codegen failure). It catches API / JS / GLSL-frontend divergence between
  engines; real-device iOS testing stays manual (`?diag=1` / `?nospecmrt=1`).
- **BVH traversal-cost heatmap debug view** (`outputMode: 7`, "bvh cost" in the
  demo's view dropdown). The any-hit shadow-ray traversal now counts the BVH
  nodes it visits into a per-pixel `gBvhVisits` accumulator; the lighting pass
  maps that count through a cold→hot palette (blue = cheap, through green/yellow,
  to red/white = expensive) and writes it into the irradiance buffer instead of
  the accumulated lighting — bypassing temporal blending and the denoiser for a
  raw per-frame snapshot. It teaches where scene geometry is expensive: hot means
  many box tests per shadow ray (dense/overlapping geometry, long thin triangles,
  or rays skimming surfaces). Scale it with the `costScale` option / live
  property (default `1/96`) or the demo's "cost scale" slider. The counter is a
  single integer add per popped node and does not change shading when the view is
  off. No new samplers, and the strict 3-site `traceRadiance` Metal budget is
  untouched (the heatmap only instruments the existing any-hit function).
- **EXPERIMENTAL — ReSTIR GI (v1, temporal-only)** (`restirGI`, default **off**).
  Per-pixel reservoirs reuse the 1-bounce global-illumination sample across
  frames at the reprojected same-surface point (validated like the irradiance
  history). No spatial reuse in v1 — spatial needs the solid-angle→area Jacobian
  and is where implementations go subtly wrong; temporal reuse at the same
  surface point needs none.
  - Runs in a **new standalone pass** (`GIReservoirPass`) at lighting resolution
    with its **own** 16-sampler budget (8 BVH + 2 vertex-attribute + scene-data +
    gWorldPos + gNormalMetal + prevGWorldPos + 2 reservoir-history textures), so
    the lighting pass — already at the WebGL2 16-sampler minimum — is untouched.
  - GI-bounce hits are shaded **identically** to `RTLightingPass.traceRadiance`
    (direct + emissive NEE at the hit, sky/env on a miss), and the RIS estimator
    is derived so the **mean equals the inline GI path** (forcing the M-cap to 1
    with no history is statistically identical to the legacy path). Reservoir
    stores the candidate hit position + M and its radiance estimate + W.
  - When on, the lighting pass **skips its inline GI trace** (new `uExternalGI`
    uniform — not a sampler) and the resolved GI is **added at the à-trous
    denoise stage** (`DenoisePass` gained an optional additive input, guarded so
    it is byte-identical when unused). It is therefore only in effect when `gi`
    and `denoise` are both on. The GI is added downstream of the lighting pass's
    temporal history, so it never double-counts through it; the reservoir is the
    GI temporal integrator (expect a somewhat different convergence character).
  - New `restirGI` option/property (default false, live-toggleable) and demo
    toggle "ReSTIR GI (exp)"; `restirGIMCap` tunes the temporal M-cap (default 20).
- **Material-completeness pass** — three gaps in the material-support matrix closed
  with no new lighting-pass samplers (it sits at the WebGL2-guaranteed 16):
  - **Vertex colors.** A geometry `color` attribute (3- or 4-component; `.rgb`
    used) now multiplies into G-buffer albedo. Gated per mesh via three's
    `USE_COLOR` define — a mesh without a color attribute writes byte-identical
    albedo. Secondary GI/reflection rays keep the flat `material.color` (same
    documented caveat as texture maps).
  - **Per-material IOR.** `MeshPhysicalMaterial.ior` now refracts per material
    instead of only the global `rt.ior`. Audit finding: primary roughness is
    stored twice (`gAlbedoRough.w` **and** `gWorldPos.w`), so `gAlbedoRough.w` is
    dead — but the lighting pass samples only `gWorldPos`/`gNormalMetal` (exactly
    16 samplers), so reading a third G-buffer texture would exceed the guaranteed
    limit. Instead the IOR rides the previously-unused **[3,4) sub-band of the
    packed material word** in `gNormalMetal.w` (which the lighting pass already
    reads): every existing consumer decodes that band as transmission = 1.0 (full
    glass) unchanged, and the lighting pass additionally recovers `ior = 1 +
    (w - 3)`. Range [1.0, 1.98] (the ceiling keeps the word clear of the 4.0
    alpha-blend boundary under fp16 rounding). `rt.ior` stays the global
    fallback; `material.ior` wins when present.
  - **Multi-material groups.** A mesh with `mesh.material` as an array +
    `geometry.groups` now registers **each group's** material separately in the
    G-buffer (an array of gbuffer materials, rendered natively by three) and in
    the BVH (per-vertex material indices de-indexed through `toNonIndexed`
    order); emissive group materials also join the NEE area-light list. Opaque
    groups only (a transparent group throws — split it into its own mesh); not
    supported on CPU-deforming (`rtDeforming`) meshes (throws).
- **Deliberate omission documented:** `clearcoat` / `sheen` / `iridescence` stay
  unmodelled because their per-pixel lobe parameters have no remaining G-buffer
  channel (the 4-MRT WebGL2 guarantee is fully packed) — revisit with a WebGPU
  backend. The README matrix row now says so instead of a bare "Not modelled".
- **Demo:** a vertex-painted low-icosahedron sculpture (baked hue-by-height
  gradient) on a pedestal front-left; the materials-bench glass sphere set to
  diamond IOR (2.42) to show per-material refraction.
- **Skinned meshes — animated characters cast moving traced shadows.** A
  `SkinnedMesh` listed in `dynamicMeshes` is now **auto-detected** (via
  `isSkinnedMesh`, no `userData` flag) and CPU-skinned into the dynamic BVH every
  frame, so a rigged character casts a traced shadow that moves with its gait
  *and* rasterizes in its animated pose instead of the bind pose:
  - **BVH side** (`SceneCompiler`): each frame the mesh's *source* vertices are
    skinned once with three's own `SkinnedMesh.getVertexPosition` /
    `applyBoneTransform` (bind matrix + bone weights/matrices → local space),
    expanded through the de-index mapping into the merged triangle soup, then
    transformed by `matrixWorld` — matching the rigid/deforming paths. Skinning is
    O(source verts × 4 bones) with **no per-vertex allocation** (reused temporary),
    and secondary-ray **normals are per-face**, recomputed from the skinned
    triangle positions (no CPU normal skinning). Skinned segments force the
    per-frame normal upload like deforming ones.
  - **G-buffer side** (`GBufferPass`): the swapped `ShaderMaterial` now includes
    three's standard `skinning_pars_vertex` / `skinbase_vertex` / `skinnormal_vertex`
    / `skinning_vertex` chunks, so a `SkinnedMesh` rasterizes its animated pose
    (three defines `USE_SKINNING` and supplies the bind/bone-texture uniforms
    automatically; a non-skinned mesh compiles the identical source with the chunks
    collapsed to nothing). Primary visibility keeps smooth skinned normals; the
    per-mesh material cache means skinned/non-skinned meshes never share a program.
  - **Demo:** an animated **Fox** exhibit (Khronos glTF) trots on a low platform
    in the front-right floor, driven by an `AnimationMixer` ("Run" clip) and gated
    by a new **"fox walk"** toggle (Physics section, default on). ≈ 1.7k skinned
    source verts skin in ≈ 0.3 ms/frame.
  - The Fox ships without a `normal` attribute; the demo calls
    `computeVertexNormals()` on load so the raster path has bind-pose normals to
    skin (the BVH path derives its own per-face normals and was never affected).

## 0.4.2 — 2026-07-22

- **Real fix for black lighting on iOS** (root-caused by live bisection on an
  iPad): WebKit's GLSL-to-Metal translation silently emits a broken program
  when `traceRadiance` (BVH traversal + full hit shading) is inlined at a
  FOURTH call site — clean compile, black output, no console error. 0.4.0's
  alpha-blend straight-through trace was that fourth site. The blend
  continuation now reuses the GI bounce's call site (a blend pixel's secondary
  ray becomes the view continuation instead of a GI bounce — it forgoes the
  pane's own GI bounce, visually negligible, and saves a ray). The shader
  carries a hard call-site budget comment; iOS gets the FULL pipeline again,
  spec buffer and real transparency included. 0.4.1's functional MRT probe and
  single-attachment fallback remain as protection for genuinely MRT-broken
  devices.

## 0.4.1 — 2026-07-22

- **Fix: black lighting on iOS (iPhone/iPad, all browsers).** WebKit reports
  the 0.4.0 two-attachment half-float lighting MRT as framebuffer-complete and
  then silently renders it black, which blanked the entire ray traced image
  (only emissive surfaces survived the composite). The renderer now runs a
  FUNCTIONAL probe at construction — draw one 2-output quad into a tiny fp16
  MRT and read the pixel back — and on failure rebuilds the lighting pass
  single-attachment (the 0.3.x layout): `specular` is disabled and
  `specMRTSupported` is exposed on the instance; alpha-blend surfaces render
  opaque there (their behind-image rides the specular buffer by design).
  Everything else — GGX in reflections, GI, ReSTIR, water, overscan — keeps
  working. The demo accepts `?nospecmrt=1` to force this fallback on any
  machine for testing.

## 0.4.0 — 2026-07-22

- **Demo:** the room is now a designed gallery (water pool with kerbs under the
  emissive panel, helmet spotlight, duck-in-a-vitrine transparency exhibit,
  roughness-ramp plinths, paired accent panes), with an always-on **fps readout**
  (top-left) and a **collapsible control panel** (starts collapsed on phones).
- **Emissive NEE importance sampling** (`emissiveImportance`, default on): the
  triangle NEE shoots at is now picked proportional to **area × emitted
  luminance** via a compile-time power CDF (binary-searched in-shader) instead
  of uniformly 1-of-N. Same mean, far less sparkle when emitters differ in
  size/brightness — a tiny bright puck no longer alternates between "ignored"
  and "over-weighted 4×". Set `false` for the legacy uniform pick (A/B hook).
- **Docs:** emissive area lights documented as the noisiest direct-light path,
  with a runtime hint when a scene compiles emissive geometry while ReSTIR is
  off (the reservoirs are the intended mitigation).

- **PBR materials — real specular.** The renderer was Lambert-only for every
  dielectric; roughness/metalness maps and normal maps were ignored. This round:
  - **Cook-Torrance GGX direct specular** (GGX distribution + height-correlated
    Smith visibility + Schlick Fresnel) for *every* surface, evaluated in the
    direct-lighting path (analytic lights, emissive NEE, and the ReSTIR winner).
    Dielectric highlights (`F0 ≈ 0.04`, white) go into a **separate specular
    buffer** the composite adds *without* the albedo multiply — they cannot ride
    the albedo-demodulated irradiance buffer. Metals' albedo-tinted specular
    stays in the reflection path (`F0 = mix(0.04, albedo, metalness)` is realised
    across the two buffers, so the lighting pass never needs an albedo sampler).
    New `specular` option / toggle (default on); new debug view `6`.
  - The specular buffer is a second **MRT attachment** on the lighting pass,
    temporally accumulated with a short (near-mirror) history, lightly denoised
    with the à-trous filter (mirror pixels spared via `specKeep`), and carried
    across renderScale/canvas resizes like the irradiance history.
  - **Analytic-light glints on metals/glass:** the traced reflection ray can't
    see point/spot/directional lights (they aren't geometry), so each is now
    evaluated as a small area source along the reflection direction and shadowed
    — a metal sphere under a spotlight finally glints.
  - **G-buffer material maps:** `normalMap` (screen-space cotangent frame, honours
    `normalScale`), `roughnessMap` (`.g`) and `metalnessMap` (`.b`), all guarded
    so a material without a given map renders byte-identically to before.
  - **ReSTIR** target pdf gains a cheap Blinn-Phong specular lobe so reservoirs
    favour lights that land on a highlight.
  - Fixed: history carry across a resize wrote a single-output copy into the new
    2-attachment MRT, which ANGLE/D3D11 rejects (`INVALID_OPERATION`); it now
    uses a matching 2-output carry.
- **Alpha-blended transparency** (`transparency`, default on): `transparent: true`
  meshes are now composited correctly instead of the old broken behaviour, where
  `opacity >= 0.5` rendered fully opaque and `opacity < 0.5` vanished entirely. A
  transparent surface is primary-visible in the G-buffer (kept out of the BVH, so
  it still casts no shadow) and the lighting pass traces one straight-through ray
  to what is behind it. The behind image rides the specular attachment (its
  radiance scale and short-history accumulation both fit; the pane's dielectric
  highlight is dropped in trade) and CompositePass performs the opacity blend
  where the pane's albedo lives, so the see-through content reads at true
  brightness instead of being crushed by the demodulation scale mismatch.
  Single-layer: the nearest transparent surface wins and overlapping panes do
  not inter-sort; needs the specular buffer (`specular: false` degrades blend
  surfaces to opaque). Costs a ray only on blend pixels. Set
  `transparency: false` to render blend surfaces fully opaque.
- **Deforming dynamic meshes** (`mesh.userData.rtDeforming`): a dynamic mesh can
  now be CPU-deformed (water, cloth, morph targets) and have its *traced* rays —
  shadows, GI, reflections — follow the actual deformed shape. Previously dynamic
  meshes were rigid: only `matrixWorld` was applied to a compile-time vertex
  snapshot, so per-frame edits to the `position` attribute showed in the raster
  G-buffer but not in the traced lighting. Flagged segments re-read their live
  `position`/`normal` attributes each frame (expanded through a de-index mapping
  snapshotted at compile time) and upload normals every frame instead of every
  8th. The app owns normal correctness (call `computeVertexNormals()` after
  deforming); a live vertex-count change throws asking for a recompile. Keep
  these meshes low-poly — the per-frame refit is O(dynamic tris). New demo:
  a mirror-water pool (48×48 plane, summed sine waves) with moving traced
  reflections.
- **Overscan** (`overscan`, default `0`): render internally at a padded
  resolution with a proportionally widened field of view, then crop the centre
  to the canvas on the final on-screen draw. Newly-disoccluded pixels at the
  leading screen edge during camera motion — which have no temporal history and
  take several frames to converge — are then born off-screen, hiding the
  shimmering edge band. Padding fraction per edge (clamped 0–0.25); both axes
  pad equally so aspect ratio is preserved. Cost is `1 + 2·overscan` per axis
  (`0.1` → 1.44× the pixels); 0.05–0.1 recommended. Live-assignable like
  `renderScale` (reallocates targets, resets accumulation). The user's camera is
  never mutated — the widened projection is applied/restored per frame like the
  TAA jitter. Every pass runs in the shared padded space; the only crop point is
  the final draw (the TAA resolve's out-copy, or the composite when TAA is off).
- **Conservative, self-scaling defaults** (behaviour change): zero-config
  `new RealtimeRaytracer(renderer)` now starts *low but still ray traced* and
  scales **up**, rather than starting near high. The changed constructor
  defaults are `renderScale: 0.5` (unchanged), `denoiseIterations: 2` (was `3`),
  `stochasticLights: true` (was `false`), and `adaptiveQuality: true` (was
  `false`). The net effect: the default renderer runs acceptably on weak
  discrete/integrated GPUs, and the now-on-by-default adaptive governor climbs
  `renderScale` toward `targetFps` (up to full-resolution lighting) on strong
  hardware. **Breaking-ish** for anyone who relied on the *implicit* near-high
  defaults — pass explicit options, or
  `recommendedOptions(detectTier(renderer))`, to restore the old starting point.
  `recommendedOptions("high")` is unchanged in behaviour (it now pins
  `stochasticLights: false` explicitly so the flipped default can't leak into
  it), and the demos already pass explicit options so their look is unchanged.
- **`RealtimeRaytracer.probeGPUTier(renderer?)`** — a new optional, async GPU
  tier probe. When WebGPU is present it inspects the real `adapter.limits` /
  `adapter.info` and factors in screen resolution; otherwise it falls back to
  the WebGL `detectTier` heuristic. Returns
  `{ tier, source: "webgpu"|"webgl"|"fallback", details }`. Honest about its
  limits — **WebGPU does not expose VRAM**, so it classifies from buffer/texture
  limits as a proxy (documented in the README and JSDoc). The constructor stays
  synchronous.
- **Movement-artifact harness** ([`harness.html`](harness.html)): a diagnostic
  page that quantifies edge-of-screen convergence noise during camera motion.
  Deterministic strafe/orbit paths, per-pixel temporal luminance variance in
  left-edge / right-edge / center bands with a live edge-vs-center ratio HUD, a
  magnified side-by-side inset, and a JSON metric line logged every 2s. The
  overscan control is feature-detected.

## 0.3.2 — 2026-07-19

- **Localized fog zones** (`volumetric.zones`): up to 8 world-space AABBs, each
  adding its own density on top of (or instead of) the global fog — fog as a
  level-design tool. Density integrates piecewise along the ray, so a bright
  crossing over a pitch-black abyss "just works".
- **Adaptive quality no longer flashes**: renderScale steps carry the temporal
  history across target reallocation (resampled, confidence clamped to ~8
  frames) instead of hard-resetting accumulation — the visible "all samples
  dumped" strobe on devices hovering near the fps target is gone. The governor
  also detects boundary hunting (a step reversal) and responds by widening its
  deadband and extending the cooldown.
- **Light cap raised 16 → 32** (`MAX_LIGHTS`): scenes can now scan up to 32
  point/spot/directional lights into the compiled light tables. ReSTIR keeps
  direct lighting at one visibility ray per pixel regardless of the count, and
  every affected program stays well under the WebGL2-guaranteed
  fragment-uniform budget.

## 0.3.1 — 2026-07-19

- **SpotLight support** across every estimator (lighting, ReSTIR, volumetric):
  cone + penumbra, soft shadows, visible light cones in fog.
- **Volumetric rework**: quarter-resolution stratified march (4 steps/ray)
  instead of one sample — moving lights (patrolling flashlights) render
  grain-free; cheaper than before.
- **Half-rate GI** option (`giHalfRate`): bounce traced on alternating
  checkerboard parity, doubled — unbiased, ~35% off GI's frame cost.
- Denoiser: disocclusion luminance widening capped at 3x — objects no longer
  lose contact shadows ("float") while the camera moves.
- Adaptive governor can drive an app-owned canvas scale as its deepest lever;
  demo/gallery expose a resolution control.

## 0.3.0 — 2026-07-19

The "how well can you do this" release.

### Lighting
- **Emissive-mesh area lights** via next-event estimation (glowing meshes cast
  real soft light + shadows).
- **Traced reflections** on metals and **two-interface glass refraction**
  (`MeshPhysicalMaterial.transmission`).
- **Volumetric god rays**: BVH-shadowed single-scatter fog, temporally
  accumulated — real occlusion, works for off-screen sources.
- **ReSTIR direct lighting** (temporal + spatial reservoir reuse, triangle-level
  candidates with fresh surface points at shading): one visibility ray per pixel
  regardless of light count. Measured: 15 lights at 5.4ms vs 12.7ms per-light.

### Sampling & performance
- **Blue-noise sampling** (void-and-cluster tile, R2-rotated) on the first
  sampling dimensions — steady-state temporal noise down 27%.
- **Any-hit shadow traversal** (unordered early-out): rt-min config 3.1 → 1.4ms.
- **Stochastic direct lighting** option; **fp16 G-buffer** where supported
  (runtime-probed); auto-scaled ray epsilon; dynamic BVH rebuilds itself when
  scattered movers degrade the refit topology.

### Robustness & adaptivity
- Graceful **no-GPU fallback** (`rt.supported`), capability tiers with
  recommended presets, **continuous adaptive quality** (fps-targeting dynamic
  resolution incl. an app-owned canvas-scale hook), and an **overload brake**
  (on by default) that clamps oversized buffers and cuts quality on
  catastrophic frames before the GPU driver gives up.
- Denoiser preserves contact shadows under heavy filtering; edge "rain-drop"
  speckles fixed (geometric upsample fallback + despeckle + NaN guards);
  specular history capped to prevent reflection smear.

### DX & docs
- TypeScript definitions (`src/index.d.ts`), copy-paste `standalone.html`
  (no bundler, CDN import map), verified Getting Started + integration
  checklist, honest "What is and isn't supported" matrix, scene gallery
  (11 streamed glTF scenes with an RT/raster hold-to-compare), and a
  fence-timed benchmark page with a ghosting metric (`bench-results/`).

## 0.2.0 — 2026-07-06

Initial public release: hybrid deferred pipeline (raster G-buffer + BVH-traced
soft shadows and 1-bounce GI), temporal reprojection, à-trous denoiser, TAA,
two-level dynamic BVH, procedural sky, iOS compatibility fallback.
