import * as THREE from "three";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { MAX_LIGHTS } from "./SceneCompiler.js";
import { SKY_GLSL } from "./sky.glsl.js";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const rtLightingFrag = /* glsl */ `
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${shaderStructs}
${shaderIntersectFunction}
${SKY_GLSL}

#define MAX_LIGHTS ${MAX_LIGHTS}
#define PI 3.14159265358979

layout(location = 0) out vec4 outIrradiance;

in vec2 vUv;

// Two-level BVH: static (uploaded once) + dynamic (small, refit each frame).
uniform BVH bvhStatic;
uniform BVH bvhDynamic;
uniform bool uHasDynamic;
// One packed per-vertex texture per level: normal.xyz + materialIndex.w.
// (Two BVH structs already use 8 samplers; WebGL2 guarantees only 16 total.)
uniform sampler2D uAttrStatic;
uniform sampler2D uAttrDynamic;
uniform sampler2D uMaterialsTex;        // 2 texels per material (shared)

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;

// temporal reprojection (stage 2)
uniform sampler2D uPrevAccum;        // rgb = irradiance history, a = sample count
uniform sampler2D uPrevGWorldPos;    // previous frame's G-buffer, for validation
uniform sampler2D uPrevGNormalMetal;
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform vec3 uCameraPos;
uniform float uMaxHistory;
uniform bool uTemporalReprojection;
uniform float uFireflyClamp;

uniform vec4 uLightPosType[MAX_LIGHTS];     // xyz pos|dir, w: 0 point, 1 directional
uniform vec4 uLightColorRadius[MAX_LIGHTS]; // rgb color*intensity, w radius
uniform int uLightCount;

uniform vec3 uEnvColor;
uniform float uEnvIntensity;
uniform float uFrame;
uniform float uEps;
uniform bool uGIEnabled;

// Procedural sky (when enabled, replaces the flat env colour as the "miss" term
// for GI rays — this is what gives natural outdoor bounce light).
uniform bool uSkyEnabled;
uniform vec3 uSunDir;      // direction toward the sun
uniform vec3 uSunColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSkyIntensity;

// ---------- RNG (PCG) ----------
uint gSeed;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec2 rand2() { return vec2(rand(), rand()); }

vec3 orthoBasisSample(vec3 n, vec2 u, out vec3 t, out vec3 b) {
  t = normalize(abs(n.x) > 0.9 ? cross(n, vec3(0, 1, 0)) : cross(n, vec3(1, 0, 0)));
  b = cross(n, t);
  return vec3(0.0);
}

vec3 cosineSampleHemisphere(vec3 n, vec2 u) {
  float a = 2.0 * PI * u.x;
  float r = sqrt(u.y);
  vec3 t, b;
  orthoBasisSample(n, u, t, b);
  return normalize(t * (r * cos(a)) + b * (r * sin(a)) + n * sqrt(max(0.0, 1.0 - u.y)));
}

vec3 randUnitVector() {
  vec2 u = rand2();
  float z = u.x * 2.0 - 1.0;
  float a = u.y * 2.0 * PI;
  float r = sqrt(max(0.0, 1.0 - z * z));
  return vec3(r * cos(a), r * sin(a), z);
}

// ---------- two-level BVH helpers ----------
// Closest hit across both levels; isDyn says which one so the caller samples
// the matching vertex-attribute textures. (No backticks in these GLSL comments —
// they would terminate the enclosing JS template literal.)
bool traceBoth(vec3 ro, vec3 rd, out uvec4 fi, out vec3 bary, out float dist, out bool isDyn) {
  uvec4 fiS; vec3 fnS; vec3 bcS; float sideS; float distS;
  bool hitS = bvhIntersectFirstHit(bvhStatic, ro, rd, fiS, fnS, bcS, sideS, distS);
  uvec4 fiD; vec3 fnD; vec3 bcD; float sideD; float distD;
  bool hitD = uHasDynamic && bvhIntersectFirstHit(bvhDynamic, ro, rd, fiD, fnD, bcD, sideD, distD);
  if (hitS && (!hitD || distS <= distD)) { fi = fiS; bary = bcS; dist = distS; isDyn = false; return true; }
  if (hitD) { fi = fiD; bary = bcD; dist = distD; isDyn = true; return true; }
  return false;
}

bool occluded(vec3 ro, vec3 rd, float maxDist) {
  uvec4 fi; vec3 fn; vec3 bc; float side; float dist;
  if (bvhIntersectFirstHit(bvhStatic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  if (uHasDynamic && bvhIntersectFirstHit(bvhDynamic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  return false;
}

void fetchMaterial(float matIndex, out vec3 albedo, out float roughness,
                   out vec3 emissive, out float metalness) {
  int mi = int(round(matIndex)) * 2;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(mi, 0), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(mi + 1, 0), 0);
  albedo = t0.rgb;
  roughness = t0.a;
  emissive = t1.rgb;
  metalness = t1.a;
}

// ---------- lighting ----------
// Direct irradiance (demodulated: no albedo) at point P with normal N,
// from light i, with one shadow ray. Area-samples point lights for soft shadows.
vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];

  vec3 L;
  float dist2 = 1.0;
  float maxDist = 1e7;

  if (posType.w < 0.5) {
    // point light: sample a point on its sphere for soft shadows
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - P;
    float dl = length(d);
    if (dl < 1e-5) return vec3(0.0);
    L = d / dl;
    dist2 = dl * dl;
    maxDist = dl;
  } else {
    // directional light: jitter within a small cone
    L = normalize(-posType.xyz + randUnitVector() * colRad.w);
    dist2 = 1.0;
  }

  float NdotL = dot(N, L);
  if (NdotL <= 0.0) return vec3(0.0);

  if (occluded(P + N * uEps, L, maxDist)) return vec3(0.0);
  return colRad.rgb * (NdotL / dist2);
}

// Direct light at a GI bounce hit: sample ONE random light (weighted by count).
vec3 sampleOneLight(vec3 P, vec3 N) {
  if (uLightCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
  return lightContribution(i, P, N) * float(uLightCount);
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outIrradiance = vec4(0.0);
    return;
  }

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 1973u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);

  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);

  // --- direct lighting: one shadow ray per light ---
  vec3 direct = vec3(0.0);
  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= uLightCount) break;
    direct += lightContribution(i, P, N);
  }

  // --- 1-bounce indirect (cosine-weighted; pdf cancels the NdotL/PI) ---
  vec3 indirect = vec3(0.0);
  if (uGIEnabled) {
    vec3 dir = cosineSampleHemisphere(N, rand2());
    uvec4 faceIndices; vec3 barycoord; float dist; bool isDyn;
    if (traceBoth(P + N * uEps, dir, faceIndices, barycoord, dist, isDyn)) {
      // One packed fetch: normal.xyz + materialIndex.w for the hit level.
      vec4 attr = isDyn
        ? textureSampleBarycoord(uAttrDynamic, barycoord, faceIndices.xyz)
        : textureSampleBarycoord(uAttrStatic, barycoord, faceIndices.xyz);
      vec3 hAlbedo; float hRough; vec3 hEmissive; float hMetal;
      fetchMaterial(attr.w, hAlbedo, hRough, hEmissive, hMetal);

      vec3 hN = normalize(attr.xyz);
      if (dot(hN, dir) > 0.0) hN = -hN;

      vec3 hP = P + dir * dist;
      vec3 Ld = sampleOneLight(hP + hN * uEps, hN);
      // Incoming radiance from the hit surface (its emission + reflected direct light)
      indirect = hEmissive + hAlbedo * Ld * (1.0 / PI);
    } else {
      // GI ray escaped to the sky — this is the natural ambient bounce.
      indirect = uSkyEnabled
        ? skyColor(dir, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
        : uEnvColor * uEnvIntensity;
    }
  }

  // Firefly clamp: suppress rare huge GI samples (big perceived-noise win,
  // slightly biased). Applied to indirect only; direct is analytic.
  float lum = dot(indirect, vec3(0.299, 0.587, 0.114));
  if (lum > uFireflyClamp) indirect *= uFireflyClamp / lum;

  vec3 sampleIrr = direct + indirect;

  // --- temporal reprojection: pull validated history from last frame ---
  float count = 1.0;
  vec3 history = vec3(0.0);
  if (uTemporalReprojection) {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clip.w > 0.0 && clipC.w > 0.0) {
      vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
      // P comes from a full-res G-buffer texel, which sits sub-pixel off this
      // half-res fragment's center. That constant offset would bias bilinear
      // history reads every frame (content drifts/smears at renderScale < 1).
      // Cancel it: measure P's offset in the CURRENT frame and subtract.
      vec2 currUv = (clipC.xy / clipC.w) * 0.5 + 0.5;
      prevUv -= currUv - vUv;
      if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
        vec4 prevPos = texture(uPrevGWorldPos, prevUv);
        vec3 prevN = texture(uPrevGNormalMetal, prevUv).xyz;
        // Plane-distance test: robust at grazing angles (position error from
        // texel quantization lies along the surface, not along the normal).
        float distToCam = distance(P, uCameraPos);
        float tol = 0.005 * distToCam + 20.0 * uEps;
        bool valid = prevPos.w > 0.5
          && abs(dot(P - prevPos.xyz, N)) < tol
          && dot(N, normalize(prevN)) > 0.9;
        if (valid) {
          vec4 h = texture(uPrevAccum, prevUv); // bilinear
          count = clamp(h.a, 0.0, uMaxHistory) + 1.0;
          history = h.rgb;
        }
      }
    }
  }

  // Exponential moving average; count=1 (disocclusion / first frame) means
  // the fresh sample is used as-is.
  vec3 blended = mix(history, sampleIrr, 1.0 / count);
  outIrradiance = vec4(blended, count);
}
`;

