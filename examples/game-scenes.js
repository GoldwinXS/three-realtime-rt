/**
 * three-realtime-rt  -  deterministic GAME scenes for the quality-presets round.
 *
 * Three scripted benchmark scenes for game-bench.html. Everything here is
 * DETERMINISTIC by construction: no Math.random, no physics engine, fixed
 * waypoint arrays and fixed event timings, so a given scene x preset renders
 * the same world-space motion on every run and every clip is frame-comparable
 * across presets.
 *
 *   chase    third-person camera following a fast prop down a corridor with
 *            large occluders. The camera translates AND turns, so pixels are
 *            disoccluded constantly  -  the ghosting the "motion" preset exists
 *            for.
 *   stealth  Umbral-flavored dark room: two sweeping SpotLight cones, a
 *            player-proxy box sneaking between crates, one flickering emissive.
 *            Noise-in-darkness and light-motion churn are what viewers judge
 *            hardest on dark scenes.
 *   arena    combat chaos: 16 dynamic props, a mid-clip scatter impulse (the
 *            explode pattern), two emissive projectiles flying, a light
 *            toggling mid-clip. Stresses dynamic BVH re-bake, NEE churn and
 *            firefly control.
 *
 * Each scene exports a plain object consumed by examples/game-bench.js:
 *   name, label, loopSeconds,
 *   build()        -> { scene, lights, dynamicMeshes }  (three.js objects)
 *   update(t)      advance ALL scripted motion at absolute time t (seconds):
 *                   sets camera position/target, moves props/lights/emissives.
 *   cameraAt(t)    -> { pos:[x,y,z], look:[x,y,z] }     (camera pose at t)
 *   homeT          bench-timing camera time
 *   ghostT         { a, b }  two camera times far apart, used by the ghost probe
 */
import * as THREE from "three";

const r = (x) => new THREE.MeshStandardMaterial({ color: x, roughness: 0.85 });
const gloss = (x, rough) => new THREE.MeshStandardMaterial({ color: x, roughness: rough ?? 0.5 });

// ---------------------------------------------------------------------------
// chase
// ---------------------------------------------------------------------------
function buildChase() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a0f);

  const floor = new THREE.Mesh(new THREE.BoxGeometry(64, 0.2, 7), r(0x2a2f36));
  floor.position.y = -0.1;
  floor.name = "chase-floor";
  scene.add(floor);
  const mkWall = (x) => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 64), r(0x3a4150));
    w.position.set(x, 2, 0);
    w.name = "chase-wall";
    scene.add(w);
  };
  mkWall(-3.5);
  mkWall(3.5);

  // Large occluders the prop passes behind (disocclusion sources). Placed along
  // the prop's S-path so each is between the trailing camera and the prop at
  // some point in the loop.
  const OC = [
    [1.6, 20], [1.6, 10], [0, 0], [-1.6, -10], [-1.6, -20],
  ];
  for (const [x, z] of OC) {
    const o = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.4, 1.6), r(0x4a5264));
    o.position.set(x, 1.7, z);
    o.name = "chase-occluder";
    scene.add(o);
  }

  // The chased prop: bright, fast, S-curves down the corridor.
  const prop = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 32, 24),
    gloss(0x38d0e0, 0.35)
  );
  prop.name = "chase-prop";
  scene.add(prop);

  // Ceiling strip emitters so the corridor is lit and the prop casts shadows.
  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.08, 20),
    new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffe8c4, emissiveIntensity: 4 })
  );
  strip.position.set(0, 3.8, 0);
  strip.name = "chase-strip";
  scene.add(strip);

  const key = new THREE.DirectionalLight(0xfff2dd, 1.6);
  key.position.set(-6, 8, -6);
  key.userData.rtRadius = 0.04;
  scene.add(key, key.target);

  const loopSeconds = 20;
  const propPos = (u) => {
    const z = 26 - 52 * u;               // +26 .. -26
    const x = 2.2 * Math.sin(Math.PI * u * 2); // S-curve
    return [x, 0.5, z];
  };
  const cameraAt = (t) => {
    const u = ((t % loopSeconds) + loopSeconds) % loopSeconds / loopSeconds;
    const [x, , z] = propPos(u);
    // Trailing camera: 5.5 units behind the prop along +z, 1.9 up. It translates
    // (z, x track the prop) AND turns (lookAt the prop as the path bends).
    return { pos: [x, 2.4, z + 5.5], look: [x, 1.0, z] };
  };

  const update = (t) => {
    const u = ((t % loopSeconds) + loopSeconds) % loopSeconds / loopSeconds;
    const [x, y, z] = propPos(u);
    prop.position.set(x, y, z);
    const cam = cameraAt(t);
    camera.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
    camera.lookAt(cam.look[0], cam.look[1], cam.look[2]);
  };

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  return {
    scene, lights: [{ label: "key", light: key }], dynamicMeshes: [prop],
    loopSeconds, cameraAt, update,
    homeT: 2.5,
    ghostT: { a: 15, b: 2.5 },
    camera,
  };
}

