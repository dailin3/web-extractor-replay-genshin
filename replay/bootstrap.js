/** Local network, fresh progress and first-stage boundary; original scene timing/rendering stay native. */
function buildBootstrap(resources) {
  const exact = Object.fromEntries([...resources.byOriginal].map(([url, record]) => [url, record.localUrl]));
  const pathname = Object.fromEntries([...resources.byOriginal].map(([url, record]) => {
    const parsed = new URL(url);
    return [`${parsed.host}${parsed.pathname}`, record.localUrl];
  }));

  return `(() => {
    'use strict';
    const capturedUrls = ${JSON.stringify(exact)};
    const capturedPaths = ${JSON.stringify(pathname)};
    const settings = new URLSearchParams(location.search);
    if (!settings.has('keepProgress')) {
      try { localStorage.removeItem('e20250310nodkrai_moonStars'); } catch (_) {}
    }
    window.__replayBlockedRequests = [];
    function localUrl(input) {
      const value = input instanceof URL ? input.href : String(input);
      if (capturedUrls[value]) return capturedUrls[value];
      const url = new URL(value, location.href);
      if (url.origin === location.origin || ['data:', 'blob:'].includes(url.protocol)) return value;
      const captured = capturedPaths[url.host + url.pathname];
      if (captured) return captured;
      window.__replayBlockedRequests.push(url.origin + url.pathname);
      return '/__replay-blocked';
    }
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function(input, options) {
      if (input instanceof Request) {
        const destination = localUrl(input.url);
        return nativeFetch(destination === input.url ? input : new Request(destination, input), options);
      }
      return nativeFetch(localUrl(input), options);
    };
    const nativeOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...options) {
      return nativeOpen.call(this, method, localUrl(url), ...options);
    };
    if (navigator.sendBeacon) {
      const nativeBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function(url, data) { return nativeBeacon(localUrl(url), data); };
    }
    const boundaryTimer = window.setInterval(() => {
      const effect = window.Vue && window.Vue.prototype.$effectVue;
      if (!effect || typeof effect.toScenePower !== 'function') return;
      effect.toScenePower = function() { return Promise.resolve(); };
      window.__replayStageBoundary = true;
      window.clearInterval(boundaryTimer);
    }, 25);
  })();`;
}

module.exports = { buildBootstrap };
