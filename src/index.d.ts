import type {
  WebGLRenderer,
  Scene,
  Camera,
  Color,
  Vector3,
  Object3D,
  Data3DTexture,
} from "three";

/** Capability tier used to pick sensible defaults. */
export type Tier = "none" | "mid" | "high";

/**
 * Named quality preset accepted by {@link RealtimeRaytracerOptions.preset} and
 * {@link RealtimeRaytracer.applyPreset}.
 */
export type PresetName = "quality" | "balanced" | "performance" | "motion";

/**
 * One quality preset: a flat map of EXISTING option values. Every bundled knob
 * is live-tunable  -  none swaps the lighting megakernel's source or needs
 * compileScene (renderScale reallocates lighting targets, which the renderer
 * carries history across; the rest are uniforms or pass toggles read per frame).
 * Knobs that WOULD require a recompile (`absorptionShadows`, `kmScattering`,
 * `textureTiles`) are deliberately absent from every bundle.
 */
export interface RealtimeRaytracerPreset {
  renderScale?: number;
  denoiseIterations?: number;
  maxHistory?: number;
  taa?: boolean;
  restir?: boolean;
  giHalfRate?: boolean;
  specular?: boolean;
  /** Partial  -  a preset only ever sets `enabled`; density/maxDist/zones survive. */
  volumetric?: { enabled?: boolean };
  stochasticLights?: boolean;
  fireflyClamp?: number;
}

/**
 * World-space 3D-texture albedo ("volumetric surface albedo"). Set it on a
 * material's `userData.rtVolumeAlbedo` to make the tracer sample a 3D texture at
 * the world-space HIT POINT for that surface's albedo — colouring a mesh by a
 * volumetric data field (stress, temperature, density) instead of a flat colour
 * or a 2D UV map. The colour replaces the base albedo in BOTH primary visibility
 * (the G-buffer, so the raster/hybrid view agrees) and the traced GI / reflection
 * bounces (so the field's colours bleed correctly through global illumination).
 * Roughness, metalness and emissive still compose normally.
 *
 * ```js
 * material.userData.rtVolumeAlbedo = {
 *   texture,                      // THREE.Data3DTexture, RGB(A), already colour-mapped
 *   origin: new THREE.Vector3(),  // world position of the texel-(0,0,0) corner
 *   size:   new THREE.Vector3(1,1,1), // world extent of the full volume
 * };
 * rt.compileScene(scene);         // (re)compile after adding/changing it
 * ```
 *
 * The hit point `p` maps to `uvw = clamp((p - origin) / size, 0, 1)` and is
 * sampled trilinearly (the library sets Linear filtering + ClampToEdge on the
 * texture at compile time). The texture must be **already colour-mapped to RGB** —
 * the library samples `.rgb` directly and contains no colormap logic. Changing the
 * texture DATA later needs only `texture.needsUpdate = true` (no recompile);
 * changing which material carries the field, or its `origin` / `size`, needs a
 * `compileScene()`.
 *
 * **v1 is single-volume for the traced-bounce path.** Any number of materials may
 * carry distinct volumes and each renders correctly in primary visibility, but the
 * GI / reflection bounce samples only the FIRST registered volume (the lighting
 * megakernel is at the WebGL2 16-sampler minimum; the feature adds one sampler3D,
 * enabled only when the GPU exposes ≥ 17 fragment texture units — on a bare-minimum
 * 16-unit device the bounces fall back to the material's flat base colour while
 * primary visibility still shows the full field). Multi-volume bounces are future work.
 */
export interface VolumeAlbedo {
  /** A THREE.Data3DTexture, RGB(A) and already colour-mapped; `.rgb` is sampled. */
  texture: Data3DTexture;
  /** World position of the texel-(0,0,0) corner of the volume. */
  origin: Vector3;
  /** World extent of the full texture volume along each axis (non-zero). */
  size: Vector3;
}

/**
 * Per-material Beer-Lambert absorption ("tinted glass done right") — the
 * `userData.rtAttenuation` escape hatch for materials that lack the
 * MeshPhysicalMaterial fields. Light traversing a glass material's interior is
 * attenuated per channel by `exp(-sigma * distance)` over the in-medium path
 * length, so a thick slab tints deeper than a thin one and a backlit pane glows
 * in the filtered colour.
 *
 * The primary route needs no userData at all: a glass material
 * (`transmission > 0`, `transparent: false`) with three.js's own
 * `attenuationColor` (the colour that survives one `attenuationDistance` of
 * travel) and a **finite, positive** `attenuationDistance` opts in, and
 * `sigma = -ln(attenuationColor) / attenuationDistance` per channel. This
 * interface is the equivalent override for non-physical materials; when both
 * are present, userData wins. Setting neither — or a white attenuationColor,
 * or three's default `attenuationDistance: Infinity` — leaves the material
 * non-absorbing and the whole feature compiled out (`compileScene()` after
 * changes, as usual).
 */
export interface RTAttenuation {
  /** Colour that survives one `distance` of in-medium travel (THREE.Color or [r,g,b], 0..1). */
  color: Color | [number, number, number];
  /** World-unit distance over which `color` survives; finite and > 0. */
  distance: number;
}

/**
 * Per-material **Kubelka-Munk scattering** (`userData.rtScattering`) — the
 * opt-in that turns a translucent material into a physically-parameterized
 * SUBSURFACE one: jade, wax, marble, soap, foliage, a lampshade, pigmented
 * plastic. Absorption alone only ever removes light, so a pigmented body lit
 * from the front renders as black murk; a scattering coefficient sends light
 * back out of the surface, and the two-flux closed form turns (K, S, thickness)
 * into both a reflectance and a transmittance.
 *
 * The material must be one the tracer treats as translucent
 * (`transmission > 0`, `transparent: false`) — the march only ever steps into a
 * body it can pass through — and its base `color` should be **white**: the
 * computed reflectance IS the diffuse albedo, and the composite multiplies it by
 * the material colour (the same convention cast glass already lives under). A
 * non-white colour is warned about at compile time.
 *
 * The ABSORPTION half, K, is not stated here: it is the material's existing
 * `attenuationColor` + `attenuationDistance` (or {@link RTAttenuation}), so a
 * material describes its colour in one place. No attenuation at all is the
 * K = 0 case — a pure white scatterer, which is a perfectly good material.
 *
 * Requires {@link RealtimeRaytracer.kmScattering} to be on; with it off, or with
 * no material opted in, the lighting program is byte-identical to the build
 * without the feature.
 */
export interface RTScattering {
  /**
   * Scattering coefficient S directly, in 1/world-unit: a number (grey), an
   * `[r, g, b]` triple or a THREE.Color. For anyone with measured or fitted
   * Kubelka-Munk coefficients. Wins over `color`/`distance` when both are given.
   */
  coefficient?: number | Color | [number, number, number];
  /**
   * Authoring alternative to `coefficient`: the fraction of flux that survives
   * one `distance` of travel WITHOUT being scattered, so
   * `S = -ln(color) / distance` per channel — the same derivation
   * {@link RTAttenuation} uses for absorption.
   */
  color?: Color | [number, number, number];
  /** World-unit distance that `color` refers to; finite and > 0. */
  distance?: number;
}

/** Result of {@link RealtimeRaytracer.probeGPUTier}. */
export interface GPUTierProbe {
  /** Chosen capability tier. */
  tier: Tier;
  /**
   * Where the tier came from: `"webgpu"` (real adapter limits inspected),
   * `"webgl"` (WebGL `detectTier` heuristic on the supplied renderer), or
   * `"fallback"` (pure user-agent guess — no WebGPU and no renderer given).
   */
  source: "webgpu" | "webgl" | "fallback";
  /**
   * Diagnostics behind the decision: the adapter limits read, any masked
   * `adapter.info` fields, the computed `screenPixels` demand factor, and a
   * human-readable `reason`. Shape varies by `source`; treat as informational.
   */
  details: Record<string, unknown>;
}

/** Procedural-sky configuration (background + ambient light for escaping GI rays). */
export interface SkyOptions {
  /** Enable the procedural sky as background and ambient GI source. */
  enabled?: boolean;
  /** Direction pointing toward the sun; keep in sync with your DirectionalLight. */
  sunDir?: Vector3;
  /** Sun disc / directional colour. */
  sunColor?: Color;
  /** Sky colour at the zenith (straight up). */
  zenith?: Color;
  /** Sky colour at the horizon. */
  horizon?: Color;
  /** Overall sky brightness multiplier. */
  intensity?: number;
}

