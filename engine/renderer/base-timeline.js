/** Shared frame metadata. Preserve function construction for recovered subclasses. */
export const __esModule = true;
export default function BaseTimeline(options) {
  // Remaining Babel-derived timelines invoke BaseTimeline.call(this, options).
  if (!(this instanceof BaseTimeline))
    throw new TypeError("Cannot call a class as a function");
  const {
    type = 1,
    start = 0,
    end = 0,
    loop = false,
    weight = 1,
    name = "",
  } = options || {};
  Object.assign(this, { type, start, end, name, loop, weight });
}
// Native class descriptor semantics without making the constructor uncallable.
Object.defineProperties(BaseTimeline.prototype, {
  seek: {
    configurable: true,
    writable: true,
    value(time = this.time) {
      this.time = time;
      this.update(time, time, 1);
    },
  },
  toJSON: {
    configurable: true,
    writable: true,
    value() {
      return {
        type: this.type,
        start: this.start,
        name: this.name,
        loop: this.loop,
      };
    },
  },
  rootClip: {
    configurable: true,
    get() {
      for (let ancestor = this.parent; ancestor; ancestor = ancestor.parent)
        if (!ancestor.parent) return ancestor;
      return this;
    },
  },
  realStartTime: {
    configurable: true,
    get() {
      let time = this.start;
      for (let ancestor = this.parent; ancestor; ancestor = ancestor.parent)
        time += ancestor.start;
      return time;
    },
  },
});
