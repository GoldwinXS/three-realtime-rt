import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  MeshBVH,
  MeshBVHUniformStruct,
  FloatVertexAttributeTexture,
  SAH,
  CENTER,
} from "three-mesh-bvh";
import { decodeBlueNoise, BLUE_NOISE_SIZE } from "./blueNoise.js";

const MAX_LIGHTS = 32; // stage-1 cap; a data-texture light list is future work

// Emissive-mesh triangles sampled by next-event estimation. Beyond the cap the
// largest-area triangles win (they carry the most light); the rest are dropped
// from the light list with a warning.
const MAX_EMISSIVE_TRIS = 256;

/**
 * A two-level BVH scene. Static geometry lives in one BVH uploaded to the GPU
 * ONCE; dynamic (moving) meshes live in a second, small BVH that is re-baked and
 * re-uploaded every frame. The lighting shader traces both and takes the nearest
 * hit, so the per-frame cost scales with the *moving* triangle count only — not
 * the size of the static world. (This is the TLAS/BLAS idea, minus per-instance
 * transforms: one merged dynamic mesh is plenty for typical rigid-body scenes.)
 */
export class CompiledScene {
  constructor() {
    // Static level (built once). Per level, one packed RGBA attribute texture
    // (normal.xyz + materialIndex in .w): two BVH structs already cost 8 of the
    // 16 guaranteed fragment samplers, so attributes must stay lean.
    this.staticBvh = null;
    this.staticBvhUniform = new MeshBVHUniformStruct();
    this.staticAttrTex = new FloatVertexAttributeTexture();

    // Dynamic level (re-baked/refit each frame).
    this.dynamicBvh = null;
    this.dynamicBvhUniform = new MeshBVHUniformStruct();
    this.dynamicAttrTex = new FloatVertexAttributeTexture();
    this.dynamicMerged = null;
    this.dynamicPacked = null; // Float32Array + BufferAttribute for re-baking
    this.dynamicPackedAttr = null;
    this.dynamic = []; // [{ mesh, start, count, localPos, localNorm, deforming, ... }]
    this.hasDynamic = false;
    // True when any dynamic segment is CPU-deformed (rtDeforming) — such segments
    // read their live geometry every frame and force a per-frame normal upload.
    this.hasDeforming = false;

    this.materialsTex = null;
    this.materials = [];
    this.lightPosType = [];
    this.lightColorRadius = [];
    this.lightDirCone = []; // spot direction.xyz + cos(outer angle)
    this.lightCount = 0;
    this.emissiveTriCount = 0;
    this.triangleCount = 0;

    this._m3 = new THREE.Matrix3();
    this._normalFrame = 0;
    this._dynBuildVolume = null; // world-volume of the dynamic set at build time
  }

