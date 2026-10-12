/** Clockwise SVG fan used by the loading artwork. */
export function loadingSectorPath(progress) {
  const fraction = Math.max(0, Math.min(100, progress)) / 100;
  const angle = fraction * Math.PI * 2;
  const x =
    Math.abs(100 + 100 * Math.sin(angle)) < 1e-12
      ? 0
      : 100 + 100 * Math.sin(angle);
  const y =
    Math.abs(100 - 100 * Math.cos(angle)) < 1e-12
      ? 0
      : 100 - 100 * Math.cos(angle);
  return `M100,100 v-100 A 100 100 0 ${fraction > 0.5 ? 1 : 0} 1 ${x} ${y} Z`;
}

export function deriveUIVisibility(state) {
  const popup = Boolean(state.showCanvasPopup);
  return {
    topNav: Boolean(state.showTopNav),
    wheelHint:
      Boolean(state.showWheelHint) && !popup && !state.sceneInteractive,
    navHint: Boolean(state.showTopNav) && !popup,
    hotspots: state.phase === "interactive" && !popup && !state.rulesOpen,
    guideIndex: popup ? -1 : (state.showMoonTouchHint ?? -1),
  };
}

/** The native prompt waits eight seconds after the last mouse/touch interaction. */
export class InteractionIdleHint {
  constructor({
    onChange,
    schedule = (...args) => globalThis.setTimeout(...args),
    cancel = (...args) => globalThis.clearTimeout(...args),
  }) {
    Object.assign(this, {
      onChange,
      schedule,
      cancel,
      active: false,
      timer: null,
    });
  }

  record() {
    this.cancel(this.timer);
    this.active = true;
    this.onChange(true);
    this.timer = this.schedule(() => {
      this.active = false;
      this.onChange(false);
    }, 8000);
  }

  destroy() {
    this.cancel(this.timer);
  }
}

/** A source point owns its CSS3D child before the renderer inserts it into the document. */
export function findHotspotElement(
  node,
  id,
  lookup = (id) => document.getElementById(id),
) {
  return (
    lookup(id) || node?.children?.find((child) => child.isCSS3DObject)?.element
  );
}

