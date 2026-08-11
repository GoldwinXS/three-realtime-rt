import * as THREE from "three";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { MAX_LIGHTS } from "./SceneCompiler.js";
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
uniform bool uRawOutput; // when true: skip EMA, write raw sampleIrr for AccumulatePass

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
uniform float uDispersion;  // chromatic dispersion strength for glass (0 = off)
uniform bool uLightStochastic; // 1 direct shadow ray/pixel/frame instead of 1/light
uniform bool uRestirEnabled;   // shade the reservoir winner instead of sampling
uniform bool uGIHalfRate;      // GI ray on alternating checkerboard, doubled

uniform vec3 uEnvColor;
uniform float uEnvIntensity;
uniform float uFrame;
uniform float uEps;
uniform bool uGIEnabled;
// EXPERIMENTAL: when an external ReSTIR GI pass supplies the 1-bounce indirect
// (added downstream at the denoise stage), skip the inline GI trace so it isn't
// counted twice. A uniform, NOT a sampler — the lighting pass is already at the
// WebGL2 16-sampler minimum and cannot take another.
uniform bool uExternalGI;

// BVH traversal-cost heatmap (outputMode 7). When uCostView is on, main() writes
// the per-pixel shadow-ray node-visit count (gBvhVisits, from bvhAnyHit.glsl.js)
// through costPalette() into the irradiance attachment INSTEAD of the accumulated
// lighting — bypassing temporal blending — so the debug view reads the raw cost.
uniform bool uCostView;
uniform float uCostScale; // multiplies the visit count before the palette (default 1/96)

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

// >>> RT_TEXTURE_TILES (whole block source-spliced — see stripMarked below)
// SECONDARY-RAY TEXTURE MAPS. Rides the existing scene-data texture: row 69
// carries per-material tile indices, rows 70+ hold the tile block. The stride-2
// attribute layout stores UVs alongside normals so hit points carry interpolated
// texture coordinates. No new sampler (this pass sits at the WebGL2 16-sampler
// minimum), no new uniform beyond the bool gate below. Stripped entirely when the
// compiled scene has no textured materials, so the program is byte-identical to
// today's.
uniform bool uHasTextureTiles;

// Stride-2 attribute fetch. textureSampleBarycoord indexes at stride 1 and would
// read the wrong texels when the attribute texture uses the two-texel-per-vertex
// layout, so we replicate its 1D-to-2D addressing at stride 2. The normal+matIndex
// interpolation is bit-identical to the old stride-1 call — matIndex is uniform
// per triangle, so lerping it gives the same value as reading from any one vertex.
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

// Manual bilinear sample from the tile block (row 70+). uv wraps with fract for
// repeat-mode tiling; each tile is TILE x TILE texels in linear RGBA.
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

// >>> RT_ABSORPTION (whole block source-spliced — see stripAbsorption below)
// Per-material Beer-Lambert absorption for refractive media ("tinted glass done
// right"). Row 67 of the scene-data texture carries one texel per material,
// [sigma.rgb | 0] in 1/world-unit, derived by SceneCompiler from
// attenuationColor / attenuationDistance (or userData.rtAttenuation — see
// collectAbsorption there). The row exists ONLY when some material absorbs,
// which is exactly when this code is spliced into the source, so the fetch can
// never read a missing row. Deliberately free of new resources: no new sampler
// (this pass sits at the WebGL2 16-sampler minimum — sigma rides the already-
// bound scene-data texture), no new uniform, and no new traceRadiance call site
// (see the Metal call-site budget note at the unified secondary-ray site).
vec3 rtAbsorbSigma(float matIndex) {
  return texelFetch(uMaterialsTex, ivec2(int(round(matIndex)), 67), 0).rgb;
}
// Beer-Lambert transmittance over an in-medium path of length d:
// exp(-sigma * d) per channel. sigma == 0 gives exactly 1.0 (no change), so
// non-absorbing materials in an absorbing scene pay only these few ALU ops.
vec3 rtTransmittance(float matIndex, float d) {
  return exp(-rtAbsorbSigma(matIndex) * max(d, 0.0));
}

// <<< RT_ABSORPTION
// >>> RT_KM (whole block source-spliced — see stripMarked below)
// KUBELKA-MUNK TWO-FLUX SCATTERING — the arithmetic. Absorption alone can only
// REMOVE light, so a pigmented translucent solid lit from the front renders as
// black murk: nothing sends the light back out of the surface. Real jade, wax,
// marble, skin, a leaf, a lampshade, coloured plastic all look like their colour
// because light enters, SCATTERS, and leaves again on the same side. The
// two-flux model is the closed-form solution for exactly that: one diffuse flux
// heading in, one heading back out, coupled by an absorption coefficient K and a
// scattering coefficient S, solved over a layer of thickness t on a backing of
// reflectance Rg. Per channel:
//
//   a = 1 + K/S,  b = sqrt(a*a - 1),  x = b*S*t
//   R(t, Rg) = (1 - Rg*(a - b*coth(x))) / (a - Rg + b*coth(x))
//   T(t)     = b / (a*sinh(x) + b*cosh(x))
//
// Closed form, no volumetric march, no extra rays — which is the whole reason it
// belongs in a real-time renderer. src/kubelkaMunk.js is the same maths in JS and
// is what these expressions were validated against (scripts/km-selftest.mjs).
//
// NOTHING HERE IS WRITTEN THE TEXTBOOK WAY. coth blows up as x goes to zero,
// sinh/cosh overflow as it grows, and a - b is a difference of two nearly equal
// large numbers when the medium barely scatters. Every expression below is the
// algebraically identical but numerically stable rewrite, because fp32 hits all
// three of those corners inside one ordinary object: the centre of a sphere is a
// long chord (x large) and its silhouette is a vanishing one (x tiny).
// b is floored, and this one constant is what makes the whole feature fit.
//
// The textbook expressions need a SERIES branch as b*S*t goes to zero (coth
// blows up, and T becomes 0/0 when b is exactly 0 — a pure white scatterer with
// K = 0, which is precisely what a lampshade is). Carrying both branches and a
// step() to pick between them costs live registers, and this shader has none to
// spare: shadowTransmittance is inlined at roughly EIGHT effective sites (main's
// direct loop, plus every traceRadiance call site through sampleOneAny), so
// every vector temporary in its loop body is paid for eight times over. A
// version that did carry both branches failed to link on NVIDIA native GL with
// "error: too many temporaries" — the register-pressure sibling of the C5041
// failure that killed a 0.9.0 shadow-march optimisation.
//
// Flooring b removes the branch instead of hiding it. Because x is computed as
// b*(S*d) with the SAME floored b, the ratio x/b stays exactly S*d, and every
// degenerate limit comes out right from the exponential form alone:
// b*coth(x) -> 1/(S*d), T -> 1/(1 + S*d), R -> S*d/(1 + S*d), R_inf -> 1/(1 + b).
// Verified against the analytic K = 0 case to 0.06% at the values the demo uses.
#define RT_KM_MIN_B 1e-3
// x is clamped before exp() purely as a belt-and-braces guard: a grazing ray
// through a dense medium can reach x in the thousands, where exp(-x) flushes to
// zero harmlessly but exp(+x) (which no expression below uses, by design) would
// have been an infinity.
#define RT_KM_MAX_X 60.0

