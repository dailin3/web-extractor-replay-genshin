/** The font must be ready before Points creates and caches its first text texture. */
export async function loadFont(
  url,
  { FontFace = globalThis.FontFace, fonts = document.fonts } = {},
) {
  const font = new FontFace("fontLink", `url("${url}")`);
  await font.load();
  fonts.add(font);
  return font;
}

/** Transition from the loading layer into the first authored moon timeline. */
export class OpeningFlow {
  constructor({ ui, getLayer, getMoon, tween, playSound }) {
    Object.assign(this, { ui, getLayer, getMoon, tween, playSound });
    this.ready = false;
    this.started = false;
  }

  async start() {
    if (!this.ready || this.started) return false;
    this.started = true;
    this.ui.setState({ showTopNav: true, showCopyright: true });
    this.playSound("bgm_moon");
    const moon = this.getMoon();
    await moon.onShow();
    const next = this.getLayer("scene_moon");
    const previous = this.getLayer("scene_loading");
    next.visible = true;
    // The original compositor reveals the already rendered moon buffer during this fade.
    next.material.uniforms.opacity.value = 1;
    next.renderOrder = 0;
    previous.renderOrder = 10;
    await this.tween(previous.material.uniforms.opacity, 0.5, { value: 0 });
    this.ui.hideLoading({ duration: 0 });
    previous.visible = false;
    previous.material.uniforms.opacity.value = 1;
    previous.renderOrder = 0;
    return moon.transitionIn();
  }
}
