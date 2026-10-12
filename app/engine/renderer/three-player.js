// Extracted rendering module: three-player. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_motion from './motion.js';
import * as dependency_gradient from './gradient.js';
import * as dependency_spine_runtime from './spine-runtime.js';
import * as dependency_msdf from './msdf.js';
import * as dependency_decoder from './decoder.js';
import * as dependency_mouse from './mouse.js';
import * as dependency_mouse_uniforms from './mouse-uniforms.js';
import * as dependency_camera from './camera.js';
import * as dependency_scene_data from './scene-data.js';
import * as dependency_resource_loader from './resource-loader.js';
import * as dependency_render_passes from './render-passes.js';
import * as dependency_source_loader from './source-loader.js';
export const __esModule = true;
let THREEPlayer;
('use strict');
(void 0, (THREEPlayer = void 0));
var r = function (e, t) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e))
      return (function (e, t) {
        var n = [],
          r = !0,
          i = !1,
          o = void 0;
        try {
          for (
            var a, s = e[Symbol.iterator]();
            !(r = (a = s.next()).done) &&
            (n.push(a.value), !t || n.length !== t);
            r = !0
          );
        } catch (e) {
          ((i = !0), (o = e));
        } finally {
          try {
            !r && s.return && s.return();
          } finally {
            if (i) throw o;
          }
        }
        return n;
      })(e, t);
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
  },
  i =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n)
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
      }
      return e;
    },
  o = (function () {
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
  a = dependency_three,
  s = dependency_resource_loader,
  l = dependency_spine_runtime,
  c = dependency_msdf,
  u = dependency_render_passes,
  f = dependency_motion,
  d = dependency_decoder,
  h = dependency_mouse_uniforms,
  p = dependency_mouse,
  m = dependency_source_loader,
  v = dependency_gradient,
  g = dependency_camera,
  y = dependency_scene_data;
function A(e) {
  return e && e.__esModule ? e : { default: e };
}
var b = { 1: a.BufferGeometry, 2: a.InstancedBufferGeometry },
  w = {
    1: a.BufferAttribute,
    2: a.InstancedBufferAttribute,
    3: a.InterleavedBufferAttribute,
  };
function _(e) {
  return e
    .slice(1, e.length - 1)
    .split(',')
    .map(function (e) {
      return parseFloat(e);
    });
}
(a.Object3D,
  a.Mesh,
  a.SkinnedMesh,
  l.default.threejs.SkeletonMesh,
  a.PerspectiveCamera,
  a.OrthographicCamera,
  a.CubeCamera,
  (THREEPlayer = (function () {
    function e(t) {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e);
      var n = t || {},
        r = n.devSpeed,
        i = void 0 === r ? 1 : r,
        o = n.renderer,
        s = void 0 === o ? null : o,
        l = n.layoutData,
        c = void 0 === l ? { geometries: {}, sceneList: [] } : l,
        u = n.animationSetting,
        f = void 0 === u ? {} : u,
        d = n.shaderSetting,
        h = void 0 === d ? {} : d,
        p = n.bufferSetting,
        v = void 0 === p ? {} : p,
        g = n.spineSetting,
        y = void 0 === g ? {} : g,
        A = n.pluginSetting,
        b = void 0 === A ? {} : A,
        w = n.fontSetting,
        _ = void 0 === w ? {} : w,
        x = n.imageSetting,
        k = void 0 === x ? {} : x,
        S = n.timelineSetting,
        E = void 0 === S ? {} : S,
        C = n.modifierSetting,
        T = void 0 === C ? {} : C,
        I = n.machineSetting,
        M = void 0 === I ? {} : I,
        O = n.classSetting,
        B = void 0 === O ? {} : O,
        P = n.uniformSetting,
        L =
          void 0 === P
            ? {
                fps: { value: 1 },
                delta: { value: 0.016 },
                time: { value: 0 },
                resolution: { value: new a.Vector2(1, 1) },
                mouse: { value: new a.Vector2() },
                offset: { value: new a.Vector2() },
                mouseDelta: { value: new a.Vector2(0, 0) },
              }
            : P;
      ((this.renderer = s), (this.devSpeed = i));
      var R = s.getContext();
      ((this.animationSetting = f),
        (this.shaderSetting = h),
        (this.spineSetting = y),
        (this.bufferSetting = v),
        (this.uniformSetting = L),
        (this.modifierSetting = T),
        (this.fontSetting = _),
        (this.pluginSetting = b),
        (this.timelineSetting = E),
        (this.classSetting = B),
        (this.imageSetting = k),
        (this.machineSetting = M),
        (this.clock = new a.Clock()));
      var D = this;
      ((this.reportData = { tickTime: 0, tickCount: 0, hasReported: !1 }),
        (this.defaultAnimationSetting = {
          SKIN: function () {
            this.scene.autoUpdate &&
              this.userData.animationMixer.update(D.uniformSetting.delta.value);
          },
          SPINE: function () {
            (this.scene && !this.scene.autoUpdate) ||
              this.update(
                D.uniformSetting.delta.value,
                D.uniformSetting.time.value,
              );
          },
          DRAW_MASK: function () {
            (R.clearStencil(0),
              R.clear(R.STENCIL_BUFFER_BIT),
              R.stencilFunc(R.ALWAYS, 1, 1),
              R.stencilOp(R.REPLACE, R.REPLACE, R.REPLACE),
              R.colorMask(!1, !1, !1, !1),
              R.enable(R.STENCIL_TEST));
          },
          BEGIN_INVERT_MASK: function () {
            (R.stencilFunc(R.NOTEQUAL, 1, 1),
              R.stencilOp(R.KEEP, R.KEEP, R.KEEP),
              R.colorMask(!0, !0, !0, !0));
          },
          BEGIN_MASK: function () {
            (R.stencilFunc(R.EQUAL, 1, 1),
              R.stencilOp(R.KEEP, R.KEEP, R.KEEP),
              R.colorMask(!0, !0, !0, !0));
          },
          STOP_MASK: function () {
            R.disable(R.STENCIL_TEST);
          },
        }),
        (this.geometries = {}),
        (this.shaders = {}),
        (this.spines = {}),
        (this.textures = {}),
        (this.buffers = {}),
        (this.fonts = {}),
        (this.sourcePool = {}),
        (this.loader = new m.SourceLoad({ sourcePool: this.sourcePool })),
        (this.timelines = {}),
        (this.skinning = {}),
        (this.skeletons = {}),
        (this.exportResources = {}),
        (this.mouseController = null),
        (this.scenes = {}),
        (this.layoutData = c),
        this.initLayout(c));
    }
    return (
      o(e, null, [
        {
          key: 'decode',
          value: function (e) {
            return d.default.Decoder.parse(e);
          },
        },
        {
          key: 'updateTextTexture',
          value: function (e, t) {
            var n = e.image,
              r = n.getContext('2d');
            (e.opt.background
              ? ((r.fillStyle = e.opt.background),
                r.fillRect(0, 0, n.width, n.height))
              : r.clearRect(0, 0, n.width, n.height),
              (r.fillStyle = e.opt.color),
              (r.textBaseline = e.opt.baseline),
              (r.textAlign = e.opt.align),
              (r.font = [
                e.opt.style,
                e.opt.variant,
                e.opt.weight,
                e.opt.size + 'px',
                e.opt.family,
              ].join(' ')));
            var i = e.opt.lineHeight;
            e.opt.strokeStyle &&
              e.opt.strokeWidth &&
              ((r.lineWidth = e.opt.strokeWidth),
              (r.strokeStyle = e.opt.strokeStyle));
            for (
              var o = 0, a = t.split(/(?:\r\n|\r|\n)/), s = 0, l = a.length;
              s < l;
              s++
            ) {
              var c = a[s],
                u = r.measureText(c).width;
              if (u > e.opt.lineWidth) {
                for (
                  var f = c.split(
                      /(\s|[\u4e00-\u9fa5,\uac00-\ud7af,\u0e00-\u0e7f]+)/,
                    ),
                    d = [],
                    h = 0;
                  h < f.length;
                  h++
                ) {
                  var p = f[h];
                  '' !== p &&
                    (/([\u4e00-\u9fa5]+)/.test(p)
                      ? (d = d.concat(p.split('')))
                      : d.push(p));
                }
                ((c = (f = d)[0]), (u = r.measureText(c).width));
                for (var m = 1, v = f.length; m < v; m += 1) {
                  var g = r.measureText(f[m]).width;
                  u + g >= e.opt.lineWidth
                    ? (e.opt.strokeStyle &&
                        e.opt.strokeWidth &&
                        r.strokeText(c, e.opt.x, e.opt.y + o * i),
                      r.fillText(c, e.opt.x, e.opt.y + o * i),
                      ' ' !== f[m]
                        ? ((c = f[m]), (u = g))
                        : ((c = ''), (u = 0)),
                      (o += 1))
                    : ((c += f[m]), (u += g));
                }
              }
              (e.opt.strokeStyle &&
                e.opt.strokeWidth &&
                r.strokeText(c, e.opt.x, e.opt.y + o * i),
                r.fillText(c, e.opt.x, e.opt.y + o * i),
                null == u && (u = r.measureText(c).width),
                (o += 1));
            }
            return (
              (e.needsUpdate = !0),
              { count: o, opt: e.opt, width: n.width, height: n.height }
            );
          },
        },
        {
          key: 'buildMorph',
          value: function (e) {
            e &&
              e.material &&
              e.geometry &&
              e.geometry.attributes.morphTarget0 &&
              ((e.morphTargetInfluences = []),
              Object.keys(e.geometry.attributes).forEach(function (t) {
                0 === t.indexOf('morphTarget') &&
                  e.morphTargetInfluences.push(0);
              }),
              Array.isArray(e.material)
                ? e.material.forEach(function (t) {
                    ((t.uniforms.morphTargetInfluences = {
                      value: e.morphTargetInfluences,
                    }),
                      (t.defines.USE_MORPH = e.morphTargetInfluences.length));
                  })
                : ((e.material.uniforms.morphTargetInfluences = {
                    value: e.morphTargetInfluences,
                  }),
                  (e.material.defines.USE_MORPH =
                    e.morphTargetInfluences.length)));
          },
        },
        {
          key: 'getTextTexture',
          value: function (t) {
            var n = document.createElement('canvas'),
              r = new a.CanvasTexture(n);
            ((r.minFilter = a.LinearFilter),
              e.setParameter(r, t, 'wrapT'),
              e.setParameter(r, t, 'wrapS'),
              e.setParameter(r, t, 'minFilter'),
              (r.minFilter = a.LinearFilter));
            var i = e.getParameter(t, 'width') || 300,
              o = e.getParameter(t, 'height') || 300;
            (r.minFilter !== a.LinearFilter ||
            r.wrapS !== a.ClampToEdgeWrapping ||
            r.wrapT !== a.ClampToEdgeWrapping
              ? ((n.width = Math.pow(2, Math.ceil(Math.log(i) / Math.LN2))),
                (n.height = Math.pow(2, Math.ceil(Math.log(o) / Math.LN2))))
              : ((n.width = i), (n.height = o)),
              (r.opt = {
                family: getComputedStyle
                  ? getComputedStyle(document.body).fontFamily
                  : 'Microsoft YaHei,微软雅黑',
                color: '#fff',
                align: 'center',
                style: 'normal',
                variant: 'normal',
                weight: 'bolder',
                size: '26',
                baseline: 'top',
                x: 0,
                y: 0,
                scaleX: n.width / i,
                scaleY: n.height / o,
                lineWidth: n.width,
                lineHeight: '26',
                background: null,
                strokeStyle: null,
                strokeWidth: null,
              }),
              e.setParameter(r.opt, t, 'background'),
              e.setParameter(r.opt, t, 'color'),
              e.setParameter(r.opt, t, 'align'),
              e.setParameter(r.opt, t, 'family'),
              e.setParameter(r.opt, t, 'style'),
              e.setParameter(r.opt, t, 'variant'),
              e.setParameter(r.opt, t, 'weight'),
              e.setParameter(r.opt, t, 'size'),
              e.setParameter(r.opt, t, 'x'),
              e.setParameter(r.opt, t, 'y'),
              e.setParameter(r.opt, t, 'baseline'),
              e.setParameter(r.opt, t, 'lineWidth'),
              e.setParameter(r.opt, t, 'lineHeight'),
              e.setParameter(r.opt, t, 'strokeStyle'),
              e.setParameter(r.opt, t, 'strokeWidth'),
              n.getContext('2d').scale(r.opt.scaleX, r.opt.scaleY));
            var s = e.getParameter(t, 'text');
            return (s && (e.updateTextTexture(r, s), (r.needsUpdate = !0)), r);
          },
        },
        {
          key: 'updateProp',
          value: function (e, t) {
            Object.keys(t).forEach(function (n) {
              e[n] = t[n];
            });
          },
        },
        {
          key: 'getEventDispatcher',
          value: function () {
            return h.default;
          },
        },
        {
          key: 'getLoader',
          value: function () {
            return s.loader;
          },
        },
        {
          key: 'createLoader',
          value: function () {
            return (0, s.createLoader)();
          },
        },
        {
          key: 'getSourceLoader',
          value: function () {
            return m.sourceLoader;
          },
        },
        {
          key: 'createSourceLoader',
          value: function () {
            return (0, m.createSourceLoader)();
          },
        },
        {
          key: 'getParameter',
          value: function (e, t) {
            var n = e.match(new RegExp('(^|&)' + t + '=([^&]*)(&|$)'));
            return n ? n[2] : null;
          },
        },
        {
          key: 'getParameters',
          value: function (e) {
            var t = e.split('&'),
              n = {};
            return (
              t.forEach(function (e) {
                var t = e.split('='),
                  r = t[0],
                  i = parseInt(t[1], 10);
                n[r] = i;
              }),
              n
            );
          },
        },
        {
          key: 'setParameter',
          value: function (t, n, r) {
            var i = e.getParameter(n, r);
            if (i) {
              var o = t[r];
              return ((t[r] = isNaN(i) ? i : parseInt(i)), o !== t[r]);
            }
            return !1;
          },
        },
        {
          key: 'getObjScreenElePos',
          value: function (e, t, n) {
            var r = n.width,
              i = n.height;
            t.updateMatrixWorld();
            var o = new a.Vector3(0, 0, 0);
            return (
              e.getWorldPosition(o),
              o.project(t),
              {
                position: 'absolute',
                transform:
                  'translate(calc(-50% + ' +
                  ((o.x * r) / 100 / 2).toFixed(2) +
                  'rem), calc(-50% + ' +
                  ((-o.y * i) / 100 / 2).toFixed(2) +
                  'rem))',
                left: '50%',
                top: '50%',
              }
            );
          },
        },
        {
          key: 'getObjWorldPos',
          value: function (e, t, n, r) {
            var i = n.right / n.zoom / 100,
              o = n.top / n.zoom / 100,
              s = r.width,
              l = r.height,
              c = s / 2 / 100,
              u = l / 2 / 100,
              f = c - i,
              d = u - o,
              h = e > 0 ? (c - (f + e)) / c : -(c - (f - e)) / c,
              p = t > 0 ? (u - (d + t)) / u : -(u - (d - t)) / u;
            return new a.Vector3((h * s) / 2, (p * l) / 2, 0);
          },
        },
      ]),
      o(
        e,
        [
          {
            key: 'createLoader',
            value: function () {
              return new m.SourceLoad({ sourcePool: this.sourcePool });
            },
          },
          {
            key: 'getSourcePoolResult',
            value: function (e) {
              return this.sourcePool[e] ? this.sourcePool[e].result : null;
            },
          },
          {
            key: 'checkGPUAcceleratorEnabled',
            value: function () {
              var e = this.renderer.getContext(),
                t = e.getExtension('WEBGL_debug_renderer_info');
              if (t) {
                var n = e.getParameter(t.UNMASKED_RENDERER_WEBGL);
                return !/SwiftShader/gi.test(n);
              }
              return !1;
            },
          },
          {
            key: 'reportRenderInfo',
            value: function (e, t) {
              var n = this.reportData,
                r = n.tickTime,
                i = n.tickCount,
                o = n.hasReported;
              if (r >= e && !o) {
                this.reportData.hasReported = !0;
                var a = {
                    averageFps: parseInt(i / r, 10),
                    gpu: null,
                    maxTextureSize: null,
                    resolution:
                      parseInt(this.uniformSetting.resolution.value.x, 10) +
                      '-' +
                      parseInt(this.uniformSetting.resolution.value.y, 10),
                    ua: window.navigator.userAgent,
                  },
                  s = this.renderer.getContext(),
                  l = s.getExtension('WEBGL_debug_renderer_info');
                return (
                  l &&
                    ((a.gpu =
                      s.getParameter(l.UNMASKED_RENDERER_WEBGL) || null),
                    (a.maxTextureSize =
                      s.getParameter(s.MAX_TEXTURE_SIZE) || null)),
                  void t(a)
                );
              }
              ((this.reportData.tickTime += this.uniformSetting.delta.value),
                (this.reportData.tickCount += 1));
            },
          },
          {
            key: 'initLayout',
            value: function (e) {
              var t = this,
                n = e.bufferMap,
                r = void 0 === n ? {} : n;
              (this.initGeometry(e),
                e.sceneList.forEach(function (e) {
                  var n = (e.classConfig || {}).id,
                    i = new (t.classSetting[n] || a.Scene)(),
                    o = (0, g.getCamera)(e.camera[0], e.sceneConfig);
                  (void 0 === e.buffer
                    ? 'scene_ui' !== e.id
                      ? (i.buffer = t.getBuffer(e.id, r[e.id]))
                      : (i.buffer = null)
                    : (i.buffer = t.getBuffer(e.buffer, r[e.buffer])),
                    (i.name = e.id),
                    (i.camera = o),
                    (i.sceneInited = !1),
                    (i.sceneConfig = e.sceneConfig),
                    (t.scenes[e.id] = i));
                }));
            },
          },
          {
            key: 'renderScene',
            value: function (e) {
              var t =
                  !(arguments.length > 1 && void 0 !== arguments[1]) ||
                  arguments[1],
                n = arguments[2],
                r = this.getScene(e);
              r.overrideRender
                ? r.overrideRender(t, n)
                : (this.renderer.setRenderTarget(r.buffer),
                  t && this.renderer.clear(),
                  this.renderer.render(r, r.camera));
            },
          },
          {
            key: 'resizeUI',
            value: function (e, t, n) {
              var r = this,
                o = n.scale,
                a = void 0 === o ? 1 : o,
                s = n.isFixedSize,
                l = void 0 !== s && s,
                c = n.isFixedAspect,
                u = void 0 !== c && c,
                f = n.width,
                d = void 0 === f ? 2500 : f,
                h = n.height,
                p = void 0 === h ? 1080 : h,
                m = n.all,
                v = void 0 !== m && m,
                y = d,
                A = p,
                b = Math.min(1.3, a),
                w = e / t / (y / A);
              w < 1 ? (y *= w) : (A /= w);
              var _ = y * (b *= Math.min(1, Math.max(e / y, t / A))),
                x = A * b,
                k = Math.max(_ / n.width, x / n.height),
                S = n.width * k,
                E = n.height * k;
              return (
                this.renderer.setSize(_, x),
                (0, g.cameraAdaptScreen)(
                  this.getScene('scene_ui').camera,
                  i({}, n, { width: y, height: A }),
                  _,
                  x,
                ),
                l ||
                  (v
                    ? Object.keys(this.buffers).forEach(function (e) {
                        var t = r.buffers[e];
                        t &&
                          t.resizable &&
                          (u ? t.setSize(S, E) : t.setSize(_, x));
                      })
                    : Object.keys(this.scenes).forEach(function (e) {
                        var t = r.scenes[e].buffer;
                        t &&
                          t.resizable &&
                          (u ? t.setSize(S, E) : t.setSize(_, x));
                      }),
                  this.uniformSetting.bufferSize &&
                    (u
                      ? this.uniformSetting.bufferSize.value.set(S, E)
                      : this.uniformSetting.bufferSize.value.set(_, x)),
                  this.uniformSetting.resolution.value.set(_, x)),
                { width: _, height: x }
              );
            },
          },
          {
            key: 'getScene',
            value: function (e) {
              var t = this.scenes[e];
              return (
                t.children.length ||
                  this.initScene((0, y.getSceneData)(this.layoutData, e), t),
                t
              );
            },
          },
          {
            key: 'getBufferAnimationFunc',
            value: function (e) {
              return {
                onBufferClick: function (t) {
                  bufferAnimationSceneHitTest.call(this, 'onClick', t, e.dom);
                },
                onBufferDown: function (t) {
                  bufferAnimationSceneHitTest.call(
                    this,
                    'onMouseDown',
                    t,
                    e.dom,
                  );
                },
                onBufferUp: function (t) {
                  bufferAnimationSceneHitTest.call(this, 'onMouseUp', t, e.dom);
                },
                onBufferMove: function (t) {
                  bufferAnimationSceneHitTest.call(
                    this,
                    'onMouseMove',
                    t,
                    e.dom,
                  );
                },
              };
            },
          },
          {
            key: 'drawCopy',
            value: function (e, t, n) {
              var r = (n || {}).resize,
                i = void 0 !== r && r;
              e !== t && u.default.copyPass.render(this.renderer, e, t, i);
            },
          },
          {
            key: 'drawBlur',
            value: function (e, t, n) {
              var r = n || {},
                i = r.resize,
                o = void 0 !== i && i,
                a = r.x,
                s = void 0 === a ? 1 : a,
                l = r.y,
                c = void 0 === l ? 1 : l,
                f = r.target,
                d = r.camera;
              s > 1e-5 || c > 1e-5
                ? u.default.blurPass.render(this.renderer, e, t, o, s, c, f, d)
                : e !== t && u.default.copyPass.render(this.renderer, e, t, o);
            },
          },
          {
            key: 'getFont',
            value: function (e) {
              return (
                this.fonts[e] ||
                  (this.fontSetting[e].json ||
                    console.error('no font atlas:' + e),
                  (this.fonts[e] = new c.default.MSDFAtlas(
                    e,
                    this.fontSetting[e].json,
                    this.getTexture(e),
                  ))),
                this.fonts[e]
              );
            },
          },
          {
            key: 'createText',
            value: function (e, t) {
              return new c.default.MSDFTextMesh(e.text, t, {
                atlas: this.getFont(e.font),
                dynamic: !e.static,
                needsCenterAttribute: e.nca,
                fontSize: e.fontSize,
                align: e.align,
                lineWidth: e.lineWidth,
                lineHeight: e.lineHeight,
                letterSpacing: e.letterSpacing,
                letterItalic: e.letterItalic,
                color: e.color,
                shadow:
                  void 0 !== e.shadowColor ||
                  void 0 !== e.shadowOpacity ||
                  void 0 !== e.shadowOffset
                    ? {
                        color: e.shadowColor
                          ? new a.Color(e.shadowColor)
                          : null,
                        opacity: e.shadowOpacity,
                        offset: e.shadowOffset
                          ? new a.Vector2().fromArray(e.shadowOffset)
                          : null,
                      }
                    : null,
              });
            },
          },
          {
            key: 'getTimeline',
            value: function (e, t, n) {
              var r = (n || {}).excludes,
                o = void 0 === r ? null : r,
                a = e.uuid + '_' + t;
              if (!this.timelines[a]) {
                if (!this.timelineSetting[t])
                  throw new Error('timeline ' + t + ' is not found');
                this.timelines[a] = f.default.createTimeline(
                  i({}, this.timelineSetting[t], {
                    methods: this.animationSetting,
                    root: e,
                  }),
                );
              }
              return (
                o &&
                  this.timelines[a].traverse(function (e) {
                    o.includes(e.name) ? (e.weight = 0) : (e.weight = 1);
                  }),
                this.timelines[a]
              );
            },
          },
          {
            key: 'findTimeline',
            value: function (e) {
              var t = '_' + e,
                n = Object.keys(this.timelines).find(function (e) {
                  return -1 !== e.indexOf(t);
                });
              return n ? this.timelines[n] : null;
            },
          },
          {
            key: 'stopTimeline',
            value: function (e, t) {
              if (t) {
                var n = this.getTimeline(e, t);
                n && n.stop();
              } else e._playedTimeline && e._playedTimeline.stop();
            },
          },
          {
            key: 'playTimeline',
            value: function (e, t) {
              var n = this,
                r =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {};
              1 !== this.devSpeed && (r.speed = this.devSpeed);
              var i = r.mix,
                o = void 0 === i ? 0 : i,
                a = r.fps,
                s = void 0 === a ? 30 : a,
                l = r.speed,
                c = void 0 === l ? 1 : l,
                u = r.loop,
                d = void 0 !== u && u,
                h = r.overwrite,
                p = void 0 === h || h,
                m = r.start,
                v = void 0 === m ? 0 : m,
                g = (1e3 * o) / c / s;
              if (
                (p && e._playedTimeline && e._playedTimeline.stop(),
                Array.isArray(t))
              ) {
                var y = f.default.createTimeline({ type: 1 });
                e._playedTimeline = y;
                var A = 0;
                return (
                  t.forEach(function (i, a) {
                    var s = n.getTimeline(e, i, r);
                    if (
                      ((s.start += A),
                      (s.loop = a === t.length - 1 && d),
                      (A += s.duration - g),
                      y.add(s),
                      a > 0 && 0 !== o)
                    ) {
                      var l = f.default.createTimeline({
                        start: s.start,
                        type: 3,
                        data: [{ start: 0, end: g, frames: [0, 1] }],
                        name: '.weight',
                        root: s,
                      });
                      y.add(l);
                    }
                  }),
                  y.play(r)
                );
              }
              var b = this.getTimeline(e, t, r);
              if (((b.loop = d), 0 === o))
                return ((e._playedTimeline = b), b.play(r));
              var w = f.default.createTimeline({ type: 1 }),
                _ = f.default.createTimeline({
                  start: v,
                  type: 3,
                  data: [{ start: 0, end: g, frames: [0, 1] }],
                  name: '.weight',
                  root: b,
                });
              return (w.add(_), w.add(b), (e._playedTimeline = w), w.play(r));
            },
          },
          {
            key: 'initBuffer',
            value: function (e, t) {
              this.buffers[e] = t;
            },
          },
          {
            key: 'getBuffer',
            value: function (e, t) {
              if ('' === e) return null;
              if (!this.buffers[e]) {
                var n = t || {},
                  r = n.resizable,
                  i = void 0 === r || r,
                  o = n.width,
                  s = void 0 === o ? 512 : o,
                  l = n.height,
                  c = void 0 === l ? 512 : l,
                  u = n.wrapS,
                  f = void 0 === u ? a.ClampToEdgeWrapping : u,
                  d = n.wrapT,
                  h = void 0 === d ? a.ClampToEdgeWrapping : d,
                  p = n.format,
                  m = void 0 === p ? a.RGBAFormat : p,
                  v = n.premultiplyAlpha,
                  g = void 0 === v || v,
                  y = n.stencilBuffer,
                  A = void 0 !== y && y,
                  b = n.depthBuffer,
                  w = void 0 === b || b,
                  _ = n.generateMipmaps,
                  x = void 0 !== _ && _,
                  k =
                    this.uniformSetting.bufferSize ||
                    this.uniformSetting.resolution,
                  S = new a.WebGLRenderTarget(
                    i ? k.value.x : s,
                    i ? k.value.y : c,
                    {
                      wrapS: f,
                      wrapT: h,
                      format: m,
                      stencilBuffer: A,
                      depthBuffer: w,
                      premultiplyAlpha: g,
                      generateMipmaps: x,
                    },
                  );
                ((S.resizable = i), this.initBuffer(e, S));
              }
              return this.buffers[e];
            },
          },
          {
            key: 'getImage',
            value: function (e) {
              return (
                (this.imageSetting[e] ? this.imageSetting[e].image : null) ||
                s.loader.getResult(e) ||
                m.sourceLoader.getResult(e) ||
                this.getSourcePoolResult(e)
              );
            },
          },
          {
            key: 'removeTexture',
            value: function (e) {
              var t = e.split('?'),
                n = r(t, 2),
                i = n[0];
              (n[1],
                this.textures[i] &&
                  (this.textures[i].dispose(), delete this.textures[i]));
            },
          },
          {
            key: 'initTexture',
            value: function (e) {
              var t = this.getTexture(e);
              t && this.renderer.setTexture(t);
            },
          },
          {
            key: 'getTextureConfig',
            value: function (t) {
              if (this.imageSetting[t] && this.imageSetting[t].config) {
                var n = this.imageSetting[t].config;
                return i(
                  {
                    wrapS: n.wrapS || a.ClampToEdgeWrapping,
                    wrapT: n.wrapT || a.ClampToEdgeWrapping,
                    minFilter: n.minFilter || a.LinearFilter,
                    magFilter: n.magFilter || a.LinearFilter,
                  },
                  e.getParameters(n.other || ''),
                );
              }
              return {};
            },
          },
          {
            key: 'getTexture',
            value: function (t) {
              var n = t.split('?'),
                i = r(n, 2),
                o = i[0],
                s = i[1],
                l = !1;
              if (!this.textures[o]) {
                var c = this.getImage(o);
                if (!c)
                  return ('' !== t && console.warn('no texture:' + o), null);
                ((this.textures[o] = new a.Texture(c)),
                  (this.textures[o].name = o),
                  (this.textures[o].minFilter = a.LinearFilter),
                  (l = !0));
              }
              var u = this.textures[o];
              return (
                (u.name = o),
                s
                  ? (e.setParameter(u, s, 'wrapS') && (l = !0),
                    e.setParameter(u, s, 'wrapT') && (l = !0),
                    e.setParameter(u, s, 'minFilter') && (l = !0))
                  : e.updateProp(u, this.getTextureConfig(o)),
                (u.needsUpdate = l),
                u
              );
            },
          },
          {
            key: 'getUniform',
            value: function (t) {
              switch (t.type) {
                case 'f':
                  return { value: t.value, type: 'f' };
                case 'i':
                  return { value: t.value, type: 'i' };
                case 'v2':
                  return {
                    value: new a.Vector2().fromArray(
                      Array.isArray(t.value) ? t.value : _(t.value),
                    ),
                  };
                case 'v3':
                  return {
                    value: new a.Vector3().fromArray(
                      Array.isArray(t.value) ? t.value : _(t.value),
                    ),
                  };
                case 'v4':
                  return {
                    value: new a.Vector4().fromArray(
                      Array.isArray(t.value) ? t.value : _(t.value),
                    ),
                  };
                case 'c':
                  return { value: new a.Color(t.value) };
                case 't':
                  return {
                    value: this.getTexture(t.value),
                    src: t.value,
                    type: 't',
                  };
                case 'w':
                  return { value: e.getTextTexture(t.value), type: 't' };
                case 'b':
                  return { value: this.getBuffer(t.value).texture, type: 't' };
                case 'u':
                  return this.uniformSetting[t.value] || { value: null };
                case 'g':
                  return {
                    value: (0, v.createGradientTexture)(t.value),
                    type: 't',
                  };
                default:
                  return { value: t.value };
              }
            },
          },
          {
            key: 'getMaterial',
            value: function (e, t) {
              var n = this;
              if (0 !== e.length) {
                var r = [];
                return (
                  e.forEach(function (e, o) {
                    var s = n.shaderSetting[e.id];
                    if (!s) throw new Error('unknown shader:' + e.id);
                    ((r[o] = s.clone()),
                      (r[o].name = e.id),
                      (r[o].skinning = 2 === t),
                      void 0 !== e.transparent &&
                        (r[o].transparent = e.transparent),
                      void 0 !== e.depthTest && (r[o].depthTest = e.depthTest),
                      void 0 !== e.depthWrite &&
                        (r[o].depthWrite = e.depthWrite),
                      void 0 !== e.side && (r[o].side = e.side),
                      void 0 !== e.blending && (r[o].blending = e.blending),
                      void 0 !== e.wireframe && (r[o].wireframe = e.wireframe),
                      void 0 !== e.derivatives &&
                        (r[o].extensions.derivatives = e.derivatives),
                      e.lights &&
                        ((r[o].lights = !0),
                        (r[o].uniforms = a.UniformsUtils.clone(
                          a.UniformsLib.lights,
                        ))),
                      e.uniforms &&
                        e.uniforms.forEach(function (e) {
                          ('t' === e.type && (r[o].defines.USE_TEXTURE = 1),
                            (r[o].uniforms[e.key] = n.getUniform(e)));
                        }),
                      e.globalUniform &&
                        e.globalUniform.forEach(function (e) {
                          uniforms[e] = n.uniformSetting[e];
                        }),
                      e.defines &&
                        (r[o].defines = i({}, r[o].defines, e.defines)),
                      e.glsl3 && (r[o].glslVersion = a.GLSL3),
                      e.others &&
                        e.others.split('&').forEach(function (e) {
                          var t = e.split('=');
                          if (2 === t.length) {
                            var n = t[0],
                              i = t[1];
                            'false' === i || 'true' === i
                              ? (r[o][n] = 'false' !== i)
                              : isNaN(parseInt(i))
                                ? (r[o][n] = i)
                                : (r[o][n] = parseInt(i));
                          }
                        }));
                  }),
                  1 === r.length ? r[0] : r
                );
              }
            },
          },
          {
            key: 'initSpineData',
            value: function (e) {
              var t = this,
                n = new l.default.TextureAtlas(this.spineSetting[e].atlas);
              n.pages.forEach(function (e) {
                var n,
                  r = e.name.substr(0, e.name.indexOf('.'));
                ((n = new l.default.threejs.ThreeJsTexture(t.getImage(r))),
                  e.setTexture(n));
              });
              var r = new l.default.SkeletonJson(
                new l.default.AtlasAttachmentLoader(n),
              ).readSkeletonData(this.spineSetting[e].json);
              this.spines[e] = { skeleton: r, atlas: n };
            },
          },
          {
            key: 'getSpineData',
            value: function (e) {
              if (!this.spines[e]) {
                if (!this.spineSetting[e])
                  return void console.error('no spine:' + e);
                this.initSpineData(e);
              }
              return this.spines[e];
            },
          },
          {
            key: 'createSpine',
            value: function (e, t, n) {
              var r = this,
                i = this.getSpineData(e.id);
              if (!i) return new a.Object3D();
              var o = (e.classConfig || {}).id,
                s = new (
                  this.classSetting[o] || l.default.threejs.SkeletonMesh
                )(
                  i.skeleton,
                  function (n) {
                    return (
                      (n.defines = {}),
                      t &&
                        ((n.fragmentShader = t.fragmentShader),
                        (n.vertexShader = t.vertexShader),
                        (n.depthTest = t.depthTest),
                        (n.depthWrite = t.depthWrite),
                        (n.depthFunc = t.depthFunc),
                        (n.side = t.side),
                        (n.blending = t.blending),
                        (n.blendDst = t.blendDst),
                        (n.blendDstAlpha = t.blendDstAlpha),
                        (n.blendEquation = t.blendEquation),
                        (n.blendEquationAlpha = t.blendEquationAlpha),
                        (n.blendSrc = t.blendSrc),
                        (n.blendSrcAlpha = t.blendSrcAlpha),
                        (n.lights = t.lights),
                        (n.wireframe = t.wireframe),
                        (n.glslVersion = t.glslVersion),
                        Object.keys(t.uniforms).forEach(function (e) {
                          n.uniforms[e] = t.uniforms[e];
                        }),
                        Object.keys(t.defines).forEach(function (e) {
                          n.defines[e] = t.defines[e];
                        }),
                        e.twoColor && (n.defines.TWO_COLOR = 1)),
                      n
                    );
                  },
                  n
                    ? function (e) {
                        return (
                          (e.defines = {}),
                          (e.fragmentShader = n.fragmentShader),
                          (e.vertexShader = n.vertexShader),
                          (e.depthTest = n.depthTest),
                          (e.depthWrite = n.depthWrite),
                          (e.side = n.side),
                          (e.transparent = e.transparent),
                          (e.glslVersion = n.glslVersion),
                          Object.keys(n.uniforms).forEach(function (t) {
                            e.uniforms[t] = n.uniforms[t];
                          }),
                          Object.keys(n.defines).forEach(function (t) {
                            e.defines[t] = n.defines[t];
                          }),
                          e
                        );
                      }
                    : null,
                  e.maxVert,
                  e.twoColor,
                );
              ((s.playerType = 3),
                (s.userData.spineId = e.id),
                t && (s.material = t));
              try {
                (s.state.setAnimation(
                  0,
                  e.defaultAnimation ||
                    s.state.data.skeletonData.animations[0].name,
                  !e.playOnce,
                ),
                  e.skin
                    ? s.skeleton.setSkinByName(e.skin)
                    : s.skeleton &&
                      s.skeleton.data &&
                      s.skeleton.data.skins.length > 1 &&
                      s.skeleton.setSkin(s.skeleton.data.skins[1]));
              } catch (e) {
                console.error(e);
              }
              (e.trackOffset &&
                (s.state.tracks[0].trackTime += Math.random() * e.trackOffset),
                e.timeScale &&
                  (s.state.timeScale = e.timeScale * this.devSpeed),
                (s.onTick = this.defaultAnimationSetting.SPINE.bind(s)));
              var c = [
                  { name: 'event', event: 'onEvent' },
                  { name: 'start', event: 'onStart' },
                  { name: 'end', event: 'onEnd' },
                  { name: 'dispose', event: 'onDispose' },
                  { name: 'interrupted', event: 'onInterrupted' },
                  { name: 'complete', event: 'onComplete' },
                ],
                u = function (e) {
                  (s.state.removeListener(s.userData[e + 'Listener']),
                    (s.userData[e + 'Listener'] = null));
                };
              return (
                (s.playAnimation = function (e, t) {
                  var n = t || {},
                    i = n.mix,
                    o = void 0 === i ? 0.3 : i,
                    a = n.speed,
                    l = void 0 === a ? 1 : a,
                    f = n.loop,
                    d = void 0 !== f && f,
                    h = n.channel,
                    p = void 0 === h ? 0 : h,
                    m = n.overwrite,
                    v = void 0 === m || m,
                    g = n.onEvent,
                    y = void 0 === g ? null : g,
                    A = n.onStart,
                    b = void 0 === A ? null : A,
                    w = n.onEnd,
                    _ = void 0 === w ? null : w,
                    x = n.onDispose,
                    k = void 0 === x ? null : x,
                    S = n.onInterrupted,
                    E = void 0 === S ? null : S,
                    C = n.onComplete,
                    T = void 0 === C ? null : C;
                  ((s.state.data.defaultMix = o),
                    (s.state.timeScale = l * r.devSpeed),
                    (s.visible = !0));
                  var I = void 0;
                  (Array.isArray(e)
                    ? e.forEach(function (t, n) {
                        (0 === n
                          ? s.state.setAnimation(p, t, !1)
                          : s.state.addAnimation(
                              p,
                              t,
                              d && n === e.length - 1,
                              0,
                            ),
                          n === e.length - 1 && (I = t));
                      })
                    : ((I = e), s.state.setAnimation(p, e, d)),
                    c.forEach(function (e) {
                      v && s.userData[e.name + 'Listener'] && u(e.name);
                    }),
                    y &&
                      ((s.userData.eventListener = {
                        event: function (e, t) {
                          (u('event'), y(e, t));
                        },
                      }),
                      s.state.addListener(s.userData.eventListener)),
                    b &&
                      ((s.userData.startListener = {
                        start: function (e) {
                          (u('start'), b(e));
                        },
                      }),
                      s.state.addListener(s.userData.startListener)),
                    _ &&
                      ((s.userData.endListener = {
                        end: function (e) {
                          _(e);
                        },
                      }),
                      s.state.addListener(s.userData.endListener)),
                    k &&
                      ((s.userData.disposeListener = {
                        dispose: function (e) {
                          (u('dispose'), k(e));
                        },
                      }),
                      s.state.addListener(s.userData.disposeListener)),
                    E &&
                      ((s.userData.interruptedListener = {
                        interrupted: function (e) {
                          (u('interrupted'), E(e));
                        },
                      }),
                      s.state.addListener(s.userData.interruptedListener)),
                    T &&
                      ((s.userData.completeListener = {
                        complete: function (e) {
                          e.animation.name === I && (u('complete'), T(e));
                        },
                      }),
                      s.state.addListener(s.userData.completeListener)));
                }),
                s.update(0, this.uniformSetting.time.value),
                s
              );
            },
          },
          {
            key: 'createGeometry',
            value: function (e) {
              switch (e.type) {
                case 1:
                  return this.getGeometry(e.id);
                case 2:
                  var t = e.config || {},
                    n = t.width,
                    r = void 0 === n ? 100 : n,
                    i = t.height,
                    o = void 0 === i ? 100 : i,
                    s = t.widthSegments,
                    l = void 0 === s ? 1 : s,
                    c = t.heightSegments,
                    u = void 0 === c ? 1 : c,
                    f = t.cx,
                    d = void 0 === f ? 0 : f,
                    h = t.cy,
                    p = void 0 === h ? 0 : h,
                    m = t.cz,
                    v = void 0 === m ? 0 : m;
                  return new a.PlaneBufferGeometry(r, o, l, u).translate(
                    d,
                    p,
                    v,
                  );
                case 3:
                  var g = e.config || {},
                    y = g.width,
                    A = void 0 === y ? 100 : y,
                    b = g.height,
                    w = void 0 === b ? 100 : b,
                    _ = g.depth,
                    x = void 0 === _ ? 100 : _,
                    k = g.widthSegments,
                    S = void 0 === k ? 1 : k,
                    E = g.heightSegments,
                    C = void 0 === E ? 1 : E,
                    T = g.depthSegments,
                    I = void 0 === T ? 1 : T;
                  return new a.BoxBufferGeometry(A, w, x, S, C, I);
                case 4:
                  var M = e.config || {},
                    O = M.radius,
                    B = void 0 === O ? 50 : O,
                    P = M.widthSegments,
                    L = void 0 === P ? 12 : P,
                    R = M.heightSegments,
                    D = void 0 === R ? 12 : R;
                  return new a.SphereBufferGeometry(B, L, D);
                case 5:
                  var F = e.config || {},
                    j = F.radius,
                    N = void 0 === j ? 100 : j,
                    z = F.circleSegment,
                    U = void 0 === z ? 20 : z;
                  return new a.CircleGeometry(N, U);
                case 6:
                  var G = (e.config || {}).shapPointList,
                    H = void 0 === G ? [] : G,
                    Q = new a.Shape();
                  return (
                    H.forEach(function (e, t) {
                      0 === t ? Q.moveTo(e.x, e.y) : Q.lineTo(e.x, e.y);
                    }),
                    new a.ShapeGeometry(Q)
                  );
                case 7:
                  var V = e.config || {},
                    q = V.radius,
                    W = void 0 === q ? 30 : q,
                    Y = V.length,
                    X = void 0 === Y ? 100 : Y,
                    J = V.capSubdivisions,
                    K = void 0 === J ? 4 : J,
                    $ = V.radialSegments,
                    Z = void 0 === $ ? 8 : $;
                  return new a.CapsuleGeometry(W, X, K, Z);
                default:
                  return null;
              }
            },
          },
          {
            key: 'createCamera',
            value: function (e) {
              var t = void 0,
                n = e.camera || {};
              switch (n.type) {
                case 1:
                  t = new a.PerspectiveCamera(
                    n.fov || 32,
                    n.aspect || 1,
                    n.near || 0.01,
                    n.far || 1e4,
                  );
                  break;
                case 2:
                  t = new a.OrthographicCamera(
                    n.left || -100,
                    n.right || 100,
                    n.top || 100,
                    n.bottom || -100,
                    n.near || 0.01,
                    n.far || 1e4,
                  );
                  break;
                case 3:
                  t = new a.CubeCamera(
                    n.near || 0.01,
                    n.far || 1e4,
                    this.getBuffer(n.buffer),
                  );
                default:
                  throw new Error('unknown camera type:' + e.cameraType);
              }
              return t;
            },
          },
          {
            key: 'initScene',
            value: function (e, t) {
              var n = this;
              ((t.getPlayer = function () {
                return n;
              }),
                (t.playTimeline = function (e, r) {
                  return n.playTimeline(t, e, r);
                }),
                (t.stopTimeline = function (e) {
                  return n.stopTimeline(t, e);
                }),
                (t.getTimeline = function (e, r) {
                  return n.getTimeline(t, e, r);
                }),
                e.hooksFunc &&
                  e.hooksFunc.render &&
                  this.animationSetting[e.hooksFunc.render] &&
                  (t.onBeforeRender =
                    this.animationSetting[e.hooksFunc.render].bind(t)),
                e.children.forEach(function (e) {
                  n.initObject(e, t, t);
                }),
                t.children.forEach(function (e) {
                  n.finalizeObject(e);
                }),
                this.modifierObject(t, e),
                e.hooksFunc &&
                  e.hooksFunc.init &&
                  this.animationSetting[e.hooksFunc.init] &&
                  this.animationSetting[e.hooksFunc.init].apply(t, [e, this]));
            },
          },
          {
            key: 'createObject',
            value: function (t, n, r, o) {
              var s = void 0,
                l = (t.classConfig || {}).id;
              switch (t.type) {
                case 0:
                  s = new (this.classSetting[l] || a.Object3D)();
                  break;
                case 1:
                  ((s = new (this.classSetting[l] || a.Mesh)(n, r)),
                    e.buildMorph(s));
                  break;
                case 2:
                  ((s = new (this.classSetting[l] || a.SkinnedMesh)(n, r)),
                    e.buildMorph(s));
                  break;
                case 3:
                  var c = !1 !== t.setDepthMaterial ? o : null;
                  s = this.createSpine(
                    i({}, t.spine, { classConfig: t.classConfig }),
                    r,
                    c,
                  );
                  break;
                case 4:
                  var u = this.pluginSetting[t.pluginId];
                  if (u)
                    try {
                      s = u.call(this, t, r, t.userData.pluginData);
                    } catch (e) {
                      console.log(e);
                    }
                  s || (s = new a.Object3D());
                  break;
                case 5:
                  switch (t.light.type) {
                    case 1:
                      s = new a.AmbientLight(t.light.color, t.light.intensity);
                      break;
                    case 2:
                      s = new a.DirectionalLight(
                        t.light.color,
                        t.light.intensity,
                      );
                      break;
                    case 3:
                      s = new a.SpotLight(
                        t.light.color,
                        t.light.intensity,
                        t.light.distance,
                        t.light.angle,
                        t.light.penumbra,
                        t.light.decay,
                      );
                      break;
                    case 4:
                      s = new a.PointLight(
                        t.light.color,
                        t.light.intensity,
                        t.light.distance,
                        t.light.decay,
                      );
                      break;
                    default:
                      throw new Error('unknown light type:' + t.light.type);
                  }
                  t.castShadow &&
                    ((s.shadow.bias = t.light.bias),
                    (s.shadow.radius = t.light.radius),
                    (s.shadow.normalBias = t.light.normalBias),
                    s.shadow.mapSize.fromArray(t.light.mapSize));
                  break;
                case 6:
                  s = new a.Bone();
                  break;
                case 7:
                  s = this.createCamera(t);
                  break;
                case 9:
                  s = this.createText(t.text, r);
                  break;
                default:
                  ((s = new a.Object3D()), console.warn('不存在该 type'));
              }
              return (
                (s.uuid = t.uuid),
                (s.visible = t.visible),
                (s.renderOrder = t.renderOrder),
                s
              );
            },
          },
          {
            key: 'initObjectByID',
            value: function (e, t) {
              var n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : t,
                r =
                  !(arguments.length > 3 && void 0 !== arguments[3]) ||
                  arguments[3],
                i = this.exportResources[e];
              if (i) {
                var o = this.initObject(i, t, n, r);
                return (this.finalizeObject(o), o);
              }
              return null;
            },
          },
          {
            key: 'initObject',
            value: function (e, t) {
              var n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : t,
                r = this,
                i =
                  !(arguments.length > 3 && void 0 !== arguments[3]) ||
                  arguments[3],
                o = arguments[4],
                a = void 0,
                s = void 0,
                l = void 0,
                c = void 0;
              return (
                e.geometry && (s = this.createGeometry(e.geometry)),
                e.material &&
                  (l = this.getMaterial(e.material, e.type, e.geometry)),
                e.passMaterial &&
                  (c = this.getMaterial(e.passMaterial, e.type, e.geometry)),
                ((a = o || this.createObject(e, s, l, c)).scene = n),
                (a.name = e.name),
                (a.frustumCulled =
                  void 0 === e.frustumCulled || e.frustumCulled),
                (a.castShadow = !!e.castShadow),
                (a.receiveShadow = !!e.receiveShadow),
                e.material && (a.userData.colorMaterial = l),
                c &&
                  ((a.userData.passMaterial = c),
                  !1 !== e.setDepthMaterial && (a.customDepthMaterial = c)),
                e.position && a.position.fromArray(e.position),
                e.rotation && a.rotation.fromArray(e.rotation, 'XYZ'),
                e.scale && a.scale.fromArray(e.scale),
                (a.userData.initPos = a.position.clone()),
                (a.userData.initRot = a.rotation.clone()),
                (a.userData.initScl = a.scale.clone()),
                e.eventList &&
                  (e.eventList.forEach(function (e) {
                    var t = e.key,
                      n = e.funcName;
                    (r.animationSetting[n] &&
                      (a.userData[t] = r.animationSetting[n].bind(a)),
                      ('onRollOver' !== t && 'onRollOut' !== t) ||
                        a.userData.onMouseMove ||
                        (a.userData.onMouseMove = function () {}));
                  }),
                  n.clicks || (n.clicks = []),
                  -1 === n.clicks.indexOf(a) && n.clicks.push(a),
                  (a.userData.mouseEnabled = !0)),
                e.userData && Object.assign(a.userData, e.userData),
                (a.matrixAutoUpdate = void 0 !== e.autoMatrix && e.autoMatrix),
                a.matrixAutoUpdate || a.updateMatrix(),
                e.hooksFunc &&
                  e.hooksFunc.render &&
                  this.animationSetting[e.hooksFunc.render] &&
                  (a.onBeforeRender =
                    this.animationSetting[e.hooksFunc.render].bind(a)),
                e.children &&
                  i &&
                  e.children.forEach(function (e) {
                    r.initObject(e, a, n, i);
                  }),
                e.exportID && (this.exportResources[e.exportID] = e),
                1 === e.mask
                  ? ((a.onBeforeRender =
                      this.defaultAnimationSetting.DRAW_MASK),
                    (a.onAfterRender = this.defaultAnimationSetting.BEGIN_MASK))
                  : 2 === e.mask
                    ? ((a.onBeforeRender =
                        this.defaultAnimationSetting.DRAW_MASK),
                      (a.onAfterRender =
                        this.defaultAnimationSetting.BEGIN_INVERT_MASK))
                    : 3 === e.mask &&
                      (a.onAfterRender =
                        this.defaultAnimationSetting.STOP_MASK),
                t && t.add(a),
                3 !== e.type &&
                  ((a.playTimeline = function (e, t) {
                    return r.playTimeline(a, e, t);
                  }),
                  (a.stopTimeline = function (e) {
                    return r.stopTimeline(a, e);
                  }),
                  (a.getTimeline = function (e, t) {
                    return r.getTimeline(a, e, t);
                  }),
                  (a.getTexture = this.getTexture.bind(this))),
                (a.getPlayer = function () {
                  return r;
                }),
                (a.userData._initializeData = e),
                a
              );
            },
          },
          {
            key: 'modifierObject',
            value: function (e, t) {
              var n = this;
              (t.modifier &&
                t.modifier.forEach(function (r) {
                  n.modifierSetting[r.id] &&
                    n.modifierSetting[r.id].call(e, t, n, r.data);
                }),
                t.machine &&
                  t.machine.forEach(function (t) {
                    n.machineSetting[t.id] &&
                      n.machineSetting[t.id].call(e, t.data);
                  }),
                e.onInit && e.onInit());
            },
          },
          {
            key: 'finalizeObject',
            value: function (e) {
              var t = this;
              if (e.userData._initializeData) {
                e.children.forEach(function (e) {
                  t.finalizeObject(e);
                });
                var n = e.userData._initializeData,
                  r = n.hooksFunc,
                  i = n.skinning;
                if (2 === n.type)
                  try {
                    var o = this.getSkeleton(i, e.parent);
                    e.bind(o, e.matrixWorld);
                  } catch (e) {
                    throw (
                      console.log('err', e),
                      new Error('no skinning:' + i, e)
                    );
                  }
                (this.modifierObject(e, e.userData._initializeData),
                  r &&
                    r.init &&
                    this.animationSetting[r.init] &&
                    this.animationSetting[r.init].call(
                      e,
                      e.userData._initializeData,
                      this,
                    ),
                  delete e.userData._initializeData);
              }
            },
          },
          {
            key: 'getGeometry',
            value: function (e) {
              return this.geometries[e]
                ? this.geometries[e]
                : (console.error('no geometry:' + e), null);
            },
          },
          {
            key: 'removeGeometry',
            value: function (e) {
              this.geometries[e] &&
                (this.geometries[e].dispose(), delete this.geometries[e]);
            },
          },
          {
            key: 'initGeometry',
            value: function (t) {
              var n = this;
              if (!t.geometries) throw new Error('no geometries data');
              (Object.keys(t.geometries).forEach(function (r) {
                n.geometries[r] ||
                  (n.geometries[r] = e.buildGeometry(t.geometries[r]));
              }),
                t.skinning &&
                  Object.keys(t.skinning).forEach(function (e) {
                    n.skinning[e] || (n.skinning[e] = t.skinning[e]);
                  }));
            },
          },
          {
            key: 'getBone',
            value: function (e, t) {
              return (
                t.getObjectByName(e) ||
                (t.parent ? this.getBone(e, t.parent) : null)
              );
            },
          },
          {
            key: 'getSkeleton',
            value: function (e, t) {
              var n = this.skinning[e];
              if (!n) throw new Error('no skinning:' + e);
              var r = this.getBone(n.bones[0].name, t),
                i = '' + e + r.id;
              if (!this.skeletons[i]) {
                var o = [],
                  s = [];
                n.bones.forEach(function (e, t) {
                  var i = void 0;
                  (0 === t
                    ? (i = r)
                    : (i = r.getObjectByName(e.name)) ||
                      (i = r.scene.getObjectByName(e.name)),
                    o.push(i),
                    s.push(new a.Matrix4().fromArray(n.matrix[t])));
                });
                var l = new a.Skeleton(o, s);
                this.skeletons[i] = l;
              }
              return this.skeletons[i];
            },
          },
          {
            key: 'tick',
            value: function () {
              return (
                ('undefined' == typeof performance
                  ? Date.now()
                  : performance.now()) -
                  this.clock.oldTime >
                  10 &&
                ((this.uniformSetting.delta.value = Math.min(
                  this.clock.getDelta(),
                  0.03,
                )),
                (this.uniformSetting.fps.value =
                  this.uniformSetting.delta.value / 0.0167),
                (this.uniformSetting.time.value =
                  (this.uniformSetting.time.value +
                    this.uniformSetting.delta.value) %
                  1e4),
                !0)
              );
            },
          },
          {
            key: 'compile',
            value: function (e, t, n) {
              var r = [],
                i = new a.Scene();
              (e.traverse(function (e) {
                e.material &&
                  e.userData.initPos &&
                  ((e.userData.visible = e.visible),
                  (e.userData.parent = e.parent),
                  (e.userData.frustumCulled = e.frustumCulled),
                  (e.visible = !0),
                  (e.frustumCulled = !1),
                  r.push(e));
              }),
                r.forEach(function (e) {
                  i.add(e);
                }));
              var o = this.renderer.getRenderTarget();
              (this.renderer.setRenderTarget(n),
                this.renderer.render(i, t),
                this.renderer.setRenderTarget(o),
                r.forEach(function (e) {
                  ((e.frustumCulled = e.userData.frustumCulled),
                    (e.visible = e.userData.visible),
                    e.userData.parent.add(e));
                }),
                (r.length = 0));
            },
          },
          {
            key: 'compileScene',
            value: function (e) {
              var t = this.getScene(e);
              this.compile(t, t.camera, t.buffer);
            },
          },
          {
            key: 'initTouch',
            value: function (e) {
              return (
                this.mouseController ||
                  (this.mouseController = new p.default.MouseController(
                    this,
                    e,
                  )),
                this.mouseController
              );
            },
          },
          {
            key: 'disableTouch',
            value: function () {
              this.mouseController &&
                (this.mouseController.dispose(), (this.mouseController = null));
            },
          },
          {
            key: 'domElement',
            get: function () {
              return this.renderer.domElement;
            },
          },
        ],
        [
          {
            key: 'buildGeometry',
            value: function (e) {
              var t = new b[e.type || 1]();
              return (
                Object.keys(e.attributes).forEach(function (n) {
                  var r,
                    i = e.attributes[n];
                  ((r =
                    3 === i.type
                      ? new a.InterleavedBufferAttribute(
                          new a.InterleavedBuffer(
                            new Float32Array(i.array),
                            i.stride,
                          ),
                          i.itemSize,
                          i.offset,
                        )
                      : 'skinIndex' === n
                        ? new w[i.type](new Uint16Array(i.array), i.itemSize)
                        : new w[i.type](new Float32Array(i.array), i.itemSize)),
                    t.setAttribute(n, r));
                }),
                e.groups && (t.groups = e.groups),
                e.index &&
                  t.setIndex(
                    new a.BufferAttribute(
                      new (e.attributes.position.array.length > 196605
                        ? Uint32Array
                        : Uint16Array)(e.index),
                      1,
                    ),
                  ),
                e.attributes.normal || t.computeVertexNormals(),
                t
              );
            },
          },
          {
            key: 'updateGeometry',
            value: function (t, n) {
              return (
                b[n.type] !== t.constructor
                  ? (t.dispose(), (t = e.buildGeometry(n)))
                  : (n.groups && (t.groups = n.groups),
                    Object.keys(n.attributes).forEach(function (e) {
                      var r = n.attributes[e],
                        i = t.attributes[e];
                      ((i.array = new Float32Array(r.array)),
                        (i.itemSize = r.itemSize),
                        (i.count = r.array.length / r.itemSize),
                        (i.needsUpdate = !0));
                    }),
                    (t.index.array = new (
                      n.attributes.position.array.length > 196605
                        ? Uint32Array
                        : Uint16Array
                    )(n.index)),
                    (t.index.count = t.index.array.length),
                    (t.index.needsUpdate = !0)),
                t
              );
            },
          },
        ],
      ),
      e
    );
  })()));
export { THREEPlayer };
