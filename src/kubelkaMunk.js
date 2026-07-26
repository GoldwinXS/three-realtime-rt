/**
 * Kubelka-Munk two-flux scattering — the analytic reference implementation.
 *
 * This module is plain math with no three.js and no GPU: it is the ground truth
 * the GLSL in RTLightingPass is written against, the thing the numerical edge
 * tests exercise, and a usable authoring tool in its own right (feed it the K/S
 * you are about to put on a material and it tells you what reflectance that
 * material will show at a given thickness, before you render anything).
 *
 * WHAT THE MODEL IS. Two-flux radiative transfer through a plane-parallel,
 * isotropically scattering medium: one diffuse flux travelling into the material
 * and one travelling back out, coupled by an absorption coefficient K and a
 * scattering coefficient S (both per colour channel, both in 1/world-unit).
 * Solving that pair of ODEs over a layer of thickness `t` sitting on a backing of
 * reflectance `Rg` has a CLOSED FORM — no path tracing, no volumetric march —
 * which is exactly why it fits a real-time renderer:
 *
 *   a = 1 + K/S                       (the "absorption ratio" parameter)
 *   b = sqrt(a*a - 1)                 (equivalently sqrt((K/S)*((K/S) + 2)))
 *   R(t, Rg) = (1 - Rg*(a - b*coth(b*S*t))) / (a - Rg + b*coth(b*S*t))
 *   T(t)     = b / (a*sinh(b*S*t) + b*cosh(b*S*t))
 *
 * R is what makes a pigmented translucent solid look like its colour when lit
 * from the FRONT: light enters, scatters, and comes back out. Absorption alone
 * (Beer-Lambert, the 0.8.0 model) can only ever darken what is behind the medium,
 * so a front-lit pigmented body renders as black murk. T is the back-lit half:
 * what survives all the way through.
 *
 * NUMERICS. The textbook expressions above are unusable as written on a GPU (and
 * uncomfortable in fp64): coth blows up as b*S*t goes to zero, sinh/cosh overflow
 * as it grows, and the S -> 0 limit is a difference of two large nearly-equal
 * numbers. Every function here uses the algebraically identical but numerically
 * stable rewrites documented at each site, and every one of the limits is covered
 * by a test in scripts/km-selftest.mjs:
 *
 *   S -> 0        degrades to Beer-Lambert: T -> exp(-K*t), R -> Rg*exp(-2*K*t)
 *   t -> infinity R -> R_inf = a - b, independently of the backing
 *   b*S*t -> 0    coth series, and the K = 0 case R = S*t/(1 + S*t) exactly
 *   channels      r, g, b are fully independent (no cross-channel term anywhere)
 *
 * MULTI-LAYER STACKS. A stack composes by recursion from the deepest layer up:
 * R_total = R(layer_n over R(layer_{n-1} over ... over R_base)). That form needs
 * the layers in reverse order, which a shader marching a ray front-to-back does
 * not have. {@link kmAddBelow} is the equivalent FORWARD composition (the
 * standard "adding" equations for stacked plane-parallel layers), which lets the
 * renderer accumulate a running (R_above, R_below, T) triple as it marches and
 * apply the opaque backing once at the end. The two agree to floating-point
 * noise; that equivalence is itself a test, and it is what licenses the shader to
 * be written the cheap way.
 */

// b*S*t below this uses the coth series instead of the ratio of exponentials;
// above it, the exp(-2x) rewrites are exact and never overflow. Chosen so the
// series and the closed form agree to ~1e-12 in fp64 and comfortably inside fp32
// at the crossover (the GLSL uses the same constant, so the two implementations
// switch branches at the same place).
const KM_SMALL_X = 1e-3;

// K/S above this is treated as pure absorption (Beer-Lambert). At this ratio
// a - b is ~1e-12, i.e. the medium reflects nothing a renderer can represent, and
// the closed form is all cancellation. Also the S == 0 entry point.
const KM_MAX_KS = 1e6;