/** Distance-fog configuration (composited in linear space before tonemap). */
export interface FogOptions {
  /** Enable distance fog. */
  enabled?: boolean;
  /** Fog colour. */
  color?: Color;
  /** Fog density. */
  density?: number;
}

/** A localized fog zone: an AABB whose density adds to the global term inside it. */
export interface FogZone {
  /** Minimum corner of the AABB, world space [x, y, z]. */
  min: [number, number, number];
  /** Maximum corner of the AABB, world space [x, y, z]. */
  max: [number, number, number];
  /** Density added within this box (on top of the global `density`). */
  density: number;
}

/** Volumetric single-scatter ("god rays") configuration. */
export interface VolumetricOptions {
  /** Enable volumetric single-scatter lighting. */
  enabled?: boolean;
  /** Global scattering/fog density along the primary ray (may be 0 with zones set). */
  density?: number;
  /** Maximum distance the volumetric integration marches. */
  maxDist?: number;
  /**
   * Localized fog zones (up to 8 AABBs). Density at a world point is
   * `density` plus the sum of every zone whose box contains the point.
   * Empty/absent = global fog only.
   */
  zones?: FogZone[];
}

/** Constructor options for {@link RealtimeRaytracer}. All optional. */
export interface RealtimeRaytracerOptions {
  /**
   * Named quality preset to apply as the BASE of these options  -  explicit
   * options win over the preset. One of {@link PRESETS}: `"quality"` (fidelity
   * first), `"balanced"` (today's defaults  -  a no-op on a fresh instance),
   * `"performance"` (fps first), `"motion"` (short history + strong firefly
   * clamp for fast camera movement). With no `preset` key the constructor is
   * byte-identical to the build without the feature.
   */
  preset?: PresetName;
  /**
   * Resolution scale for the ray traced lighting (G-buffer and final image
   * stay full res). 0.5 traces 4x fewer rays; the bilateral upsample +
   * denoiser reconstruct the difference. Set 1.0 for maximum quality.
   */
  renderScale?: number;
  /**
   * Overscan: render internally at a padded resolution with a proportionally
   * widened field of view, then crop the centre to the canvas on the final draw.
   * Fraction of padding PER EDGE (clamped 0–0.25). Pushes the disocclusion
   * convergence noise at the leading screen edge off-screen during camera
   * motion. `0.1` renders 1.44× the pixels; 0.05–0.1 recommended. Default `0`.
   */
  overscan?: number;
  /** À-trous denoise iterations (steps 1, 2, 4, ...). */
  denoiseIterations?: number;
  /**
   * One stochastic direct shadow ray per pixel per frame (source picked at
   * random) instead of one per light — the biggest ray-count lever for
   * many-light scenes and mobile GPUs. Slightly noisier moving shadows.
   *
   * DEFAULT `false` since 0.15.0. It only applies when ReSTIR is off, and with
   * it on `restir: false` did not select the exact per-light loop but one
   * random light per pixel per frame — the noisiest estimator here — which
   * quietly redefined what an "estimator off" reference measured. The governor
   * still turns it on when it needs the rays back.
   */
  stochasticLights?: boolean;
  /**
   * Adaptive quality governor: watches real frame time and steers renderScale,
   * denoiseIterations and stochasticLights toward targetFps. Setting those
   * manually while enabled will be overridden.
   */
  adaptiveQuality?: boolean;
  /** Frame-rate target for the adaptive governor. */
  targetFps?: number;
  /**
   * GPU-cost timing for the adaptive governor
   * (EXT_disjoint_timer_query_webgl2). "auto" (default) uses it where the
   * browser exposes it and falls back to speculative probing where it does not
   * (Safari and iOS withhold the extension). `false` forces the probe path and
   * builds no timer at all.
   *
   * It is what makes the quality ladder two-way. Wall-clock frame time is pinned
   * to the display's refresh period by vsync, so it can prove a frame is too
   * slow but never that there is headroom to spend — without a GPU measurement
   * the governor can only ever walk quality DOWN, and any transient costs
   * quality permanently.
   */
  gpuTiming?: "auto" | boolean;
  /**
   * Emergency crash guard, ON by default: clamps oversized first buffers and
   * cuts quality after consecutive >400ms frames (weak GPUs fed high settings
   * can hang the whole machine). Set false to opt out.
   */
  overloadProtection?: boolean;
  /**
   * App-owned canvas-scale setter, driven by the governor as its deepest lever
   * once renderScale bottoms out. The app owns the canvas + CSS stretch, so it
   * applies the buffer resize itself; null disables this level.
   */
  canvasScaleHook?: ((scale: number) => void) | null;
  /**
   * 1-bounce global illumination (traced indirect). DEFAULT `false` since
   * 0.15.0: it is the most expensive thing in the renderer (one extra traced
   * ray per pixel per frame, shaded with the full direct + NEE stack) and the
   * defaults have to run on hardware nobody sent us. Turn it on for colour
   * bleed. `ambient` is what keeps the off state from being black.
   */
  gi?: boolean;
  /**
   * Honour three's `AmbientLight` and `HemisphereLight` as an UNOCCLUDED
   * ambient term (default `true`, new in 0.15.0). Both were ignored before,
   * because neither has a position to trace a shadow ray at. The compiler sums
   * the visible ones and the lighting pass adds
   * `flat + mix(ground, sky, 0.5*dot(N, up) + 0.5)` to the direct irradiance
   * with no ray: three uniforms and a dot product, no sampler, no loop.
   *
   * NOT global illumination. Nothing occludes it, nothing carries colour
   * between surfaces, and GI bounces do not pick it up; `gi: true` remains the
   * real thing. `false` uploads zeros, so the result is bit-for-bit pre-0.15.
   */
  ambient?: boolean;
  /**
   * Half-rate GI: trace the bounce on alternating checkerboard parity each
   * frame (doubled — unbiased, temporal accumulation converges to the same
   * brightness). Halves GI's ray cost. Default `false`.
   *
   * Passing this option explicitly **pins** it against the adaptive quality
   * governor: the governor will neither take it as a free win nor release it
   * on recovery. Omit it (or pass `undefined`) to let the governor decide.
   */
  giHalfRate?: boolean;
  /**
   * Sample static emissive meshes as area lights (next-event estimation).
   * Dramatically less noise than waiting for GI rays to hit the emitter.
   */
  emissiveNEE?: boolean;
  /**
   * Importance-sample WHICH emissive triangle NEE shoots at, proportional to
   * area x emitted luminance (compile-time power CDF) instead of a uniform
   * 1-of-N pick. Same mean, far less sparkle when emitters differ in
   * size/brightness. Default true; false restores the legacy uniform pick.
   */
  emissiveImportance?: boolean;
  /**
   * PBR direct specular: Cook-Torrance GGX highlights for every surface, kept in
   * a separate specular buffer the composite adds WITHOUT the albedo multiply
   * (dielectric highlights are white, F0 ~= 0.04). Metals' albedo-tinted specular
   * rides the reflection path instead. Default true; false restores the old
   * Lambert-only diffuse look.
   */
  specular?: boolean;
  /** Traced mirror/glossy reflections on metallic surfaces. */
  reflections?: boolean;
  /** Traced refraction for transmissive (MeshPhysicalMaterial.transmission) surfaces. */
  refraction?: boolean;
  /**
   * Coloured shadows: shadow rays crossing an **absorbing** glass material are
   * attenuated `exp(-sigma * d)` per channel instead of blocked. Default `true`,
   * and meaningful only when the compiled scene has an absorbing material —
   * with none (or set to `false`) the lighting program is byte-identical to the
   * build without the feature. See {@link RealtimeRaytracer.absorptionShadows}
   * for the scope limits.
   */
  absorptionShadows?: boolean;
  /**
   * Kubelka-Munk two-flux scattering for materials carrying
   * {@link RTScattering}. Default `false`. See
   * {@link RealtimeRaytracer.kmScattering} for scope and limitations.
   */
  kmScattering?: boolean;
  /**
   * Texture-tile sampling for secondary rays (through glass, reflections, GI
   * bounces). When not `false` AND the scene has textured materials, per-texel
   * albedo and emissive colour is sampled at secondary hit points. Pass
   * `{ size: 128, max: 16 }` to configure (defaults shown), or `false` to
   * disable entirely. The tiles ride the existing scene-data texture — no extra
   * sampler. Takes effect on the next `compileScene()`.
   */
  textureTiles?: { size?: number; max?: number } | false;
  /**
   * LIGHT-TABLE CAPACITY: how many analytic lights (point / spot / directional)
   * this instance can shade at once. Default 128, hard max 256, new in 0.16.0 —
   * it was a fixed 32 before, which was a UNIFORM budget rather than a cost one
   * (three `vec4[32]` arrays in four shaders). The table now lives in a row of
   * the scene-data texture, so a seat costs 4 texels.
   *
   * CONSTRUCTOR ONLY, like `textureTiles`: it is compiled into four shaders'
   * `#define MAX_LIGHTS` and into the scene-data texture's width, so assigning
   * to `rt.maxLights` afterwards THROWS rather than silently doing nothing.
   *
   * A light costs nothing per frame under ReSTIR (one visibility ray per pixel
   * however many lights exist). It costs one shadow ray per pixel on the exact
   * path (`restir: false`, or a pixel younger than `restirWarmAge`).
   */
  maxLights?: number;
  /**
   * Alpha-blended transparency: `transparent: true` meshes are primary-visible
   * and composited against the geometry behind them (weighted by `opacity`).
   * Default true. Off = blend surfaces render fully opaque.
   */
  transparency?: boolean;
  /**
   * ReSTIR direct lighting: per-pixel reservoirs converge onto the light that
   * matters most to each pixel. Cost is flat in light count.
   */
  restir?: boolean;
  /**
   * ReSTIR reservoir staleness cap — how many samples' worth of confidence a
   * direct-lighting reservoir may carry before new candidates stop displacing it.
   * Default `16` (the quality campaign's one unconditional win — better on every
   * metric for ~0.3 ms). The old default was 40; a 40-sample reservoir is staler
   * than the irradiance EMA it feeds.
   *
   * Passing this option explicitly **pins** it against the adaptive quality
   * governor: the governor will not lower it to 16. Omit it (or pass `undefined`)
   * to let the governor decide.
   */
  restirMCap?: number;
  /**
   * Cold-pixel exact fallback: frames of validated temporal history a pixel's
   * reservoir must have carried before that reservoir may shade it. Default `0`
   * = off = the shipped behaviour.
   *
   * A just-revealed pixel has no history — 8 uniform candidates out of the whole
   * light set, shaded with one visibility ray on the winner — so it speckles for
   * about a second while temporal accumulation converges. Below this age the
   * pixel is shaded by the exact per-light loop (one shadow ray per light plus
   * one for the emissive set) instead, at that path's cost, and only for the
   * minority of pixels that are actually cold. The reservoir keeps building
   * underneath regardless.
   */
  restirWarmAge?: number;
  /**
   * Keep DIRECTIONAL lights out of the ReSTIR reservoir and shade them exactly
   * instead. DEFAULT `true` since 0.15.0; `false` restores the pre-0.15
   * behaviour.
   *
   * The reservoir's target function is unshadowed, and a directional light has
   * a large unshadowed contribution on every surface facing it while being
   * occluded on most interior surfaces — so the reservoir keeps electing the
   * sun, spends its single visibility ray on the wall in between, and the pixel
   * resolves to black with the odd frame's runner-up as a bright speck. With
   * this on, directional lights are never candidates and never survive as
   * inherited winners, and the lighting pass adds them with one exact shadow
   * ray each. Unbiased either way; costs one ray per directional light.
   */
  restirDirectionalBypass?: boolean;
  /**
   * ReSTIR temporal reprojection that survives TAA jitter and thin geometry.
   * DEFAULT `true` since 0.15.0; `false` restores the pre-0.15 behaviour. Two
   * halves of one fix: the
   * sub-texel correction the irradiance accumulator already applies
   * (`prevUv -= currUv - vUv`), and a four-neighbour rescue when the plane test
   * at the reprojected texel fails. Without them a baluster's pixels reject
   * their history every frame and their reservoirs never accumulate.
   */
  restirReprojectionRescue?: boolean;
  /**
   * Draw ReSTIR candidates the way next-event estimation draws them, instead of
   * uniformly over (lights + emissive triangles). DEFAULT `true` since 0.15.0;
   * `false` restores the pre-0.15 behaviour, byte for byte.
   *
   * Uniformly, a bulb's triangle in a room of 26 lights and 256 emissive
   * triangles is a 1-in-282 pick and most of the 8 candidates land on surfaces
   * that contribute nothing to the pixel, so a cold reservoir has nothing worth
   * keeping. With this on, each candidate picks a POOL by power (analytic lights
   * with probability PL/(PL+PE), clamped to [0.1, 0.9]) and then a member by that
   * pool's own power CDF (the emissive half being the very CDF
   * `emissiveImportance` already uses), and the RIS weight divides by that pdf.
   * Unbiased: RIS holds for any source pdf whose support covers the target's.
   *
   * ALU only: no extra rays. One extra `rand()` per candidate and, for emissive
   * candidates, the same 8-step binary search the exact path runs.
   */
  restirCandidateImportance?: boolean;
  /**
   * LOCAL CANDIDATES: draw the reservoir's analytic-light candidates from a
   * per-cell distribution over a uniform grid on the scene's static bounds,
   * instead of one scene-wide power CDF. DEFAULT `true`, new in 0.16.0;
   * `false` is the 0.15.0 global CDF, which lives in row 0 of the same table.
   *
   * With many lights the global CDF is the problem the light cap was hiding: in
   * a building with eighty lights, roughly one candidate in thirty-two can reach
   * the pixel at all, and the rest of the reservoir's stream is spent on lights
   * behind walls. The grid weights light i in cell c by
   * `lum / max(d^2, (cellDiagonal/2)^2)` times a spot-cone factor, d being the
   * distance to the nearest point of the cell — the same inverse square the
   * shading uses. Unbiased: every active light keeps at least 1/1000 of the
   * cell's largest weight, so the source pdf still covers the target's support.
   *
   * Built on the GPU in two small draws whenever the light set (or the
   * directional bypass) changes; a still scene builds it once.
   */
  restirLightGrid?: boolean;
  /**
   * Cap the ReSTIR direct term at `restirClampRel` x the pixel's own reservoir
   * estimate of the unshadowed light total, or at the absolute
   * `2 x fireflyClamp`, whichever is larger. DEFAULT `2` since 0.15.0; `0` = off
   * = the absolute cap alone = the pre-0.15 behaviour.
   *
   * The absolute cap is the wrong shape for a one-sample-per-pixel estimator:
   * f(Y)·W lands near the whole light sum when the winner is visible and on zero
   * when it is not, so the cap clips the peaks while nothing lifts the zeros and
   * bright surfaces converge DARK. `2` means "no more than twice everything this
   * pixel could receive", which still catches a genuine 1/d^2 spike.
   */
  restirClampRel?: number;
  /**
   * How many reservoir winners the lighting pass shades per pixel, each with its
   * own visibility ray. Default `1` = the shipped behaviour, bit-identical.
   *
   * ReSTIR is not noisier than the exact loop because it samples badly — it is
   * noisier because it spends ONE sample where the exact loop spends one per
   * light plus one for the emissive set. `2`..`4` also shade 1..3 NEIGHBOURING
   * pixels' winners (the spatial stage already wrote a reservoir per pixel, so
   * only the extra shadow ray is paid for), averaged 1/N, with the firefly clamp
   * applied to the average rather than per sample. Measured sub-1/sqrt(N) —
   * neighbouring reservoirs are correlated — and the shipped denoiser already
   * removes most of what it buys, so it is a lever for a weaker denoiser or a
   * machine with headroom, not a default.
   */
  restirSamples?: number;
  /**
   * Neighbour-tap radius ceiling for `restirSamples` > 1, in lighting-buffer
   * texels. Default `10`, matching the spatial stage's own reach: larger taps
   * decorrelate the extra samples more but fail validation more often.
   */
  restirSampleRadius?: number;
  /**
   * On a DYNAMIC-mesh pixel, skip the reservoir's surface-validation test and
   * offer the co-located previous reservoir as a candidate anyway (its light is
   * re-evaluated at the true surface, so a wrong one loses on weight). Default
   * `false`. A moving mesh's pixels otherwise reject their reprojected history
   * every frame and are permanently the noisiest thing on screen. Measured at
   * the mechanism level (reservoir M on the moving body 17.97 -> 23.14, starved
   * pixels 38% -> 5%) with NO measured change to visible noise, which is why it
   * is off: the shimmer there is dominated by the irradiance EMA.
   */
  restirDynamicAccept?: boolean;
  /**
   * On a DYNAMIC-mesh pixel, pass the previous reservoir through to history
   * instead of overwriting it, so the background keeps its history as the object
   * sweeps over it and the trailing edge stops disoccluding. Default `false`.
   * Only sound for a SMALL dynamic object against a broadly similar background.
   */
  restirDynamicFreeze?: boolean;
  /**
   * EXPERIMENTAL — ReSTIR GI (v1, temporal-only): per-pixel reservoirs reuse the
   * 1-bounce global-illumination sample across frames (at the reprojected
   * same-surface point; no spatial reuse). When on, the lighting pass skips its
   * inline GI trace and the reservoir's resolved GI is added at the denoise
   * stage — so it only takes effect when `gi` and `denoise` are also on. Its
   * mean matches the inline GI path; convergence character differs. Default
   * `false`. Live-toggleable.
   *
   * Passing this option explicitly **pins** it against the adaptive quality
   * governor: the governor will neither take it as a free win nor release it
   * on recovery. Omit it (or pass `undefined`) to let the governor decide.
   */
  restirGI?: boolean;
  /** EXPERIMENTAL — temporal M-cap for the ReSTIR GI reservoir (default 20). */
  restirGIMCap?: number;
  /**
   * EXPERIMENTAL — ReSTIR GI spatial-reuse taps per frame, taken after the
   * temporal merge from the previous frame's reservoirs (reconnection-Jacobian
   * reweighted, with a final visibility ray to prevent leaks). Clamped to 0..4;
   * `0` reproduces the temporal-only behaviour. Default 2 — with
   * `restirGIChromaMean` on, a tap is folded into the resolve's chromaticity
   * mean by its own RIS weight, so taps reduce variance rather than add it.
   */
  restirGISpatialTaps?: number;
  /**
   * EXPERIMENTAL — resolve the ReSTIR GI colour as the RIS-weighted MEAN
   * chromaticity of the reservoir's candidates instead of the chromaticity of
   * the one sample it holds. The resolve's luminance is already a running mean
   * over the reservoir's history; its colour was a single draw, at 37% spread
   * per pixel, which the luminance-guided à-trous filter cannot see and spreads
   * into coarse coloured blotches. Same mean, far lower variance, no extra ray,
   * sampler or storage. Default `true`; `false` restores the old path.
   */
  restirGIChromaMean?: boolean;
  /**
   * EXPERIMENTAL — ReSTIR GI final-visibility policy. With this on, the ray is
   * cast only when a SPATIALLY adopted sample won the reservoir (a temporal one
   * is visible by construction), and a rejection falls back to the pixel's
   * temporal-only estimate instead of zeroing the pixel for the frame. Default
   * `true`; `false` restores the old path.
   */
  restirGIVisFallback?: boolean;
  /**
   * EXPERIMENTAL — weight of the current frame in the ReSTIR GI resolve EMA.
   * `1` (the default) disables the EMA: its partner is a reconstruction of the
   * PREVIOUS frame's temporal-only resolve, a noisier estimator than the merged
   * one it smooths, so it measured as a variance source.
   */
  restirGIResolveAlpha?: number;
  /**
   * EXPERIMENTAL — ReSTIR GI firefly-clamp multiplier at zero reservoir
   * confidence, relaxing to 1 as M reaches the cap. Default 0.3.
   */
  restirGIConfLow?: number;
  /**
   * EXPERIMENTAL — ReSTIR GI reservoir-sample validation period. Every frame a
   * rotating 1-in-N subset of pixels re-aims its single candidate ray at the
   * reservoir's stored hit (instead of a fresh cosine bounce) and re-shades it;
   * the reservoir is killed when the geometry moved or the re-shaded target
   * collapsed to near-black (a light switched off), and left untouched otherwise.
   * Reuses the existing candidate trace (no extra bounce rays); fixes stale bounce
   * light (a switched-off light stops haunting the reservoir) without drifting a
   * static scene. `0` disables it (byte-identical to before the feature). Default 8.
   */
  restirGIValidate?: number;
  /**
   * Global fallback index of refraction for transmissive surfaces. A
   * `MeshPhysicalMaterial.ior` overrides this per material for fully-transmissive
   * glass (encoded in the G-buffer, supported range [1.0, 1.98]); `material.ior`
   * wins when present. This value applies to partial-transmission glass and as
   * the default when no per-material ior is carried.
   */
  ior?: number;
  /**
   * Chromatic dispersion strength for glass, `0..0.5` (clamped), default `0`
   * (off). Splits refracted white light into a spectrum via stochastic spectral
   * sampling — each frame every glass pixel estimates one colour channel through
   * a channel-shifted ior, and temporal accumulation blends the three into a
   * rainbow (no extra rays). Needs accumulation to converge, so it shimmers
   * slightly in motion. Global control only (no per-material dispersion).
   */
  dispersion?: number;
  /** History length cap: higher = smoother but slower to react. */
  maxHistory?: number;
  /**
   * Split the temporal accumulation out of the lighting megakernel into a
   * dedicated pass (SVGF-style per-tap-validity reprojection, signed normal
   * agreement, temporal moments). Default true where multiple render targets
   * are supported; false falls back to the older inline EMA.
   */
  splitAccum?: boolean;
  /**
   * Shorten every temporal accumulator while the CAMERA moves. Default false;
   * with it off the frame is identical to a build without the feature.
   */
  motionAdaptive?: boolean;
  /** EMA history cap at full camera motion (`motionAdaptive` only). */
  maxHistoryMoving?: number;
  /** TAA fresh-sample weight at full camera motion (`motionAdaptive` only). */
  taaBlendMoving?: number;
  /** ReSTIR staleness cap at full camera motion (`motionAdaptive` only). */
  restirMCapMoving?: number;
  /**
   * Shorten temporal accumulation when the LIGHTS change. Default true: unlike
   * camera motion there is no case where reusing lighting from a light that has
   * since moved is correct, and without it a moving light drags a visible tail.
   * Driven by `updateLights()`, so it costs nothing on frames that do not call it.
   */
  lightAdaptive?: boolean;
  /**
   * Light movement that counts as full response, as a fraction of the scene
   * diagonal moved since the previous `updateLights()`. Default 0.01.
   */
  lightMotionRef?: number;
  /** Per-frame decay of `lightMotion` once the lights stop changing (default 0.72). */
  lightMotionDecay?: number;
  /**
   * Temporal-gradient rejection threshold in standard deviations of the pixel's
   * own accumulated luminance; only consulted while lights are moving. Lower
   * responds faster and is noisier. Default 3.
   */
  lightGradK?: number;
  /**
   * Firefly cap for the traced glass path, in units of `fireflyClamp` (default
   * 4, i.e. the same budget the specular path uses). 0 disables it. Glass is
   * composed with `mix(diffuse, glassRadiance, transmission)`, and a solid
   * dielectric has transmission exactly 1, so without this the clamped diffuse
   * terms are discarded and the glass path is unbounded.
   */
  glassClampScale?: number;
  /** Clamp on indirect luminance to suppress fireflies. 0 disables. */
  fireflyClamp?: number;
  /**
   * BVH-cost heatmap scale for the mode-7 debug view: shadow-ray node-visit
   * count is multiplied by this before the palette (default 1/96).
   */
  costScale?: number;
  /** Reproject accumulated lighting through camera motion. */
  temporalReprojection?: boolean;
  /**
   * Motion vectors for temporal reprojection (DEFAULT `true` since 0.15.0;
   * `false` restores the pre-0.15 camera-only reprojection). The G-buffer
   * writes each fragment's previous screen position into a fifth RG32F
   * attachment, and the irradiance EMA, the ReSTIR reservoir, and the TAA
   * resolve look up history at that position instead of reprojecting the
   * CURRENT world position through the previous view-projection. That
   * camera-only reprojection is wrong for MOVING meshes (a point on them
   * occupied different world space last frame, so its history is rejected every
   * frame) and correct for static geometry — for a static mesh the motion vector
   * collapses exactly to camera-only reprojection, so a static scene renders
   * byte-identically on or off. Rigid transforms only; deforming/skinned meshes
   * still use a rigid previous matrix (they need per-vertex history, which is
   * out of scope). Requires a GPU with >= 5 draw buffers (WebGL2 guarantees only
   * 4); on a device without one the option is ignored with a one-time warning.
   */
  motionVectors?: boolean;
  /**
   * Pool the internal G-buffer draw materials by vertex-color presence and
   * culling side (default `true`). This is an internal draw-state optimization;
   * meshes with custom Object3D render callbacks automatically use the legacy
   * per-mesh proxy path. Set `false` for diagnostics or unusual integrations.
   */
  gbufferMaterialPooling?: boolean;
  /**
   * Temporal anti-aliasing: sub-pixel projection jitter + a full-res history
   * resolve with neighbourhood clamp.
   */
  taa?: boolean;
  /** Fresh-sample weight in the TAA blend (lower = smoother/more AA, more lag). */
  taaBlend?: number;
  /**
   * Scales the TAA sub-pixel jitter amplitude. Set to your canvas scale when
   * rendering a reduced drawing buffer CSS-stretched to the screen, so jitter
   * stays constant in screen pixels (no visible wobble at low quality). Default 1.
   */
  taaJitterScale?: number;
  /** Edge-aware à-trous denoise on the irradiance buffer. */
  denoise?: boolean;
  /**
   * Ray offset epsilon. When unset it is auto-scaled from the scene's size at
   * compile time. Raise if you see acne; lower if light leaks through thin walls.
   */
  eps?: number;
  /** Environment (sky) color used for GI rays that miss + composite background. */
  envColor?: Color;
  /** Environment intensity multiplier. */
  envIntensity?: number;
  /** Procedural sky configuration. */
  sky?: SkyOptions;
  /** Distance fog configuration. */
  fog?: FogOptions;
  /** Volumetric single-scatter configuration. */
  volumetric?: VolumetricOptions;
}

