import * as THREE from "three";
import { MAX_LIGHTS, clampMaxLights } from "./SceneCompiler.js";

const fullscreenVert = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Shared preamble: the light table (one row of the scene-data texture) and the
// grid's geometry. Both stages read the SAME accessors the shading passes use,
// so "what is light i" has one definition in this library.
const GRID_COMMON = /* glsl */ `
precision highp float;

#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE

uniform sampler2D uMaterialsTex;
uniform int uLightRow;
uniform int uLightCount;

vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); }

// Rec.601, the same weights RestirPass.rtLum and RTLightingPass use. Row 0 of
// the grid must reproduce the 0.15.0 CPU-side CDF, and that CDF was built from
// these weights.
float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
`;

// STAGE 1: one raw weight per (light seat, row).
//   row 0        the GLOBAL distribution: power only, no geometry. This is the
//                0.15.0 candidate CDF, to the formula. Pixels outside the grid
//                and every scene without static bounds draw from it, and it is
//                what `restirLightGrid: false` uses.
//   row 1 + c    cell c of the uniform grid: how much light seat i could deliver
//                anywhere inside that cell's box.
// Output: (w, eligible, 0, 0). `eligible` marks a seat that may be floored up to
// a minimum probability by stage 2; a directional light under the bypass is NOT
// eligible, because its p̂ is exactly zero and RIS wants pdf 0 exactly where the
// target is 0 (the same rule RestirPass._rebuildPools applies to the split).
const weightFrag = /* glsl */ `
${GRID_COMMON}

layout(location = 0) out vec4 outWeight;

uniform vec3 uGridOrigin;
uniform vec3 uGridCell;
uniform ivec3 uGridDims;
uniform float uDirBypass;

void main() {
  int i = int(gl_FragCoord.x);
  int row = int(gl_FragCoord.y);
  if (i >= uLightCount) { outWeight = vec4(0.0); return; }

  vec4 posType = lightPosType(i);
  vec4 colRad = lightColorRadius(i);
  float lum = rtLum(colRad.rgb);
  bool isDir = posType.w >= 0.5 && posType.w < 1.5;

  if (isDir) {
    // A directional light reaches every cell equally: no distance, no cone.
    float w = uDirBypass > 0.5 ? 0.0 : lum;
    outWeight = vec4(w, uDirBypass > 0.5 ? 0.0 : 1.0, 0.0, 0.0);
    return;
  }
  if (row == 0) {
    // Global row: power only, exactly as the CPU built it through 0.15.0.
    outWeight = vec4(lum, 1.0, 0.0, 0.0);
    return;
  }

  int c = row - 1;
  ivec3 ci = ivec3(c % uGridDims.x, (c / uGridDims.x) % uGridDims.y, c / (uGridDims.x * uGridDims.y));
  vec3 lo = uGridOrigin + vec3(ci) * uGridCell;
  vec3 hi = lo + uGridCell;

  // Distance from the light to the NEAREST point of the cell box (0 inside).
  vec3 P = posType.xyz;
  vec3 q = max(max(lo - P, vec3(0.0)), P - hi);
  float d2 = dot(q, q);

  // Spot cone: 1 if any part of the cell can be inside the cone, else a small
  // floor rather than 0: a cone edge is a smoothstep, not a cliff, and the
  // corner test below is conservative in the other direction.
  float cone = 1.0;
  if (posType.w >= 1.5) {
    vec4 dc = lightDirCone(i);
    cone = 0.05;
    if (d2 <= 0.0) {
      cone = 1.0; // the light sits inside this cell
    } else {
      // Nine directions: the cell's eight corners plus its nearest point.
      for (int k = 0; k < 9; k++) {
        vec3 p = k == 8
          ? clamp(P, lo, hi)
          : vec3(k % 2 == 0 ? lo.x : hi.x,
                 (k / 2) % 2 == 0 ? lo.y : hi.y,
                 (k / 4) % 2 == 0 ? lo.z : hi.z);
        vec3 dv = p - P;
        float dl = length(dv);
        if (dl < 1e-6) { cone = 1.0; break; }
        if (dot(dc.xyz, dv / dl) >= dc.w) { cone = 1.0; break; }
      }
    }
  }

  // INVERSE SQUARE, floored at half a cell diagonal.
  //
  // The obvious weight is lum * r^2 / (d^2 + r^2/4) clamped to 1, which is right
  // when r is a light's FALLOFF radius. This table's radius is the soft-shadow
  // radius: 0.06 to 0.6 world units: so that form saturates at 1 for any light
  // inside the cell and decays as r^2/d^2 outside it, making CONTAINMENT worth
  // 1/r^2 (about 70x here) more than the inverse-square law says. Measured on the
  // hotel: one seat took 98.3% of a corridor cell's probability while five others
  // carried 100-300x more true contribution than their pdf share, and the frame
  // filled with fireflies that the relative firefly clamp cannot catch (the
  // spike is inside wSum, so it lifts the cap with it). Numbers in
  // dev/LIGHTS-0.16-REPORT.md.
  //
  // So: w = lum / max(d^2, (cellDiagonal/2)^2). It is the same inverse square the
  // shading uses, with the only clamp being the singularity at contact, set to
  // the distance a pixel in this cell is TYPICALLY at from a light in this cell.
  // The light's radius does not appear at all, which is correct: a bigger
  // sphere light is not a brighter one, its intensity is already in lum.
  float dmin2 = 0.25 * dot(uGridCell, uGridCell);
  float fall = 1.0 / max(d2, dmin2);
  outWeight = vec4(lum * fall * cone, 1.0, 0.0, 0.0);
}
`;

