/**
 * three-realtime-rt — the cost report (costs.html).
 *
 * A STATIC page: it renders the committed quality-campaign matrix, it does not
 * measure anything. Vite inlines the JSON at build time so the published page
 * has no fetch and no way to disagree with the file in the repo.
 *
 * SIGN CONVENTIONS, because two of them are traps.
 *
 * `costMs` in the matrix is already normalised to "milliseconds this feature
 * ADDS when it is on, at this baseline" — the synthesis flips the subtraction
 * for the five features whose baseline state is OFF (`direction: "on"`), so a
 * negative costMs always means "the frame got faster". Nothing to do here.
 *
 * `dRmse320` is NOT normalised: it is always `variant - baseline`, and the
 * variant is the TOGGLED state. So for a `direction: "off"` feature (baseline
 * on, variant off) the effect of having the feature ON is the negation. This
 * page reports one thing per row — what turning the feature ON does — so the
 * sign is fixed here (`errOn` below).
 *
 * The matrix's `fpsWith` / `fpsWithout` fields are deliberately NOT used: they
 * are "fps at baseline" and "fps of the variant", which for the five
 * `direction: "on"` features means `fpsWith` is the fps WITHOUT the feature.
 * Frame rate is derived from the ms columns instead, where the meaning is
 * unambiguous.
 */
import matrix from "../quality-campaign/cost-matrix.json";

const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};

// Scene display order (cheapest/smallest first — it is the tour's order too) and
// which stop of the demo each one IS, so a reader can go and turn the switch.
const SCENES = [
  { key: "cornell", title: "Cornell box", stop: "tour stop 1", href: "./index.html" },
  { key: "museum", title: "Museum", stop: "tour stop 2", href: "./museum.html" },
  { key: "tokyo", title: "Littlest Tokyo", stop: "tour stop 3", href: "./models.html#tokyo" },
];

// Panel label + one line of "what am I paying for", in the panel's own words.
// `look: true` marks the two features whose rmse delta is a measure of how much
// the picture changed ON PURPOSE, not of error (see the campaign's caveats).
const FEATURES = {
  gi: { label: "global illumination", blurb: "one traced indirect bounce — the colour bleed off the walls" },
  emissiveNEE: { label: "emissive area lights", blurb: "next-event estimation on emissive meshes, instead of waiting for a GI ray to find them" },
  restir: { label: "ReSTIR lights", blurb: "one reservoir visibility ray for every light, instead of one shadow ray each" },
  restirGI: { label: "ReSTIR GI (experimental)", blurb: "reservoir reuse of the indirect sample; replaces the lighting pass's inline GI trace" },
  giHalfRate: { label: "half-rate GI", blurb: "the indirect bounce on alternating checkerboard parity, doubled" },
  reflections: { label: "reflections", blurb: "a traced specular ray on metallic surfaces" },
  refraction: { label: "refraction", blurb: "two-interface traced glass" },
  specular: { label: "PBR specular", blurb: "Cook-Torrance GGX highlights in their own buffer" },
  transparency: { label: "transparency", blurb: "alpha-blended surfaces composited over what the tracer sees behind them" },
  absorptionShadows: { label: "tinted shadows", blurb: "shadow rays attenuated per channel through absorbing glass — see the note below" },
  denoise: { label: "denoiser", blurb: "the edge-aware à-trous filter on the irradiance buffer (2 passes at baseline)" },
  taa: { label: "TAA", blurb: "jittered sub-pixel supersampling with a neighbourhood clamp" },
  kmScattering: { label: "scattering (Kubelka-Munk)", blurb: "two-flux translucency through the geometry's real thickness", look: true },
  volumetric: { label: "volumetric light", blurb: "single-scatter fog, one shadowed light sample per lighting pixel", look: true },
  stochasticLights: { label: "fast lights (1 ray)", blurb: "one random direct shadow ray per pixel instead of one per light" },
};

const f2 = (n) => (n < 0 ? "−" : "+") + Math.abs(n).toFixed(2);
const fps = (ms) => (1000 / ms).toFixed(0);
const cls = (n, eps = 0.05) => (Math.abs(n) < eps ? "zero" : n > 0 ? "cost" : "save");

