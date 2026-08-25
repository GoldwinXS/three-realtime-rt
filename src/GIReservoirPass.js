import * as THREE from "three";
import { LIGHTING_RECT_GLSL, rectUniforms, setRectUniforms, setTargetRect } from "./lightingRect.js";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { MAX_LIGHTS, clampMaxLights } from "./SceneCompiler.js";
import { SKY_GLSL } from "./sky.glsl.js";
import { BVH_ANY_HIT_GLSL } from "./bvhAnyHit.glsl.js";
import { makeMRT } from "./mrtCompat.js";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// ReSTIR GI (EXPERIMENTAL) — temporal-only reservoir reuse of the 1-bounce GI
// path. This standalone pass owns its OWN sampler budget (the lighting pass is
// already AT the WebGL2 16-sampler minimum and cannot take another), and shades
// GI-bounce hits IDENTICALLY to RTLightingPass.traceRadiance so the mean equals
// the inline path. See the estimator derivation in main() below.
//
// The GI-hit shading below is duplicated (not shared via include) from
// RTLightingPass ON PURPOSE: the inline path must stay byte-identical when
// restirGI is off, so RTLightingPass is left completely untouched. The specular
// (gWantSpec) accumulation is dropped here — GI bounces never contribute to the
// primary-surface highlight buffer — but every quantity that affects the
// RETURNED radiance is copied faithfully (RNG scheme, cosine sampling, two-level
// BVH trace, one-light NEE incl. emissive importance sampling + the near-emitter
// firefly clamp, sky/env on a miss).
const giFrag = /* glsl */ `
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${shaderStructs}
${shaderIntersectFunction}
${BVH_ANY_HIT_GLSL}
${SKY_GLSL}

#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE
#define PI 3.14159265358979

${LIGHTING_RECT_GLSL}
// The ACTIVE lighting rect in texels (see lightingRect.js): the reservoir
// targets are allocated at the renderScale cap, so textureSize() is not it.
uniform vec2 uLightRes;

// MRT: [0] reservoir hit position + packed(M, oct-normal) (fp32),
//      [1] reservoir radiance + W,
//      [2] resolved demodulated GI irradiance (consumed by the denoise add).
layout(location = 0) out vec4 outResPos;
layout(location = 1) out vec4 outResRad;
layout(location = 2) out vec4 outGI;

in vec2 vUv;

// Two-level BVH + per-vertex attribute textures (normal.xyz + materialIndex.w),
// exactly as RTLightingPass binds them. 8 samplers (4 per BVH struct) + 2 attr.
uniform BVH bvhStatic;
uniform BVH bvhDynamic;
uniform bool uHasDynamic;
uniform sampler2D uAttrStatic;
uniform sampler2D uAttrDynamic;
uniform sampler2D uMaterialsTex;   // materials + emissive NEE tris + blue noise + power CDF

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;

// Temporal reuse: reproject through last frame's G-buffer (plane-distance
// validation, same as the lighting pass) and pull last frame's reservoir.
uniform sampler2D uPrevGWorldPos;
uniform sampler2D uPrevResPos;     // history attachment 0: hitPos.xyz + M
uniform sampler2D uPrevResRad;     // history attachment 1: radiance.rgb + W
uniform mat4 uPrevViewProj;

// THE LIGHT TABLE lives in one row of uMaterialsTex (row = uLightRow), 4 texels
// per seat: see SceneCompiler's layout comment. Until 0.16.0 these were three
// vec4[MAX_LIGHTS] uniform arrays, which is what capped a scene at 32 lights.
uniform int uLightRow;
vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); } // spot: direction.xyz + cos(outer)
uniform int uLightCount;
uniform int uEmissiveCount;
uniform bool uEmissiveCDF;

uniform vec3 uCameraPos;
uniform float uFrame;
uniform float uEps;
uniform float uFireflyClamp;
uniform float uMCap;        // temporal M-cap (staleness limit)
uniform int uSpatialTaps;   // spatial reuse taps after the temporal merge (0 = v1)
uniform int uValidateInterval; // reservoir-sample validation period (0 = off, e.g. 8)
// Resolve-stage tuning, exposed so the artifact study can sweep them (see the
// resolve block at the end of main()). Defaults reproduce the shipped values:
//   uResolveAlpha 0.15  weight of THIS frame's resolve in the resolve EMA
//   uConfLow      0.30  firefly-clamp multiplier at zero reservoir confidence
uniform float uResolveAlpha;
uniform float uConfLow;
// RAO-BLACKWELLIZED RESOLVE COLOUR (default ON; false = the pre-fix path).
// See the "resolve colour" derivation above the resolve block in main().
uniform bool uChromaMean;
// VISIBILITY POLICY (default ON; false = the pre-fix path). See the final-
// visibility block in main().
uniform bool uVisFallback;

// Validation tuning (see the reservoir-sample-validation block in main()).
// VAL_NEE_SAMPLES: NEE samples averaged when RE-SHADING the stored hit. A single
//   NEE sample is black whenever its random light point is occluded (~30% of the
//   time even for a fully-lit hit), so a 1-sample re-shade cannot tell "light off"
//   from "unlucky shadow ray"; averaging a few de-noises the kill decision. Costs
//   a few extra SHADOW rays on only the ~1/uValidateInterval validating pixels (no
//   extra bounce rays -- the single candidate trace is reused).
// VAL_DARK_FRAC: kill the reservoir when the (multi-sampled) re-shaded target
//   falls below this fraction of the stored one. Kept LOW so the kill fires on a
//   real collapse to near-black (a switched-off light drives it to ~0), not on
//   residual shadow noise -- false kills reset pixels to low confidence, where the
//   pre-existing anti-firefly clamp tightens and would darken bright GI.
#define VAL_NEE_SAMPLES 8
#define VAL_DARK_FRAC 0.02

uniform vec3 uEnvColor;
uniform float uEnvIntensity;
uniform bool uSkyEnabled;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSkyIntensity;

// ---------- RNG (identical scheme to RTLightingPass) ----------
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
  vec4 shift = fract(float(uFrame) * vec4(0.6180340, 0.7548777, 0.5698403, 0.8191725));
  return fract(bn + shift);
}

// Named rtLum, NOT luminance: three r166+ prepends its own rtLum(vec3)
// to every non-raw ShaderMaterial fragment shader, and GLSL treats a second
// (vec3) body as a redefinition — the whole program fails to compile.
float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// CHROMATICITY: a radiance divided by its own luminance, so rtLum(chromaOf(c))
// is exactly 1 and a weighted mean of chromaticities is again a chromaticity.
// This is the axis the resolve's noise actually lives on — see the resolve
// derivation in main(). Zero-luminance samples carry zero RIS weight and never
// reach the mean, so the fallback value is arbitrary.
vec3 chromaOf(vec3 c) {
  float l = rtLum(c);
  return l > 1e-8 ? c / l : vec3(1.0);
}

// ---------- reservoir .w bit-packing: M (8 bit) + oct-normal (12+12 bit) ------
// The RGBA32F reservoir-position attachment is at the pass's hard 16-sampler
// ceiling, so the reconnection normal n_s (needed by the spatial Jacobian) is
// bit-packed into the SAME .w channel that holds M. fp32 + NEAREST round-trips
// the bits exactly. Layout: (uint(M)&0xFF)<<24 | octX12<<12 | octY12. M caps at
// 255 (clamped on write). 12 bits/axis is ample for a cosine-weighted normal.
vec2 signNotZero(vec2 v) {
  return vec2(v.x >= 0.0 ? 1.0 : -1.0, v.y >= 0.0 ? 1.0 : -1.0);
}
void octEncode12(vec3 n, out uint ox, out uint oy) {
  n /= (abs(n.x) + abs(n.y) + abs(n.z));
  vec2 e = n.z >= 0.0 ? n.xy : (1.0 - abs(n.yx)) * signNotZero(n.xy);
  vec2 u = clamp(e * 0.5 + 0.5, 0.0, 1.0);
  ox = uint(u.x * 4095.0 + 0.5) & 0xFFFu;
  oy = uint(u.y * 4095.0 + 0.5) & 0xFFFu;
}
vec3 octDecode12(uint ox, uint oy) {
  vec2 e = vec2(float(ox), float(oy)) / 4095.0 * 2.0 - 1.0;
  vec3 v = vec3(e.xy, 1.0 - abs(e.x) - abs(e.y));
  if (v.z < 0.0) v.xy = (1.0 - abs(v.yx)) * signNotZero(v.xy);
  return normalize(v);
}
// Pack M (clamped to [0,126]) + hit normal into a single fp32 word.
// M's ceiling is 126, NOT 255: bits 30..23 of the packed word are the float's
// exponent field, and if they are ever all-ones (M lower bits all 1 AND
// octX >= 2048) the word is a NaN/Inf bit pattern — some GPUs CANONICALIZE
// NaNs on texture write, silently destroying the payload. M <= 126 keeps at
// least one exponent bit zero, so the pattern is unrepresentable by
// construction. (126 is far above any practical restirGIMCap.)
float packMN(float M, vec3 n) {
  uint ox, oy;
  octEncode12(n, ox, oy);
  uint mi = uint(clamp(M, 0.0, 126.0)) & 0xFFu;
  return uintBitsToFloat((mi << 24) | (ox << 12) | oy);
}
void unpackMN(float w, out float M, out vec3 n) {
  uint packed = floatBitsToUint(w);
  M = float((packed >> 24) & 0xFFu);
  n = octDecode12((packed >> 12) & 0xFFFu, packed & 0xFFFu);
}

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

// ---------- two-level BVH helpers (copied verbatim) ----------
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

// >>> RT_TEXTURE_TILES
uniform bool uHasTextureTiles;

void fetchAttrUv(sampler2D attrTex, vec3 bary, uvec3 verts, out vec4 attr, out vec2 uv) {
    uint width = uint(textureSize(attrTex, 0).x);
    uint i0 = verts.x * 2u;
    uint i1 = verts.y * 2u;
    uint i2 = verts.z * 2u;
    vec4 a0 = texelFetch(attrTex, ivec2(i0 % width, i0 / width), 0);
    vec4 a1 = texelFetch(attrTex, ivec2(i1 % width, i1 / width), 0);
    vec4 a2 = texelFetch(attrTex, ivec2(i2 % width, i2 / width), 0);
    attr = a0 * bary.x + a1 * bary.y + a2 * bary.z;
    vec2 uv0 = texelFetch(attrTex, ivec2((i0 + 1u) % width, (i0 + 1u) / width), 0).xy;
    vec2 uv1 = texelFetch(attrTex, ivec2((i1 + 1u) % width, (i1 + 1u) / width), 0).xy;
    vec2 uv2 = texelFetch(attrTex, ivec2((i2 + 1u) % width, (i2 + 1u) / width), 0).xy;
    uv = uv0 * bary.x + uv1 * bary.y + uv2 * bary.z;
}

#define TILE 128.0

vec4 tileSample(float tileIdx, vec2 st) {
    vec2 fuv = fract(st) * TILE - 0.5;
    vec2 f0 = floor(fuv);
    vec2 f1 = f0 + 1.0;
    f0 = mod(f0, TILE);
    f1 = mod(f1, TILE);
    float rowBase = 70.0 + tileIdx * TILE;
    vec4 s00 = texelFetch(uMaterialsTex, ivec2(int(f0.x), int(rowBase + f0.y)), 0);
    vec4 s10 = texelFetch(uMaterialsTex, ivec2(int(f1.x), int(rowBase + f0.y)), 0);
    vec4 s01 = texelFetch(uMaterialsTex, ivec2(int(f0.x), int(rowBase + f1.y)), 0);
    vec4 s11 = texelFetch(uMaterialsTex, ivec2(int(f1.x), int(rowBase + f1.y)), 0);
    vec2 t = fuv - f0;
    return mix(mix(s00, s10, t.x), mix(s01, s11, t.x), t.y);
}
// <<< RT_TEXTURE_TILES

// ---------- one-light NEE at a GI-bounce hit (specular dropped) ----------
float spotFalloff(int i, vec3 lightToP) {
  vec4 posType = lightPosType(i);
  if (posType.w < 1.5) return 1.0;
  vec4 dc = lightDirCone(i);
  return smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, lightToP));
}

vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = lightPosType(i);
  vec4 colRad = lightColorRadius(i);
  vec3 L;
  float dist2 = 1.0;
  float maxDist = 1e7;
  float cone = 1.0;
  if (posType.w < 0.5 || posType.w >= 1.5) {
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
    L = normalize(-posType.xyz + randUnitVector() * colRad.w);
    dist2 = 1.0;
  }
  float NdotL = dot(N, L);
  if (NdotL <= 0.0) return vec3(0.0);
  if (occluded(P + N * uEps, L, maxDist)) return vec3(0.0);
  return colRad.rgb * (cone / dist2) * NdotL;
}

vec3 sampleOneLight(vec3 P, vec3 N) {
  if (uLightCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
  return lightContribution(i, P, N) * float(uLightCount);
}

vec3 sampleEmissiveTri(vec3 P, vec3 N) {
  if (uEmissiveCount == 0) return vec3(0.0);
  int idx;
  float invProb;
  if (uEmissiveCDF) {
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
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(i, 1), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(i + 1, 1), 0);
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(i + 2, 1), 0);
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(i + 3, 1), 0);
  vec2 u = rand2();
  if (u.x + u.y > 1.0) u = 1.0 - u;
  vec3 lp = t0.xyz + t1.xyz * u.x + t2.xyz * u.y;
  vec3 d = lp - P;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;
  float cosS = dot(N, wi);
  float cosL = abs(dot(t3.xyz, wi));
  if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
  if (occluded(P + N * uEps, wi, dist)) return vec3(0.0);
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * invProb * t0.w / max(d2, 1e-6));
  float eLum = dot(e, vec3(0.299, 0.587, 0.114));
  float eCap = uFireflyClamp * 2.0;
  if (eLum > eCap) e *= eCap / eLum;
  return e;
}

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

// Incoming radiance along rd for a DIFFUSE GI bounce (specular=false in the
// inline path), plus the world-space hit position so temporal reuse can
// recompute the geometry term at the reprojected (same) surface. On a miss the
// "hit" is a far point along the ray, so the reused direction is recoverable.
// nLight = number of averaged NEE samples at the bounce hit. The fresh candidate
// passes 1 (byte-identical to the inline path). The reservoir-sample VALIDATION
// passes a small number > 1: a single NEE sample is black whenever its random
// light point is occluded, which happens ~30% of the time even for a fully-lit
// hit, so a 1-sample re-shade cannot reliably tell "light switched off" from
// "unlucky shadow sample". Averaging a few NEE samples de-noises pHatNew enough to
// make the validation kill decision robust, at the cost of a few extra shadow rays
// on only the ~1/uValidateInterval validating pixels (no extra BOUNCE rays).
vec3 traceRadianceGI(vec3 ro, vec3 rd, int nLight, out vec3 hitPos, out vec3 hitNormal) {
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (!traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    hitPos = ro + rd * 1.0e4;
    // Sky "hit" has no surface; face the normal back along the ray so a
    // neighbour reconnecting to this point sees a sane, positive cosPhi.
    hitNormal = -rd;
    return uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  vec4 attr = isDyn
    ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
    : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
// >>> RT_TEXTURE_TILES
  // Re-fetch at stride 2 and get the interpolated UV for tile sampling.
  // Branch explicitly: GLSL forbids ternaries on opaque types (samplers).
  vec2 _tileUv;
  if (isDyn) {
    fetchAttrUv(uAttrDynamic, bary, fi.xyz, attr, _tileUv);
  } else {
    fetchAttrUv(uAttrStatic, bary, fi.xyz, attr, _tileUv);
  }
// <<< RT_TEXTURE_TILES
  vec3 hAlbedo; float hRough; vec3 hEmissive; float hMetal;
  fetchMaterial(attr.w, hAlbedo, hRough, hEmissive, hMetal);
// >>> RT_TEXTURE_TILES
  if (uHasTextureTiles) {
    vec4 _ti = texelFetch(uMaterialsTex, ivec2(int(round(attr.w)), 69), 0);
    float _albedoTile = _ti.x;
    float _emissiveTile = _ti.y;
    if (_albedoTile >= 0.0) hAlbedo *= tileSample(_albedoTile, _tileUv).rgb;
    if (_emissiveTile >= 0.0) hEmissive *= tileSample(_emissiveTile, _tileUv).rgb;
  }
// <<< RT_TEXTURE_TILES
  vec3 hN = normalize(attr.xyz);
  if (dot(hN, rd) > 0.0) hN = -hN;
  vec3 hP = ro + rd * dist;
  hitPos = hP;
  hitNormal = hN;
  vec3 Ld = vec3(0.0);
  for (int s = 0; s < 8; s++) {
    if (s >= nLight) break;
    Ld += sampleOneAny(hP + hN * uEps, hN);
  }
  Ld /= float(max(nLight, 1));
  // Diffuse GI drops NEE-listed (static) emitter emission so it isn't double
  // counted (same rule as RTLightingPass.traceRadiance with specular=false).
  vec3 hLe = (uEmissiveCount > 0 && !isDyn) ? vec3(0.0) : hEmissive;
  return hLe + hAlbedo * Ld * (1.0 / PI);
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outResPos = vec4(0.0);
    outResRad = vec4(0.0);
    outGI = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 1471u + uint(px.y) * 8951u + uint(uFrame) * 23833u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  // ===================== ESTIMATOR DERIVATION =====================
  // The inline path stores, per pixel, the DEMODULATED indirect irradiance
  //     I = (1/PI) * integral_hemisphere L_i(w) (N.w) dw
  // as a single cosine-sampled sample: indirect = traceRadiance(cosine ray),
  // because with the cosine pdf p(w) = cos/PI the estimate L_i(w)/p * (cos/PI)
  // collapses to L_i(w). We reproduce the SAME quantity I via RIS.
  //
  //  - Candidate sample:  a hemisphere direction w (cosine-sampled), carrying
  //    the incoming radiance L_i(w) = traceRadianceGI(w) and its hit position.
  //  - Target function:   p_hat(w) = luminance( L_i(w) * cos(theta) ).
  //  - Source pdf:        p(w) = cos(theta)/PI  (cosine).
  //  - RIS candidate weight: w_i = p_hat / p = PI * luminance(L_i)  (cos cancels).
  //  - Reservoir picks y ~ p_hat; unbiased contribution weight
  //        W = wSum / (M * p_hat(y)).
  //  - Final estimate of I (integrand F(w) = L_i(w) cos(theta) / PI):
  //        <I> = F(y) * W = L_i(y) * cos(theta_y) / PI * W.
  //
  //  Sanity (M=1, no history):  W = w_1 / p_hat(y) = PI*lum(L)/(lum(L)*cos) =
  //  PI/cos, so <I> = L_i * cos/PI * PI/cos = L_i(y) — EXACTLY the inline
  //  single-sample estimate. Forcing uMCap=1 with a cleared history therefore
  //  makes this pass statistically identical to the legacy GI path.
  //
  //  The reservoir is the GI temporal integrator; its output is ADDED at the
  //  denoise stage, DOWNSTREAM of the lighting pass's own temporal accumulation,
  //  so this GI never re-enters (and double-counts through) that history.
  // ================================================================

  // Reprojected UV of this pixel's primary point into the previous frame; shared
  // by the reservoir-sample validation, the temporal merge and the spatial taps.
  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
  bool haveReproj = clip.w > 0.0 &&
    prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0;
  // Plane-distance tolerance the temporal validation and the spatial taps share.
  float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;

  // --- fetch this pixel's TEMPORAL-history reservoir ONCE. Both the reservoir-
  // sample validation (below) and the temporal merge read it. Texture reads
  // only, so this consumes no RNG: the fresh-candidate random stream stays
  // aligned with the validation-off path (uValidateInterval==0 is byte-identical
  // to before this feature). ---
  bool histValid = false;
  float Mprev = 0.0;
  float Wprev = 0.0;
  vec3 radPrev = vec3(0.0);
  vec3 hitPrev = vec3(0.0);
  vec3 nPrev = N;
  if (haveReproj) {
    vec4 pPos = texture(uPrevGWorldPos, prevUv);
    if (pPos.w > 0.5 && abs(dot(P - pPos.xyz, N)) < tol) {
      vec4 hp = texture(uPrevResPos, rectUv(prevUv));  // hitPos.xyz + packed(M, n_s)
      vec4 hr = texture(uPrevResRad, rectUv(prevUv));  // radiance.rgb + W
      unpackMN(hp.w, Mprev, nPrev);
      Wprev = hr.w;
      if (Mprev > 0.0 && Wprev > 0.0) {
        histValid = true;
        radPrev = hr.rgb;
        hitPrev = hp.xyz;
      }
    }
  }

  // --- RESERVOIR-SAMPLE VALIDATION (the fix for stale bounce light). On a
  // rotating 1-in-uValidateInterval subset of pixels — selected by a per-pixel
  // hash added to uFrame so the validating set is decorrelated in space AND
  // changes every frame — spend this frame's ONE candidate ray re-tracing the
  // STORED reservoir hit instead of a fresh cosine bounce. This costs ZERO extra
  // rays (it REPLACES the fresh candidate on those pixels) and is what stops a
  // switched-off light from haunting the reservoir: the stale bright sample gets
  // re-shaded (now dark) or, if its geometry moved, dropped. Direction selection
  // happens HERE, before the single trace below, so the trace call site is shared. ---
  uint pixHash = pcgHash(uint(px.x) * 2654435761u + uint(px.y) * 40503u + 1u);
  bool validateFrame = uValidateInterval > 0 &&
    ((uint(uFrame) + pixHash) % uint(uValidateInterval)) == 0u;

  vec3 wi;
  bool doValidate = false;
  float expectDist = 0.0;
  if (validateFrame && histValid) {
    vec3 dpv = hitPrev - P;
    expectDist = length(dpv);
    if (expectDist > 1e-5) {
      wi = dpv / expectDist;                    // aim the candidate AT the stored hit
      doValidate = true;
    }
  }
  if (!doValidate) {
    wi = cosineSampleHemisphere(N, rand2());     // fresh cosine-hemisphere GI bounce
  }

  // --- the SINGLE candidate trace. Validation reuses this exact call site (no
  // second trace is added to the shader); the trace already shades the hit. ---
  vec3 hitPos;
  vec3 hitNormal;
  int nLight = doValidate ? VAL_NEE_SAMPLES : 1;
  vec3 rad = traceRadianceGI(P + N * uEps, wi, nLight, hitPos, hitNormal);
  // Match the inline firefly clamp, which is applied to indirect (= L_i) so
  // the biased mean of the two paths agrees.
  float rl = rtLum(rad);
  if (rl > uFireflyClamp) rad *= uFireflyClamp / rl;

  float cosT = max(dot(N, wi), 0.0);

  float wSum;
  float M;
  vec3 selRad;
  vec3 selPos;
  vec3 selNormal;   // n_s of the selected sample (packed into .w)
  bool killStore = false;   // validation flags the STORED reservoir for reset
  // RIS-weight-weighted sum of the candidates' CHROMATICITIES, accumulated
  // beside wSum at every merge point (fresh candidate, temporal history,
  // spatial taps). chromaAcc / wSum is the expectation of the chromaticity the
  // stochastic selection below draws — the Rao-Blackwellized resolve colour.
  vec3 chromaAcc = vec3(0.0);
  bool selIsSpatial = false;   // did a SPATIAL tap win the selection?

  if (doValidate) {
    // On a validation pixel there is NO fresh exploration candidate this frame
    // (the ray was spent re-tracing the stored hit); the reservoir for THIS frame
    // is the temporal history alone (the merge below re-adds it, histValid stays
    // true so a valid pixel keeps showing its GI — no dropout, no darkening).
    // Documented ~1/uValidateInterval exploration reduction (12.5% at interval 8).
    wSum = 0.0;
    M = 0.0;
    selRad = vec3(0.0);
    selPos = P + N;
    selNormal = N;

    // Validation is KILL-only, and the kill hits only the STORED reservoir (next
    // frame), NOT this frame's displayed estimate. Re-shade the stored hit and, if
    // it is stale, mark the stored reservoir for reset so this pixel's fresh
    // candidate takes over next frame and the estimate tracks the current lighting.
    // Two staleness signals:
    //   (1) GEOMETRY changed — the re-traced hit distance no longer matches the
    //       stored one (a nearer occluder appeared, geometry moved, or the ray
    //       missed; a miss puts hitPos far down the ray, so it trips this too).
    //   (2) the target WENT DARK — the re-shaded radiance collapsed below a small
    //       fraction (VAL_DARK_FRAC) of the stored one (a light switched off). This
    //       is THE fix for stale bounce light.
    // Why kill-only, and why store-deferred: the reservoir stores a RIS-selected
    // sample whose radiance is BRIGHT-biased with a compensating small W
    // (gi_luminance = selRad*selCos/PI*W = wSum/(M*PI), so W is a purely geometric
    // 1/pdf term). Overwriting that bright radiance with a single average re-shade
    // sample, or rescaling W by the noisy luminance ratio, provably DARKENS the
    // mean (bright-selected pHatOld in the denominator) — the originally-specified
    // "refresh radiance + W *= clamp(pHatOld/pHatNew, 0.25, 4)" path was measured
    // to darken static GI ~25% at interval 8, so it is NOT used. Killing (dropping
    // the stale term so fresh candidates rebuild) is unbiased; deferring the kill
    // to the STORE keeps the displayed frame equal to validation-off, so even a
    // false kill from single-sample noise costs a little variance, not brightness.
    float valTol = max(0.02 * expectDist, 4.0 * uEps);
    float hitDist = length(hitPos - P);
    bool geomChanged = abs(hitDist - expectDist) > valTol;
    float pHatOld = rtLum(radPrev) * cosT;   // stored target at this pixel
    float pHatNew = rtLum(rad) * cosT;        // re-shaded target (current light)
    bool wentDark = pHatNew < VAL_DARK_FRAC * pHatOld;
    // KILL (drop the stale temporal term so this pixel's fresh candidates rebuild
    // from the current scene) on geometry change OR a collapse to near-black; leave
    // a still-valid sample UNTOUCHED so a static scene does not drift. A switched-
    // off light drives pHatNew -> 0 and trips wentDark. The kill only marks the
    // STORE (killStore); the displayed frame still uses the merged history.
    killStore = geomChanged || wentDark;
  } else {
    // --- normal fresh candidate: one cosine-hemisphere GI bounce, shaded inline.
    float pHatFresh = rtLum(rad) * cosT;
    // w = p_hat / p_source = p_hat / (cos/PI). cosT cancels; guard cosT==0.
    float wFresh = cosT > 0.0 ? pHatFresh * PI / cosT : 0.0;
    wSum = wFresh;
    M = 1.0;
    selRad = rad;
    selPos = hitPos;
    selNormal = hitNormal;
    chromaAcc = wFresh * chromaOf(rad);
  }

  // --- temporal reuse: merge the (possibly radiance-refreshed, or killed)
  // history. When the validation above KILLED the sample, histValid is false and
  // the merge is skipped -> the reservoir stays empty this frame. ---
  // emaPrevGi: last frame's resolved GI, RECONSTRUCTED from the previous
  // reservoir (all inputs already bound — no extra sampler). Reservoirs persist
  // WHICH sample matters, not a variance average: near emitters many samples
  // are legitimately bright and the per-frame selection churn reads as
  // flickering fireflies (the inline GI path hid the same variance inside the
  // lighting pass's deep EMA). The resolve below blends against this
  // reconstruction to restore that smoothing.
  vec3 emaPrevGi = vec3(0.0);
  bool emaPrevOk = false;
  if (histValid) {
    // Re-evaluate the target at the CURRENT surface (reconnect at the stored hit
    // point). Same world point P (validated), so no Jacobian.
    vec3 dp = hitPrev - P;
    float dl = length(dp);
    float cosPrev = dl > 1e-5 ? max(dot(N, dp / dl), 0.0) : 0.0;
    float pHatPrev = rtLum(radPrev) * cosPrev;
    float Mc = min(Mprev, uMCap);
    // Combine reservoirs: w = p_hat_current(sample) * W_prev * M_prev.
    float w = pHatPrev * Wprev * Mc;
    wSum += w;
    M += Mc;
    // radPrev already carries the RUNNING chromaticity (the store below writes
    // it back), so this one term folds the whole history into the mean with
    // exactly the weight the history has in wSum — no extra state, no sampler.
    chromaAcc += w * chromaOf(radPrev);
    if (w > 0.0 && rand() * wSum < w) {
      selRad = radPrev;
      selPos = hitPrev;
      selNormal = nPrev;
    }
    // Reconstruct last frame's resolve from this same sample (same W cap
    // and clamp as the live resolve, for a like-for-like EMA partner).
    vec3 pg = radPrev * (cosPrev / PI) * min(Wprev, 32.0);
    float pgl = rtLum(pg);
    if (pgl > uFireflyClamp) pg *= uFireflyClamp / pgl;
    // uResolveAlpha >= 1 means "no EMA" (the default), and the guard is exact
    // rather than cosmetic: mix(a, b, 1.0) evaluates a + 1.0*(b - a), which is
    // NOT b when a is orders of magnitude larger — precisely the firefly case
    // this reconstruction can produce. Skipping the blend entirely is the only
    // way alpha 1 provably returns the resolve untouched.
    if (uResolveAlpha < 1.0 && !any(isnan(pg)) && !any(isinf(pg))) {
      emaPrevGi = pg;
      emaPrevOk = true;
    }
  }

  // Snapshot the TEMPORAL-only reservoir. This — not the spatially-merged one — is
  // what gets STORED as history, exactly as v1 did. Spatial reuse below is terminal
  // (it only sharpens THIS frame's resolved GI output); it is deliberately NOT fed
  // back into the stored reservoir. The reconnection shift carries a small target
  // -function bias, and the high default M-cap's temporal feedback would amplify it
  // by ~1/(1-M/(M+1)) ≈ (M+1)x, so storing the merged reservoir makes the GI drift
  // frame-over-frame (dark in grazing views, blown out in steep ones). Keeping the
  // history temporal-only — the pattern the shipped direct-light ReSTIR uses, where
  // "history feeds back from the TEMPORAL stage only" — keeps it stable and
  // unbiased while still delivering the per-frame spatial variance reduction into
  // the denoiser. taps==0 leaves selRad/M/wSum untouched, so this is a no-op there.
  vec3 selRadT = selRad; vec3 selPosT = selPos; vec3 selNormalT = selNormal;
  float wSumT = wSum; float MT = M;
  vec3 chromaAccT = chromaAcc;

  // --- spatial reuse (v2): fused spatiotemporal, streamed RIS over K taps of the
  // PREVIOUS frame's reservoir textures around the reprojected UV. Each adopted
  // neighbour sample S = (hit x_s, hit normal n_s, radiance L_s) is reweighted by
  // the reconnection Jacobian |J| = (cosPhi_q/cosPhi_r)*(d_r^2/d_q^2). x_q is this
  // pixel's primary point; x_r is the NEIGHBOUR's primary point read from the
  // previous frame's gWorldPos. A final visibility ray (below) prevents leaks. ---
  if (haveReproj && uSpatialTaps > 0) {
    vec2 texel = 1.0 / uLightRes;
    for (int k = 0; k < 4; k++) {
      if (k >= uSpatialTaps) break;
      // Offset: radius uniform in [4, 20] lighting-res pixels, angle from RNG,
      // decorrelated per frame (gSeed carries uFrame; blue noise is frame-shifted).
      float ang = rand() * 2.0 * PI;
      float rad_px = mix(4.0, 20.0, rand());
      vec2 nUv = prevUv + vec2(cos(ang), sin(ang)) * rad_px * texel;
      // (a) neighbour uv in [0,1].
      if (nUv.x < 0.0 || nUv.x > 1.0 || nUv.y < 0.0 || nUv.y > 1.0) continue;
      // (b) plane-distance validation of the neighbour's PREVIOUS primary point
      // against q's plane (same tolerance as the temporal validation).
      vec4 nPrimary = texture(uPrevGWorldPos, nUv);   // x_r + validFlag
      if (nPrimary.w < 0.5 || abs(dot(P - nPrimary.xyz, N)) >= tol) continue;
      vec4 nhp = texture(uPrevResPos, rectUv(nUv));   // x_s + packed(M_r, n_s)
      vec4 nhr = texture(uPrevResRad, rectUv(nUv));   // L_s + W_r
      float Mr; vec3 nS;
      unpackMN(nhp.w, Mr, nS);
      float Wr = nhr.w;
      // (c) skip reservoirs with M == 0 or W <= 0.
      if (Mr <= 0.0 || Wr <= 0.0) continue;
      vec3 xS = nhp.xyz;
      vec3 Ls = nhr.rgb;
      vec3 xR = nPrimary.xyz;

      // Reconnection Jacobian for q adopting the neighbour's sample.
      float dq = length(xS - P);
      float dr = length(xS - xR);
      if (dq < 1e-5 || dr < 1e-5) continue;
      float cosPhiQ = max(dot(nS, normalize(P - xS)), 1e-4);
      float cosPhiR = max(dot(nS, normalize(xR - xS)), 1e-4);
      float J = (cosPhiQ / cosPhiR) * (dr * dr) / (dq * dq);
      J = clamp(J, 0.1, 10.0);   // grazing-angle firefly guard

      // Target function at q (same shape the pass already uses).
      float cosQ = max(dot(N, normalize(xS - P)), 0.0);
      float pHatQ = rtLum(Ls) * cosQ;
      // Invalid-shift reject: if the neighbour's hit x_s lies below q's shading
      // hemisphere (cosQ == 0) or carries no radiance, the reconnected target is
      // zero — the shift could never have produced this sample at q, so it must
      // NOT add confidence weight. Skipping the whole tap (not just its w) keeps
      // the M normalization honest; adding Mc here while w == 0 would inflate M
      // without wSum and systematically darken the GI. (The temporal path never
      // trips this — same surface point, always a valid, non-zero target.)
      if (pHatQ <= 0.0) continue;
      float Mc = min(Mr, uMCap);
      float w = pHatQ * J * Wr * Mc;
      wSum += w;
      M += Mc;
      chromaAcc += w * chromaOf(Ls);
      if (w > 0.0 && rand() * wSum < w) {
        selRad = Ls;
        selPos = xS;
        selNormal = nS;
        selIsSpatial = true;
      }
    }
  }

  // --- the TEMPORAL-only resolve. It is needed twice: as the STORE's W (below,
  // exactly as before) and as the visibility fallback (right after), so it is
  // formed here, before the merged one. Nothing about it changed. ---
  vec3 sdT = selPosT - P;
  float slT = length(sdT);
  float selCosT = slT > 1e-5 ? max(dot(N, sdT / slT), 0.0) : 0.0;
  float pHatSelT = rtLum(selRadT) * selCosT;
  float WT = (MT > 0.0 && pHatSelT > 0.0) ? wSumT / (MT * pHatSelT) : 0.0;

  // --- finalize OUTPUT: recompute p_hat(selected) at this surface from the
  // SPATIALLY-merged reservoir, form W, resolve the GI for this frame. ---
  vec3 sd = selPos - P;
  float sl = length(sd);
  float selCos = sl > 1e-5 ? max(dot(N, sd / sl), 0.0) : 0.0;
  float pHatSel = rtLum(selRad) * selCos;
  float W = (M > 0.0 && pHatSel > 0.0) ? wSum / (M * pHatSel) : 0.0;

  // --- final visibility: ONE any-hit occlusion ray from x_q toward x_s. If the
  // reconnection point is blocked the reused sample would leak light through a
  // wall, so it must not be shown. occluded() already trims 2*eps off maxDist to
  // avoid self-intersecting the far surface. The STORED reservoir keeps the
  // un-occluded W: the sample is real and may be visible to a neighbour, so each
  // pixel re-tests visibility from its own position. Storing the zeroed W instead
  // would bleed energy out of the reservoir over frames (spatial samples fail
  // visibility more often than temporal ones, and the zero would propagate to
  // neighbours), darkening the GI. ---
  // Gated on uSpatialTaps > 0: taps==0 has no reconnection to test and stays
  // byte-identical to v1.
  //
  // uVisFallback (default ON) fixes two things the original test got wrong:
  //   1. It tested the selected sample WHATEVER its origin. A TEMPORAL sample is
  //      visible by construction — same surface point, the ray that found it
  //      started here — so testing it can only produce FALSE rejections from ray
  //      epsilon at the reconnection point. Only a spatial adoption can pierce a
  //      wall, so only that is tested now; roughly half the pixels stop casting
  //      the ray at all, which is also where the fallback pays for itself.
  //   2. On rejection it zeroed the WHOLE pixel's estimate for the frame. That
  //      threw away the pixel's own ~M-frame temporal accumulation over one
  //      neighbour's failed reconnection, and since occlusion is geometry-
  //      correlated the zeros arrive in patches — a structured black-speckle
  //      source right where contact shadows are. Falling back to this pixel's
  //      TEMPORAL-only estimate rejects exactly the tainted term and keeps the
  //      untainted one; it is what taps==0 would have shown at that pixel.
  bool visFallback = false;
  float Wout = W;
  bool testVis = uSpatialTaps > 0 && Wout > 0.0 && sl > 1e-5 &&
    (!uVisFallback || selIsSpatial);
  if (testVis && occluded(P + N * uEps, sd / sl, sl)) {
    if (uVisFallback) visFallback = true; else Wout = 0.0;
  }
  // W cap: W ~ pi/cos for the cosine source pdf, so values beyond ~32 mean the
  // recomputed p_hat(selected) collapsed this frame (grazing cos after a camera
  // or normal change) while wSum still carries past-frame magnitudes — the
  // classic reservoir firefly. The inline GI path hid the same spikes inside
  // its deep temporal EMA; this resolve has no EMA downstream, so the spike
  // would live on screen for a whole frame (visibly on Metal/iOS). Capping W
  // trusts reconnection angles down to cos ~ 0.1 and slightly darkens grazing
  // GI beyond that — the standard ReSTIR trade.
  Wout = min(Wout, 32.0);

  vec3 gi = visFallback
    ? selRadT * (selCosT / PI) * min(WT, 32.0)
    : selRad * (selCos / PI) * Wout;   // demodulated indirect irradiance

  // ================= RESOLVE COLOUR (Rao-Blackwellization) =================
  // Substituting W back into the line above collapses it exactly:
  //     gi = selRad * selCos/PI * wSum/(M * rtLum(selRad) * selCos)
  //        = chromaOf(selRad) * wSum / (PI * M)
  // — the selCos cancels and the luminance cancels. So the resolve's LUMINANCE
  // is wSum/(PI*M), a running mean over the reservoir's whole M-frame history,
  // while its COLOUR is the chromaticity of ONE stochastically selected sample.
  // The two halves of the estimate have wildly different variance, and the
  // colour half is the artifact: measured at 37% chromaticity spread per pixel
  // on a converged Cornell box, it is a red/green confetti field that the
  // à-trous filter (whose edge-stopping weights are LUMINANCE-based, so it
  // cannot see the error to stop on it) averages into coarse coloured blotches.
  // rmse is blind to it — the MEAN colour is correct, which is the whole point.
  //
  // The fix is to replace the drawn chromaticity with its expectation under the
  // same RIS weights, chromaAcc/wSum, which is textbook Rao-Blackwellization:
  // identical mean, strictly lower variance, and here it removes essentially all
  // of the colour variance because the weights are exactly the selection
  // probabilities. It costs one vec3 multiply-add per merge point, no extra
  // storage, no extra sampler and no extra ray. rtLum(chromaOf(x)) == 1 and
  // rtLum is linear, so the weighted mean is itself a unit-luminance
  // chromaticity: rescaling by rtLum(gi) below preserves the resolved LUMINANCE
  // bit for bit, which is why every luminance-derived quantity in this pass
  // (p_hat, W, the merge weights, the validation ratio test) is untouched.
  if (uChromaMean) {
    float wsRB = visFallback ? wSumT : wSum;
    vec3 accRB = visFallback ? chromaAccT : chromaAcc;
    float giL = rtLum(gi);
    if (wsRB > 0.0 && giL > 0.0) gi = (accRB / wsRB) * giL;
  }
  // Confidence-weighted firefly clamp: a young reservoir (M small — fresh
  // pixels under camera motion, where the resolve EMA has no partner yet) is
  // one raw sample, and at the full clamp it reads as motion sparkle. Tighten
  // the cap for low-M pixels and relax it to the inline-path clamp as
  // confidence grows; converged pixels are untouched. Trades a few frames of
  // slightly dim GI on freshly revealed surfaces for a steady image in motion.
  float conf = clamp(M / uMCap, 0.0, 1.0);
  float cap = uFireflyClamp * mix(uConfLow, 1.0, conf);
  float gil = rtLum(gi);
  if (gil > cap) gi *= cap / gil;
  if (any(isnan(gi)) || any(isinf(gi))) gi = vec3(0.0);
  // Resolve EMA (see the emaPrevGi note above). OFF at the default alpha 1 —
  // emaPrevOk is only ever set when alpha < 1, so this whole blend is dead code
  // in the shipped configuration. It was added to damp near-emitter selection
  // churn, which the chromaticity mean above now removes at the source.
  if (emaPrevOk) gi = mix(emaPrevGi, gi, uResolveAlpha);

  // --- STORE the TEMPORAL-only reservoir as history (see snapshot note above).
  // Its W (WT) was resolved above, from the temporal-merged wSum/M, so the stored
  // W is valid for next frame's temporal AND spatial reuse. For taps==0 this is
  // exactly the v1 reservoir. A NaN sample is scrubbed so it can't poison the
  // history. ---
  // Carry the RUNNING chromaticity in the stored radiance. Only rtLum(selRadT)
  // is ever read back out of this field — by pHatPrev in the temporal merge, by
  // pHatQ in a neighbour's spatial tap, and by the validation ratio test — and
  // the rescale below preserves that luminance exactly, so the stored reservoir
  // is numerically the same reservoir it was before. What changes is that the
  // colour a neighbour or a future frame inherits is the accumulated mean rather
  // than one draw, which is what makes the Rao-Blackwellization recursive: the
  // single "chromaAcc += w * chromaOf(radPrev)" term above folds in the entire
  // history at exactly the weight the history carries in wSum.
  if (uChromaMean && wSumT > 0.0) {
    float lT = rtLum(selRadT);
    if (lT > 0.0) selRadT = (chromaAccT / wSumT) * lT;
  }
  if (any(isnan(selRadT)) || any(isinf(selRadT))) { selRadT = vec3(0.0); WT = 0.0; }

  // Validation store policy. The DISPLAYED gi above always used the merged history
  // (no dropout). The STORED reservoir, however, must be handled so validation
  // does not shift the temporal fixed point:
  //   - KEEP (valid sample): pass the previous reservoir through UNCHANGED. A
  //     validation frame carries no fresh candidate, so RE-DERIVING and re-storing
  //     the merged reservoir (M -> min(Mprev,cap), W recomputed) perturbs the
  //     recursion and was measured to darken the static estimate ~13-16%. Writing
  //     back the exact (hitPrev, radPrev, Wprev, Mprev) leaves the fixed point
  //     identical to validation-off, so a static scene does not drift.
  //   - KILL (stale sample): reset to empty so next frame's fresh cosine candidate
  //     rebuilds and the estimate tracks the current lighting.
  if (doValidate) {
    if (killStore) {
      selPosT = P + N; selRadT = vec3(0.0); selNormalT = N; MT = 0.0; WT = 0.0;
    } else {
      // KEEP: write the previous reservoir back verbatim (hitPrev, radPrev, nPrev,
      // Mprev, Wprev). A validation frame adds no fresh candidate, so re-deriving
      // and re-storing the merged reservoir (M -> min(Mprev,cap), W recomputed)
      // perturbs the temporal recursion and was measured to darken the static
      // estimate ~13-16%; a verbatim write-back keeps the fixed point identical to
      // validation-off.
      selPosT = hitPrev; selRadT = radPrev; selNormalT = nPrev; MT = Mprev; WT = Wprev;
    }
  }

  outResPos = vec4(selPosT, packMN(MT, selNormalT));
  outResRad = vec4(selRadT, WT);
  outGI = vec4(gi, 1.0);
}
`;

