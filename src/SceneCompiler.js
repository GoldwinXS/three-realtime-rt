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

// ---- usage diagnostics (warn-once) -----------------------------------------
// Silent "it looks wrong but nothing errored" mistakes are the expensive kind:
// a flag that is ignored, an object type that never reaches the BVH, a mesh
// edited after compileScene(). Each one below is detected at compile time and
// reported ONCE per object (never per frame, never per recompile) with the exact
// fix. The message text is also pushed onto the CompiledScene as
// `warnings: [{ code, message }]` so RealtimeRaytracer can mirror it into
// `status.warnings` for a UI / an automated check.
//
// Warn-once state is keyed by the OBJECT (a WeakMap of code sets), so recompiling
// the same scene does not re-spam the console; the returned `warnings` array is
// still rebuilt on every compile so the status surface stays complete.
const _warnedObjects = new WeakMap();
function _firstTime(obj, code) {
  let set = _warnedObjects.get(obj);
  if (!set) { set = new Set(); _warnedObjects.set(obj, set); }
  if (set.has(code)) return false;
  set.add(code);
  return true;
}

// Human-readable identifier for a scene object in a diagnostic message.
function describeObject(obj) {
  if (!obj) return "(null)";
  return obj.name ? `"${obj.name}"` : `(unnamed ${obj.type || "Object3D"})`;
}

