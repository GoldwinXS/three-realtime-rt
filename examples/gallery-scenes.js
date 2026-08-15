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
// The waterfall is the catalogue's only scene that MOVES, so it is the only one
// that needs a simulation. Same pooled Rapier helper the museum demo uses: a
// fixed set of bodies handed to the tracer once as `dynamicMeshes`, so the BVH
// layout never changes and "respawning" is a teleport, not a recompile.
import { Physics } from "./physics.js";

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

function groundPlane(baseHex, edgeHex) {
  // A radial colour falloff toward the disc edge that fades INTO the sky's
  // horizon colour instead of to black, so the platform reads as a naturally lit
  // turntable receding into the environment rather than a specimen on a dark
  // dish in a void. Opaque — the tracer keeps the full surface for shadows and
  // contact. The cylinder's side carries the same gradient, so the rim blends
  // with the background it sits against.
  const base = new THREE.Color(baseHex);
  const edge = new THREE.Color(edgeHex);
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "#" + base.getHexString());
  grad.addColorStop(0.4, "#" + base.getHexString());
  grad.addColorStop(0.74, "#" + base.clone().lerp(edge, 0.8).getHexString());
  grad.addColorStop(1, "#" + edge.getHexString());
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  // Radius 22, not 14: a far-backed camera (tokyo sits ~19 units out) used to
  // frame the disc's hard outer edge, reading as a floating plate. At 22 the
  // edge stays out of frame on every scene, so all you see is the platform top
  // fading toward the horizon colour.
  const g = new THREE.Mesh(
    new THREE.CylinderGeometry(22, 22, 0.35, 48),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, map })
  );
  g.position.y = -0.175;
  return g;
}

// Procedural sky palettes. Each scene picks one; the sun DirectionalLight is
// placed ALONG the same sunDir so the direct shadows line up with the sky's sun
// disk (the old helper placed the light at an arbitrary pos and then derived
// sunDir from it, which never disagreed but was roundabout).
const SKY_PALETTES = {
  // clean daylight — the neutral turntable look
  day: {
    sunDir: [0.5, 0.75, 0.45], lightColor: 0xfff2dd, sunIntensity: 3.2,
    sunColor: new THREE.Color(1.0, 0.93, 0.82),
    zenith: new THREE.Color(0.22, 0.40, 0.66), horizon: new THREE.Color(0.75, 0.82, 0.90),
    skyIntensity: 1.05, ground: [0x9aa3ac, 0xe0e9f4],
  },
  // golden hour — warm low sun for the fox and the warm-metal pieces
  golden: {
    sunDir: [-0.4, 0.42, 0.82], lightColor: 0xffe2bd, sunIntensity: 2.6,
    sunColor: new THREE.Color(1.0, 0.82, 0.58),
    zenith: new THREE.Color(0.30, 0.44, 0.66), horizon: new THREE.Color(0.92, 0.78, 0.62),
    skyIntensity: 1.1, ground: [0x9a9486, 0xf6e5cd],
  },
  // dusk — a night street: deep blue overhead, warm low sun, dark asphalt.
  // The disc edge is set to the horizon's sRGB value so a low camera sees the
  // platform recede into the sky instead of a dark circle against a light band.
  dusk: {
    sunDir: [0.55, 0.28, 0.78], lightColor: 0xffc9a0, sunIntensity: 2.0,
    sunColor: new THREE.Color(1.0, 0.60, 0.38),
    zenith: new THREE.Color(0.05, 0.10, 0.24), horizon: new THREE.Color(0.20, 0.22, 0.32),
    skyIntensity: 1.0, ground: [0x3f4550, 0x7c819b],
  },
  // bright studio daylight — for clearcoat/showcase pieces
  studio: {
    sunDir: [0.5, 0.8, 0.4], lightColor: 0xfff6e8, sunIntensity: 2.8,
    sunColor: new THREE.Color(1.0, 0.95, 0.85),
    zenith: new THREE.Color(0.30, 0.50, 0.72), horizon: new THREE.Color(0.86, 0.90, 0.95),
    skyIntensity: 1.2, ground: [0x7d848c, 0xeff4f9],
  },
};

