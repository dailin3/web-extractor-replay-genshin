// Extracted rendering module: tween-utils. See ../PROVENANCE.md.
import { gsapLibrary as dependency_gsap } from '../vendor/libraries.js';
export const __esModule = true;
let tweenTo, tweenFromTo;
('use strict');
void 0;
var r =
  Object.assign ||
  function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  };
((tweenTo = function (e, t, n) {
  return new Promise(function (i, a) {
    try {
      o.default.to(
        e,
        r(
          {
            onComplete: function () {
              i();
            },
            duration: t,
          },
          n,
        ),
      );
    } catch (e) {
      a(e);
    }
  });
}),
  (tweenFromTo = function (e, t, n, i) {
    return new Promise(function (a, s) {
      try {
        o.default.fromTo(
          e,
          n,
          r(
            {
              onComplete: function () {
                a();
              },
              duration: t,
            },
            i,
          ),
        );
      } catch (e) {
        s(e);
      }
    });
  }));
var i,
  o = (i = dependency_gsap) && i.__esModule ? i : { default: i };
export { tweenTo, tweenFromTo };
