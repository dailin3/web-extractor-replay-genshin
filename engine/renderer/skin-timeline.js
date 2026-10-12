// Extracted rendering module: skin-timeline. See ../PROVENANCE.md.
import * as dependency_tween_timeline from './tween-timeline.js';
import * as dependency_skin_block from './skin-block.js';
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
  o = dependency_tween_timeline,
  a = dependency_skin_block;
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
    i(t, [
      {
        key: 'copy',
        value: function (e) {
          var t = this,
            n = e || {},
            r = n.root,
            i = void 0 === r ? null : r,
            o = n.data,
            s = void 0 === o ? [] : o,
            l = n.clipStart,
            c = void 0 === l ? s[0].start : l,
            u = n.clipEnd,
            f = void 0 === u ? s[s.length - 1].end : u,
            d = n.resetSlot,
            h = void 0 === d || d;
          ((this.type = 6),
            (this.data = s.map(function (e) {
              return new a.default(e);
            })),
            (this.clipEnd = f),
            (this.clipStart = c));
          var p = i.getObjectByName(this.name);
          ((this.resetSlot = h),
            (this.render = function (e) {
              var n = t.getFrame(e);
              if (p.skeleton.skin.name !== n)
                try {
                  (p.skeleton.setSkinByName(n),
                    t.resetSlot && p.skeleton.setSlotsToSetupPose());
                } catch (e) {}
            }),
            (this.getObject = function () {
              return p;
            }),
            (this.getValue = function () {
              return p.skeleton.skin.name;
            }));
        },
      },
      {
        key: 'getFrame',
        value: function (e) {
          return this.getBlock(e).skin;
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
                  this.render(i + this.clipStart))
                : 0 !== this.percent && i < 0
                  ? ((this.percent = 0), this.render(this.clipStart))
                  : 1 !== this.percent &&
                    i > this.duration &&
                    ((this.percent = 1), this.render(this.clipEnd)));
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
              data: this.data.map(function (e) {
                return e.toJSON();
              }),
              clipStart: this.clipStart,
              clipEnd: this.clipEnd,
              resetSlot: this.resetSlot,
            },
          );
        },
      },
    ]),
    t
  );
})(o.default);
defaultExport = l;
export { defaultExport as default };
