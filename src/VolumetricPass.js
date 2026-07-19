import * as THREE from "three";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { MAX_LIGHTS } from "./SceneCompiler.js";

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

#define MAX_LIGHTS ${MAX_LIGHTS}
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

uniform vec4 uLightPosType[MAX_LIGHTS];
uniform vec4 uLightColorRadius[MAX_LIGHTS];
uniform int uLightCount;
uniform int uEmissiveCount;

uniform vec3 uCameraPos;
uniform float uFrame;
uniform float uEps;
uniform float uDensity;   // scatter coefficient
uniform float uMaxDist;   // cap for rays that hit nothing / far surfaces

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

vec3 randUnitVector() {
  vec2 u = rand2();
  float z = u.x * 2.0 - 1.0;
  float a = u.y * 2.0 * PI;
  float r = sqrt(max(0.0, 1.0 - z * z));
  return vec3(r * cos(a), r * sin(a), z);
}

bool occluded(vec3 ro, vec3 rd, float maxDist) {
  uvec4 fi; vec3 fn; vec3 bc; float side; float dist;
  if (bvhIntersectFirstHit(bvhStatic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  if (uHasDynamic && bvhIntersectFirstHit(bvhDynamic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  return false;
}

// In-scattered radiance at a point in the volume from analytic light i.
// Like the surface version but with no cosine term (isotropic phase, folded
// into uDensity along with 1/4π).
vec3 lightAt(int i, vec3 S) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];
  if (posType.w < 0.5) {
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - S;
    float dist = length(d);
    if (dist < 1e-4) return vec3(0.0);
    if (occluded(S, d / dist, dist)) return vec3(0.0);
    return colRad.rgb / (dist * dist);
  }
  vec3 L = normalize(-posType.xyz + randUnitVector() * colRad.w);
  if (occluded(S, L, 1e7)) return vec3(0.0);
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
  if (occluded(S, wi, dist)) return vec3(0.0);
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

  // Segment to integrate: camera → surface (or the fog cap on a miss).
  bool hit = wp.w > 0.5;
  vec3 P = wp.xyz;
  float segLen = hit ? min(distance(P, uCameraPos), uMaxDist) : uMaxDist;
  vec3 rd = hit
    ? normalize(P - uCameraPos)
    : vec3(0.0); // background without geometry: skip (no stable ray direction here)

  vec3 sample_ = vec3(0.0);
  if (hit && segLen > 1e-3) {
    // ONE jittered point on the segment (uniform pdf 1/segLen).
    float t = rand() * segLen;
    vec3 S = uCameraPos + rd * t;
    vec3 Lin = vec3(0.0);
    // Stochastically pick analytic lights or the emissive set, weighted 1/p.
    bool hasL = uLightCount > 0;
    bool hasE = uEmissiveCount > 0;
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
    // transmittance to the camera + estimator weight (segLen / pdf-normalized)
    sample_ = Lin * uDensity * segLen * exp(-uDensity * t);
    // Single-sample spike clamp — same reasoning as the surface firefly clamp:
    // the EMA decays outliers only as 1/count, so they read as grain.
    float sl = dot(sample_, vec3(0.299, 0.587, 0.114));
    if (sl > 4.0) sample_ *= 4.0 / sl;
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
  constructor(width, height) {
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);

    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: volumetricFrag,
      uniforms: {
        bvhStatic: { value: null },
        bvhDynamic: { value: null },
        uHasDynamic: { value: false },
        uMaterialsTex: { value: null },
        uGWorldPos: { value: null },
        uPrevAccum: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uMaxHistory: { value: 48 },
        uLightPosType: { value: [] },
        uLightColorRadius: { value: [] },
        uLightCount: { value: 0 },
        uEmissiveCount: { value: 0 },
        uCameraPos: { value: new THREE.Vector3() },
        uFrame: { value: 0 },
        uEps: { value: 1e-3 },
        uDensity: { value: 0.03 },
        uMaxDist: { value: 40 },
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

  /** Renders into targetA (reading targetB as history), swaps, returns the texture. */
  render(renderer, gbuffer, prevViewProj, cameraPos, frame, eps, density, maxDist) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uPrevAccum.value = this.targetB.texture;
    u.uPrevViewProj.value.copy(prevViewProj);
    u.uCameraPos.value.copy(cameraPos);
    u.uFrame.value = frame;
    u.uEps.value = eps;
    u.uDensity.value = density;
    u.uMaxDist.value = maxDist;

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
