/**
 * three-realtime-rt — tour stop 1: the Cornell box.
 *
 * The entry page, and deliberately the smallest scene in the repo: five walls,
 * one emissive ceiling panel, and ONE exhibit standing in the middle at a time.
 * Everything is procedural — there is not a byte of new asset here — and the
 * whole room is static, so no BVH refit ever runs and the frame is pure lighting
 * cost. That is the point: this is where the renderer is asked to be fast.
 *
 * The centre of the box is a switcher. Each exhibit isolates exactly ONE feature
 * so its cost and its look can be read on their own:
 *
 *   diffuse blocks   the classic pair — GI colour bleed off the red/green walls
 *   mirror sphere    PBR specular + traced reflections
 *   glass sphere     refraction (and the dispersion slider becomes meaningful)
 *   glass panes      Beer-Lambert absorption + COLOURED shadows on the floor
 *   emissive block   a second area light, sampled by emissive NEE
 *   stone wedge      Kubelka-Munk scattering, four thicknesses saturating to R_inf
 *
 * Selecting an exhibit switches on the feature it demonstrates and switches off
 * the one the PREVIOUS exhibit borrowed — but never touches a row the user has
 * flipped by hand (see panel.js's `touched` set). Deep-linkable: index.html#glass.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RealtimeRaytracer } from "../src/index.js";
import { buildPanel, section, el, selectRow, ICON } from "./panel.js";
import { buildTourChrome, loadTourSettings, applyTourSettings, persistOnExit } from "./tour.js";

const PARAMS = new URLSearchParams(location.search);

const bootEl = document.getElementById("boot");
const bootMsg = document.getElementById("boot-msg");
const setBoot = (t) => { if (bootMsg) bootMsg.textContent = t; };

// Compatibility mode, same contract as the museum: if the RT pipeline cannot come
// up (GPU process killed, shader/buffer failure) reload into plain rasterized
// three.js rather than leaving a black tab. ?safe=1 opts in explicitly.
const SAFE = PARAMS.has("safe");
let safeModeTriggered = false;
const enterSafeMode = (why) => {
  if (SAFE || safeModeTriggered) return;
  safeModeTriggered = true;
  console.warn("[three-realtime-rt demo] switching to compatibility mode:", why);
  try { sessionStorage.setItem("rtSafeReason", String(why)); } catch { /* storage off */ }
  const u = new URL(location.href);
  u.searchParams.set("safe", "1");
  location.replace(u);
};

// ---------------------------------------------------------------------------
// The room
// ---------------------------------------------------------------------------

const S = 5.6;                 // interior edge — classic (near-cubic) proportions
const WALL = 0.1;              // wall slab thickness
const WHITE = 0xd6d0c2;

/** Build the five walls + the ceiling light. Returns { scene, lamp }. */
function buildRoom() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const white = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.9 });
  const red = new THREE.MeshStandardMaterial({ color: 0xb01e12, roughness: 0.9 });
  const green = new THREE.MeshStandardMaterial({ color: 0x1c8a1a, roughness: 0.9 });
  const box = (w, h, d, x, y, z, mat, name) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.name = name;
    scene.add(m);
    return m;
  };
  box(S, WALL, S, 0, -WALL / 2, 0, white, "floor");
  box(S, WALL, S, 0, S + WALL / 2, 0, white, "ceiling");
  box(S, S, WALL, 0, S / 2, -S / 2 - WALL / 2, white, "back");
  box(WALL, S, S, -S / 2 - WALL / 2, S / 2, 0, red, "wall-left");
  box(WALL, S, S, S / 2 + WALL / 2, S / 2, 0, green, "wall-right");

  // The room's only light: an emissive panel recessed into the ceiling. It is a
  // MESH, not a THREE.Light — every photon in this room is next-event-sampled
  // off its triangles, which is why "emissive area lights" is on by default here
  // and why RT OFF renders the box nearly black (a rasterizer has no path from
  // an emissive quad to a wall).
  // TWO triangles, facing down, not a box. Emissive NEE picks one emitting
  // triangle per pixel per frame: a box spends five sixths of those samples on
  // faces the ceiling occludes, which costs nothing in frame time and everything
  // in variance. A single downward quad is the surface that actually emits.
  const lamp = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffe9c4, emissiveIntensity: 16 })
  );
  lamp.rotation.x = Math.PI / 2;   // +Z normal -> -Y: it shines into the room
  lamp.position.set(0, S - 0.04, 0);
  lamp.name = "ceiling-lamp";
  scene.add(lamp);
  return { scene, lamp };
}

