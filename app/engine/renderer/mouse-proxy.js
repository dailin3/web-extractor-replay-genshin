// Extracted rendering module: mouse-proxy. See ../PROVENANCE.md.
import * as dependency_hit_test from './hit-test.js';
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
  o = (r = dependency_hit_test) && r.__esModule ? r : { default: r },
  a = (function () {
    function e(t, n, r) {
      (!(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e),
        (this.domElement = t),
        (this.uuid = o.default.hashUUID(n, r)),
        (this.clicks = o.default.getClick(n)),
        (this.camera = r),
        (this.isMouseEnabled = !0));
    }
    return (
      i(e, [
        {
          key: 'next',
          get: function () {
            return this._next;
          },
        },
        {
          key: 'valid',
          get: function () {
            return Boolean(
              this.mouseEnabled &&
              this.clicks &&
              this.clicks.length &&
              this.camera,
            );
          },
        },
        {
          key: 'mouseEnabled',
          set: function (e) {
            ((this.isMouseEnabled = e),
              !e &&
                this.domElement &&
                'pointer' === this.domElement.style.cursor &&
                (this.domElement.style.cursor = 'default'));
          },
          get: function () {
            return this.isMouseEnabled;
          },
        },
      ]),
      i(e, [
        {
          key: 'dispose',
          value: function () {
            ((this.mouseEnabled = !1),
              (this.domElement = null),
              (this.clicks = null),
              (this.camera = null));
          },
        },
        {
          key: 'checkSceneClick',
          value: function (e, t, n) {
            this.mouseEnabled &&
              o.default.sceneHitTest(
                e,
                this.clicks,
                this.camera,
                t,
                this.domElement,
                n,
              );
          },
        },
        {
          key: 'proxy',
          value: function (t, n) {
            var r = new e(this.domElement, t, n);
            return (
              (this._next = r),
              this._createProxyCallback(this.domElement, this.clicks[0], r),
              r
            );
          },
        },
        {
          key: '_createProxyCallback',
          value: function (e, t, n) {
            var r = n.clicks,
              i = n.camera;
            ((t.userData.onClick = function (t, n) {
              o.default.proxyHitTest(n, r, i, 'onClick', e, t);
            }),
              (t.userData.onMouseDown = function (t, n) {
                o.default.proxyHitTest(n, r, i, 'onMouseDown', e, t);
              }),
              (t.userData.onMouseUp = function (t, n) {
                o.default.proxyHitTest(n, r, i, 'onMouseUp', e, t);
              }),
              (t.userData.onMouseMove = function (t, n) {
                o.default.proxyHitTest(n, r, i, 'onMouseMove', e, t);
              }),
              (t.userData.onMouseWheel = function (t, n) {
                o.default.proxyHitTest(n, r, i, 'onMouseWheel', e, t);
              }),
              (t.userData.mouseEnabled = !0));
          },
        },
      ]),
      e
    );
  })();
defaultExport = a;
export { defaultExport as default };
