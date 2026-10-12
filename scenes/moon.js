import { FrameTimelinePlayer } from "./timeline.js";
import { ParticleTextController } from "./text.js";

export const MOON_PROGRESS_KEY = "e20250310nodkrai_moonStars";
const HINT_KEYS = ["loading_hint_0", "loading_hint_1"];
const STORY_NAMES = ["story_a", "story_b", "story_c", "story_d"];

function readProgress(storage) {
  try {
    const value = JSON.parse(storage?.getItem(MOON_PROGRESS_KEY) || "null");
    if (Array.isArray(value) && value.length === 4) return value.map(Boolean);
  } catch (_) {
    // A malformed old save should still allow the opening experience to start.
  }
  return [false, false, false, false];
}

/** Readable orchestration of the authored moon timelines and four guided interactions. */
export class MoonSceneController {
  constructor({
    scene,
    getWord,
    playSound = () => {},
    onState = () => {},
    storage,
    delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    setTimeout: schedule = globalThis.setTimeout,
    random = Math.random,
  }) {
    this.scene = scene;
    this.getWord = getWord;
    this.playSound = playSound;
    this.onState = onState;
    this.storage = storage;
    this.delay = delay;
    this.schedule = (...args) => schedule(...args);
    this.random = random;
    this.timelines = new FrameTimelinePlayer(scene);
    this.moonTimeline = "p1";
    this.enableMoonStars = readProgress(storage);
    this.touchEnable = false;
    this.hintIndex = 0;
    this.wheelBusy = false;
    this.state = {
      phase: "loading",
      showTopNav: false,
      showCopyright: false,
      showWheelHint: false,
      showCanvasPopup: false,
      showMoonTouchHint: -1,
    };
    this.text = new ParticleTextController({
      node: this.node("point_text"),
      timelines: this.timelines,
      canInteract: () => this.touchEnable,
      playSound,
    });
  }

  node(name) {
    const node = this.scene.getObjectByName(name);
    if (!node) throw new Error(`Missing moon scene object: ${name}`);
    return node;
  }

  get textState() {
    return this.text.state;
  }

  updateState(changes) {
    Object.assign(this.state, changes);
    this.scene.touchEnable = this.touchEnable;
    this.onState({ ...this.state, enableMoonStars: [...this.enableMoonStars] });
  }

  start() {
    this.startPromise ||= this.playOpening();
    return this.startPromise;
  }

  async playOpening() {
    this.node("point_text").visible = false;
    this.updateState({ phase: "intro", showTopNav: true, showCopyright: true });
    this.playSound("moon_in");
    if (!this.enableMoonStars[0]) {
      await this.timelines.play("一期动画", { start: 0, end: 303 });
    }
    const timelineName = this.enableMoonStars[0]
      ? this.moonTimeline
      : `${this.moonTimeline}_静止`;
    await this.timelines.play(timelineName, {
      start: 0,
      end: 152,
      onUpdate: (frame, previous) => {
        if (frame >= 60 && previous < 60) {
          this.openingTextPromise = this.showText(
            this.getWord(HINT_KEYS[0]),
            HINT_KEYS[0],
            true,
          );
        }
      },
    });
    this.touchEnable = true;
    this.updateState({ phase: "hints", showWheelHint: true });
  }

  showText(text = "", key = "", force = false, withSound = false) {
    return this.text.show(key ? this.getWord(key) : text, { force, withSound });
  }

  /** Receives the real DOM WheelEvent.deltaY; the original page store inverted that value. */
  async wheel(deltaY) {
    if (this.state.phase !== "hints" || this.wheelBusy || !deltaY) return false;
    this.wheelBusy = true;
    try {
      await this.delay(100);
      const next = Math.max(
        0,
        Math.min(HINT_KEYS.length, this.hintIndex + Math.sign(deltaY)),
      );
      if (next === this.hintIndex) return false;
      this.hintIndex = next;
      this.updateState({ showCopyright: next === 0 });
      const key = HINT_KEYS[next] || "";
      await this.showText(key ? this.getWord(key) : "", key, false, true);
      if (next === HINT_KEYS.length) {
        this.updateState({ phase: "revealing-stars", showWheelHint: false });
        await this.toInteractiveScene();
        this.updateState({ phase: "interactive" });
        this.setHighlightStar(
          this.enableMoonStars.findIndex((visited) => !visited),
        );
      }
      return true;
    } finally {
      this.wheelBusy = false;
    }
  }

  toInteractiveScene() {
    return this.timelines.play(this.moonTimeline, {
      start: 152,
      end: 225,
      onUpdate: (frame, previous) => {
        if (frame >= 164 && previous < 164) this.playSound("star_show");
      },
    });
  }

