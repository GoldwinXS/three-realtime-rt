import * as THREE from "three";
import { MAX_LIGHTS } from "./SceneCompiler.js";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// GLSL shared by the temporal and spatial reservoir shaders: RNG (blue noise
// first, PCG after) and the candidate contribution — which MUST stay in
// agreement with RTLightingPass.shadeReservoir (minus visibility).
const RESTIR_COMMON = /* glsl */ `
#define MAX_LIGHTS ${MAX_LIGHTS}
#define PI 3.14159265358979

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uMaterialsTex;  // row 1: emissive tris, rows 2..65: blue noise
uniform vec4 uLightPosType[MAX_LIGHTS];
uniform vec4 uLightColorRadius[MAX_LIGHTS];
uniform vec4 uLightDirCone[MAX_LIGHTS]; // spot: direction.xyz + cos(outer)
uniform int uLightCount;
uniform int uEmissiveCount;
uniform float uFrame;
uniform vec3 uCameraPos;
uniform float uEps;

uint gSeed;
int gBnDim;
vec4 gBlueNoise;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  if (gBnDim < 4) {
    float v = gBlueNoise[gBnDim];
    gBnDim++;
    return v;
  }
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec4 fetchBlueNoise() {
  ivec2 p = ivec2(gl_FragCoord.xy) & 63;
  vec4 bn = texelFetch(uMaterialsTex, ivec2(p.x, 2 + p.y), 0);
  vec4 shift = fract(float(uFrame) * vec4(0.6180340, 0.7548777, 0.5698403, 0.8191725));
  return fract(bn + shift);
}

// Named rtLum, NOT luminance: three r166+ prepends its own luminance(vec3)
// to every non-raw ShaderMaterial fragment shader, and GLSL treats a second
// (vec3) body as a redefinition — the whole program fails to compile.
float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Primary-surface roughness, set per pixel in main(). Drives the cheap specular
// lobe below so reservoirs favour lights that land on a highlight.
float gRestirRough;

// Cheap Blinn-Phong specular lobe for the target pdf ONLY (never shaded with
// this). Deliberately approximate — no Fresnel or geometry term, one pow() per
// candidate — since it just biases which light each reservoir keeps. wi points
// from the surface toward the light. Returns a multiplier boost in [0, ~0.8].
float restirSpecBoost(vec3 N, vec3 wi, vec3 P) {
  vec3 V = normalize(uCameraPos - P);
  vec3 H = normalize(wi + V);
  float shin = mix(4.0, 256.0, 1.0 - gRestirRough);
  return 0.8 * pow(max(dot(N, H), 0.0), shin);
}

// Unshadowed contribution of candidate (id, uv) at surface (P, N).
vec3 candidateContribution(float id, vec2 uv, vec3 P, vec3 N) {
  if (id < float(MAX_LIGHTS)) {
    int i = int(id);
    vec4 posType = uLightPosType[i];
    vec4 colRad = uLightColorRadius[i];
    if (posType.w < 0.5 || posType.w >= 1.5) {
      vec3 d = posType.xyz - P; // light CENTER: soft-radius jitter re-drawn at shading
      float dl = length(d);
      if (dl < 1e-5) return vec3(0.0);
      float NdotL = dot(N, d / dl);
      if (NdotL <= 0.0) return vec3(0.0);
      float cone = 1.0;
      if (posType.w >= 1.5) {
        // spot cone — MUST match RTLightingPass.spotFalloff for a consistent estimator
        vec4 dc = uLightDirCone[i];
        cone = smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, -d / dl));
        if (cone <= 0.0) return vec3(0.0);
      }
      return colRad.rgb * (cone * NdotL / (dl * dl)) * (1.0 + restirSpecBoost(N, d / dl, P));
    }
    float NdotL = dot(N, -posType.xyz);
    if (NdotL <= 0.0) return vec3(0.0);
    return colRad.rgb * NdotL * (1.0 + restirSpecBoost(N, -posType.xyz, P));
  }
  int t = (int(id) - MAX_LIGHTS) * 4;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(t, 1), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(t + 1, 1), 0);
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(t + 2, 1), 0);
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(t + 3, 1), 0);
  vec3 lp = t0.xyz + t1.xyz * uv.x + t2.xyz * uv.y;
  vec3 d = lp - P;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;
  float cosS = dot(N, wi);
  float cosL = abs(dot(t3.xyz, wi));
  if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
  // Uniform pick within the emissive set happens at candidate level, so the
  // per-triangle contribution uses area only (count folds into pick pdf).
  return vec3(t1.w, t2.w, t3.w) * (cosS * cosL * t0.w / max(d2, 1e-6)) * (1.0 + restirSpecBoost(N, wi, P));
}

// v3: reservoirs select TRIANGLES, not points. The selection target is the
// candidate's contribution at a FIXED proxy point (the centroid) — any fixed
// score keeps RIS consistent as long as shading divides by the same one. The
// actual surface point is re-drawn fresh every frame at shading, so soft
// area lighting keeps averaging instead of freezing onto one winning point.
// (Known approximation: a triangle whose centroid contributes zero but whose
// far corner doesn't can be under-selected at grazing setups.)
float phatOf(float id, vec3 P, vec3 N) {
  return rtLum(candidateContribution(id, vec2(1.0 / 3.0), P, N));
}
`;

