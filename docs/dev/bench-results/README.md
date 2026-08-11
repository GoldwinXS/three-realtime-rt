# bench-results — read this before comparing two files

Each file here is one run of [`bench.html?autorun=1`](../bench.html), written by
the dev server's `/__bench` sink and named
`<ISO timestamp>-<git rev>.json`.

## These files are NOT a time series

Every result in this directory was written on **2026-07-19**, and every one of
them keys its first scene as **`"room"`**. That key is the problem: the scene
behind it has been replaced twice since.

| when | what `"room"` meant |
|---|---|
| ≤ 2026-07-19 (every file here) | the original Cornell-style test room — coloured side walls, a handful of props |
| 2026-07-22 (`36e4570`, `2715ab8`) | the room redesigned as a gallery |
| 2026-07-26 (`779ffa3`, `c2f78f1`) | the **museum**: zone plan, the Lumiere screen, ~50k triangles |

So the numbers below are three different rooms wearing one name:

```
"room" rt-full, 1280x720, renderScale 0.5   5.80 ms   (this directory, 2026-07-19)
museum  same config, quality campaign       42.6 ms   (2026-07-27)
```

That is **not** a 7× renderer regression, and nothing in this directory should
ever be quoted as one. It is a different scene with ~50× the triangles, more
lights, glass, and an emissive panel.

Two more reasons these files do not compare to anything current:

- **A different browser.** Every `userAgent` here is an Electron shell
  (`Claude/1.22209.0 … Electron/42.5.1`), not the headed Chrome with
  `--use-angle=gl --disable-gpu-vsync --disable-frame-rate-limit` that the
  quality campaign and every published figure use. The GPU path is not the same
  one, and the tokyo column in particular (5.0 ms here, 47.8 ms measured in the
  campaign at a comparable config) cannot be reconciled by scene changes alone —
  treat the whole set as *provenance-unknown*.
- **Three of them are a broken run.** The three `560d053` files at 05:33 report
  1.0 ms for `room` rt-full and 0.76 ms for tokyo — roughly raster speed. They
  are kept because deleting failed measurements is how a benchmark directory
  starts lying, but they are not data.

## What changed, going forward

`examples/bench.js` now labels scenes with a **date**: `museum-2026-07`,
`tokyo-2026-07`, and each run's JSON carries a `sceneVersions` map saying what
each key was. Bump the suffix whenever the scene's contents change materially.
A comparison across two different labels is then obviously a comparison of two
different things, instead of looking like a regression.

## Where the trustworthy numbers live

For per-feature cost, fps and image error on three scenes — measured with GPU
fences, 8 timing blocks per configuration, on a stated GPU/driver/viewport —
use [`quality-campaign/cost-matrix.json`](../quality-campaign/cost-matrix.json)
and the page that renders it, [`costs.html`](../costs.html). `bench.html` is the
quick local regression check; the campaign is the reference.