// Join up to `max` object names for a message that covers a whole category.
function describeList(objs, max = 4) {
  const head = objs.slice(0, max).map(describeObject).join(", ");
  return objs.length > max ? `${head} and ${objs.length - max} more` : head;
}

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
    // True when any dynamic segment is a SkinnedMesh — CPU-skinned every frame
    // (shape changes each frame, so it forces a per-frame normal upload too).
    this.hasSkinned = false;

    // Usage diagnostics raised while compiling THIS scene: [{ code, message }].
    // Console output happens once per offending object at collection time;
    // RealtimeRaytracer mirrors this array into status.warnings.
    this.warnings = [];
    // Per-static-mesh fingerprints ({ ref: WeakRef, name, version, matrix,
    // warned }) used to detect a static mesh edited after compile time. Only the
    // WeakRef points at the app's mesh, so this never keeps a scene alive.
    this.staticSources = [];

    this.materialsTex = null;
    this.materials = [];
    // World-space 3D-texture albedo (see collectVolumeAlbedo). null when no
    // material opted in via userData.rtVolumeAlbedo. v1 is single-volume: the
    // FIRST opted-in material wins for the traced-bounce path (the lighting
    // megakernel takes one sampler3D + one material index). Primary visibility
    // (the G-buffer) can carry any number of distinct volumes; only the traced
    // secondary rays are limited to one in v1.
    this.volumeAlbedo = null;
    // Per-material Beer-Lambert absorption (see collectAbsorption): { sigma,
    // count } or null when no material opted in. null keeps row 67 out of the
    // scene-data texture AND the absorption code out of the lighting shader
    // (RTLightingPass strips it back to the byte-identical pre-feature source),
    // so an unused feature costs exactly nothing.
    this.absorption = null;
    // Per-material Kubelka-Munk scattering (see collectScattering): { sigmaS,
    // km, count } or null when no material opted in. null keeps row 68 out of
    // the scene-data texture AND the two-flux code out of the lighting shader,
    // same zero-cost-when-unused contract as absorption above. Non-null FORCES
    // the absorption table to exist too (row 68 is addressed relative to row 67,
    // and the KM shader variant is a superset of the absorption one).
    this.scattering = null;
    this.lightPosType = [];
    this.lightColorRadius = [];
    this.lightDirCone = []; // spot direction.xyz + cos(outer angle)
    this.lightCount = 0;
    this.emissiveTriCount = 0;
    this.triangleCount = 0;

    // Dynamic emissive area lights: the final (post-cap) emissive triangle list
    // and the subset that belongs to dynamic emitters (row + merged-position
    // offset), refreshed in place each updateDynamic(). lastEmissiveRefreshMs is
    // the CPU cost of the most recent refresh (0 when there are none).
    this.emissiveTris = [];
    this._dynamicEmissive = [];
    this.hasDynamicEmissive = false;
    this.lastEmissiveRefreshMs = 0;

    this._m3 = new THREE.Matrix3();
    this._normalFrame = 0;
    this._dynBuildVolume = null; // world-volume of the dynamic set at build time
    this._skinVec = new THREE.Vector3(); // reused per-vertex temp for CPU skinning
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

      if (seg.skinned) {
        // Animated SkinnedMesh: CPU-skin the SOURCE vertices with three's own
        // applyBoneTransform (bindMatrix + bone weights/matrices), then expand
        // through the de-index mapping into the merged triangle soup. In r160
        // applyBoneTransform/getVertexPosition return the vertex in the mesh's
        // LOCAL (bind-relative) space — NOT world — so matrixWorld is still
        // applied here, exactly like the rigid/deforming paths.
        const mesh = seg.mesh;
        // Keep the skeleton's bone texture coherent for the raster (G-buffer)
        // path; applyBoneTransform itself reads bone.matrixWorld, which the app
        // must have posed (mixer.update + a world-matrix update) before this call.
        if (mesh.skeleton) mesh.skeleton.update();
        const local = seg.skinnedLocal;   // Float32Array(srcVertexCount * 3)
        const tmp = this._skinVec;
        const srcN = seg.srcVertexCount;
        // 1. Skin each UNIQUE source vertex ONCE (O(verts x 4 bones)); shared
        //    triangle-soup slots then reuse the cached result.
        for (let sv = 0; sv < srcN; sv++) {
          mesh.getVertexPosition(sv, tmp); // bind pos -> skinned LOCAL space
          local[sv * 3] = tmp.x;
          local[sv * 3 + 1] = tmp.y;
          local[sv * 3 + 2] = tmp.z;
        }
        const map = seg.indexMap; // null = identity (non-indexed source)
        // 2. Expand to the merged layout and transform to world.
        for (let i = 0; i < seg.count; i++) {
          const sv = map ? map[i] : i;
          const x = local[sv * 3], y = local[sv * 3 + 1], z = local[sv * 3 + 2];
          const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
          const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
          const wz = m[2] * x + m[6] * y + m[10] * z + m[14];
          pos[o] = wx;
          pos[o + 1] = wy;
          pos[o + 2] = wz;
          if (wx < minX) minX = wx; if (wx > maxX) maxX = wx;
          if (wy < minY) minY = wy; if (wy > maxY) maxY = wy;
          if (wz < minZ) minZ = wz; if (wz > maxZ) maxZ = wz;
          o += 3;
        }
        // 3. PER-FACE normals from the skinned world triangles — the merged
        //    layout is already a de-indexed triangle soup, so each face's 3
        //    slots get the same geometric normal (flat-shaded). Secondary rays
        //    (shadows/GI) only need the geometry to be right; primary visibility
        //    still gets smooth normals from the raster path. This skips
        //    CPU-skinning the normal attribute entirely.
        let fp = seg.start * 4;
        for (let i = 0; i < seg.count; i += 3) {
          const b = (seg.start + i) * 3;
          const ax = pos[b], ay = pos[b + 1], az = pos[b + 2];
          const e1x = pos[b + 3] - ax, e1y = pos[b + 4] - ay, e1z = pos[b + 5] - az;
          const e2x = pos[b + 6] - ax, e2y = pos[b + 7] - ay, e2z = pos[b + 8] - az;
          let nx = e1y * e2z - e1z * e2y;
          let ny = e1z * e2x - e1x * e2z;
          let nz = e1x * e2y - e1y * e2x;
          const il = 1.0 / (Math.hypot(nx, ny, nz) || 1);
          nx *= il; ny *= il; nz *= il;
          packed[fp] = nx; packed[fp + 1] = ny; packed[fp + 2] = nz;       // v0
          packed[fp + 4] = nx; packed[fp + 5] = ny; packed[fp + 6] = nz;   // v1
          packed[fp + 8] = nx; packed[fp + 9] = ny; packed[fp + 10] = nz;  // v2
          // packed[fp + 3|7|11] (matIndex) never changes
          fp += 12;
        }
      } else if (seg.deforming) {
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
    // rigid movers. Deforming and skinned meshes change shape (not just
    // orientation) every frame, so their normals must go up every frame or the
    // shading lags the silhouette; one such segment forces the whole (shared)
    // upload.
    if (this.hasDeforming || this.hasSkinned || this._normalFrame++ % 8 === 0) {
      this.dynamicAttrTex.updateFrom(this.dynamicPackedAttr);
    }

    // Refresh dynamic emissive area lights from the freshly baked world-space
    // merged positions (rows in the scene-data texture + the power CDF).
    if (this.hasDynamicEmissive) this._refreshDynamicEmissive();
  }

  /**
   * Re-derive dynamic emitters' world-space NEE triangles from the merged
   * dynamic positions this frame, rewrite their rows in the scene-data texture
   * (row 1) and rebuild the power CDF (row 66), then flag the texture for
   * re-upload. The whole (small) texture goes back up — measured in
   * lastEmissiveRefreshMs. Called from updateDynamic (i.e. only when the dynamic
   * set actually updated); an emissive change on an emitter that did NOT move —
   * e.g. recolouring material.emissive — is frozen at compile time and needs a
   * compileScene() (updateLights only rescans analytic THREE lights).
   */
  _refreshDynamicEmissive() {
    const list = this._dynamicEmissive;
    if (list.length === 0) return;
    const now = typeof performance !== "undefined" ? performance : Date;
    const t0 = now.now();
    const tex = this.materialsTex;
    const data = tex.image.data;
    const row = tex.image.width * 4; // texture width in floats
    const pos = this.dynamicMerged.getAttribute("position").array;
    const tris = this.emissiveTris;
    for (let k = 0; k < list.length; k++) {
      const de = list[k];
      const off = de.off;
      const ax = pos[off], ay = pos[off + 1], az = pos[off + 2];
      const e1x = pos[off + 3] - ax, e1y = pos[off + 4] - ay, e1z = pos[off + 5] - az;
      const e2x = pos[off + 6] - ax, e2y = pos[off + 7] - ay, e2z = pos[off + 8] - az;
      let nx = e1y * e2z - e1z * e2y;
      let ny = e1z * e2x - e1x * e2z;
      let nz = e1x * e2y - e1y * e2x;
      const len = Math.hypot(nx, ny, nz);
      const area = len * 0.5;
      const il = len > 1e-10 ? 1 / len : 0; // keep a degenerate frame from NaN-ing
      nx *= il; ny *= il; nz *= il;
      const emit = de.emit;
      // Keep the JS-side tri object current so writeEmissiveCdf sees fresh areas.
      const t = tris[de.row];
      t.v0[0] = ax; t.v0[1] = ay; t.v0[2] = az;
      t.e1[0] = e1x; t.e1[1] = e1y; t.e1[2] = e1z;
      t.e2[0] = e2x; t.e2[1] = e2y; t.e2[2] = e2z;
      t.n[0] = nx; t.n[1] = ny; t.n[2] = nz;
      t.area = area;
      // Row 1 texel (16 floats) — layout must match buildSceneDataTexture.
      const o = row + de.row * 16;
      data[o + 0] = ax; data[o + 1] = ay; data[o + 2] = az; data[o + 3] = area;
      data[o + 4] = e1x; data[o + 5] = e1y; data[o + 6] = e1z; data[o + 7] = emit[0];
      data[o + 8] = e2x; data[o + 9] = e2y; data[o + 10] = e2z; data[o + 11] = emit[1];
      data[o + 12] = nx; data[o + 13] = ny; data[o + 14] = nz; data[o + 15] = emit[2];
    }
    // Areas (and therefore pick probabilities) may have changed — rebuild the CDF.
    writeEmissiveCdf(data, row, tris);
    tex.needsUpdate = true;
    this.lastEmissiveRefreshMs = now.now() - t0;
  }

  dispose() {
    this.staticBvhUniform.dispose();
    this.staticAttrTex.dispose();
    this.dynamicBvhUniform.dispose();
    this.dynamicAttrTex.dispose();
    if (this.materialsTex) this.materialsTex.dispose();
    if (this.staticBvh) this.staticBvh.geometry.dispose();
    if (this.dynamicMerged) this.dynamicMerged.dispose();
    // Drop the staleness fingerprints (WeakRefs + a 16-float matrix each).
    this.staticSources = [];
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

// Average-colour cache for emissive maps: texture -> [r,g,b] linear, or null when
// the image is unreadable (CORS-tainted / not yet decoded). Keyed by the THREE
// texture so the two collect sites (material row + NEE tris) share one solve.
const _emissiveMapAvgCache = new Map();
let _emissiveMapWarned = false;

// sRGB -> linear for one 0..1 channel (three decodes SRGBColorSpace maps this way
// before lighting; average in linear so the cast colour matches the lit look).
function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// CPU average of an emissiveMap: draw the texture image into a small (16x16)
// offscreen canvas and mean the texels. Returns linear [r,g,b] in 0..1, or null
// if the image can't be read (CORS-tainted, or no decoded image yet) — the
// caller then falls back to the map-zeroes-the-light behaviour, once, with a
// console.info explaining why. Result is cached per texture.
function averageEmissiveMap(map) {
  if (_emissiveMapAvgCache.has(map)) return _emissiveMapAvgCache.get(map);
  let result = null;
  try {
    const img = map.image;
    const w = img && (img.width || img.videoWidth || 0);
    const h = img && (img.height || img.videoHeight || 0);
    if (img && w > 0 && h > 0 && typeof document !== "undefined") {
      const N = 16;
      const canvas = document.createElement("canvas");
      canvas.width = N;
      canvas.height = N;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, N, N); // downsample
      const d = ctx.getImageData(0, 0, N, N).data; // throws if the image is tainted
      const toLinear = map.colorSpace !== THREE.NoColorSpace && map.colorSpace !== THREE.LinearSRGBColorSpace;
      let r = 0, g = 0, b = 0;
      const n = d.length / 4;
      for (let i = 0; i < d.length; i += 4) {
        if (toLinear) {
          r += srgbToLinear(d[i] / 255);
          g += srgbToLinear(d[i + 1] / 255);
          b += srgbToLinear(d[i + 2] / 255);
        } else {
          r += d[i] / 255; g += d[i + 1] / 255; b += d[i + 2] / 255;
        }
      }
      result = [r / n, g / n, b / n];
    }
  } catch (e) {
    result = null; // CORS-tainted (SecurityError) or unreadable
  }
  if (result === null && !_emissiveMapWarned) {
    _emissiveMapWarned = true;
    console.info(
      "three-realtime-rt: an emissiveMap could not be read on the CPU (CORS-tainted " +
      "or not yet decoded), so its mesh casts no area light — it is still drawn " +
      "per-pixel in the G-buffer. Serve the texture same-origin (or set " +
      "image.crossOrigin) to enable the average-colour approximation."
    );
  }
  _emissiveMapAvgCache.set(map, result);
  return result;
}

