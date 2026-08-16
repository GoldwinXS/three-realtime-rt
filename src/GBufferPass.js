import * as THREE from "three";
import { makeMRT } from "./mrtCompat.js";

// three defines USE_SKINNING and supplies the bindMatrix / bindMatrixInverse /
// boneTexture uniforms + skinIndex / skinWeight attributes automatically when the
// rendered object is a SkinnedMesh (this is a ShaderMaterial, not a
// RawShaderMaterial, so it inherits three's default vertex prefix and #include
// resolution). For a non-skinned mesh USE_SKINNING is undefined and every chunk
// below collapses to nothing — the shader source is identical in both cases.
// The chunks operate on `transformed` (position) and `objectNormal` (normal) in
// the mesh's LOCAL/bind space, so we map our own variables in and out. The
// skinned local position/normal then go through modelMatrix / uNormalMatrixWorld
// exactly like the un-skinned path — matching the CPU BVH skinning in
// SceneCompiler (both skin to local, then transform to world).
const gbufferVert = /* glsl */ `
#include <skinning_pars_vertex>

out vec3 vWorldPos;
out vec3 vWorldNormal;
out vec2 vUvCoord;
out vec3 vColor;
#ifdef RT_MOTION_VECTORS
// Previous-frame WORLD position of this vertex: the same local position under
// LAST frame's model matrix. For a static mesh uPrevModelMatrix === modelMatrix
// (identical 16 values), so this is computed by the exact same instructions as
// vWorldPos and interpolates bit-identically — the motion vector then collapses
// to camera-only reprojection with zero rounding difference.
out vec3 vPrevWorldPos;
uniform mat4 uPrevModelMatrix;
#endif

uniform mat3 uNormalMatrixWorld;

void main() {
  vec3 transformed = position;
  vec3 objectNormal = normal;
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>

  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  vWorldPos = wp.xyz;
#ifdef RT_MOTION_VECTORS
  vPrevWorldPos = (uPrevModelMatrix * vec4(transformed, 1.0)).xyz;
#endif
  vWorldNormal = normalize(uNormalMatrixWorld * objectNormal);
  vUvCoord = uv;
  // Geometry vertex colours. three's shader prefix declares the built-in
  // \`color\` attribute (vec3 or vec4) and sets USE_COLOR / USE_COLOR_ALPHA only
  // when material.vertexColors is on — which we enable ONLY for meshes whose
  // geometry actually carries a color attribute (see GBufferPass swap). A mesh
  // without one compiles the else branch (white), so its albedo is byte-identical
  // to before this varying existed. 4-component colours use .rgb.
  #if defined( USE_COLOR_ALPHA )
    vColor = color.rgb;
  #elif defined( USE_COLOR )
    vColor = color;
  #else
    vColor = vec3(1.0);
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const gbufferFrag = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 gAlbedoRough;
layout(location = 1) out vec4 gNormalMetal;
layout(location = 2) out vec4 gWorldPos;
layout(location = 3) out vec4 gEmissive;
#ifdef RT_MOTION_VECTORS
layout(location = 4) out vec4 gMotion;
#endif

in vec3 vWorldPos;
in vec3 vWorldNormal;
in vec2 vUvCoord;
in vec3 vColor;
#ifdef RT_MOTION_VECTORS
in vec3 vPrevWorldPos;
uniform mat4 uPrevViewProj;
#endif

uniform vec3 uColor;
uniform float uRoughness;
uniform float uMetalness;
uniform float uTransmission;
uniform float uIor;
uniform vec3 uEmissive;
uniform sampler2D uMap;
uniform bool uHasMap;
uniform sampler2D uEmissiveMap;
uniform bool uHasEmissiveMap;
// PBR texture maps (raster pass has ample sampler headroom, unlike the lighting
// pass). All guarded by a uHas* flag so a material without a given map writes
// exactly the same bytes it did before these were added.
uniform sampler2D uNormalMap;
uniform bool uHasNormalMap;
uniform vec2 uNormalScale;
uniform sampler2D uRoughnessMap;
uniform bool uHasRoughnessMap;
uniform sampler2D uMetalnessMap;
uniform bool uHasMetalnessMap;
uniform bool uBlend;
uniform float uOpacity;
uniform float uIsDynamic; // 1.0 while rendering a dynamic-mesh surface (see setDynamicMeshes)

// World-space 3D-texture albedo ("volumetric surface albedo"), compiled in ONLY
// when a scene registers a material with userData.rtVolumeAlbedo (the whole block
// is behind the RT_VOLUME_ALBEDO define, so a scene without the feature builds a
// byte-identical G-buffer program with no extra sampler). Primary visibility can
// afford this sampler3D — the raster pass has ample sampler headroom, unlike the
// lighting megakernel. The value is gated per-mesh by uHasVolume, so non-volume
// meshes sharing this program write exactly the same albedo they did before.
#ifdef RT_VOLUME_ALBEDO
uniform highp sampler3D uVolumeTex;
uniform vec3 uVolumeOrigin;
uniform vec3 uVolumeSize;
uniform bool uHasVolume;
#endif

// Screen-space cotangent frame (Mikkelsen 2010): reconstruct a tangent basis
// from derivatives of world position and uv, so tangent-space normal maps work
// without a per-vertex tangent attribute (none is uploaded to the BVH/G-buffer).
vec3 perturbNormal(vec3 N, vec3 P, vec2 uv, vec3 mapN) {
  vec3 dpdx = dFdx(P);
  vec3 dpdy = dFdy(P);
  vec2 duvdx = dFdx(uv);
  vec2 duvdy = dFdy(uv);
  vec3 t = normalize(dpdx * duvdy.y - dpdy * duvdx.y);
  vec3 b = normalize(cross(N, t));
  mat3 tbn = mat3(t, b, N);
  return normalize(tbn * mapN);
}

void main() {
  vec3 albedo = uColor;
  if (uHasMap) {
    albedo *= texture(uMap, vUvCoord).rgb;
  }
  albedo *= vColor; // vertex colours (white when the mesh has no color attribute)
  // Volumetric surface albedo: sample a world-space 3D texture at this fragment's
  // world position and use it as the base colour, replacing color x map x vColor.
  // uvw = clamp((p - origin) / size, 0, 1); the ClampToEdge sampler + this clamp
  // keep hits just outside the volume reading the boundary colour instead of
  // wrapping. Gated so only rtVolumeAlbedo meshes are affected.
#ifdef RT_VOLUME_ALBEDO
  if (uHasVolume) {
    vec3 uvw = clamp((vWorldPos - uVolumeOrigin) / uVolumeSize, 0.0, 1.0);
    albedo = texture(uVolumeTex, uvw).rgb;
  }
#endif
  vec3 emissive = uEmissive;
  if (uHasEmissiveMap) {
    emissive *= texture(uEmissiveMap, vUvCoord).rgb;
  }
  vec3 n = normalize(vWorldNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  if (uHasNormalMap) {
    // Tangent-space normal in [-1,1], scaled by material.normalScale (x,y).
    vec3 mapN = texture(uNormalMap, vUvCoord).xyz * 2.0 - 1.0;
    mapN.xy *= uNormalScale;
    n = perturbNormal(n, vWorldPos, vUvCoord, mapN);
  }
  // three.js convention: green channel of roughnessMap x scalar roughness,
  // blue channel of metalnessMap x scalar metalness (an ORM texture packs both).
  float roughness = uRoughness;
  if (uHasRoughnessMap) roughness *= texture(uRoughnessMap, vUvCoord).g;
  float metalness = uMetalness;
  if (uHasMetalnessMap) metalness *= texture(uMetalnessMap, vUvCoord).b;
  gAlbedoRough = vec4(albedo, roughness);
  // .w is a packed material word in disjoint ranges, so the lighting pass reads
  // specular/glass/blend properties without an extra G-buffer sampler (it already
  // sits at the WebGL2 16-sampler minimum — the reason per-material IOR rides
  // here rather than in a third G-buffer texture the lighting pass would have to
  // sample):
  //   [0,1] plain metalness
  //   (2,3] transmissive glass, PARTIAL: w - 2 = transmission (global rt.ior)
  //   [3,4) transmissive glass, FULL (transmission >= ~1): w - 3 = ior - 1
  //   [4,5] alpha blend: w - 4 = opacity
  // Blend wins: a transparent surface is kept out of the BVH and composited by
  // the lighting pass, so it must never be read as glass. Every EXISTING consumer
  // decodes clamp(w - 2, 0, 1) as transmission, which saturates to 1.0 across the
  // whole [3,4) band — so full glass keeps reading as fully transmissive there and
  // only the lighting pass additionally recovers the per-material IOR (Task 2).
  float matWord;
  if (uBlend) {
    matWord = 4.0 + uOpacity;
  } else if (uTransmission > 0.0) {
    if (uTransmission >= 0.99) {
      // clamp (ior - 1) to [0, 0.98] so the word stays clear of the 4.0 blend
      // boundary even after fp16 rounding of this channel; covers ior 1.0-1.98.
      matWord = 3.0 + clamp(uIor - 1.0, 0.0, 0.98);
    } else {
      matWord = 2.0 + uTransmission; // partial glass: keep transmission, global ior
    }
  } else {
    matWord = metalness;
  }
  gNormalMetal = vec4(n, matWord);
  // .w packs the valid flag AND roughness: 0 = background, 1 + roughness
  // otherwise. Every consumer only tests w < 0.5, so this stays compatible.
  gWorldPos = vec4(vWorldPos, 1.0 + roughness);
  // .a is normally the constant 1.0 (CompositePass reads only .rgb). A blend
  // surface carries its opacity here; the packed word above also encodes it, so
  // the sampler-bound lighting pass reads opacity without a gEmissive fetch.
  // Dynamic-mesh surfaces instead write -1.0: a per-pixel flag the reservoir
  // passes read to know which pixels belong to moving geometry (dynamicMeshes
  // are not visible from inside a shader). Opacity is never negative and dynamic
  // meshes are never blend (transparent meshes are dropped from dynamicMeshes),
  // so the sentinel cannot collide with either consumer.
  gEmissive = vec4(emissive, uIsDynamic > 0.5 ? -1.0 : (uBlend ? uOpacity : 1.0));
#ifdef RT_MOTION_VECTORS
  // Previous-frame screen position of this surface point, in [0,1] UV. For a
  // static mesh (vPrevWorldPos === vWorldPos) this is the camera-only
  // reprojection the consumers would otherwise compute, so the static path
  // reduces to it (the ReSTIR stage, which samples this value directly, is
  // bit-identical; the accumulate/TAA stages re-derive the same clip.xy/clip.w
  // division inside their own program and can differ by 1 ULP on a tiny
  // fraction of fragments — a 1-LSB, 0.1% mismatch, not a functional one).
  // Storing the raw previous UV (rather than a pre-subtracted prevUv - currUv
  // delta) is what keeps that reduction exact enough to be byte-identical:
  // a pre-subtracted delta would force the consumer to reassociate
  // currUv + (prevUv - currUv) back to prevUv, a 1-ULP error that showed up as
  // a 1-LSB mismatch in 0.23% of channels. prevClip.w <= 0 means the surface
  // was behind last frame's camera — no valid history position exists, so write
  // an out-of-bounds sentinel (not NaN: NaN comparison falls through the
  // consumers' bounds checks) that every consumer's existing bounds test drops.
  {
    vec4 prevClip = uPrevViewProj * vec4(vPrevWorldPos, 1.0);
    if (prevClip.w > 0.0) {
      gMotion = vec4((prevClip.xy / prevClip.w) * 0.5 + 0.5, 0.0, 0.0);
    } else {
      gMotion = vec4(1e4, 1e4, 0.0, 0.0);
    }
  }
#endif
}
`;

