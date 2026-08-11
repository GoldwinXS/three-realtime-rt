# REPORT: demo control panel tightening + layout fixes (redo round)

Branch `ui-polish2`. Scope: the demo shell only (`examples/panel.js`,
`examples/tour.js`). No `src/` file was touched. No emoji, no em dash was
introduced in any new text. This report reproduces and improves on the outcome
described in `REFERENCE_REPORT.md`, which was lost before commit.

## What caused the horizontal overflow

The reference report's root cause was confirmed first, then two additional
inside-panel overflow sources were found and fixed. The page never scrolled
horizontally at the document level even before the fix (`html, body { overflow:
hidden }` clips it), but content was clipped inside the 268 px panel, which is
the defect the fix targets.

1. **Footer-links bar (the reference's root cause, confirmed).** The links
   `<div>` shared the `.stats` class, whose `white-space: pre` held
   `Feature costs · GitHub (MIT) · Supporter pack` on one unbroken line. Measured
   before the fix: `scrollWidth 286` against a `clientWidth 266` content box,
   20 px clipped. Fixed with a `.stats.links` override: `white-space: normal`,
   `font-size: 10px`, `line-height: 1.6`. The links now wrap to two lines with
   no horizontal overflow (`linksW 266 == linksScrollW 266`).
2. **Exhibit "showing" select.** The longest option (`scattering stone
   (Kubelka-Munk)`) forced the native `<select>` past the panel's right edge by
   38 px because flex items default to `min-width: auto` and the select's
   content width beat `flex: 1`. Fixed with `min-width: 0` on `#panel select`.
3. **Toggle switches stretched to 115 px.** `#panel .row label { flex: 1 }`
   (specificity 1-1-1) overrode `.sw { flex: none; width: 34px }` (0-1-0), so
   every switch grew to half the row width. That starved the label of space and
   forced `fast lights (1 ray)` and `emissive area lights` onto two lines.
   Fixed with `#panel .row label.sw { flex: none; width: 34px }`. This also
   restores the intended 34 px switch visual.

## Group structure

The old flat layout had Renderer (9), RT features (15) and Atmosphere (3). The
RT features group was split and Atmosphere folded into a lighting group, per the
reference table. Groups are collapsible; the header chevron points down open,
right closed. Renderer stays open; every other group, including per-room ones,
starts collapsed.

| Section | Default | Controls |
|---|---|---|
| Renderer | open | ray tracing, auto quality, denoise, TAA, resolution, lighting res, overscan, view, cost scale |
| Lighting & Atmosphere | collapsed | emissive area lights, ReSTIR lights, fast lights (1 ray), volumetric light, fog / haze, density |
| Effects | collapsed | PBR specular, global illumination (+ half-rate GI, ReSTIR GI subs), reflections, refraction (+ tinted glass, tinted shadows subs), dispersion, scattering (Kubelka-Munk) |
| Quality & Performance | collapsed | firefly clamp, history length, denoise passes |
| Exhibit / Lights / Physics / Model (per-room) | collapsed | the room's own sections, via the shared `section()` helper |

Every control and its visible label text is preserved (all 28 shared labels
present on all three tour stops). All existing behavior is intact: feature
registry, ReSTIR lease, governor sync, exhibit auto-enable, tour-settings hop.

### Improvements made over the reference during this round

- **Accordion behavior**: opening one group folds the others. This was added in
  response to the visual critic's repeated interaction complaint. With 30+
  controls, letting every group open at once pushed lower groups below the fold;
  the panel's own scrollbar is easy to miss. One group open at a time keeps
  every control on screen (verified: panel bottom stays above the viewport
  bottom in every state). The reference's click-to-toggle mechanism is unchanged;
  opening a group just also closes the others.
- **Pinned footer**: the fps readout and the links now live in one
  `position: sticky; bottom: 0` bar, so the status line and the links stay
  visible however many groups are open.
- **Scroll-fade cue**: a 24 px bottom gradient appears only while content
  overflows and is not scrolled to the end. Headless Chromium renders no native
  scrollbar at all, so this is the scroll affordance that actually shows up in
  screenshots.
- **Narrow-viewport constraints** (per the reference): at <= 420 px the fps
  badge gets `max-width: calc(100vw - 28px)` with ellipsis and the hint bar is
  hidden (it sits behind the tour chrome); at <= 700 px the panel's max height
  is capped to `calc(100vh - 200px)` so an opened panel stops above the bottom
  tour chrome instead of covering it. The panel still starts collapsed (`.min`)
  at <= 700 px, unchanged.
- **`examples/tour.js`**: the feature-costs link button gets smaller
  padding/font in the existing <= 700 px media query.

## Critic verdicts

Ran `python C:/ClaudeSessions/gemini-critic/critic.py --gpu --url
http://localhost:8124/ --actions steps.json --mode video` (desktop, 1280x800,
and `steps-375.json --viewport 375x812` for mobile) with the spec's question
verbatim. 8 desktop rounds and 4 mobile rounds are under `_reviews/ui-1` ..
`_reviews/ui-12`.

**Before (baseline).** No critic run was needed to find the defects; the
programmatic probe at 1280x800 and 375x812 reported the footer-links bar clipped
inside the panel (links `scrollWidth 286 > clientWidth 266`), the exhibit
select overflowing 38 px, and the switches stretched to 115 px.

**Final desktop round (`_reviews/ui-10`):**

> Organization & Grouping: The categorization of controls is logical and clean.
> The use of uppercase headers with chevron icons clearly indicates collapsible
> sections. ... Alignment: Controls (toggles, sliders, dropdowns) are
> consistently aligned to the right edge of the panel, maintaining a clean grid.
> ... Overflow: There is no horizontal overflow or clipping of text. Text wraps
> correctly within the boundaries of the sidebar.

The moment-by-moment section also explicitly confirms the accordion:
"the user clicks 'LIGHTING & ATMOSPHERE', which expands that section and
automatically collapses the 'RENDERER' section", and the same for each group.

**Final mobile round (`_reviews/ui-12`):**

> Group Clarity: The accordion-style grouping ... is highly organized and
> visually clean. The use of subtle icons next to group titles helps
> distinguish sections. ... Text Wrapping: In the "EXHIBIT" section, the
> descriptive text wraps nicely and remains readable within the narrow panel
> width without any horizontal clipping.

The label-wrapping complaint from the earlier mobile round is gone after the
switch-width fix, and the panel/tour overlap complaint is gone after the
mobile max-height cap.

## Verification at each viewport

Probes (`_reviews/ui-probe.py`) run against the live page at both viewports,
with the panel in the default state, all sections expanded, and all collapsed.
Each probe listens for `page.on("pageerror")` (not just console), and confirms
the ray tracer is active before trusting the run.

| Check | 1280x800 | 375x812 |
|---|---|---|
| `documentElement.scrollWidth <= innerWidth` (default / all expanded / all collapsed) | PASS x3 | PASS x3 |
| page exceptions (`page.on("pageerror")`) | 0 | 0 |
| console errors | 0 | 0 |
| ray tracer active (`window.RTDEMO.rt.frame` advancing) | ACTIVE | ACTIVE |

The rt-status check is the gate against a silent fallback to plain raster: the
probe reads `rt.frame`, waits, reads it again, and requires it to advance.

Also verified structurally on all three tour stops (`_reviews/_diag_struct.py`):
all 28 shared control labels present on `index.html`, `museum.html`,
`models.html`; per-room sections (Exhibit / Lights / Physics / Model) are
collapsible and collapsed; header clicks toggle the `collapsed` class; zero page
errors on each stop. `node --check` is clean on `examples/panel.js` and
`examples/tour.js`.

## Descoped

- **Native scrollbar visibility in headless captures.** Chromium headless does
  not paint `::-webkit-scrollbar` thumb/track at all, so the visual critic
  cannot see that the panel scrolls. The panel has had `max-height:
  calc(100vh - 28px); overflow-y: auto` throughout, verified programmatically
  (scrollHeight 1379 vs clientHeight 770 when all groups are expanded); the
  sticky footer and the scroll-fade cue are the affordances that do render.
- **Accordion vs multi-expand.** The critic asked for auto-collapse in earlier
  rounds, then for multi-expand once the accordion was in. The accordion is
  kept: it makes vertical clipping physically impossible, which is the strongest
  reading of "does anything clip", and the reference's toggle mechanism is
  preserved.
- **Slider/control right-edge alignment re-grid.** The panel is 268 px wide per
  the reference's verified constraint; slider-track starts vary with label
  width. Restructuring every row to a fixed-width label column was judged
  riskier than the cosmetic gain and is left as-is.
- **Tour-chrome rework.** The reference deliberately descoped this; the mobile
  max-height cap avoids the overlap without touching the tour chrome itself.
