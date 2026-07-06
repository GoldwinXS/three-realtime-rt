import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  MeshBVH,
  MeshBVHUniformStruct,
  FloatVertexAttributeTexture,
  SAH,
  CENTER,
} from "three-mesh-bvh";

const MAX_LIGHTS = 16; // stage-1 cap; stage 4 moves lights into a data texture

/**
 * Walks a three.js scene graph and compiles everything the RT shader needs:
 *  - one merged, world-space BufferGeometry with a MeshBVH (uploaded as textures)
 *  - a per-vertex materialIndex attribute + a material table texture
 *    (albedo/roughness/emissive/metalness per material, for shading GI hit points)
 *  - a flat light list (PointLight, DirectionalLight)
 *
 * Stage 1: static scenes — transforms are baked at compile time.
 * Stage 5 replaces this with a TLAS/BLAS setup for dynamic scenes.
 */
export class CompiledScene {
  constructor() {
    this.bvh = null;
    this.bvhUniform = new MeshBVHUniformStruct();
    this.normalAttrTex = new FloatVertexAttributeTexture();
    this.matIndexAttrTex = new FloatVertexAttributeTexture();
    this.materialsTex = null;
    this.materials = [];
    this.lightPosType = []; // vec4: xyz = position (point) or direction (dir), w = type (0 point, 1 dir)
    this.lightColorRadius = []; // vec4: rgb = color * intensity, w = radius (softness)
    this.lightCount = 0;
    this.triangleCount = 0;
    // Dynamic (physics) support: the merged geometry is kept so moving meshes
    // can be re-baked into it each frame and the BVH refit (a lightweight slice
    // of the stage-5 TLAS/BLAS work — enough for correct shadows on rigid motion).
    this.merged = null;
    this.dynamic = []; // [{ mesh, start, count, localPos, localNorm }]
    this._m3 = new THREE.Matrix3();
  }

