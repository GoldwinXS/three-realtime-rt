# three-realtime-rt

**Turn-on ray traced lighting for three.js.** Build your scene with normal three.js — meshes,
`MeshStandardMaterial`, `PointLight` / `DirectionalLight` — then swap one render call and get
BVH-traced soft shadows and global illumination.

```js
import { RealtimeRaytracer } from "three-realtime-rt";

const rt = new RealtimeRaytracer(renderer);
rt.compileScene(scene);          // builds the BVH + material/light tables

// render loop: replace renderer.render(scene, camera) with
rt.render(scene, camera);
```

## Architecture (hybrid deferred — the "RTX on" model)

Primary visibility is **rasterized** by three.js into a G-buffer (free, fast, perfect
material/texture fidelity). Lighting is then **ray traced** in a fragment shader against a
GPU BVH ([three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)):

1. **G-buffer pass** — MRT: albedo+roughness, world normal+metalness, world position, emissive
2. **RT lighting pass** — per pixel: shadow rays to lights (soft, area-sampled) +
   1-bounce cosine-weighted GI with next-event estimation at the hit point.
   Output is *demodulated irradiance* (albedo divided out) → denoises well, textures stay sharp.
3. **Composite** — `albedo × irradiance + emissive`, ACES tonemap.

Temporal accumulation refines the image; WebGL2, no build step required by consumers
(shaders are JS template strings).

## Roadmap

| Stage | Status | What |
|-------|--------|------|
| 1. Core | done | Scene→GPU sync, BVH, G-buffer, traced shadows + 1-bounce GI, accumulation |
| 2. Reprojection | done | Motion vectors + history reprojection: keep samples while moving (real-time unlock) |
| 3. Denoiser | done | Edge-avoiding à-trous (SVGF-lite) guided by G-buffer → clean 1spp |
| 4. Many lights | — | Power-weighted light sampling → ReSTIR DI for hundreds of emitters |
| 5. Dynamic scenes | — | TLAS/BLAS two-level BVH: rigid motion free, refit for deformables |
| 6. Ship | — | Specular reflections, npm packaging, demos, gallery showcase port |

## Development

```bash
npm install
npm run dev     # demo at http://localhost:8115
```

`RealTimeJSRayTracer/` (git-ignored) is the original voxel path tracer this project grew out
of — kept as reference for its accumulation pipeline and as a future demo port.
