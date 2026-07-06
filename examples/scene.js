import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import helmetUrl from "./assets/DamagedHelmet.glb?url";
import duckUrl from "./assets/Duck.glb?url";

import { createWaterfall } from "./waterfall.js";

// Mottled-green grass texture so the ground reads as natural under sky light.
function makeGrassTexture() {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = s; cv.height = s;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#4a6b2e";
  ctx.fillRect(0, 0, s, s);
  const greens = ["#3d5c26", "#557a34", "#456b2b", "#61833c", "#3a5322"];
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = greens[(Math.random() * greens.length) | 0];
    const x = Math.random() * s, y = Math.random() * s;
    const w = 1 + Math.random() * 2, h = 2 + Math.random() * 4;
    ctx.fillRect(x, y, w, h);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  tex.anisotropy = 4;
  return tex;
}

const ROCK_MAT = new THREE.MeshStandardMaterial({ color: 0x8a8378, roughness: 0.95 });

// Low-poly angular boulder.
function makeRock(x, z, scale, ground = 0) {
  const geo = new THREE.DodecahedronGeometry(scale, 0);
  // jitter the vertices a touch so no two rocks are identical
  const p = geo.getAttribute("position");
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(
      i,
      p.getX(i) * (0.8 + Math.random() * 0.4),
      p.getY(i) * (0.7 + Math.random() * 0.5),
      p.getZ(i) * (0.8 + Math.random() * 0.4)
    );
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, ROCK_MAT);
  m.position.set(x, ground + scale * 0.45, z);
  m.rotation.set(Math.random(), Math.random() * 6.28, Math.random());
  return m;
}

// Stylized low-poly tree: tapered trunk + a couple of foliage blobs.
function makeTree(x, z, h = 3.2) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.24, h, 6),
    new THREE.MeshStandardMaterial({ color: 0x5b432a, roughness: 0.9 })
  );
  trunk.position.y = h / 2;
  g.add(trunk);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7d2f, roughness: 0.85 });
  const blobs = [
    [0, h + 0.1, 0, 1.25],
    [0.5, h - 0.4, 0.2, 0.95],
    [-0.4, h - 0.2, -0.3, 0.85],
  ];
  for (const [bx, by, bz, r] of blobs) {
    const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), leafMat);
    leaf.position.set(bx, by, bz);
    g.add(leaf);
  }
  g.position.set(x, 0, z);
  return g;
}

/**
 * Outdoor natural scene: grassy ground under a procedural sky, a warm sun, a
 * waterfall spilling off a rock shelf into a pond, scattered boulders and
 * low-poly trees, plus a few glTF "found objects" (a duck by the water, a
 * lantern, a weathered helmet on a rock). Natural light here is almost entirely
 * sky ambient + a single sun — exactly what ray traced GI + soft shadows sell.
 */
export function buildScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    58,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(9, 5.5, 13);

  // Sky + sun. sunDir points TOWARD the sun; the DirectionalLight travels the
  // other way so its shadows line up with the visible sun.
  const sunDir = new THREE.Vector3(0.55, 0.62, 0.55).normalize();
  const sky = {
    enabled: true,
    sunDir,
    sunColor: new THREE.Color(1.0, 0.92, 0.78),
    zenith: new THREE.Color(0.20, 0.40, 0.72),
    horizon: new THREE.Color(0.78, 0.85, 0.92),
    intensity: 1.0,
  };

  const bounds = { x: 9, z: 9, wallH: 0.5, floorY: 0 };

  // Ground.
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(80, 0.4, 80),
    new THREE.MeshStandardMaterial({ map: makeGrassTexture(), roughness: 0.98 })
  );
  ground.position.y = -0.2;
  scene.add(ground);

  // Waterfall / pond / cliff (back-left).
  const waterfall = createWaterfall(scene, { x: -6.5, z: -6.0, floorY: 0 });

  // Scattered boulders.
  const rockSpots = [
    [4.6, -5.5, 1.1], [6.2, -3.0, 0.8], [-8.0, -1.0, 1.3],
    [7.5, 2.5, 0.9], [-2.5, -7.2, 0.7], [2.0, -7.6, 0.6],
  ];
  for (const [x, z, s] of rockSpots) scene.add(makeRock(x, z, s));
  const helmetRock = makeRock(5.6, 4.0, 1.2);
  scene.add(helmetRock);

  // Trees around the edges for a framed, natural skyline.
  const treeSpots = [
    [-9, -8, 3.6], [-11, -2, 4.2], [10, -7, 3.9],
    [12, 1, 3.4], [-10, 5, 3.7], [9.5, 6.5, 3.2], [-3, -9.5, 3.0],
  ];
  for (const [x, z, h] of treeSpots) scene.add(makeTree(x, z, h));

  // Sun light (matches the sky's sun).
  const sun = new THREE.DirectionalLight(0xfff1d8, 3.0);
  sun.position.copy(sunDir).multiplyScalar(30);
  sun.target.position.set(0, 0, 0);
  sun.userData.rtRadius = 0.035; // crisp-ish natural sun shadows
  scene.add(sun);
  scene.add(sun.target);

  // A soft warm bounce/fill (like light kicking off the ground), off by default.
  const fill = new THREE.PointLight(0xffdca8, 0.0);
  fill.position.set(-4, 3, 6);
  fill.userData.rtRadius = 0.6;
  scene.add(fill);

  const lights = { sun, fill };

  const ready = (async () => {
    const loader = new GLTFLoader();
    const load = (url) =>
      new Promise((res, rej) => loader.load(url, res, undefined, rej));
    const [helmet, duck] = await Promise.all([load(helmetUrl), load(duckUrl)]);

    // Weathered helmet resting on a boulder.
    helmet.scene.scale.setScalar(1.2);
    helmet.scene.position.set(5.6, 1.5, 4.0);
    helmet.scene.rotation.y = -0.6;
    scene.add(helmet.scene);

    // Rubber duck by the pond.
    duck.scene.scale.setScalar(0.9);
    duck.scene.position.set(-4.4, 0.0, -3.4);
    duck.scene.rotation.y = 2.2;
    scene.add(duck.scene);
  })();

  return { scene, camera, bounds, lights, sky, waterfall, ready };
}
