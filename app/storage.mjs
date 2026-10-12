/** Saved progress is optional: browser storage restrictions must not block the scene. */
export function getProgressStorage({
  getStorage = () => globalThis.localStorage,
  resetKey,
} = {}) {
  try {
    const storage = getStorage();
    if (resetKey) storage?.removeItem(resetKey);
    return storage;
  } catch (_) {
    return undefined;
  }
}
