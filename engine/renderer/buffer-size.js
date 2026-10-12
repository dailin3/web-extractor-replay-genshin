// Extracted rendering module: buffer-size. See ../PROVENANCE.md.

export const __esModule = true;
let resizeBuffer;
('use strict');
(void 0,
  (resizeBuffer = function (e, t) {
    t &&
      e &&
      (t.height !== e.height || t.width !== e.width) &&
      t.setSize(e.width, e.height);
  }));
export { resizeBuffer };
