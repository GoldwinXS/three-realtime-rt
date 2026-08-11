// The MUSEUM room's exhibit controls (tour stop 2).
//
// The renderer/lighting panel this used to contain moved to examples/panel.js,
// where every stop of the tour shares one copy of it. What is left here is what
// only the museum has: its Lights section (the named fixtures, the clerestory
// windows, the party-light stress slider) and its Physics section (the prop
// pile, the deforming water, the walking fox). Both are appended into the
// shared panel's `exhibits` container, below the renderer sections.
//
// Pure DOM, SVG icons only. Mutates the raytracer / physics / scene directly and
// flips fields on the shared `state` object that the render loop reads.

import { buildPanel, section, el, toggle, slider, ICON } from "./panel.js";

// One light's row. Returns { row, input } so callers can drive the checkbox —
// a light whose SUBJECT is hidden (desc.gated) is dimmed + disabled until the
// toggle that reveals the subject switches it on.
function lightRow(desc, rt, scene) {
  const { label: name, light, color: hasColor, onToggle } = desc;
  const row = el("div", "row");
  const lab = el("label", null, name);
  const sw = el("label", "sw");
  const input = el("input");
  input.type = "checkbox";
  input.checked = light.visible && light.intensity > 0;
  input.addEventListener("change", () => {
    light.visible = input.checked;
    rt.updateLights(scene);
    // Some lights carry an emissive companion (e.g. the orbit light's orb) that
    // must be shown/hidden and recompiled together — the descriptor's onToggle
    // owns that. It runs after updateLights and does its own resetAccumulation.
    if (onToggle) onToggle(input.checked);
    else rt.resetAccumulation();
  });
  sw.append(input, el("span", "track"), el("span", "knob"));
  row.append(lab);
  if (hasColor && light.color) {
    const col = el("input");
    col.type = "color";
    col.value = "#" + light.color.getHexString();
    col.addEventListener("input", () => {
      light.color.set(col.value);
      rt.updateLights(scene);
      rt.resetAccumulation();
    });
    row.append(col);
  }
  row.append(sw);
  return { row, input };
}

export function buildUI({ rt, physics, lights, scene, state, refreshLights, spawnPile, setFeature, setExtraLights, setWindows, setCanvasScale, canvasScale, initial }) {
  // The shared renderer panel — identical on every stop of the tour.
  const ui = buildPanel({
    rt, state, setFeature, setCanvasScale, canvasScale, initial,
    hint: "",
  });
  const { gateHooks, exhibits } = ui;

  // --- Lights (this room's fixtures) ---
  const lSec = section(ICON.bulb, "Lights");
  for (const desc of lights) {
    const { row, input } = lightRow(desc, rt, scene);
    lSec.append(row);
    if (!desc.gated) continue;
    // A gated light (the Lumiere projector) keeps its row so the panel never
    // reflows, but reads as unavailable until its subject exists: indented,
    // dimmed and disabled, with a note naming the toggle that brings it in.
    row.classList.add("sub", "dim");
    input.disabled = true;
    const gateNote = el("div", "note");
    gateNote.textContent = "lights the Lumiere screen — arrives with “tinted glass”.";
    lSec.append(gateNote);
    (gateHooks[desc.gated] || (gateHooks[desc.gated] = [])).push((on) => {
      row.classList.toggle("dim", !on);
      input.disabled = !on;
      // The projector exists to shine through the screen: it comes up WITH the
      // ensemble and goes dark with it, and the checkbox state says so.
      input.checked = on;
      desc.light.visible = on;
      refreshLights();
      rt.resetAccumulation();
    });
  }
  // Emissive clerestory windows — each is a true sampled area light; moving
  // this recompiles the light tables (deliberate, same hitch as pile spawn).
  lSec.append(slider("windows", 0, 6, 1, 3, (x) => Number(x).toFixed(0), (v) => setWindows && setWindows(Math.round(v))));
  lSec.append(slider("party lights", 0, 13, 1, 0, (x) => Number(x).toFixed(0), (v) => setExtraLights(Math.round(v))));
  exhibits.append(lSec);

  // --- Physics ---
  const pSec = section(ICON.cube, "Physics");
  pSec.append(toggle("simulate", !state.physicsPaused, (v) => (state.physicsPaused = !v)).row);
  // The CPU-deformed water pool (rtDeforming) — its motion is independent of the
  // rigid-body sim, so it gets its own switch.
  pSec.append(toggle("water waves", state.waterEnabled, (v) => { state.waterEnabled = v; rt.resetAccumulation(); }).row);
  // The skinned fox — CPU-skinned into the dynamic BVH so its traced shadow
  // moves with the gait. Off freezes the animation (and lets updateDynamic skip).
  pSec.append(toggle("fox walk", state.foxEnabled, (v) => { state.foxEnabled = v; rt.resetAccumulation(); }).row);
  pSec.append(slider("gravity", 0, 20, 0.5, 9.81, (x) => "-" + x.toFixed(0), (v) => physics.setGravity(-v)));
  const btns = el("div", "btns");
  const mkBtn = (icon, text, wide, fn) => {
    const b = el("button", wide ? "wide" : null, `${icon}<span>${text}</span>`);
    b.addEventListener("click", fn);
    return b;
  };
  btns.append(
    mkBtn(ICON.cube, "Spawn pile", true, () => spawnPile && spawnPile()),
    mkBtn(ICON.down, "Drop", false, () => physics.dropWave()),
    mkBtn(ICON.burst, "Explode", false, () => physics.explode()),
    mkBtn(ICON.reset, "Reset pile", true, () => physics.reset())
  );
  pSec.append(btns);
  exhibits.append(pSec);

  return ui;
}
