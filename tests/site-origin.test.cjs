const assert = require("node:assert/strict");
const { test } = require("node:test");
const { findExternalRequests } = require("../scripts/site-origin.cjs");

test("deployed browser verification permits its own origin and rejects other origins", () => {
  const same = { url: "https://dailin3.github.io/moon/data/images.json" };
  const remote = { url: "https://act.mihoyo.com/image.png" };
  const protocol = { url: "http://dailin3.github.io/moon/image.png" };
  const port = { url: "https://dailin3.github.io:8443/moon/image.png" };
  const blob = { url: "blob:https://dailin3.github.io/local-id" };
  assert.deepEqual(
    findExternalRequests(
      [same, remote, protocol, port, blob],
      "https://dailin3.github.io/moon/",
    ),
    [remote, protocol, port],
  );
  assert.deepEqual(
    findExternalRequests(
      [{ url: "http://127.0.0.1:4174/main.mjs" }],
      "http://127.0.0.1:4174/",
    ),
    [],
  );
});