// STAGE 2: turn each row of raw weights into a CDF the candidate sampler can
// binary-search. One fragment per (seat, row); the loop walks the row once, so
// the whole build is O(cells x lights^2) fragments-times-iterations and the draw
// is clipped to the seats that exist (see build()).
//
// Output texel: (cdf_i, p_i, w_i, 0)
//   cdf_i  running sum of p, with the LAST ACTIVE seat forced to exactly 1.0 so
//          a rand() in [0,1) always terminates on a real light.
//   p_i    the pick probability the estimator divides by.
//   w_i    the raw weight, kept because it is what the pdf means and it makes
//          the texture readable by a debug view / self-test.
const cdfFrag = /* glsl */ `
${GRID_COMMON}

layout(location = 0) out vec4 outCdf;

uniform sampler2D uWeights;
// Minimum share of the row's largest weight that any ELIGIBLE light keeps, so a
// light that this cell's geometry scored at zero can still be drawn where it
// could matter (RIS needs its source pdf to cover the target's support). Not
// applied to row 0: there w IS the light's power, and a light with no power
// contributes nothing anywhere, which is exactly the 0.15.0 behaviour this row
// has to reproduce.
uniform float uFloorFrac;

void main() {
  int me = int(gl_FragCoord.x);
  int row = int(gl_FragCoord.y);
  if (me >= uLightCount) { outCdf = vec4(0.0); return; }

  float floorFrac = row == 0 ? 0.0 : uFloorFrac;

  // ONE pass over the row, not two. The floor is relative to the row's largest
  // weight, which is not known until the row has been read: so it is ADDED
  // rather than max()'d: w' = w + floorFrac * maxW for an eligible seat. That
  // guarantees the same minimum probability (support is what the floor is for)
  // while making every term separable, so the sums can be assembled
  // algebraically after a single loop. Halves the fetches, and this loop is the
  // whole cost of the build: it runs once per (seat, cell), so it is
  // cells x lights x lights.
  float total = 0.0;    // sum of raw weights
  float upto = 0.0;     // ...up to and including this seat
  float mine = 0.0;
  float maxW = 0.0;
  float nElig = 0.0;    // eligible seats, and how many are at or before me
  float nEligUpto = 0.0;
  for (int j = 0; j < MAX_LIGHTS; j++) {
    if (j >= uLightCount) break;
    vec2 wj = texelFetch(uWeights, ivec2(j, row), 0).xy;
    float w = wj.y > 0.5 ? wj.x : 0.0;
    float e = wj.y > 0.5 ? 1.0 : 0.0;
    maxW = max(maxW, w);
    total += w;
    nElig += e;
    if (j <= me) { upto += w; nEligUpto += e; }
    if (j == me) mine = w * e + (1.0 - e) * -1.0; // -1 marks "not eligible"
  }
  float floorW = maxW * floorFrac;
  float meElig = mine >= 0.0 ? 1.0 : 0.0;
  mine = max(mine, 0.0) + floorW * meElig;
  total += floorW * nElig;
  upto += floorW * nEligUpto;

  // Every weight zero (an unlit scene, or sun-only with the bypass on): fall
  // back to the uniform table, exactly as the CPU build did. Those lights all
  // score p̂ = 0, so nothing is selected out of it either way: this only keeps
  // the row finite and monotone.
  float n = float(uLightCount);
  float p = total > 0.0 ? mine / total : 1.0 / n;
  float cdf = total > 0.0 ? upto / total : (float(me) + 1.0) / n;
  if (me == uLightCount - 1) cdf = 1.0;
  outCdf = vec4(cdf, p, mine, 0.0);
}
`;