/** Resolved sky state on a {@link RealtimeRaytracer} instance. */
export interface SkyState {
  enabled: boolean;
  sunDir: Vector3;
  sunColor: Color;
  zenith: Color;
  horizon: Color;
  intensity: number;
}

/** Resolved fog state on a {@link RealtimeRaytracer} instance. */
export interface FogState {
  enabled: boolean;
  color: Color;
  density: number;
}

/** Resolved volumetric state on a {@link RealtimeRaytracer} instance. */
export interface VolumetricState {
  enabled: boolean;
  density: number;
  maxDist: number;
  /** Localized fog zones (up to 8 AABBs); mutate to add/remove fog volumes live. */
  zones: FogZone[];
}

/** One optional feature auto-disabled after its pass program failed to link. */
export interface DisabledPass {
  /** The failed pass program's stable name (e.g. `"rt:taa"`, `"rt:denoise"`). */
  pass: string;
  /**
   * The instance toggle that was set false to keep the image lit: one of
   * `"restir"`, `"restirGI"`, `"denoise"`, `"volumetric"`, `"taa"`, `"specular"`.
   */
  feature: string;
  /** First line of the driver's shader/link info log for the failure. */
  reason: string;
}

/**
 * Compile-health summary for the ray tracing pipeline, on
 * {@link RealtimeRaytracer.status}. A pass whose program fails to LINK renders
 * black without throwing (three logs and sets `program.diagnostics.runnable`
 * false, but rendering proceeds), so this is how an integrator distinguishes a
 * working RT image from a broken one — and renders an honest raster fallback
 * with a reason instead of guessing. Populated over the first several rendered
 * frames (link status is checked lazily / can be deferred by the driver).
 */