// TEMPORAL stage. Streams K fresh candidates through a weighted reservoir,
// merges with the reprojected previous frame's reservoir. Output encoding
// (fed back as history next frame):
//   r = candidateId * 64 + min(M, 63), g,b = unused, a = wSum
const temporalFrag = /* glsl */ `
precision highp float;

${RESTIR_COMMON}

#define CANDIDATES 8

layout(location = 0) out vec4 outReservoir;

in vec2 vUv;

uniform sampler2D uPrevReservoir;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outReservoir = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  gRestirRough = clamp(wp.w - 1.0, 0.0, 1.0);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 3079u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  int S = uLightCount + uEmissiveCount; // uniform source pool
  if (S == 0) {
    outReservoir = vec4(0.0);
    return;
  }

  float rId = 0.0;
  float wSum = 0.0;
  float M = 0.0;
  for (int k = 0; k < CANDIDATES; k++) {
    int pick = min(int(rand() * float(S)), S - 1);
    float id = pick < uLightCount
      ? float(pick)
      : float(MAX_LIGHTS + (pick - uLightCount));
    // source pdf = 1/S -> RIS weight = p̂ * S
    float w = phatOf(id, P, N) * float(S);
    wSum += w;
    M += 1.0;
    if (w > 0.0 && rand() * wSum < w) { rId = id; }
  }

  // temporal reuse: previous reservoir as ONE candidate carrying its history
  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  if (clip.w > 0.0) {
    vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
    if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
      vec4 prevPos = texture(uPrevGWorldPos, prevUv);
      float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
      if (prevPos.w > 0.5 && abs(dot(P - prevPos.xyz, N)) < tol) {
        vec4 h = texture(uPrevReservoir, prevUv);
        // Staleness cap; ALSO keeps total M within the 6 bits the encoding
        // stores (8 fresh + 40 history < 64).
        float hM = min(mod(h.r, 64.0), 40.0);
        float hId = floor(h.r / 64.0);
        if (hM > 0.0 && h.a > 0.0) {
          // RIS weight = p̂_now · W_prev · M_prev; with p̂_prev ≈ p̂_now on a
          // validated surface this reduces to (wSum/M)·M.
          float hPhat = phatOf(hId, P, N);
          float w = hPhat > 0.0 ? (h.a / max(mod(h.r, 64.0), 1.0)) * hM : 0.0;
          wSum += w;
          M += hM;
          if (w > 0.0 && rand() * wSum < w) { rId = hId; }
        }
      }
    }
  }

  outReservoir = vec4(rId * 64.0 + min(M, 63.0), 0.0, 0.0, wSum);
}
`;

// SPATIAL stage (the "v2" of ReSTIR): merge a few validated neighbor
// reservoirs so pixels share each other's discoveries — the big win for
// convergence speed and area-light (emissive) noise. Output is consumed by
// the lighting pass THIS frame only (never fed back), so it trades the
// history encoding for a precomputed weight:
//   r = candidateId, g,b = unused, a = W = wSum / (M · p̂centroid)
const spatialFrag = /* glsl */ `
precision highp float;

${RESTIR_COMMON}

#define NEIGHBORS 4

layout(location = 0) out vec4 outReservoir;

in vec2 vUv;

uniform sampler2D uReservoirIn;
uniform vec2 uTexelSize;

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outReservoir = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  gRestirRough = clamp(wp.w - 1.0, 0.0, 1.0);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 5417u + uint(px.y) * 7907u + uint(uFrame) * 15731u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 3; // decorrelate from the temporal stage's blue-noise dims

  vec4 c = texture(uReservoirIn, vUv);
  float rId = floor(c.r / 64.0);
  float M = mod(c.r, 64.0);
  float wSum = c.a;

  float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
  for (int k = 0; k < NEIGHBORS; k++) {
    float a = (float(k) + rand()) * (2.0 * PI / float(NEIGHBORS));
    float rad = 2.0 + rand() * 8.0; // taps within ~10 lighting-res texels
    vec2 nUv = vUv + vec2(cos(a), sin(a)) * rad * uTexelSize;
    if (nUv.x < 0.0 || nUv.x > 1.0 || nUv.y < 0.0 || nUv.y > 1.0) continue;

    // geometric validation: same plane + similar orientation, or the
    // neighbor's chosen light is meaningless here
    vec4 nwp = texture(uGWorldPos, nUv);
    if (nwp.w < 0.5) continue;
    if (abs(dot(nwp.xyz - P, N)) > tol) continue;
    vec3 nN = normalize(texture(uGNormalMetal, nUv).xyz);
    if (dot(N, nN) < 0.9) continue;

    vec4 h = texture(uReservoirIn, nUv);
    float hM = mod(h.r, 64.0);
    if (hM < 1.0 || h.a <= 0.0) continue;
    float hId = floor(h.r / 64.0);
    // neighbor reservoir as one candidate, re-weighted at THIS surface
    float hPhat = phatOf(hId, P, N);
    float w = hPhat > 0.0 ? (h.a / hM) * min(hM, 40.0) : 0.0;
    wSum += w;
    M += min(hM, 40.0);
    if (w > 0.0 && rand() * wSum < w) { rId = hId; }
  }

  float phat = phatOf(rId, P, N);
  float W = (M > 0.0 && phat > 0.0) ? wSum / (M * phat) : 0.0;
  outReservoir = vec4(rId, 0.0, 0.0, W);
}
`;