// Row 68 of the scene-data texture: [S.rgb | kmEnabled] per material. K is NOT
// duplicated here — it is row 67's absorption sigma, so a material states its
// colour once (see collectScattering in SceneCompiler). No new sampler: this is
// the same already-bound scene-data texture the rest of the shader reads.
vec4 rtKmFetch(float matIndex) {
  return texelFetch(uMaterialsTex, ivec2(int(round(matIndex)), 68), 0);
}

// The three derived parameters, shared by both evaluations below. S is floored
// as well as b: at S = 1e-6 the model is already Beer-Lambert to better than
// fp32 can represent (a and b both become K/S, and x collapses to K*d), so ONE
// code path covers "scatters" and "does not scatter" with no branch and no
// discontinuity — which is what lets a plain absorbing layer compose into a
// scattering stack for free.
void rtKmAB(vec3 K, vec3 S, float d, out vec3 a, out vec3 b, out vec3 x) {
  vec3 s = max(S, vec3(1e-6));
  a = 1.0 + max(K, vec3(0.0)) / s;
  // sqrt((a - 1)*(a + 1)) rather than sqrt(a*a - 1): for a weakly absorbing
  // pigment a is 1 + tiny, and a*a - 1 loses every significant bit to
  // cancellation while (a - 1) is exact.
  b = max(sqrt((a - 1.0) * (a + 1.0)), vec3(RT_KM_MIN_B));
  x = min(b * (s * max(d, 0.0)), vec3(RT_KM_MAX_X));
}

// TRANSMITTANCE ONLY — the shadow path's half, and the one that is inlined
// everywhere, so it is kept as small as it can possibly be.
//
// T = 2*b*e^-x / ((a + b) + (b - a)*e^-2x): the textbook
// b / (a*sinh(x) + b*cosh(x)) with e^x divided out of both halves, so nothing
// overflows however thick the body gets. exp(-x) is recovered as sqrt(e2)
// rather than paying a second exp.
vec3 rtKmTrans(vec3 K, vec3 S, float d) {
  vec3 a, b, x;
  rtKmAB(K, S, d, a, b, x);
  vec3 e2 = exp(-2.0 * x);
  return clamp(2.0 * b * sqrt(e2) / max(a + b + (b - a) * e2, vec3(1e-9)), 0.0, 1.0);
}

// BOTH of a layer's numbers: R over a black backing, and T. Used only by the
// view march, which is inlined once, so it can afford the extra reflectance
// term the shadow path never needs.
//
// Taking Rg = 0 here and adding the real backing once at the end is what lets
// the march run front-to-back: the textbook recursion R(t_n over R(t_n-1 over
// ...)) needs the layers in reverse order, which a marching ray does not have.
void rtKmLayer(vec3 K, vec3 S, float d, out vec3 R, out vec3 T) {
  vec3 a, b, x;
  rtKmAB(K, S, d, a, b, x);
  vec3 e2 = exp(-2.0 * x);
  // b*coth(x) = b*(1 + e^-2x)/(1 - e^-2x), finite all the way down because b is
  // floored: it tends to 1/(S*d), which is the term that survives at K = 0.
  vec3 bc = b * (1.0 + e2) / max(1.0 - e2, vec3(1e-9));
  // R(t, 0) = 1/(a + b*coth(x)): 1/(a + b) = R_inf at large x, and the classic
  // S*d/(1 + a*S*d) at small.
  R = clamp(1.0 / (a + bc), 0.0, 1.0);
  T = clamp(2.0 * b * sqrt(e2) / max(a + b + (b - a) * e2, vec3(1e-9)), 0.0, 1.0);
}

