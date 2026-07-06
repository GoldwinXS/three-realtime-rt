// Control panel for the showcase. Pure DOM + injected CSS (no framework), SVG
// icons only. Mutates the raytracer / physics / scene directly and flips fields
// on the shared `state` object that the render loop reads.

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
#hint { position: fixed; bottom: 12px; left: 14px; z-index: 20; color: #6b7f8c;
  font: 11px ui-monospace, Consolas, monospace; background: rgba(14,18,24,0.7);
  border: 1px solid #26323c; border-radius: 6px; padding: 6px 10px; }
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

function lightRow(name, light, hasColor, rt, scene) {
  const row = el("div", "row");
  const lab = el("label", null, name);
  const sw = el("label", "sw");
  const input = el("input");
  input.type = "checkbox";
  input.checked = light.visible && light.intensity > 0;
  input.addEventListener("change", () => {
    light.visible = input.checked;
    rt.updateLights(scene);
    rt.resetAccumulation();
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
  return row;
}

export function buildUI({ rt, physics, lights, scene, state, refreshLights }) {
  document.head.append(el("style", null, CSS));

  const panel = el("div");
  panel.id = "panel";

  panel.append(
    el("div", "hd", `${ICON.chip}<b>three-realtime-rt</b><span class="tag">RT on</span>`)
  );

  // --- Renderer ---
  const rSec = el("div", "sec");
  rSec.append(el("h3", null, `${ICON.layers} Renderer`));
  rSec.append(toggle("ray tracing", state.rtEnabled, (v) => (state.rtEnabled = v)).row);
  rSec.append(toggle("global illumination", rt.gi, (v) => { rt.gi = v; rt.resetAccumulation(); }).row);
  rSec.append(toggle("denoise", rt.denoise, (v) => (rt.denoise = v)).row);
  rSec.append(toggle("TAA (anti-alias)", rt.taa, (v) => { rt.taa = v; rt.resetAccumulation(); }).row);
  rSec.append(
    selectRow("lighting res", [["100%", 1], ["75%", 0.75], ["50%", 0.5]], rt.renderScale, (v) => {
      rt.renderScale = parseFloat(v);
    })
  );
  rSec.append(
    selectRow("view", [
      ["composite", 0], ["albedo", 1], ["normals", 2],
      ["irradiance", 3], ["world pos", 4], ["emissive", 5],
    ], rt.outputMode, (v) => (rt.outputMode = parseInt(v, 10)))
  );
  panel.append(rSec);

  // --- Lights ---
  const lSec = el("div", "sec");
  lSec.append(el("h3", null, `${ICON.bulb} Lights`));
  for (const { label, light, color } of lights) {
    lSec.append(lightRow(label, light, color, rt, scene));
  }
  panel.append(lSec);

  // --- Atmosphere ---
  const aSec = el("div", "sec");
  aSec.append(el("h3", null, `${ICON.fog} Atmosphere`));
  aSec.append(toggle("fog / haze", rt.fog.enabled, (v) => { rt.fog.enabled = v; rt.resetAccumulation(); }).row);
  aSec.append(slider("density", 0.01, 0.12, 0.005, rt.fog.density, (x) => x.toFixed(2), (v) => (rt.fog.density = v)));
  panel.append(aSec);

  // --- Physics ---
  const pSec = el("div", "sec");
  pSec.append(el("h3", null, `${ICON.cube} Physics`));
  pSec.append(toggle("simulate", !state.physicsPaused, (v) => (state.physicsPaused = !v)).row);
  pSec.append(slider("gravity", 0, 20, 0.5, 9.81, (x) => "-" + x.toFixed(0), (v) => physics.setGravity(-v)));
  const btns = el("div", "btns");
  const mkBtn = (icon, text, wide, fn) => {
    const b = el("button", wide ? "wide" : null, `${icon}<span>${text}</span>`);
    b.addEventListener("click", fn);
    return b;
  };
  btns.append(
    mkBtn(ICON.down, "Drop", false, () => physics.dropWave()),
    mkBtn(ICON.burst, "Explode", false, () => physics.explode()),
    mkBtn(ICON.reset, "Reset pile", true, () => physics.reset())
  );
  pSec.append(btns);
  panel.append(pSec);

  const stats = el("div", "stats");
  panel.append(stats);

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
