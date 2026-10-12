// Extracted rendering module: utils. See ../PROVENANCE.md.
import * as dependency_gradient from './gradient.js';
import * as dependency_camera from './camera.js';
import * as dependency_scene_data from './scene-data.js';
import * as dependency_tween_utils from './tween-utils.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = dependency_camera,
  i = dependency_scene_data,
  o = dependency_tween_utils,
  a = dependency_gradient;
defaultExport = {
  createGradient: a.createGradient,
  createGradientTexture: a.createGradientTexture,
  getCamera: r.getCamera,
  cameraAdaptScreen: r.cameraAdaptScreen,
  layoutToPosition: r.layoutToPosition,
  getSceneData: i.getSceneData,
  tweenTo: o.tweenTo,
  tweenFromTo: o.tweenFromTo,
};
export { defaultExport as default };
