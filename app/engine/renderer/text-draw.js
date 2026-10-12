// Extracted rendering module: text-draw. See ../PROVENANCE.md.
import * as dependency_canvas_style from './canvas-style.js';
export const __esModule = true;
let defaultExport;
('use strict');
(void 0,
  (defaultExport = function (e, t, n, i, o) {
    e.vertices.forEach(function (e) {
      !(function (e, t, n, i, o) {
        ((0, r.configureCanvas)(e.style, t),
          o
            ? e.style.strokeWidth &&
              t.strokeText(
                e.text,
                e.x + n + e.drawOffsetX,
                e.y + i + e.drawOffsetY,
              )
            : t.fillText(
                e.text,
                e.x + n + e.drawOffsetX,
                e.y + i + e.drawOffsetY,
              ));
      })(e, t, n, i, o);
    });
  }));
var r = dependency_canvas_style;
export { defaultExport as default };