/**
 * A **usage** diagnostic on {@link RaytracerStatus.warnings} (since 0.7.0). Unlike
 * {@link DisabledPass}, nothing is broken in the pipeline — the SCENE SETUP is
 * not what the app probably intended (a flag that is being ignored, an object
 * type that cannot be traced, a static mesh edited after `compileScene()`). Each
 * one is also `console.warn`ed once, with the exact fix in the text.
 */
export interface RaytracerWarning {
  /**
   * Stable machine-readable identifier:
   * - `"stale-geometry"` — a static mesh's `position` buffer changed after `compileScene()`.
   * - `"stale-transform"` — a static mesh was moved after `compileScene()`.
   * - `"rtdeforming-not-dynamic"` — `userData.rtDeforming` set on a mesh that is not in `dynamicMeshes` (ignored).
   * - `"implicit-compile"` — `render()` compiled the scene itself, so it was compiled with no options.
   * - `"untraceable-object"` — a visible `Sprite` / `Line` / `Points` was auto-hidden from the traced frame.
   * - `"instanced-mesh"` — an `InstancedMesh` collapses to a single instance.
   * - `"transparent-dynamic"` — a transparent mesh listed in `dynamicMeshes` (the entry does nothing).
   */
  code:
    | "stale-geometry"
    | "stale-transform"
    | "rtdeforming-not-dynamic"
    | "implicit-compile"
    | "untraceable-object"
    | "instanced-mesh"
    | "transparent-dynamic";
  /** Full human-readable message (names the object, the consequence and the fix). */
  message: string;
}

