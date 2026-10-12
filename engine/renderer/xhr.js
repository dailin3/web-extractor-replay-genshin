// Extracted rendering module: xhr. See ../PROVENANCE.md.

export const __esModule = true;
let defaultExport;
('use strict');
function r(e, t) {
  var n = e.response ? e.response : e.responseText;
  return (
    'string' == typeof n && 'json' === t.responseType && (n = JSON.parse(n)),
    n
  );
}
(void 0,
  (defaultExport = function (e) {
    var t = e.method,
      n = void 0 === t ? 'get' : t,
      i = e.url,
      o = void 0 === i ? '' : i,
      a = e.responseType,
      s = void 0 === a ? 'text' : a,
      l = e.data,
      c = void 0 === l ? {} : l,
      u = (e.baseURL, e.timeout, e.onDownloadProgress),
      f = void 0 === u ? function () {} : u,
      d = (function () {
        var e = !1;
        try {
          e = new XMLHttpRequest();
        } catch (t) {
          try {
            e = new ActiveXObject('Microsoft.XMLHTTP');
          } catch (t) {
            try {
              e = new ActiveXobject('Microsoft.XMLHTTP');
            } catch (t) {
              e = !1;
            }
          }
        }
        return e;
      })();
    return new Promise(
      d
        ? function (e, t) {
            var i = !1,
              a = 0;
            ((d.onprogress = function (e) {
              ((i = e.lengthComputable),
                f(e, i, (e.loaded - a) / e.total),
                (a = e.loaded));
            }),
              d.open(n, o),
              (d.responseType = s),
              (d.onreadystatechange = function (n) {
                4 === d.readyState &&
                  (200 === d.status
                    ? e({
                        lengthComputable: i,
                        data: r(d, { responseType: s }),
                      })
                    : t(d.statusText));
              }),
              d.send(c));
          }
        : function (e, t) {
            t(new Error('您的浏览器不支持XHR'));
          },
    );
  }));
export { defaultExport as default };
