// Extracted rendering module: style-parser. See ../PROVENANCE.md.
import * as dependency_style_values from './style-values.js';
export const __esModule = true;
let defaultExport;
('use strict');
(void 0,
  (defaultExport = function (e, t) {
    var n = {};
    return (
      Object.keys(e).forEach(function (r) {
        if (void 0 !== e[r]) {
          var o = r.toLowerCase();
          if (t.hasOwnProperty(o)) {
            var a = t[o],
              s = (0, i.default)(a, e[r]);
            void 0 !== s && (n[a] = s);
          }
        }
      }),
      n
    );
  }));
var r,
  i = (r = dependency_style_values) && r.__esModule ? r : { default: r };
export { defaultExport as default };
