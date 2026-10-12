// Extracted rendering module: text-measure. See ../PROVENANCE.md.
import * as dependency_canvas_style from './canvas-style.js';
export const __esModule = true;
let defaultExport;
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
defaultExport = function (e) {
  var t = (function (e) {
      var t = e.style,
        n = e.text,
        s = '' + t.fontSize + t.fontFamily,
        l = o.get(s);
      if (
        (l ||
          ((l = (function (e, t) {
            var n = document.createElement('div'),
              r = document.createElement('img'),
              i = document.createElement('span'),
              o = document.body;
            ((n.style.visibility = 'hidden'),
              (n.style.fontFamily = e),
              (n.style.fontSize = t),
              (n.style.margin = '0'),
              (n.style.padding = '0'),
              (n.style.whiteSpace = 'nowrap'),
              o.appendChild(n),
              (r.src =
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
              (r.width = 1),
              (r.height = 1),
              (r.style.margin = '0'),
              (r.style.padding = '0'),
              (r.style.verticalAlign = 'baseline'),
              (i.style.fontFamily = e),
              (i.style.fontSize = t),
              (i.style.margin = '0'),
              (i.style.padding = '0'),
              i.appendChild(document.createTextNode('Hidden Text')),
              n.appendChild(i),
              n.appendChild(r));
            var a = r.offsetTop - i.offsetTop + 2;
            (n.removeChild(i),
              n.appendChild(document.createTextNode('Hidden Text')),
              (n.style.lineHeight = 'normal'),
              (r.style.verticalAlign = 'super'));
            var s = r.offsetTop - n.offsetTop + 2;
            return (o.removeChild(n), { baseline: a, middle: s });
          })(t.fontFamily, t.fontSize + 'px')),
          o.set(s, l)),
        !a)
      ) {
        var c =
          'undefined' != typeof document
            ? document.createElement('canvas')
            : void 0;
        a = void 0 !== c ? c.getContext('2d') : void 0;
      }
      (0, i.configureCanvas)(t, a);
      var u = a.measureText(n);
      return r({}, l, { width: u.width });
    })(e),
    n = e.style.fontSize;
  return {
    width: t.width,
    height: 2 * t.middle,
    lineHeight: n,
    xOffset: 0,
    yOffset: t.baseline,
    ascent: t.baseline,
    maxAscent: n,
  };
};
var i = dependency_canvas_style,
  o = new Map(),
  a = void 0;
export { defaultExport as default };
