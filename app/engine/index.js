import engine from './renderer/engine-api.js';
import {
  THREE,
  gsapLibrary,
  customEaseLibrary,
  howlerLibrary,
} from './vendor/libraries.js';

export { THREE };
export const gsap = gsapLibrary.gsap;
export const CustomEase = customEaseLibrary.CustomEase;
export const Howl = howlerLibrary.Howl;
export const Howler = howlerLibrary.Howler;
export const {
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
} = engine;
export { createPlugins } from './plugins.js';