export interface RaytracerStatus {
  /**
   * True while every ray tracing pass is running as intended. Flips to false the
   * moment ANY `rt:*` pass program fails to link — whether a core pass (see
   * `coreFailure`) or an optional feature that was auto-disabled (see `disabled`).
   */
  ok: boolean;
  /** Optional features turned off to keep the image lit after their pass failed to link. */
  disabled: DisabledPass[];
  /**
   * Set when a CORE pass (gbuffer / lighting / composite) failed to link. Such a
   * pass has no fallback, so the image is black — but now diagnosed. The string
   * is a `"rt:<pass>: <driver log>"` summary; null when no core pass has failed.
   */
  coreFailure: string | null;
  /**
   * Usage diagnostics raised for this scene (**since 0.7.0**) — see
   * {@link RaytracerWarning}. Deduplicated by `code` + `message`, and each one is
   * also `console.warn`ed once. **`ok` is NOT affected by warnings**: the
   * pipeline is compiling and running fine, the scene setup is what looks wrong.
   */
  warnings: RaytracerWarning[];
}

/** Options accepted by {@link RealtimeRaytracer.compileScene} and {@link compileScene}. */
export interface CompileSceneOptions {
  /**
   * Meshes whose transforms change every frame; drive them with updateDynamic().
   *
   * By default a dynamic mesh is treated as **rigid** — its compile-time vertices
   * are snapshotted and only re-transformed by `mesh.matrixWorld` each frame.
   * To trace a mesh whose *vertices* move on the CPU (water, cloth, morph
   * targets), also set `mesh.userData.rtDeforming = true`. Such a mesh has its
   * live `position` (and `normal`) attributes re-read every frame, so the traced
   * shadows/reflections follow the actual deformed shape. The app must keep the
   * normal attribute current (e.g. call `geometry.computeVertexNormals()` after
   * deforming). The live vertex count is fixed at compile time — changing it
   * throws; call `compileScene()` again after a topology change.
   *
   * A **`SkinnedMesh` is auto-detected** (no flag needed) and CPU-skinned into the
   * dynamic BVH every frame from its live skeleton pose, so an animated character
   * casts a moving traced shadow and rasterizes in its animated pose (the G-buffer
   * skins via three's standard skinning chunks). Pose the skeleton *before*
   * `updateDynamic()` — `mixer.update(dt)` then `characterRoot.updateMatrixWorld(true)`
   * — since the skinning reads each bone's `matrixWorld`. Cost is O(source verts ×
   * 4 bones); secondary-ray normals are per-face (recomputed from the skinned
   * triangles), while primary visibility keeps smooth skinned normals from the
   * raster path. Budget ~10–20k skinned source verts for a sub-2 ms frame.
   */
  dynamicMeshes?: Object3D[];
  /** Texture-tile config for secondary-ray map sampling (see {@link RealtimeRaytracer.textureTiles}). */
  textureTiles?: { size?: number; max?: number } | false;
  /**
   * Light-table capacity for this compile (default 128, max 256). A
   * {@link RealtimeRaytracer} always injects its own `maxLights` here, so pass
   * this only when calling {@link compileScene} directly.
   */
  maxLights?: number;
}

/**
 * A two-level BVH scene produced by {@link compileScene}. Static geometry is
 * uploaded once; dynamic meshes are re-baked each frame via {@link updateDynamic}.
 */