// VIEW-PATH RESULTS, handed from glassRadiance (where the in-medium chord is
// measured) to main (where it is shaded). Globals, not return values, because
// the function they come from has a fixed signature that the byte-identity
// contract forbids touching.
//
// WHY THERE IS NO DEDICATED VIEW MARCH, which is the design decision this
// feature turns on. The natural implementation is an ordered march along the
// view ray, mirroring the coloured-shadow one, composing a full layered stack.
// It was written, it works, and it CANNOT BE COMPILED: NVIDIA's native-GL
// assembler rejects the megakernel with "error: too many temporaries" — the
// register-pressure sibling of the C5041 failure that killed a 0.9.0
// shadow-march optimisation. Measured, not assumed:
//
//   full feature, dedicated march ..... 35 319 lines of NV assembly, FAILS
//   same, shadow-side maths removed ... 33 403 lines,                FAILS
//   same, march compiled but uncalled . links
//
// So the march's own BVH traversal is the blocker, not the arithmetic around it,
// and shrinking the arithmetic cannot buy it back. Reusing shadowTransmittance
// for the view ray instead makes it strictly WORSE — that function is already
// inlined at roughly eight effective sites (main's direct loop, and again inside
// every traceRadiance call site by way of sampleOneAny), so a third explicit
// call adds a ninth copy of a traversal.
//
// This shader computes exactly ONE in-medium view chord, in glassRadiance, and
// that is where the two-flux layer is now evaluated. No new traversal, no new
// traceRadiance call site, no new sampler. The cost is v1's honest limitation:
// ONE medium along the view path rather than an arbitrary stack (the shadow path
// still marches through stacks properly). The layered composition lives on in
// src/kubelkaMunk.js, is exercised by the self-test, and is what a future pass
// with register room to spare would use.
bool gKmOn;      // this pixel's primary surface is a scattering body
vec3 gKmR;       // the body's two-flux reflectance over its measured chord
vec3 gKmT;       // ... and its transmittance
vec3 gKmBehind;  // un-attenuated radiance arriving from behind the body
// <<< RT_KM
// >>> RT_ABSORB_SHADOWS (whole block source-spliced — see stripMarked below)
// COLOURED SHADOWS. A shadow ray that crosses absorbing glass is ATTENUATED per
// channel instead of blocked: stained glass spills tinted light, a backlit stack
// of translucent bodies stops rendering as a black silhouette. This is the
// shadow-ray twin of the view-path absorption above, and it is spliced in only
// when the scene absorbs AND rt.absorptionShadows is on — so the fast path (a
// single any-hit ray, occluded()) survives byte-for-byte everywhere else.
//
// NOT an unordered any-hit signed sum. The obvious cheap trick — accumulate
// +sigma on front faces and -sigma on back faces in any order — is wrong for
// real geometry: a multi-body 3D-print stack legitimately contains body-to-body
// interfaces where only ONE of the two coincident walls survives, so entry/exit
// events do not pair up and the signed sum goes NEGATIVE (optical gain, bright
// halos). This marches in ORDER with an explicit current-medium state instead,
// which never produces negative optical depth no matter how unbalanced the
// interfaces are.
//
// Interfaces are classified by the interpolated attribute normal (attr.xyz), not
// a true geometric normal: traceBoth discards the BVH kernel's face normal and
// widening its signature would edit a line the byte-identity contract forbids
// touching. The two agree exactly on the flat-walled bodies this targets, and
// disagree only within a smooth surface's silhouette band, where the mis-classed
// segment is short.
//
// Shadow rays do NOT refract — a straight segment, the standard approximation
// (bending them would need the light re-solved through the bent path).
#define RT_SHADOW_EVENTS 8
// Row 67's .w channel carries the material's TRANSMISSION, which is exactly the
// "is glass to this tracer" flag (SceneCompiler writes it beside sigma; a
// surface the tracer shades opaquely reads 0). Glass with no sigma still lets
// the ray through, contributing nothing to the optical depth — clear glass casts
// no shadow, which is the physically right answer and the one master could not
// express.
float rtShadowGlass(float matIndex) {
  return texelFetch(uMaterialsTex, ivec2(int(round(matIndex)), 67), 0).w;
}
// Per-channel transmittance along the segment (origin, origin + dir * maxDist):
// vec3(1) for a clear line of sight, vec3(0) for an opaque blocker, exp(-tau)
// through glass. ONE textual call to the closest-hit kernel (traceBoth, reused
// by the loop) — the inlined-code footprint is what WebKit's Metal translator
// has broken on before, so this never unrolls.
vec3 shadowTransmittance(vec3 origin, vec3 dir, float maxDist) {
  vec3 tau = vec3(0.0);       // accumulated optical depth, per channel
  vec3 sigmaCur = vec3(0.0);  // absorption of the medium we are currently inside
// >>> RT_KM
  // SCATTERING MEDIA take a different segment law. Beer-Lambert is a sum in
  // log space (tau), while the two-flux transmittance is not exp of anything
  // simple, so it accumulates MULTIPLICATIVELY in its own register and is folded
  // into tau once at the end. Entering a scattering body moves that body's
  // absorption out of sigmaCur and into rtKmK, so the Beer-Lambert line below
  // contributes exactly nothing for those segments — the two accumulators
  // partition the path rather than both charging it.
  vec3 rtKmT = vec3(1.0);     // running two-flux transmittance
  vec3 rtKmS = vec3(0.0);     // scattering of the current medium (0 = not scattering)
  vec3 rtKmK = vec3(0.0);     // absorption of the current medium, held out of sigmaCur
// <<< RT_KM
  float tPrev = 0.0;          // distance from origin to the last INTERFACE crossed
  float tOrig = 0.0;          // distance from origin to o (tPrev plus the eps step)
  vec3 o = origin;
  for (int i = 0; i < RT_SHADOW_EVENTS; i++) {
    uvec4 fi; vec3 bary; float dist; bool isDyn;
    if (!traceBoth(o, dir, fi, bary, dist, isDyn)) break;  // clear from here on
    float tHit = tOrig + dist;
    if (tHit >= maxDist - 2.0 * uEps) break;               // hit is at/behind the light
    vec4 attr = isDyn
      ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
      : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
// >>> RT_TEXTURE_TILES
    // Re-fetch at stride 2: the line above reads the wrong texels under the
    // stride-2 layout. Shadow rays do not need UVs, so the uv output is discarded.
    // GLSL forbids ternaries on opaque types (samplers), so branch explicitly.
    if (isDyn) {
      vec2 _tileUv;
      fetchAttrUv(uAttrDynamic, bary, fi.xyz, attr, _tileUv);
    } else {
      vec2 _tileUv;
      fetchAttrUv(uAttrStatic, bary, fi.xyz, attr, _tileUv);
    }
// <<< RT_TEXTURE_TILES
    // The segment just crossed, measured INTERFACE to INTERFACE — not from the
    // stepped-off origin. The two differ by the 2*eps the march skips past each
    // hit; charging tau only from o would silently under-attenuate every body by
    // 2*eps of its thickness, which is ~10% of a 4 cm slab and far more in a
    // scene whose auto-scaled eps is larger (measured, then fixed).
// >>> RT_KM
    // The segment just crossed, when it lay inside a SCATTERING body: two-flux
    // T() instead of exp(-sigma*d). This is what makes light through a wax or
    // jade body read as dimmer and warmer than absorption alone predicts —
    // scattering removes flux from the straight path that absorption would have
    // let through, so a white pigment stops getting the free ride it does under
    // Beer-Lambert, where a zero sigma means a perfectly clear shadow.
    if (rtKmS != vec3(0.0)) rtKmT *= rtKmTrans(rtKmK, rtKmS, tHit - tPrev);
// <<< RT_KM
    tau += sigmaCur * (tHit - tPrev);
    if (rtShadowGlass(attr.w) <= 0.0) return vec3(0.0);    // opaque: fully occluded
    // Glass interface: front face = entering this body, back face = back to air.
    sigmaCur = dot(attr.xyz, dir) < 0.0 ? rtAbsorbSigma(attr.w) : vec3(0.0);
// >>> RT_KM
    // Hand a scattering body's interior over to the two-flux accumulator. The
    // entering test is recomputed rather than read off sigmaCur, because a
    // pigment may legitimately have zero absorption (a pure white scatterer) and
    // would then be indistinguishable from an exit face.
    vec4 rtKmRow = rtKmFetch(attr.w);
    rtKmS = (dot(attr.xyz, dir) < 0.0 && rtKmRow.w > 0.0) ? rtKmRow.rgb : vec3(0.0);
    rtKmK = sigmaCur;
    if (rtKmS != vec3(0.0)) sigmaCur = vec3(0.0);
// <<< RT_KM
    o += dir * (dist + 2.0 * uEps);                        // step past the interface
    tOrig = tHit + 2.0 * uEps;
    tPrev = tHit;
  }
  // Tail: still inside a medium when the march ended (ran out of geometry, or
  // ran out of events). On the event cap this assumes the medium continues to
  // the light, which errs slightly DARK rather than pretending the ray is clear;
  // either way the result is a transmittance, never the hard black that would
  // reintroduce the silhouette this feature exists to remove.
// >>> RT_KM
  // Same tail rule for a scattering medium the march ended inside.
  if (rtKmS != vec3(0.0)) rtKmT *= rtKmTrans(rtKmK, rtKmS, max(maxDist - tPrev, 0.0));
// <<< RT_KM
  tau += sigmaCur * max(maxDist - tPrev, 0.0);
// >>> RT_KM
  // Fold the multiplicative two-flux factor into the optical depth so the single
  // return below stays exactly the line the stripped source has. Guarded because
  // the log costs three transcendentals and the overwhelming majority of shadow
  // rays in any scene never touch a scattering body at all.
  if (rtKmT != vec3(1.0)) tau -= log(max(rtKmT, vec3(1e-8)));
// <<< RT_KM
  return exp(-tau);
}
// <<< RT_ABSORB_SHADOWS
// World-space 3D-texture albedo ("volumetric surface albedo") for the traced
// SECONDARY rays (GI bounces + reflection/refraction), so global illumination and
// mirror views carry the same field colours the primary G-buffer shows. Compiled
// in ONLY behind RT_VOLUME_ALBEDO: this megakernel already sits at the WebGL2
// 16-sampler minimum, so the extra sampler3D is added exclusively when a scene
// registers a volume AND the GPU exposes >= 17 fragment texture units (the
// RealtimeRaytracer gates both conditions). Absent, the shader is textually
// identical to the pre-feature megakernel — same 16 samplers, same program. v1 is
// single-volume: one texture + one material index; a hit on that material samples
// the field, every other hit reads its flat table albedo unchanged.
#ifdef RT_VOLUME_ALBEDO
uniform highp sampler3D uVolumeTex;
uniform vec3 uVolumeOrigin;
uniform vec3 uVolumeSize;
uniform int uVolumeMatIndex;
vec3 sampleVolumeAlbedo(vec3 p) {
  vec3 uvw = clamp((p - uVolumeOrigin) / uVolumeSize, 0.0, 1.0);
  return texture(uVolumeTex, uvw).rgb;
}
#endif

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

