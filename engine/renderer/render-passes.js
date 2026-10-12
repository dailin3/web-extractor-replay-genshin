// Extracted rendering module: render-passes. See ../PROVENANCE.md.
import * as dependency_blur_pass from './blur-pass.js';
import * as dependency_copy_pass from './copy-pass.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = dependency_blur_pass,
  i = dependency_copy_pass;
function o(e) {
  return e && e.__esModule ? e : { default: e };
}
defaultExport = { blurPass: new r.default(), copyPass: new i.default() };
export { defaultExport as default };
