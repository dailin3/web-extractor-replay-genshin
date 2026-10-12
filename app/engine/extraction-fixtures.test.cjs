const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const vm = require("node:vm");
const { test } = require("node:test");
const {
  transformRendererModule,
  MODULE_NAMES,
  resolveOutputDirectory,
  extractEngine,
} = require("../../tools/extract-engine.cjs");

/** Exercise the generated files through Node's real ES module loader. */
function moduleFixture(t, factories, sources = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "moon-esm-fixture-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.writeFileSync(path.join(directory, "package.json"), '{"type":"module"}');
  for (const [id, source] of Object.entries(sources)) {
    fs.writeFileSync(path.join(directory, `${MODULE_NAMES[id]}.js`), source);
  }
  for (const [id, source] of Object.entries(factories)) {
    const factory = vm.runInNewContext(`(${source})`);
    fs.writeFileSync(
      path.join(directory, `${MODULE_NAMES[id]}.js`),
      transformRendererModule(factory, Number(id)),
    );
  }
  return (id) =>
    import(pathToFileURL(path.join(directory, `${MODULE_NAMES[id]}.js`)).href);
}

test("a block-local require does not hide the factory dependency outside that block", async (t) => {
  const load = moduleFixture(
    t,
    {
      2: `function(module, exports, require) {
      function read() {
        const value = require(4).default;
        { let require = () => 7; exports.local = require(); }
        return value;
      }
      exports.result = read();
    }`,
    },
    { 4: "export default 42;" },
  );
  const converted = await load(2);
  assert.equal(converted.result, 42);
  assert.equal(converted.local, 7);
});

test("a catch parameter named exports retains its own object writes", async (t) => {
  const load = moduleFixture(t, {
    2: `function(module, exports, require) {
      exports.result = 1;
      try { throw { result: 9 }; }
      catch (exports) { exports.result = 8; }
    }`,
  });
  assert.equal((await load(2)).result, 1);
});

test("a named function expression named require keeps its recursive binding", async (t) => {
  const load = moduleFixture(
    t,
    {
      2: `function(module, exports, require) {
      const count = function require(depth) { return depth === 4 ? 10 : require(4); };
      exports.result = count(1);
    }`,
    },
    { 4: "export default 99;" },
  );
  assert.equal((await load(2)).result, 10);
});

test("generated exports remain live after a function mutates them", async (t) => {
  const load = moduleFixture(t, {
    2: `function(module, exports, require) {
      const dependency = require(4);
      exports.read = () => dependency.counter;
      exports.increment = () => dependency.increment();
    }`,
    4: `function(module, exports, require) {
      exports.counter = 1;
      exports.increment = () => { exports.counter += 1; };
    }`,
  });
  const observer = await load(2);
  const state = await load(4);
  assert.equal(observer.read(), 1);
  observer.increment();
  assert.equal(observer.read(), 2);
  assert.equal(state.counter, 2);
});

test("cyclic modules defer peer reads and observe subsequent live export updates", async (t) => {
  const load = moduleFixture(t, {
    2: `function(module, exports, require) {
      const peer = require(4);
      exports.label = 'A';
      exports.readPeer = () => peer.label;
      exports.readCounter = () => peer.counter;
    }`,
    4: `function(module, exports, require) {
      const peer = require(2);
      exports.label = 'B';
      exports.counter = 1;
      exports.readPeer = () => peer.label;
      exports.increment = () => { exports.counter += 1; };
    }`,
  });
  const first = await load(2);
  const second = await load(4);
  assert.equal(first.readPeer(), "B");
  assert.equal(second.readPeer(), "A");
  second.increment();
  assert.equal(first.readCounter(), 2);
});

test("raw recovery defaults to an oracle directory outside maintained engine sources", () => {
  assert.equal(typeof resolveOutputDirectory, "function");
  assert.equal(
    resolveOutputDirectory(),
    path.resolve("artifacts/reference-engine"),
  );
});

test("raw recovery rejects maintained engine paths before writing any files", () => {
  assert.equal(typeof resolveOutputDirectory, "function");
  for (const output of [
    ".",
    "app",
    "app/engine",
    "app/engine/renderer",
    "app/engine/renderer/new",
  ]) {
    assert.throws(() => resolveOutputDirectory(output), /maintained engine/i);
  }
});

test("raw recovery cannot bypass maintained source protection through a directory symlink", (t) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "moon-engine-alias-"),
  );
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const alias = path.join(directory, "engine-alias");
  fs.symlinkSync(path.resolve("app/engine"), alias, "dir");
  assert.throws(() => resolveOutputDirectory(alias), /maintained engine/i);
  assert.throws(
    () => resolveOutputDirectory(path.join(alias, "new")),
    /maintained engine/i,
  );
});

test("raw recovery checks nested output directories before writing any artifact", async (t) => {
  // Intercept writes: a failing protection test must never clobber actual source.
  t.mock.method(fs, "writeFileSync", () => {});
  for (const name of ["renderer", "vendor"]) {
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "moon-nested-alias-"),
    );
    t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
    fs.symlinkSync(
      path.resolve("app/engine", name),
      path.join(directory, name),
      "dir",
    );
    await assert.rejects(
      extractEngine({ output: directory }),
      /maintained engine/i,
    );
    assert.deepEqual(fs.readdirSync(directory), [name]);
  }
});

test("raw recovery checks existing output file symlinks before writing any artifact", async (t) => {
  t.mock.method(fs, "writeFileSync", () => {});
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "moon-file-alias-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, "renderer"));
  const sourceFile = path.resolve("app/engine/renderer/scene-data.js");
  const before = fs.readFileSync(sourceFile);
  fs.symlinkSync(sourceFile, path.join(directory, "renderer/scene-data.js"));
  await assert.rejects(
    extractEngine({ output: directory }),
    /maintained engine/i,
  );
  assert.deepEqual(fs.readFileSync(sourceFile), before);
  assert.deepEqual(fs.readdirSync(directory), ["renderer"]);
});

test("raw recovery rejects dangling output file symlinks before any write", async (t) => {
  t.mock.method(fs, "writeFileSync", () => {});
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "moon-dangling-alias-"),
  );
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, "renderer"));
  const target = path.resolve(
    "app/engine/renderer",
    path.basename(directory) + ".js",
  );
  assert.equal(fs.existsSync(target), false);
  fs.symlinkSync(target, path.join(directory, "renderer/source-loader.js"));
  await assert.rejects(
    extractEngine({ output: directory }),
    /dangling|maintained engine/i,
  );
  assert.equal(fs.existsSync(target), false);
  assert.deepEqual(fs.readdirSync(directory), ["renderer"]);
});

test("explicit outputDir creates raw artifacts without overwriting maintained decode fixes", async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "moon-raw-engine-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const maintained = path.resolve("app/engine/renderer/source-loader.js");
  const before = fs.readFileSync(maintained);
  // This guard also ensures a missing outputDir implementation cannot fall back
  // to the old destructive destination while this test is in the red phase.
  assert.equal(typeof resolveOutputDirectory, "function");
  const result = await extractEngine({ outputDir: directory });
  assert.equal(result.output, directory);
  assert.equal(result.modules, 59);
  assert.equal(
    fs.existsSync(path.join(directory, "renderer/source-loader.js")),
    true,
  );
  assert.deepEqual(fs.readFileSync(maintained), before);
});