// Effective emissive colour (already scaled by intensity), or null if the
// material doesn't emit. A plain emissive colour is used directly; an
// emissiveMap is approximated by its AVERAGE colour (avg(map) x emissive x
// emissiveIntensity) so a textured emitter casts (approximately) correct light —
// the G-buffer still renders it per-pixel, so it LOOKS patterned. An unreadable
// map falls back to null (visible only), matching the old exclusion.
function emissiveColor(mat) {
  if (!mat.emissive) return null;
  const i = mat.emissiveIntensity ?? 1;
  if (i <= 0 || mat.emissive.r + mat.emissive.g + mat.emissive.b <= 0) return null;
  if (mat.emissiveMap != null) {
    const avg = averageEmissiveMap(mat.emissiveMap);
    if (avg == null) return null; // unreadable -> current behaviour (visible only)
    const emit = [mat.emissive.r * i * avg[0], mat.emissive.g * i * avg[1], mat.emissive.b * i * avg[2]];
    // A map that averages to (near) black casts no meaningful light — treat it
    // as visible-only, like a black emissive colour. This keeps an incidental
    // textured emissive (a high-poly model whose emissiveMap is mostly dark with
    // a few tiny glowing texels — e.g. DamagedHelmet) out of the NEE list rather
    // than flooding it with the whole mesh; a real neon sign clears this easily.
    const lum = 0.2126 * emit[0] + 0.7152 * emit[1] + 0.0722 * emit[2];
    if (lum < 1e-3) return null;
    return emit;
  }
  return [mat.emissive.r * i, mat.emissive.g * i, mat.emissive.b * i];
}

// World-space 3D-texture albedo ("volumetric surface albedo"). A material opts
// in with `material.userData.rtVolumeAlbedo = { texture, origin, size }`:
//   texture — a THREE.Data3DTexture, ALREADY colour-mapped to RGB(A); the tracer
//             samples its .rgb at the hit point (no colormap logic in the library)
//   origin  — THREE.Vector3, world position of the texel-(0,0,0) corner
//   size    — THREE.Vector3, world extent of the full volume along each axis
// The hit point p maps to uvw = clamp((p - origin) / size, 0, 1) and the trilinear
// sample replaces the material's base albedo. Everything else (roughness, metalness,
// emissive) composes normally. Returns { matIndex, texture, origin, size, material }
// for the FIRST opted-in material (v1 single-volume for the traced-bounce path), or
// null. `materials` is the deduped table, so matIndex is the exact index the BVH
// per-vertex attribute stores and the lighting pass reads via fetchMaterial().
function collectVolumeAlbedo(materials) {
  let found = null;
  let extra = 0;
  for (let i = 0; i < materials.length; i++) {
    const desc = materials[i] && materials[i].userData && materials[i].userData.rtVolumeAlbedo;
    if (!desc) continue;
    if (found) { extra++; continue; }
    const texture = desc.texture;
    const is3D = texture && (texture.isData3DTexture || texture.isDataArrayTexture ||
      (texture.image && texture.image.depth > 0));
    if (!texture || !is3D) {
      console.warn(
        "three-realtime-rt: userData.rtVolumeAlbedo.texture must be a THREE.Data3DTexture " +
        "(RGB[A], pre-colormapped) — ignoring this material's volume albedo."
      );
      continue;
    }
    const origin = new THREE.Vector3().copy(desc.origin ?? new THREE.Vector3(0, 0, 0));
    // Guard a zero extent (would divide by zero in the shader) — fall back to 1.
    const size = new THREE.Vector3().copy(desc.size ?? new THREE.Vector3(1, 1, 1));
    if (size.x === 0) size.x = 1;
    if (size.y === 0) size.y = 1;
    if (size.z === 0) size.z = 1;
    // Trilinear + clamp-to-edge is what "sample the field on the surface" means;
    // set it here so callers don't have to remember (the shader also clamps uvw,
    // so wrapping only matters for the edge texel's interpolation). We only touch
    // filtering/wrapping, never the caller's data or colour space.
    let changed = false;
    if (texture.magFilter !== THREE.LinearFilter) { texture.magFilter = THREE.LinearFilter; changed = true; }
    if (texture.minFilter !== THREE.LinearFilter) { texture.minFilter = THREE.LinearFilter; changed = true; }
    if (texture.wrapS !== THREE.ClampToEdgeWrapping) { texture.wrapS = THREE.ClampToEdgeWrapping; changed = true; }
    if (texture.wrapT !== THREE.ClampToEdgeWrapping) { texture.wrapT = THREE.ClampToEdgeWrapping; changed = true; }
    if (texture.wrapR !== THREE.ClampToEdgeWrapping) { texture.wrapR = THREE.ClampToEdgeWrapping; changed = true; }
    if (changed) texture.needsUpdate = true;
    found = { matIndex: i, texture, origin, size, material: materials[i] };
  }
  if (extra > 0) {
    console.warn(
      `three-realtime-rt: ${extra + 1} materials set userData.rtVolumeAlbedo, but v1 samples ` +
      `only ONE volume in the traced-bounce (GI/reflection) path — keeping the first. The other ` +
      `volumes still render correctly in primary visibility (the G-buffer); multi-volume bounces ` +
      `are future work.`
    );
  }
  return found;
}

