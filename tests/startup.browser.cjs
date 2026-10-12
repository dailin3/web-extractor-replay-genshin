/** Real browser failures exercise the application catch handler and retry. */
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
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const report = { passed: false, checks: [] };
  try {
    for (const failure of ["font", "webgl"]) {
      const page = await browser.newPage({
        viewport: { width: 1200, height: 660 },
      });
      if (failure === "font")
        await page.route("**/*.woff2", (route) => route.abort());
      else
        await page.addInitScript(() => {
          const getContext = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (type, ...args) {
            if (["webgl", "webgl2", "experimental-webgl"].includes(type))
              return null;
            return getContext.call(this, type, ...args);
          };
        });
      await page.goto(
        process.env.RECONSTRUCTION_URL || "http://127.0.0.1:4174",
      );
      await page.getByRole("alert").waitFor();
      assert.equal(await page.evaluate(() => window.__moonApp.status), "error");
      const retry = page.getByRole("button", { name: "重新加载" });
      assert.equal(await retry.count(), 1);
      assert.equal(
        await page.getByRole("alert").textContent(),
        "页面加载失败，请重新加载。重新加载",
      );
      const check = { failure, usableRetry: true };
      report.checks.push(check);
      if (failure === "font") {
        await page.unroute("**/*.woff2");
        await retry.click();
        await page.waitForFunction(() => window.__moonApp?.ready, null, {
          timeout: 60000,
        });
        assert.equal(await page.getByRole("alert").count(), 0);
        check.retryRecovered = true;
      }
      await page.close();
    }
    report.passed = true;
    console.log(
      "PASS: font/WebGL startup failures are visible; font retry recovers",
    );
  } catch (error) {
    report.failure = error.message;
    throw error;
  } finally {
    fs.mkdirSync("artifacts", { recursive: true });
    fs.writeFileSync(
      "artifacts/startup-errors.json",
      JSON.stringify(report, null, 2),
    );
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
