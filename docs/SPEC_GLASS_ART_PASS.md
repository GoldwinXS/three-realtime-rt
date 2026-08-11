# Glass art pass: make the museum's glass read, and restage the lamp

Author: the architect. Implementer: you. No emojis, no em dashes. Do not
ask questions; nobody can answer them. Make the conservative choice and
record it. NO GIT, ever. Engine `src/` is READ-ONLY this round: you touch
`examples/` (mostly scene.js) and your own probes/report only.

## Context

The owner reported the Lumiere stained-glass screen rendering as "broken"
frosted grey. The engine bug behind it (refraction chord losing 2*eps,
~7cm here) is FIXED in your base commit, and every Lumiere tile is now
9-12cm thick with per-cell attenuationDistance preserving the authored
optical depth. A saturated-tint probe confirms tint reaches the screen.
What remains is ART: the authored palette (optical depth ~1-3) reads as a
pale wash behind the museum's 0.375-res lighting haze. Separately, the
owner: "the lamp looks okay but the spheres always look white unless
you're really close and they clip into the lamp shade so that whole setup
needs adjustment." The spheres at (+-0.44, z 0.34, r=0.2) geometrically
intersect the shade (bottom radius 0.58 at the same height): a real clip,
visible in his screenshot.

## Goal 1: Lumiere + Sunset read as stained glass

- Deepen each cell's tint until it reads: push attenuationColor more
  saturated and/or attenuationDistance shorter. Target: at the default
  museum viewpoint AND a 3.5m close-up, each colored tile clearly reads
  its hue with the scene visible through it; the CLEAR control tile stays
  clear. Judge CONVERGED frames only: the fps badge must show 60fps and
  frame count > 400 before you judge any capture; re-run, never judge a
  cold frame.
- The coloured-shadow floor quilt (projector through the tiles) must stay
  colored and get RICHER, not dimmer. If the quilt dims, rebalance the
  projector intensity.
- The Sunset relief (red wall) gets the same treatment: thickness palette
  is authored; tune its attenuation until pale-vs-deep reads as the
  thickness story it is supposed to tell.
- Probes: drive toggles via window.RTDEMO.setFeature; 'absorption' does
  NOT bring 'refraction' with it, enable both. Camera via window.CAMERA +
  window.CONTROLS.

## Goal 2: Alabaster exhibit restage

Hard requirements:
1. NO interpenetration anywhere: spheres, mounts, shade, stem, table.
   Verify numerically (radii + positions) in the report, not by eye.
2. The two spheres must read as the A/B they are (dark glass marble vs
   jade) from the DEFAULT museum camera, not only close up. Levers:
   bigger spheres, reposition (their own plinths beside the table is
   allowed), a darker local backdrop for contrast, lamp geometry changes
   (raise the shade, slim it, resize the table). Do NOT tint the sphere
   albedo: white albedo is the exhibit's honesty (pigment comes from K/S
   only). The KM story (shade glows through its wall, bulb lights the
   table through it) must survive.
3. The lamp must still read as a real object (shade held by the stem and
   finial, nothing floating).

## Process

- Serve on port 8134 ONLY.
- Critic loop per goal (python C:/ClaudeSessions/gemini-critic/critic.py
  --gpu): open question first ("does this look like a crafted museum
  exhibit? what feels unfinished?"), then the targeted ones ("do the
  glass tiles read as stained glass with the room visible through them?"
  "does anything clip or float?"), at 1280x800 AND 390x844. Iterate to
  convergence; attribute quotes in the report.
- Museum must hold 60fps at defaults on this machine after your changes
  (fps badge, converged).
- Report to REPORT_GLASS_ART.md: per-change what and why, before/after
  captures under _reviews/artpass/, critic quotes, the numeric
  no-interpenetration proof, honest caveats.
