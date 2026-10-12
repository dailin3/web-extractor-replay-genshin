// Extracted rendering module: copy-pass. See ../PROVENANCE.md.
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
        'varying vec2 vUv;\nvoid main(){\nvUv=uv;\ngl_Position=vec4(position,1.);\n}',
      fragmentShader:
        'varying vec2 vUv;\nuniform sampler2D diffuse;\nvoid main(){gl_FragColor=texture2D(diffuse,vUv);}',
      depthTest: !1,
      depthWrite: !1,
      transparent: !1,
      uniforms: { diffuse: { value: null, type: 't' } },
    }),
    n = new r.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    o = new r.Scene(),
    a = new r.Mesh(new r.PlaneBufferGeometry(2, 2), t);
  (o.add(a),
    (o.autoUpdate = !1),
    (this.render = function (e, r, a, s) {
      var l = e.getRenderTarget();
      (e.setRenderTarget(a),
        e.clear(),
        s && (0, i.resizeBuffer)(r, a),
        (t.uniforms.diffuse.value = r.texture),
        e.render(o, n),
        e.setRenderTarget(l));
    }));
};
export { defaultExport as default };
