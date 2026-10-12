// Extracted rendering module: hit-test. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
export const __esModule = true;
let defaultExport;
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
  })(),
  o = dependency_three,
  a = new o.Raycaster(),
  s = (function () {
    function e() {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e);
    }
    return (
      i(e, null, [
        {
          key: 'sceneHitTest',
          value: function (e, t, n, i, o, s) {
            if (t) {
              a.setFromCamera(e, n);
              for (
                var l = [],
                  c = t.filter(function (e) {
                    return (
                      e.userData.isMouseOver &&
                      e.userData.mouseEnabled &&
                      e.userData.onRollOut &&
                      'onMouseMove' === i
                    );
                  }),
                  u = function (e) {
                    var n = t[e];
                    if (
                      n.userData.mouseEnabled &&
                      n.userData[i] &&
                      (n.visible || n.updateMatrixWorld(),
                      (l.length = 0),
                      n.raycast(a, l),
                      l.length > 0 &&
                        ('onMouseMove' === i &&
                          (c.forEach(function (e) {
                            n !== e &&
                              e.userData.isMouseOver &&
                              (e.userData.onRollOut(),
                              e.userData.buttonMode &&
                                (o.style.cursor = 'default'),
                              (e.userData.isMouseOver = !1));
                          }),
                          (c.length = 0),
                          n.userData.onRollOver &&
                            !n.userData.isMouseOver &&
                            (n.userData.onRollOver(),
                            n.userData.buttonMode &&
                              (o.style.cursor = 'pointer'),
                            (n.userData.isMouseOver = !0))),
                        !n.userData[i](s, l[0])))
                    )
                      return { v: void 0 };
                  },
                  f = t.length - 1;
                f > -1;
                f--
              ) {
                var d = u(f);
                if ('object' === (void 0 === d ? 'undefined' : r(d)))
                  return d.v;
              }
              c.length > 0 &&
                c.forEach(function (e) {
                  e.userData.mouseEnabled &&
                    e.userData.isMouseOver &&
                    (e.userData.onRollOut && e.userData.onRollOut(),
                    (o.style.cursor = 'default'),
                    (e.userData.isMouseOver = !1));
                });
            }
          },
        },
        {
          key: 'proxyHitTest',
          value: function (t, n, r, i, a, s) {
            var l = new o.Vector2(2 * (t.uv.x - 0.5), 2 * (t.uv.y - 0.5));
            e.sceneHitTest(l, n, r, i, a, s);
          },
        },
        {
          key: 'hashUUID',
          value: function (e, t) {
            return (e.uuid || '') + (t.uuid || '');
          },
        },
        {
          key: 'getClick',
          value: function (e) {
            return e ? (e.clicks ? e.clicks : Array.isArray(e) ? e : [e]) : [];
          },
        },
        {
          key: 'getMouseXYByRect',
          value: function (e, t) {
            var n = e.target.getBoundingClientRect();
            return {
              offsetX: (t ? e.touches[0].clientX : e.clientX) - n.left,
              offsetY: (t ? e.touches[0].clientY : e.clientY) - n.top,
              width: n.width,
              height: n.height,
            };
          },
        },
      ]),
      e
    );
  })();
defaultExport = s;
export { defaultExport as default };
