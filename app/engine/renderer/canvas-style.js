// Extracted rendering module: canvas-style. See ../PROVENANCE.md.

export const __esModule = true;
let configureCanvas;
('use strict');
(void 0,
  (configureCanvas = function (e, t) {
    ((t.font =
      e.fontStyle +
      ' ' +
      e.fontVariant +
      ' ' +
      e.fontWeight +
      ' ' +
      e.fontStretch +
      ' ' +
      e.fontSize +
      'px ' +
      e.fontFamily),
      (t.textBaseline = 'alphabetic'),
      (t.fillStyle = e.color),
      (t.lineWidth = e.strokeWidth),
      (t.strokeStyle = e.strokeColor));
  }));
export { configureCanvas };
