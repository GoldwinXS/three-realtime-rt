import * as THREE from "three";

function makePoolTexture() {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = s; cv.height = s;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#35617a";
  ctx.fillRect(0, 0, s, s);
  for (let r = 6; r < s * 0.8; r += 8) {
    ctx.strokeStyle = `rgba(220,240,255,${0.04 + 0.1 * Math.random()})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(s / 2, s * 0.3, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const CLIFF_MAT = new THREE.MeshStandardMaterial({ color: 0x6f6a61, roughness: 0.95 });

function cliffRock(x, y, z, sx, sy, sz) {
  const geo = new THREE.DodecahedronGeometry(1, 0);
  const p = geo.getAttribute("position");
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(i, p.getX(i) * (0.8 + Math.random() * 0.4), p.getY(i) * (0.8 + Math.random() * 0.4), p.getZ(i) * (0.8 + Math.random() * 0.4));
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, CLIFF_MAT);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.rotation.set(Math.random() * 0.4, Math.random() * 6.28, Math.random() * 0.4);
  return m;
}

/**
 * A natural waterfall: a rocky shelf, a foamy sheet spilling off it into a
 * rippling pond ringed with boulders. The water surfaces are rtExclude (they
 * light up in the G-buffer but don't occlude); the rocks are solid so they cast
 * real shadows and bounce GI. Animation is pure UV scroll — geometry stays cheap.
 */
export function createWaterfall(scene, { x = -6.5, z = -6.0, floorY = 0 } = {}) {
  const group = new THREE.Group();
  const H = 4.4;               // rock-shelf height
  const poolZ = z + 3.0;
  const poolR = 2.6;

  // Rocky shelf behind the pond.
  group.add(cliffRock(x, H * 0.55, z - 0.3, 2.6, 2.4, 1.8));
  group.add(cliffRock(x - 2.0, H * 0.4, z - 0.2, 1.6, 1.8, 1.5));
  group.add(cliffRock(x + 2.1, H * 0.42, z - 0.1, 1.5, 1.9, 1.5));
  group.add(cliffRock(x - 0.2, H * 0.9, z - 0.6, 1.6, 1.2, 1.2));

  // Pond (a calm rocky pond — the animated waterfall sheet was dropped as it
  // read poorly; real refractive water belongs with stage-6 specular).
  const poolTex = makePoolTexture();
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(poolR, 44),
    new THREE.MeshStandardMaterial({ map: poolTex, color: 0x8fc9de, roughness: 0.1, metalness: 0.0, emissive: 0x12303c, emissiveIntensity: 0.4 })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(x, floorY + 0.05, poolZ);
  pool.userData.rtExclude = true;
  group.add(pool);

  // Boulders ringing the pond (solid — real shadows + GI).
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x7c766c, roughness: 0.95 });
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    // leave a gap at the back where the waterfall enters
    if (a > 3.6 && a < 5.0) continue;
    const rr = poolR + 0.1;
    const geo = new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.25, 0);
    const m = new THREE.Mesh(geo, ringMat);
    m.position.set(x + Math.cos(a) * rr, floorY + 0.15, poolZ + Math.sin(a) * rr);
    m.rotation.set(Math.random(), Math.random() * 6.28, Math.random());
    group.add(m);
  }

  scene.add(group);

  return {
    group,
    setVisible(v) { group.visible = v; },
    update(dt) {
      if (!group.visible) return;
      poolTex.offset.y -= dt * 0.12; // gentle ripple drift on the pond surface
      poolTex.offset.x += dt * 0.03;
    },
  };
}
