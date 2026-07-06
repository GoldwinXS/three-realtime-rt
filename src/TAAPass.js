import * as THREE from "three";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Temporal anti-aliasing resolve. Runs at full resolution on the final tonemapped
// color. Reprojects the previous resolved frame through world position (same trick
// the lighting/denoise passes use — no separate motion-vector buffer needed),
// clamps that history to the current 3x3 neighborhood colour box (kills ghosting
// AND the bright disocclusion speckles), then blends. Combined with sub-pixel
// camera jitter in RealtimeRaytracer, silhouettes get supersampled over time —
// this is the analytic (FSR2 / TAAU) approach, not a learned upscaler.
const taaFrag = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

uniform sampler2D uCurrent;        // this frame's composited LDR colour
uniform sampler2D uHistory;        // previous resolved colour
uniform sampler2D uGWorldPos;      // current full-res G-buffer
uniform sampler2D uGNormalMetal;
uniform sampler2D uPrevGWorldPos;  // previous frame's G-buffer (validation)
uniform sampler2D uPrevGNormalMetal;
uniform mat4 uPrevViewProj;
uniform vec3 uCameraPos;
uniform vec2 uTexelSize;
uniform float uEps;
uniform float uBlend;              // fresh-sample weight when history is valid (~0.1)
uniform bool uReset;               // first frame after a scene/size change

void main() {
  vec3 current = texture(uCurrent, vUv).rgb;
  vec4 wp = texture(uGWorldPos, vUv);

  // Background (no geometry): no useful reprojection, show current directly.
  if (wp.w < 0.5 || uReset) {
    outColor = vec4(current, 1.0);
    return;
  }

  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);

  // Neighbourhood colour AABB (used to clamp history — the core anti-ghost /
  // anti-speckle step). Also the min corner tells us the local floor, so a
  // single bright fireflight can't survive the clamp.
  vec3 nmin = current, nmax = current;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      vec3 c = texture(uCurrent, vUv + vec2(float(dx), float(dy)) * uTexelSize).rgb;
      nmin = min(nmin, c);
      nmax = max(nmax, c);
    }
  }

  // Reproject this pixel's world point into the previous frame.
  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  if (clip.w <= 0.0) { outColor = vec4(current, 1.0); return; }
  vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
  if (prevUv.x < 0.0 || prevUv.x > 1.0 || prevUv.y < 0.0 || prevUv.y > 1.0) {
    outColor = vec4(current, 1.0);
    return;
  }

  // Validate against the previous G-buffer: same surface (plane distance) and
  // same orientation. Rejecting here is what stops smeared trails on motion.
  vec4 prevPos = texture(uPrevGWorldPos, prevUv);
  vec3 prevN = texture(uPrevGNormalMetal, prevUv).xyz;
  float distToCam = distance(P, uCameraPos);
  float tol = 0.01 * distToCam + 20.0 * uEps;
  bool valid = prevPos.w > 0.5
    && abs(dot(P - prevPos.xyz, N)) < tol
    && dot(N, normalize(prevN)) > 0.9;
  if (!valid) { outColor = vec4(current, 1.0); return; }

  vec3 history = texture(uHistory, prevUv).rgb;
  // Guard against a stray non-finite history value poisoning the buffer (it
  // would otherwise re-blend with itself every frame and stick as black).
  if (any(isnan(history)) || any(isinf(history))) {
    outColor = vec4(current, 1.0);
    return;
  }
  // Clamp history into the current neighbourhood box: removes ghosting on
  // motion and rejects bright edge speckles that history would otherwise keep.
  history = clamp(history, nmin, nmax);

  vec3 resolved = mix(history, current, uBlend);
  outColor = vec4(resolved, 1.0);
}
`;

const copyFrag = /* glsl */ `
precision highp float;
layout(location = 0) out vec4 outColor;
in vec2 vUv;
uniform sampler2D uTex;
void main() { outColor = vec4(texture(uTex, vUv).rgb, 1.0); }
`;

/**
 * Full-res temporal anti-aliasing resolve with a ping-pong history buffer.
 * `render()` resolves current+history into the write buffer, copies that to the
 * screen, and swaps. Pair with sub-pixel projection jitter for supersampled AA.
 */
export class TAAPass {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this.targetA = this._makeTarget(width, height);
    this.targetB = this._makeTarget(width, height);
    this._reset = true;

    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: taaFrag,
      uniforms: {
        uCurrent: { value: null },
        uHistory: { value: null },
        uGWorldPos: { value: null },
        uGNormalMetal: { value: null },
        uPrevGWorldPos: { value: null },
        uPrevGNormalMetal: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uCameraPos: { value: new THREE.Vector3() },
        uTexelSize: { value: new THREE.Vector2(1 / width, 1 / height) },
        uEps: { value: 1e-3 },
        uBlend: { value: 0.1 },
        uReset: { value: true },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.copyMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: copyFrag,
      uniforms: { uTex: { value: null } },
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

  setSize(width, height) {
    this._width = width;
    this._height = height;
    this.targetA.setSize(width, height);
    this.targetB.setSize(width, height);
    this.material.uniforms.uTexelSize.value.set(1 / width, 1 / height);
    this._reset = true;
  }

  /** Force the next frame to show the current sample with no history (scene changed). */
  reset() {
    this._reset = true;
  }

  /**
   * @param currentColor tonemapped LDR colour texture for this frame
   * @param gbuffer      current GBufferPass (provides curr + prev G-buffer)
   * @param prevViewProj the *jittered* view-projection used last frame
   */
  render(renderer, currentColor, gbuffer, prevViewProj, cameraPos, eps, blend) {
    const u = this.material.uniforms;
    u.uCurrent.value = currentColor;
    u.uHistory.value = this.targetB.texture; // previous resolved
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    u.uPrevGNormalMetal.value = gbuffer.prevNormalMetal;
    u.uPrevViewProj.value.copy(prevViewProj);
    u.uCameraPos.value.copy(cameraPos);
    u.uEps.value = eps;
    u.uBlend.value = blend;
    u.uReset.value = this._reset;

    // Resolve into targetA.
    this.quad.material = this.material;
    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);

    // Copy the resolved frame to the screen.
    this.quad.material = this.copyMaterial;
    this.copyMaterial.uniforms.uTex.value = this.targetA.texture;
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);

    // Swap: this frame's resolve becomes next frame's history.
    [this.targetA, this.targetB] = [this.targetB, this.targetA];
    this._reset = false;
  }

  dispose() {
    this.targetA.dispose();
    this.targetB.dispose();
    this.material.dispose();
    this.copyMaterial.dispose();
    this.quad.geometry.dispose();
  }
}
