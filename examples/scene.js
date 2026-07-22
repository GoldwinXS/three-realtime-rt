import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";

import helmetUrl from "./assets/DamagedHelmet.glb?url";
import duckUrl from "./assets/Duck.glb?url";

// The animated hero: Khronos' Fox, a skinned/rigged glTF. Streamed from its
// canonical host (same pattern the gallery uses) rather than committed.
const foxUrl =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Fox/glTF-Binary/Fox.glb";

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
  camera.position.set(4.5, 4.2, 11.0);

  const bounds = { x: 12, z: 7, wallH: 7, floorY: 0 };

  // Room shell — thin boxes. Saturated side walls so colour bleed is obvious;
  // the floor keeps a mild sheen so the GGX pass picks up the emissive strips.
  const white = new THREE.MeshStandardMaterial({ color: 0xc4c4c4, roughness: 0.6 });
  const backGrey = new THREE.MeshStandardMaterial({ color: 0xb9b3ac, roughness: 0.85 });
  const red = new THREE.MeshStandardMaterial({ color: 0xc42f2a, roughness: 0.85 });
  const teal = new THREE.MeshStandardMaterial({ color: 0x22808f, roughness: 0.8 });

  // Panoramic gallery: wider than deep, exhibits stationed left-to-right along
  // the back band so the natural move is to PAN along the frieze; the open
  // front half is the physics floor (pile drops there).
  const ground = new THREE.Mesh(new THREE.BoxGeometry(24, 0.2, 14), white);
  ground.position.y = -0.1;
  scene.add(ground);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 7, 0.2), backGrey);
  backWall.position.set(0, 3.5, -7);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 14), red);
  leftWall.position.set(-12, 3.5, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 14), teal);
  rightWall.position.set(12, 3.5, 0);
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
  const HELMET_POS = new THREE.Vector3(-0.6, 2.6, -4.2);
  pedestal(HELMET_POS.x, HELMET_POS.z, 1.6);

  // --- mid-left: gold knot (traced reflections + glints on metal) --------
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.23, 140, 20),
    // metalness just under 1: the traced reflection still dominates, but a
    // sliver of diffuse keeps a warm gold base even where the reflection ray
    // finds the dark open ceiling — full metal read as mottled camo there.
    new THREE.MeshStandardMaterial({ color: 0xd4af6a, roughness: 0.28, metalness: 0.85 })
  );
  pedestal(1.4, -0.8, 0.8);
  knot.position.set(1.4, 1.7, -0.8);
  scene.add(knot);

  // --- back-right: glossy cream teapot against the teal wall (GGX star) ---
  const teapot = new THREE.Mesh(
    new TeapotGeometry(0.8, 10),
    new THREE.MeshStandardMaterial({ color: 0xe4dccd, roughness: 0.12, metalness: 0.0 })
  );
  pedestal(10.2, -1.5);
  teapot.position.set(10.2, 1.75, -1.5);
  scene.add(teapot);

  // --- back wall, right half: the MATERIALS bench --------------------------
  // Six IDENTICAL spheres on one long bench, seen straight-on from the default
  // camera — a single curated exhibit of the whole material model. Left to
  // right: a dielectric roughness trio (0.05 / 0.35 / 0.75 — the GGX highlight
  // visibly broadens and dims), then chrome (traced mirror reflection), gold
  // (albedo-tinted metal), and solid glass (two-interface refraction). The
  // "reflections" / "refraction" toggles transform the last three IN PLACE —
  // no props popping in and out of the room.
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(8.0, 0.5, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x9aa1ab, roughness: 0.5 })
  );
  bench.position.set(5.4, 0.25, -6.2);
  scene.add(bench);
  const gamut = [
    new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.05, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.35, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.75, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: 0xf2f4f8, roughness: 0.05, metalness: 1.0 }),
    new THREE.MeshStandardMaterial({ color: 0xd4af6a, roughness: 0.25, metalness: 1.0 }),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.02,
      metalness: 0.0,
      transmission: 1.0,
      ior: 1.5,
    }),
  ];
  for (let i = 0; i < gamut.length; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.45, 40, 28), gamut[i]);
    s.position.set(2.3 + i * 1.25, 0.95, -6.2);
    scene.add(s);
  }

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
  plinth.position.set(-4.8, 0.35, 0.8);
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
  vitrine.position.set(-4.8, 1.55, 0.8);
  scene.add(vitrine);

  // --- glass "paintings": tinted panes hung on the side walls -------------
  // Each floats 0.45m proud of its wall like gallery art. The straight-through
  // trace hits the saturated wall right behind, so they read as BACKLIT STAINED
  // GLASS — amber over teal goes warm olive, blue over red goes violet — and
  // because transparent surfaces cast no shadow, there is no dark rectangle
  // behind them spoiling the lightbox illusion.
  const paneAmber = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 2.1, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0xff9a5c,
      roughness: 0.3,
      transparent: true,
      opacity: 0.45,
    })
  );
  paneAmber.position.set(11.45, 2.3, 0.2);
  paneAmber.rotation.y = -Math.PI / 2;
  scene.add(paneAmber);

  const paneBlue = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 2.1, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x6fb4ff,
      roughness: 0.3,
      transparent: true,
      opacity: 0.3,
    })
  );
  paneBlue.position.set(-11.45, 2.3, 1.2);
  paneBlue.rotation.y = Math.PI / 2;
  scene.add(paneBlue);

  // Bronze frames turn the panes into hung artwork. The frames are OPAQUE, so
  // unlike the glass they sit in the BVH and ground the pieces with a real
  // contact shadow on the wall.
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x3a3128,
    roughness: 0.4,
    metalness: 0.6,
  });
  const framePiece = (w, h, d, x, y, z) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
    f.position.set(x, y, z);
    scene.add(f);
  };
  for (const [wx, z0] of [
    [-11.5, 1.2],
    [11.5, 0.2],
  ]) {
    framePiece(0.12, 0.12, 3.24, wx, 2.3 + 1.11, z0); // top rail
    framePiece(0.12, 0.12, 3.24, wx, 2.3 - 1.11, z0); // bottom rail
    framePiece(0.12, 2.34, 0.12, wx, 2.3, z0 + 1.56); // stiles
    framePiece(0.12, 2.34, 0.12, wx, 2.3, z0 - 1.56);
  }

  // --- front-right: the animated fox (skinned dynamic BVH) ----------------
  // A low granite platform in the open front-right floor, clear of the pile pad
  // (2.6, 2.4), the bench, and the teapot. The Fox (loaded async below) trots on
  // top; its skeleton is CPU-skinned into the dynamic BVH every frame, so the
  // warm/cool lights cast a traced shadow that moves with the gait.
  const FOX_POS = new THREE.Vector3(6.5, 0.3, 2.8);
  const foxPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.3, 2.0),
    new THREE.MeshStandardMaterial({ color: 0x6f747c, roughness: 0.6 })
  );
  foxPlatform.position.set(FOX_POS.x, 0.15, FOX_POS.z);
  scene.add(foxPlatform);

  // Handle returned to the demo; populated once the glTF resolves in `ready`.
  // `meshes` are the SkinnedMesh instances handed to the dynamic set;
  // update(dt) advances the gait and poses the skeleton for the tracer.
  const fox = { root: null, mixer: null, meshes: [], update: () => {} };

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
  water.position.set(-7.5, 0.35, -3.6);
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
    kerb.position.set(-7.5 + dx, 0.25, -3.6 + dz);
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

  // --- emissive: clerestory windows + corner strips (NEE area lights) -----
  // A row of six "daylight" windows high on the back wall — each is an
  // emissive pane the raytracer samples as a true area light. The demo's
  // windows slider shows/hides them (emissive lights are baked at compile, so
  // each change recompiles — a deliberate, visible cost). Three start open;
  // the first hangs over the pool so the water always has a glow to ripple.
  const windows = [];
  for (let i = 0; i < 6; i++) {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 2.1, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xeaf2ff,
        emissiveIntensity: 7,
      })
    );
    win.position.set(-8.75 + i * 3.5, 4.1, -6.85);
    win.visible = i < 3;
    scene.add(win);
    windows.push(win);
  }

  for (const x of [-11.78, 11.78]) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 5.2, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xa8d4ff,
        emissiveIntensity: 4.5,
      })
    );
    strip.position.set(x, 2.8, -6.78);
    scene.add(strip);
  }

  // --- analytic lights -----------------------------------------------------
  // The demo starts MINIMAL (warm key light only) — everything else is an
  // opt-in add-on so its frame cost is visible.
  // The wide room needs two default keys: warm carries the left half (pool /
  // vitrine), cool carries the right (bench / teapot). Everything else stays
  // an opt-in add-on.
  const warm = new THREE.PointLight(0xffd9a0, 30);
  warm.position.set(-4.5, 6.2, 2.8);
  warm.userData.rtRadius = 0.4;
  scene.add(warm);

  const cool = new THREE.PointLight(0x9fc4ff, 22);
  cool.position.set(5.5, 5.8, -2.6); // in front of and above the roughness ramp
  cool.userData.rtRadius = 0.35;
  scene.add(cool);

  // Spotlight raking the helmet: cone + penumbra + a visor glint, and a
  // visible shaft when volumetric fog is on.
  const spot = new THREE.SpotLight(0xfff4e0, 45, 0, 0.5, 0.45);
  spot.position.set(2.6, 6.6, -0.6);
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
    duck.scene.position.set(-4.8, 0.7, 0.8); // on the vitrine plinth
    duck.scene.rotation.y = -0.5;
    scene.add(duck.scene);

    // The Fox: a skinned/rigged glTF with "Survey", "Walk" and "Run" clips.
    const foxGltf = await load(foxUrl);
    const root = foxGltf.scene;
    // Fox is authored ~100 units long — normalize its longest axis to ~1.5m.
    const box = new THREE.Box3().setFromObject(root);
    const span = box.getSize(new THREE.Vector3());
    root.scale.setScalar(1.5 / Math.max(span.x, span.y, span.z));
    // Re-measure after scaling to seat it exactly on the platform top (y=0.3).
    box.setFromObject(root);
    root.position.set(FOX_POS.x, FOX_POS.y - box.min.y, FOX_POS.z);
    root.rotation.y = -Math.PI / 2.5; // quarter onto the camera so the gait reads
    root.traverse((o) => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    scene.add(root);

    // Collect the SkinnedMesh instances for the dynamic set (auto-detected as
    // skinned by compileScene via isSkinnedMesh — no userData flag needed).
    const skinnedMeshes = [];
    root.traverse((o) => { if (o.isSkinnedMesh) skinnedMeshes.push(o); });
    // Fox.glb ships WITHOUT a normal attribute, so the rasterized G-buffer would
    // get a zero (NaN once normalized) normal and shade the fox black. Compute
    // bind-pose normals so the G-buffer skinning has something to skin (the BVH
    // path derives its own per-face normals from the skinned positions, so it was
    // never affected).
    for (const m of skinnedMeshes) {
      if (!m.geometry.getAttribute("normal")) m.geometry.computeVertexNormals();
    }

    const mixer = new THREE.AnimationMixer(root);
    const clip =
      THREE.AnimationClip.findByName(foxGltf.animations, "Run") ||
      THREE.AnimationClip.findByName(foxGltf.animations, "Walk") ||
      foxGltf.animations[0];
    if (clip) mixer.clipAction(clip).play();

    fox.root = root;
    fox.mixer = mixer;
    fox.meshes = skinnedMeshes;
    // Advance the gait, then propagate the animated bone poses into world
    // matrices NOW (updateMatrixWorld with force) so the CPU skinning in
    // updateDynamic() — which reads bone.matrixWorld — matches this frame's
    // raster. Without this the traced shadow would lag the fox by one frame.
    fox.update = (dt) => {
      mixer.update(dt);
      root.updateMatrixWorld(true);
    };
  })();

  return {
    scene, camera, bounds, lights, sky, ready,
    // The CPU-deformed water pool: its mesh joins the dynamic set and
    // updateWater(t) is called each frame before rt.updateDynamic().
    water: { mesh: water, update: updateWater },
    // The animated Fox (skinned): its SkinnedMesh(es) join the dynamic set and
    // fox.update(dt) advances/poses it each frame before rt.updateDynamic().
    fox,
    // The clerestory windows (emissive panes) driven by the demo's slider.
    windows,
    // Feature-linked scene objects the demo may want handles to.
    showcase: { orbit, paneBlue, paneAmber },
  };
}
