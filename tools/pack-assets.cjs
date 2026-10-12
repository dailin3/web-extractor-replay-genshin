const fs = require("node:fs");
const path = require("node:path");
const { createResourceMap } = require("../replay/resource-map");

const APPLICATION_DIR = path.resolve(__dirname, "../app");
const RUNTIME_EXTENSIONS = new Set([".html", ".css", ".mjs", ".js", ".json", ".glsl"]);
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".svg", ".woff", ".woff2", ".mp3", ".mp4", ".ico",
]);

/** Read authored runtime declarations, excluding offline verification and packed output. */
function collectAssetReferences(appDir = APPLICATION_DIR) {
  const references = new Set();
  function visit(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "local-assets") visit(filename);
        continue;
      }
      if (!entry.isFile() || !RUNTIME_EXTENSIONS.has(path.extname(filename))) continue;
      const relative = path.relative(appDir, filename).split(path.sep).join("/");
      if (relative === "data/extraction.json") continue;
      const text = fs.readFileSync(filename, "utf8");
      for (const match of text.matchAll(/\/local-assets\/[^\s"'`)<>\\]+/g)) {
        references.add(match[0]);
      }
    }
  }
  visit(appDir);
  return [...references].sort();
}

/** Copy only referenced captured binaries, preserving bytes and unchanged output mtimes. */
function packAssets({
  appDir = APPLICATION_DIR,
  outputDir = path.join(appDir, "local-assets"),
  resources = createResourceMap(),
} = {}) {
  // Resolve and validate the complete set before creating or changing output files.
  const assets = collectAssetReferences(appDir).map((url) => {
    const record = resources.resolveRequest(url);
    if (!record) throw new Error(`Unknown captured asset: ${url}`);
    if (!BINARY_EXTENSIONS.has(path.extname(record.filePath).toLowerCase())) {
      throw new Error(`Disallowed captured asset: ${url}`);
    }
    return { url, filename: path.basename(record.filePath), source: record.filePath };
  });

  fs.mkdirSync(outputDir, { recursive: true });
  let copied = 0;
  let unchanged = 0;
  let bytes = 0;
  for (const asset of assets) {
    const sourceBytes = fs.readFileSync(asset.source);
    const destination = path.join(outputDir, asset.filename);
    asset.bytes = sourceBytes.length;
    bytes += sourceBytes.length;
    if (fs.existsSync(destination) && fs.readFileSync(destination).equals(sourceBytes)) {
      unchanged++;
      continue;
    }
    fs.writeFileSync(destination, sourceBytes);
    copied++;
  }
  return { files: assets.length, bytes, copied, unchanged, outputDir, assets };
}

if (require.main === module) {
  try {
    const { assets, ...summary } = packAssets();
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { BINARY_EXTENSIONS, collectAssetReferences, packAssets };
