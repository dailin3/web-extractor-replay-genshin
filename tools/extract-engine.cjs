/**
 * Recover the rendering dependency from the captured vendor bundle.
 *
 * This is a build-time tool. The application never loads a captured Webpack chunk.
 * The inner rendering package becomes static, individually named ES modules;
 * its original algorithms and the exact third-party library versions are retained.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const acorn = require('acorn');
const prettier = require('prettier');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(
  ROOT,
  'projects/ys.mihoyo.com/assets/vendors_3c19dbfdd57bec9e83ae.js',
);
const OUTPUT = path.join(ROOT, 'app/engine');
const MODULE_NAMES = [
  'three',
  'motion-utils',
  'tween-timeline',
  'step-block',
  'base-timeline',
  'step-frame',
  'gsap',
  'motion',
  'tween-block',
  'gradient',
  'hit-test',
  'spine-runtime',
  'msdf',
  'cue',
  'keyframe-block',
  'spine-block',
  'skin-block',
  'gradient-block',
  'decoder',
  'mouse',
  'browser',
  'mouse-proxy',
  'mouse-uniforms',
  'camera',
  'scene-data',
  'text-node-types',
  'canvas-style',
  'buffer-size',
  'engine-api',
  'custom-ease',
  'spine-utils',
  'group-timeline',
  'keyframe-timeline',
  'spine-timeline',
  'step-timeline',
  'skin-timeline',
  'texture-timeline',
  'movie-timeline',
  'gradient-timeline',
  'binary-types',
  'mouse-controller',
  'browser-detector',
  'utils',
  'tween-utils',
  'audio-manager',
  'howler',
  'rich-text',
  'text-parser',
  'html-entities',
  'style-parser',
  'style-values',
  'style-validation',
  'text-defaults',
  'text-layout',
  'text-measure',
  'text-draw',
  'three-player',
  'resource-loader',
  'load-request',
  'xhr',
  'render-passes',
  'blur-pass',
  'copy-pass',
  'source-loader',
];
const EXTERNALS = new Map([
  [0, 'THREE'],
  [6, 'gsapLibrary'],
  [29, 'customEaseLibrary'],
  [41, 'browserDetectorLibrary'],
  [45, 'howlerLibrary'],
]);

function loadChunkFactories(file) {
  const chunks = [];
  vm.runInNewContext(
    fs.readFileSync(file, 'utf8'),
    {
      self: { webpackChunke20250310nodkrai_skctj9: chunks },
    },
    { filename: file },
  );
  if (chunks.length !== 1 || !chunks[0][1])
    throw new Error('Unrecognized captured vendor chunk');
  return chunks[0][1];
}

function unpackRenderer(factory) {
  const source = factory.toString();
  const ast = acorn.parse(`(${source})`, { ecmaVersion: 'latest' });
  let factories;
  walk(ast, (node) => {
    if (
      node.type === 'ArrayExpression' &&
      node.elements.length === 64 &&
      node.elements.every((element) => element?.type === 'FunctionExpression')
    ) {
      factories = vm.runInNewContext(
        `(${source.slice(node.start - 1, node.end - 1)})`,
      );
    }
  });
  if (!factories)
    throw new Error(
      'The captured renderer no longer has the expected 64 module boundaries',
    );
  return factories;
}

function children(node) {
  return Object.values(node)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(
      (value) =>
        value && typeof value === 'object' && typeof value.type === 'string',
    );
}

function walk(node, visit) {
  visit(node);
  for (const child of children(node)) walk(child, visit);
}

function boundNames(pattern, result = new Set()) {
  if (!pattern) return result;
  if (pattern.type === 'Identifier') result.add(pattern.name);
  else for (const child of children(pattern)) boundNames(child, result);
  return result;
}

function functionBindings(node) {
  const result = new Set();
  for (const param of node.params) boundNames(param, result);
  function visit(child) {
    if (/Function/.test(child.type)) {
      if (child.type === 'FunctionDeclaration' && child.id)
        result.add(child.id.name);
      return;
    }
    if (child.type === 'VariableDeclarator') boundNames(child.id, result);
    for (const nested of children(child)) visit(nested);
  }
  visit(node.body);
  return result;
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
  const root = acorn.parse(wrapped, { ecmaVersion: 'latest' }).body[0]
    .expression;
  const [, exportsParam, requireParam] = root.params.map((param) => param.name);
  const bodyStart = root.body.start + 1;
  const bodyEnd = root.body.end - 1;
  const body = wrapped.slice(bodyStart, bodyEnd);
  const edits = [];
  const dependencies = new Set();
  const exportNames = new Set();
  const interopFunctions = new Set();
  const originalText = (node) => wrapped.slice(node.start, node.end);
  const edit = (node, text) =>
    edits.push({
      start: node.start - bodyStart,
      end: node.end - bodyStart,
      text,
    });
  const dependencyName = (dependencyId) =>
    `dependency_${MODULE_NAMES[dependencyId].replaceAll('-', '_')}`;
  const exportedName = (name) => (name === 'default' ? 'defaultExport' : name);

  walk(root.body, (node) => {
    if (
      node.type === 'FunctionDeclaration' &&
      node.id &&
      originalText(node).includes('__esModule')
    ) {
      interopFunctions.add(node.id.name);
    }
    if (
      node.type === 'VariableDeclarator' &&
      node.id.type === 'Identifier' &&
      node.init?.type === 'FunctionExpression' &&
      originalText(node.init).includes('__esModule')
    ) {
      interopFunctions.add(node.id.name);
    }
  });

  function visit(node, exportsVisible = true, requireVisible = true) {
    if (/Function/.test(node.type)) {
      const bindings = functionBindings(node);
      exportsVisible &&= !bindings.has(exportsParam);
      requireVisible &&= !bindings.has(requireParam);
    }
    const isRequire = (child) =>
      requireVisible &&
      child?.type === 'CallExpression' &&
      child.callee.type === 'Identifier' &&
      child.callee.name === requireParam &&
      child.arguments.length === 1 &&
      child.arguments[0].type === 'Literal' &&
      Number.isInteger(child.arguments[0].value);
    if (
      node.type === 'CallExpression' &&
      node.arguments.length === 1 &&
      isRequire(node.arguments[0])
    ) {
      const isNamedInterop =
        node.callee.type === 'Identifier' &&
        interopFunctions.has(node.callee.name);
      const isInlineInterop =
        node.callee.type === 'FunctionExpression' &&
        originalText(node.callee).includes('__esModule');
      if (isNamedInterop || isInlineInterop) {
        const dependencyId = node.arguments[0].arguments[0].value;
        dependencies.add(dependencyId);
        edit(node, dependencyName(dependencyId));
      }
    }
    if (isRequire(node)) {
      const dependencyId = node.arguments[0].value;
      if (!MODULE_NAMES[dependencyId])
        throw new Error(`Unknown rendering dependency ${dependencyId}`);
      dependencies.add(dependencyId);
      edit(node, dependencyName(dependencyId));
    }
    if (
      exportsVisible &&
      node.type === 'MemberExpression' &&
      node.object.type === 'Identifier' &&
      node.object.name === exportsParam &&
      !node.computed
    ) {
      const name = node.property.name;
      if (name !== '__esModule') {
        exportNames.add(name);
        edit(node, exportedName(name));
      }
    }
    if (
      exportsVisible &&
      node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' &&
      node.callee.object.name === 'Object' &&
      node.callee.property.name === 'defineProperty' &&
      node.arguments[0]?.name === exportsParam &&
      node.arguments[1]?.value === '__esModule'
    ) {
      edit(node, 'void 0');
    }
    for (const child of children(node))
      visit(child, exportsVisible, requireVisible);
  }
  for (const child of root.body.body) visit(child);

  const imports = [...dependencies]
    .sort((a, b) => a - b)
    .map((dependencyId) =>
      EXTERNALS.has(dependencyId)
        ? `import { ${EXTERNALS.get(dependencyId)} as ${dependencyName(dependencyId)} } from '../vendor/libraries.js';`
        : `import * as ${dependencyName(dependencyId)} from './${MODULE_NAMES[dependencyId]}.js';`,
    );
  const declarations = [...exportNames].map(exportedName);
  const exports = [...exportNames].map((name) =>
    name === 'default' ? 'defaultExport as default' : name,
  );
  let transformed = applyEdits(body, edits);
  if (/\b(?:require|webpackChunk)\s*\(/.test(transformed)) {
    // A local, shadowed require() is permitted; original render modules contain none.
    if (factory.toString().startsWith('function(e,t,n)'))
      throw new Error(`Unconverted dependency in ${MODULE_NAMES[id]}`);
  }
  return (
    `// Extracted rendering module: ${MODULE_NAMES[id]}. See ../PROVENANCE.md.\n` +
    imports.join('\n') +
    '\n' +
    // Some older Babel interop expressions are inlined rather than called.
    // Retaining the original marker lets both forms use the real ES namespace.
    `export const __esModule = true;\n` +
    (declarations.length ? `let ${declarations.join(', ')};\n` : '') +
    transformed +
    '\n' +
    (exports.length ? `export { ${exports.join(', ')} };\n` : '')
  );
}

function thirdPartyFactories(modules) {
  const ids = [23402, 85880, 74638, 83761, 51458, 7452];
  const names = [
    'three',
    'gsap',
    'custom-ease',
    'browser-detector',
    'howler',
    'regenerator',
  ];
  return ids.map((id, index) => [names[index], modules[id].toString()]);
}

async function writeFormatted(file, source) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    await prettier.format(source, { parser: 'babel', singleQuote: true }),
  );
}

async function extractEngine({ source = SOURCE, output = OUTPUT } = {}) {
  const modules = loadChunkFactories(source);
  const renderer = unpackRenderer(modules[93823]);
  for (const [name, factory] of thirdPartyFactories(modules)) {
    // Third-party code retains its compiled form and exact version. Only this
    // small wrapper adapts its exports; it cannot load application chunks.
    fs.mkdirSync(path.join(output, 'vendor'), { recursive: true });
    fs.writeFileSync(
      path.join(output, 'vendor', `${name}.js`),
      `// Exact captured dependency. See ../PROVENANCE.md.\nexport default ${factory};\n`,
    );
  }
  for (let id = 0; id < renderer.length; id++) {
    if (EXTERNALS.has(id)) continue;
    await writeFormatted(
      path.join(output, 'renderer', `${MODULE_NAMES[id]}.js`),
      transformRendererModule(renderer[id], id),
    );
  }
  const fingerprint = crypto
    .createHash('sha256')
    .update(fs.readFileSync(source))
    .digest('hex');
  fs.writeFileSync(
    path.join(output, 'extraction.json'),
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
    ) + '\n',
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
  MODULE_NAMES,
};
