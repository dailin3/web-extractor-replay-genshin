const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { extractSceneData, parseJsonGroups, loadFactories } = require('../tools/extract-scene.cjs');

test('offline extraction preserves the complete first-phase scene hierarchy and all nine tracks', () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'moon-data-'));
  try {
    const result = extractSceneData({ output });
    const layout = JSON.parse(fs.readFileSync(path.join(output, 'layout.json')));
    assert.deepEqual(layout.sceneList.map(scene => scene.id),
      ['scene_ui', 'scene_loading', 'scene_moon', 'effect_dofBlur', 'scene_moon_0']);
    assert.deepEqual(layout.sceneList[0].children.map(node => node.name), ['scene_loading', 'scene_moon']);
    const raw = { exports: {} };
    loadFactories()[50440](raw);
    assert.deepEqual(layout.sceneList.find(scene => scene.id === 'scene_moon'),
      JSON.parse(JSON.stringify(raw.exports.sceneList.find(scene => scene.id === 'scene_moon'))));
    const timelines = JSON.parse(fs.readFileSync(path.join(output, 'timelines.json')));
    const originals = parseJsonGroups(loadFactories()[1398]);
    for (const [name, timeline] of Object.entries(timelines)) {
      assert.deepEqual(timeline, Object.assign({}, ...originals)[name]);
    }
    assert.equal(Object.keys(timelines).length, 9);
    assert.equal(result.scenes, 5);
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});

test('extraction separates exact GLSL, Spine, local image sources and Chinese text', () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'moon-data-'));
  try {
    extractSceneData({ output });
    const images = JSON.parse(fs.readFileSync(path.join(output, 'images.json')));
    assert.equal(images.imageSetting.length, 174);
    assert.ok(images.imageSetting.every(image => /^\/(local-assets|data\/textures)\//.test(image.src)));
    const words = JSON.parse(fs.readFileSync(path.join(output, 'words.zh-cn.json')));
    assert.equal(words.loading_hint_0, '曾牵引着原初的天球,<br/>为一整个世界带来爱与热忱的三月女神早已逝去');
    assert.equal(words.moon_text_3, '不再为「永恒」庇护的世界正走向终末，<br/>直到「新月」初升，牵动起命运的纺轮…');
    const materials = JSON.parse(fs.readFileSync(path.join(output, 'materials.json')));
    const factories = loadFactories();
    const shader = { exports: {} };
    factories[95653](shader);
    assert.equal(fs.readFileSync(path.join(output, materials.points_text.vertexShader.slice('/data/'.length)), 'utf8'), shader.exports);
    assert.equal(materials.points_text.uniforms.pointInfo.value.$type, 'Vector2');
    const spines = JSON.parse(fs.readFileSync(path.join(output, 'spines.json')));
    assert.equal(spines.click_xx.json.skeleton.spine, '4.2.33');
    assert.ok(spines.click_xx.atlas.includes('click_xx.png'));
    assert.ok(spines.story_d.json.animations);
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});

test('the browser data entry reconstructs typed uniforms and gradients without loading a business bundle', async () => {
  const { loadSceneData } = await import('../app/data/index.mjs');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'moon-data-'));
  const THREE = {};
  for (const name of ['Vector2', 'Vector3', 'Vector4', 'Color', 'Matrix3', 'Matrix4']) {
    THREE[name] = class { constructor(...args) { this.type = name; this.args = args; } };
  }
  THREE.ShaderMaterial = class { constructor(parameters) { Object.assign(this, parameters); } };
  const fetchPaths = [];
  try {
    extractSceneData({ output });
    const data = await loadSceneData({ THREE, utils: { createGradientTexture: config => ({ gradient: config }) },
      fetch: async resource => {
        const filename = String(resource).includes('/data/')
          ? String(resource).split('/data/').pop() : path.basename(String(resource));
        fetchPaths.push(filename);
        const bytes = fs.readFileSync(path.join(output, filename));
        return { ok: true, json: async () => JSON.parse(bytes), text: async () => bytes.toString() };
      },
    });
    assert.equal(data.imageManifest.length, 174);
    assert.deepEqual(data.imageSetting.moon_b_tex.config, { wrapS: 1000, wrapT: 1000 });
    assert.deepEqual(data.shaderSetting.points_text.uniforms.pointInfo.value.args, [2, 2]);
    assert.ok(data.shaderSetting.tex_move.uniforms.lightFallOff.value.gradient);
    assert.ok(data.soundAssets.background.includes('kathisma_chrysopoleos'));
    assert.ok(fetchPaths.every(filename => !/\.js$/.test(filename)));
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});
