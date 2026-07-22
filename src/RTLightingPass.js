import * as THREE from "three";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { MAX_LIGHTS } from "./SceneCompiler.js";
import { SKY_GLSL } from "./sky.glsl.js";
import { BVH_ANY_HIT_GLSL } from "./bvhAnyHit.glsl.js";

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
${BVH_ANY_HIT_GLSL}
${SKY_GLSL}

#define MAX_LIGHTS ${MAX_LIGHTS}
#define PI 3.14159265358979

layout(location = 0) out vec4 outIrradiance;
layout(location = 1) out vec4 outSpecular; // dielectric direct specular (fresh, this frame)

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

// temporal reprojection (stage 2). Validation is plane-distance only — the
// normal test was dropped to free a sampler for the ReSTIR reservoir (same
// simplification the TAA resolve already made, no observed regressions).
uniform sampler2D uPrevAccum;        // rgb = irradiance history, a = sample count
uniform sampler2D uPrevGWorldPos;    // previous frame's G-buffer, for validation
uniform sampler2D uReservoir;        // ReSTIR winner per pixel (see RestirPass)
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform vec3 uCameraPos;
uniform float uMaxHistory;
uniform bool uTemporalReprojection;
uniform float uFireflyClamp;

uniform vec4 uLightPosType[MAX_LIGHTS];     // xyz pos|dir, w: 0 point, 1 directional, >=2 spot (w-2 = cosInner)
uniform vec4 uLightColorRadius[MAX_LIGHTS]; // rgb color*intensity, w radius
uniform vec4 uLightDirCone[MAX_LIGHTS];     // spot: direction.xyz + cos(outer angle)
uniform int uLightCount;
uniform int uEmissiveCount; // NEE area-light triangles in row 1 of uMaterialsTex
uniform bool uEmissiveCDF;  // importance-sample tris by the power CDF (row 66)
uniform bool uReflEnabled;  // traced reflections on metallic surfaces
uniform bool uRefrEnabled;  // traced refraction on transmissive surfaces
uniform bool uBlendEnabled; // straight-through view continuation on blend surfaces
uniform float uIor;         // index of refraction for transmissive materials
uniform bool uLightStochastic; // 1 direct shadow ray/pixel/frame instead of 1/light
uniform bool uRestirEnabled;   // shade the reservoir winner instead of sampling
uniform bool uGIHalfRate;      // GI ray on alternating checkerboard, doubled

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

// ---------- RNG ----------
// The FIRST four random numbers each frame come from a 64x64 blue-noise tile
// (rows 2..65 of the scene-data texture), rotated over time with an R2
// low-discrepancy sequence. Those dimensions drive direct lighting — light
// pick + area-sample position — where noise is most visible; blue noise turns
// the residual error high-frequency, which temporal accumulation and the
// denoiser remove far better than white-noise clumps. Later dimensions fall
// back to PCG white noise (correlating many dimensions hurts).
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
vec2 rand2() { return vec2(rand(), rand()); }

vec4 fetchBlueNoise() {
  ivec2 p = ivec2(gl_FragCoord.xy) & 63;
  vec4 bn = texelFetch(uMaterialsTex, ivec2(p.x, 2 + p.y), 0);
  // R2 sequence: per-frame toroidal shift, decorrelated per channel.
  vec4 shift = fract(float(uFrame) * vec4(0.6180340, 0.7548777, 0.5698403, 0.8191725));
  return fract(bn + shift);
}

// Branchless orthonormal basis (Duff et al. 2017) — cheaper and stable for
// every n, including the poles the old cross-product picker handled branchily.
void orthoBasis(vec3 n, out vec3 t, out vec3 b) {
  float s = n.z >= 0.0 ? 1.0 : -1.0;
  float a = -1.0 / (s + n.z);
  float m = n.x * n.y * a;
  t = vec3(1.0 + s * n.x * n.x * a, s * m, -s * n.x);
  b = vec3(m, s + n.y * n.y * a, -n.y);
}

