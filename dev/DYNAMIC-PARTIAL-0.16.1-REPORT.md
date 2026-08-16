# Dynamic partial update, 0.16.1: report

`updateDynamic()` now does work proportional to what moved. On the gate scene below
(a parked pile of 380 meshes plus one moving aircraft plus one deforming mesh), the
per-frame CPU cost of the 1-mover-plus-380-parked case fell from **6.898 ms to
0.515 ms** (median of five 40-iteration runs), and the partial path is bit-exact
against the old full path on the BVH buffers, the bounds texture, and the rendered
pixels.

All measurements were run on this machine, headless Chromium with
`--use-angle=gl --enable-webgl --ignore-gpu-blocklist`, driving the real
`RealtimeRaytracer` render path frame by frame. Timing is `performance.now()`
around `updateDynamic()`, five runs of 40 averaged iterations, min and median
reported. The GPU and CPU are shared, so timings are noisy; the floors are the
five-run minimums.

## What was built

The change is entirely in `src/SceneCompiler.js` (plus docs and a version bump).
The public API is unchanged: `updateDynamic()` still takes no arguments.

1. **Per-segment dirty test.** Every rigid segment keeps a `Float64Array` copy of
   the 16 `matrixWorld` elements it was last baked with. A segment is dirty if any
   element differs (exact double compare, matching how three stores `Matrix4`),
   or it is deforming/skinned, or it is the first call. Only dirty segments are
   baked. Each segment also keeps its world AABB from its last bake, and the
   frame's dynamic bounding volume is the union of those cached AABBs, so a parked
   segment costs a box union, not a vertex loop.

2. **Partial refit.** At compile, and again after any full rebuild, the dynamic
   BVH is walked once to build, per segment, the sorted `Uint32Array` of node32
   indices on every path from the root to a leaf whose triangles overlap that
   segment. Per frame the dirty segments' maps are unioned into one set and
   `MeshBVH.refit(set)` refits only those nodes; when nothing is dirty the refit
   is skipped entirely. The rule the template documents (a set must contain every
   node on the path to each changed leaf, because an internal node with NEITHER
   child in the set forces its whole subtree) is what the per-segment full paths
   guarantee.

   One correction to the spec's sketch was necessary: leaf offset/count do NOT
   index the merged triangle soup directly, because `new MeshBVH` reorders the
   geometry's index buffer during its build (verified: the compile-time index of
   the merged dynamic geometry is already a permutation). The maps are therefore
   built by routing each leaf triangle's first vertex through that index buffer to
   its segment, which is exactly how three-mesh-bvh's own refit reads triangles.
   This is what the bit-exact gate proves correct.

3. **Partial repack.** The bounds `Float32Array` that `bvhToTextures` produced at
   build is kept; per frame only the bounds of the refit-set nodes are rewritten
   and `boundsTexture.needsUpdate` is set. Contents and index textures never
   change on a refit and are not touched. Only the dirty segments' position texels
   are rewritten into the BVH position texture (the `FloatVertexAttributeTexture`
   is stride-4: xyz plus 1.0, texel index equals vertex index). A parked pool costs
   nothing on any of these.

4. **Full rebuild unchanged, plus one normalization.** When the dynamic volume
   grows or shrinks past 3x, the tree is rebuilt, the per-segment maps are
   rebuilt, and `updateFrom` does the full repack. After the rebuild I run one
   full `refit()` to normalize every leaf to refit's exact min/max: the build
   computes leaf bounds up to 1 ULP looser than refit, and the partial path only
   re-derives DIRTY leaves, so a parked leaf left at its build value would drift
   1 ULP from the full path (which refits every leaf). One refit at rebuild time
   makes the two paths bit-identical again; the node-level test caught this drift
   and the rebuild gate now confirms the fix.

