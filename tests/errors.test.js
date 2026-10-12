const { test } = require("node:test");
const assert = require("node:assert/strict");

test("initialization failure has a readable retry action without exposing a stack trace", async () => {
  const { showInitializationError } = await import("../app/errors.mjs");
  const elements = [];
  const document = {
    createElement(tag) {
      const element = {
        tag,
        children: [],
        append(...children) {
          this.children.push(...children);
        },
        setAttribute(name, value) {
          this[name] = value;
        },
        addEventListener(name, callback) {
          this[name] = callback;
        },
      };
      elements.push(element);
      return element;
    },
    body: {
      append(element) {
        this.error = element;
      },
    },
  };
  let retries = 0;
  showInitializationError({ document, retry: () => retries++ });
  assert.equal(document.body.error.role, "alert");
  const button = elements.find((element) => element.tag === "button");
  assert.equal(button.textContent, "重新加载");
  button.click();
  assert.equal(retries, 1);
  assert.ok(
    elements.find(
      (element) => element.textContent === "页面加载失败，请重新加载。",
    ),
  );
});
