# REPORT: demo + gallery presentation glow-up

Branch `glow-up`. Scope: the presentation shell only. No `src/` file was
touched, no rendering default, scene content or control label was changed, and
the collapsible panel group structure from the ui-polish round is intact
(only the open/closed defaults changed, see below). No emoji, no em dash was
introduced in any new text.

## What changed and why

The landing hero was the heart of the round. Before, both pages opened on a
plain spinner + a one-line message; after, they open on a styled landing hero
that states what this is, why it is impressive and what to do next, with a
progress bar so the pre-convergence seconds read as intentional rather than a
hang.

### Landing hero (all four tour pages + gallery)

- Full-screen hero overlay: a brand kicker, a headline ("Real-time ray tracing
  in the browser" / "One room, every feature" / "Model scenes" / "The scene
  gallery"), a one-line lede, an indeterminate progress bar, and a "what to do"
  cue line. The boot text changed from jargon ("building BVH…") to inviting
  copy ("preparing the scene…" / "optimizing the scene…" / "streaming the
  model…").
- A short minimum-display (900 ms) holds the hero long enough to read even on a
  fast load, then fades quickly (0.3 s) with the scene held behind the fade so
  nothing pops over the hero.
- Scene switches on the gallery and the model stop show a compact status pill at
  the bottom of the viewport instead of flashing the full hero again, and the
  stale frame dims behind it so the switch reads as a refresh, not a blank.

### Demo tour chrome (`examples/tour.js`, `examples/panel.js`)

- The RT switch, the prev/stop/next nav and the dots + feature-costs link were
  merged into one bottom bar, so the bottom chrome reads as a single control
  cluster instead of three stacked rows.
- The stop indicator became unambiguous ("stop 1 of 3 · …" instead of the
  misreadable "1/3"), with brighter sub-text, a highlighted next link, and
  clearer prev/next buttons (larger padding, a subtle button background, a
  brighter border).
- A transient "drag to orbit" cue appears after the hero fades and dismisses on
  the first real orbit drag, scroll, or after 10 s.
- The persistent bottom-left hint bar was removed on the demo stops (the hero
  and the transient cue carry the instructions); it now appears only for the
  Cornell stop's RT-off warning, where it explains the honest black screen.
- The renderer panel starts collapsed on every stop (only the accordion headers
  and the footer show), and the Cornell stop's Exhibit section opens in its
  place, so a landing visitor sees the switcher that is that stop's purpose
  rather than a wall of sliders. Every control is one click away.
- The panel header's collapse button became a visible hamburger toggle, the
  accordion headers got larger type, a subtle background and better contrast,
  and the panel background was made more opaque so the bright Cornell wall no
  longer tints it.
- Tooltips were added to the technical rows the critic kept naming (TAA, auto
  quality, resolution, lighting res, overscan, view, cost scale, denoise, GI,
  half-rate GI, ReSTIR GI, reflections, refraction, scattering, dispersion,
  firefly clamp, history length, denoise passes), so a hover explains the
  jargon in place.

### Gallery (`gallery.html`, `examples/gallery.js`, `examples/gallery-scenes.js`)

- Fixed the picker mismatch that shipped before this round: the dropdown showed
  "Cornell box" while Littlest Tokyo was actually rendering. The picker now
  always names the scene that loaded.
- Added a per-scene caption under the picker (the catalogue now carries one
  inviting line per scene) and a deep-linkable `#scene` hash, matching the
  tour's model stop.
- Mobile first impression: a lighter default scene (BoomBox on narrow
  viewports) so the gallery opens near 60 fps instead of 6, and the camera is
  backed off 1.7x on portrait so the model is fully framed instead of a
  cropped abstract.
- The control card was tightened: fixed 268 px width (it had blown out to
  531 px from a percentage-width select), a button-like scene picker with a
  chevron, higher-contrast stats and caption, a "hold raster" note, a
  collapsible fold on the title row, and the technical readout hides on phones
  so the scene is the star.
- The ground planes got a procedural radial colour falloff so the shadow-catcher
  fades into the dark background instead of ending on a hard grey circle.

## Critic loop

Ran the spec's Gemini video critic at 1280x800 and 375x812 on both pages with
scripted actions (load wait, orbit drag, panel/accordion interaction, tour
advance, and two scene switches on the gallery). 44 rounds under `_reviews/`
(`glow-0` .. `glow-44`).

**Before (baseline, `glow-0..3`).** Index desktop:

> A first-time user is immediately bombarded with technical jargon ("BVH",
> "TAA", "overscan"...) and a very basic box scene... The bottom card says
> "1/1 - Cornell Box" initially... the transition between scenes completely
> blanks out the screen.

Gallery desktop:

> The dropdown initially displays "Cornell box (the classic)" while rendering
> the street diorama, which is highly confusing... There are no visual
> indicators or instructions explaining how to interact with the 3D scene.

Gallery mobile:

> A 14-second black loading screen on launch is a critical drop-off point.

**After (final rounds).** Index mobile (`glow-42`):

> First Impression: The transition from the dark loading screen to the softly
> lit Cornell Box is visually pleasing and inviting.

Gallery desktop (`glow-43`):

> First Impression: Strong. The transition from the clean, dark loading screen
> to a complex, path-traced 3D model is visually striking.

Gallery mobile (`glow-40`, earlier round that still applies):

> The visual quality of the path-traced BoomBox is impressive.

The in-scope complaints from the baseline (picker mismatch, jargon-only loading,
no interaction cues, hard-to-read tour nav, misread stop indicator, no
onboarding message) are gone. The high-priority items that remain across the
final rounds are all outside the scope fences; see Descoped below.

## Verification

All of the following ran against the live vite server on port 8124.

- `node --check` is clean on every touched JS file (`examples/panel.js`,
  `examples/tour.js`, `examples/ui.js`, `examples/cornell.js`, `examples/main.js`,
  `examples/models.js`, `examples/gallery.js`, `examples/gallery-scenes.js`).
- No horizontal scrolling at either viewport, in every chrome state
  (`_reviews/verify-final.py`):

| Check | 1280x800 | 375x812 |
|---|---|---|
| Demo, documentElement.scrollWidth <= innerWidth (default / all-expanded / all-collapsed) | PASS x3 | PASS x3 |
| Gallery, scrollWidth (default / options-open / options-closed) | PASS x3 | PASS x3 |
| page exceptions (`page.on("pageerror")`) | 0 | 0 |
| console errors | 0 | 0 |
| ray tracer active (rt.frame advances; silent-raster gate) | ACTIVE | ACTIVE |
| gallery picker names the loaded scene | tokyo | boombox |

- The render self-test (`npm run test:render`) passes on the chromium legs
  (chromium + chromium@3latest: meanLum 142.94/143.02, irrLum 173.72/173.85,
  glErrors 0, statusOk true, warnings 0); firefox/webkit are the known platform
  skips.
- Reviews were probed for page errors and live rt state during every capture
  round.

## Descoped

Items the critic kept raising that are deliberately out of scope per
`SPEC_DEMO_GLOWUP.md`:

- **Emissive NEE cap warnings on gallery models** (Littlest Tokyo's ~88k
  emissive triangles exceed the renderer's 256-triangle NEE cap; several glowing
  surfaces do not cast light). Fixing it means editing scene geometry or the
  renderer, both forbidden ("Scene contents", "Rendering defaults", "No new
  remote assets").
- **Sans-serif typography.** House style is the monospace dark UI; the spec says
  refine it, not replace it.
- **Hiding advanced controls behind an "Advanced" toggle.** The spec forbids
  reorganizing the collapsible panel group structure; every control is one click
  away and now has a hover tooltip.
- **Changing the default demo scene away from the Cornell box.** Stop 1 of the
  tour IS the Cornell box by design (scene contents / tour structure).
- **Renaming or togglifying the "hold: raster" button.** Its label is frozen
  ("test harnesses find controls by label text"); a caption explains the hold.
- **Replacing the gallery's scene dropdown with thumbnail cards.** It would
  remove the labelled control the harness uses and add a new navigation
  surface; per-scene captions carry the inviting descriptions instead.
- **Eliminating the full-screen transition between tour stops.** The three stops
  are separate pages by design; the hero makes each hop an intentional moment
  rather than a black void.
- **Real-time perf during orbit on mid GPUs.** The governor's adaptive quality
  is a rendering default and was not touched.