vec3 cosineSampleHemisphere(vec3 n, vec2 u) {
  float a = 2.0 * PI * u.x;
  float r = sqrt(u.y);
  vec3 t, b;
  orthoBasis(n, t, b);
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

// Shadow rays only need to know IF something blocks, not what's closest —
// the unordered any-hit traversal early-outs on the first blocker.
bool occluded(vec3 ro, vec3 rd, float maxDist) {
  if (bvhIntersectAnyHit(bvhStatic, ro, rd, maxDist - 2.0 * uEps)) return true;
  if (uHasDynamic && bvhIntersectAnyHit(bvhDynamic, ro, rd, maxDist - 2.0 * uEps)) return true;
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

// ---------- PBR specular (Cook-Torrance GGX) ----------
// A separate specular radiance is accumulated for the primary surface's DIRECT
// lighting alongside the demodulated diffuse irradiance. Because CompositePass
// multiplies the irradiance by albedo, a white dielectric highlight (F0 ~= 0.04)
// cannot ride in that buffer — it is emitted into gSpec and written to a second
// MRT attachment (added by the composite WITHOUT the albedo multiply). Metals'
// specular is albedo-tinted (F0 = albedo), so it stays in the reflection path
// where the composite's albedo multiply supplies the tint; gSpec is therefore
// scaled by (1 - metal)(1 - transmission) at output. Net effective Fresnel
// across both buffers is mix(0.04, albedo, metal) without the lighting pass ever
// sampling albedo (that would push it past the 16-sampler minimum).
vec3 gSpec;        // accumulated dielectric direct specular radiance
vec3 gViewDir;     // unit vector from the primary surface toward the camera
float gSpecRough;  // primary surface roughness (drives the GGX lobe width)
bool gWantSpec;    // true only while shading the PRIMARY surface's direct light

float D_GGX(float NoH, float a) {
  float a2 = a * a;
  float d = NoH * NoH * (a2 - 1.0) + 1.0;
  return a2 / max(PI * d * d, 1e-8);
}
// Height-correlated Smith visibility (already folds in the 1/(4 NoL NoV) term).
float V_SmithGGX(float NoV, float NoL, float a) {
  float a2 = a * a;
  float gv = NoL * sqrt(NoV * NoV * (1.0 - a2) + a2);
  float gl = NoV * sqrt(NoL * NoL * (1.0 - a2) + a2);
  return 0.5 / max(gv + gl, 1e-5);
}
vec3 F_Schlick(float VoH, vec3 f0) {
  return f0 + (1.0 - f0) * pow(clamp(1.0 - VoH, 0.0, 1.0), 5.0);
}
// Specular BRDF value (without the incoming NoL*radiance factor). F0 fixed at
// the dielectric 0.04 — metals are handled in the reflection path.
float ggxSpec(vec3 N, vec3 L) {
  vec3 H = normalize(gViewDir + L);
  float NoH = max(dot(N, H), 0.0);
  float NoV = max(dot(N, gViewDir), 1e-4);
  float NoL = max(dot(N, L), 1e-4);
  float VoH = max(dot(gViewDir, H), 0.0);
  // Clamp alpha off zero so a mirror-smooth dielectric does not produce an
  // infinite spike the temporal buffer cannot resolve.
  float a = max(gSpecRough * gSpecRough, 2e-3);
  return D_GGX(NoH, a) * V_SmithGGX(NoV, NoL, a) * F_Schlick(VoH, vec3(0.04)).x;
}
// Add the dielectric specular for one light: li is the incoming radiance
// factor (light colour * cone / dist^2), NoL the geometric cosine.
void addSpec(vec3 N, vec3 L, vec3 li, float NoL) {
  if (!gWantSpec) return;
  gSpec += li * (NoL * ggxSpec(N, L));
}

// ---------- lighting ----------
// Direct irradiance (demodulated: no albedo) at point P with normal N,
// from light i, with one shadow ray. Area-samples point lights for soft shadows.
// Spot cone falloff: smooth between the outer and inner cone cosines
// (posType.w = 2 + cosInner; dirCone.w = cosOuter).
float spotFalloff(int i, vec3 lightToP) {
  vec4 posType = uLightPosType[i];
  if (posType.w < 1.5) return 1.0;
  vec4 dc = uLightDirCone[i];
  return smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, lightToP));
}

vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];

  vec3 L;
  float dist2 = 1.0;
  float maxDist = 1e7;
  float cone = 1.0;

  if (posType.w < 0.5 || posType.w >= 1.5) {
    // point/spot light: sample a point on its sphere for soft shadows
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - P;
    float dl = length(d);
    if (dl < 1e-5) return vec3(0.0);
    L = d / dl;
    dist2 = dl * dl;
    maxDist = dl;
    cone = spotFalloff(i, -L);
    if (cone <= 0.0) return vec3(0.0);
  } else {
    // directional light: jitter within a small cone
    L = normalize(-posType.xyz + randUnitVector() * colRad.w);
    dist2 = 1.0;
  }

  float NdotL = dot(N, L);
  if (NdotL <= 0.0) return vec3(0.0);

  if (occluded(P + N * uEps, L, maxDist)) return vec3(0.0);
  vec3 li = colRad.rgb * (cone / dist2);
  addSpec(N, L, li, NdotL); // same shadow ray shadows the highlight
  return li * NdotL;
}

