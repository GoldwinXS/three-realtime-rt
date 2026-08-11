# SPEC: demo + gallery presentation glow-up

Author: the architect. Implementer: you, with the Gemini video critic as your
reviewer in a mandatory loop. The work this library represents deserves to be
seen well; your job is the presentation shell around it, not the art inside it.

Branch and worktree are yours alone. Do not run git commands; the architect
commits. No emojis anywhere (SVG icons are the house style). No em dashes in
any text you write. House style is the existing dark UI; refine it, do not
replace it.

## Scope: what you MAY touch

- `index.html`, `gallery.html`, and their supporting code in `examples/`
  (ui.js, tour.js, panel code, any CSS).
- Page chrome: titles, headers, captions, hints, footer links, loading states,
  the fps/version badge, the tour cards, gallery scene cards and their
  descriptions.
- Typography, spacing, color accents within the existing dark palette.
- Copy: scene captions and feature descriptions may be rewritten to be
  clearer and more inviting. Factual claims about the engine must stay
  accurate; do not invent benchmarks or features.
- Default camera FRAMING per gallery scene (initial position/target only, and
  only where a scene opens on an awkward angle).

## Scope: what you MUST NOT touch

- Anything under `src/`.
- Scene contents of the museum demo (geometry, materials, lights, exhibits).
- Rendering defaults that change performance or quality characteristics
  (renderScale, adaptiveQuality, feature toggles' initial states).
- Existing control labels (test harnesses find controls by label text).
- The collapsible panel group structure from the ui-polish round; build on
  it, do not reorganize it again.
- No new remote assets: gallery models stay exactly the ones that load today
  (several Khronos URLs are known-dead; do not add any).

## Quality bar

A visitor landing on either page should immediately understand: what this is
(real-time ray tracing in the browser), why it is impressive, and what to do
next (drag to orbit, try features, visit scenes). First impressions count:
the seconds before the renderer converges should look intentional (a styled
loading state, not a black void with tiny text).

## The review loop, mandatory

`npm install` in this worktree, then `npx vite --port 8124 --strictPort`
(8126 as fallback; never 8115, 8119, 8121, 8122, 8123).

Use the Gemini critic in VIDEO mode with scripted interactions as your
reviewer; it judges motion and flow better than stills, so make it watch the
experience, not screenshots:

    python C:/ClaudeSessions/gemini-critic/critic.py --gpu --url http://localhost:8124/ \
      --actions steps.json --seconds 25 --mode video --out _reviews/glow-<n> \
      --question "You are reviewing the landing experience and presentation of a
      browser ray tracing demo. Judge: first impression in the opening seconds,
      clarity of what the page is and what to do, visual polish of the chrome
      (panel, badges, cards, typography), and how inviting the whole thing
      feels. Ignore rendering noise during convergence. Be concrete and
      prioritize."

- Script actions that exercise the experience: wait through load, orbit drag,
  open a panel section, advance the tour, and on gallery.html visit at least
  two scenes.
- Review BOTH pages, BOTH viewports (1280x800 and 375x812).
- Iterate until the critic has no high-priority presentation complaints for
  two consecutive rounds on each page.
- Probes must listen for pageerror and confirm rt status is ok (a silent
  raster fallback invalidates a run).
- Keep all reviews under `_reviews/`.

## Deliverables

1. The glow-up, in scope.
2. `node --check` clean on touched JS; no horizontal scrolling at any
   viewport (programmatic scrollWidth check, expanded and collapsed).
3. `REPORT_GLOWUP.md` at worktree root: what changed and why, before/after
   critic verdicts (quote the final ones per page), verification performed
   (commands, viewports, pageerror/rt-status checks), anything descoped.
