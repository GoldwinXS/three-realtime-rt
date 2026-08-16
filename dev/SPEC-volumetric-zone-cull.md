# SPEC [library 0.16.2 prep]: VolumetricPass marches only where there is something to scatter

Owner: Fable. Implementer: a DeepSeek flash agent in `C:\ClaudeSessions\rt-wt\lights` (branch
`feature/volumetric-zone-cull` = library master `fc3f348` = 0.16.1). No git except read-only. No version
bump. Nothing under node_modules. Do not touch other worktrees (another agent is porting G-buffer changes in
`rt-wt\dyn`; you touch ONLY `src/VolumetricPass.js` and, if needed, `src/RealtimeRaytracer.js` where it
calls the pass). HEADLESS Chromium only (`--use-angle=gl --enable-webgl --ignore-gpu-blocklist`); THE
WATCHDOG: every measured frame synced with a 1x1 readPixels (`gl.finish()`/fences do NOT block on this
ANGLE backend, see below); assert the context is not lost. No em dashes, no emojis.

## Why (measured, dev/gpu-floor-REPORT.md in the game repo C:\ClaudeSessions\hangar-wt\pool\dev)

Per-pass GPU timers (EXT_disjoint_timer_query_webgl2) on the RTX 3060, Hangar gallery pose, canvas 1.0:
`volumetricPass` = 20.7 ms per frame at renderScale 0.2 and 20.5 at 0.7 (quarter-canvas, so flat in
renderScale), for `density 0` + ONE localized shaft zone (`house.shaftZone`). It was 68% of the GPU frame
at the governor floor and the reason a MacBook Pro sat at 24 fps whatever the render scale. Read the
shader in `src/VolumetricPass.js`: after the early-out for "no global fog AND no zones", every quarter-
canvas pixel whose primary ray hit geometry runs VOL_STEPS = 4 stratified steps, and EACH step calls
`lightAt(i, S)` (a shadow ray = BVH any-hit traversal through the whole house) or `emissiveAt(S)`, then
multiplies by `local` (the density at S), which is 0.0 for every step outside the zone. Almost every
pixel pays 4 long shadow rays for a product that is exactly zero.

## Build (bit-exact, so the game's shaft looks byte-identical)

1. Ray-vs-zone pre-test: before the march loop, when `uDensity <= 0.0`, slab-test the ray segment
   [0, segLen] from `uCameraPos` along `rd` against every zone AABB (`uFogZones`, up to 8, `uFogZoneCount`).
   If it intersects none, `sample_` stays zero: skip the loop and fall through to the temporal blend
   EXACTLY as today (the blend with a zero sample must still run so history decays identically). Do not
   change the early-out that already exists for zero zones.
2. Inside the loop: keep every `rand()` call in the same order and count (the random stream must not
   shift, or the image changes statistically and the gate cannot be byte-exact), but skip the
   `lightAt`/`emissiveAt` evaluation when `local <= 0.0`; `c` is zero in that case anyway. When
   `uDensity > 0` (global fog) nothing changes.
3. Optional, only if 1+2 leave the pass above ~2 ms at canvas 1.0 in the gallery: a `stepsInZone`
   refinement is NOT wanted (it changes sample positions). Instead report the residual and stop.
4. Keep the shader's structure and comments; add a short comment block explaining the cull with the
   measured numbers. No new uniforms unless truly required (the zone AABBs are already uploaded).

## Gates (report every number)

- BYTE-EXACT images. Game side: copy THIS tree's `src/VolumetricPass.js` (only that file) over
  `C:\ClaudeSessions\hangar-wt\pool\node_modules\three-realtime-rt\src\VolumetricPass.js` (back up the
  original first as `VolumetricPass.js.0.16.1`); the game there serves on `http://localhost:8166/` (start
  `node node_modules/vite/bin/vite.js --host --port 8166 --strictPort` in that folder, in the background,
  if it is down; after swapping the file, `touch vite.config.js` there so vite drops its cache).
  Capture with the harness convention from `dev/merge2-check.py --only identity` (deterministic:
  `?mute=1&noadapt=1&rs=0.5&nogi=1&noguard=1&freeze=<pose>&vol=1`, hand-stepped 200 traced frames, 6 per
  sync) at TWO poses: the gallery (perf-poses.json) and a view INSIDE/AT the sun shaft (find
  `house.shaftZone` in `src/rooms/house.js` of that game tree and freeze the camera looking through it).
  A = original file, B = yours: mean |diff| must be 0.0 and max 0 (byte-identical), plus the A-vs-A floor
  from two A boots to prove the capture itself is deterministic. If A-vs-A is not byte-zero, say so and
  report B-vs-A against that floor.
- GPU time. Reuse `dev/gpu-floor.py`'s per-pass timer bracket (in the same game tree) at canvas 1.0,
  renderScale 0.2 and 0.7, gallery pose AND the shaft pose, with `?vol=1`: volumetricPass ms A vs B, plus
  the whole rt.render bracket. Expect the gallery to drop from ~20 ms toward the cost of the pre-test;
  the shaft pose keeps whatever the in-zone pixels cost (report it).
- Library: `npm run build` succeeds; the library's demo that shows fog/zones (find it under `demo/` or the
  gallery scene) still renders with the pass on (one headless boot, no console errors).
- Restore the game tree's original VolumetricPass.js at the end (Fable refreshes engine copies deliberately).

Report `dev/VOLUMETRIC-ZONE-CULL-REPORT.md` (under 100 lines, numbers first). Final message = the report.
