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

vec3 acesFilm(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  vec4 albedoRough = texture(uGAlbedoRough, vUv);
  vec3 irradiance = texture(uIrradiance, vUv).rgb;
  vec3 emissive = texture(uGEmissive, vUv).rgb;

  vec3 color;
  if (wp.w < 0.5) {
    color = uBackgroundColor;
  } else {
    color = albedoRough.rgb * irradiance + emissive;
  }

  if (uOutputMode == 1) color = albedoRough.rgb;
  else if (uOutputMode == 2) color = texture(uGNormalMetal, vUv).xyz * 0.5 + 0.5;
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