// R and T are reflectance/transmittance fractions: physically in [0,1] and used
// downstream as an albedo, so they are clamped rather than allowed to leak a few
// ulps past 1 at the degenerate corners (or a negative from a guard division).
const clamp01 = (v) => (v > 1 ? 1 : v > 0 ? v : 0);

/**
 * coth(x) for x > 0, stable at both ends.
 *
 * Large x: coth(x) = (1 + e^-2x) / (1 - e^-2x) — no overflow, tends to 1.
 * Small x: the Laurent series 1/x + x/3 - x^3/45; the leading 1/x is the term
 * that matters (it is what cancels the b in b*coth(b*S*t) and leaves 1/(S*t)).
 */
export function coth(x) {
  if (!(x > 0)) return Infinity;
  if (x < KM_SMALL_X) return 1 / x + x / 3 - (x * x * x) / 45;
  const e = Math.exp(-2 * x);
  return (1 + e) / (1 - e);
}

/**
 * The two derived KM parameters for one channel. `S <= 0` (or an absurd K/S) is
 * reported as `ks: Infinity`, which every caller reads as "pure absorber".
 */
export function kmAB(K, S) {
  const k = Math.max(K, 0);
  const s = Math.max(S, 0);
  if (s <= 0 || k / s > KM_MAX_KS) return { ks: Infinity, a: Infinity, b: Infinity };
  const ks = k / s;
  const a = 1 + ks;
  // sqrt(a*a - 1) written as sqrt(ks*(ks+2)): for small ks, a*a - 1 loses every
  // significant digit to cancellation (a is 1 + tiny), while ks*(ks+2) does not.
  const b = Math.sqrt(ks * (ks + 2));
  return { ks, a, b };
}

/**
 * Reflectance of an infinitely thick layer of this pigment: R_inf = a - b. The
 * "masstone" — what the material converges to once no light reaches the backing.
 * Written as 1/(a+b) because (a-b)(a+b) = a*a - b*b = 1 exactly, and the sum form
 * has no cancellation.
 */
export function kmReflectanceInfinite(K, S) {
  const { a, b } = kmAB(K, S);
  if (!Number.isFinite(a)) return 0; // pure absorber reflects nothing
  return 1 / (a + b);
}

/**
 * Diffuse transmittance through a layer of thickness `t`.
 *
 * T = b / (a*sinh(x) + b*cosh(x)) with x = b*S*t, rewritten as
 *   T = 2*b*e^-x / ((a + b) + (b - a)*e^-2x)
 * which is the same expression with e^x divided out of numerator and denominator.
 * Nothing overflows however thick the layer gets, and the denominator tends to
 * the harmless (a + b) rather than to a difference of two enormous numbers.
 */
export function kmTransmittance(K, S, t) {
  if (!(t > 0)) return 1;
  const { a, b } = kmAB(K, S);
  // Pure absorber: the whole two-flux model collapses to Beer-Lambert.
  if (!Number.isFinite(a)) return clamp01(Math.exp(-Math.max(K, 0) * t));
  const x = b * S * t;
  if (x < KM_SMALL_X) {
    // b -> 0 (K -> 0) as well as t -> 0 land here, and both make the ratio above
    // 0/0. Divide the common b out first: T = 1 / ((a/b)*sinh(x) + cosh(x)), then
    // series-expand with x/b == S*t held exact, so no division by b survives:
    //   (a/b)*sinh(x) = a*S*t*(1 + x^2/6 + ...)
    //   cosh(x)       = 1 + x^2/2 + x^4/24
    // Truncating at x^2 alone leaves a relative error of x^2/2, which is 5e-7 at
    // the crossover — big enough to show up as a mismatch against the adding
    // composition, so the x^4 terms stay. At K = 0 this reduces to the classic
    // T = 1/(1 + S*t).
    const st = S * t;
    const x2 = x * x;
    return clamp01(1 / (1 + a * st * (1 + x2 / 6) + 0.5 * x2 * (1 + x2 / 12)));
  }
  const e2 = Math.exp(-2 * x);
  return clamp01((2 * b * Math.exp(-x)) / (a + b + (b - a) * e2));
}

