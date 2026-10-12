// Extracted rendering module: spine-runtime. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_motion_utils from './motion-utils.js';
import * as dependency_spine_utils from './spine-utils.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r,
  i =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n)
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
      }
      return e;
    },
  o = function (e, t) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e))
      return (function (e, t) {
        var n = [],
          r = !0,
          i = !1,
          o = void 0;
        try {
          for (
            var a, s = e[Symbol.iterator]();
            !(r = (a = s.next()).done) &&
            (n.push(a.value), !t || n.length !== t);
            r = !0
          );
        } catch (e) {
          ((i = !0), (o = e));
        } finally {
          try {
            !r && s.return && s.return();
          } finally {
            if (i) throw o;
          }
        }
        return n;
      })(e, t);
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
  },
  a = (function () {
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
  s = dependency_three,
  l = (r = dependency_motion_utils) && r.__esModule ? r : { default: r },
  c = dependency_spine_utils;
function u(e, t) {
  if (!e)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
}
function f(e, t) {
  if ('function' != typeof t && null !== t)
    throw new TypeError(
      'Super expression must either be null or a function, not ' + typeof t,
    );
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
  })),
    t &&
      (Object.setPrototypeOf
        ? Object.setPrototypeOf(e, t)
        : (e.__proto__ = t)));
}
function d(e, t) {
  if (!(e instanceof t))
    throw new TypeError('Cannot call a class as a function');
}
var h = (function () {
    function e() {
      (d(this, e), (this.array = new Array()));
    }
    return (
      a(e, [
        {
          key: 'add',
          value: function (e) {
            var t = this.contains(e);
            return ((this.array[0 | e] = 0 | e), !t);
          },
        },
        {
          key: 'contains',
          value: function (e) {
            return null != this.array[0 | e];
          },
        },
        {
          key: 'remove',
          value: function (e) {
            this.array[0 | e] = void 0;
          },
        },
        {
          key: 'clear',
          value: function () {
            this.array.length = 0;
          },
        },
      ]),
      e
    );
  })(),
  p = (function () {
    function e() {
      (d(this, e), (this.entries = {}), (this.size = 0));
    }
    return (
      a(e, [
        {
          key: 'add',
          value: function (e) {
            var t = this.entries[e];
            return ((this.entries[e] = !0), !t && (this.size++, !0));
          },
        },
        {
          key: 'addAll',
          value: function (e) {
            for (var t = this.size, n = 0, r = e.length; n < r; n++)
              this.add(e[n]);
            return t != this.size;
          },
        },
        {
          key: 'contains',
          value: function (e) {
            return this.entries[e];
          },
        },
        {
          key: 'clear',
          value: function () {
            ((this.entries = {}), (this.size = 0));
          },
        },
      ]),
      e
    );
  })(),
  m = (function () {
    function e() {
      var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
        r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
        i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
      (d(this, e), (this.r = t), (this.g = n), (this.b = r), (this.a = i));
    }
    return (
      a(
        e,
        [
          {
            key: 'set',
            value: function (e, t, n, r) {
              return (
                (this.r = e),
                (this.g = t),
                (this.b = n),
                (this.a = r),
                this.clamp()
              );
            },
          },
          {
            key: 'setFromColor',
            value: function (e) {
              return (
                (this.r = e.r),
                (this.g = e.g),
                (this.b = e.b),
                (this.a = e.a),
                this
              );
            },
          },
          {
            key: 'setFromString',
            value: function (e) {
              return (
                (e = '#' == e.charAt(0) ? e.substr(1) : e),
                (this.r = parseInt(e.substr(0, 2), 16) / 255),
                (this.g = parseInt(e.substr(2, 2), 16) / 255),
                (this.b = parseInt(e.substr(4, 2), 16) / 255),
                (this.a =
                  8 != e.length ? 1 : parseInt(e.substr(6, 2), 16) / 255),
                this
              );
            },
          },
          {
            key: 'add',
            value: function (e, t, n, r) {
              return (
                (this.r += e),
                (this.g += t),
                (this.b += n),
                (this.a += r),
                this.clamp()
              );
            },
          },
          {
            key: 'clamp',
            value: function () {
              return (
                this.r < 0 ? (this.r = 0) : this.r > 1 && (this.r = 1),
                this.g < 0 ? (this.g = 0) : this.g > 1 && (this.g = 1),
                this.b < 0 ? (this.b = 0) : this.b > 1 && (this.b = 1),
                this.a < 0 ? (this.a = 0) : this.a > 1 && (this.a = 1),
                this
              );
            },
          },
        ],
        [
          {
            key: 'rgba8888ToColor',
            value: function (e, t) {
              ((e.r = ((4278190080 & t) >>> 24) / 255),
                (e.g = ((16711680 & t) >>> 16) / 255),
                (e.b = ((65280 & t) >>> 8) / 255),
                (e.a = (255 & t) / 255));
            },
          },
          {
            key: 'rgb888ToColor',
            value: function (e, t) {
              ((e.r = ((16711680 & t) >>> 16) / 255),
                (e.g = ((65280 & t) >>> 8) / 255),
                (e.b = (255 & t) / 255));
            },
          },
          {
            key: 'fromString',
            value: function (t) {
              return new e().setFromString(t);
            },
          },
        ],
      ),
      e
    );
  })();
((m.WHITE = new m(1, 1, 1, 1)),
  (m.RED = new m(1, 0, 0, 1)),
  (m.GREEN = new m(0, 1, 0, 1)),
  (m.BLUE = new m(0, 0, 1, 1)),
  (m.MAGENTA = new m(1, 0, 1, 1)));
var v = (function () {
  function e() {
    d(this, e);
  }
  return (
    a(e, null, [
      {
        key: 'clamp',
        value: function (e, t, n) {
          return e < t ? t : e > n ? n : e;
        },
      },
      {
        key: 'cosDeg',
        value: function (t) {
          return Math.cos(t * e.degRad);
        },
      },
      {
        key: 'sinDeg',
        value: function (t) {
          return Math.sin(t * e.degRad);
        },
      },
      {
        key: 'atan2Deg',
        value: function (t, n) {
          return Math.atan2(t, n) * e.degRad;
        },
      },
      {
        key: 'signum',
        value: function (e) {
          return e > 0 ? 1 : e < 0 ? -1 : 0;
        },
      },
      {
        key: 'toInt',
        value: function (e) {
          return e > 0 ? Math.floor(e) : Math.ceil(e);
        },
      },
      {
        key: 'cbrt',
        value: function (e) {
          var t = Math.pow(Math.abs(e), 1 / 3);
          return e < 0 ? -t : t;
        },
      },
      {
        key: 'randomTriangular',
        value: function (t, n) {
          return e.randomTriangularWith(t, n, 0.5 * (t + n));
        },
      },
      {
        key: 'randomTriangularWith',
        value: function (e, t, n) {
          var r = Math.random(),
            i = t - e;
          return r <= (n - e) / i
            ? e + Math.sqrt(r * i * (n - e))
            : t - Math.sqrt((1 - r) * i * (t - n));
        },
      },
      {
        key: 'isPowerOfTwo',
        value: function (e) {
          return e && !(e & (e - 1));
        },
      },
    ]),
    e
  );
})();
((v.PI = 3.1415927),
  (v.PI2 = 2 * v.PI),
  (v.invPI2 = 1 / v.PI2),
  (v.radiansToDegrees = 180 / v.PI),
  (v.radDeg = v.radiansToDegrees),
  (v.degreesToRadians = v.PI / 180),
  (v.degRad = v.degreesToRadians));
var g = (function () {
    function e() {
      d(this, e);
    }
    return (
      a(e, [
        {
          key: 'apply',
          value: function (e, t, n) {
            return e + (t - e) * this.applyInternal(n);
          },
        },
      ]),
      e
    );
  })(),
  y = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
      return ((n.power = 2), (n.power = e), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'applyInternal',
          value: function (e) {
            return e <= 0.5
              ? Math.pow(2 * e, this.power) / 2
              : Math.pow(2 * (e - 1), this.power) /
                  (this.power % 2 == 0 ? -2 : 2) +
                  1;
          },
        },
      ]),
      t
    );
  })(g),
  A = (function (e) {
    function t(e) {
      return (
        d(this, t),
        u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'applyInternal',
          value: function (e) {
            return (
              Math.pow(e - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1
            );
          },
        },
      ]),
      t
    );
  })(y),
  b = (function () {
    function e() {
      d(this, e);
    }
    return (
      a(e, null, [
        {
          key: 'arrayCopy',
          value: function (e, t, n, r, i) {
            for (var o = t, a = r; o < t + i; o++, a++) n[a] = e[o];
          },
        },
        {
          key: 'arrayFill',
          value: function (e, t, n, r) {
            for (var i = t; i < n; i++) e[i] = r;
          },
        },
        {
          key: 'setArraySize',
          value: function (e, t) {
            var n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : 0,
              r = e.length;
            if (r == t) return e;
            if (((e.length = t), r < t)) for (var i = r; i < t; i++) e[i] = n;
            return e;
          },
        },
        {
          key: 'ensureArrayCapacity',
          value: function (t, n) {
            var r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 0;
            return t.length >= n ? t : e.setArraySize(t, n, r);
          },
        },
        {
          key: 'newArray',
          value: function (e, t) {
            for (var n = new Array(e), r = 0; r < e; r++) n[r] = t;
            return n;
          },
        },
        {
          key: 'newFloatArray',
          value: function (t) {
            if (e.SUPPORTS_TYPED_ARRAYS) return new Float32Array(t);
            for (var n = new Array(t), r = 0; r < n.length; r++) n[r] = 0;
            return n;
          },
        },
        {
          key: 'newShortArray',
          value: function (t) {
            if (e.SUPPORTS_TYPED_ARRAYS) return new Int16Array(t);
            for (var n = new Array(t), r = 0; r < n.length; r++) n[r] = 0;
            return n;
          },
        },
        {
          key: 'toFloatArray',
          value: function (t) {
            return e.SUPPORTS_TYPED_ARRAYS ? new Float32Array(t) : t;
          },
        },
        {
          key: 'toSinglePrecision',
          value: function (t) {
            return e.SUPPORTS_TYPED_ARRAYS ? Math.fround(t) : t;
          },
        },
        { key: 'webkit602BugfixHelper', value: function (e, t) {} },
        {
          key: 'contains',
          value: function (e, t) {
            for (var n = 0; n < e.length; n++) if (e[n] == t) return !0;
            return !1;
          },
        },
        {
          key: 'enumValue',
          value: function (e, t) {
            return e[t[0].toUpperCase() + t.slice(1)];
          },
        },
      ]),
      e
    );
  })();
b.SUPPORTS_TYPED_ARRAYS = 'undefined' != typeof Float32Array;
var w = (function () {
    function e() {
      d(this, e);
    }
    return (
      a(e, null, [
        {
          key: 'logBones',
          value: function (e) {
            for (var t = 0; t < e.bones.length; t++) {
              var n = e.bones[t];
              console.log(
                n.data.name +
                  ', ' +
                  n.a +
                  ', ' +
                  n.b +
                  ', ' +
                  n.c +
                  ', ' +
                  n.d +
                  ', ' +
                  n.worldX +
                  ', ' +
                  n.worldY,
              );
            }
          },
        },
      ]),
      e
    );
  })(),
  _ = (function () {
    function e(t) {
      (d(this, e), (this.items = new Array()), (this.instantiator = t));
    }
    return (
      a(e, [
        {
          key: 'obtain',
          value: function () {
            return this.items.length > 0
              ? this.items.pop()
              : this.instantiator();
          },
        },
        {
          key: 'free',
          value: function (e) {
            (e.reset && e.reset(), this.items.push(e));
          },
        },
        {
          key: 'freeAll',
          value: function (e) {
            for (var t = 0; t < e.length; t++) this.free(e[t]);
          },
        },
        {
          key: 'clear',
          value: function () {
            this.items.length = 0;
          },
        },
      ]),
      e
    );
  })(),
  x = (function () {
    function e() {
      var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
      (d(this, e), (this.x = t), (this.y = n));
    }
    return (
      a(e, [
        {
          key: 'set',
          value: function (e, t) {
            return ((this.x = e), (this.y = t), this);
          },
        },
        {
          key: 'length',
          value: function () {
            var e = this.x,
              t = this.y;
            return Math.sqrt(e * e + t * t);
          },
        },
        {
          key: 'normalize',
          value: function () {
            var e = this.length();
            return (0 != e && ((this.x /= e), (this.y /= e)), this);
          },
        },
      ]),
      e
    );
  })(),
  k = (function () {
    function e() {
      (d(this, e),
        (this.maxDelta = 0.064),
        (this.framesPerSecond = 0),
        (this.delta = 0),
        (this.totalTime = 0),
        (this.lastTime = Date.now() / 1e3),
        (this.frameCount = 0),
        (this.frameTime = 0));
    }
    return (
      a(e, [
        {
          key: 'update',
          value: function () {
            var e = Date.now() / 1e3;
            ((this.delta = e - this.lastTime),
              (this.frameTime += this.delta),
              (this.totalTime += this.delta),
              this.delta > this.maxDelta && (this.delta = this.maxDelta),
              (this.lastTime = e),
              this.frameCount++,
              this.frameTime > 1 &&
                ((this.framesPerSecond = this.frameCount / this.frameTime),
                (this.frameTime = 0),
                (this.frameCount = 0)));
          },
        },
      ]),
      e
    );
  })(),
  S = (function () {
    function e() {
      var t =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 32;
      (d(this, e),
        (this.addedValues = 0),
        (this.lastValue = 0),
        (this.mean = 0),
        (this.dirty = !0),
        (this.values = new Array(t)));
    }
    return (
      a(e, [
        {
          key: 'hasEnoughData',
          value: function () {
            return this.addedValues >= this.values.length;
          },
        },
        {
          key: 'addValue',
          value: function (e) {
            (this.addedValues < this.values.length && this.addedValues++,
              (this.values[this.lastValue++] = e),
              this.lastValue > this.values.length - 1 && (this.lastValue = 0),
              (this.dirty = !0));
          },
        },
        {
          key: 'getMean',
          value: function () {
            if (this.hasEnoughData()) {
              if (this.dirty) {
                for (var e = 0, t = 0; t < this.values.length; t++)
                  e += this.values[t];
                ((this.mean = e / this.values.length), (this.dirty = !1));
              }
              return this.mean;
            }
            return 0;
          },
        },
      ]),
      e
    );
  })(),
  E = function e(t) {
    if ((d(this, e), !t)) throw new Error('name cannot be null.');
    this.name = t;
  },
  C = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (n.id = t.nextID++),
        (n.bones = null),
        (n.vertices = []),
        (n.worldVerticesLength = 0),
        (n.timelineAttachment = n),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'computeWorldVertices',
          value: function (e, t, n, r, i, o) {
            n = i + (n >> 1) * o;
            var a = e.bone.skeleton,
              s = e.deform,
              l = this.vertices,
              c = this.bones;
            if (c) {
              for (var u = 0, f = 0, d = 0; d < t; d += 2) {
                var h = c[u];
                ((u += h + 1), (f += h));
              }
              var p = a.bones;
              if (0 == s.length)
                for (var m = i, v = 3 * f; m < n; m += o) {
                  var g = 0,
                    y = 0,
                    A = c[u++];
                  for (A += u; u < A; u++, v += 3) {
                    var b = p[c[u]],
                      w = l[v],
                      _ = l[v + 1],
                      x = l[v + 2];
                    ((g += (w * b.a + _ * b.b + b.worldX) * x),
                      (y += (w * b.c + _ * b.d + b.worldY) * x));
                  }
                  ((r[m] = g), (r[m + 1] = y));
                }
              else
                for (var k = s, S = i, E = 3 * f, C = f << 1; S < n; S += o) {
                  var T = 0,
                    I = 0,
                    M = c[u++];
                  for (M += u; u < M; u++, E += 3, C += 2) {
                    var O = p[c[u]],
                      B = l[E] + k[C],
                      P = l[E + 1] + k[C + 1],
                      L = l[E + 2];
                    ((T += (B * O.a + P * O.b + O.worldX) * L),
                      (I += (B * O.c + P * O.d + O.worldY) * L));
                  }
                  ((r[S] = T), (r[S + 1] = I));
                }
            } else {
              s.length > 0 && (l = s);
              for (
                var R = e.bone,
                  D = R.worldX,
                  F = R.worldY,
                  j = R.a,
                  N = R.b,
                  z = R.c,
                  U = R.d,
                  G = t,
                  H = i;
                H < n;
                G += 2, H += o
              ) {
                var Q = l[G],
                  V = l[G + 1];
                ((r[H] = Q * j + V * N + D), (r[H + 1] = Q * z + V * U + F));
              }
            }
          },
        },
        {
          key: 'copyTo',
          value: function (e) {
            (this.bones
              ? ((e.bones = new Array(this.bones.length)),
                b.arrayCopy(this.bones, 0, e.bones, 0, this.bones.length))
              : (e.bones = null),
              this.vertices &&
                ((e.vertices = b.newFloatArray(this.vertices.length)),
                b.arrayCopy(
                  this.vertices,
                  0,
                  e.vertices,
                  0,
                  this.vertices.length,
                )),
              (e.worldVerticesLength = this.worldVerticesLength),
              (e.timelineAttachment = this.timelineAttachment));
          },
        },
      ]),
      t
    );
  })(E);
C.nextID = 0;
var T = (function () {
  function e(t) {
    (d(this, e),
      (this.id = e.nextID()),
      (this.start = 0),
      (this.digits = 0),
      (this.setupIndex = 0),
      (this.regions = new Array(t)));
  }
  return (
    a(
      e,
      [
        {
          key: 'copy',
          value: function () {
            var t = new e(this.regions.length);
            return (
              b.arrayCopy(this.regions, 0, t.regions, 0, this.regions.length),
              (t.start = this.start),
              (t.digits = this.digits),
              (t.setupIndex = this.setupIndex),
              t
            );
          },
        },
        {
          key: 'apply',
          value: function (e, t) {
            var n = e.sequenceIndex;
            (-1 == n && (n = this.setupIndex),
              n >= this.regions.length && (n = this.regions.length - 1));
            var r = this.regions[n];
            t.region != r && ((t.region = r), t.updateRegion());
          },
        },
        {
          key: 'getPath',
          value: function (e, t) {
            for (
              var n = e,
                r = (this.start + t).toString(),
                i = this.digits - r.length;
              i > 0;
              i--
            )
              n += '0';
            return n + r;
          },
        },
      ],
      [
        {
          key: 'nextID',
          value: function () {
            return e._nextID++;
          },
        },
      ],
    ),
    e
  );
})();
T._nextID = 0;
var I = void 0;
!(function (e) {
  ((e[(e.hold = 0)] = 'hold'),
    (e[(e.once = 1)] = 'once'),
    (e[(e.loop = 2)] = 'loop'),
    (e[(e.pingpong = 3)] = 'pingpong'),
    (e[(e.onceReverse = 4)] = 'onceReverse'),
    (e[(e.loopReverse = 5)] = 'loopReverse'),
    (e[(e.pingpongReverse = 6)] = 'pingpongReverse'));
})(I || (I = {}));
var M = [
    I.hold,
    I.once,
    I.loop,
    I.pingpong,
    I.onceReverse,
    I.loopReverse,
    I.pingpongReverse,
  ],
  O = (function () {
    function e(t, n, r) {
      if ((d(this, e), (this.timelines = []), (this.timelineIds = new p()), !t))
        throw new Error('name cannot be null.');
      ((this.name = t), this.setTimelines(n), (this.duration = r));
    }
    return (
      a(e, [
        {
          key: 'setTimelines',
          value: function (e) {
            if (!e) throw new Error('timelines cannot be null.');
            ((this.timelines = e), this.timelineIds.clear());
            for (var t = 0; t < e.length; t++)
              this.timelineIds.addAll(e[t].getPropertyIds());
          },
        },
        {
          key: 'hasTimeline',
          value: function (e) {
            for (var t = 0; t < e.length; t++)
              if (this.timelineIds.contains(e[t])) return !0;
            return !1;
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a, s) {
            if (!e) throw new Error('skeleton cannot be null.');
            r &&
              0 != this.duration &&
              ((n %= this.duration), t > 0 && (t %= this.duration));
            for (var l = this.timelines, c = 0, u = l.length; c < u; c++)
              l[c].apply(e, t, n, i, o, a, s);
          },
        },
      ]),
      e
    );
  })(),
  B = void 0;
!(function (e) {
  ((e[(e.setup = 0)] = 'setup'),
    (e[(e.first = 1)] = 'first'),
    (e[(e.replace = 2)] = 'replace'),
    (e[(e.add = 3)] = 'add'));
})(B || (B = {}));
var P = void 0;
!(function (e) {
  ((e[(e.mixIn = 0)] = 'mixIn'), (e[(e.mixOut = 1)] = 'mixOut'));
})(P || (P = {}));
var L = {
    rotate: 0,
    x: 1,
    y: 2,
    scaleX: 3,
    scaleY: 4,
    shearX: 5,
    shearY: 6,
    inherit: 7,
    rgb: 8,
    alpha: 9,
    rgb2: 10,
    attachment: 11,
    deform: 12,
    event: 13,
    drawOrder: 14,
    ikConstraint: 15,
    transformConstraint: 16,
    pathConstraintPosition: 17,
    pathConstraintSpacing: 18,
    pathConstraintMix: 19,
    physicsConstraintInertia: 20,
    physicsConstraintStrength: 21,
    physicsConstraintDamping: 22,
    physicsConstraintMass: 23,
    physicsConstraintWind: 24,
    physicsConstraintGravity: 25,
    physicsConstraintMix: 26,
    physicsConstraintReset: 27,
    sequence: 28,
  },
  R = (function () {
    function e(t, n) {
      (d(this, e),
        (this.propertyIds = n),
        (this.frames = b.newFloatArray(t * this.getFrameEntries())));
    }
    return (
      a(
        e,
        [
          {
            key: 'getPropertyIds',
            value: function () {
              return this.propertyIds;
            },
          },
          {
            key: 'getFrameEntries',
            value: function () {
              return 1;
            },
          },
          {
            key: 'getFrameCount',
            value: function () {
              return this.frames.length / this.getFrameEntries();
            },
          },
          {
            key: 'getDuration',
            value: function () {
              return this.frames[this.frames.length - this.getFrameEntries()];
            },
          },
        ],
        [
          {
            key: 'search1',
            value: function (e, t) {
              for (var n = e.length, r = 1; r < n; r++)
                if (e[r] > t) return r - 1;
              return n - 1;
            },
          },
          {
            key: 'search',
            value: function (e, t, n) {
              for (var r = e.length, i = n; i < r; i += n)
                if (e[i] > t) return i - n;
              return r - n;
            },
          },
        ],
      ),
      e
    );
  })(),
  D = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r),
      );
      return (
        (i.curves = b.newFloatArray(e + 18 * n)),
        (i.curves[e - 1] = 1),
        i
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setLinear',
          value: function (e) {
            this.curves[e] = 0;
          },
        },
        {
          key: 'setStepped',
          value: function (e) {
            this.curves[e] = 1;
          },
        },
        {
          key: 'shrink',
          value: function (e) {
            var t = this.getFrameCount() + 18 * e;
            if (this.curves.length > t) {
              var n = b.newFloatArray(t);
              (b.arrayCopy(this.curves, 0, n, 0, t), (this.curves = n));
            }
          },
        },
        {
          key: 'setBezier',
          value: function (e, t, n, r, i, o, a, s, l, c, u) {
            var f = this.curves,
              d = this.getFrameCount() + 18 * e;
            0 == n && (f[t] = 2 + d);
            for (
              var h = 0.03 * (r - 2 * o + s),
                p = 0.03 * (i - 2 * a + l),
                m = 0.006 * (3 * (o - s) - r + c),
                v = 0.006 * (3 * (a - l) - i + u),
                g = 2 * h + m,
                y = 2 * p + v,
                A = 0.3 * (o - r) + h + 0.16666667 * m,
                b = 0.3 * (a - i) + p + 0.16666667 * v,
                w = r + A,
                _ = i + b,
                x = d + 18;
              d < x;
              d += 2
            )
              ((f[d] = w),
                (f[d + 1] = _),
                (A += g),
                (b += y),
                (g += m),
                (y += v),
                (w += A),
                (_ += b));
          },
        },
        {
          key: 'getBezierValue',
          value: function (e, t, n, r) {
            var i = this.curves;
            if (i[r] > e) {
              var o = this.frames[t],
                a = this.frames[t + n];
              return a + ((e - o) / (i[r] - o)) * (i[r + 1] - a);
            }
            var s = r + 18;
            for (r += 2; r < s; r += 2)
              if (i[r] >= e) {
                var l = i[r - 2],
                  c = i[r - 1];
                return c + ((e - l) / (i[r] - l)) * (i[r + 1] - c);
              }
            t += this.getFrameEntries();
            var u = i[s - 2],
              f = i[s - 1];
            return (
              f + ((e - u) / (this.frames[t] - u)) * (this.frames[t + n] - f)
            );
          },
        },
      ]),
      t
    );
  })(R),
  F = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [r]))
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 2;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n) {
            ((e <<= 1), (this.frames[e] = t), (this.frames[e + 1] = n));
          },
        },
        {
          key: 'getCurveValue',
          value: function (e) {
            for (var t = this.frames, n = t.length - 2, r = 2; r <= n; r += 2)
              if (t[r] > e) {
                n = r - 2;
                break;
              }
            var i = this.curves[n >> 1];
            switch (i) {
              case 0:
                var o = t[n],
                  a = t[n + 1];
                return a + ((e - o) / (t[n + 2] - o)) * (t[n + 2 + 1] - a);
              case 1:
                return t[n + 1];
            }
            return this.getBezierValue(e, n, 1, i - 2);
          },
        },
        {
          key: 'getRelativeValue',
          value: function (e, t, n, r, i) {
            if (e < this.frames[0]) {
              switch (n) {
                case B.setup:
                  return i;
                case B.first:
                  return r + (i - r) * t;
              }
              return r;
            }
            var o = this.getCurveValue(e);
            switch (n) {
              case B.setup:
                return i + o * t;
              case B.first:
              case B.replace:
                o += i - r;
            }
            return r + o * t;
          },
        },
        {
          key: 'getAbsoluteValue',
          value: function (e, t, n, r, i) {
            if (e < this.frames[0]) {
              switch (n) {
                case B.setup:
                  return i;
                case B.first:
                  return r + (i - r) * t;
              }
              return r;
            }
            var o = this.getCurveValue(e);
            return n == B.setup ? i + (o - i) * t : r + (o - r) * t;
          },
        },
        {
          key: 'getAbsoluteValue2',
          value: function (e, t, n, r, i, o) {
            if (e < this.frames[0]) {
              switch (n) {
                case B.setup:
                  return i;
                case B.first:
                  return r + (i - r) * t;
              }
              return r;
            }
            return n == B.setup ? i + (o - i) * t : r + (o - r) * t;
          },
        },
        {
          key: 'getScaleValue',
          value: function (e, t, n, r, i, o) {
            if (e < this.frames[0]) {
              switch (n) {
                case B.setup:
                  return o;
                case B.first:
                  return i + (o - i) * t;
              }
              return i;
            }
            var a = this.getCurveValue(e) * o;
            if (1 == t) return n == B.add ? i + a - o : a;
            if (r == P.mixOut)
              switch (n) {
                case B.setup:
                  return o + (Math.abs(a) * v.signum(o) - o) * t;
                case B.first:
                case B.replace:
                  return i + (Math.abs(a) * v.signum(i) - i) * t;
              }
            else {
              var s = 0;
              switch (n) {
                case B.setup:
                  return (s = Math.abs(o) * v.signum(a)) + (a - s) * t;
                case B.first:
                case B.replace:
                  return (s = Math.abs(i) * v.signum(a)) + (a - s) * t;
              }
            }
            return i + (a - o) * t;
          },
        },
      ]),
      t
    );
  })(D),
  j = (function (e) {
    function t(e, n, r, i) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [r, i]),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 3;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r) {
            ((e *= 3),
              (this.frames[e] = t),
              (this.frames[e + 1] = n),
              (this.frames[e + 2] = r));
          },
        },
      ]),
      t
    );
  })(D),
  N = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.rotate + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            s.active &&
              (s.rotation = this.getRelativeValue(
                n,
                i,
                o,
                s.rotation,
                s.data.rotation,
              ));
          },
        },
      ]),
      t
    );
  })(F),
  z = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.x + '|' + r,
          L.y + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            if (s.active) {
              var l = this.frames;
              if (n < l[0])
                switch (o) {
                  case B.setup:
                    return ((s.x = s.data.x), void (s.y = s.data.y));
                  case B.first:
                    ((s.x += (s.data.x - s.x) * i),
                      (s.y += (s.data.y - s.y) * i));
                }
              else {
                var c = 0,
                  u = 0,
                  f = R.search(l, n, 3),
                  d = this.curves[f / 3];
                switch (d) {
                  case 0:
                    var h = l[f];
                    ((c = l[f + 1]), (u = l[f + 2]));
                    var p = (n - h) / (l[f + 3] - h);
                    ((c += (l[f + 3 + 1] - c) * p),
                      (u += (l[f + 3 + 2] - u) * p));
                    break;
                  case 1:
                    ((c = l[f + 1]), (u = l[f + 2]));
                    break;
                  default:
                    ((c = this.getBezierValue(n, f, 1, d - 2)),
                      (u = this.getBezierValue(n, f, 2, d + 18 - 2)));
                }
                switch (o) {
                  case B.setup:
                    ((s.x = s.data.x + c * i), (s.y = s.data.y + u * i));
                    break;
                  case B.first:
                  case B.replace:
                    ((s.x += (s.data.x + c - s.x) * i),
                      (s.y += (s.data.y + u - s.y) * i));
                    break;
                  case B.add:
                    ((s.x += c * i), (s.y += u * i));
                }
              }
            }
          },
        },
      ]),
      t
    );
  })(j),
  U = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.x + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            s.active && (s.x = this.getRelativeValue(n, i, o, s.x, s.data.x));
          },
        },
      ]),
      t
    );
  })(F),
  G = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.y + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            s.active && (s.y = this.getRelativeValue(n, i, o, s.y, s.data.y));
          },
        },
      ]),
      t
    );
  })(F),
  H = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.scaleX + '|' + r,
          L.scaleY + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            if (s.active) {
              var l = this.frames;
              if (n < l[0])
                switch (o) {
                  case B.setup:
                    return (
                      (s.scaleX = s.data.scaleX),
                      void (s.scaleY = s.data.scaleY)
                    );
                  case B.first:
                    ((s.scaleX += (s.data.scaleX - s.scaleX) * i),
                      (s.scaleY += (s.data.scaleY - s.scaleY) * i));
                }
              else {
                var c = void 0,
                  u = void 0,
                  f = R.search(l, n, 3),
                  d = this.curves[f / 3];
                switch (d) {
                  case 0:
                    var h = l[f];
                    ((c = l[f + 1]), (u = l[f + 2]));
                    var p = (n - h) / (l[f + 3] - h);
                    ((c += (l[f + 3 + 1] - c) * p),
                      (u += (l[f + 3 + 2] - u) * p));
                    break;
                  case 1:
                    ((c = l[f + 1]), (u = l[f + 2]));
                    break;
                  default:
                    ((c = this.getBezierValue(n, f, 1, d - 2)),
                      (u = this.getBezierValue(n, f, 2, d + 18 - 2)));
                }
                if (((c *= s.data.scaleX), (u *= s.data.scaleY), 1 == i))
                  o == B.add
                    ? ((s.scaleX += c - s.data.scaleX),
                      (s.scaleY += u - s.data.scaleY))
                    : ((s.scaleX = c), (s.scaleY = u));
                else {
                  var m = 0,
                    g = 0;
                  if (a == P.mixOut)
                    switch (o) {
                      case B.setup:
                        ((m = s.data.scaleX),
                          (g = s.data.scaleY),
                          (s.scaleX = m + (Math.abs(c) * v.signum(m) - m) * i),
                          (s.scaleY = g + (Math.abs(u) * v.signum(g) - g) * i));
                        break;
                      case B.first:
                      case B.replace:
                        ((m = s.scaleX),
                          (g = s.scaleY),
                          (s.scaleX = m + (Math.abs(c) * v.signum(m) - m) * i),
                          (s.scaleY = g + (Math.abs(u) * v.signum(g) - g) * i));
                        break;
                      case B.add:
                        ((s.scaleX += (c - s.data.scaleX) * i),
                          (s.scaleY += (u - s.data.scaleY) * i));
                    }
                  else
                    switch (o) {
                      case B.setup:
                        ((m = Math.abs(s.data.scaleX) * v.signum(c)),
                          (g = Math.abs(s.data.scaleY) * v.signum(u)),
                          (s.scaleX = m + (c - m) * i),
                          (s.scaleY = g + (u - g) * i));
                        break;
                      case B.first:
                      case B.replace:
                        ((m = Math.abs(s.scaleX) * v.signum(c)),
                          (g = Math.abs(s.scaleY) * v.signum(u)),
                          (s.scaleX = m + (c - m) * i),
                          (s.scaleY = g + (u - g) * i));
                        break;
                      case B.add:
                        ((s.scaleX += (c - s.data.scaleX) * i),
                          (s.scaleY += (u - s.data.scaleY) * i));
                    }
                }
              }
            }
          },
        },
      ]),
      t
    );
  })(j),
  Q = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.scaleX + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            s.active &&
              (s.scaleX = this.getScaleValue(
                n,
                i,
                o,
                a,
                s.scaleX,
                s.data.scaleX,
              ));
          },
        },
      ]),
      t
    );
  })(F),
  V = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.scaleY + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            s.active &&
              (s.scaleY = this.getScaleValue(
                n,
                i,
                o,
                a,
                s.scaleY,
                s.data.scaleY,
              ));
          },
        },
      ]),
      t
    );
  })(F),
  q = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.shearX + '|' + r,
          L.shearY + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            if (s.active) {
              var l = this.frames;
              if (n < l[0])
                switch (o) {
                  case B.setup:
                    return (
                      (s.shearX = s.data.shearX),
                      void (s.shearY = s.data.shearY)
                    );
                  case B.first:
                    ((s.shearX += (s.data.shearX - s.shearX) * i),
                      (s.shearY += (s.data.shearY - s.shearY) * i));
                }
              else {
                var c = 0,
                  u = 0,
                  f = R.search(l, n, 3),
                  d = this.curves[f / 3];
                switch (d) {
                  case 0:
                    var h = l[f];
                    ((c = l[f + 1]), (u = l[f + 2]));
                    var p = (n - h) / (l[f + 3] - h);
                    ((c += (l[f + 3 + 1] - c) * p),
                      (u += (l[f + 3 + 2] - u) * p));
                    break;
                  case 1:
                    ((c = l[f + 1]), (u = l[f + 2]));
                    break;
                  default:
                    ((c = this.getBezierValue(n, f, 1, d - 2)),
                      (u = this.getBezierValue(n, f, 2, d + 18 - 2)));
                }
                switch (o) {
                  case B.setup:
                    ((s.shearX = s.data.shearX + c * i),
                      (s.shearY = s.data.shearY + u * i));
                    break;
                  case B.first:
                  case B.replace:
                    ((s.shearX += (s.data.shearX + c - s.shearX) * i),
                      (s.shearY += (s.data.shearY + u - s.shearY) * i));
                    break;
                  case B.add:
                    ((s.shearX += c * i), (s.shearY += u * i));
                }
              }
            }
          },
        },
      ]),
      t
    );
  })(j),
  W = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.shearX + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            s.active &&
              (s.shearX = this.getRelativeValue(
                n,
                i,
                o,
                s.shearX,
                s.data.shearX,
              ));
          },
        },
      ]),
      t
    );
  })(F),
  Y = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.shearY + '|' + r,
        ),
      );
      return ((i.boneIndex = 0), (i.boneIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            s.active &&
              (s.shearY = this.getRelativeValue(
                n,
                i,
                o,
                s.shearY,
                s.data.shearY,
              ));
          },
        },
      ]),
      t
    );
  })(F),
  X = (function (e) {
    function t(e, n) {
      d(this, t);
      var r = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, [
          L.inherit + '|' + n,
        ]),
      );
      return ((r.boneIndex = 0), (r.boneIndex = n), r);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 2;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n) {
            ((e *= 2), (this.frames[e] = t), (this.frames[e + 1] = n));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.bones[this.boneIndex];
            if (s.active) {
              var l = this.frames;
              n < l[0]
                ? (o != B.setup && o != B.first) || (s.inherit = s.data.inherit)
                : (s.inherit = this.frames[R.search(l, n, 2) + 1]);
            }
          },
        },
      ]),
      t
    );
  })(R),
  J = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.rgb + '|' + r,
          L.alpha + '|' + r,
        ]),
      );
      return ((i.slotIndex = 0), (i.slotIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 5;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r, i, o) {
            ((e *= 5),
              (this.frames[e] = t),
              (this.frames[e + 1] = n),
              (this.frames[e + 2] = r),
              (this.frames[e + 3] = i),
              (this.frames[e + 4] = o));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.slots[this.slotIndex];
            if (s.bone.active) {
              var l = this.frames,
                c = s.color;
              if (n < l[0]) {
                var u = s.data.color;
                switch (o) {
                  case B.setup:
                    return void c.setFromColor(u);
                  case B.first:
                    c.add(
                      (u.r - c.r) * i,
                      (u.g - c.g) * i,
                      (u.b - c.b) * i,
                      (u.a - c.a) * i,
                    );
                }
              } else {
                var f = 0,
                  d = 0,
                  h = 0,
                  p = 0,
                  m = R.search(l, n, 5),
                  v = this.curves[m / 5];
                switch (v) {
                  case 0:
                    var g = l[m];
                    ((f = l[m + 1]),
                      (d = l[m + 2]),
                      (h = l[m + 3]),
                      (p = l[m + 4]));
                    var y = (n - g) / (l[m + 5] - g);
                    ((f += (l[m + 5 + 1] - f) * y),
                      (d += (l[m + 5 + 2] - d) * y),
                      (h += (l[m + 5 + 3] - h) * y),
                      (p += (l[m + 5 + 4] - p) * y));
                    break;
                  case 1:
                    ((f = l[m + 1]),
                      (d = l[m + 2]),
                      (h = l[m + 3]),
                      (p = l[m + 4]));
                    break;
                  default:
                    ((f = this.getBezierValue(n, m, 1, v - 2)),
                      (d = this.getBezierValue(n, m, 2, v + 18 - 2)),
                      (h = this.getBezierValue(n, m, 3, v + 36 - 2)),
                      (p = this.getBezierValue(n, m, 4, v + 54 - 2)));
                }
                1 == i
                  ? c.set(f, d, h, p)
                  : (o == B.setup && c.setFromColor(s.data.color),
                    c.add(
                      (f - c.r) * i,
                      (d - c.g) * i,
                      (h - c.b) * i,
                      (p - c.a) * i,
                    ));
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  K = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.rgb + '|' + r,
        ]),
      );
      return ((i.slotIndex = 0), (i.slotIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 4;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r, i) {
            ((e <<= 2),
              (this.frames[e] = t),
              (this.frames[e + 1] = n),
              (this.frames[e + 2] = r),
              (this.frames[e + 3] = i));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.slots[this.slotIndex];
            if (s.bone.active) {
              var l = this.frames,
                c = s.color;
              if (n < l[0]) {
                var u = s.data.color;
                switch (o) {
                  case B.setup:
                    return ((c.r = u.r), (c.g = u.g), void (c.b = u.b));
                  case B.first:
                    ((c.r += (u.r - c.r) * i),
                      (c.g += (u.g - c.g) * i),
                      (c.b += (u.b - c.b) * i));
                }
              } else {
                var f = 0,
                  d = 0,
                  h = 0,
                  p = R.search(l, n, 4),
                  m = this.curves[p >> 2];
                switch (m) {
                  case 0:
                    var v = l[p];
                    ((f = l[p + 1]), (d = l[p + 2]), (h = l[p + 3]));
                    var g = (n - v) / (l[p + 4] - v);
                    ((f += (l[p + 4 + 1] - f) * g),
                      (d += (l[p + 4 + 2] - d) * g),
                      (h += (l[p + 4 + 3] - h) * g));
                    break;
                  case 1:
                    ((f = l[p + 1]), (d = l[p + 2]), (h = l[p + 3]));
                    break;
                  default:
                    ((f = this.getBezierValue(n, p, 1, m - 2)),
                      (d = this.getBezierValue(n, p, 2, m + 18 - 2)),
                      (h = this.getBezierValue(n, p, 3, m + 36 - 2)));
                }
                if (1 == i) ((c.r = f), (c.g = d), (c.b = h));
                else {
                  if (o == B.setup) {
                    var y = s.data.color;
                    ((c.r = y.r), (c.g = y.g), (c.b = y.b));
                  }
                  ((c.r += (f - c.r) * i),
                    (c.g += (d - c.g) * i),
                    (c.b += (h - c.b) * i));
                }
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  $ = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.alpha + '|' + r,
        ),
      );
      return ((i.slotIndex = 0), (i.slotIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.slots[this.slotIndex];
            if (s.bone.active) {
              var l = s.color;
              if (n < this.frames[0]) {
                var c = s.data.color;
                switch (o) {
                  case B.setup:
                    return void (l.a = c.a);
                  case B.first:
                    l.a += (c.a - l.a) * i;
                }
              } else {
                var u = this.getCurveValue(n);
                1 == i
                  ? (l.a = u)
                  : (o == B.setup && (l.a = s.data.color.a),
                    (l.a += (u - l.a) * i));
              }
            }
          },
        },
      ]),
      t
    );
  })(F),
  Z = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.rgb + '|' + r,
          L.alpha + '|' + r,
          L.rgb2 + '|' + r,
        ]),
      );
      return ((i.slotIndex = 0), (i.slotIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 8;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r, i, o, a, s, l) {
            ((e <<= 3),
              (this.frames[e] = t),
              (this.frames[e + 1] = n),
              (this.frames[e + 2] = r),
              (this.frames[e + 3] = i),
              (this.frames[e + 4] = o),
              (this.frames[e + 5] = a),
              (this.frames[e + 6] = s),
              (this.frames[e + 7] = l));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.slots[this.slotIndex];
            if (s.bone.active) {
              var l = this.frames,
                c = s.color,
                u = s.darkColor;
              if (n < l[0]) {
                var f = s.data.color,
                  d = s.data.darkColor;
                switch (o) {
                  case B.setup:
                    return (
                      c.setFromColor(f),
                      (u.r = d.r),
                      (u.g = d.g),
                      void (u.b = d.b)
                    );
                  case B.first:
                    (c.add(
                      (f.r - c.r) * i,
                      (f.g - c.g) * i,
                      (f.b - c.b) * i,
                      (f.a - c.a) * i,
                    ),
                      (u.r += (d.r - u.r) * i),
                      (u.g += (d.g - u.g) * i),
                      (u.b += (d.b - u.b) * i));
                }
              } else {
                var h = 0,
                  p = 0,
                  m = 0,
                  v = 0,
                  g = 0,
                  y = 0,
                  A = 0,
                  b = R.search(l, n, 8),
                  w = this.curves[b >> 3];
                switch (w) {
                  case 0:
                    var _ = l[b];
                    ((h = l[b + 1]),
                      (p = l[b + 2]),
                      (m = l[b + 3]),
                      (v = l[b + 4]),
                      (g = l[b + 5]),
                      (y = l[b + 6]),
                      (A = l[b + 7]));
                    var x = (n - _) / (l[b + 8] - _);
                    ((h += (l[b + 8 + 1] - h) * x),
                      (p += (l[b + 8 + 2] - p) * x),
                      (m += (l[b + 8 + 3] - m) * x),
                      (v += (l[b + 8 + 4] - v) * x),
                      (g += (l[b + 8 + 5] - g) * x),
                      (y += (l[b + 8 + 6] - y) * x),
                      (A += (l[b + 8 + 7] - A) * x));
                    break;
                  case 1:
                    ((h = l[b + 1]),
                      (p = l[b + 2]),
                      (m = l[b + 3]),
                      (v = l[b + 4]),
                      (g = l[b + 5]),
                      (y = l[b + 6]),
                      (A = l[b + 7]));
                    break;
                  default:
                    ((h = this.getBezierValue(n, b, 1, w - 2)),
                      (p = this.getBezierValue(n, b, 2, w + 18 - 2)),
                      (m = this.getBezierValue(n, b, 3, w + 36 - 2)),
                      (v = this.getBezierValue(n, b, 4, w + 54 - 2)),
                      (g = this.getBezierValue(n, b, 5, w + 72 - 2)),
                      (y = this.getBezierValue(n, b, 6, w + 90 - 2)),
                      (A = this.getBezierValue(n, b, 7, w + 108 - 2)));
                }
                if (1 == i)
                  (c.set(h, p, m, v), (u.r = g), (u.g = y), (u.b = A));
                else {
                  if (o == B.setup) {
                    c.setFromColor(s.data.color);
                    var k = s.data.darkColor;
                    ((u.r = k.r), (u.g = k.g), (u.b = k.b));
                  }
                  (c.add(
                    (h - c.r) * i,
                    (p - c.g) * i,
                    (m - c.b) * i,
                    (v - c.a) * i,
                  ),
                    (u.r += (g - u.r) * i),
                    (u.g += (y - u.g) * i),
                    (u.b += (A - u.b) * i));
                }
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  ee = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.rgb + '|' + r,
          L.rgb2 + '|' + r,
        ]),
      );
      return ((i.slotIndex = 0), (i.slotIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 7;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r, i, o, a, s) {
            ((e *= 7),
              (this.frames[e] = t),
              (this.frames[e + 1] = n),
              (this.frames[e + 2] = r),
              (this.frames[e + 3] = i),
              (this.frames[e + 4] = o),
              (this.frames[e + 5] = a),
              (this.frames[e + 6] = s));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.slots[this.slotIndex];
            if (s.bone.active) {
              var l = this.frames,
                c = s.color,
                u = s.darkColor;
              if (n < l[0]) {
                var f = s.data.color,
                  d = s.data.darkColor;
                switch (o) {
                  case B.setup:
                    return (
                      (c.r = f.r),
                      (c.g = f.g),
                      (c.b = f.b),
                      (u.r = d.r),
                      (u.g = d.g),
                      void (u.b = d.b)
                    );
                  case B.first:
                    ((c.r += (f.r - c.r) * i),
                      (c.g += (f.g - c.g) * i),
                      (c.b += (f.b - c.b) * i),
                      (u.r += (d.r - u.r) * i),
                      (u.g += (d.g - u.g) * i),
                      (u.b += (d.b - u.b) * i));
                }
              } else {
                var h = 0,
                  p = 0,
                  m = 0,
                  v = 0,
                  g = 0,
                  y = 0,
                  A = R.search(l, n, 7),
                  b = this.curves[A / 7];
                switch (b) {
                  case 0:
                    var w = l[A];
                    ((h = l[A + 1]),
                      (p = l[A + 2]),
                      (m = l[A + 3]),
                      (v = l[A + 4]),
                      (g = l[A + 5]),
                      (y = l[A + 6]));
                    var _ = (n - w) / (l[A + 7] - w);
                    ((h += (l[A + 7 + 1] - h) * _),
                      (p += (l[A + 7 + 2] - p) * _),
                      (m += (l[A + 7 + 3] - m) * _),
                      (v += (l[A + 7 + 4] - v) * _),
                      (g += (l[A + 7 + 5] - g) * _),
                      (y += (l[A + 7 + 6] - y) * _));
                    break;
                  case 1:
                    ((h = l[A + 1]),
                      (p = l[A + 2]),
                      (m = l[A + 3]),
                      (v = l[A + 4]),
                      (g = l[A + 5]),
                      (y = l[A + 6]));
                    break;
                  default:
                    ((h = this.getBezierValue(n, A, 1, b - 2)),
                      (p = this.getBezierValue(n, A, 2, b + 18 - 2)),
                      (m = this.getBezierValue(n, A, 3, b + 36 - 2)),
                      (v = this.getBezierValue(n, A, 4, b + 54 - 2)),
                      (g = this.getBezierValue(n, A, 5, b + 72 - 2)),
                      (y = this.getBezierValue(n, A, 6, b + 90 - 2)));
                }
                if (1 == i)
                  ((c.r = h),
                    (c.g = p),
                    (c.b = m),
                    (u.r = v),
                    (u.g = g),
                    (u.b = y));
                else {
                  if (o == B.setup) {
                    var x = s.data.color,
                      k = s.data.darkColor;
                    ((c.r = x.r),
                      (c.g = x.g),
                      (c.b = x.b),
                      (u.r = k.r),
                      (u.g = k.g),
                      (u.b = k.b));
                  }
                  ((c.r += (h - c.r) * i),
                    (c.g += (p - c.g) * i),
                    (c.b += (m - c.b) * i),
                    (u.r += (v - u.r) * i),
                    (u.g += (g - u.g) * i),
                    (u.b += (y - u.b) * i));
                }
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  te = (function (e) {
    function t(e, n) {
      d(this, t);
      var r = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, [
          L.attachment + '|' + n,
        ]),
      );
      return (
        (r.slotIndex = 0),
        (r.slotIndex = n),
        (r.attachmentNames = new Array(e)),
        r
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameCount',
          value: function () {
            return this.frames.length;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n) {
            ((this.frames[e] = t), (this.attachmentNames[e] = n));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.slots[this.slotIndex];
            s.bone.active &&
              (a != P.mixOut
                ? n < this.frames[0]
                  ? (o != B.setup && o != B.first) ||
                    this.setAttachment(e, s, s.data.attachmentName)
                  : this.setAttachment(
                      e,
                      s,
                      this.attachmentNames[R.search1(this.frames, n)],
                    )
                : o == B.setup &&
                  this.setAttachment(e, s, s.data.attachmentName));
          },
        },
        {
          key: 'setAttachment',
          value: function (e, t, n) {
            t.setAttachment(n ? e.getAttachment(this.slotIndex, n) : null);
          },
        },
      ]),
      t
    );
  })(R),
  ne = (function (e) {
    function t(e, n, r, i) {
      d(this, t);
      var o = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.deform + '|' + r + '|' + i.id,
        ]),
      );
      return (
        (o.slotIndex = 0),
        (o.slotIndex = r),
        (o.attachment = i),
        (o.vertices = new Array(e)),
        o
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameCount',
          value: function () {
            return this.frames.length;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n) {
            ((this.frames[e] = t), (this.vertices[e] = n));
          },
        },
        {
          key: 'setBezier',
          value: function (e, t, n, r, i, o, a, s, l, c, u) {
            var f = this.curves,
              d = this.getFrameCount() + 18 * e;
            0 == n && (f[t] = 2 + d);
            for (
              var h = 0.03 * (r - 2 * o + s),
                p = 0.03 * l - 0.06 * a,
                m = 0.006 * (3 * (o - s) - r + c),
                v = 0.018 * (a - l + 0.33333333),
                g = 2 * h + m,
                y = 2 * p + v,
                A = 0.3 * (o - r) + h + 0.16666667 * m,
                b = 0.3 * a + p + 0.16666667 * v,
                w = r + A,
                _ = b,
                x = d + 18;
              d < x;
              d += 2
            )
              ((f[d] = w),
                (f[d + 1] = _),
                (A += g),
                (b += y),
                (g += m),
                (y += v),
                (w += A),
                (_ += b));
          },
        },
        {
          key: 'getCurvePercent',
          value: function (e, t) {
            var n = this.curves,
              r = n[t];
            switch (r) {
              case 0:
                var i = this.frames[t];
                return (e - i) / (this.frames[t + this.getFrameEntries()] - i);
              case 1:
                return 0;
            }
            if (n[(r -= 2)] > e) {
              var o = this.frames[t];
              return (n[r + 1] * (e - o)) / (n[r] - o);
            }
            var a = r + 18;
            for (r += 2; r < a; r += 2)
              if (n[r] >= e) {
                var s = n[r - 2],
                  l = n[r - 1];
                return l + ((e - s) / (n[r] - s)) * (n[r + 1] - l);
              }
            var c = n[a - 2],
              u = n[a - 1];
            return (
              u +
              ((1 - u) * (e - c)) /
                (this.frames[t + this.getFrameEntries()] - c)
            );
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.slots[this.slotIndex];
            if (s.bone.active) {
              var l = s.getAttachment();
              if (
                l &&
                l instanceof C &&
                l.timelineAttachment == this.attachment
              ) {
                var c = s.deform;
                0 == c.length && (o = B.setup);
                var u = this.vertices,
                  f = u[0].length,
                  d = this.frames;
                if (n < d[0])
                  switch (o) {
                    case B.setup:
                      return void (c.length = 0);
                    case B.first:
                      if (1 == i) return void (c.length = 0);
                      c.length = f;
                      var h = l;
                      if (h.bones) for (i = 1 - i, m = 0; m < f; m++) c[m] *= i;
                      else
                        for (var p = h.vertices, m = 0; m < f; m++)
                          c[m] += (p[m] - c[m]) * i;
                  }
                else if (((c.length = f), n >= d[d.length - 1])) {
                  var v = u[d.length - 1];
                  if (1 == i)
                    if (o == B.add) {
                      var g = l;
                      if (g.bones) for (var y = 0; y < f; y++) c[y] += v[y];
                      else
                        for (var A = g.vertices, w = 0; w < f; w++)
                          c[w] += v[w] - A[w];
                    } else b.arrayCopy(v, 0, c, 0, f);
                  else
                    switch (o) {
                      case B.setup:
                        var _ = l;
                        if (_.bones)
                          for (var x = 0; x < f; x++) c[x] = v[x] * i;
                        else
                          for (var k = _.vertices, S = 0; S < f; S++) {
                            var E = k[S];
                            c[S] = E + (v[S] - E) * i;
                          }
                        break;
                      case B.first:
                      case B.replace:
                        for (var T = 0; T < f; T++) c[T] += (v[T] - c[T]) * i;
                        break;
                      case B.add:
                        var I = l;
                        if (I.bones)
                          for (var M = 0; M < f; M++) c[M] += v[M] * i;
                        else
                          for (var O = I.vertices, P = 0; P < f; P++)
                            c[P] += (v[P] - O[P]) * i;
                    }
                } else {
                  var L = R.search1(d, n),
                    D = this.getCurvePercent(n, L),
                    F = u[L],
                    j = u[L + 1];
                  if (1 == i)
                    if (o == B.add) {
                      var N = l;
                      if (N.bones)
                        for (var z = 0; z < f; z++) {
                          var U = F[z];
                          c[z] += U + (j[z] - U) * D;
                        }
                      else
                        for (var G = N.vertices, H = 0; H < f; H++) {
                          var Q = F[H];
                          c[H] += Q + (j[H] - Q) * D - G[H];
                        }
                    } else
                      for (var V = 0; V < f; V++) {
                        var q = F[V];
                        c[V] = q + (j[V] - q) * D;
                      }
                  else
                    switch (o) {
                      case B.setup:
                        var W = l;
                        if (W.bones)
                          for (var Y = 0; Y < f; Y++) {
                            var X = F[Y];
                            c[Y] = (X + (j[Y] - X) * D) * i;
                          }
                        else
                          for (var J = W.vertices, K = 0; K < f; K++) {
                            var $ = F[K],
                              Z = J[K];
                            c[K] = Z + ($ + (j[K] - $) * D - Z) * i;
                          }
                        break;
                      case B.first:
                      case B.replace:
                        for (var ee = 0; ee < f; ee++) {
                          var te = F[ee];
                          c[ee] += (te + (j[ee] - te) * D - c[ee]) * i;
                        }
                        break;
                      case B.add:
                        var ne = l;
                        if (ne.bones)
                          for (var re = 0; re < f; re++) {
                            var ie = F[re];
                            c[re] += (ie + (j[re] - ie) * D) * i;
                          }
                        else
                          for (var oe = ne.vertices, ae = 0; ae < f; ae++) {
                            var se = F[ae];
                            c[ae] += (se + (j[ae] - se) * D - oe[ae]) * i;
                          }
                    }
                }
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  re = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, t.propertyIds),
      );
      return ((n.events = new Array(e)), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameCount',
          value: function () {
            return this.frames.length;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t) {
            ((this.frames[e] = t.time), (this.events[e] = t));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            if (r) {
              var s = this.frames,
                l = this.frames.length;
              if (t > n)
                (this.apply(e, t, Number.MAX_VALUE, r, i, o, a), (t = -1));
              else if (t >= s[l - 1]) return;
              if (!(n < s[0])) {
                var c = 0;
                if (t < s[0]) c = 0;
                else
                  for (
                    var u = s[(c = R.search1(s, t) + 1)];
                    c > 0 && s[c - 1] == u;
                  )
                    c--;
                for (; c < l && n >= s[c]; c++) r.push(this.events[c]);
              }
            }
          },
        },
      ]),
      t
    );
  })(R);
re.propertyIds = ['' + L.event];
var ie = (function (e) {
  function t(e) {
    d(this, t);
    var n = u(
      this,
      (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, t.propertyIds),
    );
    return ((n.drawOrders = new Array(e)), n);
  }
  return (
    f(t, e),
    a(t, [
      {
        key: 'getFrameCount',
        value: function () {
          return this.frames.length;
        },
      },
      {
        key: 'setFrame',
        value: function (e, t, n) {
          ((this.frames[e] = t), (this.drawOrders[e] = n));
        },
      },
      {
        key: 'apply',
        value: function (e, t, n, r, i, o, a) {
          if (a != P.mixOut)
            if (n < this.frames[0])
              (o != B.setup && o != B.first) ||
                b.arrayCopy(e.slots, 0, e.drawOrder, 0, e.slots.length);
            else {
              var s = R.search1(this.frames, n),
                l = this.drawOrders[s];
              if (l)
                for (
                  var c = e.drawOrder, u = e.slots, f = 0, d = l.length;
                  f < d;
                  f++
                )
                  c[f] = u[l[f]];
              else b.arrayCopy(e.slots, 0, e.drawOrder, 0, e.slots.length);
            }
          else
            o == B.setup &&
              b.arrayCopy(e.slots, 0, e.drawOrder, 0, e.slots.length);
        },
      },
    ]),
    t
  );
})(R);
ie.propertyIds = ['' + L.drawOrder];
var oe = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.ikConstraint + '|' + r,
        ]),
      );
      return ((i.constraintIndex = 0), (i.constraintIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 6;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r, i, o, a) {
            ((e *= 6),
              (this.frames[e] = t),
              (this.frames[e + 1] = n),
              (this.frames[e + 2] = r),
              (this.frames[e + 3] = i),
              (this.frames[e + 4] = o ? 1 : 0),
              (this.frames[e + 5] = a ? 1 : 0));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.ikConstraints[this.constraintIndex];
            if (s.active) {
              var l = this.frames;
              if (n < l[0])
                switch (o) {
                  case B.setup:
                    return (
                      (s.mix = s.data.mix),
                      (s.softness = s.data.softness),
                      (s.bendDirection = s.data.bendDirection),
                      (s.compress = s.data.compress),
                      void (s.stretch = s.data.stretch)
                    );
                  case B.first:
                    ((s.mix += (s.data.mix - s.mix) * i),
                      (s.softness += (s.data.softness - s.softness) * i),
                      (s.bendDirection = s.data.bendDirection),
                      (s.compress = s.data.compress),
                      (s.stretch = s.data.stretch));
                }
              else {
                var c = 0,
                  u = 0,
                  f = R.search(l, n, 6),
                  d = this.curves[f / 6];
                switch (d) {
                  case 0:
                    var h = l[f];
                    ((c = l[f + 1]), (u = l[f + 2]));
                    var p = (n - h) / (l[f + 6] - h);
                    ((c += (l[f + 6 + 1] - c) * p),
                      (u += (l[f + 6 + 2] - u) * p));
                    break;
                  case 1:
                    ((c = l[f + 1]), (u = l[f + 2]));
                    break;
                  default:
                    ((c = this.getBezierValue(n, f, 1, d - 2)),
                      (u = this.getBezierValue(n, f, 2, d + 18 - 2)));
                }
                o == B.setup
                  ? ((s.mix = s.data.mix + (c - s.data.mix) * i),
                    (s.softness = s.data.softness + (u - s.data.softness) * i),
                    a == P.mixOut
                      ? ((s.bendDirection = s.data.bendDirection),
                        (s.compress = s.data.compress),
                        (s.stretch = s.data.stretch))
                      : ((s.bendDirection = l[f + 3]),
                        (s.compress = 0 != l[f + 4]),
                        (s.stretch = 0 != l[f + 5])))
                  : ((s.mix += (c - s.mix) * i),
                    (s.softness += (u - s.softness) * i),
                    a == P.mixIn &&
                      ((s.bendDirection = l[f + 3]),
                      (s.compress = 0 != l[f + 4]),
                      (s.stretch = 0 != l[f + 5])));
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  ae = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.transformConstraint + '|' + r,
        ]),
      );
      return ((i.constraintIndex = 0), (i.constraintIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 7;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r, i, o, a, s) {
            var l = this.frames;
            ((l[(e *= 7)] = t),
              (l[e + 1] = n),
              (l[e + 2] = r),
              (l[e + 3] = i),
              (l[e + 4] = o),
              (l[e + 5] = a),
              (l[e + 6] = s));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.transformConstraints[this.constraintIndex];
            if (s.active) {
              var l = this.frames;
              if (n < l[0]) {
                var c = s.data;
                switch (o) {
                  case B.setup:
                    return (
                      (s.mixRotate = c.mixRotate),
                      (s.mixX = c.mixX),
                      (s.mixY = c.mixY),
                      (s.mixScaleX = c.mixScaleX),
                      (s.mixScaleY = c.mixScaleY),
                      void (s.mixShearY = c.mixShearY)
                    );
                  case B.first:
                    ((s.mixRotate += (c.mixRotate - s.mixRotate) * i),
                      (s.mixX += (c.mixX - s.mixX) * i),
                      (s.mixY += (c.mixY - s.mixY) * i),
                      (s.mixScaleX += (c.mixScaleX - s.mixScaleX) * i),
                      (s.mixScaleY += (c.mixScaleY - s.mixScaleY) * i),
                      (s.mixShearY += (c.mixShearY - s.mixShearY) * i));
                }
              } else {
                var u = void 0,
                  f = void 0,
                  d = void 0,
                  h = void 0,
                  p = void 0,
                  m = void 0,
                  v = R.search(l, n, 7),
                  g = this.curves[v / 7];
                switch (g) {
                  case 0:
                    var y = l[v];
                    ((u = l[v + 1]),
                      (f = l[v + 2]),
                      (d = l[v + 3]),
                      (h = l[v + 4]),
                      (p = l[v + 5]),
                      (m = l[v + 6]));
                    var A = (n - y) / (l[v + 7] - y);
                    ((u += (l[v + 7 + 1] - u) * A),
                      (f += (l[v + 7 + 2] - f) * A),
                      (d += (l[v + 7 + 3] - d) * A),
                      (h += (l[v + 7 + 4] - h) * A),
                      (p += (l[v + 7 + 5] - p) * A),
                      (m += (l[v + 7 + 6] - m) * A));
                    break;
                  case 1:
                    ((u = l[v + 1]),
                      (f = l[v + 2]),
                      (d = l[v + 3]),
                      (h = l[v + 4]),
                      (p = l[v + 5]),
                      (m = l[v + 6]));
                    break;
                  default:
                    ((u = this.getBezierValue(n, v, 1, g - 2)),
                      (f = this.getBezierValue(n, v, 2, g + 18 - 2)),
                      (d = this.getBezierValue(n, v, 3, g + 36 - 2)),
                      (h = this.getBezierValue(n, v, 4, g + 54 - 2)),
                      (p = this.getBezierValue(n, v, 5, g + 72 - 2)),
                      (m = this.getBezierValue(n, v, 6, g + 90 - 2)));
                }
                if (o == B.setup) {
                  var b = s.data;
                  ((s.mixRotate = b.mixRotate + (u - b.mixRotate) * i),
                    (s.mixX = b.mixX + (f - b.mixX) * i),
                    (s.mixY = b.mixY + (d - b.mixY) * i),
                    (s.mixScaleX = b.mixScaleX + (h - b.mixScaleX) * i),
                    (s.mixScaleY = b.mixScaleY + (p - b.mixScaleY) * i),
                    (s.mixShearY = b.mixShearY + (m - b.mixShearY) * i));
                } else
                  ((s.mixRotate += (u - s.mixRotate) * i),
                    (s.mixX += (f - s.mixX) * i),
                    (s.mixY += (d - s.mixY) * i),
                    (s.mixScaleX += (h - s.mixScaleX) * i),
                    (s.mixScaleY += (p - s.mixScaleY) * i),
                    (s.mixShearY += (m - s.mixShearY) * i));
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  se = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.pathConstraintPosition + '|' + r,
        ),
      );
      return ((i.constraintIndex = 0), (i.constraintIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.pathConstraints[this.constraintIndex];
            s.active &&
              (s.position = this.getAbsoluteValue(
                n,
                i,
                o,
                s.position,
                s.data.position,
              ));
          },
        },
      ]),
      t
    );
  })(F),
  le = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(
          this,
          e,
          n,
          L.pathConstraintSpacing + '|' + r,
        ),
      );
      return ((i.constraintIndex = 0), (i.constraintIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.pathConstraints[this.constraintIndex];
            s.active &&
              (s.spacing = this.getAbsoluteValue(
                n,
                i,
                o,
                s.spacing,
                s.data.spacing,
              ));
          },
        },
      ]),
      t
    );
  })(F),
  ce = (function (e) {
    function t(e, n, r) {
      d(this, t);
      var i = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, [
          L.pathConstraintMix + '|' + r,
        ]),
      );
      return ((i.constraintIndex = 0), (i.constraintIndex = r), i);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameEntries',
          value: function () {
            return 4;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t, n, r, i) {
            var o = this.frames;
            ((o[(e <<= 2)] = t),
              (o[e + 1] = n),
              (o[e + 2] = r),
              (o[e + 3] = i));
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = e.pathConstraints[this.constraintIndex];
            if (s.active) {
              var l = this.frames;
              if (n < l[0])
                switch (o) {
                  case B.setup:
                    return (
                      (s.mixRotate = s.data.mixRotate),
                      (s.mixX = s.data.mixX),
                      void (s.mixY = s.data.mixY)
                    );
                  case B.first:
                    ((s.mixRotate += (s.data.mixRotate - s.mixRotate) * i),
                      (s.mixX += (s.data.mixX - s.mixX) * i),
                      (s.mixY += (s.data.mixY - s.mixY) * i));
                }
              else {
                var c = void 0,
                  u = void 0,
                  f = void 0,
                  d = R.search(l, n, 4),
                  h = this.curves[d >> 2];
                switch (h) {
                  case 0:
                    var p = l[d];
                    ((c = l[d + 1]), (u = l[d + 2]), (f = l[d + 3]));
                    var m = (n - p) / (l[d + 4] - p);
                    ((c += (l[d + 4 + 1] - c) * m),
                      (u += (l[d + 4 + 2] - u) * m),
                      (f += (l[d + 4 + 3] - f) * m));
                    break;
                  case 1:
                    ((c = l[d + 1]), (u = l[d + 2]), (f = l[d + 3]));
                    break;
                  default:
                    ((c = this.getBezierValue(n, d, 1, h - 2)),
                      (u = this.getBezierValue(n, d, 2, h + 18 - 2)),
                      (f = this.getBezierValue(n, d, 3, h + 36 - 2)));
                }
                if (o == B.setup) {
                  var v = s.data;
                  ((s.mixRotate = v.mixRotate + (c - v.mixRotate) * i),
                    (s.mixX = v.mixX + (u - v.mixX) * i),
                    (s.mixY = v.mixY + (f - v.mixY) * i));
                } else
                  ((s.mixRotate += (c - s.mixRotate) * i),
                    (s.mixX += (u - s.mixX) * i),
                    (s.mixY += (f - s.mixY) * i));
              }
            }
          },
        },
      ]),
      t
    );
  })(D),
  ue = (function (e) {
    function t(e, n, r, i) {
      d(this, t);
      var o = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, i + '|' + r),
      );
      return ((o.constraintIndex = 0), (o.constraintIndex = r), o);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = void 0;
            if (-1 == this.constraintIndex) {
              var l = n >= this.frames[0] ? this.getCurveValue(n) : 0,
                c = !0,
                u = !1,
                f = void 0;
              try {
                for (
                  var d, h = e.physicsConstraints[Symbol.iterator]();
                  !(c = (d = h.next()).done);
                  c = !0
                ) {
                  var p = d.value;
                  p.active &&
                    this.global(p.data) &&
                    this.set(
                      p,
                      this.getAbsoluteValue2(
                        n,
                        i,
                        o,
                        this.get(p),
                        this.setup(p),
                        l,
                      ),
                    );
                }
              } catch (e) {
                ((u = !0), (f = e));
              } finally {
                try {
                  !c && h.return && h.return();
                } finally {
                  if (u) throw f;
                }
              }
            } else
              (s = e.physicsConstraints[this.constraintIndex]).active &&
                this.set(
                  s,
                  this.getAbsoluteValue(n, i, o, this.get(s), this.setup(s)),
                );
          },
        },
      ]),
      t
    );
  })(F),
  fe = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(
            this,
            e,
            n,
            r,
            L.physicsConstraintInertia,
          ),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setup',
          value: function (e) {
            return e.data.inertia;
          },
        },
        {
          key: 'get',
          value: function (e) {
            return e.inertia;
          },
        },
        {
          key: 'set',
          value: function (e, t) {
            e.inertia = t;
          },
        },
        {
          key: 'global',
          value: function (e) {
            return e.inertiaGlobal;
          },
        },
      ]),
      t
    );
  })(ue),
  de = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(
            this,
            e,
            n,
            r,
            L.physicsConstraintStrength,
          ),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setup',
          value: function (e) {
            return e.data.strength;
          },
        },
        {
          key: 'get',
          value: function (e) {
            return e.strength;
          },
        },
        {
          key: 'set',
          value: function (e, t) {
            e.strength = t;
          },
        },
        {
          key: 'global',
          value: function (e) {
            return e.strengthGlobal;
          },
        },
      ]),
      t
    );
  })(ue),
  he = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(
            this,
            e,
            n,
            r,
            L.physicsConstraintDamping,
          ),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setup',
          value: function (e) {
            return e.data.damping;
          },
        },
        {
          key: 'get',
          value: function (e) {
            return e.damping;
          },
        },
        {
          key: 'set',
          value: function (e, t) {
            e.damping = t;
          },
        },
        {
          key: 'global',
          value: function (e) {
            return e.dampingGlobal;
          },
        },
      ]),
      t
    );
  })(ue),
  pe = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(
            this,
            e,
            n,
            r,
            L.physicsConstraintMass,
          ),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setup',
          value: function (e) {
            return 1 / e.data.massInverse;
          },
        },
        {
          key: 'get',
          value: function (e) {
            return 1 / e.massInverse;
          },
        },
        {
          key: 'set',
          value: function (e, t) {
            e.massInverse = 1 / t;
          },
        },
        {
          key: 'global',
          value: function (e) {
            return e.massGlobal;
          },
        },
      ]),
      t
    );
  })(ue),
  me = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(
            this,
            e,
            n,
            r,
            L.physicsConstraintWind,
          ),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setup',
          value: function (e) {
            return e.data.wind;
          },
        },
        {
          key: 'get',
          value: function (e) {
            return e.wind;
          },
        },
        {
          key: 'set',
          value: function (e, t) {
            e.wind = t;
          },
        },
        {
          key: 'global',
          value: function (e) {
            return e.windGlobal;
          },
        },
      ]),
      t
    );
  })(ue),
  ve = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(
            this,
            e,
            n,
            r,
            L.physicsConstraintGravity,
          ),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setup',
          value: function (e) {
            return e.data.gravity;
          },
        },
        {
          key: 'get',
          value: function (e) {
            return e.gravity;
          },
        },
        {
          key: 'set',
          value: function (e, t) {
            e.gravity = t;
          },
        },
        {
          key: 'global',
          value: function (e) {
            return e.gravityGlobal;
          },
        },
      ]),
      t
    );
  })(ue),
  ge = (function (e) {
    function t(e, n, r) {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(
            this,
            e,
            n,
            r,
            L.physicsConstraintMix,
          ),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'setup',
          value: function (e) {
            return e.data.mix;
          },
        },
        {
          key: 'get',
          value: function (e) {
            return e.mix;
          },
        },
        {
          key: 'set',
          value: function (e, t) {
            e.mix = t;
          },
        },
        {
          key: 'global',
          value: function (e) {
            return e.mixGlobal;
          },
        },
      ]),
      t
    );
  })(ue),
  ye = (function (e) {
    function t(e, n) {
      d(this, t);
      var r = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, t.propertyIds),
      );
      return ((r.constraintIndex = n), r);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'getFrameCount',
          value: function () {
            return this.frames.length;
          },
        },
        {
          key: 'setFrame',
          value: function (e, t) {
            this.frames[e] = t;
          },
        },
        {
          key: 'apply',
          value: function (e, t, n, r, i, o, a) {
            var s = void 0;
            if (
              -1 == this.constraintIndex ||
              (s = e.physicsConstraints[this.constraintIndex]).active
            ) {
              var l = this.frames;
              if (t > n)
                (this.apply(e, t, Number.MAX_VALUE, [], i, o, a), (t = -1));
              else if (t >= l[l.length - 1]) return;
              if (!(n < l[0]) && (t < l[0] || n >= l[R.search1(l, t) + 1]))
                if (null != s) s.reset();
                else {
                  var c = !0,
                    u = !1,
                    f = void 0;
                  try {
                    for (
                      var d, h = e.physicsConstraints[Symbol.iterator]();
                      !(c = (d = h.next()).done);
                      c = !0
                    ) {
                      var p = d.value;
                      p.active && p.reset();
                    }
                  } catch (e) {
                    ((u = !0), (f = e));
                  } finally {
                    try {
                      !c && h.return && h.return();
                    } finally {
                      if (u) throw f;
                    }
                  }
                }
            }
          },
        },
      ]),
      t
    );
  })(R);
ye.propertyIds = [L.physicsConstraintReset.toString()];
var Ae = (function (e) {
  function t(e, n, r) {
    d(this, t);
    var i = u(
      this,
      (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, [
        L.sequence + '|' + n + '|' + r.sequence.id,
      ]),
    );
    return ((i.slotIndex = n), (i.attachment = r), i);
  }
  return (
    f(t, e),
    a(t, [
      {
        key: 'getFrameEntries',
        value: function () {
          return t.ENTRIES;
        },
      },
      {
        key: 'getSlotIndex',
        value: function () {
          return this.slotIndex;
        },
      },
      {
        key: 'getAttachment',
        value: function () {
          return this.attachment;
        },
      },
      {
        key: 'setFrame',
        value: function (e, n, r, i, o) {
          var a = this.frames;
          ((a[(e *= t.ENTRIES)] = n),
            (a[e + t.MODE] = r | (i << 4)),
            (a[e + t.DELAY] = o));
        },
      },
      {
        key: 'apply',
        value: function (e, n, r, i, o, a, s) {
          var l = e.slots[this.slotIndex];
          if (l.bone.active) {
            var c = l.attachment,
              u = this.attachment;
            if (c == u || (c instanceof C && c.timelineAttachment == u)) {
              var f = this.frames;
              if (r < f[0])
                (a != B.setup && a != B.first) || (l.sequenceIndex = -1);
              else {
                var d = R.search(f, r, t.ENTRIES),
                  h = f[d],
                  p = f[d + t.MODE],
                  m = f[d + t.DELAY];
                if (this.attachment.sequence) {
                  var v = p >> 4,
                    g = this.attachment.sequence.regions.length,
                    y = M[15 & p];
                  if (y != I.hold)
                    switch (((v += ((r - h) / m + 1e-5) | 0), y)) {
                      case I.once:
                        v = Math.min(g - 1, v);
                        break;
                      case I.loop:
                        v %= g;
                        break;
                      case I.pingpong:
                        var A = (g << 1) - 2;
                        (v = 0 == A ? 0 : v % A) >= g && (v = A - v);
                        break;
                      case I.onceReverse:
                        v = Math.max(g - 1 - v, 0);
                        break;
                      case I.loopReverse:
                        v = g - 1 - (v % g);
                        break;
                      case I.pingpongReverse:
                        var b = (g << 1) - 2;
                        (v = 0 == b ? 0 : (v + g - 1) % b) >= g && (v = b - v);
                    }
                  l.sequenceIndex = v;
                }
              }
            }
          }
        },
      },
    ]),
    t
  );
})(R);
((Ae.ENTRIES = 3), (Ae.MODE = 1), (Ae.DELAY = 2));
var be = (function () {
  function e(t) {
    (d(this, e),
      (this.tracks = new Array()),
      (this.timeScale = 1),
      (this.unkeyedState = 0),
      (this.events = new Array()),
      (this.listeners = new Array()),
      (this.queue = new _e(this)),
      (this.propertyIDs = new p()),
      (this.animationsChanged = !1),
      (this.trackEntryPool = new _(function () {
        return new we();
      })),
      (this.data = t));
  }
  return (
    a(e, null, [
      {
        key: 'emptyAnimation',
        value: function () {
          return e._emptyAnimation;
        },
      },
    ]),
    a(e, [
      {
        key: 'update',
        value: function (e) {
          e *= this.timeScale;
          for (var t = this.tracks, n = 0, r = t.length; n < r; n++) {
            var i = t[n];
            if (i) {
              ((i.animationLast = i.nextAnimationLast),
                (i.trackLast = i.nextTrackLast));
              var o = e * i.timeScale;
              if (i.delay > 0) {
                if (((i.delay -= o), i.delay > 0)) continue;
                ((o = -i.delay), (i.delay = 0));
              }
              var a = i.next;
              if (a) {
                var s = i.trackLast - a.delay;
                if (s >= 0) {
                  for (
                    a.delay = 0,
                      a.trackTime +=
                        0 == i.timeScale
                          ? 0
                          : (s / i.timeScale + e) * a.timeScale,
                      i.trackTime += o,
                      this.setCurrent(n, a, !0);
                    a.mixingFrom;
                  )
                    ((a.mixTime += e), (a = a.mixingFrom));
                  continue;
                }
              } else if (i.trackLast >= i.trackEnd && !i.mixingFrom) {
                ((t[n] = null), this.queue.end(i), this.clearNext(i));
                continue;
              }
              if (i.mixingFrom && this.updateMixingFrom(i, e)) {
                var l = i.mixingFrom;
                for (i.mixingFrom = null, l && (l.mixingTo = null); l;)
                  (this.queue.end(l), (l = l.mixingFrom));
              }
              i.trackTime += o;
            }
          }
          this.queue.drain();
        },
      },
      {
        key: 'updateMixingFrom',
        value: function (e, t) {
          var n = e.mixingFrom;
          if (!n) return !0;
          var r = this.updateMixingFrom(n, t);
          return (
            (n.animationLast = n.nextAnimationLast),
            (n.trackLast = n.nextTrackLast),
            e.mixTime > 0 && e.mixTime >= e.mixDuration
              ? ((0 != n.totalAlpha && 0 != e.mixDuration) ||
                  ((e.mixingFrom = n.mixingFrom),
                  n.mixingFrom && (n.mixingFrom.mixingTo = e),
                  (e.interruptAlpha = n.interruptAlpha),
                  this.queue.end(n)),
                r)
              : ((n.trackTime += t * n.timeScale), (e.mixTime += t), !1)
          );
        },
      },
      {
        key: 'apply',
        value: function (e) {
          if (!e) throw new Error('skeleton cannot be null.');
          this.animationsChanged && this._animationsChanged();
          for (
            var t = this.events, n = this.tracks, r = !1, i = 0, o = n.length;
            i < o;
            i++
          ) {
            var a = n[i];
            if (a && !(a.delay > 0)) {
              r = !0;
              var s = 0 == i ? B.first : a.mixBlend,
                l = a.alpha;
              a.mixingFrom
                ? (l *= this.applyMixingFrom(a, e, s))
                : a.trackTime >= a.trackEnd && !a.next && (l = 0);
              var c = l >= a.alphaAttachmentThreshold,
                u = a.animationLast,
                f = a.getAnimationTime(),
                d = f,
                h = t;
              a.reverse && ((d = a.animation.duration - d), (h = null));
              var p = a.animation.timelines,
                m = p.length;
              if ((0 == i && 1 == l) || s == B.add) {
                0 == i && (c = !0);
                for (var v = 0; v < m; v++) {
                  b.webkit602BugfixHelper(l, s);
                  var g = p[v];
                  g instanceof te
                    ? this.applyAttachmentTimeline(g, e, d, s, c)
                    : g.apply(e, u, d, h, l, s, P.mixIn);
                }
              } else {
                var y = a.timelineMode,
                  A = a.shortestRotation,
                  w = !A && a.timelinesRotation.length != m << 1;
                w && (a.timelinesRotation.length = m << 1);
                for (var _ = 0; _ < m; _++) {
                  var x = p[_],
                    k = y[_] == Se ? s : B.setup;
                  !A && x instanceof N
                    ? this.applyRotateTimeline(
                        x,
                        e,
                        d,
                        l,
                        k,
                        a.timelinesRotation,
                        _ << 1,
                        w,
                      )
                    : x instanceof te
                      ? this.applyAttachmentTimeline(x, e, d, s, c)
                      : (b.webkit602BugfixHelper(l, s),
                        x.apply(e, u, d, h, l, k, P.mixIn));
                }
              }
              (this.queueEvents(a, f),
                (t.length = 0),
                (a.nextAnimationLast = f),
                (a.nextTrackLast = a.trackTime));
            }
          }
          for (
            var S = this.unkeyedState + Me,
              E = e.slots,
              C = 0,
              T = e.slots.length;
            C < T;
            C++
          ) {
            var I = E[C];
            if (I.attachmentState == S) {
              var M = I.data.attachmentName;
              I.setAttachment(M ? e.getAttachment(I.data.index, M) : null);
            }
          }
          return ((this.unkeyedState += 2), this.queue.drain(), r);
        },
      },
      {
        key: 'applyMixingFrom',
        value: function (e, t, n) {
          var r = e.mixingFrom;
          r.mixingFrom && this.applyMixingFrom(r, t, n);
          var i = 0;
          0 == e.mixDuration
            ? ((i = 1), n == B.first && (n = B.setup))
            : ((i = e.mixTime / e.mixDuration) > 1 && (i = 1),
              n != B.first && (n = r.mixBlend));
          var o = i < r.mixAttachmentThreshold,
            a = i < r.mixDrawOrderThreshold,
            s = r.animation.timelines,
            l = s.length,
            c = r.alpha * e.interruptAlpha,
            u = c * (1 - i),
            f = r.animationLast,
            d = r.getAnimationTime(),
            h = d,
            p = null;
          if (
            (r.reverse
              ? (h = r.animation.duration - h)
              : i < r.eventThreshold && (p = this.events),
            n == B.add)
          )
            for (var m = 0; m < l; m++) s[m].apply(t, f, h, p, u, n, P.mixOut);
          else {
            var v = r.timelineMode,
              g = r.timelineHoldMix,
              y = r.shortestRotation,
              A = !y && r.timelinesRotation.length != l << 1;
            (A && (r.timelinesRotation.length = l << 1), (r.totalAlpha = 0));
            for (var w = 0; w < l; w++) {
              var _ = s[w],
                x = P.mixOut,
                k = void 0,
                S = 0;
              switch (v[w]) {
                case Se:
                  if (!a && _ instanceof ie) continue;
                  ((k = n), (S = u));
                  break;
                case Ee:
                  ((k = B.setup), (S = u));
                  break;
                case Ce:
                  ((k = n), (S = c));
                  break;
                case Te:
                  ((k = B.setup), (S = c));
                  break;
                default:
                  k = B.setup;
                  var E = g[w];
                  S = c * Math.max(0, 1 - E.mixTime / E.mixDuration);
              }
              ((r.totalAlpha += S),
                !y && _ instanceof N
                  ? this.applyRotateTimeline(
                      _,
                      t,
                      h,
                      S,
                      k,
                      r.timelinesRotation,
                      w << 1,
                      A,
                    )
                  : _ instanceof te
                    ? this.applyAttachmentTimeline(
                        _,
                        t,
                        h,
                        k,
                        o && S >= r.alphaAttachmentThreshold,
                      )
                    : (b.webkit602BugfixHelper(S, n),
                      a && _ instanceof ie && k == B.setup && (x = P.mixIn),
                      _.apply(t, f, h, p, S, k, x)));
            }
          }
          return (
            e.mixDuration > 0 && this.queueEvents(r, d),
            (this.events.length = 0),
            (r.nextAnimationLast = d),
            (r.nextTrackLast = r.trackTime),
            i
          );
        },
      },
      {
        key: 'applyAttachmentTimeline',
        value: function (e, t, n, r, i) {
          var o = t.slots[e.slotIndex];
          o.bone.active &&
            (n < e.frames[0]
              ? (r != B.setup && r != B.first) ||
                this.setAttachment(t, o, o.data.attachmentName, i)
              : this.setAttachment(
                  t,
                  o,
                  e.attachmentNames[R.search1(e.frames, n)],
                  i,
                ),
            o.attachmentState <= this.unkeyedState &&
              (o.attachmentState = this.unkeyedState + Me));
        },
      },
      {
        key: 'setAttachment',
        value: function (e, t, n, r) {
          (t.setAttachment(n ? e.getAttachment(t.data.index, n) : null),
            r && (t.attachmentState = this.unkeyedState + Oe));
        },
      },
      {
        key: 'applyRotateTimeline',
        value: function (e, t, n, r, i, o, a, s) {
          if ((s && (o[a] = 0), 1 != r)) {
            var l = t.bones[e.boneIndex];
            if (l.active) {
              var c = 0,
                u = 0;
              if (n < e.frames[0])
                switch (i) {
                  case B.setup:
                    l.rotation = l.data.rotation;
                  default:
                    return;
                  case B.first:
                    ((c = l.rotation), (u = l.data.rotation));
                }
              else
                ((c = i == B.setup ? l.data.rotation : l.rotation),
                  (u = l.data.rotation + e.getCurveValue(n)));
              var f = 0,
                d = u - c;
              if (0 == (d -= 360 * Math.ceil(d / 360 - 0.5))) f = o[a];
              else {
                var h = 0,
                  p = 0;
                s ? ((h = 0), (p = d)) : ((h = o[a]), (p = o[a + 1]));
                var m = h - (h % 360);
                f = d + m;
                var g = d >= 0,
                  y = h >= 0;
                (Math.abs(p) <= 90 &&
                  v.signum(p) != v.signum(d) &&
                  (Math.abs(h - m) > 180
                    ? ((f += 360 * v.signum(h)), (y = g))
                    : 0 != m
                      ? (f -= 360 * v.signum(h))
                      : (y = g)),
                  y != g && (f += 360 * v.signum(h)),
                  (o[a] = f));
              }
              ((o[a + 1] = d), (l.rotation = c + f * r));
            }
          } else e.apply(t, 0, n, null, 1, i, P.mixIn);
        },
      },
      {
        key: 'queueEvents',
        value: function (e, t) {
          for (
            var n = e.animationStart,
              r = e.animationEnd,
              i = r - n,
              o = e.trackLast % i,
              a = this.events,
              s = 0,
              l = a.length;
            s < l;
            s++
          ) {
            var c = a[s];
            if (c.time < o) break;
            c.time > r || this.queue.event(e, c);
          }
          var u = !1;
          if (e.loop)
            if (0 == i) u = !0;
            else {
              var f = Math.floor(e.trackTime / i);
              u = f > 0 && f > Math.floor(e.trackLast / i);
            }
          else u = t >= r && e.animationLast < r;
          for (u && this.queue.complete(e); s < l; s++) {
            var d = a[s];
            d.time < n || this.queue.event(e, d);
          }
        },
      },
      {
        key: 'clearTracks',
        value: function () {
          var e = this.queue.drainDisabled;
          this.queue.drainDisabled = !0;
          for (var t = 0, n = this.tracks.length; t < n; t++)
            this.clearTrack(t);
          ((this.tracks.length = 0),
            (this.queue.drainDisabled = e),
            this.queue.drain());
        },
      },
      {
        key: 'clearTrack',
        value: function (e) {
          if (!(e >= this.tracks.length)) {
            var t = this.tracks[e];
            if (t) {
              (this.queue.end(t), this.clearNext(t));
              for (var n = t; ;) {
                var r = n.mixingFrom;
                if (!r) break;
                (this.queue.end(r),
                  (n.mixingFrom = null),
                  (n.mixingTo = null),
                  (n = r));
              }
              ((this.tracks[t.trackIndex] = null), this.queue.drain());
            }
          }
        },
      },
      {
        key: 'setCurrent',
        value: function (e, t, n) {
          var r = this.expandToIndex(e);
          ((this.tracks[e] = t),
            (t.previous = null),
            r &&
              (n && this.queue.interrupt(r),
              (t.mixingFrom = r),
              (r.mixingTo = t),
              (t.mixTime = 0),
              r.mixingFrom &&
                r.mixDuration > 0 &&
                (t.interruptAlpha *= Math.min(1, r.mixTime / r.mixDuration)),
              (r.timelinesRotation.length = 0)),
            this.queue.start(t));
        },
      },
      {
        key: 'setAnimation',
        value: function (e, t) {
          var n =
              arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            r = this.data.skeletonData.findAnimation(t);
          if (!r) throw new Error('Animation not found: ' + t);
          return this.setAnimationWith(e, r, n);
        },
      },
      {
        key: 'setAnimationWith',
        value: function (e, t) {
          var n =
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          if (!t) throw new Error('animation cannot be null.');
          var r = !0,
            i = this.expandToIndex(e);
          i &&
            (-1 == i.nextTrackLast
              ? ((this.tracks[e] = i.mixingFrom),
                this.queue.interrupt(i),
                this.queue.end(i),
                this.clearNext(i),
                (i = i.mixingFrom),
                (r = !1))
              : this.clearNext(i));
          var o = this.trackEntry(e, t, n, i);
          return (this.setCurrent(e, o, r), this.queue.drain(), o);
        },
      },
      {
        key: 'addAnimation',
        value: function (e, t) {
          var n =
              arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            r =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : 0,
            i = this.data.skeletonData.findAnimation(t);
          if (!i) throw new Error('Animation not found: ' + t);
          return this.addAnimationWith(e, i, n, r);
        },
      },
      {
        key: 'addAnimationWith',
        value: function (e, t) {
          var n =
              arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            r =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : 0;
          if (!t) throw new Error('animation cannot be null.');
          var i = this.expandToIndex(e);
          if (i) for (; i.next;) i = i.next;
          var o = this.trackEntry(e, t, n, i);
          return (
            i
              ? ((i.next = o),
                (o.previous = i),
                r <= 0 && (r += i.getTrackComplete() - o.mixDuration))
              : (this.setCurrent(e, o, !0), this.queue.drain()),
            (o.delay = r),
            o
          );
        },
      },
      {
        key: 'setEmptyAnimation',
        value: function (t) {
          var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0,
            r = this.setAnimationWith(t, e.emptyAnimation(), !1);
          return ((r.mixDuration = n), (r.trackEnd = n), r);
        },
      },
      {
        key: 'addEmptyAnimation',
        value: function (t) {
          var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0,
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 0,
            i = this.addAnimationWith(t, e.emptyAnimation(), !1, r);
          return (
            r <= 0 && (i.delay += i.mixDuration - n),
            (i.mixDuration = n),
            (i.trackEnd = n),
            i
          );
        },
      },
      {
        key: 'setEmptyAnimations',
        value: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 0,
            t = this.queue.drainDisabled;
          this.queue.drainDisabled = !0;
          for (var n = 0, r = this.tracks.length; n < r; n++) {
            var i = this.tracks[n];
            i && this.setEmptyAnimation(i.trackIndex, e);
          }
          ((this.queue.drainDisabled = t), this.queue.drain());
        },
      },
      {
        key: 'expandToIndex',
        value: function (e) {
          return e < this.tracks.length
            ? this.tracks[e]
            : (b.ensureArrayCapacity(this.tracks, e + 1, null),
              (this.tracks.length = e + 1),
              null);
        },
      },
      {
        key: 'trackEntry',
        value: function (e, t, n, r) {
          var i = this.trackEntryPool.obtain();
          return (
            i.reset(),
            (i.trackIndex = e),
            (i.animation = t),
            (i.loop = n),
            (i.holdPrevious = !1),
            (i.reverse = !1),
            (i.shortestRotation = !1),
            (i.eventThreshold = 0),
            (i.alphaAttachmentThreshold = 0),
            (i.mixAttachmentThreshold = 0),
            (i.mixDrawOrderThreshold = 0),
            (i.animationStart = 0),
            (i.animationEnd = t.duration),
            (i.animationLast = -1),
            (i.nextAnimationLast = -1),
            (i.delay = 0),
            (i.trackTime = 0),
            (i.trackLast = -1),
            (i.nextTrackLast = -1),
            (i.trackEnd = Number.MAX_VALUE),
            (i.timeScale = 1),
            (i.alpha = 1),
            (i.mixTime = 0),
            (i.mixDuration = r ? this.data.getMix(r.animation, t) : 0),
            (i.interruptAlpha = 1),
            (i.totalAlpha = 0),
            (i.mixBlend = B.replace),
            i
          );
        },
      },
      {
        key: 'clearNext',
        value: function (e) {
          for (var t = e.next; t;) (this.queue.dispose(t), (t = t.next));
          e.next = null;
        },
      },
      {
        key: '_animationsChanged',
        value: function () {
          ((this.animationsChanged = !1), this.propertyIDs.clear());
          for (var e = this.tracks, t = 0, n = e.length; t < n; t++) {
            var r = e[t];
            if (r) {
              for (; r.mixingFrom;) r = r.mixingFrom;
              do {
                ((r.mixingTo && r.mixBlend == B.add) || this.computeHold(r),
                  (r = r.mixingTo));
              } while (r);
            }
          }
        },
      },
      {
        key: 'computeHold',
        value: function (e) {
          var t = e.mixingTo,
            n = e.animation.timelines,
            r = e.animation.timelines.length,
            i = e.timelineMode;
          i.length = r;
          var o = e.timelineHoldMix;
          o.length = 0;
          var a = this.propertyIDs;
          if (t && t.holdPrevious)
            for (var s = 0; s < r; s++)
              i[s] = a.addAll(n[s].getPropertyIds()) ? Te : Ce;
          else
            e: for (var l = 0; l < r; l++) {
              var c = n[l],
                u = c.getPropertyIds();
              if (a.addAll(u))
                if (
                  !t ||
                  c instanceof te ||
                  c instanceof ie ||
                  c instanceof re ||
                  !t.animation.hasTimeline(u)
                )
                  i[l] = Ee;
                else {
                  for (var f = t.mixingTo; f; f = f.mixingTo)
                    if (!f.animation.hasTimeline(u)) {
                      if (e.mixDuration > 0) {
                        ((i[l] = Ie), (o[l] = f));
                        continue e;
                      }
                      break;
                    }
                  i[l] = Te;
                }
              else i[l] = Se;
            }
        },
      },
      {
        key: 'getCurrent',
        value: function (e) {
          return e >= this.tracks.length ? null : this.tracks[e];
        },
      },
      {
        key: 'addListener',
        value: function (e) {
          if (!e) throw new Error('listener cannot be null.');
          this.listeners.push(e);
        },
      },
      {
        key: 'removeListener',
        value: function (e) {
          var t = this.listeners.indexOf(e);
          t >= 0 && this.listeners.splice(t, 1);
        },
      },
      {
        key: 'clearListeners',
        value: function () {
          this.listeners.length = 0;
        },
      },
      {
        key: 'clearListenerNotifications',
        value: function () {
          this.queue.clear();
        },
      },
    ]),
    e
  );
})();
be._emptyAnimation = new O('<empty>', [], 0);
var we = (function () {
    function e() {
      (d(this, e),
        (this.animation = null),
        (this.previous = null),
        (this.next = null),
        (this.mixingFrom = null),
        (this.mixingTo = null),
        (this.listener = null),
        (this.trackIndex = 0),
        (this.loop = !1),
        (this.holdPrevious = !1),
        (this.reverse = !1),
        (this.shortestRotation = !1),
        (this.eventThreshold = 0),
        (this.mixAttachmentThreshold = 0),
        (this.alphaAttachmentThreshold = 0),
        (this.mixDrawOrderThreshold = 0),
        (this.animationStart = 0),
        (this.animationEnd = 0),
        (this.animationLast = 0),
        (this.nextAnimationLast = 0),
        (this.delay = 0),
        (this.trackTime = 0),
        (this.trackLast = 0),
        (this.nextTrackLast = 0),
        (this.trackEnd = 0),
        (this.timeScale = 0),
        (this.alpha = 0),
        (this.mixTime = 0),
        (this._mixDuration = 0),
        (this.interruptAlpha = 0),
        (this.totalAlpha = 0),
        (this.mixBlend = B.replace),
        (this.timelineMode = new Array()),
        (this.timelineHoldMix = new Array()),
        (this.timelinesRotation = new Array()));
    }
    return (
      a(e, [
        {
          key: 'setMixDurationWithDelta',
          value: function (e, t) {
            ((this._mixDuration = e),
              null != this.previous &&
                this.delay <= 0 &&
                (this.delay += this.previous.getTrackComplete() - t),
              (this.delay = this.delay));
          },
        },
        {
          key: 'reset',
          value: function () {
            ((this.next = null),
              (this.previous = null),
              (this.mixingFrom = null),
              (this.mixingTo = null),
              (this.animation = null),
              (this.listener = null),
              (this.timelineMode.length = 0),
              (this.timelineHoldMix.length = 0),
              (this.timelinesRotation.length = 0));
          },
        },
        {
          key: 'getAnimationTime',
          value: function () {
            if (this.loop) {
              var e = this.animationEnd - this.animationStart;
              return 0 == e
                ? this.animationStart
                : (this.trackTime % e) + this.animationStart;
            }
            return Math.min(
              this.trackTime + this.animationStart,
              this.animationEnd,
            );
          },
        },
        {
          key: 'setAnimationLast',
          value: function (e) {
            ((this.animationLast = e), (this.nextAnimationLast = e));
          },
        },
        {
          key: 'isComplete',
          value: function () {
            return this.trackTime >= this.animationEnd - this.animationStart;
          },
        },
        {
          key: 'resetRotationDirections',
          value: function () {
            this.timelinesRotation.length = 0;
          },
        },
        {
          key: 'getTrackComplete',
          value: function () {
            var e = this.animationEnd - this.animationStart;
            if (0 != e) {
              if (this.loop) return e * (1 + ((this.trackTime / e) | 0));
              if (this.trackTime < e) return e;
            }
            return this.trackTime;
          },
        },
        {
          key: 'wasApplied',
          value: function () {
            return -1 != this.nextTrackLast;
          },
        },
        {
          key: 'mixDuration',
          get: function () {
            return this._mixDuration;
          },
          set: function (e) {
            this._mixDuration = e;
          },
        },
      ]),
      e
    );
  })(),
  _e = (function () {
    function e(t) {
      (d(this, e),
        (this.objects = []),
        (this.drainDisabled = !1),
        (this.animState = t));
    }
    return (
      a(e, [
        {
          key: 'start',
          value: function (e) {
            (this.objects.push(xe.start),
              this.objects.push(e),
              (this.animState.animationsChanged = !0));
          },
        },
        {
          key: 'interrupt',
          value: function (e) {
            (this.objects.push(xe.interrupt), this.objects.push(e));
          },
        },
        {
          key: 'end',
          value: function (e) {
            (this.objects.push(xe.end),
              this.objects.push(e),
              (this.animState.animationsChanged = !0));
          },
        },
        {
          key: 'dispose',
          value: function (e) {
            (this.objects.push(xe.dispose), this.objects.push(e));
          },
        },
        {
          key: 'complete',
          value: function (e) {
            (this.objects.push(xe.complete), this.objects.push(e));
          },
        },
        {
          key: 'event',
          value: function (e, t) {
            (this.objects.push(xe.event),
              this.objects.push(e),
              this.objects.push(t));
          },
        },
        {
          key: 'drain',
          value: function () {
            if (!this.drainDisabled) {
              this.drainDisabled = !0;
              for (
                var e = this.objects, t = this.animState.listeners, n = 0;
                n < e.length;
                n += 2
              ) {
                var r = e[n],
                  i = e[n + 1];
                switch (r) {
                  case xe.start:
                    i.listener && i.listener.start && i.listener.start(i);
                    for (var o = 0; o < t.length; o++) {
                      var a = t[o];
                      a.start && a.start(i);
                    }
                    break;
                  case xe.interrupt:
                    i.listener &&
                      i.listener.interrupt &&
                      i.listener.interrupt(i);
                    for (var s = 0; s < t.length; s++) {
                      var l = t[s];
                      l.interrupt && l.interrupt(i);
                    }
                    break;
                  case xe.end:
                    i.listener && i.listener.end && i.listener.end(i);
                    for (var c = 0; c < t.length; c++) {
                      var u = t[c];
                      u.end && u.end(i);
                    }
                  case xe.dispose:
                    i.listener && i.listener.dispose && i.listener.dispose(i);
                    for (var f = 0; f < t.length; f++) {
                      var d = t[f];
                      d.dispose && d.dispose(i);
                    }
                    this.animState.trackEntryPool.free(i);
                    break;
                  case xe.complete:
                    i.listener && i.listener.complete && i.listener.complete(i);
                    for (var h = 0; h < t.length; h++) {
                      var p = t[h];
                      p.complete && p.complete(i);
                    }
                    break;
                  case xe.event:
                    var m = e[2 + n++];
                    i.listener && i.listener.event && i.listener.event(i, m);
                    for (var v = 0; v < t.length; v++) {
                      var g = t[v];
                      g.event && g.event(i, m);
                    }
                }
              }
              (this.clear(), (this.drainDisabled = !1));
            }
          },
        },
        {
          key: 'clear',
          value: function () {
            this.objects.length = 0;
          },
        },
      ]),
      e
    );
  })(),
  xe = void 0;
!(function (e) {
  ((e[(e.start = 0)] = 'start'),
    (e[(e.interrupt = 1)] = 'interrupt'),
    (e[(e.end = 2)] = 'end'),
    (e[(e.dispose = 3)] = 'dispose'),
    (e[(e.complete = 4)] = 'complete'),
    (e[(e.event = 5)] = 'event'));
})(xe || (xe = {}));
var ke = (function () {
    function e() {
      d(this, e);
    }
    return (
      a(e, [
        { key: 'start', value: function (e) {} },
        { key: 'interrupt', value: function (e) {} },
        { key: 'end', value: function (e) {} },
        { key: 'dispose', value: function (e) {} },
        { key: 'complete', value: function (e) {} },
        { key: 'event', value: function (e, t) {} },
      ]),
      e
    );
  })(),
  Se = 0,
  Ee = 1,
  Ce = 2,
  Te = 3,
  Ie = 4,
  Me = 1,
  Oe = 2,
  Be = (function () {
    function e(t) {
      if (
        (d(this, e), (this.animationToMixTime = {}), (this.defaultMix = 0), !t)
      )
        throw new Error('skeletonData cannot be null.');
      this.skeletonData = t;
    }
    return (
      a(e, [
        {
          key: 'setMix',
          value: function (e, t, n) {
            var r = this.skeletonData.findAnimation(e);
            if (!r) throw new Error('Animation not found: ' + e);
            var i = this.skeletonData.findAnimation(t);
            if (!i) throw new Error('Animation not found: ' + t);
            this.setMixWith(r, i, n);
          },
        },
        {
          key: 'setMixWith',
          value: function (e, t, n) {
            if (!e) throw new Error('from cannot be null.');
            if (!t) throw new Error('to cannot be null.');
            var r = e.name + '.' + t.name;
            this.animationToMixTime[r] = n;
          },
        },
        {
          key: 'getMix',
          value: function (e, t) {
            var n = e.name + '.' + t.name,
              r = this.animationToMixTime[n];
            return void 0 === r ? this.defaultMix : r;
          },
        },
      ]),
      e
    );
  })(),
  Pe = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return ((n.color = new m(1, 1, 1, 1)), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function () {
            var e = new t(this.name);
            return (this.copyTo(e), e.color.setFromColor(this.color), e);
          },
        },
      ]),
      t
    );
  })(C),
  Le = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (n.endSlot = null),
        (n.color = new m(0.2275, 0.2275, 0.8078, 1)),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function () {
            var e = new t(this.name);
            return (
              this.copyTo(e),
              (e.endSlot = this.endSlot),
              e.color.setFromColor(this.color),
              e
            );
          },
        },
      ]),
      t
    );
  })(C),
  Re = (function () {
    function e(t) {
      (d(this, e), (this._image = t));
    }
    return (
      a(e, [
        {
          key: 'getImage',
          value: function () {
            return this._image;
          },
        },
      ]),
      e
    );
  })(),
  De = void 0;
!(function (e) {
  ((e[(e.Nearest = 9728)] = 'Nearest'),
    (e[(e.Linear = 9729)] = 'Linear'),
    (e[(e.MipMap = 9987)] = 'MipMap'),
    (e[(e.MipMapNearestNearest = 9984)] = 'MipMapNearestNearest'),
    (e[(e.MipMapLinearNearest = 9985)] = 'MipMapLinearNearest'),
    (e[(e.MipMapNearestLinear = 9986)] = 'MipMapNearestLinear'),
    (e[(e.MipMapLinearLinear = 9987)] = 'MipMapLinearLinear'));
})(De || (De = {}));
var Fe = void 0;
!(function (e) {
  ((e[(e.MirroredRepeat = 33648)] = 'MirroredRepeat'),
    (e[(e.ClampToEdge = 33071)] = 'ClampToEdge'),
    (e[(e.Repeat = 10497)] = 'Repeat'));
})(Fe || (Fe = {}));
var je = function e() {
    (d(this, e),
      (this.u = 0),
      (this.v = 0),
      (this.u2 = 0),
      (this.v2 = 0),
      (this.width = 0),
      (this.height = 0),
      (this.degrees = 0),
      (this.offsetX = 0),
      (this.offsetY = 0),
      (this.originalWidth = 0),
      (this.originalHeight = 0));
  },
  Ne = (function (e) {
    function t() {
      return (
        d(this, t),
        u(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments),
        )
      );
    }
    return (
      f(t, e),
      a(t, [
        { key: 'setFilters', value: function (e, t) {} },
        { key: 'setWraps', value: function (e, t) {} },
        { key: 'dispose', value: function () {} },
      ]),
      t
    );
  })(Re),
  ze = (function () {
    function e(t) {
      (d(this, e), (this.pages = new Array()), (this.regions = new Array()));
      for (
        var n = new Ue(t),
          r = new Array(4),
          i = {
            size: function (e) {
              ((e.width = parseInt(r[1])), (e.height = parseInt(r[2])));
            },
            format: function () {},
            filter: function (e) {
              ((e.minFilter = b.enumValue(De, r[1])),
                (e.magFilter = b.enumValue(De, r[2])));
            },
            repeat: function (e) {
              (-1 != r[1].indexOf('x') && (e.uWrap = Fe.Repeat),
                -1 != r[1].indexOf('y') && (e.vWrap = Fe.Repeat));
            },
            pma: function (e) {
              e.pma = 'true' == r[1];
            },
          },
          o = {
            xy: function (e) {
              ((e.x = parseInt(r[1])), (e.y = parseInt(r[2])));
            },
            size: function (e) {
              ((e.width = parseInt(r[1])), (e.height = parseInt(r[2])));
            },
            bounds: function (e) {
              ((e.x = parseInt(r[1])),
                (e.y = parseInt(r[2])),
                (e.width = parseInt(r[3])),
                (e.height = parseInt(r[4])));
            },
            offset: function (e) {
              ((e.offsetX = parseInt(r[1])), (e.offsetY = parseInt(r[2])));
            },
            orig: function (e) {
              ((e.originalWidth = parseInt(r[1])),
                (e.originalHeight = parseInt(r[2])));
            },
            offsets: function (e) {
              ((e.offsetX = parseInt(r[1])),
                (e.offsetY = parseInt(r[2])),
                (e.originalWidth = parseInt(r[3])),
                (e.originalHeight = parseInt(r[4])));
            },
            rotate: function (e) {
              var t = r[1];
              'true' == t
                ? (e.degrees = 90)
                : 'false' != t && (e.degrees = parseInt(t));
            },
            index: function (e) {
              e.index = parseInt(r[1]);
            },
          },
          a = n.readLine();
        a && 0 == a.trim().length;
      )
        a = n.readLine();
      for (; a && 0 != a.trim().length && 0 != n.readEntry(r, a);)
        a = n.readLine();
      for (var s = null, l = null, c = null; null !== a;)
        if (0 == a.trim().length) ((s = null), (a = n.readLine()));
        else if (s) {
          for (var u = new He(s, a); ;) {
            var f = n.readEntry(r, (a = n.readLine()));
            if (0 == f) break;
            var h = o[r[0]];
            if (h) h(u);
            else {
              (l || (l = []), c || (c = []), l.push(r[0]));
              for (var p = [], m = 0; m < f; m++) p.push(parseInt(r[m + 1]));
              c.push(p);
            }
          }
          (0 == u.originalWidth &&
            0 == u.originalHeight &&
            ((u.originalWidth = u.width), (u.originalHeight = u.height)),
            l &&
              l.length > 0 &&
              c &&
              c.length > 0 &&
              ((u.names = l), (u.values = c), (l = null), (c = null)),
            (u.u = u.x / s.width),
            (u.v = u.y / s.height),
            90 == u.degrees
              ? ((u.u2 = (u.x + u.height) / s.width),
                (u.v2 = (u.y + u.width) / s.height))
              : ((u.u2 = (u.x + u.width) / s.width),
                (u.v2 = (u.y + u.height) / s.height)),
            this.regions.push(u));
        } else {
          for (s = new Ge(a.trim()); 0 != n.readEntry(r, (a = n.readLine()));) {
            var v = i[r[0]];
            v && v(s);
          }
          this.pages.push(s);
        }
    }
    return (
      a(e, [
        {
          key: 'findRegion',
          value: function (e) {
            for (var t = 0; t < this.regions.length; t++)
              if (this.regions[t].name == e) return this.regions[t];
            return null;
          },
        },
        {
          key: 'setTextures',
          value: function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : '',
              n = !0,
              r = !1,
              i = void 0;
            try {
              for (
                var o, a = this.pages[Symbol.iterator]();
                !(n = (o = a.next()).done);
                n = !0
              ) {
                var s = o.value;
                s.setTexture(e.get(t + s.name));
              }
            } catch (e) {
              ((r = !0), (i = e));
            } finally {
              try {
                !n && a.return && a.return();
              } finally {
                if (r) throw i;
              }
            }
          },
        },
        {
          key: 'dispose',
          value: function () {
            for (var e = void 0, t = 0; t < this.pages.length; t++)
              null === (e = this.pages[t].texture) ||
                void 0 === e ||
                e.dispose();
          },
        },
      ]),
      e
    );
  })(),
  Ue = (function () {
    function e(t) {
      (d(this, e), (this.index = 0), (this.lines = t.split(/\r\n|\r|\n/)));
    }
    return (
      a(e, [
        {
          key: 'readLine',
          value: function () {
            return this.index >= this.lines.length
              ? null
              : this.lines[this.index++];
          },
        },
        {
          key: 'readEntry',
          value: function (e, t) {
            if (!t) return 0;
            if (0 == (t = t.trim()).length) return 0;
            var n = t.indexOf(':');
            if (-1 == n) return 0;
            e[0] = t.substr(0, n).trim();
            for (var r = 1, i = n + 1; ; r++) {
              var o = t.indexOf(',', i);
              if (-1 == o) return ((e[r] = t.substr(i).trim()), r);
              if (((e[r] = t.substr(i, o - i).trim()), (i = o + 1), 4 == r))
                return 4;
            }
          },
        },
      ]),
      e
    );
  })(),
  Ge = (function () {
    function e(t) {
      (d(this, e),
        (this.minFilter = De.Nearest),
        (this.magFilter = De.Nearest),
        (this.uWrap = Fe.ClampToEdge),
        (this.vWrap = Fe.ClampToEdge),
        (this.texture = null),
        (this.width = 0),
        (this.height = 0),
        (this.pma = !1),
        (this.regions = new Array()),
        (this.name = t));
    }
    return (
      a(e, [
        {
          key: 'setTexture',
          value: function (e) {
            ((this.texture = e),
              e.setFilters(this.minFilter, this.magFilter),
              e.setWraps(this.uWrap, this.vWrap));
            var t = !0,
              n = !1,
              r = void 0;
            try {
              for (
                var i, o = this.regions[Symbol.iterator]();
                !(t = (i = o.next()).done);
                t = !0
              )
                i.value.texture = e;
            } catch (e) {
              ((n = !0), (r = e));
            } finally {
              try {
                !t && o.return && o.return();
              } finally {
                if (n) throw r;
              }
            }
          },
        },
      ]),
      e
    );
  })(),
  He = (function (e) {
    function t(e, n) {
      d(this, t);
      var r = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
      return (
        (r.x = 0),
        (r.y = 0),
        (r.offsetX = 0),
        (r.offsetY = 0),
        (r.originalWidth = 0),
        (r.originalHeight = 0),
        (r.index = 0),
        (r.degrees = 0),
        (r.names = null),
        (r.values = null),
        (r.page = e),
        (r.name = n),
        e.regions.push(r),
        r
      );
    }
    return (f(t, e), t);
  })(je),
  Qe = (function (e) {
    function t(e, n) {
      d(this, t);
      var r = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (r.region = null),
        (r.regionUVs = []),
        (r.uvs = []),
        (r.triangles = []),
        (r.color = new m(1, 1, 1, 1)),
        (r.width = 0),
        (r.height = 0),
        (r.hullLength = 0),
        (r.edges = []),
        (r.parentMesh = null),
        (r.sequence = null),
        (r.tempColor = new m(0, 0, 0, 0)),
        (r.path = n),
        r
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'updateRegion',
          value: function () {
            if (!this.region) throw new Error('Region not set.');
            var e = this.regionUVs;
            (this.uvs && this.uvs.length == e.length) ||
              (this.uvs = b.newFloatArray(e.length));
            var t = this.uvs,
              n = this.uvs.length,
              r = this.region.u,
              i = this.region.v,
              o = 0,
              a = 0;
            if (this.region instanceof He) {
              var s = this.region,
                l = s.page,
                c = l.width,
                u = l.height;
              switch (s.degrees) {
                case 90:
                  ((r -= (s.originalHeight - s.offsetY - s.height) / c),
                    (i -= (s.originalWidth - s.offsetX - s.width) / u),
                    (o = s.originalHeight / c),
                    (a = s.originalWidth / u));
                  for (var f = 0; f < n; f += 2)
                    ((t[f] = r + e[f + 1] * o),
                      (t[f + 1] = i + (1 - e[f]) * a));
                  return;
                case 180:
                  ((r -= (s.originalWidth - s.offsetX - s.width) / c),
                    (i -= s.offsetY / u),
                    (o = s.originalWidth / c),
                    (a = s.originalHeight / u));
                  for (var d = 0; d < n; d += 2)
                    ((t[d] = r + (1 - e[d]) * o),
                      (t[d + 1] = i + (1 - e[d + 1]) * a));
                  return;
                case 270:
                  ((r -= s.offsetY / c),
                    (i -= s.offsetX / u),
                    (o = s.originalHeight / c),
                    (a = s.originalWidth / u));
                  for (var h = 0; h < n; h += 2)
                    ((t[h] = r + (1 - e[h + 1]) * o),
                      (t[h + 1] = i + e[h] * a));
                  return;
              }
              ((r -= s.offsetX / c),
                (i -= (s.originalHeight - s.offsetY - s.height) / u),
                (o = s.originalWidth / c),
                (a = s.originalHeight / u));
            } else
              this.region
                ? ((o = this.region.u2 - r), (a = this.region.v2 - i))
                : ((r = i = 0), (o = a = 1));
            for (var p = 0; p < n; p += 2)
              ((t[p] = r + e[p] * o), (t[p + 1] = i + e[p + 1] * a));
          },
        },
        {
          key: 'getParentMesh',
          value: function () {
            return this.parentMesh;
          },
        },
        {
          key: 'setParentMesh',
          value: function (e) {
            ((this.parentMesh = e),
              e &&
                ((this.bones = e.bones),
                (this.vertices = e.vertices),
                (this.worldVerticesLength = e.worldVerticesLength),
                (this.regionUVs = e.regionUVs),
                (this.triangles = e.triangles),
                (this.hullLength = e.hullLength),
                (this.worldVerticesLength = e.worldVerticesLength)));
          },
        },
        {
          key: 'copy',
          value: function () {
            if (this.parentMesh) return this.newLinkedMesh();
            var e = new t(this.name, this.path);
            return (
              (e.region = this.region),
              e.color.setFromColor(this.color),
              this.copyTo(e),
              (e.regionUVs = new Array(this.regionUVs.length)),
              b.arrayCopy(
                this.regionUVs,
                0,
                e.regionUVs,
                0,
                this.regionUVs.length,
              ),
              (e.uvs = new Array(this.uvs.length)),
              b.arrayCopy(this.uvs, 0, e.uvs, 0, this.uvs.length),
              (e.triangles = new Array(this.triangles.length)),
              b.arrayCopy(
                this.triangles,
                0,
                e.triangles,
                0,
                this.triangles.length,
              ),
              (e.hullLength = this.hullLength),
              (e.sequence =
                null != this.sequence ? this.sequence.copy() : null),
              this.edges &&
                ((e.edges = new Array(this.edges.length)),
                b.arrayCopy(this.edges, 0, e.edges, 0, this.edges.length)),
              (e.width = this.width),
              (e.height = this.height),
              e
            );
          },
        },
        {
          key: 'computeWorldVertices',
          value: function (e, n, r, i, o, a) {
            (null != this.sequence && this.sequence.apply(e, this),
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
                'computeWorldVertices',
                this,
              ).call(this, e, n, r, i, o, a));
          },
        },
        {
          key: 'newLinkedMesh',
          value: function () {
            var e = new t(this.name, this.path);
            return (
              (e.region = this.region),
              e.color.setFromColor(this.color),
              (e.timelineAttachment = this.timelineAttachment),
              e.setParentMesh(this.parentMesh ? this.parentMesh : this),
              null != e.region && e.updateRegion(),
              e
            );
          },
        },
      ]),
      t
    );
  })(C),
  Ve = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (n.lengths = []),
        (n.closed = !1),
        (n.constantSpeed = !1),
        (n.color = new m(1, 1, 1, 1)),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function () {
            var e = new t(this.name);
            return (
              this.copyTo(e),
              (e.lengths = new Array(this.lengths.length)),
              b.arrayCopy(this.lengths, 0, e.lengths, 0, this.lengths.length),
              (e.closed = closed),
              (e.constantSpeed = this.constantSpeed),
              e.color.setFromColor(this.color),
              e
            );
          },
        },
      ]),
      t
    );
  })(C),
  qe = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (n.x = 0),
        (n.y = 0),
        (n.rotation = 0),
        (n.color = new m(0.38, 0.94, 0, 1)),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'computeWorldPosition',
          value: function (e, t) {
            return (
              (t.x = this.x * e.a + this.y * e.b + e.worldX),
              (t.y = this.x * e.c + this.y * e.d + e.worldY),
              t
            );
          },
        },
        {
          key: 'computeWorldRotation',
          value: function (e) {
            var t = this.rotation * v.degRad,
              n = Math.cos(t),
              r = Math.sin(t),
              i = n * e.a + r * e.b,
              o = n * e.c + r * e.d;
            return v.atan2Deg(o, i);
          },
        },
        {
          key: 'copy',
          value: function () {
            var e = new t(this.name);
            return (
              (e.x = this.x),
              (e.y = this.y),
              (e.rotation = this.rotation),
              e.color.setFromColor(this.color),
              e
            );
          },
        },
      ]),
      t
    );
  })(C),
  We = (function (e) {
    function t(e, n) {
      d(this, t);
      var r = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (r.x = 0),
        (r.y = 0),
        (r.scaleX = 1),
        (r.scaleY = 1),
        (r.rotation = 0),
        (r.width = 0),
        (r.height = 0),
        (r.color = new m(1, 1, 1, 1)),
        (r.region = null),
        (r.sequence = null),
        (r.offset = b.newFloatArray(8)),
        (r.uvs = b.newFloatArray(8)),
        (r.tempColor = new m(1, 1, 1, 1)),
        (r.path = n),
        r
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'updateRegion',
          value: function () {
            if (!this.region) throw new Error('Region not set.');
            var e = this.region,
              t = this.uvs;
            if (null == e)
              return (
                (t[0] = 0),
                (t[1] = 0),
                (t[2] = 0),
                (t[3] = 1),
                (t[4] = 1),
                (t[5] = 1),
                (t[6] = 1),
                void (t[7] = 0)
              );
            var n = (this.width / this.region.originalWidth) * this.scaleX,
              r = (this.height / this.region.originalHeight) * this.scaleY,
              i = (-this.width / 2) * this.scaleX + this.region.offsetX * n,
              o = (-this.height / 2) * this.scaleY + this.region.offsetY * r,
              a = i + this.region.width * n,
              s = o + this.region.height * r,
              l = this.rotation * v.degRad,
              c = Math.cos(l),
              u = Math.sin(l),
              f = this.x,
              d = this.y,
              h = i * c + f,
              p = i * u,
              m = o * c + d,
              g = o * u,
              y = a * c + f,
              A = a * u,
              b = s * c + d,
              w = s * u,
              _ = this.offset;
            ((_[0] = h - g),
              (_[1] = m + p),
              (_[2] = h - w),
              (_[3] = b + p),
              (_[4] = y - w),
              (_[5] = b + A),
              (_[6] = y - g),
              (_[7] = m + A),
              90 == e.degrees
                ? ((t[0] = e.u2),
                  (t[1] = e.v2),
                  (t[2] = e.u),
                  (t[3] = e.v2),
                  (t[4] = e.u),
                  (t[5] = e.v),
                  (t[6] = e.u2),
                  (t[7] = e.v))
                : ((t[0] = e.u),
                  (t[1] = e.v2),
                  (t[2] = e.u),
                  (t[3] = e.v),
                  (t[4] = e.u2),
                  (t[5] = e.v),
                  (t[6] = e.u2),
                  (t[7] = e.v2)));
          },
        },
        {
          key: 'computeWorldVertices',
          value: function (e, t, n, r) {
            null != this.sequence && this.sequence.apply(e, this);
            var i = e.bone,
              o = this.offset,
              a = i.worldX,
              s = i.worldY,
              l = i.a,
              c = i.b,
              u = i.c,
              f = i.d,
              d = 0,
              h = 0;
            ((d = o[0]),
              (h = o[1]),
              (t[n] = d * l + h * c + a),
              (t[n + 1] = d * u + h * f + s),
              (n += r),
              (d = o[2]),
              (h = o[3]),
              (t[n] = d * l + h * c + a),
              (t[n + 1] = d * u + h * f + s),
              (n += r),
              (d = o[4]),
              (h = o[5]),
              (t[n] = d * l + h * c + a),
              (t[n + 1] = d * u + h * f + s),
              (n += r),
              (d = o[6]),
              (h = o[7]),
              (t[n] = d * l + h * c + a),
              (t[n + 1] = d * u + h * f + s));
          },
        },
        {
          key: 'copy',
          value: function () {
            var e = new t(this.name, this.path);
            return (
              (e.region = this.region),
              (e.x = this.x),
              (e.y = this.y),
              (e.scaleX = this.scaleX),
              (e.scaleY = this.scaleY),
              (e.rotation = this.rotation),
              (e.width = this.width),
              (e.height = this.height),
              b.arrayCopy(this.uvs, 0, e.uvs, 0, 8),
              b.arrayCopy(this.offset, 0, e.offset, 0, 8),
              e.color.setFromColor(this.color),
              (e.sequence =
                null != this.sequence ? this.sequence.copy() : null),
              e
            );
          },
        },
      ]),
      t
    );
  })(E);
((We.X1 = 0),
  (We.Y1 = 1),
  (We.C1R = 2),
  (We.C1G = 3),
  (We.C1B = 4),
  (We.C1A = 5),
  (We.U1 = 6),
  (We.V1 = 7),
  (We.X2 = 8),
  (We.Y2 = 9),
  (We.C2R = 10),
  (We.C2G = 11),
  (We.C2B = 12),
  (We.C2A = 13),
  (We.U2 = 14),
  (We.V2 = 15),
  (We.X3 = 16),
  (We.Y3 = 17),
  (We.C3R = 18),
  (We.C3G = 19),
  (We.C3B = 20),
  (We.C3A = 21),
  (We.U3 = 22),
  (We.V3 = 23),
  (We.X4 = 24),
  (We.Y4 = 25),
  (We.C4R = 26),
  (We.C4G = 27),
  (We.C4B = 28),
  (We.C4A = 29),
  (We.U4 = 30),
  (We.V4 = 31));
var Ye = (function () {
    function e(t) {
      (d(this, e), (this.atlas = t));
    }
    return (
      a(e, [
        {
          key: 'loadSequence',
          value: function (e, t, n) {
            for (var r = n.regions, i = 0, o = r.length; i < o; i++) {
              var a = n.getPath(t, i),
                s = this.atlas.findRegion(a);
              if (null == s)
                throw new Error(
                  'Region not found in atlas: ' + a + ' (sequence: ' + e + ')',
                );
              r[i] = s;
            }
          },
        },
        {
          key: 'newRegionAttachment',
          value: function (e, t, n, r) {
            var i = new We(t, n);
            if (null != r) this.loadSequence(t, n, r);
            else {
              var o = this.atlas.findRegion(n);
              if (!o)
                throw new Error(
                  'Region not found in atlas: ' +
                    n +
                    ' (region attachment: ' +
                    t +
                    ')',
                );
              i.region = o;
            }
            return i;
          },
        },
        {
          key: 'newMeshAttachment',
          value: function (e, t, n, r) {
            var i = new Qe(t, n);
            if (null != r) this.loadSequence(t, n, r);
            else {
              var o = this.atlas.findRegion(n);
              if (!o)
                throw new Error(
                  'Region not found in atlas: ' +
                    n +
                    ' (mesh attachment: ' +
                    t +
                    ')',
                );
              i.region = o;
            }
            return i;
          },
        },
        {
          key: 'newBoundingBoxAttachment',
          value: function (e, t) {
            return new Pe(t);
          },
        },
        {
          key: 'newPathAttachment',
          value: function (e, t) {
            return new Ve(t);
          },
        },
        {
          key: 'newPointAttachment',
          value: function (e, t) {
            return new qe(t);
          },
        },
        {
          key: 'newClippingAttachment',
          value: function (e, t) {
            return new Le(t);
          },
        },
      ]),
      e
    );
  })(),
  Xe = function e(t, n, r) {
    if (
      (d(this, e),
      (this.index = 0),
      (this.parent = null),
      (this.length = 0),
      (this.x = 0),
      (this.y = 0),
      (this.rotation = 0),
      (this.scaleX = 1),
      (this.scaleY = 1),
      (this.shearX = 0),
      (this.shearY = 0),
      (this.inherit = Je.Normal),
      (this.skinRequired = !1),
      (this.color = new m()),
      (this.visible = !1),
      t < 0)
    )
      throw new Error('index must be >= 0.');
    if (!n) throw new Error('name cannot be null.');
    ((this.index = t), (this.name = n), (this.parent = r));
  },
  Je = void 0;
!(function (e) {
  ((e[(e.Normal = 0)] = 'Normal'),
    (e[(e.OnlyTranslation = 1)] = 'OnlyTranslation'),
    (e[(e.NoRotationOrReflection = 2)] = 'NoRotationOrReflection'),
    (e[(e.NoScale = 3)] = 'NoScale'),
    (e[(e.NoScaleOrReflection = 4)] = 'NoScaleOrReflection'));
})(Je || (Je = {}));
var Ke = (function () {
    function e(t, n, r) {
      if (
        (d(this, e),
        (this.parent = null),
        (this.children = new Array()),
        (this.x = 0),
        (this.y = 0),
        (this.rotation = 0),
        (this.scaleX = 0),
        (this.scaleY = 0),
        (this.shearX = 0),
        (this.shearY = 0),
        (this.ax = 0),
        (this.ay = 0),
        (this.arotation = 0),
        (this.ascaleX = 0),
        (this.ascaleY = 0),
        (this.ashearX = 0),
        (this.ashearY = 0),
        (this.a = 0),
        (this.b = 0),
        (this.c = 0),
        (this.d = 0),
        (this.worldY = 0),
        (this.worldX = 0),
        (this.inherit = Je.Normal),
        (this.sorted = !1),
        (this.active = !1),
        !t)
      )
        throw new Error('data cannot be null.');
      if (!n) throw new Error('skeleton cannot be null.');
      ((this.data = t),
        (this.skeleton = n),
        (this.parent = r),
        this.setToSetupPose());
    }
    return (
      a(e, [
        {
          key: 'isActive',
          value: function () {
            return this.active;
          },
        },
        {
          key: 'update',
          value: function (e) {
            this.updateWorldTransformWith(
              this.ax,
              this.ay,
              this.arotation,
              this.ascaleX,
              this.ascaleY,
              this.ashearX,
              this.ashearY,
            );
          },
        },
        {
          key: 'updateWorldTransform',
          value: function () {
            this.updateWorldTransformWith(
              this.x,
              this.y,
              this.rotation,
              this.scaleX,
              this.scaleY,
              this.shearX,
              this.shearY,
            );
          },
        },
        {
          key: 'updateWorldTransformWith',
          value: function (e, t, n, r, i, o, a) {
            ((this.ax = e),
              (this.ay = t),
              (this.arotation = n),
              (this.ascaleX = r),
              (this.ascaleY = i),
              (this.ashearX = o),
              (this.ashearY = a));
            var s = this.parent;
            if (!s) {
              var l = this.skeleton,
                c = l.scaleX,
                u = l.scaleY,
                f = (n + o) * v.degRad,
                d = (n + 90 + a) * v.degRad;
              return (
                (this.a = Math.cos(f) * r * c),
                (this.b = Math.cos(d) * i * c),
                (this.c = Math.sin(f) * r * u),
                (this.d = Math.sin(d) * i * u),
                (this.worldX = e * c + l.x),
                void (this.worldY = t * u + l.y)
              );
            }
            var h = s.a,
              p = s.b,
              m = s.c,
              g = s.d;
            switch (
              ((this.worldX = h * e + p * t + s.worldX),
              (this.worldY = m * e + g * t + s.worldY),
              this.inherit)
            ) {
              case Je.Normal:
                var y = (n + o) * v.degRad,
                  A = (n + 90 + a) * v.degRad,
                  b = Math.cos(y) * r,
                  w = Math.cos(A) * i,
                  _ = Math.sin(y) * r,
                  x = Math.sin(A) * i;
                return (
                  (this.a = h * b + p * _),
                  (this.b = h * w + p * x),
                  (this.c = m * b + g * _),
                  void (this.d = m * w + g * x)
                );
              case Je.OnlyTranslation:
                var k = (n + o) * v.degRad,
                  S = (n + 90 + a) * v.degRad;
                ((this.a = Math.cos(k) * r),
                  (this.b = Math.cos(S) * i),
                  (this.c = Math.sin(k) * r),
                  (this.d = Math.sin(S) * i));
                break;
              case Je.NoRotationOrReflection:
                var E = h * h + m * m,
                  C = 0;
                E > 1e-4
                  ? ((E = Math.abs(h * g - p * m) / E),
                    (h /= this.skeleton.scaleX),
                    (p = (m /= this.skeleton.scaleY) * E),
                    (g = h * E),
                    (C = Math.atan2(m, h) * v.radDeg))
                  : ((h = 0), (m = 0), (C = 90 - Math.atan2(g, p) * v.radDeg));
                var T = (n + o - C) * v.degRad,
                  I = (n + a - C + 90) * v.degRad,
                  M = Math.cos(T) * r,
                  O = Math.cos(I) * i,
                  B = Math.sin(T) * r,
                  P = Math.sin(I) * i;
                ((this.a = h * M - p * B),
                  (this.b = h * O - p * P),
                  (this.c = m * M + g * B),
                  (this.d = m * O + g * P));
                break;
              case Je.NoScale:
              case Je.NoScaleOrReflection:
                n *= v.degRad;
                var L = Math.cos(n),
                  R = Math.sin(n),
                  D = (h * L + p * R) / this.skeleton.scaleX,
                  F = (m * L + g * R) / this.skeleton.scaleY,
                  j = Math.sqrt(D * D + F * F);
                (j > 1e-5 && (j = 1 / j),
                  (D *= j),
                  (F *= j),
                  (j = Math.sqrt(D * D + F * F)),
                  this.inherit == Je.NoScale &&
                    h * g - p * m < 0 !=
                      (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0) &&
                    (j = -j),
                  (n = Math.PI / 2 + Math.atan2(F, D)));
                var N = Math.cos(n) * j,
                  z = Math.sin(n) * j;
                ((o *= v.degRad), (a = (90 + a) * v.degRad));
                var U = Math.cos(o) * r,
                  G = Math.cos(a) * i,
                  H = Math.sin(o) * r,
                  Q = Math.sin(a) * i;
                ((this.a = D * U + N * H),
                  (this.b = D * G + N * Q),
                  (this.c = F * U + z * H),
                  (this.d = F * G + z * Q));
            }
            ((this.a *= this.skeleton.scaleX),
              (this.b *= this.skeleton.scaleX),
              (this.c *= this.skeleton.scaleY),
              (this.d *= this.skeleton.scaleY));
          },
        },
        {
          key: 'setToSetupPose',
          value: function () {
            var e = this.data;
            ((this.x = e.x),
              (this.y = e.y),
              (this.rotation = e.rotation),
              (this.scaleX = e.scaleX),
              (this.scaleY = e.scaleY),
              (this.shearX = e.shearX),
              (this.shearY = e.shearY),
              (this.inherit = e.inherit));
          },
        },
        {
          key: 'updateAppliedTransform',
          value: function () {
            var e = this.parent;
            if (!e)
              return (
                (this.ax = this.worldX - this.skeleton.x),
                (this.ay = this.worldY - this.skeleton.y),
                (this.arotation = Math.atan2(this.c, this.a) * v.radDeg),
                (this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c)),
                (this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d)),
                (this.ashearX = 0),
                void (this.ashearY =
                  Math.atan2(
                    this.a * this.b + this.c * this.d,
                    this.a * this.d - this.b * this.c,
                  ) * v.radDeg)
              );
            var t = e.a,
              n = e.b,
              r = e.c,
              i = e.d,
              o = 1 / (t * i - n * r),
              a = i * o,
              s = n * o,
              l = r * o,
              c = t * o,
              u = this.worldX - e.worldX,
              f = this.worldY - e.worldY;
            ((this.ax = u * a - f * s), (this.ay = f * c - u * l));
            var d = void 0,
              h = void 0,
              p = void 0,
              m = void 0;
            if (this.inherit == Je.OnlyTranslation)
              ((d = this.a), (h = this.b), (p = this.c), (m = this.d));
            else {
              switch (this.inherit) {
                case Je.NoRotationOrReflection:
                  var g = Math.abs(t * i - n * r) / (t * t + r * r),
                    y = t / this.skeleton.scaleX;
                  ((n = (-r / this.skeleton.scaleY) * g * this.skeleton.scaleX),
                    (a =
                      (i = y * g * this.skeleton.scaleY) *
                      (o = 1 / (t * i - n * r))),
                    (s = n * o));
                  break;
                case Je.NoScale:
                case Je.NoScaleOrReflection:
                  var A = v.cosDeg(this.rotation),
                    b = v.sinDeg(this.rotation);
                  ((t = (t * A + n * b) / this.skeleton.scaleX),
                    (r = (r * A + i * b) / this.skeleton.scaleY));
                  var w = Math.sqrt(t * t + r * r);
                  (w > 1e-5 && (w = 1 / w),
                    (t *= w),
                    (r *= w),
                    (w = Math.sqrt(t * t + r * r)),
                    this.inherit == Je.NoScale &&
                      o < 0 !=
                        (this.skeleton.scaleX < 0 !=
                          this.skeleton.scaleY < 0) &&
                      (w = -w));
                  var _ = v.PI / 2 + Math.atan2(r, t);
                  ((n = Math.cos(_) * w),
                    (a = (i = Math.sin(_) * w) * (o = 1 / (t * i - n * r))),
                    (s = n * o),
                    (l = r * o),
                    (c = t * o));
              }
              ((d = a * this.a - s * this.c),
                (h = a * this.b - s * this.d),
                (p = c * this.c - l * this.a),
                (m = c * this.d - l * this.b));
            }
            if (
              ((this.ashearX = 0),
              (this.ascaleX = Math.sqrt(d * d + p * p)),
              this.ascaleX > 1e-4)
            ) {
              var x = d * m - h * p;
              ((this.ascaleY = x / this.ascaleX),
                (this.ashearY = -Math.atan2(d * h + p * m, x) * v.radDeg),
                (this.arotation = Math.atan2(p, d) * v.radDeg));
            } else
              ((this.ascaleX = 0),
                (this.ascaleY = Math.sqrt(h * h + m * m)),
                (this.ashearY = 0),
                (this.arotation = 90 - Math.atan2(m, h) * v.radDeg));
          },
        },
        {
          key: 'getWorldRotationX',
          value: function () {
            return Math.atan2(this.c, this.a) * v.radDeg;
          },
        },
        {
          key: 'getWorldRotationY',
          value: function () {
            return Math.atan2(this.d, this.b) * v.radDeg;
          },
        },
        {
          key: 'getWorldScaleX',
          value: function () {
            return Math.sqrt(this.a * this.a + this.c * this.c);
          },
        },
        {
          key: 'getWorldScaleY',
          value: function () {
            return Math.sqrt(this.b * this.b + this.d * this.d);
          },
        },
        {
          key: 'worldToLocal',
          value: function (e) {
            var t = 1 / (this.a * this.d - this.b * this.c),
              n = e.x - this.worldX,
              r = e.y - this.worldY;
            return (
              (e.x = n * this.d * t - r * this.b * t),
              (e.y = r * this.a * t - n * this.c * t),
              e
            );
          },
        },
        {
          key: 'localToWorld',
          value: function (e) {
            var t = e.x,
              n = e.y;
            return (
              (e.x = t * this.a + n * this.b + this.worldX),
              (e.y = t * this.c + n * this.d + this.worldY),
              e
            );
          },
        },
        {
          key: 'worldToParent',
          value: function (e) {
            if (null == e) throw new Error('world cannot be null.');
            return null == this.parent ? e : this.parent.worldToLocal(e);
          },
        },
        {
          key: 'parentToWorld',
          value: function (e) {
            if (null == e) throw new Error('world cannot be null.');
            return null == this.parent ? e : this.parent.localToWorld(e);
          },
        },
        {
          key: 'worldToLocalRotation',
          value: function (e) {
            var t = v.sinDeg(e),
              n = v.cosDeg(e);
            return (
              Math.atan2(this.a * t - this.c * n, this.d * n - this.b * t) *
                v.radDeg +
              this.rotation -
              this.shearX
            );
          },
        },
        {
          key: 'localToWorldRotation',
          value: function (e) {
            e -= this.rotation - this.shearX;
            var t = v.sinDeg(e),
              n = v.cosDeg(e);
            return (
              Math.atan2(n * this.c + t * this.d, n * this.a + t * this.b) *
              v.radDeg
            );
          },
        },
        {
          key: 'rotateWorld',
          value: function (e) {
            e *= v.degRad;
            var t = Math.sin(e),
              n = Math.cos(e),
              r = this.a,
              i = this.b;
            ((this.a = n * r - t * this.c),
              (this.b = n * i - t * this.d),
              (this.c = t * r + n * this.c),
              (this.d = t * i + n * this.d));
          },
        },
        {
          key: 'getWorldScale',
          value: function () {
            var e = this.scaleX,
              t = this.scaleY;
            if (this.parent) {
              var n = this.parent.getWorldScale();
              ((e *= n.x), (t *= n.y));
            }
            return { x: e, y: t };
          },
        },
      ]),
      e
    );
  })(),
  $e = function e(t, n, r) {
    (d(this, e), (this.name = t), (this.order = n), (this.skinRequired = r));
  },
  Ze = (function () {
    function e(t) {
      var n =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
        r =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : new et();
      (d(this, e),
        (this.pathPrefix = ''),
        (this.assets = {}),
        (this.errors = {}),
        (this.toLoad = 0),
        (this.loaded = 0),
        (this.textureLoader = t),
        (this.pathPrefix = n),
        (this.downloader = r));
    }
    return (
      a(e, [
        {
          key: 'start',
          value: function (e) {
            return (this.toLoad++, this.pathPrefix + e);
          },
        },
        {
          key: 'success',
          value: function (e, t, n) {
            (this.toLoad--, this.loaded++, (this.assets[t] = n), e && e(t, n));
          },
        },
        {
          key: 'error',
          value: function (e, t, n) {
            (this.toLoad--, this.loaded++, (this.errors[t] = n), e && e(t, n));
          },
        },
        {
          key: 'loadAll',
          value: function () {
            var e = this;
            return new Promise(function (t, n) {
              requestAnimationFrame(function r() {
                e.isLoadingComplete()
                  ? e.hasErrors()
                    ? n(e.errors)
                    : t(e)
                  : requestAnimationFrame(r);
              });
            });
          },
        },
        {
          key: 'setRawDataURI',
          value: function (e, t) {
            this.downloader.rawDataUris[this.pathPrefix + e] = t;
          },
        },
        {
          key: 'loadBinary',
          value: function (e) {
            var t = this,
              n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : function () {},
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : function () {};
            ((e = this.start(e)),
              this.downloader.downloadBinary(
                e,
                function (r) {
                  t.success(n, e, r);
                },
                function (n, i) {
                  t.error(
                    r,
                    e,
                    "Couldn't load binary " + e + ': status ' + n + ', ' + i,
                  );
                },
              ));
          },
        },
        {
          key: 'loadText',
          value: function (e) {
            var t = this,
              n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : function () {},
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : function () {};
            ((e = this.start(e)),
              this.downloader.downloadText(
                e,
                function (r) {
                  t.success(n, e, r);
                },
                function (n, i) {
                  t.error(
                    r,
                    e,
                    "Couldn't load text " + e + ': status ' + n + ', ' + i,
                  );
                },
              ));
          },
        },
        {
          key: 'loadJson',
          value: function (e) {
            var t = this,
              n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : function () {},
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : function () {};
            ((e = this.start(e)),
              this.downloader.downloadJson(
                e,
                function (r) {
                  t.success(n, e, r);
                },
                function (n, i) {
                  t.error(
                    r,
                    e,
                    "Couldn't load JSON " + e + ': status ' + n + ', ' + i,
                  );
                },
              ));
          },
        },
        {
          key: 'loadTexture',
          value: function (e) {
            var t = this,
              n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : function () {},
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : function () {};
            if (
              ((e = this.start(e)),
              'undefined' != typeof window &&
                'undefined' != typeof navigator &&
                window.document)
            ) {
              var i = new Image();
              ((i.crossOrigin = 'anonymous'),
                (i.onload = function () {
                  t.success(n, e, t.textureLoader(i));
                }),
                (i.onerror = function () {
                  t.error(r, e, "Couldn't load image: " + e);
                }),
                this.downloader.rawDataUris[e] &&
                  (e = this.downloader.rawDataUris[e]),
                (i.src = e));
            } else
              fetch(e, { mode: 'cors' })
                .then(function (n) {
                  return n.ok
                    ? n.blob()
                    : (t.error(r, e, "Couldn't load image: " + e), null);
                })
                .then(function (e) {
                  return e
                    ? createImageBitmap(e, {
                        premultiplyAlpha: 'none',
                        colorSpaceConversion: 'none',
                      })
                    : null;
                })
                .then(function (r) {
                  r && t.success(n, e, t.textureLoader(r));
                });
          },
        },
        {
          key: 'loadTextureAtlas',
          value: function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : function () {},
              n = this,
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : function () {},
              i = arguments[3],
              o = e.lastIndexOf('/'),
              a = o >= 0 ? e.substring(0, o + 1) : '';
            ((e = this.start(e)),
              this.downloader.downloadText(
                e,
                function (o) {
                  try {
                    !(function () {
                      var s = new ze(o),
                        l = s.pages.length,
                        c = !1,
                        u = !0,
                        f = !1,
                        d = void 0;
                      try {
                        for (
                          var h,
                            p = function () {
                              var o = h.value;
                              n.loadTexture(
                                i ? i[o.name] : a + o.name,
                                function (r, i) {
                                  c ||
                                    (o.setTexture(i),
                                    0 == --l && n.success(t, e, s));
                                },
                                function (t, i) {
                                  (c ||
                                    n.error(
                                      r,
                                      e,
                                      "Couldn't load texture atlas " +
                                        e +
                                        ' page image: ' +
                                        t,
                                    ),
                                    (c = !0));
                                },
                              );
                            },
                            m = s.pages[Symbol.iterator]();
                          !(u = (h = m.next()).done);
                          u = !0
                        )
                          p();
                      } catch (e) {
                        ((f = !0), (d = e));
                      } finally {
                        try {
                          !u && m.return && m.return();
                        } finally {
                          if (f) throw d;
                        }
                      }
                    })();
                  } catch (t) {
                    n.error(
                      r,
                      e,
                      "Couldn't parse texture atlas " + e + ': ' + t.message,
                    );
                  }
                },
                function (t, i) {
                  n.error(
                    r,
                    e,
                    "Couldn't load texture atlas " +
                      e +
                      ': status ' +
                      t +
                      ', ' +
                      i,
                  );
                },
              ));
          },
        },
        {
          key: 'get',
          value: function (e) {
            return this.assets[this.pathPrefix + e];
          },
        },
        {
          key: 'require',
          value: function (e) {
            e = this.pathPrefix + e;
            var t = this.assets[e];
            if (t) return t;
            var n = this.errors[e];
            throw Error('Asset not found: ' + e + (n ? '\n' + n : ''));
          },
        },
        {
          key: 'remove',
          value: function (e) {
            e = this.pathPrefix + e;
            var t = this.assets[e];
            return (t.dispose && t.dispose(), delete this.assets[e], t);
          },
        },
        {
          key: 'removeAll',
          value: function () {
            for (var e in this.assets) {
              var t = this.assets[e];
              t.dispose && t.dispose();
            }
            this.assets = {};
          },
        },
        {
          key: 'isLoadingComplete',
          value: function () {
            return 0 == this.toLoad;
          },
        },
        {
          key: 'getToLoad',
          value: function () {
            return this.toLoad;
          },
        },
        {
          key: 'getLoaded',
          value: function () {
            return this.loaded;
          },
        },
        {
          key: 'dispose',
          value: function () {
            this.removeAll();
          },
        },
        {
          key: 'hasErrors',
          value: function () {
            return Object.keys(this.errors).length > 0;
          },
        },
        {
          key: 'getErrors',
          value: function () {
            return this.errors;
          },
        },
      ]),
      e
    );
  })(),
  et = (function () {
    function e() {
      (d(this, e), (this.callbacks = {}), (this.rawDataUris = {}));
    }
    return (
      a(e, [
        {
          key: 'dataUriToString',
          value: function (e) {
            if (!e.startsWith('data:')) throw new Error('Not a data URI.');
            var t = e.indexOf('base64,');
            return -1 != t
              ? ((t += 7), atob(e.substr(t)))
              : e.substr(e.indexOf(',') + 1);
          },
        },
        {
          key: 'base64ToUint8Array',
          value: function (e) {
            for (
              var t = window.atob(e),
                n = t.length,
                r = new Uint8Array(n),
                i = 0;
              i < n;
              i++
            )
              r[i] = t.charCodeAt(i);
            return r;
          },
        },
        {
          key: 'dataUriToUint8Array',
          value: function (e) {
            if (!e.startsWith('data:')) throw new Error('Not a data URI.');
            var t = e.indexOf('base64,');
            if (-1 == t) throw new Error('Not a binary data URI.');
            return ((t += 7), this.base64ToUint8Array(e.substr(t)));
          },
        },
        {
          key: 'downloadText',
          value: function (e, t, n) {
            var r = this;
            if (!this.start(e, t, n))
              if (this.rawDataUris[e])
                try {
                  var i = this.rawDataUris[e];
                  this.finish(e, 200, this.dataUriToString(i));
                } catch (t) {
                  this.finish(e, 400, JSON.stringify(t));
                }
              else {
                var o = new XMLHttpRequest();
                (o.overrideMimeType('text/html'), o.open('GET', e, !0));
                var a = function () {
                  r.finish(e, o.status, o.responseText);
                };
                ((o.onload = a), (o.onerror = a), o.send());
              }
          },
        },
        {
          key: 'downloadJson',
          value: function (e, t, n) {
            this.downloadText(
              e,
              function (e) {
                t(JSON.parse(e));
              },
              n,
            );
          },
        },
        {
          key: 'downloadBinary',
          value: function (e, t, n) {
            var r = this;
            if (!this.start(e, t, n))
              if (this.rawDataUris[e])
                try {
                  var i = this.rawDataUris[e];
                  this.finish(e, 200, this.dataUriToUint8Array(i));
                } catch (t) {
                  this.finish(e, 400, JSON.stringify(t));
                }
              else {
                var o = new XMLHttpRequest();
                (o.open('GET', e, !0), (o.responseType = 'arraybuffer'));
                var a = function () {
                  r.finish(e, o.status, o.response);
                };
                ((o.onload = function () {
                  200 == o.status || 0 == o.status
                    ? r.finish(e, 200, new Uint8Array(o.response))
                    : a();
                }),
                  (o.onerror = a),
                  o.send());
              }
          },
        },
        {
          key: 'start',
          value: function (e, t, n) {
            var r = this.callbacks[e];
            try {
              if (r) return !0;
              this.callbacks[e] = r = [];
            } finally {
              r.push(t, n);
            }
          },
        },
        {
          key: 'finish',
          value: function (e, t, n) {
            var r = this.callbacks[e];
            delete this.callbacks[e];
            for (
              var i = 200 == t || 0 == t ? [n] : [t, n],
                o = i.length - 1,
                a = r.length;
              o < a;
              o += 2
            )
              r[o].apply(null, i);
          },
        },
      ]),
      e
    );
  })(),
  tt = function e(t, n) {
    if (
      (d(this, e),
      (this.intValue = 0),
      (this.floatValue = 0),
      (this.stringValue = null),
      (this.time = 0),
      (this.volume = 0),
      (this.balance = 0),
      !n)
    )
      throw new Error('data cannot be null.');
    ((this.time = t), (this.data = n));
  },
  nt = function e(t) {
    (d(this, e),
      (this.intValue = 0),
      (this.floatValue = 0),
      (this.stringValue = null),
      (this.audioPath = null),
      (this.volume = 0),
      (this.balance = 0),
      (this.name = t));
  },
  rt = (function () {
    function e(t, n) {
      if (
        (d(this, e),
        (this.bendDirection = 0),
        (this.compress = !1),
        (this.stretch = !1),
        (this.mix = 1),
        (this.softness = 0),
        (this.active = !1),
        !t)
      )
        throw new Error('data cannot be null.');
      if (!n) throw new Error('skeleton cannot be null.');
      ((this.data = t), (this.bones = new Array()));
      for (var r = 0; r < t.bones.length; r++) {
        var i = n.findBone(t.bones[r].name);
        if (!i) throw new Error("Couldn't find bone " + t.bones[r].name);
        this.bones.push(i);
      }
      var o = n.findBone(t.target.name);
      if (!o) throw new Error("Couldn't find bone " + t.target.name);
      ((this.target = o),
        (this.mix = t.mix),
        (this.softness = t.softness),
        (this.bendDirection = t.bendDirection),
        (this.compress = t.compress),
        (this.stretch = t.stretch));
    }
    return (
      a(e, [
        {
          key: 'isActive',
          value: function () {
            return this.active;
          },
        },
        {
          key: 'setToSetupPose',
          value: function () {
            var e = this.data;
            ((this.mix = e.mix),
              (this.softness = e.softness),
              (this.bendDirection = e.bendDirection),
              (this.compress = e.compress),
              (this.stretch = e.stretch));
          },
        },
        {
          key: 'update',
          value: function (e) {
            if (0 != this.mix) {
              var t = this.target,
                n = this.bones;
              switch (n.length) {
                case 1:
                  this.apply1(
                    n[0],
                    t.worldX,
                    t.worldY,
                    this.compress,
                    this.stretch,
                    this.data.uniform,
                    this.mix,
                  );
                  break;
                case 2:
                  this.apply2(
                    n[0],
                    n[1],
                    t.worldX,
                    t.worldY,
                    this.bendDirection,
                    this.stretch,
                    this.data.uniform,
                    this.softness,
                    this.mix,
                  );
              }
            }
          },
        },
        {
          key: 'apply1',
          value: function (e, t, n, r, i, o, a) {
            var s = e.parent;
            if (!s) throw new Error('IK bone must have parent.');
            var l = s.a,
              c = s.b,
              u = s.c,
              f = s.d,
              d = -e.ashearX - e.arotation,
              h = 0,
              p = 0;
            switch (e.inherit) {
              case Je.OnlyTranslation:
                ((h = (t - e.worldX) * v.signum(e.skeleton.scaleX)),
                  (p = (n - e.worldY) * v.signum(e.skeleton.scaleY)));
                break;
              case Je.NoRotationOrReflection:
                var m = Math.abs(l * f - c * u) / Math.max(1e-4, l * l + u * u),
                  g = l / e.skeleton.scaleX,
                  y = u / e.skeleton.scaleY;
                ((c = -y * m * e.skeleton.scaleX),
                  (f = g * m * e.skeleton.scaleY),
                  (d += Math.atan2(y, g) * v.radDeg));
              default:
                var A = t - s.worldX,
                  b = n - s.worldY,
                  w = l * f - c * u;
                Math.abs(w) <= 1e-4
                  ? ((h = 0), (p = 0))
                  : ((h = (A * f - b * c) / w - e.ax),
                    (p = (b * l - A * u) / w - e.ay));
            }
            ((d += Math.atan2(p, h) * v.radDeg),
              e.ascaleX < 0 && (d += 180),
              d > 180 ? (d -= 360) : d < -180 && (d += 360));
            var _ = e.ascaleX,
              x = e.ascaleY;
            if (r || i) {
              switch (e.inherit) {
                case Je.NoScale:
                case Je.NoScaleOrReflection:
                  ((h = t - e.worldX), (p = n - e.worldY));
              }
              var k = e.data.length * _;
              if (k > 1e-4) {
                var S = h * h + p * p;
                if ((r && S < k * k) || (i && S > k * k)) {
                  var E = (Math.sqrt(S) / k - 1) * a + 1;
                  ((_ *= E), o && (x *= E));
                }
              }
            }
            e.updateWorldTransformWith(
              e.ax,
              e.ay,
              e.arotation + d * a,
              _,
              x,
              e.ashearX,
              e.ashearY,
            );
          },
        },
        {
          key: 'apply2',
          value: function (e, t, n, r, i, o, a, s, l) {
            if (e.inherit == Je.Normal && t.inherit == Je.Normal) {
              var c = e.ax,
                u = e.ay,
                f = e.ascaleX,
                d = e.ascaleY,
                h = f,
                p = d,
                m = t.ascaleX,
                g = 0,
                y = 0,
                A = 0;
              (f < 0 ? ((f = -f), (g = 180), (A = -1)) : ((g = 0), (A = 1)),
                d < 0 && ((d = -d), (A = -A)),
                m < 0 ? ((m = -m), (y = 180)) : (y = 0));
              var b = t.ax,
                w = 0,
                _ = 0,
                x = 0,
                k = e.a,
                S = e.b,
                E = e.c,
                C = e.d,
                T = Math.abs(f - d) <= 1e-4;
              !T || o
                ? ((w = 0), (_ = k * b + e.worldX), (x = E * b + e.worldY))
                : ((_ = k * b + S * (w = t.ay) + e.worldX),
                  (x = E * b + C * w + e.worldY));
              var I = e.parent;
              if (!I) throw new Error('IK parent must itself have a parent.');
              ((k = I.a), (S = I.b), (E = I.c));
              var M = k * (C = I.d) - S * E,
                O = _ - I.worldX,
                B = x - I.worldY,
                P = (O * C - B * S) * (M = Math.abs(M) <= 1e-4 ? 0 : 1 / M) - c,
                L = (B * k - O * E) * M - u,
                R = Math.sqrt(P * P + L * L),
                D = t.data.length * m,
                F = void 0,
                j = void 0;
              if (R < 1e-4)
                return (
                  this.apply1(e, n, r, !1, o, !1, l),
                  void t.updateWorldTransformWith(
                    b,
                    w,
                    0,
                    t.ascaleX,
                    t.ascaleY,
                    t.ashearX,
                    t.ashearY,
                  )
                );
              var N = ((O = n - I.worldX) * C - (B = r - I.worldY) * S) * M - c,
                z = (B * k - O * E) * M - u,
                U = N * N + z * z;
              if (0 != s) {
                s *= f * (m + 1) * 0.5;
                var G = Math.sqrt(U),
                  H = G - R - D * f + s;
                if (H > 0) {
                  var Q = Math.min(1, H / (2 * s)) - 1;
                  U =
                    (N -= (Q = (H - s * (1 - Q * Q)) / G) * N) * N +
                    (z -= Q * z) * z;
                }
              }
              e: if (T) {
                var V = (U - R * R - (D *= f) * D) / (2 * R * D);
                (V < -1
                  ? ((V = -1), (j = Math.PI * i))
                  : V > 1
                    ? ((V = 1),
                      (j = 0),
                      o &&
                        ((h *= k = (Math.sqrt(U) / (R + D) - 1) * l + 1),
                        a && (p *= k)))
                    : (j = Math.acos(V) * i),
                  (k = R + D * V),
                  (S = D * Math.sin(j)),
                  (F = Math.atan2(z * k - N * S, N * k + z * S)));
              } else {
                var q = (k = f * D) * k,
                  W = (S = d * D) * S,
                  Y = Math.atan2(z, N),
                  X = -2 * W * R,
                  J = W - q;
                if (
                  (C = X * X - 4 * J * (E = W * R * R + q * U - q * W)) >= 0
                ) {
                  var K = Math.sqrt(C);
                  X < 0 && (K = -K);
                  var $ = (K = 0.5 * -(X + K)) / J,
                    Z = E / K,
                    ee = Math.abs($) < Math.abs(Z) ? $ : Z;
                  if (ee * ee <= U) {
                    ((B = Math.sqrt(U - ee * ee) * i),
                      (F = Y - Math.atan2(B, ee)),
                      (j = Math.atan2(B / d, (ee - R) / f)));
                    break e;
                  }
                }
                var te = v.PI,
                  ne = R - k,
                  re = ne * ne,
                  ie = 0,
                  oe = 0,
                  ae = R + k,
                  se = ae * ae,
                  le = 0;
                ((E = (-k * R) / (q - W)) >= -1 &&
                  E <= 1 &&
                  ((E = Math.acos(E)),
                  (C =
                    (O = k * Math.cos(E) + R) * O + (B = S * Math.sin(E)) * B) <
                    re && ((te = E), (re = C), (ne = O), (ie = B)),
                  C > se && ((oe = E), (se = C), (ae = O), (le = B))),
                  U <= 0.5 * (re + se)
                    ? ((F = Y - Math.atan2(ie * i, ne)), (j = te * i))
                    : ((F = Y - Math.atan2(le * i, ae)), (j = oe * i)));
              }
              var ce = Math.atan2(w, b) * A,
                ue = e.arotation;
              ((F = (F - ce) * v.radDeg + g - ue) > 180
                ? (F -= 360)
                : F < -180 && (F += 360),
                e.updateWorldTransformWith(c, u, ue + F * l, h, p, 0, 0),
                (ue = t.arotation),
                (j = ((j + ce) * v.radDeg - t.ashearX) * A + y - ue) > 180
                  ? (j -= 360)
                  : j < -180 && (j += 360),
                t.updateWorldTransformWith(
                  b,
                  w,
                  ue + j * l,
                  t.ascaleX,
                  t.ascaleY,
                  t.ashearX,
                  t.ashearY,
                ));
            }
          },
        },
      ]),
      e
    );
  })(),
  it = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, 0, !1),
      );
      return (
        (n.bones = new Array()),
        (n._target = null),
        (n.bendDirection = 0),
        (n.compress = !1),
        (n.stretch = !1),
        (n.uniform = !1),
        (n.mix = 0),
        (n.softness = 0),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'target',
          set: function (e) {
            this._target = e;
          },
          get: function () {
            if (this._target) return this._target;
            throw new Error('BoneData not set.');
          },
        },
      ]),
      t
    );
  })($e),
  ot = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, 0, !1),
      );
      return (
        (n.bones = new Array()),
        (n._target = null),
        (n.positionMode = at.Fixed),
        (n.spacingMode = st.Fixed),
        (n.rotateMode = lt.Chain),
        (n.offsetRotation = 0),
        (n.position = 0),
        (n.spacing = 0),
        (n.mixRotate = 0),
        (n.mixX = 0),
        (n.mixY = 0),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'target',
          set: function (e) {
            this._target = e;
          },
          get: function () {
            if (this._target) return this._target;
            throw new Error('SlotData not set.');
          },
        },
      ]),
      t
    );
  })($e),
  at = void 0;
!(function (e) {
  ((e[(e.Fixed = 0)] = 'Fixed'), (e[(e.Percent = 1)] = 'Percent'));
})(at || (at = {}));
var st = void 0;
!(function (e) {
  ((e[(e.Length = 0)] = 'Length'),
    (e[(e.Fixed = 1)] = 'Fixed'),
    (e[(e.Percent = 2)] = 'Percent'),
    (e[(e.Proportional = 3)] = 'Proportional'));
})(st || (st = {}));
var lt = void 0;
!(function (e) {
  ((e[(e.Tangent = 0)] = 'Tangent'),
    (e[(e.Chain = 1)] = 'Chain'),
    (e[(e.ChainScale = 2)] = 'ChainScale'));
})(lt || (lt = {}));
var ct = (function () {
  function e(t, n) {
    if (
      (d(this, e),
      (this.position = 0),
      (this.spacing = 0),
      (this.mixRotate = 0),
      (this.mixX = 0),
      (this.mixY = 0),
      (this.spaces = new Array()),
      (this.positions = new Array()),
      (this.world = new Array()),
      (this.curves = new Array()),
      (this.lengths = new Array()),
      (this.segments = new Array()),
      (this.active = !1),
      !t)
    )
      throw new Error('data cannot be null.');
    if (!n) throw new Error('skeleton cannot be null.');
    ((this.data = t), (this.bones = new Array()));
    for (var r = 0, i = t.bones.length; r < i; r++) {
      var o = n.findBone(t.bones[r].name);
      if (!o) throw new Error("Couldn't find bone " + t.bones[r].name + '.');
      this.bones.push(o);
    }
    var a = n.findSlot(t.target.name);
    if (!a) throw new Error("Couldn't find target bone " + t.target.name);
    ((this.target = a),
      (this.position = t.position),
      (this.spacing = t.spacing),
      (this.mixRotate = t.mixRotate),
      (this.mixX = t.mixX),
      (this.mixY = t.mixY));
  }
  return (
    a(e, [
      {
        key: 'isActive',
        value: function () {
          return this.active;
        },
      },
      {
        key: 'setToSetupPose',
        value: function () {
          var e = this.data;
          ((this.position = e.position),
            (this.spacing = e.spacing),
            (this.mixRotate = e.mixRotate),
            (this.mixX = e.mixX),
            (this.mixY = e.mixY));
        },
      },
      {
        key: 'update',
        value: function (t) {
          var n = this.target.getAttachment();
          if (n instanceof Ve) {
            var r = this.mixRotate,
              i = this.mixX,
              o = this.mixY;
            if (0 != r || 0 != i || 0 != o) {
              var a = this.data,
                s = a.rotateMode == lt.Tangent,
                l = a.rotateMode == lt.ChainScale,
                c = this.bones,
                u = c.length,
                f = s ? u : u + 1,
                d = b.setArraySize(this.spaces, f),
                h = l ? (this.lengths = b.setArraySize(this.lengths, u)) : [],
                p = this.spacing;
              switch (a.spacingMode) {
                case st.Percent:
                  if (l)
                    for (var m = 0, g = f - 1; m < g; m++) {
                      var y = c[m],
                        A = y.data.length,
                        w = A * y.a,
                        _ = A * y.c;
                      h[m] = Math.sqrt(w * w + _ * _);
                    }
                  b.arrayFill(d, 1, f, p);
                  break;
                case st.Proportional:
                  for (var x = 0, k = 0, S = f - 1; k < S;) {
                    var E = c[k],
                      C = E.data.length;
                    if (C < e.epsilon) (l && (h[k] = 0), (d[++k] = p));
                    else {
                      var T = C * E.a,
                        I = C * E.c,
                        M = Math.sqrt(T * T + I * I);
                      (l && (h[k] = M), (d[++k] = M), (x += M));
                    }
                  }
                  if (x > 0) {
                    x = (f / x) * p;
                    for (var O = 1; O < f; O++) d[O] *= x;
                  }
                  break;
                default:
                  for (
                    var B = a.spacingMode == st.Length, P = 0, L = f - 1;
                    P < L;
                  ) {
                    var R = c[P],
                      D = R.data.length;
                    if (D < e.epsilon) (l && (h[P] = 0), (d[++P] = p));
                    else {
                      var F = D * R.a,
                        j = D * R.c,
                        N = Math.sqrt(F * F + j * j);
                      (l && (h[P] = N), (d[++P] = ((B ? D + p : p) * N) / D));
                    }
                  }
              }
              var z = this.computeWorldPositions(n, f, s),
                U = z[0],
                G = z[1],
                H = a.offsetRotation,
                Q = !1;
              if (0 == H) Q = a.rotateMode == lt.Chain;
              else {
                Q = !1;
                var V = this.target.bone;
                H *= V.a * V.d - V.b * V.c > 0 ? v.degRad : -v.degRad;
              }
              for (var q = 0, W = 3; q < u; q++, W += 3) {
                var Y = c[q];
                ((Y.worldX += (U - Y.worldX) * i),
                  (Y.worldY += (G - Y.worldY) * o));
                var X = z[W],
                  J = z[W + 1],
                  K = X - U,
                  $ = J - G;
                if (l) {
                  var Z = h[q];
                  if (0 != Z) {
                    var ee = (Math.sqrt(K * K + $ * $) / Z - 1) * r + 1;
                    ((Y.a *= ee), (Y.c *= ee));
                  }
                }
                if (((U = X), (G = J), r > 0)) {
                  var te = Y.a,
                    ne = Y.b,
                    re = Y.c,
                    ie = Y.d,
                    oe = 0,
                    ae = 0,
                    se = 0;
                  if (
                    ((oe = s
                      ? z[W - 1]
                      : 0 == d[q + 1]
                        ? z[W + 2]
                        : Math.atan2($, K)),
                    (oe -= Math.atan2(re, te)),
                    Q)
                  ) {
                    ((ae = Math.cos(oe)), (se = Math.sin(oe)));
                    var le = Y.data.length;
                    ((U += (le * (ae * te - se * re) - K) * r),
                      (G += (le * (se * te + ae * re) - $) * r));
                  } else oe += H;
                  (oe > v.PI ? (oe -= v.PI2) : oe < -v.PI && (oe += v.PI2),
                    (oe *= r),
                    (ae = Math.cos(oe)),
                    (se = Math.sin(oe)),
                    (Y.a = ae * te - se * re),
                    (Y.b = ae * ne - se * ie),
                    (Y.c = se * te + ae * re),
                    (Y.d = se * ne + ae * ie));
                }
                Y.updateAppliedTransform();
              }
            }
          }
        },
      },
      {
        key: 'computeWorldPositions',
        value: function (t, n, r) {
          var i = this.target,
            o = this.position,
            a = this.spaces,
            s = b.setArraySize(this.positions, 3 * n + 2),
            l = this.world,
            c = t.closed,
            u = t.worldVerticesLength,
            f = u / 6,
            d = e.NONE;
          if (!t.constantSpeed) {
            var h = t.lengths,
              p = h[(f -= c ? 1 : 2)];
            this.data.positionMode == at.Percent && (o *= p);
            var m = void 0;
            switch (this.data.spacingMode) {
              case st.Percent:
                m = p;
                break;
              case st.Proportional:
                m = p / n;
                break;
              default:
                m = 1;
            }
            l = b.setArraySize(this.world, 8);
            for (var v = 0, g = 0, y = 0; v < n; v++, g += 3) {
              var A = a[v] * m,
                w = (o += A);
              if (c) ((w %= p) < 0 && (w += p), (y = 0));
              else {
                if (w < 0) {
                  (d != e.BEFORE &&
                    ((d = e.BEFORE), t.computeWorldVertices(i, 2, 4, l, 0, 2)),
                    this.addBeforePosition(w, l, 0, s, g));
                  continue;
                }
                if (w > p) {
                  (d != e.AFTER &&
                    ((d = e.AFTER),
                    t.computeWorldVertices(i, u - 6, 4, l, 0, 2)),
                    this.addAfterPosition(w - p, l, 0, s, g));
                  continue;
                }
              }
              for (; ; y++) {
                var _ = h[y];
                if (!(w > _)) {
                  if (0 == y) w /= _;
                  else {
                    var x = h[y - 1];
                    w = (w - x) / (_ - x);
                  }
                  break;
                }
              }
              (y != d &&
                ((d = y),
                c && y == f
                  ? (t.computeWorldVertices(i, u - 4, 4, l, 0, 2),
                    t.computeWorldVertices(i, 0, 4, l, 4, 2))
                  : t.computeWorldVertices(i, 6 * y + 2, 8, l, 0, 2)),
                this.addCurvePosition(
                  w,
                  l[0],
                  l[1],
                  l[2],
                  l[3],
                  l[4],
                  l[5],
                  l[6],
                  l[7],
                  s,
                  g,
                  r || (v > 0 && 0 == A),
                ));
            }
            return s;
          }
          c
            ? ((u += 2),
              (l = b.setArraySize(this.world, u)),
              t.computeWorldVertices(i, 2, u - 4, l, 0, 2),
              t.computeWorldVertices(i, 0, 2, l, u - 4, 2),
              (l[u - 2] = l[0]),
              (l[u - 1] = l[1]))
            : (f--,
              (u -= 4),
              (l = b.setArraySize(this.world, u)),
              t.computeWorldVertices(i, 2, u, l, 0, 2));
          for (
            var k = b.setArraySize(this.curves, f),
              S = 0,
              E = l[0],
              C = l[1],
              T = 0,
              I = 0,
              M = 0,
              O = 0,
              B = 0,
              P = 0,
              L = 0,
              R = 0,
              D = 0,
              F = 0,
              j = 0,
              N = 0,
              z = 0,
              U = 0,
              G = 0,
              H = 2;
            G < f;
            G++, H += 6
          )
            ((T = l[H]),
              (I = l[H + 1]),
              (M = l[H + 2]),
              (O = l[H + 3]),
              (j =
                2 * (L = 0.1875 * (E - 2 * T + M)) +
                (D = 0.09375 * (3 * (T - M) - E + (B = l[H + 4])))),
              (N =
                2 * (R = 0.1875 * (C - 2 * I + O)) +
                (F = 0.09375 * (3 * (I - O) - C + (P = l[H + 5])))),
              (z = 0.75 * (T - E) + L + 0.16666667 * D),
              (U = 0.75 * (I - C) + R + 0.16666667 * F),
              (S += Math.sqrt(z * z + U * U)),
              (z += j),
              (U += N),
              (j += D),
              (N += F),
              (S += Math.sqrt(z * z + U * U)),
              (z += j),
              (U += N),
              (S += Math.sqrt(z * z + U * U)),
              (z += j + D),
              (U += N + F),
              (S += Math.sqrt(z * z + U * U)),
              (k[G] = S),
              (E = B),
              (C = P));
          this.data.positionMode == at.Percent && (o *= S);
          var Q = void 0;
          switch (this.data.spacingMode) {
            case st.Percent:
              Q = S;
              break;
            case st.Proportional:
              Q = S / n;
              break;
            default:
              Q = 1;
          }
          for (
            var V = this.segments, q = 0, W = 0, Y = 0, X = 0, J = 0;
            W < n;
            W++, Y += 3
          ) {
            var K = a[W] * Q,
              $ = (o += K);
            if (c) (($ %= S) < 0 && ($ += S), (X = 0));
            else {
              if ($ < 0) {
                this.addBeforePosition($, l, 0, s, Y);
                continue;
              }
              if ($ > S) {
                this.addAfterPosition($ - S, l, u - 4, s, Y);
                continue;
              }
            }
            for (; ; X++) {
              var Z = k[X];
              if (!($ > Z)) {
                if (0 == X) $ /= Z;
                else {
                  var ee = k[X - 1];
                  $ = ($ - ee) / (Z - ee);
                }
                break;
              }
            }
            if (X != d) {
              d = X;
              var te = 6 * X;
              for (
                E = l[te],
                  C = l[te + 1],
                  T = l[te + 2],
                  I = l[te + 3],
                  M = l[te + 4],
                  O = l[te + 5],
                  j =
                    2 * (L = 0.03 * (E - 2 * T + M)) +
                    (D = 0.006 * (3 * (T - M) - E + (B = l[te + 6]))),
                  N =
                    2 * (R = 0.03 * (C - 2 * I + O)) +
                    (F = 0.006 * (3 * (I - O) - C + (P = l[te + 7]))),
                  z = 0.3 * (T - E) + L + 0.16666667 * D,
                  U = 0.3 * (I - C) + R + 0.16666667 * F,
                  q = Math.sqrt(z * z + U * U),
                  V[0] = q,
                  te = 1;
                te < 8;
                te++
              )
                ((z += j),
                  (U += N),
                  (j += D),
                  (N += F),
                  (q += Math.sqrt(z * z + U * U)),
                  (V[te] = q));
              ((z += j),
                (U += N),
                (q += Math.sqrt(z * z + U * U)),
                (V[8] = q),
                (z += j + D),
                (U += N + F),
                (q += Math.sqrt(z * z + U * U)),
                (V[9] = q),
                (J = 0));
            }
            for ($ *= q; ; J++) {
              var ne = V[J];
              if (!($ > ne)) {
                if (0 == J) $ /= ne;
                else {
                  var re = V[J - 1];
                  $ = J + ($ - re) / (ne - re);
                }
                break;
              }
            }
            this.addCurvePosition(
              0.1 * $,
              E,
              C,
              T,
              I,
              M,
              O,
              B,
              P,
              s,
              Y,
              r || (W > 0 && 0 == K),
            );
          }
          return s;
        },
      },
      {
        key: 'addBeforePosition',
        value: function (e, t, n, r, i) {
          var o = t[n],
            a = t[n + 1],
            s = t[n + 2] - o,
            l = t[n + 3] - a,
            c = Math.atan2(l, s);
          ((r[i] = o + e * Math.cos(c)),
            (r[i + 1] = a + e * Math.sin(c)),
            (r[i + 2] = c));
        },
      },
      {
        key: 'addAfterPosition',
        value: function (e, t, n, r, i) {
          var o = t[n + 2],
            a = t[n + 3],
            s = o - t[n],
            l = a - t[n + 1],
            c = Math.atan2(l, s);
          ((r[i] = o + e * Math.cos(c)),
            (r[i + 1] = a + e * Math.sin(c)),
            (r[i + 2] = c));
        },
      },
      {
        key: 'addCurvePosition',
        value: function (e, t, n, r, i, o, a, s, l, c, u, f) {
          if (0 == e || isNaN(e))
            return (
              (c[u] = t),
              (c[u + 1] = n),
              void (c[u + 2] = Math.atan2(i - n, r - t))
            );
          var d = e * e,
            h = d * e,
            p = 1 - e,
            m = p * p,
            v = m * p,
            g = p * e,
            y = 3 * g,
            A = p * y,
            b = y * e,
            w = t * v + r * A + o * b + s * h,
            _ = n * v + i * A + a * b + l * h;
          ((c[u] = w),
            (c[u + 1] = _),
            f &&
              (c[u + 2] =
                e < 0.001
                  ? Math.atan2(i - n, r - t)
                  : Math.atan2(
                      _ - (n * m + i * g * 2 + a * d),
                      w - (t * m + r * g * 2 + o * d),
                    )));
        },
      },
    ]),
    e
  );
})();
((ct.NONE = -1), (ct.BEFORE = -2), (ct.AFTER = -3), (ct.epsilon = 1e-5));
var ut = (function () {
    function e(t, n) {
      (d(this, e),
        (this._bone = null),
        (this.inertia = 0),
        (this.strength = 0),
        (this.damping = 0),
        (this.massInverse = 0),
        (this.wind = 0),
        (this.gravity = 0),
        (this.mix = 0),
        (this._reset = !0),
        (this.ux = 0),
        (this.uy = 0),
        (this.cx = 0),
        (this.cy = 0),
        (this.tx = 0),
        (this.ty = 0),
        (this.xOffset = 0),
        (this.xVelocity = 0),
        (this.yOffset = 0),
        (this.yVelocity = 0),
        (this.rotateOffset = 0),
        (this.rotateVelocity = 0),
        (this.scaleOffset = 0),
        (this.scaleVelocity = 0),
        (this.active = !1),
        (this.remaining = 0),
        (this.lastTime = 0),
        (this.data = t),
        (this.skeleton = n),
        (this.bone = n.bones[t.bone.index]),
        (this.inertia = t.inertia),
        (this.strength = t.strength),
        (this.damping = t.damping),
        (this.massInverse = t.massInverse),
        (this.wind = t.wind),
        (this.gravity = t.gravity),
        (this.mix = t.mix));
    }
    return (
      a(e, [
        {
          key: 'bone',
          set: function (e) {
            this._bone = e;
          },
          get: function () {
            if (this._bone) return this._bone;
            throw new Error('Bone not set.');
          },
        },
      ]),
      a(e, [
        {
          key: 'reset',
          value: function () {
            ((this.remaining = 0),
              (this.lastTime = this.skeleton.time),
              (this._reset = !0),
              (this.xOffset = 0),
              (this.xVelocity = 0),
              (this.yOffset = 0),
              (this.yVelocity = 0),
              (this.rotateOffset = 0),
              (this.rotateVelocity = 0),
              (this.scaleOffset = 0),
              (this.scaleVelocity = 0));
          },
        },
        {
          key: 'setToSetupPose',
          value: function () {
            var e = this.data;
            ((this.inertia = e.inertia),
              (this.strength = e.strength),
              (this.damping = e.damping),
              (this.massInverse = e.massInverse),
              (this.wind = e.wind),
              (this.gravity = e.gravity),
              (this.mix = e.mix));
          },
        },
        {
          key: 'isActive',
          value: function () {
            return this.active;
          },
        },
        {
          key: 'update',
          value: function (e) {
            var t = this.mix;
            if (0 != t) {
              var n = this.data.x > 0,
                r = this.data.y > 0,
                i = this.data.rotate > 0 || this.data.shearX > 0,
                o = this.data.scaleX > 0,
                a = this.bone,
                s = a.data.length;
              switch (e) {
                case pt.none:
                  return;
                case pt.reset:
                  this.reset();
                case pt.update:
                  var l = Math.max(this.skeleton.time - this.lastTime, 0);
                  ((this.remaining += l), (this.lastTime = this.skeleton.time));
                  var c = a.worldX,
                    u = a.worldY;
                  if (this._reset)
                    ((this._reset = !1), (this.ux = c), (this.uy = u));
                  else {
                    var f = this.remaining,
                      d = this.inertia,
                      h = this.data.limit * l,
                      p = this.data.step,
                      m = this.skeleton.data.referenceScale,
                      g = -1;
                    if (n || r) {
                      if (n) {
                        var y = (this.ux - c) * d;
                        ((this.xOffset += y > h ? h : y < -h ? -h : y),
                          (this.ux = c));
                      }
                      if (r) {
                        var A = (this.uy - u) * d;
                        ((this.yOffset += A > h ? h : A < -h ? -h : A),
                          (this.uy = u));
                      }
                      if (f >= p) {
                        g = Math.pow(this.damping, 60 * p);
                        var b = this.massInverse * p,
                          w = this.strength,
                          _ = this.wind * m,
                          x = (ht.yDown ? -this.gravity : this.gravity) * m;
                        do {
                          (n &&
                            ((this.xVelocity += (_ - this.xOffset * w) * b),
                            (this.xOffset += this.xVelocity * p),
                            (this.xVelocity *= g)),
                            r &&
                              ((this.yVelocity -= (x + this.yOffset * w) * b),
                              (this.yOffset += this.yVelocity * p),
                              (this.yVelocity *= g)),
                            (f -= p));
                        } while (f >= p);
                      }
                      (n && (a.worldX += this.xOffset * t * this.data.x),
                        r && (a.worldY += this.yOffset * t * this.data.y));
                    }
                    if (i || o) {
                      var k = Math.atan2(a.c, a.a),
                        S = 0,
                        E = 0,
                        C = 0,
                        T = this.cx - a.worldX,
                        I = this.cy - a.worldY;
                      if (
                        (T > h ? (T = h) : T < -h && (T = -h),
                        I > h ? (I = h) : I < -h && (I = -h),
                        i)
                      ) {
                        C = (this.data.rotate + this.data.shearX) * t;
                        var M =
                          Math.atan2(I + this.ty, T + this.tx) -
                          k -
                          this.rotateOffset * C;
                        ((this.rotateOffset +=
                          (M - Math.ceil(M * v.invPI2 - 0.5) * v.PI2) * d),
                          (M = this.rotateOffset * C + k),
                          (S = Math.cos(M)),
                          (E = Math.sin(M)),
                          o &&
                            (M = s * a.getWorldScaleX()) > 0 &&
                            (this.scaleOffset += ((T * S + I * E) * d) / M));
                      } else {
                        ((S = Math.cos(k)), (E = Math.sin(k)));
                        var O = s * a.getWorldScaleX();
                        O > 0 &&
                          (this.scaleOffset += ((T * S + I * E) * d) / O);
                      }
                      if ((f = this.remaining) >= p) {
                        -1 == g && (g = Math.pow(this.damping, 60 * p));
                        for (
                          var B = this.massInverse * p,
                            P = this.strength,
                            L = this.wind,
                            R = ht.yDown ? -this.gravity : this.gravity,
                            D = s / m;
                          ;
                        )
                          if (
                            ((f -= p),
                            o &&
                              ((this.scaleVelocity +=
                                (L * S - R * E - this.scaleOffset * P) * B),
                              (this.scaleOffset += this.scaleVelocity * p),
                              (this.scaleVelocity *= g)),
                            i)
                          ) {
                            if (
                              ((this.rotateVelocity -=
                                ((L * E + R * S) * D + this.rotateOffset * P) *
                                B),
                              (this.rotateOffset += this.rotateVelocity * p),
                              (this.rotateVelocity *= g),
                              f < p)
                            )
                              break;
                            var F = this.rotateOffset * C + k;
                            ((S = Math.cos(F)), (E = Math.sin(F)));
                          } else if (f < p) break;
                      }
                    }
                    this.remaining = f;
                  }
                  ((this.cx = a.worldX), (this.cy = a.worldY));
                  break;
                case pt.pose:
                  (n && (a.worldX += this.xOffset * t * this.data.x),
                    r && (a.worldY += this.yOffset * t * this.data.y));
              }
              if (i) {
                var j = this.rotateOffset * t,
                  N = 0,
                  z = 0,
                  U = 0;
                if (this.data.shearX > 0) {
                  var G = 0;
                  (this.data.rotate > 0 &&
                    ((G = j * this.data.rotate),
                    (N = Math.sin(G)),
                    (z = Math.cos(G)),
                    (U = a.b),
                    (a.b = z * U - N * a.d),
                    (a.d = N * U + z * a.d)),
                    (G += j * this.data.shearX),
                    (N = Math.sin(G)),
                    (z = Math.cos(G)),
                    (U = a.a),
                    (a.a = z * U - N * a.c),
                    (a.c = N * U + z * a.c));
                } else
                  ((j *= this.data.rotate),
                    (N = Math.sin(j)),
                    (z = Math.cos(j)),
                    (U = a.a),
                    (a.a = z * U - N * a.c),
                    (a.c = N * U + z * a.c),
                    (U = a.b),
                    (a.b = z * U - N * a.d),
                    (a.d = N * U + z * a.d));
              }
              if (o) {
                var H = 1 + this.scaleOffset * t * this.data.scaleX;
                ((a.a *= H), (a.c *= H));
              }
              (e != pt.pose && ((this.tx = s * a.a), (this.ty = s * a.c)),
                a.updateAppliedTransform());
            }
          },
        },
        {
          key: 'translate',
          value: function (e, t) {
            ((this.ux -= e), (this.uy -= t), (this.cx -= e), (this.cy -= t));
          },
        },
        {
          key: 'rotate',
          value: function (e, t, n) {
            var r = n * v.degRad,
              i = Math.cos(r),
              o = Math.sin(r),
              a = this.cx - e,
              s = this.cy - t;
            this.translate(a * i - s * o - a, a * o + s * i - s);
          },
        },
      ]),
      e
    );
  })(),
  ft = (function () {
    function e(t, n) {
      if (
        (d(this, e),
        (this.darkColor = null),
        (this.attachment = null),
        (this.attachmentState = 0),
        (this.sequenceIndex = -1),
        (this.deform = new Array()),
        !t)
      )
        throw new Error('data cannot be null.');
      if (!n) throw new Error('bone cannot be null.');
      ((this.data = t),
        (this.bone = n),
        (this.color = new m()),
        (this.darkColor = t.darkColor ? new m() : null),
        this.setToSetupPose());
    }
    return (
      a(e, [
        {
          key: 'getSkeleton',
          value: function () {
            return this.bone.skeleton;
          },
        },
        {
          key: 'getAttachment',
          value: function () {
            return this.attachment;
          },
        },
        {
          key: 'setAttachment',
          value: function (e) {
            this.attachment != e &&
              ((e instanceof C &&
                this.attachment instanceof C &&
                e.timelineAttachment == this.attachment.timelineAttachment) ||
                (this.deform.length = 0),
              (this.attachment = e),
              (this.sequenceIndex = -1));
          },
        },
        {
          key: 'setToSetupPose',
          value: function () {
            (this.color.setFromColor(this.data.color),
              this.darkColor &&
                this.darkColor.setFromColor(this.data.darkColor),
              this.data.attachmentName
                ? ((this.attachment = null),
                  this.setAttachment(
                    this.bone.skeleton.getAttachment(
                      this.data.index,
                      this.data.attachmentName,
                    ),
                  ))
                : (this.attachment = null));
          },
        },
      ]),
      e
    );
  })(),
  dt = (function () {
    function e(t, n) {
      if (
        (d(this, e),
        (this.mixRotate = 0),
        (this.mixX = 0),
        (this.mixY = 0),
        (this.mixScaleX = 0),
        (this.mixScaleY = 0),
        (this.mixShearY = 0),
        (this.temp = new x()),
        (this.active = !1),
        !t)
      )
        throw new Error('data cannot be null.');
      if (!n) throw new Error('skeleton cannot be null.');
      ((this.data = t), (this.bones = new Array()));
      for (var r = 0; r < t.bones.length; r++) {
        var i = n.findBone(t.bones[r].name);
        if (!i) throw new Error("Couldn't find bone " + t.bones[r].name + '.');
        this.bones.push(i);
      }
      var o = n.findBone(t.target.name);
      if (!o)
        throw new Error("Couldn't find target bone " + t.target.name + '.');
      ((this.target = o),
        (this.mixRotate = t.mixRotate),
        (this.mixX = t.mixX),
        (this.mixY = t.mixY),
        (this.mixScaleX = t.mixScaleX),
        (this.mixScaleY = t.mixScaleY),
        (this.mixShearY = t.mixShearY));
    }
    return (
      a(e, [
        {
          key: 'isActive',
          value: function () {
            return this.active;
          },
        },
        {
          key: 'setToSetupPose',
          value: function () {
            var e = this.data;
            ((this.mixRotate = e.mixRotate),
              (this.mixX = e.mixX),
              (this.mixY = e.mixY),
              (this.mixScaleX = e.mixScaleX),
              (this.mixScaleY = e.mixScaleY),
              (this.mixShearY = e.mixShearY));
          },
        },
        {
          key: 'update',
          value: function (e) {
            (0 == this.mixRotate &&
              0 == this.mixX &&
              0 == this.mixY &&
              0 == this.mixScaleX &&
              0 == this.mixScaleY &&
              0 == this.mixShearY) ||
              (this.data.local
                ? this.data.relative
                  ? this.applyRelativeLocal()
                  : this.applyAbsoluteLocal()
                : this.data.relative
                  ? this.applyRelativeWorld()
                  : this.applyAbsoluteWorld());
          },
        },
        {
          key: 'applyAbsoluteWorld',
          value: function () {
            for (
              var e = this.mixRotate,
                t = this.mixX,
                n = this.mixY,
                r = this.mixScaleX,
                i = this.mixScaleY,
                o = this.mixShearY,
                a = 0 != t || 0 != n,
                s = this.target,
                l = s.a,
                c = s.b,
                u = s.c,
                f = s.d,
                d = l * f - c * u > 0 ? v.degRad : -v.degRad,
                h = this.data.offsetRotation * d,
                p = this.data.offsetShearY * d,
                m = this.bones,
                g = 0,
                y = m.length;
              g < y;
              g++
            ) {
              var A = m[g];
              if (0 != e) {
                var b = A.a,
                  w = A.b,
                  _ = A.c,
                  x = A.d,
                  k = Math.atan2(u, l) - Math.atan2(_, b) + h;
                (k > v.PI ? (k -= v.PI2) : k < -v.PI && (k += v.PI2), (k *= e));
                var S = Math.cos(k),
                  E = Math.sin(k);
                ((A.a = S * b - E * _),
                  (A.b = S * w - E * x),
                  (A.c = E * b + S * _),
                  (A.d = E * w + S * x));
              }
              if (a) {
                var C = this.temp;
                (s.localToWorld(C.set(this.data.offsetX, this.data.offsetY)),
                  (A.worldX += (C.x - A.worldX) * t),
                  (A.worldY += (C.y - A.worldY) * n));
              }
              if (0 != r) {
                var T = Math.sqrt(A.a * A.a + A.c * A.c);
                (0 != T &&
                  (T =
                    (T +
                      (Math.sqrt(l * l + u * u) - T + this.data.offsetScaleX) *
                        r) /
                    T),
                  (A.a *= T),
                  (A.c *= T));
              }
              if (0 != i) {
                var I = Math.sqrt(A.b * A.b + A.d * A.d);
                (0 != I &&
                  (I =
                    (I +
                      (Math.sqrt(c * c + f * f) - I + this.data.offsetScaleY) *
                        i) /
                    I),
                  (A.b *= I),
                  (A.d *= I));
              }
              if (o > 0) {
                var M = A.b,
                  O = A.d,
                  B = Math.atan2(O, M),
                  P =
                    Math.atan2(f, c) -
                    Math.atan2(u, l) -
                    (B - Math.atan2(A.c, A.a));
                (P > v.PI ? (P -= v.PI2) : P < -v.PI && (P += v.PI2),
                  (P = B + (P + p) * o));
                var L = Math.sqrt(M * M + O * O);
                ((A.b = Math.cos(P) * L), (A.d = Math.sin(P) * L));
              }
              A.updateAppliedTransform();
            }
          },
        },
        {
          key: 'applyRelativeWorld',
          value: function () {
            for (
              var e = this.mixRotate,
                t = this.mixX,
                n = this.mixY,
                r = this.mixScaleX,
                i = this.mixScaleY,
                o = this.mixShearY,
                a = 0 != t || 0 != n,
                s = this.target,
                l = s.a,
                c = s.b,
                u = s.c,
                f = s.d,
                d = l * f - c * u > 0 ? v.degRad : -v.degRad,
                h = this.data.offsetRotation * d,
                p = this.data.offsetShearY * d,
                m = this.bones,
                g = 0,
                y = m.length;
              g < y;
              g++
            ) {
              var A = m[g];
              if (0 != e) {
                var b = A.a,
                  w = A.b,
                  _ = A.c,
                  x = A.d,
                  k = Math.atan2(u, l) + h;
                (k > v.PI ? (k -= v.PI2) : k < -v.PI && (k += v.PI2), (k *= e));
                var S = Math.cos(k),
                  E = Math.sin(k);
                ((A.a = S * b - E * _),
                  (A.b = S * w - E * x),
                  (A.c = E * b + S * _),
                  (A.d = E * w + S * x));
              }
              if (a) {
                var C = this.temp;
                (s.localToWorld(C.set(this.data.offsetX, this.data.offsetY)),
                  (A.worldX += C.x * t),
                  (A.worldY += C.y * n));
              }
              if (0 != r) {
                var T =
                  (Math.sqrt(l * l + u * u) - 1 + this.data.offsetScaleX) * r +
                  1;
                ((A.a *= T), (A.c *= T));
              }
              if (0 != i) {
                var I =
                  (Math.sqrt(c * c + f * f) - 1 + this.data.offsetScaleY) * i +
                  1;
                ((A.b *= I), (A.d *= I));
              }
              if (o > 0) {
                var M = Math.atan2(f, c) - Math.atan2(u, l);
                M > v.PI ? (M -= v.PI2) : M < -v.PI && (M += v.PI2);
                var O = A.b,
                  B = A.d;
                M = Math.atan2(B, O) + (M - v.PI / 2 + p) * o;
                var P = Math.sqrt(O * O + B * B);
                ((A.b = Math.cos(M) * P), (A.d = Math.sin(M) * P));
              }
              A.updateAppliedTransform();
            }
          },
        },
        {
          key: 'applyAbsoluteLocal',
          value: function () {
            for (
              var e = this.mixRotate,
                t = this.mixX,
                n = this.mixY,
                r = this.mixScaleX,
                i = this.mixScaleY,
                o = this.mixShearY,
                a = this.target,
                s = this.bones,
                l = 0,
                c = s.length;
              l < c;
              l++
            ) {
              var u = s[l],
                f = u.arotation;
              0 != e && (f += (a.arotation - f + this.data.offsetRotation) * e);
              var d = u.ax,
                h = u.ay;
              ((d += (a.ax - d + this.data.offsetX) * t),
                (h += (a.ay - h + this.data.offsetY) * n));
              var p = u.ascaleX,
                m = u.ascaleY;
              (0 != r &&
                0 != p &&
                (p = (p + (a.ascaleX - p + this.data.offsetScaleX) * r) / p),
                0 != i &&
                  0 != m &&
                  (m = (m + (a.ascaleY - m + this.data.offsetScaleY) * i) / m));
              var v = u.ashearY;
              (0 != o && (v += (a.ashearY - v + this.data.offsetShearY) * o),
                u.updateWorldTransformWith(d, h, f, p, m, u.ashearX, v));
            }
          },
        },
        {
          key: 'applyRelativeLocal',
          value: function () {
            for (
              var e = this.mixRotate,
                t = this.mixX,
                n = this.mixY,
                r = this.mixScaleX,
                i = this.mixScaleY,
                o = this.mixShearY,
                a = this.target,
                s = this.bones,
                l = 0,
                c = s.length;
              l < c;
              l++
            ) {
              var u = s[l],
                f = u.arotation + (a.arotation + this.data.offsetRotation) * e,
                d = u.ax + (a.ax + this.data.offsetX) * t,
                h = u.ay + (a.ay + this.data.offsetY) * n,
                p =
                  u.ascaleX *
                  ((a.ascaleX - 1 + this.data.offsetScaleX) * r + 1),
                m =
                  u.ascaleY *
                  ((a.ascaleY - 1 + this.data.offsetScaleY) * i + 1),
                v = u.ashearY + (a.ashearY + this.data.offsetShearY) * o;
              u.updateWorldTransformWith(d, h, f, p, m, u.ashearX, v);
            }
          },
        },
      ]),
      e
    );
  })(),
  ht = (function () {
    function e(t) {
      if (
        (d(this, e),
        (this._updateCache = new Array()),
        (this.skin = null),
        (this.scaleX = 1),
        (this._scaleY = 1),
        (this.x = 0),
        (this.y = 0),
        (this.time = 0),
        !t)
      )
        throw new Error('data cannot be null.');
      ((this.data = t), (this.bones = new Array()));
      for (var n = 0; n < t.bones.length; n++) {
        var r = t.bones[n],
          i = void 0;
        if (r.parent) {
          var o = this.bones[r.parent.index];
          ((i = new Ke(r, this, o)), o.children.push(i));
        } else i = new Ke(r, this, null);
        this.bones.push(i);
      }
      ((this.slots = new Array()), (this.drawOrder = new Array()));
      for (var a = 0; a < t.slots.length; a++) {
        var s = t.slots[a],
          l = this.bones[s.boneData.index],
          c = new ft(s, l);
        (this.slots.push(c), this.drawOrder.push(c));
      }
      this.ikConstraints = new Array();
      for (var u = 0; u < t.ikConstraints.length; u++) {
        var f = t.ikConstraints[u];
        this.ikConstraints.push(new rt(f, this));
      }
      this.transformConstraints = new Array();
      for (var h = 0; h < t.transformConstraints.length; h++) {
        var p = t.transformConstraints[h];
        this.transformConstraints.push(new dt(p, this));
      }
      this.pathConstraints = new Array();
      for (var v = 0; v < t.pathConstraints.length; v++) {
        var g = t.pathConstraints[v];
        this.pathConstraints.push(new ct(g, this));
      }
      this.physicsConstraints = new Array();
      for (var y = 0; y < t.physicsConstraints.length; y++) {
        var A = t.physicsConstraints[y];
        this.physicsConstraints.push(new ut(A, this));
      }
      ((this.color = new m(1, 1, 1, 1)), this.updateCache());
    }
    return (
      a(e, [
        {
          key: 'scaleY',
          get: function () {
            return e.yDown ? -this._scaleY : this._scaleY;
          },
          set: function (e) {
            this._scaleY = e;
          },
        },
      ]),
      a(e, [
        {
          key: 'updateCache',
          value: function () {
            this._updateCache.length = 0;
            for (var e = this.bones, t = 0, n = e.length; t < n; t++) {
              var r = e[t];
              ((r.sorted = r.data.skinRequired), (r.active = !r.sorted));
            }
            if (this.skin)
              for (
                var i = this.skin.bones, o = 0, a = this.skin.bones.length;
                o < a;
                o++
              ) {
                var s = this.bones[i[o].index];
                do {
                  ((s.sorted = !1), (s.active = !0), (s = s.parent));
                } while (s);
              }
            var l = this.ikConstraints,
              c = this.transformConstraints,
              u = this.pathConstraints,
              f = this.physicsConstraints,
              d = l.length,
              h = c.length,
              p = u.length,
              m = this.physicsConstraints.length,
              v = d + h + p + m;
            e: for (var g = 0; g < v; g++) {
              for (var y = 0; y < d; y++) {
                var A = l[y];
                if (A.data.order == g) {
                  this.sortIkConstraint(A);
                  continue e;
                }
              }
              for (var b = 0; b < h; b++) {
                var w = c[b];
                if (w.data.order == g) {
                  this.sortTransformConstraint(w);
                  continue e;
                }
              }
              for (var _ = 0; _ < p; _++) {
                var x = u[_];
                if (x.data.order == g) {
                  this.sortPathConstraint(x);
                  continue e;
                }
              }
              for (var k = 0; k < m; k++) {
                var S = f[k];
                if (S.data.order == g) {
                  this.sortPhysicsConstraint(S);
                  continue e;
                }
              }
            }
            for (var E = 0, C = e.length; E < C; E++) this.sortBone(e[E]);
          },
        },
        {
          key: 'sortIkConstraint',
          value: function (e) {
            if (
              ((e.active =
                e.target.isActive() &&
                (!e.data.skinRequired ||
                  (this.skin &&
                    b.contains(this.skin.constraints, e.data, !0)))),
              e.active)
            ) {
              var t = e.target;
              this.sortBone(t);
              var n = e.bones,
                r = n[0];
              if ((this.sortBone(r), 1 == n.length))
                (this._updateCache.push(e), this.sortReset(r.children));
              else {
                var i = n[n.length - 1];
                (this.sortBone(i),
                  this._updateCache.push(e),
                  this.sortReset(r.children),
                  (i.sorted = !0));
              }
            }
          },
        },
        {
          key: 'sortPathConstraint',
          value: function (e) {
            if (
              ((e.active =
                e.target.bone.isActive() &&
                (!e.data.skinRequired ||
                  (this.skin &&
                    b.contains(this.skin.constraints, e.data, !0)))),
              e.active)
            ) {
              var t = e.target,
                n = t.data.index,
                r = t.bone;
              (this.skin && this.sortPathConstraintAttachment(this.skin, n, r),
                this.data.defaultSkin &&
                  this.data.defaultSkin != this.skin &&
                  this.sortPathConstraintAttachment(
                    this.data.defaultSkin,
                    n,
                    r,
                  ));
              for (var i = 0, o = this.data.skins.length; i < o; i++)
                this.sortPathConstraintAttachment(this.data.skins[i], n, r);
              var a = t.getAttachment();
              a instanceof Ve && this.sortPathConstraintAttachmentWith(a, r);
              for (var s = e.bones, l = s.length, c = 0; c < l; c++)
                this.sortBone(s[c]);
              this._updateCache.push(e);
              for (var u = 0; u < l; u++) this.sortReset(s[u].children);
              for (var f = 0; f < l; f++) s[f].sorted = !0;
            }
          },
        },
        {
          key: 'sortTransformConstraint',
          value: function (e) {
            if (
              ((e.active =
                e.target.isActive() &&
                (!e.data.skinRequired ||
                  (this.skin &&
                    b.contains(this.skin.constraints, e.data, !0)))),
              e.active)
            ) {
              this.sortBone(e.target);
              var t = e.bones,
                n = t.length;
              if (e.data.local)
                for (var r = 0; r < n; r++) {
                  var i = t[r];
                  (this.sortBone(i.parent), this.sortBone(i));
                }
              else for (var o = 0; o < n; o++) this.sortBone(t[o]);
              this._updateCache.push(e);
              for (var a = 0; a < n; a++) this.sortReset(t[a].children);
              for (var s = 0; s < n; s++) t[s].sorted = !0;
            }
          },
        },
        {
          key: 'sortPathConstraintAttachment',
          value: function (e, t, n) {
            var r = e.attachments[t];
            if (r)
              for (var i in r) this.sortPathConstraintAttachmentWith(r[i], n);
          },
        },
        {
          key: 'sortPathConstraintAttachmentWith',
          value: function (e, t) {
            if (e instanceof Ve) {
              var n = e.bones;
              if (n)
                for (var r = this.bones, i = 0, o = n.length; i < o;) {
                  var a = n[i++];
                  for (a += i; i < a;) this.sortBone(r[n[i++]]);
                }
              else this.sortBone(t);
            }
          },
        },
        {
          key: 'sortPhysicsConstraint',
          value: function (e) {
            var t = e.bone;
            ((e.active =
              t.active &&
              (!e.data.skinRequired ||
                (null != this.skin &&
                  b.contains(this.skin.constraints, e.data, !0)))),
              e.active &&
                (this.sortBone(t),
                this._updateCache.push(e),
                this.sortReset(t.children),
                (t.sorted = !0)));
          },
        },
        {
          key: 'sortBone',
          value: function (e) {
            if (e && !e.sorted) {
              var t = e.parent;
              (t && this.sortBone(t),
                (e.sorted = !0),
                this._updateCache.push(e));
            }
          },
        },
        {
          key: 'sortReset',
          value: function (e) {
            for (var t = 0, n = e.length; t < n; t++) {
              var r = e[t];
              r.active &&
                (r.sorted && this.sortReset(r.children), (r.sorted = !1));
            }
          },
        },
        {
          key: 'updateWorldTransform',
          value: function (e) {
            if (!e) throw new Error('physics is undefined');
            for (var t = this.bones, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              ((i.ax = i.x),
                (i.ay = i.y),
                (i.arotation = i.rotation),
                (i.ascaleX = i.scaleX),
                (i.ascaleY = i.scaleY),
                (i.ashearX = i.shearX),
                (i.ashearY = i.shearY));
            }
            for (var o = this._updateCache, a = 0, s = o.length; a < s; a++)
              o[a].update(e);
          },
        },
        {
          key: 'updateWorldTransformWith',
          value: function (e, t) {
            var n = this.getRootBone();
            if (!n) throw new Error('Root bone must not be null.');
            var r = t.a,
              i = t.b,
              o = t.c,
              a = t.d;
            ((n.worldX = r * this.x + i * this.y + t.worldX),
              (n.worldY = o * this.x + a * this.y + t.worldY));
            var s = (n.rotation + n.shearX) * v.degRad,
              l = (n.rotation + 90 + n.shearY) * v.degRad,
              c = Math.cos(s) * n.scaleX,
              u = Math.cos(l) * n.scaleY,
              f = Math.sin(s) * n.scaleX,
              d = Math.sin(l) * n.scaleY;
            ((n.a = (r * c + i * f) * this.scaleX),
              (n.b = (r * u + i * d) * this.scaleX),
              (n.c = (o * c + a * f) * this.scaleY),
              (n.d = (o * u + a * d) * this.scaleY));
            for (var h = this._updateCache, p = 0, m = h.length; p < m; p++) {
              var g = h[p];
              g != n && g.update(e);
            }
          },
        },
        {
          key: 'setToSetupPose',
          value: function () {
            (this.setBonesToSetupPose(), this.setSlotsToSetupPose());
          },
        },
        {
          key: 'setBonesToSetupPose',
          value: function () {
            var e = !0,
              t = !1,
              n = void 0;
            try {
              for (
                var r, i = this.bones[Symbol.iterator]();
                !(e = (r = i.next()).done);
                e = !0
              )
                r.value.setToSetupPose();
            } catch (e) {
              ((t = !0), (n = e));
            } finally {
              try {
                !e && i.return && i.return();
              } finally {
                if (t) throw n;
              }
            }
            var o = !0,
              a = !1,
              s = void 0;
            try {
              for (
                var l, c = this.ikConstraints[Symbol.iterator]();
                !(o = (l = c.next()).done);
                o = !0
              )
                l.value.setToSetupPose();
            } catch (e) {
              ((a = !0), (s = e));
            } finally {
              try {
                !o && c.return && c.return();
              } finally {
                if (a) throw s;
              }
            }
            var u = !0,
              f = !1,
              d = void 0;
            try {
              for (
                var h, p = this.transformConstraints[Symbol.iterator]();
                !(u = (h = p.next()).done);
                u = !0
              )
                h.value.setToSetupPose();
            } catch (e) {
              ((f = !0), (d = e));
            } finally {
              try {
                !u && p.return && p.return();
              } finally {
                if (f) throw d;
              }
            }
            var m = !0,
              v = !1,
              g = void 0;
            try {
              for (
                var y, A = this.pathConstraints[Symbol.iterator]();
                !(m = (y = A.next()).done);
                m = !0
              )
                y.value.setToSetupPose();
            } catch (e) {
              ((v = !0), (g = e));
            } finally {
              try {
                !m && A.return && A.return();
              } finally {
                if (v) throw g;
              }
            }
            var b = !0,
              w = !1,
              _ = void 0;
            try {
              for (
                var x, k = this.physicsConstraints[Symbol.iterator]();
                !(b = (x = k.next()).done);
                b = !0
              )
                x.value.setToSetupPose();
            } catch (e) {
              ((w = !0), (_ = e));
            } finally {
              try {
                !b && k.return && k.return();
              } finally {
                if (w) throw _;
              }
            }
          },
        },
        {
          key: 'setSlotsToSetupPose',
          value: function () {
            var e = this.slots;
            b.arrayCopy(e, 0, this.drawOrder, 0, e.length);
            for (var t = 0, n = e.length; t < n; t++) e[t].setToSetupPose();
          },
        },
        {
          key: 'getRootBone',
          value: function () {
            return 0 == this.bones.length ? null : this.bones[0];
          },
        },
        {
          key: 'findBone',
          value: function (e) {
            if (!e) throw new Error('boneName cannot be null.');
            for (var t = this.bones, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.data.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findSlot',
          value: function (e) {
            if (!e) throw new Error('slotName cannot be null.');
            for (var t = this.slots, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.data.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'setSkinByName',
          value: function (e) {
            var t = this.data.findSkin(e);
            if (!t) throw new Error('Skin not found: ' + e);
            this.setSkin(t);
          },
        },
        {
          key: 'setSkin',
          value: function (e) {
            if (e != this.skin) {
              if (e)
                if (this.skin) e.attachAll(this, this.skin);
                else
                  for (var t = this.slots, n = 0, r = t.length; n < r; n++) {
                    var i = t[n],
                      o = i.data.attachmentName;
                    if (o) {
                      var a = e.getAttachment(n, o);
                      a && i.setAttachment(a);
                    }
                  }
              ((this.skin = e), this.updateCache());
            }
          },
        },
        {
          key: 'getAttachmentByName',
          value: function (e, t) {
            var n = this.data.findSlot(e);
            if (!n) throw new Error("Can't find slot with name " + e);
            return this.getAttachment(n.index, t);
          },
        },
        {
          key: 'getAttachment',
          value: function (e, t) {
            if (!t) throw new Error('attachmentName cannot be null.');
            if (this.skin) {
              var n = this.skin.getAttachment(e, t);
              if (n) return n;
            }
            return this.data.defaultSkin
              ? this.data.defaultSkin.getAttachment(e, t)
              : null;
          },
        },
        {
          key: 'setAttachment',
          value: function (e, t) {
            if (!e) throw new Error('slotName cannot be null.');
            for (var n = this.slots, r = 0, i = n.length; r < i; r++) {
              var o = n[r];
              if (o.data.name == e) {
                var a = null;
                if (t && !(a = this.getAttachment(r, t)))
                  throw new Error(
                    'Attachment not found: ' + t + ', for slot: ' + e,
                  );
                return void o.setAttachment(a);
              }
            }
            throw new Error('Slot not found: ' + e);
          },
        },
        {
          key: 'findIkConstraint',
          value: function (e) {
            var t;
            if (!e) throw new Error('constraintName cannot be null.');
            return null !==
              (t = this.ikConstraints.find(function (t) {
                return t.data.name == e;
              })) && void 0 !== t
              ? t
              : null;
          },
        },
        {
          key: 'findTransformConstraint',
          value: function (e) {
            var t;
            if (!e) throw new Error('constraintName cannot be null.');
            return null !==
              (t = this.transformConstraints.find(function (t) {
                return t.data.name == e;
              })) && void 0 !== t
              ? t
              : null;
          },
        },
        {
          key: 'findPathConstraint',
          value: function (e) {
            var t;
            if (!e) throw new Error('constraintName cannot be null.');
            return null !==
              (t = this.pathConstraints.find(function (t) {
                return t.data.name == e;
              })) && void 0 !== t
              ? t
              : null;
          },
        },
        {
          key: 'findPhysicsConstraint',
          value: function (e) {
            var t;
            if (null == e) throw new Error('constraintName cannot be null.');
            return null !==
              (t = this.physicsConstraints.find(function (t) {
                return t.data.name == e;
              })) && void 0 !== t
              ? t
              : null;
          },
        },
        {
          key: 'getBoundsRect',
          value: function () {
            var e = new x(),
              t = new x();
            return (
              this.getBounds(e, t),
              { x: e.x, y: e.y, width: t.x, height: t.y }
            );
          },
        },
        {
          key: 'getBounds',
          value: function (t, n) {
            var r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : new Array(2),
              i =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : null;
            if (!t) throw new Error('offset cannot be null.');
            if (!n) throw new Error('size cannot be null.');
            for (
              var o = this.drawOrder,
                a = Number.POSITIVE_INFINITY,
                s = Number.POSITIVE_INFINITY,
                l = Number.NEGATIVE_INFINITY,
                c = Number.NEGATIVE_INFINITY,
                u = 0,
                f = o.length;
              u < f;
              u++
            ) {
              var d = o[u];
              if (d.bone.active) {
                var h = 0,
                  p = null,
                  m = null,
                  v = d.getAttachment();
                if (v instanceof We)
                  ((h = 8),
                    (p = b.setArraySize(r, h, 0)),
                    v.computeWorldVertices(d, p, 0, 2),
                    (m = e.quadTriangles));
                else if (v instanceof Qe) {
                  var g = v;
                  ((h = g.worldVerticesLength),
                    (p = b.setArraySize(r, h, 0)),
                    g.computeWorldVertices(d, 0, h, p, 0, 2),
                    (m = g.triangles));
                } else if (v instanceof Le && null != i) {
                  i.clipStart(d, v);
                  continue;
                }
                if (p && m) {
                  null != i &&
                    i.isClipping() &&
                    (i.clipTriangles(p, h, m, m.length),
                    (p = i.clippedVertices),
                    (h = i.clippedVertices.length));
                  for (var y = 0, A = p.length; y < A; y += 2) {
                    var w = p[y],
                      _ = p[y + 1];
                    ((a = Math.min(a, w)),
                      (s = Math.min(s, _)),
                      (l = Math.max(l, w)),
                      (c = Math.max(c, _)));
                  }
                }
                null != i && i.clipEndWithSlot(d);
              }
            }
            (null != i && i.clipEnd(), t.set(a, s), n.set(l - a, c - s));
          },
        },
        {
          key: 'update',
          value: function (e) {
            this.time += e;
          },
        },
        {
          key: 'physicsTranslate',
          value: function (e, t) {
            for (
              var n = this.physicsConstraints, r = 0, i = n.length;
              r < i;
              r++
            )
              n[r].translate(e, t);
          },
        },
        {
          key: 'physicsRotate',
          value: function (e, t, n) {
            for (
              var r = this.physicsConstraints, i = 0, o = r.length;
              i < o;
              i++
            )
              r[i].rotate(e, t, n);
          },
        },
      ]),
      e
    );
  })();
((ht.quadTriangles = [0, 1, 2, 2, 3, 0]), (ht.yDown = !1));
var pt = void 0;
!(function (e) {
  ((e[(e.none = 0)] = 'none'),
    (e[(e.reset = 1)] = 'reset'),
    (e[(e.update = 2)] = 'update'),
    (e[(e.pose = 3)] = 'pose'));
})(pt || (pt = {}));
var mt = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, 0, !1),
      );
      return (
        (n._bone = null),
        (n.x = 0),
        (n.y = 0),
        (n.rotate = 0),
        (n.scaleX = 0),
        (n.shearX = 0),
        (n.limit = 0),
        (n.step = 0),
        (n.inertia = 0),
        (n.strength = 0),
        (n.damping = 0),
        (n.massInverse = 0),
        (n.wind = 0),
        (n.gravity = 0),
        (n.mix = 0),
        (n.inertiaGlobal = !1),
        (n.strengthGlobal = !1),
        (n.dampingGlobal = !1),
        (n.massGlobal = !1),
        (n.windGlobal = !1),
        (n.gravityGlobal = !1),
        (n.mixGlobal = !1),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'bone',
          set: function (e) {
            this._bone = e;
          },
          get: function () {
            if (this._bone) return this._bone;
            throw new Error('BoneData not set.');
          },
        },
      ]),
      t
    );
  })($e),
  vt = (function () {
    function e() {
      (d(this, e),
        (this.name = null),
        (this.bones = new Array()),
        (this.slots = new Array()),
        (this.skins = new Array()),
        (this.defaultSkin = null),
        (this.events = new Array()),
        (this.animations = new Array()),
        (this.ikConstraints = new Array()),
        (this.transformConstraints = new Array()),
        (this.pathConstraints = new Array()),
        (this.physicsConstraints = new Array()),
        (this.x = 0),
        (this.y = 0),
        (this.width = 0),
        (this.height = 0),
        (this.referenceScale = 100),
        (this.version = null),
        (this.hash = null),
        (this.fps = 0),
        (this.imagesPath = null),
        (this.audioPath = null));
    }
    return (
      a(e, [
        {
          key: 'findBone',
          value: function (e) {
            if (!e) throw new Error('boneName cannot be null.');
            for (var t = this.bones, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findSlot',
          value: function (e) {
            if (!e) throw new Error('slotName cannot be null.');
            for (var t = this.slots, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.path && i.path + '/' + i.name == e) return i;
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findSkin',
          value: function (e) {
            if (!e) throw new Error('skinName cannot be null.');
            for (var t = this.skins, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findEvent',
          value: function (e) {
            if (!e) throw new Error('eventDataName cannot be null.');
            for (var t = this.events, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findAnimation',
          value: function (e) {
            if (!e) throw new Error('animationName cannot be null.');
            for (var t = this.animations, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findIkConstraint',
          value: function (e) {
            if (!e) throw new Error('constraintName cannot be null.');
            for (var t = this.ikConstraints, n = 0, r = t.length; n < r; n++) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findTransformConstraint',
          value: function (e) {
            if (!e) throw new Error('constraintName cannot be null.');
            for (
              var t = this.transformConstraints, n = 0, r = t.length;
              n < r;
              n++
            ) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findPathConstraint',
          value: function (e) {
            if (!e) throw new Error('constraintName cannot be null.');
            for (
              var t = this.pathConstraints, n = 0, r = t.length;
              n < r;
              n++
            ) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
        {
          key: 'findPhysicsConstraint',
          value: function (e) {
            if (!e) throw new Error('constraintName cannot be null.');
            for (
              var t = this.physicsConstraints, n = 0, r = t.length;
              n < r;
              n++
            ) {
              var i = t[n];
              if (i.name == e) return i;
            }
            return null;
          },
        },
      ]),
      e
    );
  })(),
  gt = function e() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
      n = arguments[1],
      r = arguments[2];
    (d(this, e), (this.slotIndex = t), (this.name = n), (this.attachment = r));
  },
  yt = (function () {
    function e(t) {
      if (
        (d(this, e),
        (this.attachments = new Array()),
        (this.bones = Array()),
        (this.constraints = new Array()),
        (this.color = new m(0.99607843, 0.61960787, 0.30980393, 1)),
        !t)
      )
        throw new Error('name cannot be null.');
      this.name = t;
    }
    return (
      a(e, [
        {
          key: 'setAttachment',
          value: function (e, t, n) {
            if (!n) throw new Error('attachment cannot be null.');
            var r = this.attachments;
            (e >= r.length && (r.length = e + 1),
              r[e] || (r[e] = {}),
              (r[e][t] = n));
          },
        },
        {
          key: 'addSkin',
          value: function (e) {
            for (var t = 0; t < e.bones.length; t++) {
              for (
                var n = e.bones[t], r = !1, i = 0;
                i < this.bones.length;
                i++
              )
                if (this.bones[i] == n) {
                  r = !0;
                  break;
                }
              r || this.bones.push(n);
            }
            for (var o = 0; o < e.constraints.length; o++) {
              for (
                var a = e.constraints[o], s = !1, l = 0;
                l < this.constraints.length;
                l++
              )
                if (this.constraints[l] == a) {
                  s = !0;
                  break;
                }
              s || this.constraints.push(a);
            }
            for (var c = e.getAttachments(), u = 0; u < c.length; u++) {
              var f = c[u];
              this.setAttachment(f.slotIndex, f.name, f.attachment);
            }
          },
        },
        {
          key: 'copySkin',
          value: function (e) {
            for (var t = 0; t < e.bones.length; t++) {
              for (
                var n = e.bones[t], r = !1, i = 0;
                i < this.bones.length;
                i++
              )
                if (this.bones[i] == n) {
                  r = !0;
                  break;
                }
              r || this.bones.push(n);
            }
            for (var o = 0; o < e.constraints.length; o++) {
              for (
                var a = e.constraints[o], s = !1, l = 0;
                l < this.constraints.length;
                l++
              )
                if (this.constraints[l] == a) {
                  s = !0;
                  break;
                }
              s || this.constraints.push(a);
            }
            for (var c = e.getAttachments(), u = 0; u < c.length; u++) {
              var f = c[u];
              f.attachment &&
                (f.attachment instanceof Qe
                  ? ((f.attachment = f.attachment.newLinkedMesh()),
                    this.setAttachment(f.slotIndex, f.name, f.attachment))
                  : ((f.attachment = f.attachment.copy()),
                    this.setAttachment(f.slotIndex, f.name, f.attachment)));
            }
          },
        },
        {
          key: 'getAttachment',
          value: function (e, t) {
            var n = this.attachments[e];
            return n ? n[t] : null;
          },
        },
        {
          key: 'removeAttachment',
          value: function (e, t) {
            var n = this.attachments[e];
            n && delete n[t];
          },
        },
        {
          key: 'getAttachments',
          value: function () {
            for (var e = new Array(), t = 0; t < this.attachments.length; t++) {
              var n = this.attachments[t];
              if (n)
                for (var r in n) {
                  var i = n[r];
                  i && e.push(new gt(t, r, i));
                }
            }
            return e;
          },
        },
        {
          key: 'getAttachmentsForSlot',
          value: function (e, t) {
            var n = this.attachments[e];
            if (n)
              for (var r in n) {
                var i = n[r];
                i && t.push(new gt(e, r, i));
              }
          },
        },
        {
          key: 'clear',
          value: function () {
            ((this.attachments.length = 0),
              (this.bones.length = 0),
              (this.constraints.length = 0));
          },
        },
        {
          key: 'attachAll',
          value: function (e, t) {
            for (var n = 0, r = 0; r < e.slots.length; r++) {
              var i = e.slots[r],
                o = i.getAttachment();
              if (o && n < t.attachments.length) {
                var a = t.attachments[n];
                for (var s in a)
                  if (o == a[s]) {
                    var l = this.getAttachment(n, s);
                    l && i.setAttachment(l);
                    break;
                  }
              }
              n++;
            }
          },
        },
      ]),
      e
    );
  })(),
  At = function e(t, n, r) {
    if (
      (d(this, e),
      (this.index = 0),
      (this.color = new m(1, 1, 1, 1)),
      (this.darkColor = null),
      (this.attachmentName = null),
      (this.blendMode = bt.Normal),
      (this.visible = !0),
      (this.path = null),
      t < 0)
    )
      throw new Error('index must be >= 0.');
    if (!n) throw new Error('name cannot be null.');
    if (!r) throw new Error('boneData cannot be null.');
    ((this.index = t), (this.name = n), (this.boneData = r));
  },
  bt = void 0;
!(function (e) {
  ((e[(e.Normal = 0)] = 'Normal'),
    (e[(e.Additive = 1)] = 'Additive'),
    (e[(e.Multiply = 2)] = 'Multiply'),
    (e[(e.Screen = 3)] = 'Screen'));
})(bt || (bt = {}));
var wt = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(
        this,
        (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, 0, !1),
      );
      return (
        (n.bones = new Array()),
        (n._target = null),
        (n.mixRotate = 0),
        (n.mixX = 0),
        (n.mixY = 0),
        (n.mixScaleX = 0),
        (n.mixScaleY = 0),
        (n.mixShearY = 0),
        (n.offsetRotation = 0),
        (n.offsetX = 0),
        (n.offsetY = 0),
        (n.offsetScaleX = 0),
        (n.offsetScaleY = 0),
        (n.offsetShearY = 0),
        (n.relative = !1),
        (n.local = !1),
        n
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'target',
          set: function (e) {
            this._target = e;
          },
          get: function () {
            if (this._target) return this._target;
            throw new Error('BoneData not set.');
          },
        },
      ]),
      t
    );
  })($e),
  _t = (function () {
    function e(t) {
      (d(this, e),
        (this.scale = 1),
        (this.linkedMeshes = new Array()),
        (this.attachmentLoader = t));
    }
    return (
      a(e, [
        {
          key: 'readSkeletonData',
          value: function (e) {
            var t = void 0,
              n = this.scale,
              r = new vt();
            r.name = '';
            var i = new xt(e),
              o = i.readInt32(),
              a = i.readInt32();
            ((r.hash =
              0 == a && 0 == o ? null : a.toString(16) + o.toString(16)),
              (r.version = i.readString()),
              (r.x = i.readFloat()),
              (r.y = i.readFloat()),
              (r.width = i.readFloat()),
              (r.height = i.readFloat()),
              (r.referenceScale = i.readFloat() * n));
            var s = i.readBoolean();
            s &&
              ((r.fps = i.readFloat()),
              (r.imagesPath = i.readString()),
              (r.audioPath = i.readString()));
            var l = 0;
            l = i.readInt(!0);
            for (var c = 0; c < l; c++) {
              var u = i.readString();
              if (!u)
                throw new Error('String in string table must not be null.');
              i.strings.push(u);
            }
            l = i.readInt(!0);
            for (var f = 0; f < l; f++) {
              var d = i.readString();
              if (!d) throw new Error('Bone name must not be null.');
              var h = 0 == f ? null : r.bones[i.readInt(!0)],
                p = new Xe(f, d, h);
              ((p.rotation = i.readFloat()),
                (p.x = i.readFloat() * n),
                (p.y = i.readFloat() * n),
                (p.scaleX = i.readFloat()),
                (p.scaleY = i.readFloat()),
                (p.shearX = i.readFloat()),
                (p.shearY = i.readFloat()),
                (p.length = i.readFloat() * n),
                (p.inherit = i.readByte()),
                (p.skinRequired = i.readBoolean()),
                s &&
                  (m.rgba8888ToColor(p.color, i.readInt32()),
                  (p.icon =
                    null !== (t = i.readString()) && void 0 !== t ? t : void 0),
                  (p.visible = i.readBoolean())),
                r.bones.push(p));
            }
            l = i.readInt(!0);
            for (var v = 0; v < l; v++) {
              var g = i.readString();
              if (!g) throw new Error('Slot name must not be null.');
              var y = null;
              if (s) {
                var A = g.lastIndexOf('/');
                -1 != A && ((y = g.substring(0, A)), (g = g.substring(A + 1)));
              }
              var w = r.bones[i.readInt(!0)],
                _ = new At(v, g, w);
              m.rgba8888ToColor(_.color, i.readInt32());
              var x = i.readInt32();
              (-1 != x && m.rgb888ToColor((_.darkColor = new m()), x),
                (_.attachmentName = i.readStringRef()),
                (_.blendMode = i.readInt(!0)),
                s && ((_.visible = i.readBoolean()), (_.path = y)),
                r.slots.push(_));
            }
            l = i.readInt(!0);
            for (var k, S = 0; S < l; S++) {
              var E = i.readString();
              if (!E)
                throw new Error('IK constraint data name must not be null.');
              var C = new it(E);
              ((C.order = i.readInt(!0)), (k = i.readInt(!0)));
              for (var T = 0; T < k; T++) C.bones.push(r.bones[i.readInt(!0)]);
              C.target = r.bones[i.readInt(!0)];
              var I = i.readByte();
              ((C.skinRequired = !!(1 & I)),
                (C.bendDirection = 2 & I ? 1 : -1),
                (C.compress = !!(4 & I)),
                (C.stretch = !!(8 & I)),
                (C.uniform = !!(16 & I)),
                !!(32 & I) && (C.mix = 64 & I ? i.readFloat() : 1),
                !!(128 & I) && (C.softness = i.readFloat() * n),
                r.ikConstraints.push(C));
            }
            l = i.readInt(!0);
            for (var M, O = 0; O < l; O++) {
              var B = i.readString();
              if (!B)
                throw new Error(
                  'Transform constraint data name must not be null.',
                );
              var P = new wt(B);
              ((P.order = i.readInt(!0)), (M = i.readInt(!0)));
              for (var L = 0; L < M; L++) P.bones.push(r.bones[i.readInt(!0)]);
              P.target = r.bones[i.readInt(!0)];
              var R = i.readByte();
              ((P.skinRequired = !!(1 & R)),
                (P.local = !!(2 & R)),
                (P.relative = !!(4 & R)),
                !!(8 & R) && (P.offsetRotation = i.readFloat()),
                !!(16 & R) && (P.offsetX = i.readFloat() * n),
                !!(32 & R) && (P.offsetY = i.readFloat() * n),
                !!(64 & R) && (P.offsetScaleX = i.readFloat()),
                !!(128 & R) && (P.offsetScaleY = i.readFloat()),
                !!(1 & (R = i.readByte())) && (P.offsetShearY = i.readFloat()),
                !!(2 & R) && (P.mixRotate = i.readFloat()),
                !!(4 & R) && (P.mixX = i.readFloat()),
                !!(8 & R) && (P.mixY = i.readFloat()),
                !!(16 & R) && (P.mixScaleX = i.readFloat()),
                !!(32 & R) && (P.mixScaleY = i.readFloat()),
                !!(64 & R) && (P.mixShearY = i.readFloat()),
                r.transformConstraints.push(P));
            }
            l = i.readInt(!0);
            for (var D, F = 0; F < l; F++) {
              var j = i.readString();
              if (!j)
                throw new Error('Path constraint data name must not be null.');
              var N = new ot(j);
              ((N.order = i.readInt(!0)),
                (N.skinRequired = i.readBoolean()),
                (D = i.readInt(!0)));
              for (var z = 0; z < D; z++) N.bones.push(r.bones[i.readInt(!0)]);
              N.target = r.slots[i.readInt(!0)];
              var U = i.readByte();
              ((N.positionMode = 1 & U),
                (N.spacingMode = (U >> 1) & 3),
                (N.rotateMode = (U >> 3) & 3),
                !!(128 & U) && (N.offsetRotation = i.readFloat()),
                (N.position = i.readFloat()),
                N.positionMode == at.Fixed && (N.position *= n),
                (N.spacing = i.readFloat()),
                (N.spacingMode != st.Length && N.spacingMode != st.Fixed) ||
                  (N.spacing *= n),
                (N.mixRotate = i.readFloat()),
                (N.mixX = i.readFloat()),
                (N.mixY = i.readFloat()),
                r.pathConstraints.push(N));
            }
            l = i.readInt(!0);
            for (var G = 0; G < l; G++) {
              var H = i.readString();
              if (!H)
                throw new Error(
                  'Physics constraint data name must not be null.',
                );
              var Q = new mt(H);
              ((Q.order = i.readInt(!0)), (Q.bone = r.bones[i.readInt(!0)]));
              var V = i.readByte();
              ((Q.skinRequired = !!(1 & V)),
                !!(2 & V) && (Q.x = i.readFloat()),
                !!(4 & V) && (Q.y = i.readFloat()),
                !!(8 & V) && (Q.rotate = i.readFloat()),
                !!(16 & V) && (Q.scaleX = i.readFloat()),
                !!(32 & V) && (Q.shearX = i.readFloat()),
                (Q.limit = (64 & V ? i.readFloat() : 5e3) * n),
                (Q.step = 1 / i.readUnsignedByte()),
                (Q.inertia = i.readFloat()),
                (Q.strength = i.readFloat()),
                (Q.damping = i.readFloat()),
                (Q.massInverse = 128 & V ? i.readFloat() : 1),
                (Q.wind = i.readFloat()),
                (Q.gravity = i.readFloat()),
                !!(1 & (V = i.readByte())) && (Q.inertiaGlobal = !0),
                !!(2 & V) && (Q.strengthGlobal = !0),
                !!(4 & V) && (Q.dampingGlobal = !0),
                !!(8 & V) && (Q.massGlobal = !0),
                !!(16 & V) && (Q.windGlobal = !0),
                !!(32 & V) && (Q.gravityGlobal = !0),
                !!(64 & V) && (Q.mixGlobal = !0),
                (Q.mix = 128 & V ? i.readFloat() : 1),
                r.physicsConstraints.push(Q));
            }
            var q = this.readSkin(i, r, !0, s);
            q && ((r.defaultSkin = q), r.skins.push(q));
            var W = r.skins.length;
            for (b.setArraySize(r.skins, (l = W + i.readInt(!0))); W < l; W++) {
              var Y = this.readSkin(i, r, !1, s);
              if (!Y)
                throw new Error('readSkin() should not have returned null.');
              r.skins[W] = Y;
            }
            l = this.linkedMeshes.length;
            for (var X = 0; X < l; X++) {
              var J = this.linkedMeshes[X],
                K = r.skins[J.skinIndex];
              if (!J.parent)
                throw new Error('Linked mesh parent must not be null');
              var $ = K.getAttachment(J.slotIndex, J.parent);
              if (!$) throw new Error('Parent mesh not found: ' + J.parent);
              ((J.mesh.timelineAttachment = J.inheritTimeline ? $ : J.mesh),
                J.mesh.setParentMesh($),
                null != J.mesh.region && J.mesh.updateRegion());
            }
            ((this.linkedMeshes.length = 0), (l = i.readInt(!0)));
            for (var Z = 0; Z < l; Z++) {
              var ee = i.readString();
              if (!ee) throw new Error('Event data name must not be null');
              var te = new nt(ee);
              ((te.intValue = i.readInt(!1)),
                (te.floatValue = i.readFloat()),
                (te.stringValue = i.readString()),
                (te.audioPath = i.readString()),
                te.audioPath &&
                  ((te.volume = i.readFloat()), (te.balance = i.readFloat())),
                r.events.push(te));
            }
            l = i.readInt(!0);
            for (var ne = 0; ne < l; ne++) {
              var re = i.readString();
              if (!re) throw new Error('Animatio name must not be null.');
              r.animations.push(this.readAnimation(i, re, r));
            }
            return r;
          },
        },
        {
          key: 'readSkin',
          value: function (e, t, n, r) {
            var i = null,
              o = 0;
            if (n) {
              if (0 == (o = e.readInt(!0))) return null;
              i = new yt('default');
            } else {
              var a = e.readString();
              if (!a) throw new Error('Skin name must not be null.');
              ((i = new yt(a)),
                r && m.rgba8888ToColor(i.color, e.readInt32()),
                (i.bones.length = e.readInt(!0)));
              for (var s = 0, l = i.bones.length; s < l; s++)
                i.bones[s] = t.bones[e.readInt(!0)];
              for (var c = 0, u = e.readInt(!0); c < u; c++)
                i.constraints.push(t.ikConstraints[e.readInt(!0)]);
              for (var f = 0, d = e.readInt(!0); f < d; f++)
                i.constraints.push(t.transformConstraints[e.readInt(!0)]);
              for (var h = 0, p = e.readInt(!0); h < p; h++)
                i.constraints.push(t.pathConstraints[e.readInt(!0)]);
              for (var v = 0, g = e.readInt(!0); v < g; v++)
                i.constraints.push(t.physicsConstraints[e.readInt(!0)]);
              o = e.readInt(!0);
            }
            for (var y = 0; y < o; y++)
              for (
                var A = e.readInt(!0), b = 0, w = e.readInt(!0);
                b < w;
                b++
              ) {
                var _ = e.readStringRef();
                if (!_) throw new Error('Attachment name must not be null');
                var x = this.readAttachment(e, t, i, A, _, r);
                x && i.setAttachment(A, _, x);
              }
            return i;
          },
        },
        {
          key: 'readAttachment',
          value: function (e, t, n, r, i, o) {
            var a = this.scale,
              s = e.readByte(),
              l = 8 & s ? e.readStringRef() : i;
            if (!l) throw new Error('Attachment name must not be null');
            switch (7 & s) {
              case Et.Region:
                var c = 16 & s ? e.readStringRef() : null,
                  u = 32 & s ? e.readInt32() : 4294967295,
                  f = 64 & s ? this.readSequence(e) : null,
                  d = 128 & s ? e.readFloat() : 0,
                  h = e.readFloat(),
                  p = e.readFloat(),
                  v = e.readFloat(),
                  g = e.readFloat(),
                  y = e.readFloat(),
                  A = e.readFloat();
                c || (c = l);
                var w = this.attachmentLoader.newRegionAttachment(n, l, c, f);
                return w
                  ? ((w.path = c),
                    (w.x = h * a),
                    (w.y = p * a),
                    (w.scaleX = v),
                    (w.scaleY = g),
                    (w.rotation = d),
                    (w.width = y * a),
                    (w.height = A * a),
                    m.rgba8888ToColor(w.color, u),
                    (w.sequence = f),
                    null == f && w.updateRegion(),
                    w)
                  : null;
              case Et.BoundingBox:
                var _ = this.readVertices(e, !!(16 & s)),
                  x = o ? e.readInt32() : 0,
                  k = this.attachmentLoader.newBoundingBoxAttachment(n, l);
                return k
                  ? ((k.worldVerticesLength = _.length),
                    (k.vertices = _.vertices),
                    (k.bones = _.bones),
                    o && m.rgba8888ToColor(k.color, x),
                    k)
                  : null;
              case Et.Mesh:
                var S = 16 & s ? e.readStringRef() : l,
                  E = 32 & s ? e.readInt32() : 4294967295,
                  C = 64 & s ? this.readSequence(e) : null,
                  T = e.readInt(!0),
                  I = this.readVertices(e, !!(128 & s)),
                  M = this.readFloatArray(e, I.length, 1),
                  O = this.readShortArray(e, 3 * (I.length - T - 2)),
                  B = [],
                  P = 0,
                  L = 0;
                (o &&
                  ((B = this.readShortArray(e, e.readInt(!0))),
                  (P = e.readFloat()),
                  (L = e.readFloat())),
                  S || (S = l));
                var R = this.attachmentLoader.newMeshAttachment(n, l, S, C);
                return R
                  ? ((R.path = S),
                    m.rgba8888ToColor(R.color, E),
                    (R.bones = I.bones),
                    (R.vertices = I.vertices),
                    (R.worldVerticesLength = I.length),
                    (R.triangles = O),
                    (R.regionUVs = M),
                    null == C && R.updateRegion(),
                    (R.hullLength = T << 1),
                    (R.sequence = C),
                    o && ((R.edges = B), (R.width = P * a), (R.height = L * a)),
                    R)
                  : null;
              case Et.LinkedMesh:
                var D = 16 & s ? e.readStringRef() : l;
                if (null == D)
                  throw new Error('Path of linked mesh must not be null');
                var F = 32 & s ? e.readInt32() : 4294967295,
                  j = 64 & s ? this.readSequence(e) : null,
                  N = !!(128 & s),
                  z = e.readInt(!0),
                  U = e.readStringRef(),
                  G = 0,
                  H = 0;
                o && ((G = e.readFloat()), (H = e.readFloat()));
                var Q = this.attachmentLoader.newMeshAttachment(n, l, D, j);
                return Q
                  ? ((Q.path = D),
                    m.rgba8888ToColor(Q.color, F),
                    (Q.sequence = j),
                    o && ((Q.width = G * a), (Q.height = H * a)),
                    this.linkedMeshes.push(new kt(Q, z, r, U, N)),
                    Q)
                  : null;
              case Et.Path:
                for (
                  var V = !!(16 & s),
                    q = !!(32 & s),
                    W = this.readVertices(e, !!(64 & s)),
                    Y = b.newArray(W.length / 6, 0),
                    X = 0,
                    J = Y.length;
                  X < J;
                  X++
                )
                  Y[X] = e.readFloat() * a;
                var K = o ? e.readInt32() : 0,
                  $ = this.attachmentLoader.newPathAttachment(n, l);
                return $
                  ? (($.closed = V),
                    ($.constantSpeed = q),
                    ($.worldVerticesLength = W.length),
                    ($.vertices = W.vertices),
                    ($.bones = W.bones),
                    ($.lengths = Y),
                    o && m.rgba8888ToColor($.color, K),
                    $)
                  : null;
              case Et.Point:
                var Z = e.readFloat(),
                  ee = e.readFloat(),
                  te = e.readFloat(),
                  ne = o ? e.readInt32() : 0,
                  re = this.attachmentLoader.newPointAttachment(n, l);
                return re
                  ? ((re.x = ee * a),
                    (re.y = te * a),
                    (re.rotation = Z),
                    o && m.rgba8888ToColor(re.color, ne),
                    re)
                  : null;
              case Et.Clipping:
                var ie = e.readInt(!0),
                  oe = this.readVertices(e, !!(16 & s)),
                  ae = o ? e.readInt32() : 0,
                  se = this.attachmentLoader.newClippingAttachment(n, l);
                return se
                  ? ((se.endSlot = t.slots[ie]),
                    (se.worldVerticesLength = oe.length),
                    (se.vertices = oe.vertices),
                    (se.bones = oe.bones),
                    o && m.rgba8888ToColor(se.color, ae),
                    se)
                  : null;
            }
            return null;
          },
        },
        {
          key: 'readSequence',
          value: function (e) {
            var t = new T(e.readInt(!0));
            return (
              (t.start = e.readInt(!0)),
              (t.digits = e.readInt(!0)),
              (t.setupIndex = e.readInt(!0)),
              t
            );
          },
        },
        {
          key: 'readVertices',
          value: function (e, t) {
            var n = this.scale,
              r = e.readInt(!0),
              i = new St();
            if (((i.length = r << 1), !t))
              return ((i.vertices = this.readFloatArray(e, i.length, n)), i);
            for (var o = new Array(), a = new Array(), s = 0; s < r; s++) {
              var l = e.readInt(!0);
              a.push(l);
              for (var c = 0; c < l; c++)
                (a.push(e.readInt(!0)),
                  o.push(e.readFloat() * n),
                  o.push(e.readFloat() * n),
                  o.push(e.readFloat()));
            }
            return ((i.vertices = b.toFloatArray(o)), (i.bones = a), i);
          },
        },
        {
          key: 'readFloatArray',
          value: function (e, t, n) {
            var r = new Array(t);
            if (1 == n) for (var i = 0; i < t; i++) r[i] = e.readFloat();
            else for (var o = 0; o < t; o++) r[o] = e.readFloat() * n;
            return r;
          },
        },
        {
          key: 'readShortArray',
          value: function (e, t) {
            for (var n = new Array(t), r = 0; r < t; r++) n[r] = e.readInt(!0);
            return n;
          },
        },
        {
          key: 'readAnimation',
          value: function (e, t, n) {
            e.readInt(!0);
            for (
              var r = new Array(), i = this.scale, o = 0, a = e.readInt(!0);
              o < a;
              o++
            )
              for (
                var s = e.readInt(!0), l = 0, c = e.readInt(!0);
                l < c;
                l++
              ) {
                var u = e.readByte(),
                  f = e.readInt(!0),
                  d = f - 1;
                switch (u) {
                  case Gt:
                    for (var h = new te(f, s), p = 0; p < f; p++)
                      h.setFrame(p, e.readFloat(), e.readStringRef());
                    r.push(h);
                    break;
                  case Ht:
                    for (
                      var m = e.readInt(!0),
                        v = new J(f, m, s),
                        g = e.readFloat(),
                        y = e.readUnsignedByte() / 255,
                        A = e.readUnsignedByte() / 255,
                        w = e.readUnsignedByte() / 255,
                        _ = e.readUnsignedByte() / 255,
                        x = 0,
                        k = 0;
                      v.setFrame(x, g, y, A, w, _), x != d;
                      x++
                    ) {
                      var S = e.readFloat(),
                        E = e.readUnsignedByte() / 255,
                        C = e.readUnsignedByte() / 255,
                        T = e.readUnsignedByte() / 255,
                        I = e.readUnsignedByte() / 255;
                      switch (e.readByte()) {
                        case ln:
                          v.setStepped(x);
                          break;
                        case cn:
                          (It(e, v, k++, x, 0, g, S, y, E, 1),
                            It(e, v, k++, x, 1, g, S, A, C, 1),
                            It(e, v, k++, x, 2, g, S, w, T, 1),
                            It(e, v, k++, x, 3, g, S, _, I, 1));
                      }
                      ((g = S), (y = E), (A = C), (w = T), (_ = I));
                    }
                    r.push(v);
                    break;
                  case Qt:
                    for (
                      var B = e.readInt(!0),
                        P = new K(f, B, s),
                        L = e.readFloat(),
                        R = e.readUnsignedByte() / 255,
                        D = e.readUnsignedByte() / 255,
                        F = e.readUnsignedByte() / 255,
                        j = 0,
                        ue = 0;
                      P.setFrame(j, L, R, D, F), j != d;
                      j++
                    ) {
                      var be = e.readFloat(),
                        we = e.readUnsignedByte() / 255,
                        _e = e.readUnsignedByte() / 255,
                        xe = e.readUnsignedByte() / 255;
                      switch (e.readByte()) {
                        case ln:
                          P.setStepped(j);
                          break;
                        case cn:
                          (It(e, P, ue++, j, 0, L, be, R, we, 1),
                            It(e, P, ue++, j, 1, L, be, D, _e, 1),
                            It(e, P, ue++, j, 2, L, be, F, xe, 1));
                      }
                      ((L = be), (R = we), (D = _e), (F = xe));
                    }
                    r.push(P);
                    break;
                  case Vt:
                    for (
                      var ke = e.readInt(!0),
                        Se = new Z(f, ke, s),
                        Ee = e.readFloat(),
                        Ce = e.readUnsignedByte() / 255,
                        Te = e.readUnsignedByte() / 255,
                        Ie = e.readUnsignedByte() / 255,
                        Me = e.readUnsignedByte() / 255,
                        Oe = e.readUnsignedByte() / 255,
                        Be = e.readUnsignedByte() / 255,
                        Pe = e.readUnsignedByte() / 255,
                        Le = 0,
                        Re = 0;
                      Se.setFrame(Le, Ee, Ce, Te, Ie, Me, Oe, Be, Pe), Le != d;
                      Le++
                    ) {
                      var De = e.readFloat(),
                        Fe = e.readUnsignedByte() / 255,
                        je = e.readUnsignedByte() / 255,
                        Ne = e.readUnsignedByte() / 255,
                        ze = e.readUnsignedByte() / 255,
                        Ue = e.readUnsignedByte() / 255,
                        Ge = e.readUnsignedByte() / 255,
                        He = e.readUnsignedByte() / 255;
                      switch (e.readByte()) {
                        case ln:
                          Se.setStepped(Le);
                          break;
                        case cn:
                          (It(e, Se, Re++, Le, 0, Ee, De, Ce, Fe, 1),
                            It(e, Se, Re++, Le, 1, Ee, De, Te, je, 1),
                            It(e, Se, Re++, Le, 2, Ee, De, Ie, Ne, 1),
                            It(e, Se, Re++, Le, 3, Ee, De, Me, ze, 1),
                            It(e, Se, Re++, Le, 4, Ee, De, Oe, Ue, 1),
                            It(e, Se, Re++, Le, 5, Ee, De, Be, Ge, 1),
                            It(e, Se, Re++, Le, 6, Ee, De, Pe, He, 1));
                      }
                      ((Ee = De),
                        (Ce = Fe),
                        (Te = je),
                        (Ie = Ne),
                        (Me = ze),
                        (Oe = Ue),
                        (Be = Ge),
                        (Pe = He));
                    }
                    r.push(Se);
                    break;
                  case qt:
                    for (
                      var Qe = e.readInt(!0),
                        Ve = new ee(f, Qe, s),
                        qe = e.readFloat(),
                        We = e.readUnsignedByte() / 255,
                        Ye = e.readUnsignedByte() / 255,
                        Xe = e.readUnsignedByte() / 255,
                        Je = e.readUnsignedByte() / 255,
                        Ke = e.readUnsignedByte() / 255,
                        $e = e.readUnsignedByte() / 255,
                        Ze = 0,
                        et = 0;
                      Ve.setFrame(Ze, qe, We, Ye, Xe, Je, Ke, $e), Ze != d;
                      Ze++
                    ) {
                      var nt = e.readFloat(),
                        rt = e.readUnsignedByte() / 255,
                        it = e.readUnsignedByte() / 255,
                        ot = e.readUnsignedByte() / 255,
                        lt = e.readUnsignedByte() / 255,
                        ct = e.readUnsignedByte() / 255,
                        ut = e.readUnsignedByte() / 255;
                      switch (e.readByte()) {
                        case ln:
                          Ve.setStepped(Ze);
                          break;
                        case cn:
                          (It(e, Ve, et++, Ze, 0, qe, nt, We, rt, 1),
                            It(e, Ve, et++, Ze, 1, qe, nt, Ye, it, 1),
                            It(e, Ve, et++, Ze, 2, qe, nt, Xe, ot, 1),
                            It(e, Ve, et++, Ze, 3, qe, nt, Je, lt, 1),
                            It(e, Ve, et++, Ze, 4, qe, nt, Ke, ct, 1),
                            It(e, Ve, et++, Ze, 5, qe, nt, $e, ut, 1));
                      }
                      ((qe = nt),
                        (We = rt),
                        (Ye = it),
                        (Xe = ot),
                        (Je = lt),
                        (Ke = ct),
                        ($e = ut));
                    }
                    r.push(Ve);
                    break;
                  case Wt:
                    for (
                      var ft = new $(f, e.readInt(!0), s),
                        dt = e.readFloat(),
                        ht = e.readUnsignedByte() / 255,
                        pt = 0,
                        mt = 0;
                      ft.setFrame(pt, dt, ht), pt != d;
                      pt++
                    ) {
                      var vt = e.readFloat(),
                        gt = e.readUnsignedByte() / 255;
                      switch (e.readByte()) {
                        case ln:
                          ft.setStepped(pt);
                          break;
                        case cn:
                          It(e, ft, mt++, pt, 0, dt, vt, ht, gt, 1);
                      }
                      ((dt = vt), (ht = gt));
                    }
                    r.push(ft);
                }
              }
            for (var yt = 0, At = e.readInt(!0); yt < At; yt++)
              for (
                var bt = e.readInt(!0), wt = 0, _t = e.readInt(!0);
                wt < _t;
                wt++
              ) {
                var xt = e.readByte(),
                  kt = e.readInt(!0);
                if (xt != Ut) {
                  var St = e.readInt(!0);
                  switch (xt) {
                    case Ot:
                      r.push(Ct(e, new N(kt, St, bt), 1));
                      break;
                    case Bt:
                      r.push(Tt(e, new z(kt, St, bt), i));
                      break;
                    case Pt:
                      r.push(Ct(e, new U(kt, St, bt), i));
                      break;
                    case Lt:
                      r.push(Ct(e, new G(kt, St, bt), i));
                      break;
                    case Rt:
                      r.push(Tt(e, new H(kt, St, bt), 1));
                      break;
                    case Dt:
                      r.push(Ct(e, new Q(kt, St, bt), 1));
                      break;
                    case Ft:
                      r.push(Ct(e, new V(kt, St, bt), 1));
                      break;
                    case jt:
                      r.push(Tt(e, new q(kt, St, bt), 1));
                      break;
                    case Nt:
                      r.push(Ct(e, new W(kt, St, bt), 1));
                      break;
                    case zt:
                      r.push(Ct(e, new Y(kt, St, bt), 1));
                  }
                } else {
                  for (var Et = new X(kt, bt), Mt = 0; Mt < kt; Mt++)
                    Et.setFrame(Mt, e.readFloat(), e.readByte());
                  r.push(Et);
                }
              }
            for (var un = 0, fn = e.readInt(!0); un < fn; un++) {
              for (
                var dn = e.readInt(!0),
                  hn = e.readInt(!0),
                  pn = hn - 1,
                  mn = new oe(hn, e.readInt(!0), dn),
                  vn = e.readByte(),
                  gn = e.readFloat(),
                  yn = 1 & vn ? (2 & vn ? e.readFloat() : 1) : 0,
                  An = 4 & vn ? e.readFloat() * i : 0,
                  bn = 0,
                  wn = 0;
                mn.setFrame(
                  bn,
                  gn,
                  yn,
                  An,
                  8 & vn ? 1 : -1,
                  !!(16 & vn),
                  !!(32 & vn),
                ),
                  bn != pn;
                bn++
              ) {
                vn = e.readByte();
                var _n = e.readFloat(),
                  xn = 1 & vn ? (2 & vn ? e.readFloat() : 1) : 0,
                  kn = 4 & vn ? e.readFloat() * i : 0;
                (64 & vn
                  ? mn.setStepped(bn)
                  : !!(128 & vn) &&
                    (It(e, mn, wn++, bn, 0, gn, _n, yn, xn, 1),
                    It(e, mn, wn++, bn, 1, gn, _n, An, kn, i)),
                  (gn = _n),
                  (yn = xn),
                  (An = kn));
              }
              r.push(mn);
            }
            for (var Sn = 0, En = e.readInt(!0); Sn < En; Sn++) {
              for (
                var Cn = e.readInt(!0),
                  Tn = e.readInt(!0),
                  In = Tn - 1,
                  Mn = new ae(Tn, e.readInt(!0), Cn),
                  On = e.readFloat(),
                  Bn = e.readFloat(),
                  Pn = e.readFloat(),
                  Ln = e.readFloat(),
                  Rn = e.readFloat(),
                  Dn = e.readFloat(),
                  Fn = e.readFloat(),
                  jn = 0,
                  Nn = 0;
                Mn.setFrame(jn, On, Bn, Pn, Ln, Rn, Dn, Fn), jn != In;
                jn++
              ) {
                var zn = e.readFloat(),
                  Un = e.readFloat(),
                  Gn = e.readFloat(),
                  Hn = e.readFloat(),
                  Qn = e.readFloat(),
                  Vn = e.readFloat(),
                  qn = e.readFloat();
                switch (e.readByte()) {
                  case ln:
                    Mn.setStepped(jn);
                    break;
                  case cn:
                    (It(e, Mn, Nn++, jn, 0, On, zn, Bn, Un, 1),
                      It(e, Mn, Nn++, jn, 1, On, zn, Pn, Gn, 1),
                      It(e, Mn, Nn++, jn, 2, On, zn, Ln, Hn, 1),
                      It(e, Mn, Nn++, jn, 3, On, zn, Rn, Qn, 1),
                      It(e, Mn, Nn++, jn, 4, On, zn, Dn, Vn, 1),
                      It(e, Mn, Nn++, jn, 5, On, zn, Fn, qn, 1));
                }
                ((On = zn),
                  (Bn = Un),
                  (Pn = Gn),
                  (Ln = Hn),
                  (Rn = Qn),
                  (Dn = Vn),
                  (Fn = qn));
              }
              r.push(Mn);
            }
            for (var Wn = 0, Yn = e.readInt(!0); Wn < Yn; Wn++)
              for (
                var Xn = e.readInt(!0),
                  Jn = n.pathConstraints[Xn],
                  Kn = 0,
                  $n = e.readInt(!0);
                Kn < $n;
                Kn++
              ) {
                var Zn = e.readByte(),
                  er = e.readInt(!0),
                  tr = e.readInt(!0);
                switch (Zn) {
                  case Jt:
                    r.push(
                      Ct(
                        e,
                        new se(er, tr, Xn),
                        Jn.positionMode == at.Fixed ? i : 1,
                      ),
                    );
                    break;
                  case Kt:
                    r.push(
                      Ct(
                        e,
                        new le(er, tr, Xn),
                        Jn.spacingMode == st.Length ||
                          Jn.spacingMode == st.Fixed
                          ? i
                          : 1,
                      ),
                    );
                    break;
                  case $t:
                    for (
                      var nr = new ce(er, tr, Xn),
                        rr = e.readFloat(),
                        ir = e.readFloat(),
                        or = e.readFloat(),
                        ar = e.readFloat(),
                        sr = 0,
                        lr = 0,
                        cr = nr.getFrameCount() - 1;
                      nr.setFrame(sr, rr, ir, or, ar), sr != cr;
                      sr++
                    ) {
                      var ur = e.readFloat(),
                        fr = e.readFloat(),
                        dr = e.readFloat(),
                        hr = e.readFloat();
                      switch (e.readByte()) {
                        case ln:
                          nr.setStepped(sr);
                          break;
                        case cn:
                          (It(e, nr, lr++, sr, 0, rr, ur, ir, fr, 1),
                            It(e, nr, lr++, sr, 1, rr, ur, or, dr, 1),
                            It(e, nr, lr++, sr, 2, rr, ur, ar, hr, 1));
                      }
                      ((rr = ur), (ir = fr), (or = dr), (ar = hr));
                    }
                    r.push(nr);
                }
              }
            for (var pr = 0, mr = e.readInt(!0); pr < mr; pr++)
              for (
                var vr = e.readInt(!0) - 1, gr = 0, yr = e.readInt(!0);
                gr < yr;
                gr++
              ) {
                var Ar = e.readByte(),
                  br = e.readInt(!0);
                if (Ar != sn) {
                  var wr = e.readInt(!0);
                  switch (Ar) {
                    case Zt:
                      r.push(Ct(e, new fe(br, wr, vr), 1));
                      break;
                    case en:
                      r.push(Ct(e, new de(br, wr, vr), 1));
                      break;
                    case tn:
                      r.push(Ct(e, new he(br, wr, vr), 1));
                      break;
                    case nn:
                      r.push(Ct(e, new pe(br, wr, vr), 1));
                      break;
                    case rn:
                      r.push(Ct(e, new me(br, wr, vr), 1));
                      break;
                    case on:
                      r.push(Ct(e, new ve(br, wr, vr), 1));
                      break;
                    case an:
                      r.push(Ct(e, new ge(br, wr, vr), 1));
                  }
                } else {
                  for (var _r = new ye(br, vr), xr = 0; xr < br; xr++)
                    _r.setFrame(xr, e.readFloat());
                  r.push(_r);
                }
              }
            for (var kr = 0, Sr = e.readInt(!0); kr < Sr; kr++)
              for (
                var Er = n.skins[e.readInt(!0)], Cr = 0, Tr = e.readInt(!0);
                Cr < Tr;
                Cr++
              )
                for (
                  var Ir = e.readInt(!0), Mr = 0, Or = e.readInt(!0);
                  Mr < Or;
                  Mr++
                ) {
                  var Br = e.readStringRef();
                  if (!Br) throw new Error('attachmentName must not be null.');
                  var Pr = Er.getAttachment(Ir, Br),
                    Lr = e.readByte(),
                    Rr = e.readInt(!0),
                    Dr = Rr - 1;
                  switch (Lr) {
                    case Yt:
                      for (
                        var Fr = Pr,
                          jr = Fr.bones,
                          Nr = Fr.vertices,
                          zr = jr ? (Nr.length / 3) * 2 : Nr.length,
                          Ur = e.readInt(!0),
                          Gr = new ne(Rr, Ur, Ir, Fr),
                          Hr = e.readFloat(),
                          Qr = 0,
                          Vr = 0;
                        ;
                        Qr++
                      ) {
                        var qr = void 0,
                          Wr = e.readInt(!0);
                        if (0 == Wr) qr = jr ? b.newFloatArray(zr) : Nr;
                        else {
                          qr = b.newFloatArray(zr);
                          var Yr = e.readInt(!0);
                          if (((Wr += Yr), 1 == i))
                            for (var Xr = Yr; Xr < Wr; Xr++)
                              qr[Xr] = e.readFloat();
                          else
                            for (var Jr = Yr; Jr < Wr; Jr++)
                              qr[Jr] = e.readFloat() * i;
                          if (!jr)
                            for (var Kr = 0, $r = qr.length; Kr < $r; Kr++)
                              qr[Kr] += Nr[Kr];
                        }
                        if ((Gr.setFrame(Qr, Hr, qr), Qr == Dr)) break;
                        var Zr = e.readFloat();
                        switch (e.readByte()) {
                          case ln:
                            Gr.setStepped(Qr);
                            break;
                          case cn:
                            It(e, Gr, Vr++, Qr, 0, Hr, Zr, 0, 1, 1);
                        }
                        Hr = Zr;
                      }
                      r.push(Gr);
                      break;
                    case Xt:
                      for (var ei = new Ae(Rr, Ir, Pr), ti = 0; ti < Rr; ti++) {
                        var ni = e.readFloat(),
                          ri = e.readInt32();
                        ei.setFrame(ti, ni, M[15 & ri], ri >> 4, e.readFloat());
                      }
                      r.push(ei);
                  }
                }
            var ii = e.readInt(!0);
            if (ii > 0) {
              for (
                var oi = new ie(ii), ai = n.slots.length, si = 0;
                si < ii;
                si++
              ) {
                for (
                  var li = e.readFloat(),
                    ci = e.readInt(!0),
                    ui = b.newArray(ai, 0),
                    fi = ai - 1;
                  fi >= 0;
                  fi--
                )
                  ui[fi] = -1;
                for (
                  var di = b.newArray(ai - ci, 0), hi = 0, pi = 0, mi = 0;
                  mi < ci;
                  mi++
                ) {
                  for (var vi = e.readInt(!0); hi != vi;) di[pi++] = hi++;
                  ui[hi + e.readInt(!0)] = hi++;
                }
                for (; hi < ai;) di[pi++] = hi++;
                for (var gi = ai - 1; gi >= 0; gi--)
                  -1 == ui[gi] && (ui[gi] = di[--pi]);
                oi.setFrame(si, li, ui);
              }
              r.push(oi);
            }
            var yi = e.readInt(!0);
            if (yi > 0) {
              for (var Ai = new re(yi), bi = 0; bi < yi; bi++) {
                var wi = e.readFloat(),
                  _i = n.events[e.readInt(!0)],
                  xi = new tt(wi, _i);
                ((xi.intValue = e.readInt(!1)),
                  (xi.floatValue = e.readFloat()),
                  (xi.stringValue = e.readString()),
                  null == xi.stringValue && (xi.stringValue = _i.stringValue),
                  xi.data.audioPath &&
                    ((xi.volume = e.readFloat()), (xi.balance = e.readFloat())),
                  Ai.setFrame(bi, xi));
              }
              r.push(Ai);
            }
            for (var ki = 0, Si = 0, Ei = r.length; Si < Ei; Si++)
              ki = Math.max(ki, r[Si].getDuration());
            return new O(t, r, ki);
          },
        },
      ]),
      e
    );
  })(),
  xt = (function () {
    function e(t) {
      var n =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : new Array(),
        r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
        i =
          arguments.length > 3 && void 0 !== arguments[3]
            ? arguments[3]
            : new DataView(t.buffer);
      (d(this, e), (this.strings = n), (this.index = r), (this.buffer = i));
    }
    return (
      a(e, [
        {
          key: 'readByte',
          value: function () {
            return this.buffer.getInt8(this.index++);
          },
        },
        {
          key: 'readUnsignedByte',
          value: function () {
            return this.buffer.getUint8(this.index++);
          },
        },
        {
          key: 'readShort',
          value: function () {
            var e = this.buffer.getInt16(this.index);
            return ((this.index += 2), e);
          },
        },
        {
          key: 'readInt32',
          value: function () {
            var e = this.buffer.getInt32(this.index);
            return ((this.index += 4), e);
          },
        },
        {
          key: 'readInt',
          value: function (e) {
            var t = this.readByte(),
              n = 127 & t;
            return (
              !!(128 & t) &&
                ((n |= (127 & (t = this.readByte())) << 7),
                !!(128 & t) &&
                  ((n |= (127 & (t = this.readByte())) << 14),
                  !!(128 & t) &&
                    ((n |= (127 & (t = this.readByte())) << 21),
                    !!(128 & t) &&
                      (n |= (127 & (t = this.readByte())) << 28)))),
              e ? n : (n >>> 1) ^ -(1 & n)
            );
          },
        },
        {
          key: 'readStringRef',
          value: function () {
            var e = this.readInt(!0);
            return 0 == e ? null : this.strings[e - 1];
          },
        },
        {
          key: 'readString',
          value: function () {
            var e = this.readInt(!0);
            switch (e) {
              case 0:
                return null;
              case 1:
                return '';
            }
            e--;
            for (var t = '', n = 0; n < e;) {
              var r = this.readUnsignedByte();
              switch (r >> 4) {
                case 12:
                case 13:
                  ((t += String.fromCharCode(
                    ((31 & r) << 6) | (63 & this.readByte()),
                  )),
                    (n += 2));
                  break;
                case 14:
                  ((t += String.fromCharCode(
                    ((15 & r) << 12) |
                      ((63 & this.readByte()) << 6) |
                      (63 & this.readByte()),
                  )),
                    (n += 3));
                  break;
                default:
                  ((t += String.fromCharCode(r)), n++);
              }
            }
            return t;
          },
        },
        {
          key: 'readFloat',
          value: function () {
            var e = this.buffer.getFloat32(this.index);
            return ((this.index += 4), e);
          },
        },
        {
          key: 'readBoolean',
          value: function () {
            return 0 != this.readByte();
          },
        },
      ]),
      e
    );
  })(),
  kt = function e(t, n, r, i, o) {
    (d(this, e),
      (this.mesh = t),
      (this.skinIndex = n),
      (this.slotIndex = r),
      (this.parent = i),
      (this.inheritTimeline = o));
  },
  St = function e() {
    var t =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
      n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
      r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
    (d(this, e), (this.bones = t), (this.vertices = n), (this.length = r));
  },
  Et = void 0;
function Ct(e, t, n) {
  for (
    var r = e.readFloat(),
      i = e.readFloat() * n,
      o = 0,
      a = 0,
      s = t.getFrameCount() - 1;
    t.setFrame(o, r, i), o != s;
    o++
  ) {
    var l = e.readFloat(),
      c = e.readFloat() * n;
    switch (e.readByte()) {
      case ln:
        t.setStepped(o);
        break;
      case cn:
        It(e, t, a++, o, 0, r, l, i, c, n);
    }
    ((r = l), (i = c));
  }
  return t;
}
function Tt(e, t, n) {
  for (
    var r = e.readFloat(),
      i = e.readFloat() * n,
      o = e.readFloat() * n,
      a = 0,
      s = 0,
      l = t.getFrameCount() - 1;
    t.setFrame(a, r, i, o), a != l;
    a++
  ) {
    var c = e.readFloat(),
      u = e.readFloat() * n,
      f = e.readFloat() * n;
    switch (e.readByte()) {
      case ln:
        t.setStepped(a);
        break;
      case cn:
        (It(e, t, s++, a, 0, r, c, i, u, n),
          It(e, t, s++, a, 1, r, c, o, f, n));
    }
    ((r = c), (i = u), (o = f));
  }
  return t;
}
function It(e, t, n, r, i, o, a, s, l, c) {
  t.setBezier(
    n,
    r,
    i,
    o,
    s,
    e.readFloat(),
    e.readFloat() * c,
    e.readFloat(),
    e.readFloat() * c,
    a,
    l,
  );
}
!(function (e) {
  ((e[(e.Region = 0)] = 'Region'),
    (e[(e.BoundingBox = 1)] = 'BoundingBox'),
    (e[(e.Mesh = 2)] = 'Mesh'),
    (e[(e.LinkedMesh = 3)] = 'LinkedMesh'),
    (e[(e.Path = 4)] = 'Path'),
    (e[(e.Point = 5)] = 'Point'),
    (e[(e.Clipping = 6)] = 'Clipping'));
})(Et || (Et = {}));
var Mt,
  Ot = 0,
  Bt = 1,
  Pt = 2,
  Lt = 3,
  Rt = 4,
  Dt = 5,
  Ft = 6,
  jt = 7,
  Nt = 8,
  zt = 9,
  Ut = 10,
  Gt = 0,
  Ht = 1,
  Qt = 2,
  Vt = 3,
  qt = 4,
  Wt = 5,
  Yt = 0,
  Xt = 1,
  Jt = 0,
  Kt = 1,
  $t = 2,
  Zt = 0,
  en = 1,
  tn = 2,
  nn = 4,
  rn = 5,
  on = 6,
  an = 7,
  sn = 8,
  ln = 1,
  cn = 2,
  un = (function () {
    function e() {
      (d(this, e),
        (this.minX = 0),
        (this.minY = 0),
        (this.maxX = 0),
        (this.maxY = 0),
        (this.boundingBoxes = new Array()),
        (this.polygons = new Array()),
        (this.polygonPool = new _(function () {
          return b.newFloatArray(16);
        })));
    }
    return (
      a(e, [
        {
          key: 'update',
          value: function (e, t) {
            if (!e) throw new Error('skeleton cannot be null.');
            var n = this.boundingBoxes,
              r = this.polygons,
              i = this.polygonPool,
              o = e.slots,
              a = o.length;
            ((n.length = 0), i.freeAll(r), (r.length = 0));
            for (var s = 0; s < a; s++) {
              var l = o[s];
              if (l.bone.active) {
                var c = l.getAttachment();
                if (c instanceof Pe) {
                  var u = c;
                  n.push(u);
                  var f = i.obtain();
                  (f.length != u.worldVerticesLength &&
                    (f = b.newFloatArray(u.worldVerticesLength)),
                    r.push(f),
                    u.computeWorldVertices(
                      l,
                      0,
                      u.worldVerticesLength,
                      f,
                      0,
                      2,
                    ));
                }
              }
            }
            t
              ? this.aabbCompute()
              : ((this.minX = Number.POSITIVE_INFINITY),
                (this.minY = Number.POSITIVE_INFINITY),
                (this.maxX = Number.NEGATIVE_INFINITY),
                (this.maxY = Number.NEGATIVE_INFINITY));
          },
        },
        {
          key: 'aabbCompute',
          value: function () {
            for (
              var e = Number.POSITIVE_INFINITY,
                t = Number.POSITIVE_INFINITY,
                n = Number.NEGATIVE_INFINITY,
                r = Number.NEGATIVE_INFINITY,
                i = this.polygons,
                o = 0,
                a = i.length;
              o < a;
              o++
            )
              for (var s = i[o], l = s, c = 0, u = s.length; c < u; c += 2) {
                var f = l[c],
                  d = l[c + 1];
                ((e = Math.min(e, f)),
                  (t = Math.min(t, d)),
                  (n = Math.max(n, f)),
                  (r = Math.max(r, d)));
              }
            ((this.minX = e),
              (this.minY = t),
              (this.maxX = n),
              (this.maxY = r));
          },
        },
        {
          key: 'aabbContainsPoint',
          value: function (e, t) {
            return (
              e >= this.minX &&
              e <= this.maxX &&
              t >= this.minY &&
              t <= this.maxY
            );
          },
        },
        {
          key: 'aabbIntersectsSegment',
          value: function (e, t, n, r) {
            var i = this.minX,
              o = this.minY,
              a = this.maxX,
              s = this.maxY;
            if (
              (e <= i && n <= i) ||
              (t <= o && r <= o) ||
              (e >= a && n >= a) ||
              (t >= s && r >= s)
            )
              return !1;
            var l = (r - t) / (n - e),
              c = l * (i - e) + t;
            if (c > o && c < s) return !0;
            if ((c = l * (a - e) + t) > o && c < s) return !0;
            var u = (o - t) / l + e;
            return (u > i && u < a) || ((u = (s - t) / l + e) > i && u < a);
          },
        },
        {
          key: 'aabbIntersectsSkeleton',
          value: function (e) {
            return (
              this.minX < e.maxX &&
              this.maxX > e.minX &&
              this.minY < e.maxY &&
              this.maxY > e.minY
            );
          },
        },
        {
          key: 'containsPoint',
          value: function (e, t) {
            for (var n = this.polygons, r = 0, i = n.length; r < i; r++)
              if (this.containsPointPolygon(n[r], e, t))
                return this.boundingBoxes[r];
            return null;
          },
        },
        {
          key: 'containsPointPolygon',
          value: function (e, t, n) {
            for (
              var r = e, i = e.length, o = i - 2, a = !1, s = 0;
              s < i;
              s += 2
            ) {
              var l = r[s + 1],
                c = r[o + 1];
              if ((l < n && c >= n) || (c < n && l >= n)) {
                var u = r[s];
                u + ((n - l) / (c - l)) * (r[o] - u) < t && (a = !a);
              }
              o = s;
            }
            return a;
          },
        },
        {
          key: 'intersectsSegment',
          value: function (e, t, n, r) {
            for (var i = this.polygons, o = 0, a = i.length; o < a; o++)
              if (this.intersectsSegmentPolygon(i[o], e, t, n, r))
                return this.boundingBoxes[o];
            return null;
          },
        },
        {
          key: 'intersectsSegmentPolygon',
          value: function (e, t, n, r, i) {
            for (
              var o = e,
                a = e.length,
                s = t - r,
                l = n - i,
                c = t * i - n * r,
                u = o[a - 2],
                f = o[a - 1],
                d = 0;
              d < a;
              d += 2
            ) {
              var h = o[d],
                p = o[d + 1],
                m = u * p - f * h,
                v = u - h,
                g = f - p,
                y = s * g - l * v,
                A = (c * v - s * m) / y;
              if (
                ((A >= u && A <= h) || (A >= h && A <= u)) &&
                ((A >= t && A <= r) || (A >= r && A <= t))
              ) {
                var b = (c * g - l * m) / y;
                if (
                  ((b >= f && b <= p) || (b >= p && b <= f)) &&
                  ((b >= n && b <= i) || (b >= i && b <= n))
                )
                  return !0;
              }
              ((u = h), (f = p));
            }
            return !1;
          },
        },
        {
          key: 'getPolygon',
          value: function (e) {
            if (!e) throw new Error('boundingBox cannot be null.');
            var t = this.boundingBoxes.indexOf(e);
            return -1 == t ? null : this.polygons[t];
          },
        },
        {
          key: 'getWidth',
          value: function () {
            return this.maxX - this.minX;
          },
        },
        {
          key: 'getHeight',
          value: function () {
            return this.maxY - this.minY;
          },
        },
      ]),
      e
    );
  })(),
  fn = (function () {
    function e() {
      (d(this, e),
        (this.convexPolygons = new Array()),
        (this.convexPolygonsIndices = new Array()),
        (this.indicesArray = new Array()),
        (this.isConcaveArray = new Array()),
        (this.triangles = new Array()),
        (this.polygonPool = new _(function () {
          return new Array();
        })),
        (this.polygonIndicesPool = new _(function () {
          return new Array();
        })));
    }
    return (
      a(
        e,
        [
          {
            key: 'triangulate',
            value: function (t) {
              var n = t,
                r = t.length >> 1,
                i = this.indicesArray;
              i.length = 0;
              for (var o = 0; o < r; o++) i[o] = o;
              var a = this.isConcaveArray;
              a.length = 0;
              for (var s = 0, l = r; s < l; ++s) a[s] = e.isConcave(s, r, n, i);
              var c = this.triangles;
              for (c.length = 0; r > 3;) {
                for (var u = r - 1, f = 0, d = 1; ;) {
                  e: if (!a[f]) {
                    for (
                      var h = i[u] << 1,
                        p = i[f] << 1,
                        m = i[d] << 1,
                        v = n[h],
                        g = n[h + 1],
                        y = n[p],
                        A = n[p + 1],
                        b = n[m],
                        w = n[m + 1],
                        _ = (d + 1) % r;
                      _ != u;
                      _ = (_ + 1) % r
                    )
                      if (a[_]) {
                        var x = i[_] << 1,
                          k = n[x],
                          S = n[x + 1];
                        if (
                          e.positiveArea(b, w, v, g, k, S) &&
                          e.positiveArea(v, g, y, A, k, S) &&
                          e.positiveArea(y, A, b, w, k, S)
                        )
                          break e;
                      }
                    break;
                  }
                  if (0 == d) {
                    do {
                      if (!a[f]) break;
                      f--;
                    } while (f > 0);
                    break;
                  }
                  ((u = f), (f = d), (d = (d + 1) % r));
                }
                (c.push(i[(r + f - 1) % r]),
                  c.push(i[f]),
                  c.push(i[(f + 1) % r]),
                  i.splice(f, 1),
                  a.splice(f, 1));
                var E = (--r + f - 1) % r,
                  C = f == r ? 0 : f;
                ((a[E] = e.isConcave(E, r, n, i)),
                  (a[C] = e.isConcave(C, r, n, i)));
              }
              return (3 == r && (c.push(i[2]), c.push(i[0]), c.push(i[1])), c);
            },
          },
          {
            key: 'decompose',
            value: function (t, n) {
              var r = t,
                i = this.convexPolygons;
              (this.polygonPool.freeAll(i), (i.length = 0));
              var o = this.convexPolygonsIndices;
              (this.polygonIndicesPool.freeAll(o), (o.length = 0));
              var a = this.polygonIndicesPool.obtain();
              a.length = 0;
              var s = this.polygonPool.obtain();
              s.length = 0;
              for (var l = -1, c = 0, u = 0, f = n.length; u < f; u += 3) {
                var d = n[u] << 1,
                  h = n[u + 1] << 1,
                  p = n[u + 2] << 1,
                  m = r[d],
                  v = r[d + 1],
                  g = r[h],
                  y = r[h + 1],
                  A = r[p],
                  b = r[p + 1],
                  w = !1;
                if (l == d) {
                  var _ = s.length - 4,
                    x = e.winding(s[_], s[_ + 1], s[_ + 2], s[_ + 3], A, b),
                    k = e.winding(A, b, s[0], s[1], s[2], s[3]);
                  x == c &&
                    k == c &&
                    (s.push(A), s.push(b), a.push(p), (w = !0));
                }
                w ||
                  (s.length > 0
                    ? (i.push(s), o.push(a))
                    : (this.polygonPool.free(s),
                      this.polygonIndicesPool.free(a)),
                  ((s = this.polygonPool.obtain()).length = 0),
                  s.push(m),
                  s.push(v),
                  s.push(g),
                  s.push(y),
                  s.push(A),
                  s.push(b),
                  ((a = this.polygonIndicesPool.obtain()).length = 0),
                  a.push(d),
                  a.push(h),
                  a.push(p),
                  (c = e.winding(m, v, g, y, A, b)),
                  (l = d));
              }
              s.length > 0 && (i.push(s), o.push(a));
              for (var S = 0, E = i.length; S < E; S++)
                if (0 != (a = o[S]).length)
                  for (
                    var C = a[0],
                      T = a[a.length - 1],
                      I = (s = i[S]).length - 4,
                      M = s[I],
                      O = s[I + 1],
                      B = s[I + 2],
                      P = s[I + 3],
                      L = s[0],
                      R = s[1],
                      D = s[2],
                      F = s[3],
                      j = e.winding(M, O, B, P, L, R),
                      N = 0;
                    N < E;
                    N++
                  )
                    if (N != S) {
                      var z = o[N];
                      if (3 == z.length) {
                        var U = z[0],
                          G = z[1],
                          H = z[2],
                          Q = i[N],
                          V = Q[Q.length - 2],
                          q = Q[Q.length - 1];
                        if (U == C && G == T) {
                          var W = e.winding(M, O, B, P, V, q),
                            Y = e.winding(V, q, L, R, D, F);
                          W == j &&
                            Y == j &&
                            ((Q.length = 0),
                            (z.length = 0),
                            s.push(V),
                            s.push(q),
                            a.push(H),
                            (M = B),
                            (O = P),
                            (B = V),
                            (P = q),
                            (N = 0));
                        }
                      }
                    }
              for (var X = i.length - 1; X >= 0; X--)
                0 == (s = i[X]).length &&
                  (i.splice(X, 1),
                  this.polygonPool.free(s),
                  (a = o[X]),
                  o.splice(X, 1),
                  this.polygonIndicesPool.free(a));
              return i;
            },
          },
        ],
        [
          {
            key: 'isConcave',
            value: function (e, t, n, r) {
              var i = r[(t + e - 1) % t] << 1,
                o = r[e] << 1,
                a = r[(e + 1) % t] << 1;
              return !this.positiveArea(
                n[i],
                n[i + 1],
                n[o],
                n[o + 1],
                n[a],
                n[a + 1],
              );
            },
          },
          {
            key: 'positiveArea',
            value: function (e, t, n, r, i, o) {
              return e * (o - r) + n * (t - o) + i * (r - t) >= 0;
            },
          },
          {
            key: 'winding',
            value: function (e, t, n, r, i, o) {
              var a = n - e,
                s = r - t;
              return i * s - o * a + a * t - e * s >= 0 ? 1 : -1;
            },
          },
        ],
      ),
      e
    );
  })(),
  dn = (function () {
    function e() {
      (d(this, e),
        (this.triangulator = new fn()),
        (this.clippingPolygon = new Array()),
        (this.clipOutput = new Array()),
        (this.clippedVertices = new Array()),
        (this.clippedTriangles = new Array()),
        (this.scratch = new Array()),
        (this.clipAttachment = null),
        (this.clippingPolygons = null));
    }
    return (
      a(
        e,
        [
          {
            key: 'clipStart',
            value: function (t, n) {
              if (this.clipAttachment) return 0;
              this.clipAttachment = n;
              var r = n.worldVerticesLength,
                i = b.setArraySize(this.clippingPolygon, r);
              n.computeWorldVertices(t, 0, r, i, 0, 2);
              var o = this.clippingPolygon;
              e.makeClockwise(o);
              for (
                var a = (this.clippingPolygons = this.triangulator.decompose(
                    o,
                    this.triangulator.triangulate(o),
                  )),
                  s = 0,
                  l = a.length;
                s < l;
                s++
              ) {
                var c = a[s];
                (e.makeClockwise(c), c.push(c[0]), c.push(c[1]));
              }
              return a.length;
            },
          },
          {
            key: 'clipEndWithSlot',
            value: function (e) {
              this.clipAttachment &&
                this.clipAttachment.endSlot == e.data &&
                this.clipEnd();
            },
          },
          {
            key: 'clipEnd',
            value: function () {
              this.clipAttachment &&
                ((this.clipAttachment = null),
                (this.clippingPolygons = null),
                (this.clippedVertices.length = 0),
                (this.clippedTriangles.length = 0),
                (this.clippingPolygon.length = 0));
            },
          },
          {
            key: 'isClipping',
            value: function () {
              return null != this.clipAttachment;
            },
          },
          {
            key: 'clipTriangles',
            value: function (e, t, n, r, i, o, a, s) {
              i && o && a && 'boolean' == typeof s
                ? this.clipTrianglesRender(e, t, n, r, i, o, a, s)
                : this.clipTrianglesNoRender(e, t, n, r);
            },
          },
          {
            key: 'clipTrianglesNoRender',
            value: function (e, t, n, r) {
              var i = this.clipOutput,
                o = this.clippedVertices,
                a = this.clippedTriangles,
                s = this.clippingPolygons,
                l = s.length,
                c = 0;
              ((o.length = 0), (a.length = 0));
              e: for (var u = 0; u < r; u += 3)
                for (
                  var f = n[u] << 1,
                    d = e[f],
                    h = e[f + 1],
                    p = e[(f = n[u + 1] << 1)],
                    m = e[f + 1],
                    v = e[(f = n[u + 2] << 1)],
                    g = e[f + 1],
                    y = 0;
                  y < l;
                  y++
                ) {
                  var A = o.length;
                  if (!this.clip(d, h, p, m, v, g, s[y], i)) {
                    var w = b.setArraySize(o, A + 6);
                    ((w[A] = d),
                      (w[A + 1] = h),
                      (w[A + 2] = p),
                      (w[A + 3] = m),
                      (w[A + 4] = v),
                      (w[A + 5] = g),
                      (A = a.length));
                    var _ = b.setArraySize(a, A + 3);
                    ((_[A] = c),
                      (_[A + 1] = c + 1),
                      (_[A + 2] = c + 2),
                      (c += 3));
                    continue e;
                  }
                  var x = i.length;
                  if (0 != x) {
                    for (
                      var k = x >> 1,
                        S = this.clipOutput,
                        E = b.setArraySize(o, A + 2 * k),
                        C = 0;
                      C < x;
                      C += 2
                    ) {
                      var T = S[C],
                        I = S[C + 1];
                      ((E[A] = T), (E[A + 1] = I), (A += 2));
                    }
                    A = a.length;
                    var M = b.setArraySize(a, A + 3 * (k - 2));
                    k--;
                    for (var O = 1; O < k; O++)
                      ((M[A] = c),
                        (M[A + 1] = c + O),
                        (M[A + 2] = c + O + 1),
                        (A += 3));
                    c += k + 1;
                  }
                }
            },
          },
          {
            key: 'clipTrianglesRender',
            value: function (e, t, n, r, i, o, a, s) {
              var l = this.clipOutput,
                c = this.clippedVertices,
                u = this.clippedTriangles,
                f = this.clippingPolygons,
                d = f.length,
                h = s ? 12 : 8,
                p = 0;
              ((c.length = 0), (u.length = 0));
              e: for (var m = 0; m < r; m += 3)
                for (
                  var v = n[m] << 1,
                    g = e[v],
                    y = e[v + 1],
                    A = i[v],
                    w = i[v + 1],
                    _ = e[(v = n[m + 1] << 1)],
                    x = e[v + 1],
                    k = i[v],
                    S = i[v + 1],
                    E = e[(v = n[m + 2] << 1)],
                    C = e[v + 1],
                    T = i[v],
                    I = i[v + 1],
                    M = 0;
                  M < d;
                  M++
                ) {
                  var O = c.length;
                  if (!this.clip(g, y, _, x, E, C, f[M], l)) {
                    var B = b.setArraySize(c, O + 3 * h);
                    ((B[O] = g),
                      (B[O + 1] = y),
                      (B[O + 2] = o.r),
                      (B[O + 3] = o.g),
                      (B[O + 4] = o.b),
                      (B[O + 5] = o.a),
                      s
                        ? ((B[O + 6] = A),
                          (B[O + 7] = w),
                          (B[O + 8] = a.r),
                          (B[O + 9] = a.g),
                          (B[O + 10] = a.b),
                          (B[O + 11] = a.a),
                          (B[O + 12] = _),
                          (B[O + 13] = x),
                          (B[O + 14] = o.r),
                          (B[O + 15] = o.g),
                          (B[O + 16] = o.b),
                          (B[O + 17] = o.a),
                          (B[O + 18] = k),
                          (B[O + 19] = S),
                          (B[O + 20] = a.r),
                          (B[O + 21] = a.g),
                          (B[O + 22] = a.b),
                          (B[O + 23] = a.a),
                          (B[O + 24] = E),
                          (B[O + 25] = C),
                          (B[O + 26] = o.r),
                          (B[O + 27] = o.g),
                          (B[O + 28] = o.b),
                          (B[O + 29] = o.a),
                          (B[O + 30] = T),
                          (B[O + 31] = I),
                          (B[O + 32] = a.r),
                          (B[O + 33] = a.g),
                          (B[O + 34] = a.b),
                          (B[O + 35] = a.a))
                        : ((B[O + 6] = A),
                          (B[O + 7] = w),
                          (B[O + 8] = _),
                          (B[O + 9] = x),
                          (B[O + 10] = o.r),
                          (B[O + 11] = o.g),
                          (B[O + 12] = o.b),
                          (B[O + 13] = o.a),
                          (B[O + 14] = k),
                          (B[O + 15] = S),
                          (B[O + 16] = E),
                          (B[O + 17] = C),
                          (B[O + 18] = o.r),
                          (B[O + 19] = o.g),
                          (B[O + 20] = o.b),
                          (B[O + 21] = o.a),
                          (B[O + 22] = T),
                          (B[O + 23] = I)),
                      (O = u.length));
                    var P = b.setArraySize(u, O + 3);
                    ((P[O] = p),
                      (P[O + 1] = p + 1),
                      (P[O + 2] = p + 2),
                      (p += 3));
                    continue e;
                  }
                  var L = l.length;
                  if (0 != L) {
                    for (
                      var R = x - C,
                        D = E - _,
                        F = g - E,
                        j = C - y,
                        N = 1 / (R * F + D * (y - C)),
                        z = L >> 1,
                        U = this.clipOutput,
                        G = b.setArraySize(c, O + z * h),
                        H = 0;
                      H < L;
                      H += 2
                    ) {
                      var Q = U[H],
                        V = U[H + 1];
                      ((G[O] = Q),
                        (G[O + 1] = V),
                        (G[O + 2] = o.r),
                        (G[O + 3] = o.g),
                        (G[O + 4] = o.b),
                        (G[O + 5] = o.a));
                      var q = Q - E,
                        W = V - C,
                        Y = (R * q + D * W) * N,
                        X = (j * q + F * W) * N,
                        J = 1 - Y - X;
                      ((G[O + 6] = A * Y + k * X + T * J),
                        (G[O + 7] = w * Y + S * X + I * J),
                        s &&
                          ((G[O + 8] = a.r),
                          (G[O + 9] = a.g),
                          (G[O + 10] = a.b),
                          (G[O + 11] = a.a)),
                        (O += h));
                    }
                    O = u.length;
                    var K = b.setArraySize(u, O + 3 * (z - 2));
                    z--;
                    for (var $ = 1; $ < z; $++)
                      ((K[O] = p),
                        (K[O + 1] = p + $),
                        (K[O + 2] = p + $ + 1),
                        (O += 3));
                    p += z + 1;
                  }
                }
            },
          },
          {
            key: 'clip',
            value: function (e, t, n, r, i, o, a, s) {
              var l = s,
                c = !1,
                u = void 0;
              (a.length % 4 >= 2
                ? ((u = s), (s = this.scratch))
                : (u = this.scratch),
                (u.length = 0),
                u.push(e),
                u.push(t),
                u.push(n),
                u.push(r),
                u.push(i),
                u.push(o),
                u.push(e),
                u.push(t),
                (s.length = 0));
              for (var f = a, d = a.length - 4, h = 0; ; h += 2) {
                for (
                  var p = f[h],
                    m = f[h + 1],
                    v = f[h + 2],
                    g = f[h + 3],
                    y = p - v,
                    A = m - g,
                    b = u,
                    w = u.length - 2,
                    _ = s.length,
                    x = 0;
                  x < w;
                  x += 2
                ) {
                  var k = b[x],
                    S = b[x + 1],
                    E = b[x + 2],
                    C = b[x + 3],
                    T = y * (C - g) - A * (E - v) > 0;
                  if (y * (S - g) - A * (k - v) > 0) {
                    if (T) {
                      (s.push(E), s.push(C));
                      continue;
                    }
                    var I = C - S,
                      M = E - k,
                      O = I * (v - p) - M * (g - m);
                    if (Math.abs(O) > 1e-6) {
                      var B = (M * (m - S) - I * (p - k)) / O;
                      (s.push(p + (v - p) * B), s.push(m + (g - m) * B));
                    } else (s.push(p), s.push(m));
                  } else if (T) {
                    var P = C - S,
                      L = E - k,
                      R = P * (v - p) - L * (g - m);
                    if (Math.abs(R) > 1e-6) {
                      var D = (L * (m - S) - P * (p - k)) / R;
                      (s.push(p + (v - p) * D), s.push(m + (g - m) * D));
                    } else (s.push(p), s.push(m));
                    (s.push(E), s.push(C));
                  }
                  c = !0;
                }
                if (_ == s.length) return ((l.length = 0), !0);
                if ((s.push(s[0]), s.push(s[1]), h == d)) break;
                var F = s;
                (((s = u).length = 0), (u = F));
              }
              if (l != s) {
                l.length = 0;
                for (var j = 0, N = s.length - 2; j < N; j++) l[j] = s[j];
              } else l.length -= 2;
              return c;
            },
          },
        ],
        [
          {
            key: 'makeClockwise',
            value: function (e) {
              for (
                var t = e,
                  n = e.length,
                  r = t[n - 2] * t[1] - t[0] * t[n - 1],
                  i = 0,
                  o = 0,
                  a = 0,
                  s = 0,
                  l = n - 3;
                s < l;
                s += 2
              )
                ((i = t[s]),
                  (o = t[s + 1]),
                  (a = t[s + 2]),
                  (r += i * t[s + 3] - a * o));
              if (!(r < 0))
                for (var c = 0, u = n - 2, f = n >> 1; c < f; c += 2) {
                  var d = t[c],
                    h = t[c + 1],
                    p = u - c;
                  ((t[c] = t[p]),
                    (t[c + 1] = t[p + 1]),
                    (t[p] = d),
                    (t[p + 1] = h));
                }
            },
          },
        ],
      ),
      e
    );
  })(),
  hn = (function () {
    function e(t) {
      (d(this, e),
        (this.scale = 1),
        (this.linkedMeshes = new Array()),
        (this.attachmentLoader = t));
    }
    return (
      a(e, [
        {
          key: 'readSkeletonData',
          value: function (e) {
            var t = void 0,
              n = void 0,
              r = this.scale,
              i = new vt(),
              o = 'string' == typeof e ? JSON.parse(e) : e,
              a = o.skeleton;
            if (
              (a &&
                ((i.hash = a.hash),
                (i.version = a.spine),
                (i.x = a.x),
                (i.y = a.y),
                (i.width = a.width),
                (i.height = a.height),
                (i.referenceScale = yn(a, 'referenceScale', 100) * r),
                (i.fps = a.fps),
                (i.imagesPath =
                  null !== (t = a.images) && void 0 !== t ? t : null),
                (i.audioPath =
                  null !== (n = a.audio) && void 0 !== n ? n : null)),
              o.bones)
            )
              for (var s = 0; s < o.bones.length; s++) {
                var l = o.bones[s],
                  c = null,
                  u = yn(l, 'parent', null);
                u && (c = i.findBone(u));
                var f = new Xe(i.bones.length, l.name, c);
                ((f.length = yn(l, 'length', 0) * r),
                  (f.x = yn(l, 'x', 0) * r),
                  (f.y = yn(l, 'y', 0) * r),
                  (f.rotation = yn(l, 'rotation', 0)),
                  (f.scaleX = yn(l, 'scaleX', 1)),
                  (f.scaleY = yn(l, 'scaleY', 1)),
                  (f.shearX = yn(l, 'shearX', 0)),
                  (f.shearY = yn(l, 'shearY', 0)),
                  l.transform
                    ? (f.inherit = b.enumValue(
                        Je,
                        yn(l, 'transform', 'Normal'),
                      ))
                    : (f.inherit = b.enumValue(Je, yn(l, 'inherit', 'Normal'))),
                  (f.skinRequired = yn(l, 'skin', !1)));
                var d = yn(l, 'color', null);
                (d && f.color.setFromString(d), i.bones.push(f));
              }
            if (o.slots)
              for (var h = 0; h < o.slots.length; h++) {
                var p = o.slots[h],
                  v = null,
                  g = p.name,
                  y = g.lastIndexOf('/');
                -1 != y && ((v = g.substring(0, y)), (g = g.substring(y + 1)));
                var A = i.findBone(p.bone);
                if (!A)
                  throw new Error(
                    "Couldn't find bone " + p.bone + ' for slot ' + g,
                  );
                var w = new At(i.slots.length, g, A),
                  _ = yn(p, 'color', null);
                _ && w.color.setFromString(_);
                var x = yn(p, 'dark', null);
                (x && (w.darkColor = m.fromString(x)),
                  (w.attachmentName = yn(p, 'attachment', null)),
                  (w.blendMode = b.enumValue(bt, yn(p, 'blend', 'normal'))),
                  (w.visible = yn(p, 'visible', !0)),
                  (w.path = v),
                  i.slots.push(w));
              }
            if (o.ik)
              for (var k = 0; k < o.ik.length; k++) {
                var S = o.ik[k],
                  E = new it(S.name);
                ((E.order = yn(S, 'order', 0)),
                  (E.skinRequired = yn(S, 'skin', !1)));
                for (var C = 0; C < S.bones.length; C++) {
                  var T = i.findBone(S.bones[C]);
                  if (!T)
                    throw new Error(
                      "Couldn't find bone " +
                        S.bones[C] +
                        ' for IK constraint ' +
                        S.name +
                        '.',
                    );
                  E.bones.push(T);
                }
                var I = i.findBone(S.target);
                if (!I)
                  throw new Error(
                    "Couldn't find target bone " +
                      S.target +
                      ' for IK constraint ' +
                      S.name +
                      '.',
                  );
                ((E.target = I),
                  (E.mix = yn(S, 'mix', 1)),
                  (E.softness = yn(S, 'softness', 0) * r),
                  (E.bendDirection = yn(S, 'bendPositive', !0) ? 1 : -1),
                  (E.compress = yn(S, 'compress', !1)),
                  (E.stretch = yn(S, 'stretch', !1)),
                  (E.uniform = yn(S, 'uniform', !1)),
                  i.ikConstraints.push(E));
              }
            if (o.transform)
              for (var M = 0; M < o.transform.length; M++) {
                var O = o.transform[M],
                  B = new wt(O.name);
                ((B.order = yn(O, 'order', 0)),
                  (B.skinRequired = yn(O, 'skin', !1)));
                for (var P = 0; P < O.bones.length; P++) {
                  var L = O.bones[P],
                    R = i.findBone(L);
                  if (!R)
                    throw new Error(
                      "Couldn't find bone " +
                        L +
                        ' for transform constraint ' +
                        O.name +
                        '.',
                    );
                  B.bones.push(R);
                }
                var D = O.target,
                  F = i.findBone(D);
                if (!F)
                  throw new Error(
                    "Couldn't find target bone " +
                      D +
                      ' for transform constraint ' +
                      O.name +
                      '.',
                  );
                ((B.target = F),
                  (B.local = yn(O, 'local', !1)),
                  (B.relative = yn(O, 'relative', !1)),
                  (B.offsetRotation = yn(O, 'rotation', 0)),
                  (B.offsetX = yn(O, 'x', 0) * r),
                  (B.offsetY = yn(O, 'y', 0) * r),
                  (B.offsetScaleX = yn(O, 'scaleX', 0)),
                  (B.offsetScaleY = yn(O, 'scaleY', 0)),
                  (B.offsetShearY = yn(O, 'shearY', 0)),
                  (B.mixRotate = yn(O, 'mixRotate', 1)),
                  (B.mixX = yn(O, 'mixX', 1)),
                  (B.mixY = yn(O, 'mixY', B.mixX)),
                  (B.mixScaleX = yn(O, 'mixScaleX', 1)),
                  (B.mixScaleY = yn(O, 'mixScaleY', B.mixScaleX)),
                  (B.mixShearY = yn(O, 'mixShearY', 1)),
                  i.transformConstraints.push(B));
              }
            if (o.path)
              for (var j = 0; j < o.path.length; j++) {
                var N = o.path[j],
                  z = new ot(N.name);
                ((z.order = yn(N, 'order', 0)),
                  (z.skinRequired = yn(N, 'skin', !1)));
                for (var U = 0; U < N.bones.length; U++) {
                  var G = N.bones[U],
                    H = i.findBone(G);
                  if (!H)
                    throw new Error(
                      "Couldn't find bone " +
                        G +
                        ' for path constraint ' +
                        N.name +
                        '.',
                    );
                  z.bones.push(H);
                }
                var Q = N.target,
                  V = i.findSlot(Q);
                if (!V)
                  throw new Error(
                    "Couldn't find target slot " +
                      Q +
                      ' for path constraint ' +
                      N.name +
                      '.',
                  );
                ((z.target = V),
                  (z.positionMode = b.enumValue(
                    at,
                    yn(N, 'positionMode', 'Percent'),
                  )),
                  (z.spacingMode = b.enumValue(
                    st,
                    yn(N, 'spacingMode', 'Length'),
                  )),
                  (z.rotateMode = b.enumValue(
                    lt,
                    yn(N, 'rotateMode', 'Tangent'),
                  )),
                  (z.offsetRotation = yn(N, 'rotation', 0)),
                  (z.position = yn(N, 'position', 0)),
                  z.positionMode == at.Fixed && (z.position *= r),
                  (z.spacing = yn(N, 'spacing', 0)),
                  (z.spacingMode != st.Length && z.spacingMode != st.Fixed) ||
                    (z.spacing *= r),
                  (z.mixRotate = yn(N, 'mixRotate', 1)),
                  (z.mixX = yn(N, 'mixX', 1)),
                  (z.mixY = yn(N, 'mixY', z.mixX)),
                  i.pathConstraints.push(z));
              }
            if (o.physics)
              for (var q = 0; q < o.physics.length; q++) {
                var W = o.physics[q],
                  Y = new mt(W.name);
                ((Y.order = yn(W, 'order', 0)),
                  (Y.skinRequired = yn(W, 'skin', !1)));
                var X = W.bone,
                  J = i.findBone(X);
                if (null == J) throw new Error('Physics bone not found: ' + X);
                ((Y.bone = J),
                  (Y.x = yn(W, 'x', 0)),
                  (Y.y = yn(W, 'y', 0)),
                  (Y.rotate = yn(W, 'rotate', 0)),
                  (Y.scaleX = yn(W, 'scaleX', 0)),
                  (Y.shearX = yn(W, 'shearX', 0)),
                  (Y.limit = yn(W, 'limit', 5e3) * r),
                  (Y.step = 1 / yn(W, 'fps', 60)),
                  (Y.inertia = yn(W, 'inertia', 1)),
                  (Y.strength = yn(W, 'strength', 100)),
                  (Y.damping = yn(W, 'damping', 1)),
                  (Y.massInverse = 1 / yn(W, 'mass', 1)),
                  (Y.wind = yn(W, 'wind', 0)),
                  (Y.gravity = yn(W, 'gravity', 0)),
                  (Y.mix = yn(W, 'mix', 1)),
                  (Y.inertiaGlobal = yn(W, 'inertiaGlobal', !1)),
                  (Y.strengthGlobal = yn(W, 'strengthGlobal', !1)),
                  (Y.dampingGlobal = yn(W, 'dampingGlobal', !1)),
                  (Y.massGlobal = yn(W, 'massGlobal', !1)),
                  (Y.windGlobal = yn(W, 'windGlobal', !1)),
                  (Y.gravityGlobal = yn(W, 'gravityGlobal', !1)),
                  (Y.mixGlobal = yn(W, 'mixGlobal', !1)),
                  i.physicsConstraints.push(Y));
              }
            if (o.skins)
              for (var K = 0; K < o.skins.length; K++) {
                var $ = o.skins[K],
                  Z = new yt($.name);
                if ($.bones)
                  for (var ee = 0; ee < $.bones.length; ee++) {
                    var te = $.bones[ee],
                      ne = i.findBone(te);
                    if (!ne)
                      throw new Error(
                        "Couldn't find bone " +
                          te +
                          ' for skin ' +
                          $.name +
                          '.',
                      );
                    Z.bones.push(ne);
                  }
                if ($.ik)
                  for (var re = 0; re < $.ik.length; re++) {
                    var ie = $.ik[re],
                      oe = i.findIkConstraint(ie);
                    if (!oe)
                      throw new Error(
                        "Couldn't find IK constraint " +
                          ie +
                          ' for skin ' +
                          $.name +
                          '.',
                      );
                    Z.constraints.push(oe);
                  }
                if ($.transform)
                  for (var ae = 0; ae < $.transform.length; ae++) {
                    var se = $.transform[ae],
                      le = i.findTransformConstraint(se);
                    if (!le)
                      throw new Error(
                        "Couldn't find transform constraint " +
                          se +
                          ' for skin ' +
                          $.name +
                          '.',
                      );
                    Z.constraints.push(le);
                  }
                if ($.path)
                  for (var ce = 0; ce < $.path.length; ce++) {
                    var ue = $.path[ce],
                      fe = i.findPathConstraint(ue);
                    if (!fe)
                      throw new Error(
                        "Couldn't find path constraint " +
                          ue +
                          ' for skin ' +
                          $.name +
                          '.',
                      );
                    Z.constraints.push(fe);
                  }
                if ($.physics)
                  for (var de = 0; de < $.physics.length; de++) {
                    var he = $.physics[de],
                      pe = i.findPhysicsConstraint(he);
                    if (!pe)
                      throw new Error(
                        "Couldn't find physics constraint " +
                          he +
                          ' for skin ' +
                          $.name +
                          '.',
                      );
                    Z.constraints.push(pe);
                  }
                for (var me in $.attachments) {
                  var ve = i.findSlot(me);
                  if (!ve)
                    throw new Error(
                      "Couldn't find slot " + me + ' for skin ' + $.name + '.',
                    );
                  var ge = $.attachments[me];
                  for (var ye in ge) {
                    var Ae = this.readAttachment(ge[ye], Z, ve.index, ye, i);
                    Ae && Z.setAttachment(ve.index, ye, Ae);
                  }
                }
                (i.skins.push(Z), 'default' == Z.name && (i.defaultSkin = Z));
              }
            for (var be = 0, we = this.linkedMeshes.length; be < we; be++) {
              var _e = this.linkedMeshes[be],
                xe = _e.skin ? i.findSkin(_e.skin) : i.defaultSkin;
              if (!xe) throw new Error('Skin not found: ' + _e.skin);
              var ke = xe.getAttachment(_e.slotIndex, _e.parent);
              if (!ke) throw new Error('Parent mesh not found: ' + _e.parent);
              ((_e.mesh.timelineAttachment = _e.inheritTimeline ? ke : _e.mesh),
                _e.mesh.setParentMesh(ke),
                null != _e.mesh.region && _e.mesh.updateRegion());
            }
            if (((this.linkedMeshes.length = 0), o.events))
              for (var Se in o.events) {
                var Ee = o.events[Se],
                  Ce = new nt(Se);
                ((Ce.intValue = yn(Ee, 'int', 0)),
                  (Ce.floatValue = yn(Ee, 'float', 0)),
                  (Ce.stringValue = yn(Ee, 'string', '')),
                  (Ce.audioPath = yn(Ee, 'audio', null)),
                  Ce.audioPath &&
                    ((Ce.volume = yn(Ee, 'volume', 1)),
                    (Ce.balance = yn(Ee, 'balance', 0))),
                  i.events.push(Ce));
              }
            if (o.animations)
              for (var Te in o.animations) {
                var Ie = o.animations[Te];
                this.readAnimation(Ie, Te, i);
              }
            return (
              (i.extra = o.extra || {}),
              (i.extraConfig = o.extraConfig || {}),
              (i.extraSlot = o.extraSlot || {}),
              i
            );
          },
        },
        {
          key: 'readAttachment',
          value: function (e, t, n, r, i) {
            var o = this.scale;
            switch (((r = yn(e, 'name', r)), yn(e, 'type', 'region'))) {
              case 'region':
                var a = yn(e, 'path', r),
                  s = this.readSequence(yn(e, 'sequence', null)),
                  l = this.attachmentLoader.newRegionAttachment(t, r, a, s);
                if (!l) return null;
                ((l.path = a),
                  (l.x = yn(e, 'x', 0) * o),
                  (l.y = yn(e, 'y', 0) * o),
                  (l.scaleX = yn(e, 'scaleX', 1)),
                  (l.scaleY = yn(e, 'scaleY', 1)),
                  (l.rotation = yn(e, 'rotation', 0)),
                  (l.width = e.width * o),
                  (l.height = e.height * o),
                  (l.sequence = s));
                var c = yn(e, 'color', null);
                return (
                  c && l.color.setFromString(c),
                  null != l.region && l.updateRegion(),
                  l
                );
              case 'boundingbox':
                var u = this.attachmentLoader.newBoundingBoxAttachment(t, r);
                if (!u) return null;
                this.readVertices(e, u, e.vertexCount << 1);
                var f = yn(e, 'color', null);
                return (f && u.color.setFromString(f), u);
              case 'mesh':
              case 'linkedmesh':
                var d = yn(e, 'path', r),
                  h = this.readSequence(yn(e, 'sequence', null)),
                  p = this.attachmentLoader.newMeshAttachment(t, r, d, h);
                if (!p) return null;
                p.path = d;
                var m = yn(e, 'color', null);
                (m && p.color.setFromString(m),
                  (p.width = yn(e, 'width', 0) * o),
                  (p.height = yn(e, 'height', 0) * o),
                  (p.sequence = h));
                var v = yn(e, 'parent', null);
                if (v)
                  return (
                    this.linkedMeshes.push(
                      new pn(
                        p,
                        yn(e, 'skin', null),
                        n,
                        v,
                        yn(e, 'timelines', !0),
                      ),
                    ),
                    p
                  );
                var g = e.uvs;
                return (
                  this.readVertices(e, p, g.length),
                  (p.triangles = e.triangles),
                  (p.regionUVs = g),
                  null != p.region && p.updateRegion(),
                  (p.edges = yn(e, 'edges', null)),
                  (p.hullLength = 2 * yn(e, 'hull', 0)),
                  p
                );
              case 'path':
                var y = this.attachmentLoader.newPathAttachment(t, r);
                if (!y) return null;
                ((y.closed = yn(e, 'closed', !1)),
                  (y.constantSpeed = yn(e, 'constantSpeed', !0)));
                var A = e.vertexCount;
                this.readVertices(e, y, A << 1);
                for (
                  var w = b.newArray(A / 3, 0), _ = 0;
                  _ < e.lengths.length;
                  _++
                )
                  w[_] = e.lengths[_] * o;
                y.lengths = w;
                var x = yn(e, 'color', null);
                return (x && y.color.setFromString(x), y);
              case 'point':
                var k = this.attachmentLoader.newPointAttachment(t, r);
                if (!k) return null;
                ((k.x = yn(e, 'x', 0) * o),
                  (k.y = yn(e, 'y', 0) * o),
                  (k.rotation = yn(e, 'rotation', 0)));
                var S = yn(e, 'color', null);
                return (S && k.color.setFromString(S), k);
              case 'clipping':
                var E = this.attachmentLoader.newClippingAttachment(t, r);
                if (!E) return null;
                var C = yn(e, 'end', null);
                C && (E.endSlot = i.findSlot(C));
                var T = e.vertexCount;
                this.readVertices(e, E, T << 1);
                var I = yn(e, 'color', null);
                return (I && E.color.setFromString(I), E);
            }
            return null;
          },
        },
        {
          key: 'readSequence',
          value: function (e) {
            if (null == e) return null;
            var t = new T(yn(e, 'count', 0));
            return (
              (t.start = yn(e, 'start', 1)),
              (t.digits = yn(e, 'digits', 0)),
              (t.setupIndex = yn(e, 'setup', 0)),
              t
            );
          },
        },
        {
          key: 'readVertices',
          value: function (e, t, n) {
            var r = this.scale;
            t.worldVerticesLength = n;
            var i = e.vertices;
            if (n != i.length) {
              for (
                var o = new Array(), a = new Array(), s = 0, l = i.length;
                s < l;
              ) {
                var c = i[s++];
                a.push(c);
                for (var u = s + 4 * c; s < u; s += 4)
                  (a.push(i[s]),
                    o.push(i[s + 1] * r),
                    o.push(i[s + 2] * r),
                    o.push(i[s + 3]));
              }
              ((t.bones = a), (t.vertices = b.toFloatArray(o)));
            } else {
              var f = b.toFloatArray(i);
              if (1 != r) for (var d = 0, h = i.length; d < h; d++) f[d] *= r;
              t.vertices = f;
            }
          },
        },
        {
          key: 'readAnimation',
          value: function (e, t, n) {
            var r = this.scale,
              i = new Array();
            if (e.slots)
              for (var o in e.slots) {
                var a = e.slots[o],
                  s = n.findSlot(o);
                if (!s) throw new Error('Slot not found: ' + o);
                var l = s.index;
                for (var c in a) {
                  var u = a[c];
                  if (u) {
                    var f = u.length;
                    if ('attachment' == c) {
                      for (var d = new te(f, l), h = 0; h < f; h++) {
                        var p = u[h];
                        d.setFrame(h, yn(p, 'time', 0), yn(p, 'name', null));
                      }
                      i.push(d);
                    } else if ('rgba' == c) {
                      for (
                        var v = new J(f, f << 2, l),
                          g = u[0],
                          y = yn(g, 'time', 0),
                          A = m.fromString(g.color),
                          w = 0,
                          _ = 0;
                        ;
                        w++
                      ) {
                        v.setFrame(w, y, A.r, A.g, A.b, A.a);
                        var x = u[w + 1];
                        if (!x) {
                          v.shrink(_);
                          break;
                        }
                        var k = yn(x, 'time', 0),
                          S = m.fromString(x.color),
                          E = g.curve;
                        (E &&
                          ((_ = gn(E, v, _, w, 0, y, k, A.r, S.r, 1)),
                          (_ = gn(E, v, _, w, 1, y, k, A.g, S.g, 1)),
                          (_ = gn(E, v, _, w, 2, y, k, A.b, S.b, 1)),
                          (_ = gn(E, v, _, w, 3, y, k, A.a, S.a, 1))),
                          (y = k),
                          (A = S),
                          (g = x));
                      }
                      i.push(v);
                    } else if ('rgb' == c) {
                      for (
                        var C = new K(f, 3 * f, l),
                          T = u[0],
                          M = yn(T, 'time', 0),
                          B = m.fromString(T.color),
                          P = 0,
                          L = 0;
                        ;
                        P++
                      ) {
                        C.setFrame(P, M, B.r, B.g, B.b);
                        var R = u[P + 1];
                        if (!R) {
                          C.shrink(L);
                          break;
                        }
                        var D = yn(R, 'time', 0),
                          F = m.fromString(R.color),
                          j = T.curve;
                        (j &&
                          ((L = gn(j, C, L, P, 0, M, D, B.r, F.r, 1)),
                          (L = gn(j, C, L, P, 1, M, D, B.g, F.g, 1)),
                          (L = gn(j, C, L, P, 2, M, D, B.b, F.b, 1))),
                          (M = D),
                          (B = F),
                          (T = R));
                      }
                      i.push(C);
                    } else if ('alpha' == c)
                      i.push(mn(u, new $(f, f, l), 0, 1));
                    else if ('rgba2' == c) {
                      for (
                        var ue = new Z(f, 7 * f, l),
                          be = u[0],
                          we = yn(be, 'time', 0),
                          _e = m.fromString(be.light),
                          xe = m.fromString(be.dark),
                          ke = 0,
                          Se = 0;
                        ;
                        ke++
                      ) {
                        ue.setFrame(
                          ke,
                          we,
                          _e.r,
                          _e.g,
                          _e.b,
                          _e.a,
                          xe.r,
                          xe.g,
                          xe.b,
                        );
                        var Ee = u[ke + 1];
                        if (!Ee) {
                          ue.shrink(Se);
                          break;
                        }
                        var Ce = yn(Ee, 'time', 0),
                          Te = m.fromString(Ee.light),
                          Ie = m.fromString(Ee.dark),
                          Me = be.curve;
                        (Me &&
                          ((Se = gn(Me, ue, Se, ke, 0, we, Ce, _e.r, Te.r, 1)),
                          (Se = gn(Me, ue, Se, ke, 1, we, Ce, _e.g, Te.g, 1)),
                          (Se = gn(Me, ue, Se, ke, 2, we, Ce, _e.b, Te.b, 1)),
                          (Se = gn(Me, ue, Se, ke, 3, we, Ce, _e.a, Te.a, 1)),
                          (Se = gn(Me, ue, Se, ke, 4, we, Ce, xe.r, Ie.r, 1)),
                          (Se = gn(Me, ue, Se, ke, 5, we, Ce, xe.g, Ie.g, 1)),
                          (Se = gn(Me, ue, Se, ke, 6, we, Ce, xe.b, Ie.b, 1))),
                          (we = Ce),
                          (_e = Te),
                          (xe = Ie),
                          (be = Ee));
                      }
                      i.push(ue);
                    } else if ('rgb2' == c) {
                      for (
                        var Oe = new ee(f, 6 * f, l),
                          Be = u[0],
                          Pe = yn(Be, 'time', 0),
                          Le = m.fromString(Be.light),
                          Re = m.fromString(Be.dark),
                          De = 0,
                          Fe = 0;
                        ;
                        De++
                      ) {
                        Oe.setFrame(De, Pe, Le.r, Le.g, Le.b, Re.r, Re.g, Re.b);
                        var je = u[De + 1];
                        if (!je) {
                          Oe.shrink(Fe);
                          break;
                        }
                        var Ne = yn(je, 'time', 0),
                          ze = m.fromString(je.light),
                          Ue = m.fromString(je.dark),
                          Ge = Be.curve;
                        (Ge &&
                          ((Fe = gn(Ge, Oe, Fe, De, 0, Pe, Ne, Le.r, ze.r, 1)),
                          (Fe = gn(Ge, Oe, Fe, De, 1, Pe, Ne, Le.g, ze.g, 1)),
                          (Fe = gn(Ge, Oe, Fe, De, 2, Pe, Ne, Le.b, ze.b, 1)),
                          (Fe = gn(Ge, Oe, Fe, De, 3, Pe, Ne, Re.r, Ue.r, 1)),
                          (Fe = gn(Ge, Oe, Fe, De, 4, Pe, Ne, Re.g, Ue.g, 1)),
                          (Fe = gn(Ge, Oe, Fe, De, 5, Pe, Ne, Re.b, Ue.b, 1))),
                          (Pe = Ne),
                          (Le = ze),
                          (Re = Ue),
                          (Be = je));
                      }
                      i.push(Oe);
                    }
                  }
                }
              }
            if (e.bones)
              for (var He in e.bones) {
                var Qe = e.bones[He],
                  Ve = n.findBone(He);
                if (!Ve) throw new Error('Bone not found: ' + He);
                var qe = Ve.index;
                for (var We in Qe) {
                  var Ye = Qe[We],
                    Xe = Ye.length;
                  if (0 != Xe)
                    if ('rotate' === We)
                      i.push(mn(Ye, new N(Xe, Xe, qe), 0, 1));
                    else if ('translate' === We) {
                      var Ke = new z(Xe, Xe << 1, qe);
                      i.push(vn(Ye, Ke, 'x', 'y', 0, r));
                    } else if ('translatex' === We) {
                      var $e = new U(Xe, Xe, qe);
                      i.push(mn(Ye, $e, 0, r));
                    } else if ('translatey' === We) {
                      var Ze = new G(Xe, Xe, qe);
                      i.push(mn(Ye, Ze, 0, r));
                    } else if ('scale' === We) {
                      var et = new H(Xe, Xe << 1, qe);
                      i.push(vn(Ye, et, 'x', 'y', 1, 1));
                    } else if ('scalex' === We) {
                      var nt = new Q(Xe, Xe, qe);
                      i.push(mn(Ye, nt, 1, 1));
                    } else if ('scaley' === We) {
                      var rt = new V(Xe, Xe, qe);
                      i.push(mn(Ye, rt, 1, 1));
                    } else if ('shear' === We) {
                      var it = new q(Xe, Xe << 1, qe);
                      i.push(vn(Ye, it, 'x', 'y', 0, 1));
                    } else if ('shearx' === We) {
                      var ot = new W(Xe, Xe, qe);
                      i.push(mn(Ye, ot, 0, 1));
                    } else if ('sheary' === We) {
                      var lt = new Y(Xe, Xe, qe);
                      i.push(mn(Ye, lt, 0, 1));
                    } else if ('inherit' === We) {
                      for (
                        var ct = new X(Xe, Ve.index), ut = 0;
                        ut < Ye.length;
                        ut++
                      ) {
                        var ft = Ye[ut];
                        ct.setFrame(
                          ut,
                          yn(ft, 'time', 0),
                          b.enumValue(Je, yn(ft, 'inherit', 'Normal')),
                        );
                      }
                      i.push(ct);
                    }
                }
              }
            if (e.ik)
              for (var dt in e.ik) {
                var ht = e.ik[dt],
                  pt = ht[0];
                if (pt) {
                  var mt = n.findIkConstraint(dt);
                  if (!mt) throw new Error('IK Constraint not found: ' + dt);
                  for (
                    var vt = n.ikConstraints.indexOf(mt),
                      gt = new oe(ht.length, ht.length << 1, vt),
                      yt = yn(pt, 'time', 0),
                      At = yn(pt, 'mix', 1),
                      bt = yn(pt, 'softness', 0) * r,
                      wt = 0,
                      _t = 0;
                    ;
                    wt++
                  ) {
                    gt.setFrame(
                      wt,
                      yt,
                      At,
                      bt,
                      yn(pt, 'bendPositive', !0) ? 1 : -1,
                      yn(pt, 'compress', !1),
                      yn(pt, 'stretch', !1),
                    );
                    var xt = ht[wt + 1];
                    if (!xt) {
                      gt.shrink(_t);
                      break;
                    }
                    var kt = yn(xt, 'time', 0),
                      St = yn(xt, 'mix', 1),
                      Et = yn(xt, 'softness', 0) * r,
                      Ct = pt.curve;
                    (Ct &&
                      ((_t = gn(Ct, gt, _t, wt, 0, yt, kt, At, St, 1)),
                      (_t = gn(Ct, gt, _t, wt, 1, yt, kt, bt, Et, r))),
                      (yt = kt),
                      (At = St),
                      (bt = Et),
                      (pt = xt));
                  }
                  i.push(gt);
                }
              }
            if (e.transform)
              for (var Tt in e.transform) {
                var It = e.transform[Tt],
                  Mt = It[0];
                if (Mt) {
                  var Ot = n.findTransformConstraint(Tt);
                  if (!Ot)
                    throw new Error('Transform constraint not found: ' + Tt);
                  for (
                    var Bt = n.transformConstraints.indexOf(Ot),
                      Pt = new ae(It.length, 6 * It.length, Bt),
                      Lt = yn(Mt, 'time', 0),
                      Rt = yn(Mt, 'mixRotate', 1),
                      Dt = yn(Mt, 'mixX', 1),
                      Ft = yn(Mt, 'mixY', Dt),
                      jt = yn(Mt, 'mixScaleX', 1),
                      Nt = yn(Mt, 'mixScaleY', jt),
                      zt = yn(Mt, 'mixShearY', 1),
                      Ut = 0,
                      Gt = 0;
                    ;
                    Ut++
                  ) {
                    Pt.setFrame(Ut, Lt, Rt, Dt, Ft, jt, Nt, zt);
                    var Ht = It[Ut + 1];
                    if (!Ht) {
                      Pt.shrink(Gt);
                      break;
                    }
                    var Qt = yn(Ht, 'time', 0),
                      Vt = yn(Ht, 'mixRotate', 1),
                      qt = yn(Ht, 'mixX', 1),
                      Wt = yn(Ht, 'mixY', qt),
                      Yt = yn(Ht, 'mixScaleX', 1),
                      Xt = yn(Ht, 'mixScaleY', Yt),
                      Jt = yn(Ht, 'mixShearY', 1),
                      Kt = Mt.curve;
                    (Kt &&
                      ((Gt = gn(Kt, Pt, Gt, Ut, 0, Lt, Qt, Rt, Vt, 1)),
                      (Gt = gn(Kt, Pt, Gt, Ut, 1, Lt, Qt, Dt, qt, 1)),
                      (Gt = gn(Kt, Pt, Gt, Ut, 2, Lt, Qt, Ft, Wt, 1)),
                      (Gt = gn(Kt, Pt, Gt, Ut, 3, Lt, Qt, jt, Yt, 1)),
                      (Gt = gn(Kt, Pt, Gt, Ut, 4, Lt, Qt, Nt, Xt, 1)),
                      (Gt = gn(Kt, Pt, Gt, Ut, 5, Lt, Qt, zt, Jt, 1))),
                      (Lt = Qt),
                      (Rt = Vt),
                      (Dt = qt),
                      (Ft = Wt),
                      (jt = Yt),
                      (Nt = Xt),
                      (jt = Yt),
                      (Mt = Ht));
                  }
                  i.push(Pt);
                }
              }
            if (e.path)
              for (var $t in e.path) {
                var Zt = e.path[$t],
                  en = n.findPathConstraint($t);
                if (!en) throw new Error('Path constraint not found: ' + $t);
                var tn = n.pathConstraints.indexOf(en);
                for (var nn in Zt) {
                  var rn = Zt[nn],
                    on = rn[0];
                  if (on) {
                    var an = rn.length;
                    if ('position' === nn) {
                      var sn = new se(an, an, tn);
                      i.push(
                        mn(rn, sn, 0, en.positionMode == at.Fixed ? r : 1),
                      );
                    } else if ('spacing' === nn) {
                      var ln = new le(an, an, tn);
                      i.push(
                        mn(
                          rn,
                          ln,
                          0,
                          en.spacingMode == st.Length ||
                            en.spacingMode == st.Fixed
                            ? r
                            : 1,
                        ),
                      );
                    } else if ('mix' === nn) {
                      for (
                        var cn = new ce(an, 3 * an, tn),
                          un = yn(on, 'time', 0),
                          fn = yn(on, 'mixRotate', 1),
                          dn = yn(on, 'mixX', 1),
                          hn = yn(on, 'mixY', dn),
                          pn = 0,
                          An = 0;
                        ;
                        pn++
                      ) {
                        cn.setFrame(pn, un, fn, dn, hn);
                        var bn = rn[pn + 1];
                        if (!bn) {
                          cn.shrink(An);
                          break;
                        }
                        var wn = yn(bn, 'time', 0),
                          _n = yn(bn, 'mixRotate', 1),
                          xn = yn(bn, 'mixX', 1),
                          kn = yn(bn, 'mixY', xn),
                          Sn = on.curve;
                        (Sn &&
                          ((An = gn(Sn, cn, An, pn, 0, un, wn, fn, _n, 1)),
                          (An = gn(Sn, cn, An, pn, 1, un, wn, dn, xn, 1)),
                          (An = gn(Sn, cn, An, pn, 2, un, wn, hn, kn, 1))),
                          (un = wn),
                          (fn = _n),
                          (dn = xn),
                          (hn = kn),
                          (on = bn));
                      }
                      i.push(cn);
                    }
                  }
                }
              }
            if (e.physics)
              for (var En in e.physics) {
                var Cn = e.physics[En],
                  Tn = -1;
                if (En.length > 0) {
                  var In = n.findPhysicsConstraint(En);
                  if (!In)
                    throw new Error('Physics constraint not found: ' + En);
                  Tn = n.physicsConstraints.indexOf(In);
                }
                for (var Mn in Cn) {
                  var On = Cn[Mn],
                    Bn = On[0];
                  if (Bn) {
                    var Pn = On.length;
                    if ('reset' != Mn) {
                      var Ln = void 0;
                      if ('inertia' == Mn) Ln = new fe(Pn, Pn, Tn);
                      else if ('strength' == Mn) Ln = new de(Pn, Pn, Tn);
                      else if ('damping' == Mn) Ln = new he(Pn, Pn, Tn);
                      else if ('mass' == Mn) Ln = new pe(Pn, Pn, Tn);
                      else if ('wind' == Mn) Ln = new me(Pn, Pn, Tn);
                      else if ('gravity' == Mn) Ln = new ve(Pn, Pn, Tn);
                      else {
                        if ('mix' != Mn) continue;
                        Ln = new ge(Pn, Pn, Tn);
                      }
                      i.push(mn(On, Ln, 0, 1));
                    } else {
                      for (
                        var Rn = new ye(On.size, Tn), Dn = 0;
                        null != Bn;
                        Bn = On[Dn + 1], Dn++
                      )
                        Rn.setFrame(Dn, yn(Bn, 'time', 0));
                      i.push(Rn);
                    }
                  }
                }
              }
            if (e.attachments)
              for (var Fn in e.attachments) {
                var jn = e.attachments[Fn],
                  Nn = n.findSkin(Fn);
                if (!Nn) throw new Error('Skin not found: ' + Fn);
                for (var zn in jn) {
                  var Un = jn[zn],
                    Gn = n.findSlot(zn);
                  if (!Gn) throw new Error('Slot not found: ' + zn);
                  var Hn = Gn.index;
                  for (var Qn in Un) {
                    var Vn = Un[Qn],
                      qn = Nn.getAttachment(Hn, Qn);
                    for (var Wn in Vn) {
                      var Yn = Vn[Wn],
                        Xn = Yn[0];
                      if (Xn)
                        if ('deform' == Wn) {
                          for (
                            var Jn = qn.bones,
                              Kn = qn.vertices,
                              $n = Jn ? (Kn.length / 3) * 2 : Kn.length,
                              Zn = new ne(Yn.length, Yn.length, Hn, qn),
                              er = yn(Xn, 'time', 0),
                              tr = 0,
                              nr = 0;
                            ;
                            tr++
                          ) {
                            var rr = void 0,
                              ir = yn(Xn, 'vertices', null);
                            if (ir) {
                              rr = b.newFloatArray($n);
                              var or = yn(Xn, 'offset', 0);
                              if (
                                (b.arrayCopy(ir, 0, rr, or, ir.length), 1 != r)
                              )
                                for (
                                  var ar = or, sr = ar + ir.length;
                                  ar < sr;
                                  ar++
                                )
                                  rr[ar] *= r;
                              if (!Jn)
                                for (var lr = 0; lr < $n; lr++)
                                  rr[lr] += Kn[lr];
                            } else rr = Jn ? b.newFloatArray($n) : Kn;
                            Zn.setFrame(tr, er, rr);
                            var cr = Yn[tr + 1];
                            if (!cr) {
                              Zn.shrink(nr);
                              break;
                            }
                            var ur = yn(cr, 'time', 0),
                              fr = Xn.curve;
                            (fr &&
                              (nr = gn(fr, Zn, nr, tr, 0, er, ur, 0, 1, 1)),
                              (er = ur),
                              (Xn = cr));
                          }
                          i.push(Zn);
                        } else if ('sequence' == Wn) {
                          for (
                            var dr = new Ae(Yn.length, Hn, qn), hr = 0, pr = 0;
                            pr < Yn.length;
                            pr++
                          ) {
                            var mr = yn(Xn, 'delay', hr),
                              vr = yn(Xn, 'time', 0),
                              gr = I[yn(Xn, 'mode', 'hold')],
                              yr = yn(Xn, 'index', 0);
                            (dr.setFrame(pr, vr, gr, yr, mr),
                              (hr = mr),
                              (Xn = Yn[pr + 1]));
                          }
                          i.push(dr);
                        }
                    }
                  }
                }
              }
            if (e.drawOrder) {
              for (
                var Ar = new ie(e.drawOrder.length),
                  br = n.slots.length,
                  wr = 0,
                  _r = 0;
                _r < e.drawOrder.length;
                _r++, wr++
              ) {
                var xr = e.drawOrder[_r],
                  kr = null,
                  Sr = yn(xr, 'offsets', null);
                if (Sr) {
                  kr = b.newArray(br, -1);
                  for (
                    var Er = b.newArray(br - Sr.length, 0),
                      Cr = 0,
                      Tr = 0,
                      Ir = 0;
                    Ir < Sr.length;
                    Ir++
                  ) {
                    var Mr = Sr[Ir],
                      Or = n.findSlot(Mr.slot);
                    if (!Or) throw new Error('Slot not found: ' + Or);
                    for (var Br = Or.index; Cr != Br;) Er[Tr++] = Cr++;
                    kr[Cr + Mr.offset] = Cr++;
                  }
                  for (; Cr < br;) Er[Tr++] = Cr++;
                  for (var Pr = br - 1; Pr >= 0; Pr--)
                    -1 == kr[Pr] && (kr[Pr] = Er[--Tr]);
                }
                Ar.setFrame(wr, yn(xr, 'time', 0), kr);
              }
              i.push(Ar);
            }
            if (e.events) {
              for (
                var Lr = new re(e.events.length), Rr = 0, Dr = 0;
                Dr < e.events.length;
                Dr++, Rr++
              ) {
                var Fr = e.events[Dr],
                  jr = n.findEvent(Fr.name);
                if (!jr) throw new Error('Event not found: ' + Fr.name);
                var Nr = new tt(b.toSinglePrecision(yn(Fr, 'time', 0)), jr);
                ((Nr.intValue = yn(Fr, 'int', jr.intValue)),
                  (Nr.floatValue = yn(Fr, 'float', jr.floatValue)),
                  (Nr.stringValue = yn(Fr, 'string', jr.stringValue)),
                  Nr.data.audioPath &&
                    ((Nr.volume = yn(Fr, 'volume', 1)),
                    (Nr.balance = yn(Fr, 'balance', 0))),
                  Lr.setFrame(Rr, Nr));
              }
              i.push(Lr);
            }
            if (e.deform)
              for (var zr in e.deform) {
                var Ur = e.deform[zr],
                  Gr = n.findSkin(zr);
                for (var Hr in Ur) {
                  var Qr = Ur[Hr],
                    Vr = n.findSlot(Hr);
                  if (!Vr) throw new Error('Slot not found: ' + Hr);
                  var qr = Vr.index;
                  for (var Wr in Qr) {
                    var Yr = Qr[Wr],
                      Xr = Yr[0];
                    if (Xr) {
                      for (
                        var Jr = Gr.getAttachment(qr, Wr),
                          Kr = Jr.bones,
                          $r = Jr.vertices,
                          Zr = Kr ? ($r.length / 3) * 2 : $r.length,
                          ei = new ne(Yr.length, Yr.length, qr, Jr),
                          ti = yn(Xr, 'time', 0),
                          ni = 0,
                          ri = 0;
                        ;
                        ni++
                      ) {
                        var ii = void 0,
                          oi = yn(Xr, 'vertices', null);
                        if (oi) {
                          ii = b.newFloatArray(Zr);
                          var ai = yn(Xr, 'offset', 0);
                          if ((b.arrayCopy(oi, 0, ii, ai, oi.length), 1 != r))
                            for (
                              var si = ai, li = si + oi.length;
                              si < li;
                              si++
                            )
                              ii[si] *= r;
                          if (!Kr)
                            for (var ci = 0; ci < Zr; ci++) ii[ci] += $r[ci];
                        } else ii = Kr ? b.newFloatArray(Zr) : $r;
                        ei.setFrame(ni, ti, ii);
                        var ui = Yr[ni + 1];
                        if (!ui) {
                          ei.shrink(ri);
                          break;
                        }
                        var fi = yn(ui, 'time', 0),
                          di = Xr.curve;
                        (di && (ri = gn(di, ei, ri, ni, 0, ti, fi, 0, 1, 1)),
                          (ti = fi),
                          (Xr = ui));
                      }
                      i.push(ei);
                    }
                  }
                }
              }
            for (var hi = 0, pi = 0, mi = i.length; pi < mi; pi++)
              hi = Math.max(hi, i[pi].getDuration());
            n.animations.push(new O(t, i, hi));
          },
        },
      ]),
      e
    );
  })(),
  pn = function e(t, n, r, i, o) {
    (d(this, e),
      (this.mesh = t),
      (this.skin = n),
      (this.slotIndex = r),
      (this.parent = i),
      (this.inheritTimeline = o));
  };
function mn(e, t, n, r) {
  for (
    var i = e[0], o = yn(i, 'time', 0), a = yn(i, 'value', n) * r, s = 0, l = 0;
    ;
    l++
  ) {
    t.setFrame(l, o, a);
    var c = e[l + 1];
    if (!c) return (t.shrink(s), t);
    var u = yn(c, 'time', 0),
      f = yn(c, 'value', n) * r;
    (i.curve && (s = gn(i.curve, t, s, l, 0, o, u, a, f, r)),
      (o = u),
      (a = f),
      (i = c));
  }
}
function vn(e, t, n, r, i, o) {
  for (
    var a = e[0],
      s = yn(a, 'time', 0),
      l = yn(a, n, i) * o,
      c = yn(a, r, i) * o,
      u = 0,
      f = 0;
    ;
    f++
  ) {
    t.setFrame(f, s, l, c);
    var d = e[f + 1];
    if (!d) return (t.shrink(u), t);
    var h = yn(d, 'time', 0),
      p = yn(d, n, i) * o,
      m = yn(d, r, i) * o,
      v = a.curve;
    (v &&
      ((u = gn(v, t, u, f, 0, s, h, l, p, o)),
      (u = gn(v, t, u, f, 1, s, h, c, m, o))),
      (s = h),
      (l = p),
      (c = m),
      (a = d));
  }
}
function gn(e, t, n, r, i, o, a, s, l, c) {
  if ('stepped' == e) return (t.setStepped(r), n);
  var u = i << 2,
    f = e[u],
    d = e[u + 1] * c,
    h = e[u + 2],
    p = e[u + 3] * c;
  return (t.setBezier(n, r, i, o, s, f, d, h, p, a, l), n + 1);
}
function yn(e, t, n) {
  return void 0 !== e[t] ? e[t] : n;
}
void 0 === Math.fround &&
  (Math.fround =
    ((Mt = new Float32Array(1)),
    function (e) {
      return ((Mt[0] = e), Mt[0]);
    }));
var An = Object.freeze({
    __proto__: null,
    Animation: O,
    get MixBlend() {
      return B;
    },
    get MixDirection() {
      return P;
    },
    Timeline: R,
    CurveTimeline: D,
    CurveTimeline1: F,
    CurveTimeline2: j,
    RotateTimeline: N,
    TranslateTimeline: z,
    TranslateXTimeline: U,
    TranslateYTimeline: G,
    ScaleTimeline: H,
    ScaleXTimeline: Q,
    ScaleYTimeline: V,
    ShearTimeline: q,
    ShearXTimeline: W,
    ShearYTimeline: Y,
    InheritTimeline: X,
    RGBATimeline: J,
    RGBTimeline: K,
    AlphaTimeline: $,
    RGBA2Timeline: Z,
    RGB2Timeline: ee,
    AttachmentTimeline: te,
    DeformTimeline: ne,
    EventTimeline: re,
    DrawOrderTimeline: ie,
    IkConstraintTimeline: oe,
    TransformConstraintTimeline: ae,
    PathConstraintPositionTimeline: se,
    PathConstraintSpacingTimeline: le,
    PathConstraintMixTimeline: ce,
    PhysicsConstraintTimeline: ue,
    PhysicsConstraintInertiaTimeline: fe,
    PhysicsConstraintStrengthTimeline: de,
    PhysicsConstraintDampingTimeline: he,
    PhysicsConstraintMassTimeline: pe,
    PhysicsConstraintWindTimeline: me,
    PhysicsConstraintGravityTimeline: ve,
    PhysicsConstraintMixTimeline: ge,
    PhysicsConstraintResetTimeline: ye,
    SequenceTimeline: Ae,
    AnimationState: be,
    TrackEntry: we,
    EventQueue: _e,
    get EventType() {
      return xe;
    },
    AnimationStateAdapter: ke,
    SUBSEQUENT: Se,
    FIRST: Ee,
    HOLD_SUBSEQUENT: Ce,
    HOLD_FIRST: Te,
    HOLD_MIX: Ie,
    SETUP: Me,
    CURRENT: Oe,
    AnimationStateData: Be,
    AtlasAttachmentLoader: Ye,
    Bone: Ke,
    BoneData: Xe,
    get Inherit() {
      return Je;
    },
    ConstraintData: $e,
    AssetManagerBase: Ze,
    Downloader: et,
    Event: tt,
    EventData: nt,
    IkConstraint: rt,
    IkConstraintData: it,
    PathConstraint: ct,
    PathConstraintData: ot,
    get PositionMode() {
      return at;
    },
    get SpacingMode() {
      return st;
    },
    get RotateMode() {
      return lt;
    },
    Skeleton: ht,
    get Physics() {
      return pt;
    },
    SkeletonBinary: _t,
    BinaryInput: xt,
    SkeletonBounds: un,
    SkeletonClipping: dn,
    SkeletonData: vt,
    SkeletonJson: hn,
    SkinEntry: gt,
    Skin: yt,
    Slot: ft,
    SlotData: At,
    get BlendMode() {
      return bt;
    },
    Texture: Re,
    get TextureFilter() {
      return De;
    },
    get TextureWrap() {
      return Fe;
    },
    TextureRegion: je,
    FakeTexture: Ne,
    TextureAtlas: ze,
    TextureAtlasPage: Ge,
    TextureAtlasRegion: He,
    TransformConstraint: dt,
    TransformConstraintData: wt,
    Triangulator: fn,
    IntSet: h,
    StringSet: p,
    Color: m,
    MathUtils: v,
    Interpolation: g,
    Pow: y,
    PowOut: A,
    Utils: b,
    DebugUtils: w,
    Pool: _,
    Vector2: x,
    TimeKeeper: k,
    WindowedMean: S,
    Attachment: E,
    VertexAttachment: C,
    BoundingBoxAttachment: Pe,
    ClippingAttachment: Le,
    MeshAttachment: Qe,
    PathAttachment: Ve,
    PointAttachment: qe,
    RegionAttachment: We,
  }),
  bn = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (
        (n.texture = new s.Texture(e)),
        (n.texture.flipY = !1),
        (n.texture.needsUpdate = !0),
        n
      );
    }
    return (
      f(t, e),
      a(
        t,
        [
          {
            key: 'setFilters',
            value: function (e, n) {
              ((this.texture.minFilter = t.toThreeJsTextureFilter(e)),
                (this.texture.magFilter = t.toThreeJsTextureFilter(n)));
            },
          },
          {
            key: 'setWraps',
            value: function (e, n) {
              ((this.texture.wrapS = t.toThreeJsTextureWrap(e)),
                (this.texture.wrapT = t.toThreeJsTextureWrap(n)));
            },
          },
          {
            key: 'dispose',
            value: function () {
              this.texture.dispose();
            },
          },
        ],
        [
          {
            key: 'toThreeJsTextureFilter',
            value: function (e) {
              if (e === De.Linear) return s.LinearFilter;
              if (e === De.MipMap) return s.LinearMipMapLinearFilter;
              if (e === De.MipMapLinearNearest)
                return s.LinearMipMapNearestFilter;
              if (e === De.MipMapNearestLinear)
                return s.NearestMipMapLinearFilter;
              if (e === De.MipMapNearestNearest)
                return s.NearestMipMapNearestFilter;
              if (e === De.Nearest) return s.NearestFilter;
              throw new Error('Unknown texture filter: ' + e);
            },
          },
          {
            key: 'toThreeJsTextureWrap',
            value: function (e) {
              if (e === Fe.ClampToEdge) return s.ClampToEdgeWrapping;
              if (e === Fe.MirroredRepeat) return s.MirroredRepeatWrapping;
              if (e === Fe.Repeat) return s.RepeatWrapping;
              throw new Error('Unknown texture wrap: ' + e);
            },
          },
          {
            key: 'toThreeJsBlending',
            value: function (e) {
              if (e === bt.Normal) return s.NormalBlending;
              if (e === bt.Additive) return s.AdditiveBlending;
              if (e === bt.Multiply) return s.MultiplyBlending;
              if (e === bt.Screen) return s.CustomBlending;
              throw new Error('Unknown blendMode: ' + e);
            },
          },
        ],
      ),
      t
    );
  })(Re),
  wn = (function (e) {
    function t() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : 10920,
        n =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : function (e) {},
        r =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : function (e) {},
        i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
      d(this, t);
      var o = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
      if (
        ((o.materialCustomizer = n),
        (o.twoColorTint = i),
        (o.verticesLength = 0),
        (o.vertexSize = 0),
        (o.indicesLength = 0),
        (o.materialGroups = []),
        (o.isFlatRenderObject = !0),
        e > 10920)
      )
        throw new Error("Can't have more than 10920 triangles per batch: " + e);
      o.vertexSize = o.twoColorTint ? t.TWO_COLOR_VERTEX_SIZE : t.VERTEX_SIZE;
      var a = (o.vertices = new Float32Array(e * o.vertexSize)),
        l = (o.indices = new Uint16Array(3 * e)),
        c = new s.BufferGeometry(),
        f = (o.vertexBuffer = new s.InterleavedBuffer(a, o.vertexSize));
      return (
        (f.usage = s.DynamicDrawUsage),
        c.setAttribute(
          'position',
          new s.InterleavedBufferAttribute(f, 3, 0, !1),
        ),
        c.setAttribute('color', new s.InterleavedBufferAttribute(f, 4, 3, !1)),
        c.setAttribute('uv', new s.InterleavedBufferAttribute(f, 2, 7, !1)),
        o.twoColorTint &&
          c.setAttribute(
            'color2',
            new s.InterleavedBufferAttribute(f, 4, 9, !1),
          ),
        c.setIndex(new s.BufferAttribute(l, 1)),
        (c.getIndex().usage = s.DynamicDrawUsage),
        (c.drawRange.start = 0),
        (c.drawRange.count = 0),
        (o.geometry = c),
        (o.material = [new Nn(n)]),
        r && (o.customDepthMaterial = new Nn(r)),
        o
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'dispose',
          value: function () {
            if ((this.geometry.dispose(), this.material instanceof s.Material))
              this.material.dispose();
            else if (this.material)
              for (var e = 0; e < this.material.length; e++) {
                var t = this.material[e];
                t instanceof s.Material && t.dispose();
              }
            this.customDepthMaterial && this.customDepthMaterial.dispose();
          },
        },
        {
          key: 'clear',
          value: function () {
            var e = this.geometry;
            if (
              ((e.drawRange.start = 0),
              (e.drawRange.count = 0),
              e.clearGroups(),
              (this.materialGroups = []),
              this.material instanceof s.Material)
            ) {
              var t = this.material;
              ((t.uniforms.diffuse.value = null),
                (t.blending = s.NormalBlending));
            } else if (Array.isArray(this.material))
              for (var n = 0; n < this.material.length; n++) {
                var r = this.material[n];
                ((r.uniforms.diffuse.value = null),
                  (r.blending = s.NormalBlending));
              }
            return this;
          },
        },
        {
          key: 'begin',
          value: function () {
            ((this.verticesLength = 0), (this.indicesLength = 0));
          },
        },
        {
          key: 'canBatch',
          value: function (e, t) {
            return !(
              this.indicesLength + t >= this.indices.byteLength / 2 ||
              this.verticesLength / this.vertexSize + e >=
                this.vertices.byteLength / 4 / this.vertexSize
            );
          },
        },
        {
          key: 'batch',
          value: function (e, t, n, r) {
            for (
              var i =
                  arguments.length > 4 && void 0 !== arguments[4]
                    ? arguments[4]
                    : 0,
                o = this.verticesLength / this.vertexSize,
                a = this.vertices,
                s = this.verticesLength,
                l = 0;
              l < t;
            )
              ((a[s++] = e[l++]),
                (a[s++] = e[l++]),
                (a[s++] = i),
                (a[s++] = e[l++]),
                (a[s++] = e[l++]),
                (a[s++] = e[l++]),
                (a[s++] = e[l++]),
                (a[s++] = e[l++]),
                (a[s++] = e[l++]),
                this.twoColorTint &&
                  ((a[s++] = e[l++]),
                  (a[s++] = e[l++]),
                  (a[s++] = e[l++]),
                  (a[s++] = e[l++])));
            this.verticesLength = s;
            var c = this.indices;
            for (s = this.indicesLength, l = 0; l < r; s++, l++)
              c[s] = n[l] + o;
            this.indicesLength += r;
          },
        },
        {
          key: 'end',
          value: function () {
            ((this.vertexBuffer.needsUpdate = this.verticesLength > 0),
              (this.vertexBuffer.updateRange.offset = 0),
              (this.vertexBuffer.updateRange.count = this.verticesLength));
            var e = this.geometry;
            this.closeMaterialGroups();
            var t = e.getIndex();
            if (!t) throw new Error('BufferAttribute must not be null.');
            ((t.needsUpdate = this.indicesLength > 0),
              (t.updateRange.offset = 0),
              (t.updateRange.count = this.indicesLength),
              (e.drawRange.start = 0),
              (e.drawRange.count = this.indicesLength));
          },
        },
        {
          key: 'addMaterialGroup',
          value: function (e, t) {
            var n = this.materialGroups[this.materialGroups.length - 1];
            void 0 === n || n[2] !== t
              ? this.materialGroups.push([this.indicesLength, e, t])
              : (n[1] += e);
          },
        },
        {
          key: 'closeMaterialGroups',
          value: function () {
            for (
              var e = this.geometry, t = 0;
              t < this.materialGroups.length;
              t++
            ) {
              var n = o(this.materialGroups[t], 3),
                r = n[0],
                i = n[1],
                a = n[2];
              e.addGroup(r, i, a);
            }
          },
        },
        {
          key: 'findMaterialGroup',
          value: function (e, t) {
            var n = bn.toThreeJsBlending(t);
            if (!Array.isArray(this.material))
              throw new Error(
                'MeshBatcher.material needs to be an array for geometry groups to work',
              );
            for (var r = 0; r < this.material.length; r++) {
              var i = this.material[r];
              if (!i.uniforms.diffuse.value)
                return (_n(i, this.customDepthMaterial, e, n), r);
              if (i.uniforms.diffuse.value === e && i.blending === n) return r;
            }
            var o = new Nn(this.materialCustomizer);
            return (
              _n(o, this.customDepthMaterial, e, n),
              this.material.push(o),
              this.material.length - 1
            );
          },
        },
      ]),
      t
    );
  })(s.Mesh);
function _n(e, t, n, r) {
  ((e.uniforms.diffuse.value = n),
    (e.blending = r),
    (e.blendDst =
      r === s.CustomBlending
        ? s.OneMinusSrcColorFactor
        : s.OneMinusSrcAlphaFactor),
    (e.blendSrc = r === s.CustomBlending ? s.OneFactor : s.SrcAlphaFactor),
    (e.needsUpdate = !0),
    t && ((t.uniforms.diffuse.value = n), (t.needsUpdate = !0)));
}
((wn.VERTEX_SIZE = 9), (wn.TWO_COLOR_VERTEX_SIZE = 13));
var xn = (function () {
    function e(t) {
      d(this, e);
      var n = t || {},
        r = n.ease,
        i = void 0 === r ? 'linear' : r,
        o = n.value,
        a = void 0 === o ? 1 : o,
        s = n.start,
        l = void 0 === s ? 0 : s;
      ((this.value = a), (this.start = l), (this.ease = i));
    }
    return (
      a(
        e,
        [
          {
            key: 'easeFunc',
            get: function () {
              return l.default.easeFunction(this.ease);
            },
          },
        ],
        [
          {
            key: 'getBlock',
            value: function (e, t) {
              for (var n = e.length - 1; n > 0; n--)
                if (e[n].start >= t && e[n - 1].start <= t)
                  return { end: e[n], start: e[n - 1] };
            },
          },
        ],
      ),
      e
    );
  })(),
  kn = 180 / Math.PI,
  Sn = function e(t) {
    d(this, e);
    var n = (t || {}).timeScale,
      r = void 0 === n ? 1 : n;
    this.timeScale = r;
  },
  En = (function () {
    function e(t) {
      d(this, e);
      var n = t || {},
        r = n.mode,
        i = void 0 === r ? 1 : r,
        o = n.name,
        a = void 0 === o ? '' : o;
      ((this.mode = i), (this.name = a));
    }
    return (
      a(e, [
        {
          key: 'createHistory',
          value: function () {
            return null;
          },
        },
        {
          key: 'clone',
          value: function () {
            return e.create(this);
          },
        },
      ]),
      e
    );
  })(),
  Cn = (function () {
    function e() {
      (d(this, e),
        (this.current = null),
        (this.previous = null),
        (this.currentTrackName = ''));
    }
    return (
      a(e, [
        {
          key: 'check',
          value: function (e, t) {
            e !== this.currentTrackName &&
              ((this.previous = this.current),
              (this.current = t.createHistory()),
              (this.currentTrackName = e));
          },
        },
      ]),
      e
    );
  })(),
  Tn = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (n.copy(e), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function (e) {
            var t = e || {},
              n = t.delay,
              r = void 0 === n ? 0.1 : n,
              i = t.speed,
              o = void 0 === i ? 0.1 : i,
              a = t.spring,
              s = void 0 === a ? 0 : a,
              l = t.affectByRange,
              c = void 0 === l ? 1 : l,
              u = t.affectByX,
              f = void 0 === u ? 1 : u,
              d = t.affectByY,
              h = void 0 === d ? 1 : d,
              p = t.rotateMoveRange,
              m = void 0 === p ? 1 : p,
              v = t.affectByLevel,
              g = void 0 === v ? 0 : v,
              y = t.springLevel,
              A = void 0 === y ? 0 : y,
              b = t.limitRange,
              w = void 0 === b ? 10 : b;
            ((this.delay = r),
              (this.speed = o),
              (this.affectByRange = c),
              (this.affectByX = f),
              (this.affectByY = h),
              (this.rotateMoveRange = m),
              (this.spring = s),
              (this.affectByLevel = g),
              (this.springLevel = A),
              (this.limitRange = w));
          },
        },
        {
          key: 'createHistory',
          value: function () {
            return { speedX: 0, speedY: 0, buffer: [] };
          },
        },
      ]),
      t
    );
  })(En),
  In = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (n.copy(e), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function (e) {
            var t = e || {},
              n = t.rotateOffset,
              r = void 0 === n ? 0 : n,
              i = t.rotateTime,
              o = void 0 === i ? 2 : i,
              a = t.rotateRange,
              s = void 0 === a ? 10 : a,
              l = t.rotateCenter,
              c = void 0 === l ? 0 : l,
              u = t.childOffset,
              f = void 0 === u ? 0.25 : u,
              d = t.spring,
              h = void 0 === d ? 0 : d,
              p = t.affectByLevel,
              m = void 0 === p ? 0.1 : p,
              v = t.springLevel,
              g = void 0 === v ? 0 : v,
              y = t.scaleYRange,
              A = void 0 === y ? 0 : y,
              b = t.scaleYTime,
              w = void 0 === b ? 2 : b,
              _ = t.scaleYCenter,
              x = void 0 === _ ? 0 : _,
              k = t.scaleYOffset,
              S = void 0 === k ? 0 : k,
              E = t.scaleYChildOffset,
              C = void 0 === E ? 0.25 : E,
              T = t.scaleYSpring,
              I = void 0 === T ? 0 : T,
              M = t.scaleYAffectByLevel,
              O = void 0 === M ? 0.1 : M,
              B = t.scaleXRange,
              P = void 0 === B ? 0 : B,
              L = t.scaleXTime,
              R = void 0 === L ? 2 : L,
              D = t.scaleXCenter,
              F = void 0 === D ? 0 : D,
              j = t.scaleXOffset,
              N = void 0 === j ? 0 : j,
              z = t.scaleXChildOffset,
              U = void 0 === z ? 0.25 : z,
              G = t.scaleXSpring,
              H = void 0 === G ? 0 : G,
              Q = t.scaleXAffectByLevel,
              V = void 0 === Q ? 0.1 : Q,
              q = t.moveXRange,
              W = void 0 === q ? 0 : q,
              Y = t.moveXOffset,
              X = void 0 === Y ? 0 : Y,
              J = t.moveXTime,
              K = void 0 === J ? 2 : J,
              $ = t.moveXChildOffset,
              Z = void 0 === $ ? 0.25 : $,
              ee = t.moveXSpring,
              te = void 0 === ee ? 0 : ee,
              ne = t.moveXAffectByLevel,
              re = void 0 === ne ? 0.1 : ne,
              ie = t.moveXCenter,
              oe = void 0 === ie ? 0 : ie,
              ae = t.moveYRange,
              se = void 0 === ae ? 0 : ae,
              le = t.moveYOffset,
              ce = void 0 === le ? 0 : le,
              ue = t.moveYTime,
              fe = void 0 === ue ? 2 : ue,
              de = t.moveYChildOffset,
              he = void 0 === de ? 0.25 : de,
              pe = t.moveYSpring,
              me = void 0 === pe ? 0 : pe,
              ve = t.moveYAffectByLevel,
              ge = void 0 === ve ? 0.1 : ve,
              ye = t.moveYCenter,
              Ae = void 0 === ye ? oe : ye;
            ((this.rotateOffset = r),
              (this.rotateCenter = c),
              (this.rotateTime = o),
              (this.rotateRange = s),
              (this.affectByLevel = m),
              (this.springLevel = g),
              (this.spring = h),
              (this.childOffset = f),
              (this.scaleYRange = A),
              (this.scaleYCenter = x),
              (this.scaleYTime = w),
              (this.scaleYOffset = S),
              (this.scaleYChildOffset = C),
              (this.scaleYSpring = I),
              (this.scaleYAffectByLevel = O),
              (this.scaleXRange = P),
              (this.scaleXCenter = F),
              (this.scaleXTime = R),
              (this.scaleXOffset = N),
              (this.scaleXChildOffset = U),
              (this.scaleXSpring = H),
              (this.scaleXAffectByLevel = V),
              (this.sinScaleXSameAsY =
                P === A &&
                x === F &&
                R === w &&
                N === S &&
                U === C &&
                H === I &&
                O === V),
              (this.moveXRange = W),
              (this.moveXTime = K),
              (this.moveXSpring = te),
              (this.moveXChildOffset = Z),
              (this.moveXAffectByLevel = re),
              (this.moveXOffset = X),
              (this.moveXCenter = oe),
              (this.moveYRange = se),
              (this.moveYTime = fe),
              (this.moveYSpring = me),
              (this.moveYChildOffset = he),
              (this.moveYAffectByLevel = ge),
              (this.moveYOffset = ce),
              (this.moveYCenter = Ae));
          },
        },
      ]),
      t
    );
  })(En),
  Mn = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (n.copy(e), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function (e) {
            var t = e || {},
              n = t.moveXFreq,
              r = void 0 === n ? 1 : n,
              i = t.moveXAmp,
              o = void 0 === i ? 0 : i,
              a = t.moveXOctaves,
              s = void 0 === a ? 0 : a,
              l = t.moveXDelay,
              c = void 0 === l ? 0 : l,
              u = t.moveXCenter,
              f = void 0 === u ? 0 : u,
              d = t.moveXSeed,
              h = void 0 === d ? Math.floor(1e4 * Math.random()) : d,
              p = t.moveYFreq,
              m = void 0 === p ? r : p,
              v = t.moveYAmp,
              g = void 0 === v ? o : v,
              y = t.moveYOctaves,
              A = void 0 === y ? s : y,
              b = t.moveYDelay,
              w = void 0 === b ? c : b,
              _ = t.moveYCenter,
              x = void 0 === _ ? f : _,
              k = t.scaleXFreq,
              S = void 0 === k ? 1 : k,
              E = t.scaleXAmp,
              C = void 0 === E ? 0 : E,
              T = t.scaleXOctaves,
              I = void 0 === T ? 0 : T,
              M = t.scaleXDelay,
              O = void 0 === M ? 0 : M,
              B = t.scaleXCenter,
              P = void 0 === B ? 0 : B,
              L = t.scaleYFreq,
              R = void 0 === L ? S : L,
              D = t.scaleYAmp,
              F = void 0 === D ? C : D,
              j = t.scaleYOctaves,
              N = void 0 === j ? I : j,
              z = t.scaleYDelay,
              U = void 0 === z ? O : z,
              G = t.scaleYCenter,
              H = void 0 === G ? P : G,
              Q = t.rotateSpeed,
              V = void 0 === Q ? 0 : Q,
              q = t.rotateFreq,
              W = void 0 === q ? 1 : q,
              Y = t.rotateAmp,
              X = void 0 === Y ? 0 : Y,
              J = t.rotateOctaves,
              K = void 0 === J ? 0 : J,
              $ = t.rotateDelay,
              Z = void 0 === $ ? 0 : $,
              ee = t.rotateCenter,
              te = void 0 === ee ? 0 : ee,
              ne = t.rotateFollowLimit,
              re = void 0 === ne ? 0 : ne,
              ie = t.rotateFollowSpeed,
              oe = void 0 === ie ? 0.1 : ie,
              ae = t.rotateFollowFlip,
              se = void 0 === ae ? 0 : ae,
              le = t.rotateFollowXMax,
              ce = void 0 === le ? 20 : le,
              ue = t.rotateFollowYMax,
              fe = void 0 === ue ? 20 : ue;
            ((this.moveXFreq = r),
              (this.moveXAmp = o),
              (this.moveXOctaves = s),
              (this.moveXDelay = c),
              (this.moveXCenter = f),
              (this.moveXSeed = h),
              (this.moveYFreq = m),
              (this.moveYAmp = g),
              (this.moveYOctaves = A),
              (this.moveYDelay = w),
              (this.moveYCenter = x),
              (this.moveYSameAsX =
                r === m && o === g && s === A && c === w && f === x),
              (this.scaleXFreq = S),
              (this.scaleXAmp = C),
              (this.scaleXOctaves = I),
              (this.scaleXDelay = O),
              (this.scaleXCenter = P),
              (this.scaleYFreq = R),
              (this.scaleYAmp = F),
              (this.scaleYOctaves = N),
              (this.scaleYDelay = U),
              (this.scaleYCenter = H),
              (this.scaleYSameAsX =
                S === R && C === F && I === N && O === U && P === H),
              (this.rotateSpeed = V),
              (this.rotateFreq = W),
              (this.rotateAmp = X),
              (this.rotateOctaves = K),
              (this.rotateDelay = Z),
              (this.rotateCenter = te),
              (this.rotateFollowEnable = 0 !== re),
              (this.rotateFollowLimit = re),
              (this.rotateFollowSpeed = oe),
              (this.rotateFollowFlip = se),
              (this.rotateFollowXMax = ce),
              (this.rotateFollowYMax = fe));
          },
        },
      ]),
      t
    );
  })(En),
  On = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (n.copy(e), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function (e) {
            var t = e || {},
              n = t.delay,
              r = void 0 === n ? 0.1 : n,
              i = t.speed,
              o = void 0 === i ? 0.1 : i,
              a = t.spring,
              s = void 0 === a ? 0 : a,
              l = t.springRot,
              c = void 0 === l ? 0 : l,
              u = t.affectByLevel,
              f = void 0 === u ? 0 : u,
              d = t.springLevel,
              h = void 0 === d ? 0 : d,
              p = t.limitRange,
              m = void 0 === p ? 80 : p,
              v = t.rotateOffset,
              g = void 0 === v ? 0 : v,
              y = t.friction,
              A = void 0 === y ? 0.7 : y,
              b = t.springUseTarget,
              w = void 0 !== b && b,
              _ = t.windX,
              x = void 0 === _ ? 0 : _,
              k = t.windY,
              S = void 0 === k ? 0 : k,
              E = t.windFreq,
              C = void 0 === E ? 1 : E,
              T = t.windOctaves,
              I = void 0 === T ? 0 : T,
              M = t.windAccel,
              O = void 0 === M ? 1 : M,
              B = t.windDelay,
              P = void 0 === B ? 0 : B,
              L = t.gravityX,
              R = void 0 === L ? 0 : L,
              D = t.gravityY,
              F = void 0 === D ? 0 : D;
            ((this.delay = r),
              (this.speed = o),
              (this.spring = s),
              (this.springRot = c),
              (this.affectByLevel = f),
              (this.springLevel = h),
              (this.limitRange = m),
              (this.rotateOffset = g),
              (this.friction = A),
              (this.springUseTarget = w),
              (this.windX = x),
              (this.windY = S),
              (this.windFreq = C),
              (this.windAccel = O),
              (this.windDelay = P),
              (this.windOctaves = I),
              (this.gravityX = R),
              (this.gravityY = F),
              (this.hasWindForce = x || S));
          },
        },
      ]),
      t
    );
  })(En),
  Bn = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (n.copy(e), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function (e) {
            var t = e || {},
              n = t.elasticSpring,
              r = void 0 === n ? 0.4 : n,
              i = t.elasticFriction,
              o = void 0 === i ? 0.6 : i,
              a = t.elasticSoftness,
              s = void 0 === a ? 1 : a,
              l = t.elasticSpringY,
              c = void 0 === l ? r : l,
              u = t.elasticFrictionY,
              f = void 0 === u ? o : u,
              d = t.elasticSoftnessY,
              h = void 0 === d ? s : d;
            ((this.elasticSpring = r),
              (this.elasticFriction = o),
              (this.elasticSoftness = s),
              (this.elasticSpringY = c),
              (this.elasticFrictionY = f),
              (this.elasticSoftnessY = h));
          },
        },
      ]),
      t
    );
  })(En),
  Pn = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      return (n.copy(e), n);
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'copy',
          value: function (e) {
            var t = e || {},
              n = t.delay,
              r = void 0 === n ? 0 : n,
              i = t.xFrames,
              o = void 0 === i ? [] : i,
              a = t.yFrames,
              s = void 0 === a ? [] : a,
              l = t.sxFrames,
              c = void 0 === l ? [] : l,
              u = t.syFrames,
              f = void 0 === u ? [] : u;
            ((this.delay = r),
              (this.xFrames = o.map(function (e) {
                return new xn(e);
              })),
              (this.xFramesEnd = this.xFrames.length
                ? this.xFrames[this.xFrames.length - 1].start
                : 0),
              (this.yFrames = s.map(function (e) {
                return new xn(e);
              })),
              (this.yFramesEnd = this.yFrames.length
                ? this.yFrames[this.yFrames.length - 1].start
                : 0),
              (this.sxFrames = c.map(function (e) {
                return new xn(e);
              })),
              (this.sxFramesEnd = this.sxFrames.length
                ? this.sxFrames[this.sxFrames.length - 1].start
                : 0),
              (this.sYSameAsSX = 0 === f.length),
              this.sYSameAsSX
                ? ((this.syFrames = []), (this.syFramesEnd = 0))
                : ((this.syFrames = f.map(function (e) {
                    return new xn(e);
                  })),
                  (this.syFramesEnd = this.syFrames.length
                    ? this.syFrames[this.syFrames.length - 1].start
                    : 0)));
          },
        },
      ]),
      t
    );
  })(En),
  Ln = (function () {
    function e(t, n) {
      d(this, e);
      var r = t || {},
        i = r.animation,
        a = void 0 === i ? {} : i,
        s = r.rootBoneName,
        l = void 0 === s ? '' : s,
        u = r.endBoneName,
        f = void 0 === u ? [] : u,
        h = r.targetBoneName,
        p = void 0 === h ? '' : h,
        m = r.targetEndBoneName,
        v = void 0 === m ? '' : m,
        g = r.targetWeight,
        y = void 0 === g ? 1 : g;
      ((this.animation = (0, c.fromEntries)(
        Object.keys(a)
          .map(function (e) {
            return [e, a[e]];
          })
          .map(function (t) {
            var n = o(t, 2),
              r = n[0],
              i = n[1];
            return [r, e.createAnimation(i)];
          }),
      )),
        (this.rootMovement = 0),
        (this.rootBoneName = l),
        (this.endBoneName = Array.isArray(f)
          ? f
          : [f].filter(function (e) {
              return '' !== e;
            })),
        (this.targetBoneName = p),
        (this.targetEndBoneName = v),
        (this.targetWeight = y),
        (this.history = new Cn()),
        this.bind(n));
    }
    return (
      a(
        e,
        [
          {
            key: 'bind',
            value: function (e) {
              ((this.spineObj = e),
                (this.rootBone = e.skeleton.findBone(this.rootBoneName)),
                '' !== this.targetBoneName &&
                  (this.targetBone = e.skeleton.findBone(this.targetBoneName)),
                this.init(this.rootBone));
            },
          },
          {
            key: 'init',
            value: function (e) {
              var t = this,
                n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : 0;
              ((e.initX = e.x),
                (e.initY = e.y),
                (e.initWorldX = e.worldX),
                (e.initWorldY = e.worldY),
                (e.initScaleX = e.scaleX),
                (e.initScaleY = e.scaleY),
                (e.initRotation = e.rotation),
                (e.autoMovePrevWorldX = e.worldX),
                (e.autoMovePrevWorldY = e.worldY),
                (e.autoMoveSpeedX = 0),
                (e.autoMoveSpeedY = 0),
                (e.autoMoveFriction = 0),
                (e.followRotation = 0),
                (e.elasticSpeedX = 0),
                (e.elasticSpeedY = 0),
                e.children.forEach(function (e) {
                  t.init(e, n + 1);
                }),
                0 === e.children.length &&
                  ((e.tailAutoMovePrevWorldX = e.y * e.b + e.worldX),
                  (e.tailAutoMovePrevWorldY = e.y * e.d + e.worldY)));
            },
          },
          {
            key: 'reset',
            value: function () {
              ((this.rootMovement = 0), this.resetBone());
            },
          },
          {
            key: 'resetBone',
            value: function () {
              var e = this,
                t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : this.rootBone;
              ((t.worldX = t.initWorldX),
                (t.worldY = t.initWorldY),
                (t.scaleX = t.initScaleX),
                (t.scaleY = t.initScaleY),
                (t.rotation = t.initRotation),
                this.endBoneName.includes(t.name) ||
                  t.children.forEach(function (t) {
                    e.resetBone(t);
                  }));
            },
          },
          {
            key: 'render',
            value: function (e, t, n, r) {
              var i = null,
                o = this.currentAnimation,
                a = this.currentTrackName,
                s = 1;
              (this.history.current ||
                this.history.check(this.currentTrackName, o),
                r &&
                  a !== r &&
                  ((i = this.animation[r] || this.defaultAnimation),
                  this.history.check(this.currentTrackName, o)),
                i &&
                  1 !== n &&
                  ((s = n),
                  this.renderAutoBone(i, this.history.previous, e, t, 1)),
                this.renderAutoBone(o, this.history.current, e, t, s));
            },
          },
          {
            key: 'renderAutoBone',
            value: function (e, t, n, r, i) {
              var o = e.mode;
              if (1 === o)
                this.updateSineMode(e, r, this.rootBone, this.targetBone, 0, i);
              else if (2 === o)
                this.updatePhysicMode(e, t, this.rootBone, r, n, i);
              else if (3 === o) {
                var a = e.moveXFreq,
                  s = e.moveXAmp,
                  l = e.moveXOctaves,
                  c = e.moveXDelay,
                  u = e.moveXCenter,
                  f = e.moveYSameAsX,
                  d = e.moveXSeed,
                  h = 0 === s ? 0 : this.updateWiggleMode(a, s, l, r, c) + u;
                if (
                  ((this.rootBone.x = this.mixValue(
                    this.rootBone.x,
                    this.rootBone.initX + h,
                    i,
                  )),
                  f)
                )
                  ((h =
                    0 === s ? 0 : this.updateWiggleMode(a, s, l, r, c + d) + u),
                    (this.rootBone.y = this.mixValue(
                      this.rootBone.y,
                      this.rootBone.initY + h,
                      i,
                    )));
                else {
                  var p = e.moveYFreq,
                    m = e.moveYAmp,
                    v = e.moveYOctaves,
                    g = e.moveYDelay,
                    y = e.moveYCenter;
                  ((h = 0 === m ? 0 : this.updateWiggleMode(p, m, v, r, g) + y),
                    (this.rootBone.y = this.mixValue(
                      this.rootBone.y,
                      this.rootBone.initY + h,
                      i,
                    )));
                }
                var A = e.scaleXFreq,
                  b = e.scaleXAmp,
                  w = e.scaleXOctaves,
                  _ = e.scaleXDelay,
                  x = e.scaleXCenter,
                  k = e.scaleYSameAsX;
                if (
                  ((h = 0 === b ? 0 : this.updateWiggleMode(A, b, w, r, _) + x),
                  (this.rootBone.scaleX = this.mixValue(
                    this.rootBone.scaleX,
                    this.rootBone.initScaleX + h,
                    i,
                  )),
                  k)
                )
                  this.rootBone.scaleY = this.mixValue(
                    this.rootBone.scaleY,
                    this.rootBone.initScaleY + h,
                    i,
                  );
                else {
                  var S = e.scaleYFreq,
                    E = e.scaleYAmp,
                    C = e.scaleYOctaves,
                    T = e.scaleYDelay,
                    I = e.scaleYCenter;
                  ((h = 0 === E ? 0 : this.updateWiggleMode(S, E, C, r, T) + I),
                    (this.rootBone.scaleY = this.mixValue(
                      this.rootBone.scaleY,
                      this.rootBone.initScaleY + h,
                      i,
                    )));
                }
                var M = e.rotateSpeed,
                  O = e.rotateFreq,
                  B = e.rotateAmp,
                  P = e.rotateOctaves,
                  L = e.rotateDelay,
                  R = e.rotateCenter,
                  D = e.rotateFollowEnable,
                  F = e.rotateFollowLimit,
                  j = e.rotateFollowSpeed,
                  N = e.rotateFollowFlip,
                  z = e.rotateFollowXMax,
                  U = e.rotateFollowYMax;
                if (
                  ((h = this.rootBone.initRotation + r * M * 360 + R),
                  (h += 0 === B ? 0 : this.updateWiggleMode(O, B, P, r, L)),
                  D)
                ) {
                  var G =
                      this.rootBone.worldX - this.rootBone.autoMovePrevWorldX,
                    H = this.rootBone.worldY - this.rootBone.autoMovePrevWorldY,
                    Q = void 0,
                    V =
                      (Q =
                        1 === N
                          ? -F * Math.max(-1, Math.min(1, G / z)) -
                            F * Math.max(-1, Math.min(1, H / U))
                          : (Math.atan2(H, G) * kn + 360) % 360) -
                      this.rootBone.followRotation;
                  (V >= 180 ? (Q -= 360) : V <= -180 && (Q += 360),
                    (this.rootBone.followRotation +=
                      Math.min(
                        F,
                        Math.max(-F, Q - this.rootBone.followRotation),
                      ) * j),
                    (this.rootBone.followRotation =
                      (this.rootBone.followRotation + 360) % 360),
                    2 === N &&
                      Math.abs(this.rootBone.followRotation - 180) < 90 &&
                      (this.rootBone.scaleY *= -1),
                    (h += this.rootBone.followRotation));
                }
                ((this.rootBone.autoMovePrevWorldX = this.rootBone.worldX),
                  (this.rootBone.autoMovePrevWorldY = this.rootBone.worldY),
                  (this.rootBone.rotation = this.mixValue(
                    this.rootBone.rotation,
                    h,
                    i,
                  )));
              } else if (4 === o) {
                var q = this.rootBone.getWorldScale(),
                  W = q.x,
                  Y = q.y,
                  X = e.hasWindForce,
                  J = e.gravityX,
                  K = e.gravityY;
                if (((e.forceX = -J), (e.forceY = -K), X)) {
                  var $ =
                    0.5 +
                    0.5 *
                      this.updateWiggleMode(
                        1 / e.windFreq,
                        1,
                        e.windOctaves,
                        r,
                        e.windDelay,
                        0.8,
                      );
                  ((e.forceX += e.windX * $), (e.forceY += e.windY * $));
                }
                this.updateSpringMagic(
                  e,
                  this.rootBone,
                  this.targetBone,
                  r,
                  n,
                  0,
                  i,
                  W * Y < 0 ? -1 : 1,
                );
              } else
                5 === o
                  ? this.updateElasic(e, this.rootBone, n, i)
                  : 6 === o && this.updateKeyFrameMode(e, this.rootBone, r, i);
            },
          },
          {
            key: 'getHistoryRotate',
            value: function (e, t) {
              for (var n = t.length - 1; n > -1; n--) {
                var r = t[n];
                if (r.time > e) {
                  for (var i = n - 1; i > -1; i--) {
                    var o = t[i];
                    if (e >= o.time)
                      return (
                        o.delta +
                        ((r.delta - o.delta) * (e - o.time)) / (r.time - o.time)
                      );
                  }
                  return 0;
                }
              }
              return 0;
            },
          },
          {
            key: 'mixValue',
            value: function (e, t, n) {
              return e + (t - e) * n;
            },
          },
          {
            key: 'updateSineMode',
            value: function (e, t) {
              var n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : this.rootBone,
                r =
                  arguments.length > 3 && void 0 !== arguments[3]
                    ? arguments[3]
                    : this.targetBone,
                i = this,
                o =
                  arguments.length > 4 && void 0 !== arguments[4]
                    ? arguments[4]
                    : 0,
                a = arguments[5];
              if (!this.endBoneName.includes(n.data.name)) {
                var s = r && r.data.name !== this.targetEndBoneName,
                  l = s
                    ? this.mixValue(
                        n.initRotation,
                        r.rotation,
                        this.targetWeight,
                      )
                    : n.initRotation;
                n.rotation = this.mixValue(
                  n.rotation,
                  l +
                    Math.sin(
                      ((e.rotateOffset -
                        Math.pow(e.childOffset * o, 1 + e.spring) +
                        t) *
                        Math.PI *
                        2) /
                        e.rotateTime,
                    ) *
                      e.rotateRange *
                      Math.pow(1 + o * e.affectByLevel, 1 + e.springLevel) +
                    e.rotateCenter,
                  a,
                );
                var c = 0;
                if (0 !== e.scaleYRange) {
                  var u = s
                    ? this.mixValue(n.initScaleY, r.scaleY, this.targetWeight)
                    : n.initScaleY;
                  if (
                    ((c =
                      Math.sin(
                        ((e.scaleYOffset -
                          Math.pow(
                            e.scaleYChildOffset * o,
                            1 + e.scaleYSpring,
                          ) +
                          t) *
                          Math.PI *
                          2) /
                          e.scaleYTime,
                      ) *
                        e.scaleYRange *
                        Math.pow(
                          1 + o * e.scaleYAffectByLevel,
                          1 + e.springLevel,
                        ) +
                      e.scaleYCenter),
                    (n.scaleY = this.mixValue(n.scaleY, u + c, a)),
                    e.sinScaleXSameAsY)
                  ) {
                    var f = s
                      ? this.mixValue(n.initScaleX, r.scaleX, this.targetWeight)
                      : n.initScaleX;
                    n.scaleX = this.mixValue(n.scaleX, f + c, a);
                  }
                }
                if (!e.sinScaleXSameAsY && 0 !== e.scaleXRange) {
                  var d = s
                    ? this.mixValue(n.initScaleX, r.scaleX, this.targetWeight)
                    : n.initScaleX;
                  ((c =
                    Math.sin(
                      ((e.scaleXOffset -
                        Math.pow(e.scaleXChildOffset * o, 1 + e.scaleXSpring) +
                        t) *
                        Math.PI *
                        2) /
                        e.scaleXTime,
                    ) *
                      e.scaleXRange *
                      Math.pow(
                        1 + o * e.scaleXAffectByLevel,
                        1 + e.springLevel,
                      ) +
                    e.scaleXCenter),
                    (n.scaleX = this.mixValue(n.scaleX, d + c, a)));
                }
                if (0 !== e.moveXRange) {
                  var h = s
                      ? this.mixValue(n.initX, r.x, this.targetWeight)
                      : n.initX,
                    p =
                      Math.sin(
                        ((e.moveXOffset -
                          Math.pow(e.moveXChildOffset * o, 1 + e.moveXSpring) +
                          t) *
                          Math.PI *
                          2) /
                          e.moveXTime,
                      ) *
                        e.moveXRange *
                        Math.pow(
                          1 + o * e.moveXAffectByLevel,
                          1 + e.springLevel,
                        ) +
                      e.moveXCenter;
                  n.x = this.mixValue(n.x, p + h, a);
                }
                if (0 !== e.moveYRange) {
                  var m = s
                      ? this.mixValue(n.initY, r.y, this.targetWeight)
                      : n.initY,
                    v =
                      Math.sin(
                        ((e.moveYOffset -
                          Math.pow(e.moveYChildOffset * o, 1 + e.moveYSpring) +
                          t) *
                          Math.PI *
                          2) /
                          e.moveYTime,
                      ) *
                        e.moveYRange *
                        Math.pow(
                          1 + o * e.moveYAffectByLevel,
                          1 + e.springLevel,
                        ) +
                      e.moveYCenter;
                  n.y = this.mixValue(n.y, v + m, a);
                }
                n.children.forEach(function (n, l) {
                  var c = s ? r.children[l] : null;
                  i.updateSineMode(e, t, n, c, o + 1, a);
                });
              }
            },
          },
          {
            key: 'updateWiggleMode',
            value: function (e, t, n, r, i) {
              for (
                var o =
                    arguments.length > 5 && void 0 !== arguments[5]
                      ? arguments[5]
                      : 0.5,
                  a = 0,
                  s = 1,
                  l = n + 1,
                  c = 1 / (2 - 1 / Math.pow(2, l - 1)),
                  u = c,
                  f = 0,
                  d = 0;
                d < l;
                d++
              )
                ((a += s * Math.sin((r * u * Math.PI * 2) / e + i)),
                  (u = c * Math.pow(1.5, d + 1)),
                  (f += s),
                  (s *= o));
              return (a / f) * t;
            },
          },
          {
            key: 'updatePhysicMode',
            value: function (e, t, n, r, i, o) {
              var a = this,
                s = Math.min(
                  e.limitRange,
                  Math.max(-e.limitRange, n.autoMovePrevWorldX - n.worldX),
                ),
                l = Math.min(
                  e.limitRange,
                  Math.max(-e.limitRange, n.autoMovePrevWorldY - n.worldY),
                );
              ((t.speedX += (e.affectByX * s - t.speedX) * e.speed * i),
                (t.speedY += (e.affectByY * l - t.speedY) * e.speed * i),
                (n.autoMovePrevWorldX = n.worldX),
                (n.autoMovePrevWorldY = n.worldY));
              var c = e.affectByRange * (-t.speedX * n.c + t.speedY * n.d);
              ((n.rotation = this.mixValue(n.rotation, c + n.initRotation, o)),
                t.buffer.push({ time: r, delta: c }),
                t.buffer.length > 300 && t.buffer.shift(),
                n.children.forEach(function (n) {
                  a.updateFollowMode(e, t, n, r, 1, o);
                }));
            },
          },
          {
            key: 'updateFollowMode',
            value: function (e, t, n, r, i, o) {
              var a = this;
              this.endBoneName.includes(n.data.name) ||
                ((n.rotation = this.mixValue(
                  n.rotation,
                  n.initRotation +
                    this.getHistoryRotate(
                      r - e.delay * (1 + i * e.spring),
                      t.buffer,
                    ) *
                      e.rotateMoveRange *
                      Math.pow(1 + i * e.affectByLevel, 1 + e.springLevel),
                  o,
                )),
                n.children.forEach(function (n) {
                  a.updateFollowMode(e, t, n, r, i + 1, o);
                }));
            },
          },
          {
            key: 'updateSpringMagic',
            value: function (e, t, n, r, i, o, a, s) {
              var l = this;
              if (!this.endBoneName.includes(t.data.name)) {
                (t.updateWorldTransform(),
                  (t.autoMovePrevWorldX = t.worldX),
                  (t.autoMovePrevWorldY = t.worldY));
                var c = n && n.data.name !== this.targetEndBoneName,
                  u = c
                    ? this.mixValue(
                        t.initRotation,
                        n.rotation,
                        this.targetWeight,
                      )
                    : t.initRotation,
                  f = e.springUseTarget && n ? n : t,
                  d = 1 + o * e.affectByLevel,
                  h = Math.pow(d, 1 + e.springLevel),
                  p =
                    e.delay *
                    h *
                    (1 + e.springRot * d) *
                    i *
                    (0 === o ? 1 + e.spring : 1),
                  m = e.friction,
                  v = e.forceX,
                  g = e.forceY,
                  y = 1 - e.windAccel;
                if (t.children.length > 0)
                  t.children.forEach(function (d, h) {
                    if (0 === h) {
                      var A = d.x,
                        b = d.y,
                        w = A * f.a + b * f.b + t.worldX,
                        _ = A * f.c + b * f.d + t.worldY;
                      ((w = (w - d.autoMovePrevWorldX) * p),
                        (_ = (_ - d.autoMovePrevWorldY) * p),
                        (t.autoMoveSpeedX += w),
                        (t.autoMoveSpeedY += _),
                        (t.autoMoveSpeedX *= m),
                        (t.autoMoveSpeedY *= m),
                        (t.autoMoveSpeedX += v * e.windAccel),
                        (t.autoMoveSpeedY += g * e.windAccel));
                      var x = d.autoMovePrevWorldX + t.autoMoveSpeedX + v * y,
                        k = d.autoMovePrevWorldY + t.autoMoveSpeedY + g * y,
                        S = t.worldToLocalRotation(
                          s *
                            Math.atan2(k - t.worldY, s * (x - t.worldX)) *
                            kn +
                            (0 === o ? e.rotateOffset : 0),
                        ),
                        E =
                          Math.min(
                            e.limitRange,
                            Math.max(-e.limitRange, S - u),
                          ) + u;
                      ((t.rotation = l.mixValue(
                        t.rotation,
                        u * e.speed + (1 - e.speed) * E,
                        a * t.autoMoveFriction,
                      )),
                        t.updateWorldTransform());
                    }
                    var C = c ? n.children[h] : null;
                    l.updateSpringMagic(e, d, C, r, i, o + 1, a, s);
                  });
                else {
                  var A = t.x,
                    b = t.y,
                    w = A * f.a + b * f.b + t.worldX,
                    _ = A * f.c + b * f.d + t.worldY;
                  ((w = (w - t.tailAutoMovePrevWorldX) * p),
                    (_ = (_ - t.tailAutoMovePrevWorldY) * p),
                    (t.autoMoveSpeedX += w),
                    (t.autoMoveSpeedY += _),
                    (t.autoMoveSpeedX *= m),
                    (t.autoMoveSpeedY *= m),
                    (t.autoMoveSpeedX += v * e.windAccel),
                    (t.autoMoveSpeedY += g * e.windAccel));
                  var x = t.tailAutoMovePrevWorldX + t.autoMoveSpeedX + v * y,
                    k = t.tailAutoMovePrevWorldY + t.autoMoveSpeedY + g * y,
                    S = t.worldToLocalRotation(
                      s * Math.atan2(k - t.worldY, s * (x - t.worldX)) * kn +
                        (0 === o ? e.rotateOffset : 0),
                    ),
                    E =
                      Math.min(e.limitRange, Math.max(-e.limitRange, S - u)) +
                      u;
                  ((t.rotation = this.mixValue(
                    t.rotation,
                    u * e.speed + (1 - e.speed) * E,
                    a * t.autoMoveFriction,
                  )),
                    t.updateWorldTransform(),
                    (t.tailAutoMovePrevWorldX = A * t.a + b * t.b + t.worldX),
                    (t.tailAutoMovePrevWorldY = A * t.c + b * t.d + t.worldY));
                }
                t.autoMoveFriction += 0.1 * (1 - t.autoMoveFriction) * i;
              }
            },
          },
          {
            key: 'updateElasic',
            value: function (e, t, n, r) {
              if (!this.endBoneName.includes(t.data.name)) {
                var i = t.parent,
                  o = t.initX,
                  a = t.initY,
                  s = o * i.a + a * i.b + i.worldX,
                  l = o * i.c + a * i.d + i.worldY,
                  c = (s - t.autoMovePrevWorldX) * e.elasticSpring * n,
                  u = (l - t.autoMovePrevWorldY) * e.elasticSpringY * n;
                ((t.elasticSpeedX += c),
                  (t.elasticSpeedX *= e.elasticFriction),
                  (t.elasticSpeedY += u),
                  (t.elasticSpeedY *= e.elasticFrictionY),
                  (t.autoMovePrevWorldX += t.elasticSpeedX),
                  (t.autoMovePrevWorldY += t.elasticSpeedY));
                var f = i.worldToLocal({
                    x: t.autoMovePrevWorldX,
                    y: t.autoMovePrevWorldY,
                  }),
                  d = f.x,
                  h = f.y;
                isNaN(d) ||
                  isNaN(h) ||
                  ((t.x = this.mixValue(
                    t.x,
                    d * e.elasticSoftness + (1 - e.elasticSoftness) * t.initX,
                    r * t.autoMoveFriction,
                  )),
                  (t.y = this.mixValue(
                    t.y,
                    h * e.elasticSoftnessY + (1 - e.elasticSoftnessY) * t.initY,
                    r * t.autoMoveFriction,
                  )),
                  (t.autoMoveFriction += 0.1 * (1 - t.autoMoveFriction) * n));
              }
            },
          },
          {
            key: 'updateKeyFrameMode',
            value: function (e, t, n, r) {
              var i = n + e.delay + 1e3,
                o = void 0,
                a = void 0,
                s = void 0,
                l = void 0,
                c = void 0,
                u = void 0,
                f = void 0;
              (e.xFramesEnd > 0 &&
                ((o = i % e.xFramesEnd),
                (s = (a = xn.getBlock(e.xFrames, o)).start.value),
                (l = a.end.value),
                (c = a.start.start),
                (u = a.end.start),
                (f = a.end.easeFunc),
                (t.x = this.mixValue(
                  t.x,
                  (l - s) * f((o - c) / (u - c)) + s,
                  r,
                ))),
                e.yFramesEnd > 0 &&
                  ((o = i % e.yFramesEnd),
                  (s = (a = xn.getBlock(e.yFrames, o)).start.value),
                  (l = a.end.value),
                  (c = a.start.start),
                  (u = a.end.start),
                  (f = a.end.easeFunc),
                  (t.y = this.mixValue(
                    t.y,
                    (l - s) * f((o - c) / (u - c)) + s,
                    r,
                  ))),
                e.sxFramesEnd > 0 &&
                  ((o = i % e.sxFramesEnd),
                  (s = (a = xn.getBlock(e.sxFrames, o)).start.value),
                  (l = a.end.value),
                  (c = a.start.start),
                  (u = a.end.start),
                  (f = a.end.easeFunc),
                  (t.scaleX = this.mixValue(
                    t.scaleX,
                    (l - s) * f((o - c) / (u - c)) + s,
                    r,
                  )),
                  e.sYSameAsSX
                    ? (t.scaleY = t.scaleX)
                    : e.syFramesEnd > 0 &&
                      ((o = i % e.syFramesEnd),
                      (s = (a = xn.getBlock(e.syFrames, o)).start.value),
                      (l = a.end.value),
                      (c = a.start.start),
                      (u = a.end.start),
                      (f = a.end.easeFunc),
                      (t.scaleY = this.mixValue(
                        t.scaleY,
                        (l - s) * f((o - c) / (u - c)) + s,
                        r,
                      )))));
            },
          },
          {
            key: 'currentTrackName',
            get: function () {
              return this.spineObj.state.tracks.length
                ? this.spineObj.state.tracks[0].animation.name
                : '';
            },
          },
          {
            key: 'currentAnimation',
            get: function () {
              var e = this.spineObj.state.tracks[0].animation.name;
              return this.animation[e] || this.defaultAnimation;
            },
          },
          {
            key: 'defaultAnimation',
            get: function () {
              return this.animation.default;
            },
          },
        ],
        [
          {
            key: 'createAnimation',
            value: function (e) {
              switch (e.mode) {
                case 1:
                  return new In(e);
                case 2:
                  return new Tn(e);
                case 3:
                  return new Mn(e);
                case 4:
                  return new On(e);
                case 5:
                  return new Bn(e);
                case 6:
                  return new Pn(e);
                default:
                  return new En(e);
              }
            },
          },
        ],
      ),
      e
    );
  })(),
  Rn = function e(t) {
    d(this, e);
    var n = t || {},
      r = n.mode,
      i = void 0 === r ? 1 : r,
      o = n.name,
      a = void 0 === o ? '' : o,
      s = n.delay,
      l = void 0 === s ? 0 : s;
    ((this.name = a), (this.mode = i), (this.delay = l));
  },
  Dn = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e)),
        r = e || {},
        i = r.blinkTime,
        o = void 0 === i ? 1 : i,
        a = r.min,
        s = void 0 === a ? 0 : a,
        l = r.max,
        c = void 0 === l ? 1 : l;
      return ((n.blinkTime = o), (n.min = s), (n.max = c), n);
    }
    return (f(t, e), t);
  })(Rn),
  Fn = (function (e) {
    function t(e) {
      d(this, t);
      var n = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e)),
        r = (e || {}).frames,
        i = void 0 === r ? [] : r;
      return (
        (n.frames = i.map(function (e) {
          return new xn(e);
        })),
        (n.framesEnd = n.frames[n.frames.length - 1].start),
        n
      );
    }
    return (f(t, e), t);
  })(Rn),
  jn = (function () {
    function e(t, n) {
      d(this, e);
      var r = t || {},
        i = r.animation,
        a = void 0 === i ? {} : i,
        s = r.slotName,
        l = void 0 === s ? '' : s;
      ((this.animation = (0, c.fromEntries)(
        Object.keys(a)
          .map(function (e) {
            return [e, a[e]];
          })
          .map(function (t) {
            var n = o(t, 2),
              r = n[0],
              i = n[1];
            return [r, e.createAnimation(i)];
          }),
      )),
        (this.spineObj = n),
        (this.slot = n.skeleton.slots.find(function (e) {
          return e.data.name === l;
        })));
    }
    return (
      a(e, null, [
        {
          key: 'createAnimation',
          value: function (e) {
            switch (e.mode) {
              case 1:
                return new Dn(e);
              case 2:
                return new Fn(e);
              default:
                return new Rn(e);
            }
          },
        },
      ]),
      a(e, [
        {
          key: 'render',
          value: function (e) {
            var t = this.currentAnimation;
            1 === t.mode
              ? this.updateSineMode(t, e)
              : 2 === t.mode && this.updateTweenMode(t, e);
          },
        },
        {
          key: 'updateSineMode',
          value: function (e, t) {
            this.slot.color.a =
              (0.5 +
                0.5 * Math.sin(((t + e.delay) * Math.PI * 2) / e.blinkTime)) *
                (e.max - e.min) +
              e.min;
          },
        },
        {
          key: 'updateTweenMode',
          value: function (e, t) {
            if (0 !== e.framesEnd) {
              var n = (t + e.delay + 1e3) % e.framesEnd,
                r = xn.getBlock(e.frames, n),
                i = r.start,
                o = r.end,
                a = i.value,
                s = i.start,
                l = o.value,
                c = o.start;
              this.slot.color.a = ((l - a) * (n - s)) / (c - s) + a;
            }
          },
        },
        {
          key: 'currentAnimation',
          get: function () {
            var e = this.spineObj.state.tracks[0].animation.name;
            return this.animation[e] || this.defaultAnimation;
          },
        },
        {
          key: 'defaultAnimation',
          get: function () {
            return this.animation.default;
          },
        },
      ]),
      e
    );
  })(),
  Nn = (function (e) {
    function t(e) {
      d(this, t);
      var n = {
        uniforms: { diffuse: { value: null } },
        vertexShader:
          '\n\t\t\tattribute vec4 color;\n\t\t\tvarying vec2 vUv;\n\t\t\tvarying vec4 vColor;\n\t\t\tvoid main() {\n\t\t\t\tvUv = uv;\n\t\t\t\tvColor = color;\n\t\t\t\tgl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);\n\t\t\t}\n\t\t',
        fragmentShader:
          '\n\t\t\t// 添加diffuse属性   ---------定制⬇---------\n\t\t\tuniform sampler2D diffuse;\n\t\t\t#ifdef USE_SPINE_ALPHATEST\n\t\t\tuniform float alphaTest;\n\t\t\t#endif\n\t\t\tvarying vec2 vUv;\n\t\t\tvarying vec4 vColor;\n\t\t\tvoid main(void) {\n\t\t\t\t// 添加diffuse属性   ---------定制⬇---------\n\t\t\t\tgl_FragColor = texture2D(diffuse, vUv)*vColor;\n\t\t\t\t#ifdef USE_SPINE_ALPHATEST\n\t\t\t\tif (gl_FragColor.a < alphaTest) discard;\n\t\t\t\t#endif\n\t\t\t}\n\t\t',
        side: s.DoubleSide,
        transparent: !0,
        depthWrite: !1,
        alphaTest: 0.5,
      };
      return (
        e(n),
        u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, n))
      );
    }
    return (f(t, e), t);
  })(s.ShaderMaterial),
  zn = (function (e) {
    function t(e) {
      var n =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : function (e) {},
        r =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : function (e) {},
        i =
          arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 2048,
        o = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
      d(this, t);
      var a = u(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
      ((a.materialCustomize = n),
        (a.depthMaterialCustomizer = r),
        (a.zOffset = 0.1),
        (a.maxVert = 2048),
        (a.prevTime = 0),
        (a.isSpine = !0),
        (a.batches = new Array()),
        (a.nextBatchIndex = 0),
        (a.clipper = new dn()),
        (a.vertices = b.newFloatArray(1024)),
        (a.tempColor = new m()),
        (a.tempColor2 = new m()),
        (a.vertexSize = 0),
        (a.skeleton = new ht(e)));
      var s = new Be(e);
      return (
        (a.state = new be(s)),
        (a.maxVert = i),
        (a.twoColorTint = o),
        (a.vertexSize = o ? t.TWO_COLOR_VERTEX_SIZE : t.VERTEX_SIZE),
        (a.materialCustomize = n),
        (a.depthMaterialCustomizer = r),
        a.skeleton.update(0),
        a.skeleton.updateWorldTransform(pt.pose),
        (a.autoBone = Object.keys(e.extra)
          .map(function (t) {
            return e.extra[t];
          })
          .map(function (e) {
            return new Ln(e, a);
          })),
        (a.autoSlot = Object.keys(e.extraSlot)
          .map(function (t) {
            return e.extraSlot[t];
          })
          .map(function (e) {
            return new jn(e, a);
          })),
        (a.autoBoneSpeed = new Sn(e.extraConfig)),
        (a.prevTime = 0),
        a
      );
    }
    return (
      f(t, e),
      a(t, [
        {
          key: 'update',
          value: function (e, t) {
            var n = this.state,
              r = this.skeleton;
            (n.update(e), n.apply(r), r.update(e));
            var i = 1,
              o = null,
              a = t * this.autoBoneSpeed.timeScale * n.timeScale;
            n.tracks[0] &&
              (i = n.tracks[0].mixDuration
                ? Math.min(1, n.tracks[0].mixTime / n.tracks[0].mixDuration)
                : 1) < 1 &&
              n.tracks[0].mixingFrom &&
              n.tracks[0].mixingFrom.animation &&
              (o = n.tracks[0].mixingFrom.animation.name);
            var s = Math.min(2, Math.abs(a - this.prevTime) / 0.0167);
            ((this.prevTime = a),
              this.autoBone.forEach(function (e) {
                e.render(s, a, i, o);
              }),
              this.autoSlot.forEach(function (e) {
                e.render(a);
              }),
              r.updateWorldTransform(pt.update),
              this.updateGeometry());
          },
        },
        {
          key: 'dispose',
          value: function () {
            for (var e = 0; e < this.batches.length; e++)
              this.batches[e].dispose();
          },
        },
        {
          key: 'clearBatches',
          value: function () {
            for (var e = 0; e < this.batches.length; e++)
              this.batches[e].clear();
            this.nextBatchIndex = 0;
          },
        },
        {
          key: 'nextBatch',
          value: function () {
            if (this.batches.length == this.nextBatchIndex) {
              var e = new wn(
                this.maxVert,
                this.materialCustomize,
                this.depthMaterialCustomizer,
                this.twoColorTint,
              );
              (this.add(e), this.batches.push(e));
            }
            var t = this.batches[this.nextBatchIndex++];
            return (
              this.renderOrder && (t.renderOrder = this.renderOrder - 0.1),
              (t.castShadow = this.castShadow),
              (t.receiveShadow = this.receiveShadow),
              (t.frustumCulled = this.frustumCulled),
              t
            );
          },
        },
        {
          key: 'updateGeometry',
          value: function () {
            this.clearBatches();
            var e = this.clipper,
              n = this.vertices,
              r = null,
              i = null,
              o = this.skeleton.drawOrder,
              a = this.nextBatch();
            a.begin();
            for (var s = 0, l = this.zOffset, c = 0, u = o.length; c < u; c++) {
              var f = e.isClipping() ? 2 : this.vertexSize,
                d = o[c];
              if (d && d.bone && d.bone.active) {
                var h = d.getAttachment(),
                  p = void 0,
                  m = void 0,
                  v = 0;
                if (h instanceof We) {
                  var g = h;
                  ((p = g.color),
                    (n = this.vertices),
                    (v = 4 * f),
                    g.computeWorldVertices(d, n, 0, f),
                    (r = t.QUAD_TRIANGLES),
                    (i = g.uvs),
                    (m = g.region.texture));
                } else {
                  if (!(h instanceof Qe)) {
                    if (h instanceof Le) {
                      var y = h;
                      e.clipStart(d, y);
                      continue;
                    }
                    e.clipEndWithSlot(d);
                    continue;
                  }
                  var A = h;
                  ((p = A.color),
                    (n = this.vertices),
                    (v = (A.worldVerticesLength >> 1) * f) > n.length &&
                      (n = this.vertices = b.newFloatArray(v)),
                    A.computeWorldVertices(
                      d,
                      0,
                      A.worldVerticesLength,
                      n,
                      0,
                      f,
                    ),
                    (r = A.triangles),
                    (i = A.uvs),
                    (m = A.region.texture));
                }
                if (null != m) {
                  var w = d.bone.skeleton.color,
                    _ = d.color,
                    x = w.a * _.a * p.a,
                    k = this.tempColor,
                    S = this.tempColor2;
                  (k.set(w.r * _.r * p.r, w.g * _.g * p.g, w.b * _.b * p.b, x),
                    this.twoColorTint &&
                      (d.darkColor
                        ? S.setFromColor(d.darkColor)
                        : S.set(0, 0, 0, 1)));
                  var E = void 0,
                    C = void 0,
                    T = void 0,
                    I = void 0;
                  if (e.isClipping()) {
                    e.clipTriangles(
                      n,
                      v,
                      r,
                      r.length,
                      i,
                      k,
                      S,
                      this.twoColorTint,
                    );
                    var M = e.clippedVertices,
                      O = e.clippedTriangles;
                    ((E = M), (C = M.length), (T = O), (I = O.length));
                  } else {
                    for (var B = n, P = 2, L = 0, R = v; P < R; P += f, L += 2)
                      ((B[P] = k.r),
                        (B[P + 1] = k.g),
                        (B[P + 2] = k.b),
                        (B[P + 3] = k.a),
                        (B[P + 4] = i[L]),
                        (B[P + 5] = i[L + 1]),
                        this.twoColorTint &&
                          ((B[P + 6] = S.r),
                          (B[P + 7] = S.g),
                          (B[P + 8] = S.b),
                          (B[P + 9] = S.a)));
                    ((E = n), (C = v), (T = r), (I = r.length));
                  }
                  if (0 == C || 0 == I) {
                    e.clipEndWithSlot(d);
                    continue;
                  }
                  a.canBatch(C / this.vertexSize, I) ||
                    (a.end(), (a = this.nextBatch()).begin());
                  var D = d.data.blendMode,
                    F = m.texture,
                    j = a.findMaterialGroup(F, D);
                  (a.addMaterialGroup(I, j), a.batch(E, C, T, I, s), (s += l));
                }
                e.clipEndWithSlot(d);
              } else e.clipEndWithSlot(d);
            }
            (e.clipEnd(), a.end());
          },
        },
      ]),
      t
    );
  })(s.Object3D);
((zn.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0]),
  (zn.VERTEX_SIZE = 8),
  (zn.TWO_COLOR_VERTEX_SIZE = 12),
  (defaultExport = i({}, An, {
    threejs: { SkeletonMesh: zn, ThreeJsTexture: bn },
  })));
export { defaultExport as default };
