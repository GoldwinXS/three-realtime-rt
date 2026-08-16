// The SHARED renderer/lighting control panel, one component used unchanged by
// every stop of the demo tour (Cornell box, museum, model scenes).
//
// This file is the museum panel (formerly all of examples/ui.js) with the
// room-specific sections lifted out. What stays here is everything that is a
// property of the RENDERER rather than of a particular room: the Renderer
// section and the Lighting & Atmosphere, Effects and Quality & Performance
// groups (including the two scene-revealing feature toggles and the counted
// ReSTIR lease they share). What left is everything that describes one room's
// contents: the museum's Lights and Physics sections now live in examples/ui.js
// and are appended into the `exhibits` container this returns, below the shared
// groups.
//
// Pure DOM + injected CSS (no framework), SVG icons only.

// Vite resolves JSON named imports in dev and build alike, so the fps badge
// always shows the version being served rather than a hand-copied string.
import { version } from "../package.json";
// The Reset button re-applies the LIBRARY's own defaults, read from the
// library rather than restated here — a second copy of these opinions in the
// demo is exactly how a "reset" ends up resetting to the wrong thing.
import { RealtimeRaytracer } from "../src/index.js";

const CSS = `
:root { --panel-bg: rgba(14,18,24,0.95); --panel-br: #26323c; --ink: #d7e0e6;
  --ink-dim: #97aab9; --accent: #38d0e0; --accent-2: #7ee787; }
* { box-sizing: border-box; }
#panel { position: fixed; top: 14px; right: 14px; z-index: 20; width: 268px;
  max-height: calc(100vh - 28px); overflow-y: auto;
  font: 12px/1.45 ui-monospace, "SF Mono", Consolas, monospace; color: var(--ink);
  background: var(--panel-bg); border: 1px solid var(--panel-br); border-radius: 10px;
  backdrop-filter: blur(10px); box-shadow: 0 8px 30px rgba(0,0,0,0.45); user-select: none; }
/* the panel is the one tall scroll surface on the page, so its scrollbar has
   to be discoverable when several groups are open at once (webkit only, which
   is what the demo targets) */
#panel::-webkit-scrollbar { width: 12px; }
#panel::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.25); }
#panel::-webkit-scrollbar-thumb { background: #4d6472; border-radius: 6px; border: 3px solid rgba(0, 0, 0, 0.35); }
#panel::-webkit-scrollbar-thumb:hover { background: #5e7988; }
/* scroll-fade: sits just above the pinned footer and appears only while content
   overflows and is not scrolled to the end, so there is always a cue that more
   controls sit below the fold (headless captures show no native scrollbar) */
#panel .panel-fade { position: absolute; left: 0; right: 0; height: 24px;
  pointer-events: none; opacity: 0; transition: opacity .15s;
  background: linear-gradient(to top, rgba(14,18,24,0.9), rgba(14,18,24,0)); }
#panel .panel-fade.show { opacity: 1; }
#panel .hd { display: flex; align-items: center; gap: 9px; padding: 12px 14px 9px; }
#panel .hd svg { width: 16px; height: 16px; color: var(--accent); }
#panel .hd b { font-size: 13px; letter-spacing: 0.3px; }
#panel .hd .tag { margin-left: auto; font-size: 10px; color: var(--ink-dim); }
#panel .sec { border-top: 1px solid var(--panel-br); padding: 9px 14px 13px; }
#panel .sec h3 { display: flex; align-items: center; gap: 7px; margin: 4px -8px 9px;
  padding: 6px 8px; font-size: 13px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.8px; color: #a5b8c6; cursor: pointer; user-select: none;
  border-radius: 5px; background: rgba(255,255,255,0.035); }
#panel .sec h3:hover { background: rgba(255,255,255,0.06); }
#panel .sec.collapsed h3 { color: #aebfcc; }
#panel .sec h3 svg { width: 13px; height: 13px; }
/* collapsible groups: the header chevron points down while the group is open,
   right while collapsed; the body rows hide with the group. The chevron is
   drawn a step brighter and larger than the section icon so the header reads
   as the click target it is. */
#panel .sec h3 .chev { flex: none; display: flex; align-items: center; color: #a8bcc8; }
#panel .sec h3 .chev svg { width: 15px; height: 15px; transition: transform .15s; }
#panel .sec h3:hover .chev { color: var(--accent); }
#panel .sec.collapsed h3 .chev svg { transform: rotate(-90deg); }
#panel .sec.collapsed > :not(h3) { display: none; }
#panel .row { display: flex; align-items: center; gap: 8px; min-height: 24px; margin: 6px 0; }
#panel .row label { flex: 1; cursor: pointer; }
#panel .row .val { color: var(--accent); font-variant-numeric: tabular-nums; min-width: 34px; text-align: right; }
/* sub-toggle: a modifier of the row above it, dimmed while its parent is off */
#panel .row.sub { margin-left: 6px; padding-left: 9px; border-left: 2px solid var(--panel-br); }
#panel .row.sub.dim { opacity: 0.4; }
#panel .note { margin: 0 0 6px 15px; color: var(--ink-dim); font-size: 10px; line-height: 1.35; }
/* "the governor owns this row" badge — a control that moves on its own has to
   say so IN the control, next to the value it is moving. */
#panel .row .gov { font-size: 9px; letter-spacing: 0.6px; text-transform: uppercase;
  color: #0c1116; background: var(--accent); border-radius: 3px; padding: 1px 4px;
  flex: none; cursor: help; }
#panel .row .gov.hide { display: none; }
/* a transient <option> the governor put there (its live value is off-ladder) */
#panel select option.gov-val { color: var(--accent); }
/* toggle switch */
.sw { position: relative; width: 34px; height: 18px; flex: none; }
/* the row rule below (#panel .row label { flex: 1 }) out-specifies .sw, which
   would stretch the switch across half the row; pin it back to 34px so labels
   keep the room they need and long ones do not wrap */
#panel .row label.sw { flex: none; width: 34px; }
.sw input { opacity: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
.sw .track { position: absolute; inset: 0; background: #2a3742; border-radius: 10px; transition: background .15s; pointer-events: none; }
.sw .knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
  background: #8298a6; transition: transform .15s, background .15s; pointer-events: none; }
.sw input:checked + .track { background: rgba(56,208,224,0.35); }
.sw input:checked + .track + .knob { transform: translateX(16px); background: var(--accent); }
#panel input[type=range] { flex: 1; accent-color: var(--accent); height: 3px; }
#panel select { background: #131a20; color: var(--ink); border: 1px solid #37474f;
  border-radius: 5px; font: inherit; padding: 2px 5px; flex: 1; min-width: 0; }
#panel input[type=color] { width: 26px; height: 20px; padding: 0; border: 1px solid #37474f;
  border-radius: 4px; background: none; cursor: pointer; flex: none; }
#panel .btns { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px; }
/* the reset bar sits OUTSIDE the collapsible groups, just above the pinned
   footer, because a control that undoes every other control should not be
   hidden inside one of the things it undoes */
#panel .reset-bar { border-top: 1px solid var(--panel-br); padding: 9px 14px; }
#panel .reset-bar button { width: 100%; }
#panel .reset-bar .note { margin: 7px 0 0 0; }
#panel button { font: inherit; color: var(--ink); background: #17222b; border: 1px solid #2f414d;
  border-radius: 6px; padding: 7px 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all .12s; }
#panel button:hover { background: #1e2d38; border-color: var(--accent); color: #fff; }
#panel button svg { width: 13px; height: 13px; }
#panel button.wide { grid-column: 1 / -1; }
/* the panel footer (fps readout + links) is pinned to the panel's bottom edge,
   so the status line and the links stay visible however many groups are open */
#panel .stats-foot { position: sticky; bottom: 0; background: rgba(14,18,24,0.96);
  border-top: 1px solid var(--panel-br); }
#panel .stats { padding: 9px 14px 5px; color: var(--ink-dim);
  white-space: pre; font-size: 11px; line-height: 1.5; }
/* the footer links: a .stats bar that must WRAP. the shared .stats rule above
   uses white-space: pre (the fps readout is multi-line), which would hold these
   three links on one unbroken line and overflow the 268px panel. */
#panel .stats.links { padding-top: 3px; padding-bottom: 9px;
  white-space: normal; font-size: 10px; line-height: 1.6; }
#panel .stats b { color: var(--accent-2); }
#panel .stats a { color: var(--accent-2); text-decoration: none; }
#panel .stats a:hover { text-decoration: underline; }
#hint { position: fixed; bottom: 12px; left: 14px; z-index: 20; color: #a9bcc9;
  font: 12px ui-monospace, Consolas, monospace; letter-spacing: 0.3px;
  background: rgba(14,18,24,0.78); border: 1px solid #2c3a46; border-radius: 7px;
  padding: 7px 11px; }
/* fps readout — top-left, always visible even with the panel collapsed */
#fps { position: fixed; top: 14px; left: 14px; z-index: 20; color: #9fe3c9;
  font: 12px ui-monospace, "SF Mono", Consolas, monospace; font-variant-numeric: tabular-nums;
  background: rgba(14,18,24,0.78); border: 1px solid #2c3a46; border-radius: 999px;
  padding: 5px 12px; min-width: 66px; text-align: right; letter-spacing: 0.3px;
  backdrop-filter: blur(8px); }
/* collapsed panel: header only (the chevron in the header toggles it) */
#panel .hd .fold { margin-left: 4px; flex: none; background: #16202b; border: 1px solid #2c3a46;
  border-radius: 6px; padding: 3px 7px; cursor: pointer; color: var(--ink-dim); display: flex; }
#panel .hd .fold:hover { color: var(--accent); border-color: var(--accent); background: #1b2831; }
#panel .hd .fold svg { width: 14px; height: 14px; transition: transform .15s; }
#panel.min .hd .fold svg { transform: rotate(180deg); }
#panel.min .sec, #panel.min .stats-foot { display: none; }
/* Per-room exhibit controls: the same .sec rows, marked as "this room's" with a
   muted mint so the shared renderer panel above reads as one block without a
   loud colour wash (the room's own content is the colour). */
#panel .exhibits .sec { border-top: 1px solid #33454f; }
#panel .exhibits .sec h3 { color: #93cfae; }
#panel .caption { margin: 2px 0 8px; color: var(--ink-dim); font-size: 12px; line-height: 1.55; }
#panel .caption b { color: var(--ink); font-weight: normal; }
/* phones: the fps badge must never outrun the viewport, and the hint bar sits
   where the tour chrome overlaps it, so it is dropped there */
@media (max-width: 420px) {
  #fps { max-width: calc(100vw - 28px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #hint { display: none; }
}
/* on phones the tour chrome (the RT switch and the prev/next bar) sits at the
   bottom centre, so an open panel must stop short of it instead of covering it */
@media (max-width: 700px) {
  #panel { max-height: calc(100vh - 200px); }
}
`;