/**
 * EXPERIMENTAL ReSTIR GI (v2, fused spatiotemporal). Per-pixel reservoirs reuse
 * the 1-bounce GI sample across frames at the reprojected same-surface point,
 * then take K spatial taps (`restirGISpatialTaps`, default 2; 0 = exact v1
 * temporal-only behaviour) of the previous frame's reservoirs around that UV.
 * Runs at lighting resolution with its OWN sampler budget (16: 8 BVH + 2 attr +
 * 1 scene-data + gWorldPos + gNormalMetal + prevGWorldPos + 2 reservoir history),
 * independent of the lighting pass. render() returns a resolved, demodulated GI
 * irradiance texture whose mean matches the inline GI path (see main()).
 *
 * Spatial reuse applies the reconnection solid-angle->area Jacobian per adopted
 * neighbour and a final visibility ray at the reconnection point (anti-leak); the
 * hit normal n_s it needs is bit-packed into the reservoir-position .w alongside
 * M (the pass is at the 16-sampler ceiling and can add none). Taps are gated by
 * uv bounds, a plane-distance check of the neighbour's previous primary point,
 * and a non-empty reservoir, so it stays unbiased and does not leak.
 *
 * `restirGIValidate` (default 8, 0 = off) adds reservoir-sample validation: a
 * rotating 1-in-N subset of pixels re-aims its single candidate ray AT the stored
 * reservoir hit (instead of a fresh cosine bounce) and re-shades it; the reservoir
 * is KILLED (so fresh candidates rebuild) when the geometry moved or the re-shaded
 * target collapsed to near-black (a light switched off), and left untouched
 * otherwise, with the kill deferred to the store so a valid pixel never drops out.
 * It reuses the existing candidate trace (no extra bounce rays, no extra samplers)
 * and is the fix for stale bounce light: a switched-off light stops haunting the
 * reservoir instead of fading slowly. 0 is byte-identical to the pre-feature path.
 */
