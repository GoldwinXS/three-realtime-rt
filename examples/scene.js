import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";

import helmetUrl from "./assets/DamagedHelmet.glb?url";
import duckUrl from "./assets/Duck.glb?url";

/**
 * An indoor gallery: a Cornell-style room (saturated side walls, open top)
 * arranged as a deliberate exhibit — every renderer feature gets a staged
 * vignette with a clear sightline from the default camera:
 *
 *   back-left    water pool under the emissive gallery light (deforming BVH,
 *                moving traced reflections of the glow)
 *   back-centre  DamagedHelmet hero pedestal under its own spotlight
 *                (normal/roughness maps + analytic-light glints)
 *   back-right   glossy teapot against the teal wall (GGX dielectric specular)
 *   mid-left     gold torus knot + the mirror sphere (traced reflections)
 *   mid-right    glass sphere (refraction) and the physics drop pad
 *   right wall   roughness ramp on plinths, lit by the cool light
 *   front-left   the duck in a museum vitrine (alpha-blend glass, casts no
 *                shadow onto the exhibit — exactly how game glass behaves)
 *   front        a freestanding amber pane the camera looks through
 *
 * GI colour bleed stays legible everywhere: red wall left, teal wall right,
 * warm-grey back, all the showcase whites in between.
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
  camera.position.set(6.8, 4.6, 10.4);

  const bounds = { x: 9, z: 9, wallH: 7, floorY: 0 };

  // Room shell — thin boxes. Saturated side walls so colour bleed is obvious;
  // the floor keeps a mild sheen so the GGX pass picks up the emissive strips.
  const white = new THREE.MeshStandardMaterial({ color: 0xc4c4c4, roughness: 0.6 });
  const backGrey = new THREE.MeshStandardMaterial({ color: 0xb9b3ac, roughness: 0.85 });
  const red = new THREE.MeshStandardMaterial({ color: 0xc42f2a, roughness: 0.85 });
  const teal = new THREE.MeshStandardMaterial({ color: 0x22808f, roughness: 0.8 });

  const ground = new THREE.Mesh(new THREE.BoxGeometry(18, 0.2, 18), white);
  ground.position.y = -0.1;
  scene.add(ground);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 7, 0.2), backGrey);
  backWall.position.set(0, 3.5, -9);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 18), red);
  leftWall.position.set(-9, 3.5, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 18), teal);
  rightWall.position.set(9, 3.5, 0);
  scene.add(rightWall);

  function pedestal(x, z, height = 1.0, radius = 0.9) {
    const p = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 1.15, height, 24),
      new THREE.MeshStandardMaterial({ color: 0x777d88, roughness: 0.55 })
    );
    p.position.set(x, height / 2, z);
    scene.add(p);
    return p;
  }

  // --- back-centre: helmet hero pedestal (loaded async below) ------------
  // Placed at the water's edge so the pool catches its reflection; its own
  // spotlight (toggleable) rakes it from the front-right for map detail +
  // an analytic glint on the visor.
  const HELMET_POS = new THREE.Vector3(0.8, 2.6, -6.0);
  pedestal(HELMET_POS.x, HELMET_POS.z, 1.6);

  // --- mid-left: gold knot (traced reflections + glints on metal) --------
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.23, 140, 20),
    // metalness just under 1: the traced reflection still dominates, but a
    // sliver of diffuse keeps a warm gold base even where the reflection ray
    // finds the dark open ceiling — full metal read as mottled camo there.
    new THREE.MeshStandardMaterial({ color: 0xd4af6a, roughness: 0.28, metalness: 0.85 })
  );
  pedestal(0.2, -1.6, 0.8);
  knot.position.set(0.2, 1.7, -1.6);
  scene.add(knot);

  // --- back-right: glossy cream teapot against the teal wall (GGX star) ---
  const teapot = new THREE.Mesh(
    new TeapotGeometry(0.8, 10),
    new THREE.MeshStandardMaterial({ color: 0xe4dccd, roughness: 0.12, metalness: 0.0 })
  );
  pedestal(5.8, -4.6);
  teapot.position.set(5.8, 1.75, -4.6);
  scene.add(teapot);

  // --- back wall, right half: the roughness ramp ---------------------------
  // Five IDENTICAL white spheres on ONE long bench, seen straight-on from the
  // default camera, differing ONLY in roughness (0.05 left -> 0.9 right): the
  // cool light above gives the mirror-end sphere a single tight highlight that
  // visibly broadens and dims down the row. One bench, even spacing, same size
  // — so it reads as a single "what roughness does" exhibit, not five props.
  // Lambert-only (PBR specular off) all five look identically flat.
  const rampRoughness = [0.05, 0.2, 0.4, 0.65, 0.9];
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(6.0, 0.5, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x9aa1ab, roughness: 0.5 })
  );
  bench.position.set(5.2, 0.25, -8.0);
  scene.add(bench);
  for (let i = 0; i < rampRoughness.length; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 40, 28),
      new THREE.MeshStandardMaterial({
        color: 0xdfe3ea,
        roughness: rampRoughness[i],
        metalness: 0.0,
      })
    );
    s.position.set(3.2 + i * 1.0, 0.95, -8.0);
    scene.add(s);
  }

  // --- reveals: mirror sphere (reflections) and glass sphere (refraction) --
  const mirror = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 48, 32),
    new THREE.MeshStandardMaterial({ color: 0xf2f4f8, roughness: 0.05, metalness: 1.0 })
  );
  const mirrorPed = pedestal(-6.6, -1.2);
  mirrorPed.visible = false;
  mirror.position.set(-6.6, 1.85, -1.2); // near the red wall: reflects pool + panel
  mirror.visible = false; // appears (with its pedestal) when "reflections" is enabled
  scene.add(mirror);

  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 48, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.02,
      metalness: 0.0,
      transmission: 1.0,
      ior: 1.5,
    })
  );
  const glassPed = pedestal(4.2, -1.4, 0.9);
  glassPed.visible = false;
  glass.position.set(4.2, 1.75, -1.4); // the room inverts through it from the camera
  glass.visible = false; // appears (with its pedestal) when "refraction" is enabled
  scene.add(glass);

  // --- front-left: the duck vitrine (alpha-blend transparency) ------------
  // A museum display case: marble plinth, duck exhibit, thin glass panes all
  // around. The panes are `transparent: true` so they are kept out of the BVH —
  // the case casts NO shadow onto its own exhibit and the straight-through
  // trace shows the duck at true brightness, lightly tinted. (Single-layer
  // deferred: the camera-facing pane wins; the back pane doesn't double-tint.)
  const vitrineGlass = new THREE.MeshStandardMaterial({
    color: 0xbfd8e8,
    roughness: 0.06,
    transparent: true,
    opacity: 0.18,
  });
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.7, 1.5),
    new THREE.MeshStandardMaterial({ color: 0xd8d4cc, roughness: 0.25 })
  );
  plinth.position.set(-5.6, 0.35, 4.0);
  scene.add(plinth);
  const vitrine = new THREE.Group();
  const paneGeoSide = new THREE.BoxGeometry(1.56, 1.7, 0.04);
  for (const [dx, dz, ry] of [
    [0, 0.76, 0],
    [0, -0.76, 0],
    [0.76, 0, Math.PI / 2],
    [-0.76, 0, Math.PI / 2],
  ]) {
    const pane = new THREE.Mesh(paneGeoSide, vitrineGlass);
    pane.position.set(dx, 0, dz);
    pane.rotation.y = ry;
    vitrine.add(pane);
  }
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.04, 1.56), vitrineGlass);
  lid.position.y = 0.87;
  vitrine.add(lid);
  // Museum case lighting: a small emissive puck under the lid lights the
  // exhibit from above via NEE — and since the glass panes are out of the BVH,
  // nothing blocks the case's own light from reaching the duck.
  const puck = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.04, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffe8c4,
      emissiveIntensity: 5,
    })
  );
  puck.position.y = 0.8;
  vitrine.add(puck);
  vitrine.position.set(-5.6, 1.55, 4.0);
  scene.add(vitrine);

  // --- front: freestanding amber pane the camera looks through ------------
  const paneAmber = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 3.0, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0xff9a5c,
      roughness: 0.3,
      transparent: true,
      opacity: 0.45,
    })
  );
  // On the teal wall — the right-side twin of the blue pane on the red wall:
  // teal bleeds through amber as a warm olive. Kept out of the hero sightline
  // on purpose: the straight-through trace is 1 ray + short history, so a huge
  // pane filling the default view reads grainy rather than impressive.
  paneAmber.position.set(8.0, 1.6, 2.6);
  paneAmber.rotation.y = -0.9;
  scene.add(paneAmber);

  // A second, bluer pane flanking the red wall — red bleeds through it purple.
  const paneBlue = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.8, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x6fb4ff,
      roughness: 0.3,
      transparent: true,
      opacity: 0.3,
    })
  );
  paneBlue.position.set(-8.1, 1.6, 1.2);
  paneBlue.rotation.y = 1.0;
  scene.add(paneBlue);

  // --- back-left: the water pool (deforming dynamic BVH) ------------------
  // Directly beneath the emissive gallery light with the helmet at its edge:
  // the ripples carry moving traced reflections of both. Low-poly on purpose —
  // the per-frame refit is O(dynamic tris).
  const WATER_SEGMENTS = 48;
  const waterGeo = new THREE.PlaneGeometry(5.5, 5.5, WATER_SEGMENTS, WATER_SEGMENTS);
  const water = new THREE.Mesh(
    waterGeo,
    // Low roughness + high metalness reads as mirror-water — the current engine
    // shows moving traced reflections most clearly on near-specular surfaces.
    new THREE.MeshStandardMaterial({ color: 0x2a6f97, roughness: 0.1, metalness: 0.8 })
  );
  water.rotation.x = -Math.PI / 2; // lie flat: local +z displacement -> world height
  water.position.set(-4.6, 0.35, -5.4);
  water.userData.rtDeforming = true; // opt in to per-frame live-geometry reads
  scene.add(water);
  // A slim stone kerb so the pool reads as built, not painted on the floor.
  const kerbMat = new THREE.MeshStandardMaterial({ color: 0x8a8478, roughness: 0.7 });
  for (const [w, d, dx, dz] of [
    [5.9, 0.2, 0, 2.85],
    [5.9, 0.2, 0, -2.85],
    [0.2, 5.5, 2.85, 0],
    [0.2, 5.5, -2.85, 0],
  ]) {
    const kerb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, d), kerbMat);
    kerb.position.set(-4.6 + dx, 0.25, -5.4 + dz);
    scene.add(kerb);
  }

  // Cache the flat rest positions (x, y; z is the wave height we overwrite).
  const waterPos = waterGeo.getAttribute("position");
  const waterRestX = Float32Array.from({ length: waterPos.count }, (_, i) => waterPos.getX(i));
  const waterRestY = Float32Array.from({ length: waterPos.count }, (_, i) => waterPos.getY(i));
  // Sum of three travelling sine waves (a cheap Gerstner-ish height field). The
  // app OWNS normal correctness for deforming meshes: we call
  // computeVertexNormals() after moving the vertices so the traced shading and
  // reflections track the ripples (the raytracer just reads the result).
  const updateWater = (t) => {
    for (let i = 0; i < waterPos.count; i++) {
      const x = waterRestX[i];
      const y = waterRestY[i];
      const z =
        0.10 * Math.sin(x * 1.1 + t * 1.3) +
        0.06 * Math.sin(y * 1.7 - t * 0.9) +
        0.05 * Math.sin((x + y) * 0.9 + t * 2.1);
      waterPos.setZ(i, z);
    }
    waterPos.needsUpdate = true;      // also refreshes the rasterized G-buffer
    waterGeo.computeVertexNormals();  // required: deforming meshes must supply normals
  };

  // --- emissive: the gallery light + corner strips (NEE area lights) ------
  // The wide panel is the room's key area light, hung over the pool; two cool
  // vertical strips in the back corners give the walls a designed cove glow
  // and the glossy floor something to streak.
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(5.0, 1.4, 0.1),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xfff2d8,
      emissiveIntensity: 5.5,
    })
  );
  panel.position.set(-3.6, 3.3, -8.85);
  scene.add(panel);

  for (const x of [-8.78, 8.78]) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 5.2, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xa8d4ff,
        emissiveIntensity: 3.2,
      })
    );
    strip.position.set(x, 2.8, -8.78);
    scene.add(strip);
  }

  // --- analytic lights -----------------------------------------------------
  // The demo starts MINIMAL (warm key light only) — everything else is an
  // opt-in add-on so its frame cost is visible.
  const warm = new THREE.PointLight(0xffd9a0, 16);
  warm.position.set(-2.6, 6.0, 3.4);
  warm.userData.rtRadius = 0.35;
  scene.add(warm);

  const cool = new THREE.PointLight(0x9fc4ff, 11);
  cool.position.set(5.2, 5.6, -4.4); // in front of and above the roughness ramp
  cool.userData.rtRadius = 0.3;
  cool.visible = false;
  scene.add(cool);

  // Spotlight raking the helmet: cone + penumbra + a visor glint, and a
  // visible shaft when volumetric fog is on.
  const spot = new THREE.SpotLight(0xfff4e0, 45, 0, 0.5, 0.45);
  spot.position.set(3.4, 6.6, -2.2);
  spot.target.position.copy(HELMET_POS);
  spot.userData.rtRadius = 0.3;
  spot.visible = false;
  scene.add(spot);
  scene.add(spot.target);

  // Orbiting ceiling light — shows moving ray traced shadows sweeping the room.
  const orbit = new THREE.PointLight(0xfff0dd, 13);
  orbit.position.set(4.5, 6.2, 0);
  orbit.userData.rtRadius = 0.28;
  orbit.visible = false;
  scene.add(orbit);

  // Fair raster comparison: when ray tracing is toggled off, the demo enables
  // shadow maps — flag everything now so that path just works.
  for (const l of [warm, cool, spot, orbit]) {
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.004;
  }
  scene.traverse((o) => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });

  // Light descriptors for the UI (label + whether to show a colour swatch).
  const lights = [
    { label: "warm light", light: warm, color: true },
    { label: "cool light", light: cool, color: true },
    { label: "spot light", light: spot, color: true },
    { label: "orbit light", light: orbit, color: true },
  ];

  // No procedural sky indoors — a low ambient fills GI rays that escape the room.
  const sky = { enabled: false };

  const ready = (async () => {
    const loader = new GLTFLoader();
    const load = (url) =>
      new Promise((res, rej) => loader.load(url, res, undefined, rej));
    const [helmet, duck] = await Promise.all([load(helmetUrl), load(duckUrl)]);

    helmet.scene.scale.setScalar(1.4);
    helmet.scene.position.copy(HELMET_POS);
    helmet.scene.rotation.y = 0.35;
    scene.add(helmet.scene);

    duck.scene.scale.setScalar(0.75);
    duck.scene.position.set(-5.6, 0.7, 4.0); // on the vitrine plinth
    duck.scene.rotation.y = -0.5;
    scene.add(duck.scene);
  })();

  return {
    scene, camera, bounds, lights, sky, ready,
    // The CPU-deformed water pool: its mesh joins the dynamic set and
    // updateWater(t) is called each frame before rt.updateDynamic().
    water: { mesh: water, update: updateWater },
    // Objects the demo shows/hides as their RT feature is toggled.
    showcase: { mirror, mirrorPed, glass, glassPed, panel, orbit, paneBlue, paneAmber },
  };
}
