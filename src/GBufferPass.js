import * as THREE from "three";

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

uniform mat3 uNormalMatrixWorld;

void main() {
  vec3 transformed = position;
  vec3 objectNormal = normal;
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>

  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  vWorldPos = wp.xyz;
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

in vec3 vWorldPos;
in vec3 vWorldNormal;
in vec2 vUvCoord;
in vec3 vColor;

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
  gEmissive = vec4(emissive, uBlend ? uOpacity : 1.0);
}
`;

/**
 * Rasterizes the scene into a 4-target G-buffer (all RGBA32F):
 *   [0] albedo.rgb + roughness   [1] worldNormal.xyz + metalness
 *   [2] worldPos.xyz + validFlag [3] emissive.rgb
 *
 * Uses a per-mesh material swap (cached) so each mesh's Standard/Basic/Lambert/Phong
 * material properties flow into the buffer without touching user materials.
 */
export class GBufferPass {
  constructor(width, height, { mixedPrecision = true } = {}) {
    // Mixed fp16/fp32 attachments are legal WebGL2 but some implementations
    // (notably Apple's Metal backend) may reject the framebuffer — the caller
    // probes support and passes the verdict here.
    this._mixedPrecision = mixedPrecision;
    // Two G-buffers, ping-ponged each frame: the previous frame's worldPos +
    // normals are needed to validate reprojected history (stage 2).
    this._targets = [
      this._makeTarget(width, height),
      this._makeTarget(width, height),
    ];
    this._current = 0;

    this._materialCache = new WeakMap(); // mesh -> gbuffer ShaderMaterial
    this._swapped = []; // [mesh, originalMaterial] pairs during render
    this._normalMat3 = new THREE.Matrix3();
  }

  _makeTarget(width, height) {
    const t = new THREE.WebGLMultipleRenderTargets(width, height, 4, {
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

  setSize(width, height) {
    for (const t of this._targets) t.setSize(width, height);
  }

  _makeGbufferMaterial(mesh) {
    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
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
      },
      side: THREE.FrontSide,
    });
    // Enable the vertex-colour path ONLY when this mesh's geometry carries a
    // color attribute. This drives three's USE_COLOR define (see gbufferVert), so
    // a mesh without one writes byte-identical albedo. The material cache is
    // per-mesh, so this per-mesh define variant is safe.
    material.vertexColors = !!(mesh.geometry && mesh.geometry.getAttribute("color"));
    return material;
  }

  // Sync properties from one user material into one gbuffer material (cheap; run
  // every frame). `mesh` supplies the shared world normal matrix + side.
  _syncGbufferMaterial(material, src, mesh) {
    const u = material.uniforms;
    if (src.color) u.uColor.value.copy(src.color);
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
    }
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
    u.uNormalMatrixWorld.value.getNormalMatrix(mesh.matrixWorld);
    material.side = src.side ?? THREE.FrontSide;
  }

  // Returns the gbuffer material(s) for a mesh: a single ShaderMaterial, or — for
  // a multi-material mesh (mesh.material is an array + geometry.groups) — an ARRAY
  // of them, one per source material, index-aligned so three renders each group
  // with its own gbuffer material natively.
  _gbufferMaterialFor(mesh) {
    if (Array.isArray(mesh.material)) {
      let cached = this._materialCache.get(mesh);
      if (!Array.isArray(cached) || cached.length !== mesh.material.length) {
        cached = mesh.material.map(() => this._makeGbufferMaterial(mesh));
        this._materialCache.set(mesh, cached);
      }
      for (let i = 0; i < mesh.material.length; i++) {
        this._syncGbufferMaterial(cached[i], mesh.material[i], mesh);
      }
      return cached;
    }
    let material = this._materialCache.get(mesh);
    if (!material || Array.isArray(material)) {
      material = this._makeGbufferMaterial(mesh);
      this._materialCache.set(mesh, material);
    }
    this._syncGbufferMaterial(material, mesh.material, mesh);
    return material;
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
    this._swapped.length = 0;
    scene.traverse((obj) => {
      if (obj.isMesh && obj.geometry && obj.visible) {
        this._swapped.push([obj, obj.material]);
        obj.material = this._gbufferMaterialFor(obj);
      }
    });

    const prevBackground = scene.background;
    scene.background = null; // background writes nothing; worldPos.w stays 0

    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, false);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    scene.background = prevBackground;
    for (const [mesh, mat] of this._swapped) mesh.material = mat;
    this._swapped.length = 0;
  }

  dispose() {
    for (const t of this._targets) t.dispose();
  }
}
