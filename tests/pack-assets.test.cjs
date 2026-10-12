const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createResourceMap } = require("../replay/resource-map");

function packAssets(options) {
  const filename = path.join(__dirname, "../tools/pack-assets.cjs");
  assert.ok(fs.existsSync(filename), "The offline asset packer must exist");
  const packer = require(filename);
  assert.equal(typeof packer.packAssets, "function");
  return packer.packAssets(options);
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "moon-pack-assets-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const appDir = path.join(root, "app");
  const captureDir = path.join(root, "capture");
  fs.mkdirSync(appDir);
  fs.mkdirSync(path.join(captureDir, "assets"), { recursive: true });
  const sourceFiles = {
    "scene.png": Buffer.from([0, 255, 17, 128]),
    "choir.mp3": Buffer.from([73, 68, 51]),
    "unused.png": Buffer.from([99]),
    "original.js": Buffer.from("window.originalBusinessEntry = true;"),
  };
  const urlMapping = {};
  for (const [name, bytes] of Object.entries(sourceFiles)) {
    fs.writeFileSync(path.join(captureDir, "assets", name), bytes);
    urlMapping[`https://assets.example/${name}`] = {
      local_file: `assets/${name}`,
      method: "GET",
    };
  }
  fs.writeFileSync(
    path.join(captureDir, "url_mapping.json"),
    JSON.stringify({
      entry_point: { origin: "https://assets.example/scene.png" },
      url_mapping: urlMapping,
    }),
  );
  function write(relative, text) {
    const filename = path.join(appDir, relative);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, text);
  }
  return {
    appDir,
    outputDir: path.join(appDir, "local-assets"),
    resources: createResourceMap(captureDir),
    sourceFiles,
    write,
  };
}

test("packing preserves the referenced binary bytes and excludes unused capture files", (t) => {
  const input = fixture(t);
  input.write("index.html", '<img src="/local-assets/scene.png">');
  input.write("data/assets.json", '{"background":"/local-assets/choir.mp3"}');
  const result = packAssets(input);
  assert.equal(result.files, 2);
  assert.equal(result.bytes, 7);
  assert.equal(result.copied, 2);
  assert.deepEqual(fs.readdirSync(input.outputDir).sort(), ["choir.mp3", "scene.png"]);
  assert.deepEqual(fs.readFileSync(path.join(input.outputDir, "scene.png")), input.sourceFiles["scene.png"]);
  assert.deepEqual(fs.readFileSync(path.join(input.outputDir, "choir.mp3")), input.sourceFiles["choir.mp3"]);
});

test("duplicate references in multiple runtime files produce one packed asset", (t) => {
  const input = fixture(t);
  input.write("index.html", '<img src="/local-assets/scene.png"><img src="/local-assets/scene.png">');
  input.write("ui.css", 'body{background:url("/local-assets/scene.png")}');
  const result = packAssets(input);
  assert.equal(result.files, 1);
  assert.equal(result.copied, 1);
  assert.equal(result.bytes, 4);
  assert.deepEqual(result.assets.map((asset) => asset.url), ["/local-assets/scene.png"]);
});

test("an unknown reference fails before any files are copied", (t) => {
  const input = fixture(t);
  input.write("index.html", '<img src="/local-assets/scene.png"><img src="/local-assets/zz-missing.png">');
  assert.throws(() => packAssets(input), /Unknown captured asset.*zz-missing\.png/);
  assert.equal(fs.existsSync(input.outputDir), false);
});

test("a captured executable is rejected instead of entering the static app", (t) => {
  const input = fixture(t);
  input.write("main.mjs", 'const source = "/local-assets/original.js";');
  assert.throws(() => packAssets(input), /Disallowed captured asset.*original\.js/);
  assert.equal(fs.existsSync(input.outputDir), false);
});

test("packing ignores verification scripts, provenance and already packed files", (t) => {
  const input = fixture(t);
  input.write("data/images.json", '{"image":"/local-assets/scene.png"}');
  input.write("README.md", "Reference-only /local-assets/missing-doc.png");
  input.write("engine/verify.browser.cjs", 'const test = "/local-assets/original.js";');
  input.write("data/extraction.json", '{"original":"/local-assets/original.js"}');
  input.write("local-assets/README.md", "Generated /local-assets/missing-packed.png");
  const result = packAssets(input);
  assert.equal(result.files, 1);
  assert.deepEqual(result.assets.map((asset) => asset.filename), ["scene.png"]);
});

test("packing twice leaves matching output bytes and modification times unchanged", (t) => {
  const input = fixture(t);
  input.write("data/images.json", '{"image":"/local-assets/scene.png"}');
  packAssets(input);
  const destination = path.join(input.outputDir, "scene.png");
  fs.utimesSync(destination, new Date(1000), new Date(1000));
  const before = fs.statSync(destination).mtimeMs;
  const result = packAssets(input);
  assert.equal(result.copied, 0);
  assert.equal(result.unchanged, 1);
  assert.equal(fs.statSync(destination).mtimeMs, before);
  assert.deepEqual(fs.readFileSync(destination), input.sourceFiles["scene.png"]);
});

test("packing repairs an existing binary whose bytes differ from its captured source", (t) => {
  const input = fixture(t);
  input.write("data/images.json", '{"image":"/local-assets/scene.png"}');
  packAssets(input);
  const destination = path.join(input.outputDir, "scene.png");
  fs.writeFileSync(destination, Buffer.from([1, 2]));
  const result = packAssets(input);
  assert.equal(result.copied, 1);
  assert.deepEqual(fs.readFileSync(destination), input.sourceFiles["scene.png"]);
});
