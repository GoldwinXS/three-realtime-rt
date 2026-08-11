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
  z-index: 25; font: 12px/1.4 ui-monospace, "SF Mono", Consolas, monospace; color: #d7e0e6;
  pointer-events: none; }
#tour > * { pointer-events: auto; }
/* the scene is orbitable — say so with the cursor */
#app canvas { cursor: grab; }
#app canvas:active { cursor: grabbing; }
/* the switch, the nav and the dots ride in ONE bar so the bottom chrome reads
   as a single control cluster instead of three stacked rows */
#tour .bar { display: flex; align-items: center; gap: 10px; }
/* the sales pitch, one click, never inside the panel */
#tour .rtsw { display: flex; align-items: center; gap: 9px; cursor: pointer;
  padding: 9px 18px; border-radius: 999px; letter-spacing: 1.2px; font-size: 12px;
  font-weight: 600; text-transform: uppercase; border: 1px solid #2f414d;
  background: rgba(14,18,24,0.93); color: #8298a6; backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.42); transition: all .14s; user-select: none; }
#tour .rtsw svg { width: 16px; height: 16px; }
#tour .rtsw .dot { width: 8px; height: 8px; border-radius: 50%; background: #4a5b67; transition: all .14s; }
#tour .rtsw.on { color: #0c1116; background: #2fc2d4; border-color: #7fe6f2;
  box-shadow: 0 2px 10px rgba(56,208,224,0.2); }
#tour .rtsw.on .dot { background: #0c1116; }
#tour .rtsw:hover { border-color: #38d0e0; }
#tour .rtsw.on:hover { background: #4ad4e2; }
/* prev / stop / next */
#tour .nav { display: flex; align-items: stretch; gap: 1px; border-radius: 10px;
  overflow: hidden; border: 1px solid #33454f; background: rgba(14,18,24,0.97);
  backdrop-filter: blur(10px); box-shadow: 0 4px 16px rgba(0,0,0,0.42); }
#tour .nav a, #tour .nav span.stop { display: flex; align-items: center; gap: 7px;
  padding: 11px 17px; color: #f4f8fb; font-size: 13px; font-weight: 500;
  text-decoration: none; transition: background .12s; }
#tour .nav a { background: rgba(255,255,255,0.03); }
#tour .nav a:hover { background: #1e2d38; color: #fff; }
#tour .nav a.off { color: #6a7d8a; opacity: 0.6; pointer-events: none; cursor: default; }
#tour .nav a svg { width: 14px; height: 14px; }
#tour .nav .stop { flex-direction: column; align-items: center; gap: 2px;
  border-left: 1px solid #26323c; border-right: 1px solid #26323c; min-width: 196px; }
#tour .nav .stop b { color: #8fe0b0; font-weight: 600; letter-spacing: .4px; }
#tour .nav .stop i { font-style: normal; color: #d0dfe9; font-size: 10px; }
/* the forward affordance: the next link carries a brighter text + accent arrow
   so the tour's progression reads before any hover */
#tour .nav a.next { color: #cfe6ef; }
#tour .nav a.next svg { color: #7fd8c8; }
#tour .nav a.next:hover { color: #fff; }
#tour .nav a.next:hover svg { color: #38d0e0; }
#tour .dots { display: flex; align-items: center; gap: 6px; }
#tour .dots a { width: 7px; height: 7px; border-radius: 50%; background: #2f414d; transition: background .12s; flex: none; }
#tour .dots a:hover { background: #4d6472; }
#tour .dots a.cur { background: #7ee787; }
/* the cost report — every feature in the panel has a measured price, and this
   is where it is written down. Sits with the dots, not in the prev/next nav:
   it is a side door out of the tour, not a fourth stop. */
#tour .dots a.costs { width: auto; height: auto; border-radius: 6px;
  background: rgba(14,18,24,0.93); color: #aebfcc; font-size: 10px;
  letter-spacing: .4px; text-decoration: none; padding: 3px 8px;
  border: 1px solid #2c3a46; margin-left: 6px;
  display: flex; align-items: center; gap: 5px; }
#tour .dots a.costs svg { width: 11px; height: 11px; }
#tour .dots a.costs:hover { color: #8fe0b0; border-color: #3d5260; background: #1b2831; }
/* a transient "drag to orbit" cue, shown once after the boot hero fades and
   dismissed on the first pointer interaction or after a few seconds */
#cue { position: fixed; left: 50%; bottom: 152px; transform: translateX(-50%) translateY(8px);
  z-index: 22; display: flex; align-items: center; gap: 9px; pointer-events: none;
  font: 12px ui-monospace, "SF Mono", Consolas, monospace; color: #d7e0e6;
  letter-spacing: 0.4px; background: rgba(14,18,24,0.82); border: 1px solid #2c3a46;
  border-radius: 999px; padding: 8px 16px; opacity: 0;
  transition: opacity 0.45s, transform 0.45s; }
#cue svg { width: 15px; height: 15px; color: #7fd8c8; }
#cue.show { opacity: 1; transform: translateX(-50%) translateY(0); }
#cue.gone { opacity: 0; transform: translateX(-50%) translateY(8px); }
@media (max-width: 700px) {
  #tour { bottom: 12px; }
  #tour .bar { flex-direction: column; gap: 7px; }
  #tour .nav .stop { min-width: 120px; }
  #tour .nav .stop i { display: none; }
  #tour .nav a, #tour .nav span.stop { padding: 8px 9px; }
  #cue { bottom: 190px; }
  #tour .rtsw { padding: 7px 13px; font-size: 11px; }
  #tour .dots { margin-bottom: 4px; }
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
    if (dir === "next" && target) a.classList.add("next");
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
  label.innerHTML = `<b>${stop.title}</b><i>stop ${i + 1} of ${STOPS.length} · ${stop.blurb}</i>`;
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
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.append(sw, nav, dots);
  root.append(bar);

  // Transient "drag to orbit" cue: appears after the hero has faded, disappears
  // on the first pointer interaction or after a few seconds either way.
  const cue = document.createElement("div");
  cue.id = "cue";
  cue.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/></svg>' +
    "<span>drag to orbit</span>";
  document.body.append(cue);
  let cueGone = false;
  const dismissCue = () => {
    if (cueGone) return;
    cueGone = true;
    cue.classList.add("gone");
    cue.classList.remove("show");
  };
  // Reveal only after the boot hero has had its moment, so it reads as a follow-up.
  setTimeout(() => { if (!cueGone) cue.classList.add("show"); }, 1500);
  // Dismiss on a real orbit drag or a scroll, not on an incidental click — the
  // cue stays until the visitor actually starts moving the camera.
  let downX = null, downY = null;
  addEventListener("pointerdown", (e) => { downX = e.clientX; downY = e.clientY; });
  addEventListener("pointermove", (e) => {
    if (downX == null) return;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) dismissCue();
  });
  addEventListener("wheel", dismissCue, { passive: true });
  setTimeout(dismissCue, 10000);
  // Expanding the control panel would overlap the cue, so drop it then.
  if (panel && panel.panel) {
    new MutationObserver(() => {
      if (!panel.panel.classList.contains("min")) dismissCue();
    }).observe(panel.panel, { attributes: true, attributeFilter: ["class"] });
  }

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
