// Extracted rendering module: text-parser. See ../PROVENANCE.md.
import * as dependency_text_node_types from './text-node-types.js';
import * as dependency_html_entities from './html-entities.js';
export const __esModule = true;
let defaultExport;
('use strict');
(void 0,
  (defaultExport = function (e) {
    return c(e, a)
      .map(function (e) {
        return e[0];
      })
      .reduce(function (e, t) {
        if ('<' === t.charAt(0)) {
          var n = t.match(s);
          if (!n) return e;
          var o = (function (e, t) {
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
            })(n, 3),
            a = o[1],
            u = o[2];
          if ('/' === a.charAt(0))
            return (
              e.push({
                type: i.default.CloseTag,
                tag: a.substr(1).toLowerCase(),
              }),
              e
            );
          var f = Array.from(c(u, l)).reduce(function (e, t) {
            return ((e[t[1]] = t[2]), e);
          }, {});
          return (
            e.push({ type: i.default.OpenTag, tag: a.toLowerCase(), style: f }),
            '/' === t.charAt(t.length - 2) &&
              e.push({ type: i.default.CloseTag, tag: '' + a.toLowerCase() }),
            e
          );
        }
        var d = t.split(
            /(\s|[\u30a0-\u30ff\u3040-\u309f\u4e00-\u9fa5\uac00-\ud7af]+)/,
          ),
          h = [];
        return (
          d.forEach(function (e) {
            '' !== e &&
              (/([\uac00-\ud7ff\u4e00-\u9fa5]+)/.test(e)
                ? (h = h.concat(e.split('')))
                : /([\u0e00-\u0e7f]+)/.test(e)
                  ? (h = h.concat(
                      e
                        .split(/(\s|[\u0e00-\u0e7f]+[\u0e00-\u0e7f]+)/)
                        .map(function (e) {
                          return (function (e) {
                            if (/([\u0e00-\u0e7f]+)/.test(e)) {
                              for (
                                var t = [], n = 0, r = e.length;
                                n < r;
                                n++
                              ) {
                                var i = e.charAt(n);
                                /([^\u0e31\u0e33-\u0e39\u0e3a\u0e47-\u0e49\u0e4a-\u0e4e])/.test(
                                  i,
                                )
                                  ? t.push(i)
                                  : (t[t.length - 1] += i);
                              }
                              return t;
                            }
                            return e;
                          })(e);
                        })
                        .flat(),
                    ))
                  : h.push(e));
          }),
          h.forEach(function (t) {
            '' !== t &&
              e.push({ type: i.default.Text, text: (0, r.default)(t) });
          }),
          e
        );
      }, []);
  }));
var r = dependency_html_entities,
  i = dependency_text_node_types;
function o(e) {
  return e && e.__esModule ? e : { default: e };
}
var a = /(<.+?>|\n|[^\S\n]+|[^<\s]+)/g,
  s = /<(\/?[a-zA-Z0-9]+)(.*?)>/,
  l = /(\S+)="(.+?)"/g;
function c(e, t) {
  t.lastIndex = -1;
  var n = void 0,
    r = [];
  if (void 0 !== String.prototype.matchAll)
    for (var i = e.matchAll(t); !(n = i.next()).done;) r.push(n.value);
  else for (; (n = t.exec(e));) r.push(n);
  return r;
}
Array.prototype.flat ||
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: !0,
    value: function e() {
      var t = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
      return t
        ? Array.prototype.reduce.call(
            this,
            function (n, r) {
              return (
                Array.isArray(r)
                  ? n.push.apply(n, e.call(r, t - 1))
                  : n.push(r),
                n
              );
            },
            [],
          )
        : Array.prototype.slice.call(this);
    },
    writable: !0,
  });
export { defaultExport as default };