// Per-material Beer-Lambert absorption ("tinted glass done right"). Light that
// travels a distance d INSIDE a refractive medium is attenuated per channel by
// exp(-sigma * d): a thick slab of the same glass tints deeper than a thin one,
// stacked thicknesses compound, and a backlit pane glows in the filtered colour
// — none of which a flat surface tint can express. Two ways in, mirroring
// three.js's MeshPhysicalMaterial convention:
//
//   1. `attenuationColor` (THREE.Color) + `attenuationDistance` (finite > 0,
//      world units) on a material the tracer already treats as GLASS
//      (transmission > 0, not `transparent`). attenuationColor is the colour
//      that SURVIVES one attenuationDistance of travel, so
//      sigma = -ln(attenuationColor) / attenuationDistance. three's own default
//      attenuationDistance is Infinity ("no absorption"), which makes a finite
//      value the explicit opt-in.
//   2. `userData.rtAttenuation = { color, distance }` — the same two parameters
//      for materials that don't HAVE the physical fields (MeshStandardMaterial
//      and friends, given a `transmission` the tracer reads either way). `color`
//      accepts a THREE.Color or a plain [r,g,b]; when both routes are present,
//      userData wins.
//
// Colour channels are floored at 1e-4 so a pure-black attenuationColor yields a
// large but finite sigma; a channel >= 1 would mean gain, and clamps to sigma 0.
// A material whose every channel lands on sigma 0 (white attenuationColor) is
// treated as non-absorbing — exactly today's behaviour, as is setting nothing.
function absorptionSigmaFor(mat) {
  if (!mat) return null;
  // Only glass surfaces ever have an in-medium path length to attenuate over
  // (the refracted entry-to-exit chord in RTLightingPass.glassRadiance), and the
  // shader identifies the medium by the material of the interface a refracted
  // ray lands on — so a sigma on a non-glass material could only ever tint a
  // path through AIR. Gate it out here rather than mis-render there.
  const isGlass = (mat.transmission ?? 0) > 0 && !mat.transparent;
  const ud = mat.userData && mat.userData.rtAttenuation;
  let color = null;
  let distance = 0;
  if (ud) {
    const c = ud.color;
    if (c && typeof c.r === "number") color = [c.r, c.g, c.b];
    else if (Array.isArray(c) && c.length >= 3) color = [c[0], c[1], c[2]];
    distance = ud.distance;
    if (!color || !Number.isFinite(distance) || distance <= 0) {
      console.warn(
        "three-realtime-rt: userData.rtAttenuation needs { color: THREE.Color | [r,g,b], " +
          "distance: finite > 0 (world units) } — ignoring this material's absorption."
      );
      return null;
    }
    if (!isGlass) {
      console.warn(
        "three-realtime-rt: userData.rtAttenuation is set on a material the tracer does not " +
          "trace as glass (needs transmission > 0 and transparent: false) — absorption only " +
          "acts along refracted in-medium paths, so it is ignored on this material."
      );
      return null;
    }
  } else {
    if (!isGlass) return null;
    const c = mat.attenuationColor;
    distance = mat.attenuationDistance;
    if (!c || typeof c.r !== "number") return null;
    // Infinity is three's "no attenuation" default — not an opt-in, stay quiet.
    if (!Number.isFinite(distance) || distance <= 0) return null;
    color = [c.r, c.g, c.b];
  }
  const sigma = [0, 0, 0];
  let absorbs = false;
  for (let ch = 0; ch < 3; ch++) {
    const s = -Math.log(Math.max(color[ch], 1e-4)) / distance;
    sigma[ch] = s > 0 ? s : 0;
    if (sigma[ch] > 0) absorbs = true;
  }
  return absorbs ? sigma : null;
}

