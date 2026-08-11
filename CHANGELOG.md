# Changelog

## 0.11.2

- Fix: secondary-ray texture tiles rendered vertically mirrored. The tile block
  copied canvas rows top-down (row 0 = image top) while the shader's tileSample
  maps v=0 to the tile's first row and three.js UVs put v=0 at the image
  bottom, so every reflection, refraction, and GI read of a textured surface
  was upside down relative to the raster view. Tiles are now stored bottom-up.
  CPU-side only; generated shader source is unchanged.

## 0.11.1

- Fix: updateDynamic wrote packed attributes at stride 8 unconditionally; scenes compiled WITHOUT texture tiles (stride 4) corrupted normals on every dynamic re-bake, shredding moving meshes into radial artifacts. The re-bake stride now follows the compiled layout.

## 0.11.0 — 2026-08-10

- **Secondary-ray texture maps.** A textured surface seen through glass, in a
  reflection, or via a GI bounce no longer collapses to its average colour — the
  actual texel at the hit point's UV is sampled, so an emissive checkerboard
  viewed through a biconvex glass lens shows an inverted, magnified checkerboard
  instead of a featureless beige disc. Two constraints shaped the design: the
  lighting pass is at the WebGL2 16-sampler minimum (no new sampler), and
  barycentric interpolation of packed data is garbage (UVs must be stored as
  plain floats at separate texels rather than bit-packed). The result rides the
  existing scene-data texture with no new GPU resources.
  - **Map tiles on the scene-data texture.** Row 69 carries per-material tile
    indices (`[albedoTile, emissiveTile, 0, 0]`, `-1.0` = no map). Rows 70+
    hold the tile block: each unique texture image is resampled to 128x128 RGBA
    on a canvas, converted to linear colour for sRGB sources, and written as 128
    consecutive rows. One cache per image (`_mapTileCache`) so a texture shared
    by several materials gets one tile. Caps at 16 unique images by default
    (`textureTiles.max`); further materials keep the averaged-colour behaviour
    with a one-time warning.
  - **Stride-2 vertex attribute layout.** The per-vertex attribute texture now
    stores two vec4 texels per vertex: texel `2v` = `[nx, ny, nz, matIndex]`
    (unchanged content), texel `2v+1` = `[u, v, 0, 0]`. UVs are invariant under
    rigid transforms and skinning, so the UV texel is written once at build and
    never touched by `updateDynamic()`. Geometries without a `uv` attribute get
    a zero-filled one before merging so `mergeGeometries` does not drop the
    attribute. All three updateDynamic paths (rigid, deforming, skinned) were
    audited for the stride-8 offset change.
  - **Shader: `fetchAttrUv` replaces `textureSampleBarycoord` at all four
    sites.** A new GLSL helper replicates `texelFetch1D`'s 1D-to-2D addressing
    at stride 2 and does manual 3-vertex lerp. At each of the four
    `textureSampleBarycoord` call sites (shadow march, traceRadiance, glass exit
    in RTLightingPass; traceRadianceGI in GIReservoirPass), an RT_TEXTURE_TILES
    block adds a `fetchAttrUv` call that overwrites the old result. When the
    block is stripped (no maps), the old `textureSampleBarycoord` at stride 1
    is the only reader — byte-identical shader source. `tileSample` does manual
    bilinear (4 `texelFetch`es with wrap-mode repeat on the UV fract) from the
    tile block in `uMaterialsTex`.
  - **Per-texel shading at secondary hit points.** After `fetchMaterial`, if
    `uHasTextureTiles` is true and the material's tile index is non-negative,
    the averaged table colour is multiplied by the tile sample: `albedo *=
    tileSample(albedoTile, uv)` and `emissive *= tileSample(emissiveTile, uv)`.
    The table colour already carries the material tint (`color` for albedo,
    `emissive * emissiveIntensity` for emissive), so the compose matches
    three.js's `color * map` and `emissive * emissiveMap * emissiveIntensity`.
    The NEE light table and CDF (rows 1 and 66) keep using averaged emissive —
    importance sampling does not need the pattern.
  - **New option `textureTiles`** on `RealtimeRaytracer` constructor and
    `compileScene()`: `{ size: 128, max: 16 }`, or `false` to disable entirely.
    Typed in `index.d.ts`. When `false` or the scene has no textured materials,
    the shader is source-spliced to be byte-identical to the 0.10.0 build.
  - **Probe page** `probe-secondary-textures.html`: a glass sphere in front of a
    checkerboard, with `?mode=emissive` and `?mode=albedo` variants plus
    `&dynamic=1` for a dynamic-mesh test.
  - **GIReservoirPass** also receives the feature: GI bounce albedo samples
    per-texel when tiles exist, so colour bleeding carries the pattern.

## 0.10.0 — 2026-07-27

- **ReSTIR GI: the artifact was chromatic, and now it is gone.** `restirGI`
  shipped measurably *faster* than the inline GI path at flat rmse and was still
  not worth turning on — the picture grew coloured blotches, worst in the gallery
  scenes, that no number in the campaign could find. Write the resolve out in
  full and it says why. A reservoir holds one selected sample and a weight `W`;
  the resolve is `selRad * selCos/PI * W` with
  `W = wSum / (M * rtLum(selRad) * selCos)`. Substitute, and the `selCos` and the
  luminance both cancel:

  ```
  gi = chromaOf(selRad) * wSum / (PI * M)
  ```

  Two very different estimates multiplied together. The **luminance** is a
  running mean over the reservoir's whole M-frame history — that is what ReSTIR
  is for. The **colour** is the chromaticity of the *one* sample the reservoir
  currently holds, so in a Cornell box every pixel shows the colour of whichever
  wall its reservoir picked. Read straight off the GPU before the denoiser, the
  raw resolve is a **red/green confetti field at 37% chromaticity spread per
  pixel**.

  Nothing in the measurement stack could see it. `rmse` is luminance-dominated
  and the *mean* colour is correct — the estimator is unbiased, which is the
  point of RIS — so rmse read "free". The à-trous denoiser's edge-stopping
  weights are luminance-based too, so it cannot detect the error to stop on it;
  it averages the confetti into coarse coloured patches instead. The campaign's
  grid statistic did twitch (0.66 → 1.37), but only as a second-order luminance
  consequence of a first-order colour problem, which is why it read weak and
  unstable. The fix is **Rao-Blackwellization**: accumulate the RIS-weighted sum
  of the candidates' chromaticities beside `wSum` and resolve the colour as
  `chromaAcc / wSum` — the expectation of the very draw the reservoir makes.
  Identical mean, strictly lower variance, one multiply-add per merge point, and
  **no extra ray, sampler or storage** (the pass stays at its 16-sampler
  ceiling). `rtLum(chromaOf(x))` is 1 and `rtLum` is linear, so the mean is
  itself a unit-luminance chromaticity: rescaling by the resolved luminance
  leaves it bit for bit unchanged, and every luminance-derived quantity in the
  pass — `p_hat`, `W`, the merge weights, the validation test — is untouched.
  The store writes the running chromaticity back into the reservoir radiance,
  whose luminance is the only part ever read out again, which makes it recursive:
  one term folds in the entire history at exactly the weight the history carries.
  Option `restirGIChromaMean`, **default on**; `false` restores the old path.
  - **Two smaller corrections ride along, both measured.** The final visibility
    ray used to test the selected sample *whatever its origin* and zero the whole
    pixel on a hit. A temporal sample is visible by construction (the pass says
    so itself), so testing it only produces false rejections from ray epsilon;
    and zeroing threw away a pixel's entire M-frame accumulation over one
    neighbour's failed reconnection, in geometry-correlated patches — a
    structured black-speckle source exactly where contact shadows live. Now only
    a spatially adopted sample is tested (about half the pixels stop casting the
    ray) and a rejection falls back to that pixel's temporal-only estimate
    (`restirGIVisFallback`, default on). And the **resolve EMA is off by
    default** (`restirGIResolveAlpha` `0.15 → 1`): its partner was a
    reconstruction of the *previous* frame's temporal-only resolve, a noisier
    estimator than the merged one it was smoothing, carried at 0.85 weight, so it
    added variance — raw-resolve high-pass noise 50% of the mean at alpha 0.35
    against 26% at alpha 1, with still noise unchanged. What it was for, the
    selected sample's colour jumping frame to frame, is what the chromaticity
    mean now removes at the source.
  - **`restirGISpatialTaps` back to 2 (from 1).** The fix *inverts* the reasoning
    that lowered it. A tap used to swap in a different sample's colour, so each
    one was a fresh chance to draw the wrong one; now a tap is folded into the
    mean by its own RIS weight, so taps are a variance **sink**. Raw-resolve
    chromaticity spread runs 0.089 / 0.062 / 0.051 / 0.045 for 1 / 2 / 3 / 4
    taps, at 8.9 / 9.0 / 9.1 / 9.2 ms; 2 is where the curve flattens.
  - **Measured, `restirGI` on, everything else equal** (1280×720, RTX 3060,
    `renderScale 0.5`, 2 denoise passes). Cornell: raw-resolve chromaticity
    spread **0.388 → 0.106**; the coloured structure the fix targets — block
    structure of the on-minus-off difference field on the two chromaticity
    planes, which contains no scene content at all — **1.43 → 0.89**; rmse
    **5.83 → 5.34**, now *better* than restirGI off (5.39); still noise
    **0.194 → 0.178**; post-motion ghost residual **2.44 → 2.12**; frame time
    9.57 → 9.63 ms against 11.20 ms with restirGI off. Museum (a red wall
    bouncing onto a white floor — the scene where the raw resolve was worst):
    chromaticity spread **0.929 → 0.380**, rmse **5.16 → 5.07**, again better
    than restirGI off (5.13), ghost residual **3.31 → 2.85** and **3.35 → 2.77**
    at 1 and 5 frames after the camera stops. Lantern (a streamed Khronos asset
    on a sky-lit ground disc — the gallery framing the artifact was reported in,
    and the mildest of the four because a grey ground under a blue sky has
    almost no chromatic bounce to get wrong): chromaticity spread
    **0.118 → 0.017**, rmse **2.13 → 2.00**, ghost residual **3.97 → 2.34**,
    single-probe grid amplitude **0.596 → 0.386** against 0.527 with restirGI
    off. **How bad the artifact is scales with how coloured the bounce is** —
    Cornell and the museum are the extremes, a grey-and-sky scene barely shows
    it.
  - **The speed win is intact.** Tokyo (141k tris), the scene the −27% headline
    came from: **47.59 ms off → 34.53 ms on = −27.4%**, slightly *better* than
    the pre-fix path's −26.0%, because the visibility ray now fires on about
    half the pixels instead of all of them. rmse **4.59 → 4.42** (off 4.68),
    chromaticity spread **0.129 → 0.024**, ghost residual **6.53 → 5.82** and
    **6.44 → 4.71**. Across all four scenes the fix costs between −0.7% and
    +0.6% of frame time against the pre-fix path.
  - **Nothing changes with `restirGI` off.** A converged 1280×720 frame rendered
    at the campaign's reference config was byte-compared against `38cb328` with
    only `src/` swapped: identical on both Cornell (sha256 `1d4e395f…`) and the
    museum (`7d7e848a…`). Nothing outside `GIReservoirPass` moved, and that pass
    is not run at all when `restirGI` is off — `test:km`'s shader-source gate
    confirms `RTLightingPass` is still byte-identical to master in all four
    variants.
  - `restirGI` remains **experimental and off by default**, and the adaptive
    governor still does not turn it on by itself — that veto is the user's to
    lift, not a number's.

