import * as THREE from "three";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Copies a texture into the bound target, bilinearly resampling when the sizes
// differ (history targets use LinearFilter, so a resolution change is handled
// for free). uCountClamp < 0 copies verbatim; >= 0 caps the alpha channel —
// used to carry accumulation history across a reallocation while REDUCING (not
// zeroing) the per-pixel sample count, so the temporal EMA reconverges smoothly
// instead of strobing back to raw 1-spp noise.
const copyFrag = /* glsl */ `
precision highp float;
layout(location = 0) out vec4 outColor;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uCountClamp;
void main() {
  vec4 c = texture(uTex, vUv);
  if (uCountClamp >= 0.0) c.a = min(c.a, uCountClamp);
  outColor = c;
}
`;

/**
 * Minimal fullscreen texture copy on its own program (one sampler — safely
 * separate from the 16-sampler lighting pass). Used to blit history buffers
 * into freshly reallocated targets during a resolution change: the linear
 * resample absorbs the size difference, and the optional alpha clamp turns a
 * hard accumulation reset into a soft "keep a few frames of confidence" carry.
 */
export class CopyPass {
  constructor() {
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: copyFrag,
      uniforms: {
        uTex: { value: null },
        uCountClamp: { value: -1 },
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

  /**
   * Blit srcTexture into dstTarget. countClamp < 0 copies rgba verbatim; >= 0
   * caps the alpha (accumulation-count) channel to that value.
   */
  blit(renderer, srcTexture, dstTarget, countClamp = -1) {
    this.material.uniforms.uTex.value = srcTexture;
    this.material.uniforms.uCountClamp.value = countClamp;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(dstTarget);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(prev);
  }

  dispose() {
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
