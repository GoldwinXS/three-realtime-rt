# REPORT: museum-room + gallery look-and-feel glow-up (critic-looped)

Branch `gallery-glowup`. The round the spec calls "museum room (index.html +
examples/main.js)" is actually served by `museum.html` + `examples/main.js`:
`index.html` is the tour's first stop (the Cornell box, `examples/cornell.js`).
The museum scene build lives in `examples/scene.js`, not `main.js`. This report
treats the museum surface as `museum.html` + `examples/main.js` +
`examples/scene.js` + `examples/ui.js` and the gallery surface as
`gallery.html` + `examples/gallery.js` + `examples/gallery-scenes.js`. The spec's
"index.html (chrome/CSS)" is read as the museum's own page chrome, which is
`museum.html`. `src/` is untouched this round.

No emoji, no em dash was introduced in any new text. The render self-test
matrix and the museum's own `?selftest=1` both pass with the final code (see
Perf section). All artifacts live under `_reviews/museum-glowup/`.

## 1. Baseline diagnosis (Gemini critic, quoted)

Four baseline captures were run with `critic.py --gpu --mode video` on mobile
390x844 and desktop 1280x800, with the spec's open question. These are the
problems the critic named before any fix.

### Museum (round-0)

- Void ceiling and void windows:
  "The room lacks a ceiling, exposing a black void above." (museum desktop)
  "The three square windows on the back wall emit a flat, blinding white light
  with no environmental context outside, making them look like self-illuminated
  panels rather than actual windows." (museum desktop)
  "The ceiling is a black void, making the room feel like an open-topped box
  rather than a physical structure." (museum mobile)
- Flat materials:
  "The walls (solid red, white, blue) and floor (solid grey) are completely
  devoid of texture, roughness variation, or normal maps, giving the scene an
  unfinished aesthetic." (museum desktop)
- Composition:
  "The objects are clustered haphazardly. The fox on the platform in the bottom
  right corner feels completely disconnected from the rest of the 'museum'
  layout." (museum desktop)
  "Objects are awkwardly crowded on the right side of the frame, while the left
  side features an empty pool of water that is abruptly cut off by the viewport
  edge." (museum mobile)
- The emissive sign:
  "The 'OPEN' label on the glass cube looks exactly like an interactive UI
  button. First-time users will likely try to click it." (museum desktop)
- Mobile chrome:
  "The top bar text ('43 fps', 'three-realtime-rt') is extremely small and
  difficult to read on a phone screen." (museum mobile)
  "The bottom navigation buttons (< prev and next >) are cramped and placed too
  close to the 'RAY TRACING' toggle above them and the page indicator dots below
  them, risking accidental mis-hits." (museum mobile)

### Gallery (round-0)

- The disc-in-void:
  "The sterile, flat light-grey background gradient used across all scenes feels
  clinical and fails to provide any interesting environmental context."
  (gallery desktop)
  "The uniform, flat light-grey background lacks any horizon line, skybox, or
  environmental depth. This makes the objects feel like they are floating in an
  artificial void." (gallery mobile)
  "The dark grey ground disc is razor-thin with no visible edge bevel or
  thickness. It does not blend into the background, breaking the illusion of a
  solid floor." (gallery mobile)
- Tokyo's contradiction:
  "The diorama sits on a pitch-black disc that has no visible texture or depth,
  making the model look like it is floating in a void. The shadow cast onto the
  disc is barely visible." (gallery desktop)
  "The bright, flat background completely contradicts the cozy, night-time
  aesthetic of a Japanese street corner with glowing lanterns." (gallery
  desktop)
- Missing reflections:
  "The metallic clearcoat paint of the car looks dull and plastic because there
  is no high-dynamic-range (HDR) environment skybox to reflect." (gallery
  desktop)
- Framing:
  "The camera is positioned too far away initially, leaving too much empty grey
  space around the model." (gallery desktop, fox)
  "For Littlest Tokyo and the Toy Car, the camera is too close, causing the
  bases of the models to clip past the bottom edge of the viewport during
  rotation." (gallery mobile)
- Mobile control card:
  "The card is pinned to the top-left and occupies nearly a third of the screen
  height, directly overlapping and obscuring the 3D models during interaction."
  (gallery mobile)

