import * as THREE from "three";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { MAX_LIGHTS, clampMaxLights } from "./SceneCompiler.js";
import { BVH_ANY_HIT_GLSL } from "./bvhAnyHit.glsl.js";

// Must match MAX_FOG_ZONES in the fragment shader.
const MAX_FOG_ZONES = 8;

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Physically-based single-scatter volumetric light ("god rays"): for each
// pixel, pick ONE jittered point along the camera ray, sample ONE light
// source there, and cast a real BVH shadow ray — shafts are carved by actual
// occluders, not screen-space tricks, and work for off-screen sources too.
// One occlusion ray per pixel per frame; the Monte Carlo estimate converges
// through the same EMA temporal accumulation the surface lighting uses.
const volumetricFrag = /* glsl */ `
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${shaderStructs}
${shaderIntersectFunction}
${BVH_ANY_HIT_GLSL}

#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE
#define PI 3.14159265358979

layout(location = 0) out vec4 outScatter;

in vec2 vUv;

uniform BVH bvhStatic;
uniform BVH bvhDynamic;
uniform bool uHasDynamic;
uniform sampler2D uMaterialsTex;   // row 1: emissive NEE triangles
uniform sampler2D uGWorldPos;

// temporal accumulation (reprojected through the SURFACE point — an
// approximation for a view-ray quantity, good enough for smooth fog)
uniform sampler2D uPrevAccum;
uniform mat4 uPrevViewProj;
uniform float uMaxHistory;

// THE LIGHT TABLE lives in one row of uMaterialsTex (row = uLightRow), 4 texels
// per seat: see SceneCompiler's layout comment. Until 0.16.0 these were three
// vec4[MAX_LIGHTS] uniform arrays, which is what capped a scene at 32 lights.
uniform int uLightRow;
vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); } // spot: direction.xyz + cos(outer)
uniform int uLightCount;
uniform int uEmissiveCount;

uniform vec3 uCameraPos;
uniform float uFrame;
uniform float uEps;
uniform float uDensity;   // scatter coefficient (global term)
uniform float uMaxDist;   // cap for rays that hit nothing / far surfaces

// Localized fog zones: up to 8 AABBs. Two vec4 per zone —
//   [2*i]   = (min.xyz, density),  [2*i+1] = (max.xyz, unused).
// Density at a point = uDensity + Σ density of every zone containing it.
#define MAX_FOG_ZONES 8
uniform vec4 uFogZones[MAX_FOG_ZONES * 2];
uniform int uFogZoneCount;

float fogDensityAt(vec3 p) {
  float d = uDensity;
  for (int i = 0; i < MAX_FOG_ZONES; i++) {
    if (i >= uFogZoneCount) break;
    vec4 lo = uFogZones[i * 2];
    vec3 mn = lo.xyz;
    vec3 mx = uFogZones[i * 2 + 1].xyz;
    if (all(greaterThanEqual(p, mn)) && all(lessThanEqual(p, mx))) {
      d += lo.w;
    }
  }
  return d;
}

// Slab test of the camera ray segment [0, segLen] against every zone AABB.
// True iff some t in [0, segLen] lies inside at least one zone. Used by the
// cull below: when only zones scatter (uDensity <= 0), a ray that touches none
// of them contributes exactly zero to the march, so the whole loop is skipped.
// Each box is fattened by uEps so a ray that grazes a zone face is never culled:
// a false NEGATIVE would change the image, while a false positive only wastes a
// march whose in-scatter product is zero anyway (the image stays bit-identical).
bool rayHitsAnyZone(vec3 ro, vec3 rd, float segLen) {
  for (int i = 0; i < MAX_FOG_ZONES; i++) {
    if (i >= uFogZoneCount) break;
    vec3 mn = uFogZones[i * 2].xyz - uEps;
    vec3 mx = uFogZones[i * 2 + 1].xyz + uEps;
    float t0 = 0.0, t1 = segLen;
    if (rd.x != 0.0) {
      float ta = (mn.x - ro.x) / rd.x;
      float tb = (mx.x - ro.x) / rd.x;
      t0 = max(t0, min(ta, tb));
      t1 = min(t1, max(ta, tb));
    } else if (ro.x < mn.x || ro.x > mx.x) { continue; }
    if (rd.y != 0.0) {
      float ta = (mn.y - ro.y) / rd.y;
      float tb = (mx.y - ro.y) / rd.y;
      t0 = max(t0, min(ta, tb));
      t1 = min(t1, max(ta, tb));
    } else if (ro.y < mn.y || ro.y > mx.y) { continue; }
    if (rd.z != 0.0) {
      float ta = (mn.z - ro.z) / rd.z;
      float tb = (mx.z - ro.z) / rd.z;
      t0 = max(t0, min(ta, tb));
      t1 = min(t1, max(ta, tb));
    } else if (ro.z < mn.z || ro.z > mx.z) { continue; }
    if (t0 <= t1) return true;
  }
  return false;
}

// ---------- RNG ----------
// First four dims from the shared blue-noise tile (rows 2..65 of the
// scene-data texture) with an R2 temporal shift; the rest is PCG. Same
// scheme as RTLightingPass — see the comment there.
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

vec3 randUnitVector() {
  vec2 u = rand2();
  float z = u.x * 2.0 - 1.0;
  float a = u.y * 2.0 * PI;
  float r = sqrt(max(0.0, 1.0 - z * z));
  return vec3(r * cos(a), r * sin(a), z);
}

// Local scatter coefficient at the current march step (0 outside every zone
// when uDensity <= 0). lightAt/emissiveAt skip their BVH shadow ray when it is
// zero - the in-scatter product is zero there anyway - while STILL drawing the
// same RNG values, so the per-pixel random stream never shifts and the image
// stays byte-identical to the un-culled pass. The skip is a nested if (not an
// AND) so the traversal is provably not evaluated when gScatter is zero on
// every GLSL backend, not just ones that guarantee short-circuit evaluation.
float gScatter;

// Any-hit: first blocker wins, no closest-hit sorting (see bvhAnyHit.glsl.js).
bool occluded(vec3 ro, vec3 rd, float maxDist) {
  if (bvhIntersectAnyHit(bvhStatic, ro, rd, maxDist - 2.0 * uEps)) return true;
  if (uHasDynamic && bvhIntersectAnyHit(bvhDynamic, ro, rd, maxDist - 2.0 * uEps)) return true;
  return false;
}

// In-scattered radiance at a point in the volume from analytic light i.
// Like the surface version but with no cosine term (isotropic phase, folded
// into uDensity along with 1/4π).
vec3 lightAt(int i, vec3 S) {
  vec4 posType = lightPosType(i);
  vec4 colRad = lightColorRadius(i);
  if (posType.w < 0.5 || posType.w >= 1.5) {
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - S;
    float dist = length(d);
    if (dist < 1e-4) return vec3(0.0);
    float cone = 1.0;
    if (posType.w >= 1.5) {
      // spot: this is what draws visible light CONES in fog
      vec4 dc = lightDirCone(i);
      cone = smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, -d / dist));
      if (cone <= 0.0) return vec3(0.0);
    }
    if (gScatter > 0.0) {
      if (occluded(S, d / dist, dist)) return vec3(0.0);
    }
    return colRad.rgb * (cone / (dist * dist));
  }
  vec3 L = normalize(-posType.xyz + randUnitVector() * colRad.w);
  if (gScatter > 0.0) {
    if (occluded(S, L, 1e7)) return vec3(0.0);
  }
  return colRad.rgb;
}

// In-scattered radiance from one sampled emissive triangle (row 1 of the
// materials texture — same layout the lighting pass uses).
vec3 emissiveAt(vec3 S) {
  if (uEmissiveCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1) * 4;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(i, 1), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(i + 1, 1), 0);
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(i + 2, 1), 0);
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(i + 3, 1), 0);
  vec2 u = rand2();
  if (u.x + u.y > 1.0) u = 1.0 - u;
  vec3 lp = t0.xyz + t1.xyz * u.x + t2.xyz * u.y;
  vec3 d = lp - S;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;
  float cosL = abs(dot(t3.xyz, wi));
  if (cosL < 1e-4) return vec3(0.0);
  if (gScatter > 0.0) {
    if (occluded(S, wi, dist)) return vec3(0.0);
  }
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosL * float(uEmissiveCount) * t0.w / max(d2, 1e-4));
  // same close-range variance clamp idea as the surface pass
  float l = dot(e, vec3(0.299, 0.587, 0.114));
  if (l > 20.0) e *= 20.0 / l;
  return e;
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 2153u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  // Segment to integrate: camera → surface (or the fog cap on a miss).
  bool hit = wp.w > 0.5;
  vec3 P = wp.xyz;
  float segLen = hit ? min(distance(P, uCameraPos), uMaxDist) : uMaxDist;
  vec3 rd = hit
    ? normalize(P - uCameraPos)
    : vec3(0.0); // background without geometry: skip (no stable ray direction here)

  // STRATIFIED MARCH: several jittered steps per ray instead of one point.
  // This pass runs at quarter canvas resolution (fog is low-frequency), so
  // the extra steps cost less than the old single-sample full-lighting-res
  // version — and MOVING lights, whose in-scatter field changes every frame
  // and can never converge temporally, get real per-frame averaging.
  // Nothing to scatter: no global fog AND no localized zones → output zeros fast.
  if (uDensity <= 0.0 && uFogZoneCount == 0) {
    outScatter = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  #define VOL_STEPS 4
  vec3 sample_ = vec3(0.0);
  if (hit && segLen > 1e-3) {
    bool hasL = uLightCount > 0;
    bool hasE = uEmissiveCount > 0;
    float segStep = segLen / float(VOL_STEPS);
    // Zone cull (0.16.2 prep; measured on an RTX 3060 in the Hangar gallery,
    // dev/gpu-floor wave 3G): with density 0 + one localized shaft zone this
    // pass was 20.7 ms at canvas 1.0, flat in renderScale, because every
    // quarter-canvas pixel paid VOL_STEPS BVH shadow rays for a product that
    // was exactly zero outside the zone. So when only zones scatter, slab-test
    // the ray segment against every zone AABB first: a ray that touches none
    // of them contributes zero to sample_, and the whole march is skipped.
    // The temporal blend below still runs, so history decays identically.
    bool march = uDensity > 0.0 || rayHitsAnyZone(uCameraPos, rd, segLen);
    if (march) {
      // Piecewise integration: density can vary along the ray (zones), so the
      // transmittance is built up step by step from the LOCAL density at each
      // sample rather than a single closed-form exp(-uDensity * t).
      float opticalDepth = 0.0;
      for (int k = 0; k < VOL_STEPS; k++) {
        float t = (float(k) + rand()) * segStep; // ascending strata
        vec3 S = uCameraPos + rd * t;
        float local = fogDensityAt(S);
        gScatter = local;   // gates the shadow rays below; 0 outside fog/zones
        opticalDepth += local * segStep;
        vec3 Lin = vec3(0.0);
        // Stochastically pick analytic lights or the emissive set, weighted 1/p.
        if (hasL && hasE) {
          if (rand() < 0.5) {
            int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
            Lin = lightAt(i, S) * float(uLightCount) * 2.0;
          } else {
            Lin = emissiveAt(S) * 2.0;
          }
        } else if (hasL) {
          int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
          Lin = lightAt(i, S) * float(uLightCount);
        } else if (hasE) {
          Lin = emissiveAt(S);
        }
        vec3 c = Lin * local * segStep * exp(-opticalDepth);
        // per-step spike clamp — outliers decay only as 1/count in the EMA
        float sl = dot(c, vec3(0.299, 0.587, 0.114));
        if (sl > 2.0) c *= 2.0 / sl;
        sample_ += c;
      }
    }
  }

  // --- temporal accumulation, reprojected through the surface point ---
  float count = 1.0;
  vec3 history = vec3(0.0);
  if (hit) {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    if (clip.w > 0.0) {
      vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
      if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
        vec4 h = texture(uPrevAccum, prevUv);
        count = clamp(h.a, 0.0, uMaxHistory) + 1.0;
        history = h.rgb;
      }
    }
  }
  vec3 blended = mix(history, sample_, 1.0 / count);
  if (any(isnan(blended)) || any(isinf(blended))) blended = vec3(0.0);
  outScatter = vec4(blended, count);
}
`;

