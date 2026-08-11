# REPORT: glass art pass (Lumiere + Sunset read as stained glass; Alabaster restage)

Branch `glass-art-pass`. This round touched `examples/scene.js` (the museum
scene), `examples/main.js` (the museum boot config), and the probe/report
surface under `_reviews/artpass/`. Engine `src/` is untouched. The render
self-test matrix and the museum's own `?selftest=1` still pass (see Perf
section). All before/after captures live under `_reviews/artpass/`.

No emoji, no em dash was introduced in any report text.

## 1. Baseline diagnosis (Gemini critic, round 0)

Baseline captures were taken before any change (boot config 0.375 lighting
res, full-rate GI, tinted glass and scattering toggled on through the probe
surface). The open-question critic named the two problems the spec called out.

Goal 1 (glass):
- "The colored tiles on the Lumiere screen do not read as real stained glass.
  They look pale, washed out, and resemble frosted grey plastic. The room
  behind them is visible only as a highly diffused, muddy blur." (round 0 open)

Goal 2 (Alabaster):
- "The two spheres beside the lamp do not look visually distinct; both appear
  as identical, matte white globes." (round 0 open)

Two probe findings set the direction:
- The Lumiere projector is GATED by the panel's tinted-glass gateHook, and
  `RTDEMO.setFeature("absorption")` bypasses that hook, so the projector
  stayed hidden in a plain probe run. The screen was therefore not lit by its
  own beam at all, and the coloured-shadow floor quilt never rendered. The
  probe surface now reveals every `gated: "absorption"` light explicitly.
- With ReSTIR on, the tinted-shadow quilt cannot render: ReSTIR shades primary
  direct light with one binary visibility ray, so the per-channel transmittance
  march never runs. The panel's own tinted-shadows toggle disables ReSTIR (and
  fast lights) through `borrowRestir`; the probe mirrors that.

## 2. Goal 1: Lumiere + Sunset read as stained glass

### What changed and why

`examples/scene.js`:

1. Deepened every Lumiere cell's attenuation. `TILE_HUES` moved from
   `RUBY 0xff2418@0.10`, `COBALT 0x2f6bff@0.07`, `AMBER2 0xff9a2e@0.07`,
   `EMERALD 0x21c46a@0.06` to `RUBY 0xff1008@0.09`,
   `COBALT 0x1038ff@0.065`, `AMBER2 0xff6e00@0.065`,
   `EMERALD 0x00b850@0.055`. The authored optical depth (about 1-3) read as a
   pale wash behind the 0.375-res lighting haze; the deeper attenuation makes
   each hue cut through the haze. Each cell still scales its
   `attenuationDistance` by built/design so the authored thickness story holds.
2. Made the CLEAR control tile truly clear: pure-white `attenuationColor`
   means sigma 0 on every channel, so the tracer reads it as plain glass and
   the room shows through un-tinted. This is the A/B that proves the other
   eight cells' colour is the absorption, not a tinted albedo.
3. Added a soft warm fill light (`lumFill`, intensity 15, radius 0.5) behind
   the Lumiere screen, gated with the ensemble. The view path through a tile
   refracts onto the open floor BEHIND the screen, and that floor was barely
   lit, so every tile read as a dark smudge no matter how deep the palette.
   The fill lights exactly that region; the tinted view path now has bright
   light to attenuate. Measured centre pixels at the default view before the
   fill: `RUBY [95,22,22]`; after: `RUBY [239,74,59]`. The hue went from dark
   to vivid because the light behind it got bright.
4. Raised the projector intensity 55 -> 115. The coloured-shadow quilt is the
   projector beam attenuated per tile; the deeper palette makes it more
   saturated but dimmer, so the beam had to come up to keep it rich rather
   than dim. The quilt centre pixels went from neutral `[140,160]` to warm
   `[200,235]` and the critic reads it as "exceptionally rich" (see round
   quotes below).
5. Raised the tile IOR 1.5 -> 1.62. The critic read the subtle 1.5 bend as
   "frosted plastic"; the stronger bend makes a pane visibly warp whatever is
   behind it, which is what reads as glass rather than a tinted filter.
6. Sunset relief (`castGlass` materials): rebalanced to
   `amber 0xff7a20@0.34`, `red 0xdd2020@0.26`, `blue 0x1058ff@0.30` and raised
   the backlight emissive intensity 6 -> 12. The base-commit chord fix adds
   `2*eps` (about 7 cm in this room) to every measured view chord, so the first
   deep attempt made the blocks near-opaque black plastic. The rebalance keeps
   a clear pale-vs-deep gradient across the 0.10-0.30 m block thicknesses, and
   the brighter backlight keeps the joints and thin cells glowing.
7. Boot config (`examples/main.js`): `renderScale 0.375 -> 0.325` and
   `giHalfRate: true`. This is the 60 fps contract (section 5).

### Goal 1 critic loop

- Round 1 (deep palette, no projector): "The tiles do not read as real stained
  glass. They lack refraction and specular highlights, appearing as muddy,
  frosted plastic." "The colored-shadow floor quilt is non-existent." The
  quilt was absent because the projector was never revealed by the probe.
