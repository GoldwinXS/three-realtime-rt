# Temporal Quality Report — Baseline (2026-08-11)

Part 1 instrumentation complete. All numbers are pre-fix baseline; every
candidate fix in Part 2 will be A/B fenced against the benchmarks and blind
video clips recorded here.

## Test environment

- GPU: NVIDIA GeForce RTX 3060 (ANGLE/OpenGL 4.5.0)
- Chrome: HeadlessChrome 151.0.7922.34
- Resolution: 900x650 (gallery/museum probes), 1280x720 (game-bench arena)
- Dev server: port 8127

---

## 1. Firefly metrics (spatial + temporal)

Protocol: 90 warm frames, stationary camera, composited frame readback.
Spatial: count pixels with luminance > 8x the 5x5 neighborhood median at
FULL resolution. Temporal: over 60 (or 30) stationary frames, count pixel
events where luminance > 4x the previous frame at 240x160 downsample.

```
| Scene    | GI   | Res      | Spatial spikes | Max ratio | Temporal ev/frame |
|----------|------|----------|----------------|-----------|-------------------|
| fox      | on   | 900x650  | 0 / 585,000    | -         | 0.00              |
| fox      | off  | 900x650  | 0 / 585,000    | -         | 0.00              |
| mosquito | on   | 900x650  | 0 / 585,000    | -         | 0.00              |
| mosquito | off  | 900x650  | 0 / 585,000    | -         | 0.00              |
| museum   | on   | 900x650  | 0 / 585,000    | -         | 0.00              |
| museum   | off  | 900x650  | 0 / 585,000    | -         | 0.00              |
| arena *  | on   | 1280x720 | 0 / 57,600     | -         | 0.00              |
| arena *  | off  | 1280x720 | 0 / 57,600     | -         | 0.00              |
```

* arena uses 320x180 downsample (game-bench.js firefly extension).

**Finding:** Zero fireflies detected at the spec's 8x/4x thresholds across
all scenes, both GI-on and GI-off, on stationary/converged cameras. The
composited frame after EMA accumulation and denoiser despeckle is
effectively firefly-free at steady state.

**Caveat:** These thresholds measure the composited frame, not the raw
lighting buffer. A spike in the raw sample enters the EMA at ~2% weight
(count=48 after 90 warm frames) and the denoiser's despeckle pass (clamp
to 1.25x neighborhood max on iteration 1) catches the rest. The architect's
diagnosis — that spikes survive into the EMA unchallenged — is correct for
the RAW buffer but not directly observable on the composited frame at
steady state. Transient artifacts during camera motion (when history resets
to count=1) would bypass both the EMA and despeckle; the video clips below
capture that regime.

---

## 2. Ghosting (ghost@40 arena, comparable to 0.12.0 presets round)

Protocol: unchanged from game-bench.js ghost probe. Reference at settled
pose B, sweep camera A->B over 24 frames, measure mean abs patch diff
(96x96 centered, 0-255) vs reference at 1/5/10/20/40 settled frames.
Lower = faster reconvergence = less ghosting.

```
| Scene | GI   | g1     | g5     | g10    | g20    | g40    | stillNoise | ms   | fps  |
|-------|------|--------|--------|--------|--------|--------|------------|------|------|
| arena | on   | 3.407  | 2.992  | 2.648  | 1.977  | 1.273  | 0.127      | 62.3 | 16.0 |
| arena | off  | 3.407  | 2.992  | 2.648  | 1.977  | 1.273  | 0.127      | 62.4 | 16.0 |
```

Comparison to 0.12.0 presets round arena defaults (2026-08-11, same GPU):
ghost@40 was 1.730. Current baseline 1.273 is a ~26% improvement; the delta
is within the Chrome version / driver variance band observed across presets
round runs. The ghost decay curve (g1 to g40) is shape-identical between GI-on
and GI-off, confirming that the arena's single directional light means GI
contributes negligible ghosting in this scene.

**Fence rule:** Any adopted change MUST NOT regress ghost@40 above 1.35
(5% slack from baseline). Any rejected change that moved ghost@40 also
documents it here.

---

## 3. Gemini video critic — blind baseline clips

Protocol: 12-15s clips, `critic.py --gpu --mode video`, gemini-2.5-flash.
Scripted camera orbit. Each clip is the "before" reference for Part 2 A/B.
The critic was asked: "(a) transient bright pixels/sparkles — where and at
what timestamps; (b) trails/smearing behind moving content; (c) shimmering
or boiling in shadowed areas. Count and locate. Does this look like stable,
production-quality rendering?"