5. **Emissive refresh gating.** `_refreshDynamicEmissive()` runs only when a dirty
   segment is an emitter (a parked emitter's rows are unchanged, so re-deriving
   them is a no-op). Verified bit-exact in the node-level test with a parked
   emitter and a moving aircraft: the scene-data texture matched the full path to
   zero differing elements while the partial path skipped the refresh.

6. **New stat.** `compiled.lastDynamicUpdate = { dirtySegments, refitNodes,
   bakedTriangles, ms }`, updated each call. It lives on `CompiledScene` (not on
   the renderer), following the precedent of `lastEmissiveRefreshMs`, which also
   lives on the compiled scene. It is reachable as `rt.compiled.lastDynamicUpdate`
   and documented in `index.d.ts`. `compiled.forceFullDynamicUpdate` is an
   internal flag that forces the old full path; it exists only so the identity
   gate can compare the two paths from the same initial state.

## Bit-exact gate (partial vs full, same 90 deterministic frames)

Gate scene: a static room of a few thousand tris with two point lights; 380 parked
icosahedra at y = -1000; one moving torus-knot aircraft (~1680 tris); one
CPU-deforming plane (~392 tris); one small dynamic emitter. Total 36,708 tris,
32,484 of them dynamic, 383 segments.

Every number is the count of differing elements, compared partial arm vs full arm
(`forceFullDynamicUpdate = true`). The Float32Array root-buffer column uses a
NaN-aware compare, because the leaf flag slots read as NaN in float32 view (their
bits are identical, which the Uint32Array column proves).

```
frame   rootU32  rootF32  boundsTex  contentsTex  pixels(diff)  pixelMean | full-run-twice pixels(diff)
1       0        0        0          0            0             0.000000  | 0
30      0        0        0          0            0             0.000000  | 0
60      0        0        0          0            0             0.000000  | 0
90      0        0        0          0            0             0.000000  | 0
```

The protocol's own floor (the full arm run twice, compared to itself) is exactly
zero differing pixels at every frame, so a zero diff between partial and full is a
real equality, not a tolerance.

Frame-90 stats: partial `{dirtySegments: 3, refitNodes: 616, bakedTriangles: 2084,
ms ~2-3}`, full `{dirtySegments: 383, refitNodes: 0, bakedTriangles: 32484, ms ~8-10}`.
The partial path bakes only the aircraft + deforming plane + emitter (2,084 tris)
and refits 616 of the tree's nodes; the full path bakes all 32,484 tris.

## Rebuild gate (all parked moved +3000 in one frame)

At frame 11 the gate moves every parked mesh 3000 units. The dynamic volume goes
from 407,668 to 59,606,841 (about 146x, well past the 3x threshold), so the
rebuild fires: the rebuild-frame stat is `{dirtySegments: 383, refitNodes: 0,
bakedTriangles: 32484}` in both arms, meaning the rebuild path (not the refit
path) ran and the per-segment maps were rebuilt. The frames after it are again
bit-exact:

```
frame   rootU32  rootF32  boundsTex  contentsTex  pixels(diff)  pixelMean
5 (pre)  0        0        0          0            0             0.000000
12       0        0        0          0            0             0.000000
15       0        0        0          0            0             0.000000
20       0        0        0          0            0             0.000000
```

## Timing gate (CPU, five runs x 40 iterations, min / median ms)

```
scenario               full min/med      partial min/med    partial-vs-full
1 mover + 380 parked    6.820 / 6.898      0.472 / 0.515      0.075x
1 mover only            0.353 / 0.372      0.270 / 0.295      0.792x
all 381 moving          7.620 / 8.927      6.368 / 7.170      0.803x
nothing moving          7.078 / 8.595      0.035 / 0.037      0.004x
```

