// Extracted rendering module: audio-manager. See ../PROVENANCE.md.
import { howlerLibrary as dependency_howler } from '../vendor/libraries.js';
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
  i = dependency_howler,
  o = (function () {
    function e() {
      var t = this,
        n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function');
      })(this, e);
      var r = n.list,
        i = void 0 === r ? [] : r,
        o = n.currentPlayId,
        a = n.muted,
        s = void 0 !== a && a;
      ((this.sounds = {}),
        (this.currentPlayId = o),
        (this.muted = s),
        (this.spriteMap = {}),
        i.forEach(function (e) {
          t.addSound(e);
        }),
        this.initBrowserVisibleEvent(),
        this.initClickHtml5AudioPlay(),
        this.setCurrentPlayAudio());
    }
    return (
      r(e, null, [
        {
          key: 'getSpriteId',
          value: function (e, t) {
            return (
              e._sounds.find(function (e) {
                return e._sprite === t;
              }) || {}
            )._id;
          },
        },
      ]),
      r(e, [
        {
          key: 'addSound',
          value: function (e) {
            var t = this,
              n = e.id,
              r = e.src,
              o = e.volume,
              a = void 0 === o ? 1 : o,
              s = e.html5,
              l = void 0 !== s && s,
              c = e.loop,
              u = void 0 !== c && c,
              f = e.preload,
              d = void 0 === f || f,
              h = e.autoplay,
              p = void 0 !== h && h,
              m = e.rate,
              v = void 0 === m ? 1 : m,
              g = e.fade,
              y = void 0 === g ? 0 : g,
              A = e.overwrite,
              b = void 0 === A || A,
              w = e.sprite,
              _ = void 0 === w ? {} : w;
            (!b && this.sounds[n]) ||
              ((this.sounds[n] = new i.Howl({
                src: r,
                volume: a,
                html5: l,
                loop: u,
                preload: d,
                autoplay: p,
                rate: v,
                sprite: _,
              })),
              (this.sounds[n]._id = n),
              (this.sounds[n]._initVolume = a),
              (this.sounds[n]._initFade = y),
              this.muted && this.sounds[n].mute(!0),
              Object.keys(_).forEach(function (e) {
                t.spriteMap[e] = n;
              }));
          },
        },
        {
          key: 'setMuted',
          value: function (e) {
            e ? this.setAllMute() : this.resumeAllMute();
          },
        },
        {
          key: 'setAllMute',
          value: function () {
            this.muted ||
              ((this.muted = !0),
              this.soundList.forEach(function (e) {
                e.mute(!0);
              }));
          },
        },
        {
          key: 'resumeAllMute',
          value: function () {
            this.muted &&
              ((this.muted = !1),
              this.soundList.forEach(function (e) {
                e.mute(!1);
              }));
          },
        },
        {
          key: 'setCurrentPlayAudio',
          value: function (e) {
            this.sounds[e] &&
              (this.currentPlayAudio && this.currentPlayAudio.stop(),
              (this.currentPlayId = e),
              this.playSound(this.currentPlayAudio._id));
          },
        },
        {
          key: 'initClickHtml5AudioPlay',
          value: function () {
            var e = this;
            this.currentPlayAudio &&
              !this.currentPlayAudio.playing() &&
              window.addEventListener(
                'click',
                function t() {
                  (window.requestAnimationFrame(function () {
                    e.playSound(e.currentPlayAudio._id);
                  }),
                    window.removeEventListener('click', t, !0));
                },
                !0,
              );
          },
        },
        {
          key: 'initBrowserVisibleEvent',
          value: function () {
            var e = this;
            document.addEventListener('visibilitychange', function () {
              'visible' === document.visibilityState
                ? e.resumeAll()
                : e.pauseAll();
            });
          },
        },
        {
          key: 'playSound',
          value: function (e) {
            var t = this,
              n =
                this.sounds[e] ||
                (this.spriteMap[e] && this.sounds[this.spriteMap[e]]),
              r = !this.sounds[e] && this.spriteMap[e];
            if (!n) return (console.warn('no sound: ' + e), null);
            var i = function () {
              var i = r ? n.play(e) : n.play();
              (!t.muted &&
                n._initFade &&
                n.fade(0, n._initVolume, n._initFade, i),
                n.once(
                  'fade',
                  function () {
                    n._volume = n._initVolume;
                  },
                  i,
                ));
            };
            return 'loaded' === n.state()
              ? (i(), n)
              : (n.once('load', i), n.load(), n);
          },
        },
        {
          key: 'pauseSound',
          value: function (t) {
            var n =
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              r =
                this.sounds[t] ||
                (this.spriteMap[t] && this.sounds[this.spriteMap[t]]);
            if (r) {
              var i = e.getSpriteId(r, t);
              return (
                n
                  ? (r.fade(r._volume, 0, r._initFade, i),
                    r.once(
                      'fade',
                      function () {
                        r.pause(i);
                      },
                      i,
                    ))
                  : r.pause(i),
                r
              );
            }
          },
        },
        {
          key: 'stopSound',
          value: function (t) {
            var n =
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              r =
                this.sounds[t] ||
                (this.spriteMap[t] && this.sounds[this.spriteMap[t]]);
            if (r) {
              var i = e.getSpriteId(r, t);
              return (
                r.off('load'),
                n
                  ? (r.fade(r._volume, 0, r._initFade, i),
                    r.once(
                      'fade',
                      function () {
                        r.stop(i);
                      },
                      i,
                    ))
                  : r.stop(i),
                r
              );
            }
          },
        },
        {
          key: 'pauseAll',
          value: function () {
            var e = this;
            this.soundList.forEach(function (t) {
              t.playing() && ((t.needResume = !0), e.pauseSound(t._id));
            });
          },
        },
        {
          key: 'resumeAll',
          value: function () {
            var e = this;
            this.soundList.forEach(function (t) {
              t.needResume && ((t.needResume = !1), e.playSound(t._id));
            });
          },
        },
        {
          key: 'currentPlayAudio',
          get: function () {
            return this.sounds[this.currentPlayId];
          },
        },
        {
          key: 'soundList',
          get: function () {
            var e = this;
            return Object.keys(this.sounds).map(function (t) {
              return e.sounds[t];
            });
          },
        },
      ]),
      e
    );
  })();
defaultExport = o;
export { defaultExport as default };
