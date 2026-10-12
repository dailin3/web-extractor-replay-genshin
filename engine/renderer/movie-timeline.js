// Extracted rendering module: movie-timeline. See ../PROVENANCE.md.
import * as dependency_motion_utils from './motion-utils.js';
import * as dependency_tween_timeline from './tween-timeline.js';
import * as dependency_step_frame from './step-frame.js';
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
  i = dependency_tween_timeline,
  o = dependency_step_frame,
  a = dependency_motion_utils;
function s(e) {
  return e && e.__esModule ? e : { default: e };
}
var l = (function (e) {
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
    return (n.copy(e), n);
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
        key: 'copy',
        value: function (e) {
          var t = this,
            n = e || {},
            r = n.root,
            i = void 0 === r ? null : r,
            s = n.data,
            l = void 0 === s ? [] : s,
            c = n.clipStart,
            u = void 0 === c ? l[0].start : c,
            f = n.clipEnd,
            d = void 0 === f ? l[l.length - 1].end : f;
          ((this.type = 8),
            (this.valueType = 'str'),
            (this.data = l.map(function (e) {
              return new o.default(e);
            })));
          var h = a.default.parsePath(i, this.name),
            p = h.object,
            m = h.target,
            v = h.prop;
          ((this.getObject = function () {
            return p;
          }),
            (this.getValue = function () {
              return m[v];
            }),
            (this.updateValue = function (e, n) {
              var r = t.getBlock(e);
              1 === n && (m[v] = r.value);
            }),
            (this.clipEnd = d),
            (this.clipStart = u));
        },
      },
      {
        key: 'getFrame',
        value: function (e) {
          return this.getBlock(e).value;
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
})(i.default);
defaultExport = l;
export { defaultExport as default };
