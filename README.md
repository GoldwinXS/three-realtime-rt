# three-realtime-rt

**Turn-on ray traced lighting for three.js.** Build your scene with ordinary
three.js — meshes, `MeshStandardMaterial`, `PointLight` / `DirectionalLight` —
then swap one render call and get BVH-traced **soft shadows**, **one-bounce
global illumination**, **emissive-mesh area lights**, **mirror/glossy
reflections**, **glass refraction**, **volumetric god rays** (BVH-shadowed
single scatter, not a screen-space trick), a **procedural sky** that lights
the scene, and real-time **temporal denoising + anti-aliasing**. Runs on plain
WebGL2, no build step required by consumers.

### ▶ [Live demo](https://goldwinxs.github.io/three-realtime-rt/) — drag to orbit, drop the pile, toggle every feature.

> **Support this project:** the [supporter pack on itch.io](https://goldwinxs.itch.io/three-realtime-rt-supporter-pack) gets you a ready-to-run starter template, all example scenes, and a 12-section deep-dive guide to how the whole pipeline works. The library itself is and stays MIT.

![Ray traced outdoor scene](docs/hero.png)

```js
import { RealtimeRaytracer } from "three-realtime-rt";

const rt = new RealtimeRaytracer(renderer);
rt.compileScene(scene);              // builds the BVH + material/light tables

// render loop — replace renderer.render(scene, camera) with:
rt.render(scene, camera);
```

That's the whole integration. Everything below is optional.

---

## Why "hybrid deferred" (the "RTX on" model)

Primary visibility is **rasterized** by three.js into a G-buffer — free, fast,
and pixel-perfect on materials and textures. Only the *lighting* is ray traced,
in a fragment shader, against a GPU BVH ([three-mesh-bvh]):

1. **G-buffer pass** — MRT: albedo+roughness, world normal+metalness, world
   position, emissive.
2. **RT lighting pass** — per pixel: soft shadow rays to each light (area
   sampled) + a 1-bounce cosine-weighted GI ray with next-event estimation. GI
   rays that escape sample the **procedural sky**, so the sky is a soft area
   light. **Emissive meshes are real area lights**: their triangles are sampled
   directly (NEE with the area→solid-angle pdf), so a glowing panel casts soft
   light and shadows instead of waiting for a lucky GI ray to hit it. Metallic
   pixels trace a **mirror/glossy reflection ray**; transmissive pixels trace a
   Fresnel-weighted **reflection + two-interface refraction**. Output is
   *demodulated irradiance* (albedo divided out) so it denoises cleanly while
   textures stay sharp.
3. **Temporal reprojection** — motion-validated history keeps samples alive as
   the camera and objects move.
4. **À-trous denoise** — an edge-avoiding (SVGF-lite) wavelet filter guided by
   the G-buffer, so 1 sample/pixel looks converged.
5. **Composite** — `albedo × irradiance + emissive`, distance fog, ACES tonemap.
6. **TAA** — sub-pixel jitter + a neighbourhood-clamped history resolve:
   supersampled anti-aliasing that also clears disocclusion speckles. This is
   the analytic (FSR2 / TAAU) approach, not a learned upscaler.

Lighting is traced at half resolution by default and reconstructed by a joint
bilateral upsample + the denoiser + TAA — the same "render few pixels, rebuild
temporally" idea DLSS uses, done with hand-written math.

## Moving objects (dynamic BVH)

Mark meshes as dynamic and their motion casts **correct ray traced shadows** —
the demo drops 40 rigid bodies (Rapier physics) that shadow each other and the
ground in real time:

```js
rt.compileScene(scene, { dynamicMeshes: crates });  // meshes that will move

// each frame, after you move them (e.g. after a physics step):
rt.updateDynamic();       // re-bakes them into the BVH (refit) — cheap
rt.render(scene, camera);
```

Under the hood this is a **two-level BVH**: static geometry lives in one BVH
uploaded to the GPU once at compile time, dynamic meshes in a second small BVH
that is re-baked and refit per frame. `updateDynamic()` therefore costs
~1 ms for dozens of moving objects *regardless of how big the static world is* —
skip it entirely on frames where nothing moved.

## Live lighting & sky

Lights can be toggled, moved, and recoloured every frame without recompiling:

```js
warmLight.visible = false;      // or change .color / .intensity / .position
rt.updateLights(scene);         // re-reads the scene's lights
```

The procedural sky doubles as the ambient light source:

```js
const rt = new RealtimeRaytracer(renderer, {
  sky: {
    enabled: true,
    sunDir: new THREE.Vector3(0.55, 0.62, 0.55).normalize(), // toward the sun
    sunColor: new THREE.Color(1.0, 0.92, 0.78),
    zenith:   new THREE.Color(0.20, 0.40, 0.72),
    horizon:  new THREE.Color(0.78, 0.85, 0.92),
    intensity: 1.0,
  },
  fog: { enabled: true, color: new THREE.Color(0.72, 0.8, 0.88), density: 0.03 },
});
```

![Physics: 40 rigid bodies with dynamic ray traced shadows](docs/physics.png)

## Options

| Option | Default | What |
|--------|---------|------|
| `renderScale` | `0.5` | Lighting resolution vs. the G-buffer. `1.0` = max quality. |
| `taa` | `true` | Temporal anti-aliasing (jitter + neighbourhood clamp). |
| `denoise` | `true` | Edge-aware à-trous denoiser. |
| `gi` | `true` | 1-bounce global illumination (vs. direct-only). |
| `emissiveNEE` | `true` | Sample static emissive meshes as area lights (next-event estimation). Off = emitters only light via lucky GI rays. |
| `reflections` | `true` | Traced mirror/glossy reflections on metallic surfaces (sharpest at `renderScale: 1`). |
| `refraction` | `true` | Traced two-interface refraction for `MeshPhysicalMaterial.transmission` surfaces. |
| `ior` | `1.5` | Index of refraction used by `refraction`. |
| `volumetric` | *off* | Physically-based god rays: single-scatter fog, one BVH-shadowed light sample per lighting pixel per frame, temporally accumulated. `{ enabled, density, maxDist }`. |
| `stochasticLights` | `false` | One direct shadow ray per pixel per frame (random source) instead of one per light. |
| `temporalReprojection` | `true` | Keep samples across camera/object motion. |
| `maxHistory` | `128` | History cap — higher is smoother, slower to react. |
| `fireflyClamp` | `4.0` | Clamp on indirect luminance to suppress fireflies. |
| `sky` | *off* | Procedural sky as background + GI ambient (see above). |
| `fog` | *off* | Distance fog, composited before tonemap. |

Per-light: set `light.userData.rtRadius` for soft-shadow size. Set
`mesh.userData.rtExclude = true` to keep a mesh out of the BVH (it still
rasterizes and gets lit — useful for water / translucent surfaces).
Transparent materials never act as occluders (a glass case shouldn't cast an
opaque shadow); `alphaTest` cut-outs still do.

## Running everywhere (capability tiers)

Nothing adaptive is imposed — everything below is **opt-in**:

- **No usable GPU** (missing WebGL2 float targets, or a software rasterizer
  like SwiftShader): the library logs one console warning and `rt.render()`
  silently falls back to plain `renderer.render()`. Your app runs everywhere
  with zero capability checks; query `rt.supported` or the static
  `RealtimeRaytracer.isSupported(renderer)` if you want to branch yourself.
- **Tier presets**: `RealtimeRaytracer.detectTier(renderer)` returns
  `"none" | "mid" | "high"`, and `recommendedOptions(tier)` gives matching
  constructor options — spread them, then override what you like:

  ```js
  const tier = RealtimeRaytracer.detectTier(renderer);
  const rt = new RealtimeRaytracer(renderer, {
    ...RealtimeRaytracer.recommendedOptions(tier),
    targetFps: 55,
  });
  ```

- **Adaptive quality** (`adaptiveQuality: true`, default **false**): continuous
  dynamic resolution scaling. Watches real frame time and steers the lighting
  resolution smoothly toward `targetFps` (in 5% steps with a cooldown), pairing
  low resolutions with MORE denoise passes (they run at lighting res, so
  they're nearly free exactly where they're needed) and stochastic direct
  light. While enabled it drives `renderScale` / `stochasticLights` /
  `denoiseIterations`; turn it off for manual control.
- **`stochasticLights: true`** (default false): one direct shadow ray per
  pixel per frame instead of one per light — the biggest ray-count lever for
  many-light scenes and mobile GPUs.

WebGPU: not used as a backend (this is a WebGL2 library); a WGSL compute
backend is on the roadmap.

## Running the demo

```bash
npm install
npm run dev       # http://localhost:8115
```

The demo ([`examples/`](examples/)) is an ordinary three.js app — see
[`examples/main.js`](examples/main.js) for the full, commented integration
(scene → physics → compile → render loop). `npm run deploy` builds and publishes
it to GitHub Pages.

## Roadmap

| Stage | Status | What |
|-------|--------|------|
| 1. Core | ✅ | Scene→GPU sync, BVH, G-buffer, traced shadows + 1-bounce GI, accumulation |
| 2. Reprojection | ✅ | Motion-validated history — samples survive camera motion |
| 3. Denoiser | ✅ | Edge-avoiding à-trous (SVGF-lite) → clean 1spp |
| 4. TAA | ✅ | Sub-pixel jitter + neighbourhood-clamped resolve → AA, no speckles |
| 4b. Sky | ✅ | Procedural sky as background + GI ambient light source |
| 5. Two-level BVH | ✅ | Static BVH uploaded once; movers in a small per-frame BVH → dynamic shadows at ~1 ms |
| 5b. Area lights | ✅ | Emissive meshes sampled directly (NEE) — glowing panels cast soft light + shadows |
| 6. Specular | ✅ | Mirror/glossy reflections on metals + two-interface glass refraction |
| 7. Publish | — | npm publish; refractive water; per-material IOR |

## Credits

- [three-mesh-bvh] by Garrett Johnson — the GPU BVH this is built on.
- Inspired by [Erich Loftis'][erichlof] `THREE.js-PathTracing-Renderer`.
- Demo models: Khronos glTF sample assets (Damaged Helmet, Duck).

## License

MIT © Goldwin Stewart

[three-mesh-bvh]: https://github.com/gkjohnson/three-mesh-bvh
[erichlof]: https://github.com/erichlof/THREE.js-PathTracing-Renderer
