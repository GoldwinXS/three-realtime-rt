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
  /** Traced mirror/glossy reflections on metallic surfaces. */
  reflections?: boolean;
  /** Traced refraction for transmissive (MeshPhysicalMaterial.transmission) surfaces. */
  refraction?: boolean;
  /**
   * ReSTIR direct lighting: per-pixel reservoirs converge onto the light that
   * matters most to each pixel. Cost is flat in light count.
   */
  restir?: boolean;
  /** Index of refraction used for transmissive surfaces. */
  ior?: number;
  /** History length cap: higher = smoother but slower to react. */
  maxHistory?: number;
  /** Clamp on indirect luminance to suppress fireflies. 0 disables. */
  fireflyClamp?: number;
  /** Reproject accumulated lighting through camera motion. */
  temporalReprojection?: boolean;
  /**
   * Temporal anti-aliasing: sub-pixel projection jitter + a full-res history
   * resolve with neighbourhood clamp.
   */
  taa?: boolean;
  /** Fresh-sample weight in the TAA blend (lower = smoother/more AA, more lag). */
  taaBlend?: number;
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
  /** Rough capability tier for choosing defaults. */
  static detectTier(renderer?: WebGLRenderer): Tier;
  /** Sensible constructor options for a tier (spread them, then override). */
  static recommendedOptions(tier: Tier): RealtimeRaytracerOptions;

  constructor(renderer: WebGLRenderer, options?: RealtimeRaytracerOptions);

  /** The three.js renderer this instance drives. */
  renderer: WebGLRenderer;
  /** False when the platform can't run the tracer; render() then forwards to renderer.render. */
  supported: boolean;
  /** The current compiled scene, or null before the first compile / when unsupported. */
  compiled: CompiledScene | null;
  /** Accumulated frame counter. */
  frame: number;
  /** Debug view: 0 composite, 1 albedo, 2 normal, 3 irradiance, 4 worldPos, 5 emissive. */
  outputMode: number;

  /** Resolution scale for the ray traced lighting; assigning reallocates targets. */
  get renderScale(): number;
  set renderScale(v: number);

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
  /** Traced mirror/glossy reflections on metallic surfaces. */
  reflections: boolean;
  /** Traced refraction for transmissive surfaces. */
  refraction: boolean;
  /** Index of refraction used for transmissive surfaces. */
  ior: number;
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
  /** Resize all internal render targets. */
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
