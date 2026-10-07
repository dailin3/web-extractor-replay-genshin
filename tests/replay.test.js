const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test, before, after } = require('node:test');
const { createResourceMap, RUNTIME_ORIGIN } = require('../replay/resource-map');
const { createReplayServer } = require('../replay/server');

const projectDir = path.resolve(__dirname, '../projects/ys.mihoyo.com');
const resources = createResourceMap(projectDir);
let server;
let origin;

before(async () => {
  server = createReplayServer({ projectDir });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('exact URL rewrites win over dynamic host prefixes, including escaped JSON', () => {
  const locale = [...resources.byOriginal.keys()].find(url => url.endsWith('-zh-cn.json'));
  const font = [...resources.byOriginal.keys()].find(url => url.endsWith('.woff2'));
  const image = `${RUNTIME_ORIGIN}images/moon_a_tex.589e0a28..png`;
  const source = JSON.stringify({ locale, font, image }).replaceAll('/', '\\/');
  const rewritten = JSON.parse(resources.rewriteText(source));
  assert.equal(rewritten.locale, resources.byOriginal.get(locale).localUrl);
  assert.equal(rewritten.font, resources.byOriginal.get(font).localUrl);
  assert.equal(rewritten.image, resources.byOriginal.get(image).localUrl);
});

test('webpack public path and computed locale/font bases resolve locally', () => {
  const rewritten = resources.rewriteText(`t.p="${RUNTIME_ORIGIN}";const font="https://act-webstatic.mihoyo.com/font_generate/";const i18n="https://fastcdn.mihoyo.com/mi18n";`);
  assert.match(rewritten, /t\.p="\/runtime\/"/);
  assert.match(rewritten, /\/source\/act-webstatic\.mihoyo\.com\/font_generate\//);
  assert.match(rewritten, /\/source\/fastcdn\.mihoyo\.com\/mi18n/);
});

test('entry reuses original scripts and installs fresh-session bootstrap before them', async () => {
  const response = await fetch(`${origin}/`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /「空月之歌」/);
  assert.match(html, /\/local-assets\/vendors_3c19dbfdd57bec9e83ae\.js/);
  assert.match(html, /\/local-assets\/vue\.runtime\.min\.js/);
  assert.ok(html.indexOf('/replay/bootstrap.js') < html.indexOf('vendors_3c19'));
  assert.ok(html.indexOf('/replay/h5log.js') >= 0);
  assert.ok(html.indexOf('/replay/h5log.js') < html.indexOf('main_78268828.js'));
  assert.match(response.headers.get('content-security-policy'), /connect-src 'self'/);
});

test('downloaded texture remains byte-identical through both local and webpack routes', async () => {
  const name = 'moon_a_tex.589e0a28..png';
  const expected = fs.readFileSync(path.join(projectDir, 'assets', name));
  for (const route of [`/local-assets/${name}`, `/runtime/images/${name}?cachebuster=1791308575035`]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'image/png');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
  }
});

test('computed font URL and cache-busted captured API use exact pathname mappings', async () => {
  const font = [...resources.byOriginal.keys()].find(url => url.endsWith('.woff2'));
  const fontUrl = new URL(font);
  const response = await fetch(`${origin}/source/${fontUrl.host}${fontUrl.pathname}?v=2`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'font/woff2');
  const api = await fetch(`${origin}/source/api-takumi.mihoyo.com/common/badge/v1/login/info?game_biz=hk4e_cn&lang=zh-cn&ts=1`);
  assert.equal(api.status, 200);
  assert.equal(typeof (await api.json()).data, 'object');
});

test('MP4 supports byte ranges and rejects ranges past the file', async () => {
  const video = [...resources.byOriginal.values()].find(record => record.filePath.endsWith('.mp4'));
  const expected = fs.readFileSync(video.filePath);
  const response = await fetch(origin + video.localUrl, { headers: { Range: 'bytes=10-109' } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-type'), 'video/mp4');
  assert.equal(response.headers.get('content-range'), `bytes 10-109/${expected.length}`);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected.subarray(10, 110));
  const invalid = await fetch(origin + video.localUrl, { headers: { Range: `bytes=${expected.length}-` } });
  assert.equal(invalid.status, 416);
});

test('unknown assets and traversal fail closed', async () => {
  for (const route of ['/runtime/images/missing.png', '/local-assets/..%2F..%2Fpackage.json', '/source/unknown.example/test', '/unknown']) {
    assert.equal((await fetch(origin + route)).status, 404, route);
  }
});

test('bootstrap clears only moon progress and redirects known fetch/XHR URLs', async () => {
  const bootstrap = await (await fetch(`${origin}/replay/bootstrap.js`)).text();
  const requests = [];
  const removedKeys = [];
  class FakeXHR {
    open(method, url) { requests.push({ method, url }); }
  }
  const context = {
    URL,
    URLSearchParams,
    Request,
    location: new URL(origin + '/'),
    localStorage: { removeItem: key => removedKeys.push(key) },
    XMLHttpRequest: FakeXHR,
    navigator: { sendBeacon: url => requests.push({ method: 'BEACON', url }) },
    window: { fetch: url => requests.push({ method: 'FETCH', url }) },
  };
  const scheduled = [];
  context.window.setInterval = callback => { scheduled.push(callback); return scheduled.length; };
  context.window.clearInterval = () => {};
  vm.runInNewContext(bootstrap, context);
  assert.deepEqual(removedKeys, ['e20250310nodkrai_moonStars']);
  const font = [...resources.byOriginal.keys()].find(url => url.endsWith('.woff2'));
  context.window.fetch(font + '?cachebuster=2');
  new context.XMLHttpRequest().open('GET', font);
  context.navigator.sendBeacon('https://unrecorded.example/telemetry');
  assert.deepEqual(requests.map(request => request.url), [resources.byOriginal.get(font).localUrl, resources.byOriginal.get(font).localUrl, '/__replay-blocked']);
  assert.equal(context.window.__replayBlockedRequests[0], 'https://unrecorded.example/telemetry');
  context.location = new URL(origin + '/?keepProgress');
  vm.runInNewContext(bootstrap, context);
  assert.equal(removedKeys.length, 1);
});

test('nonvisual h5log uses the exact account SDK fallback contract', async () => {
  const response = await fetch(origin + '/replay/h5log.js');
  assert.equal(response.status, 200);
  const window = {};
  vm.runInNewContext(await response.text(), { window });
  const logger = window.miHoYoH5log.create({ env: 'production' });
  for (const method of ['setCommonInfo', 'error', 'warn', 'info']) {
    assert.equal(typeof logger[method], 'function');
    assert.doesNotThrow(() => logger[method]('message', {}));
  }
  const sdk = await (await fetch(origin + '/local-assets/main_78268828.js')).text();
  assert.match(sdk, /\.src="\/replay\/h5log\.js"/);
  assert.equal(/\.src="https:\/\/webstatic"\.concat\([^)]*mihoyo-h5log/.test(sdk), false);
});

test('first-stage boundary blocks later power page while preserving native moon methods', async () => {
  const bootstrap = await (await fetch(`${origin}/replay/bootstrap.js`)).text();
  const scheduled = [];
  const stopped = [];
  let powerCalls = 0;
  const showEgg = () => 'star popup';
  const toSceneMoon = () => 'moon';
  const effect = { toScenePower: () => { powerCalls++; }, showEgg, toSceneMoon };
  const context = {
    URL, URLSearchParams, Request,
    location: new URL(origin),
    localStorage: { removeItem() {} },
    XMLHttpRequest: class { open() {} },
    navigator: {},
    window: {
      fetch() {},
      setInterval: callback => { scheduled.push(callback); return 1; },
      clearInterval: timer => stopped.push(timer),
    },
  };
  vm.runInNewContext(bootstrap, context);
  scheduled[0](); // The native Vue component has not been initialized yet.
  assert.equal(stopped.length, 0);
  context.window.Vue = { prototype: { $effectVue: effect } };
  scheduled[0]();
  await effect.toScenePower();
  assert.equal(powerCalls, 0);
  assert.equal(effect.showEgg, showEgg);
  assert.equal(effect.toSceneMoon, toSceneMoon);
  assert.equal(context.window.__replayStageBoundary, true);
  assert.deepEqual(stopped, [1]);
});

test('signed-out startup handles only the captured expired-activity rejection', async () => {
  const { patchNativeInitialization } = require('../replay/native-patches');
  const source = 'function initialize(r,i){return(r.isLogin||i.initApiStore(),42)}';
  const context = {};
  vm.runInNewContext(patchNativeInitialization(source), context);
  for (const retcode of [-500012, -100, 500]) {
    const reason = { data: { retcode } };
    let handled;
    const api = { initApiStore: () => ({ catch: handler => { handled = Promise.reject(reason).catch(handler); } }) };
    assert.equal(context.initialize({ isLogin: false }, api), 42);
    if (retcode === -500012) {
      await handled;
    } else {
      await assert.rejects(handled, error => error === reason);
    }
  }
  let calls = 0;
  context.initialize({ isLogin: true }, { initApiStore: () => { calls++; } });
  assert.equal(calls, 0);
  assert.throws(() => patchNativeInitialization('changed native bundle'), /startup call/);
  const response = await fetch(origin + '/local-assets/index_44ff6b130c7baea7b639.js');
  assert.equal((await response.text()).includes('error.data.retcode!==-500012'), true);
});
