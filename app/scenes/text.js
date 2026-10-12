export const TextState = Object.freeze({
  idle: "animationIdle",
  entering: "animationIn",
  leaving: "animationOut",
  visible: "animationEnd",
});

/** The words are drawn by the original particle-text node, with its original timeline. */
export class ParticleTextController {
  constructor({ node, timelines, canInteract, playSound }) {
    this.node = node;
    this.timelines = timelines;
    this.canInteract = canInteract;
    this.playSound = playSound;
    this.state = TextState.idle;
  }

  async show(text = "", { force = false, withSound = false } = {}) {
    if (!force && !this.canInteract()) return false;
    if (this.state === TextState.entering || this.state === TextState.leaving)
      return false;

    if (this.state === TextState.visible) {
      this.state = TextState.leaving;
      if (!text && withSound) this.playSound("text_hidden");
      await this.timelines.play("points_text", {
        speed: 0.75,
        start: 40,
        end: 80,
      });
      this.state = TextState.idle;
    }
    if (!text) return true;

    this.state = TextState.entering;
    this.node.setText({ text });
    if (withSound) this.playSound("text_show");
    await this.timelines.play("points_text", {
      speed: 0.75,
      start: 0,
      end: 40,
    });
    this.state = TextState.visible;
    return true;
  }
}