// ---------------------------------------------------------------------------
// stealth
// ---------------------------------------------------------------------------
function buildStealth() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030405);

  // Dark room: walls, floor, ceiling slabs. Very low ambient; the two sweeping
  // spots are the only real light, so the dark gaps are where noise shows.
  const floor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.2, 14), r(0x14161b));
  floor.position.y = -0.1;
  floor.name = "stealth-floor";
  scene.add(floor);
  const walls = [
    [0, 0, -7, 20, 6, 0.2, 0],
    [0, 0, 7, 20, 6, 0.2, 0],
    [-10, 0, 0, 0.2, 6, 14, 0],
    [10, 0, 0, 0.2, 6, 14, 0],
  ];
  for (const [x, y, z, sx, sy, sz] of walls) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), r(0x101218));
    w.position.set(x, y + sy / 2, z);
    w.name = "stealth-wall";
    scene.add(w);
  }

  // Cover crates (static) the player-proxy sneaks between.
  const CRATES = [
    [-6, 1.4, 0], [-2, 1.6, -3.5], [2, 1.2, 2.5], [6, 1.5, -1.5], [-4, 1.3, 4],
    [5, 1.5, 4], [-1, 1.4, 3.5], [7, 1.2, -4],
  ];
  for (const [x, h, z] of CRATES) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(1.6, h * 2, 1.6), r(0x23262d));
    c.position.set(x, h, z);
    c.name = "stealth-crate";
    scene.add(c);
  }

  // The sneaking player-proxy box (dynamic).
  const player = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.8), gloss(0x8fa3b3, 0.6));
  player.name = "stealth-player";
  scene.add(player);

  // Two sweeping SpotLight rigs (dynamic positions; fixed sweep angles).
  const spots = [];
  for (let i = 0; i < 2; i++) {
    const s = new THREE.SpotLight(i === 0 ? 0xffdd99 : 0x99ccff, 60, 0, 0.9, 0.5, 1);
    s.userData.rtRadius = 0.03;
    s.position.set(0, 5, 0);
    s.target.position.set(0, 0, 0);
    scene.add(s);
    scene.add(s.target);
    spots.push(s);
  }
  // One flickering emissive panel (deterministic pattern, not random).
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.0, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff5533 })
  );
  panel.position.set(-9.9, 2.6, -3);
  panel.name = "stealth-flicker";
  scene.add(panel);

  const loopSeconds = 20;
  const cameraAt = (t) => {
    // Slow pan across the room from one corner to the other.
    const u = ((t % loopSeconds) + loopSeconds) % loopSeconds / loopSeconds;
    const px = -8 + 16 * u, pz = 6 - 12 * u;
    return { pos: [px, 3.2, pz], look: [px * 0.3, 0.8, -pz * 0.3] };
  };

  const flicker = (t) => {
    // Base 0.5, a 1.2 Hz flicker plus a periodic dropout every ~4s. Purely
    // deterministic: 0.35 + 0.3*sin(2π*1.2*t) with a square dropout.
    const base = 0.5 + 0.3 * Math.sin(2 * Math.PI * 1.2 * t);
    const dropout = (Math.floor(t * 0.25) % 4 === 0) && ((t * 4) % 1 < 0.35) ? 0.1 : 1;
    return Math.max(0.05, base * dropout);
  };

  const update = (t) => {
    const u = ((t % loopSeconds) + loopSeconds) % loopSeconds / loopSeconds;
    // Player-proxy sneaks between crates: x from -7 to +7 with two pauses.
    let x;
    if (u < 0.4) x = -7 + 14 * (u / 0.4);
    else if (u < 0.55) x = 7;            // pause behind the right crates
    else if (u < 0.9) x = 7 - 14 * ((u - 0.55) / 0.35);
    else x = -7;                          // pause behind the left crates
    player.position.set(x, 0.5, Math.sin(u * Math.PI * 3) * 2.5);
    // NOTE: no random jitter  -  the crouch path is a pure sine, so frame N is
    // identical across presets at the same wall-clock time.

    // Two sweeping spotlight cones: each orbits the room on a fixed circle,
    // aimed at a fixed floor point, so the light pools sweep and churn.
    for (let i = 0; i < spots.length; i++) {
      const a = t * 0.55 + i * Math.PI;
      spots[i].position.set(Math.cos(a) * 7, 5.2, Math.sin(a) * 4.5);
      spots[i].target.position.set(Math.cos(a + 0.9) * 4, 0, Math.sin(a + 0.9) * 3);
      spots[i].target.updateMatrixWorld();
    }

    panel.material.emissiveIntensity = flicker(t);

    const cam = cameraAt(t);
    camera.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
    camera.lookAt(cam.look[0], cam.look[1], cam.look[2]);
  };

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  return {
    scene, lights: spots.map((s, i) => ({ label: `spot-${i}`, light: s })),
    dynamicMeshes: [player],
    dynamicLights: true, // the sweeping spotlights move every frame
    loopSeconds, cameraAt, update,
    homeT: 5,
    ghostT: { a: 16, b: 5 },
    camera,
  };
}