function sunAndSky(scene, palette = "day") {
  const p = SKY_PALETTES[palette] || SKY_PALETTES.day;
  const sunDir = new THREE.Vector3(...p.sunDir).normalize();
  const sun = new THREE.DirectionalLight(p.lightColor, p.sunIntensity);
  sun.position.copy(sunDir).multiplyScalar(18);
  sun.userData.rtRadius = 0.04;
  scene.add(sun, sun.target);
  return {
    enabled: true,
    sunDir: sunDir.clone(),
    sunColor: p.sunColor.clone(),
    zenith: p.zenith.clone(),
    horizon: p.horizon.clone(),
    intensity: p.skyIntensity,
    // ground colours ride along so the scene builders keep sky and ground in
    // one place instead of re-deriving them per scene.
    ground: p.ground,
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
      // The one scene whose whole point is the bounce: 0.15 ships gi OFF by
      // default (the owner's "expense off" rule), so entering the Cornell box
      // turns it on for you, and the strip's checkbox says so. Reset restores
      // the library defaults like everywhere else.
      settingsOnEnter: { gi: true },
    };
  },
  // A tall open-fronted shaft with pegs in it, and forty bodies falling through
  // it forever. The catalogue's only MOVING scene, and it is here to show the
  // three things a still cannot: dynamic geometry refitted into the BVH every
  // frame, EMISSIVE movers that are real area lights (their glow travels with
  // them across the pegs), and point lights riding bodies through a reservoir
  // that has to survive their motion — which is exactly what the 0.15.0 stable
  // light slots and motion vectors are for.
  //
  // Composition: 6 wide x 10 tall x 3 deep, dull grey back and side walls, NO
  // FLOOR. Five staggered peg rows and three angled deflectors break the drop
  // up; anything that reaches the bottom falls into the void and is put back on
  // the hopper line with a fresh x, so it never stops and never settles.
  //
  // Light budget, deliberately well under the 32-slot table: 4 point lights
  // parented to bodies, 1 static lamp over the hopper, 1 dim fill, and a
  // HemisphereLight for the unoccluded ambient (0.15.0) that keeps the shaft's
  // shadowed faces from being pure black with GI off.
  //
  // NEE budget, which is the one that actually bites: the emissive area-light
  // list caps at 256 TRIANGLES for the whole scene, so every emitter here is a
  // BOX. Six emissive bodies plus the lamp is 7 x 12 = 84 triangles. A single
  // 14x10 emissive sphere would have been 240 of them.
  async waterfall() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080c);

    const W = 6, H = 10, D = 3;      // interior span
    const hw = W / 2, hd = D / 2;
    const T = 0.25;                  // wall thickness

    const wall = new THREE.MeshStandardMaterial({ color: 0x5c6166, roughness: 0.85 });
    const trim = new THREE.MeshStandardMaterial({ color: 0x3a4046, roughness: 0.7, metalness: 0.25 });
    const slab = (w, h, d, x, y, z, mat) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      scene.add(m);
      return m;
    };
    slab(W + 2 * T, H, T, 0, H / 2, -hd - T / 2, wall);          // back
    slab(T, H, D + T, -hw - T / 2, H / 2, 0, wall);              // left
    slab(T, H, D + T, hw + T / 2, H / 2, 0, wall);               // right
    slab(W + 2 * T, T, D + T, 0, H + T / 2, 0, trim);            // lid, over the hopper
    // ...and no floor. The bottom of the shaft is open, which is the point.

    const physics = await Physics.create();
    // Walls as colliders. The FRONT one has no mesh: the shaft is open-fronted
    // so you can see in, but a body that wandered out of it would fall past the
    // camera and be gone, so an invisible pane keeps the fall on the board. The
    // same trick the museum's room uses.
    physics.addFixed("cuboid", [T, H / 2, hd + T], { x: -hw - T, y: H / 2, z: 0 });
    physics.addFixed("cuboid", [T, H / 2, hd + T], { x: hw + T, y: H / 2, z: 0 });
    physics.addFixed("cuboid", [hw + T, H / 2, T], { x: 0, y: H / 2, z: -hd - T });
    physics.addFixed("cuboid", [hw + T, H / 2, T], { x: 0, y: H / 2, z: hd + T });
    physics.addFixed("cuboid", [hw + T, T, hd + T], { x: 0, y: H + T, z: 0 });

    // --- pegs: five staggered rows, static, in the BVH ------------------------
    // Cylinders lying along Z so a body cannot slip past one in depth, which a
    // sphere peg would allow. Rapier's cylinder is Y-axis aligned, so both the
    // mesh and the collider take the same quarter turn about X.
    const pegR = 0.13, pegL = D * 0.62;
    const pegGeo = new THREE.CylinderGeometry(pegR, pegR, pegL, 14);
    const pegMat = new THREE.MeshStandardMaterial({ color: 0x9aa3ab, roughness: 0.3, metalness: 0.6 });
    const layDown = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const ROWS = 5, PER_ROW = 5, SPACING = W / PER_ROW;
    for (let r = 0; r < ROWS; r++) {
      const y = 7.6 - r * 1.45;
      const odd = r % 2 === 1;
      const n = odd ? PER_ROW - 1 : PER_ROW;
      for (let c = 0; c < n; c++) {
        const x = (c - (n - 1) / 2) * SPACING + (odd ? 0 : 0);
        const m = new THREE.Mesh(pegGeo, pegMat);
        m.position.set(x, y, 0);
        m.quaternion.copy(layDown);
        scene.add(m);
        // Friction 0.02, and this is the whole difference between a waterfall
        // and a pile: the props carry friction 0.8 from the pool, Rapier
        // combines the two, and anything above about tan(slope) lets a body
        // PERCH instead of sliding off.
        physics.addFixed("cylinder", [pegL / 2, pegR], { x, y, z: 0 }, layDown,
          { restitution: 0.5, friction: 0.02 });
      }
    }

    // --- deflectors: three angled slabs, so the fall is not a straight drop ---
    // Angles matter more than they look. The first cut used 0.42 / -0.38 rad
    // (24 / 22 degrees) against the default 0.4 friction, which is almost
    // exactly the critical angle — so the middle slab became a SHELF and the
    // scene turned into a heap within ten seconds instead of a waterfall. These
    // are 34-40 degrees with friction 0.02: a body glances off and keeps going.
    const defl = [
      { w: 2.5, x: -1.5, y: 6.4, rot: 0.62 },
      { w: 2.5, x: 1.6, y: 4.3, rot: -0.68 },
      { w: 2.1, x: -1.2, y: 2.3, rot: 0.7 },
    ];
    for (const d of defl) {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, d.rot));
      const m = new THREE.Mesh(new THREE.BoxGeometry(d.w, 0.18, D * 0.9), trim);
      m.position.set(d.x, d.y, 0);
      m.quaternion.copy(q);
      scene.add(m);
      physics.addFixed("cuboid", [d.w / 2, 0.09, D * 0.45], { x: d.x, y: d.y, z: 0 }, q,
        { restitution: 0.3, friction: 0.02 });
    }

    // --- the falling bodies ---------------------------------------------------
    // 40 pooled props at ~0.25 across; spawnPool's own layout is irrelevant here
    // because the hopper immediately re-places every one of them.
    const COUNT = 40;
    physics.spawnPool(scene, COUNT, new THREE.Vector3(0, H, 0), { size: 0.52, segments: [10, 7] });

    // Deterministic hopper: a body's x, its lateral nudge and its drop height
    // all come from one seeded stream per body, so the same page load produces
    // the same waterfall and a capture can be compared with another capture.
    const rand = (n) => {
      let a = (n * 2654435761) >>> 0;
      a = (a ^ (a >>> 15)) >>> 0;
      a = Math.imul(a, 0x85ebca6b) >>> 0;
      return ((a ^ (a >>> 13)) >>> 0) / 4294967296;
    };
    let dropSeq = 0;
    const drop = (prop, i) => {
      const t = dropSeq++;
      const x = (rand(i * 977 + t * 31 + 1) - 0.5) * (W - 1.1);
      const y = H - 0.6 + rand(i * 31 + t * 7 + 3) * 0.5;
      const z = (rand(i * 13 + t * 101 + 5) - 0.5) * (D - 1.0);
      prop.body.setTranslation({ x, y, z }, true);
      prop.body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      prop.body.setLinvel({ x: 0, y: -0.6, z: 0 }, true);
      prop.body.setAngvel({ x: (rand(t * 3 + 9) - 0.5) * 3, y: 0, z: (rand(t * 5 + 11) - 0.5) * 3 }, true);
      prop.body.wakeUp();
    };
    // Stagger the first fill down the shaft so it is already raining at frame 1
    // instead of arriving as one slab.
    physics.props.forEach((prop, i) => {
      drop(prop, i);
      const t = prop.body.translation();
      prop.body.setTranslation({ x: t.x, y: t.y - (i / COUNT) * (H - 1.2), z: t.z }, true);
    });
    // The loop itself: past the open bottom, back to the hopper line.
    physics.killY = -2.5;
    const indexOf = new Map(physics.props.map((prop, i) => [prop, i]));
    physics.respawn = (prop) => drop(prop, indexOf.get(prop) ?? 0);

    // --- six of them emit, and they are the moving light ----------------------
    // Emissive DYNAMIC meshes are real NEE area lights here: their triangles are
    // re-derived from the freshly baked positions every updateDynamic(), so the
    // light travels with the body instead of staying where it was compiled.
    // Boxes only (12 tris each) — see the NEE note above.
    const GLOW = [0xffd27a, 0x7ad4ff, 0xff8ab0, 0x9dff8a, 0xffa24a, 0xc39dff];
    const emitters = [];
    for (let k = 0, i = 0; k < 6 && i < COUNT; i++) {
      if (i % 3 === 0) continue; // spheres: too many triangles for the NEE cap
      const prop = physics.props[i];
      prop.mesh.material.color.setHex(0x101014);
      prop.mesh.material.emissive = new THREE.Color(GLOW[k]);
      prop.mesh.material.emissiveIntensity = 9;
      emitters.push(prop);
      k++;
    }

    // --- four point lights riding bodies --------------------------------------
    // Parented to the mesh, so physics.sync()'s updateMatrixWorld carries them
    // and syncLights reads a correct world position. This is the case 0.15.0's
    // STABLE LIGHT SLOTS exist for: these four keep their table index frame to
    // frame, so every reservoir pointing at one stays valid while it moves.
    const riders = [];
    for (let k = 0; k < 4; k++) {
      const host = emitters[k];
      const light = new THREE.PointLight(GLOW[k], 5.0, 0, 2);
      light.userData.rtRadius = 0.25;
      host.mesh.add(light);
      riders.push(light);
    }

    // --- static light: a lamp over the hopper, and one dim fill ---------------
    const lampBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.16, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xfff0d0, emissiveIntensity: 4 })
    );
    lampBox.position.set(0, H - 0.35, 0);
    scene.add(lampBox);
    const lamp = new THREE.PointLight(0xfff0d0, 9, 0, 2);
    lamp.position.set(0, H - 0.6, 0.2);
    lamp.userData.rtRadius = 0.35;
    const fill = new THREE.PointLight(0x9fc4ff, 3.5, 0, 2);
    fill.position.set(0, 3.0, 5.5);
    fill.userData.rtRadius = 0.6;
    scene.add(lamp, fill);
    // Unoccluded ambient (0.15.0). With gi off by default, this is what stops
    // the shaft's shadowed faces from being pure black — and it is a real
    // function of the normal, so the walls and the peg tops do not read flat.
    const hemi = new THREE.HemisphereLight(0x6f8ec4, 0x2a1d14, 0.55);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);

    let last = performance.now();
    return {
      scene,
      sky: { enabled: false },
      cam: [4.2, 5.6, 10.6],
      target: [0, 4.9, 0],
      env: { color: new THREE.Color(0.03, 0.04, 0.06), intensity: 1.0 },
      // Everything that moves, handed over once. The pool is fixed, so this list
      // never changes and the BVH is refitted rather than rebuilt.
      dynamicMeshes: physics.meshes,
      // Driven by the gallery's render loop. Rapier is stepped at its own fixed
      // timestep; `dt` is here so a stalled tab does not fast-forward the shaft.
      update() {
        const now = performance.now();
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        if (dt > 0) physics.step();
        return true; // always dirty: something is always falling
      },
      // Exposed for the automated capture (dev/waterfall-capture.mjs) and for
      // anyone poking at it from the console.
      debug: { physics, emitters, riders, lamp, fill, hemi },
    };
  },
  async tokyo() {
    // Dusk: the scene is a night street, so the sky is a deep twilight (not the
    // flat bright grey the generic daylight palette gave it). The model's
    // emissive geometry massively exceeds the shared NEE cap (88837 tris -> the
    // largest 256 kept), so its signs read as glowing but cast almost no light;
    // two low analytic fills near the street simulate the ambient spill that the
    // cap drops.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10151d);
    const gltf = await loadGltf(tokyoUrl);
    normalize(gltf.scene, 12);
    const sky = sunAndSky(scene, "dusk");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    const fill = new THREE.PointLight(0xaac8ff, 3);
    fill.position.set(-6, 7, -4);
    fill.userData.rtRadius = 0.4;
    const spillWarm = new THREE.PointLight(0xffc9a0, 5);
    spillWarm.position.set(5, 6, 4);
    spillWarm.userData.rtRadius = 0.5;
    const spillCool = new THREE.PointLight(0x8fd0ff, 3.5);
    spillCool.position.set(-3, 5, 5);
    spillCool.userData.rtRadius = 0.5;
    scene.add(fill, spillWarm, spillCool);
    return {
      scene, sky, cam: [12, 8, 14], target: [0, 4.5, 0],
      env: { color: new THREE.Color(0.35, 0.42, 0.55), intensity: 0.8 },
    };
  },
  async lantern() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(lanternUrl);
    normalize(gltf.scene, 8);
    const sky = sunAndSky(scene, "golden");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
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
    const sky = sunAndSky(scene, "studio");
    scene.add(helmet.scene, duck.scene, plinth, mirror, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [6, 4, 8], target: [0, 2, 0] };
  },
  async camera() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(cameraUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "studio");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [6, 5, 8], target: [0, 3, 0] };
  },
  async boombox() {
    // BoomBox is authored a few centimetres tall — normalize large so it fills
    // the view, then a tighter camera to read the metal + label textures.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(boomBoxUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "studio");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [5, 4, 7], target: [0, 2.2, 0] };
  },
  async corset() {
    // Another sub-centimetre asset — scaled up so the glossy fabric shows.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(corsetUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "studio");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.4, 0] };
  },
  async waterbottle() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(waterBottleUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "studio");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.2, 0] };
  },
  async toycar() {
    // Sub-centimetre clearcoat asset — scaled up so the metallic paint and the
    // reflective clearcoat over it read on the raytraced side. Bright studio
    // daylight gives the clearcoat a real sky gradient to reflect.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(toyCarUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "studio");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [5.6, 4.4, 7.4], target: [0, 2.4, 0] };
  },
  async iridescence() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(iridescenceLampUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "golden");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [6, 5, 8], target: [0, 3.2, 0] };
  },
  async mosquito() {
    // Amber block — a refractive/transmissive hero, so it shows best with the
    // glass paths on.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(mosquitoUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "studio");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [5, 5, 7], target: [0, 3.4, 0] };
  },
  async fox() {
    // Fox is a skinned/animated asset — we load it and render the bind pose
    // (no mixer), which is fine for a static lighting showcase. Golden-hour sky
    // and a tighter, lower camera so the low-poly fox fills the frame instead of
    // floating in grey space.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    const gltf = await loadGltf(foxUrl);
    normalize(gltf.scene, 7);
    const sky = sunAndSky(scene, "golden");
    scene.add(gltf.scene, groundPlane(sky.ground[0], sky.ground[1]));
    return { scene, sky, cam: [4.6, 3.4, 5.6], target: [0, 2.2, 0] };
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
  ["waterfall", "Waterfall (moving, many lights)", { galleryOnly: true },
    "Forty bodies falling through a peg board forever. Six of them glow and four carry lights, so the light moves with the geometry."],
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
