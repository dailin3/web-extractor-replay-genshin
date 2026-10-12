/**
 * Recover the rendering dependency from the captured vendor bundle.
 *
 * This is a build-time tool. The application never loads a captured Webpack chunk.
 * The inner rendering package becomes static, individually named ES modules;
 * its original algorithms and the exact third-party library versions are retained.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const acorn = require("acorn");
const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const prettier = require("prettier");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(
  ROOT,
  "projects/ys.mihoyo.com/assets/vendors_3c19dbfdd57bec9e83ae.js",
);
const OUTPUT = path.join(ROOT, "artifacts/reference-engine");
const MAINTAINED_ENGINE = path.join(ROOT, "app/engine");
const MODULE_NAMES = [
  "three",
  "motion-utils",
  "tween-timeline",
  "step-block",
  "base-timeline",
  "step-frame",
  "gsap",
  "motion",
  "tween-block",
  "gradient",
  "hit-test",
  "spine-runtime",
  "msdf",
  "cue",
  "keyframe-block",
  "spine-block",
  "skin-block",
  "gradient-block",
  "decoder",
  "mouse",
  "browser",
  "mouse-proxy",
  "mouse-uniforms",
  "camera",
  "scene-data",
  "text-node-types",
  "canvas-style",
  "buffer-size",
  "engine-api",
  "custom-ease",
  "spine-utils",
  "group-timeline",
  "keyframe-timeline",
  "spine-timeline",
  "step-timeline",
  "skin-timeline",
  "texture-timeline",
  "movie-timeline",
  "gradient-timeline",
  "binary-types",
  "mouse-controller",
  "browser-detector",
  "utils",
  "tween-utils",
  "audio-manager",
  "howler",
  "rich-text",
  "text-parser",
  "html-entities",
  "style-parser",
  "style-values",
  "style-validation",
  "text-defaults",
  "text-layout",
  "text-measure",
  "text-draw",
  "three-player",
  "resource-loader",
  "load-request",
  "xhr",
  "render-passes",
  "blur-pass",
  "copy-pass",
  "source-loader",
];
const EXTERNALS = new Map([
  [0, "THREE"],
  [6, "gsapLibrary"],
  [29, "customEaseLibrary"],
  [41, "browserDetectorLibrary"],
  [45, "howlerLibrary"],
]);

function loadChunkFactories(file) {
  const chunks = [];
  vm.runInNewContext(
    fs.readFileSync(file, "utf8"),
    {
      self: { webpackChunke20250310nodkrai_skctj9: chunks },
    },
    { filename: file },
  );
  if (chunks.length !== 1 || !chunks[0][1])
    throw new Error("Unrecognized captured vendor chunk");
  return chunks[0][1];
}

function unpackRenderer(factory) {
  const source = factory.toString();
  const ast = acorn.parse(`(${source})`, { ecmaVersion: "latest" });
  let factories;
  walk(ast, (node) => {
    if (
      node.type === "ArrayExpression" &&
      node.elements.length === 64 &&
      node.elements.every((element) => element?.type === "FunctionExpression")
    ) {
      factories = vm.runInNewContext(
        `(${source.slice(node.start - 1, node.end - 1)})`,
      );
    }
  });
  if (!factories)
    throw new Error(
      "The captured renderer no longer has the expected 64 module boundaries",
    );
  return factories;
}

function children(node) {
  return Object.values(node)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(
      (value) =>
        value && typeof value === "object" && typeof value.type === "string",
    );
}

function walk(node, visit) {
  visit(node);
  for (const child of children(node)) walk(child, visit);
}

function applyEdits(source, edits) {
  // An interop call replacement owns its whole range, including its require().
  const selected = [];
  for (const edit of edits.sort(
    (a, b) => b.end - b.start - (a.end - a.start),
  )) {
    if (
      !selected.some(
        (other) => edit.start < other.end && edit.end > other.start,
      )
    )
      selected.push(edit);
  }
  for (const edit of selected.sort((a, b) => b.start - a.start)) {
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  }
  return source;
}

function transformRendererModule(factory, id) {
  const source = factory.toString();
  const wrapped = `(${source})`;
  const ast = babelParser.parse(wrapped, { sourceType: "script" });
  const root = ast.program.body[0].expression;
  let rootPath;
  traverse(ast, {
    FunctionExpression(path) {
      if (path.node === root) rootPath = path;
    },
  });
  const [, exportsParam, requireParam] = root.params.map((param) => param.name);
  const bodyStart = root.body.start + 1;
  const bodyEnd = root.body.end - 1;
  const body = wrapped.slice(bodyStart, bodyEnd);
  const edits = [];
  const dependencies = new Set();
  const exportNames = new Set();
  const interopFunctions = new Set();
  // Binding identity handles block declarations, catch parameters and named
  // function expressions without treating every same-spelled identifier alike.
  const exportsBinding = rootPath.scope.getBinding(exportsParam);
  const requireBinding = rootPath.scope.getBinding(requireParam);
  const originalText = (node) => wrapped.slice(node.start, node.end);
  const edit = (node, text) =>
    edits.push({
      start: node.start - bodyStart,
      end: node.end - bodyStart,
      text,
    });
  const dependencyName = (dependencyId) =>
    `dependency_${MODULE_NAMES[dependencyId].replaceAll("-", "_")}`;
  const exportedName = (name) => (name === "default" ? "defaultExport" : name);

  rootPath.traverse({
    FunctionDeclaration(path) {
      if (path.node.id && originalText(path.node).includes("__esModule"))
        interopFunctions.add(path.scope.getBinding(path.node.id.name));
    },
    VariableDeclarator(path) {
      const { id, init } = path.node;
      if (
        id.type === "Identifier" &&
        init?.type === "FunctionExpression" &&
        originalText(init).includes("__esModule")
      )
        interopFunctions.add(path.scope.getBinding(id.name));
    },
  });

  const isFactoryReference = (path, binding) =>
    path.isIdentifier() && path.scope.getBinding(path.node.name) === binding;
  const isRequire = (path) =>
    path.isCallExpression() &&
    isFactoryReference(path.get("callee"), requireBinding) &&
    path.node.arguments.length === 1 &&
    path.get("arguments.0").isNumericLiteral() &&
    Number.isInteger(path.node.arguments[0].value);

  rootPath.traverse({
    CallExpression(path) {
      const { node } = path;
      if (node.arguments.length === 1 && isRequire(path.get("arguments.0"))) {
        const isNamedInterop =
          node.callee.type === "Identifier" &&
          interopFunctions.has(path.scope.getBinding(node.callee.name));
        const isInlineInterop =
          node.callee.type === "FunctionExpression" &&
          originalText(node.callee).includes("__esModule");
        if (isNamedInterop || isInlineInterop) {
          const dependencyId = node.arguments[0].arguments[0].value;
          dependencies.add(dependencyId);
          edit(node, dependencyName(dependencyId));
        }
      }
      if (isRequire(path)) {
        const dependencyId = node.arguments[0].value;
        if (!MODULE_NAMES[dependencyId])
          throw new Error(`Unknown rendering dependency ${dependencyId}`);
        dependencies.add(dependencyId);
        edit(node, dependencyName(dependencyId));
      }
      if (
        node.callee.type === "MemberExpression" &&
        node.callee.object.name === "Object" &&
        node.callee.property.name === "defineProperty" &&
        isFactoryReference(path.get("arguments.0"), exportsBinding) &&
        node.arguments[1]?.value === "__esModule"
      ) {
        edit(node, "void 0");
      }
    },
    MemberExpression(path) {
      const { node } = path;
      if (
        !node.computed &&
        isFactoryReference(path.get("object"), exportsBinding)
      ) {
        const name = node.property.name;
        if (name !== "__esModule") {
          exportNames.add(name);
          edit(node, exportedName(name));
        }
      }
    },
  });

  const imports = [...dependencies]
    .sort((a, b) => a - b)
    .map((dependencyId) =>
      EXTERNALS.has(dependencyId)
        ? `import { ${EXTERNALS.get(dependencyId)} as ${dependencyName(dependencyId)} } from '../vendor/libraries.js';`
        : `import * as ${dependencyName(dependencyId)} from './${MODULE_NAMES[dependencyId]}.js';`,
    );
  const declarations = [...exportNames].map(exportedName);
  const exports = [...exportNames].map((name) =>
    name === "default" ? "defaultExport as default" : name,
  );
  let transformed = applyEdits(body, edits);
  if (/\b(?:require|webpackChunk)\s*\(/.test(transformed)) {
    // A local, shadowed require() is permitted; original render modules contain none.
    if (factory.toString().startsWith("function(e,t,n)"))
      throw new Error(`Unconverted dependency in ${MODULE_NAMES[id]}`);
  }
  return (
    `// Extracted rendering module: ${MODULE_NAMES[id]}. See ../PROVENANCE.md.\n` +
    imports.join("\n") +
    "\n" +
    // Some older Babel interop expressions are inlined rather than called.
    // Retaining the original marker lets both forms use the real ES namespace.
    `export const __esModule = true;\n` +
    (declarations.length ? `let ${declarations.join(", ")};\n` : "") +
    transformed +
    "\n" +
    (exports.length ? `export { ${exports.join(", ")} };\n` : "")
  );
}

function thirdPartyFactories(modules) {
  const ids = [23402, 85880, 74638, 83761, 51458, 7452];
  const names = [
    "three",
    "gsap",
    "custom-ease",
    "browser-detector",
    "howler",
    "regenerator",
  ];
  return ids.map((id, index) => [names[index], modules[id].toString()]);
}

async function writeFormatted(file, source) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    await prettier.format(source, { parser: "babel", singleQuote: true }),
  );
}

/** Raw captures are an oracle; maintained renderer files are never regenerated. */
function resolveOutputDirectory(output = OUTPUT) {
  const resolved = path.resolve(output);
  // Resolve the existing prefix too: a not-yet-created child of a symlink can
  // otherwise point into maintained sources despite an unrelated lexical path.
  const suffix = [];
  let ancestor = resolved;
  let ancestorInfo;
  // lstat sees dangling links too; existsSync follows them and reports false.
  while (!(ancestorInfo = fs.lstatSync(ancestor, { throwIfNoEntry: false }))) {
    suffix.unshift(path.basename(ancestor));
    ancestor = path.dirname(ancestor);
  }
  if (ancestorInfo.isSymbolicLink() && !fs.existsSync(ancestor))
    throw new Error(
      `Raw recovery cannot follow a dangling output symlink: ${ancestor}`,
    );
  const realOutput = path.join(fs.realpathSync(ancestor), ...suffix);
  const realEngine = fs.realpathSync(MAINTAINED_ENGINE);
  const relative = path.relative(realEngine, realOutput);
  const parentRelative = path.relative(realOutput, realEngine);
  if (
    relative === "" ||
    (!relative.startsWith(".." + path.sep) && !path.isAbsolute(relative)) ||
    (!parentRelative.startsWith(".." + path.sep) &&
      !path.isAbsolute(parentRelative))
  )
    throw new Error(
      "Raw recovery cannot overwrite the maintained engine; use artifacts/reference-engine or another oracle directory",
    );
  return resolved;
}

