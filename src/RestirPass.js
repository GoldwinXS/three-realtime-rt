import * as THREE from "three";
import { MAX_LIGHTS } from "./SceneCompiler.js";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// ReSTIR DI (temporal-only v1): per pixel, stream K light candidates through a
// weighted reservoir (weights = UNSHADOWED contribution — no rays here), then
// merge with the reprojected previous frame's reservoir. Over a few frames a
// pixel converges onto the light that actually matters to it, and the lighting
// pass spends its single shadow ray on that winner. Cost is ALU-only and flat
// in light count — the key to "more lights without losing frames".
//
// Reservoir texel encoding (RGBA32F):
//   r = candidateId * 64 + min(M, 63)   (id: light index, or MAX_LIGHTS + tri)
//   g,b = barycentric sample uv on an emissive triangle (unused for lights)
//   a = wSum
const restirFrag = /* glsl */ `
precision highp float;

#define MAX_LIGHTS ${MAX_LIGHTS}
#define PI 3.14159265358979
#define CANDIDATES 8

layout(location = 0) out vec4 outReservoir;

in vec2 vUv;

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uMaterialsTex;  // row 1: emissive tris, rows 2..65: blue noise
uniform sampler2D uPrevReservoir;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;

uniform vec4 uLightPosType[MAX_LIGHTS];
uniform vec4 uLightColorRadius[MAX_LIGHTS];
uniform int uLightCount;
uniform int uEmissiveCount;
uniform float uFrame;
uniform vec3 uCameraPos;
uniform float uEps;

// ---------- RNG (blue noise for the first dims, PCG after) ----------
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

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Unshadowed contribution of candidate (id, uv) at surface (P, N). MUST match
// what RTLightingPass evaluates at shading time (minus visibility) — the
// estimator's correctness rests on that agreement.
vec3 candidateContribution(float id, vec2 uv, vec3 P, vec3 N) {
  if (id < float(MAX_LIGHTS)) {
    int i = int(id);
    vec4 posType = uLightPosType[i];
    vec4 colRad = uLightColorRadius[i];
    if (posType.w < 0.5) {
      vec3 d = posType.xyz - P; // light CENTER: soft-radius jitter re-drawn at shading
      float dl = length(d);
      if (dl < 1e-5) return vec3(0.0);
      float NdotL = dot(N, d / dl);
      if (NdotL <= 0.0) return vec3(0.0);
      return colRad.rgb * (NdotL / (dl * dl));
    }
    float NdotL = dot(N, -posType.xyz);
    if (NdotL <= 0.0) return vec3(0.0);
    return colRad.rgb * NdotL;
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
  // Uniform pick within the emissive set happens at CANDIDATE level, so the
  // per-triangle contribution uses area only (count folds into pick pdf).
  return vec3(t1.w, t2.w, t3.w) * (cosS * cosL * t0.w / max(d2, 1e-6));
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outReservoir = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);

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

  // --- streaming RIS over K fresh candidates ---
  float rId = 0.0;
  vec2 rUv = vec2(0.0);
  float wSum = 0.0;
  float M = 0.0;
  for (int k = 0; k < CANDIDATES; k++) {
    int pick = min(int(rand() * float(S)), S - 1);
    float id;
    vec2 uv = vec2(0.0);
    if (pick < uLightCount) {
      id = float(pick);
    } else {
      id = float(MAX_LIGHTS + (pick - uLightCount));
      uv = vec2(rand(), rand());
      if (uv.x + uv.y > 1.0) uv = 1.0 - uv;
    }
    // source pdf = 1/S (times uniform-area within a tri, already folded into
    // the contribution's area factor) -> RIS weight = p̂ * S
    float w = luminance(candidateContribution(id, uv, P, N)) * float(S);
    wSum += w;
    M += 1.0;
    if (w > 0.0 && rand() * wSum < w) { rId = id; rUv = uv; }
  }

  // --- temporal reuse: prev reservoir re-weighted at THIS surface ---
  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  if (clip.w > 0.0) {
    vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
    if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
      vec4 prevPos = texture(uPrevGWorldPos, prevUv);
      float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
      if (prevPos.w > 0.5 && abs(dot(P - prevPos.xyz, N)) < tol) {
        vec4 h = texture(uPrevReservoir, prevUv);
        // Staleness cap; ALSO keeps total M within the 6 bits the encoding
        // stores (8 fresh + 40 history < 64) so shading's W uses the true M.
        float hM = min(mod(h.r, 64.0), 40.0);
        float hId = floor(h.r / 64.0);
        if (hM > 0.0 && h.a > 0.0) {
          // Treat the previous reservoir as ONE candidate carrying its history:
          // RIS weight = p̂_now(sample) · W_prev · M_prev, where
          // W_prev = wSum_prev / (M_prev · p̂_prev). p̂_prev ≈ p̂_now on a
          // validated surface, so the p̂ terms cancel to wSum/M · M.
          float hPhat = luminance(candidateContribution(hId, h.gb, P, N));
          float w = hPhat > 0.0 ? (h.a / max(mod(h.r, 64.0), 1.0)) * hM : 0.0;
          wSum += w;
          M += hM;
          if (w > 0.0 && rand() * wSum < w) { rId = hId; rUv = h.gb; }
        }
      }
    }
  }

  outReservoir = vec4(rId * 64.0 + min(M, 63.0), rUv.x, rUv.y, wSum);
}
`;

/** Temporal-reuse reservoir pass at lighting resolution (see shader comment). */
export class RestirPass {
  constructor(width, height) {
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);

    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: restirFrag,
      uniforms: {
        uGWorldPos: { value: null },
        uGNormalMetal: { value: null },
        uMaterialsTex: { value: null },
        uPrevReservoir: { value: null },
        uPrevGWorldPos: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uLightPosType: { value: [] },
        uLightColorRadius: { value: [] },
        uLightCount: { value: 0 },
        uEmissiveCount: { value: 0 },
        uFrame: { value: 0 },
        uCameraPos: { value: new THREE.Vector3() },
        uEps: { value: 1e-3 },
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
    const u = this.material.uniforms;
    u.uMaterialsTex.value = compiled.materialsTex;
    u.uLightPosType.value = compiled.lightPosType;
    u.uLightColorRadius.value = compiled.lightColorRadius;
    u.uLightCount.value = compiled.lightCount;
    u.uEmissiveCount.value = compiled.emissiveTriCount;
  }

  clearHistory(renderer) {
    const prev = renderer.getRenderTarget();
    renderer.setClearColor(0x000000, 0);
    for (const t of [this.targetA, this.targetB]) {
      renderer.setRenderTarget(t);
      renderer.clear(true, false, false);
    }
    renderer.setRenderTarget(prev);
  }

  setSize(width, height) {
    this.targetA.setSize(width, height);
    this.targetB.setSize(width, height);
  }

  /** Renders into targetA (reading targetB as history), swaps, returns texture. */
  render(renderer, gbuffer, prevViewProj, cameraPos, frame, eps) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uPrevReservoir.value = this.targetB.texture;
    u.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    u.uPrevViewProj.value.copy(prevViewProj);
    u.uFrame.value = frame;
    u.uCameraPos.value.copy(cameraPos);
    u.uEps.value = eps;

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
