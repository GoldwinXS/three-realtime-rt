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
    this.triangleCount = 0;

    this._m3 = new THREE.Matrix3();
    this._normalFrame = 0;
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
        pos[o] = m[0] * x + m[4] * y + m[8] * z + m[12];
        pos[o + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
        pos[o + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
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
    this.dynamicBvh.refit();
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

function buildMaterialsTexture(materials) {
  const width = Math.max(materials.length * 2, 2);
  const data = new Float32Array(width * 4);
  materials.forEach((mat, i) => {
    const o = i * 8;
    const color = mat.color ?? new THREE.Color(1, 1, 1);
    const emissive =
      mat.emissiveMap != null
        ? new THREE.Color(0, 0, 0)
        : (mat.emissive ?? new THREE.Color(0, 0, 0));
    const emissiveIntensity = mat.emissiveIntensity ?? 1;
    data[o + 0] = color.r;
    data[o + 1] = color.g;
    data[o + 2] = color.b;
    data[o + 3] = mat.roughness ?? 1;
    data[o + 4] = emissive.r * emissiveIntensity;
    data[o + 5] = emissive.g * emissiveIntensity;
    data[o + 6] = emissive.b * emissiveIntensity;
    data[o + 7] = mat.metalness ?? 0;
  });
  const tex = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
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
  let dynVertexOffset = 0;
  const tmpGeoms = []; // to dispose after merge

  scene.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry || !obj.visible || obj.userData.rtExclude) return;
    const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
    let mi = materials.indexOf(mat);
    if (mi < 0) { mi = materials.length; materials.push(mat); }

    const extracted = extractMeshGeometry(obj, mi);
    tmpGeoms.push(extracted.geo);
    if (dynamicSet && dynamicSet.has(obj)) {
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

  compiled.materialsTex = buildMaterialsTexture(materials);
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