## 2. What changed per round and why

### Round 1: the sky experiment + materials + framing

The owner's two asks in one pass: put a real sky under the museum's open
ceiling, and turn the gallery's "specimen on a dish in blackness" into a
grounded turntable. The engine's procedural `sky` option was already plumbed
through both demos; neither was using it as the owner wanted.

Museum (`examples/scene.js`, `examples/main.js`):

- Enabled the procedural sky with a dusk palette (deep blue zenith, warm
  horizon band, low amber sun, intensity ~0.9). The room's open ceiling and the
  clerestory windows now look out on sky instead of a black void, and the
  metals and the water pool have something to reflect. This is the owner's
  "procedural-sky experiment".
- Rebalanced the two gallery key lights (warm 30->27, cool 22->20) and cooled
  the cool key slightly, so the added sky ambient keeps the evening-gallery mood
  rather than drifting toward noon. The spec's warning about this was measured,
  not assumed.
- Added procedural stone/plaster textures to the floor and the back wall
  (canvas-generated, deterministic, no assets): the critic's "flat grey plane"
  complaint.
- Softened the clerestory windows from hard white to a soft sky tone and framed
  each with bronze reveals so they read as built-in glazing, not floating
  emissive panels.
- Re-centred the default camera and orbit target on the middle of the frieze so
  the default view reads the left-to-right sweep (pool, hero, materials) instead
  of crowding the right half.

Gallery (`examples/gallery-scenes.js`, `examples/gallery.js`, `gallery.html`):

- Replaced the single generic "day" sky with per-scene palettes: golden hour
  for the fox and the warm-metal pieces, a deep dusk for Littlest Tokyo, and
  bright studio daylight for the clearcoat/showcase pieces. The directional sun
  is now placed ALONG the same `sunDir` the sky uses, so direct shadows line up
  with the sky's sun disk.
- Reworked the ground disc so its radial falloff fades into each scene's
  horizon colour instead of to black, so the platform reads as a lit turntable
  receding into the sky rather than a dark dish in a void.
- Gave Tokyo two low-colour analytic spill lights beside its existing sun+fill:
  the model ships ~88k emissive triangles, the engine keeps only the 256
  largest by area, so its neon reads as glowing but casts almost no light. The
  spills simulate the ambient spill the NEE cap drops (engine untouched).
- Reframed cameras per scene: fox tighter and lower, tokyo backed off with a
  higher target, toycar backed off so bases do not clip.
- Collapsed the gallery control card on phones by default (title + picker only)
  and gave the buttons/picker taller touch targets.

### Round 2: side walls, wall tops, the sign, and boot GI

The desktop critic confirmed the sky and the textures resolved the void and
the flat background, then named the next layer: the saturated side walls still
read flat, the wall tops cut into the sky like paper, the OPEN sign still
looked like a button, and nothing at the floor joints had contact shadow.

- Gave the red/teal side walls a plaster texture in their own hue (vertical
  light falloff plus mottling), keeping the GI-bleed identity.
- Added stone coping to the wall tops (a light slab with a clear overhang) so
  the walls meet the sky with a finished architectural edge. The critic called
  this "highly successful" in round 2.
- Redesigned the OPEN sign as a brass-framed amber shop sign (serif lettering,
  lit-tubing outline, bronze frame, physical stand). The critic in round 2:
  "now successfully reads as an in-world physical prop rather than a UI
  element."
- Switched the museum to boot with `gi: true`. This was the honest fix for the
  recurring "objects float, no contact shadows" read: with one-bounce GI on,
  the room gets bounce light and ambient-occlusion-style contact shading, and
  the procedural sky finally LIGHTS the room (GI-miss rays sample it), which is
  the point of the owner's experiment. The museum's boot hero promises "global
  illumination... all running in a single lit room"; booting into it is now
  consistent with the copy. The perf cost is fenced below.
- Constrained the orbit so it cannot climb to a void-exposing top-down
  (`controls.minPolarAngle`, `maxDistance` 40->26): the critic saw the 
  bird's-eye view "expose empty space outside the room geometry".

### Round 3: phone legibility of the sky + polish

The museum mobile critic could not see the dusk sky (it was dark navy, which
reads as black on a small screen), the textures read flat, and the bottom
chrome was cramped.

