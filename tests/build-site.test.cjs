const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { buildSite, prefixAssetUrls } = require("../tools/build-site.cjs");

test("prefixes only app root URLs; relative imports, external URLs and GLSL remain intact", () => {
  const source =
    'import "./data/index.mjs"; const a = "/data/shaders/a.glsl"; ' +
    'const b = `/ui-assets/audio-${name}.png`; const c = "/local-assets/moon.png"; ' +
    '<script src="/main.mjs"></script> url("/ui-assets/icon.png") ' +
    '"https://example.com/data/a"; float f = a / data;';
  assert.equal(
    prefixAssetUrls(source, "/moon/"),
    source
      .replace('"/data/', '"/moon/data/')
      .replace("`/ui-assets/", "`/moon/ui-assets/")
      .replace('"/local-assets/', '"/moon/local-assets/')
      .replace('src="/main', 'src="/moon/main')
      .replace('url("/ui-assets/', 'url("/moon/ui-assets/'),
  );
  assert.equal(prefixAssetUrls(source, "/"), source);
});

test("builds an isolated static site with unchanged binary assets and no test tooling", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "moon-build-"));
  const appDir = path.join(root, "app");
  const outputDir = path.join(root, "site");
  try {
    fs.mkdirSync(path.join(appDir, "local-assets"), { recursive: true });
    fs.writeFileSync(
      path.join(appDir, "index.html"),
      '<script src="/main.mjs"></script>',
    );
    fs.writeFileSync(
      path.join(appDir, "main.mjs"),
      'const src = "/local-assets/art.png";',
    );
    fs.writeFileSync(path.join(appDir, "engine.test.cjs"), "must not ship");
    fs.writeFileSync(path.join(appDir, "README.md"), "must not ship");
    const art = Buffer.from([0, 255, 35, 0]);
    fs.writeFileSync(path.join(appDir, "local-assets/art.png"), art);
    const report = buildSite({ appDir, outputDir, basePath: "/moon/" });
    assert.equal(report.files, 3);
    assert.equal(
      fs.readFileSync(path.join(outputDir, "index.html"), "utf8"),
      '<script src="/moon/main.mjs"></script>',
    );
    assert.deepEqual(
      fs.readFileSync(path.join(outputDir, "local-assets/art.png")),
      art,
    );
    assert.equal(fs.existsSync(path.join(outputDir, "engine.test.cjs")), false);
    assert.equal(fs.existsSync(path.join(outputDir, "README.md")), false);
    assert.equal(fs.existsSync(path.join(outputDir, ".nojekyll")), true);
    fs.writeFileSync(path.join(outputDir, "stale.txt"), "old");
    buildSite({ appDir, outputDir, basePath: "/" });
    assert.equal(fs.existsSync(path.join(outputDir, "stale.txt")), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("rejects unsafe deployment paths and refuses to overwrite application source", () => {
  for (const basePath of [
    "https://example.com/",
    "//example.com/",
    "/../",
    "/moon?x=1",
    "/moon/#x",
  ]) {
    assert.throws(() => prefixAssetUrls("", basePath), /base path/i);
  }
  assert.throws(
    () => buildSite({ appDir: "/tmp/moon-app", outputDir: "/tmp/moon-app" }),
    /output/i,
  );
});
