// Extracted rendering module: mouse. See ../PROVENANCE.md.
import * as dependency_hit_test from './hit-test.js';
import * as dependency_mouse_proxy from './mouse-proxy.js';
import * as dependency_mouse_controller from './mouse-controller.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = dependency_hit_test,
  i = dependency_mouse_controller,
  o = dependency_mouse_proxy;
function a(e) {
  return e && e.__esModule ? e : { default: e };
}
defaultExport = {
  MouseUtil: r.default,
  MouseController: i.default,
  MouseProcess: o.default,
};
export { defaultExport as default };
