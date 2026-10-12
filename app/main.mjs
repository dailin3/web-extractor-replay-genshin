import {
  THREE,
  THREEPlayer,
  utils,
  gsap,
  Howl,
  Howler,
  createPlugins,
} from "./engine/index.js";
import { loadSceneData } from "./data/index.mjs";
import { createModifiers } from "./render/modifiers.mjs";
import { createMoonSceneClass, MOON_PROGRESS_KEY } from "./scenes/moon.js";
import { applyViewport, measureViewport } from "./layout.mjs";
import { loadFont, OpeningFlow } from "./startup.mjs";
import { createUI } from "./ui.mjs";
import { showInitializationError } from "./errors.mjs";

// The verifier inspects the authored application and its real scene timelines.
const app = (window.__moonApp = {
  status: "loading",
  assetsReady: false,
  ready: false,
});

async function initialize() {
  const data = await loadSceneData({ THREE, utils });
  const getWord = (key) => data.words[key] || "";
  await loadFont(data.font.src);
  if (!new URLSearchParams(location.search).has("keepProgress")) {
    localStorage.removeItem(MOON_PROGRESS_KEY);
  }

  const soundNames = {
    moon_in: "sound_moon_in_",
    star_show: "sound_star_show",
    text_show: "sound_text_show",
    text_hidden: "sound_text_hidden",
    bgm_moon: "background",
  };
  const sounds = new Map();
  function playSound(name) {
    const source = data.soundAssets[soundNames[name] || name];
    if (!source) return;
    if (!sounds.has(name))
      sounds.set(name, new Howl({ src: [source], loop: name === "bgm_moon" }));
    sounds.get(name).play();
  }

  let player, flow;
  let scenePaused = false;
  const controller = () => player?.scenes.scene_moon?.controller;
  const ui = createUI({
    getWord,
    onStart: () => flow.start(),
    onWheel: (deltaY) => controller()?.wheel(deltaY),
    onStar: (index) => controller()?.clickStar(index),
    onDismiss: () => controller()?.closePopup(),
    onAudio: (enabled) => Howler.mute(!enabled),
    onRulesChange: (open) => {
      scenePaused = open;
    },
  });
  const renderer = new THREE.WebGL1Renderer({
    canvas: document.getElementById("webglCanvas"),
    alpha: false,
    premultipliedAlpha: false,
  });
  renderer.setClearColor(0xffffff);
  renderer.clear();
  const uniformSetting = {
    fps: { value: 1 },
    delta: { value: 0.016 },
    time: { value: 0 },
    mouse: { value: new THREE.Vector2() },
    offset: { value: new THREE.Vector2() },
    mouseDelta: { value: new THREE.Vector2() },
    resolution: { value: new THREE.Vector2(1664, 720) },
    bufferSize: { value: new THREE.Vector2(1664, 720) },
  };
  const pluginSetting = createPlugins({
    translate: getWord,
    getLanguage: () => "zh-cn",
    isMobile: false,
  });
  // Only the verification harness installs this hook to seed particle buffers.
  window.__captureConfigureEngine?.({ plugins: pluginSetting, Howl, gsap });
  let viewport = measureViewport({
    width: innerWidth,
    height: innerHeight,
    pixelRatio: devicePixelRatio,
  });
  const modifierSetting = createModifiers({
    getFrame: () => ({
      width: viewport.width,
      height: viewport.height,
      rem: viewport.fontSize,
      canvasWidth: viewport.frameWidth,
    }),
  });
  const SceneMoon = createMoonSceneClass(THREE, {
    getWord,
    playSound,
    storage: localStorage,
    onState: (state) => {
      app.state = state;
      ui.setState(state);
    },
  });
  class SceneUI extends THREE.Scene {}

  const sourceLoader = THREEPlayer.getSourceLoader();
  await sourceLoader.load(data.loadingManifest);
  player = new THREEPlayer({
    devSpeed: 1,
    renderer,
    layoutData: data.layoutData,
    uniformSetting,
    animationSetting: {},
    pluginSetting,
    modifierSetting,
    imageSetting: data.imageSetting,
    shaderSetting: data.shaderSetting,
    spineSetting: data.spineSetting,
    timelineSetting: data.timelineSetting,
    machineSetting: {},
    classSetting: { SceneUI, SceneMoon },
  });
  const sceneUI = player.getScene("scene_ui");
  const getLayer = (name) => sceneUI.getObjectByName(name);
  player.getScene("scene_loading");
  getLayer("scene_loading").visible = true;
  getLayer("scene_loading").material.uniforms.opacity.value = 1;
  flow = new OpeningFlow({
    ui,
    getLayer,
    getMoon: () => player.getScene("scene_moon"),
    tween: utils.tweenTo,
    playSound,
  });
  Object.assign(app, { player, renderer, ui, flow, data });

  let needsResize = true;
  window.addEventListener("resize", () => {
    needsResize = true;
  });
  function update() {
    if (app.status === "error") return;
    if (needsResize) {
      viewport = applyViewport(player);
      needsResize = false;
    }
    // Keep RAF and DOM transitions alive while the original scene clock is gated.
    // Leave the engine clock running: native resume caps the first delta to 30 ms.
    if (!scenePaused && !document.hidden && player.tick()) {
      player.renderScene("scene_ui");
    }
    requestAnimationFrame(update);
  }
  update();

  const progress = { value: 1e-10 };
  sourceLoader.clearAllListener();
  sourceLoader.setEventListener("progress", (ratio) => {
    utils
      .tweenTo(progress, 1, {
        value: 100 * ratio,
        overwrite: true,
        onUpdate: () => ui.setLoading(progress.value),
      })
      .then(() => {
        if (ratio === 1) {
          flow.ready = true;
          app.ready = true;
          ui.setLoading(100);
        }
      });
  });
  await sourceLoader.load(data.imageManifest);
  app.assetsReady = true;
  app.status = "ready";
  // Fonts and textures are now available when the moon initializes its text nodes.
  player.getScene("scene_moon");
  ui.attachHotspots(player);
}

initialize().catch((error) => {
  app.status = "error";
  app.error = error.message;
  showInitializationError();
  console.error(error);
});
