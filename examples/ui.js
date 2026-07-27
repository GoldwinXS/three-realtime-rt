// Control panel for the showcase. Pure DOM + injected CSS (no framework), SVG
// icons only. Mutates the raytracer / physics / scene directly and flips fields
// on the shared `state` object that the render loop reads.

// Vite resolves JSON named imports in dev and build alike, so the fps badge
// always shows the version being served rather than a hand-copied string.
import { version } from "../package.json";

const CSS = `
:root { --panel-bg: rgba(14,18,24,0.82); --panel-br: #26323c; --ink: #d7e0e6;
  --ink-dim: #8298a6; --accent: #38d0e0; --accent-2: #7ee787; }
* { box-sizing: border-box; }
#panel { position: fixed; top: 14px; right: 14px; z-index: 20; width: 268px;
  max-height: calc(100vh - 28px); overflow-y: auto;
  font: 12px/1.45 ui-monospace, "SF Mono", Consolas, monospace; color: var(--ink);
  background: var(--panel-bg); border: 1px solid var(--panel-br); border-radius: 10px;
  backdrop-filter: blur(10px); box-shadow: 0 8px 30px rgba(0,0,0,0.45); user-select: none; }
#panel::-webkit-scrollbar { width: 8px; } #panel::-webkit-scrollbar-thumb { background: #2b3a45; border-radius: 4px; }
#panel .hd { display: flex; align-items: center; gap: 8px; padding: 12px 14px 8px; }
#panel .hd svg { width: 16px; height: 16px; color: var(--accent); }
#panel .hd b { font-size: 13px; letter-spacing: 0.3px; }
#panel .hd .tag { margin-left: auto; font-size: 10px; color: var(--ink-dim); }
#panel .sec { border-top: 1px solid var(--panel-br); padding: 8px 14px 12px; }
#panel .sec h3 { display: flex; align-items: center; gap: 7px; margin: 4px 0 8px;
  font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--ink-dim); }
#panel .sec h3 svg { width: 13px; height: 13px; }
#panel .row { display: flex; align-items: center; gap: 8px; min-height: 24px; margin: 3px 0; }
#panel .row label { flex: 1; cursor: pointer; }
#panel .row .val { color: var(--accent); font-variant-numeric: tabular-nums; min-width: 34px; text-align: right; }
/* sub-toggle: a modifier of the row above it, dimmed while its parent is off */
#panel .row.sub { margin-left: 6px; padding-left: 9px; border-left: 2px solid var(--panel-br); }
#panel .row.sub.dim { opacity: 0.4; }
#panel .note { margin: 0 0 6px 15px; color: var(--ink-dim); font-size: 10px; line-height: 1.35; }
/* toggle switch */
.sw { position: relative; width: 34px; height: 18px; flex: none; }
.sw input { opacity: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
.sw .track { position: absolute; inset: 0; background: #2a3742; border-radius: 10px; transition: background .15s; pointer-events: none; }
.sw .knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
  background: #8298a6; transition: transform .15s, background .15s; pointer-events: none; }
.sw input:checked + .track { background: rgba(56,208,224,0.35); }
.sw input:checked + .track + .knob { transform: translateX(16px); background: var(--accent); }
#panel input[type=range] { flex: 1; accent-color: var(--accent); height: 3px; }
#panel select { background: #131a20; color: var(--ink); border: 1px solid #37474f;
  border-radius: 5px; font: inherit; padding: 2px 5px; flex: 1; }
#panel input[type=color] { width: 26px; height: 20px; padding: 0; border: 1px solid #37474f;
  border-radius: 4px; background: none; cursor: pointer; flex: none; }
#panel .btns { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px; }
#panel button { font: inherit; color: var(--ink); background: #17222b; border: 1px solid #2f414d;
  border-radius: 6px; padding: 7px 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all .12s; }
#panel button:hover { background: #1e2d38; border-color: var(--accent); color: #fff; }
#panel button svg { width: 13px; height: 13px; }
#panel button.wide { grid-column: 1 / -1; }
#panel .stats { border-top: 1px solid var(--panel-br); padding: 9px 14px; color: var(--ink-dim);
  white-space: pre; font-size: 11px; line-height: 1.5; }
#panel .stats b { color: var(--accent-2); }
#panel .stats a { color: var(--accent-2); text-decoration: none; }
#panel .stats a:hover { text-decoration: underline; }
#hint { position: fixed; bottom: 12px; left: 14px; z-index: 20; color: #6b7f8c;
  font: 11px ui-monospace, Consolas, monospace; background: rgba(14,18,24,0.7);
  border: 1px solid #26323c; border-radius: 6px; padding: 6px 10px; }
/* fps readout — top-left, always visible even with the panel collapsed */
#fps { position: fixed; top: 14px; left: 14px; z-index: 20; color: var(--accent-2);
  font: 12px ui-monospace, "SF Mono", Consolas, monospace; font-variant-numeric: tabular-nums;
  background: rgba(14,18,24,0.75); border: 1px solid #26323c; border-radius: 6px;
  padding: 5px 9px; min-width: 58px; text-align: right; }
/* collapsed panel: header only (the chevron in the header toggles it) */
#panel .hd .fold { margin-left: 4px; flex: none; background: none; border: none;
  padding: 2px; cursor: pointer; color: var(--ink-dim); display: flex; }
#panel .hd .fold:hover { color: var(--accent); background: none; border: none; }
#panel .hd .fold svg { width: 15px; height: 15px; transition: transform .15s; }
#panel.min .hd .fold svg { transform: rotate(180deg); }
#panel.min .sec, #panel.min .stats { display: none; }
`;