// Direct light at a GI bounce hit: sample ONE random light (weighted by count).
vec3 sampleOneLight(vec3 P, vec3 N) {
  if (uLightCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
  return lightContribution(i, P, N) * float(uLightCount);
}

// Next-event estimation on emissive-mesh triangles (row 1 of uMaterialsTex):
// pick one triangle, sample a point on it, cast one shadow ray, convert the
// area pdf to solid angle. Turns emitters into proper soft area lights instead
// of surfaces a GI ray has to hit by luck.
//
// NOISE CAVEAT: emissive NEE is the highest-variance direct-light path in the
// engine — one triangle sample per pixel per frame, and the area-to-solid-angle
// conversion carries a 1/dist^2 that spikes into fireflies when a shading point
// sits close to a small emitter. Two mitigations stack here:
//  1. uEmissiveCDF (default on): the triangle is IMPORTANCE-SAMPLED by
//     area x emitted luminance via the power CDF in the scene-data texture
//     (row 2 + 64 — see SceneCompiler's layout comment). A big bright panel is
//     picked proportionally more often than a tiny dim strip, and each sample
//     is weighted by its true pick probability — same mean, far less variance
//     than the uniform 1-of-N pick.
//  2. ReSTIR reservoirs converge each pixel onto the emitter that matters
//     (the demo keeps restir on whenever emissive NEE is on;
//     RealtimeRaytracer.compileScene logs a hint otherwise).
// fireflyClamp and the denoiser absorb the residual tail. Distance-aware
// selection and solid-angle triangle sampling remain future work.
vec3 sampleEmissiveTri(vec3 P, vec3 N) {
  if (uEmissiveCount == 0) return vec3(0.0);
  int idx;
  float invProb; // 1 / P(picked this triangle)
  if (uEmissiveCDF) {
    // Binary search the power CDF: 8 steps covers MAX_EMISSIVE_TRIS = 256.
    float u = rand();
    int lo = 0;
    int hi = uEmissiveCount - 1;
    for (int s = 0; s < 8; s++) {
      if (lo >= hi) break;
      int mid = (lo + hi) >> 1;
      if (u > texelFetch(uMaterialsTex, ivec2(mid, 66), 0).x) lo = mid + 1;
      else hi = mid;
    }
    idx = lo;
    invProb = 1.0 / max(texelFetch(uMaterialsTex, ivec2(idx, 66), 0).y, 1e-8);
  } else {
    idx = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1);
    invProb = float(uEmissiveCount);
  }
  int i = idx * 4;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(i, 1), 0);     // v0 | area
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(i + 1, 1), 0); // e1 | emit.r
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(i + 2, 1), 0); // e2 | emit.g
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(i + 3, 1), 0); // n  | emit.b

  vec2 u = rand2();
  if (u.x + u.y > 1.0) u = 1.0 - u; // uniform over the triangle
  vec3 lp = t0.xyz + t1.xyz * u.x + t2.xyz * u.y;

  vec3 d = lp - P;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;

  float cosS = dot(N, wi);
  // abs(): double-sided emission, matching what a GI ray hitting either face sees.
  float cosL = abs(dot(t3.xyz, wi));
  if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
  if (occluded(P + N * uEps, wi, dist)) return vec3(0.0);

  // Pick of one tri (probability 1/invProb) + uniform point on it:
  // pdf_area = 1/(invProb·area). Solid-angle conversion gives irradiance
  // Le · cosS · cosL / (d² · pdf_area).
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * invProb * t0.w / max(d2, 1e-6));

  // Dielectric highlight from this emitter: e already folds in cosS, so the
  // specular is e * (GGX BRDF) toward the sampled point (wi).
  if (gWantSpec) gSpec += e * ggxSpec(N, wi);

  // Uniform-area sampling has huge single-sample variance for receivers close
  // to a big emitter (sampled point can land almost on top of P, d² → 0);
  // those 100× spikes read as speckles because the EMA decays them only as
  // 1/count. Clamp at 2× the indirect firefly limit — slight bias right next
  // to the emitter, stable everywhere.
  float eLum = dot(e, vec3(0.299, 0.587, 0.114));
  float eCap = uFireflyClamp * 2.0;
  if (eLum > eCap) e *= eCap / eLum;
  return e;
}

// Shade this pixel's ReSTIR reservoir winner: recompute the (unshadowed)
// contribution — MUST match RestirPass.candidateContribution — then pay the
// one visibility ray and weight by W = wSum / (M · p̂). Analytic lights
// re-draw their soft-radius jitter here (the reservoir stores which light,
// not the jitter). The estimator inherently tames near-emitter spikes: a huge
// contribution comes with a proportionally huge p̂, and W divides it out.
vec3 shadeReservoir(vec3 P, vec3 N) {
  // Spatial-stage encoding: r = id, a = precomputed W (vs. centroid score).
  vec4 res = texture(uReservoir, vUv);
  if (res.a <= 0.0) return vec3(0.0);
  float id = res.r;

  vec3 C;
  vec3 wi;
  float maxDist;
  if (id < float(MAX_LIGHTS)) {
    int i = int(id);
    vec4 posType = uLightPosType[i];
    vec4 colRad = uLightColorRadius[i];
    if (posType.w < 0.5 || posType.w >= 1.5) {
      vec3 d = posType.xyz - P;
      float dl = length(d);
      if (dl < 1e-5) return vec3(0.0);
      float NdotL = dot(N, d / dl);
      if (NdotL <= 0.0) return vec3(0.0);
      float cone = spotFalloff(i, -d / dl);
      if (cone <= 0.0) return vec3(0.0);
      C = colRad.rgb * (cone * NdotL / (dl * dl));
      vec3 lp = posType.xyz + randUnitVector() * colRad.w; // soft shadows
      vec3 dj = lp - P;
      maxDist = length(dj);
      if (maxDist < 1e-5) return vec3(0.0);
      wi = dj / maxDist;
    } else {
      float NdotL = dot(N, -posType.xyz);
      if (NdotL <= 0.0) return vec3(0.0);
      C = colRad.rgb * NdotL;
      wi = normalize(-posType.xyz + randUnitVector() * colRad.w);
      maxDist = 1e7;
    }
  } else {
    int t = (int(id) - MAX_LIGHTS) * 4;
    vec4 t0 = texelFetch(uMaterialsTex, ivec2(t, 1), 0);
    vec4 t1 = texelFetch(uMaterialsTex, ivec2(t + 1, 1), 0);
    vec4 t2 = texelFetch(uMaterialsTex, ivec2(t + 2, 1), 0);
    vec4 t3 = texelFetch(uMaterialsTex, ivec2(t + 3, 1), 0);
    // v3: the reservoir chose the TRIANGLE; draw a FRESH point on it every
    // frame so the area light keeps averaging (no frozen-point noise). W was
    // normalized against the centroid score, and E[point sample] = the
    // triangle's true contribution, so the estimator stays consistent.
    vec2 uv = rand2();
    if (uv.x + uv.y > 1.0) uv = 1.0 - uv;
    vec3 lp = t0.xyz + t1.xyz * uv.x + t2.xyz * uv.y;
    vec3 d = lp - P;
    float d2 = dot(d, d);
    maxDist = sqrt(d2);
    if (maxDist < 1e-4) return vec3(0.0);
    wi = d / maxDist;
    float cosS = dot(N, wi);
    float cosL = abs(dot(t3.xyz, wi));
    if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
    C = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * t0.w / max(d2, 1e-6));
  }

  if (occluded(P + N * uEps, wi, maxDist)) return vec3(0.0);
  // Dielectric highlight from the reservoir winner (C = li * cos, shared with
  // the diffuse term; W = res.a is applied to both).
  if (gWantSpec) gSpec += C * (ggxSpec(N, wi) * res.a);
  vec3 e = C * res.a;
  // Safety clamp, same budget as the emissive direct clamp elsewhere.
  float l = dot(e, vec3(0.299, 0.587, 0.114));
  float cap = uFireflyClamp * 2.0;
  if (l > cap) e *= cap / l;
  return e;
}