- Round 2 (projector revealed, ReSTIR off): "The room is visible through
  them." "The colored-shadow floor quilt is colorful but lacks richness and
  definition. Highly diffused and blurry." "The Sunset relief successfully
  demonstrates a pale-to-deep thickness story." The tiles were still dark.
- Round 3 (bright fill behind the screen): the measured tile pixels jumped
  from `[95,22,22]` to `[245,81,60]`-range, and the quilt read warm and rich.
  Critic: "highly saturated, multi-colored grid shadow."
- Round 4 (final, IOR 1.62): "The Lumiere tiles read their hues beautifully.
  The frosted texture strikes a great balance: background elements (like the
  helmet pedestal and spheres) are clearly identifiable through the glass while
  preserving the rich saturation of each colored tile." "The accumulated
  shadow quilt is exceptionally rich, sharp, and realistic."

## 3. Goal 2: Alabaster exhibit restage

### What changed and why

`examples/scene.js`:

1. Removed the clip. The two spheres used to sit ON the tabletop at
   `(+/-0.44, z 0.34)`, r 0.2. At that height (the shade's bottom rim, y 1.02)
   their centre sat `sqrt(0.44^2+0.34^2)=0.56` from the lamp axis, inside the
   shade's 0.58 bottom radius: the owner's screenshot clip. They now stand on
   ONE shared light-stone plinth at the lamp's right-front, clear of the
   tabletop and the shade (numeric proof in section 4).
2. Grown the spheres r 0.2 -> 0.30 so the pair reads from the default museum
   camera. The round-0 critic could not tell them apart at r 0.2; the grown
   pair reads as dark vs green (measured: absorb `[26,26,27]`, jade
   `[38,119,85]` at the default camera).
3. One shared plinth, not two. The first restage used two separate plinths and
   the critic read them as "two unrelated spheres separated by the lamp
   table". A single 1.5 x 0.55 x 0.55 warm light-stone plinth (the duck
   vitrine's plinth family, `0xd8d4cc`) holds both spheres 0.80 m apart, and
   the pair reads as one deliberate A/B exhibit. The plinth is deliberately
   light: the dark marble's whole point is that it is the dark one, and it
   vanishes against a dark stand.
4. Sphere roughness 0.34 -> 0.16 so the dark sphere catches a tight specular
   glint from the warm light. At 0.34 it read as "a matte black void"; the
   glint is what makes it read as polished dark glass, and it sits on top of
   the jade's green instead of covering it.
5. Reduced the lamp bulb emissive 9 -> 5.5. At 9 the shade's bloom washed out
   the stem/finial join and the shade read as a flat white disc; at 5.5 the
   shade still glows warmly through the alabaster wall and lights the table
   through it (the KM story survives), but the stem, shade rim and finial
   read as a real object.
6. Placed the plinth at `PLINTH_CX 1.75` (not 1.5): at 1.5 the dark sphere
   lined up with the bronze lamp base from the default camera and its
   silhouette vanished into the dark metal. 1.75 frames it against the light
   floor instead.

The sphere albedo is untouched (white): the pigment comes entirely from
K/S via `userData.rtAttenuation` and `userData.rtScattering`, exactly as
before. The KM story is intact: the shade still glows through its wall and
the bulb still lights the table through it.

### Goal 2 critic loop

- Round 1 (spheres on table, refraction not enabled in the capture probe):
  "Both render as identical, flat, matte-white globes." The capture probe had
  not enabled refraction for the scattering toggle (the panel's KM toggle
  brings refraction with it, `RTDEMO.setFeature` does not). The backplates the
  critic saw looked like "untextured placeholders" and were removed.
- Round 2 (refraction enabled): "one green, one dark" spheres read, but the
  dark sphere "loses its silhouette against the dark plinth" and the jade read
  as "semi-matte green plastic".
- Round 3 (light plinths, glossier spheres): "The two spheres do not read as
  an intentional A/B pair... separated by too much depth and interrupted by
  the lamp table."
- Round 4 (shared plinth): "The dark glass and green jade spheres read
  successfully as an intentional A/B pair with no physical clipping." The pair
  was still too close together (0.20 m apart at r 0.30 read as overlapping on
  screen) and the plinth read dark.
- Round 5 (spheres 0.20 m apart on one warm plinth, bulb reduced): "do not
  clip" and "one dark glass marble vs one green jade" confirmed; the only
  remaining exhibit note was the dark sphere framing against the lamp base.
- Round 6 (plinth moved to frame the dark sphere against the light floor):
  converged. The critic's remaining items were the lamp shade's uniform KM
  glow, the pre-existing red wall, and the shared chrome/UI, none of which are
  in this round's scope (see Caveats).

## 4. Numeric no-interpenetration proof

Measured from the live scene (world positions, alabaster group at
`(-4.6, 0, 3.2)`), via `_reviews/artpass/no-clip-check.py`. All clearances are
>= 0; the designed contacts are exactly 0.

| Pair | Geometry | Clearance |
|---|---|---|
| absorb sphere vs shade | sphere xz 1.595 from axis, r 0.30; shade rim 0.523 at sphere top | 0.772 m |
| scatter sphere vs shade | sphere xz 2.312 from axis, r 0.30; shade rim 0.523 | 1.489 m |
| absorb sphere vs table | sphere xz 1.595 - r 0.30 vs table radius 0.78 | 0.515 m |
| scatter sphere vs table | sphere xz 2.312 - r 0.30 vs table radius 0.78 | 1.232 m |
| sphere vs sphere | centres 0.80 apart, 2r = 0.60 | 0.200 m |
| sphere vs plinth | sphere bottom y 0.55 = plinth top y 0.55 | 0.000 m (seated) |
| plinth vs table | nearest plinth corner xz 1.154 vs table radius 0.78 | 0.374 m |
| lamp stem vs shade rim | stem radius 0.045 vs shade top inner rim 0.20 | 0.155 m |
| lamp finial vs shade | finial bottom y 1.57 = shade top y 1.57 | 0.000 m (rests) |
| bulb vs shade | bulb xz 0.00, r 0.11 vs shade inner 0.32 at bulb height | 0.210 m |

The lamp reads as a held object, not a floating one: the stem passes up
through the shade's top opening (0.045 vs 0.20 rim) and the finial (radius
0.26) caps the opening by resting on the shade top rim. The finial and the
spheres are seated exactly, not interpenetrating.