  /**
   * Re-bake every dynamic mesh's current world transform into the merged
   * geometry, refit the BVH, and re-upload the changed textures. Call once per
   * frame after moving the meshes (e.g. after a physics step), before render().
   */
  updateDynamic(uploadNormals = true) {
    if (this.dynamic.length === 0) return;
    const posAttr = this.merged.getAttribute("position");
    const normAttr = this.merged.getAttribute("normal");
    const pos = posAttr.array;
    const nrm = normAttr.array;

    for (const seg of this.dynamic) {
      seg.mesh.updateWorldMatrix(true, false);
      const m = seg.mesh.matrixWorld.elements;
      const nm = this._m3.getNormalMatrix(seg.mesh.matrixWorld).elements;
      const lp = seg.localPos;
      const ln = seg.localNorm;
      let o = seg.start * 3;
      for (let i = 0; i < seg.count; i++) {
        const x = lp[i * 3], y = lp[i * 3 + 1], z = lp[i * 3 + 2];
        pos[o] = m[0] * x + m[4] * y + m[8] * z + m[12];
        pos[o + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
        pos[o + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
        const nx = ln[i * 3], ny = ln[i * 3 + 1], nz = ln[i * 3 + 2];
        let tx = nm[0] * nx + nm[3] * ny + nm[6] * nz;
        let ty = nm[1] * nx + nm[4] * ny + nm[7] * nz;
        let tz = nm[2] * nx + nm[5] * ny + nm[8] * nz;
        const il = 1.0 / (Math.hypot(tx, ty, tz) || 1);
        nrm[o] = tx * il;
        nrm[o + 1] = ty * il;
        nrm[o + 2] = tz * il;
        o += 3;
      }
    }
    posAttr.needsUpdate = true;
    normAttr.needsUpdate = true;
    this.bvh.refit();
    this.bvhUniform.updateFrom(this.bvh);
    // The normal texture only feeds GI-bounce shading off moving surfaces —
    // a few frames of staleness there is invisible, so amortize the upload.
    if (uploadNormals) this.normalAttrTex.updateFrom(normAttr);
  }

  dispose() {
    this.bvhUniform.dispose();
    this.normalAttrTex.dispose();
    this.matIndexAttrTex.dispose();
    if (this.materialsTex) this.materialsTex.dispose();
    if (this.merged) this.merged.dispose();
  }
}

function extractMeshGeometry(mesh, materialIndex) {
  // Normalize to non-indexed position+normal so all pieces merge cleanly.
  const src = mesh.geometry.index
    ? mesh.geometry.toNonIndexed()
    : mesh.geometry.clone();

  if (!src.getAttribute("normal")) src.computeVertexNormals();
  // Local-space copies (kept for dynamic meshes so they can be re-baked/frame).
  const localPos = src.getAttribute("position").array.slice();
  const localNorm = src.getAttribute("normal").array.slice();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", src.getAttribute("position").clone());
  geo.setAttribute("normal", src.getAttribute("normal").clone());

  // Bake world transform (positions and normals).
  geo.applyMatrix4(mesh.matrixWorld);

  const count = geo.getAttribute("position").count;
  const mi = new Float32Array(count).fill(materialIndex);
  geo.setAttribute("materialIndex", new THREE.BufferAttribute(mi, 1));
  return { geo, localPos, localNorm, count };
}

function buildMaterialsTexture(materials) {
  // 2 RGBA32F texels per material:
  //   texel 0: albedo.rgb, roughness
  //   texel 1: emissive.rgb (scaled by emissiveIntensity), metalness
  const width = Math.max(materials.length * 2, 2);
  const data = new Float32Array(width * 4);
  materials.forEach((mat, i) => {
    const o = i * 8;
    const color = mat.color ?? new THREE.Color(1, 1, 1);
    // If emission is masked by an emissiveMap we can't evaluate it at GI hit
    // points (no textures in the hit shader yet — stage 6); treating the whole
    // surface as emissive would flood the scene with light, so drop it instead.
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
  const tex = new THREE.DataTexture(
    data,
    width,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

export function compileScene(scene, options = {}) {
  scene.updateMatrixWorld(true);

  const dynamicSet = options.dynamicMeshes
    ? new Set(options.dynamicMeshes)
    : null;

  const compiled = new CompiledScene();
  const geometries = [];
  const materials = compiled.materials;
  let vertexOffset = 0; // running start (in vertices) into the merged buffer

  scene.traverse((obj) => {
    // `rtExclude` meshes (e.g. translucent water) still rasterize into the
    // G-buffer and get lit, but stay out of the BVH so they don't cast hard
    // shadows or block GI like a solid occluder would.
    if (obj.isMesh && obj.geometry && obj.visible && !obj.userData.rtExclude) {
      const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
      let mi = materials.indexOf(mat);
      if (mi < 0) {
        mi = materials.length;
        materials.push(mat);
      }
      const extracted = extractMeshGeometry(obj, mi);
      geometries.push(extracted.geo);
      if (dynamicSet && dynamicSet.has(obj)) {
        compiled.dynamic.push({
          mesh: obj,
          start: vertexOffset,
          count: extracted.count,
          localPos: extracted.localPos,
          localNorm: extracted.localNorm,
        });
      }
      vertexOffset += extracted.count;
    }
  });

  if (geometries.length === 0) {
    throw new Error("three-realtime-rt: no meshes found in scene");
  }

  syncLights(scene, compiled);

  const merged = mergeGeometries(geometries, false);
  compiled.merged = merged;
  compiled.triangleCount = merged.getAttribute("position").count / 3;

  // Dynamic meshes move, so their triangles can't sit in a spatially-tight SAH
  // leaf forever; CENTER builds a cheaper tree that refits without degrading.
  const strategy = compiled.dynamic.length > 0 ? CENTER : SAH;
  compiled.bvh = new MeshBVH(merged, { strategy });
  compiled.bvhUniform.updateFrom(compiled.bvh);
  compiled.normalAttrTex.updateFrom(merged.getAttribute("normal"));
  compiled.matIndexAttrTex.updateFrom(merged.getAttribute("materialIndex"));
  compiled.materialsTex = buildMaterialsTexture(materials);

  geometries.forEach((g) => g.dispose());
  return compiled;
}

/**
 * (Re)scan the scene's lights into the compiled light tables. Safe to call
 * every frame — no allocation of GPU resources — so lights can be toggled
 * (intensity 0 / invisible → dropped), moved, and recolored at runtime.
 */
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
      const dir = tmpT.sub(tmpP).normalize(); // direction light travels
      posType.push(dir.x, dir.y, dir.z, 1);
      colorRadius.push(
        obj.color.r * obj.intensity,
        obj.color.g * obj.intensity,
        obj.color.b * obj.intensity,
        obj.userData.rtRadius ?? 0.02 // angular radius (radians-ish)
      );
      count++;
    }
  });

  compiled.lightCount = count;
  // Pad to MAX_LIGHTS so the uniform arrays are always fully defined.
  while (posType.length < MAX_LIGHTS * 4) {
    posType.push(0, 0, 0, 0);
    colorRadius.push(0, 0, 0, 0);
  }
}

export { MAX_LIGHTS };
