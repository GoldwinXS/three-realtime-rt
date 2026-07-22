# three-realtime-rt

**Turn-on ray traced lighting for three.js.** Build your scene with ordinary
three.js — meshes, `MeshStandardMaterial`, `PointLight` / `DirectionalLight` —
then swap one render call and get BVH-traced **soft shadows**, **one-bounce
global illumination**, **emissive-mesh area lights**, **mirror/glossy
reflections**, **glass refraction**, **volumetric god rays** (BVH-shadowed
single scatter, not a screen-space trick), a **procedural sky** that lights
the scene, **ReSTIR many-light sampling** (flat cost in light count),
**blue-noise sampling**, and real-time **temporal denoising + anti-aliasing**.
Runs on plain WebGL2.

This round adds **GGX PBR specular** — Cook-Torrance dielectric highlights in a
separate specular buffer, so `roughness` finally matters on non-metals — plus
**normal / roughness / metalness maps**, **alpha-blended transparency**
(single-layer deferred blend), **deforming dynamic meshes** (a mirror-water pool
whose traced reflections follow the live wave surface), **overscan** to hide
leading-edge convergence noise while the camera turns, and **emissive importance
sampling** (area × luminance) for calmer area lights. The zero-config renderer
now ships **conservative, self-scaling defaults** — it starts low-but-ray-traced
and an on-by-default governor scales quality up toward `targetFps`; an optional
async **GPU tier probe** reads real WebGPU adapter limits for a smarter starting
point.

