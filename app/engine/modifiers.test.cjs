const assert = require('node:assert/strict');
const { test } = require('node:test');

test('drawScene restores renderer state and draws a paused layer once', async () => {
  const { createModifiers } = await import('../render/modifiers.mjs');
  const { THREE } = await import('./vendor/libraries.js');
  const calls = [];
  const originalTarget = {};
  const originalColor = new THREE.Color(0x223344);
  const renderer = {
    getClearColor: (color) => color.copy(originalColor),
    getClearAlpha: () => 0.25,
    getRenderTarget: () => originalTarget,
    setClearColor: (color, alpha) =>
      calls.push(['color', color.getHex(), alpha]),
    clearDepth: () => calls.push(['depth']),
    setRenderTarget: (target) => calls.push(['target', target]),
  };
  const player = {
    renderer,
    renderScene: (name) => calls.push(['render', name]),
  };
  const layer = {};
  createModifiers().drawScene.call(layer, {}, player, {
    id: 'moon',
    paused: true,
  });
  layer.onBeforeRender();
  layer.onBeforeRender();
  assert.equal(calls.filter((call) => call[0] === 'render').length, 1);
  assert.deepEqual(calls.at(-2), ['color', originalColor.getHex(), 0.25]);
  assert.deepEqual(calls.at(-1), ['target', originalTarget]);
});

test('timeline modifier exposes the authored trackTime property', async () => {
  const { createModifiers } = await import('../render/modifiers.mjs');
  const timeline = {
    time: 0,
    seek(frame) {
      this.time = frame;
    },
  };
  const node = {};
  const player = {
    getTimeline: (root, name) => {
      assert.equal(root, node);
      assert.equal(name, 'p1');
      return timeline;
    },
  };
  createModifiers().playTimeline.call(node, {}, player, {
    trackName: 'p1',
    frame: 152,
  });
  assert.equal(node.trackTime_p1, 152);
  node.trackTime_p1 = 225;
  assert.equal(timeline.time, 225);
});

test('wiggle follows the original delta accumulation and pauses with its scene', async () => {
  const { createModifiers } = await import('../render/modifiers.mjs');
  const { THREE } = await import('./vendor/libraries.js');
  const node = new THREE.Object3D();
  node.scene = { autoUpdate: true };
  node.userData = {
    initPos: new THREE.Vector3(10, 20, 30),
    initRot: new THREE.Euler(),
    initScl: new THREE.Vector3(1, 1, 1),
  };
  const player = { uniformSetting: { delta: { value: 0.5 } } };
  createModifiers().wiggle_roty_posxz.call(node, {}, player, {
    moveSpeed: [2, 0, 0],
    moveAmp: [5, 0, 0],
    scaleAmp: [0, 0, 0],
  });
  node.dispatchEvent({ type: 'tick' });
  assert.equal(node.position.x, 10 + 5 * Math.sin(2 / 3));
  node.scene.autoUpdate = false;
  node.dispatchEvent({ type: 'tick' });
  assert.equal(node.position.x, 10 + 5 * Math.sin(2 / 3));
});

test('CSS matrix conversion preserves camera/object axis conventions', async () => {
  const { cameraMatrixCSS, objectMatrixCSS } =
    await import('../render/css3d.mjs');
  const matrix = {
    elements: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1],
  };
  assert.equal(
    cameraMatrixCSS(matrix),
    'matrix3d(1,0,0,0,0,-1,0,0,0,0,1,0,10,-20,30,1)',
  );
  assert.equal(
    objectMatrixCSS(matrix),
    'translate(-50%,-50%)matrix3d(1,0,0,0,0,-1,0,0,0,0,1,0,10,20,30,1)',
  );
});
