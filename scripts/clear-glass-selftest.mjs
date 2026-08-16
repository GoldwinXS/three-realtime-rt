import assert from "node:assert/strict";
import * as THREE from "three";
import { compileScene } from "../src/SceneCompiler.js";
import { GBufferPass } from "../src/GBufferPass.js";

function clearMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    ior: 1,
    transparent: false,
  });
  material.userData.rtClearGlass = true;
  return material;
}

function sceneWith(meshes) {
  const scene = new THREE.Scene();
  for (const mesh of meshes) scene.add(mesh);
  return scene;
}

const pane = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.02), clearMaterial());
const compiled = compileScene(sceneWith([pane]));
assert.equal(compiled.clearGlassMeshCount, 1);
assert.equal(compiled.triangleCount, 0);
assert.equal(compiled.hasTransmission, false);
compiled.dispose();

const ordinary = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x808080 })
);
const mixed = sceneWith([ordinary, new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.02), clearMaterial())]);
const mixedCompiled = compileScene(mixed);
assert.equal(mixedCompiled.clearGlassMeshCount, 1);
assert.equal(mixedCompiled.triangleCount, 12);
assert.equal(mixedCompiled.hasTransmission, false);
mixedCompiled.dispose();

const glass = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshPhysicalMaterial({ transmission: 0.8, ior: 1.5, transparent: false })
);
const glassCompiled = compileScene(sceneWith([glass]));
assert.equal(glassCompiled.hasTransmission, true);
glassCompiled.dispose();

const excludedGlass = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshPhysicalMaterial({ transmission: 1, ior: 1.5, transparent: false })
);
excludedGlass.userData.rtExclude = true;
const excludedScene = sceneWith([
  new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()),
  excludedGlass,
]);
const excludedCompiled = compileScene(excludedScene);
assert.equal(excludedCompiled.hasTransmission, true);
excludedCompiled.dispose();

const invalid = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 0.02),
  new THREE.MeshPhysicalMaterial({ transmission: 1, ior: 1.5 })
);
invalid.material.userData.rtClearGlass = true;
assert.throws(() => compileScene(sceneWith([invalid])), /rtClearGlass/);

const nonFinite = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 0.02),
  clearMaterial()
);
nonFinite.material.ior = Number.NaN;
assert.throws(() => compileScene(sceneWith([nonFinite])), /rtClearGlass/);

const invalidExcluded = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 0.02),
  clearMaterial()
);
invalidExcluded.material.ior = 1.5;
invalidExcluded.userData.rtExclude = true;
assert.throws(
  () => compileScene(sceneWith([
    new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial()),
    invalidExcluded,
  ])),
  /rtClearGlass/
);

const clear = clearMaterial();
const grouped = new THREE.BoxGeometry(1, 1, 1);
grouped.clearGroups();
grouped.addGroup(0, 18, 0);
grouped.addGroup(18, 18, 1);
const mixedMaterialMesh = new THREE.Mesh(grouped, [
  clear,
  new THREE.MeshStandardMaterial(),
]);
assert.throws(
  () => compileScene(sceneWith([mixedMaterialMesh])),
  /cannot mix userData\.rtClearGlass/
);

const dynamicPane = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 0.02),
  clearMaterial()
);
assert.throws(
  () => compileScene(sceneWith([dynamicPane]), { dynamicMeshes: [dynamicPane] }),
  /must not be listed in dynamicMeshes/
);

const callbackPane = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 0.02),
  clearMaterial()
);
callbackPane.onBeforeRender = () => {};
assert.throws(
  () => compileScene(sceneWith([callbackPane])),
  /cannot use onBeforeRender\/onAfterRender callbacks/
);

// G-buffer omission must be exception-safe: a renderer failure cannot leak the
// temporary layer mask, material swap, background change, or hidden overlay.
{
  const pass = new GBufferPass(4, 4, { mixedPrecision: false });
  const clearPane = new THREE.Mesh(new THREE.BoxGeometry(), clearMaterial());
  clearPane.layers.set(3);
  const clearMask = clearPane.layers.mask;
  const ordinaryMaterial = new THREE.MeshStandardMaterial();
  const ordinaryMesh = new THREE.Mesh(new THREE.BoxGeometry(), ordinaryMaterial);
  const groupedGeometry = new THREE.BoxGeometry();
  groupedGeometry.clearGroups();
  groupedGeometry.addGroup(0, 18, 0);
  groupedGeometry.addGroup(18, 18, 1);
  const multiMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xff0000 }),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
  ];
  const multiMesh = new THREE.Mesh(groupedGeometry, multiMaterials);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial());
  const scene = sceneWith([clearPane, ordinaryMesh, multiMesh, sprite]);
  const background = new THREE.Color(0x123456);
  scene.background = background;
  let releasedTarget = false;
  const renderer = {
    setRenderTarget(target) { if (target === null) releasedTarget = true; },
    setClearColor() {},
    clear() {},
    render() {
      assert.equal(clearPane.layers.mask, 0);
      assert.notEqual(ordinaryMesh.material, ordinaryMaterial);
      assert.notEqual(multiMesh.material, multiMaterials);
      assert.equal(sprite.visible, false);
      throw new Error("sentinel render failure");
    },
  };
  assert.throws(
    () => pass.render(renderer, scene, new THREE.PerspectiveCamera()),
    /sentinel render failure/
  );
  assert.equal(clearPane.layers.mask, clearMask);
  assert.equal(ordinaryMesh.material, ordinaryMaterial);
  assert.equal(multiMesh.material, multiMaterials);
  assert.equal(sprite.visible, true);
  assert.equal(scene.background, background);
  assert.equal(releasedTarget, true);
  pass.dispose();
}

