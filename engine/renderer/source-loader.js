/** Browser asset loading, decoding and one retry. No scene or animation clock lives here. */
export const __esModule = true;

const noop = () => {};
const FALLBACK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjuHxk7X8AB/YDRBwwtOgAAAAASUVORK5CYII=";
const isInlineImage = (source) =>
  typeof source === "string" && source.startsWith("data:image");

function request({
  method = "get",
  url = "",
  responseType = "text",
  timeout = 30000,
  need404Resolve,
  placeholder404,
}) {
  // Preserve the original XHR transport; fetch would change timeout, blob and status semantics.
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    if (isInlineImage(url)) {
      resolve(url);
      return;
    }
    xhr.onprogress = noop;
    xhr.open(method, url);
    xhr.responseType = responseType;
    xhr.timeout = timeout;
    xhr.ontimeout = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) resolve(xhr);
      else if ((xhr.status === 404 || xhr.status === 403) && need404Resolve)
        resolve({ type: 404, result: placeholder404 });
      else reject(xhr.statusText);
    };
    xhr.send();
  });
}

export class SourceLoad {
  constructor({
    manifestList = [],
    loadProgressCallBack = noop,
    loadErrorCallBack = noop,
    loadCompleteCallBack = noop,
    sourcePool = {},
  } = {}) {
    Object.assign(this, {
      manifestList,
      loadProgressCallBack,
      loadErrorCallBack,
      loadCompleteCallBack,
      sourcePool,
    });
    this.result = {};
    this.count = 0;
  }

  load(manifest, options = {}) {
    if (!manifest) return Promise.reject();
    this.manifestList = manifest;
    this.count = 0;
    if (!manifest.length) {
      this.loadProgressCallBack(1);
      return Promise.resolve().then(() => {
        this.loadCompleteCallBack();
      });
    }
    return this.loadWithRetry(options);
  }

  async loadWithRetry(options) {
    const failures = await this.batch(this.manifestList, options);
    const permanentFailures = [];
    // The captured loader retries once, sequentially, in reverse failure order.
    // Keep successful results and progress while retrying only failed assets.
    while (failures.length) {
      const retryFailures = await this.batch([failures.pop()], options);
      if (retryFailures.length) permanentFailures.push(retryFailures[0]);
    }
    if (permanentFailures.length) {
      this.loadErrorCallBack(permanentFailures);
      throw permanentFailures;
    }
  }

  async batch(
    manifest,
    {
      timeout = 30000,
      need404Resolve = false,
      placeholder404 = FALLBACK_IMAGE,
    } = {},
  ) {
    const failures = [];
    await Promise.all(
      manifest.map(async (asset) => {
        const { type = "image", src = "", id } = asset;
        try {
          const response = await request({
            url: src,
            timeout,
            responseType: this.getSourceResponseType(type),
            need404Resolve,
            placeholder404,
          });
          // Await decoding too: HTTP 200 alone does not make an image usable.
          const decoded = await this.resourceCompile(response, asset);
          this.result[id] = Object.assign({}, asset, { result: decoded });
          this.sourcePool[id] = this.result[id];
          this.checkComplete();
        } catch (_) {
          failures.push(asset);
        }
      }),
    );
    return failures;
  }

  checkComplete() {
    this.count += 1;
    this.loadProgressCallBack(this.count / this.manifestList.length);
    if (this.count === this.manifestList.length) this.loadCompleteCallBack();
  }

  getResult(id) {
    return this.result[id] ? this.result[id].result : null;
  }

  getSourceResponseType(type) {
    switch (type) {
      case "video":
      case "image":
        return "blob";
      case "audio":
        return "arraybuffer";
      default:
        return type;
    }
  }

  resourceCompile(response, { type, src, id }) {
    return new Promise((resolve, reject) => {
      if (response.type === 404) {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () =>
          reject(
            new Error("source " + id + " failed to decode placeholder image"),
          );
        image.src = response.result;
        return;
      }
      try {
        if (type !== "image") {
          resolve(response.response);
          return;
        }
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () =>
          reject(new Error("source " + id + " failed to decode image"));
        image.src = isInlineImage(src)
          ? src
          : window.URL.createObjectURL(response.response);
      } catch (error) {
        this.loadErrorCallBack(new Error("source " + id + " " + error.message));
        reject(error);
      }
    });
  }

  setEventListener(event, callback) {
    switch (event) {
      case "error":
        this.loadErrorCallBack = callback;
        break;
      case "progress":
        this.loadProgressCallBack = callback;
        break;
      case "complete":
        this.loadCompleteCallBack = callback;
        break;
    }
  }
  removeEventListener(event) {
    this.setEventListener(event, noop);
  }
  clearAllListener() {
    this.loadErrorCallBack = noop;
    this.loadProgressCallBack = noop;
    this.loadCompleteCallBack = noop;
  }
}

export function createSourceLoader() {
  return new SourceLoad();
}
export const sourceLoader = new SourceLoad();
