const express = require("express");
const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const {
  createResourceMap,
  DEFAULT_PROJECT_DIR,
} = require("./replay/resource-map");

const BINARY_ASSETS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".woff",
  ".woff2",
  ".mp3",
  ".mp4",
  ".ico",
]);

/** Serve authored application modules and original binary art; never execute a captured bundle. */
function createAppServer({
  appDir = path.join(__dirname, "app"),
  projectDir = DEFAULT_PROJECT_DIR,
} = {}) {
  const application = express();
  const resources =
    projectDir && fs.existsSync(path.join(projectDir, "url_mapping.json"))
      ? createResourceMap(projectDir)
      : null;
  application.disable("x-powered-by");
  application.use((request, response, next) => {
    response.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'",
    );
    response.set("X-Content-Type-Options", "nosniff");
    next();
  });
  application.use("/local-assets", (request, response) => {
    let name;
    try {
      name = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      ).slice(1);
    } catch {
      return response.status(404).end("Asset not found");
    }
    if (!name || /[/\\]/.test(name))
      return response.status(404).end("Asset not found");
    const bundledPath = path.resolve(appDir, "local-assets", name);
    const record = resources?.resolveRequest("/local-assets" + request.url);
    const filePath =
      fs.existsSync(bundledPath) && fs.statSync(bundledPath).isFile()
        ? bundledPath
        : record?.filePath;
    if (!filePath) return response.status(404).end("Asset not found");
    if (!BINARY_ASSETS.has(path.extname(filePath)))
      return response
        .status(403)
        .end("Original executable bundles are reference-only");
    response.sendFile(filePath);
  });
  application.use(express.static(appDir, { etag: false, maxAge: 0 }));
  application.use((request, response) =>
    response.status(404).end("File not found"),
  );
  return http.createServer(application);
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4174);
  const host = process.env.HOST || "127.0.0.1";
  createAppServer().listen(port, host, () =>
    console.log(`Readable moon reconstruction: http://${host}:${port}`),
  );
}
module.exports = { createAppServer };
