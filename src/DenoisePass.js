import * as THREE from "three";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const atrousFrag = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

uniform sampler2D uIrradiance;   // rgb = irradiance, a = history count
uniform sampler2D uGWorldPos;    // full-res guides
uniform sampler2D uGNormalMetal;
uniform vec2 uTexelSize;         // of the irradiance target
uniform float uStep;             // à-trous step: 1, 2, 4, ...
uniform vec3 uCameraPos;
uniform float uEps;
uniform float uLumSigma;

float luminance(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec4 center = texture(uIrradiance, vUv);
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outColor = center;
    return;
  }
  vec3 P = wp.xyz;
  vec4 nm = texture(uGNormalMetal, vUv);
  vec3 N = normalize(nm.xyz);
  // Specular surfaces (mirror metals, glass) carry traced reflections whose
  // detail is NOT in the G-buffer guides — filtering would smear them, and
  // their signal is nearly deterministic anyway. Scale the filter down as the
  // surface gets more mirror-like.
  float matW = nm.w;
  float specAmount = matW >= 2.0 ? clamp(matW - 2.0, 0.0, 1.0) : matW;
  float specKeep = specAmount * (1.0 - clamp(wp.w - 1.0, 0.0, 1.0));

  // Fewer accumulated samples -> noisier pixel -> wider luminance tolerance.
  // A converged pixel (high count) is barely touched, preserving detail.
  float count = max(center.a, 1.0);
  float sigmaL = uLumSigma * clamp(8.0 / sqrt(count), 0.75, 8.0);

  float distToCam = distance(P, uCameraPos);
  float planeTol = 0.01 * distToCam + 20.0 * uEps;

  // Despeckle (first iteration, short history only): a freshly disoccluded
  // pixel can carry one huge sample that the center-weighted filter would
  // preserve as a bright "rain drop" at silhouettes. Such a pixel has no
  // business being brighter than its entire neighbourhood — clamp its
  // luminance to the brightest neighbour. Converged pixels are exempt, so
  // real small highlights survive.
  if (uStep < 1.5 && count < 8.0) {
    float maxL = 0.0;
    float found = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        vec2 tuv = vUv + vec2(float(dx), float(dy)) * uTexelSize;
        if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) continue;
        if (texture(uGWorldPos, tuv).w < 0.5) continue;
        maxL = max(maxL, luminance(texture(uIrradiance, tuv).rgb));
        found = 1.0;
      }
    }
    float cap = maxL * 1.25 + 1e-4;
    float l = luminance(center.rgb);
    if (found > 0.5 && l > cap) center.rgb *= cap / l;
  }

  float lumC = luminance(center.rgb);

  // 3x3 B-spline-ish kernel, edge-avoiding weights.
  vec3 sum = center.rgb * 4.0;
  float wsum = 4.0;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      vec2 tuv = vUv + vec2(float(dx), float(dy)) * uStep * uTexelSize;
      if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) continue;

      vec4 g = texture(uGWorldPos, tuv);
      if (g.w < 0.5) continue;
      vec4 s = texture(uIrradiance, tuv);
      vec3 Nt = normalize(texture(uGNormalMetal, tuv).xyz);

      float k = (dx == 0 || dy == 0) ? 2.0 : 1.0;
      float wN = pow(max(dot(N, Nt), 0.0), 32.0);
      float wZ = exp(-abs(dot(g.xyz - P, N)) / planeTol);
      float wL = exp(-abs(luminance(s.rgb) - lumC) / sigmaL);
      float w = k * wN * wZ * wL * (1.0 - specKeep);
      sum += s.rgb * w;
      wsum += w;
    }
  }
  outColor = vec4(sum / wsum, center.a);
}
`;

/**
 * Edge-avoiding à-trous wavelet filter (SVGF-lite) on the demodulated
 * irradiance buffer, guided by the full-res G-buffer (plane distance +
 * normals) and modulated by per-pixel history count: freshly disoccluded
 * pixels get blurred hard, converged pixels stay crisp.
 */
export class DenoisePass {
  constructor(width, height) {
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);

    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: atrousFrag,
      uniforms: {
        uIrradiance: { value: null },
        uGWorldPos: { value: null },
        uGNormalMetal: { value: null },
        uTexelSize: { value: new THREE.Vector2() },
        uStep: { value: 1 },
        uCameraPos: { value: new THREE.Vector3() },
        uEps: { value: 1e-3 },
        uLumSigma: { value: 0.25 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);

    this._width = width;
    this._height = height;
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

  setSize(width, height) {
    this._width = width;
    this._height = height;
    this.targetA.setSize(width, height);
    this.targetB.setSize(width, height);
  }

  /** Runs `iterations` à-trous passes; returns the final filtered texture. */
  render(renderer, inputTexture, gbuffer, cameraPos, eps, iterations = 3) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uTexelSize.value.set(1 / this._width, 1 / this._height);
    u.uCameraPos.value.copy(cameraPos);
    u.uEps.value = eps;

    let read = inputTexture;
    let write = this.targetA;
    for (let i = 0; i < iterations; i++) {
      u.uIrradiance.value = read;
      u.uStep.value = 1 << i;
      renderer.setRenderTarget(write);
      renderer.render(this.scene, this.camera);
      read = write.texture;
      write = write === this.targetA ? this.targetB : this.targetA;
    }
    renderer.setRenderTarget(null);
    return read;
  }

  dispose() {
    this.targetA.dispose();
    this.targetB.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
