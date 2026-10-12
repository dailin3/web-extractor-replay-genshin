const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const acorn = require('acorn');
const { test } = require('node:test');
const {
  loadChunkFactories,
  unpackRenderer,
  transformRendererModule,
} = require('../../tools/extract-engine.cjs');

test('renderer extraction has a closed dependency graph without application SDKs', () => {
  const modules = loadChunkFactories(
    path.resolve(
      'projects/ys.mihoyo.com/assets/vendors_3c19dbfdd57bec9e83ae.js',
    ),
  );
  const renderer = unpackRenderer(modules[93823]);
  assert.equal(renderer.length, 64);
  assert.match(renderer[56].toString(), /THREEPlayer/);
  assert.match(renderer[11].toString(), /SkeletonMesh/);
  assert.doesNotMatch(
    renderer.map(String).join('\n'),
    /AccountStore|initApiStore|webpackChunk|Vue\.prototype/,
  );
});

test('ES module conversion retains shadowed local variables and live exports', () => {
  const factory = vm.runInNewContext(
    '(function(module,exports,require){exports.result=void 0;var dependency=wrap(require(4));function wrap(value){return value&&value.__esModule?value:{default:value}};function unrelated(exports,require){return exports.result+require(4)}exports.result=dependency.default;})',
  );
  const converted = transformRendererModule(factory, 2);
  assert.match(converted, /import \* as dependency_base_timeline/);
  assert.match(converted, /export \{ result \}/);
  assert.match(
    converted,
    /function unrelated\(exports,require\)\{return exports.result\+require\(4\)\}/,
  );
  assert.doesNotMatch(converted, /wrap\(dependency_base_timeline\)/);
  assert.doesNotMatch(converted, /module\.exports/);
});

test('generated renderer uses static ES imports instead of a chunk loader', () => {
  const player = fs.readFileSync(
    path.resolve('app/engine/renderer/three-player.js'),
    'utf8',
  );
  assert.match(player, /export \{ THREEPlayer \}/);
  assert.match(player, /from ['"]\.\/spine-runtime\.js['"]/);
  assert.doesNotMatch(player, /webpackChunk|module\.exports/);
  const parsed = acorn.parse(player, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
  assert.equal(
    parsed.body.some((node) => node.type === 'ImportDeclaration'),
    true,
  );
  assert.equal(
    parsed.body.some((node) => node.type === 'ExportNamedDeclaration'),
    true,
  );
  assert.match(player, /export const __esModule = true/);
});
