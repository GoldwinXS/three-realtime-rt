import{R as Je}from"./RealtimeRaytracer-R6uT4GRh.js";const Ze="0.16.2",et=`
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
`,H={chip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>',layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.6 1 1.4 1 2.3h6c0-.9.4-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg>',cube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5zM3 7l9 5 9-5M12 12v10"/></svg>',down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v14M6 12l6 6 6-6"/></svg>',burst:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>',reset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"/></svg>',sliders:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',chevD:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',frame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>'};function a(t,n,r){const i=document.createElement(t);return n&&(i.className=n),r!=null&&(i.innerHTML=r),i}function G(t,n,r,i){const p=a("div","row"),u=a("label",null,t),b=a("label","sw"),s=a("input");s.type="checkbox",s.checked=n,s.addEventListener("change",()=>r(s.checked)),b.append(s,a("span","track"),a("span","knob"));const m="t"+Math.random().toString(36).slice(2,7);return u.setAttribute("for",m),s.id=m,p.append(u,b),i&&(p.title=i),{row:p,input:s}}function I(t,n,r,i,p,u,b,s){const m=a("div","row"),k=a("label",null,t),l=a("input");l.type="range",l.min=n,l.max=r,l.step=i,l.value=p;const w=a("span","val",u(p));return l.addEventListener("input",()=>{b(parseFloat(l.value)),w.textContent=u(parseFloat(l.value))}),m.append(k,l,w),s&&(m.title=s),{row:m,input:l,val:w,set(S){return parseFloat(l.value)===S?!1:(l.value=S,w.textContent=u(S),!0)}}}function tt(...t){return I(...t).row}function ee(t,n,r,i,p){const u=a("div","row"),b=a("label",null,t),s=a("select");for(const[m,k]of n){const l=a("option",null,m);l.value=k,String(k)===String(r)&&(l.selected=!0),s.append(l)}return s.addEventListener("change",()=>i(s.value)),u.append(b,s),p&&(u.title=p),{row:u,select:s}}const qe=[];function U(t,n,r=!0){const i=a("div","sec");return i.append(a("h3",null,`<span class="chev">${H.chevD}</span>${t} ${n}`)),i.classList.toggle("collapsed",r),i.querySelector("h3").addEventListener("click",()=>{if(i.classList.contains("collapsed"))for(const p of qe)p!==i&&p.classList.add("collapsed");i.classList.toggle("collapsed")}),qe.push(i),i}function at(t,n,r=!1){return U(t,n,!r)}function rt({rt:t,state:n,setFeature:r,setCanvasScale:i,canvasScale:p,initial:u={},hint:b="drag to orbit · scroll to zoom"}){document.head.append(a("style",null,et));const s=a("div");s.id="panel";const m=a("div","hd",`${H.chip}<b>three-realtime-rt</b><span class="tag">RT on</span>`),k=a("button","fold",H.sliders);k.title="open / close the control panel",k.addEventListener("click",()=>s.classList.toggle("min")),m.append(k),s.append(m),matchMedia("(max-width: 700px)").matches&&s.classList.add("min");const l=`v${Ze}${t.specMRTSupported?"":" · no-mrt"}`,w=a("div");w.id="fps",w.textContent=`-- fps · ${l}`,document.body.append(w);let S=0,A=performance.now(),L=()=>{};(function e(){requestAnimationFrame(e),S++;const o=performance.now();L(),o-A>=500&&(w.textContent=`${(S*1e3/(o-A)).toFixed(0)} fps · ${l}`,S=0,A=o)})();const M={},R=new Set,f=(e,o,c,d,y)=>{const Z=G(o,c,_e=>{R.add(e),d(_e)},y);return M[e]={input:Z.input,apply:d},Z},F=(e,o,{auto:c=!1}={})=>{const d=M[e];return!d||c&&R.has(e)||d.input.disabled&&o||d.input.checked===o?!1:(d.input.checked=o,d.apply(o),!0)},v=U(H.layers,"Renderer",!0);let N=p;const h=t.canvasScaleHook;t.canvasScaleHook=e=>{N=e,h&&h(e)};const g=e=>{t.adaptiveQuality=e,pe.input.checked=e,L(!0)},E=G("ray tracing",n.rtEnabled,e=>de(e),"the raytraced pipeline — toggle off for plain rasterized three.js");v.append(E.row);const pe=G("auto quality",t.adaptiveQuality,e=>g(e),"let the governor hold a frame-rate target by trading lighting res, canvas scale and denoise passes");v.append(pe.row);const oe=a("div","note");oe.textContent="the AUTO rows are the governor's. It spends its free wins first (half-rate GI, ReSTIR GI), then lighting res in 5% steps down to 20%, and only then the canvas; it also sets denoise passes and fast lights. Changing any of those by hand switches this off.",v.append(oe);const he=G("denoise",t.denoise,e=>t.denoise=e,"the à-trous denoiser — smooths the noisy pre-convergence frames");v.append(he.row);const ue=G("TAA (anti-alias)",t.taa,e=>{t.taa=e,t.resetAccumulation()},"temporal anti-aliasing — accumulates across frames to settle edges");v.append(ue.row);const se=ee("resolution",[["100%",1],["85%",.85],["75%",.75],["62%",.62],["50%",.5]],p,e=>{g(!1),N=parseFloat(e),i(N)},"whole-canvas buffer scale — a browser-zoom-style lever with quadratic savings"),ne=ee("lighting res",[["100%",1],["75%",.75],["50%",.5],["37%",.375],["25%",.25]],t.renderScale,e=>{g(!1),t.renderScale=parseFloat(e)},"the resolution the lighting passes trace at — the first lever the governor spends"),fe=(e,o)=>{const c=a("span","gov hide","auto");return c.title=o,e.insertBefore(c,e.lastChild),c},We=fe(se.row,"driven by auto quality — the governor's deepest lever, taken only after lighting res bottoms out at 20%"),Ye=fe(ne.row,"driven by auto quality — the first resolution the governor spends, in 5% steps down to 20%");v.append(se.row,ne.row);const ge=ee("overscan",[["off",0],["5%",.05],["10%",.1]],t.overscan,e=>{t.overscan=parseFloat(e)},"render past the canvas edge and crop back, so camera-motion noise is born off-screen");v.append(ge.row);const be=ee("view",[["composite",0],["albedo",1],["normals",2],["irradiance",3],["world pos",4],["emissive",5],["specular",6],["bvh cost",7]],t.outputMode,e=>t.outputMode=parseInt(e,10),"debug views of the G-buffer and the lighting passes");v.append(be.row);const me=I("cost scale",32,512,16,Math.round(1/t.costScale),e=>`${Number(e).toFixed(0)} hits`,e=>t.costScale=1/e,"BVH traversal cost heatmap saturation, for the “bvh cost” view");v.append(me.row),s.append(v);const ve={absorption:[]};let B=null;const X=e=>{t.restir=e,xe.input.checked=e,e||(t.stochasticLights=!1,W.input.checked=!1),t.resetAccumulation()},D=new Set,ae=(e,o)=>{if(o){B===null&&(B={restir:t.restir,stochasticLights:t.stochasticLights}),D.add(e),t.restir&&X(!1);return}if(D.delete(e),D.size>0||!B)return;const c=B;B=null,c.restir!==t.restir&&X(c.restir),c.stochasticLights!==t.stochasticLights&&(t.stochasticLights=c.stochasticLights,W.input.checked=c.stochasticLights)},T=U(H.bulb,"Lighting & Atmosphere",!0);T.append(f("emissive","emissive area lights",t.emissiveNEE,e=>r("emissive",e)).row);const xe=f("restir","ReSTIR lights",t.restir,e=>{B=null,D.clear(),X(e)});T.append(xe.row);const z=e=>(e.classList.add("sub"),T.append(e),e),we=f("restirDirectionalBypass","sun bypass",t.restirDirectionalBypass,e=>{t.restirDirectionalBypass=e,t.resetAccumulation()},"keep DIRECTIONAL lights out of the reservoir and shade them exactly. The reservoir scores candidates UNSHADOWED, so it elects the sun everywhere and spends its one visibility ray on the wall between: interiors go black with bright specks. Costs one shadow ray per pixel.");z(we.row);const ye=f("restirReprojectionRescue","reprojection rescue",t.restirReprojectionRescue,e=>{t.restirReprojectionRescue=e,t.resetAccumulation()},"sub-texel correction plus a four-neighbour rescue when the reservoir's history fails its plane test. Without it, TAA jitter walks the sample across thin geometry and balusters/handrails/frames never accumulate any history at all.");z(ye.row);const ke=f("restirCandidateImportance","candidate importance",t.restirCandidateImportance,e=>{t.restirCandidateImportance=e,t.resetAccumulation()},"draw reservoir candidates by POWER (pool split, then that pool's CDF) instead of uniformly over lights + emissive triangles. Uniform spends ~91% of its candidates on the emissive pool, which carries ~4% of the light. Measured free.");z(ke.row);const Se=f("restirLightGrid","light grid",t.restirLightGrid,e=>{t.restirLightGrid=e,t.resetAccumulation()},"draw the reservoir's LIGHT candidates from a per-cell grid over the scene instead of one global power CDF. With many lights a global CDF proposes lights behind walls: in a 96-light hotel corridor, about one candidate in thirty-two could reach the pixel at all. Two small GPU draws, rebuilt only when a light moves.");z(Se.row);const Le=I("relative cap",0,4,.5,t.restirClampRel,e=>Number(e)===0?"off":Number(e).toFixed(1),e=>{t.restirClampRel=e,t.resetAccumulation()},"firefly cap on the ReSTIR direct term as a MULTIPLE of the pixel's own reservoir estimate of the light total (0 = the old absolute cap alone). One sample carries the whole sum, so an absolute cap clips the peaks and nothing lifts the zeros: bright surfaces converge dark.");z(Le.row);const Me=I("warm age",0,64,4,t.restirWarmAge,e=>Number(e)===0?"off":Number(e).toFixed(0),e=>{t.restirWarmAge=e,t.resetAccumulation()},"shade any pixel with fewer than N frames of validated reservoir history by the EXACT per-light loop instead. Removes reveal speckle outright and costs 5-6x a ReSTIR frame on those pixels; measured 2.2x whole-frame in motion, which is why it ships off.");z(Me.row);const Re=I("multi-sample",1,4,1,t.restirSamples,e=>`${Number(e).toFixed(0)}x`,e=>{t.restirSamples=e,t.resetAccumulation()},"shade N reservoir winners per pixel (the pixel's own plus N-1 neighbours'), each with its own visibility ray, averaged. Sub-1/sqrt(N) because neighbouring reservoirs are correlated, and the shipped denoiser already removes most of what it buys.");z(Re.row);const Te=a("div","note");Te.textContent="these six are the reservoir being RIGHT rather than fast: five are on by default and cost either nothing or one ray. “warm age” is the exception, off because it is 2.2x the frame in motion.",T.append(Te);const W=f("stochasticLights","fast lights (1 ray)",t.stochasticLights,e=>{t.stochasticLights=e,g(!1),t.resetAccumulation()});T.append(W.row);const Ce=f("ambient","ambient / hemisphere",t.ambient,e=>{t.ambient=e,t.resetAccumulation()},"honour three's AmbientLight and HemisphereLight as an UNOCCLUDED flat term (no ray, no shadow). Not GI: nothing occludes it and nothing carries colour between surfaces.");T.append(Ce.row);const Ee=G("volumetric light",t.volumetric.enabled,e=>{t.volumetric.enabled=e,t.resetAccumulation()});T.append(Ee.row);const Ie=G("fog / haze",t.fog.enabled,e=>{t.fog.enabled=e,t.resetAccumulation()});T.append(Ie.row),T.append(tt("density",.01,.12,.005,t.fog.density,e=>e.toFixed(2),e=>t.fog.density=e)),s.append(T);const x=U(H.burst,"Effects",!0);x.append(f("specular","PBR specular",t.specular,e=>{t.specular=e,t.resetAccumulation()},"the GGX specular term on the traced paths").row),x.append(f("gi","global illumination",t.gi,e=>r("gi",e),"one-bounce colour bleed — light bounces once and carries surface colour").row);const j=f("giHalfRate","half-rate GI (fast)",t.giHalfRate,e=>{t.giHalfRate=e,t.resetAccumulation()},"update the GI sample on alternate frames — roughly half the GI cost");j.row.classList.add("sub"),x.append(j.row);const V=f("restirGI","ReSTIR GI (exp)",t.restirGI,e=>{t.restirGI=e,t.resetAccumulation()},"reuse the 1-bounce GI sample across frames via reservoir resampling (experimental)");V.row.classList.add("sub"),x.append(V.row);const re=a("div","note");x.append(re),x.append(f("reflections","reflections",t.reflections,e=>r("reflections",e),"traced specular reflections — a real ray per pixel, not an environment map").row);const ie=f("refraction","refraction",t.refraction,e=>r("refraction",e),"traced glass paths — light bends through transmissive materials");x.append(ie.row);const Y=e=>{t.absorptionShadows=e,ae("tintedShadows",e),t.resetAccumulation()},C=f("tintedShadows","tinted shadows",t.absorptionShadows,Y);C.row.classList.add("sub","dim"),C.input.disabled=!0;const Q=a("div","note");Q.textContent="acts on the direct + emissive shadow rays, so it needs them: ReSTIR shades primary direct light with one BINARY visibility ray, and turning this on unchecks “ReSTIR lights” (and “fast lights” with it) so the tint actually reaches the floor. Turning it off puts both back.";const Qe=f("absorption","tinted glass",!!u.absorption,e=>{e&&!t.refraction&&(ie.input.checked=!0,r("refraction",!0)),r("absorption",e),C.row.classList.toggle("dim",!e),C.input.disabled=!e,Q.style.display=e?"":"none",!e&&C.input.checked&&(C.input.checked=!1,Y(!1));for(const o of ve.absorption||[])o(e)});x.append(Qe.row),x.append(C.row),Q.style.display="none",x.append(Q);const Ae=I("dispersion",0,.3,.01,t.dispersion,e=>Number(e).toFixed(2),e=>{t.dispersion=e,t.resetAccumulation()},"chromatic dispersion on the refracted term — the amount white light splits into colour");x.append(Ae.row);const K=a("div","note");K.textContent="the lamp's light REACHES the table through its shade, which is a shadow-ray effect: so this unchecks “ReSTIR lights” (and “fast lights” with it) for the same reason “tinted shadows” does, and puts both back when it goes off. The shade's own outward glow needs neither.",x.append(f("scattering","scattering (Kubelka-Munk)",!!u.scattering,e=>{e&&!t.refraction&&(ie.input.checked=!0,r("refraction",!0)),r("scattering",e),K.style.display=e?"":"none",ae("kmScattering",e)},"Kubelka-Munk subsurface scattering — light returns from inside a pigmented body").row),x.append(K),K.style.display="none",s.append(x);const P=U(H.chip,"Quality & Performance",!0),Ne=I("firefly clamp",1,8,.5,t.fireflyClamp,e=>Number(e).toFixed(1),e=>t.fireflyClamp=e,"clamp the bright speckle outliers that sparse sampling leaves behind");P.append(Ne.row);const Ge=I("history length",8,128,8,t.maxHistory,e=>Number(e).toFixed(0),e=>t.maxHistory=e,"how many frames of temporal history the converger keeps");P.append(Ge.row);const He=I("denoise passes",0,5,1,t.denoiseIterations,e=>Number(e).toFixed(0),e=>{t.denoiseIterations=e,g(!1)},"how many à-trous filter passes the denoiser runs");P.append(He.row);const q=G("motion vectors",t.motionVectors,e=>{t.motionVectors=e,t.resetAccumulation()},"reproject temporal history through each fragment's PREVIOUS screen position instead of through the camera alone. Camera-only reprojection is simply wrong for a moving mesh; a static scene renders identically either way.");t.motionVectorsSupported||(q.input.disabled=!0,q.row.classList.add("dim"),q.row.title="this GPU exposes fewer than 5 draw buffers, so the motion-vector attachment cannot be allocated; every stage stays on camera-only reprojection"),P.append(q.row),s.append(P);const Be=a("div","exhibits");s.append(Be);const le=a("div","reset-bar"),ze=a("button",null,`${H.reset}<span>Reset to defaults</span>`),Fe=()=>{const e=Je.DEFAULTS;for(const[o,c]of[["gi",e.gi],["emissive",e.emissiveNEE],["reflections",e.reflections],["refraction",e.refraction],["absorption",!1],["scattering",!1]]){const d=M[o];d&&(d.input.checked!==c&&(d.input.checked=c,d.apply(c)),R.delete(o))}C.input.checked&&(C.input.checked=!1,Y(!1)),B=null,D.clear(),X(e.restir);for(const o of["renderScale","overscan","denoise","denoiseIterations","taa","ambient","giHalfRate","restirGI","specular","dispersion","stochasticLights","restirWarmAge","restirDirectionalBypass","restirReprojectionRescue","restirCandidateImportance","restirLightGrid","restirClampRel","restirSamples","motionVectors","maxHistory","fireflyClamp","outputMode","costScale","targetFps"])t[o]!==e[o]&&(t[o]=e[o]);t.volumetric.enabled=e.volumetric.enabled,t.fog.enabled=!1,g(e.adaptiveQuality),N=1,i(1);try{sessionStorage.removeItem("rtTourSettings")}catch{}for(const[o,c]of[[Ce,t.ambient],[we,t.restirDirectionalBypass],[ye,t.restirReprojectionRescue],[ke,t.restirCandidateImportance],[Se,t.restirLightGrid],[q,t.motionVectors],[V,t.restirGI],[j,t.giHalfRate],[he,t.denoise],[ue,t.taa],[Ee,t.volumetric.enabled],[Ie,t.fog.enabled]])o.input.checked=c;Le.set(t.restirClampRel),Me.set(t.restirWarmAge),Re.set(t.restirSamples),Ae.set(t.dispersion),Ne.set(t.fireflyClamp),Ge.set(t.maxHistory),me.set(Math.round(1/t.costScale)),ge.select.value=String(t.overscan),be.select.value=String(t.outputMode),L(!0),t.resetAccumulation()};ze.addEventListener("click",Fe),le.append(ze);const $e=a("div","note");$e.textContent="the library's own constructor defaults: the correctness fixes on, the expensive paths (GI, volumetric, warm age) off, full canvas, auto quality on.",le.append($e),s.append(le);const _=a("div","stats-foot"),Oe=a("div","stats");_.append(Oe);const De=a("div","stats links");De.innerHTML='<a href="./costs.html" title="what every feature above costs, per scene, measured">Feature costs</a> &middot; <a href="https://github.com/GoldwinXS/three-realtime-rt" target="_blank" rel="noopener">GitHub (MIT)</a> &middot; <a href="https://goldwinxs.itch.io/three-realtime-rt-supporter-pack" target="_blank" rel="noopener">Supporter pack</a>',_.append(De),s.append(_);const ce=a("div","panel-fade");s.append(ce);const J=()=>{ce.style.bottom=`${_.offsetHeight}px`;const e=s.scrollHeight-s.clientHeight>1,o=s.scrollTop+s.clientHeight>=s.scrollHeight-1;ce.classList.toggle("show",e&&!o)};s.addEventListener("scroll",J,{passive:!0}),new MutationObserver(J).observe(s,{subtree:!0,attributes:!0,attributeFilter:["class"]}),addEventListener("resize",J),J(),document.body.append(s);const $=a("div");$.id="hint",$.textContent=b,b||($.style.display="none"),document.body.append($);const Ke=e=>`${Math.round(e*100)}%`,je=(e,o)=>{const c=y=>Math.abs(parseFloat(y.value)-o)<1e-6;let d=[...e.options].find(c);if(!d){d=a("option","gov-val",Ke(o)),d.value=String(o);const y=[...e.options].find(Z=>parseFloat(Z.value)<o);e.insertBefore(d,y||null)}e.value!==d.value&&(e.value=d.value);for(const y of[...e.options])y.classList.contains("gov-val")&&y!==d&&y.remove()};let Ve={};L=e=>{const o={auto:!!t.adaptiveQuality,light:t.renderScale,canvas:N,passes:t.denoiseIterations,fast:!!t.stochasticLights,half:!!t.giHalfRate,rgi:!!t.restirGI,gi:!!t.gi,denoise:!!t.denoise};let c=e===!0;for(const y of Object.keys(o))o[y]!==Ve[y]&&(c=!0);if(!c)return;Ve=o,je(ne.select,o.light),je(se.select,o.canvas),He.set(o.passes),W.input.checked=o.fast,j.input.checked=o.half,V.input.checked=o.rgi,We.classList.toggle("hide",!o.auto),Ye.classList.toggle("hide",!o.auto),oe.style.display=o.auto?"":"none",j.row.classList.toggle("dim",!o.gi),V.row.classList.toggle("dim",!o.gi||!o.denoise||o.passes<1);const d=o.rgi?o.gi?!o.denoise||o.passes<1?"ReSTIR GI is resolved at the denoise stage: with the denoiser off (or 0 passes) it contributes nothing.":o.passes>3?`${o.passes} denoise passes: the widest à-trous taps raise the filter's own lattice. 3 or fewer is the measured range, with or without ReSTIR GI.`:"":"ReSTIR GI needs global illumination on — the pass is skipped without it.":"";re.textContent=d,re.style.display=d?"":"none"},L(!0);const Pe=[];function de(e){n.rtEnabled=e,E.input.checked=e,m.querySelector(".tag").textContent=e?"RT on":"RT off";for(const o of Pe)o(e)}return de(n.rtEnabled),u.absorption&&M.absorption.apply(!0),u.absorption&&u.tintedShadows&&(C.input.checked=!0,Y(!0)),u.scattering&&M.scattering.apply(!0),{panel:s,exhibits:Be,gateHooks:ve,borrowRestir:ae,setFeatureState:F,resetToDefaults:Fe,isOn:e=>!!(M[e]&&M[e].input.checked),touched:R,setRtEnabled:de,isRtEnabled:()=>!!n.rtEnabled,onRtEnabled:e=>Pe.push(e),setHint(e){$.textContent=e,$.style.display=e?"":"none"},setStats(e){Oe.innerHTML=e}}}const O=[{id:"cornell",href:"./index.html",title:"Cornell box",blurb:"the reference room, one feature at a time"},{id:"museum",href:"./museum.html",title:"Museum",blurb:"every feature at once, in one lit room"},{id:"models",href:"./models.html",title:"Model scenes",blurb:"stock glTF, untouched, ray traced"}],te={prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 5l-7 7 7 7"/></svg>',next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 5l7 7-7 7"/></svg>',ray:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l8 9 8-6"/><path d="M2 20h20"/><circle cx="11" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>',bars:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>'},ot=`
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
`;function it({stopId:t,panel:n}){document.head.append(Object.assign(document.createElement("style"),{textContent:ot}));const r=Math.max(0,O.findIndex(h=>h.id===t)),i=O[r],p=O[r-1],u=O[r+1],b=document.createElement("div");b.id="tour";const s=document.createElement("button");s.className="rtsw",s.type="button",s.innerHTML=`${te.ray}<span class="lbl">ray tracing</span><span class="dot"></span>`;const m=s.querySelector(".lbl"),k=h=>{s.classList.toggle("on",h),m.textContent=h?"ray tracing: on":"ray tracing: off",s.title=h?"ray traced lighting — click for plain rasterized three.js":"plain rasterized three.js (shadow maps + ACES) — click for ray tracing"};s.addEventListener("click",()=>n.setRtEnabled(!s.classList.contains("on"))),n.onRtEnabled(k),k(n.isRtEnabled()),b.append(s);const l=document.createElement("div");l.className="nav";const w=(h,g)=>{const E=document.createElement("a");return E.className=g?"":"off",h==="next"&&g&&E.classList.add("next"),E.href=g?g.href:"#",E.innerHTML=h==="prev"?`${te.prev}<span>prev</span>`:`<span>next</span>${te.next}`,E.title=g?`${h}: ${g.title}`:`no ${h} stop`,E},S=document.createElement("span");S.className="stop",S.innerHTML=`<b>${i.title}</b><i>stop ${r+1} of ${O.length} · ${i.blurb}</i>`,l.append(w("prev",p),S,w("next",u)),b.append(l);const A=document.createElement("div");A.className="dots";for(const h of O){const g=document.createElement("a");g.href=h.href,g.title=h.title,h.id===t&&g.classList.add("cur"),A.append(g)}const L=document.createElement("a");L.className="costs",L.href="./costs.html",L.innerHTML=`${te.bars}<span>feature costs</span>`,L.title="what each feature costs, in ms and fps, measured per scene",A.append(L);const M=document.createElement("div");M.className="bar",M.append(s,l,A),b.append(M);const R=document.createElement("div");R.id="cue",R.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/></svg><span>drag to orbit</span>',document.body.append(R);let f=!1;const F=()=>{f||(f=!0,R.classList.add("gone"),R.classList.remove("show"))};setTimeout(()=>{f||R.classList.add("show")},1500);let v=null,N=null;return addEventListener("pointerdown",h=>{v=h.clientX,N=h.clientY}),addEventListener("pointermove",h=>{v!=null&&Math.hypot(h.clientX-v,h.clientY-N)>6&&F()}),addEventListener("wheel",F,{passive:!0}),setTimeout(F,1e4),n&&n.panel&&new MutationObserver(()=>{n.panel.classList.contains("min")||F()}).observe(n.panel,{attributes:!0,attributeFilter:["class"]}),document.body.append(b),{root:b,stop:i}}const Ue="rtTourSettings",Xe=["denoise","denoiseIterations","taa","adaptiveQuality","renderScale","overscan","specular","gi","giHalfRate","restirGI","emissiveNEE","reflections","refraction","restir","stochasticLights","dispersion","fireflyClamp","maxHistory","outputMode","costScale"];function st({rt:t,state:n,canvasScale:r,panel:i}){if(t)try{const p={canvasScale:r,rtEnabled:!!n.rtEnabled};for(const u of Xe)p[u]=t[u];p.fog={enabled:t.fog.enabled,density:t.fog.density},p.volumetric={enabled:t.volumetric.enabled},p.reveal=i?{absorption:i.isOn("absorption"),tintedShadows:i.isOn("tintedShadows"),scattering:i.isOn("scattering")}:{},sessionStorage.setItem(Ue,JSON.stringify(p))}catch{}}function lt(){try{const t=sessionStorage.getItem(Ue);return t?JSON.parse(t):null}catch{return null}}function ct(t,n){if(!n)return{initial:{},canvasScale:null,rtEnabled:null};for(const r of Xe)(typeof n[r]=="number"||typeof n[r]=="boolean")&&(t[r]=n[r]);return n.fog&&(t.fog.enabled=!!n.fog.enabled,typeof n.fog.density=="number"&&(t.fog.density=n.fog.density)),n.volumetric&&(t.volumetric.enabled=!!n.volumetric.enabled),{initial:n.reveal||{},canvasScale:typeof n.canvasScale=="number"?n.canvasScale:null,rtEnabled:typeof n.rtEnabled=="boolean"?n.rtEnabled:null}}function dt(t){const n=()=>st(t());addEventListener("pagehide",n),addEventListener("beforeunload",n)}export{H as I,ct as a,rt as b,ee as c,it as d,a as e,tt as f,lt as l,dt as p,at as s,G as t};