/**
 * ReSTIR DI reservoirs at lighting resolution: temporal reuse (ping-ponged
 * history) followed by one spatial-reuse iteration. render() returns the
 * spatial output — {id, uv, W} per pixel — for the lighting pass to shade
 * with a single visibility ray.
 */
export class RestirPass {
  constructor(width, height) {
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);
    this.spatialTarget = this._makeTarget(width, height);

    const mkMaterial = (frag) =>
      new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: fullscreenVert,
        fragmentShader: frag,
        uniforms: {
          uGWorldPos: { value: null },
          uGNormalMetal: { value: null },
          uMaterialsTex: { value: null },
          uLightPosType: { value: [] },
          uLightColorRadius: { value: [] },
          uLightDirCone: { value: [] },
          uLightCount: { value: 0 },
          uEmissiveCount: { value: 0 },
          uFrame: { value: 0 },
          uCameraPos: { value: new THREE.Vector3() },
          uEps: { value: 1e-3 },
          ...(frag === temporalFrag
            ? {
                uPrevReservoir: { value: null },
                uPrevGWorldPos: { value: null },
                uPrevViewProj: { value: new THREE.Matrix4() },
              }
            : {
                uReservoirIn: { value: null },
                uTexelSize: { value: new THREE.Vector2(1 / width, 1 / height) },
              }),
        },
        depthTest: false,
        depthWrite: false,
      });

    this.material = mkMaterial(temporalFrag);
    this.spatialMaterial = mkMaterial(spatialFrag);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  _makeTarget(width, height) {
    // Full float + nearest: reservoirs must never be interpolated (a blend of
    // two candidate ids is meaningless).
    const t = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    t.texture.generateMipmaps = false;
    return t;
  }

  setCompiledScene(compiled) {
    for (const m of [this.material, this.spatialMaterial]) {
      const u = m.uniforms;
      u.uMaterialsTex.value = compiled.materialsTex;
      u.uLightPosType.value = compiled.lightPosType;
      u.uLightColorRadius.value = compiled.lightColorRadius;
      u.uLightDirCone.value = compiled.lightDirCone;
      u.uLightCount.value = compiled.lightCount;
      u.uEmissiveCount.value = compiled.emissiveTriCount;
    }
  }

  /** Emissive candidates follow the emissiveNEE toggle (set per frame). */
  setEmissiveCount(count) {
    this.material.uniforms.uEmissiveCount.value = count;
    this.spatialMaterial.uniforms.uEmissiveCount.value = count;
  }

  clearHistory(renderer) {
    const prev = renderer.getRenderTarget();
    renderer.setClearColor(0x000000, 0);
    for (const t of [this.targetA, this.targetB, this.spatialTarget]) {
      renderer.setRenderTarget(t);
      renderer.clear(true, false, false);
    }
    renderer.setRenderTarget(prev);
  }

  setSize(width, height) {
    this.targetA.setSize(width, height);
    this.targetB.setSize(width, height);
    this.spatialTarget.setSize(width, height);
    this.spatialMaterial.uniforms.uTexelSize.value.set(1 / width, 1 / height);
  }

  /** Temporal → spatial; history feeds back from the TEMPORAL stage only. */
  render(renderer, gbuffer, prevViewProj, cameraPos, frame, eps) {
    for (const m of [this.material, this.spatialMaterial]) {
      const u = m.uniforms;
      u.uGWorldPos.value = gbuffer.worldPos;
      u.uGNormalMetal.value = gbuffer.normalMetal;
      u.uFrame.value = frame;
      u.uCameraPos.value.copy(cameraPos);
      u.uEps.value = eps;
    }
    const tu = this.material.uniforms;
    tu.uPrevReservoir.value = this.targetB.texture;
    tu.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    tu.uPrevViewProj.value.copy(prevViewProj);

    this.quad.material = this.material;
    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);

    this.spatialMaterial.uniforms.uReservoirIn.value = this.targetA.texture;
    this.quad.material = this.spatialMaterial;
    renderer.setRenderTarget(this.spatialTarget);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);

    [this.targetA, this.targetB] = [this.targetB, this.targetA];
    return this.spatialTarget.texture;
  }

  dispose() {
    this.targetA.dispose();
    this.targetB.dispose();
    this.spatialTarget.dispose();
    this.material.dispose();
    this.spatialMaterial.dispose();
    this.quad.geometry.dispose();
  }
}