- Brightened the sky so the zenith reads as a visible dusk blue on a phone
  screen (linear 0.045,0.10,0.24 -> 0.10,0.18,0.38, intensity 0.9->1.0). Pixel
  check: the mobile top-of-frame rose from ~(64,71,85) to ~(77,84,96), a clear
  blue-grey sky rather than a void.
- Raised the museum boot lighting res from 0.25 to 0.375 so the lighting (and
  therefore the GI/sky look) reads at all, especially on phones.
- Mobile chrome (museum.html page-scoped CSS, `!important`-free but
  body-scoped so it wins the cascade over the shared tour/panel modules):
  bigger fps text, roomier bottom tour bar with clearer spacing and higher
  contrast for the stop label, and the whole bar lifted off the phone's home
  indicator zone.
- Gallery: the dusk disc base was lifted (0x2a2f36 -> 0x3f4550) and its edge
  brightened toward the horizon so Tokyo's shadows read and the plate does not
  float; the disc radius grew from 14 to 22 so its hard outer circle is out of
  frame on every scene; the control card moved to the bottom of the phone
  screen for one-handed thumb reach and dims during scene loads so the
  "loading scene..." pill never collides with the picker text; the boot copy
  now says "scroll / pinch to zoom".

### What the critic confirmed resolved (round-2/3 desktop)

- "The procedural dusk sky successfully fills the void." (round-2)
- "The updated stone coping is highly successful. The larger, lighter slab with
  a clear overhang provides a strong, physically plausible architectural
  boundary." (round-3)
- "The 'OPEN' sign now successfully reads as an in-world physical prop rather
  than a UI element." (round-3)
- "The boot-time global illumination successfully grounds the scene. The fox
  plinth now has convincing contact shadows at the floor joint, and the soft
  ambient occlusion throughout the room corners enhances realism." (round-3)
- Gallery: "The fox now has a warm golden-hour sky, Tokyo has a deep dusk sky,
  and the toy car has bright studio daylight." and "The cameras are reframed;
  the models are well-centered and framed appropriately without clipping."
  (round-1 desktop)

## 3. Light / NEE budget ledger (after changes)

Cap check: 32 analytic lights, 256 emissive NEE triangles (largest-area wins).
The sky is not a light-list entry (GI-miss sampling), which is the
budget-friendly route the spec called out.

| Surface / state | tris | analytic lights | emissive NEE tris | vs caps |
|---|---|---|---|---|
| Museum boot (before) | 50,614 | 2 | 74 | 2/32, 74/256 |
| Museum boot (after) | 50,986 | 2 | 74 | 2/32, 74/256 |
| Museum max config (before) | 55,532 | 2 | 156 | 2/32, 156/256 |
| Museum max config (after) | 55,904 | 2 | 156 | 2/32, 156/256 |
| Museum worst case (all named lights + 13 party lights) | - | 18 | 156 | 18/32, 156/256 |
| Gallery fox | 768 | 1 | 0 | 1/32, 0/256 |
| Gallery tokyo | 141,427 | 4 | 40 | 4/32, 40/256 |
| Gallery toycar | 109,128 | 1 | 256 | 1/32, 256/256 (engine cap, unchanged) |

The museum's added geometry is 372 triangles (24 window-frame pieces, 3 coping
slabs, 4 sign-frame pieces), all static, all inside the existing envelope. The
museum "max config" probe toggles the feature ensembles; the true worst case
adds the spot/orbit/projector light rows and the party-light slider (up to 13),
which lands at 18 analytic lights. No change approached either cap; the engine
would evict largest-area-first past 256, and nothing here adds emissive
geometry.

## 4. Performance fence-check

Measured with adaptiveQuality OFF on the default view (the boot config), GPU
probe `_reviews/museum-glowup/_probe.py`, 90-frame window, both viewports.

| Surface / viewport | before avg ms | after avg ms | p95 after | note |
|---|---|---|---|---|
| Museum 1280x800 | 16.66 | 24.13 | 26.0 | GI + 0.375 lighting res |
| Museum 390x844 | 16.66 | 16.68 | 18.4 | phone context holds 60 fps |
| Gallery fox / tokyo / toycar (both viewports) | ~16.66 | ~16.66 | <18 | no change |