function hasCustomObjectCallbacks(object) {
  return object.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender ||
    object.onAfterRender !== THREE.Object3D.prototype.onAfterRender;
}

/**
 * Rasterizes the scene into a 4-target G-buffer (all RGBA32F):
 *   [0] albedo.rgb + roughness   [1] worldNormal.xyz + metalness
 *   [2] worldPos.xyz + validFlag [3] emissive.rgb
 *
 * Uses a pooled material swap by default so each mesh's Standard/Basic/Lambert/Phong
 * material properties flow into the buffer without touching user materials. Meshes
 * with custom Object3D render callbacks use the legacy per-mesh proxy path so their
 * callback-visible material behavior remains unchanged.
 */
export class GBufferPass {
  constructor(width, height, { mixedPrecision = true, materialPooling = true } = {}) {
    // Mixed fp16/fp32 attachments are legal WebGL2 but some implementations
    // (notably Apple's Metal backend) may reject the framebuffer — the caller
    // probes support and passes the verdict here.
    this._mixedPrecision = mixedPrecision;
    // Two G-buffers, ping-ponged each frame: the previous frame's worldPos +
    // normals are needed to validate reprojected history (stage 2).
    this._width = width;
    this._height = height;
    this._materialPooling = materialPooling !== false;
    this._targets = [
      this._makeTarget(width, height),
      this._makeTarget(width, height),
    ];
    this._current = 0;

    this._materialCache = new WeakMap(); // mesh -> gbuffer ShaderMaterial
    this._sharedMaterialPool = new Map(); // `${vertexColors}:${side}` -> ShaderMaterial
    this._sharedHiddenMaterial = null;
    this._sharedSources = new WeakMap(); // mesh -> original material(s)
    this._sharedMaterialArrays = new WeakMap();
    // Flat alternating arrays avoid allocating a short pair array for every
    // visible mesh on every G-buffer traversal.  Entries are [object, value]
    // at indices [i, i + 1], restored in the finally block below.
    this._swapped = [];
    this._hidden = []; // objects temporarily hidden for the G-buffer draw
    this._normalMat3 = new THREE.Matrix3(); // synchronous per-mesh scratch
    // World-space 3D-texture albedo: off unless a scene registers a material with
    // userData.rtVolumeAlbedo (see setVolume). When off, the gbuffer program is
    // compiled WITHOUT the RT_VOLUME_ALBEDO define — no sampler3D, byte-identical.
    this._volumeEnabled = false;
    this._dummyVolumeTex = null; // 1x1x1 fallback bound to non-volume meshes when on
    this._dynamicMeshes = null; // Set of dynamic meshes (see setDynamicMeshes)
    // Motion-vector state (see setMotionVectors). Off, the G-buffer is the
    // exact 4-attachment target it has always been.
    this._motionEnabled = false;
    this._prevModelMatrices = null; // Map<mesh, Matrix4> filled by the tracer
    this._motionPrevViewProj = new THREE.Matrix4();
  }

