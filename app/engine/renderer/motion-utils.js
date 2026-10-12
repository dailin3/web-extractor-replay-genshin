// Extracted rendering module: motion-utils. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import { gsapLibrary as dependency_gsap } from '../vendor/libraries.js';
import { customEaseLibrary as dependency_custom_ease } from '../vendor/libraries.js';
export const __esModule = true;
let matrixMatch, defaultExport;
('use strict');
(void 0, (matrixMatch = void 0));
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
  o = dependency_gsap,
  a = dependency_custom_ease;
function s(e) {
  if (e && e.__esModule) return e;
  var t = {};
  if (null != e)
    for (var n in e)
      Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
  return ((t.default = e), t);
}
var l = {
    sine: o.Sine,
    linear: o.Linear,
    power2: o.Power2,
    power3: o.Power3,
    power4: o.Power4,
    back: o.Back,
    elastic: o.Elastic,
    bounce: o.Bounce,
  },
  c = { in: 'easeIn', out: 'easeOut', inout: 'easeInOut', none: 'easeNone' },
  u = {},
  f = (function () {
    function e() {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e);
    }
    return (
      r(e, null, [
        {
          key: 'getConstructor',
          value: function (e) {
            switch (e) {
              case 'v2':
                return i.Vector2;
              case 'v3':
                return i.Vector3;
              case 'v4':
                return i.Vector4;
              case 'q':
                return i.Quaternion;
              case 'c':
                return i.Color;
              default:
                return;
            }
          },
        },
        {
          key: 'easeFunction',
          value: function (e) {
            if (0 === e.indexOf('custom ')) {
              var t = e.substring(7);
              return (u[t] || (u[t] = a.CustomEase.create(t, t)), u[t]);
            }
            var n = e.toLowerCase().split('.'),
              r = n[0],
              i = c[n[1]] || c.none;
            return l[r] ? l[r][i] : o.Linear.easeNone;
          },
        },
        {
          key: 'parseValueType',
          value: function (e) {
            var t = void 0,
              n = void 0;
            return (
              Array.isArray(e)
                ? ((t = 'a'), (n = e.length))
                : e.isQuaternion
                  ? ((t = 'q'), (n = 4))
                  : e.isVector3
                    ? ((t = 'v3'), (n = 3))
                    : e.isVector4
                      ? ((t = 'v4'), (n = 4))
                      : e.isEuler
                        ? ((t = 'r'), (n = 3))
                        : e.isVector2
                          ? ((t = 'v2'), (n = 2))
                          : e.isColor
                            ? ((t = 'c'), (n = 3))
                            : e.isTexture
                              ? ((t = 't'), (n = 1))
                              : 'string' == typeof e
                                ? ((t = 'str'), (n = 1))
                                : 'boolean' == typeof e
                                  ? ((t = 'b'), (n = 1))
                                  : ((t = 'f'), (n = 1)),
              { valueType: t, valueLength: n }
            );
          },
        },
        {
          key: 'parsePath',
          value: function (e, t) {
            var n = t.split('.'),
              r = void 0,
              i = void 0;
            if (
              (e && e.isObject3D ? (i = r = e.getObjectByName(n[0])) : (r = e),
              !r)
            )
              return null;
            for (var o = n.length - 1, a = 1; a < o; a++)
              if (!(r = r[n[a]])) return null;
            return { target: r, object: i, prop: n[o] };
          },
        },
        {
          key: 'parseData',
          value: function (e, t) {
            for (var n = e.length / t, r = new Array(n), i = 0; i < n; i++)
              r[i] = Array.from(e.slice(t * i, t * (i + 1))).map(function (e) {
                return parseFloat(e.toFixed(4));
              });
            return r;
          },
        },
        {
          key: 'check',
          value: function (e, t) {
            if ((e.length / t) % 1 != 0)
              throw new Error('item size incorrect:' + t + '==>' + e);
          },
        },
        {
          key: 'initializeArray',
          value: function (e, t, n) {
            t[n + '_frame'] !== e &&
              ((t[n + '_frame'] = e),
              t[n].forEach(function (e, r) {
                t[n][r] = 0;
              }));
          },
        },
        {
          key: 'initializeFloat',
          value: function (e, t, n) {
            t[n + '_frame'] !== e && ((t[n + '_frame'] = e), (t[n] = 0));
          },
        },
        {
          key: 'initializeColor',
          value: function (e, t, n) {
            t[n + '_frame'] !== e &&
              ((t[n + '_frame'] = e), t[n].setRGB(0, 0, 0));
          },
        },
        {
          key: 'initializeVector',
          value: function (e, t, n) {
            t[n + '_frame'] !== e &&
              ((t[n + '_frame'] = e), t[n].set(0, 0, 0, 0));
          },
        },
        {
          key: 'initializeQuaternion',
          value: function (e, t, n) {
            t[n + '_frame'] !== e &&
              ((t[n + '_frame'] = e), t[n].set(0, 0, 0, 1));
          },
        },
      ]),
      e
    );
  })();
((matrixMatch = ['position', 'scale', 'quaternion', 'rotation']),
  (defaultExport = f));
export { matrixMatch, defaultExport as default };
