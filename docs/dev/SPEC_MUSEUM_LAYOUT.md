# SPEC: museum exhibit repositioning (the round the owner actually wanted)

Author: the architect. Implementer: you. Branch `museum-layout`. No emojis,
no em dashes, no questions. src/ is frozen.

## The brief

After the glow-up round (skies, textures, coping, GI) the owner says: "the
room looks better but I was hoping things would be repositioned a bit to
make them fit a bit better." The previous round moved the CAMERA but barely
moved the EXHIBITS. This round is physical re-layout: move things.

## What to do

Re-lay-out the museum's exhibits so the room reads as a curated gallery with
deliberate zones, sightlines and breathing room. You may move, rotate,
regroup and re-plinth ANY exhibit (helmet, knot, teapot, duck vitrine,
materials bench spheres, Lumiere screen, Sunset shadow-box, wall panes,
accent panes, pool, fox, OPEN sign), resize or redesign plinths and pads,
and adjust the walls' exhibit hangings. Constraints:

- Nothing floats (seat everything programmatically, the seatOn pattern).
- Keep every exhibit present and every UI toggle functional; exhibits that
  appear with a feature toggle must still appear in a sensible spot.
- Keep the light/NEE budget ledger legal (32 lights, 256 NEE tris) and
  report it after.
- The water pool and the Lumiere screen have fixed plumbing (projector spot,
  colored-shadow A/B); move them only if their demos still read correctly.
- Perf: within the post-glow-up envelope (fence before/after, governor off).

## Process

Critic loop, open question first: "Is this a well-curated gallery layout?
What placement feels accidental, crowded, or disconnected?" Desktop 1280x800
and phone 390x844, video with an orbit sweep and a walk. Loop to
convergence. Reference standard: a real small museum room: zones with one
hero per sightline, related pieces grouped, walking space, nothing crammed
in a corner and nothing marooned.

## Deliverables

REPORT_MUSEUM_LAYOUT.md: the before/after floor plan (ASCII sketch is
fine), what moved and why, critic quotes attributed, budget ledger, perf
numbers, honest caveats. Artifacts under _reviews/museum-layout/. Port 8134
only. The architect gates with drag captures.