  setHighlightStar(index, hideVisited = false) {
    let hint = -1;
    for (let star = 0; star < 3; star++) {
      const spine = this.node(`click_xx_${star}`);
      const animation = spine.state.tracks[0].animation.name;
      if (
        star === index &&
        animation !== "mouse_over" &&
        !this.enableMoonStars[star]
      ) {
        spine.playAnimation("mouse_over", { loop: true });
        hint = star;
      } else if (star !== index && animation !== "loop") {
        this.schedule(
          () => spine.playAnimation("loop", { loop: true }),
          150 + 150 * this.random(),
        );
      }
      this.node(`click_${star}_point`).visible =
        (index !== -1 || !hideVisited) &&
        (star === index || this.enableMoonStars[star]);
    }
    if (this.setHighlightMoon(index === 3, hideVisited)) hint = 3;
    this.updateState({ showMoonTouchHint: hint });
  }

  setHighlightMoon(selected = true, hideVisited = false) {
    this.node("click_3_point").visible = hideVisited
      ? selected
      : selected || this.enableMoonStars[3];
    const moon = this.node("click_xx_moon");
    moon.visible = selected;
    if (selected && !this.enableMoonStars[3]) {
      moon.playAnimation("tips", { mix: 0, loop: true });
      return true;
    }
    return false;
  }

  async clickStar(index) {
    if (
      this.state.phase !== "interactive" ||
      !Number.isInteger(index) ||
      index < 0 ||
      index > 3
    )
      return false;
    this.updateState({
      phase: "popup-opening",
      showCanvasPopup: true,
      showCopyright: false,
      showWheelHint: false,
    });
    await this.showEgg(index);
    this.updateState({ phase: "popup" });
    return true;
  }

  async closePopup() {
    if (this.state.phase !== "popup") return false;
    this.updateState({ phase: "popup-closing" });
    await this.showEgg(-1);
    this.updateState({
      phase: "interactive",
      showCanvasPopup: false,
      showCopyright: true,
    });
    this.setHighlightStar(
      this.enableMoonStars.findIndex((visited) => !visited),
    );
    return true;
  }

  async showEgg(index) {
    const popup = this.scene.getTimeline("彩蛋1");
    if (![0, 40, 80].includes(popup.time)) return false;
    if (index >= 0) {
      this.enableMoonStars[index] = true;
      try {
        this.storage?.setItem(
          MOON_PROGRESS_KEY,
          JSON.stringify(this.enableMoonStars),
        );
      } catch (_) {}
    }
    this.setHighlightStar(-1, true);
    if (popup.time === 40 && index === -1) {
      this.playSound("text_hidden");
      this.storyTextPromise = this.timelines.play("story_text", {
        speed: 0.75,
        start: 40,
        end: 80,
      });
      await this.timelines.play("彩蛋1", { start: 40, end: 80 });
    } else if (popup.time !== 40 && index >= 0) {
      STORY_NAMES.forEach((name, story) => {
        this.node(name).visible = story === index;
      });
      this.playSound("text_show");
      this.storyTextPromise = this.timelines.play("story_text", {
        speed: 0.75,
        start: 0,
        end: 40,
      });
      this.storyAnimationPromise = this.timelines.play("story_ani", {
        start: 0,
      });
      await this.timelines.play("彩蛋1", { speed: 0.75, start: 0, end: 40 });
    }
    return true;
  }
}

/** Inject THREE so tests can exercise orchestration without creating a GPU context. */
export function createMoonSceneClass(THREE, services) {
  return class MoonScene extends THREE.Scene {
    onInit() {
      this.player = this.getPlayer();
      this.sceneLayer =
        services.getSceneLayer?.(this) ||
        this.player.getScene("scene_ui").getObjectByName(this.name);
      this.controller = new MoonSceneController({ ...services, scene: this });
    }

    async onShow() {
      this.touchEnable = false;
      this.sceneLayer.material.uniforms.opacity.value = 0;
    }

    transitionIn() {
      this.sceneLayer.visible = true;
      this.sceneLayer.material.uniforms.opacity.value = 1;
      return this.controller.start();
    }

    get enableMoonStars() {
      return this.controller.enableMoonStars;
    }
    get moonTimeline() {
      return this.controller.moonTimeline;
    }
    get textState() {
      return this.controller.textState;
    }
    showText(...args) {
      return this.controller.showText(...args);
    }
    toInteractiveScene() {
      return this.controller.toInteractiveScene();
    }
    setHighlightStar(...args) {
      return this.controller.setHighlightStar(...args);
    }
    setHighlightMoon(...args) {
      return this.controller.setHighlightMoon(...args);
    }
    showEgg(index) {
      return this.controller.showEgg(index);
    }
  };
}
