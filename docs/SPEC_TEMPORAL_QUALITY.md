# Temporal quality campaign: fireflies, ghosting, noise

Author: the architect. Implementer: you. No emojis, no em dashes. Do not
ask questions; nobody can answer them. Make the conservative choice and
record it. NO GIT: you work in a prepared worktree; the architect commits.

## The owner's verdict

"My main issue, as it has been for a while, are firefly artifacts caused
when global illumination is on, as well as ghosting and noise. I've been
chasing fireflies for a while now without much luck." This is the engine's
chronic complaint. Absolute clamps exist (uFireflyClamp=4.0 indirect, 2x
emissive direct, 4x specular, ReSTIR W capped at 32, Jacobian clamped,
confidence-scaled clamp at reset pixels) and fireflies still ship. Stop
adding caps blind; instrument first, then fix what the numbers say.

## The architect's diagnosis (verify it, do not assume it)

A spike that survives the caps (W=32 is 32x the mean estimate; specular cap
is 16x base) enters the temporal EMA unchallenged: there is NO
neighborhood-based rejection before accumulation. One surviving spike then
persists for up to maxHistory (48) frames as a slowly fading dot, and
DenoisePass (a-trous with the 8/sqrt(count) luminance-sigma heuristic, not
true variance guidance) smears it into a disc while it fades. Shipping RT
games (NRD's ReBLUR/ReLAX) kill exactly this with a pre-accumulation
anti-firefly filter plus variance-guided kernels. We have neither.

## Part 1: instrument before touching anything

1. Firefly bench metric, added to the existing dev bench harness
   (probe-gallery-bisect.html loads any scene with URL-param engine
   options; extend it or add a sibling probe):
   - spatial spikes: after N warm frames, readback the composited frame;
     count pixels with luminance > 8x the median of their 5x5
     neighborhood. Report count and the max ratio.
   - temporal spikes: static camera, converged; over 60 frames count
     pixel events where luminance > 4x that pixel's previous frame.
     Report events/frame.
   - Run on: museum (GI on), arena, gallery amber, gallery fox. GI ON is
     the owner's complaint; bench GI-off too as the control.
2. Ghosting: reuse the presets-round ghost@40 arena metric unchanged, so
   numbers are comparable to the 0.12.0 baseline.
3. Gemini temporal protocol (this is the review style the owner asked
   for; still images CANNOT judge these artifacts):
   - critic.py --gpu --mode video, 12-15s clips, scripted camera orbit
     plus one mid-clip object drag, per scene per config.
   - Ask Gemini SPECIFICALLY: "Watch for (a) transient bright pixels or
     sparkles: where and at what timestamps; (b) trails or smearing
     behind the moving object; (c) shimmering or boiling in shadowed
     areas. Count and locate them. Then the open question: does this
     look like stable, production-quality rendering?"
   - A/B pairs are BLIND (label them A and B, never before/after) and
     every quote in the report is attributed to its clip.
4. Record the full baseline table BEFORE any engine edit. Fence: every
   candidate fix is adopted or rejected on these numbers plus the blind
   clips, never on a hunch.

## Part 2: firefly fixes, in priority order, each A/B fenced

1. Pre-accumulation anti-firefly on the raw RT lighting buffer (before
   the EMA): NRD-style soft clamp of each sample against its 3x3
   neighborhood (e.g. clamp to neighborhood max, or RCRS rank filter).
   Cheapest, and the architect's prime suspect. One fullscreen pass or
   inline in the accumulation shader.
2. History-relative soft clamp: clamp the incoming sample against the
   temporal mean + k*sigma. Needs the moment buffers from item 3; if 3
   lands first this is nearly free.
3. Variance-guided denoise (true SVGF): accumulate first and second
   luminance moments alongside the EMA, estimate per-pixel variance
   (spatial 7x7 fallback when count < 4), and drive the a-trous
   luminance sigma from variance instead of the 8/sqrt(count) heuristic.
   This also reduces smear of everything, not just fireflies.
4. Cap retuning LAST, only with evidence: W=32, specular 4x, indirect
   4.0 were never swept against a metric. Sweep them only after 1-3 land
   so you are not tuning around a bug.
Adopt what wins, revert what does not, document both. Energy honesty:
every clamp biases; note measured mean-luminance change per scene per
adopted fix (>3% mean shift on any scene = flag it in the report).

## Part 3: hybrid disocclusion fallback (the ghosting/noise half)

Context, and the answer to the owner's "how do RTX games do it": shipping
hybrid titles rasterize primary visibility into a G-buffer and ray trace
only secondary effects at low rates, then denoise hard and upscale. THIS
ENGINE ALREADY HAS THAT SHAPE (raster GBufferPass, traced lighting,
ReSTIR, EMA, a-trous, TAA). What they have and we lack, besides Part 2:
a plan for disoccluded pixels. When history resets, they fall back to a
spatially-filtered or analytically-lit estimate instead of showing raw
1-sample noise, and they detect stale history early (A-SVGF temporal
gradients) instead of waiting for it to ghost.

Implement, fenced by ghost@40 plus blind drag clips:
1. Disocclusion fallback: for pixels with count < K (start K=4), blend
   toward a cheap analytic estimate: env ambient plus lambert direct
   from the brightest light, modulated by the wider-kernel spatial
   filter result. The blend weight fades out as count grows. Goal: a
   freshly revealed wall looks dim-but-clean instead of boiling.
2. Wider a-trous for low-count pixels only (variance guidance from Part
   2.3 gives this nearly free).
3. STRETCH, only if 1-2 leave budget: A-SVGF-style temporal gradient
   check (re-trace a sparse subset of last frame's samples with this
   frame's camera; large delta = drop history early). Skip if tight.

## Process

- Work in the prepared worktree only. NO git commands, ever.
- Serve on port 8127 ONLY. Nothing else. (Last round an agent took the
  owner's live 8115 server down by ignoring this line. Do not.)
- The dev server, probe pages, bench scripts: yours to extend. Vendored
  copies elsewhere are not yours to touch.
- Keep 60fps at defaults on this machine's 3060 for museum and gallery
  scenes; report frame-time before/after per adopted change (the fence
  harness from the presets round measures this).
- WebGL2 constraints: 16-sampler ceiling is already tight; new moment
  buffers must reuse or pack into existing targets where possible.
  WebKit breaks at a 4th traceRadiance call site; do not add one.
- Report to REPORT_TEMPORAL_QUALITY.md: baseline table, per-fix A/B
  numbers, attributed critic quotes, adopted/rejected with reasons,
  energy-shift table, honest caveats. Screenshots and clips under
  _reviews/temporal/.
- CHANGELOG entry under 0.13.0-dev; do not touch version fields in
  package.json (architect's call at merge).

The architect gates with fresh clips, the bench, and the taste question,
and will reject on unexplained energy shifts or any fence regression.
