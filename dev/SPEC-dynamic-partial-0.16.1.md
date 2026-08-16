# SPEC: three-realtime-rt 0.16.1, updateDynamic() does work proportional to what moved

Owner: Fable. Implementer: a DeepSeek agent in `C:\ClaudeSessions\rt-wt\dyn` (branch
`feature/dynamic-partial-0.16.1`, cut from master 1b66c73 = 0.16.0). Dev server if you need one:
`node node_modules/vite/bin/vite.js --host --port 8167 --strictPort` (background it). No git. Nothing
under node_modules. Do not touch other worktrees, `C:\ClaudeSessions\RayTracingUpgradeChallenge`, or any
game checkout. Never kill processes you did not start. HEADLESS Chromium only (`--use-angle=gl
--enable-webgl --ignore-gpu-blocklist`); the GPU is shared with another project's capture, so GPU
timings are noisy (report floors: five runs, min and median) and CPU timings are what this spec is
about anyway. No em dashes, no emojis, anywhere (code, comments, CHANGELOG, report).

## The problem, measured in the Hangar game this morning (0.16.0, 396 dynamic segments, 28.5k tris)

`SceneCompiler.updateDynamic()` (src/SceneCompiler.js:213) re-bakes EVERY rigid segment's vertices
through its matrixWorld, then `dynamicBvh.refit()` over the whole tree, then
`dynamicBvhUniform.updateFrom(dynamicBvh)` which re-runs three-mesh-bvh's `bvhToTextures` over every
node (allocating two fresh typed arrays each call), every frame, whether or not anything moved:

    whole 11.8 ms/frame = pack 5.8 + bake 3.9 + refit 1.9 + world matrices 0.2   (Ryzen 5, JSC and V8 alike)
    380 of the 396 segments were PARKED (an enemy pool at y = -1000 that never moves); one aircraft moved.

That is 12 ms of main-thread CPU before the GPU can start, in a game whose frame is 33 ms on the
owner's laptop. A game cannot avoid parked pools: the engine has no way to add a dynamic mesh after
compileScene, so pools are compiled in and parked (index.d.ts says so). So the engine has to make a
parked segment cost nothing.

## Build

1. Per-segment dirty test. Each rigid segment keeps a copy of the 16 matrixWorld elements it was last
   baked with; on updateDynamic a segment is dirty if any element differs (exact compare), or if it
   is `deforming`/`skinned` (always dirty), or on the first call. Only dirty segments are baked. Keep a
   per-segment world AABB from its last bake; the frame's dynamic bounding volume (the `vol` used for
   the rebuild-vs-refit decision) is the union of the cached segment AABBs, so parked segments cost a
   box union, not a vertex loop.
2. Partial refit. three-mesh-bvh 0.7.8 `MeshBVH.refit(nodeIndices)` (node_modules/three-mesh-bvh/src/
   core/cast/refit.template.js): given a Set of node32 indices, it descends only into children whose
   node32 index is in the set (and, at an internal node with NEITHER child in the set, forces the whole
   subtree, so the set must contain every node ON THE PATH from the root to each changed leaf: read the
   template until you can explain that rule). At compile time (and after any full rebuild) walk the
   dynamic BVH once and build, per segment, the sorted Uint32Array of node32 indices on the paths to
   every leaf whose triangle range overlaps the segment (leaf offset/count are triangle indices into
   the merged non-indexed soup: segment i covers triangles [seg.start/3, (seg.start+seg.count)/3)).
   Per frame: union the dirty segments' index arrays into a Set (or a reusable Uint8Array mark +
   list) and call `refit(set)`. When NO segment is dirty, skip refit entirely.