async function extractEngine({ source = SOURCE, output, outputDir } = {}) {
  output = resolveOutputDirectory(outputDir ?? output ?? OUTPUT);
  const modules = loadChunkFactories(source);
  const renderer = unpackRenderer(modules[93823]);
  const vendors = thirdPartyFactories(modules);
  // Validate every eventual write before the first mutation. An allowed output
  // can contain symlinked directories or files that point into maintained code.
  const targets = [
    ...vendors.map(([name]) => path.join(output, "vendor", `${name}.js`)),
    ...MODULE_NAMES.filter((name, id) => !EXTERNALS.has(id)).map((name) =>
      path.join(output, "renderer", `${name}.js`),
    ),
    path.join(output, "extraction.json"),
  ];
  targets.forEach((target) => resolveOutputDirectory(target));
  for (const [name, factory] of vendors) {
    // Third-party code retains its compiled form and exact version. Only this
    // small wrapper adapts its exports; it cannot load application chunks.
    fs.mkdirSync(path.join(output, "vendor"), { recursive: true });
    fs.writeFileSync(
      path.join(output, "vendor", `${name}.js`),
      `// Exact captured dependency. See ../PROVENANCE.md.\nexport default ${factory};\n`,
    );
  }
  for (let id = 0; id < renderer.length; id++) {
    if (EXTERNALS.has(id)) continue;
    await writeFormatted(
      path.join(output, "renderer", `${MODULE_NAMES[id]}.js`),
      transformRendererModule(renderer[id], id),
    );
  }
  const fingerprint = crypto
    .createHash("sha256")
    .update(fs.readFileSync(source))
    .digest("hex");
  fs.writeFileSync(
    path.join(output, "extraction.json"),
    JSON.stringify(
      {
        source: path.relative(ROOT, source),
        sha256: fingerprint,
        thirdPartyModules: {
          three: 23402,
          gsap: 85880,
          customEase: 74638,
          browserDetector: 83761,
          howler: 51458,
          regenerator: 7452,
        },
        rendererModules: MODULE_NAMES.map((name, id) => ({
          id,
          name,
          external: EXTERNALS.has(id),
        })),
      },
      null,
      2,
    ) + "\n",
  );
  return { modules: renderer.length - EXTERNALS.size, output };
}

if (require.main === module)
  extractEngine()
    .then((result) =>
      console.log(
        `Extracted ${result.modules} ES rendering modules to ${result.output}`,
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });

module.exports = {
  loadChunkFactories,
  unpackRenderer,
  transformRendererModule,
  extractEngine,
  resolveOutputDirectory,
  MODULE_NAMES,
};