/**
 * Reflectance of a layer of thickness `t` over a backing of reflectance `Rg`,
 * straight from the closed form. `Rg` is per-channel linear reflectance in [0,1)
 * — for the renderer that is the linearized base colour of whatever opaque body
 * sits behind the translucent one.
 *
 * The S -> 0 branch is not an approximation for convenience: at that end a and b
 * are both ~K/S and the numerator is a difference of two large nearly-equal
 * terms, so the closed form loses all its digits well before S actually reaches
 * zero. The limit is exactly Beer-Lambert with a DOUBLE path length (light goes
 * down through the layer and back up), which is the physically obvious answer and
 * the one the tests pin.
 */
export function kmReflectance(K, S, t, Rg = 0) {
  if (!(t > 0)) return Rg;
  const { a, b } = kmAB(K, S);
  if (!Number.isFinite(a)) return clamp01(Rg * Math.exp(-2 * Math.max(K, 0) * t));
  const x = b * S * t;
  // b*coth(b*S*t) is the only place b and the coth meet, and it is finite even
  // when both factors are degenerate. Expanding coth and keeping x/b == S*t exact
  // removes the division by b entirely:
  //   b*coth(x) -> 1/(S*t) + b*b*S*t/3 - b^4*(S*t)^3/45
  // The leading 1/(S*t) is what survives at K = 0, where b is exactly 0 and the
  // raw product is 0 * infinity.
  const st = S * t;
  const b2 = b * b;
  const bcoth = x < KM_SMALL_X ? 1 / st + (b2 * st) / 3 - (b2 * b2 * st * st * st) / 45 : b * coth(x);
  const num = 1 - Rg * (a - bcoth);
  const den = a - Rg + bcoth;
  // A reflectance, by construction — the clamp only ever absorbs float noise at
  // the degenerate corners (Rg = 1 with a non-absorbing medium lands on exactly
  // 1.0 in exact arithmetic and a few ulps above it in floating point).
  return clamp01(num / den);
}

/**
 * One layer's (R over black, T) pair — the two numbers the forward "adding"
 * composition needs, and the only two a shader has to carry per layer.
 */
export function kmLayer(K, S, t) {
  return { r: kmReflectance(K, S, t, 0), t: kmTransmittance(K, S, t) };
}

/**
 * Stack one more layer UNDERNEATH an existing stack (the forward composition).
 *
 * `stack` is { ra, rb, t }: reflectance seen from above, reflectance seen from
 * below, and transmittance (equal in both directions by reciprocity). `layer` is
 * the { r, t } of the layer being added below it. The three standard adding
 * equations account for the infinite series of inter-reflections between the two:
 *
 *   d      = 1 - stack.rb * layer.r
 *   ra_new = stack.ra + stack.t^2 * layer.r / d
 *   rb_new = layer.r  + layer.t^2 * stack.rb / d
 *   t_new  = stack.t  * layer.t / d
 *
 * A single homogeneous layer is symmetric (ra == rb), so a shader marching one
 * medium at a time only ever feeds symmetric layers in — but the STACK it builds
 * is not symmetric once the layers differ, which is why rb is tracked separately.
 * An opaque backing is added as the degenerate layer { r: Rg, t: 0 }.
 */
export function kmAddBelow(stack, layer) {
  const d = 1 - stack.rb * layer.r;
  // d can only reach 0 if two layers both had reflectance 1, which is a perfect
  // mirror pair and outside the model; clamp rather than emit an infinity.
  const inv = 1 / Math.max(d, 1e-6);
  return {
    ra: stack.ra + stack.t * stack.t * layer.r * inv,
    rb: layer.r + layer.t * layer.t * stack.rb * inv,
    t: stack.t * layer.t * inv,
  };
}

