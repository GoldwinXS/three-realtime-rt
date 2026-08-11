# SPEC: demo control panel tightening + layout fixes (redo round)

Author: the architect. Implementer: you. This worktree is yours alone; branch
`ui-polish2`. Do not run git commands; the architect commits. Do NOT touch
anything under `src/`. Your domain is the demo shell: `index.html`,
`examples/` (ui.js, panel-related code), CSS wherever it lives. No emojis
(SVG icons are the house style), no em dashes in any text you write.

## Context

A previous agent completed this task; its work was lost to a tooling accident
before commit. Its final report survives as `REFERENCE_REPORT.md` at the
worktree root. Read it FIRST: it names the overflow root cause, the exact
group structure that was approved, and the verification bar that was met.
Your job is to reproduce that outcome (improving details is allowed; every
problem it solved must stay solved).

## Problems, from the project owner

1. The demo's control panel is too long: too many flat toggles and sliders in
   one unbroken column.
2. Horizontal scrolling appears on the page. The page must never scroll
   horizontally at any viewport width.

## Goals

- Reorganize controls into collapsible groups per REFERENCE_REPORT.md's
  table. Groups collapsed by default except Renderer. Keep the fps/version
  badge always visible. Keep the panel-collapsed-by-default behavior on
  narrow viewports.
- Fix the horizontal overflow at its source (the reference report tells you
  where it was; verify it is still the cause rather than assuming).
- Preserve every existing control and its behavior; keep visible label text
  identical (test harnesses click checkboxes by label text).
- Touch nothing about rendering.

## The review loop, mandatory

`npm install` in this worktree first (do not reuse another checkout's
node_modules), then serve with `npx vite --port 8124 --strictPort`. If 8124
is taken, use 8126. Never use 8115, 8119, 8121, 8122, or 8123.

Visual critic, before and after, iterating until satisfied on layout:

    python C:/ClaudeSessions/gemini-critic/critic.py --gpu --url http://localhost:8124/ \
      --actions steps.json --mode video --out _reviews/ui-<n> \
      --question "Judge ONLY the control panel layout and page overflow: is the
      panel well organized, are groups clear, does anything clip or scroll
      horizontally?"

- Prefer --mode video with scripted actions (click section headers open and
  closed, scroll the panel) so the critic judges the interaction, not just a
  still.
- Review BOTH viewports: default 1280x800 and --viewport 375x812.
- Programmatic overflow check in any probe you write:
  `document.documentElement.scrollWidth <= window.innerWidth` at both
  viewports, with all sections expanded AND all collapsed.
- Your probes MUST listen for page exceptions (Playwright `page.on("pageerror")`),
  not just console messages, and must confirm the ray tracer is actually
  active (the page exposes rt status; a silent fallback to plain raster
  invalidates the run). A previous agent's "pass" was invalidated at gate
  because its harness missed a page exception.
- Keep every review under `_reviews/`.

## Deliverables

1. The reflowed panel + overflow fix.
2. `node --check` clean on touched JS.
3. `REPORT_UI_POLISH.md` at worktree root: what caused the overflow, the
   group structure, before/after critic verdicts (quote the final one), what
   you verified at each viewport including the pageerror and rt-status
   checks, anything descoped.
