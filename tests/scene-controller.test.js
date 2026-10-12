const assert = require("node:assert/strict");
const { test, before } = require("node:test");

let MoonSceneController;
before(async () => {
  ({ MoonSceneController } = await import("../app/scenes/moon.js"));
});

async function flush() {
  for (let count = 0; count < 8; count++) await Promise.resolve();
}

function fixture({ progress } = {}) {
  const calls = [];
  const sounds = [];
  const states = [];
  const timers = [];
  const stored = new Map(
    progress ? [["e20250310nodkrai_moonStars", JSON.stringify(progress)]] : [],
  );
  const nodes = new Map();
  const timelines = new Map();
  const names = [
    "point_text",
    "click_xx_0",
    "click_xx_1",
    "click_xx_2",
    "click_xx_moon",
    "click_0_point",
    "click_1_point",
    "click_2_point",
    "click_3_point",
    "story_a",
    "story_b",
    "story_c",
    "story_d",
  ];
  for (const name of names) {
    nodes.set(name, {
      name,
      visible: true,
      state: { tracks: [{ animation: { name: "loop" } }] },
      setText(options) {
        this.text = options.text;
      },
      playAnimation(animation, options) {
        this.state.tracks[0].animation.name = animation;
        calls.push({ spine: name, animation, options });
      },
    });
  }
  const scene = {
    getObjectByName: (name) => nodes.get(name),
    getTimeline(name) {
      if (!timelines.has(name))
        timelines.set(name, {
          name,
          time: 0,
          start: 0,
          stop() {},
          play(options) {
            this.options = options;
            this.time = options.start || 0;
            this.start = this.time;
            calls.push({ name, options });
          },
        });
      return timelines.get(name);
    },
  };
  const controller = new MoonSceneController({
    scene,
    getWord: (key) => `localized:${key}`,
    playSound: (sound) => sounds.push(sound),
    onState: (state) => states.push(state),
    storage: {
      getItem: (key) => stored.get(key),
      setItem: (key, value) => stored.set(key, value),
    },
    delay: async (ms) => {
      assert.equal(ms, 100);
    },
    setTimeout: (callback, ms) => timers.push({ callback, ms }),
    random: () => 0.5,
  });
  async function frame(name, value) {
    const timeline = scene.getTimeline(name);
    timeline.time = value;
    timeline.options.onUpdate?.();
    if (value >= timeline.options.end) timeline.options.onComplete?.();
    await flush();
  }
  return {
    controller,
    scene,
    calls,
    sounds,
    states,
    nodes,
    stored,
    timers,
    frame,
  };
}

async function finishIntro(f) {
  const starting = f.controller.start();
  await f.frame("一期动画", 303);
  await f.frame("p1_静止", 60);
  await f.frame("points_text", 40);
  await f.frame("p1_静止", 152);
  await starting;
}

async function finishHints(f) {
  const next = f.controller.wheel(120);
  await flush();
  await f.frame("points_text", 80);
  await f.frame("points_text", 40);
  await next;
  const interactive = f.controller.wheel(120);
  await flush();
  await f.frame("points_text", 80);
  await f.frame("p1", 225);
  await interactive;
}

test("fresh intro preserves native303/152frame order and triggers particle text at60", async () => {
  const f = fixture();
  const starting = f.controller.start();
  assert.equal(f.controller.state.phase, "intro");
  assert.equal(f.controller.touchEnable, false);
  assert.equal(await f.controller.wheel(120), false);
  assert.equal(f.calls[0].name, "一期动画");
  assert.equal(f.calls[0].options.end, 303);
  await f.frame("一期动画", 303);
  assert.equal(f.calls[1].name, "p1_静止");
  await f.frame("p1_静止", 59);
  assert.equal(f.calls.filter((call) => call.name === "points_text").length, 0);
  await f.frame("p1_静止", 60);
  assert.equal(f.nodes.get("point_text").text, "localized:loading_hint_0");
  assert.equal(f.calls.at(-1).options.speed, 0.75);
  await f.frame("p1_静止", 61);
  assert.equal(f.calls.filter((call) => call.name === "points_text").length, 1);
  await f.frame("points_text", 40);
  await f.frame("p1_静止", 152);
  await starting;
  assert.equal(f.controller.state.phase, "hints");
  assert.equal(f.controller.state.showWheelHint, true);
  assert.equal(f.controller.touchEnable, true);
});

