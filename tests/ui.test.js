const test = require('node:test');
const assert = require('node:assert/strict');

test('loading fan fills clockwise from twelve o’clock and changes arc at halfway', async () => {
  const { loadingSectorPath } = await import('../app/ui.mjs');
  assert.equal(loadingSectorPath(0), 'M100,100 v-100 A 100 100 0 0 1 100 0 Z');
  assert.equal(
    loadingSectorPath(25),
    'M100,100 v-100 A 100 100 0 0 1 200 100 Z',
  );
  assert.match(loadingSectorPath(51), /A 100 100 0 1 1/);
  assert.match(loadingSectorPath(100), /^M100,100 v-100 A 100 100 0 1 1 /);
});

test('the guided hit area is hidden while a story is opening or shown', async () => {
  const { deriveUIVisibility } = await import('../app/ui.mjs');
  assert.deepEqual(
    deriveUIVisibility({
      phase: 'interactive',
      showTopNav: true,
      showWheelHint: false,
      showMoonTouchHint: 2,
    }),
    {
      topNav: true,
      wheelHint: false,
      navHint: true,
      hotspots: true,
      guideIndex: 2,
    },
  );
  const popup = deriveUIVisibility({
    phase: 'popup-opening',
    showTopNav: true,
    showCanvasPopup: true,
    showMoonTouchHint: 2,
  });
  assert.equal(popup.hotspots, false);
  assert.equal(popup.guideIndex, -1);
  assert.equal(popup.navHint, false);
});

test('wheel hint disappears while the user interacts and returns after eight seconds idle', async () => {
  const { InteractionIdleHint, deriveUIVisibility } =
    await import('../app/ui.mjs');
  let pending;
  const changes = [];
  const hint = new InteractionIdleHint({
    onChange: (active) => changes.push(active),
    schedule: (fn, ms) => {
      pending = { fn, ms };
      return 1;
    },
    cancel: () => {},
  });
  hint.record();
  assert.equal(pending.ms, 8000);
  assert.equal(
    deriveUIVisibility({ showWheelHint: true, sceneInteractive: hint.active })
      .wheelHint,
    false,
  );
  pending.fn();
  assert.equal(
    deriveUIVisibility({ showWheelHint: true, sceneInteractive: hint.active })
      .wheelHint,
    true,
  );
  assert.deepEqual(changes, [true, false]);
});

test('hotspot element is available before its first CSS3D render inserts the DOM id', async () => {
  const { findHotspotElement } = await import('../app/ui.mjs');
  const element = {};
  const node = { children: [{ isCSS3DObject: true, element }] };
  assert.equal(
    findHotspotElement(node, 'moon_start_click_0', () => null),
    element,
  );
  const rendered = {};
  assert.equal(
    findHotspotElement(node, 'moon_start_click_0', () => rendered),
    rendered,
  );
});
