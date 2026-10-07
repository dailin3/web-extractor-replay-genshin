const { createRequire } = require('node:module');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (_) {
  const modules = process.env.BROWSER_MODULES || path.join(process.env.HOME, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
  ({ chromium } = createRequire(path.join(modules, 'package.json'))('playwright'));
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 660 }, deviceScaleFactor: 1 });
    const errors = [], failed = [], missing = [];
    page.on('pageerror', error => errors.push({message:error.message,stack:error.stack}));
    await page.addInitScript(() => {
      window.__rejections = [];
      window.addEventListener('unhandledrejection', event => {
        const r = event.reason;
        __rejections.push({type:typeof r, keys:r&&Object.keys(r), retcode:r?.retcode, code:r?.code, message:r?.message, stack:r?.stack});
      });
    });
    page.on('requestfailed', request => failed.push({ url: request.url(), error: request.failure() }));
    page.on('response', response => { if (response.status() >= 400) missing.push([response.status(), response.url()]); });
    await page.goto(process.env.REPLAY_URL || 'http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.start-hint', { timeout: 60000 });
    await page.waitForFunction(() => Vue.prototype.$effectVue?.loadingProgress === 100, null, { timeout: 60000 });
    fs.mkdirSync(path.resolve('artifacts'), { recursive: true });
    await page.screenshot({ path: 'artifacts/local-loading.png' });
    console.log(JSON.stringify({ body: await page.locator('body').innerText(), errors, failed, missing, state: await page.evaluate(() => ({font:document.fonts.check('36px fontLink'), blocked:window.__replayBlockedRequests, page:Vue.prototype.$effectVue.pageStore.pageType, progress:Vue.prototype.$effectVue.loadingProgress,rejections:__rejections})) }, null, 2));
    await page.locator('.start-hint').click();
    await page.waitForFunction(() => {
      const moon = Vue.prototype.$effectVue.player.scenes.scene_moon;
      return moon.getTimeline('p1_静止').time === 152 && moon.textState === 'animationEnd';
    }, null, { timeout: 60000 });
    await page.screenshot({ path: 'artifacts/local-intro.png' });
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(4500);
    await page.mouse.wheel(0, 600);
    await page.waitForFunction(() => {
      const effect = Vue.prototype.$effectVue, moon = effect.player.scenes.scene_moon;
      return effect.sceneInteractive && moon.getTimeline(moon.moonTimeline).time === 225;
    }, null, { timeout: 30000 });
    await page.screenshot({ path: 'artifacts/local-stars.png' });
    const interactions = [];
    for (let index = 0; index < 4; index++) {
      // Original CSS3D hit targets exercise pointer events and the Vue click handler.
      const target = page.locator(`.moon-star-${index}`);
      await target.waitFor({ state: 'visible' });
      // These native hit targets keep moving, so waiting for Playwright's two
      // identical bounding boxes would never finish. Click their current center.
      const hit = await target.boundingBox();
      assert.ok(hit && hit.width > 0 && hit.height > 0, `Missing hit target ${index}`);
      console.log(JSON.stringify({index, hit, before:await page.evaluate(()=>({popup:Vue.prototype.$effectVue.showCanvasPopup,interactive:Vue.prototype.$effectVue.sceneInteractive}))}));
      await page.mouse.click(hit.x + hit.width / 2, hit.y + hit.height / 2);
      await page.waitForFunction(() => Vue.prototype.$effectVue.showCanvasPopup, null, {timeout:5000}).catch(async error => {
        await page.screenshot({path:'artifacts/click-failure.png'});
        console.log(JSON.stringify(await page.evaluate(({x,y})=>({popup:Vue.prototype.$effectVue.showCanvasPopup,interactive:Vue.prototype.$effectVue.sceneInteractive,target:document.elementFromPoint(x,y)?.outerHTML,timelines:Object.values(Vue.prototype.$effectVue.player.timelines).map(t=>[t.name,t.time])}),{x:hit.x+hit.width/2,y:hit.y+hit.height/2}),null,2));
        throw error;
      });
      await page.waitForFunction(() => {
        const effect = Vue.prototype.$effectVue;
        return effect.showCanvasPopup && effect.player.scenes.scene_moon.getTimeline('彩蛋1').time === 40;
      }, null, { timeout: 15000 });
      await page.screenshot({ path: `artifacts/local-click-${index}.png` });
      interactions.push(await page.evaluate(index => ({index, popup:Vue.prototype.$effectVue.showCanvasPopup, completed:Vue.prototype.$effectVue.player.scenes.scene_moon.enableMoonStars[index]}), index));
      await page.mouse.click(1180, 400);
      await page.waitForFunction(() => !Vue.prototype.$effectVue.showCanvasPopup, null, { timeout: 15000 });
    }
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1500);
    const state = await page.evaluate(() => ({
      pageType:Vue.prototype.$effectVue.pageStore.pageType,
      completed:Vue.prototype.$effectVue.player.scenes.scene_moon.enableMoonStars,
      font:document.fonts.check('36px fontLink'), popup:Vue.prototype.$effectVue.showCanvasPopup,
      boundary:window.__replayStageBoundary, blocked:window.__replayBlockedRequests,
    }));
    const report = {errors, failed, missing, interactions, state};
    fs.writeFileSync('artifacts/browser-smoke.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report,null,2));
    assert.deepEqual(errors, []); assert.deepEqual(failed, []); assert.deepEqual(missing, []);
    assert.deepEqual(state.completed, [true,true,true,true]);
    assert.equal(state.pageType, 1); assert.equal(state.font, true); assert.equal(state.popup, false); assert.equal(state.boundary, true);
    for (const interaction of interactions) { assert.equal(interaction.popup, true); assert.equal(interaction.completed, true); }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