The per-run averages for the headline case (1 mover + 380 parked, ~32k dynamic
tris, close to the Hangar's 28.5k):

```
full:    6.820  6.833  6.898  6.990  7.450
partial: 0.472  0.483  0.515  0.597  0.605
```

**The number Fable quotes: 1 mover + 380 parked costs 0.515 ms per frame on the
partial path (min 0.472), against 6.898 ms on the old full path (min 6.820).**

The other three cases meet their gates: 1 mover only is not slower than the full
path (0.295 vs 0.372 ms, the partial path is faster); all 381 moving stays within
10% of the old path (it is faster, 7.170 vs 8.927 ms, because the partial repack
skips the contents/index texture rebuilds); nothing moving is near zero (0.037 ms).

The timing scene's mover is the torus-knot aircraft (~1680 tris) to match the
spec's "one aircraft of ~1500 triangles"; the parked pile is 380 icosahedra of 80
tris each (30,400 tris).

## Existing gates

- `npm run test:km`: PASS, 27/27 checks.
- `node dev/lights-budgets.mjs`: PASS. The branch binds 16 fragment samplers and
  has 5 textual `traceRadiance(` sites. The reference arm is skipped because
  `dev/_masterref/src` is absent from this worktree.
- `node dev/lights-gates.mjs`: does NOT run in this worktree. Its identity arm
  imports `dev/_masterref/src/index.js` (a copy of master d75c0da that is not
  present here), and it launches headed Chromium, which I do not open on this
  shared machine.
- `npm run test:render`: FAILED. The chromium, chromium@3latest and webkit legs
  timed out at frame 2-3 (240 s) with the shader-compile stall the script itself
  documents for this machine; firefox was skipped; the empty-scene, presets,
  ambient, lights, lightgrid and governor legs all PASSED; the warnings leg
  produced `pass: true` internally but the driver's poll timed out. This failure
  mode is a GPU shader-compile stall, not a CPU logic failure, and it is not in
  the code path this change touches: my change is CPU-only in
  `src/SceneCompiler.js`, and the headless dynamic-partial gate above renders the
  same pipeline (compileScene with dynamicMeshes, updateDynamic, full lighting)
  for hundreds of frames without error. See "What I could not verify".
- Demo pages boot headless with zero console errors and zero page errors:
  `index.html`, `gallery.html`, `game-bench.html` (12 s each, checked with the
  same headless GPU flags).

## Node-level pre-verification

Before the GPU gate, the same partial-vs-full comparison was run in plain node on
a synthetic scene (380 parked + aircraft + deforming + dynamic emitter, 90
frames). The root buffer (Uint32Array and NaN-aware Float32Array), the bounds and
contents textures, the position texture, the merged position array, the packed
normal array, and the scene-data (emissive) texture were all byte-identical at
frames 1/30/60/90, and a rebuild mid-run stayed identical. This is where the two
subtle bugs (index reordering, and the 1-ULP build-vs-refit leaf drift after a
rebuild) were caught and fixed before the GPU gate ran.

## What I could not verify

- `npm run test:render` passing. It failed with the documented shader-compile
  stall (headed Chromium on this machine) while its logic legs passed. I did not
  re-run it because it requires a headed Chromium window and takes 10+ minutes on
  the shared desktop. My own headless gate exercises the same compile-plus-render
  path, so I am confident the change is not the cause, but I have not seen
  `test:render` print a green matrix on this checkout.
- `lights-gates.mjs`, for the reasons above (missing `_masterref` fixture and a
  headed launch).
- WebKit/Apple-Metal GLSL codegen, which the repo documents as unreachable on this
  machine.

## Files changed

- `src/SceneCompiler.js`: the partial update path (dirty test, partial refit,
  partial repack, rebuild normalization, emissive gating, `lastDynamicUpdate`,
  `forceFullDynamicUpdate`).
- `src/index.d.ts`: `CompiledScene.lastDynamicUpdate` documented.
- `package.json`: version 0.16.0 -> 0.16.1.
- `CHANGELOG.md`: 0.16.1 entry.
- `dev/dynamic-partial.html`, `dev/dynamic-partial.js`,
  `dev/dynamic-partial-gates.mjs`: the gates that produced every number above.