// >>> RT_ABSORB_SHADOWS
  // COLOURED SHADOWS (analytic lights): the per-channel transmittance march
  // REPLACES the binary occlusion test on the line below. The splice contract
  // only ever ADDS lines — every line that survives the strip must be
  // byte-identical to master's — so the test is disabled by the "if (false)"
  // rather than by editing it, and both it and the constant branch are dead
  // before the driver's first optimisation pass.
  vec3 rtSt = shadowTransmittance(P + N * uEps, L, maxDist);
  if (rtSt == vec3(0.0)) return vec3(0.0);
  if (false)
// <<< RT_ABSORB_SHADOWS
  if (occluded(P + N * uEps, L, maxDist)) return vec3(0.0);
  vec3 li = colRad.rgb * (cone / dist2);
// >>> RT_ABSORB_SHADOWS
  li *= rtSt; // tint + attenuate; the highlight below inherits it for free
// <<< RT_ABSORB_SHADOWS
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
// >>> RT_ABSORB_SHADOWS
  // COLOURED SHADOWS (area emitters) — THE backlit-stack path: an emissive panel
  // behind stacked translucent bodies now lights what is in front of them,
  // filtered, instead of being blocked into a black silhouette. Same
  // add-lines-only splice as the analytic-light site above.
  vec3 rtSt = shadowTransmittance(P + N * uEps, wi, dist);
  if (rtSt == vec3(0.0)) return vec3(0.0);
  if (false)
// <<< RT_ABSORB_SHADOWS
  if (occluded(P + N * uEps, wi, dist)) return vec3(0.0);

  // Pick of one tri (probability 1/invProb) + uniform point on it:
  // pdf_area = 1/(invProb·area). Solid-angle conversion gives irradiance
  // Le · cosS · cosL / (d² · pdf_area).
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * invProb * t0.w / max(d2, 1e-6));
// >>> RT_ABSORB_SHADOWS
  e *= rtSt; // filtered by every absorbing body between P and the sampled point
// <<< RT_ABSORB_SHADOWS

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
// emitters (static AND dynamic — dynamic emitters now join the NEE table, their
// rows refreshed each frame) so that light isn't counted twice.
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
  vec3 hN = normalize(attr.xyz);
  if (dot(hN, rd) > 0.0) hN = -hN;
  vec3 hP = ro + rd * dist;
  // Volumetric surface albedo: if this hit is the volume material, replace its
  // flat table albedo with the 3D-texture sample at the world hit point, so GI /
  // reflection bounces carry the field colours (matches the primary G-buffer).
#ifdef RT_VOLUME_ALBEDO
  if (int(round(attr.w)) == uVolumeMatIndex) hAlbedo = sampleVolumeAlbedo(hP);
#endif
// >>> RT_TEXTURE_TILES
  // Per-texel shading for secondary rays: replace the averaged table colour with
  // the actual texel at the hit point's UV. The table colour already carries the
  // material tint (color for albedo, emissive*intensity for emissive), so
  // multiplying by the map texel gives the same result as three.js's compose:
  // color * map and emissive * emissiveMap * emissiveIntensity.
  if (uHasTextureTiles) {
    vec4 _ti = texelFetch(uMaterialsTex, ivec2(int(round(attr.w)), 69), 0);
    float _albedoTile = _ti.x;
    float _emissiveTile = _ti.y;
    if (_albedoTile >= 0.0) hAlbedo *= tileSample(_albedoTile, _tileUv).rgb;
    if (_emissiveTile >= 0.0) hEmissive *= tileSample(_emissiveTile, _tileUv).rgb;
  }
