const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { test, before, after } = require("node:test");
const { createAppServer } = require("../app-server.cjs");

let server, origin;
before(async () => {
  server = createAppServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("entry loads the authored module and cannot run original business bundles", async () => {
  const entry = await fetch(origin);
  assert.equal(entry.status, 200);
  const html = await entry.text();
  assert.match(html, /type="module" src="\/main\.mjs"/);
  assert.doesNotMatch(
    html,
    /webpack|vue|index_44ff|styles_ea499|mihoyo-account/,
  );
  for (const file of [
    "index_44ff6b130c7baea7b639.js",
    "styles_ea49998b3e6538661843.js",
    "vendors_3c19dbfdd57bec9e83ae.js",
    "vue.runtime.min.js",
  ]) {
    assert.equal((await fetch(`${origin}/local-assets/${file}`)).status, 403);
  }
});

test("original binary textures are available unchanged, with unknown files denied", async () => {
  const name = "p3_moon.f9c548ee..png";
  const expected = fs.readFileSync(
    path.resolve("projects/ys.mihoyo.com/assets", name),
  );
  const response = await fetch(`${origin}/local-assets/${name}`);
  assert.equal(response.status, 200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
  for (const route of [
    "/local-assets/missing.png",
    "/local-assets/..%2Fpackage.json",
    "/..%2Fpackage.json",
  ]) {
    assert.equal((await fetch(origin + route)).status, 404);
  }
});

test("authored app files have correct module MIME, binary audio supports ranges", async () => {
  const main = await fetch(`${origin}/main.mjs`);
  assert.match(main.headers.get("content-type"), /javascript/);
  const manifest = require("../projects/ys.mihoyo.com/url_mapping.json");
  const audio = Object.values(manifest.url_mapping).find((record) =>
    /sound_moon_in_.*\.mp3$/.test(record.local_file),
  );
  const sound = await fetch(
    `${origin}/local-assets/${path.basename(audio.local_file)}`,
    { headers: { range: "bytes=0-15" } },
  );
  assert.equal(sound.status, 206);
  assert.equal((await sound.arrayBuffer()).byteLength, 16);
});

test("standalone app starts with packed assets and no captured project directory", async () => {
  const appDir = fs.mkdtempSync(path.join(os.tmpdir(), "moon-standalone-"));
  fs.mkdirSync(path.join(appDir, "local-assets"));
  fs.writeFileSync(
    path.join(appDir, "index.html"),
    "<title>Standalone moon</title>",
  );
  const bytes = Buffer.from([0, 14, 255, 23]);
  fs.writeFileSync(path.join(appDir, "local-assets/scene.png"), bytes);
  const standalone = createAppServer({ appDir, projectDir: null });
  try {
    await new Promise((resolve) => standalone.listen(0, "127.0.0.1", resolve));
    const url = `http://127.0.0.1:${standalone.address().port}`;
    assert.match(await (await fetch(url)).text(), /Standalone moon/);
    const asset = await fetch(url + "/local-assets/scene.png");
    assert.equal(asset.status, 200);
    assert.deepEqual(Buffer.from(await asset.arrayBuffer()), bytes);
    assert.equal((await fetch(url + "/local-assets/missing.png")).status, 404);
    assert.equal(
      (await fetch(url + "/local-assets/..%2Findex.html")).status,
      404,
    );
  } finally {
    await new Promise((resolve) => standalone.close(resolve));
    fs.rmSync(appDir, { recursive: true, force: true });
  }
});
