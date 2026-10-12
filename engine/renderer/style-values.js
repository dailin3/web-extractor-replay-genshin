// Extracted rendering module: style-values. See ../PROVENANCE.md.
import * as dependency_style_validation from './style-validation.js';
export const __esModule = true;
let defaultExport;
('use strict');
(void 0,
  (defaultExport = function (e, t) {
    switch (e) {
      case 'color':
      case 'strokeColor':
        if (l.has(t.toLowerCase())) return t;
        if ('#' === t.charAt(0)) {
          if (!c(t)) return;
          return t;
        }
        switch (t.substr(0, 4).toLowerCase()) {
          case 'rgb(':
          case 'hsl(':
          case 'rgba':
          case 'hsla':
            if (!c(t)) return;
            return t;
        }
        return;
      case 'fontSize':
      case 'strokeWidth':
        if (!i.test(t)) return;
        var n = parseFloat(t.replace(o, ''));
        if (n <= 0) return;
        return n;
      case 'fontFamily':
        if (0 === t.length) return;
        return t;
      case 'fontStyle':
        if (!r.AllowedStyles.has(t.toLowerCase())) return;
        return t;
      case 'fontWeight':
        if (!r.AllowedWeights.has(t.toLowerCase())) return;
        return t;
      case 'fontVariant':
        if (!r.AllowedVariants.has(t.toLowerCase())) return;
        return t;
      case 'fontStretch':
        if (!r.AllowedStretches.has(t.toLowerCase())) return;
        return t;
      case 'textAlign':
        if (!r.AllowedTextAligns.has(t.toLowerCase())) return;
        return t;
      case 'verticalAlign':
        if (!r.AllowedVerticalAlign.has(t.toLowerCase())) return;
        return t;
      case 'whiteSpace':
        if (!r.AllowedWhiteSpace.has(t.toLowerCase())) return;
        return t;
      case 'newLine':
        if (!r.AllowedNewLines.has(t.toLowerCase())) return;
        return t;
      case 'spaceWidth':
      case 'lineSpacing':
        if (!a.test(t)) return;
        return parseFloat(t.replace(s, ''));
      case 'lineHeight':
        if (!r.AllowedLineHeights.has(t.toLowerCase())) return;
        return t;
      default:
        return t;
    }
  }));
var r = dependency_style_validation,
  i = /^[+]?[0-9]+(?:[.][0-9]+)?(?:px)?$/,
  o = /[^0-9.]/g,
  a = /^[+-]?[0-9]+(?:[.][0-9]+)?(?:px)?$/,
  s = /[^0-9.-]/g,
  l = new Set([
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'black',
    'blanchedalmond',
    'blue',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgrey',
    'darkgreen',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'fuchsia',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'gray',
    'grey',
    'green',
    'greenyellow',
    'honeydew',
    'hotpink',
    'indianred ',
    'indigo ',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgrey',
    'lightgreen',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
    'lightsteelblue',
    'lightyellow',
    'lime',
    'limegreen',
    'linen',
    'magenta',
    'maroon',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'navy',
    'oldlace',
    'olive',
    'olivedrab',
    'orange',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'purple',
    'red',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'silver',
    'skyblue',
    'slateblue',
    'slategray',
    'slategrey',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'teal',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'wheat',
    'white',
    'whitesmoke',
    'yellow',
    'yellowgreen',
  ]);
function c(e) {
  if ('undefined' != typeof Option) {
    var t = new Option().style;
    return ((t.color = e), '' !== t.color);
  }
  return !1;
}
export { defaultExport as default };