export const ICON = {
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
  // a hamburger glyph — the panel is a control surface, so the fold reads as
  // "open the controls" rather than a status tag that happens to be clickable
  sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  // the section-header chevron, pointing down while the group is open (the
  // .collapsed rule rotates it 90 deg so it points right closed)
  chevD: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
  frame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
};

export function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

export function toggle(labelText, checked, onChange, tip) {
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
  if (tip) row.title = tip;
  return { row, input };
}

/**
 * A slider row plus the handles needed to drive it programmatically:
 * `set(v)` moves the knob and the readout WITHOUT firing onInput (the same rule
 * setFeatureState follows for toggles), so a governor-driven change shows up in
 * the control instead of leaving it lying about the renderer's state.
 */
export function sliderRow(labelText, min, max, step, value, fmt, onInput, tip) {
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
  if (tip) row.title = tip;
  return {
    row, input, val,
    set(v) {
      if (parseFloat(input.value) === v) return false;
      input.value = v;
      val.textContent = fmt(v);
      return true;
    },
  };
}

export function slider(...args) {
  return sliderRow(...args).row;
}

export function selectRow(labelText, options, value, onChange, tip) {
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
  if (tip) row.title = tip;
  return { row, select: sel };
}

// A collapsible section group. The h3 header is the click target; the chevron
// beside the title points down while the group is open, right while collapsed.
// Every group except Renderer starts collapsed so the panel reads as a short
// list of headers rather than one unbroken column.
//
// The groups are an accordion: opening one folds the others. With thirty-plus
// controls in the panel, letting every group open at once pushes the lower ones
// below the fold, and the panel's own scrollbar is easy to miss; one group at a
// time keeps every control on screen.
const allSections = [];
function colSection(iconHtml, title, collapsed = true) {
  const sec = el("div", "sec");
  sec.append(el("h3", null, `<span class="chev">${ICON.chevD}</span>${iconHtml} ${title}`));
  sec.classList.toggle("collapsed", collapsed);
  sec.querySelector("h3").addEventListener("click", () => {
    if (sec.classList.contains("collapsed")) {
      for (const other of allSections) {
        if (other !== sec) other.classList.add("collapsed");
      }
    }
    sec.classList.toggle("collapsed");
  });
  allSections.push(sec);
  return sec;
}