const ICON = {
  chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.6 1 1.4 1 2.3h6c0-.9.4-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5zM3 7l9 5 9-5M12 12v10"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v14M6 12l6 6 6-6"/></svg>',
  burst: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"/></svg>',
  fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h16M4 12h16M4 16h16"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg>',
};

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function toggle(labelText, checked, onChange) {
  const row = el("div", "row");
  const lab = el("label", null, labelText);
  const sw = el("label", "sw");
  const input = el("input");
  input.type = "checkbox";
  input.checked = checked;
  input.addEventListener("change", () => onChange(input.checked));
  sw.append(input, el("span", "track"), el("span", "knob"));
  const id = "t" + Math.random().toString(36).slice(2, 7);
  lab.setAttribute("for", id);
  input.id = id;
  row.append(lab, sw);
  return { row, input };
}

function slider(labelText, min, max, step, value, fmt, onInput) {
  const row = el("div", "row");
  const lab = el("label", null, labelText);
  const input = el("input");
  input.type = "range";
  input.min = min; input.max = max; input.step = step; input.value = value;
  const val = el("span", "val", fmt(value));
  input.addEventListener("input", () => {
    onInput(parseFloat(input.value));
    val.textContent = fmt(parseFloat(input.value));
  });
  row.append(lab, input, val);
  return row;
}

function selectRow(labelText, options, value, onChange) {
  const row = el("div", "row");
  const lab = el("label", null, labelText);
  const sel = el("select");
  for (const [t, v] of options) {
    const o = el("option", null, t);
    o.value = v;
    if (String(v) === String(value)) o.selected = true;
    sel.append(o);
  }
  sel.addEventListener("change", () => onChange(sel.value));
  row.append(lab, sel);
  return row;
}

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

