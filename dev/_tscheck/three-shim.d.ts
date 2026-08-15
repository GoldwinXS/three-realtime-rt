// three@0.160 ships no type declarations of its own and this repo does not
// depend on @types/three, so the subject of this check (src/index.d.ts) cannot
// be compiled without SOME declaration for the peer. This is the minimum: the
// handful of three types index.d.ts imports, declared structurally.
//
// It is deliberately loose. The check is "does OUR d.ts type-check under
// --strict at a real call site", not "is three's API modelled correctly".
declare module "three" {
  export class Color { constructor(...a: any[]); r: number; g: number; b: number; copy(c: Color): this; }
  export class Vector3 { constructor(...a: any[]); x: number; y: number; z: number; normalize(): this; }
  export class Object3D { visible: boolean; userData: any; add(...o: Object3D[]): this; }
  export class Scene extends Object3D {}
  export class Camera extends Object3D {}
  export class PerspectiveCamera extends Camera { constructor(...a: any[]); }
  export class WebGLRenderer { constructor(...a: any[]); }
  export class Data3DTexture { constructor(...a: any[]); }
}
