import * as THREE from "three";
import { MAX_LIGHTS, clampMaxLights } from "./SceneCompiler.js";
import { makeMRT } from "./mrtCompat.js";

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
#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE
#define PI 3.14159265358979

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uMaterialsTex;  // row 1: emissive tris, rows 2..65: blue noise,
                                  // row 66: the emissive POWER CDF (.x cumulative,
                                  // .y the triangle's pick probability),
                                  // row uLightRow: the analytic light table
// THE LIGHT TABLE, 4 texels per seat in one row of uMaterialsTex (see
// SceneCompiler). Three vec4[MAX_LIGHTS] uniform arrays until 0.16.0; the
// values are the same float32s, so candidateContribution's arithmetic is
// unchanged to the bit.
uniform int uLightRow;
vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); } // spot: direction.xyz + cos(outer)
uniform int uLightCount;
uniform int uEmissiveCount;
uniform float uFrame;
uniform vec3 uCameraPos;
uniform float uEps;
// >>> RT_RESTIR_DIR_BYPASS
// Keep DIRECTIONAL lights out of the reservoir entirely (1 = out, 0 = the
// shipped behaviour). A directional light has a large UNSHADOWED contribution
// on every surface facing it and is occluded on most interior ones, so its
// target score wins the RIS draw again and again, the pixel's one visibility
// ray hits the wall, and the pixel renders black with the odd frame's other
// winner as a bright speck. The lighting pass shades directional lights
// exactly instead (RTLightingPass, uDirBypass), so this is not "the sun is
// dropped", it is "the sun is not gambled on".
//
// Zeroing the CONTRIBUTION rather than skipping the pick is deliberate: it
// zeroes the candidate's weight AND its p̂ as an inherited history or
// neighbour winner, so a directional light already sitting in a reservoir
// loses on weight next frame instead of surviving. A wasted uniform pick keeps
// RIS unbiased (the source pdf is unchanged, the target simply excludes those
// lights); one directional light in 16-29 wastes 3-6% of candidates. Skipping
// them at pick time needs a reordered light table and belongs to the port.
uniform float uDirBypass;
// <<< RT_RESTIR_DIR_BYPASS

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
    vec4 posType = lightPosType(i);
    vec4 colRad = lightColorRadius(i);
    if (posType.w < 0.5 || posType.w >= 1.5) {
      vec3 d = posType.xyz - P; // light CENTER: soft-radius jitter re-drawn at shading
      float dl = length(d);
      if (dl < 1e-5) return vec3(0.0);
      float NdotL = dot(N, d / dl);
      if (NdotL <= 0.0) return vec3(0.0);
      float cone = 1.0;
      if (posType.w >= 1.5) {
        // spot cone — MUST match RTLightingPass.spotFalloff for a consistent estimator
        vec4 dc = lightDirCone(i);
        cone = smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, -d / dl));
        if (cone <= 0.0) return vec3(0.0);
      }
      return colRad.rgb * (cone * NdotL / (dl * dl)) * (1.0 + restirSpecBoost(N, d / dl, P));
    }
    // >>> RT_RESTIR_DIR_BYPASS
    // Directional light. Zero contribution => zero weight => never selected,
    // and any history/neighbour reservoir still holding one is re-scored to
    // zero here and loses. RTLightingPass adds these lights exactly.
    if (uDirBypass > 0.5) return vec3(0.0);
    // <<< RT_RESTIR_DIR_BYPASS
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
//   r = candidateId * 64 + min(M, 63), g = unused, b = age, a = wSum
//
// >>> RT_RESTIR_COLD_FALLBACK
// `age` is the number of CONSECUTIVE frames this reservoir has carried
// validated history: 0 on the frame a pixel is revealed or its reprojected
// history is rejected, +1 for every frame the history is actually merged. It is
// not part of the estimator — nothing here reads it — it exists so the lighting
// pass can tell a converged reservoir from a newborn one and shade the newborn
// exactly instead of gambling one visibility ray on 8 uniform candidates out of
// S. `.g` stays unused and is reserved.
// <<< RT_RESTIR_COLD_FALLBACK
const temporalFrag = /* glsl */ `
precision highp float;

${RESTIR_COMMON}

#define CANDIDATES 8
// Lower-bound search steps over a light CDF row: ceil(log2(maxLights)), baked in
// at construction (7 at the default 128 seats, 5 at 32).
#define LIGHT_CDF_STEPS RT_CDF_STEPS_VALUE

layout(location = 0) out vec4 outReservoir;
layout(location = 1) out vec4 outHistory;

in vec2 vUv;

uniform sampler2D uPrevReservoir;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;
// Temporal staleness cap (was the literal 40.0). 40 = the shipped behaviour;
// lowering it makes the reservoir shed its history faster, which is the lever
// for post-motion ghosting — the reservoir is the pipeline's SECOND temporal
// accumulator (after the irradiance EMA) and measurably the slower one.
uniform float uMCap;
// Dynamic-mesh treatments (both default off). uGDynamic is the G-buffer's
// emissive target: its .a is -1.0 on dynamic-mesh pixels, else 1.0 (or the
// blend opacity, which is never negative).
uniform sampler2D uGDynamic;
uniform float uAcceptDynamic; // change 1: skip the plane test on dynamic pixels
uniform float uFreezeDynamic; // change 2: pass the prev reservoir through on dynamic pixels
uniform sampler2D uGMotion;   // G-buffer previous-screen-UV texture (RG32F)
uniform float uUseMotion;     // 1 = reproject via motion vector, 0 = camera-only
// >>> RT_RESTIR_REPROJ
// THIS frame's view-projection, for the sub-texel jitter correction below.
// AccumulatePass has carried one for the same reason since motion vectors
// landed; the reservoir never did, which is half of why its history dies on
// thin geometry.
uniform mat4 uViewProj;
// Neighbourhood rescue (1 = on). When the plane test at the reprojected texel
// fails, try the four axis neighbours before declaring the history dead.
uniform float uReprojRescue;
uniform vec2 uTexelSizeT;     // 1 / reservoir resolution
// <<< RT_RESTIR_REPROJ
// >>> RT_RESTIR_CAND_CDF
// CANDIDATES DRAWN THE WAY NEE DRAWS THEM (1 = on, 0 = the shipped uniform pick,
// byte for byte). Stock streams its 8 candidates UNIFORMLY out of S = lights +
// emissive triangles, so in the great hall a bulb triangle is a 1-in-282 pick and
// most picks are shade / TV / candle triangles that contribute nothing to this
// pixel: a cold reservoir holds 8 near-useless candidates. The exact path has
// never had that problem: sampleEmissiveTri importance-samples the emissive set
// through the power CDF on row 66, so this makes the reservoir draw from the
// same distribution: pick the POOL by power, then the member by its own CDF.
//
// RIS stays unbiased for ANY source pdf whose support covers the target's, and
// this one does: every candidate the uniform pick could produce still has
// non-zero probability, except directional lights when uDirBypass is on, which
// score p_hat = 0 anyway (candidateContribution returns zero for them). Those two
// facts are wired to the same switch on purpose. See RestirPass._rebuildPools,
// which zeroes exactly the lights candidateContribution zeroes.
uniform float uCandidateCDF;
// P(draw from the analytic-light pool) = PL / (PL + PE), clamped to [0.1, 0.9]
// when both pools carry power, 1 or 0 when only one does. Computed CPU-side.
// GLOBAL on purpose: the grid below localises WHICH light is drawn, not how
// often the light pool is drawn from at all.
uniform float uPoolSplit;
// >>> RT_LIGHT_GRID
// THE LIGHT GRID (0.16.0). Per-light pick probabilities, one texture ROW per
// cell of a uniform grid over the static world, plus row 0 = the GLOBAL
// distribution (power only, no geometry). Texel i of a row is
// (cdf_i, p_i, w_i, 0) — the same (.x cumulative, .y probability) layout as
// row 66 and as the vec2[MAX_LIGHTS] uniform array this replaces, so the search
// below is the same search.
//
// WHY: candidates used to be drawn from the global power CDF, which is fine at
// eight lights and useless at eighty — in a hotel corridor a pixel's own room
// holds 3 of 96 lights, so ~1 candidate in 32 could possibly light it and the
// reservoir spends its stream on lights behind walls. The grid weights each
// light by what it could deliver to THIS cell (see LightGridPass for the
// weight), so a pixel's candidates come from its own room. RIS stays unbiased:
// every light with a non-zero p̂ keeps a non-zero probability (the build floors
// every active light at 1e-4 of the cell's maximum), and the estimator divides
// by whatever pdf produced the sample.
uniform sampler2D uLightGrid;
uniform vec3 uGridOrigin;    // world position of cell (0,0,0)'s corner
uniform vec3 uGridInvCell;   // 1 / cell size, per axis
uniform ivec3 uGridDims;     // cells per axis
uniform float uUseLightGrid; // 0 = always row 0 (the 0.15.0 global CDF)

// Row of uLightGrid this surface point draws its candidates from. 0 = global:
// the grid is off, the scene has none, or the point is outside the static AABB
// (a dynamic mesh that flew out of the building still gets a valid pdf).
int lightGridRow(vec3 P) {
  if (uUseLightGrid < 0.5) return 0;
  vec3 f = (P - uGridOrigin) * uGridInvCell;
  ivec3 c = ivec3(floor(f));
  if (any(lessThan(c, ivec3(0))) || any(greaterThanEqual(c, uGridDims))) return 0;
  return 1 + c.x + uGridDims.x * (c.y + uGridDims.y * c.z);
}
// <<< RT_LIGHT_GRID
// Mirrors RTLightingPass.uEmissiveCDF: when the game switches emissive
// importance sampling off, the reservoir's emissive picks go uniform too, so the
// two estimators keep agreeing about what a triangle's pick probability is.
uniform bool uEmissiveCDF;
// <<< RT_RESTIR_CAND_CDF

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outReservoir = vec4(0.0);
    outHistory = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  gRestirRough = clamp(wp.w - 1.0, 0.0, 1.0);
  float isDynamic = texture(uGDynamic, vUv).a < 0.0 ? 1.0 : 0.0;

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 3079u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  int S = uLightCount + uEmissiveCount; // uniform source pool
  if (S == 0) {
    outReservoir = vec4(0.0);
    outHistory = vec4(0.0);
    return;
  }

  float rId = 0.0;
  float wSum = 0.0;
  float M = 0.0;
  for (int k = 0; k < CANDIDATES; k++) {
    float id;
    // 1 / source pdf, kept as the reciprocal so the stock branch is literally
    // the multiply it always was (p̂ * S) rather than a divide that rounds
    // differently. ONE phatOf call site, as ever.
    float invPdf;
    // >>> RT_RESTIR_CAND_CDF
    if (uCandidateCDF > 0.5) {
      // RNG BUDGET: 3 draws per candidate (pool, member, reservoir selection)
      // instead of 2. The blue-noise tile only carries 4 dimensions, so it runs
      // out one candidate sooner and PCG takes over; that is fine, the first
      // candidate is the one worth decorrelating.
      if (rand() < uPoolSplit) {
        // ANALYTIC LIGHT, by the CDF of this pixel's grid cell (row 0 = the
        // global power CDF = the 0.15.0 behaviour). The linear scan this
        // replaced was justified by "MAX_LIGHTS is 32 and it is a uniform
        // array"; at 128 seats in a texture the same lower-bound search costs
        // LIGHT_CDF_STEPS = ceil(log2(maxLights)) fetches instead of up to 128,
        // and lands on the SAME index (both return the first seat whose
        // cumulative is >= u, ties included).
        float u = rand();
        int row = lightGridRow(P);
        int lo = 0;
        int hi = uLightCount - 1;
        for (int s = 0; s < LIGHT_CDF_STEPS; s++) {
          if (lo >= hi) break;
          int mid = (lo + hi) >> 1;
          if (u > texelFetch(uLightGrid, ivec2(mid, row), 0).x) lo = mid + 1;
          else hi = mid;
        }
        id = float(lo);
        // p == 0 can only mean a light with no power at all or a directional one
        // under the bypass, and BOTH score p̂ = 0, so this candidate's weight is
        // zero either way — the guard just refuses to turn 0 x 1e12 into a
        // number. (It is also the only thing standing between a light-grid
        // program that failed to link, i.e. an all-zero table, and a white
        // screen; see RealtimeRaytracer._passClass.)
        float pI = texelFetch(uLightGrid, ivec2(lo, row), 0).y;
        invPdf = pI > 0.0 ? 1.0 / (uPoolSplit * pI) : 0.0;
      } else {
        // EMISSIVE TRIANGLE, by the SAME 8-step binary search over row 66 that
        // RTLightingPass.sampleEmissiveTri runs, and honouring uEmissiveCDF the
        // same way it does.
        int idx;
        float pTri;
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
          pTri = texelFetch(uMaterialsTex, ivec2(idx, 66), 0).y;
        } else {
          idx = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1);
          pTri = 1.0 / float(uEmissiveCount);
        }
        id = float(MAX_LIGHTS + idx);
        invPdf = 1.0 / max((1.0 - uPoolSplit) * pTri, 1e-12);
      }
    } else {
    // <<< RT_RESTIR_CAND_CDF
      int pick = min(int(rand() * float(S)), S - 1);
      id = pick < uLightCount
        ? float(pick)
        : float(MAX_LIGHTS + (pick - uLightCount));
      invPdf = float(S); // source pdf = 1/S -> RIS weight = p̂ * S
    }
    float w = phatOf(id, P, N) * invPdf;
    wSum += w;
    M += 1.0;
    if (w > 0.0 && rand() * wSum < w) { rId = id; }
  }

  // temporal reuse: previous reservoir as ONE candidate carrying its history.
  // Reprojection is via the G-buffer motion vector (uUseMotion) or camera-only
  // (uPrevViewProj * P); both yield prevUv for the same validation below. The
  // G-buffer stores the surface's PREVIOUS screen UV directly, so the reservoir
  // (which has no vUv-based jitter correction) samples it as-is — bit-identical
  // to the camera-only path for static geometry. The camera-only branch keeps
  // the old clip.w guard (prevUv = -1 drops the bounds test), matching stock
  // byte-for-byte.
  // >>> RT_RESTIR_COLD_FALLBACK
  // Age starts at zero every frame and only survives through the merge branch
  // below, so a rejected history, a reprojection off screen, and a first frame
  // all read as "cold" without a special case for any of them.
  float age = 0.0;
  // <<< RT_RESTIR_COLD_FALLBACK
  vec2 prevUv;
  // >>> RT_RESTIR_REPROJ
  // SUB-TEXEL CORRECTION, mirroring AccumulatePass line for line. The G-buffer
  // sample under this reservoir texel is TAA-jittered, so P does NOT project to
  // the centre of this texel: it projects to vUv + (cu - vUv). Reprojecting P
  // through the previous VP therefore lands up to a texel off the surface it
  // came from, and at reservoir resolution one texel is the width of a
  // baluster. Subtracting the offset makes the lookup follow the surface
  // instead of the grid. Zero when the option is off, which is what keeps the
  // shipped path byte-identical.
  vec2 subTexel = vec2(0.0);
  if (uReprojRescue > 0.5) {
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clipC.w > 0.0) subTexel = ((clipC.xy / clipC.w) * 0.5 + 0.5) - vUv;
  }
  // <<< RT_RESTIR_REPROJ
  if (uUseMotion > 0.5) {
    prevUv = texture(uGMotion, vUv).xy - subTexel;
  } else {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    prevUv = clip.w > 0.0 ? ((clip.xy / clip.w) * 0.5 + 0.5) - subTexel : vec2(-1.0);
  }
  if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
    vec4 prevPos = texture(uPrevGWorldPos, prevUv);
    float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
    // The plane test is only a surface-identity check — visibility is resolved
    // later at shading, so relaxing it for dynamic pixels changes nothing about
    // correctness of the estimator, only whether the co-located wall's history
    // may be offered as a candidate. Its light is re-evaluated at THIS surface
    // below, so a genuinely wrong inherited light loses on weight, not on a
    // hard test.
    bool dynOk = (uAcceptDynamic > 0.5 && isDynamic > 0.5);
    bool surfaceOk = abs(dot(P - prevPos.xyz, N)) < tol || dynOk;
    bool histOk = prevPos.w > 0.5 && surfaceOk;
    // >>> RT_RESTIR_REPROJ
    // NEIGHBOURHOOD RESCUE. Even corrected, one texel of the previous frame is
    // one sample of a jittered G-buffer: on a baluster or a handrail edge the
    // surface that owns this pixel now sat in the texel NEXT DOOR last frame,
    // the plane test fails, and the reservoir restarts from eight uniform
    // candidates every single frame. (Measured before this: 22% of shaded
    // pixels never reach age 12 at a frozen pose, as a stipple tracing exactly
    // the balusters, handrail, chandelier arms and picture frames.) So before
    // declaring the history dead, look at the four axis neighbours and take the
    // one whose surface agrees best with this one. Bounded on purpose: four
    // extra uPrevGWorldPos fetches, still ONE uPrevReservoir fetch, no search.
    vec2 useUv = prevUv;
    if (!histOk && uReprojRescue > 0.5) {
      float best = tol;
      for (int k = 0; k < 4; k++) {
        vec2 off = k == 0 ? vec2(1.0, 0.0)
                 : k == 1 ? vec2(-1.0, 0.0)
                 : k == 2 ? vec2(0.0, 1.0)
                 : vec2(0.0, -1.0);
        vec2 nUv = prevUv + off * uTexelSizeT;
        if (nUv.x < 0.0 || nUv.x > 1.0 || nUv.y < 0.0 || nUv.y > 1.0) continue;
        vec4 np = texture(uPrevGWorldPos, nUv);
        if (np.w < 0.5) continue;
        float d = abs(dot(P - np.xyz, N));
        if (d < best) { best = d; useUv = nUv; histOk = true; }
      }
    }
    // <<< RT_RESTIR_REPROJ
    if (histOk) {
      vec4 h = texture(uPrevReservoir, useUv);
      // Staleness cap; ALSO keeps total M within the 6 bits the encoding
      // stores (8 fresh + 40 history < 64).
      float hM = min(mod(h.r, 64.0), uMCap);
      float hId = floor(h.r / 64.0);
      if (hM > 0.0 && h.a > 0.0) {
        // RIS weight = p̂_now · W_prev · M_prev; with p̂_prev ≈ p̂_now on a
        // validated surface this reduces to (wSum/M)·M.
        float hPhat = phatOf(hId, P, N);
        float w = hPhat > 0.0 ? (h.a / max(mod(h.r, 64.0), 1.0)) * hM : 0.0;
        wSum += w;
        M += hM;
        if (w > 0.0 && rand() * wSum < w) { rId = hId; }
        // >>> RT_RESTIR_COLD_FALLBACK
        // This is the one branch where history genuinely carried over, so it is
        // the one place age may advance. h.b IS the previous frame's age at the
        // reprojected texel. 255 is a float ceiling, not an encoding limit.
        age = min(h.b + 1.0, 255.0);
        // <<< RT_RESTIR_COLD_FALLBACK
      }
    }
  }

  outReservoir = vec4(rId * 64.0 + min(M, 63.0), 0.0, age, wSum);
  // History is normally the live reservoir, but a dynamic-mesh pixel must NOT
  // overwrite the wall's history it is covering: pass the previous reservoir at
  // this pixel through unchanged, so the wall's history survives the aeroplane
  // crossing it and the trailing edge stops disoccluding. The live reservoir
  // (attachment 0) still streams the aeroplane's fresh candidates for shading.
  outHistory = (uFreezeDynamic > 0.5 && isDynamic > 0.5)
    ? texture(uPrevReservoir, vUv)
    : outReservoir;
}
`;

