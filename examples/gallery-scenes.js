/**
 * The premade-scene catalogue — stock glTF models that were never authored for
 * this library, plus the classic Cornell box, each returning a plain three.js
 * Scene and the camera framing for it.
 *
 * This used to live inside examples/gallery.js. It is a module of its own now
 * because TWO pages show these scenes: gallery.html (the flat picker) and the
 * guided tour's stop 3 (models.html). Neither copies the other's scene code and
 * neither adds an asset — the two big models are still streamed from their
 * canonical public hosts and the small ones are still the two .glb files that
 * were already in the repo.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// The two big showcase models are streamed from their canonical public hosts
// rather than committed — cloning the library shouldn't cost 14 MB of demo
// assets. (Helmet + Duck are small and were already part of the repo.)
const tokyoUrl =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/LittlestTokyo.glb";
const lanternUrl =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Lantern/glTF-Binary/Lantern.glb";
const khronos = (name) =>
  `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/${name}/glTF-Binary/${name}.glb`;
const cameraUrl = khronos("AntiqueCamera");
const boomBoxUrl = khronos("BoomBox");
const corsetUrl = khronos("Corset");
const waterBottleUrl = khronos("WaterBottle");
const toyCarUrl = khronos("ToyCar");
const iridescenceLampUrl = khronos("IridescenceLamp");
const mosquitoUrl = khronos("MosquitoInAmber");
const foxUrl = khronos("Fox");
import helmetUrl from "./assets/DamagedHelmet.glb?url";
import duckUrl from "./assets/Duck.glb?url";

// Google-hosted DRACO decoder (same one the official three.js examples use).
const draco = new DRACOLoader().setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);
const loader = new GLTFLoader().setDRACOLoader(draco);
const loadGltf = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));

/** Normalize a loaded model to `size` world units and rest it on y=0. */
function normalize(root, size) {
  const box = new THREE.Box3().setFromObject(root);
  const span = box.getSize(new THREE.Vector3());
  const s = size / Math.max(span.x, span.y, span.z);
  root.scale.setScalar(s);
  box.setFromObject(root);
  root.position.y -= box.min.y;
  root.position.x -= (box.min.x + box.max.x) / 2;
  root.position.z -= (box.min.z + box.max.z) / 2;
}

function groundPlane(color = 0x9aa3ac) {
  // A radial colour falloff toward the disc edge, so the shadow-catcher fades
  // into the dark background instead of ending on a hard circle. Opaque — the
  // tracer keeps the full surface for shadows and contact.
  const base = new THREE.Color(color);
  const edge = base.clone().multiplyScalar(0.1);
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "#" + base.getHexString());
  grad.addColorStop(0.36, "#" + base.getHexString());
  grad.addColorStop(0.5, "#" + edge.getHexString());
  grad.addColorStop(1, "#" + edge.getHexString());
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const g = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 0.3, 48),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, map })
  );
  g.position.y = -0.15;
  return g;
}

function sunAndSky(scene, intensity = 3.2, pos = [8, 14, 6]) {
  const sun = new THREE.DirectionalLight(0xfff2dd, intensity);
  sun.position.set(...pos);
  sun.userData.rtRadius = 0.04;
  scene.add(sun, sun.target);
  return {
    enabled: true,
    sunDir: sun.position.clone().normalize(),
    sunColor: new THREE.Color(1.0, 0.93, 0.82),
    zenith: new THREE.Color(0.2, 0.36, 0.62),
    horizon: new THREE.Color(0.74, 0.82, 0.9),
    intensity: 1.0,
  };
}

