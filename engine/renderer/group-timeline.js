// Extracted rendering module: group-timeline. See ../PROVENANCE.md.
import * as dependency_base_timeline from './base-timeline.js';
import { gsapLibrary as dependency_gsap } from '../vendor/libraries.js';
import * as dependency_motion from './motion.js';
import * as dependency_cue from './cue.js';
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
  o = dependency_gsap,
  a = dependency_base_timeline,
  s = dependency_cue,
  l = dependency_motion;
function c(e) {
  return e && e.__esModule ? e : { default: e };
}
var u = (function (e) {
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
            i = n.root,
            o = void 0 === i ? {} : i,
            a = n.clips,
            c = void 0 === a ? [] : a,
            u = n.cues,
            f = void 0 === u ? [] : u,
            d = n.methods,
            h = void 0 === d ? {} : d;
          ((this.cues = f.map(function (e) {
            return new s.default(r({}, e, { root: o, methods: h }));
          })),
            (this.clips = c.map(function (e) {
              var n = l.default.createTimeline(
                r({}, e, { root: o, methods: h }),
              );
              return ((n.parent = t), n);
            })),
            (this.time = 0),
            (this.tween = null),
            (this.weight = 1),
            (this.getObject = function () {
              return o;
            }));
        },
      },
      {
        key: 'traverse',
        value: function (e) {
          (e(this),
            this.clips.forEach(function (t) {
              1 === t.type ? t.traverse(e) : e(t);
            }));
        },
      },
      {
        key: 'list',
        value: function (e) {
          var t = [];
          return (
            this.name === e && t.push(this),
            this.clips.forEach(function (n) {
              1 === n.type
                ? (t = t.concat(n.list(e)))
                : n.name === e && t.push(n);
            }),
            t
          );
        },
      },
      {
        key: 'add',
        value: function (e) {
          ((e.parent = this), this.clips.push(e));
        },
      },
      {
        key: 'remove',
        value: function (e) {
          this.clips = this.clips.filter(function (t) {
            return t !== e;
          });
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
              cues: this.cues.map(function (t) {
                return t.toJSON(e);
              }),
              clips: this.clips.map(function (t) {
                return t.toJSON(e);
              }),
            },
          );
        },
      },
      {
        key: 'update',
        value: function (e, t, n, r) {
          var i = this;
          (this.cues.forEach(function (n) {
            n.update(e, t - i.start);
          }),
            0 !== this.weight &&
              Object.keys(this.clips)
                .map(function (e) {
                  return i.clips[e];
                })
                .forEach(function (o) {
                  try {
                    o.update(e, t - i.start, n * i.weight, r || i.loop);
                  } catch (e) {}
                }));
        },
      },
      {
        key: 'reset',
        value: function () {
          var e = this;
          (this.cues.forEach(function (e) {
            return e.reset();
          }),
            Object.keys(this.clips)
              .map(function (t) {
                return e.clips[t];
              })
              .forEach(function (e) {
                e.reset && e.reset();
              }));
        },
      },
      {
        key: 'pause',
        value: function () {
          this.tween && this.tween.pause();
        },
      },
      {
        key: 'resume',
        value: function () {
          this.tween && this.tween.resume();
        },
      },
      {
        key: 'stop',
        value: function () {
          this.tween && (this.tween.kill(), (this.tween = null));
        },
      },
      {
        key: 'play',
        value: function (e) {
          var t = this,
            n = e || {},
            r = n.loop,
            i = void 0 !== r && r,
            a = n.start,
            s = void 0 === a ? this.start : a,
            l = n.end,
            c = void 0 === l ? (i ? 999999 : this.duration) : l,
            u = n.repeat,
            f = void 0 === u ? 0 : u,
            d = n.delay,
            h = void 0 === d ? 0 : d,
            p = n.repeatDelay,
            m = void 0 === p ? 0 : p,
            v = n.ease,
            g = void 0 === v ? o.Linear.easeNone : v,
            y = n.speed,
            A = void 0 === y ? 1 : y,
            b = n.fps,
            w = void 0 === b ? 30 : b,
            _ = n.onUpdate,
            x = void 0 === _ ? null : _,
            k = n.onComplete,
            S = void 0 === k ? null : k;
          return (
            this.reset(),
            (this.tween = o.gsap.fromTo(
              this,
              { time: s },
              {
                duration: Math.abs(c - s) / w / A,
                time: c,
                onStart: this.seek.bind(this),
                onUpdate: x
                  ? function () {
                      (t.seek(), x());
                    }
                  : this.seek.bind(this),
                repeat: f,
                ease: g,
                delay: h,
                repeatDelay: m,
                onComplete: S,
              },
            )),
            this
          );
        },
      },
      {
        key: 'duration',
        get: function () {
          var e = 0;
          return (
            this.clips.forEach(function (t) {
              e = Math.max(t.duration + t.start, e);
            }),
            e
          );
        },
      },
      {
        key: 'totalFrame',
        get: function () {
          var e = 0;
          return (
            this.clips.forEach(function (t) {
              e = Math.max(t.totalFrame, e);
            }),
            e
          );
        },
      },
      {
        key: 'clipStart',
        get: function () {
          var e = Number.MAX_VALUE;
          return (
            this.clips.forEach(function (t) {
              e = Math.min(t.clipStart, e);
            }),
            e
          );
        },
        set: function (e) {
          this.clips &&
            this.clips.forEach(function (t) {
              t.clipStart = e;
            });
        },
      },
      {
        key: 'clipEnd',
        get: function () {
          var e = 0;
          return (
            this.clips.forEach(function (t) {
              e = Math.max(t.clipEnd, e);
            }),
            e
          );
        },
        set: function (e) {
          this.clips &&
            this.clips.forEach(function (t) {
              t.clipEnd = e;
            });
        },
      },
    ]),
    t
  );
})(a.default);
defaultExport = u;
export { defaultExport as default };
