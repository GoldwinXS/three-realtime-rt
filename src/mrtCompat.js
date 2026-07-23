import * as THREE from "three";

/**
 * Multiple-render-target constructor that works across the three versions in
 * this library's peer range (three >=0.155.0).
 *
 * three r172 removed `WebGLMultipleRenderTargets`. Its replacement is the base
 * `WebGLRenderTarget` with a `count` option (added r162) for N color
 * attachments, which it exposes as the ARRAY `.textures` — while `.texture`
 * became a single texture (an alias for `textures[0]`). This library predates
 * that split and indexes the attachment array as `.texture[i]` throughout the
 * passes, so on new three we shadow the instance `.texture` accessor with the
 * `.textures` array. That keeps every existing `.texture[i]` / `for (... of
 * .texture)` call site correct with no per-site changes, and does not disturb
 * three's WebGL backend (which binds/reads/reads-back via `.textures`, and only
 * touches the single `.texture` on cube/PMREM targets, never on these 2D MRTs).
 *
 * On old three (<= r171) `WebGLMultipleRenderTargets` already IS an
 * array-`.texture` MRT, so it is used unchanged and the result is byte-identical
 * to before this shim existed.
 *
 * Signature matches the old constructor: (width, height, count, options).
 */
export function makeMRT(width, height, count, options = {}) {
  if (THREE.WebGLMultipleRenderTargets) {
    return new THREE.WebGLMultipleRenderTargets(width, height, count, options);
  }
  const rt = new THREE.WebGLRenderTarget(width, height, { ...options, count });
  // Re-point `.texture` at the attachment array (old-three semantics). Shadows
  // the prototype get/set texture() accessor on this instance only.
  Object.defineProperty(rt, "texture", {
    value: rt.textures,
    writable: true,
    configurable: true,
  });
  return rt;
}
