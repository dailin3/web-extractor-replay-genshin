// Extracted rendering module: browser. See ../PROVENANCE.md.
import { browserDetectorLibrary as dependency_browser_detector } from '../vendor/libraries.js';
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
  o = (r = dependency_browser_detector) && r.__esModule ? r : { default: r },
  a = null,
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
          key: 'getInstance',
          value: function () {
            return (a || (a = new o.default()), a);
          },
        },
      ]),
      e
    );
  })();
defaultExport = s;
export { defaultExport as default };
