// Extracted rendering module: gradient-block. See ../PROVENANCE.md.
import * as dependency_tween_block from './tween-block.js';
import * as dependency_gradient from './gradient.js';
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
  o = (r = dependency_tween_block) && r.__esModule ? r : { default: r },
  a = dependency_gradient,
  s = (function (e) {
    function t(e) {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, t);
      var n = (function (e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
      })(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (n.update(), n);
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
          key: 'update',
          value: function () {
            this.gradientValues = this.frames.map(function (e) {
              return (0, a.createGradient)(e, 16);
            });
          },
        },
        {
          key: 'clone',
          value: function () {
            return new t(this);
          },
        },
      ]),
      t
    );
  })(o.default);
defaultExport = s;
export { defaultExport as default };
