/** Compare the introduction against captured original code, including intermediate motion. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const acorn = require("acorn");
const { createRequire } = require("node:module");
const { createResourceMap } = require("../replay/resource-map");

function dependency(name) {
  try {
    return require(name);
  } catch (_) {}
  const modules =
    process.env.BROWSER_MODULES ||
    path.join(
      process.env.HOME,
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
    );
  return createRequire(path.join(modules, "package.json"))(name);
}
const { chromium } = dependency("playwright");
const { PNG } = dependency("pngjs");
const resources = createResourceMap();
// Reuse the tested clock and exact HAR route without executing the other verifier's run.
const sharedSource = fs.readFileSync(
  path.join(__dirname, "verify-reconstruction.cjs"),
  "utf8",
);
const sharedTree = acorn.parse(sharedSource, { ecmaVersion: "latest" });
const helperNames = [
  "controlledClock",
  "untouchedReference",
  "ready",
  "compareImages",
  "state",
];
const helperSource = helperNames
  .map((name) => {
    const declaration = sharedTree.body.find(
      (node) => node.type === "FunctionDeclaration" && node.id.name === name,
    );
    assert.ok(declaration, `Shared verification helper ${name} is missing`);
    return sharedSource.slice(declaration.start, declaration.end);
  })
  .join("\n");
const shared = vm.runInNewContext(
  helperSource +
    "\n({controlledClock,untouchedReference,ready,compareImages,state})",
  { assert, fs, path, PNG, resources, URL },
);
const popupUrl =
  "https://act.mihoyo.com/ys/event/e20250310nodkrai-skctj9/images/popup_bg.eef4a833..png";
const popupPath = path.resolve(
  __dirname,
  "../app/ui-assets/popup-background.png",
);
const popupBytes = fs.readFileSync(popupPath);
const output = path.resolve(
  process.env.INTRODUCTION_OUTPUT || "artifacts/introduction",
);

async function modalState(page, reconstructed) {
  return page.evaluate(
    ({ reconstructed, diagnostics }) => {
      const mask = document.querySelector(
        reconstructed ? ".rules-mask" : ".custom-mihoyo-common-mask",
      );
      if (!mask || mask.hidden) return { visible: false };
      const content = mask.querySelector(
        reconstructed ? ".popup-container" : ".custom-mihoyo-common-container",
      );
      const maskStyle = getComputedStyle(mask),
        contentStyle = getComputedStyle(content);
      return {
        visible: true,
        backdrop: maskStyle.backgroundColor,
        contentOpacity: contentStyle.opacity,
        ancestors: Array.from(
          (function* () {
            for (
              let element = mask.parentElement;
              element;
              element = element.parentElement
            ) {
              const style = getComputedStyle(element);
              yield {
                tag: element.tagName,
                id: element.id,
                classes: element.className,
                position: style.position,
                transform: style.transform,
                opacity: style.opacity,
                animation: style.animation,
                zIndex: style.zIndex,
                isolation: style.isolation,
              };
            }
          })(),
        ),
        styles: diagnostics
          ? Object.fromEntries(
              [
                ["mask", mask],
                ["container", content],
                ["body", mask.querySelector(".popup-body")],
              ].map(([name, element]) => {
                const style = getComputedStyle(element);
                return [
                  name,
                  Object.fromEntries(
                    Array.from(style).map((property) => [
                      property,
                      style.getPropertyValue(property),
                    ]),
                  ),
                ];
              }),
            )
          : undefined,
        mouseUniforms: Object.fromEntries(
          Object.entries(
            (window.__moonApp || Vue.prototype.$effectVue).player
              .uniformSetting,
          )
            .filter(([name]) => /mouse|offset/i.test(name))
            .map(([name, uniform]) => [
              name,
              { x: uniform.value?.x, y: uniform.value?.y },
            ]),
        ),
        geometries: Object.fromEntries(
          [
            ".popup-body",
            ".popup-title",
            ".popup-content",
            ".scrollContainer",
            ".scrollContent",
            ".popup-close",
          ].map((selector) => [
            selector,
            mask.querySelector(selector).getBoundingClientRect().toJSON(),
          ]),
        ),
        text: mask.querySelector(".scrollContent").textContent,
        animations: [mask, content].flatMap((element) =>
          element.getAnimations().map((animation) => ({
            name: animation.animationName || animation.transitionProperty,
            age: animation.currentTime,
            duration: animation.effect.getTiming().duration,
          })),
        ),
      };
    },
    { reconstructed, diagnostics: Boolean(process.env.INTRODUCTION_STYLES) },
  );
}

/** Keep modal cleanup deadlines on the same timeline as CSS, after startup has finished. */
function installModalTimers() {
  const nativeSetTimeout = window.setTimeout.bind(window);
  const nativeClearTimeout = window.clearTimeout.bind(window);
  const timers = new Map();
  let nextId = 1000000;
  window.setTimeout = (callback, delay = 0, ...args) => {
    const id = ++nextId;
    timers.set(id, {
      at: __captureClock.time + Math.max(0, Number(delay) || 0),
      callback,
      args,
    });
    return id;
  };
  window.clearTimeout = (id) => {
    if (!timers.delete(id)) nativeClearTimeout(id);
  };
  const step = __captureClock.step.bind(__captureClock);
  __captureClock.step = async (frames) => {
    for (let frame = 0; frame < frames; frame++) {
      await step(1);
      for (let pass = 0; pass < 100; pass++) {
        const due = Array.from(timers)
          .filter(([, timer]) => timer.at <= __captureClock.time)
          .sort((a, b) => a[1].at - b[1].at || a[0] - b[0]);
        if (!due.length) break;
        for (const [id, timer] of due) {
          if (!timers.delete(id)) continue;
          if (typeof timer.callback === "function")
            timer.callback(...timer.args);
          else window.eval(String(timer.callback));
        }
        await __captureClock.flush();
      }
    }
    return __captureClock.time;
  };
  window.__modalTimerCleanup = () => {
    window.setTimeout = nativeSetTimeout;
    window.clearTimeout = nativeClearTimeout;
  };
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const report = {
    reference:
      "Captured original entry, business code, CSS, localization and fonts fulfilled unchanged from HAR records.",
    assetSupplement: {
      url: popupUrl,
      file: path.relative(path.resolve(__dirname, ".."), popupPath),
      sha256: crypto.createHash("sha256").update(popupBytes).digest("hex"),
      reason:
        "This official popup background was not present in the HAR capture. Only this exact asset URL is supplemented.",
    },
    clock:
      "The same seeded 60 Hz clock and per-animation birth times as verify-reconstruction; modal DOM timeout deadlines also advance on that clock after startup. Screenshots cover the complete viewport without pixel thresholds.",
    scenarios: [],
    diagnosticCss: process.env.INTRODUCTION_DIAGNOSTIC_CSS || null,
  };
  try {
    const configs = [
      { width: 1200, height: 660, dpr: 1 },
      { width: 1920, height: 1080, dpr: 2 },
    ];
    const selectedConfigs = process.env.INTRODUCTION_QUICK
      ? configs.slice(0, 1)
      : configs;
    const selectedViewports = selectedConfigs.filter(
      (config) =>
        !process.env.INTRODUCTION_VIEWPORT ||
        `${config.width}x${config.height}@${config.dpr}` ===
          process.env.INTRODUCTION_VIEWPORT,
    );
    assert.ok(
      selectedViewports.length > 0,
      "No introduction viewport matches the requested selection",
    );
    for (const config of selectedViewports) {
      const label = `${config.width}x${config.height}@${config.dpr}`;
      const contexts = await Promise.all(
        [0, 1].map(() =>
          browser.newContext({
            viewport: { width: config.width, height: config.height },
            deviceScaleFactor: config.dpr,
          }),
        ),
      );
      const pages = await Promise.all(
        contexts.map((context) => context.newPage()),
      );
      const scenario = {
        label,
        checkpoints: [],
        issues: pages.map(() => ({ errors: [], missing: [], failed: [] })),
      };
      report.scenarios.push(scenario);
      try {
        for (let index = 0; index < pages.length; index++) {
          await pages[index].addInitScript(shared.controlledClock);
          pages[index].on("pageerror", (error) =>
            scenario.issues[index].errors.push(error.message),
          );
          pages[index].on("requestfailed", (request) =>
            scenario.issues[index].failed.push(request.url()),
          );
          pages[index].on("response", (response) => {
            if (response.status() >= 400)
              scenario.issues[index].missing.push([
                response.status(),
                response.url(),
              ]);
          });
        }
        await pages[0].route("**/*", (route) => {
          if (route.request().url() === popupUrl)
            return route.fulfill({
              status: 200,
              contentType: "image/png",
              body: popupBytes,
              headers: {
                "access-control-allow-origin": "https://ys.mihoyo.com",
              },
            });
          return shared.untouchedReference(route);
        });
        await Promise.all([
          pages[0].goto("https://ys.mihoyo.com/moon", {
            waitUntil: "domcontentloaded",
          }),
          pages[1].goto(
            process.env.RECONSTRUCTION_URL ||
              process.env.RECON_URL ||
              "http://127.0.0.1:4174",
            {
              waitUntil: "domcontentloaded",
            },
          ),
        ]);
        await Promise.all(
          pages.map((page, index) => shared.ready(page, index === 1)),
        );
        if (report.diagnosticCss)
          await pages[1].addStyleTag({ content: report.diagnosticCss });
        await Promise.all(
          pages.map((page, index) =>
            page.evaluate(
              async (url) => {
                const image = new Image();
                image.src = url;
                await image.decode();
              },
              index === 0 ? popupUrl : "/ui-assets/popup-background.png",
            ),
          ),
        );
        async function advance(frames) {
          await Promise.all(
            pages.map((page) =>
              page.evaluate((frames) => __captureClock.step(frames), frames),
            ),
          );
        }
        async function capture(name) {
          const buffers = await Promise.all(
            pages.map((page, index) =>
              page.screenshot({
                path: path.join(
                  output,
                  `${label}-${name}-${index ? "local" : "original"}.png`,
                ),
              }),
            ),
          );
          const states = await Promise.all(
            pages.map((page, index) => modalState(page, index === 1)),
          );
          const checkpoint = {
            name,
            states,
            sceneStates: await Promise.all(pages.map(shared.state)),
            wheelHints: await Promise.all(
              pages.map((page) =>
                page.evaluate(() => {
                  const element = document.querySelector(".wheel-hint");
                  const style = getComputedStyle(element);
                  return {
                    classes: element.className,
                    opacity: style.opacity,
                    display: style.display,
                    hidden: element.hidden,
                  };
                }),
              ),
            ),
            ...shared.compareImages(
              buffers[0],
              buffers[1],
              path.join(output, `${label}-${name}-diff.png`),
            ),
          };
          scenario.checkpoints.push(checkpoint);
          console.log(
            JSON.stringify({
              label,
              name,
              differentPixels: checkpoint.differentPixels,
              maxChannelError: checkpoint.maxChannelError,
              motion: states.map((state) => [
                state.backdrop,
                state.contentOpacity,
              ]),
            }),
          );
          fs.writeFileSync(
            path.join(output, "report.json"),
            JSON.stringify(report, null, 2),
          );
        }
        await advance(90);
        await Promise.all(
          pages.map((page) =>
            page.evaluate(() => document.querySelector(".start-hint").click()),
          ),
        );
        await Promise.all(
          pages.map((page) => page.evaluate(() => __captureClock.flush())),
        );
        await advance(1200);
        await capture("before");
        await Promise.all(
          pages.map((page) => page.evaluate(installModalTimers)),
        );
        await Promise.all(
          pages.map((page, index) =>
            page
              .locator(index === 0 ? ".rule_xjvqi" : ".rules-button")
              .click({ force: true }),
          ),
        );
        await Promise.all(
          pages.map((page) =>
            page.mouse.move(config.width / 2, config.height / 2),
          ),
        );
        await Promise.all(
          pages.map((page) => page.evaluate(() => __captureClock.flush())),
        );
        await capture("enter-start");
        await advance(6);
        await capture("enter-0.1s");
        await advance(9);
        await capture("enter-0.25s");
        await advance(15);
        await capture("enter-0.5s");
        // SDK and authored cleanup timers run in real time, while the image/timeline clock stays frozen.
        await Promise.all(pages.map((page) => page.waitForTimeout(300)));
        await capture("settled");
        await Promise.all(
          pages.map((page) =>
            page.locator(".popup-close").click({ force: true }),
          ),
        );
        await Promise.all(
          pages.map((page) =>
            page.mouse.move(config.width / 2, config.height / 2),
          ),
        );
        await Promise.all(
          pages.map((page) => page.evaluate(() => __captureClock.flush())),
        );
        await capture("exit-start");
        await advance(6);
        await capture("exit-0.1s");
        await advance(12);
        await Promise.all(pages.map((page) => page.waitForTimeout(250)));
        await capture("closed");
      } finally {
        await Promise.all(contexts.map((context) => context.close()));
      }
    }
  } catch (error) {
    report.failure = error.message;
    throw error;
  } finally {
    await browser.close();
    fs.writeFileSync(
      path.join(output, "report.json"),
      JSON.stringify(report, null, 2),
    );
  }
  const differences = report.scenarios.flatMap((scenario) =>
    scenario.checkpoints.filter((checkpoint) => checkpoint.differentPixels > 0),
  );
  const localIssues = report.scenarios.flatMap((scenario) =>
    Object.values(scenario.issues[1]).flat(),
  );
  report.summary = {
    checkpoints: report.scenarios.reduce(
      (count, scenario) => count + scenario.checkpoints.length,
      0,
    ),
    differentCheckpoints: differences.length,
    localIssues: localIssues.length,
    passed: differences.length === 0 && localIssues.length === 0,
  };
  fs.writeFileSync(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2),
  );
  assert.equal(
    localIssues.length,
    0,
    "Introduction encountered browser or resource errors",
  );
  assert.equal(
    differences.length,
    0,
    `Introduction has ${differences.length} pixel mismatches; inspect ${output}/report.json`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
