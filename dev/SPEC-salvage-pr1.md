# SPEC [library 0.16.2 prep]: port two pieces of PR #1 (perf/general-scene-fast-paths) onto 0.16.1

Owner: Fable. Implementer: a DeepSeek flash agent in `C:\ClaudeSessions\rt-wt\dyn` (branch
`feature/salvage-pr1-0.16.2` = library master `fc3f348` = 0.16.1). No git except read-only (`git status`,
`git diff`, `git show pr-1:src/<file>` to read the PR's version of a file; the PR branch `pr-1` is fetched
locally). No version bump (Fable does that). Nothing under node_modules. Do not touch other worktrees.
The dev server for THIS library, if you need one, is `node node_modules/vite/bin/vite.js --host --port 8167
--strictPort` (probably already running on 8167 for this tree). HEADLESS Chromium only
(`--use-angle=gl --enable-webgl --ignore-gpu-blocklist`); THE WATCHDOG: never queue more than 6 renders
without a 1x1 readPixels sync, assert the context is not lost. No em dashes, no emojis.

## What and why

An outside agent opened PR #1 on GitHub against the PUBLIC master (0.15.0). Our real master is 0.16.1,
which rewrote SceneCompiler/GBufferPass/RTLightingPass/RealtimeRaytracer, so the PR cannot merge. Two of
its pieces are worth carrying into 0.16.1; the rest (glass fast paths, clear-glass opt-in, static-scene
motion gating, the BVH visit-counter strip, README/package changes) is NOT wanted. `dev/pr1-salvage.patch`
holds the PR's diff for the relevant files (GBufferPass.js, SceneCompiler.js, RealtimeRaytracer.js,
index.d.ts, two selftest scripts) against ITS base; GBufferPass and the two scripts apply cleanly to
0.16.1, RealtimeRaytracer/SceneCompiler/index.d.ts do not (`git apply --check dev/pr1-salvage.patch`).

1. G-BUFFER MATERIAL POOLING (GBufferPass.js + the RealtimeRaytracer constructor option
   `gbufferMaterialPooling` default true + index.d.ts typing): one shared gbuffer ShaderMaterial per
   (vertexColors, side) key, per-draw sync of the source material's uniforms in `material.onBeforeRender`
   with `uniformsNeedUpdate = true`, meshes with custom Object3D render callbacks fall back to the legacy
   per-mesh proxy, multi-material meshes keep per-group materials, `_resetSharedMaterialPool()` on any
   define change (volume albedo, motion vectors, mixed precision). Port it faithfully; where 0.16.1's
   GBufferPass differs from the PR's base (it may have new uniforms/defines since 0.15: light table,
   texture tiles, whatever), make sure the pooled path syncs EVERY uniform the per-mesh path syncs
   (diff `_syncGbufferMaterial` in 0.16.1 against the PR's and reconcile; list the fields).
2. SCENE COMPILER HARDENING (SceneCompiler.js): ONLY the robustness parts of the PR: interleaved and
   normalized attributes handled when extracting geometry, missing normals on indexed geometry computed,
   partial (dangling) triangles dropped with a count, deforming geometry handled if the PR did that
   generically. Port them onto 0.16.1's compiler (which has the light table, texture tiles and the
   partial dynamic update; do NOT disturb those: `updateDynamic()` must stay bit-exact). Skip the PR's
   `hasTransmission` flag and any glass/refraction plumbing unless a ported hunk cannot compile without a
   one-line stub (then say so).
3. Everything else in the PR: leave out. If you find something else in it that you believe is a clear
   win, name it in the report with the reason; do not port it.

## Gates (report every number)

- Library: `node scripts/selftest.mjs`-style checks that exist in THIS tree still pass; the PR's two
  scripts (`scripts/gbuffer-material-pooling-selftest.mjs`, `scripts/geometry-selftest.mjs`) ported and
  passing (they may need path/import touch-ups). `npm run build` succeeds. `dev/dynamic-partial-gates.mjs`
  (0.16.1's own bit-exact identity/timing gate for updateDynamic) still passes.
- Hangar A/B (the game is the real consumer): copy THIS tree's `src/` over
  `C:\ClaudeSessions\hangar-wt\perf\node_modules\three-realtime-rt\src` (that worktree = game master, vite
  on `http://localhost:8169/`; if 8169 is down start `node node_modules/vite/bin/vite.js --host --port 8169
  --strictPort` THERE, in the background). Before overwriting, copy the existing 0.16.1 src aside
  (`node_modules/three-realtime-rt/src-0.16.1-backup`) so you can flip back for the A arm. Then, per arm
  (A = 0.16.1, B = ported):
  a. `python dev/cpu-profile.py --url http://localhost:8169/ --poses gallery,dining --frames 120`:
     CPU median per frame and the `three.render()` share (pooling should lower setProgram/material churn;
     say by how much).
  b. Image identity, rt + raster, gallery and dining, using `dev/merge2-check.py --only identity` or its
     method (merge=0 twice floor is not the point here: compare A vs B at the same settings, and A vs A
     for the floor); within floor required.
  c. Boot: no new console errors/warnings; `HANGAR.rt.compiled.triangleCount` identical A vs B; the
     `[hangar]` boot lines identical.
  Restore the perf worktree's node_modules src to the 0.16.1 backup at the end (Fable refreshes engine
  copies deliberately).
- Bit-exactness caveat: pooling changes program identity, not math; the images should be identical to
  the byte in raster and within floor in rt. If pooling changes pixels, find out why before reporting.

Report `dev/SALVAGE-PR1-REPORT.md` (under 120 lines, numbers first): what was ported (per hunk), what
was left out and why, the gate table, and the two things the next reviewer should look at first.
Final message = the report.
