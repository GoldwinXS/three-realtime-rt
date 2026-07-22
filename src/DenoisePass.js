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
uniform bool uBlendIsSpec;       // this instance filters the specular buffer

// Optional additive input (EXPERIMENTAL ReSTIR GI): when uHasAdd is set, this
// texture's rgb is ADDED to every irradiance tap so the à-trous filter smooths
// the sum (the GI is injected here, downstream of the lighting pass's own
// temporal history, so it never double-counts through that history). The add is
// gated to the FIRST iteration by the caller (uStep == 1) — later iterations
// read the already-summed result. When uHasAdd is false this is byte-identical
// to the original filter (the alpha/history-count channel is never touched).
uniform sampler2D uAddTex;
uniform bool uHasAdd;

float luminance(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

// Irradiance tap with the optional GI add folded into rgb (alpha untouched).
// METAL DIFFUSE WEIGHT: the GI add is DIFFUSE indirect irradiance. Metals have
// essentially no diffuse response — their indirect light rides the traced
// REFLECTION path — so their diffuse weight is (1 - metalness). RTLightingPass
// applies this implicitly to the inline GI: sampleIrr = mix(direct + indirect,
// reflRad, metal), scaling inline indirect by (1 - metal) on metals. The
// external ReSTIR GI add is injected HERE, downstream of that mix, so it never
// picked up the weight — a metalness-0.85 surface (the gold torus knot) received
// full-strength diffuse GI, ~6.6x too much. That excess is not just too bright:
// it is the ReSTIR resolve's residual per-pixel variance at full amplitude,
// which reads as bright gold speckles on the curved metal (worst on iOS/Metal,
// where the firefly stack has the least headroom). Re-apply the same
// (1 - metalness) diffuse weight to the add so the two GI paths are energy-
// consistent on metals and the speckle amplitude drops with the mean. Packed
// metal word (GBufferPass): metalness lives in [0,1]; glass [2,4) and alpha
// blend [4,5] are non-metal (weight 1, unchanged from before).
vec4 sampleIrr(vec2 uv) {
  vec4 c = texture(uIrradiance, uv);
  if (uHasAdd) {
    float mw = texture(uGNormalMetal, uv).w;
    float metalT = mw < 2.0 ? clamp(mw, 0.0, 1.0) : 0.0;
    c.rgb += texture(uAddTex, uv).rgb * (1.0 - metalT);
  }
  return c;
}

void main() {
  vec4 center = sampleIrr(vUv);
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
  // Packed word ranges (see GBufferPass): [4,5] alpha blend, [2,4) glass,
  // [0,1] metal. In the IRRADIANCE buffer a blend surface carries diffuse-lit
  // direct + GI that DOES need filtering (specAmount 0); in the SPECULAR buffer
  // (uBlendIsSpec) it carries the traced behind-the-pane image, which must be
  // spared like a mirror — the pane is flat, so the G-buffer guides would let
  // the filter smear the see-through content into mush.
  float matW = nm.w;
  float specAmount = matW >= 4.0 ? (uBlendIsSpec ? 1.0 : 0.0)
    : (matW >= 2.0 ? clamp(matW - 2.0, 0.0, 1.0) : matW);
  float specKeep = specAmount * (1.0 - clamp(wp.w - 1.0, 0.0, 1.0));

  // Fewer accumulated samples -> noisier pixel -> wider luminance tolerance.
  // A converged pixel (high count) is barely touched, preserving detail.
  // The widening is CAPPED at 3x: during camera motion every pixel is fresh,
  // and an 8x-wide gate across five à-trous passes erased small contact
  // shadows entirely — objects visibly floated while orbiting ("ghostly
  // apparitions") and only grounded once the camera stopped. Blue-noise
  // sampling + ReSTIR keep fresh pixels clean enough for the tighter gate.
  float count = max(center.a, 1.0);
  float sigmaL = uLumSigma * clamp(8.0 / sqrt(count), 0.75, 3.0);

  float distToCam = distance(P, uCameraPos);
  float planeTol = 0.01 * distToCam + 20.0 * uEps;

  // Despeckle (first iteration, short history only): a freshly disoccluded
  // pixel can carry one huge sample that the center-weighted filter would
  // preserve as a bright "rain drop" at silhouettes. Such a pixel has no
  // business being brighter than its entire neighbourhood — clamp its
  // luminance to the brightest neighbour. Converged pixels are exempt, so
  // real small highlights survive.
  // With an additive GI input (uHasAdd) the despeckle must ALWAYS run on the
  // first iteration: count is the LIGHTING buffer's history depth and says
  // nothing about the GI term, which is re-resolved fresh every frame — a GI
  // firefly at a "converged" pixel would otherwise skip this clamp entirely
  // and survive to the screen (observed as white speckles on iOS).
  if (uStep < 1.5 && (count < 8.0 || uHasAdd)) {
    float maxL = 0.0;
    float found = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        vec2 tuv = vUv + vec2(float(dx), float(dy)) * uTexelSize;
        if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) continue;
        if (texture(uGWorldPos, tuv).w < 0.5) continue;
        maxL = max(maxL, luminance(sampleIrr(tuv).rgb));
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
      vec4 s = sampleIrr(tuv);
      vec3 Nt = normalize(texture(uGNormalMetal, tuv).xyz);

      float k = (dx == 0 || dy == 0) ? 2.0 : 1.0;
      float wN = pow(max(dot(N, Nt), 0.0), 32.0);
      float wZ = exp(-abs(dot(g.xyz - P, N)) / planeTol);
      // Tighten the luminance gate as the à-trous step widens: a shadow on a
      // flat floor has no geometric edge to protect it, so at high iteration
      // counts the wide passes would average it away ("floating" objects with
      // no contact shadow). Wide steps only get to blend near-equal luminance.
      float wL = exp(-abs(luminance(s.rgb) - lumC) / (sigmaL * inversesqrt(uStep)));
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
  // `blendIsSpec`: the SPECULAR-buffer instance passes true — for blend pixels
  // that buffer holds the traced behind-the-pane image, whose detail is not in
  // the G-buffer guides (the pane itself is flat), so filtering would smear it
  // into mush. The irradiance instance keeps false: there a blend pixel holds
  // the pane's own diffuse-lit surface, which does want filtering.
  constructor(width, height, { blendIsSpec = false } = {}) {
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
        uBlendIsSpec: { value: blendIsSpec },
        uAddTex: { value: null },
        uHasAdd: { value: false },
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

  /**
   * Runs `iterations` à-trous passes; returns the final filtered texture.
   * `addTexture` (EXPERIMENTAL ReSTIR GI) is added to the input on the FIRST
   * iteration only, so the filter smooths input + GI together; pass null to
   * leave the filter byte-identical to before.
   */
  render(renderer, inputTexture, gbuffer, cameraPos, eps, iterations = 3, addTexture = null) {
    const u = this.material.uniforms;
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uTexelSize.value.set(1 / this._width, 1 / this._height);
    u.uCameraPos.value.copy(cameraPos);
    u.uEps.value = eps;
    u.uAddTex.value = addTexture;

    let read = inputTexture;
    let write = this.targetA;
    for (let i = 0; i < iterations; i++) {
      u.uIrradiance.value = read;
      u.uStep.value = 1 << i;
      // The GI add is applied once, on iteration 0 — later iterations read the
      // already-summed intermediate, so adding again would double it.
      u.uHasAdd.value = addTexture !== null && i === 0;
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
