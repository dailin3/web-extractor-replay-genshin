// Extracted rendering module: cue. See ../PROVENANCE.md.

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
        r = n.frame,
        i = void 0 === r ? 0 : r,
        o = n.method,
        a = void 0 === o ? '' : o,
        s = n.root,
        l = void 0 === s ? {} : s,
        c = n.methods,
        u = void 0 === c ? {} : c;
      ((this.frame = i),
        (this.method = a),
        (this.fired = !1),
        (this.prevTime = i + 1));
      var f = (function (e, t) {
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
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance',
          );
        })(a.split('?'), 2),
        d = f[0],
        h = f[1],
        p = u[d] || l[d];
      p
        ? ((this.cueFunc = p.bind(l)), (this.cueParam = h))
        : console.error('method:' + d + ' is undefined');
    }
    return (
      r(e, [
        {
          key: 'update',
          value: function (e, t) {
            (!this.fired &&
              this.prevTime <= this.frame &&
              t >= this.frame &&
              ((this.fired = !0), this.cueFunc && this.cueFunc(this.cueParam)),
              (this.prevTime = t));
          },
        },
        {
          key: 'reset',
          value: function () {
            ((this.prevTime = this.frame + 1), (this.fired = !1));
          },
        },
        {
          key: 'toJSON',
          value: function () {
            return { frame: this.frame, method: this.method };
          },
        },
      ]),
      e
    );
  })();
defaultExport = i;
export { defaultExport as default };