function sceneBlock(def) {
  const sc = matrix.scenes[def.key];
  const rows = Object.entries(sc.features).map(([key, m]) => ({
    key,
    meta: FEATURES[key] || { label: key, blurb: "" },
    costMs: m.costMs,
    costPct: m.costPct,
    // Frame time WITH the feature on / OFF, from the two ms columns.
    msOn: m.direction === "off" ? sc.baselineMs : m.variantMs,
    msOff: m.direction === "off" ? m.variantMs : sc.baselineMs,
    // What turning the feature ON does to the error vs the reference.
    errOn: m.direction === "off" ? -m.dRmse320 : m.dRmse320,
  }));
  rows.sort((a, b) => b.costMs - a.costMs);
  // One axis, one scale, but the zero line is placed where this scene's data
  // puts it: the track spans [biggest saving .. biggest cost], so a scene whose
  // savings reach −39% gives them more of the track than one whose reach −14%,
  // and a cost and a saving of the same size are always the same length.
  const maxCost = Math.max(...rows.map((r) => r.costPct), 0);
  const maxSave = Math.max(...rows.map((r) => -r.costPct), 0);
  const span = maxCost + maxSave || 1;
  const zero = (maxSave / span) * 100;

  const wrap = el("div", "scene");
  wrap.append(
    el(
      "div",
      "head",
      `<b>${def.title}</b><span>${sc.tris.toLocaleString()} triangles</span>` +
        `<span>baseline ${sc.baselineMs.toFixed(2)} ms · ${sc.baselineFps.toFixed(0)} fps</span>` +
        `<span><a href="${def.href}">${def.stop} →</a></span>`
    )
  );

  const table = el("table");
  table.innerHTML =
    `<thead><tr>` +
    `<th class="name">feature</th><th>frame time</th><th>% of frame</th>` +
    `<th>fps on → off</th><th>accuracy Δrmse</th><th class="bar"></th>` +
    `</tr></thead>`;
  const tb = el("tbody");
  for (const r of rows) {
    const tr = el("tr");
    const w = (Math.abs(r.costPct) / span) * 100;
    const side = r.costPct > 0 ? `left:${zero.toFixed(2)}%` : `right:${(100 - zero).toFixed(2)}%`;
    tr.innerHTML =
      `<td class="name"><b>${r.meta.label}</b><i>${r.meta.blurb}</i></td>` +
      `<td class="${cls(r.costMs)}">${f2(r.costMs)} ms</td>` +
      `<td class="${cls(r.costPct, 0.5)}">${f2(r.costPct)}%</td>` +
      `<td>${fps(r.msOn)} → ${fps(r.msOff)}</td>` +
      `<td class="${r.meta.look ? "zero" : cls(r.errOn, 0.2)}">` +
      `${r.meta.look ? "look*" : f2(r.errOn)}</td>` +
      `<td class="bar"><div class="track"><div class="mid" style="left:${zero.toFixed(2)}%"></div>` +
      `<div class="fill ${r.costPct > 0 ? "cost" : "save"}" style="width:${w.toFixed(2)}%;${side}"></div>` +
      `</div></td>`;
    tb.append(tr);
  }
  table.append(tb);
  const scroller = el("div", "wrap");
  scroller.append(table);
  wrap.append(scroller);
  wrap.append(
    el(
      "p",
      "sub",
      `* the two opt-in LOOK features change the picture on purpose, so their rmse delta ` +
        `measures the change, not error — they are excluded from the accuracy column and from ` +
        `the campaign's Pareto frontier for the same reason.`
    )
  );
  return wrap;
}

// --- provenance --------------------------------------------------------------
const B = matrix.baseline;
document.getElementById("prov").innerHTML =
  `<b>GPU</b> ${matrix.gpu}<br>` +
  `<b>viewport</b> ${matrix.viewport}, pixelRatio 1 &nbsp;·&nbsp; <b>three</b> r${matrix.three} ` +
  `&nbsp;·&nbsp; <b>repo</b> ${matrix.gitRev}<br>` +
  `<b>method</b> ms/frame is the median of 8 fence-timed blocks of 60 frames per configuration ` +
  `(across 120 configurations the median spread between the fastest and slowest block is 1.0%, ` +
  `worst case 4.5% — so a 2% difference here is real). Error is RMSE against a converged ` +
  `renderScale-1.0 image of the same pose, both downsampled to 320×180.`;

document.getElementById("baseline").innerHTML = Object.entries(B)
  .filter(([k]) => k !== "note")
  .map(([k, v]) => `<code>${k}</code> ${v === true ? "on" : v === false ? "off" : v}`)
  .join(" &nbsp;·&nbsp; ");

const caveats = document.getElementById("caveats");
for (const c of matrix.caveats) caveats.append(el("li", null, c));

const host = document.getElementById("scenes");
for (const def of SCENES) host.append(sceneBlock(def));
