// Extracted rendering module: step-timeline. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
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
  i = dependency_three,
  o = dependency_tween_timeline,
  a = dependency_step_frame,
  s = dependency_motion_utils;
function l(e) {
  return e && e.__esModule ? e : { default: e };
}
var c = (function (e) {
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
            o = void 0 === r ? null : r,
            l = n.data,
            c = void 0 === l ? [] : l,
            u = n.valueType,
            f = void 0 === u ? 'f' : u,
            d = n.clipStart,
            h = void 0 === d ? c[0].start : d,
            p = n.clipEnd,
            m = void 0 === p ? c[c.length - 1].end : p;
          ((this.type = 5),
            (this.valueType = f),
            (this.data = c.map(function (e) {
              return new a.default(e);
            })));
          var v = s.default.parsePath(o, this.name),
            g = v.object,
            y = v.target,
            A = v.prop;
          switch (
            ((this.getObject = function () {
              return g;
            }),
            (this.getValue = function () {
              return y[A];
            }),
            f.charAt(0))
          ) {
            case 'a':
              this.updateValue = function (e, n) {
                t.getBlock(e).value.forEach(function (e, t) {
                  1 === n ? (y[A][t] = e) : (y[A][t] += (e - y[A][t]) * n);
                });
              };
              break;
            case 'b':
            case 'f':
              this.updateValue = function (e, n) {
                var r = t.getBlock(e);
                1 === n ? (y[A] = r.value) : (y[A] += (r.value - y[A]) * n);
              };
              break;
            case 'c':
              var b = new i.Color();
              this.updateValue = function (e, n) {
                var r = t.getBlock(e);
                1 === n
                  ? y[A].setHex(r.value)
                  : y[A].lerp(b.setHex(r.value), n);
              };
              break;
            case 'v':
              var w = s.default.getConstructor(f);
              if (!w) throw new Error('type is incorrect:' + f);
              var _ = new w();
              this.updateValue = function (e, n) {
                var r = t.getBlock(e);
                1 === n
                  ? y[A].fromArray(r.value)
                  : y[A].lerp(_.fromArray(r.value), n);
              };
              break;
            case 'q':
              var x = new i.Quaternion();
              this.updateValue = function (e, n) {
                var r = t.getBlock(e);
                1 === n
                  ? y[A].fromArray(r.value)
                  : y[A].slerp(x.fromArray(r.value), n);
              };
              break;
            default:
              throw new Error('type is incorrect:' + f);
          }
          ((this.clipEnd = m), (this.clipStart = h));
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
})(o.default);
defaultExport = c;
export { defaultExport as default };