  /**
   * Re-bake the dynamic meshes' current world transforms into the dynamic
   * geometry, refit the dynamic BVH, and re-upload ONLY the (small) dynamic
   * textures. The static BVH is never touched. Call once per frame after moving
   * the meshes.
   */
  updateDynamic() {
    if (!this.hasDynamic || this.dynamic.length === 0) return;
    const posAttr = this.dynamicMerged.getAttribute("position");
    const pos = posAttr.array;
    const packed = this.dynamicPacked; // normal.xyz + matIndex.w per vertex
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (const seg of this.dynamic) {
      seg.mesh.updateWorldMatrix(true, false);
      const m = seg.mesh.matrixWorld.elements;
      const nm = this._m3.getNormalMatrix(seg.mesh.matrixWorld).elements;
      let o = seg.start * 3;
      let p = seg.start * 4;

      if (seg.deforming) {
        // CPU-deformed mesh (water/cloth): read the LIVE geometry every frame
        // and expand it back to the merged de-indexed layout through the mapping
        // snapshotted at compile time. `indexMap` (the source geometry's index
        // buffer, or null for an already-non-indexed source) maps each merged
        // triangle-soup vertex slot to its source-vertex index; the source
        // attributes carry the shared, deformed values.
        const livePosAttr = seg.liveGeometry.getAttribute("position");
        if (livePosAttr.count !== seg.srcVertexCount) {
          throw new Error(
            "three-realtime-rt: deforming mesh vertex count changed since " +
            `compile (${seg.srcVertexCount} -> ${livePosAttr.count}); the merged ` +
            "BVH layout is fixed at compile time — call compileScene() again."
          );
        }
        const sp = livePosAttr.array;
        const snAttr = seg.liveGeometry.getAttribute("normal");
        const sn = snAttr ? snAttr.array : null;
        const map = seg.indexMap; // null = identity (non-indexed source)
        const ln = seg.localNorm; // fallback if the app never recomputed normals
        for (let i = 0; i < seg.count; i++) {
          const sv = map ? map[i] : i;
          const x = sp[sv * 3], y = sp[sv * 3 + 1], z = sp[sv * 3 + 2];
          const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
          const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
          const wz = m[2] * x + m[6] * y + m[10] * z + m[14];
          pos[o] = wx;
          pos[o + 1] = wy;
          pos[o + 2] = wz;
          if (wx < minX) minX = wx; if (wx > maxX) maxX = wx;
          if (wy < minY) minY = wy; if (wy > maxY) maxY = wy;
          if (wz < minZ) minZ = wz; if (wz > maxZ) maxZ = wz;
          let nx, ny, nz;
          if (sn) { nx = sn[sv * 3]; ny = sn[sv * 3 + 1]; nz = sn[sv * 3 + 2]; }
          else { nx = ln[i * 3]; ny = ln[i * 3 + 1]; nz = ln[i * 3 + 2]; }
          const tx = nm[0] * nx + nm[3] * ny + nm[6] * nz;
          const ty = nm[1] * nx + nm[4] * ny + nm[7] * nz;
          const tz = nm[2] * nx + nm[5] * ny + nm[8] * nz;
          const il = 1.0 / (Math.hypot(tx, ty, tz) || 1);
          packed[p] = tx * il;
          packed[p + 1] = ty * il;
          packed[p + 2] = tz * il;
          // packed[p + 3] (matIndex) never changes
          o += 3;
          p += 4;
        }
      } else {
        // Rigid mover: transform the frozen local snapshot by the world matrix.
        const lp = seg.localPos;
        const ln = seg.localNorm;
        for (let i = 0; i < seg.count; i++) {
          const x = lp[i * 3], y = lp[i * 3 + 1], z = lp[i * 3 + 2];
          const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
          const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
          const wz = m[2] * x + m[6] * y + m[10] * z + m[14];
          pos[o] = wx;
          pos[o + 1] = wy;
          pos[o + 2] = wz;
          if (wx < minX) minX = wx; if (wx > maxX) maxX = wx;
          if (wy < minY) minY = wy; if (wy > maxY) maxY = wy;
          if (wz < minZ) minZ = wz; if (wz > maxZ) maxZ = wz;
          const nx = ln[i * 3], ny = ln[i * 3 + 1], nz = ln[i * 3 + 2];
          const tx = nm[0] * nx + nm[3] * ny + nm[6] * nz;
          const ty = nm[1] * nx + nm[4] * ny + nm[7] * nz;
          const tz = nm[2] * nx + nm[5] * ny + nm[8] * nz;
          const il = 1.0 / (Math.hypot(tx, ty, tz) || 1);
          packed[p] = tx * il;
          packed[p + 1] = ty * il;
          packed[p + 2] = tz * il;
          // packed[p + 3] (matIndex) never changes
          o += 3;
          p += 4;
        }
      }
    }
    posAttr.needsUpdate = true;

    // refit() keeps the tree TOPOLOGY from build time. While the props sit in
    // a pile that's fine — but once they scatter (an explosion), triangles
    // that are tree-neighbors end up across the room, refitted nodes balloon
    // into huge overlapping boxes, and every ray wades through them (observed:
    // 30 fps → 10 on mobile). When the set has spread well past its
    // build-time volume, rebuild the tree from scratch instead — a few ms,
    // paid only on large redistributions.
    const vol =
      Math.max(maxX - minX, 1e-6) *
      Math.max(maxY - minY, 1e-6) *
      Math.max(maxZ - minZ, 1e-6);
    if (this._dynBuildVolume == null) this._dynBuildVolume = vol;
    if (vol > this._dynBuildVolume * 3 || vol < this._dynBuildVolume / 3) {
      this.dynamicBvh = new MeshBVH(this.dynamicMerged, { strategy: CENTER });
      this._dynBuildVolume = vol;
    } else {
      this.dynamicBvh.refit();
    }
    this.dynamicBvhUniform.updateFrom(this.dynamicBvh);
    // Normals only feed GI-bounce shading off movers — amortize their upload for
    // rigid movers. Deforming meshes change shape (not just orientation) every
    // frame, so their normals must go up every frame or the shading lags the
    // silhouette; one deforming segment forces the whole (shared) upload.
    if (this.hasDeforming || this._normalFrame++ % 8 === 0) {
      this.dynamicAttrTex.updateFrom(this.dynamicPackedAttr);
    }
  }

