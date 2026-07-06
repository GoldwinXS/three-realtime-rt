import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  MeshBVH,
  MeshBVHUniformStruct,
  FloatVertexAttributeTexture,
  SAH,
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
  }

  dispose() {
    this.bvhUniform.dispose();
    this.normalAttrTex.dispose();
    this.matIndexAttrTex.dispose();
    if (this.materialsTex) this.materialsTex.dispose();
  }
}

function extractMeshGeometry(mesh, materialIndex) {
  // Normalize to non-indexed position+normal so all pieces merge cleanly.
  const src = mesh.geometry.index
    ? mesh.geometry.toNonIndexed()
    : mesh.geometry.clone();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", src.getAttribute("position").clone());
  if (!src.getAttribute("normal")) src.computeVertexNormals();
  geo.setAttribute("normal", src.getAttribute("normal").clone());

  // Bake world transform (positions and normals).
  geo.applyMatrix4(mesh.matrixWorld);

  const count = geo.getAttribute("position").count;
  const mi = new Float32Array(count).fill(materialIndex);
  geo.setAttribute("materialIndex", new THREE.BufferAttribute(mi, 1));
  return geo;
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
    const emissive = mat.emissive ?? new THREE.Color(0, 0, 0);
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

export function compileScene(scene) {
  scene.updateMatrixWorld(true);

  const compiled = new CompiledScene();
  const geometries = [];
  const materials = compiled.materials;

  scene.traverse((obj) => {
    if (obj.isMesh && obj.geometry && obj.visible) {
      const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
      let mi = materials.indexOf(mat);
      if (mi < 0) {
        mi = materials.length;
        materials.push(mat);
      }
      geometries.push(extractMeshGeometry(obj, mi));
    }

    if (obj.isLight && compiled.lightCount < MAX_LIGHTS) {
      if (obj.isPointLight) {
        const p = obj.getWorldPosition(new THREE.Vector3());
        compiled.lightPosType.push(p.x, p.y, p.z, 0);
        compiled.lightColorRadius.push(
          obj.color.r * obj.intensity,
          obj.color.g * obj.intensity,
          obj.color.b * obj.intensity,
          obj.userData.rtRadius ?? 0.15
        );
        compiled.lightCount++;
      } else if (obj.isDirectionalLight) {
        const p = obj.getWorldPosition(new THREE.Vector3());
        const t = obj.target.getWorldPosition(new THREE.Vector3());
        const dir = t.sub(p).normalize(); // direction light travels
        compiled.lightPosType.push(dir.x, dir.y, dir.z, 1);
        compiled.lightColorRadius.push(
          obj.color.r * obj.intensity,
          obj.color.g * obj.intensity,
          obj.color.b * obj.intensity,
          obj.userData.rtRadius ?? 0.02 // angular radius (radians-ish)
        );
        compiled.lightCount++;
      }
    }
  });

  if (geometries.length === 0) {
    throw new Error("three-realtime-rt: no meshes found in scene");
  }

  const merged = mergeGeometries(geometries, false);
  compiled.triangleCount = merged.getAttribute("position").count / 3;

  compiled.bvh = new MeshBVH(merged, { strategy: SAH });
  compiled.bvhUniform.updateFrom(compiled.bvh);
  compiled.normalAttrTex.updateFrom(merged.getAttribute("normal"));
  compiled.matIndexAttrTex.updateFrom(merged.getAttribute("materialIndex"));
  compiled.materialsTex = buildMaterialsTexture(materials);

  // Pad light arrays to MAX_LIGHTS so uniform arrays are fully defined.
  while (compiled.lightPosType.length < MAX_LIGHTS * 4) {
    compiled.lightPosType.push(0, 0, 0, 0);
    compiled.lightColorRadius.push(0, 0, 0, 0);
  }

  geometries.forEach((g) => g.dispose());
  return compiled;
}

export { MAX_LIGHTS };
