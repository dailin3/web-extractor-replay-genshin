// Extracted rendering module: source-loader. See ../PROVENANCE.md.

export const __esModule = true;
let createSourceLoader, SourceLoad, sourceLoader;
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
  })();
function o(e) {
  return function () {
    var t = e.apply(this, arguments);
    return new Promise(function (e, n) {
      return (function r(i, o) {
        try {
          var a = t[i](o),
            s = a.value;
        } catch (e) {
          return void n(e);
        }
        if (!a.done)
          return Promise.resolve(s).then(
            function (e) {
              r('next', e);
            },
            function (e) {
              r('throw', e);
            },
          );
        e(s);
      })('next');
    });
  };
}
function a(e) {
  return 'string' == typeof e && 0 === e.indexOf('data:image');
}
function s(e) {
  var t = e.method,
    n = void 0 === t ? 'get' : t,
    r = e.url,
    i = void 0 === r ? '' : r,
    o = e.responseType,
    s = void 0 === o ? 'text' : o,
    l = e.timeout,
    c = void 0 === l ? 3e4 : l,
    u = e.need404Resolve,
    f = e.placeholder404,
    d = new XMLHttpRequest();
  return new Promise(
    d
      ? function (e, t) {
          a(i)
            ? e(i)
            : ((d.onprogress = function () {}),
              d.open(n, i),
              (d.responseType = s),
              (d.timeout = c),
              (d.ontimeout = t),
              (d.onreadystatechange = function () {
                4 === d.readyState &&
                  (200 === d.status
                    ? e(d)
                    : (404 !== d.status && 403 !== d.status) || !u
                      ? t(d.statusText)
                      : e({ type: 404, result: f }));
              }),
              d.send());
        }
      : function (e, t) {
          t(new Error('您的浏览器不支持XHR'));
        },
  );
}
createSourceLoader = function () {
  return new l();
};
var l = (SourceLoad = (function () {
  function e() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    !(function (e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    })(this, e);
    var n = t.manifestList,
      r = void 0 === n ? [] : n,
      i = t.loadProgressCallBack,
      o = void 0 === i ? function () {} : i,
      a = t.loadErrorCallBack,
      s = void 0 === a ? function () {} : a,
      l = t.loadCompleteCallBack,
      c = void 0 === l ? function () {} : l,
      u = t.sourcePool,
      f = void 0 === u ? {} : u;
    ((this.manifestList = r),
      (this.loadProgressCallBack = o),
      (this.loadErrorCallBack = s),
      (this.loadCompleteCallBack = c),
      (this.sourcePool = f),
      (this.result = {}),
      (this.count = 0));
  }
  return (
    i(e, [
      {
        key: 'load',
        value: function (e) {
          var t,
            n = this,
            r =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
          return e
            ? ((this.manifestList = e),
              (this.count = 0),
              0 === e.length
                ? (this.loadProgressCallBack(1),
                  Promise.resolve().then(function () {
                    n.loadCompleteCallBack();
                  }))
                : new Promise(
                    ((t = o(
                      regeneratorRuntime.mark(function e(t, i) {
                        var o, a, s, l;
                        return regeneratorRuntime.wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.next = 2),
                                    n.batch(n.manifestList, r)
                                  );
                                case 2:
                                  if (((o = e.sent), (a = []), !o.length)) {
                                    e.next = 14;
                                    break;
                                  }
                                  s = o.length - 1;
                                case 6:
                                  if (!(s > -1)) {
                                    e.next = 14;
                                    break;
                                  }
                                  return ((e.next = 9), n.batch([o.pop()], r));
                                case 9:
                                  (l = e.sent).length && a.push(l[0]);
                                case 11:
                                  (s--, (e.next = 6));
                                  break;
                                case 14:
                                  a.length
                                    ? (n.loadErrorCallBack(a), i(a))
                                    : t();
                                case 15:
                                case 'end':
                                  return e.stop();
                              }
                          },
                          e,
                          n,
                        );
                      }),
                    )),
                    function (e, n) {
                      return t.apply(this, arguments);
                    }),
                  ))
            : Promise.reject();
        },
      },
      {
        key: 'batch',
        value: function (e) {
          var t,
            n = this,
            i =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
          return new Promise(
            ((t = o(
              regeneratorRuntime.mark(function t(o) {
                var a, l, c, u, f, d, h;
                return regeneratorRuntime.wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (a = i.timeout),
                            (l = void 0 === a ? 3e4 : a),
                            (c = i.need404Resolve),
                            (u = void 0 !== c && c),
                            (f = i.placeholder404),
                            (d =
                              void 0 === f
                                ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjuHxk7X8AB/YDRBwwtOgAAAAASUVORK5CYII='
                                : f),
                            (h = []),
                            (t.next = 4),
                            Promise.all(
                              e.map(function (e) {
                                return new Promise(function (t) {
                                  var i = e.type,
                                    o = void 0 === i ? 'image' : i,
                                    a = e.src,
                                    c = void 0 === a ? '' : a,
                                    f = e.id,
                                    p = n.getSourceResponseType(o);
                                  s({
                                    url: c,
                                    timeout: l,
                                    responseType: p,
                                    need404Resolve: u,
                                    placeholder404: d,
                                  })
                                    .then(function (i) {
                                      n.resourceCompile(i, e).then(
                                        function (i) {
                                          ((n.result[f] = r({}, e, {
                                            result: i,
                                          })),
                                            (n.sourcePool[f] = n.result[f]),
                                            n.checkComplete(),
                                            t());
                                        },
                                      );
                                    })
                                    .catch(function () {
                                      (h.push(e), t());
                                    });
                                });
                              }),
                            )
                          );
                        case 4:
                          o(h);
                        case 5:
                        case 'end':
                          return t.stop();
                      }
                  },
                  t,
                  n,
                );
              }),
            )),
            function (e) {
              return t.apply(this, arguments);
            }),
          );
        },
      },
      {
        key: 'checkComplete',
        value: function () {
          this.count += 1;
          var e = this.count / this.manifestList.length;
          (this.loadProgressCallBack(e),
            this.count === this.manifestList.length &&
              this.loadCompleteCallBack());
        },
      },
      {
        key: 'getResult',
        value: function (e) {
          return this.result[e] ? this.result[e].result : null;
        },
      },
      {
        key: 'getSourceResponseType',
        value: function (e) {
          var t = void 0;
          switch (e) {
            case 'video':
            case 'image':
              t = 'blob';
              break;
            case 'audio':
              t = 'arraybuffer';
              break;
            default:
              t = e;
          }
          return t;
        },
      },
      {
        key: 'resourceCompile',
        value: function (e, t) {
          var n = this,
            r = t.type,
            i = t.src,
            o = t.id;
          return new Promise(function (t, s) {
            if (404 === e.type) {
              var l = new Image();
              return (
                (l.onload = function () {
                  t(l);
                }),
                void (l.src = e.result)
              );
            }
            try {
              if ('image' === r) {
                var c = new Image();
                ((c.onload = function () {
                  t(c);
                }),
                  (c.src = a(i) ? i : window.URL.createObjectURL(e.response)));
              } else t(e.response);
            } catch (e) {
              (n.loadErrorCallBack(new Error('source ' + o + ' ' + e.message)),
                s(e));
            }
          });
        },
      },
      {
        key: 'setEventListener',
        value: function (e, t) {
          switch (e) {
            case 'error':
              this.loadErrorCallBack = t;
              break;
            case 'progress':
              this.loadProgressCallBack = t;
              break;
            case 'complete':
              this.loadCompleteCallBack = t;
          }
        },
      },
      {
        key: 'removeEventListener',
        value: function (e) {
          switch (e) {
            case 'error':
              this.loadErrorCallBack = function () {};
              break;
            case 'progress':
              this.loadProgressCallBack = function () {};
              break;
            case 'complete':
              this.loadCompleteCallBack = function () {};
          }
        },
      },
      {
        key: 'clearAllListener',
        value: function () {
          ((this.loadErrorCallBack = function () {}),
            (this.loadProgressCallBack = function () {}),
            (this.loadCompleteCallBack = function () {}));
        },
      },
    ]),
    e
  );
})());
sourceLoader = new l();
export { createSourceLoader, SourceLoad, sourceLoader };