// SPATIAL stage (the "v2" of ReSTIR): merge a few validated neighbor
// reservoirs so pixels share each other's discoveries — the big win for
// convergence speed and area-light (emissive) noise. Output is consumed by
// the lighting pass THIS frame only (never fed back), so it trades the
// history encoding for a precomputed weight:
//   r = candidateId, g = p̂_total (RT_RESTIR_CLAMP_REL), b = age (passed
//   through), a = W = wSum / (M · p̂centroid)
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
  // >>> RT_RESTIR_CLAMP_REL
  // THIS PIXEL'S OWN ESTIMATE OF THE WHOLE UNSHADOWED LIGHT SUM, before any
  // neighbour is merged in. wSum/M is the RIS estimate of the integral of the
  // target function: E[w] = sum over the light set of p̂, whatever the source
  // pdf. It is written to the output's unused .g so the lighting pass can cap a
  // firefly RELATIVE to what this pixel could plausibly receive instead of
  // against a scene-wide constant. Taken from the OWN reservoir on purpose: a
  // neighbour's total belongs to the neighbour's surface.
  float pHatTotal = M > 0.0 ? wSum / M : 0.0;
  // <<< RT_RESTIR_CLAMP_REL

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
  // >>> RT_RESTIR_COLD_FALLBACK
  // THIS pixel's age, passed straight through. Neighbours' ages are deliberately
  // not merged: coldness is a property of the pixel, and a cold pixel that
  // borrowed a warm neighbour's candidate still has one visibility ray on one
  // guess, which is exactly the estimate the fallback exists to replace.
  // <<< RT_RESTIR_COLD_FALLBACK
  // >>> RT_RESTIR_CLAMP_REL
  // .g was the reserved channel; it now carries p̂_total (see above). Nothing
  // reads it unless RTLightingPass.uRestirClampRel is non-zero, so writing it
  // does not change a single shaded pixel on its own.
  // <<< RT_RESTIR_CLAMP_REL
  outReservoir = vec4(rId, pHatTotal, c.b, W);
}
`;

/**
 * ReSTIR DI reservoirs at lighting resolution: temporal reuse (ping-ponged
 * history) followed by one spatial-reuse iteration. render() returns the
 * spatial output — {id, uv, W} per pixel — for the lighting pass to shade
 * with a single visibility ray.
 */
export class RestirPass {
  constructor(width, height, { maxLights = MAX_LIGHTS } = {}) {
    this.maxLights = clampMaxLights(maxLights);
    // Steps of the lower-bound search over a light CDF row. ceil(log2(n)) is
    // exactly enough for n seats; one extra would be harmless but this is a
    // loop in the hottest shader in the pipeline.
    this._cdfSteps = Math.max(1, Math.ceil(Math.log2(Math.max(2, this.maxLights))));
    // Temporal targets are two-attachment MRTs: [0] = live reservoir (consumed
    // by the spatial stage THIS frame), [1] = history (fed back next frame).
    // Keeping them separate is what lets change 2 freeze the history under a
    // dynamic mesh without corrupting this frame's shading.
    this.targetA = this._makeTemporalTarget(width, height);
    this.targetB = this._makeTemporalTarget(width, height);
    this.spatialTarget = this._makeTarget(width, height);

    const mkMaterial = (frag, name) =>
      new THREE.ShaderMaterial({
        // Stable program name for compile-failure self-diagnosis; a link failure
        // in either reservoir stage disables `restir` (falls back to the
        // non-reservoir per-light direct sampling path — image stays lit).
        name,
        glslVersion: THREE.GLSL3,
        vertexShader: fullscreenVert,
        fragmentShader: frag
          .replace(/RT_MAX_LIGHTS_VALUE/g, String(this.maxLights))
          .replace(/RT_CDF_STEPS_VALUE/g, String(this._cdfSteps)),
        uniforms: {
          uGWorldPos: { value: null },
          uGNormalMetal: { value: null },
          uMaterialsTex: { value: null },
          uLightRow: { value: 0 },
          uLightCount: { value: 0 },
          uEmissiveCount: { value: 0 },
          uFrame: { value: 0 },
          uCameraPos: { value: new THREE.Vector3() },
          uEps: { value: 1e-3 },
          // Declared by RESTIR_COMMON, so BOTH stages carry it.
          uDirBypass: { value: 0.0 },
          ...(frag === temporalFrag
            ? {
                // >>> RT_RESTIR_CAND_CDF
                // Temporal stage only: the spatial stage draws no fresh
                // candidates, it only merges reservoirs that already exist.
                uCandidateCDF: { value: 0.0 },
                uPoolSplit: { value: 1.0 },
                uEmissiveCDF: { value: true },
                // <<< RT_RESTIR_CAND_CDF
                // >>> RT_LIGHT_GRID
                uLightGrid: { value: null },
                uGridOrigin: { value: new THREE.Vector3() },
                uGridInvCell: { value: new THREE.Vector3(1, 1, 1) },
                uGridDims: { value: new Int32Array([1, 1, 1]) },
                uUseLightGrid: { value: 0.0 },
                // <<< RT_LIGHT_GRID
                uPrevReservoir: { value: null },
                uPrevGWorldPos: { value: null },
                uPrevViewProj: { value: new THREE.Matrix4() },
                uViewProj: { value: new THREE.Matrix4() },
                uReprojRescue: { value: 0.0 },
                uTexelSizeT: { value: new THREE.Vector2(1 / width, 1 / height) },
                uMCap: { value: 40 },
                uGDynamic: { value: null },
                uAcceptDynamic: { value: 0.0 },
                uFreezeDynamic: { value: 0.0 },
                uGMotion: { value: null },
                uUseMotion: { value: 0.0 },
              }
            : {
                uReservoirIn: { value: null },
                uTexelSize: { value: new THREE.Vector2(1 / width, 1 / height) },
              }),
        },
        depthTest: false,
        depthWrite: false,
      });

    this.material = mkMaterial(temporalFrag, "rt:restir-temporal");
    this.spatialMaterial = mkMaterial(spatialFrag, "rt:restir-spatial");

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

  _makeTemporalTarget(width, height) {
    const t = makeMRT(width, height, 2, {
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
    for (const m of [this.material, this.spatialMaterial]) {
      const u = m.uniforms;
      u.uMaterialsTex.value = compiled.materialsTex;
      u.uLightRow.value = compiled.lightRow;
      u.uLightCount.value = compiled.lightCount;
      u.uEmissiveCount.value = compiled.emissiveTriCount;
    }
    // >>> RT_LIGHT_GRID
    // Grid GEOMETRY comes from the compiled scene (it is the static world's
    // AABB); the grid TEXTURE comes from LightGridPass via setLightGrid, because
    // building it needs a renderer and this method has none.
    const tu = this.material.uniforms;
    const g = compiled.lightGrid;
    if (g) {
      tu.uGridOrigin.value.set(g.origin[0], g.origin[1], g.origin[2]);
      tu.uGridInvCell.value.set(1 / g.cell[0], 1 / g.cell[1], 1 / g.cell[2]);
      tu.uGridDims.value[0] = g.dims[0];
      tu.uGridDims.value[1] = g.dims[1];
      tu.uGridDims.value[2] = g.dims[2];
    } else {
      tu.uGridDims.value[0] = tu.uGridDims.value[1] = tu.uGridDims.value[2] = 0;
    }
    // <<< RT_LIGHT_GRID
    // >>> RT_RESTIR_CAND_CDF
    this._compiled = compiled;
    this._rebuildPools();
    // <<< RT_RESTIR_CAND_CDF
  }

  /** Emissive candidates follow the emissiveNEE toggle (set per frame). */
  setEmissiveCount(count) {
    this.material.uniforms.uEmissiveCount.value = count;
    this.spatialMaterial.uniforms.uEmissiveCount.value = count;
  }

  // >>> RT_RESTIR_CAND_CDF
  /**
   * Draw candidates from the same distribution NEE draws from (default off =
   * the shipped uniform pick over S, byte for byte). See the shader comment on
   * uCandidateCDF for why, and _rebuildPools for the tables it needs.
   */
  setCandidateImportance(enabled) {
    this.material.uniforms.uCandidateCDF.value = enabled ? 1.0 : 0.0;
  }

  /** Emissive picks follow the renderer's emissiveImportance toggle. */
  setEmissiveImportance(enabled) {
    this.material.uniforms.uEmissiveCDF.value = !!enabled;
  }

  // >>> RT_LIGHT_GRID
  /**
   * Point the candidate sampler at the light-grid texture LightGridPass built,
   * and say whether the per-cell rows may be used. `enabled: false` still needs
   * the texture: row 0 IS the global power CDF the 0.15.0 path drew from, so
   * this is where that table lives now either way.
   */
  setLightGrid(texture, enabled) {
    const u = this.material.uniforms;
    u.uLightGrid.value = texture || null;
    u.uUseLightGrid.value = texture && enabled ? 1.0 : 0.0;
  }
  // <<< RT_LIGHT_GRID

  /**
   * Rebuild the pool split from the CURRENT light table, emissive count and
   * directional-bypass flag.
   *
   * Called once per render() rather than from each setter, because all three of
   * its inputs are live knobs: the light table's CONTENTS change under
   * updateLights() with no call into this pass at all, the emissive count
   * follows the emissiveNEE toggle every frame, and the bypass is an A/B switch.
   * It is a loop over lightCount floats already in cache; measured against a
   * 25-80 ms frame it is not visible.
   *
   * 0.16.0: the per-light CDF this also used to build now lives in the light
   * GRID texture (row 0 is the same global power distribution, rows 1+ localise
   * it), built on the GPU by LightGridPass. What stays here is the SPLIT, which
   * is one scalar and needs the emissive set's power, a CPU-side quantity.
   *
   * TWO THINGS THIS MUST NOT GET WRONG.
   *  1. A light's weight is zero EXACTLY when candidateContribution scores it
   *     zero, that is, a directional light while uDirBypass is on. Support then
   *     still covers the target (pdf 0 only where p̂ is 0), which is what keeps
   *     RIS unbiased. Any other reason to zero a weight would be a bug. (The
   *     grid build applies the same rule to the same flag.)
   *  2. Luminance here uses the same Rec.601 weights as the shader's rtLum, so a
   *     light with a non-zero p̂ can never have a zero pick probability. (The
   *     emissive side's total comes from the CDF's own Rec.709 weights; the two
   *     pools' powers are therefore on slightly different photometric scales,
   *     which biases the SPLIT by a few percent and nothing else. The split is a
   *     variance knob, clamped to [0.1, 0.9] anyway, not part of the
   *     estimator's correctness.)
   */
  _rebuildPools() {
    const u = this.material.uniforms;
    const c = this._compiled;
    const n = c ? Math.min(c.lightCount | 0, this.maxLights) : 0;
    const skipDir = u.uDirBypass.value > 0.5;
    let PL = 0;
    for (let i = 0; i < n; i++) {
      const type = c.lightPosType[i * 4 + 3];
      const isDir = type >= 0.5 && type < 1.5;
      if (skipDir && isDir) continue;
      PL +=
        0.299 * c.lightColorRadius[i * 4] +
        0.587 * c.lightColorRadius[i * 4 + 1] +
        0.114 * c.lightColorRadius[i * 4 + 2];
    }
    const PE = u.uEmissiveCount.value > 0 && c ? c.emissivePower || 0 : 0;
    // "Non-empty" means "carries power". A pool with members but no power
    // contributes nothing to the integral, so spending candidates in it would be
    // pure waste, the same reason the sun is zeroed above. qL = 1 or 0 is exact
    // in the shader: rand() is [0, 1), so `rand() < 1.0` never picks the empty
    // pool and `rand() < 0.0` never picks the other one.
    let qL;
    if (n === 0) qL = 0.0;                                   // emissive only
    else if (PL > 0 && PE > 0) qL = Math.min(0.9, Math.max(0.1, PL / (PL + PE)));
    else if (PE > 0) qL = 0.0;                               // lights are dark
    else qL = 1.0;                                           // lights only, or nothing lit
    u.uPoolSplit.value = qL;
  }
  // <<< RT_RESTIR_CAND_CDF

  /**
   * Toggle the two dynamic-mesh treatments in the temporal stage (both default
   * off, so a caller that never calls this gets stock behaviour):
   *   accept — skip the plane test on dynamic pixels, so the co-located
   *            previous reservoir is offered as a candidate (change 1).
   *   freeze — pass the previous reservoir through to history on dynamic
   *            pixels instead of overwriting it (change 2).
   */
  setDynamic(accept, freeze) {
    this.material.uniforms.uAcceptDynamic.value = accept ? 1.0 : 0.0;
    this.material.uniforms.uFreezeDynamic.value = freeze ? 1.0 : 0.0;
  }

  /** Toggle motion-vector reprojection in the temporal stage (default off). */
  setMotionVectors(enabled) {
    this.material.uniforms.uUseMotion.value = enabled ? 1.0 : 0.0;
  }

  /**
   * Keep DIRECTIONAL lights out of the reservoir (default off = shipped). Both
   * stages take it, because a directional light must score zero as a fresh
   * candidate, as an inherited history winner and as a neighbour's winner —
   * anything less leaves the sun in some reservoirs and not others.
   * RTLightingPass.uDirBypass MUST be set to match, or the sun is dropped from
   * the frame instead of being shaded exactly.
   */
  setDirectionalBypass(enabled) {
    const v = enabled ? 1.0 : 0.0;
    this.material.uniforms.uDirBypass.value = v;
    this.spatialMaterial.uniforms.uDirBypass.value = v;
  }

  /**
   * Sub-texel reprojection correction + four-neighbour rescue in the temporal
   * stage (default off = shipped). One switch for both halves: they are the
   * same fix (find the history this surface actually left behind) at two
   * scales, and gating them separately would only make "stock" ambiguous.
   */
  setReprojectionRescue(enabled) {
    this.material.uniforms.uReprojRescue.value = enabled ? 1.0 : 0.0;
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
    this.material.uniforms.uTexelSizeT.value.set(1 / width, 1 / height);
  }

  /**
   * Temporal → spatial; history feeds back from the TEMPORAL stage only.
   * `mCap` is the temporal staleness cap (default 40 = shipped behaviour).
   * `viewProj` is THIS frame's (jittered) view-projection, used only by the
   * sub-texel reprojection correction; omitting it leaves the correction on
   * whatever matrix it last saw, so a caller that uses the rescue must pass it.
   */
  render(renderer, gbuffer, prevViewProj, cameraPos, frame, eps, mCap = 40, viewProj = null) {
    for (const m of [this.material, this.spatialMaterial]) {
      const u = m.uniforms;
      u.uGWorldPos.value = gbuffer.worldPos;
      u.uGNormalMetal.value = gbuffer.normalMetal;
      u.uFrame.value = frame;
      u.uCameraPos.value.copy(cameraPos);
      u.uEps.value = eps;
    }
    // >>> RT_RESTIR_CAND_CDF
    // Once per frame, after every setter the caller may have used and before
    // anything reads the tables. See _rebuildPools for why it is here and not in
    // the setters.
    this._rebuildPools();
    // <<< RT_RESTIR_CAND_CDF
    const tu = this.material.uniforms;
    tu.uPrevReservoir.value = this.targetB.texture[1];
    tu.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    tu.uPrevViewProj.value.copy(prevViewProj);
    if (viewProj) tu.uViewProj.value.copy(viewProj);
    tu.uMCap.value = Math.max(1, mCap);
    tu.uGDynamic.value = gbuffer.emissive;
    tu.uGMotion.value = gbuffer.motion;

    this.quad.material = this.material;
    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);

    this.spatialMaterial.uniforms.uReservoirIn.value = this.targetA.texture[0];
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
