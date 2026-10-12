// Extracted rendering module: tween-timeline. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_motion_utils from './motion-utils.js';
import * as dependency_base_timeline from './base-timeline.js';
import * as dependency_tween_block from './tween-block.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n)
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
      }
      return e;
    },
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
  o = dependency_three,
  a = dependency_base_timeline,
  s = dependency_motion_utils,
  l = u(s),
  c = dependency_tween_block;
function u(e) {
  return e && e.__esModule ? e : { default: e };
}
var f = (function (e) {
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
    i(t, [
      {
        key: 'copy',
        value: function (e) {
          var t = this,
            n = e || {},
            r = n.root,
            i = void 0 === r ? null : r,
            a = n.data,
            u = void 0 === a ? [] : a,
            f = n.valueType,
            d = void 0 === f ? 'f' : f,
            h = n.clipStart,
            p = void 0 === h ? u[0].start : h,
            m = n.clipEnd,
            v = void 0 === m ? u[u.length - 1].end : m;
          ((this.type = 3),
            (this.valueType = d),
            (this.data = u.map(function (e) {
              return new c.default(e);
            })));
          var g = l.default.parsePath(i, this.name),
            y = g.object,
            A = g.target,
            b = g.prop;
          switch (
            (y &&
              (y.matrixAutoUpdate =
                y.matrixAutoUpdate || s.matrixMatch.includes(b)),
            (this.getObject = function () {
              return y;
            }),
            (this.getValue = function () {
              return A[b];
            }),
            d.charAt(0))
          ) {
            case 'a':
              ((this.getFrame = function (e) {
                var n = t.getBlock(e);
                if (0 === n.duration) return n.frames[0];
                var r = (e - n.start) / n.duration,
                  i = n.easeFunc(r),
                  o = n.frames[0],
                  a = n.frames[1],
                  s = [];
                return (
                  o.forEach(function (e, t) {
                    s[t] = o[t] + (a[t] - o[t]) * i;
                  }),
                  s
                );
              }),
                (this.updateValue = function (e, n) {
                  t.getFrame(e).forEach(function (e, t) {
                    1 === n ? (A[b][t] = e) : (A[b][t] += (e - A[b][t]) * n);
                  });
                }));
              break;
            case 'f':
              ((this.getFrame = function (e) {
                var n = t.getBlock(e);
                if (0 === n.duration) return n.frames[0];
                var r = n.easeFunc((e - n.start) / n.duration),
                  i = n.frames[0];
                return i + (n.frames[1] - i) * r;
              }),
                (this.updateValue = function (e, n) {
                  1 === n
                    ? (A[b] = t.getFrame(e))
                    : (A[b] += (t.getFrame(e) - A[b]) * n);
                }));
              break;
            case 'r':
              var w = new o.Vector3(),
                _ = new o.Vector3(),
                x = new o.Euler(0, 0, 0, 'XYZ'),
                k = new o.Quaternion();
              ((this.getFrame = function (e) {
                var n = t.getBlock(e);
                if (0 === n.duration)
                  return x.set(
                    n.frames[0][0],
                    n.frames[0][1],
                    n.frames[0][2],
                    'XYZ',
                  );
                var r = n.easeFunc((e - n.start) / n.duration);
                return (
                  w.fromArray(n.frames[0]),
                  _.fromArray(n.frames[1]),
                  w.lerp(_, r),
                  x.set(w.x, w.y, w.z, 'XYZ')
                );
              }),
                (this.updateValue = function (e, n) {
                  A.quaternion && 1 !== n
                    ? (k.setFromEuler(t.getFrame(e)), A.quaternion.slerp(k, n))
                    : A[b].copy(t.getFrame(e));
                }));
              break;
            case 'c':
              var S = new o.Color(),
                E = new o.Color().setHex(u[1]);
              ((this.getFrame = function (e) {
                var n = t.getBlock(e);
                if (0 === n.duration) return S.setHex(n.frames[0]);
                var r = n.easeFunc((e - n.start) / n.duration);
                return (
                  S.setHex(n.frames[0]),
                  E.setHex(n.frames[1]),
                  S.lerp(E, r)
                );
              }),
                (this.updateValue = function (e, n) {
                  1 === n
                    ? A[b].copy(t.getFrame(e))
                    : A[b].lerp(t.getFrame(e), n);
                }));
              break;
            case 'v':
              var C = l.default.getConstructor(d);
              if (!C) throw new Error('type is incorrect:' + d);
              var T = new C(),
                I = new C();
              ((this.getFrame = function (e) {
                var n = t.getBlock(e);
                if (0 === n.duration) return T.fromArray(n.frames[0]);
                var r = n.easeFunc((e - n.start) / n.duration);
                return (
                  T.fromArray(n.frames[0]),
                  I.fromArray(n.frames[1]),
                  T.lerp(I, r)
                );
              }),
                (this.updateValue = function (e, n) {
                  1 === n
                    ? A[b].copy(t.getFrame(e))
                    : A[b].lerp(t.getFrame(e), n);
                }));
              break;
            case 'q':
              var M = new o.Quaternion(),
                O = new o.Quaternion();
              ((this.getFrame = function (e) {
                var n = t.getBlock(e);
                if (0 === n.duration) return M.fromArray(n.frames[0]);
                var r = n.easeFunc((e - n.start) / n.duration);
                return (
                  M.fromArray(n.frames[0]),
                  O.fromArray(n.frames[1]),
                  M.slerp(O, r)
                );
              }),
                (this.updateValue = function (e, n) {
                  1 === n
                    ? A[b].copy(t.getFrame(e))
                    : A[b].slerp(t.getFrame(e), n);
                }));
              break;
            default:
              throw new Error('type is incorrect:' + d);
          }
          ((this.clipEnd = v), (this.clipStart = p));
        },
      },
      {
        key: 'getBlock',
        value: function (e) {
          for (var t = this.data.length - 1; t > -1; t--)
            if (this.data[t].start <= e) return this.data[t];
          return this.data[0];
        },
      },
      {
        key: 'exportData',
        value: function () {
          var e = [],
            t = this.getBlock(this.clipStart),
            n = this.data.indexOf(t),
            r = this.getBlock(this.clipEnd),
            i = this.data.indexOf(r);
          ((t = t.clone()),
            ((r = i === n ? t : r.clone()).start -= this.clipStart),
            (t.end = t.end - this.clipStart + t.start + 1),
            (t.start = 0),
            (r.end = this.clipEnd - this.clipStart),
            e.push(t));
          for (var o = n + 1; o < i; o++) {
            var a = this.data[o].clone();
            ((a.start = Math.max(0, a.start - this.clipStart)), e.push(a));
          }
          return (i !== n && e.push(r), e);
        },
      },
      {
        key: 'update',
        value: function (e, t, n, r) {
          if (0 !== this.weight) {
            var i = t - this.start;
            (this.duration && (this.loop || r) && (i %= this.duration),
              i >= 0 && i <= this.duration
                ? ((this.percent = this.duration ? i / this.duration : 0),
                  this.updateValue(i + this.clipStart, this.weight * n))
                : 0 !== this.percent && i < 0
                  ? ((this.percent = 0),
                    this.updateValue(this.clipStart, this.weight * n))
                  : 1 !== this.percent &&
                    i > this.duration &&
                    ((this.percent = 1),
                    this.updateValue(this.clipEnd, this.weight * n)));
          }
        },
      },
      {
        key: 'clone',
        value: function () {
          return new t(this);
        },
      },
      {
        key: 'toJSON',
        value: function () {
          var e = r(
            {},
            (function e(t, n, r) {
              null === t && (t = Function.prototype);
              var i = Object.getOwnPropertyDescriptor(t, n);
              if (void 0 === i) {
                var o = Object.getPrototypeOf(t);
                return null === o ? void 0 : e(o, n, r);
              }
              if ('value' in i) return i.value;
              var a = i.get;
              return void 0 !== a ? a.call(r) : void 0;
            })(
              t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
              'toJSON',
              this,
            ).call(this),
            {
              data: this.data.map(function (e) {
                return e.toJSON();
              }),
              clipStart: this.clipStart,
              clipEnd: this.clipEnd,
            },
          );
          return (
            void 0 !== this.valueType && (e.valueType = this.valueType),
            e
          );
        },
      },
      {
        key: 'duration',
        get: function () {
          return this.clipEnd - this.clipStart;
        },
      },
      {
        key: 'totalFrame',
        get: function () {
          return this.data[this.data.length - 1].end;
        },
      },
    ]),
    t
  );
})(a.default);
defaultExport = f;
export { defaultExport as default };
