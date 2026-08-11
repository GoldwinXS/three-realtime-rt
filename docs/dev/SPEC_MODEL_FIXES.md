# SPEC: gallery model coverage fixes (0.11.3)

Author: the architect. Implementer: you. Read fully before coding. Your branch
is `model-fixes`; do not run git commands beyond read-only `git diff`/`git log`.
No emojis, no em dashes. Do not ask questions; nobody can answer them. Make the
conservative choice and record it in the report.

## Why

The project owner opened the scene gallery and three stock Khronos models are
broken. These are ordinary glTFs; an engine that wants to be a drop-in
three.js upgrade must render them. The architect has already reproduced all
three and confirmed root causes for two. Your job: fix all three, prove the
fixes in pixels, and write REPORT_MODEL_FIXES.md.

## Repro harness (already committed, use it)

- `probe-gallery-bisect.html` at repo root: loads any gallery scene by
  `?scene=fox|waterbottle|mosquito`, applies extra URL params directly onto the
  engine options (`&denoiseIterations=0`, `&textureTiles=0`, ...), exposes
  `window.rt` and `window.probeScene`, HUD shows live option state.
- `dev/probe-gallery.py`: Playwright capture (chromium `--use-angle=gl`,
  visibility shim, pageerror listener). Run
  `python dev/probe-gallery.py <name> "<query-params>"` to screenshot a
  variant. Screenshots land as `bis-<name>.png` in the CWD. Serve the repo
  first: `npx vite --port 8127 --strictPort` (use PORT 8127 ONLY) and adjust
  the script's port constant if needed.
- Never trust swiftshader: `--use-angle=gl` is mandatory or the engine
  silently falls back to raster and you review the wrong renderer.

## Bug 1 (root cause CONFIRMED): normal-less geometry blackens under denoise

The Khronos Fox has no `normal` attribute. The G-buffer then writes a zero
normal, `normalize(vec3(0))` in DenoisePass produces NaN, and the a-trous
weights spread NaN over the whole silhouette: fox renders solid black with
denoise on, perfect with denoise off. Verified: `bis-fox-base.png` (black) vs
`bis-fox-nodenoise.png` (correct).

Fix at the root in SceneCompiler: when a geometry reaches compile without a
`normal` attribute, `computeVertexNormals()` (on the clone if cloning,
otherwise document the mutation). The G-buffer swap material must also end up
with valid normals for these meshes (verify, since the fix must heal BOTH the
BVH attributes and the raster G-buffer guides).

Acceptance: fox scene with default options (denoise ON) shows the textured
orange fox, no black areas, no NaN speckle, and the selftest still passes.

## Bug 2 (mechanism CONFIRMED): denoiser spreads non-finite irradiance

DenoisePass's own comment admits half-float irradiance can reach inf. Center
or tap values that are inf/NaN poison `exp()`-based weights and paint black
blobs; observed as a crawling black fringe on the WaterBottle label band edge
with denoise 2 (`bis-bottle-base.png` vs clean `bis-bottle-nodenoise.png`),
and the owner sees large black squares on a real GPU at higher tiers.

Fix: sanitize inside DenoisePass. Degenerate center normal (length < ~1e-4):
output `center` and return. Non-finite center irradiance: replace with 0
before filtering. Non-finite tap irradiance or degenerate tap normal: skip the
tap. Use GLSL3 `isnan`/`isinf`. Keep the changes minimal and inside the
existing shader string; no new uniforms, no new samplers.

Acceptance: waterbottle with denoise 2-3 shows zero black pixels along the
label band across a 10 s capture; fox stays fixed; museum demo unchanged
visually (capture one museum still before/after your DenoisePass edit and
compare by eye; note any difference honestly).

## Bug 3 (NOT yet root-caused): transmission materials render opaque

MosquitoInAmber's amber is `MeshPhysicalMaterial` with `transmission: 0.75`,
`transparent: false`, plus a baseColor map. SceneCompiler's
`isGlass = transmission > 0 && !transparent` and GBufferPass's matWord
plumbing (`2.0 + transmission` partial, `3.0 + ior - 1` full) SAY this should
trace as glass. It does not: the amber renders fully opaque diffuse even with
`refraction: true, transparency: true` forced AND `transmission = 1.0` set
in-page followed by `rt.compileScene()` (verified: `bis-mosq-fullglass.png`).
The engine's own absorption/scattering demos show working glass, so something
about THIS material's path differs. Suspects to check, in order:

1. GBufferPass's per-mesh swap material: is `uTransmission` actually set for
   materials WITH texture maps (the map-variant shader or uniform update path
   may skip it)? Is the uniform updated on recompile/material change?
2. The lighting pass decode: does the primary-hit branch for matWord in
   (2,3] actually trace a refracted ray, or does partial transmission fall
   through to the diffuse path?
3. Anything amber-specific: doubled geometry, winding, `side`, or the second
   surface (mosquito, eclats meshes) occluding from inside.

Diagnose FIRST (instrument, capture, bisect with the probe page), then fix.
The fix must handle both partial (0 < t < 1) and full transmission, with the
baseColor map tinting the transmitted light (Beer-Lambert via the existing
absorption path where applicable).

Acceptance: the amber block reads as translucent amber (background and ground
visibly refracted through it), the mosquito inclusion is visible from at
least one camera angle, and the owner's three gallery scenes all pass:
fox correct, bottle correct, mosquito translucent. Existing glass demos
(absorption.html, scattering.html, museum glass) must be captured after the
change and show no regression.

## Constraints

- The lighting pass sits at the WebGL2 16-sampler minimum: no new samplers.
- GLSL: no ternaries on opaque types; mind the WebKit traceRadiance call-site
  budget (do not add call sites).
- `npm run test:render` must pass at the end; run it and paste the tail.
- Every claim in the report must name the artifact (png/log) that proves it.
  A verification section saying "not performed" gets the round rejected.
- Version: bump to 0.11.3, CHANGELOG entries for the three fixes.
- No git writes, no deploys, no npm publish.

## Deliverables

The fixes, the probe captures under `_reviews/model-fixes/`, and
`REPORT_MODEL_FIXES.md`: root cause per bug (bug 3 especially: what it
actually was, with the disproving capture for at least one rejected
hypothesis), the fix, the acceptance evidence, honest caveats.
