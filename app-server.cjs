const express = require("express");
const http = require("node:http");
const path = require("node:path");
const { createResourceMap } = require("./replay/resource-map");

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
function createAppServer() {
  const application = express();
  const resources = createResourceMap();
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
    const record = resources.resolveRequest("/local-assets" + request.url);
    if (!record) return response.status(404).end("Asset not captured");
    if (!BINARY_ASSETS.has(path.extname(record.filePath)))
      return response
        .status(403)
        .end("Original executable bundles are reference-only");
    response.sendFile(record.filePath);
  });
  application.use(
    express.static(path.join(__dirname, "app"), { etag: false, maxAge: 0 }),
  );
  application.use((request, response) =>
    response.status(404).end("File not found"),
  );
  return http.createServer(application);
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4174);
  createAppServer().listen(port, "127.0.0.1", () =>
    console.log(`Readable moon reconstruction: http://127.0.0.1:${port}`),
  );
}
module.exports = { createAppServer };