// <<< RT_TEXTURE_TILES
  vec3 Ld = sampleOneAny(hP + hN * uEps, hN);
  vec3 hLe = (!specular && uEmissiveCount > 0) ? vec3(0.0) : hEmissive;
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
//
// CHROMATIC DISPERSION (stochastic spectral sampling). Real glass has a
// wavelength-dependent ior, so white light splits into a spectrum (a diamond
// throws a rainbow). Tracing one refraction path per colour would cost three
// traceRadiance calls, but the Metal call-site budget (see the note at the
// unified secondary-ray site) forbids a fourth traceRadiance anywhere in this
// shader. Instead, when uDispersion > 0 each frame this pixel picks ONE colour
// channel c in R,G,B uniformly and traces the SAME single refraction path with
// a channel-shifted ior. The refracted radiance is then isolated to channel c
// and multiplied by 3 (to compensate the 1-of-3 pick); the temporal EMA
// averages the three per-channel estimates into a full-spectrum, dispersed
// refraction — zero extra rays, zero new call sites, unbiased in the mean. It
// therefore shimmers slightly while converging.
//
// THE MIX SPLIT. The return is mix(refrRad, reflRad, fres) = refrRad*(1-fres)
// + reflRad*fres. Only the TRANSMITTED half (refrRad) carries the channel
// mask; the reflection half (reflRad) is NOT dispersed and stays full colour
// EVERY frame. To keep the reflection deterministic frame-to-frame, the
// Fresnel weight is taken from the BASE ior (constant), not the channel-shifted
// ior — only the refracted ray DIRECTION disperses, so the reflection term
// reflRad*fres is identical every frame while refrRad*mask*3 is the spectral
// estimator.
//
// OFF-PATH IDENTITY. uDispersion == 0 skips the channel pick entirely: it
// consumes NO rand() (so the RNG stream does not shift), leaves iorC == ior and
// chanMask == vec3(1), and the whole function reduces byte-for-byte to the
// pre-dispersion path.
vec3 glassRadiance(vec3 P, vec3 N, vec3 V, float rough, float ior) {
  vec3 refl = glossyReflect(V, N, rough);
  vec3 reflRad = dot(refl, N) > 0.0
    ? traceRadiance(P + N * uEps, refl, true) + analyticGlint(P, refl)
    : vec3(0.0);

  // Per-frame spectral channel pick for the transmitted term (guarded so the
  // off path consumes no rand()).
  vec3 chanMask = vec3(1.0); // full colour (un-masked) when dispersion is off
  float iorC = ior;
  if (uDispersion > 0.0) {
    int c = min(int(rand() * 3.0), 2); // uniform channel: 0 = R, 1 = G, 2 = B
    // Normal dispersion: BLUE has the higher refractive index and bends most,
    // red least. shift = (-1.0, 0.0, +1.0) * 0.5, indexed by channel:
    // R = -0.5, G = 0, B = +0.5. uDispersion (0..0.5) scales the ior spread.
    // (The original spec vector had the R/B signs reversed — audit-corrected.)
    float shift = c == 0 ? -0.5 : (c == 2 ? 0.5 : 0.0);
    iorC = ior * (1.0 + uDispersion * shift);
    // Isolate channel c and weight x3: vec3(3,0,0) / (0,3,0) / (0,0,3). The
    // mean over the three equally-likely picks is (1/3)(3,0,0)+... = (1,1,1),
    // so E[masked refrRad] == refrRad. The OTHER channels are zero this frame.
    chanMask = c == 0 ? vec3(3.0, 0.0, 0.0)
             : c == 1 ? vec3(0.0, 3.0, 0.0)
                      : vec3(0.0, 0.0, 3.0);
  }

  float eta = 1.0 / iorC;                 // channel-shifted: drives the refraction bend
  vec3 rd = refract(V, N, eta);
  if (rd == vec3(0.0)) return reflRad;    // total internal reflection at entry
  // Fresnel from the BASE ior so the reflection/refraction split is the same
  // every frame (reflection stays full colour and un-dispersed). Equal to the
  // original schlick(..., eta) when uDispersion == 0 (iorC == ior).
  float fres = schlick(clamp(-dot(V, N), 0.0, 1.0), 1.0 / ior);

  vec3 ro = P - N * (2.0 * uEps);
  vec3 refrRad;
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    // Exit interface: refract back out (or bounce once on internal reflection).
    vec4 attr = isDyn
      ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
      : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
// >>> RT_TEXTURE_TILES
    // Re-fetch at stride 2 so the material index and normal are correct.
    // Branch explicitly: GLSL forbids ternaries on opaque types (samplers).
    if (isDyn) {
      vec2 _tileUv;
      fetchAttrUv(uAttrDynamic, bary, fi.xyz, attr, _tileUv);
    } else {
      vec2 _tileUv;
      fetchAttrUv(uAttrStatic, bary, fi.xyz, attr, _tileUv);
    }
// <<< RT_TEXTURE_TILES
    vec3 xN = normalize(attr.xyz);
    if (dot(xN, rd) > 0.0) xN = -xN;
    vec3 xP = ro + rd * dist;
    vec3 rd2 = refract(rd, xN, iorC);     // same channel-shifted ior on exit
    if (rd2 == vec3(0.0)) rd2 = reflect(rd, xN);
    refrRad = traceRadiance(xP - xN * uEps, rd2, true);
// >>> RT_KM
    // KUBELKA-MUNK. This is the only place in the shader that measures how far a
    // VIEW ray travels inside a body, which is exactly the quantity the two-flux
    // model needs — so the layer is evaluated here and handed to main through
    // globals. Placed BEFORE the Beer-Lambert line below so gKmBehind is the raw
    // radiance from behind the body, un-attenuated: scattering media replace that
    // model rather than stacking on top of it.
    //
    // THICKNESS CORRECTION. dist is measured from ro, which the line above put
    // 2*eps INSIDE the entry surface along the normal, so it under-reports the
    // chord by the distance from ro back to the entry plane: 2*eps / |rd.N|.
    // That is a fixed 7 cm in a room-sized scene — half the wall of a cast
    // shade, or MORE THAN THE FULL DEPTH of a stained-glass tile: an 8 cm pane
    // in the museum kept under 1 cm of measured chord and read nearly clear.
    // The correction is exact and applies to BOTH consumers of the chord: the
    // KM layer and the Beer-Lambert line below. (Until 0.12.1 the absorption
    // line kept 0.8.0's uncorrected chord "because a tint could absorb the
    // error"; the Lumiere screen's thin tiles proved it cannot.) Bodies
    // thinner than 2*eps along the normal remain unresolvable: ro starts
    // beyond their exit face, so the exit hit lands on some other surface and
    // no chord accounting can recover the tint. Keep exhibits chunkier than
    // 2*eps, and see the eps auto-scale in RealtimeRaytracer.
    //
    // The 0.25 floor bounds the correction at 8*eps. For real glass it never
    // binds: refraction into a denser medium caps the internal angle at
    // asin(1/ior), so rd.N is at least 0.745 at ior 1.5. It exists for the
    // ior -> 1 end of the G-buffer's [1, 1.98] range, where the refracted ray
    // approaches the view ray and can graze — there an unbounded 1/|rd.N|
    // would invent metres of chord and read the whole silhouette as masstone.
    //
    // The correction expression is spelled out inside EACH marker block rather
    // than hoisted to a shared local: these >>> <<< blocks are spliced in and
    // out independently per feature (see setAbsorption / setKmScattering), so
    // a local declared in one block is an undeclared identifier when the other
    // block compiles without it — which ships as a black frame, not an error
    // you see in dev.
    vec4 rtKmRow = rtKmFetch(attr.w);
    gKmOn = rtKmRow.w > 0.0;
    if (gKmOn) {
      rtKmLayer(rtAbsorbSigma(attr.w), rtKmRow.rgb,
        dist + 2.0 * uEps / max(abs(dot(rd, N)), 0.25), gKmR, gKmT);
      gKmBehind = refrRad;
    }
// <<< RT_KM
// >>> RT_ABSORPTION
    // BEER-LAMBERT ABSORPTION of the transmitted term. dist is the ONE
    // in-medium path length this shader computes: entry interface (P) to exit
    // interface along the refracted ray — how far the transmitted view path
    // actually travelled INSIDE the glass. Everything that came back through
    // the exit interface (surface shading behind the slab, an emissive panel's
    // glow, the sky) rides that segment, so this single multiply tints it all:
    // a thick slab tints deeper than a thin one, and a backlit pane glows in
    // the filtered colour for free. The medium is identified by the EXIT
    // interface's material (attr.w): for closed glass volumes that is the same
    // material the ray entered (the entry surface's matIndex is not in the
    // G-buffer — the packed word carries transmission/ior only), and for an
    // open sheet the exit lands on some other surface whose sigma is 0
    // (SceneCompiler only tables sigma for glass materials), so the multiply
    // is exactly 1 — no false tinting over air. Applied ONLY to the
    // transmitted term: the Fresnel reflection half never entered the medium.
    // On total internal reflection (rd2 above) the entry chord was still
    // in-medium, so attenuating remains correct; the extra post-TIR bounce
    // inside the slab is not tracked (the documented one-layer limit). Order
    // vs the dispersion channel mask below is irrelevant — both are
    // per-channel scale factors.
    // Chord corrected for the 2*eps entry offset exactly like the KM layer
    // above (same expression, kept inline for the splice-block reason given
    // there); until 0.12.1 this used the raw under-reported dist.
    refrRad *= rtTransmittance(attr.w,
      dist + 2.0 * uEps / max(abs(dot(rd, N)), 0.25));
// <<< RT_ABSORPTION
  } else {
    refrRad = uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  // Mask ONLY the transmitted term to the chosen channel (full colour when
  // dispersion is off); the reflection term is never masked.
  return mix(refrRad * chanMask, reflRad, fres);
}

