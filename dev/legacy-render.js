/**
 * Frozen legacy render — release check 3 for 0.15.0, the GPU half.
 *
 *   /dev/legacy-render.html?opts=legacy   the 0.14.1 option set
 *   /dev/legacy-render.html?opts=new      whatever the constructor defaults are
 *
 * dev/legacy-identity.mjs shows the SOURCE of six shader variants differs from
 * master, because the Hangar work is uniform-gated rather than source-spliced.
 * The spec's fallback gate for that case is a frozen render, and this is it: the
 * museum, one fixed pose, a fixed number of renders from a fresh renderer, and a
 * hash of the drawing buffer. Run it on this branch with `?opts=legacy`, then
 * check master's src/ out over the top and run the same URL again: if the two
 * hashes match, this branch with the new options off IS 0.14.1 on the GPU,
 * whatever the shader text says.
 *
 * Why not museum.html: its render loop steps physics, deforms water on a
 * wall-clock dt and advances a skinned fox, so the same protocol does not
 * reproduce its own bytes. Here the museum scene is compiled STATIC (no
 * dynamicMeshes, no updateDynamic), the camera is pinned and rt.render is driven
 * directly with no rAF, so every source of wall-clock nondeterminism is gone —
 * which the ?opts=legacy arm's own run-to-run floor proves rather than assumes.
 *
 * Options are all passed EXPLICITLY in both arms, including options master has
 * never heard of (it ignores them), so the arms differ only in the values under
 * test and never in which side had to fall back on a default.
 */
import * as THREE from "three";
import { RealtimeRaytracer } from "../src/index.js";
import { buildScene } from "../examples/scene.js";

const P = new URLSearchParams(location.search);
const ARM = P.get("opts") === "new" ? "new" : "legacy";
const FRAMES = parseInt(P.get("frames") || "120", 10);
// ?plus=1 turns on the three consumers of the shared BVH traversal chunk that
// the default option set leaves off: restirGI (GIReservoirPass), volumetric
// (VolumetricPass) and reflections/refraction (more shadow rays out of
// RTLightingPass). Added for the 0.16.9 portability change, whose whole risk is
// in that shared chunk, so the frozen render has to compile and drive every
// program that includes it rather than just the lighting pass.
const PLUS = P.get("plus") === "1";
const W = 1280, H = 720;

const out = document.getElementById("verdict");
const say = (t) => { out.textContent = t; };

// The 0.14.1 constructor defaults, written out. Everything 0.15.0 introduced is
// off and everything it flipped is back. Master ignores the keys it does not
// know, which is the point: both arms are handed the same object.
const LEGACY = {
  gi: true,
  stochasticLights: true,
  ambient: false,
  motionVectors: false,
  restirWarmAge: 0,
  restirDirectionalBypass: false,
  restirReprojectionRescue: false,
  restirCandidateImportance: false,
  restirClampRel: 0,
  restirSamples: 1,
  restirSampleRadius: 10,
  restirDynamicAccept: false,
  restirDynamicFreeze: false,
};

async function main() {
  say(`building the museum (arm: ${ARM}, ${FRAMES} renders)…`);
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  document.getElementById("app").appendChild(renderer.domElement);
  const gl = renderer.getContext();

  const built = buildScene();
  await built.ready;
  const scene = built.scene;
  // The museum hides some fixtures by default; force every light visible so the
  // arms cannot differ over which lights a lazy traversal happened to see.
  scene.traverse((o) => { if (o.isLight) o.visible = true; });

  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
  camera.position.set(6, 3.8, 8);
  camera.lookAt(0, 1.2, 0);
  camera.updateMatrixWorld();

  const rt = new RealtimeRaytracer(renderer, {
    // Fixed, in BOTH arms, so nothing here is under test.
    renderScale: 0.5,
    denoiseIterations: 2,
    adaptiveQuality: false,     // the governor must not move under the gate
    overloadProtection: false,  // nor the emergency brake
    taa: true,
    denoise: true,
    envColor: new THREE.Color(0x121821),
    envIntensity: 1.0,
    sky: { enabled: false },
    // The arm.
    ...(ARM === "legacy" ? LEGACY : {}),
    ...(PLUS ? {
      restirGI: true,
      reflections: true,
      refraction: true,
      volumetric: { enabled: true },
    } : {}),
  });
  rt.compileScene(scene); // STATIC: no dynamicMeshes, so nothing moves
  rt.updateLights(scene);

  say(`rendering ${FRAMES} frames…`);
  await new Promise((r) => setTimeout(r, 50));
  for (let i = 0; i < FRAMES; i++) rt.render(scene, camera);

  // Hash the drawing buffer in the SAME task as the last render.
  const buf = new Uint8Array(W * H * 4);
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  // FNV-1a over the RGB bytes. Alpha is skipped: it is 255 everywhere and only
  // adds work.
  let h = 0x811c9dc5;
  let lum = 0;
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    for (let c = 0; c < 3; c++) {
      h ^= buf[p + c];
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    lum += 0.2126 * buf[p] + 0.7152 * buf[p + 1] + 0.0722 * buf[p + 2];
  }

  const verdict = {
    arm: ARM,
    plus: PLUS,
    restirGI: !!rt.restirGI,
    volumetric: !!(rt.volumetric && rt.volumetric.enabled),
    reflections: !!rt.reflections,
    frames: FRAMES,
    hash: h.toString(16).padStart(8, "0"),
    meanLum: Math.round((lum / (W * H)) * 100) / 100,
    tris: rt.compiled.triangleCount,
    lights: rt.compiled.lightCount,
    emissiveTris: rt.compiled.emissiveTriCount,
    // Present on this branch, undefined on master — which is itself a useful
    // "am I actually running the tree I think I am" signal in the output.
    hasAmbientOption: typeof rt.ambient,
    hasMotionVectors: typeof rt.motionVectorsSupported,
    statusOk: !!(rt.status && rt.status.ok),
    resolution: `${W}x${H}`,
  };
  const line = JSON.stringify(verdict);
  console.log("[legacy-render] " + line);
  say(line);
  let node = document.getElementById("selftest-verdict");
  if (!node) {
    node = document.createElement("div");
    node.id = "selftest-verdict";
    node.style.cssText = "position:fixed;left:-99999px;top:0;white-space:pre;";
    document.body.appendChild(node);
  }
  node.textContent = line;
}

main().catch((err) => {
  const line = JSON.stringify({ arm: ARM, threw: true, error: String(err && err.message || err) });
  say(line);
  const node = document.createElement("div");
  node.id = "selftest-verdict";
  node.style.cssText = "position:fixed;left:-99999px;top:0;white-space:pre;";
  node.textContent = line;
  document.body.appendChild(node);
  console.error(err);
});
