// Extracted rendering module: msdf. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = (function () {
    function e(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        ((r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r));
      }
    }
    return function (t, n, r) {
      return (n && e(t.prototype, n), r && e(t, r), t);
    };
  })(),
  i = dependency_three;
function o(e, t) {
  if (!(e instanceof t))
    throw new TypeError('Cannot call a class as a function');
}
var a = /(\s|[\u4e00-\u9fa5,\uac00-\ud7af,\u0e00-\u0e7f]+)/,
  s = (function (e) {
    function t() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
        n = arguments[1],
        r = arguments[2];
      o(this, t);
      var a = r || {},
        s = a.dynamic,
        l = void 0 === s || s,
        c = a.needsCenterAttribute,
        u = void 0 !== c && c,
        f = a.atlas,
        d = void 0 === f ? null : f,
        h = a.align,
        p = void 0 === h ? 'left' : h,
        m = a.letterSpacing,
        v = void 0 === m ? 0 : m,
        g = a.letterItalic,
        y = void 0 === g ? 0 : g,
        A = a.fontSize,
        b = void 0 === A ? 32 : A,
        w = a.fontWeight,
        _ = void 0 === w ? 1 : w,
        x = a.lineWidth,
        k = void 0 === x ? Number.MAX_VALUE : x,
        S = a.lineHeight,
        E = void 0 === S ? 1.5 : S,
        C = a.shadow,
        T = void 0 === C ? null : C;
      if (!d) throw new Error('未指定字体atlas');
      var I = new i.BufferGeometry();
      I.dynamic = l;
      var M = n || t.DEFAULT_MATERIAL;
      ((M.uniforms.diffuse = { value: d.texture }),
        (M.uniforms.fontWeight = { value: _ }),
        (M.extensions.derivatives = !0),
        (M.defines.MSDF_SIZE = Math.ceil(d.lineHeight) + '.'));
      var O = (function (e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
      })(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, I, M));
      if (
        ((O.atlas = d),
        (O.option = {
          align: p,
          letterSpacing: v,
          letterItalic: y,
          fontSize: b,
          lineWidth: k,
          lineHeight: E,
        }),
        (O.charCount = 0),
        (O.textWidth = 0),
        (O.textHeight = 0),
        (O.needsUpdate = !1),
        (O.needsCenterAttribute = u),
        (O.textCore = e),
        O.buildText(e, O.atlas, O.option),
        T)
      ) {
        var B = M.clone();
        ((B.uniforms = {
          diffuse: M.uniforms.diffuse,
          color: { value: T.color || t.DEFAULT_COLOR },
          weight: { value: T.weight || 1 },
          opacity: { value: T.opacity || 1 },
        }),
          (B.defines = { IS_SHADOW: 1, MSDF_SIZE: M.defines.MSDF_SIZE }),
          (B.depthWrite = !1),
          (O.shadowMesh = new i.Mesh(I, B)),
          T.offset &&
            ((O.shadowMesh.position.x += T.offset.x),
            (O.shadowMesh.position.y -= T.offset.y),
            O.shadowMesh.updateMatrix()),
          (O.shadowMesh.matrixAutoUpdate = !1),
          O.add(O.shadowMesh),
          setTimeout(function () {
            O.shadowMesh.renderOrder = O.renderOrder - 0.001;
          }));
      }
      return (
        (O.userDefinedAfterRender = null),
        (O.onAfterRenderCore = function () {
          (O.needsUpdate && O.update(),
            O.userDefinedAfterRender &&
              O.userDefinedAfterRender.apply(O, arguments));
        }),
        O
      );
    }
    return (
      (function (e, t) {
        if ('function' != typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof t,
          );
        ((e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
          t &&
            (Object.setPrototypeOf
              ? Object.setPrototypeOf(e, t)
              : (e.__proto__ = t)));
      })(t, e),
      r(t, null, [
        {
          key: 'measureText',
          value: function (e, t, n) {
            for (
              var r = n.fontSize,
                i = n.letterSpacing,
                o = void 0 === i ? 0 : i,
                a = 0,
                s = 0,
                l = e.length;
              s < l;
              s++
            ) {
              var c = e.charCodeAt(s),
                u = t.chars.get(c);
              u
                ? u.advance && (a += u.advance * r + o)
                : s < l - 1 && s > 0 && (a += r / 2 + o);
            }
            return a;
          },
        },
      ]),
      r(t, [
        {
          key: 'update',
          value: function () {
            this.geometry.dynamic || !this.geometry.indexs
              ? this.buildText(
                  this.textCore.toString(),
                  this.atlas,
                  this.option,
                )
              : console.warn('静态类型无法更新文本');
          },
        },
        {
          key: 'initGeometry',
          value: function () {
            for (
              var e = this.geometry.dynamic ? t.MAX_TEXT : this.textCore.length,
                n = this.geometry.dynamic
                  ? i.DynamicDrawUsage
                  : i.StaticDrawUsage,
                r = new Float32Array(4 * e * 3),
                o = new Float32Array(4 * e * 2),
                a = new Uint16Array(6 * e),
                s = 0;
              s < e;
              s++
            ) {
              var l = 6 * s,
                c = 4 * s;
              ((a[l] = c + 2),
                (a[l + 1] = c + 1),
                (a[l + 2] = c),
                (a[l + 3] = c + 2),
                (a[l + 4] = c + 3),
                (a[l + 5] = c + 1));
            }
            var u = new i.BufferAttribute(r, 3, !1);
            u.usage = n;
            var f = new i.BufferAttribute(o, 2, !0);
            f.usage = n;
            var d = new i.BufferAttribute(a, 1, !1);
            if (this.needsCenterAttribute) {
              var h = new Float32Array(4 * e * 2),
                p = new i.BufferAttribute(h, 2, !1);
              ((p.usage = n), this.geometry.setAttribute('center', p));
            }
            (this.geometry.setAttribute('position', u),
              this.geometry.setAttribute('uv', f),
              this.geometry.setIndex(d));
          },
        },
        {
          key: 'fillText',
          value: function (e, n, r, i, o) {
            var a = o.lineWidth,
              s = o.fontSize,
              l = o.align,
              c = o.letterSpacing,
              u = o.letterItalic,
              f = this.geometry.attributes.uv.array,
              d = this.geometry.attributes.position.array,
              h = void 0;
            this.needsCenterAttribute &&
              (h = this.geometry.attributes.center.array);
            var p = t.measureText(e, i, { fontSize: s, letterSpacing: c }),
              m = n,
              v = c;
            ('center' === l && a
              ? (m += (a - p) / 2)
              : 'right' === l && a
                ? (m += a - p)
                : 'justify' === l && a && (v += (a - p) / (e.length - 1)),
              (this.textWidth = Math.max(this.textWidth, p)),
              (this.textHeight = Math.max(this.textHeight, -r + s)));
            for (var g = 0, y = e.length; g < y; g++) {
              var A = e.charCodeAt(g),
                b = i.chars.get(A);
              if (b) {
                var w = 8 * this.charCount,
                  _ = b.uv,
                  x = _.xMin,
                  k = _.xMax,
                  S = _.yMin,
                  E = _.yMax;
                ((f[w] = x),
                  (f[w + 1] = E),
                  (f[w + 2] = k),
                  (f[w + 3] = E),
                  (f[w + 4] = x),
                  (f[w + 5] = S),
                  (f[w + 6] = k),
                  (f[w + 7] = S),
                  (x = m + b.pos.cX * s),
                  (S = r + b.pos.cY * s),
                  this.needsCenterAttribute &&
                    ((h[w] = x),
                    (h[w + 1] = S),
                    (h[w + 2] = x),
                    (h[w + 3] = S),
                    (h[w + 4] = x),
                    (h[w + 5] = S),
                    (h[w + 6] = x),
                    (h[w + 7] = S)),
                  (w = 12 * this.charCount),
                  (k = m + b.pos.xMax * s),
                  (x = m + b.pos.xMin * s),
                  (S = r + b.pos.yMin * s),
                  (E = r + b.pos.yMax * s));
                var C = 0.01 * this.charCount;
                ((d[w] = x + u),
                  (d[w + 1] = E),
                  (d[w + 2] = C),
                  (d[w + 3] = k + u),
                  (d[w + 4] = E),
                  (d[w + 5] = C),
                  (d[w + 6] = x),
                  (d[w + 7] = S),
                  (d[w + 8] = C),
                  (d[w + 9] = k),
                  (d[w + 10] = S),
                  (d[w + 11] = C),
                  b.advance && (m += b.advance * s + v),
                  (this.charCount += 1));
              } else
                ((m += s / 2 + v),
                  32 !== A && console.error('atlas中未找到字符:' + e[g]));
            }
          },
        },
        {
          key: 'buildText',
          value: function (e, n, r) {
            var i = r || {},
              o = i.fontSize,
              s = void 0 === o ? 32 : o,
              l = i.lineWidth,
              c = void 0 === l ? Number.MAX_VALUE : l,
              u = i.lineHeight,
              f = void 0 === u ? 1.5 : u,
              d = i.x,
              h = void 0 === d ? 0 : d,
              p = i.y,
              m = void 0 === p ? 0 : p;
            if ('' !== e.trim()) {
              (this.geometry.indexs || this.initGeometry(),
                (this.textWidth = 0),
                (this.textHeight = 0));
              var v = e.split(/(?:\r\n|\r|\n)/),
                g = 0;
              this.charCount = 0;
              for (var y = f * s, A = 0, b = v.length; A < b; A++) {
                var w = v[A],
                  _ = t.measureText(w, n, r);
                if (_ > c) {
                  for (var x = w.split(a), k = [], S = 0; S < x.length; S++) {
                    var E = x[S];
                    '' !== E &&
                      (a.test(E) ? (k = k.concat(E.split(''))) : k.push(E));
                  }
                  ((w = (x = k)[0]), (_ = t.measureText(w, n, r)));
                  for (var C = 1, T = x.length; C < T; C += 1) {
                    var I = t.measureText(x[C], n, r);
                    _ + I >= c
                      ? (this.fillText(w, h, m - g * y, n, r),
                        ' ' !== x[C]
                          ? ((w = x[C]), (_ = I))
                          : ((w = ''), (_ = 0)),
                        (g += 1))
                      : ((w += x[C]), (_ += I));
                  }
                }
                (this.fillText(w, h, m - g * y, n, r), (g += 1));
              }
              if (this.geometry.dynamic) {
                var M = 4 * this.charCount,
                  O = this.geometry.attributes.uv;
                if (
                  ((O.needsUpdate = !0),
                  (O.updateRange = { offset: 0, count: M }),
                  this.needsCenterAttribute)
                ) {
                  var B = this.geometry.attributes.center;
                  ((B.needsUpdate = !0),
                    (B.updateRange = { offset: 0, count: M }));
                }
                var P = this.geometry.attributes.position;
                ((P.needsUpdate = !0),
                  (P.updateRange = { offset: 0, count: M }),
                  this.geometry.setDrawRange(0, 6 * this.charCount));
              }
              (this.frustumCulled && this.geometry.computeBoundingSphere(),
                (this.needsUpdate = !1));
            }
          },
        },
        {
          key: 'onAfterRender',
          set: function (e) {
            this.userDefinedAfterRender = e;
          },
          get: function () {
            return this.onAfterRenderCore;
          },
        },
        {
          key: 'shadow',
          get: function () {
            return this.shadowMesh;
          },
        },
        {
          key: 'text',
          set: function (e) {
            this.textCore !== e &&
              ((this.textCore = e), (this.needsUpdate = !0));
          },
          get: function () {
            return this.textCore;
          },
        },
        {
          key: 'align',
          set: function (e) {
            e !== this.option.align &&
              ((this.option.align = e), (this.needsUpdate = !0));
          },
          get: function () {
            return this.option.align;
          },
        },
        {
          key: 'letterSpacing',
          set: function (e) {
            e !== this.option.letterSpacing &&
              ((this.option.letterSpacing = e), (this.needsUpdate = !0));
          },
          get: function () {
            return this.option.letterSpacing;
          },
        },
        {
          key: 'letterItalic',
          set: function (e) {
            e !== this.option.letterItalic &&
              ((this.option.letterItalic = e), (this.needsUpdate = !0));
          },
          get: function () {
            return this.option.letterItalic;
          },
        },
        {
          key: 'fontSize',
          set: function (e) {
            e !== this.option.fontSize &&
              ((this.option.fontSize = e), (this.needsUpdate = !0));
          },
          get: function () {
            return this.option.fontSize;
          },
        },
        {
          key: 'lineWidth',
          set: function (e) {
            e !== this.option.lineWidth &&
              ((this.option.lineWidth = e), (this.needsUpdate = !0));
          },
          get: function () {
            return this.option.lineWidth;
          },
        },
      ]),
      t
    );
  })(i.Mesh);
