// Extracted rendering module: engine-api. See ../PROVENANCE.md.
import * as dependency_motion from './motion.js';
import * as dependency_spine_runtime from './spine-runtime.js';
import * as dependency_msdf from './msdf.js';
import * as dependency_decoder from './decoder.js';
import * as dependency_mouse from './mouse.js';
import * as dependency_browser from './browser.js';
import * as dependency_utils from './utils.js';
import * as dependency_audio_manager from './audio-manager.js';
import * as dependency_rich_text from './rich-text.js';
import * as dependency_three_player from './three-player.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = dependency_spine_runtime,
  i = dependency_msdf,
  o = dependency_motion,
  a = dependency_decoder,
  s = dependency_mouse,
  l = dependency_utils,
  c = dependency_audio_manager,
  u = dependency_browser,
  f = dependency_rich_text,
  d = dependency_three_player;
function h(e) {
  return e && e.__esModule ? e : { default: e };
}
defaultExport = {
  THREEPlayer: d.THREEPlayer,
  spine: r.default,
  motion: o.default,
  msdf: i.default,
  io: a.default,
  mouse: s.default,
  richText: f.default,
  utils: l.default,
  Browser: u.default,
  Audio: c.default,
};
export { defaultExport as default };