- **Adaptive governor rebuilt on the quality campaign's measurements.** It now
  spends quality in a fixed, cheapest-first order: **free wins** (`giHalfRate`,
  `restirGI`, `restirMCap` 16 — settings measured *cheaper and no worse*), then
  `renderScale` in 5% steps to `0.2`, then the canvas via `canvasScaleHook`,
  and returns them in reverse. Two measured defects fixed on the way:
  - it **no longer raises `denoiseIterations` past 3**. The old ladder raised
    passes as resolution fell (3 → 4 → 5) on the theory that the filter runs at
    lighting res so extra iterations are nearly free. The frame-time half is
    true; the image half is not. Error against a converged reference degrades
    monotonically past 2 passes, and the coarse à-trous lattice ("plaid") rises
    4–5× between 2 and 4 — peaking wherever the widest tap spacing reaches ~16
    *screen* pixels, which is pass 4 at `renderScale 0.5` and pass 3 at `0.25`.
    The old ladder was adding passes exactly there. The `denoiseIterations`
    option keeps its full range; this is the automatic policy, not a clamp.
  - the **canvas ladder no longer engages a rung early** (it fired at
    `renderScale 0.25`). At matched cost, full canvas at `renderScale 0.2` beats
    canvas `0.85` at `renderScale 0.2` by 14–22% error with ~40% more retained
    detail, measured on both real scenes — canvas scale throws away the
    G-buffer's edges, the one thing the tracer gets sharp for free.
  Observed end-to-end on the tokyo scene (141k tris, 1280×720, the governor's
  own landing state): **3.87 → 3.55 ms and 8.7% less error** than the old
  ladder's, and at the deepest rung **9.16 → 9.12 ms for 20.8% less error**.
- **`restirMCap` default 40 → 16.** The campaign's one unconditional win: better
  on *every* metric in *both* measured scenes for ~0.3 ms — error 5.39 → 4.92
  (Cornell) and 5.13 → 4.70 (museum), in-motion error 9.13 → 8.65 / 6.89 → 6.73,
  post-motion ghost residual 1.90 → 1.25 / 2.35 → 2.13. A 40-sample reservoir is
  simply staler than the pipeline around it. `restirMCapMoving` now defaults to
  `restirMCap` rather than a hard 40 (they were equal before; a *Moving cap
  longer than the parked one would be an inversion). With `adaptiveQuality`
  off, this is the **only** rendering change in this release — verified by
  byte-comparing a converged 1280×720 frame against the previous build with the
  cap forced back to 40: identical, FNV `b997636a` both sides.
- **New page: [`costs.html`](costs.html) — what each feature costs.** Per-feature
  ms, % of frame, fps on both sides of the switch and error delta, for three
  scenes (86 / 50k / 141k triangles), rendered from the committed measurement
  matrix. Linked from the tour chrome and the panel. It leads with the three
  results whose sign contradicts the feature's name: `restir` is a *speed*
  feature (off = 34–39% slower in multi-light scenes), so is `restirGI` (−27%
  on 141k tris, at slightly better accuracy, despite its experimental label),
  and `giHalfRate` buys 10–22% of the frame for an error wash.
- **Demo panel: every control the governor writes now says so.** The two
  resolution rows carry an AUTO badge and follow the governor live (including
  off-ladder values it steps to); `denoise passes`, `fast lights`, `half-rate
  GI` and `ReSTIR GI` mirror it too; and touching any of them switches auto
  quality **off** in one visible interaction instead of silently fighting you.
  The GI modifiers are drawn as sub-rows of `global illumination` and dimmed
  when it is off, and `ReSTIR GI` explains itself when the denoiser is off or
  running more than 3 passes.
- **Demo: a textured-duck exhibit in the Cornell box** — the repo's own
  `Duck.glb` twice, as shipped (one baseColor map) and with a normal + roughness
  map added in-page, which is what the G-buffer hands the tracer. **Stop 3 now
  opens on a streamed Khronos BoomBox** instead of the Damaged Helmet the museum
  already shows, the picker leads with the assets people recognise, and a model
  that cannot be streamed falls back to the bundled scene with a note instead of
  a dead page. No new binaries.
- **`bench-results/` carries a README explaining that it is not a time series**,
  and `bench.html` now dates its scene labels (`museum-2026-07`) and records
  what each key meant. The existing files key three different rooms as `"room"`
  and read as a 7× regression that never happened.