test("two downward wheels dissolve text before native star reveal; concurrent input is ignored", async () => {
  const f = fixture();
  await finishIntro(f);
  const advance = f.controller.wheel(120);
  assert.equal(await f.controller.wheel(120), false);
  await flush();
  assert.equal(f.calls.at(-1).options.start, 40);
  await f.frame("points_text", 80);
  assert.equal(f.nodes.get("point_text").text, "localized:loading_hint_1");
  assert.equal(f.calls.at(-1).options.start, 0);
  await f.frame("points_text", 40);
  await advance;
  assert.equal(f.controller.state.showCopyright, false);
  const reveal = f.controller.wheel(120);
  await flush();
  await f.frame("points_text", 80);
  assert.equal(f.calls.at(-1).name, "p1");
  assert.equal(f.calls.at(-1).options.start, 152);
  assert.equal(f.calls.at(-1).options.end, 225);
  await f.frame("p1", 164);
  assert.equal(f.sounds.at(-1), "star_show");
  await f.frame("p1", 225);
  await reveal;
  assert.equal(f.controller.state.phase, "interactive");
  assert.equal(f.controller.state.showMoonTouchHint, 0);
  assert.equal(
    f.nodes.get("click_xx_0").state.tracks[0].animation.name,
    "mouse_over",
  );
});

test("upward wheel returns to first hint and never leaves the first-stage boundary", async () => {
  const f = fixture();
  await finishIntro(f);
  assert.equal(await f.controller.wheel(-120), false);
  const next = f.controller.wheel(120);
  await flush();
  await f.frame("points_text", 80);
  await f.frame("points_text", 40);
  await next;
  const back = f.controller.wheel(-120);
  await flush();
  await f.frame("points_text", 80);
  await f.frame("points_text", 40);
  await back;
  assert.equal(f.nodes.get("point_text").text, "localized:loading_hint_0");
  assert.equal(f.controller.state.showCopyright, true);
  await finishHints(f);
  assert.equal(await f.controller.wheel(120), false);
  assert.equal(f.controller.state.phase, "interactive");
});

test("star popup preserves native concurrent timelines and guided next-star sequence", async () => {
  const f = fixture();
  assert.equal(await f.controller.clickStar(0), false);
  await finishIntro(f);
  await finishHints(f);
  const opening = f.controller.clickStar(0);
  assert.equal(f.controller.state.showCanvasPopup, true);
  assert.equal(await f.controller.closePopup(), false);
  assert.deepEqual(JSON.parse(f.stored.get("e20250310nodkrai_moonStars")), [
    true,
    false,
    false,
    false,
  ]);
  assert.equal(f.nodes.get("story_a").visible, true);
  assert.equal(f.nodes.get("story_b").visible, false);
  const popupCalls = f.calls.filter((call) =>
    ["story_text", "story_ani", "彩蛋1"].includes(call.name),
  );
  assert.deepEqual(
    popupCalls.map((call) => call.name),
    ["story_text", "story_ani", "彩蛋1"],
  );
  assert.equal(popupCalls.at(-1).options.speed, 0.75);
  await f.frame("彩蛋1", 40);
  await opening;
  assert.equal(f.controller.state.phase, "popup");
  const closing = f.controller.closePopup();
  assert.equal(f.calls.at(-1).options.start, 40);
  assert.equal(f.calls.at(-1).options.speed, undefined);
  await f.frame("彩蛋1", 80);
  await closing;
  assert.equal(f.controller.state.phase, "interactive");
  assert.equal(f.controller.state.showMoonTouchHint, 1);
  assert.equal(f.controller.state.showCopyright, true);
});

test("previously visited first star uses native p1 revisit branch", async () => {
  const f = fixture({ progress: [true, false, false, false] });
  const starting = f.controller.start();
  assert.equal(f.calls[0].name, "p1");
  assert.equal(f.calls[0].options.end, 152);
  await f.frame("p1", 60);
  await f.frame("points_text", 40);
  await f.frame("p1", 152);
  await starting;
  assert.equal(f.controller.state.phase, "hints");
});
