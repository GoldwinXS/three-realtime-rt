import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";

import helmetUrl from "./assets/DamagedHelmet.glb?url";
import duckUrl from "./assets/Duck.glb?url";

/**
 * An indoor "Cornell-style" room: a floor and three saturated coloured walls,
 * open at the top, lit by an emissive panel + two coloured point lights. This is
 * the strongest showcase for ray traced GI — you can clearly watch light bounce
 * off the coloured walls and bleed onto the white floor and the objects.
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
  camera.position.set(6.0, 3.8, 8.0);

  const bounds = { x: 7, z: 7, wallH: 6, floorY: 0 };

  // Room shell — thin boxes. Saturated side walls so colour bleed is obvious.
  const white = new THREE.MeshStandardMaterial({ color: 0xc4c4c4, roughness: 0.92 });
  const red = new THREE.MeshStandardMaterial({ color: 0xc42f2a, roughness: 0.85 });
  const green = new THREE.MeshStandardMaterial({ color: 0x2f9d4f, roughness: 0.85 });

  const ground = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 14), white);
  ground.position.y = -0.1;
  scene.add(ground);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 0.2), white);
  backWall.position.set(0, 3, -7);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 14), red);
  leftWall.position.set(-7, 3, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 14), green);
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

  // Hero pieces (static beauty anchors).
  const teapot = new THREE.Mesh(
    new TeapotGeometry(0.8, 10),
    new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.35, metalness: 0.1 })
  );
  pedestal(3.6, -2.6);
  teapot.position.set(3.6, 1.75, -2.6);
  scene.add(teapot);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.23, 140, 20),
    new THREE.MeshStandardMaterial({ color: 0xc0c8d0, roughness: 0.3, metalness: 0.2 })
  );
  pedestal(0.2, -0.4, 0.8);
  knot.position.set(0.2, 1.7, -0.4);
  scene.add(knot);

  // Emissive panel — an area light that lights the room purely through GI.
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.5, 0.1),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xfff2d8,
      emissiveIntensity: 6,
    })
  );
  panel.position.set(-2.0, 2.4, -6.85);
  scene.add(panel);

  // Two coloured point lights for soft shadows + warm/cool contrast.
  const warm = new THREE.PointLight(0xffd9a0, 13);
  warm.position.set(-3.2, 4.6, 3.4);
  warm.userData.rtRadius = 0.35;
  scene.add(warm);

  const cool = new THREE.PointLight(0x9fc4ff, 9);
  cool.position.set(4.4, 5.0, 2.2);
  cool.userData.rtRadius = 0.3;
  scene.add(cool);

  // Light descriptors for the UI (label + whether to show a colour swatch).
  const lights = [
    { label: "warm light", light: warm, color: true },
    { label: "cool light", light: cool, color: true },
  ];

  // No procedural sky indoors — a low ambient fills GI rays that escape the room.
  const sky = { enabled: false };

  const ready = (async () => {
    const loader = new GLTFLoader();
    const load = (url) =>
      new Promise((res, rej) => loader.load(url, res, undefined, rej));
    const [helmet, duck] = await Promise.all([load(helmetUrl), load(duckUrl)]);

    helmet.scene.scale.setScalar(1.4);
    helmet.scene.position.set(-2.8, 2.4, -1.8);
    helmet.scene.rotation.y = 0.7;
    pedestal(-2.8, -1.8, 1.4);
    scene.add(helmet.scene);

    duck.scene.scale.setScalar(0.9);
    duck.scene.position.set(-5.0, 0.0, 2.6);
    duck.scene.rotation.y = -0.9;
    scene.add(duck.scene);
  })();

  return { scene, camera, bounds, lights, sky, ready };
}
