// Extracted rendering module: blur-pass. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_buffer_size from './buffer-size.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r = dependency_three,
  i = dependency_buffer_size;
defaultExport = function e() {
  !(function (e, t) {
    if (!(e instanceof t))
      throw new TypeError('Cannot call a class as a function');
  })(this, e);
  var t = new r.ShaderMaterial({
      vertexShader:
        '\n        void main() {\n          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n        }',
      fragmentShader:
        '\n        uniform vec2 resolution;\n        uniform vec2 uvScale;\n        uniform sampler2D diffuse;\n        uniform mat3 convolutionKernel;\n        uniform vec2 blur;\n        uniform float angle;\n        vec4 convolutionAvg(sampler2D tex, vec2 uv, vec2 pixelOffset, float rotate, mat3 kernel,  float lod) {\n          vec4 sum = vec4(0.0);\n          vec2 uvOffset = pixelOffset;\n          const float pi_4 = 0.7853981633974483;\n          float kernelCount = 0.0;\n          if (kernel[1][1] != 0.0) { kernelCount += abs(kernel[1][1]); sum += texture2D(tex, uv, lod) * kernel[1][1]; }\n          if (kernel[1][2] != 0.0) { kernelCount += abs(kernel[1][2]); sum += texture2D(tex, uv + vec2(cos(rotate), sin(rotate)) * uvOffset, lod) * kernel[1][2]; }\n          if (kernel[2][2] != 0.0) { kernelCount += abs(kernel[2][2]); sum += texture2D(tex, uv + vec2(cos(rotate + pi_4), sin(rotate + pi_4)) * uvOffset, lod) * kernel[2][2]; }\n          if (kernel[2][1] != 0.0) { kernelCount += abs(kernel[2][1]); sum += texture2D(tex, uv + vec2(cos(rotate + pi_4 * 2.), sin(rotate + pi_4 * 2.)) * uvOffset, lod) * kernel[2][1]; }\n          if (kernel[2][0] != 0.0) { kernelCount += abs(kernel[2][0]); sum += texture2D(tex, uv + vec2(cos(rotate + pi_4 * 3.), sin(rotate + pi_4 * 3.)) * uvOffset, lod) * kernel[2][0]; }\n          if (kernel[1][0] != 0.0) { kernelCount += abs(kernel[1][0]); sum += texture2D(tex, uv + vec2(cos(rotate + pi_4 * 4.), sin(rotate + pi_4 * 4.)) * uvOffset, lod) * kernel[1][0]; }\n          if (kernel[0][0] != 0.0) { kernelCount += abs(kernel[0][0]); sum += texture2D(tex, uv + vec2(cos(rotate + pi_4 * 5.), sin(rotate + pi_4 * 5.)) * uvOffset, lod) * kernel[0][0]; }\n          if (kernel[0][1] != 0.0) { kernelCount += abs(kernel[0][1]); sum += texture2D(tex, uv + vec2(cos(rotate + pi_4 * 6.), sin(rotate + pi_4 * 6.)) * uvOffset, lod) * kernel[0][1]; }\n          if (kernel[0][2] != 0.0) { kernelCount += abs(kernel[0][2]); sum += texture2D(tex, uv + vec2(cos(rotate + pi_4 * 7.), sin(rotate + pi_4 * 7.)) * uvOffset, lod) * kernel[0][2]; }\n          if (kernelCount != 0.0) { sum /= kernelCount; }\n          return sum;\n        }\n        void main() {  \n          vec2 uv = gl_FragCoord.xy / resolution;\n          uv = (uv - .5) * uvScale + .5;\n          if (length(blur) < 1e-5) {\n            gl_FragColor = texture2D(diffuse, uv);\n            return;\n          }\n          float lod = pow((blur.x + blur.y) / 2., .5);\n          // float lod = pow(min(blur.x, blur.y), .2);\n          // float lod = pow(min(blur.x, blur.y),.5);\n          // lod = 0.;\n          // vec2 blurOffset = min(vec2(10000.), blur / 10.) / resolution;\n          vec2 blurOffset = blur / resolution;\n          gl_FragColor = convolutionAvg(diffuse, uv, blurOffset, angle, convolutionKernel, lod);\n        }',
      depthTest: !1,
      depthWrite: !1,
      transparent: !1,
      uniforms: {
        diffuse: { value: null, type: 't' },
        resolution: { value: new r.Vector2(), type: 'v2' },
        blur: { value: new r.Vector2() },
        uvScale: { value: new r.Vector2(1, 1), type: 'v2' },
        angle: { value: 0, type: 'f' },
        convolutionKernel: {
          value: new r.Matrix3().set(0, 0, 0, 0, 1, 0, 0, 0, 0),
          type: 'm3',
        },
      },
    }),
    n = new r.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    o = new r.Scene(),
    a = new r.PlaneBufferGeometry(2, 2),
    s = new r.Mesh(a, t);
  ((s.matrixAutoUpdate = !0),
    o.add(s),
    (o.matrixAutoUpdate = !0),
    (o.autoUpdate = !1));
  var l = new r.Vector2(),
    c = 0,
    u = 2,
    f = 2,
    d = {
      minFilter: r.LinearMipMapLinearFilter,
      magFilter: r.LinearFilter,
      depthBuffer: !1,
      stencilBuffer: !1,
      generaterMipmaps: !0,
    },
    h = [new r.WebGLRenderTarget(2, 2, d), new r.WebGLRenderTarget(2, 2, d)];
  this.render = function (e, r, d, p, m, v, g) {
    var y = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : n,
      A = !(arguments.length > 8 && void 0 !== arguments[8]) || arguments[8];
    p && (0, i.resizeBuffer)(r, d);
    var b = d || r,
      w = b.width,
      _ = b.height,
      x = w,
      k = _,
      S = 2;
    if (
      (A &&
        (m >= 4 || v >= 4) &&
        ((w = Math.floor(w / 2)), (_ = Math.floor(_ / 2)), (S = 0.85)),
      u !== w || f !== _)
    ) {
      var E = Math.pow(2, Math.floor(Math.log(w) / Math.LN2)),
        C = Math.pow(2, Math.floor(Math.log(_) / Math.LN2));
      (h[0].setSize(E, C),
        h[1].setSize(E, C),
        (h[0].texture.generateMipmaps = !0),
        (h[1].texture.generateMipmaps = !0),
        l.set(E, C),
        (u = w),
        (f = _));
    }
    g
      ? ((s.geometry = g.geometry),
        s.matrix.equals(g.matrixWorld) ||
          (g.matrixWorld.decompose(s.position, s.quaternion, s.scale),
          s.updateMatrixWorld()))
      : s.geometry !== a &&
        ((s.geometry = a),
        s.position.set(0, 0, 0),
        s.rotation.set(0, 0, 0),
        s.scale.set(1, 1, 1),
        s.updateMatrixWorld());
    var T = m,
      I = v;
    ((T = ((T * l.x) / w / 16) * S), (I = ((I * l.y) / _ / 16) * S));
    var M = 1 + 200 * Math.pow(T / 200, 2),
      O = 1 + 200 * Math.pow(I / 200, 2);
    ((T = 200 * Math.pow(T / 200, 0.8)),
      (I = 200 * Math.pow(I / 200, 0.8)),
      (T *= 3),
      (I *= 3));
    var B = e.getRenderTarget();
    (t.uniforms.blur.value.set(0, 0),
      t.uniforms.uvScale.value.set(1, 1),
      t.uniforms.resolution.value.copy(l),
      (t.uniforms.diffuse.value = r.texture),
      e.setRenderTarget(h[c]),
      e.clear(),
      e.render(o, y),
      t.uniforms.blur.value.set(T, I),
      t.uniforms.uvScale.value.set(M, O),
      t.uniforms.convolutionKernel.value.set(0, 1, 0, 0, 0, 0, 1, 0, 1),
      t.uniforms.resolution.value.copy(l),
      (t.uniforms.diffuse.value = h[c].texture),
      (t.uniforms.angle.value = 0),
      (c = 1 - c),
      e.setRenderTarget(h[c]),
      e.clear(),
      e.render(o, y),
      t.uniforms.blur.value.set(T, I),
      t.uniforms.uvScale.value.set(1 / M, 1 / O),
      t.uniforms.convolutionKernel.value.set(1, 0, 1, 0, 0, 0, 0, 1, 0),
      t.uniforms.resolution.value.set(x, k),
      (t.uniforms.diffuse.value = h[c].texture),
      (c = 1 - c),
      e.setRenderTarget(d),
      e.clear(),
      e.render(o, y),
      e.setRenderTarget(B));
  };
};
export { defaultExport as default };