// Build the per-material absorption table from the DEDUPED material list, so
// index i here is exactly the matIndex the BVH per-vertex attribute stores and
// the lighting pass fetches. Returns { sigma: Float32Array(materials.length*3),
// glass: Float32Array(materials.length), count } when at least one material
// absorbs, else null — and null keeps row 67 out of the scene-data texture and
// the absorption code out of the lighting shader (RTLightingPass.setAbsorption),
// the zero-cost-when-unused contract.
//
// `glass` is each material's TRANSMISSION, tabled for EVERY material (not just
// the absorbing ones) because coloured shadows need the opposite question
// answered: not "how much does this tint" but "does a shadow ray pass through
// this at all". It rides row 67's otherwise-unused .w channel, so it costs no
// bytes and no sampler. A hit whose material reads 0 there is opaque to shadow
// rays exactly as it was before; a glass material with sigma 0 (clear glass)
// passes light through untinted, which master could not express.
// `force` materializes the table even when nothing absorbs. Kubelka-Munk needs
// it: a purely scattering pigment (white, K = 0) has sigma 0 in every channel,
// but the two-flux code reads K from this very row and the glass flag from its
// .w, so the row has to exist whenever a KM material does.
function collectAbsorption(materials, force = false) {
  let count = 0;
  const sigma = new Float32Array(materials.length * 3);
  const glass = new Float32Array(materials.length);
  for (let i = 0; i < materials.length; i++) {
    const mat = materials[i];
    // Same glass test absorptionSigmaFor gates on, and the same one GBufferPass
    // packs into the [2,4) band of the material word: a transparent surface is
    // kept out of the BVH entirely, so it can never be a shadow-ray hit anyway.
    glass[i] = mat && !mat.transparent ? mat.transmission ?? 0 : 0;
    const s = absorptionSigmaFor(mat);
    if (!s) continue;
    sigma[i * 3 + 0] = s[0];
    sigma[i * 3 + 1] = s[1];
    sigma[i * 3 + 2] = s[2];
    count++;
  }
  return count > 0 || force ? { sigma, glass, count } : null;
}

// Per-material KUBELKA-MUNK SCATTERING — the half of translucency absorption
// alone cannot express. Beer-Lambert only ever REMOVES light, so a pigmented
// solid lit from the front renders as black murk: nothing sends the light back
// out of the surface. A scattering coefficient S does, and the two-flux closed
// form turns (K, S, thickness) into a reflectance AND a transmittance — jade,
// wax, marble, a lampshade, a leaf, coloured plastic. See src/kubelkaMunk.js for
// the maths and RTLightingPass for where it is evaluated.
//
// Opt-in is `userData.rtScattering`, deliberately shaped like 0.8.0's
// `userData.rtAttenuation` so the two read as one family. Two ways to state S,
// both per channel, both in 1/world-unit:
//
//   1. { color, distance } — `color` is the fraction of flux that survives one
//      `distance` of travel WITHOUT being scattered, so S = -ln(color)/distance.
//      Identical derivation (and identical 1e-4 floor) to attenuationColor +
//      attenuationDistance. This is the authoring-friendly route: "at 5 mm this
//      much light is still going straight".
//   2. { coefficient } — S directly, as a number (grey) or [r,g,b] / THREE.Color,
//      for anyone who has measured or fitted real Kubelka-Munk coefficients.
//      Wins if both are present.
//
// K comes from the material's ABSORPTION (attenuationColor + attenuationDistance
// or userData.rtAttenuation, exactly as in 0.8.0) rather than a third parameter:
// K is an absorption coefficient, the library already has a well-tested way to
// author one, and reusing it means a material's colour and its opacity stay
// described in one place. A KM material with no attenuation set is the K = 0
// case — a pure white scatterer — which is a perfectly good material, not an
// error.
function scatteringSigmaFor(mat) {
  if (!mat) return null;
  const ud = mat.userData && mat.userData.rtScattering;
  if (!ud) return null;
  // Same gate as absorption, for the same reason: the view and shadow marches
  // only ever step INTO a body the tracer treats as passable glass. A KM
  // coefficient on an opaque surface has no interior to describe.
  const isGlass = (mat.transmission ?? 0) > 0 && !mat.transparent;
  if (!isGlass) {
    console.warn(
      "three-realtime-rt: userData.rtScattering is set on a material the tracer does not " +
        "trace as translucent (needs transmission > 0 and transparent: false) — the " +
        "Kubelka-Munk march never enters an opaque body, so it is ignored on this material."
    );
    return null;
  }
  const asRGB = (c) => {
    if (typeof c === "number") return [c, c, c];
    if (c && typeof c.r === "number") return [c.r, c.g, c.b];
    if (Array.isArray(c) && c.length >= 3) return [c[0], c[1], c[2]];
    return null;
  };
  let s = null;
  if (ud.coefficient !== undefined) {
    s = asRGB(ud.coefficient);
    if (!s || !s.every((v) => Number.isFinite(v) && v >= 0)) {
      console.warn(
        "three-realtime-rt: userData.rtScattering.coefficient needs a non-negative number, " +
          "[r,g,b] or THREE.Color (scattering coefficient in 1/world-unit) — ignoring this " +
          "material's scattering."
      );
      return null;
    }
  } else {
    const color = asRGB(ud.color);
    const distance = ud.distance;
    if (!color || !Number.isFinite(distance) || distance <= 0) {
      console.warn(
        "three-realtime-rt: userData.rtScattering needs either { coefficient } or " +
          "{ color: THREE.Color | [r,g,b], distance: finite > 0 (world units) } — ignoring " +
          "this material's scattering."
      );
      return null;
    }
    s = color.map((v) => {
      const c = -Math.log(Math.max(v, 1e-4)) / distance;
      return c > 0 ? c : 0;
    });
  }
  // All-zero S is "no scattering", i.e. plain Beer-Lambert glass — exactly the
  // 0.8.0 behaviour, and not worth compiling the two-flux path in for.
  return s.some((v) => v > 0) ? s : null;
}

