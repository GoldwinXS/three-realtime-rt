(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ba="160",R0={ROTATE:0,DOLLY:1,PAN:2},C0={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},uh=0,Ya=1,hh=2,iu=1,fh=2,wn=3,$t=0,Ot=1,un=2,qn=0,ji=1,Ka=2,$a=3,Za=4,dh=5,ai=100,ph=101,mh=102,Ja=103,Qa=104,gh=200,_h=201,vh=202,xh=203,ea=204,ta=205,yh=206,Mh=207,Sh=208,Th=209,Eh=210,bh=211,Ah=212,wh=213,Rh=214,Ch=0,Ph=1,Lh=2,Ur=3,Dh=4,Ih=5,Uh=6,Nh=7,su=0,Fh=1,Bh=2,jn=0,Oh=1,zh=2,Hh=3,Gh=4,kh=5,Vh=6,ec="attached",Wh="detached",ru=300,$i=301,Zi=302,na=303,ia=304,Vr=306,Ji=1e3,tn=1001,Nr=1002,Ke=1003,sa=1004,Lr=1005,nt=1006,ou=1007,pi=1008,_n=1009,ra=1010,au=1011,Wr=1012,ws=1013,qt=1014,Pt=1015,Kt=1016,cu=1017,lu=1018,hi=1020,Xh=1021,ht=1023,qh=1024,jh=1025,fi=1026,Qi=1027,uu=1028,Aa=1029,hu=1030,Xr=1031,Is=1033,so=33776,ro=33777,oo=33778,ao=33779,tc=35840,nc=35841,ic=35842,sc=35843,fu=36196,rc=37492,oc=37496,ac=37808,cc=37809,lc=37810,uc=37811,hc=37812,fc=37813,dc=37814,pc=37815,mc=37816,gc=37817,_c=37818,vc=37819,xc=37820,yc=37821,co=36492,Mc=36494,Sc=36495,Yh=36283,Tc=36284,Ec=36285,bc=36286,Us=2300,es=2301,lo=2302,Ac=2400,wc=2401,Rc=2402,Kh=2500,$h=0,du=1,oa=2,pu=3e3,di=3001,Zh=3200,Jh=3201,mu=0,Qh=1,nn="",ut="srgb",Tt="srgb-linear",wa="display-p3",qr="display-p3-linear",Fr="linear",et="srgb",Br="rec709",Or="p3",gi=7680,Cc=519,ef=512,tf=513,nf=514,gu=515,sf=516,rf=517,of=518,af=519,aa=35044,Dn="300 es",ca=1035,Pn=2e3,zr=2001;class rs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Pc=1234567;const Rs=Math.PI/180,ts=180/Math.PI;function hn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(wt[s&255]+wt[s>>8&255]+wt[s>>16&255]+wt[s>>24&255]+"-"+wt[e&255]+wt[e>>8&255]+"-"+wt[e>>16&15|64]+wt[e>>24&255]+"-"+wt[t&63|128]+wt[t>>8&255]+"-"+wt[t>>16&255]+wt[t>>24&255]+wt[n&255]+wt[n>>8&255]+wt[n>>16&255]+wt[n>>24&255]).toLowerCase()}function Mt(s,e,t){return Math.max(e,Math.min(t,s))}function Ra(s,e){return(s%e+e)%e}function cf(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function lf(s,e,t){return s!==e?(t-s)/(e-s):0}function Cs(s,e,t){return(1-t)*s+t*e}function uf(s,e,t,n){return Cs(s,e,1-Math.exp(-t*n))}function hf(s,e=1){return e-Math.abs(Ra(s,e*2)-e)}function ff(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function df(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function pf(s,e){return s+Math.floor(Math.random()*(e-s+1))}function mf(s,e){return s+Math.random()*(e-s)}function gf(s){return s*(.5-Math.random())}function _f(s){s!==void 0&&(Pc=s);let e=Pc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function vf(s){return s*Rs}function xf(s){return s*ts}function la(s){return(s&s-1)===0&&s!==0}function yf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Hr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Mf(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*u,c*h,c*f,a*l);break;case"YZY":s.set(c*f,a*u,c*h,a*l);break;case"ZXZ":s.set(c*h,c*f,a*u,a*l);break;case"XZX":s.set(a*u,c*g,c*d,a*l);break;case"YXY":s.set(c*d,a*u,c*g,a*l);break;case"ZYZ":s.set(c*g,c*d,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function gn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ye(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Sf={DEG2RAD:Rs,RAD2DEG:ts,generateUUID:hn,clamp:Mt,euclideanModulo:Ra,mapLinear:cf,inverseLerp:lf,lerp:Cs,damp:uf,pingpong:hf,smoothstep:ff,smootherstep:df,randInt:pf,randFloat:mf,randFloatSpread:gf,seededRandom:_f,degToRad:vf,radToDeg:xf,isPowerOfTwo:la,ceilPowerOfTwo:yf,floorPowerOfTwo:Hr,setQuaternionFromProperEuler:Mf,normalize:Ye,denormalize:gn};class xe{constructor(e=0,t=0){xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Mt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class De{constructor(e,t,n,i,r,o,a,c,l){De.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l)}set(e,t,n,i,r,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=i,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],h=n[7],f=n[2],d=n[5],g=n[8],_=i[0],m=i[3],p=i[6],x=i[1],v=i[4],M=i[7],b=i[2],S=i[5],E=i[8];return r[0]=o*_+a*x+c*b,r[3]=o*m+a*v+c*S,r[6]=o*p+a*M+c*E,r[1]=l*_+u*x+h*b,r[4]=l*m+u*v+h*S,r[7]=l*p+u*M+h*E,r[2]=f*_+d*x+g*b,r[5]=f*m+d*v+g*S,r[8]=f*p+d*M+g*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+i*r*l-i*o*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,f=a*c-u*r,d=l*r-o*c,g=t*h+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(i*l-u*n)*_,e[2]=(a*n-i*o)*_,e[3]=f*_,e[4]=(u*t-i*c)*_,e[5]=(i*r-a*t)*_,e[6]=d*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-i*l,i*c,-i*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(uo.makeScale(e,t)),this}rotate(e){return this.premultiply(uo.makeRotation(-e)),this}translate(e,t){return this.premultiply(uo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const uo=new De;function _u(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Ns(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Tf(){const s=Ns("canvas");return s.style.display="block",s}const Lc={};function Ps(s){s in Lc||(Lc[s]=!0,console.warn(s))}const Dc=new De().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ic=new De().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ks={[Tt]:{transfer:Fr,primaries:Br,toReference:s=>s,fromReference:s=>s},[ut]:{transfer:et,primaries:Br,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[qr]:{transfer:Fr,primaries:Or,toReference:s=>s.applyMatrix3(Ic),fromReference:s=>s.applyMatrix3(Dc)},[wa]:{transfer:et,primaries:Or,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Ic),fromReference:s=>s.applyMatrix3(Dc).convertLinearToSRGB()}},Ef=new Set([Tt,qr]),We={enabled:!0,_workingColorSpace:Tt,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Ef.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=ks[e].toReference,i=ks[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return ks[s].primaries},getTransfer:function(s){return s===nn?Fr:ks[s].transfer}};function Yi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ho(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let _i;class vu{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{_i===void 0&&(_i=Ns("canvas")),_i.width=e.width,_i.height=e.height;const n=_i.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=_i}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ns("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Yi(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Yi(t[n]/255)*255):t[n]=Yi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let bf=0;class xu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bf++}),this.uuid=hn(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(fo(i[o].image)):r.push(fo(i[o]))}else r=fo(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function fo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?vu.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Af=0;class bt extends rs{constructor(e=bt.DEFAULT_IMAGE,t=bt.DEFAULT_MAPPING,n=tn,i=tn,r=nt,o=pi,a=ht,c=_n,l=bt.DEFAULT_ANISOTROPY,u=nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=hn(),this.name="",this.source=new xu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(Ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===di?ut:nn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ru)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ji:e.x=e.x-Math.floor(e.x);break;case tn:e.x=e.x<0?0:1;break;case Nr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ji:e.y=e.y-Math.floor(e.y);break;case tn:e.y=e.y<0?0:1;break;case Nr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ut?di:pu}set encoding(e){Ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===di?ut:nn}}bt.DEFAULT_IMAGE=null;bt.DEFAULT_MAPPING=ru;bt.DEFAULT_ANISOTROPY=1;class $e{constructor(e=0,t=0,n=0,i=1){$e.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],u=c[4],h=c[8],f=c[1],d=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(l+1)/2,M=(d+1)/2,b=(p+1)/2,S=(u+f)/4,E=(h+_)/4,L=(g+m)/4;return v>M&&v>b?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=S/n,r=E/n):M>b?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=S/i,r=L/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=E/r,i=L/r),this.set(n,i,r,t),this}let x=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(f-u)*(f-u));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(h-_)/x,this.z=(f-u)/x,this.w=Math.acos((l+d+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class wf extends rs{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new $e(0,0,e,t),this.scissorTest=!1,this.viewport=new $e(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(Ps("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===di?ut:nn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new bt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new xu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zt extends wf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class yu extends bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rf extends bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Cf extends Zt{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLMultipleRenderTargets=!0;const r=this.texture;this.texture=[];for(let o=0;o<n;o++)this.texture[o]=r.clone(),this.texture[o].isRenderTargetTexture=!0}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.texture.length;i<r;i++)this.texture[i].image.width=e,this.texture[i].image.height=t,this.texture[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}copy(e){this.dispose(),this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.texture.length=0;for(let t=0,n=e.texture.length;t<n;t++)this.texture[t]=e.texture[t].clone(),this.texture[t].isRenderTargetTexture=!0;return this}}class $n{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let c=n[i+0],l=n[i+1],u=n[i+2],h=n[i+3];const f=r[o+0],d=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=_;return}if(h!==_||c!==f||l!==d||u!==g){let m=1-a;const p=c*f+l*d+u*g+h*_,x=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const b=Math.sqrt(v),S=Math.atan2(b,p*x);m=Math.sin(m*S)/b,a=Math.sin(a*S)/b}const M=a*x;if(c=c*m+f*M,l=l*m+d*M,u=u*m+g*M,h=h*m+_*M,m===1-a){const b=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=b,l*=b,u*=b,h*=b}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],c=n[i+1],l=n[i+2],u=n[i+3],h=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+u*h+c*d-l*f,e[t+1]=c*g+u*f+l*h-a*d,e[t+2]=l*g+u*d+a*f-c*h,e[t+3]=u*g-a*h-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(i/2),h=a(r/2),f=c(n/2),d=c(i/2),g=c(r/2);switch(o){case"XYZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"YXZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"ZXY":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"ZYX":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"YZX":this._x=f*u*h+l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h-f*d*g;break;case"XZY":this._x=f*u*h-l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],f=n+a+h;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-c)*d,this._y=(r-l)*d,this._z=(o-i)*d}else if(n>a&&n>h){const d=2*Math.sqrt(1+n-a-h);this._w=(u-c)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+l)/d}else if(a>h){const d=2*Math.sqrt(1+a-n-h);this._w=(r-l)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(c+u)/d}else{const d=2*Math.sqrt(1+h-n-a);this._w=(o-i)/d,this._x=(r+l)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Mt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+i*l-r*c,this._y=i*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-i*a,this._w=o*u-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-t)*u)/l,f=Math.sin(t*u)/l;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=i*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(e=0,t=0,n=0){C.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Uc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Uc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*i-a*n),u=2*(a*t-r*i),h=2*(r*n-o*t);return this.x=t+c*l+o*h-a*u,this.y=n+c*u+a*l-r*h,this.z=i+c*h+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return po.copy(this).projectOnVector(e),this.sub(po)}reflect(e){return this.sub(po.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Mt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const po=new C,Uc=new $n;class _t{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(on.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(on.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=on.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,on):on.fromBufferAttribute(r,o),on.applyMatrix4(e.matrixWorld),this.expandByPoint(on);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vs.copy(n.boundingBox)),Vs.applyMatrix4(e.matrixWorld),this.union(Vs)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,on),on.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(fs),Ws.subVectors(this.max,fs),vi.subVectors(e.a,fs),xi.subVectors(e.b,fs),yi.subVectors(e.c,fs),Nn.subVectors(xi,vi),Fn.subVectors(yi,xi),ti.subVectors(vi,yi);let t=[0,-Nn.z,Nn.y,0,-Fn.z,Fn.y,0,-ti.z,ti.y,Nn.z,0,-Nn.x,Fn.z,0,-Fn.x,ti.z,0,-ti.x,-Nn.y,Nn.x,0,-Fn.y,Fn.x,0,-ti.y,ti.x,0];return!mo(t,vi,xi,yi,Ws)||(t=[1,0,0,0,1,0,0,0,1],!mo(t,vi,xi,yi,Ws))?!1:(Xs.crossVectors(Nn,Fn),t=[Xs.x,Xs.y,Xs.z],mo(t,vi,xi,yi,Ws))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,on).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(on).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Mn=[new C,new C,new C,new C,new C,new C,new C,new C],on=new C,Vs=new _t,vi=new C,xi=new C,yi=new C,Nn=new C,Fn=new C,ti=new C,fs=new C,Ws=new C,Xs=new C,ni=new C;function mo(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){ni.fromArray(s,r);const a=i.x*Math.abs(ni.x)+i.y*Math.abs(ni.y)+i.z*Math.abs(ni.z),c=e.dot(ni),l=t.dot(ni),u=n.dot(ni);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const Pf=new _t,ds=new C,go=new C;class dn{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Pf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ds.subVectors(e,this.center);const t=ds.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ds,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(go.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ds.copy(e.center).add(go)),this.expandByPoint(ds.copy(e.center).sub(go))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Sn=new C,_o=new C,qs=new C,Bn=new C,vo=new C,js=new C,xo=new C;class jr{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Sn.copy(this.origin).addScaledVector(this.direction,t),Sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){_o.copy(e).add(t).multiplyScalar(.5),qs.copy(t).sub(e).normalize(),Bn.copy(this.origin).sub(_o);const r=e.distanceTo(t)*.5,o=-this.direction.dot(qs),a=Bn.dot(this.direction),c=-Bn.dot(qs),l=Bn.lengthSq(),u=Math.abs(1-o*o);let h,f,d,g;if(u>0)if(h=o*c-a,f=o*a-c,g=r*u,h>=0)if(f>=-g)if(f<=g){const _=1/u;h*=_,f*=_,d=h*(h+o*f+2*a)+f*(o*h+f+2*c)+l}else f=r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l):f<=g?(h=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-c),r),d=-h*h+f*(f+2*c)+l);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(_o).addScaledVector(qs,f),d}intersectSphere(e,t){Sn.subVectors(e.center,this.origin);const n=Sn.dot(this.direction),i=Sn.dot(Sn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,i=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,i=(e.min.x-f.x)*l),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),h>=0?(a=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Sn)!==null}intersectTriangle(e,t,n,i,r){vo.subVectors(t,e),js.subVectors(n,e),xo.crossVectors(vo,js);let o=this.direction.dot(xo),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Bn.subVectors(this.origin,e);const c=a*this.direction.dot(js.crossVectors(Bn,js));if(c<0)return null;const l=a*this.direction.dot(vo.cross(Bn));if(l<0||c+l>o)return null;const u=-a*Bn.dot(xo);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _e{constructor(e,t,n,i,r,o,a,c,l,u,h,f,d,g,_,m){_e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l,u,h,f,d,g,_,m)}set(e,t,n,i,r,o,a,c,l,u,h,f,d,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=f,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _e().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Mi.setFromMatrixColumn(e,0).length(),r=1/Mi.setFromMatrixColumn(e,1).length(),o=1/Mi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=o*u,d=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=d+g*l,t[5]=f-_*l,t[9]=-a*c,t[2]=_-f*l,t[6]=g+d*l,t[10]=o*c}else if(e.order==="YXZ"){const f=c*u,d=c*h,g=l*u,_=l*h;t[0]=f+_*a,t[4]=g*a-d,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){const f=c*u,d=c*h,g=l*u,_=l*h;t[0]=f-_*a,t[4]=-o*h,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*u,t[9]=_-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const f=o*u,d=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=g*l-d,t[8]=f*l+_,t[1]=c*h,t[5]=_*l+f,t[9]=d*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=_-f*h,t[8]=g*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=d*h+g,t[10]=f-_*h}else if(e.order==="XZY"){const f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=f*h+_,t[5]=o*u,t[9]=d*h-g,t[2]=g*h-d,t[6]=a*u,t[10]=_*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Lf,e,Df)}lookAt(e,t,n){const i=this.elements;return Wt.subVectors(e,t),Wt.lengthSq()===0&&(Wt.z=1),Wt.normalize(),On.crossVectors(n,Wt),On.lengthSq()===0&&(Math.abs(n.z)===1?Wt.x+=1e-4:Wt.z+=1e-4,Wt.normalize(),On.crossVectors(n,Wt)),On.normalize(),Ys.crossVectors(Wt,On),i[0]=On.x,i[4]=Ys.x,i[8]=Wt.x,i[1]=On.y,i[5]=Ys.y,i[9]=Wt.y,i[2]=On.z,i[6]=Ys.z,i[10]=Wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],h=n[5],f=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],x=n[3],v=n[7],M=n[11],b=n[15],S=i[0],E=i[4],L=i[8],y=i[12],T=i[1],D=i[5],I=i[9],B=i[13],P=i[2],N=i[6],H=i[10],j=i[14],q=i[3],X=i[7],Z=i[11],ee=i[15];return r[0]=o*S+a*T+c*P+l*q,r[4]=o*E+a*D+c*N+l*X,r[8]=o*L+a*I+c*H+l*Z,r[12]=o*y+a*B+c*j+l*ee,r[1]=u*S+h*T+f*P+d*q,r[5]=u*E+h*D+f*N+d*X,r[9]=u*L+h*I+f*H+d*Z,r[13]=u*y+h*B+f*j+d*ee,r[2]=g*S+_*T+m*P+p*q,r[6]=g*E+_*D+m*N+p*X,r[10]=g*L+_*I+m*H+p*Z,r[14]=g*y+_*B+m*j+p*ee,r[3]=x*S+v*T+M*P+b*q,r[7]=x*E+v*D+M*N+b*X,r[11]=x*L+v*I+M*H+b*Z,r[15]=x*y+v*B+M*j+b*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],f=e[10],d=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*c*h-i*l*h-r*a*f+n*l*f+i*a*d-n*c*d)+_*(+t*c*d-t*l*f+r*o*f-i*o*d+i*l*u-r*c*u)+m*(+t*l*h-t*a*d-r*o*h+n*o*d+r*a*u-n*l*u)+p*(-i*a*u-t*c*h+t*a*f+i*o*h-n*o*f+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],f=e[10],d=e[11],g=e[12],_=e[13],m=e[14],p=e[15],x=h*m*l-_*f*l+_*c*d-a*m*d-h*c*p+a*f*p,v=g*f*l-u*m*l-g*c*d+o*m*d+u*c*p-o*f*p,M=u*_*l-g*h*l+g*a*d-o*_*d-u*a*p+o*h*p,b=g*h*c-u*_*c-g*a*f+o*_*f+u*a*m-o*h*m,S=t*x+n*v+i*M+r*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return e[0]=x*E,e[1]=(_*f*r-h*m*r-_*i*d+n*m*d+h*i*p-n*f*p)*E,e[2]=(a*m*r-_*c*r+_*i*l-n*m*l-a*i*p+n*c*p)*E,e[3]=(h*c*r-a*f*r-h*i*l+n*f*l+a*i*d-n*c*d)*E,e[4]=v*E,e[5]=(u*m*r-g*f*r+g*i*d-t*m*d-u*i*p+t*f*p)*E,e[6]=(g*c*r-o*m*r-g*i*l+t*m*l+o*i*p-t*c*p)*E,e[7]=(o*f*r-u*c*r+u*i*l-t*f*l-o*i*d+t*c*d)*E,e[8]=M*E,e[9]=(g*h*r-u*_*r-g*n*d+t*_*d+u*n*p-t*h*p)*E,e[10]=(o*_*r-g*a*r+g*n*l-t*_*l-o*n*p+t*a*p)*E,e[11]=(u*a*r-o*h*r-u*n*l+t*h*l+o*n*d-t*a*d)*E,e[12]=b*E,e[13]=(u*_*i-g*h*i+g*n*f-t*_*f-u*n*m+t*h*m)*E,e[14]=(g*a*i-o*_*i-g*n*c+t*_*c+o*n*m-t*a*m)*E,e[15]=(o*h*i-u*a*i+u*n*c-t*h*c-o*n*f+t*a*f)*E,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,u*a+n,u*c-i*o,0,l*c-i*a,u*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,h=a+a,f=r*l,d=r*u,g=r*h,_=o*u,m=o*h,p=a*h,x=c*l,v=c*u,M=c*h,b=n.x,S=n.y,E=n.z;return i[0]=(1-(_+p))*b,i[1]=(d+M)*b,i[2]=(g-v)*b,i[3]=0,i[4]=(d-M)*S,i[5]=(1-(f+p))*S,i[6]=(m+x)*S,i[7]=0,i[8]=(g+v)*E,i[9]=(m-x)*E,i[10]=(1-(f+_))*E,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Mi.set(i[0],i[1],i[2]).length();const o=Mi.set(i[4],i[5],i[6]).length(),a=Mi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],an.copy(this);const l=1/r,u=1/o,h=1/a;return an.elements[0]*=l,an.elements[1]*=l,an.elements[2]*=l,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=h,an.elements[9]*=h,an.elements[10]*=h,t.setFromRotationMatrix(an),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=Pn){const c=this.elements,l=2*r/(t-e),u=2*r/(n-i),h=(t+e)/(t-e),f=(n+i)/(n-i);let d,g;if(a===Pn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===zr)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=Pn){const c=this.elements,l=1/(t-e),u=1/(n-i),h=1/(o-r),f=(t+e)*l,d=(n+i)*u;let g,_;if(a===Pn)g=(o+r)*h,_=-2*h;else if(a===zr)g=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Mi=new C,an=new _e,Lf=new C(0,0,0),Df=new C(1,1,1),On=new C,Ys=new C,Wt=new C,Nc=new _e,Fc=new $n;class Yr{constructor(e=0,t=0,n=0,i=Yr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],u=i[9],h=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(Mt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Mt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Mt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Mt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Mt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Mt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Nc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Fc.setFromEuler(this),this.setFromQuaternion(Fc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yr.DEFAULT_ORDER="XYZ";class Mu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let If=0;const Bc=new C,Si=new $n,Tn=new _e,Ks=new C,ps=new C,Uf=new C,Nf=new $n,Oc=new C(1,0,0),zc=new C(0,1,0),Hc=new C(0,0,1),Ff={type:"added"},Bf={type:"removed"};class ot extends rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:If++}),this.uuid=hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ot.DEFAULT_UP.clone();const e=new C,t=new Yr,n=new $n,i=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new _e},normalMatrix:{value:new De}}),this.matrix=new _e,this.matrixWorld=new _e,this.matrixAutoUpdate=ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(Oc,e)}rotateY(e){return this.rotateOnAxis(zc,e)}rotateZ(e){return this.rotateOnAxis(Hc,e)}translateOnAxis(e,t){return Bc.copy(e).applyQuaternion(this.quaternion),this.position.add(Bc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Oc,e)}translateY(e){return this.translateOnAxis(zc,e)}translateZ(e){return this.translateOnAxis(Hc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ks.copy(e):Ks.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(ps,Ks,this.up):Tn.lookAt(Ks,ps,this.up),this.quaternion.setFromRotationMatrix(Tn),i&&(Tn.extractRotation(i.matrixWorld),Si.setFromRotationMatrix(Tn),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Ff)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Bf)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Tn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,e,Uf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,Nf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];i.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ot.DEFAULT_UP=new C(0,1,0);ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new C,En=new C,yo=new C,bn=new C,Ti=new C,Ei=new C,Gc=new C,Mo=new C,So=new C,To=new C;let $s=!1;class Ct{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),cn.subVectors(e,t),i.cross(cn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){cn.subVectors(i,t),En.subVectors(n,t),yo.subVectors(e,t);const o=cn.dot(cn),a=cn.dot(En),c=cn.dot(yo),l=En.dot(En),u=En.dot(yo),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;const f=1/h,d=(l*c-a*u)*f,g=(o*u-a*c)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,bn)===null?!1:bn.x>=0&&bn.y>=0&&bn.x+bn.y<=1}static getUV(e,t,n,i,r,o,a,c){return $s===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$s=!0),this.getInterpolation(e,t,n,i,r,o,a,c)}static getInterpolation(e,t,n,i,r,o,a,c){return this.getBarycoord(e,t,n,i,bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,bn.x),c.addScaledVector(o,bn.y),c.addScaledVector(a,bn.z),c)}static isFrontFacing(e,t,n,i){return cn.subVectors(n,t),En.subVectors(e,t),cn.cross(En).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return cn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),cn.cross(En).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ct.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ct.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return $s===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$s=!0),Ct.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}getInterpolation(e,t,n,i,r){return Ct.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Ct.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ct.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;Ti.subVectors(i,n),Ei.subVectors(r,n),Mo.subVectors(e,n);const c=Ti.dot(Mo),l=Ei.dot(Mo);if(c<=0&&l<=0)return t.copy(n);So.subVectors(e,i);const u=Ti.dot(So),h=Ei.dot(So);if(u>=0&&h<=u)return t.copy(i);const f=c*h-u*l;if(f<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(Ti,o);To.subVectors(e,r);const d=Ti.dot(To),g=Ei.dot(To);if(g>=0&&d<=g)return t.copy(r);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Ei,a);const m=u*g-d*h;if(m<=0&&h-u>=0&&d-g>=0)return Gc.subVectors(r,i),a=(h-u)/(h-u+(d-g)),t.copy(i).addScaledVector(Gc,a);const p=1/(m+_+f);return o=_*p,a=f*p,t.copy(n).addScaledVector(Ti,o).addScaledVector(Ei,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Su={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zn={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function Eo(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class he{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=We.workingColorSpace){return this.r=e,this.g=t,this.b=n,We.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=We.workingColorSpace){if(e=Ra(e,1),t=Mt(t,0,1),n=Mt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Eo(o,r,e+1/3),this.g=Eo(o,r,e),this.b=Eo(o,r,e-1/3)}return We.toWorkingColorSpace(this,i),this}setStyle(e,t=ut){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ut){const n=Su[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Yi(e.r),this.g=Yi(e.g),this.b=Yi(e.b),this}copyLinearToSRGB(e){return this.r=ho(e.r),this.g=ho(e.g),this.b=ho(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ut){return We.fromWorkingColorSpace(Rt.copy(this),e),Math.round(Mt(Rt.r*255,0,255))*65536+Math.round(Mt(Rt.g*255,0,255))*256+Math.round(Mt(Rt.b*255,0,255))}getHexString(e=ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=We.workingColorSpace){We.fromWorkingColorSpace(Rt.copy(this),t);const n=Rt.r,i=Rt.g,r=Rt.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case n:c=(i-r)/h+(i<r?6:0);break;case i:c=(r-n)/h+2;break;case r:c=(n-i)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=We.workingColorSpace){return We.fromWorkingColorSpace(Rt.copy(this),t),e.r=Rt.r,e.g=Rt.g,e.b=Rt.b,e}getStyle(e=ut){We.fromWorkingColorSpace(Rt.copy(this),e);const t=Rt.r,n=Rt.g,i=Rt.b;return e!==ut?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(zn),this.setHSL(zn.h+e,zn.s+t,zn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(zn),e.getHSL(Zs);const n=Cs(zn.h,Zs.h,t),i=Cs(zn.s,Zs.s,t),r=Cs(zn.l,Zs.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rt=new he;he.NAMES=Su;let Of=0;class vn extends rs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=hn(),this.name="",this.type="Material",this.blending=ji,this.side=$t,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ea,this.blendDst=ta,this.blendEquation=ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new he(0,0,0),this.blendAlpha=0,this.depthFunc=Ur,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Cc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(n.blending=this.blending),this.side!==$t&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ea&&(n.blendSrc=this.blendSrc),this.blendDst!==ta&&(n.blendDst=this.blendDst),this.blendEquation!==ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ur&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Cc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class li extends vn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=su,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dt=new C,Js=new xe;class it{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=aa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Pt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Js.fromBufferAttribute(this,t),Js.applyMatrix3(e),this.setXY(t,Js.x,Js.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyMatrix3(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyMatrix4(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyNormalMatrix(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.transformDirection(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=gn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ye(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),i=Ye(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),i=Ye(i,this.array),r=Ye(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==aa&&(e.usage=this.usage),e}}class Tu extends it{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Eu extends it{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class St extends it{constructor(e,t,n){super(new Float32Array(e),t,n)}}let zf=0;const Qt=new _e,bo=new ot,bi=new C,Xt=new _t,ms=new _t,yt=new C;class Lt extends rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=hn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_u(e)?Eu:Tu)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new De().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,n){return Qt.makeTranslation(e,t,n),this.applyMatrix4(Qt),this}scale(e,t,n){return Qt.makeScale(e,t,n),this.applyMatrix4(Qt),this}lookAt(e){return bo.lookAt(e),bo.updateMatrix(),this.applyMatrix4(bo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new St(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _t);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Xt.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Xt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Xt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Xt.min),this.boundingBox.expandByPoint(Xt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new dn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(Xt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ms.setFromBufferAttribute(a),this.morphTargetsRelative?(yt.addVectors(Xt.min,ms.min),Xt.expandByPoint(yt),yt.addVectors(Xt.max,ms.max),Xt.expandByPoint(yt)):(Xt.expandByPoint(ms.min),Xt.expandByPoint(ms.max))}Xt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)yt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(yt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)yt.fromBufferAttribute(a,l),c&&(bi.fromBufferAttribute(e,l),yt.add(bi)),i=Math.max(i,n.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,r=t.normal.array,o=t.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new it(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],u=[];for(let T=0;T<a;T++)l[T]=new C,u[T]=new C;const h=new C,f=new C,d=new C,g=new xe,_=new xe,m=new xe,p=new C,x=new C;function v(T,D,I){h.fromArray(i,T*3),f.fromArray(i,D*3),d.fromArray(i,I*3),g.fromArray(o,T*2),_.fromArray(o,D*2),m.fromArray(o,I*2),f.sub(h),d.sub(h),_.sub(g),m.sub(g);const B=1/(_.x*m.y-m.x*_.y);isFinite(B)&&(p.copy(f).multiplyScalar(m.y).addScaledVector(d,-_.y).multiplyScalar(B),x.copy(d).multiplyScalar(_.x).addScaledVector(f,-m.x).multiplyScalar(B),l[T].add(p),l[D].add(p),l[I].add(p),u[T].add(x),u[D].add(x),u[I].add(x))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let T=0,D=M.length;T<D;++T){const I=M[T],B=I.start,P=I.count;for(let N=B,H=B+P;N<H;N+=3)v(n[N+0],n[N+1],n[N+2])}const b=new C,S=new C,E=new C,L=new C;function y(T){E.fromArray(r,T*3),L.copy(E);const D=l[T];b.copy(D),b.sub(E.multiplyScalar(E.dot(D))).normalize(),S.crossVectors(L,D);const B=S.dot(u[T])<0?-1:1;c[T*4]=b.x,c[T*4+1]=b.y,c[T*4+2]=b.z,c[T*4+3]=B}for(let T=0,D=M.length;T<D;++T){const I=M[T],B=I.start,P=I.count;for(let N=B,H=B+P;N<H;N+=3)y(n[N+0]),y(n[N+1]),y(n[N+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new it(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new C,r=new C,o=new C,a=new C,c=new C,l=new C,u=new C,h=new C;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,h=a.normalized,f=new l.constructor(c.length*u);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?d=c[_]*a.data.stride+a.offset:d=c[_]*u;for(let p=0;p<u;p++)f[g++]=l[d++]}return new it(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Lt,n=this.index.array,i=this.attributes;for(const a in i){const c=i[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){const f=l[u],d=e(f,n);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){const d=l[h];u.push(d.toJSON(e.data))}u.length>0&&(i[c]=u,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const l in i){const u=i[l];this.setAttribute(l,u.clone(t))}const r=e.morphAttributes;for(const l in r){const u=[],h=r[l];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const kc=new _e,ii=new jr,Qs=new dn,Vc=new C,Ai=new C,wi=new C,Ri=new C,Ao=new C,er=new C,tr=new xe,nr=new xe,ir=new xe,Wc=new C,Xc=new C,qc=new C,sr=new C,rr=new C;class Et extends ot{constructor(e=new Lt,t=new li){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){er.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],h=r[c];u!==0&&(Ao.fromBufferAttribute(h,e),o?er.addScaledVector(Ao,u):er.addScaledVector(Ao.sub(t),u))}t.add(er)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(r),ii.copy(e.ray).recast(e.near),!(Qs.containsPoint(ii.origin)===!1&&(ii.intersectSphere(Qs,Vc)===null||ii.origin.distanceToSquared(Vc)>(e.far-e.near)**2))&&(kc.copy(r).invert(),ii.copy(e.ray).applyMatrix4(kc),!(n.boundingBox!==null&&ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ii)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=o[m.materialIndex],x=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,b=v;M<b;M+=3){const S=a.getX(M),E=a.getX(M+1),L=a.getX(M+2);i=or(this,p,e,n,l,u,h,S,E,L),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const x=a.getX(m),v=a.getX(m+1),M=a.getX(m+2);i=or(this,o,e,n,l,u,h,x,v,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=o[m.materialIndex],x=Math.max(m.start,d.start),v=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,b=v;M<b;M+=3){const S=M,E=M+1,L=M+2;i=or(this,p,e,n,l,u,h,S,E,L),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const x=m,v=m+1,M=m+2;i=or(this,o,e,n,l,u,h,x,v,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function Hf(s,e,t,n,i,r,o,a){let c;if(e.side===Ot?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,e.side===$t,a),c===null)return null;rr.copy(a),rr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(rr);return l<t.near||l>t.far?null:{distance:l,point:rr.clone(),object:s}}function or(s,e,t,n,i,r,o,a,c,l){s.getVertexPosition(a,Ai),s.getVertexPosition(c,wi),s.getVertexPosition(l,Ri);const u=Hf(s,e,t,n,Ai,wi,Ri,sr);if(u){i&&(tr.fromBufferAttribute(i,a),nr.fromBufferAttribute(i,c),ir.fromBufferAttribute(i,l),u.uv=Ct.getInterpolation(sr,Ai,wi,Ri,tr,nr,ir,new xe)),r&&(tr.fromBufferAttribute(r,a),nr.fromBufferAttribute(r,c),ir.fromBufferAttribute(r,l),u.uv1=Ct.getInterpolation(sr,Ai,wi,Ri,tr,nr,ir,new xe),u.uv2=u.uv1),o&&(Wc.fromBufferAttribute(o,a),Xc.fromBufferAttribute(o,c),qc.fromBufferAttribute(o,l),u.normal=Ct.getInterpolation(sr,Ai,wi,Ri,Wc,Xc,qc,new C),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:c,c:l,normal:new C,materialIndex:0};Ct.getNormal(Ai,wi,Ri,h.normal),u.face=h}return u}class Bs extends Lt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],h=[];let f=0,d=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new St(l,3)),this.setAttribute("normal",new St(u,3)),this.setAttribute("uv",new St(h,2));function g(_,m,p,x,v,M,b,S,E,L,y){const T=M/E,D=b/L,I=M/2,B=b/2,P=S/2,N=E+1,H=L+1;let j=0,q=0;const X=new C;for(let Z=0;Z<H;Z++){const ee=Z*D-B;for(let ce=0;ce<N;ce++){const W=ce*T-I;X[_]=W*x,X[m]=ee*v,X[p]=P,l.push(X.x,X.y,X.z),X[_]=0,X[m]=0,X[p]=S>0?1:-1,u.push(X.x,X.y,X.z),h.push(ce/E),h.push(1-Z/L),j+=1}}for(let Z=0;Z<L;Z++)for(let ee=0;ee<E;ee++){const ce=f+ee+N*Z,W=f+ee+N*(Z+1),Y=f+(ee+1)+N*(Z+1),oe=f+(ee+1)+N*Z;c.push(ce,W,oe),c.push(W,Y,oe),q+=6}a.addGroup(d,q,y),d+=q,f+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ns(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Ft(s){const e={};for(let t=0;t<s.length;t++){const n=ns(s[t]);for(const i in n)e[i]=n[i]}return e}function Gf(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function bu(s){return s.getRenderTarget()===null?s.outputColorSpace:We.workingColorSpace}const kf={clone:ns,merge:Ft};var Vf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kt extends vn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vf,this.fragmentShader=Wf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ns(e.uniforms),this.uniformsGroups=Gf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Au extends ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _e,this.projectionMatrix=new _e,this.projectionMatrixInverse=new _e,this.coordinateSystem=Pn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ht extends Au{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ts*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Rs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(Rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Rs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,t-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ci=-90,Pi=1;class Xf extends ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ht(Ci,Pi,e,t);i.layers=this.layers,this.add(i);const r=new Ht(Ci,Pi,e,t);r.layers=this.layers,this.add(r);const o=new Ht(Ci,Pi,e,t);o.layers=this.layers,this.add(o);const a=new Ht(Ci,Pi,e,t);a.layers=this.layers,this.add(a);const c=new Ht(Ci,Pi,e,t);c.layers=this.layers,this.add(c);const l=new Ht(Ci,Pi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===Pn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===zr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class wu extends bt{constructor(e,t,n,i,r,o,a,c,l,u){e=e!==void 0?e:[],t=t!==void 0?t:$i,super(e,t,n,i,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class qf extends Zt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(Ps("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===di?ut:nn),this.texture=new wu(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:nt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Bs(5,5,5),r=new kt({name:"CubemapFromEquirect",uniforms:ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ot,blending:qn});r.uniforms.tEquirect.value=t;const o=new Et(i,r),a=t.minFilter;return t.minFilter===pi&&(t.minFilter=nt),new Xf(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const wo=new C,jf=new C,Yf=new De;class Cn{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=wo.subVectors(n,t).cross(jf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(wo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Yf.getNormalMatrix(e),i=this.coplanarPoint(wo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const si=new dn,ar=new C;class Ca{constructor(e=new Cn,t=new Cn,n=new Cn,i=new Cn,r=new Cn,o=new Cn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Pn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],u=i[5],h=i[6],f=i[7],d=i[8],g=i[9],_=i[10],m=i[11],p=i[12],x=i[13],v=i[14],M=i[15];if(n[0].setComponents(c-r,f-l,m-d,M-p).normalize(),n[1].setComponents(c+r,f+l,m+d,M+p).normalize(),n[2].setComponents(c+o,f+u,m+g,M+x).normalize(),n[3].setComponents(c-o,f-u,m-g,M-x).normalize(),n[4].setComponents(c-a,f-h,m-_,M-v).normalize(),t===Pn)n[5].setComponents(c+a,f+h,m+_,M+v).normalize();else if(t===zr)n[5].setComponents(a,h,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(si)}intersectsSprite(e){return si.center.set(0,0,0),si.radius=.7071067811865476,si.applyMatrix4(e.matrixWorld),this.intersectsSphere(si)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(ar.x=i.normal.x>0?e.max.x:e.min.x,ar.y=i.normal.y>0?e.max.y:e.min.y,ar.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ru(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Kf(s,e){const t=e.isWebGL2,n=new WeakMap;function i(l,u){const h=l.array,f=l.usage,d=h.byteLength,g=s.createBuffer();s.bindBuffer(u,g),s.bufferData(u,h,f),l.onUploadCallback();let _;if(h instanceof Float32Array)_=s.FLOAT;else if(h instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(t)_=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)_=s.SHORT;else if(h instanceof Uint32Array)_=s.UNSIGNED_INT;else if(h instanceof Int32Array)_=s.INT;else if(h instanceof Int8Array)_=s.BYTE;else if(h instanceof Uint8Array)_=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)_=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:g,type:_,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:d}}function r(l,u,h){const f=u.array,d=u._updateRange,g=u.updateRanges;if(s.bindBuffer(h,l),d.count===-1&&g.length===0&&s.bufferSubData(h,0,f),g.length!==0){for(let _=0,m=g.length;_<m;_++){const p=g[_];t?s.bufferSubData(h,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):s.bufferSubData(h,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}u.clearUpdateRanges()}d.count!==-1&&(t?s.bufferSubData(h,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):s.bufferSubData(h,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),u.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);u&&(s.deleteBuffer(u.buffer),n.delete(l))}function c(l,u){if(l.isGLBufferAttribute){const f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);if(h===void 0)n.set(l,i(l,u));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,l,u),h.version=l.version}}return{get:o,remove:a,update:c}}class Zn extends Lt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(i),l=a+1,u=c+1,h=e/a,f=t/c,d=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const x=p*f-o;for(let v=0;v<l;v++){const M=v*h-r;g.push(M,-x,0),_.push(0,0,1),m.push(v/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const v=x+l*p,M=x+l*(p+1),b=x+1+l*(p+1),S=x+1+l*p;d.push(v,M,S),d.push(M,b,S)}this.setIndex(d),this.setAttribute("position",new St(g,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zn(e.width,e.height,e.widthSegments,e.heightSegments)}}var $f=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Jf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ed=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,td=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,nd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,id=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sd=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,rd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,od=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ad=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ld=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ud=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,dd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,md=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,gd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_d=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,vd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,xd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,yd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Md=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Sd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Td=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ed=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ad="gl_FragColor = linearToOutputTexel( gl_FragColor );",wd=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Rd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Cd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Pd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ld=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Id=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ud=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Od=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,zd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Vd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Wd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Yd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Kd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,$d=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Zd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Jd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ep=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,np=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ip=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,op=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ap=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,up=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,hp=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,fp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,dp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,pp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,mp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_p=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,yp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Mp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Sp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ep=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ap=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Rp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Cp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Pp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Lp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Dp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ip=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Up=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Np=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Bp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Op=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,zp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Hp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Wp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Yp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Kp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$p=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,em=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,nm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,im=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,sm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,om=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,am=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,um=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,pm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,gm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,_m=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ym=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Em=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Am=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,wm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ne={alphahash_fragment:$f,alphahash_pars_fragment:Zf,alphamap_fragment:Jf,alphamap_pars_fragment:Qf,alphatest_fragment:ed,alphatest_pars_fragment:td,aomap_fragment:nd,aomap_pars_fragment:id,batching_pars_vertex:sd,batching_vertex:rd,begin_vertex:od,beginnormal_vertex:ad,bsdfs:cd,iridescence_fragment:ld,bumpmap_pars_fragment:ud,clipping_planes_fragment:hd,clipping_planes_pars_fragment:fd,clipping_planes_pars_vertex:dd,clipping_planes_vertex:pd,color_fragment:md,color_pars_fragment:gd,color_pars_vertex:_d,color_vertex:vd,common:xd,cube_uv_reflection_fragment:yd,defaultnormal_vertex:Md,displacementmap_pars_vertex:Sd,displacementmap_vertex:Td,emissivemap_fragment:Ed,emissivemap_pars_fragment:bd,colorspace_fragment:Ad,colorspace_pars_fragment:wd,envmap_fragment:Rd,envmap_common_pars_fragment:Cd,envmap_pars_fragment:Pd,envmap_pars_vertex:Ld,envmap_physical_pars_fragment:Vd,envmap_vertex:Dd,fog_vertex:Id,fog_pars_vertex:Ud,fog_fragment:Nd,fog_pars_fragment:Fd,gradientmap_pars_fragment:Bd,lightmap_fragment:Od,lightmap_pars_fragment:zd,lights_lambert_fragment:Hd,lights_lambert_pars_fragment:Gd,lights_pars_begin:kd,lights_toon_fragment:Wd,lights_toon_pars_fragment:Xd,lights_phong_fragment:qd,lights_phong_pars_fragment:jd,lights_physical_fragment:Yd,lights_physical_pars_fragment:Kd,lights_fragment_begin:$d,lights_fragment_maps:Zd,lights_fragment_end:Jd,logdepthbuf_fragment:Qd,logdepthbuf_pars_fragment:ep,logdepthbuf_pars_vertex:tp,logdepthbuf_vertex:np,map_fragment:ip,map_pars_fragment:sp,map_particle_fragment:rp,map_particle_pars_fragment:op,metalnessmap_fragment:ap,metalnessmap_pars_fragment:cp,morphcolor_vertex:lp,morphnormal_vertex:up,morphtarget_pars_vertex:hp,morphtarget_vertex:fp,normal_fragment_begin:dp,normal_fragment_maps:pp,normal_pars_fragment:mp,normal_pars_vertex:gp,normal_vertex:_p,normalmap_pars_fragment:vp,clearcoat_normal_fragment_begin:xp,clearcoat_normal_fragment_maps:yp,clearcoat_pars_fragment:Mp,iridescence_pars_fragment:Sp,opaque_fragment:Tp,packing:Ep,premultiplied_alpha_fragment:bp,project_vertex:Ap,dithering_fragment:wp,dithering_pars_fragment:Rp,roughnessmap_fragment:Cp,roughnessmap_pars_fragment:Pp,shadowmap_pars_fragment:Lp,shadowmap_pars_vertex:Dp,shadowmap_vertex:Ip,shadowmask_pars_fragment:Up,skinbase_vertex:Np,skinning_pars_vertex:Fp,skinning_vertex:Bp,skinnormal_vertex:Op,specularmap_fragment:zp,specularmap_pars_fragment:Hp,tonemapping_fragment:Gp,tonemapping_pars_fragment:kp,transmission_fragment:Vp,transmission_pars_fragment:Wp,uv_pars_fragment:Xp,uv_pars_vertex:qp,uv_vertex:jp,worldpos_vertex:Yp,background_vert:Kp,background_frag:$p,backgroundCube_vert:Zp,backgroundCube_frag:Jp,cube_vert:Qp,cube_frag:em,depth_vert:tm,depth_frag:nm,distanceRGBA_vert:im,distanceRGBA_frag:sm,equirect_vert:rm,equirect_frag:om,linedashed_vert:am,linedashed_frag:cm,meshbasic_vert:lm,meshbasic_frag:um,meshlambert_vert:hm,meshlambert_frag:fm,meshmatcap_vert:dm,meshmatcap_frag:pm,meshnormal_vert:mm,meshnormal_frag:gm,meshphong_vert:_m,meshphong_frag:vm,meshphysical_vert:xm,meshphysical_frag:ym,meshtoon_vert:Mm,meshtoon_frag:Sm,points_vert:Tm,points_frag:Em,shadow_vert:bm,shadow_frag:Am,sprite_vert:wm,sprite_frag:Rm},ne={common:{diffuse:{value:new he(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new he(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new he(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new he(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},mn={basic:{uniforms:Ft([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:Ft([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new he(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:Ft([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new he(0)},specular:{value:new he(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:Ft([ne.common,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.roughnessmap,ne.metalnessmap,ne.fog,ne.lights,{emissive:{value:new he(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:Ft([ne.common,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.gradientmap,ne.fog,ne.lights,{emissive:{value:new he(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:Ft([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:Ft([ne.points,ne.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:Ft([ne.common,ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:Ft([ne.common,ne.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:Ft([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:Ft([ne.sprite,ne.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:Ft([ne.common,ne.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:Ft([ne.lights,ne.fog,{color:{value:new he(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};mn.physical={uniforms:Ft([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new he(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new he(0)},specularColor:{value:new he(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const cr={r:0,b:0,g:0};function Cm(s,e,t,n,i,r,o){const a=new he(0);let c=r===!0?0:1,l,u,h=null,f=0,d=null;function g(m,p){let x=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?t:e).get(v)),v===null?_(a,c):v&&v.isColor&&(_(v,1),x=!0);const M=s.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Vr)?(u===void 0&&(u=new Et(new Bs(1,1,1),new kt({name:"BackgroundCubeMaterial",uniforms:ns(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:Ot,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(b,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=v,u.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,u.material.toneMapped=We.getTransfer(v.colorSpace)!==et,(h!==v||f!==v.version||d!==s.toneMapping)&&(u.material.needsUpdate=!0,h=v,f=v.version,d=s.toneMapping),u.layers.enableAll(),m.unshift(u,u.geometry,u.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Et(new Zn(2,2),new kt({name:"BackgroundMaterial",uniforms:ns(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=We.getTransfer(v.colorSpace)!==et,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||f!==v.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=v,f=v.version,d=s.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function _(m,p){m.getRGB(cr,bu(s)),n.buffers.color.setClear(cr.r,cr.g,cr.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),c=p,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(a,c)},render:g}}function Pm(s,e,t,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let l=c,u=!1;function h(P,N,H,j,q){let X=!1;if(o){const Z=_(j,H,N);l!==Z&&(l=Z,d(l.object)),X=p(P,j,H,q),X&&x(P,j,H,q)}else{const Z=N.wireframe===!0;(l.geometry!==j.id||l.program!==H.id||l.wireframe!==Z)&&(l.geometry=j.id,l.program=H.id,l.wireframe=Z,X=!0)}q!==null&&t.update(q,s.ELEMENT_ARRAY_BUFFER),(X||u)&&(u=!1,L(P,N,H,j),q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function f(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function d(P){return n.isWebGL2?s.bindVertexArray(P):r.bindVertexArrayOES(P)}function g(P){return n.isWebGL2?s.deleteVertexArray(P):r.deleteVertexArrayOES(P)}function _(P,N,H){const j=H.wireframe===!0;let q=a[P.id];q===void 0&&(q={},a[P.id]=q);let X=q[N.id];X===void 0&&(X={},q[N.id]=X);let Z=X[j];return Z===void 0&&(Z=m(f()),X[j]=Z),Z}function m(P){const N=[],H=[],j=[];for(let q=0;q<i;q++)N[q]=0,H[q]=0,j[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:H,attributeDivisors:j,object:P,attributes:{},index:null}}function p(P,N,H,j){const q=l.attributes,X=N.attributes;let Z=0;const ee=H.getAttributes();for(const ce in ee)if(ee[ce].location>=0){const Y=q[ce];let oe=X[ce];if(oe===void 0&&(ce==="instanceMatrix"&&P.instanceMatrix&&(oe=P.instanceMatrix),ce==="instanceColor"&&P.instanceColor&&(oe=P.instanceColor)),Y===void 0||Y.attribute!==oe||oe&&Y.data!==oe.data)return!0;Z++}return l.attributesNum!==Z||l.index!==j}function x(P,N,H,j){const q={},X=N.attributes;let Z=0;const ee=H.getAttributes();for(const ce in ee)if(ee[ce].location>=0){let Y=X[ce];Y===void 0&&(ce==="instanceMatrix"&&P.instanceMatrix&&(Y=P.instanceMatrix),ce==="instanceColor"&&P.instanceColor&&(Y=P.instanceColor));const oe={};oe.attribute=Y,Y&&Y.data&&(oe.data=Y.data),q[ce]=oe,Z++}l.attributes=q,l.attributesNum=Z,l.index=j}function v(){const P=l.newAttributes;for(let N=0,H=P.length;N<H;N++)P[N]=0}function M(P){b(P,0)}function b(P,N){const H=l.newAttributes,j=l.enabledAttributes,q=l.attributeDivisors;H[P]=1,j[P]===0&&(s.enableVertexAttribArray(P),j[P]=1),q[P]!==N&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,N),q[P]=N)}function S(){const P=l.newAttributes,N=l.enabledAttributes;for(let H=0,j=N.length;H<j;H++)N[H]!==P[H]&&(s.disableVertexAttribArray(H),N[H]=0)}function E(P,N,H,j,q,X,Z){Z===!0?s.vertexAttribIPointer(P,N,H,q,X):s.vertexAttribPointer(P,N,H,j,q,X)}function L(P,N,H,j){if(n.isWebGL2===!1&&(P.isInstancedMesh||j.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const q=j.attributes,X=H.getAttributes(),Z=N.defaultAttributeValues;for(const ee in X){const ce=X[ee];if(ce.location>=0){let W=q[ee];if(W===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(W=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(W=P.instanceColor)),W!==void 0){const Y=W.normalized,oe=W.itemSize,ge=t.get(W);if(ge===void 0)continue;const me=ge.buffer,Pe=ge.type,Ie=ge.bytesPerElement,Ee=n.isWebGL2===!0&&(Pe===s.INT||Pe===s.UNSIGNED_INT||W.gpuType===ws);if(W.isInterleavedBufferAttribute){const Ve=W.data,O=Ve.stride,Dt=W.offset;if(Ve.isInstancedInterleavedBuffer){for(let ye=0;ye<ce.locationSize;ye++)b(ce.location+ye,Ve.meshPerAttribute);P.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=Ve.meshPerAttribute*Ve.count)}else for(let ye=0;ye<ce.locationSize;ye++)M(ce.location+ye);s.bindBuffer(s.ARRAY_BUFFER,me);for(let ye=0;ye<ce.locationSize;ye++)E(ce.location+ye,oe/ce.locationSize,Pe,Y,O*Ie,(Dt+oe/ce.locationSize*ye)*Ie,Ee)}else{if(W.isInstancedBufferAttribute){for(let Ve=0;Ve<ce.locationSize;Ve++)b(ce.location+Ve,W.meshPerAttribute);P.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let Ve=0;Ve<ce.locationSize;Ve++)M(ce.location+Ve);s.bindBuffer(s.ARRAY_BUFFER,me);for(let Ve=0;Ve<ce.locationSize;Ve++)E(ce.location+Ve,oe/ce.locationSize,Pe,Y,oe*Ie,oe/ce.locationSize*Ve*Ie,Ee)}}else if(Z!==void 0){const Y=Z[ee];if(Y!==void 0)switch(Y.length){case 2:s.vertexAttrib2fv(ce.location,Y);break;case 3:s.vertexAttrib3fv(ce.location,Y);break;case 4:s.vertexAttrib4fv(ce.location,Y);break;default:s.vertexAttrib1fv(ce.location,Y)}}}}S()}function y(){I();for(const P in a){const N=a[P];for(const H in N){const j=N[H];for(const q in j)g(j[q].object),delete j[q];delete N[H]}delete a[P]}}function T(P){if(a[P.id]===void 0)return;const N=a[P.id];for(const H in N){const j=N[H];for(const q in j)g(j[q].object),delete j[q];delete N[H]}delete a[P.id]}function D(P){for(const N in a){const H=a[N];if(H[P.id]===void 0)continue;const j=H[P.id];for(const q in j)g(j[q].object),delete j[q];delete H[P.id]}}function I(){B(),u=!0,l!==c&&(l=c,d(l.object))}function B(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:h,reset:I,resetDefaultState:B,dispose:y,releaseStatesOfGeometry:T,releaseStatesOfProgram:D,initAttributes:v,enableAttribute:M,disableUnusedAttributes:S}}function Lm(s,e,t,n){const i=n.isWebGL2;let r;function o(u){r=u}function a(u,h){s.drawArrays(r,u,h),t.update(h,r,1)}function c(u,h,f){if(f===0)return;let d,g;if(i)d=s,g="drawArraysInstanced";else if(d=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](r,u,h,f),t.update(h,r,f)}function l(u,h,f){if(f===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(u[g],h[g]);else{d.multiDrawArraysWEBGL(r,u,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=h[_];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function Dm(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,h=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),v=f>0,M=o||e.has("OES_texture_float"),b=v&&M,S=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:x,vertexTextures:v,floatFragmentTextures:M,floatVertexTextures:b,maxSamples:S}}function Im(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new Cn,a=new De,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const d=h.length!==0||f||n!==0||i;return i=f,n=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=s.get(h);if(!i||g===null||g.length===0||r&&!m)r?u(null):l();else{const x=r?0:n,v=x*4;let M=p.clippingState||null;c.value=M,M=u(g,f,v,d);for(let b=0;b!==v;++b)M[b]=t[b];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,d,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=d+_*4,x=f.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,M=d;v!==_;++v,M+=4)o.copy(h[v]).applyMatrix4(x,a),o.normal.toArray(m,M),m[M+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Um(s){let e=new WeakMap;function t(o,a){return a===na?o.mapping=$i:a===ia&&(o.mapping=Zi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===na||a===ia)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new qf(c.height/2);return l.fromEquirectangularTexture(s,o),e.set(o,l),o.addEventListener("dispose",i),t(l.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Jn extends Au{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Wi=4,jc=[.125,.215,.35,.446,.526,.582],ci=20,Ro=new Jn,Yc=new he;let Co=null,Po=0,Lo=0;const oi=(1+Math.sqrt(5))/2,Li=1/oi,Kc=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,oi,Li),new C(0,oi,-Li),new C(Li,0,oi),new C(-Li,0,oi),new C(oi,Li,0),new C(-oi,Li,0)];class $c{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Co=this._renderer.getRenderTarget(),Po=this._renderer.getActiveCubeFace(),Lo=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Co,Po,Lo),e.scissorTest=!1,lr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$i||e.mapping===Zi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Co=this._renderer.getRenderTarget(),Po=this._renderer.getActiveCubeFace(),Lo=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:nt,minFilter:nt,generateMipmaps:!1,type:Kt,format:ht,colorSpace:Tt,depthBuffer:!1},i=Zc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Nm(r)),this._blurMaterial=Fm(r,e,t)}return i}_compileMaterial(e){const t=new Et(this._lodPlanes[0],e);this._renderer.compile(t,Ro)}_sceneToCubeUV(e,t,n,i){const a=new Ht(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(Yc),u.toneMapping=jn,u.autoClear=!1;const d=new li({name:"PMREM.Background",side:Ot,depthWrite:!1,depthTest:!1}),g=new Et(new Bs,d);let _=!1;const m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,_=!0):(d.color.copy(Yc),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):x===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const v=this._cubeSize;lr(i,x*v,p>2?v:0,v,v),u.setRenderTarget(i),_&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===$i||e.mapping===Zi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jc());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new Et(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;lr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Ro)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=Kc[(i-1)%Kc.length];this._blur(e,i-1,i,r,o)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Et(this._lodPlanes[i],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*ci-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):ci;m>ci&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ci}`);const p=[];let x=0;for(let E=0;E<ci;++E){const L=E/_,y=Math.exp(-L*L/2);p.push(y),E===0?x+=y:E<m&&(x+=2*y)}for(let E=0;E<p.length;E++)p[E]=p[E]/x;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;const M=this._sizeLods[i],b=3*M*(i>v-Wi?i-v+Wi:0),S=4*(this._cubeSize-M);lr(t,b,S,3*M,2*M),c.setRenderTarget(t),c.render(h,Ro)}}function Nm(s){const e=[],t=[],n=[];let i=s;const r=s-Wi+1+jc.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let c=1/a;o>s-Wi?c=jc[o-s+Wi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,h=1+l,f=[u,u,h,u,h,h,u,u,h,h,u,h],d=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*d),v=new Float32Array(m*g*d),M=new Float32Array(p*g*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,L=S>2?0:-1,y=[E,L,0,E+2/3,L,0,E+2/3,L+1,0,E,L,0,E+2/3,L+1,0,E,L+1,0];x.set(y,_*g*S),v.set(f,m*g*S);const T=[S,S,S,S,S,S];M.set(T,p*g*S)}const b=new Lt;b.setAttribute("position",new it(x,_)),b.setAttribute("uv",new it(v,m)),b.setAttribute("faceIndex",new it(M,p)),e.push(b),i>Wi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Zc(s,e,t){const n=new Zt(s,e,t);return n.texture.mapping=Vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function lr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Fm(s,e,t){const n=new Float32Array(ci),i=new C(0,1,0);return new kt({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Jc(){return new kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Qc(){return new kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Pa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Bm(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===na||c===ia,u=c===$i||c===Zi;if(l||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=e.get(a);return t===null&&(t=new $c(s)),h=l?t.fromEquirectangular(a,h):t.fromCubemap(a,h),e.set(a,h),h.texture}else{if(e.has(a))return e.get(a).texture;{const h=a.image;if(l&&h&&h.height>0||u&&h&&i(h)){t===null&&(t=new $c(s));const f=l?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function i(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Om(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function zm(s,e,t,n){const i={},r=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)e.remove(_[m])}f.removeEventListener("dispose",o),delete i[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,t.memory.geometries++),f}function c(h){const f=h.attributes;for(const g in f)e.update(f[g],s.ARRAY_BUFFER);const d=h.morphAttributes;for(const g in d){const _=d[g];for(let m=0,p=_.length;m<p;m++)e.update(_[m],s.ARRAY_BUFFER)}}function l(h){const f=[],d=h.index,g=h.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let v=0,M=x.length;v<M;v+=3){const b=x[v+0],S=x[v+1],E=x[v+2];f.push(b,S,S,E,E,b)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,M=x.length/3-1;v<M;v+=3){const b=v+0,S=v+1,E=v+2;f.push(b,S,S,E,E,b)}}else return;const m=new(_u(f)?Eu:Tu)(f,1);m.version=_;const p=r.get(h);p&&e.remove(p),r.set(h,m)}function u(h){const f=r.get(h);if(f){const d=h.index;d!==null&&f.version<d.version&&l(h)}else l(h);return r.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function Hm(s,e,t,n){const i=n.isWebGL2;let r;function o(d){r=d}let a,c;function l(d){a=d.type,c=d.bytesPerElement}function u(d,g){s.drawElements(r,g,a,d*c),t.update(g,r,1)}function h(d,g,_){if(_===0)return;let m,p;if(i)m=s,p="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,d*c,_),t.update(g,r,_)}function f(d,g,_){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(d[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,d,0,_);let p=0;for(let x=0;x<_;x++)p+=g[x];t.update(p,r,1)}}this.setMode=o,this.setIndex=l,this.render=u,this.renderInstances=h,this.renderMultiDraw=f}function Gm(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function km(s,e){return s[0]-e[0]}function Vm(s,e){return Math.abs(e[1])-Math.abs(s[1])}function Wm(s,e,t){const n={},i=new Float32Array(8),r=new WeakMap,o=new $e,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,u,h){const f=l.morphTargetInfluences;if(e.isWebGL2===!0){const d=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=d!==void 0?d.length:0;let _=r.get(u);if(_===void 0||_.count!==g){let P=function(){I.dispose(),r.delete(u),u.removeEventListener("dispose",P)};_!==void 0&&_.texture.dispose();const x=u.morphAttributes.position!==void 0,v=u.morphAttributes.normal!==void 0,M=u.morphAttributes.color!==void 0,b=u.morphAttributes.position||[],S=u.morphAttributes.normal||[],E=u.morphAttributes.color||[];let L=0;x===!0&&(L=1),v===!0&&(L=2),M===!0&&(L=3);let y=u.attributes.position.count*L,T=1;y>e.maxTextureSize&&(T=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const D=new Float32Array(y*T*4*g),I=new yu(D,y,T,g);I.type=Pt,I.needsUpdate=!0;const B=L*4;for(let N=0;N<g;N++){const H=b[N],j=S[N],q=E[N],X=y*T*4*N;for(let Z=0;Z<H.count;Z++){const ee=Z*B;x===!0&&(o.fromBufferAttribute(H,Z),D[X+ee+0]=o.x,D[X+ee+1]=o.y,D[X+ee+2]=o.z,D[X+ee+3]=0),v===!0&&(o.fromBufferAttribute(j,Z),D[X+ee+4]=o.x,D[X+ee+5]=o.y,D[X+ee+6]=o.z,D[X+ee+7]=0),M===!0&&(o.fromBufferAttribute(q,Z),D[X+ee+8]=o.x,D[X+ee+9]=o.y,D[X+ee+10]=o.z,D[X+ee+11]=q.itemSize===4?o.w:1)}}_={count:g,texture:I,size:new xe(y,T)},r.set(u,_),u.addEventListener("dispose",P)}let m=0;for(let x=0;x<f.length;x++)m+=f[x];const p=u.morphTargetsRelative?1:1-m;h.getUniforms().setValue(s,"morphTargetBaseInfluence",p),h.getUniforms().setValue(s,"morphTargetInfluences",f),h.getUniforms().setValue(s,"morphTargetsTexture",_.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",_.size)}else{const d=f===void 0?0:f.length;let g=n[u.id];if(g===void 0||g.length!==d){g=[];for(let v=0;v<d;v++)g[v]=[v,0];n[u.id]=g}for(let v=0;v<d;v++){const M=g[v];M[0]=v,M[1]=f[v]}g.sort(Vm);for(let v=0;v<8;v++)v<d&&g[v][1]?(a[v][0]=g[v][0],a[v][1]=g[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(km);const _=u.morphAttributes.position,m=u.morphAttributes.normal;let p=0;for(let v=0;v<8;v++){const M=a[v],b=M[0],S=M[1];b!==Number.MAX_SAFE_INTEGER&&S?(_&&u.getAttribute("morphTarget"+v)!==_[b]&&u.setAttribute("morphTarget"+v,_[b]),m&&u.getAttribute("morphNormal"+v)!==m[b]&&u.setAttribute("morphNormal"+v,m[b]),i[v]=S,p+=S):(_&&u.hasAttribute("morphTarget"+v)===!0&&u.deleteAttribute("morphTarget"+v),m&&u.hasAttribute("morphNormal"+v)===!0&&u.deleteAttribute("morphNormal"+v),i[v]=0)}const x=u.morphTargetsRelative?1:1-p;h.getUniforms().setValue(s,"morphTargetBaseInfluence",x),h.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:c}}function Xm(s,e,t,n){let i=new WeakMap;function r(c){const l=n.render.frame,u=c.geometry,h=e.get(c,u);if(i.get(h)!==l&&(e.update(h),i.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return h}function o(){i=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}class Cu extends bt{constructor(e,t,n,i,r,o,a,c,l,u){if(u=u!==void 0?u:fi,u!==fi&&u!==Qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===fi&&(n=qt),n===void 0&&u===Qi&&(n=hi),super(null,i,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Ke,this.minFilter=c!==void 0?c:Ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Pu=new bt,Lu=new Cu(1,1);Lu.compareFunction=gu;const Du=new yu,Iu=new Rf,Uu=new wu,el=[],tl=[],nl=new Float32Array(16),il=new Float32Array(9),sl=new Float32Array(4);function os(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=el[i];if(r===void 0&&(r=new Float32Array(i),el[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function mt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function gt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Kr(s,e){let t=tl[e];t===void 0&&(t=new Int32Array(e),tl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function qm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function jm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mt(t,e))return;s.uniform2fv(this.addr,e),gt(t,e)}}function Ym(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(mt(t,e))return;s.uniform3fv(this.addr,e),gt(t,e)}}function Km(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mt(t,e))return;s.uniform4fv(this.addr,e),gt(t,e)}}function $m(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(mt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),gt(t,e)}else{if(mt(t,n))return;sl.set(n),s.uniformMatrix2fv(this.addr,!1,sl),gt(t,n)}}function Zm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(mt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),gt(t,e)}else{if(mt(t,n))return;il.set(n),s.uniformMatrix3fv(this.addr,!1,il),gt(t,n)}}function Jm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(mt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),gt(t,e)}else{if(mt(t,n))return;nl.set(n),s.uniformMatrix4fv(this.addr,!1,nl),gt(t,n)}}function Qm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function eg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mt(t,e))return;s.uniform2iv(this.addr,e),gt(t,e)}}function tg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(mt(t,e))return;s.uniform3iv(this.addr,e),gt(t,e)}}function ng(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mt(t,e))return;s.uniform4iv(this.addr,e),gt(t,e)}}function ig(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function sg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mt(t,e))return;s.uniform2uiv(this.addr,e),gt(t,e)}}function rg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(mt(t,e))return;s.uniform3uiv(this.addr,e),gt(t,e)}}function og(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mt(t,e))return;s.uniform4uiv(this.addr,e),gt(t,e)}}function ag(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Lu:Pu;t.setTexture2D(e||r,i)}function cg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Iu,i)}function lg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Uu,i)}function ug(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Du,i)}function hg(s){switch(s){case 5126:return qm;case 35664:return jm;case 35665:return Ym;case 35666:return Km;case 35674:return $m;case 35675:return Zm;case 35676:return Jm;case 5124:case 35670:return Qm;case 35667:case 35671:return eg;case 35668:case 35672:return tg;case 35669:case 35673:return ng;case 5125:return ig;case 36294:return sg;case 36295:return rg;case 36296:return og;case 35678:case 36198:case 36298:case 36306:case 35682:return ag;case 35679:case 36299:case 36307:return cg;case 35680:case 36300:case 36308:case 36293:return lg;case 36289:case 36303:case 36311:case 36292:return ug}}function fg(s,e){s.uniform1fv(this.addr,e)}function dg(s,e){const t=os(e,this.size,2);s.uniform2fv(this.addr,t)}function pg(s,e){const t=os(e,this.size,3);s.uniform3fv(this.addr,t)}function mg(s,e){const t=os(e,this.size,4);s.uniform4fv(this.addr,t)}function gg(s,e){const t=os(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function _g(s,e){const t=os(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function vg(s,e){const t=os(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function xg(s,e){s.uniform1iv(this.addr,e)}function yg(s,e){s.uniform2iv(this.addr,e)}function Mg(s,e){s.uniform3iv(this.addr,e)}function Sg(s,e){s.uniform4iv(this.addr,e)}function Tg(s,e){s.uniform1uiv(this.addr,e)}function Eg(s,e){s.uniform2uiv(this.addr,e)}function bg(s,e){s.uniform3uiv(this.addr,e)}function Ag(s,e){s.uniform4uiv(this.addr,e)}function wg(s,e,t){const n=this.cache,i=e.length,r=Kr(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Pu,r[o])}function Rg(s,e,t){const n=this.cache,i=e.length,r=Kr(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Iu,r[o])}function Cg(s,e,t){const n=this.cache,i=e.length,r=Kr(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Uu,r[o])}function Pg(s,e,t){const n=this.cache,i=e.length,r=Kr(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Du,r[o])}function Lg(s){switch(s){case 5126:return fg;case 35664:return dg;case 35665:return pg;case 35666:return mg;case 35674:return gg;case 35675:return _g;case 35676:return vg;case 5124:case 35670:return xg;case 35667:case 35671:return yg;case 35668:case 35672:return Mg;case 35669:case 35673:return Sg;case 5125:return Tg;case 36294:return Eg;case 36295:return bg;case 36296:return Ag;case 35678:case 36198:case 36298:case 36306:case 35682:return wg;case 35679:case 36299:case 36307:return Rg;case 35680:case 36300:case 36308:case 36293:return Cg;case 36289:case 36303:case 36311:case 36292:return Pg}}class Dg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=hg(t.type)}}class Ig{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Lg(t.type)}}class Ug{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const Do=/(\w+)(\])?(\[|\.)?/g;function rl(s,e){s.seq.push(e),s.map[e.id]=e}function Ng(s,e,t){const n=s.name,i=n.length;for(Do.lastIndex=0;;){const r=Do.exec(n),o=Do.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){rl(t,l===void 0?new Dg(a,s,e):new Ig(a,s,e));break}else{let h=t.map[a];h===void 0&&(h=new Ug(a),rl(t,h)),t=h}}}class Dr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);Ng(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function ol(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Fg=37297;let Bg=0;function Og(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function zg(s){const e=We.getPrimaries(We.workingColorSpace),t=We.getPrimaries(s);let n;switch(e===t?n="":e===Or&&t===Br?n="LinearDisplayP3ToLinearSRGB":e===Br&&t===Or&&(n="LinearSRGBToLinearDisplayP3"),s){case Tt:case qr:return[n,"LinearTransferOETF"];case ut:case wa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function al(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Og(s.getShaderSource(e),o)}else return i}function Hg(s,e){const t=zg(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Gg(s,e){let t;switch(e){case Oh:t="Linear";break;case zh:t="Reinhard";break;case Hh:t="OptimizedCineon";break;case Gh:t="ACESFilmic";break;case Vh:t="AgX";break;case kh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function kg(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Xi).join(`
`)}function Vg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Xi).join(`
`)}function Wg(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Xg(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Xi(s){return s!==""}function cl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ll(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const qg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ua(s){return s.replace(qg,Yg)}const jg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Yg(s,e){let t=Ne[e];if(t===void 0){const n=jg.get(e);if(n!==void 0)t=Ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ua(t)}const Kg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(s){return s.replace(Kg,$g)}function $g(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function hl(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Zg(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===iu?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===fh?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===wn&&(e="SHADOWMAP_TYPE_VSM"),e}function Jg(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case $i:case Zi:e="ENVMAP_TYPE_CUBE";break;case Vr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Qg(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Zi:e="ENVMAP_MODE_REFRACTION";break}return e}function e_(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case su:e="ENVMAP_BLENDING_MULTIPLY";break;case Fh:e="ENVMAP_BLENDING_MIX";break;case Bh:e="ENVMAP_BLENDING_ADD";break}return e}function t_(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function n_(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=Zg(t),l=Jg(t),u=Qg(t),h=e_(t),f=t_(t),d=t.isWebGL2?"":kg(t),g=Vg(t),_=Wg(r),m=i.createProgram();let p,x,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Xi).join(`
`),p.length>0&&(p+=`
`),x=[d,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Xi).join(`
`),x.length>0&&(x+=`
`)):(p=[hl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xi).join(`
`),x=[d,hl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==jn?"#define TONE_MAPPING":"",t.toneMapping!==jn?Ne.tonemapping_pars_fragment:"",t.toneMapping!==jn?Gg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,Hg("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xi).join(`
`)),o=ua(o),o=cl(o,t),o=ll(o,t),a=ua(a),a=cl(a,t),a=ll(a,t),o=ul(o),a=ul(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,x=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Dn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Dn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const M=v+p+o,b=v+x+a,S=ol(i,i.VERTEX_SHADER,M),E=ol(i,i.FRAGMENT_SHADER,b);i.attachShader(m,S),i.attachShader(m,E),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function L(I){if(s.debug.checkShaderErrors){const B=i.getProgramInfoLog(m).trim(),P=i.getShaderInfoLog(S).trim(),N=i.getShaderInfoLog(E).trim();let H=!0,j=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,S,E);else{const q=al(i,S,"vertex"),X=al(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+B+`
`+q+`
`+X)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(P===""||N==="")&&(j=!1);j&&(I.diagnostics={runnable:H,programLog:B,vertexShader:{log:P,prefix:p},fragmentShader:{log:N,prefix:x}})}i.deleteShader(S),i.deleteShader(E),y=new Dr(i,m),T=Xg(i,m)}let y;this.getUniforms=function(){return y===void 0&&L(this),y};let T;this.getAttributes=function(){return T===void 0&&L(this),T};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(m,Fg)),D},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Bg++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=E,this}let i_=0;class s_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new r_(e),t.set(e,n)),n}}class r_{constructor(e){this.id=i_++,this.code=e,this.usedTimes=0}}function o_(s,e,t,n,i,r,o){const a=new Mu,c=new s_,l=[],u=i.isWebGL2,h=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return y===0?"uv":`uv${y}`}function m(y,T,D,I,B){const P=I.fog,N=B.geometry,H=y.isMeshStandardMaterial?I.environment:null,j=(y.isMeshStandardMaterial?t:e).get(y.envMap||H),q=j&&j.mapping===Vr?j.image.height:null,X=g[y.type];y.precision!==null&&(d=i.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const Z=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ee=Z!==void 0?Z.length:0;let ce=0;N.morphAttributes.position!==void 0&&(ce=1),N.morphAttributes.normal!==void 0&&(ce=2),N.morphAttributes.color!==void 0&&(ce=3);let W,Y,oe,ge;if(X){const It=mn[X];W=It.vertexShader,Y=It.fragmentShader}else W=y.vertexShader,Y=y.fragmentShader,c.update(y),oe=c.getVertexShaderID(y),ge=c.getFragmentShaderID(y);const me=s.getRenderTarget(),Pe=B.isInstancedMesh===!0,Ie=B.isBatchedMesh===!0,Ee=!!y.map,Ve=!!y.matcap,O=!!j,Dt=!!y.aoMap,ye=!!y.lightMap,Re=!!y.bumpMap,fe=!!y.normalMap,st=!!y.displacementMap,Fe=!!y.emissiveMap,R=!!y.metalnessMap,A=!!y.roughnessMap,G=y.anisotropy>0,J=y.clearcoat>0,$=y.iridescence>0,Q=y.sheen>0,de=y.transmission>0,re=G&&!!y.anisotropyMap,le=J&&!!y.clearcoatMap,Te=J&&!!y.clearcoatNormalMap,Be=J&&!!y.clearcoatRoughnessMap,K=$&&!!y.iridescenceMap,je=$&&!!y.iridescenceThicknessMap,Ge=Q&&!!y.sheenColorMap,we=Q&&!!y.sheenRoughnessMap,ve=!!y.specularMap,ue=!!y.specularColorMap,Ue=!!y.specularIntensityMap,Xe=de&&!!y.transmissionMap,at=de&&!!y.thicknessMap,ze=!!y.gradientMap,te=!!y.alphaMap,U=y.alphaTest>0,ie=!!y.alphaHash,se=!!y.extensions,be=!!N.attributes.uv1,Me=!!N.attributes.uv2,Ze=!!N.attributes.uv3;let Je=jn;return y.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(Je=s.toneMapping),{isWebGL2:u,shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:W,fragmentShader:Y,defines:y.defines,customVertexShaderID:oe,customFragmentShaderID:ge,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Ie,instancing:Pe,instancingColor:Pe&&B.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:me===null?s.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:Tt,map:Ee,matcap:Ve,envMap:O,envMapMode:O&&j.mapping,envMapCubeUVHeight:q,aoMap:Dt,lightMap:ye,bumpMap:Re,normalMap:fe,displacementMap:f&&st,emissiveMap:Fe,normalMapObjectSpace:fe&&y.normalMapType===Qh,normalMapTangentSpace:fe&&y.normalMapType===mu,metalnessMap:R,roughnessMap:A,anisotropy:G,anisotropyMap:re,clearcoat:J,clearcoatMap:le,clearcoatNormalMap:Te,clearcoatRoughnessMap:Be,iridescence:$,iridescenceMap:K,iridescenceThicknessMap:je,sheen:Q,sheenColorMap:Ge,sheenRoughnessMap:we,specularMap:ve,specularColorMap:ue,specularIntensityMap:Ue,transmission:de,transmissionMap:Xe,thicknessMap:at,gradientMap:ze,opaque:y.transparent===!1&&y.blending===ji,alphaMap:te,alphaTest:U,alphaHash:ie,combine:y.combine,mapUv:Ee&&_(y.map.channel),aoMapUv:Dt&&_(y.aoMap.channel),lightMapUv:ye&&_(y.lightMap.channel),bumpMapUv:Re&&_(y.bumpMap.channel),normalMapUv:fe&&_(y.normalMap.channel),displacementMapUv:st&&_(y.displacementMap.channel),emissiveMapUv:Fe&&_(y.emissiveMap.channel),metalnessMapUv:R&&_(y.metalnessMap.channel),roughnessMapUv:A&&_(y.roughnessMap.channel),anisotropyMapUv:re&&_(y.anisotropyMap.channel),clearcoatMapUv:le&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Te&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Be&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:je&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ge&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:we&&_(y.sheenRoughnessMap.channel),specularMapUv:ve&&_(y.specularMap.channel),specularColorMapUv:ue&&_(y.specularColorMap.channel),specularIntensityMapUv:Ue&&_(y.specularIntensityMap.channel),transmissionMapUv:Xe&&_(y.transmissionMap.channel),thicknessMapUv:at&&_(y.thicknessMap.channel),alphaMapUv:te&&_(y.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(fe||G),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,vertexUv1s:be,vertexUv2s:Me,vertexUv3s:Ze,pointsUvs:B.isPoints===!0&&!!N.attributes.uv&&(Ee||te),fog:!!P,useFog:y.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:B.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:ce,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:Je,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Ee&&y.map.isVideoTexture===!0&&We.getTransfer(y.map.colorSpace)===et,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===un,flipSided:y.side===Ot,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:se&&y.extensions.derivatives===!0,extensionFragDepth:se&&y.extensions.fragDepth===!0,extensionDrawBuffers:se&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:se&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:se&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function p(y){const T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(const D in y.defines)T.push(D),T.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(x(T,y),v(T,y),T.push(s.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function x(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function v(y,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),T.alphaHash&&a.enable(18),T.batching&&a.enable(19),y.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function M(y){const T=g[y.type];let D;if(T){const I=mn[T];D=kf.clone(I.uniforms)}else D=y.uniforms;return D}function b(y,T){let D;for(let I=0,B=l.length;I<B;I++){const P=l[I];if(P.cacheKey===T){D=P,++D.usedTimes;break}}return D===void 0&&(D=new n_(s,T,y,r),l.push(D)),D}function S(y){if(--y.usedTimes===0){const T=l.indexOf(y);l[T]=l[l.length-1],l.pop(),y.destroy()}}function E(y){c.remove(y)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:b,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:L}}function a_(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function c_(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function fl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function dl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(h,f,d,g,_,m){let p=s[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:d,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},s[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,f,d,g,_,m){const p=o(h,f,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):t.push(p)}function c(h,f,d,g,_,m){const p=o(h,f,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):t.unshift(p)}function l(h,f){t.length>1&&t.sort(h||c_),n.length>1&&n.sort(f||fl),i.length>1&&i.sort(f||fl)}function u(){for(let h=e,f=s.length;h<f;h++){const d=s[h];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:u,sort:l}}function l_(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new dl,s.set(n,[o])):i>=r.length?(o=new dl,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function u_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new he};break;case"SpotLight":t={position:new C,direction:new C,color:new he,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new he,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new he,groundColor:new he};break;case"RectAreaLight":t={color:new he,position:new C,halfWidth:new C,halfHeight:new C};break}return s[e.id]=t,t}}}function h_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let f_=0;function d_(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function p_(s,e){const t=new u_,n=h_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new C);const r=new C,o=new _e,a=new _e;function c(u,h){let f=0,d=0,g=0;for(let I=0;I<9;I++)i.probe[I].set(0,0,0);let _=0,m=0,p=0,x=0,v=0,M=0,b=0,S=0,E=0,L=0,y=0;u.sort(d_);const T=h===!0?Math.PI:1;for(let I=0,B=u.length;I<B;I++){const P=u[I],N=P.color,H=P.intensity,j=P.distance,q=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)f+=N.r*H*T,d+=N.g*H*T,g+=N.b*H*T;else if(P.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(P.sh.coefficients[X],H);y++}else if(P.isDirectionalLight){const X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity*T),P.castShadow){const Z=P.shadow,ee=n.get(P);ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,i.directionalShadow[_]=ee,i.directionalShadowMap[_]=q,i.directionalShadowMatrix[_]=P.shadow.matrix,M++}i.directional[_]=X,_++}else if(P.isSpotLight){const X=t.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(N).multiplyScalar(H*T),X.distance=j,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,i.spot[p]=X;const Z=P.shadow;if(P.map&&(i.spotLightMap[E]=P.map,E++,Z.updateMatrices(P),P.castShadow&&L++),i.spotLightMatrix[p]=Z.matrix,P.castShadow){const ee=n.get(P);ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,i.spotShadow[p]=ee,i.spotShadowMap[p]=q,S++}p++}else if(P.isRectAreaLight){const X=t.get(P);X.color.copy(N).multiplyScalar(H),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),i.rectArea[x]=X,x++}else if(P.isPointLight){const X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity*T),X.distance=P.distance,X.decay=P.decay,P.castShadow){const Z=P.shadow,ee=n.get(P);ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,ee.shadowCameraNear=Z.camera.near,ee.shadowCameraFar=Z.camera.far,i.pointShadow[m]=ee,i.pointShadowMap[m]=q,i.pointShadowMatrix[m]=P.shadow.matrix,b++}i.point[m]=X,m++}else if(P.isHemisphereLight){const X=t.get(P);X.skyColor.copy(P.color).multiplyScalar(H*T),X.groundColor.copy(P.groundColor).multiplyScalar(H*T),i.hemi[v]=X,v++}}x>0&&(e.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ne.LTC_FLOAT_1,i.rectAreaLTC2=ne.LTC_FLOAT_2):(i.rectAreaLTC1=ne.LTC_HALF_1,i.rectAreaLTC2=ne.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ne.LTC_FLOAT_1,i.rectAreaLTC2=ne.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ne.LTC_HALF_1,i.rectAreaLTC2=ne.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=d,i.ambient[2]=g;const D=i.hash;(D.directionalLength!==_||D.pointLength!==m||D.spotLength!==p||D.rectAreaLength!==x||D.hemiLength!==v||D.numDirectionalShadows!==M||D.numPointShadows!==b||D.numSpotShadows!==S||D.numSpotMaps!==E||D.numLightProbes!==y)&&(i.directional.length=_,i.spot.length=p,i.rectArea.length=x,i.point.length=m,i.hemi.length=v,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=S+E-L,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=y,D.directionalLength=_,D.pointLength=m,D.spotLength=p,D.rectAreaLength=x,D.hemiLength=v,D.numDirectionalShadows=M,D.numPointShadows=b,D.numSpotShadows=S,D.numSpotMaps=E,D.numLightProbes=y,i.version=f_++)}function l(u,h){let f=0,d=0,g=0,_=0,m=0;const p=h.matrixWorldInverse;for(let x=0,v=u.length;x<v;x++){const M=u[x];if(M.isDirectionalLight){const b=i.directional[f];b.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(p),f++}else if(M.isSpotLight){const b=i.spot[g];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const b=i.rectArea[_];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),a.identity(),o.copy(M.matrixWorld),o.premultiply(p),a.extractRotation(o),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const b=i.point[d];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){const b=i.hemi[m];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(p),m++}}}return{setup:c,setupView:l,state:i}}function pl(s,e){const t=new p_(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function o(h){n.push(h)}function a(h){i.push(h)}function c(h){t.setup(n,h)}function l(h){t.setupView(n,h)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function m_(s,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let c;return a===void 0?(c=new pl(s,e),t.set(r,[c])):o>=a.length?(c=new pl(s,e),a.push(c)):c=a[o],c}function i(){t=new WeakMap}return{get:n,dispose:i}}class g_ extends vn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class __ extends vn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const v_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,x_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function y_(s,e,t){let n=new Ca;const i=new xe,r=new xe,o=new $e,a=new g_({depthPacking:Jh}),c=new __,l={},u=t.maxTextureSize,h={[$t]:Ot,[Ot]:$t,[un]:un},f=new kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:v_,fragmentShader:x_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Lt;g.setAttribute("position",new it(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Et(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=iu;let p=this.type;this.render=function(S,E,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const y=s.getRenderTarget(),T=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),I=s.state;I.setBlending(qn),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const B=p!==wn&&this.type===wn,P=p===wn&&this.type!==wn;for(let N=0,H=S.length;N<H;N++){const j=S[N],q=j.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;i.copy(q.mapSize);const X=q.getFrameExtents();if(i.multiply(X),r.copy(q.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/X.x),i.x=r.x*X.x,q.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/X.y),i.y=r.y*X.y,q.mapSize.y=r.y)),q.map===null||B===!0||P===!0){const ee=this.type!==wn?{minFilter:Ke,magFilter:Ke}:{};q.map!==null&&q.map.dispose(),q.map=new Zt(i.x,i.y,ee),q.map.texture.name=j.name+".shadowMap",q.camera.updateProjectionMatrix()}s.setRenderTarget(q.map),s.clear();const Z=q.getViewportCount();for(let ee=0;ee<Z;ee++){const ce=q.getViewport(ee);o.set(r.x*ce.x,r.y*ce.y,r.x*ce.z,r.y*ce.w),I.viewport(o),q.updateMatrices(j,ee),n=q.getFrustum(),M(E,L,q.camera,j,this.type)}q.isPointLightShadow!==!0&&this.type===wn&&x(q,L),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(y,T,D)};function x(S,E){const L=e.update(_);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Zt(i.x,i.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(E,null,L,f,_,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(E,null,L,d,_,null)}function v(S,E,L,y){let T=null;const D=L.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(D!==void 0)T=D;else if(T=L.isPointLight===!0?c:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const I=T.uuid,B=E.uuid;let P=l[I];P===void 0&&(P={},l[I]=P);let N=P[B];N===void 0&&(N=T.clone(),P[B]=N,E.addEventListener("dispose",b)),T=N}if(T.visible=E.visible,T.wireframe=E.wireframe,y===wn?T.side=E.shadowSide!==null?E.shadowSide:E.side:T.side=E.shadowSide!==null?E.shadowSide:h[E.side],T.alphaMap=E.alphaMap,T.alphaTest=E.alphaTest,T.map=E.map,T.clipShadows=E.clipShadows,T.clippingPlanes=E.clippingPlanes,T.clipIntersection=E.clipIntersection,T.displacementMap=E.displacementMap,T.displacementScale=E.displacementScale,T.displacementBias=E.displacementBias,T.wireframeLinewidth=E.wireframeLinewidth,T.linewidth=E.linewidth,L.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const I=s.properties.get(T);I.light=L}return T}function M(S,E,L,y,T){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&T===wn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,S.matrixWorld);const B=e.update(S),P=S.material;if(Array.isArray(P)){const N=B.groups;for(let H=0,j=N.length;H<j;H++){const q=N[H],X=P[q.materialIndex];if(X&&X.visible){const Z=v(S,X,y,T);S.onBeforeShadow(s,S,E,L,B,Z,q),s.renderBufferDirect(L,null,B,Z,S,q),S.onAfterShadow(s,S,E,L,B,Z,q)}}}else if(P.visible){const N=v(S,P,y,T);S.onBeforeShadow(s,S,E,L,B,N,null),s.renderBufferDirect(L,null,B,N,S,null),S.onAfterShadow(s,S,E,L,B,N,null)}}const I=S.children;for(let B=0,P=I.length;B<P;B++)M(I[B],E,L,y,T)}function b(S){S.target.removeEventListener("dispose",b);for(const L in l){const y=l[L],T=S.target.uuid;T in y&&(y[T].dispose(),delete y[T])}}}function M_(s,e,t){const n=t.isWebGL2;function i(){let U=!1;const ie=new $e;let se=null;const be=new $e(0,0,0,0);return{setMask:function(Me){se!==Me&&!U&&(s.colorMask(Me,Me,Me,Me),se=Me)},setLocked:function(Me){U=Me},setClear:function(Me,Ze,Je,vt,It){It===!0&&(Me*=vt,Ze*=vt,Je*=vt),ie.set(Me,Ze,Je,vt),be.equals(ie)===!1&&(s.clearColor(Me,Ze,Je,vt),be.copy(ie))},reset:function(){U=!1,se=null,be.set(-1,0,0,0)}}}function r(){let U=!1,ie=null,se=null,be=null;return{setTest:function(Me){Me?Ie(s.DEPTH_TEST):Ee(s.DEPTH_TEST)},setMask:function(Me){ie!==Me&&!U&&(s.depthMask(Me),ie=Me)},setFunc:function(Me){if(se!==Me){switch(Me){case Ch:s.depthFunc(s.NEVER);break;case Ph:s.depthFunc(s.ALWAYS);break;case Lh:s.depthFunc(s.LESS);break;case Ur:s.depthFunc(s.LEQUAL);break;case Dh:s.depthFunc(s.EQUAL);break;case Ih:s.depthFunc(s.GEQUAL);break;case Uh:s.depthFunc(s.GREATER);break;case Nh:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}se=Me}},setLocked:function(Me){U=Me},setClear:function(Me){be!==Me&&(s.clearDepth(Me),be=Me)},reset:function(){U=!1,ie=null,se=null,be=null}}}function o(){let U=!1,ie=null,se=null,be=null,Me=null,Ze=null,Je=null,vt=null,It=null;return{setTest:function(Qe){U||(Qe?Ie(s.STENCIL_TEST):Ee(s.STENCIL_TEST))},setMask:function(Qe){ie!==Qe&&!U&&(s.stencilMask(Qe),ie=Qe)},setFunc:function(Qe,Ut,pn){(se!==Qe||be!==Ut||Me!==pn)&&(s.stencilFunc(Qe,Ut,pn),se=Qe,be=Ut,Me=pn)},setOp:function(Qe,Ut,pn){(Ze!==Qe||Je!==Ut||vt!==pn)&&(s.stencilOp(Qe,Ut,pn),Ze=Qe,Je=Ut,vt=pn)},setLocked:function(Qe){U=Qe},setClear:function(Qe){It!==Qe&&(s.clearStencil(Qe),It=Qe)},reset:function(){U=!1,ie=null,se=null,be=null,Me=null,Ze=null,Je=null,vt=null,It=null}}}const a=new i,c=new r,l=new o,u=new WeakMap,h=new WeakMap;let f={},d={},g=new WeakMap,_=[],m=null,p=!1,x=null,v=null,M=null,b=null,S=null,E=null,L=null,y=new he(0,0,0),T=0,D=!1,I=null,B=null,P=null,N=null,H=null;const j=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,X=0;const Z=s.getParameter(s.VERSION);Z.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(Z)[1]),q=X>=1):Z.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),q=X>=2);let ee=null,ce={};const W=s.getParameter(s.SCISSOR_BOX),Y=s.getParameter(s.VIEWPORT),oe=new $e().fromArray(W),ge=new $e().fromArray(Y);function me(U,ie,se,be){const Me=new Uint8Array(4),Ze=s.createTexture();s.bindTexture(U,Ze),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Je=0;Je<se;Je++)n&&(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)?s.texImage3D(ie,0,s.RGBA,1,1,be,0,s.RGBA,s.UNSIGNED_BYTE,Me):s.texImage2D(ie+Je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Me);return Ze}const Pe={};Pe[s.TEXTURE_2D]=me(s.TEXTURE_2D,s.TEXTURE_2D,1),Pe[s.TEXTURE_CUBE_MAP]=me(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Pe[s.TEXTURE_2D_ARRAY]=me(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Pe[s.TEXTURE_3D]=me(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Ie(s.DEPTH_TEST),c.setFunc(Ur),Fe(!1),R(Ya),Ie(s.CULL_FACE),fe(qn);function Ie(U){f[U]!==!0&&(s.enable(U),f[U]=!0)}function Ee(U){f[U]!==!1&&(s.disable(U),f[U]=!1)}function Ve(U,ie){return d[U]!==ie?(s.bindFramebuffer(U,ie),d[U]=ie,n&&(U===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ie),U===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ie)),!0):!1}function O(U,ie){let se=_,be=!1;if(U)if(se=g.get(ie),se===void 0&&(se=[],g.set(ie,se)),U.isWebGLMultipleRenderTargets){const Me=U.texture;if(se.length!==Me.length||se[0]!==s.COLOR_ATTACHMENT0){for(let Ze=0,Je=Me.length;Ze<Je;Ze++)se[Ze]=s.COLOR_ATTACHMENT0+Ze;se.length=Me.length,be=!0}}else se[0]!==s.COLOR_ATTACHMENT0&&(se[0]=s.COLOR_ATTACHMENT0,be=!0);else se[0]!==s.BACK&&(se[0]=s.BACK,be=!0);be&&(t.isWebGL2?s.drawBuffers(se):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(se))}function Dt(U){return m!==U?(s.useProgram(U),m=U,!0):!1}const ye={[ai]:s.FUNC_ADD,[ph]:s.FUNC_SUBTRACT,[mh]:s.FUNC_REVERSE_SUBTRACT};if(n)ye[Ja]=s.MIN,ye[Qa]=s.MAX;else{const U=e.get("EXT_blend_minmax");U!==null&&(ye[Ja]=U.MIN_EXT,ye[Qa]=U.MAX_EXT)}const Re={[gh]:s.ZERO,[_h]:s.ONE,[vh]:s.SRC_COLOR,[ea]:s.SRC_ALPHA,[Eh]:s.SRC_ALPHA_SATURATE,[Sh]:s.DST_COLOR,[yh]:s.DST_ALPHA,[xh]:s.ONE_MINUS_SRC_COLOR,[ta]:s.ONE_MINUS_SRC_ALPHA,[Th]:s.ONE_MINUS_DST_COLOR,[Mh]:s.ONE_MINUS_DST_ALPHA,[bh]:s.CONSTANT_COLOR,[Ah]:s.ONE_MINUS_CONSTANT_COLOR,[wh]:s.CONSTANT_ALPHA,[Rh]:s.ONE_MINUS_CONSTANT_ALPHA};function fe(U,ie,se,be,Me,Ze,Je,vt,It,Qe){if(U===qn){p===!0&&(Ee(s.BLEND),p=!1);return}if(p===!1&&(Ie(s.BLEND),p=!0),U!==dh){if(U!==x||Qe!==D){if((v!==ai||S!==ai)&&(s.blendEquation(s.FUNC_ADD),v=ai,S=ai),Qe)switch(U){case ji:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ka:s.blendFunc(s.ONE,s.ONE);break;case $a:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Za:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ji:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ka:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case $a:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Za:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}M=null,b=null,E=null,L=null,y.set(0,0,0),T=0,x=U,D=Qe}return}Me=Me||ie,Ze=Ze||se,Je=Je||be,(ie!==v||Me!==S)&&(s.blendEquationSeparate(ye[ie],ye[Me]),v=ie,S=Me),(se!==M||be!==b||Ze!==E||Je!==L)&&(s.blendFuncSeparate(Re[se],Re[be],Re[Ze],Re[Je]),M=se,b=be,E=Ze,L=Je),(vt.equals(y)===!1||It!==T)&&(s.blendColor(vt.r,vt.g,vt.b,It),y.copy(vt),T=It),x=U,D=!1}function st(U,ie){U.side===un?Ee(s.CULL_FACE):Ie(s.CULL_FACE);let se=U.side===Ot;ie&&(se=!se),Fe(se),U.blending===ji&&U.transparent===!1?fe(qn):fe(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),a.setMask(U.colorWrite);const be=U.stencilWrite;l.setTest(be),be&&(l.setMask(U.stencilWriteMask),l.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),l.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),G(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Ie(s.SAMPLE_ALPHA_TO_COVERAGE):Ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(U){I!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),I=U)}function R(U){U!==uh?(Ie(s.CULL_FACE),U!==B&&(U===Ya?s.cullFace(s.BACK):U===hh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ee(s.CULL_FACE),B=U}function A(U){U!==P&&(q&&s.lineWidth(U),P=U)}function G(U,ie,se){U?(Ie(s.POLYGON_OFFSET_FILL),(N!==ie||H!==se)&&(s.polygonOffset(ie,se),N=ie,H=se)):Ee(s.POLYGON_OFFSET_FILL)}function J(U){U?Ie(s.SCISSOR_TEST):Ee(s.SCISSOR_TEST)}function $(U){U===void 0&&(U=s.TEXTURE0+j-1),ee!==U&&(s.activeTexture(U),ee=U)}function Q(U,ie,se){se===void 0&&(ee===null?se=s.TEXTURE0+j-1:se=ee);let be=ce[se];be===void 0&&(be={type:void 0,texture:void 0},ce[se]=be),(be.type!==U||be.texture!==ie)&&(ee!==se&&(s.activeTexture(se),ee=se),s.bindTexture(U,ie||Pe[U]),be.type=U,be.texture=ie)}function de(){const U=ce[ee];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function re(){try{s.compressedTexImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function le(){try{s.compressedTexImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{s.texSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Be(){try{s.texSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function je(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ge(){try{s.texStorage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function we(){try{s.texStorage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ve(){try{s.texImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ue(){try{s.texImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ue(U){oe.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),oe.copy(U))}function Xe(U){ge.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),ge.copy(U))}function at(U,ie){let se=h.get(ie);se===void 0&&(se=new WeakMap,h.set(ie,se));let be=se.get(U);be===void 0&&(be=s.getUniformBlockIndex(ie,U.name),se.set(U,be))}function ze(U,ie){const be=h.get(ie).get(U);u.get(ie)!==be&&(s.uniformBlockBinding(ie,be,U.__bindingPointIndex),u.set(ie,be))}function te(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),f={},ee=null,ce={},d={},g=new WeakMap,_=[],m=null,p=!1,x=null,v=null,M=null,b=null,S=null,E=null,L=null,y=new he(0,0,0),T=0,D=!1,I=null,B=null,P=null,N=null,H=null,oe.set(0,0,s.canvas.width,s.canvas.height),ge.set(0,0,s.canvas.width,s.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Ie,disable:Ee,bindFramebuffer:Ve,drawBuffers:O,useProgram:Dt,setBlending:fe,setMaterial:st,setFlipSided:Fe,setCullFace:R,setLineWidth:A,setPolygonOffset:G,setScissorTest:J,activeTexture:$,bindTexture:Q,unbindTexture:de,compressedTexImage2D:re,compressedTexImage3D:le,texImage2D:ve,texImage3D:ue,updateUBOMapping:at,uniformBlockBinding:ze,texStorage2D:Ge,texStorage3D:we,texSubImage2D:Te,texSubImage3D:Be,compressedTexSubImage2D:K,compressedTexSubImage3D:je,scissor:Ue,viewport:Xe,reset:te}}function S_(s,e,t,n,i,r,o){const a=i.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let h;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,A){return d?new OffscreenCanvas(R,A):Ns("canvas")}function _(R,A,G,J){let $=1;if((R.width>J||R.height>J)&&($=J/Math.max(R.width,R.height)),$<1||A===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const Q=A?Hr:Math.floor,de=Q($*R.width),re=Q($*R.height);h===void 0&&(h=g(de,re));const le=G?g(de,re):h;return le.width=de,le.height=re,le.getContext("2d").drawImage(R,0,0,de,re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+de+"x"+re+")."),le}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function m(R){return la(R.width)&&la(R.height)}function p(R){return a?!1:R.wrapS!==tn||R.wrapT!==tn||R.minFilter!==Ke&&R.minFilter!==nt}function x(R,A){return R.generateMipmaps&&A&&R.minFilter!==Ke&&R.minFilter!==nt}function v(R){s.generateMipmap(R)}function M(R,A,G,J,$=!1){if(a===!1)return A;if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Q=A;if(A===s.RED&&(G===s.FLOAT&&(Q=s.R32F),G===s.HALF_FLOAT&&(Q=s.R16F),G===s.UNSIGNED_BYTE&&(Q=s.R8)),A===s.RED_INTEGER&&(G===s.UNSIGNED_BYTE&&(Q=s.R8UI),G===s.UNSIGNED_SHORT&&(Q=s.R16UI),G===s.UNSIGNED_INT&&(Q=s.R32UI),G===s.BYTE&&(Q=s.R8I),G===s.SHORT&&(Q=s.R16I),G===s.INT&&(Q=s.R32I)),A===s.RG&&(G===s.FLOAT&&(Q=s.RG32F),G===s.HALF_FLOAT&&(Q=s.RG16F),G===s.UNSIGNED_BYTE&&(Q=s.RG8)),A===s.RGBA){const de=$?Fr:We.getTransfer(J);G===s.FLOAT&&(Q=s.RGBA32F),G===s.HALF_FLOAT&&(Q=s.RGBA16F),G===s.UNSIGNED_BYTE&&(Q=de===et?s.SRGB8_ALPHA8:s.RGBA8),G===s.UNSIGNED_SHORT_4_4_4_4&&(Q=s.RGBA4),G===s.UNSIGNED_SHORT_5_5_5_1&&(Q=s.RGB5_A1)}return(Q===s.R16F||Q===s.R32F||Q===s.RG16F||Q===s.RG32F||Q===s.RGBA16F||Q===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function b(R,A,G){return x(R,G)===!0||R.isFramebufferTexture&&R.minFilter!==Ke&&R.minFilter!==nt?Math.log2(Math.max(A.width,A.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?A.mipmaps.length:1}function S(R){return R===Ke||R===sa||R===Lr?s.NEAREST:s.LINEAR}function E(R){const A=R.target;A.removeEventListener("dispose",E),y(A),A.isVideoTexture&&u.delete(A)}function L(R){const A=R.target;A.removeEventListener("dispose",L),D(A)}function y(R){const A=n.get(R);if(A.__webglInit===void 0)return;const G=R.source,J=f.get(G);if(J){const $=J[A.__cacheKey];$.usedTimes--,$.usedTimes===0&&T(R),Object.keys(J).length===0&&f.delete(G)}n.remove(R)}function T(R){const A=n.get(R);s.deleteTexture(A.__webglTexture);const G=R.source,J=f.get(G);delete J[A.__cacheKey],o.memory.textures--}function D(R){const A=R.texture,G=n.get(R),J=n.get(A);if(J.__webglTexture!==void 0&&(s.deleteTexture(J.__webglTexture),o.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(G.__webglFramebuffer[$]))for(let Q=0;Q<G.__webglFramebuffer[$].length;Q++)s.deleteFramebuffer(G.__webglFramebuffer[$][Q]);else s.deleteFramebuffer(G.__webglFramebuffer[$]);G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer[$])}else{if(Array.isArray(G.__webglFramebuffer))for(let $=0;$<G.__webglFramebuffer.length;$++)s.deleteFramebuffer(G.__webglFramebuffer[$]);else s.deleteFramebuffer(G.__webglFramebuffer);if(G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&s.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer)for(let $=0;$<G.__webglColorRenderbuffer.length;$++)G.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(G.__webglColorRenderbuffer[$]);G.__webglDepthRenderbuffer&&s.deleteRenderbuffer(G.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let $=0,Q=A.length;$<Q;$++){const de=n.get(A[$]);de.__webglTexture&&(s.deleteTexture(de.__webglTexture),o.memory.textures--),n.remove(A[$])}n.remove(A),n.remove(R)}let I=0;function B(){I=0}function P(){const R=I;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),I+=1,R}function N(R){const A=[];return A.push(R.wrapS),A.push(R.wrapT),A.push(R.wrapR||0),A.push(R.magFilter),A.push(R.minFilter),A.push(R.anisotropy),A.push(R.internalFormat),A.push(R.format),A.push(R.type),A.push(R.generateMipmaps),A.push(R.premultiplyAlpha),A.push(R.flipY),A.push(R.unpackAlignment),A.push(R.colorSpace),A.join()}function H(R,A){const G=n.get(R);if(R.isVideoTexture&&st(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){const J=R.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{oe(G,R,A);return}}t.bindTexture(s.TEXTURE_2D,G.__webglTexture,s.TEXTURE0+A)}function j(R,A){const G=n.get(R);if(R.version>0&&G.__version!==R.version){oe(G,R,A);return}t.bindTexture(s.TEXTURE_2D_ARRAY,G.__webglTexture,s.TEXTURE0+A)}function q(R,A){const G=n.get(R);if(R.version>0&&G.__version!==R.version){oe(G,R,A);return}t.bindTexture(s.TEXTURE_3D,G.__webglTexture,s.TEXTURE0+A)}function X(R,A){const G=n.get(R);if(R.version>0&&G.__version!==R.version){ge(G,R,A);return}t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture,s.TEXTURE0+A)}const Z={[Ji]:s.REPEAT,[tn]:s.CLAMP_TO_EDGE,[Nr]:s.MIRRORED_REPEAT},ee={[Ke]:s.NEAREST,[sa]:s.NEAREST_MIPMAP_NEAREST,[Lr]:s.NEAREST_MIPMAP_LINEAR,[nt]:s.LINEAR,[ou]:s.LINEAR_MIPMAP_NEAREST,[pi]:s.LINEAR_MIPMAP_LINEAR},ce={[ef]:s.NEVER,[af]:s.ALWAYS,[tf]:s.LESS,[gu]:s.LEQUAL,[nf]:s.EQUAL,[of]:s.GEQUAL,[sf]:s.GREATER,[rf]:s.NOTEQUAL};function W(R,A,G){if(G?(s.texParameteri(R,s.TEXTURE_WRAP_S,Z[A.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,Z[A.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,Z[A.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,ee[A.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,ee[A.minFilter])):(s.texParameteri(R,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(R,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(A.wrapS!==tn||A.wrapT!==tn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(R,s.TEXTURE_MAG_FILTER,S(A.magFilter)),s.texParameteri(R,s.TEXTURE_MIN_FILTER,S(A.minFilter)),A.minFilter!==Ke&&A.minFilter!==nt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),A.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,ce[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const J=e.get("EXT_texture_filter_anisotropic");if(A.magFilter===Ke||A.minFilter!==Lr&&A.minFilter!==pi||A.type===Pt&&e.has("OES_texture_float_linear")===!1||a===!1&&A.type===Kt&&e.has("OES_texture_half_float_linear")===!1)return;(A.anisotropy>1||n.get(A).__currentAnisotropy)&&(s.texParameterf(R,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,i.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy)}}function Y(R,A){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,A.addEventListener("dispose",E));const J=A.source;let $=f.get(J);$===void 0&&($={},f.set(J,$));const Q=N(A);if(Q!==R.__cacheKey){$[Q]===void 0&&($[Q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,G=!0),$[Q].usedTimes++;const de=$[R.__cacheKey];de!==void 0&&($[R.__cacheKey].usedTimes--,de.usedTimes===0&&T(A)),R.__cacheKey=Q,R.__webglTexture=$[Q].texture}return G}function oe(R,A,G){let J=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(J=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(J=s.TEXTURE_3D);const $=Y(R,A),Q=A.source;t.bindTexture(J,R.__webglTexture,s.TEXTURE0+G);const de=n.get(Q);if(Q.version!==de.__version||$===!0){t.activeTexture(s.TEXTURE0+G);const re=We.getPrimaries(We.workingColorSpace),le=A.colorSpace===nn?null:We.getPrimaries(A.colorSpace),Te=A.colorSpace===nn||re===le?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);const Be=p(A)&&m(A.image)===!1;let K=_(A.image,Be,!1,i.maxTextureSize);K=Fe(A,K);const je=m(K)||a,Ge=r.convert(A.format,A.colorSpace);let we=r.convert(A.type),ve=M(A.internalFormat,Ge,we,A.colorSpace,A.isVideoTexture);W(J,A,je);let ue;const Ue=A.mipmaps,Xe=a&&A.isVideoTexture!==!0&&ve!==fu,at=de.__version===void 0||$===!0,ze=b(A,K,je);if(A.isDepthTexture)ve=s.DEPTH_COMPONENT,a?A.type===Pt?ve=s.DEPTH_COMPONENT32F:A.type===qt?ve=s.DEPTH_COMPONENT24:A.type===hi?ve=s.DEPTH24_STENCIL8:ve=s.DEPTH_COMPONENT16:A.type===Pt&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),A.format===fi&&ve===s.DEPTH_COMPONENT&&A.type!==Wr&&A.type!==qt&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),A.type=qt,we=r.convert(A.type)),A.format===Qi&&ve===s.DEPTH_COMPONENT&&(ve=s.DEPTH_STENCIL,A.type!==hi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),A.type=hi,we=r.convert(A.type))),at&&(Xe?t.texStorage2D(s.TEXTURE_2D,1,ve,K.width,K.height):t.texImage2D(s.TEXTURE_2D,0,ve,K.width,K.height,0,Ge,we,null));else if(A.isDataTexture)if(Ue.length>0&&je){Xe&&at&&t.texStorage2D(s.TEXTURE_2D,ze,ve,Ue[0].width,Ue[0].height);for(let te=0,U=Ue.length;te<U;te++)ue=Ue[te],Xe?t.texSubImage2D(s.TEXTURE_2D,te,0,0,ue.width,ue.height,Ge,we,ue.data):t.texImage2D(s.TEXTURE_2D,te,ve,ue.width,ue.height,0,Ge,we,ue.data);A.generateMipmaps=!1}else Xe?(at&&t.texStorage2D(s.TEXTURE_2D,ze,ve,K.width,K.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,K.width,K.height,Ge,we,K.data)):t.texImage2D(s.TEXTURE_2D,0,ve,K.width,K.height,0,Ge,we,K.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Xe&&at&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ze,ve,Ue[0].width,Ue[0].height,K.depth);for(let te=0,U=Ue.length;te<U;te++)ue=Ue[te],A.format!==ht?Ge!==null?Xe?t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,K.depth,Ge,ue.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,te,ve,ue.width,ue.height,K.depth,0,ue.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?t.texSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,K.depth,Ge,we,ue.data):t.texImage3D(s.TEXTURE_2D_ARRAY,te,ve,ue.width,ue.height,K.depth,0,Ge,we,ue.data)}else{Xe&&at&&t.texStorage2D(s.TEXTURE_2D,ze,ve,Ue[0].width,Ue[0].height);for(let te=0,U=Ue.length;te<U;te++)ue=Ue[te],A.format!==ht?Ge!==null?Xe?t.compressedTexSubImage2D(s.TEXTURE_2D,te,0,0,ue.width,ue.height,Ge,ue.data):t.compressedTexImage2D(s.TEXTURE_2D,te,ve,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?t.texSubImage2D(s.TEXTURE_2D,te,0,0,ue.width,ue.height,Ge,we,ue.data):t.texImage2D(s.TEXTURE_2D,te,ve,ue.width,ue.height,0,Ge,we,ue.data)}else if(A.isDataArrayTexture)Xe?(at&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ze,ve,K.width,K.height,K.depth),t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Ge,we,K.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,ve,K.width,K.height,K.depth,0,Ge,we,K.data);else if(A.isData3DTexture)Xe?(at&&t.texStorage3D(s.TEXTURE_3D,ze,ve,K.width,K.height,K.depth),t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Ge,we,K.data)):t.texImage3D(s.TEXTURE_3D,0,ve,K.width,K.height,K.depth,0,Ge,we,K.data);else if(A.isFramebufferTexture){if(at)if(Xe)t.texStorage2D(s.TEXTURE_2D,ze,ve,K.width,K.height);else{let te=K.width,U=K.height;for(let ie=0;ie<ze;ie++)t.texImage2D(s.TEXTURE_2D,ie,ve,te,U,0,Ge,we,null),te>>=1,U>>=1}}else if(Ue.length>0&&je){Xe&&at&&t.texStorage2D(s.TEXTURE_2D,ze,ve,Ue[0].width,Ue[0].height);for(let te=0,U=Ue.length;te<U;te++)ue=Ue[te],Xe?t.texSubImage2D(s.TEXTURE_2D,te,0,0,Ge,we,ue):t.texImage2D(s.TEXTURE_2D,te,ve,Ge,we,ue);A.generateMipmaps=!1}else Xe?(at&&t.texStorage2D(s.TEXTURE_2D,ze,ve,K.width,K.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,Ge,we,K)):t.texImage2D(s.TEXTURE_2D,0,ve,Ge,we,K);x(A,je)&&v(J),de.__version=Q.version,A.onUpdate&&A.onUpdate(A)}R.__version=A.version}function ge(R,A,G){if(A.image.length!==6)return;const J=Y(R,A),$=A.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+G);const Q=n.get($);if($.version!==Q.__version||J===!0){t.activeTexture(s.TEXTURE0+G);const de=We.getPrimaries(We.workingColorSpace),re=A.colorSpace===nn?null:We.getPrimaries(A.colorSpace),le=A.colorSpace===nn||de===re?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);const Te=A.isCompressedTexture||A.image[0].isCompressedTexture,Be=A.image[0]&&A.image[0].isDataTexture,K=[];for(let te=0;te<6;te++)!Te&&!Be?K[te]=_(A.image[te],!1,!0,i.maxCubemapSize):K[te]=Be?A.image[te].image:A.image[te],K[te]=Fe(A,K[te]);const je=K[0],Ge=m(je)||a,we=r.convert(A.format,A.colorSpace),ve=r.convert(A.type),ue=M(A.internalFormat,we,ve,A.colorSpace),Ue=a&&A.isVideoTexture!==!0,Xe=Q.__version===void 0||J===!0;let at=b(A,je,Ge);W(s.TEXTURE_CUBE_MAP,A,Ge);let ze;if(Te){Ue&&Xe&&t.texStorage2D(s.TEXTURE_CUBE_MAP,at,ue,je.width,je.height);for(let te=0;te<6;te++){ze=K[te].mipmaps;for(let U=0;U<ze.length;U++){const ie=ze[U];A.format!==ht?we!==null?Ue?t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U,0,0,ie.width,ie.height,we,ie.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U,ue,ie.width,ie.height,0,ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U,0,0,ie.width,ie.height,we,ve,ie.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U,ue,ie.width,ie.height,0,we,ve,ie.data)}}}else{ze=A.mipmaps,Ue&&Xe&&(ze.length>0&&at++,t.texStorage2D(s.TEXTURE_CUBE_MAP,at,ue,K[0].width,K[0].height));for(let te=0;te<6;te++)if(Be){Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,K[te].width,K[te].height,we,ve,K[te].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,ue,K[te].width,K[te].height,0,we,ve,K[te].data);for(let U=0;U<ze.length;U++){const se=ze[U].image[te].image;Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U+1,0,0,se.width,se.height,we,ve,se.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U+1,ue,se.width,se.height,0,we,ve,se.data)}}else{Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,we,ve,K[te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,ue,we,ve,K[te]);for(let U=0;U<ze.length;U++){const ie=ze[U];Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U+1,0,0,we,ve,ie.image[te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,U+1,ue,we,ve,ie.image[te])}}}x(A,Ge)&&v(s.TEXTURE_CUBE_MAP),Q.__version=$.version,A.onUpdate&&A.onUpdate(A)}R.__version=A.version}function me(R,A,G,J,$,Q){const de=r.convert(G.format,G.colorSpace),re=r.convert(G.type),le=M(G.internalFormat,de,re,G.colorSpace);if(!n.get(A).__hasExternalTextures){const Be=Math.max(1,A.width>>Q),K=Math.max(1,A.height>>Q);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?t.texImage3D($,Q,le,Be,K,A.depth,0,de,re,null):t.texImage2D($,Q,le,Be,K,0,de,re,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),fe(A)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,$,n.get(G).__webglTexture,0,Re(A)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,J,$,n.get(G).__webglTexture,Q),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Pe(R,A,G){if(s.bindRenderbuffer(s.RENDERBUFFER,R),A.depthBuffer&&!A.stencilBuffer){let J=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(G||fe(A)){const $=A.depthTexture;$&&$.isDepthTexture&&($.type===Pt?J=s.DEPTH_COMPONENT32F:$.type===qt&&(J=s.DEPTH_COMPONENT24));const Q=Re(A);fe(A)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Q,J,A.width,A.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,Q,J,A.width,A.height)}else s.renderbufferStorage(s.RENDERBUFFER,J,A.width,A.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,R)}else if(A.depthBuffer&&A.stencilBuffer){const J=Re(A);G&&fe(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,J,s.DEPTH24_STENCIL8,A.width,A.height):fe(A)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,J,s.DEPTH24_STENCIL8,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,R)}else{const J=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let $=0;$<J.length;$++){const Q=J[$],de=r.convert(Q.format,Q.colorSpace),re=r.convert(Q.type),le=M(Q.internalFormat,de,re,Q.colorSpace),Te=Re(A);G&&fe(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Te,le,A.width,A.height):fe(A)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Te,le,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,le,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ie(R,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),H(A.depthTexture,0);const J=n.get(A.depthTexture).__webglTexture,$=Re(A);if(A.depthTexture.format===fi)fe(A)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0);else if(A.depthTexture.format===Qi)fe(A)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ee(R){const A=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!A.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");Ie(A.__webglFramebuffer,R)}else if(G){A.__webglDepthbuffer=[];for(let J=0;J<6;J++)t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[J]),A.__webglDepthbuffer[J]=s.createRenderbuffer(),Pe(A.__webglDepthbuffer[J],R,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=s.createRenderbuffer(),Pe(A.__webglDepthbuffer,R,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ve(R,A,G){const J=n.get(R);A!==void 0&&me(J.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),G!==void 0&&Ee(R)}function O(R){const A=R.texture,G=n.get(R),J=n.get(A);R.addEventListener("dispose",L),R.isWebGLMultipleRenderTargets!==!0&&(J.__webglTexture===void 0&&(J.__webglTexture=s.createTexture()),J.__version=A.version,o.memory.textures++);const $=R.isWebGLCubeRenderTarget===!0,Q=R.isWebGLMultipleRenderTargets===!0,de=m(R)||a;if($){G.__webglFramebuffer=[];for(let re=0;re<6;re++)if(a&&A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer[re]=[];for(let le=0;le<A.mipmaps.length;le++)G.__webglFramebuffer[re][le]=s.createFramebuffer()}else G.__webglFramebuffer[re]=s.createFramebuffer()}else{if(a&&A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer=[];for(let re=0;re<A.mipmaps.length;re++)G.__webglFramebuffer[re]=s.createFramebuffer()}else G.__webglFramebuffer=s.createFramebuffer();if(Q)if(i.drawBuffers){const re=R.texture;for(let le=0,Te=re.length;le<Te;le++){const Be=n.get(re[le]);Be.__webglTexture===void 0&&(Be.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&R.samples>0&&fe(R)===!1){const re=Q?A:[A];G.__webglMultisampledFramebuffer=s.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let le=0;le<re.length;le++){const Te=re[le];G.__webglColorRenderbuffer[le]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,G.__webglColorRenderbuffer[le]);const Be=r.convert(Te.format,Te.colorSpace),K=r.convert(Te.type),je=M(Te.internalFormat,Be,K,Te.colorSpace,R.isXRRenderTarget===!0),Ge=Re(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ge,je,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+le,s.RENDERBUFFER,G.__webglColorRenderbuffer[le])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=s.createRenderbuffer(),Pe(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if($){t.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),W(s.TEXTURE_CUBE_MAP,A,de);for(let re=0;re<6;re++)if(a&&A.mipmaps&&A.mipmaps.length>0)for(let le=0;le<A.mipmaps.length;le++)me(G.__webglFramebuffer[re][le],R,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+re,le);else me(G.__webglFramebuffer[re],R,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);x(A,de)&&v(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Q){const re=R.texture;for(let le=0,Te=re.length;le<Te;le++){const Be=re[le],K=n.get(Be);t.bindTexture(s.TEXTURE_2D,K.__webglTexture),W(s.TEXTURE_2D,Be,de),me(G.__webglFramebuffer,R,Be,s.COLOR_ATTACHMENT0+le,s.TEXTURE_2D,0),x(Be,de)&&v(s.TEXTURE_2D)}t.unbindTexture()}else{let re=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(a?re=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(re,J.__webglTexture),W(re,A,de),a&&A.mipmaps&&A.mipmaps.length>0)for(let le=0;le<A.mipmaps.length;le++)me(G.__webglFramebuffer[le],R,A,s.COLOR_ATTACHMENT0,re,le);else me(G.__webglFramebuffer,R,A,s.COLOR_ATTACHMENT0,re,0);x(A,de)&&v(re),t.unbindTexture()}R.depthBuffer&&Ee(R)}function Dt(R){const A=m(R)||a,G=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let J=0,$=G.length;J<$;J++){const Q=G[J];if(x(Q,A)){const de=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,re=n.get(Q).__webglTexture;t.bindTexture(de,re),v(de),t.unbindTexture()}}}function ye(R){if(a&&R.samples>0&&fe(R)===!1){const A=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],G=R.width,J=R.height;let $=s.COLOR_BUFFER_BIT;const Q=[],de=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,re=n.get(R),le=R.isWebGLMultipleRenderTargets===!0;if(le)for(let Te=0;Te<A.length;Te++)t.bindFramebuffer(s.FRAMEBUFFER,re.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,re.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,re.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,re.__webglFramebuffer);for(let Te=0;Te<A.length;Te++){Q.push(s.COLOR_ATTACHMENT0+Te),R.depthBuffer&&Q.push(de);const Be=re.__ignoreDepthValues!==void 0?re.__ignoreDepthValues:!1;if(Be===!1&&(R.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),le&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,re.__webglColorRenderbuffer[Te]),Be===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[de]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[de])),le){const K=n.get(A[Te]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,K,0)}s.blitFramebuffer(0,0,G,J,0,0,G,J,$,s.NEAREST),l&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Q)}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),le)for(let Te=0;Te<A.length;Te++){t.bindFramebuffer(s.FRAMEBUFFER,re.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.RENDERBUFFER,re.__webglColorRenderbuffer[Te]);const Be=n.get(A[Te]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,re.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.TEXTURE_2D,Be,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,re.__webglMultisampledFramebuffer)}}function Re(R){return Math.min(i.maxSamples,R.samples)}function fe(R){const A=n.get(R);return a&&R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function st(R){const A=o.render.frame;u.get(R)!==A&&(u.set(R,A),R.update())}function Fe(R,A){const G=R.colorSpace,J=R.format,$=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===ca||G!==Tt&&G!==nn&&(We.getTransfer(G)===et?a===!1?e.has("EXT_sRGB")===!0&&J===ht?(R.format=ca,R.minFilter=nt,R.generateMipmaps=!1):A=vu.sRGBToLinear(A):(J!==ht||$!==_n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),A}this.allocateTextureUnit=P,this.resetTextureUnits=B,this.setTexture2D=H,this.setTexture2DArray=j,this.setTexture3D=q,this.setTextureCube=X,this.rebindTextures=Ve,this.setupRenderTarget=O,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=ye,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=me,this.useMultisampledRTT=fe}function T_(s,e,t){const n=t.isWebGL2;function i(r,o=nn){let a;const c=We.getTransfer(o);if(r===_n)return s.UNSIGNED_BYTE;if(r===cu)return s.UNSIGNED_SHORT_4_4_4_4;if(r===lu)return s.UNSIGNED_SHORT_5_5_5_1;if(r===ra)return s.BYTE;if(r===au)return s.SHORT;if(r===Wr)return s.UNSIGNED_SHORT;if(r===ws)return s.INT;if(r===qt)return s.UNSIGNED_INT;if(r===Pt)return s.FLOAT;if(r===Kt)return n?s.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Xh)return s.ALPHA;if(r===ht)return s.RGBA;if(r===qh)return s.LUMINANCE;if(r===jh)return s.LUMINANCE_ALPHA;if(r===fi)return s.DEPTH_COMPONENT;if(r===Qi)return s.DEPTH_STENCIL;if(r===ca)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===uu)return s.RED;if(r===Aa)return s.RED_INTEGER;if(r===hu)return s.RG;if(r===Xr)return s.RG_INTEGER;if(r===Is)return s.RGBA_INTEGER;if(r===so||r===ro||r===oo||r===ao)if(c===et)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===so)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ro)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===oo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ao)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===so)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ro)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===oo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ao)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===tc||r===nc||r===ic||r===sc)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===tc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===nc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===ic)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===sc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===fu)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===rc||r===oc)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===rc)return c===et?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===oc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ac||r===cc||r===lc||r===uc||r===hc||r===fc||r===dc||r===pc||r===mc||r===gc||r===_c||r===vc||r===xc||r===yc)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===ac)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===cc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===lc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===uc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===hc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===fc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===dc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===pc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===mc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===gc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===_c)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===vc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===xc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===yc)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===co||r===Mc||r===Sc)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===co)return c===et?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Mc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Sc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Yh||r===Tc||r===Ec||r===bc)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===co)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Tc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ec)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===bc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===hi?n?s.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class E_ extends Ht{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ui extends ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const b_={type:"move"};class Io{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ui,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ui,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ui,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(b_)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ui;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class A_ extends rs{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,f=null,d=null,g=null;const _=t.getContextAttributes();let m=null,p=null;const x=[],v=[],M=new xe;let b=null;const S=new Ht;S.layers.enable(1),S.viewport=new $e;const E=new Ht;E.layers.enable(2),E.viewport=new $e;const L=[S,E],y=new E_;y.layers.enable(1),y.layers.enable(2);let T=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let Y=x[W];return Y===void 0&&(Y=new Io,x[W]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(W){let Y=x[W];return Y===void 0&&(Y=new Io,x[W]=Y),Y.getGripSpace()},this.getHand=function(W){let Y=x[W];return Y===void 0&&(Y=new Io,x[W]=Y),Y.getHandSpace()};function I(W){const Y=v.indexOf(W.inputSource);if(Y===-1)return;const oe=x[Y];oe!==void 0&&(oe.update(W.inputSource,W.frame,l||o),oe.dispatchEvent({type:W.type,data:W.inputSource}))}function B(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",P);for(let W=0;W<x.length;W++){const Y=v[W];Y!==null&&(v[W]=null,x[W].disconnect(Y))}T=null,D=null,e.setRenderTarget(m),d=null,f=null,h=null,i=null,p=null,ce.stop(),n.isPresenting=!1,e.setPixelRatio(b),e.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(W){l=W},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(W){if(i=W,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",B),i.addEventListener("inputsourceschange",P),_.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(M),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Y={antialias:i.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,Y),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new Zt(d.framebufferWidth,d.framebufferHeight,{format:ht,type:_n,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Y=null,oe=null,ge=null;_.depth&&(ge=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Y=_.stencil?Qi:fi,oe=_.stencil?hi:qt);const me={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:r};h=new XRWebGLBinding(i,t),f=h.createProjectionLayer(me),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),p=new Zt(f.textureWidth,f.textureHeight,{format:ht,type:_n,depthTexture:new Cu(f.textureWidth,f.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Pe=e.properties.get(p);Pe.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),ce.setContext(i),ce.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function P(W){for(let Y=0;Y<W.removed.length;Y++){const oe=W.removed[Y],ge=v.indexOf(oe);ge>=0&&(v[ge]=null,x[ge].disconnect(oe))}for(let Y=0;Y<W.added.length;Y++){const oe=W.added[Y];let ge=v.indexOf(oe);if(ge===-1){for(let Pe=0;Pe<x.length;Pe++)if(Pe>=v.length){v.push(oe),ge=Pe;break}else if(v[Pe]===null){v[Pe]=oe,ge=Pe;break}if(ge===-1)break}const me=x[ge];me&&me.connect(oe)}}const N=new C,H=new C;function j(W,Y,oe){N.setFromMatrixPosition(Y.matrixWorld),H.setFromMatrixPosition(oe.matrixWorld);const ge=N.distanceTo(H),me=Y.projectionMatrix.elements,Pe=oe.projectionMatrix.elements,Ie=me[14]/(me[10]-1),Ee=me[14]/(me[10]+1),Ve=(me[9]+1)/me[5],O=(me[9]-1)/me[5],Dt=(me[8]-1)/me[0],ye=(Pe[8]+1)/Pe[0],Re=Ie*Dt,fe=Ie*ye,st=ge/(-Dt+ye),Fe=st*-Dt;Y.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Fe),W.translateZ(st),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert();const R=Ie+st,A=Ee+st,G=Re-Fe,J=fe+(ge-Fe),$=Ve*Ee/A*R,Q=O*Ee/A*R;W.projectionMatrix.makePerspective(G,J,$,Q,R,A),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}function q(W,Y){Y===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(Y.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(i===null)return;y.near=E.near=S.near=W.near,y.far=E.far=S.far=W.far,(T!==y.near||D!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),T=y.near,D=y.far);const Y=W.parent,oe=y.cameras;q(y,Y);for(let ge=0;ge<oe.length;ge++)q(oe[ge],Y);oe.length===2?j(y,S,E):y.projectionMatrix.copy(S.projectionMatrix),X(W,y,Y)};function X(W,Y,oe){oe===null?W.matrix.copy(Y.matrixWorld):(W.matrix.copy(oe.matrixWorld),W.matrix.invert(),W.matrix.multiply(Y.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(Y.projectionMatrix),W.projectionMatrixInverse.copy(Y.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=ts*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(W){c=W,f!==null&&(f.fixedFoveation=W),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=W)};let Z=null;function ee(W,Y){if(u=Y.getViewerPose(l||o),g=Y,u!==null){const oe=u.views;d!==null&&(e.setRenderTargetFramebuffer(p,d.framebuffer),e.setRenderTarget(p));let ge=!1;oe.length!==y.cameras.length&&(y.cameras.length=0,ge=!0);for(let me=0;me<oe.length;me++){const Pe=oe[me];let Ie=null;if(d!==null)Ie=d.getViewport(Pe);else{const Ve=h.getViewSubImage(f,Pe);Ie=Ve.viewport,me===0&&(e.setRenderTargetTextures(p,Ve.colorTexture,f.ignoreDepthValues?void 0:Ve.depthStencilTexture),e.setRenderTarget(p))}let Ee=L[me];Ee===void 0&&(Ee=new Ht,Ee.layers.enable(me),Ee.viewport=new $e,L[me]=Ee),Ee.matrix.fromArray(Pe.transform.matrix),Ee.matrix.decompose(Ee.position,Ee.quaternion,Ee.scale),Ee.projectionMatrix.fromArray(Pe.projectionMatrix),Ee.projectionMatrixInverse.copy(Ee.projectionMatrix).invert(),Ee.viewport.set(Ie.x,Ie.y,Ie.width,Ie.height),me===0&&(y.matrix.copy(Ee.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ge===!0&&y.cameras.push(Ee)}}for(let oe=0;oe<x.length;oe++){const ge=v[oe],me=x[oe];ge!==null&&me!==void 0&&me.update(ge,Y,l||o)}Z&&Z(W,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),g=null}const ce=new Ru;ce.setAnimationLoop(ee),this.setAnimationLoop=function(W){Z=W},this.dispose=function(){}}}function w_(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,bu(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,x,v,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,x,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ot&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ot&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=e.get(p).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const v=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*v,t(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),e.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ot&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function R_(s,e,t,n){let i={},r={},o=[];const a=t.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(x,v){const M=v.program;n.uniformBlockBinding(x,M)}function l(x,v){let M=i[x.id];M===void 0&&(g(x),M=u(x),i[x.id]=M,x.addEventListener("dispose",m));const b=v.program;n.updateUBOMapping(x,b);const S=e.render.frame;r[x.id]!==S&&(f(x),r[x.id]=S)}function u(x){const v=h();x.__bindingPointIndex=v;const M=s.createBuffer(),b=x.__size,S=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,b,S),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,M),M}function h(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const v=i[x.id],M=x.uniforms,b=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let S=0,E=M.length;S<E;S++){const L=Array.isArray(M[S])?M[S]:[M[S]];for(let y=0,T=L.length;y<T;y++){const D=L[y];if(d(D,S,y,b)===!0){const I=D.__offset,B=Array.isArray(D.value)?D.value:[D.value];let P=0;for(let N=0;N<B.length;N++){const H=B[N],j=_(H);typeof H=="number"||typeof H=="boolean"?(D.__data[0]=H,s.bufferSubData(s.UNIFORM_BUFFER,I+P,D.__data)):H.isMatrix3?(D.__data[0]=H.elements[0],D.__data[1]=H.elements[1],D.__data[2]=H.elements[2],D.__data[3]=0,D.__data[4]=H.elements[3],D.__data[5]=H.elements[4],D.__data[6]=H.elements[5],D.__data[7]=0,D.__data[8]=H.elements[6],D.__data[9]=H.elements[7],D.__data[10]=H.elements[8],D.__data[11]=0):(H.toArray(D.__data,P),P+=j.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,I,D.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(x,v,M,b){const S=x.value,E=v+"_"+M;if(b[E]===void 0)return typeof S=="number"||typeof S=="boolean"?b[E]=S:b[E]=S.clone(),!0;{const L=b[E];if(typeof S=="number"||typeof S=="boolean"){if(L!==S)return b[E]=S,!0}else if(L.equals(S)===!1)return L.copy(S),!0}return!1}function g(x){const v=x.uniforms;let M=0;const b=16;for(let E=0,L=v.length;E<L;E++){const y=Array.isArray(v[E])?v[E]:[v[E]];for(let T=0,D=y.length;T<D;T++){const I=y[T],B=Array.isArray(I.value)?I.value:[I.value];for(let P=0,N=B.length;P<N;P++){const H=B[P],j=_(H),q=M%b;q!==0&&b-q<j.boundary&&(M+=b-q),I.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=M,M+=j.storage}}}const S=M%b;return S>0&&(M+=b-S),x.__size=M,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){const v=x.target;v.removeEventListener("dispose",m);const M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function p(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:c,update:l,dispose:p}}class C_{constructor(e={}){const{canvas:t=Tf(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const d=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ut,this._useLegacyLights=!1,this.toneMapping=jn,this.toneMappingExposure=1;const v=this;let M=!1,b=0,S=0,E=null,L=-1,y=null;const T=new $e,D=new $e;let I=null;const B=new he(0);let P=0,N=t.width,H=t.height,j=1,q=null,X=null;const Z=new $e(0,0,N,H),ee=new $e(0,0,N,H);let ce=!1;const W=new Ca;let Y=!1,oe=!1,ge=null;const me=new _e,Pe=new xe,Ie=new C,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ve(){return E===null?j:1}let O=n;function Dt(w,F){for(let k=0;k<w.length;k++){const V=w[k],z=t.getContext(V,F);if(z!==null)return z}return null}try{const w={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ba}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",U,!1),t.addEventListener("webglcontextcreationerror",ie,!1),O===null){const F=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&F.shift(),O=Dt(F,w),O===null)throw Dt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let ye,Re,fe,st,Fe,R,A,G,J,$,Q,de,re,le,Te,Be,K,je,Ge,we,ve,ue,Ue,Xe;function at(){ye=new Om(O),Re=new Dm(O,ye,e),ye.init(Re),ue=new T_(O,ye,Re),fe=new M_(O,ye,Re),st=new Gm(O),Fe=new a_,R=new S_(O,ye,fe,Fe,Re,ue,st),A=new Um(v),G=new Bm(v),J=new Kf(O,Re),Ue=new Pm(O,ye,J,Re),$=new zm(O,J,st,Ue),Q=new Xm(O,$,J,st),Ge=new Wm(O,Re,R),Be=new Im(Fe),de=new o_(v,A,G,ye,Re,Ue,Be),re=new w_(v,Fe),le=new l_,Te=new m_(ye,Re),je=new Cm(v,A,G,fe,Q,f,c),K=new y_(v,Q,Re),Xe=new R_(O,st,Re,fe),we=new Lm(O,ye,st,Re),ve=new Hm(O,ye,st,Re),st.programs=de.programs,v.capabilities=Re,v.extensions=ye,v.properties=Fe,v.renderLists=le,v.shadowMap=K,v.state=fe,v.info=st}at();const ze=new A_(v,O);this.xr=ze,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const w=ye.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=ye.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(w){w!==void 0&&(j=w,this.setSize(N,H,!1))},this.getSize=function(w){return w.set(N,H)},this.setSize=function(w,F,k=!0){if(ze.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=w,H=F,t.width=Math.floor(w*j),t.height=Math.floor(F*j),k===!0&&(t.style.width=w+"px",t.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(N*j,H*j).floor()},this.setDrawingBufferSize=function(w,F,k){N=w,H=F,j=k,t.width=Math.floor(w*k),t.height=Math.floor(F*k),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(T)},this.getViewport=function(w){return w.copy(Z)},this.setViewport=function(w,F,k,V){w.isVector4?Z.set(w.x,w.y,w.z,w.w):Z.set(w,F,k,V),fe.viewport(T.copy(Z).multiplyScalar(j).floor())},this.getScissor=function(w){return w.copy(ee)},this.setScissor=function(w,F,k,V){w.isVector4?ee.set(w.x,w.y,w.z,w.w):ee.set(w,F,k,V),fe.scissor(D.copy(ee).multiplyScalar(j).floor())},this.getScissorTest=function(){return ce},this.setScissorTest=function(w){fe.setScissorTest(ce=w)},this.setOpaqueSort=function(w){q=w},this.setTransparentSort=function(w){X=w},this.getClearColor=function(w){return w.copy(je.getClearColor())},this.setClearColor=function(){je.setClearColor.apply(je,arguments)},this.getClearAlpha=function(){return je.getClearAlpha()},this.setClearAlpha=function(){je.setClearAlpha.apply(je,arguments)},this.clear=function(w=!0,F=!0,k=!0){let V=0;if(w){let z=!1;if(E!==null){const ae=E.texture.format;z=ae===Is||ae===Xr||ae===Aa}if(z){const ae=E.texture.type,pe=ae===_n||ae===qt||ae===Wr||ae===hi||ae===cu||ae===lu,Se=je.getClearColor(),Ae=je.getClearAlpha(),Oe=Se.r,Ce=Se.g,Le=Se.b;pe?(d[0]=Oe,d[1]=Ce,d[2]=Le,d[3]=Ae,O.clearBufferuiv(O.COLOR,0,d)):(g[0]=Oe,g[1]=Ce,g[2]=Le,g[3]=Ae,O.clearBufferiv(O.COLOR,0,g))}else V|=O.COLOR_BUFFER_BIT}F&&(V|=O.DEPTH_BUFFER_BIT),k&&(V|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",U,!1),t.removeEventListener("webglcontextcreationerror",ie,!1),le.dispose(),Te.dispose(),Fe.dispose(),A.dispose(),G.dispose(),Q.dispose(),Ue.dispose(),Xe.dispose(),de.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",It),ze.removeEventListener("sessionend",Qe),ge&&(ge.dispose(),ge=null),Ut.stop()};function te(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const w=st.autoReset,F=K.enabled,k=K.autoUpdate,V=K.needsUpdate,z=K.type;at(),st.autoReset=w,K.enabled=F,K.autoUpdate=k,K.needsUpdate=V,K.type=z}function ie(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function se(w){const F=w.target;F.removeEventListener("dispose",se),be(F)}function be(w){Me(w),Fe.remove(w)}function Me(w){const F=Fe.get(w).programs;F!==void 0&&(F.forEach(function(k){de.releaseProgram(k)}),w.isShaderMaterial&&de.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,k,V,z,ae){F===null&&(F=Ee);const pe=z.isMesh&&z.matrixWorld.determinant()<0,Se=oh(w,F,k,V,z);fe.setMaterial(V,pe);let Ae=k.index,Oe=1;if(V.wireframe===!0){if(Ae=$.getWireframeAttribute(k),Ae===void 0)return;Oe=2}const Ce=k.drawRange,Le=k.attributes.position;let ft=Ce.start*Oe,Vt=(Ce.start+Ce.count)*Oe;ae!==null&&(ft=Math.max(ft,ae.start*Oe),Vt=Math.min(Vt,(ae.start+ae.count)*Oe)),Ae!==null?(ft=Math.max(ft,0),Vt=Math.min(Vt,Ae.count)):Le!=null&&(ft=Math.max(ft,0),Vt=Math.min(Vt,Le.count));const xt=Vt-ft;if(xt<0||xt===1/0)return;Ue.setup(z,V,Se,k,Ae);let yn,rt=we;if(Ae!==null&&(yn=J.get(Ae),rt=ve,rt.setIndex(yn)),z.isMesh)V.wireframe===!0?(fe.setLineWidth(V.wireframeLinewidth*Ve()),rt.setMode(O.LINES)):rt.setMode(O.TRIANGLES);else if(z.isLine){let He=V.linewidth;He===void 0&&(He=1),fe.setLineWidth(He*Ve()),z.isLineSegments?rt.setMode(O.LINES):z.isLineLoop?rt.setMode(O.LINE_LOOP):rt.setMode(O.LINE_STRIP)}else z.isPoints?rt.setMode(O.POINTS):z.isSprite&&rt.setMode(O.TRIANGLES);if(z.isBatchedMesh)rt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else if(z.isInstancedMesh)rt.renderInstances(ft,xt,z.count);else if(k.isInstancedBufferGeometry){const He=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,eo=Math.min(k.instanceCount,He);rt.renderInstances(ft,xt,eo)}else rt.render(ft,xt)};function Ze(w,F,k){w.transparent===!0&&w.side===un&&w.forceSinglePass===!1?(w.side=Ot,w.needsUpdate=!0,Gs(w,F,k),w.side=$t,w.needsUpdate=!0,Gs(w,F,k),w.side=un):Gs(w,F,k)}this.compile=function(w,F,k=null){k===null&&(k=w),m=Te.get(k),m.init(),x.push(m),k.traverseVisible(function(z){z.isLight&&z.layers.test(F.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),w!==k&&w.traverseVisible(function(z){z.isLight&&z.layers.test(F.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),m.setupLights(v._useLegacyLights);const V=new Set;return w.traverse(function(z){const ae=z.material;if(ae)if(Array.isArray(ae))for(let pe=0;pe<ae.length;pe++){const Se=ae[pe];Ze(Se,k,z),V.add(Se)}else Ze(ae,k,z),V.add(ae)}),x.pop(),m=null,V},this.compileAsync=function(w,F,k=null){const V=this.compile(w,F,k);return new Promise(z=>{function ae(){if(V.forEach(function(pe){Fe.get(pe).currentProgram.isReady()&&V.delete(pe)}),V.size===0){z(w);return}setTimeout(ae,10)}ye.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let Je=null;function vt(w){Je&&Je(w)}function It(){Ut.stop()}function Qe(){Ut.start()}const Ut=new Ru;Ut.setAnimationLoop(vt),typeof self<"u"&&Ut.setContext(self),this.setAnimationLoop=function(w){Je=w,ze.setAnimationLoop(w),w===null?Ut.stop():Ut.start()},ze.addEventListener("sessionstart",It),ze.addEventListener("sessionend",Qe),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(F),F=ze.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,F,E),m=Te.get(w,x.length),m.init(),x.push(m),me.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),W.setFromProjectionMatrix(me),oe=this.localClippingEnabled,Y=Be.init(this.clippingPlanes,oe),_=le.get(w,p.length),_.init(),p.push(_),pn(w,F,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(q,X),this.info.render.frame++,Y===!0&&Be.beginShadows();const k=m.state.shadowsArray;if(K.render(k,w,F),Y===!0&&Be.endShadows(),this.info.autoReset===!0&&this.info.reset(),je.render(_,w),m.setupLights(v._useLegacyLights),F.isArrayCamera){const V=F.cameras;for(let z=0,ae=V.length;z<ae;z++){const pe=V[z];ka(_,w,pe,pe.viewport)}}else ka(_,w,F);E!==null&&(R.updateMultisampleRenderTarget(E),R.updateRenderTargetMipmap(E)),w.isScene===!0&&w.onAfterRender(v,w,F),Ue.resetDefaultState(),L=-1,y=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function pn(w,F,k,V){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)k=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)m.pushLight(w),w.castShadow&&m.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||W.intersectsSprite(w)){V&&Ie.setFromMatrixPosition(w.matrixWorld).applyMatrix4(me);const pe=Q.update(w),Se=w.material;Se.visible&&_.push(w,pe,Se,k,Ie.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||W.intersectsObject(w))){const pe=Q.update(w),Se=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ie.copy(w.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ie.copy(pe.boundingSphere.center)),Ie.applyMatrix4(w.matrixWorld).applyMatrix4(me)),Array.isArray(Se)){const Ae=pe.groups;for(let Oe=0,Ce=Ae.length;Oe<Ce;Oe++){const Le=Ae[Oe],ft=Se[Le.materialIndex];ft&&ft.visible&&_.push(w,pe,ft,k,Ie.z,Le)}}else Se.visible&&_.push(w,pe,Se,k,Ie.z,null)}}const ae=w.children;for(let pe=0,Se=ae.length;pe<Se;pe++)pn(ae[pe],F,k,V)}function ka(w,F,k,V){const z=w.opaque,ae=w.transmissive,pe=w.transparent;m.setupLightsView(k),Y===!0&&Be.setGlobalState(v.clippingPlanes,k),ae.length>0&&rh(z,ae,F,k),V&&fe.viewport(T.copy(V)),z.length>0&&Hs(z,F,k),ae.length>0&&Hs(ae,F,k),pe.length>0&&Hs(pe,F,k),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function rh(w,F,k,V){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const ae=Re.isWebGL2;ge===null&&(ge=new Zt(1,1,{generateMipmaps:!0,type:ye.has("EXT_color_buffer_half_float")?Kt:_n,minFilter:pi,samples:ae?4:0})),v.getDrawingBufferSize(Pe),ae?ge.setSize(Pe.x,Pe.y):ge.setSize(Hr(Pe.x),Hr(Pe.y));const pe=v.getRenderTarget();v.setRenderTarget(ge),v.getClearColor(B),P=v.getClearAlpha(),P<1&&v.setClearColor(16777215,.5),v.clear();const Se=v.toneMapping;v.toneMapping=jn,Hs(w,k,V),R.updateMultisampleRenderTarget(ge),R.updateRenderTargetMipmap(ge);let Ae=!1;for(let Oe=0,Ce=F.length;Oe<Ce;Oe++){const Le=F[Oe],ft=Le.object,Vt=Le.geometry,xt=Le.material,yn=Le.group;if(xt.side===un&&ft.layers.test(V.layers)){const rt=xt.side;xt.side=Ot,xt.needsUpdate=!0,Va(ft,k,V,Vt,xt,yn),xt.side=rt,xt.needsUpdate=!0,Ae=!0}}Ae===!0&&(R.updateMultisampleRenderTarget(ge),R.updateRenderTargetMipmap(ge)),v.setRenderTarget(pe),v.setClearColor(B,P),v.toneMapping=Se}function Hs(w,F,k){const V=F.isScene===!0?F.overrideMaterial:null;for(let z=0,ae=w.length;z<ae;z++){const pe=w[z],Se=pe.object,Ae=pe.geometry,Oe=V===null?pe.material:V,Ce=pe.group;Se.layers.test(k.layers)&&Va(Se,F,k,Ae,Oe,Ce)}}function Va(w,F,k,V,z,ae){w.onBeforeRender(v,F,k,V,z,ae),w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),z.onBeforeRender(v,F,k,V,w,ae),z.transparent===!0&&z.side===un&&z.forceSinglePass===!1?(z.side=Ot,z.needsUpdate=!0,v.renderBufferDirect(k,F,V,z,w,ae),z.side=$t,z.needsUpdate=!0,v.renderBufferDirect(k,F,V,z,w,ae),z.side=un):v.renderBufferDirect(k,F,V,z,w,ae),w.onAfterRender(v,F,k,V,z,ae)}function Gs(w,F,k){F.isScene!==!0&&(F=Ee);const V=Fe.get(w),z=m.state.lights,ae=m.state.shadowsArray,pe=z.state.version,Se=de.getParameters(w,z.state,ae,F,k),Ae=de.getProgramCacheKey(Se);let Oe=V.programs;V.environment=w.isMeshStandardMaterial?F.environment:null,V.fog=F.fog,V.envMap=(w.isMeshStandardMaterial?G:A).get(w.envMap||V.environment),Oe===void 0&&(w.addEventListener("dispose",se),Oe=new Map,V.programs=Oe);let Ce=Oe.get(Ae);if(Ce!==void 0){if(V.currentProgram===Ce&&V.lightsStateVersion===pe)return Xa(w,Se),Ce}else Se.uniforms=de.getUniforms(w),w.onBuild(k,Se,v),w.onBeforeCompile(Se,v),Ce=de.acquireProgram(Se,Ae),Oe.set(Ae,Ce),V.uniforms=Se.uniforms;const Le=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Le.clippingPlanes=Be.uniform),Xa(w,Se),V.needsLights=ch(w),V.lightsStateVersion=pe,V.needsLights&&(Le.ambientLightColor.value=z.state.ambient,Le.lightProbe.value=z.state.probe,Le.directionalLights.value=z.state.directional,Le.directionalLightShadows.value=z.state.directionalShadow,Le.spotLights.value=z.state.spot,Le.spotLightShadows.value=z.state.spotShadow,Le.rectAreaLights.value=z.state.rectArea,Le.ltc_1.value=z.state.rectAreaLTC1,Le.ltc_2.value=z.state.rectAreaLTC2,Le.pointLights.value=z.state.point,Le.pointLightShadows.value=z.state.pointShadow,Le.hemisphereLights.value=z.state.hemi,Le.directionalShadowMap.value=z.state.directionalShadowMap,Le.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Le.spotShadowMap.value=z.state.spotShadowMap,Le.spotLightMatrix.value=z.state.spotLightMatrix,Le.spotLightMap.value=z.state.spotLightMap,Le.pointShadowMap.value=z.state.pointShadowMap,Le.pointShadowMatrix.value=z.state.pointShadowMatrix),V.currentProgram=Ce,V.uniformsList=null,Ce}function Wa(w){if(w.uniformsList===null){const F=w.currentProgram.getUniforms();w.uniformsList=Dr.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function Xa(w,F){const k=Fe.get(w);k.outputColorSpace=F.outputColorSpace,k.batching=F.batching,k.instancing=F.instancing,k.instancingColor=F.instancingColor,k.skinning=F.skinning,k.morphTargets=F.morphTargets,k.morphNormals=F.morphNormals,k.morphColors=F.morphColors,k.morphTargetsCount=F.morphTargetsCount,k.numClippingPlanes=F.numClippingPlanes,k.numIntersection=F.numClipIntersection,k.vertexAlphas=F.vertexAlphas,k.vertexTangents=F.vertexTangents,k.toneMapping=F.toneMapping}function oh(w,F,k,V,z){F.isScene!==!0&&(F=Ee),R.resetTextureUnits();const ae=F.fog,pe=V.isMeshStandardMaterial?F.environment:null,Se=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Tt,Ae=(V.isMeshStandardMaterial?G:A).get(V.envMap||pe),Oe=V.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ce=!!k.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Le=!!k.morphAttributes.position,ft=!!k.morphAttributes.normal,Vt=!!k.morphAttributes.color;let xt=jn;V.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(xt=v.toneMapping);const yn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,rt=yn!==void 0?yn.length:0,He=Fe.get(V),eo=m.state.lights;if(Y===!0&&(oe===!0||w!==y)){const Jt=w===y&&V.id===L;Be.setState(V,w,Jt)}let ct=!1;V.version===He.__version?(He.needsLights&&He.lightsStateVersion!==eo.state.version||He.outputColorSpace!==Se||z.isBatchedMesh&&He.batching===!1||!z.isBatchedMesh&&He.batching===!0||z.isInstancedMesh&&He.instancing===!1||!z.isInstancedMesh&&He.instancing===!0||z.isSkinnedMesh&&He.skinning===!1||!z.isSkinnedMesh&&He.skinning===!0||z.isInstancedMesh&&He.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&He.instancingColor===!1&&z.instanceColor!==null||He.envMap!==Ae||V.fog===!0&&He.fog!==ae||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==Be.numPlanes||He.numIntersection!==Be.numIntersection)||He.vertexAlphas!==Oe||He.vertexTangents!==Ce||He.morphTargets!==Le||He.morphNormals!==ft||He.morphColors!==Vt||He.toneMapping!==xt||Re.isWebGL2===!0&&He.morphTargetsCount!==rt)&&(ct=!0):(ct=!0,He.__version=V.version);let Qn=He.currentProgram;ct===!0&&(Qn=Gs(V,F,z));let qa=!1,hs=!1,to=!1;const At=Qn.getUniforms(),ei=He.uniforms;if(fe.useProgram(Qn.program)&&(qa=!0,hs=!0,to=!0),V.id!==L&&(L=V.id,hs=!0),qa||y!==w){At.setValue(O,"projectionMatrix",w.projectionMatrix),At.setValue(O,"viewMatrix",w.matrixWorldInverse);const Jt=At.map.cameraPosition;Jt!==void 0&&Jt.setValue(O,Ie.setFromMatrixPosition(w.matrixWorld)),Re.logarithmicDepthBuffer&&At.setValue(O,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&At.setValue(O,"isOrthographic",w.isOrthographicCamera===!0),y!==w&&(y=w,hs=!0,to=!0)}if(z.isSkinnedMesh){At.setOptional(O,z,"bindMatrix"),At.setOptional(O,z,"bindMatrixInverse");const Jt=z.skeleton;Jt&&(Re.floatVertexTextures?(Jt.boneTexture===null&&Jt.computeBoneTexture(),At.setValue(O,"boneTexture",Jt.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}z.isBatchedMesh&&(At.setOptional(O,z,"batchingTexture"),At.setValue(O,"batchingTexture",z._matricesTexture,R));const no=k.morphAttributes;if((no.position!==void 0||no.normal!==void 0||no.color!==void 0&&Re.isWebGL2===!0)&&Ge.update(z,k,Qn),(hs||He.receiveShadow!==z.receiveShadow)&&(He.receiveShadow=z.receiveShadow,At.setValue(O,"receiveShadow",z.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(ei.envMap.value=Ae,ei.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),hs&&(At.setValue(O,"toneMappingExposure",v.toneMappingExposure),He.needsLights&&ah(ei,to),ae&&V.fog===!0&&re.refreshFogUniforms(ei,ae),re.refreshMaterialUniforms(ei,V,j,H,ge),Dr.upload(O,Wa(He),ei,R)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Dr.upload(O,Wa(He),ei,R),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&At.setValue(O,"center",z.center),At.setValue(O,"modelViewMatrix",z.modelViewMatrix),At.setValue(O,"normalMatrix",z.normalMatrix),At.setValue(O,"modelMatrix",z.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Jt=V.uniformsGroups;for(let io=0,lh=Jt.length;io<lh;io++)if(Re.isWebGL2){const ja=Jt[io];Xe.update(ja,Qn),Xe.bind(ja,Qn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Qn}function ah(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function ch(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(w,F,k){Fe.get(w.texture).__webglTexture=F,Fe.get(w.depthTexture).__webglTexture=k;const V=Fe.get(w);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=k===void 0,V.__autoAllocateDepthBuffer||ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,F){const k=Fe.get(w);k.__webglFramebuffer=F,k.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,k=0){E=w,b=F,S=k;let V=!0,z=null,ae=!1,pe=!1;if(w){const Ae=Fe.get(w);Ae.__useDefaultFramebuffer!==void 0?(fe.bindFramebuffer(O.FRAMEBUFFER,null),V=!1):Ae.__webglFramebuffer===void 0?R.setupRenderTarget(w):Ae.__hasExternalTextures&&R.rebindTextures(w,Fe.get(w.texture).__webglTexture,Fe.get(w.depthTexture).__webglTexture);const Oe=w.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(pe=!0);const Ce=Fe.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ce[F])?z=Ce[F][k]:z=Ce[F],ae=!0):Re.isWebGL2&&w.samples>0&&R.useMultisampledRTT(w)===!1?z=Fe.get(w).__webglMultisampledFramebuffer:Array.isArray(Ce)?z=Ce[k]:z=Ce,T.copy(w.viewport),D.copy(w.scissor),I=w.scissorTest}else T.copy(Z).multiplyScalar(j).floor(),D.copy(ee).multiplyScalar(j).floor(),I=ce;if(fe.bindFramebuffer(O.FRAMEBUFFER,z)&&Re.drawBuffers&&V&&fe.drawBuffers(w,z),fe.viewport(T),fe.scissor(D),fe.setScissorTest(I),ae){const Ae=Fe.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ae.__webglTexture,k)}else if(pe){const Ae=Fe.get(w.texture),Oe=F||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ae.__webglTexture,k||0,Oe)}L=-1},this.readRenderTargetPixels=function(w,F,k,V,z,ae,pe){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Fe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&pe!==void 0&&(Se=Se[pe]),Se){fe.bindFramebuffer(O.FRAMEBUFFER,Se);try{const Ae=w.texture,Oe=Ae.format,Ce=Ae.type;if(Oe!==ht&&ue.convert(Oe)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Le=Ce===Kt&&(ye.has("EXT_color_buffer_half_float")||Re.isWebGL2&&ye.has("EXT_color_buffer_float"));if(Ce!==_n&&ue.convert(Ce)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ce===Pt&&(Re.isWebGL2||ye.has("OES_texture_float")||ye.has("WEBGL_color_buffer_float")))&&!Le){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-V&&k>=0&&k<=w.height-z&&O.readPixels(F,k,V,z,ue.convert(Oe),ue.convert(Ce),ae)}finally{const Ae=E!==null?Fe.get(E).__webglFramebuffer:null;fe.bindFramebuffer(O.FRAMEBUFFER,Ae)}}},this.copyFramebufferToTexture=function(w,F,k=0){const V=Math.pow(2,-k),z=Math.floor(F.image.width*V),ae=Math.floor(F.image.height*V);R.setTexture2D(F,0),O.copyTexSubImage2D(O.TEXTURE_2D,k,0,0,w.x,w.y,z,ae),fe.unbindTexture()},this.copyTextureToTexture=function(w,F,k,V=0){const z=F.image.width,ae=F.image.height,pe=ue.convert(k.format),Se=ue.convert(k.type);R.setTexture2D(k,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment),F.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,V,w.x,w.y,z,ae,pe,Se,F.image.data):F.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,V,w.x,w.y,F.mipmaps[0].width,F.mipmaps[0].height,pe,F.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,V,w.x,w.y,pe,Se,F.image),V===0&&k.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(w,F,k,V,z=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ae=w.max.x-w.min.x+1,pe=w.max.y-w.min.y+1,Se=w.max.z-w.min.z+1,Ae=ue.convert(V.format),Oe=ue.convert(V.type);let Ce;if(V.isData3DTexture)R.setTexture3D(V,0),Ce=O.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)R.setTexture2DArray(V,0),Ce=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,V.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,V.unpackAlignment);const Le=O.getParameter(O.UNPACK_ROW_LENGTH),ft=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Vt=O.getParameter(O.UNPACK_SKIP_PIXELS),xt=O.getParameter(O.UNPACK_SKIP_ROWS),yn=O.getParameter(O.UNPACK_SKIP_IMAGES),rt=k.isCompressedTexture?k.mipmaps[z]:k.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,rt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,rt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,w.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,w.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,w.min.z),k.isDataTexture||k.isData3DTexture?O.texSubImage3D(Ce,z,F.x,F.y,F.z,ae,pe,Se,Ae,Oe,rt.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Ce,z,F.x,F.y,F.z,ae,pe,Se,Ae,rt.data)):O.texSubImage3D(Ce,z,F.x,F.y,F.z,ae,pe,Se,Ae,Oe,rt),O.pixelStorei(O.UNPACK_ROW_LENGTH,Le),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ft),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Vt),O.pixelStorei(O.UNPACK_SKIP_ROWS,xt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,yn),z===0&&V.generateMipmaps&&O.generateMipmap(Ce),fe.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),fe.unbindTexture()},this.resetState=function(){b=0,S=0,E=null,fe.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===wa?"display-p3":"srgb",t.unpackColorSpace=We.workingColorSpace===qr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ut?di:pu}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===di?ut:Tt}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class P_ extends C_{}P_.prototype.isWebGL1Renderer=!0;class Os extends ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class L_{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=aa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=hn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Nt=new C;class La{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix4(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyNormalMatrix(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.transformDirection(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=gn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=gn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=gn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=gn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),i=Ye(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),i=Ye(i,this.array),r=Ye(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new it(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new La(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const ml=new C,gl=new $e,_l=new $e,D_=new C,vl=new _e,ur=new C,Uo=new dn,xl=new _e,No=new jr;class I_ extends Et{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ec,this.bindMatrix=new _e,this.bindMatrixInverse=new _e,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new _t),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ur),this.boundingBox.expandByPoint(ur)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new dn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ur),this.boundingSphere.expandByPoint(ur)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Uo.copy(this.boundingSphere),Uo.applyMatrix4(i),e.ray.intersectsSphere(Uo)!==!1&&(xl.copy(i).invert(),No.copy(e.ray).applyMatrix4(xl),!(this.boundingBox!==null&&No.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,No)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new $e,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===ec?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Wh?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;gl.fromBufferAttribute(i.attributes.skinIndex,e),_l.fromBufferAttribute(i.attributes.skinWeight,e),ml.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=_l.getComponent(r);if(o!==0){const a=gl.getComponent(r);vl.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(D_.copy(ml).applyMatrix4(vl),o)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(e,t)}}class Nu extends ot{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Fs extends bt{constructor(e=null,t=1,n=1,i,r,o,a,c,l=Ke,u=Ke,h,f){super(null,o,a,c,l,u,i,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const yl=new _e,U_=new _e;class Da{constructor(e=[],t=[]){this.uuid=hn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new _e)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new _e;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:U_;yl.multiplyMatrices(a,t[r]),yl.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Da(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Fs(t,e,e,ht,Pt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Nu),this.bones.push(o),this.boneInverses.push(new _e().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class ha extends it{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Di=new _e,Ml=new _e,hr=[],Sl=new _t,N_=new _e,gs=new Et,_s=new dn;class F_ extends Et{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ha(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,N_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new _t),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),Sl.copy(e.boundingBox).applyMatrix4(Di),this.boundingBox.union(Sl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new dn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),_s.copy(e.boundingSphere).applyMatrix4(Di),this.boundingSphere.union(_s)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const n=this.matrixWorld,i=this.count;if(gs.geometry=this.geometry,gs.material=this.material,gs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_s.copy(this.boundingSphere),_s.applyMatrix4(n),e.ray.intersectsSphere(_s)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Di),Ml.multiplyMatrices(n,Di),gs.matrixWorld=Ml,gs.raycast(e,hr);for(let o=0,a=hr.length;o<a;o++){const c=hr[o];c.instanceId=r,c.object=this,t.push(c)}hr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ha(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Fu extends vn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new he(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Tl=new C,El=new C,bl=new _e,Fo=new jr,fr=new dn;class Ia extends ot{constructor(e=new Lt,t=new Fu){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Tl.fromBufferAttribute(t,i-1),El.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Tl.distanceTo(El);e.setAttribute("lineDistance",new St(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fr.copy(n.boundingSphere),fr.applyMatrix4(i),fr.radius+=r,e.ray.intersectsSphere(fr)===!1)return;bl.copy(i).invert(),Fo.copy(e.ray).applyMatrix4(bl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new C,u=new C,h=new C,f=new C,d=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),x=Math.min(g.count,o.start+o.count);for(let v=p,M=x-1;v<M;v+=d){const b=g.getX(v),S=g.getX(v+1);if(l.fromBufferAttribute(m,b),u.fromBufferAttribute(m,S),Fo.distanceSqToSegment(l,u,f,h)>c)continue;f.applyMatrix4(this.matrixWorld);const L=e.ray.origin.distanceTo(f);L<e.near||L>e.far||t.push({distance:L,point:h.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),x=Math.min(m.count,o.start+o.count);for(let v=p,M=x-1;v<M;v+=d){if(l.fromBufferAttribute(m,v),u.fromBufferAttribute(m,v+1),Fo.distanceSqToSegment(l,u,f,h)>c)continue;f.applyMatrix4(this.matrixWorld);const S=e.ray.origin.distanceTo(f);S<e.near||S>e.far||t.push({distance:S,point:h.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Al=new C,wl=new C;class B_ extends Ia{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Al.fromBufferAttribute(t,i),wl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Al.distanceTo(wl);e.setAttribute("lineDistance",new St(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class O_ extends Ia{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Bu extends vn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new he(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Rl=new _e,fa=new jr,dr=new dn,pr=new C;class z_ extends ot{constructor(e=new Lt,t=new Bu){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(i),dr.radius+=r,e.ray.intersectsSphere(dr)===!1)return;Rl.copy(i).invert(),fa.copy(e.ray).applyMatrix4(Rl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){const f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=f,_=d;g<_;g++){const m=l.getX(g);pr.fromBufferAttribute(h,m),Cl(pr,m,c,i,e,t,this)}}else{const f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let g=f,_=d;g<_;g++)pr.fromBufferAttribute(h,g),Cl(pr,g,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Cl(s,e,t,n,i,r,o){const a=fa.distanceSqToPoint(s);if(a<t){const c=new C;fa.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,object:o})}}class Ou extends Lt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const u=[],h=[],f=[],d=[];let g=0;const _=[],m=n/2;let p=0;x(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new St(h,3)),this.setAttribute("normal",new St(f,3)),this.setAttribute("uv",new St(d,2));function x(){const M=new C,b=new C;let S=0;const E=(t-e)/n;for(let L=0;L<=r;L++){const y=[],T=L/r,D=T*(t-e)+e;for(let I=0;I<=i;I++){const B=I/i,P=B*c+a,N=Math.sin(P),H=Math.cos(P);b.x=D*N,b.y=-T*n+m,b.z=D*H,h.push(b.x,b.y,b.z),M.set(N,E,H).normalize(),f.push(M.x,M.y,M.z),d.push(B,1-T),y.push(g++)}_.push(y)}for(let L=0;L<i;L++)for(let y=0;y<r;y++){const T=_[y][L],D=_[y+1][L],I=_[y+1][L+1],B=_[y][L+1];u.push(T,D,B),u.push(D,I,B),S+=6}l.addGroup(p,S,0),p+=S}function v(M){const b=g,S=new xe,E=new C;let L=0;const y=M===!0?e:t,T=M===!0?1:-1;for(let I=1;I<=i;I++)h.push(0,m*T,0),f.push(0,T,0),d.push(.5,.5),g++;const D=g;for(let I=0;I<=i;I++){const P=I/i*c+a,N=Math.cos(P),H=Math.sin(P);E.x=y*H,E.y=m*T,E.z=y*N,h.push(E.x,E.y,E.z),f.push(0,T,0),S.x=N*.5+.5,S.y=H*.5*T+.5,d.push(S.x,S.y),g++}for(let I=0;I<i;I++){const B=b+I,P=D+I;M===!0?u.push(P,P+1,B):u.push(P+1,P,B),L+=3}l.addGroup(p,L,M===!0?1:2),p+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ou(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class zu extends Lt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new C,f=new C,d=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const x=[],v=p/n;let M=0;p===0&&o===0?M=.5/t:p===n&&c===Math.PI&&(M=-.5/t);for(let b=0;b<=t;b++){const S=b/t;h.x=-e*Math.cos(i+S*r)*Math.sin(o+v*a),h.y=e*Math.cos(o+v*a),h.z=e*Math.sin(i+S*r)*Math.sin(o+v*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),_.push(f.x,f.y,f.z),m.push(S+M,1-v),x.push(l++)}u.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){const v=u[p][x+1],M=u[p][x],b=u[p+1][x],S=u[p+1][x+1];(p!==0||o>0)&&d.push(v,M,S),(p!==n-1||c<Math.PI)&&d.push(M,b,S)}this.setIndex(d),this.setAttribute("position",new St(g,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zu(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Hu extends Lt{constructor(e=1,t=.4,n=64,i=8,r=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:o},n=Math.floor(n),i=Math.floor(i);const a=[],c=[],l=[],u=[],h=new C,f=new C,d=new C,g=new C,_=new C,m=new C,p=new C;for(let v=0;v<=n;++v){const M=v/n*r*Math.PI*2;x(M,r,o,e,d),x(M+.01,r,o,e,g),m.subVectors(g,d),p.addVectors(g,d),_.crossVectors(m,p),p.crossVectors(_,m),_.normalize(),p.normalize();for(let b=0;b<=i;++b){const S=b/i*Math.PI*2,E=-t*Math.cos(S),L=t*Math.sin(S);h.x=d.x+(E*p.x+L*_.x),h.y=d.y+(E*p.y+L*_.y),h.z=d.z+(E*p.z+L*_.z),c.push(h.x,h.y,h.z),f.subVectors(h,d).normalize(),l.push(f.x,f.y,f.z),u.push(v/n),u.push(b/i)}}for(let v=1;v<=n;v++)for(let M=1;M<=i;M++){const b=(i+1)*(v-1)+(M-1),S=(i+1)*v+(M-1),E=(i+1)*v+M,L=(i+1)*(v-1)+M;a.push(b,S,L),a.push(S,E,L)}this.setIndex(a),this.setAttribute("position",new St(c,3)),this.setAttribute("normal",new St(l,3)),this.setAttribute("uv",new St(u,2));function x(v,M,b,S,E){const L=Math.cos(v),y=Math.sin(v),T=b/M*v,D=Math.cos(T);E.x=S*(2+D)*.5*L,E.y=S*(2+D)*y*.5,E.z=S*Math.sin(T)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hu(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class Ua extends vn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new he(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mu,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Un extends Ua{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new xe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Mt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new he(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new he(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new he(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function mr(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function H_(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function G_(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Pl(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let c=0;c!==e;++c)i[o++]=s[a+c]}return i}function Gu(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}class zs{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class k_ extends zs{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ac,endingEnd:Ac}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,o=e+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case wc:r=e,a=2*t-n;break;case Rc:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case wc:o=e,c=2*n-t;break;case Rc:o=1,c=n+i[1]-i[0];break;default:o=e-1,c=t}const l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,p=-f*m+2*f*_-f*g,x=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,v=(-1-d)*m+(1.5+d)*_+.5*g,M=d*m-d*_;for(let b=0;b!==a;++b)r[b]=p*o[u+b]+x*o[l+b]+v*o[c+b]+M*o[h+b];return r}}class V_ extends zs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(n-t)/(i-t),h=1-u;for(let f=0;f!==a;++f)r[f]=o[l+f]*h+o[c+f]*u;return r}}class W_ extends zs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class xn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=mr(t,this.TimeBufferType),this.values=mr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:mr(e.times,Array),values:mr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new W_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new V_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new k_(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Us:t=this.InterpolantFactoryMethodDiscrete;break;case es:t=this.InterpolantFactoryMethodLinear;break;case lo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Us;case this.InterpolantFactoryMethodLinear:return es;case this.InterpolantFactoryMethodSmooth:return lo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(i!==void 0&&H_(i))for(let a=0,c=i.length;a!==c;++a){const l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===lo,r=e.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(i)c=!0;else{const h=a*n,f=h-n,d=h+n;for(let g=0;g!==n;++g){const _=t[h+g];if(_!==t[f+g]||_!==t[d+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const h=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[h+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}xn.prototype.TimeBufferType=Float32Array;xn.prototype.ValueBufferType=Float32Array;xn.prototype.DefaultInterpolation=es;class as extends xn{}as.prototype.ValueTypeName="bool";as.prototype.ValueBufferType=Array;as.prototype.DefaultInterpolation=Us;as.prototype.InterpolantFactoryMethodLinear=void 0;as.prototype.InterpolantFactoryMethodSmooth=void 0;class ku extends xn{}ku.prototype.ValueTypeName="color";class is extends xn{}is.prototype.ValueTypeName="number";class X_ extends zs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(i-t);let l=e*a;for(let u=l+a;l!==u;l+=4)$n.slerpFlat(r,0,o,l-a,o,l,c);return r}}class mi extends xn{InterpolantFactoryMethodLinear(e){return new X_(this.times,this.values,this.getValueSize(),e)}}mi.prototype.ValueTypeName="quaternion";mi.prototype.DefaultInterpolation=es;mi.prototype.InterpolantFactoryMethodSmooth=void 0;class cs extends xn{}cs.prototype.ValueTypeName="string";cs.prototype.ValueBufferType=Array;cs.prototype.DefaultInterpolation=Us;cs.prototype.InterpolantFactoryMethodLinear=void 0;cs.prototype.InterpolantFactoryMethodSmooth=void 0;class ss extends xn{}ss.prototype.ValueTypeName="vector";class q_{constructor(e,t=-1,n,i=Kh){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=hn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Y_(n[o]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(xn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const u=G_(c);c=Pl(c,1,u),l=Pl(l,1,u),!i&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new is(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],u=l.name.match(r);if(u&&u.length>1){const h=u[1];let f=i[h];f||(i[h]=f=[]),f.push(l)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(h,f,d,g,_){if(d.length!==0){const m=[],p=[];Gu(d,m,p,g),m.length!==0&&_.push(new h(f,m,p))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let h=0;h<l.length;h++){const f=l[h].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let g;for(g=0;g<f.length;g++)if(f[g].morphTargets)for(let _=0;_<f[g].morphTargets.length;_++)d[f[g].morphTargets[_]]=-1;for(const _ in d){const m=[],p=[];for(let x=0;x!==f[g].morphTargets.length;++x){const v=f[g];m.push(v.time),p.push(v.morphTarget===_?1:0)}i.push(new is(".morphTargetInfluence["+_+"]",m,p))}c=d.length*o}else{const d=".bones["+t[h].name+"]";n(ss,d+".position",f,"pos",i),n(mi,d+".quaternion",f,"rot",i),n(ss,d+".scale",f,"scl",i)}}return i.length===0?null:new this(r,c,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function j_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return is;case"vector":case"vector2":case"vector3":case"vector4":return ss;case"color":return ku;case"quaternion":return mi;case"bool":case"boolean":return as;case"string":return cs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Y_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=j_(s.type);if(s.times===void 0){const t=[],n=[];Gu(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const Wn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class K_{constructor(e,t,n){const i=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){a++,r===!1&&i.onStart!==void 0&&i.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,i.onProgress!==void 0&&i.onProgress(u,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){const h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=l.length;h<f;h+=2){const d=l[h],g=l[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null}}}const $_=new K_;class ls{constructor(e){this.manager=e!==void 0?e:$_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}ls.DEFAULT_MATERIAL_NAME="__DEFAULT";const An={};class Z_ extends Error{constructor(e,t){super(e),this.response=t}}class Vu extends ls{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Wn.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(An[e]!==void 0){An[e].push({onLoad:t,onProgress:n,onError:i});return}An[e]=[],An[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const u=An[e],h=l.body.getReader(),f=l.headers.get("Content-Length")||l.headers.get("X-File-Size"),d=f?parseInt(f):0,g=d!==0;let _=0;const m=new ReadableStream({start(p){x();function x(){h.read().then(({done:v,value:M})=>{if(v)p.close();else{_+=M.byteLength;const b=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:d});for(let S=0,E=u.length;S<E;S++){const L=u[S];L.onProgress&&L.onProgress(b)}p.enqueue(M),x()}})}}});return new Response(m)}else throw new Z_(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a===void 0)return l.text();{const h=/charset="?([^;"\s]*)"?/i.exec(a),f=h&&h[1]?h[1].toLowerCase():void 0,d=new TextDecoder(f);return l.arrayBuffer().then(g=>d.decode(g))}}}).then(l=>{Wn.add(e,l);const u=An[e];delete An[e];for(let h=0,f=u.length;h<f;h++){const d=u[h];d.onLoad&&d.onLoad(l)}}).catch(l=>{const u=An[e];if(u===void 0)throw this.manager.itemError(e),l;delete An[e];for(let h=0,f=u.length;h<f;h++){const d=u[h];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class J_ extends ls{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Wn.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=Ns("img");function c(){u(),Wn.add(e,this),t&&t(this),r.manager.itemEnd(e)}function l(h){u(),i&&i(h),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class Q_ extends ls{constructor(e){super(e)}load(e,t,n,i){const r=new bt,o=new J_(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Na extends ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new he(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Bo=new _e,Ll=new C,Dl=new C;class Fa{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.map=null,this.mapPass=null,this.matrix=new _e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ca,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new $e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ll.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ll),Dl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Dl),t.updateMatrixWorld(),Bo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Bo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class ev extends Fa{constructor(){super(new Ht(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=ts*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class tv extends Na{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.target=new ot,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new ev}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Il=new _e,vs=new C,Oo=new C;class nv extends Fa{constructor(){super(new Ht(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new xe(4,2),this._viewportCount=6,this._viewports=[new $e(2,1,1,1),new $e(0,1,1,1),new $e(3,1,1,1),new $e(1,1,1,1),new $e(3,0,1,1),new $e(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),vs.setFromMatrixPosition(e.matrixWorld),n.position.copy(vs),Oo.copy(n.position),Oo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Oo),n.updateMatrixWorld(),i.makeTranslation(-vs.x,-vs.y,-vs.z),Il.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Il)}}class iv extends Na{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new nv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class sv extends Fa{constructor(){super(new Jn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rv extends Na{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.target=new ot,this.shadow=new sv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ls{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class ov extends ls{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Wn.get(e);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{t&&t(l),r.manager.itemEnd(e)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Wn.add(e,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){i&&i(l),Wn.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});Wn.add(e,c),r.manager.itemStart(e)}}const Ba="\\[\\]\\.:\\/",av=new RegExp("["+Ba+"]","g"),Oa="[^"+Ba+"]",cv="[^"+Ba.replace("\\.","")+"]",lv=/((?:WC+[\/:])*)/.source.replace("WC",Oa),uv=/(WCOD+)?/.source.replace("WCOD",cv),hv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Oa),fv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Oa),dv=new RegExp("^"+lv+uv+hv+fv+"$"),pv=["material","materials","bones","map"];class mv{constructor(e,t,n){const i=n||qe.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class qe{constructor(e,t,n){this.path=t,this.parsedPath=n||qe.parseTrackName(t),this.node=qe.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new qe.Composite(e,t,n):new qe(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(av,"")}static parseTrackName(e){const t=dv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);pv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=qe.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[i];if(o===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}qe.Composite=mv;qe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};qe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};qe.prototype.GetterByBindingType=[qe.prototype._getValue_direct,qe.prototype._getValue_array,qe.prototype._getValue_arrayElement,qe.prototype._getValue_toArray];qe.prototype.SetterByBindingTypeAndVersioning=[[qe.prototype._setValue_direct,qe.prototype._setValue_direct_setNeedsUpdate,qe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[qe.prototype._setValue_array,qe.prototype._setValue_array_setNeedsUpdate,qe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[qe.prototype._setValue_arrayElement,qe.prototype._setValue_arrayElement_setNeedsUpdate,qe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[qe.prototype._setValue_fromArray,qe.prototype._setValue_fromArray_setNeedsUpdate,qe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class P0{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Mt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Ul=new C,gr=new C;class Ln{constructor(e=new C,t=new C){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Ul.subVectors(e,this.start),gr.subVectors(this.end,this.start);const n=gr.dot(gr);let r=gr.dot(Ul)/n;return t&&(r=Mt(r,0,1)),r}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ba}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ba);function gv(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,c=new Lt;let l=0;for(let u=0;u<s.length;++u){const h=s[u];let f=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in h.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(h.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in h.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(h.morphAttributes[d])}if(e){let d;if(t)d=h.index.count;else if(h.attributes.position!==void 0)d=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,u),l+=d}}if(t){let u=0;const h=[];for(let f=0;f<s.length;++f){const d=s[f].index;for(let g=0;g<d.count;++g)h.push(d.getX(g)+u);u+=s[f].attributes.position.count}c.setIndex(h)}for(const u in r){const h=Nl(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<h;++f){const d=[];for(let _=0;_<o[u].length;++_)d.push(o[u][_][f]);const g=Nl(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function Nl(s){let e,t,n,i=-1,r=0;for(let l=0;l<s.length;++l){const u=s[l];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}const o=new e(r);let a=0;for(let l=0;l<s.length;++l)o.set(s[l].array,a),a+=s[l].array.length;const c=new it(o,t,n);return i!==void 0&&(c.gpuType=i),c}function Fl(s,e){if(e===$h)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===oa||e===du){let t=s.getIndex();if(t===null){const o=[],a=s.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===oa)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}class L0 extends ls{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Mv(t)}),this.register(function(t){return new Pv(t)}),this.register(function(t){return new Lv(t)}),this.register(function(t){return new Dv(t)}),this.register(function(t){return new Tv(t)}),this.register(function(t){return new Ev(t)}),this.register(function(t){return new bv(t)}),this.register(function(t){return new Av(t)}),this.register(function(t){return new yv(t)}),this.register(function(t){return new wv(t)}),this.register(function(t){return new Sv(t)}),this.register(function(t){return new Cv(t)}),this.register(function(t){return new Rv(t)}),this.register(function(t){return new vv(t)}),this.register(function(t){return new Iv(t)}),this.register(function(t){return new Uv(t)})}load(e,t,n,i){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=Ls.extractUrlBase(e);o=Ls.resolveURL(l,this.path)}else o=Ls.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){i?i(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new Vu(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setDDSLoader(){throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".')}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===Wu){try{o[ke.KHR_BINARY_GLTF]=new Nv(e)}catch(h){i&&i(h);return}r=JSON.parse(o[ke.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new Yv(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](l);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const h=r.extensionsUsed[u],f=r.extensionsRequired||[];switch(h){case ke.KHR_MATERIALS_UNLIT:o[h]=new xv;break;case ke.KHR_DRACO_MESH_COMPRESSION:o[h]=new Fv(r,this.dracoLoader);break;case ke.KHR_TEXTURE_TRANSFORM:o[h]=new Bv;break;case ke.KHR_MESH_QUANTIZATION:o[h]=new Ov;break;default:f.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function _v(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}const ke={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class vv{constructor(e){this.parser=e,this.name=ke.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const u=new he(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],Tt);const h=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new rv(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new iv(u),l.distance=h;break;case"spot":l=new tv(u),l.distance=h,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,kn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}}class xv{constructor(){this.name=ke.KHR_MATERIALS_UNLIT}getMaterialType(){return li}extendParams(e,t,n){const i=[];e.color=new he(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Tt),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,ut))}return Promise.all(i)}}class yv{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class Mv{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new xe(a,a)}return Promise.all(r)}}class Sv{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}}class Tv{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new he(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Tt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,ut)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}}class Ev{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}}class bv{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new he().setRGB(a[0],a[1],a[2],Tt),Promise.all(r)}}class Av{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class wv{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new he().setRGB(a[0],a[1],a[2],Tt),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,ut)),Promise.all(r)}}class Rv{constructor(e){this.parser=e,this.name=ke.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}}class Cv{constructor(e){this.parser=e,this.name=ke.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}}class Pv{constructor(e){this.parser=e,this.name=ke.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}}class Lv{constructor(e){this.parser=e,this.name=ke.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=i.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Dv{constructor(e){this.parser=e,this.name=ke.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=i.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,o.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Iv{constructor(e){this.name=ke.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const c=i.byteOffset||0,l=i.byteLength||0,u=i.count,h=i.byteStride,f=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,f,i.mode,i.filter).then(function(d){return d.buffer}):o.ready.then(function(){const d=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(d),u,h,f,i.mode,i.filter),d})})}else return null}}class Uv{constructor(e){this.name=ke.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const l of i.primitives)if(l.mode!==en.TRIANGLES&&l.mode!==en.TRIANGLE_STRIP&&l.mode!==en.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const u=l.pop(),h=u.isGroup?u.children:[u],f=l[0].count,d=[];for(const g of h){const _=new _e,m=new C,p=new $n,x=new C(1,1,1),v=new F_(g.geometry,g.material,f);for(let M=0;M<f;M++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,M),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,M),c.SCALE&&x.fromBufferAttribute(c.SCALE,M),v.setMatrixAt(M,_.compose(m,p,x));for(const M in c)if(M==="_COLOR_0"){const b=c[M];v.instanceColor=new ha(b.array,b.itemSize,b.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&g.geometry.setAttribute(M,c[M]);ot.prototype.copy.call(v,g),this.parser.assignFinalMaterial(v),d.push(v)}return u.isGroup?(u.clear(),u.add(...d),u):d[0]}))}}const Wu="glTF",xs=12,Bl={JSON:1313821514,BIN:5130562};class Nv{constructor(e){this.name=ke.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,xs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Wu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-xs,r=new DataView(e,xs);let o=0;for(;o<i;){const a=r.getUint32(o,!0);o+=4;const c=r.getUint32(o,!0);if(o+=4,c===Bl.JSON){const l=new Uint8Array(e,xs+o,a);this.content=n.decode(l)}else if(c===Bl.BIN){const l=xs+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Fv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ke.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const u in o){const h=da[u]||u.toLowerCase();a[h]=o[u]}for(const u in e.attributes){const h=da[u]||u.toLowerCase();if(o[u]!==void 0){const f=n.accessors[e.attributes[u]],d=Ki[f.componentType];l[h]=d.name,c[h]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,f){i.decodeDracoFile(u,function(d){for(const g in d.attributes){const _=d.attributes[g],m=c[g];m!==void 0&&(_.normalized=m)}h(d)},a,l,Tt,f)})})}}class Bv{constructor(){this.name=ke.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Ov{constructor(){this.name=ke.KHR_MESH_QUANTIZATION}}class Xu extends zs{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=i-t,h=(n-t)/u,f=h*h,d=f*h,g=e*l,_=g-l,m=-2*d+3*f,p=d-f,x=1-m,v=p-f+h;for(let M=0;M!==a;M++){const b=o[_+M+a],S=o[_+M+c]*u,E=o[g+M+a],L=o[g+M]*u;r[M]=x*b+v*S+m*E+p*L}return r}}const zv=new $n;class Hv extends Xu{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return zv.fromArray(r).normalize().toArray(r),r}}const en={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ki={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ol={9728:Ke,9729:nt,9984:sa,9985:ou,9986:Lr,9987:pi},zl={33071:tn,33648:Nr,10497:Ji},zo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},da={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Hn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Gv={CUBICSPLINE:void 0,LINEAR:es,STEP:Us},Ho={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function kv(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Ua({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:$t})),s.DefaultMaterial}function ri(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function kn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Vv(s,e,t){let n=!1,i=!1,r=!1;for(let l=0,u=e.length;l<u;l++){const h=e[l];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const o=[],a=[],c=[];for(let l=0,u=e.length;l<u;l++){const h=e[l];if(n){const f=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):s.attributes.position;o.push(f)}if(i){const f=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):s.attributes.normal;a.push(f)}if(r){const f=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):s.attributes.color;c.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const u=l[0],h=l[1],f=l[2];return n&&(s.morphAttributes.position=u),i&&(s.morphAttributes.normal=h),r&&(s.morphAttributes.color=f),s.morphTargetsRelative=!0,s})}function Wv(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Xv(s){let e;const t=s.extensions&&s.extensions[ke.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Go(t.attributes):e=s.indices+":"+Go(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Go(s.targets[n]);return e}function Go(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function pa(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function qv(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":"image/png"}const jv=new _e;class Yv{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new _v,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=!1,r=-1;typeof navigator<"u"&&(n=/^((?!chrome|android).)*safari/i.test(navigator.userAgent)===!0,i=navigator.userAgent.indexOf("Firefox")>-1,r=i?navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]:-1),typeof createImageBitmap>"u"||n||i&&r<98?this.textureLoader=new Q_(this.options.manager):this.textureLoader=new ov(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Vu(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return ri(r,a,i),kn(a,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const o=t[i].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,u]of o.children.entries())r(u,a.children[l])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ke.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,o){n.load(Ls.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const o=zo[i.type],a=Ki[i.componentType],c=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new it(l,o,c))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],c=zo[i.type],l=Ki[i.componentType],u=l.BYTES_PER_ELEMENT,h=u*c,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let _,m;if(d&&d!==h){const p=Math.floor(f/d),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let v=t.cache.get(x);v||(_=new l(a,p*d,i.count*d/u),v=new L_(_,d/u),t.cache.add(x,v)),m=new La(v,c,f%d/u,g)}else a===null?_=new l(i.count*c):_=new l(a,f,i.count*c),m=new it(_,c,g);if(i.sparse!==void 0){const p=zo.SCALAR,x=Ki[i.sparse.indices.componentType],v=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,b=new x(o[1],v,i.sparse.count*p),S=new l(o[2],M,i.sparse.count*c);a!==null&&(m=new it(m.array.slice(),m.itemSize,m.normalized));for(let E=0,L=b.length;E<L;E++){const y=b[E];if(m.setX(y,S[E*c]),c>=2&&m.setY(y,S[E*c+1]),c>=3&&m.setZ(y,S[E*c+2]),c>=4&&m.setW(y,S[E*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){const i=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const f=(r.samplers||{})[o.sampler]||{};return u.magFilter=Ol[f.magFilter]||nt,u.minFilter=Ol[f.minFilter]||pi,u.wrapS=zl[f.wrapS]||Ji,u.wrapT=zl[f.wrapT]||Ji,i.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const o=i.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(h){l=!0;const f=new Blob([h],{type:o.mimeType});return c=a.createObjectURL(f),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(c).then(function(h){return new Promise(function(f,d){let g=f;t.isImageBitmapLoader===!0&&(g=function(_){const m=new bt(_);m.needsUpdate=!0,f(m)}),t.load(Ls.resolveURL(h,r.path),g,void 0,d)})}).then(function(h){return l===!0&&a.revokeObjectURL(c),h.userData.mimeType=o.mimeType||qv(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[ke.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[ke.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=r.associations.get(o);o=r.extensions[ke.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Bu,vn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Fu,vn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return Ua}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let o;const a={},c=r.extensions||{},l=[];if(c[ke.KHR_MATERIALS_UNLIT]){const h=i[ke.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),l.push(h.extendParams(a,r,t))}else{const h=r.pbrMetallicRoughness||{};if(a.color=new he(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){const f=h.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],Tt),a.opacity=f[3]}h.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",h.baseColorTexture,ut)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=un);const u=r.alphaMode||Ho.OPAQUE;if(u===Ho.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Ho.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==li&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new xe(1,1),r.normalTexture.scale!==void 0)){const h=r.normalTexture.scale;a.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&o!==li&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==li){const h=r.emissiveFactor;a.emissive=new he().setRGB(h[0],h[1],h[2],Tt)}return r.emissiveTexture!==void 0&&o!==li&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,ut)),Promise.all(l).then(function(){const h=new o(a);return r.name&&(h.name=r.name),kn(h,r),t.associations.set(h,{materials:e}),r.extensions&&ri(i,h,r),h})}createUniqueName(e){const t=qe.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return Hl(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],u=Xv(l),h=i[u];if(h)o.push(h.promise);else{let f;l.extensions&&l.extensions[ke.KHR_DRACO_MESH_COMPRESSION]?f=r(l):f=Hl(new Lt,l,t),i[u]={primitive:l,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const u=o[c].material===void 0?kv(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),u=c[c.length-1],h=[];for(let d=0,g=u.length;d<g;d++){const _=u[d],m=o[d];let p;const x=l[d];if(m.mode===en.TRIANGLES||m.mode===en.TRIANGLE_STRIP||m.mode===en.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new I_(_,x):new Et(_,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===en.TRIANGLE_STRIP?p.geometry=Fl(p.geometry,du):m.mode===en.TRIANGLE_FAN&&(p.geometry=Fl(p.geometry,oa));else if(m.mode===en.LINES)p=new B_(_,x);else if(m.mode===en.LINE_STRIP)p=new Ia(_,x);else if(m.mode===en.LINE_LOOP)p=new O_(_,x);else if(m.mode===en.POINTS)p=new z_(_,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Wv(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),kn(p,r),m.extensions&&ri(i,p,m),t.assignFinalMaterial(p),h.push(p)}for(let d=0,g=h.length;d<g;d++)t.associations.set(h[d],{meshes:e,primitives:d});if(h.length===1)return r.extensions&&ri(i,h[0],r),h[0];const f=new ui;r.extensions&&ri(i,f,r),t.associations.set(f,{meshes:e});for(let d=0,g=h.length;d<g;d++)f.add(h[d]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ht(Sf.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Jn(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),kn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),o=i,a=[],c=[];for(let l=0,u=o.length;l<u;l++){const h=o[l];if(h){a.push(h);const f=new _e;r!==null&&f.fromArray(r.array,l*16),c.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Da(a,c)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],a=[],c=[],l=[],u=[];for(let h=0,f=i.channels.length;h<f;h++){const d=i.channels[h],g=i.samplers[d.sampler],_=d.target,m=_.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,x=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",x)),l.push(g),u.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(h){const f=h[0],d=h[1],g=h[2],_=h[3],m=h[4],p=[];for(let x=0,v=f.length;x<v;x++){const M=f[x],b=d[x],S=g[x],E=_[x],L=m[x];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();const y=n._createAnimationTracks(M,b,S,E,L);if(y)for(let T=0;T<y.length;T++)p.push(y[T])}return new q_(r,void 0,p)})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=i.weights.length;c<l;c++)a.morphTargetInfluences[c]=i.weights[c]}),o})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=i.children||[];for(let l=0,u=a.length;l<u;l++)o.push(n.getDependency("node",a[l]));const c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){const u=l[0],h=l[1],f=l[2];f!==null&&u.traverse(function(d){d.isSkinnedMesh&&d.bind(f,jv)});for(let d=0,g=h.length;d<g;d++)u.add(h[d]);return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",a=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new Nu:l.length>1?u=new ui:l.length===1?u=l[0]:u=new ot,u!==l[0])for(let h=0,f=l.length;h<f;h++)u.add(l[h]);if(r.name&&(u.userData.name=r.name,u.name=o),kn(u,r),r.extensions&&ri(n,u,r),r.matrix!==void 0){const h=new _e;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);return i.associations.has(u)||i.associations.set(u,{}),i.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new ui;n.name&&(r.name=i.createUniqueName(n.name)),kn(r,n),n.extensions&&ri(t,r,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(i.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,h=c.length;u<h;u++)r.add(c[u]);const l=u=>{const h=new Map;for(const[f,d]of i.associations)(f instanceof vn||f instanceof bt)&&h.set(f,d);return u.traverse(f=>{const d=i.associations.get(f);d!=null&&h.set(f,d)}),h};return i.associations=l(r),r})}_createAnimationTracks(e,t,n,i,r){const o=[],a=e.name?e.name:e.uuid,c=[];Hn[r.path]===Hn.weights?e.traverse(function(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}):c.push(a);let l;switch(Hn[r.path]){case Hn.weights:l=is;break;case Hn.rotation:l=mi;break;case Hn.position:case Hn.scale:l=ss;break;default:switch(n.itemSize){case 1:l=is;break;case 2:case 3:default:l=ss;break}break}const u=i.interpolation!==void 0?Gv[i.interpolation]:es,h=this._getArrayFromAccessor(n);for(let f=0,d=c.length;f<d;f++){const g=new l(c[f]+"."+Hn[r.path],t.array,h,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=pa(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof mi?Hv:Xu;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Kv(s,e,t){const n=e.attributes,i=new _t;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(i.set(new C(c[0],c[1],c[2]),new C(l[0],l[1],l[2])),a.normalized){const u=pa(Ki[a.componentType]);i.min.multiplyScalar(u),i.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const a=new C,c=new C;for(let l=0,u=r.length;l<u;l++){const h=r[l];if(h.POSITION!==void 0){const f=t.json.accessors[h.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){const _=pa(Ki[f.componentType]);c.multiplyScalar(_)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;const o=new dn;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function Hl(s,e,t){const n=e.attributes,i=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){s.setAttribute(a,c)})}for(const o in n){const a=da[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(e.indices!==void 0&&!s.index){const o=t.getDependency("accessor",e.indices).then(function(a){s.setIndex(a)});i.push(o)}return We.workingColorSpace!==Tt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${We.workingColorSpace}" not supported.`),kn(s,e),Kv(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Vv(s,e.targets,t):s})}const $r=0,$v=1,qu=2,Gl=2,ko=1.25,kl=1,Yn=6*4+4+4,Zr=65535,Zv=Math.pow(2,-24),Vo=Symbol("SKIP_GENERATION");function ju(s){return s.index?s.index.count:s.attributes.position.count}function us(s){return ju(s)/3}function Yu(s,e=ArrayBuffer){return s>65535?new Uint32Array(new e(4*s)):new Uint16Array(new e(2*s))}function Jv(s,e){if(!s.index){const t=s.attributes.position.count,n=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,i=Yu(t,n);s.setIndex(new it(i,1));for(let r=0;r<t;r++)i[r]=r}}function Ku(s,e){const t=us(s),n=e||s.drawRange,i=n.start/3,r=(n.start+n.count)/3,o=Math.max(0,i),a=Math.min(t,r)-o;return[{offset:Math.floor(o),count:Math.floor(a)}]}function $u(s,e){if(!s.groups||!s.groups.length)return Ku(s,e);const t=[],n=new Set,i=e||s.drawRange,r=i.start/3,o=(i.start+i.count)/3;for(const c of s.groups){const l=c.start/3,u=(c.start+c.count)/3;n.add(Math.max(r,l)),n.add(Math.min(o,u))}const a=Array.from(n.values()).sort((c,l)=>c-l);for(let c=0;c<a.length-1;c++){const l=a[c],u=a[c+1];t.push({offset:Math.floor(l),count:Math.floor(u-l)})}return t}function Qv(s,e){const t=us(s),n=$u(s,e).sort((o,a)=>o.offset-a.offset),i=n[n.length-1];i.count=Math.min(t-i.offset,i.count);let r=0;return n.forEach(({count:o})=>r+=o),t!==r}function Wo(s,e,t,n,i){let r=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,u=-1/0,h=1/0,f=1/0,d=1/0,g=-1/0,_=-1/0,m=-1/0;for(let p=e*6,x=(e+t)*6;p<x;p+=6){const v=s[p+0],M=s[p+1],b=v-M,S=v+M;b<r&&(r=b),S>c&&(c=S),v<h&&(h=v),v>g&&(g=v);const E=s[p+2],L=s[p+3],y=E-L,T=E+L;y<o&&(o=y),T>l&&(l=T),E<f&&(f=E),E>_&&(_=E);const D=s[p+4],I=s[p+5],B=D-I,P=D+I;B<a&&(a=B),P>u&&(u=P),D<d&&(d=D),D>m&&(m=D)}n[0]=r,n[1]=o,n[2]=a,n[3]=c,n[4]=l,n[5]=u,i[0]=h,i[1]=f,i[2]=d,i[3]=g,i[4]=_,i[5]=m}function ex(s,e=null,t=null,n=null){const i=s.attributes.position,r=s.index?s.index.array:null,o=us(s),a=i.normalized;let c;e===null?(c=new Float32Array(o*6*4),t=0,n=o):(c=e,t=t||0,n=n||o);const l=i.array,u=i.offset||0;let h=3;i.isInterleavedBufferAttribute&&(h=i.data.stride);const f=["getX","getY","getZ"];for(let d=t;d<t+n;d++){const g=d*3,_=d*6;let m=g+0,p=g+1,x=g+2;r&&(m=r[m],p=r[p],x=r[x]),a||(m=m*h+u,p=p*h+u,x=x*h+u);for(let v=0;v<3;v++){let M,b,S;a?(M=i[f[v]](m),b=i[f[v]](p),S=i[f[v]](x)):(M=l[m+v],b=l[p+v],S=l[x+v]);let E=M;b<E&&(E=b),S<E&&(E=S);let L=M;b>L&&(L=b),S>L&&(L=S);const y=(L-E)/2,T=v*2;c[_+T+0]=E+y,c[_+T+1]=y+(Math.abs(E)+y)*Zv}}return c}function lt(s,e,t){return t.min.x=e[s],t.min.y=e[s+1],t.min.z=e[s+2],t.max.x=e[s+3],t.max.y=e[s+4],t.max.z=e[s+5],t}function Vl(s){let e=-1,t=-1/0;for(let n=0;n<3;n++){const i=s[n+3]-s[n];i>t&&(t=i,e=n)}return e}function Wl(s,e){e.set(s)}function Xl(s,e,t){let n,i;for(let r=0;r<3;r++){const o=r+3;n=s[r],i=e[r],t[r]=n<i?n:i,n=s[o],i=e[o],t[o]=n>i?n:i}}function _r(s,e,t){for(let n=0;n<3;n++){const i=e[s+2*n],r=e[s+2*n+1],o=i-r,a=i+r;o<t[n]&&(t[n]=o),a>t[n+3]&&(t[n+3]=a)}}function ys(s){const e=s[3]-s[0],t=s[4]-s[1],n=s[5]-s[2];return 2*(e*t+t*n+n*e)}const Rn=32,tx=(s,e)=>s.candidate-e.candidate,Gn=new Array(Rn).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),vr=new Float32Array(6);function nx(s,e,t,n,i,r){let o=-1,a=0;if(r===$r)o=Vl(e),o!==-1&&(a=(e[o]+e[o+3])/2);else if(r===$v)o=Vl(s),o!==-1&&(a=ix(t,n,i,o));else if(r===qu){const c=ys(s);let l=ko*i;const u=n*6,h=(n+i)*6;for(let f=0;f<3;f++){const d=e[f],m=(e[f+3]-d)/Rn;if(i<Rn/4){const p=[...Gn];p.length=i;let x=0;for(let M=u;M<h;M+=6,x++){const b=p[x];b.candidate=t[M+2*f],b.count=0;const{bounds:S,leftCacheBounds:E,rightCacheBounds:L}=b;for(let y=0;y<3;y++)L[y]=1/0,L[y+3]=-1/0,E[y]=1/0,E[y+3]=-1/0,S[y]=1/0,S[y+3]=-1/0;_r(M,t,S)}p.sort(tx);let v=i;for(let M=0;M<v;M++){const b=p[M];for(;M+1<v&&p[M+1].candidate===b.candidate;)p.splice(M+1,1),v--}for(let M=u;M<h;M+=6){const b=t[M+2*f];for(let S=0;S<v;S++){const E=p[S];b>=E.candidate?_r(M,t,E.rightCacheBounds):(_r(M,t,E.leftCacheBounds),E.count++)}}for(let M=0;M<v;M++){const b=p[M],S=b.count,E=i-b.count,L=b.leftCacheBounds,y=b.rightCacheBounds;let T=0;S!==0&&(T=ys(L)/c);let D=0;E!==0&&(D=ys(y)/c);const I=kl+ko*(T*S+D*E);I<l&&(o=f,l=I,a=b.candidate)}}else{for(let v=0;v<Rn;v++){const M=Gn[v];M.count=0,M.candidate=d+m+v*m;const b=M.bounds;for(let S=0;S<3;S++)b[S]=1/0,b[S+3]=-1/0}for(let v=u;v<h;v+=6){let S=~~((t[v+2*f]-d)/m);S>=Rn&&(S=Rn-1);const E=Gn[S];E.count++,_r(v,t,E.bounds)}const p=Gn[Rn-1];Wl(p.bounds,p.rightCacheBounds);for(let v=Rn-2;v>=0;v--){const M=Gn[v],b=Gn[v+1];Xl(M.bounds,b.rightCacheBounds,M.rightCacheBounds)}let x=0;for(let v=0;v<Rn-1;v++){const M=Gn[v],b=M.count,S=M.bounds,L=Gn[v+1].rightCacheBounds;b!==0&&(x===0?Wl(S,vr):Xl(S,vr,vr)),x+=b;let y=0,T=0;x!==0&&(y=ys(vr)/c);const D=i-x;D!==0&&(T=ys(L)/c);const I=kl+ko*(y*x+T*D);I<l&&(o=f,l=I,a=M.candidate)}}}}else console.warn(`MeshBVH: Invalid build strategy value ${r} used.`);return{axis:o,pos:a}}function ix(s,e,t,n){let i=0;for(let r=e,o=e+t;r<o;r++)i+=s[r*6+n*2];return i/t}class Xo{constructor(){this.boundingData=new Float32Array(6)}}function sx(s,e,t,n,i,r){let o=n,a=n+i-1;const c=r.pos,l=r.axis*2;for(;;){for(;o<=a&&t[o*6+l]<c;)o++;for(;o<=a&&t[a*6+l]>=c;)a--;if(o<a){for(let u=0;u<3;u++){let h=e[o*3+u];e[o*3+u]=e[a*3+u],e[a*3+u]=h}for(let u=0;u<6;u++){let h=t[o*6+u];t[o*6+u]=t[a*6+u],t[a*6+u]=h}o++,a--}else return o}}function rx(s,e,t,n,i,r){let o=n,a=n+i-1;const c=r.pos,l=r.axis*2;for(;;){for(;o<=a&&t[o*6+l]<c;)o++;for(;o<=a&&t[a*6+l]>=c;)a--;if(o<a){let u=s[o];s[o]=s[a],s[a]=u;for(let h=0;h<6;h++){let f=t[o*6+h];t[o*6+h]=t[a*6+h],t[a*6+h]=f}o++,a--}else return o}}function Bt(s,e){return e[s+15]===65535}function Gt(s,e){return e[s+6]}function jt(s,e){return e[s+14]}function sn(s){return s+8}function Yt(s,e){return e[s+6]}function za(s,e){return e[s+7]}let Zu,As,Ir,Ju;const ox=Math.pow(2,32);function ma(s){return"count"in s?1:1+ma(s.left)+ma(s.right)}function ax(s,e,t){return Zu=new Float32Array(t),As=new Uint32Array(t),Ir=new Uint16Array(t),Ju=new Uint8Array(t),ga(s,e)}function ga(s,e){const t=s/4,n=s/2,i="count"in e,r=e.boundingData;for(let o=0;o<6;o++)Zu[t+o]=r[o];if(i)if(e.buffer){const o=e.buffer;Ju.set(new Uint8Array(o),s);for(let a=s,c=s+o.byteLength;a<c;a+=Yn){const l=a/2;Bt(l,Ir)||(As[a/4+6]+=t)}return s+o.byteLength}else{const o=e.offset,a=e.count;return As[t+6]=o,Ir[n+14]=a,Ir[n+15]=Zr,s+Yn}else{const o=e.left,a=e.right,c=e.splitAxis;let l;if(l=ga(s+Yn,o),l/4>ox)throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");return As[t+6]=l/4,l=ga(l,a),As[t+7]=c,l}}function cx(s,e){const t=(s.index?s.index.count:s.attributes.position.count)/3,n=t>2**16,i=n?4:2,r=e?new SharedArrayBuffer(t*i):new ArrayBuffer(t*i),o=n?new Uint32Array(r):new Uint16Array(r);for(let a=0,c=o.length;a<c;a++)o[a]=a;return o}function lx(s,e,t,n,i){const{maxDepth:r,verbose:o,maxLeafTris:a,strategy:c,onProgress:l,indirect:u}=i,h=s._indirectBuffer,f=s.geometry,d=f.index?f.index.array:null,g=u?rx:sx,_=us(f),m=new Float32Array(6);let p=!1;const x=new Xo;return Wo(e,t,n,x.boundingData,m),M(x,t,n,m),x;function v(b){l&&l(b/_)}function M(b,S,E,L=null,y=0){if(!p&&y>=r&&(p=!0,o&&(console.warn(`MeshBVH: Max depth of ${r} reached when generating BVH. Consider increasing maxDepth.`),console.warn(f))),E<=a||y>=r)return v(S+E),b.offset=S,b.count=E,b;const T=nx(b.boundingData,L,e,S,E,c);if(T.axis===-1)return v(S+E),b.offset=S,b.count=E,b;const D=g(h,d,e,S,E,T);if(D===S||D===S+E)v(S+E),b.offset=S,b.count=E;else{b.splitAxis=T.axis;const I=new Xo,B=S,P=D-S;b.left=I,Wo(e,B,P,I.boundingData,m),M(I,B,P,m,y+1);const N=new Xo,H=D,j=E-P;b.right=N,Wo(e,H,j,N.boundingData,m),M(N,H,j,m,y+1)}return b}}function ux(s,e){const t=s.geometry;e.indirect&&(s._indirectBuffer=cx(t,e.useSharedArrayBuffer),Qv(t,e.range)&&!e.verbose&&console.warn('MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),s._indirectBuffer||Jv(t,e);const n=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,i=ex(t),r=e.indirect?Ku(t,e.range):$u(t,e.range);s._roots=r.map(o=>{const a=lx(s,i,o.offset,o.count,e),c=ma(a),l=new n(Yn*c);return ax(0,a,l),l})}class In{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let n=1/0,i=-1/0;for(let r=0,o=e.length;r<o;r++){const c=e[r][t];n=c<n?c:n,i=c>i?c:i}this.min=n,this.max=i}setFromPoints(e,t){let n=1/0,i=-1/0;for(let r=0,o=t.length;r<o;r++){const a=t[r],c=e.dot(a);n=c<n?c:n,i=c>i?c:i}this.min=n,this.max=i}isSeparated(e){return this.min>e.max||e.min>this.max}}In.prototype.setFromBox=function(){const s=new C;return function(t,n){const i=n.min,r=n.max;let o=1/0,a=-1/0;for(let c=0;c<=1;c++)for(let l=0;l<=1;l++)for(let u=0;u<=1;u++){s.x=i.x*c+r.x*(1-c),s.y=i.y*l+r.y*(1-l),s.z=i.z*u+r.z*(1-u);const h=t.dot(s);o=Math.min(h,o),a=Math.max(h,a)}this.min=o,this.max=a}}();const hx=function(){const s=new C,e=new C,t=new C;return function(i,r,o){const a=i.start,c=s,l=r.start,u=e;t.subVectors(a,l),s.subVectors(i.end,i.start),e.subVectors(r.end,r.start);const h=t.dot(u),f=u.dot(c),d=u.dot(u),g=t.dot(c),m=c.dot(c)*d-f*f;let p,x;m!==0?p=(h*f-g*d)/m:p=0,x=(h+p*f)/d,o.x=p,o.y=x}}(),Ha=function(){const s=new xe,e=new C,t=new C;return function(i,r,o,a){hx(i,r,s);let c=s.x,l=s.y;if(c>=0&&c<=1&&l>=0&&l<=1){i.at(c,o),r.at(l,a);return}else if(c>=0&&c<=1){l<0?r.at(0,a):r.at(1,a),i.closestPointToPoint(a,!0,o);return}else if(l>=0&&l<=1){c<0?i.at(0,o):i.at(1,o),r.closestPointToPoint(o,!0,a);return}else{let u;c<0?u=i.start:u=i.end;let h;l<0?h=r.start:h=r.end;const f=e,d=t;if(i.closestPointToPoint(h,!0,e),r.closestPointToPoint(u,!0,t),f.distanceToSquared(h)<=d.distanceToSquared(u)){o.copy(f),a.copy(h);return}else{o.copy(u),a.copy(d);return}}}}(),fx=function(){const s=new C,e=new C,t=new Cn,n=new Ln;return function(r,o){const{radius:a,center:c}=r,{a:l,b:u,c:h}=o;if(n.start=l,n.end=u,n.closestPointToPoint(c,!0,s).distanceTo(c)<=a||(n.start=l,n.end=h,n.closestPointToPoint(c,!0,s).distanceTo(c)<=a)||(n.start=u,n.end=h,n.closestPointToPoint(c,!0,s).distanceTo(c)<=a))return!0;const _=o.getPlane(t);if(Math.abs(_.distanceToPoint(c))<=a){const p=_.projectPoint(c,e);if(o.containsPoint(p))return!0}return!1}}(),dx=1e-15;function qo(s){return Math.abs(s)<dx}class fn extends Ct{constructor(...e){super(...e),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new C),this.satBounds=new Array(4).fill().map(()=>new In),this.points=[this.a,this.b,this.c],this.sphere=new dn,this.plane=new Cn,this.needsUpdate=!0}intersectsSphere(e){return fx(e,this)}update(){const e=this.a,t=this.b,n=this.c,i=this.points,r=this.satAxes,o=this.satBounds,a=r[0],c=o[0];this.getNormal(a),c.setFromPoints(a,i);const l=r[1],u=o[1];l.subVectors(e,t),u.setFromPoints(l,i);const h=r[2],f=o[2];h.subVectors(t,n),f.setFromPoints(h,i);const d=r[3],g=o[3];d.subVectors(n,e),g.setFromPoints(d,i),this.sphere.setFromPoints(this.points),this.plane.setFromNormalAndCoplanarPoint(a,e),this.needsUpdate=!1}}fn.prototype.closestPointToSegment=function(){const s=new C,e=new C,t=new Ln;return function(i,r=null,o=null){const{start:a,end:c}=i,l=this.points;let u,h=1/0;for(let f=0;f<3;f++){const d=(f+1)%3;t.start.copy(l[f]),t.end.copy(l[d]),Ha(t,i,s,e),u=s.distanceToSquared(e),u<h&&(h=u,r&&r.copy(s),o&&o.copy(e))}return this.closestPointToPoint(a,s),u=a.distanceToSquared(s),u<h&&(h=u,r&&r.copy(s),o&&o.copy(a)),this.closestPointToPoint(c,s),u=c.distanceToSquared(s),u<h&&(h=u,r&&r.copy(s),o&&o.copy(c)),Math.sqrt(h)}}();fn.prototype.intersectsTriangle=function(){const s=new fn,e=new Array(3),t=new Array(3),n=new In,i=new In,r=new C,o=new C,a=new C,c=new C,l=new C,u=new Ln,h=new Ln,f=new Ln,d=new C;function g(_,m,p){const x=_.points;let v=0,M=-1;for(let b=0;b<3;b++){const{start:S,end:E}=u;S.copy(x[b]),E.copy(x[(b+1)%3]),u.delta(o);const L=qo(m.distanceToPoint(S));if(qo(m.normal.dot(o))&&L){p.copy(u),v=2;break}const y=m.intersectLine(u,d);if(!y&&L&&d.copy(S),(y||L)&&!qo(d.distanceTo(E))){if(v<=1)(v===1?p.start:p.end).copy(d),L&&(M=v);else if(v>=2){(M===1?p.start:p.end).copy(d),v=2;break}if(v++,v===2&&M===-1)break}}return v}return function(m,p=null,x=!1){this.needsUpdate&&this.update(),m.isExtendedTriangle?m.needsUpdate&&m.update():(s.copy(m),s.update(),m=s);const v=this.plane,M=m.plane;if(Math.abs(v.normal.dot(M.normal))>1-1e-10){const b=this.satBounds,S=this.satAxes;t[0]=m.a,t[1]=m.b,t[2]=m.c;for(let y=0;y<4;y++){const T=b[y],D=S[y];if(n.setFromPoints(D,t),T.isSeparated(n))return!1}const E=m.satBounds,L=m.satAxes;e[0]=this.a,e[1]=this.b,e[2]=this.c;for(let y=0;y<4;y++){const T=E[y],D=L[y];if(n.setFromPoints(D,e),T.isSeparated(n))return!1}for(let y=0;y<4;y++){const T=S[y];for(let D=0;D<4;D++){const I=L[D];if(r.crossVectors(T,I),n.setFromPoints(r,e),i.setFromPoints(r,t),n.isSeparated(i))return!1}}return p&&(x||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),p.start.set(0,0,0),p.end.set(0,0,0)),!0}else{const b=g(this,M,h);if(b===1&&m.containsPoint(h.end))return p&&(p.start.copy(h.end),p.end.copy(h.end)),!0;if(b!==2)return!1;const S=g(m,v,f);if(S===1&&this.containsPoint(f.end))return p&&(p.start.copy(f.end),p.end.copy(f.end)),!0;if(S!==2)return!1;if(h.delta(a),f.delta(c),a.dot(c)<0){let B=f.start;f.start=f.end,f.end=B}const E=h.start.dot(a),L=h.end.dot(a),y=f.start.dot(a),T=f.end.dot(a),D=L<y,I=E<T;return E!==T&&y!==L&&D===I?!1:(p&&(l.subVectors(h.start,f.start),l.dot(a)>0?p.start.copy(h.start):p.start.copy(f.start),l.subVectors(h.end,f.end),l.dot(a)<0?p.end.copy(h.end):p.end.copy(f.end)),!0)}}}();fn.prototype.distanceToPoint=function(){const s=new C;return function(t){return this.closestPointToPoint(t,s),t.distanceTo(s)}}();fn.prototype.distanceToTriangle=function(){const s=new C,e=new C,t=["a","b","c"],n=new Ln,i=new Ln;return function(o,a=null,c=null){const l=a||c?n:null;if(this.intersectsTriangle(o,l))return(a||c)&&(a&&l.getCenter(a),c&&l.getCenter(c)),0;let u=1/0;for(let h=0;h<3;h++){let f;const d=t[h],g=o[d];this.closestPointToPoint(g,s),f=g.distanceToSquared(s),f<u&&(u=f,a&&a.copy(s),c&&c.copy(g));const _=this[d];o.closestPointToPoint(_,s),f=_.distanceToSquared(s),f<u&&(u=f,a&&a.copy(_),c&&c.copy(s))}for(let h=0;h<3;h++){const f=t[h],d=t[(h+1)%3];n.set(this[f],this[d]);for(let g=0;g<3;g++){const _=t[g],m=t[(g+1)%3];i.set(o[_],o[m]),Ha(n,i,s,e);const p=s.distanceToSquared(e);p<u&&(u=p,a&&a.copy(s),c&&c.copy(e))}}return Math.sqrt(u)}}();class zt{constructor(e,t,n){this.isOrientedBox=!0,this.min=new C,this.max=new C,this.matrix=new _e,this.invMatrix=new _e,this.points=new Array(8).fill().map(()=>new C),this.satAxes=new Array(3).fill().map(()=>new C),this.satBounds=new Array(3).fill().map(()=>new In),this.alignedSatBounds=new Array(3).fill().map(()=>new In),this.needsUpdate=!1,e&&this.min.copy(e),t&&this.max.copy(t),n&&this.matrix.copy(n)}set(e,t,n){this.min.copy(e),this.max.copy(t),this.matrix.copy(n),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}}zt.prototype.update=function(){return function(){const e=this.matrix,t=this.min,n=this.max,i=this.points;for(let l=0;l<=1;l++)for(let u=0;u<=1;u++)for(let h=0;h<=1;h++){const f=1*l|2*u|4*h,d=i[f];d.x=l?n.x:t.x,d.y=u?n.y:t.y,d.z=h?n.z:t.z,d.applyMatrix4(e)}const r=this.satBounds,o=this.satAxes,a=i[0];for(let l=0;l<3;l++){const u=o[l],h=r[l],f=1<<l,d=i[f];u.subVectors(a,d),h.setFromPoints(u,i)}const c=this.alignedSatBounds;c[0].setFromPointsField(i,"x"),c[1].setFromPointsField(i,"y"),c[2].setFromPointsField(i,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}}();zt.prototype.intersectsBox=function(){const s=new In;return function(t){this.needsUpdate&&this.update();const n=t.min,i=t.max,r=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(s.min=n.x,s.max=i.x,a[0].isSeparated(s)||(s.min=n.y,s.max=i.y,a[1].isSeparated(s))||(s.min=n.z,s.max=i.z,a[2].isSeparated(s)))return!1;for(let c=0;c<3;c++){const l=o[c],u=r[c];if(s.setFromBox(l,t),u.isSeparated(s))return!1}return!0}}();zt.prototype.intersectsTriangle=function(){const s=new fn,e=new Array(3),t=new In,n=new In,i=new C;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(s.copy(o),s.update(),o=s);const a=this.satBounds,c=this.satAxes;e[0]=o.a,e[1]=o.b,e[2]=o.c;for(let f=0;f<3;f++){const d=a[f],g=c[f];if(t.setFromPoints(g,e),d.isSeparated(t))return!1}const l=o.satBounds,u=o.satAxes,h=this.points;for(let f=0;f<3;f++){const d=l[f],g=u[f];if(t.setFromPoints(g,h),d.isSeparated(t))return!1}for(let f=0;f<3;f++){const d=c[f];for(let g=0;g<4;g++){const _=u[g];if(i.crossVectors(d,_),t.setFromPoints(i,e),n.setFromPoints(i,h),t.isSeparated(n))return!1}}return!0}}();zt.prototype.closestPointToPoint=function(){return function(e,t){return this.needsUpdate&&this.update(),t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),t}}();zt.prototype.distanceToPoint=function(){const s=new C;return function(t){return this.closestPointToPoint(t,s),t.distanceTo(s)}}();zt.prototype.distanceToBox=function(){const s=["x","y","z"],e=new Array(12).fill().map(()=>new Ln),t=new Array(12).fill().map(()=>new Ln),n=new C,i=new C;return function(o,a=0,c=null,l=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(c||l)&&(o.getCenter(i),this.closestPointToPoint(i,n),o.closestPointToPoint(n,i),c&&c.copy(n),l&&l.copy(i)),0;const u=a*a,h=o.min,f=o.max,d=this.points;let g=1/0;for(let m=0;m<8;m++){const p=d[m];i.copy(p).clamp(h,f);const x=p.distanceToSquared(i);if(x<g&&(g=x,c&&c.copy(p),l&&l.copy(i),x<u))return Math.sqrt(x)}let _=0;for(let m=0;m<3;m++)for(let p=0;p<=1;p++)for(let x=0;x<=1;x++){const v=(m+1)%3,M=(m+2)%3,b=p<<v|x<<M,S=1<<m|p<<v|x<<M,E=d[b],L=d[S];e[_].set(E,L);const T=s[m],D=s[v],I=s[M],B=t[_],P=B.start,N=B.end;P[T]=h[T],P[D]=p?h[D]:f[D],P[I]=x?h[I]:f[D],N[T]=f[T],N[D]=p?h[D]:f[D],N[I]=x?h[I]:f[D],_++}for(let m=0;m<=1;m++)for(let p=0;p<=1;p++)for(let x=0;x<=1;x++){i.x=m?f.x:h.x,i.y=p?f.y:h.y,i.z=x?f.z:h.z,this.closestPointToPoint(i,n);const v=i.distanceToSquared(n);if(v<g&&(g=v,c&&c.copy(n),l&&l.copy(i),v<u))return Math.sqrt(v)}for(let m=0;m<12;m++){const p=e[m];for(let x=0;x<12;x++){const v=t[x];Ha(p,v,n,i);const M=n.distanceToSquared(i);if(M<g&&(g=M,c&&c.copy(n),l&&l.copy(i),M<u))return Math.sqrt(M)}}return Math.sqrt(g)}}();class Ga{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){const e=this._primitives;return e.length===0?this._getNewPrimitive():e.pop()}releasePrimitive(e){this._primitives.push(e)}}class px extends Ga{constructor(){super(()=>new fn)}}const rn=new px;class mx{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const e=[];let t=null;this.setBuffer=n=>{t&&e.push(t),t=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0&&this.setBuffer(e.pop())}}}const tt=new mx;let Xn,qi;const Ii=[],xr=new Ga(()=>new _t);function gx(s,e,t,n,i,r){Xn=xr.getPrimitive(),qi=xr.getPrimitive(),Ii.push(Xn,qi),tt.setBuffer(s._roots[e]);const o=_a(0,s.geometry,t,n,i,r);tt.clearBuffer(),xr.releasePrimitive(Xn),xr.releasePrimitive(qi),Ii.pop(),Ii.pop();const a=Ii.length;return a>0&&(qi=Ii[a-1],Xn=Ii[a-2]),o}function _a(s,e,t,n,i=null,r=0,o=0){const{float32Array:a,uint16Array:c,uint32Array:l}=tt;let u=s*2;if(Bt(u,c)){const f=Gt(s,l),d=jt(u,c);return lt(s,a,Xn),n(f,d,!1,o,r+s,Xn)}else{let T=function(I){const{uint16Array:B,uint32Array:P}=tt;let N=I*2;for(;!Bt(N,B);)I=sn(I),N=I*2;return Gt(I,P)},D=function(I){const{uint16Array:B,uint32Array:P}=tt;let N=I*2;for(;!Bt(N,B);)I=Yt(I,P),N=I*2;return Gt(I,P)+jt(N,B)};const f=sn(s),d=Yt(s,l);let g=f,_=d,m,p,x,v;if(i&&(x=Xn,v=qi,lt(g,a,x),lt(_,a,v),m=i(x),p=i(v),p<m)){g=d,_=f;const I=m;m=p,p=I,x=v}x||(x=Xn,lt(g,a,x));const M=Bt(g*2,c),b=t(x,M,m,o+1,r+g);let S;if(b===Gl){const I=T(g),P=D(g)-I;S=n(I,P,!0,o+1,r+g,x)}else S=b&&_a(g,e,t,n,i,r,o+1);if(S)return!0;v=qi,lt(_,a,v);const E=Bt(_*2,c),L=t(v,E,p,o+1,r+_);let y;if(L===Gl){const I=T(_),P=D(_)-I;y=n(I,P,!0,o+1,r+_,v)}else y=L&&_a(_,e,t,n,i,r,o+1);return!!y}}const Ms=new C,jo=new C;function _x(s,e,t={},n=0,i=1/0){const r=n*n,o=i*i;let a=1/0,c=null;if(s.shapecast({boundsTraverseOrder:u=>(Ms.copy(e).clamp(u.min,u.max),Ms.distanceToSquared(e)),intersectsBounds:(u,h,f)=>f<a&&f<o,intersectsTriangle:(u,h)=>{u.closestPointToPoint(e,Ms);const f=e.distanceToSquared(Ms);return f<a&&(jo.copy(Ms),a=f,c=h),f<r}}),a===1/0)return null;const l=Math.sqrt(a);return t.point?t.point.copy(jo):t.point=jo.clone(),t.distance=l,t.faceIndex=c,t}const Ui=new C,Ni=new C,Fi=new C,yr=new xe,Mr=new xe,Sr=new xe,ql=new C,jl=new C,Yl=new C,Tr=new C;function vx(s,e,t,n,i,r,o,a){let c;if(r===Ot?c=s.intersectTriangle(n,t,e,!0,i):c=s.intersectTriangle(e,t,n,r!==un,i),c===null)return null;const l=s.origin.distanceTo(i);return l<o||l>a?null:{distance:l,point:i.clone()}}function xx(s,e,t,n,i,r,o,a,c,l,u){Ui.fromBufferAttribute(e,r),Ni.fromBufferAttribute(e,o),Fi.fromBufferAttribute(e,a);const h=vx(s,Ui,Ni,Fi,Tr,c,l,u);if(h){n&&(yr.fromBufferAttribute(n,r),Mr.fromBufferAttribute(n,o),Sr.fromBufferAttribute(n,a),h.uv=Ct.getInterpolation(Tr,Ui,Ni,Fi,yr,Mr,Sr,new xe)),i&&(yr.fromBufferAttribute(i,r),Mr.fromBufferAttribute(i,o),Sr.fromBufferAttribute(i,a),h.uv1=Ct.getInterpolation(Tr,Ui,Ni,Fi,yr,Mr,Sr,new xe)),t&&(ql.fromBufferAttribute(t,r),jl.fromBufferAttribute(t,o),Yl.fromBufferAttribute(t,a),h.normal=Ct.getInterpolation(Tr,Ui,Ni,Fi,ql,jl,Yl,new C),h.normal.dot(s.direction)>0&&h.normal.multiplyScalar(-1));const f={a:r,b:o,c:a,normal:new C,materialIndex:0};Ct.getNormal(Ui,Ni,Fi,f.normal),h.face=f,h.faceIndex=r}return h}function Jr(s,e,t,n,i,r,o){const a=n*3;let c=a+0,l=a+1,u=a+2;const h=s.index;s.index&&(c=h.getX(c),l=h.getX(l),u=h.getX(u));const{position:f,normal:d,uv:g,uv1:_}=s.attributes,m=xx(t,f,d,g,_,c,l,u,e,r,o);return m?(m.faceIndex=n,i&&i.push(m),m):null}function pt(s,e,t,n){const i=s.a,r=s.b,o=s.c;let a=e,c=e+1,l=e+2;t&&(a=t.getX(a),c=t.getX(c),l=t.getX(l)),i.x=n.getX(a),i.y=n.getY(a),i.z=n.getZ(a),r.x=n.getX(c),r.y=n.getY(c),r.z=n.getZ(c),o.x=n.getX(l),o.y=n.getY(l),o.z=n.getZ(l)}function yx(s,e,t,n,i,r,o,a){const{geometry:c,_indirectBuffer:l}=s;for(let u=n,h=n+i;u<h;u++)Jr(c,e,t,u,r,o,a)}function Mx(s,e,t,n,i,r,o){const{geometry:a,_indirectBuffer:c}=s;let l=1/0,u=null;for(let h=n,f=n+i;h<f;h++){let d;d=Jr(a,e,t,h,null,r,o),d&&d.distance<l&&(u=d,l=d.distance)}return u}function Sx(s,e,t,n,i,r,o){const{geometry:a}=t,{index:c}=a,l=a.attributes.position;for(let u=s,h=e+s;u<h;u++){let f;if(f=u,pt(o,f*3,c,l),o.needsUpdate=!0,n(o,f,i,r))return!0}return!1}function Tx(s,e=null){e&&Array.isArray(e)&&(e=new Set(e));const t=s.geometry,n=t.index?t.index.array:null,i=t.attributes.position;let r,o,a,c,l=0;const u=s._roots;for(let f=0,d=u.length;f<d;f++)r=u[f],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),h(0,l),l+=r.byteLength;function h(f,d,g=!1){const _=f*2;if(a[_+15]===Zr){const p=o[f+6],x=a[_+14];let v=1/0,M=1/0,b=1/0,S=-1/0,E=-1/0,L=-1/0;for(let y=3*p,T=3*(p+x);y<T;y++){let D=n[y];const I=i.getX(D),B=i.getY(D),P=i.getZ(D);I<v&&(v=I),I>S&&(S=I),B<M&&(M=B),B>E&&(E=B),P<b&&(b=P),P>L&&(L=P)}return c[f+0]!==v||c[f+1]!==M||c[f+2]!==b||c[f+3]!==S||c[f+4]!==E||c[f+5]!==L?(c[f+0]=v,c[f+1]=M,c[f+2]=b,c[f+3]=S,c[f+4]=E,c[f+5]=L,!0):!1}else{const p=f+8,x=o[f+6],v=p+d,M=x+d;let b=g,S=!1,E=!1;e?b||(S=e.has(v),E=e.has(M),b=!S&&!E):(S=!0,E=!0);const L=b||S,y=b||E;let T=!1;L&&(T=h(p,d,b));let D=!1;y&&(D=h(x,d,b));const I=T||D;if(I)for(let B=0;B<3;B++){const P=p+B,N=x+B,H=c[P],j=c[P+3],q=c[N],X=c[N+3];c[f+B]=H<q?H:q,c[f+B+3]=j>X?j:X}return I}}}function Kn(s,e,t,n,i){let r,o,a,c,l,u;const h=1/t.direction.x,f=1/t.direction.y,d=1/t.direction.z,g=t.origin.x,_=t.origin.y,m=t.origin.z;let p=e[s],x=e[s+3],v=e[s+1],M=e[s+3+1],b=e[s+2],S=e[s+3+2];return h>=0?(r=(p-g)*h,o=(x-g)*h):(r=(x-g)*h,o=(p-g)*h),f>=0?(a=(v-_)*f,c=(M-_)*f):(a=(M-_)*f,c=(v-_)*f),r>c||a>o||((a>r||isNaN(r))&&(r=a),(c<o||isNaN(o))&&(o=c),d>=0?(l=(b-m)*d,u=(S-m)*d):(l=(S-m)*d,u=(b-m)*d),r>u||l>o)?!1:((l>r||r!==r)&&(r=l),(u<o||o!==o)&&(o=u),r<=i&&o>=n)}function Ex(s,e,t,n,i,r,o,a){const{geometry:c,_indirectBuffer:l}=s;for(let u=n,h=n+i;u<h;u++){let f=l?l[u]:u;Jr(c,e,t,f,r,o,a)}}function bx(s,e,t,n,i,r,o){const{geometry:a,_indirectBuffer:c}=s;let l=1/0,u=null;for(let h=n,f=n+i;h<f;h++){let d;d=Jr(a,e,t,c?c[h]:h,null,r,o),d&&d.distance<l&&(u=d,l=d.distance)}return u}function Ax(s,e,t,n,i,r,o){const{geometry:a}=t,{index:c}=a,l=a.attributes.position;for(let u=s,h=e+s;u<h;u++){let f;if(f=t.resolveTriangleIndex(u),pt(o,f*3,c,l),o.needsUpdate=!0,n(o,f,i,r))return!0}return!1}function wx(s,e,t,n,i,r,o){tt.setBuffer(s._roots[e]),va(0,s,t,n,i,r,o),tt.clearBuffer()}function va(s,e,t,n,i,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=tt,u=s*2;if(Bt(u,c)){const f=Gt(s,l),d=jt(u,c);yx(e,t,n,f,d,i,r,o)}else{const f=sn(s);Kn(f,a,n,r,o)&&va(f,e,t,n,i,r,o);const d=Yt(s,l);Kn(d,a,n,r,o)&&va(d,e,t,n,i,r,o)}}const Rx=["x","y","z"];function Cx(s,e,t,n,i,r){tt.setBuffer(s._roots[e]);const o=xa(0,s,t,n,i,r);return tt.clearBuffer(),o}function xa(s,e,t,n,i,r){const{float32Array:o,uint16Array:a,uint32Array:c}=tt;let l=s*2;if(Bt(l,a)){const h=Gt(s,c),f=jt(l,a);return Mx(e,t,n,h,f,i,r)}else{const h=za(s,c),f=Rx[h],g=n.direction[f]>=0;let _,m;g?(_=sn(s),m=Yt(s,c)):(_=Yt(s,c),m=sn(s));const x=Kn(_,o,n,i,r)?xa(_,e,t,n,i,r):null;if(x){const b=x.point[f];if(g?b<=o[m+h]:b>=o[m+h+3])return x}const M=Kn(m,o,n,i,r)?xa(m,e,t,n,i,r):null;return x&&M?x.distance<=M.distance?x:M:x||M||null}}const Er=new _t,Bi=new fn,Oi=new fn,Ss=new _e,Kl=new zt,br=new zt;function Px(s,e,t,n){tt.setBuffer(s._roots[e]);const i=ya(0,s,t,n);return tt.clearBuffer(),i}function ya(s,e,t,n,i=null){const{float32Array:r,uint16Array:o,uint32Array:a}=tt;let c=s*2;if(i===null&&(t.boundingBox||t.computeBoundingBox(),Kl.set(t.boundingBox.min,t.boundingBox.max,n),i=Kl),Bt(c,o)){const u=e.geometry,h=u.index,f=u.attributes.position,d=t.index,g=t.attributes.position,_=Gt(s,a),m=jt(c,o);if(Ss.copy(n).invert(),t.boundsTree)return lt(s,r,br),br.matrix.copy(Ss),br.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:x=>br.intersectsBox(x),intersectsTriangle:x=>{x.a.applyMatrix4(n),x.b.applyMatrix4(n),x.c.applyMatrix4(n),x.needsUpdate=!0;for(let v=_*3,M=(m+_)*3;v<M;v+=3)if(pt(Oi,v,h,f),Oi.needsUpdate=!0,x.intersectsTriangle(Oi))return!0;return!1}});for(let p=_*3,x=(m+_)*3;p<x;p+=3){pt(Bi,p,h,f),Bi.a.applyMatrix4(Ss),Bi.b.applyMatrix4(Ss),Bi.c.applyMatrix4(Ss),Bi.needsUpdate=!0;for(let v=0,M=d.count;v<M;v+=3)if(pt(Oi,v,d,g),Oi.needsUpdate=!0,Bi.intersectsTriangle(Oi))return!0}}else{const u=s+8,h=a[s+6];return lt(u,r,Er),!!(i.intersectsBox(Er)&&ya(u,e,t,n,i)||(lt(h,r,Er),i.intersectsBox(Er)&&ya(h,e,t,n,i)))}}const Ar=new _e,Yo=new zt,Ts=new zt,Lx=new C,Dx=new C,Ix=new C,Ux=new C;function Nx(s,e,t,n={},i={},r=0,o=1/0){e.boundingBox||e.computeBoundingBox(),Yo.set(e.boundingBox.min,e.boundingBox.max,t),Yo.needsUpdate=!0;const a=s.geometry,c=a.attributes.position,l=a.index,u=e.attributes.position,h=e.index,f=rn.getPrimitive(),d=rn.getPrimitive();let g=Lx,_=Dx,m=null,p=null;i&&(m=Ix,p=Ux);let x=1/0,v=null,M=null;return Ar.copy(t).invert(),Ts.matrix.copy(Ar),s.shapecast({boundsTraverseOrder:b=>Yo.distanceToBox(b),intersectsBounds:(b,S,E)=>E<x&&E<o?(S&&(Ts.min.copy(b.min),Ts.max.copy(b.max),Ts.needsUpdate=!0),!0):!1,intersectsRange:(b,S)=>{if(e.boundsTree)return e.boundsTree.shapecast({boundsTraverseOrder:L=>Ts.distanceToBox(L),intersectsBounds:(L,y,T)=>T<x&&T<o,intersectsRange:(L,y)=>{for(let T=L,D=L+y;T<D;T++){pt(d,3*T,h,u),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let I=b,B=b+S;I<B;I++){pt(f,3*I,l,c),f.needsUpdate=!0;const P=f.distanceToTriangle(d,g,m);if(P<x&&(_.copy(g),p&&p.copy(m),x=P,v=I,M=T),P<r)return!0}}}});{const E=us(e);for(let L=0,y=E;L<y;L++){pt(d,3*L,h,u),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let T=b,D=b+S;T<D;T++){pt(f,3*T,l,c),f.needsUpdate=!0;const I=f.distanceToTriangle(d,g,m);if(I<x&&(_.copy(g),p&&p.copy(m),x=I,v=T,M=L),I<r)return!0}}}}}),rn.releasePrimitive(f),rn.releasePrimitive(d),x===1/0?null:(n.point?n.point.copy(_):n.point=_.clone(),n.distance=x,n.faceIndex=v,i&&(i.point?i.point.copy(p):i.point=p.clone(),i.point.applyMatrix4(Ar),_.applyMatrix4(Ar),i.distance=_.sub(i.point).length(),i.faceIndex=M),n)}function Fx(s,e=null){e&&Array.isArray(e)&&(e=new Set(e));const t=s.geometry,n=t.index?t.index.array:null,i=t.attributes.position;let r,o,a,c,l=0;const u=s._roots;for(let f=0,d=u.length;f<d;f++)r=u[f],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),h(0,l),l+=r.byteLength;function h(f,d,g=!1){const _=f*2;if(a[_+15]===Zr){const p=o[f+6],x=a[_+14];let v=1/0,M=1/0,b=1/0,S=-1/0,E=-1/0,L=-1/0;for(let y=p,T=p+x;y<T;y++){const D=3*s.resolveTriangleIndex(y);for(let I=0;I<3;I++){let B=D+I;B=n?n[B]:B;const P=i.getX(B),N=i.getY(B),H=i.getZ(B);P<v&&(v=P),P>S&&(S=P),N<M&&(M=N),N>E&&(E=N),H<b&&(b=H),H>L&&(L=H)}}return c[f+0]!==v||c[f+1]!==M||c[f+2]!==b||c[f+3]!==S||c[f+4]!==E||c[f+5]!==L?(c[f+0]=v,c[f+1]=M,c[f+2]=b,c[f+3]=S,c[f+4]=E,c[f+5]=L,!0):!1}else{const p=f+8,x=o[f+6],v=p+d,M=x+d;let b=g,S=!1,E=!1;e?b||(S=e.has(v),E=e.has(M),b=!S&&!E):(S=!0,E=!0);const L=b||S,y=b||E;let T=!1;L&&(T=h(p,d,b));let D=!1;y&&(D=h(x,d,b));const I=T||D;if(I)for(let B=0;B<3;B++){const P=p+B,N=x+B,H=c[P],j=c[P+3],q=c[N],X=c[N+3];c[f+B]=H<q?H:q,c[f+B+3]=j>X?j:X}return I}}}function Bx(s,e,t,n,i,r,o){tt.setBuffer(s._roots[e]),Ma(0,s,t,n,i,r,o),tt.clearBuffer()}function Ma(s,e,t,n,i,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=tt,u=s*2;if(Bt(u,c)){const f=Gt(s,l),d=jt(u,c);Ex(e,t,n,f,d,i,r,o)}else{const f=sn(s);Kn(f,a,n,r,o)&&Ma(f,e,t,n,i,r,o);const d=Yt(s,l);Kn(d,a,n,r,o)&&Ma(d,e,t,n,i,r,o)}}const Ox=["x","y","z"];function zx(s,e,t,n,i,r){tt.setBuffer(s._roots[e]);const o=Sa(0,s,t,n,i,r);return tt.clearBuffer(),o}function Sa(s,e,t,n,i,r){const{float32Array:o,uint16Array:a,uint32Array:c}=tt;let l=s*2;if(Bt(l,a)){const h=Gt(s,c),f=jt(l,a);return bx(e,t,n,h,f,i,r)}else{const h=za(s,c),f=Ox[h],g=n.direction[f]>=0;let _,m;g?(_=sn(s),m=Yt(s,c)):(_=Yt(s,c),m=sn(s));const x=Kn(_,o,n,i,r)?Sa(_,e,t,n,i,r):null;if(x){const b=x.point[f];if(g?b<=o[m+h]:b>=o[m+h+3])return x}const M=Kn(m,o,n,i,r)?Sa(m,e,t,n,i,r):null;return x&&M?x.distance<=M.distance?x:M:x||M||null}}const wr=new _t,zi=new fn,Hi=new fn,Es=new _e,$l=new zt,Rr=new zt;function Hx(s,e,t,n){tt.setBuffer(s._roots[e]);const i=Ta(0,s,t,n);return tt.clearBuffer(),i}function Ta(s,e,t,n,i=null){const{float32Array:r,uint16Array:o,uint32Array:a}=tt;let c=s*2;if(i===null&&(t.boundingBox||t.computeBoundingBox(),$l.set(t.boundingBox.min,t.boundingBox.max,n),i=$l),Bt(c,o)){const u=e.geometry,h=u.index,f=u.attributes.position,d=t.index,g=t.attributes.position,_=Gt(s,a),m=jt(c,o);if(Es.copy(n).invert(),t.boundsTree)return lt(s,r,Rr),Rr.matrix.copy(Es),Rr.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:x=>Rr.intersectsBox(x),intersectsTriangle:x=>{x.a.applyMatrix4(n),x.b.applyMatrix4(n),x.c.applyMatrix4(n),x.needsUpdate=!0;for(let v=_,M=m+_;v<M;v++)if(pt(Hi,3*e.resolveTriangleIndex(v),h,f),Hi.needsUpdate=!0,x.intersectsTriangle(Hi))return!0;return!1}});for(let p=_,x=m+_;p<x;p++){const v=e.resolveTriangleIndex(p);pt(zi,3*v,h,f),zi.a.applyMatrix4(Es),zi.b.applyMatrix4(Es),zi.c.applyMatrix4(Es),zi.needsUpdate=!0;for(let M=0,b=d.count;M<b;M+=3)if(pt(Hi,M,d,g),Hi.needsUpdate=!0,zi.intersectsTriangle(Hi))return!0}}else{const u=s+8,h=a[s+6];return lt(u,r,wr),!!(i.intersectsBox(wr)&&Ta(u,e,t,n,i)||(lt(h,r,wr),i.intersectsBox(wr)&&Ta(h,e,t,n,i)))}}const Cr=new _e,Ko=new zt,bs=new zt,Gx=new C,kx=new C,Vx=new C,Wx=new C;function Xx(s,e,t,n={},i={},r=0,o=1/0){e.boundingBox||e.computeBoundingBox(),Ko.set(e.boundingBox.min,e.boundingBox.max,t),Ko.needsUpdate=!0;const a=s.geometry,c=a.attributes.position,l=a.index,u=e.attributes.position,h=e.index,f=rn.getPrimitive(),d=rn.getPrimitive();let g=Gx,_=kx,m=null,p=null;i&&(m=Vx,p=Wx);let x=1/0,v=null,M=null;return Cr.copy(t).invert(),bs.matrix.copy(Cr),s.shapecast({boundsTraverseOrder:b=>Ko.distanceToBox(b),intersectsBounds:(b,S,E)=>E<x&&E<o?(S&&(bs.min.copy(b.min),bs.max.copy(b.max),bs.needsUpdate=!0),!0):!1,intersectsRange:(b,S)=>{if(e.boundsTree){const E=e.boundsTree;return E.shapecast({boundsTraverseOrder:L=>bs.distanceToBox(L),intersectsBounds:(L,y,T)=>T<x&&T<o,intersectsRange:(L,y)=>{for(let T=L,D=L+y;T<D;T++){const I=E.resolveTriangleIndex(T);pt(d,3*I,h,u),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let B=b,P=b+S;B<P;B++){const N=s.resolveTriangleIndex(B);pt(f,3*N,l,c),f.needsUpdate=!0;const H=f.distanceToTriangle(d,g,m);if(H<x&&(_.copy(g),p&&p.copy(m),x=H,v=B,M=T),H<r)return!0}}}})}else{const E=us(e);for(let L=0,y=E;L<y;L++){pt(d,3*L,h,u),d.a.applyMatrix4(t),d.b.applyMatrix4(t),d.c.applyMatrix4(t),d.needsUpdate=!0;for(let T=b,D=b+S;T<D;T++){const I=s.resolveTriangleIndex(T);pt(f,3*I,l,c),f.needsUpdate=!0;const B=f.distanceToTriangle(d,g,m);if(B<x&&(_.copy(g),p&&p.copy(m),x=B,v=T,M=L),B<r)return!0}}}}}),rn.releasePrimitive(f),rn.releasePrimitive(d),x===1/0?null:(n.point?n.point.copy(_):n.point=_.clone(),n.distance=x,n.faceIndex=v,i&&(i.point?i.point.copy(p):i.point=p.clone(),i.point.applyMatrix4(Cr),_.applyMatrix4(Cr),i.distance=_.sub(i.point).length(),i.faceIndex=M),n)}function qx(){return typeof SharedArrayBuffer<"u"}const Ds=new tt.constructor,Gr=new tt.constructor,Vn=new Ga(()=>new _t),Gi=new _t,ki=new _t,$o=new _t,Zo=new _t;let Jo=!1;function jx(s,e,t,n){if(Jo)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");Jo=!0;const i=s._roots,r=e._roots;let o,a=0,c=0;const l=new _e().copy(t).invert();for(let u=0,h=i.length;u<h;u++){Ds.setBuffer(i[u]),c=0;const f=Vn.getPrimitive();lt(0,Ds.float32Array,f),f.applyMatrix4(l);for(let d=0,g=r.length;d<g&&(Gr.setBuffer(r[d]),o=ln(0,0,t,l,n,a,c,0,0,f),Gr.clearBuffer(),c+=r[d].length,!o);d++);if(Vn.releasePrimitive(f),Ds.clearBuffer(),a+=i[u].length,o)break}return Jo=!1,o}function ln(s,e,t,n,i,r=0,o=0,a=0,c=0,l=null,u=!1){let h,f;u?(h=Gr,f=Ds):(h=Ds,f=Gr);const d=h.float32Array,g=h.uint32Array,_=h.uint16Array,m=f.float32Array,p=f.uint32Array,x=f.uint16Array,v=s*2,M=e*2,b=Bt(v,_),S=Bt(M,x);let E=!1;if(S&&b)u?E=i(Gt(e,p),jt(e*2,x),Gt(s,g),jt(s*2,_),c,o+e,a,r+s):E=i(Gt(s,g),jt(s*2,_),Gt(e,p),jt(e*2,x),a,r+s,c,o+e);else if(S){const L=Vn.getPrimitive();lt(e,m,L),L.applyMatrix4(t);const y=sn(s),T=Yt(s,g);lt(y,d,Gi),lt(T,d,ki);const D=L.intersectsBox(Gi),I=L.intersectsBox(ki);E=D&&ln(e,y,n,t,i,o,r,c,a+1,L,!u)||I&&ln(e,T,n,t,i,o,r,c,a+1,L,!u),Vn.releasePrimitive(L)}else{const L=sn(e),y=Yt(e,p);lt(L,m,$o),lt(y,m,Zo);const T=l.intersectsBox($o),D=l.intersectsBox(Zo);if(T&&D)E=ln(s,L,t,n,i,r,o,a,c+1,l,u)||ln(s,y,t,n,i,r,o,a,c+1,l,u);else if(T)if(b)E=ln(s,L,t,n,i,r,o,a,c+1,l,u);else{const I=Vn.getPrimitive();I.copy($o).applyMatrix4(t);const B=sn(s),P=Yt(s,g);lt(B,d,Gi),lt(P,d,ki);const N=I.intersectsBox(Gi),H=I.intersectsBox(ki);E=N&&ln(L,B,n,t,i,o,r,c,a+1,I,!u)||H&&ln(L,P,n,t,i,o,r,c,a+1,I,!u),Vn.releasePrimitive(I)}else if(D)if(b)E=ln(s,y,t,n,i,r,o,a,c+1,l,u);else{const I=Vn.getPrimitive();I.copy(Zo).applyMatrix4(t);const B=sn(s),P=Yt(s,g);lt(B,d,Gi),lt(P,d,ki);const N=I.intersectsBox(Gi),H=I.intersectsBox(ki);E=N&&ln(y,B,n,t,i,o,r,c,a+1,I,!u)||H&&ln(y,P,n,t,i,o,r,c,a+1,I,!u),Vn.releasePrimitive(I)}}return E}const Pr=new zt,Zl=new _t,Yx={strategy:$r,maxDepth:40,maxLeafTris:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null};class Qr{static serialize(e,t={}){t={cloneBuffers:!0,...t};const n=e.geometry,i=e._roots,r=e._indirectBuffer,o=n.getIndex();let a;return t.cloneBuffers?a={roots:i.map(c=>c.slice()),index:o?o.array.slice():null,indirectBuffer:r?r.slice():null}:a={roots:i,index:o?o.array:null,indirectBuffer:r},a}static deserialize(e,t,n={}){n={setIndex:!0,indirect:!!e.indirectBuffer,...n};const{index:i,roots:r,indirectBuffer:o}=e,a=new Qr(t,{...n,[Vo]:!0});if(a._roots=r,a._indirectBuffer=o||null,n.setIndex){const c=t.getIndex();if(c===null){const l=new it(e.index,1,!1);t.setIndex(l)}else c.array!==i&&(c.array.set(i),c.needsUpdate=!0)}return a}get indirect(){return!!this._indirectBuffer}constructor(e,t={}){if(e.isBufferGeometry){if(e.index&&e.index.isInterleavedBufferAttribute)throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("MeshBVH: Only BufferGeometries are supported.");if(t=Object.assign({...Yx,[Vo]:!1},t),t.useSharedArrayBuffer&&!qx())throw new Error("MeshBVH: SharedArrayBuffer is not available.");this.geometry=e,this._roots=null,this._indirectBuffer=null,t[Vo]||(ux(this,t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new _t))),this.resolveTriangleIndex=t.indirect?n=>this._indirectBuffer[n]:n=>n}refit(e=null){return(this.indirect?Fx:Tx)(this,e)}traverse(e,t=0){const n=this._roots[t],i=new Uint32Array(n),r=new Uint16Array(n);o(0);function o(a,c=0){const l=a*2,u=r[l+15]===Zr;if(u){const h=i[a+6],f=r[l+14];e(c,u,new Float32Array(n,a*4,6),h,f)}else{const h=a+Yn/4,f=i[a+6],d=i[a+7];e(c,u,new Float32Array(n,a*4,6),d)||(o(h,c+1),o(f,c+1))}}}raycast(e,t=$t,n=0,i=1/0){const r=this._roots,o=this.geometry,a=[],c=t.isMaterial,l=Array.isArray(t),u=o.groups,h=c?t.side:t,f=this.indirect?Bx:wx;for(let d=0,g=r.length;d<g;d++){const _=l?t[u[d].materialIndex].side:h,m=a.length;if(f(this,d,_,e,a,n,i),l){const p=u[d].materialIndex;for(let x=m,v=a.length;x<v;x++)a[x].face.materialIndex=p}}return a}raycastFirst(e,t=$t,n=0,i=1/0){const r=this._roots,o=this.geometry,a=t.isMaterial,c=Array.isArray(t);let l=null;const u=o.groups,h=a?t.side:t,f=this.indirect?zx:Cx;for(let d=0,g=r.length;d<g;d++){const _=c?t[u[d].materialIndex].side:h,m=f(this,d,_,e,n,i);m!=null&&(l==null||m.distance<l.distance)&&(l=m,c&&(m.face.materialIndex=u[d].materialIndex))}return l}intersectsGeometry(e,t){let n=!1;const i=this._roots,r=this.indirect?Hx:Px;for(let o=0,a=i.length;o<a&&(n=r(this,o,e,t),!n);o++);return n}shapecast(e){const t=rn.getPrimitive(),n=this.indirect?Ax:Sx;let{boundsTraverseOrder:i,intersectsBounds:r,intersectsRange:o,intersectsTriangle:a}=e;if(o&&a){const h=o;o=(f,d,g,_,m)=>h(f,d,g,_,m)?!0:n(f,d,this,a,g,_,t)}else o||(a?o=(h,f,d,g)=>n(h,f,this,a,d,g,t):o=(h,f,d)=>d);let c=!1,l=0;const u=this._roots;for(let h=0,f=u.length;h<f;h++){const d=u[h];if(c=gx(this,h,r,o,i,l),c)break;l+=d.byteLength}return rn.releasePrimitive(t),c}bvhcast(e,t,n){let{intersectsRanges:i,intersectsTriangles:r}=n;const o=rn.getPrimitive(),a=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?g=>{const _=this.resolveTriangleIndex(g);pt(o,_*3,a,c)}:g=>{pt(o,g*3,a,c)},u=rn.getPrimitive(),h=e.geometry.index,f=e.geometry.attributes.position,d=e.indirect?g=>{const _=e.resolveTriangleIndex(g);pt(u,_*3,h,f)}:g=>{pt(u,g*3,h,f)};if(r){const g=(_,m,p,x,v,M,b,S)=>{for(let E=p,L=p+x;E<L;E++){d(E),u.a.applyMatrix4(t),u.b.applyMatrix4(t),u.c.applyMatrix4(t),u.needsUpdate=!0;for(let y=_,T=_+m;y<T;y++)if(l(y),o.needsUpdate=!0,r(o,u,y,E,v,M,b,S))return!0}return!1};if(i){const _=i;i=function(m,p,x,v,M,b,S,E){return _(m,p,x,v,M,b,S,E)?!0:g(m,p,x,v,M,b,S,E)}}else i=g}return jx(this,e,t,i)}intersectsBox(e,t){return Pr.set(e.min,e.max,t),Pr.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Pr.intersectsBox(n),intersectsTriangle:n=>Pr.intersectsTriangle(n)})}intersectsSphere(e){return this.shapecast({intersectsBounds:t=>e.intersectsBox(t),intersectsTriangle:t=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,n={},i={},r=0,o=1/0){return(this.indirect?Xx:Nx)(this,e,t,n,i,r,o)}closestPointToPoint(e,t={},n=0,i=1/0){return _x(this,e,t,n,i)}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach(n=>{lt(0,new Float32Array(n),Zl),e.union(Zl)}),e}}function Kx(s){switch(s){case 1:return"R";case 2:return"RG";case 3:return"RGBA";case 4:return"RGBA"}throw new Error}function $x(s){switch(s){case 1:return uu;case 2:return hu;case 3:return ht;case 4:return ht}}function Jl(s){switch(s){case 1:return Aa;case 2:return Xr;case 3:return Is;case 4:return Is}}class Qu extends Fs{constructor(){super(),this.minFilter=Ke,this.magFilter=Ke,this.generateMipmaps=!1,this.overrideItemSize=null,this._forcedType=null}updateFrom(e){const t=this.overrideItemSize,n=e.itemSize,i=e.count;if(t!==null){if(n*i%t!==0)throw new Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");e.itemSize=t,e.count=i*n/t}const r=e.itemSize,o=e.count,a=e.normalized,c=e.array.constructor,l=c.BYTES_PER_ELEMENT;let u=this._forcedType,h=r;if(u===null)switch(c){case Float32Array:u=Pt;break;case Uint8Array:case Uint16Array:case Uint32Array:u=qt;break;case Int8Array:case Int16Array:case Int32Array:u=ws;break}let f,d,g,_,m=Kx(r);switch(u){case Pt:g=1,d=$x(r),a&&l===1?(_=c,m+="8",c===Uint8Array?f=_n:(f=ra,m+="_SNORM")):(_=Float32Array,m+="32F",f=Pt);break;case ws:m+=l*8+"I",g=a?Math.pow(2,c.BYTES_PER_ELEMENT*8-1):1,d=Jl(r),l===1?(_=Int8Array,f=ra):l===2?(_=Int16Array,f=au):(_=Int32Array,f=ws);break;case qt:m+=l*8+"UI",g=a?Math.pow(2,c.BYTES_PER_ELEMENT*8-1):1,d=Jl(r),l===1?(_=Uint8Array,f=_n):l===2?(_=Uint16Array,f=Wr):(_=Uint32Array,f=qt);break}h===3&&(d===ht||d===Is)&&(h=4);const p=Math.ceil(Math.sqrt(o))||1,x=h*p*p,v=new _(x),M=e.normalized;e.normalized=!1;for(let b=0;b<o;b++){const S=h*b;v[S]=e.getX(b)/g,r>=2&&(v[S+1]=e.getY(b)/g),r>=3&&(v[S+2]=e.getZ(b)/g,h===4&&(v[S+3]=1)),r>=4&&(v[S+3]=e.getW(b)/g)}e.normalized=M,this.internalFormat=m,this.format=d,this.type=f,this.image.width=p,this.image.height=p,this.image.data=v,this.needsUpdate=!0,this.dispose(),e.itemSize=n,e.count=i}}class Zx extends Qu{constructor(){super(),this._forcedType=qt}}class Ea extends Qu{constructor(){super(),this._forcedType=Pt}}class Ql{constructor(){this.index=new Zx,this.position=new Ea,this.bvhBounds=new Fs,this.bvhContents=new Fs,this._cachedIndexAttr=null,this.index.overrideItemSize=3}updateFrom(e){const{geometry:t}=e;if(Qx(e,this.bvhBounds,this.bvhContents),this.position.updateFrom(t.attributes.position),e.indirect){const n=e._indirectBuffer;if(this._cachedIndexAttr===null||this._cachedIndexAttr.count!==n.length)if(t.index)this._cachedIndexAttr=t.index.clone();else{const i=Yu(ju(t));this._cachedIndexAttr=new it(i,1,!1)}Jx(t,n,this._cachedIndexAttr),this.index.updateFrom(this._cachedIndexAttr)}else this.index.updateFrom(t.index)}dispose(){const{index:e,position:t,bvhBounds:n,bvhContents:i}=this;e&&e.dispose(),t&&t.dispose(),n&&n.dispose(),i&&i.dispose()}}function Jx(s,e,t){const n=t.array,i=s.index?s.index.array:null;for(let r=0,o=e.length;r<o;r++){const a=3*r,c=3*e[r];for(let l=0;l<3;l++)n[a+l]=i?i[c+l]:c+l}}function Qx(s,e,t){const n=s._roots;if(n.length!==1)throw new Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");const i=n[0],r=new Uint16Array(i),o=new Uint32Array(i),a=new Float32Array(i),c=i.byteLength/Yn,l=2*Math.ceil(Math.sqrt(c/2)),u=new Float32Array(4*l*l),h=Math.ceil(Math.sqrt(c)),f=new Uint32Array(2*h*h);for(let d=0;d<c;d++){const g=d*Yn/4,_=g*2,m=g;for(let p=0;p<3;p++)u[8*d+0+p]=a[m+0+p],u[8*d+4+p]=a[m+3+p];if(Bt(_,r)){const p=jt(_,r),x=Gt(g,o),v=4294901760|p;f[d*2+0]=v,f[d*2+1]=x}else{const p=4*Yt(g,o)/Yn,x=za(g,o);f[d*2+0]=x,f[d*2+1]=p}}e.image.data=u,e.image.width=l,e.image.height=l,e.format=ht,e.type=Pt,e.internalFormat="RGBA32F",e.minFilter=Ke,e.magFilter=Ke,e.generateMipmaps=!1,e.needsUpdate=!0,e.dispose(),t.image.data=f,t.image.width=h,t.image.height=h,t.format=Xr,t.type=qt,t.internalFormat="RG32UI",t.minFilter=Ke,t.magFilter=Ke,t.generateMipmaps=!1,t.needsUpdate=!0,t.dispose()}const e0=`

// A stack of uint32 indices can can store the indices for
// a perfectly balanced tree with a depth up to 31. Lower stack
// depth gets higher performance.
//
// However not all trees are balanced. Best value to set this to
// is the trees max depth.
#ifndef BVH_STACK_DEPTH
#define BVH_STACK_DEPTH 60
#endif

#ifndef INFINITY
#define INFINITY 1e20
#endif

// Utilities
uvec4 uTexelFetch1D( usampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

ivec4 iTexelFetch1D( isampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 texelFetch1D( sampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {

	return
		barycoord.x * texelFetch1D( tex, faceIndices.x ) +
		barycoord.y * texelFetch1D( tex, faceIndices.y ) +
		barycoord.z * texelFetch1D( tex, faceIndices.z );

}

void ndcToCameraRay(
	vec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,
	out vec3 rayOrigin, out vec3 rayDirection
) {

	// get camera look direction and near plane for camera clipping
	vec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );
	vec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );
	float near = abs( nearVector.z / nearVector.w );

	// get the camera direction and position from camera matrices
	vec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );
	direction /= direction.w;
	direction = cameraWorld * direction - origin;

	// slide the origin along the ray until it sits at the near clip plane position
	origin.xyz += direction.xyz * near / dot( direction, lookDirection );

	rayOrigin = origin.xyz;
	rayDirection = direction.xyz;

}
`,t0=`

#ifndef TRI_INTERSECT_EPSILON
#define TRI_INTERSECT_EPSILON 1e-5
#endif

// Raycasting
bool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {

	// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/
	// https://tavianator.com/2011/ray_box.html
	vec3 invDir = 1.0 / rayDirection;

	// find intersection distances for each plane
	vec3 tMinPlane = invDir * ( boundsMin - rayOrigin );
	vec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );

	// get the min and max distances from each intersection
	vec3 tMinHit = min( tMaxPlane, tMinPlane );
	vec3 tMaxHit = max( tMaxPlane, tMinPlane );

	// get the furthest hit distance
	vec2 t = max( tMinHit.xx, tMinHit.yz );
	float t0 = max( t.x, t.y );

	// get the minimum hit distance
	t = min( tMaxHit.xx, tMaxHit.yz );
	float t1 = min( t.x, t.y );

	// set distance to 0.0 if the ray starts inside the box
	dist = max( t0, 0.0 );

	return t1 >= dist;

}

bool intersectsTriangle(
	vec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,
	out vec3 barycoord, out vec3 norm, out float dist, out float side
) {

	// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
	vec3 edge1 = b - a;
	vec3 edge2 = c - a;
	norm = cross( edge1, edge2 );

	float det = - dot( rayDirection, norm );
	float invdet = 1.0 / det;

	vec3 AO = rayOrigin - a;
	vec3 DAO = cross( AO, rayDirection );

	vec4 uvt;
	uvt.x = dot( edge2, DAO ) * invdet;
	uvt.y = - dot( edge1, DAO ) * invdet;
	uvt.z = dot( AO, norm ) * invdet;
	uvt.w = 1.0 - uvt.x - uvt.y;

	// set the hit information
	barycoord = uvt.wxy; // arranged in A, B, C order
	dist = uvt.z;
	side = sign( det );
	norm = side * normalize( norm );

	// add an epsilon to avoid misses between triangles
	uvt += vec4( TRI_INTERSECT_EPSILON );

	return all( greaterThanEqual( uvt, vec4( 0.0 ) ) );

}

bool intersectTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// outputs
	inout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	bool found = false;
	vec3 localBarycoord, localNormal;
	float localDist, localSide;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		if (
			intersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )
			&& localDist < minDistance
		) {

			found = true;
			minDistance = localDist;

			faceIndices = uvec4( indices.xyz, i );
			faceNormal = localNormal;

			side = localSide;
			barycoord = localBarycoord;
			dist = localDist;

		}

	}

	return found;

}

bool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhIntersectFirstHit(		bvh,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)	_bvhIntersectFirstHit(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)

bool _bvhIntersectFirstHit(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// output variables split into separate variables due to output precision
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int ptr = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float triangleDistance = INFINITY;
	bool found = false;
	while ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ ptr ];
		ptr --;

		// check if we intersect the current bounds
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > triangleDistance
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			found = intersectTriangles(
				bvh_position, bvh_index, offset, count,
				rayOrigin, rayDirection, triangleDistance,
				faceIndices, faceNormal, barycoord, side, dist
			) || found;

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = boundsInfo.y;

			bool leftToRight = rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			ptr ++;
			stack[ ptr ] = c2;

			ptr ++;
			stack[ ptr ] = c1;

		}

	}

	return found;

}
`,n0=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,eh=n0,th=`
	${e0}
	${t0}
`,kr=16,Qo=256;class i0{constructor(){this.staticBvh=null,this.staticBvhUniform=new Ql,this.staticAttrTex=new Ea,this.dynamicBvh=null,this.dynamicBvhUniform=new Ql,this.dynamicAttrTex=new Ea,this.dynamicMerged=null,this.dynamicPacked=null,this.dynamicPackedAttr=null,this.dynamic=[],this.hasDynamic=!1,this.materialsTex=null,this.materials=[],this.lightPosType=[],this.lightColorRadius=[],this.lightCount=0,this.emissiveTriCount=0,this.triangleCount=0,this._m3=new De,this._normalFrame=0,this._dynBuildVolume=null}updateDynamic(){if(!this.hasDynamic||this.dynamic.length===0)return;const e=this.dynamicMerged.getAttribute("position"),t=e.array,n=this.dynamicPacked;let i=1/0,r=1/0,o=1/0,a=-1/0,c=-1/0,l=-1/0;for(const h of this.dynamic){h.mesh.updateWorldMatrix(!0,!1);const f=h.mesh.matrixWorld.elements,d=this._m3.getNormalMatrix(h.mesh.matrixWorld).elements,g=h.localPos,_=h.localNorm;let m=h.start*3,p=h.start*4;for(let x=0;x<h.count;x++){const v=g[x*3],M=g[x*3+1],b=g[x*3+2],S=f[0]*v+f[4]*M+f[8]*b+f[12],E=f[1]*v+f[5]*M+f[9]*b+f[13],L=f[2]*v+f[6]*M+f[10]*b+f[14];t[m]=S,t[m+1]=E,t[m+2]=L,S<i&&(i=S),S>a&&(a=S),E<r&&(r=E),E>c&&(c=E),L<o&&(o=L),L>l&&(l=L);const y=_[x*3],T=_[x*3+1],D=_[x*3+2],I=d[0]*y+d[3]*T+d[6]*D,B=d[1]*y+d[4]*T+d[7]*D,P=d[2]*y+d[5]*T+d[8]*D,N=1/(Math.hypot(I,B,P)||1);n[p]=I*N,n[p+1]=B*N,n[p+2]=P*N,m+=3,p+=4}}e.needsUpdate=!0;const u=Math.max(a-i,1e-6)*Math.max(c-r,1e-6)*Math.max(l-o,1e-6);this._dynBuildVolume==null&&(this._dynBuildVolume=u),u>this._dynBuildVolume*3||u<this._dynBuildVolume/3?(this.dynamicBvh=new Qr(this.dynamicMerged,{strategy:$r}),this._dynBuildVolume=u):this.dynamicBvh.refit(),this.dynamicBvhUniform.updateFrom(this.dynamicBvh),this._normalFrame++%8===0&&this.dynamicAttrTex.updateFrom(this.dynamicPackedAttr)}dispose(){this.staticBvhUniform.dispose(),this.staticAttrTex.dispose(),this.dynamicBvhUniform.dispose(),this.dynamicAttrTex.dispose(),this.materialsTex&&this.materialsTex.dispose(),this.staticBvh&&this.staticBvh.geometry.dispose(),this.dynamicMerged&&this.dynamicMerged.dispose()}}function s0(s,e){const t=s.geometry.index?s.geometry.toNonIndexed():s.geometry.clone();t.getAttribute("normal")||t.computeVertexNormals();const n=t.getAttribute("position").array.slice(),i=t.getAttribute("normal").array.slice(),r=new Lt;r.setAttribute("position",t.getAttribute("position").clone()),r.setAttribute("normal",t.getAttribute("normal").clone()),r.applyMatrix4(s.matrixWorld);const o=r.getAttribute("position").count,a=new Float32Array(o).fill(e);return r.setAttribute("materialIndex",new it(a,1)),{geo:r,localPos:n,localNorm:i,count:o}}function nh(s){if(s.emissiveMap!=null||!s.emissive)return null;const e=s.emissiveIntensity??1;return e<=0||s.emissive.r+s.emissive.g+s.emissive.b<=0?null:[s.emissive.r*e,s.emissive.g*e,s.emissive.b*e]}function r0(s,e){const t=Math.max(s.length*2,e.length*4,2),n=new Float32Array(t*2*4);s.forEach((o,a)=>{const c=a*8,l=o.color??new he(1,1,1),u=nh(o)??[0,0,0];n[c+0]=l.r,n[c+1]=l.g,n[c+2]=l.b,n[c+3]=o.roughness??1,n[c+4]=u[0],n[c+5]=u[1],n[c+6]=u[2],n[c+7]=o.metalness??0});const i=t*4;e.forEach((o,a)=>{const c=i+a*16;n[c+0]=o.v0[0],n[c+1]=o.v0[1],n[c+2]=o.v0[2],n[c+3]=o.area,n[c+4]=o.e1[0],n[c+5]=o.e1[1],n[c+6]=o.e1[2],n[c+7]=o.emit[0],n[c+8]=o.e2[0],n[c+9]=o.e2[1],n[c+10]=o.e2[2],n[c+11]=o.emit[1],n[c+12]=o.n[0],n[c+13]=o.n[1],n[c+14]=o.n[2],n[c+15]=o.emit[2]});const r=new Fs(n,t,2,ht,Pt);return r.minFilter=Ke,r.magFilter=Ke,r.needsUpdate=!0,r}function o0(s,e,t){const n=s.getAttribute("position").array;for(let i=0;i+8<n.length;i+=9){const r=[n[i+3]-n[i],n[i+4]-n[i+1],n[i+5]-n[i+2]],o=[n[i+6]-n[i],n[i+7]-n[i+1],n[i+8]-n[i+2]],a=r[1]*o[2]-r[2]*o[1],c=r[2]*o[0]-r[0]*o[2],l=r[0]*o[1]-r[1]*o[0],u=Math.hypot(a,c,l);u<1e-10||t.push({v0:[n[i],n[i+1],n[i+2]],e1:r,e2:o,n:[a/u,c/u,l/u],area:u*.5,emit:e})}}function a0(){const s=new Lt;return s.setAttribute("position",new it(new Float32Array(9),3)),s.setAttribute("normal",new it(new Float32Array([0,1,0,0,1,0,0,1,0]),3)),s.setAttribute("materialIndex",new it(new Float32Array(3),1)),s}function c0(s){const e=s.getAttribute("normal"),t=s.getAttribute("materialIndex"),n=e.count,i=new Float32Array(n*4);for(let r=0;r<n;r++)i[r*4]=e.getX(r),i[r*4+1]=e.getY(r),i[r*4+2]=e.getZ(r),i[r*4+3]=t.getX(r);return{packed:i,attr:new it(i,4)}}function eu(s,{dynamic:e}){const t=s.length>0?gv(s,!1):a0(),n=new Qr(t,{strategy:e?$r:qu});return{merged:t,bvh:n,...c0(t)}}function l0(s,e={}){s.updateMatrixWorld(!0);const t=e.dynamicMeshes?new Set(e.dynamicMeshes):null,n=new i0,i=n.materials,r=[],o=[],a=[];let c=0;const l=[];if(s.traverse(d=>{if(!d.isMesh||!d.geometry||!d.visible||d.userData.rtExclude)return;const g=Array.isArray(d.material)?d.material[0]:d.material;if(g.transparent)return;let _=i.indexOf(g);_<0&&(_=i.length,i.push(g));const m=s0(d,_);l.push(m.geo);const p=t&&t.has(d);if(!p){const x=nh(g);x&&o0(m.geo,x,a)}p?(o.push(m.geo),n.dynamic.push({mesh:d,start:c,count:m.count,localPos:m.localPos,localNorm:m.localNorm}),c+=m.count):r.push(m.geo)}),r.length===0&&o.length===0)throw new Error("three-realtime-rt: no meshes found in scene");const u=eu(r,{dynamic:!1});n.staticBvh=u.bvh,n.staticBvhUniform.updateFrom(u.bvh),n.staticAttrTex.updateFrom(u.attr),n.hasDynamic=o.length>0;const h=eu(o,{dynamic:!0});n.dynamicMerged=h.merged,n.dynamicBvh=h.bvh,n.dynamicBvhUniform.updateFrom(h.bvh),n.dynamicPacked=h.packed,n.dynamicPackedAttr=h.attr,n.dynamicAttrTex.updateFrom(h.attr),n.triangleCount=(u.merged.getAttribute("position").count+(n.hasDynamic?h.merged.getAttribute("position").count:0))/3,u.merged.computeBoundingBox();const f=u.merged.boundingBox;n.sceneDiagonal=f.isEmpty()?1:f.min.distanceTo(f.max),a.length>Qo&&(console.warn(`three-realtime-rt: ${a.length} emissive triangles exceed the NEE cap of ${Qo}; keeping the largest by area. Dropped triangles no longer act as lights — prefer low-poly emitter meshes.`),a.sort((d,g)=>g.area-d.area),a.length=Qo),n.emissiveTriCount=a.length,n.materialsTex=r0(i,a),ih(s,n);for(const d of l)d!==u.merged&&d!==h.merged&&d.dispose();return n}function ih(s,e){const t=e.lightPosType,n=e.lightColorRadius;t.length=0,n.length=0;let i=0;const r=new C,o=new C;for(s.traverse(a=>{if(!(!a.isLight||!a.visible||a.intensity<=0)&&!(i>=kr)){if(a.isPointLight)a.getWorldPosition(r),t.push(r.x,r.y,r.z,0),n.push(a.color.r*a.intensity,a.color.g*a.intensity,a.color.b*a.intensity,a.userData.rtRadius??.15),i++;else if(a.isDirectionalLight){a.getWorldPosition(r),a.target.getWorldPosition(o);const c=o.sub(r).normalize();t.push(c.x,c.y,c.z,1),n.push(a.color.r*a.intensity,a.color.g*a.intensity,a.color.b*a.intensity,a.userData.rtRadius??.02),i++}}}),e.lightCount=i;t.length<kr*4;)t.push(0,0,0,0),n.push(0,0,0,0)}const u0=`
out vec3 vWorldPos;
out vec3 vWorldNormal;
out vec2 vUvCoord;

uniform mat3 uNormalMatrixWorld;

void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(uNormalMatrixWorld * normal);
  vUvCoord = uv;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,h0=`
precision highp float;

layout(location = 0) out vec4 gAlbedoRough;
layout(location = 1) out vec4 gNormalMetal;
layout(location = 2) out vec4 gWorldPos;
layout(location = 3) out vec4 gEmissive;

in vec3 vWorldPos;
in vec3 vWorldNormal;
in vec2 vUvCoord;

uniform vec3 uColor;
uniform float uRoughness;
uniform float uMetalness;
uniform float uTransmission;
uniform vec3 uEmissive;
uniform sampler2D uMap;
uniform bool uHasMap;
uniform sampler2D uEmissiveMap;
uniform bool uHasEmissiveMap;

void main() {
  vec3 albedo = uColor;
  if (uHasMap) {
    albedo *= texture(uMap, vUvCoord).rgb;
  }
  vec3 emissive = uEmissive;
  if (uHasEmissiveMap) {
    emissive *= texture(uEmissiveMap, vUvCoord).rgb;
  }
  vec3 n = normalize(vWorldNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  gAlbedoRough = vec4(albedo, uRoughness);
  // .w is a packed material word: >= 2 means transmissive glass (w - 2 =
  // transmission amount), else it is plain metalness. Lets the lighting pass
  // read specular/glass properties without an extra G-buffer sampler (it
  // already sits at the WebGL2 16-sampler minimum).
  gNormalMetal = vec4(n, uTransmission > 0.0 ? 2.0 + uTransmission : uMetalness);
  // .w packs the valid flag AND roughness: 0 = background, 1 + roughness
  // otherwise. Every consumer only tests w < 0.5, so this stays compatible.
  gWorldPos = vec4(vWorldPos, 1.0 + uRoughness);
  gEmissive = vec4(emissive, 1.0);
}
`;class f0{constructor(e,t,{mixedPrecision:n=!0}={}){this._mixedPrecision=n,this._targets=[this._makeTarget(e,t),this._makeTarget(e,t)],this._current=0,this._materialCache=new WeakMap,this._swapped=[],this._normalMat3=new De}_makeTarget(e,t){const n=new Cf(e,t,4,{minFilter:Ke,magFilter:Ke,type:Pt,depthBuffer:!0});for(const i of n.texture)i.generateMipmaps=!1;return this._mixedPrecision&&(n.texture[0].type=Kt,n.texture[1].type=Kt,n.texture[3].type=Kt),n}get target(){return this._targets[this._current]}get _prev(){return this._targets[1-this._current]}get albedoRough(){return this.target.texture[0]}get normalMetal(){return this.target.texture[1]}get worldPos(){return this.target.texture[2]}get emissive(){return this.target.texture[3]}get prevNormalMetal(){return this._prev.texture[1]}get prevWorldPos(){return this._prev.texture[2]}setSize(e,t){for(const n of this._targets)n.setSize(e,t)}_gbufferMaterialFor(e){let t=this._materialCache.get(e);t||(t=new kt({glslVersion:Dn,vertexShader:u0,fragmentShader:h0,uniforms:{uNormalMatrixWorld:{value:new De},uColor:{value:new he(1,1,1)},uRoughness:{value:1},uMetalness:{value:0},uTransmission:{value:0},uEmissive:{value:new he(0,0,0)},uMap:{value:null},uHasMap:{value:!1},uEmissiveMap:{value:null},uHasEmissiveMap:{value:!1}},side:$t}),this._materialCache.set(e,t));const n=Array.isArray(e.material)?e.material[0]:e.material,i=t.uniforms;return n.color&&i.uColor.value.copy(n.color),i.uRoughness.value=n.roughness??1,i.uMetalness.value=n.metalness??0,i.uTransmission.value=n.transmission??0,n.emissive&&i.uEmissive.value.copy(n.emissive).multiplyScalar(n.emissiveIntensity??1),i.uMap.value=n.map??null,i.uHasMap.value=!!n.map,i.uEmissiveMap.value=n.emissiveMap??null,i.uHasEmissiveMap.value=!!n.emissiveMap,i.uNormalMatrixWorld.value.getNormalMatrix(e.matrixWorld),t.side=n.side??$t,t}render(e,t,n){this._current=1-this._current,this._swapped.length=0,t.traverse(r=>{if(r.isMesh&&r.geometry&&r.visible){const o=Array.isArray(r.material)?r.material[0]:r.material;if(o.transparent&&(o.opacity??1)<.5){r.visible=!1,this._swapped.push([r,null]);return}this._swapped.push([r,r.material]),r.material=this._gbufferMaterialFor(r)}});const i=t.background;t.background=null,e.setRenderTarget(this.target),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(t,n),e.setRenderTarget(null),t.background=i;for(const[r,o]of this._swapped)o===null?r.visible=!0:r.material=o;this._swapped.length=0}dispose(){for(const e of this._targets)e.dispose()}}const sh=`
vec3 skyColor(vec3 dir, vec3 sunDir, vec3 sunColor, vec3 zenith, vec3 horizon, float intensity) {
  float up = clamp(dir.y, -1.0, 1.0);
  // Gradient sky: biased so the horizon band stays fairly tall.
  float t = pow(clamp(up, 0.0, 1.0), 0.42);
  vec3 col = mix(horizon, zenith, t);
  // Below the horizon settle gently toward a soft haze — kept close to the
  // horizon colour so the ground plane's far edge blends in without a hard band.
  if (up < 0.0) {
    col = mix(horizon, horizon * 0.72, clamp(-up * 1.6, 0.0, 1.0));
  }
  // Sun: a tight disk plus a broad warm halo bleeding into the sky.
  float s = max(dot(dir, sunDir), 0.0);
  vec3 sun = sunColor * (pow(s, 3000.0) * 55.0 + pow(s, 12.0) * 0.30);
  return (col + sun) * intensity;
}
`,d0=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,p0=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${eh}
${th}
${sh}

#define MAX_LIGHTS ${kr}
#define PI 3.14159265358979

layout(location = 0) out vec4 outIrradiance;

in vec2 vUv;

// Two-level BVH: static (uploaded once) + dynamic (small, refit each frame).
uniform BVH bvhStatic;
uniform BVH bvhDynamic;
uniform bool uHasDynamic;
// One packed per-vertex texture per level: normal.xyz + materialIndex.w.
// (Two BVH structs already use 8 samplers; WebGL2 guarantees only 16 total.)
uniform sampler2D uAttrStatic;
uniform sampler2D uAttrDynamic;
uniform sampler2D uMaterialsTex;        // 2 texels per material (shared)

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;

// temporal reprojection (stage 2)
uniform sampler2D uPrevAccum;        // rgb = irradiance history, a = sample count
uniform sampler2D uPrevGWorldPos;    // previous frame's G-buffer, for validation
uniform sampler2D uPrevGNormalMetal;
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform vec3 uCameraPos;
uniform float uMaxHistory;
uniform bool uTemporalReprojection;
uniform float uFireflyClamp;

uniform vec4 uLightPosType[MAX_LIGHTS];     // xyz pos|dir, w: 0 point, 1 directional
uniform vec4 uLightColorRadius[MAX_LIGHTS]; // rgb color*intensity, w radius
uniform int uLightCount;
uniform int uEmissiveCount; // NEE area-light triangles in row 1 of uMaterialsTex
uniform bool uReflEnabled;  // traced reflections on metallic surfaces
uniform bool uRefrEnabled;  // traced refraction on transmissive surfaces
uniform float uIor;         // index of refraction for transmissive materials
uniform bool uLightStochastic; // 1 direct shadow ray/pixel/frame instead of 1/light

uniform vec3 uEnvColor;
uniform float uEnvIntensity;
uniform float uFrame;
uniform float uEps;
uniform bool uGIEnabled;

// Procedural sky (when enabled, replaces the flat env colour as the "miss" term
// for GI rays — this is what gives natural outdoor bounce light).
uniform bool uSkyEnabled;
uniform vec3 uSunDir;      // direction toward the sun
uniform vec3 uSunColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSkyIntensity;

// ---------- RNG (PCG) ----------
uint gSeed;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec2 rand2() { return vec2(rand(), rand()); }

// Branchless orthonormal basis (Duff et al. 2017) — cheaper and stable for
// every n, including the poles the old cross-product picker handled branchily.
void orthoBasis(vec3 n, out vec3 t, out vec3 b) {
  float s = n.z >= 0.0 ? 1.0 : -1.0;
  float a = -1.0 / (s + n.z);
  float m = n.x * n.y * a;
  t = vec3(1.0 + s * n.x * n.x * a, s * m, -s * n.x);
  b = vec3(m, s + n.y * n.y * a, -n.y);
}

vec3 cosineSampleHemisphere(vec3 n, vec2 u) {
  float a = 2.0 * PI * u.x;
  float r = sqrt(u.y);
  vec3 t, b;
  orthoBasis(n, t, b);
  return normalize(t * (r * cos(a)) + b * (r * sin(a)) + n * sqrt(max(0.0, 1.0 - u.y)));
}

vec3 randUnitVector() {
  vec2 u = rand2();
  float z = u.x * 2.0 - 1.0;
  float a = u.y * 2.0 * PI;
  float r = sqrt(max(0.0, 1.0 - z * z));
  return vec3(r * cos(a), r * sin(a), z);
}

// ---------- two-level BVH helpers ----------
// Closest hit across both levels; isDyn says which one so the caller samples
// the matching vertex-attribute textures. (No backticks in these GLSL comments —
// they would terminate the enclosing JS template literal.)
bool traceBoth(vec3 ro, vec3 rd, out uvec4 fi, out vec3 bary, out float dist, out bool isDyn) {
  uvec4 fiS; vec3 fnS; vec3 bcS; float sideS; float distS;
  bool hitS = bvhIntersectFirstHit(bvhStatic, ro, rd, fiS, fnS, bcS, sideS, distS);
  uvec4 fiD; vec3 fnD; vec3 bcD; float sideD; float distD;
  bool hitD = uHasDynamic && bvhIntersectFirstHit(bvhDynamic, ro, rd, fiD, fnD, bcD, sideD, distD);
  if (hitS && (!hitD || distS <= distD)) { fi = fiS; bary = bcS; dist = distS; isDyn = false; return true; }
  if (hitD) { fi = fiD; bary = bcD; dist = distD; isDyn = true; return true; }
  return false;
}

bool occluded(vec3 ro, vec3 rd, float maxDist) {
  uvec4 fi; vec3 fn; vec3 bc; float side; float dist;
  if (bvhIntersectFirstHit(bvhStatic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  if (uHasDynamic && bvhIntersectFirstHit(bvhDynamic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  return false;
}

void fetchMaterial(float matIndex, out vec3 albedo, out float roughness,
                   out vec3 emissive, out float metalness) {
  int mi = int(round(matIndex)) * 2;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(mi, 0), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(mi + 1, 0), 0);
  albedo = t0.rgb;
  roughness = t0.a;
  emissive = t1.rgb;
  metalness = t1.a;
}

// ---------- lighting ----------
// Direct irradiance (demodulated: no albedo) at point P with normal N,
// from light i, with one shadow ray. Area-samples point lights for soft shadows.
vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];

  vec3 L;
  float dist2 = 1.0;
  float maxDist = 1e7;

  if (posType.w < 0.5) {
    // point light: sample a point on its sphere for soft shadows
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - P;
    float dl = length(d);
    if (dl < 1e-5) return vec3(0.0);
    L = d / dl;
    dist2 = dl * dl;
    maxDist = dl;
  } else {
    // directional light: jitter within a small cone
    L = normalize(-posType.xyz + randUnitVector() * colRad.w);
    dist2 = 1.0;
  }

  float NdotL = dot(N, L);
  if (NdotL <= 0.0) return vec3(0.0);

  if (occluded(P + N * uEps, L, maxDist)) return vec3(0.0);
  return colRad.rgb * (NdotL / dist2);
}

// Direct light at a GI bounce hit: sample ONE random light (weighted by count).
vec3 sampleOneLight(vec3 P, vec3 N) {
  if (uLightCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
  return lightContribution(i, P, N) * float(uLightCount);
}

// Next-event estimation on emissive-mesh triangles (row 1 of uMaterialsTex):
// pick one triangle, sample a point on it, cast one shadow ray, convert the
// area pdf to solid angle. Turns emitters into proper soft area lights instead
// of surfaces a GI ray has to hit by luck.
vec3 sampleEmissiveTri(vec3 P, vec3 N) {
  if (uEmissiveCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1) * 4;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(i, 1), 0);     // v0 | area
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(i + 1, 1), 0); // e1 | emit.r
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(i + 2, 1), 0); // e2 | emit.g
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(i + 3, 1), 0); // n  | emit.b

  vec2 u = rand2();
  if (u.x + u.y > 1.0) u = 1.0 - u; // uniform over the triangle
  vec3 lp = t0.xyz + t1.xyz * u.x + t2.xyz * u.y;

  vec3 d = lp - P;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;

  float cosS = dot(N, wi);
  // abs(): double-sided emission, matching what a GI ray hitting either face sees.
  float cosL = abs(dot(t3.xyz, wi));
  if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
  if (occluded(P + N * uEps, wi, dist)) return vec3(0.0);

  // Uniform pick of 1-of-count tris + uniform point: pdf_area = 1/(count·area).
  // Solid-angle conversion gives irradiance Le · cosS · cosL / (d² · pdf_area).
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * float(uEmissiveCount) * t0.w / max(d2, 1e-6));

  // Uniform-area sampling has huge single-sample variance for receivers close
  // to a big emitter (sampled point can land almost on top of P, d² → 0);
  // those 100× spikes read as speckles because the EMA decays them only as
  // 1/count. Clamp at 2× the indirect firefly limit — slight bias right next
  // to the emitter, stable everywhere.
  float eLum = dot(e, vec3(0.299, 0.587, 0.114));
  float eCap = uFireflyClamp * 2.0;
  if (eLum > eCap) e *= eCap / eLum;
  return e;
}

// ONE light sample for secondary path vertices: stochastically pick either the
// analytic lights or the emissive set (weighted 1/p). Costs a single shadow
// ray — same ray budget the GI bounce had before emissive NEE existed —
// instead of two; the estimator stays unbiased and temporal accumulation
// averages out the extra variance.
vec3 sampleOneAny(vec3 P, vec3 N) {
  bool hasL = uLightCount > 0;
  bool hasE = uEmissiveCount > 0;
  if (hasL && hasE) {
    return rand() < 0.5
      ? sampleOneLight(P, N) * 2.0
      : sampleEmissiveTri(P, N) * 2.0;
  }
  if (hasL) return sampleOneLight(P, N);
  if (hasE) return sampleEmissiveTri(P, N);
  return vec3(0.0);
}

// Incoming radiance along rd: trace, shade the hit with direct + NEE lighting,
// sky/env on a miss. Specular rays keep emitter emission on hit (NEE at the ray
// origin cannot cover a specular path); diffuse GI rays drop it for NEE-listed
// (static) emitters so that light isn't counted twice.
vec3 traceRadiance(vec3 ro, vec3 rd, bool specular) {
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (!traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    return uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  vec4 attr = isDyn
    ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
    : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
  vec3 hAlbedo; float hRough; vec3 hEmissive; float hMetal;
  fetchMaterial(attr.w, hAlbedo, hRough, hEmissive, hMetal);
  vec3 hN = normalize(attr.xyz);
  if (dot(hN, rd) > 0.0) hN = -hN;
  vec3 hP = ro + rd * dist;
  vec3 Ld = sampleOneAny(hP + hN * uEps, hN);
  vec3 hLe = (!specular && uEmissiveCount > 0 && !isDyn) ? vec3(0.0) : hEmissive;
  return hLe + hAlbedo * Ld * (1.0 / PI);
}

float schlick(float cosT, float eta) {
  float r0 = (1.0 - eta) / (1.0 + eta);
  r0 *= r0;
  return r0 + (1.0 - r0) * pow(1.0 - cosT, 5.0);
}

// Roughness-jittered mirror direction (glossy cone approximation).
vec3 glossyReflect(vec3 V, vec3 N, float rough) {
  vec3 refl = reflect(V, N);
  if (rough > 0.0) {
    refl = normalize(mix(refl, cosineSampleHemisphere(N, rand2()), rough * rough));
  }
  return refl;
}

// Glass: Fresnel-weighted blend of a surface reflection and a two-interface
// refraction (enter at P, march to the exit surface, refract again).
vec3 glassRadiance(vec3 P, vec3 N, vec3 V, float rough) {
  vec3 refl = glossyReflect(V, N, rough);
  vec3 reflRad = dot(refl, N) > 0.0 ? traceRadiance(P + N * uEps, refl, true) : vec3(0.0);

  float eta = 1.0 / uIor;
  vec3 rd = refract(V, N, eta);
  if (rd == vec3(0.0)) return reflRad; // total internal reflection at entry
  float fres = schlick(clamp(-dot(V, N), 0.0, 1.0), eta);

  vec3 ro = P - N * (2.0 * uEps);
  vec3 refrRad;
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    // Exit interface: refract back out (or bounce once on internal reflection).
    vec4 attr = isDyn
      ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
      : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
    vec3 xN = normalize(attr.xyz);
    if (dot(xN, rd) > 0.0) xN = -xN;
    vec3 xP = ro + rd * dist;
    vec3 rd2 = refract(rd, xN, uIor);
    if (rd2 == vec3(0.0)) rd2 = reflect(rd, xN);
    refrRad = traceRadiance(xP - xN * uEps, rd2, true);
  } else {
    refrRad = uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  return mix(refrRad, reflRad, fres);
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outIrradiance = vec4(0.0);
    return;
  }

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 1973u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);

  vec3 P = wp.xyz;
  vec4 nmSample = texture(uGNormalMetal, vUv);
  vec3 N = normalize(nmSample.xyz);
  // Decode the packed material word (see GBufferPass): >= 2 → glass, else metal.
  float transmission = nmSample.w >= 2.0 ? clamp(nmSample.w - 2.0, 0.0, 1.0) : 0.0;
  float metal = nmSample.w >= 2.0 ? 0.0 : nmSample.w;
  float rough = clamp(wp.w - 1.0, 0.0, 1.0);

  // --- direct lighting ---
  // Full quality: one shadow ray per light + one for the emissive set.
  // Stochastic (mobile/fast): ONE shadow ray total, source picked at random and
  // weighted by 1/p — temporal accumulation averages it out, the denoiser
  // covers the extra variance. Biggest single lever on ray count.
  vec3 direct = vec3(0.0);
  if (uLightStochastic) {
    direct = sampleOneAny(P, N);
  } else {
    for (int i = 0; i < MAX_LIGHTS; i++) {
      if (i >= uLightCount) break;
      direct += lightContribution(i, P, N);
    }
    // Emissive meshes as area lights (next-event estimation, one shadow ray).
    direct += sampleEmissiveTri(P, N);
  }

  // --- 1-bounce indirect (cosine-weighted; pdf cancels the NdotL/PI).
  // traceRadiance shades the hit with direct + NEE light, or returns the
  // sky/env colour when the ray escapes (the natural ambient bounce).
  vec3 indirect = vec3(0.0);
  if (uGIEnabled) {
    indirect = traceRadiance(P + N * uEps, cosineSampleHemisphere(N, rand2()), false);
  }

  // Firefly clamp: suppress rare huge GI samples (big perceived-noise win,
  // slightly biased). Applied to indirect only; direct is analytic.
  float lum = dot(indirect, vec3(0.299, 0.587, 0.114));
  if (lum > uFireflyClamp) indirect *= uFireflyClamp / lum;

  vec3 sampleIrr = direct + indirect;

  // --- traced specular: mirror/glossy reflections on metals ---
  if (uReflEnabled && metal > 0.001) {
    vec3 V = normalize(P - uCameraPos);
    vec3 refl = glossyReflect(V, N, rough);
    if (dot(refl, N) > 0.0) {
      // Metals have no diffuse term: replace by metalness. The composite's
      // albedo multiply then tints the reflection (F0 = albedo for metals).
      sampleIrr = mix(sampleIrr, traceRadiance(P + N * uEps, refl, true), metal);
    }
  }

  // --- traced glass: Fresnel reflection + two-interface refraction ---
  if (uRefrEnabled && transmission > 0.001) {
    vec3 V = normalize(P - uCameraPos);
    sampleIrr = mix(sampleIrr, glassRadiance(P, N, V, rough), transmission);
  }

  // A single NaN/Inf sample would poison the EMA history for good (mix() with
  // NaN stays NaN until a disocclusion resets the pixel) — sanitize first.
  if (any(isnan(sampleIrr)) || any(isinf(sampleIrr))) sampleIrr = vec3(0.0);

  // --- temporal reprojection: pull validated history from last frame ---
  float count = 1.0;
  vec3 history = vec3(0.0);
  if (uTemporalReprojection) {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clip.w > 0.0 && clipC.w > 0.0) {
      vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
      // P comes from a full-res G-buffer texel, which sits sub-pixel off this
      // half-res fragment's center. That constant offset would bias bilinear
      // history reads every frame (content drifts/smears at renderScale < 1).
      // Cancel it: measure P's offset in the CURRENT frame and subtract.
      vec2 currUv = (clipC.xy / clipC.w) * 0.5 + 0.5;
      prevUv -= currUv - vUv;
      if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
        vec4 prevPos = texture(uPrevGWorldPos, prevUv);
        vec3 prevN = texture(uPrevGNormalMetal, prevUv).xyz;
        // Plane-distance test: robust at grazing angles (position error from
        // texel quantization lies along the surface, not along the normal).
        float distToCam = distance(P, uCameraPos);
        float tol = 0.005 * distToCam + 20.0 * uEps;
        bool valid = prevPos.w > 0.5
          && abs(dot(P - prevPos.xyz, N)) < tol
          && dot(N, normalize(prevN)) > 0.9;
        if (valid) {
          vec4 h = texture(uPrevAccum, prevUv); // bilinear
          // Mirror-like pixels keep a SHORT history: their reflected content
          // moves differently from the surface, so long history smears the
          // reflection under camera motion — and specular rays are nearly
          // deterministic, so they don't need the accumulation anyway.
          float specHist = max(metal, transmission) * (1.0 - rough);
          float histCap = mix(uMaxHistory, min(uMaxHistory, 10.0), specHist);
          count = clamp(h.a, 0.0, histCap) + 1.0;
          history = h.rgb;
        }
      }
    }
  }

  // Exponential moving average; count=1 (disocclusion / first frame) means
  // the fresh sample is used as-is.
  vec3 blended = mix(history, sampleIrr, 1.0 / count);
  outIrradiance = vec4(blended, count);
}
`;class m0{constructor(e,t){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.material=new kt({glslVersion:Dn,vertexShader:d0,fragmentShader:p0,uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uAttrStatic:{value:null},uAttrDynamic:{value:null},uMaterialsTex:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevAccum:{value:null},uPrevGWorldPos:{value:null},uPrevGNormalMetal:{value:null},uPrevViewProj:{value:new _e},uViewProj:{value:new _e},uCameraPos:{value:new C},uMaxHistory:{value:128},uTemporalReprojection:{value:!0},uFireflyClamp:{value:4},uLightPosType:{value:[]},uLightColorRadius:{value:[]},uLightCount:{value:0},uEmissiveCount:{value:0},uReflEnabled:{value:!0},uRefrEnabled:{value:!0},uIor:{value:1.5},uLightStochastic:{value:!1},uEnvColor:{value:new he(.03,.04,.06)},uEnvIntensity:{value:1},uFrame:{value:0},uEps:{value:.001},uGIEnabled:{value:!0},uSkyEnabled:{value:!1},uSunDir:{value:new C(.4,.8,.45).normalize()},uSunColor:{value:new he(1,.9,.75)},uSkyZenith:{value:new he(.18,.34,.62)},uSkyHorizon:{value:new he(.7,.8,.9)},uSkyIntensity:{value:1}},depthTest:!1,depthWrite:!1}),this.scene=new Os,this.camera=new Jn(-1,1,1,-1,0,1),this.quad=new Et(new Zn(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const n=new Zt(e,t,{minFilter:nt,magFilter:nt,format:ht,type:Kt,depthBuffer:!1,stencilBuffer:!1});return n.texture.generateMipmaps=!1,n}clearHistory(e){const t=e.getRenderTarget(),n=new he;e.getClearColor(n);const i=e.getClearAlpha();e.setClearColor(0,0);for(const r of[this.targetA,this.targetB])e.setRenderTarget(r),e.clear(!0,!1,!1);e.setRenderTarget(t),e.setClearColor(n,i)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t)}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uAttrStatic.value=e.staticAttrTex,t.uAttrDynamic.value=e.dynamicAttrTex,t.uMaterialsTex.value=e.materialsTex,t.uLightPosType.value=e.lightPosType,t.uLightColorRadius.value=e.lightColorRadius,t.uLightCount.value=e.lightCount,t.uEmissiveCount.value=e.emissiveTriCount}render(e,t,n){const i=this.material.uniforms;i.uGWorldPos.value=t.worldPos,i.uGNormalMetal.value=t.normalMetal,i.uPrevGWorldPos.value=t.prevWorldPos,i.uPrevGNormalMetal.value=t.prevNormalMetal,i.uPrevAccum.value=this.targetB.texture,i.uFrame.value=n,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const r=this.targetA;return[this.targetA,this.targetB]=[this.targetB,this.targetA],r.texture}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const g0=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,_0=`
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

uniform sampler2D uIrradiance;   // rgb = irradiance, a = history count
uniform sampler2D uGWorldPos;    // full-res guides
uniform sampler2D uGNormalMetal;
uniform vec2 uTexelSize;         // of the irradiance target
uniform float uStep;             // à-trous step: 1, 2, 4, ...
uniform vec3 uCameraPos;
uniform float uEps;
uniform float uLumSigma;

float luminance(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec4 center = texture(uIrradiance, vUv);
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outColor = center;
    return;
  }
  vec3 P = wp.xyz;
  vec4 nm = texture(uGNormalMetal, vUv);
  vec3 N = normalize(nm.xyz);
  // Specular surfaces (mirror metals, glass) carry traced reflections whose
  // detail is NOT in the G-buffer guides — filtering would smear them, and
  // their signal is nearly deterministic anyway. Scale the filter down as the
  // surface gets more mirror-like.
  float matW = nm.w;
  float specAmount = matW >= 2.0 ? clamp(matW - 2.0, 0.0, 1.0) : matW;
  float specKeep = specAmount * (1.0 - clamp(wp.w - 1.0, 0.0, 1.0));

  // Fewer accumulated samples -> noisier pixel -> wider luminance tolerance.
  // A converged pixel (high count) is barely touched, preserving detail.
  float count = max(center.a, 1.0);
  float sigmaL = uLumSigma * clamp(8.0 / sqrt(count), 0.75, 8.0);

  float distToCam = distance(P, uCameraPos);
  float planeTol = 0.01 * distToCam + 20.0 * uEps;

  // Despeckle (first iteration, short history only): a freshly disoccluded
  // pixel can carry one huge sample that the center-weighted filter would
  // preserve as a bright "rain drop" at silhouettes. Such a pixel has no
  // business being brighter than its entire neighbourhood — clamp its
  // luminance to the brightest neighbour. Converged pixels are exempt, so
  // real small highlights survive.
  if (uStep < 1.5 && count < 8.0) {
    float maxL = 0.0;
    float found = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        vec2 tuv = vUv + vec2(float(dx), float(dy)) * uTexelSize;
        if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) continue;
        if (texture(uGWorldPos, tuv).w < 0.5) continue;
        maxL = max(maxL, luminance(texture(uIrradiance, tuv).rgb));
        found = 1.0;
      }
    }
    float cap = maxL * 1.25 + 1e-4;
    float l = luminance(center.rgb);
    if (found > 0.5 && l > cap) center.rgb *= cap / l;
  }

  float lumC = luminance(center.rgb);

  // 3x3 B-spline-ish kernel, edge-avoiding weights.
  vec3 sum = center.rgb * 4.0;
  float wsum = 4.0;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      vec2 tuv = vUv + vec2(float(dx), float(dy)) * uStep * uTexelSize;
      if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) continue;

      vec4 g = texture(uGWorldPos, tuv);
      if (g.w < 0.5) continue;
      vec4 s = texture(uIrradiance, tuv);
      vec3 Nt = normalize(texture(uGNormalMetal, tuv).xyz);

      float k = (dx == 0 || dy == 0) ? 2.0 : 1.0;
      float wN = pow(max(dot(N, Nt), 0.0), 32.0);
      float wZ = exp(-abs(dot(g.xyz - P, N)) / planeTol);
      // Tighten the luminance gate as the à-trous step widens: a shadow on a
      // flat floor has no geometric edge to protect it, so at high iteration
      // counts the wide passes would average it away ("floating" objects with
      // no contact shadow). Wide steps only get to blend near-equal luminance.
      float wL = exp(-abs(luminance(s.rgb) - lumC) / (sigmaL * inversesqrt(uStep)));
      float w = k * wN * wZ * wL * (1.0 - specKeep);
      sum += s.rgb * w;
      wsum += w;
    }
  }
  outColor = vec4(sum / wsum, center.a);
}
`;class v0{constructor(e,t){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.material=new kt({glslVersion:Dn,vertexShader:g0,fragmentShader:_0,uniforms:{uIrradiance:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uTexelSize:{value:new xe},uStep:{value:1},uCameraPos:{value:new C},uEps:{value:.001},uLumSigma:{value:.25}},depthTest:!1,depthWrite:!1}),this.scene=new Os,this.camera=new Jn(-1,1,1,-1,0,1),this.quad=new Et(new Zn(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad),this._width=e,this._height=t}_makeTarget(e,t){const n=new Zt(e,t,{minFilter:nt,magFilter:nt,format:ht,type:Kt,depthBuffer:!1,stencilBuffer:!1});return n.texture.generateMipmaps=!1,n}setSize(e,t){this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,n,i,r,o=3){const a=this.material.uniforms;a.uGWorldPos.value=n.worldPos,a.uGNormalMetal.value=n.normalMetal,a.uTexelSize.value.set(1/this._width,1/this._height),a.uCameraPos.value.copy(i),a.uEps.value=r;let c=t,l=this.targetA;for(let u=0;u<o;u++)a.uIrradiance.value=c,a.uStep.value=1<<u,e.setRenderTarget(l),e.render(this.scene,this.camera),c=l.texture,l=l===this.targetA?this.targetB:this.targetA;return e.setRenderTarget(null),c}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const x0=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,y0=`
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

${sh}

uniform sampler2D uIrradiance;
uniform sampler2D uGAlbedoRough;
uniform sampler2D uGNormalMetal;
uniform sampler2D uGWorldPos;
uniform sampler2D uGEmissive;
uniform sampler2D uVolumetric; // in-scattered light (lighting res, smooth)
uniform bool uVolEnabled;
uniform vec3 uBackgroundColor;
// 0 composite, 1 albedo, 2 normal, 3 irradiance (direct+GI), 4 worldPos, 5 emissive
uniform int uOutputMode;

// joint bilateral upsample (lighting may be rendered below full resolution)
uniform bool uUpsample;
uniform vec2 uIrrTexelSize;
uniform vec3 uCameraPos;

// distance fog (applied in linear space, before tonemap)
uniform bool uFogEnabled;
uniform vec3 uFogColor;
uniform float uFogDensity;

// procedural sky background
uniform bool uSkyEnabled;
uniform mat4 uInvViewProj;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSkyIntensity;

// Reconstruct the world-space view ray for this pixel from the inverse VP.
vec3 viewRay(vec2 uv) {
  vec4 far = uInvViewProj * vec4(uv * 2.0 - 1.0, 1.0, 1.0);
  return normalize(far.xyz / far.w - uCameraPos);
}

vec3 acesFilm(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

// Upsample low-res irradiance to this full-res pixel: 4 nearest low-res taps,
// bilinear weights modulated by geometric similarity (plane distance + normal)
// so lighting never bleeds across depth or orientation discontinuities.
vec3 sampleIrradiance(vec2 uv, vec3 P, vec3 N) {
  if (!uUpsample) return texture(uIrradiance, uv).rgb;

  float planeTol = 0.01 * distance(P, uCameraPos) + 1e-3;
  vec2 base = uv / uIrrTexelSize - 0.5;
  vec2 f = fract(base);
  vec2 uv00 = (floor(base) + 0.5) * uIrrTexelSize;

  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  vec3 bestGeo = vec3(0.0);
  float bestGeoW = -1.0;
  vec3 bestBil = vec3(0.0);
  float bestBilW = -1.0;
  for (int dy = 0; dy <= 1; dy++) {
    for (int dx = 0; dx <= 1; dx++) {
      vec2 tuv = uv00 + vec2(float(dx), float(dy)) * uIrrTexelSize;
      vec3 irr = texture(uIrradiance, tuv).rgb;
      float bw = (dx == 0 ? 1.0 - f.x : f.x) * (dy == 0 ? 1.0 - f.y : f.y);
      if (bw > bestBilW) { bestBilW = bw; bestBil = irr; }

      vec4 g = texture(uGWorldPos, tuv);
      if (g.w < 0.5) continue;
      vec3 Nt = normalize(texture(uGNormalMetal, tuv).xyz);
      float wPlane = exp(-abs(dot(g.xyz - P, N)) / planeTol);
      float wN = pow(max(dot(N, Nt), 0.0), 16.0);
      float gw = wPlane * wN;
      // Track the geometrically most similar tap for the fallback below.
      if (gw > bestGeoW) { bestGeoW = gw; bestGeo = irr; }
      float w = bw * gw;
      sum += irr * w;
      wsum += w;
    }
  }
  if (wsum > 1e-4) return sum / wsum;
  // All combined weights died (thin silhouette). Falling back to the closest
  // *bilinear* tap would pull lighting from the far side of the edge — under
  // TAA jitter the chosen tap flickers, which reads as bright "rain drop"
  // speckles on dark objects. Prefer the geometrically closest tap instead.
  return bestGeoW >= 0.0 ? bestGeo : bestBil;
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  vec4 albedoRough = texture(uGAlbedoRough, vUv);
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  vec3 irradiance = sampleIrradiance(vUv, wp.xyz, N);
  vec3 emissive = texture(uGEmissive, vUv).rgb;

  vec3 color;
  if (wp.w < 0.5) {
    // Background: the procedural sky (with sun), else fog colour, else flat.
    if (uSkyEnabled) {
      color = skyColor(viewRay(vUv), uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity);
    } else {
      color = uFogEnabled ? uFogColor : uBackgroundColor;
    }
  } else {
    color = albedoRough.rgb * irradiance + emissive;
    // Volumetric in-scatter (already radiance, not modulated by albedo). Fog
    // is low-frequency, so a wide 5-tap blur costs nothing visually and eats
    // most of the single-sample grain the accumulation hasn't averaged yet.
    if (uVolEnabled) {
      vec2 o = uIrrTexelSize * 1.5;
      vec3 vol = texture(uVolumetric, vUv).rgb * 0.4
        + texture(uVolumetric, vUv + vec2( o.x,  o.y)).rgb * 0.15
        + texture(uVolumetric, vUv + vec2(-o.x,  o.y)).rgb * 0.15
        + texture(uVolumetric, vUv + vec2( o.x, -o.y)).rgb * 0.15
        + texture(uVolumetric, vUv + vec2(-o.x, -o.y)).rgb * 0.15;
      color += vol;
    }
    if (uFogEnabled) {
      float dist = distance(wp.xyz, uCameraPos);
      float f = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
      color = mix(color, uFogColor, clamp(f, 0.0, 1.0));
    }
  }

  if (uOutputMode == 1) color = albedoRough.rgb;
  else if (uOutputMode == 2) color = N * 0.5 + 0.5;
  else if (uOutputMode == 3) color = irradiance;
  else if (uOutputMode == 4) color = fract(wp.xyz * 0.1);
  else if (uOutputMode == 5) color = emissive;
  else color = acesFilm(color);

  outColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
}
`;class M0{constructor(){this.material=new kt({glslVersion:Dn,vertexShader:x0,fragmentShader:y0,uniforms:{uIrradiance:{value:null},uGAlbedoRough:{value:null},uGNormalMetal:{value:null},uGWorldPos:{value:null},uGEmissive:{value:null},uVolumetric:{value:null},uVolEnabled:{value:!1},uBackgroundColor:{value:new he(.01,.012,.02)},uOutputMode:{value:0},uUpsample:{value:!1},uIrrTexelSize:{value:new xe},uCameraPos:{value:new C},uFogEnabled:{value:!1},uFogColor:{value:new he(.5,.6,.7)},uFogDensity:{value:.05},uSkyEnabled:{value:!1},uInvViewProj:{value:new _e},uSunDir:{value:new C(.4,.8,.45).normalize()},uSunColor:{value:new he(1,.9,.75)},uSkyZenith:{value:new he(.18,.34,.62)},uSkyHorizon:{value:new he(.7,.8,.9)},uSkyIntensity:{value:1}},depthTest:!1,depthWrite:!1}),this.scene=new Os,this.camera=new Jn(-1,1,1,-1,0,1),this.quad=new Et(new Zn(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}render(e,t,n,i,r=null){const o=this.material.uniforms;o.uIrradiance.value=t,o.uGAlbedoRough.value=n.albedoRough,o.uGNormalMetal.value=n.normalMetal,o.uGWorldPos.value=n.worldPos,o.uGEmissive.value=n.emissive,i&&i.isColor&&o.uBackgroundColor.value.copy(i),e.setRenderTarget(r),e.render(this.scene,this.camera)}dispose(){this.material.dispose(),this.quad.geometry.dispose()}}const tu=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,S0=`
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

uniform sampler2D uCurrent;        // this frame's composited LDR colour
uniform sampler2D uHistory;        // previous resolved colour
uniform sampler2D uGWorldPos;      // current full-res G-buffer
uniform mat4 uPrevViewProj;
uniform vec2 uTexelSize;
uniform vec2 uJitter;              // this frame's projection jitter (UV space)
uniform vec2 uPrevJitter;          // last frame's projection jitter (UV space)
uniform float uBlend;              // fresh-sample weight when history is valid (~0.1)
uniform bool uReset;               // first frame after a scene/size change

// The raster (and the whole lighting chain guided by it) wobbles with the
// sub-pixel jitter. Resolving on that wobbling grid drags history along with
// it — the image shimmers. So the resolve UNJITTERS its input: content that
// unjittered would sit at u is rasterized at u + jitter, hence sample there.
// Output then lives on a stable grid and jitter only contributes sub-pixel
// coverage information over time (which is what gives the anti-aliasing).
vec3 sampleCurrent(vec2 uv) {
  return texture(uCurrent, uv + uJitter).rgb;
}

void main() {
  vec3 current = sampleCurrent(vUv);
  // World position of the (unjittered) content at this pixel — same offset.
  vec4 wp = texture(uGWorldPos, vUv + uJitter);

  // Background (no geometry): no useful reprojection, show current directly.
  if (wp.w < 0.5 || uReset) {
    outColor = vec4(current, 1.0);
    return;
  }

  vec3 P = wp.xyz;

  // Neighbourhood colour AABB (used to clamp history — the core anti-ghost /
  // anti-speckle step). Also the min corner tells us the local floor, so a
  // single bright fireflight can't survive the clamp.
  vec3 nmin = current, nmax = current;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      vec3 c = sampleCurrent(vUv + vec2(float(dx), float(dy)) * uTexelSize);
      nmin = min(nmin, c);
      nmax = max(nmax, c);
    }
  }

  // Reproject this pixel's world point into the previous frame. The history is
  // a STABILIZED (unjittered-grid) image, so remove last frame's jitter from
  // the projected position before sampling it.
  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  if (clip.w <= 0.0) { outColor = vec4(current, 1.0); return; }
  vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5 - uPrevJitter;
  if (prevUv.x < 0.0 || prevUv.x > 1.0 || prevUv.y < 0.0 || prevUv.y > 1.0) {
    outColor = vec4(current, 1.0);
    return;
  }

  // NOTE: no geometric (depth/normal) history validation here, on purpose.
  // Under sub-pixel jitter such tests fail on every hard edge each frame,
  // dropping those pixels to the raw jittered current — the whole image
  // shimmers. The neighbourhood clamp below already bounds any stale history
  // (disocclusions resolve within a frame or two), which is exactly how
  // production TAA implementations handle rejection.
  vec3 history = texture(uHistory, prevUv).rgb;
  // Guard against a stray non-finite history value poisoning the buffer (it
  // would otherwise re-blend with itself every frame and stick as black).
  if (any(isnan(history)) || any(isinf(history))) {
    outColor = vec4(current, 1.0);
    return;
  }
  // Clamp history into the current neighbourhood box: removes ghosting on
  // motion and rejects bright edge speckles that history would otherwise keep.
  history = clamp(history, nmin, nmax);

  vec3 resolved = mix(history, current, uBlend);
  outColor = vec4(resolved, 1.0);
}
`,T0=`
precision highp float;
layout(location = 0) out vec4 outColor;
in vec2 vUv;
uniform sampler2D uTex;
void main() { outColor = vec4(texture(uTex, vUv).rgb, 1.0); }
`;class E0{constructor(e,t){this._width=e,this._height=t,this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this._reset=!0,this.material=new kt({glslVersion:Dn,vertexShader:tu,fragmentShader:S0,uniforms:{uCurrent:{value:null},uHistory:{value:null},uGWorldPos:{value:null},uPrevViewProj:{value:new _e},uTexelSize:{value:new xe(1/e,1/t)},uJitter:{value:new xe},uPrevJitter:{value:new xe},uBlend:{value:.1},uReset:{value:!0}},depthTest:!1,depthWrite:!1}),this.copyMaterial=new kt({glslVersion:Dn,vertexShader:tu,fragmentShader:T0,uniforms:{uTex:{value:null}},depthTest:!1,depthWrite:!1}),this.scene=new Os,this.camera=new Jn(-1,1,1,-1,0,1),this.quad=new Et(new Zn(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const n=new Zt(e,t,{minFilter:nt,magFilter:nt,format:ht,type:Kt,depthBuffer:!1,stencilBuffer:!1});return n.texture.generateMipmaps=!1,n}setSize(e,t){this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.material.uniforms.uTexelSize.value.set(1/e,1/t),this._reset=!0}reset(){this._reset=!0}render(e,t,n,i,r,o,a,c=null){const l=this.material.uniforms;l.uCurrent.value=t,l.uHistory.value=this.targetB.texture,l.uGWorldPos.value=n.worldPos,l.uPrevViewProj.value.copy(i),l.uJitter.value.copy(r),l.uPrevJitter.value.copy(o),l.uBlend.value=a,l.uReset.value=this._reset,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),this.quad.material=this.copyMaterial,this.copyMaterial.uniforms.uTex.value=this.targetA.texture,e.setRenderTarget(c),e.render(this.scene,this.camera),[this.targetA,this.targetB]=[this.targetB,this.targetA],this._reset=!1}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.copyMaterial.dispose(),this.quad.geometry.dispose()}}const b0=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,A0=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${eh}
${th}

#define MAX_LIGHTS ${kr}
#define PI 3.14159265358979

layout(location = 0) out vec4 outScatter;

in vec2 vUv;

uniform BVH bvhStatic;
uniform BVH bvhDynamic;
uniform bool uHasDynamic;
uniform sampler2D uMaterialsTex;   // row 1: emissive NEE triangles
uniform sampler2D uGWorldPos;

// temporal accumulation (reprojected through the SURFACE point — an
// approximation for a view-ray quantity, good enough for smooth fog)
uniform sampler2D uPrevAccum;
uniform mat4 uPrevViewProj;
uniform float uMaxHistory;

uniform vec4 uLightPosType[MAX_LIGHTS];
uniform vec4 uLightColorRadius[MAX_LIGHTS];
uniform int uLightCount;
uniform int uEmissiveCount;

uniform vec3 uCameraPos;
uniform float uFrame;
uniform float uEps;
uniform float uDensity;   // scatter coefficient
uniform float uMaxDist;   // cap for rays that hit nothing / far surfaces

// ---------- RNG (PCG) ----------
uint gSeed;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec2 rand2() { return vec2(rand(), rand()); }

vec3 randUnitVector() {
  vec2 u = rand2();
  float z = u.x * 2.0 - 1.0;
  float a = u.y * 2.0 * PI;
  float r = sqrt(max(0.0, 1.0 - z * z));
  return vec3(r * cos(a), r * sin(a), z);
}

bool occluded(vec3 ro, vec3 rd, float maxDist) {
  uvec4 fi; vec3 fn; vec3 bc; float side; float dist;
  if (bvhIntersectFirstHit(bvhStatic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  if (uHasDynamic && bvhIntersectFirstHit(bvhDynamic, ro, rd, fi, fn, bc, side, dist) && dist < maxDist - 2.0 * uEps) return true;
  return false;
}

// In-scattered radiance at a point in the volume from analytic light i.
// Like the surface version but with no cosine term (isotropic phase, folded
// into uDensity along with 1/4π).
vec3 lightAt(int i, vec3 S) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];
  if (posType.w < 0.5) {
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - S;
    float dist = length(d);
    if (dist < 1e-4) return vec3(0.0);
    if (occluded(S, d / dist, dist)) return vec3(0.0);
    return colRad.rgb / (dist * dist);
  }
  vec3 L = normalize(-posType.xyz + randUnitVector() * colRad.w);
  if (occluded(S, L, 1e7)) return vec3(0.0);
  return colRad.rgb;
}

// In-scattered radiance from one sampled emissive triangle (row 1 of the
// materials texture — same layout the lighting pass uses).
vec3 emissiveAt(vec3 S) {
  if (uEmissiveCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1) * 4;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(i, 1), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(i + 1, 1), 0);
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(i + 2, 1), 0);
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(i + 3, 1), 0);
  vec2 u = rand2();
  if (u.x + u.y > 1.0) u = 1.0 - u;
  vec3 lp = t0.xyz + t1.xyz * u.x + t2.xyz * u.y;
  vec3 d = lp - S;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;
  float cosL = abs(dot(t3.xyz, wi));
  if (cosL < 1e-4) return vec3(0.0);
  if (occluded(S, wi, dist)) return vec3(0.0);
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosL * float(uEmissiveCount) * t0.w / max(d2, 1e-4));
  // same close-range variance clamp idea as the surface pass
  float l = dot(e, vec3(0.299, 0.587, 0.114));
  if (l > 20.0) e *= 20.0 / l;
  return e;
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 2153u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);

  // Segment to integrate: camera → surface (or the fog cap on a miss).
  bool hit = wp.w > 0.5;
  vec3 P = wp.xyz;
  float segLen = hit ? min(distance(P, uCameraPos), uMaxDist) : uMaxDist;
  vec3 rd = hit
    ? normalize(P - uCameraPos)
    : vec3(0.0); // background without geometry: skip (no stable ray direction here)

  vec3 sample_ = vec3(0.0);
  if (hit && segLen > 1e-3) {
    // ONE jittered point on the segment (uniform pdf 1/segLen).
    float t = rand() * segLen;
    vec3 S = uCameraPos + rd * t;
    vec3 Lin = vec3(0.0);
    // Stochastically pick analytic lights or the emissive set, weighted 1/p.
    bool hasL = uLightCount > 0;
    bool hasE = uEmissiveCount > 0;
    if (hasL && hasE) {
      if (rand() < 0.5) {
        int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
        Lin = lightAt(i, S) * float(uLightCount) * 2.0;
      } else {
        Lin = emissiveAt(S) * 2.0;
      }
    } else if (hasL) {
      int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
      Lin = lightAt(i, S) * float(uLightCount);
    } else if (hasE) {
      Lin = emissiveAt(S);
    }
    // transmittance to the camera + estimator weight (segLen / pdf-normalized)
    sample_ = Lin * uDensity * segLen * exp(-uDensity * t);
    // Single-sample spike clamp — same reasoning as the surface firefly clamp:
    // the EMA decays outliers only as 1/count, so they read as grain.
    float sl = dot(sample_, vec3(0.299, 0.587, 0.114));
    if (sl > 4.0) sample_ *= 4.0 / sl;
  }

  // --- temporal accumulation, reprojected through the surface point ---
  float count = 1.0;
  vec3 history = vec3(0.0);
  if (hit) {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    if (clip.w > 0.0) {
      vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
      if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
        vec4 h = texture(uPrevAccum, prevUv);
        count = clamp(h.a, 0.0, uMaxHistory) + 1.0;
        history = h.rgb;
      }
    }
  }
  vec3 blended = mix(history, sample_, 1.0 / count);
  if (any(isnan(blended)) || any(isinf(blended))) blended = vec3(0.0);
  outScatter = vec4(blended, count);
}
`;class w0{constructor(e,t){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.material=new kt({glslVersion:Dn,vertexShader:b0,fragmentShader:A0,uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uMaterialsTex:{value:null},uGWorldPos:{value:null},uPrevAccum:{value:null},uPrevViewProj:{value:new _e},uMaxHistory:{value:48},uLightPosType:{value:[]},uLightColorRadius:{value:[]},uLightCount:{value:0},uEmissiveCount:{value:0},uCameraPos:{value:new C},uFrame:{value:0},uEps:{value:.001},uDensity:{value:.03},uMaxDist:{value:40}},depthTest:!1,depthWrite:!1}),this.scene=new Os,this.camera=new Jn(-1,1,1,-1,0,1),this.quad=new Et(new Zn(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const n=new Zt(e,t,{minFilter:nt,magFilter:nt,format:ht,type:Kt,depthBuffer:!1,stencilBuffer:!1});return n.texture.generateMipmaps=!1,n}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uMaterialsTex.value=e.materialsTex,t.uLightPosType.value=e.lightPosType,t.uLightColorRadius.value=e.lightColorRadius,t.uLightCount.value=e.lightCount,t.uEmissiveCount.value=e.emissiveTriCount}clearHistory(e){const t=e.getRenderTarget();e.setClearColor(0,0);for(const n of[this.targetA,this.targetB])e.setRenderTarget(n),e.clear(!0,!1,!1);e.setRenderTarget(t)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,n,i,r,o,a,c){const l=this.material.uniforms;l.uGWorldPos.value=t.worldPos,l.uPrevAccum.value=this.targetB.texture,l.uPrevViewProj.value.copy(n),l.uCameraPos.value.copy(i),l.uFrame.value=r,l.uEps.value=o,l.uDensity.value=a,l.uMaxDist.value=c,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const u=this.targetA;return[this.targetA,this.targetB]=[this.targetB,this.targetA],u.texture}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}function nu(s,e){let t=1,n=0,i=s;for(;i>0;)t/=e,n+=t*(i%e),i=Math.floor(i/e);return n}class Vi{static isSupported(e){try{const t=e.getContext();if(typeof WebGL2RenderingContext>"u"||!(t instanceof WebGL2RenderingContext)||!t.getExtension("EXT_color_buffer_float"))return!1;const n=t.getExtension("WEBGL_debug_renderer_info");if(n){const i=String(t.getParameter(n.UNMASKED_RENDERER_WEBGL)||"");if(/swiftshader|llvmpipe|software/i.test(i))return!1}return!0}catch{return!1}}static detectTier(e){if(e&&!Vi.isSupported(e))return"none";const t=typeof navigator<"u"?navigator:{};return(t.maxTouchPoints??0)>1||/Android|iPhone|iPad|Mobile/i.test(t.userAgent||"")?"mid":"high"}static recommendedOptions(e){return e==="none"?{}:e==="mid"?{renderScale:.375,...Vi._qualityFor(.375),adaptiveQuality:!0}:{renderScale:.5,denoiseIterations:3,adaptiveQuality:!0}}static _mixedMrtSupported(e){try{const t=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,t);const n=a=>{const c=e.createTexture();return e.bindTexture(e.TEXTURE_2D,c),e.texStorage2D(e.TEXTURE_2D,1,a,4,4),c},i=n(e.RGBA16F),r=n(e.RGBA32F);e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,r,0),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]);const o=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.deleteFramebuffer(t),e.deleteTexture(i),e.deleteTexture(r),e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),o}catch{return!1}}static _qualityFor(e){return{denoiseIterations:e<=.3?5:e<=.45?4:3,stochasticLights:e<=.55}}constructor(e,t={}){if(this.renderer=e,this.supported=Vi.isSupported(e),!this.supported){console.warn("three-realtime-rt: ray tracing unavailable on this system (needs WebGL2 + EXT_color_buffer_float on a hardware GPU). Falling back to plain three.js rendering."),this.compiled=null,this.frame=0;return}const n=e.getSize(new xe),i=e.getPixelRatio();this._width=Math.floor(n.x*i),this._height=Math.floor(n.y*i),this._renderScale=t.renderScale??.5;const r=Vi._mixedMrtSupported(e.getContext());r||console.info("three-realtime-rt: mixed fp16/fp32 G-buffer not supported here — using fp32 for all targets."),this.gbuffer=new f0(this._width,this._height,{mixedPrecision:r}),this.rtPass=new m0(this._scaledW,this._scaledH),this.denoisePass=new v0(this._scaledW,this._scaledH),this.composite=new M0,this.taaPass=new E0(this._width,this._height),this._sceneColor=this._makeColorTarget(this._width,this._height),this.compiled=null,this.frame=0,this.outputMode=0,this.envColor=t.envColor??new he(.03,.04,.06),this.envIntensity=t.envIntensity??1,this.eps=t.eps??.001,this._autoEps=t.eps==null,this.temporalReprojection=t.temporalReprojection??!0,this.maxHistory=t.maxHistory??128,this.fireflyClamp=t.fireflyClamp??4,this.gi=t.gi??!0,this.emissiveNEE=t.emissiveNEE??!0,this.reflections=t.reflections??!0,this.refraction=t.refraction??!0,this.ior=t.ior??1.5,this.stochasticLights=t.stochasticLights??!1,this.adaptiveQuality=t.adaptiveQuality??!1,this.targetFps=t.targetFps??55,this._qEma=null,this._qLastT=null,this._qLastChange=0,this.denoise=t.denoise??!0,this.denoiseIterations=t.denoiseIterations??3,this.taa=t.taa??!0,this.taaBlend=t.taaBlend??.1,this.volumetric={enabled:t.volumetric?.enabled??!1,density:t.volumetric?.density??.015,maxDist:t.volumetric?.maxDist??40},this.volumetricPass=new w0(this._scaledW,this._scaledH),this.fog={enabled:t.fog?.enabled??!1,color:t.fog?.color??new he(.5,.6,.7),density:t.fog?.density??.05},this.sky={enabled:t.sky?.enabled??!1,sunDir:t.sky?.sunDir??new C(.4,.8,.45).normalize(),sunColor:t.sky?.sunColor??new he(1,.9,.75),zenith:t.sky?.zenith??new he(.18,.34,.62),horizon:t.sky?.horizon??new he(.7,.8,.9),intensity:t.sky?.intensity??1},this._invViewProj=new _e,this._jitterIndex=0,this._jitteredViewProj=new _e,this._jitterUv=new xe,this._prevJitterUv=new xe,this._prevViewProj=new _e,this._camWorldPos=new C,this._needsClear=!0}_makeColorTarget(e,t){const n=new Zt(e,t,{minFilter:nt,magFilter:nt,format:ht,type:Kt,depthBuffer:!1,stencilBuffer:!1});return n.texture.generateMipmaps=!1,n}compileScene(e,t){return this.supported?(this.compiled&&this.compiled.dispose(),this.compiled=l0(e,t),this._autoEps&&(this.eps=Math.min(Math.max(.001,this.compiled.sceneDiagonal*.0012),.05)),this.rtPass.setCompiledScene(this.compiled),this.volumetricPass.setCompiledScene(this.compiled),this.resetAccumulation(),this.compiled):null}updateDynamic(){this.compiled&&this.compiled.updateDynamic()}updateLights(e){!this.supported||!this.compiled||(ih(e,this.compiled),this.rtPass.setCompiledScene(this.compiled),this.volumetricPass.setCompiledScene(this.compiled))}resetAccumulation(){this.supported&&(this._needsClear=!0,this.taaPass&&this.taaPass.reset())}get _scaledW(){return Math.max(1,Math.floor(this._width*this._renderScale))}get _scaledH(){return Math.max(1,Math.floor(this._height*this._renderScale))}get renderScale(){return this._renderScale}set renderScale(e){this._renderScale=e,this.setSize(this._width,this._height)}setSize(e,t){this.supported&&(this._width=Math.floor(e),this._height=Math.floor(t),this.gbuffer.setSize(this._width,this._height),this.rtPass.setSize(this._scaledW,this._scaledH),this.denoisePass.setSize(this._scaledW,this._scaledH),this.volumetricPass.setSize(this._scaledW,this._scaledH),this.taaPass.setSize(this._width,this._height),this._sceneColor.setSize(this._width,this._height),this.resetAccumulation())}_adaptQuality(){const e=performance.now(),t=this._qLastT==null?null:e-this._qLastT;if(this._qLastT=e,t==null||t>100||(this._qEma=this._qEma==null?t:this._qEma*.9+t*.1,e-this._qLastChange<2e3))return;const n=this._qEma/(1e3/this.targetFps);if(n<1.12&&n>.8)return;let i=this._renderScale*Math.pow(1/n,.35);if(i=Math.round(Math.min(1,Math.max(.2,i))*20)/20,Math.abs(i-this._renderScale)<.045)return;const r=Vi._qualityFor(i);this.denoiseIterations=r.denoiseIterations,this.stochasticLights=r.stochasticLights,this.renderScale=i,this._qLastChange=e,this._qEma=null,console.info(`three-realtime-rt: adaptive quality → ${Math.round(i*100)}% lighting, ${r.denoiseIterations} denoise passes, ${r.stochasticLights?"stochastic":"full"} direct light`)}render(e,t){if(!this.supported){this.renderer.render(e,t);return}this.adaptiveQuality&&this._adaptQuality(),this.compiled||this.compileScene(e),this.frame+=1,t.updateMatrixWorld();const n=t.projectionMatrix,i=n.elements[8],r=n.elements[9];if(this.taa&&this.outputMode===0){this._jitterIndex=(this._jitterIndex+1)%16;const f=(nu(this._jitterIndex+1,2)-.5)*2/this._width,d=(nu(this._jitterIndex+1,3)-.5)*2/this._height;n.elements[8]+=f,n.elements[9]+=d,this._jitterUv.set(-f*.5,-d*.5)}else this._jitterUv.set(0,0);this._jitteredViewProj.copy(n).multiply(t.matrixWorldInverse);const o=this.renderer.autoClear;this.renderer.autoClear=!1,this._needsClear&&(this.rtPass.clearHistory(this.renderer),this.volumetricPass.clearHistory(this.renderer),this._needsClear=!1),this.gbuffer.render(this.renderer,e,t);const a=this.rtPass.material.uniforms;a.uEnvColor.value.copy(this.envColor),a.uEnvIntensity.value=this.envIntensity,a.uEps.value=this.eps,a.uTemporalReprojection.value=this.temporalReprojection,a.uMaxHistory.value=this.maxHistory,a.uFireflyClamp.value=this.fireflyClamp>0?this.fireflyClamp:1e6,a.uGIEnabled.value=this.gi,a.uEmissiveCount.value=this.emissiveNEE?this.compiled.emissiveTriCount:0,a.uReflEnabled.value=this.reflections,a.uRefrEnabled.value=this.refraction,a.uIor.value=this.ior,a.uLightStochastic.value=this.stochasticLights,a.uSkyEnabled.value=this.sky.enabled,a.uSunDir.value.copy(this.sky.sunDir),a.uSunColor.value.copy(this.sky.sunColor),a.uSkyZenith.value.copy(this.sky.zenith),a.uSkyHorizon.value.copy(this.sky.horizon),a.uSkyIntensity.value=this.sky.intensity,a.uPrevViewProj.value.copy(this._prevViewProj),a.uViewProj.value.copy(this._jitteredViewProj),a.uCameraPos.value.copy(t.getWorldPosition(this._camWorldPos));let c=this.rtPass.render(this.renderer,this.gbuffer,this.frame);this.denoise&&this.denoiseIterations>0&&(c=this.denoisePass.render(this.renderer,c,this.gbuffer,this._camWorldPos,this.eps,this.denoiseIterations));let l=null;this.volumetric.enabled&&this.outputMode===0&&(l=this.volumetricPass.render(this.renderer,this.gbuffer,this._prevViewProj,this._camWorldPos,this.frame,this.eps,this.volumetric.density,this.volumetric.maxDist));const u=this.taa&&this.outputMode===0,h=this.composite.material.uniforms;h.uOutputMode.value=this.outputMode,h.uUpsample.value=this._renderScale<1,h.uIrrTexelSize.value.set(1/this._scaledW,1/this._scaledH),h.uCameraPos.value.copy(this._camWorldPos),h.uFogEnabled.value=this.fog.enabled,h.uFogColor.value.copy(this.fog.color),h.uFogDensity.value=this.fog.density,h.uSkyEnabled.value=this.sky.enabled,h.uInvViewProj.value.copy(this._invViewProj.copy(this._jitteredViewProj).invert()),h.uSunDir.value.copy(this.sky.sunDir),h.uSunColor.value.copy(this.sky.sunColor),h.uSkyZenith.value.copy(this.sky.zenith),h.uSkyHorizon.value.copy(this.sky.horizon),h.uSkyIntensity.value=this.sky.intensity,h.uVolumetric.value=l,h.uVolEnabled.value=l!==null,this.composite.render(this.renderer,c,this.gbuffer,e.background,u?this._sceneColor:null),u?this.taaPass.render(this.renderer,this._sceneColor.texture,this.gbuffer,this._prevViewProj,this._jitterUv,this._prevJitterUv,this.taaBlend):this.taa&&this.taaPass.reset(),this.renderer.autoClear=o,n.elements[8]=i,n.elements[9]=r,this._prevViewProj.copy(this._jitteredViewProj),this._prevJitterUv.copy(this._jitterUv)}dispose(){this.supported&&(this.gbuffer.dispose(),this.rtPass.dispose(),this.denoisePass.dispose(),this.composite.dispose(),this.taaPass.dispose(),this.volumetricPass.dispose(),this._sceneColor.dispose(),this.compiled&&this.compiled.dispose())}}const D0=""+new URL("DamagedHelmet-Cqec7PiW.glb",import.meta.url).href,I0=""+new URL("Duck-C0g_OreA.glb",import.meta.url).href;export{Gh as A,_t as B,he as C,rv as D,Yr as E,Vu as F,L0 as G,ls as L,Et as M,jn as N,Ht as P,$n as Q,Vi as R,Os as S,Hu as T,C as V,C_ as W,Ou as a,Ua as b,zu as c,iv as d,I0 as e,ut as f,Tt as g,D0 as h,Lt as i,it as j,Bs as k,fh as l,_e as m,$e as n,Un as o,rs as p,R0 as q,C0 as r,P0 as s,xe as t,jr as u,Cn as v,Sf as w};