/**
 * Fullscreen pass: for every G-buffer pixel, trace shadow rays to every light and
 * one cosine-weighted GI bounce against the BVH. Outputs demodulated irradiance,
 * progressively accumulated into a ping-pong float target while the camera is still.
 */
export class RTLightingPass {
  constructor(width, height) {
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);

    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: rtLightingFrag,
      uniforms: {
        bvhStatic: { value: null },
        bvhDynamic: { value: null },
        uHasDynamic: { value: false },
        uAttrStatic: { value: null },
        uAttrDynamic: { value: null },
        uMaterialsTex: { value: null },
        uGWorldPos: { value: null },
        uGNormalMetal: { value: null },
        uPrevAccum: { value: null },
        uPrevGWorldPos: { value: null },
        uPrevGNormalMetal: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uViewProj: { value: new THREE.Matrix4() },
        uCameraPos: { value: new THREE.Vector3() },
        uMaxHistory: { value: 128 },
        uTemporalReprojection: { value: true },
        uFireflyClamp: { value: 4.0 },
        uLightPosType: { value: [] },
        uLightColorRadius: { value: [] },
        uLightCount: { value: 0 },
        uEnvColor: { value: new THREE.Color(0.03, 0.04, 0.06) },
        uEnvIntensity: { value: 1.0 },
        uFrame: { value: 0 },
        uEps: { value: 1e-3 },
        uGIEnabled: { value: true },
        uSkyEnabled: { value: false },
        uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.45).normalize() },
        uSunColor: { value: new THREE.Color(1.0, 0.9, 0.75) },
        uSkyZenith: { value: new THREE.Color(0.18, 0.34, 0.62) },
        uSkyHorizon: { value: new THREE.Color(0.7, 0.8, 0.9) },
        uSkyIntensity: { value: 1.0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  _makeTarget(width, height) {
    // Half-float + linear: history is sampled bilinearly at reprojected UVs,
    // and fp16 halves the bandwidth (EMA blending never accumulates a raw sum,
    // so fp16 precision is sufficient).
    const t = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    t.texture.generateMipmaps = false;
    return t;
  }

  /** Clear both history buffers (e.g. after scene recompile or resize). */
  clearHistory(renderer) {
    const prevTarget = renderer.getRenderTarget();
    const prevColor = new THREE.Color();
    renderer.getClearColor(prevColor);
    const prevAlpha = renderer.getClearAlpha();
    renderer.setClearColor(0x000000, 0);
    for (const t of [this.targetA, this.targetB]) {
      renderer.setRenderTarget(t);
      renderer.clear(true, false, false);
    }
    renderer.setRenderTarget(prevTarget);
    renderer.setClearColor(prevColor, prevAlpha);
  }

  setSize(width, height) {
    this.targetA.setSize(width, height);
    this.targetB.setSize(width, height);
  }

  setCompiledScene(compiled) {
    const u = this.material.uniforms;
    u.bvhStatic.value = compiled.staticBvhUniform;
    u.bvhDynamic.value = compiled.dynamicBvhUniform;
    u.uHasDynamic.value = compiled.hasDynamic;
    u.uAttrStatic.value = compiled.staticAttrTex;
    u.uAttrDynamic.value = compiled.dynamicAttrTex;
    u.uMaterialsTex.value = compiled.materialsTex;
    u.uLightPosType.value = compiled.lightPosType;
    u.uLightColorRadius.value = compiled.lightColorRadius;
    u.uLightCount.value = compiled.lightCount;
  }

  /** Renders into targetA (reading targetB as history), then swaps. Returns the fresh accum texture. */
  render(renderer, gbuffer, frame) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    u.uPrevGNormalMetal.value = gbuffer.prevNormalMetal;
    u.uPrevAccum.value = this.targetB.texture;
    u.uFrame.value = frame;

    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);

    const out = this.targetA;
    [this.targetA, this.targetB] = [this.targetB, this.targetA];
    return out.texture;
  }

  dispose() {
    this.targetA.dispose();
    this.targetB.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