export class CompiledScene {
  /** Total triangle count across the static and dynamic levels. */
  triangleCount: number;
  /** Number of lights scanned into the compiled light tables. */
  lightCount: number;
  /** Light-table capacity this scene was compiled for (the `maxLights` option). */
  maxLights: number;
  /** Row of the scene-data texture holding the light table (4 texels per seat). */
  lightRow: number;
  /** True when the most recent `syncLights` changed any value in the table. */
  lightsChanged: boolean;
  /**
   * Number of emissive triangles registered as NEE area lights (static +
   * dynamic). A material can stay out of this list with
   * `material.userData.rtNoAreaLight = true`: it still renders at its full
   * emissive value (the G-buffer reads the material directly, and specular
   * secondary rays still see it) but casts no light. That is what unlit
   * SCENERY wants — a backdrop carrying its diffuse map as an emissiveMap is
   * emissive by construction, and because the list keeps the LARGEST triangles
   * by area, a single ground quad will otherwise evict every real lamp.
   */
  emissiveTriCount: number;
  /**
   * Total power of the emissive NEE set in the power CDF's own units (triangle
   * area x Rec.709 emitted luminance): the normaliser row 66 of the scene-data
   * texture divides by, refreshed with the CDF when a dynamic emitter moves.
   * Exposed for `restirCandidateImportance`, which splits its candidate draws
   * between the analytic lights and the emissive set in proportion to power.
   */
  emissivePower: number;
  /** World-space diagonal of the static level (used to auto-scale ray epsilon). */
  sceneDiagonal: number;
  /** True when any dynamic emitter contributes NEE rows refreshed each frame. */
  hasDynamicEmissive: boolean;
  /**
   * The resolved world-space 3D-texture albedo for the traced-bounce path (see
   * {@link VolumeAlbedo}), or `null` when no material opted in via
   * `userData.rtVolumeAlbedo`. `matIndex` is the material's index in the compiled
   * table (v1 keeps the first opted-in material for the GI/reflection path).
   */
  volumeAlbedo:
    | { matIndex: number; texture: Data3DTexture; origin: Vector3; size: Vector3; material: unknown }
    | null;
  /**
   * Per-material Beer-Lambert absorption table (see {@link RTAttenuation}), or
   * `null` when no compiled material absorbs. `sigma` holds 3 floats per
   * material (1/world-unit, indexed by the compiled material table); `glass`
   * holds each material's transmission (1 float per material — the flag
   * {@link RealtimeRaytracer.absorptionShadows} uses to decide whether a shadow
   * ray passes through a hit at all, tabled for every material, not just the
   * absorbing ones); `count` is how many materials opted in. When `null`, the
   * lighting shader compiles WITHOUT the absorption code — byte-identical to
   * the pre-feature program.
   */
  absorption: { sigma: Float32Array; glass: Float32Array; count: number } | null;
  /**
   * Per-material Kubelka-Munk scattering table (see {@link RTScattering}), or
   * `null` when no compiled material scatters. `sigmaS` holds 3 floats per
   * material (the scattering coefficient S in 1/world-unit, indexed by the
   * compiled material table); `km` holds the per-material two-flux enable flag
   * (1 or 0, tabled for every material); `count` is how many materials opted in.
   * A non-null table forces {@link CompiledScene.absorption} to exist too — the
   * two-flux code reads K from the absorption table. When `null`, the lighting
   * shader compiles WITHOUT the scattering code, byte-identical to the
   * pre-feature program.
   */
  scattering: { sigmaS: Float32Array; km: Float32Array; count: number } | null;
  /** True when the compiled scene has at least one textured material whose maps were tiled. */
  hasTextureTiles: boolean;
  /** CPU cost (ms) of the most recent dynamic-emissive refresh (0 if none). */
  lastEmissiveRefreshMs: number;
  /**
   * What the most recent {@link updateDynamic} actually did, and its CPU cost
   * (ms). **Since 0.16.1.** `dirtySegments` is how many dynamic segments were
   * re-baked (0 when every rigid segment's `matrixWorld` was unchanged);
   * `refitNodes` is how many BVH nodes were refit that frame (0 when nothing
   * moved, or on a full rebuild); `bakedTriangles` is the triangle count those
   * dirty segments cover. A parked pool costs nothing, so a frame where only
   * one mover moved reports `dirtySegments: 1` and a small `refitNodes`.
   */
  lastDynamicUpdate: { dirtySegments: number; refitNodes: number; bakedTriangles: number; ms: number };
  /**
   * Usage diagnostics raised while compiling this scene (**since 0.7.0**). The
   * standalone {@link compileScene} reports these to the console; going through
   * {@link RealtimeRaytracer.compileScene} additionally mirrors them onto
   * {@link RaytracerStatus.warnings}.
   */
  warnings: RaytracerWarning[];
  /**
   * Re-bake moving meshes' current world transforms and refit the dynamic BVH.
   * Also refreshes any dynamic emitters' NEE area-light rows + power CDF from the
   * freshly baked world positions.
   */
  updateDynamic(): void;
  /** Release GPU resources held by this compiled scene. */
  dispose(): void;
}

/**
 * Drop-in ray traced renderer for three.js scenes. Rasterizes a G-buffer for
 * primary visibility, then traces BVH shadow rays + 1-bounce GI for lighting
 * with progressive temporal accumulation.
 */
export class RealtimeRaytracer {
  /** Canvas-scale ladder used by the adaptive governor's deepest lever. */
  static CANVAS_LEVELS: number[];

  /**
   * Named quality presets (see {@link RealtimeRaytracerPreset}): flat maps of
   * existing, live-tunable option values. Inspect them freely  -  they are plain
   * objects. `"balanced"` captures today's defaults and is a no-op on a fresh
   * instance.
   */
  static PRESETS: Record<PresetName, RealtimeRaytracerPreset>;

  /**
   * The constructor's defaults for every LIVE-ASSIGNABLE option, as one flat
   * frozen object, so an app can offer "reset to defaults" without hard-coding
   * a second copy of this library's opinions. Read it, spread it, do not mutate
   * it. `volumetric` carries only `enabled`.
   *
   * Deliberately NOT the full option list: options that need a `compileScene()`
   * (`absorptionShadows`, `kmScattering`, `textureTiles`), scene description
   * (`envColor`, `sky`, `fog`, `ior`) and constructor-only wiring
   * (`canvasScaleHook`, `preset`) are absent, because a reset button should not
   * recompile your scene or repaint your sky. `?selftest=presets` asserts every
   * key here equals the same-named property on a fresh instance.
   */
  static DEFAULTS: Readonly<RealtimeRaytracerOptions>;

  /** Can this renderer run the ray tracing pipeline at all (WebGL2 + float RTs on hardware GPU)? */
  static isSupported(renderer: WebGLRenderer): boolean;
  /** Rough capability tier for choosing defaults (synchronous WebGL heuristic). */
  static detectTier(renderer?: WebGLRenderer): Tier;
  /**
   * Optional async GPU tier probe: inspects real WebGPU adapter limits when
   * available (honest heuristic  -  WebGPU does NOT expose VRAM, so it uses
   * `maxBufferSize`/texture limits as a proxy and factors screen resolution),
   * else falls back to {@link detectTier}. The constructor stays synchronous;
   * feed the result to {@link recommendedOptions}.
   */
  static probeGPUTier(renderer?: WebGLRenderer): Promise<GPUTierProbe>;
  /** Sensible constructor options for a tier (spread them, then override). */
  static recommendedOptions(tier: Tier): RealtimeRaytracerOptions;

  constructor(renderer: WebGLRenderer, options?: RealtimeRaytracerOptions);

  /** The three.js renderer this instance drives. */
  renderer: WebGLRenderer;
  /** False when the platform can't run the tracer; render() then forwards to renderer.render. */
  supported: boolean;
  /**
   * False when the 2-attachment lighting buffer fails the construction-time
   * draw probe (WebKit/iOS): the specular buffer is disabled there and
   * alpha-blend surfaces render opaque; everything else keeps working.
   */
  specMRTSupported: boolean;
  /** The current compiled scene, or null before the first compile / when unsupported. */
  compiled: CompiledScene | null;
  /**
   * First/most-severe pass compile-failure summary (`"rt:<pass>: <driver log>"`),
   * or null while every ray tracing pass compiles clean. A quick honest signal
   * for "should I show the RT image?"; see {@link status} for the structured form.
   * Core failures (gbuffer/lighting/composite) outrank auto-disabled features here.
   */
  compileError: string | null;
  /**
   * Structured compile-health of the pipeline (see {@link RaytracerStatus}).
   * `status.ok` is true on the healthy path and false once any pass fails to
   * link; `status.disabled` lists auto-disabled optional features; and
   * `status.coreFailure` names an unrecoverable core-pass failure. Populated over
   * the first several rendered frames. When `supported` is false, `status.ok` is
   * false too (the RT pipeline is not operational). `status.warnings` (since
   * 0.7.0) carries USAGE diagnostics and never changes `status.ok`.
   */
  status: RaytracerStatus;
  /** Accumulated frame counter. */
  frame: number;
  /** Debug view: 0 composite, 1 albedo, 2 normal, 3 irradiance, 4 worldPos, 5 emissive, 6 specular, 7 bvh cost. */
  outputMode: number;

