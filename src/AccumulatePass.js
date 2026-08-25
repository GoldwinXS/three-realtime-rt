import * as THREE from "three";
import { makeMRT } from "./mrtCompat.js";
import { setTargetRect } from "./lightingRect.js";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const accumulateFrag = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 outIrradiance;
layout(location = 1) out vec4 outSpecular;
layout(location = 2) out vec4 outMoments;    // RGBA: lumMean, lum2Mean, octN.x, octN.y

in vec2 vUv;

uniform sampler2D uRawIrradiance;
uniform sampler2D uRawSpecular;
uniform sampler2D uPrevIrradiance;
uniform sampler2D uPrevSpecular;
uniform sampler2D uPrevMoments;     // previous frame's moments+prevNormal
uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform sampler2D uGMotion;      // G-buffer motion vector (RG32F)
uniform float uUseMotion;        // 1 = reproject via motion vector, 0 = camera-only
uniform float uMaxHistory;
uniform float uPreFireflyClamp;
uniform float uHistoryClampK;
uniform float uLightMotion;   // 0 = lights parked, 1 = lights changed hard
uniform float uGradK;         // temporal-gradient rejection threshold, in sigmas
uniform vec3 uCameraPos;
uniform float uEps;
uniform ivec2 uTexSize;
uniform ivec2 uGbSize;

float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Octahedral normal encoding (Meyer et al. 2010). Maps a unit vector to a
// 2D point in [0,1]x[0,1], storable in two fp16 channels. The decode below
// recovers the original direction to within ~0.1 degrees.
vec2 octEncode(vec3 n) {
  n /= abs(n.x) + abs(n.y) + abs(n.z);
  vec2 e = n.z >= 0.0 ? n.xy : (vec2(1.0) - abs(n.yx)) * sign(n.xy + vec2(1e-8));
  return e * 0.5 + 0.5;
}
vec3 octDecode(vec2 e) {
  e = e * 2.0 - 1.0;
  vec3 n = vec3(e, 1.0 - abs(e.x) - abs(e.y));
  float t = max(-n.z, 0.0);
  n.x += n.x >= 0.0 ? -t : t;
  n.y += n.y >= 0.0 ? -t : t;
  return normalize(n);
}

