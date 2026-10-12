/** Stable service aggregation; individual modules remain reusable independently. */
import motion from "./motion.js";
import spine from "./spine-runtime.js";
import msdf from "./msdf.js";
import io from "./decoder.js";
import mouse from "./mouse.js";
import Browser from "./browser.js";
import utils from "./utils.js";
import Audio from "./audio-manager.js";
import richText from "./rich-text.js";
import { THREEPlayer } from "./three-player.js";
export const __esModule = true;
export default {
  THREEPlayer,
  spine,
  motion,
  msdf,
  io,
  mouse,
  richText,
  utils,
  Browser,
  Audio,
};