## 5. Performance ledger

Measured with the probe surface (GPU ANGLE/GL, adaptive quality OFF, 300-frame
window) after all changes. The 60 fps contract is for the DEFAULT boot config.

| State / viewport | avg ms | p95 ms | avg fps | badge |
|---|---|---|---|---|
| boot, 1280x800 | 16.67 | 18.5 | 60.0 | 60 fps |
| boot, 390x844 | ~16.7 | ~18 | 60.0 | 60 fps |
| glass default, 1280x800 | 18.05 | 19.9 | 55.4 | 56 fps |
| glass close-up, 1280x800 | 21.28 | 23.2 | 47.0 | 47 fps |
| quilt (tinted shadows), 1280x800 | 39.54 | 41.8 | 25.3 | 25 fps |
| alabaster, 1280x800 | ~19-22 | ~21-24 | ~47-52 | 47-52 fps |
| glass / alabaster, 390x844 | ~16.7 | ~18 | 60.0 | 60 fps |

The boot regression from 0.375+full-GI (45 fps) to the new default
(0.325 + half-rate GI, 60 fps) is the 60 fps contract: the museum must hold
60 fps at defaults on this machine, and it does at both viewports. The heavy
feature states (tinted shadows, glass close-up) are honestly slower; they are
opt-in panel rows whose whole point is to show per-feature cost. The render
self-test matrix passes with the final code (both chromium legs, plus
empty-scene, usage-diagnostics and presets checks); firefox and webkit are the
documented environmental skips on this machine.

## 6. Honest caveats

- The glass still renders soft ("frosted") at the default 0.325 lighting
  resolution: the refracted room behind a tile is denoised and upscaled, so it
  reads as a soft glow rather than a crisp refracting window. The deepened
  palette cuts through that haze (the goal), and the critic accepted the
  balance ("a great balance"), but a sharper refraction would need a higher
  lighting res, which the 60 fps contract does not allow at this machine.
- The lamp shade's glow is the Kubelka-Munk model's uniform two-flux
  reflectance, so it reads as a flat translucent glow rather than a bulb
  hot-spot with a falloff gradient. That is the model's behaviour, not a scene
  bug; it is exactly what the scattering exhibit demonstrates.
- The coloured-shadow quilt at the desktop default view runs ~25 fps with
  ReSTIR off (ReSTIR is disabled by the tinted-shadows toggle because its
  binary visibility ray would erase the tint). Mobile holds 60 fps for the
  same state. This is the documented feature cost, not a regression.
- The red wall, the room's asset mix (helmet, duck, fox, lamp), the flat wall
  plaster, and the shared technical panel are prior rounds' deliberate design
  and were flagged again by the final holistic critic ("asset-testing
  sandbox", "flat sterile walls", "technical UI overload"). Changing them is
  out of this round's scope (engine `src/` frozen; the museum's asset palette
  is the tour's identity).
- The probe surface had to reveal the gated projector/fill lights and disable
  ReSTIR for the quilt, mirroring what the panel's own gateHooks and
  borrowRestir do, because `RTDEMO.setFeature` bypasses the panel. This is a
  probe detail, not a runtime change.

## Review-loop outcome

Both goals ran a critic loop to convergence. Goal 1 converged when the critic
read the tiles' hues as "beautifully" saturated with the room identifiable
through them and the quilt as "exceptionally rich, sharp, and realistic".
Goal 2 converged when the critic read the two spheres as "an intentional A/B
pair with no physical clipping" and the lamp as a held object. The numeric
no-interpenetration proof (section 4) is all non-negative with the designed
contacts exactly seated. Every existing exhibit, toggle, slider and debug view
still works; the boot museum holds 60 fps at both viewports after the changes.
