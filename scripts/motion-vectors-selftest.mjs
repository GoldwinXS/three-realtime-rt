import assert from "node:assert/strict";
import { RealtimeRaytracer } from "../src/RealtimeRaytracer.js";

function fakeTracer({ motionVectorsSupported, hasDynamic, motionVectors = true }) {
  const calls = {
    gbufferMotion: [],
    prevModelMatrices: 0,
    motionMatrices: 0,
    reset: 0,
    accumulate: [],
    restir: [],
    taa: [],
  };
  return {
    motionVectors,
    motionVectorsSupported,
    compiled: { hasDynamic },
    _motionVectorsActive: false,
    _motionWarned: false,
    _motionAccum: true,
    _motionRestir: true,
    _motionTaa: false,
    _prevModelMatrices: new Map(),
    _prevViewProj: {},
    gbuffer: {
      setMotionVectors(value) { calls.gbufferMotion.push(value); },
      setPrevModelMatrices() { calls.prevModelMatrices++; },
      setMotionMatrices() { calls.motionMatrices++; },
    },
    resetAccumulation() { calls.reset++; },
    accumulatePass: { setMotionVectors(value) { calls.accumulate.push(value); } },
    restirPass: { setMotionVectors(value) { calls.restir.push(value); } },
    taaPass: { setMotionVectors(value) { calls.taa.push(value); } },
    calls,
  };
}

const sync = RealtimeRaytracer.prototype._syncMotionVectors;

// An unsupported dynamic scene warns even though the effective state starts off.
{
  const tracer = fakeTracer({ motionVectorsSupported: false, hasDynamic: true });
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (message) => warnings.push(message);
  try {
    sync.call(tracer);
    sync.call(tracer);
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(warnings.length, 1);
  assert.deepEqual(tracer.calls.gbufferMotion, []);
  assert.deepEqual(tracer.calls.accumulate, [false, false]);
  assert.deepEqual(tracer.calls.restir, [false, false]);
  assert.deepEqual(tracer.calls.taa, [false, false]);
}

// An unsupported static scene neither warns nor enables the attachment.
{
  const tracer = fakeTracer({ motionVectorsSupported: false, hasDynamic: false });
  const originalWarn = console.warn;
  let warningCount = 0;
  console.warn = () => { warningCount++; };
  try {
    sync.call(tracer);
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(warningCount, 0);
  assert.equal(tracer._motionVectorsActive, false);
  assert.deepEqual(tracer.calls.gbufferMotion, []);
}

// A supported dynamic scene transitions once; consumers get their configured
// booleans, while TAA stays off because _motionTaa is false.
{
  const tracer = fakeTracer({ motionVectorsSupported: true, hasDynamic: true });
  sync.call(tracer);
  sync.call(tracer);
  assert.equal(tracer._motionVectorsActive, true);
  assert.deepEqual(tracer.calls.gbufferMotion, [true]);
  assert.equal(tracer.calls.reset, 1);
  assert.equal(tracer.calls.prevModelMatrices, 2);
  assert.equal(tracer.calls.motionMatrices, 2);
  assert.deepEqual(tracer.calls.accumulate, [true, true]);
  assert.deepEqual(tracer.calls.restir, [true, true]);
  assert.deepEqual(tracer.calls.taa, [false, false]);
}

console.log("OK — motion-vector state checks passed");
