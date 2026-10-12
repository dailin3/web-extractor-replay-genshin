// Extracted rendering module: rich-text. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_text_node_types from './text-node-types.js';
import * as dependency_text_parser from './text-parser.js';
import * as dependency_style_parser from './style-parser.js';
import * as dependency_text_defaults from './text-defaults.js';
import * as dependency_text_layout from './text-layout.js';
import * as dependency_text_draw from './text-draw.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = dependency_three,
  i = dependency_text_node_types,
  o = dependency_text_parser,
  a = dependency_style_parser,
  s = dependency_text_defaults,
  l = dependency_text_layout,
  c = dependency_text_draw;
function u(e) {
  return e && e.__esModule ? e : { default: e };
}
function f(e) {
  return 'p' === e || 'div' === e;
}
var d = {
    fontsize: 'fontSize',
    size: 'fontSize',
    fontvariant: 'fontVariant',
    variant: 'fontVariant',
    fontfamily: 'fontFamily',
    family: 'fontFamily',
    fontweight: 'fontWeight',
    weight: 'fontWeight',
    fontstyle: 'fontStyle',
    style: 'fontStyle',
    fontstretch: 'fontStretch',
    stretch: 'fontStretch',
    color: 'color',
    width: 'width',
    newline: 'newLine',
    linespacing: 'lineSpacing',
    spacewidth: 'spaceWidth',
    whitespace: 'whiteSpace',
    textalign: 'textAlign',
    align: 'textAlign',
    lineheight: 'lineHeight',
    strokewidth: 'strokeWidth',
    strokecolor: 'strokeColor',
    verticalalign: 'verticalAlign',
  },
  h = (0, s.default)();
function p(e) {
  var t = (function (e, t) {
    var n = { children: [], style: t },
      r = [],
      s = [],
      l = n,
      c = void 0,
      u = t,
      h = e.replace(/\r\n/g, '\n');
    return (
      (0, o.default)(h).forEach(function (e) {
        switch (e.type) {
          case i.default.Text:
            (c || ((c = { words: [] }), l.children.push(c)),
              c.words.push({ text: e.text, style: u }));
            break;
          case i.default.OpenTag:
            if (f(e.tag)) {
              s.push(u);
              var t = {
                children: [],
                style: (u = Object.assign(
                  Object.assign({}, u),
                  (0, a.default)(e.style, d),
                )),
              };
              (l.children.push(t), r.push(l), (l = t), (c = void 0));
            } else
              'br' === e.tag
                ? (c = void 0)
                : (s.push(u),
                  (u = Object.assign(
                    Object.assign(
                      Object.assign({}, u),
                      (function (e) {
                        switch (e) {
                          case 'b':
                          case 'strong':
                            return { fontWeight: 'bold' };
                          case 'em':
                          case 'i':
                            return { fontStyle: 'italic' };
                          default:
                            return {};
                        }
                      })(e.tag),
                    ),
                    (0, a.default)(e.style, d),
                  )));
            break;
          case i.default.CloseTag:
            if (f(e.tag)) {
              var n = l;
              ((l = r.pop()),
                (c = void 0),
                0 === n.children.length &&
                  l.children.splice(l.children.indexOf(n), 1),
                (u = s.pop()));
            } else 'br' === e.tag || (u = s.pop());
        }
      }),
      n
    );
  })(
    e,
    arguments.length > 1 && void 0 !== arguments[1]
      ? arguments[1]
      : (0, s.default)(),
  );
  return (0, l.default)(t);
}
function m(e, t, n) {
  var r = n || {},
    i = r.x,
    o = void 0 === i ? 10 : i,
    a = r.y,
    s = void 0 === a ? 10 : a,
    l = r.align,
    u = void 0 === l ? 'top' : l,
    f = r.clear,
    d = void 0 === f || f,
    h = r.background,
    p = void 0 === h ? null : h,
    m = t.getContext('2d');
  d &&
    (p
      ? ((m.fillStyle = p), m.fillRect(0, 0, t.width, t.height))
      : m.clearRect(0, 0, t.width, t.height));
  var v = s;
  ('middle' === u
    ? (v += m.canvas.height / 2 - e.height / 2)
    : 'bottom' === u && (v += m.canvas.height - e.height),
    (0, c.default)(e, m, o, v, !0),
    (0, c.default)(e, m, o, v, !1));
}
function v(e, t) {
  var n = p(t, e.drawStyle);
  return (m(n, e.image, e.drawOffset), (e.needsUpdate = !0), n);
}
defaultExport = {
  createTextTexture: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t = e.wrapT,
      n = void 0 === t ? r.ClampToEdgeWrapping : t,
      i = e.wrapS,
      o = void 0 === i ? r.ClampToEdgeWrapping : i,
      a = e.minFilter,
      l = void 0 === a ? r.LinearFilter : a,
      c = e.width,
      u = void 0 === c ? 300 : c,
      f = e.height,
      d = void 0 === f ? 300 : f,
      h = e.x,
      p = void 0 === h ? 5 : h,
      m = e.y,
      g = void 0 === m ? 10 : m,
      y = e.align,
      A = void 0 === y ? 'top' : y,
      b = e.text,
      w = void 0 === b ? '' : b,
      _ = document.createElement('canvas'),
      x = new r.CanvasTexture(_, void 0, o, n, r.LinearFilter, l);
    ((_.width = u),
      (_.height = d),
      (x.drawStyle = Object.assign((0, s.default)(), e)),
      (x.drawStyle.width = u - 2 * p),
      (x.drawOffset = { x: p, y: g, align: A }));
    var k = null;
    return (w && (k = v(x, w)), { texture: x, blocks: k });
  },
  updateTextTexture: v,
  drawBlocks: m,
  parseBlocks: p,
  defaultStyle: h,
};
export { defaultExport as default };
