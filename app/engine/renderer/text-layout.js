// Extracted rendering module: text-layout. See ../PROVENANCE.md.
import * as dependency_text_measure from './text-measure.js';
export const __esModule = true;
let defaultExport;
('use strict');
(void 0,
  (defaultExport = function (e) {
    var t = [];
    if (
      ((function e(t, n, r) {
        return t.children.reduce(function (n, a) {
          return a.hasOwnProperty('children')
            ? e(a, n, r)
            : (function (e, t, n, r) {
                var a = { height: 0, width: 0, maxAscent: 0, vertices: [] },
                  s = [a],
                  l = { x: 0, y: n },
                  c = !0,
                  u = 0,
                  f = new Map(),
                  d = !0,
                  h = !1,
                  p = void 0;
                try {
                  for (
                    var m, v = e.words[Symbol.iterator]();
                    !(d = (m = v.next()).done);
                    d = !0
                  ) {
                    var g = m.value,
                      y = '\n' === g.text.charAt(0);
                    if (o(g) || (y && 'space' === t.newLine))
                      'collapse-all' === t.whiteSpace
                        ? (u = c ? 0 : t.spaceWidth)
                        : 'collapse-outer' === t.whiteSpace
                          ? c
                            ? (u = 0)
                            : (u += t.spaceWidth * g.text.length)
                          : (u += g.text.length * t.spaceWidth);
                    else if (y) {
                      if ('ignore' === t.newLine) continue;
                      ((l.x = 0),
                        (l.y += a.height + t.lineSpacing),
                        (a = {
                          height: 0,
                          width: 0,
                          maxAscent: 0,
                          vertices: [],
                        }),
                        s.push(a));
                    } else {
                      var A = (0, i.default)(g),
                        b = l.x + u,
                        w = l.y;
                      b + A.width > t.width
                        ? ((c = !0),
                          (b = 0),
                          (u = 0),
                          (w += a.height + t.lineSpacing),
                          (l.x = A.width),
                          (l.y = w),
                          (a = {
                            height: 0,
                            width: 0,
                            maxAscent: 0,
                            vertices: [],
                          }),
                          s.push(a))
                        : (l.x = b + A.width);
                      var _ = A.maxAscent - A.ascent,
                        x = 'static' === t.lineHeight ? A.maxAscent : A.ascent,
                        k = {
                          type: 'word',
                          x: b,
                          y: w + ('static' === t.lineHeight ? _ : 0),
                          drawOffsetX: A.xOffset,
                          drawOffsetY: A.yOffset,
                          width: A.width,
                          height: A.height,
                          style: g.style,
                          text: g.text,
                        };
                      (f.set(k, x),
                        a.vertices.push(k),
                        (a.width += u + k.width),
                        (a.maxAscent = Math.max(a.maxAscent, x)),
                        'static' === t.lineHeight
                          ? (a.height = Math.max(a.height, A.lineHeight))
                          : (a.height = Math.max(a.height, A.height)),
                        r.push(k),
                        (u = 0),
                        (c = !1));
                    }
                  }
                } catch (e) {
                  ((h = !0), (p = e));
                } finally {
                  try {
                    !d && v.return && v.return();
                  } finally {
                    if (h) throw p;
                  }
                }
                return (
                  s.forEach(function (e) {
                    e.vertices.forEach(function (t) {
                      t.y += e.maxAscent - f.get(t);
                    });
                  }),
                  (function (e, t) {
                    e.forEach(function (e) {
                      if (0 !== e.vertices.length) {
                        var n = t.width - e.width;
                        switch (t.textAlign) {
                          case 'left':
                            break;
                          case 'center':
                            var r = Math.floor(n / 2);
                            e.vertices.forEach(function (e) {
                              e.x += r;
                            });
                            break;
                          case 'right':
                            e.vertices.forEach(function (e) {
                              e.x += n;
                            });
                            break;
                          case 'justify':
                            if (
                              e.vertices.length > 1 &&
                              e.width > 0.5 * t.width
                            ) {
                              var i = e.vertices.reduce(function (e, t) {
                                  return e + t.width;
                                }, 0),
                                o = e.vertices[0];
                              e.vertices[e.vertices.length - 1].x += n;
                              for (
                                var a = (t.width - i) / (e.vertices.length - 1),
                                  s = o.width,
                                  l = 1,
                                  c = e.vertices.length - 1;
                                l < c;
                                l++
                              )
                                ((e.vertices[l].x = s + a),
                                  (s = e.vertices[l].x + e.vertices[l].width));
                            }
                        }
                        if ('middle' === t.verticalAlign) {
                          var u = e.vertices.sort(function (e, t) {
                            return t.height - e.height;
                          })[0].height;
                          e.vertices.forEach(function (e) {
                            e.y -=
                              ((u - e.height) * (e.drawOffsetY / e.height)) / 2;
                          });
                        }
                      }
                    });
                  })(s, t),
                  l.y + a.height + t.lineSpacing
                );
              })(a, t.style, n, r);
        }, n);
      })(e, 0, t),
      0 === t.length)
    )
      return { x: 0, y: 0, width: 0, height: 0, vertices: [] };
    var n = t.reduce(function (e, t) {
        return Math.min(e, t.x);
      }, Number.MAX_SAFE_INTEGER),
      r = t.reduce(function (e, t) {
        return Math.min(e, t.y);
      }, Number.MAX_SAFE_INTEGER),
      a =
        t.reduce(function (e, t) {
          return Math.max(e, t.width + t.x);
        }, 0) - n,
      s =
        t.reduce(function (e, t) {
          return Math.max(e, t.height + t.y);
        }, 0) - r;
    return { x: n, y: r, width: a, height: s, vertices: t };
  }));
var r,
  i = (r = dependency_text_measure) && r.__esModule ? r : { default: r };
function o(e) {
  var t = e.text.charAt(0);
  return ' ' === t || '\t' === t || '\v' === t || '\f' === t;
}
export { defaultExport as default };
