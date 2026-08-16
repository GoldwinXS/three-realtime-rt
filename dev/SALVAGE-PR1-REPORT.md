# SALVAGE PR #1 onto 0.16.1 (library 0.16.2 prep): report

Branch `feature/salvage-pr1-0.16.2`, base `fc3f348` (0.16.1). Ported two pieces of
`pr-1`; everything else in the PR left out. All measurements headless Chromium
(`--use-angle=gl --enable-webgl --ignore-gpu-blocklist`) on the shared GPU.

## Gate table (numbers first)

| Gate | Result |
|---|---|
| `node scripts/geometry-selftest.mjs` (ported) | PASS |
| `node scripts/gbuffer-material-pooling-selftest.mjs` (ported) | PASS |
| `node scripts/km-selftest.mjs` (existing) | PASS 27/27 |
| `node dev/lights-budgets.mjs` (existing) | PASS (16 samplers, 5 traceRadiance sites) |
| `node dev/dynamic-partial-gates.mjs identity` | PASS: rootU32/rootF32/boundsTex/contentsTex/pixels all **0 diff** vs full path at frames 1/30/60/90; full-run-twice floor 0; rebuild gate (volume x27 at frame 11) 0 diff |
| `node dev/dynamic-partial-gates.mjs timing` | PASS: 1 mover+380 parked partial 0.635/0.695 ms vs full 8.658/9.177 (**0.076x**); all 381 moving 6.745/7.650 (**0.808x**, faster); nothing moving 0.037/0.058 |
| `npm run build` | PASS (3.17 s) |
| `tsc -p dev/_tscheck/tsconfig.json` | PASS |
| Demo boots (index/gallery/game-bench, 12 s headless) | 0 console errors each |
| `npm run test:render` (scripts/selftest.mjs) | NOT RUN: launches headed Chromium on the shared desktop and is the documented shader-compile-stall leg from the 0.16.1 report; my change is CPU-only and the identity gate above renders the same compile+lighting path |

## Hangar A/B (game = real consumer), src copied into `hangar-wt/perf`

A = 0.16.1 (`src-0.16.1-backup`), B = ported. Server on 8169 (was down; started,
then stopped). Hangar src **restored to the 0.16.1 backup** at the end.

Image identity (rs 0.5, noadapt/nogi/noguard, 200 rt frames / 40 raster frames,
sync every 6, context-lost assert; floor = same-arm twice, tolerance +0.02):

| pose/arm | A/A floor mean | A/B diff mean | verdict |
|---|---|---|---|
| gallery rt | [0.356, 0.289, 0.187] | [0.242, 0.200, 0.128] | within floor |
| gallery raster | [0, 0, 0] max 0 | [0, 0, 0] max 0 | **byte-identical** |
| dining rt | [0.735, 0.276, 0.148] | [0.895, 0.324, 0.171] | within floor (B/B floor is higher: [1.010, 0.354, 0.190]) |
| dining raster | [0, 0, 0] max 1 | [0, 0, 0] max 1 | **byte-identical** |

The rt diff is run-to-run accumulation noise (A-vs-B sits BELOW the B-vs-B floor);
raster is byte-identical, so pooling changed no math.

