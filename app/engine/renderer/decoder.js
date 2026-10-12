// Extracted rendering module: decoder. See ../PROVENANCE.md.
import { THREE as dependency_three } from '../vendor/libraries.js';
import * as dependency_binary_types from './binary-types.js';
export const __esModule = true;
let defaultExport;
('use strict');
void 0;
var r,
  i = (function () {
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
  o = dependency_three,
  a = (r = dependency_binary_types) && r.__esModule ? r : { default: r },
  s = (function () {
    function e() {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e);
    }
    return (
      i(e, null, [
        {
          key: 'parseObject',
          value: function (t, n) {
            for (var r = t.getUint16(n, !0), i = {}, o = 2, a = 0; a < r; a++) {
              var s = e.parseBlock(t, n + o);
              o += s.length;
              var l = e.parseBlock(t, n + o);
              ((o += l.length), (i[s.data] = l.data));
            }
            return { length: o, data: i };
          },
        },
        {
          key: 'parseString',
          value: function (e, t) {
            var n = e.getUint32(t, !0);
            return {
              data: o.LoaderUtils.decodeText(
                new Uint8Array(e.buffer, t + 4, n),
              ),
              length: n + 4,
            };
          },
        },
        {
          key: 'parseUint16Array',
          value: function (e, t) {
            var n = e.getUint32(t, !0),
              r = t + 4,
              i = t + 4 + 2 * n;
            return {
              data: new Uint16Array(e.buffer.slice(r, i)),
              length: 2 * n + 4,
            };
          },
        },
        {
          key: 'parseUint32Array',
          value: function (e, t) {
            var n = e.getUint32(t, !0),
              r = t + 4,
              i = t + 4 + 4 * n;
            return {
              data: new Uint32Array(e.buffer.slice(r, i)),
              length: 4 * n + 4,
            };
          },
        },
        {
          key: 'parseFloat32Array',
          value: function (e, t) {
            var n = e.getUint32(t, !0),
              r = t + 4,
              i = t + 4 + 4 * n;
            return {
              data: new Float32Array(e.buffer.slice(r, i)),
              length: 4 * n + 4,
            };
          },
        },
        {
          key: 'parseArray',
          value: function (t, n) {
            for (var r = t.getUint16(n, !0), i = [], o = 2, a = 0; a < r; a++) {
              var s = e.parseBlock(t, n + o);
              ((o += s.length), i.push(s.data));
            }
            return { data: i, length: o };
          },
        },
        {
          key: 'parseBlock',
          value: function (t) {
            var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 0,
              r = t.getUint8(n, !0),
              i = 1,
              o = void 0;
            switch (r) {
              case a.default.DATA_TYPE_FALSE:
                o = !1;
                break;
              case a.default.DATA_TYPE_TRUE:
                o = !0;
                break;
              case a.default.DATA_TYPE_UINT8:
                ((o = t.getUint8(n + 1, !0)), (i += 1));
                break;
              case a.default.DATA_TYPE_UINT16:
                ((o = t.getUint16(n + 1, !0)), (i += 2));
                break;
              case a.default.DATA_TYPE_UINT32:
                ((o = t.getUint32(n + 1, !0)), (i += 4));
                break;
              case a.default.DATA_TYPE_NUINT8:
                ((o = -t.getUint8(n + 1, !0)), (i += 1));
                break;
              case a.default.DATA_TYPE_NUINT16:
                ((o = -t.getUint16(n + 1, !0)), (i += 2));
                break;
              case a.default.DATA_TYPE_NUINT32:
                ((o = -t.getUint32(n + 1, !0)), (i += 4));
                break;
              case a.default.DATA_TYPE_FLOAT32:
                ((o = t.getFloat32(n + 1, !0)), (i += 4));
                break;
              case a.default.DATA_TYPE_STRING:
                var s = e.parseString(t, n + 1);
                ((o = s.data), (i += s.length));
                break;
              case a.default.DATA_TYPE_UINT16_ARRAY:
                var l = e.parseUint16Array(t, n + 1);
                ((o = l.data), (i += l.length));
                break;
              case a.default.DATA_TYPE_UINT32_ARRAY:
                var c = e.parseUint32Array(t, n + 1);
                ((o = c.data), (i += c.length));
                break;
              case a.default.DATA_TYPE_FLOAT32_ARRAY:
                var u = e.parseFloat32Array(t, n + 1);
                ((o = u.data), (i += u.length));
                break;
              case a.default.DATA_TYPE_OBJECT:
                var f = e.parseObject(t, n + 1);
                ((o = f.data), (i += f.length));
                break;
              case a.default.DATA_TYPE_ARRAY:
                var d = e.parseArray(t, n + 1);
                ((o = d.data), (i += d.length));
            }
            return { length: i, type: r, data: o };
          },
        },
        {
          key: 'parse',
          value: function (t) {
            return e.parseBlock(new DataView(t)).data;
          },
        },
      ]),
      e
    );
  })();
defaultExport = { Decoder: s };
export { defaultExport as default };
