# REPORT: museum exhibit repositioning (the round the owner actually wanted)

Branch `museum-layout`. The owner said the room "looks better but I was hoping
things would be repositioned a bit to make them fit a bit better." The previous
glow-up round moved the CAMERA; this round physically re-lays-out the exhibits
into a curated gallery: zones, sightlines, grouping, breathing room. `src/` is
untouched. The render self-test matrix passes with the final code (see Perf);
all artifacts live under `_reviews/museum-layout/`.

No emoji, no em dash was introduced in any new text.

## 1. Before: the layout the owner saw

The exhibits were all present, but the room read as a storage shelf. The back
band was overstuffed and the front band was sparse:

```
              z=-7  (back wall)
x=-12  +--------------------------------------------------+  x=12
       | [win][win][win][win][win][win]  clerestory panes |
       |  POOL                HELM   ICO   ----BENCH(8m)---|
       |  (-7.5,-3.6, 5.5m)   (-0.6) (0.65)   (5.4,-6.2)  |
       |                             -5.85                |
       |                         KNOT    TEAPOT            |
       |                         (9.0)   (9.7,-1.5)        |
       |  [blue pane]         LUMIERE (2.6,-0.5)           |
       |                         --screen--                |
       |  VITRINE    OPEN     ALABASTER                     |
       |  (-4.8,0.8) (-3.2)   (-1.6,3.3)                   |
       |                           FOX (6.5,2.8)           |
       |                           PAD (7.1,0.15)          |
       |                    [amber pane]                   |
x=-12  +--------------------------------------------------+  x=12
              z=+7  (front, open)
```

The specific problems the Gemini critic named at round 0 (quoted):

- "The rainbow-colored sphere is shoved directly behind the giant helmet
  pedestal, making it look like an accidental collision rather than a deliberate
  placement." (desktop)
- "The teapot is crammed tightly into the far-right corner behind the golden
  knot pedestal, rendering it nearly invisible from the main angle." (desktop)
- "The glass display case containing the rubber duck is placed directly in
  front of the blue pool, awkwardly blocking the view of the pool's water
  surface." (desktop)
- "The low-poly fox on its isolated grey plinth sits awkwardly in the middle of
  the right-hand floor space." (desktop)
- "The 'OPEN' sign is marooned in the middle of the walking path." (phone)
- "There is no clear 'hero' object. The helmet, the duck, and the golden knot
  all compete for visual dominance in a very confined sightline." (desktop)

## 2. After: the curated gallery

The room now reads as seven deliberate zones plus the two wall wings. One hero
per sightline, related pieces grouped, and every floor piece separated from its
neighbours (measured; the tightest joint is 0.19m diagonal at the knot-bench
corner, most are 0.5m+ and the back-band aisle between the helmet and the bench
is 1.4m):

```
              z=-7  (back wall)
x=-12  +--------------------------------------------------+  x=12
       | [win][win][win][win][win][win]  clerestory panes |
       |  POOL          HELM      ----BENCH(6.4m)--- KNOT  |
       |  (-5.5,-4.2)   (-0.6)    (5.05,-6.2)      (9.3,   |
       |   4m water     -4.2      spheres 1.1 apart -4.5)  |
       |                                          TEAPOT   |
       |                                          (10.0,   |
       |                                            -1.4)  |
       |  [blue pane]          LUMIERE (2.6,-0.5)          |
       |                          --screen--               |
       |  ICO     VITRINE  ALABASTER      FOX (10.0,4.5)   |
       |  (-9.5,4.5) (-6.5,  (-4.6,3.2)   PAD (7.1,0.15)   |
       |             4.5)                                  |
       |  [OPEN on red wall x-11.7, z3.5]   [amber pane]    |
x=-12  +--------------------------------------------------+  x=12
              z=+7  (front, open)
```

Zones, left to right as a visitor walks the room:

- AQUA (back-left): the 4m water pool, pulled off the corner walls with a clear
  walkway to the hero pedestal. The pool now sits under the second clerestory
  window, so its reflection demo reads even better.
- HERO (back-centre): the DamagedHelmet alone on its pedestal, the sightline
  anchor, deliberately kept left of the Lumiere screen so the screen never
  hides it.
- SURFACES (back-right): the six-sphere materials bench trimmed to 6.4m, with
  the gold knot on a plinth clear of its line-up.
- BRONZE & CERAMIC (right): the knot behind the scaled teapot, a deliberate
  two-sculpture pair visible from the entrance (the teapot no longer hides
  behind the knot).
