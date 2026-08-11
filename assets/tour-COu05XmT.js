const Re="0.14.0",Te=`
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
`,N={chip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>',layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.6 1 1.4 1 2.3h6c0-.9.4-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg>',cube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5zM3 7l9 5 9-5M12 12v10"/></svg>',down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v14M6 12l6 6 6-6"/></svg>',burst:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>',reset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"/></svg>',sliders:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',chevD:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',frame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>'};function r(t,s,a){const i=document.createElement(t);return s&&(i.className=s),a!=null&&(i.innerHTML=a),i}function H(t,s,a,i){const c=r("div","row"),d=r("label",null,t),g=r("label","sw"),o=r("input");o.type="checkbox",o.checked=s,o.addEventListener("change",()=>a(o.checked)),g.append(o,r("span","track"),r("span","knob"));const x="t"+Math.random().toString(36).slice(2,7);return d.setAttribute("for",x),o.id=x,c.append(d,g),i&&(c.title=i),{row:c,input:o}}function we(t,s,a,i,c,d,g,o){const x=r("div","row"),y=r("label",null,t),l=r("input");l.type="range",l.min=s,l.max=a,l.step=i,l.value=c;const w=r("span","val",d(c));return l.addEventListener("input",()=>{g(parseFloat(l.value)),w.textContent=d(parseFloat(l.value))}),x.append(y,l,w),o&&(x.title=o),{row:x,input:l,val:w,set(S){return parseFloat(l.value)===S?!1:(l.value=S,w.textContent=d(S),!0)}}}function F(...t){return we(...t).row}function J(t,s,a,i,c){const d=r("div","row"),g=r("label",null,t),o=r("select");for(const[x,y]of s){const l=r("option",null,x);l.value=y,String(y)===String(a)&&(l.selected=!0),o.append(l)}return o.addEventListener("change",()=>i(o.value)),d.append(g,o),c&&(d.title=c),{row:d,select:o}}const me=[];function O(t,s,a=!0){const i=r("div","sec");return i.append(r("h3",null,`<span class="chev">${N.chevD}</span>${t} ${s}`)),i.classList.toggle("collapsed",a),i.querySelector("h3").addEventListener("click",()=>{if(i.classList.contains("collapsed"))for(const c of me)c!==i&&c.classList.add("collapsed");i.classList.toggle("collapsed")}),me.push(i),i}function He(t,s,a=!1){return O(t,s,!a)}function Ne({rt:t,state:s,setFeature:a,setCanvasScale:i,canvasScale:c,initial:d={},hint:g="drag to orbit · scroll to zoom"}){document.head.append(r("style",null,Te));const o=r("div");o.id="panel";const x=r("div","hd",`${N.chip}<b>three-realtime-rt</b><span class="tag">RT on</span>`),y=r("button","fold",N.sliders);y.title="open / close the control panel",y.addEventListener("click",()=>o.classList.toggle("min")),x.append(y),o.append(x),matchMedia("(max-width: 700px)").matches&&o.classList.add("min");const l=`v${Re}${t.specMRTSupported?"":" · no-mrt"}`,w=r("div");w.id="fps",w.textContent=`-- fps · ${l}`,document.body.append(w);let S=0,R=performance.now(),M=()=>{};(function e(){requestAnimationFrame(e),S++;const n=performance.now();M(),n-R>=500&&(w.textContent=`${(S*1e3/(n-R)).toFixed(0)} fps · ${l}`,S=0,R=n)})();const L={},E=new Set,b=(e,n,u,h,k)=>{const D=H(n,u,Ce=>{E.add(e),h(Ce)},k);return L[e]={input:D.input,apply:h},D},G=(e,n,{auto:u=!1}={})=>{const h=L[e];return!h||u&&E.has(e)||h.input.disabled&&n||h.input.checked===n?!1:(h.input.checked=n,h.apply(n),!0)},v=O(N.layers,"Renderer",!0);let I=c;const p=t.canvasScaleHook;t.canvasScaleHook=e=>{I=e,p&&p(e)};const f=e=>{t.adaptiveQuality=e,le.input.checked=e,M(!0)},C=H("ray tracing",s.rtEnabled,e=>ie(e),"the raytraced pipeline — toggle off for plain rasterized three.js");v.append(C.row);const le=H("auto quality",t.adaptiveQuality,e=>f(e),"let the governor hold a frame-rate target by trading lighting res, canvas scale and denoise passes");v.append(le.row);const W=r("div","note");W.textContent="the AUTO rows are the governor's. It spends its free wins first (half-rate GI, ReSTIR GI), then lighting res in 5% steps down to 20%, and only then the canvas; it also sets denoise passes and fast lights. Changing any of those by hand switches this off.",v.append(W),v.append(H("denoise",t.denoise,e=>t.denoise=e,"the à-trous denoiser — smooths the noisy pre-convergence frames").row),v.append(H("TAA (anti-alias)",t.taa,e=>{t.taa=e,t.resetAccumulation()},"temporal anti-aliasing — accumulates across frames to settle edges").row);const Z=J("resolution",[["100%",1],["85%",.85],["75%",.75],["62%",.62],["50%",.5]],c,e=>{f(!1),I=parseFloat(e),i(I)},"whole-canvas buffer scale — a browser-zoom-style lever with quadratic savings"),ee=J("lighting res",[["100%",1],["75%",.75],["50%",.5],["37%",.375],["25%",.25]],t.renderScale,e=>{f(!1),t.renderScale=parseFloat(e)},"the resolution the lighting passes trace at — the first lever the governor spends"),ce=(e,n)=>{const u=r("span","gov hide","auto");return u.title=n,e.insertBefore(u,e.lastChild),u},Se=ce(Z.row,"driven by auto quality — the governor's deepest lever, taken only after lighting res bottoms out at 20%"),Me=ce(ee.row,"driven by auto quality — the first resolution the governor spends, in 5% steps down to 20%");v.append(Z.row,ee.row),v.append(J("overscan",[["off",0],["5%",.05],["10%",.1]],t.overscan,e=>{t.overscan=parseFloat(e)},"render past the canvas edge and crop back, so camera-motion noise is born off-screen").row),v.append(J("view",[["composite",0],["albedo",1],["normals",2],["irradiance",3],["world pos",4],["emissive",5],["specular",6],["bvh cost",7]],t.outputMode,e=>t.outputMode=parseInt(e,10),"debug views of the G-buffer and the lighting passes").row),v.append(F("cost scale",32,512,16,Math.round(1/t.costScale),e=>`${Number(e).toFixed(0)} hits`,e=>t.costScale=1/e,"BVH traversal cost heatmap saturation, for the “bvh cost” view")),o.append(v);const pe={absorption:[]};let B=null;const te=e=>{t.restir=e,de.input.checked=e,e||(t.stochasticLights=!1,q.input.checked=!1),t.resetAccumulation()},X=new Set,oe=(e,n)=>{if(n){B===null&&(B={restir:t.restir,stochasticLights:t.stochasticLights}),X.add(e),t.restir&&te(!1);return}if(X.delete(e),X.size>0||!B)return;const u=B;B=null,u.restir!==t.restir&&te(u.restir),u.stochasticLights!==t.stochasticLights&&(t.stochasticLights=u.stochasticLights,q.input.checked=u.stochasticLights)},z=O(N.bulb,"Lighting & Atmosphere",!0);z.append(b("emissive","emissive area lights",t.emissiveNEE,e=>a("emissive",e)).row);const de=b("restir","ReSTIR lights",t.restir,e=>{B=null,X.clear(),te(e)});z.append(de.row);const q=b("stochasticLights","fast lights (1 ray)",t.stochasticLights,e=>{t.stochasticLights=e,f(!1),t.resetAccumulation()});z.append(q.row),z.append(H("volumetric light",t.volumetric.enabled,e=>{t.volumetric.enabled=e,t.resetAccumulation()}).row),z.append(H("fog / haze",t.fog.enabled,e=>{t.fog.enabled=e,t.resetAccumulation()}).row),z.append(F("density",.01,.12,.005,t.fog.density,e=>e.toFixed(2),e=>t.fog.density=e)),o.append(z);const m=O(N.burst,"Effects",!0);m.append(b("specular","PBR specular",t.specular,e=>{t.specular=e,t.resetAccumulation()},"the GGX specular term on the traced paths").row),m.append(b("gi","global illumination",t.gi,e=>a("gi",e),"one-bounce colour bleed — light bounces once and carries surface colour").row);const Y=b("giHalfRate","half-rate GI (fast)",t.giHalfRate,e=>{t.giHalfRate=e,t.resetAccumulation()},"update the GI sample on alternate frames — roughly half the GI cost");Y.row.classList.add("sub"),m.append(Y.row);const j=b("restirGI","ReSTIR GI (exp)",t.restirGI,e=>{t.restirGI=e,t.resetAccumulation()},"reuse the 1-bounce GI sample across frames via reservoir resampling (experimental)");j.row.classList.add("sub"),m.append(j.row);const ne=r("div","note");m.append(ne),m.append(b("reflections","reflections",t.reflections,e=>a("reflections",e),"traced specular reflections — a real ray per pixel, not an environment map").row);const se=b("refraction","refraction",t.refraction,e=>a("refraction",e),"traced glass paths — light bends through transmissive materials");m.append(se.row);const ae=e=>{t.absorptionShadows=e,oe("tintedShadows",e),t.resetAccumulation()},T=b("tintedShadows","tinted shadows",t.absorptionShadows,ae);T.row.classList.add("sub","dim"),T.input.disabled=!0;const P=r("div","note");P.textContent="acts on the direct + emissive shadow rays, so it needs them: ReSTIR shades primary direct light with one BINARY visibility ray, and turning this on unchecks “ReSTIR lights” (and “fast lights” with it) so the tint actually reaches the floor. Turning it off puts both back.";const Le=b("absorption","tinted glass",!!d.absorption,e=>{e&&!t.refraction&&(se.input.checked=!0,a("refraction",!0)),a("absorption",e),T.row.classList.toggle("dim",!e),T.input.disabled=!e,P.style.display=e?"":"none",!e&&T.input.checked&&(T.input.checked=!1,ae(!1));for(const n of pe.absorption||[])n(e)});m.append(Le.row),m.append(T.row),P.style.display="none",m.append(P),m.append(F("dispersion",0,.3,.01,t.dispersion,e=>Number(e).toFixed(2),e=>{t.dispersion=e,t.resetAccumulation()},"chromatic dispersion on the refracted term — the amount white light splits into colour"));const V=r("div","note");V.textContent="the lamp's light REACHES the table through its shade, which is a shadow-ray effect: so this unchecks “ReSTIR lights” (and “fast lights” with it) for the same reason “tinted shadows” does, and puts both back when it goes off. The shade's own outward glow needs neither.",m.append(b("scattering","scattering (Kubelka-Munk)",!!d.scattering,e=>{e&&!t.refraction&&(se.input.checked=!0,a("refraction",!0)),a("scattering",e),V.style.display=e?"":"none",oe("kmScattering",e)},"Kubelka-Munk subsurface scattering — light returns from inside a pigmented body").row),m.append(V),V.style.display="none",o.append(m);const Q=O(N.chip,"Quality & Performance",!0);Q.append(F("firefly clamp",1,8,.5,t.fireflyClamp,e=>Number(e).toFixed(1),e=>t.fireflyClamp=e,"clamp the bright speckle outliers that sparse sampling leaves behind")),Q.append(F("history length",8,128,8,t.maxHistory,e=>Number(e).toFixed(0),e=>t.maxHistory=e,"how many frames of temporal history the converger keeps"));const he=we("denoise passes",0,5,1,t.denoiseIterations,e=>Number(e).toFixed(0),e=>{t.denoiseIterations=e,f(!1)},"how many à-trous filter passes the denoiser runs");Q.append(he.row),o.append(Q);const ue=r("div","exhibits");o.append(ue);const K=r("div","stats-foot"),fe=r("div","stats");K.append(fe);const ge=r("div","stats links");ge.innerHTML='<a href="./costs.html" title="what every feature above costs, per scene, measured">Feature costs</a> &middot; <a href="https://github.com/GoldwinXS/three-realtime-rt" target="_blank" rel="noopener">GitHub (MIT)</a> &middot; <a href="https://goldwinxs.itch.io/three-realtime-rt-supporter-pack" target="_blank" rel="noopener">Supporter pack</a>',K.append(ge),o.append(K);const re=r("div","panel-fade");o.append(re);const _=()=>{re.style.bottom=`${K.offsetHeight}px`;const e=o.scrollHeight-o.clientHeight>1,n=o.scrollTop+o.clientHeight>=o.scrollHeight-1;re.classList.toggle("show",e&&!n)};o.addEventListener("scroll",_,{passive:!0}),new MutationObserver(_).observe(o,{subtree:!0,attributes:!0,attributeFilter:["class"]}),addEventListener("resize",_),_(),document.body.append(o);const $=r("div");$.id="hint",$.textContent=g,g||($.style.display="none"),document.body.append($);const Ee=e=>`${Math.round(e*100)}%`,be=(e,n)=>{const u=k=>Math.abs(parseFloat(k.value)-n)<1e-6;let h=[...e.options].find(u);if(!h){h=r("option","gov-val",Ee(n)),h.value=String(n);const k=[...e.options].find(D=>parseFloat(D.value)<n);e.insertBefore(h,k||null)}e.value!==h.value&&(e.value=h.value);for(const k of[...e.options])k.classList.contains("gov-val")&&k!==h&&k.remove()};let xe={};M=e=>{const n={auto:!!t.adaptiveQuality,light:t.renderScale,canvas:I,passes:t.denoiseIterations,fast:!!t.stochasticLights,half:!!t.giHalfRate,rgi:!!t.restirGI,gi:!!t.gi,denoise:!!t.denoise};let u=e===!0;for(const k of Object.keys(n))n[k]!==xe[k]&&(u=!0);if(!u)return;xe=n,be(ee.select,n.light),be(Z.select,n.canvas),he.set(n.passes),q.input.checked=n.fast,Y.input.checked=n.half,j.input.checked=n.rgi,Se.classList.toggle("hide",!n.auto),Me.classList.toggle("hide",!n.auto),W.style.display=n.auto?"":"none",Y.row.classList.toggle("dim",!n.gi),j.row.classList.toggle("dim",!n.gi||!n.denoise||n.passes<1);const h=n.rgi?n.gi?!n.denoise||n.passes<1?"ReSTIR GI is resolved at the denoise stage: with the denoiser off (or 0 passes) it contributes nothing.":n.passes>3?`${n.passes} denoise passes: the widest à-trous taps raise the filter's own lattice. 3 or fewer is the measured range, with or without ReSTIR GI.`:"":"ReSTIR GI needs global illumination on — the pass is skipped without it.":"";ne.textContent=h,ne.style.display=h?"":"none"},M(!0);const ve=[];function ie(e){s.rtEnabled=e,C.input.checked=e,x.querySelector(".tag").textContent=e?"RT on":"RT off";for(const n of ve)n(e)}return ie(s.rtEnabled),d.absorption&&L.absorption.apply(!0),d.absorption&&d.tintedShadows&&(T.input.checked=!0,ae(!0)),d.scattering&&L.scattering.apply(!0),{panel:o,exhibits:ue,gateHooks:pe,borrowRestir:oe,setFeatureState:G,isOn:e=>!!(L[e]&&L[e].input.checked),touched:E,setRtEnabled:ie,isRtEnabled:()=>!!s.rtEnabled,onRtEnabled:e=>ve.push(e),setHint(e){$.textContent=e,$.style.display=e?"":"none"},setStats(e){fe.innerHTML=e}}}const A=[{id:"cornell",href:"./index.html",title:"Cornell box",blurb:"the reference room, one feature at a time"},{id:"museum",href:"./museum.html",title:"Museum",blurb:"every feature at once, in one lit room"},{id:"models",href:"./models.html",title:"Model scenes",blurb:"stock glTF, untouched, ray traced"}],U={prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 5l-7 7 7 7"/></svg>',next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 5l7 7-7 7"/></svg>',ray:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l8 9 8-6"/><path d="M2 20h20"/><circle cx="11" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>',bars:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>'},Ie=`
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
`;function Ge({stopId:t,panel:s}){document.head.append(Object.assign(document.createElement("style"),{textContent:Ie}));const a=Math.max(0,A.findIndex(p=>p.id===t)),i=A[a],c=A[a-1],d=A[a+1],g=document.createElement("div");g.id="tour";const o=document.createElement("button");o.className="rtsw",o.type="button",o.innerHTML=`${U.ray}<span class="lbl">ray tracing</span><span class="dot"></span>`;const x=o.querySelector(".lbl"),y=p=>{o.classList.toggle("on",p),x.textContent=p?"ray tracing: on":"ray tracing: off",o.title=p?"ray traced lighting — click for plain rasterized three.js":"plain rasterized three.js (shadow maps + ACES) — click for ray tracing"};o.addEventListener("click",()=>s.setRtEnabled(!o.classList.contains("on"))),s.onRtEnabled(y),y(s.isRtEnabled()),g.append(o);const l=document.createElement("div");l.className="nav";const w=(p,f)=>{const C=document.createElement("a");return C.className=f?"":"off",p==="next"&&f&&C.classList.add("next"),C.href=f?f.href:"#",C.innerHTML=p==="prev"?`${U.prev}<span>prev</span>`:`<span>next</span>${U.next}`,C.title=f?`${p}: ${f.title}`:`no ${p} stop`,C},S=document.createElement("span");S.className="stop",S.innerHTML=`<b>${i.title}</b><i>stop ${a+1} of ${A.length} · ${i.blurb}</i>`,l.append(w("prev",c),S,w("next",d)),g.append(l);const R=document.createElement("div");R.className="dots";for(const p of A){const f=document.createElement("a");f.href=p.href,f.title=p.title,p.id===t&&f.classList.add("cur"),R.append(f)}const M=document.createElement("a");M.className="costs",M.href="./costs.html",M.innerHTML=`${U.bars}<span>feature costs</span>`,M.title="what each feature costs, in ms and fps, measured per scene",R.append(M);const L=document.createElement("div");L.className="bar",L.append(o,l,R),g.append(L);const E=document.createElement("div");E.id="cue",E.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/></svg><span>drag to orbit</span>',document.body.append(E);let b=!1;const G=()=>{b||(b=!0,E.classList.add("gone"),E.classList.remove("show"))};setTimeout(()=>{b||E.classList.add("show")},1500);let v=null,I=null;return addEventListener("pointerdown",p=>{v=p.clientX,I=p.clientY}),addEventListener("pointermove",p=>{v!=null&&Math.hypot(p.clientX-v,p.clientY-I)>6&&G()}),addEventListener("wheel",G,{passive:!0}),setTimeout(G,1e4),s&&s.panel&&new MutationObserver(()=>{s.panel.classList.contains("min")||G()}).observe(s.panel,{attributes:!0,attributeFilter:["class"]}),document.body.append(g),{root:g,stop:i}}const ke="rtTourSettings",ye=["denoise","denoiseIterations","taa","adaptiveQuality","renderScale","overscan","specular","gi","giHalfRate","restirGI","emissiveNEE","reflections","refraction","restir","stochasticLights","dispersion","fireflyClamp","maxHistory","outputMode","costScale"];function ze({rt:t,state:s,canvasScale:a,panel:i}){if(t)try{const c={canvasScale:a,rtEnabled:!!s.rtEnabled};for(const d of ye)c[d]=t[d];c.fog={enabled:t.fog.enabled,density:t.fog.density},c.volumetric={enabled:t.volumetric.enabled},c.reveal=i?{absorption:i.isOn("absorption"),tintedShadows:i.isOn("tintedShadows"),scattering:i.isOn("scattering")}:{},sessionStorage.setItem(ke,JSON.stringify(c))}catch{}}function Be(){try{const t=sessionStorage.getItem(ke);return t?JSON.parse(t):null}catch{return null}}function $e(t,s){if(!s)return{initial:{},canvasScale:null,rtEnabled:null};for(const a of ye)(typeof s[a]=="number"||typeof s[a]=="boolean")&&(t[a]=s[a]);return s.fog&&(t.fog.enabled=!!s.fog.enabled,typeof s.fog.density=="number"&&(t.fog.density=s.fog.density)),s.volumetric&&(t.volumetric.enabled=!!s.volumetric.enabled),{initial:s.reveal||{},canvasScale:typeof s.canvasScale=="number"?s.canvasScale:null,rtEnabled:typeof s.rtEnabled=="boolean"?s.rtEnabled:null}}function Ae(t){const s=()=>ze(t());addEventListener("pagehide",s),addEventListener("beforeunload",s)}export{N as I,$e as a,Ne as b,J as c,Ge as d,r as e,F as f,Be as l,Ae as p,He as s,H as t};
