# Changelog

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
