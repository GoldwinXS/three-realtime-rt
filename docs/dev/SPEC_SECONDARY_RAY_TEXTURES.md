# SPEC: texture maps visible to secondary rays (v0.11.0)

Author: the architect. Implementer: you. Read this whole file before writing code.
Work only inside this repository. Do not commit, push, or touch git config; leave
the working tree for the architect to review and commit. No emojis, no em dashes,
anywhere, including code comments.

## Problem

Secondary rays (traced refraction through glass, traced reflections, GI bounces)
shade hit points from the packed material row in the scene-data texture:
`fetchMaterial` in `src/RTLightingPass.js` (line ~185) reads two texels per
material holding constant color, roughness, emissive, metalness. Texture maps
never reach that path. `SceneCompiler.js` even averages any `emissiveMap` to a
single color (`averageEmissiveMap`, line ~484) for the material row and the NEE
light table.

Consequence, found 2026-08-10 while QA-ing a lens-education site built on this
engine: an emissive checkerboard viewed through a traced biconvex glass lens (or
a plain glass sphere) renders as one featureless beige disc. Any textured surface
seen through glass, in a reflection, or via a GI bounce collapses to its average
color. Repro exists at `C:\ClaudeSessions\light-lab\_probe-sphere.html`.

Goal: a refracted or reflected ray that hits a surface with a `map` or
`emissiveMap` shades with the actual texel at the hit point's UV, so a
checkerboard seen through a lens shows an inverted, magnified checkerboard.

## The two constraints that dictate the design

1. **The sampler ceiling.** `RTLightingPass` and `GIReservoirPass` each sit AT
   the WebGL2 16-sampler minimum (see comments at RTLightingPass.js:83, :204,
   GIReservoirPass.js:17). You CANNOT add a sampler uniform to either pass. This
   is why absorption (row 67) and scattering (row 68) ride the already-bound
   scene-data texture. Map pixels must do the same.

2. **Barycentric interpolation of packed data is garbage.** The per-vertex
   attribute texture is sampled with `textureSampleBarycoord`, which fetches the
   three vertices and lerps. You cannot lerp bit-packed values, so UVs must be
   stored as plain floats and any layout change must keep normals and matIndex
   interpolating exactly as today.

## Design

### A. Map tiles ride the scene-data texture

In `buildSceneDataTexture` (SceneCompiler.js ~894):

- Current rows: 0 materials, 1 emissive tris, 2..65 blue noise, 66 emissive CDF,
  67 absorption (optional), 68 scattering (optional; only with 67).
- New optional **row 69: per-material tile indices**. One texel per material:
  `[albedoTile, emissiveTile, 0, 0]`, tile index as float, `-1.0` = no map.
  Allocated only when at least one registered material has a `map` or
  `emissiveMap` (mirror how rows 67/68 are conditionally allocated; note their
  absolute row numbers are hardcoded in the shaders, so when row 69 exists rows
  67 and 68 must also be materialized even if all-zero, to keep addressing
  absolute and simple).
- New **tile block starting at row 70**. Each unique texture image is resampled
  on a canvas to TILE x TILE RGBA (default TILE = 128) and written as TILE
  consecutive rows of TILE texels, in linear color (use the existing
  `srgbToLinear` for sRGB sources, matching `averageEmissiveMap`). Tile t lives
  at rows `70 + t*TILE`, columns `0..TILE-1`. Texture width must become
  `max(existing width, TILE)`. One cache per image so a texture shared by
  several materials gets one tile (pattern: `_emissiveMapAvgCache`).
- **Caps, fail loud**: new compile option `textureTiles` on `compileScene`
  options (and plumbed through `RealtimeRaytracer` options like existing knobs):
  `{ size: 128, max: 16 }`, or `false` to disable the feature entirely. Past
  `max` unique images, further materials keep the averaged-color behavior and a
  one-time `console.warn` names the dropped textures (use `_firstTime`). A
  non-drawable image (cross-origin canvas taint, missing image data) also falls
  back to average + one-time warn, mirroring `averageEmissiveMap`'s failure
  contract.
