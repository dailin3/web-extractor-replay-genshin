// Extracted rendering module: resource-loader. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_load_request from './load-request.js';
export const __esModule = true;
let loader, createLoader;
('use strict');
(void 0, (loader = void 0));
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
})();
createLoader = function () {
  return new c();
};
var i,
  o = dependency_three,
  a = (i = dependency_load_request) && i.__esModule ? i : { default: i };
function s(e, t) {
  if (!(e instanceof t))
    throw new TypeError('Cannot call a class as a function');
}
var l = (function () {
    function e(t, n) {
      s(this, e);
      var r = t || {},
        i = r.src,
        o = void 0 === i ? '' : i,
        a = r.type,
        l = void 0 === a ? '' : a,
        c = r.id,
        u = void 0 === c ? Math.random() : c,
        f = r.config,
        d = void 0 === f ? null : f;
      switch (
        ((this.url = o),
        (this.id = u),
        (this.mediaType = this.isBase64 ? 'base64' : l),
        (this.config = d),
        l)
      ) {
        case 'video':
        case 'image':
          this.responseType = 'blob';
          break;
        case 'audio':
          this.responseType = 'arraybuffer';
          break;
        default:
          this.responseType = l;
      }
      ((this.result = null),
        (this.loader = n),
        'base64' === this.mediaType && this.load(this.url));
    }
    return (
      r(e, [
        {
          key: 'checkComplete',
          value: function () {
            (this.loader.onFileComplete(this),
              (this.loader.counter += 1),
              this.loader.counter === Object.keys(this.loader.list).length &&
                this.loader.onLoadComplete());
          },
        },
        {
          key: 'load',
          value: function (e) {
            switch (this.mediaType) {
              case 'base64':
                ((this.result = new Image()),
                  (this.result.onload = this.checkComplete.bind(this)),
                  (this.result.src = e));
                break;
              case 'video':
                ((this.result = window.URL.createObjectURL(e)),
                  this.checkComplete());
                break;
              case 'image':
              case 'blob':
                ((this.result = new Image()),
                  (this.result.onload = this.checkComplete.bind(this)),
                  (this.result.src = window.URL.createObjectURL(e)));
                break;
              default:
                ((this.result = e), this.checkComplete());
            }
          },
        },
        {
          key: 'isBase64',
          get: function () {
            return 0 === this.url.indexOf('data:image');
          },
        },
      ]),
      e
    );
  })(),
  c = (function (e) {
    function t() {
      s(this, t);
      var e = (function (e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
      })(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
      return ((e.loaded = !0), (e.list = {}), (e.counter = 0), e);
    }
    return (
      (function (e, t) {
        if ('function' != typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof t,
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
      r(t, [
        {
          key: 'removeAll',
          value: function () {
            ((this.counter = 0), (this.list = {}));
          },
        },
        {
          key: 'getItems',
          value: function () {
            var e = this;
            return Object.keys(
              this.list.map(function (t) {
                return e.list[t];
              }),
            );
          },
        },
        {
          key: 'getResult',
          value: function (e) {
            return this.list[e] ? this.list[e].result : null;
          },
        },
        {
          key: 'onLoadProgress',
          value: function (e) {
            this.dispatchEvent({ type: 'progress', progress: e });
          },
        },
        {
          key: 'onLoadComplete',
          value: function () {
            ((this.loaded = !0), this.dispatchEvent({ type: 'complete' }));
          },
        },
        {
          key: 'onLoadError',
          value: function (e) {
            this.dispatchEvent({ type: 'error', data: e });
          },
        },
        {
          key: 'onFileComplete',
          value: function (e) {
            this.dispatchEvent({ type: 'fileComplete', data: e });
          },
        },
        {
          key: 'loadManifest',
          value: function (e) {
            var t = this;
            if (e.length > 0) {
              var n = [];
              (e.forEach(function (e) {
                if (!e.src) throw new Error('图片不存在，请仔细核对' + e.id);
                if (t.list[e.id]) console.warn('duplicate item:', e.id);
                else {
                  var r = new l(e, t);
                  ((t.list[e.id] = r),
                    r.isBase64 || n.push(r),
                    (t.loaded = !1));
                }
              }),
                n.length > 0
                  ? new a.default({
                      minTime: 10,
                      onprogress: this.onLoadProgress.bind(this),
                      onerror: this.onLoadError.bind(this),
                      list: n,
                    }).init()
                  : this.loaded && this.onLoadComplete());
            } else this.loaded && this.onLoadComplete();
          },
        },
      ]),
      t
    );
  })(o.EventDispatcher);
loader = new c();
export { loader, createLoader };
