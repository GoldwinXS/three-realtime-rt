// Shared procedural sky, injected into both the lighting pass (GI rays that
// miss geometry sample it, so the sky becomes a soft area light) and the
// composite pass (background pixels show it). A cheap analytic model: a
// horizon->zenith gradient, a dim ground hemisphere, and a sun disk + halo.
// `dir` and `sunDir` are world-space unit vectors; `sunDir` points TOWARD the
// sun. The returned radiance already includes `intensity`.
export const SKY_GLSL = /* glsl */ `
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
`;