// Build the per-material scattering table from the DEDUPED material list, so
// index i is the matIndex the BVH per-vertex attribute stores. Returns
// { sigmaS: Float32Array(n*3), km: Float32Array(n), count } when at least one
// material scatters, else null — and null keeps row 68 out of the scene-data
// texture and the two-flux code out of the lighting shader.
//
// `km` is the per-body ENABLE FLAG (1 or 0), tabled for every material and read
// from row 68's .w. It is what lets a scene mix plain absorbing glass and
// scattering pigment: a march crossing an interface asks this flag whether to
// charge the segment to Beer-Lambert or to the two-flux composition. It is a
// separate flag rather than "S is non-zero" because a KM material may
// legitimately have S = 0 in one channel (a pigment that scatters no blue).
function collectScattering(materials) {
  let count = 0;
  const sigmaS = new Float32Array(materials.length * 3);
  const km = new Float32Array(materials.length);
  for (let i = 0; i < materials.length; i++) {
    const s = scatteringSigmaFor(materials[i]);
    if (!s) continue;
    sigmaS[i * 3 + 0] = s[0];
    sigmaS[i * 3 + 1] = s[1];
    sigmaS[i * 3 + 2] = s[2];
    km[i] = 1;
    count++;
    // The KM reflectance is delivered as the surface's DIFFUSE ALBEDO, and
    // CompositePass multiplies the lighting by the G-buffer albedo — the same
    // convention cast glass already lives under. A non-white base colour
    // therefore tints the computed reflectance on top of the pigment's own
    // colour, which is almost never what the author meant.
    const c = materials[i].color;
    if (c && (c.r < 0.999 || c.g < 0.999 || c.b < 0.999)) {
      console.warn(
        "three-realtime-rt: a userData.rtScattering material has a non-white base colour " +
          `(${c.r.toFixed(3)}, ${c.g.toFixed(3)}, ${c.b.toFixed(3)}). The Kubelka-Munk ` +
          "reflectance IS the diffuse albedo, and the composite multiplies it by this " +
          "colour — set the material colour to white and let K and S carry the pigment, " +
          "or accept the extra tint deliberately."
      );
    }
  }
  return count > 0 ? { sigmaS, km, count } : null;
}

