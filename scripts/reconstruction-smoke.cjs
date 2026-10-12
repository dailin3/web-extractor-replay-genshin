/** Real-clock user interaction check for the reconstructed application. */
const { createRequire } = require("node:module");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (_) {
  const modules =
    process.env.BROWSER_MODULES ||
    path.join(
      process.env.HOME,
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
    );
  ({ chromium } = createRequire(path.join(modules, "package.json"))(
    "playwright",
  ));
}

(async () => {
  const browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const output = path.resolve("artifacts/reconstruction-smoke");
  fs.mkdirSync(output, { recursive: true });
  const report = {
    console: [],
    errors: [],
    failed: [],
    missing: [],
    requests: [],
    interactions: [],
    timing: {},
  };
  let page;
  try {
    page = await browser.newPage({
      viewport: { width: 1200, height: 660 },
      deviceScaleFactor: 1,
    });
    page.on("console", (message) =>
      report.console.push({
        type: message.type(),
        text: message.text(),
        location: message.location(),
      }),
    );
    page.on("pageerror", (error) =>
      report.errors.push({ message: error.message, stack: error.stack }),
    );
    page.on("request", (request) =>
      report.requests.push({
        url: request.url(),
        type: request.resourceType(),
      }),
    );
    page.on("requestfailed", (request) =>
      report.failed.push({ url: request.url(), error: request.failure() }),
    );
    page.on("response", (response) => {
      if (response.status() >= 400)
        report.missing.push({ status: response.status(), url: response.url() });
    });
    await page.addInitScript(() => {
      window.__smokeRejections = [];
      window.addEventListener("unhandledrejection", (event) =>
        window.__smokeRejections.push({
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
        }),
      );
    });
    await page.goto(process.env.RECONSTRUCTION_URL || "http://127.0.0.1:4174", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () => window.__moonApp?.assetsReady && window.__moonApp?.ready,
      null,
      { timeout: 60000 },
    );
    assert.equal(await page.evaluate(() => window.__moonApp.status), "ready");
    await page.screenshot({ path: path.join(output, "loading.png") });
    const startedAt = Date.now();
    await page.locator(".start-hint").click();
    await page.waitForFunction(
      () => window.__moonApp.state?.phase === "hints",
      null,
      { timeout: 60000 },
    );
    report.timing.openingToHintsMs = Date.now() - startedAt;
    await page.waitForFunction(
      () =>
        window.__moonApp.player.scenes.scene_moon.textState === "animationEnd",
      null,
      { timeout: 15000 },
    );
    await page.screenshot({ path: path.join(output, "first-text.png") });
    await page.mouse.wheel(0, 600);
    await page.waitForFunction(
      () => {
        const controller = window.__moonApp.player.scenes.scene_moon.controller;
        return controller.hintIndex === 1 && !controller.wheelBusy;
      },
      null,
      { timeout: 15000 },
    );
    await page.screenshot({ path: path.join(output, "second-text.png") });
    await page.mouse.wheel(0, 600);
    await page.waitForFunction(
      () => window.__moonApp.state.phase === "interactive",
      null,
      { timeout: 15000 },
    );
    await page.screenshot({ path: path.join(output, "stars.png") });
    for (let index = 0; index < 4; index++) {
      const target = page.locator(`.moon-star-${index}`);
      await target.waitFor({ state: "visible", timeout: 15000 });
      const hit = await target.boundingBox();
      assert.ok(
        hit && hit.width > 0 && hit.height > 0,
        `No physical hit area for ${index}`,
      );
      // CSS3D hit areas continue moving; use an actual pointer at the current center.
      const position = { x: hit.x + hit.width / 2, y: hit.y + hit.height / 2 };
      assert.ok(
        position.x >= 0 &&
          position.x < 1200 &&
          position.y >= 0 &&
          position.y < 660,
        `Offscreen hit area ${index}`,
      );
      const hitElement = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.outerHTML,
        position,
      );
      await page.mouse.click(position.x, position.y);
      await page.waitForFunction(
        () => window.__moonApp.state.phase === "popup",
        null,
        { timeout: 15000 },
      );
      const opened = await page.evaluate(
        (index) => ({
          index,
          popup: window.__moonApp.state.showCanvasPopup,
          completed:
            window.__moonApp.player.scenes.scene_moon.enableMoonStars[index],
          popupFrame:
            window.__moonApp.player.scenes.scene_moon.getTimeline("彩蛋1").time,
        }),
        index,
      );
      report.interactions.push({ ...opened, hit, hitElement });
      assert.equal(opened.popup, true);
      assert.equal(opened.completed, true);
      assert.equal(opened.popupFrame, 40);
      await page.screenshot({ path: path.join(output, `story-${index}.png`) });
      await page.mouse.click(1180, 400);
      await page.waitForFunction(
        () =>
          window.__moonApp.state.phase === "interactive" &&
          !window.__moonApp.state.showCanvasPopup,
        null,
        { timeout: 15000 },
      );
    }
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(500);
    const rules = page.locator(".rules-mask");
    assert.equal(await rules.isVisible(), false);
    await page.locator(".rules-button").click();
    await rules.waitFor({ state: "visible" });
    const playerClock = () =>
      page.evaluate(async () => {
        const { gsap } = await import("/engine/index.js");
        const { player } = window.__moonApp;
        return {
          time: player.uniformSetting.time.value,
          tickerTime: gsap.ticker.time,
          tickerFrame: gsap.ticker.frame,
          clockRunning: player.clock.running,
          clockOldTime: player.clock.oldTime,
        };
      });
    const openedClock = await playerClock();
    await page.waitForTimeout(400);
    const pausedClock = await playerClock();
    assert.equal(
      pausedClock.time,
      openedClock.time,
      "WebGL clock advanced while introduction was open",
    );
    assert.equal(
      pausedClock.clockOldTime,
      openedClock.clockOldTime,
      "Player tick ran while introduction was open",
    );
    assert.equal(
      pausedClock.clockRunning,
      true,
      "The native clock must remain running while rendering is gated",
    );
    assert.ok(
      pausedClock.tickerTime > openedClock.tickerTime,
      "GSAP ticker stopped with the introduction",
    );
    assert.ok(
      pausedClock.tickerFrame > openedClock.tickerFrame,
      "Animation frames stopped with the introduction",
    );
    report.rules = {
      title: await rules.locator("#rules-title").textContent(),
      text: await rules.locator(".scrollContent").innerText(),
      pointerEvents: await page
        .locator(".moon-star")
        .evaluateAll((elements) =>
          elements.map((element) => getComputedStyle(element).pointerEvents),
        ),
      clock: { opened: openedClock, paused: pausedClock },
    };
    assert.equal(report.rules.title, "简介");
    assert.ok(report.rules.text.length > 0, "Introduction text is empty");
    assert.deepEqual(report.rules.pointerEvents, [
      "none",
      "none",
      "none",
      "none",
    ]);
    await page.screenshot({ path: path.join(output, "introduction.png") });
    await rules.locator(".popup-close").click();
    await page.waitForTimeout(60);
    const leavingClock = await playerClock();
    assert.ok(
      leavingClock.time > openedClock.time,
      "WebGL clock did not resume when introduction closing began",
    );
    assert.ok(
      leavingClock.clockOldTime > openedClock.clockOldTime,
      "Player tick did not resume during introduction exit",
    );
    assert.equal(
      await rules.isVisible(),
      true,
      "Introduction exit finished before its 180ms duration",
    );
    assert.equal(leavingClock.clockRunning, true);
    await rules.waitFor({ state: "hidden" });
    await page.waitForFunction(
      (time) => window.__moonApp.player.uniformSetting.time.value > time,
      leavingClock.time,
    );
    const resumedClock = await playerClock();
    assert.ok(
      resumedClock.time > leavingClock.time,
      "WebGL clock did not resume after the introduction closed",
    );
    assert.equal(resumedClock.clockRunning, true);
    Object.assign(report.rules.clock, {
      leaving: leavingClock,
      resumed: resumedClock,
    });
    report.rules.closed = true;
    assert.deepEqual(
      await page
        .locator(".moon-star")
        .evaluateAll((elements) =>
          elements.map((element) => getComputedStyle(element).pointerEvents),
        ),
      ["auto", "auto", "auto", "auto"],
    );
    const audio = page.locator(".audio-button");
    await audio.click();
    const muted = await audio.getAttribute("aria-pressed");
    const mutedRuntime = await page.evaluate(
      async () => (await import("/engine/index.js")).Howler._muted,
    );
    await audio.click();
    const unmuted = await audio.getAttribute("aria-pressed");
    const unmutedRuntime = await page.evaluate(
      async () => (await import("/engine/index.js")).Howler._muted,
    );
    report.state = await page.evaluate(() => ({
      phase: window.__moonApp.state.phase,
      completed: window.__moonApp.player.scenes.scene_moon.enableMoonStars,
      popup: window.__moonApp.state.showCanvasPopup,
      font: document.fonts.check("36px fontLink"),
      sceneNames: Object.keys(window.__moonApp.player.scenes),
      rejections: window.__smokeRejections,
      vuePresent: typeof window.Vue !== "undefined",
      webpackPresent:
        typeof window.webpackChunke20250310nodkrai_skctj9 !== "undefined",
    }));
    report.audio = { muted, unmuted, mutedRuntime, unmutedRuntime };
    report.originalBundleRequests = report.requests.filter(({ url }) =>
      /\/(?:index_44ff6b130c7baea7b639|styles_ea49998b3e6538661843|vendors_3c19dbfdd57bec9e83ae)\.js/.test(
        url,
      ),
    );
    report.externalRequests = report.requests.filter(
      ({ url }) =>
        /^https?:/.test(url) && new URL(url).hostname !== "127.0.0.1",
    );
    assert.deepEqual(
      report.console.filter(({ type }) => type === "error"),
      [],
    );
    assert.deepEqual(report.errors, []);
    assert.deepEqual(report.failed, []);
    assert.deepEqual(report.missing, []);
    assert.deepEqual(report.state.rejections, []);
    assert.deepEqual(report.originalBundleRequests, []);
    assert.deepEqual(report.externalRequests, []);
    assert.equal(report.state.vuePresent, false);
    assert.equal(report.state.webpackPresent, false);
    assert.deepEqual(report.state.completed, [true, true, true, true]);
    assert.equal(report.state.phase, "interactive");
    assert.equal(report.state.popup, false);
    assert.equal(report.state.font, true);
    assert.deepEqual(report.audio, {
      muted: "false",
      unmuted: "true",
      mutedRuntime: true,
      unmutedRuntime: false,
    });
    assert.ok(
      report.timing.openingToHintsMs >= 15000 &&
        report.timing.openingToHintsMs < 25000,
      `Unexpected real-clock opening duration ${report.timing.openingToHintsMs}`,
    );
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = { message: error.message, stack: error.stack };
    if (page) {
      await page
        .screenshot({ path: path.join(output, "failure.png") })
        .catch(() => {});
      report.diagnostics = await page
        .evaluate(() => {
          const app = window.__moonApp;
          const scene = app?.player?.scenes.scene_moon;
          return {
            state: app?.state,
            sceneAutoUpdate: scene?.autoUpdate,
            canvasHTML: document.getElementById("css3d-renderer")?.outerHTML,
            points: [0, 1, 2, 3].map((index) => {
              const node = scene?.getObjectByName(`click_${index}_point`);
              return {
                name: node?.name,
                visible: node?.visible,
                matrix: node?.matrixWorld?.elements,
                children: node?.children.map((child) => ({
                  name: child.name,
                  visible: child.visible,
                  css3d: child.isCSS3DObject,
                  element: child.element?.outerHTML,
                })),
              };
            }),
          };
        })
        .catch((error) => ({ error: error.message }));
    }
    throw error;
  } finally {
    fs.writeFileSync(
      path.join(output, "report.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(
      JSON.stringify(
        {
          passed: report.passed,
          timing: report.timing,
          errors: report.errors.length,
          failed: report.failed.length,
          missing: report.missing.length,
          interactions: report.interactions.length,
          state: report.state,
          audio: report.audio,
          rules: report.rules,
        },
        null,
        2,
      ),
    );
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