  dispose() {
    this.staticBvhUniform.dispose();
    this.staticAttrTex.dispose();
    this.dynamicBvhUniform.dispose();
    this.dynamicAttrTex.dispose();
    if (this.materialsTex) this.materialsTex.dispose();
    if (this.staticBvh) this.staticBvh.geometry.dispose();
    if (this.dynamicMerged) this.dynamicMerged.dispose();
  }
}

function extractMeshGeometry(mesh) {
  const indexed = mesh.geometry.index;
  const src = indexed ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();

  if (!src.getAttribute("normal")) src.computeVertexNormals();
  const localPos = src.getAttribute("position").array.slice();
  const localNorm = src.getAttribute("normal").array.slice();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", src.getAttribute("position").clone());
  geo.setAttribute("normal", src.getAttribute("normal").clone());
  geo.applyMatrix4(mesh.matrixWorld); // bake world transform

  const count = geo.getAttribute("position").count;
  // The per-vertex materialIndex attribute is filled by resolveGroups (which the
  // caller runs with the shared materials table), so a multi-material mesh gets
  // its groups mapped to distinct materials rather than a single flat index.

  // For CPU-deformed (rtDeforming) meshes we re-read the LIVE geometry each
  // frame. The merged BVH is de-indexed triangle soup, so record how to expand
  // the live (source) vertices back into that layout: `indexMap[i]` is the
  // source-vertex index feeding merged slot `i` (a snapshot of the index
  // buffer), or null when the source was already non-indexed (identity map).
  // `srcVertexCount` is the live position count at compile time — used to catch
  // a topology change that would invalidate this mapping.
  const indexMap = indexed ? mesh.geometry.index.array.slice() : null;
  const srcVertexCount = mesh.geometry.getAttribute("position").count;
  return { geo, localPos, localNorm, count, indexMap, srcVertexCount };
}

// Fill the per-vertex materialIndex for a (possibly multi-material) mesh and
// return the material ranges for per-group emissive collection. Groups on the
// INDEXED geometry are ranges over the index buffer; toNonIndexed() lays vertices
// out in index order, so a group's [start, start+count) maps to the SAME range of
// de-indexed vertices (identity for an already-non-indexed source). Each group's
// material is registered in the shared table via registerMaterial.
function resolveMeshMaterials(mesh, count, registerMaterial) {
  const isArray = Array.isArray(mesh.material);
  const groups = mesh.geometry.groups;
  const matIdx = new Float32Array(count);
  const ranges = [];
  if (isArray && groups && groups.length > 0) {
    // Ungrouped vertices (if any) default to material[0].
    const base = mesh.material[0];
    matIdx.fill(registerMaterial(base));
    for (const g of groups) {
      const gm = mesh.material[g.materialIndex] ?? base;
      if (gm.transparent) {
        throw new Error(
          "three-realtime-rt: a transparent group material on a multi-material " +
          "mesh is not supported for BVH tracing (transparent surfaces use the " +
          "out-of-BVH straight-through blend path, which is per-mesh). Split the " +
          `transparent group (materialIndex ${g.materialIndex}) into its own mesh.`
        );
      }
      const gi = registerMaterial(gm);
      const start = Math.max(0, g.start);
      const end = Math.min(count, g.start + g.count);
      for (let v = start; v < end; v++) matIdx[v] = gi;
      ranges.push({ start, vcount: end - start, material: gm });
    }
  } else {
    const mat = isArray ? mesh.material[0] : mesh.material;
    matIdx.fill(registerMaterial(mat));
    ranges.push({ start: 0, vcount: count, material: mat });
  }
  return { matIdx, ranges };
}

