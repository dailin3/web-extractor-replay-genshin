/** A resource or WebGL startup failure should leave a usable way to retry. */
export function showInitializationError({
  document = globalThis.document,
  retry = () => location.reload(),
} = {}) {
  const overlay = document.createElement("div");
  overlay.className = "startup-error";
  overlay.setAttribute("role", "alert");
  const message = document.createElement("p");
  message.textContent = "页面加载失败，请重新加载。";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "重新加载";
  button.addEventListener("click", retry);
  overlay.append(message, button);
  document.body.append(overlay);
  return overlay;
}
