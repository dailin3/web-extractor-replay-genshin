// Extracted rendering module: mouse-controller. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_hit_test from './hit-test.js';
import * as dependency_browser from './browser.js';
import * as dependency_mouse_proxy from './mouse-proxy.js';
import * as dependency_mouse_uniforms from './mouse-uniforms.js';
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
  i = dependency_three,
  o = dependency_browser,
  a = dependency_hit_test,
  s = dependency_mouse_proxy,
  l = dependency_mouse_uniforms;
function c(e) {
  return e && e.__esModule ? e : { default: e };
}
var u = (function () {
  function e(t, n) {
    var r = t.domElement,
      a = t.uniformSetting;
    !(function (e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    })(this, e);
    var s = n || {},
      l = s.type,
      c = void 0 === l ? void 0 : l,
      u = s.mouseEnableMoveCheck,
      f = void 0 !== u && u,
      d = s.clickOnly,
      h = void 0 !== d && d;
    if (
      ((this.uniformSetting = a),
      (this.uniformSetting.mouse &&
        this.uniformSetting.mouse.value &&
        this.uniformSetting.mouse.value.isVector4) ||
        (this.uniformSetting.mouse = { value: new i.Vector4(0, 0, 1, 1) }),
      (this.processes = []),
      (this.mouseMoved = !1),
      (this.mouseEnabled = !0),
      (this.mouseDown = !1),
      (this.mouseNeedsRefresh = !1),
      (this.mouseEnableMoveCheck = f),
      (this.mouseCurrent = new i.Vector4()),
      (this.onDomMouseMoveScoped = this.onDomMouseMove.bind(this)),
      (this.onDomMouseDownScoped = this.onDomMouseDown.bind(this)),
      (this.onDomMouseUpScoped = this.onDomMouseUp.bind(this)),
      (this.onDomTouchStartScoped = this.onDomTouchStart.bind(this)),
      (this.onDomTouchMoveScoped = this.onDomTouchMove.bind(this)),
      (this.onDomTouchEndScoped = this.onDomTouchEnd.bind(this)),
      (this.onDomMouseWheelScoped = this.onDomMouseWheel.bind(this)),
      (this.onDomClickScoped = this.onDomClick.bind(this)),
      h)
    )
      r.addEventListener('click', this.onDomClickScoped);
    else {
      var p = o.default.getInstance().desktop();
      'pc' === c || (!c && p)
        ? (r.addEventListener('mousemove', this.onDomMouseMoveScoped),
          r.addEventListener('mousedown', this.onDomMouseDownScoped),
          r.addEventListener('mouseup', this.onDomMouseUpScoped),
          r.addEventListener('mouseout', this.onDomMouseUpScoped))
        : (r.addEventListener('touchstart', this.onDomTouchStartScoped, {
            passive: !1,
          }),
          r.addEventListener('touchmove', this.onDomTouchMoveScoped, {
            passive: !1,
          }),
          r.addEventListener('touchend', this.onDomTouchEndScoped));
    }
    (r.addEventListener('mousewheel', this.onDomMouseWheelScoped),
      (this.domElement = r));
  }
  return (
    r(e, [
      {
        key: 'disableMouse',
        value: function () {
          ((this.mouseDisabled = !0), (this.mouseEnabled = !1));
        },
      },
      {
        key: 'enableMouse',
        value: function () {
          ((this.mouseDisabled = !1), (this.mouseEnabled = !0));
        },
      },
      {
        key: 'lockMouse',
        value: function () {
          this.mouseEnabled = !1;
        },
      },
      {
        key: 'freeMouse',
        value: function () {
          this.mouseDisabled || (this.mouseEnabled = !0);
        },
      },
      {
        key: 'dispose',
        value: function () {
          for (
            this.domElement.removeEventListener(
              'touchstart',
              this.onDomTouchStartScoped,
            ),
              this.domElement.removeEventListener(
                'touchmove',
                this.onDomTouchMoveScoped,
              ),
              this.domElement.removeEventListener(
                'touchend',
                this.onDomTouchEndScoped,
              ),
              this.domElement.removeEventListener(
                'mousedown',
                this.onDomMouseDownScoped,
              ),
              this.domElement.removeEventListener(
                'mousemove',
                this.onDomMouseMoveScoped,
              ),
              this.domElement.removeEventListener(
                'mouseup',
                this.onDomMouseUpScoped,
              ),
              this.domElement.removeEventListener(
                'mouseout',
                this.onDomMouseUpScoped,
              ),
              this.domElement.removeEventListener(
                'mousewheel',
                this.onDomMouseWheelScoped,
              ),
              this.domElement.removeEventListener(
                'click',
                this.onDomClickScoped,
              ),
              this.mouseCheckScene = null,
              this.mouseCheckCamera = null;
            this.processes.length;
          )
            this.processes.pop().dispose();
        },
      },
      {
        key: 'add',
        value: function (e, t) {
          var n = this.find(e, t);
          return (
            n ||
              ((n = new s.default(this.domElement, e, t)),
              this.processes.push(n)),
            n
          );
        },
      },
      {
        key: 'remove',
        value: function (e, t) {
          var n = a.default.hashUUID(e, t);
          return (
            (this.processes = this.processes.filter(function (e) {
              return e.uuid !== n;
            })),
            this
          );
        },
      },
      {
        key: 'find',
        value: function (e, t) {
          var n = a.default.hashUUID(e, t);
          return this.processes.find(function (e) {
            return e.uuid === n;
          });
        },
      },
      {
        key: 'updateMouseUniform',
        value: function (e, t) {
          var n = a.default.getMouseXYByRect(e, t),
            r = n.offsetX,
            i = n.offsetY,
            o = n.width,
            s = n.height;
          this.uniformSetting.rotate
            ? this.mouseCurrent.set(i, r, s, o)
            : this.mouseCurrent.set(r, i, o, s);
        },
      },
      {
        key: 'onDomMouseWheel',
        value: function (e) {
          if (
            (this.updateMouseUniform(e),
            this.uniformSetting.mouse.value.copy(this.mouseCurrent),
            (this.uniformSetting.mouseDelta.value.z = 0.05 * e.deltaY),
            this.mouseEnabled)
          ) {
            var t = this.calcRayPoint();
            (this.processes.forEach(function (n) {
              n.checkSceneClick(t, 'onMouseWheel', e);
            }),
              l.default.dispatchEvent({ type: 'MOUSE_WHEEL' }));
          }
        },
      },
      {
        key: 'onDomMouseMove',
        value: function (e) {
          if (
            (this.mouseDown || this.mouseEnableMoveCheck) &&
            (this.updateMouseUniform(e),
            this.uniformSetting.mouseDelta.value.set(
              0.5 * (this.mouseCurrent.x - this.uniformSetting.mouse.value.x),
              0.5 * (this.mouseCurrent.y - this.uniformSetting.mouse.value.y),
              0,
            ),
            this.uniformSetting.mouse.value.copy(this.mouseCurrent),
            Math.abs(this.uniformSetting.mouseDelta.value.x) +
              Math.abs(this.uniformSetting.mouseDelta.value.y) >
              4 && (this.mouseMoved = !0),
            this.mouseEnabled)
          ) {
            var t = this.calcRayPoint();
            (this.processes.forEach(function (n) {
              n.checkSceneClick(t, 'onMouseMove', e);
            }),
              l.default.dispatchEvent({ type: 'MOUSE_MOVE' }));
          }
        },
      },
      {
        key: 'onDomMouseDown',
        value: function (e) {
          if (this.mouseEnabled) {
            (this.updateMouseUniform(e),
              this.uniformSetting.mouse.value.copy(this.mouseCurrent),
              this.uniformSetting.mouseDelta.value.set(0, 0, 0),
              (this.mouseMoved = !1),
              (this.mouseNeedsRefresh = !1),
              (this.mouseDown = !0));
            var t = this.calcRayPoint();
            (this.processes.forEach(function (n) {
              n.checkSceneClick(t, 'onMouseDown', e);
            }),
              l.default.dispatchEvent({ type: 'MOUSE_DOWN' }));
          }
        },
      },
      {
        key: 'onDomMouseUp',
        value: function (e) {
          var t = this;
          if (
            (this.uniformSetting.mouseDelta.value.set(0, 0, 0),
            (this.mouseDown = !1),
            this.mouseEnabled && !this.mouseNeedsRefresh)
          ) {
            var n = this.calcRayPoint();
            (this.processes.forEach(function (r) {
              (r.checkSceneClick(n, 'onMouseUp', e),
                t.mouseMoved ||
                  (r.checkSceneClick(n, 'onClick', e),
                  l.default.dispatchEvent({ type: 'MOUSE_CLICK' })));
            }),
              l.default.dispatchEvent({ type: 'MOUSE_UP' }),
              (this.mouseNeedsRefresh = !0));
          }
        },
      },
      {
        key: 'onDomClick',
        value: function (e) {
          if (this.mouseEnabled) {
            (this.updateMouseUniform(e),
              this.uniformSetting.mouse.value.copy(this.mouseCurrent),
              this.uniformSetting.mouseDelta.value.set(0, 0, 0),
              (this.mouseMoved = !1),
              (this.mouseNeedsRefresh = !1),
              (this.mouseDown = !1));
            var t = this.calcRayPoint();
            (this.processes.forEach(function (n) {
              n.checkSceneClick(t, 'onClick', e);
            }),
              l.default.dispatchEvent({ type: 'MOUSE_CLICK' }));
          }
        },
      },
      {
        key: 'onDomTouchEnd',
        value: function (e) {
          var t = this;
          if (
            (this.uniformSetting.mouseDelta.value.set(0, 0, 0),
            this.mouseEnabled && !this.mouseNeedsRefresh)
          ) {
            var n = this.calcRayPoint();
            (this.processes.forEach(function (r) {
              (r.checkSceneClick(n, 'onMouseUp', e),
                t.mouseMoved ||
                  (r.checkSceneClick(n, 'onClick', e),
                  l.default.dispatchEvent({ type: 'MOUSE_CLICK' })));
            }),
              l.default.dispatchEvent({ type: 'MOUSE_UP' }),
              (this.mouseNeedsRefresh = !0));
          }
        },
      },
      {
        key: 'onDomTouchMove',
        value: function (e) {
          if (
            (e.preventDefault(),
            this.updateMouseUniform(e, !0),
            this.uniformSetting.mouseDelta.value.set(
              this.mouseCurrent.x - this.uniformSetting.mouse.value.x,
              this.mouseCurrent.y - this.uniformSetting.mouse.value.y,
              0,
            ),
            this.uniformSetting.mouse.value.copy(this.mouseCurrent),
            this.mouseEnabled)
          ) {
            Math.abs(this.uniformSetting.mouseDelta.value.x) +
              Math.abs(this.uniformSetting.mouseDelta.value.y) >
              10 && (this.mouseMoved = !0);
            var t = this.calcRayPoint();
            (this.processes.forEach(function (n) {
              n.checkSceneClick(t, 'onMouseMove', e);
            }),
              l.default.dispatchEvent({ type: 'MOUSE_MOVE' }));
          }
        },
      },
      {
        key: 'onDomTouchStart',
        value: function (e) {
          if ((e.preventDefault(), this.mouseEnabled)) {
            (this.updateMouseUniform(e, !0),
              this.uniformSetting.mouse.value.copy(this.mouseCurrent),
              (this.mouseMoved = !1),
              (this.mouseNeedsRefresh = !1));
            var t = this.calcRayPoint();
            (this.processes.forEach(function (n) {
              n.checkSceneClick(t, 'onMouseDown', e);
            }),
              l.default.dispatchEvent({ type: 'MOUSE_DOWN' }));
          }
        },
      },
      {
        key: 'calcRayPoint',
        value: function () {
          var e = this.uniformSetting.mouse.value,
            t = e.x,
            n = e.y,
            r = e.z,
            o = e.w;
          return this.uniformSetting.rotate
            ? new i.Vector2((t / r) * 2 - 1, (n / o) * 2 - 1)
            : new i.Vector2((t / r) * 2 - 1, (-n / o) * 2 + 1);
        },
      },
      {
        key: 'isMouseFree',
        get: function () {
          return this.mouseEnabled;
        },
      },
    ]),
    e
  );
})();
defaultExport = u;
export { defaultExport as default };