/**
 * Optional volumetric lighting pass at lighting resolution. Ping-pongs an
 * accumulation buffer like RTLightingPass; the composite adds the result
 * before fog/tonemap. Cost when enabled ≈ one extra shadow ray per lighting
 * pixel per frame.
 */
export class VolumetricPass {
  constructor(width, height, { maxLights = MAX_LIGHTS } = {}) {
    this.maxLights = clampMaxLights(maxLights);
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);

    this.material = new THREE.ShaderMaterial({
      // Stable program name for compile-failure self-diagnosis; a link failure
      // disables the optional `volumetric` feature (image stays lit, no god rays).
      name: "rt:volumetric",
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: volumetricFrag.replace(/RT_MAX_LIGHTS_VALUE/g, String(this.maxLights)),
      uniforms: {
        bvhStatic: { value: null },
        bvhDynamic: { value: null },
        uHasDynamic: { value: false },
        uMaterialsTex: { value: null },
        uGWorldPos: { value: null },
        uPrevAccum: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uMaxHistory: { value: 48 },
        uLightRow: { value: 0 },
        uLightCount: { value: 0 },
        uEmissiveCount: { value: 0 },
        uCameraPos: { value: new THREE.Vector3() },
        uFrame: { value: 0 },
        uEps: { value: 1e-3 },
        uDensity: { value: 0.03 },
        uMaxDist: { value: 40 },
        // Localized fog zones: flat vec4 array, two vec4 per zone (see shader).
        uFogZones: { value: new Array(MAX_FOG_ZONES * 2).fill(0).map(() => new THREE.Vector4()) },
        uFogZoneCount: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    // Reused per-frame scratch so we don't allocate the zone vectors each call.
    this._zoneVecs = this.material.uniforms.uFogZones.value;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  _makeTarget(width, height) {
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

  setCompiledScene(compiled) {
    const u = this.material.uniforms;
    u.bvhStatic.value = compiled.staticBvhUniform;
    u.bvhDynamic.value = compiled.dynamicBvhUniform;
    u.uHasDynamic.value = compiled.hasDynamic;
    u.uMaterialsTex.value = compiled.materialsTex;
    u.uLightRow.value = compiled.lightRow;
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

  /** Renders into targetA (reading targetB as history), swaps, returns the texture. */
  render(renderer, gbuffer, prevViewProj, cameraPos, frame, eps, density, maxDist, zones) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uPrevAccum.value = this.targetB.texture;
    u.uPrevViewProj.value.copy(prevViewProj);
    u.uCameraPos.value.copy(cameraPos);
    u.uFrame.value = frame;
    u.uEps.value = eps;
    u.uDensity.value = density;
    u.uMaxDist.value = maxDist;

    // Pack up to MAX_FOG_ZONES AABBs into the flat vec4 array, two vec4 per
    // zone: [min.xyz, density] then [max.xyz, 0]. Reuses cached Vector4s.
    const zn = zones && zones.length ? Math.min(zones.length, MAX_FOG_ZONES) : 0;
    for (let i = 0; i < zn; i++) {
      const z = zones[i];
      this._zoneVecs[i * 2].set(z.min[0], z.min[1], z.min[2], z.density);
      this._zoneVecs[i * 2 + 1].set(z.max[0], z.max[1], z.max[2], 0);
    }
    u.uFogZoneCount.value = zn;

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
