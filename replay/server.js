const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { createResourceMap, DEFAULT_PROJECT_DIR, H5LOG_URL } = require('./resource-map');
const { buildBootstrap } = require('./bootstrap');
const { patchNativeInitialization } = require('./native-patches');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
};
const TEXT_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.svg']);
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self'; worker-src 'self' blob:; frame-src 'self'; object-src 'none'; base-uri 'self'";

function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] ? (match[2] ? Math.min(Number(match[2]), size - 1) : size - 1) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) return null;
  return { start, end };
}

function createReplayServer({ projectDir = DEFAULT_PROJECT_DIR, transformAsset } = {}) {
  const resources = createResourceMap(projectDir);
  const bootstrap = Buffer.from(buildBootstrap(resources));
  const transformed = new Map();

  function transformedContent(record) {
    if (!transformed.has(record.filePath)) {
      const sourceFile = record.originalUrl === H5LOG_URL ? path.join(__dirname, 'h5log.js') : record.filePath;
      let text = resources.rewriteText(fs.readFileSync(sourceFile, 'utf8'));
      if (path.basename(record.filePath) === 'index_44ff6b130c7baea7b639.js') {
        text = patchNativeInitialization(text);
      }
      if (record === resources.entry) {
        text = text.replace('<head>', '<head><script src="/replay/bootstrap.js"></script><script src="/replay/h5log.js"></script>');
      }
      if (transformAsset) text = transformAsset(text, record);
      transformed.set(record.filePath, Buffer.from(text));
    }
    return transformed.get(record.filePath);
  }

  const server = http.createServer((request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Security-Policy', CSP);
    response.setHeader('Cache-Control', 'no-cache');
    let requestUrl;
    try {
      requestUrl = new URL(request.url, 'http://127.0.0.1');
    } catch (_) {
      response.writeHead(400).end('Invalid URL');
      return;
    }
    if (requestUrl.pathname === '/__replay-blocked') {
      response.writeHead(200, { 'Content-Type': MIME_TYPES['.json'] }).end('{"retcode":0,"message":"OK","data":{}}');
      return;
    }
    if (requestUrl.pathname === '/replay/bootstrap.js') {
      response.writeHead(200, { 'Content-Type': MIME_TYPES['.js'], 'Content-Length': bootstrap.length });
      response.end(request.method === 'HEAD' ? undefined : bootstrap);
      return;
    }
    const entryPaths = ['/', '/moon', '/moon%C2%A0', '/index.html'];
    const record = entryPaths.includes(requestUrl.pathname) ? resources.entry : resources.resolveRequest(request.url);
    if (!record) {
      response.writeHead(404).end('Resource not captured');
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method) && request.method !== record.method) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    const extension = path.extname(record.filePath).toLowerCase();
    const body = TEXT_EXTENSIONS.has(extension) ? transformedContent(record) : null;
    const size = body ? body.length : fs.statSync(record.filePath).size;
    const headers = {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Accept-Ranges': 'bytes',
      'Content-Length': size,
    };
    let range;
    if (request.headers.range) {
      range = parseRange(request.headers.range, size);
      if (!range) {
        response.writeHead(416, { 'Content-Range': `bytes */${size}` }).end();
        return;
      }
      headers['Content-Range'] = `bytes ${range.start}-${range.end}/${size}`;
      headers['Content-Length'] = range.end - range.start + 1;
    }
    response.writeHead(range ? 206 : 200, headers);
    if (request.method === 'HEAD') {
      response.end();
    } else if (body) {
      response.end(range ? body.subarray(range.start, range.end + 1) : body);
    } else {
      const stream = fs.createReadStream(record.filePath, range || {});
      stream.on('error', () => response.destroy());
      stream.pipe(response);
    }
  });
  server.resources = resources;
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4173);
  const server = createReplayServer();
  server.listen(port, '127.0.0.1', () => {
    console.log(`Original moon runtime: http://127.0.0.1:${port}`);
  });
}

module.exports = { createReplayServer, parseRange };