/** A per-room controls section, to be appended into the returned `exhibits`. */
export function section(iconHtml, title, open = false) {
  return colSection(iconHtml, title, !open);
}

/**
 * Build the shared panel.
 *
 * @param rt              the RealtimeRaytracer whose properties the rows drive
 * @param state           the render loop's shared state ({ rtEnabled, ... })
 * @param setFeature      host callback (name, on) for the feature toggles that
 *                        need the ROOM to react (reveal a piece, recompile).
 *                        Names: gi | emissive | reflections | refraction |
 *                        absorption | scattering.
 * @param setCanvasScale  host callback for the app-owned canvas buffer scale
 * @param canvasScale     its current value
 * @param initial         starting state of the scene-revealing toggles, so a
 *                        stop arrived at with settings carried over shows them:
 *                        { absorption, tintedShadows, scattering }
 * @param hint            bottom-left hint text (room-specific wording)
 *
 * @returns {{
 *   panel, exhibits, setStats, gateHooks, borrowRestir,
 *   setFeatureState, touched, onRtEnabled, setRtEnabled
 * }}
 *   `exhibits` is the container each room appends its own section()s into.
 *   `setFeatureState(name, on, { auto })` drives a feature row programmatically —
 *   with `auto: true` it is a NO-OP once the user has touched that row by hand.
 *   `touched` is the set of hand-touched feature names.
 */
