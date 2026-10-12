const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test, before } = require("node:test");

let BaseTimeline, getSceneData;
before(async () => {
  ({ default: BaseTimeline } =
    await import("../app/engine/renderer/base-timeline.js"));
  ({ getSceneData } = await import("../app/engine/renderer/scene-data.js"));
});

/** Replace only imported constructors; execute the actual factory/aggregation module. */
async function moduleFixture(t, filename, dependencies) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "renderer-core-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.writeFileSync(path.join(directory, "package.json"), '{"type":"module"}');
  fs.copyFileSync(
    path.join(__dirname, "../app/engine/renderer", filename),
    path.join(directory, "subject.js"),
  );
  for (const [name, source] of Object.entries(dependencies))
    fs.writeFileSync(path.join(directory, name), source);
  return import(pathToFileURL(path.join(directory, "subject.js")).href);
}

const motionConstructors = {
  "base-timeline.js": "BaseTimeline",
  "group-timeline.js": "GroupTimeline",
  "keyframe-timeline.js": "KeyFrameTimeline",
  "tween-timeline.js": "TweenTimeline",
  "spine-timeline.js": "SpineTimeline",
  "step-timeline.js": "StepTimeline",
  "skin-timeline.js": "SkinTimeline",
  "texture-timeline.js": "TextureTimeline",
  "movie-timeline.js": "MovieTimeline",
  "gradient-timeline.js": "GradientTimeline",
  "cue.js": "Cue",
  "keyframe-block.js": "KeyframeBlock",
  "tween-block.js": "TweenBlock",
  "spine-block.js": "SpineBlock",
  "step-frame.js": "StepBlock",
  "skin-block.js": "SkinBlock",
  "gradient-block.js": "GradientBlock",
};

function motionDependencies() {
  return {
    ...Object.fromEntries(
      Object.entries(motionConstructors).map(([file, name]) => [
        file,
        `export const __esModule = true; export default class ${name} { constructor(options) { this.kind = '${name}'; this.options = options; } }`,
      ]),
    ),
    "motion-utils.js":
      "export const __esModule = true; export default { kind: 'motion-utils' };",
  };
}

test("base timeline remains callable by restored Babel-derived constructors", () => {
  function DerivedTimeline(options) {
    BaseTimeline.call(this, options);
  }
  DerivedTimeline.prototype = Object.create(BaseTimeline.prototype, {
    constructor: { value: DerivedTimeline, writable: true, configurable: true },
  });
  Object.setPrototypeOf(DerivedTimeline, BaseTimeline);
  const derived = new DerivedTimeline({
    type: 4,
    start: 7,
    end: 19,
    name: "derived",
    loop: true,
    weight: 0.5,
  });
  assert.ok(derived instanceof BaseTimeline);
  assert.equal(derived.type, 4);
  assert.equal(derived.start, 7);
  assert.equal(derived.end, 19);
  assert.equal(derived.name, "derived");
  assert.equal(derived.loop, true);
  assert.equal(derived.weight, 0.5);
  assert.throws(() => BaseTimeline.call({}), TypeError);
});

test("base timeline defaults and nullable options retain the original values", () => {
  for (const options of [undefined, null]) {
    const timeline = new BaseTimeline(options);
    assert.deepEqual(
      {
        type: timeline.type,
        start: timeline.start,
        end: timeline.end,
        name: timeline.name,
        loop: timeline.loop,
        weight: timeline.weight,
      },
      { type: 1, start: 0, end: 0, name: "", loop: false, weight: 1 },
    );
  }
});

test("nested timeline root and real start accumulate every ancestor start", () => {
  const root = new BaseTimeline({ start: 7 });
  const parent = new BaseTimeline({ start: 5 });
  const child = new BaseTimeline({ start: 3 });
  parent.parent = root;
  child.parent = parent;
  assert.equal(root.rootClip, root);
  assert.equal(child.rootClip, root);
  assert.equal(child.realStartTime, 15);
});

test("seek updates both frame arguments with unit weight and reuses current time by default", () => {
  const timeline = new BaseTimeline();
  const calls = [];
  timeline.update = (...args) => calls.push(args);
  timeline.time = 6;
  assert.equal(timeline.seek(), undefined);
  assert.equal(timeline.time, 6);
  timeline.seek(0);
  assert.equal(timeline.time, 0);
  assert.deepEqual(calls, [
    [6, 6, 1],
    [0, 0, 1],
  ]);
});

