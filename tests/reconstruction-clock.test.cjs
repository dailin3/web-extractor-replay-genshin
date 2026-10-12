const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const acorn = require('acorn');

function createClock() {
  const source = fs.readFileSync('scripts/verify-reconstruction.cjs', 'utf8');
  const tree = acorn.parse(source, { ecmaVersion: 'latest' });
  const clock = tree.body.find(node => node.type === 'FunctionDeclaration' && node.id.name === 'controlledClock');
  const animations = [];
  const browser = {
    performance: {}, document: { getAnimations: () => animations },
    localStorage: { removeItem() {} }, addEventListener() {},
  };
  browser.window = browser;
  const context = vm.createContext(browser);
  vm.runInContext(`(${source.slice(clock.start, clock.end)})()`, context);
  return { browser, animations, clock: browser.__captureClock };
}

function animation() {
  return { currentTime: 0, paused: false, pause() { this.paused = true; } };
}

test('initial CSS animations advance from virtual zero', async () => {
  const { animations, clock } = createClock();
  const initial = animation();
  animations.push(initial);
  await clock.step(30);
  assert.ok(Math.abs(initial.currentTime - 500) < 1e-8);
  assert.equal(initial.paused, true);
});

test('a transition created in a later RAF starts at age zero rather than global elapsed time', async () => {
  const { browser, animations, clock } = createClock();
  await clock.step(90);
  const fade = animation();
  browser.requestAnimationFrame(() => animations.push(fade));
  await clock.step(1);
  assert.equal(fade.currentTime, 0);
  await clock.step(6);
  assert.ok(Math.abs(fade.currentTime - 100) < 1e-8);
  assert.equal(fade.paused, true);
});

test('animations created between RAF callbacks use the current virtual time as their birth', async () => {
  const { animations, clock } = createClock();
  await clock.step(90);
  const hint = animation();
  animations.push(hint);
  await clock.flush();
  assert.equal(hint.currentTime, 0);
  await clock.step(15);
  assert.ok(Math.abs(hint.currentTime - 250) < 1e-8);
});

function verifierHelper(name) {
  const source = fs.readFileSync('scripts/verify-reconstruction.cjs', 'utf8');
  const tree = acorn.parse(source, { ecmaVersion: 'latest' });
  const node = tree.body.find(node => node.type === 'FunctionDeclaration' && node.id.name === name);
  assert.ok(node, `${name} must provide a testable verification boundary`);
  return vm.runInNewContext(`(${source.slice(node.start, node.end)})`);
}

test('the verifier URL respects the documented variable and retains the legacy alias', () => {
  const getUrl = verifierHelper('getReconstructionUrl');
  assert.equal(getUrl({}), 'http://127.0.0.1:4174');
  assert.equal(getUrl({ RECON_URL: 'http://127.0.0.1:9000' }), 'http://127.0.0.1:9000');
  assert.equal(getUrl({ RECONSTRUCTION_URL: 'http://127.0.0.1:9001', RECON_URL: 'http://127.0.0.1:9000' }), 'http://127.0.0.1:9001');
});

test('a one-code loading difference is a failure, like every other pixel mismatch', () => {
  const mismatches = verifierHelper('getVisualMismatches');
  const report = { scenarios: [{ label: '1200x660@1', checkpoints: [
    { name: 'loading', differentPixels: 41, maxChannelError: 1 },
    { name: 'intro-start', differentPixels: 0, maxChannelError: 0 },
    { name: 'three-stars', differentPixels: 1, maxChannelError: 1 },
  ] }] };
  assert.equal(mismatches(report).length, 2);
  assert.equal(mismatches(report)[0].name, 'loading');
  assert.equal(mismatches(report)[1].name, 'three-stars');
});

test('the targeted stars run reaches three-stars rather than stopping at the intro', () => {
  const checkpoint = verifierHelper('getQuickCheckpoint');
  assert.equal(checkpoint({}), null);
  assert.equal(checkpoint({ RECON_QUICK: '1' }), 'intro-2s');
  assert.equal(checkpoint({ RECON_QUICK: 'three-stars' }), 'three-stars');
});
