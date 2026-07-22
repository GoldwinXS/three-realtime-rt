# Changelog

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