Boot: both arms 0 console errors, 1 identical browser-level warning ("No available
adapters"); `triangleCount` 456526 both arms; `[hangar]` structural boot lines
identical (merged 2654->482, drawn 3515->1343, merge kept apart incl. interleaved
0, shell/house/lights); only run-to-run timing numbers differ.

CPU profile (120 frames, rs 0.2, `dev/cpu-profile.py`; shared GPU, sync wait
100-160 ms/6 frames - totals noisy). CPUmed / three.render: gallery A 26.2/21.23,
B 21.0/34.93, B2 33.1/43.86; dining A 8.0/5.12, B 8.5/7.07, B2 10.1/8.38.

GBufferPass.js self-time (V8 profile, immune to GPU-wait inflation): gallery
A 2.69 -> B 2.46/B2 2.96; dining A 2.55 -> B 1.10/B2 1.53. Pool size B = **2**
shared materials vs one per-mesh proxy each in A (~1343 drawn meshes). Wall-clock
unresolved under contention (B gallery rt.render swung 38->326 ms between runs).

## What was ported (per hunk)

1. **GBufferPass.js - material pooling.** `materialPooling` option (default true);
`_sharedMaterialPool` Map keyed `${vertexColors}:${side}` + `_sharedHiddenMaterial`;
`_sharedSources`/`_sharedMaterialArrays` WeakMaps; `_resetSharedMaterialPool()` on
`setVolume`/`setMotionVectors`/`dispose`; `_makeSharedMaterial` per-draw
`onBeforeRender` sync with `uniformsNeedUpdate = true` and immutable pool side;
`_sharedMaterialForSource`/`_sharedMaterialFor` (single + multi-material arrays,
null holes stay null, `visible:false` slots use the hidden proxy);
`hasCustomObjectCallbacks` -> legacy per-mesh proxy fallback; `render()` uses a
flat `_swapped` array inside try/finally so an exception still restores
materials/visibility/background.
2. **`_syncGbufferMaterial` reconciled** (0.16.1 per-mesh vs PR): pooled path
syncs EVERY 0.16.1 field plus the PR's additions: `material.visible`, `uColor`
(default white), `uRoughness`, `uMetalness`, `uTransmission`, `uIor`, `uEmissive`
(default black), `uMap/uHasMap`, `uEmissiveMap/uHasEmissiveMap`, `uNormalMap/
uHasNormalMap/uNormalScale`, `uRoughnessMap/uHasRoughnessMap`, `uMetalnessMap/
uHasMetalnessMap`, `uBlend`, `uOpacity`, `uIsDynamic`, motion `uPrevModelMatrix/
uPrevViewProj`, volume `uHasVolume/uVolumeTex/uVolumeOrigin/uVolumeSize`,
`uNormalMatrixWorld`, `material.side`.
3. **RealtimeRaytracer.js**: `new GBufferPass(..., { mixedPrecision,
materialPooling: options.gbufferMaterialPooling ?? true })`.
4. **index.d.ts**: `gbufferMaterialPooling?: boolean` on RealtimeRaytracerOptions.
5. **SceneCompiler.js - hardening only.** `extractMeshGeometry`: missing normals
computed on the INDEXED source before `toNonIndexed()` (smooth shared-vertex
normals, not flat de-indexed faces); `copyVec3Attribute`/`copyVec2Attribute` use
`getX/Y/Z` so interleaved + normalized attributes pack to contiguous floats; count
trimmed to `rawCount - rawCount % 3` (dangling tails dropped per source, never
combined across meshes); `indexMap` sliced to the trimmed count. Deforming bake in
`_bakeSegment`: same direct-vs-`getX/Y/Z` accessor semantics. `updateDynamic()`
untouched - bit-exact gate proves it.
6. **Two selftest scripts ported** (`scripts/gbuffer-material-pooling-selftest.mjs`,
`scripts/geometry-selftest.mjs`) - applied clean, no import touch-ups needed.

## What was left out, and why

- Clear-glass (`rtClearGlass` in SceneCompiler traverse + `validateClearGlassMaterial` +
  `clearGlassMeshCount` + absorption/scattering guards + the GBufferPass
  `isClearGlassMesh`/layer-masking), `hasTransmission`, and the empty-scene /
  `triangleCount` / `sceneDiagonal` guards that exist only to serve clear-glass-only
  scenes: spec item 2 says skip all glass/refraction plumbing.
- `_syncMotionVectors` gating motion vectors on `compiled.hasDynamic` (static scenes
  drop the 5th G-buffer attachment): a real win for fully-static scenes, but it
  changes G-buffer program identity, is outside items 1-2, and the spec's
  bit-exactness caveat is strict. Named here as a candidate for a follow-up.
- PR's `uploadNormals` restructure of updateDynamic: superseded by 0.16.1's own
  partial-update restructure; porting it would touch the code the bit-exact gate
  protects.
- index.d.ts motionVectors doc rewrite + `CompiledScene.clearGlassMeshCount` /
  `hasTransmission`; README/package/version: tied to excluded features / no bump.

## What the next reviewer should look at first

1. **Pooled path now honors `material.visible`** (invisible source materials stay
   invisible in the G-buffer). The 0.16.1 per-mesh proxy did NOT set `visible`, so
   an invisible-material mesh was still rasterized into the G-buffer. The PR made
   this deliberate (selftest asserts `visible === false` proxies); if any app relies
   on the old draw-invisible behavior, that is a behavior change.
2. **The CPU-profile gate is unreadable under shared-GPU contention** (B gallery
   rt.render swung 38 -> 326 ms between runs). The pooling win is proven
   structurally (pool size 2 vs ~1343 proxies) and by GBufferPass.js self-time, but
   a clean setProgram-churn delta needs an idle-GPU re-run of
   `dev/cpu-profile.py --poses gallery,dining`.

Tools added for reproducibility (delete if unwanted): `dev/pr1-identity-capture.mjs`,
`dev/pr1-boot-probe.mjs`, `dev/shots/pr1-identity/`.
