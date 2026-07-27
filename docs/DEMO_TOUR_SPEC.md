# Demo tour rework — spec (2026-07-27, user direction)

Repo: C:\ClaudeSessions\RayTracingUpgradeChallenge (three-realtime-rt).
Launch AFTER feature/km-scattering merges; branch feature/demo-tour off the
merge result. Commit in small reviewable steps.

## The shape

A linear guided tour with prev/next navigation. Three stops:

1. **Cornell box** (new; becomes the ENTRY page — what index.html loads).
   Classic proportions: white floor/ceiling/back, red left wall, green right
   wall, area light in the ceiling. All geometry procedural — zero new
   assets. This room must be the engine's best-performing showcase; treat
   its fps as a review gate (report it; do not ship a Cornell box that runs
   worse than the museum).
2. **Museum** (the current index.html demo room, KM lamp exhibit included —
   arrives with the merge). Unchanged content; it becomes stop 2.
3. **Model scenes** (one stop per existing /gallery model, or a single stop
   with a model picker — implementer's choice, but REUSE the assets already
   in the repo; the repo must not grow beyond trivial code size. No new
   model/texture binaries.)

## Navigation + controls

- Persistent minimal chrome on every stop: PREV / NEXT buttons and a
  prominent RT ON/OFF toggle (the one-click raster-vs-RT comparison is the
  whole sales pitch — make it obvious, not buried in the panel).
- The full existing renderer/lighting panel (denoise, TAA, resolution,
  lighting res, GI modes, reflections, refraction, tinted glass, dispersion,
  KM scattering, ReSTIR, clamps...) is available on EVERY stop — shared
  component, not copy-pasted per page.
- Below the shared panel, a per-room "exhibit controls" section that each
  stop populates with its own controls. Museum keeps whatever it has;
  Cornell box gets the object switcher (below); model stops get at least a
  model/environment picker if applicable.
- Each stop is deep-linkable (distinct URL or hash) and prev/next preserves
  the current renderer settings across stops where feasible.
- SVG or text icons only. No emojis anywhere.

## Cornell box object switcher (stop 1's exhibit controls)

The center of the box holds one exhibit at a time; switching swaps the
object(s) to isolate ONE feature per exhibit. Minimum set:

- diffuse boxes (the classic two rotated blocks — the baseline)
- mirror sphere (PBR specular / reflections)
- glass sphere (refraction; dispersion slider becomes meaningful here)
- tinted glass panes (tinted shadows / colored shadow feature)
- emissive block (emissive area lights / ReSTIR)
- scattering block (Kubelka-Munk material — the new feature; a slab thick
  enough to show the R_inf saturation visibly)

Auto-enable the feature a given exhibit demonstrates when it's selected
(switching to the glass sphere turns refraction on) — but never silently
change what the user manually toggled afterward.

## Invariants (do not break)

- bench.html, harness.html, scattering.html, absorption.html keep working
  untouched.
- The library API is untouched — this is demo-shell work only, src/ changes
  need explicit justification in the commit message.
- Byte-identity guarantees from the KM work stay intact (RT off = untouched
  pipeline).
- Repo size: no new binary assets. Procedural geometry + existing models
  only.
- Small commits: box scene, nav shell, panel extraction, switcher, model
  stops — separately reviewable.

## Report back (return as text, do not write .md files)

- fps per stop at defaults (Cornell box / museum / heaviest model stop),
  same GPU, RT on and off.
- What the shared-panel extraction touched.
- Screenshot-worthy states + exact URLs for the director to verify with
  headed Playwright from C:\ClaudeSessions\WebsiteDesignSniper (NEVER
  headless, NEVER the in-app pane).
- Any place the spec was ambiguous and the call you made.