  /**
   * Name of the preset governing this instance: the LAST preset applied
   * (constructor `preset` option or {@link applyPreset}), or `"custom"` when no
   * named preset has been applied (a fresh instance's VALUES equal `balanced`,
   * but that name only sticks once the preset is applied). Deliberately
   * last-applied-name only  -  a knob the adaptive governor or a manual
   * assignment changes afterwards does not flip this back to `"custom"`.
   */
  get preset(): PresetName | "custom";

  /**
   * Apply a named quality preset to this LIVE instance. Every bundled knob is
   * live-tunable, so this never needs compileScene and is safe mid-frame.
   * Applying a preset re-arms the adaptive governor at the new baseline (its
   * EMA / cooldown / free-win state is reset). Throws for an unknown name,
   * listing the valid presets.
   */
  applyPreset(name: PresetName): this;
  /**
   * BVH-cost heatmap scale (outputMode 7): the per-pixel shadow-ray node-visit
   * count is multiplied by this before the palette (default 1/96  -  ~96 visits
   * saturate to white). Live-tunable.
   */
  costScale: number;

  /** Resolution scale for the ray traced lighting; assigning reallocates targets. */
  get renderScale(): number;
  set renderScale(v: number);

  /**
   * Overscan padding fraction per edge (0–0.25). Assigning reallocates every
   * pass at the new padded size and hard-resets accumulation (settings-time).
   */
  get overscan(): number;
  set overscan(v: number);

  /** Environment (sky) color for GI rays that miss + composite background. */
  envColor: Color;
  /** Environment intensity multiplier. */
  envIntensity: number;
  /** Ray offset epsilon (auto-scaled from scene size unless set explicitly). */
  eps: number;
  /** Reproject accumulated lighting through camera motion. */
  temporalReprojection: boolean;
  /** Motion vectors for temporal reprojection (see the option of the same name). Live-assignable. */
  motionVectors: boolean;
  /** Whether this GPU supports the 5-attachment motion-vector MRT (read-only). */
  readonly motionVectorsSupported: boolean;
  /** History length cap. */
  maxHistory: number;
  /** Split accumulation pass in use (see the option of the same name). */
  splitAccum: boolean;
  /** Shorten temporal accumulators under camera motion. */
  motionAdaptive: boolean;
  /** Shorten temporal accumulators when the lights change. */
  lightAdaptive: boolean;
  /** Normalized light motion this frame, 0 (parked) .. 1. Read-only. */
  readonly lightMotion: number;
  /** Light movement counting as full response, as a fraction of scene diagonal. */
  lightMotionRef: number;
  /** Per-frame decay of `lightMotion`. */
  lightMotionDecay: number;
  /** Temporal-gradient rejection threshold, in sigmas. */
  lightGradK: number;
  /** Glass firefly cap, in units of `fireflyClamp`. 0 disables. */
  glassClampScale: number;
  /** Clamp on indirect luminance to suppress fireflies. 0 disables. */
  fireflyClamp: number;
  /** 1-bounce global illumination. Default false since 0.15.0. */
  gi: boolean;
  /** Honour AmbientLight / HemisphereLight as unoccluded ambient (default true). Live-assignable. */
  ambient: boolean;
  /** Half-rate GI: alternating checkerboard temporal amortisation. Pass this option explicitly at construction to pin it against the adaptive governor. */
  giHalfRate: boolean;
  /** Sample static emissive meshes as area lights (NEE). */
  emissiveNEE: boolean;
  /** Importance-sample emissive triangles by power (see the option of the same name). */
  emissiveImportance: boolean;
  /** PBR direct specular (Cook-Torrance GGX) into a separate additive buffer. */
  specular: boolean;
  /** Traced mirror/glossy reflections on metallic surfaces. */
  reflections: boolean;
  /** Traced refraction for transmissive surfaces. */
  refraction: boolean;
  /**
   * Coloured shadows (**since 0.9.0**): a shadow ray crossing an **absorbing**
   * glass material is attenuated `exp(-sigma * d)` per channel over the distance
   * it spends inside, instead of being blocked outright — stained glass spills
   * tinted light, and an emissive panel behind stacked translucent bodies lights
   * what is in front of them instead of rendering as a black silhouette. Clear
   * glass (a glass material with no `attenuationDistance`) stops occluding
   * entirely.
   *
   * Scope, v1 — the two next-event-estimation shadow rays only: analytic
   * point/spot/directional lights, and emissive-mesh area lights. NOT the ReSTIR
   * visibility ray (with `restir` on, the reservoir winner's shadow ray stays
   * binary, so direct light through glass is still blocked on that path), NOT
   * the volumetric march, and refraction is ignored (the shadow ray is a
   * straight segment).
   *
   * Live-assignable, but it swaps the lighting megakernel's source — the first
   * frame after a change pays a shader compile, so treat it as a settings knob.
   * Meaningful only when the compiled scene has an absorbing material; with none
   * (or `false`) the program is byte-identical to the build without the feature.
   */
  absorptionShadows: boolean;
  /**
   * **Kubelka-Munk two-flux scattering** — physically-parameterized translucent
   * solids (jade, wax, marble, soap, foliage, lampshades, pigmented plastic).
   * Default `false`. For materials carrying {@link RTScattering}, the view ray is
   * marched through the real geometry, the per-medium (K, S, segment length)
   * triples it crosses are composed with the two-flux closed form, and the
   * resulting reflectance becomes the surface's diffuse albedo. Thickness is
   * MEASURED per ray, not painted into a thickness map, so a sphere thins
   * correctly toward its silhouette with no authoring. Shadow rays crossing the
   * same media use the two-flux transmittance instead of Beer-Lambert.
   *
   * NOT participating-media lighting: this is transport INSIDE solid bodies, not
   * fog, god rays or atmospheric in-scatter (that is {@link RealtimeRaytracer.volumetrics}).
   *
   * v1 limitations, all deliberate: **no lateral bleed** (light leaves where it
   * entered — 1D transport along the ray, not full subsurface scattering, so
   * there is no glow around a thin edge from light that entered elsewhere), **no
   * in-scattering into shadow rays** (a lit body does not add light to its own
   * shadow), and R-as-albedo is the standard approximation (the closed form
   * assumes diffuse illumination but is lit here by N·L).
   *
   * Live-assignable, but it swaps the lighting megakernel's source, so treat it
   * as a settings knob. Turning it on also enables coloured shadows in the
   * compiled program — the two share one march. With no scattering material in
   * the scene (or `false`) the program is byte-identical to the build without
   * the feature.
   */
  kmScattering: boolean;
  /**
   * Texture-tile sampling for secondary rays. When not `false` AND the scene has
   * textured materials, per-texel map/emissiveMap is sampled at secondary hit
   * points. Set before `compileScene()`; changes need a recompile.
   */
  textureTiles: { size?: number; max?: number } | false;
  /** Alpha-blended transparency: composite `transparent` meshes over the geometry behind them. */
  transparency: boolean;
  /**
   * Global fallback index of refraction. `MeshPhysicalMaterial.ior` overrides it
   * per material for fully-transmissive glass (range [1.0, 1.98]).
   */
  ior: number;
  /**
   * Chromatic dispersion strength for glass, `0..0.5` (clamped on upload),
   * default `0`. Stochastic spectral sampling: splits refracted white light into
   * a rainbow via temporal accumulation, no extra rays. Global control only.
   */
  dispersion: number;
  /** One stochastic direct shadow ray per pixel per frame instead of one per light. Default false since 0.15.0. */
  stochasticLights: boolean;
  /** Adaptive quality governor toggle. */
  adaptiveQuality: boolean;
  /** Frame-rate target for the adaptive governor. */
  targetFps: number;
  /** GPU-cost timing mode (see RealtimeRaytracerOptions.gpuTiming). Live: set
   *  false at runtime to move the governor onto the probe fallback. */
  gpuTiming: "auto" | boolean;
  /**
   * Median GPU milliseconds the tracer spent over the recent window, or null
   * where the platform has no timer extension or no stable sample yet. The
   * governor's headroom signal, and readable for diagnostics.
   */
  readonly gpuCostMs: number | null;
  /** True where EXT_disjoint_timer_query_webgl2 is available and enabled. */
  readonly gpuTimingSupported: boolean;
  /** True when the governor is steering on GPU milliseconds rather than on the
   *  speculative-probe fallback. */
  readonly gpuTimingActive: boolean;
  /** Emergency crash guard (see RealtimeRaytracerOptions.overloadProtection). */
  overloadProtection: boolean;
  /** App-owned canvas-scale setter driven by the governor; null disables it. */
  canvasScaleHook: ((scale: number) => void) | null;
  /** Edge-aware à-trous denoise on the irradiance buffer. */
  denoise: boolean;
  /** À-trous iterations (steps 1, 2, 4, ...). */
  denoiseIterations: number;
  /** Temporal anti-aliasing toggle. */
  taa: boolean;
  /** Fresh-sample weight in the TAA blend. */
  taaBlend: number;
  /** ReSTIR direct lighting toggle. */
  restir: boolean;
  /** ReSTIR reservoir staleness cap (default 16). Pass this option explicitly at construction to pin it against the adaptive governor. */
  restirMCap: number;
  /** Cold-pixel exact fallback: frames of reservoir history required before the reservoir shades the pixel; below it, the exact per-light loop (default 0 = off). */
  restirWarmAge: number;
  /** Directional lights bypass the reservoir and are shaded exactly (default true since 0.15.0). */
  restirDirectionalBypass: boolean;
  /** Sub-texel + four-neighbour ReSTIR temporal reprojection (default true since 0.15.0). */
  restirReprojectionRescue: boolean;
  /** ReSTIR candidates drawn by power (pool split + per-pool CDF) instead of uniformly over S (default true since 0.15.0). */
  restirCandidateImportance: boolean;
  /** ReSTIR candidates drawn from the light grid's per-cell distribution instead of the global power CDF (default true since 0.16.0). */
  restirLightGrid: boolean;
  /** Light-table capacity (default 128). READ-ONLY after construction: the setter throws, because it is compiled into four shaders and the scene-data texture. */
  readonly maxLights: number;
  /** Lights currently seated in the compiled table (0 with no compiled scene). */
  readonly lightCount: number;
  /** ReSTIR direct-term firefly cap relative to the pixel's own reservoir total; 0 = the absolute cap alone (default 2 since 0.15.0). */
  restirClampRel: number;
  /** Reservoir winners shaded per pixel, each with its own visibility ray (default 1 = shipped). */
  restirSamples: number;
  /** Neighbour-tap radius ceiling in lighting-res texels for restirSamples > 1 (default 10). */
  restirSampleRadius: number;
  /** Dynamic-mesh pixels may inherit the co-located reservoir without the surface test (default false). */
  restirDynamicAccept: boolean;
  /** Dynamic-mesh pixels do not overwrite the reservoir history they pass over (default false). */
  restirDynamicFreeze: boolean;
  /**
   * EXPERIMENTAL — ReSTIR GI (temporal-only) toggle. Only takes effect when
   * `gi` and `denoise` are also on (injected at the à-trous stage). Default false.
   * Pass this option explicitly at construction to pin it against the adaptive governor.
   */
  restirGI: boolean;
  /** EXPERIMENTAL — temporal M-cap for the ReSTIR GI reservoir. */
  restirGIMCap: number;
  /** EXPERIMENTAL — ReSTIR GI spatial-reuse taps per frame (0..4, 0 = temporal-only). */
  restirGISpatialTaps: number;
  /** EXPERIMENTAL — ReSTIR GI reservoir-sample validation period (0 = off, default 8). */
  restirGIValidate: number;
  /** EXPERIMENTAL — resolve the ReSTIR GI colour as a RIS-weighted mean chromaticity. */
  restirGIChromaMean: boolean;
  /** EXPERIMENTAL — test final visibility only for spatially adopted samples, and fall back to the temporal-only estimate on a rejection. */
  restirGIVisFallback: boolean;
  /** EXPERIMENTAL — current-frame weight in the ReSTIR GI resolve EMA (1 = no EMA). */
  restirGIResolveAlpha: number;
  /** EXPERIMENTAL — ReSTIR GI firefly-clamp multiplier at zero reservoir confidence. */
  restirGIConfLow: number;
  /** Procedural-sky state. */
  sky: SkyState;
  /** Distance-fog state. */
  fog: FogState;
  /** Volumetric single-scatter state. */
  volumetric: VolumetricState;