- **Scattering: physically-parameterized translucent solids (Kubelka-Munk
  two-flux).** Jade, wax, marble and alabaster, soap, milky plastic, foliage,
  lampshades — the material class a real-time renderer normally fakes with an
  authored **thickness map**, which stops being right the moment the object
  deforms, is sliced, or is seen from a new angle. Give a material an absorption
  coefficient **K** and a scattering coefficient **S** and the renderer measures
  how far each view ray actually travels inside the real geometry, then solves
  the two-flux equations for that thickness. A sphere thins correctly toward its
  silhouette and a shell wall brightens where it is seen obliquely, with nothing
  baked and nothing painted. New option/property `rt.kmScattering`, **default
  off**; opt in per material with `userData.rtScattering` (`{ coefficient }` in
  1/world-unit, or the same `{ color, distance }` pair absorption already uses).
  K is the material's existing `attenuationColor` + `attenuationDistance`, so a
  material still states its colour in one place.
  - **Why it matters, concretely.** Absorption alone can only ever REMOVE light,
    so a pigmented translucent body lit from the front renders as black murk —
    nothing sends the light back out of the surface. Scattering does, and the
    closed form gives both a reflectance and a transmittance. The museum's new
    exhibit is the A/B: two spheres with identical geometry and identical K,
    differing by one `userData` line, and a lamp whose cast-stone shade goes from
    murky glass to warm alabaster.
  - **It is invertible, which is the point of a physical parameterization.** For
    a body thick enough to hide its backing, `R_inf = 1/(a + b)` rearranges to
    `K/S = (1 - R)^2 / (2R)`: choose the colour the material should be when
    thick, read off K/S, pick S for how fast it gets there, and the thin parts
    follow. The maths is exported (`kmReflectance`, `kmReflectanceInfinite`,
    `kmStackRGB`, ...) so this can be done in a tool or at build time.
  - **NOT volumetric lighting.** Fog and god-rays are light scattering BETWEEN
    objects (`volumetrics`); this is transport INSIDE solid bodies. Unrelated
    features.
  - **Zero new resources.** No new sampler (this pass is at the WebGL2
    16-sampler minimum — S rides a new row 68 of the existing scene-data
    texture), no new uniform, no new `traceRadiance` call site, and **no new BVH
    traversal**.
  - **The design the feature shipped from does not compile, and that is the
    story.** The natural implementation is a dedicated ordered march along the
    view ray composing an arbitrary layered stack — the same machinery coloured
    shadows use. It was written, it works, and NVIDIA's native-GL assembler
    rejects the megakernel with `error: too many temporaries`, the
    register-pressure sibling of the `C5041` failure that killed a 0.9.0
    shadow-march optimisation. Bisected on the GPU rather than guessed at:

    | build | generated NV assembly | links |
    |---|---|---|
    | full feature, dedicated view march | 35 319 lines | no |
    | same, shadow-side maths removed | 33 403 lines | no |
    | same, march compiled but never called | — | yes |

    So the march's own BVH traversal is the blocker and shrinking the surrounding
    arithmetic cannot buy it back — a 5% reduction in emitted assembly moved
    nothing. Reusing `shadowTransmittance` for the view ray is *worse*: it is
    already inlined at roughly EIGHT effective sites (main's direct loop, and
    again inside every `traceRadiance` site by way of `sampleOneAny`), so a third
    explicit call adds a ninth traversal, and anything added to its loop body is
    paid for eight times over. The shipped version evaluates the layer where the
    shader already computes an in-medium view chord, inside `glassRadiance`.
    Cost: **one medium along the view path** instead of an arbitrary stack (the
    shadow path still marches through stacks correctly). The layered composition
    survives in `src/kubelkaMunk.js` and its self-test, ready for a pass with
    register room to spare.
  - **An exact thickness correction the absorption path never needed.** That
    chord is measured from a point `2 x eps` INSIDE the entry surface, so it
    under-reports by `2 x eps / |rd.N|` — a fixed ~7 cm in a room-sized scene,
    which is HALF the wall of a cast shade. Negligible when you are computing a
    tint; fatal when you are computing a reflectance.
  - **Numerics, because fp32 meets every degenerate corner inside one ordinary
    sphere** (the centre is a long chord, the silhouette a vanishing one). `coth`
    diverges as `b*S*t -> 0`, `sinh`/`cosh` overflow as it grows, and `a - b` is
    a difference of two nearly-equal large numbers when the medium barely
    scatters. Every expression is the stable rewrite: `exp(-2x)` forms instead of
    `sinh`/`cosh`, `1/(a + b)` instead of `a - b`, `sqrt((a-1)(a+1))` instead of
    `sqrt(a*a - 1)`. The series branches the textbook needs were removed
    entirely by FLOORING `b` — because `x` is computed as `b*(S*d)` with the same
    floored `b`, the ratio `x/b` stays exactly `S*d` and every limit falls out of
    the exponential form alone. That deleted a `step()`, two branches and their
    live registers, which is what let the feature fit at all.
  - **Zero cost when unused, provably.** Source splice, not `#ifdef`: a third
    marker tag `RT_KM` gives a fourth cached variant, a LADDER rather than a
    matrix (each variant is the next with its outermost feature stripped). With
    `kmScattering: false`, or no material carrying `userData.rtScattering`, the
    generated fragment source is **byte-identical** to 0.9.0's — SHA-256 checked
    against a `master` checkout by the new `npm run test:km` (plain 52 378 B
    `sha 44d6be4e`, absorption-only 55 257 B `sha 1804cf41`, absorption +
    coloured shadows 61 321 B `sha 13a75103`, all three matching). Stripping
    order is now load-bearing and documented: `RT_KM` blocks nest inside the
    coloured-shadow one, and `stripMarked` tracks a single boolean, so the
    innermost tag must be stripped first.
  - **`npm run test:km`** also runs 23 numeric checks on the analytic reference
    with no GPU and no browser: the `S -> 0` degrade to Beer-Lambert, the
    `t -> infinity` approach to `R_inf` from BOTH sides, the `coth` guard at tiny
    `b*S*t`, `Rg = R_inf` as a fixed point, channel independence, a 1344-case
    finiteness sweep, and the equivalence of the closed-form `R(t, Rg)` with the
    forward "adding" composition. That last one is load-bearing and it earned its
    place immediately — it caught a first-order truncation in the small-`x`
    transmittance branch (1.9e-7 -> 4e-14).
  - **Validation rig: `scattering.html`.** Pixels against the analytic model, not
    against taste. A pigment of known K and S is divided by a white Lambert patch
    under the same directional light, which cancels exposure, intensity and units
    exactly and leaves `R`; contaminants are removed by construction rather than
    corrected for (black backdrop, directional light, GI off, specular off), and
    ACES + gamma are inverted exactly.

    | slab | chord | measured R (r/g/b) | analytic R | error |
    |---|---|---|---|---|
    | 10 mm | 11.2 mm | 0.222 / 0.242 / 0.234 | 0.223 / 0.244 / 0.237 | −0.6 / −0.9 / −1.4% |
    | 20 mm | 22.1 mm | 0.317 / 0.370 / 0.353 | 0.321 / 0.377 / 0.357 | −1.5 / −1.8 / −1.0% |
    | 40 mm | 44.1 mm | 0.388 / 0.512 / 0.468 | 0.394 / 0.514 / 0.467 | −1.4 / −0.4 / +0.1% |
    | 80 mm | 88.8 mm | 0.419 / 0.605 / 0.528 | 0.418 / 0.608 / 0.525 | +0.2 / −0.4 / +0.5% |
    | 160 mm | 181 mm | 0.419 / 0.628 / 0.528 | 0.420 / 0.639 / 0.536 | −0.3 / −1.8 / −1.6% |

    The residual is at the 8-bit readback floor (one code step is ~1–4% of a
    linear value up there), and the CURVE SHAPE — monotone rise converging on
    `R_inf` = 0.420 / 0.642 / 0.537 — is the assertion that cannot be faked by
    exposure.
  - **Curved geometry, and a finding.** Phase 2 probes a sphere centre-to-rim,
    where the thickness is authored nowhere and is simply what the geometry gives
    the ray. It needed its OWN, much weaker pigment, because **a refracting
    sphere's chord does not go to zero at the rim**: grazing rays bend inward, so
    the internal angle tops out at `asin(1/n)` and the chord floors at
    `2R*sqrt(1 - 1/n^2)` — about 75% of the diameter at ior 1.5. The visible disc
    spans only a 34% thickness range, and at the slab pigment's `S = 30` every
    probe reads `R_inf`: a flat profile that would LOOK like a pass while testing
    nothing about thickness.

    | b/R | chord | measured R (r/g/b) | analytic R | error |
    |---|---|---|---|---|
    | 0.00 | 500 mm | 0.181 / 0.277 / 0.229 | 0.183 / 0.281 / 0.232 | −1.1 / −1.5 / −1.1% |
    | 0.30 | 490 mm | 0.179 / 0.273 / 0.226 | 0.182 / 0.278 / 0.230 | −1.5 / −1.7 / −1.7% |
    | 0.55 | 465 mm | 0.176 / 0.264 / 0.221 | 0.179 / 0.271 / 0.225 | −1.8 / −2.3 / −2.1% |
    | 0.75 | 433 mm | 0.170 / 0.248 / 0.210 | 0.176 / 0.260 / 0.219 | −3.5 / −4.5 / −4.1% |
    | 0.90 | 400 mm | 0.160 / 0.229 / 0.196 | 0.172 / 0.248 / 0.211 | −6.9 / −7.7 / −7.1% |

    Monotone falloff with the chord, tracking the analytic prediction; the error
    grows toward the rim where partial pixel coverage and the un-modelled Fresnel
    reflection both bite. Zero blown or NaN pixels across the whole 51 529-pixel
    silhouette scan — the guards hold at the degenerate end.
  - **Cost — and the surprise is that there almost isn't one.** Fence-timed
    medians on an RTX 3060, museum scene, 1280x720 canvas at `renderScale 0.5`,
    full stack (GI + emissive + reflections + refraction), ONE foregrounded page
    at a time (two live WebGL contexts contend, and a backgrounded one times
    nonsense — the 0.9.0 notes record 27 ms for work that read 71 ms in front):

    | leg | `restir: true` | `restir: false` |
    |---|---|---|
    | (a) master baseline | 47.31 ms | 56.89 ms |
    | (b) feature branch, nothing scatters | 47.14 ms | 56.80 ms |
    | (c1) exhibit present, absorption only (0.8.0 program) | 51.76 ms | 61.69 ms |
    | (c2) exhibit present, + coloured shadows (0.9.0 program) | 59.13 ms | 81.50 ms |
    | (d) exhibit present, **scattering on** | 59.38 ms | 81.56 ms |
    | **(b) − (a)** off-state | **−0.17 ms** | **−0.09 ms** |
    | **(d) − (c2)** scattering, isolated | **+0.25 ms** | **+0.06 ms** |
    | **(d) − (c1)** what a user actually pays | **+7.62 ms** | **+19.87 ms** |

    The isolated cost is **inside the noise**, against a pre-registered budget of
    +5 ms — because the design the register ceiling forced also turned out to be
    the fast one. Scattering adds no rays and no traversals; it is arithmetic
    hung on a chord the shader was already computing, and a handful of guarded
    branches on the shadow march. What a user actually pays coming from a
    non-shadowed baseline is (d) − (c1), and **that is coloured shadows**, not
    this feature: the KM variant is a superset, so enabling it enables the
    shadow march. (c1) − (b) is 4.6 / 4.9 ms of exhibit GEOMETRY — more
    triangles and more glass pixels on screen — not feature cost at all.
  - **Limitations, stated because they are the difference between this and
    subsurface scattering.** **No lateral bleed**: this is 1-D transport along
    the ray, light leaves where it entered, so a thin edge does not glow from
    light that entered elsewhere. **No in-scattering into shadow rays**: a lit
    body does not add light to its own shadow. **`R` is used as a diffuse albedo
    under `N.L`** — the standard approximation (Kubelka-Munk derives `R` under
    diffuse illumination), exact in the ambient limit, slightly over-bright at
    grazing incidence. **One medium along the view path** (above). **Requires
    `refraction: true`**, for the same structural reason. **Bodies thinner than
    `2 x eps` cannot resolve their own exit face**, which is why the demo's shade
    is cast stone with a 14 cm wall rather than fabric.
  - **Demo: "Alabaster".** A reading lamp on a side table in the front-left
    gallery, hidden until the new **"scattering (Kubelka-Munk)"** toggle. One
    object carries both halves of the feature: the shade's outside is lit by the
    room and shows the two-flux reflectance over its own wall thickness, while
    the bulb inside lights the table THROUGH that wall by the two-flux
    transmittance. Beside it, two spheres identical in geometry and in K,
    differing only by one `userData.rtScattering` line — with the feature on the
    left stays a dark green glass marble and the right becomes jade. The toggle
    borrows ReSTIR the same way "tinted shadows" does (the reservoir path shades
    primary direct light with one BINARY visibility ray, so the transmitted half
    would otherwise never reach the table); both toggles now share one COUNTED
    lease instead of each stashing a private copy, because either can be switched
    while the other is on.
  - **`rt.eps` is a constructor option, not a property** — the auto-scaler is
    armed by `options.eps == null`, so a later assignment is silently overwritten
    on the next compile. The validation rig hit this first time out (the auto
    value put the refraction entry point below a 10 mm slab entirely, which read
    as a black tile); now documented at the call site and in the README.