// Compact cold->hot ramp for the BVH-cost heatmap. Piecewise mix of five
// anchors (deep blue -> green -> yellow -> red -> white) over four equal
// segments — cheap, no textures, no extra samplers. t is the normalised cost
// (visit count * uCostScale), clamped to [0,1]; saturating at white = the most
// expensive pixels.
vec3 costPalette(float t) {
  t = clamp(t, 0.0, 1.0);
  const vec3 c0 = vec3(0.02, 0.05, 0.45); // cold: cheap (few boxes)
  const vec3 c1 = vec3(0.05, 0.55, 0.25); // green
  const vec3 c2 = vec3(0.95, 0.85, 0.10); // yellow
  const vec3 c3 = vec3(0.90, 0.10, 0.05); // red
  const vec3 c4 = vec3(1.00, 1.00, 1.00); // hot: expensive (many boxes)
  float s = t * 4.0;
  vec3 col = mix(c0, c1, clamp(s, 0.0, 1.0));
  col = mix(col, c2, clamp(s - 1.0, 0.0, 1.0));
  col = mix(col, c3, clamp(s - 2.0, 0.0, 1.0));
  col = mix(col, c4, clamp(s - 3.0, 0.0, 1.0));
  return col;
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

// >>> RT_KM
  // A global with no initializer is undefined in GLSL until written; this is the
  // write, ahead of the specular output that reads it.
  gKmOn = false;
// <<< RT_KM
  // Reset the shadow-ray traversal-cost counter for this pixel. It accumulates
  // across every occluded() call below (direct, GI, reflection, glass) and is
  // read once at the end when uCostView is on (see the cost-heatmap branch).
  gBvhVisits = 0;

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
  // uExternalGI (experimental ReSTIR GI): the GIReservoirPass supplies the
  // bounce, so the inline GI ray is skipped — but the blend continuation is
  // NOT GI and must keep tracing regardless.
  bool wantGI = uGIEnabled && !uExternalGI && !wantBehind
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
// >>> RT_KM
  // KUBELKA-MUNK. glassRadiance set these when it measured this pixel's chord
  // through a scattering body (see the note there); a scattering body is not a
  // window, so its result REPLACES what the glass branch just wrote rather than
  // blending with it.
  //
  //   gKmR * E        light that entered the surface, scattered, and came back
  //                   out. E = (direct + indirect) is the demodulated diffuse
  //                   irradiance the surface would have used as any other
  //                   diffuse material — which is precisely what "use R as the
  //                   albedo under the normal direct-lighting path" means. The
  //                   composite then re-applies the base colour, which is why a
  //                   scattering material wants a white one.
  //   gKmT * behind   what came through from the other side. For a lampshade
  //                   with a bulb inside, "behind" IS the bulb, so this term is
  //                   the shade glowing.
  //
  // The inward half of the transmitted term is not missing, it is just computed
  // elsewhere: whatever is behind was itself lit by shadow rays that crossed
  // this same body and were attenuated by the same two-flux T (see
  // shadowTransmittance). What IS dropped is the inter-reflection between body
  // and backing — a second-order brightening — and the traced Fresnel reflection
  // (the GGX highlight below stands in for it).
  if (gKmOn) sampleIrr = gKmR * (direct + indirect) + gKmT * gKmBehind;
// <<< RT_KM

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
// >>> RT_KM
  // A scattering body is a dielectric SOLID, not a window. The (1 - transmission)
  // scale above exists so a see-through pane does not double-count its highlight
  // into the behind-image; polished jade, wax and marble have no behind-image and
  // a very real Fresnel sheen, so it is restored here rather than scaled away.
  if (gKmOn) spec = gSpec * (1.0 - metal);
// <<< RT_KM
  if (any(isnan(spec)) || any(isinf(spec))) spec = vec3(0.0);
  if (!blend) {
    float specLum = dot(spec, vec3(0.299, 0.587, 0.114));
    float specCap = uFireflyClamp * 4.0; // narrow lobes spike; keep the EMA stable
    if (specLum > specCap) spec *= specCap / specLum;
  }
  outSpecular = vec4(spec, 1.0);

  if (uRawOutput) {
    // Split-accumulation path: write RAW per-frame sample. AccumulatePass reads
    // this and does the EMA merge with neighbourhood anti-firefly clamping.
    outIrradiance = vec4(sampleIrr, 1.0);
  } else {

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

  } // end if (!uRawOutput)

  // BVH traversal-cost heatmap (outputMode 7). Overwrite the accumulated
  // lighting with the palette-mapped shadow-ray node-visit count for this pixel.
  // Alpha is forced to 1.0 so temporal history never builds on the cost image
  // (each frame is a fresh snapshot), and the specular attachment is cleared so
  // the composite's cost branch shows the palette alone. Uniform branch: when
  // uCostView is off this is skipped and the writes above stand unchanged.
  if (uCostView) {
    outIrradiance = vec4(costPalette(float(gBvhVisits) * uCostScale), 1.0);
    outSpecular = vec4(0.0);
  }
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

// Remove every line span marked with `tag` (markers included) from a shader
// source. Optional GLSL is written inline where it acts — readable right next to
// the code it extends — between ">>> tag" and "<<< tag" comment lines; dropping
// those whole lines restores the source without that feature BYTE FOR BYTE. That
// textual identity (not just an #ifdef'd-out block, which still changes the
// source text and the program cache key) is the zero-cost-when-unused guarantee:
// a scene that does not use the feature compiles the exact program it compiled
// before the feature existed. Same zero-cost intent as the RT_VOLUME_ALBEDO
// define gate, tightened to be provable with a getShaderSource diff.
//
// Three tags, stripped independently, in a strict hierarchy:
//   RT_ABSORPTION    — per-material Beer-Lambert absorption on the VIEW path.
//   RT_ABSORB_SHADOWS — coloured shadows (shadowTransmittance). Depends on the
//     absorption block's rtAbsorbSigma and on row 67 existing, so it may only be
//     spliced in when RT_ABSORPTION is too. The tags are prefix-distinct
//     ("RT_ABSORPTION" vs "RT_ABSORB_SHADOWS"), so neither substring test can
//     ever match the other's markers.
//   RT_KM — Kubelka-Munk two-flux scattering. A strict superset of both: it
//     reads K from row 67 and rides the coloured-shadow march for its shadow
//     half, so it is only ever spliced in alongside them. "RT_KM" shares no
//     prefix with either of the others.
//
// STRIPPING ORDER IS NOT FREE. `drop` is a single boolean, not a stack, so a
// NESTED block must be stripped BEFORE its parent — the RT_KM lines inside
// shadowTransmittance sit within the RT_ABSORB_SHADOWS span, and removing the
// parent first would see the inner "<<< RT_KM" and stop dropping early, taking
// the tail of the parent block with it. The constructor therefore strips
// RT_KM, then RT_ABSORB_SHADOWS, then RT_ABSORPTION — innermost outwards. (This
// is checked, not just asserted: scripts/km-selftest.mjs hashes the three
// pre-existing variants against the ones master's module builds.)
function stripMarked(src, tag) {
  const lines = src.split("\n");
  const out = [];
  let drop = false;
  for (const line of lines) {
    if (line.includes(">>> " + tag)) { drop = true; continue; }
    if (line.includes("<<< " + tag)) { drop = false; continue; }
    if (!drop) out.push(line);
  }
  return out.join("\n");
}

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

    // Beer-Lambert absorption and its coloured-shadow extension are compiled in
    // by SOURCE SPLICE, not a define: the marked lines are stripped whenever the
    // compiled scene has no absorbing material (or the caller turned coloured
    // shadows off), so each disabled program's source is byte-identical to the
    // build that predates that feature (see stripMarked). setCompiledScene drives
    // the swap from compiled.absorption; changing material.fragmentShader re-keys
    // three's program cache, so this recompiles at scene-compile time, never per
    // frame. FOUR variants, cached once here (the strip is pure string work, but
    // it should not run on a toggle) — a LADDER, not a matrix: each is the next
    // one with its outermost feature stripped off, so adding Kubelka-Munk cost
    // one more variant rather than doubling the set.
    //   _fragPlain            no absorption at all — the pre-0.8.0 program
    //   _fragAbsorption       view-path absorption only — the 0.8.0 program
    //   _fragAbsorbShadows    + coloured shadows — the 0.9.0 program
    //   _fragKm               + Kubelka-Munk two-flux scattering
    // The strips run innermost-outwards (RT_KM, then RT_ABSORB_SHADOWS, then
    // RT_ABSORPTION) because RT_KM blocks are nested inside the coloured-shadow
    // one — see the ordering note on stripMarked.
    // RT_TEXTURE_TILES is an INDEPENDENT dimension (its blocks are not nested
    // inside any absorption block except the shadow-ray site inside
    // RT_ABSORB_SHADOWS). Rather than doubling the cached-variant matrix, it is
    // stripped dynamically at splice time — a scene-compile cost, never per frame.
    const fragFull = specMRT
      ? rtLightingFrag
      : rtLightingFrag.replace(
          "layout(location = 1) out vec4 outSpecular;",
          "vec4 outSpecular; // single-target fallback: dead store"
        );
    this._fragKm = fragFull;
    this._fragAbsorbShadows = stripMarked(fragFull, "RT_KM");
    this._fragAbsorption = stripMarked(this._fragAbsorbShadows, "RT_ABSORB_SHADOWS");
    this._fragPlain = stripMarked(this._fragAbsorption, "RT_ABSORPTION");
    // Current splice state, so setAbsorption / setAbsorptionShadows / setKm* can
    // each set their own part without the caller re-stating the others.
    this._absorbOn = false;
    this._absorbShadows = true;
    // Kubelka-Munk needs BOTH halves: scene data (a material opted in, so row 68
    // exists) and the caller's opt-in flag. Split so a recompile cannot silently
    // re-enable the feature and a toggle cannot enable it on a scene with no
    // scattering material to act on.
    this._kmData = false;
    this._kmOn = false;
    // Texture tiles: analogous to KM — needs both scene data (hasTextureTiles on
    // the compiled scene) and the caller's opt-in (textureTiles option not false).
    this._tilesData = false;
    this._tilesOn = false;

    this.material = new THREE.ShaderMaterial({
      // Stable program name for compile-failure self-diagnosis: this is the
      // CORE lighting megakernel — a link failure here has no fallback (see
      // RealtimeRaytracer._passClass -> coreFailure).
      name: "rt:lighting",
      glslVersion: THREE.GLSL3,
      // RT_VOLUME_ALBEDO is injected only when a scene uses world-space 3D-texture
      // albedo AND the GPU has a spare fragment sampler (see setVolumeAlbedo +
      // RealtimeRaytracer). Absent, this megakernel is textually identical to the
      // pre-feature build — same 16 samplers, same Metal translation.
      defines: {},
      vertexShader: fullscreenVert,
      fragmentShader: this._fragPlain,
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
        uRawOutput: { value: false },
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
        uDispersion: { value: 0 },
        uLightStochastic: { value: false },
        uGIHalfRate: { value: false },
        uEnvColor: { value: new THREE.Color(0.03, 0.04, 0.06) },
        uEnvIntensity: { value: 1.0 },
        uFrame: { value: 0 },
        uEps: { value: 1e-3 },
        uGIEnabled: { value: true },
        uExternalGI: { value: false },
        uHasTextureTiles: { value: false },
        uCostView: { value: false },
        uCostScale: { value: 1 / 96 },
        uSkyEnabled: { value: false },
        uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.45).normalize() },
        uSunColor: { value: new THREE.Color(1.0, 0.9, 0.75) },
        uSkyZenith: { value: new THREE.Color(0.18, 0.34, 0.62) },
        uSkyHorizon: { value: new THREE.Color(0.7, 0.8, 0.9) },
        uSkyIntensity: { value: 1.0 },
        // World-space 3D-texture albedo (present only in the compiled program when
        // the RT_VOLUME_ALBEDO define is set; harmless otherwise — three uploads
        // only uniforms the program actually declares).
        uVolumeTex: { value: null },
        uVolumeOrigin: { value: new THREE.Vector3() },
        uVolumeSize: { value: new THREE.Vector3(1, 1, 1) },
        uVolumeMatIndex: { value: -1 },
      },
      depthTest: false,
      depthWrite: false,
    });

    // Specular temporal accumulation program (its own sampler budget — well
    // clear of the lighting pass's 16-sampler ceiling).
    this.specMaterial = new THREE.ShaderMaterial({
      // Optional additive specular buffer — a link failure degrades to the
      // Lambert-only look (RealtimeRaytracer disables `specular`), image stays lit.
      name: "rt:specular",
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
      // Resize-only history-carry blit; a link failure is non-fatal (history is
      // not carried across a resolution step) so it classifies as auxiliary.
      name: "rt:history-carry",
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
    const t = makeMRT(width, height, 2, opts);
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
    // Beer-Lambert absorption rides row 67 of the scene-data texture bound just
    // above, so the shader variant follows the compiled scene directly — no
    // uniform, no sampler, nothing for the caller to remember.
    // Kubelka-Munk rides row 68 of the same texture and is recorded first, so the
    // single splice the setAbsorption call triggers already knows about it.
    this._kmData = !!compiled.scattering;
    // Texture tiles ride rows 69+ of the same texture and the stride-2 attribute
    // layout. Recorded before the splice so the _applyAbsorptionSplice call knows
    // whether to keep the RT_TEXTURE_TILES blocks.
    this._tilesData = !!compiled.hasTextureTiles;
    this._tileSize = compiled._tileSize || 128;
    this.setAbsorption(!!compiled.absorption);
  }

  /**
   * Enable/disable texture-tile sampling for secondary rays (albedo and emissive
   * maps visible through glass, reflections, and GI bounces). When `on` is true
   * AND the compiled scene has tiles, the RT_TEXTURE_TILES block is kept in the
   * shader source and the stride-2 attribute layout is active. Recompiles the
   * megakernel: a settings-time knob, not a per-frame one.
   */
  setTextureTiles(on) {
    this._tilesOn = !!on;
    this._applyAbsorptionSplice();
  }

  /**
   * Splice in / strip out the per-material Beer-Lambert absorption path (tinted
   * glass). Driven by setCompiledScene from `compiled.absorption`, which is
   * non-null only when a material derived a non-zero sigma (attenuationColor +
   * attenuationDistance, or userData.rtAttenuation — see SceneCompiler). The
   * swap recompiles this megakernel, so it happens at scene-compile time, never
   * per frame — and with absorption off the compiled source is byte-identical
   * to the pre-feature shader (see stripMarked).
   */
  setAbsorption(on) {
    this._absorbOn = !!on;
    this._applyAbsorptionSplice();
  }

  /**
   * Splice in / strip out COLOURED SHADOWS (shadowTransmittance at the two NEE
   * shadow-ray sites). Only meaningful while absorption itself is spliced in —
   * the march reads row 67 and calls rtAbsorbSigma, both of which exist exactly
   * when the scene absorbs — so this is an AND with setAbsorption's state, and
   * turning it off restores the byte-identical absorption-only (0.8.0) source.
   * Recompiles the megakernel, so drive it from a UI toggle or scene compile,
   * never per frame.
   */
  setAbsorptionShadows(on) {
    this._absorbShadows = !!on;
    this._applyAbsorptionSplice();
  }

  /**
   * Splice in / strip out KUBELKA-MUNK TWO-FLUX SCATTERING. Takes effect only
   * when the compiled scene also carries a scattering table (setCompiledScene
   * records that), so turning it on in a scene with no scattering material
   * leaves the program byte-identical to what it was. The KM variant is a strict
   * SUPERSET — it reads K from the absorption row and its shadow half IS the
   * coloured-shadow march — so enabling it implies both of those, which is why
   * the splice below reaches for _fragKm without consulting _absorbShadows.
   * Recompiles the megakernel: a settings-time knob, not a per-frame one.
   */
  setKmScattering(on) {
    this._kmOn = !!on;
    this._applyAbsorptionSplice();
  }

  _applyAbsorptionSplice() {
    let src = !this._absorbOn
      ? this._fragPlain
      : this._kmOn && this._kmData
        ? this._fragKm
        : this._absorbShadows
          ? this._fragAbsorbShadows
          : this._fragAbsorption;
    // Texture tiles are an independent dimension: when off, strip the
    // RT_TEXTURE_TILES blocks from whichever absorption variant is active.
    // Done dynamically (not pre-cached) because the strip is cheap string work
    // and only runs at scene-compile time.
    if (!(this._tilesOn && this._tilesData)) {
      src = stripMarked(src, "RT_TEXTURE_TILES");
    } else if (this._tileSize !== 128) {
      // Inject the actual tile size from the compileScene option (default 128).
      // The shader source carries `#define TILE 128.0`; replace with the real
      // value so texelFetch coordinates match the CPU-side tile layout.
      src = src.replace("#define TILE 128.0", `#define TILE ${this._tileSize}.0`);
    }
    this.material.uniforms.uHasTextureTiles.value = !!(this._tilesOn && this._tilesData);
    if (this.material.fragmentShader === src) return;
    this.material.fragmentShader = src;
    this.material.needsUpdate = true; // three re-keys the program by source hash
  }

  /**
   * Enable/disable the world-space 3D-texture albedo path for the traced
   * SECONDARY rays (GI + reflections). Pass the compiled `volumeAlbedo` descriptor
   * ({ texture, origin, size, matIndex }) to turn it on, or null to turn it off.
   * Toggling the RT_VOLUME_ALBEDO define recompiles this megakernel (adds/removes
   * the single sampler3D), which the caller does at compile time, not per frame.
   * The caller is responsible for only enabling this when the GPU has a spare
   * fragment texture unit — this pass is at the 16-sampler minimum, so the 17th
   * sampler would fail to link on a bare-minimum WebGL2 device.
   */
  setVolumeAlbedo(volume) {
    const wasOn = this.material.defines.RT_VOLUME_ALBEDO !== undefined;
    const on = !!volume;
    const u = this.material.uniforms;
    if (on) {
      u.uVolumeTex.value = volume.texture;
      u.uVolumeOrigin.value.copy(volume.origin);
      u.uVolumeSize.value.copy(volume.size);
      u.uVolumeMatIndex.value = volume.matIndex;
    } else {
      u.uVolumeTex.value = null;
      u.uVolumeMatIndex.value = -1;
    }
    if (on !== wasOn) {
      if (on) this.material.defines.RT_VOLUME_ALBEDO = "1";
      else delete this.material.defines.RT_VOLUME_ALBEDO;
      this.material.needsUpdate = true; // recompile with/without the sampler3D
    }
  }

  /** Part 2: render RAW per-frame samples (uRawOutput=true, no EMA). Returns
   *  { rawIrradiance, rawSpecular } textures for the AccumulatePass. */
  renderRaw(renderer, gbuffer, frame, reservoirTexture = null) {
    const u = this.material.uniforms;
    u.uRawOutput.value = true;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    u.uPrevAccum.value = this._irrTex(this.targetB);
    u.uReservoir.value = reservoirTexture;
    u.uRestirEnabled.value = reservoirTexture !== null;
    u.uFrame.value = frame;

    this.quad.material = this.material;
    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);
    u.uRawOutput.value = false; // restore

    if (!this.specMRT) {
      return { rawIrradiance: this.targetA.texture, rawSpecular: null };
    }
    return {
      rawIrradiance: this.targetA.texture[0],
      rawSpecular: this.targetA.texture[1],
    };
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