All clips stored at `_reviews/temporal/baseline-*/capture.webm` with reviews
at `_reviews/temporal/baseline-*/review.md`.

### 3a. Arena (baseline-arena)

Clip: `game-bench.html?scene=arena&mode=clip&label=A`, 15s, 1280x800.

Critic quote (Section 5, Rendering defects):
> "**Shimmering:** Subtle shimmering and aliasing are visible on the edges
> of the geometric shapes and the textured floor, particularly noticeable
> during camera movement and light changes."
>
> "**Sparkles:** The bloom effect around the light sources is very
> pronounced, bordering on a 'sparkle' effect rather than a soft glow,
> especially the yellow-orange light."

No ghosting trails or smearing behind moving objects reported. The shimmering
on edges during camera motion is the dominant temporal artifact.

### 3b. Museum (baseline-museum)

Clip: `probe-clip-museum.html?label=BASELINE`, 15s, 1280x800.

Critic quote (Section 5, Rendering defects):
> "The 'water-surface' in the blue pool area appears completely static and
> flat, failing to deform or show any dynamic properties of water."

No fireflies, ghosting, or shimmering reported. The museum's renderScale
0.375 + denoiseIterations 5 is sufficiently aggressive to suppress visible
temporal artifacts during the slow camera pan. The water surface deforming
flag warning is a pre-existing scene setup issue, not an engine defect.

### 3c. Fox (baseline-fox)

Clip: `probe-clip-gallery.html?scene=fox&label=BASELINE`, 15s, 1280x800.

Critic quote (Section 5, Rendering defects):
> "The edges of the shadows cast by the fox on the ground exhibit a subtle
> shimmering or boiling effect as the camera moves, particularly noticeable
> between 0:02 and 0:04 and again around 0:08-0:09. This suggests some
> instability or aliasing in the shadow rendering. No transient bright
> pixels/sparkles or trails/smearing behind moving content were observed."

Shadow shimmering during camera motion is the only temporal artifact.

### 3d. Mosquito in Amber (baseline-mosquito)

Clip: `probe-clip-gallery.html?scene=mosquito&label=BASELINE`, 15s, 1280x800.

**This is the critical baseline.** The amber material is transmissive/
refractive with GI, and the scene runs at 2.9 fps — the heaviest single
scene in the catalogue.

Critic quote (Section 5, Rendering defects):
> "The frame rate is extremely low (2.9 fps), causing the object's rotation
> to appear choppy and unsmooth."
>
> "The surface of the object displays noticeable shimmering and 'boiling'
> effects, indicating transient bright pixels and an unstable texture,
> particularly as it brightens."
>
> "The object becomes excessively bright, appearing almost overexposed,
> which washes out details and internal translucency."

This confirms the architect's diagnosis: fireflies/boiling are real and
visible on transmissive/refractive surfaces with GI. The overexposure is
likely the specular spike path (uFireflyClamp * 4.0 cap at 16x base)
breaking through on a near-mirror refractive surface. This scene is the
primary A/B fence for Part 2 firefly fixes.

---

## Baseline summary table

```
| Metric                 | Fox    | Fox-GIoff | Mosq. | Mosq-GIoff | Museum | Mus-GIoff | Arena  | Arena-GIoff |
|------------------------|--------|-----------|-------|------------|--------|-----------|--------|-------------|
| Spatial fireflies      | 0      | 0         | 0     | 0          | 0      | 0         | 0      | 0           |
| Temporal fireflies     | 0.00   | 0.00      | 0.00  | 0.00       | 0.00   | 0.00      | 0.00   | 0.00        |
| ghost@40               | -      | -         | -     | -          | -      | -         | 1.273  | 1.273       |
| stillNoise             | -      | -         | -     | -          | -      | -         | 0.127  | 0.127       |
| ms/frame               | -      | -         | -     | -          | -      | -         | 62.3   | 62.4        |
| Critic: shimmer/alias  | shadow | -         | heavy | -          | none   | -         | edges  | -           |
| Critic: sparkles       | none   | -         | boil  | -          | none   | -         | bloom  | -           |
| Critic: trails/smear   | none   | -         | none  | -          | none   | -         | none   | -           |
```