## 0.9.0 — 2026-07-26

- **Museum demo reorganised into zoned galleries.** Materials pieces (sphere
  bench, gold knot, teapot, vertex-painted ico) consolidated back-right; the
  physics drop pad and the fox share a dynamics corner; the centre floor is
  cleared for the new **"Lumiere"** freestanding stained-glass screen — a 3x3
  grid of absorbing glass tiles with a projector spotlight behind it, revealed
  by the "tinted glass" toggle. With "tinted shadows" on, the beam lays a
  nine-tile colour quilt on the floor; off, the same beam casts a flat dark
  rectangle — the feature's live A/B. Nothing floats: every exhibit is seated
  or visibly wall-mounted (audited programmatically; the wall panes gained
  bronze standoff pegs, the OPEN sign a stand, and the helmet no longer sinks
  0.33 m into its plinth). Turning "tinted shadows" on visibly unchecks ReSTIR
  (reservoir visibility is still binary, so the effect is invisible with it
  on); a manual ReSTIR click always wins, and the previous state is restored
  when the toggle goes off.

- **Coloured shadows: shadow rays through absorbing glass are attenuated, not
  blocked.** A shadow ray crossing a glass material that carries a Beer-Lambert
  σ (0.8.0's `attenuationColor` + `attenuationDistance`, or
  `userData.rtAttenuation`) is now multiplied by `exp(−σ·d)` per RGB channel over
  the distance it spends inside, instead of being occluded outright. Stained
  glass spills tinted light; a lightbox behind stacked translucent bodies now
  **lights** what is in front of them instead of rendering as a black silhouette
  (the 3D-print preview case, where 90-95% of pixels are multi-body stacks);
  clear glass — a glass material with no `attenuationDistance` — stops casting a
  shadow at all, which is the physically right answer and one 0.8.0 could not
  express. New option/property `rt.absorptionShadows`, default `true`,
  meaningful only when the compiled scene has an absorbing material.
  - **An ORDERED closest-hit march with a current-medium state machine**, capped
    at 8 interface events. Deliberately **not** the cheaper unordered any-hit
    signed sum (+σ on front faces, −σ on back faces): real multi-body geometry
    contains body-to-body interfaces where only ONE of two coincident walls
    survives, so entry/exit events do not pair and a signed sum goes **negative**
    — optical gain, bright halos. The march cannot produce negative optical depth
    however unbalanced the interfaces are. Hitting the event cap returns the
    transmittance accumulated so far: a slightly-off tint, never a black
    silhouette. Optical depth is charged **interface to interface**, not from the
    stepped-off ray origin — the difference is the `2 x eps` skipped past each
    hit, which measured as a 10-15% under-attenuation of a 4 cm slab and rather
    more in scenes whose auto-scaled epsilon is larger.
  - **Scope, v1 — the two next-event shadow rays only** (analytic point / spot /
    directional lights, and emissive-mesh area lights). Explicitly NOT: the
    **ReSTIR visibility ray** (so with `restir: true`, the default, primary
    direct light is still binary-shadowed — a real energy mismatch between the
    reservoir path and the NEE path, documented rather than hidden), the
    volumetric march's occlusion samples, and refraction (shadow rays are
    straight segments). Any `transmission > 0` material is fully transmissive to
    shadow rays; `transmission: 0.5` does not half-block. The view path is
    unchanged.
  - **Zero new resources.** No new sampler (this pass is at the WebGL2
    16-sampler minimum), no new uniform, no new `traceRadiance` call site, and
    exactly ONE textual call to the closest-hit kernel inside the march
    (`traceBoth`, reused by the loop) to keep the inlined footprint small. The
    "is this glass to a shadow ray" flag is the material's transmission, written
    into row 67's previously-unused `.w` channel — a channel that was already
    allocated, so it costs nothing. **This budget is real, not theoretical:** an
    experimental any-hit fast path added inside the march (a pure, exact
    short-circuit) failed to link on NVIDIA native GL with
    `C5041: cannot locate suitable resource to bind variable "@_ustack..."` —
    four inlined BVH traversal stacks in one call frame is over the driver's
    budget. It was reverted; the shipped march has two.
  - **Zero cost when unused, provably.** Source splice, not `#ifdef`:
    `stripAbsorption` generalised to `stripMarked(src, tag)` over a second
    `RT_ABSORB_SHADOWS` marker pair, giving three cached variants (plain /
    absorption / absorption+shadows). With no absorbing material, or with
    `absorptionShadows: false`, the generated fragment source is
    **byte-identical** to master's — proved twice: at the module level against a
    master worktree (plain 52 378 B `sha 44d6be4e...`, absorption-only 55 257 B
    `sha 1804cf41...`, both matching) and **live** via `getShaderSource` on the
    running program (54 118 B and 56 997 B after three's preamble, both
    matching). Frame-time difference on the off-paths: **−0.03 ms** and
    **+0.05 ms**, i.e. nothing. Every call site is add-lines-only — the existing
    `occluded()` line survives the strip untouched and is disabled in the spliced
    variant by a constant-false branch rather than by editing it.
  - **Cost — this one is NOT free, and the README says so.** Fence-timed medians
    on an RTX 3060, museum, 1280x720 at `renderScale 0.5`, full stack
    (GI + emissive + reflections + refraction), single foregrounded page,
    alternating master/feature navigation:

    | leg | `restir: true` | `restir: false` |
    |---|---|---|
    | (a) master baseline | 67.20 ms | 78.17 ms |
    | (b) feature, no absorbing material | 67.17 ms | 78.21 ms |
    | (c) tinted glass on, `absorptionShadows: false` | 68.82 ms | 79.85 ms |
    | (d) tinted glass on, `absorptionShadows: true` | 82.65 ms | 108.54 ms |
    | **(d) − (c)** | **+13.83 ms** | **+28.69 ms** |

    `restir: false` is the honest column — that is the configuration in which the
    feature acts on primary direct light, and there it costs about a third of the
    frame. Profiling with the event cap forced to 1 attributes ~21 ms of the
    28.7 ms to the any-hit -> closest-hit swap **alone** (a bounded, unordered,
    early-outing traversal replaced by an unbounded ordered one, on every NEE
    shadow ray) and the rest to marching past glass interfaces. The cost
    therefore scales with shadow-ray count, not with how much glass is on screen.
    There was no pre-registered gate for this number; it is reported, not buried.
    An interleaved two-tab measurement rig was discarded first — a backgrounded
    WebGL context timed 27 ms where the same work read 71 ms in front.
  - **Demo:** a **"tinted shadows"** sub-toggle under **"tinted glass"**, bound
    to `rt.absorptionShadows` and nothing else, so the fps delta beside it is the
    shadow march's isolated cost. The note under it names what the effect needs
    (ReSTIR lights off, emissive area lights on) rather than silently flipping
    them. With the piece revealed in a dimmed room the Sunset backlight now
    lights the bronze frame's inner cheek amber and lays a warm halo on the red
    wall; with the sub-toggle off, both go black
    (`.shots/colored-shadows-museum.png` and its `-off` counterpart).
  - **Regression rig:** `absorption.html` grows a phase 2 and 3. Phase 1 is
    untouched (the new meshes start hidden, so the compiled scene is exactly what
    it was) but gains a **quantitative** backlit assertion: the covered panel over
    the uncovered one in **scene-linear** radiance (ACES and the 1/2.2 gamma are
    inverted exactly) versus `exp(−σ·d)` over the Snell-refracted chord, with the
    Fresnel share divided out and the additive leak **measured** on amber's
    analytically-transparent red channel rather than assumed — plus the
    geometry-free invariant `tau_B/tau_G = sigma_B/sigma_G` (2.213 measured vs
    2.319 analytic). Phase 2 is the new stack case: two overlapping slabs 8 m
    under a small lamp throwing amber, blue and their product onto a white floor
    coplanar with the lightbox (so the lightbox, a huge emitter, contributes
    exactly zero). Slab thickness equals `attenuationDistance`, so each slab's
    analytic transmittance IS its `attenuationColor`. Measured vs analytic:
    amber +0.2/+1.3/+1.9%, blue +2.9/−0.4/+0.9%, overlap +3.3/+3.2/+4.6%
    (tolerance 10%); the **product** assertion — overlap vs measured-amber x
    measured-blue — lands +0.1/+2.2/+1.8% (tolerance 8%). Phase 3 is the A/B
    control: the same frame with `absorptionShadows: false` must put every
    covered column back in hard shadow (max ratio 0.014). The rig is what caught
    the interface-to-interface bookkeeping bug above.
  - **Outstanding: WebKit/iPad verification.** Playwright's Windows WebKit has no
    usable WebGL2 here and is not Apple's Metal stack, so the one engine whose
    GLSL->Metal codegen has broken this megakernel before (the 0.4.0 fourth
    `traceRadiance` call site) is untested with the march compiled in. The NVIDIA
    `C5041` failure above shows the inlining budget is genuinely close. Verify on
    a real iPad with the feature ACTIVE before release.

