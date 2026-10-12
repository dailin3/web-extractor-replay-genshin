// Extracted rendering module: motion. See ../PROVENANCE.md.
import * as dependency_motion_utils from './motion-utils.js';
import * as dependency_tween_timeline from './tween-timeline.js';
import * as dependency_base_timeline from './base-timeline.js';
import * as dependency_step_frame from './step-frame.js';
import * as dependency_tween_block from './tween-block.js';
import * as dependency_cue from './cue.js';
import * as dependency_keyframe_block from './keyframe-block.js';
import * as dependency_spine_block from './spine-block.js';
import * as dependency_skin_block from './skin-block.js';
import * as dependency_gradient_block from './gradient-block.js';
import * as dependency_group_timeline from './group-timeline.js';
import * as dependency_keyframe_timeline from './keyframe-timeline.js';
import * as dependency_spine_timeline from './spine-timeline.js';
import * as dependency_step_timeline from './step-timeline.js';
import * as dependency_skin_timeline from './skin-timeline.js';
import * as dependency_texture_timeline from './texture-timeline.js';
import * as dependency_movie_timeline from './movie-timeline.js';
import * as dependency_gradient_timeline from './gradient-timeline.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = dependency_group_timeline,
  i = dependency_base_timeline,
  o = dependency_keyframe_timeline,
  a = dependency_tween_timeline,
  s = dependency_spine_timeline,
  l = dependency_step_timeline,
  c = dependency_skin_timeline,
  u = dependency_texture_timeline,
  f = dependency_movie_timeline,
  d = dependency_gradient_timeline,
  h = dependency_cue,
  p = dependency_keyframe_block,
  m = dependency_tween_block,
  v = dependency_spine_block,
  g = dependency_step_frame,
  y = dependency_skin_block,
  A = dependency_motion_utils,
  b = dependency_gradient_block;
function w(e) {
  return e && e.__esModule ? e : { default: e };
}
defaultExport = {
  createTimeline: function (e) {
    switch (e.type) {
      case 1:
        return new r.default(e);
      case 2:
        return new o.default(e);
      case 3:
        return new a.default(e);
      case 4:
        return new s.default(e);
      case 5:
        return new l.default(e);
      case 6:
        return new c.default(e);
      case 7:
        return new u.default(e);
      case 8:
        return new f.default(e);
      case 9:
        return new d.default(e);
      default:
        throw new Error('unknown timeline type:' + e.type);
    }
  },
  createBlock: function (e) {
    switch (e.type) {
      case 1:
        return new r.default(e);
      case 2:
        return new p.default(e);
      case 3:
        return new m.default(e);
      case 4:
        return new v.default(e);
      case 5:
        return new g.default(e);
      case 6:
        return new y.default(e);
      case 7:
        return new b.default(e);
      default:
        throw new Error('unknown block type:' + e.type);
    }
  },
  BaseTimeline: i.default,
  GroupTimeline: r.default,
  KeyFrameTimeline: o.default,
  TweenTimeline: a.default,
  SpineTimeline: s.default,
  StepTimeline: l.default,
  SkinTimeline: c.default,
  TextureTimeline: u.default,
  MovieTimeline: f.default,
  GradientTimeline: d.default,
  Cue: h.default,
  KeyframeBlock: p.default,
  TweenBlock: m.default,
  SpineBlock: v.default,
  StepBlock: g.default,
  SkinBlock: y.default,
  GradientBlock: b.default,
  utils: A.default,
};
export { defaultExport as default };
