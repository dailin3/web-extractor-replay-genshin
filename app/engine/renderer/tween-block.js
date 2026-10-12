// Extracted rendering module: tween-block. See ../PROVENANCE.md.
import * as dependency_motion_utils from './motion-utils.js';
import * as dependency_step_block from './step-block.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = (function () {
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
  i = dependency_motion_utils;
function o(e) {
  return e && e.__esModule ? e : { default: e };
}
var a = (function (e) {
  function t(e) {
    !(function (e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    })(this, t);
    var n = e || {},
      r = n.frames,
      o = void 0 === r ? [] : r,
      a = n.ease,
      s = void 0 === a ? '' : a,
      l = (function (e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
      })(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
    return (
      (l.frames = o),
      (l.ease = s),
      (l.easeFunc = i.default.easeFunction(s)),
      l
    );
  }
  return (
    (function (e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t,
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
    r(t, [
      {
        key: 'clone',
        value: function () {
          return new t(this);
        },
      },
      {
        key: 'toJSON',
        value: function () {
          return {
            start: this.start,
            end: this.end,
            frames: this.frames,
            ease: this.ease,
          };
        },
      },
    ]),
    t
  );
})(dependency_step_block.default);
defaultExport = a;
export { defaultExport as default };
