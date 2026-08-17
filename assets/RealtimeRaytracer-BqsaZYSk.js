/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fo="160",ix={ROTATE:0,DOLLY:1,PAN:2},nx={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Uh=0,ol=1,Fh=2,Tu=1,Bh=2,Ci=3,ti=0,Ht=1,_i=2,qi=0,Yn=1,ll=2,cl=3,ul=4,Oh=5,on=100,kh=101,zh=102,hl=103,dl=104,Gh=200,Hh=201,Vh=202,Wh=203,fo=204,po=205,Xh=206,qh=207,Kh=208,jh=209,Yh=210,Zh=211,Jh=212,Qh=213,$h=214,ed=0,td=1,id=2,zr=3,nd=4,sd=5,rd=6,ad=7,Eu=0,od=1,ld=2,Ki=0,cd=1,ud=2,hd=3,dd=4,fd=5,pd=6,fl="attached",md="detached",Au=300,Qn=301,$n=302,mo=303,go=304,$r=306,vo=1e3,Ct=1001,_o=1002,ze=1003,pl=1004,ga=1005,Ke=1006,gd=1007,Cs=1008,hi=1009,yo=1010,Ru=1011,ea=1012,Ts=1013,Qt=1014,pt=1015,Et=1016,Pu=1017,Cu=1018,cn=1020,vd=1021,Xe=1023,_d=1024,yd=1025,un=1026,es=1027,Lu=1028,Bo=1029,ta=1030,ia=1031,Ls=1033,va=33776,_a=33777,ya=33778,xa=33779,ml=35840,gl=35841,vl=35842,_l=35843,Iu=36196,yl=37492,xl=37496,bl=37808,Sl=37809,wl=37810,Ml=37811,Tl=37812,El=37813,Al=37814,Rl=37815,Pl=37816,Cl=37817,Ll=37818,Il=37819,Dl=37820,Nl=37821,ba=36492,Ul=36494,Fl=36495,xd=36283,Bl=36284,Ol=36285,kl=36286,bd=2200,Sd=2201,wd=2202,Gr=2300,Hr=2301,Sa=2302,Wn=2400,Xn=2401,Vr=2402,Oo=2500,Md=2501,Td=0,Ed=1,zl=2,Du=3e3,hn=3001,Ad=3200,Rd=3201,Nu=0,Pd=1,Xt="",Pt="srgb",fi="srgb-linear",ko="display-p3",na="display-p3-linear",Wr="linear",nt="srgb",Xr="rec709",qr="p3",fn=7680,Gl=519,Cd=512,Ld=513,Id=514,Uu=515,Dd=516,Nd=517,Ud=518,Fd=519,xo=35044,vt="300 es",bo=1035,Di=2e3,Kr=2001;class dn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const n=this._listeners[e];if(n!==void 0){const r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Hl=1234567;const Es=Math.PI/180,ts=180/Math.PI;function di(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Dt[s&255]+Dt[s>>8&255]+Dt[s>>16&255]+Dt[s>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]).toLowerCase()}function yt(s,e,t){return Math.max(e,Math.min(t,s))}function zo(s,e){return(s%e+e)%e}function Bd(s,e,t,i,n){return i+(s-e)*(n-i)/(t-e)}function Od(s,e,t){return s!==e?(t-s)/(e-s):0}function As(s,e,t){return(1-t)*s+t*e}function kd(s,e,t,i){return As(s,e,1-Math.exp(-t*i))}function zd(s,e=1){return e-Math.abs(zo(s,e*2)-e)}function Gd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Hd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Vd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Wd(s,e){return s+Math.random()*(e-s)}function Xd(s){return s*(.5-Math.random())}function qd(s){s!==void 0&&(Hl=s);let e=Hl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Kd(s){return s*Es}function jd(s){return s*ts}function So(s){return(s&s-1)===0&&s!==0}function Yd(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function jr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Zd(s,e,t,i,n){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),u=a((e+i)/2),h=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),v=a((i-e)/2);switch(n){case"XYX":s.set(o*u,l*h,l*d,o*c);break;case"YZY":s.set(l*d,o*u,l*h,o*c);break;case"ZXZ":s.set(l*h,l*d,o*u,o*c);break;case"XZX":s.set(o*u,l*v,l*f,o*c);break;case"YXY":s.set(l*f,o*u,l*v,o*c);break;case"ZYZ":s.set(l*v,l*f,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function yi(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Je(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const sx={DEG2RAD:Es,RAD2DEG:ts,generateUUID:di,clamp:yt,euclideanModulo:zo,mapLinear:Bd,inverseLerp:Od,lerp:As,damp:kd,pingpong:zd,smoothstep:Gd,smootherstep:Hd,randInt:Vd,randFloat:Wd,randFloatSpread:Xd,seededRandom:qd,degToRad:Kd,radToDeg:jd,isPowerOfTwo:So,ceilPowerOfTwo:Yd,floorPowerOfTwo:jr,setQuaternionFromProperEuler:Zd,normalize:Je,denormalize:yi};class le{constructor(e=0,t=0){le.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*n+e.x,this.y=r*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class De{constructor(e,t,i,n,r,a,o,l,c){De.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c)}set(e,t,i,n,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=n,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],v=i[8],_=n[0],m=n[3],p=n[6],y=n[1],g=n[4],x=n[7],S=n[2],b=n[5],T=n[8];return r[0]=a*_+o*y+l*S,r[3]=a*m+o*g+l*b,r[6]=a*p+o*x+l*T,r[1]=c*_+u*y+h*S,r[4]=c*m+u*g+h*b,r[7]=c*p+u*x+h*T,r[2]=d*_+f*y+v*S,r[5]=d*m+f*g+v*b,r[8]=d*p+f*x+v*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+n*r*c-n*a*l}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*r,f=c*r-a*l,v=t*h+i*d+n*f;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/v;return e[0]=h*_,e[1]=(n*c-u*i)*_,e[2]=(o*i-n*a)*_,e[3]=d*_,e[4]=(u*t-n*l)*_,e[5]=(n*r-o*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(wa.makeScale(e,t)),this}rotate(e){return this.premultiply(wa.makeRotation(-e)),this}translate(e,t){return this.premultiply(wa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const wa=new De;function Fu(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Is(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Jd(){const s=Is("canvas");return s.style.display="block",s}const Vl={};function Rs(s){s in Vl||(Vl[s]=!0,console.warn(s))}const Wl=new De().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Xl=new De().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Gs={[fi]:{transfer:Wr,primaries:Xr,toReference:s=>s,fromReference:s=>s},[Pt]:{transfer:nt,primaries:Xr,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[na]:{transfer:Wr,primaries:qr,toReference:s=>s.applyMatrix3(Xl),fromReference:s=>s.applyMatrix3(Wl)},[ko]:{transfer:nt,primaries:qr,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Xl),fromReference:s=>s.applyMatrix3(Wl).convertLinearToSRGB()}},Qd=new Set([fi,na]),Qe={enabled:!0,_workingColorSpace:fi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Qd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const i=Gs[e].toReference,n=Gs[t].fromReference;return n(i(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return Gs[s].primaries},getTransfer:function(s){return s===Xt?Wr:Gs[s].transfer}};function Zn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ma(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let pn;class Bu{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{pn===void 0&&(pn=Is("canvas")),pn.width=e.width,pn.height=e.height;const i=pn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=pn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Is("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=Zn(r[a]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Zn(t[i]/255)*255):t[i]=Zn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $d=0;class Ou{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=di(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(Ta(n[a].image)):r.push(Ta(n[a]))}else r=Ta(n);i.url=r}return t||(e.images[this.uuid]=i),i}}function Ta(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Bu.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ef=0;class Ut extends dn{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,i=Ct,n=Ct,r=Ke,a=Cs,o=Xe,l=hi,c=Ut.DEFAULT_ANISOTROPY,u=Xt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ef++}),this.uuid=di(),this.name="",this.source=new Ou(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(Rs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===hn?Pt:Xt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Au)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case vo:e.x=e.x-Math.floor(e.x);break;case Ct:e.x=e.x<0?0:1;break;case _o:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case vo:e.y=e.y-Math.floor(e.y);break;case Ct:e.y=e.y<0?0:1;break;case _o:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Rs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Pt?hn:Du}set encoding(e){Rs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===hn?Pt:Xt}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=Au;Ut.DEFAULT_ANISOTROPY=1;class qe{constructor(e=0,t=0,i=0,n=1){qe.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,r;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],v=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(v-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(v+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const g=(c+1)/2,x=(f+1)/2,S=(p+1)/2,b=(u+d)/4,T=(h+_)/4,C=(v+m)/4;return g>x&&g>S?g<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(g),n=b/i,r=T/i):x>S?x<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(x),i=b/n,r=C/n):S<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(S),i=T/r,n=C/r),this.set(i,n,r,t),this}let y=Math.sqrt((m-v)*(m-v)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(m-v)/y,this.y=(h-_)/y,this.z=(d-u)/y,this.w=Math.acos((c+f+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tf extends dn{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new qe(0,0,e,t),this.scissorTest=!1,this.viewport=new qe(0,0,e,t);const n={width:e,height:t,depth:1};i.encoding!==void 0&&(Rs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===hn?Pt:Xt),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ke,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Ut(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Ou(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xt extends tf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class ku extends Ut{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=ze,this.minFilter=ze,this.wrapR=Ct,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zu extends Ut{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=ze,this.minFilter=ze,this.wrapR=Ct,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ql extends xt{constructor(e=1,t=1,i=1,n={}){super(e,t,n),this.isWebGLMultipleRenderTargets=!0;const r=this.texture;this.texture=[];for(let a=0;a<i;a++)this.texture[a]=r.clone(),this.texture[a].isRenderTargetTexture=!0}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,r=this.texture.length;n<r;n++)this.texture[n].image.width=e,this.texture[n].image.height=t,this.texture[n].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}copy(e){this.dispose(),this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.texture.length=0;for(let t=0,i=e.texture.length;t<i;t++)this.texture[t]=e.texture[t].clone(),this.texture[t].isRenderTargetTexture=!0;return this}}class xi{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,r,a,o){let l=i[n+0],c=i[n+1],u=i[n+2],h=i[n+3];const d=r[a+0],f=r[a+1],v=r[a+2],_=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=v,e[t+3]=_;return}if(h!==_||l!==d||c!==f||u!==v){let m=1-o;const p=l*d+c*f+u*v+h*_,y=p>=0?1:-1,g=1-p*p;if(g>Number.EPSILON){const S=Math.sqrt(g),b=Math.atan2(S,p*y);m=Math.sin(m*b)/S,o=Math.sin(o*b)/S}const x=o*y;if(l=l*m+d*x,c=c*m+f*x,u=u*m+v*x,h=h*m+_*x,m===1-o){const S=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=S,c*=S,u*=S,h*=S}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,n,r,a){const o=i[n],l=i[n+1],c=i[n+2],u=i[n+3],h=r[a],d=r[a+1],f=r[a+2],v=r[a+3];return e[t]=o*v+u*h+l*f-c*d,e[t+1]=l*v+u*d+c*h-o*f,e[t+2]=c*v+u*f+o*d-l*h,e[t+3]=u*v-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(n/2),h=o(r/2),d=l(i/2),f=l(n/2),v=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*f*v,this._y=c*f*h-d*u*v,this._z=c*u*v+d*f*h,this._w=c*u*h-d*f*v;break;case"YXZ":this._x=d*u*h+c*f*v,this._y=c*f*h-d*u*v,this._z=c*u*v-d*f*h,this._w=c*u*h+d*f*v;break;case"ZXY":this._x=d*u*h-c*f*v,this._y=c*f*h+d*u*v,this._z=c*u*v+d*f*h,this._w=c*u*h-d*f*v;break;case"ZYX":this._x=d*u*h-c*f*v,this._y=c*f*h+d*u*v,this._z=c*u*v-d*f*h,this._w=c*u*h+d*f*v;break;case"YZX":this._x=d*u*h+c*f*v,this._y=c*f*h+d*u*v,this._z=c*u*v-d*f*h,this._w=c*u*h-d*f*v;break;case"XZY":this._x=d*u*h-c*f*v,this._y=c*f*h-d*u*v,this._z=c*u*v+d*f*h,this._w=c*u*h+d*f*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-n)*f}else if(i>o&&i>h){const f=2*Math.sqrt(1+i-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(n+a)/f,this._z=(r+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-i-h);this._w=(r-c)/f,this._x=(n+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-o);this._w=(a-n)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+n*c-r*l,this._y=n*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-n*o,this._w=a*u-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,n=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+n*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*i+t*this._x,this._y=f*n+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*h+this._w*d,this._x=i*h+this._x*d,this._y=n*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),n=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(n),i*Math.sin(r),i*Math.cos(r),t*Math.sin(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Kl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Kl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*n,this.y=r[1]*t+r[4]*i+r[7]*n,this.z=r[2]*t+r[5]*i+r[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),u=2*(o*t-r*n),h=2*(r*i-a*t);return this.x=t+l*c+a*h-o*u,this.y=i+l*u+o*c-r*h,this.z=n+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n,this.y=r[1]*t+r[5]*i+r[9]*n,this.z=r[2]*t+r[6]*i+r[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ea.copy(this).projectOnVector(e),this.sub(Ea)}reflect(e){return this.sub(Ea.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ea=new P,Kl=new xi;class At{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(oi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(oi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=oi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,oi):oi.fromBufferAttribute(r,a),oi.applyMatrix4(e.matrixWorld),this.expandByPoint(oi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Hs.copy(i.boundingBox)),Hs.applyMatrix4(e.matrixWorld),this.union(Hs)}const n=e.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,oi),oi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ls),Vs.subVectors(this.max,ls),mn.subVectors(e.a,ls),gn.subVectors(e.b,ls),vn.subVectors(e.c,ls),Bi.subVectors(gn,mn),Oi.subVectors(vn,gn),tn.subVectors(mn,vn);let t=[0,-Bi.z,Bi.y,0,-Oi.z,Oi.y,0,-tn.z,tn.y,Bi.z,0,-Bi.x,Oi.z,0,-Oi.x,tn.z,0,-tn.x,-Bi.y,Bi.x,0,-Oi.y,Oi.x,0,-tn.y,tn.x,0];return!Aa(t,mn,gn,vn,Vs)||(t=[1,0,0,0,1,0,0,0,1],!Aa(t,mn,gn,vn,Vs))?!1:(Ws.crossVectors(Bi,Oi),t=[Ws.x,Ws.y,Ws.z],Aa(t,mn,gn,vn,Vs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,oi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(oi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Mi=[new P,new P,new P,new P,new P,new P,new P,new P],oi=new P,Hs=new At,mn=new P,gn=new P,vn=new P,Bi=new P,Oi=new P,tn=new P,ls=new P,Vs=new P,Ws=new P,nn=new P;function Aa(s,e,t,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){nn.fromArray(s,r);const o=n.x*Math.abs(nn.x)+n.y*Math.abs(nn.y)+n.z*Math.abs(nn.z),l=e.dot(nn),c=t.dot(nn),u=i.dot(nn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const nf=new At,cs=new P,Ra=new P;class bi{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):nf.setFromPoints(e).getCenter(i);let n=0;for(let r=0,a=e.length;r<a;r++)n=Math.max(n,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;cs.subVectors(e,this.center);const t=cs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(cs,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ra.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(cs.copy(e.center).add(Ra)),this.expandByPoint(cs.copy(e.center).sub(Ra))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ti=new P,Pa=new P,Xs=new P,ki=new P,Ca=new P,qs=new P,La=new P;class sa{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ti)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ti.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ti.copy(this.origin).addScaledVector(this.direction,t),Ti.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Pa.copy(e).add(t).multiplyScalar(.5),Xs.copy(t).sub(e).normalize(),ki.copy(this.origin).sub(Pa);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Xs),o=ki.dot(this.direction),l=-ki.dot(Xs),c=ki.lengthSq(),u=Math.abs(1-a*a);let h,d,f,v;if(u>0)if(h=a*l-o,d=a*o-l,v=r*u,h>=0)if(d>=-v)if(d<=v){const _=1/u;h*=_,d*=_,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-v?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=v?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),n&&n.copy(Pa).addScaledVector(Xs,d),f}intersectSphere(e,t){Ti.subVectors(e.center,this.origin);const i=Ti.dot(this.direction),n=Ti.dot(Ti)-i*i,r=e.radius*e.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,n=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,n=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,Ti)!==null}intersectTriangle(e,t,i,n,r){Ca.subVectors(t,e),qs.subVectors(i,e),La.crossVectors(Ca,qs);let a=this.direction.dot(La),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ki.subVectors(this.origin,e);const l=o*this.direction.dot(qs.crossVectors(ki,qs));if(l<0)return null;const c=o*this.direction.dot(Ca.cross(ki));if(c<0||l+c>a)return null;const u=-o*ki.dot(La);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class he{constructor(e,t,i,n,r,a,o,l,c,u,h,d,f,v,_,m){he.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c,u,h,d,f,v,_,m)}set(e,t,i,n,r,a,o,l,c,u,h,d,f,v,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=n,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=v,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new he().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,n=1/_n.setFromMatrixColumn(e,0).length(),r=1/_n.setFromMatrixColumn(e,1).length(),a=1/_n.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=a*u,f=a*h,v=o*u,_=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+v*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=v+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,v=c*u,_=c*h;t[0]=d+_*o,t[4]=v*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-v,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,v=c*u,_=c*h;t[0]=d-_*o,t[4]=-a*h,t[8]=v+f*o,t[1]=f+v*o,t[5]=a*u,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,v=o*u,_=o*h;t[0]=l*u,t[4]=v*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-v,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,v=o*l,_=o*c;t[0]=l*u,t[4]=_-d*h,t[8]=v*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+v,t[10]=d-_*h}else if(e.order==="XZY"){const d=a*l,f=a*c,v=o*l,_=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=a*u,t[9]=f*h-v,t[2]=v*h-f,t[6]=o*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sf,e,rf)}lookAt(e,t,i){const n=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),zi.crossVectors(i,Yt),zi.lengthSq()===0&&(Math.abs(i.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),zi.crossVectors(i,Yt)),zi.normalize(),Ks.crossVectors(Yt,zi),n[0]=zi.x,n[4]=Ks.x,n[8]=Yt.x,n[1]=zi.y,n[5]=Ks.y,n[9]=Yt.y,n[2]=zi.z,n[6]=Ks.z,n[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],v=i[2],_=i[6],m=i[10],p=i[14],y=i[3],g=i[7],x=i[11],S=i[15],b=n[0],T=n[4],C=n[8],w=n[12],M=n[1],D=n[5],A=n[9],N=n[13],I=n[2],U=n[6],B=n[10],K=n[14],k=n[3],X=n[7],j=n[11],Y=n[15];return r[0]=a*b+o*M+l*I+c*k,r[4]=a*T+o*D+l*U+c*X,r[8]=a*C+o*A+l*B+c*j,r[12]=a*w+o*N+l*K+c*Y,r[1]=u*b+h*M+d*I+f*k,r[5]=u*T+h*D+d*U+f*X,r[9]=u*C+h*A+d*B+f*j,r[13]=u*w+h*N+d*K+f*Y,r[2]=v*b+_*M+m*I+p*k,r[6]=v*T+_*D+m*U+p*X,r[10]=v*C+_*A+m*B+p*j,r[14]=v*w+_*N+m*K+p*Y,r[3]=y*b+g*M+x*I+S*k,r[7]=y*T+g*D+x*U+S*X,r[11]=y*C+g*A+x*B+S*j,r[15]=y*w+g*N+x*K+S*Y,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],v=e[3],_=e[7],m=e[11],p=e[15];return v*(+r*l*h-n*c*h-r*o*d+i*c*d+n*o*f-i*l*f)+_*(+t*l*f-t*c*d+r*a*d-n*a*f+n*c*u-r*l*u)+m*(+t*c*h-t*o*f-r*a*h+i*a*f+r*o*u-i*c*u)+p*(-n*o*u-t*l*h+t*o*d+n*a*h-i*a*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],v=e[12],_=e[13],m=e[14],p=e[15],y=h*m*c-_*d*c+_*l*f-o*m*f-h*l*p+o*d*p,g=v*d*c-u*m*c-v*l*f+a*m*f+u*l*p-a*d*p,x=u*_*c-v*h*c+v*o*f-a*_*f-u*o*p+a*h*p,S=v*h*l-u*_*l-v*o*d+a*_*d+u*o*m-a*h*m,b=t*y+i*g+n*x+r*S;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/b;return e[0]=y*T,e[1]=(_*d*r-h*m*r-_*n*f+i*m*f+h*n*p-i*d*p)*T,e[2]=(o*m*r-_*l*r+_*n*c-i*m*c-o*n*p+i*l*p)*T,e[3]=(h*l*r-o*d*r-h*n*c+i*d*c+o*n*f-i*l*f)*T,e[4]=g*T,e[5]=(u*m*r-v*d*r+v*n*f-t*m*f-u*n*p+t*d*p)*T,e[6]=(v*l*r-a*m*r-v*n*c+t*m*c+a*n*p-t*l*p)*T,e[7]=(a*d*r-u*l*r+u*n*c-t*d*c-a*n*f+t*l*f)*T,e[8]=x*T,e[9]=(v*h*r-u*_*r-v*i*f+t*_*f+u*i*p-t*h*p)*T,e[10]=(a*_*r-v*o*r+v*i*c-t*_*c-a*i*p+t*o*p)*T,e[11]=(u*o*r-a*h*r-u*i*c+t*h*c+a*i*f-t*o*f)*T,e[12]=S*T,e[13]=(u*_*n-v*h*n+v*i*d-t*_*d-u*i*m+t*h*m)*T,e[14]=(v*o*n-a*_*n-v*i*l+t*_*l+a*i*m-t*o*m)*T,e[15]=(a*h*n-u*o*n+u*i*l-t*h*l-a*i*d+t*o*d)*T,this}scale(e){const t=this.elements,i=e.x,n=e.y,r=e.z;return t[0]*=i,t[4]*=n,t[8]*=r,t[1]*=i,t[5]*=n,t[9]*=r,t[2]*=i,t[6]*=n,t[10]*=r,t[3]*=i,t[7]*=n,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,u*o+i,u*l-n*a,0,c*l-n*o,u*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,r,a){return this.set(1,i,r,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,v=r*h,_=a*u,m=a*h,p=o*h,y=l*c,g=l*u,x=l*h,S=i.x,b=i.y,T=i.z;return n[0]=(1-(_+p))*S,n[1]=(f+x)*S,n[2]=(v-g)*S,n[3]=0,n[4]=(f-x)*b,n[5]=(1-(d+p))*b,n[6]=(m+y)*b,n[7]=0,n[8]=(v+g)*T,n[9]=(m-y)*T,n[10]=(1-(d+_))*T,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;let r=_n.set(n[0],n[1],n[2]).length();const a=_n.set(n[4],n[5],n[6]).length(),o=_n.set(n[8],n[9],n[10]).length();this.determinant()<0&&(r=-r),e.x=n[12],e.y=n[13],e.z=n[14],li.copy(this);const c=1/r,u=1/a,h=1/o;return li.elements[0]*=c,li.elements[1]*=c,li.elements[2]*=c,li.elements[4]*=u,li.elements[5]*=u,li.elements[6]*=u,li.elements[8]*=h,li.elements[9]*=h,li.elements[10]*=h,t.setFromRotationMatrix(li),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,n,r,a,o=Di){const l=this.elements,c=2*r/(t-e),u=2*r/(i-n),h=(t+e)/(t-e),d=(i+n)/(i-n);let f,v;if(o===Di)f=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Kr)f=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,n,r,a,o=Di){const l=this.elements,c=1/(t-e),u=1/(i-n),h=1/(a-r),d=(t+e)*c,f=(i+n)*u;let v,_;if(o===Di)v=(a+r)*h,_=-2*h;else if(o===Kr)v=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const _n=new P,li=new he,sf=new P(0,0,0),rf=new P(1,1,1),zi=new P,Ks=new P,Yt=new P,jl=new he,Yl=new xi;class ra{constructor(e=0,t=0,i=0,n=ra.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],u=n[9],h=n[2],d=n[6],f=n[10];switch(t){case"XYZ":this._y=Math.asin(yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-yt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(yt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-yt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(yt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return jl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(jl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yl.setFromEuler(this),this.setFromQuaternion(Yl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ra.DEFAULT_ORDER="XYZ";class Gu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let af=0;const Zl=new P,yn=new xi,Ei=new he,js=new P,us=new P,of=new P,lf=new xi,Jl=new P(1,0,0),Ql=new P(0,1,0),$l=new P(0,0,1),cf={type:"added"},uf={type:"removed"};class rt extends dn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=rt.DEFAULT_UP.clone();const e=new P,t=new ra,i=new xi,n=new P(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new he},normalMatrix:{value:new De}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yn.setFromAxisAngle(e,t),this.quaternion.multiply(yn),this}rotateOnWorldAxis(e,t){return yn.setFromAxisAngle(e,t),this.quaternion.premultiply(yn),this}rotateX(e){return this.rotateOnAxis(Jl,e)}rotateY(e){return this.rotateOnAxis(Ql,e)}rotateZ(e){return this.rotateOnAxis($l,e)}translateOnAxis(e,t){return Zl.copy(e).applyQuaternion(this.quaternion),this.position.add(Zl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jl,e)}translateY(e){return this.translateOnAxis(Ql,e)}translateZ(e){return this.translateOnAxis($l,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?js.copy(e):js.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(us,js,this.up):Ei.lookAt(js,us,this.up),this.quaternion.setFromRotationMatrix(Ei),n&&(Ei.extractRotation(n.matrixWorld),yn.setFromRotationMatrix(Ei),this.quaternion.premultiply(yn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(cf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(uf)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ei),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,e,of),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,lf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++){const r=t[i];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const n=this.children;for(let r=0,a=n.length;r<a;r++){const o=n[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxGeometryCount=this._maxGeometryCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));n.material=o}else n.material=r(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),v=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),v.length>0&&(i.nodes=v)}return i.object=n,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}}rt.DEFAULT_UP=new P(0,1,0);rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ci=new P,Ai=new P,Ia=new P,Ri=new P,xn=new P,bn=new P,ec=new P,Da=new P,Na=new P,Ua=new P;let Ys=!1;class Lt{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),ci.subVectors(e,t),n.cross(ci);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(e,t,i,n,r){ci.subVectors(n,t),Ai.subVectors(i,t),Ia.subVectors(e,t);const a=ci.dot(ci),o=ci.dot(Ai),l=ci.dot(Ia),c=Ai.dot(Ai),u=Ai.dot(Ia),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,v=(a*u-o*l)*d;return r.set(1-f-v,v,f)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getUV(e,t,i,n,r,a,o,l){return Ys===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ys=!0),this.getInterpolation(e,t,i,n,r,a,o,l)}static getInterpolation(e,t,i,n,r,a,o,l){return this.getBarycoord(e,t,i,n,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ri.x),l.addScaledVector(a,Ri.y),l.addScaledVector(o,Ri.z),l)}static isFrontFacing(e,t,i,n){return ci.subVectors(i,t),Ai.subVectors(e,t),ci.cross(Ai).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ci.subVectors(this.c,this.b),Ai.subVectors(this.a,this.b),ci.cross(Ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Lt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Lt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,n,r){return Ys===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ys=!0),Lt.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}getInterpolation(e,t,i,n,r){return Lt.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}containsPoint(e){return Lt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Lt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,r=this.c;let a,o;xn.subVectors(n,i),bn.subVectors(r,i),Da.subVectors(e,i);const l=xn.dot(Da),c=bn.dot(Da);if(l<=0&&c<=0)return t.copy(i);Na.subVectors(e,n);const u=xn.dot(Na),h=bn.dot(Na);if(u>=0&&h<=u)return t.copy(n);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(xn,a);Ua.subVectors(e,r);const f=xn.dot(Ua),v=bn.dot(Ua);if(v>=0&&f<=v)return t.copy(r);const _=f*c-l*v;if(_<=0&&c>=0&&v<=0)return o=c/(c-v),t.copy(i).addScaledVector(bn,o);const m=u*v-f*h;if(m<=0&&h-u>=0&&f-v>=0)return ec.subVectors(r,n),o=(h-u)/(h-u+(f-v)),t.copy(n).addScaledVector(ec,o);const p=1/(m+_+d);return a=_*p,o=d*p,t.copy(i).addScaledVector(xn,a).addScaledVector(bn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Hu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function Fa(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ue{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,n=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.toWorkingColorSpace(this,n),this}setHSL(e,t,i,n=Qe.workingColorSpace){if(e=zo(e,1),t=yt(t,0,1),i=yt(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Fa(a,r,e+1/3),this.g=Fa(a,r,e),this.b=Fa(a,r,e-1/3)}return Qe.toWorkingColorSpace(this,n),this}setStyle(e,t=Pt){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pt){const i=Hu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}copyLinearToSRGB(e){return this.r=Ma(e.r),this.g=Ma(e.g),this.b=Ma(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pt){return Qe.fromWorkingColorSpace(Nt.copy(this),e),Math.round(yt(Nt.r*255,0,255))*65536+Math.round(yt(Nt.g*255,0,255))*256+Math.round(yt(Nt.b*255,0,255))}getHexString(e=Pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Nt.copy(this),t);const i=Nt.r,n=Nt.g,r=Nt.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(n-r)/h+(n<r?6:0);break;case n:l=(r-i)/h+2;break;case r:l=(i-n)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=Pt){Qe.fromWorkingColorSpace(Nt.copy(this),e);const t=Nt.r,i=Nt.g,n=Nt.b;return e!==Pt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(Gi),this.setHSL(Gi.h+e,Gi.s+t,Gi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Gi),e.getHSL(Zs);const i=As(Gi.h,Zs.h,t),n=As(Gi.s,Zs.s,t),r=As(Gi.l,Zs.l,t);return this.setHSL(i,n,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*n,this.g=r[1]*t+r[4]*i+r[7]*n,this.b=r[2]*t+r[5]*i+r[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new ue;ue.NAMES=Hu;let hf=0;class Qi extends dn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=di(),this.name="",this.type="Material",this.blending=Yn,this.side=ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fo,this.blendDst=po,this.blendEquation=on,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ue(0,0,0),this.blendAlpha=0,this.depthFunc=zr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fn,this.stencilZFail=fn,this.stencilZPass=fn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Yn&&(i.blending=this.blending),this.side!==ti&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==fo&&(i.blendSrc=this.blendSrc),this.blendDst!==po&&(i.blendDst=this.blendDst),this.blendEquation!==on&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==zr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=n(e.textures),a=n(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Go extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Eu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const gt=new P,Js=new le;class $e{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=xo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Js.fromBufferAttribute(this,t),Js.applyMatrix3(e),this.setXY(t,Js.x,Js.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=yi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Je(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=yi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=yi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=yi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=yi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array),r=Je(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xo&&(e.usage=this.usage),e}}class Vu extends $e{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Wu extends $e{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ot extends $e{constructor(e,t,i){super(new Float32Array(e),t,i)}}let df=0;const ni=new he,Ba=new rt,Sn=new P,Zt=new At,hs=new At,Tt=new P;class Rt extends dn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=di(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fu(e)?Wu:Vu)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new De().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ni.makeRotationFromQuaternion(e),this.applyMatrix4(ni),this}rotateX(e){return ni.makeRotationX(e),this.applyMatrix4(ni),this}rotateY(e){return ni.makeRotationY(e),this.applyMatrix4(ni),this}rotateZ(e){return ni.makeRotationZ(e),this.applyMatrix4(ni),this}translate(e,t,i){return ni.makeTranslation(e,t,i),this.applyMatrix4(ni),this}scale(e,t,i){return ni.makeScale(e,t,i),this.applyMatrix4(ni),this}lookAt(e){return Ba.lookAt(e),Ba.updateMatrix(),this.applyMatrix4(Ba.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Sn).negate(),this.translate(Sn.x,Sn.y,Sn.z),this}setFromPoints(e){const t=[];for(let i=0,n=e.length;i<n;i++){const r=e[i];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ot(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new At);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const r=t[i];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(Tt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Tt),Tt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Tt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];hs.setFromBufferAttribute(o),this.morphTargetsRelative?(Tt.addVectors(Zt.min,hs.min),Zt.expandByPoint(Tt),Tt.addVectors(Zt.max,hs.max),Zt.expandByPoint(Tt)):(Zt.expandByPoint(hs.min),Zt.expandByPoint(hs.max))}Zt.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)Tt.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(Tt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Tt.fromBufferAttribute(o,c),l&&(Sn.fromBufferAttribute(e,c),Tt.add(Sn)),n=Math.max(n,i.distanceToSquared(Tt))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,n=t.position.array,r=t.normal.array,a=t.uv.array,o=n.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $e(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let M=0;M<o;M++)c[M]=new P,u[M]=new P;const h=new P,d=new P,f=new P,v=new le,_=new le,m=new le,p=new P,y=new P;function g(M,D,A){h.fromArray(n,M*3),d.fromArray(n,D*3),f.fromArray(n,A*3),v.fromArray(a,M*2),_.fromArray(a,D*2),m.fromArray(a,A*2),d.sub(h),f.sub(h),_.sub(v),m.sub(v);const N=1/(_.x*m.y-m.x*_.y);isFinite(N)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-_.y).multiplyScalar(N),y.copy(f).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(N),c[M].add(p),c[D].add(p),c[A].add(p),u[M].add(y),u[D].add(y),u[A].add(y))}let x=this.groups;x.length===0&&(x=[{start:0,count:i.length}]);for(let M=0,D=x.length;M<D;++M){const A=x[M],N=A.start,I=A.count;for(let U=N,B=N+I;U<B;U+=3)g(i[U+0],i[U+1],i[U+2])}const S=new P,b=new P,T=new P,C=new P;function w(M){T.fromArray(r,M*3),C.copy(T);const D=c[M];S.copy(D),S.sub(T.multiplyScalar(T.dot(D))).normalize(),b.crossVectors(C,D);const N=b.dot(u[M])<0?-1:1;l[M*4]=S.x,l[M*4+1]=S.y,l[M*4+2]=S.z,l[M*4+3]=N}for(let M=0,D=x.length;M<D;++M){const A=x[M],N=A.start,I=A.count;for(let U=N,B=N+I;U<B;U+=3)w(i[U+0]),w(i[U+1]),w(i[U+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new $e(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const n=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,h=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){const v=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);n.fromBufferAttribute(t,v),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),u.subVectors(a,r),h.subVectors(n,r),u.cross(h),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)n.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),h.subVectors(n,r),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Tt.fromBufferAttribute(e,t),Tt.normalize(),e.setXYZ(t,Tt.x,Tt.y,Tt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,v=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*u;for(let p=0;p<u;p++)d[v++]=c[f++]}return new $e(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Rt,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const n={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(n[l]=u,r=!0)}r&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const n=e.attributes;for(const c in n){const u=n[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const tc=new he,sn=new sa,Qs=new bi,ic=new P,wn=new P,Mn=new P,Tn=new P,Oa=new P,$s=new P,er=new le,tr=new le,ir=new le,nc=new P,sc=new P,rc=new P,nr=new P,sr=new P;class ut extends rt{constructor(e=new Rt,t=new Go){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(r&&o){$s.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(Oa.fromBufferAttribute(h,e),a?$s.addScaledVector(Oa,u):$s.addScaledVector(Oa.sub(t),u))}t.add($s)}return t}raycast(e,t){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Qs.copy(i.boundingSphere),Qs.applyMatrix4(r),sn.copy(e.ray).recast(e.near),!(Qs.containsPoint(sn.origin)===!1&&(sn.intersectSphere(Qs,ic)===null||sn.origin.distanceToSquared(ic)>(e.far-e.near)**2))&&(tc.copy(r).invert(),sn.copy(e.ray).applyMatrix4(tc),!(i.boundingBox!==null&&sn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,sn)))}_computeIntersections(e,t,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,_=d.length;v<_;v++){const m=d[v],p=a[m.materialIndex],y=Math.max(m.start,f.start),g=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,S=g;x<S;x+=3){const b=o.getX(x),T=o.getX(x+1),C=o.getX(x+2);n=rr(this,p,e,i,c,u,h,b,T,C),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const v=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=v,p=_;m<p;m+=3){const y=o.getX(m),g=o.getX(m+1),x=o.getX(m+2);n=rr(this,a,e,i,c,u,h,y,g,x),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,_=d.length;v<_;v++){const m=d[v],p=a[m.materialIndex],y=Math.max(m.start,f.start),g=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,S=g;x<S;x+=3){const b=x,T=x+1,C=x+2;n=rr(this,p,e,i,c,u,h,b,T,C),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const v=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=v,p=_;m<p;m+=3){const y=m,g=m+1,x=m+2;n=rr(this,a,e,i,c,u,h,y,g,x),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}}}function ff(s,e,t,i,n,r,a,o){let l;if(e.side===Ht?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,e.side===ti,o),l===null)return null;sr.copy(o),sr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(sr);return c<t.near||c>t.far?null:{distance:c,point:sr.clone(),object:s}}function rr(s,e,t,i,n,r,a,o,l,c){s.getVertexPosition(o,wn),s.getVertexPosition(l,Mn),s.getVertexPosition(c,Tn);const u=ff(s,e,t,i,wn,Mn,Tn,nr);if(u){n&&(er.fromBufferAttribute(n,o),tr.fromBufferAttribute(n,l),ir.fromBufferAttribute(n,c),u.uv=Lt.getInterpolation(nr,wn,Mn,Tn,er,tr,ir,new le)),r&&(er.fromBufferAttribute(r,o),tr.fromBufferAttribute(r,l),ir.fromBufferAttribute(r,c),u.uv1=Lt.getInterpolation(nr,wn,Mn,Tn,er,tr,ir,new le),u.uv2=u.uv1),a&&(nc.fromBufferAttribute(a,o),sc.fromBufferAttribute(a,l),rc.fromBufferAttribute(a,c),u.normal=Lt.getInterpolation(nr,wn,Mn,Tn,nc,sc,rc,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new P,materialIndex:0};Lt.getNormal(wn,Mn,Tn,h.normal),u.face=h}return u}class Ns extends Rt{constructor(e=1,t=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;v("z","y","x",-1,-1,i,t,e,a,r,0),v("z","y","x",1,-1,i,t,-e,a,r,1),v("x","z","y",1,1,e,i,t,n,a,2),v("x","z","y",1,-1,e,i,-t,n,a,3),v("x","y","z",1,-1,e,t,i,n,r,4),v("x","y","z",-1,-1,e,t,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(u,3)),this.setAttribute("uv",new ot(h,2));function v(_,m,p,y,g,x,S,b,T,C,w){const M=x/T,D=S/C,A=x/2,N=S/2,I=b/2,U=T+1,B=C+1;let K=0,k=0;const X=new P;for(let j=0;j<B;j++){const Y=j*D-N;for(let te=0;te<U;te++){const q=te*M-A;X[_]=q*y,X[m]=Y*g,X[p]=I,c.push(X.x,X.y,X.z),X[_]=0,X[m]=0,X[p]=b>0?1:-1,u.push(X.x,X.y,X.z),h.push(te/T),h.push(1-j/C),K+=1}}for(let j=0;j<C;j++)for(let Y=0;Y<T;Y++){const te=d+Y+U*j,q=d+Y+U*(j+1),Z=d+(Y+1)+U*(j+1),ae=d+(Y+1)+U*j;l.push(te,q,ae),l.push(q,Z,ae),k+=6}o.addGroup(f,k,w),f+=k,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ns(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function is(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const n=s[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function zt(s){const e={};for(let t=0;t<s.length;t++){const i=is(s[t]);for(const n in i)e[n]=i[n]}return e}function pf(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Xu(s){return s.getRenderTarget()===null?s.outputColorSpace:Qe.workingColorSpace}const mf={clone:is,merge:zt};var gf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class st extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gf,this.fragmentShader=vf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=is(e.uniforms),this.uniformsGroups=pf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?t.uniforms[n]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[n]={type:"m4",value:a.toArray()}:t.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class qu extends rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he,this.coordinateSystem=Di}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Jt extends qu{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ts*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,n,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Es*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const En=-90,An=1;class _f extends rt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new Jt(En,An,e,t);n.layers=this.layers,this.add(n);const r=new Jt(En,An,e,t);r.layers=this.layers,this.add(r);const a=new Jt(En,An,e,t);a.layers=this.layers,this.add(a);const o=new Jt(En,An,e,t);o.layers=this.layers,this.add(o);const l=new Jt(En,An,e,t);l.layers=this.layers,this.add(l);const c=new Jt(En,An,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Di)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Kr)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,r),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,l),e.setRenderTarget(i,4,n),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,n),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Ku extends Ut{constructor(e,t,i,n,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Qn,super(e,t,i,n,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class yf extends xt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];t.encoding!==void 0&&(Rs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===hn?Pt:Xt),this.texture=new Ku(n,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ke}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new Ns(5,5,5),r=new st({name:"CubemapFromEquirect",uniforms:is(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ht,blending:qi});r.uniforms.tEquirect.value=t;const a=new ut(n,r),o=t.minFilter;return t.minFilter===Cs&&(t.minFilter=Ke),new _f(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,n){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(r)}}const ka=new P,xf=new P,bf=new De;class Ii{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=ka.subVectors(i,t).cross(xf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(ka),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/n;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||bf.getNormalMatrix(e),n=this.coplanarPoint(ka).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const rn=new bi,ar=new P;class Ho{constructor(e=new Ii,t=new Ii,i=new Ii,n=new Ii,r=new Ii,a=new Ii){this.planes=[e,t,i,n,r,a]}set(e,t,i,n,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Di){const i=this.planes,n=e.elements,r=n[0],a=n[1],o=n[2],l=n[3],c=n[4],u=n[5],h=n[6],d=n[7],f=n[8],v=n[9],_=n[10],m=n[11],p=n[12],y=n[13],g=n[14],x=n[15];if(i[0].setComponents(l-r,d-c,m-f,x-p).normalize(),i[1].setComponents(l+r,d+c,m+f,x+p).normalize(),i[2].setComponents(l+a,d+u,m+v,x+y).normalize(),i[3].setComponents(l-a,d-u,m-v,x-y).normalize(),i[4].setComponents(l-o,d-h,m-_,x-g).normalize(),t===Di)i[5].setComponents(l+o,d+h,m+_,x+g).normalize();else if(t===Kr)i[5].setComponents(o,h,_,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),rn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),rn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(rn)}intersectsSprite(e){return rn.center.set(0,0,0),rn.radius=.7071067811865476,rn.applyMatrix4(e.matrixWorld),this.intersectsSphere(rn)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(ar.x=n.normal.x>0?e.max.x:e.min.x,ar.y=n.normal.y>0?e.max.y:e.min.y,ar.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ju(){let s=null,e=!1,t=null,i=null;function n(r,a){t(r,a),i=s.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=s.requestAnimationFrame(n),e=!0)},stop:function(){s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Sf(s,e){const t=e.isWebGL2,i=new WeakMap;function n(c,u){const h=c.array,d=c.usage,f=h.byteLength,v=s.createBuffer();s.bindBuffer(u,v),s.bufferData(u,h,d),c.onUploadCallback();let _;if(h instanceof Float32Array)_=s.FLOAT;else if(h instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)_=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)_=s.SHORT;else if(h instanceof Uint32Array)_=s.UNSIGNED_INT;else if(h instanceof Int32Array)_=s.INT;else if(h instanceof Int8Array)_=s.BYTE;else if(h instanceof Uint8Array)_=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)_=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:v,type:_,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,u,h){const d=u.array,f=u._updateRange,v=u.updateRanges;if(s.bindBuffer(h,c),f.count===-1&&v.length===0&&s.bufferSubData(h,0,d),v.length!==0){for(let _=0,m=v.length;_<m;_++){const p=v[_];t?s.bufferSubData(h,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):s.bufferSubData(h,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}u.clearUpdateRanges()}f.count!==-1&&(t?s.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):s.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),u.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);u&&(s.deleteBuffer(u.buffer),i.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const d=i.get(c);(!d||d.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);if(h===void 0)i.set(c,n(c,u));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,c,u),h.version=c.version}}return{get:a,remove:o,update:l}}class Vt extends Rt{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,u=l+1,h=e/o,d=t/l,f=[],v=[],_=[],m=[];for(let p=0;p<u;p++){const y=p*d-a;for(let g=0;g<c;g++){const x=g*h-r;v.push(x,-y,0),_.push(0,0,1),m.push(g/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const g=y+c*p,x=y+c*(p+1),S=y+1+c*(p+1),b=y+1+c*p;f.push(g,x,b),f.push(x,S,b)}this.setIndex(f),this.setAttribute("position",new ot(v,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.width,e.height,e.widthSegments,e.heightSegments)}}var wf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mf=`#ifdef USE_ALPHAHASH
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
#endif`,Tf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ef=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Af=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Rf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pf=`#ifdef USE_AOMAP
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
#endif`,Cf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lf=`#ifdef USE_BATCHING
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
#endif`,If=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Df=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Nf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Uf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ff=`#ifdef USE_IRIDESCENCE
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
#endif`,Bf=`#ifdef USE_BUMPMAP
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
#endif`,Of=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,kf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Gf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Wf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Xf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,qf=`#define PI 3.141592653589793
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
} // validated`,Kf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,jf=`vec3 transformedNormal = objectNormal;
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
#endif`,Yf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$f="gl_FragColor = linearToOutputTexel( gl_FragColor );",ep=`
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
}`,tp=`#ifdef USE_ENVMAP
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
#endif`,ip=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,np=`#ifdef USE_ENVMAP
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
#endif`,sp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rp=`#ifdef USE_ENVMAP
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
#endif`,ap=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,op=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,up=`#ifdef USE_GRADIENTMAP
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
}`,hp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,dp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mp=`uniform bool receiveShadow;
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
#endif`,gp=`#ifdef USE_ENVMAP
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
#endif`,vp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_p=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,yp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bp=`PhysicalMaterial material;
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
#endif`,Sp=`struct PhysicalMaterial {
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
}`,wp=`
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
#endif`,Mp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Tp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ep=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ap=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Pp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Cp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Lp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ip=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Dp=`#if defined( USE_POINTS_UV )
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
#endif`,Np=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Up=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bp=`#ifdef USE_MORPHNORMALS
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
#endif`,Op=`#ifdef USE_MORPHTARGETS
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
#endif`,kp=`#ifdef USE_MORPHTARGETS
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
#endif`,zp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Gp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Xp=`#ifdef USE_NORMALMAP
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
#endif`,qp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Kp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Jp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Qp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$p=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,im=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,nm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,am=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,om=`float getShadowMask() {
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
}`,lm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,cm=`#ifdef USE_SKINNING
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
#endif`,um=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hm=`#ifdef USE_SKINNING
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
#endif`,dm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,pm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,mm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,gm=`#ifdef USE_TRANSMISSION
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
#endif`,vm=`#ifdef USE_TRANSMISSION
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
#endif`,_m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wm=`uniform sampler2D t2D;
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
}`,Mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Am=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rm=`#include <common>
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
}`,Pm=`#if DEPTH_PACKING == 3200
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
}`,Cm=`#define DISTANCE
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
}`,Lm=`#define DISTANCE
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
}`,Im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Dm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nm=`uniform float scale;
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
}`,Um=`uniform vec3 diffuse;
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
}`,Fm=`#include <common>
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
}`,Bm=`uniform vec3 diffuse;
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
}`,Om=`#define LAMBERT
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
}`,km=`#define LAMBERT
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
}`,zm=`#define MATCAP
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
}`,Gm=`#define MATCAP
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
}`,Hm=`#define NORMAL
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
}`,Vm=`#define NORMAL
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
}`,Wm=`#define PHONG
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
}`,Xm=`#define PHONG
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
}`,qm=`#define STANDARD
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
}`,Km=`#define STANDARD
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
}`,jm=`#define TOON
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
}`,Ym=`#define TOON
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
}`,Zm=`uniform float size;
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
}`,Jm=`uniform vec3 diffuse;
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
}`,Qm=`#include <common>
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
}`,$m=`uniform vec3 color;
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
}`,eg=`uniform float rotation;
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
}`,tg=`uniform vec3 diffuse;
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
}`,Fe={alphahash_fragment:wf,alphahash_pars_fragment:Mf,alphamap_fragment:Tf,alphamap_pars_fragment:Ef,alphatest_fragment:Af,alphatest_pars_fragment:Rf,aomap_fragment:Pf,aomap_pars_fragment:Cf,batching_pars_vertex:Lf,batching_vertex:If,begin_vertex:Df,beginnormal_vertex:Nf,bsdfs:Uf,iridescence_fragment:Ff,bumpmap_pars_fragment:Bf,clipping_planes_fragment:Of,clipping_planes_pars_fragment:kf,clipping_planes_pars_vertex:zf,clipping_planes_vertex:Gf,color_fragment:Hf,color_pars_fragment:Vf,color_pars_vertex:Wf,color_vertex:Xf,common:qf,cube_uv_reflection_fragment:Kf,defaultnormal_vertex:jf,displacementmap_pars_vertex:Yf,displacementmap_vertex:Zf,emissivemap_fragment:Jf,emissivemap_pars_fragment:Qf,colorspace_fragment:$f,colorspace_pars_fragment:ep,envmap_fragment:tp,envmap_common_pars_fragment:ip,envmap_pars_fragment:np,envmap_pars_vertex:sp,envmap_physical_pars_fragment:gp,envmap_vertex:rp,fog_vertex:ap,fog_pars_vertex:op,fog_fragment:lp,fog_pars_fragment:cp,gradientmap_pars_fragment:up,lightmap_fragment:hp,lightmap_pars_fragment:dp,lights_lambert_fragment:fp,lights_lambert_pars_fragment:pp,lights_pars_begin:mp,lights_toon_fragment:vp,lights_toon_pars_fragment:_p,lights_phong_fragment:yp,lights_phong_pars_fragment:xp,lights_physical_fragment:bp,lights_physical_pars_fragment:Sp,lights_fragment_begin:wp,lights_fragment_maps:Mp,lights_fragment_end:Tp,logdepthbuf_fragment:Ep,logdepthbuf_pars_fragment:Ap,logdepthbuf_pars_vertex:Rp,logdepthbuf_vertex:Pp,map_fragment:Cp,map_pars_fragment:Lp,map_particle_fragment:Ip,map_particle_pars_fragment:Dp,metalnessmap_fragment:Np,metalnessmap_pars_fragment:Up,morphcolor_vertex:Fp,morphnormal_vertex:Bp,morphtarget_pars_vertex:Op,morphtarget_vertex:kp,normal_fragment_begin:zp,normal_fragment_maps:Gp,normal_pars_fragment:Hp,normal_pars_vertex:Vp,normal_vertex:Wp,normalmap_pars_fragment:Xp,clearcoat_normal_fragment_begin:qp,clearcoat_normal_fragment_maps:Kp,clearcoat_pars_fragment:jp,iridescence_pars_fragment:Yp,opaque_fragment:Zp,packing:Jp,premultiplied_alpha_fragment:Qp,project_vertex:$p,dithering_fragment:em,dithering_pars_fragment:tm,roughnessmap_fragment:im,roughnessmap_pars_fragment:nm,shadowmap_pars_fragment:sm,shadowmap_pars_vertex:rm,shadowmap_vertex:am,shadowmask_pars_fragment:om,skinbase_vertex:lm,skinning_pars_vertex:cm,skinning_vertex:um,skinnormal_vertex:hm,specularmap_fragment:dm,specularmap_pars_fragment:fm,tonemapping_fragment:pm,tonemapping_pars_fragment:mm,transmission_fragment:gm,transmission_pars_fragment:vm,uv_pars_fragment:_m,uv_pars_vertex:ym,uv_vertex:xm,worldpos_vertex:bm,background_vert:Sm,background_frag:wm,backgroundCube_vert:Mm,backgroundCube_frag:Tm,cube_vert:Em,cube_frag:Am,depth_vert:Rm,depth_frag:Pm,distanceRGBA_vert:Cm,distanceRGBA_frag:Lm,equirect_vert:Im,equirect_frag:Dm,linedashed_vert:Nm,linedashed_frag:Um,meshbasic_vert:Fm,meshbasic_frag:Bm,meshlambert_vert:Om,meshlambert_frag:km,meshmatcap_vert:zm,meshmatcap_frag:Gm,meshnormal_vert:Hm,meshnormal_frag:Vm,meshphong_vert:Wm,meshphong_frag:Xm,meshphysical_vert:qm,meshphysical_frag:Km,meshtoon_vert:jm,meshtoon_frag:Ym,points_vert:Zm,points_frag:Jm,shadow_vert:Qm,shadow_frag:$m,sprite_vert:eg,sprite_frag:tg},ne={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},vi={basic:{uniforms:zt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:zt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new ue(0)}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:zt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:zt([ne.common,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.roughnessmap,ne.metalnessmap,ne.fog,ne.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:zt([ne.common,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.gradientmap,ne.fog,ne.lights,{emissive:{value:new ue(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:zt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:zt([ne.points,ne.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:zt([ne.common,ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:zt([ne.common,ne.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:zt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:zt([ne.sprite,ne.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distanceRGBA:{uniforms:zt([ne.common,ne.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distanceRGBA_vert,fragmentShader:Fe.distanceRGBA_frag},shadow:{uniforms:zt([ne.lights,ne.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};vi.physical={uniforms:zt([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};const or={r:0,b:0,g:0};function ig(s,e,t,i,n,r,a){const o=new ue(0);let l=r===!0?0:1,c,u,h=null,d=0,f=null;function v(m,p){let y=!1,g=p.isScene===!0?p.background:null;g&&g.isTexture&&(g=(p.backgroundBlurriness>0?t:e).get(g)),g===null?_(o,l):g&&g.isColor&&(_(g,1),y=!0);const x=s.xr.getEnvironmentBlendMode();x==="additive"?i.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(s.autoClear||y)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),g&&(g.isCubeTexture||g.mapping===$r)?(u===void 0&&(u=new ut(new Ns(1,1,1),new st({name:"BackgroundCubeMaterial",uniforms:is(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(S,b,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(u)),u.material.uniforms.envMap.value=g,u.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,u.material.toneMapped=Qe.getTransfer(g.colorSpace)!==nt,(h!==g||d!==g.version||f!==s.toneMapping)&&(u.material.needsUpdate=!0,h=g,d=g.version,f=s.toneMapping),u.layers.enableAll(),m.unshift(u,u.geometry,u.material,0,0,null)):g&&g.isTexture&&(c===void 0&&(c=new ut(new Vt(2,2),new st({name:"BackgroundMaterial",uniforms:is(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=g,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(g.colorSpace)!==nt,g.matrixAutoUpdate===!0&&g.updateMatrix(),c.material.uniforms.uvTransform.value.copy(g.matrix),(h!==g||d!==g.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,h=g,d=g.version,f=s.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,p){m.getRGB(or,Xu(s)),i.buffers.color.setClear(or.r,or.g,or.b,p,a)}return{getClearColor:function(){return o},setClearColor:function(m,p=1){o.set(m),l=p,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(o,l)},render:v}}function ng(s,e,t,i){const n=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||r!==null,o={},l=m(null);let c=l,u=!1;function h(I,U,B,K,k){let X=!1;if(a){const j=_(K,B,U);c!==j&&(c=j,f(c.object)),X=p(I,K,B,k),X&&y(I,K,B,k)}else{const j=U.wireframe===!0;(c.geometry!==K.id||c.program!==B.id||c.wireframe!==j)&&(c.geometry=K.id,c.program=B.id,c.wireframe=j,X=!0)}k!==null&&t.update(k,s.ELEMENT_ARRAY_BUFFER),(X||u)&&(u=!1,C(I,U,B,K),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function d(){return i.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function f(I){return i.isWebGL2?s.bindVertexArray(I):r.bindVertexArrayOES(I)}function v(I){return i.isWebGL2?s.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function _(I,U,B){const K=B.wireframe===!0;let k=o[I.id];k===void 0&&(k={},o[I.id]=k);let X=k[U.id];X===void 0&&(X={},k[U.id]=X);let j=X[K];return j===void 0&&(j=m(d()),X[K]=j),j}function m(I){const U=[],B=[],K=[];for(let k=0;k<n;k++)U[k]=0,B[k]=0,K[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:B,attributeDivisors:K,object:I,attributes:{},index:null}}function p(I,U,B,K){const k=c.attributes,X=U.attributes;let j=0;const Y=B.getAttributes();for(const te in Y)if(Y[te].location>=0){const Z=k[te];let ae=X[te];if(ae===void 0&&(te==="instanceMatrix"&&I.instanceMatrix&&(ae=I.instanceMatrix),te==="instanceColor"&&I.instanceColor&&(ae=I.instanceColor)),Z===void 0||Z.attribute!==ae||ae&&Z.data!==ae.data)return!0;j++}return c.attributesNum!==j||c.index!==K}function y(I,U,B,K){const k={},X=U.attributes;let j=0;const Y=B.getAttributes();for(const te in Y)if(Y[te].location>=0){let Z=X[te];Z===void 0&&(te==="instanceMatrix"&&I.instanceMatrix&&(Z=I.instanceMatrix),te==="instanceColor"&&I.instanceColor&&(Z=I.instanceColor));const ae={};ae.attribute=Z,Z&&Z.data&&(ae.data=Z.data),k[te]=ae,j++}c.attributes=k,c.attributesNum=j,c.index=K}function g(){const I=c.newAttributes;for(let U=0,B=I.length;U<B;U++)I[U]=0}function x(I){S(I,0)}function S(I,U){const B=c.newAttributes,K=c.enabledAttributes,k=c.attributeDivisors;B[I]=1,K[I]===0&&(s.enableVertexAttribArray(I),K[I]=1),k[I]!==U&&((i.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,U),k[I]=U)}function b(){const I=c.newAttributes,U=c.enabledAttributes;for(let B=0,K=U.length;B<K;B++)U[B]!==I[B]&&(s.disableVertexAttribArray(B),U[B]=0)}function T(I,U,B,K,k,X,j){j===!0?s.vertexAttribIPointer(I,U,B,k,X):s.vertexAttribPointer(I,U,B,K,k,X)}function C(I,U,B,K){if(i.isWebGL2===!1&&(I.isInstancedMesh||K.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();const k=K.attributes,X=B.getAttributes(),j=U.defaultAttributeValues;for(const Y in X){const te=X[Y];if(te.location>=0){let q=k[Y];if(q===void 0&&(Y==="instanceMatrix"&&I.instanceMatrix&&(q=I.instanceMatrix),Y==="instanceColor"&&I.instanceColor&&(q=I.instanceColor)),q!==void 0){const Z=q.normalized,ae=q.itemSize,ye=t.get(q);if(ye===void 0)continue;const _e=ye.buffer,Le=ye.type,Ne=ye.bytesPerElement,Te=i.isWebGL2===!0&&(Le===s.INT||Le===s.UNSIGNED_INT||q.gpuType===Ts);if(q.isInterleavedBufferAttribute){const We=q.data,z=We.stride,Ft=q.offset;if(We.isInstancedInterleavedBuffer){for(let be=0;be<te.locationSize;be++)S(te.location+be,We.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=We.meshPerAttribute*We.count)}else for(let be=0;be<te.locationSize;be++)x(te.location+be);s.bindBuffer(s.ARRAY_BUFFER,_e);for(let be=0;be<te.locationSize;be++)T(te.location+be,ae/te.locationSize,Le,Z,z*Ne,(Ft+ae/te.locationSize*be)*Ne,Te)}else{if(q.isInstancedBufferAttribute){for(let We=0;We<te.locationSize;We++)S(te.location+We,q.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let We=0;We<te.locationSize;We++)x(te.location+We);s.bindBuffer(s.ARRAY_BUFFER,_e);for(let We=0;We<te.locationSize;We++)T(te.location+We,ae/te.locationSize,Le,Z,ae*Ne,ae/te.locationSize*We*Ne,Te)}}else if(j!==void 0){const Z=j[Y];if(Z!==void 0)switch(Z.length){case 2:s.vertexAttrib2fv(te.location,Z);break;case 3:s.vertexAttrib3fv(te.location,Z);break;case 4:s.vertexAttrib4fv(te.location,Z);break;default:s.vertexAttrib1fv(te.location,Z)}}}}b()}function w(){A();for(const I in o){const U=o[I];for(const B in U){const K=U[B];for(const k in K)v(K[k].object),delete K[k];delete U[B]}delete o[I]}}function M(I){if(o[I.id]===void 0)return;const U=o[I.id];for(const B in U){const K=U[B];for(const k in K)v(K[k].object),delete K[k];delete U[B]}delete o[I.id]}function D(I){for(const U in o){const B=o[U];if(B[I.id]===void 0)continue;const K=B[I.id];for(const k in K)v(K[k].object),delete K[k];delete B[I.id]}}function A(){N(),u=!0,c!==l&&(c=l,f(c.object))}function N(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:A,resetDefaultState:N,dispose:w,releaseStatesOfGeometry:M,releaseStatesOfProgram:D,initAttributes:g,enableAttribute:x,disableUnusedAttributes:b}}function sg(s,e,t,i){const n=i.isWebGL2;let r;function a(u){r=u}function o(u,h){s.drawArrays(r,u,h),t.update(h,r,1)}function l(u,h,d){if(d===0)return;let f,v;if(n)f=s,v="drawArraysInstanced";else if(f=e.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[v](r,u,h,d),t.update(h,r,d)}function c(u,h,d){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let v=0;v<d;v++)this.render(u[v],h[v]);else{f.multiDrawArraysWEBGL(r,u,0,h,0,d);let v=0;for(let _=0;_<d;_++)v+=h[_];t.update(v,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function rg(s,e,t){let i;function n(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,h=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),g=d>0,x=a||e.has("OES_texture_float"),S=g&&x,b=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:n,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:v,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:g,floatFragmentTextures:x,floatVertexTextures:S,maxSamples:b}}function ag(s){const e=this;let t=null,i=0,n=!1,r=!1;const a=new Ii,o=new De,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||n;return n=d,i=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const v=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=s.get(h);if(!n||v===null||v.length===0||r&&!m)r?u(null):c();else{const y=r?0:i,g=y*4;let x=p.clippingState||null;l.value=x,x=u(v,d,g,f);for(let S=0;S!==g;++S)x[S]=t[S];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,v){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,v!==!0||m===null){const p=f+_*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let g=0,x=f;g!==_;++g,x+=4)a.copy(h[g]).applyMatrix4(y,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function og(s){let e=new WeakMap;function t(a,o){return o===mo?a.mapping=Qn:o===go&&(a.mapping=$n),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===mo||o===go)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new yf(l.height/2);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",n),t(c.texture,a.mapping)}else return null}}return a}function n(a){const o=a.target;o.removeEventListener("dispose",n);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}class Kt extends qu{constructor(e=-1,t=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const qn=4,ac=[.125,.215,.35,.446,.526,.582],ln=20,za=new Kt,oc=new ue;let Ga=null,Ha=0,Va=0;const an=(1+Math.sqrt(5))/2,Rn=1/an,lc=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,an,Rn),new P(0,an,-Rn),new P(Rn,0,an),new P(-Rn,0,an),new P(an,Rn,0),new P(-an,Rn,0)];class cc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100){Ga=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),Va=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,n,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ga,Ha,Va),e.scissorTest=!1,lr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Qn||e.mapping===$n?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ga=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),Va=this._renderer.getActiveMipmapLevel();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Ke,minFilter:Ke,generateMipmaps:!1,type:Et,format:Xe,colorSpace:fi,depthBuffer:!1},n=uc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uc(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=lg(r)),this._blurMaterial=cg(r,e,t)}return n}_compileMaterial(e){const t=new ut(this._lodPlanes[0],e);this._renderer.compile(t,za)}_sceneToCubeUV(e,t,i,n){const o=new Jt(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(oc),u.toneMapping=Ki,u.autoClear=!1;const f=new Go({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),v=new ut(new Ns,f);let _=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,_=!0):(f.color.copy(oc),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):y===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const g=this._cubeSize;lr(n,y*g,p>2?g:0,g,g),u.setRenderTarget(n),_&&u.render(v,o),u.render(e,o)}v.geometry.dispose(),v.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,n=e.mapping===Qn||e.mapping===$n;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=dc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hc());const r=n?this._cubemapMaterial:this._equirectMaterial,a=new ut(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;lr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,za)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let n=1;n<this._lodPlanes.length;n++){const r=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),a=lc[(n-1)%lc.length];this._blur(e,n-1,n,r,a)}t.autoClear=i}_blur(e,t,i,n,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",r),this._halfBlur(a,e,i,i,n,"longitudinal",r)}_halfBlur(e,t,i,n,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new ut(this._lodPlanes[n],c),d=c.uniforms,f=this._sizeLods[i]-1,v=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ln-1),_=r/v,m=isFinite(r)?1+Math.floor(u*_):ln;m>ln&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ln}`);const p=[];let y=0;for(let T=0;T<ln;++T){const C=T/_,w=Math.exp(-C*C/2);p.push(w),T===0?y+=w:T<m&&(y+=2*w)}for(let T=0;T<p.length;T++)p[T]=p[T]/y;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:g}=this;d.dTheta.value=v,d.mipInt.value=g-i;const x=this._sizeLods[n],S=3*x*(n>g-qn?n-g+qn:0),b=4*(this._cubeSize-x);lr(t,S,b,3*x,2*x),l.setRenderTarget(t),l.render(h,za)}}function lg(s){const e=[],t=[],i=[];let n=s;const r=s-qn+1+ac.length;for(let a=0;a<r;a++){const o=Math.pow(2,n);t.push(o);let l=1/o;a>s-qn?l=ac[a-s+qn-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,v=6,_=3,m=2,p=1,y=new Float32Array(_*v*f),g=new Float32Array(m*v*f),x=new Float32Array(p*v*f);for(let b=0;b<f;b++){const T=b%3*2/3-1,C=b>2?0:-1,w=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];y.set(w,_*v*b),g.set(d,m*v*b);const M=[b,b,b,b,b,b];x.set(M,p*v*b)}const S=new Rt;S.setAttribute("position",new $e(y,_)),S.setAttribute("uv",new $e(g,m)),S.setAttribute("faceIndex",new $e(x,p)),e.push(S),n>qn&&n--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function uc(s,e,t){const i=new xt(s,e,t);return i.texture.mapping=$r,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function lr(s,e,t,i,n){s.viewport.set(e,t,i,n),s.scissor.set(e,t,i,n)}function cg(s,e,t){const i=new Float32Array(ln),n=new P(0,1,0);return new st({name:"SphericalGaussianBlur",defines:{n:ln,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:Vo(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function hc(){return new st({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vo(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function dc(){return new st({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qi,depthTest:!1,depthWrite:!1})}function Vo(){return`

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
	`}function ug(s){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===mo||l===go,u=l===Qn||l===$n;if(c||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let h=e.get(o);return t===null&&(t=new cc(s)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),e.set(o,h),h.texture}else{if(e.has(o))return e.get(o).texture;{const h=o.image;if(c&&h&&h.height>0||u&&h&&n(h)){t===null&&(t=new cc(s));const d=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function n(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function hg(s){const e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=s.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const n=t(i);return n===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function dg(s,e,t,i){const n={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const v in d.attributes)e.remove(d.attributes[v]);for(const v in d.morphAttributes){const _=d.morphAttributes[v];for(let m=0,p=_.length;m<p;m++)e.remove(_[m])}d.removeEventListener("dispose",a),delete n[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return n[d.id]===!0||(d.addEventListener("dispose",a),n[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const v in d)e.update(d[v],s.ARRAY_BUFFER);const f=h.morphAttributes;for(const v in f){const _=f[v];for(let m=0,p=_.length;m<p;m++)e.update(_[m],s.ARRAY_BUFFER)}}function c(h){const d=[],f=h.index,v=h.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let g=0,x=y.length;g<x;g+=3){const S=y[g+0],b=y[g+1],T=y[g+2];d.push(S,b,b,T,T,S)}}else if(v!==void 0){const y=v.array;_=v.version;for(let g=0,x=y.length/3-1;g<x;g+=3){const S=g+0,b=g+1,T=g+2;d.push(S,b,b,T,T,S)}}else return;const m=new(Fu(d)?Wu:Vu)(d,1);m.version=_;const p=r.get(h);p&&e.remove(p),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function fg(s,e,t,i){const n=i.isWebGL2;let r;function a(f){r=f}let o,l;function c(f){o=f.type,l=f.bytesPerElement}function u(f,v){s.drawElements(r,v,o,f*l),t.update(v,r,1)}function h(f,v,_){if(_===0)return;let m,p;if(n)m=s,p="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,v,o,f*l,_),t.update(v,r,_)}function d(f,v,_){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(f[p]/l,v[p]);else{m.multiDrawElementsWEBGL(r,v,0,o,f,0,_);let p=0;for(let y=0;y<_;y++)p+=v[y];t.update(p,r,1)}}this.setMode=a,this.setIndex=c,this.render=u,this.renderInstances=h,this.renderMultiDraw=d}function pg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function mg(s,e){return s[0]-e[0]}function gg(s,e){return Math.abs(e[1])-Math.abs(s[1])}function vg(s,e,t){const i={},n=new Float32Array(8),r=new WeakMap,a=new qe,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,u,h){const d=c.morphTargetInfluences;if(e.isWebGL2===!0){const f=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,v=f!==void 0?f.length:0;let _=r.get(u);if(_===void 0||_.count!==v){let I=function(){A.dispose(),r.delete(u),u.removeEventListener("dispose",I)};_!==void 0&&_.texture.dispose();const y=u.morphAttributes.position!==void 0,g=u.morphAttributes.normal!==void 0,x=u.morphAttributes.color!==void 0,S=u.morphAttributes.position||[],b=u.morphAttributes.normal||[],T=u.morphAttributes.color||[];let C=0;y===!0&&(C=1),g===!0&&(C=2),x===!0&&(C=3);let w=u.attributes.position.count*C,M=1;w>e.maxTextureSize&&(M=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const D=new Float32Array(w*M*4*v),A=new ku(D,w,M,v);A.type=pt,A.needsUpdate=!0;const N=C*4;for(let U=0;U<v;U++){const B=S[U],K=b[U],k=T[U],X=w*M*4*U;for(let j=0;j<B.count;j++){const Y=j*N;y===!0&&(a.fromBufferAttribute(B,j),D[X+Y+0]=a.x,D[X+Y+1]=a.y,D[X+Y+2]=a.z,D[X+Y+3]=0),g===!0&&(a.fromBufferAttribute(K,j),D[X+Y+4]=a.x,D[X+Y+5]=a.y,D[X+Y+6]=a.z,D[X+Y+7]=0),x===!0&&(a.fromBufferAttribute(k,j),D[X+Y+8]=a.x,D[X+Y+9]=a.y,D[X+Y+10]=a.z,D[X+Y+11]=k.itemSize===4?a.w:1)}}_={count:v,texture:A,size:new le(w,M)},r.set(u,_),u.addEventListener("dispose",I)}let m=0;for(let y=0;y<d.length;y++)m+=d[y];const p=u.morphTargetsRelative?1:1-m;h.getUniforms().setValue(s,"morphTargetBaseInfluence",p),h.getUniforms().setValue(s,"morphTargetInfluences",d),h.getUniforms().setValue(s,"morphTargetsTexture",_.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",_.size)}else{const f=d===void 0?0:d.length;let v=i[u.id];if(v===void 0||v.length!==f){v=[];for(let g=0;g<f;g++)v[g]=[g,0];i[u.id]=v}for(let g=0;g<f;g++){const x=v[g];x[0]=g,x[1]=d[g]}v.sort(gg);for(let g=0;g<8;g++)g<f&&v[g][1]?(o[g][0]=v[g][0],o[g][1]=v[g][1]):(o[g][0]=Number.MAX_SAFE_INTEGER,o[g][1]=0);o.sort(mg);const _=u.morphAttributes.position,m=u.morphAttributes.normal;let p=0;for(let g=0;g<8;g++){const x=o[g],S=x[0],b=x[1];S!==Number.MAX_SAFE_INTEGER&&b?(_&&u.getAttribute("morphTarget"+g)!==_[S]&&u.setAttribute("morphTarget"+g,_[S]),m&&u.getAttribute("morphNormal"+g)!==m[S]&&u.setAttribute("morphNormal"+g,m[S]),n[g]=b,p+=b):(_&&u.hasAttribute("morphTarget"+g)===!0&&u.deleteAttribute("morphTarget"+g),m&&u.hasAttribute("morphNormal"+g)===!0&&u.deleteAttribute("morphNormal"+g),n[g]=0)}const y=u.morphTargetsRelative?1:1-p;h.getUniforms().setValue(s,"morphTargetBaseInfluence",y),h.getUniforms().setValue(s,"morphTargetInfluences",n)}}return{update:l}}function _g(s,e,t,i){let n=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(n.get(h)!==c&&(e.update(h),n.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),n.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),n.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;n.get(d)!==c&&(d.update(),n.set(d,c))}return h}function a(){n=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class Yu extends Ut{constructor(e,t,i,n,r,a,o,l,c,u){if(u=u!==void 0?u:un,u!==un&&u!==es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===un&&(i=Qt),i===void 0&&u===es&&(i=cn),super(null,n,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:ze,this.minFilter=l!==void 0?l:ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Zu=new Ut,Ju=new Yu(1,1);Ju.compareFunction=Uu;const Qu=new ku,$u=new zu,eh=new Ku,fc=[],pc=[],mc=new Float32Array(16),gc=new Float32Array(9),vc=new Float32Array(4);function ns(s,e,t){const i=s[0];if(i<=0||i>0)return s;const n=e*t;let r=fc[n];if(r===void 0&&(r=new Float32Array(n),fc[n]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function bt(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function St(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function aa(s,e){let t=pc[e];t===void 0&&(t=new Int32Array(e),pc[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function yg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function xg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;s.uniform2fv(this.addr,e),St(t,e)}}function bg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;s.uniform3fv(this.addr,e),St(t,e)}}function Sg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;s.uniform4fv(this.addr,e),St(t,e)}}function wg(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),St(t,e)}else{if(bt(t,i))return;vc.set(i),s.uniformMatrix2fv(this.addr,!1,vc),St(t,i)}}function Mg(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),St(t,e)}else{if(bt(t,i))return;gc.set(i),s.uniformMatrix3fv(this.addr,!1,gc),St(t,i)}}function Tg(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),St(t,e)}else{if(bt(t,i))return;mc.set(i),s.uniformMatrix4fv(this.addr,!1,mc),St(t,i)}}function Eg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Ag(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;s.uniform2iv(this.addr,e),St(t,e)}}function Rg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;s.uniform3iv(this.addr,e),St(t,e)}}function Pg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;s.uniform4iv(this.addr,e),St(t,e)}}function Cg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;s.uniform2uiv(this.addr,e),St(t,e)}}function Ig(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;s.uniform3uiv(this.addr,e),St(t,e)}}function Dg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;s.uniform4uiv(this.addr,e),St(t,e)}}function Ng(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);const r=this.type===s.SAMPLER_2D_SHADOW?Ju:Zu;t.setTexture2D(e||r,n)}function Ug(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||$u,n)}function Fg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||eh,n)}function Bg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||Qu,n)}function Og(s){switch(s){case 5126:return yg;case 35664:return xg;case 35665:return bg;case 35666:return Sg;case 35674:return wg;case 35675:return Mg;case 35676:return Tg;case 5124:case 35670:return Eg;case 35667:case 35671:return Ag;case 35668:case 35672:return Rg;case 35669:case 35673:return Pg;case 5125:return Cg;case 36294:return Lg;case 36295:return Ig;case 36296:return Dg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ng;case 35679:case 36299:case 36307:return Ug;case 35680:case 36300:case 36308:case 36293:return Fg;case 36289:case 36303:case 36311:case 36292:return Bg}}function kg(s,e){s.uniform1fv(this.addr,e)}function zg(s,e){const t=ns(e,this.size,2);s.uniform2fv(this.addr,t)}function Gg(s,e){const t=ns(e,this.size,3);s.uniform3fv(this.addr,t)}function Hg(s,e){const t=ns(e,this.size,4);s.uniform4fv(this.addr,t)}function Vg(s,e){const t=ns(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Wg(s,e){const t=ns(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Xg(s,e){const t=ns(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function qg(s,e){s.uniform1iv(this.addr,e)}function Kg(s,e){s.uniform2iv(this.addr,e)}function jg(s,e){s.uniform3iv(this.addr,e)}function Yg(s,e){s.uniform4iv(this.addr,e)}function Zg(s,e){s.uniform1uiv(this.addr,e)}function Jg(s,e){s.uniform2uiv(this.addr,e)}function Qg(s,e){s.uniform3uiv(this.addr,e)}function $g(s,e){s.uniform4uiv(this.addr,e)}function ev(s,e,t){const i=this.cache,n=e.length,r=aa(t,n);bt(i,r)||(s.uniform1iv(this.addr,r),St(i,r));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||Zu,r[a])}function tv(s,e,t){const i=this.cache,n=e.length,r=aa(t,n);bt(i,r)||(s.uniform1iv(this.addr,r),St(i,r));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||$u,r[a])}function iv(s,e,t){const i=this.cache,n=e.length,r=aa(t,n);bt(i,r)||(s.uniform1iv(this.addr,r),St(i,r));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||eh,r[a])}function nv(s,e,t){const i=this.cache,n=e.length,r=aa(t,n);bt(i,r)||(s.uniform1iv(this.addr,r),St(i,r));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||Qu,r[a])}function sv(s){switch(s){case 5126:return kg;case 35664:return zg;case 35665:return Gg;case 35666:return Hg;case 35674:return Vg;case 35675:return Wg;case 35676:return Xg;case 5124:case 35670:return qg;case 35667:case 35671:return Kg;case 35668:case 35672:return jg;case 35669:case 35673:return Yg;case 5125:return Zg;case 36294:return Jg;case 36295:return Qg;case 36296:return $g;case 35678:case 36198:case 36298:case 36306:case 35682:return ev;case 35679:case 36299:case 36307:return tv;case 35680:case 36300:case 36308:case 36293:return iv;case 36289:case 36303:case 36311:case 36292:return nv}}class rv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Og(t.type)}}class av{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=sv(t.type)}}class ov{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(e,t[o.id],i)}}}const Wa=/(\w+)(\])?(\[|\.)?/g;function _c(s,e){s.seq.push(e),s.map[e.id]=e}function lv(s,e,t){const i=s.name,n=i.length;for(Wa.lastIndex=0;;){const r=Wa.exec(i),a=Wa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){_c(t,c===void 0?new rv(o,s,e):new av(o,s,e));break}else{let h=t.map[o];h===void 0&&(h=new ov(o),_c(t,h)),t=h}}}class Or{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){const r=e.getActiveUniform(t,n),a=e.getUniformLocation(t,r.name);lv(r,a,this)}}setValue(e,t,i,n){const r=this.map[t];r!==void 0&&r.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,r=e.length;n!==r;++n){const a=e[n];a.id in t&&i.push(a)}return i}}function yc(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const cv=37297;let uv=0;function hv(s,e){const t=s.split(`
`),i=[],n=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function dv(s){const e=Qe.getPrimaries(Qe.workingColorSpace),t=Qe.getPrimaries(s);let i;switch(e===t?i="":e===qr&&t===Xr?i="LinearDisplayP3ToLinearSRGB":e===Xr&&t===qr&&(i="LinearSRGBToLinearDisplayP3"),s){case fi:case na:return[i,"LinearTransferOETF"];case Pt:case ko:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[i,"LinearTransferOETF"]}}function xc(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),n=s.getShaderInfoLog(e).trim();if(i&&n==="")return"";const r=/ERROR: 0:(\d+)/.exec(n);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+n+`

`+hv(s.getShaderSource(e),a)}else return n}function fv(s,e){const t=dv(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function pv(s,e){let t;switch(e){case cd:t="Linear";break;case ud:t="Reinhard";break;case hd:t="OptimizedCineon";break;case dd:t="ACESFilmic";break;case pd:t="AgX";break;case fd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function mv(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Kn).join(`
`)}function gv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Kn).join(`
`)}function vv(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function _v(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(e,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Kn(s){return s!==""}function bc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const yv=/^[ \t]*#include +<([\w\d./]+)>/gm;function wo(s){return s.replace(yv,bv)}const xv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function bv(s,e){let t=Fe[e];if(t===void 0){const i=xv.get(e);if(i!==void 0)t=Fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return wo(t)}const Sv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wc(s){return s.replace(Sv,wv)}function wv(s,e,t,i){let n="";for(let r=parseInt(e);r<parseInt(t);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function Mc(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Mv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Tu?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Bh?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Ci&&(e="SHADOWMAP_TYPE_VSM"),e}function Tv(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Qn:case $n:e="ENVMAP_TYPE_CUBE";break;case $r:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ev(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case $n:e="ENVMAP_MODE_REFRACTION";break}return e}function Av(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Eu:e="ENVMAP_BLENDING_MULTIPLY";break;case od:e="ENVMAP_BLENDING_MIX";break;case ld:e="ENVMAP_BLENDING_ADD";break}return e}function Rv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Pv(s,e,t,i){const n=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Mv(t),c=Tv(t),u=Ev(t),h=Av(t),d=Rv(t),f=t.isWebGL2?"":mv(t),v=gv(t),_=vv(r),m=n.createProgram();let p,y,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Kn).join(`
`),p.length>0&&(p+=`
`),y=[f,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Kn).join(`
`),y.length>0&&(y+=`
`)):(p=[Mc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Kn).join(`
`),y=[f,Mc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ki?"#define TONE_MAPPING":"",t.toneMapping!==Ki?Fe.tonemapping_pars_fragment:"",t.toneMapping!==Ki?pv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,fv("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Kn).join(`
`)),a=wo(a),a=bc(a,t),a=Sc(a,t),o=wo(o),o=bc(o,t),o=Sc(o,t),a=wc(a),o=wc(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,p=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,y=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===vt?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vt?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const x=g+p+a,S=g+y+o,b=yc(n,n.VERTEX_SHADER,x),T=yc(n,n.FRAGMENT_SHADER,S);n.attachShader(m,b),n.attachShader(m,T),t.index0AttributeName!==void 0?n.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(m,0,"position"),n.linkProgram(m);function C(A){if(s.debug.checkShaderErrors){const N=n.getProgramInfoLog(m).trim(),I=n.getShaderInfoLog(b).trim(),U=n.getShaderInfoLog(T).trim();let B=!0,K=!0;if(n.getProgramParameter(m,n.LINK_STATUS)===!1)if(B=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,m,b,T);else{const k=xc(n,b,"vertex"),X=xc(n,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(m,n.VALIDATE_STATUS)+`

Program Info Log: `+N+`
`+k+`
`+X)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(I===""||U==="")&&(K=!1);K&&(A.diagnostics={runnable:B,programLog:N,vertexShader:{log:I,prefix:p},fragmentShader:{log:U,prefix:y}})}n.deleteShader(b),n.deleteShader(T),w=new Or(n,m),M=_v(n,m)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let M;this.getAttributes=function(){return M===void 0&&C(this),M};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=n.getProgramParameter(m,cv)),D},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=uv++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=T,this}let Cv=0;class Lv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Iv(e),t.set(e,i)),i}}class Iv{constructor(e){this.id=Cv++,this.code=e,this.usedTimes=0}}function Dv(s,e,t,i,n,r,a){const o=new Gu,l=new Lv,c=[],u=n.isWebGL2,h=n.logarithmicDepthBuffer,d=n.vertexTextures;let f=n.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return w===0?"uv":`uv${w}`}function m(w,M,D,A,N){const I=A.fog,U=N.geometry,B=w.isMeshStandardMaterial?A.environment:null,K=(w.isMeshStandardMaterial?t:e).get(w.envMap||B),k=K&&K.mapping===$r?K.image.height:null,X=v[w.type];w.precision!==null&&(f=n.getMaxPrecision(w.precision),f!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",f,"instead."));const j=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Y=j!==void 0?j.length:0;let te=0;U.morphAttributes.position!==void 0&&(te=1),U.morphAttributes.normal!==void 0&&(te=2),U.morphAttributes.color!==void 0&&(te=3);let q,Z,ae,ye;if(X){const Bt=vi[X];q=Bt.vertexShader,Z=Bt.fragmentShader}else q=w.vertexShader,Z=w.fragmentShader,l.update(w),ae=l.getVertexShaderID(w),ye=l.getFragmentShaderID(w);const _e=s.getRenderTarget(),Le=N.isInstancedMesh===!0,Ne=N.isBatchedMesh===!0,Te=!!w.map,We=!!w.matcap,z=!!K,Ft=!!w.aoMap,be=!!w.lightMap,Pe=!!w.bumpMap,me=!!w.normalMap,lt=!!w.displacementMap,Be=!!w.emissiveMap,L=!!w.metalnessMap,E=!!w.roughnessMap,H=w.anisotropy>0,$=w.clearcoat>0,Q=w.iridescence>0,ee=w.sheen>0,ge=w.transmission>0,oe=H&&!!w.anisotropyMap,de=$&&!!w.clearcoatMap,Me=$&&!!w.clearcoatNormalMap,Oe=$&&!!w.clearcoatRoughnessMap,J=Q&&!!w.iridescenceMap,Ze=Q&&!!w.iridescenceThicknessMap,Ve=ee&&!!w.sheenColorMap,Re=ee&&!!w.sheenRoughnessMap,xe=!!w.specularMap,fe=!!w.specularColorMap,Ue=!!w.specularIntensityMap,je=ge&&!!w.transmissionMap,ht=ge&&!!w.thicknessMap,Ge=!!w.gradientMap,ie=!!w.alphaMap,F=w.alphaTest>0,se=!!w.alphaHash,re=!!w.extensions,Ee=!!U.attributes.uv1,Se=!!U.attributes.uv2,et=!!U.attributes.uv3;let tt=Ki;return w.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(tt=s.toneMapping),{isWebGL2:u,shaderID:X,shaderType:w.type,shaderName:w.name,vertexShader:q,fragmentShader:Z,defines:w.defines,customVertexShaderID:ae,customFragmentShaderID:ye,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:f,batching:Ne,instancing:Le,instancingColor:Le&&N.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:_e===null?s.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:fi,map:Te,matcap:We,envMap:z,envMapMode:z&&K.mapping,envMapCubeUVHeight:k,aoMap:Ft,lightMap:be,bumpMap:Pe,normalMap:me,displacementMap:d&&lt,emissiveMap:Be,normalMapObjectSpace:me&&w.normalMapType===Pd,normalMapTangentSpace:me&&w.normalMapType===Nu,metalnessMap:L,roughnessMap:E,anisotropy:H,anisotropyMap:oe,clearcoat:$,clearcoatMap:de,clearcoatNormalMap:Me,clearcoatRoughnessMap:Oe,iridescence:Q,iridescenceMap:J,iridescenceThicknessMap:Ze,sheen:ee,sheenColorMap:Ve,sheenRoughnessMap:Re,specularMap:xe,specularColorMap:fe,specularIntensityMap:Ue,transmission:ge,transmissionMap:je,thicknessMap:ht,gradientMap:Ge,opaque:w.transparent===!1&&w.blending===Yn,alphaMap:ie,alphaTest:F,alphaHash:se,combine:w.combine,mapUv:Te&&_(w.map.channel),aoMapUv:Ft&&_(w.aoMap.channel),lightMapUv:be&&_(w.lightMap.channel),bumpMapUv:Pe&&_(w.bumpMap.channel),normalMapUv:me&&_(w.normalMap.channel),displacementMapUv:lt&&_(w.displacementMap.channel),emissiveMapUv:Be&&_(w.emissiveMap.channel),metalnessMapUv:L&&_(w.metalnessMap.channel),roughnessMapUv:E&&_(w.roughnessMap.channel),anisotropyMapUv:oe&&_(w.anisotropyMap.channel),clearcoatMapUv:de&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:Me&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Oe&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ze&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:Re&&_(w.sheenRoughnessMap.channel),specularMapUv:xe&&_(w.specularMap.channel),specularColorMapUv:fe&&_(w.specularColorMap.channel),specularIntensityMapUv:Ue&&_(w.specularIntensityMap.channel),transmissionMapUv:je&&_(w.transmissionMap.channel),thicknessMapUv:ht&&_(w.thicknessMap.channel),alphaMapUv:ie&&_(w.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(me||H),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,vertexUv1s:Ee,vertexUv2s:Se,vertexUv3s:et,pointsUvs:N.isPoints===!0&&!!U.attributes.uv&&(Te||ie),fog:!!I,useFog:w.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:N.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Y,morphTextureStride:te,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:tt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Te&&w.map.isVideoTexture===!0&&Qe.getTransfer(w.map.colorSpace)===nt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===_i,flipSided:w.side===Ht,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionDerivatives:re&&w.extensions.derivatives===!0,extensionFragDepth:re&&w.extensions.fragDepth===!0,extensionDrawBuffers:re&&w.extensions.drawBuffers===!0,extensionShaderTextureLOD:re&&w.extensions.shaderTextureLOD===!0,extensionClipCullDistance:re&&w.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()}}function p(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const D in w.defines)M.push(D),M.push(w.defines[D]);return w.isRawShaderMaterial===!1&&(y(M,w),g(M,w),M.push(s.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function y(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function g(w,M){o.disableAll(),M.isWebGL2&&o.enable(0),M.supportsVertexTextures&&o.enable(1),M.instancing&&o.enable(2),M.instancingColor&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),w.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.skinning&&o.enable(4),M.morphTargets&&o.enable(5),M.morphNormals&&o.enable(6),M.morphColors&&o.enable(7),M.premultipliedAlpha&&o.enable(8),M.shadowMapEnabled&&o.enable(9),M.useLegacyLights&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),w.push(o.mask)}function x(w){const M=v[w.type];let D;if(M){const A=vi[M];D=mf.clone(A.uniforms)}else D=w.uniforms;return D}function S(w,M){let D;for(let A=0,N=c.length;A<N;A++){const I=c[A];if(I.cacheKey===M){D=I,++D.usedTimes;break}}return D===void 0&&(D=new Pv(s,M,w,r),c.push(D)),D}function b(w){if(--w.usedTimes===0){const M=c.indexOf(w);c[M]=c[c.length-1],c.pop(),w.destroy()}}function T(w){l.remove(w)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:S,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:C}}function Nv(){let s=new WeakMap;function e(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function t(r){s.delete(r)}function i(r,a,o){s.get(r)[a]=o}function n(){s=new WeakMap}return{get:e,remove:t,update:i,dispose:n}}function Uv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Tc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Ec(){const s=[];let e=0;const t=[],i=[],n=[];function r(){e=0,t.length=0,i.length=0,n.length=0}function a(h,d,f,v,_,m){let p=s[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:v,renderOrder:h.renderOrder,z:_,group:m},s[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=v,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function o(h,d,f,v,_,m){const p=a(h,d,f,v,_,m);f.transmission>0?i.push(p):f.transparent===!0?n.push(p):t.push(p)}function l(h,d,f,v,_,m){const p=a(h,d,f,v,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?n.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||Uv),i.length>1&&i.sort(d||Tc),n.length>1&&n.sort(d||Tc)}function u(){for(let h=e,d=s.length;h<d;h++){const f=s[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:n,init:r,push:o,unshift:l,finish:u,sort:c}}function Fv(){let s=new WeakMap;function e(i,n){const r=s.get(i);let a;return r===void 0?(a=new Ec,s.set(i,[a])):n>=r.length?(a=new Ec,r.push(a)):a=r[n],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Bv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new ue};break;case"SpotLight":t={position:new P,direction:new P,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":t={color:new ue,position:new P,halfWidth:new P,halfHeight:new P};break}return s[e.id]=t,t}}}function Ov(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let kv=0;function zv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Gv(s,e){const t=new Bv,i=Ov(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)n.probe.push(new P);const r=new P,a=new he,o=new he;function l(u,h){let d=0,f=0,v=0;for(let A=0;A<9;A++)n.probe[A].set(0,0,0);let _=0,m=0,p=0,y=0,g=0,x=0,S=0,b=0,T=0,C=0,w=0;u.sort(zv);const M=h===!0?Math.PI:1;for(let A=0,N=u.length;A<N;A++){const I=u[A],U=I.color,B=I.intensity,K=I.distance,k=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=U.r*B*M,f+=U.g*B*M,v+=U.b*B*M;else if(I.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(I.sh.coefficients[X],B);w++}else if(I.isDirectionalLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity*M),I.castShadow){const j=I.shadow,Y=i.get(I);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,n.directionalShadow[_]=Y,n.directionalShadowMap[_]=k,n.directionalShadowMatrix[_]=I.shadow.matrix,x++}n.directional[_]=X,_++}else if(I.isSpotLight){const X=t.get(I);X.position.setFromMatrixPosition(I.matrixWorld),X.color.copy(U).multiplyScalar(B*M),X.distance=K,X.coneCos=Math.cos(I.angle),X.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),X.decay=I.decay,n.spot[p]=X;const j=I.shadow;if(I.map&&(n.spotLightMap[T]=I.map,T++,j.updateMatrices(I),I.castShadow&&C++),n.spotLightMatrix[p]=j.matrix,I.castShadow){const Y=i.get(I);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,n.spotShadow[p]=Y,n.spotShadowMap[p]=k,b++}p++}else if(I.isRectAreaLight){const X=t.get(I);X.color.copy(U).multiplyScalar(B),X.halfWidth.set(I.width*.5,0,0),X.halfHeight.set(0,I.height*.5,0),n.rectArea[y]=X,y++}else if(I.isPointLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity*M),X.distance=I.distance,X.decay=I.decay,I.castShadow){const j=I.shadow,Y=i.get(I);Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,Y.shadowCameraNear=j.camera.near,Y.shadowCameraFar=j.camera.far,n.pointShadow[m]=Y,n.pointShadowMap[m]=k,n.pointShadowMatrix[m]=I.shadow.matrix,S++}n.point[m]=X,m++}else if(I.isHemisphereLight){const X=t.get(I);X.skyColor.copy(I.color).multiplyScalar(B*M),X.groundColor.copy(I.groundColor).multiplyScalar(B*M),n.hemi[g]=X,g++}}y>0&&(e.isWebGL2?s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ne.LTC_FLOAT_1,n.rectAreaLTC2=ne.LTC_FLOAT_2):(n.rectAreaLTC1=ne.LTC_HALF_1,n.rectAreaLTC2=ne.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ne.LTC_FLOAT_1,n.rectAreaLTC2=ne.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(n.rectAreaLTC1=ne.LTC_HALF_1,n.rectAreaLTC2=ne.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),n.ambient[0]=d,n.ambient[1]=f,n.ambient[2]=v;const D=n.hash;(D.directionalLength!==_||D.pointLength!==m||D.spotLength!==p||D.rectAreaLength!==y||D.hemiLength!==g||D.numDirectionalShadows!==x||D.numPointShadows!==S||D.numSpotShadows!==b||D.numSpotMaps!==T||D.numLightProbes!==w)&&(n.directional.length=_,n.spot.length=p,n.rectArea.length=y,n.point.length=m,n.hemi.length=g,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=b+T-C,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=w,D.directionalLength=_,D.pointLength=m,D.spotLength=p,D.rectAreaLength=y,D.hemiLength=g,D.numDirectionalShadows=x,D.numPointShadows=S,D.numSpotShadows=b,D.numSpotMaps=T,D.numLightProbes=w,n.version=kv++)}function c(u,h){let d=0,f=0,v=0,_=0,m=0;const p=h.matrixWorldInverse;for(let y=0,g=u.length;y<g;y++){const x=u[y];if(x.isDirectionalLight){const S=n.directional[d];S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),d++}else if(x.isSpotLight){const S=n.spot[v];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),v++}else if(x.isRectAreaLight){const S=n.rectArea[_];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),o.identity(),a.copy(x.matrixWorld),a.premultiply(p),o.extractRotation(a),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),f++}else if(x.isHemisphereLight){const S=n.hemi[m];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:n}}function Ac(s,e){const t=new Gv(s,e),i=[],n=[];function r(){i.length=0,n.length=0}function a(h){i.push(h)}function o(h){n.push(h)}function l(h){t.setup(i,h)}function c(h){t.setupView(i,h)}return{init:r,state:{lightsArray:i,shadowsArray:n,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Hv(s,e){let t=new WeakMap;function i(r,a=0){const o=t.get(r);let l;return o===void 0?(l=new Ac(s,e),t.set(r,[l])):a>=o.length?(l=new Ac(s,e),o.push(l)):l=o[a],l}function n(){t=new WeakMap}return{get:i,dispose:n}}class Vv extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ad,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Wv extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Xv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qv=`uniform sampler2D shadow_pass;
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
}`;function Kv(s,e,t){let i=new Ho;const n=new le,r=new le,a=new qe,o=new Vv({depthPacking:Rd}),l=new Wv,c={},u=t.maxTextureSize,h={[ti]:Ht,[Ht]:ti,[_i]:_i},d=new st({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:Xv,fragmentShader:qv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const v=new Rt;v.setAttribute("position",new $e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ut(v,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Tu;let p=this.type;this.render=function(b,T,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const w=s.getRenderTarget(),M=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),A=s.state;A.setBlending(qi),A.buffers.color.setClear(1,1,1,1),A.buffers.depth.setTest(!0),A.setScissorTest(!1);const N=p!==Ci&&this.type===Ci,I=p===Ci&&this.type!==Ci;for(let U=0,B=b.length;U<B;U++){const K=b[U],k=K.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;n.copy(k.mapSize);const X=k.getFrameExtents();if(n.multiply(X),r.copy(k.mapSize),(n.x>u||n.y>u)&&(n.x>u&&(r.x=Math.floor(u/X.x),n.x=r.x*X.x,k.mapSize.x=r.x),n.y>u&&(r.y=Math.floor(u/X.y),n.y=r.y*X.y,k.mapSize.y=r.y)),k.map===null||N===!0||I===!0){const Y=this.type!==Ci?{minFilter:ze,magFilter:ze}:{};k.map!==null&&k.map.dispose(),k.map=new xt(n.x,n.y,Y),k.map.texture.name=K.name+".shadowMap",k.camera.updateProjectionMatrix()}s.setRenderTarget(k.map),s.clear();const j=k.getViewportCount();for(let Y=0;Y<j;Y++){const te=k.getViewport(Y);a.set(r.x*te.x,r.y*te.y,r.x*te.z,r.y*te.w),A.viewport(a),k.updateMatrices(K,Y),i=k.getFrustum(),x(T,C,k.camera,K,this.type)}k.isPointLightShadow!==!0&&this.type===Ci&&y(k,C),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(w,M,D)};function y(b,T){const C=e.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new xt(n.x,n.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(T,null,C,d,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(T,null,C,f,_,null)}function g(b,T,C,w){let M=null;const D=C.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)M=D;else if(M=C.isPointLight===!0?l:o,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const A=M.uuid,N=T.uuid;let I=c[A];I===void 0&&(I={},c[A]=I);let U=I[N];U===void 0&&(U=M.clone(),I[N]=U,T.addEventListener("dispose",S)),M=U}if(M.visible=T.visible,M.wireframe=T.wireframe,w===Ci?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:h[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const A=s.properties.get(M);A.light=C}return M}function x(b,T,C,w,M){if(b.visible===!1)return;if(b.layers.test(T.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===Ci)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,b.matrixWorld);const N=e.update(b),I=b.material;if(Array.isArray(I)){const U=N.groups;for(let B=0,K=U.length;B<K;B++){const k=U[B],X=I[k.materialIndex];if(X&&X.visible){const j=g(b,X,w,M);b.onBeforeShadow(s,b,T,C,N,j,k),s.renderBufferDirect(C,null,N,j,b,k),b.onAfterShadow(s,b,T,C,N,j,k)}}}else if(I.visible){const U=g(b,I,w,M);b.onBeforeShadow(s,b,T,C,N,U,null),s.renderBufferDirect(C,null,N,U,b,null),b.onAfterShadow(s,b,T,C,N,U,null)}}const A=b.children;for(let N=0,I=A.length;N<I;N++)x(A[N],T,C,w,M)}function S(b){b.target.removeEventListener("dispose",S);for(const C in c){const w=c[C],M=b.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}function jv(s,e,t){const i=t.isWebGL2;function n(){let F=!1;const se=new qe;let re=null;const Ee=new qe(0,0,0,0);return{setMask:function(Se){re!==Se&&!F&&(s.colorMask(Se,Se,Se,Se),re=Se)},setLocked:function(Se){F=Se},setClear:function(Se,et,tt,wt,Bt){Bt===!0&&(Se*=wt,et*=wt,tt*=wt),se.set(Se,et,tt,wt),Ee.equals(se)===!1&&(s.clearColor(Se,et,tt,wt),Ee.copy(se))},reset:function(){F=!1,re=null,Ee.set(-1,0,0,0)}}}function r(){let F=!1,se=null,re=null,Ee=null;return{setTest:function(Se){Se?Ne(s.DEPTH_TEST):Te(s.DEPTH_TEST)},setMask:function(Se){se!==Se&&!F&&(s.depthMask(Se),se=Se)},setFunc:function(Se){if(re!==Se){switch(Se){case ed:s.depthFunc(s.NEVER);break;case td:s.depthFunc(s.ALWAYS);break;case id:s.depthFunc(s.LESS);break;case zr:s.depthFunc(s.LEQUAL);break;case nd:s.depthFunc(s.EQUAL);break;case sd:s.depthFunc(s.GEQUAL);break;case rd:s.depthFunc(s.GREATER);break;case ad:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}re=Se}},setLocked:function(Se){F=Se},setClear:function(Se){Ee!==Se&&(s.clearDepth(Se),Ee=Se)},reset:function(){F=!1,se=null,re=null,Ee=null}}}function a(){let F=!1,se=null,re=null,Ee=null,Se=null,et=null,tt=null,wt=null,Bt=null;return{setTest:function(it){F||(it?Ne(s.STENCIL_TEST):Te(s.STENCIL_TEST))},setMask:function(it){se!==it&&!F&&(s.stencilMask(it),se=it)},setFunc:function(it,Ot,mi){(re!==it||Ee!==Ot||Se!==mi)&&(s.stencilFunc(it,Ot,mi),re=it,Ee=Ot,Se=mi)},setOp:function(it,Ot,mi){(et!==it||tt!==Ot||wt!==mi)&&(s.stencilOp(it,Ot,mi),et=it,tt=Ot,wt=mi)},setLocked:function(it){F=it},setClear:function(it){Bt!==it&&(s.clearStencil(it),Bt=it)},reset:function(){F=!1,se=null,re=null,Ee=null,Se=null,et=null,tt=null,wt=null,Bt=null}}}const o=new n,l=new r,c=new a,u=new WeakMap,h=new WeakMap;let d={},f={},v=new WeakMap,_=[],m=null,p=!1,y=null,g=null,x=null,S=null,b=null,T=null,C=null,w=new ue(0,0,0),M=0,D=!1,A=null,N=null,I=null,U=null,B=null;const K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,X=0;const j=s.getParameter(s.VERSION);j.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(j)[1]),k=X>=1):j.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),k=X>=2);let Y=null,te={};const q=s.getParameter(s.SCISSOR_BOX),Z=s.getParameter(s.VIEWPORT),ae=new qe().fromArray(q),ye=new qe().fromArray(Z);function _e(F,se,re,Ee){const Se=new Uint8Array(4),et=s.createTexture();s.bindTexture(F,et),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let tt=0;tt<re;tt++)i&&(F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY)?s.texImage3D(se,0,s.RGBA,1,1,Ee,0,s.RGBA,s.UNSIGNED_BYTE,Se):s.texImage2D(se+tt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Se);return et}const Le={};Le[s.TEXTURE_2D]=_e(s.TEXTURE_2D,s.TEXTURE_2D,1),Le[s.TEXTURE_CUBE_MAP]=_e(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Le[s.TEXTURE_2D_ARRAY]=_e(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Le[s.TEXTURE_3D]=_e(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ne(s.DEPTH_TEST),l.setFunc(zr),Be(!1),L(ol),Ne(s.CULL_FACE),me(qi);function Ne(F){d[F]!==!0&&(s.enable(F),d[F]=!0)}function Te(F){d[F]!==!1&&(s.disable(F),d[F]=!1)}function We(F,se){return f[F]!==se?(s.bindFramebuffer(F,se),f[F]=se,i&&(F===s.DRAW_FRAMEBUFFER&&(f[s.FRAMEBUFFER]=se),F===s.FRAMEBUFFER&&(f[s.DRAW_FRAMEBUFFER]=se)),!0):!1}function z(F,se){let re=_,Ee=!1;if(F)if(re=v.get(se),re===void 0&&(re=[],v.set(se,re)),F.isWebGLMultipleRenderTargets){const Se=F.texture;if(re.length!==Se.length||re[0]!==s.COLOR_ATTACHMENT0){for(let et=0,tt=Se.length;et<tt;et++)re[et]=s.COLOR_ATTACHMENT0+et;re.length=Se.length,Ee=!0}}else re[0]!==s.COLOR_ATTACHMENT0&&(re[0]=s.COLOR_ATTACHMENT0,Ee=!0);else re[0]!==s.BACK&&(re[0]=s.BACK,Ee=!0);Ee&&(t.isWebGL2?s.drawBuffers(re):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(re))}function Ft(F){return m!==F?(s.useProgram(F),m=F,!0):!1}const be={[on]:s.FUNC_ADD,[kh]:s.FUNC_SUBTRACT,[zh]:s.FUNC_REVERSE_SUBTRACT};if(i)be[hl]=s.MIN,be[dl]=s.MAX;else{const F=e.get("EXT_blend_minmax");F!==null&&(be[hl]=F.MIN_EXT,be[dl]=F.MAX_EXT)}const Pe={[Gh]:s.ZERO,[Hh]:s.ONE,[Vh]:s.SRC_COLOR,[fo]:s.SRC_ALPHA,[Yh]:s.SRC_ALPHA_SATURATE,[Kh]:s.DST_COLOR,[Xh]:s.DST_ALPHA,[Wh]:s.ONE_MINUS_SRC_COLOR,[po]:s.ONE_MINUS_SRC_ALPHA,[jh]:s.ONE_MINUS_DST_COLOR,[qh]:s.ONE_MINUS_DST_ALPHA,[Zh]:s.CONSTANT_COLOR,[Jh]:s.ONE_MINUS_CONSTANT_COLOR,[Qh]:s.CONSTANT_ALPHA,[$h]:s.ONE_MINUS_CONSTANT_ALPHA};function me(F,se,re,Ee,Se,et,tt,wt,Bt,it){if(F===qi){p===!0&&(Te(s.BLEND),p=!1);return}if(p===!1&&(Ne(s.BLEND),p=!0),F!==Oh){if(F!==y||it!==D){if((g!==on||b!==on)&&(s.blendEquation(s.FUNC_ADD),g=on,b=on),it)switch(F){case Yn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ll:s.blendFunc(s.ONE,s.ONE);break;case cl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ul:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Yn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ll:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case cl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ul:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}x=null,S=null,T=null,C=null,w.set(0,0,0),M=0,y=F,D=it}return}Se=Se||se,et=et||re,tt=tt||Ee,(se!==g||Se!==b)&&(s.blendEquationSeparate(be[se],be[Se]),g=se,b=Se),(re!==x||Ee!==S||et!==T||tt!==C)&&(s.blendFuncSeparate(Pe[re],Pe[Ee],Pe[et],Pe[tt]),x=re,S=Ee,T=et,C=tt),(wt.equals(w)===!1||Bt!==M)&&(s.blendColor(wt.r,wt.g,wt.b,Bt),w.copy(wt),M=Bt),y=F,D=!1}function lt(F,se){F.side===_i?Te(s.CULL_FACE):Ne(s.CULL_FACE);let re=F.side===Ht;se&&(re=!re),Be(re),F.blending===Yn&&F.transparent===!1?me(qi):me(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),l.setFunc(F.depthFunc),l.setTest(F.depthTest),l.setMask(F.depthWrite),o.setMask(F.colorWrite);const Ee=F.stencilWrite;c.setTest(Ee),Ee&&(c.setMask(F.stencilWriteMask),c.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),c.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),H(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?Ne(s.SAMPLE_ALPHA_TO_COVERAGE):Te(s.SAMPLE_ALPHA_TO_COVERAGE)}function Be(F){A!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),A=F)}function L(F){F!==Uh?(Ne(s.CULL_FACE),F!==N&&(F===ol?s.cullFace(s.BACK):F===Fh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Te(s.CULL_FACE),N=F}function E(F){F!==I&&(k&&s.lineWidth(F),I=F)}function H(F,se,re){F?(Ne(s.POLYGON_OFFSET_FILL),(U!==se||B!==re)&&(s.polygonOffset(se,re),U=se,B=re)):Te(s.POLYGON_OFFSET_FILL)}function $(F){F?Ne(s.SCISSOR_TEST):Te(s.SCISSOR_TEST)}function Q(F){F===void 0&&(F=s.TEXTURE0+K-1),Y!==F&&(s.activeTexture(F),Y=F)}function ee(F,se,re){re===void 0&&(Y===null?re=s.TEXTURE0+K-1:re=Y);let Ee=te[re];Ee===void 0&&(Ee={type:void 0,texture:void 0},te[re]=Ee),(Ee.type!==F||Ee.texture!==se)&&(Y!==re&&(s.activeTexture(re),Y=re),s.bindTexture(F,se||Le[F]),Ee.type=F,Ee.texture=se)}function ge(){const F=te[Y];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function oe(){try{s.compressedTexImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function de(){try{s.compressedTexImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Me(){try{s.texSubImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Oe(){try{s.texSubImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ze(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ve(){try{s.texStorage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Re(){try{s.texStorage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function xe(){try{s.texImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function fe(){try{s.texImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ue(F){ae.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),ae.copy(F))}function je(F){ye.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),ye.copy(F))}function ht(F,se){let re=h.get(se);re===void 0&&(re=new WeakMap,h.set(se,re));let Ee=re.get(F);Ee===void 0&&(Ee=s.getUniformBlockIndex(se,F.name),re.set(F,Ee))}function Ge(F,se){const Ee=h.get(se).get(F);u.get(se)!==Ee&&(s.uniformBlockBinding(se,Ee,F.__bindingPointIndex),u.set(se,Ee))}function ie(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),i===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},Y=null,te={},f={},v=new WeakMap,_=[],m=null,p=!1,y=null,g=null,x=null,S=null,b=null,T=null,C=null,w=new ue(0,0,0),M=0,D=!1,A=null,N=null,I=null,U=null,B=null,ae.set(0,0,s.canvas.width,s.canvas.height),ye.set(0,0,s.canvas.width,s.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Ne,disable:Te,bindFramebuffer:We,drawBuffers:z,useProgram:Ft,setBlending:me,setMaterial:lt,setFlipSided:Be,setCullFace:L,setLineWidth:E,setPolygonOffset:H,setScissorTest:$,activeTexture:Q,bindTexture:ee,unbindTexture:ge,compressedTexImage2D:oe,compressedTexImage3D:de,texImage2D:xe,texImage3D:fe,updateUBOMapping:ht,uniformBlockBinding:Ge,texStorage2D:Ve,texStorage3D:Re,texSubImage2D:Me,texSubImage3D:Oe,compressedTexSubImage2D:J,compressedTexSubImage3D:Ze,scissor:Ue,viewport:je,reset:ie}}function Yv(s,e,t,i,n,r,a){const o=n.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(L,E){return f?new OffscreenCanvas(L,E):Is("canvas")}function _(L,E,H,$){let Q=1;if((L.width>$||L.height>$)&&(Q=$/Math.max(L.width,L.height)),Q<1||E===!0)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap){const ee=E?jr:Math.floor,ge=ee(Q*L.width),oe=ee(Q*L.height);h===void 0&&(h=v(ge,oe));const de=H?v(ge,oe):h;return de.width=ge,de.height=oe,de.getContext("2d").drawImage(L,0,0,ge,oe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+ge+"x"+oe+")."),de}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),L;return L}function m(L){return So(L.width)&&So(L.height)}function p(L){return o?!1:L.wrapS!==Ct||L.wrapT!==Ct||L.minFilter!==ze&&L.minFilter!==Ke}function y(L,E){return L.generateMipmaps&&E&&L.minFilter!==ze&&L.minFilter!==Ke}function g(L){s.generateMipmap(L)}function x(L,E,H,$,Q=!1){if(o===!1)return E;if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let ee=E;if(E===s.RED&&(H===s.FLOAT&&(ee=s.R32F),H===s.HALF_FLOAT&&(ee=s.R16F),H===s.UNSIGNED_BYTE&&(ee=s.R8)),E===s.RED_INTEGER&&(H===s.UNSIGNED_BYTE&&(ee=s.R8UI),H===s.UNSIGNED_SHORT&&(ee=s.R16UI),H===s.UNSIGNED_INT&&(ee=s.R32UI),H===s.BYTE&&(ee=s.R8I),H===s.SHORT&&(ee=s.R16I),H===s.INT&&(ee=s.R32I)),E===s.RG&&(H===s.FLOAT&&(ee=s.RG32F),H===s.HALF_FLOAT&&(ee=s.RG16F),H===s.UNSIGNED_BYTE&&(ee=s.RG8)),E===s.RGBA){const ge=Q?Wr:Qe.getTransfer($);H===s.FLOAT&&(ee=s.RGBA32F),H===s.HALF_FLOAT&&(ee=s.RGBA16F),H===s.UNSIGNED_BYTE&&(ee=ge===nt?s.SRGB8_ALPHA8:s.RGBA8),H===s.UNSIGNED_SHORT_4_4_4_4&&(ee=s.RGBA4),H===s.UNSIGNED_SHORT_5_5_5_1&&(ee=s.RGB5_A1)}return(ee===s.R16F||ee===s.R32F||ee===s.RG16F||ee===s.RG32F||ee===s.RGBA16F||ee===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function S(L,E,H){return y(L,H)===!0||L.isFramebufferTexture&&L.minFilter!==ze&&L.minFilter!==Ke?Math.log2(Math.max(E.width,E.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?E.mipmaps.length:1}function b(L){return L===ze||L===pl||L===ga?s.NEAREST:s.LINEAR}function T(L){const E=L.target;E.removeEventListener("dispose",T),w(E),E.isVideoTexture&&u.delete(E)}function C(L){const E=L.target;E.removeEventListener("dispose",C),D(E)}function w(L){const E=i.get(L);if(E.__webglInit===void 0)return;const H=L.source,$=d.get(H);if($){const Q=$[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&M(L),Object.keys($).length===0&&d.delete(H)}i.remove(L)}function M(L){const E=i.get(L);s.deleteTexture(E.__webglTexture);const H=L.source,$=d.get(H);delete $[E.__cacheKey],a.memory.textures--}function D(L){const E=L.texture,H=i.get(L),$=i.get(E);if($.__webglTexture!==void 0&&(s.deleteTexture($.__webglTexture),a.memory.textures--),L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(H.__webglFramebuffer[Q]))for(let ee=0;ee<H.__webglFramebuffer[Q].length;ee++)s.deleteFramebuffer(H.__webglFramebuffer[Q][ee]);else s.deleteFramebuffer(H.__webglFramebuffer[Q]);H.__webglDepthbuffer&&s.deleteRenderbuffer(H.__webglDepthbuffer[Q])}else{if(Array.isArray(H.__webglFramebuffer))for(let Q=0;Q<H.__webglFramebuffer.length;Q++)s.deleteFramebuffer(H.__webglFramebuffer[Q]);else s.deleteFramebuffer(H.__webglFramebuffer);if(H.__webglDepthbuffer&&s.deleteRenderbuffer(H.__webglDepthbuffer),H.__webglMultisampledFramebuffer&&s.deleteFramebuffer(H.__webglMultisampledFramebuffer),H.__webglColorRenderbuffer)for(let Q=0;Q<H.__webglColorRenderbuffer.length;Q++)H.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(H.__webglColorRenderbuffer[Q]);H.__webglDepthRenderbuffer&&s.deleteRenderbuffer(H.__webglDepthRenderbuffer)}if(L.isWebGLMultipleRenderTargets)for(let Q=0,ee=E.length;Q<ee;Q++){const ge=i.get(E[Q]);ge.__webglTexture&&(s.deleteTexture(ge.__webglTexture),a.memory.textures--),i.remove(E[Q])}i.remove(E),i.remove(L)}let A=0;function N(){A=0}function I(){const L=A;return L>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+n.maxTextures),A+=1,L}function U(L){const E=[];return E.push(L.wrapS),E.push(L.wrapT),E.push(L.wrapR||0),E.push(L.magFilter),E.push(L.minFilter),E.push(L.anisotropy),E.push(L.internalFormat),E.push(L.format),E.push(L.type),E.push(L.generateMipmaps),E.push(L.premultiplyAlpha),E.push(L.flipY),E.push(L.unpackAlignment),E.push(L.colorSpace),E.join()}function B(L,E){const H=i.get(L);if(L.isVideoTexture&&lt(L),L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){const $=L.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ae(H,L,E);return}}t.bindTexture(s.TEXTURE_2D,H.__webglTexture,s.TEXTURE0+E)}function K(L,E){const H=i.get(L);if(L.version>0&&H.__version!==L.version){ae(H,L,E);return}t.bindTexture(s.TEXTURE_2D_ARRAY,H.__webglTexture,s.TEXTURE0+E)}function k(L,E){const H=i.get(L);if(L.version>0&&H.__version!==L.version){ae(H,L,E);return}t.bindTexture(s.TEXTURE_3D,H.__webglTexture,s.TEXTURE0+E)}function X(L,E){const H=i.get(L);if(L.version>0&&H.__version!==L.version){ye(H,L,E);return}t.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture,s.TEXTURE0+E)}const j={[vo]:s.REPEAT,[Ct]:s.CLAMP_TO_EDGE,[_o]:s.MIRRORED_REPEAT},Y={[ze]:s.NEAREST,[pl]:s.NEAREST_MIPMAP_NEAREST,[ga]:s.NEAREST_MIPMAP_LINEAR,[Ke]:s.LINEAR,[gd]:s.LINEAR_MIPMAP_NEAREST,[Cs]:s.LINEAR_MIPMAP_LINEAR},te={[Cd]:s.NEVER,[Fd]:s.ALWAYS,[Ld]:s.LESS,[Uu]:s.LEQUAL,[Id]:s.EQUAL,[Ud]:s.GEQUAL,[Dd]:s.GREATER,[Nd]:s.NOTEQUAL};function q(L,E,H){if(H?(s.texParameteri(L,s.TEXTURE_WRAP_S,j[E.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,j[E.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,j[E.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,Y[E.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,Y[E.minFilter])):(s.texParameteri(L,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(L,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(E.wrapS!==Ct||E.wrapT!==Ct)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(L,s.TEXTURE_MAG_FILTER,b(E.magFilter)),s.texParameteri(L,s.TEXTURE_MIN_FILTER,b(E.minFilter)),E.minFilter!==ze&&E.minFilter!==Ke&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,te[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const $=e.get("EXT_texture_filter_anisotropic");if(E.magFilter===ze||E.minFilter!==ga&&E.minFilter!==Cs||E.type===pt&&e.has("OES_texture_float_linear")===!1||o===!1&&E.type===Et&&e.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||i.get(E).__currentAnisotropy)&&(s.texParameterf(L,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,n.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy)}}function Z(L,E){let H=!1;L.__webglInit===void 0&&(L.__webglInit=!0,E.addEventListener("dispose",T));const $=E.source;let Q=d.get($);Q===void 0&&(Q={},d.set($,Q));const ee=U(E);if(ee!==L.__cacheKey){Q[ee]===void 0&&(Q[ee]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[ee].usedTimes++;const ge=Q[L.__cacheKey];ge!==void 0&&(Q[L.__cacheKey].usedTimes--,ge.usedTimes===0&&M(E)),L.__cacheKey=ee,L.__webglTexture=Q[ee].texture}return H}function ae(L,E,H){let $=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&($=s.TEXTURE_3D);const Q=Z(L,E),ee=E.source;t.bindTexture($,L.__webglTexture,s.TEXTURE0+H);const ge=i.get(ee);if(ee.version!==ge.__version||Q===!0){t.activeTexture(s.TEXTURE0+H);const oe=Qe.getPrimaries(Qe.workingColorSpace),de=E.colorSpace===Xt?null:Qe.getPrimaries(E.colorSpace),Me=E.colorSpace===Xt||oe===de?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const Oe=p(E)&&m(E.image)===!1;let J=_(E.image,Oe,!1,n.maxTextureSize);J=Be(E,J);const Ze=m(J)||o,Ve=r.convert(E.format,E.colorSpace);let Re=r.convert(E.type),xe=x(E.internalFormat,Ve,Re,E.colorSpace,E.isVideoTexture);q($,E,Ze);let fe;const Ue=E.mipmaps,je=o&&E.isVideoTexture!==!0&&xe!==Iu,ht=ge.__version===void 0||Q===!0,Ge=S(E,J,Ze);if(E.isDepthTexture)xe=s.DEPTH_COMPONENT,o?E.type===pt?xe=s.DEPTH_COMPONENT32F:E.type===Qt?xe=s.DEPTH_COMPONENT24:E.type===cn?xe=s.DEPTH24_STENCIL8:xe=s.DEPTH_COMPONENT16:E.type===pt&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===un&&xe===s.DEPTH_COMPONENT&&E.type!==ea&&E.type!==Qt&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Qt,Re=r.convert(E.type)),E.format===es&&xe===s.DEPTH_COMPONENT&&(xe=s.DEPTH_STENCIL,E.type!==cn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=cn,Re=r.convert(E.type))),ht&&(je?t.texStorage2D(s.TEXTURE_2D,1,xe,J.width,J.height):t.texImage2D(s.TEXTURE_2D,0,xe,J.width,J.height,0,Ve,Re,null));else if(E.isDataTexture)if(Ue.length>0&&Ze){je&&ht&&t.texStorage2D(s.TEXTURE_2D,Ge,xe,Ue[0].width,Ue[0].height);for(let ie=0,F=Ue.length;ie<F;ie++)fe=Ue[ie],je?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,fe.width,fe.height,Ve,Re,fe.data):t.texImage2D(s.TEXTURE_2D,ie,xe,fe.width,fe.height,0,Ve,Re,fe.data);E.generateMipmaps=!1}else je?(ht&&t.texStorage2D(s.TEXTURE_2D,Ge,xe,J.width,J.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,J.width,J.height,Ve,Re,J.data)):t.texImage2D(s.TEXTURE_2D,0,xe,J.width,J.height,0,Ve,Re,J.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){je&&ht&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ge,xe,Ue[0].width,Ue[0].height,J.depth);for(let ie=0,F=Ue.length;ie<F;ie++)fe=Ue[ie],E.format!==Xe?Ve!==null?je?t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,fe.width,fe.height,J.depth,Ve,fe.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ie,xe,fe.width,fe.height,J.depth,0,fe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?t.texSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,fe.width,fe.height,J.depth,Ve,Re,fe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ie,xe,fe.width,fe.height,J.depth,0,Ve,Re,fe.data)}else{je&&ht&&t.texStorage2D(s.TEXTURE_2D,Ge,xe,Ue[0].width,Ue[0].height);for(let ie=0,F=Ue.length;ie<F;ie++)fe=Ue[ie],E.format!==Xe?Ve!==null?je?t.compressedTexSubImage2D(s.TEXTURE_2D,ie,0,0,fe.width,fe.height,Ve,fe.data):t.compressedTexImage2D(s.TEXTURE_2D,ie,xe,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,fe.width,fe.height,Ve,Re,fe.data):t.texImage2D(s.TEXTURE_2D,ie,xe,fe.width,fe.height,0,Ve,Re,fe.data)}else if(E.isDataArrayTexture)je?(ht&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ge,xe,J.width,J.height,J.depth),t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Ve,Re,J.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,xe,J.width,J.height,J.depth,0,Ve,Re,J.data);else if(E.isData3DTexture)je?(ht&&t.texStorage3D(s.TEXTURE_3D,Ge,xe,J.width,J.height,J.depth),t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Ve,Re,J.data)):t.texImage3D(s.TEXTURE_3D,0,xe,J.width,J.height,J.depth,0,Ve,Re,J.data);else if(E.isFramebufferTexture){if(ht)if(je)t.texStorage2D(s.TEXTURE_2D,Ge,xe,J.width,J.height);else{let ie=J.width,F=J.height;for(let se=0;se<Ge;se++)t.texImage2D(s.TEXTURE_2D,se,xe,ie,F,0,Ve,Re,null),ie>>=1,F>>=1}}else if(Ue.length>0&&Ze){je&&ht&&t.texStorage2D(s.TEXTURE_2D,Ge,xe,Ue[0].width,Ue[0].height);for(let ie=0,F=Ue.length;ie<F;ie++)fe=Ue[ie],je?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,Ve,Re,fe):t.texImage2D(s.TEXTURE_2D,ie,xe,Ve,Re,fe);E.generateMipmaps=!1}else je?(ht&&t.texStorage2D(s.TEXTURE_2D,Ge,xe,J.width,J.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,Ve,Re,J)):t.texImage2D(s.TEXTURE_2D,0,xe,Ve,Re,J);y(E,Ze)&&g($),ge.__version=ee.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function ye(L,E,H){if(E.image.length!==6)return;const $=Z(L,E),Q=E.source;t.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+H);const ee=i.get(Q);if(Q.version!==ee.__version||$===!0){t.activeTexture(s.TEXTURE0+H);const ge=Qe.getPrimaries(Qe.workingColorSpace),oe=E.colorSpace===Xt?null:Qe.getPrimaries(E.colorSpace),de=E.colorSpace===Xt||ge===oe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);const Me=E.isCompressedTexture||E.image[0].isCompressedTexture,Oe=E.image[0]&&E.image[0].isDataTexture,J=[];for(let ie=0;ie<6;ie++)!Me&&!Oe?J[ie]=_(E.image[ie],!1,!0,n.maxCubemapSize):J[ie]=Oe?E.image[ie].image:E.image[ie],J[ie]=Be(E,J[ie]);const Ze=J[0],Ve=m(Ze)||o,Re=r.convert(E.format,E.colorSpace),xe=r.convert(E.type),fe=x(E.internalFormat,Re,xe,E.colorSpace),Ue=o&&E.isVideoTexture!==!0,je=ee.__version===void 0||$===!0;let ht=S(E,Ze,Ve);q(s.TEXTURE_CUBE_MAP,E,Ve);let Ge;if(Me){Ue&&je&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ht,fe,Ze.width,Ze.height);for(let ie=0;ie<6;ie++){Ge=J[ie].mipmaps;for(let F=0;F<Ge.length;F++){const se=Ge[F];E.format!==Xe?Re!==null?Ue?t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F,0,0,se.width,se.height,Re,se.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F,fe,se.width,se.height,0,se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F,0,0,se.width,se.height,Re,xe,se.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F,fe,se.width,se.height,0,Re,xe,se.data)}}}else{Ge=E.mipmaps,Ue&&je&&(Ge.length>0&&ht++,t.texStorage2D(s.TEXTURE_CUBE_MAP,ht,fe,J[0].width,J[0].height));for(let ie=0;ie<6;ie++)if(Oe){Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,J[ie].width,J[ie].height,Re,xe,J[ie].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,fe,J[ie].width,J[ie].height,0,Re,xe,J[ie].data);for(let F=0;F<Ge.length;F++){const re=Ge[F].image[ie].image;Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F+1,0,0,re.width,re.height,Re,xe,re.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F+1,fe,re.width,re.height,0,Re,xe,re.data)}}else{Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Re,xe,J[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,fe,Re,xe,J[ie]);for(let F=0;F<Ge.length;F++){const se=Ge[F];Ue?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F+1,0,0,Re,xe,se.image[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,F+1,fe,Re,xe,se.image[ie])}}}y(E,Ve)&&g(s.TEXTURE_CUBE_MAP),ee.__version=Q.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function _e(L,E,H,$,Q,ee){const ge=r.convert(H.format,H.colorSpace),oe=r.convert(H.type),de=x(H.internalFormat,ge,oe,H.colorSpace);if(!i.get(E).__hasExternalTextures){const Oe=Math.max(1,E.width>>ee),J=Math.max(1,E.height>>ee);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?t.texImage3D(Q,ee,de,Oe,J,E.depth,0,ge,oe,null):t.texImage2D(Q,ee,de,Oe,J,0,ge,oe,null)}t.bindFramebuffer(s.FRAMEBUFFER,L),me(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,Q,i.get(H).__webglTexture,0,Pe(E)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,Q,i.get(H).__webglTexture,ee),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Le(L,E,H){if(s.bindRenderbuffer(s.RENDERBUFFER,L),E.depthBuffer&&!E.stencilBuffer){let $=o===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(H||me(E)){const Q=E.depthTexture;Q&&Q.isDepthTexture&&(Q.type===pt?$=s.DEPTH_COMPONENT32F:Q.type===Qt&&($=s.DEPTH_COMPONENT24));const ee=Pe(E);me(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ee,$,E.width,E.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,ee,$,E.width,E.height)}else s.renderbufferStorage(s.RENDERBUFFER,$,E.width,E.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,L)}else if(E.depthBuffer&&E.stencilBuffer){const $=Pe(E);H&&me(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,$,s.DEPTH24_STENCIL8,E.width,E.height):me(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$,s.DEPTH24_STENCIL8,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,L)}else{const $=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let Q=0;Q<$.length;Q++){const ee=$[Q],ge=r.convert(ee.format,ee.colorSpace),oe=r.convert(ee.type),de=x(ee.internalFormat,ge,oe,ee.colorSpace),Me=Pe(E);H&&me(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Me,de,E.width,E.height):me(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Me,de,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,de,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ne(L,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,L),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),B(E.depthTexture,0);const $=i.get(E.depthTexture).__webglTexture,Q=Pe(E);if(E.depthTexture.format===un)me(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0);else if(E.depthTexture.format===es)me(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Te(L){const E=i.get(L),H=L.isWebGLCubeRenderTarget===!0;if(L.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Ne(E.__webglFramebuffer,L)}else if(H){E.__webglDepthbuffer=[];for(let $=0;$<6;$++)t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[$]),E.__webglDepthbuffer[$]=s.createRenderbuffer(),Le(E.__webglDepthbuffer[$],L,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=s.createRenderbuffer(),Le(E.__webglDepthbuffer,L,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function We(L,E,H){const $=i.get(L);E!==void 0&&_e($.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),H!==void 0&&Te(L)}function z(L){const E=L.texture,H=i.get(L),$=i.get(E);L.addEventListener("dispose",C),L.isWebGLMultipleRenderTargets!==!0&&($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=E.version,a.memory.textures++);const Q=L.isWebGLCubeRenderTarget===!0,ee=L.isWebGLMultipleRenderTargets===!0,ge=m(L)||o;if(Q){H.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(o&&E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[oe]=[];for(let de=0;de<E.mipmaps.length;de++)H.__webglFramebuffer[oe][de]=s.createFramebuffer()}else H.__webglFramebuffer[oe]=s.createFramebuffer()}else{if(o&&E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let oe=0;oe<E.mipmaps.length;oe++)H.__webglFramebuffer[oe]=s.createFramebuffer()}else H.__webglFramebuffer=s.createFramebuffer();if(ee)if(n.drawBuffers){const oe=L.texture;for(let de=0,Me=oe.length;de<Me;de++){const Oe=i.get(oe[de]);Oe.__webglTexture===void 0&&(Oe.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&L.samples>0&&me(L)===!1){const oe=ee?E:[E];H.__webglMultisampledFramebuffer=s.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let de=0;de<oe.length;de++){const Me=oe[de];H.__webglColorRenderbuffer[de]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,H.__webglColorRenderbuffer[de]);const Oe=r.convert(Me.format,Me.colorSpace),J=r.convert(Me.type),Ze=x(Me.internalFormat,Oe,J,Me.colorSpace,L.isXRRenderTarget===!0),Ve=Pe(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ve,Ze,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+de,s.RENDERBUFFER,H.__webglColorRenderbuffer[de])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(H.__webglDepthRenderbuffer=s.createRenderbuffer(),Le(H.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),q(s.TEXTURE_CUBE_MAP,E,ge);for(let oe=0;oe<6;oe++)if(o&&E.mipmaps&&E.mipmaps.length>0)for(let de=0;de<E.mipmaps.length;de++)_e(H.__webglFramebuffer[oe][de],L,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,de);else _e(H.__webglFramebuffer[oe],L,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);y(E,ge)&&g(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ee){const oe=L.texture;for(let de=0,Me=oe.length;de<Me;de++){const Oe=oe[de],J=i.get(Oe);t.bindTexture(s.TEXTURE_2D,J.__webglTexture),q(s.TEXTURE_2D,Oe,ge),_e(H.__webglFramebuffer,L,Oe,s.COLOR_ATTACHMENT0+de,s.TEXTURE_2D,0),y(Oe,ge)&&g(s.TEXTURE_2D)}t.unbindTexture()}else{let oe=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(o?oe=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(oe,$.__webglTexture),q(oe,E,ge),o&&E.mipmaps&&E.mipmaps.length>0)for(let de=0;de<E.mipmaps.length;de++)_e(H.__webglFramebuffer[de],L,E,s.COLOR_ATTACHMENT0,oe,de);else _e(H.__webglFramebuffer,L,E,s.COLOR_ATTACHMENT0,oe,0);y(E,ge)&&g(oe),t.unbindTexture()}L.depthBuffer&&Te(L)}function Ft(L){const E=m(L)||o,H=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let $=0,Q=H.length;$<Q;$++){const ee=H[$];if(y(ee,E)){const ge=L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,oe=i.get(ee).__webglTexture;t.bindTexture(ge,oe),g(ge),t.unbindTexture()}}}function be(L){if(o&&L.samples>0&&me(L)===!1){const E=L.isWebGLMultipleRenderTargets?L.texture:[L.texture],H=L.width,$=L.height;let Q=s.COLOR_BUFFER_BIT;const ee=[],ge=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,oe=i.get(L),de=L.isWebGLMultipleRenderTargets===!0;if(de)for(let Me=0;Me<E.length;Me++)t.bindFramebuffer(s.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,oe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let Me=0;Me<E.length;Me++){ee.push(s.COLOR_ATTACHMENT0+Me),L.depthBuffer&&ee.push(ge);const Oe=oe.__ignoreDepthValues!==void 0?oe.__ignoreDepthValues:!1;if(Oe===!1&&(L.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),de&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,oe.__webglColorRenderbuffer[Me]),Oe===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[ge]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[ge])),de){const J=i.get(E[Me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,J,0)}s.blitFramebuffer(0,0,H,$,0,0,H,$,Q,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ee)}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),de)for(let Me=0;Me<E.length;Me++){t.bindFramebuffer(s.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,oe.__webglColorRenderbuffer[Me]);const Oe=i.get(E[Me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,oe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,Oe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}}function Pe(L){return Math.min(n.maxSamples,L.samples)}function me(L){const E=i.get(L);return o&&L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function lt(L){const E=a.render.frame;u.get(L)!==E&&(u.set(L,E),L.update())}function Be(L,E){const H=L.colorSpace,$=L.format,Q=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||L.format===bo||H!==fi&&H!==Xt&&(Qe.getTransfer(H)===nt?o===!1?e.has("EXT_sRGB")===!0&&$===Xe?(L.format=bo,L.minFilter=Ke,L.generateMipmaps=!1):E=Bu.sRGBToLinear(E):($!==Xe||Q!==hi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}this.allocateTextureUnit=I,this.resetTextureUnits=N,this.setTexture2D=B,this.setTexture2DArray=K,this.setTexture3D=k,this.setTextureCube=X,this.rebindTextures=We,this.setupRenderTarget=z,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=me}function Zv(s,e,t){const i=t.isWebGL2;function n(r,a=Xt){let o;const l=Qe.getTransfer(a);if(r===hi)return s.UNSIGNED_BYTE;if(r===Pu)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Cu)return s.UNSIGNED_SHORT_5_5_5_1;if(r===yo)return s.BYTE;if(r===Ru)return s.SHORT;if(r===ea)return s.UNSIGNED_SHORT;if(r===Ts)return s.INT;if(r===Qt)return s.UNSIGNED_INT;if(r===pt)return s.FLOAT;if(r===Et)return i?s.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===vd)return s.ALPHA;if(r===Xe)return s.RGBA;if(r===_d)return s.LUMINANCE;if(r===yd)return s.LUMINANCE_ALPHA;if(r===un)return s.DEPTH_COMPONENT;if(r===es)return s.DEPTH_STENCIL;if(r===bo)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Lu)return s.RED;if(r===Bo)return s.RED_INTEGER;if(r===ta)return s.RG;if(r===ia)return s.RG_INTEGER;if(r===Ls)return s.RGBA_INTEGER;if(r===va||r===_a||r===ya||r===xa)if(l===nt)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===va)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===_a)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ya)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===xa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===va)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===_a)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ya)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===xa)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ml||r===gl||r===vl||r===_l)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===ml)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===gl)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===vl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===_l)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Iu)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===yl||r===xl)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===yl)return l===nt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===xl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===bl||r===Sl||r===wl||r===Ml||r===Tl||r===El||r===Al||r===Rl||r===Pl||r===Cl||r===Ll||r===Il||r===Dl||r===Nl)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===bl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Sl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===wl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ml)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Tl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===El)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Al)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Rl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Pl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Cl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ll)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Il)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Dl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Nl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ba||r===Ul||r===Fl)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===ba)return l===nt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ul)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Fl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===xd||r===Bl||r===Ol||r===kl)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===ba)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Bl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ol)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===kl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===cn?i?s.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:n}}class Jv extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class cr extends rt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qv={type:"move"};class Xa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new cr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new cr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new cr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,v=.005;c.inputState.pinching&&d>f+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qv)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new cr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class $v extends dn{constructor(e,t){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,v=null;const _=t.getContextAttributes();let m=null,p=null;const y=[],g=[],x=new le;let S=null;const b=new Jt;b.layers.enable(1),b.viewport=new qe;const T=new Jt;T.layers.enable(2),T.viewport=new qe;const C=[b,T],w=new Jv;w.layers.enable(1),w.layers.enable(2);let M=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Z=y[q];return Z===void 0&&(Z=new Xa,y[q]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(q){let Z=y[q];return Z===void 0&&(Z=new Xa,y[q]=Z),Z.getGripSpace()},this.getHand=function(q){let Z=y[q];return Z===void 0&&(Z=new Xa,y[q]=Z),Z.getHandSpace()};function A(q){const Z=g.indexOf(q.inputSource);if(Z===-1)return;const ae=y[Z];ae!==void 0&&(ae.update(q.inputSource,q.frame,c||a),ae.dispatchEvent({type:q.type,data:q.inputSource}))}function N(){n.removeEventListener("select",A),n.removeEventListener("selectstart",A),n.removeEventListener("selectend",A),n.removeEventListener("squeeze",A),n.removeEventListener("squeezestart",A),n.removeEventListener("squeezeend",A),n.removeEventListener("end",N),n.removeEventListener("inputsourceschange",I);for(let q=0;q<y.length;q++){const Z=g[q];Z!==null&&(g[q]=null,y[q].disconnect(Z))}M=null,D=null,e.setRenderTarget(m),f=null,d=null,h=null,n=null,p=null,te.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(x.width,x.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return n},this.setSession=async function(q){if(n=q,n!==null){if(m=e.getRenderTarget(),n.addEventListener("select",A),n.addEventListener("selectstart",A),n.addEventListener("selectend",A),n.addEventListener("squeeze",A),n.addEventListener("squeezestart",A),n.addEventListener("squeezeend",A),n.addEventListener("end",N),n.addEventListener("inputsourceschange",I),_.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(x),n.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:n.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(n,t,Z),n.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new xt(f.framebufferWidth,f.framebufferHeight,{format:Xe,type:hi,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Z=null,ae=null,ye=null;_.depth&&(ye=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=_.stencil?es:un,ae=_.stencil?cn:Qt);const _e={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:r};h=new XRWebGLBinding(n,t),d=h.createProjectionLayer(_e),n.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),p=new xt(d.textureWidth,d.textureHeight,{format:Xe,type:hi,depthTexture:new Yu(d.textureWidth,d.textureHeight,ae,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Le=e.properties.get(p);Le.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),te.setContext(n),te.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode};function I(q){for(let Z=0;Z<q.removed.length;Z++){const ae=q.removed[Z],ye=g.indexOf(ae);ye>=0&&(g[ye]=null,y[ye].disconnect(ae))}for(let Z=0;Z<q.added.length;Z++){const ae=q.added[Z];let ye=g.indexOf(ae);if(ye===-1){for(let Le=0;Le<y.length;Le++)if(Le>=g.length){g.push(ae),ye=Le;break}else if(g[Le]===null){g[Le]=ae,ye=Le;break}if(ye===-1)break}const _e=y[ye];_e&&_e.connect(ae)}}const U=new P,B=new P;function K(q,Z,ae){U.setFromMatrixPosition(Z.matrixWorld),B.setFromMatrixPosition(ae.matrixWorld);const ye=U.distanceTo(B),_e=Z.projectionMatrix.elements,Le=ae.projectionMatrix.elements,Ne=_e[14]/(_e[10]-1),Te=_e[14]/(_e[10]+1),We=(_e[9]+1)/_e[5],z=(_e[9]-1)/_e[5],Ft=(_e[8]-1)/_e[0],be=(Le[8]+1)/Le[0],Pe=Ne*Ft,me=Ne*be,lt=ye/(-Ft+be),Be=lt*-Ft;Z.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Be),q.translateZ(lt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert();const L=Ne+lt,E=Te+lt,H=Pe-Be,$=me+(ye-Be),Q=We*Te/E*L,ee=z*Te/E*L;q.projectionMatrix.makePerspective(H,$,Q,ee,L,E),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}function k(q,Z){Z===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Z.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(n===null)return;w.near=T.near=b.near=q.near,w.far=T.far=b.far=q.far,(M!==w.near||D!==w.far)&&(n.updateRenderState({depthNear:w.near,depthFar:w.far}),M=w.near,D=w.far);const Z=q.parent,ae=w.cameras;k(w,Z);for(let ye=0;ye<ae.length;ye++)k(ae[ye],Z);ae.length===2?K(w,b,T):w.projectionMatrix.copy(b.projectionMatrix),X(q,w,Z)};function X(q,Z,ae){ae===null?q.matrix.copy(Z.matrixWorld):(q.matrix.copy(ae.matrixWorld),q.matrix.invert(),q.matrix.multiply(Z.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ts*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)};let j=null;function Y(q,Z){if(u=Z.getViewerPose(c||a),v=Z,u!==null){const ae=u.views;f!==null&&(e.setRenderTargetFramebuffer(p,f.framebuffer),e.setRenderTarget(p));let ye=!1;ae.length!==w.cameras.length&&(w.cameras.length=0,ye=!0);for(let _e=0;_e<ae.length;_e++){const Le=ae[_e];let Ne=null;if(f!==null)Ne=f.getViewport(Le);else{const We=h.getViewSubImage(d,Le);Ne=We.viewport,_e===0&&(e.setRenderTargetTextures(p,We.colorTexture,d.ignoreDepthValues?void 0:We.depthStencilTexture),e.setRenderTarget(p))}let Te=C[_e];Te===void 0&&(Te=new Jt,Te.layers.enable(_e),Te.viewport=new qe,C[_e]=Te),Te.matrix.fromArray(Le.transform.matrix),Te.matrix.decompose(Te.position,Te.quaternion,Te.scale),Te.projectionMatrix.fromArray(Le.projectionMatrix),Te.projectionMatrixInverse.copy(Te.projectionMatrix).invert(),Te.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),_e===0&&(w.matrix.copy(Te.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),ye===!0&&w.cameras.push(Te)}}for(let ae=0;ae<y.length;ae++){const ye=g[ae],_e=y[ae];ye!==null&&_e!==void 0&&_e.update(ye,Z,c||a)}j&&j(q,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),v=null}const te=new ju;te.setAnimationLoop(Y),this.setAnimationLoop=function(q){j=q},this.dispose=function(){}}}function e0(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Xu(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function n(m,p,y,g,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),v(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,y,g):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ht&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ht&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=e.get(p).envMap;if(y&&(m.envMap.value=y,m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const g=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*g,t(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,g){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=g*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),e.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ht&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function t0(s,e,t,i){let n={},r={},a=[];const o=t.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,g){const x=g.program;i.uniformBlockBinding(y,x)}function c(y,g){let x=n[y.id];x===void 0&&(v(y),x=u(y),n[y.id]=x,y.addEventListener("dispose",m));const S=g.program;i.updateUBOMapping(y,S);const b=e.render.frame;r[y.id]!==b&&(d(y),r[y.id]=b)}function u(y){const g=h();y.__bindingPointIndex=g;const x=s.createBuffer(),S=y.__size,b=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,S,b),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,g,x),x}function h(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const g=n[y.id],x=y.uniforms,S=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,g);for(let b=0,T=x.length;b<T;b++){const C=Array.isArray(x[b])?x[b]:[x[b]];for(let w=0,M=C.length;w<M;w++){const D=C[w];if(f(D,b,w,S)===!0){const A=D.__offset,N=Array.isArray(D.value)?D.value:[D.value];let I=0;for(let U=0;U<N.length;U++){const B=N[U],K=_(B);typeof B=="number"||typeof B=="boolean"?(D.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,A+I,D.__data)):B.isMatrix3?(D.__data[0]=B.elements[0],D.__data[1]=B.elements[1],D.__data[2]=B.elements[2],D.__data[3]=0,D.__data[4]=B.elements[3],D.__data[5]=B.elements[4],D.__data[6]=B.elements[5],D.__data[7]=0,D.__data[8]=B.elements[6],D.__data[9]=B.elements[7],D.__data[10]=B.elements[8],D.__data[11]=0):(B.toArray(D.__data,I),I+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,A,D.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,g,x,S){const b=y.value,T=g+"_"+x;if(S[T]===void 0)return typeof b=="number"||typeof b=="boolean"?S[T]=b:S[T]=b.clone(),!0;{const C=S[T];if(typeof b=="number"||typeof b=="boolean"){if(C!==b)return S[T]=b,!0}else if(C.equals(b)===!1)return C.copy(b),!0}return!1}function v(y){const g=y.uniforms;let x=0;const S=16;for(let T=0,C=g.length;T<C;T++){const w=Array.isArray(g[T])?g[T]:[g[T]];for(let M=0,D=w.length;M<D;M++){const A=w[M],N=Array.isArray(A.value)?A.value:[A.value];for(let I=0,U=N.length;I<U;I++){const B=N[I],K=_(B),k=x%S;k!==0&&S-k<K.boundary&&(x+=S-k),A.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),A.__offset=x,x+=K.storage}}}const b=x%S;return b>0&&(x+=S-b),y.__size=x,y.__cache={},this}function _(y){const g={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(g.boundary=4,g.storage=4):y.isVector2?(g.boundary=8,g.storage=8):y.isVector3||y.isColor?(g.boundary=16,g.storage=12):y.isVector4?(g.boundary=16,g.storage=16):y.isMatrix3?(g.boundary=48,g.storage=48):y.isMatrix4?(g.boundary=64,g.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),g}function m(y){const g=y.target;g.removeEventListener("dispose",m);const x=a.indexOf(g.__bindingPointIndex);a.splice(x,1),s.deleteBuffer(n[g.id]),delete n[g.id],delete r[g.id]}function p(){for(const y in n)s.deleteBuffer(n[y]);a=[],n={},r={}}return{bind:l,update:c,dispose:p}}class i0{constructor(e={}){const{canvas:t=Jd(),context:i=null,depth:n=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=a;const f=new Uint32Array(4),v=new Int32Array(4);let _=null,m=null;const p=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pt,this._useLegacyLights=!1,this.toneMapping=Ki,this.toneMappingExposure=1;const g=this;let x=!1,S=0,b=0,T=null,C=-1,w=null;const M=new qe,D=new qe;let A=null;const N=new ue(0);let I=0,U=t.width,B=t.height,K=1,k=null,X=null;const j=new qe(0,0,U,B),Y=new qe(0,0,U,B);let te=!1;const q=new Ho;let Z=!1,ae=!1,ye=null;const _e=new he,Le=new le,Ne=new P,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function We(){return T===null?K:1}let z=i;function Ft(R,O){for(let V=0;V<R.length;V++){const W=R[V],G=t.getContext(W,O);if(G!==null)return G}return null}try{const R={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Fo}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",F,!1),t.addEventListener("webglcontextcreationerror",se,!1),z===null){const O=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&O.shift(),z=Ft(O,R),z===null)throw Ft(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&z instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),z.getShaderPrecisionFormat===void 0&&(z.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let be,Pe,me,lt,Be,L,E,H,$,Q,ee,ge,oe,de,Me,Oe,J,Ze,Ve,Re,xe,fe,Ue,je;function ht(){be=new hg(z),Pe=new rg(z,be,e),be.init(Pe),fe=new Zv(z,be,Pe),me=new jv(z,be,Pe),lt=new pg(z),Be=new Nv,L=new Yv(z,be,me,Be,Pe,fe,lt),E=new og(g),H=new ug(g),$=new Sf(z,Pe),Ue=new ng(z,be,$,Pe),Q=new dg(z,$,lt,Ue),ee=new _g(z,Q,$,lt),Ve=new vg(z,Pe,L),Oe=new ag(Be),ge=new Dv(g,E,H,be,Pe,Ue,Oe),oe=new e0(g,Be),de=new Fv,Me=new Hv(be,Pe),Ze=new ig(g,E,H,me,ee,d,l),J=new Kv(g,ee,Pe),je=new t0(z,lt,Pe,me),Re=new sg(z,be,lt,Pe),xe=new fg(z,be,lt,Pe),lt.programs=ge.programs,g.capabilities=Pe,g.extensions=be,g.properties=Be,g.renderLists=de,g.shadowMap=J,g.state=me,g.info=lt}ht();const Ge=new $v(g,z);this.xr=Ge,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const R=be.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=be.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(R){R!==void 0&&(K=R,this.setSize(U,B,!1))},this.getSize=function(R){return R.set(U,B)},this.setSize=function(R,O,V=!0){if(Ge.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=R,B=O,t.width=Math.floor(R*K),t.height=Math.floor(O*K),V===!0&&(t.style.width=R+"px",t.style.height=O+"px"),this.setViewport(0,0,R,O)},this.getDrawingBufferSize=function(R){return R.set(U*K,B*K).floor()},this.setDrawingBufferSize=function(R,O,V){U=R,B=O,K=V,t.width=Math.floor(R*V),t.height=Math.floor(O*V),this.setViewport(0,0,R,O)},this.getCurrentViewport=function(R){return R.copy(M)},this.getViewport=function(R){return R.copy(j)},this.setViewport=function(R,O,V,W){R.isVector4?j.set(R.x,R.y,R.z,R.w):j.set(R,O,V,W),me.viewport(M.copy(j).multiplyScalar(K).floor())},this.getScissor=function(R){return R.copy(Y)},this.setScissor=function(R,O,V,W){R.isVector4?Y.set(R.x,R.y,R.z,R.w):Y.set(R,O,V,W),me.scissor(D.copy(Y).multiplyScalar(K).floor())},this.getScissorTest=function(){return te},this.setScissorTest=function(R){me.setScissorTest(te=R)},this.setOpaqueSort=function(R){k=R},this.setTransparentSort=function(R){X=R},this.getClearColor=function(R){return R.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor.apply(Ze,arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha.apply(Ze,arguments)},this.clear=function(R=!0,O=!0,V=!0){let W=0;if(R){let G=!1;if(T!==null){const ce=T.texture.format;G=ce===Ls||ce===ia||ce===Bo}if(G){const ce=T.texture.type,ve=ce===hi||ce===Qt||ce===ea||ce===cn||ce===Pu||ce===Cu,we=Ze.getClearColor(),Ae=Ze.getClearAlpha(),ke=we.r,Ce=we.g,Ie=we.b;ve?(f[0]=ke,f[1]=Ce,f[2]=Ie,f[3]=Ae,z.clearBufferuiv(z.COLOR,0,f)):(v[0]=ke,v[1]=Ce,v[2]=Ie,v[3]=Ae,z.clearBufferiv(z.COLOR,0,v))}else W|=z.COLOR_BUFFER_BIT}O&&(W|=z.DEPTH_BUFFER_BIT),V&&(W|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",F,!1),t.removeEventListener("webglcontextcreationerror",se,!1),de.dispose(),Me.dispose(),Be.dispose(),E.dispose(),H.dispose(),ee.dispose(),Ue.dispose(),je.dispose(),ge.dispose(),Ge.dispose(),Ge.removeEventListener("sessionstart",Bt),Ge.removeEventListener("sessionend",it),ye&&(ye.dispose(),ye=null),Ot.stop()};function ie(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const R=lt.autoReset,O=J.enabled,V=J.autoUpdate,W=J.needsUpdate,G=J.type;ht(),lt.autoReset=R,J.enabled=O,J.autoUpdate=V,J.needsUpdate=W,J.type=G}function se(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function re(R){const O=R.target;O.removeEventListener("dispose",re),Ee(O)}function Ee(R){Se(R),Be.remove(R)}function Se(R){const O=Be.get(R).programs;O!==void 0&&(O.forEach(function(V){ge.releaseProgram(V)}),R.isShaderMaterial&&ge.releaseShaderCache(R))}this.renderBufferDirect=function(R,O,V,W,G,ce){O===null&&(O=Te);const ve=G.isMesh&&G.matrixWorld.determinant()<0,we=Lh(R,O,V,W,G);me.setMaterial(W,ve);let Ae=V.index,ke=1;if(W.wireframe===!0){if(Ae=Q.getWireframeAttribute(V),Ae===void 0)return;ke=2}const Ce=V.drawRange,Ie=V.attributes.position;let mt=Ce.start*ke,jt=(Ce.start+Ce.count)*ke;ce!==null&&(mt=Math.max(mt,ce.start*ke),jt=Math.min(jt,(ce.start+ce.count)*ke)),Ae!==null?(mt=Math.max(mt,0),jt=Math.min(jt,Ae.count)):Ie!=null&&(mt=Math.max(mt,0),jt=Math.min(jt,Ie.count));const Mt=jt-mt;if(Mt<0||Mt===1/0)return;Ue.setup(G,W,we,V,Ae);let wi,ct=Re;if(Ae!==null&&(wi=$.get(Ae),ct=xe,ct.setIndex(wi)),G.isMesh)W.wireframe===!0?(me.setLineWidth(W.wireframeLinewidth*We()),ct.setMode(z.LINES)):ct.setMode(z.TRIANGLES);else if(G.isLine){let He=W.linewidth;He===void 0&&(He=1),me.setLineWidth(He*We()),G.isLineSegments?ct.setMode(z.LINES):G.isLineLoop?ct.setMode(z.LINE_LOOP):ct.setMode(z.LINE_STRIP)}else G.isPoints?ct.setMode(z.POINTS):G.isSprite&&ct.setMode(z.TRIANGLES);if(G.isBatchedMesh)ct.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else if(G.isInstancedMesh)ct.renderInstances(mt,Mt,G.count);else if(V.isInstancedBufferGeometry){const He=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,da=Math.min(V.instanceCount,He);ct.renderInstances(mt,Mt,da)}else ct.render(mt,Mt)};function et(R,O,V){R.transparent===!0&&R.side===_i&&R.forceSinglePass===!1?(R.side=Ht,R.needsUpdate=!0,zs(R,O,V),R.side=ti,R.needsUpdate=!0,zs(R,O,V),R.side=_i):zs(R,O,V)}this.compile=function(R,O,V=null){V===null&&(V=R),m=Me.get(V),m.init(),y.push(m),V.traverseVisible(function(G){G.isLight&&G.layers.test(O.layers)&&(m.pushLight(G),G.castShadow&&m.pushShadow(G))}),R!==V&&R.traverseVisible(function(G){G.isLight&&G.layers.test(O.layers)&&(m.pushLight(G),G.castShadow&&m.pushShadow(G))}),m.setupLights(g._useLegacyLights);const W=new Set;return R.traverse(function(G){const ce=G.material;if(ce)if(Array.isArray(ce))for(let ve=0;ve<ce.length;ve++){const we=ce[ve];et(we,V,G),W.add(we)}else et(ce,V,G),W.add(ce)}),y.pop(),m=null,W},this.compileAsync=function(R,O,V=null){const W=this.compile(R,O,V);return new Promise(G=>{function ce(){if(W.forEach(function(ve){Be.get(ve).currentProgram.isReady()&&W.delete(ve)}),W.size===0){G(R);return}setTimeout(ce,10)}be.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let tt=null;function wt(R){tt&&tt(R)}function Bt(){Ot.stop()}function it(){Ot.start()}const Ot=new ju;Ot.setAnimationLoop(wt),typeof self<"u"&&Ot.setContext(self),this.setAnimationLoop=function(R){tt=R,Ge.setAnimationLoop(R),R===null?Ot.stop():Ot.start()},Ge.addEventListener("sessionstart",Bt),Ge.addEventListener("sessionend",it),this.render=function(R,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ge.enabled===!0&&Ge.isPresenting===!0&&(Ge.cameraAutoUpdate===!0&&Ge.updateCamera(O),O=Ge.getCamera()),R.isScene===!0&&R.onBeforeRender(g,R,O,T),m=Me.get(R,y.length),m.init(),y.push(m),_e.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),q.setFromProjectionMatrix(_e),ae=this.localClippingEnabled,Z=Oe.init(this.clippingPlanes,ae),_=de.get(R,p.length),_.init(),p.push(_),mi(R,O,0,g.sortObjects),_.finish(),g.sortObjects===!0&&_.sort(k,X),this.info.render.frame++,Z===!0&&Oe.beginShadows();const V=m.state.shadowsArray;if(J.render(V,R,O),Z===!0&&Oe.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ze.render(_,R),m.setupLights(g._useLegacyLights),O.isArrayCamera){const W=O.cameras;for(let G=0,ce=W.length;G<ce;G++){const ve=W[G];tl(_,R,ve,ve.viewport)}}else tl(_,R,O);T!==null&&(L.updateMultisampleRenderTarget(T),L.updateRenderTargetMipmap(T)),R.isScene===!0&&R.onAfterRender(g,R,O),Ue.resetDefaultState(),C=-1,w=null,y.pop(),y.length>0?m=y[y.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function mi(R,O,V,W){if(R.visible===!1)return;if(R.layers.test(O.layers)){if(R.isGroup)V=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(O);else if(R.isLight)m.pushLight(R),R.castShadow&&m.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||q.intersectsSprite(R)){W&&Ne.setFromMatrixPosition(R.matrixWorld).applyMatrix4(_e);const ve=ee.update(R),we=R.material;we.visible&&_.push(R,ve,we,V,Ne.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||q.intersectsObject(R))){const ve=ee.update(R),we=R.material;if(W&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ne.copy(R.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),Ne.copy(ve.boundingSphere.center)),Ne.applyMatrix4(R.matrixWorld).applyMatrix4(_e)),Array.isArray(we)){const Ae=ve.groups;for(let ke=0,Ce=Ae.length;ke<Ce;ke++){const Ie=Ae[ke],mt=we[Ie.materialIndex];mt&&mt.visible&&_.push(R,ve,mt,V,Ne.z,Ie)}}else we.visible&&_.push(R,ve,we,V,Ne.z,null)}}const ce=R.children;for(let ve=0,we=ce.length;ve<we;ve++)mi(ce[ve],O,V,W)}function tl(R,O,V,W){const G=R.opaque,ce=R.transmissive,ve=R.transparent;m.setupLightsView(V),Z===!0&&Oe.setGlobalState(g.clippingPlanes,V),ce.length>0&&Ch(G,ce,O,V),W&&me.viewport(M.copy(W)),G.length>0&&ks(G,O,V),ce.length>0&&ks(ce,O,V),ve.length>0&&ks(ve,O,V),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function Ch(R,O,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const ce=Pe.isWebGL2;ye===null&&(ye=new xt(1,1,{generateMipmaps:!0,type:be.has("EXT_color_buffer_half_float")?Et:hi,minFilter:Cs,samples:ce?4:0})),g.getDrawingBufferSize(Le),ce?ye.setSize(Le.x,Le.y):ye.setSize(jr(Le.x),jr(Le.y));const ve=g.getRenderTarget();g.setRenderTarget(ye),g.getClearColor(N),I=g.getClearAlpha(),I<1&&g.setClearColor(16777215,.5),g.clear();const we=g.toneMapping;g.toneMapping=Ki,ks(R,V,W),L.updateMultisampleRenderTarget(ye),L.updateRenderTargetMipmap(ye);let Ae=!1;for(let ke=0,Ce=O.length;ke<Ce;ke++){const Ie=O[ke],mt=Ie.object,jt=Ie.geometry,Mt=Ie.material,wi=Ie.group;if(Mt.side===_i&&mt.layers.test(W.layers)){const ct=Mt.side;Mt.side=Ht,Mt.needsUpdate=!0,il(mt,V,W,jt,Mt,wi),Mt.side=ct,Mt.needsUpdate=!0,Ae=!0}}Ae===!0&&(L.updateMultisampleRenderTarget(ye),L.updateRenderTargetMipmap(ye)),g.setRenderTarget(ve),g.setClearColor(N,I),g.toneMapping=we}function ks(R,O,V){const W=O.isScene===!0?O.overrideMaterial:null;for(let G=0,ce=R.length;G<ce;G++){const ve=R[G],we=ve.object,Ae=ve.geometry,ke=W===null?ve.material:W,Ce=ve.group;we.layers.test(V.layers)&&il(we,O,V,Ae,ke,Ce)}}function il(R,O,V,W,G,ce){R.onBeforeRender(g,O,V,W,G,ce),R.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),G.onBeforeRender(g,O,V,W,R,ce),G.transparent===!0&&G.side===_i&&G.forceSinglePass===!1?(G.side=Ht,G.needsUpdate=!0,g.renderBufferDirect(V,O,W,G,R,ce),G.side=ti,G.needsUpdate=!0,g.renderBufferDirect(V,O,W,G,R,ce),G.side=_i):g.renderBufferDirect(V,O,W,G,R,ce),R.onAfterRender(g,O,V,W,G,ce)}function zs(R,O,V){O.isScene!==!0&&(O=Te);const W=Be.get(R),G=m.state.lights,ce=m.state.shadowsArray,ve=G.state.version,we=ge.getParameters(R,G.state,ce,O,V),Ae=ge.getProgramCacheKey(we);let ke=W.programs;W.environment=R.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(R.isMeshStandardMaterial?H:E).get(R.envMap||W.environment),ke===void 0&&(R.addEventListener("dispose",re),ke=new Map,W.programs=ke);let Ce=ke.get(Ae);if(Ce!==void 0){if(W.currentProgram===Ce&&W.lightsStateVersion===ve)return sl(R,we),Ce}else we.uniforms=ge.getUniforms(R),R.onBuild(V,we,g),R.onBeforeCompile(we,g),Ce=ge.acquireProgram(we,Ae),ke.set(Ae,Ce),W.uniforms=we.uniforms;const Ie=W.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ie.clippingPlanes=Oe.uniform),sl(R,we),W.needsLights=Dh(R),W.lightsStateVersion=ve,W.needsLights&&(Ie.ambientLightColor.value=G.state.ambient,Ie.lightProbe.value=G.state.probe,Ie.directionalLights.value=G.state.directional,Ie.directionalLightShadows.value=G.state.directionalShadow,Ie.spotLights.value=G.state.spot,Ie.spotLightShadows.value=G.state.spotShadow,Ie.rectAreaLights.value=G.state.rectArea,Ie.ltc_1.value=G.state.rectAreaLTC1,Ie.ltc_2.value=G.state.rectAreaLTC2,Ie.pointLights.value=G.state.point,Ie.pointLightShadows.value=G.state.pointShadow,Ie.hemisphereLights.value=G.state.hemi,Ie.directionalShadowMap.value=G.state.directionalShadowMap,Ie.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ie.spotShadowMap.value=G.state.spotShadowMap,Ie.spotLightMatrix.value=G.state.spotLightMatrix,Ie.spotLightMap.value=G.state.spotLightMap,Ie.pointShadowMap.value=G.state.pointShadowMap,Ie.pointShadowMatrix.value=G.state.pointShadowMatrix),W.currentProgram=Ce,W.uniformsList=null,Ce}function nl(R){if(R.uniformsList===null){const O=R.currentProgram.getUniforms();R.uniformsList=Or.seqWithValue(O.seq,R.uniforms)}return R.uniformsList}function sl(R,O){const V=Be.get(R);V.outputColorSpace=O.outputColorSpace,V.batching=O.batching,V.instancing=O.instancing,V.instancingColor=O.instancingColor,V.skinning=O.skinning,V.morphTargets=O.morphTargets,V.morphNormals=O.morphNormals,V.morphColors=O.morphColors,V.morphTargetsCount=O.morphTargetsCount,V.numClippingPlanes=O.numClippingPlanes,V.numIntersection=O.numClipIntersection,V.vertexAlphas=O.vertexAlphas,V.vertexTangents=O.vertexTangents,V.toneMapping=O.toneMapping}function Lh(R,O,V,W,G){O.isScene!==!0&&(O=Te),L.resetTextureUnits();const ce=O.fog,ve=W.isMeshStandardMaterial?O.environment:null,we=T===null?g.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:fi,Ae=(W.isMeshStandardMaterial?H:E).get(W.envMap||ve),ke=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ce=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ie=!!V.morphAttributes.position,mt=!!V.morphAttributes.normal,jt=!!V.morphAttributes.color;let Mt=Ki;W.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Mt=g.toneMapping);const wi=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ct=wi!==void 0?wi.length:0,He=Be.get(W),da=m.state.lights;if(Z===!0&&(ae===!0||R!==w)){const ii=R===w&&W.id===C;Oe.setState(W,R,ii)}let dt=!1;W.version===He.__version?(He.needsLights&&He.lightsStateVersion!==da.state.version||He.outputColorSpace!==we||G.isBatchedMesh&&He.batching===!1||!G.isBatchedMesh&&He.batching===!0||G.isInstancedMesh&&He.instancing===!1||!G.isInstancedMesh&&He.instancing===!0||G.isSkinnedMesh&&He.skinning===!1||!G.isSkinnedMesh&&He.skinning===!0||G.isInstancedMesh&&He.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&He.instancingColor===!1&&G.instanceColor!==null||He.envMap!==Ae||W.fog===!0&&He.fog!==ce||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==Oe.numPlanes||He.numIntersection!==Oe.numIntersection)||He.vertexAlphas!==ke||He.vertexTangents!==Ce||He.morphTargets!==Ie||He.morphNormals!==mt||He.morphColors!==jt||He.toneMapping!==Mt||Pe.isWebGL2===!0&&He.morphTargetsCount!==ct)&&(dt=!0):(dt=!0,He.__version=W.version);let $i=He.currentProgram;dt===!0&&($i=zs(W,O,G));let rl=!1,os=!1,fa=!1;const It=$i.getUniforms(),en=He.uniforms;if(me.useProgram($i.program)&&(rl=!0,os=!0,fa=!0),W.id!==C&&(C=W.id,os=!0),rl||w!==R){It.setValue(z,"projectionMatrix",R.projectionMatrix),It.setValue(z,"viewMatrix",R.matrixWorldInverse);const ii=It.map.cameraPosition;ii!==void 0&&ii.setValue(z,Ne.setFromMatrixPosition(R.matrixWorld)),Pe.logarithmicDepthBuffer&&It.setValue(z,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&It.setValue(z,"isOrthographic",R.isOrthographicCamera===!0),w!==R&&(w=R,os=!0,fa=!0)}if(G.isSkinnedMesh){It.setOptional(z,G,"bindMatrix"),It.setOptional(z,G,"bindMatrixInverse");const ii=G.skeleton;ii&&(Pe.floatVertexTextures?(ii.boneTexture===null&&ii.computeBoneTexture(),It.setValue(z,"boneTexture",ii.boneTexture,L)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}G.isBatchedMesh&&(It.setOptional(z,G,"batchingTexture"),It.setValue(z,"batchingTexture",G._matricesTexture,L));const pa=V.morphAttributes;if((pa.position!==void 0||pa.normal!==void 0||pa.color!==void 0&&Pe.isWebGL2===!0)&&Ve.update(G,V,$i),(os||He.receiveShadow!==G.receiveShadow)&&(He.receiveShadow=G.receiveShadow,It.setValue(z,"receiveShadow",G.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(en.envMap.value=Ae,en.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),os&&(It.setValue(z,"toneMappingExposure",g.toneMappingExposure),He.needsLights&&Ih(en,fa),ce&&W.fog===!0&&oe.refreshFogUniforms(en,ce),oe.refreshMaterialUniforms(en,W,K,B,ye),Or.upload(z,nl(He),en,L)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Or.upload(z,nl(He),en,L),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&It.setValue(z,"center",G.center),It.setValue(z,"modelViewMatrix",G.modelViewMatrix),It.setValue(z,"normalMatrix",G.normalMatrix),It.setValue(z,"modelMatrix",G.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const ii=W.uniformsGroups;for(let ma=0,Nh=ii.length;ma<Nh;ma++)if(Pe.isWebGL2){const al=ii[ma];je.update(al,$i),je.bind(al,$i)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return $i}function Ih(R,O){R.ambientLightColor.needsUpdate=O,R.lightProbe.needsUpdate=O,R.directionalLights.needsUpdate=O,R.directionalLightShadows.needsUpdate=O,R.pointLights.needsUpdate=O,R.pointLightShadows.needsUpdate=O,R.spotLights.needsUpdate=O,R.spotLightShadows.needsUpdate=O,R.rectAreaLights.needsUpdate=O,R.hemisphereLights.needsUpdate=O}function Dh(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(R,O,V){Be.get(R.texture).__webglTexture=O,Be.get(R.depthTexture).__webglTexture=V;const W=Be.get(R);W.__hasExternalTextures=!0,W.__hasExternalTextures&&(W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||be.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(R,O){const V=Be.get(R);V.__webglFramebuffer=O,V.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(R,O=0,V=0){T=R,S=O,b=V;let W=!0,G=null,ce=!1,ve=!1;if(R){const Ae=Be.get(R);Ae.__useDefaultFramebuffer!==void 0?(me.bindFramebuffer(z.FRAMEBUFFER,null),W=!1):Ae.__webglFramebuffer===void 0?L.setupRenderTarget(R):Ae.__hasExternalTextures&&L.rebindTextures(R,Be.get(R.texture).__webglTexture,Be.get(R.depthTexture).__webglTexture);const ke=R.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(ve=!0);const Ce=Be.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Ce[O])?G=Ce[O][V]:G=Ce[O],ce=!0):Pe.isWebGL2&&R.samples>0&&L.useMultisampledRTT(R)===!1?G=Be.get(R).__webglMultisampledFramebuffer:Array.isArray(Ce)?G=Ce[V]:G=Ce,M.copy(R.viewport),D.copy(R.scissor),A=R.scissorTest}else M.copy(j).multiplyScalar(K).floor(),D.copy(Y).multiplyScalar(K).floor(),A=te;if(me.bindFramebuffer(z.FRAMEBUFFER,G)&&Pe.drawBuffers&&W&&me.drawBuffers(R,G),me.viewport(M),me.scissor(D),me.setScissorTest(A),ce){const Ae=Be.get(R.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ae.__webglTexture,V)}else if(ve){const Ae=Be.get(R.texture),ke=O||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ae.__webglTexture,V||0,ke)}C=-1},this.readRenderTargetPixels=function(R,O,V,W,G,ce,ve){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Be.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&ve!==void 0&&(we=we[ve]),we){me.bindFramebuffer(z.FRAMEBUFFER,we);try{const Ae=R.texture,ke=Ae.format,Ce=Ae.type;if(ke!==Xe&&fe.convert(ke)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ie=Ce===Et&&(be.has("EXT_color_buffer_half_float")||Pe.isWebGL2&&be.has("EXT_color_buffer_float"));if(Ce!==hi&&fe.convert(Ce)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ce===pt&&(Pe.isWebGL2||be.has("OES_texture_float")||be.has("WEBGL_color_buffer_float")))&&!Ie){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=R.width-W&&V>=0&&V<=R.height-G&&z.readPixels(O,V,W,G,fe.convert(ke),fe.convert(Ce),ce)}finally{const Ae=T!==null?Be.get(T).__webglFramebuffer:null;me.bindFramebuffer(z.FRAMEBUFFER,Ae)}}},this.copyFramebufferToTexture=function(R,O,V=0){const W=Math.pow(2,-V),G=Math.floor(O.image.width*W),ce=Math.floor(O.image.height*W);L.setTexture2D(O,0),z.copyTexSubImage2D(z.TEXTURE_2D,V,0,0,R.x,R.y,G,ce),me.unbindTexture()},this.copyTextureToTexture=function(R,O,V,W=0){const G=O.image.width,ce=O.image.height,ve=fe.convert(V.format),we=fe.convert(V.type);L.setTexture2D(V,0),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,V.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,V.unpackAlignment),O.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,W,R.x,R.y,G,ce,ve,we,O.image.data):O.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,W,R.x,R.y,O.mipmaps[0].width,O.mipmaps[0].height,ve,O.mipmaps[0].data):z.texSubImage2D(z.TEXTURE_2D,W,R.x,R.y,ve,we,O.image),W===0&&V.generateMipmaps&&z.generateMipmap(z.TEXTURE_2D),me.unbindTexture()},this.copyTextureToTexture3D=function(R,O,V,W,G=0){if(g.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ce=R.max.x-R.min.x+1,ve=R.max.y-R.min.y+1,we=R.max.z-R.min.z+1,Ae=fe.convert(W.format),ke=fe.convert(W.type);let Ce;if(W.isData3DTexture)L.setTexture3D(W,0),Ce=z.TEXTURE_3D;else if(W.isDataArrayTexture||W.isCompressedArrayTexture)L.setTexture2DArray(W,0),Ce=z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,W.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,W.unpackAlignment);const Ie=z.getParameter(z.UNPACK_ROW_LENGTH),mt=z.getParameter(z.UNPACK_IMAGE_HEIGHT),jt=z.getParameter(z.UNPACK_SKIP_PIXELS),Mt=z.getParameter(z.UNPACK_SKIP_ROWS),wi=z.getParameter(z.UNPACK_SKIP_IMAGES),ct=V.isCompressedTexture?V.mipmaps[G]:V.image;z.pixelStorei(z.UNPACK_ROW_LENGTH,ct.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ct.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,R.min.x),z.pixelStorei(z.UNPACK_SKIP_ROWS,R.min.y),z.pixelStorei(z.UNPACK_SKIP_IMAGES,R.min.z),V.isDataTexture||V.isData3DTexture?z.texSubImage3D(Ce,G,O.x,O.y,O.z,ce,ve,we,Ae,ke,ct.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),z.compressedTexSubImage3D(Ce,G,O.x,O.y,O.z,ce,ve,we,Ae,ct.data)):z.texSubImage3D(Ce,G,O.x,O.y,O.z,ce,ve,we,Ae,ke,ct),z.pixelStorei(z.UNPACK_ROW_LENGTH,Ie),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,mt),z.pixelStorei(z.UNPACK_SKIP_PIXELS,jt),z.pixelStorei(z.UNPACK_SKIP_ROWS,Mt),z.pixelStorei(z.UNPACK_SKIP_IMAGES,wi),G===0&&W.generateMipmaps&&z.generateMipmap(Ce),me.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?L.setTextureCube(R,0):R.isData3DTexture?L.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?L.setTexture2DArray(R,0):L.setTexture2D(R,0),me.unbindTexture()},this.resetState=function(){S=0,b=0,T=null,me.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===ko?"display-p3":"srgb",t.unpackColorSpace=Qe.workingColorSpace===na?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Pt?hn:Du}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===hn?Pt:fi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class n0 extends i0{}n0.prototype.isWebGL1Renderer=!0;class ai extends rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class s0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=xo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=di()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,r=this.stride;n<r;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const kt=new P;class Yr{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=yi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=yi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=yi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=yi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),i=Je(i,this.array),n=Je(n,this.array),r=Je(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return new $e(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Yr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class r0 extends Qi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Pn;const ds=new P,Cn=new P,Ln=new P,In=new le,fs=new le,th=new he,ur=new P,ps=new P,hr=new P,Rc=new le,qa=new le,Pc=new le;class rx extends rt{constructor(e=new r0){if(super(),this.isSprite=!0,this.type="Sprite",Pn===void 0){Pn=new Rt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new s0(t,5);Pn.setIndex([0,1,2,0,2,3]),Pn.setAttribute("position",new Yr(i,3,0,!1)),Pn.setAttribute("uv",new Yr(i,2,3,!1))}this.geometry=Pn,this.material=e,this.center=new le(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Cn.setFromMatrixScale(this.matrixWorld),th.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ln.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Cn.multiplyScalar(-Ln.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;dr(ur.set(-.5,-.5,0),Ln,a,Cn,n,r),dr(ps.set(.5,-.5,0),Ln,a,Cn,n,r),dr(hr.set(.5,.5,0),Ln,a,Cn,n,r),Rc.set(0,0),qa.set(1,0),Pc.set(1,1);let o=e.ray.intersectTriangle(ur,ps,hr,!1,ds);if(o===null&&(dr(ps.set(-.5,.5,0),Ln,a,Cn,n,r),qa.set(0,1),o=e.ray.intersectTriangle(ur,hr,ps,!1,ds),o===null))return;const l=e.ray.origin.distanceTo(ds);l<e.near||l>e.far||t.push({distance:l,point:ds.clone(),uv:Lt.getInterpolation(ds,ur,ps,hr,Rc,qa,Pc,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function dr(s,e,t,i,n,r){In.subVectors(s,t).addScalar(.5).multiply(i),n!==void 0?(fs.x=r*In.x-n*In.y,fs.y=n*In.x+r*In.y):fs.copy(In),s.copy(e),s.x+=fs.x,s.y+=fs.y,s.applyMatrix4(th)}const Cc=new P,Lc=new qe,Ic=new qe,a0=new P,Dc=new he,fr=new P,Ka=new bi,Nc=new he,ja=new sa;class ax extends ut{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=fl,this.bindMatrix=new he,this.bindMatrixInverse=new he,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new At),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,fr),this.boundingBox.expandByPoint(fr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new bi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,fr),this.boundingSphere.expandByPoint(fr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,n=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ka.copy(this.boundingSphere),Ka.applyMatrix4(n),e.ray.intersectsSphere(Ka)!==!1&&(Nc.copy(n).invert(),ja.copy(e.ray).applyMatrix4(Nc),!(this.boundingBox!==null&&ja.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,ja)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new qe,t=this.geometry.attributes.skinWeight;for(let i=0,n=t.count;i<n;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===fl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===md?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,n=this.geometry;Lc.fromBufferAttribute(n.attributes.skinIndex,e),Ic.fromBufferAttribute(n.attributes.skinWeight,e),Cc.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Ic.getComponent(r);if(a!==0){const o=Lc.getComponent(r);Dc.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(a0.copy(Cc).applyMatrix4(Dc),a)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(e,t)}}class o0 extends rt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ds extends Ut{constructor(e=null,t=1,i=1,n,r,a,o,l,c=ze,u=ze,h,d){super(null,a,o,l,c,u,n,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Uc=new he,l0=new he;class ih{constructor(e=[],t=[]){this.uuid=di(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,n=this.bones.length;i<n;i++)this.boneInverses.push(new he)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new he;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,n=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:l0;Uc.multiplyMatrices(o,t[r]),Uc.toArray(i,r*16)}n!==null&&(n.needsUpdate=!0)}clone(){return new ih(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new Ds(t,e,e,Xe,pt);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,n=e.bones.length;i<n;i++){const r=e.bones[i];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new o0),this.bones.push(a),this.boneInverses.push(new he().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let n=0,r=t.length;n<r;n++){const a=t[n];e.bones.push(a.uuid);const o=i[n];e.boneInverses.push(o.toArray())}return e}}class Fc extends $e{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Dn=new he,Bc=new he,pr=[],Oc=new At,c0=new he,ms=new ut,gs=new bi;class ox extends ut{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Fc(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,c0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new At),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Dn),Oc.copy(e.boundingBox).applyMatrix4(Dn),this.boundingBox.union(Oc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new bi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Dn),gs.copy(e.boundingSphere).applyMatrix4(Dn),this.boundingSphere.union(gs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const i=this.matrixWorld,n=this.count;if(ms.geometry=this.geometry,ms.material=this.material,ms.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gs.copy(this.boundingSphere),gs.applyMatrix4(i),e.ray.intersectsSphere(gs)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,Dn),Bc.multiplyMatrices(i,Dn),ms.matrixWorld=Bc,ms.raycast(e,pr);for(let a=0,o=pr.length;a<o;a++){const l=pr[a];l.instanceId=r,l.object=this,t.push(l)}pr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Fc(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class u0 extends Qi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const kc=new P,zc=new P,Gc=new he,Ya=new sa,mr=new bi;class nh extends rt{constructor(e=new Rt,t=new u0){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let n=1,r=t.count;n<r;n++)kc.fromBufferAttribute(t,n-1),zc.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=kc.distanceTo(zc);e.setAttribute("lineDistance",new ot(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),mr.copy(i.boundingSphere),mr.applyMatrix4(n),mr.radius+=r,e.ray.intersectsSphere(mr)===!1)return;Gc.copy(n).invert(),Ya.copy(e.ray).applyMatrix4(Gc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new P,u=new P,h=new P,d=new P,f=this.isLineSegments?2:1,v=i.index,m=i.attributes.position;if(v!==null){const p=Math.max(0,a.start),y=Math.min(v.count,a.start+a.count);for(let g=p,x=y-1;g<x;g+=f){const S=v.getX(g),b=v.getX(g+1);if(c.fromBufferAttribute(m,S),u.fromBufferAttribute(m,b),Ya.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const C=e.ray.origin.distanceTo(d);C<e.near||C>e.far||t.push({distance:C,point:h.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,a.start),y=Math.min(m.count,a.start+a.count);for(let g=p,x=y-1;g<x;g+=f){if(c.fromBufferAttribute(m,g),u.fromBufferAttribute(m,g+1),Ya.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const b=e.ray.origin.distanceTo(d);b<e.near||b>e.far||t.push({distance:b,point:h.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const Hc=new P,Vc=new P;class lx extends nh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let n=0,r=t.count;n<r;n+=2)Hc.fromBufferAttribute(t,n),Vc.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+Hc.distanceTo(Vc);e.setAttribute("lineDistance",new ot(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class cx extends nh{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class h0 extends Qi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Wc=new he,Mo=new sa,gr=new bi,vr=new P;class ux extends rt{constructor(e=new Rt,t=new h0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),gr.copy(i.boundingSphere),gr.applyMatrix4(n),gr.radius+=r,e.ray.intersectsSphere(gr)===!1)return;Wc.copy(n).invert(),Mo.copy(e.ray).applyMatrix4(Wc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let v=d,_=f;v<_;v++){const m=c.getX(v);vr.fromBufferAttribute(h,m),Xc(vr,m,l,n,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let v=d,_=f;v<_;v++)vr.fromBufferAttribute(h,v),Xc(vr,v,l,n,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Xc(s,e,t,i,n,r,a){const o=Mo.distanceSqToPoint(s);if(o<t){const l=new P;Mo.closestPointToPoint(s,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class hx extends Ut{constructor(e,t,i,n,r,a,o,l,c){super(e,t,i,n,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class sh extends Rt{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,i=0,n=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=yt(n,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],u=1/t,h=new P,d=new le,f=new P,v=new P,_=new P;let m=0,p=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(v)}for(let y=0;y<=t;y++){const g=i+y*u*n,x=Math.sin(g),S=Math.cos(g);for(let b=0;b<=e.length-1;b++){h.x=e[b].x*x,h.y=e[b].y,h.z=e[b].x*S,a.push(h.x,h.y,h.z),d.x=y/t,d.y=b/(e.length-1),o.push(d.x,d.y);const T=l[3*b+0]*x,C=l[3*b+1],w=l[3*b+0]*S;c.push(T,C,w)}}for(let y=0;y<t;y++)for(let g=0;g<e.length-1;g++){const x=g+y*e.length,S=x,b=x+e.length,T=x+e.length+1,C=x+1;r.push(S,b,C),r.push(T,C,b)}this.setIndex(r),this.setAttribute("position",new ot(a,3)),this.setAttribute("uv",new ot(o,2)),this.setAttribute("normal",new ot(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sh(e.points,e.segments,e.phiStart,e.phiLength)}}class rh extends Rt{constructor(e=1,t=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),r=Math.floor(r);const u=[],h=[],d=[],f=[];let v=0;const _=[],m=i/2;let p=0;y(),a===!1&&(e>0&&g(!0),t>0&&g(!1)),this.setIndex(u),this.setAttribute("position",new ot(h,3)),this.setAttribute("normal",new ot(d,3)),this.setAttribute("uv",new ot(f,2));function y(){const x=new P,S=new P;let b=0;const T=(t-e)/i;for(let C=0;C<=r;C++){const w=[],M=C/r,D=M*(t-e)+e;for(let A=0;A<=n;A++){const N=A/n,I=N*l+o,U=Math.sin(I),B=Math.cos(I);S.x=D*U,S.y=-M*i+m,S.z=D*B,h.push(S.x,S.y,S.z),x.set(U,T,B).normalize(),d.push(x.x,x.y,x.z),f.push(N,1-M),w.push(v++)}_.push(w)}for(let C=0;C<n;C++)for(let w=0;w<r;w++){const M=_[w][C],D=_[w+1][C],A=_[w+1][C+1],N=_[w][C+1];u.push(M,D,N),u.push(D,A,N),b+=6}c.addGroup(p,b,0),p+=b}function g(x){const S=v,b=new le,T=new P;let C=0;const w=x===!0?e:t,M=x===!0?1:-1;for(let A=1;A<=n;A++)h.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),v++;const D=v;for(let A=0;A<=n;A++){const I=A/n*l+o,U=Math.cos(I),B=Math.sin(I);T.x=w*B,T.y=m*M,T.z=w*U,h.push(T.x,T.y,T.z),d.push(0,M,0),b.x=U*.5+.5,b.y=B*.5*M+.5,f.push(b.x,b.y),v++}for(let A=0;A<n;A++){const N=S+A,I=D+A;x===!0?u.push(I,I+1,N):u.push(I+1,I,N),C+=3}c.addGroup(p,C,x===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rh(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wo extends Rt{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};const r=[],a=[];o(n),c(i),u(),this.setAttribute("position",new ot(r,3)),this.setAttribute("normal",new ot(r.slice(),3)),this.setAttribute("uv",new ot(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const g=new P,x=new P,S=new P;for(let b=0;b<t.length;b+=3)f(t[b+0],g),f(t[b+1],x),f(t[b+2],S),l(g,x,S,y)}function l(y,g,x,S){const b=S+1,T=[];for(let C=0;C<=b;C++){T[C]=[];const w=y.clone().lerp(x,C/b),M=g.clone().lerp(x,C/b),D=b-C;for(let A=0;A<=D;A++)A===0&&C===b?T[C][A]=w:T[C][A]=w.clone().lerp(M,A/D)}for(let C=0;C<b;C++)for(let w=0;w<2*(b-C)-1;w++){const M=Math.floor(w/2);w%2===0?(d(T[C][M+1]),d(T[C+1][M]),d(T[C][M])):(d(T[C][M+1]),d(T[C+1][M+1]),d(T[C+1][M]))}}function c(y){const g=new P;for(let x=0;x<r.length;x+=3)g.x=r[x+0],g.y=r[x+1],g.z=r[x+2],g.normalize().multiplyScalar(y),r[x+0]=g.x,r[x+1]=g.y,r[x+2]=g.z}function u(){const y=new P;for(let g=0;g<r.length;g+=3){y.x=r[g+0],y.y=r[g+1],y.z=r[g+2];const x=m(y)/2/Math.PI+.5,S=p(y)/Math.PI+.5;a.push(x,1-S)}v(),h()}function h(){for(let y=0;y<a.length;y+=6){const g=a[y+0],x=a[y+2],S=a[y+4],b=Math.max(g,x,S),T=Math.min(g,x,S);b>.9&&T<.1&&(g<.2&&(a[y+0]+=1),x<.2&&(a[y+2]+=1),S<.2&&(a[y+4]+=1))}}function d(y){r.push(y.x,y.y,y.z)}function f(y,g){const x=y*3;g.x=e[x+0],g.y=e[x+1],g.z=e[x+2]}function v(){const y=new P,g=new P,x=new P,S=new P,b=new le,T=new le,C=new le;for(let w=0,M=0;w<r.length;w+=9,M+=6){y.set(r[w+0],r[w+1],r[w+2]),g.set(r[w+3],r[w+4],r[w+5]),x.set(r[w+6],r[w+7],r[w+8]),b.set(a[M+0],a[M+1]),T.set(a[M+2],a[M+3]),C.set(a[M+4],a[M+5]),S.copy(y).add(g).add(x).divideScalar(3);const D=m(S);_(b,M+0,y,D),_(T,M+2,g,D),_(C,M+4,x,D)}}function _(y,g,x,S){S<0&&y.x===1&&(a[g]=y.x-1),x.x===0&&x.z===0&&(a[g]=S/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wo(e.vertices,e.indices,e.radius,e.details)}}class ah extends Wo{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ah(e.radius,e.detail)}}class oh extends Rt{constructor(e=1,t=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new P,d=new P,f=[],v=[],_=[],m=[];for(let p=0;p<=i;p++){const y=[],g=p/i;let x=0;p===0&&a===0?x=.5/t:p===i&&l===Math.PI&&(x=-.5/t);for(let S=0;S<=t;S++){const b=S/t;h.x=-e*Math.cos(n+b*r)*Math.sin(a+g*o),h.y=e*Math.cos(a+g*o),h.z=e*Math.sin(n+b*r)*Math.sin(a+g*o),v.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(b+x,1-g),y.push(c++)}u.push(y)}for(let p=0;p<i;p++)for(let y=0;y<t;y++){const g=u[p][y+1],x=u[p][y],S=u[p+1][y],b=u[p+1][y+1];(p!==0||a>0)&&f.push(g,x,b),(p!==i-1||l<Math.PI)&&f.push(x,S,b)}this.setIndex(f),this.setAttribute("position",new ot(v,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class lh extends Rt{constructor(e=1,t=.4,i=64,n=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:n,p:r,q:a},i=Math.floor(i),n=Math.floor(n);const o=[],l=[],c=[],u=[],h=new P,d=new P,f=new P,v=new P,_=new P,m=new P,p=new P;for(let g=0;g<=i;++g){const x=g/i*r*Math.PI*2;y(x,r,a,e,f),y(x+.01,r,a,e,v),m.subVectors(v,f),p.addVectors(v,f),_.crossVectors(m,p),p.crossVectors(_,m),_.normalize(),p.normalize();for(let S=0;S<=n;++S){const b=S/n*Math.PI*2,T=-t*Math.cos(b),C=t*Math.sin(b);h.x=f.x+(T*p.x+C*_.x),h.y=f.y+(T*p.y+C*_.y),h.z=f.z+(T*p.z+C*_.z),l.push(h.x,h.y,h.z),d.subVectors(h,f).normalize(),c.push(d.x,d.y,d.z),u.push(g/i),u.push(S/n)}}for(let g=1;g<=i;g++)for(let x=1;x<=n;x++){const S=(n+1)*(g-1)+(x-1),b=(n+1)*g+(x-1),T=(n+1)*g+x,C=(n+1)*(g-1)+x;o.push(S,b,C),o.push(b,T,C)}this.setIndex(o),this.setAttribute("position",new ot(l,3)),this.setAttribute("normal",new ot(c,3)),this.setAttribute("uv",new ot(u,2));function y(g,x,S,b,T){const C=Math.cos(g),w=Math.sin(g),M=S/x*g,D=Math.cos(M);T.x=b*(2+D)*.5*C,T.y=b*(2+D)*w*.5,T.z=b*Math.sin(M)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new lh(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class d0 extends Qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nu,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class dx extends d0{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return yt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function _r(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function f0(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function p0(s){function e(n,r){return s[n]-s[r]}const t=s.length,i=new Array(t);for(let n=0;n!==t;++n)i[n]=n;return i.sort(e),i}function qc(s,e,t){const i=s.length,n=new s.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)n[a++]=s[o+l]}return n}function ch(s,e,t,i){let n=1,r=s[0];for(;r!==void 0&&r[i]===void 0;)r=s[n++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push.apply(t,a)),r=s[n++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[n++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=s[n++];while(r!==void 0)}class oa{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,n=t[i],r=t[i-1];e:{t:{let a;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=n,n=t[++i],e<n)break t}a=t.length;break i}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=r,r=t[--i-1],e>=r)break t}a=i,i=0;break i}break e}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,n)}return this.interpolate_(i,r,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,r=e*n;for(let a=0;a!==n;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class m0 extends oa{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wn,endingEnd:Wn}}intervalChanged_(e,t,i){const n=this.parameterPositions;let r=e-2,a=e+1,o=n[r],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case Xn:r=e,o=2*t-i;break;case Vr:r=n.length-2,o=t+n[r]-n[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Xn:a=e,l=2*i-t;break;case Vr:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}const c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,v=(i-t)/(n-t),_=v*v,m=_*v,p=-d*m+2*d*_-d*v,y=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*v+1,g=(-1-f)*m+(1.5+f)*_+.5*v,x=f*m-f*_;for(let S=0;S!==o;++S)r[S]=p*a[u+S]+y*a[c+S]+g*a[l+S]+x*a[h+S];return r}}class uh extends oa{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(i-t)/(n-t),h=1-u;for(let d=0;d!==o;++d)r[d]=a[c+d]*h+a[l+d]*u;return r}}class g0 extends oa{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}}class Si{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=_r(t,this.TimeBufferType),this.values=_r(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:_r(e.times,Array),values:_r(e.values,Array)};const n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new g0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new uh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new m0(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Gr:t=this.InterpolantFactoryMethodDiscrete;break;case Hr:t=this.InterpolantFactoryMethodLinear;break;case Sa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Gr;case this.InterpolantFactoryMethodLinear:return Hr;case this.InterpolantFactoryMethodSmooth:return Sa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){const i=this.times,n=i.length;let r=0,a=n-1;for(;r!==n&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==n){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,n=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&f0(n))for(let o=0,l=n.length;o!==l;++o){const c=n[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===Sa,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(n)l=!0;else{const h=o*i,d=h-i,f=h+i;for(let v=0;v!==i;++v){const _=t[h+v];if(_!==t[d+v]||_!==t[f+v]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const h=o*i,d=a*i;for(let f=0;f!==i;++f)t[d+f]=t[h+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,n=new i(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}}Si.prototype.TimeBufferType=Float32Array;Si.prototype.ValueBufferType=Float32Array;Si.prototype.DefaultInterpolation=Hr;class ss extends Si{}ss.prototype.ValueTypeName="bool";ss.prototype.ValueBufferType=Array;ss.prototype.DefaultInterpolation=Gr;ss.prototype.InterpolantFactoryMethodLinear=void 0;ss.prototype.InterpolantFactoryMethodSmooth=void 0;class hh extends Si{}hh.prototype.ValueTypeName="color";class Zr extends Si{}Zr.prototype.ValueTypeName="number";class v0 extends oa{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t);let c=e*o;for(let u=c+o;c!==u;c+=4)xi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Us extends Si{InterpolantFactoryMethodLinear(e){return new v0(this.times,this.values,this.getValueSize(),e)}}Us.prototype.ValueTypeName="quaternion";Us.prototype.DefaultInterpolation=Hr;Us.prototype.InterpolantFactoryMethodSmooth=void 0;class rs extends Si{}rs.prototype.ValueTypeName="string";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=Gr;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;class Jr extends Si{}Jr.prototype.ValueTypeName="vector";class Kc{constructor(e,t=-1,i,n=Oo){this.name=e,this.tracks=i,this.duration=t,this.blendMode=n,this.uuid=di(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,n=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(y0(i[a]).scale(n));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],i=e.tracks,n={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,a=i.length;r!==a;++r)t.push(Si.toJSON(i[r]));return n}static CreateFromMorphTargetSequence(e,t,i,n){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const u=p0(l);l=qc(l,1,u),c=qc(c,1,u),!n&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Zr(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const n=e;i=n.geometry&&n.geometry.animations||n.animations}for(let n=0;n<i.length;n++)if(i[n].name===t)return i[n];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const n={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(r);if(u&&u.length>1){const h=u[1];let d=n[h];d||(n[h]=d=[]),d.push(c)}}const a=[];for(const o in n)a.push(this.CreateFromMorphTargetSequence(o,n[o],t,i));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(h,d,f,v,_){if(f.length!==0){const m=[],p=[];ch(f,m,p,v),m.length!==0&&_.push(new h(d,m,p))}},n=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let v;for(v=0;v<d.length;v++)if(d[v].morphTargets)for(let _=0;_<d[v].morphTargets.length;_++)f[d[v].morphTargets[_]]=-1;for(const _ in f){const m=[],p=[];for(let y=0;y!==d[v].morphTargets.length;++y){const g=d[v];m.push(g.time),p.push(g.morphTarget===_?1:0)}n.push(new Zr(".morphTargetInfluence["+_+"]",m,p))}l=f.length*a}else{const f=".bones["+t[h].name+"]";i(Jr,f+".position",d,"pos",n),i(Us,f+".quaternion",d,"rot",n),i(Jr,f+".scale",d,"scl",n)}}return n.length===0?null:new this(r,l,n,o)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,n=e.length;i!==n;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function _0(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Zr;case"vector":case"vector2":case"vector3":case"vector4":return Jr;case"color":return hh;case"quaternion":return Us;case"bool":case"boolean":return ss;case"string":return rs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function y0(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=_0(s.type);if(s.times===void 0){const t=[],i=[];ch(s.keys,t,i,"value"),s.times=t,s.values=i}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const Wi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class x0{constructor(e,t,i){const n=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(u){o++,r===!1&&n.onStart!==void 0&&n.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,n.onProgress!==void 0&&n.onProgress(u,a,o),a===o&&(r=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(u){n.onError!==void 0&&n.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){const f=c[h],v=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return v}return null}}}const b0=new x0;class Fs{constructor(e){this.manager=e!==void 0?e:b0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(n,r){i.load(e,n,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Fs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Pi={};class S0 extends Error{constructor(e,t){super(e),this.response=t}}class fx extends Fs{constructor(e){super(e)}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Wi.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Pi[e]!==void 0){Pi[e].push({onLoad:t,onProgress:i,onError:n});return}Pi[e]=[],Pi[e].push({onLoad:t,onProgress:i,onError:n});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Pi[e],h=c.body.getReader(),d=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),f=d?parseInt(d):0,v=f!==0;let _=0;const m=new ReadableStream({start(p){y();function y(){h.read().then(({done:g,value:x})=>{if(g)p.close();else{_+=x.byteLength;const S=new ProgressEvent("progress",{lengthComputable:v,loaded:_,total:f});for(let b=0,T=u.length;b<T;b++){const C=u[b];C.onProgress&&C.onProgress(S)}p.enqueue(x),y()}})}}});return new Response(m)}else throw new S0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o===void 0)return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(v=>f.decode(v))}}}).then(c=>{Wi.add(e,c);const u=Pi[e];delete Pi[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{const u=Pi[e];if(u===void 0)throw this.manager.itemError(e),c;delete Pi[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class w0 extends Fs{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Wi.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=Is("img");function l(){u(),Wi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(h){u(),n&&n(h),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class px extends Fs{constructor(e){super(e)}load(e,t,i,n){const r=new Ut,a=new w0(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,n),r}}class Bs extends rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class mx extends Bs{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Za=new he,jc=new P,Yc=new P;class Xo{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ho,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;jc.setFromMatrixPosition(e.matrixWorld),t.position.copy(jc),Yc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yc),t.updateMatrixWorld(),Za.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Za),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Za)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class M0 extends Xo{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=ts*2*e.angle*this.focus,n=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(i!==t.fov||n!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=n,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class gx extends Bs{constructor(e,t,i=0,n=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.target=new rt,this.distance=i,this.angle=n,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new M0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Zc=new he,vs=new P,Ja=new P;class T0 extends Xo{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new le(4,2),this._viewportCount=6,this._viewports=[new qe(2,1,1,1),new qe(0,1,1,1),new qe(3,1,1,1),new qe(1,1,1,1),new qe(3,0,1,1),new qe(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,n=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),vs.setFromMatrixPosition(e.matrixWorld),i.position.copy(vs),Ja.copy(i.position),Ja.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ja),i.updateMatrixWorld(),n.makeTranslation(-vs.x,-vs.y,-vs.z),Zc.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zc)}}class vx extends Bs{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new T0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class E0 extends Xo{constructor(){super(new Kt(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _x extends Bs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.target=new rt,this.shadow=new E0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class yx extends Bs{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class xx{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,n=e.length;i<n;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class bx extends Fs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Wi.get(e);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),r.manager.itemEnd(e)}).catch(c=>{n&&n(c)});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Wi.add(e,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){n&&n(c),Wi.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});Wi.add(e,l),r.manager.itemStart(e)}}class A0{constructor(e,t,i){this.binding=e,this.valueSize=i;let n,r,a;switch(t){case"quaternion":n=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":n=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:n=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=n,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,n=this.valueSize,r=e*n+n;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==n;++o)i[r+o]=i[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(i,r,0,o,n)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,n=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,n,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,n=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(i,n,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(i,n,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,n);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,n=i*this._origIndex;e.getValue(t,n);for(let r=i,a=n;r!==a;++r)t[r]=t[n+r%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,n,r){if(n>=.5)for(let a=0;a!==r;++a)e[t+a]=e[i+a]}_slerp(e,t,i,n){xi.slerpFlat(e,t,e,t,e,i,n)}_slerpAdditive(e,t,i,n,r){const a=this._workIndex*r;xi.multiplyQuaternionsFlat(e,a,e,t,e,i),xi.slerpFlat(e,t,e,t,e,a,n)}_lerp(e,t,i,n,r){const a=1-n;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[i+o]*n}}_lerpAdditive(e,t,i,n,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[i+a]*n}}}const qo="\\[\\]\\.:\\/",R0=new RegExp("["+qo+"]","g"),Ko="[^"+qo+"]",P0="[^"+qo.replace("\\.","")+"]",C0=/((?:WC+[\/:])*)/.source.replace("WC",Ko),L0=/(WCOD+)?/.source.replace("WCOD",P0),I0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ko),D0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ko),N0=new RegExp("^"+C0+L0+I0+D0+"$"),U0=["material","materials","bones","map"];class F0{constructor(e,t,i){const n=i||Ye.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,n)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,r=i.length;n!==r;++n)i[n].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class Ye{constructor(e,t,i){this.path=t,this.parsedPath=i||Ye.parseTrackName(t),this.node=Ye.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new Ye.Composite(e,t,i):new Ye(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(R0,"")}static parseTrackName(e){const t=N0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){const r=i.nodeName.substring(n+1);U0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,n=t.propertyName;let r=t.propertyIndex;if(e||(e=Ye.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[n];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Ye.Composite=F0;Ye.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ye.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ye.prototype.GetterByBindingType=[Ye.prototype._getValue_direct,Ye.prototype._getValue_array,Ye.prototype._getValue_arrayElement,Ye.prototype._getValue_toArray];Ye.prototype.SetterByBindingTypeAndVersioning=[[Ye.prototype._setValue_direct,Ye.prototype._setValue_direct_setNeedsUpdate,Ye.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_array,Ye.prototype._setValue_array_setNeedsUpdate,Ye.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_arrayElement,Ye.prototype._setValue_arrayElement_setNeedsUpdate,Ye.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_fromArray,Ye.prototype._setValue_fromArray_setNeedsUpdate,Ye.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class B0{constructor(e,t,i=null,n=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=n;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:Wn,endingEnd:Wn};for(let c=0;c!==a;++c){const u=r[c].createInterpolant(null);o[c]=u,u.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Sd,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i){if(e.fadeOut(t),this.fadeIn(t),i){const n=this._clip.duration,r=e._clip.duration,a=r/n,o=n/r;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const n=this._mixer,r=n.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=n._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,n){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Md:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(a),c[u].accumulateAdditive(o);break;case Oo:default:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(a),c[u].accumulate(n,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopFading(),n===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let n=this.time+e,r=this._loopCount;const a=i===wd;if(e===0)return r===-1?n:a&&(r&1)===1?t-n:n;if(i===bd){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(n>=t)n=t;else if(n<0)n=0;else{this.time=n;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),n>=t||n<0){const o=Math.floor(n/t);n-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,n=e>0?t:0,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=n,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=n;if(a&&(r&1)===1)return t-n}return n}_setEndings(e,t,i){const n=this._interpolantSettings;i?(n.endingStart=Xn,n.endingEnd=Xn):(e?n.endingStart=this.zeroSlopeAtStart?Xn:Wn:n.endingStart=Vr,t?n.endingEnd=this.zeroSlopeAtEnd?Xn:Wn:n.endingEnd=Vr)}_scheduleFading(e,t,i){const n=this._mixer,r=n.time;let a=this._weightInterpolant;a===null&&(a=n._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=i,this}}const O0=new Float32Array(1);class Sx extends dn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const i=e._localRoot||this._root,n=e._clip.tracks,r=n.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let u=c[l];u===void 0&&(u={},c[l]=u);for(let h=0;h!==r;++h){const d=n[h],f=d.name;let v=u[f];if(v!==void 0)++v.referenceCount,a[h]=v;else{if(v=a[h],v!==void 0){v._cacheIndex===null&&(++v.referenceCount,this._addInactiveBinding(v,l,f));continue}const _=t&&t._propertyBindings[h].binding.parsedPath;v=new A0(Ye.create(i,f,_),d.ValueTypeName,d.getValueSize()),++v.referenceCount,this._addInactiveBinding(v,l,f),a[h]=v}o[h].resultBuffer=v.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,n=e._clip.uuid,r=this._actionsByClip[n];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,n,i)}const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const n=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=n.length,n.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],n=e._cacheIndex;i._cacheIndex=n,t[n]=i,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,l[u]=c,l.pop(),e._byClipCacheIndex=null;const h=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete h[d],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,n=this._nActiveActions++,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,n=--this._nActiveActions,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_addInactiveBinding(e,t,i){const n=this._bindingsByRootAndName,r=this._bindings;let a=n[t];a===void 0&&(a={},n[t]=a),a[i]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,n=i.rootNode.uuid,r=i.path,a=this._bindingsByRootAndName,o=a[n],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[n]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,n=this._nActiveBindings++,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,n=--this._nActiveBindings,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new uh(new Float32Array(2),new Float32Array(2),1,O0),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,n=--this._nActiveControlInterpolants,r=t[n];e.__cacheIndex=n,t[n]=e,r.__cacheIndex=i,t[i]=r}clipAction(e,t,i){const n=t||this._root,r=n.uuid;let a=typeof e=="string"?Kc.findByName(n,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=Oo),l!==void 0){const h=l.actionByRoot[r];if(h!==void 0&&h.blendMode===i)return h;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const u=new B0(this,a,t,i);return this._bindAction(u,c),this._addInactiveAction(u,o,r),u}existingAction(e,t){const i=t||this._root,n=i.uuid,r=typeof e=="string"?Kc.findByName(i,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[n]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,n=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(n,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,n=this._actionsByClip,r=n[i];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete n[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const n=this._bindingsByRootAndName,r=n[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}class wx{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(yt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Jc=new P,yr=new P;class Ni{constructor(e=new P,t=new P){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Jc.subVectors(e,this.start),yr.subVectors(this.end,this.start);const i=yr.dot(yr);let r=yr.dot(Jc)/i;return t&&(r=yt(r,0,1)),r}closestPointToPoint(e,t,i){const n=this.closestPointToPointParameter(e,t);return this.delta(i).multiplyScalar(n).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fo);function k0(s,e=!1){const t=s[0].index!==null,i=new Set(Object.keys(s[0].attributes)),n=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new Rt;let c=0;for(let u=0;u<s.length;++u){const h=s[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0;const h=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let v=0;v<f.count;++v)h.push(f.getX(v)+u);u+=s[d].attributes.position.count}l.setIndex(h)}for(const u in r){const h=Qc(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in a){const h=a[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let _=0;_<a[u].length;++_)f.push(a[u][_][d]);const v=Qc(f);if(!v)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(v)}}return l}function Qc(s){let e,t,i,n=-1,r=0;for(let c=0;c<s.length;++c){const u=s[c];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=u.gpuType),n!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}const a=new e(r);let o=0;for(let c=0;c<s.length;++c)a.set(s[c].array,o),o+=s[c].array.length;const l=new $e(a,t,i);return n!==void 0&&(l.gpuType=n),l}function Mx(s,e){if(e===Td)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===zl||e===Ed){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const i=t.count-2,n=[];if(e===zl)for(let a=1;a<=i;a++)n.push(t.getX(0)),n.push(t.getX(a)),n.push(t.getX(a+1));else for(let a=0;a<i;a++)a%2===0?(n.push(t.getX(a)),n.push(t.getX(a+1)),n.push(t.getX(a+2))):(n.push(t.getX(a+2)),n.push(t.getX(a+1)),n.push(t.getX(a)));n.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(n),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}const la=0,z0=1,dh=2,$c=2,Qa=1.25,eu=1,ji=6*4+4+4,ca=65535,G0=Math.pow(2,-24),$a=Symbol("SKIP_GENERATION");function fh(s){return s.index?s.index.count:s.attributes.position.count}function as(s){return fh(s)/3}function ph(s,e=ArrayBuffer){return s>65535?new Uint32Array(new e(4*s)):new Uint16Array(new e(2*s))}function H0(s,e){if(!s.index){const t=s.attributes.position.count,i=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=ph(t,i);s.setIndex(new $e(n,1));for(let r=0;r<t;r++)n[r]=r}}function mh(s,e){const t=as(s),i=e||s.drawRange,n=i.start/3,r=(i.start+i.count)/3,a=Math.max(0,n),o=Math.min(t,r)-a;return[{offset:Math.floor(a),count:Math.floor(o)}]}function gh(s,e){if(!s.groups||!s.groups.length)return mh(s,e);const t=[],i=new Set,n=e||s.drawRange,r=n.start/3,a=(n.start+n.count)/3;for(const l of s.groups){const c=l.start/3,u=(l.start+l.count)/3;i.add(Math.max(r,c)),i.add(Math.min(a,u))}const o=Array.from(i.values()).sort((l,c)=>l-c);for(let l=0;l<o.length-1;l++){const c=o[l],u=o[l+1];t.push({offset:Math.floor(c),count:Math.floor(u-c)})}return t}function V0(s,e){const t=as(s),i=gh(s,e).sort((a,o)=>a.offset-o.offset),n=i[i.length-1];n.count=Math.min(t-n.offset,n.count);let r=0;return i.forEach(({count:a})=>r+=a),t!==r}function eo(s,e,t,i,n){let r=1/0,a=1/0,o=1/0,l=-1/0,c=-1/0,u=-1/0,h=1/0,d=1/0,f=1/0,v=-1/0,_=-1/0,m=-1/0;for(let p=e*6,y=(e+t)*6;p<y;p+=6){const g=s[p+0],x=s[p+1],S=g-x,b=g+x;S<r&&(r=S),b>l&&(l=b),g<h&&(h=g),g>v&&(v=g);const T=s[p+2],C=s[p+3],w=T-C,M=T+C;w<a&&(a=w),M>c&&(c=M),T<d&&(d=T),T>_&&(_=T);const D=s[p+4],A=s[p+5],N=D-A,I=D+A;N<o&&(o=N),I>u&&(u=I),D<f&&(f=D),D>m&&(m=D)}i[0]=r,i[1]=a,i[2]=o,i[3]=l,i[4]=c,i[5]=u,n[0]=h,n[1]=d,n[2]=f,n[3]=v,n[4]=_,n[5]=m}function W0(s,e=null,t=null,i=null){const n=s.attributes.position,r=s.index?s.index.array:null,a=as(s),o=n.normalized;let l;e===null?(l=new Float32Array(a*6*4),t=0,i=a):(l=e,t=t||0,i=i||a);const c=n.array,u=n.offset||0;let h=3;n.isInterleavedBufferAttribute&&(h=n.data.stride);const d=["getX","getY","getZ"];for(let f=t;f<t+i;f++){const v=f*3,_=f*6;let m=v+0,p=v+1,y=v+2;r&&(m=r[m],p=r[p],y=r[y]),o||(m=m*h+u,p=p*h+u,y=y*h+u);for(let g=0;g<3;g++){let x,S,b;o?(x=n[d[g]](m),S=n[d[g]](p),b=n[d[g]](y)):(x=c[m+g],S=c[p+g],b=c[y+g]);let T=x;S<T&&(T=S),b<T&&(T=b);let C=x;S>C&&(C=S),b>C&&(C=b);const w=(C-T)/2,M=g*2;l[_+M+0]=T+w,l[_+M+1]=w+(Math.abs(T)+w)*G0}}return l}function ft(s,e,t){return t.min.x=e[s],t.min.y=e[s+1],t.min.z=e[s+2],t.max.x=e[s+3],t.max.y=e[s+4],t.max.z=e[s+5],t}function tu(s){let e=-1,t=-1/0;for(let i=0;i<3;i++){const n=s[i+3]-s[i];n>t&&(t=n,e=i)}return e}function iu(s,e){e.set(s)}function nu(s,e,t){let i,n;for(let r=0;r<3;r++){const a=r+3;i=s[r],n=e[r],t[r]=i<n?i:n,i=s[a],n=e[a],t[a]=i>n?i:n}}function xr(s,e,t){for(let i=0;i<3;i++){const n=e[s+2*i],r=e[s+2*i+1],a=n-r,o=n+r;a<t[i]&&(t[i]=a),o>t[i+3]&&(t[i+3]=o)}}function _s(s){const e=s[3]-s[0],t=s[4]-s[1],i=s[5]-s[2];return 2*(e*t+t*i+i*e)}const Li=32,X0=(s,e)=>s.candidate-e.candidate,Hi=new Array(Li).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),br=new Float32Array(6);function q0(s,e,t,i,n,r){let a=-1,o=0;if(r===la)a=tu(e),a!==-1&&(o=(e[a]+e[a+3])/2);else if(r===z0)a=tu(s),a!==-1&&(o=K0(t,i,n,a));else if(r===dh){const l=_s(s);let c=Qa*n;const u=i*6,h=(i+n)*6;for(let d=0;d<3;d++){const f=e[d],m=(e[d+3]-f)/Li;if(n<Li/4){const p=[...Hi];p.length=n;let y=0;for(let x=u;x<h;x+=6,y++){const S=p[y];S.candidate=t[x+2*d],S.count=0;const{bounds:b,leftCacheBounds:T,rightCacheBounds:C}=S;for(let w=0;w<3;w++)C[w]=1/0,C[w+3]=-1/0,T[w]=1/0,T[w+3]=-1/0,b[w]=1/0,b[w+3]=-1/0;xr(x,t,b)}p.sort(X0);let g=n;for(let x=0;x<g;x++){const S=p[x];for(;x+1<g&&p[x+1].candidate===S.candidate;)p.splice(x+1,1),g--}for(let x=u;x<h;x+=6){const S=t[x+2*d];for(let b=0;b<g;b++){const T=p[b];S>=T.candidate?xr(x,t,T.rightCacheBounds):(xr(x,t,T.leftCacheBounds),T.count++)}}for(let x=0;x<g;x++){const S=p[x],b=S.count,T=n-S.count,C=S.leftCacheBounds,w=S.rightCacheBounds;let M=0;b!==0&&(M=_s(C)/l);let D=0;T!==0&&(D=_s(w)/l);const A=eu+Qa*(M*b+D*T);A<c&&(a=d,c=A,o=S.candidate)}}else{for(let g=0;g<Li;g++){const x=Hi[g];x.count=0,x.candidate=f+m+g*m;const S=x.bounds;for(let b=0;b<3;b++)S[b]=1/0,S[b+3]=-1/0}for(let g=u;g<h;g+=6){let b=~~((t[g+2*d]-f)/m);b>=Li&&(b=Li-1);const T=Hi[b];T.count++,xr(g,t,T.bounds)}const p=Hi[Li-1];iu(p.bounds,p.rightCacheBounds);for(let g=Li-2;g>=0;g--){const x=Hi[g],S=Hi[g+1];nu(x.bounds,S.rightCacheBounds,x.rightCacheBounds)}let y=0;for(let g=0;g<Li-1;g++){const x=Hi[g],S=x.count,b=x.bounds,C=Hi[g+1].rightCacheBounds;S!==0&&(y===0?iu(b,br):nu(b,br,br)),y+=S;let w=0,M=0;y!==0&&(w=_s(br)/l);const D=n-y;D!==0&&(M=_s(C)/l);const A=eu+Qa*(w*y+M*D);A<c&&(a=d,c=A,o=x.candidate)}}}}else console.warn(`MeshBVH: Invalid build strategy value ${r} used.`);return{axis:a,pos:o}}function K0(s,e,t,i){let n=0;for(let r=e,a=e+t;r<a;r++)n+=s[r*6+i*2];return n/t}class to{constructor(){this.boundingData=new Float32Array(6)}}function j0(s,e,t,i,n,r){let a=i,o=i+n-1;const l=r.pos,c=r.axis*2;for(;;){for(;a<=o&&t[a*6+c]<l;)a++;for(;a<=o&&t[o*6+c]>=l;)o--;if(a<o){for(let u=0;u<3;u++){let h=e[a*3+u];e[a*3+u]=e[o*3+u],e[o*3+u]=h}for(let u=0;u<6;u++){let h=t[a*6+u];t[a*6+u]=t[o*6+u],t[o*6+u]=h}a++,o--}else return a}}function Y0(s,e,t,i,n,r){let a=i,o=i+n-1;const l=r.pos,c=r.axis*2;for(;;){for(;a<=o&&t[a*6+c]<l;)a++;for(;a<=o&&t[o*6+c]>=l;)o--;if(a<o){let u=s[a];s[a]=s[o],s[o]=u;for(let h=0;h<6;h++){let d=t[a*6+h];t[a*6+h]=t[o*6+h],t[o*6+h]=d}a++,o--}else return a}}function Gt(s,e){return e[s+15]===65535}function qt(s,e){return e[s+6]}function $t(s,e){return e[s+14]}function si(s){return s+8}function ei(s,e){return e[s+6]}function jo(s,e){return e[s+7]}let vh,Ms,kr,_h;const Z0=Math.pow(2,32);function To(s){return"count"in s?1:1+To(s.left)+To(s.right)}function J0(s,e,t){return vh=new Float32Array(t),Ms=new Uint32Array(t),kr=new Uint16Array(t),_h=new Uint8Array(t),Eo(s,e)}function Eo(s,e){const t=s/4,i=s/2,n="count"in e,r=e.boundingData;for(let a=0;a<6;a++)vh[t+a]=r[a];if(n)if(e.buffer){const a=e.buffer;_h.set(new Uint8Array(a),s);for(let o=s,l=s+a.byteLength;o<l;o+=ji){const c=o/2;Gt(c,kr)||(Ms[o/4+6]+=t)}return s+a.byteLength}else{const a=e.offset,o=e.count;return Ms[t+6]=a,kr[i+14]=o,kr[i+15]=ca,s+ji}else{const a=e.left,o=e.right,l=e.splitAxis;let c;if(c=Eo(s+ji,a),c/4>Z0)throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");return Ms[t+6]=c/4,c=Eo(c,o),Ms[t+7]=l,c}}function Q0(s,e){const t=(s.index?s.index.count:s.attributes.position.count)/3,i=t>2**16,n=i?4:2,r=e?new SharedArrayBuffer(t*n):new ArrayBuffer(t*n),a=i?new Uint32Array(r):new Uint16Array(r);for(let o=0,l=a.length;o<l;o++)a[o]=o;return a}function $0(s,e,t,i,n){const{maxDepth:r,verbose:a,maxLeafTris:o,strategy:l,onProgress:c,indirect:u}=n,h=s._indirectBuffer,d=s.geometry,f=d.index?d.index.array:null,v=u?Y0:j0,_=as(d),m=new Float32Array(6);let p=!1;const y=new to;return eo(e,t,i,y.boundingData,m),x(y,t,i,m),y;function g(S){c&&c(S/_)}function x(S,b,T,C=null,w=0){if(!p&&w>=r&&(p=!0,a&&(console.warn(`MeshBVH: Max depth of ${r} reached when generating BVH. Consider increasing maxDepth.`),console.warn(d))),T<=o||w>=r)return g(b+T),S.offset=b,S.count=T,S;const M=q0(S.boundingData,C,e,b,T,l);if(M.axis===-1)return g(b+T),S.offset=b,S.count=T,S;const D=v(h,f,e,b,T,M);if(D===b||D===b+T)g(b+T),S.offset=b,S.count=T;else{S.splitAxis=M.axis;const A=new to,N=b,I=D-b;S.left=A,eo(e,N,I,A.boundingData,m),x(A,N,I,m,w+1);const U=new to,B=D,K=T-I;S.right=U,eo(e,B,K,U.boundingData,m),x(U,B,K,m,w+1)}return S}}function e_(s,e){const t=s.geometry;e.indirect&&(s._indirectBuffer=Q0(t,e.useSharedArrayBuffer),V0(t,e.range)&&!e.verbose&&console.warn('MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),s._indirectBuffer||H0(t,e);const i=e.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=W0(t),r=e.indirect?mh(t,e.range):gh(t,e.range);s._roots=r.map(a=>{const o=$0(s,n,a.offset,a.count,e),l=To(o),c=new i(ji*l);return J0(0,o,c),c})}class Fi{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let i=1/0,n=-1/0;for(let r=0,a=e.length;r<a;r++){const l=e[r][t];i=l<i?l:i,n=l>n?l:n}this.min=i,this.max=n}setFromPoints(e,t){let i=1/0,n=-1/0;for(let r=0,a=t.length;r<a;r++){const o=t[r],l=e.dot(o);i=l<i?l:i,n=l>n?l:n}this.min=i,this.max=n}isSeparated(e){return this.min>e.max||e.min>this.max}}Fi.prototype.setFromBox=function(){const s=new P;return function(t,i){const n=i.min,r=i.max;let a=1/0,o=-1/0;for(let l=0;l<=1;l++)for(let c=0;c<=1;c++)for(let u=0;u<=1;u++){s.x=n.x*l+r.x*(1-l),s.y=n.y*c+r.y*(1-c),s.z=n.z*u+r.z*(1-u);const h=t.dot(s);a=Math.min(h,a),o=Math.max(h,o)}this.min=a,this.max=o}}();const t_=function(){const s=new P,e=new P,t=new P;return function(n,r,a){const o=n.start,l=s,c=r.start,u=e;t.subVectors(o,c),s.subVectors(n.end,n.start),e.subVectors(r.end,r.start);const h=t.dot(u),d=u.dot(l),f=u.dot(u),v=t.dot(l),m=l.dot(l)*f-d*d;let p,y;m!==0?p=(h*d-v*f)/m:p=0,y=(h+p*d)/f,a.x=p,a.y=y}}(),Yo=function(){const s=new le,e=new P,t=new P;return function(n,r,a,o){t_(n,r,s);let l=s.x,c=s.y;if(l>=0&&l<=1&&c>=0&&c<=1){n.at(l,a),r.at(c,o);return}else if(l>=0&&l<=1){c<0?r.at(0,o):r.at(1,o),n.closestPointToPoint(o,!0,a);return}else if(c>=0&&c<=1){l<0?n.at(0,a):n.at(1,a),r.closestPointToPoint(a,!0,o);return}else{let u;l<0?u=n.start:u=n.end;let h;c<0?h=r.start:h=r.end;const d=e,f=t;if(n.closestPointToPoint(h,!0,e),r.closestPointToPoint(u,!0,t),d.distanceToSquared(h)<=f.distanceToSquared(u)){a.copy(d),o.copy(h);return}else{a.copy(u),o.copy(f);return}}}}(),i_=function(){const s=new P,e=new P,t=new Ii,i=new Ni;return function(r,a){const{radius:o,center:l}=r,{a:c,b:u,c:h}=a;if(i.start=c,i.end=u,i.closestPointToPoint(l,!0,s).distanceTo(l)<=o||(i.start=c,i.end=h,i.closestPointToPoint(l,!0,s).distanceTo(l)<=o)||(i.start=u,i.end=h,i.closestPointToPoint(l,!0,s).distanceTo(l)<=o))return!0;const _=a.getPlane(t);if(Math.abs(_.distanceToPoint(l))<=o){const p=_.projectPoint(l,e);if(a.containsPoint(p))return!0}return!1}}(),n_=1e-15;function io(s){return Math.abs(s)<n_}class pi extends Lt{constructor(...e){super(...e),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new P),this.satBounds=new Array(4).fill().map(()=>new Fi),this.points=[this.a,this.b,this.c],this.sphere=new bi,this.plane=new Ii,this.needsUpdate=!0}intersectsSphere(e){return i_(e,this)}update(){const e=this.a,t=this.b,i=this.c,n=this.points,r=this.satAxes,a=this.satBounds,o=r[0],l=a[0];this.getNormal(o),l.setFromPoints(o,n);const c=r[1],u=a[1];c.subVectors(e,t),u.setFromPoints(c,n);const h=r[2],d=a[2];h.subVectors(t,i),d.setFromPoints(h,n);const f=r[3],v=a[3];f.subVectors(i,e),v.setFromPoints(f,n),this.sphere.setFromPoints(this.points),this.plane.setFromNormalAndCoplanarPoint(o,e),this.needsUpdate=!1}}pi.prototype.closestPointToSegment=function(){const s=new P,e=new P,t=new Ni;return function(n,r=null,a=null){const{start:o,end:l}=n,c=this.points;let u,h=1/0;for(let d=0;d<3;d++){const f=(d+1)%3;t.start.copy(c[d]),t.end.copy(c[f]),Yo(t,n,s,e),u=s.distanceToSquared(e),u<h&&(h=u,r&&r.copy(s),a&&a.copy(e))}return this.closestPointToPoint(o,s),u=o.distanceToSquared(s),u<h&&(h=u,r&&r.copy(s),a&&a.copy(o)),this.closestPointToPoint(l,s),u=l.distanceToSquared(s),u<h&&(h=u,r&&r.copy(s),a&&a.copy(l)),Math.sqrt(h)}}();pi.prototype.intersectsTriangle=function(){const s=new pi,e=new Array(3),t=new Array(3),i=new Fi,n=new Fi,r=new P,a=new P,o=new P,l=new P,c=new P,u=new Ni,h=new Ni,d=new Ni,f=new P;function v(_,m,p){const y=_.points;let g=0,x=-1;for(let S=0;S<3;S++){const{start:b,end:T}=u;b.copy(y[S]),T.copy(y[(S+1)%3]),u.delta(a);const C=io(m.distanceToPoint(b));if(io(m.normal.dot(a))&&C){p.copy(u),g=2;break}const w=m.intersectLine(u,f);if(!w&&C&&f.copy(b),(w||C)&&!io(f.distanceTo(T))){if(g<=1)(g===1?p.start:p.end).copy(f),C&&(x=g);else if(g>=2){(x===1?p.start:p.end).copy(f),g=2;break}if(g++,g===2&&x===-1)break}}return g}return function(m,p=null,y=!1){this.needsUpdate&&this.update(),m.isExtendedTriangle?m.needsUpdate&&m.update():(s.copy(m),s.update(),m=s);const g=this.plane,x=m.plane;if(Math.abs(g.normal.dot(x.normal))>1-1e-10){const S=this.satBounds,b=this.satAxes;t[0]=m.a,t[1]=m.b,t[2]=m.c;for(let w=0;w<4;w++){const M=S[w],D=b[w];if(i.setFromPoints(D,t),M.isSeparated(i))return!1}const T=m.satBounds,C=m.satAxes;e[0]=this.a,e[1]=this.b,e[2]=this.c;for(let w=0;w<4;w++){const M=T[w],D=C[w];if(i.setFromPoints(D,e),M.isSeparated(i))return!1}for(let w=0;w<4;w++){const M=b[w];for(let D=0;D<4;D++){const A=C[D];if(r.crossVectors(M,A),i.setFromPoints(r,e),n.setFromPoints(r,t),i.isSeparated(n))return!1}}return p&&(y||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),p.start.set(0,0,0),p.end.set(0,0,0)),!0}else{const S=v(this,x,h);if(S===1&&m.containsPoint(h.end))return p&&(p.start.copy(h.end),p.end.copy(h.end)),!0;if(S!==2)return!1;const b=v(m,g,d);if(b===1&&this.containsPoint(d.end))return p&&(p.start.copy(d.end),p.end.copy(d.end)),!0;if(b!==2)return!1;if(h.delta(o),d.delta(l),o.dot(l)<0){let N=d.start;d.start=d.end,d.end=N}const T=h.start.dot(o),C=h.end.dot(o),w=d.start.dot(o),M=d.end.dot(o),D=C<w,A=T<M;return T!==M&&w!==C&&D===A?!1:(p&&(c.subVectors(h.start,d.start),c.dot(o)>0?p.start.copy(h.start):p.start.copy(d.start),c.subVectors(h.end,d.end),c.dot(o)<0?p.end.copy(h.end):p.end.copy(d.end)),!0)}}}();pi.prototype.distanceToPoint=function(){const s=new P;return function(t){return this.closestPointToPoint(t,s),t.distanceTo(s)}}();pi.prototype.distanceToTriangle=function(){const s=new P,e=new P,t=["a","b","c"],i=new Ni,n=new Ni;return function(a,o=null,l=null){const c=o||l?i:null;if(this.intersectsTriangle(a,c))return(o||l)&&(o&&c.getCenter(o),l&&c.getCenter(l)),0;let u=1/0;for(let h=0;h<3;h++){let d;const f=t[h],v=a[f];this.closestPointToPoint(v,s),d=v.distanceToSquared(s),d<u&&(u=d,o&&o.copy(s),l&&l.copy(v));const _=this[f];a.closestPointToPoint(_,s),d=_.distanceToSquared(s),d<u&&(u=d,o&&o.copy(_),l&&l.copy(s))}for(let h=0;h<3;h++){const d=t[h],f=t[(h+1)%3];i.set(this[d],this[f]);for(let v=0;v<3;v++){const _=t[v],m=t[(v+1)%3];n.set(a[_],a[m]),Yo(i,n,s,e);const p=s.distanceToSquared(e);p<u&&(u=p,o&&o.copy(s),l&&l.copy(e))}}return Math.sqrt(u)}}();class Wt{constructor(e,t,i){this.isOrientedBox=!0,this.min=new P,this.max=new P,this.matrix=new he,this.invMatrix=new he,this.points=new Array(8).fill().map(()=>new P),this.satAxes=new Array(3).fill().map(()=>new P),this.satBounds=new Array(3).fill().map(()=>new Fi),this.alignedSatBounds=new Array(3).fill().map(()=>new Fi),this.needsUpdate=!1,e&&this.min.copy(e),t&&this.max.copy(t),i&&this.matrix.copy(i)}set(e,t,i){this.min.copy(e),this.max.copy(t),this.matrix.copy(i),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}}Wt.prototype.update=function(){return function(){const e=this.matrix,t=this.min,i=this.max,n=this.points;for(let c=0;c<=1;c++)for(let u=0;u<=1;u++)for(let h=0;h<=1;h++){const d=1*c|2*u|4*h,f=n[d];f.x=c?i.x:t.x,f.y=u?i.y:t.y,f.z=h?i.z:t.z,f.applyMatrix4(e)}const r=this.satBounds,a=this.satAxes,o=n[0];for(let c=0;c<3;c++){const u=a[c],h=r[c],d=1<<c,f=n[d];u.subVectors(o,f),h.setFromPoints(u,n)}const l=this.alignedSatBounds;l[0].setFromPointsField(n,"x"),l[1].setFromPointsField(n,"y"),l[2].setFromPointsField(n,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}}();Wt.prototype.intersectsBox=function(){const s=new Fi;return function(t){this.needsUpdate&&this.update();const i=t.min,n=t.max,r=this.satBounds,a=this.satAxes,o=this.alignedSatBounds;if(s.min=i.x,s.max=n.x,o[0].isSeparated(s)||(s.min=i.y,s.max=n.y,o[1].isSeparated(s))||(s.min=i.z,s.max=n.z,o[2].isSeparated(s)))return!1;for(let l=0;l<3;l++){const c=a[l],u=r[l];if(s.setFromBox(c,t),u.isSeparated(s))return!1}return!0}}();Wt.prototype.intersectsTriangle=function(){const s=new pi,e=new Array(3),t=new Fi,i=new Fi,n=new P;return function(a){this.needsUpdate&&this.update(),a.isExtendedTriangle?a.needsUpdate&&a.update():(s.copy(a),s.update(),a=s);const o=this.satBounds,l=this.satAxes;e[0]=a.a,e[1]=a.b,e[2]=a.c;for(let d=0;d<3;d++){const f=o[d],v=l[d];if(t.setFromPoints(v,e),f.isSeparated(t))return!1}const c=a.satBounds,u=a.satAxes,h=this.points;for(let d=0;d<3;d++){const f=c[d],v=u[d];if(t.setFromPoints(v,h),f.isSeparated(t))return!1}for(let d=0;d<3;d++){const f=l[d];for(let v=0;v<4;v++){const _=u[v];if(n.crossVectors(f,_),t.setFromPoints(n,e),i.setFromPoints(n,h),t.isSeparated(i))return!1}}return!0}}();Wt.prototype.closestPointToPoint=function(){return function(e,t){return this.needsUpdate&&this.update(),t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),t}}();Wt.prototype.distanceToPoint=function(){const s=new P;return function(t){return this.closestPointToPoint(t,s),t.distanceTo(s)}}();Wt.prototype.distanceToBox=function(){const s=["x","y","z"],e=new Array(12).fill().map(()=>new Ni),t=new Array(12).fill().map(()=>new Ni),i=new P,n=new P;return function(a,o=0,l=null,c=null){if(this.needsUpdate&&this.update(),this.intersectsBox(a))return(l||c)&&(a.getCenter(n),this.closestPointToPoint(n,i),a.closestPointToPoint(i,n),l&&l.copy(i),c&&c.copy(n)),0;const u=o*o,h=a.min,d=a.max,f=this.points;let v=1/0;for(let m=0;m<8;m++){const p=f[m];n.copy(p).clamp(h,d);const y=p.distanceToSquared(n);if(y<v&&(v=y,l&&l.copy(p),c&&c.copy(n),y<u))return Math.sqrt(y)}let _=0;for(let m=0;m<3;m++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){const g=(m+1)%3,x=(m+2)%3,S=p<<g|y<<x,b=1<<m|p<<g|y<<x,T=f[S],C=f[b];e[_].set(T,C);const M=s[m],D=s[g],A=s[x],N=t[_],I=N.start,U=N.end;I[M]=h[M],I[D]=p?h[D]:d[D],I[A]=y?h[A]:d[D],U[M]=d[M],U[D]=p?h[D]:d[D],U[A]=y?h[A]:d[D],_++}for(let m=0;m<=1;m++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){n.x=m?d.x:h.x,n.y=p?d.y:h.y,n.z=y?d.z:h.z,this.closestPointToPoint(n,i);const g=n.distanceToSquared(i);if(g<v&&(v=g,l&&l.copy(i),c&&c.copy(n),g<u))return Math.sqrt(g)}for(let m=0;m<12;m++){const p=e[m];for(let y=0;y<12;y++){const g=t[y];Yo(p,g,i,n);const x=i.distanceToSquared(n);if(x<v&&(v=x,l&&l.copy(i),c&&c.copy(n),x<u))return Math.sqrt(x)}}return Math.sqrt(v)}}();class Zo{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){const e=this._primitives;return e.length===0?this._getNewPrimitive():e.pop()}releasePrimitive(e){this._primitives.push(e)}}class s_ extends Zo{constructor(){super(()=>new pi)}}const ri=new s_;class r_{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const e=[];let t=null;this.setBuffer=i=>{t&&e.push(t),t=i,this.float32Array=new Float32Array(i),this.uint16Array=new Uint16Array(i),this.uint32Array=new Uint32Array(i)},this.clearBuffer=()=>{t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0&&this.setBuffer(e.pop())}}}const at=new r_;let Xi,jn;const Nn=[],Sr=new Zo(()=>new At);function a_(s,e,t,i,n,r){Xi=Sr.getPrimitive(),jn=Sr.getPrimitive(),Nn.push(Xi,jn),at.setBuffer(s._roots[e]);const a=Ao(0,s.geometry,t,i,n,r);at.clearBuffer(),Sr.releasePrimitive(Xi),Sr.releasePrimitive(jn),Nn.pop(),Nn.pop();const o=Nn.length;return o>0&&(jn=Nn[o-1],Xi=Nn[o-2]),a}function Ao(s,e,t,i,n=null,r=0,a=0){const{float32Array:o,uint16Array:l,uint32Array:c}=at;let u=s*2;if(Gt(u,l)){const d=qt(s,c),f=$t(u,l);return ft(s,o,Xi),i(d,f,!1,a,r+s,Xi)}else{let M=function(A){const{uint16Array:N,uint32Array:I}=at;let U=A*2;for(;!Gt(U,N);)A=si(A),U=A*2;return qt(A,I)},D=function(A){const{uint16Array:N,uint32Array:I}=at;let U=A*2;for(;!Gt(U,N);)A=ei(A,I),U=A*2;return qt(A,I)+$t(U,N)};const d=si(s),f=ei(s,c);let v=d,_=f,m,p,y,g;if(n&&(y=Xi,g=jn,ft(v,o,y),ft(_,o,g),m=n(y),p=n(g),p<m)){v=f,_=d;const A=m;m=p,p=A,y=g}y||(y=Xi,ft(v,o,y));const x=Gt(v*2,l),S=t(y,x,m,a+1,r+v);let b;if(S===$c){const A=M(v),I=D(v)-A;b=i(A,I,!0,a+1,r+v,y)}else b=S&&Ao(v,e,t,i,n,r,a+1);if(b)return!0;g=jn,ft(_,o,g);const T=Gt(_*2,l),C=t(g,T,p,a+1,r+_);let w;if(C===$c){const A=M(_),I=D(_)-A;w=i(A,I,!0,a+1,r+_,g)}else w=C&&Ao(_,e,t,i,n,r,a+1);return!!w}}const ys=new P,no=new P;function o_(s,e,t={},i=0,n=1/0){const r=i*i,a=n*n;let o=1/0,l=null;if(s.shapecast({boundsTraverseOrder:u=>(ys.copy(e).clamp(u.min,u.max),ys.distanceToSquared(e)),intersectsBounds:(u,h,d)=>d<o&&d<a,intersectsTriangle:(u,h)=>{u.closestPointToPoint(e,ys);const d=e.distanceToSquared(ys);return d<o&&(no.copy(ys),o=d,l=h),d<r}}),o===1/0)return null;const c=Math.sqrt(o);return t.point?t.point.copy(no):t.point=no.clone(),t.distance=c,t.faceIndex=l,t}const Un=new P,Fn=new P,Bn=new P,wr=new le,Mr=new le,Tr=new le,su=new P,ru=new P,au=new P,Er=new P;function l_(s,e,t,i,n,r,a,o){let l;if(r===Ht?l=s.intersectTriangle(i,t,e,!0,n):l=s.intersectTriangle(e,t,i,r!==_i,n),l===null)return null;const c=s.origin.distanceTo(n);return c<a||c>o?null:{distance:c,point:n.clone()}}function c_(s,e,t,i,n,r,a,o,l,c,u){Un.fromBufferAttribute(e,r),Fn.fromBufferAttribute(e,a),Bn.fromBufferAttribute(e,o);const h=l_(s,Un,Fn,Bn,Er,l,c,u);if(h){i&&(wr.fromBufferAttribute(i,r),Mr.fromBufferAttribute(i,a),Tr.fromBufferAttribute(i,o),h.uv=Lt.getInterpolation(Er,Un,Fn,Bn,wr,Mr,Tr,new le)),n&&(wr.fromBufferAttribute(n,r),Mr.fromBufferAttribute(n,a),Tr.fromBufferAttribute(n,o),h.uv1=Lt.getInterpolation(Er,Un,Fn,Bn,wr,Mr,Tr,new le)),t&&(su.fromBufferAttribute(t,r),ru.fromBufferAttribute(t,a),au.fromBufferAttribute(t,o),h.normal=Lt.getInterpolation(Er,Un,Fn,Bn,su,ru,au,new P),h.normal.dot(s.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:a,c:o,normal:new P,materialIndex:0};Lt.getNormal(Un,Fn,Bn,d.normal),h.face=d,h.faceIndex=r}return h}function ua(s,e,t,i,n,r,a){const o=i*3;let l=o+0,c=o+1,u=o+2;const h=s.index;s.index&&(l=h.getX(l),c=h.getX(c),u=h.getX(u));const{position:d,normal:f,uv:v,uv1:_}=s.attributes,m=c_(t,d,f,v,_,l,c,u,e,r,a);return m?(m.faceIndex=i,n&&n.push(m),m):null}function _t(s,e,t,i){const n=s.a,r=s.b,a=s.c;let o=e,l=e+1,c=e+2;t&&(o=t.getX(o),l=t.getX(l),c=t.getX(c)),n.x=i.getX(o),n.y=i.getY(o),n.z=i.getZ(o),r.x=i.getX(l),r.y=i.getY(l),r.z=i.getZ(l),a.x=i.getX(c),a.y=i.getY(c),a.z=i.getZ(c)}function u_(s,e,t,i,n,r,a,o){const{geometry:l,_indirectBuffer:c}=s;for(let u=i,h=i+n;u<h;u++)ua(l,e,t,u,r,a,o)}function h_(s,e,t,i,n,r,a){const{geometry:o,_indirectBuffer:l}=s;let c=1/0,u=null;for(let h=i,d=i+n;h<d;h++){let f;f=ua(o,e,t,h,null,r,a),f&&f.distance<c&&(u=f,c=f.distance)}return u}function d_(s,e,t,i,n,r,a){const{geometry:o}=t,{index:l}=o,c=o.attributes.position;for(let u=s,h=e+s;u<h;u++){let d;if(d=u,_t(a,d*3,l,c),a.needsUpdate=!0,i(a,d,n,r))return!0}return!1}function f_(s,e=null){e&&Array.isArray(e)&&(e=new Set(e));const t=s.geometry,i=t.index?t.index.array:null,n=t.attributes.position;let r,a,o,l,c=0;const u=s._roots;for(let d=0,f=u.length;d<f;d++)r=u[d],a=new Uint32Array(r),o=new Uint16Array(r),l=new Float32Array(r),h(0,c),c+=r.byteLength;function h(d,f,v=!1){const _=d*2;if(o[_+15]===ca){const p=a[d+6],y=o[_+14];let g=1/0,x=1/0,S=1/0,b=-1/0,T=-1/0,C=-1/0;for(let w=3*p,M=3*(p+y);w<M;w++){let D=i[w];const A=n.getX(D),N=n.getY(D),I=n.getZ(D);A<g&&(g=A),A>b&&(b=A),N<x&&(x=N),N>T&&(T=N),I<S&&(S=I),I>C&&(C=I)}return l[d+0]!==g||l[d+1]!==x||l[d+2]!==S||l[d+3]!==b||l[d+4]!==T||l[d+5]!==C?(l[d+0]=g,l[d+1]=x,l[d+2]=S,l[d+3]=b,l[d+4]=T,l[d+5]=C,!0):!1}else{const p=d+8,y=a[d+6],g=p+f,x=y+f;let S=v,b=!1,T=!1;e?S||(b=e.has(g),T=e.has(x),S=!b&&!T):(b=!0,T=!0);const C=S||b,w=S||T;let M=!1;C&&(M=h(p,f,S));let D=!1;w&&(D=h(y,f,S));const A=M||D;if(A)for(let N=0;N<3;N++){const I=p+N,U=y+N,B=l[I],K=l[I+3],k=l[U],X=l[U+3];l[d+N]=B<k?B:k,l[d+N+3]=K>X?K:X}return A}}}function Yi(s,e,t,i,n){let r,a,o,l,c,u;const h=1/t.direction.x,d=1/t.direction.y,f=1/t.direction.z,v=t.origin.x,_=t.origin.y,m=t.origin.z;let p=e[s],y=e[s+3],g=e[s+1],x=e[s+3+1],S=e[s+2],b=e[s+3+2];return h>=0?(r=(p-v)*h,a=(y-v)*h):(r=(y-v)*h,a=(p-v)*h),d>=0?(o=(g-_)*d,l=(x-_)*d):(o=(x-_)*d,l=(g-_)*d),r>l||o>a||((o>r||isNaN(r))&&(r=o),(l<a||isNaN(a))&&(a=l),f>=0?(c=(S-m)*f,u=(b-m)*f):(c=(b-m)*f,u=(S-m)*f),r>u||c>a)?!1:((c>r||r!==r)&&(r=c),(u<a||a!==a)&&(a=u),r<=n&&a>=i)}function p_(s,e,t,i,n,r,a,o){const{geometry:l,_indirectBuffer:c}=s;for(let u=i,h=i+n;u<h;u++){let d=c?c[u]:u;ua(l,e,t,d,r,a,o)}}function m_(s,e,t,i,n,r,a){const{geometry:o,_indirectBuffer:l}=s;let c=1/0,u=null;for(let h=i,d=i+n;h<d;h++){let f;f=ua(o,e,t,l?l[h]:h,null,r,a),f&&f.distance<c&&(u=f,c=f.distance)}return u}function g_(s,e,t,i,n,r,a){const{geometry:o}=t,{index:l}=o,c=o.attributes.position;for(let u=s,h=e+s;u<h;u++){let d;if(d=t.resolveTriangleIndex(u),_t(a,d*3,l,c),a.needsUpdate=!0,i(a,d,n,r))return!0}return!1}function v_(s,e,t,i,n,r,a){at.setBuffer(s._roots[e]),Ro(0,s,t,i,n,r,a),at.clearBuffer()}function Ro(s,e,t,i,n,r,a){const{float32Array:o,uint16Array:l,uint32Array:c}=at,u=s*2;if(Gt(u,l)){const d=qt(s,c),f=$t(u,l);u_(e,t,i,d,f,n,r,a)}else{const d=si(s);Yi(d,o,i,r,a)&&Ro(d,e,t,i,n,r,a);const f=ei(s,c);Yi(f,o,i,r,a)&&Ro(f,e,t,i,n,r,a)}}const __=["x","y","z"];function y_(s,e,t,i,n,r){at.setBuffer(s._roots[e]);const a=Po(0,s,t,i,n,r);return at.clearBuffer(),a}function Po(s,e,t,i,n,r){const{float32Array:a,uint16Array:o,uint32Array:l}=at;let c=s*2;if(Gt(c,o)){const h=qt(s,l),d=$t(c,o);return h_(e,t,i,h,d,n,r)}else{const h=jo(s,l),d=__[h],v=i.direction[d]>=0;let _,m;v?(_=si(s),m=ei(s,l)):(_=ei(s,l),m=si(s));const y=Yi(_,a,i,n,r)?Po(_,e,t,i,n,r):null;if(y){const S=y.point[d];if(v?S<=a[m+h]:S>=a[m+h+3])return y}const x=Yi(m,a,i,n,r)?Po(m,e,t,i,n,r):null;return y&&x?y.distance<=x.distance?y:x:y||x||null}}const Ar=new At,On=new pi,kn=new pi,xs=new he,ou=new Wt,Rr=new Wt;function x_(s,e,t,i){at.setBuffer(s._roots[e]);const n=Co(0,s,t,i);return at.clearBuffer(),n}function Co(s,e,t,i,n=null){const{float32Array:r,uint16Array:a,uint32Array:o}=at;let l=s*2;if(n===null&&(t.boundingBox||t.computeBoundingBox(),ou.set(t.boundingBox.min,t.boundingBox.max,i),n=ou),Gt(l,a)){const u=e.geometry,h=u.index,d=u.attributes.position,f=t.index,v=t.attributes.position,_=qt(s,o),m=$t(l,a);if(xs.copy(i).invert(),t.boundsTree)return ft(s,r,Rr),Rr.matrix.copy(xs),Rr.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:y=>Rr.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(i),y.b.applyMatrix4(i),y.c.applyMatrix4(i),y.needsUpdate=!0;for(let g=_*3,x=(m+_)*3;g<x;g+=3)if(_t(kn,g,h,d),kn.needsUpdate=!0,y.intersectsTriangle(kn))return!0;return!1}});for(let p=_*3,y=(m+_)*3;p<y;p+=3){_t(On,p,h,d),On.a.applyMatrix4(xs),On.b.applyMatrix4(xs),On.c.applyMatrix4(xs),On.needsUpdate=!0;for(let g=0,x=f.count;g<x;g+=3)if(_t(kn,g,f,v),kn.needsUpdate=!0,On.intersectsTriangle(kn))return!0}}else{const u=s+8,h=o[s+6];return ft(u,r,Ar),!!(n.intersectsBox(Ar)&&Co(u,e,t,i,n)||(ft(h,r,Ar),n.intersectsBox(Ar)&&Co(h,e,t,i,n)))}}const Pr=new he,so=new Wt,bs=new Wt,b_=new P,S_=new P,w_=new P,M_=new P;function T_(s,e,t,i={},n={},r=0,a=1/0){e.boundingBox||e.computeBoundingBox(),so.set(e.boundingBox.min,e.boundingBox.max,t),so.needsUpdate=!0;const o=s.geometry,l=o.attributes.position,c=o.index,u=e.attributes.position,h=e.index,d=ri.getPrimitive(),f=ri.getPrimitive();let v=b_,_=S_,m=null,p=null;n&&(m=w_,p=M_);let y=1/0,g=null,x=null;return Pr.copy(t).invert(),bs.matrix.copy(Pr),s.shapecast({boundsTraverseOrder:S=>so.distanceToBox(S),intersectsBounds:(S,b,T)=>T<y&&T<a?(b&&(bs.min.copy(S.min),bs.max.copy(S.max),bs.needsUpdate=!0),!0):!1,intersectsRange:(S,b)=>{if(e.boundsTree)return e.boundsTree.shapecast({boundsTraverseOrder:C=>bs.distanceToBox(C),intersectsBounds:(C,w,M)=>M<y&&M<a,intersectsRange:(C,w)=>{for(let M=C,D=C+w;M<D;M++){_t(f,3*M,h,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let A=S,N=S+b;A<N;A++){_t(d,3*A,c,l),d.needsUpdate=!0;const I=d.distanceToTriangle(f,v,m);if(I<y&&(_.copy(v),p&&p.copy(m),y=I,g=A,x=M),I<r)return!0}}}});{const T=as(e);for(let C=0,w=T;C<w;C++){_t(f,3*C,h,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let M=S,D=S+b;M<D;M++){_t(d,3*M,c,l),d.needsUpdate=!0;const A=d.distanceToTriangle(f,v,m);if(A<y&&(_.copy(v),p&&p.copy(m),y=A,g=M,x=C),A<r)return!0}}}}}),ri.releasePrimitive(d),ri.releasePrimitive(f),y===1/0?null:(i.point?i.point.copy(_):i.point=_.clone(),i.distance=y,i.faceIndex=g,n&&(n.point?n.point.copy(p):n.point=p.clone(),n.point.applyMatrix4(Pr),_.applyMatrix4(Pr),n.distance=_.sub(n.point).length(),n.faceIndex=x),i)}function E_(s,e=null){e&&Array.isArray(e)&&(e=new Set(e));const t=s.geometry,i=t.index?t.index.array:null,n=t.attributes.position;let r,a,o,l,c=0;const u=s._roots;for(let d=0,f=u.length;d<f;d++)r=u[d],a=new Uint32Array(r),o=new Uint16Array(r),l=new Float32Array(r),h(0,c),c+=r.byteLength;function h(d,f,v=!1){const _=d*2;if(o[_+15]===ca){const p=a[d+6],y=o[_+14];let g=1/0,x=1/0,S=1/0,b=-1/0,T=-1/0,C=-1/0;for(let w=p,M=p+y;w<M;w++){const D=3*s.resolveTriangleIndex(w);for(let A=0;A<3;A++){let N=D+A;N=i?i[N]:N;const I=n.getX(N),U=n.getY(N),B=n.getZ(N);I<g&&(g=I),I>b&&(b=I),U<x&&(x=U),U>T&&(T=U),B<S&&(S=B),B>C&&(C=B)}}return l[d+0]!==g||l[d+1]!==x||l[d+2]!==S||l[d+3]!==b||l[d+4]!==T||l[d+5]!==C?(l[d+0]=g,l[d+1]=x,l[d+2]=S,l[d+3]=b,l[d+4]=T,l[d+5]=C,!0):!1}else{const p=d+8,y=a[d+6],g=p+f,x=y+f;let S=v,b=!1,T=!1;e?S||(b=e.has(g),T=e.has(x),S=!b&&!T):(b=!0,T=!0);const C=S||b,w=S||T;let M=!1;C&&(M=h(p,f,S));let D=!1;w&&(D=h(y,f,S));const A=M||D;if(A)for(let N=0;N<3;N++){const I=p+N,U=y+N,B=l[I],K=l[I+3],k=l[U],X=l[U+3];l[d+N]=B<k?B:k,l[d+N+3]=K>X?K:X}return A}}}function A_(s,e,t,i,n,r,a){at.setBuffer(s._roots[e]),Lo(0,s,t,i,n,r,a),at.clearBuffer()}function Lo(s,e,t,i,n,r,a){const{float32Array:o,uint16Array:l,uint32Array:c}=at,u=s*2;if(Gt(u,l)){const d=qt(s,c),f=$t(u,l);p_(e,t,i,d,f,n,r,a)}else{const d=si(s);Yi(d,o,i,r,a)&&Lo(d,e,t,i,n,r,a);const f=ei(s,c);Yi(f,o,i,r,a)&&Lo(f,e,t,i,n,r,a)}}const R_=["x","y","z"];function P_(s,e,t,i,n,r){at.setBuffer(s._roots[e]);const a=Io(0,s,t,i,n,r);return at.clearBuffer(),a}function Io(s,e,t,i,n,r){const{float32Array:a,uint16Array:o,uint32Array:l}=at;let c=s*2;if(Gt(c,o)){const h=qt(s,l),d=$t(c,o);return m_(e,t,i,h,d,n,r)}else{const h=jo(s,l),d=R_[h],v=i.direction[d]>=0;let _,m;v?(_=si(s),m=ei(s,l)):(_=ei(s,l),m=si(s));const y=Yi(_,a,i,n,r)?Io(_,e,t,i,n,r):null;if(y){const S=y.point[d];if(v?S<=a[m+h]:S>=a[m+h+3])return y}const x=Yi(m,a,i,n,r)?Io(m,e,t,i,n,r):null;return y&&x?y.distance<=x.distance?y:x:y||x||null}}const Cr=new At,zn=new pi,Gn=new pi,Ss=new he,lu=new Wt,Lr=new Wt;function C_(s,e,t,i){at.setBuffer(s._roots[e]);const n=Do(0,s,t,i);return at.clearBuffer(),n}function Do(s,e,t,i,n=null){const{float32Array:r,uint16Array:a,uint32Array:o}=at;let l=s*2;if(n===null&&(t.boundingBox||t.computeBoundingBox(),lu.set(t.boundingBox.min,t.boundingBox.max,i),n=lu),Gt(l,a)){const u=e.geometry,h=u.index,d=u.attributes.position,f=t.index,v=t.attributes.position,_=qt(s,o),m=$t(l,a);if(Ss.copy(i).invert(),t.boundsTree)return ft(s,r,Lr),Lr.matrix.copy(Ss),Lr.needsUpdate=!0,t.boundsTree.shapecast({intersectsBounds:y=>Lr.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(i),y.b.applyMatrix4(i),y.c.applyMatrix4(i),y.needsUpdate=!0;for(let g=_,x=m+_;g<x;g++)if(_t(Gn,3*e.resolveTriangleIndex(g),h,d),Gn.needsUpdate=!0,y.intersectsTriangle(Gn))return!0;return!1}});for(let p=_,y=m+_;p<y;p++){const g=e.resolveTriangleIndex(p);_t(zn,3*g,h,d),zn.a.applyMatrix4(Ss),zn.b.applyMatrix4(Ss),zn.c.applyMatrix4(Ss),zn.needsUpdate=!0;for(let x=0,S=f.count;x<S;x+=3)if(_t(Gn,x,f,v),Gn.needsUpdate=!0,zn.intersectsTriangle(Gn))return!0}}else{const u=s+8,h=o[s+6];return ft(u,r,Cr),!!(n.intersectsBox(Cr)&&Do(u,e,t,i,n)||(ft(h,r,Cr),n.intersectsBox(Cr)&&Do(h,e,t,i,n)))}}const Ir=new he,ro=new Wt,ws=new Wt,L_=new P,I_=new P,D_=new P,N_=new P;function U_(s,e,t,i={},n={},r=0,a=1/0){e.boundingBox||e.computeBoundingBox(),ro.set(e.boundingBox.min,e.boundingBox.max,t),ro.needsUpdate=!0;const o=s.geometry,l=o.attributes.position,c=o.index,u=e.attributes.position,h=e.index,d=ri.getPrimitive(),f=ri.getPrimitive();let v=L_,_=I_,m=null,p=null;n&&(m=D_,p=N_);let y=1/0,g=null,x=null;return Ir.copy(t).invert(),ws.matrix.copy(Ir),s.shapecast({boundsTraverseOrder:S=>ro.distanceToBox(S),intersectsBounds:(S,b,T)=>T<y&&T<a?(b&&(ws.min.copy(S.min),ws.max.copy(S.max),ws.needsUpdate=!0),!0):!1,intersectsRange:(S,b)=>{if(e.boundsTree){const T=e.boundsTree;return T.shapecast({boundsTraverseOrder:C=>ws.distanceToBox(C),intersectsBounds:(C,w,M)=>M<y&&M<a,intersectsRange:(C,w)=>{for(let M=C,D=C+w;M<D;M++){const A=T.resolveTriangleIndex(M);_t(f,3*A,h,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let N=S,I=S+b;N<I;N++){const U=s.resolveTriangleIndex(N);_t(d,3*U,c,l),d.needsUpdate=!0;const B=d.distanceToTriangle(f,v,m);if(B<y&&(_.copy(v),p&&p.copy(m),y=B,g=N,x=M),B<r)return!0}}}})}else{const T=as(e);for(let C=0,w=T;C<w;C++){_t(f,3*C,h,u),f.a.applyMatrix4(t),f.b.applyMatrix4(t),f.c.applyMatrix4(t),f.needsUpdate=!0;for(let M=S,D=S+b;M<D;M++){const A=s.resolveTriangleIndex(M);_t(d,3*A,c,l),d.needsUpdate=!0;const N=d.distanceToTriangle(f,v,m);if(N<y&&(_.copy(v),p&&p.copy(m),y=N,g=M,x=C),N<r)return!0}}}}}),ri.releasePrimitive(d),ri.releasePrimitive(f),y===1/0?null:(i.point?i.point.copy(_):i.point=_.clone(),i.distance=y,i.faceIndex=g,n&&(n.point?n.point.copy(p):n.point=p.clone(),n.point.applyMatrix4(Ir),_.applyMatrix4(Ir),n.distance=_.sub(n.point).length(),n.faceIndex=x),i)}function F_(){return typeof SharedArrayBuffer<"u"}const Ps=new at.constructor,Qr=new at.constructor,Vi=new Zo(()=>new At),Hn=new At,Vn=new At,ao=new At,oo=new At;let lo=!1;function B_(s,e,t,i){if(lo)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");lo=!0;const n=s._roots,r=e._roots;let a,o=0,l=0;const c=new he().copy(t).invert();for(let u=0,h=n.length;u<h;u++){Ps.setBuffer(n[u]),l=0;const d=Vi.getPrimitive();ft(0,Ps.float32Array,d),d.applyMatrix4(c);for(let f=0,v=r.length;f<v&&(Qr.setBuffer(r[f]),a=ui(0,0,t,c,i,o,l,0,0,d),Qr.clearBuffer(),l+=r[f].length,!a);f++);if(Vi.releasePrimitive(d),Ps.clearBuffer(),o+=n[u].length,a)break}return lo=!1,a}function ui(s,e,t,i,n,r=0,a=0,o=0,l=0,c=null,u=!1){let h,d;u?(h=Qr,d=Ps):(h=Ps,d=Qr);const f=h.float32Array,v=h.uint32Array,_=h.uint16Array,m=d.float32Array,p=d.uint32Array,y=d.uint16Array,g=s*2,x=e*2,S=Gt(g,_),b=Gt(x,y);let T=!1;if(b&&S)u?T=n(qt(e,p),$t(e*2,y),qt(s,v),$t(s*2,_),l,a+e,o,r+s):T=n(qt(s,v),$t(s*2,_),qt(e,p),$t(e*2,y),o,r+s,l,a+e);else if(b){const C=Vi.getPrimitive();ft(e,m,C),C.applyMatrix4(t);const w=si(s),M=ei(s,v);ft(w,f,Hn),ft(M,f,Vn);const D=C.intersectsBox(Hn),A=C.intersectsBox(Vn);T=D&&ui(e,w,i,t,n,a,r,l,o+1,C,!u)||A&&ui(e,M,i,t,n,a,r,l,o+1,C,!u),Vi.releasePrimitive(C)}else{const C=si(e),w=ei(e,p);ft(C,m,ao),ft(w,m,oo);const M=c.intersectsBox(ao),D=c.intersectsBox(oo);if(M&&D)T=ui(s,C,t,i,n,r,a,o,l+1,c,u)||ui(s,w,t,i,n,r,a,o,l+1,c,u);else if(M)if(S)T=ui(s,C,t,i,n,r,a,o,l+1,c,u);else{const A=Vi.getPrimitive();A.copy(ao).applyMatrix4(t);const N=si(s),I=ei(s,v);ft(N,f,Hn),ft(I,f,Vn);const U=A.intersectsBox(Hn),B=A.intersectsBox(Vn);T=U&&ui(C,N,i,t,n,a,r,l,o+1,A,!u)||B&&ui(C,I,i,t,n,a,r,l,o+1,A,!u),Vi.releasePrimitive(A)}else if(D)if(S)T=ui(s,w,t,i,n,r,a,o,l+1,c,u);else{const A=Vi.getPrimitive();A.copy(oo).applyMatrix4(t);const N=si(s),I=ei(s,v);ft(N,f,Hn),ft(I,f,Vn);const U=A.intersectsBox(Hn),B=A.intersectsBox(Vn);T=U&&ui(w,N,i,t,n,a,r,l,o+1,A,!u)||B&&ui(w,I,i,t,n,a,r,l,o+1,A,!u),Vi.releasePrimitive(A)}}return T}const Dr=new Wt,cu=new At,O_={strategy:la,maxDepth:40,maxLeafTris:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null};class ha{static serialize(e,t={}){t={cloneBuffers:!0,...t};const i=e.geometry,n=e._roots,r=e._indirectBuffer,a=i.getIndex();let o;return t.cloneBuffers?o={roots:n.map(l=>l.slice()),index:a?a.array.slice():null,indirectBuffer:r?r.slice():null}:o={roots:n,index:a?a.array:null,indirectBuffer:r},o}static deserialize(e,t,i={}){i={setIndex:!0,indirect:!!e.indirectBuffer,...i};const{index:n,roots:r,indirectBuffer:a}=e,o=new ha(t,{...i,[$a]:!0});if(o._roots=r,o._indirectBuffer=a||null,i.setIndex){const l=t.getIndex();if(l===null){const c=new $e(e.index,1,!1);t.setIndex(c)}else l.array!==n&&(l.array.set(n),l.needsUpdate=!0)}return o}get indirect(){return!!this._indirectBuffer}constructor(e,t={}){if(e.isBufferGeometry){if(e.index&&e.index.isInterleavedBufferAttribute)throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("MeshBVH: Only BufferGeometries are supported.");if(t=Object.assign({...O_,[$a]:!1},t),t.useSharedArrayBuffer&&!F_())throw new Error("MeshBVH: SharedArrayBuffer is not available.");this.geometry=e,this._roots=null,this._indirectBuffer=null,t[$a]||(e_(this,t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new At))),this.resolveTriangleIndex=t.indirect?i=>this._indirectBuffer[i]:i=>i}refit(e=null){return(this.indirect?E_:f_)(this,e)}traverse(e,t=0){const i=this._roots[t],n=new Uint32Array(i),r=new Uint16Array(i);a(0);function a(o,l=0){const c=o*2,u=r[c+15]===ca;if(u){const h=n[o+6],d=r[c+14];e(l,u,new Float32Array(i,o*4,6),h,d)}else{const h=o+ji/4,d=n[o+6],f=n[o+7];e(l,u,new Float32Array(i,o*4,6),f)||(a(h,l+1),a(d,l+1))}}}raycast(e,t=ti,i=0,n=1/0){const r=this._roots,a=this.geometry,o=[],l=t.isMaterial,c=Array.isArray(t),u=a.groups,h=l?t.side:t,d=this.indirect?A_:v_;for(let f=0,v=r.length;f<v;f++){const _=c?t[u[f].materialIndex].side:h,m=o.length;if(d(this,f,_,e,o,i,n),c){const p=u[f].materialIndex;for(let y=m,g=o.length;y<g;y++)o[y].face.materialIndex=p}}return o}raycastFirst(e,t=ti,i=0,n=1/0){const r=this._roots,a=this.geometry,o=t.isMaterial,l=Array.isArray(t);let c=null;const u=a.groups,h=o?t.side:t,d=this.indirect?P_:y_;for(let f=0,v=r.length;f<v;f++){const _=l?t[u[f].materialIndex].side:h,m=d(this,f,_,e,i,n);m!=null&&(c==null||m.distance<c.distance)&&(c=m,l&&(m.face.materialIndex=u[f].materialIndex))}return c}intersectsGeometry(e,t){let i=!1;const n=this._roots,r=this.indirect?C_:x_;for(let a=0,o=n.length;a<o&&(i=r(this,a,e,t),!i);a++);return i}shapecast(e){const t=ri.getPrimitive(),i=this.indirect?g_:d_;let{boundsTraverseOrder:n,intersectsBounds:r,intersectsRange:a,intersectsTriangle:o}=e;if(a&&o){const h=a;a=(d,f,v,_,m)=>h(d,f,v,_,m)?!0:i(d,f,this,o,v,_,t)}else a||(o?a=(h,d,f,v)=>i(h,d,this,o,f,v,t):a=(h,d,f)=>f);let l=!1,c=0;const u=this._roots;for(let h=0,d=u.length;h<d;h++){const f=u[h];if(l=a_(this,h,r,a,n,c),l)break;c+=f.byteLength}return ri.releasePrimitive(t),l}bvhcast(e,t,i){let{intersectsRanges:n,intersectsTriangles:r}=i;const a=ri.getPrimitive(),o=this.geometry.index,l=this.geometry.attributes.position,c=this.indirect?v=>{const _=this.resolveTriangleIndex(v);_t(a,_*3,o,l)}:v=>{_t(a,v*3,o,l)},u=ri.getPrimitive(),h=e.geometry.index,d=e.geometry.attributes.position,f=e.indirect?v=>{const _=e.resolveTriangleIndex(v);_t(u,_*3,h,d)}:v=>{_t(u,v*3,h,d)};if(r){const v=(_,m,p,y,g,x,S,b)=>{for(let T=p,C=p+y;T<C;T++){f(T),u.a.applyMatrix4(t),u.b.applyMatrix4(t),u.c.applyMatrix4(t),u.needsUpdate=!0;for(let w=_,M=_+m;w<M;w++)if(c(w),a.needsUpdate=!0,r(a,u,w,T,g,x,S,b))return!0}return!1};if(n){const _=n;n=function(m,p,y,g,x,S,b,T){return _(m,p,y,g,x,S,b,T)?!0:v(m,p,y,g,x,S,b,T)}}else n=v}return B_(this,e,t,n)}intersectsBox(e,t){return Dr.set(e.min,e.max,t),Dr.needsUpdate=!0,this.shapecast({intersectsBounds:i=>Dr.intersectsBox(i),intersectsTriangle:i=>Dr.intersectsTriangle(i)})}intersectsSphere(e){return this.shapecast({intersectsBounds:t=>e.intersectsBox(t),intersectsTriangle:t=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,i={},n={},r=0,a=1/0){return(this.indirect?U_:T_)(this,e,t,i,n,r,a)}closestPointToPoint(e,t={},i=0,n=1/0){return o_(this,e,t,i,n)}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach(i=>{ft(0,new Float32Array(i),cu),e.union(cu)}),e}}function k_(s){switch(s){case 1:return"R";case 2:return"RG";case 3:return"RGBA";case 4:return"RGBA"}throw new Error}function z_(s){switch(s){case 1:return Lu;case 2:return ta;case 3:return Xe;case 4:return Xe}}function uu(s){switch(s){case 1:return Bo;case 2:return ia;case 3:return Ls;case 4:return Ls}}class yh extends Ds{constructor(){super(),this.minFilter=ze,this.magFilter=ze,this.generateMipmaps=!1,this.overrideItemSize=null,this._forcedType=null}updateFrom(e){const t=this.overrideItemSize,i=e.itemSize,n=e.count;if(t!==null){if(i*n%t!==0)throw new Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");e.itemSize=t,e.count=n*i/t}const r=e.itemSize,a=e.count,o=e.normalized,l=e.array.constructor,c=l.BYTES_PER_ELEMENT;let u=this._forcedType,h=r;if(u===null)switch(l){case Float32Array:u=pt;break;case Uint8Array:case Uint16Array:case Uint32Array:u=Qt;break;case Int8Array:case Int16Array:case Int32Array:u=Ts;break}let d,f,v,_,m=k_(r);switch(u){case pt:v=1,f=z_(r),o&&c===1?(_=l,m+="8",l===Uint8Array?d=hi:(d=yo,m+="_SNORM")):(_=Float32Array,m+="32F",d=pt);break;case Ts:m+=c*8+"I",v=o?Math.pow(2,l.BYTES_PER_ELEMENT*8-1):1,f=uu(r),c===1?(_=Int8Array,d=yo):c===2?(_=Int16Array,d=Ru):(_=Int32Array,d=Ts);break;case Qt:m+=c*8+"UI",v=o?Math.pow(2,l.BYTES_PER_ELEMENT*8-1):1,f=uu(r),c===1?(_=Uint8Array,d=hi):c===2?(_=Uint16Array,d=ea):(_=Uint32Array,d=Qt);break}h===3&&(f===Xe||f===Ls)&&(h=4);const p=Math.ceil(Math.sqrt(a))||1,y=h*p*p,g=new _(y),x=e.normalized;e.normalized=!1;for(let S=0;S<a;S++){const b=h*S;g[b]=e.getX(S)/v,r>=2&&(g[b+1]=e.getY(S)/v),r>=3&&(g[b+2]=e.getZ(S)/v,h===4&&(g[b+3]=1)),r>=4&&(g[b+3]=e.getW(S)/v)}e.normalized=x,this.internalFormat=m,this.format=f,this.type=d,this.image.width=p,this.image.height=p,this.image.data=g,this.needsUpdate=!0,this.dispose(),e.itemSize=i,e.count=n}}class G_ extends yh{constructor(){super(),this._forcedType=Qt}}class No extends yh{constructor(){super(),this._forcedType=pt}}class hu{constructor(){this.index=new G_,this.position=new No,this.bvhBounds=new Ds,this.bvhContents=new Ds,this._cachedIndexAttr=null,this.index.overrideItemSize=3}updateFrom(e){const{geometry:t}=e;if(V_(e,this.bvhBounds,this.bvhContents),this.position.updateFrom(t.attributes.position),e.indirect){const i=e._indirectBuffer;if(this._cachedIndexAttr===null||this._cachedIndexAttr.count!==i.length)if(t.index)this._cachedIndexAttr=t.index.clone();else{const n=ph(fh(t));this._cachedIndexAttr=new $e(n,1,!1)}H_(t,i,this._cachedIndexAttr),this.index.updateFrom(this._cachedIndexAttr)}else this.index.updateFrom(t.index)}dispose(){const{index:e,position:t,bvhBounds:i,bvhContents:n}=this;e&&e.dispose(),t&&t.dispose(),i&&i.dispose(),n&&n.dispose()}}function H_(s,e,t){const i=t.array,n=s.index?s.index.array:null;for(let r=0,a=e.length;r<a;r++){const o=3*r,l=3*e[r];for(let c=0;c<3;c++)i[o+c]=n?n[l+c]:l+c}}function V_(s,e,t){const i=s._roots;if(i.length!==1)throw new Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");const n=i[0],r=new Uint16Array(n),a=new Uint32Array(n),o=new Float32Array(n),l=n.byteLength/ji,c=2*Math.ceil(Math.sqrt(l/2)),u=new Float32Array(4*c*c),h=Math.ceil(Math.sqrt(l)),d=new Uint32Array(2*h*h);for(let f=0;f<l;f++){const v=f*ji/4,_=v*2,m=v;for(let p=0;p<3;p++)u[8*f+0+p]=o[m+0+p],u[8*f+4+p]=o[m+3+p];if(Gt(_,r)){const p=$t(_,r),y=qt(v,a),g=4294901760|p;d[f*2+0]=g,d[f*2+1]=y}else{const p=4*ei(v,a)/ji,y=jo(v,a);d[f*2+0]=y,d[f*2+1]=p}}e.image.data=u,e.image.width=c,e.image.height=c,e.format=Xe,e.type=pt,e.internalFormat="RGBA32F",e.minFilter=ze,e.magFilter=ze,e.generateMipmaps=!1,e.needsUpdate=!0,e.dispose(),t.image.data=d,t.image.width=h,t.image.height=h,t.format=ia,t.type=Qt,t.internalFormat="RG32UI",t.minFilter=ze,t.magFilter=ze,t.generateMipmaps=!1,t.needsUpdate=!0,t.dispose()}const W_=`

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
`,X_=`

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
`,q_=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,Jo=q_,Qo=`
	${W_}
	${X_}
`,K_="4nh6v3AXO108mJGEGrgVsY13JcfnHOYZvvoI1EIoMK4hmnJN38oOJJCMUpQOZr8JZQUlOOFJ/aYCN6D29NV8IDRP5FvZx/bdRIU/+pPa03RaJZBJsHB72Gn2RTRKOFm47X6+xtcFOQM7IJZN8aCpIJNKKMAUFWrcVoXYZJqnM0QsQOx10Y2H92wJ3lb60z+MiISeeC4ngM3V59EUgq+Jc70+9carXa+C/JtY8tnq5E4JKMWwZmEU+n0aqZ7WTkTgEtjtJbEKZk2GVyQJaZv7xZx1sOkl8xJcWwDDMafDWYkPjqYGMylJQmBfjpWP+b+3e9mvSyhWn8ehNkR2XLzSqSDetdKCMaIKtUzJJGDJb97TDNhFdKyaYqXbSIFnTfMz7O7Q3FJBs7mxMu2hNuCN8f53R8eBs65zKZFcD5WkNZZr8yGuphKshQh0BjeBr8EAJgETstHJ6moXttcPg0Yb+L/l+ZRizmQ8JmXcrH6zdW9G48aa4AtPOPdyA6nAy5EXYWPEgxD7VaE4dWYRqjQqtZuex/BE9rZl8JJPmZUTIDoLwnHpydRBBV0Xf6GFqjB4Ht5oLMUz/Tvv8rkBP8FWWFp0C8D4kaGXLjF2+RoSj3W4Py4SCoZvn4Dc1N/cNyBsTupn+/jR/lcaS3jS4pbkhlMMU2D/rw/4kvNpD0eeHo7txUtNMAYp/KNv7XHy41WgVIxABBM3ffI3XKyauACMc4p0WA8qrzlgzQ4bbXZVLRqnxXWJQSkC2lvn2E+/bbrmHlyOKuYuStBi41pW8Dug7cFTaJ1xZyqJ9pW1Ui4OhH+nqqQWBXMOZJ4qR+DMPx3+afn3ezCZnAYCNrqPg7ci67DdcinpFg9MfbCm29vA7jcGXwcBxQRcp2RFMSAha5jY4DDZX0uJF5MyduwVolOW5OXHS8RQgwKNjJ591ASvk3+XI9YV3GM8aansv0BQ09Ct5LdIJ8+mnk49XTrLbhm4O8iAgq6yrix4nR/LDENsFu+8yTkhCITWn8gllEGvYfkrZlEMf9alZlcF/Ia7ySYEOihl/4yBz7nO9n4gKgHCEcGekGv8XuelO/HQ29EKg5hGmJvHLhgb6bXrRIRj0AcZPUmLzsJ7v3MUtKjwezqQ3r2Y+jYeCtRR3EIvl0CNhG3q5vLMznVZ7bX/vo8vG5AyGrp8g8iM0+FSTl081dYrq7EdS/jDlZbaaEckOJInU43KWOJ6WXR74IWluff3OdinsX3uBURrIssxEra1u5NCJFZxBKZnLGzaqK8UcEW/RSv0JPn2tG7FrjA6gRaJkEtf2HZrBvD7KfJ9mMpSkh5Q5xmJcpXkA/EKKGk8qruAo141NeRzbtlG6txzEn+zEZHB6TzQ45eXPKsYd4LTqkWxnu2SRS9qwfNjS9yd1R1LL+ymfBjCVRxqe42+JPrlSPZjqtZgUIC13DsHcKpp/oz/+I6g0C1uER+ZpixJD0fhDIBkUnvHMKm8+8feGgGqXE89KLedIXRNFk6eN9/BWVkGr4yqUFhC6h4S8aCkYxE87X1ecAFJPVuBmfzM8R0ftT69cubNQuEZHhUt96drTrJPwHzQnEjQ6WRgb7r6iv71j1UfPdLz2tDnOg5hXMkne4tdckc5G8jqBU/kxKKBHRUe31de/Kdlro2JvkjldAIxERmi67fbYdSTRU8nBvWa8VubzKgxIYset7JZVnsuAIjtWMS+Go9mUb434Ohady6xlhoNGR7F2FwPkFyotDy0b9xO6stYKnzlpwUBNEpEJGg4FMCGtbRYVHaezDBSC50HMagf+X5W7lljPwvH7LfiiJ8klxsnqPvMXnUJeu3aXiHbupANQF1LxsV8BZcz5ufcrQW9EmxupHfm0Wwkvesu84srecRqyZsJx1oH/aFtqoRw1UY1D62+j/1Un02HkhcAOYDDiQooCinN4qRXFXaJqTUMSwijvnreKhibF7ed7P7a5l6kmIxODFXElILea6XasusPKQw10AY9JzPAnchHY2av96IuYsdQ2zJ/t8K96l2JT0SN/4cW5NbNqJ9pQ3j5LBU3FePcSCRw8c3bA0aObdSydznpU8P9U3OELXLmEA5AoDY//LbbjpWTSqq/0pj4E4f2IonhFd4KJnfFyH40PZnXTK24w6/ZPed/btyK00TGZDz8cUeGZzgZbzSojbqgjfT02GcuGW93otUp/tU5hIhCf0TNmiLQQr7eZA+JibI6F7oy1bXkmlgBzxQwhIBptPzwoZAlD8JgzozdLOvoXnU1ZpzioidCWPvtHa49O8Rw0raB8GbNTU6ENZt8SIY0D7GuzM00CGduIzqzMpj1THoLdJ5ct7bvxFuOhdb52uGDAG539n8fFUXRsTsXbQjFdd9oClAI+kgM8NUtqqYmzpxv8oOLAgtf8V6yozYjVAl6zz+Ko/YlzsYH85opFpTfh4JwugZcoljN8roIcG1goPEzbXjWwD4SQfTp7upd2WYYRl9/bhzFJANuLJaIBli2UtQjBBHtpZG2WBbwzZ0/sQcK3z4khnnro2auYQ0ZZvlfKPq+Kf4LC5tOy1V4NkeI+qUb4avzUnoa3jZR6zEn2EdMW0Tbm2wrwgc+DqxlrW/tEVPJlMOX+74c3HhHjl1lhq0DkMQs8ukc7xW5ZnjAWfcF3Ywn1CEgv/zT8+hBgTKUe0LR79klbSNLqUBOjgwOAz+GyqWjPP1gIt+XrpIvbswXlNeXO798ImRRZV2Wh6tCuZ/1EH9wNk7BHre4mv7sI4abe2ZprVCPqOJl4t9EIbk2HIJeyMnsISEsKTKtC9GhU9RFYxeIkSlzpLuQj7meWbMFS/I0kBax/vfqK5dyMfjAtFyUMsrB4rPsTIA/mYBKz1UY9L/EjNbpKgO6rJuuSHhNMO6RXeW0CpSkVGGsGCJz90BkQmW7mJCPqwhntSJ5up3vJXnHfVQ++7kCqjPjQNjTNhxzg659WxwRKE912Qabqi/g3pEiPxJVc5+5RAKrVHBCg3Bh4Uyim3gXY7xUQc1UkKke4RttnV+5vW7rWTbDTYx47cIt5lafrye3XRk9+nbz83sdurrGP0HeKLgCyE7kxrD9gZCCM9dJ2Q2+KPbnZ8JHPgMTCihR8jW90bPudmVMeUn7ca8IesTm6u1iT6Oyr4FAUDOszSlY3gEcAcHkafZIpULIo4GfpNJPDXdgJ+TkP3tKEBziZihrbgLVMBQyV1hLiMmUNxqcOVfST37cuHsWx+yU3bM0bcXndMmFzgH3NSLTAuGg62O7Dw3NiuXak/fEHlie8num14YFHmxIuYbLuEhQ9vDIlqEBLvDVyuVGkTdqp1thJtHplPz4NOikvgPB6pi1FTEUYVAErNGu+scK7xX5ig6ZJ/jieKSXKyrbHBP/StPUEoCIR61VbKDuJQRbzJx94wXmMhxicGXTLdUooVkbnnQ6Z1uwFOAXTImfq5M0QNBgfJJQ07fUnJoPAxX9VjlFjZGXj2E3/QKAFhrR3pjlEJl9dXcr9YofZ9/UNleDOoDP0VMNDxqGdKw30KxhjGvtHnudnfDW9smBq3OxmPW75/lyHx0NQNbPahA5kTCE8GseJyUEgsVK9VGfj7CwQS5O2YPpzltvcmoZSRU6LVb6GFaVP4Ef42i3lWHtX+MRCTQl+cxPf51baW5Atrj5wxcQIYJndqi0gco+DCraKXtfkfTM1/uRjwh9MGxlL4DGOOI8OHVXXdLpsK25AUh4j2rANlTPVYeB4p4FRzjpL92KTK+ZEJKN+FD7P6uZCVdK78vblHg5F+0GlcvLsHP4plzAHPYwhFQpdmgPh6bWssPh9y6rEcbRSIVbEuJPuba+1z1OW8D298glacUva5wZrbLhQFILxfO+ISXbYLpPkP1D2KMlrBTDvROHK0YwAV9eRWO4kuNzjOFqqqajD1BGargv99pdmppW20EEt3d1NBShEH4vTir4qTldjMC2xKLvBu1xKoxJ0KXWlwhyLQ00jLzqobJysEJSOxbBCIf+itGfK00Z44rbl0xEelCxV4c+PG8HHu4lya+ho2lJSMbWg4cTvau0Z4scmdv7ZkIJmAK97mbVEzHdNKcUwiJesm9pw9j1irIbEBgvdmfEqka6B1jtits9ayxzzuRsIvwsfl2D/rfeyA/cnR0khT30qGrpVzk9Iblx5WhsHXjSLeQgA5+XOHEOTW8+Q8yJDucHnvGVW7eVY/10d/yKNd2OuQOnNTZFmup4UhF+99Pml0QIIGAq5Mv7wiMGqPx8UIIQ1/7M7LwZHF5fkaym6+cN1HBiwei4zeOSSPqCpMg5mws6h8mstBdNL/3MrOJoPnskrumdjV4hInjsftw6smUFyAvd85zQNjPvFucNHl66y67h1ormtVwjOkbye1Ii3uW5oSzUQwNYF4JP82AqH0D4kLV0M3QM55So68bwz6emdlxQtiA8gDj7xMx5f6bu5wpXCaC+uUdhjYDktC0BpUEXsgYLa0E0Td7dRG5IV+rVir0kByWKn3bMLcOhQKNYMK19lP3tKL+MXrXspoCGCEymqihmLi/oI8NFWwRMlshC3xGGLwJn+lZaxLCD2FNwbbSknrIL4j81iozLeio8U8BTgBKsmdiSOkS9Gn/+JUBJhxfRdih/JiJaRgiTGf5iB9pz4Gcl1hS7YlaE3ufAT1oTbt4yRKeOwv7dGu9kWC6nxYFpjlRKl1t3Zrxylr8yKG0JnIf9l3FoUhjpEcHvWqAwdvYIDZx1k1X14OPEy0S0Iz3MoW5gWBaF/CdeCIFB9kwkGAzWa5hWZ4c40UXgJSfqMHK8I9ScMdsgxIWbT1nyU4zxxqtilpQMmakXv3p1sGLyyV6dBwPyfWVJhPfZ+lMJ/A60jhOpJc5iXuQc8NPV9Bx8ftnlSsQSbpfrddodsKKmZs9o6d0KxR8RxR+RNPhNtu1Ozg6DnD1ZZevAIPRhBLE3IuRHddRzcMUEZYij8DvJhaTPWfThs7mVWWw0qrDuG3h9d4wpSzV9QJq+Bb4DWfoNb9RFdpeBHNYRrLxXKpEC80Ym0376vaZDANgz/qEV31HsqYYMwQPPqTNnZDh6kwGVyKfWxm7xIC8kf6yDgNoP8EqvmnKUzUqPKz0F2IXlvLhxl5hf7hX44UPLDayPiGVS+mGS+1JxqjkW9ckhqbrwZXhCM7/llMQTNe4aUYo1SvPK1LCKRBjLr79SVGkNcUSBmTeQ4WCyN0QZTdMzuHlTsptZexI2PsDXirYJpWKEWCl0KkG64vTPepGRL5Q7dnwaE+vZwNdtaakrn80Bi9Wgs0UzB+OateQqyeo3Zi2U9E67BgLZDvWZGEJD2lTXk2Xv6gnHzyWkPp7+9J71r45hItkLzchOMTI8z0uXoHkY5eS86CQErThxrMuz+R8WW1rXQul6y5U/SIVT0bES/bcxuLdyjRo5Ok5o0ElrqwufwRD5G+OgulPTND23Lf7fJ+h4nKVQAcFzGMIbNqGDaLXy0taiQxEKSBOQ4AR01mZ82oYn4wvgvCilKldy59D7tD1gLAHfHBzkljXgwQ7VOZm7K8zfdhp6KcSh9b0AjkMEn/0RmrLAVMo7bfkdIzwa6IT0SUbwV6CockMkOAXQZw/6XH6sSCupJJZKCfbr2XJYK5j3fGJYsxKR+2YhUQ1RqKmwb1FqN4l+Jr/GMfBrMq5Oi6LGrwsPSilcdh/tkkFrEmuJt7WrYcmHg/Xv9ko7ol4lHGk/xWp+kWJPRxSOfR+4d9+aIiyrhJ5mId/E79ca/VRHJ1vZY4vdjqfnNj1XBHvC2mYaYmn/is/KjrMgH1x1pEy/OEQB98LqqFF7LHwdsWKZ5+WnPBQ3eYzTWQTNOIRKRYYqb5wcaTwBWI6SfKRyuKdDJXeSaIKdZ4Uz6e8e61ROX6bLifrddDGIbGRtaEgCx++NU6Uz9oLYjsjlLNObjb4HrwfzWGCttcC+4lnbov7vYRuLzIM2cLoXdiBVQr1724/4QhDJGoyBX7XNGNzeIfnDeHyZZ0DlHRSiRWXVCTBUVue2j4WU4sjh2EstPFI0HZhs6bV0pRMJXQ64ngN3lOPdsnCUjMnf8vlQOzHJ2b5gcj6iEDHr4nFMDEGMYHN7A/oUJO3HofkcrbcFiC/z6DN8WE0R3EAUeg5lhVoypVWygtps5gBblDPRKBrIeAX1IS9sP7XAwLpcX57u9af3oBvGurRu81D86tbQDNWOA+NK/vVDuCuhwXOvZwkUSRiLqdJYtdoQLPICpyAk6UPn2pHiFKl4rmQtCGAtFGpw38qE/xKbN3s4IxabUWraLOQMREiHoYfLx80euBHqP+JUE5Glg78y+s+m5ywwbq9HD+08nsOc2uOKA3mNz6fz+4HLsioXG9Ogc31qzTSj6xKDAKP6H8/fJ+Bgf9VK+8ZAKzJawuxSJhGDD9EtCvSEpqUZtAdtTPbyLAHHv5SxLp1CzJ8K5p19VoVbw2wotOXUBH2aQ5eXrJzr4dPDIbqRbgvx/uL2yodBhDZgmcuySa9McXaLjs3r+9UkLk4iWqKWRjCACxQYsGbpfDpLraYkD14kX3fDWgnLTfif67Ns0p7RFyg7iUq9dPs3XsWXxLEguZgifldCSgvU7OZOdWGtKEx20bOTS5UUf8N449KBAIspU6TwZz0uDLCxbZfuM/FopWLBN0PfWgNyCKCImzvOb0tWTA37iSY7HWC8Hlr/Aru4ckdyY9o3AUY8E2O99719yr1Xq/N1SVM7HzCEutlwtNWlDpabe0dQZs27ZTWuBuT0Xj5YipaZj837VrBSiuN3rzKw2MFvTRZh1HCW0kcouUssQyCsa/LywzkJTc+rOaqPJygkRA1u7xfbEGSbh9vcMhWqPPxMBW4N58IiYJZL6KncDHh2ydAtlGSOty9PwMMb1+E4QoP3GnovN1fvl1gGBqt/jz/eR/B4XZowyoY6VjUb/diAesuTq89YzQS3E6D8N0DDId9fP7jw5GrxL1BTCrzHsJkVmXRZ898oPJUMTwSCqMLcTiJ5I/Z21OgtB7lm1Y3zpsVerTcUpnviKd9cKE+GQdWXne79ZPe0oCZ5RwCIBeZcUIgWlD/8NXyMrvMHB5AdVuzqeB9EpK7hhHXRvCnZI11zI0QYxmkT2x4NOn9QOuwgC/uAOagVTvcYtjZ39GGJadp0EjAJUl99XL/QU3aik7lJzQ9xne9U3liSGVfFU598jWoGtQiIz4lr4qzggmJAOUL+3crsUqCDkA9d/QJ4ldmxhtqazMl/KT4evMDw9N5ieOJirQcRtUu7Z6IM9X747U4vF50KizY9k57yxR72hWemwh+kAyPURZGuAnbV/zjfeGH4Hlp92c3ITByQJNHtuK5nqluZ/FeGuTcjC3jDlbNH70106W3olbQa0lKEU5yqwykzEBZh2Iqw1yQu6pbArpsjjGnJyqEZszptw2fdyP8jZOpGnBs4reZQm3m7ioEC2+7doDm9avpkgsxo7c0pCeFdp6aP2faNu43KFYTI4OPEH7ANod55/o+COKH6R4QpvRy67+O5yqstPn4dpPnyQf8YXM44170rrzWD8sIlFBAOmu1mKWyHVLyqI7ZuLfcL50ZpbB+XqTlis06REHAn4dSNFRycxYfYLqVGbeLZbSdmGry8rrR4ifxpSlNWBmLnbzLpFEKHqY9fcZIzqhrHveY5f/9HFKBpBLNeeW+LjvXSQ0AzGN0QxGV/39YLEmTzkpcuRaIwBwQ06MTp37kXegfOgj5ZqpJu1D5q7m3nWE8LtgXRL13g5vQTXKdVfitwwiwIjDf4Ss8Jyb4nVjQOQRKp/sWARrcysx1aTJ+Vi+h2oxzJPARlRGA4Apwj73C7VKcsXUCX6T7P9wrVHQP8AWZdSWICeivGeSm16LXH4AhesEaa15SQbyB4MkxTvVXBpEBwo/a2AuM4HK4jnO5CiUjbDKl9Zi/oxATzEI0/b1ZELcuhVVLphnAHAPSk7StePUNbGSfA5OF/3Qhx2XuZLsrrMc6IS3Fd+NRaqieRFk8av0aHn+a7KYz0CEj9A8wSPysxl36d/k/vtoMb3FW/LSLTpo1cRIrMdH1svkOSVSHuCv2bqHMMxjUYqdpHTfUjf2zPQuOcPYcX1Lcqd0Z9N9W/9xGOmI6YbW5gVacUce/vXjGIRuGhcs91S5UO9OW3KivAJv1tPlbTTpzbBH5SHXsOvIbmLqGzLmhabq2z1pWG56Y4PdZyh+ydlqJHBxC9D0YlXnRZateX89gg4RL8f2HlxQJ5z0tE0YvT0xNa5F9YwI1K/RbGyqeooHUm1ED36uh6LbK3rrUWdZk5zZXPlopgi9PCJqVDDlHWCDKoE7Semsp+EhX887m2tgE6Qd3JaicrFd5baKDAoea1LHN61FnLtKymYmxvNRxGflD2GaKsp/Bc+Q45aspkszQc/d71aDZFWYe8yRX8hSx+vvV4tqMvSwhcDCCfleuXYayq2u1JWKXZ/gEauhy102fL1ufil5AhHSILk6qMsgcRWlNz1sPBr4JM6dpwmK9+8rHS+TTyWhjMbj9DSxTGjetQjB8W2U9l3Jk0NXUihFJI1OrH8INx7DQwIaCO8aezrkWCHfmKT5iZHAIrcqx0dTPjNrnzhp1WvQZOgR0z/B2CaIDXQb5dD8+AIFME+jg6UADP+8dbhRt87/tBqWkNuPmzO32bTc5PI+tfItp18z85z2uGb4TZ8+pRgprcsFBPXQs0IAXq4aXvj5CRPMxK2Oa+KFu5gHLP2wTKdhOMsSSEtyGisZ3hHEgpWmLhDdi8Y86knpMgxef6PI+HVdp2DccCIWewKodSS4HlQQa0Pat9YH+DOjD/VbT3McdabM/1+N8+GDCohDJiFSNeBGiPI6s0GJCTirrNeZ7caifKc8ClXiHmwfisA1K/FPYjamSFaVW4PRLKOnnhodIFGbfBXlcDMDs8yGOA5y6jprRQ+WGRaiAXDbnjN5zNeP0qmCtlsN2RtGMazJGSOZ3hcpT1YOdKFsEU3qtyZZlwJzJBk+1W4uZnix8qjUlad6FjlAQFuQarrZbxlnV8Mw4QQmTH0TDWrTyFdRb1ZR/tAcgPvismbIadCUHfDvwtOktO5VDnl1KLlNDYnn8GekXupksHODGQJRTBc2NvO7ZSsHX2+80XaTYygcHN7SI+ZcP56iYAo05NOtV7nLINuRvXyzhoQkcKoIeR6wjE6oLe8MS+REpA2mSrFUPzB/cNn9xltxA6CH76eow1zLD6B5bQso7fFJcoVaeE6f3Btz6ZTHgYC+TFbezTafuPDCrY1fQWkkbozDu4k3whZwVV8cXN60cSSNx1RCUYUgrvwdZqMftlsguiJkyDJbAx2roZ163cdFlYD4a4MsbAisDpLMjxF61Sz6VGM11SxeM2HxUhwcOV+Yj5Q2hhk7s/3RqfeFVUSwrEmtpbfkT1mvqtlvNlHmABt3cRaATmOMHQJ8PvUXHif42LYrDX6e4/Vwwu00DSU7f45IkJJZQRnnkymfCScM6tbFIXw/opBHMpmtnpemmgvGR7RVilIHTwC6IscplPG8R24FmY47LuKy9ZJlGG1eKDT0NJN517HUcpLqV4W83jKts7EI1s9GQa+gWTfSZGw2uJoVpBbtyAsbWKsShPTAmAQGLoCMH/e5aqO1zY3muvrHKlDPGGSfdVowyivrxZxntqPnvknYA1AUqQ0cME8KYflW4FRd49/xESetX4R9Fnnmwu58Hk9Xh7JQiiSaCv+onubSi6FdKFm7io49dz4F2qrnWxMTeJFMWNZ9Aby8qkey07ctI+X/EucLweE6v3q3EnUQaW9B6e5gOuFRfEaMduYEWpSZ6n5Xq5zFkTF+lvV9qOq91bwpEEm/TDRR09VY3k3ofTUbyzEtEQ+as5iJM1um3HfBMrdgFZmqzltuVlt/LElmwOqvPu6Q9vpJBesQkzH02yHFT5S5Wpd8uv0KpaNCIl4Zv3SBHLCJ3GIrpjV33YxPRpqqM7GgQWX5qNkDBZ0C6FEjOG3kGGtiXM4Ag9HrLpjfLUjGM3S/Kczh1Q8fihYYJ3sDxnIAWc3IOSED2UaowaDd4hYbSIWe5LWs0ufChrBy9IAlSXC+8jRDYx/B/yem7kwCVFFSyEs6fswOhYoUeT8Ieyq94OiU4S1VbIukA99Jie0zJ8fYKIqCpHqBtXduKJuyTIRQjVk+Y/NTEMYPuDyRopI4uFZai+Aeg2D6ggfnBWzifs/mFOJThL/GPQotb+BjleloAArW4bh88hNtYNxGzFWnTqOsFG14HYt7zS5/ByMjJj4wanC2Td8ek17h9ZfjaeFVYTcN+f9d4wLyimih1Di/DE2h0pd8i2uSPrb/fyYJjimh/Qe20+EFAsV6arAmzqh2ARdBnDyTZhLyWztv65pTpafyepvFNy1kQykFbIvLD0N6vRyJ3gpGnlOt3ivlSCCX6RY860qM3xXMgOURI9iG7YVVO+Aekmh1UBYB6wMD96MvreX5aYIkdda1YuxrsDau/qv9/aM1w2ifce0/0GPnMVoflUeku7pbGDazfg3exKTULL83MRYDDTm/aqJTa3kJQJa4B4157JvxgdRO/2P9dRvJKkuFMoPJUri2FLFB6qh1o8zZ66Y1VCH3R+LKAAPo7IiccUVbhHmoU7eL+2e/5t0Eqj5XQtXoSKDsVHVs3U4bRPUVM47Ta2bQSOX0lIAr/U+l4awFwr9p3I6XgrKW+WtE/F4pXSoYPkClJPcVfr1trPwiX06i2AygV0D0JVPvEIExl2gG+PFBxDWI236Kr+0zaEIg2TYJ9luKFN/vAHkpLb230ZpEX2ZwiaHH75w+PGhP9vJrSLFd5oz7YboesCX31PN5PWDyKzKvyYZouxbItiKNa8D++hG9VqLXeXf7uwSrXt9BnVNXGSQWW94liv5AYCFXyIsESMyB2ja+mKZudvCvhBS98meeD4x5v2hQfgnQH9jIQqsvFF4IFu+aPtQCjWypJlh0kc1rvxaZMEDE34kDrgvbCzmmJEZwrmCZj+eXXsgcKoERCjaD+rNcfZkoCxUHYa2abct5PJ+0EKQUaHQA6BFylrNv6PnAqWCBalR2TmGbr6p2l+nGGT+gK07sWu2HKV01SaHiM898D9ZUeov9t1TjxxHhcqzNl1fD6zOPi5oGkyauHADkjRd67IShA4gwuRCPt3z6NNpDkhdlD+vqMOTZNh3+ZdxD60g0vJo8Lw8FEbIAw5l1tdsAWRxgxfEit1IZ+NwZ7HRS/g6alD9l5WsDTbL1d4MLIMU40hvLkQyaIu3qd6TFr8Lhl4DMWaGEgTvlGt0G/cf6EQAQtRH1y8xGiu5xcrKKQIUZIBsDnOMYbs+r8iGRVmP4IqIpX6fqEU3KziYyGSKuCcCPWwR4EYbBU2AvS96mWTVreq3f4nHr3Sre974O5bZUg3SDB9crIfHZUnoIlM1zi7L05N6R/BK0akXPU0xyl4cwSlAg2titTeMsIslBlMnrToKsnMp3MeWyY6l2vXW9XXnKkv5zuQSHQr9e5XjsIZgekrDT/Rz5itQnxqBuMfBTGEV3fXCTHuQzqpJ+HPlYHL+E30+0PTpnd+BlYRCGbOvEz+Z2WFEe6YIdN7zcuXNPBzX/lpsQcXkj3Y13ambGbS0iZT6WhhtYnA5SFNIy2O+aPV3pQ8XnCrefzr8tomW8IcyjVzdX7S0FnsbWSkPquVx9T/vDdzKw1vUo09z8zMfvxcJPVnh1IyITqedYy9B6VbU16C0c4laEiLqBaKw+ewxprMyLZ4ijcA/OPc+4hrXsIR2GuQNYaAbuizme0LWKZG3mhNljfuZ/Xrg+t5X1wgWAf7T4yIQqgOulGRYBPnJr7upUkHM163qWS6F2dBdfQbh6vKsazEZhL+Qecum86guXMccJ3V3ldn576LrX5cqIg50jZv6z9Q454giCuEnNK6JQ8p+sTaSpk+JhYC8pfk639hJklMPceDjquo8jYLQI+3lmA1zOyymBZdMnBRD83zoT48izl/Wrt3p9tjRkYP6IycnUxV5COHp1DkAxgGL9u52Er0j1hcTAlF6yWy6NK1QhKKoe15ZN2g2OETfDIfdOjvuPkScDUIbT6aZCoDcCHgUuhXAhKn1DyuT0BjXimCoQnKDa+jGuHNFfVbgt/XJGiRFIUWQMbBrbGKCJniAd73B3M2zY3x+ea3FXwjFoRSgm3I8LUlY93V35XKCIrdWOZYJYBpMHn1FINLkkn3FVS3lPV3BUi6wmeKEA4ibydOvgVoHhfgsaVajuvO4f09ariDcT5OTKusaaeEVqXDnb4TiAVk6OVZGsFI/StXyw8JeIAi55Y270fv4wkZh7990sWxuFMPLBkRmfyAM7MfRajbwonCDnlWP/gZtrZhuaRjSZ7NjuVzcQ00vapcmYUoemilUkXGPAXEIcPKUy9M7JnXrkwvmIMNqEDE9N/znCd7t/da8VR3BinSv5Vovyfuqx3vDtBxzLU3Q0hVfJMzLLdSvnvVuySsTnwSRWREbjOsMcS4yWx73ZhSNTwVl/CetEiF+XFzxzEiHTsDRlQbpaCV2Dk0OOyMb8Uj0AUqYLDN4K6U/I8zPSlAEnzqo5/l2PorwrZwtBg4rGGVWDE1BpJ4u94XBG7Cd4ocX9Ld00I1Mwi03K9zNJwduH+29ibcywr+n18/apH4cHljgiJM4i3imW7GZwaknfTN6P4ejMYIbGYzljYw+yuV9QHryIJ8IIY6HZ8kHpDB9/IR2H0BwTEaZ7Pv4OyRAqmQPq9xDp3lStFfgQgWh8usWM4/YdvAEYEzjKEVRkOMktbT6OuYcVItO4Qb2W9Bnvl9w/MD/5ESxZzoMPPPXqAiU/wd1KnUQQ4qgG2o22MrxFoM4gWtVT3bAq+E+ZbUlKD6cAu9UFK/eaC85e9v6tekvBxJXwwupIHKYhzxVQFAUurSXsjDTZiJ9515C1Dy9kR5XBHRF37d8ecj7JpA+yjK8BGKIlTsDXQw2f1F9I5+m1u/VYWMbnTbA1Knp6k/2EsWwge88CCxrtpLai9tLEZZWAd90uZf4LoLrWx7l9bLKdxpVK5eP3gDz/M8a6/l5tIxOYO73WcYT1f6lQa2HGKNKXo6WmAqH/31smqFlt1NxyM7kx+zecAzZxs1o4L8s2oZrgtIVTN4fYyfvFi34GScHWZEJ10fkzoJOnGidgr9cIuW2eH0JYqNSqHrXqDFu30Q6k090XiksGUf1C9GRC5deof/z7H2YCYVDokAjloWTUlttdJ84GUQpMZ/rtf+0xxph4wvgHICYkMuLtypQ2ST1czBVcm2ghYBT088r6K3s58vpFp9eG34lWZD0BhKJGjcGuMqoiwQx0POPl/Tprv/kYFYCDT85I4g0pFBhpsigjzy1AW2d1tMTpIX6q0Ug95DTvhXD70R7pKbskBrVmiiToJJXovapyzHSM7yGqOKtX7V9s+i8dU1bW24u0EAGeblVP5QjaRc3Atmb/rsu93LqBBKq/lf9w0B8Se5xgfMiuix5WesdwLp2c/FWUK+WxPkcLRKGFcKtWkYfv2RSRkoPy1h6fa7AWe5mOyLKeNUEObEs0IJKnffzrE+jTicJ7jegZVy/UXwNiiiNZc8VKnOF6y6eJIf5LQK20jsIwyfJpmNq8BobAiDjDlBZSrS1+dfk1sNzbvMj7QKk1I8qqsBbPbFtsXiMTksA40UVl0g0ckTd3ZkNTncvIzxn6VTDO70u63LFT02pckhvT5y7kYV7YapmyjS1nXCJpPE+AgFDwrJ/ZKcLCfYQ3O7bf0JUUM4V3YO4MMseL8ZnRcvlgdmefbpkcouhnRN1yAIvEzIPil/lyPRxzvwaSiJ3jBSrhhPi1XRk/iCrSijqHljTTvLt+MomTSzUTfL9Zwa55D50oDTxZwda44XVAlryZxczfJrGBKAv3qorlg+6WOn78f8ZcFXIAIk3+WZEgxZdjdP9rXtbgPcZhpK8r3Ln1qj7xA3+CVt4RRy90jo+KN2hjEr9RscfCBU8cBN1Qao5ppN4A877O2Cd2t/7rWflK+U+iUN2ks2+HOkUEmxYBh3GMluKmhzJ9fcmZKex+5jHqONg4hyIrhXMzAherFZTNZhyPkgqDg3rJRwgXPj3qbQtwolDIlDlrA0q+xRSn6jA61VKvuD0UUd4q+emyIvvj2RA4lc6mFfeT3XdqGZFE9B2HAyhRkzQxREHoP3LvAGnxCPK3yF4fEEN2yFrgTRaiZ8RFZxqq2+wz4nS9n+OXGJjYCjM6cfU/jYTDF/ZpwVIAYDnOiMc0bC3IaGU3bBve63JGphCPU7MJJ91sdLPICFeoczvDNVrfqsx8wWYo4atsSdS9pBe9UH82Y0h2zAFr8jh0GZiBZuX05eVSHrz6R0LQNlO0bCxYjFFfbPB4asBObaXFmEJ8KBKlENZ0kA/TVc4tbgEWYzpeB2zbf+6Is+d7euYhZ/GOrxoOSEQlvJJh8VYVxo7tuYz8VUiefisdR1Oc5hPmnzqglHE2+1pNXcbPQvkBZ/sg2ruJfldKHIsV37o9a63Pxy5UvAy2nN4TyZeFHC2A26Uci7pfxmNd1d7B0CoyN0kDlT4OQLyZg5rDTADBjq8LxETtvp1M1nbZQwMsovVvjZh/hECkSZoCrQ09ClH1xZjK3mmcRMx7RecCYM4w5Y3VOm3WFAVAQW4JR2sJY9KuViaeI8/KuyLJ0yyrSI/GHaHUUOQtjZv4CznmqW5eTz334dVi4Dq6G3i5U4Q+Hr9vw5QK1/sbMEs3L9ljxRBrnNB0pBmmkSjUzolU8TWzK/InnbNvEBTFzMTcKqh7hr/Jkc75tghxMPIjtFvJAEgGEQfenIw10znHVNFVfk9/bTUODIMSUBIP9aa1PKDRPxAr9cBn5mIFqvnZMf9BdmihxeDtVa9kKWRaV3D5+FMuDdWKpLD/Qj8bYO+3aCX4jjIUHVYnGLJrOhuJETFc49c7IeqrlssHoQSGRRoisv742EFB8FPdkU5hVo/p7xM5QmiOkJfbu7dtNOSokslwC1x6bQBeuBU3JVCKBOdTV0u87/9PACnyUwthyuC1LibZnCgO9AayNTvDHRaC7dlZ95wF8TShB6w/GOy10fxewdqGBqpt3NIAue7tT5J20CjD++na3DAoQ9m6DYa/wYDBwx43w0dTsss/GlVXJpuh7Z3yj48sTEiZqqV0Yab7PxNhqEDtKBZIaTOzlNP+6YInmLK5GNtbo5LXOkUrI66ibs0m11Ruksj5MfQ8Ha94IvBcK5h8d/aHRHYZBhs7LLmqJGJQArd5u7ClhP9HwF85JU+Dw6kl/lyw/BaBzm4fWpepd7aKu1Otn7R2WvkHLObyEpQ52bu+8fQPRj+3AhC9f/OHoXhcWhXSDpJEnhKBOSCc6Neo9dZdNakC2tNUl9i9P6CQ97Hfu4G2FfcZChTEPk0yEbNBJx2XGXUlHThy019L+ap4RDfn9FfSXpwvaILmK0+svXHllvVGez676Mj0jkRCzHSQrKj/u9ddsBkfekUCwaNCsekdGImdkos0AEdma7SqULKKa/xqfA4e/TfW6qSGqi4y6O7gT1R9A8n9y9w4ASpSGuqwh8XvL6LZcZr2hJ0Bbozy/OGAkB93ncWUnXGL3jbaCBP/zGBl2ptsndOIGohu0dWezVMiULSg3WxItnUP0+N8KWB9z9AlGplTXOyhrLeWWsQqmcwGgo044vlFf3yMOoRPFoEN6+qn695kaj6CbKFalTvHfzQQ7HkzWlqENgPdukprJRufzM7IUKBSSgwKzG9YxKWeImleWp9youFwtrYNnC3RZDVTSRpWV71BuwKVZ3GwfcPyeQqvS5puZ+Y9HMVDp/oAfuoElkbbpYTH7O/qEEWoU7r0Pkd+X9z+M7olEaZG6U7QseZNS0SA8LQs7d/ReFxzVjWBliMm9Me+PSLL9ArcxTbVARdE+6b5znmfD6OYk9qac0kkEoUGrqxcL1NX7hNWsRF+SKJWBI3HS9oQyjbfCcUyh2M33IzLIkuIcXRnFahlnrAS7twYFcfw4z4gzwDTe12UZPjzaEHHNZ4rE7E2ddEe8/gKMw9TlvgrZNAPs5G8ZNatXV6YYo62IQdikmcxRO+Y443Vu00WaIaACg7j56sw8CPHK7dWtGVutXkrHL6KIZCsE86jgw+Z1x0Iz3KmRTdRMQmhJ91wYtX5quXhaxFhbX30k7r4i77DjRWnoMa5EGYPsZ2xaUUIJ0MJox6FsqvMJC92F8GHsTVq/a+Y/GiaQDmZfnagMRi+DogQqJONX+ubUhOycjliOjY1vQWocK9b4VbQIq2I2RUaGxJg//1UeWK0yeZEi/hNN3MQWvxuCXT5Bi9CNuuF/nCY0jntzBhvO5pUVOddVk2QdMGO6E5k+x16l+cWxVsR2YhdWVBdmY1ypjclSfuWADcPcZ5sqXmyNcGYi663UKzduQvjePyIAH7oNB/GQx2YEp6CGmyBN51rpb5Jnz1aCxr+MDSRMYjqSTeciGTw1K7+TbuceqzmSWu3RAO0f28/cggsEkNsqPcOuebOos5x15Eteny65pv6Ej+SfzyciRsbfeUQVzi+EkoMKZOOFOdq2DBibrTMdOvCJXM6bOtRj/j+pjOl5g4VTdxaHjSXpZG+W6cYXE2qvqeuxkr05StswfNHtxsPvKiF9n8im7lDAEGQXfOuH0U4/4Phm8RRGiEablN0FWLde48XSwG0gSnZGiYoxftSe7xurP9iwxBAf9yiBCvf+xJDHbReSIwC62nRCB19GGWixZskjG8gyz30VUBUuWwTtv3UapLk2vHqMwlXnFG00/ZPKKyDVSDIZDJDUq/mp8t2/+aO5cuAVJOU2Eph8EJC/fruxAr1SK4YW7bSJTiMdW1ZtbLeUCeA2XuME/TExFIvWPX7ZfMgh/0URPERiIil3y+8w2O5wmqbRvbGvZHVgpyEPx+Z5dp0m9eys1RAiBq3eaCAPHdJgtEdEQRd42MoUdArQdP3qUm+vacQxWIA2mDvLUHHO/l9Gz3oKuQmw5h6n8Yp3RfCTPetLJa+UvfBwDbB76V3nRmS6oZYfiPCfxIRMRN22fd5+iT1P6ywmHkY1jZuhSrkETBEjx4EB8lp91LjTAlKKq9BQcgWSrXx7i9b5wVperCvIHcP69tc5dmFGLIvvQvM8EgQ+dNyaA123WMftaqhvGxIhjmX/P5zlhlnZZEgTfC73qMf9oJtSnlA5Dkv2sZAB5Liv0i3Pfhak4HeAyDm2oR7Vb8HJ7uRPVp884GwBM+O6L276eaoUN3wwy1nV/1nEd7iNAm5LI+Icqssn9skqs0oX3aaJLp+3zlGNbYs5F9cwtncl0pTlA4o2s6VbUS1I6H5rycF1XACL6GrNJDaeLs2lg7IGPlTJUw/ibOv3BPsdzJPq2yeiSWzuJwnte3aq96Hk8annNF1Az6LV2wiAjxaf5UDzuDdAkWGhr1zKwPn1n6uQWy3qbmx0n1c9X5jJs5gzgDotCpksQYXJj8jfsrZXkSJ++k1vRDdocIufCQZcVn3EBL0Hds0+Oo/F5DXuIamnTRsqmG6xFGk7UYsG5wIL5N2DggJzuxqlpnJvHLQFp4tL1RAt8llktYrEtZZNB6RKshEf2MhBdxIu7IKAU0NyNumZV7lAVA2UfT/gOdXE1K9QN6MNCO7yKJbh/GQQoB/2AQv1dMbw6EqeCaH4h7b7NasOSMKNbgupL2jlG1g28BnHsKN8NqENSvd4VEIdHg9ICGKtYWgoMa0nbl0TzQUm01CoWj5DR/TqkCWZx4YqBwnitHtYCa7OL+1JHUWIv5AApiYTKxkQ4iVEodld8stSduIxA+Bgua6093xx1hH2mybzoWEUrQ0hYp4p8cLb9aCjx3frSLTm/GBWfp/q/zzfKPRuaT2Y1ue0pB/6S6E0GV9UTsT1UzxoQGlWJmZDh3O5Bvfp3uyTApeVR05MCzpOwR2C6V3kv/AnokDhxoUCtRWTvbxXbstLdkuGbejeUZZWIWQ1Vo61a5Lp9oLTh523JZI/fkI0CTnC/mhPmdSzsDM8UK7Yu/c2EwXlNxhUyridblO2xrmRjiOcmpDVri06azG/ereCr9QKA6r31H5UqJ24arxII79qn76MQVVtcmZgu/c8YoBD3Prvpj/YWpAJtkLqkNvb5u9gRCe4UQnUkfo3rrcPLxMggZiAxBANTdPDbC+uckLs6FxAXtfeBZ5yqYFHZfcwnXl2Ocxy1UVnxI+PqE4OXbYpyrJnXB4DfV69ydT7ZDSnqZ/yFUCbEZCZRcDoJQSSPgRuieh/xVOdwPdkEEn3I9aO3WlTK5zqmiS3vexZbDCg/qbI3wz1Zv3jT/SAmIRjb8m1MEkMGllEZLdL5wk8VarDURtd6JedL20AOpAFkg4+clP24dHSTQx7v3svfaTgBmMtQvc9IG/Yz7afUHXMtMWcxuFR/x5+F0l01Y4vXybRa8UVIOYJ/MU0ww8xu5YuWKLZKA3opz3HXlHfHUKSyXhFHXdtj7KJQni/zok2RKD342uXWiFyvktwtT3EBtPf0zIhtM4wJ5KsoO0rICukGkkKWsOWQSXAP4KH4v006CYEs5UXzcTDGPCHGIq6ieqO5ePWzGsyN4aM0v1vMrNYPa5qD8xY+xbG2490bolEnKXF7TZjCLNAY2GGXggvzwMVeTPstyqeE4oqOuQj31/LKZa5DcaDMginGiqetNC/u+R2YulyyVp+1YUD6muWmq1UHX9w/a/ccZx4POyXyWKOAo3kKmE4Gf/B7uN1Cno8ZdiBVuxLKQIdVvwGe5gNySmTg72qxeqIFEx7hztqCCWEgP7137bRf3KhKP8AGIP4dODaSZW2TMLbWGIFQCYMWbFVnXT+YE7umM6iafHrNZUvKXR7WOoTzvSTZVFOfCMXH2XyuLjZKbwQgsMy/gy1+19CkqWBeIcOb8VvyGDmOk0yK+GE3SEa6Ci/o7q6CCWxbm/5cMDYzyWx0R7IFh971Yv4iBaW5OZiHbBrlHamFtWtK6gkBekrfNJ4FHBdmdVJegyw4nOhFfNdVhmA4O6nmZX14IQkIyfSIND6GWdeAtzId0DQA7FTUUKLfjL3LhMdbt14+/ws28SLSFG5iX2fXlJFD6kD8+6f613PGeog4GRsmm7ewmvUhvvnAhkI81qmfb2PrDlbhGoOE9bFZ3HzI9PDTbqogrODQve/BC4a95/1z/gi7wzBB4xu3KhCiSE5oDSSp7ViZcSK+QOJkk7qAi/YeMt1l9utru2UIeaNBWvIvyjwNFNgRibYF0rlsaUfS2MYCogMwGeRleY5zzVBJF+qs2/1Lwxed1JQyu2N/aOxCY0gV45zW9gf8IUHQuXTY9mqDUh6qMaJBnO3KveZsdDS2EOe00/oRHAcEwdvrqHqiWXFJxQ3IHmz0GHKJI2rFrDTn8newI4IEmEfUSSuxkvjCLS9y14W5Iu0SqLK2ndHGkiRVCBAyBz2n+Nu+JpU4dFdo7FBrQiUEEciKj6lT/rgrM0wshp/GQhaIPMOfJgZPZQt6lSyoiy5HPCboAXabRlmwGft804Ri34TL1Az9mO3ovzaudjh3hfARsBdYoBN3oWP8RN4fUFeKtx/tDJupj5X5RHl5alfiTLL6VeQwHpUX52L0mH2UptqlRRsl98y5iQuJjluJTgXyoDrFDH+QMdTEdJJRqzFTjla1J0I9fmAqv+mP0F+R2huZsPA6xSkTVLRNmpKTjfVt2yNiKEnijtk69iOO1s7wvAuPS6FNs+JwwEQs+X2ev0ijEVwYZeM0dPt3i6y/TuMGShRLhV7oMeW0cIFNeiim3UnEGdBZkO6O11GtQixyy+v71V1Qdavok9IWnb5k62RW7pEXB0UufOdW5aWL0EJnbxtyFM2Q2Kyb7zQ4P2pYjY6iRiZrGPhIpdoBahiPpOXKSOctK9BBzm73mxE1ibjf0ErRA1TYkMT6JyhLs47IoDSCbiinUn8SgMItwVfW8Ha0OwBAbyq2J+NzJVoUvuWsP+EOGCskzqKo8K18xw9btQGTx+nhziNzef5ko1qjRgXxJAlWgEXQig+F/kjAV7Z1/ytaAj+9mM2cnq1ATV0tuGSPEmAT/+cUiJli0MUGIJAJ32zp6BavEo+UQak+IspmV+OLncbLN/MrBpxvX4u0XHzeY0e6D6TbGr7jM7GCCH13Fl0dCpQ00jgMbg5vv9i0zt1g4bJynf47m708xvlUzh5ixrjkS2PdsyPrCiY0sn73Vyi8wgrBl1F5jgE5X1s9sybQwpG8KaUGA4KBgHcPr704NmkXxmg9bF/oHSQLs/7u3TvOwZ/hNg4jqobSaFNQO1rY3gO1efuezmN/zVKo2WpCf/C4Ydxp7DdI33KGBRA0bpo+shngwBJOFDKYAfOvw+RwbmjRhc/cEz7CpepoKx93Dq59GzVRsPFr/TB/2g7vtFaB2y47m0F0fj1YWtBq0Toss2bR7X6iUQRA/nho3CGl+AFuP30dmmsMzjvw8eYNmkOX+TgTCjKoe2nacMyjyOCaSaCzH/T8PbdyHC1GiEWAECfuA7BaXbUeAqQw9Yp+fQNKT8OkXxPfjZvSlXnyYrYRUwXJbtqJ5tt03K5N/V/xHF/7lXFPS1XC8+enXSSs5u+YPhl819+uA4ee8JirXj4XcER0iF+R/Q/s+QjBr2SXPQjt651rvB74ln6SMzpO+1ZRmAMgJBi5bkhd5vnMg9iFhfYsOhnasqf8TH+81iNzMCKLYps7Mj0c60ir34FgyaXg5WbJmBkOgnHB4gQuASGVqnpDp9qsxsAiJOz697iujlF/b1fKMLqfKUwJv7vZ7CZWtIPfh/AtWK/LwNAqox+IuWljL4uI9Pn8WQO6JCJJPr5iXO+S3vV+NS8bJ8mXUcytecpq1SaOhKAM5d3s+xI7KpOqF3Y4BkwedvTUxaqBqjIwRPAT7S4xsXtutp0UD4gZ0j/0j6TdqzYlLEVxYWvX6Y+TpFPEfFQKA03bvIbMS0JyE8sOH7hfmyyFkNCmRyEvR6luuxsQFRUze8nK/K28d4hqlLLimOacR0Ys8iefwFyiXFOWZvV5SzyP136tu1xj9zHtoAPzxA22lXhbzE5QGImL+DhXNkW90qi36W1V8FSQ1BvE5p9NeTgTCQaWKTWh3/h6GRaO2JGpNRn+edeq0whWSnQdFLo5gtIeT1GvbBHsUarKAIhNP5nOGVlJJZPZf49WBaukplSJ1YsbUqz7SNg6TnjDIjIRaWl3a6/Tlr7ZVLfkWjr7pfJxIkGc2EBoRiBgzbxSB4YknZopmIY84j3L3tNyYgoGELaVx+/8Lbd4CRovL8C7Y08x//HWpjR+5mJy47fg8h/KLeOMdtSxRIttTGHdOuijX92J9iMuPwzT0RGMBxqiNLV6YgTGxNBskBEKqgo6k+bO3iUKeBtKvOOirJCeBwL5btmRqO0lK2oRuNbZmM4hiTZudQr3916TTgLhQxqIb+1iZpoz83+0YQVGx+NVGz9szmJjR42tkw5kljObRP528uB3mWMmQet8reTH6z4xYG/mn9muuMNxgfLoAZ0GaODxvIde5RD4CjD3XeiWneyr9klDwjcuoFlUB4dnjoO9yAbGYYX4FhSffG+o4ufV+31ZUL7OSa7saLvGFxZniH1SflQgxkS1nW+hy0KGGBpaYpL96iPJoYyvJjcbn6QPnAZYl1UsdVXBf+8L9NHYr4sJhcNcXCtwv/NXqPGx5z5Ue7p4JkbT7eobIlCsssQeafwtukpsQF3HEuAWVuZRU3A5KjyAY7cn/L5GdgsMI0VHn86ofIpjuZY4HCq6zm6gOyi2yeiFhnWo3tFDyhCowuNRN+q+5YI2JIO19UnzIb5oA8GVotrYdAo7pcO6DBvSfSYtExiD4mxz9BQ3QzE5zgq9aA==";function j_(){const s=atob(K_),e=new Uint8Array(s.length);for(let t=0;t<s.length;t++)e[t]=s.charCodeAt(t);return e}const gi=64,Zi=128,xh=256,Os=Zi;function Ui(s){if(s==null)return Zi;const e=Math.floor(Number(s));return!Number.isFinite(e)||e<1?Zi:Math.min(xh,e)}const co=256,du=new WeakMap;function Y_(s,e){let t=du.get(s);return t||(t=new Set,du.set(s,t)),t.has(e)?!1:(t.add(e),!0)}function bh(s){return s?s.name?`"${s.name}"`:`(unnamed ${s.type||"Object3D"})`:"(null)"}function Nr(s,e=4){const t=s.slice(0,e).map(bh).join(", ");return s.length>e?`${t} and ${s.length-e} more`:t}class Z_{constructor(){this.staticBvh=null,this.staticBvhUniform=new hu,this.staticAttrTex=new No,this.dynamicBvh=null,this.dynamicBvhUniform=new hu,this.dynamicAttrTex=new No,this.dynamicMerged=null,this.dynamicPacked=null,this.dynamicPackedAttr=null,this.dynamic=[],this.hasDynamic=!1,this.hasDeforming=!1,this.hasSkinned=!1,this.warnings=[],this.staticSources=[],this.materialsTex=null,this.materials=[],this.volumeAlbedo=null,this.absorption=null,this.scattering=null,this.lightPosType=[],this.lightColorRadius=[],this.lightDirCone=[],this.lightCount=0,this.directionalCount=0,this.maxLights=Zi,this.lightRow=-1,this.lightsChanged=!0,this._seatGen=null,this._seatObj=null,this.lightGrid=null,this.staticMin=null,this.staticMax=null,this.ambientColor=new ue(0,0,0),this.hemiSky=new ue(0,0,0),this.hemiGround=new ue(0,0,0),this.hemiUp=new P(0,1,0),this.emissiveTriCount=0,this.emissivePower=0,this.triangleCount=0,this.emissiveTris=[],this._dynamicEmissive=[],this.hasDynamicEmissive=!1,this.lastEmissiveRefreshMs=0,this._m3=new De,this._normalFrame=0,this._dynBuildVolume=null,this._skinVec=new P,this._dirtySinceNormalUpload=!1,this.forceFullDynamicUpdate=!1,this.lastDynamicUpdate={dirtySegments:0,refitNodes:0,bakedTriangles:0,ms:0},this._dynBoundsArray=null,this._dynNodeCount=0,this._dynRefitSet=new Set}updateDynamic(){if(!this.hasDynamic||this.dynamic.length===0)return;const e=typeof performance<"u"?performance:Date,t=e.now(),i=this.dynamicMerged.getAttribute("position"),n=i.array,r=this.hasTextureTiles?8:4,a=this.dynamicPacked,o=this.forceFullDynamicUpdate,l=[];let c=0,u=!1;for(const S of this.dynamic)S.mesh.updateWorldMatrix(!0,!1),(o||this._segmentDirty(S))&&(l.push(S),c+=S.count/3,this._bakeSegment(S,n,a,r),S.emissive&&(u=!0));l.length>0&&(i.needsUpdate=!0,this._dirtySinceNormalUpload=!0);let h=1/0,d=1/0,f=1/0,v=-1/0,_=-1/0,m=-1/0;for(const S of this.dynamic){const b=S.aabb;b[0]<h&&(h=b[0]),b[1]<d&&(d=b[1]),b[2]<f&&(f=b[2]),b[3]>v&&(v=b[3]),b[4]>_&&(_=b[4]),b[5]>m&&(m=b[5])}const p=Math.max(v-h,1e-6)*Math.max(_-d,1e-6)*Math.max(m-f,1e-6);this._dynBuildVolume==null&&(this._dynBuildVolume=p);let y=0;if(p>this._dynBuildVolume*3||p<this._dynBuildVolume/3)this.dynamicBvh=new ha(this.dynamicMerged,{strategy:la}),this.dynamicBvh.refit(),this._rebuildDynamicNodeMaps(),this._dynBuildVolume=p;else if(o)this.dynamicBvh.refit(),this.dynamicBvhUniform.updateFrom(this.dynamicBvh);else if(l.length>0)if(l.length===this.dynamic.length)this.dynamicBvh.refit(),this._repackAllDynamicBounds(),this._updateDynamicPositions(l,n),y=this._dynNodeCount;else{const S=this._dynRefitSet;S.clear();for(const b of l){const T=b.refitNodes;for(let C=0;C<T.length;C++)S.add(T[C])}S.size>0&&(this.dynamicBvh.refit(S),this._repackDynamicBounds(S),this._updateDynamicPositions(l,n),y=S.size)}const g=this._normalFrame++;(this.hasDeforming||this.hasSkinned||this._dirtySinceNormalUpload&&g%8===0)&&(this.dynamicAttrTex.updateFrom(this.dynamicPackedAttr),this._dirtySinceNormalUpload=!1),this.hasDynamicEmissive&&u&&this._refreshDynamicEmissive(),this.lastDynamicUpdate={dirtySegments:l.length,refitNodes:y,bakedTriangles:c,ms:e.now()-t}}_segmentDirty(e){if(e.deforming||e.skinned)return!0;const t=e.mesh.matrixWorld.elements,i=e.lastMatrix;if(i===null)return e.lastMatrix=new Float64Array(t),!0;for(let n=0;n<16;n++)if(i[n]!==t[n])return i.set(t),!0;return!1}_bakeSegment(e,t,i,n){const r=e.mesh.matrixWorld.elements,a=this._m3.getNormalMatrix(e.mesh.matrixWorld).elements,o=e.aabb||(e.aabb=new Float32Array(6));let l=1/0,c=1/0,u=1/0,h=-1/0,d=-1/0,f=-1/0,v=e.start*3,_=e.start*n;if(e.skinned){const m=e.mesh;m.skeleton&&m.skeleton.update();const p=e.skinnedLocal,y=this._skinVec,g=e.srcVertexCount;for(let b=0;b<g;b++)m.getVertexPosition(b,y),p[b*3]=y.x,p[b*3+1]=y.y,p[b*3+2]=y.z;const x=e.indexMap;for(let b=0;b<e.count;b++){const T=x?x[b]:b,C=p[T*3],w=p[T*3+1],M=p[T*3+2],D=r[0]*C+r[4]*w+r[8]*M+r[12],A=r[1]*C+r[5]*w+r[9]*M+r[13],N=r[2]*C+r[6]*w+r[10]*M+r[14];t[v]=D,t[v+1]=A,t[v+2]=N,D<l&&(l=D),D>h&&(h=D),A<c&&(c=A),A>d&&(d=A),N<u&&(u=N),N>f&&(f=N),v+=3}let S=e.start*n;for(let b=0;b<e.count;b+=3){const T=(e.start+b)*3,C=t[T],w=t[T+1],M=t[T+2],D=t[T+3]-C,A=t[T+4]-w,N=t[T+5]-M,I=t[T+6]-C,U=t[T+7]-w,B=t[T+8]-M;let K=A*B-N*U,k=N*I-D*B,X=D*U-A*I;const j=1/(Math.hypot(K,k,X)||1);K*=j,k*=j,X*=j,i[S+0]=K,i[S+1]=k,i[S+2]=X,i[S+n]=K,i[S+n+1]=k,i[S+n+2]=X,i[S+2*n]=K,i[S+2*n+1]=k,i[S+2*n+2]=X,S+=3*n}}else if(e.deforming){const m=e.liveGeometry.getAttribute("position");if(m.count!==e.srcVertexCount)throw new Error(`three-realtime-rt: deforming mesh vertex count changed since compile (${e.srcVertexCount} -> ${m.count}); the merged BVH layout is fixed at compile time; call compileScene() again.`);const p=!m.isInterleavedBufferAttribute&&!m.normalized&&m.itemSize===3,y=p?m.array:null,g=e.liveGeometry.getAttribute("normal"),x=!!(g&&!g.isInterleavedBufferAttribute&&!g.normalized&&g.itemSize===3),S=x?g.array:null,b=e.indexMap,T=e.localNorm;for(let C=0;C<e.count;C++){const w=b?b[C]:C,M=p?y[w*3]:m.getX(w),D=p?y[w*3+1]:m.getY(w),A=p?y[w*3+2]:m.getZ(w),N=r[0]*M+r[4]*D+r[8]*A+r[12],I=r[1]*M+r[5]*D+r[9]*A+r[13],U=r[2]*M+r[6]*D+r[10]*A+r[14];t[v]=N,t[v+1]=I,t[v+2]=U,N<l&&(l=N),N>h&&(h=N),I<c&&(c=I),I>d&&(d=I),U<u&&(u=U),U>f&&(f=U);let B,K,k;g?(B=x?S[w*3]:g.getX(w),K=x?S[w*3+1]:g.getY(w),k=x?S[w*3+2]:g.getZ(w)):(B=T[C*3],K=T[C*3+1],k=T[C*3+2]);const X=a[0]*B+a[3]*K+a[6]*k,j=a[1]*B+a[4]*K+a[7]*k,Y=a[2]*B+a[5]*K+a[8]*k,te=1/(Math.hypot(X,j,Y)||1);i[_]=X*te,i[_+1]=j*te,i[_+2]=Y*te,v+=3,_+=n}}else{const m=e.localPos,p=e.localNorm;for(let y=0;y<e.count;y++){const g=m[y*3],x=m[y*3+1],S=m[y*3+2],b=r[0]*g+r[4]*x+r[8]*S+r[12],T=r[1]*g+r[5]*x+r[9]*S+r[13],C=r[2]*g+r[6]*x+r[10]*S+r[14];t[v]=b,t[v+1]=T,t[v+2]=C,b<l&&(l=b),b>h&&(h=b),T<c&&(c=T),T>d&&(d=T),C<u&&(u=C),C>f&&(f=C);const w=p[y*3],M=p[y*3+1],D=p[y*3+2],A=a[0]*w+a[3]*M+a[6]*D,N=a[1]*w+a[4]*M+a[7]*D,I=a[2]*w+a[5]*M+a[8]*D,U=1/(Math.hypot(A,N,I)||1);i[_]=A*U,i[_+1]=N*U,i[_+2]=I*U,v+=3,_+=n}}o[0]=l,o[1]=c,o[2]=u,o[3]=h,o[4]=d,o[5]=f}_repackDynamicBounds(e){const t=this._dynBoundsArray,i=new Float32Array(this.dynamicBvh._roots[0]);for(const n of e)t[n+0]=i[n+0],t[n+1]=i[n+1],t[n+2]=i[n+2],t[n+4]=i[n+3],t[n+5]=i[n+4],t[n+6]=i[n+5];this.dynamicBvhUniform.bvhBounds.needsUpdate=!0}_repackAllDynamicBounds(){const e=this._dynBoundsArray,t=new Float32Array(this.dynamicBvh._roots[0]),i=this._dynNodeCount;for(let n=0;n<i;n++){const r=n*8;e[r+0]=t[r+0],e[r+1]=t[r+1],e[r+2]=t[r+2],e[r+4]=t[r+3],e[r+5]=t[r+4],e[r+6]=t[r+5]}this.dynamicBvhUniform.bvhBounds.needsUpdate=!0}_updateDynamicPositions(e,t){const i=this.dynamicBvhUniform.position.image.data;for(const n of e){const r=n.start,a=n.start+n.count;let o=r*3,l=r*4;for(let c=r;c<a;c++,o+=3,l+=4)i[l]=t[o],i[l+1]=t[o+1],i[l+2]=t[o+2]}this.dynamicBvhUniform.position.needsUpdate=!0}_rebuildDynamicNodeMaps(){this.dynamicBvhUniform.updateFrom(this.dynamicBvh),this._dynBoundsArray=this.dynamicBvhUniform.bvhBounds.image.data,this._dynNodeCount=this.dynamicBvh._roots[0].byteLength/32,Eh(this)}_refreshDynamicEmissive(){const e=this._dynamicEmissive;if(e.length===0)return;const t=typeof performance<"u"?performance:Date,i=t.now(),n=this.materialsTex,r=n.image.data,a=n.image.width*4,o=this.dynamicMerged.getAttribute("position").array,l=this.emissiveTris;for(let c=0;c<e.length;c++){const u=e[c],h=u.off,d=o[h],f=o[h+1],v=o[h+2],_=o[h+3]-d,m=o[h+4]-f,p=o[h+5]-v,y=o[h+6]-d,g=o[h+7]-f,x=o[h+8]-v;let S=m*x-p*g,b=p*y-_*x,T=_*g-m*y;const C=Math.hypot(S,b,T),w=C*.5,M=C>1e-10?1/C:0;S*=M,b*=M,T*=M;const D=u.emit,A=l[u.row];A.v0[0]=d,A.v0[1]=f,A.v0[2]=v,A.e1[0]=_,A.e1[1]=m,A.e1[2]=p,A.e2[0]=y,A.e2[1]=g,A.e2[2]=x,A.n[0]=S,A.n[1]=b,A.n[2]=T,A.area=w;const N=a+u.row*16;r[N+0]=d,r[N+1]=f,r[N+2]=v,r[N+3]=w,r[N+4]=_,r[N+5]=m,r[N+6]=p,r[N+7]=D[0],r[N+8]=y,r[N+9]=g,r[N+10]=x,r[N+11]=D[1],r[N+12]=S,r[N+13]=b,r[N+14]=T,r[N+15]=D[2]}this.emissivePower=Th(r,a,l),n.needsUpdate=!0,this.lastEmissiveRefreshMs=t.now()-i}dispose(){this.staticBvhUniform.dispose(),this.staticAttrTex.dispose(),this.dynamicBvhUniform.dispose(),this.dynamicAttrTex.dispose(),this.materialsTex&&this.materialsTex.dispose(),this.staticBvh&&this.staticBvh.geometry.dispose(),this.dynamicMerged&&this.dynamicMerged.dispose(),this.staticSources=[]}}function fu(s,e=s.count){const t=new Float32Array(e*3);for(let i=0;i<e;i++){const n=i*3;t[n]=s.getX(i),t[n+1]=s.getY(i),t[n+2]=s.getZ(i)}return t}function J_(s,e=s.count){const t=new Float32Array(e*2);for(let i=0;i<e;i++){const n=i*2;t[n]=s.getX(i),t[n+1]=s.getY(i)}return t}function Q_(s){s.geometry.getAttribute("normal")||s.geometry.computeVertexNormals();const e=s.geometry.index,t=e?s.geometry.toNonIndexed():s.geometry.clone();t.getAttribute("normal")||t.computeVertexNormals();const i=t.getAttribute("position").count,n=i-i%3,r=fu(t.getAttribute("position"),n),a=fu(t.getAttribute("normal"),n),o=new Rt;if(o.setAttribute("position",new $e(r.slice(),3)),o.setAttribute("normal",new $e(a.slice(),3)),t.getAttribute("uv")!==void 0)o.setAttribute("uv",new $e(J_(t.getAttribute("uv"),n),2));else{const h=new Float32Array(n*2);o.setAttribute("uv",new $e(h,2))}o.applyMatrix4(s.matrixWorld);const c=e?s.geometry.index.array.slice(0,n):null,u=s.geometry.getAttribute("position").count;return{geo:o,localPos:r,localNorm:a,count:n,indexMap:c,srcVertexCount:u}}function $_(s,e,t){const i=Array.isArray(s.material),n=s.geometry.groups,r=new Float32Array(e),a=[];if(i&&n&&n.length>0){const o=s.material[0];r.fill(t(o));for(const l of n){const c=s.material[l.materialIndex]??o;if(c.transparent)throw new Error(`three-realtime-rt: a transparent group material on a multi-material mesh is not supported for BVH tracing (transparent surfaces use the out-of-BVH straight-through blend path, which is per-mesh). Split the transparent group (materialIndex ${l.materialIndex}) into its own mesh.`);const u=t(c),h=Math.max(0,l.start),d=Math.min(e,l.start+l.count);for(let f=h;f<d;f++)r[f]=u;a.push({start:h,vcount:d-h,material:c})}}else{const o=i?s.material[0]:s.material;r.fill(t(o)),a.push({start:0,vcount:e,material:o})}return{matIdx:r,ranges:a}}const uo=new Map;let pu=!1;const Ur=new Map;let Fr=!0;const Sh=128,ey=16;function ty(s,e){try{const t=s.image,i=t&&(t.width||t.videoWidth||0),n=t&&(t.height||t.videoHeight||0);if(!t||i<=0||n<=0||typeof document>"u")return null;const r=document.createElement("canvas");r.width=e,r.height=e;const a=r.getContext("2d",{willReadFrequently:!0});a.drawImage(t,0,0,e,e);const o=a.getImageData(0,0,e,e).data;if(s.colorSpace!==Xt&&s.colorSpace!==fi)for(let c=0;c<o.length;c+=4)o[c]=Math.round(Jn(o[c]/255)*255),o[c+1]=Math.round(Jn(o[c+1]/255)*255),o[c+2]=Math.round(Jn(o[c+2]/255)*255);return o}catch{return null}}function iy(s,e,t){const i=new Map;for(let a=0;a<s.length;a++){const o=s[a];if(o){if(o.map&&o.map.image){const l=o.map.image;let c=i.get(l);c||(c={albedoMats:new Set,emissiveMats:new Set},i.set(l,c)),c.albedoMats.add(a)}if(o.emissiveMap&&o.emissiveMap.image){const l=o.emissiveMap.image;let c=i.get(l);c||(c={albedoMats:new Set,emissiveMats:new Set},i.set(l,c)),c.emissiveMats.add(a)}}}if(i.size===0)return{tiles:[],tileIndexForMat:null,hasTiles:!1};const n=[],r=new Array(s.length);for(let a=0;a<s.length;a++)r[a]={albedo:-1,emissive:-1};for(const[a,o]of i){let l=Ur.get(a);if(l===void 0){let u=null;for(let h=0;h<s.length;h++){const d=s[h];if(d){if(d.map&&d.map.image===a){u=d.map;break}if(d.emissiveMap&&d.emissiveMap.image===a){u=d.emissiveMap;break}}}l=u?ty(u,e):null,Ur.set(a,l)}if(!l){Fr&&(Fr=!1,console.warn("three-realtime-rt: a texture map could not be read on the CPU (CORS-tainted or not yet decoded) for secondary-ray sampling — that material will use its averaged colour for traced rays. Serve the texture same-origin (or set image.crossOrigin) to enable per-texel shading through glass/reflections/GI."));continue}if(n.length>=t){if(Fr){Fr=!1;const u=[];for(const[h]of i){if(!Ur.has(h)||Ur.get(h)===null)continue;if(!n.some(f=>f.image===h))for(let f=0;f<s.length;f++){const v=s[f];if(v&&(v.map&&v.map.image===h||v.emissiveMap&&v.emissiveMap.image===h)){u.push(v.name||`material ${f}`);break}}}console.warn(`three-realtime-rt: texture tile budget exceeded (max ${t}). Dropped textures: ${u.join(", ")||"(unknown)"}. These materials use their averaged colour for traced secondary rays.`)}continue}const c=n.length;n.push({image:a,data:l});for(const u of o.albedoMats)r[u].albedo=c;for(const u of o.emissiveMats)r[u].emissive=c}return{tiles:n,tileIndexForMat:r,hasTiles:n.length>0}}function Jn(s){return s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4)}function wh(s){if(uo.has(s))return uo.get(s);let e=null;try{const t=s.image,i=t&&(t.width||t.videoWidth||0),n=t&&(t.height||t.videoHeight||0);if(t&&i>0&&n>0&&typeof document<"u"){const a=document.createElement("canvas");a.width=16,a.height=16;const o=a.getContext("2d",{willReadFrequently:!0});o.drawImage(t,0,0,16,16);const l=o.getImageData(0,0,16,16).data,c=s.colorSpace!==Xt&&s.colorSpace!==fi;let u=0,h=0,d=0;const f=l.length/4;for(let v=0;v<l.length;v+=4)c?(u+=Jn(l[v]/255),h+=Jn(l[v+1]/255),d+=Jn(l[v+2]/255)):(u+=l[v]/255,h+=l[v+1]/255,d+=l[v+2]/255);e=[u/f,h/f,d/f]}}catch{e=null}return e===null&&!pu&&(pu=!0,console.info("three-realtime-rt: an emissiveMap could not be read on the CPU (CORS-tainted or not yet decoded), so its mesh casts no area light — it is still drawn per-pixel in the G-buffer. Serve the texture same-origin (or set image.crossOrigin) to enable the average-colour approximation.")),uo.set(s,e),e}function mu(s){return!!(s&&s.userData&&s.userData.rtNoAreaLight===!0)}function Uo(s){if(!s.emissive)return null;const e=s.emissiveIntensity??1;if(e<=0||s.emissive.r+s.emissive.g+s.emissive.b<=0)return null;if(s.emissiveMap!=null){const t=wh(s.emissiveMap);if(t==null)return null;const i=[s.emissive.r*e*t[0],s.emissive.g*e*t[1],s.emissive.b*e*t[2]];return .2126*i[0]+.7152*i[1]+.0722*i[2]<.001?null:i}return[s.emissive.r*e,s.emissive.g*e,s.emissive.b*e]}function ny(s){let e=null,t=0;for(let i=0;i<s.length;i++){const n=s[i]&&s[i].userData&&s[i].userData.rtVolumeAlbedo;if(!n)continue;if(e){t++;continue}const r=n.texture,a=r&&(r.isData3DTexture||r.isDataArrayTexture||r.image&&r.image.depth>0);if(!r||!a){console.warn("three-realtime-rt: userData.rtVolumeAlbedo.texture must be a THREE.Data3DTexture (RGB[A], pre-colormapped) — ignoring this material's volume albedo.");continue}const o=new P().copy(n.origin??new P(0,0,0)),l=new P().copy(n.size??new P(1,1,1));l.x===0&&(l.x=1),l.y===0&&(l.y=1),l.z===0&&(l.z=1);let c=!1;r.magFilter!==Ke&&(r.magFilter=Ke,c=!0),r.minFilter!==Ke&&(r.minFilter=Ke,c=!0),r.wrapS!==Ct&&(r.wrapS=Ct,c=!0),r.wrapT!==Ct&&(r.wrapT=Ct,c=!0),r.wrapR!==Ct&&(r.wrapR=Ct,c=!0),c&&(r.needsUpdate=!0),e={matIndex:i,texture:r,origin:o,size:l,material:s[i]}}return t>0&&console.warn(`three-realtime-rt: ${t+1} materials set userData.rtVolumeAlbedo, but v1 samples only ONE volume in the traced-bounce (GI/reflection) path — keeping the first. The other volumes still render correctly in primary visibility (the G-buffer); multi-volume bounces are future work.`),e}function sy(s,e=0){if(!s)return null;const t=(s.transmission??0)>0&&!s.transparent,i=s.userData&&s.userData.rtAttenuation;let n=null,r=0;if(i){const l=i.color;if(l&&typeof l.r=="number"?n=[l.r,l.g,l.b]:Array.isArray(l)&&l.length>=3&&(n=[l[0],l[1],l[2]]),r=i.distance,!n||!Number.isFinite(r)||r<=0)return console.warn("three-realtime-rt: userData.rtAttenuation needs { color: THREE.Color | [r,g,b], distance: finite > 0 (world units) } — ignoring this material's absorption."),null;if(!t)return console.warn("three-realtime-rt: userData.rtAttenuation is set on a material the tracer does not trace as glass (needs transmission > 0 and transparent: false) — absorption only acts along refracted in-medium paths, so it is ignored on this material."),null}else{if(!t)return null;const l=s.attenuationColor;if(r=s.attenuationDistance,l&&typeof l.r=="number"&&Number.isFinite(r)&&r>0)n=[l.r,l.g,l.b];else if(e>0){const c=s.color&&typeof s.color.r=="number"?[s.color.r,s.color.g,s.color.b]:[1,1,1];if(s.map){const u=wh(s.map);u&&(c[0]*=u[0],c[1]*=u[1],c[2]*=u[2])}if(Math.min(c[0],c[1],c[2])>=.85)return null;n=c,r=.05*e}else return null}const a=[0,0,0];let o=!1;for(let l=0;l<3;l++){const c=-Math.log(Math.max(n[l],1e-4))/r;a[l]=c>0?c:0,a[l]>0&&(o=!0)}return o?a:null}function ry(s,e=!1,t=0){let i=0;const n=new Float32Array(s.length*3),r=new Float32Array(s.length);for(let a=0;a<s.length;a++){const o=s[a];r[a]=o&&!o.transparent?o.transmission??0:0;const l=sy(o,t);l&&(n[a*3+0]=l[0],n[a*3+1]=l[1],n[a*3+2]=l[2],i++)}return i>0||e?{sigma:n,glass:r,count:i}:null}function ay(s){if(!s)return null;const e=s.userData&&s.userData.rtScattering;if(!e)return null;if(!((s.transmission??0)>0&&!s.transparent))return console.warn("three-realtime-rt: userData.rtScattering is set on a material the tracer does not trace as translucent (needs transmission > 0 and transparent: false) — the Kubelka-Munk march never enters an opaque body, so it is ignored on this material."),null;const i=r=>typeof r=="number"?[r,r,r]:r&&typeof r.r=="number"?[r.r,r.g,r.b]:Array.isArray(r)&&r.length>=3?[r[0],r[1],r[2]]:null;let n=null;if(e.coefficient!==void 0){if(n=i(e.coefficient),!n||!n.every(r=>Number.isFinite(r)&&r>=0))return console.warn("three-realtime-rt: userData.rtScattering.coefficient needs a non-negative number, [r,g,b] or THREE.Color (scattering coefficient in 1/world-unit) — ignoring this material's scattering."),null}else{const r=i(e.color),a=e.distance;if(!r||!Number.isFinite(a)||a<=0)return console.warn("three-realtime-rt: userData.rtScattering needs either { coefficient } or { color: THREE.Color | [r,g,b], distance: finite > 0 (world units) } — ignoring this material's scattering."),null;n=r.map(o=>{const l=-Math.log(Math.max(o,1e-4))/a;return l>0?l:0})}return n.some(r=>r>0)?n:null}function oy(s){let e=0;const t=new Float32Array(s.length*3),i=new Float32Array(s.length);for(let n=0;n<s.length;n++){const r=ay(s[n]);if(!r)continue;t[n*3+0]=r[0],t[n*3+1]=r[1],t[n*3+2]=r[2],i[n]=1,e++;const a=s[n].color;a&&(a.r<.999||a.g<.999||a.b<.999)&&console.warn(`three-realtime-rt: a userData.rtScattering material has a non-white base colour (${a.r.toFixed(3)}, ${a.g.toFixed(3)}, ${a.b.toFixed(3)}). The Kubelka-Munk reflectance IS the diffuse albedo, and the composite multiplies it by this colour — set the material colour to white and let K and S carry the pigment, or accept the extra tint deliberately.`)}return e>0?{sigmaS:t,km:i,count:e}:null}function ly(s,e,t,i,n,r){const a=j_(),o=n&&n.tiles&&n.tiles.length>0,l=o,c=t||l,u=i||l,h=n?n.tileSize:Sh,d=o?n.tiles.length:0,f=Math.max(s.length*2,e.length*4,gi,o?h:1,r*4),v=2+gi+1+(c?1:0)+(u?1:0)+(o?1:0)+(o?d*h:0)+1,_=v-1,m=new Float32Array(f*v*4);s.forEach((g,x)=>{const S=x*8,b=g.color??new ue(1,1,1),T=Uo(g)??[0,0,0];m[S+0]=b.r,m[S+1]=b.g,m[S+2]=b.b,m[S+3]=g.roughness??1,m[S+4]=T[0],m[S+5]=T[1],m[S+6]=T[2],m[S+7]=g.metalness??0});const p=f*4;e.forEach((g,x)=>{const S=p+x*16;m[S+0]=g.v0[0],m[S+1]=g.v0[1],m[S+2]=g.v0[2],m[S+3]=g.area,m[S+4]=g.e1[0],m[S+5]=g.e1[1],m[S+6]=g.e1[2],m[S+7]=g.emit[0],m[S+8]=g.e2[0],m[S+9]=g.e2[1],m[S+10]=g.e2[2],m[S+11]=g.emit[1],m[S+12]=g.n[0],m[S+13]=g.n[1],m[S+14]=g.n[2],m[S+15]=g.emit[2]});for(let g=0;g<gi;g++){const x=(2+g)*p,S=g*gi*4;for(let b=0;b<gi*4;b++)m[x+b]=(a[S+b]+.5)/256}if(Th(m,p,e),c){const g=(2+gi+1)*p;if(t){const x=t.sigma,S=t.glass;for(let b=0;b<s.length;b++)m[g+b*4+0]=x[b*3+0],m[g+b*4+1]=x[b*3+1],m[g+b*4+2]=x[b*3+2],m[g+b*4+3]=S[b]}}if(u){const g=(2+gi+2)*p;if(i){const x=i.sigmaS,S=i.km;for(let b=0;b<s.length;b++)m[g+b*4+0]=x[b*3+0],m[g+b*4+1]=x[b*3+1],m[g+b*4+2]=x[b*3+2],m[g+b*4+3]=S[b]}}if(o){const g=(2+gi+3)*p;for(let x=0;x<s.length;x++){const S=n.tileIndexForMat[x];m[g+x*4+0]=S?S.albedo:-1,m[g+x*4+1]=S?S.emissive:-1,m[g+x*4+2]=0,m[g+x*4+3]=0}for(let x=0;x<d;x++){const S=n.tiles[x],b=2+gi+4+x*h;for(let T=0;T<h;T++){const C=(b+T)*p,w=(h-1-T)*h*4;for(let M=0;M<h;M++){const D=w+M*4;m[C+M*4+0]=S.data[D]/255,m[C+M*4+1]=S.data[D+1]/255,m[C+M*4+2]=S.data[D+2]/255,m[C+M*4+3]=S.data[D+3]/255}}}}const y=new Ds(m,f,v,Xe,pt);return y.minFilter=ze,y.magFilter=ze,y.needsUpdate=!0,{tex:y,lightRow:_}}function Mh(s){return s.area*(.2126*s.emit[0]+.7152*s.emit[1]+.0722*s.emit[2])}function cy(s){let e=0;for(let t=0;t<s.length;t++)e+=Mh(s[t]);return e}function Th(s,e,t){if(t.length===0)return 0;const i=(2+gi)*e;let n=0;const r=new Array(t.length);for(let o=0;o<t.length;o++)r[o]=Mh(t[o]),n+=r[o];let a=0;for(let o=0;o<t.length;o++){const l=n>0?r[o]/n:1/t.length;a+=l,s[i+o*4+0]=o===t.length-1?1:a,s[i+o*4+1]=l}return n}function gu(s,e,t,i=0,n=-1,r=-1){const a=s.getAttribute("position").array,o=i*3,l=n<0?a.length:Math.min(a.length,(i+n)*3);for(let c=o;c+9<=l;c+=9){const u=[a[c+3]-a[c],a[c+4]-a[c+1],a[c+5]-a[c+2]],h=[a[c+6]-a[c],a[c+7]-a[c+1],a[c+8]-a[c+2]],d=u[1]*h[2]-u[2]*h[1],f=u[2]*h[0]-u[0]*h[2],v=u[0]*h[1]-u[1]*h[0],_=Math.hypot(d,f,v);if(_<1e-10)continue;const m={v0:[a[c],a[c+1],a[c+2]],e1:u,e2:h,n:[d/_,f/_,v/_],area:_*.5,emit:e};r>=0&&(m.dyn=!0,m.dynOff=r+c),t.push(m)}}function uy(){const s=new Rt;return s.setAttribute("position",new $e(new Float32Array(9),3)),s.setAttribute("normal",new $e(new Float32Array([0,1,0,0,1,0,0,1,0]),3)),s.setAttribute("materialIndex",new $e(new Float32Array(3),1)),s.setAttribute("uv",new $e(new Float32Array(6),2)),s}function hy(s,e=!1){const t=s.getAttribute("normal"),i=s.getAttribute("materialIndex"),n=t.count;if(!e){const o=new Float32Array(n*4);for(let l=0;l<n;l++)o[l*4]=t.getX(l),o[l*4+1]=t.getY(l),o[l*4+2]=t.getZ(l),o[l*4+3]=i.getX(l);return{packed:o,attr:new $e(o,4)}}const r=new Float32Array(n*8),a=s.getAttribute("uv");for(let o=0;o<n;o++){const l=o*8;r[l+0]=t.getX(o),r[l+1]=t.getY(o),r[l+2]=t.getZ(o),r[l+3]=i.getX(o),r[l+4]=a?a.getX(o):0,r[l+5]=a?a.getY(o):0,r[l+6]=0,r[l+7]=0}return{packed:r,attr:new $e(r,4)}}function vu(s,{dynamic:e,stride2:t=!1}){const i=s.length>0?k0(s,!1):uy(),n=new ha(i,{strategy:e?la:dh});return{merged:i,bvh:n,...hy(i,t)}}function dy(s,e){let t=0,i=s.length;for(;t<i;){const n=t+i>>>1;s[n]<e?t=n+1:i=n}return t}function Eh(s){const t=s.dynamicBvh._roots;if(!t||t.length!==1)throw new Error("three-realtime-rt: multi-root dynamic BVHs are not supported by the GPU struct.");const i=t[0],n=new Uint16Array(i),r=new Uint32Array(i),a=s.dynamic,o=a.length,l=new Array(o);for(let v=0;v<o;v++)l[v]=a[v].start;const c=s.dynamicMerged.index?s.dynamicMerged.index.array:null,u=v=>dy(l,v+1)-1,h=new Array(o);for(let v=0;v<o;v++)h[v]=new Set;const d=[],f=[[0,!1]];for(;f.length;){const v=f.pop(),_=v[0];if(v[1]){d.pop();continue}if(d.push(_),n[_*2+15]===65535){const p=r[_+6],y=n[_*2+14],g=new Set;for(let x=p;x<p+y;x++){const S=c?c[3*x]:3*x;g.add(u(S))}for(const x of g){const S=h[x];for(let b=0;b<d.length;b++)S.add(d[b])}d.pop()}else f.push([_,!0]),f.push([_+8,!1]),f.push([r[_+6],!1])}for(let v=0;v<o;v++){const _=Array.from(h[v]).sort((m,p)=>m-p);a[v].refitNodes=Uint32Array.from(_)}}function fy(s,e={}){s.updateMatrixWorld(!0);const t=e.dynamicMeshes?new Set(e.dynamicMeshes):null,i=Ui(e.maxLights),n=e.textureTiles,r=n&&n.size||Sh,a=n&&n.max||ey,o=new Z_;o.maxLights=i;const l=o.materials,c=[],u=[],h=[];let d=0;const f=[],v=[],_={"rtdeforming-not-dynamic":[],"untraceable-object":[],"instanced-mesh":[],"transparent-dynamic":[]},m=[],p=typeof WeakRef=="function",y=A=>{let N=l.indexOf(A);return N<0&&(N=l.length,l.push(A)),N};s.traverse(A=>{if((A.isSprite||A.isLine||A.isPoints)&&A.visible&&!A.userData.rtExclude){_["untraceable-object"].push(A);return}if(!A.isMesh||!A.geometry||!A.visible||A.userData.rtExclude)return;A.isInstancedMesh&&_["instanced-mesh"].push(A);const N=Array.isArray(A.material);if((N?A.material[0]:A.material).transparent){t&&t.has(A)&&_["transparent-dynamic"].push(A);return}const U=t&&t.has(A);A.userData.rtDeforming===!0&&!U&&_["rtdeforming-not-dynamic"].push(A);const B=U&&A.userData.rtDeforming===!0;if(N&&A.geometry.groups&&A.geometry.groups.length>0&&B)throw new Error("three-realtime-rt: multi-material groups on a CPU-deforming (rtDeforming) mesh are not supported — the per-frame live-geometry rebake assumes one material range. Use groups on a static or rigid-dynamic mesh, or split the deforming mesh into one mesh per material.");const k=Q_(A);f.push(k.geo);const{matIdx:X,ranges:j}=$_(A,k.count,y);if(k.geo.setAttribute("materialIndex",new $e(X,1)),U){const Y=d;u.push(k.geo);for(const Z of j){const ae=mu(Z.material)?null:Uo(Z.material);ae&&gu(k.geo,ae,h,Z.start,Z.vcount,Y*3)}const te=A.isSkinnedMesh===!0,q=!te&&A.userData.rtDeforming===!0;q&&(o.hasDeforming=!0),te&&(o.hasSkinned=!0),o.dynamic.push({mesh:A,start:d,count:k.count,localPos:k.localPos,localNorm:k.localNorm,deforming:q,skinned:te,liveGeometry:q?A.geometry:null,indexMap:q||te?k.indexMap:null,srcVertexCount:q||te?k.srcVertexCount:0,skinnedLocal:te?new Float32Array(k.srcVertexCount*3):null,lastMatrix:null,aabb:null,refitNodes:null,emissive:!1}),d+=k.count}else{c.push(k.geo);for(const Y of j){const te=mu(Y.material)?null:Uo(Y.material);te&&gu(k.geo,te,h,Y.start,Y.vcount)}if(p){const Y=A.geometry.getAttribute("position");m.push({ref:new WeakRef(A),name:bh(A),version:Y?Y.version:-1,matrix:new Float64Array(A.matrixWorld.elements),warned:!1})}}});const g=(A,N)=>{v.push({code:A,message:N})},x=(A,N,I)=>{if(N.length===0)return;const U=N.filter(K=>Y_(K,A)),B=I(N);g(A,B),U.length>0&&console.warn(B)};if(x("rtdeforming-not-dynamic",_["rtdeforming-not-dynamic"],A=>`three-realtime-rt: userData.rtDeforming is set on a mesh that is NOT in compileScene(scene, {dynamicMeshes:[...]}) — the flag is IGNORED, the mesh compiles STATIC, and traced shadows/GI keep its compile-time shape forever: ${Nr(A)}. Add it to dynamicMeshes and call updateDynamic() each frame to make it actually deform.`),x("untraceable-object",_["untraceable-object"],A=>`three-realtime-rt: Sprite/Line/Points objects are not traceable geometry and are auto-hidden from the traced frame (their materials cannot write the 4-attachment G-buffer): ${Nr(A)}. Draw them in your own overlay pass on top of rt.render(), or set userData.rtExclude = true to silence this.`),x("instanced-mesh",_["instanced-mesh"],A=>`three-realtime-rt: InstancedMesh is NOT supported — it collapses to a single instance in the traced output and in the G-buffer: ${Nr(A)}. Expand it to individual meshes, or set userData.rtExclude = true to exclude it.`),x("transparent-dynamic",_["transparent-dynamic"],A=>`three-realtime-rt: a transparent mesh listed in dynamicMeshes does nothing — transparent meshes are composited via the blend path and are never BVH-traced or dynamic-registered: ${Nr(A)}. Remove it from dynamicMeshes, or make the material opaque (transparent: false) if it should cast traced shadows.`),o.warnings=v,o.staticSources=m,c.length===0&&u.length===0)throw new Error("three-realtime-rt: no meshes found in scene");const S=n===!1?null:iy(l,r,a),b=S&&S.hasTiles;S&&(S.tileSize=r);const T=b,C=vu(c,{dynamic:!1,stride2:T});o.staticBvh=C.bvh,o.staticBvhUniform.updateFrom(C.bvh),o.staticAttrTex.updateFrom(C.attr),o.hasDynamic=u.length>0;const w=vu(u,{dynamic:!0,stride2:T});o.dynamicMerged=w.merged,o.dynamicBvh=w.bvh,o.dynamicBvhUniform.updateFrom(w.bvh),o.dynamicPacked=w.packed,o.dynamicPackedAttr=w.attr,o.dynamicAttrTex.updateFrom(w.attr),o._dynBoundsArray=o.dynamicBvhUniform.bvhBounds.image.data,o._dynNodeCount=o.dynamicBvh._roots[0].byteLength/32,o.hasDynamic&&Eh(o),o.triangleCount=(C.merged.getAttribute("position").count+(o.hasDynamic?w.merged.getAttribute("position").count:0))/3,C.merged.computeBoundingBox();const M=C.merged.boundingBox;o.sceneDiagonal=M.isEmpty()?1:M.min.distanceTo(M.max),M.isEmpty()||(o.staticMin=[M.min.x,M.min.y,M.min.z],o.staticMax=[M.max.x,M.max.y,M.max.z]),o.lightGrid=vy(o.staticMin,o.staticMax,i),h.length>co&&(console.warn(`three-realtime-rt: ${h.length} emissive triangles exceed the NEE cap of ${co} (shared across static + dynamic emitters); keeping the largest by area (measured at compile time). Dropped triangles no longer act as lights — prefer low-poly emitter meshes, especially for dynamic ones (their tris are refreshed every frame).`),h.sort((A,N)=>N.area-A.area),h.length=co),o.emissiveTriCount=h.length,o.emissivePower=cy(h),o.emissiveTris=h,o._dynamicEmissive=[];for(let A=0;A<h.length;A++){const N=h[A];N.dyn&&o._dynamicEmissive.push({row:A,off:N.dynOff,emit:N.emit})}o.hasDynamicEmissive=o._dynamicEmissive.length>0;for(const A of o._dynamicEmissive){const N=A.off/3;let I=0,U=o.dynamic.length;for(;I<U;){const B=I+U>>>1;o.dynamic[B].start<=N?I=B+1:U=B}o.dynamic[I-1].emissive=!0}o.scattering=oy(l),o.absorption=ry(l,!!(o.scattering||b),o.sceneDiagonal),o.hasTextureTiles=b,o._tileSize=r;const D=ly(l,h,o.absorption,o.scattering,b?S:null,o.maxLights);o.materialsTex=D.tex,o.lightRow=D.lightRow,o.volumeAlbedo=ny(l),Ah(s,o);for(const A of f)A!==C.merged&&A!==w.merged&&A.dispose();return o}const py=24,my=32,gy=8192;function vy(s,e,t=Zi){if(!s||!e)return null;const i=[e[0]-s[0],e[1]-s[1],e[2]-s[2]],n=Math.max(i[0],i[1],i[2]);if(!(n>0)||!Number.isFinite(n))return null;const r=n/py;let a=i.map(f=>Math.max(1,Math.min(my,Math.round(f/r)||1)));const o=Math.max(512,Math.floor(5e7/Math.max(1,t*t))),l=Math.min(gy,o);let c=a[0]*a[1]*a[2];for(;c>l;){const f=Math.cbrt(l/c),v=a.map(_=>Math.max(1,Math.floor(_*f)));if(v[0]===a[0]&&v[1]===a[1]&&v[2]===a[2]){const _=v.indexOf(Math.max(v[0],v[1],v[2]));if(v[_]<=1)break;v[_]-=1}a=v,c=a[0]*a[1]*a[2]}const u=n*.001,h=[s[0]-u,s[1]-u,s[2]-u],d=[i[0]+2*u,i[1]+2*u,i[2]+2*u];return{origin:h,cell:[d[0]/a[0],d[1]/a[1],d[2]/a[2]],dims:a,cells:c}}function Ah(s,e){const t=e.lightPosType,i=e.lightColorRadius,n=e.lightDirCone,r=e._lightSlots||(e._lightSlots=new Map),a=new P,o=new P;e.ambientColor.setRGB(0,0,0),e.hemiSky.setRGB(0,0,0),e.hemiGround.setRGB(0,0,0);const l=e.hemiUp.set(0,0,0),c=[];s.traverse(g=>{if(!(!g.isLight||!g.visible||g.intensity<=0)){if(g.isAmbientLight)e.ambientColor.r+=g.color.r*g.intensity,e.ambientColor.g+=g.color.g*g.intensity,e.ambientColor.b+=g.color.b*g.intensity;else if(g.isHemisphereLight){e.hemiSky.r+=g.color.r*g.intensity,e.hemiSky.g+=g.color.g*g.intensity,e.hemiSky.b+=g.color.b*g.intensity;const x=g.groundColor||g.color;e.hemiGround.r+=x.r*g.intensity,e.hemiGround.g+=x.g*g.intensity,e.hemiGround.b+=x.b*g.intensity,g.getWorldPosition(a),a.lengthSq()>1e-12?l.addScaledVector(a.normalize(),g.intensity):l.y+=g.intensity}else if(g.isSpotLight){g.getWorldPosition(a),g.target.getWorldPosition(o);const x=o.sub(a).normalize(),S=Math.cos(g.angle),b=Math.cos(g.angle*(1-(g.penumbra??0)));c.push({obj:g,pt:[a.x,a.y,a.z,2+b],cr:[g.color.r*g.intensity,g.color.g*g.intensity,g.color.b*g.intensity,g.userData.rtRadius??.1],dc:[x.x,x.y,x.z,S]})}else if(g.isPointLight)g.getWorldPosition(a),c.push({obj:g,pt:[a.x,a.y,a.z,0],cr:[g.color.r*g.intensity,g.color.g*g.intensity,g.color.b*g.intensity,g.userData.rtRadius??.15],dc:[0,0,0,0]});else if(g.isDirectionalLight){g.getWorldPosition(a),g.target.getWorldPosition(o);const x=o.sub(a).normalize();c.push({obj:g,pt:[x.x,x.y,x.z,1],cr:[g.color.r*g.intensity,g.color.g*g.intensity,g.color.b*g.intensity,g.userData.rtRadius??.02],dc:[0,0,0,0]})}}});const u=e.maxLights||Zi,h=Math.min(c.length,u),d=new Array(u).fill(null),f=new Set;for(const g of c){const x=r.get(g.obj);x!==void 0&&x>=0&&x<h&&d[x]===null&&(d[x]=g,f.add(g))}let v=0;for(const g of c)if(!f.has(g)){for(;v<h&&d[v]!==null;)v++;if(v>=h)break;d[v]=g,v++}t.length=0,i.length=0,n.length=0,r.clear(),(!e._seatGen||e._seatGen.length!==u)&&(e._seatGen=new Float32Array(u),e._seatObj=new Array(u).fill(null));const _=e._seatGen,m=e._seatObj;let p=0;for(let g=0;g<u;g++){const x=d[g];x?(t.push(x.pt[0],x.pt[1],x.pt[2],x.pt[3]),i.push(x.cr[0],x.cr[1],x.cr[2],x.cr[3]),n.push(x.dc[0],x.dc[1],x.dc[2],x.dc[3]),r.set(x.obj,g),m[g]!==x.obj&&(m[g]=x.obj,_[g]+=1),p++):(t.push(0,0,0,0),i.push(0,0,0,0),n.push(0,0,0,0),m[g]!==null&&(m[g]=null,_[g]+=1))}e.lightCount=p;let y=0;for(let g=0;g<p;g++){const x=t[g*4+3];x>=.5&&x<1.5&&y++}e.directionalCount=y,_y(e),l.lengthSq()>1e-12?l.normalize():l.set(0,1,0)}function _y(s){const e=s.materialsTex;if(!e||s.lightRow<0){s.lightsChanged=!0;return}const t=e.image.data,i=e.image.width,n=s.maxLights||Zi,r=s.lightRow*i*4,a=s.lightPosType,o=s.lightColorRadius,l=s.lightDirCone,c=s._seatGen;let u=!1;const h=Math.fround;for(let d=0;d<n;d++){const f=r+d*16,v=d*4;for(let m=0;m<4;m++){const p=h(a[v+m]),y=h(o[v+m]),g=h(l[v+m]);t[f+m]!==p&&(t[f+m]=p,u=!0),t[f+4+m]!==y&&(t[f+4+m]=y,u=!0),t[f+8+m]!==g&&(t[f+8+m]=g,u=!0)}const _=c?c[d]:0;t[f+12]!==_&&(t[f+12]=_,u=!0)}s.lightsChanged=u}function yy(s,e){const t=s.materialsTex;if(!t||s.lightRow<0)return"none";const i=e&&e.properties?e.properties.get(t):null,n=i?i.__webglTexture:null,r=e?e.state:null;if(!n||!r||typeof r.bindTexture!="function")return t.needsUpdate=!0,"full";try{const a=e.getContext(),o=t.image.width,l=s.maxLights||Zi,c=Math.min(o,l*4),u=s.lightRow*o*4,h=t.image.data.subarray(u,u+c*4);return r.bindTexture(a.TEXTURE_2D,n),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),a.pixelStorei(a.UNPACK_ALIGNMENT,t.unpackAlignment||1),a.texSubImage2D(a.TEXTURE_2D,0,0,s.lightRow,c,1,a.RGBA,a.FLOAT,h),"sub"}catch{return t.needsUpdate=!0,"full"}}function Ji(s,e,t,i={}){if(ql)return new ql(s,e,t,i);const n=new xt(s,e,{...i,count:t});return Object.defineProperty(n,"texture",{value:n.textures,writable:!0,configurable:!0}),n}const xy=`
#include <skinning_pars_vertex>

out vec3 vWorldPos;
out vec3 vWorldNormal;
out vec2 vUvCoord;
out vec3 vColor;
#ifdef RT_MOTION_VECTORS
// Previous-frame WORLD position of this vertex: the same local position under
// LAST frame's model matrix. For a static mesh uPrevModelMatrix === modelMatrix
// (identical 16 values), so this is computed by the exact same instructions as
// vWorldPos and interpolates bit-identically — the motion vector then collapses
// to camera-only reprojection with zero rounding difference.
out vec3 vPrevWorldPos;
uniform mat4 uPrevModelMatrix;
#endif

uniform mat3 uNormalMatrixWorld;

void main() {
  vec3 transformed = position;
  vec3 objectNormal = normal;
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>

  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  vWorldPos = wp.xyz;
#ifdef RT_MOTION_VECTORS
  vPrevWorldPos = (uPrevModelMatrix * vec4(transformed, 1.0)).xyz;
#endif
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
`,by=`
precision highp float;

layout(location = 0) out vec4 gAlbedoRough;
layout(location = 1) out vec4 gNormalMetal;
layout(location = 2) out vec4 gWorldPos;
layout(location = 3) out vec4 gEmissive;
#ifdef RT_MOTION_VECTORS
layout(location = 4) out vec4 gMotion;
#endif

in vec3 vWorldPos;
in vec3 vWorldNormal;
in vec2 vUvCoord;
in vec3 vColor;
#ifdef RT_MOTION_VECTORS
in vec3 vPrevWorldPos;
uniform mat4 uPrevViewProj;
#endif

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
uniform float uIsDynamic; // 1.0 while rendering a dynamic-mesh surface (see setDynamicMeshes)

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
  // Dynamic-mesh surfaces instead write -1.0: a per-pixel flag the reservoir
  // passes read to know which pixels belong to moving geometry (dynamicMeshes
  // are not visible from inside a shader). Opacity is never negative and dynamic
  // meshes are never blend (transparent meshes are dropped from dynamicMeshes),
  // so the sentinel cannot collide with either consumer.
  gEmissive = vec4(emissive, uIsDynamic > 0.5 ? -1.0 : (uBlend ? uOpacity : 1.0));
#ifdef RT_MOTION_VECTORS
  // Previous-frame screen position of this surface point, in [0,1] UV. For a
  // static mesh (vPrevWorldPos === vWorldPos) this is the camera-only
  // reprojection the consumers would otherwise compute, so the static path
  // reduces to it (the ReSTIR stage, which samples this value directly, is
  // bit-identical; the accumulate/TAA stages re-derive the same clip.xy/clip.w
  // division inside their own program and can differ by 1 ULP on a tiny
  // fraction of fragments — a 1-LSB, 0.1% mismatch, not a functional one).
  // Storing the raw previous UV (rather than a pre-subtracted prevUv - currUv
  // delta) is what keeps that reduction exact enough to be byte-identical:
  // a pre-subtracted delta would force the consumer to reassociate
  // currUv + (prevUv - currUv) back to prevUv, a 1-ULP error that showed up as
  // a 1-LSB mismatch in 0.23% of channels. prevClip.w <= 0 means the surface
  // was behind last frame's camera — no valid history position exists, so write
  // an out-of-bounds sentinel (not NaN: NaN comparison falls through the
  // consumers' bounds checks) that every consumer's existing bounds test drops.
  {
    vec4 prevClip = uPrevViewProj * vec4(vPrevWorldPos, 1.0);
    if (prevClip.w > 0.0) {
      gMotion = vec4((prevClip.xy / prevClip.w) * 0.5 + 0.5, 0.0, 0.0);
    } else {
      gMotion = vec4(1e4, 1e4, 0.0, 0.0);
    }
  }
#endif
}
`;function Sy(s){return s.onBeforeRender!==rt.prototype.onBeforeRender||s.onAfterRender!==rt.prototype.onAfterRender}class wy{constructor(e,t,{mixedPrecision:i=!0,materialPooling:n=!0}={}){this._mixedPrecision=i,this._width=e,this._height=t,this._materialPooling=n!==!1,this._targets=[this._makeTarget(e,t),this._makeTarget(e,t)],this._current=0,this._materialCache=new WeakMap,this._sharedMaterialPool=new Map,this._sharedHiddenMaterial=null,this._sharedSources=new WeakMap,this._sharedMaterialArrays=new WeakMap,this._swapped=[],this._hidden=[],this._normalMat3=new De,this._volumeEnabled=!1,this._dummyVolumeTex=null,this._dynamicMeshes=null,this._motionEnabled=!1,this._prevModelMatrices=null,this._motionPrevViewProj=new he}setDynamicMeshes(e){this._dynamicMeshes=e&&e.length?new Set(e):null}_dummyVolume(){if(!this._dummyVolumeTex){const e=new zu(new Uint8Array([255,255,255,255]),1,1,1);e.format=Xe,e.type=hi,e.minFilter=Ke,e.magFilter=Ke,e.needsUpdate=!0,this._dummyVolumeTex=e}return this._dummyVolumeTex}_resetSharedMaterialPool(){for(const e of this._sharedMaterialPool.values())e.dispose();this._sharedMaterialPool.clear(),this._sharedMaterialArrays=new WeakMap}setVolume(e){const t=!!e;t!==this._volumeEnabled&&(this._volumeEnabled=t,this._materialCache=new WeakMap,this._resetSharedMaterialPool())}setMotionVectors(e){const t=!!e;if(t!==this._motionEnabled){this._motionEnabled=t;for(const i of this._targets)i.dispose();this._targets=[this._makeTarget(this._width,this._height),this._makeTarget(this._width,this._height)],this._current=0,this._materialCache=new WeakMap,this._resetSharedMaterialPool()}}setPrevModelMatrices(e){this._prevModelMatrices=e}setMotionMatrices(e){this._motionPrevViewProj.copy(e)}_makeTarget(e,t){const i=Ji(e,t,this._motionEnabled?5:4,{minFilter:ze,magFilter:ze,type:pt,depthBuffer:!0});for(const n of i.texture)n.generateMipmaps=!1;return this._mixedPrecision&&(i.texture[0].type=Et,i.texture[1].type=Et,i.texture[3].type=Et),this._motionEnabled&&(i.texture[4].format=ta,i.texture[4].type=pt),i}get target(){return this._targets[this._current]}get _prev(){return this._targets[1-this._current]}get albedoRough(){return this.target.texture[0]}get normalMetal(){return this.target.texture[1]}get worldPos(){return this.target.texture[2]}get emissive(){return this.target.texture[3]}get prevNormalMetal(){return this._prev.texture[1]}get prevWorldPos(){return this._prev.texture[2]}get motion(){return this._motionEnabled?this.target.texture[4]:null}setSize(e,t){this._width=e,this._height=t;for(const i of this._targets)i.setSize(e,t)}_makeGbufferMaterial(e){const t=new st({name:"rt:gbuffer",glslVersion:vt,defines:{...this._volumeEnabled?{RT_VOLUME_ALBEDO:"1"}:{},...this._motionEnabled?{RT_MOTION_VECTORS:"1"}:{}},vertexShader:xy,fragmentShader:by,uniforms:{uNormalMatrixWorld:{value:new De},uColor:{value:new ue(1,1,1)},uRoughness:{value:1},uMetalness:{value:0},uTransmission:{value:0},uIor:{value:1.5},uEmissive:{value:new ue(0,0,0)},uMap:{value:null},uHasMap:{value:!1},uEmissiveMap:{value:null},uHasEmissiveMap:{value:!1},uNormalMap:{value:null},uHasNormalMap:{value:!1},uNormalScale:{value:new le(1,1)},uRoughnessMap:{value:null},uHasRoughnessMap:{value:!1},uMetalnessMap:{value:null},uHasMetalnessMap:{value:!1},uBlend:{value:!1},uOpacity:{value:1},uIsDynamic:{value:0},uPrevModelMatrix:{value:new he},uPrevViewProj:{value:new he},uVolumeTex:{value:null},uVolumeOrigin:{value:new P},uVolumeSize:{value:new P(1,1,1)},uHasVolume:{value:!1}},side:ti});return t.vertexColors=!!(e&&e.geometry&&e.geometry.getAttribute("color")),t}_syncGbufferMaterial(e,t,i,n,r,a=null){const o=e.uniforms;if(e.visible=t.visible!==!1,t.color?o.uColor.value.copy(t.color):o.uColor.value.set(1,1,1),o.uRoughness.value=t.roughness??1,o.uMetalness.value=t.metalness??0,o.uTransmission.value=t.transmission??0,o.uIor.value=t.ior??1.5,t.emissive?o.uEmissive.value.copy(t.emissive).multiplyScalar(t.emissiveIntensity??1):o.uEmissive.value.set(0,0,0),o.uMap.value=t.map??null,o.uHasMap.value=!!t.map,o.uEmissiveMap.value=t.emissiveMap??null,o.uHasEmissiveMap.value=!!t.emissiveMap,o.uNormalMap.value=t.normalMap??null,o.uHasNormalMap.value=!!t.normalMap,t.normalScale?o.uNormalScale.value.copy(t.normalScale):o.uNormalScale.value.set(1,1),o.uRoughnessMap.value=t.roughnessMap??null,o.uHasRoughnessMap.value=!!t.roughnessMap,o.uMetalnessMap.value=t.metalnessMap??null,o.uHasMetalnessMap.value=!!t.metalnessMap,o.uBlend.value=!!t.transparent,o.uOpacity.value=t.opacity??1,o.uIsDynamic.value=i?1:0,this._motionEnabled&&(o.uPrevModelMatrix.value.copy(n),o.uPrevViewProj.value.copy(this._motionPrevViewProj)),this._volumeEnabled){const l=t.userData&&t.userData.rtVolumeAlbedo;if(l&&l.texture){o.uHasVolume.value=!0,o.uVolumeTex.value=l.texture,o.uVolumeOrigin.value.copy(l.origin??{x:0,y:0,z:0});const c=l.size??{x:1,y:1,z:1};o.uVolumeSize.value.set(c.x||1,c.y||1,c.z||1)}else o.uHasVolume.value=!1,o.uVolumeTex.value=this._dummyVolume()}o.uNormalMatrixWorld.value.copy(r),e.side=a===null?t.side??ti:a}_gbufferMaterialFor(e){const t=!!(this._dynamicMeshes&&this._dynamicMeshes.has(e)),i=this._motionEnabled&&this._prevModelMatrices&&this._prevModelMatrices.get(e)||e.matrixWorld,n=this._normalMat3.getNormalMatrix(e.matrixWorld),r=!!(e.geometry&&e.geometry.getAttribute("color"));if(Array.isArray(e.material)){let o=this._materialCache.get(e);(!Array.isArray(o)||o.length!==e.material.length)&&(o=e.material.map(()=>this._makeGbufferMaterial(e)),this._materialCache.set(e,o));for(let l=0;l<e.material.length;l++){const c=e.material[l];if(!c){o[l]=c;continue}o[l]||(o[l]=this._makeGbufferMaterial(e)),o[l].vertexColors!==r&&(o[l].vertexColors=r,o[l].needsUpdate=!0),this._syncGbufferMaterial(o[l],c,t,i,n)}return o}let a=this._materialCache.get(e);return(!a||Array.isArray(a))&&(a=this._makeGbufferMaterial(e),this._materialCache.set(e,a)),a.vertexColors!==r&&(a.vertexColors=r,a.needsUpdate=!0),this._syncGbufferMaterial(a,e.material,t,i,n),a}_makeSharedMaterial(e,t){const i=this._makeGbufferMaterial(null);return i.vertexColors=e,i.side=t,i.onBeforeRender=(n,r,a,o,l,c)=>{const u=this._sharedSources.get(l),h=c&&c.materialIndex!==void 0?c.materialIndex:0,d=Array.isArray(u)?u[h]:u;if(!d)return;const f=!!(this._dynamicMeshes&&this._dynamicMeshes.has(l)),v=this._motionEnabled&&this._prevModelMatrices&&this._prevModelMatrices.get(l)||l.matrixWorld,_=this._normalMat3.getNormalMatrix(l.matrixWorld);this._syncGbufferMaterial(i,d,f,v,_,t),i.side=t,i.uniformsNeedUpdate=!0},i}_sharedMaterialForSource(e,t){if(!e||e.visible===!1)return this._sharedHiddenMaterial;const i=e.side??ti,n=`${t?1:0}:${String(i)}`;let r=this._sharedMaterialPool.get(n);return r||(r=this._makeSharedMaterial(t,i),this._sharedMaterialPool.set(n,r)),r}_sharedMaterialFor(e){this._sharedHiddenMaterial||(this._sharedHiddenMaterial=new Go({visible:!1}));const t=e.material,i=!!(e.geometry&&e.geometry.getAttribute("color"));if(!Array.isArray(t))return this._sharedSources.set(e,t),this._sharedMaterialForSource(t,i);let n=this._sharedMaterialArrays.get(e);(!Array.isArray(n)||n.length!==t.length)&&(n=new Array(t.length),this._sharedMaterialArrays.set(e,n)),this._sharedSources.set(e,t);for(let r=0;r<t.length;r++){const a=t[r];n[r]=a&&this._sharedMaterialForSource(a,i)}return n}render(e,t,i){this._current=1-this._current,this._swapped.length=0,this._hidden.length=0,t.traverse(a=>{if(a.visible){if(a.isMesh&&a.geometry){this._swapped.push(a,a.material);const o=this._materialPooling&&!Sy(a);a.material=o?this._sharedMaterialFor(a):this._gbufferMaterialFor(a);return}(a.isSprite||a.isLine||a.isPoints)&&(a.visible=!1,this._hidden.push(a))}});const n=t.background;let r=!1;try{t.background=null,e.setRenderTarget(this.target),r=!0,e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(t,i)}finally{r&&e.setRenderTarget(null),t.background=n;for(let a=0;a<this._swapped.length;a+=2)this._swapped[a].material=this._swapped[a+1];this._swapped.length=0;for(const a of this._hidden)a.visible=!0;this._hidden.length=0}}dispose(){for(const e of this._targets)e.dispose();this._dummyVolumeTex&&this._dummyVolumeTex.dispose(),this._resetSharedMaterialPool(),this._sharedHiddenMaterial&&this._sharedHiddenMaterial.dispose()}}const $o=`
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
`,el=`

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
`,ho=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,My=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${Jo}
${Qo}
${el}
${$o}

#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE
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

// THE LIGHT TABLE lives in one row of uMaterialsTex (row index = uLightRow),
// 4 texels per seat. It was three vec4[MAX_LIGHTS] uniform arrays until 0.16.0,
// which is what capped the scene at 32 lights: 128 seats would be 384 uniform
// vectors against a 224 guaranteed minimum, while as texels they cost nothing
// but width in a texture this pass already binds. The three accessors below are
// the ONLY readers — every shading expression downstream is unchanged, so the
// maths is bit-identical to the uniform-array build (a texelFetch of an RGBA32F
// NearestFilter texel returns the stored float32 exactly).
uniform int uLightRow;
// Directional lights currently seated. The bypass sweep below is a loop over the
// WHOLE table testing each seat's type, and a seat is now a texel fetch: with no
// sun in the scene that is uLightCount wasted fetches per pixel per frame.
uniform int uDirCount;
vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); } // xyz pos|dir, w: 0 point, 1 directional, >=2 spot (w-2 = cosInner)
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); } // rgb color*intensity, w radius
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); } // spot: direction.xyz + cos(outer angle)
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
// >>> RT_RESTIR_MULTISAMPLE
// How many reservoir winners this pixel shades per frame, each with its own
// visibility ray. 1 = the shipped single-sample path, bit-identical. Sample 0
// is always THIS pixel's reservoir; the rest are neighbouring pixels'
// reservoirs, validated the way RestirPass's spatial stage validates a tap.
// The cap is a compile-time constant so the loop bound is constant (the driver
// sees the same shape as the existing per-light loop), but the count itself is
// a uniform, so one program serves every setting — nothing recompiles and the
// iOS translation risk is a single yes/no rather than one per value.
#define RESTIR_MAX_SAMPLES 4
uniform int uRestirSamples;
uniform float uRestirTapRadius; // neighbour tap radius ceiling, lighting texels
// <<< RT_RESTIR_MULTISAMPLE
// >>> RT_RESTIR_COLD_FALLBACK
// Frames of validated reservoir history a pixel must have before it is shaded
// FROM that reservoir. Younger pixels take the exact per-light path instead.
// 0 = off = the shipped behaviour, and the reservoir stage writes the age
// regardless, so nothing about the estimator changes when this is 0.
uniform float uRestirWarmAge;
// <<< RT_RESTIR_COLD_FALLBACK
// >>> RT_RESTIR_CLAMP_REL
// Firefly cap on the ReSTIR direct term, RELATIVE to the pixel's own reservoir
// estimate of the unshadowed light total (the spatial stage writes it into the
// reservoir's .g). The cap is max(2 * fireflyClamp, this * p̂_total), so
// 0 = off = the absolute cap alone = the shipped behaviour, byte for byte. See
// the note in shadeReservoir for why an absolute cap darkens bright surfaces.
uniform float uRestirClampRel;
// <<< RT_RESTIR_CLAMP_REL
// >>> RT_RESTIR_DIR_BYPASS
// Directional lights are shaded EXACTLY, always, and are kept out of the ReSTIR
// reservoir (RestirPass.uDirBypass must be set to match). A directional light
// has a large unshadowed target score on every surface facing it and is
// occluded on most interior ones, so a reservoir keeps electing it, spends its
// one visibility ray on a wall, and the pixel goes black — with the odd frame's
// runner-up showing through as a bright speck. Production ReSTIR renderers keep
// directional lights out of the reservoir for this reason. The cost is one
// extra shadow ray per pixel per directional light, which is the smallest light
// class in any scene here (one sun).
// false = the shipped behaviour, byte for byte.
uniform bool uDirBypass;
// <<< RT_RESTIR_DIR_BYPASS
uniform bool uGIHalfRate;      // GI ray on alternating checkerboard, doubled

// >>> RT_AMBIENT
// Unoccluded ambient: three's AmbientLight and HemisphereLight, summed CPU-side
// by SceneCompiler.syncLights. Four uniforms and no sampler, because this pass
// is at the WebGL2 16-sampler minimum; no loop and no ray, because neither light
// has a position to trace toward. All zero when the scene has no such light, and
// all zero when the ambient option is false — which is what makes that OFF state
// byte-identical in RESULT to the build before it (the uniform block itself is
// four declarations of source, see the release report).
uniform vec3 uAmbientFlat;   // sum of AmbientLight colour x intensity
uniform vec3 uHemiSky;       // sum of HemisphereLight sky halves
uniform vec3 uHemiGround;    // ... and their ground halves
uniform vec3 uHemiUp;        // world axis the hemisphere blend runs along
// <<< RT_AMBIENT
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
  vec4 posType = lightPosType(i);
  if (posType.w < 1.5) return 1.0;
  vec4 dc = lightDirCone(i);
  return smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, lightToP));
}

vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = lightPosType(i);
  vec4 colRad = lightColorRadius(i);

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
// >>> RT_RESTIR_DIR_BYPASS
// skipDir drops a directional pick (returns 0 for it, keeps the 1/N pick pdf),
// which stays unbiased for the lights that remain: the estimator's expectation
// becomes the sum over the non-directional lights, which is exactly what the
// caller wants when it is adding the directional ones exactly. GI bounces pass
// false and are untouched.
vec3 sampleOneLight(vec3 P, vec3 N, bool skipDir) {
  if (uLightCount == 0) return vec3(0.0);
  int i = min(int(rand() * float(uLightCount)), uLightCount - 1);
  float lw = lightPosType(i).w;
  if (skipDir && lw >= 0.5 && lw < 1.5) return vec3(0.0);
  return lightContribution(i, P, N) * float(uLightCount);
}
// <<< RT_RESTIR_DIR_BYPASS

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
// >>> RT_RESTIR_MULTISAMPLE
// One reservoir, shaded at THIS pixel's surface and scaled by wgt (1/N when N
// winners are averaged). Split out of shadeReservoir so the multi-sample loop
// below has exactly ONE call site — see the Metal call-site note in main().
// The reservoir may be this pixel's own or a validated neighbour's: the RIS
// estimator f(Y)·W is unbiased for ANY target function with sufficient support
// (the target only steers which sample is picked), so a neighbour's W applied
// to the contribution recomputed HERE still estimates this pixel's integral.
vec3 shadeReservoirSample(vec4 res, vec3 P, vec3 N, float wgt) {
// <<< RT_RESTIR_MULTISAMPLE
  // Spatial-stage encoding: r = id, a = precomputed W (vs. centroid score).
  if (res.a <= 0.0) return vec3(0.0);
  float id = res.r;

  vec3 C;
  vec3 wi;
  float maxDist;
  if (id < float(MAX_LIGHTS)) {
    int i = int(id);
    vec4 posType = lightPosType(i);
    vec4 colRad = lightColorRadius(i);
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
  if (gWantSpec) gSpec += C * (ggxSpec(N, wi) * res.a * wgt);
  // The safety clamp is NOT applied here: it belongs to the pixel's direct
  // term as a whole, and the caller applies it to the average. Clamping each
  // sample first would be a one-sided energy loss that grows with N — a spike
  // is already suppressed N-fold by the averaging, so clamping it again
  // darkens exactly the bright spots the extra samples were bought for. With
  // N = 1 the average IS the sample, so the arithmetic is unchanged.
  return C * res.a * wgt;
}

// >>> RT_RESTIR_MULTISAMPLE
// Shade N reservoir winners and average them. Sample 0 is this pixel's own
// reservoir (so N = 1 reduces to the shipped path, same RNG draws in the same
// order, same arithmetic times 1.0); samples 1..N-1 read a NEIGHBOUR pixel's
// reservoir, which cost the spatial stage nothing extra to produce.
//
// WHY AVERAGING IS NOT DOUBLE COUNTING: each term is an independent unbiased
// estimate of the SAME quantity — this pixel's full direct-lighting integral,
// not "the light that term picked". The mean of N unbiased estimates is
// unbiased whatever they select, including when two of them select the same
// light. (Summing them without the 1/N is what would double count.) Two
// samples landing on the same light is therefore a VARIANCE issue, not a bias
// one: the pair only averages the soft-shadow jitter and the area-light point,
// so N correlated samples reduce noise by less than sqrt(N).
//
// An unvalidated neighbour falls back to this pixel's own reservoir instead of
// being dropped: dropping it while still dividing by N would darken every
// geometry edge, trading noise for a visible bias.
vec3 shadeReservoir(vec3 P, vec3 N) {
  vec4 own = texture(uReservoir, vUv);
  int n = clamp(uRestirSamples, 1, RESTIR_MAX_SAMPLES);
  float wgt = 1.0 / float(n);
  // Taps use the SAME validation and radius as the spatial stage: a neighbour
  // on another surface would import light across a geometry edge, which is
  // bias, not noise.
  vec2 ts = 1.0 / vec2(textureSize(uReservoir, 0));
  float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
  float dA = (2.0 * PI) / float(max(n - 1, 1)); // stratify the N-1 taps
  vec3 sum = vec3(0.0);
  for (int k = 0; k < RESTIR_MAX_SAMPLES; k++) {
    if (k >= n) break;
    vec4 res = own;
    if (k > 0) {
      float ang = (float(k - 1) + rand()) * dA;
      float rad = 2.0 + rand() * max(uRestirTapRadius - 2.0, 0.0);
      vec2 nUv = vUv + vec2(cos(ang), sin(ang)) * rad * ts;
      vec4 nwp = texture(uGWorldPos, nUv);
      bool ok = nUv.x >= 0.0 && nUv.x <= 1.0 && nUv.y >= 0.0 && nUv.y <= 1.0
        && nwp.w >= 0.5
        && abs(dot(nwp.xyz - P, N)) <= tol
        && dot(N, normalize(texture(uGNormalMetal, nUv).xyz)) >= 0.9;
      if (ok) res = texture(uReservoir, nUv);
    }
    sum += shadeReservoirSample(res, P, N, wgt);
  }
  // Safety clamp, same budget as the emissive direct clamp elsewhere. At N = 1
  // this is byte-for-byte the clamp that used to sit inside the sample.
  float l = dot(sum, vec3(0.299, 0.587, 0.114));
  // >>> RT_RESTIR_CLAMP_REL
  // AN ABSOLUTE CAP IS THE WRONG SHAPE FOR THIS ESTIMATOR, and it costs
  // brightness rather than saving it. The exact path spends one shadow ray PER
  // light and caps analytic lights nowhere; ReSTIR spends ONE ray on the whole
  // sum, so f(Y)·W lands near the TOTAL when the winner turns out to be visible
  // and on zero when it does not. That distribution is bimodal, the absolute cap
  // clips the peaks, and nothing lifts the zeros, so a surface bright enough to
  // exceed the cap converges DARK. Measured converged at 90 renders against a
  // 250-render exact reference, this cap alone (dev/candidates-REPORT.md, gate
  // 2): gallery mean 6.037 -> 4.540 and SIGNED -2.520 -> -0.233; great hall
  // 6.353 -> 5.857 and -4.752 -> -3.802. Signed floors 0.02 to 0.21.
  //
  // uRestirClampRel scales THIS PIXEL'S OWN estimate of the unshadowed total
  // (RestirPass's spatial stage writes wSum/M into .g), so the cap tracks what
  // the pixel could plausibly receive instead of a scene-wide constant. 0 = off
  // = exactly the absolute cap above, byte for byte. 2 means "no more than twice
  // the whole light sum", which still catches a genuine 1/d^2 firefly (those run
  // to 100x) while letting a fully lit surface reach its own total.
  float cap = max(uFireflyClamp * 2.0, uRestirClampRel * own.g);
  // <<< RT_RESTIR_CLAMP_REL
  if (l > cap) sum *= cap / l;
  return sum;
}
// <<< RT_RESTIR_MULTISAMPLE

// >>> RT_RESTIR_COLD_FALLBACK
// The EXACT direct-lighting path: one shadow ray per analytic light plus one
// for the emissive set. This is what the owner calls "a perfect result" and it
// is the fallback a cold ReSTIR pixel takes. Factored out of main() so the loop
// exists ONCE in this shader — main() now reaches it from two branches (ReSTIR
// on but this pixel cold, and ReSTIR off entirely), and a second copy of a
// twenty-line loop is how the two paths drift apart.
// >>> RT_RESTIR_DIR_BYPASS
// ONE loop, one call site, a subset predicate. The spec's shape was a second
// helper (shadeDirectionalLights) beside this one, which would have put a
// THIRD lightContribution body in the shader (this loop, sampleOneLight, and
// the new one) — the same register wall that made two shadeAllLights call sites
// fail to link. So the directional subset is a MODE of this function instead:
//   0 = every light + the emissive set (the exact path, unchanged)
//   1 = the directional lights only, no emissive (the bypass sum)
//   2 = nothing at all, and no RNG consumed
// Mode 0 keeps the original light ORDER, so with the bypass on the exact path
// is still byte-for-byte the exact path (the sun is shaded in its own slot, not
// hoisted in front), which is what makes the cold-fallback arm comparable.
vec3 shadeLightSet(vec3 P, vec3 N, int mode) {
  if (mode == 2) return vec3(0.0);
  // Nothing directional to sweep for: skip the loop rather than fetch every
  // seat's type to discover that. (Mode 0 must still run — it is every light.)
  if (mode == 1 && uDirCount == 0) return vec3(0.0);
  vec3 d = vec3(0.0);
  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= uLightCount) break;
    if (mode == 1) {
      float lw = lightPosType(i).w;
      if (lw < 0.5 || lw >= 1.5) continue;   // not directional
    }
    d += lightContribution(i, P, N);
  }
  if (mode == 1) return d;
  // Emissive meshes as area lights (next-event estimation, one shadow ray).
  return d + sampleEmissiveTri(P, N);
}
// <<< RT_RESTIR_DIR_BYPASS
// <<< RT_RESTIR_COLD_FALLBACK

// ONE light sample for secondary path vertices: stochastically pick either the
// analytic lights or the emissive set (weighted 1/p). Costs a single shadow
// ray — same ray budget the GI bounce had before emissive NEE existed —
// instead of two; the estimator stays unbiased and temporal accumulation
// averages out the extra variance.
vec3 sampleOneAny(vec3 P, vec3 N, bool skipDir) {
  bool hasL = uLightCount > 0;
  bool hasE = uEmissiveCount > 0;
  if (hasL && hasE) {
    return rand() < 0.5
      ? sampleOneLight(P, N, skipDir) * 2.0
      : sampleEmissiveTri(P, N) * 2.0;
  }
  if (hasL) return sampleOneLight(P, N, skipDir);
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
  // GI/secondary vertices keep the sun: the bypass is about the PRIMARY
  // surface's reservoir, and a bounce has no reservoir to poison.
  vec3 Ld = sampleOneAny(hP + hN * uEps, hN, false);
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
    vec4 posType = lightPosType(i);
    vec4 colRad = lightColorRadius(i);
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
  // >>> RT_RESTIR_COLD_FALLBACK
  // A pixel the camera or a moving object has JUST revealed has no reservoir
  // history: 8 uniform candidates out of S (282 in the great hall), one
  // visibility ray on the RIS winner, and neighbouring cold pixels landing on
  // different winners. That is a bimodal estimate of a 26-light sum, and it is
  // the blotching the owner sees at wall tops, baluster gaps and stair nosings.
  // It converges in about a second of temporal accumulation; that second IS the
  // artefact. So a pixel younger than uRestirWarmAge frames pays the exact path
  // instead, and the reservoir keeps building underneath it, so by the time it
  // crosses the threshold it has age x 8 candidates of history behind it.
  // The reservoir tap carries that age in .b (RestirPass writes it in the
  // temporal stage, the spatial stage passes it through untouched).
  //
  // CALL-SITE BUDGET, and this one cost a black screen before it was written
  // down: the per-light loop (now shadeLightSet) may appear exactly ONCE in this
  // shader. The obvious shape — reservoir-warm / reservoir-cold / stochastic /
  // full, with the exact path in two of the four arms — compiles as GLSL and
  // then fails to LINK on ANGLE/GL with "error: too many temporaries". The
  // driver inlines the helper at every call site, and a second copy of the
  // per-light loop's live ranges puts this megakernel over the register file.
  // Same family as the three-site traceRadiance limit below. So the two exact
  // arms are merged into one else, and the directional-bypass sum is a MODE of
  // the same single call rather than a second loop.
  vec4 resTap = uRestirEnabled ? texture(uReservoir, vUv) : vec4(0.0);
  bool restirWarm = uRestirWarmAge <= 0.0 || resTap.b >= uRestirWarmAge;
  // >>> RT_RESTIR_DIR_BYPASS
  // The three estimators are unchanged; what is new is that the directional
  // lights are lifted out of whichever one runs and shaded exactly, once, in
  // the SAME single call site that serves the exact path. mode 0 already
  // includes them, so the exact arm adds nothing.
  bool useReservoir = uRestirEnabled && restirWarm;
  bool useStochastic = !uRestirEnabled && uLightStochastic;
  bool useExact = !useReservoir && !useStochastic;
  int lightMode = useExact ? 0 : (uDirBypass ? 1 : 2);
  vec3 direct = shadeLightSet(P, N, lightMode);
  if (useReservoir) {
    direct += shadeReservoir(P, N);
  } else if (useStochastic) {
    direct += sampleOneAny(P, N, uDirBypass);
  }
  // <<< RT_RESTIR_DIR_BYPASS
  // <<< RT_RESTIR_COLD_FALLBACK
// >>> RT_AMBIENT
  // Unoccluded ambient, added to the DIRECT term because that is the buffer the
  // composite multiplies by albedo — so this lands as albedo x ambient, which
  // is what three's own AmbientLight/HemisphereLight do on a Lambert surface.
  // No ray, no shadow, no loop, no new call site: three uniforms and a dot.
  //
  // It is what keeps gi:false (the 0.15.0 default) from rendering every surface
  // no light faces PURE BLACK. It is NOT global illumination and the docs do not
  // pretend otherwise: nothing occludes it, nothing carries colour between
  // surfaces, and a GI bounce does not pick it up (traceRadiance shades its hit
  // with direct light only, which keeps the three-call-site budget untouched).
  // Zero uniforms = zero contribution, exactly.
  direct += uAmbientFlat + mix(uHemiGround, uHemiSky, 0.5 * dot(N, uHemiUp) + 0.5);
// <<< RT_AMBIENT

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
`,Ty=`
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
`,_u=`
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
`;function Br(s,e){const t=s.split(`
`),i=[];let n=!1;for(const r of t){if(r.includes(">>> "+e)){n=!0;continue}if(r.includes("<<< "+e)){n=!1;continue}n||i.push(r)}return i.join(`
`)}class Ey{constructor(e,t,{specMRT:i=!0,maxLights:n=Os}={}){this.specMRT=i,this.maxLights=Ui(n),this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.specA=i?this._makeSpecTarget(e,t):null,this.specB=i?this._makeSpecTarget(e,t):null;const r=My.replace(/RT_MAX_LIGHTS_VALUE/g,String(this.maxLights)),a=i?r:r.replace("layout(location = 1) out vec4 outSpecular;","vec4 outSpecular; // single-target fallback: dead store");this._fragKm=a,this._fragAbsorbShadows=Br(a,"RT_KM"),this._fragAbsorption=Br(this._fragAbsorbShadows,"RT_ABSORB_SHADOWS"),this._fragPlain=Br(this._fragAbsorption,"RT_ABSORPTION"),this._absorbOn=!1,this._absorbShadows=!0,this._kmData=!1,this._kmOn=!1,this._tilesData=!1,this._tilesOn=!1,this.material=new st({name:"rt:lighting",glslVersion:vt,defines:{},vertexShader:ho,fragmentShader:this._fragPlain,uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uAttrStatic:{value:null},uAttrDynamic:{value:null},uMaterialsTex:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevAccum:{value:null},uPrevGWorldPos:{value:null},uReservoir:{value:null},uRestirEnabled:{value:!1},uRestirSamples:{value:1},uRestirTapRadius:{value:10},uRestirWarmAge:{value:0},uRestirClampRel:{value:0},uDirBypass:{value:!1},uPrevViewProj:{value:new he},uViewProj:{value:new he},uCameraPos:{value:new P},uMaxHistory:{value:128},uTemporalReprojection:{value:!0},uRawOutput:{value:!1},uFireflyClamp:{value:4},uGlassClampScale:{value:4},uLightRow:{value:0},uLightCount:{value:0},uDirCount:{value:0},uEmissiveCount:{value:0},uEmissiveCDF:{value:!0},uReflEnabled:{value:!0},uRefrEnabled:{value:!0},uBlendEnabled:{value:!0},uIor:{value:1.5},uDispersion:{value:0},uLightStochastic:{value:!1},uGIHalfRate:{value:!1},uAmbientFlat:{value:new ue(0,0,0)},uHemiSky:{value:new ue(0,0,0)},uHemiGround:{value:new ue(0,0,0)},uHemiUp:{value:new P(0,1,0)},uEnvColor:{value:new ue(.03,.04,.06)},uEnvIntensity:{value:1},uFrame:{value:0},uEps:{value:.001},uGIEnabled:{value:!0},uExternalGI:{value:!1},uHasTextureTiles:{value:!1},uCostView:{value:!1},uCostScale:{value:1/96},uSkyEnabled:{value:!1},uSunDir:{value:new P(.4,.8,.45).normalize()},uSunColor:{value:new ue(1,.9,.75)},uSkyZenith:{value:new ue(.18,.34,.62)},uSkyHorizon:{value:new ue(.7,.8,.9)},uSkyIntensity:{value:1},uVolumeTex:{value:null},uVolumeOrigin:{value:new P},uVolumeSize:{value:new P(1,1,1)},uVolumeMatIndex:{value:-1}},depthTest:!1,depthWrite:!1}),this.specMaterial=new st({name:"rt:specular",glslVersion:vt,vertexShader:ho,fragmentShader:Ty,uniforms:{uFreshSpec:{value:null},uPrevSpec:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevGWorldPos:{value:null},uPrevViewProj:{value:new he},uViewProj:{value:new he},uCameraPos:{value:new P},uEps:{value:.001},uMaxHistory:{value:128},uTemporalReprojection:{value:!0}},depthTest:!1,depthWrite:!1}),this.carryMaterial=new st({name:"rt:history-carry",glslVersion:vt,vertexShader:ho,fragmentShader:i?_u:_u.replace("layout(location = 1) out vec4 o1;","vec4 o1; // single-target fallback: dead store"),uniforms:{uTex:{value:null},uCountClamp:{value:-1}},depthTest:!1,depthWrite:!1}),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i={minFilter:Ke,magFilter:Ke,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1};if(!this.specMRT){const r=new xt(e,t,i);return r.texture.generateMipmaps=!1,r}const n=Ji(e,t,2,i);for(const r of n.texture)r.generateMipmaps=!1;return n}_irrTex(e){return this.specMRT?e.texture[0]:e.texture}_makeSpecTarget(e,t){const i=new xt(e,t,{minFilter:Ke,magFilter:Ke,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}clearHistory(e){const t=e.getRenderTarget(),i=new ue;e.getClearColor(i);const n=e.getClearAlpha();e.setClearColor(0,0);for(const r of[this.targetA,this.targetB,this.specA,this.specB])r&&(e.setRenderTarget(r),e.clear(!0,!1,!1));e.setRenderTarget(t),e.setClearColor(i,n)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.specA&&this.specA.setSize(e,t),this.specB&&this.specB.setSize(e,t)}resizeCarry(e,t,i,n,r){const a=this._makeTarget(i,n),o=this._makeTarget(i,n);this.carryMaterial.uniforms.uTex.value=this._irrTex(this.targetB),this.carryMaterial.uniforms.uCountClamp.value=r,this.quad.material=this.carryMaterial;const l=e.getRenderTarget();if(e.setRenderTarget(o),e.render(this.scene,this.camera),e.setRenderTarget(l),this.quad.material=this.material,this.targetA.dispose(),this.targetB.dispose(),this.targetA=a,this.targetB=o,this.specMRT){const c=this._makeSpecTarget(i,n),u=this._makeSpecTarget(i,n);t.blit(e,this.specB.texture,u,r),this.specA.dispose(),this.specB.dispose(),this.specA=c,this.specB=u}}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uAttrStatic.value=e.staticAttrTex,t.uAttrDynamic.value=e.dynamicAttrTex,t.uMaterialsTex.value=e.materialsTex,t.uLightRow.value=e.lightRow,t.uLightCount.value=e.lightCount,t.uDirCount.value=e.directionalCount||0,t.uEmissiveCount.value=e.emissiveTriCount,e.maxLights>this.maxLights&&console.warn(`three-realtime-rt: the compiled scene allows ${e.maxLights} lights but this renderer was constructed with maxLights: ${this.maxLights}; seats past ${this.maxLights} will not be shaded. Pass the same maxLights to the constructor and compileScene().`),this._kmData=!!e.scattering,this._tilesData=!!e.hasTextureTiles,this._tileSize=e._tileSize||128,this.setAbsorption(!!e.absorption)}setTextureTiles(e){this._tilesOn=!!e,this._applyAbsorptionSplice()}setAbsorption(e){this._absorbOn=!!e,this._applyAbsorptionSplice()}setAbsorptionShadows(e){this._absorbShadows=!!e,this._applyAbsorptionSplice()}setKmScattering(e){this._kmOn=!!e,this._applyAbsorptionSplice()}_applyAbsorptionSplice(){let e=this._absorbOn?this._kmOn&&this._kmData?this._fragKm:this._absorbShadows?this._fragAbsorbShadows:this._fragAbsorption:this._fragPlain;this._tilesOn&&this._tilesData?this._tileSize!==128&&(e=e.replace("#define TILE 128.0",`#define TILE ${this._tileSize}.0`)):e=Br(e,"RT_TEXTURE_TILES"),this.material.uniforms.uHasTextureTiles.value=!!(this._tilesOn&&this._tilesData),this.material.fragmentShader!==e&&(this.material.fragmentShader=e,this.material.needsUpdate=!0)}setVolumeAlbedo(e){const t=this.material.defines.RT_VOLUME_ALBEDO!==void 0,i=!!e,n=this.material.uniforms;i?(n.uVolumeTex.value=e.texture,n.uVolumeOrigin.value.copy(e.origin),n.uVolumeSize.value.copy(e.size),n.uVolumeMatIndex.value=e.matIndex):(n.uVolumeTex.value=null,n.uVolumeMatIndex.value=-1),i!==t&&(i?this.material.defines.RT_VOLUME_ALBEDO="1":delete this.material.defines.RT_VOLUME_ALBEDO,this.material.needsUpdate=!0)}renderRaw(e,t,i,n=null){const r=this.material.uniforms;return r.uRawOutput.value=!0,r.uGWorldPos.value=t.worldPos,r.uGNormalMetal.value=t.normalMetal,r.uPrevGWorldPos.value=t.prevWorldPos,r.uPrevAccum.value=this._irrTex(this.targetB),r.uReservoir.value=n,r.uRestirEnabled.value=n!==null,r.uFrame.value=i,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null),r.uRawOutput.value=!1,this.specMRT?{rawIrradiance:this.targetA.texture[0],rawSpecular:this.targetA.texture[1]}:{rawIrradiance:this.targetA.texture,rawSpecular:null}}render(e,t,i,n=null){const r=this.material.uniforms;r.uGWorldPos.value=t.worldPos,r.uGNormalMetal.value=t.normalMetal,r.uPrevGWorldPos.value=t.prevWorldPos,r.uPrevAccum.value=this._irrTex(this.targetB),r.uReservoir.value=n,r.uRestirEnabled.value=n!==null,r.uFrame.value=i,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera);let a=null;if(this.specMRT){const l=this.specMaterial.uniforms;l.uFreshSpec.value=this.targetA.texture[1],l.uPrevSpec.value=this.specB.texture,l.uGWorldPos.value=t.worldPos,l.uGNormalMetal.value=t.normalMetal,l.uPrevGWorldPos.value=t.prevWorldPos,l.uPrevViewProj.value.copy(r.uPrevViewProj.value),l.uViewProj.value.copy(r.uViewProj.value),l.uCameraPos.value.copy(r.uCameraPos.value),l.uEps.value=r.uEps.value,l.uMaxHistory.value=r.uMaxHistory.value,l.uTemporalReprojection.value=r.uTemporalReprojection.value,this.quad.material=this.specMaterial,e.setRenderTarget(this.specA),e.render(this.scene,this.camera),a=this.specA.texture}this.quad.material=this.material,e.setRenderTarget(null);const o=this._irrTex(this.targetA);return[this.targetA,this.targetB]=[this.targetB,this.targetA],this.specMRT&&([this.specA,this.specB]=[this.specB,this.specA]),{irradiance:o,specular:a}}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.specA&&this.specA.dispose(),this.specB&&this.specB.dispose(),this.material.dispose(),this.specMaterial.dispose(),this.carryMaterial.dispose(),this.quad.geometry.dispose()}}const Ay=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Ry=`
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
`;class yu{constructor(e,t,{blendIsSpec:i=!1}={}){this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.material=new st({name:"rt:denoise",glslVersion:vt,vertexShader:Ay,fragmentShader:Ry,uniforms:{uIrradiance:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uTexelSize:{value:new le},uStep:{value:1},uStepJit:{value:0},uPassWeight:{value:1},uCameraPos:{value:new P},uEps:{value:.001},uLumSigma:{value:.25},uBlendIsSpec:{value:i},uAddTex:{value:null},uHasAdd:{value:!1},uVarTex:{value:null},uHasVar:{value:!1}},depthTest:!1,depthWrite:!1}),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad),this._width=e,this._height=t}_makeTarget(e,t){const i=new xt(e,t,{minFilter:Ke,magFilter:Ke,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setSize(e,t){this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,i,n,r,a=3,o=null,l={}){const c=this.material.uniforms;c.uGWorldPos.value=i.worldPos,c.uGNormalMetal.value=i.normalMetal,c.uTexelSize.value.set(1/this._width,1/this._height),c.uCameraPos.value.copy(n),c.uEps.value=r,c.uAddTex.value=o;const u=l.momentsTexture||null;u?(c.uVarTex.value=u,c.uHasVar.value=!0):c.uHasVar.value=!1;const h=l.maxStep>0?l.maxStep:0,d=l.stepJitter>0?Math.min(1,l.stepJitter):0,f=l.wideDamp>0?Math.min(1,l.wideDamp):0,v=l.frame??0;let _=t,m=this.targetA;for(let p=0;p<a;p++){c.uIrradiance.value=_;const y=h>0?Math.min(1<<p,h):1<<p;if(c.uStep.value=y,d>0&&y>1){const g=v*7+p;c.uStepJit.value=(g*.7548776662466927%1-.5)*y*d}else c.uStepJit.value=0;c.uPassWeight.value=f>0&&y>4?1-f*(1-Math.sqrt(4/y)):1,c.uHasAdd.value=o!==null&&p===0,e.setRenderTarget(m),e.render(this.scene,this.camera),_=m.texture,m=m===this.targetA?this.targetB:this.targetA}return e.setRenderTarget(null),_}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const Py=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Cy=`
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
uniform sampler2D uGMotion;      // G-buffer motion vector (RG32F)
uniform float uUseMotion;        // 1 = reproject via motion vector, 0 = camera-only
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

  // Motion vector (uUseMotion) vs camera-only reprojection (uPrevViewProj * P).
  // Both produce prevUv; the bilinear block below is shared. The G-buffer stores
  // the surface's PREVIOUS screen UV (see GBufferPass), so this pass applies the
  // exact same jitter correction as the camera-only path — prevRaw - (cu - vUv)
  // is bit-identical to pu -= (cu - vUv) when prevRaw === pu (static geometry).
  // The stored sentinel (out-of-bounds for surfaces behind last frame's camera)
  // is dropped by the bounds test below. prevUv = -1 is the camera-only path's
  // "no valid history" marker.
  vec2 prevUv = vec2(-1.0);
  if (uUseMotion > 0.5) {
    vec2 prevRaw = texelFetch(uGMotion, gbPx, 0).xy;
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clipC.w > 0.0) {
      vec2 cu = (clipC.xy / clipC.w) * 0.5 + 0.5;
      prevUv = prevRaw - (cu - vUv);
    }
  } else {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clip.w > 0.0 && clipC.w > 0.0) {
      vec2 pu = (clip.xy / clip.w) * 0.5 + 0.5;
      vec2 cu = (clipC.xy / clipC.w) * 0.5 + 0.5;
      pu -= cu - vUv;
      prevUv = pu;
    }
  }
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
`;class Ly{constructor(e,t){this._width=e,this._height=t,this.targetA=Ji(e,t,3,{minFilter:ze,magFilter:ze,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1}),this.targetB=Ji(e,t,3,{minFilter:ze,magFilter:ze,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1}),this.material=new st({name:"rt:accumulate",glslVersion:vt,vertexShader:Py,fragmentShader:Cy,uniforms:{uRawIrradiance:{value:null},uRawSpecular:{value:null},uPrevIrradiance:{value:null},uPrevSpecular:{value:null},uPrevMoments:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevGWorldPos:{value:null},uPrevViewProj:{value:new he},uViewProj:{value:new he},uMaxHistory:{value:48},uPreFireflyClamp:{value:0},uLightMotion:{value:0},uGradK:{value:3},uHistoryClampK:{value:0},uCameraPos:{value:new P},uEps:{value:.001},uTexSize:{value:new le(e,t)},uGbSize:{value:new le},uGMotion:{value:null},uUseMotion:{value:0}},depthTest:!1,depthWrite:!1}),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}setMotionVectors(e){this.material.uniforms.uUseMotion.value=e?1:0}setSize(e,t){this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.material.uniforms.uTexSize.value.set(e,t),this._needsClear=!0}render(e,t,i,n,r,a,o,l,c,u={}){this._needsClear&&(this._needsClear=!1,this.clearHistory(e));const h=this.material.uniforms;h.uRawIrradiance.value=t,h.uRawSpecular.value=i,h.uPrevIrradiance.value=this.targetB.texture[0],h.uPrevSpecular.value=this.targetB.texture[1],h.uPrevMoments.value=this.targetB.texture[2],h.uGWorldPos.value=n.worldPos,h.uGNormalMetal.value=n.normalMetal,h.uPrevGWorldPos.value=n.prevWorldPos,h.uGMotion.value=n.motion,h.uPrevViewProj.value.copy(r),h.uViewProj.value.copy(a),h.uMaxHistory.value=c,h.uPreFireflyClamp.value=u.preFireflyClamp??0,h.uLightMotion.value=u.lightMotion??0,h.uGradK.value=u.gradK??3,h.uHistoryClampK.value=u.historyClampK??0,h.uCameraPos.value.copy(o),h.uEps.value=l;const d=n.worldPos.image||{};h.uGbSize.value.set(d.width||this._width*2,d.height||this._height*2),e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const f=this.targetA.texture[0],v=this.targetA.texture[1],_=this.targetA.texture[2];return[this.targetA,this.targetB]=[this.targetB,this.targetA],{irradiance:f,specular:v,moments:_}}clearHistory(e){const t=e.getClearColor(new ue),i=e.getClearAlpha();e.setClearColor(0,0);for(const n of[this.targetA,this.targetB])e.setRenderTarget(n),e.clearColor();e.setRenderTarget(null),e.setClearColor(t,i)}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const Iy=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Dy=`
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

${$o}

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

// Debug (RealtimeRaytracer.rawInputView): point-sample the lighting textures at
// their own texel centres instead of filtering them, so a lighting-res pixel of
// 1-spp noise reaches the screen as a square. Default false, and the branch is
// only reachable when the renderer sets it, so every normal frame takes exactly
// the path it took before this uniform existed.
uniform bool uNearestLighting;

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
  if (uNearestLighting) {
    return texture(tex, (floor(uv / uIrrTexelSize) + 0.5) * uIrrTexelSize).rgb;
  }
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
`;class Ny{constructor(){this.material=new st({name:"rt:composite",glslVersion:vt,vertexShader:Iy,fragmentShader:Dy,uniforms:{uIrradiance:{value:null},uSpecular:{value:null},uSpecEnabled:{value:!1},uGAlbedoRough:{value:null},uGNormalMetal:{value:null},uGWorldPos:{value:null},uGEmissive:{value:null},uVolumetric:{value:null},uVolTexelSize:{value:new le},uVolEnabled:{value:!1},uBackgroundColor:{value:new ue(.01,.012,.02)},uOutputMode:{value:0},uUpsample:{value:!1},uIrrTexelSize:{value:new le},uCameraPos:{value:new P},uNearestLighting:{value:!1},uCrop:{value:new qe(1,1,0,0)},uFogEnabled:{value:!1},uFogColor:{value:new ue(.5,.6,.7)},uFogDensity:{value:.05},uSkyEnabled:{value:!1},uInvViewProj:{value:new he},uSunDir:{value:new P(.4,.8,.45).normalize()},uSunColor:{value:new ue(1,.9,.75)},uSkyZenith:{value:new ue(.18,.34,.62)},uSkyHorizon:{value:new ue(.7,.8,.9)},uSkyIntensity:{value:1}},depthTest:!1,depthWrite:!1}),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}render(e,t,i,n,r=null,a=null,o=null){const l=this.material.uniforms;l.uIrradiance.value=t,l.uSpecular.value=a,l.uSpecEnabled.value=a!==null,l.uGAlbedoRough.value=i.albedoRough,l.uGNormalMetal.value=i.normalMetal,l.uGWorldPos.value=i.worldPos,l.uGEmissive.value=i.emissive,o?l.uCrop.value.copy(o):l.uCrop.value.set(1,1,0,0),n&&n.isColor&&l.uBackgroundColor.value.copy(n),e.setRenderTarget(r),e.render(this.scene,this.camera)}dispose(){this.material.dispose(),this.quad.geometry.dispose()}}const xu=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Uy=`
precision highp float;

layout(location = 0) out vec4 outColor;

in vec2 vUv;

uniform sampler2D uCurrent;        // this frame's composited LDR colour
uniform sampler2D uHistory;        // previous resolved colour
uniform sampler2D uGWorldPos;      // current full-res G-buffer
uniform sampler2D uGMotion;        // G-buffer previous-screen-UV texture (RG32F)
uniform float uUseMotion;          // 1 = reproject via motion vector, 0 = camera-only
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
  // the projected position before sampling it. With motion vectors (uUseMotion)
  // the surface's own screen motion replaces the camera-only reprojection: the
  // G-buffer stores the surface's PREVIOUS screen UV directly, so prevUv is that
  // minus last frame's jitter — bit-identical to the camera-only path for static
  // geometry. The stored sentinel (behind last frame's camera) lands out of
  // bounds and is dropped below.
  vec2 prevUv;
  if (uUseMotion > 0.5) {
    prevUv = texture(uGMotion, vUv + uJitter).xy - uPrevJitter;
  } else {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    if (clip.w <= 0.0) { outColor = vec4(current, 1.0); return; }
    prevUv = (clip.xy / clip.w) * 0.5 + 0.5 - uPrevJitter;
  }
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
`,Fy=`
precision highp float;
layout(location = 0) out vec4 outColor;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec4 uCrop;
void main() { outColor = vec4(texture(uTex, vUv * uCrop.xy + uCrop.zw).rgb, 1.0); }
`;class By{constructor(e,t){this._width=e,this._height=t,this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this._reset=!0,this.material=new st({name:"rt:taa",glslVersion:vt,vertexShader:xu,fragmentShader:Uy,uniforms:{uCurrent:{value:null},uHistory:{value:null},uGWorldPos:{value:null},uGMotion:{value:null},uUseMotion:{value:0},uPrevViewProj:{value:new he},uTexelSize:{value:new le(1/e,1/t)},uJitter:{value:new le},uPrevJitter:{value:new le},uBlend:{value:.1},uReset:{value:!0}},depthTest:!1,depthWrite:!1}),this.copyMaterial=new st({name:"rt:taa-copy",glslVersion:vt,vertexShader:xu,fragmentShader:Fy,uniforms:{uTex:{value:null},uCrop:{value:new qe(1,1,0,0)}},depthTest:!1,depthWrite:!1}),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=new xt(e,t,{minFilter:Ke,magFilter:Ke,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setSize(e,t){e===this._width&&t===this._height||(this._width=e,this._height=t,this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.material.uniforms.uTexelSize.value.set(1/e,1/t),this._reset=!0)}resizeCarry(e,t,i,n){if(i===this._width&&n===this._height)return;this._width=i,this._height=n;const r=this._makeTarget(i,n),a=this._makeTarget(i,n);t.blit(e,this.targetB.texture,a,-1),this.targetA.dispose(),this.targetB.dispose(),this.targetA=r,this.targetB=a,this.material.uniforms.uTexelSize.value.set(1/i,1/n)}reset(){this._reset=!0}setMotionVectors(e){this.material.uniforms.uUseMotion.value=e?1:0}render(e,t,i,n,r,a,o,l=null,c=null){const u=this.material.uniforms;u.uCurrent.value=t,u.uHistory.value=this.targetB.texture,u.uGWorldPos.value=i.worldPos,u.uGMotion.value=i.motion,u.uPrevViewProj.value.copy(n),u.uJitter.value.copy(r),u.uPrevJitter.value.copy(a),u.uBlend.value=o,u.uReset.value=this._reset,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),this.quad.material=this.copyMaterial,this.copyMaterial.uniforms.uTex.value=this.targetA.texture,c?this.copyMaterial.uniforms.uCrop.value.copy(c):this.copyMaterial.uniforms.uCrop.value.set(1,1,0,0),e.setRenderTarget(l),e.render(this.scene,this.camera),[this.targetA,this.targetB]=[this.targetB,this.targetA],this._reset=!1}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.copyMaterial.dispose(),this.quad.geometry.dispose()}}const bu=8,Oy=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,ky=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${Jo}
${Qo}
${el}

#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE
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

// THE LIGHT TABLE lives in one row of uMaterialsTex (row = uLightRow), 4 texels
// per seat: see SceneCompiler's layout comment. Until 0.16.0 these were three
// vec4[MAX_LIGHTS] uniform arrays, which is what capped a scene at 32 lights.
uniform int uLightRow;
vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); } // spot: direction.xyz + cos(outer)
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

// Slab test of the camera ray segment [0, segLen] against every zone AABB.
// True iff some t in [0, segLen] lies inside at least one zone. Used by the
// cull below: when only zones scatter (uDensity <= 0), a ray that touches none
// of them contributes exactly zero to the march, so the whole loop is skipped.
// Each box is fattened by uEps so a ray that grazes a zone face is never culled:
// a false NEGATIVE would change the image, while a false positive only wastes a
// march whose in-scatter product is zero anyway (the image stays bit-identical).
bool rayHitsAnyZone(vec3 ro, vec3 rd, float segLen) {
  for (int i = 0; i < MAX_FOG_ZONES; i++) {
    if (i >= uFogZoneCount) break;
    vec3 mn = uFogZones[i * 2].xyz - uEps;
    vec3 mx = uFogZones[i * 2 + 1].xyz + uEps;
    float t0 = 0.0, t1 = segLen;
    if (rd.x != 0.0) {
      float ta = (mn.x - ro.x) / rd.x;
      float tb = (mx.x - ro.x) / rd.x;
      t0 = max(t0, min(ta, tb));
      t1 = min(t1, max(ta, tb));
    } else if (ro.x < mn.x || ro.x > mx.x) { continue; }
    if (rd.y != 0.0) {
      float ta = (mn.y - ro.y) / rd.y;
      float tb = (mx.y - ro.y) / rd.y;
      t0 = max(t0, min(ta, tb));
      t1 = min(t1, max(ta, tb));
    } else if (ro.y < mn.y || ro.y > mx.y) { continue; }
    if (rd.z != 0.0) {
      float ta = (mn.z - ro.z) / rd.z;
      float tb = (mx.z - ro.z) / rd.z;
      t0 = max(t0, min(ta, tb));
      t1 = min(t1, max(ta, tb));
    } else if (ro.z < mn.z || ro.z > mx.z) { continue; }
    if (t0 <= t1) return true;
  }
  return false;
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

// Local scatter coefficient at the current march step (0 outside every zone
// when uDensity <= 0). lightAt/emissiveAt skip their BVH shadow ray when it is
// zero - the in-scatter product is zero there anyway - while STILL drawing the
// same RNG values, so the per-pixel random stream never shifts and the image
// stays byte-identical to the un-culled pass. The skip is a nested if (not an
// AND) so the traversal is provably not evaluated when gScatter is zero on
// every GLSL backend, not just ones that guarantee short-circuit evaluation.
float gScatter;

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
  vec4 posType = lightPosType(i);
  vec4 colRad = lightColorRadius(i);
  if (posType.w < 0.5 || posType.w >= 1.5) {
    vec3 lp = posType.xyz + randUnitVector() * colRad.w;
    vec3 d = lp - S;
    float dist = length(d);
    if (dist < 1e-4) return vec3(0.0);
    float cone = 1.0;
    if (posType.w >= 1.5) {
      // spot: this is what draws visible light CONES in fog
      vec4 dc = lightDirCone(i);
      cone = smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, -d / dist));
      if (cone <= 0.0) return vec3(0.0);
    }
    if (gScatter > 0.0) {
      if (occluded(S, d / dist, dist)) return vec3(0.0);
    }
    return colRad.rgb * (cone / (dist * dist));
  }
  vec3 L = normalize(-posType.xyz + randUnitVector() * colRad.w);
  if (gScatter > 0.0) {
    if (occluded(S, L, 1e7)) return vec3(0.0);
  }
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
  if (gScatter > 0.0) {
    if (occluded(S, wi, dist)) return vec3(0.0);
  }
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
    // Zone cull (0.16.2 prep; measured on an RTX 3060 in the Hangar gallery,
    // dev/gpu-floor wave 3G): with density 0 + one localized shaft zone this
    // pass was 20.7 ms at canvas 1.0, flat in renderScale, because every
    // quarter-canvas pixel paid VOL_STEPS BVH shadow rays for a product that
    // was exactly zero outside the zone. So when only zones scatter, slab-test
    // the ray segment against every zone AABB first: a ray that touches none
    // of them contributes zero to sample_, and the whole march is skipped.
    // The temporal blend below still runs, so history decays identically.
    bool march = uDensity > 0.0 || rayHitsAnyZone(uCameraPos, rd, segLen);
    if (march) {
      // Piecewise integration: density can vary along the ray (zones), so the
      // transmittance is built up step by step from the LOCAL density at each
      // sample rather than a single closed-form exp(-uDensity * t).
      float opticalDepth = 0.0;
      for (int k = 0; k < VOL_STEPS; k++) {
        float t = (float(k) + rand()) * segStep; // ascending strata
        vec3 S = uCameraPos + rd * t;
        float local = fogDensityAt(S);
        gScatter = local;   // gates the shadow rays below; 0 outside fog/zones
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
`;class zy{constructor(e,t,{maxLights:i=Os}={}){this.maxLights=Ui(i),this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t),this.material=new st({name:"rt:volumetric",glslVersion:vt,vertexShader:Oy,fragmentShader:ky.replace(/RT_MAX_LIGHTS_VALUE/g,String(this.maxLights)),uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uMaterialsTex:{value:null},uGWorldPos:{value:null},uPrevAccum:{value:null},uPrevViewProj:{value:new he},uMaxHistory:{value:48},uLightRow:{value:0},uLightCount:{value:0},uEmissiveCount:{value:0},uCameraPos:{value:new P},uFrame:{value:0},uEps:{value:.001},uDensity:{value:.03},uMaxDist:{value:40},uFogZones:{value:new Array(bu*2).fill(0).map(()=>new qe)},uFogZoneCount:{value:0}},depthTest:!1,depthWrite:!1}),this._zoneVecs=this.material.uniforms.uFogZones.value,this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=new xt(e,t,{minFilter:Ke,magFilter:Ke,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uMaterialsTex.value=e.materialsTex,t.uLightRow.value=e.lightRow,t.uLightCount.value=e.lightCount,t.uEmissiveCount.value=e.emissiveTriCount}clearHistory(e){const t=e.getRenderTarget();e.setClearColor(0,0);for(const i of[this.targetA,this.targetB])e.setRenderTarget(i),e.clear(!0,!1,!1);e.setRenderTarget(t)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,i,n,r,a,o,l,c){const u=this.material.uniforms;u.uGWorldPos.value=t.worldPos,u.uPrevAccum.value=this.targetB.texture,u.uPrevViewProj.value.copy(i),u.uCameraPos.value.copy(n),u.uFrame.value=r,u.uEps.value=a,u.uDensity.value=o,u.uMaxDist.value=l;const h=c&&c.length?Math.min(c.length,bu):0;for(let f=0;f<h;f++){const v=c[f];this._zoneVecs[f*2].set(v.min[0],v.min[1],v.min[2],v.density),this._zoneVecs[f*2+1].set(v.max[0],v.max[1],v.max[2],0)}u.uFogZoneCount.value=h,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const d=this.targetA;return[this.targetA,this.targetB]=[this.targetB,this.targetA],d.texture}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const Gy=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Rh=`
#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE
#define PI 3.14159265358979

uniform sampler2D uGWorldPos;
uniform sampler2D uGNormalMetal;
uniform sampler2D uMaterialsTex;  // row 1: emissive tris, rows 2..65: blue noise,
                                  // row 66: the emissive POWER CDF (.x cumulative,
                                  // .y the triangle's pick probability),
                                  // row uLightRow: the analytic light table
// THE LIGHT TABLE, 4 texels per seat in one row of uMaterialsTex (see
// SceneCompiler). Three vec4[MAX_LIGHTS] uniform arrays until 0.16.0; the
// values are the same float32s, so candidateContribution's arithmetic is
// unchanged to the bit.
uniform int uLightRow;
vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); } // spot: direction.xyz + cos(outer)
uniform int uLightCount;
uniform int uEmissiveCount;
uniform float uFrame;
uniform vec3 uCameraPos;
uniform float uEps;
// >>> RT_RESTIR_DIR_BYPASS
// Keep DIRECTIONAL lights out of the reservoir entirely (1 = out, 0 = the
// shipped behaviour). A directional light has a large UNSHADOWED contribution
// on every surface facing it and is occluded on most interior ones, so its
// target score wins the RIS draw again and again, the pixel's one visibility
// ray hits the wall, and the pixel renders black with the odd frame's other
// winner as a bright speck. The lighting pass shades directional lights
// exactly instead (RTLightingPass, uDirBypass), so this is not "the sun is
// dropped", it is "the sun is not gambled on".
//
// Zeroing the CONTRIBUTION rather than skipping the pick is deliberate: it
// zeroes the candidate's weight AND its p̂ as an inherited history or
// neighbour winner, so a directional light already sitting in a reservoir
// loses on weight next frame instead of surviving. A wasted uniform pick keeps
// RIS unbiased (the source pdf is unchanged, the target simply excludes those
// lights); one directional light in 16-29 wastes 3-6% of candidates. Skipping
// them at pick time needs a reordered light table and belongs to the port.
uniform float uDirBypass;
// <<< RT_RESTIR_DIR_BYPASS

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
    vec4 posType = lightPosType(i);
    vec4 colRad = lightColorRadius(i);
    if (posType.w < 0.5 || posType.w >= 1.5) {
      vec3 d = posType.xyz - P; // light CENTER: soft-radius jitter re-drawn at shading
      float dl = length(d);
      if (dl < 1e-5) return vec3(0.0);
      float NdotL = dot(N, d / dl);
      if (NdotL <= 0.0) return vec3(0.0);
      float cone = 1.0;
      if (posType.w >= 1.5) {
        // spot cone — MUST match RTLightingPass.spotFalloff for a consistent estimator
        vec4 dc = lightDirCone(i);
        cone = smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, -d / dl));
        if (cone <= 0.0) return vec3(0.0);
      }
      return colRad.rgb * (cone * NdotL / (dl * dl)) * (1.0 + restirSpecBoost(N, d / dl, P));
    }
    // >>> RT_RESTIR_DIR_BYPASS
    // Directional light. Zero contribution => zero weight => never selected,
    // and any history/neighbour reservoir still holding one is re-scored to
    // zero here and loses. RTLightingPass adds these lights exactly.
    if (uDirBypass > 0.5) return vec3(0.0);
    // <<< RT_RESTIR_DIR_BYPASS
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
`,Su=`
precision highp float;

${Rh}

#define CANDIDATES 8
// Lower-bound search steps over a light CDF row: ceil(log2(maxLights)), baked in
// at construction (7 at the default 128 seats, 5 at 32).
#define LIGHT_CDF_STEPS RT_CDF_STEPS_VALUE

layout(location = 0) out vec4 outReservoir;
layout(location = 1) out vec4 outHistory;

in vec2 vUv;

uniform sampler2D uPrevReservoir;
uniform sampler2D uPrevGWorldPos;
uniform mat4 uPrevViewProj;
// Temporal staleness cap (was the literal 40.0). 40 = the shipped behaviour;
// lowering it makes the reservoir shed its history faster, which is the lever
// for post-motion ghosting — the reservoir is the pipeline's SECOND temporal
// accumulator (after the irradiance EMA) and measurably the slower one.
uniform float uMCap;
// Dynamic-mesh treatments (both default off). uGDynamic is the G-buffer's
// emissive target: its .a is -1.0 on dynamic-mesh pixels, else 1.0 (or the
// blend opacity, which is never negative).
uniform sampler2D uGDynamic;
uniform float uAcceptDynamic; // change 1: skip the plane test on dynamic pixels
uniform float uFreezeDynamic; // change 2: pass the prev reservoir through on dynamic pixels
uniform sampler2D uGMotion;   // G-buffer previous-screen-UV texture (RG32F)
uniform float uUseMotion;     // 1 = reproject via motion vector, 0 = camera-only
// >>> RT_RESTIR_REPROJ
// THIS frame's view-projection, for the sub-texel jitter correction below.
// AccumulatePass has carried one for the same reason since motion vectors
// landed; the reservoir never did, which is half of why its history dies on
// thin geometry.
uniform mat4 uViewProj;
// Neighbourhood rescue (1 = on). When the plane test at the reprojected texel
// fails, try the four axis neighbours before declaring the history dead.
uniform float uReprojRescue;
uniform vec2 uTexelSizeT;     // 1 / reservoir resolution
// <<< RT_RESTIR_REPROJ
// >>> RT_RESTIR_CAND_CDF
// CANDIDATES DRAWN THE WAY NEE DRAWS THEM (1 = on, 0 = the shipped uniform pick,
// byte for byte). Stock streams its 8 candidates UNIFORMLY out of S = lights +
// emissive triangles, so in the great hall a bulb triangle is a 1-in-282 pick and
// most picks are shade / TV / candle triangles that contribute nothing to this
// pixel: a cold reservoir holds 8 near-useless candidates. The exact path has
// never had that problem: sampleEmissiveTri importance-samples the emissive set
// through the power CDF on row 66, so this makes the reservoir draw from the
// same distribution: pick the POOL by power, then the member by its own CDF.
//
// RIS stays unbiased for ANY source pdf whose support covers the target's, and
// this one does: every candidate the uniform pick could produce still has
// non-zero probability, except directional lights when uDirBypass is on, which
// score p_hat = 0 anyway (candidateContribution returns zero for them). Those two
// facts are wired to the same switch on purpose. See RestirPass._rebuildPools,
// which zeroes exactly the lights candidateContribution zeroes.
uniform float uCandidateCDF;
// P(draw from the analytic-light pool) = PL / (PL + PE), clamped to [0.1, 0.9]
// when both pools carry power, 1 or 0 when only one does. Computed CPU-side.
// GLOBAL on purpose: the grid below localises WHICH light is drawn, not how
// often the light pool is drawn from at all.
uniform float uPoolSplit;
// >>> RT_LIGHT_GRID
// THE LIGHT GRID (0.16.0). Per-light pick probabilities, one texture ROW per
// cell of a uniform grid over the static world, plus row 0 = the GLOBAL
// distribution (power only, no geometry). Texel i of a row is
// (cdf_i, p_i, w_i, 0) — the same (.x cumulative, .y probability) layout as
// row 66 and as the vec2[MAX_LIGHTS] uniform array this replaces, so the search
// below is the same search.
//
// WHY: candidates used to be drawn from the global power CDF, which is fine at
// eight lights and useless at eighty — in a hotel corridor a pixel's own room
// holds 3 of 96 lights, so ~1 candidate in 32 could possibly light it and the
// reservoir spends its stream on lights behind walls. The grid weights each
// light by what it could deliver to THIS cell (see LightGridPass for the
// weight), so a pixel's candidates come from its own room. RIS stays unbiased:
// every light with a non-zero p̂ keeps a non-zero probability (the build floors
// every active light at 1e-4 of the cell's maximum), and the estimator divides
// by whatever pdf produced the sample.
uniform sampler2D uLightGrid;
uniform vec3 uGridOrigin;    // world position of cell (0,0,0)'s corner
uniform vec3 uGridInvCell;   // 1 / cell size, per axis
uniform ivec3 uGridDims;     // cells per axis
uniform float uUseLightGrid; // 0 = always row 0 (the 0.15.0 global CDF)

// Row of uLightGrid this surface point draws its candidates from. 0 = global:
// the grid is off, the scene has none, or the point is outside the static AABB
// (a dynamic mesh that flew out of the building still gets a valid pdf).
int lightGridRow(vec3 P) {
  if (uUseLightGrid < 0.5) return 0;
  vec3 f = (P - uGridOrigin) * uGridInvCell;
  ivec3 c = ivec3(floor(f));
  if (any(lessThan(c, ivec3(0))) || any(greaterThanEqual(c, uGridDims))) return 0;
  return 1 + c.x + uGridDims.x * (c.y + uGridDims.y * c.z);
}
// <<< RT_LIGHT_GRID
// Mirrors RTLightingPass.uEmissiveCDF: when the game switches emissive
// importance sampling off, the reservoir's emissive picks go uniform too, so the
// two estimators keep agreeing about what a triangle's pick probability is.
uniform bool uEmissiveCDF;
// <<< RT_RESTIR_CAND_CDF

void main() {
  vec4 wp = texture(uGWorldPos, vUv);
  if (wp.w < 0.5) {
    outReservoir = vec4(0.0);
    outHistory = vec4(0.0);
    return;
  }
  vec3 P = wp.xyz;
  vec3 N = normalize(texture(uGNormalMetal, vUv).xyz);
  gRestirRough = clamp(wp.w - 1.0, 0.0, 1.0);
  float isDynamic = texture(uGDynamic, vUv).a < 0.0 ? 1.0 : 0.0;

  ivec2 px = ivec2(gl_FragCoord.xy);
  gSeed = uint(px.x) * 3079u + uint(px.y) * 9277u + uint(uFrame) * 26699u;
  gSeed = pcgHash(gSeed);
  gBlueNoise = fetchBlueNoise();
  gBnDim = 0;

  int S = uLightCount + uEmissiveCount; // uniform source pool
  if (S == 0) {
    outReservoir = vec4(0.0);
    outHistory = vec4(0.0);
    return;
  }

  float rId = 0.0;
  float wSum = 0.0;
  float M = 0.0;
  for (int k = 0; k < CANDIDATES; k++) {
    float id;
    // 1 / source pdf, kept as the reciprocal so the stock branch is literally
    // the multiply it always was (p̂ * S) rather than a divide that rounds
    // differently. ONE phatOf call site, as ever.
    float invPdf;
    // >>> RT_RESTIR_CAND_CDF
    if (uCandidateCDF > 0.5) {
      // RNG BUDGET: 3 draws per candidate (pool, member, reservoir selection)
      // instead of 2. The blue-noise tile only carries 4 dimensions, so it runs
      // out one candidate sooner and PCG takes over; that is fine, the first
      // candidate is the one worth decorrelating.
      if (rand() < uPoolSplit) {
        // ANALYTIC LIGHT, by the CDF of this pixel's grid cell (row 0 = the
        // global power CDF = the 0.15.0 behaviour). The linear scan this
        // replaced was justified by "MAX_LIGHTS is 32 and it is a uniform
        // array"; at 128 seats in a texture the same lower-bound search costs
        // LIGHT_CDF_STEPS = ceil(log2(maxLights)) fetches instead of up to 128,
        // and lands on the SAME index (both return the first seat whose
        // cumulative is >= u, ties included).
        float u = rand();
        int row = lightGridRow(P);
        int lo = 0;
        int hi = uLightCount - 1;
        for (int s = 0; s < LIGHT_CDF_STEPS; s++) {
          if (lo >= hi) break;
          int mid = (lo + hi) >> 1;
          if (u > texelFetch(uLightGrid, ivec2(mid, row), 0).x) lo = mid + 1;
          else hi = mid;
        }
        id = float(lo);
        // p == 0 can only mean a light with no power at all or a directional one
        // under the bypass, and BOTH score p̂ = 0, so this candidate's weight is
        // zero either way — the guard just refuses to turn 0 x 1e12 into a
        // number. (It is also the only thing standing between a light-grid
        // program that failed to link, i.e. an all-zero table, and a white
        // screen; see RealtimeRaytracer._passClass.)
        float pI = texelFetch(uLightGrid, ivec2(lo, row), 0).y;
        invPdf = pI > 0.0 ? 1.0 / (uPoolSplit * pI) : 0.0;
      } else {
        // EMISSIVE TRIANGLE, by the SAME 8-step binary search over row 66 that
        // RTLightingPass.sampleEmissiveTri runs, and honouring uEmissiveCDF the
        // same way it does.
        int idx;
        float pTri;
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
          pTri = texelFetch(uMaterialsTex, ivec2(idx, 66), 0).y;
        } else {
          idx = min(int(rand() * float(uEmissiveCount)), uEmissiveCount - 1);
          pTri = 1.0 / float(uEmissiveCount);
        }
        id = float(MAX_LIGHTS + idx);
        invPdf = 1.0 / max((1.0 - uPoolSplit) * pTri, 1e-12);
      }
    } else {
    // <<< RT_RESTIR_CAND_CDF
      int pick = min(int(rand() * float(S)), S - 1);
      id = pick < uLightCount
        ? float(pick)
        : float(MAX_LIGHTS + (pick - uLightCount));
      invPdf = float(S); // source pdf = 1/S -> RIS weight = p̂ * S
    }
    float w = phatOf(id, P, N) * invPdf;
    wSum += w;
    M += 1.0;
    if (w > 0.0 && rand() * wSum < w) { rId = id; }
  }

  // temporal reuse: previous reservoir as ONE candidate carrying its history.
  // Reprojection is via the G-buffer motion vector (uUseMotion) or camera-only
  // (uPrevViewProj * P); both yield prevUv for the same validation below. The
  // G-buffer stores the surface's PREVIOUS screen UV directly, so the reservoir
  // (which has no vUv-based jitter correction) samples it as-is — bit-identical
  // to the camera-only path for static geometry. The camera-only branch keeps
  // the old clip.w guard (prevUv = -1 drops the bounds test), matching stock
  // byte-for-byte.
  // >>> RT_RESTIR_COLD_FALLBACK
  // Age starts at zero every frame and only survives through the merge branch
  // below, so a rejected history, a reprojection off screen, and a first frame
  // all read as "cold" without a special case for any of them.
  float age = 0.0;
  // <<< RT_RESTIR_COLD_FALLBACK
  vec2 prevUv;
  // >>> RT_RESTIR_REPROJ
  // SUB-TEXEL CORRECTION, mirroring AccumulatePass line for line. The G-buffer
  // sample under this reservoir texel is TAA-jittered, so P does NOT project to
  // the centre of this texel: it projects to vUv + (cu - vUv). Reprojecting P
  // through the previous VP therefore lands up to a texel off the surface it
  // came from, and at reservoir resolution one texel is the width of a
  // baluster. Subtracting the offset makes the lookup follow the surface
  // instead of the grid. Zero when the option is off, which is what keeps the
  // shipped path byte-identical.
  vec2 subTexel = vec2(0.0);
  if (uReprojRescue > 0.5) {
    vec4 clipC = uViewProj * vec4(P, 1.0);
    if (clipC.w > 0.0) subTexel = ((clipC.xy / clipC.w) * 0.5 + 0.5) - vUv;
  }
  // <<< RT_RESTIR_REPROJ
  if (uUseMotion > 0.5) {
    prevUv = texture(uGMotion, vUv).xy - subTexel;
  } else {
    vec4 clip = uPrevViewProj * vec4(P, 1.0);
    prevUv = clip.w > 0.0 ? ((clip.xy / clip.w) * 0.5 + 0.5) - subTexel : vec2(-1.0);
  }
  if (prevUv.x >= 0.0 && prevUv.x <= 1.0 && prevUv.y >= 0.0 && prevUv.y <= 1.0) {
    vec4 prevPos = texture(uPrevGWorldPos, prevUv);
    float tol = 0.005 * distance(P, uCameraPos) + 20.0 * uEps;
    // The plane test is only a surface-identity check — visibility is resolved
    // later at shading, so relaxing it for dynamic pixels changes nothing about
    // correctness of the estimator, only whether the co-located wall's history
    // may be offered as a candidate. Its light is re-evaluated at THIS surface
    // below, so a genuinely wrong inherited light loses on weight, not on a
    // hard test.
    bool dynOk = (uAcceptDynamic > 0.5 && isDynamic > 0.5);
    bool surfaceOk = abs(dot(P - prevPos.xyz, N)) < tol || dynOk;
    bool histOk = prevPos.w > 0.5 && surfaceOk;
    // >>> RT_RESTIR_REPROJ
    // NEIGHBOURHOOD RESCUE. Even corrected, one texel of the previous frame is
    // one sample of a jittered G-buffer: on a baluster or a handrail edge the
    // surface that owns this pixel now sat in the texel NEXT DOOR last frame,
    // the plane test fails, and the reservoir restarts from eight uniform
    // candidates every single frame. (Measured before this: 22% of shaded
    // pixels never reach age 12 at a frozen pose, as a stipple tracing exactly
    // the balusters, handrail, chandelier arms and picture frames.) So before
    // declaring the history dead, look at the four axis neighbours and take the
    // one whose surface agrees best with this one. Bounded on purpose: four
    // extra uPrevGWorldPos fetches, still ONE uPrevReservoir fetch, no search.
    vec2 useUv = prevUv;
    if (!histOk && uReprojRescue > 0.5) {
      float best = tol;
      for (int k = 0; k < 4; k++) {
        vec2 off = k == 0 ? vec2(1.0, 0.0)
                 : k == 1 ? vec2(-1.0, 0.0)
                 : k == 2 ? vec2(0.0, 1.0)
                 : vec2(0.0, -1.0);
        vec2 nUv = prevUv + off * uTexelSizeT;
        if (nUv.x < 0.0 || nUv.x > 1.0 || nUv.y < 0.0 || nUv.y > 1.0) continue;
        vec4 np = texture(uPrevGWorldPos, nUv);
        if (np.w < 0.5) continue;
        float d = abs(dot(P - np.xyz, N));
        if (d < best) { best = d; useUv = nUv; histOk = true; }
      }
    }
    // <<< RT_RESTIR_REPROJ
    if (histOk) {
      vec4 h = texture(uPrevReservoir, useUv);
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
        // >>> RT_RESTIR_COLD_FALLBACK
        // This is the one branch where history genuinely carried over, so it is
        // the one place age may advance. h.b IS the previous frame's age at the
        // reprojected texel. 255 is a float ceiling, not an encoding limit.
        age = min(h.b + 1.0, 255.0);
        // <<< RT_RESTIR_COLD_FALLBACK
      }
    }
  }

  outReservoir = vec4(rId * 64.0 + min(M, 63.0), 0.0, age, wSum);
  // History is normally the live reservoir, but a dynamic-mesh pixel must NOT
  // overwrite the wall's history it is covering: pass the previous reservoir at
  // this pixel through unchanged, so the wall's history survives the aeroplane
  // crossing it and the trailing edge stops disoccluding. The live reservoir
  // (attachment 0) still streams the aeroplane's fresh candidates for shading.
  outHistory = (uFreezeDynamic > 0.5 && isDynamic > 0.5)
    ? texture(uPrevReservoir, vUv)
    : outReservoir;
}
`,Hy=`
precision highp float;

${Rh}

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
  // >>> RT_RESTIR_CLAMP_REL
  // THIS PIXEL'S OWN ESTIMATE OF THE WHOLE UNSHADOWED LIGHT SUM, before any
  // neighbour is merged in. wSum/M is the RIS estimate of the integral of the
  // target function: E[w] = sum over the light set of p̂, whatever the source
  // pdf. It is written to the output's unused .g so the lighting pass can cap a
  // firefly RELATIVE to what this pixel could plausibly receive instead of
  // against a scene-wide constant. Taken from the OWN reservoir on purpose: a
  // neighbour's total belongs to the neighbour's surface.
  float pHatTotal = M > 0.0 ? wSum / M : 0.0;
  // <<< RT_RESTIR_CLAMP_REL

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
  // >>> RT_RESTIR_COLD_FALLBACK
  // THIS pixel's age, passed straight through. Neighbours' ages are deliberately
  // not merged: coldness is a property of the pixel, and a cold pixel that
  // borrowed a warm neighbour's candidate still has one visibility ray on one
  // guess, which is exactly the estimate the fallback exists to replace.
  // <<< RT_RESTIR_COLD_FALLBACK
  // >>> RT_RESTIR_CLAMP_REL
  // .g was the reserved channel; it now carries p̂_total (see above). Nothing
  // reads it unless RTLightingPass.uRestirClampRel is non-zero, so writing it
  // does not change a single shaded pixel on its own.
  // <<< RT_RESTIR_CLAMP_REL
  outReservoir = vec4(rId, pHatTotal, c.b, W);
}
`;class Vy{constructor(e,t,{maxLights:i=Os}={}){this.maxLights=Ui(i),this._cdfSteps=Math.max(1,Math.ceil(Math.log2(Math.max(2,this.maxLights)))),this.targetA=this._makeTemporalTarget(e,t),this.targetB=this._makeTemporalTarget(e,t),this.spatialTarget=this._makeTarget(e,t);const n=(r,a)=>new st({name:a,glslVersion:vt,vertexShader:Gy,fragmentShader:r.replace(/RT_MAX_LIGHTS_VALUE/g,String(this.maxLights)).replace(/RT_CDF_STEPS_VALUE/g,String(this._cdfSteps)),uniforms:{uGWorldPos:{value:null},uGNormalMetal:{value:null},uMaterialsTex:{value:null},uLightRow:{value:0},uLightCount:{value:0},uEmissiveCount:{value:0},uFrame:{value:0},uCameraPos:{value:new P},uEps:{value:.001},uDirBypass:{value:0},...r===Su?{uCandidateCDF:{value:0},uPoolSplit:{value:1},uEmissiveCDF:{value:!0},uLightGrid:{value:null},uGridOrigin:{value:new P},uGridInvCell:{value:new P(1,1,1)},uGridDims:{value:new Int32Array([1,1,1])},uUseLightGrid:{value:0},uPrevReservoir:{value:null},uPrevGWorldPos:{value:null},uPrevViewProj:{value:new he},uViewProj:{value:new he},uReprojRescue:{value:0},uTexelSizeT:{value:new le(1/e,1/t)},uMCap:{value:40},uGDynamic:{value:null},uAcceptDynamic:{value:0},uFreezeDynamic:{value:0},uGMotion:{value:null},uUseMotion:{value:0}}:{uReservoirIn:{value:null},uTexelSize:{value:new le(1/e,1/t)}}},depthTest:!1,depthWrite:!1});this.material=n(Su,"rt:restir-temporal"),this.spatialMaterial=n(Hy,"rt:restir-spatial"),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=new xt(e,t,{minFilter:ze,magFilter:ze,format:Xe,type:pt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}_makeTemporalTarget(e,t){const i=Ji(e,t,2,{minFilter:ze,magFilter:ze,format:Xe,type:pt,depthBuffer:!1,stencilBuffer:!1});for(const n of i.texture)n.generateMipmaps=!1;return i}setCompiledScene(e){for(const n of[this.material,this.spatialMaterial]){const r=n.uniforms;r.uMaterialsTex.value=e.materialsTex,r.uLightRow.value=e.lightRow,r.uLightCount.value=e.lightCount,r.uEmissiveCount.value=e.emissiveTriCount}const t=this.material.uniforms,i=e.lightGrid;i?(t.uGridOrigin.value.set(i.origin[0],i.origin[1],i.origin[2]),t.uGridInvCell.value.set(1/i.cell[0],1/i.cell[1],1/i.cell[2]),t.uGridDims.value[0]=i.dims[0],t.uGridDims.value[1]=i.dims[1],t.uGridDims.value[2]=i.dims[2]):t.uGridDims.value[0]=t.uGridDims.value[1]=t.uGridDims.value[2]=0,this._compiled=e,this._rebuildPools()}setEmissiveCount(e){this.material.uniforms.uEmissiveCount.value=e,this.spatialMaterial.uniforms.uEmissiveCount.value=e}setCandidateImportance(e){this.material.uniforms.uCandidateCDF.value=e?1:0}setEmissiveImportance(e){this.material.uniforms.uEmissiveCDF.value=!!e}setLightGrid(e,t){const i=this.material.uniforms;i.uLightGrid.value=e||null,i.uUseLightGrid.value=e&&t?1:0}_rebuildPools(){const e=this.material.uniforms,t=this._compiled,i=t?Math.min(t.lightCount|0,this.maxLights):0,n=e.uDirBypass.value>.5;let r=0;for(let l=0;l<i;l++){const c=t.lightPosType[l*4+3],u=c>=.5&&c<1.5;n&&u||(r+=.299*t.lightColorRadius[l*4]+.587*t.lightColorRadius[l*4+1]+.114*t.lightColorRadius[l*4+2])}const a=e.uEmissiveCount.value>0&&t&&t.emissivePower||0;let o;i===0?o=0:r>0&&a>0?o=Math.min(.9,Math.max(.1,r/(r+a))):a>0?o=0:o=1,e.uPoolSplit.value=o}setDynamic(e,t){this.material.uniforms.uAcceptDynamic.value=e?1:0,this.material.uniforms.uFreezeDynamic.value=t?1:0}setMotionVectors(e){this.material.uniforms.uUseMotion.value=e?1:0}setDirectionalBypass(e){const t=e?1:0;this.material.uniforms.uDirBypass.value=t,this.spatialMaterial.uniforms.uDirBypass.value=t}setReprojectionRescue(e){this.material.uniforms.uReprojRescue.value=e?1:0}clearHistory(e){const t=e.getRenderTarget();e.setClearColor(0,0);for(const i of[this.targetA,this.targetB,this.spatialTarget])e.setRenderTarget(i),e.clear(!0,!1,!1);e.setRenderTarget(t)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t),this.spatialTarget.setSize(e,t),this.spatialMaterial.uniforms.uTexelSize.value.set(1/e,1/t),this.material.uniforms.uTexelSizeT.value.set(1/e,1/t)}render(e,t,i,n,r,a,o=40,l=null){for(const u of[this.material,this.spatialMaterial]){const h=u.uniforms;h.uGWorldPos.value=t.worldPos,h.uGNormalMetal.value=t.normalMetal,h.uFrame.value=r,h.uCameraPos.value.copy(n),h.uEps.value=a}this._rebuildPools();const c=this.material.uniforms;return c.uPrevReservoir.value=this.targetB.texture[1],c.uPrevGWorldPos.value=t.prevWorldPos,c.uPrevViewProj.value.copy(i),l&&c.uViewProj.value.copy(l),c.uMCap.value=Math.max(1,o),c.uGDynamic.value=t.emissive,c.uGMotion.value=t.motion,this.quad.material=this.material,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),this.spatialMaterial.uniforms.uReservoirIn.value=this.targetA.texture[0],this.quad.material=this.spatialMaterial,e.setRenderTarget(this.spatialTarget),e.render(this.scene,this.camera),e.setRenderTarget(null),[this.targetA,this.targetB]=[this.targetB,this.targetA],this.spatialTarget.texture}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.spatialTarget.dispose(),this.material.dispose(),this.spatialMaterial.dispose(),this.quad.geometry.dispose()}}const Wy=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Xy=`
precision highp float;
precision highp isampler2D;
precision highp usampler2D;

${Jo}
${Qo}
${el}
${$o}

#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE
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

// THE LIGHT TABLE lives in one row of uMaterialsTex (row = uLightRow), 4 texels
// per seat: see SceneCompiler's layout comment. Until 0.16.0 these were three
// vec4[MAX_LIGHTS] uniform arrays, which is what capped a scene at 32 lights.
uniform int uLightRow;
vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); } // spot: direction.xyz + cos(outer)
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
  vec4 posType = lightPosType(i);
  if (posType.w < 1.5) return 1.0;
  vec4 dc = lightDirCone(i);
  return smoothstep(dc.w, posType.w - 2.0, dot(dc.xyz, lightToP));
}

vec3 lightContribution(int i, vec3 P, vec3 N) {
  vec4 posType = lightPosType(i);
  vec4 colRad = lightColorRadius(i);
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
`;class qy{constructor(e,t,{maxLights:i=Os}={}){this.maxLights=Ui(i),this.targetA=this._makeTarget(e,t),this.targetB=this._makeTarget(e,t);const n=Xy.replace(/RT_MAX_LIGHTS_VALUE/g,String(this.maxLights));this._fragTiles=n,this._fragNoTiles=function(a,o){const l=a.split(`
`),c=[];let u=!1;for(const h of l){if(h.includes(">>> "+o)){u=!0;continue}if(h.includes("<<< "+o)){u=!1;continue}u||c.push(h)}return c.join(`
`)}(n,"RT_TEXTURE_TILES"),this._tilesData=!1,this._tilesOn=!1,this.material=new st({name:"rt:gi-reservoir",glslVersion:vt,vertexShader:Wy,fragmentShader:n,uniforms:{bvhStatic:{value:null},bvhDynamic:{value:null},uHasDynamic:{value:!1},uAttrStatic:{value:null},uAttrDynamic:{value:null},uMaterialsTex:{value:null},uGWorldPos:{value:null},uGNormalMetal:{value:null},uPrevGWorldPos:{value:null},uPrevResPos:{value:null},uPrevResRad:{value:null},uPrevViewProj:{value:new he},uLightRow:{value:0},uLightCount:{value:0},uEmissiveCount:{value:0},uEmissiveCDF:{value:!0},uCameraPos:{value:new P},uFrame:{value:0},uEps:{value:.001},uFireflyClamp:{value:4},uMCap:{value:20},uSpatialTaps:{value:2},uValidateInterval:{value:8},uResolveAlpha:{value:.15},uConfLow:{value:.3},uChromaMean:{value:!0},uVisFallback:{value:!0},uEnvColor:{value:new ue(.03,.04,.06)},uEnvIntensity:{value:1},uSkyEnabled:{value:!1},uSunDir:{value:new P(.4,.8,.45).normalize()},uSunColor:{value:new ue(1,.9,.75)},uSkyZenith:{value:new ue(.18,.34,.62)},uSkyHorizon:{value:new ue(.7,.8,.9)},uSkyIntensity:{value:1},uHasTextureTiles:{value:!1}},depthTest:!1,depthWrite:!1}),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}_makeTarget(e,t){const i=Ji(e,t,3,{minFilter:ze,magFilter:ze,format:Xe,type:pt,depthBuffer:!1,stencilBuffer:!1});for(const n of i.texture)n.generateMipmaps=!1;return i}setCompiledScene(e){const t=this.material.uniforms;t.bvhStatic.value=e.staticBvhUniform,t.bvhDynamic.value=e.dynamicBvhUniform,t.uHasDynamic.value=e.hasDynamic,t.uAttrStatic.value=e.staticAttrTex,t.uAttrDynamic.value=e.dynamicAttrTex,t.uMaterialsTex.value=e.materialsTex,t.uLightRow.value=e.lightRow,t.uLightCount.value=e.lightCount,t.uEmissiveCount.value=e.emissiveTriCount,this._tilesData=!!e.hasTextureTiles,this._tileSize=e._tileSize||128,this._applyTilesSplice()}setEmissiveCount(e){this.material.uniforms.uEmissiveCount.value=e}setTextureTiles(e){this._tilesOn=!!e,this._applyTilesSplice()}_applyTilesSplice(){const e=!!(this._tilesOn&&this._tilesData);let t=e?this._fragTiles:this._fragNoTiles;e&&this._tileSize!==128&&(t=t.replace("#define TILE 128.0",`#define TILE ${this._tileSize}.0`)),this.material.uniforms.uHasTextureTiles.value=e,this.material.fragmentShader!==t&&(this.material.fragmentShader=t,this.material.needsUpdate=!0)}clearHistory(e){const t=e.getRenderTarget();e.setClearColor(0,0);for(const i of[this.targetA,this.targetB])e.setRenderTarget(i),e.clear(!0,!1,!1);e.setRenderTarget(t)}setSize(e,t){this.targetA.setSize(e,t),this.targetB.setSize(e,t)}render(e,t,i,n,r,a,o){const l=this.material.uniforms;l.uGWorldPos.value=t.worldPos,l.uGNormalMetal.value=t.normalMetal,l.uPrevGWorldPos.value=t.prevWorldPos,l.uPrevResPos.value=this.targetB.texture[0],l.uPrevResRad.value=this.targetB.texture[1],l.uPrevViewProj.value.copy(i),l.uCameraPos.value.copy(n),l.uFrame.value=r,l.uEps.value=a,l.uFireflyClamp.value=o.fireflyClamp,l.uMCap.value=o.mCap,l.uSpatialTaps.value=o.spatialTaps,l.uValidateInterval.value=o.validateInterval,l.uResolveAlpha.value=o.resolveAlpha??.15,l.uConfLow.value=o.confLow??.3,l.uChromaMean.value=o.chromaMean!==!1,l.uVisFallback.value=o.visFallback!==!1,l.uEmissiveCDF.value=o.emissiveCDF,l.uEnvColor.value.copy(o.envColor),l.uEnvIntensity.value=o.envIntensity,l.uSkyEnabled.value=o.skyEnabled,l.uSunDir.value.copy(o.sunDir),l.uSunColor.value.copy(o.sunColor),l.uSkyZenith.value.copy(o.skyZenith),l.uSkyHorizon.value.copy(o.skyHorizon),l.uSkyIntensity.value=o.skyIntensity,e.setRenderTarget(this.targetA),e.render(this.scene,this.camera),e.setRenderTarget(null);const c=this.targetA;return[this.targetA,this.targetB]=[this.targetB,this.targetA],c.texture[2]}dispose(){this.targetA.dispose(),this.targetB.dispose(),this.material.dispose(),this.quad.geometry.dispose()}}const Ky=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Ph=`
precision highp float;

#define MAX_LIGHTS RT_MAX_LIGHTS_VALUE

uniform sampler2D uMaterialsTex;
uniform int uLightRow;
uniform int uLightCount;

vec4 lightPosType(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4,     uLightRow), 0); }
vec4 lightColorRadius(int i) { return texelFetch(uMaterialsTex, ivec2(i * 4 + 1, uLightRow), 0); }
vec4 lightDirCone(int i)     { return texelFetch(uMaterialsTex, ivec2(i * 4 + 2, uLightRow), 0); }

// Rec.601, the same weights RestirPass.rtLum and RTLightingPass use. Row 0 of
// the grid must reproduce the 0.15.0 CPU-side CDF, and that CDF was built from
// these weights.
float rtLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
`,wu=`
${Ph}

layout(location = 0) out vec4 outWeight;

uniform vec3 uGridOrigin;
uniform vec3 uGridCell;
uniform ivec3 uGridDims;
uniform float uDirBypass;

void main() {
  int i = int(gl_FragCoord.x);
  int row = int(gl_FragCoord.y);
  if (i >= uLightCount) { outWeight = vec4(0.0); return; }

  vec4 posType = lightPosType(i);
  vec4 colRad = lightColorRadius(i);
  float lum = rtLum(colRad.rgb);
  bool isDir = posType.w >= 0.5 && posType.w < 1.5;

  if (isDir) {
    // A directional light reaches every cell equally: no distance, no cone.
    float w = uDirBypass > 0.5 ? 0.0 : lum;
    outWeight = vec4(w, uDirBypass > 0.5 ? 0.0 : 1.0, 0.0, 0.0);
    return;
  }
  if (row == 0) {
    // Global row: power only, exactly as the CPU built it through 0.15.0.
    outWeight = vec4(lum, 1.0, 0.0, 0.0);
    return;
  }

  int c = row - 1;
  ivec3 ci = ivec3(c % uGridDims.x, (c / uGridDims.x) % uGridDims.y, c / (uGridDims.x * uGridDims.y));
  vec3 lo = uGridOrigin + vec3(ci) * uGridCell;
  vec3 hi = lo + uGridCell;

  // Distance from the light to the NEAREST point of the cell box (0 inside).
  vec3 P = posType.xyz;
  vec3 q = max(max(lo - P, vec3(0.0)), P - hi);
  float d2 = dot(q, q);

  // Spot cone: 1 if any part of the cell can be inside the cone, else a small
  // floor rather than 0: a cone edge is a smoothstep, not a cliff, and the
  // corner test below is conservative in the other direction.
  float cone = 1.0;
  if (posType.w >= 1.5) {
    vec4 dc = lightDirCone(i);
    cone = 0.05;
    if (d2 <= 0.0) {
      cone = 1.0; // the light sits inside this cell
    } else {
      // Nine directions: the cell's eight corners plus its nearest point.
      for (int k = 0; k < 9; k++) {
        vec3 p = k == 8
          ? clamp(P, lo, hi)
          : vec3(k % 2 == 0 ? lo.x : hi.x,
                 (k / 2) % 2 == 0 ? lo.y : hi.y,
                 (k / 4) % 2 == 0 ? lo.z : hi.z);
        vec3 dv = p - P;
        float dl = length(dv);
        if (dl < 1e-6) { cone = 1.0; break; }
        if (dot(dc.xyz, dv / dl) >= dc.w) { cone = 1.0; break; }
      }
    }
  }

  // INVERSE SQUARE, floored at half a cell diagonal.
  //
  // The obvious weight is lum * r^2 / (d^2 + r^2/4) clamped to 1, which is right
  // when r is a light's FALLOFF radius. This table's radius is the soft-shadow
  // radius: 0.06 to 0.6 world units: so that form saturates at 1 for any light
  // inside the cell and decays as r^2/d^2 outside it, making CONTAINMENT worth
  // 1/r^2 (about 70x here) more than the inverse-square law says. Measured on the
  // hotel: one seat took 98.3% of a corridor cell's probability while five others
  // carried 100-300x more true contribution than their pdf share, and the frame
  // filled with fireflies that the relative firefly clamp cannot catch (the
  // spike is inside wSum, so it lifts the cap with it). Numbers in
  // dev/LIGHTS-0.16-REPORT.md.
  //
  // So: w = lum / max(d^2, (cellDiagonal/2)^2). It is the same inverse square the
  // shading uses, with the only clamp being the singularity at contact, set to
  // the distance a pixel in this cell is TYPICALLY at from a light in this cell.
  // The light's radius does not appear at all, which is correct: a bigger
  // sphere light is not a brighter one, its intensity is already in lum.
  float dmin2 = 0.25 * dot(uGridCell, uGridCell);
  float fall = 1.0 / max(d2, dmin2);
  outWeight = vec4(lum * fall * cone, 1.0, 0.0, 0.0);
}
`,jy=`
${Ph}

layout(location = 0) out vec4 outCdf;

uniform sampler2D uWeights;
// Minimum share of the row's largest weight that any ELIGIBLE light keeps, so a
// light that this cell's geometry scored at zero can still be drawn where it
// could matter (RIS needs its source pdf to cover the target's support). Not
// applied to row 0: there w IS the light's power, and a light with no power
// contributes nothing anywhere, which is exactly the 0.15.0 behaviour this row
// has to reproduce.
uniform float uFloorFrac;

void main() {
  int me = int(gl_FragCoord.x);
  int row = int(gl_FragCoord.y);
  if (me >= uLightCount) { outCdf = vec4(0.0); return; }

  float floorFrac = row == 0 ? 0.0 : uFloorFrac;

  // ONE pass over the row, not two. The floor is relative to the row's largest
  // weight, which is not known until the row has been read: so it is ADDED
  // rather than max()'d: w' = w + floorFrac * maxW for an eligible seat. That
  // guarantees the same minimum probability (support is what the floor is for)
  // while making every term separable, so the sums can be assembled
  // algebraically after a single loop. Halves the fetches, and this loop is the
  // whole cost of the build: it runs once per (seat, cell), so it is
  // cells x lights x lights.
  float total = 0.0;    // sum of raw weights
  float upto = 0.0;     // ...up to and including this seat
  float mine = 0.0;
  float maxW = 0.0;
  float nElig = 0.0;    // eligible seats, and how many are at or before me
  float nEligUpto = 0.0;
  for (int j = 0; j < MAX_LIGHTS; j++) {
    if (j >= uLightCount) break;
    vec2 wj = texelFetch(uWeights, ivec2(j, row), 0).xy;
    float w = wj.y > 0.5 ? wj.x : 0.0;
    float e = wj.y > 0.5 ? 1.0 : 0.0;
    maxW = max(maxW, w);
    total += w;
    nElig += e;
    if (j <= me) { upto += w; nEligUpto += e; }
    if (j == me) mine = w * e + (1.0 - e) * -1.0; // -1 marks "not eligible"
  }
  float floorW = maxW * floorFrac;
  float meElig = mine >= 0.0 ? 1.0 : 0.0;
  mine = max(mine, 0.0) + floorW * meElig;
  total += floorW * nElig;
  upto += floorW * nEligUpto;

  // Every weight zero (an unlit scene, or sun-only with the bypass on): fall
  // back to the uniform table, exactly as the CPU build did. Those lights all
  // score p̂ = 0, so nothing is selected out of it either way: this only keeps
  // the row finite and monotone.
  float n = float(uLightCount);
  float p = total > 0.0 ? mine / total : 1.0 / n;
  float cdf = total > 0.0 ? upto / total : (float(me) + 1.0) / n;
  if (me == uLightCount - 1) cdf = 1.0;
  outCdf = vec4(cdf, p, mine, 0.0);
}
`;class Yy{constructor({maxLights:e=Os}={}){this.maxLights=Ui(e),this.cells=0,this.rows=1,this.lastBuildMs=0,this.builds=0;const t=(i,n)=>new st({name:n,glslVersion:vt,vertexShader:Ky,fragmentShader:i.replace(/RT_MAX_LIGHTS_VALUE/g,String(this.maxLights)),uniforms:{uMaterialsTex:{value:null},uLightRow:{value:0},uLightCount:{value:0},...i===wu?{uGridOrigin:{value:new P},uGridCell:{value:new P(1,1,1)},uGridDims:{value:new Int32Array([1,1,1])},uDirBypass:{value:0}}:{uWeights:{value:null},uFloorFrac:{value:.001}}},depthTest:!1,depthWrite:!1});this.weightMaterial=t(wu,"rt:lightgrid-weights"),this.cdfMaterial=t(jy,"rt:lightgrid-cdf"),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.weightMaterial),this.quad.frustumCulled=!1,this.scene.add(this.quad),this.weightTarget=null,this.target=null,this._compiled=null}get texture(){return this.target?this.target.texture:null}_makeTarget(e,t){const i=new xt(e,t,{minFilter:ze,magFilter:ze,format:Xe,type:pt,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}setCompiledScene(e,t=2048){this._compiled=e;const i=e?e.lightGrid:null;let n=i?i.cells:0;n+1>t&&(n=Math.max(0,t-1)),this.cells=n,this.rows=n+1;const r=this.maxLights;(!this.target||this.target.width!==r||this.target.height!==this.rows)&&(this.target&&this.target.dispose(),this.weightTarget&&this.weightTarget.dispose(),this.target=this._makeTarget(r,this.rows),this.weightTarget=this._makeTarget(r,this.rows));for(const o of[this.weightMaterial,this.cdfMaterial])o.uniforms.uMaterialsTex.value=e?e.materialsTex:null,o.uniforms.uLightRow.value=e?e.lightRow:0,o.uniforms.uLightCount.value=e?e.lightCount:0;const a=this.weightMaterial.uniforms;return i&&(a.uGridOrigin.value.set(i.origin[0],i.origin[1],i.origin[2]),a.uGridCell.value.set(i.cell[0],i.cell[1],i.cell[2]),a.uGridDims.value[0]=i.dims[0],a.uGridDims.value[1]=i.dims[1],a.uGridDims.value[2]=i.dims[2]),this.cdfMaterial.uniforms.uWeights.value=this.weightTarget.texture,this.cells}build(e,{dirBypass:t=!1,cellRows:i=!0}={}){if(!this.target||!this._compiled)return 0;const n=this.weightMaterial.uniforms;n.uLightCount.value=this._compiled.lightCount,n.uDirBypass.value=t?1:0,this.cdfMaterial.uniforms.uLightCount.value=this._compiled.lightCount;for(const l of[this.weightMaterial,this.cdfMaterial])l.uniforms.uMaterialsTex.value=this._compiled.materialsTex,l.uniforms.uLightRow.value=this._compiled.lightRow;const r=Math.min(this._compiled.lightCount|0,this.maxLights);if(r<=0)return 0;const a=i?this.rows:1,o=e.getRenderTarget();return this.weightTarget.viewport.set(0,0,r,a),this.target.viewport.set(0,0,r,a),this.quad.material=this.weightMaterial,e.setRenderTarget(this.weightTarget),e.render(this.scene,this.camera),this.quad.material=this.cdfMaterial,e.setRenderTarget(this.target),e.render(this.scene,this.camera),e.setRenderTarget(o),this.builds++,a}dispose(){this.target&&this.target.dispose(),this.weightTarget&&this.weightTarget.dispose(),this.weightMaterial.dispose(),this.cdfMaterial.dispose(),this.quad.geometry.dispose()}}const Zy=`
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Jy=`
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
`;class Qy{constructor(){this.material=new st({name:"rt:history-carry",glslVersion:vt,vertexShader:Zy,fragmentShader:Jy,uniforms:{uTex:{value:null},uCountClamp:{value:-1}},depthTest:!1,depthWrite:!1}),this.scene=new ai,this.camera=new Kt(-1,1,1,-1,0,1),this.quad=new ut(new Vt(2,2),this.material),this.quad.frustumCulled=!1,this.scene.add(this.quad)}blit(e,t,i,n=-1){this.material.uniforms.uTex.value=t,this.material.uniforms.uCountClamp.value=n;const r=e.getRenderTarget();e.setRenderTarget(i),e.render(this.scene,this.camera),e.setRenderTarget(r)}dispose(){this.material.dispose(),this.quad.geometry.dispose()}}const $y=4,ex=9;class tx{constructor(e){this.supported=!1,this._gl=null,this._ext=null,this._active=null,this._pending=[],this._free=[],this._samples=[],this._disjointCount=0;try{const t=e.getContext(),i=t.getExtension("EXT_disjoint_timer_query_webgl2");t&&i&&(this._gl=t,this._ext=i,this.supported=!0)}catch{this.supported=!1}}get costMs(){if(this._samples.length<3)return null;const e=[...this._samples].sort((t,i)=>t-i);return e[Math.floor(e.length/2)]}get lastMs(){return this._samples.length?this._samples[this._samples.length-1]:null}get ready(){return this.costMs!==null}begin(){if(!this.supported||this._active)return!1;const e=this._gl;if(!this._free.length&&this._pending.length>=$y)return!1;const t=this._free.pop()||e.createQuery();return t?(e.beginQuery(this._ext.TIME_ELAPSED_EXT,t),this._active=t,!0):!1}end(){this.supported&&(this._active&&(this._gl.endQuery(this._ext.TIME_ELAPSED_EXT),this._pending.push(this._active),this._active=null),this._drain())}_drain(){const e=this._gl;if(e.getParameter(this._ext.GPU_DISJOINT_EXT)){this._disjointCount++;for(const t of this._pending)this._free.push(t);this._pending.length=0,this._samples.length=0;return}for(;this._pending.length;){const t=this._pending[0];if(!e.getQueryParameter(t,e.QUERY_RESULT_AVAILABLE))break;const i=e.getQueryParameter(t,e.QUERY_RESULT);this._pending.shift(),this._free.push(t);const n=i/1e6;n>0&&n<2e3&&(this._samples.push(n),this._samples.length>ex&&this._samples.shift())}}reset(){this._samples.length=0}dispose(){if(!this.supported)return;const e=this._gl;if(this._active){try{e.endQuery(this._ext.TIME_ELAPSED_EXT)}catch{}this._free.push(this._active),this._active=null}for(const t of this._pending)try{e.deleteQuery(t)}catch{}for(const t of this._free)try{e.deleteQuery(t)}catch{}this._pending.length=0,this._free.length=0,this._samples.length=0}}function Mu(s,e){let t=1,i=0,n=s;for(;n>0;)t/=e,i+=t*(n%e),n=Math.floor(n/e);return i}class pe{static isSupported(e){try{const t=e.getContext();if(typeof WebGL2RenderingContext>"u"||!(t instanceof WebGL2RenderingContext)||!t.getExtension("EXT_color_buffer_float"))return!1;const i=t.getExtension("WEBGL_debug_renderer_info");if(i){const n=String(t.getParameter(i.UNMASKED_RENDERER_WEBGL)||"");if(/swiftshader|llvmpipe|software/i.test(n))return!1}return!0}catch{return!1}}static detectTier(e){if(e&&!pe.isSupported(e))return"none";const t=typeof navigator<"u"?navigator:{};return(t.maxTouchPoints??0)>1||/Android|iPhone|iPad|Mobile/i.test(t.userAgent||"")?"mid":"high"}static recommendedOptions(e){return e==="none"?{}:e==="mid"?{renderScale:.375,...pe._qualityFor(.375),adaptiveQuality:!0}:{renderScale:.5,denoiseIterations:3,stochasticLights:!1,adaptiveQuality:!0}}static async probeGPUTier(e){const i={},n=typeof window<"u"&&window.devicePixelRatio||1,r=typeof window<"u"&&window.screen?window.screen:{width:1920,height:1080},a=Math.round(r.width*r.height*Math.min(n,2)),o=a>=6e6;if(i.screenPixels=a,i.demanding=o,typeof navigator<"u"&&navigator.gpu)try{const c=await navigator.gpu.requestAdapter();if(c){const u=c.limits||{},h=Number(u.maxBufferSize||0),d=Number(u.maxStorageBufferBindingSize||0),f=Number(u.maxTextureDimension2D||0),v=Number(u.maxComputeWorkgroupStorageSize||0);Object.assign(i,{maxBufferSize:h,maxStorageBufferBindingSize:d,maxTextureDimension2D:f,maxComputeWorkgroupStorageSize:v});let _={};try{_=c.info||(c.requestAdapterInfo?await c.requestAdapterInfo():{})||{}}catch{_={}}i.vendor=_.vendor||null,i.architecture=_.architecture||null,i.description=_.description||null;const m=`${_.vendor||""} ${_.architecture||""} ${_.description||""} ${_.device||""}`.toLowerCase();if(/swiftshader|llvmpipe|software|basic render|microsoft basic|paravirtual/.test(m))return i.reason="software renderer signature in adapter.info",{tier:"none",source:"webgpu",details:i};const p=h>=2*1073741824&&f>=16384,y=h>=4*1073741824;let g;return p&&(!o||y)?(g="high",i.reason=o&&y?"strong limits + >=4GiB buffer clears 4K-class screen demand -> high":"large buffer + textures -> high"):p&&o?(g="mid",i.reason="strong limits but 4K-class screen without a >=4GiB buffer budget -> mid"):(g="mid",i.reason="modest adapter limits -> mid"),{tier:g,source:"webgpu",details:i}}i.reason="navigator.gpu present but requestAdapter returned no adapter"}catch(c){i.error=String(c&&c.message||c)}else i.reason="no navigator.gpu (WebGPU unavailable)";return{tier:pe.detectTier(e),source:e?"webgl":"fallback",details:i}}static _mixedMrtSupported(e){try{const t=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,t);const i=o=>{const l=e.createTexture();return e.bindTexture(e.TEXTURE_2D,l),e.texStorage2D(e.TEXTURE_2D,1,o,4,4),l},n=i(e.RGBA16F),r=i(e.RGBA32F);e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,r,0),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]);const a=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.deleteFramebuffer(t),e.deleteTexture(n),e.deleteTexture(r),e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),a}catch{return!1}}static _specMrtSupported(e){let t,i,n,r,a,o,l;const c=e.getRenderTarget();try{t=Ji(2,2,2,{format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1});for(const d of t.texture)d.generateMipmaps=!1;i=new xt(2,2,{depthBuffer:!1,stencilBuffer:!1});const u="out vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";n=new st({glslVersion:vt,vertexShader:u,fragmentShader:`precision highp float;
layout(location = 0) out vec4 o0; layout(location = 1) out vec4 o1;
void main(){ o0 = vec4(0.5, 0.25, 0.75, 1.0); o1 = vec4(0.125); }`,depthTest:!1,depthWrite:!1}),r=new st({glslVersion:vt,vertexShader:u,fragmentShader:`precision highp float; in vec2 vUv; out vec4 outColor;
uniform sampler2D uTex; void main(){ outColor = texture(uTex, vUv); }`,uniforms:{uTex:{value:t.texture[0]}},depthTest:!1,depthWrite:!1}),o=new ai,l=new Kt(-1,1,1,-1,0,1),a=new ut(new Vt(2,2),n),a.frustumCulled=!1,o.add(a),e.setRenderTarget(t),e.render(o,l),a.material=r,e.setRenderTarget(i),e.render(o,l);const h=new Uint8Array(4);return e.readRenderTargetPixels(i,0,0,1,1,h),Math.abs(h[0]-128)<24&&Math.abs(h[1]-64)<24}catch{return!1}finally{e.setRenderTarget(c),a&&a.geometry.dispose(),n&&n.dispose(),r&&r.dispose(),t&&t.dispose(),i&&i.dispose()}}static _motionMrtSupported(e){const t=e.getContext();if(t.getParameter(t.MAX_DRAW_BUFFERS)<5)return!1;let i,n,r,a,o,l,c;const u=e.getRenderTarget();try{i=Ji(2,2,5,{format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1});for(const f of i.texture)f.generateMipmaps=!1;i.texture[4].format=ta,i.texture[4].type=pt,n=new xt(2,2,{depthBuffer:!1,stencilBuffer:!1});const h="out vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";r=new st({glslVersion:vt,vertexShader:h,fragmentShader:`precision highp float;
layout(location = 0) out vec4 o0; layout(location = 1) out vec4 o1;
layout(location = 2) out vec4 o2; layout(location = 3) out vec4 o3;
layout(location = 4) out vec4 o4;
void main(){
  o0 = vec4(0.5); o1 = vec4(0.25); o2 = vec4(0.125); o3 = vec4(0.0625);
  o4 = vec4(0.375, 0.625, 0.0, 1.0);
}`,depthTest:!1,depthWrite:!1}),a=new st({glslVersion:vt,vertexShader:h,fragmentShader:`precision highp float; in vec2 vUv; out vec4 outColor;
uniform sampler2D uTex; void main(){ outColor = vec4(texture(uTex, vUv).rg, 0.0, 1.0); }`,uniforms:{uTex:{value:i.texture[4]}},depthTest:!1,depthWrite:!1}),l=new ai,c=new Kt(-1,1,1,-1,0,1),o=new ut(new Vt(2,2),r),o.frustumCulled=!1,l.add(o),e.setRenderTarget(i),e.render(l,c),o.material=a,e.setRenderTarget(n),e.render(l,c);const d=new Uint8Array(4);return e.readRenderTargetPixels(n,0,0,1,1,d),Math.abs(d[0]-96)<24&&Math.abs(d[1]-159)<24}catch{return!1}finally{e.setRenderTarget(u),o&&o.geometry.dispose(),r&&r.dispose(),a&&a.dispose(),i&&i.dispose(),n&&n.dispose()}}static GOVERNOR_MAX_DENOISE=3;static _qualityFor(e){return{denoiseIterations:e>.45?2:pe.GOVERNOR_MAX_DENOISE,stochasticLights:e<=.55}}static CANVAS_LEVELS=[1,.85,.75,.62,.5];static HISTORY_CARRY_FRAMES=8;static DIAG_MIN_FRAMES=8;static DIAG_STABLE_FRAMES=4;static DIAG_WINDOW_FRAMES=45;static STALE_CHECK_FRAMES=30;static MAX_STALE_WARNINGS=8;static GOVERNOR_WARMUP_FRAMES=60;static MAX_SCALE_STEP=.25;static MAX_SCALE_UP_STEP=.05;static GPU_BUDGET_DROP=1;static GPU_BUDGET_DROP_OSC=1.15;static GPU_TARGET_UTIL=.85;static GPU_TARGET_UTIL_OSC=.6;static GPU_PROBE_CEIL=1.05;static SCALE_COST_SHARE=.85;static STOCHASTIC_STEP_FACTOR=1.5;static GOVERNOR_UP_DWELL=2;static GPU_STALE_MS=5e3;static OSCILLATION_FORGET_MS=15e3;static PROBE_BASE_MS=8e3;static PROBE_MAX_MS=12e4;static PROBE_SETTLE_MS=1500;static PROBE_FAIL_RATIO=1.1;static DEFAULTS=Object.freeze({renderScale:.5,overscan:0,adaptiveQuality:!0,targetFps:55,denoise:!0,denoiseIterations:2,taa:!0,gi:!1,giHalfRate:!1,ambient:!0,emissiveNEE:!0,emissiveImportance:!0,specular:!0,reflections:!0,refraction:!0,transparency:!0,dispersion:0,volumetric:Object.freeze({enabled:!1}),restir:!0,restirGI:!1,stochasticLights:!1,restirMCap:16,restirWarmAge:0,restirDirectionalBypass:!0,restirReprojectionRescue:!0,restirCandidateImportance:!0,restirLightGrid:!0,restirClampRel:2,restirSamples:1,restirSampleRadius:10,restirDynamicAccept:!1,restirDynamicFreeze:!1,motionVectors:!0,temporalReprojection:!0,motionAdaptive:!1,maxHistory:48,fireflyClamp:4,outputMode:0,costScale:1/96});static PRESETS={quality:{renderScale:.75,denoiseIterations:2,maxHistory:256,taa:!0,restir:!0,giHalfRate:!1,specular:!0},balanced:{renderScale:.5,denoiseIterations:2,maxHistory:48,taa:!0,restir:!0,giHalfRate:!1,specular:!0,volumetric:{enabled:!1},stochasticLights:!1,fireflyClamp:4},performance:{renderScale:.375,denoiseIterations:3,giHalfRate:!0,volumetric:{enabled:!1},stochasticLights:!0},motion:{maxHistory:32,fireflyClamp:2.5,taa:!0,restir:!0}};constructor(e,t={}){this.renderer=e;const i=t;if(this.supported=pe.isSupported(e),!this.supported){console.warn("three-realtime-rt: ray tracing unavailable on this system (needs WebGL2 + EXT_color_buffer_float on a hardware GPU). Falling back to plain three.js rendering."),this.compiled=null,this.frame=0,this.compileError=null,this.status={ok:!1,disabled:[],coreFailure:null,warnings:[]},this._diagDone=!0;return}if(t.preset!==void 0){const o=t.preset;if(typeof o!="string"||!Object.prototype.hasOwnProperty.call(pe.PRESETS,o))throw new Error(`three-realtime-rt: unknown preset "${o}". Valid presets: ${Object.keys(pe.PRESETS).join(", ")}.`);t={...pe.PRESETS[o],...t}}this._qPinned=new Set;for(const o of["restirGI","giHalfRate","restirMCap"])i[o]!==void 0&&this._qPinned.add(o);const n=e.getSize(new le),r=e.getPixelRatio();this._canvasW=Math.floor(n.x*r),this._canvasH=Math.floor(n.y*r),this._overscan=Math.min(.25,Math.max(0,t.overscan??0)),this._renderScale=t.renderScale??.5,this._width=Math.round(this._canvasW*this._padFactor),this._height=Math.round(this._canvasH*this._padFactor),this._crop=new qe(1,1,0,0),this._updateCrop();const a=pe._mixedMrtSupported(e.getContext());a||console.info("three-realtime-rt: mixed fp16/fp32 G-buffer not supported here — using fp32 for all targets."),this.specMRTSupported=pe._specMrtSupported(e),this._splitAccum=t.splitAccum??!0,this.specMRTSupported||console.info("three-realtime-rt: multi-attachment lighting buffer failed the draw probe here (WebKit/iOS) — specular buffer disabled, alpha-blend surfaces render opaque."),this._maxFragTexUnits=e.getContext().getParameter(e.getContext().MAX_TEXTURE_IMAGE_UNITS),this._volumeUnitWarned=!1,this._maxTextureSize=e.getContext().getParameter(e.getContext().MAX_TEXTURE_SIZE),this._maxLights=Ui(t.maxLights),t.maxLights!==void 0&&this._maxLights!==Math.floor(Number(t.maxLights))&&console.warn(`three-realtime-rt: maxLights ${t.maxLights} is out of range; using ${this._maxLights} (1..${xh}).`),this.gbuffer=new wy(this._width,this._height,{mixedPrecision:a,materialPooling:t.gbufferMaterialPooling??!0}),this.rtPass=new Ey(this._scaledW,this._scaledH,{specMRT:this.specMRTSupported,maxLights:this._maxLights}),this.denoisePass=new yu(this._scaledW,this._scaledH),this.specDenoisePass=new yu(this._scaledW,this._scaledH,{blendIsSpec:!0}),this.accumulatePass=new Ly(this._scaledW,this._scaledH),this.composite=new Ny,this.taaPass=new By(this._width,this._height),this._sceneColor=this._makeColorTarget(this._width,this._height),this._copyPass=new Qy,this.compiled=null,this.frame=0,this._denoiserPlugin=null,this.denoiserPluginPostIterations=t.denoiserPluginPostIterations??0,this.denoiserPluginPostHistory=t.denoiserPluginPostHistory??0,this.outputMode=0,this.rawInputView=!1,this.costScale=t.costScale??1/96,this.ambient=t.ambient??!0,this.envColor=t.envColor??new ue(.03,.04,.06),this.envIntensity=t.envIntensity??1,this.eps=t.eps??.001,this._autoEps=t.eps==null,this.temporalReprojection=t.temporalReprojection??!0,this.maxHistory=t.maxHistory??48,this.motionAdaptive=t.motionAdaptive??!1,this.maxHistoryMoving=t.maxHistoryMoving??6,this.lightAdaptive=t.lightAdaptive??!0,this.lightMotionRef=t.lightMotionRef??.01,this.lightMotionDecay=t.lightMotionDecay??.72,this.lightGradK=t.lightGradK??3,this.glassClampScale=t.glassClampScale??4,this.lightMotion=0,this._lightSig=null,this._mt=0,this.taaBlendMoving=t.taaBlendMoving??.4,this.restirMCap=t.restirMCap??16,this.restirMCapMoving=t.restirMCapMoving??this.restirMCap,this.motionRefUv=t.motionRefUv??.015,this.motion=0,this._vpNow=new he,this._vpPrevUnjittered=new he,this._motionValid=!1,this._mv=[new P,new P,new P,new P,new P,new P],this._mq=new xi,this.denoiseMaxStep=t.denoiseMaxStep??0,this.denoiseStepJitter=t.denoiseStepJitter??0,this.denoiseWideDamp=t.denoiseWideDamp??0,this.fireflyClamp=t.fireflyClamp??4,this.gi=t.gi??!1,this.giHalfRate=t.giHalfRate??!1,this.emissiveNEE=t.emissiveNEE??!0,this.emissiveImportance=t.emissiveImportance??!0,this.specular=t.specular??!0,this.reflections=t.reflections??!0,this.refraction=t.refraction??!0,this.transparency=t.transparency??!0,this._absorptionShadows=t.absorptionShadows??!0,this._kmScattering=t.kmScattering??!1,this._textureTiles=t.textureTiles??!1,this.ior=t.ior??1.5,this.dispersion=t.dispersion??0,this.stochasticLights=t.stochasticLights??!1,this.adaptiveQuality=t.adaptiveQuality??!0,this.renderScaleMax=Math.min(1,Math.max(.2,t.renderScaleMax??1)),this.renderScaleMin=Math.min(this.renderScaleMax,Math.max(.2,t.renderScaleMin??.2)),this._pluginRan=!1,this._renderScale>this.renderScaleMax&&(this._renderScale=this.renderScaleMax),this.targetFps=t.targetFps??55,this.overloadProtection=t.overloadProtection??!0,this._overloadStrikes=0,this._obLastT=null,this.gpuTiming=t.gpuTiming??"auto",this._gpuTimer=this.gpuTiming===!1?null:new tx(e),this._gpuActive=!!(this._gpuTimer&&this._gpuTimer.supported),this._gpuNullSince=null,this._gpuGaveUp=!1,this._qProbe=null,this._qProbeBackoff=pe.PROBE_BASE_MS,this._qProbeFail=null,this._qEma=null,this._qLastT=null,this._qLastChange=0,this._qSamples=0,this._qLastDir=0,this._qOscillating=!1,this._qFreeWins=null,this._qFastStreak=0,this._presetName=t.preset!==void 0?String(t.preset):"custom",this.canvasScaleHook=t.canvasScaleHook??null,this._canvasLevelIdx=0,this.denoise=t.denoise??!0,this.denoiseIterations=t.denoiseIterations??2,this.taa=t.taa??!0,this.taaBlend=t.taaBlend??.1,this.taaJitterScale=t.taaJitterScale??1,this.volumetric={enabled:t.volumetric?.enabled??!1,density:t.volumetric?.density??.015,maxDist:t.volumetric?.maxDist??40,zones:t.volumetric?.zones??[]},this.volumetricPass=new zy(this._volW,this._volH,{maxLights:this._maxLights}),this.restir=t.restir??!0,this.restirSamples=t.restirSamples??1,this.restirSampleRadius=t.restirSampleRadius??10,this.restirWarmAge=t.restirWarmAge??0,this.restirDirectionalBypass=t.restirDirectionalBypass??!0,this.restirReprojectionRescue=t.restirReprojectionRescue??!0,this.restirCandidateImportance=t.restirCandidateImportance??!0,this.restirClampRel=t.restirClampRel??2,this.restirPass=new Vy(this._scaledW,this._scaledH,{maxLights:this._maxLights}),this.restirLightGrid=t.restirLightGrid??!0,this.lightGridPass=new Yy({maxLights:this._maxLights}),this._lightGridDirty=!0,this._lightGridState=null,this.restirDynamicAccept=t.restirDynamicAccept??!1,this.restirDynamicFreeze=t.restirDynamicFreeze??!1,this.motionVectors=t.motionVectors??!0,this.motionVectorsSupported=pe._motionMrtSupported(e),this._motionVectorsActive=!1,this._motionWarned=!1,this._prevModelMatrices=new Map,this._motionAccum=!0,this._motionRestir=!0,this._motionTaa=!1,this.restirGI=t.restirGI??!1,this.restirGIMCap=t.restirGIMCap??20,this.restirGISpatialTaps=t.restirGISpatialTaps??2,this.restirGIValidate=t.restirGIValidate??8,this.restirGIResolveAlpha=t.restirGIResolveAlpha??1,this.restirGIConfLow=t.restirGIConfLow??.3,this.restirGIChromaMean=t.restirGIChromaMean??!0,this.restirGIVisFallback=t.restirGIVisFallback??!0,this.giReservoirPass=new qy(this._scaledW,this._scaledH,{maxLights:this._maxLights}),this._giMissWarned=!1,this.fog={enabled:t.fog?.enabled??!1,color:t.fog?.color??new ue(.5,.6,.7),density:t.fog?.density??.05},this.sky={enabled:t.sky?.enabled??!1,sunDir:t.sky?.sunDir??new P(.4,.8,.45).normalize(),sunColor:t.sky?.sunColor??new ue(1,.9,.75),zenith:t.sky?.zenith??new ue(.18,.34,.62),horizon:t.sky?.horizon??new ue(.7,.8,.9),intensity:t.sky?.intensity??1},this._invViewProj=new he,this._jitterIndex=0,this._jitteredViewProj=new he,this._jitterUv=new le,this._prevJitterUv=new le,this._prevViewProj=new he,this._camWorldPos=new P,this._needsClear=!0,this._denoiseWarp=new he,this._denoiseProj=[1,1,0,0],this.overloadProtection&&this._width*this._height>32e5&&this._renderScale>.375&&(console.warn(`three-realtime-rt: ${(this._width*this._height/1e6).toFixed(1)}M-pixel drawing buffer — clamping lighting renderScale to 0.375 (overloadProtection). Raise renderScale manually, enable adaptiveQuality, or pass overloadProtection: false to opt out.`),this._renderScale=.375),this.compileError=null,this.status={ok:!0,disabled:[],coreFailure:null,warnings:[]},this._diagDone=!1,this._diagFrames=0,this._diagStable=0,this._diagSig="",this._diagHandled=new Set,this._compileErrSev=-1,this._staleDone=!1,this._staleWarnings=0,this._implicitCompileWarned=!1}get preset(){return this._presetName}applyPreset(e){const t=pe.PRESETS[e];if(!t)throw new Error(`three-realtime-rt: unknown preset "${e}". Valid presets: ${Object.keys(pe.PRESETS).join(", ")}.`);for(const i of Object.keys(t)){const n=t[i];n!==null&&typeof n=="object"&&!Array.isArray(n)&&this[i]&&typeof this[i]=="object"?Object.assign(this[i],n):this[i]=n}return this._presetName=e,this._rearmGovernor(),this}_rearmGovernor(){this._freshMeasurement(),this._qLastT=null,this._qLastChange=0,this._qLastDir=0,this._qOscillating=!1,this._qFastStreak=0,this._qFreeWins=null,this._qProbe=null,this._qProbeBackoff=pe.PROBE_BASE_MS,this._qProbeFail=null,this.adaptiveQuality&&console.info(`three-realtime-rt: preset "${this._presetName}" applied  -  adaptive quality re-armed at this baseline.`)}_passClass(e){switch(e){case"rt:gbuffer":case"rt:lighting":case"rt:composite":return{core:!0};case"rt:restir-temporal":case"rt:restir-spatial":return{feature:"restir",disable:()=>{this.restir=!1}};case"rt:gi-reservoir":return{feature:"restirGI",disable:()=>{this.restirGI=!1}};case"rt:lightgrid-weights":case"rt:lightgrid-cdf":return{feature:"restirLightGrid",disable:()=>{this.restirLightGrid=!1,this.restirCandidateImportance=!1}};case"rt:denoise":return{feature:"denoise",disable:()=>{this.denoise=!1}};case"rt:volumetric":return{feature:"volumetric",disable:()=>{this.volumetric.enabled=!1}};case"rt:taa":case"rt:taa-copy":return{feature:"taa",disable:()=>{this.taa=!1}};case"rt:specular":return{feature:"specular",disable:()=>{this.specular=!1}};default:return{aux:!0}}}_diagLog(e){return([e&&e.fragmentShader&&e.fragmentShader.log,e&&e.vertexShader&&e.vertexShader.log,e&&e.programLog].find(i=>i&&i.trim())||"(no driver log)").trim().split(`
`)[0].slice(0,200)}_noteCompileError(e,t){t>this._compileErrSev&&(this.compileError=e,this._compileErrSev=t)}_handleFailedProgram(e,t){const i=this._diagLog(t),n=this._passClass(e),r=`${e}: ${i}`;this.status.ok=!1,n.core?(this.status.coreFailure||(this.status.coreFailure=r),this._noteCompileError(r,2),console.warn(`three-realtime-rt: core pass ${e} failed to link — the image will be black (no fallback for a core pass). Driver log: ${i}`)):n.feature?(n.disable(),this.status.disabled.push({pass:e,feature:n.feature,reason:i}),this._noteCompileError(r,1),console.warn(`three-realtime-rt: pass ${e} failed to link — auto-disabled "${n.feature}" to keep the image lit. Driver log: ${i}`)):(this._noteCompileError(r,0),console.warn(`three-realtime-rt: auxiliary pass ${e} failed to link (non-fatal — resize history is not carried). Driver log: ${i}`))}_scanPrograms(){if(this._diagDone)return;const e=this.renderer.info&&this.renderer.info.programs;if(!e){this._diagDone=!0;return}this._diagFrames++;let t="";for(const i of e){const n=i&&i.name;if(!n||n.slice(0,3)!=="rt:")continue;t+=n+"|";const r=i.diagnostics;r&&r.runnable===!1&&!this._diagHandled.has(n)&&(this._diagHandled.add(n),this._handleFailedProgram(n,r))}t===this._diagSig?this._diagStable++:(this._diagStable=0,this._diagSig=t),(this._diagFrames>=pe.DIAG_MIN_FRAMES&&this._diagStable>=pe.DIAG_STABLE_FRAMES||this._diagFrames>=pe.DIAG_WINDOW_FRAMES)&&(this._diagDone=!0)}_overloadBrake(){if(typeof document<"u"&&document.visibilityState==="hidden"){this._obLastT=null;return}const e=performance.now(),t=this._obLastT==null?null:e-this._obLastT;this._obLastT=e,t!=null&&(t>400&&t<1e4?this._overloadStrikes++:t<200&&(this._overloadStrikes=0),!(this._overloadStrikes<3)&&(this._overloadStrikes=0,this._renderScale>.2?(this.denoiseIterations=Math.min(this.denoiseIterations,3),this.stochasticLights=!0,this.renderScale=Math.max(.2,Math.round(this._renderScale*.5*20)/20),console.warn(`three-realtime-rt: frames exceeding 400ms — overload brake cut lighting to ${Math.round(this._renderScale*100)}%. Lower your canvas resolution or enable adaptiveQuality.`)):(this.volumetric.enabled||this.reflections||this.refraction)&&(this.volumetric.enabled=!1,this.reflections=!1,this.refraction=!1,console.warn("three-realtime-rt: still overloaded at minimum lighting scale — disabling volumetric/reflections/refraction."))))}_warn(e,t){console.warn(t),this._recordWarning(e,t)}_recordWarning(e,t){const i=this.status&&this.status.warnings;if(i){for(let n=0;n<i.length;n++)if(i[n].code===e&&i[n].message===t)return;i.push({code:e,message:t})}}_absorbCompilerWarnings(e){const t=e&&e.warnings;if(!(!t||t.length===0))for(let i=0;i<t.length;i++)this._recordWarning(t[i].code,t[i].message)}_checkStale(){if(this._staleDone)return;const e=this.compiled&&this.compiled.staticSources;if(!e||e.length===0){this._staleDone=!0;return}let t=0;for(let i=0;i<e.length;i++){const n=e[i];if(n.warned)continue;const r=n.ref.deref();if(!r){n.warned=!0;continue}let a=null;const o=r.geometry,l=o?o.getAttribute("position"):null;if(!l||l.version!==n.version)a="geometry";else{const c=r.matrixWorld.elements,u=n.matrix;for(let h=0;h<16;h++){const d=c[h]-u[h];if((d<0?-d:d)>1e-6*(1+(u[h]<0?-u[h]:u[h]))){a="transform";break}}}if(!a){t++;continue}if(n.warned=!0,this._staleWarnings++,a==="geometry"?this._warn("stale-geometry",`three-realtime-rt: position buffer of ${n.name} changed after compileScene() but it is not a dynamic mesh — traced lighting still uses the ORIGINAL shape. Add it to compileScene(scene, {dynamicMeshes:[...]}) and set mesh.userData.rtDeforming = true, then call updateDynamic() each frame.`):this._warn("stale-transform",`three-realtime-rt: ${n.name} was moved after compileScene() but it is not a dynamic mesh — traced lighting still uses the ORIGINAL transform (its shadow stays behind). Recompile with compileScene(scene), or declare it in compileScene(scene, {dynamicMeshes:[...]}) and call updateDynamic() each frame.`),this._staleWarnings>=pe.MAX_STALE_WARNINGS){this._staleDone=!0;return}}t===0&&(this._staleDone=!0)}_makeColorTarget(e,t){const i=new xt(e,t,{minFilter:Ke,magFilter:Ke,format:Xe,type:Et,depthBuffer:!1,stencilBuffer:!1});return i.texture.generateMipmaps=!1,i}compileScene(e,t){if(!this.supported)return null;const i=t?.textureTiles!==void 0?{...t,maxLights:this._maxLights}:{...t,textureTiles:this._textureTiles,maxLights:this._maxLights};t?.maxLights!==void 0&&Ui(t.maxLights)!==this._maxLights&&console.warn(`three-realtime-rt: compileScene({ maxLights: ${t.maxLights} }) ignored — the shaders were built for maxLights: ${this._maxLights}. Pass it to the constructor instead.`);let n;try{n=fy(e,i)}catch(r){if(/no meshes found/.test(String(r&&r.message)))return this._emptyWarned||(console.warn("three-realtime-rt: compileScene() called on a scene with no traceable meshes — keeping the current scene. Until meshes are added and recompiled, render() falls back to plain rasterization (no crash, no black)."),this._emptyWarned=!0),this.compiled;throw r}return this.compiled&&this.compiled.dispose(),this.compiled=n,this._absorbCompilerWarnings(n),this._staleDone=!1,this.compiled.emissiveTriCount>0&&this.emissiveNEE&&!this.restir&&console.info("[three-realtime-rt] this scene has emissive area lights but restir is off — emissive NEE alone is the noisiest sampling path; enable restir for a large noise win."),this._autoEps&&(this.eps=Math.min(Math.max(.001,this.compiled.sceneDiagonal*.0012),.05)),this.rtPass.setAbsorptionShadows(this._absorptionShadows),this.rtPass.setKmScattering(this._kmScattering),this.rtPass.setTextureTiles(this._textureTiles),this.giReservoirPass.setTextureTiles(this._textureTiles),this.rtPass.setCompiledScene(this.compiled),this.volumetricPass.setCompiledScene(this.compiled),this.restirPass.setCompiledScene(this.compiled),this.giReservoirPass.setCompiledScene(this.compiled),this._syncLightGrid(!0),this.gbuffer.setDynamicMeshes(this.compiled.hasDynamic?this.compiled.dynamic.map(r=>r.mesh):null),this._syncVolumeAlbedo(),this.resetAccumulation(),this.compiled}_syncVolumeAlbedo(){const e=this.compiled?this.compiled.volumeAlbedo:null;this.gbuffer.setVolume(!!e);const t=!!e&&this._maxFragTexUnits>=17;this.rtPass.setVolumeAlbedo(t?e:null),e&&!t&&!this._volumeUnitWarned&&(this._volumeUnitWarned=!0,console.info(`[three-realtime-rt] volume albedo: this GPU exposes only ${this._maxFragTexUnits} fragment texture units (< 17 needed for the traced-bounce sampler), so GI / reflection bounces use the material's flat base colour. Primary visibility still shows the full 3D-texture field.`))}updateDynamic(){this.compiled&&this.compiled.updateDynamic()}updateLights(e){!this.supported||!this.compiled||(Ah(e,this.compiled),this._measureLightMotion(),this.rtPass.setTextureTiles(this._textureTiles),this.giReservoirPass.setTextureTiles(this._textureTiles),this.rtPass.setCompiledScene(this.compiled),this.volumetricPass.setCompiledScene(this.compiled),this.restirPass.setCompiledScene(this.compiled),this.giReservoirPass.setCompiledScene(this.compiled),this.compiled.lightsChanged&&(this._lightUpload=yy(this.compiled,this.renderer),this._lightGridDirty=!0))}_syncLightGrid(e){if(!this.compiled||!this.lightGridPass)return;e&&(this.lightGridPass.setCompiledScene(this.compiled,this._maxTextureSize),this._lightGridDirty=!0,this._lightGridState=null);const t=(this.restirLightGrid?1:0)+"|"+(this.restirDirectionalBypass?1:0)+"|"+this.compiled.lightCount;t!==this._lightGridState&&(this._lightGridState=t,this._lightGridDirty=!0),this._lightGridDirty&&(this.lightGridPass.setCompiledScene(this.compiled,this._maxTextureSize),this.lightGridPass.build(this.renderer,{dirBypass:!!this.restirDirectionalBypass,cellRows:!!this.restirLightGrid}),this._lightGridDirty=!1,this.restirPass.setLightGrid(this.lightGridPass.texture,!!this.restirLightGrid))}setDenoiserPlugin(e){if(e){for(const t of["render","setSize","resetHistory","dispose"])if(typeof e[t]!="function")throw new Error(`RealtimeRaytracer.setDenoiserPlugin: plugin is missing ${t}(). A denoiser plugin must implement render, setSize, resetHistory and dispose.`)}if(this._denoiserPlugin=e||null,this._pluginRan=!1,!!this.supported){if(this._denoiserPlugin){this._denoiserPlugin.setSize(this._scaledW,this._scaledH),this._denoiserPlugin.resetHistory();const t=this._denoiserPlugin.preferences&&this._denoiserPlugin.preferences.renderScale;if(t){const n=this._appRenderScaleMax??this.renderScaleMax;if(this._appRenderScaleMax=n,Number.isFinite(t.max)&&(this.renderScaleMax=Math.min(n,Math.max(.2,t.max))),Number.isFinite(t.min)&&(this.renderScaleMin=Math.min(this.renderScaleMax,Math.max(.2,t.min))),Number.isFinite(t.preferred)){const r=Math.min(this.renderScaleMax,Math.max(this.renderScaleMin,t.preferred));Math.abs(r-this._renderScale)>1e-6&&(this.renderScale=r)}}const i=this._denoiserPlugin.preferences||{};this._postFromPlugin&&(this.denoiserPluginPostHistory=0,this.denoiserPluginPostIterations=0),this._postFromPlugin=!1,!(this.denoiserPluginPostHistory>0)&&Number.isFinite(i.postHistoryFrames)&&i.postHistoryFrames>0&&(this.denoiserPluginPostHistory=Math.round(i.postHistoryFrames),this._postFromPlugin=!0),!(this.denoiserPluginPostIterations>0)&&Number.isFinite(i.postIterations)&&i.postIterations>0&&(this.denoiserPluginPostIterations=Math.round(i.postIterations),this._postFromPlugin=!0)}else this._appRenderScaleMax!==void 0&&(this.renderScaleMax=this._appRenderScaleMax,this._appRenderScaleMax=void 0,this.renderScaleMin=.2),this._postFromPlugin&&(this.denoiserPluginPostHistory=0,this.denoiserPluginPostIterations=0,this._postFromPlugin=!1);this.resetAccumulation()}}get denoiserPluginRan(){return!!this._pluginRan}get denoiserPlugin(){return this._denoiserPlugin}get denoiserPluginActive(){return!!(this._denoiserPlugin&&this.specMRTSupported&&this._splitAccum)}resetAccumulation(){this.supported&&(this._needsClear=!0,this.taaPass&&this.taaPass.reset(),this._denoiserPlugin&&this._denoiserPlugin.resetHistory())}_measureLightMotion(){const e=this.compiled;if(!e)return;const t=e.lightPosType,i=e.lightColorRadius,n=e.lightDirCone,r=this._lightSig;if(this._lightSig={pos:Float32Array.from(t),col:Float32Array.from(i),dir:Float32Array.from(n)},!this.lightAdaptive){this.lightMotion=0;return}if(!r||r.pos.length!==t.length||r.dir.length!==n.length){r&&(this.lightMotion=1);return}const a=e.sceneDiagonal>0?e.sceneDiagonal:1;let o=0;for(let l=0;l<t.length;l+=4){const c=t[l]-r.pos[l],u=t[l+1]-r.pos[l+1],h=t[l+2]-r.pos[l+2],d=Math.abs(t[l+3]-r.pos[l+3]),f=Math.sqrt(c*c+u*u+h*h)/a;o=Math.max(o,f/this.lightMotionRef,d);const v=n[l]-r.dir[l],_=n[l+1]-r.dir[l+1],m=n[l+2]-r.dir[l+2],p=Math.sqrt(v*v+_*_+m*m)*.5,y=Math.abs(n[l+3]-r.dir[l+3]);o=Math.max(o,p/this.lightMotionRef,y);for(let g=0;g<3;g++){const x=i[l+g],S=r.col[l+g],b=Math.max(Math.abs(x),Math.abs(S),1e-4);o=Math.max(o,Math.abs(x-S)/b)}}this.lightMotion=Math.max(this.lightMotion,Math.min(1,o))}_temporalMotion(){const e=this.motionAdaptive?this.motion:0;return Math.max(e,this.lightAdaptive?this.lightMotion:0)}get _padFactor(){return 1+2*this._overscan}_updateCrop(){this._crop.set(this._canvasW/this._width,this._canvasH/this._height,(this._width-this._canvasW)*.5/this._width,(this._height-this._canvasH)*.5/this._height)}get _scaledW(){return Math.max(1,Math.floor(this._width*this._renderScale))}get _scaledH(){return Math.max(1,Math.floor(this._height*this._renderScale))}get _volW(){return Math.max(1,this._width>>2)}get _volH(){return Math.max(1,this._height>>2)}get absorptionShadows(){return this._absorptionShadows}set absorptionShadows(e){const t=!!e;t!==this._absorptionShadows&&(this._absorptionShadows=t,this.supported&&(this.rtPass.setAbsorptionShadows(t),this.resetAccumulation()))}get kmScattering(){return this._kmScattering}set kmScattering(e){const t=!!e;t!==this._kmScattering&&(this._kmScattering=t,this.supported&&(this.rtPass.setKmScattering(t),this.resetAccumulation()))}get maxLights(){return this._maxLights}set maxLights(e){if(Ui(e)!==this._maxLights)throw new Error(`three-realtime-rt: maxLights is a constructor option (currently ${this._maxLights}) and cannot be changed on a live renderer — it is compiled into every lighting shader and into the scene-data texture. Construct with new RealtimeRaytracer(renderer, { maxLights: ${e} }).`)}get lightCount(){return this.compiled?this.compiled.lightCount:0}get textureTiles(){return this._textureTiles}set textureTiles(e){this._textureTiles=e!==!1?e&&typeof e=="object"?e:{size:128,max:16}:!1}get renderScale(){return this._renderScale}set renderScale(e){this._renderScale=e,this.setSize(this._canvasW,this._canvasH)}get overscan(){return this._overscan}set overscan(e){const t=Math.min(.25,Math.max(0,e||0));t!==this._overscan&&(this._overscan=t,this.setSize(this._canvasW,this._canvasH),this.resetAccumulation())}setSize(e,t){if(!this.supported)return;this._canvasW=Math.floor(e),this._canvasH=Math.floor(t),this._width=Math.round(this._canvasW*this._padFactor),this._height=Math.round(this._canvasH*this._padFactor),this._updateCrop();const i=this._scaledW,n=this._scaledH,r=this.rtPass.targetA.width!==i||this.rtPass.targetA.height!==n,a=this.taaPass.targetA.width!==this._width||this.taaPass.targetA.height!==this._height;r&&(this.rtPass.resizeCarry(this.renderer,this._copyPass,i,n,pe.HISTORY_CARRY_FRAMES),this.denoisePass.setSize(i,n),this.specDenoisePass.setSize(i,n),this.accumulatePass.setSize(i,n),this._denoiserPlugin&&this._denoiserPlugin.setSize(i,n),this.restirPass.setSize(i,n),this.restirPass.clearHistory(this.renderer),this.giReservoirPass.setSize(i,n),this.giReservoirPass.clearHistory(this.renderer)),a&&(this.gbuffer.setSize(this._width,this._height),this.volumetricPass.setSize(this._volW,this._volH),this.volumetricPass.clearHistory(this.renderer),this.taaPass.resizeCarry(this.renderer,this._copyPass,this._width,this._height),this._sceneColor.setSize(this._width,this._height))}_takeFreeWins(e){if(this._qFreeWins)return!1;const t={scale:this._renderScale};let i=!1;return this.gi&&!this.giHalfRate&&!this._qPinned.has("giHalfRate")&&(t.giHalfRate=!1,this.giHalfRate=!0,i=!0),this.gi&&this.denoise&&this.denoiseIterations>0&&!this.restirGI&&!this._qPinned.has("restirGI")&&(t.restirGI=!1,this.restirGI=!0,i=!0,this.denoiseIterations>pe.GOVERNOR_MAX_DENOISE&&(t.denoiseIterations=this.denoiseIterations,this.denoiseIterations=pe.GOVERNOR_MAX_DENOISE)),this.restirMCap>16&&!this._qPinned.has("restirMCap")&&(t.restirMCap=this.restirMCap,this.restirMCap=16,i=!0),this._qFreeWins=t,i?(this._recordChange(-1,e),this._freshMeasurement(),console.info("three-realtime-rt: adaptive quality → free wins first ("+Object.keys(t).filter(n=>n!=="scale").join(", ")+"), resolution untouched"),!0):!1}_releaseFreeWins(e){const t=this._qFreeWins;if(!t)return!1;this._qFreeWins=null;const i=Object.keys(t).filter(n=>n!=="scale");if(!i.length)return!1;for(const n of i)this[n]=t[n];return this._recordChange(1,e),this._freshMeasurement(),console.info(`three-realtime-rt: adaptive quality → returned ${i.join(", ")}`),!0}_adaptQuality(){if(this._renderScale>this.renderScaleMax&&(this.renderScale=this.renderScaleMax),typeof document<"u"&&document.visibilityState==="hidden"){this._qLastT=null;return}const e=performance.now(),t=this._qLastT==null?null:e-this._qLastT;if(this._qLastT=e,t==null||t>2e3||(this._qEma=this._qEma==null?t:this._qEma*.9+t*.1,this._qSamples=(this._qSamples||0)+1,this._qSamples<pe.GOVERNOR_WARMUP_FRAMES))return;this._qOscillating&&e-this._qLastChange>pe.OSCILLATION_FORGET_MS&&(this._qOscillating=!1);const i=1e3/this.targetFps,n=this._qEma/i,r=this._gpuUtilisation(e,i);if(this._qProbe){this._judgeProbe(e,n,r);return}const a=this._qOscillating?5e3:2e3;if(e-this._qLastChange<a)return;const o=this._qOscillating?.6:.8,l=this._qOscillating?1.24:1.12,c=this._qOscillating?pe.GPU_BUDGET_DROP_OSC:pe.GPU_BUDGET_DROP,u=n>l||r!=null&&r>c,h=this._qOscillating?pe.GPU_TARGET_UTIL_OSC:pe.GPU_TARGET_UTIL,d=r!=null?r<h:n<o;if(!u&&!d){this._qFastStreak=0,this.gpuTimingActive||this._raiseQuality(e,null,n);return}if(u){if(this._qFastStreak=0,this._takeFreeWins(e))return;const f=Math.max(n,r??0);let v=this._renderScale*Math.pow(1/f,.35);if(v=Math.max(this._renderScale-pe.MAX_SCALE_STEP,v),v=Math.round(Math.min(1,Math.max(this.renderScaleMin||.2,v))*20)/20,v<=.2&&this._renderScale<=.2&&this.canvasScaleHook&&this._canvasLevelIdx<pe.CANVAS_LEVELS.length-1){this._setCanvasLevel(this._canvasLevelIdx+1,-1,e);return}if(this._renderScale-v<.045)return;this._commitScale(v,-1,e);return}this._qFastStreak=(this._qFastStreak||0)+1,!(this._qFastStreak<pe.GOVERNOR_UP_DWELL)&&this._raiseQuality(e,r,n)}_gpuUtilisation(e,t){if(!this.gpuTimingActive)return null;const i=this._gpuTimer.costMs;return i==null?(this._gpuNullSince==null?this._gpuNullSince=e:e-this._gpuNullSince>pe.GPU_STALE_MS&&(this._gpuGaveUp=!0,console.info("three-realtime-rt: GPU timing stopped returning results — adaptive quality falls back to speculative probing for headroom.")),null):(this._gpuNullSince=null,i/t)}static _scaleStepCost(e,t){let i=1+pe.SCALE_COST_SHARE*((t/e)**2-1);return pe._qualityFor(t).stochasticLights!==pe._qualityFor(e).stochasticLights&&(i*=pe.STOCHASTIC_STEP_FACTOR),i}_raiseQuality(e,t,i){const n=pe.CANVAS_LEVELS;if(this.canvasScaleHook&&this._canvasLevelIdx>0){const a=this._canvasLevelIdx;return this._takeUpStep("canvas",a,(n[a-1]/n[a])**2,t,e)}if(this._renderScale<this.renderScaleMax){const a=this._renderScale,o=Math.min(this.renderScaleMax,pe._scaleUpFrom(a));return this._takeUpStep("scale",a,pe._scaleStepCost(a,o),t,e)}return(t!=null?t<.5:i<.5)&&this._qFreeWins&&this._canvasLevelIdx===0&&this._renderScale>=this.renderScaleMax?this._releaseFreeWins(e):!1}static _scaleUpFrom(e){return Math.min(1,Math.round((e+pe.MAX_SCALE_UP_STEP)*20)/20)}_takeUpStep(e,t,i,n,r){const a=this._qOscillating?pe.GPU_TARGET_UTIL_OSC:pe.GPU_TARGET_UTIL,o=n==null?null:n*i,l=o==null||o>a;if(l){if(o!=null&&o>pe.GPU_PROBE_CEIL)return!1;const u=this._qProbeFail,h=!!u&&u.kind===e&&u.from===t;if(r-(h?u.at:this._qLastChange)<(h?this._qProbeBackoff:pe.PROBE_BASE_MS))return!1}const c=this._qEma;return e==="canvas"?this._setCanvasLevel(t-1,1,r):this._commitScale(pe._scaleUpFrom(t),1,r),l&&(this._qProbe={kind:e,from:t,at:r,ema:c},console.info(`three-realtime-rt: adaptive quality → that ${e} step is a PROBE (predicted ${o==null?"unknown":Math.round(o*100)+"%"} of frame budget); it will be reverted if it does not pay`)),!0}_commitScale(e,t,i){const n=pe._qualityFor(e);this.denoiseIterations=n.denoiseIterations,this.stochasticLights=n.stochasticLights,this.renderScale=e,this._recordChange(t,i),this._freshMeasurement(),console.info(`three-realtime-rt: adaptive quality → ${Math.round(e*100)}% lighting, ${n.denoiseIterations} denoise passes, ${n.stochasticLights?"stochastic":"full"} direct light`)}_setCanvasLevel(e,t,i){this._canvasLevelIdx=e,this.canvasScaleHook(pe.CANVAS_LEVELS[e]),this._recordChange(t,i),this._freshMeasurement(),console.info(`three-realtime-rt: adaptive quality → ${Math.round(pe.CANVAS_LEVELS[e]*100)}% canvas`)}_freshMeasurement(){this._qEma=null,this._gpuNullSince=null,this._gpuTimer&&this._gpuTimer.reset()}_judgeProbe(e,t,i){const n=this._qProbe;if(e-n.at<pe.PROBE_SETTLE_MS||this._qEma==null)return;if(i!=null){const o=i>(this._qOscillating?pe.GPU_BUDGET_DROP_OSC:pe.GPU_BUDGET_DROP);if(this._qProbe=null,!o&&t<=(this._qOscillating?1.24:1.12)){this._acceptProbe(n,e),console.info(`three-realtime-rt: adaptive quality → probe held at ${Math.round(i*100)}% of the GPU frame budget`);return}this._revertProbe(n,e);return}const r=t>(this._qOscillating?1.24:1.12),a=n.ema!=null&&this._qEma>n.ema*pe.PROBE_FAIL_RATIO;if(this._qProbe=null,!r&&!a){this._acceptProbe(n,e),console.info("three-realtime-rt: adaptive quality → probe held (no frame-time cost)");return}this._revertProbe(n,e)}_acceptProbe(e,t){const i=this._qProbeFail;i&&i.kind===e.kind&&i.from===e.from&&(this._qProbeFail=null,this._qProbeBackoff=pe.PROBE_BASE_MS),this._qLastChange=t}_revertProbe(e,t){e.kind==="canvas"?this._setCanvasLevel(e.from,-1,t):this._commitScale(e.from,-1,t);const i=this._qProbeFail&&this._qProbeFail.kind===e.kind&&this._qProbeFail.from===e.from;this._qProbeBackoff=i?Math.min(pe.PROBE_MAX_MS,this._qProbeBackoff*2):pe.PROBE_BASE_MS*2,this._qProbeFail={kind:e.kind,from:e.from,at:t},console.info(`three-realtime-rt: adaptive quality → probe reverted (frame time ${e.ema==null?"?":e.ema.toFixed(1)} → ${this._qEma==null?"?":this._qEma.toFixed(1)} ms); next probe in ${Math.round(this._qProbeBackoff/1e3)}s`)}_updateMotion(e){if(this._vpNow.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),!this._motionValid){this._vpPrevUnjittered.copy(this._vpNow),this._motionValid=!0,this.motion=0;return}const[t,i,n,r,a,o]=this._mv;e.getWorldPosition(t),e.getWorldQuaternion(this._mq),i.set(0,0,-1).applyQuaternion(this._mq),n.set(1,0,0).applyQuaternion(this._mq),r.set(0,1,0).applyQuaternion(this._mq);const l=this.compiled?Math.max(this.compiled.sceneDiagonal*.35,.001):10;let c=0;for(let u=0;u<4;u++){const h=u&1?.3:-.3,d=u&2?.3:-.3;a.copy(t).addScaledVector(i,l).addScaledVector(n,h*l).addScaledVector(r,d*l),o.copy(a).applyMatrix4(this._vpPrevUnjittered),a.applyMatrix4(this._vpNow);const f=a.x-o.x,v=a.y-o.y,_=Number.isFinite(f)&&Number.isFinite(v)?Math.hypot(f,v)*.5:1;_>c&&(c=_)}this.motion=Math.min(1,c/Math.max(1e-6,this.motionRefUv)),this._vpPrevUnjittered.copy(this._vpNow)}_recordChange(e,t){this._qOscillating=e!==0&&this._qLastDir!==0&&e!==this._qLastDir,e!==0&&(this._qLastDir=e),this._qLastChange=t}_syncMotionVectors(){const e=!!(this.motionVectors&&this.motionVectorsSupported);e!==this._motionVectorsActive&&(this._motionVectorsActive=e,this.gbuffer.setMotionVectors(e),e||this._prevModelMatrices.clear(),this.resetAccumulation(),this.motionVectors&&!this.motionVectorsSupported&&!this._motionWarned&&(this._motionWarned=!0,console.warn("three-realtime-rt: motionVectors requested but this GPU lacks the 5-attachment motion MRT (needs MAX_DRAW_BUFFERS >= 5) — falling back to camera-only reprojection."))),this._motionVectorsActive&&(this.gbuffer.setPrevModelMatrices(this._prevModelMatrices),this.gbuffer.setMotionMatrices(this._prevViewProj)),this.accumulatePass.setMotionVectors(this._motionVectorsActive&&this._motionAccum),this.restirPass.setMotionVectors(this._motionVectorsActive&&this._motionRestir),this.taaPass.setMotionVectors(this._motionVectorsActive&&this._motionTaa)}render(e,t){if(!this.supported){this.renderer.render(e,t);return}if(this.adaptiveQuality&&this._adaptQuality(),this.overloadProtection&&this._overloadBrake(),this.compiled||(this.compileScene(e),this.compiled&&!this._implicitCompileWarned&&(this._implicitCompileWarned=!0,this._warn("implicit-compile","three-realtime-rt: render() compiled the scene implicitly (no compileScene() call), so it was compiled with NO options — every mesh is static and updateDynamic() has nothing to update. Call compileScene(scene, options) yourself (e.g. {dynamicMeshes:[...]}) before the first render() if anything moves."))),!this.compiled){this.renderer.render(e,t);return}this.frame+=1,this._gpuTimer&&this._gpuTimer.begin(),this.frame%pe.STALE_CHECK_FRAMES===0&&this._checkStale(),t.updateMatrixWorld();const i=t.projectionMatrix,n=i.elements[0],r=i.elements[5],a=i.elements[8],o=i.elements[9];if(this._updateMotion(t),this._overscan>0){const M=1/this._padFactor;i.elements[0]*=M,i.elements[5]*=M}const l=this.rawInputView&&this.specMRTSupported&&this._splitAccum;if(this.taa&&this.outputMode===0&&!l){this._jitterIndex=(this._jitterIndex+1)%16;const M=this.taaJitterScale,D=(Mu(this._jitterIndex+1,2)-.5)*2*M/this._width,A=(Mu(this._jitterIndex+1,3)-.5)*2*M/this._height;i.elements[8]+=D,i.elements[9]+=A,this._jitterUv.set(-D*.5,-A*.5)}else this._jitterUv.set(0,0);this._jitteredViewProj.copy(i).multiply(t.matrixWorldInverse),this._syncMotionVectors();const c=this.renderer.autoClear;this.renderer.autoClear=!1,this._needsClear&&(this.rtPass.clearHistory(this.renderer),this.accumulatePass.clearHistory(this.renderer),this.volumetricPass.clearHistory(this.renderer),this.restirPass.clearHistory(this.renderer),this.giReservoirPass.clearHistory(this.renderer),this._needsClear=!1),this.gbuffer.render(this.renderer,e,t);const u=this.rtPass.material.uniforms;this.ambient&&this.compiled?(u.uAmbientFlat.value.copy(this.compiled.ambientColor),u.uHemiSky.value.copy(this.compiled.hemiSky),u.uHemiGround.value.copy(this.compiled.hemiGround),u.uHemiUp.value.copy(this.compiled.hemiUp)):(u.uAmbientFlat.value.setRGB(0,0,0),u.uHemiSky.value.setRGB(0,0,0),u.uHemiGround.value.setRGB(0,0,0)),u.uEnvColor.value.copy(this.envColor),u.uEnvIntensity.value=this.envIntensity,u.uEps.value=this.eps,u.uCostView.value=this.outputMode===7,u.uCostScale.value=this.costScale,u.uTemporalReprojection.value=this.temporalReprojection;const h=this._temporalMotion();this._mt=h,this.lightMotion*=this.lightMotionDecay,this.lightMotion<.001&&(this.lightMotion=0),u.uMaxHistory.value=this.maxHistory+(this.maxHistoryMoving-this.maxHistory)*h,u.uFireflyClamp.value=this.fireflyClamp>0?this.fireflyClamp:1e6,u.uGlassClampScale.value=this.glassClampScale,u.uGIEnabled.value=this.gi,u.uGIHalfRate.value=this.giHalfRate;const d=this.restirGI&&this.gi&&this.denoise&&this.denoiseIterations>0;u.uExternalGI.value=d,this.restirGI&&this.gi&&!d&&!this._giMissWarned&&(console.info("[three-realtime-rt] restirGI is on but denoise is off — ReSTIR GI is injected during the à-trous denoise, so enable denoise (denoiseIterations >= 1) to see its contribution."),this._giMissWarned=!0),d&&(this._giMissWarned=!1),u.uEmissiveCount.value=this.emissiveNEE?this.compiled.emissiveTriCount:0,u.uEmissiveCDF.value=this.emissiveImportance,u.uReflEnabled.value=this.reflections,u.uRefrEnabled.value=this.refraction,u.uBlendEnabled.value=this.transparency,u.uIor.value=this.ior,u.uDispersion.value=Math.min(.5,Math.max(0,this.dispersion)),u.uLightStochastic.value=this.stochasticLights,u.uRestirSamples.value=Math.max(1,Math.min(4,this.restirSamples|0)),u.uRestirTapRadius.value=Math.max(2,this.restirSampleRadius),u.uRestirWarmAge.value=Math.max(0,this.restirWarmAge||0),u.uRestirClampRel.value=Math.max(0,this.restirClampRel||0),u.uDirBypass.value=!!this.restirDirectionalBypass,u.uSkyEnabled.value=this.sky.enabled,u.uSunDir.value.copy(this.sky.sunDir),u.uSunColor.value.copy(this.sky.sunColor),u.uSkyZenith.value.copy(this.sky.zenith),u.uSkyHorizon.value.copy(this.sky.horizon),u.uSkyIntensity.value=this.sky.intensity,u.uPrevViewProj.value.copy(this._prevViewProj),u.uViewProj.value.copy(this._jitteredViewProj),u.uCameraPos.value.copy(t.getWorldPosition(this._camWorldPos));let f=null;this.restir&&(this.restirPass.setEmissiveCount(this.emissiveNEE?this.compiled.emissiveTriCount:0),this.restirPass.setDynamic(this.restirDynamicAccept,this.restirDynamicFreeze),this.restirPass.setDirectionalBypass(this.restirDirectionalBypass),this.restirPass.setReprojectionRescue(this.restirReprojectionRescue),this.restirPass.setCandidateImportance(this.restirCandidateImportance),this.restirPass.setEmissiveImportance(this.emissiveImportance),this._syncLightGrid(!1),f=this.restirPass.render(this.renderer,this.gbuffer,this._prevViewProj,this._camWorldPos,this.frame,this.eps,this.restirMCap+(this.restirMCapMoving-this.restirMCap)*h,this._jitteredViewProj));let v=null;d&&(this.giReservoirPass.setEmissiveCount(this.emissiveNEE?this.compiled.emissiveTriCount:0),v=this.giReservoirPass.render(this.renderer,this.gbuffer,this._prevViewProj,this._camWorldPos,this.frame,this.eps,{fireflyClamp:this.fireflyClamp>0?this.fireflyClamp:1e6,mCap:this.restirGIMCap,spatialTaps:Math.max(0,Math.min(4,this.restirGISpatialTaps|0)),validateInterval:Math.max(0,this.restirGIValidate|0),resolveAlpha:Math.min(1,Math.max(.01,this.restirGIResolveAlpha)),confLow:Math.min(1,Math.max(0,this.restirGIConfLow)),chromaMean:this.restirGIChromaMean,visFallback:this.restirGIVisFallback,emissiveCDF:this.emissiveImportance,envColor:this.envColor,envIntensity:this.envIntensity,skyEnabled:this.sky.enabled,sunDir:this.sky.sunDir,sunColor:this.sky.sunColor,skyZenith:this.sky.zenith,skyHorizon:this.sky.horizon,skyIntensity:this.sky.intensity}));let _,m,p;const y=!!(this._denoiserPlugin&&this.specMRTSupported&&this._splitAccum);if(y){const M=this.rtPass.renderRaw(this.renderer,this.gbuffer,this.frame,f);this._denoiseWarp.multiplyMatrices(this._prevViewProj,t.matrixWorld);const D=t.projectionMatrix.elements;this._denoiseProj[0]=D[0],this._denoiseProj[1]=D[5],this._denoiseProj[2]=D[8],this._denoiseProj[3]=D[9];const A=this._ctxLightingSize||(this._ctxLightingSize=[0,0]),N=this._ctxGbufferSize||(this._ctxGbufferSize=[0,0]);A[0]=this._scaledW,A[1]=this._scaledH,N[0]=this._width,N[1]=this._height;const I=this._denoiserPlugin.render(this.renderer,M.rawIrradiance,M.rawSpecular,this.gbuffer,t.matrixWorldInverse,{warp:this._denoiseWarp,proj:this._denoiseProj,motion:this._motionVectorsActive?this.gbuffer.motion:null,frame:this.frame,lightingSize:this._ctxLightingSize,gbufferSize:this._ctxGbufferSize}),U=!!(I&&I.irradiance);if(this._pluginRan=U,U){_=I.irradiance,p=this.specular?I.specular:null,this._momentsTex=null;const B=I.irradiance.image,K=!B||!B.width||B.width===this._scaledW&&B.height===this._scaledH;if(l)_=M.rawIrradiance,p=this.specular?M.rawSpecular:null;else if(K){const k=Math.max(0,Math.round(this.denoiserPluginPostHistory||0));if(k>0&&this.outputMode!==7){const j=this.accumulatePass.render(this.renderer,_,p||M.rawSpecular,this.gbuffer,this._prevViewProj,this._jitteredViewProj,this._camWorldPos,this.eps,k,{preFireflyClamp:0,historyClampK:0,lightMotion:this.lightAdaptive?this.lightMotion:0,gradK:this.lightGradK});_=j.irradiance,this.specular&&p&&(p=j.specular)}const X=Math.max(0,Math.round(this.denoiserPluginPostIterations||0));X>0&&this.outputMode!==7&&(_=this.denoisePass.render(this.renderer,_,this.gbuffer,this._camWorldPos,this.eps,X,v,{maxStep:this.denoiseMaxStep,stepJitter:this.denoiseStepJitter,wideDamp:this.denoiseWideDamp,frame:this.frame,momentsTexture:null}))}}else{const B=this.accumulatePass.render(this.renderer,M.rawIrradiance,M.rawSpecular,this.gbuffer,this._prevViewProj,this._jitteredViewProj,this._camWorldPos,this.eps,this.maxHistory+(this.maxHistoryMoving-this.maxHistory)*this._mt,{preFireflyClamp:0,historyClampK:0,lightMotion:this.lightAdaptive?this.lightMotion:0,gradK:this.lightGradK});_=B.irradiance,m=B.specular,this._momentsTex=B.moments}}else if(l){const M=this.rtPass.renderRaw(this.renderer,this.gbuffer,this.frame,f);_=M.rawIrradiance,p=this.specular?M.rawSpecular:null,this._momentsTex=null}else if(this.specMRTSupported&&this._splitAccum){const M=this.rtPass.renderRaw(this.renderer,this.gbuffer,this.frame,f),D=this.accumulatePass.render(this.renderer,M.rawIrradiance,M.rawSpecular,this.gbuffer,this._prevViewProj,this._jitteredViewProj,this._camWorldPos,this.eps,this.maxHistory+(this.maxHistoryMoving-this.maxHistory)*this._mt,{preFireflyClamp:0,historyClampK:0,lightMotion:this.lightAdaptive?this.lightMotion:0,gradK:this.lightGradK});_=D.irradiance,m=D.specular,this._momentsTex=D.moments}else({irradiance:_,specular:m}=this.rtPass.render(this.renderer,this.gbuffer,this.frame,f)),this._momentsTex=null;!y&&!l&&this.denoise&&this.denoiseIterations>0&&this.outputMode!==7&&(_=this.denoisePass.render(this.renderer,_,this.gbuffer,this._camWorldPos,this.eps,this.denoiseIterations,v,{maxStep:this.denoiseMaxStep,stepJitter:this.denoiseStepJitter,wideDamp:this.denoiseWideDamp,frame:this.frame,momentsTexture:null})),!y&&!l&&(p=this.specular?m:null,p&&this.denoise&&this.denoiseIterations>0&&(p=this.specDenoisePass.render(this.renderer,p,this.gbuffer,this._camWorldPos,this.eps,Math.min(this.denoiseIterations,2))));let g=null;const x=this.volumetric.zones&&this.volumetric.zones.length>0;this.volumetric.enabled&&this.outputMode===0&&!l&&(this.volumetric.density>0||x)&&(g=this.volumetricPass.render(this.renderer,this.gbuffer,this._prevViewProj,this._camWorldPos,this.frame,this.eps,this.volumetric.density,this.volumetric.maxDist,this.volumetric.zones));const S=this.taa&&this.outputMode===0&&!l,b=this.composite.material.uniforms;b.uOutputMode.value=this.outputMode;const T=_&&_.image,C=T&&T.width||this._scaledW,w=T&&T.height||this._scaledH;if(b.uUpsample.value=C<this._width||w<this._height,b.uNearestLighting.value=l,b.uIrrTexelSize.value.set(1/C,1/w),b.uCameraPos.value.copy(this._camWorldPos),b.uFogEnabled.value=this.fog.enabled,b.uFogColor.value.copy(this.fog.color),b.uFogDensity.value=this.fog.density,b.uSkyEnabled.value=this.sky.enabled,b.uInvViewProj.value.copy(this._invViewProj.copy(this._jitteredViewProj).invert()),b.uSunDir.value.copy(this.sky.sunDir),b.uSunColor.value.copy(this.sky.sunColor),b.uSkyZenith.value.copy(this.sky.zenith),b.uSkyHorizon.value.copy(this.sky.horizon),b.uSkyIntensity.value=this.sky.intensity,b.uVolumetric.value=g,b.uVolEnabled.value=g!==null,b.uVolTexelSize.value.set(1/this._volW,1/this._volH),this.composite.render(this.renderer,_,this.gbuffer,e.background,S?this._sceneColor:null,p,S?null:this._crop),S?this.taaPass.render(this.renderer,this._sceneColor.texture,this.gbuffer,this._prevViewProj,this._jitterUv,this._prevJitterUv,this.taaBlend+(this.taaBlendMoving-this.taaBlend)*h,null,this._crop):this.taa&&this.taaPass.reset(),this.renderer.autoClear=c,i.elements[0]=n,i.elements[5]=r,i.elements[8]=a,i.elements[9]=o,this._prevViewProj.copy(this._jitteredViewProj),this._prevJitterUv.copy(this._jitterUv),this._motionVectorsActive&&this.compiled&&this.compiled.hasDynamic)for(const M of this.compiled.dynamic){let D=this._prevModelMatrices.get(M.mesh);D||(D=new he,this._prevModelMatrices.set(M.mesh,D)),D.copy(M.mesh.matrixWorld)}this._gpuTimer&&this._gpuTimer.end(),this._diagDone||this._scanPrograms()}get gpuCostMs(){return this._gpuTimer?this._gpuTimer.costMs:null}get gpuTimingSupported(){return!!(this._gpuTimer&&this._gpuTimer.supported)}get gpuTimingActive(){return this.gpuTiming!==!1&&this._gpuActive&&!this._gpuGaveUp}dispose(){this.supported&&(this.gbuffer.dispose(),this.rtPass.dispose(),this.denoisePass.dispose(),this.specDenoisePass.dispose(),this._denoiserPlugin&&this._denoiserPlugin.dispose(),this.composite.dispose(),this.taaPass.dispose(),this.volumetricPass.dispose(),this.restirPass.dispose(),this.giReservoirPass.dispose(),this.lightGridPass.dispose(),this._sceneColor.dispose(),this._copyPass.dispose(),this._gpuTimer&&this._gpuTimer.dispose(),this.compiled&&this.compiled.dispose())}}export{sh as $,dd as A,Ns as B,ue as C,_x as D,ra as E,fx as F,cr as G,mx as H,ah as I,rx as J,r0 as K,Cs as L,ut as M,Ki as N,nh as O,Jt as P,xi as Q,pe as R,ai as S,lh as T,hi as U,P as V,i0 as W,u0 as X,yx as Y,qe as Z,_i as _,Vt as a,Sx as a0,Kc as a1,xx as a2,Fc as a3,rt as a4,px as a5,bx as a6,s0 as a7,ga as a8,gd as a9,Ed as aA,zl as aB,dn as aC,ix as aD,nx as aE,wx as aF,sa as aG,Ii as aH,pl as aa,ze as ab,_o as ac,h0 as ad,Qi as ae,Go as af,Ye as ag,ax as ah,Mx as ai,lx as aj,cx as ak,ux as al,Kt as am,ih as an,o0 as ao,Gr as ap,Hr as aq,Yr as ar,Ut as as,Jr as at,Zr as au,Us as av,Qe as aw,ti as ax,oa as ay,bi as az,d0 as b,vx as c,dx as d,At as e,rh as f,Fo as g,sx as h,gx as i,oh as j,Bh as k,le as l,Ds as m,Xe as n,vo as o,Ke as p,hx as q,Pt as r,Fs as s,fi as t,Rt as u,$e as v,zu as w,Ct as x,ox as y,he as z};
