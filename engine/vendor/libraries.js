import threeFactory from './three.js';
import gsapFactory from './gsap.js';
import customEaseFactory from './custom-ease.js';
import browserFactory from './browser-detector.js';
import howlerFactory from './howler.js';
import regeneratorFactory from './regenerator.js';

// Adapter for the captured, exact third-party distributions. No application
// modules or dynamic chunk loader participate in this small import boundary.
function importDistribution(initialize) {
  const module = { exports: {} };
  const helpers = {
    g: globalThis,
    r(exports) {
      Object.defineProperty(exports, '__esModule', { value: true });
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    },
    d(exports, definitions) {
      for (const [name, get] of Object.entries(definitions)) {
        Object.defineProperty(exports, name, { enumerable: true, get });
      }
    },
  };
  initialize(module, module.exports, helpers);
  return module.exports;
}

// The recovered renderer's async loaders were compiled with Babel's global
// generator helper. It is a third-party dependency, installed before renderer
// module evaluation rather than supplied by the original application entry.
export const regeneratorRuntime = importDistribution(regeneratorFactory);
globalThis.regeneratorRuntime = regeneratorRuntime;

export const THREE = importDistribution(threeFactory);
export const gsapLibrary = importDistribution(gsapFactory);
export const customEaseLibrary = importDistribution(customEaseFactory);
export const browserDetectorLibrary = {
  default: importDistribution(browserFactory),
};
export const howlerLibrary = importDistribution(howlerFactory);

// CustomEase's captured UMD distribution registers itself when gsap is global.
gsapLibrary.gsap.registerPlugin(customEaseLibrary.CustomEase);