// Effective emissive colour (already scaled by intensity), or null if the
// material doesn't emit. Matches the shading table's emissiveMap exclusion.
function emissiveColor(mat) {
  if (mat.emissiveMap != null || !mat.emissive) return null;
  const i = mat.emissiveIntensity ?? 1;
  if (i <= 0 || mat.emissive.r + mat.emissive.g + mat.emissive.b <= 0) return null;
  return [mat.emissive.r * i, mat.emissive.g * i, mat.emissive.b * i];
}

// Row 0: materials, 2 texels each (albedo+rough, emissive+metal).
// Row 1: emissive triangles for NEE, 4 texels each:
//   [v0.xyz | area] [e1.xyz | emit.r] [e2.xyz | emit.g] [n.xyz | emit.b]
// Rows 2..65: a 64x64 RGBA blue-noise tile for low-discrepancy sampling.
// Row 66 (2 + BLUE_NOISE_SIZE): the emissive power CDF, 1 texel per triangle:
//   [cdf | prob | 0 | 0] — cumulative and individual pick probability, both
//   proportional to area x emitted luminance. Lets NEE importance-sample WHICH
//   triangle to shoot at instead of picking uniformly (a big/bright panel gets
//   sampled proportionally more than a tiny dim strip), which is the main
//   variance lever for emissive lighting outside of ReSTIR.
// All packed into ONE texture because the lighting pass already sits at the
// WebGL2-guaranteed 16-sampler limit — extra samplers are not available.
function buildSceneDataTexture(materials, emissiveTris) {
  const bn = decodeBlueNoise();
  const width = Math.max(materials.length * 2, emissiveTris.length * 4, BLUE_NOISE_SIZE);
  const height = 2 + BLUE_NOISE_SIZE + 1;
  const data = new Float32Array(width * height * 4);
  materials.forEach((mat, i) => {
    const o = i * 8;
    const color = mat.color ?? new THREE.Color(1, 1, 1);
    const emissive = emissiveColor(mat) ?? [0, 0, 0];
    data[o + 0] = color.r;
    data[o + 1] = color.g;
    data[o + 2] = color.b;
    data[o + 3] = mat.roughness ?? 1;
    data[o + 4] = emissive[0];
    data[o + 5] = emissive[1];
    data[o + 6] = emissive[2];
    data[o + 7] = mat.metalness ?? 0;
  });
  const row = width * 4;
  emissiveTris.forEach((t, i) => {
    const o = row + i * 16;
    data[o + 0] = t.v0[0]; data[o + 1] = t.v0[1]; data[o + 2] = t.v0[2]; data[o + 3] = t.area;
    data[o + 4] = t.e1[0]; data[o + 5] = t.e1[1]; data[o + 6] = t.e1[2]; data[o + 7] = t.emit[0];
    data[o + 8] = t.e2[0]; data[o + 9] = t.e2[1]; data[o + 10] = t.e2[2]; data[o + 11] = t.emit[1];
    data[o + 12] = t.n[0]; data[o + 13] = t.n[1]; data[o + 14] = t.n[2]; data[o + 15] = t.emit[2];
  });
  for (let y = 0; y < BLUE_NOISE_SIZE; y++) {
    const o = (2 + y) * row;
    const src = y * BLUE_NOISE_SIZE * 4;
    for (let i = 0; i < BLUE_NOISE_SIZE * 4; i++) {
      data[o + i] = (bn[src + i] + 0.5) / 256.0;
    }
  }
  // Emissive power CDF (see the layout comment above). Weight = area x
  // emitted luminance; degenerate totals fall back to the uniform pick.
  if (emissiveTris.length > 0) {
    const w = emissiveTris.map(
      (t) => t.area * (0.2126 * t.emit[0] + 0.7152 * t.emit[1] + 0.0722 * t.emit[2])
    );
    const total = w.reduce((a, b) => a + b, 0);
    const cdfRow = (2 + BLUE_NOISE_SIZE) * row;
    let cum = 0;
    for (let i = 0; i < emissiveTris.length; i++) {
      const p = total > 0 ? w[i] / total : 1 / emissiveTris.length;
      cum += p;
      data[cdfRow + i * 4 + 0] = i === emissiveTris.length - 1 ? 1.0 : cum;
      data[cdfRow + i * 4 + 1] = p;
    }
  }
  const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

// Collect world-space triangles of an emissive mesh for the NEE light list.
// `geo` is already non-indexed and world-baked by extractMeshGeometry. An
// optional [vStart, vCount) vertex range restricts collection to one material
// group (ranges are triangle-aligned, so this stays whole-triangle).
function collectEmissiveTriangles(geo, emit, out, vStart = 0, vCount = -1) {
  const pos = geo.getAttribute("position").array;
  const begin = vStart * 3;
  const end = vCount < 0 ? pos.length : Math.min(pos.length, (vStart + vCount) * 3);
  for (let i = begin; i + 9 <= end; i += 9) {
    const e1 = [pos[i + 3] - pos[i], pos[i + 4] - pos[i + 1], pos[i + 5] - pos[i + 2]];
    const e2 = [pos[i + 6] - pos[i], pos[i + 7] - pos[i + 1], pos[i + 8] - pos[i + 2]];
    const cx = e1[1] * e2[2] - e1[2] * e2[1];
    const cy = e1[2] * e2[0] - e1[0] * e2[2];
    const cz = e1[0] * e2[1] - e1[1] * e2[0];
    const len = Math.hypot(cx, cy, cz);
    if (len < 1e-10) continue; // degenerate
    out.push({
      v0: [pos[i], pos[i + 1], pos[i + 2]],
      e1,
      e2,
      n: [cx / len, cy / len, cz / len],
      area: len * 0.5,
      emit,
    });
  }
}

// A single degenerate triangle so the dynamic BVH textures are always valid even
// when there are no dynamic meshes (tracing is gated by a uHasDynamic flag).
function degenerateGeometry() {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9), 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0]), 3));
  geo.setAttribute("materialIndex", new THREE.BufferAttribute(new Float32Array(3), 1));
  return geo;
}

