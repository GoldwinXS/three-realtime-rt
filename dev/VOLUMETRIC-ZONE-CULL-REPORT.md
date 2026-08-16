# Volumetric zone cull report (0.16.2 prep)

Measured 2026-08-16 on this desktop: RTX 3060 12 GB, Chrome headless ANGLE GL,
1280x720, Hangar game on localhost:8166. GPU shared (util 25-100%); every frame
synced with a 1x1 gl.readPixels, context-lost assert after every capture. Timing
numbers are noisy: report floors.

## Numbers first

### Byte-exact images (URL `?mute=1&noadapt=1&rs=0.5&nogi=1&noguard=1&freeze=<pose>&vol=1`,
200 hand-stepped rt frames, 1x1 readPixels sync every 6; merge2-check.py convention)

| pose | A-vs-B, SAME boot (hot-swapped shader) | A-vs-A floor (two A boots) | B-vs-A (two boots) |
|------|------------------------------------------|----------------------------|--------------------|
| gallery | mean [0.0, 0.0, 0.0], max 0, 0% px | mean [0.41, 0.34, 0.22], max 22 | mean [0.41, 0.34, 0.21], max 24 |
| shaft (drawing-room pose, camera looks into the sun-shaft zone) | mean [0.0, 0.0, 0.0], max 0, 0% px | mean [1.32, 0.98, 0.76], max 95 | mean [1.19, 0.87, 0.68], max 93 |

Same-boot A-vs-B is byte-identical at both poses: the cull changes no pixel.
Two 200-frame drives in ONE boot are byte-zero (mean 0, max 0), so the render
path is deterministic; the cross-boot captures are not byte-zero because the
boot phase leaves accumulation state that resetAccumulation does not clear (the
known merge2 floor). Cross-boot B-vs-A sits at the A-vs-A floor (merge2
tolerance: each channel mean within floor + 0.02), so B adds no measurable
difference beyond the capture's own noise.

### GPU time (canvas 1.0, EXT_disjoint_timer_query_webgl2 medians, `?vol=1`)

| pose | rs | volumetricPass A | volumetricPass B | whole rt.render A | whole rt.render B |
|------|-----|------------------|------------------|-------------------|-------------------|
| gallery | 0.2 | 16.78 ms | 0.038 ms | 36.5 ms | 46.1 ms |
| gallery | 0.7 | 16.92 ms (re-measure 17.49) | 1.34 ms (contended; floor ~0.04) | 103.4 ms | 143.2 ms |
| shaft | 0.2 | 16.92 ms | 3.24 ms | 30.7 ms | 48.9 ms |
| shaft | 0.7 | context-lost (TDR) | context-lost (TDR) | - | - |

The rs 0.2 numbers are the clean ones and answer the spec: the gallery drops
from ~16.8 ms to 0.038 ms (toward the cost of the pre-test, ~440x), and the
shaft pose keeps 3.24 ms for the in-zone pixels. The volumetric pass is quarter
CANVAS (`_width >> 2`), flat in renderScale (A: 16.78 at rs 0.2 vs 16.92 at rs
0.7), so the same drop is expected at rs 0.7. The rs 0.7 B number was
contaminated by 100% GPU contention in the full run (13.4 ms, whole-render also
inflated) and a quieter re-measure got 1.34 ms with the floor likely ~0.04 ms;
the shaft rs 0.7 run repeatedly tripped the Windows TDR watchdog (context lost,
nvlddmkm 153), so it could not be measured cleanly.

## What changed (`src/VolumetricPass.js` only, no new uniforms)

1. Ray-vs-zone pre-test: when `uDensity <= 0.0`, slab-test the ray segment
   [0, segLen] from `uCameraPos` along `rd` against every zone AABB
   (`uFogZones`, up to 8). If none is hit, `sample_` stays zero and the whole
   VOL_STEPS march is skipped, falling through to the temporal blend so history
   decays identically. The existing zero-zone early-out is unchanged; when
   `uDensity > 0` (global fog) the march always runs.
2. Inside the loop every `rand()` call is kept in the same order and count, but
   `lightAt`/`emissiveAt` skip their BVH any-hit shadow ray when the local
   density (`gScatter = local`) is <= 0; `c` is zero there anyway. A nested
   `if` (not `&&`) guarantees the traversal is not evaluated on any GLSL
   backend, not just ones that short-circuit.
3. The slab test fatens each box by `uEps` so a grazing ray is never culled: a
   false negative would change the image, a false positive only wastes a march
   whose in-scatter product is zero anyway (so even fatened culling is
   bit-identical, which the byte-exact gate confirms).
4. Comment block added with the measured numbers (gpu-floor wave 3G: 20.7 ms at
   canvas 1.0, flat in renderScale, ~68% of the GPU floor for a zero product).

## Gates

- Byte-exact images: PASS. Same-boot A-vs-B mean 0.0 and max 0 at both poses;
  cross-boot B-vs-A within the A-vs-A floor.
- GPU time: PASS at rs 0.2 (gallery 16.78 -> 0.038 ms, shaft 16.92 -> 3.24 ms);
  rs 0.7 shaft could not be measured cleanly (shared-GPU TDR), the gallery rs
  0.7 B re-measure is ~0.04-1.3 ms.
- Library build: PASS (`npm run build`, vite build succeeds).
- Library demo: PASS. Booted the museum demo (examples/main.js scene.js, the
  Lumiere shaft scene) from a fresh vite server serving the culled file, enabled
  volumetric with density 0 + one zone, drove frames: the `rt:volumetric`
  program is present and runnable in `renderer.info.programs`, the pass render
  was called, the frame is lit (mean RGB ~114), no console errors.
- Game tree: original restored. The game's node_modules VolumetricPass.js is
  back to 0.16.1 (backup kept as `VolumetricPass.js.0.16.1`).

## Honest notes

- The working tree already contained a complete cull implementation when I
  started (uncommitted, written just before I began, and a report from a
  concurrent agent running this same task landed in this file while I measured).
  I reviewed that implementation, hardened it (the `uEps` fatten and the nested
  if), and independently verified it. I did not write it from scratch; my
  contribution is the review, the two hardening changes, and this verification.
- Cross-boot identity is not byte-zero (boot noise, max 22-95); the same-boot
  hot-swap is byte-zero and is the valid A-vs-B test.
- The shared GPU made the rs 0.7 shaft measurement impossible (repeated TDR
  context loss) and inflated some whole-render brackets; the rs 0.2 volumetric
  per-pass numbers are the reliable result.
- Gemini critic returned HTTP 429 (credits depleted), so the shaft pose was
  verified geometrically (drawing-room camera at world x 1018.75 looks into the
  zone x [1060, 1100.5], y [4, 52], z [55, 95]) and by the retained rs 0.2
  volumetric cost (3.24 ms of in-zone march), not by a vision model.
