/* Compare the untouched captured original with the local replay in the same browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { createResourceMap } = require('../replay/resource-map');

function dependency(name) {
  try { return require(name); } catch (_) {}
  const bundle = process.env.BROWSER_MODULES || path.join(process.env.HOME, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
  return createRequire(path.join(bundle, 'package.json'))(name);
}
const { chromium } = dependency('playwright');
const { PNG } = dependency('pngjs');
const resources = createResourceMap();
const output = path.resolve(process.env.VISUAL_OUTPUT || 'artifacts/visual');
fs.mkdirSync(output, { recursive: true });

function controlledClock() {
  let now = 0, nextId = 0, seed = 20250310;
  const callbacks = new Map();
  Date.now = () => 1741564800000 + now;
  Object.defineProperty(performance, 'now', { value: () => now });
  window.__captureBackendRejections = [];
  window.addEventListener('unhandledrejection', event => {
    if (event.reason?.data?.retcode === -500012) __captureBackendRejections.push(-500012);
  });
  Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  // Particle buffers load asynchronously. Give each original emitter its own seed so
  // different SDK/network callback ordering cannot consume its random sequence.
  let vue;
  Object.defineProperty(window, 'Vue', { configurable: true, get: () => vue, set(value) {
    vue = value;
    vue.mixin({ created() {
      if (typeof this.initPlayer !== 'function') return;
      const init = this.initPlayer;
      this.initPlayer = function(...args) {
        let requireOriginal;
        window.webpackChunke20250310nodkrai_skctj9.push([[987654], {}, req => { requireOriginal = req; }]);
        // A frozen Date.now makes the native zero-duration fade calculate 0/0.
        // Complete only that case asynchronously, preserving the native fade event.
        for (const id of [94196, 51458]) {
          const prototype = requireOriginal(id).Howl.prototype;
          if (prototype.__captureFade) continue;
          const fade = prototype._startFadeInterval;
          prototype._startFadeInterval = function(sound, from, to, duration, soundId, isGroup) {
            if (duration !== 0) return fade.apply(this, arguments);
            sound._fadeTo = to;
            sound._interval = setTimeout(() => {
              sound._interval = null;
              sound._fadeTo = null;
              this.volume(to, soundId);
              if (isGroup) this._volume = to;
              this._emit('fade', soundId);
            }, 0);
          };
          prototype.__captureFade = true;
        }
        const plugins = requireOriginal(36019).A;
        if (!plugins.__captureSeeded) {
          const native = plugins.BEZIER_PARTICLE;
          plugins.BEZIER_PARTICLE = function(config, ...rest) {
            let emitterSeed = 2166136261;
            for (const char of String(config.uuid || config.name)) emitterSeed = Math.imul(emitterSeed ^ char.charCodeAt(0), 16777619) >>> 0;
            const previous = Math.random;
            Math.random = () => { emitterSeed = (Math.imul(emitterSeed, 1664525) + 1013904223) >>> 0; return emitterSeed / 4294967296; };
            try { return native.call(this, config, ...rest); } finally { Math.random = previous; }
          };
          plugins.__captureSeeded = true;
        }
        return init.apply(this, args);
      };
    } });
  } });
  window.requestAnimationFrame = callback => { callbacks.set(++nextId, callback); return nextId; };
  window.cancelAnimationFrame = id => callbacks.delete(id);
  window.__captureClock = {
    async step(frames) {
      for (let i = 0; i < frames; i++) {
        now += 1000 / 60;
        const frame = Array.from(callbacks.values());
        callbacks.clear();
        for (const callback of frame) callback(now);
        await Promise.resolve();
        await Promise.resolve();
        for (const animation of document.getAnimations()) { animation.pause(); animation.currentTime = now; }
      }
      return now;
    },
    get time() { return now; },
  };
  try { localStorage.removeItem('e20250310nodkrai_moonStars'); } catch (_) {}
}

async function untouchedReference(route) {
  const url = new URL(route.request().url());
  const cors = { 'access-control-allow-origin': route.request().headers().origin || 'https://ys.mihoyo.com', 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS' };
  if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
  const record = url.href === 'https://ys.mihoyo.com/moon' ? resources.entry :
    resources.byOriginal.get(url.href) || resources.bySourcePath.get('/source/' + url.host + url.pathname);
  if (record) {
    const extension = path.extname(record.filePath);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4' };
    return route.fulfill({ status: 200, contentType: types[extension] || 'application/octet-stream', body: fs.readFileSync(record.filePath), headers: cors });
  }
  if (url.pathname.endsWith('/mihoyo-h5log/v1.0/main.js')) {
    return route.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.resolve('replay/h5log.js'), 'utf8') });
  }
  // Uncaptured telemetry has no visual state; never send it to the production service.
  return route.fulfill({ contentType: 'application/json', body: '{"retcode":0,"message":"OK","data":{}}', headers: cors });
}

async function ready(page) {
  await page.waitForFunction(() => {
    const e = window.Vue?.prototype.$effectVue;
    if (!e?.player) return false;
    const loader = e.player.constructor.getSourceLoader();
    return loader.manifestList.length > 0 && loader.count === loader.manifestList.length && document.fonts.check('36px fontLink');
  }, null, { timeout: 60000, polling: 100 });
  // Let resource-loader promise chains finish before releasing the frozen animation clock.
  await page.waitForTimeout(250);
}

async function state(page) {
  return page.evaluate(() => {
    const e = Vue.prototype.$effectVue, m = e.player.scenes.scene_moon;
    const timeline = name => { try { return m?.getTimeline(name)?.time ?? null; } catch (_) { return null; } };
    return {
      elapsedMs: __captureClock.time,
      intro: timeline('一期动画'), moon: timeline('p1_静止'), interactiveTimeline: timeline(m?.moonTimeline), text: timeline('points_text'),
      textState: m?.textState, interactive: e.sceneInteractive, fontLoaded: document.fonts.check('36px fontLink'),
      viewport: [innerWidth, innerHeight, devicePixelRatio], canvas: [e.renderer.domElement.width, e.renderer.domElement.height],
      layout: Object.fromEntries(['#layout', '#frame', '#canvas-bg', '#webglCanvas', '.role_qfqyq__noLogin'].map(selector => {
        const el = document.querySelector(selector), r = el?.getBoundingClientRect();
        return [selector, r ? [r.x, r.y, r.width, r.height, getComputedStyle(el).display] : null];
      })),
    };
  });
}

function compareImages(original, local, differencePath) {
  const a = PNG.sync.read(original), b = PNG.sync.read(local);
  assert.equal(a.width, b.width); assert.equal(a.height, b.height);
  const diff = new PNG({ width: a.width, height: a.height });
  let differentPixels = 0, absoluteError = 0, maxChannelError = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    let changed = false;
    for (let c = 0; c < 3; c++) {
      const error = Math.abs(a.data[i + c] - b.data[i + c]);
      absoluteError += error; maxChannelError = Math.max(maxChannelError, error);
      diff.data[i + c] = error; changed ||= error !== 0;
    }
    diff.data[i + 3] = 255;
    if (changed) differentPixels++;
  }
  fs.writeFileSync(differencePath, PNG.sync.write(diff));
  return { differentPixels, totalPixels: a.width * a.height, meanChannelError: absoluteError / (a.width * a.height * 3), maxChannelError };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const report = { reference: 'Untouched captured original HTML, JS, CSS, JSON, fonts and textures; original network URLs fulfilled from local HAR resources.', clock: 'Seeded random; Date.now, performance.now and RAF driven together at 60 Hz; hooks only in verification.', scenarios: [] };
  try {
    for (const config of [{ width: 1200, height: 660, dpr: 1 }, { width: 1920, height: 1080, dpr: 2 }]) {
      const label = `${config.width}x${config.height}@${config.dpr}`;
      const contexts = await Promise.all([0, 1].map(() => browser.newContext({ viewport: { width: config.width, height: config.height }, deviceScaleFactor: config.dpr })));
      const pages = await Promise.all(contexts.map(context => context.newPage()));
      const issues = pages.map(() => ({ errors: [], failed: [], missing: [] }));
      for (let i = 0; i < pages.length; i++) {
        await pages[i].addInitScript(controlledClock);
        pages[i].on('pageerror', error => issues[i].errors.push({ message: error.message, stack: error.stack }));
        pages[i].on('requestfailed', request => issues[i].failed.push(request.url()));
        pages[i].on('response', response => { if (response.status() >= 400) issues[i].missing.push([response.status(), response.url()]); });
      }
      await pages[0].route('**/*', untouchedReference);
      await Promise.all([pages[0].goto('https://ys.mihoyo.com/moon', { waitUntil: 'domcontentloaded' }), pages[1].goto(process.env.REPLAY_URL || 'http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' })]);
      await Promise.all(pages.map(ready));
      const scenario = { label, checkpoints: [], issues };
      report.scenarios.push(scenario);
      async function advance(frames) { await Promise.all(pages.map(page => page.evaluate(frames => __captureClock.step(frames), frames))); }
      async function capture(name) {
        const buffers = await Promise.all(pages.map((page, i) => page.screenshot({ path: path.join(output, `${label}-${name}-${i ? 'local' : 'original'}.png`) })));
        scenario.checkpoints.push({ name, states: await Promise.all(pages.map(state)), ...compareImages(buffers[0], buffers[1], path.join(output, `${label}-${name}-diff.png`)) });
        const checkpoint = scenario.checkpoints.at(-1);
        assert.deepEqual(checkpoint.states[1], checkpoint.states[0], `${label} ${name}: native timeline/layout states differ`);
        console.log(JSON.stringify({ scenario: label, name, differentPixels: checkpoint.differentPixels, meanChannelError: checkpoint.meanChannelError, frames: checkpoint.states.map(s => [s.intro, s.moon, s.interactiveTimeline, s.text]), interactive: checkpoint.states.map(s=>s.interactive) }));
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
      }
      await advance(90); await capture('loading');
      await Promise.all(pages.map(page => page.evaluate(() => document.querySelector('.start-hint').click())));
      await advance(1); await capture('intro-start');
      await advance(119); await capture('intro-2s');
      await advance(180); await capture('intro-5s');
      await advance(300); await capture('intro-10s');
      await advance(300); await capture('first-text');
      await advance(90);
      await Promise.all(pages.map(page => page.mouse.move(config.width / 2, config.height / 2)));
      await Promise.all(pages.map(page => page.mouse.wheel(0, 600)));
      await pages[0].waitForTimeout(100);
      await advance(300); await capture('second-text');
      await Promise.all(pages.map(page => page.mouse.wheel(0, 600)));
      await pages[0].waitForTimeout(100);
      await advance(360); await capture('three-stars');
      for (let i = 0; i < 4; i++) {
        await Promise.all(pages.map(page => page.evaluate(i => { Vue.prototype.$effectVue.player.getScene('scene_moon').showEgg(i); }, i)));
        await advance(180); await capture(`moon-text-${i}`);
        await Promise.all(pages.map(page => page.evaluate(() => { Vue.prototype.$effectVue.player.getScene('scene_moon').showEgg(-1); })));
        await advance(180);
      }
      scenario.referenceBackendRejections = await pages[0].evaluate(() => __captureBackendRejections);
      // Closing a media page intentionally aborts pending ranges; don't count cleanup as a failure.
      for (const page of pages) page.removeAllListeners('requestfailed');
      await Promise.all(contexts.map(context => context.close()));
    }
  } finally {
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    await browser.close();
  }
  const mismatches = report.scenarios.flatMap(s => s.checkpoints.filter(c => c.differentPixels > 0 && !(c.name === 'loading' && c.maxChannelError <= 1)));
  const localErrors = report.scenarios.flatMap(s => s.issues[1].errors.concat(s.issues[1].failed, s.issues[1].missing));
  assert.equal(localErrors.length, 0, `Browser issues: ${JSON.stringify(localErrors)}`);
  assert.equal(mismatches.length, 0, `${mismatches.length} visual checkpoints differ; inspect ${output}/report.json`);
  const checkpoints = report.scenarios.flatMap(s => s.checkpoints);
  console.log(`${checkpoints.filter(c=>c.differentPixels===0).length}/${checkpoints.length} checkpoints match exactly; loading alone allows a one-code-value GPU rounding difference. All timeline/layout states match.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