// ONE light sample for secondary path vertices: stochastically pick either the
// analytic lights or the emissive set (weighted 1/p). Costs a single shadow
// ray — same ray budget the GI bounce had before emissive NEE existed —
// instead of two; the estimator stays unbiased and temporal accumulation
// averages out the extra variance.
vec3 sampleOneAny(vec3 P, vec3 N) {
  bool hasL = uLightCount > 0;
  bool hasE = uEmissiveCount > 0;
  if (hasL && hasE) {
    return rand() < 0.5
      ? sampleOneLight(P, N) * 2.0
      : sampleEmissiveTri(P, N) * 2.0;
  }
  if (hasL) return sampleOneLight(P, N);
  if (hasE) return sampleEmissiveTri(P, N);
  return vec3(0.0);
}

// Incoming radiance along rd: trace, shade the hit with direct + NEE lighting,
// sky/env on a miss. Specular rays keep emitter emission on hit (NEE at the ray
// origin cannot cover a specular path); diffuse GI rays drop it for NEE-listed
// (static) emitters so that light isn't counted twice.
vec3 traceRadiance(vec3 ro, vec3 rd, bool specular) {
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (!traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    return uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  vec4 attr = isDyn
    ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
    : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
  vec3 hAlbedo; float hRough; vec3 hEmissive; float hMetal;
  fetchMaterial(attr.w, hAlbedo, hRough, hEmissive, hMetal);
  vec3 hN = normalize(attr.xyz);
  if (dot(hN, rd) > 0.0) hN = -hN;
  vec3 hP = ro + rd * dist;
  vec3 Ld = sampleOneAny(hP + hN * uEps, hN);
  vec3 hLe = (!specular && uEmissiveCount > 0 && !isDyn) ? vec3(0.0) : hEmissive;
  return hLe + hAlbedo * Ld * (1.0 / PI);
}

float schlick(float cosT, float eta) {
  float r0 = (1.0 - eta) / (1.0 + eta);
  r0 *= r0;
  return r0 + (1.0 - r0) * pow(1.0 - cosT, 5.0);
}

// Roughness-jittered mirror direction (glossy cone approximation).
vec3 glossyReflect(vec3 V, vec3 N, float rough) {
  vec3 refl = reflect(V, N);
  if (rough > 0.0) {
    refl = normalize(mix(refl, cosineSampleHemisphere(N, rand2()), rough * rough));
  }
  return refl;
}

// Analytic lights live in uniform arrays, not the BVH, so a traced reflection
// ray never sees them — a mirror under a spotlight would show no glint. Evaluate
// each light as a small area source along the (roughness-jittered) reflection
// direction: if refl points within the light's angular radius, the light's disc
// is reflected, so add its radiance. The jitter in refl (from glossyReflect)
// softens the disc over temporal accumulation, widening the glint with
// roughness. Shadowed with the same any-hit occluder as direct lighting.
vec3 analyticGlint(vec3 P, vec3 refl) {
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= uLightCount) break;
    vec4 posType = uLightPosType[i];
    vec4 colRad = uLightColorRadius[i];
    if (posType.w < 0.5 || posType.w >= 1.5) {
      // point / spot
      vec3 d = posType.xyz - P;
      float dl = length(d);
      if (dl < 1e-4) continue;
      vec3 toL = d / dl;
      float cone = spotFalloff(i, -toL);
      if (cone <= 0.0) continue;
      // Angular radius of the sphere light + a small floor so a zero-radius
      // light still shows a pin-point glint.
      float ang = atan(max(colRad.w, 1e-3) / dl) + 0.01;
      if (dot(refl, toL) < cos(ang)) continue;
      if (occluded(P + refl * uEps, refl, dl)) continue;
      sum += colRad.rgb * (cone / (dl * dl));
    } else {
      // directional: fixed small angular size (colRad.w = sun softness)
      vec3 toL = normalize(-posType.xyz);
      float ang = max(colRad.w, 0.02) + 0.01;
      if (dot(refl, toL) < cos(ang)) continue;
      if (occluded(P + refl * uEps, refl, 1e7)) continue;
      sum += colRad.rgb;
    }
  }
  return sum;
}

