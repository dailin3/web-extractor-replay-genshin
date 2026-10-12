const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { test } = require("node:test");
const acorn = require("acorn");

/** Exercise the real startup entry up to UI creation, without requiring a GPU. */
async function initializeUntilUI({ getStorage, search = "" }) {
  const source = fs.readFileSync(require.resolve("../app/main.mjs"), "utf8");
  const imports = acorn
    .parse(source, { ecmaVersion: "latest", sourceType: "module" })
    .body.filter((node) => node.type === "ImportDeclaration");
  const reachedUI = new Error("Reached UI creation");
  let uiCreated = false;
  const context = {
    window: {},
    location: { search },
    URLSearchParams,
    MOON_PROGRESS_KEY: "e20250310nodkrai_moonStars",
    THREE: {},
    utils: {},
    loadSceneData: async () => ({ words: {}, font: { src: "/font.woff2" } }),
    loadFont: async () => {},
    createUI() {
      uiCreated = true;
      throw reachedUI;
    },
    showInitializationError() {},
    console: { error() {} },
  };
  Object.defineProperty(context, "localStorage", { get: getStorage });
  for (const declaration of imports) {
    if (declaration.source.value !== "./storage.mjs") continue;
    const storage = await import("../app/storage.mjs");
    for (const specifier of declaration.specifiers)
      context[specifier.local.name] = storage[specifier.imported.name];
  }
  let executable = source;
  for (const declaration of [...imports].reverse())
    executable =
      executable.slice(0, declaration.start) +
      executable.slice(declaration.end);
  vm.runInNewContext(executable, context);
  for (let count = 0; count < 12; count++) await Promise.resolve();
  return { uiCreated, error: context.window.__moonApp.error };
}

test("unavailable optional progress storage does not prevent UI initialization", async () => {
  const result = await initializeUntilUI({
    getStorage() {
      throw new Error("Storage access denied");
    },
  });
  assert.equal(result.uiCreated, true);
  assert.equal(result.error, "Reached UI creation");
});

test("a rejected progress reset does not prevent UI initialization", async () => {
  const result = await initializeUntilUI({
    getStorage: () => ({
      removeItem() {
        throw new Error("Storage reset denied");
      },
    }),
  });
  assert.equal(result.uiCreated, true);
  assert.equal(result.error, "Reached UI creation");
});

test("fresh startup still resets only the captured moon progress key", async () => {
  const removed = [];
  const result = await initializeUntilUI({
    getStorage: () => ({ removeItem: (key) => removed.push(key) }),
  });
  assert.equal(result.uiCreated, true);
  assert.deepEqual(removed, ["e20250310nodkrai_moonStars"]);
});

test("keepProgress still preserves the saved moon progress", async () => {
  const removed = [];
  const result = await initializeUntilUI({
    search: "?keepProgress",
    getStorage: () => ({ removeItem: (key) => removed.push(key) }),
  });
  assert.equal(result.uiCreated, true);
  assert.deepEqual(removed, []);
});