The library ships as **untranspiled ES modules** (the `src/` folder) — it has no
build step of its own, so you consume it through your bundler (Vite, webpack,
esbuild, …) or a browser import map that resolves the bare `three` /
`three-mesh-bvh` specifiers. MIT licensed.
[On npm](https://www.npmjs.com/package/three-realtime-rt): `npm i three-realtime-rt three three-mesh-bvh`.

### ▶ [Live demo](https://goldwinxs.github.io/three-realtime-rt/) — drag to orbit, drop the pile, toggle every feature.

> **Support this project:** the [supporter pack on itch.io](https://goldwinxs.itch.io/three-realtime-rt-supporter-pack) gets you a ready-to-run starter template, all example scenes, and a 12-section deep-dive guide to how the whole pipeline works. The library itself is and stays MIT.

![Ray traced room: emissive area light, reflections, glass, volumetric haze](docs/hero.png)

Same scene, same camera, same lights — plain three.js (shadow maps + ACES) on
the left, `rt.render` on the right:

| Rasterized three.js | three-realtime-rt |
|---|---|
| ![raster](docs/compare-raster.jpg) | ![ray traced](docs/compare-rt.jpg) |

## Getting started

Install the library plus its two **peer dependencies** — you bring your own copy
of `three` and `three-mesh-bvh`:

```bash
npm i three-realtime-rt three three-mesh-bvh
```

No bundler? [`standalone.html`](standalone.html) is a single copy-paste file
that runs the raytracer via CDN import maps — open it from any static server.

A complete, copy-pasteable minimal app — a lit sphere on a floor, one point light:

```js
import * as THREE from "three";
import { RealtimeRaytracer } from "three-realtime-rt";

// 1. An ordinary three.js renderer. Size it BEFORE constructing the raytracer —
//    it reads the drawing-buffer size at construction.
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. An ordinary scene: meshes with MeshStandardMaterial + a real light.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 2, 6);

scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(1, 48, 48),
  new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4, metalness: 0.0 })
));
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 1.0 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

const light = new THREE.PointLight(0xffffff, 40);   // Point / Spot / Directional (up to 32)
light.position.set(3, 5, 2);
scene.add(light);

// 3. Turn on ray tracing.
const rt = new RealtimeRaytracer(renderer);
rt.compileScene(scene);              // builds the BVH + material/light tables

// 4. Resize: pass DRAWING-BUFFER (device) pixels, not CSS pixels.
addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const db = renderer.getDrawingBufferSize(new THREE.Vector2());
  rt.setSize(db.x, db.y);
});

// 5. Render loop — replace renderer.render(scene, camera) with rt.render.
function loop() {
  requestAnimationFrame(loop);
  rt.render(scene, camera);
}
loop();
```

On hardware that can't trace, `rt.render` transparently falls back to
`renderer.render` — no capability branch needed (see [Running everywhere](#running-everywhere-capability-tiers)).

> **Defaults are conservative.** Zero-config construction
> (`new RealtimeRaytracer(renderer)`) starts *low but still ray traced* — half
> lighting resolution, stochastic direct light, a lean denoise — so it runs
> acceptably on weak discrete and integrated GPUs out of the box. The adaptive
> governor is **on by default** and scales quality **up** toward `targetFps`
> when it measures headroom (a strong desktop climbs to full-resolution
> lighting within a couple of seconds). Want to start higher, or pin a level?
> Pass `RealtimeRaytracer.recommendedOptions(RealtimeRaytracer.detectTier(renderer))`
> (or `probeGPUTier()` — see [Running everywhere](#running-everywhere-capability-tiers)),
> or explicit options.

### Integrating into an existing app

A checklist for dropping the tracer into a scene you already have:

1. **Swap the render call** — `renderer.render(scene, camera)` →
   `rt.render(scene, camera)`. Construct the `RealtimeRaytracer` once, *after*
   the renderer has its final size.
2. **Compile once; recompile after structural changes** — `rt.compileScene(scene)`
   bakes geometry into a static BVH and snapshots materials + emissive area
   lights. Call it again after you add/remove meshes, swap geometry, or change a
   material's `emissive` / `color` / `roughness` / `metalness`.
3. **Declare movers** — pass moving meshes to
   `rt.compileScene(scene, { dynamicMeshes: [...] })`, then call
   `rt.updateDynamic()` each frame after you move them (e.g. after a physics
   step). Skip it on frames where nothing moved.
4. **Update lights when they change** — after moving, toggling (`.visible`),
   recolouring or dimming a light, call `rt.updateLights(scene)`. No recompile.
5. **Resize** — in your resize handler, after `renderer.setSize(...)`, call
   `rt.setSize(width, height)` with **drawing-buffer (device) pixels**
   (`renderer.getDrawingBufferSize(...)`).
6. **Reset after jumps** — call `rt.resetAccumulation()` after a camera teleport
   or a scene cut, so stale temporal history doesn't ghost.

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

### Debug views

Set `rt.outputMode` (the demo's **view** dropdown) to inspect a single stage
instead of the composited image:

| Mode | View | Shows |
|------|------|-------|
| `0` | composite | Final tonemapped image (default). |
| `1` | albedo | G-buffer base colour. |
| `2` | normals | World-space normals, `×0.5 + 0.5`. |
| `3` | irradiance | Demodulated diffuse lighting (direct + GI), pre-albedo. |
| `4` | world pos | World position, `fract(p × 0.1)`. |
| `5` | emissive | G-buffer emissive. |
| `6` | specular | The dielectric specular buffer. |
| `7` | **bvh cost** | Heatmap of how many BVH nodes this pixel's shadow rays visit. |

**Reading the BVH-cost heatmap.** Mode 7 counts, per pixel, the total BVH nodes
visited by every shadow ray the lighting pass casts that frame (the ReSTIR
winner / stochastic / per-light rays, plus reflection and glass occlusion rays),
and maps the count through a cold→hot palette: **blue is cheap** (few boxes),
through green and yellow, to **red and white for the most expensive** pixels. Hot
regions mean many box tests per shadow ray — dense or overlapping geometry, long
thin triangles whose bounding boxes overlap wastefully, or rays skimming almost
parallel to a surface (they thread a long corridor of the tree before they
either hit or escape). It bypasses temporal blending and the denoiser, so it is a
raw per-frame snapshot. `rt.costScale` sets the mapping (default `1/96`, so ~96
visits saturate to white); the demo's **cost scale** slider drives it as
"visits-to-saturate" so you can rescale the range to your scene.

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

### Deforming meshes (water, cloth)

By default a dynamic mesh is **rigid**: its vertices are snapshotted at compile
time and only re-transformed by `mesh.matrixWorld` each frame — so CPU edits to
its `position` attribute show in the rasterized image but the *traced* rays
(shadows, GI, reflections) still hit the original shape. For a mesh whose
vertices actually move on the CPU (a water surface, cloth, a morph target), set
`userData.rtDeforming` so the raytracer re-reads its live geometry every frame:

```js
water.userData.rtDeforming = true;           // opt in
rt.compileScene(scene, { dynamicMeshes: [water, ...crates] });

// each frame:
deformWaterVertices(water.geometry, t);       // your CPU wave/cloth solver
water.geometry.attributes.position.needsUpdate = true;
water.geometry.computeVertexNormals();        // REQUIRED — see below
rt.updateDynamic();                            // re-reads the live vertices
rt.render(scene, camera);
```

Two requirements:

- **You own the normals.** The tracer reads the mesh's live `normal` attribute
  for deforming segments — it does not recompute them. Call
  `geometry.computeVertexNormals()` (or update the attribute yourself) after
  moving the vertices, or the shading/reflections will track the old silhouette.
- **The vertex count is fixed at compile time.** Deforming an existing surface is
  free; changing its topology (adding/removing vertices) is not — `updateDynamic()`
  throws with a clear message telling you to `compileScene()` again.

**Cost model.** A deforming segment is re-baked from its live vertices every
frame and its normals are re-uploaded every frame (rigid movers amortize the
normal upload over 8 frames). Both are O(dynamic triangles), and the cheap
per-frame BVH `refit()` (kept for surfaces that stay roughly in place, like a
water plane) is O(dynamic tris) too — so **keep deforming meshes low-poly**. A
`48×48` plane is ≈ 4.6k triangles, which refits in well under a millisecond; a
`256×256` plane (~131k tris) will dominate the frame. The demo's mirror-water
pool is a `48×48` plane.

### Skinned meshes (animated characters)

A `SkinnedMesh` is **auto-detected** — just list it in `dynamicMeshes` (no
`userData` flag) and it is CPU-skinned into the dynamic BVH every frame, so an
animated character casts a **traced shadow that moves with its gait** and
rasterizes in its animated pose (not bind pose) in the G-buffer:

```js
rt.compileScene(scene, { dynamicMeshes: [...crates, foxMesh] }); // foxMesh.isSkinnedMesh

// each frame:
mixer.update(dt);                 // advance the AnimationMixer
foxRoot.updateMatrixWorld(true);  // pose the skeleton (bones -> world matrices) NOW
rt.updateDynamic();               // CPU-skins the live pose into the BVH
rt.render(scene, camera);
```

- **Skin the pose before `updateDynamic()`.** The CPU skinning reads each bone's
  `matrixWorld` (via three's `SkinnedMesh.applyBoneTransform` / `getVertexPosition`,
  which apply the bind matrix, bone weights and bone matrices), so the skeleton
  must be posed for this frame first. `mixer.update(dt)` then a forced
  `updateMatrixWorld` on the character root does that — otherwise the traced
  shadow lags the raster by a frame. (three r160's `applyBoneTransform` returns
  the vertex in the mesh's **local/bind-relative** space; the tracer applies
  `matrixWorld` itself, exactly like a rigid mover.)
- **Two sampler-friendly shortcuts.** Skinning is done for the mesh's *unique*
  source vertices once per frame (shared triangle-soup slots reuse the result),
  and secondary-ray **normals are per-face** — recomputed from the skinned
  triangle positions rather than CPU-skinning the normal attribute. Flat-shaded
  secondary rays are indistinguishable for shadows/GI, and **primary visibility
  still gets smooth normals from the raster path** (the G-buffer skins the normal
  properly via three's own `skinnormal_vertex` chunk). If your character's
  geometry ships without a `normal` attribute (some glTF do — e.g. the Khronos
  Fox), call `geometry.computeVertexNormals()` once after load so the raster path
  has bind-pose normals to skin.

**Cost model.** CPU skinning is O(source verts × 4 bones) with zero per-vertex
allocation, plus the usual O(dynamic tris) BVH refit and normal upload. Budget
~**10–20k total skinned source vertices to stay sub-2 ms**; the demo's Fox is
≈ 1.7k source verts and skins in ≈ 0.3 ms. As with any dynamic mesh, keep the
skinned tris low and there is no static-world cost.

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

## What is and isn't supported

Primary visibility is rasterized into a G-buffer, so **whatever three.js draws,
you still see** — the ray tracer computes only the *lighting*, reading a
deliberately small, fixed slice of the material and light model. The one place
the G-buffer diverges from a plain three.js draw is transparency: it is a
**single-layer deferred blend** (see the `transparent` row below and the
Rendering-model notes), not three.js's per-fragment sorted over-blend. This is
the honest map of what actually feeds the traced lighting.

### Materials

Lighting reads the scalar fields of `MeshStandardMaterial` / `MeshPhysicalMaterial`
(Basic / Lambert / Phong contribute whatever of those fields they have). A
**multi-material mesh** (`mesh.material` is an array + `geometry.groups`) now feeds
**every group's** material into both the G-buffer and the BVH (see the *2nd+
material of a group* row).

| Property | Feeds lighting? | Notes |
|----------|-----------------|-------|
| `color` + `map` | ✅ | Albedo = `color × map.rgb`. Textures stay sharp (irradiance is demodulated, then re-multiplied). |
| `roughness` | ✅ | Drives shadow / GI softness, reflection sharpness **and the GGX specular lobe width** (see *dielectric specular* below). |
| `metalness` | ✅ | Metallic pixels trace a reflection ray whose analytic-light glints are shadowed; `F0 = mix(0.04, albedo, metalness)`. |
| `emissive` | ✅ | A *static* emissive mesh becomes a real **area light** (NEE) — casts soft light + shadows, including a GGX highlight. |
| `emissiveMap` | ⚠️ visible only | A map-masked emissive **glows on screen** but the map **zeroes its area-light table** — it lights nothing. Use a flat `emissive` colour (no map) for an emitter that should illuminate. |
| `transmission` (Physical) | ✅ | Glass: Fresnel reflection (with analytic-light glints) + two-interface refraction. |
| `transparent` + `opacity` | ✅ | Alpha blend: the surface is composited over the geometry behind it (a straight-through traced ray), weighted by scalar `opacity` and **tinted by `color`/`map`**. The behind-radiance rides the **specular buffer** and the opacity blend happens at **composite** (where the pane's albedo lives), so **needs `specular: true`** — with the specular buffer off, blend surfaces degrade to opaque. Single layer — nearest transparent surface wins, overlapping panes don't inter-sort. Kept out of the BVH, so it casts no shadow. Toggle with `transparency`. |
| `opacity` on an opaque material | ❌ | Only read when `transparent: true`; an opaque material always writes at full coverage. |
| **dielectric specular** | ✅ | Cook-Torrance **GGX** direct highlights for *every* surface, in a separate white (`F0 ≈ 0.04`) specular buffer the composite adds without the albedo multiply. Toggle with `specular` (default on). |
| `roughnessMap` | ✅ | `roughness × roughnessMap.g` (three.js convention) — sampled in the G-buffer. |
| `metalnessMap` | ✅ | `metalness × metalnessMap.b` (a packed ORM texture works — G = roughness, B = metalness). |
| `normalMap` | ✅ | Perturbs the shading normal via a screen-space cotangent frame (no tangent attribute needed); respects `material.normalScale`. |
| `clearcoat`, `sheen`, `iridescence` | ❌ | Per-pixel lobe parameters have **no remaining G-buffer channel** — the 4-MRT WebGL2 guarantee is fully packed (see the `GBufferPass` layout comment), so these stay unmodelled rather than risk corrupting the packing; revisit if a WebGPU backend lands. |
| vertex colors | ✅ | Geometry `color` attribute (3- or 4-component; `.rgb` used) multiplies into G-buffer albedo, gated so meshes without one render byte-identically. **Caveat:** secondary GI/reflection rays see the flat `material.color` (same as texture maps). |
| per-material `ior` | ✅ | `MeshPhysicalMaterial.ior` refracts per material, encoded in the packed material word for fully-transmissive glass. Supported range **[1.0, 1.98]** (values clamp; the tight ceiling keeps the packed word clear of the alpha-blend boundary). `rt.ior` is the global fallback (partial-transmission glass + the default); **`material.ior` wins when present**. |
| 2nd+ material of a group | ✅ | Each group material of a multi-material mesh (`mesh.material` array + `geometry.groups`) is registered separately in the G-buffer **and** the BVH, with per-vertex material indices; emissive group materials also join the NEE area-light list. **Limits:** opaque groups only (a transparent group throws — split it out); not supported on CPU-deforming (`rtDeforming`) meshes (throws). |

### Lights

| Light | Supported | Notes |
|-------|-----------|-------|
| `PointLight` | ✅ | `light.userData.rtRadius` (default `0.15`) sets soft-shadow size. |
| `DirectionalLight` | ✅ | `light.userData.rtRadius` (default `0.02`) sets sun softness; keep its direction in sync with `sky.sunDir`. |
| Emissive meshes | ✅ static | Sampled directly as area lights. **Dynamic** emitters are *not* in the NEE list — they light only via GI-ray hits. |
| `SpotLight` | ✅ | Cone + penumbra respected; soft shadows via `rtRadius`; visible light cones in volumetric fog. |
| `RectAreaLight` | ❌ | Use an emissive mesh instead. |
| `HemisphereLight` / `AmbientLight` | ❌ | Ignored — the procedural `sky` (or `envColor`) provides ambient. |

- **Emissive noise caveat:** emissive NEE is the noisiest direct-light path — one
  uniformly-picked triangle sample per pixel per frame, with a `1/dist²` term that
  sparkles into fireflies near small, close emitters. **Keep `restir: true` in any
  scene that leans on emissive lighting** (the reservoirs converge each pixel onto
  the emitter that matters; the library logs a hint if you compile emissive
  geometry with ReSTIR off). Prefer larger/dimmer emitter surfaces over tiny
  bright ones, and let `fireflyClamp` do its job.
- Up to **32** point/directional lights (`MAX_LIGHTS`); further lights are dropped.
- Moving, toggling, recolouring or dimming a light → `rt.updateLights(scene)` (cheap, no recompile).
- Changing a mesh's **emissive** (it's an area light baked at compile time) → `rt.compileScene(...)` again.
- Emissive area lights are capped at **256 triangles** (largest by area kept, with a console warning) — prefer low-poly emitter meshes.

### Geometry & occlusion

- Every non-excluded visible mesh is **merged into one static BVH at compile time**. Add / remove geometry → recompile.
- Meshes that move must be declared via `dynamicMeshes` and driven with `updateDynamic()`. Anything not declared is treated as static — moving it on screen won't move its traced shadow.
- **Transparent materials never occlude** (by design — a glass case shouldn't cast an opaque shadow). They still rasterize normally.
- **`alphaTest` cut-outs** (`transparent: false`) *do* occlude — but as **full triangles**, not per-texel, so their shadows are blocky.
- `mesh.userData.rtExclude = true` removes a mesh from the BVH entirely (it still rasterizes and gets lit) — handy for water / translucent surfaces.

### Rendering model

- **1-bounce GI + direct light.** No multi-bounce diffuse, no caustics, no specular-chain paths.
- **Reflections** are a single traced bounce into a **diffuse-shaded** view of the world — no recursive mirror-in-mirror; a metal shows its surroundings, not a second full render.
- **Refraction** is two-interface (front + back). IOR is **per material** (`MeshPhysicalMaterial.ior`, encoded in the G-buffer for fully-transmissive glass, range [1.0, 1.98]); `rt.ior` is the global fallback. Convincing glass, not a spectral / dispersive renderer.
- **Volumetric** is **single-scatter** god rays, not multiple-scattering fog.
- **Transparency** is a **single-layer deferred blend**: a `transparent` surface writes as the nearest layer of the G-buffer and the lighting pass composites it over the geometry behind by tracing one straight-through ray. The behind-radiance is fully lit (direct + 1-bounce GI) and tinted by the pane's albedo. Overlapping transparent surfaces do **not** inter-sort (only the nearest is kept), and there is no per-pixel back-to-front over-blend of many layers as in raster three.js. Turn it off with `transparency: false` (blend surfaces then render fully opaque).

### Platform

- Requires **WebGL2 + `EXT_color_buffer_float`**. Software rasterizers (SwiftShader / llvmpipe) are treated as unsupported.
- On anything unsupported, `rt.supported === false` and `rt.render()` **falls back to `renderer.render()`** after one console warning — your app still runs everywhere. Branch yourself with `rt.supported` or `RealtimeRaytracer.isSupported(renderer)` if you want.
- WebGL2 only; no WebGPU backend (on the roadmap).

## Options

| Option | Default | What |
|--------|---------|------|
| `renderScale` | `0.5` | Lighting resolution vs. the G-buffer. `1.0` = max quality. |
| `overscan` | `0` | Render past the canvas edges and crop the centre back, so leading-edge disocclusion noise during camera motion is born off-screen. Padding fraction per edge (0–0.25); `0.1` costs 1.44× the pixels. See *Edge convergence and overscan*. |
| `adaptiveQuality` | `true` | Governor that steers `renderScale` / `denoiseIterations` / `stochasticLights` toward `targetFps` — scales **up** on strong hardware, **down** on weak. Turn off for manual control. |
| `denoiseIterations` | `2` | À-trous denoise passes; the governor raises this as it lowers resolution. |
| `taa` | `true` | Temporal anti-aliasing (jitter + neighbourhood clamp). |
| `denoise` | `true` | Edge-aware à-trous denoiser. |
| `gi` | `true` | 1-bounce global illumination (vs. direct-only). |
| `emissiveNEE` | `true` | Sample static emissive meshes as area lights (next-event estimation). Off = emitters only light via lucky GI rays. |
| `emissiveImportance` | `true` | Pick WHICH emissive triangle NEE samples proportional to **area × emitted luminance** (compile-time power CDF) instead of a uniform 1-of-N. Same mean, far less sparkle when emitters differ in size/brightness. Off = legacy uniform pick. |
| `specular` | `true` | Cook-Torrance **GGX** dielectric highlights for every surface, in a separate white (`F0 ≈ 0.04`) buffer the composite adds without the albedo multiply. Off = the old Lambert-only look. Also required by `transparency`. |
| `reflections` | `true` | Traced mirror/glossy reflections on metallic surfaces (sharpest at `renderScale: 1`). |
| `refraction` | `true` | Traced two-interface refraction for `MeshPhysicalMaterial.transmission` surfaces. |
| `transparency` | `true` | Alpha-blended transparency: composite `transparent` meshes over the geometry behind them (single-layer, weighted by `opacity`, tinted by albedo). Needs the specular buffer (`specular: true`). Off = they render fully opaque. |
| `restir` | `true` | ReSTIR direct lighting: per-pixel reservoirs with temporal + spatial reuse, one visibility ray regardless of light count. Flat cost in light count; cuts emissive area-light noise. |
| `restirGI` | `false` | **Experimental.** ReSTIR GI (v2, fused spatiotemporal): per-pixel reservoirs reuse the 1-bounce indirect sample across frames at the reprojected same-surface point, then take `restirGISpatialTaps` spatial taps (default `2`, `0` = v1 temporal-only) of the previous frame's reservoirs — each reweighted by the reconnection solid-angle→area Jacobian and validated by a final visibility ray so light does not leak through walls. Runs in a standalone pass with its own sampler budget; the lighting pass then skips its inline GI trace and the resolved GI is added at the à-trous denoise stage — so it only takes effect when `gi` **and** `denoise` are also on. Its mean matches the inline GI path; the spatial taps cut per-frame variance. `restirGIMCap` (default `20`) tunes the temporal M-cap. `restirGIValidate` (default `8`, `0` = off) sets the reservoir-sample validation period: each frame a rotating 1-in-N subset of pixels re-aims its single candidate ray at the reservoir's stored hit and re-shades it; if the geometry moved or the re-shaded target collapsed to near-black (a light switched off) the reservoir is killed so fresh candidates rebuild, otherwise it is left untouched. This reuses the existing candidate trace (no extra bounce rays) and is what makes a switched-off light stop haunting the reservoir instead of fading slowly, while a static scene stays put. |
| `ior` | `1.5` | **Global fallback** index of refraction for `refraction`. A `MeshPhysicalMaterial.ior` overrides it per material (fully-transmissive glass, range [1.0, 1.98]); this value applies to partial-transmission glass and as the default. |
| `volumetric` | *off* | Physically-based god rays: single-scatter fog, one BVH-shadowed light sample per lighting pixel per frame, temporally accumulated. `{ enabled, density, maxDist, zones }`, where `zones` is an optional array of up to 8 AABBs `{ min:[x,y,z], max:[x,y,z], density }` that add localized fog on top of (or instead of) the global `density`. |
| `stochasticLights` | `true` | One direct shadow ray per pixel per frame (random source) instead of one per light. The governor turns it off once it has scaled resolution up on strong hardware. |
| `temporalReprojection` | `true` | Keep samples across camera/object motion. |
| `maxHistory` | `128` | History cap — higher is smoother, slower to react. |
| `fireflyClamp` | `4.0` | Clamp on indirect luminance to suppress fireflies. |
| `costScale` | `1/96` | BVH-cost heatmap scale for the `outputMode: 7` debug view (shadow-ray node-visit count × this, mapped through a cold→hot palette). See *Debug views*. |
| `sky` | *off* | Procedural sky as background + GI ambient (see above). |
| `fog` | *off* | Distance fog, composited before tonemap. |

Per-light: set `light.userData.rtRadius` for soft-shadow size. Set
`mesh.userData.rtExclude = true` to keep a mesh out of the BVH (it still
rasterizes and gets lit — useful for water / translucent surfaces).
Transparent materials never act as occluders (a glass case shouldn't cast an
opaque shadow); `alphaTest` cut-outs still do.

## Edge convergence and overscan

Lighting is accumulated over time (temporal reprojection). When the camera
moves, pixels newly revealed at the **leading screen edge** have no history to
reproject from, so they start from a single noisy sample and take several frames
to converge — a shimmering band that rides the edge you are turning toward.

`overscan` hides it by rendering *bigger than the screen*. Every internal pass
(G-buffer, lighting, denoise, volumetric, composite, TAA history) runs at a
padded resolution with a proportionally **widened field of view**, and only the
final on-screen draw crops the central canvas-sized region out. Disoccluded
pixels are then born in the padding — off-screen — and have already converged by
the time the camera turns far enough to bring them into view.

```js
const rt = new RealtimeRaytracer(renderer, { overscan: 0.1 });
// or live: rt.overscan = 0.05;  (reallocates targets; resets accumulation)
```

`overscan` is the padding fraction **per edge**. `0.1` on a 1000×600 canvas
renders 1200×720 internally and crops the central 1000×600 — both axes pad by
the same fraction, so aspect ratio is preserved and the widened frustum stays
centred on your camera's. The cost is purely the extra pixels: `1 + 2·overscan`
per axis, so **0.1 → 1.44×** the work of every pass. **0.05–0.1** is the useful
range; more just spends pixels on padding you will rarely turn fast enough to
need. Changing it live reallocates the targets and resets accumulation, so treat
it as a settings-time knob rather than a per-frame one. The camera you pass to
`render()` is never mutated — the widened projection is applied and restored
internally each frame, exactly like the TAA jitter.

## Running everywhere (capability tiers)

The zero-config defaults are **conservative and self-scaling**: construction
starts low-but-ray-traced and the adaptive governor (on by default) walks
quality up or down toward `targetFps`. The knobs below let you set a smarter
starting point or take manual control:

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

- **GPU probe** (`await RealtimeRaytracer.probeGPUTier(renderer?)`): an optional,
  async, more-informed alternative to `detectTier`. When the browser exposes
  **WebGPU** it inspects the real adapter limits; otherwise it falls back to the
  WebGL heuristic. Returns `{ tier, source: "webgpu"|"webgl"|"fallback", details }`.

  ```js
  const probe = await RealtimeRaytracer.probeGPUTier(renderer);
  const rt = new RealtimeRaytracer(renderer, RealtimeRaytracer.recommendedOptions(probe.tier));
  ```

  **Honest heuristic — WebGPU does NOT expose VRAM.** There is no API for actual
  video memory, so the probe uses `adapter.limits` (`maxBufferSize`,
  `maxTextureDimension2D`, …) as a *proxy* for GPU class — two cards with wildly
  different VRAM can report the same limits. `adapter.info`
  (vendor/architecture/description) is masked on many browsers, so it is a hint
  only. Screen resolution is factored in: `screenPixels = screen.width *
  screen.height * min(devicePixelRatio, 2)`; a 4K-class panel (`>= 6e6`) has to
  fill ~4× the pixels of 1080p, so a GPU is only rated `"high"` on such a screen
  when `maxBufferSize >= 4GiB` (otherwise it is demoted to `"mid"`). Software
  renderers (SwiftShader / llvmpipe) rate `"none"`. Every threshold and the raw
  values are echoed back in `details`. The constructor stays synchronous — this
  is a pre-construction, opt-in call.

- **Adaptive quality** (`adaptiveQuality: true`, default **true**): continuous
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

The demo ([`examples/`](examples/)) is a **panoramic museum gallery** — a
Cornell-style room (saturated red/teal side walls for obvious colour bleed, open
top) staged as an exhibit where every renderer feature gets its own vignette: a
**deforming mirror-water pool** under the emissive gallery light, the
DamagedHelmet hero on a pedestal under a toggleable **spotlight** (normal /
roughness maps + analytic-light glints), a glossy teapot showing **GGX dielectric
specular** against the teal wall, a gold torus knot and mirror sphere (traced
reflections), a glass sphere (refraction), a roughness ramp on plinths, and the
**duck in a glass vitrine** (alpha-blended transparency that casts no shadow onto
the exhibit). An always-on **fps readout** sits top-left and a **collapsible
control panel** (starts collapsed on phones) toggles every feature, drives a
clerestory-window light slider, and spawns the 40-body physics pile. See
[`examples/main.js`](examples/main.js) for the full, commented integration
(scene → physics → compile → render loop). `npm run deploy` builds and publishes
it to GitHub Pages.

## Gallery & benchmarks

[`gallery.html`](gallery.html) opens on a built-in **Cornell box** (the classic
GI reference — coloured walls, an emissive ceiling panel) and drops the raytracer
into **stock glTF scenes it was never authored for** — Littlest Tokyo, Lantern,
Damaged Helmet, Antique Camera, BoomBox, Corset, Water Bottle, Toy Car,
Iridescence Lamp, Mosquito in Amber, and Fox — streamed straight from their
public hosts (no assets committed). A one-button toggle A/Bs ray tracing against
plain rasterized three.js with an fps + triangle readout, and a compact options
strip exposes GI / emissive NEE / reflections / refraction / ReSTIR / denoise /
TAA / volumetric plus lighting-resolution and auto-quality controls.

[`bench.html?autorun=1`](bench.html) runs a matrix of feature configs with
GPU-**fence-timed** frame costs and a temporal **ghosting metric**, writing each
run's results to [`bench-results/`](bench-results/) for tracking regressions.

### Movement-artifact harness

[`harness.html`](harness.html) makes the **edge-of-screen convergence noise seen
while the camera moves** measurable and eyeball-able. It drives the demo scene
along a deterministic path (`strafe` — sinusoidal side-to-side — or `orbit`;
pose is a pure function of sim-time) and, every couple of frames, reads three
vertical bands off the drawing buffer — the outer 10% at each edge and the
central 10% — tracking **per-pixel temporal luminance variance** over a sliding
window. The HUD reports the three mean-variance numbers; the headline is the
**edge-vs-center ratio** (>1 = edges noisier than the middle — the artifact the
overscan feature targets). A magnified side-by-side inset shows a left-edge strip
next to a center strip for human comparison, and the metric triple is logged as a
JSON line to the console every 2s for automated scraping. The overscan control
is **feature-detected** — it appears only when the loaded build exposes an
`overscan` property.

## Render self-test

The renderer can pass every compile and framebuffer check and still draw a black
screen — that is exactly what shipped in 0.4.0 on iOS (WebKit's GLSL-to-Metal
translation silently broke at a 4th `traceRadiance` call site; clean compile, no
console error, black output). The only defence against that class of failure is
to **look at the pixels**, so the demo has a headless-friendly self-test.

**In the browser:** load [`/?selftest=1`](examples/selftest.js). It forces the
full lighting stack on (GI + emissive NEE + reflections + refraction, lighting at
50%), renders the normal gallery scene, and after **90 rendered frames** reads
the drawing buffer back and emits one JSON line to the console (`[selftest] …`)
and into a hidden `#selftest-verdict` DOM node:

```json
{ "pass": true, "meanLum": 139.08, "irrLum": 169.73, "glErrors": 0,
  "specMRT": true, "supported": true, "frames": 91, "ua": "…" }
```

The pass gate wants `meanLum` in `[12, 230]` (calibrated: a healthy composite of
the gallery centre reads ~140 on desktop; a black screen reads ~0), `irrLum > 6`,
`glErrors == 0` and `supported == true`.

- `meanLum` / `irrLum` — mean Rec.709 luma (0–255) of the **centre 25%** of the
  composite, and of the raw irradiance buffer (`outputMode 3`) for one frame. The
  irradiance readback proves the **lighting** is alive, not just emissive geometry
  surviving the composite (0.4.0's black image still showed emitters). A near-zero
  reading is the black-screen class; the pass gate wants a lit mid-range value.
- `glErrors` — count of nonzero `gl.getError()` samples (any nonzero fails).
- `specMRT` / `supported` — the two capability fallbacks, for triage.

The page keeps rendering after the verdict so a human can watch. This mode builds
the renderer with `preserveDrawingBuffer: true` so the canvas can be read back;
normal runs keep the cheaper default.

**In CI:** `npm run test:render` ([`scripts/selftest.mjs`](scripts/selftest.mjs))
starts vite on a free port and drives `?selftest=1` through Playwright across
**chromium, firefox and webkit**, printing a pass/fail/skip table and exiting
nonzero on any real failure (a documented environmental *skip* does not fail the
suite). Playwright is loaded from a sibling checkout — see the top of the script.

Machine-specific note (Windows + NVIDIA, the current dev box): the chromium leg
runs **headed** with **`--use-angle=gl`**. ANGLE's default D3D11/FXC backend
never finishes compiling the BVH megakernel here — headless chromium,
headed+`--use-angle=d3d11` and system Chrome all freeze at ~3 frames with silent
`VALIDATE_STATUS=false` storms — whereas the native NVIDIA GL backend compiles
it in ~137ms. A visible chromium window on the desktop during the run is
expected. On this box **firefox** and **webkit** come back `skip`: firefox
renders through that same stalling ANGLE-D3D11 backend and exposes no native-GL
switch, and Playwright's Windows webkit has no usable WebGL2 (context lost). Both
would actually run on a real-GPU Linux runner with native GL; only chromium is
required to pass here.

**What this catches, and what it does not.** The matrix catches API / JavaScript
/ GLSL-frontend divergence between engines, and any regression that blackens or
errors the image on the engines it runs. It does **not** catch the original iOS
bug: Playwright's `webkit` on Windows is the WPE/GTK WebKit build, **not Apple's
Metal stack**, so it never exercises the GLSL-to-Metal code generator that
actually failed. **Real-device iOS testing stays manual.** The field kit for that
is on-device URL flags: `?diag=1` mirrors console errors onto the page (so a
photo of an iPad is a usable bug report) and `?nospecmrt=1` forces the
single-attachment WebKit fallback on any machine.

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
| 6b. Sampling | ✅ | Blue-noise sampling + ReSTIR direct lighting (temporal + spatial reuse) |
| 6c. Any-hit shadows | ✅ | Unordered early-out BVH traversal for occlusion rays — same image, up to ~2× cheaper shadows |
| 6d. PBR materials | ✅ | Cook-Torrance GGX dielectric specular + normal/roughness/metalness maps, alpha-blended transparency, deforming (water) meshes, overscan |
| 6e. Skinned meshes | ✅ | Animated characters CPU-skinned into the dynamic BVH — moving traced shadows + animated raster pose |
| 6f. Material completeness | ✅ | Vertex colors, per-material IOR, multi-material groups (clearcoat/sheen/iridescence documented as out of G-buffer budget) |
| 6g. ReSTIR GI | 🧪 | **Experimental** (`restirGI`, off by default): temporal-only reservoir reuse of the 1-bounce indirect sample (v1 — no spatial reuse yet) |
| 7. Next | — | DDGI irradiance probes; ReSTIR GI **spatial** reuse + sample validation; WGSL / WebGPU backend |

## Credits

- [three-mesh-bvh] by Garrett Johnson — the GPU BVH this is built on.
- Inspired by [Erich Loftis'][erichlof] `THREE.js-PathTracing-Renderer`.
- Demo models: Khronos glTF sample assets (Damaged Helmet, Duck).

## License

MIT © Goldwin Stewart

[three-mesh-bvh]: https://github.com/gkjohnson/three-mesh-bvh
[erichlof]: https://github.com/erichlof/THREE.js-PathTracing-Renderer
