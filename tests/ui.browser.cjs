/** Browser regression: modal keyboard input must not activate background hotspots. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

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
  const output = path.resolve("artifacts/ui-browser");
  const report = { passed: false, errors: [], checks: [] };
  const browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  try {
    const page = await browser.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.setContent('<div id="canvas-bg"></div><div id="page-ui"></div>');
    await page.addStyleTag({
      content: fs.readFileSync(path.join(__dirname, "../app/ui.css"), "utf8"),
    });
    await page.addScriptTag({
      type: "module",
      content:
        fs.readFileSync(path.join(__dirname, "../app/ui.mjs"), "utf8") +
        `
      window.starCalls = [];
      window.rulesCalls = [];
      window.ui = createUI({onStar: index => starCalls.push(index),onRulesChange: active => rulesCalls.push(active)});
      const points = Array.from({length: 4}, (_, index) => {
        const element = document.createElement('div');
        element.id = 'moon_start_click_' + index;
        document.body.append(element);
        return {children: [{isCSS3DObject: true, element}]};
      });
      ui.attachHotspots({getScene: () => ({getObjectByName: name => points[Number(name.match(/\\d+/)[0])]})});
      ui.setState({phase:'interactive',showTopNav:true});
    `,
    });
    await page.waitForFunction(() => window.ui);
    const fractionalProgress = await page.evaluate(() => {
      ui.setLoading(25.5);
      return {
        label: document.querySelector(".loading-progress").textContent,
        progress: document.querySelector(".loading-container").dataset.progress,
        fan: document.querySelector("#fanMask path").getAttribute("d"),
      };
    });
    assert.equal(fractionalProgress.label, "25%");
    assert.equal(fractionalProgress.progress, "25");
    const point = fractionalProgress.fan.match(/1 ([\d.]+) ([\d.]+) Z$/);
    assert.ok(
      Math.abs(Number(point[1]) - 199.95065603657316) < 1e-9,
      "the SVG fan retains the fractional 25.5% position",
    );
    assert.ok(
      Math.abs(Number(point[2]) - 103.14107590781282) < 1e-9,
      "the SVG fan advances beyond the quarter-circle while the label is floored",
    );
    const progressUpdates = await page.evaluate(() => {
      const label = document.querySelector(".loading-progress");
      const text = label.firstChild;
      const container = document.querySelector(".loading-container");
      const observer = new MutationObserver(() => {});
      observer.observe(container, { attributes: true, childList: true, characterData: true, subtree: true });
      ui.setLoading(25.5);
      const repeatedMutations = observer.takeRecords().length;
      ui.setLoading(25.75);
      const fractionalMutations = observer.takeRecords().map(record => record.target.nodeName);
      ui.setLoading(26);
      const preservesTextNode = label.firstChild === text;
      observer.disconnect();
      return { repeatedMutations, fractionalMutations, preservesTextNode, label: label.textContent };
    });
    assert.equal(progressUpdates.repeatedMutations, 0, "repeating the same progress does not invalidate loading artwork");
    assert.deepEqual(progressUpdates.fractionalMutations, ["path"], "a fractional progress change updates only the SVG fan");
    assert.equal(progressUpdates.preservesTextNode, true, "percentage updates retain the original text node like the native binding");
    assert.equal(progressUpdates.label, "26%");
    report.checks.push("loading updates preserve text nodes and skip unchanged DOM values");
    const loadingOpacity = await page.evaluate(() => {
      ui.setLoading(100);
      return getComputedStyle(document.querySelector(".start-hint")).opacity;
    });
    assert.equal(
      loadingOpacity,
      "0",
      "the newly revealed click-to-start prompt begins its fade at zero opacity",
    );
    await page.waitForFunction(
      () =>
        Number(
          getComputedStyle(document.querySelector(".start-hint")).opacity,
        ) > 0.99,
    );
    report.checks.push(
      "loading prompt starts transparent and fades to visible",
    );
    await page.evaluate(() =>
      ui.setState({ phase: "hints", showWheelHint: true }),
    );
    await page.waitForFunction(
      () =>
        !document.querySelector(".wheel-hint").hidden &&
        getComputedStyle(document.querySelector(".wheel-hint")).opacity === "1",
    );
    const hidingHint = await page.evaluate(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
      const hint = document.querySelector(".wheel-hint");
      return { hidden: hint.hidden, opacity: getComputedStyle(hint).opacity };
    });
    assert.deepEqual(
      hidingHint,
      { hidden: false, opacity: "1" },
      "interacting starts the wheel prompt fade instead of removing it immediately",
    );
    await page.waitForFunction(
      () => document.querySelector(".wheel-hint").hidden,
    );
    await page.evaluate(() =>
      ui.setState({ phase: "interactive", showWheelHint: false }),
    );
    await page.locator(".moon-star-0").focus();
    await page.keyboard.press("Enter");
    assert.deepEqual(
      await page.evaluate(() => starCalls),
      [0],
      "interactive hotspot accepts keyboard activation",
    );
    const entering = await page.evaluate(() => {
      starCalls.length = 0;
      ui.showRules();
      const mask = getComputedStyle(document.querySelector(".rules-mask"));
      const content = getComputedStyle(
        document.querySelector(".popup-container"),
      );
      return {
        opacity: content.opacity,
        background: mask.backgroundColor,
        duration: content.transitionDuration,
        easing: content.transitionTimingFunction,
      };
    });
    assert.deepEqual(
      entering,
      {
        opacity: "0",
        background: "rgba(0, 0, 0, 0)",
        duration: "0.25s",
        easing: "cubic-bezier(0.15, 0.59, 0.45, 0.89)",
      },
      "introduction starts the captured 250 ms entrance",
    );
    report.entering = entering;
    assert.deepEqual(
      await page.evaluate(() => rulesCalls),
      [true],
      "opening requests a scene pause before the entrance starts",
    );
    for (const key of ["Tab", "Tab", "Shift+Tab", "Tab"]) {
      await page.keyboard.press(key);
      assert.equal(
        await page.evaluate(() => document.activeElement.className),
        "popup-close",
        "Tab remains inside the introduction dialog",
      );
    }
    await page.evaluate(() => document.querySelector(".moon-star-0").focus());
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    await page.evaluate(() => document.querySelector(".moon-star-0").click());
    assert.deepEqual(
      await page.evaluate(() => starCalls),
      [],
      "background hotspot rejects mouse and keyboard activation while modal is open",
    );
    assert.deepEqual(
      await page
        .locator(".moon-star")
        .evaluateAll((elements) => elements.map((element) => element.tabIndex)),
      [-1, -1, -1, -1],
    );
    await page.keyboard.press("Escape");
    assert.deepEqual(
      await page.evaluate(() => rulesCalls),
      [true, false],
      "scene resumes when the close transition begins",
    );
    await page.evaluate(() => ui.showRules(true));
    assert.deepEqual(
      await page.evaluate(() => rulesCalls),
      [true, false, true],
      "reopening during exit pauses the scene again",
    );
    await page.evaluate(() => ui.showRules(false));
    assert.deepEqual(
      await page.evaluate(() => rulesCalls),
      [true, false, true, false],
      "closing the re-opened dialog resumes the scene again",
    );
    assert.deepEqual(
      await page.evaluate(() => ({
        hidden: document.querySelector(".rules-mask").hidden,
        duration: getComputedStyle(document.querySelector(".popup-container"))
          .transitionDuration,
        easing: getComputedStyle(document.querySelector(".popup-container"))
          .transitionTimingFunction,
      })),
      { hidden: false, duration: "0.18s", easing: "ease-out" },
      "introduction remains present during its captured 180 ms exit",
    );
    await page.evaluate(() => document.querySelector(".moon-star-0").click());
    assert.deepEqual(
      await page.evaluate(() => starCalls),
      [],
      "background remains blocked until the exit ends",
    );
    await page.waitForFunction(
      () => document.querySelector(".rules-mask").hidden,
    );
    assert.deepEqual(
      await page.evaluate(() => rulesCalls),
      [true, false, true, false],
      "completed exit does not emit an extra scene resume",
    );
    assert.equal(
      await page.evaluate(() => document.activeElement.className),
      "moon-star moon-star-0",
      "closing restores the previous keyboard focus",
    );
    await page.keyboard.press("Enter");
    assert.deepEqual(
      await page.evaluate(() => starCalls),
      [0],
      "interactive hotspot works again after closing the dialog",
    );
    report.checks.push(
      "introduction uses captured 250 ms enter and 180 ms exit",
    );
    report.checks.push("Tab and Shift+Tab remain inside the introduction");
    report.checks.push(
      "background mouse and keyboard activation remain blocked through the exit",
    );
    report.checks.push("closing restores focus and re-enables the hotspot");
    report.checks.push(
      "scene pauses at open and resumes at the beginning of close",
    );
    const guideFrames = await page.evaluate(async () => {
      ui.setState({ showMoonTouchHint: 0 });
      const guide = document.querySelector(".moon-star-0");
      const frames = [guide.classList.contains("show-hint")];
      await new Promise(requestAnimationFrame);
      frames.push(guide.classList.contains("show-hint"));
      await new Promise(requestAnimationFrame);
      frames.push(guide.classList.contains("show-hint"));
      return frames;
    });
    assert.deepEqual(
      guideFrames,
      [false, false, true],
      "guide waits until the second RAF so its CSS birth follows the original DOM flush",
    );
    report.checks.push(
      "guide CSS animation starts after the original deferred DOM flush",
    );
    assert.deepEqual(report.errors, []);
    report.passed = true;
    console.log(
      "PASS: start prompt fade, introduction motion, modal Tab containment, background keyboard/mouse guard, and focus restoration",
    );
  } catch (error) {
    report.failure = error.message;
    throw error;
  } finally {
    await browser.close();
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(
      path.join(output, "report.json"),
      JSON.stringify(report, null, 2),
    );
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
