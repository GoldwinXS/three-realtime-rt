import * as THREE from "three";
import { SKY_GLSL } from "./sky.glsl.js";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const compositeFrag = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

${SKY_GLSL}

uniform sampler2D uIrradiance;
uniform sampler2D uSpecular;   // dielectric direct specular (added WITHOUT albedo)
uniform bool uSpecEnabled;
uniform sampler2D uGAlbedoRough;
uniform sampler2D uGNormalMetal;
uniform sampler2D uGWorldPos;
uniform sampler2D uGEmissive;
uniform sampler2D uVolumetric; // in-scattered light (quarter canvas res, smooth)
uniform vec2 uVolTexelSize;
uniform bool uVolEnabled;
uniform vec3 uBackgroundColor;
// 0 composite, 1 albedo, 2 normal, 3 irradiance (direct+GI), 4 worldPos,
// 5 emissive, 6 specular
uniform int uOutputMode;

// joint bilateral upsample (lighting may be rendered below full resolution)
uniform bool uUpsample;
uniform vec2 uIrrTexelSize;
uniform vec3 uCameraPos;

// Overscan crop: maps this on-screen pixel's UV into the central region of the
// padded internal image (scale.xy, offset.zw). Identity (1,1,0,0) when overscan
// is 0 or when compositing into the offscreen target that TAA later crops.
uniform vec4 uCrop;

// distance fog (applied in linear space, before tonemap)
uniform bool uFogEnabled;
uniform vec3 uFogColor;
uniform float uFogDensity;

// procedural sky background
uniform bool uSkyEnabled;
uniform mat4 uInvViewProj;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSkyIntensity;

// Reconstruct the world-space view ray for this pixel from the inverse VP.
vec3 viewRay(vec2 uv) {
  vec4 far = uInvViewProj * vec4(uv * 2.0 - 1.0, 1.0, 1.0);
  return normalize(far.xyz / far.w - uCameraPos);
}