void main() {
  ivec2 px = ivec2(vUv * vec2(uTexSize));
  ivec2 gbPx = ivec2(vUv * vec2(uGbSize));

  vec4 wp = texelFetch(uGWorldPos, gbPx, 0);
  if (wp.w < 0.5) {
    outIrradiance = vec4(0.0);
    outSpecular = vec4(0.0);
    outMoments = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  float rough = clamp(wp.w - 1.0, 0.0, 1.0);

  vec4 nmSample = texelFetch(uGNormalMetal, gbPx, 0);
  vec3 N = normalize(nmSample.xyz);
  float matW = nmSample.w;
  float metal = matW < 2.0 ? matW : 0.0;
  float transmission = (matW >= 2.0 && matW < 4.0) ? clamp(matW - 2.0, 0.0, 1.0) : 0.0;

  vec4 rawIrr = texelFetch(uRawIrradiance, px, 0);
  vec4 rawSpec = texelFetch(uRawSpecular, px, 0);

  // --- 3x3 NEIGHBOURHOOD ANTI-FIREFLY CLAMP (UNGATED) ---
  // Pure luminance rank clamp: clamp centre luminance to max neighbour
  // luminance times factor. No plane-distance gating — clamping luminance
  // DOWN cannot leak light across geometry the way averaging can (NRD).
  // Dropped the plane-distance tests that left validN=0 at lighting res.
  vec3 clampedIrr = rawIrr.rgb;
  if (uPreFireflyClamp > 0.0) {
    float maxN = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        ivec2 npx = px + ivec2(dx, dy);
        if (any(lessThan(npx, ivec2(0))) || any(greaterThanEqual(npx, uTexSize))) continue;
        maxN = max(maxN, rtLum(texelFetch(uRawIrradiance, npx, 0).rgb));
      }
    }
    float rawLum = rtLum(clampedIrr);
    float cap = maxN * uPreFireflyClamp + 1e-4;
    if (rawLum > cap) clampedIrr *= cap / max(rawLum, 1e-6);
  }

  // --- PER-TAP-VALIDITY BILINEAR REPROJECTION (SVGF standard) ---
  float count = 1.0;
  float countSpec = 1.0;
  vec3 histIrr = vec3(0.0);
  vec3 histSpec = vec3(0.0);
  vec4 histMom = vec4(0.0);

  // Motion vector (uUseMotion) vs camera-only reprojection (uPrevViewProj * P).
  // Both produce prevUv; the bilinear block below is shared. The G-buffer stores
  // the surface's PREVIOUS screen UV (see GBufferPass), so this pass applies the
  // exact same jitter correction as the camera-only path — prevRaw - (cu - vUv)
  // is bit-identical to pu -= (cu - vUv) when prevRaw === pu (static geometry).
  // The stored sentinel (out-of-bounds for surfaces behind last frame's camera)
  // is dropped by the bounds test below. prevUv = -1 is the camera-only path's
  // "no valid history" marker.
  vec2 prevUv = vec2(-1.0);
  if (uUseMotion > 0.5) {
    vec2 prevRaw = texelFetch(uGMotion, gbPx, 0).xy;
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clipC.w > 0.0) {
      vec2 cu = (clipC.xy / clipC.w) * 0.5 + 0.5;
      prevUv = prevRaw - (cu - vUv);
    }
  } else {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clip.w > 0.0 && clipC.w > 0.0) {
      vec2 pu = (clip.xy / clip.w) * 0.5 + 0.5;
      vec2 cu = (clipC.xy / clipC.w) * 0.5 + 0.5;
      pu -= cu - vUv;
      prevUv = pu;
    }
  }
  if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
      // Bilinear: sample the FOUR nearest history texels around prevUv.
      vec2 texPos = prevUv * vec2(uTexSize) - 0.5;
      ivec2 basePx = ivec2(floor(texPos));
      vec2 frac = texPos - vec2(basePx);

      float totalW = 0.0;
      vec4 sumIrr = vec4(0.0);
      vec4 sumSpec = vec4(0.0);
      vec4 sumMom = vec4(0.0);

      for (int dy = 0; dy <= 1; dy++) {
        for (int dx = 0; dx <= 1; dx++) {
          ivec2 tapPx = basePx + ivec2(dx, dy);
          if (any(lessThan(tapPx, ivec2(0))) || any(greaterThanEqual(tapPx, uTexSize))) continue;

          vec4 tapIrr = texelFetch(uPrevIrradiance, tapPx, 0);
          // count > 0: must have valid history data
          if (tapIrr.a < 1.0) continue;

          vec4 tapSpec = texelFetch(uPrevSpecular, tapPx, 0);
          vec4 tapMom = texelFetch(uPrevMoments, tapPx, 0);

          // Per-tap validity: two-sided plane distance AND normal agreement.
          vec2 tapUv = (vec2(tapPx) + 0.5) / vec2(uTexSize);
          ivec2 tapGbPx = ivec2(tapUv * vec2(uGbSize));
          vec4 tapPos = texelFetch(uPrevGWorldPos, tapGbPx, 0);
          if (tapPos.w < 0.5) continue;

          float distToCam = distance(P, uCameraPos);
          float tol = 0.005 * distToCam + 20.0 * uEps;
          if (abs(dot(P - tapPos.xyz, N)) > tol) continue;

          // NORMAL AGREEMENT: reject history whose stored normal disagrees
          // with the current surface (signed dot, no abs — a 180-degree flip
          // like the outside of a thin cornell wall must fail). Measured on
          // arena: ghost@40 1.273 -> 1.034 (-19%) for +0.004 stillNoise; the
          // plane test alone accepts these leaks (near-zero plane distance).
          // Gated on count >= 2 so the moments texel holds a real normal.
          if (tapIrr.a >= 2.0) {
            vec3 tapN = octDecode(tapMom.ba);
            if (dot(tapN, N) < 0.5) continue;
          }

          // Bilinear weight
          float bw = (dx == 0 ? (1.0 - frac.x) : frac.x)
                   * (dy == 0 ? (1.0 - frac.y) : frac.y);

          sumIrr += tapIrr * bw;
          sumSpec += tapSpec * bw;
          sumMom += tapMom * bw;
          totalW += bw;
        }
      }

      if (totalW > 0.0) {
        vec4 hi = sumIrr / totalW;
        vec4 hs = sumSpec / totalW;
        vec4 hm = sumMom / totalW;
        // SHARED count with a short cap on mirror-like pixels, exactly like
        // the old inline path: metal reflections RIDE the irradiance buffer
        // (the megakernel mixes reflRad into sampleIrr by metalness), so a
        // long history on smooth metal smears the reflection under motion.
        float specHist = max(metal, transmission) * (1.0 - rough);
        float histCap = mix(uMaxHistory, min(uMaxHistory, 10.0), specHist);
        count = clamp(hi.a, 0.0, histCap) + 1.0;
        countSpec = count;
        histIrr = hi.rgb;
        histSpec = hs.rgb;
        histMom = hm;
      }
    }
  // --- TEMPORAL GRADIENT: per-pixel history rejection on a lighting change ---
  // Every other validation in this pass asks a GEOMETRIC question, so a static
  // wall under a light that just moved passes them all and keeps averaging
  // light that is no longer there. This is the one test that asks a
  // RADIOMETRIC question: does the fresh sample still look like what this pixel
  // has been seeing?
  //
  // It only runs while the host reports light motion (uLightMotion > 0), which
  // keeps it off entirely for the parked-camera, parked-lights case that the
  // engine's noise fences measure. The threshold is noise-aware: the accumulated
  // second moment gives this pixel's own luminance sigma, so a pixel whose GI
  // estimate is naturally jumpy needs a bigger jump to be called changed, and a
  // quiet pixel needs less. Without that, a 1-sample-per-pixel raw frame would
  // trip a fixed threshold everywhere and this would just be a slow reset.
  //
  // Rejection is proportional to how far the lights actually moved: a swept
  // spotlight nudges count down each frame (staying responsive without dumping
  // the accumulation), while a hard cut drops the affected pixels to a fresh
  // sample and lets count regrow from 1, which converges at the optimal 1/n
  // rate instead of the EMA's fixed-cap rate.
  if (uLightMotion > 0.0 && count > 2.0) {
    float m1 = histMom.r;
    float sigma = sqrt(max(histMom.g - m1 * m1, 0.0));
    float d = abs(rtLum(clampedIrr) - m1);
    // The relative floor keeps near-black pixels (sigma ~ 0, m1 ~ 0) from
    // tripping on quantization alone.
    float thresh = uGradK * sigma + 0.05 * max(m1, 0.02);
    if (d > thresh) count = mix(count, 1.0, uLightMotion);
  }

  // --- HISTORY-RELATIVE SOFT CLAMP (k*sigma from temporal moments) ---
  vec3 finalIrr = clampedIrr;
  if (uHistoryClampK > 0.0 && count > 1.0) {
    float histLum = rtLum(histIrr);
    float rawLum = rtLum(finalIrr);
    float var = max(histMom.g - histMom.r * histMom.r, 0.0);
    float sigma = sqrt(max(var, 1e-6));
    float cap = max(histLum, 0.001) + uHistoryClampK * sigma;
    if (rawLum > cap) finalIrr *= cap / max(rawLum, 1e-6);
  }

  // --- EMA MERGE ---
  vec3 blendedIrr = mix(histIrr, finalIrr, 1.0 / count);
  vec3 blendedSpec = mix(histSpec, rawSpec.rgb, 1.0 / countSpec);

  if (any(isnan(blendedIrr)) || any(isinf(blendedIrr))) blendedIrr = vec3(0.0);
  if (any(isnan(blendedSpec)) || any(isinf(blendedSpec))) blendedSpec = vec3(0.0);

  outIrradiance = vec4(blendedIrr, count);
  outSpecular = vec4(blendedSpec, countSpec);

  // --- TEMPORAL MOMENT ACCUMULATION + PREV-NORMAL STORE ---
  float rawLum = rtLum(clampedIrr);
  float newLumMean  = mix(histMom.r, rawLum, 1.0 / count);
  float newLum2Mean = mix(histMom.g, rawLum * rawLum, 1.0 / count);
  vec2 octN = octEncode(N);
  outMoments = vec4(newLumMean, newLum2Mean, octN);
}
`;

export class AccumulatePass {
  constructor(width, height) {
    this._width = width;
    this._height = height;

    // 3-attachment MRT: irradiance, specular, moments+prevNormal
    this.targetA = makeMRT(width, height, 3, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.targetB = makeMRT(width, height, 3, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });

    this.material = new THREE.ShaderMaterial({
      name: "rt:accumulate",
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader: accumulateFrag,
      uniforms: {
        uRawIrradiance: { value: null },
        uRawSpecular: { value: null },
        uPrevIrradiance: { value: null },
        uPrevSpecular: { value: null },
        uPrevMoments: { value: null },
        uGWorldPos: { value: null },
        uGNormalMetal: { value: null },
        uPrevGWorldPos: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uViewProj: { value: new THREE.Matrix4() },
        uMaxHistory: { value: 48 },
        uPreFireflyClamp: { value: 0.0 },
        uLightMotion: { value: 0.0 },
        uGradK: { value: 3.0 },
        uHistoryClampK: { value: 0.0 },
        uCameraPos: { value: new THREE.Vector3() },
        uEps: { value: 1e-3 },
        uTexSize: { value: new THREE.Vector2(width, height) },
        uGbSize: { value: new THREE.Vector2() },
        uGMotion: { value: null },
        uUseMotion: { value: 0.0 },
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

  /** Toggle motion-vector reprojection (default off = camera-only). */
  setMotionVectors(enabled) {
    this.material.uniforms.uUseMotion.value = enabled ? 1.0 : 0.0;
  }

  setSize(w, h) {
    this._width = w;
    this._height = h;
    this.targetA.setSize(w, h);
    this.targetB.setSize(w, h);
    this.setRect(w, h); // setSize resets three's per-target viewport
    // setSize reallocates the ping-pong textures with UNDEFINED contents. A
    // garbage count in the history alpha makes the EMA weight ~1/garbage, so
    // whatever brightness landed there never blends out: a renderScale step
    // from the adaptive governor froze the frame permanently blown out
    // (mosquito clip, 0:04). Clear on the next render, when we have the
    // renderer. Cost: one accumulation reset per quality step, same brief
    // reconvergence the governor already causes elsewhere.
    this._needsClear = true;
  }

  /**
   * Point the pass at a `w x h` rect of its (larger) allocated targets. This
   * pass reads history by texelFetch against uTexSize, and the rect is anchored
   * at the origin, so no shader remap is needed: integer texel coordinates are
   * the same numbers they were when the target WAS the rect.
   *
   * The history still has to go: it was written on a different grid, and a
   * garbage count in the alpha freezes the EMA (see setSize). That is exactly
   * what a reallocation did, so a rect step is no worse.
   */
  setRect(w, h) {
    this._width = w;
    this._height = h;
    setTargetRect(this.targetA, w, h);
    setTargetRect(this.targetB, w, h);
    this.material.uniforms.uTexSize.value.set(w, h);
    this._needsClear = true;
  }

  render(renderer, rawIrradiance, rawSpecular, gbuffer, prevViewProj, viewProj, cameraPos, eps, maxHistory, opts = {}) {
    if (this._needsClear) {
      this._needsClear = false;
      this.clearHistory(renderer);
    }
    const u = this.material.uniforms;
    u.uRawIrradiance.value = rawIrradiance;
    u.uRawSpecular.value = rawSpecular;
    u.uPrevIrradiance.value = this.targetB.texture[0];
    u.uPrevSpecular.value = this.targetB.texture[1];
    u.uPrevMoments.value = this.targetB.texture[2];
    u.uGWorldPos.value = gbuffer.worldPos;
    u.uGNormalMetal.value = gbuffer.normalMetal;
    u.uPrevGWorldPos.value = gbuffer.prevWorldPos;
    u.uGMotion.value = gbuffer.motion;
    u.uPrevViewProj.value.copy(prevViewProj);
    u.uViewProj.value.copy(viewProj);
    u.uMaxHistory.value = maxHistory;
    u.uPreFireflyClamp.value = opts.preFireflyClamp ?? 0.0;
    u.uLightMotion.value = opts.lightMotion ?? 0.0;
    u.uGradK.value = opts.gradK ?? 3.0;
    u.uHistoryClampK.value = opts.historyClampK ?? 0.0;
    u.uCameraPos.value.copy(cameraPos);
    u.uEps.value = eps;
    const gbImg = gbuffer.worldPos.image || {};
    u.uGbSize.value.set(gbImg.width || this._width * 2, gbImg.height || this._height * 2);

    renderer.setRenderTarget(this.targetA);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);

    const outIrr = this.targetA.texture[0];
    const outSpec = this.targetA.texture[1];
    const outMom = this.targetA.texture[2];
    [this.targetA, this.targetB] = [this.targetB, this.targetA];
    return { irradiance: outIrr, specular: outSpec, moments: outMom };
  }

  clearHistory(renderer) {
    // Explicit zero: history rgb AND the count in alpha must both clear, so
    // save and restore whatever clear colour the host app uses.
    const prevColor = renderer.getClearColor(new THREE.Color());
    const prevAlpha = renderer.getClearAlpha();
    renderer.setClearColor(0x000000, 0);
    for (const t of [this.targetA, this.targetB]) {
      renderer.setRenderTarget(t);
      renderer.clearColor();
    }
    renderer.setRenderTarget(null);
    renderer.setClearColor(prevColor, prevAlpha);
  }

  dispose() {
    this.targetA.dispose();
    this.targetB.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
