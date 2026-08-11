// The guided-tour shell: the chrome every stop wears, and the settings that
// travel between them.
//
// The demo is three rooms visited in order — a Cornell box (index.html), the
// museum (museum.html) and the model scenes (models.html) — each its own page so
// a stop is a plain deep link and a room's code never has to be torn down.
// What this module owns is the part that must look and behave identically on all
// three: the PREV / NEXT navigation, the big RT ON/OFF switch (the one-click
// raster-vs-RT comparison is the whole pitch, so it sits OUTSIDE the panel), and
// the sessionStorage hop that carries the renderer settings from one stop to the
// next.
//
// SVG icons only, no emojis.

export const STOPS = [
  {
    id: "cornell",
    href: "./index.html",
    title: "Cornell box",
    blurb: "the reference room, one feature at a time",
  },
  {
    id: "museum",
    href: "./museum.html",
    title: "Museum",
    blurb: "every feature at once, in one lit room",
  },
  {
    id: "models",
    href: "./models.html",
    title: "Model scenes",
    blurb: "stock glTF, untouched, ray traced",
  },
];

const NAV_ICON = {
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 5l7 7-7 7"/></svg>',
  // A ray bouncing off a surface — the RT switch's mark.
  ray: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l8 9 8-6"/><path d="M2 20h20"/><circle cx="11" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>',
  // A bar chart — the cost report's mark.
  bars: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
};

const CSS = `
#tour { position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%);
  z-index: 25; display: flex; flex-direction: column; align-items: center; gap: 9px;
  font: 12px/1.4 ui-monospace, "SF Mono", Consolas, monospace; color: #d7e0e6;
  pointer-events: none; }
#tour > * { pointer-events: auto; }
/* the sales pitch, one click, never inside the panel */
#tour .rtsw { display: flex; align-items: center; gap: 9px; cursor: pointer;
  padding: 9px 18px; border-radius: 999px; letter-spacing: 1.2px; font-size: 12px;
  font-weight: 600; text-transform: uppercase; border: 1px solid #2f414d;
  background: rgba(14,18,24,0.86); color: #8298a6; backdrop-filter: blur(10px);
  box-shadow: 0 6px 22px rgba(0,0,0,0.45); transition: all .14s; user-select: none; }
#tour .rtsw svg { width: 16px; height: 16px; }
#tour .rtsw .dot { width: 8px; height: 8px; border-radius: 50%; background: #4a5b67; transition: all .14s; }
#tour .rtsw.on { color: #0c1116; background: #38d0e0; border-color: #7fe6f2;
  box-shadow: 0 6px 26px rgba(56,208,224,0.35); }
#tour .rtsw.on .dot { background: #0c1116; }
#tour .rtsw:hover { border-color: #38d0e0; }
#tour .rtsw.on:hover { background: #55dceb; }
/* prev / stop / next */
#tour .nav { display: flex; align-items: stretch; gap: 1px; border-radius: 9px;
  overflow: hidden; border: 1px solid #26323c; background: rgba(14,18,24,0.86);
  backdrop-filter: blur(10px); box-shadow: 0 6px 22px rgba(0,0,0,0.45); }
#tour .nav a, #tour .nav span.stop { display: flex; align-items: center; gap: 7px;
  padding: 8px 13px; color: #d7e0e6; text-decoration: none; transition: background .12s; }
#tour .nav a:hover { background: #1e2d38; color: #fff; }
#tour .nav a.off { color: #465662; pointer-events: none; }
#tour .nav a svg { width: 14px; height: 14px; }
#tour .nav .stop { flex-direction: column; align-items: center; gap: 2px;
  border-left: 1px solid #26323c; border-right: 1px solid #26323c; min-width: 190px; }
#tour .nav .stop b { color: #7ee787; font-weight: 600; letter-spacing: .4px; }
#tour .nav .stop i { font-style: normal; color: #6b7f8c; font-size: 10px; }
#tour .dots { display: flex; align-items: center; gap: 6px; }
#tour .dots a { width: 7px; height: 7px; border-radius: 50%; background: #2f414d; transition: background .12s; }
#tour .dots a:hover { background: #4d6472; }
#tour .dots a.cur { background: #7ee787; }
/* the cost report — every feature in the panel has a measured price, and this
   is where it is written down. Sits with the dots, not in the prev/next nav:
   it is a side door out of the tour, not a fourth stop. */
#tour .dots a.costs { width: auto; height: auto; border-radius: 5px; background: none;
  color: #6b7f8c; font-size: 10px; letter-spacing: .4px; text-decoration: none;
  padding: 2px 7px; border: 1px solid #26323c; margin-left: 6px;
  display: flex; align-items: center; gap: 5px; }
#tour .dots a.costs svg { width: 11px; height: 11px; }
#tour .dots a.costs:hover { color: #7ee787; border-color: #3d5260; background: rgba(14,18,24,0.86); }
@media (max-width: 700px) {
  #tour { bottom: 8px; gap: 6px; }
  #tour .nav .stop { min-width: 120px; }
  #tour .nav a, #tour .nav span.stop { padding: 7px 9px; }
  #tour .rtsw { padding: 7px 13px; font-size: 11px; }
  #tour .dots a.costs { font-size: 9px; padding: 1px 6px; }
}
`;

/**
 * Build the persistent tour chrome for `stopId`.
 *
 * `panel` is the object buildPanel() returned; the switch and the panel's
 * "ray tracing" row are two faces of the same state, so this drives the panel
 * and subscribes to it rather than keeping a copy.
 */