export const SCENES = {
  // The classic Cornell box: white floor/ceiling/back, red left wall, green
  // right wall, two rotated blocks, ONE ceiling area light and nothing else.
  // The standard reference for GI colour bleed, soft area shadows and emissive
  // NEE — with ray tracing toggled off it goes nearly black, which is the
  // whole point (raster has no path from an emissive quad to the walls).
  async cornell() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const S = 5.6;
    const white = new THREE.MeshStandardMaterial({ color: 0xd6d0c2, roughness: 0.9 });
    const red = new THREE.MeshStandardMaterial({ color: 0xb01e12, roughness: 0.9 });
    const green = new THREE.MeshStandardMaterial({ color: 0x1c8a1a, roughness: 0.9 });
    const box = (w, h, d, x, y, z, mat) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      scene.add(m);
      return m;
    };
    box(S, 0.1, S, 0, -0.05, 0, white);              // floor
    box(S, 0.1, S, 0, S + 0.05, 0, white);           // ceiling
    box(S, S, 0.1, 0, S / 2, -S / 2 - 0.05, white);  // back
    box(0.1, S, S, -S / 2 - 0.05, S / 2, 0, red);    // left
    box(0.1, S, S, S / 2 + 0.05, S / 2, 0, green);   // right
    box(1.7, 3.4, 1.7, -1.0, 1.7, -1.0, white).rotation.y = 0.3;  // tall block
    box(1.7, 1.7, 1.7, 1.05, 0.85, 0.9, white).rotation.y = -0.3; // short block
    const lamp = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.06, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xffe9c4,
        emissiveIntensity: 16,
      })
    );
    lamp.position.set(0, S - 0.04, 0);
    scene.add(lamp);
    return {
      scene,
      sky: { enabled: false },
      cam: [0, 2.8, 7.8],
      target: [0, 2.7, 0],
      env: { color: new THREE.Color(0.0, 0.0, 0.0), intensity: 0.0 },
    };
  },
  async tokyo() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10151d);
    const gltf = await loadGltf(tokyoUrl);
    normalize(gltf.scene, 12);
    scene.add(gltf.scene, groundPlane(0x2a2f36));
    // Sun on the camera side so the street facade reads.
    const sky = sunAndSky(scene, 2.4, [14, 16, 15]);
    const fill = new THREE.PointLight(0xaac8ff, 4);
    fill.position.set(-6, 7, -4);
    fill.userData.rtRadius = 0.4;
    scene.add(fill);
    return {
      scene, sky, cam: [11, 7, 12], target: [0, 3.4, 0],
      env: { color: new THREE.Color(0.35, 0.42, 0.55), intensity: 0.8 },
    };
  },
  async lantern() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(lanternUrl);
    normalize(gltf.scene, 8);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.2);
    return { scene, sky, cam: [7, 5, 9], target: [0, 3, 0] };
  },
  async helmet() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const [helmet, duck] = await Promise.all([loadGltf(helmetUrl), loadGltf(duckUrl)]);
    helmet.scene.scale.setScalar(2.2);
    helmet.scene.position.set(0, 2.6, 0);
    duck.scene.position.set(3.2, 0, 1.8);
    duck.scene.scale.setScalar(1.2);
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.6, 1.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.5 })
    );
    plinth.position.y = 0.75;
    const mirror = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 48, 32),
      new THREE.MeshStandardMaterial({ color: 0xf2f4f8, roughness: 0.06, metalness: 1.0 })
    );
    mirror.position.set(-3.0, 0.9, 1.4);
    scene.add(helmet.scene, duck.scene, plinth, mirror, groundPlane());
    const sky = sunAndSky(scene, 2.8);
    return { scene, sky, cam: [6, 4, 8], target: [0, 2, 0] };
  },
  async camera() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(cameraUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6, [10, 15, 8]);
    return { scene, sky, cam: [6, 5, 8], target: [0, 3, 0] };
  },
  async boombox() {
    // BoomBox is authored a few centimetres tall — normalize large so it fills
    // the view, then a tighter camera to read the metal + label textures.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(boomBoxUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x777d85));
    const sky = sunAndSky(scene, 2.8);
    return { scene, sky, cam: [5, 4, 7], target: [0, 2.2, 0] };
  },
  async corset() {
    // Another sub-centimetre asset — scaled up so the glossy fabric shows.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(corsetUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.4, 0] };
  },
  async waterbottle() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(waterBottleUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.2, 0] };
  },
  async toycar() {
    // Sub-centimetre clearcoat asset — scaled up so the metallic paint and the
    // reflective clearcoat over it read on the raytraced side.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(toyCarUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x777d85));
    const sky = sunAndSky(scene, 2.8);
    return { scene, sky, cam: [5, 4, 7], target: [0, 2.2, 0] };
  },
  async iridescence() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(iridescenceLampUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [6, 5, 8], target: [0, 3.2, 0] };
  },
  async mosquito() {
    // Amber block — a refractive/transmissive hero, so it shows best with the
    // glass paths on.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(mosquitoUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.6);
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.4, 0] };
  },
  async fox() {
    // Fox is a skinned/animated asset — we load it and render the bind pose
    // (no mixer), which is fine for a static lighting showcase.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(foxUrl);
    normalize(gltf.scene, 7);
    scene.add(gltf.scene, groundPlane(0x8d939b));
    const sky = sunAndSky(scene, 2.8, [10, 15, 8]);
    return { scene, sky, cam: [6, 5, 8], target: [0, 3, 0] };
  },
};

/**
 * Display order + labels, so the gallery's <select> and the tour's model picker
 * agree without either hard-coding the other's list. The Cornell box is left OUT
 * of the tour's list (tour stop 1 IS a Cornell box, procedurally rebuilt with a
 * feature switcher) but stays in the gallery's, which is the flat catalogue.
 */
export const SCENE_LIST = [
  ["cornell", "Cornell box (the classic)", { galleryOnly: true },
    "The classic GI test room: one ceiling light, colour bleed, real shadows."],
  // Curated order: the assets a three.js reader recognises on sight come first,
  // and the one entry that needs no network at all comes last (it is the
  // offline fallback, not a showcase — the helmet is already the museum's hero
  // one stop upstream, so leading with it showed the same model twice).
  ["boombox", "BoomBox (Khronos sample)", null,
    "Chrome trim and a speaker grille that show off traced metal and texture maps."],
  ["tokyo", "Littlest Tokyo (DRACO glTF)", { heavy: true },
    "A full street diorama, DRACO-compressed and streamed from the three.js repo."],
  ["camera", "Antique Camera (Khronos sample)", null,
    "Brass and glass from the Antique Camera, a canonical Khronos sample."],
  ["lantern", "Lantern (Khronos sample)", null,
    "The Khronos Lantern, warm metal and glowing panes."],
  ["fox", "Fox — bind pose (Khronos sample)", null,
    "Fox in bind pose, a skinned Khronos model."],
  ["waterbottle", "Water Bottle (Khronos sample)", null,
    "Clear plastic and liquid, a refraction and transmission showcase."],
  ["toycar", "Toy Car (Khronos sample)", null,
    "Metallic paint and clearcoat on a sub-centimetre model, scaled up."],
  ["iridescence", "Iridescence Lamp (Khronos sample)", null,
    "The Iridescence Lamp, thin-film colour on glass."],
  ["mosquito", "Mosquito in Amber (Khronos sample)", null,
    "Mosquito in Amber, a refractive hero for the glass paths."],
  ["corset", "Corset (Khronos sample)", null,
    "Glossy fabric, a Khronos sample with detailed cloth."],
  ["helmet", "Damaged Helmet + props (bundled, works offline)", { bundled: true },
    "Damaged Helmet plus a chrome sphere and a duck, bundled and offline."],
];