  /**
   * Build/rebuild BVH + material and light tables from the scene. Call after
   * structural scene changes. Returns null when the platform is unsupported.
   */
  compileScene(scene: Scene, options?: CompileSceneOptions): CompiledScene | null;
  /** Re-bake moving (dynamic) meshes into the dynamic BVH level. Call each frame after moving them. */
  updateDynamic(): void;
  /** Refresh light positions/colors from the scene without a full recompile. */
  updateLights(scene: Scene): void;
  /** Discard temporal history and restart accumulation. */
  resetAccumulation(): void;
  /**
   * Resize all internal render targets. Pass the CANVAS (drawing-buffer) size;
   * the internal targets are the overscan-padded size derived from it.
   */
  setSize(width: number, height: number): void;
  /** Render one frame (call instead of renderer.render). */
  render(scene: Scene, camera: Camera): void;
  /** Release all GPU resources held by this instance. */
  dispose(): void;
}

/**
 * DEFAULT light-table capacity (128 since 0.16.0, when `maxLights` became an
 * option; it was a fixed 32 before). Read `compiled.maxLights` or
 * `rt.maxLights` for the value an instance actually uses.
 */
export const MAX_LIGHTS: number;

/** Build a {@link CompiledScene} (BVH + material/light tables) from a scene. */
export function compileScene(scene: Scene, options?: CompileSceneOptions): CompiledScene;

// --- Kubelka-Munk two-flux maths ---------------------------------------------
// The same closed form the scattering shader evaluates, exported as plain
// functions so an app can predict on the CPU what a given (K, S, thickness) will
// look like — for authoring tools, tests, or fitting measured data. K and S are
// per-channel coefficients in 1/world-unit; reflectances are linear 0..1.

/** A composed stack: reflectance from above / from below, and transmittance. */
export interface KMStack {
  ra: number;
  rb: number;
  t: number;
}

/** Per-channel form of {@link KMStack}, each entry an `[r, g, b]` triple. */
export interface KMStackRGB {
  ra: [number, number, number];
  rb: [number, number, number];
  t: [number, number, number];
}

/** One layer of thickness `t` over a backing of reflectance `Rg`. */
export function kmReflectance(K: number, S: number, t: number, Rg?: number): number;
/** Diffuse transmittance through a layer of thickness `t`. */
export function kmTransmittance(K: number, S: number, t: number): number;
/** Reflectance of an infinitely thick body of this pigment (`a - b`). */
export function kmReflectanceInfinite(K: number, S: number): number;
/** One layer's `{ r, t }` pair: reflectance over a BLACK backing, and transmittance. */
export function kmLayer(K: number, S: number, t: number): { r: number; t: number };
/** The identity element of {@link kmAddBelow}: an empty stack of clear air. */
export function kmEmptyStack(): KMStack;
/** Stack one `{ r, t }` layer underneath an existing stack (the adding equations). */
export function kmAddBelow(stack: KMStack, layer: { r: number; t: number }): KMStack;
/** Compose TOP-FIRST layers over an opaque backing. */
export function kmStack(layers: Array<{ K: number; S: number; t: number }>, backing?: number): KMStack;

/** Per-channel {@link kmReflectance}. */
export function kmReflectanceRGB(
  K: number | [number, number, number],
  S: number | [number, number, number],
  t: number,
  Rg?: number | [number, number, number]
): [number, number, number];
/** Per-channel {@link kmTransmittance}. */
export function kmTransmittanceRGB(
  K: number | [number, number, number],
  S: number | [number, number, number],
  t: number
): [number, number, number];
/** Per-channel {@link kmReflectanceInfinite}. */
export function kmReflectanceInfiniteRGB(
  K: number | [number, number, number],
  S: number | [number, number, number]
): [number, number, number];
/**
 * Per-channel {@link kmStack} — the exact quantity the renderer's view-path
 * march computes per pixel, so a validation rig can compare pixels to numbers.
 */
export function kmStackRGB(
  layers: Array<{
    K: number | [number, number, number];
    S: number | [number, number, number];
    t: number;
  }>,
  backing?: number | [number, number, number]
): KMStackRGB;
/**
 * `-ln(color) / distance` per channel — the library's colour + distance
 * authoring pair turned into a coefficient, exactly as SceneCompiler does it for
 * both {@link RTAttenuation} and {@link RTScattering}.
 */
export function coefficientFromColorDistance(
  color: number | Color | [number, number, number],
  distance: number
): [number, number, number];