// Pack normal.xyz + materialIndex.w into one itemSize-4 attribute so each BVH
// level costs a single sampler for its per-vertex data.
function packAttributes(merged) {
  const norm = merged.getAttribute("normal");
  const matIdx = merged.getAttribute("materialIndex");
  const count = norm.count;
  const packed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    packed[i * 4] = norm.getX(i);
    packed[i * 4 + 1] = norm.getY(i);
    packed[i * 4 + 2] = norm.getZ(i);
    packed[i * 4 + 3] = matIdx.getX(i);
  }
  return { packed, attr: new THREE.BufferAttribute(packed, 4) };
}

// Build one BVH level (merge geometries, upload BVH + attribute textures).
function buildLevel(geometries, { dynamic }) {
  const merged =
    geometries.length > 0 ? mergeGeometries(geometries, false) : degenerateGeometry();
  const bvh = new MeshBVH(merged, { strategy: dynamic ? CENTER : SAH });
  return { merged, bvh, ...packAttributes(merged) };
}

export function compileScene(scene, options = {}) {
  scene.updateMatrixWorld(true);
  const dynamicSet = options.dynamicMeshes ? new Set(options.dynamicMeshes) : null;

  const compiled = new CompiledScene();
  const materials = compiled.materials;
  const staticGeoms = [];
  const dynamicGeoms = [];
  const emissiveTris = [];
  let dynVertexOffset = 0;
  const tmpGeoms = []; // to dispose after merge

  const registerMaterial = (m) => {
    let i = materials.indexOf(m);
    if (i < 0) { i = materials.length; materials.push(m); }
    return i;
  };

  scene.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry || !obj.visible || obj.userData.rtExclude) return;
    const isArray = Array.isArray(obj.material);
    const rep = isArray ? obj.material[0] : obj.material;
    // Transparent surfaces must not act as opaque occluders — e.g.
    // LittlestTokyo's glass display case (texture-alpha, opacity 1) would put
    // the whole model in shadow. Alpha-textured glass can't be cheaply tested,
    // so ANY transparent material is skipped like rtExclude (still
    // rasterized). alphaTest cut-outs (transparent: false) stay occluders.
    if (rep.transparent) return;

    const isDynamic = dynamicSet && dynamicSet.has(obj);
    // Opt-in CPU deformation: the mesh must be BOTH in dynamicMeshes AND carry
    // userData.rtDeforming, and its live geometry is read every frame.
    const deforming = isDynamic && obj.userData.rtDeforming === true;
    const hasGroups = isArray && obj.geometry.groups && obj.geometry.groups.length > 0;
    // Multi-material groups are supported on static and rigid-dynamic meshes; the
    // deforming rebake path assumes a single contiguous material range per merged
    // segment, so reject the combination clearly rather than mis-shade it.
    if (hasGroups && deforming) {
      throw new Error(
        "three-realtime-rt: multi-material groups on a CPU-deforming (rtDeforming) " +
        "mesh are not supported — the per-frame live-geometry rebake assumes one " +
        "material range. Use groups on a static or rigid-dynamic mesh, or split the " +
        "deforming mesh into one mesh per material."
      );
    }

    const extracted = extractMeshGeometry(obj);
    tmpGeoms.push(extracted.geo);
    // Map groups → per-vertex material indices (registers each group material in
    // the shared table) and get the ranges for per-group emissive collection.
    const { matIdx, ranges } = resolveMeshMaterials(obj, extracted.count, registerMaterial);
    extracted.geo.setAttribute("materialIndex", new THREE.BufferAttribute(matIdx, 1));
    // Static emissive meshes become NEE area lights (sampled directly with
    // shadow rays instead of waiting for a GI ray to stumble into them).
    // Dynamic emitters are left out — their world-space triangles would go
    // stale — so they keep lighting the old way, via GI-ray hits. Each emissive
    // GROUP contributes its own range.
    if (!isDynamic) {
      for (const r of ranges) {
        const emit = emissiveColor(r.material);
        if (emit) collectEmissiveTriangles(extracted.geo, emit, emissiveTris, r.start, r.vcount);
      }
    }
    if (isDynamic) {
      dynamicGeoms.push(extracted.geo);
      if (deforming) compiled.hasDeforming = true;
      compiled.dynamic.push({
        mesh: obj,
        start: dynVertexOffset,
        count: extracted.count,
        localPos: extracted.localPos,
        localNorm: extracted.localNorm,
        deforming,
        liveGeometry: deforming ? obj.geometry : null,
        indexMap: deforming ? extracted.indexMap : null,
        srcVertexCount: deforming ? extracted.srcVertexCount : 0,
      });
      dynVertexOffset += extracted.count;
    } else {
      staticGeoms.push(extracted.geo);
    }
  });

  if (staticGeoms.length === 0 && dynamicGeoms.length === 0) {
    throw new Error("three-realtime-rt: no meshes found in scene");
  }

  // Static level.
  const s = buildLevel(staticGeoms, { dynamic: false });
  compiled.staticBvh = s.bvh;
  compiled.staticBvhUniform.updateFrom(s.bvh);
  compiled.staticAttrTex.updateFrom(s.attr);

  // Dynamic level.
  compiled.hasDynamic = dynamicGeoms.length > 0;
  const d = buildLevel(dynamicGeoms, { dynamic: true });
  compiled.dynamicMerged = d.merged;
  compiled.dynamicBvh = d.bvh;
  compiled.dynamicBvhUniform.updateFrom(d.bvh);
  compiled.dynamicPacked = d.packed;
  compiled.dynamicPackedAttr = d.attr;
  compiled.dynamicAttrTex.updateFrom(d.attr);

  compiled.triangleCount =
    (s.merged.getAttribute("position").count +
      (compiled.hasDynamic ? d.merged.getAttribute("position").count : 0)) / 3;

  // World-space extent of the static level. Used to auto-scale the ray offset
  // epsilon: dense/large scenes (e.g. a detailed diorama normalized to a few
  // units) need a bigger offset or every shadow ray self-intersects nearby
  // micro-geometry and the scene renders black.
  s.merged.computeBoundingBox();
  const bb = s.merged.boundingBox;
  compiled.sceneDiagonal = bb.isEmpty() ? 1 : bb.min.distanceTo(bb.max);

  if (emissiveTris.length > MAX_EMISSIVE_TRIS) {
    console.warn(
      `three-realtime-rt: ${emissiveTris.length} emissive triangles exceed the ` +
      `NEE cap of ${MAX_EMISSIVE_TRIS}; keeping the largest by area. Dropped ` +
      `triangles no longer act as lights — prefer low-poly emitter meshes.`
    );
    emissiveTris.sort((a, b) => b.area - a.area);
    emissiveTris.length = MAX_EMISSIVE_TRIS;
  }
  compiled.emissiveTriCount = emissiveTris.length;
  compiled.materialsTex = buildSceneDataTexture(materials, emissiveTris);
  syncLights(scene, compiled);

  // Static merged geometry is owned by its BVH (disposed with it); dynamic
  // merged geometry is kept live for re-baking. Dispose the per-mesh temporaries
  // that aren't the merged buffers.
  for (const g of tmpGeoms) {
    if (g !== s.merged && g !== d.merged) g.dispose();
  }
  return compiled;
}