// ---------------------------------------------------------------------------
// The exhibits
// ---------------------------------------------------------------------------
//
// Every exhibit is built ONCE at boot and parked invisible; switching flips
// `.visible` and recompiles. The compiler skips invisible meshes, so the BVH
// only ever holds the room plus the ONE exhibit on show — the cheapest possible
// way to isolate a feature, and the same reveal pattern the museum uses.

function buildExhibits() {
  const out = {};
  const mk = (id) => {
    const g = new THREE.Group();
    g.name = `exhibit-${id}`;
    g.visible = false;
    out[id] = { id, group: g };
    return g;
  };
  const stone = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.9 });

  // --- 1. the classic pair -------------------------------------------------
  {
    const g = mk("boxes");
    const tall = new THREE.Mesh(new THREE.BoxGeometry(1.7, 3.4, 1.7), stone);
    tall.position.set(-1.0, 1.7, -1.0);
    tall.rotation.y = 0.3;
    const short = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), stone);
    short.position.set(1.05, 0.85, 0.9);
    short.rotation.y = -0.3;
    g.add(tall, short);
  }

  // --- 2. mirror sphere ----------------------------------------------------
  // Alone on the floor on purpose: with nothing else in the room the ONLY thing
  // the sphere can show is the room itself, so the red and green walls wrapping
  // around it are unambiguously traced reflection rather than an env map.
  {
    const g = mk("mirror");
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 64, 40),
      new THREE.MeshStandardMaterial({ color: 0xf2f4f8, roughness: 0.04, metalness: 1.0 })
    );
    ball.position.set(0, 1.25, -0.2);
    g.add(ball);
  }

  // --- 3. glass sphere -----------------------------------------------------
  // Diamond ior (2.417) rather than window glass: it bends hard enough to invert
  // the room through the ball, and it is the ior at which the dispersion slider
  // pays for its variance.
  {
    const g = mk("glass");
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 64, 40),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.02, metalness: 0,
        transmission: 1.0, ior: 2.417,
      })
    );
    ball.position.set(0, 1.15, 0);
    g.add(ball);
  }

  // --- 4. standing glass panes (absorption + coloured shadows) -------------
  // Three tall slabs standing across the room with gaps between them, placed
  // just BEHIND the ceiling panel's near edge. Every floor point in the strip in
  // front of them sees the lamp THROUGH the glass, so that strip — the most
  // visible piece of floor in the shot — is where the feature lands: three
  // coloured pools with plain white light in the gaps between them. With
  // "tinted shadows" off the same rays are simply blocked and the pools go flat
  // grey, which is exactly what a rasterizer draws.
  //
  // 26 cm thick for a reason: the tracer steps 2 x rt.eps past every interface it
  // crosses, which in a box this size is about 2.3 cm, so a pane has to be
  // comfortably thicker than that to resolve its own exit face. 3.6 m tall for
  // another: the pane has to reach high enough to stand between the lamp and the
  // floor in front of it, or the shadow rays simply pass over the top.
  {
    const g = mk("panes");
    const W = 1.35, H = 3.6, T = 0.26, PZ = 0.9;
    const tints = [
      ["amber", 0xffb454],
      ["emerald", 0x35e08a],
      ["cobalt", 0x5aa8ff],
    ];
    const panes = [];
    for (let i = 0; i < 3; i++) {
      const [tag, hex] = tints[i];
      // Two materials, identical but for the absorption: the panel's "tinted
      // glass" toggle swaps between them and recompiles, so OFF really is the
      // byte-identical no-absorption program and the fps delta is the feature's
      // true cost — the same A/B the museum's ensemble makes.
      const clear = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.04, metalness: 0, transmission: 1.0, ior: 1.5,
      });
      const tinted = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.04, metalness: 0, transmission: 1.0, ior: 1.5,
        attenuationColor: new THREE.Color(hex),
        attenuationDistance: 0.22,
      });
      const pane = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), clear);
      pane.name = `pane-${tag}`;
      pane.position.set(-1.6 + i * 1.6, H / 2, PZ);
      pane.userData.altMaterials = { off: clear, on: tinted };
      panes.push(pane);
      g.add(pane);
    }
    out.panes.swap = panes;
  }

  // --- 5. emissive block ---------------------------------------------------
  // A second area light, this one a plain glowing cube standing on the floor.
  // Emissive NEE samples its triangles directly, so it throws a soft coloured
  // wash and a real penumbra onto the white block beside it — with NEE off the
  // cube still glows (that is just its G-buffer emissive) but lights nothing.
  {
    const g = mk("emissive");
    // Intensity 2.2, not 9: six faces of a 1.3 m cube is four times the emitting
    // area of the ceiling panel, so anything brighter turns the room into one
    // flat cyan wash and there is no penumbra left to look at. This is a SECOND
    // light in the room, not a replacement for the first.
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
      new THREE.MeshStandardMaterial({
        color: 0x000000, emissive: 0x46e8ff, emissiveIntensity: 2.2, roughness: 1,
      })
    );
    glow.position.set(-1.3, 0.65, 0.6);
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 1.6), stone);
    receiver.position.set(1.2, 1.4, -0.55);
    receiver.rotation.y = -0.24;
    g.add(glow, receiver);
  }

  // --- 6. Kubelka-Munk stone wedge ----------------------------------------
  // Four slabs of the SAME stone at four thicknesses, front faces flush, backed
  // by a black card. Absorption alone can only remove light, so with scattering
  // off all four are dark murk; with it on each slab returns light from inside
  // and the series climbs toward R_inf — visibly saturating, so the thickest two
  // are nearly indistinguishable while the thinnest still shows the black card
  // through it. That flattening IS the hiding-power curve.
  {
    const g = mk("scattering");
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 1.9, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.95 })
    );
    card.position.set(0, 0.95, -0.62);
    g.add(card);
    const FRONT = 0.55;                    // every slab's front face sits here
    const thick = [0.12, 0.3, 0.62, 1.1];
    const slabs = [];
    thick.forEach((t, i) => {
      // K is the material's ordinary attenuation (a warm amber pigment); S is the
      // scattering half, and it is the ONLY difference between the two materials.
      const common = () => ({
        color: 0xffffff, roughness: 0.4, metalness: 0,
        transmission: 1.0, ior: 1.5,
        attenuationColor: new THREE.Color(0xffc07a),
        attenuationDistance: 0.4,
      });
      const absorbOnly = new THREE.MeshPhysicalMaterial(common());
      const scatters = new THREE.MeshPhysicalMaterial(common());
      scatters.userData.rtScattering = { coefficient: 8 };
      const slab = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, t), absorbOnly);
      slab.name = `km-slab-${t}`;
      slab.position.set(-1.44 + i * 0.96, 0.8, FRONT - t / 2);
      slab.userData.altMaterials = { off: absorbOnly, on: scatters };
      slabs.push(slab);
      g.add(slab);
    });
    out.scattering.swap = slabs;
  }

  return out;
}