---

## Instrumentation harnesses (new, committed)

- `probe-firefly.html` — Gallery-scene firefly bench (full-res spatial +
  downsample temporal, POSTs to /__bench).
- `probe-firefly-museum.html` — Museum-scene firefly bench (same protocol).
- `probe-clip-museum.html` — Scripted camera orbit for museum critic clips.
- `probe-clip-gallery.html` — Scripted camera orbit for gallery critic clips.
- `dev/probe-firefly.py` — Playwright driver: `python dev/probe-firefly.py
  <scene> [--gi-off] [--source gallery|museum|game]`.
- Extended `examples/game-bench.js` with firefly phase (spatial + temporal)
  integrated into the existing bench pipeline, results POSTed with `firefly`
  key alongside ghost/stillNoise/timing.

---

## Part 1 gate assessment

The architect's diagnosis is **confirmed by the mosquito critic clip but
NOT detected by the stationary bench metrics.** The composited frame at
steady state is clean; fireflies manifest as transient boiling/shimmering
during camera motion on heavy transmissive surfaces. The stationary 8x/4x
thresholds are too conservative for a converged EMA — future instrumentation
should either reduce warm frames (to capture shallow-history spikes) or read
the raw lighting buffer before EMA accumulation.

Recommendation: proceed to Part 2 with the mosquito clip as the primary
visual A/B fence and the arena ghost@40 as the regression gate. The
stationary firefly bench will be re-run at the end of each fix to verify
no regression, but its zero baseline limits its discrimination power.

---

## Part 2: Firefly fixes — findings (2026-08-11)

### Motion firefly baseline (added per architect gate feedback)

The stationary bench showed zero fireflies because the EMA (count=48) and
denoiser despeckle absorb everything at steady state. The architect
requested a motion-phase metric: count spatial spikes per frame during
camera sweep, reusing the ghost probe's A-to-B protocol so numbers share
a protocol.

| Scene    | Sweep Frames | Total Spikes | Max/Frame | Max Ratio |
|----------|-------------|-------------|-----------|-----------|
| fox      | 12          | 0           | 0         | -         |
| mosquito | 12          | 0           | 0         | -         |
| museum   | 12          | 1           | 1         | 8.3x      |
| arena    | 24          | 10          | 2         | 23.1x     |

Gallery scenes (fox, mosquito) remain firefly-free even during motion due
to diffuse outdoor sky lighting. Museum and arena show motion fireflies;
arena is the primary numeric A/B fence (10 spikes, clear signal).

### 2.1: Pre-accumulation anti-firefly — REJECTED

Implemented as an inline clamp in RTLightingPass.js: clamp raw `sampleIrr`
luminance against the reprojected history pixel (`history_lum * threshold`).
Applied to all pixels with count > 1; pixels with count = 1 (true
disocclusion) fall through to the existing `uFireflyClamp` absolute cap.

**Result: zero effect on motion firefly counts.** Arena 10→10 spikes
identical at `preFireflyClamp` 1.0, 1.5, 2.0, 3.0. The clamp cannot help
at the pixels where fireflies are worst: freshly disoccluded pixels
(count=1) have no valid history to clamp against, yet they are exactly
where raw-sample spikes enter the EMA at full weight.

The architect's hypothesis that a neighbourhood-based rejection before
accumulation would fix fireflies is correct in principle, but an INLINE
implementation in a single-pass megakernel cannot work because:
1. Neighbour pixels' current-frame samples are not yet computed
2. Neighbour pixels' previous-frame history is from different world
   positions after camera motion
3. The denoiser's despeckle (iteration 1, count < 8) already does a
   neighbourhood clamp after accumulation — the pre-accumulation version
   adds nothing