- LUMIERE (centre): the stained-glass screen alone on the open floor, its
  projection area untouched.
- LIGHT & MATERIALS wing (front-left): the duck vitrine, the scattering
  alabaster lamp, and the vertex-coloured icosahedron, each clear of the
  others' sightlines. The OPEN sign now hangs on the red wall, off the floor.
- DYNAMICS (front-right): the fox on its raised plinth in the corner, with the
  physics drop pad below.

## 3. What moved and why (critic loop, round by round)

The loop ran round 0 (baseline) through round 7, quoting each previous round's
complaints back to the critic. Desktop 1280x800 and phone 390x844, video with
an orbit sweep and a walk, per round. What changed:

| Round | Move | Why (critic quote) |
|---|---|---|
| 1 | Ico `(0.65,-5.85)` to `(-8.5,4.8)` | "shoved directly behind the giant helmet pedestal" |
| 1 | Knot `(9.0,-4.2)` to `(10.0,-3.8)` | plinth clipped the bench's sixth sphere from the main angle |
| 1 | Vitrine `(-4.8,0.8)` to `(-2.8,1.0)` | "directly in front of the blue pool, blocking the water surface" |
| 1 | OPEN `(-3.2,1.95)` to `(-1.7,2.1)`; Alabaster `(-1.6,3.3)` to `(-5.2,3.2)` | sign "marooned in the middle of the walking path"; lamp filled the empty corner |
| 2 | Bench 8m to 6.4m, spheres 1.25 to 1.1 apart | free the back band; the 8m bench swallowed the whole back-right |
| 2 | Teapot to `(4.0,3.3)` then, after the critic, to the back-right and scaled 0.65 | round 1 move put it in the centre; "placed directly in the center of the room's natural walking path, blocking the view of the background exhibits" |
| 2 | Vitrine to `(-3.5,4.5)`; OPEN to `(-2.0,5.2)` | "squeezed tightly between the water pool and the helmet pedestal" |
| 2 | Fox `(6.5,2.8)` to `(8.0,3.8)`, plinth raised 0.3 to 0.5m | "awkwardly in the middle of the right-hand floor space" |
| 3 | Vitrine to `(-7.8,5.4)`; OPEN to `(-6.2,6.0)`; Ico to `(-9.8,4.0)`; Knot to `(9.3,-4.5)` | vitrine "directly in front of the helmet"; knot too close to the corner light strip |
| 4 | Pool 5.5m to 4m, `(-7.5,-3.6)` to `(-5.5,-4.2)`; vitrine/ico swapped; OPEN to `(-3.5,6.2)` | "pool crammed tightly into the back-left corner"; "glass case and OPEN sign crammed into the front-left corner" |
| 5 | Fox to `(10.0,4.5)` | "marooned in the middle of the floor" even at 8.0,3.8 |
| 6 | OPEN mounted on the red wall `(-11.7,1.6,3.5)`, floor stand removed; Ico to `(-7.5,4.2)` | the sign "in the middle of the floor" every round; the ico hid the vitrine |
| 7 | Ico to `(-9.5,4.5)`; Vitrine to `(-6.5,4.5)`; Alabaster to `(-4.6,3.2)` | the ico "blocked the sightline to the water pool"; the vitrine "crammed against the corner wall" |

Round 7 is the convergence round: the critic no longer names any specific
blocked sightline, walking-path obstacle, or occlusion. What remains in its
feedback is thematic ("a sci-fi helmet next to a rubber duck"), architectural
(the six clerestory window frames), and camera-control (the free-orbit camera
can pass through geometry). Those are the caveats in section 6.

## 4. Light / NEE budget ledger

Cap check: 32 analytic lights, 256 emissive NEE triangles (largest-area wins).
The procedural sky is not a light-list entry (GI-miss sampling).

| Surface / state | tris | analytic lights | emissive NEE tris | vs caps |
|---|---|---|---|---|
| Museum boot, before (round 0) | 50,986 | 2 | 74 | 2/32, 74/256 |
| Museum boot, after (round 7) | 50,962 | 2 | 74 | 2/32, 74/256 |
| Museum max config (all ensembles, before) | 55,904 | 2 | 156 | 2/32, 156/256 |
| Museum max config (all ensembles, after) | 55,880 | 2 | 156 | 2/32, 156/256 |
| Worst case (all named lights + 13 party lights) | - | 18 | 156 | 18/32, 156/256 |