// What each exhibit asks the renderer for. Auto-enabled on selection; auto-
// disabled again when the NEXT exhibit does not want it — unless the user has
// flipped that row by hand, in which case it is left exactly as they left it.
// Order matters within a pass: refraction has to be on before absorption can
// mean anything, and absorption before its shadow half.
const EXHIBITS = [
  {
    id: "boxes", label: "diffuse blocks (baseline)", needs: [],
    caption: "<b>The reference image.</b> No add-ons: the red and green you see " +
      "on the white blocks is one bounce of global illumination carrying wall " +
      "colour across the room. Turn GI off and it goes flat grey.",
  },
  {
    id: "mirror", label: "mirror sphere", needs: ["specular", "reflections"],
    caption: "<b>Reflections.</b> A traced specular ray per pixel — the whole room " +
      "wraps around the ball, including the ceiling panel and the floor it is " +
      "standing on. Nothing here is an environment map.",
  },
  {
    id: "glass", label: "glass sphere", needs: ["refraction"],
    caption: "<b>Refraction</b> at diamond ior, so the room arrives inverted " +
      "through the ball and light concentrates under it. The <i>dispersion</i> " +
      "slider above splits the transmitted term into a rainbow.",
  },
  {
    id: "panes", label: "tinted glass panes", needs: ["refraction", "absorption", "tintedShadows"],
    caption: "<b>Beer-Lambert absorption</b> in the glass, and the same law on the " +
      "SHADOW rays: the floor behind the panes is lit in their colours instead of " +
      "being one flat grey wedge. Switch <i>tinted shadows</i> off to see what a " +
      "rasterizer would draw.",
  },
  {
    id: "emissive", label: "emissive block", needs: ["emissive"],
    caption: "<b>Emissive area lights.</b> The glowing cube is geometry, not a " +
      "THREE.Light — next-event estimation samples its triangles, so it throws a " +
      "coloured wash and a true penumbra on the block beside it.",
  },
  {
    id: "scattering", label: "scattering stone (Kubelka-Munk)", needs: ["refraction", "scattering"],
    caption: "<b>Subsurface scattering,</b> four thicknesses of one stone over a " +
      "black card. Watch the series flatten out: past a couple of centimetres the " +
      "slabs stop getting brighter — that is R<sub>inf</sub>, the pigment's hiding " +
      "power. Off, absorption alone leaves them dark murk.",
  },
];
const FEATURE_ORDER = ["specular", "gi", "emissive", "reflections", "refraction", "absorption", "tintedShadows", "scattering"];

