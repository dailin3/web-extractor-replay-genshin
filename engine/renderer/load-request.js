// Extracted rendering module: load-request. See ../PROVENANCE.md.
import * as dependency_xhr from './xhr.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r,
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
  o = (r = dependency_xhr) && r.__esModule ? r : { default: r };
function a(e) {
  if (Array.isArray(e)) {
    for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
    return n;
  }
  return Array.from(e);
}
function s(e, t, n, r, i, a) {
  (0, o.default)({
    method: 'get',
    baseURL: window.location.origin,
    url: e,
    responseType: t,
    onDownloadProgress: function (e, t, r) {
      t && n(!0, r);
    },
  })
    .then(function (e) {
      (e.lengthComputable || n(e.lengthComputable), r(e.data));
    })
    .catch(function (t) {
      (a(e, t), i({ url: e, reason: t }), n());
    });
}
function l(e, t, n, r, i, o) {
  var a = document.createElement('div');
  a.style.visibility = 'hidden';
  var s = document.createElement('iframe');
  ((s.src = e),
    (s.width = 0),
    (s.height = 0),
    (s.onload = function () {
      (n(), r(), document.body.removeChild(a));
    }),
    (s.error = function (t) {
      (n(), o(e, t), i({ url: e, reason: t }), document.body.removeChild(a));
    }),
    document.body.appendChild(a),
    a.appendChild(s));
}
var c = {
    IMAGE: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
    VIDEO: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
    SOUND: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
    CSS: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
    JS: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
    JSON: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
    TXT: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
    XML: {
      method: function (e) {
        for (
          var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        e.crossDomain ? l.apply(void 0, n) : s.apply(void 0, n);
      },
    },
  },
  u = (function () {
    function e(t) {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e);
      var n = t.list,
        r = void 0 === n ? [] : n,
        i = t.minTime,
        o = void 0 === i ? 0 : i,
        s = t.maxTime,
        l = void 0 !== s && s,
        c = t.defineTime,
        u = void 0 !== c && c,
        f = t.onprogress,
        d = void 0 === f ? function () {} : f,
        h = t.onload,
        p = void 0 === h ? function () {} : h,
        m = t.json,
        v = void 0 === m ? {} : m,
        g = t.onerror,
        y = void 0 === g ? function () {} : g;
      ((this.list = [].concat(
        a(r),
        a(
          (function (e) {
            return (function e(t) {
              return t.reduce(function (t, n) {
                return Array.isArray(n) ? t.concat(e(n)) : t.concat(n);
              }, []);
            })(
              Object.keys(e).map(function (t) {
                return Object.keys(e[t]).map(function (n) {
                  return e[t][n];
                });
              }),
            ).map(function (e) {
              return { url: e };
            });
          })(v),
        ),
      )),
        (this.minTime = o),
        (this.onprogress = d),
        (this.onload = p),
        (this.count = 0),
        (this.progress = 0),
        (this.canLoad = !1),
        (this.max = this.list.length),
        (this.hasLoad = !1),
        (this.defineTime = u),
        (this.maxTime = l),
        (this.onerror = y),
        (this.globalErrList = []),
        (this.timeslice = Number(Math.ceil(100 / this.list.length).toFixed(0))),
        (this.loadCb = this.loadCb.bind(this)),
        (this.init = this.init.bind(this)),
        (this.final = this.final.bind(this)));
    }
    return (
      i(e, [
        {
          key: 'init',
          value: function () {
            var e = this;
            (this.onprogress(0),
              this.defineTime
                ? (function t() {
                    e.progress < 100
                      ? setTimeout(function () {
                          e.hasLoad ||
                            (e.onprogress(
                              e.progress,
                              Math.round(e.defineTime / 100) * e.progress,
                            ),
                            (e.progress += 1),
                            t());
                        }, e.defineTime / 100)
                      : 100 === e.progress &&
                        (e.onprogress(e.progress, e.defineTime),
                        e.onload(),
                        e.globalErrList.length > 0 &&
                          e.onerror(e.globalErrList));
                  })()
                : (setTimeout(function () {
                    ((e.canLoad = !0), e.final());
                  }, this.minTime),
                  this.list.forEach(function (t, n) {
                    (function (e) {
                      switch (
                        e.substring(e.lastIndexOf('.') + 1).toLowerCase()
                      ) {
                        case 'jpeg':
                        case 'jpg':
                        case 'gif':
                        case 'png':
                        case 'webp':
                        case 'bmp':
                          return c.IMAGE;
                        case 'ogg':
                        case 'mp3':
                        case 'wav':
                        case 'aac':
                          return c.SOUND;
                        case 'mp4':
                        case 'webm':
                        case 'ts':
                          return c.VIDEO;
                        case 'json':
                          return c.JSON;
                        case 'xml':
                          return c.XML;
                        case 'css':
                          return c.CSS;
                        case 'js':
                          return c.JS;
                        default:
                          return c.TXT;
                      }
                    })(t.url).method(
                      { crossDomain: t.crossDomain || !1 },
                      t.url,
                      t.responseType,
                      e.loadCb,
                      function (e) {
                        t.load && t.load(e, n);
                      },
                      function (t) {
                        e.globalErrList.push(t);
                      },
                      function (e, r) {
                        t.error && t.error(e, n, r);
                      },
                    );
                  })),
              this.maxTime &&
                setTimeout(function () {
                  e.progress < 100 &&
                    !e.hasLoad &&
                    (e.onprogress(100, 15e3),
                    e.onload(),
                    e.globalErrList.length > 0 && e.onerror(e.globalErrList),
                    (e.hasLoad = !0));
                }, this.maxTime));
          },
        },
        {
          key: 'loadCb',
          value: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
              t = arguments[1];
            (this.hasLoad ||
              ((this.progress += e ? t * this.timeslice : this.timeslice),
              (this.progress = this.progress > 100 ? 100 : this.progress),
              this.onprogress &&
                this.progress <= 99 &&
                this.onprogress(Number(this.progress.toFixed(0)))),
              this.final());
          },
        },
        {
          key: 'final',
          value: function () {
            this.progress > 99 &&
              this.canLoad &&
              !this.hasLoad &&
              ((this.progress = 100),
              this.onprogress && this.onprogress(this.progress),
              this.onload &&
                (this.onload(),
                this.globalErrList.length > 0 &&
                  this.onerror(this.globalErrList),
                (this.hasLoad = !0)));
          },
        },
      ]),
      e
    );
  })();
defaultExport = u;
export { defaultExport as default };
