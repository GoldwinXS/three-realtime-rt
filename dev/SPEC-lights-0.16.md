# SPEC: three-realtime-rt 0.16.0, "lights without a cap" (light table in the scene texture, a light grid for ReSTIR candidates)

Owner of the design: Fable (main session), on the owner's rule for the Hangar game (2026-08-15): "I don't
think we need the lights turning off and on again depending on player location anymore now that restir is
fixed, but we might want to make sure that the game is optimized and not too heavy." Implementer: an Opus
agent in THIS worktree (`C:\ClaudeSessions\rt-wt\lights`, branch `feature/lights-0.16` from master
`d75c0da` = 0.15.0; run `npm install` here first if `node_modules` is missing; dev server
`node node_modules/vite/bin/vite.js --host --port 8151 --strictPort` from this directory). Do not run
git; do not touch the main checkout `C:\ClaudeSessions\RayTracingUpgradeChallenge`, the other worktrees,
or `C:\ClaudeSessions\Hangar`. No em dashes, no emojis. Read `CHANGELOG.md` (0.15.0), `dev/SPEC-0.15.md`,
`dev/PORT-0.15-REPORT.md` (the gates and how they were run: headed Chromium `--use-angle=gl`, floors
beside every number, `?selftest=`, `npm run test:render`, `npm run test:km`, bench.html), then the
source: `SceneCompiler.js` (the light table build and the STABLE SEATS logic at ~1800-1880, the
scene-data texture layout at ~1140-1250: rows 0-1 materials/emissive tris, 2-65 blue noise, 66 emissive
power CDF, 67 absorption, 68 scattering, 69 tile indices, 70+ tile blocks), `RTLightingPass.js`
(`uLightPosType/uLightColorRadius/uLightDirCone[MAX_LIGHTS]` uniform arrays, `shadeLightSet` = the ONE
per-light loop, `sampleOneLight/Any`, exactly 4 textual `traceRadiance(` sites and exactly 16 samplers:
both are WALLS), `RestirPass.js` (candidate sampling with `uLightCdf[MAX_LIGHTS]`, `uPoolSplit`,
`uEmissiveCDF`, `phatOf`, `candidateContribution`, `uDirBypass`), `VolumetricPass.js`,
`GIReservoirPass.js` (all read the same three arrays).

## Why

Every pass reads the lights from three `vec4[MAX_LIGHTS]` uniform arrays with `MAX_LIGHTS = 32` (the
compiler comment: "stage-1 cap; a data-texture light list is future work"). The Hangar house has 49
lights and the rebuilt one will have ~80, so the game toggles lights per room (`rooms/lighting.js`:
current room + portal-adjacent rooms) to fit the cap, and every toggle is a reservoir re-learn the
player sees as a flash at doorways. With ReSTIR the COST is flat in light count already; the cap and
the candidate quality are what remain. This release removes the cap and makes candidates local.

## Part 1: the light table lives in the scene-data texture (no new sampler anywhere)

- `maxLights` becomes a constructor option (default **128**, hard max 256; compile-time like
  `textureTiles`, changing it after construction throws with a clear message). `MAX_LIGHTS` in every
  shader = that value (`#define`).
- The table moves to ROWS of the scene-data texture appended after everything that exists today (row
  index passed as `uLightRow`, so the tile block keeps its rows): 4 texels per light: `posType`,
  `colorRadius`, `dirCone`, `extra` (reserved: `.x` = seat generation for future use, rest 0). Width of
  the texture = `max(existing, maxLights * 4)`. `updateLights` writes ONLY those rows with
  `texSubImage2D` (three: `texture.needsUpdate` re-uploads everything; measure it: if the full
  re-upload of the scene-data texture per updateLights costs > 0.3 ms with a 2k x 2k tiles block, use
  a raw `gl.texSubImage2D` on the underlying WebGLTexture via `renderer.properties.get(tex).__webglTexture`
  and say so; if it is under 0.3 ms, keep it simple and say so with the number).
- Every pass replaces `uLightPosType[i]` etc. with `texelFetch(uMaterialsTex, ivec2(i*4+k, uLightRow), 0)`
  through ONE helper per pass (`lightPosType(i)`, `lightColorRadius(i)`, `lightDirCone(i)`), so the
  shading maths does not change a character. `RTLightingPass` still binds exactly 16 samplers and has
  exactly 4 `traceRadiance(` sites (assert both in the report with the counts).
- The stable-seat logic generalises to `maxLights` unchanged in behaviour.
- `uLightCdf` (RestirPass, `vec2[MAX_LIGHTS]`) moves into the same rows' `extra` texel? No: it is a
  per-updateLights CDF over the compact table; put it in the light grid texture (Part 2) as its "global"
  row (cell index 0 = global CDF), or keep it a uniform array bounded by maxLights <= 256 (256 vec2 =
  128 vec4 uniforms: within every WebGL2 minimum? MAX_FRAGMENT_UNIFORM_VECTORS min is 224; RestirPass has
  few other uniforms; measure `gl.getParameter` on this machine and reason about phones; prefer the
  texture path).

## Part 2: the light grid (candidates from lights that matter to THIS pixel)

Today's candidates come from a global power CDF, so with 80 lights on, ~1/8 of a pixel's 8 candidates
land in its own room; the reveal noise the 0.15.0 fixes removed would come back as dilution. Fix, RTXDI
"light grid" style, kept small:

