# Changelog

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
