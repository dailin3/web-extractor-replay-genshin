// Extracted rendering module: keyframe-timeline. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_motion_utils from './motion-utils.js';
import * as dependency_base_timeline from './base-timeline.js';
import * as dependency_keyframe_block from './keyframe-block.js';
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
  a = dependency_keyframe_block,
  s = dependency_base_timeline,
  l = dependency_motion_utils,
  c = u(l);
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
            s = n.data,
            u = void 0 === s ? [] : s,
            f = n.valueType,
            d = void 0 === f ? 'f' : f,
            h = n.clipStart,
            p = void 0 === h ? 0 : h,
            m = n.clipEnd,
            v = void 0 === m ? u[u.length - 1].end : m;
          ((this.valueType = d),
            (this.data = u.map(function (e) {
              return new a.default(e);
            })));
          var g = c.default.parsePath(i, this.name),
            y = g.object,
            A = g.target,
            b = g.prop;
          switch (
            ((y.matrixAutoUpdate =
              y.matrixAutoUpdate || l.matrixMatch.includes(b)),
            (this.getObject = function () {
              return y;
            }),
            (this.getValue = function () {
              return A[b];
            }),
            d.charAt(0))
          ) {
            case 'a':
              this.updateValue = function (e, n, r, i) {
                var o = t.getFrame(e),
                  a = t.getFrame(n);
                o.forEach(function (e, t) {
                  var n = o[t] + (a[t] - o[t]) * r;
                  1 === i ? (A[b][t] = n) : (A[b][t] += (n - A[b][t]) * i);
                });
              };
              break;
            case 'f':
              this.updateValue = function (e, n, r, i) {
                var o = t.getFrame(e),
                  a = o + (t.getFrame(n) - o) * r;
                1 === i ? (A[b] = a) : (A[b] += (a - A[b]) * i);
              };
              break;
            case 'c':
              var w = new o.Color(),
                _ = new o.Color();
              this.updateValue = function (e, n, r, i) {
                (w.setHex(t.getFrame(e)),
                  _.setHex(t.getFrame(n)),
                  1 === i
                    ? A[b].copy(w.lerp(_, r))
                    : A[b].lerp(w.lerp(_, r), i));
              };
              break;
            case 'v':
              var x = c.default.getConstructor(d);
              if (!x) throw new Error('type is incorrect:' + d);
              var k = new x(),
                S = new x();
              ((this.initialize = c.default.initializeVector),
                (this.updateValue = function (e, n, r, i) {
                  (k.fromArray(t.getFrame(e)),
                    S.fromArray(t.getFrame(n)),
                    1 === i
                      ? A[b].copy(k.lerp(S, r))
                      : A[b].lerp(k.lerp(S, r), i));
                }));
              break;
            case 'q':
              var E = new o.Quaternion(),
                C = new o.Quaternion();
              this.updateValue = function (e, n, r, i) {
                (E.fromArray(t.getFrame(e)).normalize(),
                  C.fromArray(t.getFrame(n)).normalize(),
                  1 === i
                    ? A[b].copy(E.slerp(C, r))
                    : A[b].slerp(E.slerp(C, r), i));
              };
              break;
            default:
              throw new Error('type is incorrect:' + d);
          }
          ((this.clipStart = p), (this.clipEnd = v));
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
        key: 'getFrame',
        value: function (e) {
          var t = this.getBlock(e);
          return t.frames[Math.min(t.frames.length - 1, e - t.start)];
        },
      },
      {
        key: 'exportData',
        value: function () {
          var e = this,
            t = [],
            n = this.getBlock(this.clipStart),
            r = this.data.indexOf(n),
            i = this.getBlock(this.clipEnd),
            o = this.data.indexOf(i);
          ((n = n.clone()),
            ((i = o === r ? n : i.clone()).frames = i.frames.filter(
              function (t, n) {
                return n + i.start <= e.clipEnd;
              },
            )),
            (n.frames = n.frames.filter(function (t, r) {
              return r < n.frames.length - 1
                ? r + n.start >= e.clipStart
                : n.end >= e.clipStart;
            })),
            (i.start -= this.clipStart),
            (n.end = n.end - this.clipStart + n.start),
            (n.start = 0),
            (i.end = this.clipEnd - this.clipStart),
            t.push(n));
          for (var a = r + 1; a < o; a++) {
            var s = this.data[a].clone();
            ((s.start = Math.max(0, s.start - this.clipStart)), t.push(s));
          }
          return (o !== r && t.push(i), t);
        },
      },
      {
        key: 'update',
        value: function (e, t, n, r) {
          if (0 !== this.weight) {
            var i = t - this.start;
            ((this.loop || r) && (i %= this.duration),
              i >= 0 && i <= this.duration
                ? ((this.percent = i / this.duration), this.render(n))
                : 0 !== this.percent && i < 0
                  ? ((this.percent = 0), this.render(n))
                  : 1 !== this.percent &&
                    i > this.duration &&
                    ((this.percent = 1), this.render(n)));
          }
        },
      },
      {
        key: 'render',
        value: function (e) {
          var t = this.duration * this.percent + this.clipStart,
            n = Math.floor(t),
            r = Math.ceil(t);
          this.updateValue(n, r, t - n, this.weight * e);
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
        value: function (e) {
          var n = e ? this.data : this.exportData();
          return r(
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
              valueType: this.valueType,
              data: n.map(function (e) {
                return e.toJSON();
              }),
              clipStart: e ? this.clipStart : 0,
              clipEnd: e ? this.clipEnd : this.clipEnd - this.clipStart,
            },
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
})(s.default);
defaultExport = f;
export { defaultExport as default };
