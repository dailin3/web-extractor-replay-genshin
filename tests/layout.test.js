const assert = require("node:assert/strict");
const { test } = require("node:test");

test("desktop layout matches the original 2500×1080 height-based clipping", async () => {
  const { measureViewport } = await import("../app/layout.mjs");
  const layout = measureViewport({ width: 1200, height: 660, pixelRatio: 1 });
  assert.equal(layout.fontSize, 660 / 10.8);
  assert.equal(layout.frameWidth, (660 * 2500) / 1080);
  assert.equal(layout.frameLeft, (1200 - layout.frameWidth) / 2);
  assert.deepEqual(layout.renderSize, { width: 1200, height: 660 });
});

test("DPR changes renderer input dimensions without changing CSS geometry", async () => {
  const { measureViewport } = await import("../app/layout.mjs");
  const first = measureViewport({ width: 1920, height: 1080, pixelRatio: 1 });
  const retina = measureViewport({ width: 1920, height: 1080, pixelRatio: 2 });
  assert.equal(retina.fontSize, first.fontSize);
  assert.equal(retina.frameWidth, 2500);
  assert.equal(retina.frameLeft, -290);
  assert.deepEqual(retina.renderSize, { width: 3840, height: 2160 });
});
