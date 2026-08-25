import * as THREE from "three";

/**
 * SUB-RECT LIGHTING TARGETS (0.16.10)
 * ==================================
 *
 * Every lighting-resolution target used to be REALLOCATED whenever renderScale
 * moved: the adaptive governor's own ladder therefore issued a fresh set of
 * render-target allocations, and retired the previous set, every time it changed
 * its mind. On a desktop driver that is invisible. On iOS it is the classic way
 * to fragment GPU memory: an owner's iPhone 12 Pro lost its WebGL context to
 * `webglcontextlost (memory)` after seven minutes of play with every COUNTED
 * resource flat (533 textures, 1830 geometries, 51 programs) and the ONLY thing
 * moving being renderScale, which the governor stepped roughly once a second.
 *
 * So the lighting-resolution targets are now allocated ONCE, at the renderScale
 * CAP (`renderScaleMax`), and a renderScale step renders into a SUB-RECT of
 * those fixed targets, anchored at the origin:
 *
 *   write   the render target's own `viewport` + `scissor` (never
 *           renderer.setViewport, which would persist onto the canvas), so a
 *           pass draws its fullscreen quad over the rect only. `vUv` still
 *           spans 0..1 across the rect, so every shader keeps working in
 *           SCREEN uv space, `gl_FragCoord` still starts at 0, and every
 *           `texelFetch` / resolution uniform keeps using the RECT size.
 *   read    a lighting-resolution texture is now bigger than the rect, so the
 *           sample point has to be squeezed into it: `rectUv(uv)`, below.
 *
 * `rectUv` is exact rather than approximate. Texel offsets stay correct without
 * touching a single one of them: a shader that taps `uv + off / rectSize` and
 * then remaps by `uRectScale = rectSize / allocSize` lands on
 * `uv * uRectScale + off / allocSize`, which is exactly `off` texels of the
 * allocated texture. And at the cap rung (`uRectScale == 1`) the clamp only
 * bites inside the last half texel, where CLAMP_TO_EDGE already flattened the
 * result, so the whole path is byte-identical to the pre-0.16.10 renderer there.
 *
 * What still reallocates, by design: a change of the CAP itself
 * (`renderScaleMax`, e.g. the app's quality preset or a denoiser plugin's
 * preferences) and a genuine canvas resize.
 */

/**
 * GLSL prelude for every pass that SAMPLES a lighting-resolution texture.
 * Passes that only `texelFetch` them (AccumulatePass) need nothing: an
 * origin-anchored rect leaves integer texel coordinates untouched.
 */
export const LIGHTING_RECT_GLSL = /* glsl */ `
// Sub-rect remap for lighting-resolution samplers (see lightingRect.js).
// uRectScale = active rect / allocated target; (1,1) = the whole target.
uniform vec2 uRectScale;
// uRectScale minus half an allocated texel: the last sample point inside the
// rect, so a LinearFilter tap at the edge cannot bleed in the unused region.
uniform vec2 uRectMax;
vec2 rectUv(vec2 uv) { return clamp(uv * uRectScale, vec2(0.0), uRectMax); }
`;

/** The two uniforms `LIGHTING_RECT_GLSL` declares, at their identity values. */
export function rectUniforms() {
  return {
    uRectScale: { value: new THREE.Vector2(1, 1) },
    uRectMax: { value: new THREE.Vector2(1, 1) },
  };
}

/**
 * Point a material's rect uniforms at a rect of `rectW x rectH` inside a
 * `allocW x allocH` target. Materials that carry neither uniform are skipped,
 * so this is safe to call over a pass's whole material list.
 */
export function setRectUniforms(material, rectW, rectH, allocW, allocH) {
  if (!material) return;
  const u = material.uniforms;
  if (!u || !u.uRectScale) return;
  const sx = rectW / allocW;
  const sy = rectH / allocH;
  u.uRectScale.value.set(sx, sy);
  u.uRectMax.value.set(sx - 0.5 / allocW, sy - 0.5 / allocH);
}

/**
 * Clip a render target's draws to `w x h` at its origin. Scissor test is left
 * OFF when the rect is the whole target, so the cap rung issues exactly the GL
 * state the renderer issued before this existed.
 */
export function setTargetRect(target, w, h) {
  if (!target) return;
  target.viewport.set(0, 0, w, h);
  target.scissor.set(0, 0, w, h);
  target.scissorTest = w !== target.width || h !== target.height;
}