## 0.8.0 — 2026-07-25

- **Per-material Beer-Lambert absorption — tinted glass done right.** Light
  crossing a glass material's interior is now attenuated `exp(−σ·d)` per RGB
  channel over the **in-medium path length**: a thick slab of the same amber
  tints deeper than a thin one, thickness compounds exponentially, and a
  **backlit** pane glows in the filtered colour for free (an emissive surface
  seen through glass rides the refracted view segment, which is exactly the
  segment being attenuated). Games get tinted bottles, ice, stained glass and
  display cases; the sibling 3D-print project gets translucent stack previews.
  - **Opt-in, three.js-native.** A glass material (`transmission > 0`, not
    `transparent`) with a **finite, positive** `attenuationDistance` and an
    `attenuationColor` (the colour that survives one such distance) absorbs
    with `σ = −ln(attenuationColor) / attenuationDistance` per channel
    (channels floored at 1e-4, so pure black stays finite). three's own default
    `attenuationDistance: Infinity` means "off", which makes the finite value
    the explicit opt-in — nothing changes for existing scenes.
    `userData.rtAttenuation = { color, distance }` is the identical control for
    materials without the physical fields; it wins when both are present, and
    warns (rather than silently mis-rendering) when malformed or set on a
    non-glass material. Recompile after changes, like any material edit.
  - **Where it acts.** The one place the shader already computes an in-medium
    distance: the glass path's entry-to-exit refracted chord in the lighting
    megakernel. The transmitted term (surface shading, emissive glow, sky —
    whatever came back through the exit interface) is multiplied by the
    transmittance; the Fresnel reflection half never entered the medium and is
    untouched. The medium is identified by the **exit** interface's material,
    correct for closed glass volumes (an open sheet's exit lands on a sigma-0
    surface and attenuates nothing — no false tinting over air).
  - **Zero cost when unused, provably.** σ rides a new **row 67** of the
    existing scene-data texture (1 texel per material, appended — both row-0
    material texels were fully packed and every consumer addresses rows by
    absolute constants, so nothing existing moved). No new sampler (the pass
    sits at the WebGL2 16-sampler minimum), no new uniform, and **no new
    traceRadiance call site** (the WebKit/Metal budget). The shader code is
    gated by **source splice, not an `#ifdef`**: when the compiled scene has no
    absorbing material the marked lines are stripped and the program source is
    **byte-identical** to the pre-feature build — verified with a
    `getShaderSource` diff against a v0.7.0 checkout, plus a bit-identical
    400-frame museum render (mean per-pixel diff 0.0). Fence-timed A/B on the
    museum (RTX 3060, 720p canvas): absorption-on vs same-scene-absorption-off
    measured **below the noise floor** at both lighting scales (−0.09 ms @0.5,
    −0.34 ms @1.0, interleaved medians; spreads ±0.2/±0.4 ms).
  - **Demo: "tinted glass" toggle + the "Sunset" cast-glass relief.** A backlit
    shadow-box on the museum's red wall, beside the blue alpha pane (the pair
    contrasts the out-of-BVH blend trick with real refractive glass): a warm
    emissive panel behind a 4×4 grid of chunky cast-glass blocks whose
    **thickness is the palette** — the same amber reads pale at 10 cm and burnt
    orange at 24 cm. The piece and its absorbing materials compile in/out WITH
    the toggle, so OFF really is today's program and flipping it while watching
    the fps readout is the feature's live cost A/B. Turning it on brings
    refraction with it.
  - **Regression rig: `absorption.html`.** Slabs on an emissive lightbox
    (self-lit, so the readout is `Le · exp(−σ·d)` uncontaminated by the
    engine's opaque glass shadows): a ×2 thickness staircase must darken and
    saturate monotonically, a blue-on-amber stack must differ from (and
    undercut) its lone slabs, a backlit panel must glow through amber visibly
    but tinted vs an uncovered reference, all with zero GL errors and clip-free
    probes. Asserted automatically into `#absorption-verdict`.
  - **Honest limits** (also on the README matrix row): tinted transmission
    only, no scattering; closed volumes; glass still occludes shadow rays
    fully (no coloured shadows); one in-medium layer per view path (a stack's
    second body resolves via the single behind-trace as a lit surface); media
    thinner than ~`2 × rt.eps` cannot resolve an exit interface.

## 0.7.0 — 2026-07-25

*(0.7.0 candidate. Also carries the volumetric-albedo entry further down, which
landed on master unreleased.)*

- **Usage diagnostics: `rt.status.warnings`.** A hybrid tracer's worst failure
  mode is the *silent* one — the image renders, nothing throws, and the lighting
  is quietly computed against a scene that isn't the one on screen. The renderer
  now detects the common integration mistakes, prints **one** `console.warn`
  naming the object and the exact fix, and records the same thing as
  `{ code, message }` on the new `status.warnings` array (deduplicated).
  **`status.ok` is unaffected** — these are scene-setup diagnostics, not pipeline
  failures, which keeps the 0.6.1 compile-failure surface (`ok` / `disabled` /
  `coreFailure`) meaning exactly what it meant before. `compileScene()` also
  returns them on the compiled scene (`compiled.warnings`), so the standalone
  export reports too. Documented under *Diagnostics* in the README, with a
  troubleshooting section for the symptoms people actually search for ("black
  patches", "the shadow doesn't move", "still hit the original shape").
  - `stale-geometry` / `stale-transform` — a **static** mesh whose `position`
    buffer changed, or which was moved, after `compileScene()`. This is the
    stale-BVH bug (rasterized image shows the new pose, traced lighting still
    shadows/bounces off the old one) and it was completely silent before. The
    compiler fingerprints every static source mesh (a `WeakRef`, its position
    attribute's `version`, and a `Float64Array` copy of `matrixWorld.elements`);
    `render()` re-checks them on **every 30th frame**, stops checking a mesh once
    it has reported, and caps at 8 reports — no allocation, no measurable
    per-frame cost, and no strong reference to the app's meshes.
  - `rtdeforming-not-dynamic` — `userData.rtDeforming` set on a mesh that is not
    in `dynamicMeshes`. The flag was silently ignored (the mesh compiled static);
    it also meant a *grouped* mesh with the ignored flag skipped the
    groups+deforming throw, so the combination looked supported. The README's
    multi-material-groups row now says the throw applies to the flag **plus**
    membership, which is what the code always did.
  - `implicit-compile` — `render()` compiled the scene itself because no
    `compileScene()` call preceded it. That path takes no options, so everything
    is static and `updateDynamic()` has nothing to update.
  - `untraceable-object` — a visible `Sprite` / `Line` / `Points`.
  - `instanced-mesh` — an `InstancedMesh` (collapses to a single instance).
  - `transparent-dynamic` — a `transparent` mesh listed in `dynamicMeshes`, which
    does nothing (transparent meshes are dropped before dynamic registration).
- **Sprite / Line / Points are excluded from the G-buffer (bug fix).** Their
  materials write a single `gl_FragColor`, and rendering one into the G-buffer's
  4-attachment MRT framebuffer is a `GL_INVALID_OPERATION` — an ESSL1 fragment
  shader cannot feed multiple draw buffers. The G-buffer pass now **hides** such
  objects for the duration of its draw and restores their `visible` flag right
  after (the same save/restore discipline it already used for material swaps), so
  a scene with a HUD sprite no longer errors. They were never traceable geometry
  either — the BVH compiler always skipped them — so this makes the two halves
  agree, and the accompanying `untraceable-object` warning tells you to draw them
  in your own overlay pass on top of `rt.render()`. `userData.rtExclude` silences
  the warning. The new `?selftest=warnings` leg asserts **zero GL errors** across
  frames with a `Sprite` and a `Line` visible.
- **Adaptive quality now works below 10 fps (bug fix).** `_adaptQuality` bailed
  out of any frame longer than 100 ms, on the theory that such a frame is a
  hidden-tab stall. The result was a **dead zone**: a device steadily rendering at
  2.5–10 fps fed the governor *no samples at all*, so it never adapted — and
  `_overloadBrake`, the only other safety net, needs three consecutive frames over
  400 ms. The exact devices that most need dynamic resolution scaling were the
  ones that never got it. Hidden tabs are now excluded properly (a
  `document.visibilityState === "hidden"` check that resets the timer, mirroring
  `_overloadBrake`), only frames over **2 s** are discarded as genuine
  stall/resume, and everything from 100 ms to 2 s feeds the EMA. Because a single
  very slow sample can now imply a huge correction, one adaptation may move
  `renderScale` by at most `MAX_SCALE_STEP` (0.25 — five ladder steps); the
  cooldown takes the next step if the device is still slow. `_overloadBrake` is
  unchanged.
- **Render self-test:** new gating `?selftest=warnings` leg (chromium) that drives
  a deliberately mis-configured scene and asserts each diagnostic fires **exactly
  once** across ~100 frames, that `status.warnings` carries the expected codes,
  that `status.ok` stays true, and that the visible `Sprite`/`Line` produces zero
  GL errors. The healthy `?selftest=1` verdict now reports `warnings` /
  `warningCodes` and its pass gate **requires `warnings === 0`** — so a diagnostic
  that starts false-positiving on a correct scene fails the suite. (It caught one
  immediately: snapshotting `matrixWorld` into a `Float32Array` rounded three's
  doubles enough that 36 of the demo's 41 static meshes read as "moved".)
- **README:** new *Diagnostics* + *Troubleshooting* sections; a
  *Supported object types* table (`Mesh` / `SkinnedMesh` / `InstancedMesh` /
  `Sprite`·`Line`·`Points` / `rtExclude`); first-ever documentation of
  **`canvasScaleHook`** (with the CSS-stretch recipe and the `taaJitterScale`
  rule) plus a *Recommended integration* block wiring `detectTier()` →
  `recommendedOptions()` → `adaptiveQuality` + `canvasScaleHook`; an `alphaMap`
  row in the materials table (unsupported — opacity is a scalar per material);
  `targetFps` / `canvasScaleHook` / `taaJitterScale` in the options table; and
  three additions to the transparency notes (the blend-behind radiance is a
  genuinely traced ray, only BVH geometry shows through so an intermediate
  translucent layer disappears when covered, and behind-radiance bypasses the
  firefly/irradiance clamps so emitters read hotter through glass).

- **World-space 3D-texture albedo (`userData.rtVolumeAlbedo`) — "volumetric
  surface albedo".** A material can now be coloured by a **3D texture sampled at
  the world-space ray hit point** instead of a flat colour or a 2D UV map — the
  path-tracer-native way to paint a **volumetric data field** (stress,
  temperature, density, a distance field) onto a surface, where a custom fragment
  shader can't run. Opt in with
  `material.userData.rtVolumeAlbedo = { texture, origin, size }` (an
  already-colour-mapped `THREE.Data3DTexture` plus a world→texture transform:
  `origin` = world position of the texel-(0,0,0) corner, `size` = the volume's
  world extent). At the hit point `p` the tracer computes
  `uvw = clamp((p - origin) / size, 0, 1)` and samples the texture **trilinearly**
  (Linear + ClampToEdge are set on the texture at compile time), and the sampled
  RGB **replaces the base albedo** — `roughness` / `metalness` / `emissive` still
  compose normally. The substitution runs in **both** the G-buffer (primary
  visibility, so raster/hybrid views agree) **and** the traced GI / reflection
  bounces (so the field's colours bleed correctly through global illumination).
  The library samples `.rgb` directly and contains **no colormap logic** — the
  caller supplies the colours. RGBA8 works (no float-texture filtering required).
  Updating the texture *data* (an animated field) needs only
  `texture.needsUpdate = true`; changing which material carries it, or its
  `origin` / `size`, needs a `compileScene()`.
  - **Off-by-default, byte-identical when unused.** The entire GLSL is behind a
    compile-time `RT_VOLUME_ALBEDO` define, injected only when a scene registers a
    volume material. Scenes that don't use the feature compile the **exact same**
    G-buffer and lighting programs as before (no extra sampler, no extra branch);
    the render self-test's gallery scene is unchanged (`meanLum ≈ 139.8`,
    `rtPrograms = 15`, `statusOk`).
  - **Single-volume in the bounce path (v1); unlimited in primary visibility.**
    The lighting megakernel already binds the WebGL2-guaranteed minimum of **16**
    fragment samplers, so the bounce path's `sampler3D` (the 17th) is compiled in
    only when the GPU exposes ≥ 17 fragment texture units (`MAX_TEXTURE_IMAGE_UNITS`
    — most desktop GPUs report 32). On a 16-unit device the GI/reflection bounce
    falls back to the material's flat base colour (one-time `console.info`) while
    the G-buffer still shows the full field. The G-buffer path is per-mesh, so
    **distinct volumes each render correctly in primary visibility**; only the
    traced bounce is limited to the first volume. Multi-volume bounces are future
    work — the `userData` API doesn't preclude them.
  - **New demo page** [`volumetric-albedo.html`](volumetric-albedo.html): a torus
    knot coloured by a procedural 3D noise field (turbo colormap) under an emissive
    area light, its colours bleeding onto white walls through GI. Wired into the
    vite build inputs and `npm run deploy`.
  - Typed in `src/index.d.ts` (`VolumeAlbedo` interface + `CompiledScene.volumeAlbedo`).

## 0.6.1 — 2026-07-23

- **Compile-failure status + graceful degradation (`rt.compileError` /
  `rt.status`).** A pass whose program fails to *link* renders black without
  throwing (three logs and sets `program.diagnostics.runnable = false`, but
  rendering proceeds), which is exactly how the r166+ `luminance` break looked
  from the outside — indistinguishable from `supported: false`. Every pass
  `ShaderMaterial` now carries a stable `name` (`rt:lighting`,
  `rt:restir-temporal`, `rt:restir-spatial`, `rt:gi-reservoir`, `rt:denoise`,
  `rt:taa`, `rt:volumetric`, `rt:gbuffer`, `rt:composite`, plus `rt:specular` /
  `rt:taa-copy` / `rt:history-carry` helpers), and over the first several
  rendered frames the renderer scans `renderer.info.programs` for failed `rt:*`
  programs (polled, not frame-1-only, since three checks link status lazily and
  can defer it under `KHR_parallel_shader_compile`). On a failure it either
  **auto-disables the mapped optional feature** so the image stays lit
  (`restir` → non-reservoir direct path, `restirGI`/`denoise`/`volumetric`/`taa`/
  `specular` → off) and `console.warn`s once with the pass name + driver log, or,
  for a **core** pass (gbuffer/lighting/composite) with no fallback, records it
  and keeps rendering the now-diagnosed black frame. Results are surfaced as
  `rt.compileError` (`string | null`, first/most-severe summary) and `rt.status`
  (`{ ok, disabled: [{ pass, feature, reason }], coreFailure }`), so an integrator
  can render an honest `raster (reason)` fallback. Typed in `src/index.d.ts`; the
  render self-test now asserts `rt.status.ok` on the healthy path.
- **Self-test three-version matrix + `three@latest` compatibility.** The
  `luminance` break shipped because nothing tested a newer three, so
  `scripts/selftest.mjs` now runs the chromium leg **twice** — once against the
  pinned `three` (0.160.1) and once against a `three-latest` devDependency
  (`npm:three@latest`) via a second vite with `RT_THREE=latest` (aliased in
  `vite.config.js`; default behaviour is byte-identical). Both chromium legs are
  required to pass. Making the `three@latest` leg green surfaced a second
  peer-range break: three **r172 removed `WebGLMultipleRenderTargets`** (its
  successor is `WebGLRenderTarget({ count })`, whose attachments are `.textures`,
  not an array `.texture`). A small JS shim (`src/mrtCompat.js`, `makeMRT`)
  constructs the right target for the installed three and keeps the library's
  `.texture[i]` call sites working on both — no GLSL touched. Verified green on
  three 0.160.1 **and** 0.185.1.
- **Empty-scene `compileScene` is a no-op.** `rt.compileScene(scene)` on a scene
  with no traceable meshes previously threw (`no meshes found`); it now warns once
  and keeps any previously compiled scene, and `render()` with nothing compiled
  falls back to plain rasterization instead of crashing or drawing black. This
  makes "construct the tracer, then add meshes" a valid call order. Covered by a
  new `?selftest=empty` check in the self-test matrix.

- **Fix: black lighting on three r166+ (`'luminance' : function already has a
  body`).** Since r166, three.js prepends its own `float luminance(vec3)` to the
  fragment shader of every non-raw `ShaderMaterial` (`getLuminanceFunction()` in
  `WebGLProgram`). Our ReSTIR, GI-reservoir, and denoise shaders each defined a
  `luminance` of the same signature, which GLSL rejects as a redefinition — the
  affected programs failed to compile and everything those passes fed went black,
  while `rt.supported` still read `true`. The helper is renamed `rtLum` in all
  three passes (an `#ifndef` guard would not help: three's injected copy is
  unguarded). Verified with the render self-test on three 0.169.0 (fail → pass,
  glErrors 9 → 0, irradiance luminance 0 → 170) and on the pinned 0.160.1
  (unchanged). Found in the field by a molecule-viewer integration on three
  0.169; the library's peer range (`three >=0.155.0`) now actually holds again.

## 0.6.0 — 2026-07-22

- **ReSTIR GI reservoir-sample validation (experimental).** Fixes stale bounce
  light: switch a light off and the reservoirs used to keep bouncing its ghost,
  fading slowly instead of going dark. Every frame a rotating 1-in-N subset of
  pixels (`restirGIValidate`, default `8`, `0` = off) re-aims its single GI
  candidate ray AT the reservoir's stored hit instead of a fresh cosine bounce
  (`dir = normalize(storedHit - P)`) and re-shades it. If the hit distance no
  longer matches the stored one (geometry moved / occluder / miss) OR the re-shaded
  target has collapsed to near-black (the light went off), the reservoir is KILLED
  — the stale temporal term is dropped so the pixel's fresh candidates rebuild from
  the current scene; otherwise it is left untouched. The kill is deferred to the
  STORE (the displayed frame still uses the merged history, so a valid pixel never
  drops out), which keeps a static scene from drifting. The re-shade averages a few
  NEE samples so the kill fires on a real collapse, not on single-sample shadow
  noise. Reuses the single existing candidate trace (no extra bounce rays) and adds
  no samplers; the only added cost is a few shadow rays on the ~1/N validating
  pixels. `restirGIValidate=0` is byte-identical to before the feature. Wired as the
  `restirGIValidate` lib option / live property. (The originally-drafted "refresh
  the stored radiance + rescale W by clamp(pHat_old/pHat_new)" path was implemented
  and measured to darken static GI ~25% — the single-sample re-shade is heavy-
  tailed and the reservoir's radiance is RIS-bright-biased — so the kill-only path
  above is used instead.)

- **Fix: ReSTIR GI speckles on metals.** The external ReSTIR GI irradiance is
  added at the denoise stage, downstream of RTLightingPass's `mix(diffuse,
  reflRad, metal)`, so it never received the `(1 - metalness)` diffuse weight the
  inline GI path gets — metals (the gold torus knot, metalness 0.85) were lit by
  full-strength diffuse GI (~6.6x too much), whose residual per-pixel variance
  read as bright gold speckles on the curved surface (worst on iOS/Metal).
  `DenoisePass` now weights the GI add by `(1 - metalness)` per tap, making the
  ReSTIR and inline GI paths energy-consistent on metals and dropping the speckle
  amplitude with the excess brightness. No new samplers or `traceRadiance` sites;
  the firefly stack is untouched; non-metal surfaces and the non-GI/inline-GI
  paths are byte-identical.

- **Chromatic dispersion for glass (`dispersion`).** A new lib option / live
  property (`0..0.5`, clamped, default `0` = off) splits refracted white light
  into a spectrum — a diamond throws a rainbow. It uses **stochastic spectral
  sampling** to fit the shader's hard three-`traceRadiance` Metal call-site
  budget: each frame every glass pixel picks ONE colour channel `c` in R/G/B
  uniformly, traces the *same single* refraction path with a channel-shifted ior
  (`iorC = ior * (1 + dispersion * shift[c])`, `shift = (+1,0,-1)*0.5`), and
  returns the refracted radiance masked to `c` and weighted `x3`. The temporal
  accumulator blends the three per-channel estimates into a converged rainbow —
  **zero extra rays, zero new call sites, unbiased in the mean**. Only the
  transmitted term is channel-estimated; the Fresnel reflection stays full colour
  every frame (its weight uses the base ior). `dispersion == 0` consumes no extra
  `rand()` and is byte-identical to the pre-dispersion image. Because it relies on
  accumulation it shimmers slightly in motion. Global control only for now (no
  free G-buffer channel for a per-material `MeshPhysicalMaterial.dispersion`).
  Exposed in the demo as a **dispersion** slider in the RT-features panel.

- **ReSTIR GI spatial reuse (v2, experimental).** The `restirGI` pass, shipped in
  0.5.0 as temporal-only, now takes `restirGISpatialTaps` spatial taps (default
  `1`, tuned on-device; clamp `0..4`; `0` reproduces the exact v1 temporal-only
  image) of the
  previous frame's reservoirs after the temporal merge, in a single fused
  spatiotemporal pass — no new passes or ping-pongs. Each adopted neighbour
  sample is reweighted by the reconnection solid-angle→area Jacobian
  `|J| = (cosPhi_q/cosPhi_r)·(d_r²/d_q²)` (clamped to `[0.1, 10]`), gated by uv
  bounds + the temporal plane-distance validation + a non-empty reservoir, and
  finalized with one any-hit visibility ray at the reconnection point so reused
  samples cannot leak light through walls. The reconnection hit normal the
  Jacobian needs is bit-packed into the reservoir-position `.w` alongside `M`
  (8-bit `M` + 12+12-bit octahedral normal), keeping the pass at its 16-sampler
  ceiling. Mean matches taps-`0`; per-frame variance is lower. Wired as the
  `restirGISpatialTaps` lib option / live property.

## 0.5.0 — 2026-07-22

- **Fix: TAA wobble at reduced canvas scale** (`taaJitterScale`). The sub-pixel
  jitter is sized in buffer pixels, so a CSS-stretched reduced drawing buffer
  magnified it into visible screen shake — the lower the quality, the worse the
  wobble. The new property (default `1`) scales the jitter amplitude; the demo's
  canvas-scale hook sets it to the canvas scale so jitter stays constant in
  screen pixels.
- **Render self-test (`?selftest=1`) + CI smoke matrix.** A net for the class of
  failure behind the 0.4.0 iOS incident: a pipeline that compiles clean, reports
  framebuffer-complete, logs no error, and still draws black. The demo's new
  `?selftest=1` mode (`examples/selftest.js`) forces the full lighting stack on
  (GI + emissive NEE + reflections + refraction at 50% lighting), renders the
  standard scene, and after 90 rendered frames reads the drawing buffer back to
  assert the image is actually lit — a centre-25% luminance gate on both the
  composite and the raw irradiance buffer (`outputMode 3`), plus a `gl.getError()`
  gate and the `specMRT` / `supported` fallbacks. It emits one JSON verdict line
  to the console and a `#selftest-verdict` DOM node, and keeps rendering after so
  a human can watch. This mode is the only path that builds the renderer with
  `preserveDrawingBuffer: true`.
- **`npm run test:render`** (`scripts/selftest.mjs`) drives `?selftest=1` through
  Playwright across chromium, firefox and webkit, prints a pass/fail/skip table
  and exits nonzero on any failure. **Caveat, documented in the README:**
  Playwright's `webkit` on Windows is the WPE/GTK build, not Apple's Metal stack,
  so this matrix would NOT have caught the original iOS bug (a GLSL-to-Metal
  codegen failure). It catches API / JS / GLSL-frontend divergence between
  engines; real-device iOS testing stays manual (`?diag=1` / `?nospecmrt=1`).
- **BVH traversal-cost heatmap debug view** (`outputMode: 7`, "bvh cost" in the
  demo's view dropdown). The any-hit shadow-ray traversal now counts the BVH
  nodes it visits into a per-pixel `gBvhVisits` accumulator; the lighting pass
  maps that count through a cold→hot palette (blue = cheap, through green/yellow,
  to red/white = expensive) and writes it into the irradiance buffer instead of
  the accumulated lighting — bypassing temporal blending and the denoiser for a
  raw per-frame snapshot. It teaches where scene geometry is expensive: hot means
  many box tests per shadow ray (dense/overlapping geometry, long thin triangles,
  or rays skimming surfaces). Scale it with the `costScale` option / live
  property (default `1/96`) or the demo's "cost scale" slider. The counter is a
  single integer add per popped node and does not change shading when the view is
  off. No new samplers, and the strict 3-site `traceRadiance` Metal budget is
  untouched (the heatmap only instruments the existing any-hit function).
- **EXPERIMENTAL — ReSTIR GI (v1, temporal-only)** (`restirGI`, default **off**).
  Per-pixel reservoirs reuse the 1-bounce global-illumination sample across
  frames at the reprojected same-surface point (validated like the irradiance
  history). No spatial reuse in v1 — spatial needs the solid-angle→area Jacobian
  and is where implementations go subtly wrong; temporal reuse at the same
  surface point needs none.
  - Runs in a **new standalone pass** (`GIReservoirPass`) at lighting resolution
    with its **own** 16-sampler budget (8 BVH + 2 vertex-attribute + scene-data +
    gWorldPos + gNormalMetal + prevGWorldPos + 2 reservoir-history textures), so
    the lighting pass — already at the WebGL2 16-sampler minimum — is untouched.
  - GI-bounce hits are shaded **identically** to `RTLightingPass.traceRadiance`
    (direct + emissive NEE at the hit, sky/env on a miss), and the RIS estimator
    is derived so the **mean equals the inline GI path** (forcing the M-cap to 1
    with no history is statistically identical to the legacy path). Reservoir
    stores the candidate hit position + M and its radiance estimate + W.
  - When on, the lighting pass **skips its inline GI trace** (new `uExternalGI`
    uniform — not a sampler) and the resolved GI is **added at the à-trous
    denoise stage** (`DenoisePass` gained an optional additive input, guarded so
    it is byte-identical when unused). It is therefore only in effect when `gi`
    and `denoise` are both on. The GI is added downstream of the lighting pass's
    temporal history, so it never double-counts through it; the reservoir is the
    GI temporal integrator (expect a somewhat different convergence character).
  - New `restirGI` option/property (default false, live-toggleable) and demo
    toggle "ReSTIR GI (exp)"; `restirGIMCap` tunes the temporal M-cap (default 20).
- **Material-completeness pass** — three gaps in the material-support matrix closed
  with no new lighting-pass samplers (it sits at the WebGL2-guaranteed 16):
  - **Vertex colors.** A geometry `color` attribute (3- or 4-component; `.rgb`
    used) now multiplies into G-buffer albedo. Gated per mesh via three's
    `USE_COLOR` define — a mesh without a color attribute writes byte-identical
    albedo. Secondary GI/reflection rays keep the flat `material.color` (same
    documented caveat as texture maps).
  - **Per-material IOR.** `MeshPhysicalMaterial.ior` now refracts per material
    instead of only the global `rt.ior`. Audit finding: primary roughness is
    stored twice (`gAlbedoRough.w` **and** `gWorldPos.w`), so `gAlbedoRough.w` is
    dead — but the lighting pass samples only `gWorldPos`/`gNormalMetal` (exactly
    16 samplers), so reading a third G-buffer texture would exceed the guaranteed
    limit. Instead the IOR rides the previously-unused **[3,4) sub-band of the
    packed material word** in `gNormalMetal.w` (which the lighting pass already
    reads): every existing consumer decodes that band as transmission = 1.0 (full
    glass) unchanged, and the lighting pass additionally recovers `ior = 1 +
    (w - 3)`. Range [1.0, 1.98] (the ceiling keeps the word clear of the 4.0
    alpha-blend boundary under fp16 rounding). `rt.ior` stays the global
    fallback; `material.ior` wins when present.
  - **Multi-material groups.** A mesh with `mesh.material` as an array +
    `geometry.groups` now registers **each group's** material separately in the
    G-buffer (an array of gbuffer materials, rendered natively by three) and in
    the BVH (per-vertex material indices de-indexed through `toNonIndexed`
    order); emissive group materials also join the NEE area-light list. Opaque
    groups only (a transparent group throws — split it into its own mesh); not
    supported on CPU-deforming (`rtDeforming`) meshes (throws).
- **Deliberate omission documented:** `clearcoat` / `sheen` / `iridescence` stay
  unmodelled because their per-pixel lobe parameters have no remaining G-buffer
  channel (the 4-MRT WebGL2 guarantee is fully packed) — revisit with a WebGPU
  backend. The README matrix row now says so instead of a bare "Not modelled".
- **Demo:** a vertex-painted low-icosahedron sculpture (baked hue-by-height
  gradient) on a pedestal front-left; the materials-bench glass sphere set to
  diamond IOR (2.42) to show per-material refraction.
- **Skinned meshes — animated characters cast moving traced shadows.** A
  `SkinnedMesh` listed in `dynamicMeshes` is now **auto-detected** (via
  `isSkinnedMesh`, no `userData` flag) and CPU-skinned into the dynamic BVH every
  frame, so a rigged character casts a traced shadow that moves with its gait
  *and* rasterizes in its animated pose instead of the bind pose:
  - **BVH side** (`SceneCompiler`): each frame the mesh's *source* vertices are
    skinned once with three's own `SkinnedMesh.getVertexPosition` /
    `applyBoneTransform` (bind matrix + bone weights/matrices → local space),
    expanded through the de-index mapping into the merged triangle soup, then
    transformed by `matrixWorld` — matching the rigid/deforming paths. Skinning is
    O(source verts × 4 bones) with **no per-vertex allocation** (reused temporary),
    and secondary-ray **normals are per-face**, recomputed from the skinned
    triangle positions (no CPU normal skinning). Skinned segments force the
    per-frame normal upload like deforming ones.
  - **G-buffer side** (`GBufferPass`): the swapped `ShaderMaterial` now includes
    three's standard `skinning_pars_vertex` / `skinbase_vertex` / `skinnormal_vertex`
    / `skinning_vertex` chunks, so a `SkinnedMesh` rasterizes its animated pose
    (three defines `USE_SKINNING` and supplies the bind/bone-texture uniforms
    automatically; a non-skinned mesh compiles the identical source with the chunks
    collapsed to nothing). Primary visibility keeps smooth skinned normals; the
    per-mesh material cache means skinned/non-skinned meshes never share a program.
  - **Demo:** an animated **Fox** exhibit (Khronos glTF) trots on a low platform
    in the front-right floor, driven by an `AnimationMixer` ("Run" clip) and gated
    by a new **"fox walk"** toggle (Physics section, default on). ≈ 1.7k skinned
    source verts skin in ≈ 0.3 ms/frame.
  - The Fox ships without a `normal` attribute; the demo calls
    `computeVertexNormals()` on load so the raster path has bind-pose normals to
    skin (the BVH path derives its own per-face normals and was never affected).

## 0.4.2 — 2026-07-22

- **Real fix for black lighting on iOS** (root-caused by live bisection on an
  iPad): WebKit's GLSL-to-Metal translation silently emits a broken program
  when `traceRadiance` (BVH traversal + full hit shading) is inlined at a
  FOURTH call site — clean compile, black output, no console error. 0.4.0's
  alpha-blend straight-through trace was that fourth site. The blend
  continuation now reuses the GI bounce's call site (a blend pixel's secondary
  ray becomes the view continuation instead of a GI bounce — it forgoes the
  pane's own GI bounce, visually negligible, and saves a ray). The shader
  carries a hard call-site budget comment; iOS gets the FULL pipeline again,
  spec buffer and real transparency included. 0.4.1's functional MRT probe and
  single-attachment fallback remain as protection for genuinely MRT-broken
  devices.

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
