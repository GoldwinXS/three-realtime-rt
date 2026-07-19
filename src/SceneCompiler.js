import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  MeshBVH,
  MeshBVHUniformStruct,
  FloatVertexAttributeTexture,
  SAH,
  CENTER,
} from "three-mesh-bvh";

const MAX_LIGHTS = 16; // stage-1 cap; a data-texture light list is future work

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
    this.dynamic = []; // [{ mesh, start, count, localPos, localNorm }]
    this.hasDynamic = false;

    this.materialsTex = null;
    this.materials = [];
    this.lightPosType = [];
    this.lightColorRadius = [];
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
      const lp = seg.localPos;
      const ln = seg.localNorm;
      let o = seg.start * 3;
      let p = seg.start * 4;
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
    // Normals only feed GI-bounce shading off movers — amortize their upload.
    if (this._normalFrame++ % 8 === 0) {
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

function extractMeshGeometry(mesh, materialIndex) {
  const src = mesh.geometry.index
    ? mesh.geometry.toNonIndexed()
    : mesh.geometry.clone();

  if (!src.getAttribute("normal")) src.computeVertexNormals();
  const localPos = src.getAttribute("position").array.slice();
  const localNorm = src.getAttribute("normal").array.slice();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", src.getAttribute("position").clone());
  geo.setAttribute("normal", src.getAttribute("normal").clone());
  geo.applyMatrix4(mesh.matrixWorld); // bake world transform

  const count = geo.getAttribute("position").count;
  const mi = new Float32Array(count).fill(materialIndex);
  geo.setAttribute("materialIndex", new THREE.BufferAttribute(mi, 1));
  return { geo, localPos, localNorm, count };
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
// Packed into ONE texture because the lighting pass already sits at the
// WebGL2-guaranteed 16-sampler limit — a second sampler is not available.
function buildSceneDataTexture(materials, emissiveTris) {
  const width = Math.max(materials.length * 2, emissiveTris.length * 4, 2);
  const data = new Float32Array(width * 2 * 4);
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
  const tex = new THREE.DataTexture(data, width, 2, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

// Collect world-space triangles of an emissive mesh for the NEE light list.
// `geo` is already non-indexed and world-baked by extractMeshGeometry.
function collectEmissiveTriangles(geo, emit, out) {
  const pos = geo.getAttribute("position").array;
  for (let i = 0; i + 8 < pos.length; i += 9) {
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

  scene.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry || !obj.visible || obj.userData.rtExclude) return;
    const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
    // Transparent surfaces must not act as opaque occluders — e.g.
    // LittlestTokyo's glass display case (texture-alpha, opacity 1) would put
    // the whole model in shadow. Alpha-textured glass can't be cheaply tested,
    // so ANY transparent material is skipped like rtExclude (still
    // rasterized). alphaTest cut-outs (transparent: false) stay occluders.
    if (mat.transparent) return;
    let mi = materials.indexOf(mat);
    if (mi < 0) { mi = materials.length; materials.push(mat); }

    const extracted = extractMeshGeometry(obj, mi);
    tmpGeoms.push(extracted.geo);
    // Static emissive meshes become NEE area lights (sampled directly with
    // shadow rays instead of waiting for a GI ray to stumble into them).
    // Dynamic emitters are left out — their world-space triangles would go
    // stale — so they keep lighting the old way, via GI-ray hits.
    const isDynamic = dynamicSet && dynamicSet.has(obj);
    if (!isDynamic) {
      const emit = emissiveColor(mat);
      if (emit) collectEmissiveTriangles(extracted.geo, emit, emissiveTris);
    }
    if (isDynamic) {
      dynamicGeoms.push(extracted.geo);
      compiled.dynamic.push({
        mesh: obj,
        start: dynVertexOffset,
        count: extracted.count,
        localPos: extracted.localPos,
        localNorm: extracted.localNorm,
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
  posType.length = 0;
  colorRadius.length = 0;
  let count = 0;
  const tmpP = new THREE.Vector3();
  const tmpT = new THREE.Vector3();

  scene.traverse((obj) => {
    if (!obj.isLight || !obj.visible || obj.intensity <= 0) return;
    if (count >= MAX_LIGHTS) return;
    if (obj.isPointLight) {
      obj.getWorldPosition(tmpP);
      posType.push(tmpP.x, tmpP.y, tmpP.z, 0);
      colorRadius.push(
        obj.color.r * obj.intensity,
        obj.color.g * obj.intensity,
        obj.color.b * obj.intensity,
        obj.userData.rtRadius ?? 0.15
      );
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
      count++;
    }
  });

  compiled.lightCount = count;
  while (posType.length < MAX_LIGHTS * 4) {
    posType.push(0, 0, 0, 0);
    colorRadius.push(0, 0, 0, 0);
  }
}

export { MAX_LIGHTS };
