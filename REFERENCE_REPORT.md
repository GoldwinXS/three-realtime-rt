# REFERENCE: report from the previous (lost) UI polish round

The implementation below was completed, verified through five critic rounds,
and gate-approved, then lost to a worktree accident before it could be
committed. Treat it as a precise blueprint: reproduce this outcome. You are
free to improve on details, but every problem it solved must stay solved.

## Files modified (in the lost round)

- `examples/panel.js` -- collapsible section groups, section reorganization,
  CSS for collapsible behaviour, narrow-viewport overflow fixes, footer-link
  wrapping
- `examples/tour.js` -- responsive costs-button sizing on narrow viewports

No `src/` file was touched. No emoji or em dash was introduced.

## Horizontal overflow: root cause (as found in the lost round)

The only horizontal-overflow source was the footer-links bar inside the
panel. It shared the `.stats` class, whose `white-space: pre` prevented
line-wrapping. At 268 px panel width the three links (`Feature costs`,
`GitHub (MIT)`, `Supporter pack`) overflowed as one unbroken line.

The fix: split the links onto a `.stats.links` override with
`white-space: normal` and a smaller font size so they wrap cleanly inside
the panel.

The FPS badge and hint bar were also constrained on narrow viewports
(<= 420 px) with max-width and overflow handling. The hint bar was hidden on
those widths because it sits behind the tour chrome.

## Group structure (as shipped in the lost round)

The old flat layout had three sections: Renderer (9 controls), RT features
(15 controls, the too-long one), and Atmosphere (3 controls). RT features
was split and Atmosphere folded into the new Lighting group:

| Section | Default | Controls |
|---|---|---|
| Renderer | open | ray tracing, auto quality, denoise, TAA, resolution, lighting res, overscan, view, cost scale |
| Lighting & Atmosphere | collapsed | emissive area lights, ReSTIR lights, fast lights (1 ray), volumetric light, fog / haze, density |
| Effects | collapsed | PBR specular, global illumination (+ half-rate GI, ReSTIR GI subs), reflections, refraction (+ tinted glass, tinted shadows subs), dispersion, scattering (Kubelka-Munk) |
| Quality & Performance | collapsed | firefly clamp, history length, denoise passes |
| Exhibit (per-room) | collapsed | exhibit selector + caption (Cornell box only) |

Every section header had a click-to-toggle chevron (right-pointing when
collapsed, down when expanded), implemented as h3 click handlers toggling a
`collapsed` class on the section. Per-room sections (Lights, Physics,
Exhibit) got the same treatment via the shared `section()` helper.

Panel-on-narrow-viewports behaviour unchanged: at <= 700 px the panel starts
fully collapsed (`.min`), only header and FPS badge visible.

## Verification notes from the lost round

- Verified at 1280x800 and 375x812 through five critic rounds each; final
  desktop round carried no overflow complaints for two consecutive runs.
- Programmatic checks: body carries `overflow: hidden`; panel gets
  `max-height: calc(100vh - 28px); overflow-y: auto`; panel width (268) +
  right offset (14) fits inside 375; tour chrome centered and responsive.
- Deliberately descoped: tour-chrome rework, "cost scale" label wrapping,
  section-header colour contrast (house style).