/** The identity element of {@link kmAddBelow}: an empty stack of clear air. */
export function kmEmptyStack() {
  return { ra: 0, rb: 0, t: 1 };
}

/**
 * Total reflectance of an ordered stack of layers over an opaque backing.
 * `layers` are TOP-FIRST (the order a view ray crosses them), each
 * { K, S, t }; `backing` is the terminal reflectance. Returns the composed
 * { ra, rb, t } so callers can read the transmittance too.
 */
export function kmStack(layers, backing = 0) {
  let stack = kmEmptyStack();
  for (const l of layers) stack = kmAddBelow(stack, kmLayer(l.K, l.S, l.t));
  return kmAddBelow(stack, { r: backing, t: 0 });
}

// --- per-channel RGB wrappers ------------------------------------------------
// Colour channels are completely independent in this model — there is no
// cross-channel term anywhere above — so the RGB forms are literally three scalar
// evaluations. They exist so callers (and the validation rig) do not have to
// spell that loop out every time.

const rgb3 = (v) => (Array.isArray(v) ? v : [v, v, v]);

/** {@link kmReflectance} per channel. K/S/Rg accept a scalar or an [r,g,b]. */
export function kmReflectanceRGB(K, S, t, Rg = 0) {
  const k = rgb3(K), s = rgb3(S), g = rgb3(Rg);
  return [0, 1, 2].map((i) => kmReflectance(k[i], s[i], t, g[i]));
}

/** {@link kmTransmittance} per channel. */
export function kmTransmittanceRGB(K, S, t) {
  const k = rgb3(K), s = rgb3(S);
  return [0, 1, 2].map((i) => kmTransmittance(k[i], s[i], t));
}

/** {@link kmReflectanceInfinite} per channel. */
export function kmReflectanceInfiniteRGB(K, S) {
  const k = rgb3(K), s = rgb3(S);
  return [0, 1, 2].map((i) => kmReflectanceInfinite(k[i], s[i]));
}

/**
 * {@link kmStack} per channel. `layers` are TOP-FIRST, each { K, S, t } where K
 * and S may be scalars or [r,g,b]; `backing` is a scalar or an [r,g,b] linear
 * reflectance. Returns { ra, rb, t } as three [r,g,b] arrays — this is the exact
 * quantity the renderer's view-path march computes per pixel.
 */
export function kmStackRGB(layers, backing = 0) {
  const g = rgb3(backing);
  const out = { ra: [0, 0, 0], rb: [0, 0, 0], t: [0, 0, 0] };
  for (let i = 0; i < 3; i++) {
    const chan = layers.map((l) => ({ K: rgb3(l.K)[i], S: rgb3(l.S)[i], t: l.t }));
    const r = kmStack(chan, g[i]);
    out.ra[i] = r.ra;
    out.rb[i] = r.rb;
    out.t[i] = r.t;
  }
  return out;
}

/**
 * Derive a per-channel coefficient from the library's colour + distance
 * authoring pair: `color` is the fraction of flux that survives one `distance` of
 * travel, so the coefficient is -ln(color)/distance. This is the SAME derivation
 * SceneCompiler uses for absorption sigma (0.8.0) and for scattering S, exported
 * so an app can predict what it is about to get. Channels are floored at 1e-4 so
 * a pure-black colour yields a large but finite coefficient, and a channel at or
 * above 1 clamps to 0 (a value above 1 would mean gain).
 */
export function coefficientFromColorDistance(color, distance) {
  const c = rgb3(color);
  if (!Number.isFinite(distance) || distance <= 0) return [0, 0, 0];
  return c.map((v) => {
    const s = -Math.log(Math.max(v, 1e-4)) / distance;
    return s > 0 ? s : 0;
  });
}
