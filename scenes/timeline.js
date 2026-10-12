/** Promise adapter for the native frame-based THREEPlayer timelines. */
export class FrameTimelinePlayer {
  constructor(scene) {
    this.scene = scene;
  }

  play(name, options = {}) {
    const timeline = this.scene.getTimeline(name);
    if (!timeline) throw new Error(`Missing scene timeline: ${name}`);
    timeline.stop();
    let previousFrame = timeline.start - 1;
    return new Promise((resolve, reject) => {
      timeline.play({
        ...options,
        onUpdate: () => {
          try {
            options.onUpdate?.(timeline.time, previousFrame, resolve, reject);
            previousFrame = timeline.time;
          } catch (error) {
            reject(error);
          }
        },
        onComplete: (...args) => {
          try {
            resolve(options.onComplete?.(...args));
          } catch (error) {
            reject(error);
          }
        },
      });
    });
  }
}