// SCENE-DATA TEXTURE LAYOUT (RGBA32F, NEAREST, texelFetch only). Every consumer
// (RTLightingPass, GIReservoirPass, RestirPass, VolumetricPass) addresses rows
// by ABSOLUTE row constants, so rows may only ever be APPENDED.
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
// Row 67 (OPTIONAL — present only when `absorption` is non-null): per-material
//   Beer-Lambert absorption coefficients, 1 texel per material:
//   [sigma.r | sigma.g | sigma.b | transmission] — sigma in 1/world-unit (see
//   collectAbsorption for the derivation), and .w the material's transmission,
//   which is the "is this glass to shadow rays" flag the coloured-shadow march
//   keys on (it was a hard-coded 0 before that feature and cost a channel that
//   was already allocated). RTLightingPass reads the row only when its
//   absorption code is spliced in, which is exactly when the row exists.
//   WHY A NEW ROW, NOT A WIDER PER-MATERIAL STRIDE: both row-0 texels are fully
//   occupied (rgb+roughness, rgb+metalness — zero spare channels), and the *2
//   stride arithmetic is duplicated across two shaders (fetchMaterial in
//   RTLightingPass AND GIReservoirPass) while four passes index OTHER rows of
//   this same texture by absolute constants. Appending a row leaves every
//   existing fetch byte-identical; widening the stride would touch them all.
//   The row is simply omitted when nothing absorbs, so the unused feature costs
//   zero bytes.
// Row 68 (OPTIONAL — present only when `scattering` is non-null, which also
//   forces row 67 to exist): per-material KUBELKA-MUNK SCATTERING, 1 texel per
//   material: [S.r | S.g | S.b | kmEnabled] — S in 1/world-unit (see
//   collectScattering), and .w a 1/0 flag saying whether this body's interior is
//   evaluated with the two-flux model at all. The absorption coefficient K is
//   NOT duplicated here: it is row 67's sigma, so a material states its colour
//   once. The derived a = 1 + K/S and b = sqrt(a*a - 1) are deliberately NOT
//   tabled — they would need a second row (nine floats per material, and one
//   texel holds four), and they are ~6 ALU to recompute on the handful of
//   fragments that actually cross a scattering body. Measured cost of the
//   recompute is inside the noise of the march itself.
// All packed into ONE texture because the lighting pass already sits at the
// WebGL2-guaranteed 16-sampler limit — extra samplers are not available.
function buildSceneDataTexture(materials, emissiveTris, absorption, scattering) {
  const bn = decodeBlueNoise();
  const width = Math.max(materials.length * 2, emissiveTris.length * 4, BLUE_NOISE_SIZE);
  const height = 2 + BLUE_NOISE_SIZE + 1 + (absorption ? 1 : 0) + (scattering ? 1 : 0);
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
  // Emissive power CDF (row 66). Factored out so updateDynamic can rebuild it
  // in place when a dynamic emitter's area/position changed this frame.
  writeEmissiveCdf(data, row, emissiveTris);
  // Absorption sigma (row 67) — written only when the row was allocated. Fits by
  // construction: width >= materials.length * 2 > materials.length texels.
  if (absorption) {
    const absRow = (2 + BLUE_NOISE_SIZE + 1) * row;
    const s = absorption.sigma;
    const g = absorption.glass;
    for (let i = 0; i < materials.length; i++) {
      data[absRow + i * 4 + 0] = s[i * 3 + 0];
      data[absRow + i * 4 + 1] = s[i * 3 + 1];
      data[absRow + i * 4 + 2] = s[i * 3 + 2];
      data[absRow + i * 4 + 3] = g[i]; // transmission: the coloured-shadow glass flag
    }
  }
  // Kubelka-Munk scattering (row 68). Only reachable with row 67 present — the
  // row index is absolute, and collectScattering's contract is that a non-null
  // table forces the absorption table to be materialized alongside it.
  if (scattering) {
    const kmRow = (2 + BLUE_NOISE_SIZE + 2) * row;
    const s = scattering.sigmaS;
    const km = scattering.km;
    for (let i = 0; i < materials.length; i++) {
      data[kmRow + i * 4 + 0] = s[i * 3 + 0];
      data[kmRow + i * 4 + 1] = s[i * 3 + 1];
      data[kmRow + i * 4 + 2] = s[i * 3 + 2];
      data[kmRow + i * 4 + 3] = km[i]; // per-body two-flux enable
    }
  }
  const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

// Write the emissive power CDF (row 66 of the scene-data texture). Weight =
// area x emitted luminance; degenerate totals fall back to the uniform pick.
// The layout matches the row-66 comment in buildSceneDataTexture. `row` is the
// texture width in floats (width * 4). Reused by updateDynamic's in-place refresh.
function writeEmissiveCdf(data, row, emissiveTris) {
  if (emissiveTris.length === 0) return;
  const cdfRow = (2 + BLUE_NOISE_SIZE) * row;
  let total = 0;
  const w = new Array(emissiveTris.length);
  for (let i = 0; i < emissiveTris.length; i++) {
    const t = emissiveTris[i];
    w[i] = t.area * (0.2126 * t.emit[0] + 0.7152 * t.emit[1] + 0.0722 * t.emit[2]);
    total += w[i];
  }
  let cum = 0;
  for (let i = 0; i < emissiveTris.length; i++) {
    const p = total > 0 ? w[i] / total : 1 / emissiveTris.length;
    cum += p;
    data[cdfRow + i * 4 + 0] = i === emissiveTris.length - 1 ? 1.0 : cum;
    data[cdfRow + i * 4 + 1] = p;
  }
}

// Collect world-space triangles of an emissive mesh for the NEE light list.
// `geo` is already non-indexed and world-baked by extractMeshGeometry. An
// optional [vStart, vCount) vertex range restricts collection to one material
// group (ranges are triangle-aligned, so this stays whole-triangle).
//
// `dynBase` >= 0 tags each triangle as belonging to a DYNAMIC emitter: dynBase is
// the float offset of this mesh's segment in the merged dynamic position array
// (segStart * 3), so `dynOff` records where the triangle's v0/e1/e2 live there.
// updateDynamic re-derives the world-space triangle from those merged positions
// each frame (the merged array already holds the freshly transformed vertices).
function collectEmissiveTriangles(geo, emit, out, vStart = 0, vCount = -1, dynBase = -1) {
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
    const tri = {
      v0: [pos[i], pos[i + 1], pos[i + 2]],
      e1,
      e2,
      n: [cx / len, cy / len, cz / len],
      area: len * 0.5,
      emit,
    };
    if (dynBase >= 0) {
      tri.dyn = true;
      tri.dynOff = dynBase + i; // float offset of v0 in the merged dynamic positions
    }
    out.push(tri);
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

  // Usage diagnostics collected during the traverse (see _warnedObjects above).
  // Each category is reported as ONE aggregated message after the traverse, so a
  // scene with fifty offenders costs one console line, not fifty.
  const warnings = [];
  const diag = {
    "rtdeforming-not-dynamic": [],
    "untraceable-object": [],
    "instanced-mesh": [],
    "transparent-dynamic": [],
  };
  // Per-static-mesh fingerprints for the post-compile staleness check (see
  // RealtimeRaytracer._checkStale). WeakRef so a mesh removed from the scene
  // can still be collected — the compiled scene must never keep it alive.
  const staticSources = [];
  const canTrack = typeof WeakRef === "function";

  const registerMaterial = (m) => {
    let i = materials.indexOf(m);
    if (i < 0) { i = materials.length; materials.push(m); }
    return i;
  };

  scene.traverse((obj) => {
    // Object types the tracer cannot represent: they are not triangles in a BVH,
    // and their ESSL1 materials cannot write the 4-attachment G-buffer either, so
    // GBufferPass hides them for the traced frame. Say so once. An explicit
    // rtExclude means the app already knows — stay quiet for those.
    if ((obj.isSprite || obj.isLine || obj.isPoints) && obj.visible && !obj.userData.rtExclude) {
      diag["untraceable-object"].push(obj);
      return;
    }
    if (!obj.isMesh || !obj.geometry || !obj.visible || obj.userData.rtExclude) return;
    // An InstancedMesh is traversed as ONE mesh: its per-instance matrices are a
    // GPU attribute the compiler never reads, so every instance past the first
    // silently vanishes from the traced world (and from the G-buffer).
    if (obj.isInstancedMesh) diag["instanced-mesh"].push(obj);
    const isArray = Array.isArray(obj.material);
    const rep = isArray ? obj.material[0] : obj.material;
    // Transparent surfaces must not act as opaque occluders — e.g.
    // LittlestTokyo's glass display case (texture-alpha, opacity 1) would put
    // the whole model in shadow. Alpha-textured glass can't be cheaply tested,
    // so ANY transparent material is skipped like rtExclude (still
    // rasterized). alphaTest cut-outs (transparent: false) stay occluders.
    if (rep.transparent) {
      // Listing a transparent mesh in dynamicMeshes does nothing at all — it is
      // dropped here, BEFORE the dynamic registration below, so it is never
      // BVH-traced and updateDynamic() never touches it.
      if (dynamicSet && dynamicSet.has(obj)) diag["transparent-dynamic"].push(obj);
      return;
    }

    const isDynamic = dynamicSet && dynamicSet.has(obj);
    // rtDeforming alone does nothing: the flag is only read for meshes that are
    // ALSO in dynamicMeshes (there is no dynamic segment to re-bake otherwise).
    // Without this warning the mesh compiles static and its traced shadow keeps
    // the compile-time shape forever, silently.
    if (obj.userData.rtDeforming === true && !isDynamic) {
      diag["rtdeforming-not-dynamic"].push(obj);
    }
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
    // Emissive meshes become NEE area lights (sampled directly with shadow rays
    // instead of waiting for a GI ray to stumble into them). Each emissive GROUP
    // contributes its own range. STATIC emitters are collected in world space
    // once; DYNAMIC emitters are ALSO collected now but tagged with their merged
    // segment offset (segStart * 3) so updateDynamic() can re-derive their
    // world-space triangles each frame from the freshly baked merged positions.
    if (isDynamic) {
      const segStart = dynVertexOffset; // this segment's vertex base in the merged array
      dynamicGeoms.push(extracted.geo);
      for (const r of ranges) {
        const emit = emissiveColor(r.material);
        if (emit)
          collectEmissiveTriangles(extracted.geo, emit, emissiveTris, r.start, r.vcount, segStart * 3);
      }
      // A SkinnedMesh is auto-detected (no userData flag): it is CPU-skinned from
      // its live skeleton pose every frame. Opt-in CPU deformation (water/cloth)
      // instead requires userData.rtDeforming and reads live geometry. The two are
      // mutually exclusive; skinning wins if a mesh is somehow both.
      const skinned = obj.isSkinnedMesh === true;
      const deforming = !skinned && obj.userData.rtDeforming === true;
      if (deforming) compiled.hasDeforming = true;
      if (skinned) compiled.hasSkinned = true;
      compiled.dynamic.push({
        mesh: obj,
        start: dynVertexOffset,
        count: extracted.count,
        localPos: extracted.localPos,
        localNorm: extracted.localNorm,
        deforming,
        skinned,
        liveGeometry: deforming ? obj.geometry : null,
        // Skinned and deforming segments both expand live/source vertices back
        // into the merged de-indexed layout through this mapping.
        indexMap: deforming || skinned ? extracted.indexMap : null,
        srcVertexCount: deforming || skinned ? extracted.srcVertexCount : 0,
        // Cache of per-source-vertex skinned LOCAL positions (skinned segs only),
        // filled each frame so shared triangle-soup slots reuse one skin solve.
        skinnedLocal: skinned ? new Float32Array(extracted.srcVertexCount * 3) : null,
      });
      dynVertexOffset += extracted.count;
    } else {
      staticGeoms.push(extracted.geo);
      for (const r of ranges) {
        const emit = emissiveColor(r.material);
        if (emit) collectEmissiveTriangles(extracted.geo, emit, emissiveTris, r.start, r.vcount);
      }
      // Fingerprint this static source so a later edit (vertices moved, mesh
      // moved) can be DETECTED instead of quietly tracing the old shape. Two
      // cheap comparands: the position attribute's version counter and a copy of
      // matrixWorld. Held via WeakRef — never a strong reference.
      if (canTrack) {
        const pos = obj.geometry.getAttribute("position");
        staticSources.push({
          ref: new WeakRef(obj),
          name: describeObject(obj),
          version: pos ? pos.version : -1,
          // Float64Array, NOT Float32Array: three's Matrix4.elements holds
          // doubles, so a float32 snapshot rounds every element by up to ~1e-7
          // and EVERY static mesh then compares as "moved" (measured: the demo
          // scene reported 36 of 41 sources stale on the first run of this scan).
          matrix: new Float64Array(obj.matrixWorld.elements),
          warned: false,
        });
      }
    }
  });

  // ---- report the collected usage diagnostics (one line per category) -------
  const note = (code, message) => {
    warnings.push({ code, message });
  };
  const report = (code, objs, build) => {
    if (objs.length === 0) return;
    const fresh = objs.filter((o) => _firstTime(o, code));
    const message = build(objs);
    note(code, message);
    if (fresh.length > 0) console.warn(message);
  };
  report("rtdeforming-not-dynamic", diag["rtdeforming-not-dynamic"], (objs) =>
    `three-realtime-rt: userData.rtDeforming is set on a mesh that is NOT in ` +
    `compileScene(scene, {dynamicMeshes:[...]}) — the flag is IGNORED, the mesh ` +
    `compiles STATIC, and traced shadows/GI keep its compile-time shape forever: ` +
    `${describeList(objs)}. Add it to dynamicMeshes and call updateDynamic() each ` +
    `frame to make it actually deform.`
  );
  report("untraceable-object", diag["untraceable-object"], (objs) =>
    `three-realtime-rt: Sprite/Line/Points objects are not traceable geometry and ` +
    `are auto-hidden from the traced frame (their materials cannot write the ` +
    `4-attachment G-buffer): ${describeList(objs)}. Draw them in your own overlay ` +
    `pass on top of rt.render(), or set userData.rtExclude = true to silence this.`
  );
  report("instanced-mesh", diag["instanced-mesh"], (objs) =>
    `three-realtime-rt: InstancedMesh is NOT supported — it collapses to a single ` +
    `instance in the traced output and in the G-buffer: ${describeList(objs)}. ` +
    `Expand it to individual meshes, or set userData.rtExclude = true to exclude it.`
  );
  report("transparent-dynamic", diag["transparent-dynamic"], (objs) =>
    `three-realtime-rt: a transparent mesh listed in dynamicMeshes does nothing — ` +
    `transparent meshes are composited via the blend path and are never BVH-traced ` +
    `or dynamic-registered: ${describeList(objs)}. Remove it from dynamicMeshes, or ` +
    `make the material opaque (transparent: false) if it should cast traced shadows.`
  );
  compiled.warnings = warnings;
  compiled.staticSources = staticSources;

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
      `NEE cap of ${MAX_EMISSIVE_TRIS} (shared across static + dynamic emitters); ` +
      `keeping the largest by area (measured at compile time). Dropped triangles ` +
      `no longer act as lights — prefer low-poly emitter meshes, especially for ` +
      `dynamic ones (their tris are refreshed every frame).`
    );
    emissiveTris.sort((a, b) => b.area - a.area);
    emissiveTris.length = MAX_EMISSIVE_TRIS;
  }
  compiled.emissiveTriCount = emissiveTris.length;
  // Keep the final (post-cap) emissive list so updateDynamic can rebuild the
  // power CDF, and record which surviving rows belong to dynamic emitters (with
  // their merged-position offset) so their world-space triangles can be
  // refreshed per frame. Rows stay index-stable after this point, so the
  // reservoir passes' triangle ids remain valid across refreshes.
  compiled.emissiveTris = emissiveTris;
  compiled._dynamicEmissive = [];
  for (let r = 0; r < emissiveTris.length; r++) {
    const t = emissiveTris[r];
    if (t.dyn) compiled._dynamicEmissive.push({ row: r, off: t.dynOff, emit: t.emit });
  }
  compiled.hasDynamicEmissive = compiled._dynamicEmissive.length > 0;
  // Per-material Beer-Lambert absorption opt-in (attenuationColor +
  // attenuationDistance, or userData.rtAttenuation). Resolved BEFORE the scene
  // data texture is built because a non-null table appends row 67 to it.
  // Kubelka-Munk scattering opt-in (userData.rtScattering). Resolved FIRST
  // because a non-null table forces the absorption row to exist even when
  // nothing absorbs — the two-flux code reads K from row 67 and the glass flag
  // from its .w, and row 68 is addressed relative to it.
  compiled.scattering = collectScattering(materials);
  compiled.absorption = collectAbsorption(materials, !!compiled.scattering);
  compiled.materialsTex = buildSceneDataTexture(
    materials,
    emissiveTris,
    compiled.absorption,
    compiled.scattering
  );
  // World-space 3D-texture albedo opt-in (userData.rtVolumeAlbedo). Resolved from
  // the deduped material table so the recorded matIndex matches what the BVH
  // per-vertex attribute stores and the lighting pass reads.
  compiled.volumeAlbedo = collectVolumeAlbedo(materials);
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
