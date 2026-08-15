# SPEC: three-realtime-rt 0.15.0, "the defaults just work"

Owner of the design: Fable (main session), on the owner's rules. Implementer: agent. Working
tree: THIS worktree of the library repo (`C:\ClaudeSessions\RayTracingUpgradeChallenge`), branch
`feature/restir-0.15` from master `47b4422` (= 0.14.1 exactly), its own `node_modules/`, dev
server already running on http://localhost:8149/ (`node node_modules/vite/bin/vite.js --host
--port 8149 --strictPort` from this directory if it dies). Do not touch the main checkout, the
other rt-wt-* worktrees, or C:\ClaudeSessions\Hangar. Do not push, tag, publish, or bump anything
on master; commit small on this branch. `npm install` is allowed HERE (this is the library
source, not a node_modules copy), but you should not need it.

## Where the work comes from

Everything in `dev/hangar-engine.patch` was proven in the Hangar game against measurement gates
this week (each gate has a report; read them for what was measured and how):
`C:\ClaudeSessions\Hangar\dev\cold-fallback-REPORT.md`, `sun-edges-REPORT.md`,
`candidates-REPORT.md`, and `C:\ClaudeSessions\Hangar\engine-patches\README.md` (the older
pieces: two-way adaptive governor + GpuTimer deadlock, motion vectors for dynamic meshes,
stable light slots, dynamic-pixel ReSTIR options, multi-sample ReSTIR). The patch is a diff of
pristine 0.14.1 `src/` (this repo's master) against the game's engine copy; `patch -p1 --dry-run
< dev/hangar-engine.patch` reports nine files clean. Apply it first, commit it as one commit
("The Hangar engine work, verbatim"), then do the rest as separate commits so the diff of the
port itself is reviewable.

## The owner's rules for this release (verbatim, and binding)

1. "I would like the default settings for the library to just work so that anyone can simply
   add the RT library to their three js projects and see a beautiful result right away. This
   restir improvement feels like it should be a default."
2. "Restir should be our default for sure. It would be nice to be able to turn it off but with
   this fix it is a huge performance improvement."
3. "the demo needs more options to play with and we need a button to reset settings to the
   default, which should default to most things off. Defaulting to off is so that we can
   guarantee better performance on more devices."
4. New demo scene: "something with movement like a plinko game/machine with many light sources
   ... objects that fall from the top of the box/scene and bounce off of a few different
   objects into the void where they respawn at the top so it's like a waterfall and some of
   those objects could be light", placed after the Cornell box.

## Part 1: constructor defaults (src/RealtimeRaytracer.js, presets, d.ts, README)

Correctness fixes ON (cheap; they are the algorithm being right):
`restir: true` (already), `stochasticLights: false` (FLIP from true), `restirDirectionalBypass:
true`, `restirReprojectionRescue: true`, `restirCandidateImportance: true`, `restirClampRel: 2`,
`motionVectors: true`, `emissiveNEE: true` (already), `emissiveImportance: true` (already),
`denoise`/`taa`/`adaptiveQuality`/`overloadProtection` on (already). The governor fixes and
stable light slots are behaviour, not options.

Expensive features OFF: `gi: false` (FLIP), `volumetric.enabled: false` (already),
`kmScattering: false` (already), `restirGI: false` (already), `restirSamples: 1`,
`restirWarmAge: 0`, the two dynamic-pixel options off, `dispersion: 0`.

Material-gated features stay ON because they cost nothing when the scene has no such
material: `reflections`, `refraction`, `transparency`, `absorptionShadows`, `specular`.
(If you can show with bench.html that `specular` has a fixed cost above ~5% at 720p on the
museum with no glossy pixels, report it and leave it on anyway; that is a defaults decision
for the owner, not this pass.)

Every flipped default must be reflected in: the JSDoc block above the field, `src/index.d.ts`,
the README options table (`| option | default | ...`, around line 690) including NEW rows for
every option the patch introduced (restirWarmAge, restirDirectionalBypass,
restirReprojectionRescue, restirCandidateImportance, restirClampRel, motionVectors,
restirSamples, restirTapRadius, restirDynamicAccept/Freeze or whatever the patch named them),
`PRESETS` and `recommendedOptions(tier)` (a preset that says `gi: true` keeps saying it; a
preset that never mentioned gi now inherits off), and CHANGELOG.md under **0.15.0** with one line
per item and the defaults philosophy in one sentence quoting rule 1.

## Part 2: ambient light support (new, small; the reason GI can be off by default)

Today the compiler ignores `AmbientLight` and `HemisphereLight` (README's "Spot/Rect/Hemi
ignored" matrix), and there is no ambient term without a GI ray, so `gi: false` renders every
surface no light faces PURE BLACK. Add: `SceneCompiler` sums the visible AmbientLights into a
flat colour and the visible HemisphereLights into (skyColor, groundColor, up = light's world
+Y direction... three's HemisphereLight uses its position direction; use `light.position`
normalised, default +Y) and exposes them on the compiled scene and through `updateLights`;
`RTLightingPass` adds `albedo-demodulated ambient = flat + hemi(N)` to the DIRECT irradiance
(demodulated space, so the composite multiplies by albedo like everything else) with no ray,
in the same single call site structure (no new loops, no new samplers: it is a few uniforms).
Option `ambient: true` (default) to honour them; `false` = ignore, byte-identical stock (use
the RT_ marker style). README: move Ambient/Hemi from "ignored" to "flat/hemi ambient (no
occlusion)". Selftest: add an assertion that a scene with only an AmbientLight is not black.
Keep it honest in the docs: it is unoccluded ambient, not GI; `gi: true` remains the real
thing.

## Part 3: demo (index.html + examples/main.js, ui.js, panel.js) and gallery (gallery.html +
examples/gallery.js)

- Expose EVERY new option in the panel with a sensible control: sun bypass (toggle),
  reprojection rescue (toggle), candidate importance (toggle), relative cap (slider 0-4),
  warm age (slider 0-64), motion vectors (toggle), multi-sample (1-4), stochastic lights
  (toggle, exists?), ambient (toggle). Group them under the existing ReSTIR section.
- A **Reset to defaults** button in both the demo panel and the gallery strip: re-applies the
  library's constructor defaults for every exposed option (build the default object once from
  a fresh `new RealtimeRaytracer` on the same renderer or from a static
  `RealtimeRaytracer.DEFAULTS` you add and export), re-syncs the UI, and `resetAccumulation()`.
  If any setting is persisted anywhere (sessionStorage/localStorage; today only tour.js uses
  sessionStorage), the button clears that too. Verify by changing five things, pressing it,
  and reading the values back.
- The demo's boot config: the "tested MINIMAL" start in examples/main.js was built when the
  defaults were heavy; re-read that block and make it consistent with the new defaults (it
  should now be able to start ON the defaults on desktop tiers, still with the governor; keep
  the phone tiers where they are unless measurement says otherwise). Report what you changed.

## Part 4: the waterfall scene (gallery.html, after the Cornell box)

Register `waterfall` in `examples/gallery-scenes.js` SCENES + SCENE_LIST right after `cornell`
and in gallery.html's `<select>` right after "Cornell box (the classic)". Composition:
- A tall open-fronted box (back wall, two side walls, no floor at the bottom = the void),
  ~6 wide x 10 tall x 3 deep in library units, dull grey walls; 4-5 staggered rows of pegs
  (short cylinders or spheres, radius ~0.15) across the width, static (in the BVH), plus two
  or three angled deflector slabs so the fall is not a straight drop.
- The dynamic bodies use `examples/physics.js`'s `Physics` pool (recompile-free, refit per
  frame): ~40 bodies, mix of spheres and cubes ~0.25 across, dropped from a hopper line at
  the top at random x, respawned at the top when they fall below the kill plane (the pool
  already has a kill-floor respawn idea from the museum; reuse or extend it). Continuous:
  it should never stop.
- Light: 6 of the bodies emissive (dynamic emissive tris are supported; keep each one
  low-poly, the NEE cap is 256 tris shared) and 4 point lights parented to bodies (updateLights
  every frame; the stable-slot logic makes the reservoirs survive their motion), plus one dim
  static fill and one static lamp above the hopper. Total lights well under 32.
- Camera: fixed three-quarter view showing the whole board; OrbitControls as elsewhere.
- Verify: it runs (fps badge) at 720p on this GPU with the new defaults; a 30-frame capture
  shows bodies moving and no BVH blowups (`compiled.dynamic` bounds sane, no "rebuild"
  storms in the console); the emissive bodies actually light the pegs (compare a frame with
  emissiveNEE off). Save 3 frames under dev/shots/.

## Part 5: the checks that gate this release (all must run; report numbers with floors)

1. `npm run test:render` (both three legs: pinned 0.160.1 and three-latest) passes; report the
   meanLum/irrLum numbers before (master) and after (this branch); with GI now off the numbers
   WILL move, say by how much and that the ambient assertion passes.
2. `npm run test:km` 27/27.
3. Byte-identity of the legacy path: with EVERY new option off and the flipped defaults set
   back to their 0.14.1 values (`gi:true, stochasticLights:true, restir* off, motionVectors
   false, ambient false`), the shader sources of every pass must be byte-identical to master's
   (dump `material.fragmentShader` after construction on both, sha256), and a frozen render
   of the museum from the same seed must match. If the patch's `RT_*` markers are uniform-gated
   rather than spliced, sources will differ by the uniform declarations; then the frozen render
   is the gate and you report which files differ and by how many lines.
4. WebKit budgets in `src/RTLightingPass.js`: count textual `traceRadiance(` call sites (master
   already has 4; you must not add any) and confirm the per-light loop has ONE call site
   (`shadeLightSet`), and the pass still binds exactly 16 samplers (list them). RestirPass
   sampler count too.
5. bench.html, museum, 720p, defaults-old (0.14.1 constructor defaults) vs defaults-new: fence-
   timed ms, twice each. Report the delta and what drives it (GI off saves; sun bypass costs
   one ray if the museum has a directional light; ambient is free).
6. `npx tsc --noEmit` on the d.ts if the repo has that check (see how index.d.ts was verified
   before, `git log --grep d.ts`), else at least `node -e "import('./src/index.js')"`.
7. `npm pack --dry-run` lists only src + docs it should (compare to 0.14.1's file list).

## Deliverables

Commits on `feature/restir-0.15`: (a) the patch verbatim, (b) defaults + JSDoc + d.ts + presets,
(c) ambient light support, (d) demo knobs + Reset, (e) waterfall scene, (f) README + CHANGELOG
+ package.json version 0.15.0, (g) `dev/PORT-0.15-REPORT.md` with every check above and its
numbers, the frames, and anything that surprised you. Final message = that report. No em
dashes, no emojis, headed chromium only for anything visual on this machine (`--use-angle=gl`).
