/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Do="160",Iy={ROTATE:0,DOLLY:1,PAN:2},Ly={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rh=0,sl=1,Ph=2,_u=1,Ch=2,Ci=3,si=0,Vt=1,vi=2,Xi=0,qn=1,rl=2,al=3,ol=4,Ih=5,sn=100,Lh=101,Dh=102,ll=103,cl=104,Nh=200,Uh=201,Fh=202,Bh=203,co=204,uo=205,Oh=206,kh=207,zh=208,Gh=209,Vh=210,Hh=211,Wh=212,Xh=213,qh=214,Kh=0,jh=1,Yh=2,Br=3,Zh=4,Jh=5,Qh=6,$h=7,bu=0,ed=1,td=2,qi=0,id=1,nd=2,sd=3,rd=4,ad=5,od=6,ul="attached",ld="detached",Su=300,Yn=301,Zn=302,ho=303,fo=304,Zr=306,po=1e3,At=1001,mo=1002,Ve=1003,hl=1004,da=1005,Xe=1006,cd=1007,Ps=1008,ui=1009,go=1010,Mu=1011,Jr=1012,ws=1013,Zt=1014,Mt=1015,Pt=1016,wu=1017,Tu=1018,an=1020,ud=1021,Ye=1023,hd=1024,dd=1025,on=1026,Jn=1027,Eu=1028,No=1029,Au=1030,Qr=1031,Cs=1033,fa=33776,pa=33777,ma=33778,ga=33779,dl=35840,fl=35841,pl=35842,ml=35843,Ru=36196,gl=37492,vl=37496,xl=37808,yl=37809,_l=37810,bl=37811,Sl=37812,Ml=37813,wl=37814,Tl=37815,El=37816,Al=37817,Rl=37818,Pl=37819,Cl=37820,Il=37821,va=36492,Ll=36494,Dl=36495,fd=36283,Nl=36284,Ul=36285,Fl=36286,pd=2200,md=2201,gd=2202,Or=2300,kr=2301,xa=2302,Gn=2400,Vn=2401,zr=2402,Uo=2500,vd=2501,xd=0,yd=1,Bl=2,Pu=3e3,ln=3001,_d=3200,bd=3201,Cu=0,Sd=1,Wt="",Et="srgb",di="srgb-linear",Fo="display-p3",$r="display-p3-linear",Gr="linear",it="srgb",Vr="rec709",Hr="p3",un=7680,Ol=519,Md=512,wd=513,Td=514,Iu=515,Ed=516,Ad=517,Rd=518,Pd=519,vo=35044,Ct="300 es",xo=1035,Di=2e3,Wr=2001;class cn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const n=this._listeners[e];if(n!==void 0){const r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let kl=1234567;const Ts=Math.PI/180,Qn=180/Math.PI;function hi(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Dt[s&255]+Dt[s>>8&255]+Dt[s>>16&255]+Dt[s>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]).toLowerCase()}function vt(s,e,t){return Math.max(e,Math.min(t,s))}function Bo(s,e){return(s%e+e)%e}function Cd(s,e,t,i,n){return i+(s-e)*(n-i)/(t-e)}function Id(s,e,t){return s!==e?(t-s)/(e-s):0}function Es(s,e,t){return(1-t)*s+t*e}function Ld(s,e,t,i){return Es(s,e,1-Math.exp(-t*i))}function Dd(s,e=1){return e-Math.abs(Bo(s,e*2)-e)}function Nd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Ud(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Fd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Bd(s,e){return s+Math.random()*(e-s)}function Od(s){return s*(.5-Math.random())}function kd(s){s!==void 0&&(kl=s);let e=kl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zd(s){return s*Ts}function Gd(s){return s*Qn}function yo(s){return(s&s-1)===0&&s!==0}function Vd(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Xr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Hd(s,e,t,i,n){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),u=a((e+i)/2),d=r((e-i)/2),h=a((e-i)/2),f=r((i-e)/2),g=a((i-e)/2);switch(n){case"XYX":s.set(o*u,l*d,l*h,o*c);break;case"YZY":s.set(l*h,o*u,l*d,o*c);break;case"ZXZ":s.set(l*d,l*h,o*u,o*c);break;case"XZX":s.set(o*u,l*g,l*f,o*c);break;case"YXY":s.set(l*f,o*u,l*g,o*c);break;case"ZYZ":s.set(l*g,l*f,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function xi(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Je(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Dy={DEG2RAD:Ts,RAD2DEG:Qn,generateUUID:hi,clamp:vt,euclideanModulo:Bo,mapLinear:Cd,inverseLerp:Id,lerp:Es,damp:Ld,pingpong:Dd,smoothstep:Nd,smootherstep:Ud,randInt:Fd,randFloat:Bd,randFloatSpread:Od,seededRandom:kd,degToRad:zd,radToDeg:Gd,isPowerOfTwo:yo,ceilPowerOfTwo:Vd,floorPowerOfTwo:Xr,setQuaternionFromProperEuler:Hd,normalize:Je,denormalize:xi};class ce{constructor(e=0,t=0){ce.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*n+e.x,this.y=r*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Le{constructor(e,t,i,n,r,a,o,l,c){Le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c)}set(e,t,i,n,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=n,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],f=i[5],g=i[8],x=n[0],m=n[3],p=n[6],y=n[1],v=n[4],_=n[7],T=n[2],M=n[5],w=n[8];return r[0]=a*x+o*y+l*T,r[3]=a*m+o*v+l*M,r[6]=a*p+o*_+l*w,r[1]=c*x+u*y+d*T,r[4]=c*m+u*v+d*M,r[7]=c*p+u*_+d*w,r[2]=h*x+f*y+g*T,r[5]=h*m+f*v+g*M,r[8]=h*p+f*_+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+n*r*c-n*a*l}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,h=o*l-u*r,f=c*r-a*l,g=t*d+i*h+n*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(n*c-u*i)*x,e[2]=(o*i-n*a)*x,e[3]=h*x,e[4]=(u*t-n*l)*x,e[5]=(n*r-o*t)*x,e[6]=f*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ya.makeScale(e,t)),this}rotate(e){return this.premultiply(ya.makeRotation(-e)),this}translate(e,t){return this.premultiply(ya.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ya=new Le;function Lu(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Is(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Wd(){const s=Is("canvas");return s.style.display="block",s}const zl={};function As(s){s in zl||(zl[s]=!0,console.warn(s))}const Gl=new Le().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Vl=new Le().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Os={[di]:{transfer:Gr,primaries:Vr,toReference:s=>s,fromReference:s=>s},[Et]:{transfer:it,primaries:Vr,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[$r]:{transfer:Gr,primaries:Hr,toReference:s=>s.applyMatrix3(Vl),fromReference:s=>s.applyMatrix3(Gl)},[Fo]:{transfer:it,primaries:Hr,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Vl),fromReference:s=>s.applyMatrix3(Gl).convertLinearToSRGB()}},Xd=new Set([di,$r]),Qe={enabled:!0,_workingColorSpace:di,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Xd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const i=Os[e].toReference,n=Os[t].fromReference;return n(i(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return Os[s].primaries},getTransfer:function(s){return s===Wt?Gr:Os[s].transfer}};function Kn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function _a(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let hn;class Du{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{hn===void 0&&(hn=Is("canvas")),hn.width=e.width,hn.height=e.height;const i=hn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=hn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Is("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=Kn(r[a]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Kn(t[i]/255)*255):t[i]=Kn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let qd=0;class Nu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qd++}),this.uuid=hi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(ba(n[a].image)):r.push(ba(n[a]))}else r=ba(n);i.url=r}return t||(e.images[this.uuid]=i),i}}function ba(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Du.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Kd=0;class Ut extends cn{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,i=At,n=At,r=Xe,a=Ps,o=Ye,l=ui,c=Ut.DEFAULT_ANISOTROPY,u=Wt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=hi(),this.name="",this.source=new Nu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ce(0,0),this.repeat=new ce(1,1),this.center=new ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(As("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===ln?Et:Wt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Su)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case po:e.x=e.x-Math.floor(e.x);break;case At:e.x=e.x<0?0:1;break;case mo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case po:e.y=e.y-Math.floor(e.y);break;case At:e.y=e.y<0?0:1;break;case mo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return As("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Et?ln:Pu}set encoding(e){As("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===ln?Et:Wt}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=Su;Ut.DEFAULT_ANISOTROPY=1;class We{constructor(e=0,t=0,i=0,n=1){We.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,r;const l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,_=(f+1)/2,T=(p+1)/2,M=(u+h)/4,w=(d+x)/4,R=(g+m)/4;return v>_&&v>T?v<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(v),n=M/i,r=w/i):_>T?_<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(_),i=M/n,r=R/n):T<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(T),i=w/r,n=R/r),this.set(i,n,r,t),this}let y=Math.sqrt((m-g)*(m-g)+(d-x)*(d-x)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(d-x)/y,this.z=(h-u)/y,this.w=Math.acos((c+f+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class jd extends cn{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new We(0,0,e,t),this.scissorTest=!1,this.viewport=new We(0,0,e,t);const n={width:e,height:t,depth:1};i.encoding!==void 0&&(As("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===ln?Et:Wt),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xe,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Ut(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Nu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class It extends jd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Uu extends Ut{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=At,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fu extends Ut{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=At,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hl extends It{constructor(e=1,t=1,i=1,n={}){super(e,t,n),this.isWebGLMultipleRenderTargets=!0;const r=this.texture;this.texture=[];for(let a=0;a<i;a++)this.texture[a]=r.clone(),this.texture[a].isRenderTargetTexture=!0}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,r=this.texture.length;n<r;n++)this.texture[n].image.width=e,this.texture[n].image.height=t,this.texture[n].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}copy(e){this.dispose(),this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.texture.length=0;for(let t=0,i=e.texture.length;t<i;t++)this.texture[t]=e.texture[t].clone(),this.texture[t].isRenderTargetTexture=!0;return this}}class yi{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,r,a,o){let l=i[n+0],c=i[n+1],u=i[n+2],d=i[n+3];const h=r[a+0],f=r[a+1],g=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=h,e[t+1]=f,e[t+2]=g,e[t+3]=x;return}if(d!==x||l!==h||c!==f||u!==g){let m=1-o;const p=l*h+c*f+u*g+d*x,y=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const T=Math.sqrt(v),M=Math.atan2(T,p*y);m=Math.sin(m*M)/T,o=Math.sin(o*M)/T}const _=o*y;if(l=l*m+h*_,c=c*m+f*_,u=u*m+g*_,d=d*m+x*_,m===1-o){const T=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=T,c*=T,u*=T,d*=T}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,n,r,a){const o=i[n],l=i[n+1],c=i[n+2],u=i[n+3],d=r[a],h=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+u*d+l*f-c*h,e[t+1]=l*g+u*h+c*d-o*f,e[t+2]=c*g+u*f+o*h-l*d,e[t+3]=u*g-o*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(n/2),d=o(r/2),h=l(i/2),f=l(n/2),g=l(r/2);switch(a){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=i+o+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-n)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(u-l)/f,this._x=.25*f,this._y=(n+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(r-c)/f,this._x=(n+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(a-n)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+n*c-r*l,this._y=n*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-n*o,this._w=a*u-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,n=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+n*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*i+t*this._x,this._y=f*n+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),d=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=a*d+this._w*h,this._x=i*d+this._x*h,this._y=n*d+this._y*h,this._z=r*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),n=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(n),i*Math.sin(r),i*Math.cos(r),t*Math.sin(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*n,this.y=r[1]*t+r[4]*i+r[7]*n,this.z=r[2]*t+r[5]*i+r[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),u=2*(o*t-r*n),d=2*(r*i-a*t);return this.x=t+l*c+a*d-o*u,this.y=i+l*u+o*c-r*d,this.z=n+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n,this.y=r[1]*t+r[5]*i+r[9]*n,this.z=r[2]*t+r[6]*i+r[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Sa.copy(this).projectOnVector(e),this.sub(Sa)}reflect(e){return this.sub(Sa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Sa=new P,Wl=new yi;class wt{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ai.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ai.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ai.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ai):ai.fromBufferAttribute(r,a),ai.applyMatrix4(e.matrixWorld),this.expandByPoint(ai);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ks.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ks.copy(i.boundingBox)),ks.applyMatrix4(e.matrixWorld),this.union(ks)}const n=e.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ai),ai.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(os),zs.subVectors(this.max,os),dn.subVectors(e.a,os),fn.subVectors(e.b,os),pn.subVectors(e.c,os),Fi.subVectors(fn,dn),Bi.subVectors(pn,fn),Qi.subVectors(dn,pn);let t=[0,-Fi.z,Fi.y,0,-Bi.z,Bi.y,0,-Qi.z,Qi.y,Fi.z,0,-Fi.x,Bi.z,0,-Bi.x,Qi.z,0,-Qi.x,-Fi.y,Fi.x,0,-Bi.y,Bi.x,0,-Qi.y,Qi.x,0];return!Ma(t,dn,fn,pn,zs)||(t=[1,0,0,0,1,0,0,0,1],!Ma(t,dn,fn,pn,zs))?!1:(Gs.crossVectors(Fi,Bi),t=[Gs.x,Gs.y,Gs.z],Ma(t,dn,fn,pn,zs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ai).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ai).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const wi=[new P,new P,new P,new P,new P,new P,new P,new P],ai=new P,ks=new wt,dn=new P,fn=new P,pn=new P,Fi=new P,Bi=new P,Qi=new P,os=new P,zs=new P,Gs=new P,$i=new P;function Ma(s,e,t,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){$i.fromArray(s,r);const o=n.x*Math.abs($i.x)+n.y*Math.abs($i.y)+n.z*Math.abs($i.z),l=e.dot($i),c=t.dot($i),u=i.dot($i);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Yd=new wt,ls=new P,wa=new P;class _i{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Yd.setFromPoints(e).getCenter(i);let n=0;for(let r=0,a=e.length;r<a;r++)n=Math.max(n,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ls.subVectors(e,this.center);const t=ls.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(ls,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ls.copy(e.center).add(wa)),this.expandByPoint(ls.copy(e.center).sub(wa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ti=new P,Ta=new P,Vs=new P,Oi=new P,Ea=new P,Hs=new P,Aa=new P;class ea{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ti)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ti.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ti.copy(this.origin).addScaledVector(this.direction,t),Ti.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Ta.copy(e).add(t).multiplyScalar(.5),Vs.copy(t).sub(e).normalize(),Oi.copy(this.origin).sub(Ta);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Vs),o=Oi.dot(this.direction),l=-Oi.dot(Vs),c=Oi.lengthSq(),u=Math.abs(1-a*a);let d,h,f,g;if(u>0)if(d=a*l-o,h=a*o-l,g=r*u,d>=0)if(h>=-g)if(h<=g){const x=1/u;d*=x,h*=x,f=d*(d+a*h+2*o)+h*(a*d+h+2*l)+c}else h=r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-a*r+o)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(a*r+o)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=a>0?-r:r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),n&&n.copy(Ta).addScaledVector(Vs,h),f}intersectSphere(e,t){Ti.subVectors(e.center,this.origin);const i=Ti.dot(this.direction),n=Ti.dot(Ti)-i*i,r=e.radius*e.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,n=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,n=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),d>=0?(o=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,Ti)!==null}intersectTriangle(e,t,i,n,r){Ea.subVectors(t,e),Hs.subVectors(i,e),Aa.crossVectors(Ea,Hs);let a=this.direction.dot(Aa),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Oi.subVectors(this.origin,e);const l=o*this.direction.dot(Hs.crossVectors(Oi,Hs));if(l<0)return null;const c=o*this.direction.dot(Ea.cross(Oi));if(c<0||l+c>a)return null;const u=-o*Oi.dot(Aa);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fe{constructor(e,t,i,n,r,a,o,l,c,u,d,h,f,g,x,m){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c,u,d,h,f,g,x,m)}set(e,t,i,n,r,a,o,l,c,u,d,h,f,g,x,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=n,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,n=1/mn.setFromMatrixColumn(e,0).length(),r=1/mn.setFromMatrixColumn(e,1).length(),a=1/mn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=a*u,f=a*d,g=o*u,x=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=h-x*c,t[9]=-o*l,t[2]=x-h*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*u,f=l*d,g=c*u,x=c*d;t[0]=h+x*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=f*o-g,t[6]=x+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*u,f=l*d,g=c*u,x=c*d;t[0]=h-x*o,t[4]=-a*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*u,t[9]=x-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*u,f=a*d,g=o*u,x=o*d;t[0]=l*u,t[4]=g*c-f,t[8]=h*c+x,t[1]=l*d,t[5]=x*c+h,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,f=a*c,g=o*l,x=o*c;t[0]=l*u,t[4]=x-h*d,t[8]=g*d+f,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*d+g,t[10]=h-x*d}else if(e.order==="XZY"){const h=a*l,f=a*c,g=o*l,x=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+x,t[5]=a*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*u,t[10]=x*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Zd,e,Jd)}lookAt(e,t,i){const n=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),ki.crossVectors(i,Kt),ki.lengthSq()===0&&(Math.abs(i.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),ki.crossVectors(i,Kt)),ki.normalize(),Ws.crossVectors(Kt,ki),n[0]=ki.x,n[4]=Ws.x,n[8]=Kt.x,n[1]=ki.y,n[5]=Ws.y,n[9]=Kt.y,n[2]=ki.z,n[6]=Ws.z,n[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],f=i[13],g=i[2],x=i[6],m=i[10],p=i[14],y=i[3],v=i[7],_=i[11],T=i[15],M=n[0],w=n[4],R=n[8],S=n[12],b=n[1],L=n[5],D=n[9],F=n[13],I=n[2],U=n[6],B=n[10],K=n[14],q=n[3],H=n[7],j=n[11],Y=n[15];return r[0]=a*M+o*b+l*I+c*q,r[4]=a*w+o*L+l*U+c*H,r[8]=a*R+o*D+l*B+c*j,r[12]=a*S+o*F+l*K+c*Y,r[1]=u*M+d*b+h*I+f*q,r[5]=u*w+d*L+h*U+f*H,r[9]=u*R+d*D+h*B+f*j,r[13]=u*S+d*F+h*K+f*Y,r[2]=g*M+x*b+m*I+p*q,r[6]=g*w+x*L+m*U+p*H,r[10]=g*R+x*D+m*B+p*j,r[14]=g*S+x*F+m*K+p*Y,r[3]=y*M+v*b+_*I+T*q,r[7]=y*w+v*L+_*U+T*H,r[11]=y*R+v*D+_*B+T*j,r[15]=y*S+v*F+_*K+T*Y,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+r*l*d-n*c*d-r*o*h+i*c*h+n*o*f-i*l*f)+x*(+t*l*f-t*c*h+r*a*h-n*a*f+n*c*u-r*l*u)+m*(+t*c*d-t*o*f-r*a*d+i*a*f+r*o*u-i*c*u)+p*(-n*o*u-t*l*d+t*o*h+n*a*d-i*a*h+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],y=d*m*c-x*h*c+x*l*f-o*m*f-d*l*p+o*h*p,v=g*h*c-u*m*c-g*l*f+a*m*f+u*l*p-a*h*p,_=u*x*c-g*d*c+g*o*f-a*x*f-u*o*p+a*d*p,T=g*d*l-u*x*l-g*o*h+a*x*h+u*o*m-a*d*m,M=t*y+i*v+n*_+r*T;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/M;return e[0]=y*w,e[1]=(x*h*r-d*m*r-x*n*f+i*m*f+d*n*p-i*h*p)*w,e[2]=(o*m*r-x*l*r+x*n*c-i*m*c-o*n*p+i*l*p)*w,e[3]=(d*l*r-o*h*r-d*n*c+i*h*c+o*n*f-i*l*f)*w,e[4]=v*w,e[5]=(u*m*r-g*h*r+g*n*f-t*m*f-u*n*p+t*h*p)*w,e[6]=(g*l*r-a*m*r-g*n*c+t*m*c+a*n*p-t*l*p)*w,e[7]=(a*h*r-u*l*r+u*n*c-t*h*c-a*n*f+t*l*f)*w,e[8]=_*w,e[9]=(g*d*r-u*x*r-g*i*f+t*x*f+u*i*p-t*d*p)*w,e[10]=(a*x*r-g*o*r+g*i*c-t*x*c-a*i*p+t*o*p)*w,e[11]=(u*o*r-a*d*r-u*i*c+t*d*c+a*i*f-t*o*f)*w,e[12]=T*w,e[13]=(u*x*n-g*d*n+g*i*h-t*x*h-u*i*m+t*d*m)*w,e[14]=(g*o*n-a*x*n-g*i*l+t*x*l+a*i*m-t*o*m)*w,e[15]=(a*d*n-u*o*n+u*i*l-t*d*l-a*i*h+t*o*h)*w,this}scale(e){const t=this.elements,i=e.x,n=e.y,r=e.z;return t[0]*=i,t[4]*=n,t[8]*=r,t[1]*=i,t[5]*=n,t[9]*=r,t[2]*=i,t[6]*=n,t[10]*=r,t[3]*=i,t[7]*=n,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,u*o+i,u*l-n*a,0,c*l-n*o,u*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,r,a){return this.set(1,i,r,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,h=r*c,f=r*u,g=r*d,x=a*u,m=a*d,p=o*d,y=l*c,v=l*u,_=l*d,T=i.x,M=i.y,w=i.z;return n[0]=(1-(x+p))*T,n[1]=(f+_)*T,n[2]=(g-v)*T,n[3]=0,n[4]=(f-_)*M,n[5]=(1-(h+p))*M,n[6]=(m+y)*M,n[7]=0,n[8]=(g+v)*w,n[9]=(m-y)*w,n[10]=(1-(h+x))*w,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;let r=mn.set(n[0],n[1],n[2]).length();const a=mn.set(n[4],n[5],n[6]).length(),o=mn.set(n[8],n[9],n[10]).length();this.determinant()<0&&(r=-r),e.x=n[12],e.y=n[13],e.z=n[14],oi.copy(this);const c=1/r,u=1/a,d=1/o;return oi.elements[0]*=c,oi.elements[1]*=c,oi.elements[2]*=c,oi.elements[4]*=u,oi.elements[5]*=u,oi.elements[6]*=u,oi.elements[8]*=d,oi.elements[9]*=d,oi.elements[10]*=d,t.setFromRotationMatrix(oi),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,n,r,a,o=Di){const l=this.elements,c=2*r/(t-e),u=2*r/(i-n),d=(t+e)/(t-e),h=(i+n)/(i-n);let f,g;if(o===Di)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Wr)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,n,r,a,o=Di){const l=this.elements,c=1/(t-e),u=1/(i-n),d=1/(a-r),h=(t+e)*c,f=(i+n)*u;let g,x;if(o===Di)g=(a+r)*d,x=-2*d;else if(o===Wr)g=r*d,x=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const mn=new P,oi=new fe,Zd=new P(0,0,0),Jd=new P(1,1,1),ki=new P,Ws=new P,Kt=new P,Xl=new fe,ql=new yi;class ta{constructor(e=0,t=0,i=0,n=ta.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],u=n[9],d=n[2],h=n[6],f=n[10];switch(t){case"XYZ":this._y=Math.asin(vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(vt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-vt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Xl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ql.setFromEuler(this),this.setFromQuaternion(ql,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ta.DEFAULT_ORDER="XYZ";class Bu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Qd=0;const Kl=new P,gn=new yi,Ei=new fe,Xs=new P,cs=new P,$d=new P,ef=new yi,jl=new P(1,0,0),Yl=new P(0,1,0),Zl=new P(0,0,1),tf={type:"added"},nf={type:"removed"};class ht extends cn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qd++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ht.DEFAULT_UP.clone();const e=new P,t=new ta,i=new yi,n=new P(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new fe},normalMatrix:{value:new Le}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gn.setFromAxisAngle(e,t),this.quaternion.multiply(gn),this}rotateOnWorldAxis(e,t){return gn.setFromAxisAngle(e,t),this.quaternion.premultiply(gn),this}rotateX(e){return this.rotateOnAxis(jl,e)}rotateY(e){return this.rotateOnAxis(Yl,e)}rotateZ(e){return this.rotateOnAxis(Zl,e)}translateOnAxis(e,t){return Kl.copy(e).applyQuaternion(this.quaternion),this.position.add(Kl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(jl,e)}translateY(e){return this.translateOnAxis(Yl,e)}translateZ(e){return this.translateOnAxis(Zl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Xs.copy(e):Xs.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(cs,Xs,this.up):Ei.lookAt(Xs,cs,this.up),this.quaternion.setFromRotationMatrix(Ei),n&&(Ei.extractRotation(n.matrixWorld),gn.setFromRotationMatrix(Ei),this.quaternion.premultiply(gn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(tf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(nf)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ei),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,e,$d),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,ef,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++){const r=t[i];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const n=this.children;for(let r=0,a=n.length;r<a;r++){const o=n[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxGeometryCount=this._maxGeometryCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));n.material=o}else n.material=r(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}}ht.DEFAULT_UP=new P(0,1,0);ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const li=new P,Ai=new P,Ra=new P,Ri=new P,vn=new P,xn=new P,Jl=new P,Pa=new P,Ca=new P,Ia=new P;let qs=!1;class Rt{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),li.subVectors(e,t),n.cross(li);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(e,t,i,n,r){li.subVectors(n,t),Ai.subVectors(i,t),Ra.subVectors(e,t);const a=li.dot(li),o=li.dot(Ai),l=li.dot(Ra),c=Ai.dot(Ai),u=Ai.dot(Ra),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const h=1/d,f=(c*l-o*u)*h,g=(a*u-o*l)*h;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getUV(e,t,i,n,r,a,o,l){return qs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),qs=!0),this.getInterpolation(e,t,i,n,r,a,o,l)}static getInterpolation(e,t,i,n,r,a,o,l){return this.getBarycoord(e,t,i,n,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ri.x),l.addScaledVector(a,Ri.y),l.addScaledVector(o,Ri.z),l)}static isFrontFacing(e,t,i,n){return li.subVectors(i,t),Ai.subVectors(e,t),li.cross(Ai).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return li.subVectors(this.c,this.b),Ai.subVectors(this.a,this.b),li.cross(Ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Rt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Rt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,n,r){return qs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),qs=!0),Rt.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}getInterpolation(e,t,i,n,r){return Rt.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}containsPoint(e){return Rt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Rt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,r=this.c;let a,o;vn.subVectors(n,i),xn.subVectors(r,i),Pa.subVectors(e,i);const l=vn.dot(Pa),c=xn.dot(Pa);if(l<=0&&c<=0)return t.copy(i);Ca.subVectors(e,n);const u=vn.dot(Ca),d=xn.dot(Ca);if(u>=0&&d<=u)return t.copy(n);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(vn,a);Ia.subVectors(e,r);const f=vn.dot(Ia),g=xn.dot(Ia);if(g>=0&&f<=g)return t.copy(r);const x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(xn,o);const m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return Jl.subVectors(r,n),o=(d-u)/(d-u+(f-g)),t.copy(n).addScaledVector(Jl,o);const p=1/(m+x+h);return a=x*p,o=h*p,t.copy(i).addScaledVector(vn,a).addScaledVector(xn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ou={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zi={h:0,s:0,l:0},Ks={h:0,s:0,l:0};function La(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class de{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,n=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.toWorkingColorSpace(this,n),this}setHSL(e,t,i,n=Qe.workingColorSpace){if(e=Bo(e,1),t=vt(t,0,1),i=vt(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=La(a,r,e+1/3),this.g=La(a,r,e),this.b=La(a,r,e-1/3)}return Qe.toWorkingColorSpace(this,n),this}setStyle(e,t=Et){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const i=Ou[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}copyLinearToSRGB(e){return this.r=_a(e.r),this.g=_a(e.g),this.b=_a(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return Qe.fromWorkingColorSpace(Nt.copy(this),e),Math.round(vt(Nt.r*255,0,255))*65536+Math.round(vt(Nt.g*255,0,255))*256+Math.round(vt(Nt.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Nt.copy(this),t);const i=Nt.r,n=Nt.g,r=Nt.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case i:l=(n-r)/d+(n<r?6:0);break;case n:l=(r-i)/d+2;break;case r:l=(i-n)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=Et){Qe.fromWorkingColorSpace(Nt.copy(this),e);const t=Nt.r,i=Nt.g,n=Nt.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(zi),this.setHSL(zi.h+e,zi.s+t,zi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(zi),e.getHSL(Ks);const i=Es(zi.h,Ks.h,t),n=Es(zi.s,Ks.s,t),r=Es(zi.l,Ks.l,t);return this.setHSL(i,n,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*n,this.g=r[1]*t+r[4]*i+r[7]*n,this.b=r[2]*t+r[5]*i+r[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new de;de.NAMES=Ou;let sf=0;class Yi extends cn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=qn,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=co,this.blendDst=uo,this.blendEquation=sn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new de(0,0,0),this.blendAlpha=0,this.depthFunc=Br,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ol,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=un,this.stencilZFail=un,this.stencilZPass=un,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==qn&&(i.blending=this.blending),this.side!==si&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==co&&(i.blendSrc=this.blendSrc),this.blendDst!==uo&&(i.blendDst=this.blendDst),this.blendEquation!==sn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Br&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ol&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==un&&(i.stencilFail=this.stencilFail),this.stencilZFail!==un&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==un&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=n(e.textures),a=n(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ku extends Yi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new de(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=bu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mt=new P,js=new ce;class st{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Mt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)js.fromBufferAttribute(this,t),js.applyMatrix3(e),this.setXY(t,js.x,js.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Je(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array),r=Je(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vo&&(e.usage=this.usage),e}}class zu extends st{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Gu extends st{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class rt extends st{constructor(e,t,i){super(new Float32Array(e),t,i)}}let rf=0;const ti=new fe,Da=new ht,yn=new P,jt=new wt,us=new wt,St=new P;class Tt extends cn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lu(e)?Gu:zu)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Le().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ti.makeRotationFromQuaternion(e),this.applyMatrix4(ti),this}rotateX(e){return ti.makeRotationX(e),this.applyMatrix4(ti),this}rotateY(e){return ti.makeRotationY(e),this.applyMatrix4(ti),this}rotateZ(e){return ti.makeRotationZ(e),this.applyMatrix4(ti),this}translate(e,t,i){return ti.makeTranslation(e,t,i),this.applyMatrix4(ti),this}scale(e,t,i){return ti.makeScale(e,t,i),this.applyMatrix4(ti),this}lookAt(e){return Da.lookAt(e),Da.updateMatrix(),this.applyMatrix4(Da.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yn).negate(),this.translate(yn.x,yn.y,yn.z),this}setFromPoints(e){const t=[];for(let i=0,n=e.length;i<n;i++){const r=e[i];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new rt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const r=t[i];jt.setFromBufferAttribute(r),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _i);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];us.setFromBufferAttribute(o),this.morphTargetsRelative?(St.addVectors(jt.min,us.min),jt.expandByPoint(St),St.addVectors(jt.max,us.max),jt.expandByPoint(St)):(jt.expandByPoint(us.min),jt.expandByPoint(us.max))}jt.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)St.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(St));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)St.fromBufferAttribute(o,c),l&&(yn.fromBufferAttribute(e,c),St.add(yn)),n=Math.max(n,i.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,n=t.position.array,r=t.normal.array,a=t.uv.array,o=n.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new st(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let b=0;b<o;b++)c[b]=new P,u[b]=new P;const d=new P,h=new P,f=new P,g=new ce,x=new ce,m=new ce,p=new P,y=new P;function v(b,L,D){d.fromArray(n,b*3),h.fromArray(n,L*3),f.fromArray(n,D*3),g.fromArray(a,b*2),x.fromArray(a,L*2),m.fromArray(a,D*2),h.sub(d),f.sub(d),x.sub(g),m.sub(g);const F=1/(x.x*m.y-m.x*x.y);isFinite(F)&&(p.copy(h).multiplyScalar(m.y).addScaledVector(f,-x.y).multiplyScalar(F),y.copy(f).multiplyScalar(x.x).addScaledVector(h,-m.x).multiplyScalar(F),c[b].add(p),c[L].add(p),c[D].add(p),u[b].add(y),u[L].add(y),u[D].add(y))}let _=this.groups;_.length===0&&(_=[{start:0,count:i.length}]);for(let b=0,L=_.length;b<L;++b){const D=_[b],F=D.start,I=D.count;for(let U=F,B=F+I;U<B;U+=3)v(i[U+0],i[U+1],i[U+2])}const T=new P,M=new P,w=new P,R=new P;function S(b){w.fromArray(r,b*3),R.copy(w);const L=c[b];T.copy(L),T.sub(w.multiplyScalar(w.dot(L))).normalize(),M.crossVectors(R,L);const F=M.dot(u[b])<0?-1:1;l[b*4]=T.x,l[b*4+1]=T.y,l[b*4+2]=T.z,l[b*4+3]=F}for(let b=0,L=_.length;b<L;++b){const D=_[b],F=D.start,I=D.count;for(let U=F,B=F+I;U<B;U+=3)S(i[U+0]),S(i[U+1]),S(i[U+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new st(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const n=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,d=new P;if(e)for(let h=0,f=e.count;h<f;h+=3){const g=e.getX(h+0),x=e.getX(h+1),m=e.getX(h+2);n.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),u.subVectors(a,r),d.subVectors(n,r),u.cross(d),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)n.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),d.subVectors(n,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,h=new c.constructor(l.length*u);let f=0,g=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*u;for(let p=0;p<u;p++)h[g++]=c[f++]}return new st(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){const h=c[u],f=e(h,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const n={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(n[l]=u,r=!0)}r&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const n=e.attributes;for(const c in n){const u=n[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ql=new fe,en=new ea,Ys=new _i,$l=new P,_n=new P,bn=new P,Sn=new P,Na=new P,Zs=new P,Js=new ce,Qs=new ce,$s=new ce,ec=new P,tc=new P,ic=new P,er=new P,tr=new P;class pt extends ht{constructor(e=new Tt,t=new ku){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(r&&o){Zs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],d=r[l];u!==0&&(Na.fromBufferAttribute(d,e),a?Zs.addScaledVector(Na,u):Zs.addScaledVector(Na.sub(t),u))}t.add(Zs)}return t}raycast(e,t){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ys.copy(i.boundingSphere),Ys.applyMatrix4(r),en.copy(e.ray).recast(e.near),!(Ys.containsPoint(en.origin)===!1&&(en.intersectSphere(Ys,$l)===null||en.origin.distanceToSquared($l)>(e.far-e.near)**2))&&(Ql.copy(r).invert(),en.copy(e.ray).applyMatrix4(Ql),!(i.boundingBox!==null&&en.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,en)))}_computeIntersections(e,t,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=h.length;g<x;g++){const m=h[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=y,T=v;_<T;_+=3){const M=o.getX(_),w=o.getX(_+1),R=o.getX(_+2);n=ir(this,p,e,i,c,u,d,M,w,R),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const y=o.getX(m),v=o.getX(m+1),_=o.getX(m+2);n=ir(this,a,e,i,c,u,d,y,v,_),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=h.length;g<x;g++){const m=h[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=y,T=v;_<T;_+=3){const M=_,w=_+1,R=_+2;n=ir(this,p,e,i,c,u,d,M,w,R),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const y=m,v=m+1,_=m+2;n=ir(this,a,e,i,c,u,d,y,v,_),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}}}function af(s,e,t,i,n,r,a,o){let l;if(e.side===Vt?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,e.side===si,o),l===null)return null;tr.copy(o),tr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(tr);return c<t.near||c>t.far?null:{distance:c,point:tr.clone(),object:s}}function ir(s,e,t,i,n,r,a,o,l,c){s.getVertexPosition(o,_n),s.getVertexPosition(l,bn),s.getVertexPosition(c,Sn);const u=af(s,e,t,i,_n,bn,Sn,er);if(u){n&&(Js.fromBufferAttribute(n,o),Qs.fromBufferAttribute(n,l),$s.fromBufferAttribute(n,c),u.uv=Rt.getInterpolation(er,_n,bn,Sn,Js,Qs,$s,new ce)),r&&(Js.fromBufferAttribute(r,o),Qs.fromBufferAttribute(r,l),$s.fromBufferAttribute(r,c),u.uv1=Rt.getInterpolation(er,_n,bn,Sn,Js,Qs,$s,new ce),u.uv2=u.uv1),a&&(ec.fromBufferAttribute(a,o),tc.fromBufferAttribute(a,l),ic.fromBufferAttribute(a,c),u.normal=Rt.getInterpolation(er,_n,bn,Sn,ec,tc,ic,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new P,materialIndex:0};Rt.getNormal(_n,bn,Sn,d.normal),u.face=d}return u}class Ds extends Tt{constructor(e=1,t=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],d=[];let h=0,f=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,n,a,2),g("x","z","y",1,-1,e,i,-t,n,a,3),g("x","y","z",1,-1,e,t,i,n,r,4),g("x","y","z",-1,-1,e,t,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new rt(c,3)),this.setAttribute("normal",new rt(u,3)),this.setAttribute("uv",new rt(d,2));function g(x,m,p,y,v,_,T,M,w,R,S){const b=_/w,L=T/R,D=_/2,F=T/2,I=M/2,U=w+1,B=R+1;let K=0,q=0;const H=new P;for(let j=0;j<B;j++){const Y=j*L-F;for(let ae=0;ae<U;ae++){const X=ae*b-D;H[x]=X*y,H[m]=Y*v,H[p]=I,c.push(H.x,H.y,H.z),H[x]=0,H[m]=0,H[p]=M>0?1:-1,u.push(H.x,H.y,H.z),d.push(ae/w),d.push(1-j/R),K+=1}}for(let j=0;j<R;j++)for(let Y=0;Y<w;Y++){const ae=h+Y+U*j,X=h+Y+U*(j+1),Z=h+(Y+1)+U*(j+1),oe=h+(Y+1)+U*j;l.push(ae,X,oe),l.push(X,Z,oe),q+=6}o.addGroup(f,q,S),f+=q,h+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $n(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const n=s[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function zt(s){const e={};for(let t=0;t<s.length;t++){const i=$n(s[t]);for(const n in i)e[n]=i[n]}return e}function of(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Vu(s){return s.getRenderTarget()===null?s.outputColorSpace:Qe.workingColorSpace}const lf={clone:$n,merge:zt};var cf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class dt extends Yi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cf,this.fragmentShader=uf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$n(e.uniforms),this.uniformsGroups=of(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?t.uniforms[n]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[n]={type:"m4",value:a.toArray()}:t.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Hu extends ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=Di}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Yt extends Hu{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Qn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ts*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qn*2*Math.atan(Math.tan(Ts*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,n,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ts*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Mn=-90,wn=1;class hf extends ht{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new Yt(Mn,wn,e,t);n.layers=this.layers,this.add(n);const r=new Yt(Mn,wn,e,t);r.layers=this.layers,this.add(r);const a=new Yt(Mn,wn,e,t);a.layers=this.layers,this.add(a);const o=new Yt(Mn,wn,e,t);o.layers=this.layers,this.add(o);const l=new Yt(Mn,wn,e,t);l.layers=this.layers,this.add(l);const c=new Yt(Mn,wn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Di)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Wr)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,r),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,l),e.setRenderTarget(i,4,n),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,n),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Wu extends Ut{constructor(e,t,i,n,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Yn,super(e,t,i,n,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class df extends It{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];t.encoding!==void 0&&(As("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===ln?Et:Wt),this.texture=new Wu(n,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Xe}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new Ds(5,5,5),r=new dt({name:"CubemapFromEquirect",uniforms:$n(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Vt,blending:Xi});r.uniforms.tEquirect.value=t;const a=new pt(n,r),o=t.minFilter;return t.minFilter===Ps&&(t.minFilter=Xe),new hf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,n){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(r)}}const Ua=new P,ff=new P,pf=new Le;class Li{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=Ua.subVectors(i,t).cross(ff.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ua),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/n;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||pf.getNormalMatrix(e),n=this.coplanarPoint(Ua).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const tn=new _i,nr=new P;class Oo{constructor(e=new Li,t=new Li,i=new Li,n=new Li,r=new Li,a=new Li){this.planes=[e,t,i,n,r,a]}set(e,t,i,n,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Di){const i=this.planes,n=e.elements,r=n[0],a=n[1],o=n[2],l=n[3],c=n[4],u=n[5],d=n[6],h=n[7],f=n[8],g=n[9],x=n[10],m=n[11],p=n[12],y=n[13],v=n[14],_=n[15];if(i[0].setComponents(l-r,h-c,m-f,_-p).normalize(),i[1].setComponents(l+r,h+c,m+f,_+p).normalize(),i[2].setComponents(l+a,h+u,m+g,_+y).normalize(),i[3].setComponents(l-a,h-u,m-g,_-y).normalize(),i[4].setComponents(l-o,h-d,m-x,_-v).normalize(),t===Di)i[5].setComponents(l+o,h+d,m+x,_+v).normalize();else if(t===Wr)i[5].setComponents(o,d,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),tn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),tn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(tn)}intersectsSprite(e){return tn.center.set(0,0,0),tn.radius=.7071067811865476,tn.applyMatrix4(e.matrixWorld),this.intersectsSphere(tn)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(nr.x=n.normal.x>0?e.max.x:e.min.x,nr.y=n.normal.y>0?e.max.y:e.min.y,nr.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(nr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Xu(){let s=null,e=!1,t=null,i=null;function n(r,a){t(r,a),i=s.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=s.requestAnimationFrame(n),e=!0)},stop:function(){s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function mf(s,e){const t=e.isWebGL2,i=new WeakMap;function n(c,u){const d=c.array,h=c.usage,f=d.byteLength,g=s.createBuffer();s.bindBuffer(u,g),s.bufferData(u,d,h),c.onUploadCallback();let x;if(d instanceof Float32Array)x=s.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)x=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)x=s.SHORT;else if(d instanceof Uint32Array)x=s.UNSIGNED_INT;else if(d instanceof Int32Array)x=s.INT;else if(d instanceof Int8Array)x=s.BYTE;else if(d instanceof Uint8Array)x=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)x=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:x,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,u,d){const h=u.array,f=u._updateRange,g=u.updateRanges;if(s.bindBuffer(d,c),f.count===-1&&g.length===0&&s.bufferSubData(d,0,h),g.length!==0){for(let x=0,m=g.length;x<m;x++){const p=g[x];t?s.bufferSubData(d,p.start*h.BYTES_PER_ELEMENT,h,p.start,p.count):s.bufferSubData(d,p.start*h.BYTES_PER_ELEMENT,h.subarray(p.start,p.start+p.count))}u.clearUpdateRanges()}f.count!==-1&&(t?s.bufferSubData(d,f.offset*h.BYTES_PER_ELEMENT,h,f.offset,f.count):s.bufferSubData(d,f.offset*h.BYTES_PER_ELEMENT,h.subarray(f.offset,f.offset+f.count)),f.count=-1),u.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);u&&(s.deleteBuffer(u.buffer),i.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const h=i.get(c);(!h||h.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=i.get(c);if(d===void 0)i.set(c,n(c,u));else if(d.version<c.version){if(d.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,c,u),d.version=c.version}}return{get:a,remove:o,update:l}}class $t extends Tt{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,u=l+1,d=e/o,h=t/l,f=[],g=[],x=[],m=[];for(let p=0;p<u;p++){const y=p*h-a;for(let v=0;v<c;v++){const _=v*d-r;g.push(_,-y,0),x.push(0,0,1),m.push(v/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const v=y+c*p,_=y+c*(p+1),T=y+1+c*(p+1),M=y+1+c*p;f.push(v,_,M),f.push(_,T,M)}this.setIndex(f),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(x,3)),this.setAttribute("uv",new rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $t(e.width,e.height,e.widthSegments,e.heightSegments)}}var gf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vf=`#ifdef USE_ALPHAHASH
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
#endif`,xf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_f=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,bf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sf=`#ifdef USE_AOMAP
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
#endif`,Mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wf=`#ifdef USE_BATCHING
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
#endif`,Tf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ef=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Af=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Pf=`#ifdef USE_IRIDESCENCE
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
#endif`,Cf=`#ifdef USE_BUMPMAP
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
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ff=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Of=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,kf=`#define PI 3.141592653589793
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
} // validated`,zf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Gf=`vec3 transformedNormal = objectNormal;
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
#endif`,Vf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kf=`
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
}`,jf=`#ifdef USE_ENVMAP
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
#endif`,Yf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zf=`#ifdef USE_ENVMAP
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
#endif`,Jf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qf=`#ifdef USE_ENVMAP
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
#endif`,$f=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ep=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ip=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,np=`#ifdef USE_GRADIENTMAP
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
}`,sp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,rp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ap=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,op=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lp=`uniform bool receiveShadow;
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
#endif`,cp=`#ifdef USE_ENVMAP
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
#endif`,up=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pp=`PhysicalMaterial material;
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
#endif`,mp=`struct PhysicalMaterial {
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
}`,gp=`
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
#endif`,vp=`#if defined( RE_IndirectDiffuse )
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
#endif`,xp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_p=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Sp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Mp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ep=`#if defined( USE_POINTS_UV )
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
#endif`,Ap=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Rp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Cp=`#ifdef USE_MORPHNORMALS
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
#endif`,Ip=`#ifdef USE_MORPHTARGETS
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
#endif`,Lp=`#ifdef USE_MORPHTARGETS
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
#endif`,Dp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Np=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Op=`#ifdef USE_NORMALMAP
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
#endif`,kp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Wp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Xp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Jp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$p=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,em=`float getShadowMask() {
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
}`,tm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,im=`#ifdef USE_SKINNING
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
#endif`,nm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,sm=`#ifdef USE_SKINNING
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
#endif`,rm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,am=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,cm=`#ifdef USE_TRANSMISSION
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
#endif`,um=`#ifdef USE_TRANSMISSION
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
#endif`,hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const mm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gm=`uniform sampler2D t2D;
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
}`,vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_m=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bm=`#include <common>
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
}`,Sm=`#if DEPTH_PACKING == 3200
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
}`,Mm=`#define DISTANCE
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
}`,wm=`#define DISTANCE
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
}`,Tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Em=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Am=`uniform float scale;
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
}`,Rm=`uniform vec3 diffuse;
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
}`,Pm=`#include <common>
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
}`,Cm=`uniform vec3 diffuse;
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
}`,Im=`#define LAMBERT
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
}`,Lm=`#define LAMBERT
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
}`,Dm=`#define MATCAP
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
}`,Nm=`#define MATCAP
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
}`,Um=`#define NORMAL
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
}`,Fm=`#define NORMAL
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
}`,Bm=`#define PHONG
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
}`,Om=`#define PHONG
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
}`,km=`#define STANDARD
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
}`,zm=`#define STANDARD
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
}`,Gm=`#define TOON
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
}`,Vm=`#define TOON
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
}`,Hm=`uniform float size;
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
}`,Wm=`uniform vec3 diffuse;
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
}`,Xm=`#include <common>
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
}`,qm=`uniform vec3 color;
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
}`,Km=`uniform float rotation;
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
}`,jm=`uniform vec3 diffuse;
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
}`,Ue={alphahash_fragment:gf,alphahash_pars_fragment:vf,alphamap_fragment:xf,alphamap_pars_fragment:yf,alphatest_fragment:_f,alphatest_pars_fragment:bf,aomap_fragment:Sf,aomap_pars_fragment:Mf,batching_pars_vertex:wf,batching_vertex:Tf,begin_vertex:Ef,beginnormal_vertex:Af,bsdfs:Rf,iridescence_fragment:Pf,bumpmap_pars_fragment:Cf,clipping_planes_fragment:If,clipping_planes_pars_fragment:Lf,clipping_planes_pars_vertex:Df,clipping_planes_vertex:Nf,color_fragment:Uf,color_pars_fragment:Ff,color_pars_vertex:Bf,color_vertex:Of,common:kf,cube_uv_reflection_fragment:zf,defaultnormal_vertex:Gf,displacementmap_pars_vertex:Vf,displacementmap_vertex:Hf,emissivemap_fragment:Wf,emissivemap_pars_fragment:Xf,colorspace_fragment:qf,colorspace_pars_fragment:Kf,envmap_fragment:jf,envmap_common_pars_fragment:Yf,envmap_pars_fragment:Zf,envmap_pars_vertex:Jf,envmap_physical_pars_fragment:cp,envmap_vertex:Qf,fog_vertex:$f,fog_pars_vertex:ep,fog_fragment:tp,fog_pars_fragment:ip,gradientmap_pars_fragment:np,lightmap_fragment:sp,lightmap_pars_fragment:rp,lights_lambert_fragment:ap,lights_lambert_pars_fragment:op,lights_pars_begin:lp,lights_toon_fragment:up,lights_toon_pars_fragment:hp,lights_phong_fragment:dp,lights_phong_pars_fragment:fp,lights_physical_fragment:pp,lights_physical_pars_fragment:mp,lights_fragment_begin:gp,lights_fragment_maps:vp,lights_fragment_end:xp,logdepthbuf_fragment:yp,logdepthbuf_pars_fragment:_p,logdepthbuf_pars_vertex:bp,logdepthbuf_vertex:Sp,map_fragment:Mp,map_pars_fragment:wp,map_particle_fragment:Tp,map_particle_pars_fragment:Ep,metalnessmap_fragment:Ap,metalnessmap_pars_fragment:Rp,morphcolor_vertex:Pp,morphnormal_vertex:Cp,morphtarget_pars_vertex:Ip,morphtarget_vertex:Lp,normal_fragment_begin:Dp,normal_fragment_maps:Np,normal_pars_fragment:Up,normal_pars_vertex:Fp,normal_vertex:Bp,normalmap_pars_fragment:Op,clearcoat_normal_fragment_begin:kp,clearcoat_normal_fragment_maps:zp,clearcoat_pars_fragment:Gp,iridescence_pars_fragment:Vp,opaque_fragment:Hp,packing:Wp,premultiplied_alpha_fragment:Xp,project_vertex:qp,dithering_fragment:Kp,dithering_pars_fragment:jp,roughnessmap_fragment:Yp,roughnessmap_pars_fragment:Zp,shadowmap_pars_fragment:Jp,shadowmap_pars_vertex:Qp,shadowmap_vertex:$p,shadowmask_pars_fragment:em,skinbase_vertex:tm,skinning_pars_vertex:im,skinning_vertex:nm,skinnormal_vertex:sm,specularmap_fragment:rm,specularmap_pars_fragment:am,tonemapping_fragment:om,tonemapping_pars_fragment:lm,transmission_fragment:cm,transmission_pars_fragment:um,uv_pars_fragment:hm,uv_pars_vertex:dm,uv_vertex:fm,worldpos_vertex:pm,background_vert:mm,background_frag:gm,backgroundCube_vert:vm,backgroundCube_frag:xm,cube_vert:ym,cube_frag:_m,depth_vert:bm,depth_frag:Sm,distanceRGBA_vert:Mm,distanceRGBA_frag:wm,equirect_vert:Tm,equirect_frag:Em,linedashed_vert:Am,linedashed_frag:Rm,meshbasic_vert:Pm,meshbasic_frag:Cm,meshlambert_vert:Im,meshlambert_frag:Lm,meshmatcap_vert:Dm,meshmatcap_frag:Nm,meshnormal_vert:Um,meshnormal_frag:Fm,meshphong_vert:Bm,meshphong_frag:Om,meshphysical_vert:km,meshphysical_frag:zm,meshtoon_vert:Gm,meshtoon_frag:Vm,points_vert:Hm,points_frag:Wm,shadow_vert:Xm,shadow_frag:qm,sprite_vert:Km,sprite_frag:jm},ie={common:{diffuse:{value:new de(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new de(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new de(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new de(16777215)},opacity:{value:1},center:{value:new ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},gi={basic:{uniforms:zt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:zt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new de(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:zt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new de(0)},specular:{value:new de(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:zt([ie.common,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.roughnessmap,ie.metalnessmap,ie.fog,ie.lights,{emissive:{value:new de(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:zt([ie.common,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.gradientmap,ie.fog,ie.lights,{emissive:{value:new de(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:zt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:zt([ie.points,ie.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:zt([ie.common,ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:zt([ie.common,ie.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:zt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:zt([ie.sprite,ie.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:zt([ie.common,ie.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:zt([ie.lights,ie.fog,{color:{value:new de(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};gi.physical={uniforms:zt([gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new de(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new de(0)},specularColor:{value:new de(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const sr={r:0,b:0,g:0};function Ym(s,e,t,i,n,r,a){const o=new de(0);let l=r===!0?0:1,c,u,d=null,h=0,f=null;function g(m,p){let y=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?t:e).get(v)),v===null?x(o,l):v&&v.isColor&&(x(v,1),y=!0);const _=s.xr.getEnvironmentBlendMode();_==="additive"?i.buffers.color.setClear(0,0,0,1,a):_==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(s.autoClear||y)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Zr)?(u===void 0&&(u=new pt(new Ds(1,1,1),new dt({name:"BackgroundCubeMaterial",uniforms:$n(gi.backgroundCube.uniforms),vertexShader:gi.backgroundCube.vertexShader,fragmentShader:gi.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,M,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(u)),u.material.uniforms.envMap.value=v,u.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,u.material.toneMapped=Qe.getTransfer(v.colorSpace)!==it,(d!==v||h!==v.version||f!==s.toneMapping)&&(u.material.needsUpdate=!0,d=v,h=v.version,f=s.toneMapping),u.layers.enableAll(),m.unshift(u,u.geometry,u.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new pt(new $t(2,2),new dt({name:"BackgroundMaterial",uniforms:$n(gi.background.uniforms),vertexShader:gi.background.vertexShader,fragmentShader:gi.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(v.colorSpace)!==it,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(d!==v||h!==v.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,d=v,h=v.version,f=s.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function x(m,p){m.getRGB(sr,Vu(s)),i.buffers.color.setClear(sr.r,sr.g,sr.b,p,a)}return{getClearColor:function(){return o},setClearColor:function(m,p=1){o.set(m),l=p,x(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,x(o,l)},render:g}}function Zm(s,e,t,i){const n=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||r!==null,o={},l=m(null);let c=l,u=!1;function d(I,U,B,K,q){let H=!1;if(a){const j=x(K,B,U);c!==j&&(c=j,f(c.object)),H=p(I,K,B,q),H&&y(I,K,B,q)}else{const j=U.wireframe===!0;(c.geometry!==K.id||c.program!==B.id||c.wireframe!==j)&&(c.geometry=K.id,c.program=B.id,c.wireframe=j,H=!0)}q!==null&&t.update(q,s.ELEMENT_ARRAY_BUFFER),(H||u)&&(u=!1,R(I,U,B,K),q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function h(){return i.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function f(I){return i.isWebGL2?s.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return i.isWebGL2?s.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function x(I,U,B){const K=B.wireframe===!0;let q=o[I.id];q===void 0&&(q={},o[I.id]=q);let H=q[U.id];H===void 0&&(H={},q[U.id]=H);let j=H[K];return j===void 0&&(j=m(h()),H[K]=j),j}function m(I){const U=[],B=[],K=[];for(let q=0;q<n;q++)U[q]=0,B[q]=0,K[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:B,attributeDivisors:K,object:I,attributes:{},index:null}}function p(I,U,B,K){const q=c.attributes,H=U.attributes;let j=0;const Y=B.getAttributes();for(const ae in Y)if(Y[ae].location>=0){const Z=q[ae];let oe=H[ae];if(oe===void 0&&(ae==="instanceMatrix"&&I.instanceMatrix&&(oe=I.instanceMatrix),ae==="instanceColor"&&I.instanceColor&&(oe=I.instanceColor)),Z===void 0||Z.attribute!==oe||oe&&Z.data!==oe.data)return!0;j++}return c.attributesNum!==j||c.index!==K}function y(I,U,B,K){const q={},H=U.attributes;let j=0;const Y=B.getAttributes();for(const ae in Y)if(Y[ae].location>=0){let Z=H[ae];Z===void 0&&(ae==="instanceMatrix"&&I.instanceMatrix&&(Z=I.instanceMatrix),ae==="instanceColor"&&I.instanceColor&&(Z=I.instanceColor));const oe={};oe.attribute=Z,Z&&Z.data&&(oe.data=Z.data),q[ae]=oe,j++}c.attributes=q,c.attributesNum=j,c.index=K}function v(){const I=c.newAttributes;for(let U=0,B=I.length;U<B;U++)I[U]=0}function _(I){T(I,0)}function T(I,U){const B=c.newAttributes,K=c.enabledAttributes,q=c.attributeDivisors;B[I]=1,K[I]===0&&(s.enableVertexAttribArray(I),K[I]=1),q[I]!==U&&((i.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,U),q[I]=U)}function M(){const I=c.newAttributes,U=c.enabledAttributes;for(let B=0,K=U.length;B<K;B++)U[B]!==I[B]&&(s.disableVertexAttribArray(B),U[B]=0)}function w(I,U,B,K,q,H,j){j===!0?s.vertexAttribIPointer(I,U,B,q,H):s.vertexAttribPointer(I,U,B,K,q,H)}function R(I,U,B,K){if(i.isWebGL2===!1&&(I.isInstancedMesh||K.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const q=K.attributes,H=B.getAttributes(),j=U.defaultAttributeValues;for(const Y in H){const ae=H[Y];if(ae.location>=0){let X=q[Y];if(X===void 0&&(Y==="instanceMatrix"&&I.instanceMatrix&&(X=I.instanceMatrix),Y==="instanceColor"&&I.instanceColor&&(X=I.instanceColor)),X!==void 0){const Z=X.normalized,oe=X.itemSize,xe=t.get(X);if(xe===void 0)continue;const ve=xe.buffer,Ce=xe.type,De=xe.bytesPerElement,we=i.isWebGL2===!0&&(Ce===s.INT||Ce===s.UNSIGNED_INT||X.gpuType===ws);if(X.isInterleavedBufferAttribute){const He=X.data,k=He.stride,Ft=X.offset;if(He.isInstancedInterleavedBuffer){for(let _e=0;_e<ae.locationSize;_e++)T(ae.location+_e,He.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=He.meshPerAttribute*He.count)}else for(let _e=0;_e<ae.locationSize;_e++)_(ae.location+_e);s.bindBuffer(s.ARRAY_BUFFER,ve);for(let _e=0;_e<ae.locationSize;_e++)w(ae.location+_e,oe/ae.locationSize,Ce,Z,k*De,(Ft+oe/ae.locationSize*_e)*De,we)}else{if(X.isInstancedBufferAttribute){for(let He=0;He<ae.locationSize;He++)T(ae.location+He,X.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let He=0;He<ae.locationSize;He++)_(ae.location+He);s.bindBuffer(s.ARRAY_BUFFER,ve);for(let He=0;He<ae.locationSize;He++)w(ae.location+He,oe/ae.locationSize,Ce,Z,oe*De,oe/ae.locationSize*He*De,we)}}else if(j!==void 0){const Z=j[Y];if(Z!==void 0)switch(Z.length){case 2:s.vertexAttrib2fv(ae.location,Z);break;case 3:s.vertexAttrib3fv(ae.location,Z);break;case 4:s.vertexAttrib4fv(ae.location,Z);break;default:s.vertexAttrib1fv(ae.location,Z)}}}}M()}function S(){D();for(const I in o){const U=o[I];for(const B in U){const K=U[B];for(const q in K)g(K[q].object),delete K[q];delete U[B]}delete o[I]}}function b(I){if(o[I.id]===void 0)return;const U=o[I.id];for(const B in U){const K=U[B];for(const q in K)g(K[q].object),delete K[q];delete U[B]}delete o[I.id]}function L(I){for(const U in o){const B=o[U];if(B[I.id]===void 0)continue;const K=B[I.id];for(const q in K)g(K[q].object),delete K[q];delete B[I.id]}}function D(){F(),u=!0,c!==l&&(c=l,f(c.object))}function F(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:D,resetDefaultState:F,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfProgram:L,initAttributes:v,enableAttribute:_,disableUnusedAttributes:M}}function Jm(s,e,t,i){const n=i.isWebGL2;let r;function a(u){r=u}function o(u,d){s.drawArrays(r,u,d),t.update(d,r,1)}function l(u,d,h){if(h===0)return;let f,g;if(n)f=s,g="drawArraysInstanced";else if(f=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,u,d,h),t.update(d,r,h)}function c(u,d,h){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<h;g++)this.render(u[g],d[g]);else{f.multiDrawArraysWEBGL(r,u,0,d,0,h);let g=0;for(let x=0;x<h;x++)g+=d[x];t.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function Qm(s,e,t){let i;function n(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),h=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),v=h>0,_=a||e.has("OES_texture_float"),T=v&&_,M=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:n,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:h,maxTextureSize:f,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:v,floatFragmentTextures:_,floatVertexTextures:T,maxSamples:M}}function $m(s){const e=this;let t=null,i=0,n=!1,r=!1;const a=new Li,o=new Le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||i!==0||n;return n=h,i=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){const g=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,p=s.get(d);if(!n||g===null||g.length===0||r&&!m)r?u(null):c();else{const y=r?0:i,v=y*4;let _=p.clippingState||null;l.value=_,_=u(g,h,v,f);for(let T=0;T!==v;++T)_[T]=t[T];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,f,g){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const p=f+x*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,_=f;v!==x;++v,_+=4)a.copy(d[v]).applyMatrix4(y,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function eg(s){let e=new WeakMap;function t(a,o){return o===ho?a.mapping=Yn:o===fo&&(a.mapping=Zn),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===ho||o===fo)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new df(l.height/2);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",n),t(c.texture,a.mapping)}else return null}}return a}function n(a){const o=a.target;o.removeEventListener("dispose",n);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}class ri extends Hu{constructor(e=-1,t=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Hn=4,nc=[.125,.215,.35,.446,.526,.582],rn=20,Fa=new ri,sc=new de;let Ba=null,Oa=0,ka=0;const nn=(1+Math.sqrt(5))/2,Tn=1/nn,rc=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,nn,Tn),new P(0,nn,-Tn),new P(Tn,0,nn),new P(-Tn,0,nn),new P(nn,Tn,0),new P(-nn,Tn,0)];class ac{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100){Ba=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),ka=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,n,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ba,Oa,ka),e.scissorTest=!1,rr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yn||e.mapping===Zn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ba=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),ka=this._renderer.getActiveMipmapLevel();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Xe,minFilter:Xe,generateMipmaps:!1,type:Pt,format:Ye,colorSpace:di,depthBuffer:!1},n=oc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=oc(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tg(r)),this._blurMaterial=ig(r,e,t)}return n}_compileMaterial(e){const t=new pt(this._lodPlanes[0],e);this._renderer.compile(t,Fa)}_sceneToCubeUV(e,t,i,n){const o=new Yt(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,h=u.toneMapping;u.getClearColor(sc),u.toneMapping=qi,u.autoClear=!1;const f=new ku({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),g=new pt(new Ds,f);let x=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,x=!0):(f.color.copy(sc),x=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):y===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const v=this._cubeSize;rr(n,y*v,p>2?v:0,v,v),u.setRenderTarget(n),x&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=d,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,n=e.mapping===Yn||e.mapping===Zn;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=cc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lc());const r=n?this._cubemapMaterial:this._equirectMaterial,a=new pt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;rr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Fa)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let n=1;n<this._lodPlanes.length;n++){const r=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),a=rc[(n-1)%rc.length];this._blur(e,n-1,n,r,a)}t.autoClear=i}_blur(e,t,i,n,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",r),this._halfBlur(a,e,i,i,n,"longitudinal",r)}_halfBlur(e,t,i,n,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new pt(this._lodPlanes[n],c),h=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*rn-1),x=r/g,m=isFinite(r)?1+Math.floor(u*x):rn;m>rn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${rn}`);const p=[];let y=0;for(let w=0;w<rn;++w){const R=w/x,S=Math.exp(-R*R/2);p.push(S),w===0?y+=S:w<m&&(y+=2*S)}for(let w=0;w<p.length;w++)p[w]=p[w]/y;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-i;const _=this._sizeLods[n],T=3*_*(n>v-Hn?n-v+Hn:0),M=4*(this._cubeSize-_);rr(t,T,M,3*_,2*_),l.setRenderTarget(t),l.render(d,Fa)}}function tg(s){const e=[],t=[],i=[];let n=s;const r=s-Hn+1+nc.length;for(let a=0;a<r;a++){const o=Math.pow(2,n);t.push(o);let l=1/o;a>s-Hn?l=nc[a-s+Hn-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,g=6,x=3,m=2,p=1,y=new Float32Array(x*g*f),v=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let M=0;M<f;M++){const w=M%3*2/3-1,R=M>2?0:-1,S=[w,R,0,w+2/3,R,0,w+2/3,R+1,0,w,R,0,w+2/3,R+1,0,w,R+1,0];y.set(S,x*g*M),v.set(h,m*g*M);const b=[M,M,M,M,M,M];_.set(b,p*g*M)}const T=new Tt;T.setAttribute("position",new st(y,x)),T.setAttribute("uv",new st(v,m)),T.setAttribute("faceIndex",new st(_,p)),e.push(T),n>Hn&&n--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function oc(s,e,t){const i=new It(s,e,t);return i.texture.mapping=Zr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function rr(s,e,t,i,n){s.viewport.set(e,t,i,n),s.scissor.set(e,t,i,n)}function ig(s,e,t){const i=new Float32Array(rn),n=new P(0,1,0);return new dt({name:"SphericalGaussianBlur",defines:{n:rn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:ko(),fragmentShader:`

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
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function lc(){return new dt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ko(),fragmentShader:`

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
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function cc(){return new dt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function ko(){return`

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
	`}function ng(s){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===ho||l===fo,u=l===Yn||l===Zn;if(c||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let d=e.get(o);return t===null&&(t=new ac(s)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),e.set(o,d),d.texture}else{if(e.has(o))return e.get(o).texture;{const d=o.image;if(c&&d&&d.height>0||u&&d&&n(d)){t===null&&(t=new ac(s));const h=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,h),o.addEventListener("dispose",r),h.texture}else return null}}}return o}function n(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function sg(s){const e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=s.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const n=t(i);return n===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function rg(s,e,t,i){const n={},r=new WeakMap;function a(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const x=h.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)e.remove(x[m])}h.removeEventListener("dispose",a),delete n[h.id];const f=r.get(h);f&&(e.remove(f),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return n[h.id]===!0||(h.addEventListener("dispose",a),n[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const g in h)e.update(h[g],s.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const x=f[g];for(let m=0,p=x.length;m<p;m++)e.update(x[m],s.ARRAY_BUFFER)}}function c(d){const h=[],f=d.index,g=d.attributes.position;let x=0;if(f!==null){const y=f.array;x=f.version;for(let v=0,_=y.length;v<_;v+=3){const T=y[v+0],M=y[v+1],w=y[v+2];h.push(T,M,M,w,w,T)}}else if(g!==void 0){const y=g.array;x=g.version;for(let v=0,_=y.length/3-1;v<_;v+=3){const T=v+0,M=v+1,w=v+2;h.push(T,M,M,w,w,T)}}else return;const m=new(Lu(h)?Gu:zu)(h,1);m.version=x;const p=r.get(d);p&&e.remove(p),r.set(d,m)}function u(d){const h=r.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function ag(s,e,t,i){const n=i.isWebGL2;let r;function a(f){r=f}let o,l;function c(f){o=f.type,l=f.bytesPerElement}function u(f,g){s.drawElements(r,g,o,f*l),t.update(g,r,1)}function d(f,g,x){if(x===0)return;let m,p;if(n)m=s,p="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,o,f*l,x),t.update(g,r,x)}function h(f,g,x){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<x;p++)this.render(f[p]/l,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,o,f,0,x);let p=0;for(let y=0;y<x;y++)p+=g[y];t.update(p,r,1)}}this.setMode=a,this.setIndex=c,this.render=u,this.renderInstances=d,this.renderMultiDraw=h}function og(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function lg(s,e){return s[0]-e[0]}function cg(s,e){return Math.abs(e[1])-Math.abs(s[1])}function ug(s,e,t){const i={},n=new Float32Array(8),r=new WeakMap,a=new We,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,u,d){const h=c.morphTargetInfluences;if(e.isWebGL2===!0){const f=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=f!==void 0?f.length:0;let x=r.get(u);if(x===void 0||x.count!==g){let I=function(){D.dispose(),r.delete(u),u.removeEventListener("dispose",I)};x!==void 0&&x.texture.dispose();const y=u.morphAttributes.position!==void 0,v=u.morphAttributes.normal!==void 0,_=u.morphAttributes.color!==void 0,T=u.morphAttributes.position||[],M=u.morphAttributes.normal||[],w=u.morphAttributes.color||[];let R=0;y===!0&&(R=1),v===!0&&(R=2),_===!0&&(R=3);let S=u.attributes.position.count*R,b=1;S>e.maxTextureSize&&(b=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const L=new Float32Array(S*b*4*g),D=new Uu(L,S,b,g);D.type=Mt,D.needsUpdate=!0;const F=R*4;for(let U=0;U<g;U++){const B=T[U],K=M[U],q=w[U],H=S*b*4*U;for(let j=0;j<B.count;j++){const Y=j*F;y===!0&&(a.fromBufferAttribute(B,j),L[H+Y+0]=a.x,L[H+Y+1]=a.y,L[H+Y+2]=a.z,L[H+Y+3]=0),v===!0&&(a.fromBufferAttribute(K,j),L[H+Y+4]=a.x,L[H+Y+5]=a.y,L[H+Y+6]=a.z,L[H+Y+7]=0),_===!0&&(a.fromBufferAttribute(q,j),L[H+Y+8]=a.x,L[H+Y+9]=a.y,L[H+Y+10]=a.z,L[H+Y+11]=q.itemSize===4?a.w:1)}}x={count:g,texture:D,size:new ce(S,b)},r.set(u,x),u.addEventListener("dispose",I)}let m=0;for(let y=0;y<h.length;y++)m+=h[y];const p=u.morphTargetsRelative?1:1-m;d.getUniforms().setValue(s,"morphTargetBaseInfluence",p),d.getUniforms().setValue(s,"morphTargetInfluences",h),d.getUniforms().setValue(s,"morphTargetsTexture",x.texture,t),d.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}else{const f=h===void 0?0:h.length;let g=i[u.id];if(g===void 0||g.length!==f){g=[];for(let v=0;v<f;v++)g[v]=[v,0];i[u.id]=g}for(let v=0;v<f;v++){const _=g[v];_[0]=v,_[1]=h[v]}g.sort(cg);for(let v=0;v<8;v++)v<f&&g[v][1]?(o[v][0]=g[v][0],o[v][1]=g[v][1]):(o[v][0]=Number.MAX_SAFE_INTEGER,o[v][1]=0);o.sort(lg);const x=u.morphAttributes.position,m=u.morphAttributes.normal;let p=0;for(let v=0;v<8;v++){const _=o[v],T=_[0],M=_[1];T!==Number.MAX_SAFE_INTEGER&&M?(x&&u.getAttribute("morphTarget"+v)!==x[T]&&u.setAttribute("morphTarget"+v,x[T]),m&&u.getAttribute("morphNormal"+v)!==m[T]&&u.setAttribute("morphNormal"+v,m[T]),n[v]=M,p+=M):(x&&u.hasAttribute("morphTarget"+v)===!0&&u.deleteAttribute("morphTarget"+v),m&&u.hasAttribute("morphNormal"+v)===!0&&u.deleteAttribute("morphNormal"+v),n[v]=0)}const y=u.morphTargetsRelative?1:1-p;d.getUniforms().setValue(s,"morphTargetBaseInfluence",y),d.getUniforms().setValue(s,"morphTargetInfluences",n)}}return{update:l}}function hg(s,e,t,i){let n=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,d=e.get(l,u);if(n.get(d)!==c&&(e.update(d),n.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),n.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),n.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;n.get(h)!==c&&(h.update(),n.set(h,c))}return d}function a(){n=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class qu extends Ut{constructor(e,t,i,n,r,a,o,l,c,u){if(u=u!==void 0?u:on,u!==on&&u!==Jn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===on&&(i=Zt),i===void 0&&u===Jn&&(i=an),super(null,n,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Ve,this.minFilter=l!==void 0?l:Ve,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ku=new Ut,ju=new qu(1,1);ju.compareFunction=Iu;const Yu=new Uu,Zu=new Fu,Ju=new Wu,uc=[],hc=[],dc=new Float32Array(16),fc=new Float32Array(9),pc=new Float32Array(4);function is(s,e,t){const i=s[0];if(i<=0||i>0)return s;const n=e*t;let r=uc[n];if(r===void 0&&(r=new Float32Array(n),uc[n]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function xt(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function yt(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function ia(s,e){let t=hc[e];t===void 0&&(t=new Int32Array(e),hc[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function dg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function fg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;s.uniform2fv(this.addr,e),yt(t,e)}}function pg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xt(t,e))return;s.uniform3fv(this.addr,e),yt(t,e)}}function mg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;s.uniform4fv(this.addr,e),yt(t,e)}}function gg(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,i))return;pc.set(i),s.uniformMatrix2fv(this.addr,!1,pc),yt(t,i)}}function vg(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,i))return;fc.set(i),s.uniformMatrix3fv(this.addr,!1,fc),yt(t,i)}}function xg(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,i))return;dc.set(i),s.uniformMatrix4fv(this.addr,!1,dc),yt(t,i)}}function yg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function _g(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;s.uniform2iv(this.addr,e),yt(t,e)}}function bg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;s.uniform3iv(this.addr,e),yt(t,e)}}function Sg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;s.uniform4iv(this.addr,e),yt(t,e)}}function Mg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function wg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;s.uniform2uiv(this.addr,e),yt(t,e)}}function Tg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;s.uniform3uiv(this.addr,e),yt(t,e)}}function Eg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;s.uniform4uiv(this.addr,e),yt(t,e)}}function Ag(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);const r=this.type===s.SAMPLER_2D_SHADOW?ju:Ku;t.setTexture2D(e||r,n)}function Rg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||Zu,n)}function Pg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||Ju,n)}function Cg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||Yu,n)}function Ig(s){switch(s){case 5126:return dg;case 35664:return fg;case 35665:return pg;case 35666:return mg;case 35674:return gg;case 35675:return vg;case 35676:return xg;case 5124:case 35670:return yg;case 35667:case 35671:return _g;case 35668:case 35672:return bg;case 35669:case 35673:return Sg;case 5125:return Mg;case 36294:return wg;case 36295:return Tg;case 36296:return Eg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ag;case 35679:case 36299:case 36307:return Rg;case 35680:case 36300:case 36308:case 36293:return Pg;case 36289:case 36303:case 36311:case 36292:return Cg}}function Lg(s,e){s.uniform1fv(this.addr,e)}function Dg(s,e){const t=is(e,this.size,2);s.uniform2fv(this.addr,t)}function Ng(s,e){const t=is(e,this.size,3);s.uniform3fv(this.addr,t)}function Ug(s,e){const t=is(e,this.size,4);s.uniform4fv(this.addr,t)}function Fg(s,e){const t=is(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Bg(s,e){const t=is(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Og(s,e){const t=is(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function kg(s,e){s.uniform1iv(this.addr,e)}function zg(s,e){s.uniform2iv(this.addr,e)}function Gg(s,e){s.uniform3iv(this.addr,e)}function Vg(s,e){s.uniform4iv(this.addr,e)}function Hg(s,e){s.uniform1uiv(this.addr,e)}function Wg(s,e){s.uniform2uiv(this.addr,e)}function Xg(s,e){s.uniform3uiv(this.addr,e)}function qg(s,e){s.uniform4uiv(this.addr,e)}function Kg(s,e,t){const i=this.cache,n=e.length,r=ia(t,n);xt(i,r)||(s.uniform1iv(this.addr,r),yt(i,r));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||Ku,r[a])}function jg(s,e,t){const i=this.cache,n=e.length,r=ia(t,n);xt(i,r)||(s.uniform1iv(this.addr,r),yt(i,r));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||Zu,r[a])}function Yg(s,e,t){const i=this.cache,n=e.length,r=ia(t,n);xt(i,r)||(s.uniform1iv(this.addr,r),yt(i,r));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||Ju,r[a])}function Zg(s,e,t){const i=this.cache,n=e.length,r=ia(t,n);xt(i,r)||(s.uniform1iv(this.addr,r),yt(i,r));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||Yu,r[a])}function Jg(s){switch(s){case 5126:return Lg;case 35664:return Dg;case 35665:return Ng;case 35666:return Ug;case 35674:return Fg;case 35675:return Bg;case 35676:return Og;case 5124:case 35670:return kg;case 35667:case 35671:return zg;case 35668:case 35672:return Gg;case 35669:case 35673:return Vg;case 5125:return Hg;case 36294:return Wg;case 36295:return Xg;case 36296:return qg;case 35678:case 36198:case 36298:case 36306:case 35682:return Kg;case 35679:case 36299:case 36307:return jg;case 35680:case 36300:case 36308:case 36293:return Yg;case 36289:case 36303:case 36311:case 36292:return Zg}}class Qg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ig(t.type)}}class $g{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Jg(t.type)}}class ev{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(e,t[o.id],i)}}}const za=/(\w+)(\])?(\[|\.)?/g;function mc(s,e){s.seq.push(e),s.map[e.id]=e}function tv(s,e,t){const i=s.name,n=i.length;for(za.lastIndex=0;;){const r=za.exec(i),a=za.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){mc(t,c===void 0?new Qg(o,s,e):new $g(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new ev(o),mc(t,d)),t=d}}}class Ur{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){const r=e.getActiveUniform(t,n),a=e.getUniformLocation(t,r.name);tv(r,a,this)}}setValue(e,t,i,n){const r=this.map[t];r!==void 0&&r.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,r=e.length;n!==r;++n){const a=e[n];a.id in t&&i.push(a)}return i}}function gc(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const iv=37297;let nv=0;function sv(s,e){const t=s.split(`
`),i=[],n=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function rv(s){const e=Qe.getPrimaries(Qe.workingColorSpace),t=Qe.getPrimaries(s);let i;switch(e===t?i="":e===Hr&&t===Vr?i="LinearDisplayP3ToLinearSRGB":e===Vr&&t===Hr&&(i="LinearSRGBToLinearDisplayP3"),s){case di:case $r:return[i,"LinearTransferOETF"];case Et:case Fo:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[i,"LinearTransferOETF"]}}function vc(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),n=s.getShaderInfoLog(e).trim();if(i&&n==="")return"";const r=/ERROR: 0:(\d+)/.exec(n);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+n+`

`+sv(s.getShaderSource(e),a)}else return n}function av(s,e){const t=rv(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function ov(s,e){let t;switch(e){case id:t="Linear";break;case nd:t="Reinhard";break;case sd:t="OptimizedCineon";break;case rd:t="ACESFilmic";break;case od:t="AgX";break;case ad:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function lv(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Wn).join(`
`)}function cv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Wn).join(`
`)}function uv(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function hv(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(e,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Wn(s){return s!==""}function xc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function yc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const dv=/^[ \t]*#include +<([\w\d./]+)>/gm;function _o(s){return s.replace(dv,pv)}const fv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function pv(s,e){let t=Ue[e];if(t===void 0){const i=fv.get(e);if(i!==void 0)t=Ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return _o(t)}const mv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _c(s){return s.replace(mv,gv)}function gv(s,e,t,i){let n="";for(let r=parseInt(e);r<parseInt(t);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function bc(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function vv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===_u?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Ch?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Ci&&(e="SHADOWMAP_TYPE_VSM"),e}function xv(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Yn:case Zn:e="ENVMAP_TYPE_CUBE";break;case Zr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function yv(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Zn:e="ENVMAP_MODE_REFRACTION";break}return e}function _v(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case bu:e="ENVMAP_BLENDING_MULTIPLY";break;case ed:e="ENVMAP_BLENDING_MIX";break;case td:e="ENVMAP_BLENDING_ADD";break}return e}function bv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Sv(s,e,t,i){const n=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=vv(t),c=xv(t),u=yv(t),d=_v(t),h=bv(t),f=t.isWebGL2?"":lv(t),g=cv(t),x=uv(r),m=n.createProgram();let p,y,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Wn).join(`
`),p.length>0&&(p+=`
`),y=[f,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Wn).join(`
`),y.length>0&&(y+=`
`)):(p=[bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Wn).join(`
`),y=[f,bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qi?"#define TONE_MAPPING":"",t.toneMapping!==qi?Ue.tonemapping_pars_fragment:"",t.toneMapping!==qi?ov("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,av("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Wn).join(`
`)),a=_o(a),a=xc(a,t),a=yc(a,t),o=_o(o),o=xc(o,t),o=yc(o,t),a=_c(a),o=_c(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,y=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Ct?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ct?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const _=v+p+a,T=v+y+o,M=gc(n,n.VERTEX_SHADER,_),w=gc(n,n.FRAGMENT_SHADER,T);n.attachShader(m,M),n.attachShader(m,w),t.index0AttributeName!==void 0?n.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(m,0,"position"),n.linkProgram(m);function R(D){if(s.debug.checkShaderErrors){const F=n.getProgramInfoLog(m).trim(),I=n.getShaderInfoLog(M).trim(),U=n.getShaderInfoLog(w).trim();let B=!0,K=!0;if(n.getProgramParameter(m,n.LINK_STATUS)===!1)if(B=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,m,M,w);else{const q=vc(n,M,"vertex"),H=vc(n,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(m,n.VALIDATE_STATUS)+`

Program Info Log: `+F+`
`+q+`
`+H)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(I===""||U==="")&&(K=!1);K&&(D.diagnostics={runnable:B,programLog:F,vertexShader:{log:I,prefix:p},fragmentShader:{log:U,prefix:y}})}n.deleteShader(M),n.deleteShader(w),S=new Ur(n,m),b=hv(n,m)}let S;this.getUniforms=function(){return S===void 0&&R(this),S};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=n.getProgramParameter(m,iv)),L},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=nv++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=M,this.fragmentShader=w,this}let Mv=0;class wv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Tv(e),t.set(e,i)),i}}class Tv{constructor(e){this.id=Mv++,this.code=e,this.usedTimes=0}}function Ev(s,e,t,i,n,r,a){const o=new Bu,l=new wv,c=[],u=n.isWebGL2,d=n.logarithmicDepthBuffer,h=n.vertexTextures;let f=n.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return S===0?"uv":`uv${S}`}function m(S,b,L,D,F){const I=D.fog,U=F.geometry,B=S.isMeshStandardMaterial?D.environment:null,K=(S.isMeshStandardMaterial?t:e).get(S.envMap||B),q=K&&K.mapping===Zr?K.image.height:null,H=g[S.type];S.precision!==null&&(f=n.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const j=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Y=j!==void 0?j.length:0;let ae=0;U.morphAttributes.position!==void 0&&(ae=1),U.morphAttributes.normal!==void 0&&(ae=2),U.morphAttributes.color!==void 0&&(ae=3);let X,Z,oe,xe;if(H){const Bt=gi[H];X=Bt.vertexShader,Z=Bt.fragmentShader}else X=S.vertexShader,Z=S.fragmentShader,l.update(S),oe=l.getVertexShaderID(S),xe=l.getFragmentShaderID(S);const ve=s.getRenderTarget(),Ce=F.isInstancedMesh===!0,De=F.isBatchedMesh===!0,we=!!S.map,He=!!S.matcap,k=!!K,Ft=!!S.aoMap,_e=!!S.lightMap,Re=!!S.bumpMap,pe=!!S.normalMap,at=!!S.displacementMap,Fe=!!S.emissiveMap,C=!!S.metalnessMap,E=!!S.roughnessMap,G=S.anisotropy>0,$=S.clearcoat>0,Q=S.iridescence>0,ee=S.sheen>0,me=S.transmission>0,re=G&&!!S.anisotropyMap,ue=$&&!!S.clearcoatMap,Me=$&&!!S.clearcoatNormalMap,Be=$&&!!S.clearcoatRoughnessMap,J=Q&&!!S.iridescenceMap,Ze=Q&&!!S.iridescenceThicknessMap,Ge=ee&&!!S.sheenColorMap,Ae=ee&&!!S.sheenRoughnessMap,ye=!!S.specularMap,he=!!S.specularColorMap,Ne=!!S.specularIntensityMap,qe=me&&!!S.transmissionMap,lt=me&&!!S.thicknessMap,ke=!!S.gradientMap,te=!!S.alphaMap,N=S.alphaTest>0,ne=!!S.alphaHash,se=!!S.extensions,Te=!!U.attributes.uv1,be=!!U.attributes.uv2,$e=!!U.attributes.uv3;let et=qi;return S.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(et=s.toneMapping),{isWebGL2:u,shaderID:H,shaderType:S.type,shaderName:S.name,vertexShader:X,fragmentShader:Z,defines:S.defines,customVertexShaderID:oe,customFragmentShaderID:xe,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:De,instancing:Ce,instancingColor:Ce&&F.instanceColor!==null,supportsVertexTextures:h,outputColorSpace:ve===null?s.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:di,map:we,matcap:He,envMap:k,envMapMode:k&&K.mapping,envMapCubeUVHeight:q,aoMap:Ft,lightMap:_e,bumpMap:Re,normalMap:pe,displacementMap:h&&at,emissiveMap:Fe,normalMapObjectSpace:pe&&S.normalMapType===Sd,normalMapTangentSpace:pe&&S.normalMapType===Cu,metalnessMap:C,roughnessMap:E,anisotropy:G,anisotropyMap:re,clearcoat:$,clearcoatMap:ue,clearcoatNormalMap:Me,clearcoatRoughnessMap:Be,iridescence:Q,iridescenceMap:J,iridescenceThicknessMap:Ze,sheen:ee,sheenColorMap:Ge,sheenRoughnessMap:Ae,specularMap:ye,specularColorMap:he,specularIntensityMap:Ne,transmission:me,transmissionMap:qe,thicknessMap:lt,gradientMap:ke,opaque:S.transparent===!1&&S.blending===qn,alphaMap:te,alphaTest:N,alphaHash:ne,combine:S.combine,mapUv:we&&x(S.map.channel),aoMapUv:Ft&&x(S.aoMap.channel),lightMapUv:_e&&x(S.lightMap.channel),bumpMapUv:Re&&x(S.bumpMap.channel),normalMapUv:pe&&x(S.normalMap.channel),displacementMapUv:at&&x(S.displacementMap.channel),emissiveMapUv:Fe&&x(S.emissiveMap.channel),metalnessMapUv:C&&x(S.metalnessMap.channel),roughnessMapUv:E&&x(S.roughnessMap.channel),anisotropyMapUv:re&&x(S.anisotropyMap.channel),clearcoatMapUv:ue&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:Me&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Be&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ze&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ge&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&x(S.sheenRoughnessMap.channel),specularMapUv:ye&&x(S.specularMap.channel),specularColorMapUv:he&&x(S.specularColorMap.channel),specularIntensityMapUv:Ne&&x(S.specularIntensityMap.channel),transmissionMapUv:qe&&x(S.transmissionMap.channel),thicknessMapUv:lt&&x(S.thicknessMap.channel),alphaMapUv:te&&x(S.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(pe||G),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,vertexUv1s:Te,vertexUv2s:be,vertexUv3s:$e,pointsUvs:F.isPoints===!0&&!!U.attributes.uv&&(we||te),fog:!!I,useFog:S.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:F.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Y,morphTextureStride:ae,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:et,useLegacyLights:s._useLegacyLights,decodeVideoTexture:we&&S.map.isVideoTexture===!0&&Qe.getTransfer(S.map.colorSpace)===it,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===vi,flipSided:S.side===Vt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:se&&S.extensions.derivatives===!0,extensionFragDepth:se&&S.extensions.fragDepth===!0,extensionDrawBuffers:se&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:se&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:se&&S.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function p(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)b.push(L),b.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(y(b,S),v(b,S),b.push(s.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function y(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){o.disableAll(),b.isWebGL2&&o.enable(0),b.supportsVertexTextures&&o.enable(1),b.instancing&&o.enable(2),b.instancingColor&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.skinning&&o.enable(4),b.morphTargets&&o.enable(5),b.morphNormals&&o.enable(6),b.morphColors&&o.enable(7),b.premultipliedAlpha&&o.enable(8),b.shadowMapEnabled&&o.enable(9),b.useLegacyLights&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),S.push(o.mask)}function _(S){const b=g[S.type];let L;if(b){const D=gi[b];L=lf.clone(D.uniforms)}else L=S.uniforms;return L}function T(S,b){let L;for(let D=0,F=c.length;D<F;D++){const I=c[D];if(I.cacheKey===b){L=I,++L.usedTimes;break}}return L===void 0&&(L=new Sv(s,b,S,r),c.push(L)),L}function M(S){if(--S.usedTimes===0){const b=c.indexOf(S);c[b]=c[c.length-1],c.pop(),S.destroy()}}function w(S){l.remove(S)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:T,releaseProgram:M,releaseShaderCache:w,programs:c,dispose:R}}function Av(){let s=new WeakMap;function e(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function t(r){s.delete(r)}function i(r,a,o){s.get(r)[a]=o}function n(){s=new WeakMap}return{get:e,remove:t,update:i,dispose:n}}function Rv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Sc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Mc(){const s=[];let e=0;const t=[],i=[],n=[];function r(){e=0,t.length=0,i.length=0,n.length=0}function a(d,h,f,g,x,m){let p=s[e];return p===void 0?(p={id:d.id,object:d,geometry:h,material:f,groupOrder:g,renderOrder:d.renderOrder,z:x,group:m},s[e]=p):(p.id=d.id,p.object=d,p.geometry=h,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=x,p.group=m),e++,p}function o(d,h,f,g,x,m){const p=a(d,h,f,g,x,m);f.transmission>0?i.push(p):f.transparent===!0?n.push(p):t.push(p)}function l(d,h,f,g,x,m){const p=a(d,h,f,g,x,m);f.transmission>0?i.unshift(p):f.transparent===!0?n.unshift(p):t.unshift(p)}function c(d,h){t.length>1&&t.sort(d||Rv),i.length>1&&i.sort(h||Sc),n.length>1&&n.sort(h||Sc)}function u(){for(let d=e,h=s.length;d<h;d++){const f=s[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:n,init:r,push:o,unshift:l,finish:u,sort:c}}function Pv(){let s=new WeakMap;function e(i,n){const r=s.get(i);let a;return r===void 0?(a=new Mc,s.set(i,[a])):n>=r.length?(a=new Mc,r.push(a)):a=r[n],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Cv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new de};break;case"SpotLight":t={position:new P,direction:new P,color:new de,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new de,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new de,groundColor:new de};break;case"RectAreaLight":t={color:new de,position:new P,halfWidth:new P,halfHeight:new P};break}return s[e.id]=t,t}}}function Iv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Lv=0;function Dv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Nv(s,e){const t=new Cv,i=Iv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)n.probe.push(new P);const r=new P,a=new fe,o=new fe;function l(u,d){let h=0,f=0,g=0;for(let D=0;D<9;D++)n.probe[D].set(0,0,0);let x=0,m=0,p=0,y=0,v=0,_=0,T=0,M=0,w=0,R=0,S=0;u.sort(Dv);const b=d===!0?Math.PI:1;for(let D=0,F=u.length;D<F;D++){const I=u[D],U=I.color,B=I.intensity,K=I.distance,q=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=U.r*B*b,f+=U.g*B*b,g+=U.b*B*b;else if(I.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(I.sh.coefficients[H],B);S++}else if(I.isDirectionalLight){const H=t.get(I);if(H.color.copy(I.color).multiplyScalar(I.intensity*b),I.castShadow){const j=I.shadow,Y=i.get(I);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,n.directionalShadow[x]=Y,n.directionalShadowMap[x]=q,n.directionalShadowMatrix[x]=I.shadow.matrix,_++}n.directional[x]=H,x++}else if(I.isSpotLight){const H=t.get(I);H.position.setFromMatrixPosition(I.matrixWorld),H.color.copy(U).multiplyScalar(B*b),H.distance=K,H.coneCos=Math.cos(I.angle),H.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),H.decay=I.decay,n.spot[p]=H;const j=I.shadow;if(I.map&&(n.spotLightMap[w]=I.map,w++,j.updateMatrices(I),I.castShadow&&R++),n.spotLightMatrix[p]=j.matrix,I.castShadow){const Y=i.get(I);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,n.spotShadow[p]=Y,n.spotShadowMap[p]=q,M++}p++}else if(I.isRectAreaLight){const H=t.get(I);H.color.copy(U).multiplyScalar(B),H.halfWidth.set(I.width*.5,0,0),H.halfHeight.set(0,I.height*.5,0),n.rectArea[y]=H,y++}else if(I.isPointLight){const H=t.get(I);if(H.color.copy(I.color).multiplyScalar(I.intensity*b),H.distance=I.distance,H.decay=I.decay,I.castShadow){const j=I.shadow,Y=i.get(I);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,Y.shadowCameraNear=j.camera.near,Y.shadowCameraFar=j.camera.far,n.pointShadow[m]=Y,n.pointShadowMap[m]=q,n.pointShadowMatrix[m]=I.shadow.matrix,T++}n.point[m]=H,m++}else if(I.isHemisphereLight){const H=t.get(I);H.skyColor.copy(I.color).multiplyScalar(B*b),H.groundColor.copy(I.groundColor).multiplyScalar(B*b),n.hemi[v]=H,v++}}y>0&&(e.isWebGL2?s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ie.LTC_FLOAT_1,n.rectAreaLTC2=ie.LTC_FLOAT_2):(n.rectAreaLTC1=ie.LTC_HALF_1,n.rectAreaLTC2=ie.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ie.LTC_FLOAT_1,n.rectAreaLTC2=ie.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(n.rectAreaLTC1=ie.LTC_HALF_1,n.rectAreaLTC2=ie.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=g;const L=n.hash;(L.directionalLength!==x||L.pointLength!==m||L.spotLength!==p||L.rectAreaLength!==y||L.hemiLength!==v||L.numDirectionalShadows!==_||L.numPointShadows!==T||L.numSpotShadows!==M||L.numSpotMaps!==w||L.numLightProbes!==S)&&(n.directional.length=x,n.spot.length=p,n.rectArea.length=y,n.point.length=m,n.hemi.length=v,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=M+w-R,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=S,L.directionalLength=x,L.pointLength=m,L.spotLength=p,L.rectAreaLength=y,L.hemiLength=v,L.numDirectionalShadows=_,L.numPointShadows=T,L.numSpotShadows=M,L.numSpotMaps=w,L.numLightProbes=S,n.version=Lv++)}function c(u,d){let h=0,f=0,g=0,x=0,m=0;const p=d.matrixWorldInverse;for(let y=0,v=u.length;y<v;y++){const _=u[y];if(_.isDirectionalLight){const T=n.directional[h];T.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),h++}else if(_.isSpotLight){const T=n.spot[g];T.position.setFromMatrixPosition(_.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),g++}else if(_.isRectAreaLight){const T=n.rectArea[x];T.position.setFromMatrixPosition(_.matrixWorld),T.position.applyMatrix4(p),o.identity(),a.copy(_.matrixWorld),a.premultiply(p),o.extractRotation(a),T.halfWidth.set(_.width*.5,0,0),T.halfHeight.set(0,_.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),x++}else if(_.isPointLight){const T=n.point[f];T.position.setFromMatrixPosition(_.matrixWorld),T.position.applyMatrix4(p),f++}else if(_.isHemisphereLight){const T=n.hemi[m];T.direction.setFromMatrixPosition(_.matrixWorld),T.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:n}}function wc(s,e){const t=new Nv(s,e),i=[],n=[];function r(){i.length=0,n.length=0}function a(d){i.push(d)}function o(d){n.push(d)}function l(d){t.setup(i,d)}function c(d){t.setupView(i,d)}return{init:r,state:{lightsArray:i,shadowsArray:n,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Uv(s,e){let t=new WeakMap;function i(r,a=0){const o=t.get(r);let l;return o===void 0?(l=new wc(s,e),t.set(r,[l])):a>=o.length?(l=new wc(s,e),o.push(l)):l=o[a],l}function n(){t=new WeakMap}return{get:i,dispose:n}}class Fv extends Yi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_d,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Bv extends Yi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Ov=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kv=`uniform sampler2D shadow_pass;
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
}`;function zv(s,e,t){let i=new Oo;const n=new ce,r=new ce,a=new We,o=new Fv({depthPacking:bd}),l=new Bv,c={},u=t.maxTextureSize,d={[si]:Vt,[Vt]:si,[vi]:vi},h=new dt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ce},radius:{value:4}},vertexShader:Ov,fragmentShader:kv}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new Tt;g.setAttribute("position",new st(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new pt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_u;let p=this.type;this.render=function(M,w,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;const S=s.getRenderTarget(),b=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),D=s.state;D.setBlending(Xi),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const F=p!==Ci&&this.type===Ci,I=p===Ci&&this.type!==Ci;for(let U=0,B=M.length;U<B;U++){const K=M[U],q=K.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;n.copy(q.mapSize);const H=q.getFrameExtents();if(n.multiply(H),r.copy(q.mapSize),(n.x>u||n.y>u)&&(n.x>u&&(r.x=Math.floor(u/H.x),n.x=r.x*H.x,q.mapSize.x=r.x),n.y>u&&(r.y=Math.floor(u/H.y),n.y=r.y*H.y,q.mapSize.y=r.y)),q.map===null||F===!0||I===!0){const Y=this.type!==Ci?{minFilter:Ve,magFilter:Ve}:{};q.map!==null&&q.map.dispose(),q.map=new It(n.x,n.y,Y),q.map.texture.name=K.name+".shadowMap",q.camera.updateProjectionMatrix()}s.setRenderTarget(q.map),s.clear();const j=q.getViewportCount();for(let Y=0;Y<j;Y++){const ae=q.getViewport(Y);a.set(r.x*ae.x,r.y*ae.y,r.x*ae.z,r.y*ae.w),D.viewport(a),q.updateMatrices(K,Y),i=q.getFrustum(),_(w,R,q.camera,K,this.type)}q.isPointLightShadow!==!0&&this.type===Ci&&y(q,R),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(S,b,L)};function y(M,w){const R=e.update(x);h.defines.VSM_SAMPLES!==M.blurSamples&&(h.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new It(n.x,n.y)),h.uniforms.shadow_pass.value=M.map.texture,h.uniforms.resolution.value=M.mapSize,h.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(w,null,R,h,x,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(w,null,R,f,x,null)}function v(M,w,R,S){let b=null;const L=R.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(L!==void 0)b=L;else if(b=R.isPointLight===!0?l:o,s.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const D=b.uuid,F=w.uuid;let I=c[D];I===void 0&&(I={},c[D]=I);let U=I[F];U===void 0&&(U=b.clone(),I[F]=U,w.addEventListener("dispose",T)),b=U}if(b.visible=w.visible,b.wireframe=w.wireframe,S===Ci?b.side=w.shadowSide!==null?w.shadowSide:w.side:b.side=w.shadowSide!==null?w.shadowSide:d[w.side],b.alphaMap=w.alphaMap,b.alphaTest=w.alphaTest,b.map=w.map,b.clipShadows=w.clipShadows,b.clippingPlanes=w.clippingPlanes,b.clipIntersection=w.clipIntersection,b.displacementMap=w.displacementMap,b.displacementScale=w.displacementScale,b.displacementBias=w.displacementBias,b.wireframeLinewidth=w.wireframeLinewidth,b.linewidth=w.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const D=s.properties.get(b);D.light=R}return b}function _(M,w,R,S,b){if(M.visible===!1)return;if(M.layers.test(w.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&b===Ci)&&(!M.frustumCulled||i.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,M.matrixWorld);const F=e.update(M),I=M.material;if(Array.isArray(I)){const U=F.groups;for(let B=0,K=U.length;B<K;B++){const q=U[B],H=I[q.materialIndex];if(H&&H.visible){const j=v(M,H,S,b);M.onBeforeShadow(s,M,w,R,F,j,q),s.renderBufferDirect(R,null,F,j,M,q),M.onAfterShadow(s,M,w,R,F,j,q)}}}else if(I.visible){const U=v(M,I,S,b);M.onBeforeShadow(s,M,w,R,F,U,null),s.renderBufferDirect(R,null,F,U,M,null),M.onAfterShadow(s,M,w,R,F,U,null)}}const D=M.children;for(let F=0,I=D.length;F<I;F++)_(D[F],w,R,S,b)}function T(M){M.target.removeEventListener("dispose",T);for(const R in c){const S=c[R],b=M.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}function Gv(s,e,t){const i=t.isWebGL2;function n(){let N=!1;const ne=new We;let se=null;const Te=new We(0,0,0,0);return{setMask:function(be){se!==be&&!N&&(s.colorMask(be,be,be,be),se=be)},setLocked:function(be){N=be},setClear:function(be,$e,et,_t,Bt){Bt===!0&&(be*=_t,$e*=_t,et*=_t),ne.set(be,$e,et,_t),Te.equals(ne)===!1&&(s.clearColor(be,$e,et,_t),Te.copy(ne))},reset:function(){N=!1,se=null,Te.set(-1,0,0,0)}}}function r(){let N=!1,ne=null,se=null,Te=null;return{setTest:function(be){be?De(s.DEPTH_TEST):we(s.DEPTH_TEST)},setMask:function(be){ne!==be&&!N&&(s.depthMask(be),ne=be)},setFunc:function(be){if(se!==be){switch(be){case Kh:s.depthFunc(s.NEVER);break;case jh:s.depthFunc(s.ALWAYS);break;case Yh:s.depthFunc(s.LESS);break;case Br:s.depthFunc(s.LEQUAL);break;case Zh:s.depthFunc(s.EQUAL);break;case Jh:s.depthFunc(s.GEQUAL);break;case Qh:s.depthFunc(s.GREATER);break;case $h:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}se=be}},setLocked:function(be){N=be},setClear:function(be){Te!==be&&(s.clearDepth(be),Te=be)},reset:function(){N=!1,ne=null,se=null,Te=null}}}function a(){let N=!1,ne=null,se=null,Te=null,be=null,$e=null,et=null,_t=null,Bt=null;return{setTest:function(tt){N||(tt?De(s.STENCIL_TEST):we(s.STENCIL_TEST))},setMask:function(tt){ne!==tt&&!N&&(s.stencilMask(tt),ne=tt)},setFunc:function(tt,Ot,pi){(se!==tt||Te!==Ot||be!==pi)&&(s.stencilFunc(tt,Ot,pi),se=tt,Te=Ot,be=pi)},setOp:function(tt,Ot,pi){($e!==tt||et!==Ot||_t!==pi)&&(s.stencilOp(tt,Ot,pi),$e=tt,et=Ot,_t=pi)},setLocked:function(tt){N=tt},setClear:function(tt){Bt!==tt&&(s.clearStencil(tt),Bt=tt)},reset:function(){N=!1,ne=null,se=null,Te=null,be=null,$e=null,et=null,_t=null,Bt=null}}}const o=new n,l=new r,c=new a,u=new WeakMap,d=new WeakMap;let h={},f={},g=new WeakMap,x=[],m=null,p=!1,y=null,v=null,_=null,T=null,M=null,w=null,R=null,S=new de(0,0,0),b=0,L=!1,D=null,F=null,I=null,U=null,B=null;const K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,H=0;const j=s.getParameter(s.VERSION);j.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(j)[1]),q=H>=1):j.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),q=H>=2);let Y=null,ae={};const X=s.getParameter(s.SCISSOR_BOX),Z=s.getParameter(s.VIEWPORT),oe=new We().fromArray(X),xe=new We().fromArray(Z);function ve(N,ne,se,Te){const be=new Uint8Array(4),$e=s.createTexture();s.bindTexture(N,$e),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let et=0;et<se;et++)i&&(N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY)?s.texImage3D(ne,0,s.RGBA,1,1,Te,0,s.RGBA,s.UNSIGNED_BYTE,be):s.texImage2D(ne+et,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,be);return $e}const Ce={};Ce[s.TEXTURE_2D]=ve(s.TEXTURE_2D,s.TEXTURE_2D,1),Ce[s.TEXTURE_CUBE_MAP]=ve(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ce[s.TEXTURE_2D_ARRAY]=ve(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Ce[s.TEXTURE_3D]=ve(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),De(s.DEPTH_TEST),l.setFunc(Br),Fe(!1),C(sl),De(s.CULL_FACE),pe(Xi);function De(N){h[N]!==!0&&(s.enable(N),h[N]=!0)}function we(N){h[N]!==!1&&(s.disable(N),h[N]=!1)}function He(N,ne){return f[N]!==ne?(s.bindFramebuffer(N,ne),f[N]=ne,i&&(N===s.DRAW_FRAMEBUFFER&&(f[s.FRAMEBUFFER]=ne),N===s.FRAMEBUFFER&&(f[s.DRAW_FRAMEBUFFER]=ne)),!0):!1}function k(N,ne){let se=x,Te=!1;if(N)if(se=g.get(ne),se===void 0&&(se=[],g.set(ne,se)),N.isWebGLMultipleRenderTargets){const be=N.texture;if(se.length!==be.length||se[0]!==s.COLOR_ATTACHMENT0){for(let $e=0,et=be.length;$e<et;$e++)se[$e]=s.COLOR_ATTACHMENT0+$e;se.length=be.length,Te=!0}}else se[0]!==s.COLOR_ATTACHMENT0&&(se[0]=s.COLOR_ATTACHMENT0,Te=!0);else se[0]!==s.BACK&&(se[0]=s.BACK,Te=!0);Te&&(t.isWebGL2?s.drawBuffers(se):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(se))}function Ft(N){return m!==N?(s.useProgram(N),m=N,!0):!1}const _e={[sn]:s.FUNC_ADD,[Lh]:s.FUNC_SUBTRACT,[Dh]:s.FUNC_REVERSE_SUBTRACT};if(i)_e[ll]=s.MIN,_e[cl]=s.MAX;else{const N=e.get("EXT_blend_minmax");N!==null&&(_e[ll]=N.MIN_EXT,_e[cl]=N.MAX_EXT)}const Re={[Nh]:s.ZERO,[Uh]:s.ONE,[Fh]:s.SRC_COLOR,[co]:s.SRC_ALPHA,[Vh]:s.SRC_ALPHA_SATURATE,[zh]:s.DST_COLOR,[Oh]:s.DST_ALPHA,[Bh]:s.ONE_MINUS_SRC_COLOR,[uo]:s.ONE_MINUS_SRC_ALPHA,[Gh]:s.ONE_MINUS_DST_COLOR,[kh]:s.ONE_MINUS_DST_ALPHA,[Hh]:s.CONSTANT_COLOR,[Wh]:s.ONE_MINUS_CONSTANT_COLOR,[Xh]:s.CONSTANT_ALPHA,[qh]:s.ONE_MINUS_CONSTANT_ALPHA};function pe(N,ne,se,Te,be,$e,et,_t,Bt,tt){if(N===Xi){p===!0&&(we(s.BLEND),p=!1);return}if(p===!1&&(De(s.BLEND),p=!0),N!==Ih){if(N!==y||tt!==L){if((v!==sn||M!==sn)&&(s.blendEquation(s.FUNC_ADD),v=sn,M=sn),tt)switch(N){case qn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case rl:s.blendFunc(s.ONE,s.ONE);break;case al:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ol:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case qn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case rl:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case al:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ol:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,T=null,w=null,R=null,S.set(0,0,0),b=0,y=N,L=tt}return}be=be||ne,$e=$e||se,et=et||Te,(ne!==v||be!==M)&&(s.blendEquationSeparate(_e[ne],_e[be]),v=ne,M=be),(se!==_||Te!==T||$e!==w||et!==R)&&(s.blendFuncSeparate(Re[se],Re[Te],Re[$e],Re[et]),_=se,T=Te,w=$e,R=et),(_t.equals(S)===!1||Bt!==b)&&(s.blendColor(_t.r,_t.g,_t.b,Bt),S.copy(_t),b=Bt),y=N,L=!1}function at(N,ne){N.side===vi?we(s.CULL_FACE):De(s.CULL_FACE);let se=N.side===Vt;ne&&(se=!se),Fe(se),N.blending===qn&&N.transparent===!1?pe(Xi):pe(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),l.setFunc(N.depthFunc),l.setTest(N.depthTest),l.setMask(N.depthWrite),o.setMask(N.colorWrite);const Te=N.stencilWrite;c.setTest(Te),Te&&(c.setMask(N.stencilWriteMask),c.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),c.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),G(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?De(s.SAMPLE_ALPHA_TO_COVERAGE):we(s.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(N){D!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),D=N)}function C(N){N!==Rh?(De(s.CULL_FACE),N!==F&&(N===sl?s.cullFace(s.BACK):N===Ph?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):we(s.CULL_FACE),F=N}function E(N){N!==I&&(q&&s.lineWidth(N),I=N)}function G(N,ne,se){N?(De(s.POLYGON_OFFSET_FILL),(U!==ne||B!==se)&&(s.polygonOffset(ne,se),U=ne,B=se)):we(s.POLYGON_OFFSET_FILL)}function $(N){N?De(s.SCISSOR_TEST):we(s.SCISSOR_TEST)}function Q(N){N===void 0&&(N=s.TEXTURE0+K-1),Y!==N&&(s.activeTexture(N),Y=N)}function ee(N,ne,se){se===void 0&&(Y===null?se=s.TEXTURE0+K-1:se=Y);let Te=ae[se];Te===void 0&&(Te={type:void 0,texture:void 0},ae[se]=Te),(Te.type!==N||Te.texture!==ne)&&(Y!==se&&(s.activeTexture(se),Y=se),s.bindTexture(N,ne||Ce[N]),Te.type=N,Te.texture=ne)}function me(){const N=ae[Y];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function re(){try{s.compressedTexImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ue(){try{s.compressedTexImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Me(){try{s.texSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Be(){try{s.texSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ze(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ge(){try{s.texStorage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ae(){try{s.texStorage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ye(){try{s.texImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function he(){try{s.texImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ne(N){oe.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),oe.copy(N))}function qe(N){xe.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),xe.copy(N))}function lt(N,ne){let se=d.get(ne);se===void 0&&(se=new WeakMap,d.set(ne,se));let Te=se.get(N);Te===void 0&&(Te=s.getUniformBlockIndex(ne,N.name),se.set(N,Te))}function ke(N,ne){const Te=d.get(ne).get(N);u.get(ne)!==Te&&(s.uniformBlockBinding(ne,Te,N.__bindingPointIndex),u.set(ne,Te))}function te(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),i===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},Y=null,ae={},f={},g=new WeakMap,x=[],m=null,p=!1,y=null,v=null,_=null,T=null,M=null,w=null,R=null,S=new de(0,0,0),b=0,L=!1,D=null,F=null,I=null,U=null,B=null,oe.set(0,0,s.canvas.width,s.canvas.height),xe.set(0,0,s.canvas.width,s.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:De,disable:we,bindFramebuffer:He,drawBuffers:k,useProgram:Ft,setBlending:pe,setMaterial:at,setFlipSided:Fe,setCullFace:C,setLineWidth:E,setPolygonOffset:G,setScissorTest:$,activeTexture:Q,bindTexture:ee,unbindTexture:me,compressedTexImage2D:re,compressedTexImage3D:ue,texImage2D:ye,texImage3D:he,updateUBOMapping:lt,uniformBlockBinding:ke,texStorage2D:Ge,texStorage3D:Ae,texSubImage2D:Me,texSubImage3D:Be,compressedTexSubImage2D:J,compressedTexSubImage3D:Ze,scissor:Ne,viewport:qe,reset:te}}function Vv(s,e,t,i,n,r,a){const o=n.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let d;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,E){return f?new OffscreenCanvas(C,E):Is("canvas")}function x(C,E,G,$){let Q=1;if((C.width>$||C.height>$)&&(Q=$/Math.max(C.width,C.height)),Q<1||E===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap){const ee=E?Xr:Math.floor,me=ee(Q*C.width),re=ee(Q*C.height);d===void 0&&(d=g(me,re));const ue=G?g(me,re):d;return ue.width=me,ue.height=re,ue.getContext("2d").drawImage(C,0,0,me,re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+C.width+"x"+C.height+") to ("+me+"x"+re+")."),ue}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+C.width+"x"+C.height+")."),C;return C}function m(C){return yo(C.width)&&yo(C.height)}function p(C){return o?!1:C.wrapS!==At||C.wrapT!==At||C.minFilter!==Ve&&C.minFilter!==Xe}function y(C,E){return C.generateMipmaps&&E&&C.minFilter!==Ve&&C.minFilter!==Xe}function v(C){s.generateMipmap(C)}function _(C,E,G,$,Q=!1){if(o===!1)return E;if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ee=E;if(E===s.RED&&(G===s.FLOAT&&(ee=s.R32F),G===s.HALF_FLOAT&&(ee=s.R16F),G===s.UNSIGNED_BYTE&&(ee=s.R8)),E===s.RED_INTEGER&&(G===s.UNSIGNED_BYTE&&(ee=s.R8UI),G===s.UNSIGNED_SHORT&&(ee=s.R16UI),G===s.UNSIGNED_INT&&(ee=s.R32UI),G===s.BYTE&&(ee=s.R8I),G===s.SHORT&&(ee=s.R16I),G===s.INT&&(ee=s.R32I)),E===s.RG&&(G===s.FLOAT&&(ee=s.RG32F),G===s.HALF_FLOAT&&(ee=s.RG16F),G===s.UNSIGNED_BYTE&&(ee=s.RG8)),E===s.RGBA){const me=Q?Gr:Qe.getTransfer($);G===s.FLOAT&&(ee=s.RGBA32F),G===s.HALF_FLOAT&&(ee=s.RGBA16F),G===s.UNSIGNED_BYTE&&(ee=me===it?s.SRGB8_ALPHA8:s.RGBA8),G===s.UNSIGNED_SHORT_4_4_4_4&&(ee=s.RGBA4),G===s.UNSIGNED_SHORT_5_5_5_1&&(ee=s.RGB5_A1)}return(ee===s.R16F||ee===s.R32F||ee===s.RG16F||ee===s.RG32F||ee===s.RGBA16F||ee===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function T(C,E,G){return y(C,G)===!0||C.isFramebufferTexture&&C.minFilter!==Ve&&C.minFilter!==Xe?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function M(C){return C===Ve||C===hl||C===da?s.NEAREST:s.LINEAR}function w(C){const E=C.target;E.removeEventListener("dispose",w),S(E),E.isVideoTexture&&u.delete(E)}function R(C){const E=C.target;E.removeEventListener("dispose",R),L(E)}function S(C){const E=i.get(C);if(E.__webglInit===void 0)return;const G=C.source,$=h.get(G);if($){const Q=$[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(C),Object.keys($).length===0&&h.delete(G)}i.remove(C)}function b(C){const E=i.get(C);s.deleteTexture(E.__webglTexture);const G=C.source,$=h.get(G);delete $[E.__cacheKey],a.memory.textures--}function L(C){const E=C.texture,G=i.get(C),$=i.get(E);if($.__webglTexture!==void 0&&(s.deleteTexture($.__webglTexture),a.memory.textures--),C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(G.__webglFramebuffer[Q]))for(let ee=0;ee<G.__webglFramebuffer[Q].length;ee++)s.deleteFramebuffer(G.__webglFramebuffer[Q][ee]);else s.deleteFramebuffer(G.__webglFramebuffer[Q]);G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer[Q])}else{if(Array.isArray(G.__webglFramebuffer))for(let Q=0;Q<G.__webglFramebuffer.length;Q++)s.deleteFramebuffer(G.__webglFramebuffer[Q]);else s.deleteFramebuffer(G.__webglFramebuffer);if(G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&s.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer)for(let Q=0;Q<G.__webglColorRenderbuffer.length;Q++)G.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(G.__webglColorRenderbuffer[Q]);G.__webglDepthRenderbuffer&&s.deleteRenderbuffer(G.__webglDepthRenderbuffer)}if(C.isWebGLMultipleRenderTargets)for(let Q=0,ee=E.length;Q<ee;Q++){const me=i.get(E[Q]);me.__webglTexture&&(s.deleteTexture(me.__webglTexture),a.memory.textures--),i.remove(E[Q])}i.remove(E),i.remove(C)}let D=0;function F(){D=0}function I(){const C=D;return C>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+n.maxTextures),D+=1,C}function U(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function B(C,E){const G=i.get(C);if(C.isVideoTexture&&at(C),C.isRenderTargetTexture===!1&&C.version>0&&G.__version!==C.version){const $=C.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{oe(G,C,E);return}}t.bindTexture(s.TEXTURE_2D,G.__webglTexture,s.TEXTURE0+E)}function K(C,E){const G=i.get(C);if(C.version>0&&G.__version!==C.version){oe(G,C,E);return}t.bindTexture(s.TEXTURE_2D_ARRAY,G.__webglTexture,s.TEXTURE0+E)}function q(C,E){const G=i.get(C);if(C.version>0&&G.__version!==C.version){oe(G,C,E);return}t.bindTexture(s.TEXTURE_3D,G.__webglTexture,s.TEXTURE0+E)}function H(C,E){const G=i.get(C);if(C.version>0&&G.__version!==C.version){xe(G,C,E);return}t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture,s.TEXTURE0+E)}const j={[po]:s.REPEAT,[At]:s.CLAMP_TO_EDGE,[mo]:s.MIRRORED_REPEAT},Y={[Ve]:s.NEAREST,[hl]:s.NEAREST_MIPMAP_NEAREST,[da]:s.NEAREST_MIPMAP_LINEAR,[Xe]:s.LINEAR,[cd]:s.LINEAR_MIPMAP_NEAREST,[Ps]:s.LINEAR_MIPMAP_LINEAR},ae={[Md]:s.NEVER,[Pd]:s.ALWAYS,[wd]:s.LESS,[Iu]:s.LEQUAL,[Td]:s.EQUAL,[Rd]:s.GEQUAL,[Ed]:s.GREATER,[Ad]:s.NOTEQUAL};function X(C,E,G){if(G?(s.texParameteri(C,s.TEXTURE_WRAP_S,j[E.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,j[E.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,j[E.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,Y[E.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,Y[E.minFilter])):(s.texParameteri(C,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(C,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(E.wrapS!==At||E.wrapT!==At)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(C,s.TEXTURE_MAG_FILTER,M(E.magFilter)),s.texParameteri(C,s.TEXTURE_MIN_FILTER,M(E.minFilter)),E.minFilter!==Ve&&E.minFilter!==Xe&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,ae[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const $=e.get("EXT_texture_filter_anisotropic");if(E.magFilter===Ve||E.minFilter!==da&&E.minFilter!==Ps||E.type===Mt&&e.has("OES_texture_float_linear")===!1||o===!1&&E.type===Pt&&e.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||i.get(E).__currentAnisotropy)&&(s.texParameterf(C,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,n.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy)}}function Z(C,E){let G=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",w));const $=E.source;let Q=h.get($);Q===void 0&&(Q={},h.set($,Q));const ee=U(E);if(ee!==C.__cacheKey){Q[ee]===void 0&&(Q[ee]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,G=!0),Q[ee].usedTimes++;const me=Q[C.__cacheKey];me!==void 0&&(Q[C.__cacheKey].usedTimes--,me.usedTimes===0&&b(E)),C.__cacheKey=ee,C.__webglTexture=Q[ee].texture}return G}function oe(C,E,G){let $=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&($=s.TEXTURE_3D);const Q=Z(C,E),ee=E.source;t.bindTexture($,C.__webglTexture,s.TEXTURE0+G);const me=i.get(ee);if(ee.version!==me.__version||Q===!0){t.activeTexture(s.TEXTURE0+G);const re=Qe.getPrimaries(Qe.workingColorSpace),ue=E.colorSpace===Wt?null:Qe.getPrimaries(E.colorSpace),Me=E.colorSpace===Wt||re===ue?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const Be=p(E)&&m(E.image)===!1;let J=x(E.image,Be,!1,n.maxTextureSize);J=Fe(E,J);const Ze=m(J)||o,Ge=r.convert(E.format,E.colorSpace);let Ae=r.convert(E.type),ye=_(E.internalFormat,Ge,Ae,E.colorSpace,E.isVideoTexture);X($,E,Ze);let he;const Ne=E.mipmaps,qe=o&&E.isVideoTexture!==!0&&ye!==Ru,lt=me.__version===void 0||Q===!0,ke=T(E,J,Ze);if(E.isDepthTexture)ye=s.DEPTH_COMPONENT,o?E.type===Mt?ye=s.DEPTH_COMPONENT32F:E.type===Zt?ye=s.DEPTH_COMPONENT24:E.type===an?ye=s.DEPTH24_STENCIL8:ye=s.DEPTH_COMPONENT16:E.type===Mt&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===on&&ye===s.DEPTH_COMPONENT&&E.type!==Jr&&E.type!==Zt&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Zt,Ae=r.convert(E.type)),E.format===Jn&&ye===s.DEPTH_COMPONENT&&(ye=s.DEPTH_STENCIL,E.type!==an&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=an,Ae=r.convert(E.type))),lt&&(qe?t.texStorage2D(s.TEXTURE_2D,1,ye,J.width,J.height):t.texImage2D(s.TEXTURE_2D,0,ye,J.width,J.height,0,Ge,Ae,null));else if(E.isDataTexture)if(Ne.length>0&&Ze){qe&&lt&&t.texStorage2D(s.TEXTURE_2D,ke,ye,Ne[0].width,Ne[0].height);for(let te=0,N=Ne.length;te<N;te++)he=Ne[te],qe?t.texSubImage2D(s.TEXTURE_2D,te,0,0,he.width,he.height,Ge,Ae,he.data):t.texImage2D(s.TEXTURE_2D,te,ye,he.width,he.height,0,Ge,Ae,he.data);E.generateMipmaps=!1}else qe?(lt&&t.texStorage2D(s.TEXTURE_2D,ke,ye,J.width,J.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,J.width,J.height,Ge,Ae,J.data)):t.texImage2D(s.TEXTURE_2D,0,ye,J.width,J.height,0,Ge,Ae,J.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){qe&&lt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ke,ye,Ne[0].width,Ne[0].height,J.depth);for(let te=0,N=Ne.length;te<N;te++)he=Ne[te],E.format!==Ye?Ge!==null?qe?t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,he.width,he.height,J.depth,Ge,he.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,te,ye,he.width,he.height,J.depth,0,he.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qe?t.texSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,he.width,he.height,J.depth,Ge,Ae,he.data):t.texImage3D(s.TEXTURE_2D_ARRAY,te,ye,he.width,he.height,J.depth,0,Ge,Ae,he.data)}else{qe&&lt&&t.texStorage2D(s.TEXTURE_2D,ke,ye,Ne[0].width,Ne[0].height);for(let te=0,N=Ne.length;te<N;te++)he=Ne[te],E.format!==Ye?Ge!==null?qe?t.compressedTexSubImage2D(s.TEXTURE_2D,te,0,0,he.width,he.height,Ge,he.data):t.compressedTexImage2D(s.TEXTURE_2D,te,ye,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qe?t.texSubImage2D(s.TEXTURE_2D,te,0,0,he.width,he.height,Ge,Ae,he.data):t.texImage2D(s.TEXTURE_2D,te,ye,he.width,he.height,0,Ge,Ae,he.data)}else if(E.isDataArrayTexture)qe?(lt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ke,ye,J.width,J.height,J.depth),t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Ge,Ae,J.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,ye,J.width,J.height,J.depth,0,Ge,Ae,J.data);else if(E.isData3DTexture)qe?(lt&&t.texStorage3D(s.TEXTURE_3D,ke,ye,J.width,J.height,J.depth),t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Ge,Ae,J.data)):t.texImage3D(s.TEXTURE_3D,0,ye,J.width,J.height,J.depth,0,Ge,Ae,J.data);else if(E.isFramebufferTexture){if(lt)if(qe)t.texStorage2D(s.TEXTURE_2D,ke,ye,J.width,J.height);else{let te=J.width,N=J.height;for(let ne=0;ne<ke;ne++)t.texImage2D(s.TEXTURE_2D,ne,ye,te,N,0,Ge,Ae,null),te>>=1,N>>=1}}else if(Ne.length>0&&Ze){qe&&lt&&t.texStorage2D(s.TEXTURE_2D,ke,ye,Ne[0].width,Ne[0].height);for(let te=0,N=Ne.length;te<N;te++)he=Ne[te],qe?t.texSubImage2D(s.TEXTURE_2D,te,0,0,Ge,Ae,he):t.texImage2D(s.TEXTURE_2D,te,ye,Ge,Ae,he);E.generateMipmaps=!1}else qe?(lt&&t.texStorage2D(s.TEXTURE_2D,ke,ye,J.width,J.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,Ge,Ae,J)):t.texImage2D(s.TEXTURE_2D,0,ye,Ge,Ae,J);y(E,Ze)&&v($),me.__version=ee.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function xe(C,E,G){if(E.image.length!==6)return;const $=Z(C,E),Q=E.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+G);const ee=i.get(Q);if(Q.version!==ee.__version||$===!0){t.activeTexture(s.TEXTURE0+G);const me=Qe.getPrimaries(Qe.workingColorSpace),re=E.colorSpace===Wt?null:Qe.getPrimaries(E.colorSpace),ue=E.colorSpace===Wt||me===re?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue);const Me=E.isCompressedTexture||E.image[0].isCompressedTexture,Be=E.image[0]&&E.image[0].isDataTexture,J=[];for(let te=0;te<6;te++)!Me&&!Be?J[te]=x(E.image[te],!1,!0,n.maxCubemapSize):J[te]=Be?E.image[te].image:E.image[te],J[te]=Fe(E,J[te]);const Ze=J[0],Ge=m(Ze)||o,Ae=r.convert(E.format,E.colorSpace),ye=r.convert(E.type),he=_(E.internalFormat,Ae,ye,E.colorSpace),Ne=o&&E.isVideoTexture!==!0,qe=ee.__version===void 0||$===!0;let lt=T(E,Ze,Ge);X(s.TEXTURE_CUBE_MAP,E,Ge);let ke;if(Me){Ne&&qe&&t.texStorage2D(s.TEXTURE_CUBE_MAP,lt,he,Ze.width,Ze.height);for(let te=0;te<6;te++){ke=J[te].mipmaps;for(let N=0;N<ke.length;N++){const ne=ke[N];E.format!==Ye?Ae!==null?Ne?t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N,0,0,ne.width,ne.height,Ae,ne.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N,he,ne.width,ne.height,0,ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N,0,0,ne.width,ne.height,Ae,ye,ne.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N,he,ne.width,ne.height,0,Ae,ye,ne.data)}}}else{ke=E.mipmaps,Ne&&qe&&(ke.length>0&&lt++,t.texStorage2D(s.TEXTURE_CUBE_MAP,lt,he,J[0].width,J[0].height));for(let te=0;te<6;te++)if(Be){Ne?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,J[te].width,J[te].height,Ae,ye,J[te].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,he,J[te].width,J[te].height,0,Ae,ye,J[te].data);for(let N=0;N<ke.length;N++){const se=ke[N].image[te].image;Ne?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N+1,0,0,se.width,se.height,Ae,ye,se.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N+1,he,se.width,se.height,0,Ae,ye,se.data)}}else{Ne?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ae,ye,J[te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,he,Ae,ye,J[te]);for(let N=0;N<ke.length;N++){const ne=ke[N];Ne?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N+1,0,0,Ae,ye,ne.image[te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,N+1,he,Ae,ye,ne.image[te])}}}y(E,Ge)&&v(s.TEXTURE_CUBE_MAP),ee.__version=Q.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function ve(C,E,G,$,Q,ee){const me=r.convert(G.format,G.colorSpace),re=r.convert(G.type),ue=_(G.internalFormat,me,re,G.colorSpace);if(!i.get(E).__hasExternalTextures){const Be=Math.max(1,E.width>>ee),J=Math.max(1,E.height>>ee);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?t.texImage3D(Q,ee,ue,Be,J,E.depth,0,me,re,null):t.texImage2D(Q,ee,ue,Be,J,0,me,re,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),pe(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,Q,i.get(G).__webglTexture,0,Re(E)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,Q,i.get(G).__webglTexture,ee),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ce(C,E,G){if(s.bindRenderbuffer(s.RENDERBUFFER,C),E.depthBuffer&&!E.stencilBuffer){let $=o===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(G||pe(E)){const Q=E.depthTexture;Q&&Q.isDepthTexture&&(Q.type===Mt?$=s.DEPTH_COMPONENT32F:Q.type===Zt&&($=s.DEPTH_COMPONENT24));const ee=Re(E);pe(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ee,$,E.width,E.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,ee,$,E.width,E.height)}else s.renderbufferStorage(s.RENDERBUFFER,$,E.width,E.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,C)}else if(E.depthBuffer&&E.stencilBuffer){const $=Re(E);G&&pe(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,$,s.DEPTH24_STENCIL8,E.width,E.height):pe(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$,s.DEPTH24_STENCIL8,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,C)}else{const $=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let Q=0;Q<$.length;Q++){const ee=$[Q],me=r.convert(ee.format,ee.colorSpace),re=r.convert(ee.type),ue=_(ee.internalFormat,me,re,ee.colorSpace),Me=Re(E);G&&pe(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Me,ue,E.width,E.height):pe(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Me,ue,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,ue,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function De(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),B(E.depthTexture,0);const $=i.get(E.depthTexture).__webglTexture,Q=Re(E);if(E.depthTexture.format===on)pe(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0);else if(E.depthTexture.format===Jn)pe(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function we(C){const E=i.get(C),G=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");De(E.__webglFramebuffer,C)}else if(G){E.__webglDepthbuffer=[];for(let $=0;$<6;$++)t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[$]),E.__webglDepthbuffer[$]=s.createRenderbuffer(),Ce(E.__webglDepthbuffer[$],C,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=s.createRenderbuffer(),Ce(E.__webglDepthbuffer,C,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function He(C,E,G){const $=i.get(C);E!==void 0&&ve($.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),G!==void 0&&we(C)}function k(C){const E=C.texture,G=i.get(C),$=i.get(E);C.addEventListener("dispose",R),C.isWebGLMultipleRenderTargets!==!0&&($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=E.version,a.memory.textures++);const Q=C.isWebGLCubeRenderTarget===!0,ee=C.isWebGLMultipleRenderTargets===!0,me=m(C)||o;if(Q){G.__webglFramebuffer=[];for(let re=0;re<6;re++)if(o&&E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer[re]=[];for(let ue=0;ue<E.mipmaps.length;ue++)G.__webglFramebuffer[re][ue]=s.createFramebuffer()}else G.__webglFramebuffer[re]=s.createFramebuffer()}else{if(o&&E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer=[];for(let re=0;re<E.mipmaps.length;re++)G.__webglFramebuffer[re]=s.createFramebuffer()}else G.__webglFramebuffer=s.createFramebuffer();if(ee)if(n.drawBuffers){const re=C.texture;for(let ue=0,Me=re.length;ue<Me;ue++){const Be=i.get(re[ue]);Be.__webglTexture===void 0&&(Be.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&C.samples>0&&pe(C)===!1){const re=ee?E:[E];G.__webglMultisampledFramebuffer=s.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ue=0;ue<re.length;ue++){const Me=re[ue];G.__webglColorRenderbuffer[ue]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,G.__webglColorRenderbuffer[ue]);const Be=r.convert(Me.format,Me.colorSpace),J=r.convert(Me.type),Ze=_(Me.internalFormat,Be,J,Me.colorSpace,C.isXRRenderTarget===!0),Ge=Re(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ge,Ze,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ue,s.RENDERBUFFER,G.__webglColorRenderbuffer[ue])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(G.__webglDepthRenderbuffer=s.createRenderbuffer(),Ce(G.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),X(s.TEXTURE_CUBE_MAP,E,me);for(let re=0;re<6;re++)if(o&&E.mipmaps&&E.mipmaps.length>0)for(let ue=0;ue<E.mipmaps.length;ue++)ve(G.__webglFramebuffer[re][ue],C,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+re,ue);else ve(G.__webglFramebuffer[re],C,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);y(E,me)&&v(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ee){const re=C.texture;for(let ue=0,Me=re.length;ue<Me;ue++){const Be=re[ue],J=i.get(Be);t.bindTexture(s.TEXTURE_2D,J.__webglTexture),X(s.TEXTURE_2D,Be,me),ve(G.__webglFramebuffer,C,Be,s.COLOR_ATTACHMENT0+ue,s.TEXTURE_2D,0),y(Be,me)&&v(s.TEXTURE_2D)}t.unbindTexture()}else{let re=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(o?re=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(re,$.__webglTexture),X(re,E,me),o&&E.mipmaps&&E.mipmaps.length>0)for(let ue=0;ue<E.mipmaps.length;ue++)ve(G.__webglFramebuffer[ue],C,E,s.COLOR_ATTACHMENT0,re,ue);else ve(G.__webglFramebuffer,C,E,s.COLOR_ATTACHMENT0,re,0);y(E,me)&&v(re),t.unbindTexture()}C.depthBuffer&&we(C)}function Ft(C){const E=m(C)||o,G=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let $=0,Q=G.length;$<Q;$++){const ee=G[$];if(y(ee,E)){const me=C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,re=i.get(ee).__webglTexture;t.bindTexture(me,re),v(me),t.unbindTexture()}}}function _e(C){if(o&&C.samples>0&&pe(C)===!1){const E=C.isWebGLMultipleRenderTargets?C.texture:[C.texture],G=C.width,$=C.height;let Q=s.COLOR_BUFFER_BIT;const ee=[],me=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,re=i.get(C),ue=C.isWebGLMultipleRenderTargets===!0;if(ue)for(let Me=0;Me<E.length;Me++)t.bindFramebuffer(s.FRAMEBUFFER,re.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,re.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,re.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,re.__webglFramebuffer);for(let Me=0;Me<E.length;Me++){ee.push(s.COLOR_ATTACHMENT0+Me),C.depthBuffer&&ee.push(me);const Be=re.__ignoreDepthValues!==void 0?re.__ignoreDepthValues:!1;if(Be===!1&&(C.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),ue&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,re.__webglColorRenderbuffer[Me]),Be===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[me]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[me])),ue){const J=i.get(E[Me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,J,0)}s.blitFramebuffer(0,0,G,$,0,0,G,$,Q,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ee)}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ue)for(let Me=0;Me<E.length;Me++){t.bindFramebuffer(s.FRAMEBUFFER,re.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,re.__webglColorRenderbuffer[Me]);const Be=i.get(E[Me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,re.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,Be,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,re.__webglMultisampledFramebuffer)}}function Re(C){return Math.min(n.maxSamples,C.samples)}function pe(C){const E=i.get(C);return o&&C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function at(C){const E=a.render.frame;u.get(C)!==E&&(u.set(C,E),C.update())}function Fe(C,E){const G=C.colorSpace,$=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===xo||G!==di&&G!==Wt&&(Qe.getTransfer(G)===it?o===!1?e.has("EXT_sRGB")===!0&&$===Ye?(C.format=xo,C.minFilter=Xe,C.generateMipmaps=!1):E=Du.sRGBToLinear(E):($!==Ye||Q!==ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),E}this.allocateTextureUnit=I,this.resetTextureUnits=F,this.setTexture2D=B,this.setTexture2DArray=K,this.setTexture3D=q,this.setTextureCube=H,this.rebindTextures=He,this.setupRenderTarget=k,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=pe}function Hv(s,e,t){const i=t.isWebGL2;function n(r,a=Wt){let o;const l=Qe.getTransfer(a);if(r===ui)return s.UNSIGNED_BYTE;if(r===wu)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Tu)return s.UNSIGNED_SHORT_5_5_5_1;if(r===go)return s.BYTE;if(r===Mu)return s.SHORT;if(r===Jr)return s.UNSIGNED_SHORT;if(r===ws)return s.INT;if(r===Zt)return s.UNSIGNED_INT;if(r===Mt)return s.FLOAT;if(r===Pt)return i?s.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===ud)return s.ALPHA;if(r===Ye)return s.RGBA;if(r===hd)return s.LUMINANCE;if(r===dd)return s.LUMINANCE_ALPHA;if(r===on)return s.DEPTH_COMPONENT;if(r===Jn)return s.DEPTH_STENCIL;if(r===xo)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Eu)return s.RED;if(r===No)return s.RED_INTEGER;if(r===Au)return s.RG;if(r===Qr)return s.RG_INTEGER;if(r===Cs)return s.RGBA_INTEGER;if(r===fa||r===pa||r===ma||r===ga)if(l===it)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===fa)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===pa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ma)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ga)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===fa)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===pa)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ma)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ga)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===dl||r===fl||r===pl||r===ml)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===dl)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===fl)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===pl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ml)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Ru)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===gl||r===vl)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===gl)return l===it?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===vl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===xl||r===yl||r===_l||r===bl||r===Sl||r===Ml||r===wl||r===Tl||r===El||r===Al||r===Rl||r===Pl||r===Cl||r===Il)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===xl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===yl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===_l)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===bl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Sl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Ml)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===wl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Tl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===El)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Al)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Rl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Pl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Cl)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Il)return l===it?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===va||r===Ll||r===Dl)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===va)return l===it?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ll)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Dl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===fd||r===Nl||r===Ul||r===Fl)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===va)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Nl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ul)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Fl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===an?i?s.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:n}}class Wv extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ar extends ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Xv={type:"move"};class Ga{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ar,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ar,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ar,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Xv)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ar;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class qv extends cn{constructor(e,t){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null;const x=t.getContextAttributes();let m=null,p=null;const y=[],v=[],_=new ce;let T=null;const M=new Yt;M.layers.enable(1),M.viewport=new We;const w=new Yt;w.layers.enable(2),w.viewport=new We;const R=[M,w],S=new Wv;S.layers.enable(1),S.layers.enable(2);let b=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Z=y[X];return Z===void 0&&(Z=new Ga,y[X]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(X){let Z=y[X];return Z===void 0&&(Z=new Ga,y[X]=Z),Z.getGripSpace()},this.getHand=function(X){let Z=y[X];return Z===void 0&&(Z=new Ga,y[X]=Z),Z.getHandSpace()};function D(X){const Z=v.indexOf(X.inputSource);if(Z===-1)return;const oe=y[Z];oe!==void 0&&(oe.update(X.inputSource,X.frame,c||a),oe.dispatchEvent({type:X.type,data:X.inputSource}))}function F(){n.removeEventListener("select",D),n.removeEventListener("selectstart",D),n.removeEventListener("selectend",D),n.removeEventListener("squeeze",D),n.removeEventListener("squeezestart",D),n.removeEventListener("squeezeend",D),n.removeEventListener("end",F),n.removeEventListener("inputsourceschange",I);for(let X=0;X<y.length;X++){const Z=v[X];Z!==null&&(v[X]=null,y[X].disconnect(Z))}b=null,L=null,e.setRenderTarget(m),f=null,h=null,d=null,n=null,p=null,ae.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(_.width,_.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(X){if(n=X,n!==null){if(m=e.getRenderTarget(),n.addEventListener("select",D),n.addEventListener("selectstart",D),n.addEventListener("selectend",D),n.addEventListener("squeeze",D),n.addEventListener("squeezestart",D),n.addEventListener("squeezeend",D),n.addEventListener("end",F),n.addEventListener("inputsourceschange",I),x.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(_),n.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:n.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(n,t,Z),n.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new It(f.framebufferWidth,f.framebufferHeight,{format:Ye,type:ui,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let Z=null,oe=null,xe=null;x.depth&&(xe=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=x.stencil?Jn:on,oe=x.stencil?an:Zt);const ve={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:r};d=new XRWebGLBinding(n,t),h=d.createProjectionLayer(ve),n.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),p=new It(h.textureWidth,h.textureHeight,{format:Ye,type:ui,depthTexture:new qu(h.textureWidth,h.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0});const Ce=e.properties.get(p);Ce.__ignoreDepthValues=h.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),ae.setContext(n),ae.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode};function I(X){for(let Z=0;Z<X.removed.length;Z++){const oe=X.removed[Z],xe=v.indexOf(oe);xe>=0&&(v[xe]=null,y[xe].disconnect(oe))}for(let Z=0;Z<X.added.length;Z++){const oe=X.added[Z];let xe=v.indexOf(oe);if(xe===-1){for(let Ce=0;Ce<y.length;Ce++)if(Ce>=v.length){v.push(oe),xe=Ce;break}else if(v[Ce]===null){v[Ce]=oe,xe=Ce;break}if(xe===-1)break}const ve=y[xe];ve&&ve.connect(oe)}}const U=new P,B=new P;function K(X,Z,oe){U.setFromMatrixPosition(Z.matrixWorld),B.setFromMatrixPosition(oe.matrixWorld);const xe=U.distanceTo(B),ve=Z.projectionMatrix.elements,Ce=oe.projectionMatrix.elements,De=ve[14]/(ve[10]-1),we=ve[14]/(ve[10]+1),He=(ve[9]+1)/ve[5],k=(ve[9]-1)/ve[5],Ft=(ve[8]-1)/ve[0],_e=(Ce[8]+1)/Ce[0],Re=De*Ft,pe=De*_e,at=xe/(-Ft+_e),Fe=at*-Ft;Z.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Fe),X.translateZ(at),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const C=De+at,E=we+at,G=Re-Fe,$=pe+(xe-Fe),Q=He*we/E*C,ee=k*we/E*C;X.projectionMatrix.makePerspective(G,$,Q,ee,C,E),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function q(X,Z){Z===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Z.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(n===null)return;S.near=w.near=M.near=X.near,S.far=w.far=M.far=X.far,(b!==S.near||L!==S.far)&&(n.updateRenderState({depthNear:S.near,depthFar:S.far}),b=S.near,L=S.far);const Z=X.parent,oe=S.cameras;q(S,Z);for(let xe=0;xe<oe.length;xe++)q(oe[xe],Z);oe.length===2?K(S,M,w):S.projectionMatrix.copy(M.projectionMatrix),H(X,S,Z)};function H(X,Z,oe){oe===null?X.matrix.copy(Z.matrixWorld):(X.matrix.copy(oe.matrixWorld),X.matrix.invert(),X.matrix.multiply(Z.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Qn*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(X){l=X,h!==null&&(h.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)};let j=null;function Y(X,Z){if(u=Z.getViewerPose(c||a),g=Z,u!==null){const oe=u.views;f!==null&&(e.setRenderTargetFramebuffer(p,f.framebuffer),e.setRenderTarget(p));let xe=!1;oe.length!==S.cameras.length&&(S.cameras.length=0,xe=!0);for(let ve=0;ve<oe.length;ve++){const Ce=oe[ve];let De=null;if(f!==null)De=f.getViewport(Ce);else{const He=d.getViewSubImage(h,Ce);De=He.viewport,ve===0&&(e.setRenderTargetTextures(p,He.colorTexture,h.ignoreDepthValues?void 0:He.depthStencilTexture),e.setRenderTarget(p))}let we=R[ve];we===void 0&&(we=new Yt,we.layers.enable(ve),we.viewport=new We,R[ve]=we),we.matrix.fromArray(Ce.transform.matrix),we.matrix.decompose(we.position,we.quaternion,we.scale),we.projectionMatrix.fromArray(Ce.projectionMatrix),we.projectionMatrixInverse.copy(we.projectionMatrix).invert(),we.viewport.set(De.x,De.y,De.width,De.height),ve===0&&(S.matrix.copy(we.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),xe===!0&&S.cameras.push(we)}}for(let oe=0;oe<y.length;oe++){const xe=v[oe],ve=y[oe];xe!==null&&ve!==void 0&&ve.update(xe,Z,c||a)}j&&j(X,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),g=null}const ae=new Xu;ae.setAnimationLoop(Y),this.setAnimationLoop=function(X){j=X},this.dispose=function(){}}}function Kv(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Vu(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function n(m,p,y,v,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,y,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Vt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Vt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=e.get(p).envMap;if(y&&(m.envMap.value=y,m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const v=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*v,t(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),e.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Vt&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const y=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function jv(s,e,t,i){let n={},r={},a=[];const o=t.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,v){const _=v.program;i.uniformBlockBinding(y,_)}function c(y,v){let _=n[y.id];_===void 0&&(g(y),_=u(y),n[y.id]=_,y.addEventListener("dispose",m));const T=v.program;i.updateUBOMapping(y,T);const M=e.render.frame;r[y.id]!==M&&(h(y),r[y.id]=M)}function u(y){const v=d();y.__bindingPointIndex=v;const _=s.createBuffer(),T=y.__size,M=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,T,M),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,_),_}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){const v=n[y.id],_=y.uniforms,T=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let M=0,w=_.length;M<w;M++){const R=Array.isArray(_[M])?_[M]:[_[M]];for(let S=0,b=R.length;S<b;S++){const L=R[S];if(f(L,M,S,T)===!0){const D=L.__offset,F=Array.isArray(L.value)?L.value:[L.value];let I=0;for(let U=0;U<F.length;U++){const B=F[U],K=x(B);typeof B=="number"||typeof B=="boolean"?(L.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,D+I,L.__data)):B.isMatrix3?(L.__data[0]=B.elements[0],L.__data[1]=B.elements[1],L.__data[2]=B.elements[2],L.__data[3]=0,L.__data[4]=B.elements[3],L.__data[5]=B.elements[4],L.__data[6]=B.elements[5],L.__data[7]=0,L.__data[8]=B.elements[6],L.__data[9]=B.elements[7],L.__data[10]=B.elements[8],L.__data[11]=0):(B.toArray(L.__data,I),I+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,D,L.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,v,_,T){const M=y.value,w=v+"_"+_;if(T[w]===void 0)return typeof M=="number"||typeof M=="boolean"?T[w]=M:T[w]=M.clone(),!0;{const R=T[w];if(typeof M=="number"||typeof M=="boolean"){if(R!==M)return T[w]=M,!0}else if(R.equals(M)===!1)return R.copy(M),!0}return!1}function g(y){const v=y.uniforms;let _=0;const T=16;for(let w=0,R=v.length;w<R;w++){const S=Array.isArray(v[w])?v[w]:[v[w]];for(let b=0,L=S.length;b<L;b++){const D=S[b],F=Array.isArray(D.value)?D.value:[D.value];for(let I=0,U=F.length;I<U;I++){const B=F[I],K=x(B),q=_%T;q!==0&&T-q<K.boundary&&(_+=T-q),D.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=_,_+=K.storage}}}const M=_%T;return M>0&&(_+=T-M),y.__size=_,y.__cache={},this}function x(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){const v=y.target;v.removeEventListener("dispose",m);const _=a.indexOf(v.__bindingPointIndex);a.splice(_,1),s.deleteBuffer(n[v.id]),delete n[v.id],delete r[v.id]}function p(){for(const y in n)s.deleteBuffer(n[y]);a=[],n={},r={}}return{bind:l,update:c,dispose:p}}class Yv{constructor(e={}){const{canvas:t=Wd(),context:i=null,depth:n=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let h;i!==null?h=i.getContextAttributes().alpha:h=a;const f=new Uint32Array(4),g=new Int32Array(4);let x=null,m=null;const p=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Et,this._useLegacyLights=!1,this.toneMapping=qi,this.toneMappingExposure=1;const v=this;let _=!1,T=0,M=0,w=null,R=-1,S=null;const b=new We,L=new We;let D=null;const F=new de(0);let I=0,U=t.width,B=t.height,K=1,q=null,H=null;const j=new We(0,0,U,B),Y=new We(0,0,U,B);let ae=!1;const X=new Oo;let Z=!1,oe=!1,xe=null;const ve=new fe,Ce=new ce,De=new P,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function He(){return w===null?K:1}let k=i;function Ft(A,O){for(let V=0;V<A.length;V++){const W=A[V],z=t.getContext(W,O);if(z!==null)return z}return null}try{const A={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Do}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",N,!1),t.addEventListener("webglcontextcreationerror",ne,!1),k===null){const O=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&O.shift(),k=Ft(O,A),k===null)throw Ft(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&k instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),k.getShaderPrecisionFormat===void 0&&(k.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let _e,Re,pe,at,Fe,C,E,G,$,Q,ee,me,re,ue,Me,Be,J,Ze,Ge,Ae,ye,he,Ne,qe;function lt(){_e=new sg(k),Re=new Qm(k,_e,e),_e.init(Re),he=new Hv(k,_e,Re),pe=new Gv(k,_e,Re),at=new og(k),Fe=new Av,C=new Vv(k,_e,pe,Fe,Re,he,at),E=new eg(v),G=new ng(v),$=new mf(k,Re),Ne=new Zm(k,_e,$,Re),Q=new rg(k,$,at,Ne),ee=new hg(k,Q,$,at),Ge=new ug(k,Re,C),Be=new $m(Fe),me=new Ev(v,E,G,_e,Re,Ne,Be),re=new Kv(v,Fe),ue=new Pv,Me=new Uv(_e,Re),Ze=new Ym(v,E,G,pe,ee,h,l),J=new zv(v,ee,Re),qe=new jv(k,at,Re,pe),Ae=new Jm(k,_e,at,Re),ye=new ag(k,_e,at,Re),at.programs=me.programs,v.capabilities=Re,v.extensions=_e,v.properties=Fe,v.renderLists=ue,v.shadowMap=J,v.state=pe,v.info=at}lt();const ke=new qv(v,k);this.xr=ke,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const A=_e.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=_e.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(A){A!==void 0&&(K=A,this.setSize(U,B,!1))},this.getSize=function(A){return A.set(U,B)},this.setSize=function(A,O,V=!0){if(ke.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=A,B=O,t.width=Math.floor(A*K),t.height=Math.floor(O*K),V===!0&&(t.style.width=A+"px",t.style.height=O+"px"),this.setViewport(0,0,A,O)},this.getDrawingBufferSize=function(A){return A.set(U*K,B*K).floor()},this.setDrawingBufferSize=function(A,O,V){U=A,B=O,K=V,t.width=Math.floor(A*V),t.height=Math.floor(O*V),this.setViewport(0,0,A,O)},this.getCurrentViewport=function(A){return A.copy(b)},this.getViewport=function(A){return A.copy(j)},this.setViewport=function(A,O,V,W){A.isVector4?j.set(A.x,A.y,A.z,A.w):j.set(A,O,V,W),pe.viewport(b.copy(j).multiplyScalar(K).floor())},this.getScissor=function(A){return A.copy(Y)},this.setScissor=function(A,O,V,W){A.isVector4?Y.set(A.x,A.y,A.z,A.w):Y.set(A,O,V,W),pe.scissor(L.copy(Y).multiplyScalar(K).floor())},this.getScissorTest=function(){return ae},this.setScissorTest=function(A){pe.setScissorTest(ae=A)},this.setOpaqueSort=function(A){q=A},this.setTransparentSort=function(A){H=A},this.getClearColor=function(A){return A.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor.apply(Ze,arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha.apply(Ze,arguments)},this.clear=function(A=!0,O=!0,V=!0){let W=0;if(A){let z=!1;if(w!==null){const le=w.texture.format;z=le===Cs||le===Qr||le===No}if(z){const le=w.texture.type,ge=le===ui||le===Zt||le===Jr||le===an||le===wu||le===Tu,Se=Ze.getClearColor(),Ee=Ze.getClearAlpha(),Oe=Se.r,Pe=Se.g,Ie=Se.b;ge?(f[0]=Oe,f[1]=Pe,f[2]=Ie,f[3]=Ee,k.clearBufferuiv(k.COLOR,0,f)):(g[0]=Oe,g[1]=Pe,g[2]=Ie,g[3]=Ee,k.clearBufferiv(k.COLOR,0,g))}else W|=k.COLOR_BUFFER_BIT}O&&(W|=k.DEPTH_BUFFER_BIT),V&&(W|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",N,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),ue.dispose(),Me.dispose(),Fe.dispose(),E.dispose(),G.dispose(),ee.dispose(),Ne.dispose(),qe.dispose(),me.dispose(),ke.dispose(),ke.removeEventListener("sessionstart",Bt),ke.removeEventListener("sessionend",tt),xe&&(xe.dispose(),xe=null),Ot.stop()};function te(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function N(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;const A=at.autoReset,O=J.enabled,V=J.autoUpdate,W=J.needsUpdate,z=J.type;lt(),at.autoReset=A,J.enabled=O,J.autoUpdate=V,J.needsUpdate=W,J.type=z}function ne(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function se(A){const O=A.target;O.removeEventListener("dispose",se),Te(O)}function Te(A){be(A),Fe.remove(A)}function be(A){const O=Fe.get(A).programs;O!==void 0&&(O.forEach(function(V){me.releaseProgram(V)}),A.isShaderMaterial&&me.releaseShaderCache(A))}this.renderBufferDirect=function(A,O,V,W,z,le){O===null&&(O=we);const ge=z.isMesh&&z.matrixWorld.determinant()<0,Se=wh(A,O,V,W,z);pe.setMaterial(W,ge);let Ee=V.index,Oe=1;if(W.wireframe===!0){if(Ee=Q.getWireframeAttribute(V),Ee===void 0)return;Oe=2}const Pe=V.drawRange,Ie=V.attributes.position;let ft=Pe.start*Oe,qt=(Pe.start+Pe.count)*Oe;le!==null&&(ft=Math.max(ft,le.start*Oe),qt=Math.min(qt,(le.start+le.count)*Oe)),Ee!==null?(ft=Math.max(ft,0),qt=Math.min(qt,Ee.count)):Ie!=null&&(ft=Math.max(ft,0),qt=Math.min(qt,Ie.count));const bt=qt-ft;if(bt<0||bt===1/0)return;Ne.setup(z,W,Se,V,Ee);let Mi,ot=Ae;if(Ee!==null&&(Mi=$.get(Ee),ot=ye,ot.setIndex(Mi)),z.isMesh)W.wireframe===!0?(pe.setLineWidth(W.wireframeLinewidth*He()),ot.setMode(k.LINES)):ot.setMode(k.TRIANGLES);else if(z.isLine){let ze=W.linewidth;ze===void 0&&(ze=1),pe.setLineWidth(ze*He()),z.isLineSegments?ot.setMode(k.LINES):z.isLineLoop?ot.setMode(k.LINE_LOOP):ot.setMode(k.LINE_STRIP)}else z.isPoints?ot.setMode(k.POINTS):z.isSprite&&ot.setMode(k.TRIANGLES);if(z.isBatchedMesh)ot.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else if(z.isInstancedMesh)ot.renderInstances(ft,bt,z.count);else if(V.isInstancedBufferGeometry){const ze=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,la=Math.min(V.instanceCount,ze);ot.renderInstances(ft,bt,la)}else ot.render(ft,bt)};function $e(A,O,V){A.transparent===!0&&A.side===vi&&A.forceSinglePass===!1?(A.side=Vt,A.needsUpdate=!0,Bs(A,O,V),A.side=si,A.needsUpdate=!0,Bs(A,O,V),A.side=vi):Bs(A,O,V)}this.compile=function(A,O,V=null){V===null&&(V=A),m=Me.get(V),m.init(),y.push(m),V.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),A!==V&&A.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),m.setupLights(v._useLegacyLights);const W=new Set;return A.traverse(function(z){const le=z.material;if(le)if(Array.isArray(le))for(let ge=0;ge<le.length;ge++){const Se=le[ge];$e(Se,V,z),W.add(Se)}else $e(le,V,z),W.add(le)}),y.pop(),m=null,W},this.compileAsync=function(A,O,V=null){const W=this.compile(A,O,V);return new Promise(z=>{function le(){if(W.forEach(function(ge){Fe.get(ge).currentProgram.isReady()&&W.delete(ge)}),W.size===0){z(A);return}setTimeout(le,10)}_e.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let et=null;function _t(A){et&&et(A)}function Bt(){Ot.stop()}function tt(){Ot.start()}const Ot=new Xu;Ot.setAnimationLoop(_t),typeof self<"u"&&Ot.setContext(self),this.setAnimationLoop=function(A){et=A,ke.setAnimationLoop(A),A===null?Ot.stop():Ot.start()},ke.addEventListener("sessionstart",Bt),ke.addEventListener("sessionend",tt),this.render=function(A,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),ke.enabled===!0&&ke.isPresenting===!0&&(ke.cameraAutoUpdate===!0&&ke.updateCamera(O),O=ke.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,O,w),m=Me.get(A,y.length),m.init(),y.push(m),ve.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),X.setFromProjectionMatrix(ve),oe=this.localClippingEnabled,Z=Be.init(this.clippingPlanes,oe),x=ue.get(A,p.length),x.init(),p.push(x),pi(A,O,0,v.sortObjects),x.finish(),v.sortObjects===!0&&x.sort(q,H),this.info.render.frame++,Z===!0&&Be.beginShadows();const V=m.state.shadowsArray;if(J.render(V,A,O),Z===!0&&Be.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ze.render(x,A),m.setupLights(v._useLegacyLights),O.isArrayCamera){const W=O.cameras;for(let z=0,le=W.length;z<le;z++){const ge=W[z];Qo(x,A,ge,ge.viewport)}}else Qo(x,A,O);w!==null&&(C.updateMultisampleRenderTarget(w),C.updateRenderTargetMipmap(w)),A.isScene===!0&&A.onAfterRender(v,A,O),Ne.resetDefaultState(),R=-1,S=null,y.pop(),y.length>0?m=y[y.length-1]:m=null,p.pop(),p.length>0?x=p[p.length-1]:x=null};function pi(A,O,V,W){if(A.visible===!1)return;if(A.layers.test(O.layers)){if(A.isGroup)V=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(O);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||X.intersectsSprite(A)){W&&De.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ve);const ge=ee.update(A),Se=A.material;Se.visible&&x.push(A,ge,Se,V,De.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||X.intersectsObject(A))){const ge=ee.update(A),Se=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),De.copy(A.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),De.copy(ge.boundingSphere.center)),De.applyMatrix4(A.matrixWorld).applyMatrix4(ve)),Array.isArray(Se)){const Ee=ge.groups;for(let Oe=0,Pe=Ee.length;Oe<Pe;Oe++){const Ie=Ee[Oe],ft=Se[Ie.materialIndex];ft&&ft.visible&&x.push(A,ge,ft,V,De.z,Ie)}}else Se.visible&&x.push(A,ge,Se,V,De.z,null)}}const le=A.children;for(let ge=0,Se=le.length;ge<Se;ge++)pi(le[ge],O,V,W)}function Qo(A,O,V,W){const z=A.opaque,le=A.transmissive,ge=A.transparent;m.setupLightsView(V),Z===!0&&Be.setGlobalState(v.clippingPlanes,V),le.length>0&&Mh(z,le,O,V),W&&pe.viewport(b.copy(W)),z.length>0&&Fs(z,O,V),le.length>0&&Fs(le,O,V),ge.length>0&&Fs(ge,O,V),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function Mh(A,O,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const le=Re.isWebGL2;xe===null&&(xe=new It(1,1,{generateMipmaps:!0,type:_e.has("EXT_color_buffer_half_float")?Pt:ui,minFilter:Ps,samples:le?4:0})),v.getDrawingBufferSize(Ce),le?xe.setSize(Ce.x,Ce.y):xe.setSize(Xr(Ce.x),Xr(Ce.y));const ge=v.getRenderTarget();v.setRenderTarget(xe),v.getClearColor(F),I=v.getClearAlpha(),I<1&&v.setClearColor(16777215,.5),v.clear();const Se=v.toneMapping;v.toneMapping=qi,Fs(A,V,W),C.updateMultisampleRenderTarget(xe),C.updateRenderTargetMipmap(xe);let Ee=!1;for(let Oe=0,Pe=O.length;Oe<Pe;Oe++){const Ie=O[Oe],ft=Ie.object,qt=Ie.geometry,bt=Ie.material,Mi=Ie.group;if(bt.side===vi&&ft.layers.test(W.layers)){const ot=bt.side;bt.side=Vt,bt.needsUpdate=!0,$o(ft,V,W,qt,bt,Mi),bt.side=ot,bt.needsUpdate=!0,Ee=!0}}Ee===!0&&(C.updateMultisampleRenderTarget(xe),C.updateRenderTargetMipmap(xe)),v.setRenderTarget(ge),v.setClearColor(F,I),v.toneMapping=Se}function Fs(A,O,V){const W=O.isScene===!0?O.overrideMaterial:null;for(let z=0,le=A.length;z<le;z++){const ge=A[z],Se=ge.object,Ee=ge.geometry,Oe=W===null?ge.material:W,Pe=ge.group;Se.layers.test(V.layers)&&$o(Se,O,V,Ee,Oe,Pe)}}function $o(A,O,V,W,z,le){A.onBeforeRender(v,O,V,W,z,le),A.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),z.onBeforeRender(v,O,V,W,A,le),z.transparent===!0&&z.side===vi&&z.forceSinglePass===!1?(z.side=Vt,z.needsUpdate=!0,v.renderBufferDirect(V,O,W,z,A,le),z.side=si,z.needsUpdate=!0,v.renderBufferDirect(V,O,W,z,A,le),z.side=vi):v.renderBufferDirect(V,O,W,z,A,le),A.onAfterRender(v,O,V,W,z,le)}function Bs(A,O,V){O.isScene!==!0&&(O=we);const W=Fe.get(A),z=m.state.lights,le=m.state.shadowsArray,ge=z.state.version,Se=me.getParameters(A,z.state,le,O,V),Ee=me.getProgramCacheKey(Se);let Oe=W.programs;W.environment=A.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(A.isMeshStandardMaterial?G:E).get(A.envMap||W.environment),Oe===void 0&&(A.addEventListener("dispose",se),Oe=new Map,W.programs=Oe);let Pe=Oe.get(Ee);if(Pe!==void 0){if(W.currentProgram===Pe&&W.lightsStateVersion===ge)return tl(A,Se),Pe}else Se.uniforms=me.getUniforms(A),A.onBuild(V,Se,v),A.onBeforeCompile(Se,v),Pe=me.acquireProgram(Se,Ee),Oe.set(Ee,Pe),W.uniforms=Se.uniforms;const Ie=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ie.clippingPlanes=Be.uniform),tl(A,Se),W.needsLights=Eh(A),W.lightsStateVersion=ge,W.needsLights&&(Ie.ambientLightColor.value=z.state.ambient,Ie.lightProbe.value=z.state.probe,Ie.directionalLights.value=z.state.directional,Ie.directionalLightShadows.value=z.state.directionalShadow,Ie.spotLights.value=z.state.spot,Ie.spotLightShadows.value=z.state.spotShadow,Ie.rectAreaLights.value=z.state.rectArea,Ie.ltc_1.value=z.state.rectAreaLTC1,Ie.ltc_2.value=z.state.rectAreaLTC2,Ie.pointLights.value=z.state.point,Ie.pointLightShadows.value=z.state.pointShadow,Ie.hemisphereLights.value=z.state.hemi,Ie.directionalShadowMap.value=z.state.directionalShadowMap,Ie.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ie.spotShadowMap.value=z.state.spotShadowMap,Ie.spotLightMatrix.value=z.state.spotLightMatrix,Ie.spotLightMap.value=z.state.spotLightMap,Ie.pointShadowMap.value=z.state.pointShadowMap,Ie.pointShadowMatrix.value=z.state.pointShadowMatrix),W.currentProgram=Pe,W.uniformsList=null,Pe}function el(A){if(A.uniformsList===null){const O=A.currentProgram.getUniforms();A.uniformsList=Ur.seqWithValue(O.seq,A.uniforms)}return A.uniformsList}function tl(A,O){const V=Fe.get(A);V.outputColorSpace=O.outputColorSpace,V.batching=O.batching,V.instancing=O.instancing,V.instancingColor=O.instancingColor,V.skinning=O.skinning,V.morphTargets=O.morphTargets,V.morphNormals=O.morphNormals,V.morphColors=O.morphColors,V.morphTargetsCount=O.morphTargetsCount,V.numClippingPlanes=O.numClippingPlanes,V.numIntersection=O.numClipIntersection,V.vertexAlphas=O.vertexAlphas,V.vertexTangents=O.vertexTangents,V.toneMapping=O.toneMapping}function wh(A,O,V,W,z){O.isScene!==!0&&(O=we),C.resetTextureUnits();const le=O.fog,ge=W.isMeshStandardMaterial?O.environment:null,Se=w===null?v.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:di,Ee=(W.isMeshStandardMaterial?G:E).get(W.envMap||ge),Oe=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Pe=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ie=!!V.morphAttributes.position,ft=!!V.morphAttributes.normal,qt=!!V.morphAttributes.color;let bt=qi;W.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(bt=v.toneMapping);const Mi=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ot=Mi!==void 0?Mi.length:0,ze=Fe.get(W),la=m.state.lights;if(Z===!0&&(oe===!0||A!==S)){const ei=A===S&&W.id===R;Be.setState(W,A,ei)}let ct=!1;W.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==la.state.version||ze.outputColorSpace!==Se||z.isBatchedMesh&&ze.batching===!1||!z.isBatchedMesh&&ze.batching===!0||z.isInstancedMesh&&ze.instancing===!1||!z.isInstancedMesh&&ze.instancing===!0||z.isSkinnedMesh&&ze.skinning===!1||!z.isSkinnedMesh&&ze.skinning===!0||z.isInstancedMesh&&ze.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&ze.instancingColor===!1&&z.instanceColor!==null||ze.envMap!==Ee||W.fog===!0&&ze.fog!==le||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==Be.numPlanes||ze.numIntersection!==Be.numIntersection)||ze.vertexAlphas!==Oe||ze.vertexTangents!==Pe||ze.morphTargets!==Ie||ze.morphNormals!==ft||ze.morphColors!==qt||ze.toneMapping!==bt||Re.isWebGL2===!0&&ze.morphTargetsCount!==ot)&&(ct=!0):(ct=!0,ze.__version=W.version);let Zi=ze.currentProgram;ct===!0&&(Zi=Bs(W,O,z));let il=!1,as=!1,ca=!1;const Lt=Zi.getUniforms(),Ji=ze.uniforms;if(pe.useProgram(Zi.program)&&(il=!0,as=!0,ca=!0),W.id!==R&&(R=W.id,as=!0),il||S!==A){Lt.setValue(k,"projectionMatrix",A.projectionMatrix),Lt.setValue(k,"viewMatrix",A.matrixWorldInverse);const ei=Lt.map.cameraPosition;ei!==void 0&&ei.setValue(k,De.setFromMatrixPosition(A.matrixWorld)),Re.logarithmicDepthBuffer&&Lt.setValue(k,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Lt.setValue(k,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,as=!0,ca=!0)}if(z.isSkinnedMesh){Lt.setOptional(k,z,"bindMatrix"),Lt.setOptional(k,z,"bindMatrixInverse");const ei=z.skeleton;ei&&(Re.floatVertexTextures?(ei.boneTexture===null&&ei.computeBoneTexture(),Lt.setValue(k,"boneTexture",ei.boneTexture,C)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}z.isBatchedMesh&&(Lt.setOptional(k,z,"batchingTexture"),Lt.setValue(k,"batchingTexture",z._matricesTexture,C));const ua=V.morphAttributes;if((ua.position!==void 0||ua.normal!==void 0||ua.color!==void 0&&Re.isWebGL2===!0)&&Ge.update(z,V,Zi),(as||ze.receiveShadow!==z.receiveShadow)&&(ze.receiveShadow=z.receiveShadow,Lt.setValue(k,"receiveShadow",z.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Ji.envMap.value=Ee,Ji.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),as&&(Lt.setValue(k,"toneMappingExposure",v.toneMappingExposure),ze.needsLights&&Th(Ji,ca),le&&W.fog===!0&&re.refreshFogUniforms(Ji,le),re.refreshMaterialUniforms(Ji,W,K,B,xe),Ur.upload(k,el(ze),Ji,C)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Ur.upload(k,el(ze),Ji,C),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Lt.setValue(k,"center",z.center),Lt.setValue(k,"modelViewMatrix",z.modelViewMatrix),Lt.setValue(k,"normalMatrix",z.normalMatrix),Lt.setValue(k,"modelMatrix",z.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const ei=W.uniformsGroups;for(let ha=0,Ah=ei.length;ha<Ah;ha++)if(Re.isWebGL2){const nl=ei[ha];qe.update(nl,Zi),qe.bind(nl,Zi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Zi}function Th(A,O){A.ambientLightColor.needsUpdate=O,A.lightProbe.needsUpdate=O,A.directionalLights.needsUpdate=O,A.directionalLightShadows.needsUpdate=O,A.pointLights.needsUpdate=O,A.pointLightShadows.needsUpdate=O,A.spotLights.needsUpdate=O,A.spotLightShadows.needsUpdate=O,A.rectAreaLights.needsUpdate=O,A.hemisphereLights.needsUpdate=O}function Eh(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(A,O,V){Fe.get(A.texture).__webglTexture=O,Fe.get(A.depthTexture).__webglTexture=V;const W=Fe.get(A);W.__hasExternalTextures=!0,W.__hasExternalTextures&&(W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||_e.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,O){const V=Fe.get(A);V.__webglFramebuffer=O,V.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(A,O=0,V=0){w=A,T=O,M=V;let W=!0,z=null,le=!1,ge=!1;if(A){const Ee=Fe.get(A);Ee.__useDefaultFramebuffer!==void 0?(pe.bindFramebuffer(k.FRAMEBUFFER,null),W=!1):Ee.__webglFramebuffer===void 0?C.setupRenderTarget(A):Ee.__hasExternalTextures&&C.rebindTextures(A,Fe.get(A.texture).__webglTexture,Fe.get(A.depthTexture).__webglTexture);const Oe=A.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(ge=!0);const Pe=Fe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pe[O])?z=Pe[O][V]:z=Pe[O],le=!0):Re.isWebGL2&&A.samples>0&&C.useMultisampledRTT(A)===!1?z=Fe.get(A).__webglMultisampledFramebuffer:Array.isArray(Pe)?z=Pe[V]:z=Pe,b.copy(A.viewport),L.copy(A.scissor),D=A.scissorTest}else b.copy(j).multiplyScalar(K).floor(),L.copy(Y).multiplyScalar(K).floor(),D=ae;if(pe.bindFramebuffer(k.FRAMEBUFFER,z)&&Re.drawBuffers&&W&&pe.drawBuffers(A,z),pe.viewport(b),pe.scissor(L),pe.setScissorTest(D),le){const Ee=Fe.get(A.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ee.__webglTexture,V)}else if(ge){const Ee=Fe.get(A.texture),Oe=O||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ee.__webglTexture,V||0,Oe)}R=-1},this.readRenderTargetPixels=function(A,O,V,W,z,le,ge){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Fe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se){pe.bindFramebuffer(k.FRAMEBUFFER,Se);try{const Ee=A.texture,Oe=Ee.format,Pe=Ee.type;if(Oe!==Ye&&he.convert(Oe)!==k.getParameter(k.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ie=Pe===Pt&&(_e.has("EXT_color_buffer_half_float")||Re.isWebGL2&&_e.has("EXT_color_buffer_float"));if(Pe!==ui&&he.convert(Pe)!==k.getParameter(k.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Pe===Mt&&(Re.isWebGL2||_e.has("OES_texture_float")||_e.has("WEBGL_color_buffer_float")))&&!Ie){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=A.width-W&&V>=0&&V<=A.height-z&&k.readPixels(O,V,W,z,he.convert(Oe),he.convert(Pe),le)}finally{const Ee=w!==null?Fe.get(w).__webglFramebuffer:null;pe.bindFramebuffer(k.FRAMEBUFFER,Ee)}}},this.copyFramebufferToTexture=function(A,O,V=0){const W=Math.pow(2,-V),z=Math.floor(O.image.width*W),le=Math.floor(O.image.height*W);C.setTexture2D(O,0),k.copyTexSubImage2D(k.TEXTURE_2D,V,0,0,A.x,A.y,z,le),pe.unbindTexture()},this.copyTextureToTexture=function(A,O,V,W=0){const z=O.image.width,le=O.image.height,ge=he.convert(V.format),Se=he.convert(V.type);C.setTexture2D(V,0),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,V.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,V.unpackAlignment),O.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,W,A.x,A.y,z,le,ge,Se,O.image.data):O.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,W,A.x,A.y,O.mipmaps[0].width,O.mipmaps[0].height,ge,O.mipmaps[0].data):k.texSubImage2D(k.TEXTURE_2D,W,A.x,A.y,ge,Se,O.image),W===0&&V.generateMipmaps&&k.generateMipmap(k.TEXTURE_2D),pe.unbindTexture()},this.copyTextureToTexture3D=function(A,O,V,W,z=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const le=A.max.x-A.min.x+1,ge=A.max.y-A.min.y+1,Se=A.max.z-A.min.z+1,Ee=he.convert(W.format),Oe=he.convert(W.type);let Pe;if(W.isData3DTexture)C.setTexture3D(W,0),Pe=k.TEXTURE_3D;else if(W.isDataArrayTexture||W.isCompressedArrayTexture)C.setTexture2DArray(W,0),Pe=k.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,W.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,W.unpackAlignment);const Ie=k.getParameter(k.UNPACK_ROW_LENGTH),ft=k.getParameter(k.UNPACK_IMAGE_HEIGHT),qt=k.getParameter(k.UNPACK_SKIP_PIXELS),bt=k.getParameter(k.UNPACK_SKIP_ROWS),Mi=k.getParameter(k.UNPACK_SKIP_IMAGES),ot=V.isCompressedTexture?V.mipmaps[z]:V.image;k.pixelStorei(k.UNPACK_ROW_LENGTH,ot.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ot.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,A.min.x),k.pixelStorei(k.UNPACK_SKIP_ROWS,A.min.y),k.pixelStorei(k.UNPACK_SKIP_IMAGES,A.min.z),V.isDataTexture||V.isData3DTexture?k.texSubImage3D(Pe,z,O.x,O.y,O.z,le,ge,Se,Ee,Oe,ot.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),k.compressedTexSubImage3D(Pe,z,O.x,O.y,O.z,le,ge,Se,Ee,ot.data)):k.texSubImage3D(Pe,z,O.x,O.y,O.z,le,ge,Se,Ee,Oe,ot),k.pixelStorei(k.UNPACK_ROW_LENGTH,Ie),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ft),k.pixelStorei(k.UNPACK_SKIP_PIXELS,qt),k.pixelStorei(k.UNPACK_SKIP_ROWS,bt),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Mi),z===0&&W.generateMipmaps&&k.generateMipmap(Pe),pe.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?C.setTextureCube(A,0):A.isData3DTexture?C.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?C.setTexture2DArray(A,0):C.setTexture2D(A,0),pe.unbindTexture()},this.resetState=function(){T=0,M=0,w=null,pe.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Fo?"display-p3":"srgb",t.unpackColorSpace=Qe.workingColorSpace===$r?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Et?ln:Pu}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===ln?Et:di}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Zv extends Yv{}Zv.prototype.isWebGL1Renderer=!0;class bi extends ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Jv{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=vo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=hi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,r=this.stride;n<r;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const kt=new P;class qr{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=xi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=xi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=xi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=xi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array),r=Je(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return new st(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new qr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Qv extends Yi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new de(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let En;const hs=new P,An=new P,Rn=new P,Pn=new ce,ds=new ce,Qu=new fe,or=new P,fs=new P,lr=new P,Tc=new ce,Va=new ce,Ec=new ce;class Ny extends ht{constructor(e=new Qv){if(super(),this.isSprite=!0,this.type="Sprite",En===void 0){En=new Tt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Jv(t,5);En.setIndex([0,1,2,0,2,3]),En.setAttribute("position",new qr(i,3,0,!1)),En.setAttribute("uv",new qr(i,2,3,!1))}this.geometry=En,this.material=e,this.center=new ce(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),An.setFromMatrixScale(this.matrixWorld),Qu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Rn.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&An.multiplyScalar(-Rn.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;cr(or.set(-.5,-.5,0),Rn,a,An,n,r),cr(fs.set(.5,-.5,0),Rn,a,An,n,r),cr(lr.set(.5,.5,0),Rn,a,An,n,r),Tc.set(0,0),Va.set(1,0),Ec.set(1,1);let o=e.ray.intersectTriangle(or,fs,lr,!1,hs);if(o===null&&(cr(fs.set(-.5,.5,0),Rn,a,An,n,r),Va.set(0,1),o=e.ray.intersectTriangle(or,lr,fs,!1,hs),o===null))return;const l=e.ray.origin.distanceTo(hs);l<e.near||l>e.far||t.push({distance:l,point:hs.clone(),uv:Rt.getInterpolation(hs,or,fs,lr,Tc,Va,Ec,new ce),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function cr(s,e,t,i,n,r){Pn.subVectors(s,t).addScalar(.5).multiply(i),n!==void 0?(ds.x=r*Pn.x-n*Pn.y,ds.y=n*Pn.x+r*Pn.y):ds.copy(Pn),s.copy(e),s.x+=ds.x,s.y+=ds.y,s.applyMatrix4(Qu)}const Ac=new P,Rc=new We,Pc=new We,$v=new P,Cc=new fe,ur=new P,Ha=new _i,Ic=new fe,Wa=new ea;class Uy extends pt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ul,this.bindMatrix=new fe,this.bindMatrixInverse=new fe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new wt),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,ur),this.boundingBox.expandByPoint(ur)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new _i),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,ur),this.boundingSphere.expandByPoint(ur)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,n=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ha.copy(this.boundingSphere),Ha.applyMatrix4(n),e.ray.intersectsSphere(Ha)!==!1&&(Ic.copy(n).invert(),Wa.copy(e.ray).applyMatrix4(Ic),!(this.boundingBox!==null&&Wa.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Wa)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new We,t=this.geometry.attributes.skinWeight;for(let i=0,n=t.count;i<n;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===ul?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===ld?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,n=this.geometry;Rc.fromBufferAttribute(n.attributes.skinIndex,e),Pc.fromBufferAttribute(n.attributes.skinWeight,e),Ac.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Pc.getComponent(r);if(a!==0){const o=Rc.getComponent(r);Cc.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector($v.copy(Ac).applyMatrix4(Cc),a)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(e,t)}}class e0 extends ht{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ls extends Ut{constructor(e=null,t=1,i=1,n,r,a,o,l,c=Ve,u=Ve,d,h){super(null,a,o,l,c,u,n,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Lc=new fe,t0=new fe;class $u{constructor(e=[],t=[]){this.uuid=hi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,n=this.bones.length;i<n;i++)this.boneInverses.push(new fe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new fe;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,n=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:t0;Lc.multiplyMatrices(o,t[r]),Lc.toArray(i,r*16)}n!==null&&(n.needsUpdate=!0)}clone(){return new $u(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new Ls(t,e,e,Ye,Mt);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,n=e.bones.length;i<n;i++){const r=e.bones[i];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new e0),this.bones.push(a),this.boneInverses.push(new fe().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let n=0,r=t.length;n<r;n++){const a=t[n];e.bones.push(a.uuid);const o=i[n];e.boneInverses.push(o.toArray())}return e}}class Dc extends st{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Cn=new fe,Nc=new fe,hr=[],Uc=new wt,i0=new fe,ps=new pt,ms=new _i;class Fy extends pt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Dc(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,i0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new wt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Cn),Uc.copy(e.boundingBox).applyMatrix4(Cn),this.boundingBox.union(Uc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new _i),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Cn),ms.copy(e.boundingSphere).applyMatrix4(Cn),this.boundingSphere.union(ms)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const i=this.matrixWorld,n=this.count;if(ps.geometry=this.geometry,ps.material=this.material,ps.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ms.copy(this.boundingSphere),ms.applyMatrix4(i),e.ray.intersectsSphere(ms)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,Cn),Nc.multiplyMatrices(i,Cn),ps.matrixWorld=Nc,ps.raycast(e,hr);for(let a=0,o=hr.length;a<o;a++){const l=hr[a];l.instanceId=r,l.object=this,t.push(l)}hr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Dc(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class n0 extends Yi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new de(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Fc=new P,Bc=new P,Oc=new fe,Xa=new ea,dr=new _i;class eh extends ht{constructor(e=new Tt,t=new n0){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let n=1,r=t.count;n<r;n++)Fc.fromBufferAttribute(t,n-1),Bc.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=Fc.distanceTo(Bc);e.setAttribute("lineDistance",new rt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),dr.copy(i.boundingSphere),dr.applyMatrix4(n),dr.radius+=r,e.ray.intersectsSphere(dr)===!1)return;Oc.copy(n).invert(),Xa.copy(e.ray).applyMatrix4(Oc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new P,u=new P,d=new P,h=new P,f=this.isLineSegments?2:1,g=i.index,m=i.attributes.position;if(g!==null){const p=Math.max(0,a.start),y=Math.min(g.count,a.start+a.count);for(let v=p,_=y-1;v<_;v+=f){const T=g.getX(v),M=g.getX(v+1);if(c.fromBufferAttribute(m,T),u.fromBufferAttribute(m,M),Xa.distanceSqToSegment(c,u,h,d)>l)continue;h.applyMatrix4(this.matrixWorld);const R=e.ray.origin.distanceTo(h);R<e.near||R>e.far||t.push({distance:R,point:d.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,a.start),y=Math.min(m.count,a.start+a.count);for(let v=p,_=y-1;v<_;v+=f){if(c.fromBufferAttribute(m,v),u.fromBufferAttribute(m,v+1),Xa.distanceSqToSegment(c,u,h,d)>l)continue;h.applyMatrix4(this.matrixWorld);const M=e.ray.origin.distanceTo(h);M<e.near||M>e.far||t.push({distance:M,point:d.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const kc=new P,zc=new P;class By extends eh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let n=0,r=t.count;n<r;n+=2)kc.fromBufferAttribute(t,n),zc.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+kc.distanceTo(zc);e.setAttribute("lineDistance",new rt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Oy extends eh{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class s0 extends Yi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new de(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Gc=new fe,bo=new ea,fr=new _i,pr=new P;class ky extends ht{constructor(e=new Tt,t=new s0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),fr.copy(i.boundingSphere),fr.applyMatrix4(n),fr.radius+=r,e.ray.intersectsSphere(fr)===!1)return;Gc.copy(n).invert(),bo.copy(e.ray).applyMatrix4(Gc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,d=i.attributes.position;if(c!==null){const h=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=h,x=f;g<x;g++){const m=c.getX(g);pr.fromBufferAttribute(d,m),Vc(pr,m,l,n,e,t,this)}}else{const h=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=h,x=f;g<x;g++)pr.fromBufferAttribute(d,g),Vc(pr,g,l,n,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Vc(s,e,t,i,n,r,a){const o=bo.distanceSqToPoint(s);if(o<t){const l=new P;bo.closestPointToPoint(s,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class zy extends Ut{constructor(e,t,i,n,r,a,o,l,c){super(e,t,i,n,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class th extends Tt{constructor(e=[new ce(0,-.5),new ce(.5,0),new ce(0,.5)],t=12,i=0,n=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=vt(n,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],u=1/t,d=new P,h=new ce,f=new P,g=new P,x=new P;let m=0,p=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-m,f.z=p*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(g)}for(let y=0;y<=t;y++){const v=i+y*u*n,_=Math.sin(v),T=Math.cos(v);for(let M=0;M<=e.length-1;M++){d.x=e[M].x*_,d.y=e[M].y,d.z=e[M].x*T,a.push(d.x,d.y,d.z),h.x=y/t,h.y=M/(e.length-1),o.push(h.x,h.y);const w=l[3*M+0]*_,R=l[3*M+1],S=l[3*M+0]*T;c.push(w,R,S)}}for(let y=0;y<t;y++)for(let v=0;v<e.length-1;v++){const _=v+y*e.length,T=_,M=_+e.length,w=_+e.length+1,R=_+1;r.push(T,M,R),r.push(w,R,M)}this.setIndex(r),this.setAttribute("position",new rt(a,3)),this.setAttribute("uv",new rt(o,2)),this.setAttribute("normal",new rt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new th(e.points,e.segments,e.phiStart,e.phiLength)}}class ih extends Tt{constructor(e=1,t=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),r=Math.floor(r);const u=[],d=[],h=[],f=[];let g=0;const x=[],m=i/2;let p=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new rt(d,3)),this.setAttribute("normal",new rt(h,3)),this.setAttribute("uv",new rt(f,2));function y(){const _=new P,T=new P;let M=0;const w=(t-e)/i;for(let R=0;R<=r;R++){const S=[],b=R/r,L=b*(t-e)+e;for(let D=0;D<=n;D++){const F=D/n,I=F*l+o,U=Math.sin(I),B=Math.cos(I);T.x=L*U,T.y=-b*i+m,T.z=L*B,d.push(T.x,T.y,T.z),_.set(U,w,B).normalize(),h.push(_.x,_.y,_.z),f.push(F,1-b),S.push(g++)}x.push(S)}for(let R=0;R<n;R++)for(let S=0;S<r;S++){const b=x[S][R],L=x[S+1][R],D=x[S+1][R+1],F=x[S][R+1];u.push(b,L,F),u.push(L,D,F),M+=6}c.addGroup(p,M,0),p+=M}function v(_){const T=g,M=new ce,w=new P;let R=0;const S=_===!0?e:t,b=_===!0?1:-1;for(let D=1;D<=n;D++)d.push(0,m*b,0),h.push(0,b,0),f.push(.5,.5),g++;const L=g;for(let D=0;D<=n;D++){const I=D/n*l+o,U=Math.cos(I),B=Math.sin(I);w.x=S*B,w.y=m*b,w.z=S*U,d.push(w.x,w.y,w.z),h.push(0,b,0),M.x=U*.5+.5,M.y=B*.5*b+.5,f.push(M.x,M.y),g++}for(let D=0;D<n;D++){const F=T+D,I=L+D;_===!0?u.push(I,I+1,F):u.push(I+1,I,F),R+=3}c.addGroup(p,R,_===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ih(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class zo extends Tt{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};const r=[],a=[];o(n),c(i),u(),this.setAttribute("position",new rt(r,3)),this.setAttribute("normal",new rt(r.slice(),3)),this.setAttribute("uv",new rt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new P,_=new P,T=new P;for(let M=0;M<t.length;M+=3)f(t[M+0],v),f(t[M+1],_),f(t[M+2],T),l(v,_,T,y)}function l(y,v,_,T){const M=T+1,w=[];for(let R=0;R<=M;R++){w[R]=[];const S=y.clone().lerp(_,R/M),b=v.clone().lerp(_,R/M),L=M-R;for(let D=0;D<=L;D++)D===0&&R===M?w[R][D]=S:w[R][D]=S.clone().lerp(b,D/L)}for(let R=0;R<M;R++)for(let S=0;S<2*(M-R)-1;S++){const b=Math.floor(S/2);S%2===0?(h(w[R][b+1]),h(w[R+1][b]),h(w[R][b])):(h(w[R][b+1]),h(w[R+1][b+1]),h(w[R+1][b]))}}function c(y){const v=new P;for(let _=0;_<r.length;_+=3)v.x=r[_+0],v.y=r[_+1],v.z=r[_+2],v.normalize().multiplyScalar(y),r[_+0]=v.x,r[_+1]=v.y,r[_+2]=v.z}function u(){const y=new P;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];const _=m(y)/2/Math.PI+.5,T=p(y)/Math.PI+.5;a.push(_,1-T)}g(),d()}function d(){for(let y=0;y<a.length;y+=6){const v=a[y+0],_=a[y+2],T=a[y+4],M=Math.max(v,_,T),w=Math.min(v,_,T);M>.9&&w<.1&&(v<.2&&(a[y+0]+=1),_<.2&&(a[y+2]+=1),T<.2&&(a[y+4]+=1))}}function h(y){r.push(y.x,y.y,y.z)}function f(y,v){const _=y*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function g(){const y=new P,v=new P,_=new P,T=new P,M=new ce,w=new ce,R=new ce;for(let S=0,b=0;S<r.length;S+=9,b+=6){y.set(r[S+0],r[S+1],r[S+2]),v.set(r[S+3],r[S+4],r[S+5]),_.set(r[S+6],r[S+7],r[S+8]),M.set(a[b+0],a[b+1]),w.set(a[b+2],a[b+3]),R.set(a[b+4],a[b+5]),T.copy(y).add(v).add(_).divideScalar(3);const L=m(T);x(M,b+0,y,L),x(w,b+2,v,L),x(R,b+4,_,L)}}function x(y,v,_,T){T<0&&y.x===1&&(a[v]=y.x-1),_.x===0&&_.z===0&&(a[v]=T/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zo(e.vertices,e.indices,e.radius,e.details)}}class nh extends zo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new nh(e.radius,e.detail)}}class sh extends Tt{constructor(e=1,t=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],d=new P,h=new P,f=[],g=[],x=[],m=[];for(let p=0;p<=i;p++){const y=[],v=p/i;let _=0;p===0&&a===0?_=.5/t:p===i&&l===Math.PI&&(_=-.5/t);for(let T=0;T<=t;T++){const M=T/t;d.x=-e*Math.cos(n+M*r)*Math.sin(a+v*o),d.y=e*Math.cos(a+v*o),d.z=e*Math.sin(n+M*r)*Math.sin(a+v*o),g.push(d.x,d.y,d.z),h.copy(d).normalize(),x.push(h.x,h.y,h.z),m.push(M+_,1-v),y.push(c++)}u.push(y)}for(let p=0;p<i;p++)for(let y=0;y<t;y++){const v=u[p][y+1],_=u[p][y],T=u[p+1][y],M=u[p+1][y+1];(p!==0||a>0)&&f.push(v,_,M),(p!==i-1||l<Math.PI)&&f.push(_,T,M)}this.setIndex(f),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(x,3)),this.setAttribute("uv",new rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class rh extends Tt{constructor(e=1,t=.4,i=64,n=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:n,p:r,q:a},i=Math.floor(i),n=Math.floor(n);const o=[],l=[],c=[],u=[],d=new P,h=new P,f=new P,g=new P,x=new P,m=new P,p=new P;for(let v=0;v<=i;++v){const _=v/i*r*Math.PI*2;y(_,r,a,e,f),y(_+.01,r,a,e,g),m.subVectors(g,f),p.addVectors(g,f),x.crossVectors(m,p),p.crossVectors(x,m),x.normalize(),p.normalize();for(let T=0;T<=n;++T){const M=T/n*Math.PI*2,w=-t*Math.cos(M),R=t*Math.sin(M);d.x=f.x+(w*p.x+R*x.x),d.y=f.y+(w*p.y+R*x.y),d.z=f.z+(w*p.z+R*x.z),l.push(d.x,d.y,d.z),h.subVectors(d,f).normalize(),c.push(h.x,h.y,h.z),u.push(v/i),u.push(T/n)}}for(let v=1;v<=i;v++)for(let _=1;_<=n;_++){const T=(n+1)*(v-1)+(_-1),M=(n+1)*v+(_-1),w=(n+1)*v+_,R=(n+1)*(v-1)+_;o.push(T,M,R),o.push(M,w,R)}this.setIndex(o),this.setAttribute("position",new rt(l,3)),this.setAttribute("normal",new rt(c,3)),this.setAttribute("uv",new rt(u,2));function y(v,_,T,M,w){const R=Math.cos(v),S=Math.sin(v),b=T/_*v,L=Math.cos(b);w.x=M*(2+L)*.5*R,w.y=M*(2+L)*S*.5,w.z=M*Math.sin(b)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rh(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class r0 extends Yi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new de(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cu,this.normalScale=new ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Gy extends r0{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ce(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return vt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new de(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new de(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new de(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function mr(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function a0(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function o0(s){function e(n,r){return s[n]-s[r]}const t=s.length,i=new Array(t);for(let n=0;n!==t;++n)i[n]=n;return i.sort(e),i}function Hc(s,e,t){const i=s.length,n=new s.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)n[a++]=s[o+l]}return n}function ah(s,e,t,i){let n=1,r=s[0];for(;r!==void 0&&r[i]===void 0;)r=s[n++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push.apply(t,a)),r=s[n++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[n++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=s[n++];while(r!==void 0)}class na{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,n=t[i],r=t[i-1];e:{t:{let a;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=n,n=t[++i],e<n)break t}a=t.length;break i}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=r,r=t[--i-1],e>=r)break t}a=i,i=0;break i}break e}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,n)}return this.interpolate_(i,r,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,r=e*n;for(let a=0;a!==n;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class l0 extends na{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Gn,endingEnd:Gn}}intervalChanged_(e,t,i){const n=this.parameterPositions;let r=e-2,a=e+1,o=n[r],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case Vn:r=e,o=2*t-i;break;case zr:r=n.length-2,o=t+n[r]-n[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Vn:a=e,l=2*i-t;break;case zr:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}const c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(i-t)/(n-t),x=g*g,m=x*g,p=-h*m+2*h*x-h*g,y=(1+h)*m+(-1.5-2*h)*x+(-.5+h)*g+1,v=(-1-f)*m+(1.5+f)*x+.5*g,_=f*m-f*x;for(let T=0;T!==o;++T)r[T]=p*a[u+T]+y*a[c+T]+v*a[l+T]+_*a[d+T];return r}}class oh extends na{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(i-t)/(n-t),d=1-u;for(let h=0;h!==o;++h)r[h]=a[c+h]*d+a[l+h]*u;return r}}class c0 extends na{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}}class Si{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=mr(t,this.TimeBufferType),this.values=mr(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:mr(e.times,Array),values:mr(e.values,Array)};const n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new c0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new oh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new l0(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Or:t=this.InterpolantFactoryMethodDiscrete;break;case kr:t=this.InterpolantFactoryMethodLinear;break;case xa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Or;case this.InterpolantFactoryMethodLinear:return kr;case this.InterpolantFactoryMethodSmooth:return xa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){const i=this.times,n=i.length;let r=0,a=n-1;for(;r!==n&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==n){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,n=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&a0(n))for(let o=0,l=n.length;o!==l;++o){const c=n[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===xa,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(n)l=!0;else{const d=o*i,h=d-i,f=d+i;for(let g=0;g!==i;++g){const x=t[d+g];if(x!==t[h+g]||x!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const d=o*i,h=a*i;for(let f=0;f!==i;++f)t[h+f]=t[d+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,n=new i(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}}Si.prototype.TimeBufferType=Float32Array;Si.prototype.ValueBufferType=Float32Array;Si.prototype.DefaultInterpolation=kr;class ns extends Si{}ns.prototype.ValueTypeName="bool";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Or;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;class lh extends Si{}lh.prototype.ValueTypeName="color";class Kr extends Si{}Kr.prototype.ValueTypeName="number";class u0 extends na{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t);let c=e*o;for(let u=c+o;c!==u;c+=4)yi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Ns extends Si{InterpolantFactoryMethodLinear(e){return new u0(this.times,this.values,this.getValueSize(),e)}}Ns.prototype.ValueTypeName="quaternion";Ns.prototype.DefaultInterpolation=kr;Ns.prototype.InterpolantFactoryMethodSmooth=void 0;class ss extends Si{}ss.prototype.ValueTypeName="string";ss.prototype.ValueBufferType=Array;ss.prototype.DefaultInterpolation=Or;ss.prototype.InterpolantFactoryMethodLinear=void 0;ss.prototype.InterpolantFactoryMethodSmooth=void 0;class jr extends Si{}jr.prototype.ValueTypeName="vector";class Wc{constructor(e,t=-1,i,n=Uo){this.name=e,this.tracks=i,this.duration=t,this.blendMode=n,this.uuid=hi(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,n=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(d0(i[a]).scale(n));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],i=e.tracks,n={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,a=i.length;r!==a;++r)t.push(Si.toJSON(i[r]));return n}static CreateFromMorphTargetSequence(e,t,i,n){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const u=o0(l);l=Hc(l,1,u),c=Hc(c,1,u),!n&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Kr(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const n=e;i=n.geometry&&n.geometry.animations||n.animations}for(let n=0;n<i.length;n++)if(i[n].name===t)return i[n];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const n={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(r);if(u&&u.length>1){const d=u[1];let h=n[d];h||(n[d]=h=[]),h.push(c)}}const a=[];for(const o in n)a.push(this.CreateFromMorphTargetSequence(o,n[o],t,i));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(d,h,f,g,x){if(f.length!==0){const m=[],p=[];ah(f,m,p,g),m.length!==0&&x.push(new d(h,m,p))}},n=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let d=0;d<c.length;d++){const h=c[d].keys;if(!(!h||h.length===0))if(h[0].morphTargets){const f={};let g;for(g=0;g<h.length;g++)if(h[g].morphTargets)for(let x=0;x<h[g].morphTargets.length;x++)f[h[g].morphTargets[x]]=-1;for(const x in f){const m=[],p=[];for(let y=0;y!==h[g].morphTargets.length;++y){const v=h[g];m.push(v.time),p.push(v.morphTarget===x?1:0)}n.push(new Kr(".morphTargetInfluence["+x+"]",m,p))}l=f.length*a}else{const f=".bones["+t[d].name+"]";i(jr,f+".position",h,"pos",n),i(Ns,f+".quaternion",h,"rot",n),i(jr,f+".scale",h,"scl",n)}}return n.length===0?null:new this(r,l,n,o)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,n=e.length;i!==n;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function h0(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Kr;case"vector":case"vector2":case"vector3":case"vector4":return jr;case"color":return lh;case"quaternion":return Ns;case"bool":case"boolean":return ns;case"string":return ss}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function d0(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=h0(s.type);if(s.times===void 0){const t=[],i=[];ah(s.keys,t,i,"value"),s.times=t,s.values=i}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const Hi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class f0{constructor(e,t,i){const n=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(u){o++,r===!1&&n.onStart!==void 0&&n.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,n.onProgress!==void 0&&n.onProgress(u,a,o),a===o&&(r=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(u){n.onError!==void 0&&n.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){const d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){const f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null}}}const p0=new f0;class Us{constructor(e){this.manager=e!==void 0?e:p0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(n,r){i.load(e,n,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Us.DEFAULT_MATERIAL_NAME="__DEFAULT";const Pi={};class m0 extends Error{constructor(e,t){super(e),this.response=t}}class Vy extends Us{constructor(e){super(e)}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Hi.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Pi[e]!==void 0){Pi[e].push({onLoad:t,onProgress:i,onError:n});return}Pi[e]=[],Pi[e].push({onLoad:t,onProgress:i,onError:n});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Pi[e],d=c.body.getReader(),h=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),f=h?parseInt(h):0,g=f!==0;let x=0;const m=new ReadableStream({start(p){y();function y(){d.read().then(({done:v,value:_})=>{if(v)p.close();else{x+=_.byteLength;const T=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:f});for(let M=0,w=u.length;M<w;M++){const R=u[M];R.onProgress&&R.onProgress(T)}p.enqueue(_),y()}})}}});return new Response(m)}else throw new m0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o===void 0)return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Hi.add(e,c);const u=Pi[e];delete Pi[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{const u=Pi[e];if(u===void 0)throw this.manager.itemError(e),c;delete Pi[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class g0 extends Us{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Hi.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=Is("img");function l(){u(),Hi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(d){u(),n&&n(d),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class Hy extends Us{constructor(e){super(e)}load(e,t,i,n){const r=new Ut,a=new g0(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,n),r}}class Go extends ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new de(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const qa=new fe,Xc=new P,qc=new P;class Vo{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ce(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oo,this._frameExtents=new ce(1,1),this._viewportCount=1,this._viewports=[new We(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Xc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xc),qc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qc),t.updateMatrixWorld(),qa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qa),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(qa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class v0 extends Vo{constructor(){super(new Yt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=Qn*2*e.angle*this.focus,n=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(i!==t.fov||n!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=n,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Wy extends Go{constructor(e,t,i=0,n=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.distance=i,this.angle=n,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new v0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Kc=new fe,gs=new P,Ka=new P;class x0 extends Vo{constructor(){super(new Yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ce(4,2),this._viewportCount=6,this._viewports=[new We(2,1,1,1),new We(0,1,1,1),new We(3,1,1,1),new We(1,1,1,1),new We(3,0,1,1),new We(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,n=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),gs.setFromMatrixPosition(e.matrixWorld),i.position.copy(gs),Ka.copy(i.position),Ka.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ka),i.updateMatrixWorld(),n.makeTranslation(-gs.x,-gs.y,-gs.z),Kc.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kc)}}class Xy extends Go{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new x0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class y0 extends Vo{constructor(){super(new ri(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qy extends Go{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.shadow=new y0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ky{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,n=e.length;i<n;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class jy extends Us{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Hi.get(e);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),r.manager.itemEnd(e)}).catch(c=>{n&&n(c)});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Hi.add(e,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){n&&n(c),Hi.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});Hi.add(e,l),r.manager.itemStart(e)}}class _0{constructor(e,t,i){this.binding=e,this.valueSize=i;let n,r,a;switch(t){case"quaternion":n=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":n=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:n=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=n,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,n=this.valueSize,r=e*n+n;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==n;++o)i[r+o]=i[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(i,r,0,o,n)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,n=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,n,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,n=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(i,n,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(i,n,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,n);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,n=i*this._origIndex;e.getValue(t,n);for(let r=i,a=n;r!==a;++r)t[r]=t[n+r%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,n,r){if(n>=.5)for(let a=0;a!==r;++a)e[t+a]=e[i+a]}_slerp(e,t,i,n){yi.slerpFlat(e,t,e,t,e,i,n)}_slerpAdditive(e,t,i,n,r){const a=this._workIndex*r;yi.multiplyQuaternionsFlat(e,a,e,t,e,i),yi.slerpFlat(e,t,e,t,e,a,n)}_lerp(e,t,i,n,r){const a=1-n;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[i+o]*n}}_lerpAdditive(e,t,i,n,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[i+a]*n}}}const Ho="\\[\\]\\.:\\/",b0=new RegExp("["+Ho+"]","g"),Wo="[^"+Ho+"]",S0="[^"+Ho.replace("\\.","")+"]",M0=/((?:WC+[\/:])*)/.source.replace("WC",Wo),w0=/(WCOD+)?/.source.replace("WCOD",S0),T0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Wo),E0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Wo),A0=new RegExp("^"+M0+w0+T0+E0+"$"),R0=["material","materials","bones","map"];class P0{constructor(e,t,i){const n=i||je.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,n)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,r=i.length;n!==r;++n)i[n].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class je{constructor(e,t,i){this.path=t,this.parsedPath=i||je.parseTrackName(t),this.node=je.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new je.Composite(e,t,i):new je(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(b0,"")}static parseTrackName(e){const t=A0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){const r=i.nodeName.substring(n+1);R0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,n=t.propertyName;let r=t.propertyIndex;if(e||(e=je.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[n];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}je.Composite=P0;je.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};je.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};je.prototype.GetterByBindingType=[je.prototype._getValue_direct,je.prototype._getValue_array,je.prototype._getValue_arrayElement,je.prototype._getValue_toArray];je.prototype.SetterByBindingTypeAndVersioning=[[je.prototype._setValue_direct,je.prototype._setValue_direct_setNeedsUpdate,je.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[je.prototype._setValue_array,je.prototype._setValue_array_setNeedsUpdate,je.prototype._setValue_array_setMatrixWorldNeedsUpdate],[je.prototype._setValue_arrayElement,je.prototype._setValue_arrayElement_setNeedsUpdate,je.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[je.prototype._setValue_fromArray,je.prototype._setValue_fromArray_setNeedsUpdate,je.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class C0{constructor(e,t,i=null,n=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=n;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:Gn,endingEnd:Gn};for(let c=0;c!==a;++c){const u=r[c].createInterpolant(null);o[c]=u,u.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=md,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i){if(e.fadeOut(t),this.fadeIn(t),i){const n=this._clip.duration,r=e._clip.duration,a=r/n,o=n/r;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const n=this._mixer,r=n.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=n._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,n){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case vd:for(let u=0,d=l.length;u!==d;++u)l[u].evaluate(a),c[u].accumulateAdditive(o);break;case Uo:default:for(let u=0,d=l.length;u!==d;++u)l[u].evaluate(a),c[u].accumulate(n,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopFading(),n===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let n=this.time+e,r=this._loopCount;const a=i===gd;if(e===0)return r===-1?n:a&&(r&1)===1?t-n:n;if(i===pd){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(n>=t)n=t;else if(n<0)n=0;else{this.time=n;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),n>=t||n<0){const o=Math.floor(n/t);n-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,n=e>0?t:0,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=n,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=n;if(a&&(r&1)===1)return t-n}return n}_setEndings(e,t,i){const n=this._interpolantSettings;i?(n.endingStart=Vn,n.endingEnd=Vn):(e?n.endingStart=this.zeroSlopeAtStart?Vn:Gn:n.endingStart=zr,t?n.endingEnd=this.zeroSlopeAtEnd?Vn:Gn:n.endingEnd=zr)}_scheduleFading(e,t,i){const n=this._mixer,r=n.time;let a=this._weightInterpolant;a===null&&(a=n._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=i,this}}const I0=new Float32Array(1);class Yy extends cn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const i=e._localRoot||this._root,n=e._clip.tracks,r=n.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let u=c[l];u===void 0&&(u={},c[l]=u);for(let d=0;d!==r;++d){const h=n[d],f=h.name;let g=u[f];if(g!==void 0)++g.referenceCount,a[d]=g;else{if(g=a[d],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,f));continue}const x=t&&t._propertyBindings[d].binding.parsedPath;g=new _0(je.create(i,f,x),h.ValueTypeName,h.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,f),a[d]=g}o[d].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,n=e._clip.uuid,r=this._actionsByClip[n];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,n,i)}const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const n=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=n.length,n.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],n=e._cacheIndex;i._cacheIndex=n,t[n]=i,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,l[u]=c,l.pop(),e._byClipCacheIndex=null;const d=o.actionByRoot,h=(e._localRoot||this._root).uuid;delete d[h],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,n=this._nActiveActions++,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,n=--this._nActiveActions,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_addInactiveBinding(e,t,i){const n=this._bindingsByRootAndName,r=this._bindings;let a=n[t];a===void 0&&(a={},n[t]=a),a[i]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,n=i.rootNode.uuid,r=i.path,a=this._bindingsByRootAndName,o=a[n],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[n]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,n=this._nActiveBindings++,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,n=--this._nActiveBindings,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new oh(new Float32Array(2),new Float32Array(2),1,I0),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,n=--this._nActiveControlInterpolants,r=t[n];e.__cacheIndex=n,t[n]=e,r.__cacheIndex=i,t[i]=r}clipAction(e,t,i){const n=t||this._root,r=n.uuid;let a=typeof e=="string"?Wc.findByName(n,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=Uo),l!==void 0){const d=l.actionByRoot[r];if(d!==void 0&&d.blendMode===i)return d;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const u=new C0(this,a,t,i);return this._bindAction(u,c),this._addInactiveAction(u,o,r),u}existingAction(e,t){const i=t||this._root,n=i.uuid,r=typeof e=="string"?Wc.findByName(i,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[n]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,n=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(n,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,n=this._actionsByClip,r=n[i];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const u=c._cacheIndex,d=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,d._cacheIndex=u,t[u]=d,t.pop(),this._removeInactiveBindingsForAction(c)}delete n[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const n=this._bindingsByRootAndName,r=n[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}class Zy{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(vt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const jc=new P,gr=new P;class Ni{constructor(e=new P,t=new P){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){jc.subVectors(e,this.start),gr.subVectors(this.end,this.start);const i=gr.dot(gr);let r=gr.dot(jc)/i;return t&&(r=vt(r,0,1)),r}closestPointToPoint(e,t,i){const n=this.closestPointToPointParameter(e,t);return this.delta(i).multiplyScalar(n).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Do}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Do);function L0(s,e=!1){const t=s[0].index!==null,i=new Set(Object.keys(s[0].attributes)),n=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new Tt;let c=0;for(let u=0;u<s.length;++u){const d=s[u];let h=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in d.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),h++}if(h!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in d.morphAttributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0;const d=[];for(let h=0;h<s.length;++h){const f=s[h].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+u);u+=s[h].attributes.position.count}l.setIndex(d)}for(const u in r){const d=Yc(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,d)}for(const u in a){const d=a[u][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let h=0;h<d;++h){const f=[];for(let x=0;x<a[u].length;++x)f.push(a[u][x][h]);const g=Yc(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(g)}}return l}function Yc(s){let e,t,i,n=-1,r=0;for(let c=0;c<s.length;++c){const u=s[c];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=u.gpuType),n!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}const a=new e(r);let o=0;for(let c=0;c<s.length;++c)a.set(s[c].array,o),o+=s[c].array.length;const l=new st(a,t,i);return n!==void 0&&(l.gpuType=n),l}function Jy(s,e){if(e===xd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Bl||e===yd){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const i=t.count-2,n=[];if(e===Bl)for(let a=1;a<=i;a++)n.push(t.getX(0)),n.push(t.getX(a)),n.push(t.getX(a+1));else for(let a=0;a<i;a++)a%2===0?(n.push(t.getX(a)),n.push(t.getX(a+1)),n.push(t.getX(a+2))):(n.push(t.getX(a+2)),n.push(t.getX(a+1)),n.push(t.getX(a)));n.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(n),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}const sa=0,D0=1,ch=2,Zc=2,ja=1.25,Jc=1,Ki=6*4+4+4,ra=65535,N0=Math.pow(2,-24),Ya=Symbol("SKIP_GENERATION");function uh(s){return s.index?s.index.count:s.attributes.position.count}function rs(s){return uh(s)/3}function hh(s,e=ArrayBuffer){return s>65535?new Uint32Array(new e(4*s)):new Uint16Array(new e(2*s))}function U0(s,e){if(!s.index){const t=s.attributes.position.count,i=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=hh(t,i);s.setIndex(new st(n,1));for(let r=0;r<t;r++)n[r]=r}}function dh(s,e){const t=rs(s),i=e||s.drawRange,n=i.start/3,r=(i.start+i.count)/3,a=Math.max(0,n),o=Math.min(t,r)-a;return[{offset:Math.floor(a),count:Math.floor(o)}]}function fh(s,e){if(!s.groups||!s.groups.length)return dh(s,e);const t=[],i=new Set,n=e||s.drawRange,r=n.start/3,a=(n.start+n.count)/3;for(const l of s.groups){const c=l.start/3,u=(l.start+l.count)/3;i.add(Math.max(r,c)),i.add(Math.min(a,u))}const o=Array.from(i.values()).sort((l,c)=>l-c);for(let l=0;l<o.length-1;l++){const c=o[l],u=o[l+1];t.push({offset:Math.floor(c),count:Math.floor(u-c)})}return t}function F0(s,e){const t=rs(s),i=fh(s,e).sort((a,o)=>a.offset-o.offset),n=i[i.length-1];n.count=Math.min(t-n.offset,n.count);let r=0;return i.forEach(({count:a})=>r+=a),t!==r}function Za(s,e,t,i,n){let r=1/0,a=1/0,o=1/0,l=-1/0,c=-1/0,u=-1/0,d=1/0,h=1/0,f=1/0,g=-1/0,x=-1/0,m=-1/0;for(let p=e*6,y=(e+t)*6;p<y;p+=6){const v=s[p+0],_=s[p+1],T=v-_,M=v+_;T<r&&(r=T),M>l&&(l=M),v<d&&(d=v),v>g&&(g=v);const w=s[p+2],R=s[p+3],S=w-R,b=w+R;S<a&&(a=S),b>c&&(c=b),w<h&&(h=w),w>x&&(x=w);const L=s[p+4],D=s[p+5],F=L-D,I=L+D;F<o&&(o=F),I>u&&(u=I),L<f&&(f=L),L>m&&(m=L)}i[0]=r,i[1]=a,i[2]=o,i[3]=l,i[4]=c,i[5]=u,n[0]=d,n[1]=h,n[2]=f,n[3]=g,n[4]=x,n[5]=m}function B0(s,e=null,t=null,i=null){const n=s.attributes.position,r=s.index?s.index.array:null,a=rs(s),o=n.normalized;let l;e===null?(l=new Float32Array(a*6*4),t=0,i=a):(l=e,t=t||0,i=i||a);const c=n.array,u=n.offset||0;let d=3;n.isInterleavedBufferAttribute&&(d=n.data.stride);const h=["getX","getY","getZ"];for(let f=t;f<t+i;f++){const g=f*3,x=f*6;let m=g+0,p=g+1,y=g+2;r&&(m=r[m],p=r[p],y=r[y]),o||(m=m*d+u,p=p*d+u,y=y*d+u);for(let v=0;v<3;v++){let _,T,M;o?(_=n[h[v]](m),T=n[h[v]](p),M=n[h[v]](y)):(_=c[m+v],T=c[p+v],M=c[y+v]);let w=_;T<w&&(w=T),M<w&&(w=M);let R=_;T>R&&(R=T),M>R&&(R=M);const S=(R-w)/2,b=v*2;l[x+b+0]=w+S,l[x+b+1]=S+(Math.abs(w)+S)*N0}}return l}function ut(s,e,t){return t.min.x=e[s],t.min.y=e[s+1],t.min.z=e[s+2],t.max.x=e[s+3],t.max.y=e[s+4],t.max.z=e[s+5],t}function Qc(s){let e=-1,t=-1/0;for(let i=0;i<3;i++){const n=s[i+3]-s[i];n>t&&(t=n,e=i)}return e}function $c(s,e){e.set(s)}function eu(s,e,t){let i,n;for(let r=0;r<3;r++){const a=r+3;i=s[r],n=e[r],t[r]=i<n?i:n,i=s[a],n=e[a],t[a]=i>n?i:n}}function vr(s,e,t){for(let i=0;i<3;i++){const n=e[s+2*i],r=e[s+2*i+1],a=n-r,o=n+r;a<t[i]&&(t[i]=a),o>t[i+3]&&(t[i+3]=o)}}function vs(s){const e=s[3]-s[0],t=s[4]-s[1],i=s[5]-s[2];return 2*(e*t+t*i+i*e)}const Ii=32,O0=(s,e)=>s.candidate-e.candidate,Gi=new Array(Ii).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),xr=new Float32Array(6);function k0(s,e,t,i,n,r){let a=-1,o=0;if(r===sa)a=Qc(e),a!==-1&&(o=(e[a]+e[a+3])/2);else if(r===D0)a=Qc(s),a!==-1&&(o=z0(t,i,n,a));else if(r===ch){const l=vs(s);let c=ja*n;const u=i*6,d=(i+n)*6;for(let h=0;h<3;h++){const f=e[h],m=(e[h+3]-f)/Ii;if(n<Ii/4){const p=[...Gi];p.length=n;let y=0;for(let _=u;_<d;_+=6,y++){const T=p[y];T.candidate=t[_+2*h],T.count=0;const{bounds:M,leftCacheBounds:w,rightCacheBounds:R}=T;for(let S=0;S<3;S++)R[S]=1/0,R[S+3]=-1/0,w[S]=1/0,w[S+3]=-1/0,M[S]=1/0,M[S+3]=-1/0;vr(_,t,M)}p.sort(O0);let v=n;for(let _=0;_<v;_++){const T=p[_];for(;_+1<v&&p[_+1].candidate===T.candidate;)p.splice(_+1,1),v--}for(let _=u;_<d;_+=6){const T=t[_+2*h];for(let M=0;M<v;M++){const w=p[M];T>=w.candidate?vr(_,t,w.rightCacheBounds):(vr(_,t,w.leftCacheBounds),w.count++)}}for(let _=0;_<v;_++){const T=p[_],M=T.count,w=n-T.count,R=T.leftCacheBounds,S=T.rightCacheBounds;let b=0;M!==0&&(b=vs(R)/l);let L=0;w!==0&&(L=vs(S)/l);const D=Jc+ja*(b*M+L*w);D<c&&(a=h,c=D,o=T.candidate)}}else{for(let v=0;v<Ii;v++){const _=Gi[v];_.count=0,_.candidate=f+m+v*m;const T=_.bounds;for(let M=0;M<3;M++)T[M]=1/0,T[M+3]=-1/0}for(let v=u;v<d;v+=6){let M=~~((t[v+2*h]-f)/m);M>=Ii&&(M=Ii-1);const w=Gi[M];w.count++,vr(v,t,w.bounds)}const p=Gi[Ii-1];$c(p.bounds,p.rightCacheBounds);for(let v=Ii-2;v>=0;v--){const _=Gi[v],T=Gi[v+1];eu(_.bounds,T.rightCacheBounds,_.rightCacheBounds)}let y=0;for(let v=0;v<Ii-1;v++){const _=Gi[v],T=_.count,M=_.bounds,R=Gi[v+1].rightCacheBounds;T!==0&&(y===0?$c(M,xr):eu(M,xr,xr)),y+=T;let S=0,b=0;y!==0&&(S=vs(xr)/l);const L=n-y;L!==0&&(b=vs(R)/l);const D=Jc+ja*(S*y+b*L);D<c&&(a=h,c=D,o=_.candidate)}}}}else console.warn(`MeshBVH: Invalid build strategy value ${r} used.`);return{axis:a,pos:o}}function z0(s,e,t,i){let n=0;for(let r=e,a=e+t;r<a;r++)n+=s[r*6+i*2];return n/t}class Ja{constructor(){this.boundingData=new Float32Array(6)}}function G0(s,e,t,i,n,r){let a=i,o=i+n-1;const l=r.pos,c=r.axis*2;for(;;){for(;a<=o&&t[a*6+c]<l;)a++;for(;a<=o&&t[o*6+c]>=l;)o--;if(a<o){for(let u=0;u<3;u++){let d=e[a*3+u];e[a*3+u]=e[o*3+u],e[o*3+u]=d}for(let u=0;u<6;u++){let d=t[a*6+u];t[a*6+u]=t[o*6+u],t[o*6+u]=d}a++,o--}else return a}}function V0(s,e,t,i,n,r){let a=i,o=i+n-1;const l=r.pos,c=r.axis*2;for(;;){for(;a<=o&&t[a*6+c]<l;)a++;for(;a<=o&&t[o*6+c]>=l;)o--;if(a<o){let u=s[a];s[a]=s[o],s[o]=u;for(let d=0;d<6;d++){let h=t[a*6+d];t[a*6+d]=t[o*6+d],t[o*6+d]=h}a++,o--}else return a}}function Gt(s,e){return e[s+15]===65535}function Xt(s,e){return e[s+6]}function Jt(s,e){return e[s+14]}function ii(s){return s+8}function Qt(s,e){return e[s+6]}function Xo(s,e){return e[s+7]}let ph,Ms,Fr,mh;const H0=Math.pow(2,32);function So(s){return"count"in s?1:1+So(s.left)+So(s.right)}function W0(s,e,t){return ph=new Float32Array(t),Ms=new Uint32Array(t),Fr=new Uint16Array(t),mh=new Uint8Array(t),Mo(s,e)}function Mo(s,e){const t=s/4,i=s/2,n="count"in e,r=e.boundingData;for(let a=0;a<6;a++)ph[t+a]=r[a];if(n)if(e.buffer){const a=e.buffer;mh.set(new Uint8Array(a),s);for(let o=s,l=s+a.byteLength;o<l;o+=Ki){const c=o/2;Gt(c,Fr)||(Ms[o/4+6]+=t)}return s+a.byteLength}else{const a=e.offset,o=e.count;return Ms[t+6]=a,Fr[i+14]=o,Fr[i+15]=ra,s+Ki}else{const a=e.left,o=e.right,l=e.splitAxis;let c;if(c=Mo(s+Ki,a),c/4>H0)throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");return Ms[t+6]=c/4,c=Mo(c,o),Ms[t+7]=l,c}}function X0(s,e){const t=(s.index?s.index.count:s.attributes.position.count)/3,i=t>2**16,n=i?4:2,r=e?new SharedArrayBuffer(t*n):new ArrayBuffer(t*n),a=i?new Uint32Array(r):new Uint16Array(r);for(let o=0,l=a.length;o<l;o++)a[o]=o;return a}function q0(s,e,t,i,n){const{maxDepth:r,verbose:a,maxLeafTris:o,strategy:l,onProgress:c,indirect:u}=n,d=s._indirectBuffer,h=s.geometry,f=h.index?h.index.array:null,g=u?V0:G0,x=rs(h),m=new Float32Array(6);let p=!1;const y=new Ja;return Za(e,t,i,y.boundingData,m),_(y,t,i,m),y;function v(T){c&&c(T/x)}function _(T,M,w,R=null,S=0){if(!p&&S>=r&&(p=!0,a&&(console.warn(`MeshBVH: Max depth of ${r} reached when generating BVH. Consider increasing maxDepth.`),console.warn(h))),w<=o||S>=r)return v(M+w),T.offset=M,T.count=w,T;const b=k0(T.boundingData,R,e,M,w,l);if(b.axis===-1)return v(M+w),T.offset=M,T.count=w,T;const L=g(d,f,e,M,w,b);if(L===M||L===M+w)v(M+w),T.offset=M,T.count=w;else{T.splitAxis=b.axis;const D=new Ja,F=M,I=L-M;T.left=D,Za(e,F,I,D.boundingData,m),_(D,F,I,m,S+1);const U=new Ja,B=L,K=w-I;T.right=U,Za(e,B,K,U.boundingData,m),_(U,B,K,m,S+1)}return T}}function K0(s,e){const t=s.geometry;e.indirect&&(s._indirectBuffer=X0(t,e.useSharedArrayBuffer),F0(t,e.range)&&!e.verbose&&console.warn('MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),s._indirectBuffer||U0(t,e);const i=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=B0(t),r=e.indirect?dh(t,e.range):fh(t,e.range);s._roots=r.map(a=>{const o=q0(s,n,a.offset,a.count,e),l=So(o),c=new i(Ki*l);return W0(0,o,c),c})}class Ui{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let i=1/0,n=-1/0;for(let r=0,a=e.length;r<a;r++){const l=e[r][t];i=l<i?l:i,n=l>n?l:n}this.min=i,this.max=n}setFromPoints(e,t){let i=1/0,n=-1/0;for(let r=0,a=t.length;r<a;r++){const o=t[r],l=e.dot(o);i=l<i?l:i,n=l>n?l:n}this.min=i,this.max=n}isSeparated(e){return this.min>e.max||e.min>this.max}}Ui.prototype.setFromBox=function(){const s=new P;return function(t,i){const n=i.min,r=i.max;let a=1/0,o=-1/0;for(let l=0;l<=1;l++)for(let c=0;c<=1;c++)for(let u=0;u<=1;u++){s.x=n.x*l+r.x*(1-l),s.y=n.y*c+r.y*(1-c),s.z=n.z*u+r.z*(1-u);const d=t.dot(s);a=Math.min(d,a),o=Math.max(d,o)}this.min=a,this.max=o}}();const j0=function(){const s=new P,e=new P,t=new P;return function(n,r,a){const o=n.start,l=s,c=r.start,u=e;t.subVectors(o,c),s.subVectors(n.end,n.start),e.subVectors(r.end,r.start);const d=t.dot(u),h=u.dot(l),f=u.dot(u),g=t.dot(l),m=l.dot(l)*f-h*h;let p,y;m!==0?p=(d*h-g*f)/m:p=0,y=(d+p*h)/f,a.x=p,a.y=y}}(),qo=function(){const s=new ce,e=new P,t=new P;return function(n,r,a,o){j0(n,r,s);let l=s.x,c=s.y;if(l>=0&&l<=1&&c>=0&&c<=1){n.at(l,a),r.at(c,o);return}else if(l>=0&&l<=1){c<0?r.at(0,o):r.at(1,o),n.closestPointToPoint(o,!0,a);return}else if(c>=0&&c<=1){l<0?n.at(0,a):n.at(1,a),r.closestPointToPoint(a,!0,o);return}else{let u;l<0?u=n.start:u=n.end;let d;c<0?d=r.start:d=r.end;const h=e,f=t;if(n.closestPointToPoint(d,!0,e),r.closestPointToPoint(u,!0,t),h.distanceToSquared(d)<=f.distanceToSquared(u)){a.copy(h),o.copy(d);return}else{a.copy(u),o.copy(f);return}}}}(),Y0=function(){const s=new P,e=new P,t=new Li,i=new Ni;return function(r,a){const{radius:o,center:l}=r,{a:c,b:u,c:d}=a;if(i.start=c,i.end=u,i.closestPointToPoint(l,!0,s).distanceTo(l)<=o||(i.start=c,i.end=d,i.closestPointToPoint(l,!0,s).distanceTo(l)<=o)||(i.start=u,i.end=d,i.closestPointToPoint(l,!0,s).distanceTo(l)<=o))return!0;const x=a.getPlane(t);if(Math.abs(x.distanceToPoint(l))<=o){const p=x.projectPoint(l,e);if(a.containsPoint(p))return!0}return!1}}(),Z0=1e-15;function Qa(s){return Math.abs(s)<Z0}class fi extends Rt{constructor(...e){super(...e),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new P),this.satBounds=new Array(4).fill().map(()=>new Ui),this.points=[this.a,this.b,this.c],this.sphere=new _i,this.plane=new Li,this.needsUpdate=!0}intersectsSphere(e){return Y0(e,this)}update(){const e=this.a,t=this.b,i=this.c,n=this.points,r=this.satAxes,a=this.satBounds,o=r[0],l=a[0];this.getNormal(o),l.setFromPoints(o,n);const c=r[1],u=a[1];c.subVectors(e,t),u.setFromPoints(c,n);const d=r[2],h=a[2];d.subVectors(t,i),h.setFromPoints(d,n);const f=r[3],g=a[3];f.subVectors(i,e),g.setFromPoints(f,n),this.sphere.setFromPoints(this.points),this.plane.setFromNormalAndCoplanarPoint(o,e),this.needsUpdate=!1}}fi.prototype.closestPointToSegment=function(){const s=new P,e=new P,t=new Ni;return function(n,r=null,a=null){const{start:o,end:l}=n,c=this.points;let u,d=1/0;for(let h=0;h<3;h++){const f=(h+1)%3;t.start.copy(c[h]),t.end.copy(c[f]),qo(t,n,s,e),u=s.distanceToSquared(e),u<d&&(d=u,r&&r.copy(s),a&&a.copy(e))}return this.closestPointToPoint(o,s),u=o.distanceToSquared(s),u<d&&(d=u,r&&r.copy(s),a&&a.copy(o)),this.closestPointToPoint(l,s),u=l.distanceToSquared(s),u<d&&(d=u,r&&r.copy(s),a&&a.copy(l)),Math.sqrt(d)}}();fi.prototype.intersectsTriangle=function(){const s=new fi,e=new Array(3),t=new Array(3),i=new Ui,n=new Ui,r=new P,a=new P,o=new P,l=new P,c=new P,u=new Ni,d=new Ni,h=new Ni,f=new P;function g(x,m,p){const y=x.points;let v=0,_=-1;for(let T=0;T<3;T++){const{start:M,end:w}=u;M.copy(y[T]),w.copy(y[(T+1)%3]),u.delta(a);const R=Qa(m.distanceToPoint(M));if(Qa(m.normal.dot(a))&&R){p.copy(u),v=2;break}const S=m.intersectLine(u,f);if(!S&&R&&f.copy(M),(S||R)&&!Qa(f.distanceTo(w))){if(v<=1)(v===1?p.start:p.end).copy(f),R&&(_=v);else if(v>=2){(_===1?p.start:p.end).copy(f),v=2;break}if(v++,v===2&&_===-1)break}}return v}return function(m,p=null,y=!1){this.needsUpdate&&this.update(),m.isExtendedTriangle?m.needsUpdate&&m.update():(s.copy(m),s.update(),m=s);const v=this.plane,_=m.plane;if(Math.abs(v.normal.dot(_.normal))>1-1e-10){const T=this.satBounds,M=this.satAxes;t[0]=m.a,t[1]=m.b,t[2]=m.c;for(let S=0;S<4;S++){const b=T[S],L=M[S];if(i.setFromPoints(L,t),b.isSeparated(i))return!1}const w=m.satBounds,R=m.satAxes;e[0]=this.a,e[1]=this.b,e[2]=this.c;for(let S=0;S<4;S++){const b=w[S],L=R[S];if(i.setFromPoints(L,e),b.isSeparated(i))return!1}for(let S=0;S<4;S++){const b=M[S];for(let L=0;L<4;L++){const D=R[L];if(r.crossVectors(b,D),i.setFromPoints(r,e),n.setFromPoints(r,t),i.isSeparated(n))return!1}}return p&&(y||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),p.start.set(0,0,0),p.end.set(0,0,0)),!0}else{const T=g(this,_,d);if(T===1&&m.containsPoint(d.end))return p&&(p.start.copy(d.end),p.end.copy(d.end)),!0;if(T!==2)return!1;const M=g(m,v,h);if(M===1&&this.containsPoint(h.end))return p&&(p.start.copy(h.end),p.end.copy(h.end)),!0;if(M!==2)return!1;if(d.delta(o),h.delta(l),o.dot(l)<0){let F=h.start;h.start=h.end,h.end=F}const w=d.start.dot(o),R=d.end.dot(o),S=h.start.dot(o),b=h.end.dot(o),L=R<S,D=w<b;return w!==b&&S!==R&&L===D?!1:(p&&(c.subVectors(d.start,h.start),c.dot(o)>0?p.start.copy(d.start):p.start.copy(h.start),c.subVectors(d.end,h.end),c.dot(o)<0?p.end.copy(d.end):p.end.copy(h.end)),!0)}}}();fi.prototype.distanceToPoint=function(){const s=new P;return function(t){return this.closestPointToPoint(t,s),t.distanceTo(s)}}();fi.prototype.distanceToTriangle=function(){const s=new P,e=new P,t=["a","b","c"],i=new Ni,n=new Ni;return function(a,o=null,l=null){const c=o||l?i:null;if(this.intersectsTriangle(a,c))return(o||l)&&(o&&c.getCenter(o),l&&c.getCenter(l)),0;let u=1/0;for(let d=0;d<3;d++){let h;const f=t[d],g=a[f];this.closestPointToPoint(g,s),h=g.distanceToSquared(s),h<u&&(u=h,o&&o.copy(s),l&&l.copy(g));const x=this[f];a.closestPointToPoint(x,s),h=x.distanceToSquared(s),h<u&&(u=h,o&&o.copy(x),l&&l.copy(s))}for(let d=0;d<3;d++){const h=t[d],f=t[(d+1)%3];i.set(this[h],this[f]);for(let g=0;g<3;g++){const x=t[g],m=t[(g+1)%3];n.set(a[x],a[m]),qo(i,n,s,e);const p=s.distanceToSquared(e);p<u&&(u=p,o&&o.copy(s),l&&l.copy(e))}}return Math.sqrt(u)}}();class Ht{constructor(e,t,i){this.isOrientedBox=!0,this.min=new P,this.max=new P,this.matrix=new fe,this.invMatrix=new fe,this.points=new Array(8).fill().map(()=>new P),this.satAxes=new Array(3).fill().map(()=>new P),this.satBounds=new Array(3).fill().map(()=>new Ui),this.alignedSatBounds=new Array(3).fill().map(()=>new Ui),this.needsUpdate=!1,e&&this.min.copy(e),t&&this.max.copy(t),i&&this.matrix.copy(i)}set(e,t,i){this.min.copy(e),this.max.copy(t),this.matrix.copy(i),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}}Ht.prototype.update=function(){return function(){const e=this.matrix,t=this.min,i=this.max,n=this.points;for(let c=0;c<=1;c++)for(let u=0;u<=1;u++)for(let d=0;d<=1;d++){const h=1*c|2*u|4*d,f=n[h];f.x=c?i.x:t.x,f.y=u?i.y:t.y,f.z=d?i.z:t.z,f.applyMatrix4(e)}const r=this.satBounds,a=this.satAxes,o=n[0];for(let c=0;c<3;c++){const u=a[c],d=r[c],h=1<<c,f=n[h];u.subVectors(o,f),d.setFromPoints(u,n)}const l=this.alignedSatBounds;l[0].setFromPointsField(n,"x"),l[1].setFromPointsField(n,"y"),l[2].setFromPointsField(n,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}}();Ht.prototype.intersectsBox=function(){const s=new Ui;return function(t){this.needsUpdate&&this.update();const i=t.min,n=t.max,r=this.satBounds,a=this.satAxes,o=this.alignedSatBounds;if(s.min=i.x,s.max=n.x,o[0].isSeparated(s)||(s.min=i.y,s.max=n.y,o[1].isSeparated(s))||(s.min=i.z,s.max=n.z,o[2].isSeparated(s)))return!1;for(let l=0;l<3;l++){const c=a[l],u=r[l];if(s.setFromBox(c,t),u.isSeparated(s))return!1}return!0}}();Ht.prototype.intersectsTriangle=function(){const s=new fi,e=new Array(3),t=new Ui,i=new Ui,n=new P;return function(a){this.needsUpdate&&this.update(),a.isExtendedTriangle?a.needsUpdate&&a.update():(s.copy(a),s.update(),a=s);const o=this.satBounds,l=this.satAxes;e[0]=a.a,e[1]=a.b,e[2]=a.c;for(let h=0;h<3;h++){const f=o[h],g=l[h];if(t.setFromPoints(g,e),f.isSeparated(t))return!1}const c=a.satBounds,u=a.satAxes,d=this.points;for(let h=0;h<3;h++){const f=c[h],g=u[h];if(t.setFromPoints(g,d),f.isSeparated(t))return!1}for(let h=0;h<3;h++){const f=l[h];for(let g=0;g<4;g++){const x=u[g];if(n.crossVectors(f,x),t.setFromPoints(n,e),i.setFromPoints(n,d),t.isSeparated(i))return!1}}return!0}}();Ht.prototype.closestPointToPoint=function(){return function(e,t){return this.needsUpdate&&this.update(),t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),t}}();Ht.prototype.distanceToPoint=function(){const s=new P;return function(t){return this.closestPointToPoint(t,s),t.distanceTo(s)}}();Ht.prototype.distanceToBox=function(){const s=["x","y","z"],e=new Array(12).fill().map(()=>new Ni),t=new Array(12).fill().map(()=>new Ni),i=new P,n=new P;return function(a,o=0,l=null,c=null){if(this.needsUpdate&&this.update(),this.intersectsBox(a))return(l||c)&&(a.getCenter(n),this.closestPointToPoint(n,i),a.closestPointToPoint(i,n),l&&l.copy(i),c&&c.copy(n)),0;const u=o*o,d=a.min,h=a.max,f=this.points;let g=1/0;for(let m=0;m<8;m++){const p=f[m];n.copy(p).clamp(d,h);const y=p.distanceToSquared(n);if(y<g&&(g=y,l&&l.copy(p),c&&c.copy(n),y<u))return Math.sqrt(y)}let x=0;for(let m=0;m<3;m++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){const v=(m+1)%3,_=(m+2)%3,T=p<<v|y<<_,M=1<<m|p<<v|y<<_,w=f[T],R=f[M];e[x].set(w,R);const b=s[m],L=s[v],D=s[_],F=t[x],I=F.start,U=F.end;I[b]=d[b],I[L]=p?d[L]:h[L],I[D]=y?d[D]:h[L],U[b]=h[b],U[L]=p?d[L]:h[L],U[D]=y?d[D]:h[L],x++}for(let m=0;m<=1;m++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){n.x=m?h.x:d.x,n.y=p?h.y:d.y,n.z=y?h.z:d.z,this.closestPointToPoint(n,i);const v=n.distanceToSquared(i);if(v<g&&(g=v,l&&l.copy(i),c&&c.copy(n),v<u))return Math.sqrt(v)}for(let m=0;m<12;m++){const p=e[m];for(let y=0;y<12;y++){const v=t[y];qo(p,v,i,n);const _=i.distanceToSquared(n);if(_<g&&(g=_,l&&l.copy(i),c&&c.copy(n),_<u))return Math.sqrt(_)}}return Math.sqrt(g)}}();class Ko{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){const e=this._primitives;return e.length===0?this._getNewPrimitive():e.pop()}releasePrimitive(e){this._primitives.push(e)}}class J0 extends Ko{constructor(){super(()=>new fi)}}const ni=new J0;class Q0{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const e=[];let t=null;this.setBuffer=i=>{t&&e.push(t),t=i,this.float32Array=new Float32Array(i),this.uint16Array=new Uint16Array(i),this.uint32Array=new Uint32Array(i)},this.clearBuffer=()=>{t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0&&this.setBuffer(e.pop())}}}const nt=new Q0;let Wi,Xn;const In=[],yr=new Ko(()=>new wt);function $0(s,e,t,i,n,r){Wi=yr.getPrimitive(),Xn=yr.getPrimitive(),In.push(Wi,Xn),nt.setBuffer(s._roots[e]);const a=wo(0,s.geometry,t,i,n,r);nt.clearBuffer(),yr.releasePrimitive(Wi),yr.releasePrimitive(Xn),In.pop(),In.pop();const o=In.length;return o>0&&(Xn=In[o-1],Wi=In[o-2]),a}function wo(s,e,t,i,n=null,r=0,a=0){const{float32Array:o,uint16Array:l,uint32Array:c}=nt;let u=s*2;if(Gt(u,l)){const h=Xt(s,c),f=Jt(u,l);return ut(s,o,Wi),i(h,f,!1,a,r+s,Wi)}else{let b=function(D){const{uint16Array:F,uint32Array:I}=nt;let U=D*2;for(;!Gt(U,F);)D=ii(D),U=D*2;return Xt(D,I)},L=function(D){const{uint16Array:F,uint32Array:I}=nt;let U=D*2;for(;!Gt(U,F);)D=Qt(D,I),U=D*2;return Xt(D,I)+Jt(U,F)};const h=ii(s),f=Qt(s,c);let g=h,x=f,m,p,y,v;if(n&&(y=Wi,v=Xn,ut(g,o,y),ut(x,o,v),m=n(y),p=n(v),p<m)){g=f,x=h;const D=m;m=p,p=D,y=v}y||(y=Wi,ut(g,o,y));const _=Gt(g*2,l),T=t(y,_,m,a+1,r+g);let M;if(T===Zc){const D=b(g),I=L(g)-D;M=i(D,I,!0,a+1,r+g,y)}else M=T&&wo(g,e,t,i,n,r,a+1);if(M)return!0;v=Xn,ut(x,o,v);const w=Gt(x*2,l),R=t(v,w,p,a+1,r+x);let S;if(R===Zc){const D=b(x),I=L(x)-D;S=i(D,I,!0,a+1,r+x,v)}else S=R&&wo(x,e,t,i,n,r,a+1);return!!S}}const xs=new P,$a=new P;function ex(s,e,t={},i=0,n=1/0){const r=i*i,a=n*n;let o=1/0,l=null;if(s.shapecast({boundsTraverseOrder:u=>(xs.copy(e).clamp(u.min,u.max),xs.distanceToSquared(e)),intersectsBounds:(u,d,h)=>h<o&&h<a,intersectsTriangle:(u,d)=>{u.closestPointToPoint(e,xs);const h=e.distanceToSquared(xs);return h<o&&($a.copy(xs),o=h,l=d),h<r}}),o===1/0)return null;const c=Math.sqrt(o);return t.point?t.point.copy($a):t.point=$a.clone(),t.distance=c,t.faceIndex=l,t}const Ln=new P,Dn=new P,Nn=new P,_r=new ce,br=new ce,Sr=new ce,tu=new P,iu=new P,nu=new P,Mr=new P;function tx(s,e,t,i,n,r,a,o){let l;if(r===Vt?l=s.intersectTriangle(i,t,e,!0,n):l=s.intersectTriangle(e,t,i,r!==vi,n),l===null)return null;const c=s.origin.distanceTo(n);return c<a||c>o?null:{distance:c,point:n.clone()}}function ix(s,e,t,i,n,r,a,o,l,c,u){Ln.fromBufferAttribute(e,r),Dn.fromBufferAttribute(e,a),Nn.fromBufferAttribute(e,o);const d=tx(s,Ln,Dn,Nn,Mr,l,c,u);if(d){i&&(_r.fromBufferAttribute(i,r),br.fromBufferAttribute(i,a),Sr.fromBufferAttribute(i,o),d.uv=Rt.getInterpolation(Mr,Ln,Dn,Nn,_r,br,Sr,new ce)),n&&(_r.fromBufferAttribute(n,r),br.fromBufferAttribute(n,a),Sr.fromBufferAttribute(n,o),d.uv1=Rt.getInterpolation(Mr,Ln,Dn,Nn,_r,br,Sr,new ce)),t&&(tu.fromBufferAttribute(t,r),iu.fromBufferAttribute(t,a),nu.fromBufferAttribute(t,o),d.normal=Rt.getInterpolation(Mr,Ln,Dn,Nn,tu,iu,nu,new P),d.normal.dot(s.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:a,c:o,normal:new P,materialIndex:0};Rt.getNormal(Ln,Dn,Nn,h.normal),d.face=h,d.faceIndex=r}return d}function aa(s,e,t,i,n,r,a){const o=i*3;let l=o+0,c=o+1,u=o+2;const d=s.index;s.index&&(l=d.getX(l),c=d.getX(c),u=d.getX(u));const{position:h,normal:f,uv:g,uv1:x}=s.attributes,m=ix(t,h,f,g,x,l,c,u,e,r,a);return m?(m.faceIndex=i,n&&n.push(m),m):null}function gt(s,e,t,i){const n=s.a,r=s.b,a=s.c;let o=e,l=e+1,c=e+2;t&&(o=t.getX(o),l=t.getX(l),c=t.getX(c)),n.x=i.getX(o),n.y=i.getY(o),n.z=i.getZ(o),r.x=i.getX(l),r.y=i.getY(l),r.z=i.getZ(l),a.x=i.getX(c),a.y=i.getY(c),a.z=i.getZ(c)}function nx(s,e,t,i,n,r,a,o){const{geometry:l,_indirectBuffer:c}=s;for(let u=i,d=i+n;u<d;u++)aa(l,e,t,u,r,a,o)}function sx(s,e,t,i,n,r,a){const{geometry:o,_indirectBuffer:l}=s;let c=1/0,u=null;for(let d=i,h=i+n;d<h;d++){let f;f=aa(o,e,t,d,null,r,a),f&&f.distance<c&&(u=f,c=f.distance)}return u}function rx(s,e,t,i,n,r,a){const{geometry:o}=t,{index:l}=o,c=o.attributes.position;for(let u=s,d=e+s;u<d;u++){let h;if(h=u,gt(a,h*3,l,c),a.needsUpdate=!0,i(a,h,n,r))return!0}return!1}function ax(s,e=null){e&&Array.isArray(e)&&(e=new Set(e));const t=s.geometry,i=t.index?t.index.array:null,n=t.attributes.position;let r,a,o,l,c=0;const u=s._roots;for(let h=0,f=u.length;h<f;h++)r=u[h],a=new Uint32Array(r),o=new Uint16Array(r),l=new Float32Array(r),d(0,c),c+=r.byteLength;function d(h,f,g=!1){const x=h*2;if(o[x+15]===ra){const p=a[h+6],y=o[x+14];let v=1/0,_=1/0,T=1/0,M=-1/0,w=-1/0,R=-1/0;for(let S=3*p,b=3*(p+y);S<b;S++){let L=i[S];const D=n.getX(L),F=n.getY(L),I=n.getZ(L);D<v&&(v=D),D>M&&(M=D),F<_&&(_=F),F>w&&(w=F),I<T&&(T=I),I>R&&(R=I)}return l[h+0]!==v||l[h+1]!==_||l[h+2]!==T||l[h+3]!==M||l[h+4]!==w||l[h+5]!==R?(l[h+0]=v,l[h+1]=_,l[h+2]=T,l[h+3]=M,l[h+4]=w,l[h+5]=R,!0):!1}else{const p=h+8,y=a[h+6],v=p+f,_=y+f;let T=g,M=!1,w=!1;e?T||(M=e.has(v),w=e.has(_),T=!M&&!w):(M=!0,w=!0);const R=T||M,S=T||w;let b=!1;R&&(b=d(p,f,T));let L=!1;S&&(L=d(y,f,T));const D=b||L;if(D)for(let F=0;F<3;F++){const I=p+F,U=y+F,B=l[I],K=l[I+3],q=l[U],H=l[U+3];l[h+F]=B<q?B:q,l[h+F+3]=K>H?K:H}return D}}}function ji(s,e,t,i,n){let r,a,o,l,c,u;const d=1/t.direction.x,h=1/t.direction.y,f=1/t.direction.z,g=t.origin.x,x=t.origin.y,m=t.origin.z;let p=e[s],y=e[s+3],v=e[s+1],_=e[s+3+1],T=e[s+2],M=e[s+3+2];return d>=0?(r=(p-g)*d,a=(y-g)*d):(r=(y-g)*d,a=(p-g)*d),h>=0?(o=(v-x)*h,l=(_-x)*h):(o=(_-x)*h,l=(v-x)*h),r>l||o>a||((o>r||isNaN(r))&&(r=o),(l<a||isNaN(a))&&(a=l),f>=0?(c=(T-m)*f,u=(M-m)*f):(c=(M-m)*f,u=(T-m)*f),r>u||c>a)?!1:((c>r||r!==r)&&(r=c),(u<a||a!==a)&&(a=u),r<=n&&a>=i)}function ox(s,e,t,i,n,r,a,o){const{geometry:l,_indirectBuffer:c}=s;for(let u=i,d=i+n;u<d;u++){let h=c?c[u]:u;aa(l,e,t,h,r,a,o)}}function lx(s,e,t,i,n,r,a){const{geometry:o,_indirectBuffer:l}=s;let c=1/0,u=null;for(let d=i,h=i+n;d<h;d++){let f;f=aa(o,e,t,l?l[d]:d,null,r,a),f&&f.distance<c&&(u=f,c=f.distance)}return u}function cx(s,e,t,i,n,r,a){const{geometry:o}=t,{index:l}=o,c=o.attributes.position;for(let u=s,d=e+s;u<d;u++){let h;if(h=t.resolveTriangleIndex(u),gt(a,h*3,l,c),a.needsUpdate=!0,i(a,h,n,r))return!0}return!1}function ux(s,e,t,i,n,r,a){nt.setBuffer(s._roots[e]),To(0,s,t,i,n,r,a),nt.clearBuffer()}function To(s,e,t,i,n,r,a){const{float32Array:o,uint16Array:l,uint32Array:c}=nt,u=s*2;if(Gt(u,l)){const h=Xt(s,c),f=Jt(u,l);nx(e,t,i,h,f,n,r,a)}else{const h=ii(s);ji(h,o,i,r,a)&&To(h,e,t,i,n,r,a);const f=Qt(s,c);ji(f,o,i,r,a)&&To(f,e,t,i,n,r,a)}}const hx=["x","y","z"];function dx(s,e,t,i,n,r){nt.setBuffer(s._roots[e]);const a=Eo(0,s,t,i,n,r);return nt.clearBuffer(),a}function Eo(s,e,t,i,n,r){const{float32Array:a,uint16Array:o,uint32Array:l}=nt;let c=s*2;if(Gt(c,o)){const d=Xt(s,l),h=Jt(c,o);return sx(e,t,i,d,h,n,r)}else{const d=Xo(s,l),h=hx[d],g=i.direction[h]>=0;let x,m;g?(x=ii(s),m=Qt(s,l)):(x=Qt(s,l),m=ii(s));const y=ji(x,a,i,n,r)?Eo(x,e,t,i,n,r):null;if(y){const T=y.point[h];if(g?T<=a[m+d]:T>=a[m+d+3])return y}const _=ji(m,a,i,n,r)?Eo(m,e,t,i,n,r):null;return y&&_?y.distance<=_.distance?y:_:y||_||null}}const wr=new wt,Un=new fi,Fn=new fi,ys=new fe,su=new Ht,Tr=new Ht;function fx(s,e,t,i){nt.setBuffer(s._roots[e]);const n=Ao(0,s,t,i);return nt.clearBuffer(),n}function Ao(s,e,t,i,n=null){const{float32Array:r,uint16Array:a,uint32Array:o}=nt;let l=s*2;if(n===null&&(t.boundingBox||t.computeBoundingBox(),su.set(t.boundingBox.min,t.boundingBox.max,i),n=su),Gt(l,a)){const u=e.geometry,d=u.index,h=u.attributes.position,f=t.index,g=t.attributes.position,x=Xt(s,o),m=Jt(l,a);if(ys.copy(i).invert(),t.boundsTree)return ut(s,r,Tr),Tr.matrix.copy(ys),Tr.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:y=>Tr.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(i),y.b.applyMatrix4(i),y.c.applyMatrix4(i),y.needsUpdate=!0;for(let v=x*3,_=(m+x)*3;v<_;v+=3)if(gt(Fn,v,d,h),Fn.needsUpdate=!0,y.intersectsTriangle(Fn))return!0;return!1}});for(let p=x*3,y=(m+x)*3;p<y;p+=3){gt(Un,p,d,h),Un.a.applyMatrix4(ys),Un.b.applyMatrix4(ys),Un.c.applyMatrix4(ys),Un.needsUpdate=!0;for(let v=0,_=f.count;v<_;v+=3)if(gt(Fn,v,f,g),Fn.needsUpdate=!0,Un.intersectsTriangle(Fn))return!0}}else{const u=s+8,d=o[s+6];return ut(u,r,wr),!!(n.intersectsBox(wr)&&Ao(u,e,t,i,n)||(ut(d,r,wr),n.intersectsBox(wr)&&Ao(d,e,t,i,n)))}}const Er=new fe,eo=new Ht,_s=new Ht,px=new P,mx=new P,gx=new P,vx=new P;function xx(s,e,t,i={},n={},r=0,a=1/0){e.boundingBox||e.computeBoundingBox(),eo.set(e.boundingBox.min,e.boundingBox.max,t),eo.needsUpdate=!0;const o=s.geometry,l=o.attributes.position,c=o.index,u=e.attributes.position,d=e.index,h=ni.getPrimitive(),f=ni.getPrimitive();let g=px,x=mx,m=null,p=null;n&&(m=gx,p=vx);let y=1/0,v=null,_=null;return Er.copy(t).invert(),_s.matrix.copy(Er),s.shapecast({boundsTraverseOrder:T=>eo.distanceToBox(T),intersectsBounds:(T,M,w)=>w<y&&w<a?(M&&(_s.min.copy(T.min),_s.max.copy(T.max),_s.needsUpdate=!0),!0):!1,intersectsRange:(T,M)=>{if(e.boundsTree)return e.boundsTree.shapecast({boundsTraverseOrder:R=>_s.distanceToBox(R),intersectsBounds:(R,S,b)=>b<y&&b<a,intersectsRange:(R,S)=>{for(let b=R,L=R+S;b<L;b++){gt(f,3*b,d,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let D=T,F=T+M;D<F;D++){gt(h,3*D,c,l),h.needsUpdate=!0;const I=h.distanceToTriangle(f,g,m);if(I<y&&(x.copy(g),p&&p.copy(m),y=I,v=D,_=b),I<r)return!0}}}});{const w=rs(e);for(let R=0,S=w;R<S;R++){gt(f,3*R,d,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let b=T,L=T+M;b<L;b++){gt(h,3*b,c,l),h.needsUpdate=!0;const D=h.distanceToTriangle(f,g,m);if(D<y&&(x.copy(g),p&&p.copy(m),y=D,v=b,_=R),D<r)return!0}}}}}),ni.releasePrimitive(h),ni.releasePrimitive(f),y===1/0?null:(i.point?i.point.copy(x):i.point=x.clone(),i.distance=y,i.faceIndex=v,n&&(n.point?n.point.copy(p):n.point=p.clone(),n.point.applyMatrix4(Er),x.applyMatrix4(Er),n.distance=x.sub(n.point).length(),n.faceIndex=_),i)}function yx(s,e=null){e&&Array.isArray(e)&&(e=new Set(e));const t=s.geometry,i=t.index?t.index.array:null,n=t.attributes.position;let r,a,o,l,c=0;const u=s._roots;for(let h=0,f=u.length;h<f;h++)r=u[h],a=new Uint32Array(r),o=new Uint16Array(r),l=new Float32Array(r),d(0,c),c+=r.byteLength;function d(h,f,g=!1){const x=h*2;if(o[x+15]===ra){const p=a[h+6],y=o[x+14];let v=1/0,_=1/0,T=1/0,M=-1/0,w=-1/0,R=-1/0;for(let S=p,b=p+y;S<b;S++){const L=3*s.resolveTriangleIndex(S);for(let D=0;D<3;D++){let F=L+D;F=i?i[F]:F;const I=n.getX(F),U=n.getY(F),B=n.getZ(F);I<v&&(v=I),I>M&&(M=I),U<_&&(_=U),U>w&&(w=U),B<T&&(T=B),B>R&&(R=B)}}return l[h+0]!==v||l[h+1]!==_||l[h+2]!==T||l[h+3]!==M||l[h+4]!==w||l[h+5]!==R?(l[h+0]=v,l[h+1]=_,l[h+2]=T,l[h+3]=M,l[h+4]=w,l[h+5]=R,!0):!1}else{const p=h+8,y=a[h+6],v=p+f,_=y+f;let T=g,M=!1,w=!1;e?T||(M=e.has(v),w=e.has(_),T=!M&&!w):(M=!0,w=!0);const R=T||M,S=T||w;let b=!1;R&&(b=d(p,f,T));let L=!1;S&&(L=d(y,f,T));const D=b||L;if(D)for(let F=0;F<3;F++){const I=p+F,U=y+F,B=l[I],K=l[I+3],q=l[U],H=l[U+3];l[h+F]=B<q?B:q,l[h+F+3]=K>H?K:H}return D}}}function _x(s,e,t,i,n,r,a){nt.setBuffer(s._roots[e]),Ro(0,s,t,i,n,r,a),nt.clearBuffer()}function Ro(s,e,t,i,n,r,a){const{float32Array:o,uint16Array:l,uint32Array:c}=nt,u=s*2;if(Gt(u,l)){const h=Xt(s,c),f=Jt(u,l);ox(e,t,i,h,f,n,r,a)}else{const h=ii(s);ji(h,o,i,r,a)&&Ro(h,e,t,i,n,r,a);const f=Qt(s,c);ji(f,o,i,r,a)&&Ro(f,e,t,i,n,r,a)}}const bx=["x","y","z"];function Sx(s,e,t,i,n,r){nt.setBuffer(s._roots[e]);const a=Po(0,s,t,i,n,r);return nt.clearBuffer(),a}function Po(s,e,t,i,n,r){const{float32Array:a,uint16Array:o,uint32Array:l}=nt;let c=s*2;if(Gt(c,o)){const d=Xt(s,l),h=Jt(c,o);return lx(e,t,i,d,h,n,r)}else{const d=Xo(s,l),h=bx[d],g=i.direction[h]>=0;let x,m;g?(x=ii(s),m=Qt(s,l)):(x=Qt(s,l),m=ii(s));const y=ji(x,a,i,n,r)?Po(x,e,t,i,n,r):null;if(y){const T=y.point[h];if(g?T<=a[m+d]:T>=a[m+d+3])return y}const _=ji(m,a,i,n,r)?Po(m,e,t,i,n,r):null;return y&&_?y.distance<=_.distance?y:_:y||_||null}}const Ar=new wt,Bn=new fi,On=new fi,bs=new fe,ru=new Ht,Rr=new Ht;function Mx(s,e,t,i){nt.setBuffer(s._roots[e]);const n=Co(0,s,t,i);return nt.clearBuffer(),n}function Co(s,e,t,i,n=null){const{float32Array:r,uint16Array:a,uint32Array:o}=nt;let l=s*2;if(n===null&&(t.boundingBox||t.computeBoundingBox(),ru.set(t.boundingBox.min,t.boundingBox.max,i),n=ru),Gt(l,a)){const u=e.geometry,d=u.index,h=u.attributes.position,f=t.index,g=t.attributes.position,x=Xt(s,o),m=Jt(l,a);if(bs.copy(i).invert(),t.boundsTree)return ut(s,r,Rr),Rr.matrix.copy(bs),Rr.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:y=>Rr.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(i),y.b.applyMatrix4(i),y.c.applyMatrix4(i),y.needsUpdate=!0;for(let v=x,_=m+x;v<_;v++)if(gt(On,3*e.resolveTriangleIndex(v),d,h),On.needsUpdate=!0,y.intersectsTriangle(On))return!0;return!1}});for(let p=x,y=m+x;p<y;p++){const v=e.resolveTriangleIndex(p);gt(Bn,3*v,d,h),Bn.a.applyMatrix4(bs),Bn.b.applyMatrix4(bs),Bn.c.applyMatrix4(bs),Bn.needsUpdate=!0;for(let _=0,T=f.count;_<T;_+=3)if(gt(On,_,f,g),On.needsUpdate=!0,Bn.intersectsTriangle(On))return!0}}else{const u=s+8,d=o[s+6];return ut(u,r,Ar),!!(n.intersectsBox(Ar)&&Co(u,e,t,i,n)||(ut(d,r,Ar),n.intersectsBox(Ar)&&Co(d,e,t,i,n)))}}const Pr=new fe,to=new Ht,Ss=new Ht,wx=new P,Tx=new P,Ex=new P,Ax=new P;function Rx(s,e,t,i={},n={},r=0,a=1/0){e.boundingBox||e.computeBoundingBox(),to.set(e.boundingBox.min,e.boundingBox.max,t),to.needsUpdate=!0;const o=s.geometry,l=o.attributes.position,c=o.index,u=e.attributes.position,d=e.index,h=ni.getPrimitive(),f=ni.getPrimitive();let g=wx,x=Tx,m=null,p=null;n&&(m=Ex,p=Ax);let y=1/0,v=null,_=null;return Pr.copy(t).invert(),Ss.matrix.copy(Pr),s.shapecast({boundsTraverseOrder:T=>to.distanceToBox(T),intersectsBounds:(T,M,w)=>w<y&&w<a?(M&&(Ss.min.copy(T.min),Ss.max.copy(T.max),Ss.needsUpdate=!0),!0):!1,intersectsRange:(T,M)=>{if(e.boundsTree){const w=e.boundsTree;return w.shapecast({boundsTraverseOrder:R=>Ss.distanceToBox(R),intersectsBounds:(R,S,b)=>b<y&&b<a,intersectsRange:(R,S)=>{for(let b=R,L=R+S;b<L;b++){const D=w.resolveTriangleIndex(b);gt(f,3*D,d,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let F=T,I=T+M;F<I;F++){const U=s.resolveTriangleIndex(F);gt(h,3*U,c,l),h.needsUpdate=!0;const B=h.distanceToTriangle(f,g,m);if(B<y&&(x.copy(g),p&&p.copy(m),y=B,v=F,_=b),B<r)return!0}}}})}else{const w=rs(e);for(let R=0,S=w;R<S;R++){gt(f,3*R,d,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let b=T,L=T+M;b<L;b++){const D=s.resolveTriangleIndex(b);gt(h,3*D,c,l),h.needsUpdate=!0;const F=h.distanceToTriangle(f,g,m);if(F<y&&(x.copy(g),p&&p.copy(m),y=F,v=b,_=R),F<r)return!0}}}}}),ni.releasePrimitive(h),ni.releasePrimitive(f),y===1/0?null:(i.point?i.point.copy(x):i.point=x.clone(),i.distance=y,i.faceIndex=v,n&&(n.point?n.point.copy(p):n.point=p.clone(),n.point.applyMatrix4(Pr),x.applyMatrix4(Pr),n.distance=x.sub(n.point).length(),n.faceIndex=_),i)}function Px(){return typeof SharedArrayBuffer<"u"}const Rs=new nt.constructor,Yr=new nt.constructor,Vi=new Ko(()=>new wt),kn=new wt,zn=new wt,io=new wt,no=new wt;let so=!1;function Cx(s,e,t,i){if(so)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");so=!0;const n=s._roots,r=e._roots;let a,o=0,l=0;const c=new fe().copy(t).invert();for(let u=0,d=n.length;u<d;u++){Rs.setBuffer(n[u]),l=0;const h=Vi.getPrimitive();ut(0,Rs.float32Array,h),h.applyMatrix4(c);for(let f=0,g=r.length;f<g&&(Yr.setBuffer(r[f]),a=ci(0,0,t,c,i,o,l,0,0,h),Yr.clearBuffer(),l+=r[f].length,!a);f++);if(Vi.releasePrimitive(h),Rs.clearBuffer(),o+=n[u].length,a)break}return so=!1,a}function ci(s,e,t,i,n,r=0,a=0,o=0,l=0,c=null,u=!1){let d,h;u?(d=Yr,h=Rs):(d=Rs,h=Yr);const f=d.float32Array,g=d.uint32Array,x=d.uint16Array,m=h.float32Array,p=h.uint32Array,y=h.uint16Array,v=s*2,_=e*2,T=Gt(v,x),M=Gt(_,y);let w=!1;if(M&&T)u?w=n(Xt(e,p),Jt(e*2,y),Xt(s,g),Jt(s*2,x),l,a+e,o,r+s):w=n(Xt(s,g),Jt(s*2,x),Xt(e,p),Jt(e*2,y),o,r+s,l,a+e);else if(M){const R=Vi.getPrimitive();ut(e,m,R),R.applyMatrix4(t);const S=ii(s),b=Qt(s,g);ut(S,f,kn),ut(b,f,zn);const L=R.intersectsBox(kn),D=R.intersectsBox(zn);w=L&&ci(e,S,i,t,n,a,r,l,o+1,R,!u)||D&&ci(e,b,i,t,n,a,r,l,o+1,R,!u),Vi.releasePrimitive(R)}else{const R=ii(e),S=Qt(e,p);ut(R,m,io),ut(S,m,no);const b=c.intersectsBox(io),L=c.intersectsBox(no);if(b&&L)w=ci(s,R,t,i,n,r,a,o,l+1,c,u)||ci(s,S,t,i,n,r,a,o,l+1,c,u);else if(b)if(T)w=ci(s,R,t,i,n,r,a,o,l+1,c,u);else{const D=Vi.getPrimitive();D.copy(io).applyMatrix4(t);const F=ii(s),I=Qt(s,g);ut(F,f,kn),ut(I,f,zn);const U=D.intersectsBox(kn),B=D.intersectsBox(zn);w=U&&ci(R,F,i,t,n,a,r,l,o+1,D,!u)||B&&ci(R,I,i,t,n,a,r,l,o+1,D,!u),Vi.releasePrimitive(D)}else if(L)if(T)w=ci(s,S,t,i,n,r,a,o,l+1,c,u);else{const D=Vi.getPrimitive();D.copy(no).applyMatrix4(t);const F=ii(s),I=Qt(s,g);ut(F,f,kn),ut(I,f,zn);const U=D.intersectsBox(kn),B=D.intersectsBox(zn);w=U&&ci(S,F,i,t,n,a,r,l,o+1,D,!u)||B&&ci(S,I,i,t,n,a,r,l,o+1,D,!u),Vi.releasePrimitive(D)}}return w}const Cr=new Ht,au=new wt,Ix={strategy:sa,maxDepth:40,maxLeafTris:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null};class oa{static serialize(e,t={}){t={cloneBuffers:!0,...t};const i=e.geometry,n=e._roots,r=e._indirectBuffer,a=i.getIndex();let o;return t.cloneBuffers?o={roots:n.map(l=>l.slice()),index:a?a.array.slice():null,indirectBuffer:r?r.slice():null}:o={roots:n,index:a?a.array:null,indirectBuffer:r},o}static deserialize(e,t,i={}){i={setIndex:!0,indirect:!!e.indirectBuffer,...i};const{index:n,roots:r,indirectBuffer:a}=e,o=new oa(t,{...i,[Ya]:!0});if(o._roots=r,o._indirectBuffer=a||null,i.setIndex){const l=t.getIndex();if(l===null){const c=new st(e.index,1,!1);t.setIndex(c)}else l.array!==n&&(l.array.set(n),l.needsUpdate=!0)}return o}get indirect(){return!!this._indirectBuffer}constructor(e,t={}){if(e.isBufferGeometry){if(e.index&&e.index.isInterleavedBufferAttribute)throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("MeshBVH: Only BufferGeometries are supported.");if(t=Object.assign({...Ix,[Ya]:!1},t),t.useSharedArrayBuffer&&!Px())throw new Error("MeshBVH: SharedArrayBuffer is not available.");this.geometry=e,this._roots=null,this._indirectBuffer=null,t[Ya]||(K0(this,t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new wt))),this.resolveTriangleIndex=t.indirect?i=>this._indirectBuffer[i]:i=>i}refit(e=null){return(this.indirect?yx:ax)(this,e)}traverse(e,t=0){const i=this._roots[t],n=new Uint32Array(i),r=new Uint16Array(i);a(0);function a(o,l=0){const c=o*2,u=r[c+15]===ra;if(u){const d=n[o+6],h=r[c+14];e(l,u,new Float32Array(i,o*4,6),d,h)}else{const d=o+Ki/4,h=n[o+6],f=n[o+7];e(l,u,new Float32Array(i,o*4,6),f)||(a(d,l+1),a(h,l+1))}}}raycast(e,t=si,i=0,n=1/0){const r=this._roots,a=this.geometry,o=[],l=t.isMaterial,c=Array.isArray(t),u=a.groups,d=l?t.side:t,h=this.indirect?_x:ux;for(let f=0,g=r.length;f<g;f++){const x=c?t[u[f].materialIndex].side:d,m=o.length;if(h(this,f,x,e,o,i,n),c){const p=u[f].materialIndex;for(let y=m,v=o.length;y<v;y++)o[y].face.materialIndex=p}}return o}raycastFirst(e,t=si,i=0,n=1/0){const r=this._roots,a=this.geometry,o=t.isMaterial,l=Array.isArray(t);let c=null;const u=a.groups,d=o?t.side:t,h=this.indirect?Sx:dx;for(let f=0,g=r.length;f<g;f++){const x=l?t[u[f].materialIndex].side:d,m=h(this,f,x,e,i,n);m!=null&&(c==null||m.distance<c.distance)&&(c=m,l&&(m.face.materialIndex=u[f].materialIndex))}return c}intersectsGeometry(e,t){let i=!1;const n=this._roots,r=this.indirect?Mx:fx;for(let a=0,o=n.length;a<o&&(i=r(this,a,e,t),!i);a++);return i}shapecast(e){const t=ni.getPrimitive(),i=this.indirect?cx:rx;let{boundsTraverseOrder:n,intersectsBounds:r,intersectsRange:a,intersectsTriangle:o}=e;if(a&&o){const d=a;a=(h,f,g,x,m)=>d(h,f,g,x,m)?!0:i(h,f,this,o,g,x,t)}else a||(o?a=(d,h,f,g)=>i(d,h,this,o,f,g,t):a=(d,h,f)=>f);let l=!1,c=0;const u=this._roots;for(let d=0,h=u.length;d<h;d++){const f=u[d];if(l=$0(this,d,r,a,n,c),l)break;c+=f.byteLength}return ni.releasePrimitive(t),l}bvhcast(e,t,i){let{intersectsRanges:n,intersectsTriangles:r}=i;const a=ni.getPrimitive(),o=this.geometry.index,l=this.geometry.attributes.position,c=this.indirect?g=>{const x=this.resolveTriangleIndex(g);gt(a,x*3,o,l)}:g=>{gt(a,g*3,o,l)},u=ni.getPrimitive(),d=e.geometry.index,h=e.geometry.attributes.position,f=e.indirect?g=>{const x=e.resolveTriangleIndex(g);gt(u,x*3,d,h)}:g=>{gt(u,g*3,d,h)};if(r){const g=(x,m,p,y,v,_,T,M)=>{for(let w=p,R=p+y;w<R;w++){f(w),u.a.applyMatrix4(t),u.b.applyMatrix4(t),u.c.applyMatrix4(t),u.needsUpdate=!0;for(let S=x,b=x+m;S<b;S++)if(c(S),a.needsUpdate=!0,r(a,u,S,w,v,_,T,M))return!0}return!1};if(n){const x=n;n=function(m,p,y,v,_,T,M,w){return x(m,p,y,v,_,T,M,w)?!0:g(m,p,y,v,_,T,M,w)}}else n=g}return Cx(this,e,t,n)}intersectsBox(e,t){return Cr.set(e.min,e.max,t),Cr.needsUpdate=!0,this.shapecast({intersectsBounds:i=>Cr.intersectsBox(i),intersectsTriangle:i=>Cr.intersectsTriangle(i)})}intersectsSphere(e){return this.shapecast({intersectsBounds:t=>e.intersectsBox(t),intersectsTriangle:t=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,i={},n={},r=0,a=1/0){return(this.indirect?Rx:xx)(this,e,t,i,n,r,a)}closestPointToPoint(e,t={},i=0,n=1/0){return ex(this,e,t,i,n)}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach(i=>{ut(0,new Float32Array(i),au),e.union(au)}),e}}function Lx(s){switch(s){case 1:return"R";case 2:return"RG";case 3:return"RGBA";case 4:return"RGBA"}throw new Error}function Dx(s){switch(s){case 1:return Eu;case 2:return Au;case 3:return Ye;case 4:return Ye}}function ou(s){switch(s){case 1:return No;case 2:return Qr;case 3:return Cs;case 4:return Cs}}class gh extends Ls{constructor(){super(),this.minFilter=Ve,this.magFilter=Ve,this.generateMipmaps=!1,this.overrideItemSize=null,this._forcedType=null}updateFrom(e){const t=this.overrideItemSize,i=e.itemSize,n=e.count;if(t!==null){if(i*n%t!==0)throw new Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");e.itemSize=t,e.count=n*i/t}const r=e.itemSize,a=e.count,o=e.normalized,l=e.array.constructor,c=l.BYTES_PER_ELEMENT;let u=this._forcedType,d=r;if(u===null)switch(l){case Float32Array:u=Mt;break;case Uint8Array:case Uint16Array:case Uint32Array:u=Zt;break;case Int8Array:case Int16Array:case Int32Array:u=ws;break}let h,f,g,x,m=Lx(r);switch(u){case Mt:g=1,f=Dx(r),o&&c===1?(x=l,m+="8",l===Uint8Array?h=ui:(h=go,m+="_SNORM")):(x=Float32Array,m+="32F",h=Mt);break;case ws:m+=c*8+"I",g=o?Math.pow(2,l.BYTES_PER_ELEMENT*8-1):1,f=ou(r),c===1?(x=Int8Array,h=go):c===2?(x=Int16Array,h=Mu):(x=Int32Array,h=ws);break;case Zt:m+=c*8+"UI",g=o?Math.pow(2,l.BYTES_PER_ELEMENT*8-1):1,f=ou(r),c===1?(x=Uint8Array,h=ui):c===2?(x=Uint16Array,h=Jr):(x=Uint32Array,h=Zt);break}d===3&&(f===Ye||f===Cs)&&(d=4);const p=Math.ceil(Math.sqrt(a))||1,y=d*p*p,v=new x(y),_=e.normalized;e.normalized=!1;for(let T=0;T<a;T++){const M=d*T;v[M]=e.getX(T)/g,r>=2&&(v[M+1]=e.getY(T)/g),r>=3&&(v[M+2]=e.getZ(T)/g,d===4&&(v[M+3]=1)),r>=4&&(v[M+3]=e.getW(T)/g)}e.normalized=_,this.internalFormat=m,this.format=f,this.type=h,this.image.width=p,this.image.height=p,this.image.data=v,this.needsUpdate=!0,this.dispose(),e.itemSize=i,e.count=n}}class Nx extends gh{constructor(){super(),this._forcedType=Zt}}class Io extends gh{constructor(){super(),this._forcedType=Mt}}class lu{constructor(){this.index=new Nx,this.position=new Io,this.bvhBounds=new Ls,this.bvhContents=new Ls,this._cachedIndexAttr=null,this.index.overrideItemSize=3}updateFrom(e){const{geometry:t}=e;if(Fx(e,this.bvhBounds,this.bvhContents),this.position.updateFrom(t.attributes.position),e.indirect){const i=e._indirectBuffer;if(this._cachedIndexAttr===null||this._cachedIndexAttr.count!==i.length)if(t.index)this._cachedIndexAttr=t.index.clone();else{const n=hh(uh(t));this._cachedIndexAttr=new st(n,1,!1)}Ux(t,i,this._cachedIndexAttr),this.index.updateFrom(this._cachedIndexAttr)}else this.index.updateFrom(t.index)}dispose(){const{index:e,position:t,bvhBounds:i,bvhContents:n}=this;e&&e.dispose(),t&&t.dispose(),i&&i.dispose(),n&&n.dispose()}}function Ux(s,e,t){const i=t.array,n=s.index?s.index.array:null;for(let r=0,a=e.length;r<a;r++){const o=3*r,l=3*e[r];for(let c=0;c<3;c++)i[o+c]=n?n[l+c]:l+c}}function Fx(s,e,t){const i=s._roots;if(i.length!==1)throw new Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");const n=i[0],r=new Uint16Array(n),a=new Uint32Array(n),o=new Float32Array(n),l=n.byteLength/Ki,c=2*Math.ceil(Math.sqrt(l/2)),u=new Float32Array(4*c*c),d=Math.ceil(Math.sqrt(l)),h=new Uint32Array(2*d*d);for(let f=0;f<l;f++){const g=f*Ki/4,x=g*2,m=g;for(let p=0;p<3;p++)u[8*f+0+p]=o[m+0+p],u[8*f+4+p]=o[m+3+p];if(Gt(x,r)){const p=Jt(x,r),y=Xt(g,a),v=4294901760|p;h[f*2+0]=v,h[f*2+1]=y}else{const p=4*Qt(g,a)/Ki,y=Xo(g,a);h[f*2+0]=y,h[f*2+1]=p}}e.image.data=u,e.image.width=c,e.image.height=c,e.format=Ye,e.type=Mt,e.internalFormat="RGBA32F",e.minFilter=Ve,e.magFilter=Ve,e.generateMipmaps=!1,e.needsUpdate=!0,e.dispose(),t.image.data=h,t.image.width=d,t.image.height=d,t.format=Qr,t.type=Zt,t.internalFormat="RG32UI",t.minFilter=Ve,t.magFilter=Ve,t.generateMipmaps=!1,t.needsUpdate=!0,t.dispose()}const Bx=`

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
`,Ox=`

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
`,kx=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,jo=kx,Yo=`
	${Bx}
	${Ox}
`,zx="4nh6v3AXO108mJGEGrgVsY13JcfnHOYZvvoI1EIoMK4hmnJN38oOJJCMUpQOZr8JZQUlOOFJ/aYCN6D29NV8IDRP5FvZx/bdRIU/+pPa03RaJZBJsHB72Gn2RTRKOFm47X6+xtcFOQM7IJZN8aCpIJNKKMAUFWrcVoXYZJqnM0QsQOx10Y2H92wJ3lb60z+MiISeeC4ngM3V59EUgq+Jc70+9carXa+C/JtY8tnq5E4JKMWwZmEU+n0aqZ7WTkTgEtjtJbEKZk2GVyQJaZv7xZx1sOkl8xJcWwDDMafDWYkPjqYGMylJQmBfjpWP+b+3e9mvSyhWn8ehNkR2XLzSqSDetdKCMaIKtUzJJGDJb97TDNhFdKyaYqXbSIFnTfMz7O7Q3FJBs7mxMu2hNuCN8f53R8eBs65zKZFcD5WkNZZr8yGuphKshQh0BjeBr8EAJgETstHJ6moXttcPg0Yb+L/l+ZRizmQ8JmXcrH6zdW9G48aa4AtPOPdyA6nAy5EXYWPEgxD7VaE4dWYRqjQqtZuex/BE9rZl8JJPmZUTIDoLwnHpydRBBV0Xf6GFqjB4Ht5oLMUz/Tvv8rkBP8FWWFp0C8D4kaGXLjF2+RoSj3W4Py4SCoZvn4Dc1N/cNyBsTupn+/jR/lcaS3jS4pbkhlMMU2D/rw/4kvNpD0eeHo7txUtNMAYp/KNv7XHy41WgVIxABBM3ffI3XKyauACMc4p0WA8qrzlgzQ4bbXZVLRqnxXWJQSkC2lvn2E+/bbrmHlyOKuYuStBi41pW8Dug7cFTaJ1xZyqJ9pW1Ui4OhH+nqqQWBXMOZJ4qR+DMPx3+afn3ezCZnAYCNrqPg7ci67DdcinpFg9MfbCm29vA7jcGXwcBxQRcp2RFMSAha5jY4DDZX0uJF5MyduwVolOW5OXHS8RQgwKNjJ591ASvk3+XI9YV3GM8aansv0BQ09Ct5LdIJ8+mnk49XTrLbhm4O8iAgq6yrix4nR/LDENsFu+8yTkhCITWn8gllEGvYfkrZlEMf9alZlcF/Ia7ySYEOihl/4yBz7nO9n4gKgHCEcGekGv8XuelO/HQ29EKg5hGmJvHLhgb6bXrRIRj0AcZPUmLzsJ7v3MUtKjwezqQ3r2Y+jYeCtRR3EIvl0CNhG3q5vLMznVZ7bX/vo8vG5AyGrp8g8iM0+FSTl081dYrq7EdS/jDlZbaaEckOJInU43KWOJ6WXR74IWluff3OdinsX3uBURrIssxEra1u5NCJFZxBKZnLGzaqK8UcEW/RSv0JPn2tG7FrjA6gRaJkEtf2HZrBvD7KfJ9mMpSkh5Q5xmJcpXkA/EKKGk8qruAo141NeRzbtlG6txzEn+zEZHB6TzQ45eXPKsYd4LTqkWxnu2SRS9qwfNjS9yd1R1LL+ymfBjCVRxqe42+JPrlSPZjqtZgUIC13DsHcKpp/oz/+I6g0C1uER+ZpixJD0fhDIBkUnvHMKm8+8feGgGqXE89KLedIXRNFk6eN9/BWVkGr4yqUFhC6h4S8aCkYxE87X1ecAFJPVuBmfzM8R0ftT69cubNQuEZHhUt96drTrJPwHzQnEjQ6WRgb7r6iv71j1UfPdLz2tDnOg5hXMkne4tdckc5G8jqBU/kxKKBHRUe31de/Kdlro2JvkjldAIxERmi67fbYdSTRU8nBvWa8VubzKgxIYset7JZVnsuAIjtWMS+Go9mUb434Ohady6xlhoNGR7F2FwPkFyotDy0b9xO6stYKnzlpwUBNEpEJGg4FMCGtbRYVHaezDBSC50HMagf+X5W7lljPwvH7LfiiJ8klxsnqPvMXnUJeu3aXiHbupANQF1LxsV8BZcz5ufcrQW9EmxupHfm0Wwkvesu84srecRqyZsJx1oH/aFtqoRw1UY1D62+j/1Un02HkhcAOYDDiQooCinN4qRXFXaJqTUMSwijvnreKhibF7ed7P7a5l6kmIxODFXElILea6XasusPKQw10AY9JzPAnchHY2av96IuYsdQ2zJ/t8K96l2JT0SN/4cW5NbNqJ9pQ3j5LBU3FePcSCRw8c3bA0aObdSydznpU8P9U3OELXLmEA5AoDY//LbbjpWTSqq/0pj4E4f2IonhFd4KJnfFyH40PZnXTK24w6/ZPed/btyK00TGZDz8cUeGZzgZbzSojbqgjfT02GcuGW93otUp/tU5hIhCf0TNmiLQQr7eZA+JibI6F7oy1bXkmlgBzxQwhIBptPzwoZAlD8JgzozdLOvoXnU1ZpzioidCWPvtHa49O8Rw0raB8GbNTU6ENZt8SIY0D7GuzM00CGduIzqzMpj1THoLdJ5ct7bvxFuOhdb52uGDAG539n8fFUXRsTsXbQjFdd9oClAI+kgM8NUtqqYmzpxv8oOLAgtf8V6yozYjVAl6zz+Ko/YlzsYH85opFpTfh4JwugZcoljN8roIcG1goPEzbXjWwD4SQfTp7upd2WYYRl9/bhzFJANuLJaIBli2UtQjBBHtpZG2WBbwzZ0/sQcK3z4khnnro2auYQ0ZZvlfKPq+Kf4LC5tOy1V4NkeI+qUb4avzUnoa3jZR6zEn2EdMW0Tbm2wrwgc+DqxlrW/tEVPJlMOX+74c3HhHjl1lhq0DkMQs8ukc7xW5ZnjAWfcF3Ywn1CEgv/zT8+hBgTKUe0LR79klbSNLqUBOjgwOAz+GyqWjPP1gIt+XrpIvbswXlNeXO798ImRRZV2Wh6tCuZ/1EH9wNk7BHre4mv7sI4abe2ZprVCPqOJl4t9EIbk2HIJeyMnsISEsKTKtC9GhU9RFYxeIkSlzpLuQj7meWbMFS/I0kBax/vfqK5dyMfjAtFyUMsrB4rPsTIA/mYBKz1UY9L/EjNbpKgO6rJuuSHhNMO6RXeW0CpSkVGGsGCJz90BkQmW7mJCPqwhntSJ5up3vJXnHfVQ++7kCqjPjQNjTNhxzg659WxwRKE912Qabqi/g3pEiPxJVc5+5RAKrVHBCg3Bh4Uyim3gXY7xUQc1UkKke4RttnV+5vW7rWTbDTYx47cIt5lafrye3XRk9+nbz83sdurrGP0HeKLgCyE7kxrD9gZCCM9dJ2Q2+KPbnZ8JHPgMTCihR8jW90bPudmVMeUn7ca8IesTm6u1iT6Oyr4FAUDOszSlY3gEcAcHkafZIpULIo4GfpNJPDXdgJ+TkP3tKEBziZihrbgLVMBQyV1hLiMmUNxqcOVfST37cuHsWx+yU3bM0bcXndMmFzgH3NSLTAuGg62O7Dw3NiuXak/fEHlie8num14YFHmxIuYbLuEhQ9vDIlqEBLvDVyuVGkTdqp1thJtHplPz4NOikvgPB6pi1FTEUYVAErNGu+scK7xX5ig6ZJ/jieKSXKyrbHBP/StPUEoCIR61VbKDuJQRbzJx94wXmMhxicGXTLdUooVkbnnQ6Z1uwFOAXTImfq5M0QNBgfJJQ07fUnJoPAxX9VjlFjZGXj2E3/QKAFhrR3pjlEJl9dXcr9YofZ9/UNleDOoDP0VMNDxqGdKw30KxhjGvtHnudnfDW9smBq3OxmPW75/lyHx0NQNbPahA5kTCE8GseJyUEgsVK9VGfj7CwQS5O2YPpzltvcmoZSRU6LVb6GFaVP4Ef42i3lWHtX+MRCTQl+cxPf51baW5Atrj5wxcQIYJndqi0gco+DCraKXtfkfTM1/uRjwh9MGxlL4DGOOI8OHVXXdLpsK25AUh4j2rANlTPVYeB4p4FRzjpL92KTK+ZEJKN+FD7P6uZCVdK78vblHg5F+0GlcvLsHP4plzAHPYwhFQpdmgPh6bWssPh9y6rEcbRSIVbEuJPuba+1z1OW8D298glacUva5wZrbLhQFILxfO+ISXbYLpPkP1D2KMlrBTDvROHK0YwAV9eRWO4kuNzjOFqqqajD1BGargv99pdmppW20EEt3d1NBShEH4vTir4qTldjMC2xKLvBu1xKoxJ0KXWlwhyLQ00jLzqobJysEJSOxbBCIf+itGfK00Z44rbl0xEelCxV4c+PG8HHu4lya+ho2lJSMbWg4cTvau0Z4scmdv7ZkIJmAK97mbVEzHdNKcUwiJesm9pw9j1irIbEBgvdmfEqka6B1jtits9ayxzzuRsIvwsfl2D/rfeyA/cnR0khT30qGrpVzk9Iblx5WhsHXjSLeQgA5+XOHEOTW8+Q8yJDucHnvGVW7eVY/10d/yKNd2OuQOnNTZFmup4UhF+99Pml0QIIGAq5Mv7wiMGqPx8UIIQ1/7M7LwZHF5fkaym6+cN1HBiwei4zeOSSPqCpMg5mws6h8mstBdNL/3MrOJoPnskrumdjV4hInjsftw6smUFyAvd85zQNjPvFucNHl66y67h1ormtVwjOkbye1Ii3uW5oSzUQwNYF4JP82AqH0D4kLV0M3QM55So68bwz6emdlxQtiA8gDj7xMx5f6bu5wpXCaC+uUdhjYDktC0BpUEXsgYLa0E0Td7dRG5IV+rVir0kByWKn3bMLcOhQKNYMK19lP3tKL+MXrXspoCGCEymqihmLi/oI8NFWwRMlshC3xGGLwJn+lZaxLCD2FNwbbSknrIL4j81iozLeio8U8BTgBKsmdiSOkS9Gn/+JUBJhxfRdih/JiJaRgiTGf5iB9pz4Gcl1hS7YlaE3ufAT1oTbt4yRKeOwv7dGu9kWC6nxYFpjlRKl1t3Zrxylr8yKG0JnIf9l3FoUhjpEcHvWqAwdvYIDZx1k1X14OPEy0S0Iz3MoW5gWBaF/CdeCIFB9kwkGAzWa5hWZ4c40UXgJSfqMHK8I9ScMdsgxIWbT1nyU4zxxqtilpQMmakXv3p1sGLyyV6dBwPyfWVJhPfZ+lMJ/A60jhOpJc5iXuQc8NPV9Bx8ftnlSsQSbpfrddodsKKmZs9o6d0KxR8RxR+RNPhNtu1Ozg6DnD1ZZevAIPRhBLE3IuRHddRzcMUEZYij8DvJhaTPWfThs7mVWWw0qrDuG3h9d4wpSzV9QJq+Bb4DWfoNb9RFdpeBHNYRrLxXKpEC80Ym0376vaZDANgz/qEV31HsqYYMwQPPqTNnZDh6kwGVyKfWxm7xIC8kf6yDgNoP8EqvmnKUzUqPKz0F2IXlvLhxl5hf7hX44UPLDayPiGVS+mGS+1JxqjkW9ckhqbrwZXhCM7/llMQTNe4aUYo1SvPK1LCKRBjLr79SVGkNcUSBmTeQ4WCyN0QZTdMzuHlTsptZexI2PsDXirYJpWKEWCl0KkG64vTPepGRL5Q7dnwaE+vZwNdtaakrn80Bi9Wgs0UzB+OateQqyeo3Zi2U9E67BgLZDvWZGEJD2lTXk2Xv6gnHzyWkPp7+9J71r45hItkLzchOMTI8z0uXoHkY5eS86CQErThxrMuz+R8WW1rXQul6y5U/SIVT0bES/bcxuLdyjRo5Ok5o0ElrqwufwRD5G+OgulPTND23Lf7fJ+h4nKVQAcFzGMIbNqGDaLXy0taiQxEKSBOQ4AR01mZ82oYn4wvgvCilKldy59D7tD1gLAHfHBzkljXgwQ7VOZm7K8zfdhp6KcSh9b0AjkMEn/0RmrLAVMo7bfkdIzwa6IT0SUbwV6CockMkOAXQZw/6XH6sSCupJJZKCfbr2XJYK5j3fGJYsxKR+2YhUQ1RqKmwb1FqN4l+Jr/GMfBrMq5Oi6LGrwsPSilcdh/tkkFrEmuJt7WrYcmHg/Xv9ko7ol4lHGk/xWp+kWJPRxSOfR+4d9+aIiyrhJ5mId/E79ca/VRHJ1vZY4vdjqfnNj1XBHvC2mYaYmn/is/KjrMgH1x1pEy/OEQB98LqqFF7LHwdsWKZ5+WnPBQ3eYzTWQTNOIRKRYYqb5wcaTwBWI6SfKRyuKdDJXeSaIKdZ4Uz6e8e61ROX6bLifrddDGIbGRtaEgCx++NU6Uz9oLYjsjlLNObjb4HrwfzWGCttcC+4lnbov7vYRuLzIM2cLoXdiBVQr1724/4QhDJGoyBX7XNGNzeIfnDeHyZZ0DlHRSiRWXVCTBUVue2j4WU4sjh2EstPFI0HZhs6bV0pRMJXQ64ngN3lOPdsnCUjMnf8vlQOzHJ2b5gcj6iEDHr4nFMDEGMYHN7A/oUJO3HofkcrbcFiC/z6DN8WE0R3EAUeg5lhVoypVWygtps5gBblDPRKBrIeAX1IS9sP7XAwLpcX57u9af3oBvGurRu81D86tbQDNWOA+NK/vVDuCuhwXOvZwkUSRiLqdJYtdoQLPICpyAk6UPn2pHiFKl4rmQtCGAtFGpw38qE/xKbN3s4IxabUWraLOQMREiHoYfLx80euBHqP+JUE5Glg78y+s+m5ywwbq9HD+08nsOc2uOKA3mNz6fz+4HLsioXG9Ogc31qzTSj6xKDAKP6H8/fJ+Bgf9VK+8ZAKzJawuxSJhGDD9EtCvSEpqUZtAdtTPbyLAHHv5SxLp1CzJ8K5p19VoVbw2wotOXUBH2aQ5eXrJzr4dPDIbqRbgvx/uL2yodBhDZgmcuySa9McXaLjs3r+9UkLk4iWqKWRjCACxQYsGbpfDpLraYkD14kX3fDWgnLTfif67Ns0p7RFyg7iUq9dPs3XsWXxLEguZgifldCSgvU7OZOdWGtKEx20bOTS5UUf8N449KBAIspU6TwZz0uDLCxbZfuM/FopWLBN0PfWgNyCKCImzvOb0tWTA37iSY7HWC8Hlr/Aru4ckdyY9o3AUY8E2O99719yr1Xq/N1SVM7HzCEutlwtNWlDpabe0dQZs27ZTWuBuT0Xj5YipaZj837VrBSiuN3rzKw2MFvTRZh1HCW0kcouUssQyCsa/LywzkJTc+rOaqPJygkRA1u7xfbEGSbh9vcMhWqPPxMBW4N58IiYJZL6KncDHh2ydAtlGSOty9PwMMb1+E4QoP3GnovN1fvl1gGBqt/jz/eR/B4XZowyoY6VjUb/diAesuTq89YzQS3E6D8N0DDId9fP7jw5GrxL1BTCrzHsJkVmXRZ898oPJUMTwSCqMLcTiJ5I/Z21OgtB7lm1Y3zpsVerTcUpnviKd9cKE+GQdWXne79ZPe0oCZ5RwCIBeZcUIgWlD/8NXyMrvMHB5AdVuzqeB9EpK7hhHXRvCnZI11zI0QYxmkT2x4NOn9QOuwgC/uAOagVTvcYtjZ39GGJadp0EjAJUl99XL/QU3aik7lJzQ9xne9U3liSGVfFU598jWoGtQiIz4lr4qzggmJAOUL+3crsUqCDkA9d/QJ4ldmxhtqazMl/KT4evMDw9N5ieOJirQcRtUu7Z6IM9X747U4vF50KizY9k57yxR72hWemwh+kAyPURZGuAnbV/zjfeGH4Hlp92c3ITByQJNHtuK5nqluZ/FeGuTcjC3jDlbNH70106W3olbQa0lKEU5yqwykzEBZh2Iqw1yQu6pbArpsjjGnJyqEZszptw2fdyP8jZOpGnBs4reZQm3m7ioEC2+7doDm9avpkgsxo7c0pCeFdp6aP2faNu43KFYTI4OPEH7ANod55/o+COKH6R4QpvRy67+O5yqstPn4dpPnyQf8YXM44170rrzWD8sIlFBAOmu1mKWyHVLyqI7ZuLfcL50ZpbB+XqTlis06REHAn4dSNFRycxYfYLqVGbeLZbSdmGry8rrR4ifxpSlNWBmLnbzLpFEKHqY9fcZIzqhrHveY5f/9HFKBpBLNeeW+LjvXSQ0AzGN0QxGV/39YLEmTzkpcuRaIwBwQ06MTp37kXegfOgj5ZqpJu1D5q7m3nWE8LtgXRL13g5vQTXKdVfitwwiwIjDf4Ss8Jyb4nVjQOQRKp/sWARrcysx1aTJ+Vi+h2oxzJPARlRGA4Apwj73C7VKcsXUCX6T7P9wrVHQP8AWZdSWICeivGeSm16LXH4AhesEaa15SQbyB4MkxTvVXBpEBwo/a2AuM4HK4jnO5CiUjbDKl9Zi/oxATzEI0/b1ZELcuhVVLphnAHAPSk7StePUNbGSfA5OF/3Qhx2XuZLsrrMc6IS3Fd+NRaqieRFk8av0aHn+a7KYz0CEj9A8wSPysxl36d/k/vtoMb3FW/LSLTpo1cRIrMdH1svkOSVSHuCv2bqHMMxjUYqdpHTfUjf2zPQuOcPYcX1Lcqd0Z9N9W/9xGOmI6YbW5gVacUce/vXjGIRuGhcs91S5UO9OW3KivAJv1tPlbTTpzbBH5SHXsOvIbmLqGzLmhabq2z1pWG56Y4PdZyh+ydlqJHBxC9D0YlXnRZateX89gg4RL8f2HlxQJ5z0tE0YvT0xNa5F9YwI1K/RbGyqeooHUm1ED36uh6LbK3rrUWdZk5zZXPlopgi9PCJqVDDlHWCDKoE7Semsp+EhX887m2tgE6Qd3JaicrFd5baKDAoea1LHN61FnLtKymYmxvNRxGflD2GaKsp/Bc+Q45aspkszQc/d71aDZFWYe8yRX8hSx+vvV4tqMvSwhcDCCfleuXYayq2u1JWKXZ/gEauhy102fL1ufil5AhHSILk6qMsgcRWlNz1sPBr4JM6dpwmK9+8rHS+TTyWhjMbj9DSxTGjetQjB8W2U9l3Jk0NXUihFJI1OrH8INx7DQwIaCO8aezrkWCHfmKT5iZHAIrcqx0dTPjNrnzhp1WvQZOgR0z/B2CaIDXQb5dD8+AIFME+jg6UADP+8dbhRt87/tBqWkNuPmzO32bTc5PI+tfItp18z85z2uGb4TZ8+pRgprcsFBPXQs0IAXq4aXvj5CRPMxK2Oa+KFu5gHLP2wTKdhOMsSSEtyGisZ3hHEgpWmLhDdi8Y86knpMgxef6PI+HVdp2DccCIWewKodSS4HlQQa0Pat9YH+DOjD/VbT3McdabM/1+N8+GDCohDJiFSNeBGiPI6s0GJCTirrNeZ7caifKc8ClXiHmwfisA1K/FPYjamSFaVW4PRLKOnnhodIFGbfBXlcDMDs8yGOA5y6jprRQ+WGRaiAXDbnjN5zNeP0qmCtlsN2RtGMazJGSOZ3hcpT1YOdKFsEU3qtyZZlwJzJBk+1W4uZnix8qjUlad6FjlAQFuQarrZbxlnV8Mw4QQmTH0TDWrTyFdRb1ZR/tAcgPvismbIadCUHfDvwtOktO5VDnl1KLlNDYnn8GekXupksHODGQJRTBc2NvO7ZSsHX2+80XaTYygcHN7SI+ZcP56iYAo05NOtV7nLINuRvXyzhoQkcKoIeR6wjE6oLe8MS+REpA2mSrFUPzB/cNn9xltxA6CH76eow1zLD6B5bQso7fFJcoVaeE6f3Btz6ZTHgYC+TFbezTafuPDCrY1fQWkkbozDu4k3whZwVV8cXN60cSSNx1RCUYUgrvwdZqMftlsguiJkyDJbAx2roZ163cdFlYD4a4MsbAisDpLMjxF61Sz6VGM11SxeM2HxUhwcOV+Yj5Q2hhk7s/3RqfeFVUSwrEmtpbfkT1mvqtlvNlHmABt3cRaATmOMHQJ8PvUXHif42LYrDX6e4/Vwwu00DSU7f45IkJJZQRnnkymfCScM6tbFIXw/opBHMpmtnpemmgvGR7RVilIHTwC6IscplPG8R24FmY47LuKy9ZJlGG1eKDT0NJN517HUcpLqV4W83jKts7EI1s9GQa+gWTfSZGw2uJoVpBbtyAsbWKsShPTAmAQGLoCMH/e5aqO1zY3muvrHKlDPGGSfdVowyivrxZxntqPnvknYA1AUqQ0cME8KYflW4FRd49/xESetX4R9Fnnmwu58Hk9Xh7JQiiSaCv+onubSi6FdKFm7io49dz4F2qrnWxMTeJFMWNZ9Aby8qkey07ctI+X/EucLweE6v3q3EnUQaW9B6e5gOuFRfEaMduYEWpSZ6n5Xq5zFkTF+lvV9qOq91bwpEEm/TDRR09VY3k3ofTUbyzEtEQ+as5iJM1um3HfBMrdgFZmqzltuVlt/LElmwOqvPu6Q9vpJBesQkzH02yHFT5S5Wpd8uv0KpaNCIl4Zv3SBHLCJ3GIrpjV33YxPRpqqM7GgQWX5qNkDBZ0C6FEjOG3kGGtiXM4Ag9HrLpjfLUjGM3S/Kczh1Q8fihYYJ3sDxnIAWc3IOSED2UaowaDd4hYbSIWe5LWs0ufChrBy9IAlSXC+8jRDYx/B/yem7kwCVFFSyEs6fswOhYoUeT8Ieyq94OiU4S1VbIukA99Jie0zJ8fYKIqCpHqBtXduKJuyTIRQjVk+Y/NTEMYPuDyRopI4uFZai+Aeg2D6ggfnBWzifs/mFOJThL/GPQotb+BjleloAArW4bh88hNtYNxGzFWnTqOsFG14HYt7zS5/ByMjJj4wanC2Td8ek17h9ZfjaeFVYTcN+f9d4wLyimih1Di/DE2h0pd8i2uSPrb/fyYJjimh/Qe20+EFAsV6arAmzqh2ARdBnDyTZhLyWztv65pTpafyepvFNy1kQykFbIvLD0N6vRyJ3gpGnlOt3ivlSCCX6RY860qM3xXMgOURI9iG7YVVO+Aekmh1UBYB6wMD96MvreX5aYIkdda1YuxrsDau/qv9/aM1w2ifce0/0GPnMVoflUeku7pbGDazfg3exKTULL83MRYDDTm/aqJTa3kJQJa4B4157JvxgdRO/2P9dRvJKkuFMoPJUri2FLFB6qh1o8zZ66Y1VCH3R+LKAAPo7IiccUVbhHmoU7eL+2e/5t0Eqj5XQtXoSKDsVHVs3U4bRPUVM47Ta2bQSOX0lIAr/U+l4awFwr9p3I6XgrKW+WtE/F4pXSoYPkClJPcVfr1trPwiX06i2AygV0D0JVPvEIExl2gG+PFBxDWI236Kr+0zaEIg2TYJ9luKFN/vAHkpLb230ZpEX2ZwiaHH75w+PGhP9vJrSLFd5oz7YboesCX31PN5PWDyKzKvyYZouxbItiKNa8D++hG9VqLXeXf7uwSrXt9BnVNXGSQWW94liv5AYCFXyIsESMyB2ja+mKZudvCvhBS98meeD4x5v2hQfgnQH9jIQqsvFF4IFu+aPtQCjWypJlh0kc1rvxaZMEDE34kDrgvbCzmmJEZwrmCZj+eXXsgcKoERCjaD+rNcfZkoCxUHYa2abct5PJ+0EKQUaHQA6BFylrNv6PnAqWCBalR2TmGbr6p2l+nGGT+gK07sWu2HKV01SaHiM898D9ZUeov9t1TjxxHhcqzNl1fD6zOPi5oGkyauHADkjRd67IShA4gwuRCPt3z6NNpDkhdlD+vqMOTZNh3+ZdxD60g0vJo8Lw8FEbIAw5l1tdsAWRxgxfEit1IZ+NwZ7HRS/g6alD9l5WsDTbL1d4MLIMU40hvLkQyaIu3qd6TFr8Lhl4DMWaGEgTvlGt0G/cf6EQAQtRH1y8xGiu5xcrKKQIUZIBsDnOMYbs+r8iGRVmP4IqIpX6fqEU3KziYyGSKuCcCPWwR4EYbBU2AvS96mWTVreq3f4nHr3Sre974O5bZUg3SDB9crIfHZUnoIlM1zi7L05N6R/BK0akXPU0xyl4cwSlAg2titTeMsIslBlMnrToKsnMp3MeWyY6l2vXW9XXnKkv5zuQSHQr9e5XjsIZgekrDT/Rz5itQnxqBuMfBTGEV3fXCTHuQzqpJ+HPlYHL+E30+0PTpnd+BlYRCGbOvEz+Z2WFEe6YIdN7zcuXNPBzX/lpsQcXkj3Y13ambGbS0iZT6WhhtYnA5SFNIy2O+aPV3pQ8XnCrefzr8tomW8IcyjVzdX7S0FnsbWSkPquVx9T/vDdzKw1vUo09z8zMfvxcJPVnh1IyITqedYy9B6VbU16C0c4laEiLqBaKw+ewxprMyLZ4ijcA/OPc+4hrXsIR2GuQNYaAbuizme0LWKZG3mhNljfuZ/Xrg+t5X1wgWAf7T4yIQqgOulGRYBPnJr7upUkHM163qWS6F2dBdfQbh6vKsazEZhL+Qecum86guXMccJ3V3ldn576LrX5cqIg50jZv6z9Q454giCuEnNK6JQ8p+sTaSpk+JhYC8pfk639hJklMPceDjquo8jYLQI+3lmA1zOyymBZdMnBRD83zoT48izl/Wrt3p9tjRkYP6IycnUxV5COHp1DkAxgGL9u52Er0j1hcTAlF6yWy6NK1QhKKoe15ZN2g2OETfDIfdOjvuPkScDUIbT6aZCoDcCHgUuhXAhKn1DyuT0BjXimCoQnKDa+jGuHNFfVbgt/XJGiRFIUWQMbBrbGKCJniAd73B3M2zY3x+ea3FXwjFoRSgm3I8LUlY93V35XKCIrdWOZYJYBpMHn1FINLkkn3FVS3lPV3BUi6wmeKEA4ibydOvgVoHhfgsaVajuvO4f09ariDcT5OTKusaaeEVqXDnb4TiAVk6OVZGsFI/StXyw8JeIAi55Y270fv4wkZh7990sWxuFMPLBkRmfyAM7MfRajbwonCDnlWP/gZtrZhuaRjSZ7NjuVzcQ00vapcmYUoemilUkXGPAXEIcPKUy9M7JnXrkwvmIMNqEDE9N/znCd7t/da8VR3BinSv5Vovyfuqx3vDtBxzLU3Q0hVfJMzLLdSvnvVuySsTnwSRWREbjOsMcS4yWx73ZhSNTwVl/CetEiF+XFzxzEiHTsDRlQbpaCV2Dk0OOyMb8Uj0AUqYLDN4K6U/I8zPSlAEnzqo5/l2PorwrZwtBg4rGGVWDE1BpJ4u94XBG7Cd4ocX9Ld00I1Mwi03K9zNJwduH+29ibcywr+n18/apH4cHljgiJM4i3imW7GZwaknfTN6P4ejMYIbGYzljYw+yuV9QHryIJ8IIY6HZ8kHpDB9/IR2H0BwTEaZ7Pv4OyRAqmQPq9xDp3lStFfgQgWh8usWM4/YdvAEYEzjKEVRkOMktbT6OuYcVItO4Qb2W9Bnvl9w/MD/5ESxZzoMPPPXqAiU/wd1KnUQQ4qgG2o22MrxFoM4gWtVT3bAq+E+ZbUlKD6cAu9UFK/eaC85e9v6tekvBxJXwwupIHKYhzxVQFAUurSXsjDTZiJ9515C1Dy9kR5XBHRF37d8ecj7JpA+yjK8BGKIlTsDXQw2f1F9I5+m1u/VYWMbnTbA1Knp6k/2EsWwge88CCxrtpLai9tLEZZWAd90uZf4LoLrWx7l9bLKdxpVK5eP3gDz/M8a6/l5tIxOYO73WcYT1f6lQa2HGKNKXo6WmAqH/31smqFlt1NxyM7kx+zecAzZxs1o4L8s2oZrgtIVTN4fYyfvFi34GScHWZEJ10fkzoJOnGidgr9cIuW2eH0JYqNSqHrXqDFu30Q6k090XiksGUf1C9GRC5deof/z7H2YCYVDokAjloWTUlttdJ84GUQpMZ/rtf+0xxph4wvgHICYkMuLtypQ2ST1czBVcm2ghYBT088r6K3s58vpFp9eG34lWZD0BhKJGjcGuMqoiwQx0POPl/Tprv/kYFYCDT85I4g0pFBhpsigjzy1AW2d1tMTpIX6q0Ug95DTvhXD70R7pKbskBrVmiiToJJXovapyzHSM7yGqOKtX7V9s+i8dU1bW24u0EAGeblVP5QjaRc3Atmb/rsu93LqBBKq/lf9w0B8Se5xgfMiuix5WesdwLp2c/FWUK+WxPkcLRKGFcKtWkYfv2RSRkoPy1h6fa7AWe5mOyLKeNUEObEs0IJKnffzrE+jTicJ7jegZVy/UXwNiiiNZc8VKnOF6y6eJIf5LQK20jsIwyfJpmNq8BobAiDjDlBZSrS1+dfk1sNzbvMj7QKk1I8qqsBbPbFtsXiMTksA40UVl0g0ckTd3ZkNTncvIzxn6VTDO70u63LFT02pckhvT5y7kYV7YapmyjS1nXCJpPE+AgFDwrJ/ZKcLCfYQ3O7bf0JUUM4V3YO4MMseL8ZnRcvlgdmefbpkcouhnRN1yAIvEzIPil/lyPRxzvwaSiJ3jBSrhhPi1XRk/iCrSijqHljTTvLt+MomTSzUTfL9Zwa55D50oDTxZwda44XVAlryZxczfJrGBKAv3qorlg+6WOn78f8ZcFXIAIk3+WZEgxZdjdP9rXtbgPcZhpK8r3Ln1qj7xA3+CVt4RRy90jo+KN2hjEr9RscfCBU8cBN1Qao5ppN4A877O2Cd2t/7rWflK+U+iUN2ks2+HOkUEmxYBh3GMluKmhzJ9fcmZKex+5jHqONg4hyIrhXMzAherFZTNZhyPkgqDg3rJRwgXPj3qbQtwolDIlDlrA0q+xRSn6jA61VKvuD0UUd4q+emyIvvj2RA4lc6mFfeT3XdqGZFE9B2HAyhRkzQxREHoP3LvAGnxCPK3yF4fEEN2yFrgTRaiZ8RFZxqq2+wz4nS9n+OXGJjYCjM6cfU/jYTDF/ZpwVIAYDnOiMc0bC3IaGU3bBve63JGphCPU7MJJ91sdLPICFeoczvDNVrfqsx8wWYo4atsSdS9pBe9UH82Y0h2zAFr8jh0GZiBZuX05eVSHrz6R0LQNlO0bCxYjFFfbPB4asBObaXFmEJ8KBKlENZ0kA/TVc4tbgEWYzpeB2zbf+6Is+d7euYhZ/GOrxoOSEQlvJJh8VYVxo7tuYz8VUiefisdR1Oc5hPmnzqglHE2+1pNXcbPQvkBZ/sg2ruJfldKHIsV37o9a63Pxy5UvAy2nN4TyZeFHC2A26Uci7pfxmNd1d7B0CoyN0kDlT4OQLyZg5rDTADBjq8LxETtvp1M1nbZQwMsovVvjZh/hECkSZoCrQ09ClH1xZjK3mmcRMx7RecCYM4w5Y3VOm3WFAVAQW4JR2sJY9KuViaeI8/KuyLJ0yyrSI/GHaHUUOQtjZv4CznmqW5eTz334dVi4Dq6G3i5U4Q+Hr9vw5QK1/sbMEs3L9ljxRBrnNB0pBmmkSjUzolU8TWzK/InnbNvEBTFzMTcKqh7hr/Jkc75tghxMPIjtFvJAEgGEQfenIw10znHVNFVfk9/bTUODIMSUBIP9aa1PKDRPxAr9cBn5mIFqvnZMf9BdmihxeDtVa9kKWRaV3D5+FMuDdWKpLD/Qj8bYO+3aCX4jjIUHVYnGLJrOhuJETFc49c7IeqrlssHoQSGRRoisv742EFB8FPdkU5hVo/p7xM5QmiOkJfbu7dtNOSokslwC1x6bQBeuBU3JVCKBOdTV0u87/9PACnyUwthyuC1LibZnCgO9AayNTvDHRaC7dlZ95wF8TShB6w/GOy10fxewdqGBqpt3NIAue7tT5J20CjD++na3DAoQ9m6DYa/wYDBwx43w0dTsss/GlVXJpuh7Z3yj48sTEiZqqV0Yab7PxNhqEDtKBZIaTOzlNP+6YInmLK5GNtbo5LXOkUrI66ibs0m11Ruksj5MfQ8Ha94IvBcK5h8d/aHRHYZBhs7LLmqJGJQArd5u7ClhP9HwF85JU+Dw6kl/lyw/BaBzm4fWpepd7aKu1Otn7R2WvkHLObyEpQ52bu+8fQPRj+3AhC9f/OHoXhcWhXSDpJEnhKBOSCc6Neo9dZdNakC2tNUl9i9P6CQ97Hfu4G2FfcZChTEPk0yEbNBJx2XGXUlHThy019L+ap4RDfn9FfSXpwvaILmK0+svXHllvVGez676Mj0jkRCzHSQrKj/u9ddsBkfekUCwaNCsekdGImdkos0AEdma7SqULKKa/xqfA4e/TfW6qSGqi4y6O7gT1R9A8n9y9w4ASpSGuqwh8XvL6LZcZr2hJ0Bbozy/OGAkB93ncWUnXGL3jbaCBP/zGBl2ptsndOIGohu0dWezVMiULSg3WxItnUP0+N8KWB9z9AlGplTXOyhrLeWWsQqmcwGgo044vlFf3yMOoRPFoEN6+qn695kaj6CbKFalTvHfzQQ7HkzWlqENgPdukprJRufzM7IUKBSSgwKzG9YxKWeImleWp9youFwtrYNnC3RZDVTSRpWV71BuwKVZ3GwfcPyeQqvS5puZ+Y9HMVDp/oAfuoElkbbpYTH7O/qEEWoU7r0Pkd+X9z+M7olEaZG6U7QseZNS0SA8LQs7d/ReFxzVjWBliMm9Me+PSLL9ArcxTbVARdE+6b5znmfD6OYk9qac0kkEoUGrqxcL1NX7hNWsRF+SKJWBI3HS9oQyjbfCcUyh2M33IzLIkuIcXRnFahlnrAS7twYFcfw4z4gzwDTe12UZPjzaEHHNZ4rE7E2ddEe8/gKMw9TlvgrZNAPs5G8ZNatXV6YYo62IQdikmcxRO+Y443Vu00WaIaACg7j56sw8CPHK7dWtGVutXkrHL6KIZCsE86jgw+Z1x0Iz3KmRTdRMQmhJ91wYtX5quXhaxFhbX30k7r4i77DjRWnoMa5EGYPsZ2xaUUIJ0MJox6FsqvMJC92F8GHsTVq/a+Y/GiaQDmZfnagMRi+DogQqJONX+ubUhOycjliOjY1vQWocK9b4VbQIq2I2RUaGxJg//1UeWK0yeZEi/hNN3MQWvxuCXT5Bi9CNuuF/nCY0jntzBhvO5pUVOddVk2QdMGO6E5k+x16l+cWxVsR2YhdWVBdmY1ypjclSfuWADcPcZ5sqXmyNcGYi663UKzduQvjePyIAH7oNB/GQx2YEp6CGmyBN51rpb5Jnz1aCxr+MDSRMYjqSTeciGTw1K7+TbuceqzmSWu3RAO0f28/cggsEkNsqPcOuebOos5x15Eteny65pv6Ej+SfzyciRsbfeUQVzi+EkoMKZOOFOdq2DBibrTMdOvCJXM6bOtRj/j+pjOl5g4VTdxaHjSXpZG+W6cYXE2qvqeuxkr05StswfNHtxsPvKiF9n8im7lDAEGQXfOuH0U4/4Phm8RRGiEablN0FWLde48XSwG0gSnZGiYoxftSe7xurP9iwxBAf9yiBCvf+xJDHbReSIwC62nRCB19GGWixZskjG8gyz30VUBUuWwTtv3UapLk2vHqMwlXnFG00/ZPKKyDVSDIZDJDUq/mp8t2/+aO5cuAVJOU2Eph8EJC/fruxAr1SK4YW7bSJTiMdW1ZtbLeUCeA2XuME/TExFIvWPX7ZfMgh/0URPERiIil3y+8w2O5wmqbRvbGvZHVgpyEPx+Z5dp0m9eys1RAiBq3eaCAPHdJgtEdEQRd42MoUdArQdP3qUm+vacQxWIA2mDvLUHHO/l9Gz3oKuQmw5h6n8Yp3RfCTPetLJa+UvfBwDbB76V3nRmS6oZYfiPCfxIRMRN22fd5+iT1P6ywmHkY1jZuhSrkETBEjx4EB8lp91LjTAlKKq9BQcgWSrXx7i9b5wVperCvIHcP69tc5dmFGLIvvQvM8EgQ+dNyaA123WMftaqhvGxIhjmX/P5zlhlnZZEgTfC73qMf9oJtSnlA5Dkv2sZAB5Liv0i3Pfhak4HeAyDm2oR7Vb8HJ7uRPVp884GwBM+O6L276eaoUN3wwy1nV/1nEd7iNAm5LI+Icqssn9skqs0oX3aaJLp+3zlGNbYs5F9cwtncl0pTlA4o2s6VbUS1I6H5rycF1XACL6GrNJDaeLs2lg7IGPlTJUw/ibOv3BPsdzJPq2yeiSWzuJwnte3aq96Hk8annNF1Az6LV2wiAjxaf5UDzuDdAkWGhr1zKwPn1n6uQWy3qbmx0n1c9X5jJs5gzgDotCpksQYXJj8jfsrZXkSJ++k1vRDdocIufCQZcVn3EBL0Hds0+Oo/F5DXuIamnTRsqmG6xFGk7UYsG5wIL5N2DggJzuxqlpnJvHLQFp4tL1RAt8llktYrEtZZNB6RKshEf2MhBdxIu7IKAU0NyNumZV7lAVA2UfT/gOdXE1K9QN6MNCO7yKJbh/GQQoB/2AQv1dMbw6EqeCaH4h7b7NasOSMKNbgupL2jlG1g28BnHsKN8NqENSvd4VEIdHg9ICGKtYWgoMa0nbl0TzQUm01CoWj5DR/TqkCWZx4YqBwnitHtYCa7OL+1JHUWIv5AApiYTKxkQ4iVEodld8stSduIxA+Bgua6093xx1hH2mybzoWEUrQ0hYp4p8cLb9aCjx3frSLTm/GBWfp/q/zzfKPRuaT2Y1ue0pB/6S6E0GV9UTsT1UzxoQGlWJmZDh3O5Bvfp3uyTApeVR05MCzpOwR2C6V3kv/AnokDhxoUCtRWTvbxXbstLdkuGbejeUZZWIWQ1Vo61a5Lp9oLTh523JZI/fkI0CTnC/mhPmdSzsDM8UK7Yu/c2EwXlNxhUyridblO2xrmRjiOcmpDVri06azG/ereCr9QKA6r31H5UqJ24arxII79qn76MQVVtcmZgu/c8YoBD3Prvpj/YWpAJtkLqkNvb5u9gRCe4UQnUkfo3rrcPLxMggZiAxBANTdPDbC+uckLs6FxAXtfeBZ5yqYFHZfcwnXl2Ocxy1UVnxI+PqE4OXbYpyrJnXB4DfV69ydT7ZDSnqZ/yFUCbEZCZRcDoJQSSPgRuieh/xVOdwPdkEEn3I9aO3WlTK5zqmiS3vexZbDCg/qbI3wz1Zv3jT/SAmIRjb8m1MEkMGllEZLdL5wk8VarDURtd6JedL20AOpAFkg4+clP24dHSTQx7v3svfaTgBmMtQvc9IG/Yz7afUHXMtMWcxuFR/x5+F0l01Y4vXybRa8UVIOYJ/MU0ww8xu5YuWKLZKA3opz3HXlHfHUKSyXhFHXdtj7KJQni/zok2RKD342uXWiFyvktwtT3EBtPf0zIhtM4wJ5KsoO0rICukGkkKWsOWQSXAP4KH4v006CYEs5UXzcTDGPCHGIq6ieqO5ePWzGsyN4aM0v1vMrNYPa5qD8xY+xbG2490bolEnKXF7TZjCLNAY2GGXggvzwMVeTPstyqeE4oqOuQj31/LKZa5DcaDMginGiqetNC/u+R2YulyyVp+1YUD6muWmq1UHX9w/a/ccZx4POyXyWKOAo3kKmE4Gf/B7uN1Cno8ZdiBVuxLKQIdVvwGe5gNySmTg72qxeqIFEx7hztqCCWEgP7137bRf3KhKP8AGIP4dODaSZW2TMLbWGIFQCYMWbFVnXT+YE7umM6iafHrNZUvKXR7WOoTzvSTZVFOfCMXH2XyuLjZKbwQgsMy/gy1+19CkqWBeIcOb8VvyGDmOk0yK+GE3SEa6Ci/o7q6CCWxbm/5cMDYzyWx0R7IFh971Yv4iBaW5OZiHbBrlHamFtWtK6gkBekrfNJ4FHBdmdVJegyw4nOhFfNdVhmA4O6nmZX14IQkIyfSIND6GWdeAtzId0DQA7FTUUKLfjL3LhMdbt14+/ws28SLSFG5iX2fXlJFD6kD8+6f613PGeog4GRsmm7ewmvUhvvnAhkI81qmfb2PrDlbhGoOE9bFZ3HzI9PDTbqogrODQve/BC4a95/1z/gi7wzBB4xu3KhCiSE5oDSSp7ViZcSK+QOJkk7qAi/YeMt1l9utru2UIeaNBWvIvyjwNFNgRibYF0rlsaUfS2MYCogMwGeRleY5zzVBJF+qs2/1Lwxed1JQyu2N/aOxCY0gV45zW9gf8IUHQuXTY9mqDUh6qMaJBnO3KveZsdDS2EOe00/oRHAcEwdvrqHqiWXFJxQ3IHmz0GHKJI2rFrDTn8newI4IEmEfUSSuxkvjCLS9y14W5Iu0SqLK2ndHGkiRVCBAyBz2n+Nu+JpU4dFdo7FBrQiUEEciKj6lT/rgrM0wshp/GQhaIPMOfJgZPZQt6lSyoiy5HPCboAXabRlmwGft804Ri34TL1Az9mO3ovzaudjh3hfARsBdYoBN3oWP8RN4fUFeKtx/tDJupj5X5RHl5alfiTLL6VeQwHpUX52L0mH2UptqlRRsl98y5iQuJjluJTgXyoDrFDH+QMdTEdJJRqzFTjla1J0I9fmAqv+mP0F+R2huZsPA6xSkTVLRNmpKTjfVt2yNiKEnijtk69iOO1s7wvAuPS6FNs+JwwEQs+X2ev0ijEVwYZeM0dPt3i6y/TuMGShRLhV7oMeW0cIFNeiim3UnEGdBZkO6O11GtQixyy+v71V1Qdavok9IWnb5k62RW7pEXB0UufOdW5aWL0EJnbxtyFM2Q2Kyb7zQ4P2pYjY6iRiZrGPhIpdoBahiPpOXKSOctK9BBzm73mxE1ibjf0ErRA1TYkMT6JyhLs47IoDSCbiinUn8SgMItwVfW8Ha0OwBAbyq2J+NzJVoUvuWsP+EOGCskzqKo8K18xw9btQGTx+nhziNzef5ko1qjRgXxJAlWgEXQig+F/kjAV7Z1/ytaAj+9mM2cnq1ATV0tuGSPEmAT/+cUiJli0MUGIJAJ32zp6BavEo+UQak+IspmV+OLncbLN/MrBpxvX4u0XHzeY0e6D6TbGr7jM7GCCH13Fl0dCpQ00jgMbg5vv9i0zt1g4bJynf47m708xvlUzh5ixrjkS2PdsyPrCiY0sn73Vyi8wgrBl1F5jgE5X1s9sybQwpG8KaUGA4KBgHcPr704NmkXxmg9bF/oHSQLs/7u3TvOwZ/hNg4jqobSaFNQO1rY3gO1efuezmN/zVKo2WpCf/C4Ydxp7DdI33KGBRA0bpo+shngwBJOFDKYAfOvw+RwbmjRhc/cEz7CpepoKx93Dq59GzVRsPFr/TB/2g7vtFaB2y47m0F0fj1YWtBq0Toss2bR7X6iUQRA/nho3CGl+AFuP30dmmsMzjvw8eYNmkOX+TgTCjKoe2nacMyjyOCaSaCzH/T8PbdyHC1GiEWAECfuA7BaXbUeAqQw9Yp+fQNKT8OkXxPfjZvSlXnyYrYRUwXJbtqJ5tt03K5N/V/xHF/7lXFPS1XC8+enXSSs5u+YPhl819+uA4ee8JirXj4XcER0iF+R/Q/s+QjBr2SXPQjt651rvB74ln6SMzpO+1ZRmAMgJBi5bkhd5vnMg9iFhfYsOhnasqf8TH+81iNzMCKLYps7Mj0c60ir34FgyaXg5WbJmBkOgnHB4gQuASGVqnpDp9qsxsAiJOz697iujlF/b1fKMLqfKUwJv7vZ7CZWtIPfh/AtWK/LwNAqox+IuWljL4uI9Pn8WQO6JCJJPr5iXO+S3vV+NS8bJ8mXUcytecpq1SaOhKAM5d3s+xI7KpOqF3Y4BkwedvTUxaqBqjIwRPAT7S4xsXtutp0UD4gZ0j/0j6TdqzYlLEVxYWvX6Y+TpFPEfFQKA03bvIbMS0JyE8sOH7hfmyyFkNCmRyEvR6luuxsQFRUze8nK/K28d4hqlLLimOacR0Ys8iefwFyiXFOWZvV5SzyP136tu1xj9zHtoAPzxA22lXhbzE5QGImL+DhXNkW90qi36W1V8FSQ1BvE5p9NeTgTCQaWKTWh3/h6GRaO2JGpNRn+edeq0whWSnQdFLo5gtIeT1GvbBHsUarKAIhNP5nOGVlJJZPZf49WBaukplSJ1YsbUqz7SNg6TnjDIjIRaWl3a6/Tlr7ZVLfkWjr7pfJxIkGc2EBoRiBgzbxSB4YknZopmIY84j3L3tNyYgoGELaVx+/8Lbd4CRovL8C7Y08x//HWpjR+5mJy47fg8h/KLeOMdtSxRIttTGHdOuijX92J9iMuPwzT0RGMBxqiNLV6YgTGxNBskBEKqgo6k+bO3iUKeBtKvOOirJCeBwL5btmRqO0lK2oRuNbZmM4hiTZudQr3916TTgLhQxqIb+1iZpoz83+0YQVGx+NVGz9szmJjR42tkw5kljObRP528uB3mWMmQet8reTH6z4xYG/mn9muuMNxgfLoAZ0GaODxvIde5RD4CjD3XeiWneyr9klDwjcuoFlUB4dnjoO9yAbGYYX4FhSffG+o4ufV+31ZUL7OSa7saLvGFxZniH1SflQgxkS1nW+hy0KGGBpaYpL96iPJoYyvJjcbn6QPnAZYl1UsdVXBf+8L9NHYr4sJhcNcXCtwv/NXqPGx5z5Ue7p4JkbT7eobIlCsssQeafwtukpsQF3HEuAWVuZRU3A5KjyAY7cn/L5GdgsMI0VHn86ofIpjuZY4HCq6zm6gOyi2yeiFhnWo3tFDyhCowuNRN+q+5YI2JIO19UnzIb5oA8GVotrYdAo7pcO6DBvSfSYtExiD4mxz9BQ3QzE5zgq9aA==";function Gx(){const s=atob(zx),e=new Uint8Array(s.length);for(let t=0;t<s.length;t++)e[t]=s.charCodeAt(t);return e}const mi=64,es=32,ro=256,cu=new WeakMap;function Vx(s,e){let t=cu.get(s);return t||(t=new Set,cu.set(s,t)),t.has(e)?!1:(t.add(e),!0)}function vh(s){return s?s.name?`"${s.name}"`:`(unnamed ${s.type||"Object3D"})`:"(null)"}function Ir(s,e=4){const t=s.slice(0,e).map(vh).join(", ");return s.length>e?`${t} and ${s.length-e} more`:t}class Hx{constructor(){this.staticBvh=null,this.staticBvhUniform=new lu,this.staticAttrTex=new Io,this.dynamicBvh=null,this.dynamicBvhUniform=new lu,this.dynamicAttrTex=new Io,this.dynamicMerged=null,this.dynamicPacked=null,this.dynamicPackedAttr=null,this.dynamic=[],this.hasDynamic=!1,this.hasDeforming=!1,this.hasSkinned=!1,this.warnings=[],this.staticSources=[],this.materialsTex=null,this.materials=[],this.volumeAlbedo=null,this.absorption=null,this.scattering=null,this.lightPosType=[],this.lightColorRadius=[],this.lightDirCone=[],this.lightCount=0,this.emissiveTriCount=0,this.triangleCount=0,this.emissiveTris=[],this._dynamicEmissive=[],this.hasDynamicEmissive=!1,this.lastEmissiveRefreshMs=0,this._m3=new Le,this._normalFrame=0,this._dynBuildVolume=null,this._skinVec=new P}updateDynamic(){if(!this.hasDynamic||this.dynamic.length===0)return;const e=this.dynamicMerged.getAttribute("position"),t=e.array,i=this.hasTextureTiles?8:4,n=this.dynamicPacked;let r=1/0,a=1/0,o=1/0,l=-1/0,c=-1/0,u=-1/0;for(const h of this.dynamic){h.mesh.updateWorldMatrix(!0,!1);const f=h.mesh.matrixWorld.elements,g=this._m3.getNormalMatrix(h.mesh.matrixWorld).elements;let x=h.start*3,m=h.start*i;if(h.skinned){const p=h.mesh;p.skeleton&&p.skeleton.update();const y=h.skinnedLocal,v=this._skinVec,_=h.srcVertexCount;for(let w=0;w<_;w++)p.getVertexPosition(w,v),y[w*3]=v.x,y[w*3+1]=v.y,y[w*3+2]=v.z;const T=h.indexMap;for(let w=0;w<h.count;w++){const R=T?T[w]:w,S=y[R*3],b=y[R*3+1],L=y[R*3+2],D=f[0]*S+f[4]*b+f[8]*L+f[12],F=f[1]*S+f[5]*b+f[9]*L+f[13],I=f[2]*S+f[6]*b+f[10]*L+f[14];t[x]=D,t[x+1]=F,t[x+2]=I,D<r&&(r=D),D>l&&(l=D),F<a&&(a=F),F>c&&(c=F),I<o&&(o=I),I>u&&(u=I),x+=3}let M=h.start*i;for(let w=0;w<h.count;w+=3){const R=(h.start+w)*3,S=t[R],b=t[R+1],L=t[R+2],D=t[R+3]-S,F=t[R+4]-b,I=t[R+5]-L,U=t[R+6]-S,B=t[R+7]-b,K=t[R+8]-L;let q=F*K-I*B,H=I*U-D*K,j=D*B-F*U;const Y=1/(Math.hypot(q,H,j)||1);q*=Y,H*=Y,j*=Y,n[M+0]=q,n[M+1]=H,n[M+2]=j,n[M+i]=q,n[M+i+1]=H,n[M+i+2]=j,n[M+2*i]=q,n[M+2*i+1]=H,n[M+2*i+2]=j,M+=3*i}}else if(h.deforming){const p=h.liveGeometry.getAttribute("position");if(p.count!==h.srcVertexCount)throw new Error(`three-realtime-rt: deforming mesh vertex count changed since compile (${h.srcVertexCount} -> ${p.count}); the merged BVH layout is fixed at compile time — call compileScene() again.`);const y=p.array,v=h.liveGeometry.getAttribute("normal"),_=v?v.array:null,T=h.indexMap,M=h.localNorm;for(let w=0;w<h.count;w++){const R=T?T[w]:w,S=y[R*3],b=y[R*3+1],L=y[R*3+2],D=f[0]*S+f[4]*b+f[8]*L+f[12],F=f[1]*S+f[5]*b+f[9]*L+f[13],I=f[2]*S+f[6]*b+f[10]*L+f[14];t[x]=D,t[x+1]=F,t[x+2]=I,D<r&&(r=D),D>l&&(l=D),F<a&&(a=F),F>c&&(c=F),I<o&&(o=I),I>u&&(u=I);let U,B,K;_?(U=_[R*3],B=_[R*3+1],K=_[R*3+2]):(U=M[w*3],B=M[w*3+1],K=M[w*3+2]);const q=g[0]*U+g[3]*B+g[6]*K,H=g[1]*U+g[4]*B+g[7]*K,j=g[2]*U+g[5]*B+g[8]*K,Y=1/(Math.hypot(q,H,j)||1);n[m]=q*Y,n[m+1]=H*Y,n[m+2]=j*Y,x+=3,m+=i}}else{const p=h.localPos,y=h.localNorm;for(let v=0;v<h.count;v++){const _=p[v*3],T=p[v*3+1],M=p[v*3+2],w=f[0]*_+f[4]*T+f[8]*M+f[12],R=f[1]*_+f[5]*T+f[9]*M+f[13],S=f[2]*_+f[6]*T+f[10]*M+f[14];t[x]=w,t[x+1]=R,t[x+2]=S,w<r&&(r=w),w>l&&(l=w),R<a&&(a=R),R>c&&(c=R),S<o&&(o=S),S>u&&(u=S);const b=y[v*3],L=y[v*3+1],D=y[v*3+2],F=g[0]*b+g[3]*L+g[6]*D,I=g[1]*b+g[4]*L+g[7]*D,U=g[2]*b+g[5]*L+g[8]*D,B=1/(Math.hypot(F,I,U)||1);n[m]=F*B,n[m+1]=I*B,n[m+2]=U*B,x+=3,m+=i}}}e.needsUpdate=!0;const d=Math.max(l-r,1e-6)*Math.max(c-a,1e-6)*Math.max(u-o,1e-6);this._dynBuildVolume==null&&(this._dynBuildVolume=d),d>this._dynBuildVolume*3||d<this._dynBuildVolume/3?(this.dynamicBvh=new oa(this.dynamicMerged,{strategy:sa}),this._dynBuildVolume=d):this.dynamicBvh.refit(),this.dynamicBvhUniform.updateFrom(this.dynamicBvh),(this.hasDeforming||this.hasSkinned||this._normalFrame++%8===0)&&this.dynamicAttrTex.updateFrom(this.dynamicPackedAttr),this.hasDynamicEmissive&&this._refreshDynamicEmissive()}_refreshDynamicEmissive(){const e=this._dynamicEmissive;if(e.length===0)return;const t=typeof performance<"u"?performance:Date,i=t.now(),n=this.materialsTex,r=n.image.data,a=n.image.width*4,o=this.dynamicMerged.getAttribute("position").array,l=this.emissiveTris;for(let c=0;c<e.length;c++){const u=e[c],d=u.off,h=o[d],f=o[d+1],g=o[d+2],x=o[d+3]-h,m=o[d+4]-f,p=o[d+5]-g,y=o[d+6]-h,v=o[d+7]-f,_=o[d+8]-g;let T=m*_-p*v,M=p*y-x*_,w=x*v-m*y;const R=Math.hypot(T,M,w),S=R*.5,b=R>1e-10?1/R:0;T*=b,M*=b,w*=b;const L=u.emit,D=l[u.row];D.v0[0]=h,D.v0[1]=f,D.v0[2]=g,D.e1[0]=x,D.e1[1]=m,D.e1[2]=p,D.e2[0]=y,D.e2[1]=v,D.e2[2]=_,D.n[0]=T,D.n[1]=M,D.n[2]=w,D.area=S;const F=a+u.row*16;r[F+0]=h,r[F+1]=f,r[F+2]=g,r[F+3]=S,r[F+4]=x,r[F+5]=m,r[F+6]=p,r[F+7]=L[0],r[F+8]=y,r[F+9]=v,r[F+10]=_,r[F+11]=L[1],r[F+12]=T,r[F+13]=M,r[F+14]=w,r[F+15]=L[2]}_h(r,a,l),n.needsUpdate=!0,this.lastEmissiveRefreshMs=t.now()-i}dispose(){this.staticBvhUniform.dispose(),this.staticAttrTex.dispose(),this.dynamicBvhUniform.dispose(),this.dynamicAttrTex.dispose(),this.materialsTex&&this.materialsTex.dispose(),this.staticBvh&&this.staticBvh.geometry.dispose(),this.dynamicMerged&&this.dynamicMerged.dispose(),this.staticSources=[]}}function Wx(s){const e=s.geometry.index,t=e?s.geometry.toNonIndexed():s.geometry.clone();t.getAttribute("normal")||(t.computeVertexNormals(),s.geometry.getAttribute("normal")||s.geometry.computeVertexNormals());const i=t.getAttribute("position").array.slice(),n=t.getAttribute("normal").array.slice(),r=new Tt;r.setAttribute("position",t.getAttribute("position").clone()),r.setAttribute("normal",t.getAttribute("normal").clone());const a=t.getAttribute("position").count;if(t.getAttribute("uv")!==void 0)r.setAttribute("uv",t.getAttribute("uv").clone());else{const u=new Float32Array(a*2);r.setAttribute("uv",new st(u,2))}r.applyMatrix4(s.matrixWorld);const l=e?s.geometry.index.array.slice():null,c=s.geometry.getAttribute("position").count;return{geo:r,localPos:i,localNorm:n,count:a,indexMap:l,srcVertexCount:c}}function Xx(s,e,t){const i=Array.isArray(s.material),n=s.geometry.groups,r=new Float32Array(e),a=[];if(i&&n&&n.length>0){const o=s.material[0];r.fill(t(o));for(const l of n){const c=s.material[l.materialIndex]??o;if(c.transparent)throw new Error(`three-realtime-rt: a transparent group material on a multi-material mesh is not supported for BVH tracing (transparent surfaces use the out-of-BVH straight-through blend path, which is per-mesh). Split the transparent group (materialIndex ${l.materialIndex}) into its own mesh.`);const u=t(c),d=Math.max(0,l.start),h=Math.min(e,l.start+l.count);for(let f=d;f<h;f++)r[f]=u;a.push({start:d,vcount:h-d,material:c})}}else{const o=i?s.material[0]:s.material;r.fill(t(o)),a.push({start:0,vcount:e,material:o})}return{matIdx:r,ranges:a}}const ao=new Map;let uu=!1;const Lr=new Map;let Dr=!0;const xh=128,qx=16;function Kx(s,e){try{const t=s.image,i=t&&(t.width||t.videoWidth||0),n=t&&(t.height||t.videoHeight||0);if(!t||i<=0||n<=0||typeof document>"u")return null;const r=document.createElement("canvas");r.width=e,r.height=e;const a=r.getContext("2d",{willReadFrequently:!0});a.drawImage(t,0,0,e,e);const o=a.getImageData(0,0,e,e).data;if(s.colorSpace!==Wt&&s.colorSpace!==di)for(let c=0;c<o.length;c+=4)o[c]=Math.round(jn(o[c]/255)*255),o[c+1]=Math.round(jn(o[c+1]/255)*255),o[c+2]=Math.round(jn(o[c+2]/255)*255);return o}catch{return null}}function jx(s,e,t){const i=new Map;for(let a=0;a<s.length;a++){const o=s[a];if(o){if(o.map&&o.map.image){const l=o.map.image;let c=i.get(l);c||(c={albedoMats:new Set,emissiveMats:new Set},i.set(l,c)),c.albedoMats.add(a)}if(o.emissiveMap&&o.emissiveMap.image){const l=o.emissiveMap.image;let c=i.get(l);c||(c={albedoMats:new Set,emissiveMats:new Set},i.set(l,c)),c.emissiveMats.add(a)}}}if(i.size===0)return{tiles:[],tileIndexForMat:null,hasTiles:!1};const n=[],r=new Array(s.length);for(let a=0;a<s.length;a++)r[a]={albedo:-1,emissive:-1};for(const[a,o]of i){let l=Lr.get(a);if(l===void 0){let u=null;for(let d=0;d<s.length;d++){const h=s[d];if(h){if(h.map&&h.map.image===a){u=h.map;break}if(h.emissiveMap&&h.emissiveMap.image===a){u=h.emissiveMap;break}}}l=u?Kx(u,e):null,Lr.set(a,l)}if(!l){Dr&&(Dr=!1,console.warn("three-realtime-rt: a texture map could not be read on the CPU (CORS-tainted or not yet decoded) for secondary-ray sampling — that material will use its averaged colour for traced rays. Serve the texture same-origin (or set image.crossOrigin) to enable per-texel shading through glass/reflections/GI."));continue}if(n.length>=t){if(Dr){Dr=!1;const u=[];for(const[d]of i){if(!Lr.has(d)||Lr.get(d)===null)continue;if(!n.some(f=>f.image===d))for(let f=0;f<s.length;f++){const g=s[f];if(g&&(g.map&&g.map.image===d||g.emissiveMap&&g.emissiveMap.image===d)){u.push(g.name||`material ${f}`);break}}}console.warn(`three-realtime-rt: texture tile budget exceeded (max ${t}). Dropped textures: ${u.join(", ")||"(unknown)"}. These materials use their averaged colour for traced secondary rays.`)}continue}const c=n.length;n.push({image:a,data:l});for(const u of o.albedoMats)r[u].albedo=c;for(const u of o.emissiveMats)r[u].emissive=c}return{tiles:n,tileIndexForMat:r,hasTiles:n.length>0}}function jn(s){return s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4)}function yh(s){if(ao.has(s))return ao.get(s);let e=null;try{const t=s.image,i=t&&(t.width||t.videoWidth||0),n=t&&(t.height||t.videoHeight||0);if(t&&i>0&&n>0&&typeof document<"u"){const a=document.createElement("canvas");a.width=16,a.height=16;const o=a.getContext("2d",{willReadFrequently:!0});o.drawImage(t,0,0,16,16);const l=o.getImageData(0,0,16,16).data,c=s.colorSpace!==Wt&&s.colorSpace!==di;let u=0,d=0,h=0;const f=l.length/4;for(let g=0;g<l.length;g+=4)c?(u+=jn(l[g]/255),d+=jn(l[g+1]/255),h+=jn(l[g+2]/255)):(u+=l[g]/255,d+=l[g+1]/255,h+=l[g+2]/255);e=[u/f,d/f,h/f]}}catch{e=null}return e===null&&!uu&&(uu=!0,console.info("three-realtime-rt: an emissiveMap could not be read on the CPU (CORS-tainted or not yet decoded), so its mesh casts no area light — it is still drawn per-pixel in the G-buffer. Serve the texture same-origin (or set image.crossOrigin) to enable the average-colour approximation.")),ao.set(s,e),e}function Lo(s){if(!s.emissive)return null;const e=s.emissiveIntensity??1;if(e<=0||s.emissive.r+s.emissive.g+s.emissive.b<=0)return null;if(s.emissiveMap!=null){const t=yh(s.emissiveMap);if(t==null)return null;const i=[s.emissive.r*e*t[0],s.emissive.g*e*t[1],s.emissive.b*e*t[2]];return .2126*i[0]+.7152*i[1]+.0722*i[2]<.001?null:i}return[s.emissive.r*e,s.emissive.g*e,s.emissive.b*e]}function Yx(s){let e=null,t=0;for(let i=0;i<s.length;i++){const n=s[i]&&s[i].userData&&s[i].userData.rtVolumeAlbedo;if(!n)continue;if(e){t++;continue}const r=n.texture,a=r&&(r.isData3DTexture||r.isDataArrayTexture||r.image&&r.image.depth>0);if(!r||!a){console.warn("three-realtime-rt: userData.rtVolumeAlbedo.texture must be a THREE.Data3DTexture (RGB[A], pre-colormapped) — ignoring this material's volume albedo.");continue}const o=new P().copy(n.origin??new P(0,0,0)),l=new P().copy(n.size??new P(1,1,1));l.x===0&&(l.x=1),l.y===0&&(l.y=1),l.z===0&&(l.z=1);let c=!1;r.magFilter!==Xe&&(r.magFilter=Xe,c=!0),r.minFilter!==Xe&&(r.minFilter=Xe,c=!0),r.wrapS!==At&&(r.wrapS=At,c=!0),r.wrapT!==At&&(r.wrapT=At,c=!0),r.wrapR!==At&&(r.wrapR=At,c=!0),c&&(r.needsUpdate=!0),e={matIndex:i,texture:r,origin:o,size:l,material:s[i]}}return t>0&&console.warn(`three-realtime-rt: ${t+1} materials set userData.rtVolumeAlbedo, but v1 samples only ONE volume in the traced-bounce (GI/reflection) path — keeping the first. The other volumes still render correctly in primary visibility (the G-buffer); multi-volume bounces are future work.`),e}function Zx(s,e=0){if(!s)return null;const t=(s.transmission??0)>0&&!s.transparent,i=s.userData&&s.userData.rtAttenuation;let n=null,r=0;if(i){const l=i.color;if(l&&typeof l.r=="number"?n=[l.r,l.g,l.b]:Array.isArray(l)&&l.length>=3&&(n=[l[0],l[1],l[2]]),r=i.distance,!n||!Number.isFinite(r)||r<=0)return console.warn("three-realtime-rt: userData.rtAttenuation needs { color: THREE.Color | [r,g,b], distance: finite > 0 (world units) } — ignoring this material's absorption."),null;if(!t)return console.warn("three-realtime-rt: userData.rtAttenuation is set on a material the tracer does not trace as glass (needs transmission > 0 and transparent: false) — absorption only acts along refracted in-medium paths, so it is ignored on this material."),null}else{if(!t)return null;const l=s.attenuationColor;if(r=s.attenuationDistance,l&&typeof l.r=="number"&&Number.isFinite(r)&&r>0)n=[l.r,l.g,l.b];else if(e>0){const c=s.color&&typeof s.color.r=="number"?[s.color.r,s.color.g,s.color.b]:[1,1,1];if(s.map){const u=yh(s.map);u&&(c[0]*=u[0],c[1]*=u[1],c[2]*=u[2])}if(Math.min(c[0],c[1],c[2])>=.85)return null;n=c,r=.05*e}else return null}const a=[0,0,0];let o=!1;for(let l=0;l<3;l++){const c=-Math.log(Math.max(n[l],1e-4))/r;a[l]=c>0?c:0,a[l]>0&&(o=!0)}return o?a:null}function Jx(s,e=!1,t=0){let i=0;const n=new Float32Array(s.length*3),r=new Float32Array(s.length);for(let a=0;a<s.length;a++){const o=s[a];r[a]=o&&!o.transparent?o.transmission??0:0;const l=Zx(o,t);l&&(n[a*3+0]=l[0],n[a*3+1]=l[1],n[a*3+2]=l[2],i++)}return i>0||e?{sigma:n,glass:r,count:i}:null}function Qx(s){if(!s)return null;const e=s.userData&&s.userData.rtScattering;if(!e)return null;if(!((s.transmission??0)>0&&!s.transparent))return console.warn("three-realtime-rt: userData.rtScattering is set on a material the tracer does not trace as translucent (needs transmission > 0 and transparent: false) — the Kubelka-Munk march never enters an opaque body, so it is ignored on this material."),null;const i=r=>typeof r=="number"?[r,r,r]:r&&typeof r.r=="number"?[r.r,r.g,r.b]:Array.isArray(r)&&r.length>=3?[r[0],r[1],r[2]]:null;let n=null;if(e.coefficient!==void 0){if(n=i(e.coefficient),!n||!n.every(r=>Number.isFinite(r)&&r>=0))return console.warn("three-realtime-rt: userData.rtScattering.coefficient needs a non-negative number, [r,g,b] or THREE.Color (scattering coefficient in 1/world-unit) — ignoring this material's scattering."),null}else{const r=i(e.color),a=e.distance;if(!r||!Number.isFinite(a)||a<=0)return console.warn("three-realtime-rt: userData.rtScattering needs either { coefficient } or { color: THREE.Color | [r,g,b], distance: finite > 0 (world units) } — ignoring this material's scattering."),null;n=r.map(o=>{const l=-Math.log(Math.max(o,1e-4))/a;return l>0?l:0})}return n.some(r=>r>0)?n:null}function $x(s){let e=0;const t=new Float32Array(s.length*3),i=new Float32Array(s.length);for(let n=0;n<s.length;n++){const r=Qx(s[n]);if(!r)continue;t[n*3+0]=r[0],t[n*3+1]=r[1],t[n*3+2]=r[2],i[n]=1,e++;const a=s[n].color;a&&(a.r<.999||a.g<.999||a.b<.999)&&console.warn(`three-realtime-rt: a userData.rtScattering material has a non-white base colour (${a.r.toFixed(3)}, ${a.g.toFixed(3)}, ${a.b.toFixed(3)}). The Kubelka-Munk reflectance IS the diffuse albedo, and the composite multiplies it by this colour — set the material colour to white and let K and S carry the pigment, or accept the extra tint deliberately.`)}return e>0?{sigmaS:t,km:i,count:e}:null}function ey(s,e,t,i,n){const r=Gx(),a=n&&n.tiles&&n.tiles.length>0,o=a,l=t||o,c=i||o,u=n?n.tileSize:xh,d=a?n.tiles.length:0,h=Math.max(s.length*2,e.length*4,mi,a?u:1),f=2+mi+1+(l?1:0)+(c?1:0)+(a?1:0)+(a?d*u:0),g=new Float32Array(h*f*4);s.forEach((p,y)=>{const v=y*8,_=p.color??new de(1,1,1),T=Lo(p)??[0,0,0];g[v+0]=_.r,g[v+1]=_.g,g[v+2]=_.b,g[v+3]=p.roughness??1,g[v+4]=T[0],g[v+5]=T[1],g[v+6]=T[2],g[v+7]=p.metalness??0});const x=h*4;e.forEach((p,y)=>{const v=x+y*16;g[v+0]=p.v0[0],g[v+1]=p.v0[1],g[v+2]=p.v0[2],g[v+3]=p.area,g[v+4]=p.e1[0],g[v+5]=p.e1[1],g[v+6]=p.e1[2],g[v+7]=p.emit[0],g[v+8]=p.e2[0],g[v+9]=p.e2[1],g[v+10]=p.e2[2],g[v+11]=p.emit[1],g[v+12]=p.n[0],g[v+13]=p.n[1],g[v+14]=p.n[2],g[v+15]=p.emit[2]});for(let p=0;p<mi;p++){const y=(2+p)*x,v=p*mi*4;for(let _=0;_<mi*4;_++)g[y+_]=(r[v+_]+.5)/256}if(_h(g,x,e),l){const p=(2+mi+1)*x;if(t){const y=t.sigma,v=t.glass;for(let _=0;_<s.length;_++)g[p+_*4+0]=y[_*3+0],g[p+_*4+1]=y[_*3+1],g[p+_*4+2]=y[_*3+2],g[p+_*4+3]=v[_]}}if(c){const p=(2+mi+2)*x;if(i){const y=i.sigmaS,v=i.km;for(let _=0;_<s.length;_++)g[p+_*4+0]=y[_*3+0],g[p+_*4+1]=y[_*3+1],g[p+_*4+2]=y[_*3+2],g[p+_*4+3]=v[_]}}if(a){const p=(2+mi+3)*x;for(let y=0;y<s.length;y++){const v=n.tileIndexForMat[y];g[p+y*4+0]=v?v.albedo:-1,g[p+y*4+1]=v?v.emissive:-1,g[p+y*4+2]=0,g[p+y*4+3]=0}for(let y=0;y<d;y++){const v=n.tiles[y],_=2+mi+4+y*u;for(let T=0;T<u;T++){const M=(_+T)*x,w=(u-1-T)*u*4;for(let R=0;R<u;R++){const S=w+R*4;g[M+R*4+0]=v.data[S]/255,g[M+R*4+1]=v.data[S+1]/255,g[M+R*4+2]=v.data[S+2]/255,g[M+R*4+3]=v.data[S+3]/255}}}}const m=new Ls(g,h,f,Ye,Mt);return m.minFilter=Ve,m.magFilter=Ve,m.needsUpdate=!0,m}function _h(s,e,t){if(t.length===0)return;const i=(2+mi)*e;let n=0;const r=new Array(t.length);for(let o=0;o<t.length;o++){const l=t[o];r[o]=l.area*(.2126*l.emit[0]+.7152*l.emit[1]+.0722*l.emit[2]),n+=r[o]}let a=0;for(let o=0;o<t.length;o++){const l=n>0?r[o]/n:1/t.length;a+=l,s[i+o*4+0]=o===t.length-1?1:a,s[i+o*4+1]=l}}function hu(s,e,t,i=0,n=-1,r=-1){const a=s.getAttribute("position").array,o=i*3,l=n<0?a.length:Math.min(a.length,(i+n)*3);for(let c=o;c+9<=l;c+=9){const u=[a[c+3]-a[c],a[c+4]-a[c+1],a[c+5]-a[c+2]],d=[a[c+6]-a[c],a[c+7]-a[c+1],a[c+8]-a[c+2]],h=u[1]*d[2]-u[2]*d[1],f=u[2]*d[0]-u[0]*d[2],g=u[0]*d[1]-u[1]*d[0],x=Math.hypot(h,f,g);if(x<1e-10)continue;const m={v0:[a[c],a[c+1],a[c+2]],e1:u,e2:d,n:[h/x,f/x,g/x],area:x*.5,emit:e};r>=0&&(m.dyn=!0,m.dynOff=r+c),t.push(m)}}function ty(){const s=new Tt;return s.setAttribute("position",new st(new Float32Array(9),3)),s.setAttribute("normal",new st(new Float32Array([0,1,0,0,1,0,0,1,0]),3)),s.setAttribute("materialIndex",new st(new Float32Array(3),1)),s.setAttribute("uv",new st(new Float32Array(6),2)),s}function iy(s,e=!1){const t=s.getAttribute("normal"),i=s.getAttribute("materialIndex"),n=t.count;if(!e){const o=new Float32Array(n*4);for(let l=0;l<n;l++)o[l*4]=t.getX(l),o[l*4+1]=t.getY(l),o[l*4+2]=t.getZ(l),o[l*4+3]=i.getX(l);return{packed:o,attr:new st(o,4)}}const r=new Float32Array(n*8),a=s.getAttribute("uv");for(let o=0;o<n;o++){const l=o*8;r[l+0]=t.getX(o),r[l+1]=t.getY(o),r[l+2]=t.getZ(o),r[l+3]=i.getX(o),r[l+4]=a?a.getX(o):0,r[l+5]=a?a.getY(o):0,r[l+6]=0,r[l+7]=0}return{packed:r,attr:new st(r,4)}}function du(s,{dynamic:e,stride2:t=!1}){const i=s.length>0?L0(s,!1):ty(),n=new oa(i,{strategy:e?sa:ch});return{merged:i,bvh:n,...iy(i,t)}}function ny(s,e={}){s.updateMatrixWorld(!0);const t=e.dynamicMeshes?new Set(e.dynamicMeshes):null,i=e.textureTiles,n=i&&i.size||xh,r=i&&i.max||qx,a=new Hx,o=a.materials,l=[],c=[],u=[];let d=0;const h=[],f=[],g={"rtdeforming-not-dynamic":[],"untraceable-object":[],"instanced-mesh":[],"transparent-dynamic":[]},x=[],m=typeof WeakRef=="function",p=b=>{let L=o.indexOf(b);return L<0&&(L=o.length,o.push(b)),L};s.traverse(b=>{if((b.isSprite||b.isLine||b.isPoints)&&b.visible&&!b.userData.rtExclude){g["untraceable-object"].push(b);return}if(!b.isMesh||!b.geometry||!b.visible||b.userData.rtExclude)return;b.isInstancedMesh&&g["instanced-mesh"].push(b);const L=Array.isArray(b.material);if((L?b.material[0]:b.material).transparent){t&&t.has(b)&&g["transparent-dynamic"].push(b);return}const F=t&&t.has(b);b.userData.rtDeforming===!0&&!F&&g["rtdeforming-not-dynamic"].push(b);const I=F&&b.userData.rtDeforming===!0;if(L&&b.geometry.groups&&b.geometry.groups.length>0&&I)throw new Error("three-realtime-rt: multi-material groups on a CPU-deforming (rtDeforming) mesh are not supported — the per-frame live-geometry rebake assumes one material range. Use groups on a static or rigid-dynamic mesh, or split the deforming mesh into one mesh per material.");const B=Wx(b);h.push(B.geo);const{matIdx:K,ranges:q}=Xx(b,B.count,p);if(B.geo.setAttribute("materialIndex",new st(K,1)),F){const H=d;c.push(B.geo);for(const ae of q){const X=Lo(ae.material);X&&hu(B.geo,X,u,ae.start,ae.vcount,H*3)}const j=b.isSkinnedMesh===!0,Y=!j&&b.userData.rtDeforming===!0;Y&&(a.hasDeforming=!0),j&&(a.hasSkinned=!0),a.dynamic.push({mesh:b,start:d,count:B.count,localPos:B.localPos,localNorm:B.localNorm,deforming:Y,skinned:j,liveGeometry:Y?b.geometry:null,indexMap:Y||j?B.indexMap:null,srcVertexCount:Y||j?B.srcVertexCount:0,skinnedLocal:j?new Float32Array(B.srcVertexCount*3):null}),d+=B.count}else{l.push(B.geo);for(const H of q){const j=Lo(H.material);j&&hu(B.geo,j,u,H.start,H.vcount)}if(m){const H=b.geometry.getAttribute("position");x.push({ref:new WeakRef(b),name:vh(b),version:H?H.version:-1,matrix:new Float64Array(b.matrixWorld.elements),warned:!1})}}});const y=(b,L)=>{f.push({code:b,message:L})},v=(b,L,D)=>{if(L.length===0)return;const F=L.filter(U=>Vx(U,b)),I=D(L);y(b,I),F.length>0&&console.warn(I)};if(v("rtdeforming-not-dynamic",g["rtdeforming-not-dynamic"],b=>`three-realtime-rt: userData.rtDeforming is set on a mesh that is NOT in compileScene(scene, {dynamicMeshes:[...]}) — the flag is IGNORED, the mesh compiles STATIC, and traced shadows/GI keep its compile-time shape forever: ${Ir(b)}. Add it to dynamicMeshes and call updateDynamic() each frame to make it actually deform.`),v("untraceable-object",g["untraceable-object"],b=>`three-realtime-rt: Sprite/Line/Points objects are not traceable geometry and are auto-hidden from the traced frame (their materials cannot write the 4-attachment G-buffer): ${Ir(b)}. Draw them in your own overlay pass on top of rt.render(), or set userData.rtExclude = true to silence this.`),v("instanced-mesh",g["instanced-mesh"],b=>`three-realtime-rt: InstancedMesh is NOT supported — it collapses to a single instance in the traced output and in the G-buffer: ${Ir(b)}. Expand it to individual meshes, or set userData.rtExclude = true to exclude it.`),v("transparent-dynamic",g["transparent-dynamic"],b=>`three-realtime-rt: a transparent mesh listed in dynamicMeshes does nothing — transparent meshes are composited via the blend path and are never BVH-traced or dynamic-registered: ${Ir(b)}. Remove it from dynamicMeshes, or make the material opaque (transparent: false) if it should cast traced shadows.`),a.warnings=f,a.staticSources=x,l.length===0&&c.length===0)throw new Error("three-realtime-rt: no meshes found in scene");const _=i===!1?null:jx(o,n,r),T=_&&_.hasTiles;_&&(_.tileSize=n);const M=T,w=du(l,{dynamic:!1,stride2:M});a.staticBvh=w.bvh,a.staticBvhUniform.updateFrom(w.bvh),a.staticAttrTex.updateFrom(w.attr),a.hasDynamic=c.length>0;const R=du(c,{dynamic:!0,stride2:M});a.dynamicMerged=R.merged,a.dynamicBvh=R.bvh,a.dynamicBvhUniform.updateFrom(R.bvh),a.dynamicPacked=R.packed,a.dynamicPackedAttr=R.attr,a.dynamicAttrTex.updateFrom(R.attr),a.triangleCount=(w.merged.getAttribute("position").count+(a.hasDynamic?R.merged.getAttribute("position").count:0))/3,w.merged.computeBoundingBox();const S=w.merged.boundingBox;a.sceneDiagonal=S.isEmpty()?1:S.min.distanceTo(S.max),u.length>ro&&(console.warn(`three-realtime-rt: ${u.length} emissive triangles exceed the NEE cap of ${ro} (shared across static + dynamic emitters); keeping the largest by area (measured at compile time). Dropped triangles no longer act as lights — prefer low-poly emitter meshes, especially for dynamic ones (their tris are refreshed every frame).`),u.sort((b,L)=>L.area-b.area),u.length=ro),a.emissiveTriCount=u.length,a.emissiveTris=u,a._dynamicEmissive=[];for(let b=0;b<u.length;b++){const L=u[b];L.dyn&&a._dynamicEmissive.push({row:b,off:L.dynOff,emit:L.emit})}a.hasDynamicEmissive=a._dynamicEmissive.length>0,a.scattering=$x(o),a.absorption=Jx(o,!!(a.scattering||T),a.sceneDiagonal),a.hasTextureTiles=T,a._tileSize=n,a.materialsTex=ey(o,u,a.absorption,a.scattering,T?_:null),a.volumeAlbedo=Yx(o),bh(s,a);for(const b of h)b!==w.merged&&b!==R.merged&&b.dispose();return a}function bh(s,e){const t=e.lightPosType,i=e.lightColorRadius,n=e.lightDirCone;t.length=0,i.length=0,n.length=0;let r=0;const a=new P,o=new P;for(s.traverse(l=>{if(!(!l.isLight||!l.visible||l.intensity<=0)&&!(r>=es)){if(l.isSpotLight){l.getWorldPosition(a),l.target.getWorldPosition(o);const c=o.sub(a).normalize(),u=Math.cos(l.angle),d=Math.cos(l.angle*(1-(l.penumbra??0)));t.push(a.x,a.y,a.z,2+d),i.push(l.color.r*l.intensity,l.color.g*l.intensity,l.color.b*l.intensity,l.userData.rtRadius??.1),n.push(c.x,c.y,c.z,u),r++}else if(l.isPointLight)l.getWorldPosition(a),t.push(a.x,a.y,a.z,0),i.push(l.color.r*l.intensity,l.color.g*l.intensity,l.color.b*l.intensity,l.userData.rtRadius??.15),n.push(0,0,0,0),r++;else if(l.isDirectionalLight){l.getWorldPosition(a),l.target.getWorldPosition(o);const c=o.sub(a).normalize();t.push(c.x,c.y,c.z,1),i.push(l.color.r*l.intensity,l.color.g*l.intensity,l.color.b*l.intensity,l.userData.rtRadius??.02),n.push(0,0,0,0),r++}}}),e.lightCount=r;t.length<es*4;)t.push(0,0,0,0),i.push(0,0,0,0),n.push(0,0,0,0)}function ts(s,e,t,i={}){if(Hl)return new Hl(s,e,t,i);const n=new It(s,e,{...i,count:t});return Object.defineProperty(n,"texture",{value:n.textures,writable:!0,configurable:!0}),n}const sy=`
#include <skinning_pars_vertex>

out vec3 vWorldPos;
out vec3 vWorldNormal;
out vec2 vUvCoord;
out vec3 vColor;

uniform mat3 uNormalMatrixWorld;

void main() {
  vec3 transformed = position;
  vec3 objectNormal = normal;
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>

  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(uNormalMatrixWorld * objectNormal);
  vUvCoord = uv;
  // Geometry vertex colours. three's shader prefix declares the built-in
  // \`color\` attribute (vec3 or vec4) and sets USE_COLOR / USE_COLOR_ALPHA only
  // when material.vertexColors is on — which we enable ONLY for meshes whose
  // geometry actually carries a color attribute (see GBufferPass swap). A mesh
  // without one compiles the else branch (white), so its albedo is byte-identical
  // to before this varying existed. 4-component colours use .rgb.
  #if defined( USE_COLOR_ALPHA )
    vColor = color.rgb;
  #elif defined( USE_COLOR )
    vColor = color;
  #else
    vColor = vec3(1.0);
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,ry=`
precision highp float;

layout(location = 0) out vec4 gAlbedoRough;
layout(location = 1) out vec4 gNormalMetal;
layout(location = 2) out vec4 gWorldPos;
layout(location = 3) out vec4 gEmissive;

in vec3 vWorldPos;
in vec3 vWorldNormal;
in vec2 vUvCoord;
in vec3 vColor;

uniform vec3 uColor;
uniform float uRoughness;
uniform float uMetalness;
uniform float uTransmission;
uniform float uIor;
uniform vec3 uEmissive;
uniform sampler2D uMap;
uniform bool uHasMap;
uniform sampler2D uEmissiveMap;
uniform bool uHasEmissiveMap;
// PBR texture maps (raster pass has ample sampler headroom, unlike the lighting
// pass). All guarded by a uHas* flag so a material without a given map writes
// exactly the same bytes it did before these were added.
uniform sampler2D uNormalMap;
uniform bool uHasNormalMap;
uniform vec2 uNormalScale;
uniform sampler2D uRoughnessMap;
uniform bool uHasRoughnessMap;
uniform sampler2D uMetalnessMap;
uniform bool uHasMetalnessMap;
uniform bool uBlend;
uniform float uOpacity;

// World-space 3D-texture albedo ("volumetric surface albedo"), compiled in ONLY
// when a scene registers a material with userData.rtVolumeAlbedo (the whole block
// is behind the RT_VOLUME_ALBEDO define, so a scene without the feature builds a
// byte-identical G-buffer program with no extra sampler). Primary visibility can
// afford this sampler3D — the raster pass has ample sampler headroom, unlike the
// lighting megakernel. The value is gated per-mesh by uHasVolume, so non-volume
// meshes sharing this program write exactly the same albedo they did before.
#ifdef RT_VOLUME_ALBEDO
uniform highp sampler3D uVolumeTex;
uniform vec3 uVolumeOrigin;
uniform vec3 uVolumeSize;
uniform bool uHasVolume;
#endif

// Screen-space cotangent frame (Mikkelsen 2010): reconstruct a tangent basis
// from derivatives of world position and uv, so tangent-space normal maps work
// without a per-vertex tangent attribute (none is uploaded to the BVH/G-buffer).
vec3 perturbNormal(vec3 N, vec3 P, vec2 uv, vec3 mapN) {
  vec3 dpdx = dFdx(P);
  vec3 dpdy = dFdy(P);
  vec2 duvdx = dFdx(uv);
  vec2 duvdy = dFdy(uv);
  vec3 t = normalize(dpdx * duvdy.y - dpdy * duvdx.y);
  vec3 b = normalize(cross(N, t));
  mat3 tbn = mat3(t, b, N);
  return normalize(tbn * mapN);
}

void main() {
  vec3 albedo = uColor;
  if (uHasMap) {
    albedo *= texture(uMap, vUvCoord).rgb;
  }
  albedo *= vColor; // vertex colours (white when the mesh has no color attribute)
  // Volumetric surface albedo: sample a world-space 3D texture at this fragment's
  // world position and use it as the base colour, replacing color x map x vColor.
  // uvw = clamp((p - origin) / size, 0, 1); the ClampToEdge sampler + this clamp
  // keep hits just outside the volume reading the boundary colour instead of
  // wrapping. Gated so only rtVolumeAlbedo meshes are affected.
#ifdef RT_VOLUME_ALBEDO
  if (uHasVolume) {
    vec3 uvw = clamp((vWorldPos - uVolumeOrigin) / uVolumeSize, 0.0, 1.0);
    albedo = texture(uVolumeTex, uvw).rgb;
  }
#endif
  vec3 emissive = uEmissive;
  if (uHasEmissiveMap) {
    emissive *= texture(uEmissiveMap, vUvCoord).rgb;
  }
  vec3 n = normalize(vWorldNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  if (uHasNormalMap) {
    // Tangent-space normal in [-1,1], scaled by material.normalScale (x,y).
    vec3 mapN = texture(uNormalMap, vUvCoord).xyz * 2.0 - 1.0;
    mapN.xy *= uNormalScale;
    n = perturbNormal(n, vWorldPos, vUvCoord, mapN);
  }
  // three.js convention: green channel of roughnessMap x scalar roughness,
  // blue channel of metalnessMap x scalar metalness (an ORM texture packs both).
  float roughness = uRoughness;
  if (uHasRoughnessMap) roughness *= texture(uRoughnessMap, vUvCoord).g;
  float metalness = uMetalness;
  if (uHasMetalnessMap) metalness *= texture(uMetalnessMap, vUvCoord).b;
  gAlbedoRough = vec4(albedo, roughness);
  // .w is a packed material word in disjoint ranges, so the lighting pass reads
  // specular/glass/blend properties without an extra G-buffer sampler (it already
  // sits at the WebGL2 16-sampler minimum — the reason per-material IOR rides
  // here rather than in a third G-buffer texture the lighting pass would have to
  // sample):
  //   [0,1] plain metalness
  //   (2,3] transmissive glass, PARTIAL: w - 2 = transmission (global rt.ior)
  //   [3,4) transmissive glass, FULL (transmission >= ~1): w - 3 = ior - 1
  //   [4,5] alpha blend: w - 4 = opacity
  // Blend wins: a transparent surface is kept out of the BVH and composited by
  // the lighting pass, so it must never be read as glass. Every EXISTING consumer
  // decodes clamp(w - 2, 0, 1) as transmission, which saturates to 1.0 across the
  // whole [3,4) band — so full glass keeps reading as fully transmissive there and
  // only the lighting pass additionally recovers the per-material IOR (Task 2).
  float matWord;
  if (uBlend) {
    matWord = 4.0 + uOpacity;
  } else if (uTransmission > 0.0) {
    if (uTransmission >= 0.99) {
      // clamp (ior - 1) to [0, 0.98] so the word stays clear of the 4.0 blend
      // boundary even after fp16 rounding of this channel; covers ior 1.0-1.98.
      matWord = 3.0 + clamp(uIor - 1.0, 0.0, 0.98);
    } else {
      matWord = 2.0 + uTransmission; // partial glass: keep transmission, global ior
    }
  } else {
    matWord = metalness;
  }
  gNormalMetal = vec4(n, matWord);
  // .w packs the valid flag AND roughness: 0 = background, 1 + roughness
  // otherwise. Every consumer only tests w < 0.5, so this stays compatible.
  gWorldPos = vec4(vWorldPos, 1.0 + roughness);
  // .a is normally the constant 1.0 (CompositePass reads only .rgb). A blend
  // surface carries its opacity here; the packed word above also encodes it, so
  // the sampler-bound lighting pass reads opacity without a gEmissive fetch.
  gEmissive = vec4(emissive, uBlend ? uOpacity : 1.0);
}
`;class ay{constructor(e,t,{mixedPrecision:i=!0}={}){this._mixedPrecision=i,this._targets=[this._makeTarget(e,t),this._makeTarget(e,t)],this._current=0,this._materialCache=new WeakMap,this._swapped=[],this._hidden=[],this._normalMat3=new Le,this._volumeEnabled=!1,this._dummyVolumeTex=null}_dummyVolume(){if(!this._dummyVolumeTex){const e=new Fu(new Uint8Array([255,255,255,255]),1,1,1);e.format=Ye,e.type=ui,e.minFilter=Xe,e.magFilter=Xe,e.needsUpdate=!0,this._dummyVolumeTex=e}return this._dummyVolumeTex}setVolume(e){const t=!!e;t!==this._volumeEnabled&&(this._volumeEnabled=t,this._materialCache=new WeakMap)}_makeTarget(e,t){const i=ts(e,t,4,{minFilter:Ve,magFilter:Ve,type:Mt,depthBuffer:!0});for(const n of i.texture)n.generateMipmaps=!1;return this._mixedPrecision&&(i.texture[0].type=Pt,i.texture[1].type=Pt,i.texture[3].type=Pt),i}get target(){return this._targets[this._current]}get _prev(){return this._targets[1-this._current]}get albedoRough(){return this.target.texture[0]}get normalMetal(){return this.target.texture[1]}get worldPos(){return this.target.texture[2]}get emissive(){return this.target.texture[3]}get prevNormalMetal(){return this._prev.texture[1]}get prevWorldPos(){return this._prev.texture[2]}setSize(e,t){for(const i of this._targets)i.setSize(e,t)}_makeGbufferMaterial(e){const t=new dt({name:"rt:gbuffer",glslVersion:Ct,defines:this._volumeEnabled?{RT_VOLUME_ALBEDO:"1"}:{},vertexShader:sy,fragmentShader:ry,uniforms:{uNormalMatrixWorld:{value:new Le},uColor:{value:new de(1,1,1)},uRoughness:{value:1},uMetalness:{value:0},uTransmission:{value:0},uIor:{value:1.5},uEmissive:{value:new de(0,0,0)},uMap:{value:null},uHasMap:{value:!1},uEmissiveMap:{value:null},uHasEmissiveMap:{value:!1},uNormalMap:{value:null},uHasNormalMap:{value:!1},uNormalScale:{value:new ce(1,1)},uRoughnessMap:{value:null},uHasRoughnessMap:{value:!1},uMetalnessMap:{value:null},uHasMetalnessMap:{value:!1},uBlend:{value:!1},uOpacity:{value:1},uVolumeTex:{value:null},uVolumeOrigin:{value:new P},uVolumeSize:{value:new P(1,1,1)},uHasVolume:{value:!1}},side:si});return t.vertexColors=!!(e.geometry&&e.geometry.getAttribute("color")),t}_syncGbufferMaterial(e,t,i){const n=e.uniforms;if(t.color&&n.uColor.value.copy(t.color),n.uRoughness.value=t.roughness??1,n.uMetalness.value=t.metalness??0,n.uTransmission.value=t.transmission??0,n.uIor.value=t.ior??1.5,t.emissive&&n.uEmissive.value.copy(t.emissive).multiplyScalar(t.emissiveIntensity??1),n.uMap.value=t.map??null,n.uHasMap.value=!!t.map,n.uEmissiveMap.value=t.emissiveMap??null,n.uHasEmissiveMap.value=!!t.emissiveMap,n.uNormalMap.value=t.normalMap??null,n.uHasNormalMap.value=!!t.normalMap,t.normalScale?n.uNormalScale.value.copy(t.normalScale):n.uNormalScale.value.set(1,1),n.uRoughnessMap.value=t.roughnessMap??null,n.uHasRoughnessMap.value=!!t.roughnessMap,n.uMetalnessMap.value=t.metalnessMap??null,n.uHasMetalnessMap.value=!!t.metalnessMap,n.uBlend.value=!!t.transparent,n.uOpacity.value=t.opacity??1,this._volumeEnabled){const r=t.userData&&t.userData.rtVolumeAlbedo;if(r&&r.texture){n.uHasVolume.value=!0,n.uVolumeTex.value=r.texture,n.uVolumeOrigin.value.copy(r.origin??{x:0,y:0,z:0});const a=r.size??{x:1,y:1,z:1};n.uVolumeSize.value.set(a.x||1,a.y||1,a.z||1)}else n.uHasVolume.value=!1,n.uVolumeTex.value=this._dummyVolume()}n.uNormalMatrixWorld.value.getNormalMatrix(i.matrixWorld),e.side=t.side??si}_gbufferMaterialFor(e){if(Array.isArray(e.material)){let i=this._materialCache.get(e);(!Array.isArray(i)||i.length!==e.material.length)&&(i=e.material.map(()=>this._makeGbufferMaterial(e)),this._materialCache.set(e,i));for(let n=0;n<e.material.length;n++)this._syncGbufferMaterial(i[n],e.material[n],e);return i}let t=this._materialCache.get(e);return(!t||Array.isArray(t))&&(t=this._makeGbufferMaterial(e),this._materialCache.set(e,t)),this._syncGbufferMaterial(t,e.material,e),t}render(e,t,i){this._current=1-this._current,this._swapped.length=0,this._hidden.length=0,t.traverse(r=>{if(r.visible){if(r.isMesh&&r.geometry){this._swapped.push([r,r.material]),r.material=this._gbufferMaterialFor(r);return}(r.isSprite||r.isLine||r.isPoints)&&(r.visible=!1,this._hidden.push(r))}});const n=t.background;t.background=null,e.setRenderTarget(this.target),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(t,i),e.setRenderTarget(null),t.background=n;for(const[r,a]of this._swapped)r.material=a;this._swapped.length=0;for(const r of this._hidden)r.visible=!0;this._hidden.length=0}dispose(){for(const e of this._targets)e.dispose();this._dummyVolumeTex&&this._dummyVolumeTex.dispose()}}const Zo=`
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
`,Jo=`

// Traversal-cost instrumentation. Counts how many BVH nodes the current pixel's
// shadow rays visit this frame — the raw signal behind the "bvh cost" heatmap
// debug view (outputMode 7). RTLightingPass main() zeroes it at the top of the
// pixel and reads it after all shadow rays have run; it accumulates across every
// bvhIntersectAnyHit call (both BVH levels, every light / GI / reflection ray).
// When uCostView is off the count is written nowhere, so shading is unaffected —
// the only cost is one integer add per popped node. Initialised to 0 so the
// VolumetricPass program (which shares this GLSL but never reads the counter)
// still compiles and runs unchanged.
int gBvhVisits = 0;

// Returns true if ANY triangle in the BVH is hit by the ray within (0, maxDist).
// Unordered traversal with early-out; no closest-hit bookkeeping.
bool bvhIntersectAnyHit( BVH bvh, vec3 rayOrigin, vec3 rayDirection, float maxDist ) {

	// Same fixed-size stack as _bvhIntersectFirstHit: sized for the tree's max depth,
	// large enough because we push both children each internal node.
	int ptr = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	// scratch outputs for the (reused) triangle test
	vec3 triBarycoord, triNormal;
	float triDist, triSide;

	while ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ ptr ];
		ptr --;

		// One node visited (popped + tested). Counts pruned nodes too — that IS
		// the traversal cost the heatmap visualises.
		gBvhVisits ++;

		// prune: skip nodes the ray misses or whose entry distance is already past maxDist
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh.bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > maxDist
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh.bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			// test each triangle in the leaf; early-out on the first valid occluder
			for ( uint i = offset, l = offset + count; i < l; i ++ ) {

				uvec3 indices = uTexelFetch1D( bvh.index, i ).xyz;
				vec3 a = texelFetch1D( bvh.position, indices.x ).rgb;
				vec3 b = texelFetch1D( bvh.position, indices.y ).rgb;
				vec3 c = texelFetch1D( bvh.position, indices.z ).rgb;

				if (
					intersectsTriangle( rayOrigin, rayDirection, a, b, c, triBarycoord, triNormal, triDist, triSide )
					&& triDist > 0.0 && triDist < maxDist
				) {

					return true;

				}

			}

		} else {

			// unordered: push both children, no near/far ordering
			uint leftIndex = currNodeIndex + 1u;
			uint rightIndex = boundsInfo.y;

			ptr ++;
			stack[ ptr ] = leftIndex;

			ptr ++;
			stack[ ptr ] = rightIndex;

		}

	}

	return false;

}
`,oo=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,fu=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${jo}
${Yo}
${Jo}
${Zo}

#define MAX_LIGHTS ${es}
#define PI 3.14159265358979

layout(location = 0) out vec4 outIrradiance;
layout(location = 1) out vec4 outSpecular; // dielectric direct specular (fresh, this frame)

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

// temporal reprojection (stage 2). Validation is plane-distance only — the
// normal test was dropped to free a sampler for the ReSTIR reservoir (same
// simplification the TAA resolve already made, no observed regressions).
uniform sampler2D uPrevAccum;        // rgb = irradiance history, a = sample count
uniform sampler2D uPrevGWorldPos;    // previous frame's G-buffer, for validation
uniform sampler2D uReservoir;        // ReSTIR winner per pixel (see RestirPass)
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform vec3 uCameraPos;
uniform float uMaxHistory;
uniform bool uTemporalReprojection;
uniform float uFireflyClamp;
uniform float uGlassClampScale; // glass firefly cap, in uFireflyClamp units (0 = off)
uniform bool uRawOutput; // when true: skip EMA, write raw sampleIrr for AccumulatePass

uniform vec4 uLightPosType[MAX_LIGHTS];     // xyz pos|dir, w: 0 point, 1 directional, >=2 spot (w-2 = cosInner)
uniform vec4 uLightColorRadius[MAX_LIGHTS]; // rgb color*intensity, w radius
uniform vec4 uLightDirCone[MAX_LIGHTS];     // spot: direction.xyz + cos(outer angle)
uniform int uLightCount;
uniform int uEmissiveCount; // NEE area-light triangles in row 1 of uMaterialsTex
uniform bool uEmissiveCDF;  // importance-sample tris by the power CDF (row 66)
uniform bool uReflEnabled;  // traced reflections on metallic surfaces
uniform bool uRefrEnabled;  // traced refraction on transmissive surfaces
uniform bool uBlendEnabled; // straight-through view continuation on blend surfaces
uniform float uIor;         // index of refraction for transmissive materials
uniform float uDispersion;  // chromatic dispersion strength for glass (0 = off)
uniform bool uLightStochastic; // 1 direct shadow ray/pixel/frame instead of 1/light
uniform bool uRestirEnabled;   // shade the reservoir winner instead of sampling
uniform bool uGIHalfRate;      // GI ray on alternating checkerboard, doubled

uniform vec3 uEnvColor;
uniform float uEnvIntensity;
uniform float uFrame;
uniform float uEps;
uniform bool uGIEnabled;
// EXPERIMENTAL: when an external ReSTIR GI pass supplies the 1-bounce indirect
// (added downstream at the denoise stage), skip the inline GI trace so it isn't
// counted twice. A uniform, NOT a sampler — the lighting pass is already at the
// WebGL2 16-sampler minimum and cannot take another.
uniform bool uExternalGI;

// BVH traversal-cost heatmap (outputMode 7). When uCostView is on, main() writes
// the per-pixel shadow-ray node-visit count (gBvhVisits, from bvhAnyHit.glsl.js)
// through costPalette() into the irradiance attachment INSTEAD of the accumulated
// lighting — bypassing temporal blending — so the debug view reads the raw cost.
uniform bool uCostView;
uniform float uCostScale; // multiplies the visit count before the palette (default 1/96)

// Procedural sky (when enabled, replaces the flat env colour as the "miss" term
// for GI rays — this is what gives natural outdoor bounce light).
uniform bool uSkyEnabled;
uniform vec3 uSunDir;      // direction toward the sun
uniform vec3 uSunColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSkyIntensity;

// ---------- RNG ----------
// The FIRST four random numbers each frame come from a 64x64 blue-noise tile
// (rows 2..65 of the scene-data texture), rotated over time with an R2
// low-discrepancy sequence. Those dimensions drive direct lighting — light
// pick + area-sample position — where noise is most visible; blue noise turns
// the residual error high-frequency, which temporal accumulation and the
// denoiser remove far better than white-noise clumps. Later dimensions fall
// back to PCG white noise (correlating many dimensions hurts).
uint gSeed;
int gBnDim;
vec4 gBlueNoise;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  if (gBnDim < 4) {
    float v = gBlueNoise[gBnDim];
    gBnDim++;
    return v;
  }
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec2 rand2() { return vec2(rand(), rand()); }

vec4 fetchBlueNoise() {
  ivec2 p = ivec2(gl_FragCoord.xy) & 63;
  vec4 bn = texelFetch(uMaterialsTex, ivec2(p.x, 2 + p.y), 0);
  // R2 sequence: per-frame toroidal shift, decorrelated per channel.
  vec4 shift = fract(float(uFrame) * vec4(0.6180340, 0.7548777, 0.5698403, 0.8191725));
  return fract(bn + shift);
}

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

// Shadow rays only need to know IF something blocks, not what's closest —
// the unordered any-hit traversal early-outs on the first blocker.
bool occluded(vec3 ro, vec3 rd, float maxDist) {
  if (bvhIntersectAnyHit(bvhStatic, ro, rd, maxDist - 2.0 * uEps)) return true;
  if (uHasDynamic && bvhIntersectAnyHit(bvhDynamic, ro, rd, maxDist - 2.0 * uEps)) return true;
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

// >>> RT_TEXTURE_TILES (whole block source-spliced — see stripMarked below)
// SECONDARY-RAY TEXTURE MAPS. Rides the existing scene-data texture: row 69
// carries per-material tile indices, rows 70+ hold the tile block. The stride-2
// attribute layout stores UVs alongside normals so hit points carry interpolated
// texture coordinates. No new sampler (this pass sits at the WebGL2 16-sampler
// minimum), no new uniform beyond the bool gate below. Stripped entirely when the
// compiled scene has no textured materials, so the program is byte-identical to
// today's.
uniform bool uHasTextureTiles;

// Stride-2 attribute fetch. textureSampleBarycoord indexes at stride 1 and would
// read the wrong texels when the attribute texture uses the two-texel-per-vertex
// layout, so we replicate its 1D-to-2D addressing at stride 2. The normal+matIndex
// interpolation is bit-identical to the old stride-1 call — matIndex is uniform
// per triangle, so lerping it gives the same value as reading from any one vertex.
void fetchAttrUv(sampler2D attrTex, vec3 bary, uvec3 verts, out vec4 attr, out vec2 uv) {
    uint width = uint(textureSize(attrTex, 0).x);
    uint i0 = verts.x * 2u;
    uint i1 = verts.y * 2u;
    uint i2 = verts.z * 2u;
    vec4 a0 = texelFetch(attrTex, ivec2(i0 % width, i0 / width), 0);
    vec4 a1 = texelFetch(attrTex, ivec2(i1 % width, i1 / width), 0);
    vec4 a2 = texelFetch(attrTex, ivec2(i2 % width, i2 / width), 0);
    attr = a0 * bary.x + a1 * bary.y + a2 * bary.z;
    vec2 uv0 = texelFetch(attrTex, ivec2((i0 + 1u) % width, (i0 + 1u) / width), 0).xy;
    vec2 uv1 = texelFetch(attrTex, ivec2((i1 + 1u) % width, (i1 + 1u) / width), 0).xy;
    vec2 uv2 = texelFetch(attrTex, ivec2((i2 + 1u) % width, (i2 + 1u) / width), 0).xy;
    uv = uv0 * bary.x + uv1 * bary.y + uv2 * bary.z;
}

#define TILE 128.0

// Manual bilinear sample from the tile block (row 70+). uv wraps with fract for
// repeat-mode tiling; each tile is TILE x TILE texels in linear RGBA.
vec4 tileSample(float tileIdx, vec2 st) {
    vec2 fuv = fract(st) * TILE - 0.5;
    vec2 f0 = floor(fuv);
    vec2 f1 = f0 + 1.0;
    f0 = mod(f0, TILE);
    f1 = mod(f1, TILE);
    float rowBase = 70.0 + tileIdx * TILE;
    vec4 s00 = texelFetch(uMaterialsTex, ivec2(int(f0.x), int(rowBase + f0.y)), 0);
    vec4 s10 = texelFetch(uMaterialsTex, ivec2(int(f1.x), int(rowBase + f0.y)), 0);
    vec4 s01 = texelFetch(uMaterialsTex, ivec2(int(f0.x), int(rowBase + f1.y)), 0);
    vec4 s11 = texelFetch(uMaterialsTex, ivec2(int(f1.x), int(rowBase + f1.y)), 0);
    vec2 t = fuv - f0;
    return mix(mix(s00, s10, t.x), mix(s01, s11, t.x), t.y);
}
// <<< RT_TEXTURE_TILES

// >>> RT_ABSORPTION (whole block source-spliced — see stripAbsorption below)
// Per-material Beer-Lambert absorption for refractive media ("tinted glass done
// right"). Row 67 of the scene-data texture carries one texel per material,
// [sigma.rgb | 0] in 1/world-unit, derived by SceneCompiler from
// attenuationColor / attenuationDistance (or userData.rtAttenuation — see
// collectAbsorption there). The row exists ONLY when some material absorbs,
// which is exactly when this code is spliced into the source, so the fetch can
// never read a missing row. Deliberately free of new resources: no new sampler
// (this pass sits at the WebGL2 16-sampler minimum — sigma rides the already-
// bound scene-data texture), no new uniform, and no new traceRadiance call site
// (see the Metal call-site budget note at the unified secondary-ray site).
vec3 rtAbsorbSigma(float matIndex) {
  return texelFetch(uMaterialsTex, ivec2(int(round(matIndex)), 67), 0).rgb;
}
// Beer-Lambert transmittance over an in-medium path of length d:
// exp(-sigma * d) per channel. sigma == 0 gives exactly 1.0 (no change), so
// non-absorbing materials in an absorbing scene pay only these few ALU ops.
vec3 rtTransmittance(float matIndex, float d) {
  return exp(-rtAbsorbSigma(matIndex) * max(d, 0.0));
}

// <<< RT_ABSORPTION
// >>> RT_KM (whole block source-spliced — see stripMarked below)
// KUBELKA-MUNK TWO-FLUX SCATTERING — the arithmetic. Absorption alone can only
// REMOVE light, so a pigmented translucent solid lit from the front renders as
// black murk: nothing sends the light back out of the surface. Real jade, wax,
// marble, skin, a leaf, a lampshade, coloured plastic all look like their colour
// because light enters, SCATTERS, and leaves again on the same side. The
// two-flux model is the closed-form solution for exactly that: one diffuse flux
// heading in, one heading back out, coupled by an absorption coefficient K and a
// scattering coefficient S, solved over a layer of thickness t on a backing of
// reflectance Rg. Per channel:
//
//   a = 1 + K/S,  b = sqrt(a*a - 1),  x = b*S*t
//   R(t, Rg) = (1 - Rg*(a - b*coth(x))) / (a - Rg + b*coth(x))
//   T(t)     = b / (a*sinh(x) + b*cosh(x))
//
// Closed form, no volumetric march, no extra rays — which is the whole reason it
// belongs in a real-time renderer. src/kubelkaMunk.js is the same maths in JS and
// is what these expressions were validated against (scripts/km-selftest.mjs).
//
// NOTHING HERE IS WRITTEN THE TEXTBOOK WAY. coth blows up as x goes to zero,
// sinh/cosh overflow as it grows, and a - b is a difference of two nearly equal
// large numbers when the medium barely scatters. Every expression below is the
// algebraically identical but numerically stable rewrite, because fp32 hits all
// three of those corners inside one ordinary object: the centre of a sphere is a
// long chord (x large) and its silhouette is a vanishing one (x tiny).
// b is floored, and this one constant is what makes the whole feature fit.
//
// The textbook expressions need a SERIES branch as b*S*t goes to zero (coth
// blows up, and T becomes 0/0 when b is exactly 0 — a pure white scatterer with
// K = 0, which is precisely what a lampshade is). Carrying both branches and a
// step() to pick between them costs live registers, and this shader has none to
// spare: shadowTransmittance is inlined at roughly EIGHT effective sites (main's
// direct loop, plus every traceRadiance call site through sampleOneAny), so
// every vector temporary in its loop body is paid for eight times over. A
// version that did carry both branches failed to link on NVIDIA native GL with
// "error: too many temporaries" — the register-pressure sibling of the C5041
// failure that killed a 0.9.0 shadow-march optimisation.
//
// Flooring b removes the branch instead of hiding it. Because x is computed as
// b*(S*d) with the SAME floored b, the ratio x/b stays exactly S*d, and every
// degenerate limit comes out right from the exponential form alone:
// b*coth(x) -> 1/(S*d), T -> 1/(1 + S*d), R -> S*d/(1 + S*d), R_inf -> 1/(1 + b).
// Verified against the analytic K = 0 case to 0.06% at the values the demo uses.
#define RT_KM_MIN_B 1e-3
// x is clamped before exp() purely as a belt-and-braces guard: a grazing ray
// through a dense medium can reach x in the thousands, where exp(-x) flushes to
// zero harmlessly but exp(+x) (which no expression below uses, by design) would
// have been an infinity.
#define RT_KM_MAX_X 60.0

// Row 68 of the scene-data texture: [S.rgb | kmEnabled] per material. K is NOT
// duplicated here — it is row 67's absorption sigma, so a material states its
// colour once (see collectScattering in SceneCompiler). No new sampler: this is
// the same already-bound scene-data texture the rest of the shader reads.
vec4 rtKmFetch(float matIndex) {
  return texelFetch(uMaterialsTex, ivec2(int(round(matIndex)), 68), 0);
}

// The three derived parameters, shared by both evaluations below. S is floored
// as well as b: at S = 1e-6 the model is already Beer-Lambert to better than
// fp32 can represent (a and b both become K/S, and x collapses to K*d), so ONE
// code path covers "scatters" and "does not scatter" with no branch and no
// discontinuity — which is what lets a plain absorbing layer compose into a
// scattering stack for free.
void rtKmAB(vec3 K, vec3 S, float d, out vec3 a, out vec3 b, out vec3 x) {
  vec3 s = max(S, vec3(1e-6));
  a = 1.0 + max(K, vec3(0.0)) / s;
  // sqrt((a - 1)*(a + 1)) rather than sqrt(a*a - 1): for a weakly absorbing
  // pigment a is 1 + tiny, and a*a - 1 loses every significant bit to
  // cancellation while (a - 1) is exact.
  b = max(sqrt((a - 1.0) * (a + 1.0)), vec3(RT_KM_MIN_B));
  x = min(b * (s * max(d, 0.0)), vec3(RT_KM_MAX_X));
}

// TRANSMITTANCE ONLY — the shadow path's half, and the one that is inlined
// everywhere, so it is kept as small as it can possibly be.
//
// T = 2*b*e^-x / ((a + b) + (b - a)*e^-2x): the textbook
// b / (a*sinh(x) + b*cosh(x)) with e^x divided out of both halves, so nothing
// overflows however thick the body gets. exp(-x) is recovered as sqrt(e2)
// rather than paying a second exp.
vec3 rtKmTrans(vec3 K, vec3 S, float d) {
  vec3 a, b, x;
  rtKmAB(K, S, d, a, b, x);
  vec3 e2 = exp(-2.0 * x);
  return clamp(2.0 * b * sqrt(e2) / max(a + b + (b - a) * e2, vec3(1e-9)), 0.0, 1.0);
}

// BOTH of a layer's numbers: R over a black backing, and T. Used only by the
// view march, which is inlined once, so it can afford the extra reflectance
// term the shadow path never needs.
//
// Taking Rg = 0 here and adding the real backing once at the end is what lets
// the march run front-to-back: the textbook recursion R(t_n over R(t_n-1 over
// ...)) needs the layers in reverse order, which a marching ray does not have.
void rtKmLayer(vec3 K, vec3 S, float d, out vec3 R, out vec3 T) {
  vec3 a, b, x;
  rtKmAB(K, S, d, a, b, x);
  vec3 e2 = exp(-2.0 * x);
  // b*coth(x) = b*(1 + e^-2x)/(1 - e^-2x), finite all the way down because b is
  // floored: it tends to 1/(S*d), which is the term that survives at K = 0.
  vec3 bc = b * (1.0 + e2) / max(1.0 - e2, vec3(1e-9));
  // R(t, 0) = 1/(a + b*coth(x)): 1/(a + b) = R_inf at large x, and the classic
  // S*d/(1 + a*S*d) at small.
  R = clamp(1.0 / (a + bc), 0.0, 1.0);
  T = clamp(2.0 * b * sqrt(e2) / max(a + b + (b - a) * e2, vec3(1e-9)), 0.0, 1.0);
}

// VIEW-PATH RESULTS, handed from glassRadiance (where the in-medium chord is
// measured) to main (where it is shaded). Globals, not return values, because
// the function they come from has a fixed signature that the byte-identity
// contract forbids touching.
//
// WHY THERE IS NO DEDICATED VIEW MARCH, which is the design decision this
// feature turns on. The natural implementation is an ordered march along the
// view ray, mirroring the coloured-shadow one, composing a full layered stack.
// It was written, it works, and it CANNOT BE COMPILED: NVIDIA's native-GL
// assembler rejects the megakernel with "error: too many temporaries" — the
// register-pressure sibling of the C5041 failure that killed a 0.9.0
// shadow-march optimisation. Measured, not assumed:
//
//   full feature, dedicated march ..... 35 319 lines of NV assembly, FAILS
//   same, shadow-side maths removed ... 33 403 lines,                FAILS
//   same, march compiled but uncalled . links
//
// So the march's own BVH traversal is the blocker, not the arithmetic around it,
// and shrinking the arithmetic cannot buy it back. Reusing shadowTransmittance
// for the view ray instead makes it strictly WORSE — that function is already
// inlined at roughly eight effective sites (main's direct loop, and again inside
// every traceRadiance call site by way of sampleOneAny), so a third explicit
// call adds a ninth copy of a traversal.
//
// This shader computes exactly ONE in-medium view chord, in glassRadiance, and
// that is where the two-flux layer is now evaluated. No new traversal, no new
// traceRadiance call site, no new sampler. The cost is v1's honest limitation:
// ONE medium along the view path rather than an arbitrary stack (the shadow path
// still marches through stacks properly). The layered composition lives on in
// src/kubelkaMunk.js, is exercised by the self-test, and is what a future pass
// with register room to spare would use.
bool gKmOn;      // this pixel's primary surface is a scattering body
vec3 gKmR;       // the body's two-flux reflectance over its measured chord
vec3 gKmT;       // ... and its transmittance
vec3 gKmBehind;  // un-attenuated radiance arriving from behind the body
// <<< RT_KM
// >>> RT_ABSORB_SHADOWS (whole block source-spliced — see stripMarked below)
// COLOURED SHADOWS. A shadow ray that crosses absorbing glass is ATTENUATED per
// channel instead of blocked: stained glass spills tinted light, a backlit stack
// of translucent bodies stops rendering as a black silhouette. This is the
// shadow-ray twin of the view-path absorption above, and it is spliced in only
// when the scene absorbs AND rt.absorptionShadows is on — so the fast path (a
// single any-hit ray, occluded()) survives byte-for-byte everywhere else.
//
// NOT an unordered any-hit signed sum. The obvious cheap trick — accumulate
// +sigma on front faces and -sigma on back faces in any order — is wrong for
// real geometry: a multi-body 3D-print stack legitimately contains body-to-body
// interfaces where only ONE of the two coincident walls survives, so entry/exit
// events do not pair up and the signed sum goes NEGATIVE (optical gain, bright
// halos). This marches in ORDER with an explicit current-medium state instead,
// which never produces negative optical depth no matter how unbalanced the
// interfaces are.
//
// Interfaces are classified by the interpolated attribute normal (attr.xyz), not
// a true geometric normal: traceBoth discards the BVH kernel's face normal and
// widening its signature would edit a line the byte-identity contract forbids
// touching. The two agree exactly on the flat-walled bodies this targets, and
// disagree only within a smooth surface's silhouette band, where the mis-classed
// segment is short.
//
// Shadow rays do NOT refract — a straight segment, the standard approximation
// (bending them would need the light re-solved through the bent path).
#define RT_SHADOW_EVENTS 8
// Row 67's .w channel carries the material's TRANSMISSION, which is exactly the
// "is glass to this tracer" flag (SceneCompiler writes it beside sigma; a
// surface the tracer shades opaquely reads 0). Glass with no sigma still lets
// the ray through, contributing nothing to the optical depth — clear glass casts
// no shadow, which is the physically right answer and the one master could not
// express.
float rtShadowGlass(float matIndex) {
  return texelFetch(uMaterialsTex, ivec2(int(round(matIndex)), 67), 0).w;
}
// Per-channel transmittance along the segment (origin, origin + dir * maxDist):
// vec3(1) for a clear line of sight, vec3(0) for an opaque blocker, exp(-tau)
// through glass. ONE textual call to the closest-hit kernel (traceBoth, reused
// by the loop) — the inlined-code footprint is what WebKit's Metal translator
// has broken on before, so this never unrolls.
vec3 shadowTransmittance(vec3 origin, vec3 dir, float maxDist) {
  vec3 tau = vec3(0.0);       // accumulated optical depth, per channel
  vec3 sigmaCur = vec3(0.0);  // absorption of the medium we are currently inside
// >>> RT_KM
  // SCATTERING MEDIA take a different segment law. Beer-Lambert is a sum in
  // log space (tau), while the two-flux transmittance is not exp of anything
  // simple, so it accumulates MULTIPLICATIVELY in its own register and is folded
  // into tau once at the end. Entering a scattering body moves that body's
  // absorption out of sigmaCur and into rtKmK, so the Beer-Lambert line below
  // contributes exactly nothing for those segments — the two accumulators
  // partition the path rather than both charging it.
  vec3 rtKmT = vec3(1.0);     // running two-flux transmittance
  vec3 rtKmS = vec3(0.0);     // scattering of the current medium (0 = not scattering)
  vec3 rtKmK = vec3(0.0);     // absorption of the current medium, held out of sigmaCur
// <<< RT_KM
  float tPrev = 0.0;          // distance from origin to the last INTERFACE crossed
  float tOrig = 0.0;          // distance from origin to o (tPrev plus the eps step)
  vec3 o = origin;
  for (int i = 0; i < RT_SHADOW_EVENTS; i++) {
    uvec4 fi; vec3 bary; float dist; bool isDyn;
    if (!traceBoth(o, dir, fi, bary, dist, isDyn)) break;  // clear from here on
    float tHit = tOrig + dist;
    if (tHit >= maxDist - 2.0 * uEps) break;               // hit is at/behind the light
    vec4 attr = isDyn
      ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
      : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
// >>> RT_TEXTURE_TILES
    // Re-fetch at stride 2: the line above reads the wrong texels under the
    // stride-2 layout. Shadow rays do not need UVs, so the uv output is discarded.
    // GLSL forbids ternaries on opaque types (samplers), so branch explicitly.
    if (isDyn) {
      vec2 _tileUv;
      fetchAttrUv(uAttrDynamic, bary, fi.xyz, attr, _tileUv);
    } else {
      vec2 _tileUv;
      fetchAttrUv(uAttrStatic, bary, fi.xyz, attr, _tileUv);
    }
// <<< RT_TEXTURE_TILES
    // The segment just crossed, measured INTERFACE to INTERFACE — not from the
    // stepped-off origin. The two differ by the 2*eps the march skips past each
    // hit; charging tau only from o would silently under-attenuate every body by
    // 2*eps of its thickness, which is ~10% of a 4 cm slab and far more in a
    // scene whose auto-scaled eps is larger (measured, then fixed).
// >>> RT_KM
    // The segment just crossed, when it lay inside a SCATTERING body: two-flux
    // T() instead of exp(-sigma*d). This is what makes light through a wax or
    // jade body read as dimmer and warmer than absorption alone predicts —
    // scattering removes flux from the straight path that absorption would have
    // let through, so a white pigment stops getting the free ride it does under
    // Beer-Lambert, where a zero sigma means a perfectly clear shadow.
    if (rtKmS != vec3(0.0)) rtKmT *= rtKmTrans(rtKmK, rtKmS, tHit - tPrev);
// <<< RT_KM
    tau += sigmaCur * (tHit - tPrev);
    if (rtShadowGlass(attr.w) <= 0.0) return vec3(0.0);    // opaque: fully occluded
    // Glass interface: front face = entering this body, back face = back to air.
    sigmaCur = dot(attr.xyz, dir) < 0.0 ? rtAbsorbSigma(attr.w) : vec3(0.0);
// >>> RT_KM
    // Hand a scattering body's interior over to the two-flux accumulator. The
    // entering test is recomputed rather than read off sigmaCur, because a
    // pigment may legitimately have zero absorption (a pure white scatterer) and
    // would then be indistinguishable from an exit face.
    vec4 rtKmRow = rtKmFetch(attr.w);
    rtKmS = (dot(attr.xyz, dir) < 0.0 && rtKmRow.w > 0.0) ? rtKmRow.rgb : vec3(0.0);
    rtKmK = sigmaCur;
    if (rtKmS != vec3(0.0)) sigmaCur = vec3(0.0);
// <<< RT_KM
    o += dir * (dist + 2.0 * uEps);                        // step past the interface
    tOrig = tHit + 2.0 * uEps;
    tPrev = tHit;
  }
  // Tail: still inside a medium when the march ended (ran out of geometry, or
  // ran out of events). On the event cap this assumes the medium continues to
  // the light, which errs slightly DARK rather than pretending the ray is clear;
  // either way the result is a transmittance, never the hard black that would
  // reintroduce the silhouette this feature exists to remove.
// >>> RT_KM
  // Same tail rule for a scattering medium the march ended inside.
  if (rtKmS != vec3(0.0)) rtKmT *= rtKmTrans(rtKmK, rtKmS, max(maxDist - tPrev, 0.0));
// <<< RT_KM
  tau += sigmaCur * max(maxDist - tPrev, 0.0);
// >>> RT_KM
  // Fold the multiplicative two-flux factor into the optical depth so the single
  // return below stays exactly the line the stripped source has. Guarded because
  // the log costs three transcendentals and the overwhelming majority of shadow
  // rays in any scene never touch a scattering body at all.
  if (rtKmT != vec3(1.0)) tau -= log(max(rtKmT, vec3(1e-8)));
// <<< RT_KM
  return exp(-tau);
}
// <<< RT_ABSORB_SHADOWS
// World-space 3D-texture albedo ("volumetric surface albedo") for the traced
// SECONDARY rays (GI bounces + reflection/refraction), so global illumination and
// mirror views carry the same field colours the primary G-buffer shows. Compiled
// in ONLY behind RT_VOLUME_ALBEDO: this megakernel already sits at the WebGL2
// 16-sampler minimum, so the extra sampler3D is added exclusively when a scene
// registers a volume AND the GPU exposes >= 17 fragment texture units (the
// RealtimeRaytracer gates both conditions). Absent, the shader is textually
// identical to the pre-feature megakernel — same 16 samplers, same program. v1 is
// single-volume: one texture + one material index; a hit on that material samples
// the field, every other hit reads its flat table albedo unchanged.
#ifdef RT_VOLUME_ALBEDO
uniform highp sampler3D uVolumeTex;
uniform vec3 uVolumeOrigin;
uniform vec3 uVolumeSize;
uniform int uVolumeMatIndex;
vec3 sampleVolumeAlbedo(vec3 p) {
  vec3 uvw = clamp((p - uVolumeOrigin) / uVolumeSize, 0.0, 1.0);
  return texture(uVolumeTex, uvw).rgb;
}
#endif

// ---------- PBR specular (Cook-Torrance GGX) ----------
// A separate specular radiance is accumulated for the primary surface's DIRECT
// lighting alongside the demodulated diffuse irradiance. Because CompositePass
// multiplies the irradiance by albedo, a white dielectric highlight (F0 ~= 0.04)
// cannot ride in that buffer — it is emitted into gSpec and written to a second
// MRT attachment (added by the composite WITHOUT the albedo multiply). Metals'
// specular is albedo-tinted (F0 = albedo), so it stays in the reflection path
// where the composite's albedo multiply supplies the tint; gSpec is therefore
// scaled by (1 - metal)(1 - transmission) at output. Net effective Fresnel
// across both buffers is mix(0.04, albedo, metal) without the lighting pass ever
// sampling albedo (that would push it past the 16-sampler minimum).
vec3 gSpec;        // accumulated dielectric direct specular radiance
vec3 gViewDir;     // unit vector from the primary surface toward the camera
float gSpecRough;  // primary surface roughness (drives the GGX lobe width)
bool gWantSpec;    // true only while shading the PRIMARY surface's direct light

float D_GGX(float NoH, float a) {
  float a2 = a * a;
  float d = NoH * NoH * (a2 - 1.0) + 1.0;
  return a2 / max(PI * d * d, 1e-8);
}
// Height-correlated Smith visibility (already folds in the 1/(4 NoL NoV) term).
float V_SmithGGX(float NoV, float NoL, float a) {
  float a2 = a * a;
  float gv = NoL * sqrt(NoV * NoV * (1.0 - a2) + a2);
  float gl = NoV * sqrt(NoL * NoL * (1.0 - a2) + a2);
  return 0.5 / max(gv + gl, 1e-5);
}
vec3 F_Schlick(float VoH, vec3 f0) {
  return f0 + (1.0 - f0) * pow(clamp(1.0 - VoH, 0.0, 1.0), 5.0);
}
// Specular BRDF value (without the incoming NoL*radiance factor). F0 fixed at
// the dielectric 0.04 — metals are handled in the reflection path.
float ggxSpec(vec3 N, vec3 L) {
  vec3 H = normalize(gViewDir + L);
  float NoH = max(dot(N, H), 0.0);
  float NoV = max(dot(N, gViewDir), 1e-4);
  float NoL = max(dot(N, L), 1e-4);
  float VoH = max(dot(gViewDir, H), 0.0);
  // Clamp alpha off zero so a mirror-smooth dielectric does not produce an
  // infinite spike the temporal buffer cannot resolve.
  float a = max(gSpecRough * gSpecRough, 2e-3);
  return D_GGX(NoH, a) * V_SmithGGX(NoV, NoL, a) * F_Schlick(VoH, vec3(0.04)).x;
}
// Add the dielectric specular for one light: li is the incoming radiance
// factor (light colour * cone / dist^2), NoL the geometric cosine.
void addSpec(vec3 N, vec3 L, vec3 li, float NoL) {
  if (!gWantSpec) return;
  gSpec += li * (NoL * ggxSpec(N, L));
}

// ---------- lighting ----------
// Direct irradiance (demodulated: no albedo) at point P with normal N,
// from light i, with one shadow ray. Area-samples point lights for soft shadows.
// Spot cone falloff: smooth between the outer and inner cone cosines
// (posType.w = 2 + cosInner; dirCone.w = cosOuter).
float spotFalloff(int i, vec3 lightToP) {
  vec4 posType = uLightPosType[i];
  if (posType.w < 1.5) return 1.0;
  vec4 dc = uLightDirCone[i];
  return smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, lightToP));
}

vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];

  vec3 L;
  float dist2 = 1.0;
  float maxDist = 1e7;
  float cone = 1.0;

  if (posType.w < 0.5 || posType.w >= 1.5) {
    // point/spot light: sample a point on its sphere for soft shadows
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - P;
    float dl = length(d);
    if (dl < 1e-5) return vec3(0.0);
    L = d / dl;
    dist2 = dl * dl;
    maxDist = dl;
    cone = spotFalloff(i, -L);
    if (cone <= 0.0) return vec3(0.0);
  } else {
    // directional light: jitter within a small cone
    L = normalize(-posType.xyz + randUnitVector() * colRad.w);
    dist2 = 1.0;
  }

  float NdotL = dot(N, L);
  if (NdotL <= 0.0) return vec3(0.0);

// >>> RT_ABSORB_SHADOWS
  // COLOURED SHADOWS (analytic lights): the per-channel transmittance march
  // REPLACES the binary occlusion test on the line below. The splice contract
  // only ever ADDS lines — every line that survives the strip must be
  // byte-identical to master's — so the test is disabled by the "if (false)"
  // rather than by editing it, and both it and the constant branch are dead
  // before the driver's first optimisation pass.
  vec3 rtSt = shadowTransmittance(P + N * uEps, L, maxDist);
  if (rtSt == vec3(0.0)) return vec3(0.0);
  if (false)
// <<< RT_ABSORB_SHADOWS
  if (occluded(P + N * uEps, L, maxDist)) return vec3(0.0);
  vec3 li = colRad.rgb * (cone / dist2);
// >>> RT_ABSORB_SHADOWS
  li *= rtSt; // tint + attenuate; the highlight below inherits it for free
// <<< RT_ABSORB_SHADOWS
  addSpec(N, L, li, NdotL); // same shadow ray shadows the highlight
  return li * NdotL;
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
//
// NOISE CAVEAT: emissive NEE is the highest-variance direct-light path in the
// engine — one triangle sample per pixel per frame, and the area-to-solid-angle
// conversion carries a 1/dist^2 that spikes into fireflies when a shading point
// sits close to a small emitter. Two mitigations stack here:
//  1. uEmissiveCDF (default on): the triangle is IMPORTANCE-SAMPLED by
//     area x emitted luminance via the power CDF in the scene-data texture
//     (row 2 + 64 — see SceneCompiler's layout comment). A big bright panel is
//     picked proportionally more often than a tiny dim strip, and each sample
//     is weighted by its true pick probability — same mean, far less variance
//     than the uniform 1-of-N pick.
//  2. ReSTIR reservoirs converge each pixel onto the emitter that matters
//     (the demo keeps restir on whenever emissive NEE is on;
//     RealtimeRaytracer.compileScene logs a hint otherwise).
// fireflyClamp and the denoiser absorb the residual tail. Distance-aware
// selection and solid-angle triangle sampling remain future work.
vec3 sampleEmissiveTri(vec3 P, vec3 N) {
  if (uEmissiveCount == 0) return vec3(0.0);
  int idx;
  float invProb; // 1 / P(picked this triangle)
  if (uEmissiveCDF) {
    // Binary search the power CDF: 8 steps covers MAX_EMISSIVE_TRIS = 256.
    float u = rand();
    int lo = 0;
    int hi = uEmissiveCount - 1;
    for (int s = 0; s < 8; s++) {
      if (lo >= hi) break;
      int mid = (lo + hi) >> 1;
      if (u > texelFetch(uMaterialsTex, ivec2(mid, 66), 0).x) lo = mid + 1;
      else hi = mid;
    }
    idx = lo;
    invProb = 1.0 / max(texelFetch(uMaterialsTex, ivec2(idx, 66), 0).y, 1e-8);
  } else {
    idx = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1);
    invProb = float(uEmissiveCount);
  }
  int i = idx * 4;
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
// >>> RT_ABSORB_SHADOWS
  // COLOURED SHADOWS (area emitters) — THE backlit-stack path: an emissive panel
  // behind stacked translucent bodies now lights what is in front of them,
  // filtered, instead of being blocked into a black silhouette. Same
  // add-lines-only splice as the analytic-light site above.
  vec3 rtSt = shadowTransmittance(P + N * uEps, wi, dist);
  if (rtSt == vec3(0.0)) return vec3(0.0);
  if (false)
// <<< RT_ABSORB_SHADOWS
  if (occluded(P + N * uEps, wi, dist)) return vec3(0.0);

  // Pick of one tri (probability 1/invProb) + uniform point on it:
  // pdf_area = 1/(invProb·area). Solid-angle conversion gives irradiance
  // Le · cosS · cosL / (d² · pdf_area).
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * invProb * t0.w / max(d2, 1e-6));
// >>> RT_ABSORB_SHADOWS
  e *= rtSt; // filtered by every absorbing body between P and the sampled point
// <<< RT_ABSORB_SHADOWS

  // Dielectric highlight from this emitter: e already folds in cosS, so the
  // specular is e * (GGX BRDF) toward the sampled point (wi).
  if (gWantSpec) gSpec += e * ggxSpec(N, wi);

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

// Shade this pixel's ReSTIR reservoir winner: recompute the (unshadowed)
// contribution — MUST match RestirPass.candidateContribution — then pay the
// one visibility ray and weight by W = wSum / (M · p̂). Analytic lights
// re-draw their soft-radius jitter here (the reservoir stores which light,
// not the jitter). The estimator inherently tames near-emitter spikes: a huge
// contribution comes with a proportionally huge p̂, and W divides it out.
vec3 shadeReservoir(vec3 P, vec3 N) {
  // Spatial-stage encoding: r = id, a = precomputed W (vs. centroid score).
  vec4 res = texture(uReservoir, vUv);
  if (res.a <= 0.0) return vec3(0.0);
  float id = res.r;

  vec3 C;
  vec3 wi;
  float maxDist;
  if (id < float(MAX_LIGHTS)) {
    int i = int(id);
    vec4 posType = uLightPosType[i];
    vec4 colRad = uLightColorRadius[i];
    if (posType.w < 0.5 || posType.w >= 1.5) {
      vec3 d = posType.xyz - P;
      float dl = length(d);
      if (dl < 1e-5) return vec3(0.0);
      float NdotL = dot(N, d / dl);
      if (NdotL <= 0.0) return vec3(0.0);
      float cone = spotFalloff(i, -d / dl);
      if (cone <= 0.0) return vec3(0.0);
      C = colRad.rgb * (cone * NdotL / (dl * dl));
      vec3 lp = posType.xyz + randUnitVector() * colRad.w; // soft shadows
      vec3 dj = lp - P;
      maxDist = length(dj);
      if (maxDist < 1e-5) return vec3(0.0);
      wi = dj / maxDist;
    } else {
      float NdotL = dot(N, -posType.xyz);
      if (NdotL <= 0.0) return vec3(0.0);
      C = colRad.rgb * NdotL;
      wi = normalize(-posType.xyz + randUnitVector() * colRad.w);
      maxDist = 1e7;
    }
  } else {
    int t = (int(id) - MAX_LIGHTS) * 4;
    vec4 t0 = texelFetch(uMaterialsTex, ivec2(t, 1), 0);
    vec4 t1 = texelFetch(uMaterialsTex, ivec2(t + 1, 1), 0);
    vec4 t2 = texelFetch(uMaterialsTex, ivec2(t + 2, 1), 0);
    vec4 t3 = texelFetch(uMaterialsTex, ivec2(t + 3, 1), 0);
    // v3: the reservoir chose the TRIANGLE; draw a FRESH point on it every
    // frame so the area light keeps averaging (no frozen-point noise). W was
    // normalized against the centroid score, and E[point sample] = the
    // triangle's true contribution, so the estimator stays consistent.
    vec2 uv = rand2();
    if (uv.x + uv.y > 1.0) uv = 1.0 - uv;
    vec3 lp = t0.xyz + t1.xyz * uv.x + t2.xyz * uv.y;
    vec3 d = lp - P;
    float d2 = dot(d, d);
    maxDist = sqrt(d2);
    if (maxDist < 1e-4) return vec3(0.0);
    wi = d / maxDist;
    float cosS = dot(N, wi);
    float cosL = abs(dot(t3.xyz, wi));
    if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
    C = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * t0.w / max(d2, 1e-6));
  }

  if (occluded(P + N * uEps, wi, maxDist)) return vec3(0.0);
  // Dielectric highlight from the reservoir winner (C = li * cos, shared with
  // the diffuse term; W = res.a is applied to both).
  if (gWantSpec) gSpec += C * (ggxSpec(N, wi) * res.a);
  vec3 e = C * res.a;
  // Safety clamp, same budget as the emissive direct clamp elsewhere.
  float l = dot(e, vec3(0.299, 0.587, 0.114));
  float cap = uFireflyClamp * 2.0;
  if (l > cap) e *= cap / l;
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
// emitters (static AND dynamic — dynamic emitters now join the NEE table, their
// rows refreshed each frame) so that light isn't counted twice.
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
// >>> RT_TEXTURE_TILES
  // Re-fetch at stride 2 and get the interpolated UV for tile sampling.
  // Branch explicitly: GLSL forbids ternaries on opaque types (samplers).
  vec2 _tileUv;
  if (isDyn) {
    fetchAttrUv(uAttrDynamic, bary, fi.xyz, attr, _tileUv);
  } else {
    fetchAttrUv(uAttrStatic, bary, fi.xyz, attr, _tileUv);
  }
// <<< RT_TEXTURE_TILES
  vec3 hAlbedo; float hRough; vec3 hEmissive; float hMetal;
  fetchMaterial(attr.w, hAlbedo, hRough, hEmissive, hMetal);
  vec3 hN = normalize(attr.xyz);
  if (dot(hN, rd) > 0.0) hN = -hN;
  vec3 hP = ro + rd * dist;
  // Volumetric surface albedo: if this hit is the volume material, replace its
  // flat table albedo with the 3D-texture sample at the world hit point, so GI /
  // reflection bounces carry the field colours (matches the primary G-buffer).
#ifdef RT_VOLUME_ALBEDO
  if (int(round(attr.w)) == uVolumeMatIndex) hAlbedo = sampleVolumeAlbedo(hP);
#endif
// >>> RT_TEXTURE_TILES
  // Per-texel shading for secondary rays: replace the averaged table colour with
  // the actual texel at the hit point's UV. The table colour already carries the
  // material tint (color for albedo, emissive*intensity for emissive), so
  // multiplying by the map texel gives the same result as three.js's compose:
  // color * map and emissive * emissiveMap * emissiveIntensity.
  if (uHasTextureTiles) {
    vec4 _ti = texelFetch(uMaterialsTex, ivec2(int(round(attr.w)), 69), 0);
    float _albedoTile = _ti.x;
    float _emissiveTile = _ti.y;
    if (_albedoTile >= 0.0) hAlbedo *= tileSample(_albedoTile, _tileUv).rgb;
    if (_emissiveTile >= 0.0) hEmissive *= tileSample(_emissiveTile, _tileUv).rgb;
  }
// <<< RT_TEXTURE_TILES
  vec3 Ld = sampleOneAny(hP + hN * uEps, hN);
  vec3 hLe = (!specular && uEmissiveCount > 0) ? vec3(0.0) : hEmissive;
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

// Analytic lights live in uniform arrays, not the BVH, so a traced reflection
// ray never sees them — a mirror under a spotlight would show no glint. Evaluate
// each light as a small area source along the (roughness-jittered) reflection
// direction: if refl points within the light's angular radius, the light's disc
// is reflected, so add its radiance. The jitter in refl (from glossyReflect)
// softens the disc over temporal accumulation, widening the glint with
// roughness. Shadowed with the same any-hit occluder as direct lighting.
vec3 analyticGlint(vec3 P, vec3 refl) {
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= uLightCount) break;
    vec4 posType = uLightPosType[i];
    vec4 colRad = uLightColorRadius[i];
    if (posType.w < 0.5 || posType.w >= 1.5) {
      // point / spot
      vec3 d = posType.xyz - P;
      float dl = length(d);
      if (dl < 1e-4) continue;
      vec3 toL = d / dl;
      float cone = spotFalloff(i, -toL);
      if (cone <= 0.0) continue;
      // Angular radius of the sphere light + a small floor so a zero-radius
      // light still shows a pin-point glint.
      float ang = atan(max(colRad.w, 1e-3) / dl) + 0.01;
      if (dot(refl, toL) < cos(ang)) continue;
      if (occluded(P + refl * uEps, refl, dl)) continue;
      sum += colRad.rgb * (cone / (dl * dl));
    } else {
      // directional: fixed small angular size (colRad.w = sun softness)
      vec3 toL = normalize(-posType.xyz);
      float ang = max(colRad.w, 0.02) + 0.01;
      if (dot(refl, toL) < cos(ang)) continue;
      if (occluded(P + refl * uEps, refl, 1e7)) continue;
      sum += colRad.rgb;
    }
  }
  return sum;
}

// Glass: Fresnel-weighted blend of a surface reflection and a two-interface
// refraction (enter at P, march to the exit surface, refract again).
//
// CHROMATIC DISPERSION (stochastic spectral sampling). Real glass has a
// wavelength-dependent ior, so white light splits into a spectrum (a diamond
// throws a rainbow). Tracing one refraction path per colour would cost three
// traceRadiance calls, but the Metal call-site budget (see the note at the
// unified secondary-ray site) forbids a fourth traceRadiance anywhere in this
// shader. Instead, when uDispersion > 0 each frame this pixel picks ONE colour
// channel c in R,G,B uniformly and traces the SAME single refraction path with
// a channel-shifted ior. The refracted radiance is then isolated to channel c
// and multiplied by 3 (to compensate the 1-of-3 pick); the temporal EMA
// averages the three per-channel estimates into a full-spectrum, dispersed
// refraction — zero extra rays, zero new call sites, unbiased in the mean. It
// therefore shimmers slightly while converging.
//
// THE MIX SPLIT. The return is mix(refrRad, reflRad, fres) = refrRad*(1-fres)
// + reflRad*fres. Only the TRANSMITTED half (refrRad) carries the channel
// mask; the reflection half (reflRad) is NOT dispersed and stays full colour
// EVERY frame. To keep the reflection deterministic frame-to-frame, the
// Fresnel weight is taken from the BASE ior (constant), not the channel-shifted
// ior — only the refracted ray DIRECTION disperses, so the reflection term
// reflRad*fres is identical every frame while refrRad*mask*3 is the spectral
// estimator.
//
// OFF-PATH IDENTITY. uDispersion == 0 skips the channel pick entirely: it
// consumes NO rand() (so the RNG stream does not shift), leaves iorC == ior and
// chanMask == vec3(1), and the whole function reduces byte-for-byte to the
// pre-dispersion path.
vec3 glassRadiance(vec3 P, vec3 N, vec3 V, float rough, float ior) {
  vec3 refl = glossyReflect(V, N, rough);
  vec3 reflRad = dot(refl, N) > 0.0
    ? traceRadiance(P + N * uEps, refl, true) + analyticGlint(P, refl)
    : vec3(0.0);

  // Per-frame spectral channel pick for the transmitted term (guarded so the
  // off path consumes no rand()).
  vec3 chanMask = vec3(1.0); // full colour (un-masked) when dispersion is off
  float iorC = ior;
  if (uDispersion > 0.0) {
    int c = min(int(rand() * 3.0), 2); // uniform channel: 0 = R, 1 = G, 2 = B
    // Normal dispersion: BLUE has the higher refractive index and bends most,
    // red least. shift = (-1.0, 0.0, +1.0) * 0.5, indexed by channel:
    // R = -0.5, G = 0, B = +0.5. uDispersion (0..0.5) scales the ior spread.
    // (The original spec vector had the R/B signs reversed — audit-corrected.)
    float shift = c == 0 ? -0.5 : (c == 2 ? 0.5 : 0.0);
    iorC = ior * (1.0 + uDispersion * shift);
    // Isolate channel c and weight x3: vec3(3,0,0) / (0,3,0) / (0,0,3). The
    // mean over the three equally-likely picks is (1/3)(3,0,0)+... = (1,1,1),
    // so E[masked refrRad] == refrRad. The OTHER channels are zero this frame.
    chanMask = c == 0 ? vec3(3.0, 0.0, 0.0)
             : c == 1 ? vec3(0.0, 3.0, 0.0)
                      : vec3(0.0, 0.0, 3.0);
  }

  float eta = 1.0 / iorC;                 // channel-shifted: drives the refraction bend
  vec3 rd = refract(V, N, eta);
  if (rd == vec3(0.0)) return reflRad;    // total internal reflection at entry
  // Fresnel from the BASE ior so the reflection/refraction split is the same
  // every frame (reflection stays full colour and un-dispersed). Equal to the
  // original schlick(..., eta) when uDispersion == 0 (iorC == ior).
  float fres = schlick(clamp(-dot(V, N), 0.0, 1.0), 1.0 / ior);

  vec3 ro = P - N * (2.0 * uEps);
  vec3 refrRad;
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    // Exit interface: refract back out (or bounce once on internal reflection).
    vec4 attr = isDyn
      ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
      : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
// >>> RT_TEXTURE_TILES
    // Re-fetch at stride 2 so the material index and normal are correct.
    // Branch explicitly: GLSL forbids ternaries on opaque types (samplers).
    if (isDyn) {
      vec2 _tileUv;
      fetchAttrUv(uAttrDynamic, bary, fi.xyz, attr, _tileUv);
    } else {
      vec2 _tileUv;
      fetchAttrUv(uAttrStatic, bary, fi.xyz, attr, _tileUv);
    }
// <<< RT_TEXTURE_TILES
    vec3 xN = normalize(attr.xyz);
    if (dot(xN, rd) > 0.0) xN = -xN;
    vec3 xP = ro + rd * dist;
    vec3 rd2 = refract(rd, xN, iorC);     // same channel-shifted ior on exit
    if (rd2 == vec3(0.0)) rd2 = reflect(rd, xN);
    refrRad = traceRadiance(xP - xN * uEps, rd2, true);
// >>> RT_KM
    // KUBELKA-MUNK. This is the only place in the shader that measures how far a
    // VIEW ray travels inside a body, which is exactly the quantity the two-flux
    // model needs — so the layer is evaluated here and handed to main through
    // globals. Placed BEFORE the Beer-Lambert line below so gKmBehind is the raw
    // radiance from behind the body, un-attenuated: scattering media replace that
    // model rather than stacking on top of it.
    //
    // THICKNESS CORRECTION. dist is measured from ro, which the line above put
    // 2*eps INSIDE the entry surface along the normal, so it under-reports the
    // chord by the distance from ro back to the entry plane: 2*eps / |rd.N|.
    // That is a fixed 7 cm in a room-sized scene — half the wall of a cast
    // shade, or MORE THAN THE FULL DEPTH of a stained-glass tile: an 8 cm pane
    // in the museum kept under 1 cm of measured chord and read nearly clear.
    // The correction is exact and applies to BOTH consumers of the chord: the
    // KM layer and the Beer-Lambert line below. (Until 0.12.1 the absorption
    // line kept 0.8.0's uncorrected chord "because a tint could absorb the
    // error"; the Lumiere screen's thin tiles proved it cannot.) Bodies
    // thinner than 2*eps along the normal remain unresolvable: ro starts
    // beyond their exit face, so the exit hit lands on some other surface and
    // no chord accounting can recover the tint. Keep exhibits chunkier than
    // 2*eps, and see the eps auto-scale in RealtimeRaytracer.
    //
    // The 0.25 floor bounds the correction at 8*eps. For real glass it never
    // binds: refraction into a denser medium caps the internal angle at
    // asin(1/ior), so rd.N is at least 0.745 at ior 1.5. It exists for the
    // ior -> 1 end of the G-buffer's [1, 1.98] range, where the refracted ray
    // approaches the view ray and can graze — there an unbounded 1/|rd.N|
    // would invent metres of chord and read the whole silhouette as masstone.
    //
    // The correction expression is spelled out inside EACH marker block rather
    // than hoisted to a shared local: these >>> <<< blocks are spliced in and
    // out independently per feature (see setAbsorption / setKmScattering), so
    // a local declared in one block is an undeclared identifier when the other
    // block compiles without it — which ships as a black frame, not an error
    // you see in dev.
    vec4 rtKmRow = rtKmFetch(attr.w);
    gKmOn = rtKmRow.w > 0.0;
    if (gKmOn) {
      rtKmLayer(rtAbsorbSigma(attr.w), rtKmRow.rgb,
        dist + 2.0 * uEps / max(abs(dot(rd, N)), 0.25), gKmR, gKmT);
      gKmBehind = refrRad;
    }
// <<< RT_KM
// >>> RT_ABSORPTION
    // BEER-LAMBERT ABSORPTION of the transmitted term. dist is the ONE
    // in-medium path length this shader computes: entry interface (P) to exit
    // interface along the refracted ray — how far the transmitted view path
    // actually travelled INSIDE the glass. Everything that came back through
    // the exit interface (surface shading behind the slab, an emissive panel's
    // glow, the sky) rides that segment, so this single multiply tints it all:
    // a thick slab tints deeper than a thin one, and a backlit pane glows in
    // the filtered colour for free. The medium is identified by the EXIT
    // interface's material (attr.w): for closed glass volumes that is the same
    // material the ray entered (the entry surface's matIndex is not in the
    // G-buffer — the packed word carries transmission/ior only), and for an
    // open sheet the exit lands on some other surface whose sigma is 0
    // (SceneCompiler only tables sigma for glass materials), so the multiply
    // is exactly 1 — no false tinting over air. Applied ONLY to the
    // transmitted term: the Fresnel reflection half never entered the medium.
    // On total internal reflection (rd2 above) the entry chord was still
    // in-medium, so attenuating remains correct; the extra post-TIR bounce
    // inside the slab is not tracked (the documented one-layer limit). Order
    // vs the dispersion channel mask below is irrelevant — both are
    // per-channel scale factors.
    // Chord corrected for the 2*eps entry offset exactly like the KM layer
    // above (same expression, kept inline for the splice-block reason given
    // there); until 0.12.1 this used the raw under-reported dist.
    refrRad *= rtTransmittance(attr.w,
      dist + 2.0 * uEps / max(abs(dot(rd, N)), 0.25));
// <<< RT_ABSORPTION
  } else {
    refrRad = uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  // Mask ONLY the transmitted term to the chosen channel (full colour when
  // dispersion is off); the reflection term is never masked.
  vec3 glass = mix(refrRad * chanMask, reflRad, fres);

  // THE GLASS PATH'S OWN FIREFLY CLAMP. Every other radiance in this shader is
  // bounded before it can reach the accumulator: indirect by uFireflyClamp,
  // emissive NEE and the ReSTIR shade by 2x that, specular by 4x. Glass had
  // nothing. main() composes it as mix(direct + indirect, glassRadiance,
  // transmission), and a solid dielectric decodes to transmission == 1.0
  // exactly, so that mix DISCARDS the clamped terms entirely and hands the
  // accumulator whatever this function returned, unbounded except by half-float
  // saturation. (The specular cap cannot help: it is applied to the specular
  // attachment, which a full-transmission pixel scales by 1 - transmission =
  // 0.) A near-mirror dielectric that catches the sky's sun disc through its
  // Fresnel lobe therefore writes a value tens of times the clamp budget, the
  // EMA carries it, and the amber exhibit blows out to white on close orbit.
  //
  // Same budget as the specular path, for the same reason: a narrow lobe on a
  // smooth dielectric is exactly as spiky as one on a metal.
  float glassCap = uFireflyClamp * uGlassClampScale;
  float glassLum = dot(glass, vec3(0.299, 0.587, 0.114));
  if (uGlassClampScale > 0.0 && glassLum > glassCap) glass *= glassCap / glassLum;
  return glass;
}

// Compact cold->hot ramp for the BVH-cost heatmap. Piecewise mix of five
// anchors (deep blue -> green -> yellow -> red -> white) over four equal
// segments — cheap, no textures, no extra samplers. t is the normalised cost
// (visit count * uCostScale), clamped to [0,1]; saturating at white = the most
// expensive pixels.
vec3 costPalette(float t) {
  t = clamp(t, 0.0, 1.0);
  const vec3 c0 = vec3(0.02, 0.05, 0.45); // cold: cheap (few boxes)
  const vec3 c1 = vec3(0.05, 0.55, 0.25); // green
  const vec3 c2 = vec3(0.95, 0.85, 0.10); // yellow
  const vec3 c3 = vec3(0.90, 0.10, 0.05); // red
  const vec3 c4 = vec3(1.00, 1.00, 1.00); // hot: expensive (many boxes)
  float s = t * 4.0;
  vec3 col = mix(c0, c1, clamp(s, 0.0, 1.0));
  col = mix(col, c2, clamp(s - 1.0, 0.0, 1.0));
  col = mix(col, c3, clamp(s - 2.0, 0.0, 1.0));
  col = mix(col, c4, clamp(s - 3.0, 0.0, 1.0));
  return col;
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outIrradiance = vec4(0.0);
    outSpecular = vec4(0.0);
    return;
  }

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 1973u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  vec3 P = wp.xyz;
  vec4 nmSample = texture(uGNormalMetal, vUv);
  vec3 N = normalize(nmSample.xyz);
  // Decode the packed material word (see GBufferPass): [4,5] → alpha blend
  // (w - 4 = opacity), [2,4) → glass (w - 2 = transmission), else metalness.
  float matW = nmSample.w;
  bool blend = matW >= 4.0;
  float opacity = blend ? clamp(matW - 4.0, 0.0, 1.0) : 1.0;
  float transmission = (matW >= 2.0 && matW < 4.0) ? clamp(matW - 2.0, 0.0, 1.0) : 0.0;
  float metal = matW < 2.0 ? matW : 0.0;
  float rough = clamp(wp.w - 1.0, 0.0, 1.0);
  // Per-material IOR rides the [3,4) glass sub-band (full-transmission glass, see
  // GBufferPass). Below 3 (partial glass) or non-glass, fall back to the global
  // rt.ior uniform. material.ior wins whenever it was encoded. (Task 2)
  float ior = (matW >= 3.0 && matW < 4.0) ? (1.0 + (matW - 3.0)) : uIor;

  // Cook-Torrance specular state for this primary surface. gWantSpec gates the
  // GGX term to PRIMARY direct lighting only (GI-bounce direct light, below,
  // reuses the same functions but must not pollute the highlight buffer).
  gSpec = vec3(0.0);
  gViewDir = normalize(uCameraPos - P);
  gSpecRough = rough;
  gWantSpec = true;

// >>> RT_KM
  // A global with no initializer is undefined in GLSL until written; this is the
  // write, ahead of the specular output that reads it.
  gKmOn = false;
// <<< RT_KM
  // Reset the shadow-ray traversal-cost counter for this pixel. It accumulates
  // across every occluded() call below (direct, GI, reflection, glass) and is
  // read once at the end when uCostView is on (see the cost-heatmap branch).
  gBvhVisits = 0;

  // --- direct lighting ---
  // ReSTIR: shade the reservoir's winner with one visibility ray (flat cost in
  // light count). Stochastic: one blind random sample. Full: one shadow ray
  // per light + one for the emissive set.
  vec3 direct = vec3(0.0);
  if (uRestirEnabled) {
    direct = shadeReservoir(P, N);
  } else if (uLightStochastic) {
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
  // Half-rate mode traces on alternating checkerboard parity each frame,
  // DOUBLED — the temporal average converges to the same brightness
  // (unbiased) while GI's ray cost halves; accumulation + denoise absorb
  // the alternation.
  gWantSpec = false; // secondary bounces contribute to diffuse GI only
  // BLEND pixels reuse THIS call site as their straight-through view
  // continuation instead of a GI bounce (their behind-image rides the specular
  // attachment; the pane forgoes its own GI bounce — visually negligible, and
  // it saves a ray). CRITICAL CALL-SITE BUDGET: traceRadiance may appear at
  // most THREE times in this shader (glass refraction exit, this unified
  // secondary site, the metal-reflection path). WebKit's GLSL->Metal
  // translation silently emits a broken program at a FOURTH inlined call site
  // (clean compile, black output on every iOS browser) — bisected live on an
  // iPad, 2026-07-22. Never add a call site; extend this one.
  vec3 indirect = vec3(0.0);
  vec3 blendBehind = vec3(0.0);
  bool wantBehind = uBlendEnabled && blend;
  // uExternalGI (experimental ReSTIR GI): the GIReservoirPass supplies the
  // bounce, so the inline GI ray is skipped — but the blend continuation is
  // NOT GI and must keep tracing regardless.
  bool wantGI = uGIEnabled && !uExternalGI && !wantBehind
    && (!uGIHalfRate || (((px.x + px.y + int(uFrame)) & 1) == 0));
  if (wantBehind || wantGI) {
    vec3 Vv = normalize(P - uCameraPos);
    vec3 dir = wantBehind ? Vv : cosineSampleHemisphere(N, rand2());
    vec3 org = wantBehind ? P + Vv * uEps : P + N * uEps;
    vec3 r = traceRadiance(org, dir, wantBehind);
    if (wantBehind) {
      blendBehind = r;
    } else {
      indirect = r;
      if (uGIHalfRate) indirect *= 2.0;
    }
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
      // analyticGlint adds the direct lights the reflection ray cannot see, so
      // a metal under a spotlight shows a proper (albedo-tinted) glint.
      vec3 reflRad = traceRadiance(P + N * uEps, refl, true) + analyticGlint(P, refl);
      sampleIrr = mix(sampleIrr, reflRad, metal);
    }
  }

  // --- traced glass: Fresnel reflection + two-interface refraction ---
  if (uRefrEnabled && transmission > 0.001) {
    vec3 V = normalize(P - uCameraPos);
    sampleIrr = mix(sampleIrr, glassRadiance(P, N, V, rough, ior), transmission);
  }
// >>> RT_KM
  // KUBELKA-MUNK. glassRadiance set these when it measured this pixel's chord
  // through a scattering body (see the note there); a scattering body is not a
  // window, so its result REPLACES what the glass branch just wrote rather than
  // blending with it.
  //
  //   gKmR * E        light that entered the surface, scattered, and came back
  //                   out. E = (direct + indirect) is the demodulated diffuse
  //                   irradiance the surface would have used as any other
  //                   diffuse material — which is precisely what "use R as the
  //                   albedo under the normal direct-lighting path" means. The
  //                   composite then re-applies the base colour, which is why a
  //                   scattering material wants a white one.
  //   gKmT * behind   what came through from the other side. For a lampshade
  //                   with a bulb inside, "behind" IS the bulb, so this term is
  //                   the shade glowing.
  //
  // The inward half of the transmitted term is not missing, it is just computed
  // elsewhere: whatever is behind was itself lit by shadow rays that crossed
  // this same body and were attenuated by the same two-flux T (see
  // shadowTransmittance). What IS dropped is the inter-reflection between body
  // and backing — a second-order brightening — and the traced Fresnel reflection
  // (the GGX highlight below stands in for it).
  if (gKmOn) sampleIrr = gKmR * (direct + indirect) + gKmT * gKmBehind;
// <<< RT_KM

  // --- alpha blend: straight-through view continuation ---
  // A transparent surface is primary-visible in the G-buffer but was kept out of
  // the BVH, so a ray along the view direction passes THROUGH it to whatever is
  // behind. Trace that continuation and shade it like a glass/GI hit (emitters
  // keep their emission — this is direct visibility through the pane — sky/env on
  // a miss). The two quantities live at DIFFERENT scales: sampleIrr is the
  // pane's own demodulated surface light (composite re-applies albedo), while
  // the behind trace is final outgoing radiance — mixing them in one slot makes
  // the pane term drown out what shows through. So the behind image rides the
  // SPECULAR attachment instead (composite adds that buffer without the albedo
  // multiply, and its short-history accumulation suits behind-content that
  // parallaxes against the pane), and CompositePass performs the opacity blend
  // where the pane's albedo is actually available. sampleIrr keeps only the
  // pane's own surface lighting, which is static on the surface and accumulates
  // with normal full-length history.
  // (The straight-through trace itself happens at the unified secondary-ray
  // call site above — see the Metal call-site-count note there.)

  // A single NaN/Inf sample would poison the EMA history for good (mix() with
  // NaN stays NaN until a disocclusion resets the pixel) — sanitize first.
  if (any(isnan(sampleIrr)) || any(isinf(sampleIrr))) sampleIrr = vec3(0.0);

  // Fresh dielectric direct specular for this frame. Metals/glass carry their
  // (albedo-tinted) specular in the reflection path above, so scale their share
  // out of the white buffer — the effective F0 is mix(0.04, albedo, metal),
  // split across the two buffers. The separate SpecularAccumPass reprojects and
  // temporally accumulates this with a short (near-mirror) history.
  // Blend pixels repurpose this attachment for the straight-through behind
  // radiance (see above) — their dielectric highlight is dropped, a fair trade
  // for a correct-scale see-through image.
  vec3 spec = blend ? blendBehind : gSpec * ((1.0 - metal) * (1.0 - transmission));
// >>> RT_KM
  // A scattering body is a dielectric SOLID, not a window. The (1 - transmission)
  // scale above exists so a see-through pane does not double-count its highlight
  // into the behind-image; polished jade, wax and marble have no behind-image and
  // a very real Fresnel sheen, so it is restored here rather than scaled away.
  if (gKmOn) spec = gSpec * (1.0 - metal);
// <<< RT_KM
  if (any(isnan(spec)) || any(isinf(spec))) spec = vec3(0.0);
  if (!blend) {
    float specLum = dot(spec, vec3(0.299, 0.587, 0.114));
    float specCap = uFireflyClamp * 4.0; // narrow lobes spike; keep the EMA stable
    if (specLum > specCap) spec *= specCap / specLum;
  }
  outSpecular = vec4(spec, 1.0);

  if (uRawOutput) {
    // Split-accumulation path: write RAW per-frame sample. AccumulatePass reads
    // this and does the EMA merge with neighbourhood anti-firefly clamping.
    outIrradiance = vec4(sampleIrr, 1.0);
  } else {

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
        // Plane-distance test: robust at grazing angles (position error from
        // texel quantization lies along the surface, not along the normal).
        float distToCam = distance(P, uCameraPos);
        float tol = 0.005 * distToCam + 20.0 * uEps;
        bool valid = prevPos.w > 0.5
          && abs(dot(P - prevPos.xyz, N)) < tol;
        if (valid) {
          vec4 h = texture(uPrevAccum, prevUv); // bilinear
          // Mirror-like pixels keep a SHORT history: their reflected content
          // moves differently from the surface, so long history smears the
          // reflection under camera motion — and specular rays are nearly
          // deterministic, so they don't need the accumulation anyway.
          float specHist = max(metal, transmission) * (1.0 - rough);
          // (Blend pixels need no shortening here: this slot holds only the
          // pane's own surface light, which is static on the surface. The
          // parallaxing behind-image rides the specular attachment, whose
          // accumulation is short-history by design.)
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

  } // end if (!uRawOutput)

  // BVH traversal-cost heatmap (outputMode 7). Overwrite the accumulated
  // lighting with the palette-mapped shadow-ray node-visit count for this pixel.
  // Alpha is forced to 1.0 so temporal history never builds on the cost image
  // (each frame is a fresh snapshot), and the specular attachment is cleared so
  // the composite's cost branch shows the palette alone. Uniform branch: when
  // uCostView is off this is skipped and the writes above stand unchanged.
  if (uCostView) {
    outIrradiance = vec4(costPalette(float(gBvhVisits) * uCostScale), 1.0);
    outSpecular = vec4(0.0);
  }
}
`,oy=`
precision highp float;

layout(location = 0) out vec4 outSpec;

in vec2 vUv;

uniform sampler2D uFreshSpec;
uniform sampler2D uPrevSpec;
uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform vec3 uCameraPos;
uniform float uEps;
uniform float uMaxHistory;
uniform bool uTemporalReprojection;

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) { outSpec = vec4(0.0); return; }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  float rough = clamp(wp.w - 1.0, 0.0, 1.0);
  vec3 fresh = texture(uFreshSpec, vUv).rgb;

  float count = 1.0;
  vec3 history = vec3(0.0);
  if (uTemporalReprojection) {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clip.w > 0.0 && clipC.w > 0.0) {
      vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
      vec2 currUv = (clipC.xy / clipC.w) * 0.5 + 0.5;
      prevUv -= currUv - vUv; // cancel the G-buffer texel sub-pixel offset
      if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
        vec4 prevPos = texture(uPrevGWorldPos, prevUv);
        float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
        if (prevPos.w > 0.5 && abs(dot(P - prevPos.xyz, N)) < tol) {
          vec4 h = texture(uPrevSpec, prevUv);
          // Short history: specular is view-dependent, so a long EMA smears the
          // highlight under motion. Smoother (sharper) highlights react fastest.
          float specHist = 1.0 - rough;
          float histCap = mix(min(uMaxHistory, 32.0), min(uMaxHistory, 8.0), specHist);
          count = clamp(h.a, 0.0, histCap) + 1.0;
          history = h.rgb;
        }
      }
    }
  }

  vec3 blended = mix(history, fresh, 1.0 / count);
  if (any(isnan(blended)) || any(isinf(blended))) blended = vec3(0.0);
  outSpec = vec4(blended, count);
}
`,pu=`
precision highp float;
layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uCountClamp;
void main() {
  vec4 c = texture(uTex, vUv);
  if (uCountClamp >= 0.0) c.a = min(c.a, uCountClamp);
  o0 = c;
  o1 = vec4(0.0);
}
`;function Nr(s,e){const t=s.split(`
`),i=[];let n=!1;for(const r of t){if(r.includes(">>> "+e)){n=!0;continue}if(r.includes("<<< "+e)){n=!1;continue}n||i.push(r)}return i.join(`
`)}class ly{constructor(e,t,{specMRT:i=!0}={}){this.specMRT=i,this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.specA=i?this._makeSpecTarget(e,t):null,this.specB=i?this._makeSpecTarget(e,t):null;const n=i?fu:fu.replace("layout(location = 1) out vec4 outSpecular;","vec4 outSpecular; // single-target fallback: dead store");this._fragKm=n,this._fragAbsorbShadows=Nr(n,"RT_KM"),this._fragAbsorption=Nr(this._fragAbsorbShadows,"RT_ABSORB_SHADOWS"),this._fragPlain=Nr(this._fragAbsorption,"RT_ABSORPTION"),this._absorbOn=!1,this._absorbShadows=!0,this._kmData=!1,this._kmOn=!1,this._tilesData=!1,this._tilesOn=!1,this.material=new dt({name:"rt:lighting",glslVersion:Ct,defines:{},vertexShader:oo,fragmentShader:this._fragPlain,uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uAttrStatic:{value:null},uAttrDynamic:{value:null},uMaterialsTex:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevAccum:{value:null},uPrevGWorldPos:{value:null},uReservoir:{value:null},uRestirEnabled:{value:!1},uPrevViewProj:{value:new fe},uViewProj:{value:new fe},uCameraPos:{value:new P},uMaxHistory:{value:128},uTemporalReprojection:{value:!0},uRawOutput:{value:!1},uFireflyClamp:{value:4},uGlassClampScale:{value:4},uLightPosType:{value:[]},uLightColorRadius:{value:[]},uLightDirCone:{value:[]},uLightCount:{value:0},uEmissiveCount:{value:0},uEmissiveCDF:{value:!0},uReflEnabled:{value:!0},uRefrEnabled:{value:!0},uBlendEnabled:{value:!0},uIor:{value:1.5},uDispersion:{value:0},uLightStochastic:{value:!1},uGIHalfRate:{value:!1},uEnvColor:{value:new de(.03,.04,.06)},uEnvIntensity:{value:1},uFrame:{value:0},uEps:{value:.001},uGIEnabled:{value:!0},uExternalGI:{value:!1},uHasTextureTiles:{value:!1},uCostView:{value:!1},uCostScale:{value:1/96},uSkyEnabled:{value:!1},uSunDir:{value:new P(.4,.8,.45).normalize()},uSunColor:{value:new de(1,.9,.75)},uSkyZenith:{value:new de(.18,.34,.62)},uSkyHorizon:{value:new de(.7,.8,.9)},uSkyIntensity:{value:1},uVolumeTex:{value:null},uVolumeOrigin:{value:new P},uVolumeSize:{value:new P(1,1,1)},uVolumeMatIndex:{value:-1}},depthTest:!1,depthWrite:!1}),this.specMaterial=new dt({name:"rt:specular",glslVersion:Ct,vertexShader:oo,fragmentShader:oy,uniforms:{uFreshSpec:{value:null},uPrevSpec:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevGWorldPos:{value:null},uPrevViewProj:{value:new fe},uViewProj:{value:new fe},uCameraPos:{value:new P},uEps:{value:.001},uMaxHistory:{value:128},uTemporalReprojection:{value:!0}},depthTest:!1,depthWrite:!1}),this.carryMaterial=new dt({name:"rt:history-carry",glslVersion:Ct,vertexShader:oo,fragmentShader:i?pu:pu.replace("layout(location = 1) out vec4 o1;","vec4 o1; // single-target fallback: dead store"),uniforms:{uTex:{value:null},uCountClamp:{value:-1}},depthTest:!1,depthWrite:!1}),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i={minFilter:Xe,magFilter:Xe,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1};if(!this.specMRT){const r=new It(e,t,i);return r.texture.generateMipmaps=!1,r}const n=ts(e,t,2,i);for(const r of n.texture)r.generateMipmaps=!1;return n}_irrTex(e){return this.specMRT?e.texture[0]:e.texture}_makeSpecTarget(e,t){const i=new It(e,t,{minFilter:Xe,magFilter:Xe,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}clearHistory(e){const t=e.getRenderTarget(),i=new de;e.getClearColor(i);const n=e.getClearAlpha();e.setClearColor(0,0);for(const r of[this.targetA,this.targetB,this.specA,this.specB])r&&(e.setRenderTarget(r),e.clear(!0,!1,!1));e.setRenderTarget(t),e.setClearColor(i,n)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.specA&&this.specA.setSize(e,t),this.specB&&this.specB.setSize(e,t)}resizeCarry(e,t,i,n,r){const a=this._makeTarget(i,n),o=this._makeTarget(i,n);this.carryMaterial.uniforms.uTex.value=this._irrTex(this.targetB),this.carryMaterial.uniforms.uCountClamp.value=r,this.quad.material=this.carryMaterial;const l=e.getRenderTarget();if(e.setRenderTarget(o),e.render(this.scene,this.camera),e.setRenderTarget(l),this.quad.material=this.material,this.targetA.dispose(),this.targetB.dispose(),this.targetA=a,this.targetB=o,this.specMRT){const c=this._makeSpecTarget(i,n),u=this._makeSpecTarget(i,n);t.blit(e,this.specB.texture,u,r),this.specA.dispose(),this.specB.dispose(),this.specA=c,this.specB=u}}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uAttrStatic.value=e.staticAttrTex,t.uAttrDynamic.value=e.dynamicAttrTex,t.uMaterialsTex.value=e.materialsTex,t.uLightPosType.value=e.lightPosType,t.uLightColorRadius.value=e.lightColorRadius,t.uLightDirCone.value=e.lightDirCone,t.uLightCount.value=e.lightCount,t.uEmissiveCount.value=e.emissiveTriCount,this._kmData=!!e.scattering,this._tilesData=!!e.hasTextureTiles,this._tileSize=e._tileSize||128,this.setAbsorption(!!e.absorption)}setTextureTiles(e){this._tilesOn=!!e,this._applyAbsorptionSplice()}setAbsorption(e){this._absorbOn=!!e,this._applyAbsorptionSplice()}setAbsorptionShadows(e){this._absorbShadows=!!e,this._applyAbsorptionSplice()}setKmScattering(e){this._kmOn=!!e,this._applyAbsorptionSplice()}_applyAbsorptionSplice(){let e=this._absorbOn?this._kmOn&&this._kmData?this._fragKm:this._absorbShadows?this._fragAbsorbShadows:this._fragAbsorption:this._fragPlain;this._tilesOn&&this._tilesData?this._tileSize!==128&&(e=e.replace("#define TILE 128.0",`#define TILE ${this._tileSize}.0`)):e=Nr(e,"RT_TEXTURE_TILES"),this.material.uniforms.uHasTextureTiles.value=!!(this._tilesOn&&this._tilesData),this.material.fragmentShader!==e&&(this.material.fragmentShader=e,this.material.needsUpdate=!0)}setVolumeAlbedo(e){const t=this.material.defines.RT_VOLUME_ALBEDO!==void 0,i=!!e,n=this.material.uniforms;i?(n.uVolumeTex.value=e.texture,n.uVolumeOrigin.value.copy(e.origin),n.uVolumeSize.value.copy(e.size),n.uVolumeMatIndex.value=e.matIndex):(n.uVolumeTex.value=null,n.uVolumeMatIndex.value=-1),i!==t&&(i?this.material.defines.RT_VOLUME_ALBEDO="1":delete this.material.defines.RT_VOLUME_ALBEDO,this.material.needsUpdate=!0)}renderRaw(e,t,i,n=null){const r=this.material.uniforms;return r.uRawOutput.value=!0,r.uGWorldPos.value=t.worldPos,r.uGNormalMetal.value=t.normalMetal,r.uPrevGWorldPos.value=t.prevWorldPos,r.uPrevAccum.value=this._irrTex(this.targetB),r.uReservoir.value=n,r.uRestirEnabled.value=n!==null,r.uFrame.value=i,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null),r.uRawOutput.value=!1,this.specMRT?{rawIrradiance:this.targetA.texture[0],rawSpecular:this.targetA.texture[1]}:{rawIrradiance:this.targetA.texture,rawSpecular:null}}render(e,t,i,n=null){const r=this.material.uniforms;r.uGWorldPos.value=t.worldPos,r.uGNormalMetal.value=t.normalMetal,r.uPrevGWorldPos.value=t.prevWorldPos,r.uPrevAccum.value=this._irrTex(this.targetB),r.uReservoir.value=n,r.uRestirEnabled.value=n!==null,r.uFrame.value=i,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera);let a=null;if(this.specMRT){const l=this.specMaterial.uniforms;l.uFreshSpec.value=this.targetA.texture[1],l.uPrevSpec.value=this.specB.texture,l.uGWorldPos.value=t.worldPos,l.uGNormalMetal.value=t.normalMetal,l.uPrevGWorldPos.value=t.prevWorldPos,l.uPrevViewProj.value.copy(r.uPrevViewProj.value),l.uViewProj.value.copy(r.uViewProj.value),l.uCameraPos.value.copy(r.uCameraPos.value),l.uEps.value=r.uEps.value,l.uMaxHistory.value=r.uMaxHistory.value,l.uTemporalReprojection.value=r.uTemporalReprojection.value,this.quad.material=this.specMaterial,e.setRenderTarget(this.specA),e.render(this.scene,this.camera),a=this.specA.texture}this.quad.material=this.material,e.setRenderTarget(null);const o=this._irrTex(this.targetA);return[this.targetA,this.targetB]=[this.targetB,this.targetA],this.specMRT&&([this.specA,this.specB]=[this.specB,this.specA]),{irradiance:o,specular:a}}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.specA&&this.specA.dispose(),this.specB&&this.specB.dispose(),this.material.dispose(),this.specMaterial.dispose(),this.carryMaterial.dispose(),this.quad.geometry.dispose()}}const cy=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,uy=`
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
uniform bool uBlendIsSpec;       // this instance filters the specular buffer

// Optional additive input (EXPERIMENTAL ReSTIR GI): when uHasAdd is set, this
// texture's rgb is ADDED to every irradiance tap so the à-trous filter smooths
// the sum (the GI is injected here, downstream of the lighting pass's own
// temporal history, so it never double-counts through that history). The add is
// gated to the FIRST iteration by the caller (uStep == 1) — later iterations
// read the already-summed result. When uHasAdd is false this is byte-identical
// to the original filter (the alpha/history-count channel is never touched).
uniform sampler2D uAddTex;
uniform bool uHasAdd;
uniform sampler2D uVarTex;       // AccumulatePass moments (r = mean, g = mean^2)
uniform bool uHasVar;            // variance-guided sigmaL A/B switch

// À-TROUS LATTICE JITTER (EXPERIMENTAL, 0.0 = off = byte-identical).
// Pass i taps its 3x3 neighbourhood at a spacing of uStep lighting texels.
// Because the edge-avoiding weights below vary from pixel to pixel, adjacent
// output pixels blend disjoint tap sets and the filter stops being stationary:
// a bright axis-aligned lattice of exactly that period appears on flat, dark
// surfaces (measured — see quality-campaign/). Adding a per-frame offset to the
// tap RADIUS moves the lattice's period every frame so TAA averages it away.
// Radius, not translation: shifting the whole tap ring would drag the filtered
// image sideways; scaling it keeps the kernel centred on the pixel.
uniform float uStepJit;

// COARSE-PASS DAMPING (EXPERIMENTAL, 1.0 = off = byte-identical).
// Wavelet shrinkage, applied to the à-trous cascade: the fine passes carry
// almost all of the noise reduction, while the wide ones contribute the lattice
// above. Blending each wide pass's result back toward its own input attenuates
// the artifact in proportion without removing the pass. 1.0 = take the filtered
// value whole (what the shipped filter does).
uniform float uPassWeight;

// Named rtLum, NOT luminance: three r166+ prepends its own luminance(vec3)
// to every non-raw ShaderMaterial fragment shader, and GLSL treats a second
// (vec3) body as a redefinition — the whole program fails to compile.
float rtLum(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

// Irradiance tap with the optional GI add folded into rgb (alpha untouched).
// METAL DIFFUSE WEIGHT: the GI add is DIFFUSE indirect irradiance. Metals have
// essentially no diffuse response — their indirect light rides the traced
// REFLECTION path — so their diffuse weight is (1 - metalness). RTLightingPass
// applies this implicitly to the inline GI: sampleIrr = mix(direct + indirect,
// reflRad, metal), scaling inline indirect by (1 - metal) on metals. The
// external ReSTIR GI add is injected HERE, downstream of that mix, so it never
// picked up the weight — a metalness-0.85 surface (the gold torus knot) received
// full-strength diffuse GI, ~6.6x too much. That excess is not just too bright:
// it is the ReSTIR resolve's residual per-pixel variance at full amplitude,
// which reads as bright gold speckles on the curved metal (worst on iOS/Metal,
// where the firefly stack has the least headroom). Re-apply the same
// (1 - metalness) diffuse weight to the add so the two GI paths are energy-
// consistent on metals and the speckle amplitude drops with the mean. Packed
// metal word (GBufferPass): metalness lives in [0,1]; glass [2,4) and alpha
// blend [4,5] are non-metal (weight 1, unchanged from before).
vec4 sampleIrr(vec2 uv) {
  vec4 c = texture(uIrradiance, uv);
  if (uHasAdd) {
    float mw = texture(uGNormalMetal, uv).w;
    float metalT = mw < 2.0 ? clamp(mw, 0.0, 1.0) : 0.0;
    // Glass must be discounted the same way metal is. The INLINE GI bounce is
    // already scaled by (1 - transmission) where it is composed (the lighting
    // pass mixes the diffuse terms out of a transmissive pixel), so adding the
    // external ReSTIR GI at full strength here double-counts indirect light on
    // exactly the pixels that have no diffuse lobe to receive it, and it lands
    // on the material least able to hide it: a solid dielectric, transmission
    // 1.0, which should take none of it at all.
    float transT = (mw >= 2.0 && mw < 4.0) ? clamp(mw - 2.0, 0.0, 1.0) : 0.0;
    c.rgb += texture(uAddTex, uv).rgb * (1.0 - metalT) * (1.0 - transT);
  }
  return c;
}

void main() {
  vec4 center = sampleIrr(vUv);
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outColor = center;
    return;
  }
  vec3 P = wp.xyz;
  vec4 nm = texture(uGNormalMetal, vUv);
  // Non-finite center irradiance: half-float can reach inf, and a NaN/Inf
  // center value poisons every exp()-based weight below. Zero it AND drop its
  // kernel weight, so the output is rebuilt from valid neighbours instead of
  // rendering a black dot at full center weight.
  float centerW = 4.0;
  if (any(isnan(center.rgb)) || any(isinf(center.rgb))) {
    center.rgb = vec3(0.0);
    centerW = 0.0;
  }
  // Degenerate center normal (e.g. geometry with no normal attribute):
  // normalize(vec3(0)) is NaN, and every dot/pow below produces NaN that
  // spreads through the à-trous weights into a black silhouette.
  // The G-buffer's FrontSide culling already guarantees background pixels
  // hit the wp.w < 0.5 early-return above, so a zero normal here means a
  // genuine defect — skip filtering and pass the center sample through.
  float nmLen = length(nm.xyz);
  if (nmLen < 1e-4) {
    outColor = center;
    return;
  }
  vec3 N = nm.xyz / nmLen;
  // Specular surfaces (mirror metals, glass) carry traced reflections whose
  // detail is NOT in the G-buffer guides — filtering would smear them, and
  // their signal is nearly deterministic anyway. Scale the filter down as the
  // surface gets more mirror-like.
  // Packed word ranges (see GBufferPass): [4,5] alpha blend, [2,4) glass,
  // [0,1] metal. In the IRRADIANCE buffer a blend surface carries diffuse-lit
  // direct + GI that DOES need filtering (specAmount 0); in the SPECULAR buffer
  // (uBlendIsSpec) it carries the traced behind-the-pane image, which must be
  // spared like a mirror — the pane is flat, so the G-buffer guides would let
  // the filter smear the see-through content into mush.
  float matW = nm.w;
  float specAmount = matW >= 4.0 ? (uBlendIsSpec ? 1.0 : 0.0)
    : (matW >= 2.0 ? clamp(matW - 2.0, 0.0, 1.0) : matW);
  float specKeep = specAmount * (1.0 - clamp(wp.w - 1.0, 0.0, 1.0));

  // Fewer accumulated samples -> noisier pixel -> wider luminance tolerance.
  // A converged pixel (high count) is barely touched, preserving detail.
  // The widening is CAPPED at 3x: during camera motion every pixel is fresh,
  // and an 8x-wide gate across five à-trous passes erased small contact
  // shadows entirely — objects visibly floated while orbiting ("ghostly
  // apparitions") and only grounded once the camera stopped. Blue-noise
  // sampling + ReSTIR keep fresh pixels clean enough for the tighter gate.
  float count = max(center.a, 1.0);
  // Step 6: temporal variance sigmaL from moments (min: only narrow, never widen).
  float sigmaL;
  if (uHasVar && count >= 4.0) {
    vec2 m = texture(uVarTex, vUv).rg;
    float var = max(m.g - m.r * m.r, 0.0);
    float cntSigma = uLumSigma * clamp(8.0 / sqrt(count), 0.75, 3.0);
    float varSigma = uLumSigma * clamp(sqrt(var), 0.75, 3.0);
    sigmaL = min(varSigma, cntSigma); // only narrow — preserve detail on stable pixels
  } else {
    sigmaL = uLumSigma * clamp(8.0 / sqrt(count), 0.75, 3.0);
  }

  float distToCam = distance(P, uCameraPos);
  float planeTol = 0.01 * distToCam + 20.0 * uEps;

  // Despeckle (first iteration, short history only): a freshly disoccluded
  // pixel can carry one huge sample that the center-weighted filter would
  // preserve as a bright "rain drop" at silhouettes. Such a pixel has no
  // business being brighter than its entire neighbourhood — clamp its
  // luminance to the brightest neighbour. Converged pixels are exempt, so
  // real small highlights survive.
  // With an additive GI input (uHasAdd) the despeckle must ALWAYS run on the
  // first iteration: count is the LIGHTING buffer's history depth and says
  // nothing about the GI term, which is re-resolved fresh every frame — a GI
  // firefly at a "converged" pixel would otherwise skip this clamp entirely
  // and survive to the screen (observed as white speckles on iOS).
  if (uStep < 1.5 && (count < 8.0 || uHasAdd)) {
    float maxL = 0.0;
    float found = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        vec2 tuv = vUv + vec2(float(dx), float(dy)) * uTexelSize;
        if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) continue;
        if (texture(uGWorldPos, tuv).w < 0.5) continue;
        maxL = max(maxL, rtLum(sampleIrr(tuv).rgb));
        found = 1.0;
      }
    }
    float cap = maxL * 1.25 + 1e-4;
    float l = rtLum(center.rgb);
    if (found > 0.5 && l > cap) center.rgb *= cap / l;
  }

  float lumC = rtLum(center.rgb);

  // 3x3 B-spline-ish kernel, edge-avoiding weights.
  vec3 sum = center.rgb * centerW;
  float wsum = centerW;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      vec2 tuv = vUv + vec2(float(dx), float(dy)) * (uStep + uStepJit) * uTexelSize;
      if (tuv.x < 0.0 || tuv.x > 1.0 || tuv.y < 0.0 || tuv.y > 1.0) continue;

      vec4 g = texture(uGWorldPos, tuv);
      if (g.w < 0.5) continue;
      vec4 s = sampleIrr(tuv);
      vec3 nmt = texture(uGNormalMetal, tuv).xyz;
      // Skip taps whose normal is degenerate or whose irradiance is non-finite:
      // either would inject NaN/Inf into the à-trous weights and spread as a
      // black blob (observed on the WaterBottle label band edge at denoise 2).
      float nmtLen = length(nmt);
      if (nmtLen < 1e-4) continue;
      if (any(isnan(s.rgb)) || any(isinf(s.rgb))) continue;
      vec3 Nt = nmt / nmtLen;

      float k = (dx == 0 || dy == 0) ? 2.0 : 1.0;
      float wN = pow(max(dot(N, Nt), 0.0), 32.0);
      float wZ = exp(-abs(dot(g.xyz - P, N)) / planeTol);
      // Tighten the luminance gate as the à-trous step widens: a shadow on a
      // flat floor has no geometric edge to protect it, so at high iteration
      // counts the wide passes would average it away ("floating" objects with
      // no contact shadow). Wide steps only get to blend near-equal luminance.
      float wL = exp(-abs(rtLum(s.rgb) - lumC) / (sigmaL * inversesqrt(uStep)));
      float w = k * wN * wZ * wL * (1.0 - specKeep);
      sum += s.rgb * w;
      wsum += w;
    }
  }
  // Uniform branch, not a mix(): at uPassWeight 1.0 a mix would still evaluate
  // 0.0 * center.rgb, which is NaN rather than 0 if a half-float irradiance
  // texel ever reaches inf. The branch keeps the off-state provably untouched.
  // wsum can only be 0 when the center was non-finite AND every tap was
  // skipped; emit 0 rather than 0/0 (which is NaN and would re-poison history).
  vec3 filtered = wsum > 0.0 ? sum / wsum : vec3(0.0);
  outColor = vec4(uPassWeight >= 1.0 ? filtered : mix(center.rgb, filtered, uPassWeight), center.a);
}
`;class mu{constructor(e,t,{blendIsSpec:i=!1}={}){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.material=new dt({name:"rt:denoise",glslVersion:Ct,vertexShader:cy,fragmentShader:uy,uniforms:{uIrradiance:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uTexelSize:{value:new ce},uStep:{value:1},uStepJit:{value:0},uPassWeight:{value:1},uCameraPos:{value:new P},uEps:{value:.001},uLumSigma:{value:.25},uBlendIsSpec:{value:i},uAddTex:{value:null},uHasAdd:{value:!1},uVarTex:{value:null},uHasVar:{value:!1}},depthTest:!1,depthWrite:!1}),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad),this._width=e,this._height=t}_makeTarget(e,t){const i=new It(e,t,{minFilter:Xe,magFilter:Xe,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setSize(e,t){this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,i,n,r,a=3,o=null,l={}){const c=this.material.uniforms;c.uGWorldPos.value=i.worldPos,c.uGNormalMetal.value=i.normalMetal,c.uTexelSize.value.set(1/this._width,1/this._height),c.uCameraPos.value.copy(n),c.uEps.value=r,c.uAddTex.value=o;const u=l.momentsTexture||null;u?(c.uVarTex.value=u,c.uHasVar.value=!0):c.uHasVar.value=!1;const d=l.maxStep>0?l.maxStep:0,h=l.stepJitter>0?Math.min(1,l.stepJitter):0,f=l.wideDamp>0?Math.min(1,l.wideDamp):0,g=l.frame??0;let x=t,m=this.targetA;for(let p=0;p<a;p++){c.uIrradiance.value=x;const y=d>0?Math.min(1<<p,d):1<<p;if(c.uStep.value=y,h>0&&y>1){const v=g*7+p;c.uStepJit.value=(v*.7548776662466927%1-.5)*y*h}else c.uStepJit.value=0;c.uPassWeight.value=f>0&&y>4?1-f*(1-Math.sqrt(4/y)):1,c.uHasAdd.value=o!==null&&p===0,e.setRenderTarget(m),e.render(this.scene,this.camera),x=m.texture,m=m===this.targetA?this.targetB:this.targetA}return e.setRenderTarget(null),x}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const hy=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,dy=`
precision highp float;

layout(location = 0) out vec4 outIrradiance;
layout(location = 1) out vec4 outSpecular;
layout(location = 2) out vec4 outMoments;    // RGBA: lumMean, lum2Mean, octN.x, octN.y

in vec2 vUv;

uniform sampler2D uRawIrradiance;
uniform sampler2D uRawSpecular;
uniform sampler2D uPrevIrradiance;
uniform sampler2D uPrevSpecular;
uniform sampler2D uPrevMoments;     // previous frame's moments+prevNormal
uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;
uniform mat4 uViewProj;
uniform float uMaxHistory;
uniform float uPreFireflyClamp;
uniform float uHistoryClampK;
uniform float uLightMotion;   // 0 = lights parked, 1 = lights changed hard
uniform float uGradK;         // temporal-gradient rejection threshold, in sigmas
uniform vec3 uCameraPos;
uniform float uEps;
uniform ivec2 uTexSize;
uniform ivec2 uGbSize;

float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Octahedral normal encoding (Meyer et al. 2010). Maps a unit vector to a
// 2D point in [0,1]x[0,1], storable in two fp16 channels. The decode below
// recovers the original direction to within ~0.1 degrees.
vec2 octEncode(vec3 n) {
  n /= abs(n.x) + abs(n.y) + abs(n.z);
  vec2 e = n.z >= 0.0 ? n.xy : (vec2(1.0) - abs(n.yx)) * sign(n.xy + vec2(1e-8));
  return e * 0.5 + 0.5;
}
vec3 octDecode(vec2 e) {
  e = e * 2.0 - 1.0;
  vec3 n = vec3(e, 1.0 - abs(e.x) - abs(e.y));
  float t = max(-n.z, 0.0);
  n.x += n.x >= 0.0 ? -t : t;
  n.y += n.y >= 0.0 ? -t : t;
  return normalize(n);
}

void main() {
  ivec2 px = ivec2(vUv * vec2(uTexSize));
  ivec2 gbPx = ivec2(vUv * vec2(uGbSize));

  vec4 wp = texelFetch(uGWorldPos, gbPx, 0);
  if (wp.w < 0.5) {
    outIrradiance = vec4(0.0);
    outSpecular = vec4(0.0);
    outMoments = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  float rough = clamp(wp.w - 1.0, 0.0, 1.0);

  vec4 nmSample = texelFetch(uGNormalMetal, gbPx, 0);
  vec3 N = normalize(nmSample.xyz);
  float matW = nmSample.w;
  float metal = matW < 2.0 ? matW : 0.0;
  float transmission = (matW >= 2.0 && matW < 4.0) ? clamp(matW - 2.0, 0.0, 1.0) : 0.0;

  vec4 rawIrr = texelFetch(uRawIrradiance, px, 0);
  vec4 rawSpec = texelFetch(uRawSpecular, px, 0);

  // --- 3x3 NEIGHBOURHOOD ANTI-FIREFLY CLAMP (UNGATED) ---
  // Pure luminance rank clamp: clamp centre luminance to max neighbour
  // luminance times factor. No plane-distance gating — clamping luminance
  // DOWN cannot leak light across geometry the way averaging can (NRD).
  // Dropped the plane-distance tests that left validN=0 at lighting res.
  vec3 clampedIrr = rawIrr.rgb;
  if (uPreFireflyClamp > 0.0) {
    float maxN = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        ivec2 npx = px + ivec2(dx, dy);
        if (any(lessThan(npx, ivec2(0))) || any(greaterThanEqual(npx, uTexSize))) continue;
        maxN = max(maxN, rtLum(texelFetch(uRawIrradiance, npx, 0).rgb));
      }
    }
    float rawLum = rtLum(clampedIrr);
    float cap = maxN * uPreFireflyClamp + 1e-4;
    if (rawLum > cap) clampedIrr *= cap / max(rawLum, 1e-6);
  }

  // --- PER-TAP-VALIDITY BILINEAR REPROJECTION (SVGF standard) ---
  float count = 1.0;
  float countSpec = 1.0;
  vec3 histIrr = vec3(0.0);
  vec3 histSpec = vec3(0.0);
  vec4 histMom = vec4(0.0);

  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  vec4 clipC = uViewProj * vec4(P, 1.0);
  if (clip.w > 0.0 && clipC.w > 0.0) {
    vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
    vec2 currUv = (clipC.xy / clipC.w) * 0.5 + 0.5;
    prevUv -= currUv - vUv;
    if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
      // Bilinear: sample the FOUR nearest history texels around prevUv.
      vec2 texPos = prevUv * vec2(uTexSize) - 0.5;
      ivec2 basePx = ivec2(floor(texPos));
      vec2 frac = texPos - vec2(basePx);

      float totalW = 0.0;
      vec4 sumIrr = vec4(0.0);
      vec4 sumSpec = vec4(0.0);
      vec4 sumMom = vec4(0.0);

      for (int dy = 0; dy <= 1; dy++) {
        for (int dx = 0; dx <= 1; dx++) {
          ivec2 tapPx = basePx + ivec2(dx, dy);
          if (any(lessThan(tapPx, ivec2(0))) || any(greaterThanEqual(tapPx, uTexSize))) continue;

          vec4 tapIrr = texelFetch(uPrevIrradiance, tapPx, 0);
          // count > 0: must have valid history data
          if (tapIrr.a < 1.0) continue;

          vec4 tapSpec = texelFetch(uPrevSpecular, tapPx, 0);
          vec4 tapMom = texelFetch(uPrevMoments, tapPx, 0);

          // Per-tap validity: two-sided plane distance AND normal agreement.
          vec2 tapUv = (vec2(tapPx) + 0.5) / vec2(uTexSize);
          ivec2 tapGbPx = ivec2(tapUv * vec2(uGbSize));
          vec4 tapPos = texelFetch(uPrevGWorldPos, tapGbPx, 0);
          if (tapPos.w < 0.5) continue;

          float distToCam = distance(P, uCameraPos);
          float tol = 0.005 * distToCam + 20.0 * uEps;
          if (abs(dot(P - tapPos.xyz, N)) > tol) continue;

          // NORMAL AGREEMENT: reject history whose stored normal disagrees
          // with the current surface (signed dot, no abs — a 180-degree flip
          // like the outside of a thin cornell wall must fail). Measured on
          // arena: ghost@40 1.273 -> 1.034 (-19%) for +0.004 stillNoise; the
          // plane test alone accepts these leaks (near-zero plane distance).
          // Gated on count >= 2 so the moments texel holds a real normal.
          if (tapIrr.a >= 2.0) {
            vec3 tapN = octDecode(tapMom.ba);
            if (dot(tapN, N) < 0.5) continue;
          }

          // Bilinear weight
          float bw = (dx == 0 ? (1.0 - frac.x) : frac.x)
                   * (dy == 0 ? (1.0 - frac.y) : frac.y);

          sumIrr += tapIrr * bw;
          sumSpec += tapSpec * bw;
          sumMom += tapMom * bw;
          totalW += bw;
        }
      }

      if (totalW > 0.0) {
        vec4 hi = sumIrr / totalW;
        vec4 hs = sumSpec / totalW;
        vec4 hm = sumMom / totalW;
        // SHARED count with a short cap on mirror-like pixels, exactly like
        // the old inline path: metal reflections RIDE the irradiance buffer
        // (the megakernel mixes reflRad into sampleIrr by metalness), so a
        // long history on smooth metal smears the reflection under motion.
        float specHist = max(metal, transmission) * (1.0 - rough);
        float histCap = mix(uMaxHistory, min(uMaxHistory, 10.0), specHist);
        count = clamp(hi.a, 0.0, histCap) + 1.0;
        countSpec = count;
        histIrr = hi.rgb;
        histSpec = hs.rgb;
        histMom = hm;
      }
    }
  }

  // --- TEMPORAL GRADIENT: per-pixel history rejection on a lighting change ---
  // Every other validation in this pass asks a GEOMETRIC question, so a static
  // wall under a light that just moved passes them all and keeps averaging
  // light that is no longer there. This is the one test that asks a
  // RADIOMETRIC question: does the fresh sample still look like what this pixel
  // has been seeing?
  //
  // It only runs while the host reports light motion (uLightMotion > 0), which
  // keeps it off entirely for the parked-camera, parked-lights case that the
  // engine's noise fences measure. The threshold is noise-aware: the accumulated
  // second moment gives this pixel's own luminance sigma, so a pixel whose GI
  // estimate is naturally jumpy needs a bigger jump to be called changed, and a
  // quiet pixel needs less. Without that, a 1-sample-per-pixel raw frame would
  // trip a fixed threshold everywhere and this would just be a slow reset.
  //
  // Rejection is proportional to how far the lights actually moved: a swept
  // spotlight nudges count down each frame (staying responsive without dumping
  // the accumulation), while a hard cut drops the affected pixels to a fresh
  // sample and lets count regrow from 1, which converges at the optimal 1/n
  // rate instead of the EMA's fixed-cap rate.
  if (uLightMotion > 0.0 && count > 2.0) {
    float m1 = histMom.r;
    float sigma = sqrt(max(histMom.g - m1 * m1, 0.0));
    float d = abs(rtLum(clampedIrr) - m1);
    // The relative floor keeps near-black pixels (sigma ~ 0, m1 ~ 0) from
    // tripping on quantization alone.
    float thresh = uGradK * sigma + 0.05 * max(m1, 0.02);
    if (d > thresh) count = mix(count, 1.0, uLightMotion);
  }

  // --- HISTORY-RELATIVE SOFT CLAMP (k*sigma from temporal moments) ---
  vec3 finalIrr = clampedIrr;
  if (uHistoryClampK > 0.0 && count > 1.0) {
    float histLum = rtLum(histIrr);
    float rawLum = rtLum(finalIrr);
    float var = max(histMom.g - histMom.r * histMom.r, 0.0);
    float sigma = sqrt(max(var, 1e-6));
    float cap = max(histLum, 0.001) + uHistoryClampK * sigma;
    if (rawLum > cap) finalIrr *= cap / max(rawLum, 1e-6);
  }

  // --- EMA MERGE ---
  vec3 blendedIrr = mix(histIrr, finalIrr, 1.0 / count);
  vec3 blendedSpec = mix(histSpec, rawSpec.rgb, 1.0 / countSpec);

  if (any(isnan(blendedIrr)) || any(isinf(blendedIrr))) blendedIrr = vec3(0.0);
  if (any(isnan(blendedSpec)) || any(isinf(blendedSpec))) blendedSpec = vec3(0.0);

  outIrradiance = vec4(blendedIrr, count);
  outSpecular = vec4(blendedSpec, countSpec);

  // --- TEMPORAL MOMENT ACCUMULATION + PREV-NORMAL STORE ---
  float rawLum = rtLum(clampedIrr);
  float newLumMean  = mix(histMom.r, rawLum, 1.0 / count);
  float newLum2Mean = mix(histMom.g, rawLum * rawLum, 1.0 / count);
  vec2 octN = octEncode(N);
  outMoments = vec4(newLumMean, newLum2Mean, octN);
}
`;class fy{constructor(e,t){this._width=e,this._height=t,this.targetA=ts(e,t,3,{minFilter:Ve,magFilter:Ve,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1}),this.targetB=ts(e,t,3,{minFilter:Ve,magFilter:Ve,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1}),this.material=new dt({name:"rt:accumulate",glslVersion:Ct,vertexShader:hy,fragmentShader:dy,uniforms:{uRawIrradiance:{value:null},uRawSpecular:{value:null},uPrevIrradiance:{value:null},uPrevSpecular:{value:null},uPrevMoments:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevGWorldPos:{value:null},uPrevViewProj:{value:new fe},uViewProj:{value:new fe},uMaxHistory:{value:48},uPreFireflyClamp:{value:0},uLightMotion:{value:0},uGradK:{value:3},uHistoryClampK:{value:0},uCameraPos:{value:new P},uEps:{value:.001},uTexSize:{value:new ce(e,t)},uGbSize:{value:new ce}},depthTest:!1,depthWrite:!1}),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}setSize(e,t){this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.material.uniforms.uTexSize.value.set(e,t),this._needsClear=!0}render(e,t,i,n,r,a,o,l,c,u={}){this._needsClear&&(this._needsClear=!1,this.clearHistory(e));const d=this.material.uniforms;d.uRawIrradiance.value=t,d.uRawSpecular.value=i,d.uPrevIrradiance.value=this.targetB.texture[0],d.uPrevSpecular.value=this.targetB.texture[1],d.uPrevMoments.value=this.targetB.texture[2],d.uGWorldPos.value=n.worldPos,d.uGNormalMetal.value=n.normalMetal,d.uPrevGWorldPos.value=n.prevWorldPos,d.uPrevViewProj.value.copy(r),d.uViewProj.value.copy(a),d.uMaxHistory.value=c,d.uPreFireflyClamp.value=u.preFireflyClamp??0,d.uLightMotion.value=u.lightMotion??0,d.uGradK.value=u.gradK??3,d.uHistoryClampK.value=u.historyClampK??0,d.uCameraPos.value.copy(o),d.uEps.value=l;const h=n.worldPos.image||{};d.uGbSize.value.set(h.width||this._width*2,h.height||this._height*2),e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const f=this.targetA.texture[0],g=this.targetA.texture[1],x=this.targetA.texture[2];return[this.targetA,this.targetB]=[this.targetB,this.targetA],{irradiance:f,specular:g,moments:x}}clearHistory(e){const t=e.getClearColor(new de),i=e.getClearAlpha();e.setClearColor(0,0);for(const n of[this.targetA,this.targetB])e.setRenderTarget(n),e.clearColor();e.setRenderTarget(null),e.setClearColor(t,i)}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const py=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,my=`
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

${Zo}

uniform sampler2D uIrradiance;
uniform sampler2D uSpecular;   // dielectric direct specular (added WITHOUT albedo)
uniform bool uSpecEnabled;
uniform sampler2D uGAlbedoRough;
uniform sampler2D uGNormalMetal;
uniform sampler2D uGWorldPos;
uniform sampler2D uGEmissive;
uniform sampler2D uVolumetric; // in-scattered light (quarter canvas res, smooth)
uniform vec2 uVolTexelSize;
uniform bool uVolEnabled;
uniform vec3 uBackgroundColor;
// 0 composite, 1 albedo, 2 normal, 3 irradiance (direct+GI), 4 worldPos,
// 5 emissive, 6 specular, 7 bvh cost (heatmap of shadow-ray node visits — the
// lighting pass wrote the palette into the irradiance buffer, so it shares the
// mode-3 display path)
uniform int uOutputMode;

// joint bilateral upsample (lighting may be rendered below full resolution)
uniform bool uUpsample;
uniform vec2 uIrrTexelSize;
uniform vec3 uCameraPos;

// Overscan crop: maps this on-screen pixel's UV into the central region of the
// padded internal image (scale.xy, offset.zw). Identity (1,1,0,0) when overscan
// is 0 or when compositing into the offscreen target that TAA later crops.
uniform vec4 uCrop;

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
vec3 upsampleGuided(sampler2D tex, vec2 uv, vec3 P, vec3 N) {
  if (!uUpsample) return texture(tex, uv).rgb;

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
      vec3 irr = texture(tex, tuv).rgb;
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
  // Sample the padded internal image at the cropped UV (identity when no crop).
  // Everything below lives in padded space, so one remap here covers all taps.
  vec2 uv = vUv * uCrop.xy + uCrop.zw;
  vec4 wp = texture(uGWorldPos, uv);
  vec4 albedoRough = texture(uGAlbedoRough, uv);
  vec4 nmFull = texture(uGNormalMetal, uv);
  vec3 N = normalize(nmFull.xyz);
  vec3 irradiance = upsampleGuided(uIrradiance, uv, wp.xyz, N);
  vec3 specular = uSpecEnabled ? upsampleGuided(uSpecular, uv, wp.xyz, N) : vec3(0.0);
  vec3 emissive = texture(uGEmissive, uv).rgb;

  vec3 color;
  if (wp.w < 0.5) {
    // Background: the procedural sky (with sun), else fog colour, else flat.
    if (uSkyEnabled) {
      color = skyColor(viewRay(uv), uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity);
    } else {
      color = uFogEnabled ? uFogColor : uBackgroundColor;
    }
  } else {
    // Diffuse is demodulated (albedo re-applied here); the dielectric specular
    // highlight is white (F0 ~= 0.04) and is added WITHOUT the albedo multiply.
    if (nmFull.w >= 4.0) {
      // Alpha blend (packed word >= 4, opacity = w - 4): the irradiance slot
      // holds the pane's own demodulated surface light and the SPECULAR slot
      // carries the traced radiance from BEHIND the pane (see RTLightingPass) —
      // the only place both quantities exist at final-pixel scale alongside the
      // pane's albedo, so the opacity blend happens here. With the specular
      // buffer disabled there is no behind-image; degrade to an opaque pane.
      float opacity = clamp(nmFull.w - 4.0, 0.0, 1.0);
      vec3 paneCol = albedoRough.rgb * irradiance + emissive;
      color = uSpecEnabled ? mix(specular, paneCol, opacity) : paneCol;
    } else if (nmFull.w >= 2.0) {
      // Glass (packed word in [2,4)): the irradiance slot already carries
      // full-colour radiance from the glass path (refraction + Fresnel
      // reflection), NOT demodulated irradiance. Multiplying by the surface
      // albedo would double-tint the transmitted light — a base-colour map
      // intended for the diffuse component (1-transmission share of the mix)
      // would wrongly tint the see-through image and make the glass read as
      // opaque. The buffer cannot separate the diffuse share from the glass
      // radiance, so approximate: fade the albedo tint out with transmission
      // (t=0 matches the diffuse branch exactly, avoiding a pop at the band
      // edge; t=1 leaves traced radiance untouched). [3,4) is full glass and
      // the clamp reads it as t=1. In-medium colour belongs to absorption
      // (SceneCompiler derives it from the base colour when unset), not to a
      // surface multiply. See SPEC_MODEL_FIXES.md.
      float glassT = clamp(nmFull.w - 2.0, 0.0, 1.0);
      color = mix(albedoRough.rgb, vec3(1.0), glassT) * irradiance + specular + emissive;
    } else {
      color = albedoRough.rgb * irradiance + specular + emissive;
    }
    // Volumetric in-scatter (already radiance, not modulated by albedo). Fog
    // is low-frequency, so a wide 9-tap blur costs nothing visually and eats
    // the single-sample grain — crucial with MOVING lights, where the
    // in-scatter field changes every frame and temporal accumulation alone
    // can never converge it (grain carpeted dark scenes otherwise).
    if (uVolEnabled) {
      vec2 o1 = uVolTexelSize * 1.5;
      vec2 o2 = uVolTexelSize * 3.5;
      vec3 vol = texture(uVolumetric, uv).rgb * 0.24
        + texture(uVolumetric, uv + vec2( o1.x,  o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2(-o1.x,  o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2( o1.x, -o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2(-o1.x, -o1.y)).rgb * 0.12
        + texture(uVolumetric, uv + vec2( o2.x,  0.0 )).rgb * 0.07
        + texture(uVolumetric, uv + vec2(-o2.x,  0.0 )).rgb * 0.07
        + texture(uVolumetric, uv + vec2( 0.0 ,  o2.y)).rgb * 0.07
        + texture(uVolumetric, uv + vec2( 0.0 , -o2.y)).rgb * 0.07;
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
  // 3 = irradiance, 7 = bvh cost heatmap: both live in the irradiance buffer
  // (the lighting pass wrote the cost palette there when uCostView was on).
  else if (uOutputMode == 3 || uOutputMode == 7) color = irradiance;
  else if (uOutputMode == 4) color = fract(wp.xyz * 0.1);
  else if (uOutputMode == 5) color = emissive;
  else if (uOutputMode == 6) color = specular;
  else color = acesFilm(color);

  outColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
}
`;class gy{constructor(){this.material=new dt({name:"rt:composite",glslVersion:Ct,vertexShader:py,fragmentShader:my,uniforms:{uIrradiance:{value:null},uSpecular:{value:null},uSpecEnabled:{value:!1},uGAlbedoRough:{value:null},uGNormalMetal:{value:null},uGWorldPos:{value:null},uGEmissive:{value:null},uVolumetric:{value:null},uVolTexelSize:{value:new ce},uVolEnabled:{value:!1},uBackgroundColor:{value:new de(.01,.012,.02)},uOutputMode:{value:0},uUpsample:{value:!1},uIrrTexelSize:{value:new ce},uCameraPos:{value:new P},uCrop:{value:new We(1,1,0,0)},uFogEnabled:{value:!1},uFogColor:{value:new de(.5,.6,.7)},uFogDensity:{value:.05},uSkyEnabled:{value:!1},uInvViewProj:{value:new fe},uSunDir:{value:new P(.4,.8,.45).normalize()},uSunColor:{value:new de(1,.9,.75)},uSkyZenith:{value:new de(.18,.34,.62)},uSkyHorizon:{value:new de(.7,.8,.9)},uSkyIntensity:{value:1}},depthTest:!1,depthWrite:!1}),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}render(e,t,i,n,r=null,a=null,o=null){const l=this.material.uniforms;l.uIrradiance.value=t,l.uSpecular.value=a,l.uSpecEnabled.value=a!==null,l.uGAlbedoRough.value=i.albedoRough,l.uGNormalMetal.value=i.normalMetal,l.uGWorldPos.value=i.worldPos,l.uGEmissive.value=i.emissive,o?l.uCrop.value.copy(o):l.uCrop.value.set(1,1,0,0),n&&n.isColor&&l.uBackgroundColor.value.copy(n),e.setRenderTarget(r),e.render(this.scene,this.camera)}dispose(){this.material.dispose(),this.quad.geometry.dispose()}}const gu=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,vy=`
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
`,xy=`
precision highp float;
layout(location = 0) out vec4 outColor;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec4 uCrop;
void main() { outColor = vec4(texture(uTex, vUv * uCrop.xy + uCrop.zw).rgb, 1.0); }
`;class yy{constructor(e,t){this._width=e,this._height=t,this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this._reset=!0,this.material=new dt({name:"rt:taa",glslVersion:Ct,vertexShader:gu,fragmentShader:vy,uniforms:{uCurrent:{value:null},uHistory:{value:null},uGWorldPos:{value:null},uPrevViewProj:{value:new fe},uTexelSize:{value:new ce(1/e,1/t)},uJitter:{value:new ce},uPrevJitter:{value:new ce},uBlend:{value:.1},uReset:{value:!0}},depthTest:!1,depthWrite:!1}),this.copyMaterial=new dt({name:"rt:taa-copy",glslVersion:Ct,vertexShader:gu,fragmentShader:xy,uniforms:{uTex:{value:null},uCrop:{value:new We(1,1,0,0)}},depthTest:!1,depthWrite:!1}),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=new It(e,t,{minFilter:Xe,magFilter:Xe,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setSize(e,t){e===this._width&&t===this._height||(this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.material.uniforms.uTexelSize.value.set(1/e,1/t),this._reset=!0)}resizeCarry(e,t,i,n){if(i===this._width&&n===this._height)return;this._width=i,this._height=n;const r=this._makeTarget(i,n),a=this._makeTarget(i,n);t.blit(e,this.targetB.texture,a,-1),this.targetA.dispose(),this.targetB.dispose(),this.targetA=r,this.targetB=a,this.material.uniforms.uTexelSize.value.set(1/i,1/n)}reset(){this._reset=!0}render(e,t,i,n,r,a,o,l=null,c=null){const u=this.material.uniforms;u.uCurrent.value=t,u.uHistory.value=this.targetB.texture,u.uGWorldPos.value=i.worldPos,u.uPrevViewProj.value.copy(n),u.uJitter.value.copy(r),u.uPrevJitter.value.copy(a),u.uBlend.value=o,u.uReset.value=this._reset,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),this.quad.material=this.copyMaterial,this.copyMaterial.uniforms.uTex.value=this.targetA.texture,c?this.copyMaterial.uniforms.uCrop.value.copy(c):this.copyMaterial.uniforms.uCrop.value.set(1,1,0,0),e.setRenderTarget(l),e.render(this.scene,this.camera),[this.targetA,this.targetB]=[this.targetB,this.targetA],this._reset=!1}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.copyMaterial.dispose(),this.quad.geometry.dispose()}}const vu=8,_y=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,by=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${jo}
${Yo}
${Jo}

#define MAX_LIGHTS ${es}
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
uniform vec4 uLightDirCone[MAX_LIGHTS]; // spot: direction.xyz + cos(outer)
uniform int uLightCount;
uniform int uEmissiveCount;

uniform vec3 uCameraPos;
uniform float uFrame;
uniform float uEps;
uniform float uDensity;   // scatter coefficient (global term)
uniform float uMaxDist;   // cap for rays that hit nothing / far surfaces

// Localized fog zones: up to 8 AABBs. Two vec4 per zone —
//   [2*i]   = (min.xyz, density),  [2*i+1] = (max.xyz, unused).
// Density at a point = uDensity + Σ density of every zone containing it.
#define MAX_FOG_ZONES 8
uniform vec4 uFogZones[MAX_FOG_ZONES * 2];
uniform int uFogZoneCount;

float fogDensityAt(vec3 p) {
  float d = uDensity;
  for (int i = 0; i < MAX_FOG_ZONES; i++) {
    if (i >= uFogZoneCount) break;
    vec4 lo = uFogZones[i * 2];
    vec3 mn = lo.xyz;
    vec3 mx = uFogZones[i * 2 + 1].xyz;
    if (all(greaterThanEqual(p, mn)) && all(lessThanEqual(p, mx))) {
      d += lo.w;
    }
  }
  return d;
}

// ---------- RNG ----------
// First four dims from the shared blue-noise tile (rows 2..65 of the
// scene-data texture) with an R2 temporal shift; the rest is PCG. Same
// scheme as RTLightingPass — see the comment there.
uint gSeed;
int gBnDim;
vec4 gBlueNoise;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  if (gBnDim < 4) {
    float v = gBlueNoise[gBnDim];
    gBnDim++;
    return v;
  }
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec2 rand2() { return vec2(rand(), rand()); }

vec4 fetchBlueNoise() {
  ivec2 p = ivec2(gl_FragCoord.xy) & 63;
  vec4 bn = texelFetch(uMaterialsTex, ivec2(p.x, 2 + p.y), 0);
  vec4 shift = fract(float(uFrame) * vec4(0.6180340, 0.7548777, 0.5698403, 0.8191725));
  return fract(bn + shift);
}

vec3 randUnitVector() {
  vec2 u = rand2();
  float z = u.x * 2.0 - 1.0;
  float a = u.y * 2.0 * PI;
  float r = sqrt(max(0.0, 1.0 - z * z));
  return vec3(r * cos(a), r * sin(a), z);
}

// Any-hit: first blocker wins, no closest-hit sorting (see bvhAnyHit.glsl.js).
bool occluded(vec3 ro, vec3 rd, float maxDist) {
  if (bvhIntersectAnyHit(bvhStatic, ro, rd, maxDist - 2.0 * uEps)) return true;
  if (uHasDynamic && bvhIntersectAnyHit(bvhDynamic, ro, rd, maxDist - 2.0 * uEps)) return true;
  return false;
}

// In-scattered radiance at a point in the volume from analytic light i.
// Like the surface version but with no cosine term (isotropic phase, folded
// into uDensity along with 1/4π).
vec3 lightAt(int i, vec3 S) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];
  if (posType.w < 0.5 || posType.w >= 1.5) {
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - S;
    float dist = length(d);
    if (dist < 1e-4) return vec3(0.0);
    float cone = 1.0;
    if (posType.w >= 1.5) {
      // spot: this is what draws visible light CONES in fog
      vec4 dc = uLightDirCone[i];
      cone = smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, -d / dist));
      if (cone <= 0.0) return vec3(0.0);
    }
    if (occluded(S, d / dist, dist)) return vec3(0.0);
    return colRad.rgb * (cone / (dist * dist));
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
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  // Segment to integrate: camera → surface (or the fog cap on a miss).
  bool hit = wp.w > 0.5;
  vec3 P = wp.xyz;
  float segLen = hit ? min(distance(P, uCameraPos), uMaxDist) : uMaxDist;
  vec3 rd = hit
    ? normalize(P - uCameraPos)
    : vec3(0.0); // background without geometry: skip (no stable ray direction here)

  // STRATIFIED MARCH: several jittered steps per ray instead of one point.
  // This pass runs at quarter canvas resolution (fog is low-frequency), so
  // the extra steps cost less than the old single-sample full-lighting-res
  // version — and MOVING lights, whose in-scatter field changes every frame
  // and can never converge temporally, get real per-frame averaging.
  // Nothing to scatter: no global fog AND no localized zones → output zeros fast.
  if (uDensity <= 0.0 && uFogZoneCount == 0) {
    outScatter = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  #define VOL_STEPS 4
  vec3 sample_ = vec3(0.0);
  if (hit && segLen > 1e-3) {
    bool hasL = uLightCount > 0;
    bool hasE = uEmissiveCount > 0;
    float segStep = segLen / float(VOL_STEPS);
    // Piecewise integration: density can vary along the ray (zones), so the
    // transmittance is built up step by step from the LOCAL density at each
    // sample rather than a single closed-form exp(-uDensity * t).
    float opticalDepth = 0.0;
    for (int k = 0; k < VOL_STEPS; k++) {
      float t = (float(k) + rand()) * segStep; // ascending strata
      vec3 S = uCameraPos + rd * t;
      float local = fogDensityAt(S);
      opticalDepth += local * segStep;
      vec3 Lin = vec3(0.0);
      // Stochastically pick analytic lights or the emissive set, weighted 1/p.
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
      vec3 c = Lin * local * segStep * exp(-opticalDepth);
      // per-step spike clamp — outliers decay only as 1/count in the EMA
      float sl = dot(c, vec3(0.299, 0.587, 0.114));
      if (sl > 2.0) c *= 2.0 / sl;
      sample_ += c;
    }
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
`;class Sy{constructor(e,t){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.material=new dt({name:"rt:volumetric",glslVersion:Ct,vertexShader:_y,fragmentShader:by,uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uMaterialsTex:{value:null},uGWorldPos:{value:null},uPrevAccum:{value:null},uPrevViewProj:{value:new fe},uMaxHistory:{value:48},uLightPosType:{value:[]},uLightColorRadius:{value:[]},uLightDirCone:{value:[]},uLightCount:{value:0},uEmissiveCount:{value:0},uCameraPos:{value:new P},uFrame:{value:0},uEps:{value:.001},uDensity:{value:.03},uMaxDist:{value:40},uFogZones:{value:new Array(vu*2).fill(0).map(()=>new We)},uFogZoneCount:{value:0}},depthTest:!1,depthWrite:!1}),this._zoneVecs=this.material.uniforms.uFogZones.value,this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=new It(e,t,{minFilter:Xe,magFilter:Xe,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uMaterialsTex.value=e.materialsTex,t.uLightPosType.value=e.lightPosType,t.uLightColorRadius.value=e.lightColorRadius,t.uLightDirCone.value=e.lightDirCone,t.uLightCount.value=e.lightCount,t.uEmissiveCount.value=e.emissiveTriCount}clearHistory(e){const t=e.getRenderTarget();e.setClearColor(0,0);for(const i of[this.targetA,this.targetB])e.setRenderTarget(i),e.clear(!0,!1,!1);e.setRenderTarget(t)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,i,n,r,a,o,l,c){const u=this.material.uniforms;u.uGWorldPos.value=t.worldPos,u.uPrevAccum.value=this.targetB.texture,u.uPrevViewProj.value.copy(i),u.uCameraPos.value.copy(n),u.uFrame.value=r,u.uEps.value=a,u.uDensity.value=o,u.uMaxDist.value=l;const d=c&&c.length?Math.min(c.length,vu):0;for(let f=0;f<d;f++){const g=c[f];this._zoneVecs[f*2].set(g.min[0],g.min[1],g.min[2],g.density),this._zoneVecs[f*2+1].set(g.max[0],g.max[1],g.max[2],0)}u.uFogZoneCount.value=d,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const h=this.targetA;return[this.targetA,this.targetB]=[this.targetB,this.targetA],h.texture}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const My=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Sh=`
#define MAX_LIGHTS ${es}
#define PI 3.14159265358979

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uMaterialsTex;  // row 1: emissive tris, rows 2..65: blue noise
uniform vec4 uLightPosType[MAX_LIGHTS];
uniform vec4 uLightColorRadius[MAX_LIGHTS];
uniform vec4 uLightDirCone[MAX_LIGHTS]; // spot: direction.xyz + cos(outer)
uniform int uLightCount;
uniform int uEmissiveCount;
uniform float uFrame;
uniform vec3 uCameraPos;
uniform float uEps;

uint gSeed;
int gBnDim;
vec4 gBlueNoise;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  if (gBnDim < 4) {
    float v = gBlueNoise[gBnDim];
    gBnDim++;
    return v;
  }
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec4 fetchBlueNoise() {
  ivec2 p = ivec2(gl_FragCoord.xy) & 63;
  vec4 bn = texelFetch(uMaterialsTex, ivec2(p.x, 2 + p.y), 0);
  vec4 shift = fract(float(uFrame) * vec4(0.6180340, 0.7548777, 0.5698403, 0.8191725));
  return fract(bn + shift);
}

// Named rtLum, NOT luminance: three r166+ prepends its own luminance(vec3)
// to every non-raw ShaderMaterial fragment shader, and GLSL treats a second
// (vec3) body as a redefinition — the whole program fails to compile.
float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Primary-surface roughness, set per pixel in main(). Drives the cheap specular
// lobe below so reservoirs favour lights that land on a highlight.
float gRestirRough;

// Cheap Blinn-Phong specular lobe for the target pdf ONLY (never shaded with
// this). Deliberately approximate — no Fresnel or geometry term, one pow() per
// candidate — since it just biases which light each reservoir keeps. wi points
// from the surface toward the light. Returns a multiplier boost in [0, ~0.8].
float restirSpecBoost(vec3 N, vec3 wi, vec3 P) {
  vec3 V = normalize(uCameraPos - P);
  vec3 H = normalize(wi + V);
  float shin = mix(4.0, 256.0, 1.0 - gRestirRough);
  return 0.8 * pow(max(dot(N, H), 0.0), shin);
}

// Unshadowed contribution of candidate (id, uv) at surface (P, N).
vec3 candidateContribution(float id, vec2 uv, vec3 P, vec3 N) {
  if (id < float(MAX_LIGHTS)) {
    int i = int(id);
    vec4 posType = uLightPosType[i];
    vec4 colRad = uLightColorRadius[i];
    if (posType.w < 0.5 || posType.w >= 1.5) {
      vec3 d = posType.xyz - P; // light CENTER: soft-radius jitter re-drawn at shading
      float dl = length(d);
      if (dl < 1e-5) return vec3(0.0);
      float NdotL = dot(N, d / dl);
      if (NdotL <= 0.0) return vec3(0.0);
      float cone = 1.0;
      if (posType.w >= 1.5) {
        // spot cone — MUST match RTLightingPass.spotFalloff for a consistent estimator
        vec4 dc = uLightDirCone[i];
        cone = smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, -d / dl));
        if (cone <= 0.0) return vec3(0.0);
      }
      return colRad.rgb * (cone * NdotL / (dl * dl)) * (1.0 + restirSpecBoost(N, d / dl, P));
    }
    float NdotL = dot(N, -posType.xyz);
    if (NdotL <= 0.0) return vec3(0.0);
    return colRad.rgb * NdotL * (1.0 + restirSpecBoost(N, -posType.xyz, P));
  }
  int t = (int(id) - MAX_LIGHTS) * 4;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(t, 1), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(t + 1, 1), 0);
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(t + 2, 1), 0);
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(t + 3, 1), 0);
  vec3 lp = t0.xyz + t1.xyz * uv.x + t2.xyz * uv.y;
  vec3 d = lp - P;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;
  float cosS = dot(N, wi);
  float cosL = abs(dot(t3.xyz, wi));
  if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
  // Uniform pick within the emissive set happens at candidate level, so the
  // per-triangle contribution uses area only (count folds into pick pdf).
  return vec3(t1.w, t2.w, t3.w) * (cosS * cosL * t0.w / max(d2, 1e-6)) * (1.0 + restirSpecBoost(N, wi, P));
}

// v3: reservoirs select TRIANGLES, not points. The selection target is the
// candidate's contribution at a FIXED proxy point (the centroid) — any fixed
// score keeps RIS consistent as long as shading divides by the same one. The
// actual surface point is re-drawn fresh every frame at shading, so soft
// area lighting keeps averaging instead of freezing onto one winning point.
// (Known approximation: a triangle whose centroid contributes zero but whose
// far corner doesn't can be under-selected at grazing setups.)
float phatOf(float id, vec3 P, vec3 N) {
  return rtLum(candidateContribution(id, vec2(1.0 / 3.0), P, N));
}
`,xu=`
precision highp float;

${Sh}

#define CANDIDATES 8

layout(location = 0) out vec4 outReservoir;

in vec2 vUv;

uniform sampler2D uPrevReservoir;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;
// Temporal staleness cap (was the literal 40.0). 40 = the shipped behaviour;
// lowering it makes the reservoir shed its history faster, which is the lever
// for post-motion ghosting — the reservoir is the pipeline's SECOND temporal
// accumulator (after the irradiance EMA) and measurably the slower one.
uniform float uMCap;

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outReservoir = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  gRestirRough = clamp(wp.w - 1.0, 0.0, 1.0);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 3079u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  int S = uLightCount + uEmissiveCount; // uniform source pool
  if (S == 0) {
    outReservoir = vec4(0.0);
    return;
  }

  float rId = 0.0;
  float wSum = 0.0;
  float M = 0.0;
  for (int k = 0; k < CANDIDATES; k++) {
    int pick = min(int(rand() * float(S)), S - 1);
    float id = pick < uLightCount
      ? float(pick)
      : float(MAX_LIGHTS + (pick - uLightCount));
    // source pdf = 1/S -> RIS weight = p̂ * S
    float w = phatOf(id, P, N) * float(S);
    wSum += w;
    M += 1.0;
    if (w > 0.0 && rand() * wSum < w) { rId = id; }
  }

  // temporal reuse: previous reservoir as ONE candidate carrying its history
  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  if (clip.w > 0.0) {
    vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
    if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
      vec4 prevPos = texture(uPrevGWorldPos, prevUv);
      float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
      if (prevPos.w > 0.5 && abs(dot(P - prevPos.xyz, N)) < tol) {
        vec4 h = texture(uPrevReservoir, prevUv);
        // Staleness cap; ALSO keeps total M within the 6 bits the encoding
        // stores (8 fresh + 40 history < 64).
        float hM = min(mod(h.r, 64.0), uMCap);
        float hId = floor(h.r / 64.0);
        if (hM > 0.0 && h.a > 0.0) {
          // RIS weight = p̂_now · W_prev · M_prev; with p̂_prev ≈ p̂_now on a
          // validated surface this reduces to (wSum/M)·M.
          float hPhat = phatOf(hId, P, N);
          float w = hPhat > 0.0 ? (h.a / max(mod(h.r, 64.0), 1.0)) * hM : 0.0;
          wSum += w;
          M += hM;
          if (w > 0.0 && rand() * wSum < w) { rId = hId; }
        }
      }
    }
  }

  outReservoir = vec4(rId * 64.0 + min(M, 63.0), 0.0, 0.0, wSum);
}
`,wy=`
precision highp float;

${Sh}

#define NEIGHBORS 4

layout(location = 0) out vec4 outReservoir;

in vec2 vUv;

uniform sampler2D uReservoirIn;
uniform vec2 uTexelSize;

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outReservoir = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  gRestirRough = clamp(wp.w - 1.0, 0.0, 1.0);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 5417u + uint(px.y) * 7907u + uint(uFrame) * 15731u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 3; // decorrelate from the temporal stage's blue-noise dims

  vec4 c = texture(uReservoirIn, vUv);
  float rId = floor(c.r / 64.0);
  float M = mod(c.r, 64.0);
  float wSum = c.a;

  float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
  for (int k = 0; k < NEIGHBORS; k++) {
    float a = (float(k) + rand()) * (2.0 * PI / float(NEIGHBORS));
    float rad = 2.0 + rand() * 8.0; // taps within ~10 lighting-res texels
    vec2 nUv = vUv + vec2(cos(a), sin(a)) * rad * uTexelSize;
    if (nUv.x < 0.0 || nUv.x > 1.0 || nUv.y < 0.0 || nUv.y > 1.0) continue;

    // geometric validation: same plane + similar orientation, or the
    // neighbor's chosen light is meaningless here
    vec4 nwp = texture(uGWorldPos, nUv);
    if (nwp.w < 0.5) continue;
    if (abs(dot(nwp.xyz - P, N)) > tol) continue;
    vec3 nN = normalize(texture(uGNormalMetal, nUv).xyz);
    if (dot(N, nN) < 0.9) continue;

    vec4 h = texture(uReservoirIn, nUv);
    float hM = mod(h.r, 64.0);
    if (hM < 1.0 || h.a <= 0.0) continue;
    float hId = floor(h.r / 64.0);
    // neighbor reservoir as one candidate, re-weighted at THIS surface
    float hPhat = phatOf(hId, P, N);
    float w = hPhat > 0.0 ? (h.a / hM) * min(hM, 40.0) : 0.0;
    wSum += w;
    M += min(hM, 40.0);
    if (w > 0.0 && rand() * wSum < w) { rId = hId; }
  }

  float phat = phatOf(rId, P, N);
  float W = (M > 0.0 && phat > 0.0) ? wSum / (M * phat) : 0.0;
  outReservoir = vec4(rId, 0.0, 0.0, W);
}
`;class Ty{constructor(e,t){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.spatialTarget=this._makeTarget(e,t);const i=(n,r)=>new dt({name:r,glslVersion:Ct,vertexShader:My,fragmentShader:n,uniforms:{uGWorldPos:{value:null},uGNormalMetal:{value:null},uMaterialsTex:{value:null},uLightPosType:{value:[]},uLightColorRadius:{value:[]},uLightDirCone:{value:[]},uLightCount:{value:0},uEmissiveCount:{value:0},uFrame:{value:0},uCameraPos:{value:new P},uEps:{value:.001},...n===xu?{uPrevReservoir:{value:null},uPrevGWorldPos:{value:null},uPrevViewProj:{value:new fe},uMCap:{value:40}}:{uReservoirIn:{value:null},uTexelSize:{value:new ce(1/e,1/t)}}},depthTest:!1,depthWrite:!1});this.material=i(xu,"rt:restir-temporal"),this.spatialMaterial=i(wy,"rt:restir-spatial"),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=new It(e,t,{minFilter:Ve,magFilter:Ve,format:Ye,type:Mt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setCompiledScene(e){for(const t of[this.material,this.spatialMaterial]){const i=t.uniforms;i.uMaterialsTex.value=e.materialsTex,i.uLightPosType.value=e.lightPosType,i.uLightColorRadius.value=e.lightColorRadius,i.uLightDirCone.value=e.lightDirCone,i.uLightCount.value=e.lightCount,i.uEmissiveCount.value=e.emissiveTriCount}}setEmissiveCount(e){this.material.uniforms.uEmissiveCount.value=e,this.spatialMaterial.uniforms.uEmissiveCount.value=e}clearHistory(e){const t=e.getRenderTarget();e.setClearColor(0,0);for(const i of[this.targetA,this.targetB,this.spatialTarget])e.setRenderTarget(i),e.clear(!0,!1,!1);e.setRenderTarget(t)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.spatialTarget.setSize(e,t),this.spatialMaterial.uniforms.uTexelSize.value.set(1/e,1/t)}render(e,t,i,n,r,a,o=40){for(const c of[this.material,this.spatialMaterial]){const u=c.uniforms;u.uGWorldPos.value=t.worldPos,u.uGNormalMetal.value=t.normalMetal,u.uFrame.value=r,u.uCameraPos.value.copy(n),u.uEps.value=a}const l=this.material.uniforms;return l.uPrevReservoir.value=this.targetB.texture,l.uPrevGWorldPos.value=t.prevWorldPos,l.uPrevViewProj.value.copy(i),l.uMCap.value=Math.max(1,o),this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),this.spatialMaterial.uniforms.uReservoirIn.value=this.targetA.texture,this.quad.material=this.spatialMaterial,e.setRenderTarget(this.spatialTarget),e.render(this.scene,this.camera),e.setRenderTarget(null),[this.targetA,this.targetB]=[this.targetB,this.targetA],this.spatialTarget.texture}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.spatialTarget.dispose(),this.material.dispose(),this.spatialMaterial.dispose(),this.quad.geometry.dispose()}}const Ey=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,lo=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${jo}
${Yo}
${Jo}
${Zo}

#define MAX_LIGHTS ${es}
#define PI 3.14159265358979

// MRT: [0] reservoir hit position + packed(M, oct-normal) (fp32),
//      [1] reservoir radiance + W,
//      [2] resolved demodulated GI irradiance (consumed by the denoise add).
layout(location = 0) out vec4 outResPos;
layout(location = 1) out vec4 outResRad;
layout(location = 2) out vec4 outGI;

in vec2 vUv;

// Two-level BVH + per-vertex attribute textures (normal.xyz + materialIndex.w),
// exactly as RTLightingPass binds them. 8 samplers (4 per BVH struct) + 2 attr.
uniform BVH bvhStatic;
uniform BVH bvhDynamic;
uniform bool uHasDynamic;
uniform sampler2D uAttrStatic;
uniform sampler2D uAttrDynamic;
uniform sampler2D uMaterialsTex;   // materials + emissive NEE tris + blue noise + power CDF

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;

// Temporal reuse: reproject through last frame's G-buffer (plane-distance
// validation, same as the lighting pass) and pull last frame's reservoir.
uniform sampler2D uPrevGWorldPos;
uniform sampler2D uPrevResPos;     // history attachment 0: hitPos.xyz + M
uniform sampler2D uPrevResRad;     // history attachment 1: radiance.rgb + W
uniform mat4 uPrevViewProj;

uniform vec4 uLightPosType[MAX_LIGHTS];
uniform vec4 uLightColorRadius[MAX_LIGHTS];
uniform vec4 uLightDirCone[MAX_LIGHTS];
uniform int uLightCount;
uniform int uEmissiveCount;
uniform bool uEmissiveCDF;

uniform vec3 uCameraPos;
uniform float uFrame;
uniform float uEps;
uniform float uFireflyClamp;
uniform float uMCap;        // temporal M-cap (staleness limit)
uniform int uSpatialTaps;   // spatial reuse taps after the temporal merge (0 = v1)
uniform int uValidateInterval; // reservoir-sample validation period (0 = off, e.g. 8)
// Resolve-stage tuning, exposed so the artifact study can sweep them (see the
// resolve block at the end of main()). Defaults reproduce the shipped values:
//   uResolveAlpha 0.15  weight of THIS frame's resolve in the resolve EMA
//   uConfLow      0.30  firefly-clamp multiplier at zero reservoir confidence
uniform float uResolveAlpha;
uniform float uConfLow;
// RAO-BLACKWELLIZED RESOLVE COLOUR (default ON; false = the pre-fix path).
// See the "resolve colour" derivation above the resolve block in main().
uniform bool uChromaMean;
// VISIBILITY POLICY (default ON; false = the pre-fix path). See the final-
// visibility block in main().
uniform bool uVisFallback;

// Validation tuning (see the reservoir-sample-validation block in main()).
// VAL_NEE_SAMPLES: NEE samples averaged when RE-SHADING the stored hit. A single
//   NEE sample is black whenever its random light point is occluded (~30% of the
//   time even for a fully-lit hit), so a 1-sample re-shade cannot tell "light off"
//   from "unlucky shadow ray"; averaging a few de-noises the kill decision. Costs
//   a few extra SHADOW rays on only the ~1/uValidateInterval validating pixels (no
//   extra bounce rays -- the single candidate trace is reused).
// VAL_DARK_FRAC: kill the reservoir when the (multi-sampled) re-shaded target
//   falls below this fraction of the stored one. Kept LOW so the kill fires on a
//   real collapse to near-black (a switched-off light drives it to ~0), not on
//   residual shadow noise -- false kills reset pixels to low confidence, where the
//   pre-existing anti-firefly clamp tightens and would darken bright GI.
#define VAL_NEE_SAMPLES 8
#define VAL_DARK_FRAC 0.02

uniform vec3 uEnvColor;
uniform float uEnvIntensity;
uniform bool uSkyEnabled;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;
uniform float uSkyIntensity;

// ---------- RNG (identical scheme to RTLightingPass) ----------
uint gSeed;
int gBnDim;
vec4 gBlueNoise;
uint pcgHash(uint s) {
  uint state = s * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float rand() {
  if (gBnDim < 4) {
    float v = gBlueNoise[gBnDim];
    gBnDim++;
    return v;
  }
  gSeed = pcgHash(gSeed);
  return float(gSeed) * (1.0 / 4294967296.0);
}
vec2 rand2() { return vec2(rand(), rand()); }

vec4 fetchBlueNoise() {
  ivec2 p = ivec2(gl_FragCoord.xy) & 63;
  vec4 bn = texelFetch(uMaterialsTex, ivec2(p.x, 2 + p.y), 0);
  vec4 shift = fract(float(uFrame) * vec4(0.6180340, 0.7548777, 0.5698403, 0.8191725));
  return fract(bn + shift);
}

// Named rtLum, NOT luminance: three r166+ prepends its own rtLum(vec3)
// to every non-raw ShaderMaterial fragment shader, and GLSL treats a second
// (vec3) body as a redefinition — the whole program fails to compile.
float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// CHROMATICITY: a radiance divided by its own luminance, so rtLum(chromaOf(c))
// is exactly 1 and a weighted mean of chromaticities is again a chromaticity.
// This is the axis the resolve's noise actually lives on — see the resolve
// derivation in main(). Zero-luminance samples carry zero RIS weight and never
// reach the mean, so the fallback value is arbitrary.
vec3 chromaOf(vec3 c) {
  float l = rtLum(c);
  return l > 1e-8 ? c / l : vec3(1.0);
}

// ---------- reservoir .w bit-packing: M (8 bit) + oct-normal (12+12 bit) ------
// The RGBA32F reservoir-position attachment is at the pass's hard 16-sampler
// ceiling, so the reconnection normal n_s (needed by the spatial Jacobian) is
// bit-packed into the SAME .w channel that holds M. fp32 + NEAREST round-trips
// the bits exactly. Layout: (uint(M)&0xFF)<<24 | octX12<<12 | octY12. M caps at
// 255 (clamped on write). 12 bits/axis is ample for a cosine-weighted normal.
vec2 signNotZero(vec2 v) {
  return vec2(v.x >= 0.0 ? 1.0 : -1.0, v.y >= 0.0 ? 1.0 : -1.0);
}
void octEncode12(vec3 n, out uint ox, out uint oy) {
  n /= (abs(n.x) + abs(n.y) + abs(n.z));
  vec2 e = n.z >= 0.0 ? n.xy : (1.0 - abs(n.yx)) * signNotZero(n.xy);
  vec2 u = clamp(e * 0.5 + 0.5, 0.0, 1.0);
  ox = uint(u.x * 4095.0 + 0.5) & 0xFFFu;
  oy = uint(u.y * 4095.0 + 0.5) & 0xFFFu;
}
vec3 octDecode12(uint ox, uint oy) {
  vec2 e = vec2(float(ox), float(oy)) / 4095.0 * 2.0 - 1.0;
  vec3 v = vec3(e.xy, 1.0 - abs(e.x) - abs(e.y));
  if (v.z < 0.0) v.xy = (1.0 - abs(v.yx)) * signNotZero(v.xy);
  return normalize(v);
}
// Pack M (clamped to [0,126]) + hit normal into a single fp32 word.
// M's ceiling is 126, NOT 255: bits 30..23 of the packed word are the float's
// exponent field, and if they are ever all-ones (M lower bits all 1 AND
// octX >= 2048) the word is a NaN/Inf bit pattern — some GPUs CANONICALIZE
// NaNs on texture write, silently destroying the payload. M <= 126 keeps at
// least one exponent bit zero, so the pattern is unrepresentable by
// construction. (126 is far above any practical restirGIMCap.)
float packMN(float M, vec3 n) {
  uint ox, oy;
  octEncode12(n, ox, oy);
  uint mi = uint(clamp(M, 0.0, 126.0)) & 0xFFu;
  return uintBitsToFloat((mi << 24) | (ox << 12) | oy);
}
void unpackMN(float w, out float M, out vec3 n) {
  uint packed = floatBitsToUint(w);
  M = float((packed >> 24) & 0xFFu);
  n = octDecode12((packed >> 12) & 0xFFFu, packed & 0xFFFu);
}

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

// ---------- two-level BVH helpers (copied verbatim) ----------
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
  if (bvhIntersectAnyHit(bvhStatic, ro, rd, maxDist - 2.0 * uEps)) return true;
  if (uHasDynamic && bvhIntersectAnyHit(bvhDynamic, ro, rd, maxDist - 2.0 * uEps)) return true;
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

// >>> RT_TEXTURE_TILES
uniform bool uHasTextureTiles;

void fetchAttrUv(sampler2D attrTex, vec3 bary, uvec3 verts, out vec4 attr, out vec2 uv) {
    uint width = uint(textureSize(attrTex, 0).x);
    uint i0 = verts.x * 2u;
    uint i1 = verts.y * 2u;
    uint i2 = verts.z * 2u;
    vec4 a0 = texelFetch(attrTex, ivec2(i0 % width, i0 / width), 0);
    vec4 a1 = texelFetch(attrTex, ivec2(i1 % width, i1 / width), 0);
    vec4 a2 = texelFetch(attrTex, ivec2(i2 % width, i2 / width), 0);
    attr = a0 * bary.x + a1 * bary.y + a2 * bary.z;
    vec2 uv0 = texelFetch(attrTex, ivec2((i0 + 1u) % width, (i0 + 1u) / width), 0).xy;
    vec2 uv1 = texelFetch(attrTex, ivec2((i1 + 1u) % width, (i1 + 1u) / width), 0).xy;
    vec2 uv2 = texelFetch(attrTex, ivec2((i2 + 1u) % width, (i2 + 1u) / width), 0).xy;
    uv = uv0 * bary.x + uv1 * bary.y + uv2 * bary.z;
}

#define TILE 128.0

vec4 tileSample(float tileIdx, vec2 st) {
    vec2 fuv = fract(st) * TILE - 0.5;
    vec2 f0 = floor(fuv);
    vec2 f1 = f0 + 1.0;
    f0 = mod(f0, TILE);
    f1 = mod(f1, TILE);
    float rowBase = 70.0 + tileIdx * TILE;
    vec4 s00 = texelFetch(uMaterialsTex, ivec2(int(f0.x), int(rowBase + f0.y)), 0);
    vec4 s10 = texelFetch(uMaterialsTex, ivec2(int(f1.x), int(rowBase + f0.y)), 0);
    vec4 s01 = texelFetch(uMaterialsTex, ivec2(int(f0.x), int(rowBase + f1.y)), 0);
    vec4 s11 = texelFetch(uMaterialsTex, ivec2(int(f1.x), int(rowBase + f1.y)), 0);
    vec2 t = fuv - f0;
    return mix(mix(s00, s10, t.x), mix(s01, s11, t.x), t.y);
}
// <<< RT_TEXTURE_TILES

// ---------- one-light NEE at a GI-bounce hit (specular dropped) ----------
float spotFalloff(int i, vec3 lightToP) {
  vec4 posType = uLightPosType[i];
  if (posType.w < 1.5) return 1.0;
  vec4 dc = uLightDirCone[i];
  return smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, lightToP));
}

vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = uLightPosType[i];
  vec4 colRad = uLightColorRadius[i];
  vec3 L;
  float dist2 = 1.0;
  float maxDist = 1e7;
  float cone = 1.0;
  if (posType.w < 0.5 || posType.w >= 1.5) {
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - P;
    float dl = length(d);
    if (dl < 1e-5) return vec3(0.0);
    L = d / dl;
    dist2 = dl * dl;
    maxDist = dl;
    cone = spotFalloff(i, -L);
    if (cone <= 0.0) return vec3(0.0);
  } else {
    L = normalize(-posType.xyz + randUnitVector() * colRad.w);
    dist2 = 1.0;
  }
  float NdotL = dot(N, L);
  if (NdotL <= 0.0) return vec3(0.0);
  if (occluded(P + N * uEps, L, maxDist)) return vec3(0.0);
  return colRad.rgb * (cone / dist2) * NdotL;
}

vec3 sampleOneLight(vec3 P, vec3 N) {
  if (uLightCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
  return lightContribution(i, P, N) * float(uLightCount);
}

vec3 sampleEmissiveTri(vec3 P, vec3 N) {
  if (uEmissiveCount == 0) return vec3(0.0);
  int idx;
  float invProb;
  if (uEmissiveCDF) {
    float u = rand();
    int lo = 0;
    int hi = uEmissiveCount - 1;
    for (int s = 0; s < 8; s++) {
      if (lo >= hi) break;
      int mid = (lo + hi) >> 1;
      if (u > texelFetch(uMaterialsTex, ivec2(mid, 66), 0).x) lo = mid + 1;
      else hi = mid;
    }
    idx = lo;
    invProb = 1.0 / max(texelFetch(uMaterialsTex, ivec2(idx, 66), 0).y, 1e-8);
  } else {
    idx = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1);
    invProb = float(uEmissiveCount);
  }
  int i = idx * 4;
  vec4 t0 = texelFetch(uMaterialsTex, ivec2(i, 1), 0);
  vec4 t1 = texelFetch(uMaterialsTex, ivec2(i + 1, 1), 0);
  vec4 t2 = texelFetch(uMaterialsTex, ivec2(i + 2, 1), 0);
  vec4 t3 = texelFetch(uMaterialsTex, ivec2(i + 3, 1), 0);
  vec2 u = rand2();
  if (u.x + u.y > 1.0) u = 1.0 - u;
  vec3 lp = t0.xyz + t1.xyz * u.x + t2.xyz * u.y;
  vec3 d = lp - P;
  float d2 = dot(d, d);
  float dist = sqrt(d2);
  if (dist < 1e-4) return vec3(0.0);
  vec3 wi = d / dist;
  float cosS = dot(N, wi);
  float cosL = abs(dot(t3.xyz, wi));
  if (cosS <= 0.0 || cosL < 1e-4) return vec3(0.0);
  if (occluded(P + N * uEps, wi, dist)) return vec3(0.0);
  vec3 e = vec3(t1.w, t2.w, t3.w) * (cosS * cosL * invProb * t0.w / max(d2, 1e-6));
  float eLum = dot(e, vec3(0.299, 0.587, 0.114));
  float eCap = uFireflyClamp * 2.0;
  if (eLum > eCap) e *= eCap / eLum;
  return e;
}

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

// Incoming radiance along rd for a DIFFUSE GI bounce (specular=false in the
// inline path), plus the world-space hit position so temporal reuse can
// recompute the geometry term at the reprojected (same) surface. On a miss the
// "hit" is a far point along the ray, so the reused direction is recoverable.
// nLight = number of averaged NEE samples at the bounce hit. The fresh candidate
// passes 1 (byte-identical to the inline path). The reservoir-sample VALIDATION
// passes a small number > 1: a single NEE sample is black whenever its random
// light point is occluded, which happens ~30% of the time even for a fully-lit
// hit, so a 1-sample re-shade cannot reliably tell "light switched off" from
// "unlucky shadow sample". Averaging a few NEE samples de-noises pHatNew enough to
// make the validation kill decision robust, at the cost of a few extra shadow rays
// on only the ~1/uValidateInterval validating pixels (no extra BOUNCE rays).
vec3 traceRadianceGI(vec3 ro, vec3 rd, int nLight, out vec3 hitPos, out vec3 hitNormal) {
  uvec4 fi; vec3 bary; float dist; bool isDyn;
  if (!traceBoth(ro, rd, fi, bary, dist, isDyn)) {
    hitPos = ro + rd * 1.0e4;
    // Sky "hit" has no surface; face the normal back along the ray so a
    // neighbour reconnecting to this point sees a sane, positive cosPhi.
    hitNormal = -rd;
    return uSkyEnabled
      ? skyColor(rd, uSunDir, uSunColor, uSkyZenith, uSkyHorizon, uSkyIntensity)
      : uEnvColor * uEnvIntensity;
  }
  vec4 attr = isDyn
    ? textureSampleBarycoord(uAttrDynamic, bary, fi.xyz)
    : textureSampleBarycoord(uAttrStatic, bary, fi.xyz);
// >>> RT_TEXTURE_TILES
  // Re-fetch at stride 2 and get the interpolated UV for tile sampling.
  // Branch explicitly: GLSL forbids ternaries on opaque types (samplers).
  vec2 _tileUv;
  if (isDyn) {
    fetchAttrUv(uAttrDynamic, bary, fi.xyz, attr, _tileUv);
  } else {
    fetchAttrUv(uAttrStatic, bary, fi.xyz, attr, _tileUv);
  }
// <<< RT_TEXTURE_TILES
  vec3 hAlbedo; float hRough; vec3 hEmissive; float hMetal;
  fetchMaterial(attr.w, hAlbedo, hRough, hEmissive, hMetal);
// >>> RT_TEXTURE_TILES
  if (uHasTextureTiles) {
    vec4 _ti = texelFetch(uMaterialsTex, ivec2(int(round(attr.w)), 69), 0);
    float _albedoTile = _ti.x;
    float _emissiveTile = _ti.y;
    if (_albedoTile >= 0.0) hAlbedo *= tileSample(_albedoTile, _tileUv).rgb;
    if (_emissiveTile >= 0.0) hEmissive *= tileSample(_emissiveTile, _tileUv).rgb;
  }
// <<< RT_TEXTURE_TILES
  vec3 hN = normalize(attr.xyz);
  if (dot(hN, rd) > 0.0) hN = -hN;
  vec3 hP = ro + rd * dist;
  hitPos = hP;
  hitNormal = hN;
  vec3 Ld = vec3(0.0);
  for (int s = 0; s < 8; s++) {
    if (s >= nLight) break;
    Ld += sampleOneAny(hP + hN * uEps, hN);
  }
  Ld /= float(max(nLight, 1));
  // Diffuse GI drops NEE-listed (static) emitter emission so it isn't double
  // counted (same rule as RTLightingPass.traceRadiance with specular=false).
  vec3 hLe = (uEmissiveCount > 0 && !isDyn) ? vec3(0.0) : hEmissive;
  return hLe + hAlbedo * Ld * (1.0 / PI);
}

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outResPos = vec4(0.0);
    outResRad = vec4(0.0);
    outGI = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 1471u + uint(px.y) * 8951u + uint(uFrame) * 23833u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  // ===================== ESTIMATOR DERIVATION =====================
  // The inline path stores, per pixel, the DEMODULATED indirect irradiance
  //     I = (1/PI) * integral_hemisphere L_i(w) (N.w) dw
  // as a single cosine-sampled sample: indirect = traceRadiance(cosine ray),
  // because with the cosine pdf p(w) = cos/PI the estimate L_i(w)/p * (cos/PI)
  // collapses to L_i(w). We reproduce the SAME quantity I via RIS.
  //
  //  - Candidate sample:  a hemisphere direction w (cosine-sampled), carrying
  //    the incoming radiance L_i(w) = traceRadianceGI(w) and its hit position.
  //  - Target function:   p_hat(w) = luminance( L_i(w) * cos(theta) ).
  //  - Source pdf:        p(w) = cos(theta)/PI  (cosine).
  //  - RIS candidate weight: w_i = p_hat / p = PI * luminance(L_i)  (cos cancels).
  //  - Reservoir picks y ~ p_hat; unbiased contribution weight
  //        W = wSum / (M * p_hat(y)).
  //  - Final estimate of I (integrand F(w) = L_i(w) cos(theta) / PI):
  //        <I> = F(y) * W = L_i(y) * cos(theta_y) / PI * W.
  //
  //  Sanity (M=1, no history):  W = w_1 / p_hat(y) = PI*lum(L)/(lum(L)*cos) =
  //  PI/cos, so <I> = L_i * cos/PI * PI/cos = L_i(y) — EXACTLY the inline
  //  single-sample estimate. Forcing uMCap=1 with a cleared history therefore
  //  makes this pass statistically identical to the legacy GI path.
  //
  //  The reservoir is the GI temporal integrator; its output is ADDED at the
  //  denoise stage, DOWNSTREAM of the lighting pass's own temporal accumulation,
  //  so this GI never re-enters (and double-counts through) that history.
  // ================================================================

  // Reprojected UV of this pixel's primary point into the previous frame; shared
  // by the reservoir-sample validation, the temporal merge and the spatial taps.
  vec4 clip = uPrevViewProj * vec4(P, 1.0);
  vec2 prevUv = (clip.xy / clip.w) * 0.5 + 0.5;
  bool haveReproj = clip.w > 0.0 &&
    prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0;
  // Plane-distance tolerance the temporal validation and the spatial taps share.
  float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;

  // --- fetch this pixel's TEMPORAL-history reservoir ONCE. Both the reservoir-
  // sample validation (below) and the temporal merge read it. Texture reads
  // only, so this consumes no RNG: the fresh-candidate random stream stays
  // aligned with the validation-off path (uValidateInterval==0 is byte-identical
  // to before this feature). ---
  bool histValid = false;
  float Mprev = 0.0;
  float Wprev = 0.0;
  vec3 radPrev = vec3(0.0);
  vec3 hitPrev = vec3(0.0);
  vec3 nPrev = N;
  if (haveReproj) {
    vec4 pPos = texture(uPrevGWorldPos, prevUv);
    if (pPos.w > 0.5 && abs(dot(P - pPos.xyz, N)) < tol) {
      vec4 hp = texture(uPrevResPos, prevUv);  // hitPos.xyz + packed(M, n_s)
      vec4 hr = texture(uPrevResRad, prevUv);  // radiance.rgb + W
      unpackMN(hp.w, Mprev, nPrev);
      Wprev = hr.w;
      if (Mprev > 0.0 && Wprev > 0.0) {
        histValid = true;
        radPrev = hr.rgb;
        hitPrev = hp.xyz;
      }
    }
  }

  // --- RESERVOIR-SAMPLE VALIDATION (the fix for stale bounce light). On a
  // rotating 1-in-uValidateInterval subset of pixels — selected by a per-pixel
  // hash added to uFrame so the validating set is decorrelated in space AND
  // changes every frame — spend this frame's ONE candidate ray re-tracing the
  // STORED reservoir hit instead of a fresh cosine bounce. This costs ZERO extra
  // rays (it REPLACES the fresh candidate on those pixels) and is what stops a
  // switched-off light from haunting the reservoir: the stale bright sample gets
  // re-shaded (now dark) or, if its geometry moved, dropped. Direction selection
  // happens HERE, before the single trace below, so the trace call site is shared. ---
  uint pixHash = pcgHash(uint(px.x) * 2654435761u + uint(px.y) * 40503u + 1u);
  bool validateFrame = uValidateInterval > 0 &&
    ((uint(uFrame) + pixHash) % uint(uValidateInterval)) == 0u;

  vec3 wi;
  bool doValidate = false;
  float expectDist = 0.0;
  if (validateFrame && histValid) {
    vec3 dpv = hitPrev - P;
    expectDist = length(dpv);
    if (expectDist > 1e-5) {
      wi = dpv / expectDist;                    // aim the candidate AT the stored hit
      doValidate = true;
    }
  }
  if (!doValidate) {
    wi = cosineSampleHemisphere(N, rand2());     // fresh cosine-hemisphere GI bounce
  }

  // --- the SINGLE candidate trace. Validation reuses this exact call site (no
  // second trace is added to the shader); the trace already shades the hit. ---
  vec3 hitPos;
  vec3 hitNormal;
  int nLight = doValidate ? VAL_NEE_SAMPLES : 1;
  vec3 rad = traceRadianceGI(P + N * uEps, wi, nLight, hitPos, hitNormal);
  // Match the inline firefly clamp, which is applied to indirect (= L_i) so
  // the biased mean of the two paths agrees.
  float rl = rtLum(rad);
  if (rl > uFireflyClamp) rad *= uFireflyClamp / rl;

  float cosT = max(dot(N, wi), 0.0);

  float wSum;
  float M;
  vec3 selRad;
  vec3 selPos;
  vec3 selNormal;   // n_s of the selected sample (packed into .w)
  bool killStore = false;   // validation flags the STORED reservoir for reset
  // RIS-weight-weighted sum of the candidates' CHROMATICITIES, accumulated
  // beside wSum at every merge point (fresh candidate, temporal history,
  // spatial taps). chromaAcc / wSum is the expectation of the chromaticity the
  // stochastic selection below draws — the Rao-Blackwellized resolve colour.
  vec3 chromaAcc = vec3(0.0);
  bool selIsSpatial = false;   // did a SPATIAL tap win the selection?

  if (doValidate) {
    // On a validation pixel there is NO fresh exploration candidate this frame
    // (the ray was spent re-tracing the stored hit); the reservoir for THIS frame
    // is the temporal history alone (the merge below re-adds it, histValid stays
    // true so a valid pixel keeps showing its GI — no dropout, no darkening).
    // Documented ~1/uValidateInterval exploration reduction (12.5% at interval 8).
    wSum = 0.0;
    M = 0.0;
    selRad = vec3(0.0);
    selPos = P + N;
    selNormal = N;

    // Validation is KILL-only, and the kill hits only the STORED reservoir (next
    // frame), NOT this frame's displayed estimate. Re-shade the stored hit and, if
    // it is stale, mark the stored reservoir for reset so this pixel's fresh
    // candidate takes over next frame and the estimate tracks the current lighting.
    // Two staleness signals:
    //   (1) GEOMETRY changed — the re-traced hit distance no longer matches the
    //       stored one (a nearer occluder appeared, geometry moved, or the ray
    //       missed; a miss puts hitPos far down the ray, so it trips this too).
    //   (2) the target WENT DARK — the re-shaded radiance collapsed below a small
    //       fraction (VAL_DARK_FRAC) of the stored one (a light switched off). This
    //       is THE fix for stale bounce light.
    // Why kill-only, and why store-deferred: the reservoir stores a RIS-selected
    // sample whose radiance is BRIGHT-biased with a compensating small W
    // (gi_luminance = selRad*selCos/PI*W = wSum/(M*PI), so W is a purely geometric
    // 1/pdf term). Overwriting that bright radiance with a single average re-shade
    // sample, or rescaling W by the noisy luminance ratio, provably DARKENS the
    // mean (bright-selected pHatOld in the denominator) — the originally-specified
    // "refresh radiance + W *= clamp(pHatOld/pHatNew, 0.25, 4)" path was measured
    // to darken static GI ~25% at interval 8, so it is NOT used. Killing (dropping
    // the stale term so fresh candidates rebuild) is unbiased; deferring the kill
    // to the STORE keeps the displayed frame equal to validation-off, so even a
    // false kill from single-sample noise costs a little variance, not brightness.
    float valTol = max(0.02 * expectDist, 4.0 * uEps);
    float hitDist = length(hitPos - P);
    bool geomChanged = abs(hitDist - expectDist) > valTol;
    float pHatOld = rtLum(radPrev) * cosT;   // stored target at this pixel
    float pHatNew = rtLum(rad) * cosT;        // re-shaded target (current light)
    bool wentDark = pHatNew < VAL_DARK_FRAC * pHatOld;
    // KILL (drop the stale temporal term so this pixel's fresh candidates rebuild
    // from the current scene) on geometry change OR a collapse to near-black; leave
    // a still-valid sample UNTOUCHED so a static scene does not drift. A switched-
    // off light drives pHatNew -> 0 and trips wentDark. The kill only marks the
    // STORE (killStore); the displayed frame still uses the merged history.
    killStore = geomChanged || wentDark;
  } else {
    // --- normal fresh candidate: one cosine-hemisphere GI bounce, shaded inline.
    float pHatFresh = rtLum(rad) * cosT;
    // w = p_hat / p_source = p_hat / (cos/PI). cosT cancels; guard cosT==0.
    float wFresh = cosT > 0.0 ? pHatFresh * PI / cosT : 0.0;
    wSum = wFresh;
    M = 1.0;
    selRad = rad;
    selPos = hitPos;
    selNormal = hitNormal;
    chromaAcc = wFresh * chromaOf(rad);
  }

  // --- temporal reuse: merge the (possibly radiance-refreshed, or killed)
  // history. When the validation above KILLED the sample, histValid is false and
  // the merge is skipped -> the reservoir stays empty this frame. ---
  // emaPrevGi: last frame's resolved GI, RECONSTRUCTED from the previous
  // reservoir (all inputs already bound — no extra sampler). Reservoirs persist
  // WHICH sample matters, not a variance average: near emitters many samples
  // are legitimately bright and the per-frame selection churn reads as
  // flickering fireflies (the inline GI path hid the same variance inside the
  // lighting pass's deep EMA). The resolve below blends against this
  // reconstruction to restore that smoothing.
  vec3 emaPrevGi = vec3(0.0);
  bool emaPrevOk = false;
  if (histValid) {
    // Re-evaluate the target at the CURRENT surface (reconnect at the stored hit
    // point). Same world point P (validated), so no Jacobian.
    vec3 dp = hitPrev - P;
    float dl = length(dp);
    float cosPrev = dl > 1e-5 ? max(dot(N, dp / dl), 0.0) : 0.0;
    float pHatPrev = rtLum(radPrev) * cosPrev;
    float Mc = min(Mprev, uMCap);
    // Combine reservoirs: w = p_hat_current(sample) * W_prev * M_prev.
    float w = pHatPrev * Wprev * Mc;
    wSum += w;
    M += Mc;
    // radPrev already carries the RUNNING chromaticity (the store below writes
    // it back), so this one term folds the whole history into the mean with
    // exactly the weight the history has in wSum — no extra state, no sampler.
    chromaAcc += w * chromaOf(radPrev);
    if (w > 0.0 && rand() * wSum < w) {
      selRad = radPrev;
      selPos = hitPrev;
      selNormal = nPrev;
    }
    // Reconstruct last frame's resolve from this same sample (same W cap
    // and clamp as the live resolve, for a like-for-like EMA partner).
    vec3 pg = radPrev * (cosPrev / PI) * min(Wprev, 32.0);
    float pgl = rtLum(pg);
    if (pgl > uFireflyClamp) pg *= uFireflyClamp / pgl;
    // uResolveAlpha >= 1 means "no EMA" (the default), and the guard is exact
    // rather than cosmetic: mix(a, b, 1.0) evaluates a + 1.0*(b - a), which is
    // NOT b when a is orders of magnitude larger — precisely the firefly case
    // this reconstruction can produce. Skipping the blend entirely is the only
    // way alpha 1 provably returns the resolve untouched.
    if (uResolveAlpha < 1.0 && !any(isnan(pg)) && !any(isinf(pg))) {
      emaPrevGi = pg;
      emaPrevOk = true;
    }
  }

  // Snapshot the TEMPORAL-only reservoir. This — not the spatially-merged one — is
  // what gets STORED as history, exactly as v1 did. Spatial reuse below is terminal
  // (it only sharpens THIS frame's resolved GI output); it is deliberately NOT fed
  // back into the stored reservoir. The reconnection shift carries a small target
  // -function bias, and the high default M-cap's temporal feedback would amplify it
  // by ~1/(1-M/(M+1)) ≈ (M+1)x, so storing the merged reservoir makes the GI drift
  // frame-over-frame (dark in grazing views, blown out in steep ones). Keeping the
  // history temporal-only — the pattern the shipped direct-light ReSTIR uses, where
  // "history feeds back from the TEMPORAL stage only" — keeps it stable and
  // unbiased while still delivering the per-frame spatial variance reduction into
  // the denoiser. taps==0 leaves selRad/M/wSum untouched, so this is a no-op there.
  vec3 selRadT = selRad; vec3 selPosT = selPos; vec3 selNormalT = selNormal;
  float wSumT = wSum; float MT = M;
  vec3 chromaAccT = chromaAcc;

  // --- spatial reuse (v2): fused spatiotemporal, streamed RIS over K taps of the
  // PREVIOUS frame's reservoir textures around the reprojected UV. Each adopted
  // neighbour sample S = (hit x_s, hit normal n_s, radiance L_s) is reweighted by
  // the reconnection Jacobian |J| = (cosPhi_q/cosPhi_r)*(d_r^2/d_q^2). x_q is this
  // pixel's primary point; x_r is the NEIGHBOUR's primary point read from the
  // previous frame's gWorldPos. A final visibility ray (below) prevents leaks. ---
  if (haveReproj && uSpatialTaps > 0) {
    vec2 texel = 1.0 / vec2(textureSize(uPrevResPos, 0));
    for (int k = 0; k < 4; k++) {
      if (k >= uSpatialTaps) break;
      // Offset: radius uniform in [4, 20] lighting-res pixels, angle from RNG,
      // decorrelated per frame (gSeed carries uFrame; blue noise is frame-shifted).
      float ang = rand() * 2.0 * PI;
      float rad_px = mix(4.0, 20.0, rand());
      vec2 nUv = prevUv + vec2(cos(ang), sin(ang)) * rad_px * texel;
      // (a) neighbour uv in [0,1].
      if (nUv.x < 0.0 || nUv.x > 1.0 || nUv.y < 0.0 || nUv.y > 1.0) continue;
      // (b) plane-distance validation of the neighbour's PREVIOUS primary point
      // against q's plane (same tolerance as the temporal validation).
      vec4 nPrimary = texture(uPrevGWorldPos, nUv);   // x_r + validFlag
      if (nPrimary.w < 0.5 || abs(dot(P - nPrimary.xyz, N)) >= tol) continue;
      vec4 nhp = texture(uPrevResPos, nUv);   // x_s + packed(M_r, n_s)
      vec4 nhr = texture(uPrevResRad, nUv);   // L_s + W_r
      float Mr; vec3 nS;
      unpackMN(nhp.w, Mr, nS);
      float Wr = nhr.w;
      // (c) skip reservoirs with M == 0 or W <= 0.
      if (Mr <= 0.0 || Wr <= 0.0) continue;
      vec3 xS = nhp.xyz;
      vec3 Ls = nhr.rgb;
      vec3 xR = nPrimary.xyz;

      // Reconnection Jacobian for q adopting the neighbour's sample.
      float dq = length(xS - P);
      float dr = length(xS - xR);
      if (dq < 1e-5 || dr < 1e-5) continue;
      float cosPhiQ = max(dot(nS, normalize(P - xS)), 1e-4);
      float cosPhiR = max(dot(nS, normalize(xR - xS)), 1e-4);
      float J = (cosPhiQ / cosPhiR) * (dr * dr) / (dq * dq);
      J = clamp(J, 0.1, 10.0);   // grazing-angle firefly guard

      // Target function at q (same shape the pass already uses).
      float cosQ = max(dot(N, normalize(xS - P)), 0.0);
      float pHatQ = rtLum(Ls) * cosQ;
      // Invalid-shift reject: if the neighbour's hit x_s lies below q's shading
      // hemisphere (cosQ == 0) or carries no radiance, the reconnected target is
      // zero — the shift could never have produced this sample at q, so it must
      // NOT add confidence weight. Skipping the whole tap (not just its w) keeps
      // the M normalization honest; adding Mc here while w == 0 would inflate M
      // without wSum and systematically darken the GI. (The temporal path never
      // trips this — same surface point, always a valid, non-zero target.)
      if (pHatQ <= 0.0) continue;
      float Mc = min(Mr, uMCap);
      float w = pHatQ * J * Wr * Mc;
      wSum += w;
      M += Mc;
      chromaAcc += w * chromaOf(Ls);
      if (w > 0.0 && rand() * wSum < w) {
        selRad = Ls;
        selPos = xS;
        selNormal = nS;
        selIsSpatial = true;
      }
    }
  }

  // --- the TEMPORAL-only resolve. It is needed twice: as the STORE's W (below,
  // exactly as before) and as the visibility fallback (right after), so it is
  // formed here, before the merged one. Nothing about it changed. ---
  vec3 sdT = selPosT - P;
  float slT = length(sdT);
  float selCosT = slT > 1e-5 ? max(dot(N, sdT / slT), 0.0) : 0.0;
  float pHatSelT = rtLum(selRadT) * selCosT;
  float WT = (MT > 0.0 && pHatSelT > 0.0) ? wSumT / (MT * pHatSelT) : 0.0;

  // --- finalize OUTPUT: recompute p_hat(selected) at this surface from the
  // SPATIALLY-merged reservoir, form W, resolve the GI for this frame. ---
  vec3 sd = selPos - P;
  float sl = length(sd);
  float selCos = sl > 1e-5 ? max(dot(N, sd / sl), 0.0) : 0.0;
  float pHatSel = rtLum(selRad) * selCos;
  float W = (M > 0.0 && pHatSel > 0.0) ? wSum / (M * pHatSel) : 0.0;

  // --- final visibility: ONE any-hit occlusion ray from x_q toward x_s. If the
  // reconnection point is blocked the reused sample would leak light through a
  // wall, so it must not be shown. occluded() already trims 2*eps off maxDist to
  // avoid self-intersecting the far surface. The STORED reservoir keeps the
  // un-occluded W: the sample is real and may be visible to a neighbour, so each
  // pixel re-tests visibility from its own position. Storing the zeroed W instead
  // would bleed energy out of the reservoir over frames (spatial samples fail
  // visibility more often than temporal ones, and the zero would propagate to
  // neighbours), darkening the GI. ---
  // Gated on uSpatialTaps > 0: taps==0 has no reconnection to test and stays
  // byte-identical to v1.
  //
  // uVisFallback (default ON) fixes two things the original test got wrong:
  //   1. It tested the selected sample WHATEVER its origin. A TEMPORAL sample is
  //      visible by construction — same surface point, the ray that found it
  //      started here — so testing it can only produce FALSE rejections from ray
  //      epsilon at the reconnection point. Only a spatial adoption can pierce a
  //      wall, so only that is tested now; roughly half the pixels stop casting
  //      the ray at all, which is also where the fallback pays for itself.
  //   2. On rejection it zeroed the WHOLE pixel's estimate for the frame. That
  //      threw away the pixel's own ~M-frame temporal accumulation over one
  //      neighbour's failed reconnection, and since occlusion is geometry-
  //      correlated the zeros arrive in patches — a structured black-speckle
  //      source right where contact shadows are. Falling back to this pixel's
  //      TEMPORAL-only estimate rejects exactly the tainted term and keeps the
  //      untainted one; it is what taps==0 would have shown at that pixel.
  bool visFallback = false;
  float Wout = W;
  bool testVis = uSpatialTaps > 0 && Wout > 0.0 && sl > 1e-5 &&
    (!uVisFallback || selIsSpatial);
  if (testVis && occluded(P + N * uEps, sd / sl, sl)) {
    if (uVisFallback) visFallback = true; else Wout = 0.0;
  }
  // W cap: W ~ pi/cos for the cosine source pdf, so values beyond ~32 mean the
  // recomputed p_hat(selected) collapsed this frame (grazing cos after a camera
  // or normal change) while wSum still carries past-frame magnitudes — the
  // classic reservoir firefly. The inline GI path hid the same spikes inside
  // its deep temporal EMA; this resolve has no EMA downstream, so the spike
  // would live on screen for a whole frame (visibly on Metal/iOS). Capping W
  // trusts reconnection angles down to cos ~ 0.1 and slightly darkens grazing
  // GI beyond that — the standard ReSTIR trade.
  Wout = min(Wout, 32.0);

  vec3 gi = visFallback
    ? selRadT * (selCosT / PI) * min(WT, 32.0)
    : selRad * (selCos / PI) * Wout;   // demodulated indirect irradiance

  // ================= RESOLVE COLOUR (Rao-Blackwellization) =================
  // Substituting W back into the line above collapses it exactly:
  //     gi = selRad * selCos/PI * wSum/(M * rtLum(selRad) * selCos)
  //        = chromaOf(selRad) * wSum / (PI * M)
  // — the selCos cancels and the luminance cancels. So the resolve's LUMINANCE
  // is wSum/(PI*M), a running mean over the reservoir's whole M-frame history,
  // while its COLOUR is the chromaticity of ONE stochastically selected sample.
  // The two halves of the estimate have wildly different variance, and the
  // colour half is the artifact: measured at 37% chromaticity spread per pixel
  // on a converged Cornell box, it is a red/green confetti field that the
  // à-trous filter (whose edge-stopping weights are LUMINANCE-based, so it
  // cannot see the error to stop on it) averages into coarse coloured blotches.
  // rmse is blind to it — the MEAN colour is correct, which is the whole point.
  //
  // The fix is to replace the drawn chromaticity with its expectation under the
  // same RIS weights, chromaAcc/wSum, which is textbook Rao-Blackwellization:
  // identical mean, strictly lower variance, and here it removes essentially all
  // of the colour variance because the weights are exactly the selection
  // probabilities. It costs one vec3 multiply-add per merge point, no extra
  // storage, no extra sampler and no extra ray. rtLum(chromaOf(x)) == 1 and
  // rtLum is linear, so the weighted mean is itself a unit-luminance
  // chromaticity: rescaling by rtLum(gi) below preserves the resolved LUMINANCE
  // bit for bit, which is why every luminance-derived quantity in this pass
  // (p_hat, W, the merge weights, the validation ratio test) is untouched.
  if (uChromaMean) {
    float wsRB = visFallback ? wSumT : wSum;
    vec3 accRB = visFallback ? chromaAccT : chromaAcc;
    float giL = rtLum(gi);
    if (wsRB > 0.0 && giL > 0.0) gi = (accRB / wsRB) * giL;
  }
  // Confidence-weighted firefly clamp: a young reservoir (M small — fresh
  // pixels under camera motion, where the resolve EMA has no partner yet) is
  // one raw sample, and at the full clamp it reads as motion sparkle. Tighten
  // the cap for low-M pixels and relax it to the inline-path clamp as
  // confidence grows; converged pixels are untouched. Trades a few frames of
  // slightly dim GI on freshly revealed surfaces for a steady image in motion.
  float conf = clamp(M / uMCap, 0.0, 1.0);
  float cap = uFireflyClamp * mix(uConfLow, 1.0, conf);
  float gil = rtLum(gi);
  if (gil > cap) gi *= cap / gil;
  if (any(isnan(gi)) || any(isinf(gi))) gi = vec3(0.0);
  // Resolve EMA (see the emaPrevGi note above). OFF at the default alpha 1 —
  // emaPrevOk is only ever set when alpha < 1, so this whole blend is dead code
  // in the shipped configuration. It was added to damp near-emitter selection
  // churn, which the chromaticity mean above now removes at the source.
  if (emaPrevOk) gi = mix(emaPrevGi, gi, uResolveAlpha);

  // --- STORE the TEMPORAL-only reservoir as history (see snapshot note above).
  // Its W (WT) was resolved above, from the temporal-merged wSum/M, so the stored
  // W is valid for next frame's temporal AND spatial reuse. For taps==0 this is
  // exactly the v1 reservoir. A NaN sample is scrubbed so it can't poison the
  // history. ---
  // Carry the RUNNING chromaticity in the stored radiance. Only rtLum(selRadT)
  // is ever read back out of this field — by pHatPrev in the temporal merge, by
  // pHatQ in a neighbour's spatial tap, and by the validation ratio test — and
  // the rescale below preserves that luminance exactly, so the stored reservoir
  // is numerically the same reservoir it was before. What changes is that the
  // colour a neighbour or a future frame inherits is the accumulated mean rather
  // than one draw, which is what makes the Rao-Blackwellization recursive: the
  // single "chromaAcc += w * chromaOf(radPrev)" term above folds in the entire
  // history at exactly the weight the history carries in wSum.
  if (uChromaMean && wSumT > 0.0) {
    float lT = rtLum(selRadT);
    if (lT > 0.0) selRadT = (chromaAccT / wSumT) * lT;
  }
  if (any(isnan(selRadT)) || any(isinf(selRadT))) { selRadT = vec3(0.0); WT = 0.0; }

  // Validation store policy. The DISPLAYED gi above always used the merged history
  // (no dropout). The STORED reservoir, however, must be handled so validation
  // does not shift the temporal fixed point:
  //   - KEEP (valid sample): pass the previous reservoir through UNCHANGED. A
  //     validation frame carries no fresh candidate, so RE-DERIVING and re-storing
  //     the merged reservoir (M -> min(Mprev,cap), W recomputed) perturbs the
  //     recursion and was measured to darken the static estimate ~13-16%. Writing
  //     back the exact (hitPrev, radPrev, Wprev, Mprev) leaves the fixed point
  //     identical to validation-off, so a static scene does not drift.
  //   - KILL (stale sample): reset to empty so next frame's fresh cosine candidate
  //     rebuilds and the estimate tracks the current lighting.
  if (doValidate) {
    if (killStore) {
      selPosT = P + N; selRadT = vec3(0.0); selNormalT = N; MT = 0.0; WT = 0.0;
    } else {
      // KEEP: write the previous reservoir back verbatim (hitPrev, radPrev, nPrev,
      // Mprev, Wprev). A validation frame adds no fresh candidate, so re-deriving
      // and re-storing the merged reservoir (M -> min(Mprev,cap), W recomputed)
      // perturbs the temporal recursion and was measured to darken the static
      // estimate ~13-16%; a verbatim write-back keeps the fixed point identical to
      // validation-off.
      selPosT = hitPrev; selRadT = radPrev; selNormalT = nPrev; MT = Mprev; WT = Wprev;
    }
  }

  outResPos = vec4(selPosT, packMN(MT, selNormalT));
  outResRad = vec4(selRadT, WT);
  outGI = vec4(gi, 1.0);
}
`;class Ay{constructor(e,t){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this._fragTiles=lo,this._fragNoTiles=function(n,r){const a=n.split(`
`),o=[];let l=!1;for(const c of a){if(c.includes(">>> "+r)){l=!0;continue}if(c.includes("<<< "+r)){l=!1;continue}l||o.push(c)}return o.join(`
`)}(lo,"RT_TEXTURE_TILES"),this._tilesData=!1,this._tilesOn=!1,this.material=new dt({name:"rt:gi-reservoir",glslVersion:Ct,vertexShader:Ey,fragmentShader:lo,uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uAttrStatic:{value:null},uAttrDynamic:{value:null},uMaterialsTex:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevGWorldPos:{value:null},uPrevResPos:{value:null},uPrevResRad:{value:null},uPrevViewProj:{value:new fe},uLightPosType:{value:[]},uLightColorRadius:{value:[]},uLightDirCone:{value:[]},uLightCount:{value:0},uEmissiveCount:{value:0},uEmissiveCDF:{value:!0},uCameraPos:{value:new P},uFrame:{value:0},uEps:{value:.001},uFireflyClamp:{value:4},uMCap:{value:20},uSpatialTaps:{value:2},uValidateInterval:{value:8},uResolveAlpha:{value:.15},uConfLow:{value:.3},uChromaMean:{value:!0},uVisFallback:{value:!0},uEnvColor:{value:new de(.03,.04,.06)},uEnvIntensity:{value:1},uSkyEnabled:{value:!1},uSunDir:{value:new P(.4,.8,.45).normalize()},uSunColor:{value:new de(1,.9,.75)},uSkyZenith:{value:new de(.18,.34,.62)},uSkyHorizon:{value:new de(.7,.8,.9)},uSkyIntensity:{value:1},uHasTextureTiles:{value:!1}},depthTest:!1,depthWrite:!1}),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=ts(e,t,3,{minFilter:Ve,magFilter:Ve,format:Ye,type:Mt,depthBuffer:!1,stencilBuffer:!1});for(const n of i.texture)n.generateMipmaps=!1;return i}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uAttrStatic.value=e.staticAttrTex,t.uAttrDynamic.value=e.dynamicAttrTex,t.uMaterialsTex.value=e.materialsTex,t.uLightPosType.value=e.lightPosType,t.uLightColorRadius.value=e.lightColorRadius,t.uLightDirCone.value=e.lightDirCone,t.uLightCount.value=e.lightCount,t.uEmissiveCount.value=e.emissiveTriCount,this._tilesData=!!e.hasTextureTiles,this._tileSize=e._tileSize||128,this._applyTilesSplice()}setEmissiveCount(e){this.material.uniforms.uEmissiveCount.value=e}setTextureTiles(e){this._tilesOn=!!e,this._applyTilesSplice()}_applyTilesSplice(){const e=!!(this._tilesOn&&this._tilesData);let t=e?this._fragTiles:this._fragNoTiles;e&&this._tileSize!==128&&(t=t.replace("#define TILE 128.0",`#define TILE ${this._tileSize}.0`)),this.material.uniforms.uHasTextureTiles.value=e,this.material.fragmentShader!==t&&(this.material.fragmentShader=t,this.material.needsUpdate=!0)}clearHistory(e){const t=e.getRenderTarget();e.setClearColor(0,0);for(const i of[this.targetA,this.targetB])e.setRenderTarget(i),e.clear(!0,!1,!1);e.setRenderTarget(t)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,i,n,r,a,o){const l=this.material.uniforms;l.uGWorldPos.value=t.worldPos,l.uGNormalMetal.value=t.normalMetal,l.uPrevGWorldPos.value=t.prevWorldPos,l.uPrevResPos.value=this.targetB.texture[0],l.uPrevResRad.value=this.targetB.texture[1],l.uPrevViewProj.value.copy(i),l.uCameraPos.value.copy(n),l.uFrame.value=r,l.uEps.value=a,l.uFireflyClamp.value=o.fireflyClamp,l.uMCap.value=o.mCap,l.uSpatialTaps.value=o.spatialTaps,l.uValidateInterval.value=o.validateInterval,l.uResolveAlpha.value=o.resolveAlpha??.15,l.uConfLow.value=o.confLow??.3,l.uChromaMean.value=o.chromaMean!==!1,l.uVisFallback.value=o.visFallback!==!1,l.uEmissiveCDF.value=o.emissiveCDF,l.uEnvColor.value.copy(o.envColor),l.uEnvIntensity.value=o.envIntensity,l.uSkyEnabled.value=o.skyEnabled,l.uSunDir.value.copy(o.sunDir),l.uSunColor.value.copy(o.sunColor),l.uSkyZenith.value.copy(o.skyZenith),l.uSkyHorizon.value.copy(o.skyHorizon),l.uSkyIntensity.value=o.skyIntensity,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const c=this.targetA;return[this.targetA,this.targetB]=[this.targetB,this.targetA],c.texture[2]}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const Ry=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Py=`
precision highp float;
layout(location = 0) out vec4 outColor;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uCountClamp;
void main() {
  vec4 c = texture(uTex, vUv);
  if (uCountClamp >= 0.0) c.a = min(c.a, uCountClamp);
  outColor = c;
}
`;class Cy{constructor(){this.material=new dt({name:"rt:history-carry",glslVersion:Ct,vertexShader:Ry,fragmentShader:Py,uniforms:{uTex:{value:null},uCountClamp:{value:-1}},depthTest:!1,depthWrite:!1}),this.scene=new bi,this.camera=new ri(-1,1,1,-1,0,1),this.quad=new pt(new $t(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}blit(e,t,i,n=-1){this.material.uniforms.uTex.value=t,this.material.uniforms.uCountClamp.value=n;const r=e.getRenderTarget();e.setRenderTarget(i),e.render(this.scene,this.camera),e.setRenderTarget(r)}dispose(){this.material.dispose(),this.quad.geometry.dispose()}}function yu(s,e){let t=1,i=0,n=s;for(;n>0;)t/=e,i+=t*(n%e),n=Math.floor(n/e);return i}class Ke{static isSupported(e){try{const t=e.getContext();if(typeof WebGL2RenderingContext>"u"||!(t instanceof WebGL2RenderingContext)||!t.getExtension("EXT_color_buffer_float"))return!1;const i=t.getExtension("WEBGL_debug_renderer_info");if(i){const n=String(t.getParameter(i.UNMASKED_RENDERER_WEBGL)||"");if(/swiftshader|llvmpipe|software/i.test(n))return!1}return!0}catch{return!1}}static detectTier(e){if(e&&!Ke.isSupported(e))return"none";const t=typeof navigator<"u"?navigator:{};return(t.maxTouchPoints??0)>1||/Android|iPhone|iPad|Mobile/i.test(t.userAgent||"")?"mid":"high"}static recommendedOptions(e){return e==="none"?{}:e==="mid"?{renderScale:.375,...Ke._qualityFor(.375),adaptiveQuality:!0}:{renderScale:.5,denoiseIterations:3,stochasticLights:!1,adaptiveQuality:!0}}static async probeGPUTier(e){const i={},n=typeof window<"u"&&window.devicePixelRatio||1,r=typeof window<"u"&&window.screen?window.screen:{width:1920,height:1080},a=Math.round(r.width*r.height*Math.min(n,2)),o=a>=6e6;if(i.screenPixels=a,i.demanding=o,typeof navigator<"u"&&navigator.gpu)try{const c=await navigator.gpu.requestAdapter();if(c){const u=c.limits||{},d=Number(u.maxBufferSize||0),h=Number(u.maxStorageBufferBindingSize||0),f=Number(u.maxTextureDimension2D||0),g=Number(u.maxComputeWorkgroupStorageSize||0);Object.assign(i,{maxBufferSize:d,maxStorageBufferBindingSize:h,maxTextureDimension2D:f,maxComputeWorkgroupStorageSize:g});let x={};try{x=c.info||(c.requestAdapterInfo?await c.requestAdapterInfo():{})||{}}catch{x={}}i.vendor=x.vendor||null,i.architecture=x.architecture||null,i.description=x.description||null;const m=`${x.vendor||""} ${x.architecture||""} ${x.description||""} ${x.device||""}`.toLowerCase();if(/swiftshader|llvmpipe|software|basic render|microsoft basic|paravirtual/.test(m))return i.reason="software renderer signature in adapter.info",{tier:"none",source:"webgpu",details:i};const p=d>=2*1073741824&&f>=16384,y=d>=4*1073741824;let v;return p&&(!o||y)?(v="high",i.reason=o&&y?"strong limits + >=4GiB buffer clears 4K-class screen demand -> high":"large buffer + textures -> high"):p&&o?(v="mid",i.reason="strong limits but 4K-class screen without a >=4GiB buffer budget -> mid"):(v="mid",i.reason="modest adapter limits -> mid"),{tier:v,source:"webgpu",details:i}}i.reason="navigator.gpu present but requestAdapter returned no adapter"}catch(c){i.error=String(c&&c.message||c)}else i.reason="no navigator.gpu (WebGPU unavailable)";return{tier:Ke.detectTier(e),source:e?"webgl":"fallback",details:i}}static _mixedMrtSupported(e){try{const t=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,t);const i=o=>{const l=e.createTexture();return e.bindTexture(e.TEXTURE_2D,l),e.texStorage2D(e.TEXTURE_2D,1,o,4,4),l},n=i(e.RGBA16F),r=i(e.RGBA32F);e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,r,0),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]);const a=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.deleteFramebuffer(t),e.deleteTexture(n),e.deleteTexture(r),e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),a}catch{return!1}}static _specMrtSupported(e){let t,i,n,r,a,o,l;const c=e.getRenderTarget();try{t=ts(2,2,2,{format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1});for(const h of t.texture)h.generateMipmaps=!1;i=new It(2,2,{depthBuffer:!1,stencilBuffer:!1});const u="out vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";n=new dt({glslVersion:Ct,vertexShader:u,fragmentShader:`precision highp float;
layout(location = 0) out vec4 o0; layout(location = 1) out vec4 o1;
void main(){ o0 = vec4(0.5, 0.25, 0.75, 1.0); o1 = vec4(0.125); }`,depthTest:!1,depthWrite:!1}),r=new dt({glslVersion:Ct,vertexShader:u,fragmentShader:`precision highp float; in vec2 vUv; out vec4 outColor;
uniform sampler2D uTex; void main(){ outColor = texture(uTex, vUv); }`,uniforms:{uTex:{value:t.texture[0]}},depthTest:!1,depthWrite:!1}),o=new bi,l=new ri(-1,1,1,-1,0,1),a=new pt(new $t(2,2),n),a.frustumCulled=!1,o.add(a),e.setRenderTarget(t),e.render(o,l),a.material=r,e.setRenderTarget(i),e.render(o,l);const d=new Uint8Array(4);return e.readRenderTargetPixels(i,0,0,1,1,d),Math.abs(d[0]-128)<24&&Math.abs(d[1]-64)<24}catch{return!1}finally{e.setRenderTarget(c),a&&a.geometry.dispose(),n&&n.dispose(),r&&r.dispose(),t&&t.dispose(),i&&i.dispose()}}static GOVERNOR_MAX_DENOISE=3;static _qualityFor(e){return{denoiseIterations:e>.45?2:Ke.GOVERNOR_MAX_DENOISE,stochasticLights:e<=.55}}static CANVAS_LEVELS=[1,.85,.75,.62,.5];static HISTORY_CARRY_FRAMES=8;static DIAG_MIN_FRAMES=8;static DIAG_STABLE_FRAMES=4;static DIAG_WINDOW_FRAMES=45;static STALE_CHECK_FRAMES=30;static MAX_STALE_WARNINGS=8;static GOVERNOR_WARMUP_FRAMES=60;static MAX_SCALE_STEP=.25;static PRESETS={quality:{renderScale:.75,denoiseIterations:2,maxHistory:256,taa:!0,restir:!0,giHalfRate:!1,specular:!0},balanced:{renderScale:.5,denoiseIterations:2,maxHistory:48,taa:!0,restir:!0,giHalfRate:!1,specular:!0,volumetric:{enabled:!1},stochasticLights:!0,fireflyClamp:4},performance:{renderScale:.375,denoiseIterations:3,giHalfRate:!0,volumetric:{enabled:!1},stochasticLights:!0},motion:{maxHistory:32,fireflyClamp:2.5,taa:!0,restir:!0}};constructor(e,t={}){if(this.renderer=e,this.supported=Ke.isSupported(e),!this.supported){console.warn("three-realtime-rt: ray tracing unavailable on this system (needs WebGL2 + EXT_color_buffer_float on a hardware GPU). Falling back to plain three.js rendering."),this.compiled=null,this.frame=0,this.compileError=null,this.status={ok:!1,disabled:[],coreFailure:null,warnings:[]},this._diagDone=!0;return}if(t.preset!==void 0){const a=t.preset;if(typeof a!="string"||!Object.prototype.hasOwnProperty.call(Ke.PRESETS,a))throw new Error(`three-realtime-rt: unknown preset "${a}". Valid presets: ${Object.keys(Ke.PRESETS).join(", ")}.`);t={...Ke.PRESETS[a],...t}}const i=e.getSize(new ce),n=e.getPixelRatio();this._canvasW=Math.floor(i.x*n),this._canvasH=Math.floor(i.y*n),this._overscan=Math.min(.25,Math.max(0,t.overscan??0)),this._renderScale=t.renderScale??.5,this._width=Math.round(this._canvasW*this._padFactor),this._height=Math.round(this._canvasH*this._padFactor),this._crop=new We(1,1,0,0),this._updateCrop();const r=Ke._mixedMrtSupported(e.getContext());r||console.info("three-realtime-rt: mixed fp16/fp32 G-buffer not supported here — using fp32 for all targets."),this.specMRTSupported=Ke._specMrtSupported(e),this._splitAccum=t.splitAccum??!0,this.specMRTSupported||console.info("three-realtime-rt: multi-attachment lighting buffer failed the draw probe here (WebKit/iOS) — specular buffer disabled, alpha-blend surfaces render opaque."),this._maxFragTexUnits=e.getContext().getParameter(e.getContext().MAX_TEXTURE_IMAGE_UNITS),this._volumeUnitWarned=!1,this.gbuffer=new ay(this._width,this._height,{mixedPrecision:r}),this.rtPass=new ly(this._scaledW,this._scaledH,{specMRT:this.specMRTSupported}),this.denoisePass=new mu(this._scaledW,this._scaledH),this.specDenoisePass=new mu(this._scaledW,this._scaledH,{blendIsSpec:!0}),this.accumulatePass=new fy(this._scaledW,this._scaledH),this.composite=new gy,this.taaPass=new yy(this._width,this._height),this._sceneColor=this._makeColorTarget(this._width,this._height),this._copyPass=new Cy,this.compiled=null,this.frame=0,this.outputMode=0,this.costScale=t.costScale??1/96,this.envColor=t.envColor??new de(.03,.04,.06),this.envIntensity=t.envIntensity??1,this.eps=t.eps??.001,this._autoEps=t.eps==null,this.temporalReprojection=t.temporalReprojection??!0,this.maxHistory=t.maxHistory??48,this.motionAdaptive=t.motionAdaptive??!1,this.maxHistoryMoving=t.maxHistoryMoving??6,this.lightAdaptive=t.lightAdaptive??!0,this.lightMotionRef=t.lightMotionRef??.01,this.lightMotionDecay=t.lightMotionDecay??.72,this.lightGradK=t.lightGradK??3,this.glassClampScale=t.glassClampScale??4,this.lightMotion=0,this._lightSig=null,this._mt=0,this.taaBlendMoving=t.taaBlendMoving??.4,this.restirMCap=t.restirMCap??16,this.restirMCapMoving=t.restirMCapMoving??this.restirMCap,this.motionRefUv=t.motionRefUv??.015,this.motion=0,this._vpNow=new fe,this._vpPrevUnjittered=new fe,this._motionValid=!1,this._mv=[new P,new P,new P,new P,new P,new P],this._mq=new yi,this.denoiseMaxStep=t.denoiseMaxStep??0,this.denoiseStepJitter=t.denoiseStepJitter??0,this.denoiseWideDamp=t.denoiseWideDamp??0,this.fireflyClamp=t.fireflyClamp??4,this.gi=t.gi??!0,this.giHalfRate=t.giHalfRate??!1,this.emissiveNEE=t.emissiveNEE??!0,this.emissiveImportance=t.emissiveImportance??!0,this.specular=t.specular??!0,this.reflections=t.reflections??!0,this.refraction=t.refraction??!0,this.transparency=t.transparency??!0,this._absorptionShadows=t.absorptionShadows??!0,this._kmScattering=t.kmScattering??!1,this._textureTiles=t.textureTiles??!1,this.ior=t.ior??1.5,this.dispersion=t.dispersion??0,this.stochasticLights=t.stochasticLights??!0,this.adaptiveQuality=t.adaptiveQuality??!0,this.targetFps=t.targetFps??55,this.overloadProtection=t.overloadProtection??!0,this._overloadStrikes=0,this._obLastT=null,this._qEma=null,this._qLastT=null,this._qLastChange=0,this._qSamples=0,this._qLastDir=0,this._qOscillating=!1,this._qFreeWins=null,this._qFastStreak=0,this._presetName=t.preset!==void 0?String(t.preset):"custom",this.canvasScaleHook=t.canvasScaleHook??null,this._canvasLevelIdx=0,this.denoise=t.denoise??!0,this.denoiseIterations=t.denoiseIterations??2,this.taa=t.taa??!0,this.taaBlend=t.taaBlend??.1,this.taaJitterScale=t.taaJitterScale??1,this.volumetric={enabled:t.volumetric?.enabled??!1,density:t.volumetric?.density??.015,maxDist:t.volumetric?.maxDist??40,zones:t.volumetric?.zones??[]},this.volumetricPass=new Sy(this._volW,this._volH),this.restir=t.restir??!0,this.restirPass=new Ty(this._scaledW,this._scaledH),this.restirGI=t.restirGI??!1,this.restirGIMCap=t.restirGIMCap??20,this.restirGISpatialTaps=t.restirGISpatialTaps??2,this.restirGIValidate=t.restirGIValidate??8,this.restirGIResolveAlpha=t.restirGIResolveAlpha??1,this.restirGIConfLow=t.restirGIConfLow??.3,this.restirGIChromaMean=t.restirGIChromaMean??!0,this.restirGIVisFallback=t.restirGIVisFallback??!0,this.giReservoirPass=new Ay(this._scaledW,this._scaledH),this._giMissWarned=!1,this.fog={enabled:t.fog?.enabled??!1,color:t.fog?.color??new de(.5,.6,.7),density:t.fog?.density??.05},this.sky={enabled:t.sky?.enabled??!1,sunDir:t.sky?.sunDir??new P(.4,.8,.45).normalize(),sunColor:t.sky?.sunColor??new de(1,.9,.75),zenith:t.sky?.zenith??new de(.18,.34,.62),horizon:t.sky?.horizon??new de(.7,.8,.9),intensity:t.sky?.intensity??1},this._invViewProj=new fe,this._jitterIndex=0,this._jitteredViewProj=new fe,this._jitterUv=new ce,this._prevJitterUv=new ce,this._prevViewProj=new fe,this._camWorldPos=new P,this._needsClear=!0,this.overloadProtection&&this._width*this._height>32e5&&this._renderScale>.375&&(console.warn(`three-realtime-rt: ${(this._width*this._height/1e6).toFixed(1)}M-pixel drawing buffer — clamping lighting renderScale to 0.375 (overloadProtection). Raise renderScale manually, enable adaptiveQuality, or pass overloadProtection: false to opt out.`),this._renderScale=.375),this.compileError=null,this.status={ok:!0,disabled:[],coreFailure:null,warnings:[]},this._diagDone=!1,this._diagFrames=0,this._diagStable=0,this._diagSig="",this._diagHandled=new Set,this._compileErrSev=-1,this._staleDone=!1,this._staleWarnings=0,this._implicitCompileWarned=!1}get preset(){return this._presetName}applyPreset(e){const t=Ke.PRESETS[e];if(!t)throw new Error(`three-realtime-rt: unknown preset "${e}". Valid presets: ${Object.keys(Ke.PRESETS).join(", ")}.`);for(const i of Object.keys(t)){const n=t[i];n!==null&&typeof n=="object"&&!Array.isArray(n)&&this[i]&&typeof this[i]=="object"?Object.assign(this[i],n):this[i]=n}return this._presetName=e,this._rearmGovernor(),this}_rearmGovernor(){this._qEma=null,this._qLastT=null,this._qLastChange=0,this._qLastDir=0,this._qOscillating=!1,this._qFastStreak=0,this._qFreeWins=null,this.adaptiveQuality&&console.info(`three-realtime-rt: preset "${this._presetName}" applied  -  adaptive quality re-armed at this baseline.`)}_passClass(e){switch(e){case"rt:gbuffer":case"rt:lighting":case"rt:composite":return{core:!0};case"rt:restir-temporal":case"rt:restir-spatial":return{feature:"restir",disable:()=>{this.restir=!1}};case"rt:gi-reservoir":return{feature:"restirGI",disable:()=>{this.restirGI=!1}};case"rt:denoise":return{feature:"denoise",disable:()=>{this.denoise=!1}};case"rt:volumetric":return{feature:"volumetric",disable:()=>{this.volumetric.enabled=!1}};case"rt:taa":case"rt:taa-copy":return{feature:"taa",disable:()=>{this.taa=!1}};case"rt:specular":return{feature:"specular",disable:()=>{this.specular=!1}};default:return{aux:!0}}}_diagLog(e){return([e&&e.fragmentShader&&e.fragmentShader.log,e&&e.vertexShader&&e.vertexShader.log,e&&e.programLog].find(i=>i&&i.trim())||"(no driver log)").trim().split(`
`)[0].slice(0,200)}_noteCompileError(e,t){t>this._compileErrSev&&(this.compileError=e,this._compileErrSev=t)}_handleFailedProgram(e,t){const i=this._diagLog(t),n=this._passClass(e),r=`${e}: ${i}`;this.status.ok=!1,n.core?(this.status.coreFailure||(this.status.coreFailure=r),this._noteCompileError(r,2),console.warn(`three-realtime-rt: core pass ${e} failed to link — the image will be black (no fallback for a core pass). Driver log: ${i}`)):n.feature?(n.disable(),this.status.disabled.push({pass:e,feature:n.feature,reason:i}),this._noteCompileError(r,1),console.warn(`three-realtime-rt: pass ${e} failed to link — auto-disabled "${n.feature}" to keep the image lit. Driver log: ${i}`)):(this._noteCompileError(r,0),console.warn(`three-realtime-rt: auxiliary pass ${e} failed to link (non-fatal — resize history is not carried). Driver log: ${i}`))}_scanPrograms(){if(this._diagDone)return;const e=this.renderer.info&&this.renderer.info.programs;if(!e){this._diagDone=!0;return}this._diagFrames++;let t="";for(const i of e){const n=i&&i.name;if(!n||n.slice(0,3)!=="rt:")continue;t+=n+"|";const r=i.diagnostics;r&&r.runnable===!1&&!this._diagHandled.has(n)&&(this._diagHandled.add(n),this._handleFailedProgram(n,r))}t===this._diagSig?this._diagStable++:(this._diagStable=0,this._diagSig=t),(this._diagFrames>=Ke.DIAG_MIN_FRAMES&&this._diagStable>=Ke.DIAG_STABLE_FRAMES||this._diagFrames>=Ke.DIAG_WINDOW_FRAMES)&&(this._diagDone=!0)}_overloadBrake(){if(typeof document<"u"&&document.visibilityState==="hidden"){this._obLastT=null;return}const e=performance.now(),t=this._obLastT==null?null:e-this._obLastT;this._obLastT=e,t!=null&&(t>400&&t<1e4?this._overloadStrikes++:t<200&&(this._overloadStrikes=0),!(this._overloadStrikes<3)&&(this._overloadStrikes=0,this._renderScale>.2?(this.denoiseIterations=Math.min(this.denoiseIterations,3),this.stochasticLights=!0,this.renderScale=Math.max(.2,Math.round(this._renderScale*.5*20)/20),console.warn(`three-realtime-rt: frames exceeding 400ms — overload brake cut lighting to ${Math.round(this._renderScale*100)}%. Lower your canvas resolution or enable adaptiveQuality.`)):(this.volumetric.enabled||this.reflections||this.refraction)&&(this.volumetric.enabled=!1,this.reflections=!1,this.refraction=!1,console.warn("three-realtime-rt: still overloaded at minimum lighting scale — disabling volumetric/reflections/refraction."))))}_warn(e,t){console.warn(t),this._recordWarning(e,t)}_recordWarning(e,t){const i=this.status&&this.status.warnings;if(i){for(let n=0;n<i.length;n++)if(i[n].code===e&&i[n].message===t)return;i.push({code:e,message:t})}}_absorbCompilerWarnings(e){const t=e&&e.warnings;if(!(!t||t.length===0))for(let i=0;i<t.length;i++)this._recordWarning(t[i].code,t[i].message)}_checkStale(){if(this._staleDone)return;const e=this.compiled&&this.compiled.staticSources;if(!e||e.length===0){this._staleDone=!0;return}let t=0;for(let i=0;i<e.length;i++){const n=e[i];if(n.warned)continue;const r=n.ref.deref();if(!r){n.warned=!0;continue}let a=null;const o=r.geometry,l=o?o.getAttribute("position"):null;if(!l||l.version!==n.version)a="geometry";else{const c=r.matrixWorld.elements,u=n.matrix;for(let d=0;d<16;d++){const h=c[d]-u[d];if((h<0?-h:h)>1e-6*(1+(u[d]<0?-u[d]:u[d]))){a="transform";break}}}if(!a){t++;continue}if(n.warned=!0,this._staleWarnings++,a==="geometry"?this._warn("stale-geometry",`three-realtime-rt: position buffer of ${n.name} changed after compileScene() but it is not a dynamic mesh — traced lighting still uses the ORIGINAL shape. Add it to compileScene(scene, {dynamicMeshes:[...]}) and set mesh.userData.rtDeforming = true, then call updateDynamic() each frame.`):this._warn("stale-transform",`three-realtime-rt: ${n.name} was moved after compileScene() but it is not a dynamic mesh — traced lighting still uses the ORIGINAL transform (its shadow stays behind). Recompile with compileScene(scene), or declare it in compileScene(scene, {dynamicMeshes:[...]}) and call updateDynamic() each frame.`),this._staleWarnings>=Ke.MAX_STALE_WARNINGS){this._staleDone=!0;return}}t===0&&(this._staleDone=!0)}_makeColorTarget(e,t){const i=new It(e,t,{minFilter:Xe,magFilter:Xe,format:Ye,type:Pt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}compileScene(e,t){if(!this.supported)return null;const i=t?.textureTiles!==void 0?t:{...t,textureTiles:this._textureTiles};let n;try{n=ny(e,i)}catch(r){if(/no meshes found/.test(String(r&&r.message)))return this._emptyWarned||(console.warn("three-realtime-rt: compileScene() called on a scene with no traceable meshes — keeping the current scene. Until meshes are added and recompiled, render() falls back to plain rasterization (no crash, no black)."),this._emptyWarned=!0),this.compiled;throw r}return this.compiled&&this.compiled.dispose(),this.compiled=n,this._absorbCompilerWarnings(n),this._staleDone=!1,this.compiled.emissiveTriCount>0&&this.emissiveNEE&&!this.restir&&console.info("[three-realtime-rt] this scene has emissive area lights but restir is off — emissive NEE alone is the noisiest sampling path; enable restir for a large noise win."),this._autoEps&&(this.eps=Math.min(Math.max(.001,this.compiled.sceneDiagonal*.0012),.05)),this.rtPass.setAbsorptionShadows(this._absorptionShadows),this.rtPass.setKmScattering(this._kmScattering),this.rtPass.setTextureTiles(this._textureTiles),this.giReservoirPass.setTextureTiles(this._textureTiles),this.rtPass.setCompiledScene(this.compiled),this.volumetricPass.setCompiledScene(this.compiled),this.restirPass.setCompiledScene(this.compiled),this.giReservoirPass.setCompiledScene(this.compiled),this._syncVolumeAlbedo(),this.resetAccumulation(),this.compiled}_syncVolumeAlbedo(){const e=this.compiled?this.compiled.volumeAlbedo:null;this.gbuffer.setVolume(!!e);const t=!!e&&this._maxFragTexUnits>=17;this.rtPass.setVolumeAlbedo(t?e:null),e&&!t&&!this._volumeUnitWarned&&(this._volumeUnitWarned=!0,console.info(`[three-realtime-rt] volume albedo: this GPU exposes only ${this._maxFragTexUnits} fragment texture units (< 17 needed for the traced-bounce sampler), so GI / reflection bounces use the material's flat base colour. Primary visibility still shows the full 3D-texture field.`))}updateDynamic(){this.compiled&&this.compiled.updateDynamic()}updateLights(e){!this.supported||!this.compiled||(bh(e,this.compiled),this._measureLightMotion(),this.rtPass.setTextureTiles(this._textureTiles),this.giReservoirPass.setTextureTiles(this._textureTiles),this.rtPass.setCompiledScene(this.compiled),this.volumetricPass.setCompiledScene(this.compiled),this.restirPass.setCompiledScene(this.compiled),this.giReservoirPass.setCompiledScene(this.compiled))}resetAccumulation(){this.supported&&(this._needsClear=!0,this.taaPass&&this.taaPass.reset())}_measureLightMotion(){const e=this.compiled;if(!e)return;const t=e.lightPosType,i=e.lightColorRadius,n=e.lightDirCone,r=this._lightSig;if(this._lightSig={pos:Float32Array.from(t),col:Float32Array.from(i),dir:Float32Array.from(n)},!this.lightAdaptive){this.lightMotion=0;return}if(!r||r.pos.length!==t.length||r.dir.length!==n.length){r&&(this.lightMotion=1);return}const a=e.sceneDiagonal>0?e.sceneDiagonal:1;let o=0;for(let l=0;l<t.length;l+=4){const c=t[l]-r.pos[l],u=t[l+1]-r.pos[l+1],d=t[l+2]-r.pos[l+2],h=Math.abs(t[l+3]-r.pos[l+3]),f=Math.sqrt(c*c+u*u+d*d)/a;o=Math.max(o,f/this.lightMotionRef,h);const g=n[l]-r.dir[l],x=n[l+1]-r.dir[l+1],m=n[l+2]-r.dir[l+2],p=Math.sqrt(g*g+x*x+m*m)*.5,y=Math.abs(n[l+3]-r.dir[l+3]);o=Math.max(o,p/this.lightMotionRef,y);for(let v=0;v<3;v++){const _=i[l+v],T=r.col[l+v],M=Math.max(Math.abs(_),Math.abs(T),1e-4);o=Math.max(o,Math.abs(_-T)/M)}}this.lightMotion=Math.max(this.lightMotion,Math.min(1,o))}_temporalMotion(){const e=this.motionAdaptive?this.motion:0;return Math.max(e,this.lightAdaptive?this.lightMotion:0)}get _padFactor(){return 1+2*this._overscan}_updateCrop(){this._crop.set(this._canvasW/this._width,this._canvasH/this._height,(this._width-this._canvasW)*.5/this._width,(this._height-this._canvasH)*.5/this._height)}get _scaledW(){return Math.max(1,Math.floor(this._width*this._renderScale))}get _scaledH(){return Math.max(1,Math.floor(this._height*this._renderScale))}get _volW(){return Math.max(1,this._width>>2)}get _volH(){return Math.max(1,this._height>>2)}get absorptionShadows(){return this._absorptionShadows}set absorptionShadows(e){const t=!!e;t!==this._absorptionShadows&&(this._absorptionShadows=t,this.supported&&(this.rtPass.setAbsorptionShadows(t),this.resetAccumulation()))}get kmScattering(){return this._kmScattering}set kmScattering(e){const t=!!e;t!==this._kmScattering&&(this._kmScattering=t,this.supported&&(this.rtPass.setKmScattering(t),this.resetAccumulation()))}get textureTiles(){return this._textureTiles}set textureTiles(e){this._textureTiles=e!==!1?e&&typeof e=="object"?e:{size:128,max:16}:!1}get renderScale(){return this._renderScale}set renderScale(e){this._renderScale=e,this.setSize(this._canvasW,this._canvasH)}get overscan(){return this._overscan}set overscan(e){const t=Math.min(.25,Math.max(0,e||0));t!==this._overscan&&(this._overscan=t,this.setSize(this._canvasW,this._canvasH),this.resetAccumulation())}setSize(e,t){if(!this.supported)return;this._canvasW=Math.floor(e),this._canvasH=Math.floor(t),this._width=Math.round(this._canvasW*this._padFactor),this._height=Math.round(this._canvasH*this._padFactor),this._updateCrop();const i=this._scaledW,n=this._scaledH,r=this.rtPass.targetA.width!==i||this.rtPass.targetA.height!==n,a=this.taaPass.targetA.width!==this._width||this.taaPass.targetA.height!==this._height;r&&(this.rtPass.resizeCarry(this.renderer,this._copyPass,i,n,Ke.HISTORY_CARRY_FRAMES),this.denoisePass.setSize(i,n),this.specDenoisePass.setSize(i,n),this.accumulatePass.setSize(i,n),this.restirPass.setSize(i,n),this.restirPass.clearHistory(this.renderer),this.giReservoirPass.setSize(i,n),this.giReservoirPass.clearHistory(this.renderer)),a&&(this.gbuffer.setSize(this._width,this._height),this.volumetricPass.setSize(this._volW,this._volH),this.volumetricPass.clearHistory(this.renderer),this.taaPass.resizeCarry(this.renderer,this._copyPass,this._width,this._height),this._sceneColor.setSize(this._width,this._height))}_takeFreeWins(e){if(this._qFreeWins)return!1;const t={scale:this._renderScale};let i=!1;return this.gi&&!this.giHalfRate&&(t.giHalfRate=!1,this.giHalfRate=!0,i=!0),this.gi&&this.denoise&&this.denoiseIterations>0&&!this.restirGI&&(t.restirGI=!1,this.restirGI=!0,i=!0,this.denoiseIterations>Ke.GOVERNOR_MAX_DENOISE&&(t.denoiseIterations=this.denoiseIterations,this.denoiseIterations=Ke.GOVERNOR_MAX_DENOISE)),this.restirMCap>16&&(t.restirMCap=this.restirMCap,this.restirMCap=16,i=!0),this._qFreeWins=t,i?(this._recordChange(-1,e),this._qEma=null,console.info("three-realtime-rt: adaptive quality → free wins first ("+Object.keys(t).filter(n=>n!=="scale").join(", ")+"), resolution untouched"),!0):!1}_releaseFreeWins(e){const t=this._qFreeWins;if(!t)return!1;this._qFreeWins=null;const i=Object.keys(t).filter(n=>n!=="scale");if(!i.length)return!1;for(const n of i)this[n]=t[n];return this._recordChange(1,e),this._qEma=null,console.info(`three-realtime-rt: adaptive quality → returned ${i.join(", ")}`),!0}_adaptQuality(){if(typeof document<"u"&&document.visibilityState==="hidden"){this._qLastT=null;return}const e=performance.now(),t=this._qLastT==null?null:e-this._qLastT;if(this._qLastT=e,t==null||t>2e3||(this._qEma=this._qEma==null?t:this._qEma*.9+t*.1,this._qSamples=(this._qSamples||0)+1,this._qSamples<Ke.GOVERNOR_WARMUP_FRAMES))return;const i=this._qOscillating?5e3:2e3;if(e-this._qLastChange<i)return;const n=this._qEma/(1e3/this.targetFps),r=this._qOscillating?.6:.8,a=this._qOscillating?1.24:1.12;if(n<a&&n>r||n>a&&this._takeFreeWins(e))return;let o=this._renderScale*Math.pow(1/n,.35);const l=Ke.MAX_SCALE_STEP;if(o=Math.min(this._renderScale+l,Math.max(this._renderScale-l,o)),o=Math.round(Math.min(1,Math.max(.2,o))*20)/20,n<r&&this.canvasScaleHook&&this._canvasLevelIdx>0){this._canvasLevelIdx--,this.canvasScaleHook(Ke.CANVAS_LEVELS[this._canvasLevelIdx]),this._recordChange(1,e),this._qEma=null,console.info(`three-realtime-rt: adaptive quality → ${Math.round(Ke.CANVAS_LEVELS[this._canvasLevelIdx]*100)}% canvas`);return}if(n>a&&o<=.2&&this._renderScale<=.2&&this.canvasScaleHook&&this._canvasLevelIdx<Ke.CANVAS_LEVELS.length-1){this._canvasLevelIdx++,this.canvasScaleHook(Ke.CANVAS_LEVELS[this._canvasLevelIdx]),this._recordChange(-1,e),this._qEma=null,console.info(`three-realtime-rt: adaptive quality → ${Math.round(Ke.CANVAS_LEVELS[this._canvasLevelIdx]*100)}% canvas`);return}if(n<r?this._qFastStreak=(this._qFastStreak||0)+1:this._qFastStreak=0,n<.5&&this._qFastStreak>=2&&this._qFreeWins&&this._canvasLevelIdx===0&&this._renderScale>=1&&this._releaseFreeWins(e)||Math.abs(o-this._renderScale)<.045)return;const c=Math.sign(o-this._renderScale),u=Ke._qualityFor(o);this.denoiseIterations=u.denoiseIterations,this.stochasticLights=u.stochasticLights,this.renderScale=o,this._recordChange(c,e),this._qEma=null,console.info(`three-realtime-rt: adaptive quality → ${Math.round(o*100)}% lighting, ${u.denoiseIterations} denoise passes, ${u.stochasticLights?"stochastic":"full"} direct light`)}_updateMotion(e){if(this._vpNow.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),!this._motionValid){this._vpPrevUnjittered.copy(this._vpNow),this._motionValid=!0,this.motion=0;return}const[t,i,n,r,a,o]=this._mv;e.getWorldPosition(t),e.getWorldQuaternion(this._mq),i.set(0,0,-1).applyQuaternion(this._mq),n.set(1,0,0).applyQuaternion(this._mq),r.set(0,1,0).applyQuaternion(this._mq);const l=this.compiled?Math.max(this.compiled.sceneDiagonal*.35,.001):10;let c=0;for(let u=0;u<4;u++){const d=u&1?.3:-.3,h=u&2?.3:-.3;a.copy(t).addScaledVector(i,l).addScaledVector(n,d*l).addScaledVector(r,h*l),o.copy(a).applyMatrix4(this._vpPrevUnjittered),a.applyMatrix4(this._vpNow);const f=a.x-o.x,g=a.y-o.y,x=Number.isFinite(f)&&Number.isFinite(g)?Math.hypot(f,g)*.5:1;x>c&&(c=x)}this.motion=Math.min(1,c/Math.max(1e-6,this.motionRefUv)),this._vpPrevUnjittered.copy(this._vpNow)}_recordChange(e,t){this._qOscillating=e!==0&&this._qLastDir!==0&&e!==this._qLastDir,e!==0&&(this._qLastDir=e),this._qLastChange=t}render(e,t){if(!this.supported){this.renderer.render(e,t);return}if(this.adaptiveQuality&&this._adaptQuality(),this.overloadProtection&&this._overloadBrake(),this.compiled||(this.compileScene(e),this.compiled&&!this._implicitCompileWarned&&(this._implicitCompileWarned=!0,this._warn("implicit-compile","three-realtime-rt: render() compiled the scene implicitly (no compileScene() call), so it was compiled with NO options — every mesh is static and updateDynamic() has nothing to update. Call compileScene(scene, options) yourself (e.g. {dynamicMeshes:[...]}) before the first render() if anything moves."))),!this.compiled){this.renderer.render(e,t);return}this.frame+=1,this.frame%Ke.STALE_CHECK_FRAMES===0&&this._checkStale(),t.updateMatrixWorld();const i=t.projectionMatrix,n=i.elements[0],r=i.elements[5],a=i.elements[8],o=i.elements[9];if(this._updateMotion(t),this._overscan>0){const T=1/this._padFactor;i.elements[0]*=T,i.elements[5]*=T}if(this.taa&&this.outputMode===0){this._jitterIndex=(this._jitterIndex+1)%16;const T=this.taaJitterScale,M=(yu(this._jitterIndex+1,2)-.5)*2*T/this._width,w=(yu(this._jitterIndex+1,3)-.5)*2*T/this._height;i.elements[8]+=M,i.elements[9]+=w,this._jitterUv.set(-M*.5,-w*.5)}else this._jitterUv.set(0,0);this._jitteredViewProj.copy(i).multiply(t.matrixWorldInverse);const l=this.renderer.autoClear;this.renderer.autoClear=!1,this._needsClear&&(this.rtPass.clearHistory(this.renderer),this.accumulatePass.clearHistory(this.renderer),this.volumetricPass.clearHistory(this.renderer),this.restirPass.clearHistory(this.renderer),this.giReservoirPass.clearHistory(this.renderer),this._needsClear=!1),this.gbuffer.render(this.renderer,e,t);const c=this.rtPass.material.uniforms;c.uEnvColor.value.copy(this.envColor),c.uEnvIntensity.value=this.envIntensity,c.uEps.value=this.eps,c.uCostView.value=this.outputMode===7,c.uCostScale.value=this.costScale,c.uTemporalReprojection.value=this.temporalReprojection;const u=this._temporalMotion();this._mt=u,this.lightMotion*=this.lightMotionDecay,this.lightMotion<.001&&(this.lightMotion=0),c.uMaxHistory.value=this.maxHistory+(this.maxHistoryMoving-this.maxHistory)*u,c.uFireflyClamp.value=this.fireflyClamp>0?this.fireflyClamp:1e6,c.uGlassClampScale.value=this.glassClampScale,c.uGIEnabled.value=this.gi,c.uGIHalfRate.value=this.giHalfRate;const d=this.restirGI&&this.gi&&this.denoise&&this.denoiseIterations>0;c.uExternalGI.value=d,this.restirGI&&this.gi&&!d&&!this._giMissWarned&&(console.info("[three-realtime-rt] restirGI is on but denoise is off — ReSTIR GI is injected during the à-trous denoise, so enable denoise (denoiseIterations >= 1) to see its contribution."),this._giMissWarned=!0),d&&(this._giMissWarned=!1),c.uEmissiveCount.value=this.emissiveNEE?this.compiled.emissiveTriCount:0,c.uEmissiveCDF.value=this.emissiveImportance,c.uReflEnabled.value=this.reflections,c.uRefrEnabled.value=this.refraction,c.uBlendEnabled.value=this.transparency,c.uIor.value=this.ior,c.uDispersion.value=Math.min(.5,Math.max(0,this.dispersion)),c.uLightStochastic.value=this.stochasticLights,c.uSkyEnabled.value=this.sky.enabled,c.uSunDir.value.copy(this.sky.sunDir),c.uSunColor.value.copy(this.sky.sunColor),c.uSkyZenith.value.copy(this.sky.zenith),c.uSkyHorizon.value.copy(this.sky.horizon),c.uSkyIntensity.value=this.sky.intensity,c.uPrevViewProj.value.copy(this._prevViewProj),c.uViewProj.value.copy(this._jitteredViewProj),c.uCameraPos.value.copy(t.getWorldPosition(this._camWorldPos));let h=null;this.restir&&(this.restirPass.setEmissiveCount(this.emissiveNEE?this.compiled.emissiveTriCount:0),h=this.restirPass.render(this.renderer,this.gbuffer,this._prevViewProj,this._camWorldPos,this.frame,this.eps,this.restirMCap+(this.restirMCapMoving-this.restirMCap)*u));let f=null;d&&(this.giReservoirPass.setEmissiveCount(this.emissiveNEE?this.compiled.emissiveTriCount:0),f=this.giReservoirPass.render(this.renderer,this.gbuffer,this._prevViewProj,this._camWorldPos,this.frame,this.eps,{fireflyClamp:this.fireflyClamp>0?this.fireflyClamp:1e6,mCap:this.restirGIMCap,spatialTaps:Math.max(0,Math.min(4,this.restirGISpatialTaps|0)),validateInterval:Math.max(0,this.restirGIValidate|0),resolveAlpha:Math.min(1,Math.max(.01,this.restirGIResolveAlpha)),confLow:Math.min(1,Math.max(0,this.restirGIConfLow)),chromaMean:this.restirGIChromaMean,visFallback:this.restirGIVisFallback,emissiveCDF:this.emissiveImportance,envColor:this.envColor,envIntensity:this.envIntensity,skyEnabled:this.sky.enabled,sunDir:this.sky.sunDir,sunColor:this.sky.sunColor,skyZenith:this.sky.zenith,skyHorizon:this.sky.horizon,skyIntensity:this.sky.intensity}));let g,x;if(this.specMRTSupported&&this._splitAccum){const T=this.rtPass.renderRaw(this.renderer,this.gbuffer,this.frame,h),M=this.accumulatePass.render(this.renderer,T.rawIrradiance,T.rawSpecular,this.gbuffer,this._prevViewProj,this._jitteredViewProj,this._camWorldPos,this.eps,this.maxHistory+(this.maxHistoryMoving-this.maxHistory)*this._mt,{preFireflyClamp:0,historyClampK:0,lightMotion:this.lightAdaptive?this.lightMotion:0,gradK:this.lightGradK});g=M.irradiance,x=M.specular,this._momentsTex=M.moments}else({irradiance:g,specular:x}=this.rtPass.render(this.renderer,this.gbuffer,this.frame,h)),this._momentsTex=null;this.denoise&&this.denoiseIterations>0&&this.outputMode!==7&&(g=this.denoisePass.render(this.renderer,g,this.gbuffer,this._camWorldPos,this.eps,this.denoiseIterations,f,{maxStep:this.denoiseMaxStep,stepJitter:this.denoiseStepJitter,wideDamp:this.denoiseWideDamp,frame:this.frame,momentsTexture:null}));let m=this.specular?x:null;m&&this.denoise&&this.denoiseIterations>0&&(m=this.specDenoisePass.render(this.renderer,m,this.gbuffer,this._camWorldPos,this.eps,Math.min(this.denoiseIterations,2)));let p=null;const y=this.volumetric.zones&&this.volumetric.zones.length>0;this.volumetric.enabled&&this.outputMode===0&&(this.volumetric.density>0||y)&&(p=this.volumetricPass.render(this.renderer,this.gbuffer,this._prevViewProj,this._camWorldPos,this.frame,this.eps,this.volumetric.density,this.volumetric.maxDist,this.volumetric.zones));const v=this.taa&&this.outputMode===0,_=this.composite.material.uniforms;_.uOutputMode.value=this.outputMode,_.uUpsample.value=this._renderScale<1,_.uIrrTexelSize.value.set(1/this._scaledW,1/this._scaledH),_.uCameraPos.value.copy(this._camWorldPos),_.uFogEnabled.value=this.fog.enabled,_.uFogColor.value.copy(this.fog.color),_.uFogDensity.value=this.fog.density,_.uSkyEnabled.value=this.sky.enabled,_.uInvViewProj.value.copy(this._invViewProj.copy(this._jitteredViewProj).invert()),_.uSunDir.value.copy(this.sky.sunDir),_.uSunColor.value.copy(this.sky.sunColor),_.uSkyZenith.value.copy(this.sky.zenith),_.uSkyHorizon.value.copy(this.sky.horizon),_.uSkyIntensity.value=this.sky.intensity,_.uVolumetric.value=p,_.uVolEnabled.value=p!==null,_.uVolTexelSize.value.set(1/this._volW,1/this._volH),this.composite.render(this.renderer,g,this.gbuffer,e.background,v?this._sceneColor:null,m,v?null:this._crop),v?this.taaPass.render(this.renderer,this._sceneColor.texture,this.gbuffer,this._prevViewProj,this._jitterUv,this._prevJitterUv,this.taaBlend+(this.taaBlendMoving-this.taaBlend)*u,null,this._crop):this.taa&&this.taaPass.reset(),this.renderer.autoClear=l,i.elements[0]=n,i.elements[5]=r,i.elements[8]=a,i.elements[9]=o,this._prevViewProj.copy(this._jitteredViewProj),this._prevJitterUv.copy(this._jitterUv),this._diagDone||this._scanPrograms()}dispose(){this.supported&&(this.gbuffer.dispose(),this.rtPass.dispose(),this.denoisePass.dispose(),this.specDenoisePass.dispose(),this.composite.dispose(),this.taaPass.dispose(),this.volumetricPass.dispose(),this.restirPass.dispose(),this.giReservoirPass.dispose(),this._sceneColor.dispose(),this._copyPass.dispose(),this.compiled&&this.compiled.dispose())}}export{Wc as $,rd as A,Ds as B,de as C,qy as D,ta as E,Vy as F,ar as G,Ny as H,nh as I,Qv as J,eh as K,Ps as L,pt as M,qi as N,n0 as O,Yt as P,yi as Q,Ke as R,bi as S,rh as T,ui as U,P as V,Yv as W,We as X,vi as Y,th as Z,Yy as _,$t as a,Ky as a0,Dc as a1,ht as a2,Hy as a3,jy as a4,Jv as a5,da as a6,cd as a7,hl as a8,Ve as a9,cn as aA,Iy as aB,Ly as aC,Zy as aD,ea as aE,Li as aF,mo as aa,s0 as ab,Yi as ac,ku as ad,je as ae,Uy as af,Jy as ag,By as ah,Oy as ai,ky as aj,ri as ak,$u as al,e0 as am,Or as an,kr as ao,qr as ap,Ut as aq,jr as ar,Kr as as,Ns as at,Qe as au,si as av,na as aw,_i as ax,yd as ay,Bl as az,r0 as b,Xy as c,Gy as d,wt as e,ih as f,Do as g,Dy as h,Wy as i,sh as j,Ch as k,ce as l,Ls as m,Ye as n,po as o,Xe as p,zy as q,Et as r,Us as s,di as t,Tt as u,st as v,Fu as w,At as x,Fy as y,fe as z};