3. Partial repack. Replace `dynamicBvhUniform.updateFrom(bvh)` on the per-frame path with an in-place
   update: keep the bounds Float32Array and contents Uint32Array `bvhToTextures` produced at compile
   (or produce them once yourself with the same layout: node i -> boundsArray[8i .. 8i+2] = min,
   [8i+4 .. 8i+6] = max, i = node32Index / 8 since BYTES_PER_NODE is 32; contents never change on a
   refit) and, per frame, rewrite ONLY the bounds of the nodes in this frame's refit set, then set
   `boundsTexture.needsUpdate = true`. Verify by reading `node_modules/three-mesh-bvh/src/gpu/
   MeshBVHUniformStruct.js` that no other field of the struct depends on the refit (position/index
   textures are updated by the existing code where needed; check what `updateFrom` touches beyond
   bvhToTextures and keep that behaviour: e.g. the position attribute upload happens through
   `posAttr.needsUpdate` already). Multi-root BVHs are already unsupported by the struct; assert
   `_roots.length === 1` once at compile.
4. The full rebuild path (volume grew or shrank 3x) stays: `new MeshBVH(...)`, rebuild the per-segment
   node maps, full `updateFrom`. The dynamic-emissive refresh (`_refreshDynamicEmissive`) runs only if
   a dirty segment is an emitter (or keep it every frame if you can show it is cheap; say which).
5. Public API unchanged: `updateDynamic()` with no arguments; a new read-only stat
   `compiler.lastDynamicUpdate = { dirtySegments, refitNodes, bakedTriangles, ms }` for harnesses;
   `RealtimeRaytracer` exposes it as `rt.lastDynamicUpdate` if there is a precedent for such stats
   (look for `lastEmissiveRefreshMs`). Document in index.d.ts. CHANGELOG entry under 0.16.1, version
   bump in package.json to 0.16.1.

## Gates (write `dev/dynamic-partial-gates.mjs`, Playwright headless on the GPU, and a page
`dev/dynamic-partial.html` it drives; report every number)

- Scene: a static room (a few thousand tris, two lights), 380 parked small meshes at y = -1000
  totalling ~27,000 triangles (a pile: boxes/icosahedra of ~70 tris each), one "aircraft" of ~1,500
  triangles that moves along a path (translation + rotation every frame), and one deforming mesh of a
  few hundred tris (so that path is exercised). Compile with all of them as `dynamicMeshes`.
- BIT-EXACT: run the same 90 frames twice from the same initial state, once with the new partial path
  and once with a switch that forces the old full path (keep the old path behind an internal flag,
  e.g. `compiler.forceFullDynamicUpdate = true`, for exactly this comparison; it can be removed
  later). After frames 1, 30, 60, 90 compare (a) the whole root buffer of the dynamic BVH as a
  Float32Array (bounds) and Uint32Array (contents): zero differing elements; (b) the bounds texture's
  image.data: zero differing elements; (c) the rendered frame via readPixels: zero differing pixels
  (same seed, same jitter: use whatever the existing identity gates use, see dev/lights-identity.js
  and dev/legacy-identity.mjs for the pattern). If (c) cannot be made deterministic for a reason you
  can name, compare (a) and (b) exactly and (c) with a mean absolute difference under 0.05/255 with
  the floor of two identical full-path runs printed beside it.
- TIMING (CPU, performance.now() around updateDynamic, 40 iterations averaged, five runs, min and
  median): old full path vs new partial path for: 1 mover + 380 parked; 1 mover only (nothing
  parked; the partial path must not be SLOWER than the old one here, within noise); all 381 moving
  (worst case: within 10% of the old path); nothing moving (near zero).
- Existing gates still pass: `npm run test:render`, `npm run test:km`, `node dev/lights-gates.mjs`
  and `node dev/lights-budgets.mjs` if they run in this worktree (say which you ran and their output),
  and the demo pages boot without console errors (index.html, gallery.html, game-bench.html).
- A rebuild-path test: move all parked meshes 3000 units away in one frame (volume x27), the rebuild
  triggers, the per-segment maps are rebuilt, and the following frames are again bit-exact against
  the full path.

Report `dev/DYNAMIC-PARTIAL-0.16.1-REPORT.md`: the design as built, the gate tables (with floors), what
you could not verify, and the exact per-frame numbers for the 1-mover-plus-380-parked case (this is
the number Fable will quote to the owner). Final message = the report.
