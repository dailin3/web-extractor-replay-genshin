const assert = require("node:assert/strict");
const { test, before } = require("node:test");

let createSourceLoader;
before(async () => {
  // The maintained loader is independently importable, without Three/regenerator.
  ({ createSourceLoader } =
    await import("../app/engine/renderer/source-loader.js"));
});

/** Stub only the browser transport and decoder; exercise real batching and retries. */
function browserAssets(t, decode) {
  const previous = {
    Image: globalThis.Image,
    XMLHttpRequest: globalThis.XMLHttpRequest,
    window: globalThis.window,
  };
  const attempts = new Map();
  globalThis.window = { URL: { createObjectURL: (blob) => blob.src } };
  globalThis.XMLHttpRequest = class {
    open(method, url) {
      this.url = url;
    }
    send() {
      queueMicrotask(() => {
        this.readyState = 4;
        this.status = 200;
        this.statusText = "OK";
        this.response = { src: this.url };
        this.onreadystatechange();
      });
    }
  };
  globalThis.Image = class {
    set src(source) {
      this.source = source;
      const attempt = (attempts.get(source) || 0) + 1;
      attempts.set(source, attempt);
      queueMicrotask(() => {
        if (decode(source, attempt)) this.onload();
        else this.onerror?.({ type: "error" });
      });
    }
  };
  t.after(() => Object.assign(globalThis, previous));
  return attempts;
}

async function settlement(promise) {
  let timer;
  try {
    return await Promise.race([
      promise.then(
        (value) => ({ status: "fulfilled", value }),
        (error) => ({ status: "rejected", error }),
      ),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve({ status: "pending" }), 100);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

test("a corrupt image rejects decoding instead of leaving startup pending", async (t) => {
  browserAssets(t, () => false);
  const loader = createSourceLoader();
  const result = await settlement(
    loader.resourceCompile(
      { response: { src: "/broken.png" } },
      {
        type: "image",
        src: "/broken.png",
        id: "broken-image",
      },
    ),
  );
  assert.equal(result.status, "rejected");
  assert.match(result.error.message, /broken-image/);
});

test("a corrupt 404 placeholder rejects decoding instead of leaving startup pending", async (t) => {
  browserAssets(t, () => false);
  const loader = createSourceLoader();
  const result = await settlement(
    loader.resourceCompile(
      { type: 404, result: "/placeholder.png" },
      {
        type: "image",
        src: "/missing.png",
        id: "placeholder-image",
      },
    ),
  );
  assert.equal(result.status, "rejected");
  assert.match(result.error.message, /placeholder-image/);
});

test("permanent decode failure exhausts the existing retry and reports the failed asset", async (t) => {
  const attempts = browserAssets(t, (source) => source === "/good.png");
  const failures = [];
  const progress = [];
  const loader = createSourceLoader();
  loader.setEventListener("error", (list) => failures.push(list));
  loader.setEventListener("progress", (ratio) => progress.push(ratio));
  const good = { type: "image", src: "/good.png", id: "good" };
  const bad = { type: "image", src: "/bad.png", id: "bad" };
  const result = await settlement(loader.load([good, bad]));
  assert.equal(result.status, "rejected");
  assert.deepEqual(result.error, [bad]);
  assert.deepEqual(failures, [[bad]]);
  assert.equal(attempts.get("/bad.png"), 2);
  assert.equal(attempts.get("/good.png"), 1);
  assert.deepEqual(progress, [0.5]);
  assert.equal(loader.getResult("good").source, "/good.png");
  assert.equal(loader.getResult("bad"), null);
});

test("a successful decode retry completes progress and retains the decoded image", async (t) => {
  const attempts = browserAssets(
    t,
    (source, attempt) => source === "/good.png" || attempt === 2,
  );
  const loader = createSourceLoader();
  const progress = [];
  const failures = [];
  loader.setEventListener("progress", (ratio) => progress.push(ratio));
  loader.setEventListener("error", (list) => failures.push(list));
  const result = await settlement(
    loader.load([
      { type: "image", src: "/good.png", id: "good" },
      { type: "image", src: "/retry.png", id: "retry" },
    ]),
  );
  assert.equal(result.status, "fulfilled");
  assert.equal(attempts.get("/good.png"), 1);
  assert.equal(attempts.get("/retry.png"), 2);
  assert.deepEqual(progress, [0.5, 1]);
  assert.deepEqual(failures, []);
  assert.equal(loader.getResult("retry").source, "/retry.png");
});

test("successful image loading keeps the original completion flow", async (t) => {
  browserAssets(t, () => true);
  const loader = createSourceLoader();
  const progress = [];
  loader.setEventListener("progress", (ratio) => progress.push(ratio));
  const result = await settlement(
    loader.load([{ type: "image", src: "/good.png", id: "good" }]),
  );
  assert.equal(result.status, "fulfilled");
  assert.deepEqual(progress, [1]);
  assert.equal(loader.getResult("good").source, "/good.png");
});

test("an empty manifest reports progress synchronously and completion in a microtask", async () => {
  const loader = createSourceLoader();
  const calls = [];
  loader.setEventListener("progress", (ratio) =>
    calls.push(["progress", ratio]),
  );
  loader.setEventListener("complete", () => calls.push(["complete"]));
  const loaded = loader.load([]);
  assert.deepEqual(calls, [["progress", 1]]);
  await loaded;
  assert.deepEqual(calls, [["progress", 1], ["complete"]]);
});

test("non-image results and response types retain the transport data", async () => {
  const loader = createSourceLoader();
  const buffer = new ArrayBuffer(4);
  assert.equal(
    await loader.resourceCompile(
      { response: buffer },
      { type: "audio", id: "audio" },
    ),
    buffer,
  );
  assert.deepEqual(
    ["image", "video", "audio", "json", "text"].map((type) =>
      loader.getSourceResponseType(type),
    ),
    ["blob", "blob", "arraybuffer", "json", "text"],
  );
  assert.equal(loader.getResult("missing"), null);
});

test("shared source pool keeps the same manifest/result record and listener removal is effective", async (t) => {
  browserAssets(t, () => true);
  const { SourceLoad } =
    await import("../app/engine/renderer/source-loader.js");
  const sourcePool = {};
  const calls = [];
  const loader = new SourceLoad({ sourcePool });
  loader.setEventListener("progress", () => calls.push("progress"));
  loader.setEventListener("complete", () => calls.push("complete"));
  loader.removeEventListener("progress");
  await loader.load([
    { id: "shared", src: "/good.png", type: "image", extra: 17 },
  ]);
  assert.equal(sourcePool.shared, loader.result.shared);
  assert.equal(sourcePool.shared.extra, 17);
  assert.equal(sourcePool.shared.result, loader.getResult("shared"));
  assert.deepEqual(calls, ["complete"]);
  loader.clearAllListener();
  await loader.load([]);
  assert.deepEqual(calls, ["complete"]);
});
