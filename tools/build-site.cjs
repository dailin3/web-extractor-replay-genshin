const fs = require("node:fs");
const path = require("node:path");
const { parseArgs } = require("node:util");

const APP_DIR = path.resolve(__dirname, "../app");
const OUTPUT_DIR = path.resolve(__dirname, "../dist");
const RUNTIME_EXTENSIONS = new Set([
  ".html",
  ".css",
  ".mjs",
  ".js",
  ".json",
  ".atlas",
  ".glsl",
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
const URL_TEXT_EXTENSIONS = new Set([".html", ".css", ".mjs", ".js", ".json"]);

function normalizeBasePath(basePath) {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(basePath)) {
    throw new Error("Deployment base path must be / or /repository-name/");
  }
  return basePath;
}

/** Only root asset literals change. Module imports and binary/shader bytes are preserved. */
function prefixAssetUrls(source, basePath = "/") {
  const prefix = normalizeBasePath(basePath);
  if (prefix === "/") return source;
  return source.replace(
    /(["'`(])\/((?:ui-assets|local-assets|data)\/|(?:main\.mjs|ui\.css|errors\.css)\b)/g,
    (_, delimiter, asset) => delimiter + prefix + asset,
  );
}

function buildSite({
  appDir = APP_DIR,
  outputDir = OUTPUT_DIR,
  basePath = "/",
} = {}) {
  const prefix = normalizeBasePath(basePath);
  const input = path.resolve(appDir);
  const output = path.resolve(outputDir);
  if (
    input === output ||
    input.startsWith(output + path.sep) ||
    output.startsWith(input + path.sep)
  ) {
    throw new Error("Build output must be separate from application source");
  }
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  let files = 0,
    bytes = 0;

  function copyDirectory(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error(`Cannot publish a symlink: ${source}`);
      if (entry.isDirectory()) {
        copyDirectory(source);
        continue;
      }
      const extension = path.extname(entry.name);
      if (
        !RUNTIME_EXTENSIONS.has(extension) ||
        /(?:\.test|\.browser)\./.test(entry.name) ||
        entry.name === "package.json"
      )
        continue;
      const destination = path.join(output, path.relative(input, source));
      const content = URL_TEXT_EXTENSIONS.has(extension)
        ? Buffer.from(prefixAssetUrls(fs.readFileSync(source, "utf8"), prefix))
        : fs.readFileSync(source);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, content);
      files++;
      bytes += content.length;
    }
  }
  copyDirectory(input);
  fs.writeFileSync(path.join(output, ".nojekyll"), "");
  return { outputDir: output, basePath: prefix, files, bytes };
}

if (require.main === module) {
  const { values } = parseArgs({
    options: {
      base: { type: "string", default: "/" },
      output: { type: "string", default: OUTPUT_DIR },
    },
  });
  console.log(
    JSON.stringify(
      buildSite({ basePath: values.base, outputDir: values.output }),
      null,
      2,
    ),
  );
}
module.exports = { buildSite, prefixAssetUrls };
