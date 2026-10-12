// Extracted rendering module: base-timeline. See ../PROVENANCE.md.

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
  i = (function () {
    function e(t) {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e);
      var n = t || {},
        r = n.type,
        i = void 0 === r ? 1 : r,
        o = n.start,
        a = void 0 === o ? 0 : o,
        s = n.end,
        l = void 0 === s ? 0 : s,
        c = n.loop,
        u = void 0 !== c && c,
        f = n.weight,
        d = void 0 === f ? 1 : f,
        h = n.name,
        p = void 0 === h ? '' : h;
      ((this.type = i),
        (this.start = a),
        (this.end = l),
        (this.name = p),
        (this.loop = u),
        (this.weight = d));
    }
    return (
      r(e, [
        {
          key: 'seek',
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : this.time;
            ((this.time = e), this.update(e, e, 1));
          },
        },
        {
          key: 'toJSON',
          value: function () {
            return {
              type: this.type,
              start: this.start,
              name: this.name,
              loop: this.loop,
            };
          },
        },
        {
          key: 'rootClip',
          get: function () {
            for (var e = this.parent; e;) {
              if (!e.parent) return e;
              e = e.parent;
            }
            return this;
          },
        },
        {
          key: 'realStartTime',
          get: function () {
            for (var e = this.start, t = this.parent; t;)
              ((e += t.start), (t = t.parent));
            return e;
          },
        },
      ]),
      e
    );
  })();
defaultExport = i;
export { defaultExport as default };