test("base JSON header and nonenumerable prototype descriptors stay compatible", () => {
  const timeline = new BaseTimeline({
    type: 8,
    start: 3,
    end: 17,
    name: "clip",
    loop: true,
    weight: 0.5,
  });
  assert.deepEqual(timeline.toJSON(), {
    type: 8,
    start: 3,
    name: "clip",
    loop: true,
  });
  for (const name of ["seek", "toJSON"]) {
    const descriptor = Object.getOwnPropertyDescriptor(
      BaseTimeline.prototype,
      name,
    );
    assert.equal(descriptor.enumerable, false);
    assert.equal(descriptor.configurable, true);
    assert.equal(descriptor.writable, true);
  }
  for (const name of ["rootClip", "realStartTime"]) {
    const descriptor = Object.getOwnPropertyDescriptor(
      BaseTimeline.prototype,
      name,
    );
    assert.equal(descriptor.enumerable, false);
    assert.equal(descriptor.configurable, true);
    assert.equal(typeof descriptor.get, "function");
  }
});

test("motion timeline types map to the captured constructor family", async (t) => {
  const { default: motion, __esModule } = await moduleFixture(
    t,
    "motion.js",
    motionDependencies(),
  );
  assert.equal(__esModule, true);
  const expected = [
    "GroupTimeline",
    "KeyFrameTimeline",
    "TweenTimeline",
    "SpineTimeline",
    "StepTimeline",
    "SkinTimeline",
    "TextureTimeline",
    "MovieTimeline",
    "GradientTimeline",
  ];
  for (const [index, kind] of expected.entries()) {
    const options = { type: index + 1, name: "authored-clip" };
    const timeline = motion.createTimeline(options);
    assert.equal(timeline.kind, kind);
    assert.equal(timeline.options, options);
    assert.ok(timeline instanceof motion[kind]);
  }
});

test("motion block types keep their distinct captured constructor mapping", async (t) => {
  const { default: motion } = await moduleFixture(
    t,
    "motion.js",
    motionDependencies(),
  );
  const expected = [
    "GroupTimeline",
    "KeyframeBlock",
    "TweenBlock",
    "SpineBlock",
    "StepBlock",
    "SkinBlock",
    "GradientBlock",
  ];
  for (const [index, kind] of expected.entries()) {
    const options = { type: index + 1 };
    const block = motion.createBlock(options);
    assert.equal(block.kind, kind);
    assert.equal(block.options, options);
    assert.ok(block instanceof motion[kind]);
  }
  assert.equal(motion.utils.kind, "motion-utils");
  assert.equal(typeof motion.BaseTimeline, "function");
  assert.equal(typeof motion.Cue, "function");
});

test("motion rejects unknown or string-coerced types rather than selecting a constructor", async (t) => {
  const { default: motion } = await moduleFixture(
    t,
    "motion.js",
    motionDependencies(),
  );
  for (const type of [0, 10, "1", undefined]) {
    assert.throws(
      () => motion.createTimeline({ type }),
      /unknown timeline type:/,
    );
    assert.throws(() => motion.createBlock({ type }), /unknown block type:/);
  }
});

test("engine API aggregates the same imported services and named player constructor", async (t) => {
  const services = {
    "motion.js": "motion",
    "spine-runtime.js": "spine",
    "msdf.js": "msdf",
    "decoder.js": "io",
    "mouse.js": "mouse",
    "browser.js": "Browser",
    "utils.js": "utils",
    "audio-manager.js": "Audio",
    "rich-text.js": "richText",
  };
  const dependencies = Object.fromEntries(
    Object.entries(services).map(([file, name]) => [
      file,
      `export const __esModule = true; export default { kind: '${name}' };`,
    ]),
  );
  dependencies["three-player.js"] =
    "export const __esModule = true; export class THREEPlayer {}";
  const { default: api, __esModule } = await moduleFixture(
    t,
    "engine-api.js",
    dependencies,
  );
  assert.equal(__esModule, true);
  assert.deepEqual(Object.keys(api).sort(), [
    "Audio",
    "Browser",
    "THREEPlayer",
    "io",
    "motion",
    "mouse",
    "msdf",
    "richText",
    "spine",
    "utils",
  ]);
  for (const name of Object.values(services))
    assert.equal(api[name].kind, name);
  assert.equal(typeof api.THREEPlayer, "function");
});

test("scene lookup returns the first matching scene by strict id and preserves object identity", () => {
  const numeric = { id: 1, name: "numeric" };
  const first = { id: "moon", name: "first" };
  const second = { id: "moon", name: "second" };
  const data = { sceneList: [numeric, first, second] };
  assert.equal(getSceneData(data, "moon"), first);
  assert.equal(getSceneData(data, 1), numeric);
  assert.equal(getSceneData(data, "1"), undefined);
  assert.equal(getSceneData(data, "missing"), undefined);
});