export function buildPanel({
  rt,
  state,
  setFeature,
  setCanvasScale,
  canvasScale,
  initial = {},
  hint = "drag to orbit · scroll to zoom",
}) {
  document.head.append(el("style", null, CSS));

  const panel = el("div");
  panel.id = "panel";

  const hd = el("div", "hd", `${ICON.chip}<b>three-realtime-rt</b><span class="tag">RT on</span>`);
  // Collapse chevron: on phones the panel covers most of the scene, so it also
  // starts collapsed there (the header stays as the handle to reopen it).
  const fold = el("button", "fold", ICON.sliders);
  fold.title = "open / close the control panel";
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
  // Replaced further down, once the rows it mirrors exist (the fps loop starts
  // here so the badge is live during boot, before the panel is finished).
  let syncGovernorRows = () => {};
  (function fpsTick() {
    requestAnimationFrame(fpsTick);
    fpsFrames++;
    const now = performance.now();
    // The governor moves on its own schedule (a step every 2s at the fastest),
    // so the rows it owns are re-read here rather than being pushed from the
    // renderer. Comparing five numbers per frame costs nothing and no DOM is
    // touched unless a value actually moved.
    syncGovernorRows();
    if (now - fpsLast >= 500) {
      fps.textContent = `${((fpsFrames * 1000) / (now - fpsLast)).toFixed(0)} fps · ${diag}`;
      fpsFrames = 0;
      fpsLast = now;
    }
  })();

  // --- feature-row registry -------------------------------------------------
  // Every row that a ROOM might want to drive programmatically (the Cornell
  // box's exhibit switcher auto-enables the feature its exhibit demonstrates)
  // registers { input, apply } here. `touched` records the rows the USER has
  // flipped by hand — an auto-drive never overrides one of those, which is the
  // same "the user took the wheel" rule the ReSTIR lease already follows.
  const reg = {};
  const touched = new Set();
  const featureToggle = (name, labelText, checked, apply, tip) => {
    const t = toggle(labelText, checked, (v) => {
      touched.add(name);
      apply(v);
    }, tip);
    reg[name] = { input: t.input, apply };
    return t;
  };
  // Programmatic drive. Setting `.checked` does NOT fire a change event, so this
  // deliberately never marks the row as hand-touched.
  const setFeatureState = (name, on, { auto = false } = {}) => {
    const f = reg[name];
    if (!f) return false;
    if (auto && touched.has(name)) return false;
    if (f.input.disabled && on) return false;
    if (f.input.checked === on) return false; // already there — no redundant recompile
    f.input.checked = on;
    f.apply(on);
    return true;
  };

  // --- Renderer (core pipeline; watch the fps readout as you change these) ---
  // Starts collapsed so a landing visitor sees a short list of headers, not a
  // wall of sliders; every control is one click away. The room's own section
  // (the Cornell switcher) opens in its place.
  const rSec = colSection(ICON.layers, "Renderer", true);

  // The canvas scale is the APP's (it owns the drawing buffer and the CSS
  // stretch), and the governor drives it through rt.canvasScaleHook — so the
  // panel wraps that hook rather than guessing. Every governor canvas step now
  // lands in the "resolution" row as well as on the canvas.
  let canvasScaleNow = canvasScale;
  const hostHook = rt.canvasScaleHook;
  rt.canvasScaleHook = (s) => {
    canvasScaleNow = s;
    if (hostHook) hostHook(s);
  };
  // One place that flips auto quality, so the checkbox can never disagree with
  // rt.adaptiveQuality — the row below, the two resolution rows and "fast
  // lights" all go through it.
  const setAdaptive = (v) => {
    rt.adaptiveQuality = v;
    autoT.input.checked = v;
    syncGovernorRows(true);
  };
  // The prominent RT ON/OFF switch now lives in the tour chrome (tour.js), OUTSIDE
  // the panel — this row stays as its in-panel twin and the two are kept in sync
  // through setRtEnabled/onRtEnabled below.
  const rtRow = toggle("ray tracing", state.rtEnabled, (v) => setRtEnabled(v),
    "the raytraced pipeline — toggle off for plain rasterized three.js");
  rSec.append(rtRow.row);
  // --- auto quality, and the two rows it OWNS ------------------------------
  // The governor writes renderScale, the canvas scale, denoiseIterations,
  // stochasticLights and (when it spends its free wins) giHalfRate / restirGI
  // (the latter re-approved 2026-07-27 after the chroma-resolve fix).
  // Every one of those has a control here, so every one of them is kept in sync
  // below and badged "auto" while the governor holds the wheel. Touching one of
  // its rows by hand switches auto quality OFF, visibly — one obvious
  // interaction instead of a control that silently springs back.
  const autoT = toggle("auto quality", rt.adaptiveQuality, (v) => setAdaptive(v),
    "let the governor hold a frame-rate target by trading lighting res, canvas scale and denoise passes");
  rSec.append(autoT.row);
  const autoNote = el("div", "note");
  autoNote.textContent =
    "the AUTO rows are the governor's. It spends its free wins first (half-rate " +
    "GI, ReSTIR GI), then lighting res in 5% steps down to 20%, and only then " +
    "the canvas; it also sets denoise passes and fast lights. Changing any of " +
    "those by hand switches this off.";
  rSec.append(autoNote);
  const denoiseT = toggle("denoise", rt.denoise, (v) => (rt.denoise = v),
    "the à-trous denoiser — smooths the noisy pre-convergence frames");
  rSec.append(denoiseT.row);
  const taaT = toggle("TAA (anti-alias)", rt.taa, (v) => { rt.taa = v; rt.resetAccumulation(); },
    "temporal anti-aliasing — accumulates across frames to settle edges");
  rSec.append(taaT.row);
  // Include the mobile preset's scales — otherwise touching this dropdown on
  // a phone locks you out of the value the page started with. Manual choice
  // takes the wheel from the adaptive governor.
  // Whole-canvas buffer scale (the "browser zoom" trick as a control):
  // barely visible on dense screens, quadratic savings on EVERY pass.
  const canvasSel = selectRow("resolution", [["100%", 1], ["85%", 0.85], ["75%", 0.75], ["62%", 0.62], ["50%", 0.5]], canvasScale, (v) => {
    setAdaptive(false);
    canvasScaleNow = parseFloat(v);
    setCanvasScale(canvasScaleNow);
  }, "whole-canvas buffer scale — a browser-zoom-style lever with quadratic savings");
  const lightSel = selectRow("lighting res", [["100%", 1], ["75%", 0.75], ["50%", 0.5], ["37%", 0.375], ["25%", 0.25]], rt.renderScale, (v) => {
    setAdaptive(false);
    rt.renderScale = parseFloat(v);
  }, "the resolution the lighting passes trace at — the first lever the governor spends");
  const govBadge = (row, title) => {
    const b = el("span", "gov hide", "auto");
    b.title = title;
    row.insertBefore(b, row.lastChild);
    return b;
  };
  const canvasBadge = govBadge(canvasSel.row, "driven by auto quality — the governor's deepest lever, taken only after lighting res bottoms out at 20%");
  const lightBadge = govBadge(lightSel.row, "driven by auto quality — the first resolution the governor spends, in 5% steps down to 20%");
  rSec.append(canvasSel.row, lightSel.row);
  // Overscan: render past the canvas edges and crop back, so the leading-edge
  // disocclusion noise during camera motion is born off-screen. Costs pixels
  // (0.1 → 1.44×), so it lives next to the resolution controls.
  const overscanSel = selectRow("overscan", [["off", 0], ["5%", 0.05], ["10%", 0.1]], rt.overscan, (v) => {
    rt.overscan = parseFloat(v);
  }, "render past the canvas edge and crop back, so camera-motion noise is born off-screen");
  rSec.append(overscanSel.row);
  const viewSel = selectRow("view", [
    ["composite", 0], ["albedo", 1], ["normals", 2],
    ["irradiance", 3], ["world pos", 4], ["emissive", 5], ["specular", 6],
    ["bvh cost", 7],
  ], rt.outputMode, (v) => (rt.outputMode = parseInt(v, 10)),
    "debug views of the G-buffer and the lighting passes");
  rSec.append(viewSel.row);
  // BVH-cost heatmap scale: the slider is "visits to saturate" (hot/white end),
  // 32..512; rt.costScale is its reciprocal. Only affects the mode-7 view.
  const costS = sliderRow("cost scale", 32, 512, 16, Math.round(1 / rt.costScale),
    (x) => `${Number(x).toFixed(0)} hits`, (v) => (rt.costScale = 1 / v),
    "BVH traversal cost heatmap saturation, for the “bvh cost” view");
  rSec.append(costS.row);
  panel.append(rSec);

  // Rows in one section sometimes have to drive rows in another (a feature
  // toggle revealing the light that belongs to the piece it reveals). Sections
  // are built top-down, so the dependency is registered here and consumed by
  // whichever section is built later — every hook fires from a click, long
  // after buildPanel has finished. Rooms may register their own hooks too: the
  // museum's Lights section (examples/ui.js) hangs the Lumiere projector row
  // off `absorption`.
  const gateHooks = { absorption: [] };

  // ReSTIR is written from several places (its own checkbox, and the auto-off
  // that the coloured-shadow and scattering toggles share), so its full
  // semantics live in one function and the UI is always told what happened.
  // `restirSavedState` holds what to restore when the last borrower releases it;
  // null means nothing is being held.
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
  // Any room that needs the same favour (the Cornell box's exhibit switcher)
  // borrows through THIS lease as well; it is returned below for that reason.
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

  // --- Lighting & Atmosphere: the light sources and the air around them. ----
  const laSec = colSection(ICON.bulb, "Lighting & Atmosphere", true);
  // Routed through setFeature: emissive area lights reveal the room's second
  // light (in the Cornell box the emissive block, in the museum the fixtures).
  laSec.append(featureToggle("emissive", "emissive area lights", rt.emissiveNEE, (v) => setFeature("emissive", v)).row);
  // Turning ReSTIR OFF must drop us onto the per-light-rays baseline, NOT the
  // flat-cost stochastic "fast lights" path: otherwise both sides scale the
  // same with light count and ReSTIR's advantage never shows up in the fps.
  const restirT = featureToggle("restir", "ReSTIR lights", rt.restir, (v) => {
    // A manual flip is the user taking the wheel back: void the lease outright
    // so no borrower can ever overwrite this choice on its way out.
    restirSavedState = null;
    restirBorrowers.clear();
    applyRestir(v);
  });
  laSec.append(restirT.row);

  // --- the reservoir's own knobs, as sub-rows of the toggle they modify ------
  // All five arrived with the 0.15.0 Hangar port and four of them are ON by
  // default now, so the panel has to be able to turn each one OFF: that A/B is
  // the only way to see what it bought. Same "this modifies the row above"
  // grammar the GI modifiers use, dimmed while ReSTIR is off because every one
  // of them is inert without a reservoir.
  const restirSubs = [];
  const restirSub = (row) => {
    row.classList.add("sub");
    restirSubs.push(row);
    laSec.append(row);
    return row;
  };
  const dirBypassT = featureToggle("restirDirectionalBypass", "sun bypass", rt.restirDirectionalBypass,
    (v) => { rt.restirDirectionalBypass = v; rt.resetAccumulation(); },
    "keep DIRECTIONAL lights out of the reservoir and shade them exactly. The reservoir scores candidates UNSHADOWED, so it elects the sun everywhere and spends its one visibility ray on the wall between: interiors go black with bright specks. Costs one shadow ray per pixel.");
  restirSub(dirBypassT.row);
  const rescueT = featureToggle("restirReprojectionRescue", "reprojection rescue", rt.restirReprojectionRescue,
    (v) => { rt.restirReprojectionRescue = v; rt.resetAccumulation(); },
    "sub-texel correction plus a four-neighbour rescue when the reservoir's history fails its plane test. Without it, TAA jitter walks the sample across thin geometry and balusters/handrails/frames never accumulate any history at all.");
  restirSub(rescueT.row);
  const candT = featureToggle("restirCandidateImportance", "candidate importance", rt.restirCandidateImportance,
    (v) => { rt.restirCandidateImportance = v; rt.resetAccumulation(); },
    "draw reservoir candidates by POWER (pool split, then that pool's CDF) instead of uniformly over lights + emissive triangles. Uniform spends ~91% of its candidates on the emissive pool, which carries ~4% of the light. Measured free.");
  restirSub(candT.row);
  const gridT = featureToggle("restirLightGrid", "light grid", rt.restirLightGrid,
    (v) => { rt.restirLightGrid = v; rt.resetAccumulation(); },
    "draw the reservoir's LIGHT candidates from a per-cell grid over the scene instead of one global power CDF. With many lights a global CDF proposes lights behind walls: in a 96-light hotel corridor, about one candidate in thirty-two could reach the pixel at all. Two small GPU draws, rebuilt only when a light moves.");
  restirSub(gridT.row);
  const clampRelS = sliderRow("relative cap", 0, 4, 0.5, rt.restirClampRel, (x) => (Number(x) === 0 ? "off" : Number(x).toFixed(1)),
    (v) => { rt.restirClampRel = v; rt.resetAccumulation(); },
    "firefly cap on the ReSTIR direct term as a MULTIPLE of the pixel's own reservoir estimate of the light total (0 = the old absolute cap alone). One sample carries the whole sum, so an absolute cap clips the peaks and nothing lifts the zeros: bright surfaces converge dark.");
  restirSub(clampRelS.row);
  const warmS = sliderRow("warm age", 0, 64, 4, rt.restirWarmAge, (x) => (Number(x) === 0 ? "off" : Number(x).toFixed(0)),
    (v) => { rt.restirWarmAge = v; rt.resetAccumulation(); },
    "shade any pixel with fewer than N frames of validated reservoir history by the EXACT per-light loop instead. Removes reveal speckle outright and costs 5-6x a ReSTIR frame on those pixels; measured 2.2x whole-frame in motion, which is why it ships off.");
  restirSub(warmS.row);
  const samplesS = sliderRow("multi-sample", 1, 4, 1, rt.restirSamples, (x) => `${Number(x).toFixed(0)}x`,
    (v) => { rt.restirSamples = v; rt.resetAccumulation(); },
    "shade N reservoir winners per pixel (the pixel's own plus N-1 neighbours'), each with its own visibility ray, averaged. Sub-1/sqrt(N) because neighbouring reservoirs are correlated, and the shipped denoiser already removes most of what it buys.");
  restirSub(samplesS.row);
  const warmNote = el("div", "note");
  warmNote.textContent =
    "these six are the reservoir being RIGHT rather than fast: five are on by " +
    "default and cost either nothing or one ray. “warm age” is the exception, " +
    "off because it is 2.2x the frame in motion.";
  laSec.append(warmNote);

  // Grab the fast-lights toggle first so the ReSTIR handler can uncheck it.
  const fastLights = featureToggle("stochasticLights", "fast lights (1 ray)", rt.stochasticLights, (v) => { rt.stochasticLights = v; setAdaptive(false); rt.resetAccumulation(); });
  laSec.append(fastLights.row);
  // Ambient / hemisphere lights as an unoccluded flat term (0.15.0). It belongs
  // with the LIGHTS, not with ReSTIR: it is a light source the compiler used to
  // ignore outright, and it is what stops the default gi:false from rendering
  // every surface no light faces pure black.
  const ambientT = featureToggle("ambient", "ambient / hemisphere", rt.ambient,
    (v) => { rt.ambient = v; rt.resetAccumulation(); },
    "honour three's AmbientLight and HemisphereLight as an UNOCCLUDED flat term (no ray, no shadow). Not GI: nothing occludes it and nothing carries colour between surfaces.");
  laSec.append(ambientT.row);
  const volT = toggle("volumetric light", rt.volumetric.enabled, (v) => { rt.volumetric.enabled = v; rt.resetAccumulation(); });
  laSec.append(volT.row);
  const fogT = toggle("fog / haze", rt.fog.enabled, (v) => { rt.fog.enabled = v; rt.resetAccumulation(); });
  laSec.append(fogT.row);
  laSec.append(slider("density", 0.01, 0.12, 0.005, rt.fog.density, (x) => x.toFixed(2), (v) => (rt.fog.density = v)));
  panel.append(laSec);

  // --- Effects: additive shading results, each with a visible frame-time cost.
  // Tiered defaults leave the heavy ones off on phones; turning them on IS the
  // demo ("what does this cost on MY hardware?").
  const efSec = colSection(ICON.burst, "Effects", true);
  // Routed through setFeature: reflections/refraction also reveal a showcase
  // sphere and recompile the BVH, which the room owns. Initial state reads the
  // current rt values (all false at the museum's minimal start).
  efSec.append(featureToggle("specular", "PBR specular", rt.specular, (v) => { rt.specular = v; rt.resetAccumulation(); },
    "the GGX specular term on the traced paths").row);
  efSec.append(featureToggle("gi", "global illumination", rt.gi, (v) => setFeature("gi", v),
    "one-bounce colour bleed — light bounces once and carries surface colour").row);
  // Both of the GI modifiers are no-ops without GI itself, so they are drawn as
  // sub-rows of it and dimmed while it is off (the same "this modifies the row
  // above" grammar as tinted shadows). Both are also FREE WINS the governor
  // spends before it gives up any resolution, which is why their state moves on
  // its own while auto quality is on; see syncGovernorRows.
  const halfRateT = featureToggle("giHalfRate", "half-rate GI (fast)", rt.giHalfRate, (v) => { rt.giHalfRate = v; rt.resetAccumulation(); },
    "update the GI sample on alternate frames — roughly half the GI cost");
  halfRateT.row.classList.add("sub");
  efSec.append(halfRateT.row);
  // Experimental: reservoir reuse of the 1-bounce GI sample (temporal-only).
  // Only meaningful when global illumination is on; injected at the denoise stage.
  const restirGiT = featureToggle("restirGI", "ReSTIR GI (exp)", rt.restirGI, (v) => { rt.restirGI = v; rt.resetAccumulation(); },
    "reuse the 1-bounce GI sample across frames via reservoir resampling (experimental)");
  restirGiT.row.classList.add("sub");
  efSec.append(restirGiT.row);
  // Two conditions this row cannot satisfy on its own, both of which otherwise
  // look like "the toggle does nothing":
  //  - it is resolved AT the à-trous stage, so with GI or the denoiser off the
  //    renderer skips the pass entirely (it warns once in the console; say it here)
  //  - past 3 denoise passes the wide taps smear its coarse structure: the
  //    campaign's own replacement ladder never ran it past 3, and the governor
  //    now caps itself there.
  const restirGiNote = el("div", "note");
  efSec.append(restirGiNote);
  efSec.append(featureToggle("reflections", "reflections", rt.reflections, (v) => setFeature("reflections", v),
    "traced specular reflections — a real ray per pixel, not an environment map").row);
  // Grab the refraction toggle so the tinted-glass handler can switch it on.
  const refractionT = featureToggle("refraction", "refraction", rt.refraction, (v) => setFeature("refraction", v),
    "traced glass paths — light bends through transmissive materials");
  efSec.append(refractionT.row);
  // Tinted glass (Beer-Lambert absorption): reveals the room's absorbing piece
  // (in the museum the Sunset relief and the Lumiere screen, in the Cornell box
  // the leaning glass panes) and recompiles with per-material absorption; OFF
  // strips back to the byte-identical no-absorption program, so flipping this
  // while watching the fps readout IS the feature's cost measurement. The effect
  // only exists on refracted paths, so turning it on brings refraction with it
  // (same pattern as ReSTIR unchecking fast lights below).
  // Coloured shadows, the shadow-ray half of the same feature: a shadow ray
  // crossing absorbing glass is attenuated per channel instead of blocked, so
  // the projector's beam lands on the floor as a nine-tile light quilt instead
  // of one flat dark rectangle. Declared before "tinted glass" so that toggle
  // can enable it (it is a no-op with no absorbing material in the scene),
  // appended after it as an indented sub-row.
  const applyTintedShadows = (v) => {
    rt.absorptionShadows = v;
    // THE COUPLING. With ReSTIR lights on, primary direct light is shaded from
    // the reservoir's winner by ONE BINARY visibility ray: so the per-channel
    // transmittance march never runs on a primary surface and this toggle would
    // appear to do NOTHING on the floor. Rather than explain that in a footnote
    // and let the user conclude the feature is broken, switch ReSTIR off for
    // them, visibly: the checkbox below unchecks itself and the note says why.
    // The previous state is restored when this goes back off (see borrowRestir).
    borrowRestir("tintedShadows", v);
    rt.resetAccumulation();
  };
  const tintedShadows = featureToggle("tintedShadows", "tinted shadows", rt.absorptionShadows, applyTintedShadows);
  tintedShadows.row.classList.add("sub", "dim");
  tintedShadows.input.disabled = true; // meaningless until something absorbs
  const tintedNote = el("div", "note");
  tintedNote.textContent =
    "acts on the direct + emissive shadow rays, so it needs them: ReSTIR shades " +
    "primary direct light with one BINARY visibility ray, and turning this on " +
    "unchecks “ReSTIR lights” (and “fast lights” with it) so the tint actually " +
    "reaches the floor. Turning it off puts both back.";
  const tintedGlass = featureToggle("absorption", "tinted glass", !!initial.absorption, (v) => {
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
    // Reveal / retire the room's gated light row (museum: the Lumiere projector).
    for (const hook of gateHooks.absorption || []) hook(v);
  });
  efSec.append(tintedGlass.row);
  efSec.append(tintedShadows.row);
  tintedNote.style.display = "none"; // revealed with the piece
  efSec.append(tintedNote);
  // Chromatic dispersion on the refracted term: the diamond-ior glass sphere on
  // the materials bench splits white light into a rainbow. Default 0 (off): the
  // stochastic spectral sampling estimates one colour channel per glass pixel
  // per frame, which triples the transmitted term's variance and adds visible
  // grain on the sphere at the demo's reduced render scale before it fully
  // converges. Drag it up to see the effect; it shimmers slightly while
  // converging, so reset the accumulator on each change.
  const dispS = sliderRow("dispersion", 0, 0.3, 0.01, rt.dispersion, (x) => Number(x).toFixed(2), (v) => { rt.dispersion = v; rt.resetAccumulation(); },
    "chromatic dispersion on the refracted term — the amount white light splits into colour");
  efSec.append(dispS.row);
  // Kubelka-Munk scattering: reveals the room's scattering piece (in the museum
  // "Alabaster" (the reading lamp plus the two spheres that differ ONLY in
  // whether they scatter), in the Cornell box the stepped stone wedge). Absorption
  // alone can only remove light, so without this a pigmented translucent body
  // stays dark murk. Off strips back to the byte-identical no-scattering program,
  // so flipping this while watching the fps readout IS the feature's cost
  // measurement. Brings refraction with it (same pattern as "tinted glass")
  // because the absorption-only control needs the glass path to render as glass
  // at all.
  const kmNote = el("div", "note");
  kmNote.textContent =
    "the lamp's light REACHES the table through its shade, which is a shadow-ray " +
    "effect: so this unchecks “ReSTIR lights” (and “fast lights” with it) for the " +
    "same reason “tinted shadows” does, and puts both back when it goes off. The " +
    "shade's own outward glow needs neither.";
  efSec.append(featureToggle("scattering", "scattering (Kubelka-Munk)", !!initial.scattering, (v) => {
    if (v && !rt.refraction) {
      refractionT.input.checked = true;
      setFeature("refraction", true);
    }
    setFeature("scattering", v);
    kmNote.style.display = v ? "" : "none";
    borrowRestir("kmScattering", v);
  }, "Kubelka-Munk subsurface scattering — light returns from inside a pigmented body").row);
  efSec.append(kmNote);
  kmNote.style.display = "none"; // revealed with the piece
  panel.append(efSec);

  // --- Quality & Performance: the converger's dials. -------------------------
  const qpSec = colSection(ICON.chip, "Quality & Performance", true);
  const fireflyS = sliderRow("firefly clamp", 1, 8, 0.5, rt.fireflyClamp, (x) => Number(x).toFixed(1), (v) => (rt.fireflyClamp = v),
    "clamp the bright speckle outliers that sparse sampling leaves behind");
  qpSec.append(fireflyS.row);
  const historyS = sliderRow("history length", 8, 128, 8, rt.maxHistory, (x) => Number(x).toFixed(0), (v) => (rt.maxHistory = v),
    "how many frames of temporal history the converger keeps");
  qpSec.append(historyS.row);
  // Keeps its full 0..5 range: the campaign's finding is about what the
  // GOVERNOR should choose, not about what you may look at. 4 and 5 are where
  // the à-trous lattice is measurable, so they stay reachable by hand.
  const denoisePasses = sliderRow("denoise passes", 0, 5, 1, rt.denoiseIterations, (x) => Number(x).toFixed(0), (v) => {
    rt.denoiseIterations = v;
    setAdaptive(false); // the governor writes this row too; dragging it takes the wheel
  }, "how many à-trous filter passes the denoiser runs");
  qpSec.append(denoisePasses.row);
  // Motion vectors (0.15.0, on by default). NOT a ReSTIR knob — the G-buffer's
  // fifth attachment feeds three temporal stages (the irradiance EMA and the
  // reservoir consume it; TAA measured worse on it and deliberately does not),
  // so it sits with the other temporal dials. Inert on a device without 5 draw
  // buffers, and the row says so rather than lying about what is running.
  const motionT = toggle("motion vectors", rt.motionVectors, (v) => { rt.motionVectors = v; rt.resetAccumulation(); },
    "reproject temporal history through each fragment's PREVIOUS screen position instead of through the camera alone. Camera-only reprojection is simply wrong for a moving mesh; a static scene renders identically either way.");
  if (!rt.motionVectorsSupported) {
    motionT.input.disabled = true;
    motionT.row.classList.add("dim");
    motionT.row.title = "this GPU exposes fewer than 5 draw buffers, so the motion-vector attachment cannot be allocated; every stage stays on camera-only reprojection";
  }
  qpSec.append(motionT.row);
  panel.append(qpSec);

  // --- per-room exhibit controls go here, below the shared panel -------------
  const exhibits = el("div", "exhibits");
  panel.append(exhibits);

  // --- Reset to defaults ----------------------------------------------------
  // The owner's rule: "we need a button to reset settings to the default, which
  // should default to most things off."
  //
  // The defaults come from RealtimeRaytracer.DEFAULTS, not from a list written
  // out here: a demo that restates the library's opinions is a demo whose reset
  // button drifts. Every row this panel owns is driven back through the SAME
  // handler a click would use (reg[name].apply for the scene-revealing features,
  // so the room actually reveals/hides its pieces and recompiles), then the
  // controls are re-read from the renderer, so nothing can be left showing a
  // value the renderer is not using.
  //
  // It also clears the tour's sessionStorage snapshot. Without that, "reset"
  // would last exactly until you walked to the next stop and the carried
  // settings came back — which is the sort of thing that makes a reset button
  // untrustworthy.
  const resetBar = el("div", "reset-bar");
  const resetBtn = el("button", null, `${ICON.reset}<span>Reset to defaults</span>`);
  const resetToDefaults = () => {
    const D = RealtimeRaytracer.DEFAULTS;

    // 1. The scene-revealing features go through their own handlers, because a
    //    room owns what they reveal and whether they recompile.
    for (const [name, want] of [
      ["gi", D.gi],
      ["emissive", D.emissiveNEE],
      ["reflections", D.reflections],
      ["refraction", D.refraction],
      ["absorption", false],
      ["scattering", false],
    ]) {
      const f = reg[name];
      if (!f) continue;
      if (f.input.checked !== want) {
        f.input.checked = want;
        f.apply(want);
      }
      touched.delete(name);
    }
    // Tinted shadows is a sub-row of absorption and is disabled without it, so
    // it is put back by hand (its handler also hands the ReSTIR lease back).
    if (tintedShadows.input.checked) {
      tintedShadows.input.checked = false;
      applyTintedShadows(false);
    }

    // 2. Plain live properties. The ReSTIR lease is voided first: a borrower
    //    holding a saved state would otherwise restore it over the reset on its
    //    way out.
    restirSavedState = null;
    restirBorrowers.clear();
    applyRestir(D.restir);
    for (const k of [
      "renderScale", "overscan", "denoise", "denoiseIterations", "taa",
      "ambient", "giHalfRate", "restirGI", "specular", "dispersion",
      "stochasticLights", "restirWarmAge", "restirDirectionalBypass",
      "restirReprojectionRescue", "restirCandidateImportance", "restirLightGrid",
      "restirClampRel",
      "restirSamples", "motionVectors", "maxHistory", "fireflyClamp",
      "outputMode", "costScale", "targetFps",
    ]) {
      if (rt[k] !== D[k]) rt[k] = D[k];
    }
    rt.volumetric.enabled = D.volumetric.enabled;
    // Fog is scene dressing rather than a library default (the constructor's is
    // simply "off"), and the demo's own start is off, so reset means off.
    rt.fog.enabled = false;
    // adaptiveQuality LAST: several rows above call setAdaptive(false) as a
    // side effect of being written, so setting it first would be undone.
    setAdaptive(D.adaptiveQuality);
    // The canvas is the app's, not the renderer's; full size is its default.
    canvasScaleNow = 1;
    setCanvasScale(1);

    // 3. Any persisted state. Today only the tour writes one.
    try { sessionStorage.removeItem("rtTourSettings"); } catch { /* storage off */ }

    // 4. Re-read every control from the renderer, including the rows the
    //    governor owns, and start the image again.
    for (const [t, v] of [
      [ambientT, rt.ambient], [dirBypassT, rt.restirDirectionalBypass],
      [rescueT, rt.restirReprojectionRescue], [candT, rt.restirCandidateImportance],
      [gridT, rt.restirLightGrid],
      [motionT, rt.motionVectors], [restirGiT, rt.restirGI], [halfRateT, rt.giHalfRate],
      [denoiseT, rt.denoise], [taaT, rt.taa], [volT, rt.volumetric.enabled],
      [fogT, rt.fog.enabled],
    ]) t.input.checked = v;
    clampRelS.set(rt.restirClampRel);
    warmS.set(rt.restirWarmAge);
    samplesS.set(rt.restirSamples);
    dispS.set(rt.dispersion);
    fireflyS.set(rt.fireflyClamp);
    historyS.set(rt.maxHistory);
    costS.set(Math.round(1 / rt.costScale));
    overscanSel.select.value = String(rt.overscan);
    viewSel.select.value = String(rt.outputMode);
    syncGovernorRows(true);
    rt.resetAccumulation();
  };
  resetBtn.addEventListener("click", resetToDefaults);
  resetBar.append(resetBtn);
  const resetNote = el("div", "note");
  resetNote.textContent =
    "the library's own constructor defaults: the correctness fixes on, the " +
    "expensive paths (GI, volumetric, warm age) off, full canvas, auto quality on.";
  resetBar.append(resetNote);
  panel.append(resetBar);

  // Pinned footer: the fps readout and the links live in one sticky bar at the
  // panel's bottom edge, so they stay in view however many groups are open.
  const statsFoot = el("div", "stats-foot");
  const stats = el("div", "stats");
  statsFoot.append(stats);
  const links = el("div", "stats links");
  links.innerHTML =
    `<a href="./costs.html" title="what every feature above costs, per scene, measured">Feature costs</a>` +
    ` &middot; <a href="https://github.com/GoldwinXS/three-realtime-rt" target="_blank" rel="noopener">GitHub (MIT)</a>` +
    ` &middot; <a href="https://goldwinxs.itch.io/three-realtime-rt-supporter-pack" target="_blank" rel="noopener">Supporter pack</a>`;
  statsFoot.append(links);
  panel.append(statsFoot);

  // Scroll-fade cue, drawn just above the pinned footer (its bottom edge is the
  // footer's height, measured live so wrapping links on narrow screens are fine).
  const scrollFade = el("div", "panel-fade");
  panel.append(scrollFade);
  const updateFade = () => {
    scrollFade.style.bottom = `${statsFoot.offsetHeight}px`;
    const overflow = panel.scrollHeight - panel.clientHeight > 1;
    const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
    scrollFade.classList.toggle("show", overflow && !atBottom);
  };
  panel.addEventListener("scroll", updateFade, { passive: true });
  // Opening or closing a group changes the overflow without a scroll event, so
  // re-evaluate on any class change inside the panel (section toggles, badges).
  new MutationObserver(updateFade).observe(panel, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
  addEventListener("resize", updateFade);
  updateFade();

  document.body.append(panel);

  const hintEl = el("div");
  hintEl.id = "hint";
  hintEl.textContent = hint;
  // The persistent room hint is dropped in the glow-up — the boot hero and the
  // transient orbit cue carry the instructions — so it is hidden unless a room
  // has something genuinely worth saying (the Cornell box's RT-off warning).
  if (!hint) hintEl.style.display = "none";
  document.body.append(hintEl);

  // --- what the governor owns, mirrored back into the controls --------------
  // The rule this implements: a control may never show something the renderer
  // is not doing. Six properties can move without a click — renderScale, the
  // canvas scale, denoiseIterations, stochasticLights, and the two free wins
  // (giHalfRate, restirGI) — so all six are re-read every frame and written
  // back into their row when they differ. `pct` inserts an off-ladder value
  // (the governor steps renderScale by 0.05, the dropdown lists five stops) as
  // a transient option so the row can always show the truth.
  const pct = (v) => `${Math.round(v * 100)}%`;
  const showValue = (sel, value) => {
    const same = (o) => Math.abs(parseFloat(o.value) - value) < 1e-6;
    let opt = [...sel.options].find(same);
    if (!opt) {
      opt = el("option", "gov-val", pct(value));
      opt.value = String(value);
      const after = [...sel.options].find((o) => parseFloat(o.value) < value);
      sel.insertBefore(opt, after || null);
    }
    if (sel.value !== opt.value) sel.value = opt.value;
    for (const o of [...sel.options]) {
      if (o.classList.contains("gov-val") && o !== opt) o.remove();
    }
  };
  let lastGov = {};
  syncGovernorRows = (force) => {
    const now = {
      auto: !!rt.adaptiveQuality,
      light: rt.renderScale,
      canvas: canvasScaleNow,
      passes: rt.denoiseIterations,
      fast: !!rt.stochasticLights,
      half: !!rt.giHalfRate,
      rgi: !!rt.restirGI,
      gi: !!rt.gi,
      denoise: !!rt.denoise,
    };
    let changed = force === true;
    for (const k of Object.keys(now)) if (now[k] !== lastGov[k]) changed = true;
    if (!changed) return;
    lastGov = now;
    showValue(lightSel.select, now.light);
    showValue(canvasSel.select, now.canvas);
    denoisePasses.set(now.passes);
    fastLights.input.checked = now.fast;
    halfRateT.input.checked = now.half;
    restirGiT.input.checked = now.rgi;
    canvasBadge.classList.toggle("hide", !now.auto);
    lightBadge.classList.toggle("hide", !now.auto);
    autoNote.style.display = now.auto ? "" : "none";
    // The GI modifiers are inert without GI (and ReSTIR GI also without the
    // denoiser); dim them and say which condition is missing.
    halfRateT.row.classList.toggle("dim", !now.gi);
    restirGiT.row.classList.toggle("dim", !now.gi || !now.denoise || now.passes < 1);
    const why = !now.rgi
      ? ""
      : !now.gi
        ? "ReSTIR GI needs global illumination on — the pass is skipped without it."
        : !now.denoise || now.passes < 1
          ? "ReSTIR GI is resolved at the denoise stage: with the denoiser off (or 0 passes) it contributes nothing."
          : now.passes > 3
            // The old wording blamed ReSTIR GI here. That was the coloured-
            // resolve artifact, which is fixed at the source (restirGIChromaMean)
            // — measured, the on/off gap now closes at 1 and 3 passes alike. What
            // is left at 4+ is the DENOISER'S OWN lattice, which the campaign
            // measured with ReSTIR GI off too, and which is why the governor caps
            // itself at 3.
            ? `${now.passes} denoise passes: the widest à-trous taps raise the filter's own lattice. 3 or fewer is the measured range, with or without ReSTIR GI.`
            : "";
    restirGiNote.textContent = why;
    restirGiNote.style.display = why ? "" : "none";
  };
  syncGovernorRows(true);

  // --- ray tracing on/off: one source of truth, two controls ----------------
  const rtListeners = [];
  function setRtEnabled(v) {
    state.rtEnabled = v;
    rtRow.input.checked = v;
    hd.querySelector(".tag").textContent = v ? "RT on" : "RT off";
    for (const fn of rtListeners) fn(v);
  }
  setRtEnabled(state.rtEnabled);

  // Carried-over scene-revealing features are applied HERE rather than by the
  // room, so they go through the very same handlers a click would (including the
  // ReSTIR lease and the refraction coupling).
  if (initial.absorption) reg.absorption.apply(true);
  if (initial.absorption && initial.tintedShadows) {
    tintedShadows.input.checked = true;
    applyTintedShadows(true);
  }
  if (initial.scattering) reg.scattering.apply(true);

  return {
    panel,
    exhibits,
    gateHooks,
    borrowRestir,
    setFeatureState,
    /** Re-apply RealtimeRaytracer.DEFAULTS to every row this panel owns. */
    resetToDefaults,
    /** Current checked state of a registered feature row. */
    isOn: (name) => !!(reg[name] && reg[name].input.checked),
    touched,
    setRtEnabled,
    isRtEnabled: () => !!state.rtEnabled,
    onRtEnabled: (fn) => rtListeners.push(fn),
    setHint(text) {
      hintEl.textContent = text;
      hintEl.style.display = text ? "" : "none";
    },
    setStats(html) {
      stats.innerHTML = html;
    },
  };
}
