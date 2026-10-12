const { test } = require("node:test");
const assert = require("node:assert/strict");

test("start waits for asset completion and uses the original half-second layer fade", async () => {
  const { OpeningFlow } = await import("../app/startup.mjs");
  const calls = [];
  let finishFade;
  const loading = {
    visible: true,
    renderOrder: 0,
    material: { uniforms: { opacity: { value: 1 } } },
  };
  const moonLayer = {
    visible: false,
    renderOrder: 0,
    material: { uniforms: { opacity: { value: 1 } } },
  };
  const moon = {
    async onShow() {
      calls.push("show");
      moonLayer.material.uniforms.opacity.value = 0;
    },
    transitionIn() {
      calls.push("intro");
      moonLayer.material.uniforms.opacity.value = 1;
      return "started";
    },
  };
  const flow = new OpeningFlow({
    ui: {
      setState: () => calls.push("nav"),
      hideLoading: () => calls.push("hide-dom"),
    },
    getLayer: (name) => (name === "scene_loading" ? loading : moonLayer),
    getMoon: () => moon,
    tween: (target, duration, options) => {
      calls.push(["fade", duration]);
      return new Promise((resolve) => {
        finishFade = () => {
          target.value = options.value;
          resolve();
        };
      });
    },
    playSound: (name) => calls.push(name),
  });
  assert.equal(await flow.start(), false);
  flow.ready = true;
  const starting = flow.start();
  await Promise.resolve();
  assert.deepEqual(calls, ["nav", "bgm_moon", "show", ["fade", 0.5]]);
  assert.equal(moonLayer.visible, true);
  assert.equal(
    moonLayer.material.uniforms.opacity.value,
    1,
    "the loading fade must reveal the black moon buffer, not the white renderer clear color",
  );
  assert.equal(loading.renderOrder, 10);
  assert.equal(flow.started, true);
  assert.equal(await flow.start(), false);
  finishFade();
  assert.equal(await starting, "started");
  assert.equal(loading.visible, false);
  assert.equal(loading.material.uniforms.opacity.value, 1);
  assert.equal(calls.at(-1), "intro");
});

test("font loading registers the actual font before a scene can draw particle text", async () => {
  const { loadFont } = await import("../app/startup.mjs");
  const calls = [];
  class Font {
    constructor(name, url) {
      calls.push([name, url]);
    }
    async load() {
      calls.push("load");
      return this;
    }
  }
  await loadFont("/local-assets/font.woff2", {
    FontFace: Font,
    fonts: { add: () => calls.push("add") },
  });
  assert.deepEqual(calls, [
    ["fontLink", 'url("/local-assets/font.woff2")'],
    "load",
    "add",
  ]);
});
