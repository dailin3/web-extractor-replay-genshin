const assert = require("node:assert/strict");
const { test, before } = require("node:test");

let THREEPlayer, THREE, motion;
before(async () => {
  ({ THREE } = await import("../app/engine/vendor/libraries.js"));
  ({ THREEPlayer } = await import("../app/engine/renderer/three-player.js"));
  ({ default: motion } = await import("../app/engine/renderer/motion.js"));
});

function player() {
  return new THREEPlayer({
    renderer: { getContext: () => ({}) },
    layoutData: { geometries: {}, sceneList: [] },
  });
}

test("geometry preserves Float32 positions, Uint16 skin indices and index width", () => {
  const geometry = THREEPlayer.buildGeometry({
    attributes: {
      position: { type: 1, itemSize: 3, array: [0.1, 0, 0, 1, 0, 0, 0, 1, 0] },
      skinIndex: { type: 1, itemSize: 4, array: [0, 1, 2, 3] },
    },
    index: [0, 1, 2],
    groups: [{ start: 0, count: 3, materialIndex: 0 }],
  });
  assert.equal(geometry.attributes.position.array[0], Math.fround(0.1));
  assert.ok(geometry.attributes.skinIndex.array instanceof Uint16Array);
  assert.ok(geometry.index.array instanceof Uint16Array);
  assert.equal(geometry.attributes.normal.count, 3);
  assert.deepEqual(geometry.groups, [{ start: 0, count: 3, materialIndex: 0 }]);
  const large = THREEPlayer.buildGeometry({
    attributes: {
      position: { type: 1, itemSize: 3, array: Array(196608).fill(0) },
      normal: { type: 1, itemSize: 3, array: [] },
    },
    index: [65536],
  });
  assert.ok(large.index.array instanceof Uint32Array);
  assert.equal(large.index.array[0], 65536);
});

test("interleaved attributes preserve stride and offset", () => {
  const geometry = THREEPlayer.buildGeometry({
    attributes: {
      position: {
        type: 3,
        stride: 5,
        itemSize: 3,
        offset: 0,
        array: [1, 2, 3, 4, 5],
      },
      normal: { type: 1, itemSize: 3, array: [0, 0, 1] },
    },
  });
  assert.equal(geometry.attributes.position.data.stride, 5);
  assert.equal(geometry.attributes.position.getZ(0), 3);
});

test("material global uniforms share the player values without an undeclared global", () => {
  const instance = player();
  instance.shaderSetting.basic = new THREE.ShaderMaterial();
  const material = instance.getMaterial(
    [{ id: "basic", globalUniform: ["time", "resolution"] }],
    1,
  );
  assert.equal(material.uniforms.time, instance.uniformSetting.time);
  assert.equal(
    material.uniforms.resolution,
    instance.uniformSetting.resolution,
  );
  instance.uniformSetting.time.value = 12;
  assert.equal(material.uniforms.time.value, 12);
});

test("viewport uses the native 1.3 scale cap and retains fixed buffers", () => {
  const instance = player();
  const sizes = [];
  instance.renderer.setSize = (...size) => sizes.push(size);
  const camera = new THREE.OrthographicCamera(-1250, 1250, 540, -540);
  instance.getScene = () => ({ camera });
  const resized = [];
  instance.buffers = {
    fluid: { resizable: true, setSize: (...size) => resized.push(size) },
    fixed: {
      resizable: false,
      setSize: () => assert.fail("fixed buffer resized"),
    },
  };
  const result = instance.resizeUI(1920, 1080, {
    width: 2500,
    height: 1080,
    scale: 2,
    all: true,
  });
  assert.deepEqual(result, { width: 2496, height: 1404 });
  assert.deepEqual(sizes, [[2496, 1404]]);
  assert.deepEqual(resized, [[2496, 1404]]);
  assert.deepEqual(
    instance.uniformSetting.resolution.value.toArray(),
    [2496, 1404],
  );
});

test("clock skips sub-10ms frames, caps delta and wraps shader time", () => {
  const instance = player();
  instance.clock = { oldTime: performance.now(), getDelta: () => 0.25 };
  assert.equal(instance.tick(), false);
  instance.clock.oldTime -= 100;
  instance.uniformSetting.time.value = 9999.99;
  assert.equal(instance.tick(), true);
  assert.equal(instance.uniformSetting.delta.value, 0.03);
  assert.equal(instance.uniformSetting.fps.value, 0.03 / 0.0167);
  assert.equal(instance.uniformSetting.time.value, (9999.99 + 0.03) % 10000);
});

test("timeline cache belongs to each object and excludes change track weights", (t) => {
  const instance = player();
  instance.timelineSetting.appear = { type: 1, clips: [] };
  const nativeCreate = motion.createTimeline;
  const created = [];
  motion.createTimeline = (config) => {
    const tracks = [
      { name: "hide", weight: 1 },
      { name: "show", weight: 1 },
    ];
    const timeline = {
      traverse: (visit) => tracks.forEach(visit),
      tracks,
      config,
    };
    created.push(timeline);
    return timeline;
  };
  t.after(() => {
    motion.createTimeline = nativeCreate;
  });
  const first = instance.getTimeline({ uuid: "first" }, "appear", {
    excludes: ["hide"],
  });
  assert.deepEqual(
    first.tracks.map((track) => track.weight),
    [0, 1],
  );
  assert.equal(instance.getTimeline({ uuid: "first" }, "appear"), first);
  assert.notEqual(instance.getTimeline({ uuid: "second" }, "appear"), first);
  assert.equal(created.length, 2);
  assert.throws(
    () => instance.getTimeline({ uuid: "first" }, "missing"),
    /not found/,
  );
});