// ---------------------------------------------------------------------------
// arena
// ---------------------------------------------------------------------------
function buildArena() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0d12);

  const floor = new THREE.Mesh(new THREE.BoxGeometry(26, 0.2, 26), r(0x2c313a));
  floor.position.y = -0.1;
  floor.name = "arena-floor";
  scene.add(floor);
  for (const [x, z, sx, sz] of [[-13, 0, 0.2, 26], [13, 0, 0.2, 26], [0, -13, 26, 0.2], [0, 13, 26, 0.2]]) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(sx, 3, sz), r(0x22262d));
    w.position.set(x, 1.5, z);
    w.name = "arena-wall";
    scene.add(w);
  }

  // 16 dynamic props. Each has a fixed scatter direction (angle) and speed.
  // LOW-POLY on purpose: they are re-baked into the dynamic BVH every frame, so
  // dense spheres waste the rebuild budget and, at this many dynamic meshes,
  // pushed the NVIDIA driver into a TDR on this machine. Boxes and icosahedra
  // read the same on screen at benchmark scale.
  const N = 16;
  const props = [];
  const scatter = [];
  for (let i = 0; i < N; i++) {
    const mesh = new THREE.Mesh(
      i % 3 === 0 ? new THREE.IcosahedronGeometry(0.5, 0)
        : i % 3 === 1 ? new THREE.BoxGeometry(1.0, 1.0, 1.0)
        : new THREE.BoxGeometry(1.0, 0.6, 0.6),
      gloss([0xe0634f, 0x4f9ee0, 0x8a5fd0][i % 3], 0.5)
    );
    mesh.name = `arena-prop-${i}`;
    const angle = (i / N) * Math.PI * 2 + 0.3;
    const speed = 3.2 + (i % 5) * 0.5;
    props.push(mesh);
    scatter.push({ angle, speed, baseR: 4.0 + (i % 4) * 0.9 });
    scene.add(mesh);
  }

  // Two emissive projectiles (dynamic NEE area lights) on fixed crossing paths.
  // LOW-POLY like the props: dynamic emitters are re-baked and re-uploaded
  // every frame and the engine's NEE cap is 256 emissive triangles shared
  // across all emitters. Icosahedron(0.5, 0) = 20 tris each = 40 total.
  const proj = [];
  for (let i = 0; i < 2; i++) {
    const p = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.MeshStandardMaterial({ color: 0x000000, emissive: i === 0 ? 0xff8844 : 0x44ccff, emissiveIntensity: 6 })
    );
    p.name = `arena-projectile-${i}`;
    scene.add(p);
    proj.push(p);
  }

  // Key light toggled mid-clip by the scene (off at 6s, on at 9s).
  const key = new THREE.DirectionalLight(0xfff2dd, 2.2);
  key.position.set(-8, 10, 6);
  key.userData.rtRadius = 0.04;
  scene.add(key, key.target);

  const loopSeconds = 20;
  const EXPLODE = 10;

  // Prop i position as a function of absolute time: drift on a ring until the
  // scatter impulse, then fly outward along the fixed angle with deceleration,
  // clamped by the arena walls.
  const propPos = (i, t) => {
    const s = scatter[i];
    let r0;
    if (t < EXPLODE) {
      r0 = s.baseR + 0.7 * Math.sin(t * 0.9 + i); // gentle drift before the boom
    } else {
      const dt = t - EXPLODE;
      r0 = s.baseR + s.speed * dt - 0.5 * 0.5 * dt * dt; // decelerating flight
      r0 = Math.max(s.baseR, Math.min(11.5, r0));
    }
    return [Math.cos(s.angle) * r0, 0.5, Math.sin(s.angle) * r0];
  };

  const cameraAt = (t) => {
    const u = ((t % loopSeconds) + loopSeconds) % loopSeconds / loopSeconds;
    const a = u * Math.PI * 2;
    return { pos: [Math.cos(a) * 17, 9, Math.sin(a) * 17], look: [0, 1.2, 0] };
  };

  const update = (t) => {
    for (let i = 0; i < N; i++) {
      const [x, y, z] = propPos(i, t);
      props[i].position.set(x, y, z);
    }
    // Projectiles cross on fixed paths (emissive NEE area lights moving).
    proj[0].position.set(-12 + 24 * (((t % loopSeconds) + loopSeconds) % loopSeconds / loopSeconds), 1.6, Math.sin(t * 0.6) * 4);
    proj[1].position.set(Math.sin(t * 0.7) * 5, 2.0, -12 + 24 * (((t % loopSeconds + 10) % loopSeconds) / loopSeconds));
    // Key light toggle mid-clip.
    const on = t < 6 || t >= 9;
    if (on !== key.visible) {
      key.visible = on;
    }
    const cam = cameraAt(t);
    camera.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
    camera.lookAt(cam.look[0], cam.look[1], cam.look[2]);
  };

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  return {
    scene,
    lights: [{ label: "key", light: key }],
    dynamicMeshes: [...props, ...proj],
    loopSeconds, cameraAt, update,
    homeT: 3,
    ghostT: { a: 13, b: 3 },
    camera,
  };
}

export const GAME_SCENES = {
  chase: { name: "chase", label: "third-person chase", build: buildChase },
  stealth: { name: "stealth", label: "dark stealth room", build: buildStealth },
  arena: { name: "arena", label: "combat arena", build: buildArena },
};
