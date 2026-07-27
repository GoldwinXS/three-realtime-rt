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
 * An indoor gallery: a Cornell-style room (24 x 14, saturated side walls, open
 * top) laid out as a museum with named ZONES, so panning left-to-right walks a
 * visitor past one staged vignette per renderer feature:
 *
 *   back-left     water pool + stone kerbs under the clerestory windows
 *                 (deforming BVH, moving traced reflections of the glow)
 *   back-centre   DamagedHelmet hero pedestal under its own spotlight
 *                 (normal/roughness maps + analytic-light glints)
 *   back-right    MATERIALS GALLERY — the six-sphere bench (roughness trio,
 *                 chrome, gold, diamond-ior glass), the vertex-painted
 *                 icosahedron, the gold torus knot and the glossy teapot:
 *                 every "look at the surface" piece in one corner
 *   left wall     GLASS WING — the blue alpha pane (out-of-BVH blend trick)
 *                 beside "Sunset", the backlit cast-glass relief (real
 *                 Beer-Lambert absorption). Same subject, two techniques.
 *   centre stage  "Lumiere" — a freestanding stained-glass screen on bronze
 *                 legs with its own projector spotlight. The beam crosses nine
 *                 absorbing tiles and lands on the open floor: a plain dark
 *                 shadow with coloured shadows off, a multicolour light quilt
 *                 with them on. Hidden until the "tinted glass" toggle.
 *   front-left    the duck in a museum vitrine (alpha-blend glass, casts no
 *                 shadow onto its own exhibit) + the emissive OPEN sign, and
 *                 "Alabaster": a reading lamp whose cast-stone shade is lit
 *                 from outside by the room and from inside by its own bulb,
 *                 beside two spheres that differ only in whether they scatter.
 *                 Hidden until the "scattering (Kubelka-Munk)" toggle.
 *   front-right   DYNAMICS CORNER — the skinned fox on its platform and the
 *                 physics drop pad, the two things in the room that move
 *   right wall    the amber alpha pane, hung to mirror the blue one
 *
 * Every object rests on something: plinths and legs reach the floor, exhibits
 * are seated on their pedestal tops, and the wall-hung frames stand off the
 * wall on visible bronze pegs. Nothing floats.
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
  // Museum bronze: every frame, standoff peg, muntin, leg and stand in the room
  // is made of this, so the hardware reads as one commissioned set.
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x3a3128,
    roughness: 0.4,
    metalness: 0.6,
  });

  // Panoramic gallery: wider than deep, exhibits stationed left-to-right along
  // the back band so the natural move is to PAN along the frieze; the open
  // front half is the physics floor (pile drops there).
  const ground = new THREE.Mesh(new THREE.BoxGeometry(24, 0.2, 14), white);
  ground.position.y = -0.1;
  ground.name = "floor";
  scene.add(ground);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 7, 0.2), backGrey);
  backWall.position.set(0, 3.5, -7);
  backWall.name = "wall-back";
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 14), red);
  leftWall.position.set(-12, 3.5, 0);
  leftWall.name = "wall-left-red";
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 14), teal);
  rightWall.position.set(12, 3.5, 0);
  rightWall.name = "wall-right-teal";
  scene.add(rightWall);

  // Every plinth is a real cylinder standing ON the floor (bottom face at y=0)
  // and reports its own top height, which is what exhibits are seated against.
  function pedestal(name, x, z, height = 1.0, radius = 0.9) {
    const p = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 1.15, height, 24),
      new THREE.MeshStandardMaterial({ color: 0x777d88, roughness: 0.55 })
    );
    p.position.set(x, height / 2, z);
    p.name = name;
    p.userData.museumTop = height; // read by the contact audit
    scene.add(p);
    return p;
  }

  // Seat a mesh ON a support surface: measure its real bounding box (geometry
  // may be centred, bottom-origin or anything in between — TeapotGeometry and
  // TorusKnotGeometry disagree) and translate it so bbox.min.y lands exactly on
  // `topY`. This is what makes the "nothing floats" rule mechanical rather than
  // a hand-tuned constant per prop.
  const seatOn = (obj, topY) => {
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj);
    obj.position.y += topY - box.min.y;
    obj.updateMatrixWorld(true);
    return obj;
  };

  // --- back-centre: helmet hero pedestal (loaded async below) ------------
  // Placed at the water's edge so the pool catches its reflection; its own
  // spotlight (toggleable) rakes it from the front-right for map detail +
  // an analytic glint on the visor.
  const HELMET_POS = new THREE.Vector3(-0.6, 2.6, -4.2);
  const helmetPlinth = pedestal("pedestal-helmet", HELMET_POS.x, HELMET_POS.z, 1.6);

  // --- back-right (MATERIALS GALLERY): gold knot ---------------------------
  // Moved off the open centre floor (it used to stand at 1.4, -0.8, right where
  // the Lumiere projection now lands) into the surfaces corner beside the
  // teapot. Its plinth is helmet-height so the knot rises clear of the
  // six-sphere bench behind it instead of cutting across the line-up.
  // x is 9.0 rather than the 8.2 the layout first used: measured in NDC from the
  // default camera, a plinth at 8.2 sits exactly on the bench's sixth sphere
  // (the diamond-ior glass one) and hides it completely. At 9.0 the column
  // clips only the sphere's right quarter, and the knot itself is open enough to
  // see through. Further right than this and it starts eating the teapot.
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.23, 140, 20),
    // metalness just under 1: the traced reflection still dominates, but a
    // sliver of diffuse keeps a warm gold base even where the reflection ray
    // finds the dark open ceiling — full metal read as mottled camo there.
    new THREE.MeshStandardMaterial({ color: 0xd4af6a, roughness: 0.28, metalness: 0.85 })
  );
  knot.name = "knot-gold";
  pedestal("pedestal-knot", 9.0, -4.2, 1.5, 0.75);
  knot.position.set(9.0, 0, -4.2);
  seatOn(knot, 1.5);
  scene.add(knot);

  // --- back-right (MATERIALS GALLERY): glossy cream teapot (GGX star) ------
  const teapot = new THREE.Mesh(
    new TeapotGeometry(0.8, 10),
    new THREE.MeshStandardMaterial({ color: 0xe4dccd, roughness: 0.12, metalness: 0.0 })
  );
  teapot.name = "teapot";
  pedestal("pedestal-teapot", 9.7, -1.5);
  teapot.position.set(9.7, 0, -1.5);
  // Spout points +x by default — straight into the teal wall from this spot.
  // Turn it to face back-left into the room (profile view from the camera),
  // and keep half a metre of air between the handle and the amber painting.
  teapot.rotation.y = 2.3;
  seatOn(teapot, 1.0);
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
  bench.name = "bench-materials";
  bench.userData.museumTop = 0.5;
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
      // Diamond IOR (2.42) — carried PER MATERIAL now, not the global rt.ior.
      // The G-buffer clamps it into the packed word's [1, 1.98] range, so it
      // refracts markedly harder than the old global 1.5 (visible with the
      // "refraction" toggle on).
      ior: 2.42,
    }),
  ];
  for (let i = 0; i < gamut.length; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.45, 40, 28), gamut[i]);
    s.position.set(2.3 + i * 1.25, 0.95, -6.2); // 0.45 radius on the 0.5 bench top
    s.name = `bench-sphere-${i}`;
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
  plinth.name = "plinth-vitrine";
  plinth.userData.museumTop = 0.7;
  scene.add(plinth);
  const vitrine = new THREE.Group();
  vitrine.name = "vitrine";
  const paneGeoSide = new THREE.BoxGeometry(1.56, 1.7, 0.04);
  let vi = 0;
  for (const [dx, dz, ry] of [
    [0, 0.76, 0],
    [0, -0.76, 0],
    [0.76, 0, Math.PI / 2],
    [-0.76, 0, Math.PI / 2],
  ]) {
    const pane = new THREE.Mesh(paneGeoSide, vitrineGlass);
    pane.position.set(dx, 0, dz);
    pane.rotation.y = ry;
    pane.name = `vitrine-pane-${vi++}`;
    vitrine.add(pane);
  }
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.04, 1.56), vitrineGlass);
  lid.position.y = 0.87; // panes end at +0.85 — the lid rests on them
  lid.name = "vitrine-lid";
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
  // Mounted flush to the UNDERSIDE of the lid (lid bottom = +0.85, puck is 0.04
  // thick) — a case light screwed to the roof, not a slab hovering inside.
  puck.position.y = 0.83;
  puck.name = "vitrine-puck";
  vitrine.add(puck);
  vitrine.position.set(-4.8, 1.55, 0.8);
  scene.add(vitrine);

  // --- front-left: a textured EMISSIVE sign beside the vitrine ------------
  // A small "OPEN" sign whose glow comes from an emissiveMap generated on a
  // canvas (no binary asset). The map's per-pixel pattern shows in the G-buffer
  // (the sign LOOKS like lettering), and its AVERAGE colour — greenish here —
  // now also CASTS light: the raytracer approximates a textured emitter by
  // avg(map) x emissive x emissiveIntensity, so the white floor in front of the
  // sign picks up its green-cyan spill. (Emitters need a non-black `emissive`;
  // white keeps the cast hue equal to the map average.)
  const signCanvas = document.createElement("canvas");
  signCanvas.width = 128;
  signCanvas.height = 64;
  {
    const g = signCanvas.getContext("2d");
    g.fillStyle = "#03130d"; // near-black green ground
    g.fillRect(0, 0, 128, 64);
    g.fillStyle = "#25e0ff"; // cyan rails top and bottom
    g.fillRect(0, 3, 128, 5);
    g.fillRect(0, 56, 128, 5);
    g.fillStyle = "#28ff9a"; // bright green lettering
    g.font = "bold 34px monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("OPEN", 64, 33);
  }
  const signTex = new THREE.CanvasTexture(signCanvas);
  signTex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.95, 0.48),
    new THREE.MeshStandardMaterial({
      color: 0x040404,
      emissive: 0xffffff,
      emissiveMap: signTex,
      emissiveIntensity: 7,
      roughness: 1,
      side: THREE.DoubleSide,
    })
  );
  sign.name = "sign-open";
  sign.position.set(-3.2, 0.72, 1.95); // front-right of the vitrine
  sign.rotation.y = 0.55;              // angled toward the camera / open floor
  scene.add(sign);
  // …carried by a real bronze stand. The panel used to hang in mid-air at
  // y=0.48–0.96 with nothing under it; now a sled foot on the floor and a post
  // reach up to its bottom edge (post top 0.50 vs panel bottom 0.48).
  const signStand = new THREE.Group();
  signStand.name = "sign-stand";
  signStand.position.set(-3.2, 0, 1.95);
  signStand.rotation.y = 0.55;
  const signFoot = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.06, 0.3), frameMat);
  signFoot.position.y = 0.03; // bottom face on the floor
  signFoot.name = "sign-stand-foot";
  signStand.add(signFoot);
  const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.44, 0.08), frameMat);
  signPost.position.y = 0.28; // 0.06 → 0.50, into the panel's bottom edge
  signPost.name = "sign-stand-post";
  signStand.add(signPost);
  scene.add(signStand);

  // --- back-right (MATERIALS GALLERY): vertex-painted icosahedron ---------
  // Moved out of the front-left corner (it used to stand at -8.5, 2.5, alone in
  // the vitrine's zone) to a plinth tucked against the back wall between the
  // helmet and the materials bench, so all four "read the surface" exhibits now
  // share one corner. Its x is 0.65 rather than the bench's shoulder at 1.4:
  // the plinth base is 0.67 across, which needs the clearance.
  // Its albedo comes entirely from a baked per-vertex `color` attribute (no
  // texture, no map): the hue sweeps with height so the whole form carries a
  // smooth gradient. Demonstrates geometry vertex colours multiplying into the
  // G-buffer albedo. (Secondary GI/reflection rays see the flat material colour —
  // the same documented caveat as texture maps.)
  const icoGeo = new THREE.IcosahedronGeometry(0.85, 1);
  const icoPos = icoGeo.getAttribute("position");
  const icoColors = new Float32Array(icoPos.count * 3);
  const icoBox = new THREE.Box3().setFromBufferAttribute(icoPos);
  const icoTmp = new THREE.Color();
  const spanY = Math.max(icoBox.max.y - icoBox.min.y, 1e-6);
  for (let i = 0; i < icoPos.count; i++) {
    const h = (icoPos.getY(i) - icoBox.min.y) / spanY; // 0 at bottom, 1 at top
    icoTmp.setHSL(0.62 * h, 0.72, 0.55); // violet base → cyan/green crown
    icoColors[i * 3] = icoTmp.r;
    icoColors[i * 3 + 1] = icoTmp.g;
    icoColors[i * 3 + 2] = icoTmp.b;
  }
  icoGeo.setAttribute("color", new THREE.BufferAttribute(icoColors, 3));
  const ico = new THREE.Mesh(
    icoGeo,
    // vertexColors:true so the RASTER fallback (RT off) also shows the gradient;
    // the ray traced G-buffer reads the color attribute regardless of this flag.
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.0 })
  );
  ico.name = "icosahedron-vertexcolor";
  pedestal("pedestal-ico", 0.65, -5.85, 1.05, 0.58);
  ico.position.set(0.65, 0, -5.85);
  seatOn(ico, 1.05);
  scene.add(ico);

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
  paneAmber.name = "pane-amber";
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
  paneBlue.name = "pane-blue";
  scene.add(paneBlue);

  // Bronze frames turn the panes into hung artwork. The frames are OPAQUE, so
  // unlike the glass they sit in the BVH and ground the pieces with a real
  // contact shadow on the wall.
  const framePiece = (name, w, h, d, x, y, z) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
    f.position.set(x, y, z);
    f.name = name;
    scene.add(f);
    return f;
  };
  // …and STANDOFF PEGS carry the frames back to the wall. Both pieces hang 0.45m
  // proud of their wall (that gap is what makes them read as backlit stained
  // glass rather than paint), which previously left them hovering with no
  // visible support. Four short bronze pegs per piece bridge the 0.34m from the
  // frame's back face to the wall face — the same trick a real gallery uses for
  // a floating-mount panel, and now the shadow they cast on the saturated wall
  // reads as hardware instead of magic.
  for (const [wx, z0, side] of [
    [-11.5, 1.2, "blue"],
    [11.5, 0.2, "amber"],
  ]) {
    framePiece(`frame-${side}-top`, 0.12, 0.12, 3.24, wx, 2.3 + 1.11, z0);
    framePiece(`frame-${side}-bottom`, 0.12, 0.12, 3.24, wx, 2.3 - 1.11, z0);
    framePiece(`frame-${side}-stile-a`, 0.12, 2.34, 0.12, wx, 2.3, z0 + 1.56);
    framePiece(`frame-${side}-stile-b`, 0.12, 2.34, 0.12, wx, 2.3, z0 - 1.56);
    // frame back face -> wall inner face (|11.9| - |11.56| = 0.34). The pegs sit
    // on the STILES, two per side, rather than behind the rails: a peg hidden
    // behind the rail it supports is a peg nobody ever sees, and the point of
    // the mount is that the viewer can tell what holds the panel up. On the
    // stiles they clear the frame's silhouette from any oblique view along the
    // wall, and they cast their own little shadows onto the saturated wall.
    const inward = Math.sign(wx);            // -1 on the red wall, +1 on the teal
    const pegX = wx + inward * (0.06 + 0.17); // centre of the 0.34 bridge
    let pi = 0;
    for (const dz of [1.56, -1.56]) {
      for (const dy of [0.6, -0.6]) {
        framePiece(`peg-${side}-${pi++}`, 0.34, 0.1, 0.1, pegX, 2.3 + dy, z0 + dz);
      }
    }
  }

  // --- red wall, beside the blue pane: "Sunset" — backlit cast-glass relief --
  // The Beer-Lambert absorption showcase (the demo's "tinted glass" toggle),
  // hung on the red wall next to the blue alpha pane — a deliberate pairing:
  // the pane is the out-of-BVH blend trick, this is REAL refractive glass, and
  // side by side the difference reads. A shadow-box on the wall: a warm
  // emissive panel in the back, and in front of it a grid of chunky cast-glass
  // blocks (transmission 1, in the BVH).
  // Each block carries attenuationColor + attenuationDistance, so the view path
  // through it is attenuated exp(-sigma * thickness) per channel: the SAME
  // amber glass reads pale at 10cm and deep burnt-orange at 24cm, the sun block
  // is 30cm of red, and the backlight comes through tinted because the glow
  // rides the refracted view segment. Thickness IS the palette — that is the
  // one thing a flat surface tint cannot fake, and why the blocks are chunky
  // (they also must out-thick the tracer's entry offset, 2 x rt.eps ~ 7cm in a
  // room this size). Thin bright joints between blocks show the raw backlight
  // for contrast, like leading in reverse.
  //
  // Everything here starts INVISIBLE: the piece appears with the panel's
  // "tinted glass" toggle, and while it is hidden no compiled material absorbs,
  // so the lighting megakernel keeps its byte-identical no-absorption program —
  // flipping the toggle IS the feature's cost A/B (watch the fps readout).
  const tintedArt = new THREE.Group();
  tintedArt.name = "tinted-art";
  // Red wall (x = -12, inner face -11.9), 2 cm proud so the backlight plane
  // never fights the wall face; z = -2.2 leaves a 0.9 m hang gap to the blue
  // pane's frame (its stile ends at z = -0.36) and keeps the piece above the
  // pool sightline. Rotated to face into the room (+x).
  tintedArt.position.set(-11.88, 2.35, -2.2);
  tintedArt.rotation.y = Math.PI / 2;
  const castGlass = (hex, attHex, attDist) =>
    new THREE.MeshPhysicalMaterial({
      color: hex,             // albedo fallback (secondary rays, refraction off)
      roughness: 0.06,
      metalness: 0,
      transmission: 1.0,
      ior: 1.5,
      attenuationColor: new THREE.Color(attHex),
      attenuationDistance: attDist, // world units (metres)
    });
  const amberGlass = castGlass(0xffb36b, 0xffa14f, 0.12);
  const redGlass = castGlass(0xff7a6a, 0xff2919, 0.15);
  const blueGlass = castGlass(0x9cc4ff, 0x59a6ff, 0.12);
  // Backlight: a two-triangle emissive plane (cheap in the shared 256-tri NEE
  // budget) forming the BACK PANEL of the box — the glass blocks are mounted
  // directly onto it (6mm of clearance, enough that the coplanar faces never
  // z-fight, close enough that the relief is carried by the panel rather than
  // hovering in front of it). Mostly covered by the blocks, so its direct NEE
  // cast into the room is just a soft rim through the joints.
  const backlight = new THREE.Mesh(
    new THREE.PlaneGeometry(1.62, 1.16),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffedd8,
      emissiveIntensity: 6,
      roughness: 1,
    })
  );
  backlight.name = "tinted-art-backlight";
  tintedArt.add(backlight);
  // The relief grid: 4 columns x 4 rows, backs seated on the backlight panel,
  // fronts protruding by thickness. [material, thickness].
  const AMB = (t) => [amberGlass, t];
  const RED = (t) => [redGlass, t];
  const BLU = (t) => [blueGlass, t];
  const gridRows = [
    // y-centre, height, cells (one per column)
    [0.395, 0.30, [AMB(0.10), AMB(0.10), AMB(0.10), AMB(0.10)]], // pale sky
    [0.08, 0.30, [AMB(0.16), AMB(0.16), RED(0.30), AMB(0.16)]],  // sky + the sun
    [-0.185, 0.22, [AMB(0.24), AMB(0.24), RED(0.16), AMB(0.24)]], // horizon + glitter
    [-0.38, 0.16, [BLU(0.12), BLU(0.22), BLU(0.12), BLU(0.22)]], // the lake
  ];
  const colX = [-0.59, -0.2, 0.2, 0.59];
  const COL_W = 0.375; // 0.015 joints between 0.39 columns
  let gi = 0;
  for (const [cy, ch, cells] of gridRows) {
    cells.forEach(([mat, t], i) => {
      const block = new THREE.Mesh(new THREE.BoxGeometry(COL_W, ch - 0.015, t), mat);
      block.position.set(colX[i], cy, 0.006 + t / 2); // back face 6mm off the panel
      block.name = `tinted-art-glass-${gi++}`;
      tintedArt.add(block);
    });
  }
  // Bronze shadow-box frame, deep enough to house the relief.
  // The carcass is 0.40 deep against a group origin sitting 0.02 off the wall
  // face, so its BACK edge (local z = -0.04) buries 2cm INTO the red wall: the
  // box is physically let into the wall like a real recessed vitrine, instead of
  // hovering in front of it. (The backlight plane keeps its 2cm standoff so it
  // never z-fights the wall.)
  const artFrame = (name, w, h, d, x, y, z) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
    f.position.set(x, y, z);
    f.name = name;
    tintedArt.add(f);
  };
  artFrame("tinted-art-rail-top", 1.9, 0.09, 0.4, 0, 0.645, 0.16);
  artFrame("tinted-art-rail-bottom", 1.9, 0.09, 0.4, 0, -0.645, 0.16);
  artFrame("tinted-art-stile-a", 0.09, 1.2, 0.4, -0.905, 0, 0.16);
  artFrame("tinted-art-stile-b", 0.09, 1.2, 0.4, 0.905, 0, 0.16);
  tintedArt.traverse((o) => (o.visible = false)); // revealed by "tinted glass"
  scene.add(tintedArt);

  // --- centre stage: "Lumiere" — freestanding stained-glass screen ---------
  // The room's new hero, and the showcase for COLOURED SHADOWS. A 2.6 x 2.2m
  // bronze screen standing on its own sled feet in the middle of the floor,
  // glazed with a 3x3 grid of REAL absorbing glass (MeshPhysicalMaterial,
  // transmission 1, kept OUT of `transparent` so it stays in the BVH). A
  // dedicated projector spotlight sits behind and above it and shines THROUGH
  // the tiles onto the open floor in front:
  //
  //   coloured shadows OFF -> the glass blocks the shadow ray: one flat dark
  //                           rectangle, exactly what a rasterizer draws
  //   coloured shadows ON  -> each shadow ray accumulates exp(-sigma*t) per
  //                           channel through whichever tile it crossed, so the
  //                           floor picks up a nine-panel LIGHT QUILT
  //
  // Thickness is the second variable: tiles run 3cm to 10cm, so the same hue
  // reads pale where the glass is thin and saturated where it is thick. The
  // centre row is >= 8cm so the VIEW path tints too (the tracer's entry offset
  // is 2 x rt.eps, ~7cm in a room this size — thinner tiles still cast properly
  // but may not visibly refract).
  //
  // Hidden at boot and revealed by the same "tinted glass" toggle as the Sunset
  // relief: one ensemble, one switch, and while it is hidden nothing in the
  // scene absorbs, so the megakernel keeps its byte-identical no-absorption
  // program.
  const lumiere = new THREE.Group();
  lumiere.name = "lumiere";
  lumiere.position.set(2.6, 0, -0.5); // local y = 0 IS the floor; faces +z
  const addLum = (name, mesh) => { mesh.name = name; lumiere.add(mesh); return mesh; };
  const bronze = (name, w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
    m.position.set(x, y, z);
    return addLum(name, m);
  };
  // Legs first: sled feet flat on the floor, posts up into the bottom rail. The
  // screen has to read as furniture that could actually stand there.
  for (const sx of [-1.05, 1.05]) {
    bronze(`lumiere-foot-${sx < 0 ? "l" : "r"}`, 0.22, 0.08, 0.9, sx, 0.04, 0);
    bronze(`lumiere-post-${sx < 0 ? "l" : "r"}`, 0.12, 0.25, 0.16, sx, 0.195, 0);
  }
  // Frame: outer 2.6 x 2.2, bottom edge at y = 0.25 (on the posts), top at 2.45.
  bronze("lumiere-rail-bottom", 2.6, 0.12, 0.16, 0, 0.31, 0);
  bronze("lumiere-rail-top", 2.6, 0.12, 0.16, 0, 2.39, 0);
  bronze("lumiere-stile-l", 0.12, 2.2, 0.16, -1.24, 1.35, 0);
  bronze("lumiere-stile-r", 0.12, 2.2, 0.16, 1.24, 1.35, 0);
  // Glazing field inside the frame: 2.36 x 1.96, three columns and three rows
  // separated by 6cm bronze muntins.
  const FIELD_W = 2.36, FIELD_H = 1.96, MUNTIN = 0.06;
  const FIELD_X0 = -1.18, FIELD_Y0 = 0.37;
  const TILE_W = (FIELD_W - 2 * MUNTIN) / 3;
  const TILE_H = (FIELD_H - 2 * MUNTIN) / 3;
  for (let c = 1; c <= 2; c++) {
    bronze(`lumiere-muntin-v${c}`, MUNTIN, FIELD_H, 0.14,
      FIELD_X0 + c * (TILE_W + MUNTIN) - MUNTIN / 2, 1.35, 0);
  }
  for (let r = 1; r <= 2; r++) {
    bronze(`lumiere-muntin-h${r}`, FIELD_W, MUNTIN, 0.14,
      0, FIELD_Y0 + r * (TILE_H + MUNTIN) - MUNTIN / 2, 0);
  }
  // Palette. attenuationDistance is the depth at which the transmitted colour
  // equals attenuationColor, so it is tuned AGAINST the tile thicknesses below:
  // roughly attDist ~ the thickness of the tiles that use it, which lands the
  // saturated tiles near their attenuation colour without crushing to black,
  // and leaves the thin ones a visible wash.
  const tileGlass = (hex, attHex, attDist) =>
    new THREE.MeshPhysicalMaterial({
      color: hex,           // albedo fallback for secondary rays / refraction off
      roughness: 0.04,
      metalness: 0,
      transmission: 1.0,    // NOT `transparent` — real refractive glass, in the BVH
      ior: 1.5,
      attenuationColor: new THREE.Color(attHex),
      attenuationDistance: attDist,
    });
  const RUBY = tileGlass(0xff6152, 0xff2418, 0.10);
  const COBALT = tileGlass(0x86b2ff, 0x2f6bff, 0.07);
  const AMBER2 = tileGlass(0xffc07a, 0xff9a2e, 0.07);
  const EMERALD = tileGlass(0x9fe8bc, 0x21c46a, 0.06);
  const CLEAR = tileGlass(0xeef4ff, 0xdce8ff, 0.14); // the control tile
  // [material, thickness] per cell, bottom row first. Centre row >= 8cm.
  const tiles = [
    [[EMERALD, 0.04], [RUBY, 0.06], [COBALT, 0.05]],
    [[RUBY, 0.10], [AMBER2, 0.09], [EMERALD, 0.08]],
    [[COBALT, 0.05], [CLEAR, 0.03], [AMBER2, 0.04]],
  ];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const [mat, t] = tiles[r][c];
      const tile = new THREE.Mesh(new THREE.BoxGeometry(TILE_W, TILE_H, t), mat);
      tile.position.set(
        FIELD_X0 + TILE_W / 2 + c * (TILE_W + MUNTIN),
        FIELD_Y0 + TILE_H / 2 + r * (TILE_H + MUNTIN),
        0
      );
      addLum(`lumiere-tile-r${r}c${c}`, tile);
    }
  }
  lumiere.traverse((o) => (o.visible = false)); // revealed by "tinted glass"
  scene.add(lumiere);

  // --- front-left: "Alabaster" — the scattering (Kubelka-Munk) exhibit ------
  // A reading lamp on a side table, and beside it two spheres that differ in
  // exactly one property. This is the SUBSURFACE exhibit: absorption alone can
  // only remove light, so a pigmented translucent body lit from the front is
  // black murk; scattering sends light back out and the material finally looks
  // like its colour. Jade, wax, marble, soap, foliage, lampshades.
  //
  // The lamp carries both halves of the feature in one object:
  //   OUTSIDE  the alabaster shade is lit by the room, and its warm glow is
  //            the two-flux REFLECTANCE over the thickness of its own wall
  //   THROUGH  the bulb inside is an emissive area light whose shadow rays
  //            cross that wall, so the table below is lit through the shade by
  //            the two-flux TRANSMITTANCE instead of being a hard black disc
  //
  // The pair of spheres is the controlled A/B: SAME geometry, SAME attenuation
  // colour and distance (so identical K), and only the right-hand one carries
  // userData.rtScattering. With the feature on, the left stays a dark green
  // glass marble and the right becomes jade.
  //
  // WHY EVERYTHING IS CHUNKY. The tracer steps 2 x rt.eps past each interface it
  // crosses, which in a room this size is about 7 cm — a body (or a shade wall)
  // thinner than that cannot resolve its own exit face. Hence a cast-alabaster
  // shade with a 14 cm wall rather than a fabric one, which is a real object
  // (alabaster and onyx lamps are exactly this) rather than a fudge. The same
  // limit is why the thin layered "filament chart" that would have gone on this
  // table lives in the scattering.html rig instead, where the scene is small
  // enough for a millimetre-scale epsilon.
  //
  // Hidden at boot, revealed by the panel's "scattering (Kubelka-Munk)" toggle:
  // while it is hidden no compiled material scatters, so the megakernel keeps
  // its byte-identical no-scattering program and flipping the toggle IS the
  // feature's cost A/B.
  const alabaster = new THREE.Group();
  alabaster.name = "alabaster";
  // Open front-left floor: clear of the vitrine plinth (x -5.55..-4.05), the
  // OPEN sign stand (-3.2, 1.95), and the Lumiere floor projection (x >= 0.2).
  alabaster.position.set(-1.6, 0, 3.3);
  const addAla = (name, mesh) => { mesh.name = name; alabaster.add(mesh); return mesh; };
  const alaBronze = (name, geo, x, y, z) => {
    const m = new THREE.Mesh(geo, frameMat);
    m.position.set(x, y, z);
    return addAla(name, m);
  };
  // Side table: a turned column on a disc foot, both reaching the floor.
  const TABLE_TOP = 0.76;
  alaBronze("alabaster-table-foot", new THREE.CylinderGeometry(0.46, 0.5, 0.05, 28), 0, 0.025, 0);
  alaBronze("alabaster-table-column", new THREE.CylinderGeometry(0.14, 0.16, 0.66, 20), 0, 0.38, 0);
  const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 0.78, 0.07, 36),
    new THREE.MeshStandardMaterial({ color: 0xcfc7ba, roughness: 0.45 })
  );
  tableTop.position.set(0, TABLE_TOP - 0.035, 0);
  tableTop.userData.museumTop = TABLE_TOP;
  addAla("alabaster-table-top", tableTop);

  // Lamp hardware: base disc, stem, and the finial that the shade hangs from.
  // The stem runs up THROUGH the shade's top opening; the finial caps it and is
  // wider than that opening, so the shade is genuinely held rather than parked
  // in mid-air (the same way a real harp-and-finial lamp works).
  const SHADE_BOTTOM = 1.02;
  const SHADE_TOP = 1.57;
  alaBronze("alabaster-lamp-base", new THREE.CylinderGeometry(0.24, 0.26, 0.05, 24), 0, TABLE_TOP + 0.025, 0);
  alaBronze("alabaster-lamp-stem", new THREE.CylinderGeometry(0.045, 0.045, SHADE_TOP - TABLE_TOP, 14),
    0, (TABLE_TOP + SHADE_TOP) / 2 + 0.025, 0);
  alaBronze("alabaster-lamp-finial", new THREE.CylinderGeometry(0.26, 0.2, 0.07, 20), 0, SHADE_TOP + 0.035, 0);

  // The bulb: a small emissive sphere inside the shade. Warm and bright, but
  // low-poly — it joins the NEE area-light table, which is a shared budget.
  const bulb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.11, 1),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffdcae,
      emissiveIntensity: 9,
      roughness: 1,
    })
  );
  bulb.position.set(0, 1.26, 0);
  addAla("alabaster-bulb", bulb);

  // ALABASTER: warm off-white stone. Very high S (it scatters hard, which is
  // what makes stone opaque-looking rather than glassy) and a gentle K that
  // warms whatever gets through. S is given as a raw coefficient here; the jade
  // below uses the colour + distance route, so the demo exercises both.
  const alabasterStone = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,        // white on purpose: K and S carry the pigment
    roughness: 0.42,
    metalness: 0,
    transmission: 1.0,      // translucent to the tracer, NOT `transparent`
    ior: 1.5,
    attenuationColor: new THREE.Color(0xffe9d0), // the warm half — this is K
    attenuationDistance: 0.5,
  });
  alabasterStone.userData.rtScattering = { coefficient: 22 };
  // A lathed shell, not a solid cone: outer wall up, top rim in, inner wall
  // back down, bottom rim out, closed. That gives the shade a real 14 cm wall
  // for the march to measure — and because thickness is measured PER RAY, the
  // shade automatically reads brighter where the wall is seen obliquely.
  const shadeProfile = [
    new THREE.Vector2(0.58, 0),      // outer bottom
    new THREE.Vector2(0.34, 0.55),   // outer top
    new THREE.Vector2(0.2, 0.55),    // top rim (the stem passes through)
    new THREE.Vector2(0.44, 0),      // inner bottom
    new THREE.Vector2(0.58, 0),      // close the profile
  ];
  const shade = new THREE.Mesh(new THREE.LatheGeometry(shadeProfile, 40), alabasterStone);
  shade.position.set(0, SHADE_BOTTOM, 0);
  addAla("alabaster-shade", shade);

  // The A/B pair. Identical spheres, identical K, on identical mounts — the
  // ONLY difference is the userData.rtScattering line on the right-hand one.
  //
  // K is given through userData.rtAttenuation rather than attenuationColor
  // because that route takes the colour as LINEAR values, and these are chosen
  // by working the two-flux model backwards from the reflectance wanted. For a
  // pigment thick enough to hide its backing, R_inf = 1/(a + b), which inverts to
  // K/S = (1 - R)^2 / (2R); at S = 20 the jade target (0.05, 0.45, 0.22) asks for
  // K = (184, 6.7, 27.7) per metre, and exp(-K * distance) is the colour below.
  // Set a target reflectance, get the coefficients — which is the point of a
  // physically-parameterized model, and why this is a table lookup rather than a
  // fortnight of dragging sliders.
  //
  // The DISTANCE is 5 cm rather than a rounder number for a real reason: colour
  // channels are floored at 1e-4 on the way in, so the largest K any given
  // distance can express is -ln(1e-4)/distance. At 25 cm that caps red at 36.8
  // and the jade comes out a washed sage; at 5 cm the cap is 184, which is what
  // this needs.
  const marbleGeo = new THREE.SphereGeometry(0.2, 36, 24);
  const jadeBase = () => ({
    color: 0xffffff,
    // Soft enough that the GGX highlight reads as polished stone rather than
    // covering the pigment it is supposed to sit on.
    roughness: 0.34,
    metalness: 0,
    transmission: 1.0,
    ior: 1.55,
  });
  const jadeK = { color: [0.0001, 0.715, 0.250], distance: 0.05 };
  // Left: absorption only — this is 0.8.0's model, and a front-lit pigmented
  // body under it is exactly the black murk this feature exists to fix.
  const glassMarble = new THREE.MeshPhysicalMaterial(jadeBase());
  glassMarble.userData.rtAttenuation = jadeK;
  // Right: the same stone, plus scattering. S via the colour + distance route:
  // 14% of the flux still travelling straight after 10 cm, i.e. S ~ 20.
  const jadeStone = new THREE.MeshPhysicalMaterial(jadeBase());
  jadeStone.userData.rtAttenuation = jadeK;
  jadeStone.userData.rtScattering = { color: [0.14, 0.14, 0.14], distance: 0.1 };
  const mounts = [
    ["absorb", -0.44, 0.34, glassMarble],
    ["scatter", 0.44, 0.34, jadeStone],
  ];
  for (const [tag, mx, mz, mat] of mounts) {
    alaBronze(`alabaster-mount-${tag}`, new THREE.CylinderGeometry(0.12, 0.14, 0.06, 18),
      mx, TABLE_TOP + 0.03, mz);
    const ball = new THREE.Mesh(marbleGeo, mat);
    // Seated on its mount's top face (a ball in a cup rests at one point).
    ball.position.set(mx, TABLE_TOP + 0.06 + 0.2, mz);
    addAla(`alabaster-ball-${tag}`, ball);
  }
  alabaster.traverse((o) => (o.visible = false)); // revealed by the KM toggle
  scene.add(alabaster);

  // --- front-right (DYNAMICS CORNER): the animated fox (skinned dynamic BVH) --
  // A low granite platform sharing the right-hand dynamics half with the physics
  // drop pad (7.1, 0.15 — see main.js spawnPile): the platform's near edge is at
  // z = 1.8 and the pad's nearest resting prop face at 1.64, so the pile never
  // interpenetrates it. The Fox (loaded async below) trots on top; its skeleton
  // is CPU-skinned into the dynamic BVH every frame, so the warm/cool lights
  // cast a traced shadow that moves with the gait.
  const FOX_POS = new THREE.Vector3(6.5, 0.3, 2.8);
  const foxPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.3, 2.0),
    new THREE.MeshStandardMaterial({ color: 0x6f747c, roughness: 0.6 })
  );
  foxPlatform.position.set(FOX_POS.x, 0.15, FOX_POS.z);
  foxPlatform.name = "fox-platform";
  foxPlatform.userData.museumTop = 0.3;
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
  water.name = "water-surface";
  scene.add(water);
  // A slim stone kerb so the pool reads as built, not painted on the floor. The
  // 5.5m water plane spans exactly kerb-inner-face to kerb-inner-face, so the
  // surface is held by the basin rather than hovering over the floor.
  const kerbMat = new THREE.MeshStandardMaterial({ color: 0x8a8478, roughness: 0.7 });
  let ki = 0;
  for (const [w, d, dx, dz] of [
    [5.9, 0.2, 0, 2.85],
    [5.9, 0.2, 0, -2.85],
    [0.2, 5.5, 2.85, 0],
    [0.2, 5.5, -2.85, 0],
  ]) {
    const kerb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, d), kerbMat);
    kerb.position.set(-7.5 + dx, 0.25, -3.6 + dz);
    kerb.name = `pool-kerb-${ki++}`;
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
    // Back face flush with the back wall's inner plane (z = -6.9): the windows
    // are let INTO the wall, not floating in front of it.
    win.position.set(-8.75 + i * 3.5, 4.1, -6.85);
    win.visible = i < 3;
    win.name = `clerestory-window-${i}`;
    scene.add(win);
    windows.push(win);
  }

  // Corner strips: tucked into the back corners, within 3-4cm of BOTH wall faces
  // (x = |11.9|, z = -6.9) so they read as recessed cove lighting.
  for (const x of [-11.81, 11.81]) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 5.2, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xa8d4ff,
        emissiveIntensity: 4.5,
      })
    );
    strip.position.set(x, 2.8, -6.8);
    strip.name = `corner-strip-${x < 0 ? "left" : "right"}`;
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

  // The Lumiere projector: a crisp spot mounted behind and above the screen,
  // aimed so its AXIS passes through the middle of the glazing (2.6, 1.35, -0.5)
  // and lands on the open centre floor at (2.6, 0, 0.4). The cone is wide enough
  // (0.38 rad half-angle -> ~1.95m radius at the screen, which is 1.3 x 1.1
  // half-extents) to spill a ring of plain white light around the projection, so
  // the coloured quilt always has an untinted reference right beside it. Small
  // rtRadius keeps the projected tile edges crisp rather than soft-shadow mush.
  // Hidden at boot; the UI reveals it with the rest of the Lumiere ensemble.
  const projector = new THREE.SpotLight(0xfff2e0, 55, 0, 0.38, 0.3);
  projector.position.set(2.6, 5.4, -3.2);
  projector.target.position.set(2.6, 0, 0.4);
  projector.userData.rtRadius = 0.06;
  projector.visible = false;
  scene.add(projector);
  scene.add(projector.target);

  // Orbiting ceiling light — shows moving ray traced shadows sweeping the room.
  // Its soft-shadow radius is kept small so the sampled light points stay clear
  // of the emissive orb hung just above it (below).
  const orbit = new THREE.PointLight(0xfff0dd, 13);
  orbit.position.set(4.5, 6.2, 0);
  orbit.userData.rtRadius = 0.16;
  orbit.visible = false;
  scene.add(orbit);

  // A small glowing orb bulb for the orbit light: a low-poly emissive mesh that
  // IS a DYNAMIC area light (registered in dynamicMeshes, refreshed each frame by
  // updateDynamic), so its glow sweeps the floor via NEE — not just GI luck. It's
  // a CHILD of the orbit light (so it tracks the orbit animation for free) and is
  // hung a touch ABOVE the light centre so shadow rays to the point light don't
  // graze the orb and self-occlude it. Icosahedron(_, 0) = 20 tris: dynamic
  // emitters are refreshed every frame, so keep them low-poly.
  const orbitOrb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.16, 0),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffe0b0,
      emissiveIntensity: 22,
      roughness: 1,
    })
  );
  orbitOrb.position.set(0, 0.5, 0); // local offset above the light centre
  orbitOrb.visible = false;         // tied to the orbit light (see main.js)
  orbit.add(orbitOrb);

  // Fair raster comparison: when ray tracing is toggled off, the demo enables
  // shadow maps — flag everything now so that path just works.
  for (const l of [warm, cool, spot, orbit, projector]) {
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.004;
  }
  scene.traverse((o) => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });

  // Light descriptors for the UI (label + whether to show a colour swatch).
  // `gated: "absorption"` marks a light whose SUBJECT is hidden until the
  // "tinted glass" toggle reveals it — the UI keeps the row visible (so the
  // panel never reflows) but dims and disables it until then.
  const lights = [
    { label: "warm light", light: warm, color: true },
    { label: "cool light", light: cool, color: true },
    { label: "spot light", light: spot, color: true },
    { label: "orbit light", light: orbit, color: true },
    { label: "projector", light: projector, color: true, gated: "absorption" },
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
    helmet.scene.name = "helmet";
    // Seat it ON the plinth top rather than at a hand-picked y: the glTF is
    // origin-centred, so the old constant sank a third of the sphere into the
    // stone. Re-aim the hero spotlight at wherever the seated centre ended up.
    seatOn(helmet.scene, helmetPlinth.userData.museumTop);
    HELMET_POS.copy(helmet.scene.position);
    spot.target.position.copy(HELMET_POS);
    scene.add(helmet.scene);

    duck.scene.scale.setScalar(0.75);
    duck.scene.position.set(-4.8, 0, 0.8);
    duck.scene.rotation.y = -0.5;
    duck.scene.name = "duck";
    seatOn(duck.scene, 0.7); // the vitrine plinth top
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
    // orbitOrb is the orbit light's emissive bulb (a dynamic NEE area light);
    // sign is the textured (emissiveMap) emitter beside the vitrine;
    // tintedArt is the backlit cast-glass relief (Beer-Lambert absorption) and
    // lumiere is the freestanding stained-glass screen (coloured shadows) —
    // ONE ensemble, both hidden until the "tinted glass" toggle reveals them,
    // lit by `projector` (also hidden, and listed in `lights`).
    // alabaster is the Kubelka-Munk scattering exhibit (the reading lamp and
    // the absorb-vs-scatter sphere pair), hidden until its own toggle.
    showcase: { orbit, orbitOrb, sign, paneBlue, paneAmber, tintedArt, lumiere, projector, alabaster },
  };
}