vec3 acesFilm(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

// Upsample low-res irradiance to this full-res pixel: 4 nearest low-res taps,
// bilinear weights modulated by geometric similarity (plane distance + normal)
// so lighting never bleeds across depth or orientation discontinuities.
vec3 upsampleGuided(sampler2D tex, vec2 uv, vec3 P, vec3 N) {
  if (!uUpsample) return texture(tex, uv).rgb;

  float planeTol = 0.01 * distance(P, uCameraPos) + 1e-3;
  vec2 base = uv / uIrrTexelSize - 0.5;
  vec2 f = fract(base);
  vec2 uv00 = (floor(base) + 0.5) * uIrrTexelSize;

  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  vec3 bestGeo = vec3(0.0);
  float bestGeoW = -1.0;
  vec3 bestBil = vec3(0.0);
  float bestBilW = -1.0;
  for (int dy = 0; dy <= 1; dy++) {
    for (int dx = 0; dx <= 1; dx++) {
      vec2 tuv = uv00 + vec2(float(dx), float(dy)) * uIrrTexelSize;
      vec3 irr = texture(tex, tuv).rgb;
      float bw = (dx == 0 ? 1.0 - f.x : f.x) * (dy == 0 ? 1.0 - f.y : f.y);
      if (bw > bestBilW) { bestBilW = bw; bestBil = irr; }

      vec4 g = texture(uGWorldPos, tuv);
      if (g.w < 0.5) continue;
      vec3 Nt = normalize(texture(uGNormalMetal, tuv).xyz);
      float wPlane = exp(-abs(dot(g.xyz - P, N)) / planeTol);
      float wN = pow(max(dot(N, Nt), 0.0), 16.0);
      float gw = wPlane * wN;
      // Track the geometrically most similar tap for the fallback below.
      if (gw > bestGeoW) { bestGeoW = gw; bestGeo = irr; }
      float w = bw * gw;
      sum += irr * w;
      wsum += w;
    }
  }
  if (wsum > 1e-4) return sum / wsum;
  // All combined weights died (thin silhouette). Falling back to the closest
  // *bilinear* tap would pull lighting from the far side of the edge — under
  // TAA jitter the chosen tap flickers, which reads as bright "rain drop"
  // speckles on dark objects. Prefer the geometrically closest tap instead.
  return bestGeoW >= 0.0 ? bestGeo : bestBil;
}

void main() {
  // Sample the padded internal image at the cropped UV (identity when no crop).
  // Everything below lives in padded space, so one remap here covers all taps.
  vec2 uv = vUv * uCrop.xy + uCrop.zw;
  vec4 wp = texture(uGWorldPos, uv);
  vec4 albedoRough = texture(uGAlbedoRough, uv);
  vec3 N = normalize(texture(uGNormalMetal, uv).xyz);
  vec3 irradiance = upsampleGuided(uIrradiance, uv, wp.xyz, N);
  vec3 specular = uSpecEnabled ? upsampleGuided(uSpecular, uv, wp.xyz, N) : vec3(0.0);
  vec3 emissive = texture(uGEmissive, uv).rgb;

  vec3 color;
  if (wp.w < 0.5) {
    // Background: the procedural sky (with sun), else fog colour, else flat.
    if (uSkyEnabled) {
      color = skyColor(viewRay(uv), uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity);
    } else {
      color = uFogEnabled ? uFogColor : uBackgroundColor;
    }
  } else {
    // Diffuse is demodulated (albedo re-applied here); the dielectric specular
    // highlight is white (F0 ~= 0.04) and is added WITHOUT the albedo multiply.
    color = albedoRough.rgb * irradiance + specular + emissive;
    // Volumetric in-scatter (already radiance, not modulated by albedo). Fog
    // is low-frequency, so a wide 9-tap blur costs nothing visually and eats
    // the single-sample grain — crucial with MOVING lights, where the
    // in-scatter field changes every frame and temporal accumulation alone
    // can never converge it (grain carpeted dark scenes otherwise).
    if (uVolEnabled) {
      vec2 o1 = uVolTexelSize * 1.5;
      vec2 o2 = uVolTexelSize * 3.5;
      vec3 vol = texture(uVolumetric, uv).rgb * 0.24
        + texture(uVolumetric, uv + vec2( o1.x,  o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2(-o1.x,  o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2( o1.x, -o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2(-o1.x, -o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2( o2.x,  0.0 )).rgb * 0.07
        + texture(uVolumetric, uv + vec2(-o2.x,  0.0 )).rgb * 0.07
        + texture(uVolumetric, uv + vec2( 0.0 ,  o2.y)).rgb * 0.07
        + texture(uVolumetric, uv + vec2( 0.0 , -o2.y)).rgb * 0.07;
      color += vol;
    }
    if (uFogEnabled) {
      float dist = distance(wp.xyz, uCameraPos);
      float f = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
      color = mix(color, uFogColor, clamp(f, 0.0, 1.0));
    }
  }

  if (uOutputMode == 1) color = albedoRough.rgb;
  else if (uOutputMode == 2) color = N * 0.5 + 0.5;
  else if (uOutputMode == 3) color = irradiance;
  else if (uOutputMode == 4) color = fract(wp.xyz * 0.1);
  else if (uOutputMode == 5) color = emissive;
  else if (uOutputMode == 6) color = specular;
  else color = acesFilm(color);

  outColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
}
`;

/** Combines G-buffer albedo/emissive with accumulated irradiance, tonemaps, writes to screen. */
export class CompositePass {
  constructor() {
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: compositeFrag,
      uniforms: {
        uIrradiance: { value: null },
        uSpecular: { value: null },
        uSpecEnabled: { value: false },
        uGAlbedoRough: { value: null },
        uGNormalMetal: { value: null },
        uGWorldPos: { value: null },
        uGEmissive: { value: null },
        uVolumetric: { value: null },
        uVolTexelSize: { value: new THREE.Vector2() },
        uVolEnabled: { value: false },
        uBackgroundColor: { value: new THREE.Color(0.01, 0.012, 0.02) },
        uOutputMode: { value: 0 },
        uUpsample: { value: false },
        uIrrTexelSize: { value: new THREE.Vector2() },
        uCameraPos: { value: new THREE.Vector3() },
        uCrop: { value: new THREE.Vector4(1, 1, 0, 0) },
        uFogEnabled: { value: false },
        uFogColor: { value: new THREE.Color(0.5, 0.6, 0.7) },
        uFogDensity: { value: 0.05 },
        uSkyEnabled: { value: false },
        uInvViewProj: { value: new THREE.Matrix4() },
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

  // `crop` is the overscan central-crop transform (THREE.Vector4 scale.xy /
  // offset.zw); pass null for no crop (identity) — used when compositing into the
  // padded offscreen target that TAA crops later.
  render(renderer, irradianceTexture, gbuffer, background, target = null, specularTexture = null, crop = null) {
    const u = this.material.uniforms;
    u.uIrradiance.value = irradianceTexture;
    u.uSpecular.value = specularTexture;
    u.uSpecEnabled.value = specularTexture !== null;
    u.uGAlbedoRough.value = gbuffer.albedoRough;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGEmissive.value = gbuffer.emissive;
    if (crop) u.uCrop.value.copy(crop);
    else u.uCrop.value.set(1, 1, 0, 0);
    if (background && background.isColor) {
      u.uBackgroundColor.value.copy(background);
    }
    renderer.setRenderTarget(target);
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
