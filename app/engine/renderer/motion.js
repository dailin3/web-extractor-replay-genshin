/** Numeric type IDs are the captured scene-data protocol, not array positions. */
import utils from "./motion-utils.js";
import BaseTimeline from "./base-timeline.js";
import GroupTimeline from "./group-timeline.js";
import KeyFrameTimeline from "./keyframe-timeline.js";
import TweenTimeline from "./tween-timeline.js";
import SpineTimeline from "./spine-timeline.js";
import StepTimeline from "./step-timeline.js";
import SkinTimeline from "./skin-timeline.js";
import TextureTimeline from "./texture-timeline.js";
import MovieTimeline from "./movie-timeline.js";
import GradientTimeline from "./gradient-timeline.js";
import Cue from "./cue.js";
import KeyframeBlock from "./keyframe-block.js";
import TweenBlock from "./tween-block.js";
import SpineBlock from "./spine-block.js";
import StepBlock from "./step-frame.js";
import SkinBlock from "./skin-block.js";
import GradientBlock from "./gradient-block.js";
export const __esModule = true;
// Resolve constructors when called: GroupTimeline imports this module too.
// An eager top-level table would read cyclic imports before initialization.
function createTimeline(config) {
  switch (config.type) {
    case 1:
      return new GroupTimeline(config);
    case 2:
      return new KeyFrameTimeline(config);
    case 3:
      return new TweenTimeline(config);
    case 4:
      return new SpineTimeline(config);
    case 5:
      return new StepTimeline(config);
    case 6:
      return new SkinTimeline(config);
    case 7:
      return new TextureTimeline(config);
    case 8:
      return new MovieTimeline(config);
    case 9:
      return new GradientTimeline(config);
    default:
      throw new Error("unknown timeline type:" + config.type);
  }
}
function createBlock(config) {
  switch (config.type) {
    case 1:
      return new GroupTimeline(config);
    case 2:
      return new KeyframeBlock(config);
    case 3:
      return new TweenBlock(config);
    case 4:
      return new SpineBlock(config);
    case 5:
      return new StepBlock(config);
    case 6:
      return new SkinBlock(config);
    case 7:
      return new GradientBlock(config);
    default:
      throw new Error("unknown block type:" + config.type);
  }
}
export default {
  createTimeline,
  createBlock,
  BaseTimeline,
  GroupTimeline,
  KeyFrameTimeline,
  TweenTimeline,
  SpineTimeline,
  StepTimeline,
  SkinTimeline,
  TextureTimeline,
  MovieTimeline,
  GradientTimeline,
  Cue,
  KeyframeBlock,
  TweenBlock,
  SpineBlock,
  StepBlock,
  SkinBlock,
  GradientBlock,
  utils,
};
