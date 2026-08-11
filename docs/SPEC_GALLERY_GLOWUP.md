# SPEC: museum-room look-and-feel glow-up (critic-looped)

Author: the architect. Implementer: you. Read fully before coding. Your branch
is `gallery-glowup`; no git commands beyond read-only diff/log. No emojis, no
em dashes. Do not ask questions; nobody can answer them. Make the conservative
choice and record it.

## The brief, verbatim

The project owner, reviewing on his PHONE, says the demo "feels weird... just
unnatural", and clarified the target: "I meant the room with all the features
but a skybox could be cool." The room = the MUSEUM demo (index.html +
examples/main.js): the panoramic museum with the materials bench, water pool,
helmet, gold knot, teapot, duck vitrine, clerestory windows and party lights.
Use the Gemini critic to turn "unnatural" into named, fixable problems, then
fix them in a review loop until the critic stops finding them.

## Owner-requested experiment: a skybox

The museum's ceiling is open to a dark void, and its windows look out on
nothing. That void is reflected by every metal in the room (the gold knot is
deliberately NOT full-metal because a full mirror of blackness read as
mottled). Options within demo scope, in order of preference:

1. The engine's procedural `sky` option (src/sky.glsl.js: sun disk + gradient,
   sampled by GI-miss rays so it also LIGHTS the room). Currently unused by
   the museum. Visible through the open ceiling and clerestory windows it
   would ground the space and give metals something real to reflect.
2. Scene content visible through openings (a lit horizon band, distant
   emissive panels) if the procedural sky fights the indoor lighting rig.

There is NO cubemap/skybox-texture support in the engine and adding engine
features is out of scope; do not try. Measure the lighting change honestly:
the sky adds ambient, so the room's existing lights may need rebalancing to
keep the museum's evening-gallery mood rather than turning it into noon.

## Likely suspects (architect's read; verify, do not assume)

Void ceiling and void windows; metals reflecting blackness; the disc-in-void
transition at the room edges if visible; flat lighting; camera framing and UI
legibility on a phone. Let the critic NAME the problems before you fix any.

## Scope

- `examples/main.js` (the museum scene build + lighting rig), `index.html`
  (chrome/CSS), `examples/ui.js` if a control needs adding (e.g. a sky
  toggle). Nothing else.
- `src/` is UNTOUCHED this round. The look must come from scene content and
  page chrome. Engine defaults and presets are not yours.
- The museum must stay deterministic and within its performance envelope:
  fence-check ms before and after on the default view (adaptiveQuality OFF for
  the measurement); regressions over ~15% need a written justification.
- Light budget: the museum ledger is near the 32-light cap and the 256
  emissive-NEE-triangle cap (largest-area-wins eviction). Count BEFORE adding
  anything; the sky is not a light-list entry (GI-miss sampling) so it is the
  budget-friendly route.
- Every existing exhibit, toggle, slider and debug view must keep working;
  the "tinted shadows"/ReSTIR interaction and the byte-identity-sensitive
  toggles must not be disturbed.

## The loop

1. BASELINE: capture video of the museum default orbit plus a walk to the
   materials bench and the Lumiere screen, at TWO viewports: mobile 390x844
   (--viewport; the owner's context) and desktop 1280x800. Ask the critic the
   OPEN question first: "does this feel like a real place, what feels off,
   why?" plus a mobile pass (UI legibility, overlap, thumb reach).
2. Fix the top named problems (skybox experiment included).
3. Re-capture the same scripted actions; quote the critic's earlier complaint
   back to it and ask whether it is resolved.
4. Repeat until remaining complaints are fixed or documented as out of scope.

Critic mechanics: `python C:/ClaudeSessions/gemini-critic/critic.py --gpu
--mode video --url http://localhost:8134/ --actions steps.json --out
_reviews/museum-glowup/<round>`. `--gpu` is mandatory. Serve with `npx vite
--port 8134 --strictPort` (PORT 8134 ONLY; other ports belong to other live
sessions and using them has already burned this project once). All artifacts
under `_reviews/museum-glowup/`.

## Deliverables

The changes, the review-loop artifacts, and `REPORT_MUSEUM_GLOWUP.md`: the
critic's baseline diagnosis (quoted, attributed), what changed per round with
the reasoning, before/after captures, the light/NEE budget ledger after your
changes, the perf numbers, and honest caveats. The architect gates by
re-running your captures and dragging things.
