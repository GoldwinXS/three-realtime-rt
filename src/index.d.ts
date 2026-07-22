import type {
  WebGLRenderer,
  Scene,
  Camera,
  Color,
  Vector3,
  Object3D,
} from "three";

/** Capability tier used to pick sensible defaults. */
export type Tier = "none" | "mid" | "high";

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
  /** 1-bounce global illumination (traced indirect). Toggle for a direct-only look. */
  gi?: boolean;
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
   * EXPERIMENTAL — ReSTIR GI (v1, temporal-only): per-pixel reservoirs reuse the
   * 1-bounce global-illumination sample across frames (at the reprojected
   * same-surface point; no spatial reuse). When on, the lighting pass skips its
   * inline GI trace and the reservoir's resolved GI is added at the denoise
   * stage — so it only takes effect when `gi` and `denoise` are also on. Its
   * mean matches the inline GI path; convergence character differs. Default
   * `false`. Live-toggleable.
   */
  restirGI?: boolean;
  /** EXPERIMENTAL — temporal M-cap for the ReSTIR GI reservoir (default 20). */
  restirGIMCap?: number;
  /**
   * EXPERIMENTAL — ReSTIR GI (v2) spatial-reuse taps per frame, taken after the
   * temporal merge from the previous frame's reservoirs (reconnection-Jacobian
   * reweighted, with a final visibility ray to prevent leaks). Clamped to 0..4;
   * `0` reproduces v1 temporal-only behaviour. Default 2.
   */
  restirGISpatialTaps?: number;
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
  /** Number of emissive triangles registered as NEE area lights. */
  emissiveTriCount: number;
  /** World-space diagonal of the static level (used to auto-scale ray epsilon). */
  sceneDiagonal: number;
  /** Re-bake moving meshes' current world transforms and refit the dynamic BVH. */
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

  /** Can this renderer run the ray tracing pipeline at all (WebGL2 + float RTs on hardware GPU)? */
  static isSupported(renderer: WebGLRenderer): boolean;
  /** Rough capability tier for choosing defaults (synchronous WebGL heuristic). */
  static detectTier(renderer?: WebGLRenderer): Tier;
  /**
   * Optional async GPU tier probe: inspects real WebGPU adapter limits when
   * available (honest heuristic — WebGPU does NOT expose VRAM, so it uses
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
  /** Accumulated frame counter. */
  frame: number;
  /** Debug view: 0 composite, 1 albedo, 2 normal, 3 irradiance, 4 worldPos, 5 emissive, 6 specular, 7 bvh cost. */
  outputMode: number;
  /**
   * BVH-cost heatmap scale (outputMode 7): the per-pixel shadow-ray node-visit
   * count is multiplied by this before the palette (default 1/96 — ~96 visits
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
  /** History length cap. */
  maxHistory: number;
  /** Clamp on indirect luminance to suppress fireflies. 0 disables. */
  fireflyClamp: number;
  /** 1-bounce global illumination. */
  gi: boolean;
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
  /** One stochastic direct shadow ray per pixel per frame instead of one per light. */
  stochasticLights: boolean;
  /** Adaptive quality governor toggle. */
  adaptiveQuality: boolean;
  /** Frame-rate target for the adaptive governor. */
  targetFps: number;
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
  /**
   * EXPERIMENTAL — ReSTIR GI (temporal-only) toggle. Only takes effect when
   * `gi` and `denoise` are also on (injected at the à-trous stage). Default false.
   */
  restirGI: boolean;
  /** EXPERIMENTAL — temporal M-cap for the ReSTIR GI reservoir. */
  restirGIMCap: number;
  /** EXPERIMENTAL — ReSTIR GI (v2) spatial-reuse taps per frame (0..4, 0 = v1). */
  restirGISpatialTaps: number;
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

/** Stage-1 cap (32) on the number of lights scanned into the compiled light tables. */
export const MAX_LIGHTS: number;

/** Build a {@link CompiledScene} (BVH + material/light tables) from a scene. */
export function compileScene(scene: Scene, options?: CompileSceneOptions): CompiledScene;