- `emissiveIntensity` and material `color`/`emissive` tint multiply the sampled
  texel exactly as three.js defines (`color * map`, `emissive * emissiveMap *
  emissiveIntensity`). The averaged values already in the material row stay
  as-is; they remain the fallback and the NEE importance weights.
- The NEE light table and CDF (rows 1 and 66) keep using averaged emissive.
  Importance sampling does not need the pattern; document this in the README.

### B. UVs ride the attribute textures at stride 2

`packAttributes` (SceneCompiler.js ~1037) currently packs one vec4 per vertex:
`[nx, ny, nz, matIndex]`. Change the layout to TWO vec4 texels per vertex:

- texel `2v`:   `[nx, ny, nz, matIndex]`  (unchanged content)
- texel `2v+1`: `[u, v, 0, 0]`            (zeros when the geometry has no uv)

UVs come from the merged geometry's `uv` attribute; `extractMeshGeometry` and
the merge path must preserve it (verify `mergeGeometries` keeps `uv`; if a
geometry lacks uv, fill zeros BEFORE merging so attribute sets match, since
mergeGeometries drops mismatched attributes).

Shader side: replace every `textureSampleBarycoord(uAttr*, bary, fi.xyz)` call
with a small helper added to the shared GLSL (there are exactly four sites:
RTLightingPass.js lines ~427, ~823, ~964 and GIReservoirPass.js line ~376):

```glsl
// Fetches the stride-2 attribute layout: texel 2v = normal+matIndex,
// texel 2v+1 = uv. Manual 3-vertex lerp; matIndex is uniform per triangle.
void fetchAttrUv(sampler2D attrTex, vec3 bary, uvec3 verts,
                 out vec4 attr, out vec2 uv);
```

Use `texelFetch` with the same 1D-to-2D addressing `FloatVertexAttributeTexture`
uses (three-mesh-bvh exposes the addressing in its shader utils; if no public
helper fits, replicate the two-line index math with the texture's width). The
helper must return bit-identical normal/matIndex behavior to the old call at
stride 1 (same lerp, same order), so renders without maps are unchanged.

CPU side, `updateDynamic` (SceneCompiler.js ~144) re-bakes normals and positions
into the packed array with hardcoded stride-4 float offsets (lines ~215-218,
~260-263, ~287-290). Those offsets become stride-8 (skip the UV texel; UVs are
invariant under rigid transforms and skinning re-bake writes, so the UV texel is
written once at build and never touched). Audit every `packed[` write and every
`seg.start`-derived offset in that function; this is the highest-regression-risk
part of the change. `FloatVertexAttributeTexture.updateFrom` receives a
BufferAttribute with 2x the item count; confirm the resulting texture width is
what the shader addressing assumes for BOTH the static and dynamic levels.

### C. Sampling at hit points

In `fetchMaterial` callers on the secondary-hit paths (RTLightingPass ~826 is
the main shade site; GIReservoirPass has its own), after fetching constants:

```glsl
if (tile row exists && albedoTile >= 0)  albedo   = color * tileSample(albedoTile, uv);
if (tile row exists && emissiveTile >= 0) emissive = tint * tileSample(emissiveTile, uv);
```

`tileSample` does a manual bilinear (4 texelFetches with wrap-mode repeat on the
uv fract) from the tile block in `uMaterialsTex`. Gate the whole feature with a
source-spliced block like `RT_ABSORPTION` (see `stripAbsorption` /
`stripMarked` in RTLightingPass.js) so scenes with no maps compile the exact
shader they compile today, paying zero cost. The shadow-ray path (line ~427
site) does not need maps; leave it on the constants.

Priority order: 1) the traced refraction and reflection path in RTLightingPass
(this is the user-visible defect), 2) GI bounce albedo in GIReservoirPass (color
bleeding), which you should attempt but may descope with a clear note in your
report if it destabilizes.

## Non-goals

- No mipmapping, no anisotropy, no normal/roughness/metalness maps, no
  alpha-cutout maps. Tiles are flat RGBA at one resolution.
- No API break: every existing example and option keeps working unchanged. A
  scene with no maps must produce byte-identical shader source to today.
- No primary-ray changes: the G-buffer raster path already samples real
  materials.

## Deliverables

