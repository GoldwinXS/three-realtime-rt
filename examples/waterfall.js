import * as THREE from "three";

// Procedural vertical-streak texture for the falling sheet: bands of white foam
// over blue, with per-column noise so the scroll reads as moving water.
function makeFallTexture() {
  const w = 128, h = 256;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#3a6f8f";
  ctx.fillRect(0, 0, w, h);
  // deterministic pseudo-random so the look is stable frame to frame
  let seed = 1234.5;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let x = 0; x < w; x++) {
    const bright = 0.4 + rnd() * 0.6;
    for (let y = 0; y < h; y++) {
      const streak = Math.sin((x * 0.9 + rnd() * 2) + y * 0.02) * 0.5 + 0.5;
      const foam = Math.pow(streak, 3) * bright;
      const b = 150 + foam * 105;
      const g = 190 + foam * 60;
      ctx.fillStyle = `rgb(${Math.floor(180 + foam * 75)},${Math.floor(g)},${Math.floor(b)})`;
      if (rnd() > 0.985) ctx.fillStyle = "#ffffff"; // sparkle
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  return tex;
}

// Concentric-ripple texture for the pool surface.
function makePoolTexture() {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = s;
  cv.height = s;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#2f5f7d";
  ctx.fillRect(0, 0, s, s);
  for (let r = 6; r < s * 0.7; r += 7) {
    const a = 0.05 + 0.12 * Math.random();
    ctx.strokeStyle = `rgba(220,240,255,${a})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(s / 2, s * 0.35, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * A stylized waterfall: a foamy sheet falling from an opening in the back wall
 * into a rippling pool. Excluded from the BVH (rtExclude) so it lights up in the
 * G-buffer without acting as a solid occluder. Animation is pure UV scroll, so
 * the geometry stays static and cheap.
 */
export function createWaterfall(scene, { x = -4.4, backZ = -6.8, floorY = 0 } = {}) {
  const group = new THREE.Group();

  const fallTex = makeFallTexture();
  const fallMat = new THREE.MeshStandardMaterial({
    map: fallTex,
    color: 0xbfe3f2,
    roughness: 0.22,
    metalness: 0.0,
    emissive: 0x1a3547,
    emissiveIntensity: 0.6,
  });
  // The falling sheet: tall, a touch in front of the back wall.
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 5.4, 1, 1), fallMat);
  sheet.position.set(x, floorY + 2.7, backZ + 0.35);
  sheet.userData.rtExclude = true;
  group.add(sheet);

  // A short angled lip where the water spills from the wall opening.
  const lip = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1, 1, 1), fallMat.clone());
  lip.material.map = fallTex;
  lip.position.set(x, floorY + 5.2, backZ + 0.62);
  lip.rotation.x = -Math.PI * 0.32;
  lip.userData.rtExclude = true;
  group.add(lip);

  // The pool.
  const poolTex = makePoolTexture();
  const poolMat = new THREE.MeshStandardMaterial({
    map: poolTex,
    color: 0x9fd4e8,
    roughness: 0.12,
    metalness: 0.0,
    emissive: 0x102734,
    emissiveIntensity: 0.5,
  });
  const poolR = 1.8;
  const poolZ = backZ + 1.3;
  const pool = new THREE.Mesh(new THREE.CircleGeometry(poolR, 40), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(x, floorY + 0.06, poolZ);
  pool.userData.rtExclude = true;
  group.add(pool);

  // A low stone rim around the pool (this one IS a solid occluder — real GI).
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x6b6f76, roughness: 0.8 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(poolR, 0.16, 8, 40), rimMat);
  rim.rotation.x = -Math.PI / 2;
  rim.position.set(x, floorY + 0.13, poolZ);
  group.add(rim);

  scene.add(group);

  return {
    group,
    sheet,
    pool,
    setVisible(v) {
      group.visible = v;
    },
    update(dt) {
      if (!group.visible) return;
      fallTex.offset.y -= dt * 1.1; // water races downward
      lip.material.map.offset.y -= dt * 1.1;
      poolTex.offset.y -= dt * 0.15;
      poolTex.offset.x += dt * 0.04;
    },
  };
}