/**
 * Builds the ReSTIR candidate distribution: one CDF row per cell of a uniform
 * grid over the static world, plus a global row 0.
 *
 * WHY IT EXISTS. ReSTIR's cost is flat in light count, but its candidate QUALITY
 * is not: eight candidates drawn from a scene-wide power CDF in an 96-light
 * hotel put roughly one in thirty-two inside the pixel's own room, and a
 * reservoir fed with lights behind walls converges the way an unfixed reservoir
 * did. Weighting each light by what it could deliver to the pixel's own cell is
 * the standard fix (RTXDI calls it a light grid) and it is what lets the light
 * cap go away without the noise coming back.
 *
 * WHY ON THE GPU. The table is maxLights x cells; at 128 x 8192 that is a
 * million texels, and it must be rebuilt whenever a light moves. On the CPU that
 * is a megabyte of upload per frame in a scene with moving lights; here it is
 * two small draws that never leave the GPU.
 */
export class LightGridPass {
  constructor({ maxLights = MAX_LIGHTS } = {}) {
    this.maxLights = clampMaxLights(maxLights);
    this.cells = 0;
    this.rows = 1;
    this.lastBuildMs = 0;
    this.builds = 0;

    const mk = (frag, name) =>
      new THREE.ShaderMaterial({
        // Stable program names for compile-failure self-diagnosis: a link
        // failure here disables `restirLightGrid` (candidates fall back to the
        // global CDF: noisier with many lights, never black).
        name,
        glslVersion: THREE.GLSL3,
        vertexShader: fullscreenVert,
        fragmentShader: frag.replace(/RT_MAX_LIGHTS_VALUE/g, String(this.maxLights)),
        uniforms: {
          uMaterialsTex: { value: null },
          uLightRow: { value: 0 },
          uLightCount: { value: 0 },
          ...(frag === weightFrag
            ? {
                uGridOrigin: { value: new THREE.Vector3() },
                uGridCell: { value: new THREE.Vector3(1, 1, 1) },
                uGridDims: { value: new Int32Array([1, 1, 1]) },
                uDirBypass: { value: 0.0 },
              }
            : {
                uWeights: { value: null },
                // 1e-3 of the row's largest weight, not 1e-4: the floor exists
                // for SUPPORT, and a light drawn at pdf p contributes p̂/p, so a
                // floor an order of magnitude too small buys support at the
                // price of a 10x noisier draw when it is taken. At 1e-3 the
                // floored lights cost about 0.1% of candidates.
                uFloorFrac: { value: 1e-3 },
              }),
        },
        depthTest: false,
        depthWrite: false,
      });

    this.weightMaterial = mk(weightFrag, "rt:lightgrid-weights");
    this.cdfMaterial = mk(cdfFrag, "rt:lightgrid-cdf");

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.weightMaterial);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);

    this.weightTarget = null;
    this.target = null;
    this._compiled = null;
  }

  get texture() {
    return this.target ? this.target.texture : null;
  }

  _makeTarget(width, height) {
    const t = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    t.texture.generateMipmaps = false;
    return t;
  }

  /**
   * Point the pass at a compiled scene and (re)allocate the grid textures.
   * `maxTextureSize` caps the row count: the grid is one texture ROW per cell,
   * so a device with the WebGL2 minimum of 2048 gets 2047 cells rather than a
   * texture it cannot allocate. Returns the cell count actually used.
   */
  setCompiledScene(compiled, maxTextureSize = 2048) {
    this._compiled = compiled;
    const g = compiled ? compiled.lightGrid : null;
    let cells = g ? g.cells : 0;
    if (cells + 1 > maxTextureSize) cells = Math.max(0, maxTextureSize - 1);
    this.cells = cells;
    this.rows = cells + 1;
    const w = this.maxLights;
    if (!this.target || this.target.width !== w || this.target.height !== this.rows) {
      if (this.target) this.target.dispose();
      if (this.weightTarget) this.weightTarget.dispose();
      this.target = this._makeTarget(w, this.rows);
      this.weightTarget = this._makeTarget(w, this.rows);
    }
    for (const m of [this.weightMaterial, this.cdfMaterial]) {
      m.uniforms.uMaterialsTex.value = compiled ? compiled.materialsTex : null;
      m.uniforms.uLightRow.value = compiled ? compiled.lightRow : 0;
      m.uniforms.uLightCount.value = compiled ? compiled.lightCount : 0;
    }
    const wu = this.weightMaterial.uniforms;
    if (g) {
      wu.uGridOrigin.value.set(g.origin[0], g.origin[1], g.origin[2]);
      wu.uGridCell.value.set(g.cell[0], g.cell[1], g.cell[2]);
      wu.uGridDims.value[0] = g.dims[0];
      wu.uGridDims.value[1] = g.dims[1];
      wu.uGridDims.value[2] = g.dims[2];
    }
    this.cdfMaterial.uniforms.uWeights.value = this.weightTarget.texture;
    return this.cells;
  }

  /**
   * Rebuild the table. `cellRows: false` builds ONLY row 0 (the global CDF),
   * which is all the `restirLightGrid: false` path reads: so turning the grid
   * off makes this two one-row draws rather than a skipped feature with a stale
   * table behind it.
   *
   * The draw is clipped to lightCount columns and the rows in use, through the
   * render target's own viewport (never renderer.setViewport, which would
   * persist onto the canvas).
   */
  build(renderer, { dirBypass = false, cellRows = true } = {}) {
    if (!this.target || !this._compiled) return 0;
    const u = this.weightMaterial.uniforms;
    u.uLightCount.value = this._compiled.lightCount;
    u.uDirBypass.value = dirBypass ? 1.0 : 0.0;
    this.cdfMaterial.uniforms.uLightCount.value = this._compiled.lightCount;
    for (const m of [this.weightMaterial, this.cdfMaterial]) {
      m.uniforms.uMaterialsTex.value = this._compiled.materialsTex;
      m.uniforms.uLightRow.value = this._compiled.lightRow;
    }
    const n = Math.min(this._compiled.lightCount | 0, this.maxLights);
    if (n <= 0) return 0;
    const rows = cellRows ? this.rows : 1;
    const prev = renderer.getRenderTarget();

    this.weightTarget.viewport.set(0, 0, n, rows);
    this.target.viewport.set(0, 0, n, rows);

    this.quad.material = this.weightMaterial;
    renderer.setRenderTarget(this.weightTarget);
    renderer.render(this.scene, this.camera);

    this.quad.material = this.cdfMaterial;
    renderer.setRenderTarget(this.target);
    renderer.render(this.scene, this.camera);

    renderer.setRenderTarget(prev);
    this.builds++;
    return rows;
  }

  dispose() {
    if (this.target) this.target.dispose();
    if (this.weightTarget) this.weightTarget.dispose();
    this.weightMaterial.dispose();
    this.cdfMaterial.dispose();
    this.quad.geometry.dispose();
  }
}
