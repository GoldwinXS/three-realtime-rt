import assert from "node:assert/strict";
import * as THREE from "three";
import { compileScene } from "../src/SceneCompiler.js";

const near = (actual, expected, eps = 1e-5) => {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${actual} to be within ${eps} of ${expected}`
  );
};

function normalizedInterleavedTriangle() {
  const geometry = new THREE.BufferGeometry();
  const positions = new THREE.InterleavedBuffer(new Int16Array([
    0, 0, 0, 1234,
    32767, 0, 0, 1234,
    0, 32767, 0, 1234,
  ]), 4);
  const normals = new THREE.InterleavedBuffer(new Int8Array([
    0, 0, 127, 12,
    0, 0, 127, 12,
    0, 0, 127, 12,
  ]), 4);
  geometry.setAttribute(
    "position",
    new THREE.InterleavedBufferAttribute(positions, 3, 0, true)
  );
  geometry.setAttribute(
    "normal",
    new THREE.InterleavedBufferAttribute(normals, 3, 0, true)
  );
  return { geometry, positions, normals };
}

// Static extraction must respect interleaved stride and integer normalization.
{
  const { geometry } = normalizedInterleavedTriangle();
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial()));
  const compiled = compileScene(scene);
  const out = compiled.staticBvh.geometry.getAttribute("position").array;
  assert.deepEqual(Array.from(out), [0, 0, 0, 1, 0, 0, 0, 1, 0]);
  compiled.dispose();
}

// The live CPU-deformation path must use the same accessor semantics in motion.
{
  const { geometry, positions, normals } = normalizedInterleavedTriangle();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  mesh.userData.rtDeforming = true;
  const scene = new THREE.Scene();
  scene.add(mesh);
  const compiled = compileScene(scene, { dynamicMeshes: [mesh] });

  positions.array[4] = 16384;
  positions.array[9] = 16384;
  positions.needsUpdate = true;
  for (let i = 0; i < 3; i++) {
    const o = i * 4;
    normals.array[o] = 0;
    normals.array[o + 1] = 127;
    normals.array[o + 2] = 0;
  }
  normals.needsUpdate = true;
  compiled.updateDynamic();

  const out = compiled.dynamicMerged.getAttribute("position").array;
  near(out[3], 16384 / 32767);
  near(out[7], 16384 / 32767);
  for (let i = 0; i < 3; i++) {
    const o = i * 4;
    near(compiled.dynamicPacked[o], 0);
    near(compiled.dynamicPacked[o + 1], 1);
    near(compiled.dynamicPacked[o + 2], 0);
  }
  compiled.dispose();
}

// Missing normals are computed while vertices are still indexed, preserving
// the smooth shared-vertex normal seen by Three.js's raster path.
{
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([
    0, 0, 0,
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ], 3));
  geometry.setIndex([0, 1, 2, 0, 3, 1]);
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial()));
  const compiled = compileScene(scene);
  const normal = compiled.staticBvh.geometry.getAttribute("normal");
  near(normal.getX(0), 0);
  near(normal.getY(0), Math.SQRT1_2);
  near(normal.getZ(0), Math.SQRT1_2);
  compiled.dispose();
}

// Each source's incomplete GL_TRIANGLES tail is discarded independently; two
// adjacent tails must never combine into a phantom cross-mesh triangle.
{
  const makeMesh = (vertices, x) => {
    const geometry = new THREE.BufferGeometry();
    const values = [];
    for (let i = 0; i < vertices; i++) values.push(x + (i === 1 ? 1 : 0), i === 2 ? 1 : 0, 0);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(values, 3));
    return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  };
  const scene = new THREE.Scene();
  scene.add(makeMesh(4, 0), makeMesh(3, 3));
  const compiled = compileScene(scene);
  assert.equal(compiled.triangleCount, 2);
  assert.equal(compiled.staticBvh.geometry.getAttribute("position").count, 6);
  compiled.dispose();
}

console.log("OK — scene-geometry compiler checks passed");