// Glass: Fresnel-weighted blend of a surface reflection and a two-interface
// refraction (enter at P, march to the exit surface, refract again).
vec3 glassRadiance(vec3 P, vec3 N, vec3 V, float rough, float ior) {
  vec3 refl = glossyReflect(V, N, rough);
  vec3 reflRad = dot(refl, N) > 0.0
    ? traceRadiance(P + N * uEps, refl, true) + analyticGlint(P, refl)
    : vec3(0.0);

  float eta = 1.0 / ior;
  vec3 rd = refract(V, N, eta);
  if (rd == vec3(0.0)) return reflRad; // total internal reflection at entry
  float fres = schlick(clamp(-dot(V, N), 0.0, 1.0), eta);

  vec3 ro = P - N * (2.0 * uEps);
  vec3 refrRad;
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    // Exit interface: refract back out (or bounce once on internal reflection).
    vec4 attr = isDyn
      ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
      : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
    vec3 xN = normalize(attr.xyz);
    if (dot(xN, rd) > 0.0) xN = -xN;
    vec3 xP = ro + rd * dist;
    vec3 rd2 = refract(rd, xN, ior);
    if (rd2 == vec3(0.0)) rd2 = reflect(rd, xN);
    refrRad = traceRadiance(xP - xN * uEps, rd2, true);
  } else {
    refrRad = uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  return mix(refrRad, reflRad, fres);
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outIrradiance = vec4(0.0);
    outSpecular = vec4(0.0);
    return;
  }

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 1973u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  vec3 P = wp.xyz;
  vec4 nmSample = texture(uGNormalMetal, vUv);
  vec3 N = normalize(nmSample.xyz);
  // Decode the packed material word (see GBufferPass): [4,5] → alpha blend
  // (w - 4 = opacity), [2,4) → glass (w - 2 = transmission), else metalness.
  float matW = nmSample.w;
  bool blend = matW >= 4.0;
  float opacity = blend ? clamp(matW - 4.0, 0.0, 1.0) : 1.0;
  float transmission = (matW >= 2.0 && matW < 4.0) ? clamp(matW - 2.0, 0.0, 1.0) : 0.0;
  float metal = matW < 2.0 ? matW : 0.0;
  float rough = clamp(wp.w - 1.0, 0.0, 1.0);
  // Per-material IOR rides the [3,4) glass sub-band (full-transmission glass, see
  // GBufferPass). Below 3 (partial glass) or non-glass, fall back to the global
  // rt.ior uniform. material.ior wins whenever it was encoded. (Task 2)
  float ior = (matW >= 3.0 && matW < 4.0) ? (1.0 + (matW - 3.0)) : uIor;

  // Cook-Torrance specular state for this primary surface. gWantSpec gates the
  // GGX term to PRIMARY direct lighting only (GI-bounce direct light, below,
  // reuses the same functions but must not pollute the highlight buffer).
  gSpec = vec3(0.0);
  gViewDir = normalize(uCameraPos - P);
  gSpecRough = rough;
  gWantSpec = true;

  // --- direct lighting ---
  // ReSTIR: shade the reservoir's winner with one visibility ray (flat cost in
  // light count). Stochastic: one blind random sample. Full: one shadow ray
  // per light + one for the emissive set.
  vec3 direct = vec3(0.0);
  if (uRestirEnabled) {
    direct = shadeReservoir(P, N);
  } else if (uLightStochastic) {
    direct = sampleOneAny(P, N);
  } else {
    for (int i = 0; i < MAX_LIGHTS; i++) {
      if (i >= uLightCount) break;
      direct += lightContribution(i, P, N);
    }
    // Emissive meshes as area lights (next-event estimation, one shadow ray).
    direct += sampleEmissiveTri(P, N);
  }

  // --- 1-bounce indirect (cosine-weighted; pdf cancels the NdotL/PI).
  // traceRadiance shades the hit with direct + NEE light, or returns the
  // sky/env colour when the ray escapes (the natural ambient bounce).
  // Half-rate mode traces on alternating checkerboard parity each frame,
  // DOUBLED — the temporal average converges to the same brightness
  // (unbiased) while GI's ray cost halves; accumulation + denoise absorb
  // the alternation.
  gWantSpec = false; // secondary bounces contribute to diffuse GI only
  // BLEND pixels reuse THIS call site as their straight-through view
  // continuation instead of a GI bounce (their behind-image rides the specular
  // attachment; the pane forgoes its own GI bounce — visually negligible, and
  // it saves a ray). CRITICAL CALL-SITE BUDGET: traceRadiance may appear at
  // most THREE times in this shader (glass refraction exit, this unified
  // secondary site, the metal-reflection path). WebKit's GLSL->Metal
  // translation silently emits a broken program at a FOURTH inlined call site
  // (clean compile, black output on every iOS browser) — bisected live on an
  // iPad, 2026-07-22. Never add a call site; extend this one.
  vec3 indirect = vec3(0.0);
  vec3 blendBehind = vec3(0.0);
  bool wantBehind = uBlendEnabled && blend;
  bool wantGI = uGIEnabled && !wantBehind
    && (!uGIHalfRate || (((px.x + px.y + int(uFrame)) & 1) == 0));
  if (wantBehind || wantGI) {
    vec3 Vv = normalize(P - uCameraPos);
    vec3 dir = wantBehind ? Vv : cosineSampleHemisphere(N, rand2());
    vec3 org = wantBehind ? P + Vv * uEps : P + N * uEps;
    vec3 r = traceRadiance(org, dir, wantBehind);
    if (wantBehind) {
      blendBehind = r;
    } else {
      indirect = r;
      if (uGIHalfRate) indirect *= 2.0;
    }
  }

  // Firefly clamp: suppress rare huge GI samples (big perceived-noise win,
  // slightly biased). Applied to indirect only; direct is analytic.
  float lum = dot(indirect, vec3(0.299, 0.587, 0.114));
  if (lum > uFireflyClamp) indirect *= uFireflyClamp / lum;

  vec3 sampleIrr = direct + indirect;

  // --- traced specular: mirror/glossy reflections on metals ---
  if (uReflEnabled && metal > 0.001) {
    vec3 V = normalize(P - uCameraPos);
    vec3 refl = glossyReflect(V, N, rough);
    if (dot(refl, N) > 0.0) {
      // Metals have no diffuse term: replace by metalness. The composite's
      // albedo multiply then tints the reflection (F0 = albedo for metals).
      // analyticGlint adds the direct lights the reflection ray cannot see, so
      // a metal under a spotlight shows a proper (albedo-tinted) glint.
      vec3 reflRad = traceRadiance(P + N * uEps, refl, true) + analyticGlint(P, refl);
      sampleIrr = mix(sampleIrr, reflRad, metal);
    }
  }

  // --- traced glass: Fresnel reflection + two-interface refraction ---
  if (uRefrEnabled && transmission > 0.001) {
    vec3 V = normalize(P - uCameraPos);
    sampleIrr = mix(sampleIrr, glassRadiance(P, N, V, rough, ior), transmission);
  }

  // --- alpha blend: straight-through view continuation ---
  // A transparent surface is primary-visible in the G-buffer but was kept out of
  // the BVH, so a ray along the view direction passes THROUGH it to whatever is
  // behind. Trace that continuation and shade it like a glass/GI hit (emitters
  // keep their emission — this is direct visibility through the pane — sky/env on
  // a miss). The two quantities live at DIFFERENT scales: sampleIrr is the
  // pane's own demodulated surface light (composite re-applies albedo), while
  // the behind trace is final outgoing radiance — mixing them in one slot makes
  // the pane term drown out what shows through. So the behind image rides the
  // SPECULAR attachment instead (composite adds that buffer without the albedo
  // multiply, and its short-history accumulation suits behind-content that
  // parallaxes against the pane), and CompositePass performs the opacity blend
  // where the pane's albedo is actually available. sampleIrr keeps only the
  // pane's own surface lighting, which is static on the surface and accumulates
  // with normal full-length history.
  // (The straight-through trace itself happens at the unified secondary-ray
  // call site above — see the Metal call-site-count note there.)

  // A single NaN/Inf sample would poison the EMA history for good (mix() with
  // NaN stays NaN until a disocclusion resets the pixel) — sanitize first.
  if (any(isnan(sampleIrr)) || any(isinf(sampleIrr))) sampleIrr = vec3(0.0);

  // Fresh dielectric direct specular for this frame. Metals/glass carry their
  // (albedo-tinted) specular in the reflection path above, so scale their share
  // out of the white buffer — the effective F0 is mix(0.04, albedo, metal),
  // split across the two buffers. The separate SpecularAccumPass reprojects and
  // temporally accumulates this with a short (near-mirror) history.
  // Blend pixels repurpose this attachment for the straight-through behind
  // radiance (see above) — their dielectric highlight is dropped, a fair trade
  // for a correct-scale see-through image.
  vec3 spec = blend ? blendBehind : gSpec * ((1.0 - metal) * (1.0 - transmission));
  if (any(isnan(spec)) || any(isinf(spec))) spec = vec3(0.0);
  if (!blend) {
    float specLum = dot(spec, vec3(0.299, 0.587, 0.114));
    float specCap = uFireflyClamp * 4.0; // narrow lobes spike; keep the EMA stable
    if (specLum > specCap) spec *= specCap / specLum;
  }
  outSpecular = vec4(spec, 1.0);

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
        // Plane-distance test: robust at grazing angles (position error from
        // texel quantization lies along the surface, not along the normal).
        float distToCam = distance(P, uCameraPos);
        float tol = 0.005 * distToCam + 20.0 * uEps;
        bool valid = prevPos.w > 0.5
          && abs(dot(P - prevPos.xyz, N)) < tol;
        if (valid) {
          vec4 h = texture(uPrevAccum, prevUv); // bilinear
          // Mirror-like pixels keep a SHORT history: their reflected content
          // moves differently from the surface, so long history smears the
          // reflection under camera motion — and specular rays are nearly
          // deterministic, so they don't need the accumulation anyway.
          float specHist = max(metal, transmission) * (1.0 - rough);
          // (Blend pixels need no shortening here: this slot holds only the
          // pane's own surface light, which is static on the surface. The
          // parallaxing behind-image rides the specular attachment, whose
          // accumulation is short-history by design.)
          float histCap = mix(uMaxHistory, min(uMaxHistory, 10.0), specHist);
          count = clamp(h.a, 0.0, histCap) + 1.0;
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

// Specular accumulation: the lighting pass emits FRESH dielectric specular in
// MRT attachment 1 (it has no spare sampler to read its own specular history).
// This second, cheap program reprojects that fresh sample against the previous
// accumulated specular and EMA-blends it — the same temporal scheme as the
// irradiance buffer, but with the SHORT (near-mirror) history a view-dependent
// highlight needs so it tracks moving lights and the camera without smearing.
const specAccumFrag = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 outSpec;

in vec2 vUv;

uniform sampler2D uFreshSpec;
uniform sampler2D uPrevSpec;
uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform vec3 uCameraPos;
uniform float uEps;
uniform float uMaxHistory;
uniform bool uTemporalReprojection;

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) { outSpec = vec4(0.0); return; }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  float rough = clamp(wp.w - 1.0, 0.0, 1.0);
  vec3 fresh = texture(uFreshSpec, vUv).rgb;

  float count = 1.0;
  vec3 history = vec3(0.0);
  if (uTemporalReprojection) {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clip.w > 0.0 && clipC.w > 0.0) {
      vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
      vec2 currUv = (clipC.xy / clipC.w) * 0.5 + 0.5;
      prevUv -= currUv - vUv; // cancel the G-buffer texel sub-pixel offset
      if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
        vec4 prevPos = texture(uPrevGWorldPos, prevUv);
        float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
        if (prevPos.w > 0.5 && abs(dot(P - prevPos.xyz, N)) < tol) {
          vec4 h = texture(uPrevSpec, prevUv);
          // Short history: specular is view-dependent, so a long EMA smears the
          // highlight under motion. Smoother (sharper) highlights react fastest.
          float specHist = 1.0 - rough;
          float histCap = mix(min(uMaxHistory, 32.0), min(uMaxHistory, 8.0), specHist);
          count = clamp(h.a, 0.0, histCap) + 1.0;
          history = h.rgb;
        }
      }
    }
  }

  vec3 blended = mix(history, fresh, 1.0 / count);
  if (any(isnan(blended)) || any(isinf(blended))) blended = vec3(0.0);
  outSpec = vec4(blended, count);
}
`;

// Irradiance-history carry for renderScale/canvas resizes. The shared CopyPass
// writes ONE output; rendering it into the 2-attachment MRT is a draw-buffer
// mismatch that some drivers (ANGLE/D3D11) reject with INVALID_OPERATION. This
// 2-output copy matches the MRT: attachment 0 = resampled history (alpha/count
// clamped), attachment 1 = 0 (fresh-written next frame anyway).
const mrtCarryFrag = /* glsl */ `
precision highp float;
layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uCountClamp;
void main() {
  vec4 c = texture(uTex, vUv);
  if (uCountClamp >= 0.0) c.a = min(c.a, uCountClamp);
  o0 = c;
  o1 = vec4(0.0);
}
`;

/**
 * Fullscreen pass: for every G-buffer pixel, trace shadow rays to every light and
 * one cosine-weighted GI bounce against the BVH. Outputs demodulated irradiance,
 * progressively accumulated into a ping-pong float target while the camera is still.
 *
 * The target is a 2-attachment MRT: [0] demodulated diffuse irradiance,
 * [1] FRESH dielectric direct specular (temporally accumulated by specAccumFrag
 * into a second ping-pong pair, specA/specB).
 */
export class RTLightingPass {
  // `specMRT: false` is the WebKit fallback: iOS Safari (every iOS browser)
  // silently fails the 2-attachment half-float MRT draw — the whole lighting
  // pass renders black. RealtimeRaytracer probes this functionally at
  // construction; in fallback mode this pass allocates a single-attachment
  // target exactly like 0.3.x, the shader's second output collapses to a dead
  // local variable, and render() returns { specular: null } (the caller then
  // runs with specular off; blend surfaces degrade to opaque as documented).
  constructor(width, height, { specMRT = true } = {}) {
    this.specMRT = specMRT;
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);
    // Accumulated specular history (ping-pong), fed by the fresh specular in
    // targetA/B attachment 1.
    this.specA = specMRT ? this._makeSpecTarget(width, height) : null;
    this.specB = specMRT ? this._makeSpecTarget(width, height) : null;

    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: specMRT
        ? rtLightingFrag
        : rtLightingFrag.replace(
            "layout(location = 1) out vec4 outSpecular;",
            "vec4 outSpecular; // single-target fallback: dead store"
          ),
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
        uReservoir: { value: null },
        uRestirEnabled: { value: false },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uViewProj: { value: new THREE.Matrix4() },
        uCameraPos: { value: new THREE.Vector3() },
        uMaxHistory: { value: 128 },
        uTemporalReprojection: { value: true },
        uFireflyClamp: { value: 4.0 },
        uLightPosType: { value: [] },
        uLightColorRadius: { value: [] },
        uLightDirCone: { value: [] },
        uLightCount: { value: 0 },
        uEmissiveCount: { value: 0 },
        uEmissiveCDF: { value: true },
        uReflEnabled: { value: true },
        uRefrEnabled: { value: true },
        uBlendEnabled: { value: true },
        uIor: { value: 1.5 },
        uLightStochastic: { value: false },
        uGIHalfRate: { value: false },
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

    // Specular temporal accumulation program (its own sampler budget — well
    // clear of the lighting pass's 16-sampler ceiling).
    this.specMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: specAccumFrag,
      uniforms: {
        uFreshSpec: { value: null },
        uPrevSpec: { value: null },
        uGWorldPos: { value: null },
        uGNormalMetal: { value: null },
        uPrevGWorldPos: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uViewProj: { value: new THREE.Matrix4() },
        uCameraPos: { value: new THREE.Vector3() },
        uEps: { value: 1e-3 },
        uMaxHistory: { value: 128 },
        uTemporalReprojection: { value: true },
      },
      depthTest: false,
      depthWrite: false,
    });

    // 2-output history carry (see mrtCarryFrag) — matches the MRT's draw
    // buffers. In single-target fallback the second output collapses the same
    // way as the lighting shader's.
    this.carryMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: specMRT
        ? mrtCarryFrag
        : mrtCarryFrag.replace(
            "layout(location = 1) out vec4 o1;",
            "vec4 o1; // single-target fallback: dead store"
          ),
      uniforms: { uTex: { value: null }, uCountClamp: { value: -1 } },
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
    // so fp16 precision is sufficient). Two attachments: [0] irradiance,
    // [1] fresh dielectric specular — or a single attachment in the WebKit
    // fallback (see the constructor note).
    const opts = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };
    if (!this.specMRT) {
      const t = new THREE.WebGLRenderTarget(width, height, opts);
      t.texture.generateMipmaps = false;
      return t;
    }
    const t = new THREE.WebGLMultipleRenderTargets(width, height, 2, opts);
    for (const tex of t.texture) tex.generateMipmaps = false;
    return t;
  }

  // The accumulated-irradiance texture of a history target, either layout.
  _irrTex(target) {
    return this.specMRT ? target.texture[0] : target.texture;
  }

  _makeSpecTarget(width, height) {
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
    for (const t of [this.targetA, this.targetB, this.specA, this.specB]) {
      if (!t) continue; // spec pair is absent in the single-target fallback
      renderer.setRenderTarget(t);
      renderer.clear(true, false, false);
    }
    renderer.setRenderTarget(prevTarget);
    renderer.setClearColor(prevColor, prevAlpha);
  }

  setSize(width, height) {
    this.targetA.setSize(width, height);
    this.targetB.setSize(width, height);
    if (this.specA) this.specA.setSize(width, height);
    if (this.specB) this.specB.setSize(width, height);
  }

  /**
   * Reallocate the history targets to a new size while PRESERVING the
   * accumulated irradiance. The plain setSize + clearHistory path dumps every
   * temporal sample, which strobes the image back to 1-spp noise on every
   * governor renderScale step — this carries the history over instead.
   *
   * The freshest history is targetB (last frame's output — see the swap in
   * render()); it is resampled through copyPass into the new targetB, its
   * per-pixel sample count (alpha) clamped to `carryFrames` so the EMA
   * reconverges smoothly at the new resolution rather than freezing on stale
   * values. targetA is overwritten on the next render, so it only needs the
   * fresh allocation, not a copy.
   */
  resizeCarry(renderer, copyPass, width, height, carryFrames) {
    const newA = this._makeTarget(width, height);
    const newB = this._makeTarget(width, height);
    // Carry the irradiance history (attachment 0) with the 2-output carry
    // material so the draw matches the MRT's draw buffers (a 1-output CopyPass
    // blit here is INVALID_OPERATION on ANGLE/D3D11). Attachment 1 is fresh-
    // written every frame, so it needs no carry.
    this.carryMaterial.uniforms.uTex.value = this._irrTex(this.targetB);
    this.carryMaterial.uniforms.uCountClamp.value = carryFrames;
    this.quad.material = this.carryMaterial;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(newB);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(prev);
    this.quad.material = this.material;
    this.targetA.dispose();
    this.targetB.dispose();
    this.targetA = newA;
    this.targetB = newB;

    // Specular history carries the same way (freshest is specB — see render()).
    if (this.specMRT) {
      const newSpecA = this._makeSpecTarget(width, height);
      const newSpecB = this._makeSpecTarget(width, height);
      copyPass.blit(renderer, this.specB.texture, newSpecB, carryFrames);
      this.specA.dispose();
      this.specB.dispose();
      this.specA = newSpecA;
      this.specB = newSpecB;
    }
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
    u.uLightDirCone.value = compiled.lightDirCone;
    u.uLightCount.value = compiled.lightCount;
    u.uEmissiveCount.value = compiled.emissiveTriCount;
  }

  /**
   * Renders lighting into targetA (reading targetB as irradiance history), then
   * accumulates the fresh specular (targetA attachment 1) into specA (reading
   * specB as history). Swaps both ping-pong pairs. Returns { irradiance,
   * specular } textures for this frame.
   */
  render(renderer, gbuffer, frame, reservoirTexture = null) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    u.uPrevAccum.value = this._irrTex(this.targetB);
    u.uReservoir.value = reservoirTexture;
    u.uRestirEnabled.value = reservoirTexture !== null;
    u.uFrame.value = frame;

    // 1. lighting (MRT): [0] accumulated irradiance, [1] fresh specular.
    this.quad.material = this.material;
    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);

    // 2. specular temporal accumulation: fresh (targetA[1]) + history (specB).
    // Skipped entirely in the single-target fallback — there is no fresh
    // specular attachment to accumulate.
    let outSpec = null;
    if (this.specMRT) {
      const su = this.specMaterial.uniforms;
      su.uFreshSpec.value = this.targetA.texture[1];
      su.uPrevSpec.value = this.specB.texture;
      su.uGWorldPos.value = gbuffer.worldPos;
      su.uGNormalMetal.value = gbuffer.normalMetal;
      su.uPrevGWorldPos.value = gbuffer.prevWorldPos;
      su.uPrevViewProj.value.copy(u.uPrevViewProj.value);
      su.uViewProj.value.copy(u.uViewProj.value);
      su.uCameraPos.value.copy(u.uCameraPos.value);
      su.uEps.value = u.uEps.value;
      su.uMaxHistory.value = u.uMaxHistory.value;
      su.uTemporalReprojection.value = u.uTemporalReprojection.value;
      this.quad.material = this.specMaterial;
      renderer.setRenderTarget(this.specA);
      renderer.render(this.scene, this.camera);
      outSpec = this.specA.texture;
    }

    this.quad.material = this.material; // restore for the next caller
    renderer.setRenderTarget(null);

    const outIrr = this._irrTex(this.targetA);
    [this.targetA, this.targetB] = [this.targetB, this.targetA];
    if (this.specMRT) [this.specA, this.specB] = [this.specB, this.specA];
    return { irradiance: outIrr, specular: outSpec };
  }

  dispose() {
    this.targetA.dispose();
    this.targetB.dispose();
    if (this.specA) this.specA.dispose();
    if (this.specB) this.specB.dispose();
    this.material.dispose();
    this.specMaterial.dispose();
    this.carryMaterial.dispose();
    this.quad.geometry.dispose();
  }
}
