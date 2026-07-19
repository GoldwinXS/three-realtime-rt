import * as THREE from "three";

const gbufferVert = /* glsl */ `
out vec3 vWorldPos;
out vec3 vWorldNormal;
out vec2 vUvCoord;

uniform mat3 uNormalMatrixWorld;

void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(uNormalMatrixWorld * normal);
  vUvCoord = uv;
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

uniform vec3 uColor;
uniform float uRoughness;
uniform float uMetalness;
uniform float uTransmission;
uniform vec3 uEmissive;
uniform sampler2D uMap;
uniform bool uHasMap;
uniform sampler2D uEmissiveMap;
uniform bool uHasEmissiveMap;

void main() {
  vec3 albedo = uColor;
  if (uHasMap) {
    albedo *= texture(uMap, vUvCoord).rgb;
  }
  vec3 emissive = uEmissive;
  if (uHasEmissiveMap) {
    emissive *= texture(uEmissiveMap, vUvCoord).rgb;
  }
  vec3 n = normalize(vWorldNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  gAlbedoRough = vec4(albedo, uRoughness);
  // .w is a packed material word: >= 2 means transmissive glass (w - 2 =
  // transmission amount), else it is plain metalness. Lets the lighting pass
  // read specular/glass properties without an extra G-buffer sampler (it
  // already sits at the WebGL2 16-sampler minimum).
  gNormalMetal = vec4(n, uTransmission > 0.0 ? 2.0 + uTransmission : uMetalness);
  // .w packs the valid flag AND roughness: 0 = background, 1 + roughness
  // otherwise. Every consumer only tests w < 0.5, so this stays compatible.
  gWorldPos = vec4(vWorldPos, 1.0 + uRoughness);
  gEmissive = vec4(emissive, 1.0);
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

  _gbufferMaterialFor(mesh) {
    let material = this._materialCache.get(mesh);
    if (!material) {
      material = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: gbufferVert,
        fragmentShader: gbufferFrag,
        uniforms: {
          uNormalMatrixWorld: { value: new THREE.Matrix3() },
          uColor: { value: new THREE.Color(1, 1, 1) },
          uRoughness: { value: 1.0 },
          uMetalness: { value: 0.0 },
          uTransmission: { value: 0.0 },
          uEmissive: { value: new THREE.Color(0, 0, 0) },
          uMap: { value: null },
          uHasMap: { value: false },
          uEmissiveMap: { value: null },
          uHasEmissiveMap: { value: false },
        },
        side: THREE.FrontSide,
      });
      this._materialCache.set(mesh, material);
    }

    // Sync properties from the user's material every frame (cheap).
    const src = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const u = material.uniforms;
    if (src.color) u.uColor.value.copy(src.color);
    u.uRoughness.value = src.roughness ?? 1.0;
    u.uMetalness.value = src.metalness ?? 0.0;
    u.uTransmission.value = src.transmission ?? 0.0; // MeshPhysicalMaterial

    if (src.emissive) {
      u.uEmissive.value
        .copy(src.emissive)
        .multiplyScalar(src.emissiveIntensity ?? 1);
    }
    u.uMap.value = src.map ?? null;
    u.uHasMap.value = !!src.map;
    u.uEmissiveMap.value = src.emissiveMap ?? null;
    u.uHasEmissiveMap.value = !!src.emissiveMap;
    u.uNormalMatrixWorld.value.getNormalMatrix(mesh.matrixWorld);
    material.side = src.side ?? THREE.FrontSide;
    return material;
  }

  render(renderer, scene, camera) {
    // Ping-pong: what was "current" becomes "previous".
    this._current = 1 - this._current;

    // Swap in G-buffer materials.
    this._swapped.length = 0;
    scene.traverse((obj) => {
      if (obj.isMesh && obj.geometry && obj.visible) {
        // The G-buffer has no alpha blending — a nearly invisible surface
        // (glass display case, ghost meshes) would write itself opaque over
        // everything behind it. Hide it from the raster pass instead.
        const m = Array.isArray(obj.material) ? obj.material[0] : obj.material;
        if (m.transparent && (m.opacity ?? 1) < 0.5) {
          obj.visible = false;
          this._swapped.push([obj, null]); // restore visibility after render
          return;
        }
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
    for (const [mesh, mat] of this._swapped) {
      if (mat === null) mesh.visible = true; // was hidden, not material-swapped
      else mesh.material = mat;
    }
    this._swapped.length = 0;
  }

  dispose() {
    for (const t of this._targets) t.dispose();
  }
}