export class GIReservoirPass {
  constructor(width, height, { maxLights = MAX_LIGHTS } = {}) {
    this.maxLights = clampMaxLights(maxLights);
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);

    // Texture-tile variant: the giFrag source with RT_TEXTURE_TILES stripped.
    // Cached here so the strip runs once, not on every toggle.
    const giFragSized = giFrag.replace(/RT_MAX_LIGHTS_VALUE/g, String(this.maxLights));
    this._fragTiles = giFragSized;
    this._fragNoTiles = (function stripTag(src, tag) {
      const lines = src.split("\n");
      const out = [];
      let drop = false;
      for (const line of lines) {
        if (line.includes(">>> " + tag)) { drop = true; continue; }
        if (line.includes("<<< " + tag)) { drop = false; continue; }
        if (!drop) out.push(line);
      }
      return out.join("\n");
    })(giFragSized, "RT_TEXTURE_TILES");
    this._tilesData = false;
    this._tilesOn = false;

    this.material = new THREE.ShaderMaterial({
      // Stable program name for compile-failure self-diagnosis; a link failure
      // disables the experimental `restirGI` feature (falls back to inline GI).
      name: "rt:gi-reservoir",
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: giFragSized,
      uniforms: {
        bvhStatic: { value: null },
        bvhDynamic: { value: null },
        uHasDynamic: { value: false },
        uAttrStatic: { value: null },
        uAttrDynamic: { value: null },
        uMaterialsTex: { value: null },
        uGWorldPos: { value: null },
        uGNormalMetal: { value: null },
        uPrevGWorldPos: { value: null },
        uPrevResPos: { value: null },
        uPrevResRad: { value: null },
        uLightRes: { value: new THREE.Vector2(1, 1) },
        ...rectUniforms(),
        uPrevViewProj: { value: new THREE.Matrix4() },
        uLightRow: { value: 0 },
        uLightCount: { value: 0 },
        uEmissiveCount: { value: 0 },
        uEmissiveCDF: { value: true },
        uCameraPos: { value: new THREE.Vector3() },
        uFrame: { value: 0 },
        uEps: { value: 1e-3 },
        uFireflyClamp: { value: 4.0 },
        uMCap: { value: 20 },
        uSpatialTaps: { value: 2 },
        uValidateInterval: { value: 8 },
        uResolveAlpha: { value: 0.15 },
        uConfLow: { value: 0.3 },
        uChromaMean: { value: true },
        uVisFallback: { value: true },
        uEnvColor: { value: new THREE.Color(0.03, 0.04, 0.06) },
        uEnvIntensity: { value: 1.0 },
        uSkyEnabled: { value: false },
        uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.45).normalize() },
        uSunColor: { value: new THREE.Color(1.0, 0.9, 0.75) },
        uSkyZenith: { value: new THREE.Color(0.18, 0.34, 0.62) },
        uSkyHorizon: { value: new THREE.Color(0.7, 0.8, 0.9) },
        uSkyIntensity: { value: 1.0 },
        uHasTextureTiles: { value: false },
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
    // Three fp32 attachments, NearestFilter: the reservoir stores a hit POSITION
    // (needs fp32) + M + radiance + W, which must never be interpolated. All fp32
    // (rather than a mixed fp32/fp16 layout) sidesteps drivers that reject mixed
    // MRT precision; the resolved GI (attachment 2) is read 1:1 by the denoise.
    const t = makeMRT(width, height, 3, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    for (const tex of t.texture) tex.generateMipmaps = false;
    return t;
  }

  setCompiledScene(compiled) {
    const u = this.material.uniforms;
    u.bvhStatic.value = compiled.staticBvhUniform;
    u.bvhDynamic.value = compiled.dynamicBvhUniform;
    u.uHasDynamic.value = compiled.hasDynamic;
    u.uAttrStatic.value = compiled.staticAttrTex;
    u.uAttrDynamic.value = compiled.dynamicAttrTex;
    u.uMaterialsTex.value = compiled.materialsTex;
    u.uLightRow.value = compiled.lightRow;
    u.uLightCount.value = compiled.lightCount;
    u.uEmissiveCount.value = compiled.emissiveTriCount;
    this._tilesData = !!compiled.hasTextureTiles;
    this._tileSize = compiled._tileSize || 128;
    this._applyTilesSplice();
  }

  /** Emissive candidates follow the emissiveNEE toggle (set per frame). */
  setEmissiveCount(count) {
    this.material.uniforms.uEmissiveCount.value = count;
  }

  setTextureTiles(on) {
    this._tilesOn = !!on;
    this._applyTilesSplice();
  }

  _applyTilesSplice() {
    const on = !!(this._tilesOn && this._tilesData);
    let src = on ? this._fragTiles : this._fragNoTiles;
    // Inject the actual tile size when it differs from the hardcoded default (128).
    if (on && this._tileSize !== 128) {
      src = src.replace("#define TILE 128.0", `#define TILE ${this._tileSize}.0`);
    }
    this.material.uniforms.uHasTextureTiles.value = on;
    if (this.material.fragmentShader === src) return;
    this.material.fragmentShader = src;
    this.material.needsUpdate = true;
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
    this.setRect(width, height); // setSize resets three's per-target viewport
  }

  /**
   * Point the pass at a `w x h` rect of its (larger) allocated targets. GI
   * reservoirs are packed (hit position + M + radiance + W) and cannot be
   * resampled, so a rect change clears the history exactly as a reallocation
   * did; it reconverges in a few frames.
   */
  setRect(w, h) {
    setTargetRect(this.targetA, w, h);
    setTargetRect(this.targetB, w, h);
    this.material.uniforms.uLightRes.value.set(w, h);
    setRectUniforms(this.material, w, h, this.targetA.width, this.targetA.height);
  }

  /**
   * Renders into targetA (reading targetB as reservoir history), swaps, and
   * returns the resolved GI irradiance texture (attachment 2). `params` carries
   * the per-frame lighting state (sky/env, firefly clamp, emissive CDF, M-cap).
   */
  render(renderer, gbuffer, prevViewProj, cameraPos, frame, eps, params) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    u.uPrevResPos.value = this.targetB.texture[0];
    u.uPrevResRad.value = this.targetB.texture[1];
    u.uPrevViewProj.value.copy(prevViewProj);
    u.uCameraPos.value.copy(cameraPos);
    u.uFrame.value = frame;
    u.uEps.value = eps;
    u.uFireflyClamp.value = params.fireflyClamp;
    u.uMCap.value = params.mCap;
    u.uSpatialTaps.value = params.spatialTaps;
    u.uValidateInterval.value = params.validateInterval;
    u.uResolveAlpha.value = params.resolveAlpha ?? 0.15;
    u.uConfLow.value = params.confLow ?? 0.3;
    u.uChromaMean.value = params.chromaMean !== false;
    u.uVisFallback.value = params.visFallback !== false;
    u.uEmissiveCDF.value = params.emissiveCDF;
    u.uEnvColor.value.copy(params.envColor);
    u.uEnvIntensity.value = params.envIntensity;
    u.uSkyEnabled.value = params.skyEnabled;
    u.uSunDir.value.copy(params.sunDir);
    u.uSunColor.value.copy(params.sunColor);
    u.uSkyZenith.value.copy(params.skyZenith);
    u.uSkyHorizon.value.copy(params.skyHorizon);
    u.uSkyIntensity.value = params.skyIntensity;

    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);

    const out = this.targetA;
    [this.targetA, this.targetB] = [this.targetB, this.targetA];
    return out.texture[2];
  }

  dispose() {
    this.targetA.dispose();
    this.targetB.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
