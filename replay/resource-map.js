const fs = require('node:fs');
const path = require('node:path');

const RUNTIME_ORIGIN = 'https://act.mihoyo.com/ys/event/e20250310nodkrai-skctj9/';
const H5LOG_URL = 'https://webstatic.mihoyo.com/dora/biz/mihoyo-h5log/v1.0/main.js';
const DEFAULT_PROJECT_DIR = path.resolve(__dirname, '../projects/ys.mihoyo.com');

/** Build an allowlist from the captured manifest; never fall back to arbitrary files. */
function createResourceMap(projectDir = DEFAULT_PROJECT_DIR) {
  const root = path.resolve(projectDir);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'url_mapping.json'), 'utf8'));
  const byOriginal = new Map();
  const byLocal = new Map();
  const bySourcePath = new Map();
  const hosts = new Set();

  for (const [originalUrl, captured] of Object.entries(manifest.url_mapping)) {
    const filePath = path.resolve(root, captured.local_file);
    if (!filePath.startsWith(root + path.sep) || !fs.statSync(filePath).isFile()) {
      throw new Error(`Invalid captured resource: ${captured.local_file}`);
    }
    const url = new URL(originalUrl);
    const assetUrl = `/local-assets/${encodeURIComponent(path.basename(filePath))}`;
    const localUrl = originalUrl === H5LOG_URL ? '/replay/h5log.js' : assetUrl;
    const record = { originalUrl, localUrl, filePath, method: captured.method };
    if (byLocal.has(localUrl) && byLocal.get(localUrl).filePath !== filePath) {
      throw new Error(`Ambiguous captured basename: ${localUrl}`);
    }
    byOriginal.set(originalUrl, record);
    byLocal.set(localUrl, record);
    byLocal.set(assetUrl, record);
    bySourcePath.set(`/source/${url.host}${url.pathname}`, record);
    hosts.add(url.host);
    if (originalUrl.startsWith(RUNTIME_ORIGIN)) {
      byLocal.set(`/runtime/${originalUrl.slice(RUNTIME_ORIGIN.length).split('?')[0]}`, record);
    }
  }

  // Exact captured URLs precede prefixes so a locale/image URL cannot be partially rewritten.
  const replacements = new Map();
  for (const record of byOriginal.values()) {
    replacements.set(record.originalUrl, record.localUrl);
    replacements.set(record.originalUrl.replace(/^https?:/, ''), record.localUrl);
  }
  replacements.set(RUNTIME_ORIGIN, '/runtime/');
  replacements.set(RUNTIME_ORIGIN.replace(/^https?:/, ''), '/runtime/');
  for (const host of hosts) {
    replacements.set(`https://${host}`, `/source/${host}`);
    replacements.set(`http://${host}`, `/source/${host}`);
    replacements.set(`//${host}`, `/source/${host}`);
  }
  for (const [original, local] of [...replacements]) {
    replacements.set(original.replaceAll('/', '\\/'), local.replaceAll('/', '\\/'));
  }
  const ordered = [...replacements.entries()].sort((a, b) => b[0].length - a[0].length);
  const replacementValues = new Map(ordered);
  const pattern = new RegExp(ordered.map(([original]) => original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');

  return {
    byOriginal,
    byLocal,
    bySourcePath,
    entry: byOriginal.get(manifest.entry_point.origin),
    rewriteText(text) {
      // This SDK assembles its hostname at runtime, so ordinary literal URL rewrites miss it.
      const localized = text.replace(/"https:\/\/webstatic"\.concat\([^)]*?"\.mihoyo\.com\/dora\/biz\/mihoyo-h5log\/v1\.0\/main\.js"\)/g, '"/replay/h5log.js"');
      return localized.replace(pattern, match => replacementValues.get(match));
    },
    resolveRequest(requestUrl) {
      const url = new URL(requestUrl, 'http://127.0.0.1');
      return byLocal.get(url.pathname) || bySourcePath.get(url.pathname);
    },
  };
}

module.exports = { createResourceMap, DEFAULT_PROJECT_DIR, RUNTIME_ORIGIN, H5LOG_URL };
