import * as THREE from "three";
import { GBufferPass } from "../src/GBufferPass.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function makeGeometry(withColors = false) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([
    0, 0, 0, 1, 0, 0, 0, 1, 0,
  ], 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute([
    0, 0, 1, 0, 0, 1, 0, 0, 1,
  ], 3));
  if (withColors) geometry.setAttribute("color", new THREE.Float32BufferAttribute([
    1, 0, 0, 0, 1, 0, 0, 0, 1,
  ], 3));
  return geometry;
}

function makeRenderer({ throwOnRender = false, seen = [] } = {}) {
  return {
    setRenderTarget() {},
    setClearColor() {},
    clear() {},
    render(scene, camera) {
      if (throwOnRender) throw new Error("intentional renderer failure");
      scene.traverse((object) => {
        if (!object.isMesh || !object.material) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (let i = 0; i < materials.length; i++) {
          const material = materials[i];
          if (!material || material.visible === false) continue;
          const group = { materialIndex: i };
          object.onBeforeRender(this, scene, camera, object.geometry, material, group);
          material.onBeforeRender?.(this, scene, camera, object.geometry, object, group);
          seen.push({ object, material });
          object.onAfterRender(this, scene, camera, object.geometry, material, group);
        }
      });
    },
  };
}

const pass = new GBufferPass(2, 2, { materialPooling: true });
const geometry = makeGeometry(false);
geometry.addGroup(0, 3, 0);
geometry.addGroup(0, 3, 1);
geometry.addGroup(0, 3, 2);
const red = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.BackSide });
const hidden = new THREE.MeshStandardMaterial({ color: 0x00ff00, visible: false });
const mesh = new THREE.Mesh(geometry, [red, null, hidden]);
const originals = mesh.material;

const slots = pass._sharedMaterialFor(mesh);
assert(Array.isArray(slots), "multi-material replacement must remain an array");
assert(slots[1] === null, "null material holes must remain null");
assert(slots[2].visible === false, "invisible source slots must use an invisible proxy");
assert(slots[0].vertexColors === false, "no-color geometry must use the no-color pool");
assert(slots[0].side === THREE.BackSide, "pool must preserve source side");

mesh.updateMatrixWorld(true);
slots[0].onBeforeRender({}, new THREE.Scene(), new THREE.PerspectiveCamera(), geometry, mesh, { materialIndex: 0 });
assert(slots[0].uniforms.uColor.value.equals(red.color), "source color must sync");
const normalBefore = slots[0].uniforms.uNormalMatrixWorld.value.clone();
red.color.set(0x112233);
mesh.scale.set(2, 1, 1);
mesh.updateMatrixWorld(true);
slots[0].onBeforeRender({}, new THREE.Scene(), new THREE.PerspectiveCamera(), geometry, mesh, { materialIndex: 0 });
assert(slots[0].uniforms.uColor.value.equals(red.color), "live source color must sync");
assert(!slots[0].uniforms.uNormalMatrixWorld.value.equals(normalBefore), "live matrix change must sync");

// The source may change side during Object3D.onBeforeRender. The selected pool
// entry keeps its culling side immutable for the render-list item.
const fixedSideMaterial = slots[0];
red.side = THREE.DoubleSide;
fixedSideMaterial.onBeforeRender({}, new THREE.Scene(), new THREE.PerspectiveCamera(), geometry, mesh, { materialIndex: 0 });
assert(fixedSideMaterial.side === THREE.BackSide, "pool side must remain immutable during callbacks");
const changedSlots = pass._sharedMaterialFor(mesh);
assert(changedSlots[0] !== fixedSideMaterial, "side changes must select a new pool entry");
assert(changedSlots[0].side === THREE.DoubleSide, "new pool entry must use the changed side");

const colored = new THREE.Mesh(makeGeometry(true), new THREE.MeshStandardMaterial());
const coloredProxy = pass._sharedMaterialFor(colored);
assert(coloredProxy.vertexColors === true, "color geometry must use the color pool");

let callbackCount = 0;
const custom = new THREE.Mesh(makeGeometry(), new THREE.MeshStandardMaterial({ color: 0xabcdef }));
custom.onBeforeRender = () => { callbackCount++; };
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x123456);
scene.add(mesh, custom, colored);
const sprite = new THREE.Sprite();
scene.add(sprite);
const originalBackground = scene.background;
const seen = [];
pass.render(makeRenderer({ seen }), scene, new THREE.PerspectiveCamera());
assert(callbackCount > 0, "custom Object3D callback must still run");
assert(mesh.material === originals, "render must restore the original material array");
const customDraw = seen.find((entry) => entry.object === custom);
assert(customDraw, "custom callback mesh must reach the renderer");
assert(
  customDraw.material === pass._materialCache.get(custom) &&
    ![...pass._sharedMaterialPool.values()].includes(customDraw.material),
  "custom callback mesh must use its legacy per-mesh proxy"
);
assert(sprite.visible === true, "non-mesh visibility must be restored");
assert(scene.background === originalBackground, "scene background must be restored");
assert(seen.some((entry) => entry.object === mesh), "pooled mesh must render");

// Exception restoration must cover materials, visibility, layers and background.
const clearGlass = new THREE.Mesh(makeGeometry(), new THREE.MeshStandardMaterial());
clearGlass.material.userData.rtClearGlass = true;
scene.add(clearGlass);
const clearLayers = clearGlass.layers.mask;
let threw = false;
try {
  pass.render(makeRenderer({ throwOnRender: true }), scene, new THREE.PerspectiveCamera());
} catch (error) {
  threw = error.message === "intentional renderer failure";
}
assert(threw, "renderer exception must propagate");
assert(mesh.material === originals, "exception must restore pooled material arrays");
assert(clearGlass.layers.mask === clearLayers, "exception must restore clear-glass layers");
assert(sprite.visible === true, "exception must restore hidden object visibility");
assert(scene.background === originalBackground, "exception must restore background");

const noPool = new GBufferPass(2, 2, { materialPooling: false });
assert(noPool._materialPooling === false, "materialPooling=false must disable the pool");
const noPoolScene = new THREE.Scene();
const noPoolMesh = new THREE.Mesh(makeGeometry(), new THREE.MeshStandardMaterial());
noPoolScene.add(noPoolMesh);
noPool.render(makeRenderer(), noPoolScene, new THREE.PerspectiveCamera());
assert(noPool._sharedMaterialPool.size === 0, "disabled pooling must not allocate shared materials");
noPool.dispose();
noPoolMesh.geometry.dispose();
noPoolMesh.material.dispose();

pass.dispose();
for (const material of [red, hidden, colored.material, custom.material, clearGlass.material]) material.dispose();
for (const object of [mesh, colored, custom, clearGlass]) object.geometry.dispose();
console.log("gbuffer material pooling self-test: passed");