/** The first page's DOM layer. Scene imagery and story text remain in WebGL. */
export function createUI({
  getWord = () => "",
  onStart = () => {},
  onWheel = () => {},
  onStar = () => {},
  onDismiss = () => {},
  onAudio = () => {},
  onRulesChange = () => {},
}) {
  const root = document.getElementById("page-ui");
  root.innerHTML = `
    <div class="ui-frame">
      <div class="top-container" hidden>
        <div class="top-nav">
          <div class="top-left"><div class="icon nav-spacer"></div>
            <button class="login-button" type="button"><span>登录</span></button>
          </div>
          <div class="top-right">
            <button class="icon rules-button" type="button" aria-label="活动规则"></button>
            <button class="icon audio-button" type="button" aria-label="关闭音乐" aria-pressed="true">
              <img class="audio-normal" src="/ui-assets/audio-on.png" alt="">
              <img class="audio-hover" src="/ui-assets/audio-on-hover.png" alt="">
            </button>
            <button class="icon share-button" type="button" aria-label="分享"></button>
          </div>
        </div>
      </div>
    </div>
    <div class="effect-hot-spot">
      <div class="wheel-hint default-font" hidden><span class="text">滑动鼠标滚轮继续</span></div>
      <div class="nav-hint" hidden aria-label="第一个场景"><span class="item select"></span><span class="item"></span><span class="item"></span><span class="item"></span></div>
    </div>
    <div class="loading">
      <div class="loading-container" data-progress="0">
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs><mask id="fanMask"><rect width="200" height="200" fill="black"/><path fill="white"/></mask></defs>
          <image href="/ui-assets/loading-progress.png" width="200" height="200" mask="url(#fanMask)"/>
        </svg><span class="loading-progress">0%</span>
      </div>
      <div class="start-hint" hidden><span>点击开始</span></div>
    </div>`;

  const loading = root.querySelector(".loading");
  const loadingContainer = root.querySelector(".loading-container");
  const progressText = root.querySelector(".loading-progress");
  const fan = root.querySelector("#fanMask path");
  const startHint = root.querySelector(".start-hint");
  const topNav = root.querySelector(".top-container");
  const wheelHint = root.querySelector(".wheel-hint");
  const navHint = root.querySelector(".nav-hint");
  const audio = root.querySelector(".audio-button");
  const rules = document.createElement("div");
  rules.className = "rules-mask";
  rules.hidden = true;
  rules.innerHTML = `<div class="popup-container popup-rule">
    <div class="popup-body" role="dialog" aria-modal="true" aria-labelledby="rules-title">
      <div class="popup-title"><span id="rules-title"></span></div>
      <div class="popup-content"><div class="scrollContainer"><div class="rules-scroll-viewport"><div class="rules-scroll-panel"><div class="rules-scroll-view"><div class="scrollContent"></div></div></div></div></div></div>
      <button class="popup-close" type="button" aria-label="关闭简介"></button>
      <div class="popup-bottom" hidden></div>
    </div></div>`;
  root.append(rules);
  const word = (key, fallback) => getWord(key) || fallback;
  rules.querySelector("#rules-title").textContent = word("rules_title", "简介");
  // This authored HTML comes from the captured local localization file.
  rules.querySelector(".scrollContent").innerHTML = word("rules_content", "");
  startHint.querySelector("span").textContent = word(
    "click_to_start",
    "点击开始",
  );
  root.querySelector(".login-button span").textContent = word("login", "登录");
  wheelHint.querySelector(".text").textContent = word(
    "wheel_hint",
    "滑动鼠标滚轮继续",
  );
  const hotspots = Array.from({ length: 4 }, (_, index) => {
    const target = document.createElement("span");
    target.className = `moon-star moon-star-${index}`;
    target.setAttribute("role", "button");
    target.setAttribute(
      "aria-label",
      index === 3 ? "月亮" : `星星${index + 1}`,
    );
    target.tabIndex = 0;
    target.innerHTML = '<span class="hint"></span>';
    const activate = (event) => {
      event.stopPropagation();
      if (!deriveUIVisibility(state).hotspots) return;
      onStar(index);
    };
    target.addEventListener("click", activate);
    target.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate(event);
      }
    });
    return target;
  });

  let state = { phase: "loading" };
  let progress = 0;
  let started = false;
  let audioEnabled = true;
  let focusBeforeRules = null;
  let rulesMotion = 0;
  let rulesTimer = null;
  let rulesScenePaused = false;
  let wheelHintVisible = false;
  let wheelHintMotion = 0;
  let wheelHintTimer = null;
  let guideIndex = -1;
  let guideMotion = 0;
  const idleHint = new InteractionIdleHint({ onChange: () => setState(state) });
  const interaction = () => idleHint.record();
  for (const type of ["wheel", "mousedown", "touchstart", "touchmove"]) {
    document.addEventListener(type, interaction, { passive: true });
  }
  const start = () => {
    if (progress < 100 || started) return;
    started = true;
    onStart();
  };
  loading.addEventListener("click", start);
  const wheel = (event) => {
    if (!rules.hidden) return;
    if (state.phase !== "hints") return;
    event.preventDefault();
    onWheel(event.deltaY);
  };
  window.addEventListener("wheel", wheel, { passive: false });
  const dismiss = () => {
    if (state.showCanvasPopup) onDismiss();
  };
  document.getElementById("canvas-bg").addEventListener("click", dismiss);
  audio.addEventListener("click", () => {
    setAudio(!audioEnabled);
    onAudio(audioEnabled);
  });
  root
    .querySelector(".rules-button")
    .addEventListener("click", () => showRules(true));
  rules
    .querySelector(".popup-close")
    .addEventListener("click", () => showRules(false));
  rules.addEventListener("click", (event) => {
    if (event.target === rules) showRules(false);
  });
  const escape = (event) => {
    if (rules.hidden) return;
    if (event.key === "Escape") showRules(false);
    if (event.key === "Tab") {
      event.preventDefault();
      rules.querySelector(".popup-close").focus({ preventScroll: true });
    }
  };
  document.addEventListener("keydown", escape);

  function showRules(show = true) {
    if (show && state.rulesOpen && rules.dataset.motion !== "exit") return;
    if (!show && (!state.rulesOpen || rules.dataset.motion === "exit")) return;
    if (show && !state.rulesOpen) {
      focusBeforeRules = document.activeElement;
    }
    if (show !== rulesScenePaused) {
      rulesScenePaused = show;
      onRulesChange(show);
    }
    const motion = ++rulesMotion;
    clearTimeout(rulesTimer);
    state.rulesOpen = true;
    setState(state);
    rules.dataset.motion = show ? "enter" : "exit";
    rules.classList.toggle("rules-transparent", show);
    rules.hidden = false;
    if (show)
      rules.querySelector(".popup-close").focus({ preventScroll: true });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (motion !== rulesMotion) return;
        rules.classList.toggle("rules-transparent", !show);
        rulesTimer = setTimeout(
          () => {
            if (motion !== rulesMotion) return;
            delete rules.dataset.motion;
            if (!show) {
              rules.hidden = true;
              rules.classList.remove("rules-transparent");
              state.rulesOpen = false;
              setState(state);
              if (focusBeforeRules?.isConnected)
                focusBeforeRules.focus({ preventScroll: true });
            }
          },
          show ? 250 : 180,
        );
      }),
    );
  }

  function setAudio(enabled) {
    audioEnabled = Boolean(enabled);
    audio.setAttribute("aria-pressed", String(audioEnabled));
    audio.setAttribute("aria-label", audioEnabled ? "关闭音乐" : "开启音乐");
    const name = audioEnabled ? "on" : "off";
    audio.querySelector(".audio-normal").src = `/ui-assets/audio-${name}.png`;
    audio.querySelector(".audio-hover").src =
      `/ui-assets/audio-${name}-hover.png`;
  }

  function revealWithFade(element) {
    element.hidden = false;
    element.classList.add("fade-enter", "fade-enter-active");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => element.classList.remove("fade-enter")),
    );
  }

  function setWheelHintVisible(show) {
    if (show === wheelHintVisible) return;
    wheelHintVisible = show;
    const motion = ++wheelHintMotion;
    clearTimeout(wheelHintTimer);
    wheelHint.classList.remove(
      "fade-leave",
      "fade-leave-active",
      "fade-leave-to",
    );
    if (show) {
      revealWithFade(wheelHint);
      return;
    }
    wheelHint.classList.add("fade-leave", "fade-leave-active");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (motion !== wheelHintMotion) return;
        wheelHint.classList.remove("fade-leave");
        wheelHint.classList.add("fade-leave-to");
        wheelHintTimer = setTimeout(() => {
          if (motion !== wheelHintMotion) return;
          wheelHint.hidden = true;
          wheelHint.classList.remove("fade-leave-active", "fade-leave-to");
        }, 500);
      }),
    );
  }

  function setState(next) {
    state = { ...state, ...next };
    const visible = deriveUIVisibility({
      ...state,
      sceneInteractive: idleHint.active,
    });
    if (topNav.hidden && visible.topNav) {
      revealWithFade(topNav);
    } else if (!visible.topNav) topNav.hidden = true;
    setWheelHintVisible(visible.wheelHint);
    navHint.hidden = !visible.navHint;
    root.querySelector(".ui-frame").inert = Boolean(state.rulesOpen);
    hotspots.forEach((target, index) => {
      target.style.pointerEvents = visible.hotspots ? "auto" : "none";
      target.tabIndex = visible.hotspots ? 0 : -1;
    });
    if (guideIndex !== visible.guideIndex) {
      guideIndex = visible.guideIndex;
      const motion = ++guideMotion;
      hotspots.forEach((target) => target.classList.remove("show-hint"));
      if (guideIndex >= 0)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (motion === guideMotion)
              hotspots[guideIndex].classList.add("show-hint");
          }),
        );
    }
  }

  function setLoading(value) {
    const rawProgress = Math.max(0, Math.min(100, value));
    progress = Math.floor(rawProgress);
    loadingContainer.dataset.progress = String(progress);
    progressText.textContent = word("loading_number", "{num}%").replace(
      "{num}",
      String(progress),
    );
    fan.setAttribute("d", loadingSectorPath(rawProgress));
    if (progress === 100 && startHint.hidden) revealWithFade(startHint);
    else if (progress < 100) startHint.hidden = true;
  }

  /** Engine CSS3D points position these hit areas using the same camera as the moon. */
  function attachHotspots(player) {
    const loadingPoint =
      document.getElementById("scene_loading") ||
      player?.CSS3DRenderer?.domElement.querySelector("#scene_loading");
    if (loadingPoint && loading.parentElement !== loadingPoint)
      loadingPoint.append(loading);
    hotspots.forEach((target, index) => {
      const node = player
        ?.getScene("scene_moon")
        ?.getObjectByName(`click_${index}_point`);
      const parent = findHotspotElement(node, `moon_start_click_${index}`);
      if (parent && target.parentElement !== parent) parent.append(target);
    });
    setState(state);
  }

  async function hideLoading({ duration = 500 } = {}) {
    loading.style.transition = `opacity ${duration}ms`;
    loading.style.pointerEvents = "none";
    loading.style.opacity = "0";
    if (duration) await new Promise((resolve) => setTimeout(resolve, duration));
    loading.remove();
  }

  setLoading(0);
  setState(state);
  return {
    setLoading,
    hideLoading,
    setState,
    setAudio,
    attachHotspots,
    showRules,
    destroy() {
      idleHint.destroy();
      rulesMotion++;
      clearTimeout(rulesTimer);
      wheelHintMotion++;
      clearTimeout(wheelHintTimer);
      guideMotion++;
      document.removeEventListener("keydown", escape);
      for (const type of ["wheel", "mousedown", "touchstart", "touchmove"])
        document.removeEventListener(type, interaction);
      window.removeEventListener("wheel", wheel);
      document
        .getElementById("canvas-bg")
        ?.removeEventListener("click", dismiss);
      hotspots.forEach((target) => target.remove());
      loading.remove();
      root.replaceChildren();
    },
  };
}