((s.DEFAULT_MATERIAL = new i.ShaderMaterial({
  vertexShader:
    'varying vec2 vUv;\nvoid main(){\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);\n}',
  fragmentShader:
    'varying vec2 vUv;\nuniform sampler2D diffuse;\nuniform float fontWeight;\nuniform vec3 color;\n\n#ifdef USE_STROKE\n  uniform vec3 strokeColor;\n  uniform float strokeWeight;\n#endif\n\nuniform float opacity;\n\nfloat median(vec3 color){\n    return max(min(color.r, color.g), min(max(color.r, color.g), color.b));\n}\n\nconst vec2 unitRange = vec2(1./MSDF_SIZE);\n\nfloat screenPxSize(){\n    vec2 screenTexSize = 1./fwidth(vUv);\n    return max(0.5*dot(unitRange, screenTexSize), 1.0);\n}\n\nvoid main(){\n    vec3 msdfColor = texture2D(diffuse, vUv).rgb;\n\n    float textMedian = median(msdfColor);\n\n    float screenPxSize = screenPxSize();\n\n    float textPercent = clamp((textMedian-.5/fontWeight)*screenPxSize + .5,0.,1.);\n\n    #ifdef IS_SHADOW\n      float shadowPercent = smoothstep(0.0,.6,textMedian)*opacity;\n      gl_FragColor = vec4(color, shadowPercent);\n    #else\n      #ifdef USE_STROKE\n        float strokePercent = clamp((textMedian-.5/fontWeight/strokeWeight)*screenPxSize+.5,0.,1.);      \n        gl_FragColor = vec4(mix(strokeColor,color,textPercent), strokePercent);\n      #else\n        gl_FragColor = vec4(color, textPercent);\n      #endif\n      if(gl_FragColor.a<.1){\n        discard;\n      } \n      gl_FragColor.a *= opacity;\n    #endif\n}',
  transparent: !0,
  uniforms: {
    opacity: { value: 1 },
    color: { value: new i.Color(0) },
    fontWeight: { value: 1 },
    diffuse: { value: null },
  },
  extensions: { derivatives: !0 },
})),
  (s.MAX_TEXT = 1e3),
  (s.prototype.isMSDFText = !0),
  (defaultExport = {
    MSDFTextMesh: s,
    MSDFAtlas: function e(t, n, r) {
      var i = this;
      (o(this, e),
        (this.font = t),
        (this.width = n.atlas.width),
        (this.height = n.atlas.height),
        (this.chars = new Map()),
        (this.texture = r),
        n.glyphs.forEach(function (e) {
          e.atlasBounds &&
            i.chars.set(e.unicode, {
              advance: e.advance,
              uv: {
                xMin: e.atlasBounds.left / i.width,
                xMax: e.atlasBounds.right / i.width,
                yMin: e.atlasBounds.bottom / i.height,
                yMax: e.atlasBounds.top / i.height,
              },
              pos: {
                xMin: e.planeBounds.left,
                xMax: e.planeBounds.right,
                yMin: e.planeBounds.bottom,
                yMax: e.planeBounds.top,
                cX: (e.planeBounds.left + e.planeBounds.right) / 2,
                cY: (e.planeBounds.top + e.planeBounds.bottom) / 2,
              },
            });
        }),
        (this.lineHeight = n.atlas.size));
    },
  }));
export { defaultExport as default };