1. The implementation, per above.
2. `examples/` or repo-root probe page `probe-secondary-textures.html`: a glass
   sphere centered in front of a checkerboard, two variants toggleable by query
   param: `?mode=emissive` (emissiveMap checkerboard) and `?mode=albedo`
   (lit albedo-map checkerboard), plus one dynamic case (`&dynamic=1`) compiling
   the sphere as a dynamic mesh. Self-luminous HUD text is fine.
3. Self-verification, mandatory: run the probe in headless Chromium ON THE REAL
   GPU and screenshot each mode. The engine refuses software renderers, so you
   MUST launch with `--use-angle=gl` (NOT d3d11, which hangs on this machine;
   NOT default swiftshader, which silently falls back to raster and would show
   you a lie). A ready-made pattern:
   `python C:/ClaudeSessions/gemini-critic/critic.py --gpu --url <probe url> --actions <steps.json> --mode screens --out _reviews/...`
   with a `{"screenshot": ...}` action after a `{"wait": 6000}`. Serve the repo
   with `--serve .` or any static server you are allowed to run. PASS = the
   pattern is visible THROUGH the sphere and inverted, in all three variants.
   Also re-run one unmodified existing demo (e.g. `index.html` hero or
   `absorption.html`) and confirm it still renders and reports no new warnings.
4. `node --check` passes on every touched JS file.
5. Version bump to 0.11.0 in `package.json`, a CHANGELOG.md entry in the style
   of previous releases, a README section ("Texture maps and secondary rays":
   what works, the tile budget, the NEE-stays-averaged note, the `textureTiles`
   option), and `index.d.ts` updated for the new option.
6. `REPORT_SECONDARY_TEXTURES.md` at repo root: what you did, what you verified
   (with the exact commands and which GPU mode), what you descoped, open risks.
   Honest caveats beat confident claims; unverified assertions must be labeled.

## Acceptance gate (the architect runs this after you stop)

- Probe: pattern through glass, inverted, all modes, on hardware GL.
- Regression: absorption.html, scattering.html, and the index hero render
  without new console warnings; no shader source change when a scene has no
  maps.
- Perf: note the fps delta on the probe with tiles on vs `textureTiles: false`.

## Addendum: repo-specific constraints (read before shader work)

1. **traceRadiance call-site budget.** WebKit GLSL-to-Metal SILENTLY emits a
   broken program (clean compile, black output) when `traceRadiance` is inlined
   at too many call sites in RTLightingPass. The budget comment says 3; master
   already carries 4 textual sites. Your change must add ZERO new
   `traceRadiance` call sites. Tile sampling is pure texelFetch arithmetic, so
   this should be natural; if you are ever tempted to restructure a call site,
   stop and note it in the report instead.
2. **Source-splice variants.** The engine caches shader variants by splicing
   marked blocks (`stripAbsorption`, `stripMarked`: RT_ABSORPTION,
   RT_ABSORB_SHADOWS, RT_KM). Follow the same pattern with an RT_TEXTILES
   marker. The no-maps variant must be byte-identical to today's source; the
   repo has proven this with Node source diffs before, do the same in your
   report (diff the generated shader source with tiles off vs current master).
3. **NVIDIA GL assembler fragility.** Past features died in the GL assembler
   ("too many temporaries", C5041) from added inline marches. Keep tileSample
   tiny and branchless where possible; if the megakernel fails to LINK on GL
   after your change, that is the first suspect.
4. **Verification env update.** Headless Chromium with `--use-angle=gl` was
   verified working on this machine 2026-08-10 (compiles the BVH megakernel in
   normal time, renders at 60 fps). If it ever stalls for you, the known-good
   fallback is Playwright HEADED chromium with the same `--use-angle=gl` flag
   (a visible window on the desktop is acceptable). Never d3d11, never
   swiftshader.
5. **Existing partial feature.** Dynamic + textured emissives already ship as
   per-tri AVERAGED emissiveMap color (commit 0071ab4). Your row-69/tile work
   supersedes the averaged color only at shading time; do not disturb the NEE
   table's averaged weights or that commit's dynamic-emitter refresh path.
6. **iPad/WebKit release gate.** Any release including this feature needs the
   user's on-device WebKit pass. That gate is run by the architect at release
   time, not by you; just keep the shader additions modest and spliced.
