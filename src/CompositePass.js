import * as THREE from "three";

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

uniform sampler2D uIrradiance;
uniform sampler2D uGAlbedoRough;
uniform sampler2D uGNormalMetal;
uniform sampler2D uGWorldPos;
uniform sampler2D uGEmissive;
uniform vec3 uBackgroundColor;
// 0 composite, 1 albedo, 2 normal, 3 irradiance (direct+GI), 4 worldPos, 5 emissive
uniform int uOutputMode;

// joint bilateral upsample (lighting may be rendered below full resolution)
uniform bool uUpsample;
uniform vec2 uIrrTexelSize;
uniform vec3 uCameraPos;

vec3 acesFilm(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

// Upsample low-res irradiance to this full-res pixel: 4 nearest low-res taps,
// bilinear weights modulated by geometric similarity (plane distance + normal)
// so lighting never bleeds across depth or orientation discontinuities.
vec3 sampleIrradiance(vec2 uv, vec3 P, vec3 N) {
  if (!uUpsample) return texture(uIrradiance, uv).rgb;

  float planeTol = 0.01 * distance(P, uCameraPos) + 1e-3;
  vec2 base = uv / uIrrTexelSize - 0.5;
  vec2 f = fract(base);
  vec2 uv00 = (floor(base) + 0.5) * uIrrTexelSize;

  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  vec3 fallback = vec3(0.0);
  float fallbackW = -1.0;
  for (int dy = 0; dy <= 1; dy++) {
    for (int dx = 0; dx <= 1; dx++) {
      vec2 tuv = uv00 + vec2(float(dx), float(dy)) * uIrrTexelSize;
      vec3 irr = texture(uIrradiance, tuv).rgb;
      float bw = (dx == 0 ? 1.0 - f.x : f.x) * (dy == 0 ? 1.0 - f.y : f.y);
      // Track best bilinear tap as a fallback if all weights die.
      if (bw > fallbackW) { fallbackW = bw; fallback = irr; }

      vec4 g = texture(uGWorldPos, tuv);
      if (g.w < 0.5) continue;
      vec3 Nt = normalize(texture(uGNormalMetal, tuv).xyz);
      float wPlane = exp(-abs(dot(g.xyz - P, N)) / planeTol);
      float wN = pow(max(dot(N, Nt), 0.0), 16.0);
      float w = bw * wPlane * wN;
      sum += irr * w;
      wsum += w;
    }
  }
  return wsum > 1e-4 ? sum / wsum : fallback;
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  vec4 albedoRough = texture(uGAlbedoRough, vUv);
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  vec3 irradiance = sampleIrradiance(vUv, wp.xyz, N);
  vec3 emissive = texture(uGEmissive, vUv).rgb;

  vec3 color;
  if (wp.w < 0.5) {
    color = uBackgroundColor;
  } else {
    color = albedoRough.rgb * irradiance + emissive;
  }

  if (uOutputMode == 1) color = albedoRough.rgb;
  else if (uOutputMode == 2) color = N * 0.5 + 0.5;
  else if (uOutputMode == 3) color = irradiance;
  else if (uOutputMode == 4) color = fract(wp.xyz * 0.1);
  else if (uOutputMode == 5) color = emissive;
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
        uGAlbedoRough: { value: null },
        uGNormalMetal: { value: null },
        uGWorldPos: { value: null },
        uGEmissive: { value: null },
        uBackgroundColor: { value: new THREE.Color(0.01, 0.012, 0.02) },
        uOutputMode: { value: 0 },
        uUpsample: { value: false },
        uIrrTexelSize: { value: new THREE.Vector2() },
        uCameraPos: { value: new THREE.Vector3() },
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

  render(renderer, irradianceTexture, gbuffer, background) {
    const u = this.material.uniforms;
    u.uIrradiance.value = irradianceTexture;
    u.uGAlbedoRough.value = gbuffer.albedoRough;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGEmissive.value = gbuffer.emissive;
    if (background && background.isColor) {
      u.uBackgroundColor.value.copy(background);
    }
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
