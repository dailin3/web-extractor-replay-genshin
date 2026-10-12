// Extracted rendering module: step-block. See ../PROVENANCE.md.

export const __esModule = true;
let defaultExport;
('use strict');
(void 0,
  (defaultExport = function e(t) {
    !(function (e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    })(this, e);
    var n = t || {},
      r = n.start,
      i = void 0 === r ? 0 : r,
      o = n.end,
      a = void 0 === o ? 1 : o;
    ((this.start = i), (this.end = a), (this.duration = a - i));
  }));
export { defaultExport as default };