The museum desktop regression is ~45% and it is deliberate and justified: it is
the cost of the owner's glow-up (boot GI for the natural look + the sky
experiment, and 0.375 lighting res so the lighting reads). It still holds ~41
fps on this desktop GPU and 60 fps at the owner's phone viewport; the governor
(auto quality) is one click away for slower devices. No gallery scene regressed.

The render self-test matrix passes with the final code: both chromium legs
(meanLum 144.0 and 144.7, irrLum 171.6 and 172.6, 0 GL errors, 0 usage
warnings), plus empty-scene, usage-diagnostics and presets checks. firefox and
webkit are documented environmental skips on this machine (ANGLE D3D11/FXC
stall / no WebGL2), identical to the pre-round baseline.

## 5. Caveats and out-of-scope items

- Tokyo's emissive NEE cap. The Littlest Tokyo model ships ~88,837 emissive
  triangles; the engine keeps the 256 largest by area and warns once. Signs and
  windows read as glowing (G-buffer) but do not cast light. Fixing the model's
  emissive geometry is out of scope (src/ is frozen and the asset is a stock
  glTF), so this round mitigates with two analytic neon-spill fills. The
  console warning remains; it is the engine reporting its documented cap.
- Plaster/stone texture subtlety at the phone's reduced lighting res. The
  textures are real and deterministic but deliberately kept near the wall's own
  hue so the red/teal GI bleed stays legible; at 0.25-0.375 lighting res they
  are subtler than a normal-mapped wall. The critic on mobile still reads them
  as flat; this is a deliberate trade, not an oversight.
- Toy car's red cloth base. The sharp low-poly cloth edges are part of the
  stock ToyCar glTF, not scene content; softening them would mean editing the
  asset, which is out of scope.
- The OPEN sign. The desktop critic accepted the brass-framed amber signage;
  a glowing text panel can still read as an affordance to some eyes. It is a
  deliberate emissive-map exhibit; no further change planned.
- Denoiser re-convergence during orbit. The blurry-to-sharp settling after a
  camera move is the temporal accumulator's normal re-convergence; tuning the
  denoiser is engine behaviour, out of scope. Overscan is available in the
  panel to push disocclusion noise off-screen.
- Shared tour/panel chrome. The museum's page-scoped CSS improves the shared
  bottom bar and fps readout on phones without editing `examples/tour.js` or
  `examples/panel.js` (not in the spec's file list). The panel's dense
  technical rows and the tour bar's rounded-vs-square styling are the shared
  design's, unchanged here.
- The turntable disc's geometric edge at extreme low-angle orbits. The gallery
  disc is now radius 22 (edge off-frame at the default framing of every scene)
  and its outer ring is tinted to each scene's horizon, so the platform reads
  as receding into the sky at normal angles. The engine has no sky-lit infinite
  ground plane, so a camera dragged down to a near-horizontal gaze can still
  silhouette the disc against the gradient (the critic saw this at one low-angle
  moment in a full orbit video). Fixing that would mean an engine feature, which
  is out of scope.
- Boot config philosophy. The museum used to boot at the "tested minimal"
  renderer config (GI off, 0.25 res) so per-feature costs could be A/B'd.
  This round boots GI on at 0.375 res because the owner's ask (a natural feel,
  a visible sky) needs them. The per-feature cost rows in the panel still A/B
  correctly; only the baseline moved. Justification above.

## Review-loop outcome

The loop ran baseline -> three museum rounds + two gallery rounds, quoting each
previous round's complaints back to the critic. It converged: by the final
rounds the museum critic confirmed the sky, the wall-top coping, the OPEN sign
and the boot-GI contact shading as resolved, and the gallery critic confirmed
the per-scene skies, the disc integration at normal framing and the reframed
cameras. What remains is the documented set above (the engine's Tokyo NEE cap,
the stock Toy Car cloth edges, texture subtlety at reduced lighting res, the
disc silhouette at extreme low angles, and the shared chrome's dense look).
Every existing exhibit, toggle, slider and debug view still works; the render
self-test matrix, the usage-diagnostics check and the presets byte-identity
check all pass, and the two canvas textures, the sky and the new geometry are
deterministic (no randomness).