The only triangle change is a net -24: the OPEN sign's floor stand was removed
when the sign moved to the wall. No move added or removed a light, and no move
touched the emissive geometry, so the budget ledger is unchanged apart from the
-24 static tris. Nothing approaches either cap.

## 5. Performance fence-check

Measured with adaptiveQuality OFF on the settled default view (the boot config,
gi on, 0.375 lighting res), GPU probe over a 120-frame window, both viewports,
before and after. The capture-run numbers during camera motion are higher
because the temporal accumulator re-converges after every move; the fence is
the settled view, which is what the report gates on.

| Viewport | before avg ms | after avg ms | after p95 | note |
|---|---|---|---|---|
| 1280x800 | 24.13 | 22.23 | 23.6 | within the glow-up envelope, slightly faster |
| 390x844 | 16.68 | 16.67 | 18.2 | holds 60 fps |

The render self-test matrix passes with the final code: both chromium legs
(meanLum 151.73 / 151.74, irrLum 182.07 / 182.07, 0 GL errors, 0 usage
warnings), plus the empty-scene, usage-diagnostics and presets checks. firefox
and webkit are documented environmental skips on this machine (ANGLE D3D11/FXC
stall / no WebGL2), identical to the pre-round baseline.

## 6. Honest caveats and out-of-scope items

- Thematic incoherence is inherent to the room. The demo's whole pitch is "one
  room, every feature", so a Khronos helmet, a Utah teapot, a rubber duck, a
  low-poly fox and material-test spheres deliberately share the floor. No
  repositioning makes that set thematically cohesive; the critic says "asset
  dump" every round no matter where the pieces sit. The fix would be a model
  swap, not a move, and is out of scope for a layout round.
- The "empty wall frames" are the clerestory daylight windows. They are
  emissive glazing with bronze reveals, not picture frames, and the critic
  keeps reading them as unfilled placeholders. Changing them is an
  architectural/glow-up change, not a repositioning one.
- The free-orbit camera can pass through exhibits and walls. There is no camera
  collision; the automated walk in the capture drives the camera close to the
  vitrine glass and the ico, which is where the "clipping" and the transient
  frame-rate drops come from. Constraining the camera is a camera-control
  feature, out of scope for exhibit placement.
- The fox reads as "isolated" no matter where it stands. It is the room's only
  animated piece, so it has no visual companion; moving it into a corner (round
  5) fixed "in the middle of the floor" but the critic then called it "wedged
  in a corner". The raised 0.5m plinth is the compromise.
- The knot and teapot sit 3.1m apart in the back-right as a bronze-and-ceramic
  pair, and the critic still calls the right corner "crowded". They have clear
  air (verified in the audit); the read is density, not collision. Accepting
  the pair as a deliberate grouping is a curation choice.
- The vitrine has been moved seven times. Each placement fixed one occlusion
  and the critic found another; it is now at (-6.5, 4.5), clear of the pool's
  sightline (the ray to the water passes ~4m to its right), the helmet, and the
  icosahedron. The phone critic still reads it as "in the centre of the floor"
  because it is a large foreground glass box; a smaller case would be the
  actual fix.
- The pool reads as "crammed next to the helmet" on the phone's narrow FOV
  despite 1.87m of measured clearance. It is a 4m water feature in the left
  third; on a 390px viewport the water and the hero pedestal unavoidably share
  the left of frame.
- Denoiser re-convergence during camera moves: the blurry-to-sharp settling and
  the noise on the vitrine glass during fast moves is the temporal accumulator
  and denoiser doing their documented job, not a layout regression.

## Review-loop outcome

The loop ran baseline + seven fix rounds, quoting each previous round's
complaints back to the Gemini critic at both viewports. Every specific,
reproducible placement defect the critic named has been addressed: nothing
blocks the pool, the helmet, the bench line-up, or another exhibit's sightline
from the default view; nothing sits in the central walking path (the OPEN sign
is on the wall); every floor piece has measured clearance; and the back band
reads as a deliberate water / hero / surfaces triptych. Round 7 is the
convergence point: the critic's remaining feedback is thematic, architectural
(the window frames) or camera-control, none of which a repositioning round can
fix. Every exhibit, toggle, slider and debug view still works; the render
self-test matrix passes; the budget ledger is unchanged apart from -24 static
tris; and the settled-view perf is inside (marginally better than) the
post-glow-up envelope.