export function buildUI({ rt, physics, lights, scene, state, refreshLights, spawnPile, setFeature, setExtraLights, setWindows, setCanvasScale, canvasScale }) {
  document.head.append(el("style", null, CSS));

  const panel = el("div");
  panel.id = "panel";

  const hd = el("div", "hd", `${ICON.chip}<b>three-realtime-rt</b><span class="tag">RT on</span>`);
  // Collapse chevron: on phones the panel covers most of the scene, so it also
  // starts collapsed there (the header stays as the handle to reopen it).
  const fold = el("button", "fold", ICON.chev);
  fold.title = "collapse / expand panel";
  fold.addEventListener("click", () => panel.classList.toggle("min"));
  hd.append(fold);
  panel.append(hd);
  if (matchMedia("(max-width: 700px)").matches) panel.classList.add("min");

  // Always-on fps readout, top-left: counts real presented frames via its own
  // rAF (rAF callbacks fire once per displayed frame, same cadence as the
  // render loop), refreshed twice a second.
  // The badge doubles as a field diagnostic: build version + which fallbacks
  // fired (device bug reports arrive as photos of this corner).
  const diag = `v${version}${rt.specMRTSupported ? "" : " · no-mrt"}`;
  const fps = el("div");
  fps.id = "fps";
  fps.textContent = `-- fps · ${diag}`;
  document.body.append(fps);
  let fpsFrames = 0;
  let fpsLast = performance.now();
  (function fpsTick() {
    requestAnimationFrame(fpsTick);
    fpsFrames++;
    const now = performance.now();
    if (now - fpsLast >= 500) {
      fps.textContent = `${((fpsFrames * 1000) / (now - fpsLast)).toFixed(0)} fps · ${diag}`;
      fpsFrames = 0;
      fpsLast = now;
    }
  })();

  // --- Renderer (core pipeline; watch the fps readout as you change these) ---
  const rSec = el("div", "sec");
  rSec.append(el("h3", null, `${ICON.layers} Renderer`));
  rSec.append(toggle("ray tracing", state.rtEnabled, (v) => (state.rtEnabled = v)).row);
  rSec.append(toggle("auto quality", rt.adaptiveQuality, (v) => { rt.adaptiveQuality = v; }).row);
  rSec.append(toggle("denoise", rt.denoise, (v) => (rt.denoise = v)).row);
  rSec.append(toggle("TAA (anti-alias)", rt.taa, (v) => { rt.taa = v; rt.resetAccumulation(); }).row);
  // Include the mobile preset's scales — otherwise touching this dropdown on
  // a phone locks you out of the value the page started with. Manual choice
  // takes the wheel from the adaptive governor.
  rSec.append(
    // Whole-canvas buffer scale (the "browser zoom" trick as a control):
    // barely visible on dense screens, quadratic savings on EVERY pass.
    selectRow("resolution", [["100%", 1], ["85%", 0.85], ["75%", 0.75], ["62%", 0.62], ["50%", 0.5]], canvasScale, (v) => {
      setCanvasScale(parseFloat(v));
    })
  );
  rSec.append(
    selectRow("lighting res", [["100%", 1], ["75%", 0.75], ["50%", 0.5], ["37%", 0.375], ["25%", 0.25]], rt.renderScale, (v) => {
      rt.adaptiveQuality = false;
      rt.renderScale = parseFloat(v);
    })
  );
  rSec.append(
    // Overscan: render past the canvas edges and crop back, so the leading-edge
    // disocclusion noise during camera motion is born off-screen. Costs pixels
    // (0.1 → 1.44×), so it lives next to the resolution controls.
    selectRow("overscan", [["off", 0], ["5%", 0.05], ["10%", 0.1]], rt.overscan, (v) => {
      rt.overscan = parseFloat(v);
    })
  );
  rSec.append(
    selectRow("view", [
      ["composite", 0], ["albedo", 1], ["normals", 2],
      ["irradiance", 3], ["world pos", 4], ["emissive", 5], ["specular", 6],
      ["bvh cost", 7],
    ], rt.outputMode, (v) => (rt.outputMode = parseInt(v, 10)))
  );
  // BVH-cost heatmap scale: the slider is "visits to saturate" (hot/white end),
  // 32..512; rt.costScale is its reciprocal. Only affects the mode-7 view.
  rSec.append(
    slider("cost scale", 32, 512, 16, Math.round(1 / rt.costScale),
      (x) => `${Number(x).toFixed(0)} hits`, (v) => (rt.costScale = 1 / v))
  );
  panel.append(rSec);

  // Rows in one section sometimes have to drive rows in another (a feature
  // toggle revealing the light that belongs to the piece it reveals). Sections
  // are built top-down, so the dependency is registered here and consumed by
  // whichever section is built later — every hook fires from a click, long
  // after buildUI has finished.
  const gateHooks = { absorption: [] };

  // ReSTIR is written from two places (its own checkbox and the coloured-shadow
  // auto-off), so its full semantics live in one function and the UI is always
  // told what happened. `restirSavedState` holds what to restore when the
  // coloured-shadow toggle releases it; null means it is not holding anything.
  let restirSavedState = null;
  const applyRestir = (v) => {
    rt.restir = v;
    restirT.input.checked = v;
    if (!v) {
      rt.stochasticLights = false;
      fastLights.input.checked = false;
    }
    rt.resetAccumulation();
  };
  // TWO feature toggles now need ReSTIR out of the way, for the same reason:
  // both act on the next-event shadow rays, and the reservoir path replaces
  // those with a single BINARY visibility ray, so with ReSTIR on the effect
  // never reaches a primary surface at all. They borrow it through ONE counted
  // lease instead of each stashing a private copy — the first borrower saves the
  // state, the last to hand it back restores it — because either can be switched
  // while the other is on, and two private copies would fight over the restore.
  const restirBorrowers = new Set();
  const borrowRestir = (who, on) => {
    if (on) {
      if (restirSavedState === null) {
        restirSavedState = { restir: rt.restir, stochasticLights: rt.stochasticLights };
      }
      restirBorrowers.add(who);
      if (rt.restir) applyRestir(false);
      return;
    }
    restirBorrowers.delete(who);
    if (restirBorrowers.size > 0 || !restirSavedState) return;
    const prev = restirSavedState;
    restirSavedState = null;
    if (prev.restir !== rt.restir) applyRestir(prev.restir);
    if (prev.stochasticLights !== rt.stochasticLights) {
      rt.stochasticLights = prev.stochasticLights;
      fastLights.input.checked = prev.stochasticLights;
    }
  };

  // --- RT features: additive effects, each with a visible frame-time cost.
  // Tiered defaults leave the heavy ones off on phones — turning them on IS
  // the demo ("what does this cost on MY hardware?").
  const fSec = el("div", "sec");
  fSec.append(el("h3", null, `${ICON.bulb} RT features`));
  // Routed through setFeature — reflections/refraction also reveal a showcase
  // sphere and recompile the BVH, which main() owns. Initial state reads the
  // current rt values (all false at the minimal start).
  fSec.append(toggle("PBR specular", rt.specular, (v) => { rt.specular = v; rt.resetAccumulation(); }).row);
  fSec.append(toggle("global illumination", rt.gi, (v) => setFeature("gi", v)).row);
  fSec.append(toggle("half-rate GI (fast)", rt.giHalfRate, (v) => { rt.giHalfRate = v; rt.resetAccumulation(); }).row);
  // Experimental: reservoir reuse of the 1-bounce GI sample (temporal-only).
  // Only meaningful when global illumination is on; injected at the denoise stage.
  fSec.append(toggle("ReSTIR GI (exp)", rt.restirGI, (v) => { rt.restirGI = v; rt.resetAccumulation(); }).row);
  fSec.append(toggle("emissive area lights", rt.emissiveNEE, (v) => setFeature("emissive", v)).row);
  fSec.append(toggle("reflections", rt.reflections, (v) => setFeature("reflections", v)).row);
  // Grab the refraction toggle so the tinted-glass handler can switch it on.
  const refractionT = toggle("refraction", rt.refraction, (v) => setFeature("refraction", v));
  fSec.append(refractionT.row);
  // Tinted glass (Beer-Lambert absorption): reveals the museum's GLASS ENSEMBLE
  // — the Sunset relief on the red wall and the Lumiere stained-glass screen on
  // centre stage — and recompiles with per-material absorption; OFF strips back
  // to the byte-identical no-absorption program, so flipping this while watching
  // the fps readout IS the feature's cost measurement. The effect only exists on
  // refracted paths, so turning it on brings refraction with it (same pattern as
  // ReSTIR unchecking fast lights below).
  // Coloured shadows, the shadow-ray half of the same feature: a shadow ray
  // crossing absorbing glass is attenuated per channel instead of blocked, so
  // the projector's beam lands on the floor as a nine-tile light quilt instead
  // of one flat dark rectangle. Declared before "tinted glass" so that toggle
  // can enable it (it is a no-op with no absorbing material in the scene),
  // appended after it as an indented sub-row.
  const applyTintedShadows = (v) => {
    rt.absorptionShadows = v;
    // THE COUPLING. With ReSTIR lights on, primary direct light is shaded from
    // the reservoir's winner by ONE BINARY visibility ray — so the per-channel
    // transmittance march never runs on a primary surface and this toggle would
    // appear to do NOTHING on the floor. Rather than explain that in a footnote
    // and let the user conclude the feature is broken, switch ReSTIR off for
    // them, visibly: the checkbox below unchecks itself and the note says why.
    // The previous state is restored when this goes back off (see borrowRestir).
    borrowRestir("tintedShadows", v);
    rt.resetAccumulation();
  };
  const tintedShadows = toggle("tinted shadows", rt.absorptionShadows, applyTintedShadows);
  tintedShadows.row.classList.add("sub", "dim");
  tintedShadows.input.disabled = true; // meaningless until something absorbs
  const tintedNote = el("div", "note");
  tintedNote.textContent =
    "acts on the direct + emissive shadow rays, so it needs them: ReSTIR shades " +
    "primary direct light with one BINARY visibility ray, and turning this on " +
    "unchecks “ReSTIR lights” (and “fast lights” with it) so the tint actually " +
    "reaches the floor. Turning it off puts both back.";
  fSec.append(toggle("tinted glass", false, (v) => {
    if (v && !rt.refraction) {
      refractionT.input.checked = true;
      setFeature("refraction", true);
    }
    setFeature("absorption", v);
    tintedShadows.row.classList.toggle("dim", !v);
    tintedShadows.input.disabled = !v;
    tintedNote.style.display = v ? "" : "none";
    // Turning the ensemble off must not leave the coloured-shadow program (and
    // its borrowed ReSTIR state) hanging around with nothing to act on.
    if (!v && tintedShadows.input.checked) {
      tintedShadows.input.checked = false;
      applyTintedShadows(false); // also hands ReSTIR back
    }
    // Reveal / retire the Lumiere projector row in the Lights section.
    for (const hook of gateHooks.absorption || []) hook(v);
  }).row);
  fSec.append(tintedShadows.row);
  tintedNote.style.display = "none"; // revealed with the piece
  fSec.append(tintedNote);
  // Chromatic dispersion on the refracted term — the diamond-ior glass sphere on
  // the materials bench splits white light into a rainbow. Default 0 (off): the
  // stochastic spectral sampling estimates one colour channel per glass pixel
  // per frame, which triples the transmitted term's variance and adds visible
  // grain on the sphere at the demo's reduced render scale before it fully
  // converges. Drag it up to see the effect; it shimmers slightly while
  // converging, so reset the accumulator on each change.
  fSec.append(slider("dispersion", 0, 0.3, 0.01, rt.dispersion, (x) => Number(x).toFixed(2), (v) => { rt.dispersion = v; rt.resetAccumulation(); }));
  // Kubelka-Munk scattering: reveals "Alabaster" — the reading lamp whose cast-
  // stone shade is lit from outside by the room and from inside by its own bulb,
  // plus the two spheres that differ ONLY in whether they scatter. Absorption
  // alone can only remove light, so the left sphere stays a dark green marble
  // while the right becomes jade. Off strips back to the byte-identical
  // no-scattering program, so flipping this while watching the fps readout IS
  // the feature's cost measurement. Brings refraction with it (same pattern as
  // "tinted glass") because the absorption-only control sphere needs the glass
  // path to render as glass at all.
  const kmNote = el("div", "note");
  kmNote.textContent =
    "the lamp's light REACHES the table through its shade, which is a shadow-ray " +
    "effect — so this unchecks “ReSTIR lights” (and “fast lights” with it) for the " +
    "same reason “tinted shadows” does, and puts both back when it goes off. The " +
    "shade's own outward glow needs neither.";
  fSec.append(toggle("scattering (Kubelka-Munk)", false, (v) => {
    if (v && !rt.refraction) {
      refractionT.input.checked = true;
      setFeature("refraction", true);
    }
    setFeature("scattering", v);
    kmNote.style.display = v ? "" : "none";
    borrowRestir("kmScattering", v);
  }).row);
  fSec.append(kmNote);
  kmNote.style.display = "none"; // revealed with the piece
  // Grab the fast-lights toggle first so the ReSTIR handler can uncheck it.
  const fastLights = toggle("fast lights (1 ray)", rt.stochasticLights, (v) => { rt.stochasticLights = v; rt.adaptiveQuality = false; rt.resetAccumulation(); });
  // Turning ReSTIR OFF must drop us onto the per-light-rays baseline, NOT the
  // flat-cost stochastic "fast lights" path — otherwise both sides scale the
  // same with light count and ReSTIR's advantage never shows up in the fps.
  const restirT = toggle("ReSTIR lights", rt.restir, (v) => {
    // A manual flip is the user taking the wheel back: void the lease outright
    // so no borrower can ever overwrite this choice on its way out.
    restirSavedState = null;
    restirBorrowers.clear();
    applyRestir(v);
  });
  fSec.append(restirT.row);
  fSec.append(fastLights.row);
  fSec.append(slider("firefly clamp", 1, 8, 0.5, rt.fireflyClamp, (x) => Number(x).toFixed(1), (v) => (rt.fireflyClamp = v)));
  fSec.append(slider("history length", 8, 128, 8, rt.maxHistory, (x) => Number(x).toFixed(0), (v) => (rt.maxHistory = v)));
  fSec.append(slider("denoise passes", 0, 5, 1, rt.denoiseIterations, (x) => Number(x).toFixed(0), (v) => (rt.denoiseIterations = v)));
  panel.append(fSec);

  // --- Lights ---
  const lSec = el("div", "sec");
  lSec.append(el("h3", null, `${ICON.bulb} Lights`));
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
  panel.append(lSec);

  // --- Atmosphere ---
  const aSec = el("div", "sec");
  aSec.append(el("h3", null, `${ICON.fog} Atmosphere`));
  aSec.append(toggle("fog / haze", rt.fog.enabled, (v) => { rt.fog.enabled = v; rt.resetAccumulation(); }).row);
  aSec.append(toggle("volumetric light", rt.volumetric.enabled, (v) => { rt.volumetric.enabled = v; rt.resetAccumulation(); }).row);
  aSec.append(slider("density", 0.01, 0.12, 0.005, rt.fog.density, (x) => x.toFixed(2), (v) => (rt.fog.density = v)));
  panel.append(aSec);

  // --- Physics ---
  const pSec = el("div", "sec");
  pSec.append(el("h3", null, `${ICON.cube} Physics`));
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
  panel.append(pSec);

  const stats = el("div", "stats");
  panel.append(stats);

  const links = el("div", "stats");
  links.innerHTML =
    `<a href="https://github.com/GoldwinXS/three-realtime-rt" target="_blank" rel="noopener">GitHub (MIT)</a>` +
    ` &middot; <a href="https://goldwinxs.itch.io/three-realtime-rt-supporter-pack" target="_blank" rel="noopener">Supporter pack</a>`;
  panel.append(links);

  document.body.append(panel);

  const hint = el("div");
  hint.id = "hint";
  hint.textContent = "drag to orbit · scroll to zoom · try Drop / Explode";
  document.body.append(hint);

  return {
    setStats(html) {
      stats.innerHTML = html;
    },
  };
}