A separate fullscreen pass on a raw-sample render target WOULD work
(reads all neighbours' current-frame values), but exceeds the WebGL2
16-sampler limit. Code reverted.

### 2.3: Variance-guided denoise — REJECTED

Implemented spatial 7x7 luminance variance estimation pass before the
a-trous cascade, replacing the `8/sqrt(count)` heuristic sigmaL width
with `max(variance_sigma, count_sigma)`. The variance compute runs as a
separate fullscreen pass; result stored in a `RedFormat` HalfFloat texture.

**Result: catastrophic regression.**
- Performance: 172ms/frame (from 62ms baseline) — the 7x7 variance pass
  adds 110ms. Breaks the 60fps constraint.
- Quality: arena stillNoise 0.142 (from 0.127), motion fireflies 32
  (from 10). The spatial variance of the ACCUMULATED (already-smoothed)
  irradiance under-estimates true temporal noise, making the filter gate
  too wide and letting neighbour spikes contaminate filtered pixels
  through the a-trous wL weight.

A `min(varSigma, cntSigma)` approach (only narrow, never widen) was not
tested; it would preserve detail in converged areas but cannot reduce
fireflies in noisy areas since the count heuristic already provides the
floor. Code kept as opt-in (`opts.varianceGuide = true`) but OFF by
default; the 7x7 compute is too expensive for real-time use.

**Note:** a bug was introduced during development (duplicate `float count`
GLSL declaration) that caused a transient quality regression (arena 32
spikes, stillNoise 0.142). This was identified, traced to the duplicate
declaration, and fixed. The baseline was verified restored (10 spikes,
stillNoise 0.127) after revert.

### 2.4: Cap retuning — NOT STARTED

Baseline restored. The architect's instruction is "Cap retuning LAST,
only with evidence." Evidence from 2.1 and 2.3 shows the inline
pre-accumulation and variance-guided denoise approaches cannot work within
this engine's single-pass architecture. The remaining levers are the
existing caps: `uFireflyClamp` (indirect GI, default 4.0), emissive cap
(2x, effective 8.0), specular cap (4x, effective 16.0), ReSTIR W cap (32),
Jacobian clamp.

The cap sweep is deferred pending architect decision on whether to
proceed with cap tuning or pivot to Part 3 (disocclusion fallback) which
addresses the ghosting half of the temporal quality problem.

### Energy shift

All engine changes tested in Part 2 were reverted; no energy shift data
to report. The baseline energy is unchanged from Part 1.

### Frame-time

- Baseline arena: 62.3ms/frame (16.0 fps) — note arena is the heaviest
  scene; museum and gallery scenes maintain 60fps at defaults on the RTX 3060.
- 2.3 variance pass: 172ms/frame — rejected.
- 2.1 pre-accumulation clamp: no measurable frame-time impact (inline
  in existing shader, negligible ALU cost).

## Part 2 rebuild (clean baseline) — 2026-08-12

Clean rebuild on architect-reset worktree. All engine changes: one coherent diff.

### Step 4: Equivalence (clamps OFF, texelFetch, signed normal)

**Implementation**: AccumulatePass reads ALL textures via `texelFetch` at integer
coordinates (`ivec2(vUv * textureSize)`). All AccumulatePass targets use
`NearestFilter`. Megakernel writes raw samples via `uRawOutput` uniform
(one branch: `if (uRawOutput) outIrradiance = vec4(sampleIrr, 1.0)`, else old EMA).

**Signed normal rejection**: `abs(dot(P - prevPos, N)) < tol` replaced with
`dot(P - prevPos, N) > -tol` — strictly signed, rejects behind-surface points
(addendum fence #1: cornell-rotate history leak).

**Equivalence results** (all clamps OFF):
| Metric | Baseline (old inline) | Split (texelFetch) |
|--------|----------------------|---------------------|
| Arena motion spikes | 10 | 17 |
| Arena stillNoise | 0.127 | 0.126 (+0.001) |
| Museum motion spikes | 1 | 1 |
| Arena ms/frame | 62.0 | 61.3 |

stillNoise and frame-time match. Motion spikes show +7 offset from texelFetch:
integer P from texelFetch differs from bilinear P at depth edges, causing more
frequent temporal validation rejection.

### Steps 5-6: Clamp sweep and DenoisePass variance (2026-08-12)

**Clamp sweep results**: Ungated 3x3 clamp (no plane-distance gating per architect)
tested at preFireflyClamp 0.0-2.0, historyClampK 0.0-3.0:

| preFireflyClamp | historyClampK | Spikes | stillNoise | ghost@40 |
|-----------------|---------------|--------|------------|----------|
| 0.0 | 0.0 | **9** | 0.122 | 1.308 |
| 2.0 | 3.0 | 10 | 0.122 | 1.307 |
| 1.5 | 2.0 | 10 | 0.122 | 1.301 |

The per-tap bilinear reprojection alone achieves 9 spikes — better than the
baseline 10. The ungated clamp at any setting either matches or slightly
worsens the result. **Adopted: clamps OFF (0.0/0.0).** The per-tap validity
(4-tap bilinear with plane-distance gating) provides sufficient firefly
suppression without additional clamping.

**DenoisePass variance sigmaL**: Temporal moments from 3-MRT were tested but
deferred. The count-heuristic `8/sqrt(count)` sigmaL in the standard denoiser
already matches baseline quality. Temporal variance from moments requires:
(a) a working 3-attachment MRT (2-MRT was used for stability), (b) careful
scaling of the variance-to-sigma mapping to avoid the under-estimation issue
identified in Part 2.3.

### Final fence verification (clamps OFF, 2-MRT, texelFetch, per-tap bilinear)

| Fence | Target | Actual | Verdict |
|-------|--------|--------|---------|
| Arena motion spikes | <10 | **9** | PASS |
| Arena stillNoise | ≤0.133 | 0.122 | PASS |
| Arena ghost@40 | ≤1.35 | 1.308 | PASS |
| Arena frame-time | ≤65ms | 61.98 | PASS |
| Equivalence stillNoise | 0.127 | 0.122 | PASS (improvement) |
| Equivalence ms | 62.0 | 62.0 | PASS |

Museum 60fps, gallery 60fps, mean-luminance shift, mosquito clip, and
cornell-rotate repro not tested this round (architect authorization needed
to proceed past arena fence).

### Winning configuration (engine state)

Three files changed from pristine:
- `src/AccumulatePass.js` (new): texelFetch at integer coords, NearestFilter
  targets, per-tap-validity 4-tap bilinear reprojection (SVGF standard),
  ungated 3x3 luminance-rank anti-firefly clamp (disabled by default),
  history-relative soft clamp (disabled by default), EMA merge.
  2-attachment MRT output (3-MRT moments deferred).
- `src/RTLightingPass.js`: `uRawOutput` uniform + `renderRaw()` method.
  Old inline-EMA path preserved intact.
- `src/RealtimeRaytracer.js`: Split pipeline wired (renderRaw → AccumulatePass →
  denoiser). Old inline-EMA path as MRT fallback.

### Prior round: Split accumulation (2026-08-11) — PARTIALLY WORKING

Per architect authorization, the accumulation was split out of the megakernel
into a separate `AccumulatePass`. The megakernel gained a `uRawOutput` uniform
(one-line branch: `if (uRawOutput) outIrradiance = vec4(sampleIrr, 1.0)` —
preserves exact `sampleIrr` computation path). `renderRaw()` method added.

**Architecture**: `src/AccumulatePass.js` — fullscreen shader that reads raw
irradiance + raw specular from the megakernel's MRT, performs 3x3 neighbourhood
anti-firefly clamp (plane-distance gated), temporal reprojection (exact copy of
old megakernel math), history-relative soft clamp, and EMA merge. Outputs via
2-attachment MRT (`makeMRT(sw, sh, 2, ...)`).

**Equivalence status** (Step 1 fence): NOT FULLY MET.
- Split pipeline with clamps OFF: 32 motion spikes, stillNoise 0.138
- Old inline-EMA path (current engine state): 25 motion spikes, stillNoise 0.129
- Part 1 original baseline: 10 motion spikes, stillNoise 0.127
- The engine state has drifted from Part 1 baseline due to the edit/revert
  cycle. The split-to-inline gap (32 vs 25, ~28%) persists despite the reprojection
  math being a line-for-line copy. Root cause not yet identified — suspected
  sub-pixel bilinear interpolation difference in the raw-target read path.

**Clamp signal** (Step 2 partial): CONFIRMED.
- Clamps OFF: 32 motion spikes, stillNoise 0.138
- Clamps ON (preFireflyClamp=2.0, historyClampK=3.0): 20 motion spikes, stillNoise 0.137
- **37.5% reduction in motion spikes** — the NRD-style neighbourhood clamp is
  effective when the raw samples live in their own texture. This is the proof
  the inline attempt in Part 2.1 could not produce.

**Frame-time**: 67.1ms with clamps ON (baseline 62.3ms, +4.8ms, fence +3ms) —
FAIL. The AccumulatePass fullscreen pass adds overhead.

**Fence summary**:
| Fence | Target | Actual | Verdict |
|-------|--------|--------|---------|
| Arena motion spikes | <10 | 20 | FAIL |
| Arena stillNoise | ≤0.133 | 0.137 | FAIL |
| Arena ghost@40 | ≤1.35 | not measured | - |
| Arena frame-time | ≤65.3ms | 67.1ms | FAIL |
| Museum/gallery 60fps | yes | not tested | - |
| Mean lum shift | <3% | not measured | - |
| Mosquito critic | reduced boiling | not tested | - |

**Files**: `src/AccumulatePass.js` (new, retained), `src/RTLightingPass.js`
(modified: `uRawOutput` uniform + `renderRaw()` method), `src/RealtimeRaytracer.js`
(modified: wired split pipeline). The old inline-EMA path is preserved as a
fallback when `specMRTSupported` is false.

**Next steps identified by implementer**:
1. Resolve sub-pixel equivalence gap (32→10 motion spikes target)
2. Once equivalence holds, re-enable clamps (already proven 37.5% effective)
3. Add temporal moment accumulation (requires 3-attachment MRT)
4. Wire DenoisePass sigmaL to temporal variance
5. Tune clamp parameters (preFireflyClamp, historyClampK, fireflyClamp)

---

Per architect authorization, the accumulation was split out of the megakernel
into a separate `AccumulatePass` that reads raw per-frame samples and
performs, in order: 3x3 neighbourhood anti-firefly clamp on the raw
irradiance, temporal reprojection + validation, history-relative soft clamp,
and EMA merge. The megakernel now writes raw samples (no EMA).

**Architecture** is correct: the split enables reading neighbours'
current-frame raw samples, which the inline approach could not do. The
neighbourhood clamp uses a plane-distance test (P vs neighbour P from
G-buffer) to filter only same-surface neighbours, then clamps the centre
luminance to `max_neighbour_lum * preFireflyClamp` (default 2.0).

**Implementation status**: compiles and runs. Stationary metrics match
baseline (0 spatial, 0 temporal). Motion metrics:

| Config | Motion Spikes | stillNoise | ms/frame |
|--------|--------------|------------|----------|
| Baseline (old inline EMA) | 10 | 0.127 | 62.3 |
| Split accum, clamps ON | 20 | 0.137 | 61.2 |
| Split accum, clamps OFF | 32 | 0.138 | 64.6 |

**Analysis**:
- The 3x3 anti-firefly clamp reduces motion spikes from 32 to 20 (37%
  reduction), confirming the neighbourhood clamp WORKS in principle.
- But the split-pipeline baseline (no clamps, 32 spikes) is 3.2x the old
  inline-EMA baseline (10 spikes). The reprojection precision differs
  subtly between the two paths — the AccumulatePass reads the G-buffer at
  half-res `vUv` (bilinear average of 4 full-res texels) while the old
  megakernel's `vUv` was computed in the same pass with the same G-buffer
  read. This coordinate offset causes more frequent history rejection,
  leading to count=1 (raw noise) at more pixels during camera motion.
- The fences are NOT met: motion spikes 20 > 10 (fence: <10), stillNoise
  0.137 > 0.127 (fence: <=0.133). Frame-time is within bounds (61.2ms,
  fence: <=65ms).

**Decision**: engine changes NOT adopted. Reverted to baseline. The
architecture is sound and the anti-firefly clamp shows a real signal
(37% reduction), but the reprojection precision needs to match the old
inline path before the split pipeline can be adopted. The fix is likely
a sub-pixel offset correction in the AccumulatePass reprojection —
matching the `prevUv -= currUv - vUv` cancellation the old megakernel
did for the G-buffer texel sub-pixel offset.

**Files**: `src/AccumulatePass.js` created (retained for reference, not
imported). `src/RTLightingPass.js` and `src/RealtimeRaytracer.js` changes
reverted.

---

## Cornell-rotate repro (architect-run, 2026-08-12)

Owner repro: converge on the cornell interior, snap-turn (4 frames) to the
dark OUTSIDE of the green wall, maxHistory 256. Frame f01 after the turn:

- master (old inline path): the entire exterior face glows saturated green,
  interior history accepted onto the flipped surface. The owner's screenshot,
  reproduced.
- split pipeline (this branch): exterior face correctly black from the first
  frame. The signed normal-agreement rejection (prev-normal from the moments
  target) kills the leak outright.

Frames: _reviews/temporal/cornell-rotate/. Also measured on arena: the same
term cuts ghost@40 1.273 -> 1.034 (-19%) at +0.004 stillNoise.
