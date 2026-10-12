// Extracted rendering module: spine-block. See ../PROVENANCE.md.
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
      var n = e || {},
        r = n.time,
        i = void 0 === r ? 0 : r,
        o = n.animation,
        a = void 0 === o ? '' : o,
        s = n.mix,
        l = void 0 === s ? 0 : s,
        c = n.loop,
        u = void 0 === c || c,
        f = n.sync,
        d = void 0 !== f && f,
        h = (function (e, t) {
          if (!e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            );
          return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
        })(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (h.time = i),
        (h.animation = a),
        (h.mix = l),
        (h.loop = u),
        (h.sync = d),
        h
      );
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
            return {
              start: this.start,
              end: this.end,
              animation: this.animation,
              time: this.time,
              mix: this.mix,
              loop: this.loop,
              sync: this.sync,
            };
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