/** (Re)scan the scene's lights into the compiled light tables. Cheap; call anytime. */
export function syncLights(scene, compiled) {
  const posType = compiled.lightPosType;
  const colorRadius = compiled.lightColorRadius;
  const dirCone = compiled.lightDirCone;
  posType.length = 0;
  colorRadius.length = 0;
  dirCone.length = 0;
  let count = 0;
  const tmpP = new THREE.Vector3();
  const tmpT = new THREE.Vector3();

  scene.traverse((obj) => {
    if (!obj.isLight || !obj.visible || obj.intensity <= 0) return;
    if (count >= MAX_LIGHTS) return;
    if (obj.isSpotLight) {
      // posType.w encodes type AND the inner-cone cosine: w = 2 + cosInner
      // (any w >= 1.5 is a spot). Direction + outer cosine live in dirCone.
      obj.getWorldPosition(tmpP);
      obj.target.getWorldPosition(tmpT);
      const dir = tmpT.sub(tmpP).normalize();
      const cosOuter = Math.cos(obj.angle);
      const cosInner = Math.cos(obj.angle * (1 - (obj.penumbra ?? 0)));
      posType.push(tmpP.x, tmpP.y, tmpP.z, 2 + cosInner);
      colorRadius.push(
        obj.color.r * obj.intensity,
        obj.color.g * obj.intensity,
        obj.color.b * obj.intensity,
        obj.userData.rtRadius ?? 0.1
      );
      dirCone.push(dir.x, dir.y, dir.z, cosOuter);
      count++;
    } else if (obj.isPointLight) {
      obj.getWorldPosition(tmpP);
      posType.push(tmpP.x, tmpP.y, tmpP.z, 0);
      colorRadius.push(
        obj.color.r * obj.intensity,
        obj.color.g * obj.intensity,
        obj.color.b * obj.intensity,
        obj.userData.rtRadius ?? 0.15
      );
      dirCone.push(0, 0, 0, 0);
      count++;
    } else if (obj.isDirectionalLight) {
      obj.getWorldPosition(tmpP);
      obj.target.getWorldPosition(tmpT);
      const dir = tmpT.sub(tmpP).normalize();
      posType.push(dir.x, dir.y, dir.z, 1);
      colorRadius.push(
        obj.color.r * obj.intensity,
        obj.color.g * obj.intensity,
        obj.color.b * obj.intensity,
        obj.userData.rtRadius ?? 0.02
      );
      dirCone.push(0, 0, 0, 0);
      count++;
    }
  });

  compiled.lightCount = count;
  while (posType.length < MAX_LIGHTS * 4) {
    posType.push(0, 0, 0, 0);
    colorRadius.push(0, 0, 0, 0);
    dirCone.push(0, 0, 0, 0);
  }
}

export { MAX_LIGHTS };