export function buildTourChrome({ stopId, panel }) {
  document.head.append(Object.assign(document.createElement("style"), { textContent: CSS }));
  const i = Math.max(0, STOPS.findIndex((s) => s.id === stopId));
  const stop = STOPS[i];
  const prev = STOPS[i - 1];
  const next = STOPS[i + 1];

  const root = document.createElement("div");
  root.id = "tour";

  const sw = document.createElement("button");
  sw.className = "rtsw";
  sw.type = "button";
  sw.innerHTML = `${NAV_ICON.ray}<span class="lbl">ray tracing</span><span class="dot"></span>`;
  const lbl = sw.querySelector(".lbl");
  const paint = (on) => {
    sw.classList.toggle("on", on);
    lbl.textContent = on ? "ray tracing: on" : "ray tracing: off";
    sw.title = on
      ? "ray traced lighting — click for plain rasterized three.js"
      : "plain rasterized three.js (shadow maps + ACES) — click for ray tracing";
  };
  sw.addEventListener("click", () => panel.setRtEnabled(!sw.classList.contains("on")));
  panel.onRtEnabled(paint);
  // The panel published its opening state before this listener existed, so take
  // the current value once rather than waiting for the first flip.
  paint(panel.isRtEnabled());
  root.append(sw);

  const nav = document.createElement("div");
  nav.className = "nav";
  const link = (dir, target) => {
    const a = document.createElement("a");
    a.className = target ? "" : "off";
    a.href = target ? target.href : "#";
    a.innerHTML =
      dir === "prev"
        ? `${NAV_ICON.prev}<span>prev</span>`
        : `<span>next</span>${NAV_ICON.next}`;
    a.title = target ? `${dir}: ${target.title}` : `no ${dir} stop`;
    return a;
  };
  const label = document.createElement("span");
  label.className = "stop";
  label.innerHTML = `<b>${i + 1}/${STOPS.length} · ${stop.title}</b><i>${stop.blurb}</i>`;
  nav.append(link("prev", prev), label, link("next", next));
  root.append(nav);

  const dots = document.createElement("div");
  dots.className = "dots";
  for (const s of STOPS) {
    const d = document.createElement("a");
    d.href = s.href;
    d.title = s.title;
    if (s.id === stopId) d.classList.add("cur");
    dots.append(d);
  }
  const costs = document.createElement("a");
  costs.className = "costs";
  costs.href = "./costs.html";
  costs.innerHTML = `${NAV_ICON.bars}<span>feature costs</span>`;
  costs.title = "what each feature costs, in ms and fps, measured per scene";
  dots.append(costs);
  root.append(dots);

  document.body.append(root);
  return { root, stop };
}

// --- settings that travel with you ------------------------------------------
// sessionStorage, not localStorage: a tour is one visit. A fresh tab therefore
// boots every stop at ITS OWN documented defaults (which is what the render
// self-test and every published fps number depend on), and only walking the tour
// carries state along.

const KEY = "rtTourSettings";

// Plain renderer properties: copied straight onto `rt` before the panel is
// built, so the panel's rows come up showing them.
const FLAGS = [
  "denoise", "denoiseIterations", "taa", "adaptiveQuality", "renderScale", "overscan",
  "specular", "gi", "giHalfRate", "restirGI", "emissiveNEE", "reflections", "refraction",
  "restir", "stochasticLights", "dispersion", "fireflyClamp", "maxHistory", "outputMode",
  "costScale",
];

/** Snapshot the renderer settings for the next stop. */
export function saveTourSettings({ rt, state, canvasScale, panel }) {
  if (!rt) return;
  try {
    const out = { canvasScale, rtEnabled: !!state.rtEnabled };
    for (const k of FLAGS) out[k] = rt[k];
    out.fog = { enabled: rt.fog.enabled, density: rt.fog.density };
    out.volumetric = { enabled: rt.volumetric.enabled };
    // The scene-revealing features are stored as INTENT, not as rt flags: each
    // room reveals its own piece for them, so they are replayed through the next
    // panel's own toggle handlers (buildPanel's `initial`).
    out.reveal = panel
      ? {
          absorption: panel.isOn("absorption"),
          tintedShadows: panel.isOn("tintedShadows"),
          scattering: panel.isOn("scattering"),
        }
      : {};
    sessionStorage.setItem(KEY, JSON.stringify(out));
  } catch {
    /* storage disabled (private mode / file://) — the tour just forgets */
  }
}

/** Read the previous stop's snapshot, or null on a fresh visit. */
export function loadTourSettings() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Copy a snapshot's plain renderer properties onto `rt`. Call BEFORE buildPanel
 * so every row renders the carried-over value. Returns the `reveal` intents for
 * buildPanel's `initial`, and the carried canvas scale.
 */
export function applyTourSettings(rt, snap) {
  if (!snap) return { initial: {}, canvasScale: null, rtEnabled: null };
  for (const k of FLAGS) {
    if (typeof snap[k] === "number" || typeof snap[k] === "boolean") rt[k] = snap[k];
  }
  if (snap.fog) {
    rt.fog.enabled = !!snap.fog.enabled;
    if (typeof snap.fog.density === "number") rt.fog.density = snap.fog.density;
  }
  if (snap.volumetric) rt.volumetric.enabled = !!snap.volumetric.enabled;
  return {
    initial: snap.reveal || {},
    canvasScale: typeof snap.canvasScale === "number" ? snap.canvasScale : null,
    rtEnabled: typeof snap.rtEnabled === "boolean" ? snap.rtEnabled : null,
  };
}

/**
 * Persist on the way out. `pagehide` fires for ordinary link navigation AND for
 * the back/forward cache, which `beforeunload` does not reliably do.
 */
export function persistOnExit(get) {
  const save = () => saveTourSettings(get());
  addEventListener("pagehide", save);
  // Belt and braces for engines that skip pagehide on same-document unloads.
  addEventListener("beforeunload", save);
}
