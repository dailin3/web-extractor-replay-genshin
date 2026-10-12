// Extracted rendering module: spine-utils. See ../PROVENANCE.md.

export const __esModule = true;
let throttle, isAvailable, fromEntries;
('use strict');
void 0;
var r =
  'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
    ? function (e) {
        return typeof e;
      }
    : function (e) {
        return e &&
          'function' == typeof Symbol &&
          e.constructor === Symbol &&
          e !== Symbol.prototype
          ? 'symbol'
          : typeof e;
      };
((throttle = function (e, t) {
  var n = !1,
    r = void 0,
    i = void 0;
  return function o() {
    for (var a = arguments.length, s = Array(a), l = 0; l < a; l++)
      s[l] = arguments[l];
    if (n) return ((r = s), void (i = this));
    ((n = !0),
      e.apply(this, s),
      setTimeout(function () {
        ((n = !1), r && (o.apply(i, r), (r = null), (i = null)));
      }, t));
  };
}),
  (isAvailable = function (e) {
    var t = void 0 === e ? 'undefined' : r(e);
    return (
      'undefined' !== t &&
      ('number' === t || 'bigint' === t
        ? !Number.isNaN(e)
        : 'string' === t
          ? 0 !== e.length
          : 'boolean' === t ||
            'function' === t ||
            'symbol' === t ||
            ('object' === t
              ? null !== e &&
                (e instanceof Array
                  ? 0 !== e.length
                  : e instanceof Map || e instanceof Set
                    ? 0 !== e.size
                    : e instanceof HTMLElement || 0 !== Object.keys(e).length)
              : void 0))
    );
  }),
  (fromEntries = function (e) {
    return []
      .concat(
        (function (e) {
          if (Array.isArray(e)) {
            for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
            return n;
          }
          return Array.from(e);
        })(e),
      )
      .reduce(function (e, t) {
        var n = (function (e, t) {
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
            throw new TypeError(
              'Invalid attempt to destructure non-iterable instance',
            );
          })(t, 2),
          r = n[0],
          i = n[1];
        return ((e[r] = i), e);
      }, {});
  }));
export { throttle, isAvailable, fromEntries };
