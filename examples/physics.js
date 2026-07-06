import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

// A small colourful palette for the props (kept saturated so colour bleed / GI
// reads clearly when they pile up next to the white floor and coloured walls).
const PROP_COLORS = [
  0xe23c3c, 0xf59e2b, 0xf2d024, 0x53c14f, 0x2bb3c4,
  0x3f6fe2, 0x8b57d9, 0xe25aa8, 0xef6f4a, 0x38c99a,
];

/**
 * Rapier physics playground. Owns a fixed pool of dynamic rigid bodies whose
 * three.js meshes are handed to the raytracer as `dynamicMeshes` once, so the
 * BVH layout never changes — "spawning" is really just re-activating pooled
 * bodies (teleport + wake), which keeps everything recompile-free.
 */
export class Physics {
  constructor() {
    this.world = null;
    this.props = []; // { mesh, body, home:{p,q} }
    this.meshes = []; // just the meshes, for compileScene({dynamicMeshes})
    this._q = new THREE.Quaternion();
  }

  static async create() {
    await RAPIER.init();
    const p = new Physics();
    p.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    return p;
  }

  /** Fixed floor + wall colliders matching the visual room (half-extents). */
  buildStaticColliders(bounds) {
    const { world } = this;
    const b = bounds; // { x: 7, z: 7, wallH: 6, floorY: 0 }
    const fixed = (hx, hy, hz, x, y, z) => {
      const rb = world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z)
      );
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(hx, hy, hz).setFriction(0.9).setRestitution(0.15),
        rb
      );
    };
    fixed(b.x, 0.1, b.z, 0, b.floorY - 0.1, 0); // floor
    fixed(0.1, b.wallH, b.z, -b.x, b.wallH, 0); // left wall
    fixed(0.1, b.wallH, b.z, b.x, b.wallH, 0); // right wall
    fixed(b.x, b.wallH, 0.1, 0, b.wallH, -b.z); // back wall
    fixed(b.x, b.wallH, 0.1, 0, b.wallH, b.z); // front (invisible) wall keeps props in view
  }

  /**
   * Create `count` dynamic props (mixed boxes + low-poly spheres), add their
   * meshes to `scene`, and rest them in a tidy pyramid on the given pad.
   */
  spawnPool(scene, count, pad) {
    for (let i = 0; i < count; i++) {
      const color = PROP_COLORS[i % PROP_COLORS.length];
      const isBox = i % 3 !== 0; // ~2/3 boxes, 1/3 spheres
      let geo, colliderDesc;
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.45,
        metalness: 0.0,
      });
      if (isBox) {
        const s = 0.5;
        geo = new THREE.BoxGeometry(s, s, s);
        colliderDesc = RAPIER.ColliderDesc.cuboid(s / 2, s / 2, s / 2);
      } else {
        const r = 0.32;
        geo = new THREE.SphereGeometry(r, 14, 10);
        colliderDesc = RAPIER.ColliderDesc.ball(r);
      }
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      scene.add(mesh);

      const body = this.world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setLinearDamping(0.05)
          .setAngularDamping(0.05)
      );
      this.world.createCollider(
        colliderDesc.setRestitution(0.3).setFriction(0.8).setDensity(1.2),
        body
      );

      this.props.push({ mesh, body, home: new THREE.Vector3() });
      this.meshes.push(mesh);
    }
    this._layout(pad);
    this.sync();
  }

  /** Rest the pool in a neat pyramid centred on `pad` (also the reset pose). */
  _layout(pad) {
    const perRow = 5;
    const spacing = 0.62;
    let i = 0;
    for (const prop of this.props) {
      const layer = Math.floor(i / (perRow * perRow));
      const inLayer = i % (perRow * perRow);
      const row = Math.floor(inLayer / perRow);
      const col = inLayer % perRow;
      const x = pad.x + (col - (perRow - 1) / 2) * spacing;
      const z = pad.z + (row - (perRow - 1) / 2) * spacing;
      const y = pad.y + 0.3 + layer * 0.6;
      prop.home.set(x, y, z);
      this._place(prop, x, y, z);
      i++;
    }
  }

  _place(prop, x, y, z) {
    prop.body.setTranslation({ x, y, z }, true);
    prop.body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    prop.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    prop.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  /** Rain the whole pool down from a height for a lively tumbling pile. */
  dropWave() {
    for (const prop of this.props) {
      const h = prop.home;
      const x = h.x + (fract(h.x * 12.9898) - 0.5) * 3.0;
      const z = h.z + (fract(h.z * 78.233) - 0.5) * 3.0;
      const y = 5.0 + fract(h.x * 3.7 + h.z) * 3.0;
      prop.body.setTranslation({ x, y, z }, true);
      prop.body.setRotation(
        new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(h.x, h.z, h.y))
          .clone(),
        true
      );
      prop.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      prop.body.setAngvel({ x: h.z, y: h.x, z: 1 }, true);
      prop.body.wakeUp();
    }
  }

  /** Radial impulse from a centre point — scatter the pile outward. */
  explode(center = new THREE.Vector3(0, 0.5, 0), strength = 14) {
    for (const prop of this.props) {
      const t = prop.body.translation();
      const dir = new THREE.Vector3(t.x - center.x, t.y - center.y + 0.2, t.z - center.z);
      const d = dir.length() || 1;
      dir.multiplyScalar(strength / (d * d + 0.5));
      dir.y = Math.abs(dir.y) + 4;
      prop.body.applyImpulse({ x: dir.x, y: dir.y, z: dir.z }, true);
      prop.body.applyTorqueImpulse(
        { x: dir.z * 0.2, y: dir.x * 0.2, z: dir.y * 0.1 },
        true
      );
      prop.body.wakeUp();
    }
  }

  /** Return everything to the tidy rest pyramid. */
  reset() {
    for (const prop of this.props) {
      this._place(prop, prop.home.x, prop.home.y, prop.home.z);
    }
    this.sync();
  }

  setGravity(y) {
    this.world.gravity = { x: 0, y, z: 0 };
    for (const prop of this.props) prop.body.wakeUp();
  }

  step() {
    this.world.step();
    this.sync();
  }

  /**
   * True while any body is still awake. Rapier sleeps bodies once they settle,
   * so this lets the render loop skip the (relatively expensive) per-frame BVH
   * refit whenever the pile is at rest — a big FPS win in the common case.
   */
  anyAwake() {
    for (const { body } of this.props) if (!body.isSleeping()) return true;
    return false;
  }

  /** Copy body transforms onto their meshes. */
  sync() {
    for (const { mesh, body } of this.props) {
      const t = body.translation();
      const r = body.rotation();
      mesh.position.set(t.x, t.y, t.z);
      mesh.quaternion.set(r.x, r.y, r.z, r.w);
      mesh.updateMatrixWorld();
    }
  }
}

function fract(x) {
  return x - Math.floor(x);
}