// ---------------------------------------------------------------------------

async function main() {
  const { scene } = buildRoom();
  const exhibits = buildExhibits();
  for (const key of Object.keys(exhibits)) scene.add(exhibits[key].group);

  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: PARAMS.has("pdb") });
  const TIER = RealtimeRaytracer.detectTier(renderer);
  const cssPixels = window.innerWidth * window.innerHeight;
  const budgetPr = Math.sqrt(1.6e6 / cssPixels);
  renderer.setPixelRatio(
    TIER === "mid" ? Math.max(1, Math.min(window.devicePixelRatio || 1, 1.5, budgetPr)) : 1
  );
  let canvasScale = TIER === "mid" ? 0.85 : 1.0;
  const bufferSize = () => {
    const pr = renderer.getPixelRatio();
    return [
      Math.floor(window.innerWidth * canvasScale * pr),
      Math.floor(window.innerHeight * canvasScale * pr),
    ];
  };
  const applyCanvasSize = () => {
    renderer.setSize(
      Math.floor(window.innerWidth * canvasScale),
      Math.floor(window.innerHeight * canvasScale),
      false
    );
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
  };
  applyCanvasSize();
  document.getElementById("app").appendChild(renderer.domElement);
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    if (!SAFE) enterSafeMode("webgl context lost");
    else setBoot("graphics context lost — please reload");
  });

  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2.85, 7.9);

  if (SAFE) {
    // Plain rasterized three.js. Honest about what that means here: the box is
    // lit only by an emissive quad, and a rasterizer cannot carry light off one.
    exhibits.boxes.group.visible = true;
    const fill = new THREE.PointLight(0xffe9c4, 24, 0, 2);
    fill.position.set(0, S - 0.5, 0);
    scene.add(fill);
    bootEl?.classList.add("hidden");
    const note = document.createElement("div");
    note.style.cssText =
      "position:fixed;top:12px;left:14px;z-index:30;color:#8fa3b3;font:11px ui-monospace,Consolas,monospace;" +
      "background:rgba(14,18,24,0.8);border:1px solid #26323c;border-radius:6px;padding:6px 10px;";
    let reason = "";
    try { reason = sessionStorage.getItem("rtSafeReason") || ""; } catch { /* storage off */ }
    note.textContent =
      "compatibility mode — ray tracing off on this device" +
      (reason ? ` (reason: ${reason})` : " (works on desktop)");
    document.body.append(note);
    const c2 = new OrbitControls(camera, renderer.domElement);
    c2.target.set(0, 2.5, 0);
    c2.enableDamping = true;
    (function rasterLoop() {
      requestAnimationFrame(rasterLoop);
      c2.update();
      renderer.render(scene, camera);
    })();
    return;
  }

  // A closed box lit by one emissive panel: there is no sky and no ambient, so
  // every add-on is measured against a true black background. GI and emissive NEE
  // are ON at boot because without the second the room is black and without the
  // first it has no colour bleed — they are what a Cornell box IS, not extras.
  //
  // WHY 25% LIGHTING RES AND HALF-RATE GI. This stop is the tour's speed claim,
  // so its defaults are chosen to be the FASTEST of the three rooms, not the
  // prettiest. A closed box is the worst case for one-bounce GI: nothing escapes
  // to a cheap sky, so every GI ray hits a wall and does next-event estimation
  // there, and the box fills most of the frame. At 50% that costs 52 fps here
  // against the museum's 169; at 25% with the GI updated on alternate frames it
  // is 172, and the scene is fully static so temporal accumulation puts the
  // resolution back within a second of standing still. Both dials are one click
  // away in the panel above — the whole point of the room is that the cost of
  // each is legible.
  const rt = new RealtimeRaytracer(renderer, {
    renderScale: 0.25,
    denoiseIterations: 2,
    stochasticLights: false,
    adaptiveQuality: false,
    gi: true,
    giHalfRate: true,
    emissiveNEE: true,
    reflections: false,
    refraction: false,
    absorptionShadows: false,
    targetFps: 55,
    canvasScaleHook: (s) => setCanvasScale(s),
    maxHistory: 64,
    envColor: new THREE.Color(0x000000),
    envIntensity: 0.0,
    sky: { enabled: false },
    fog: { enabled: false, color: new THREE.Color(0.5, 0.55, 0.62), density: 0.04 },
  });

  const carried = applyTourSettings(rt, loadTourSettings());

  const state = { rtEnabled: carried.rtEnabled ?? true };

  // Show exactly one exhibit. `.visible` has to be set on every MESH, not just
  // on the group: the scene compiler walks the whole tree and tests each mesh's
  // own flag, so a hidden parent alone would keep the meshes out of the raster
  // G-buffer while leaving them in the BVH and the NEE light table — invisible
  // objects casting shadows and emitting light. (Same reason the museum writes
  // its reveals as `piece.traverse(o => o.visible = on)`.)
  const showOnly = (id) => {
    for (const key of Object.keys(exhibits)) {
      const on = key === id;
      exhibits[key].group.traverse((o) => (o.visible = on));
    }
  };

  // Which exhibit to show. Deep link with a hash: index.html#glass.
  const wanted = (location.hash || "").replace(/^#/, "");
  let current = EXHIBITS.find((e) => e.id === wanted) ? wanted : EXHIBITS[0].id;
  showOnly(current);

  // The two scene-revealing features, held here so an exhibit built later (or a
  // toggle flipped while a different exhibit is on show) still lands correctly.
  const roomFeature = { absorption: false, scattering: false };
  /** Point every swappable mesh at its on/off material for the current flags. */
  const applyMaterials = () => {
    for (const m of exhibits.panes.swap) m.material = m.userData.altMaterials[roomFeature.absorption ? "on" : "off"];
    for (const m of exhibits.scattering.swap) m.material = m.userData.altMaterials[roomFeature.scattering ? "on" : "off"];
  };
  applyMaterials();

  setBoot("building BVH…");
  const t0 = performance.now();
  rt.compileScene(scene);
  console.log(
    `[three-realtime-rt cornell] compiled in ${Math.round(performance.now() - t0)}ms: ` +
      `${rt.compiled.triangleCount.toLocaleString()} tris, ${rt.compiled.lightCount} lights`
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.5, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 3;
  controls.maxDistance = 18;
  controls.update();

  const recompile = () => {
    rt.compileScene(scene);
    rt.resetAccumulation();
  };

  // The panel's feature toggles. gi / emissive / reflections / refraction are
  // plain renderer flags here (nothing to reveal); absorption and scattering
  // swap the exhibit's materials, which is what makes their OFF state the
  // byte-identical program rather than a flag the shader still carries.
  const setFeature = (name, on) => {
    switch (name) {
      case "gi": rt.gi = on; break;
      case "emissive": rt.emissiveNEE = on; break;
      case "reflections": rt.reflections = on; break;
      case "refraction": rt.refraction = on; break;
      case "absorption":
        roomFeature.absorption = on;
        applyMaterials();
        rt.compileScene(scene);
        break;
      case "scattering":
        rt.kmScattering = on;
        roomFeature.scattering = on;
        applyMaterials();
        rt.compileScene(scene);
        break;
    }
    rt.resetAccumulation();
  };

  const setCanvasScale = (s) => {
    canvasScale = s;
    applyCanvasSize();
    rt.setSize(...bufferSize());
    rt.taaJitterScale = s;
  };
  if (carried.canvasScale != null && carried.canvasScale !== canvasScale) setCanvasScale(carried.canvasScale);

  const HINT = "drag to orbit · scroll to zoom · switch exhibits in the panel";
  const ui = buildPanel({
    rt, state, setFeature, setCanvasScale, canvasScale,
    initial: carried.initial,
    hint: HINT,
  });
  // RT OFF in THIS room is a black screen, and that is the honest answer rather
  // than a fault: the only light here is an emissive quad, and a rasterizer has
  // no path from one of those to a wall. Say so, so nobody reads it as a bug.
  ui.onRtEnabled((on) => ui.setHint(on ? HINT : "ray tracing off — this room's only light is an emissive quad, and raster has no path from one to a wall"));

  // --- exhibit controls (this room's section, below the shared panel) -------
  const xSec = section(ICON.frame, "Exhibit");
  const caption = el("div", "caption");
  const picker = selectRow("showing", EXHIBITS.map((e) => [e.label, e.id]), current, (v) => selectExhibit(v, true));
  xSec.append(picker.row, caption);
  ui.exhibits.append(xSec);

  // Features this room switched on for the CURRENT exhibit, so the next exhibit
  // can switch them back off. Only ever holds rows the user has not touched.
  let autoOn = new Set();
  function selectExhibit(id, recompileScene) {
    const def = EXHIBITS.find((e) => e.id === id) || EXHIBITS[0];
    if (recompileScene) showOnly(def.id);
    current = def.id;
    picker.select.value = def.id;
    caption.innerHTML = def.caption;
    history.replaceState(null, "", `#${def.id}`);

    const want = new Set(def.needs);
    // Release first (so the recompiles happen at the cheapest state), then
    // acquire. Only rows THIS switcher turned on are ever released — a row that
    // was already on because it is a default of the room, or because the user
    // flipped it, is never ours to switch off.
    for (const name of [...FEATURE_ORDER].reverse()) {
      if (autoOn.has(name) && !want.has(name)) ui.setFeatureState(name, false, { auto: true });
    }
    const owned = new Set();
    for (const name of FEATURE_ORDER) {
      if (!want.has(name)) continue;
      const changed = ui.setFeatureState(name, true, { auto: true });
      // Ours if we just switched it on, or if we were already holding it.
      if (changed || autoOn.has(name)) owned.add(name);
    }
    // A row the user has since grabbed is theirs from now on.
    autoOn = new Set([...owned].filter((n) => !ui.touched.has(n)));
    if (recompileScene) recompile();
  }
  selectExhibit(current, false);
  addEventListener("hashchange", () => {
    const id = (location.hash || "").replace(/^#/, "");
    if (id && id !== current && EXHIBITS.some((e) => e.id === id)) selectExhibit(id, true);
  });

  buildTourChrome({ stopId: "cornell", panel: ui });
  persistOnExit(() => ({ rt, state, canvasScale, panel: ui }));
  // The switcher is what this stop IS, and the shared panel above it is taller
  // than a laptop viewport — so open the panel already scrolled to it. The
  // renderer rows are one flick up, which is the right way round here.
  ui.panel.scrollTop = ui.panel.scrollHeight;

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    applyCanvasSize();
    rt.setSize(...bufferSize());
  });

  // Test/automation surface, matching the museum's.
  Object.assign(window, {
    RT: rt, SCENE: scene, CAMERA: camera, CONTROLS: controls,
    RTDEMO: { rt, renderer, scene, setFeature, canvas: renderer.domElement, selectExhibit, EXHIBITS },
  });

  let frames = 0, lastFps = performance.now();
  let booted = false;
  let lastRtEnabled = null;
  (function animate() {
    if (document.visibilityState === "hidden") setTimeout(animate, 100);
    else requestAnimationFrame(animate);

    // Fair "ray tracing off" comparison: the raster fallback gets shadow maps +
    // ACES tone mapping so it isn't a flat unlit strawman. Flip these only when
    // the toggle changes — needsUpdate on every material is a rebuild.
    if (state.rtEnabled !== lastRtEnabled) {
      lastRtEnabled = state.rtEnabled;
      renderer.shadowMap.enabled = !state.rtEnabled;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = state.rtEnabled ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
    }

    controls.update();
    if (state.rtEnabled) {
      try {
        rt.render(scene, camera);
      } catch (err) {
        enterSafeMode(err && err.message ? err.message : String(err));
        return;
      }
    } else {
      renderer.render(scene, camera);
    }

    if (!booted) { booted = true; bootEl?.classList.add("hidden"); }

    frames++;
    const now = performance.now();
    if (now - lastFps >= 500) {
      const fps = Math.round((frames * 1000) / (now - lastFps));
      frames = 0;
      lastFps = now;
      ui.setStats(
        `<b>${fps}</b> fps   ·   frame ${rt.frame}\n` +
          `${rt.compiled.triangleCount.toLocaleString()} tris · fully static\n` +
          `${rt.compiled.lightCount} lights · lighting @ ${Math.round(rt.renderScale * 100)}%`
      );
    }
  })();
}

// The render self-test (scripts/selftest.mjs) drives the ROOT url — it always
// has, and its luminance gates are calibrated against the museum room. Stop 1
// taking over index.html must not quietly re-point that harness at a different
// scene, so under ?selftest the entry page hands the whole document to the
// museum module (examples/main.js) instead, exactly as index.html used to. That
// covers ?selftest=1, =empty and =warnings alike; nothing in the harness or in
// the museum's self-test path changes.
if (PARAMS.has("selftest")) {
  await import("./main.js");
} else {
  main().catch((err) => {
    console.error(err);
    // A failure during RT setup (shader compile, buffer allocation) on a weaker
    // device shouldn't be a dead end — retry without ray tracing.
    if (!SAFE) { enterSafeMode(err && err.message ? err.message : String(err)); return; }
    if (bootEl) {
      bootEl.classList.remove("hidden");
      bootEl.innerHTML =
        `<div class="err"><b>Failed to start.</b>\n\n${err && err.message ? err.message : err}\n\nSee the console for details.</div>`;
    }
  });
}