  /**
   * Mark the meshes whose surfaces are dynamic (re-baked each frame via
   * updateDynamic). Their pixels write a -1.0 flag into gEmissive.a so the
   * reservoir passes can tell moving geometry from the static world. Pass null
   * (or omit) to flag nothing — gEmissive.a then keeps its pre-feature values.
   */
  setDynamicMeshes(meshes) {
    this._dynamicMeshes = meshes && meshes.length ? new Set(meshes) : null;
  }

  // A valid 1x1x1 3D texture to bind on gbuffer materials whose mesh is NOT a
  // volume material while the feature is compiled in — keeps every declared
  // sampler3D pointing at a complete texture (its branch is never taken, so the
  // value is irrelevant; it just must not be an unbound/incomplete sampler).
  _dummyVolume() {
    if (!this._dummyVolumeTex) {
      const t = new THREE.Data3DTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, 1);
      t.format = THREE.RGBAFormat;
      t.type = THREE.UnsignedByteType;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.needsUpdate = true;
      this._dummyVolumeTex = t;
    }
    return this._dummyVolumeTex;
  }

  _resetSharedMaterialPool() {
    for (const material of this._sharedMaterialPool.values()) material.dispose();
    this._sharedMaterialPool.clear();
    this._sharedMaterialArrays = new WeakMap();
  }

  /**
   * Enable/disable the world-space 3D-texture albedo path for the primary
   * (G-buffer) visibility. Compiles the RT_VOLUME_ALBEDO define into the per-mesh
   * gbuffer program when on. Toggling clears the material cache so the programs
   * recompile with/without the define. Called by RealtimeRaytracer after each
   * compile with whether the scene registered any rtVolumeAlbedo material.
   */
  setVolume(enabled) {
    const on = !!enabled;
    if (on === this._volumeEnabled) return;
    this._volumeEnabled = on;
    this._materialCache = new WeakMap(); // force recompile with the new define
    this._resetSharedMaterialPool();
  }

  /**
   * Enable/disable the motion-vector attachment. On, the G-buffer becomes a
   * 5-attachment MRT (the extra RG32F target holds the screen-space motion
   * vector) and the per-mesh programs recompile with RT_MOTION_VECTORS. Off is
   * byte-identical to the pre-feature 4-attachment G-buffer. Rebuilds the
   * ping-pong targets and clears the material cache (a size/toggle, so the
   * caller should reset temporal history).
   */
  setMotionVectors(enabled) {
    const on = !!enabled;
    if (on === this._motionEnabled) return;
    this._motionEnabled = on;
    for (const t of this._targets) t.dispose();
    this._targets = [
      this._makeTarget(this._width, this._height),
      this._makeTarget(this._width, this._height),
    ];
    this._current = 0;
    this._materialCache = new WeakMap(); // force recompile with the new define
    this._resetSharedMaterialPool();
  }

  /**
   * Previous-frame model matrices per dynamic mesh, captured by the tracer at
   * the END of the previous frame (rigid transforms only). A mesh without an
   * entry (first frame) falls back to its current matrixWorld, i.e. a
   * camera-only motion vector.
   */
  setPrevModelMatrices(map) {
    this._prevModelMatrices = map;
  }

  /** Previous view-projection matrix for the motion-vector path. */
  setMotionMatrices(prevViewProj) {
    this._motionPrevViewProj.copy(prevViewProj);
  }

  _makeTarget(width, height) {
    const t = makeMRT(width, height, this._motionEnabled ? 5 : 4, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      type: THREE.FloatType,
      depthBuffer: true,
    });
    for (const tex of t.texture) tex.generateMipmaps = false;
    // Mixed precision: only world position (reprojection + plane-distance
    // tests) needs fp32. Albedo/normal/emissive are fine in fp16, which halves
    // G-buffer bandwidth on 3 of the 4 targets — a large win on mobile GPUs.
    if (this._mixedPrecision) {
      t.texture[0].type = THREE.HalfFloatType; // albedo + roughness
      t.texture[1].type = THREE.HalfFloatType; // normal + packed material word
      t.texture[3].type = THREE.HalfFloatType; // emissive
    }
    if (this._motionEnabled) {
      // Motion vector: 2-channel RG32F holding the surface's PREVIOUS screen UV.
      // Two channels are enough (a screen position is 2D), and fp32 (not fp16)
      // keeps sub-pixel precision — fp16 would quantize a half-screen position to
      // ~0.2px at 960 wide and make TAA shimmer.
      t.texture[4].format = THREE.RGFormat;
      t.texture[4].type = THREE.FloatType;
    }
    return t;
  }

  get target() {
    return this._targets[this._current];
  }
  get _prev() {
    return this._targets[1 - this._current];
  }

  get albedoRough() {
    return this.target.texture[0];
  }
  get normalMetal() {
    return this.target.texture[1];
  }
  get worldPos() {
    return this.target.texture[2];
  }
  get emissive() {
    return this.target.texture[3];
  }
  get prevNormalMetal() {
    return this._prev.texture[1];
  }
  get prevWorldPos() {
    return this._prev.texture[2];
  }
  /** Motion-vector attachment of the current G-buffer (null when disabled). */
  get motion() {
    return this._motionEnabled ? this.target.texture[4] : null;
  }

  setSize(width, height) {
    this._width = width;
    this._height = height;
    for (const t of this._targets) t.setSize(width, height);
  }

  _makeGbufferMaterial(mesh) {
    const material = new THREE.ShaderMaterial({
      // Stable program name for the compile-failure self-diagnosis (see
      // RealtimeRaytracer._scanPrograms). Per-mesh materials share one program
      // cache key, so they all surface as the single core pass "rt:gbuffer".
      name: "rt:gbuffer",
      glslVersion: THREE.GLSL3,
      // RT_VOLUME_ALBEDO is present only while a scene uses the volumetric-albedo
      // feature (see setVolume); absent, the compiled program is identical to the
      // pre-feature G-buffer (no sampler3D, no volume branch). RT_MOTION_VECTORS
      // likewise appears only while motion vectors are enabled (see
      // setMotionVectors).
      defines: {
        ...(this._volumeEnabled ? { RT_VOLUME_ALBEDO: "1" } : {}),
        ...(this._motionEnabled ? { RT_MOTION_VECTORS: "1" } : {}),
      },
      vertexShader: gbufferVert,
      fragmentShader: gbufferFrag,
      uniforms: {
        uNormalMatrixWorld: { value: new THREE.Matrix3() },
        uColor: { value: new THREE.Color(1, 1, 1) },
        uRoughness: { value: 1.0 },
        uMetalness: { value: 0.0 },
        uTransmission: { value: 0.0 },
        uIor: { value: 1.5 },
        uEmissive: { value: new THREE.Color(0, 0, 0) },
        uMap: { value: null },
        uHasMap: { value: false },
        uEmissiveMap: { value: null },
        uHasEmissiveMap: { value: false },
        uNormalMap: { value: null },
        uHasNormalMap: { value: false },
        uNormalScale: { value: new THREE.Vector2(1, 1) },
        uRoughnessMap: { value: null },
        uHasRoughnessMap: { value: false },
        uMetalnessMap: { value: null },
        uHasMetalnessMap: { value: false },
        uBlend: { value: false },
        uOpacity: { value: 1.0 },
        uIsDynamic: { value: 0.0 },
        // Motion-vector uniforms are always present in the JS uniform object
        // (harmless when the define is off — three uploads only uniforms that
        // exist in the compiled program, so a non-motion scene never touches
        // these).
        uPrevModelMatrix: { value: new THREE.Matrix4() },
        uPrevViewProj: { value: new THREE.Matrix4() },
        // Volume-albedo uniforms are always present in the JS uniform object
        // (harmless when the define is off — three uploads only uniforms that
        // exist in the compiled program, so a non-volume scene never touches
        // these). While the define is on, _syncGbufferMaterial binds either the
        // material's own volume texture or the shared dummy, so a non-volume mesh
        // never leaves an incomplete sampler3D bound.
        uVolumeTex: { value: null },
        uVolumeOrigin: { value: new THREE.Vector3() },
        uVolumeSize: { value: new THREE.Vector3(1, 1, 1) },
        uHasVolume: { value: false },
      },
      side: THREE.FrontSide,
    });
    // Enable the vertex-colour path ONLY when this mesh's geometry carries a
    // color attribute. This drives three's USE_COLOR define (see gbufferVert), so
    // a mesh without one writes byte-identical albedo. The material cache is
    // per-mesh, so this per-mesh define variant is safe.
    material.vertexColors = !!(mesh && mesh.geometry && mesh.geometry.getAttribute("color"));
    return material;
  }

  // Sync properties from one user material into one gbuffer material (cheap; run
  // every frame). The final three arguments are computed once per mesh lookup;
  // passing them directly keeps the hot traversal allocation-free.
  _syncGbufferMaterial(material, src, isDynamic, previousModel, normalMatrix, fixedSide = null) {
    const u = material.uniforms;
    // Preserve Three's per-material visibility, including invisible entries in
    // a multi-material mesh. The proxy replaces the source before render-list
    // construction, so failing to mirror this flag would make hidden groups draw.
    material.visible = src.visible !== false;
    if (src.color) u.uColor.value.copy(src.color);
    else u.uColor.value.set(1, 1, 1);
    u.uRoughness.value = src.roughness ?? 1.0;
    u.uMetalness.value = src.metalness ?? 0.0;
    u.uTransmission.value = src.transmission ?? 0.0; // MeshPhysicalMaterial
    // Per-material IOR (MeshPhysicalMaterial.ior; default 1.5). Encoded into the
    // packed material word for fully-transmissive glass (see gbufferFrag).
    u.uIor.value = src.ior ?? 1.5;

    if (src.emissive) {
      u.uEmissive.value
        .copy(src.emissive)
        .multiplyScalar(src.emissiveIntensity ?? 1);
    } else u.uEmissive.value.set(0, 0, 0);
    u.uMap.value = src.map ?? null;
    u.uHasMap.value = !!src.map;
    u.uEmissiveMap.value = src.emissiveMap ?? null;
    u.uHasEmissiveMap.value = !!src.emissiveMap;
    u.uNormalMap.value = src.normalMap ?? null;
    u.uHasNormalMap.value = !!src.normalMap;
    if (src.normalScale) u.uNormalScale.value.copy(src.normalScale);
    else u.uNormalScale.value.set(1, 1);
    u.uRoughnessMap.value = src.roughnessMap ?? null;
    u.uHasRoughnessMap.value = !!src.roughnessMap;
    u.uMetalnessMap.value = src.metalnessMap ?? null;
    u.uHasMetalnessMap.value = !!src.metalnessMap;
    // Alpha-blended transparency: primary-visible here (opacity packed into the
    // material word + gEmissive.a), composited against the geometry behind by the
    // lighting pass. opacity 1 renders opaque, matching the old force-opaque path.
    u.uBlend.value = !!src.transparent;
    u.uOpacity.value = src.opacity ?? 1.0;
    u.uIsDynamic.value = isDynamic ? 1.0 : 0.0;
    // Motion-vector inputs. Static meshes use their (constant) matrixWorld as
    // the previous model — identical to modelMatrix, so the motion vector
    // collapses to camera-only reprojection exactly. Dynamic meshes use the
    // previous frame's captured matrix (see setPrevModelMatrices).
    if (this._motionEnabled) {
      u.uPrevModelMatrix.value.copy(previousModel);
      u.uPrevViewProj.value.copy(this._motionPrevViewProj);
    }
    // World-space 3D-texture albedo. Only meshes whose material opted in via
    // userData.rtVolumeAlbedo get uHasVolume=true; every other mesh keeps the
    // dummy sampler (branch never taken) so its albedo is byte-identical. This is
    // per-mesh, so DISTINCT volumes each render correctly in primary visibility.
    if (this._volumeEnabled) {
      const vol = src.userData && src.userData.rtVolumeAlbedo;
      if (vol && vol.texture) {
        u.uHasVolume.value = true;
        u.uVolumeTex.value = vol.texture;
        u.uVolumeOrigin.value.copy(vol.origin ?? { x: 0, y: 0, z: 0 });
        const s = vol.size ?? { x: 1, y: 1, z: 1 };
        u.uVolumeSize.value.set(s.x || 1, s.y || 1, s.z || 1);
      } else {
        u.uHasVolume.value = false;
        u.uVolumeTex.value = this._dummyVolume();
      }
    }
    u.uNormalMatrixWorld.value.copy(normalMatrix);
    // Pooled materials are keyed by side. Keep that render state immutable for
    // the whole render-list item even if user code mutates the source material
    // during Object3D.onBeforeRender; legacy proxies retain the old live sync.
    material.side = fixedSide === null ? (src.side ?? THREE.FrontSide) : fixedSide;
  }

  // Returns the gbuffer material(s) for a mesh: a single ShaderMaterial, or — for
  // a multi-material mesh (mesh.material is an array + geometry.groups) — an ARRAY
  // of them, one per source material, index-aligned so three renders each group
  // with its own gbuffer material natively.
  _gbufferMaterialFor(mesh) {
    const isDynamic = !!(this._dynamicMeshes && this._dynamicMeshes.has(mesh));
    const previousModel = this._motionEnabled && this._prevModelMatrices
      ? this._prevModelMatrices.get(mesh) || mesh.matrixWorld
      : mesh.matrixWorld;
    // Compute the inverse-transpose exactly once for this mesh invocation. The
    // scratch is copied into every per-material uniform below, so no uniform
    // Matrix3 instance is shared between multi-material groups.
    const normalMatrix = this._normalMat3.getNormalMatrix(mesh.matrixWorld);
    const vertexColors = !!(
      mesh.geometry && mesh.geometry.getAttribute("color")
    );
    if (Array.isArray(mesh.material)) {
      let cached = this._materialCache.get(mesh);
      if (!Array.isArray(cached) || cached.length !== mesh.material.length) {
        cached = mesh.material.map(() => this._makeGbufferMaterial(mesh));
        this._materialCache.set(mesh, cached);
      }
      for (let i = 0; i < mesh.material.length; i++) {
        const src = mesh.material[i];
        // Three skips a group whose material slot is empty. Preserve the hole
        // instead of trying to sync it as a ShaderMaterial.
        if (!src) {
          cached[i] = src;
          continue;
        }
        if (!cached[i]) cached[i] = this._makeGbufferMaterial(mesh);
        if (cached[i].vertexColors !== vertexColors) {
          cached[i].vertexColors = vertexColors;
          cached[i].needsUpdate = true;
        }
        this._syncGbufferMaterial(
          cached[i], src, isDynamic, previousModel, normalMatrix
        );
      }
      return cached;
    }
    let material = this._materialCache.get(mesh);
    if (!material || Array.isArray(material)) {
      material = this._makeGbufferMaterial(mesh);
      this._materialCache.set(mesh, material);
    }
    if (material.vertexColors !== vertexColors) {
      material.vertexColors = vertexColors;
      material.needsUpdate = true;
    }
    this._syncGbufferMaterial(
      material, mesh.material, isDynamic, previousModel, normalMatrix
    );
    return material;
  }

  _makeSharedMaterial(vertexColors, side) {
    const material = this._makeGbufferMaterial(null);
    material.vertexColors = vertexColors;
    material.side = side;
    material.onBeforeRender = (_renderer, _scene, _camera, geometry, object, group) => {
      const original = this._sharedSources.get(object);
      const index = group && group.materialIndex !== undefined ? group.materialIndex : 0;
      const src = Array.isArray(original) ? original[index] : original;
      if (!src) return;
      const isDynamic = !!(this._dynamicMeshes && this._dynamicMeshes.has(object));
      const previousModel = this._motionEnabled && this._prevModelMatrices
        ? this._prevModelMatrices.get(object) || object.matrixWorld
        : object.matrixWorld;
      const normalMatrix = this._normalMat3.getNormalMatrix(object.matrixWorld);
      this._syncGbufferMaterial(
        material,
        src,
        isDynamic,
        previousModel,
        normalMatrix,
        side
      );
      // Keep the pool key's culling state immutable after source callbacks have
      // run, and force three to upload this draw's source-material uniforms.
      material.side = side;
      material.uniformsNeedUpdate = true;
    };
    return material;
  }

  _sharedMaterialForSource(source, vertexColors) {
    if (!source || source.visible === false) return this._sharedHiddenMaterial;
    const side = source.side ?? THREE.FrontSide;
    // Side and color presence are the only compile/render-list variants needed
    // by this pass. Stringifying the numeric side also tolerates uncommon side
    // values without assuming only FrontSide/BackSide/DoubleSide.
    const key = `${vertexColors ? 1 : 0}:${String(side)}`;
    let material = this._sharedMaterialPool.get(key);
    if (!material) {
      material = this._makeSharedMaterial(vertexColors, side);
      this._sharedMaterialPool.set(key, material);
    }
    return material;
  }

  _sharedMaterialFor(mesh) {
    if (!this._sharedHiddenMaterial) {
      this._sharedHiddenMaterial = new THREE.MeshBasicMaterial({ visible: false });
    }
    const source = mesh.material;
    const vertexColors = !!(
      mesh.geometry && mesh.geometry.getAttribute("color")
    );
    if (!Array.isArray(source)) {
      this._sharedSources.set(mesh, source);
      return this._sharedMaterialForSource(source, vertexColors);
    }
    let cached = this._sharedMaterialArrays.get(mesh);
    if (!Array.isArray(cached) || cached.length !== source.length) {
      cached = new Array(source.length);
      this._sharedMaterialArrays.set(mesh, cached);
    }
    this._sharedSources.set(mesh, source);
    for (let i = 0; i < source.length; i++) {
      const src = source[i];
      cached[i] = src ? this._sharedMaterialForSource(src, vertexColors) : src;
    }
    return cached;
  }

  render(renderer, scene, camera) {
    // Ping-pong: what was "current" becomes "previous".
    this._current = 1 - this._current;

    // Swap in G-buffer materials. Transparent meshes are written too — as the
    // nearest single layer, depth-tested/written like any surface (overlapping
    // transparent surfaces do not inter-sort). Their opacity rides in the packed
    // material word + gEmissive.a, and the lighting pass blends them against the
    // geometry behind. opacity 1 writes fully opaque, so alpha-textured cases
    // (LittlestTokyo's glass) look exactly as before.
    //
    // Objects that are NOT meshes (Sprite / Line / Points) keep their OWN
    // material here, and those materials write a single gl_FragColor. Rendering
    // one into this 4-attachment MRT framebuffer is a GL_INVALID_OPERATION (an
    // ESSL1 fragment shader cannot feed multiple draw buffers) and the object is
    // not traceable geometry either — the BVH compiler skips it. So they are
    // HIDDEN for the duration of the G-buffer draw and restored right after;
    // draw them yourself in an overlay pass on top of rt.render() if you need
    // them on screen. compileScene() warns once naming them.
    this._swapped.length = 0;
    this._hidden.length = 0;
    scene.traverse((obj) => {
      if (!obj.visible) return;
      if (obj.isMesh && obj.geometry) {
        this._swapped.push(obj, obj.material);
        const usePool = this._materialPooling && !hasCustomObjectCallbacks(obj);
        obj.material = usePool ? this._sharedMaterialFor(obj) : this._gbufferMaterialFor(obj);
        return;
      }
      if (obj.isSprite || obj.isLine || obj.isPoints) {
        obj.visible = false;
        this._hidden.push(obj);
      }
    });

    const prevBackground = scene.background;
    let targetBound = false;
    try {
      scene.background = null; // background writes nothing; worldPos.w stays 0
      renderer.setRenderTarget(this.target);
      targetBound = true;
      renderer.setClearColor(0x000000, 0);
      renderer.clear(true, true, false);
      renderer.render(scene, camera);
    } finally {
      if (targetBound) renderer.setRenderTarget(null);
      scene.background = prevBackground;
      for (let i = 0; i < this._swapped.length; i += 2) {
        this._swapped[i].material = this._swapped[i + 1];
      }
      this._swapped.length = 0;
      // Restore visibility exactly once per object (each was pushed once, and only
      // if it was visible when we hid it).
      for (const obj of this._hidden) obj.visible = true;
      this._hidden.length = 0;
    }
  }

  dispose() {
    for (const t of this._targets) t.dispose();
    if (this._dummyVolumeTex) this._dummyVolumeTex.dispose();
    this._resetSharedMaterialPool();
    if (this._sharedHiddenMaterial) this._sharedHiddenMaterial.dispose();
  }
}
