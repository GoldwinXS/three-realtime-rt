import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";

// Import glTF assets through Vite so they get hashed + copied into the static
// build (works both in `npm run dev` and on GitHub Pages under a sub-path).
import helmetUrl from "./assets/DamagedHelmet.glb?url";
import duckUrl from "./assets/Duck.glb?url";
import lanternUrl from "./assets/Lantern.glb?url";

/**
 * Builds the showcase environment: a Cornell-ish coloured room (great for
 * showing GI colour bleed), a few static hero pieces, an emissive panel, and a
 * set of toggleable lights. Deliberately kept lean (~mid-tens-of-thousands of
 * triangles) so the per-frame dynamic BVH refit stays cheap.
 */
export function buildScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070c);

  const camera = new THREE.PerspectiveCamera(
    58,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(3.4, 4.4, 10.5);

  const bounds = { x: 7, z: 7, wallH: 6, floorY: 0 };

  // Room: floor + coloured walls (thin boxes).
  const white = new THREE.MeshStandardMaterial({ color: 0xbcbcbc, roughness: 0.92 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xd96a1e, roughness: 0.85 });
  const teal = new THREE.MeshStandardMaterial({ color: 0x1e8f8a, roughness: 0.85 });

  const ground = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 14), white);
  ground.position.y = -0.1;
  scene.add(ground);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 0.2), white);
  backWall.position.set(0, 3, -7);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 14), orange);
  leftWall.position.set(-7, 3, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 14), teal);
  rightWall.position.set(7, 3, 0);
  scene.add(rightWall);

  function pedestal(x, z, height = 1.0) {
    const p = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.05, height, 24),
      new THREE.MeshStandardMaterial({ color: 0x777d88, roughness: 0.6 })
    );
    p.position.set(x, height / 2, z);
    scene.add(p);
    return p;
  }

  // Hero pieces (static beauty anchors) — moderate tessellation.
  const teapot = new THREE.Mesh(
    new TeapotGeometry(0.8, 10),
    new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.35, metalness: 0.1 })
  );
  pedestal(3.6, -3.0);
  teapot.position.set(3.6, 1.75, -3.0);
  scene.add(teapot);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.23, 140, 20),
    new THREE.MeshStandardMaterial({ color: 0xc0c8d0, roughness: 0.3, metalness: 0.2 })
  );
  pedestal(0.4, -1.4, 0.8);
  knot.position.set(0.4, 1.7, -1.4);
  scene.add(knot);

  // An emissive panel — lights the scene through GI alone.
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.4, 0.1),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xfff2d8,
      emissiveIntensity: 6,
    })
  );
  panel.position.set(2.0, 2.4, -6.85);
  scene.add(panel);

  // Lights (all picked up automatically; toggled live via updateLights()).
  const warm = new THREE.PointLight(0xffd9a0, 13);
  warm.position.set(-3.2, 4.6, 3.4);
  warm.userData.rtRadius = 0.35;
  scene.add(warm);

  const cool = new THREE.PointLight(0x9fc4ff, 9);
  cool.position.set(4.4, 5.2, 2.0);
  cool.userData.rtRadius = 0.3;
  scene.add(cool);

  const sun = new THREE.DirectionalLight(0xfff4e0, 0.8);
  sun.position.set(6, 10, 4);
  sun.target.position.set(0, 0, 0);
  sun.userData.rtRadius = 0.03;
  scene.add(sun);
  scene.add(sun.target);

  const lights = { warm, cool, sun, panel };

  // glTF hero models load asynchronously; resolve when they're in the scene.
  const ready = (async () => {
    const loader = new GLTFLoader();
    const load = (url) =>
      new Promise((res, rej) => loader.load(url, res, undefined, rej));
    const [helmet, duck, lantern] = await Promise.all([
      load(helmetUrl),
      load(duckUrl),
      load(lanternUrl),
    ]);

    helmet.scene.scale.setScalar(1.4);
    helmet.scene.position.set(-2.8, 2.4, -2.2);
    helmet.scene.rotation.y = 0.7;
    pedestal(-2.8, -2.2, 1.4);
    scene.add(helmet.scene);

    duck.scene.scale.setScalar(0.9);
    duck.scene.position.set(-5.2, 0.0, 2.6);
    duck.scene.rotation.y = -0.9;
    scene.add(duck.scene);

    lantern.scene.scale.setScalar(0.2);
    lantern.scene.position.set(5.4, 0, -5.0);
    scene.add(lantern.scene);
  })();

  return { scene, camera, bounds, lights, panel, ready };
}
