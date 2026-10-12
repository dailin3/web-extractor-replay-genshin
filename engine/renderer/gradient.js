// Extracted rendering module: gradient. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
export const __esModule = true;
let createGradient, createGradientTexture;
('use strict');
(void 0,
  (createGradient = s),
  (createGradientTexture = function (e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 16,
      n = new r.DataTexture(
        s(e, t),
        t,
        1,
        r.RGBAFormat,
        r.UnsignedByteType,
        r.DEFAULT_MAPPING,
        e.wrap,
        r.ClampToEdgeWrapping,
        r.LinearFilter,
        r.LinearFilter,
      );
    return ((n.needsUpdate = !0), n);
  }));
var r = dependency_three;
function i(e, t) {
  if (!(e instanceof t))
    throw new TypeError('Cannot call a class as a function');
}
var o = function e(t, n) {
    i(this, e);
    var r = t || {},
      o = r.value,
      a = void 0 === o ? 100 : o,
      s = r.percent,
      l = void 0 === s ? 0 : s;
    ((this.value = Math.round(2.55 * a)), (this.percent = (l / 100) * n));
  },
  a = function e(t, n) {
    i(this, e);
    var r = t || {},
      o = r.value,
      a = void 0 === o ? 16777215 : o,
      s = r.percent,
      l = void 0 === s ? 0 : s;
    ((this.r = (a >> 16) & 255),
      (this.g = (a >> 8) & 255),
      (this.b = 255 & a),
      (this.percent = (l / 100) * n));
  };
function s(e, t) {
  var n = e.color,
    r = void 0 === n ? [] : n,
    i = e.alpha,
    s = void 0 === i ? [] : i,
    l = t - 1;
  ((r = r.map(function (e) {
    return new a(e, l);
  })),
    (s = s.map(function (e) {
      return new o(e, l);
    })));
  var c = new Uint8Array(4 * t),
    u = r[0].percent,
    f = 0,
    d = 0,
    h = 0,
    p = 0,
    m = 0,
    v = 0,
    g = 0;
  return (
    r.forEach(function (e, n) {
      var i = e.r,
        o = e.g,
        a = e.b;
      if (0 === n)
        for (; f <= u;)
          ((c[4 * f] = i), (c[4 * f + 1] = o), (c[4 * f + 2] = a), f++);
      else if (n < r.length)
        for (; f <= u;) {
          var s = (u - f) / g;
          ((c[4 * f] = i + s * h),
            (c[4 * f + 1] = o + s * p),
            (c[4 * f + 2] = a + s * m),
            f++);
        }
      if (n === r.length - 1)
        for (; f < t;)
          ((c[4 * f] = i), (c[4 * f + 1] = o), (c[4 * f + 2] = a), f++);
      else {
        var l = r[n + 1],
          v = l.r,
          y = l.g,
          A = l.b,
          b = l.percent;
        ((d = u), (h = i - v), (p = o - y), (m = a - A), (g = (u = b) - d));
      }
    }),
    (u = s[0].percent),
    (f = 0),
    s.forEach(function (e, n) {
      var r = e.value;
      if (0 === n) for (; f < u;) ((c[4 * f + 3] = r), f++);
      else if (n < s.length)
        for (; f <= u;) {
          var i = (u - f) / g;
          ((c[4 * f + 3] = r + i * v), f++);
        }
      if (n === s.length - 1) for (; f < t;) ((c[4 * f + 3] = r), f++);
      else {
        var o = s[n + 1],
          a = o.value,
          l = o.percent;
        ((d = u), (v = r - a), (g = (u = l) - d));
      }
    }),
    c
  );
}
export { createGradient, createGradientTexture };
