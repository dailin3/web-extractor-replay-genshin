// Extracted rendering module: camera. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
export const __esModule = true;
let cameraAdaptScreen, getCamera, layoutToPosition;
('use strict');
(void 0,
  (cameraAdaptScreen = void 0),
  (getCamera = function (e, t) {
    var n = void 0,
      i = e.position,
      o = e.rotation,
      a = e.camera,
      s = t.uiWidth,
      l = t.uiHeight;
    switch (a.type) {
      case 1:
        n = new r.PerspectiveCamera(
          a.fov || 32,
          s / l,
          a.near || 0.01,
          a.far || 1e4,
        );
        break;
      case 2:
        n = new r.OrthographicCamera(
          a.left || -100,
          a.right || 100,
          a.top || 100,
          a.bottom || -100,
          a.near || 0.01,
          a.far || 1e4,
        );
        break;
      default:
        throw new Error('unknown camera type:' + a.type);
    }
    return (n.position.fromArray(i), n.rotation.fromArray(o), n);
  }),
  (layoutToPosition = function (e, t, n) {
    var i = n.far,
      o = n.near,
      a = -n.position.z,
      s = ((-(i + o) / (i - o)) * a + (-2 * i * o) / (i - o)) / -a;
    return new r.Vector3(e, t, s).applyMatrix4(n.projectionMatrixInverse);
  }));
var r = dependency_three;
cameraAdaptScreen = function (e, t, n, r) {
  var i = t.width,
    o = t.height;
  ((e.top = r / 2), (e.bottom = -r / 2), (e.left = -n / 2), (e.right = n / 2));
  var a = n / r / (i / o),
    s = void 0;
  switch (t.type) {
    case 'width':
      s = n / i;
      break;
    case 'height':
      s = r / o;
      break;
    case 'cover':
      s = a > 1 ? n / i : r / o;
      break;
    case 'contain':
      s = a > 1 ? r / o : n / i;
      break;
    default:
      s = 1;
  }
  ((e.zoom = s), e.updateProjectionMatrix());
};
export { cameraAdaptScreen, getCamera, layoutToPosition };