- A uniform grid over the compiled scene's world AABB (from the static BVH root; the dynamic bounds
  are ignored for the grid, dynamic emissives are not in it anyway): resolution chosen per axis so a
  cell is about `extent_max / 24` on the longest axis, at least 1 and at most 32 per axis, total cells
  <= 8192; stored as ONE RGBA32F texture, `maxLights` texels wide, `cells + 1` rows tall (row 0 = the
  global CDF for pixels outside the grid and for the volumetric pass). Each texel of a cell row =
  `(cdf_i, w_i, 0, 0)` for light seat i, cdf normalised to 1 at the last active light (zeros beyond).
- Weight of light i for cell c: `w = lum(colorRadius.rgb) * clamp(r^2 / (d^2 + 0.25 r^2), 0, 1) *
  coneFactor`, d = distance from the light to the nearest point of the cell's box (0 inside), r = the
  light's radius (falloff radius; a light with radius 0 = infinite: use `w = lum / (d^2 + 1)`), spot
  cone factor = 1 if any point of the cell is inside the cone else 0.05, directional lights weight 0
  under `restirDirectionalBypass` (they are shaded exactly) and `lum` otherwise. Every active light
  gets at least `1e-4 * max weight` so no light has zero probability where it could matter (RIS needs
  support).
- Built on the GPU: a full-screen pass into the grid texture (fragment = (light seat, cell) computes
  w; a second pass per row computes the running prefix sum over seats in a loop of `maxLights`
  iterations and normalises; two small draws), re-run whenever `updateLights` changes anything
  (positions, colours, radius, seat set) and once at compile. Cost target: under 0.2 ms at 8192 cells
  x 128 lights on this GPU (report it; if it is over, halve the cell cap and report).
- RestirPass candidate sampling: the light-pool draw finds the pixel's cell from its world position
  (uniform grid origin/size/dims), binary-searches the cell's cdf row (7 fetches at 128), and uses
  `pdf = w_i / W_cell` in the RIS weight; the pool split `uPoolSplit` (lights vs emissive) stays as it
  is (emissive tris keep the row-66 power CDF; the grid is lights only). Pixels outside the grid box
  use row 0. Option `restirLightGrid` (default true; false = the 0.15.0 global CDF, byte-identical
  candidate stream except for the table's storage change).
- The volumetric pass keeps its all-lights loop in this release but bounds it by `uLightCount` and
  early-outs by radius; report its cost at 32 vs 96 lights so the next release knows.

## Part 3: demo, docs, tests

- New gallery scene `hotel` after `waterfall`: a long corridor with 12 rooms either side, each room lit
  by 3-4 small lights (96 lights on at once, all inside the table), doors open, a slow dolly along the
  corridor (the reveal case) and a `?lights=32|64|96` knob; the panel gets `restirLightGrid` and shows
  `lightCount/maxLights`.
- README: options table rows for `maxLights` and `restirLightGrid`; the limits section says the cap
  is now `maxLights` (default 128) and what a light costs (nothing under ReSTIR; the exact loop and the
  volumetric pass are O(N)); CHANGELOG 0.16.0; `index.d.ts`; version 0.16.0.
- Selftests: `?selftest=lights` (a scene with 48 point lights in a row over a plane: 48 distinct
  bright spots counted in the frame; the same scene at `maxLights: 32` renders 32 and logs the drop),
  `?selftest=lightgrid` (a two-room scene, one bright light per room, wall between: the fraction of
  candidates from the pixel's own room with the grid on vs off, read back from a debug output mode; on
  > 0.9, off ~0.5), and the existing `presets`/`ambient`/`km` selftests still pass.

## Gates (report every number beside its floor; headed Chromium `--use-angle=gl`)

1. **Image identity of 0.15.0 behaviour**: museum, cornell, waterfall (frozen), and the Hangar's
   `restir-min.html`-style scene are rendered by master (start the main checkout on its own port,
   read-only) and by this branch with `restirLightGrid:false` and `maxLights: 32`, deterministic
   stepping, k=1 and k=90: mean |diff| must be 0.00 (bit-identical) or under the floor; if the texture
   path changes float rounding, say where and by how much.
2. **Cost**: bench.html museum 720p, master vs branch (grid off, grid on), twice each: median ms and
   ratio; the grid build cost in ms; the volumetric pass at 32 vs 96 lights on `hotel`.
3. **Convergence with many lights**: `hotel` at 96 lights, dolly reveal, mean |k - converged| at k = 1,
   4, 12 for grid on vs off; expectation: on is better at every k by more than 2x the floor.
4. `npm run test:render` (both legs), `npm run test:km` 27/27, `npm run pack --dry-run` file list,
   `node -e "import('./src/index.js')"`, sampler and traceRadiance counts.
5. WebGL limits: print `MAX_FRAGMENT_UNIFORM_VECTORS`, `MAX_TEXTURE_SIZE`, `MAX_TEXTURE_IMAGE_UNITS` on
   this machine and state which limit each new structure depends on.

## Deliverables

Commits are not yours. Leave: the code, the demo scene, docs, `dev/LIGHTS-0.16-REPORT.md` with every
gate table, and the answer to the Hangar question in one paragraph: with maxLights 128 and the grid on,
can the game turn its per-room activation off (measured on `hotel`: yes/no and why). Final message =
that report verbatim, with `http://localhost:8151/gallery.html#hotel`.