// Mesh-shared G-buffer state must be copied into independent multi-material
// uniforms, and direct matrixWorld element mutation must be observed on the
// next material lookup (no matrixWorld.needsUpdate notification is required).
{
  const pass = new GBufferPass(2, 2, { mixedPrecision: false });
  const geometry = new THREE.BoxGeometry();
  geometry.clearGroups();
  geometry.addGroup(0, 18, 0);
  geometry.addGroup(18, 18, 1);
  const mesh = new THREE.Mesh(geometry, [
    new THREE.MeshStandardMaterial(),
    new THREE.MeshStandardMaterial(),
  ]);
  const materials = pass._gbufferMaterialFor(mesh);
  assert.equal(materials.length, 2);
  assert.notEqual(
    materials[0].uniforms.uNormalMatrixWorld.value,
    materials[1].uniforms.uNormalMatrixWorld.value
  );
  const before = materials[0].uniforms.uNormalMatrixWorld.value.elements.slice();
  mesh.matrixWorld.elements[0] *= 2;
  const after = pass._gbufferMaterialFor(mesh)[0].uniforms.uNormalMatrixWorld.value.elements;
  assert.notDeepEqual(after, before);
  pass.dispose();
}

// Proxy materials must preserve live material visibility, sparse material
// arrays, and geometry color attributes added/removed after the cache is warm.
{
  const pass = new GBufferPass(2, 2, { mixedPrecision: false });
  const geometry = new THREE.BoxGeometry();
  const source = new THREE.MeshStandardMaterial();
  source.visible = false;
  const mesh = new THREE.Mesh(geometry, source);
  const proxy = pass._gbufferMaterialFor(mesh);
  assert.equal(proxy.visible, false);
  assert.equal(proxy.vertexColors, false);

  source.visible = true;
  const color = new THREE.BufferAttribute(
    new Float32Array(geometry.getAttribute("position").count * 3).fill(1),
    3
  );
  geometry.setAttribute("color", color);
  const versionBeforeColor = proxy.version;
  assert.equal(pass._gbufferMaterialFor(mesh), proxy);
  assert.equal(proxy.visible, true);
  assert.equal(proxy.vertexColors, true);
  assert.ok(proxy.version > versionBeforeColor);

  geometry.deleteAttribute("color");
  pass._gbufferMaterialFor(mesh);
  assert.equal(proxy.vertexColors, false);

  const hidden = new THREE.MeshStandardMaterial();
  hidden.visible = false;
  mesh.material = [source, undefined, hidden];
  const groupProxies = pass._gbufferMaterialFor(mesh);
  assert.equal(groupProxies.length, 3);
  assert.equal(groupProxies[1], undefined);
  assert.equal(groupProxies[2].visible, false);
  mesh.material[1] = new THREE.MeshStandardMaterial();
  assert.ok(pass._gbufferMaterialFor(mesh)[1].isShaderMaterial);

  const emissiveSource = new THREE.MeshStandardMaterial({
    color: 0x224466,
    emissive: 0xff0000,
    emissiveIntensity: 2,
  });
  const replacementMesh = new THREE.Mesh(new THREE.BoxGeometry(), emissiveSource);
  const replacementProxy = pass._gbufferMaterialFor(replacementMesh);
  assert.ok(replacementProxy.uniforms.uEmissive.value.r > 1);
  replacementMesh.material = new THREE.MeshNormalMaterial();
  assert.equal(pass._gbufferMaterialFor(replacementMesh), replacementProxy);
  assert.deepEqual(replacementProxy.uniforms.uColor.value.toArray(), [1, 1, 1]);
  assert.deepEqual(replacementProxy.uniforms.uEmissive.value.toArray(), [0, 0, 0]);
  pass.dispose();
}

console.log("OK — clear-glass compiler checks passed");
