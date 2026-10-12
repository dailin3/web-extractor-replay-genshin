// Extracted rendering module: keyframe-block. See ../PROVENANCE.md.
import * as dependency_step_block from './step-block.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r,
  i = (function () {
    function e(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        ((r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r));
      }
    }
    return function (t, n, r) {
      return (n && e(t.prototype, n), r && e(t, r), t);
    };
  })(),
  o = (function (e) {
    function t(e) {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, t);
      var n = (e || {}).frames,
        r = void 0 === n ? [0, 1] : n,
        i = (function (e, t) {
          if (!e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            );
          return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
        })(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return ((i.frames = r), i);
    }
    return (
      (function (e, t) {
        if ('function' != typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof t,
          );
        ((e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
          t &&
            (Object.setPrototypeOf
              ? Object.setPrototypeOf(e, t)
              : (e.__proto__ = t)));
      })(t, e),
      i(t, [
        {
          key: 'clone',
          value: function () {
            return new t(this);
          },
        },
        {
          key: 'toJSON',
          value: function () {
            return { start: this.start, end: this.end, frames: this.frames };
          },
        },
      ]),
      t
    );
  })(
    ((r = dependency_step_block) && r.__esModule ? r : { default: r }).default,
  );
defaultExport = o;
export { defaultExport as default };
