const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const acorn = require('acorn');
const { createResourceMap, RUNTIME_ORIGIN } = require('../replay/resource-map.js');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'projects/ys.mihoyo.com/assets/index_44ff6b130c7baea7b639.js');
const OUTPUT = path.join(ROOT, 'app/data');
const SCENES = new Set(['scene_ui', 'scene_loading', 'scene_moon', 'scene_moon_0', 'effect_dofBlur']);
const TRACKS = new Set(['points_text', 'p1', 'index_out', '彩蛋1', 'story_text', 'story_ani', '一期动画', 'p1_静止', 'p1_一期']);

/** Capture factory definitions without running the bundle's entry or application. */
function loadFactories(source = SOURCE) {
  const modules = {};
  const context = { self: { webpackChunke20250310nodkrai_skctj9: {
    push(chunk) { Object.assign(modules, chunk[1]); },
  } } };
  vm.runInNewContext(fs.readFileSync(source, 'utf8'), context, { timeout: 5000 });
  return modules;
}

function walk(node, visit) {
  visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => child?.type && walk(child, visit));
    else if (value?.type) walk(value, visit);
  }
}

/** Timeline groups are JSON literals; their GSAP registration code is never evaluated. */
function parseJsonGroups(factory) {
  const tree = acorn.parse(`(${factory.toString()})`, { ecmaVersion: 'latest' });
  const groups = [];
  walk(tree, node => {
    if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression' &&
      node.callee.object.name === 'JSON' && node.callee.property.name === 'parse') {
      if (typeof node.arguments[0]?.value !== 'string') throw new Error('Expected a JSON literal');
      groups.push(JSON.parse(node.arguments[0].value));
    }
  });
  return groups;
}

function writeJson(output, file, value) {
  fs.mkdirSync(path.dirname(path.join(output, file)), { recursive: true });
  fs.writeFileSync(path.join(output, file), JSON.stringify(value, null, 2) + '\n');
}

/** A serializable stand-in records material constructors without requiring a GPU. */
function materialRecordingTypes() {
  const types = {};
  for (const name of ['Vector2', 'Vector3', 'Vector4', 'Color', 'Matrix3', 'Matrix4']) {
    types[name] = class {
      constructor(...args) { this.$type = name; this.args = args; }
    };
  }
  types.ShaderMaterial = class {
    constructor(parameters) { Object.assign(this, parameters); }
  };
  return types;
}

function extractSceneData({ source = SOURCE, output = OUTPUT } = {}) {
  const factories = loadFactories(source);
  const resources = createResourceMap();
  const cache = new Map();
  const types = materialRecordingTypes();
  const rendererUtilities = { utils: { createGradientTexture: config => ({ $type: 'GradientTexture', config }) } };
  function requireData(id) {
    if (id === 23402) return types;
    if (id === 93823) return rendererUtilities;
    if (cache.has(id)) return cache.get(id).exports;
    const factory = factories[id];
    if (!factory) throw new Error(`Unknown data module ${id}`);
    // Only the three registries and modules containing plain asset/JSON exports
    // are accepted. This rejects application, Vue and account SDK dependencies.
    if (![50440, 20444, 1924, 70344].includes(id) && !/^function\(e(?:,t,a)?\)\{(?:"use strict";)?e\.exports=/.test(factory.toString())) {
      throw new Error(`Non-data module ${id} cannot be extracted`);
    }
    const module = { exports: {} };
    cache.set(id, module);
    factory(module, module.exports, requireData);
    return module.exports;
  }
  requireData.p = RUNTIME_ORIGIN;
  requireData.d = (exports, getters) => {
    for (const [name, getter] of Object.entries(getters)) Object.defineProperty(exports, name, { enumerable: true, get: getter });
  };

  const originalLayout = requireData(50440);
  const layoutData = JSON.parse(JSON.stringify(originalLayout));
  layoutData.sceneList = layoutData.sceneList.filter(scene => SCENES.has(scene.id));
  // Later phase compositing planes are removed; all retained nodes are unchanged.
  layoutData.sceneList.find(scene => scene.id === 'scene_ui').children =
    layoutData.sceneList.find(scene => scene.id === 'scene_ui').children.filter(node => ['scene_loading', 'scene_moon'].includes(node.name));
  const usedGeometry = new Set();
  walkData(layoutData.sceneList, node => { if (node.geometry?.id) usedGeometry.add(node.geometry.id); });
  layoutData.geometries = Object.fromEntries(Object.entries(layoutData.geometries).filter(([id]) => usedGeometry.has(id)));
  writeJson(output, 'layout.json', layoutData);

  const timelineSetting = Object.fromEntries(Object.entries(Object.assign({}, ...parseJsonGroups(factories[1398])))
    .filter(([name]) => TRACKS.has(name)));
  writeJson(output, 'timelines.json', timelineSetting);

  const registries = requireData(20444);
  const wordRecord = [...resources.byOriginal.values()].find(record => record.originalUrl.includes('m20250409hy4c4vnwg0-zh-cn.json'));
  const originalWords = JSON.parse(fs.readFileSync(wordRecord.filePath, 'utf8'));
  const localeTextureKeys = requireData(99113);
  const inlineUrls = new Map();
  function localizeImage(src, name) {
    if (src.startsWith('data:')) {
      if (inlineUrls.has(src)) return inlineUrls.get(src);
      const match = /^data:image\/(png|jpeg|jpg|webp);base64,(.*)$/s.exec(src);
      if (!match) throw new Error(`Unsupported embedded texture ${name}`);
      const filename = `textures/${name}.${match[1] === 'jpeg' ? 'jpg' : match[1]}`;
      fs.mkdirSync(path.join(output, 'textures'), { recursive: true });
      fs.writeFileSync(path.join(output, filename), Buffer.from(match[2], 'base64'));
      const url = `/data/${filename}`;
      inlineUrls.set(src, url);
      return url;
    }
    const record = resources.byOriginal.get(src);
    if (!record) throw new Error(`Uncaptured texture ${name}: ${src}`);
    return record.localUrl;
  }
  const imageSetting = registries.eC.map((image, index) => ({ ...image,
    src: localizeImage(originalWords[localeTextureKeys[image.id]] || image.src, `${image.id}-${index}`),
  }));
  const loadingManifest = registries.to.map(image => ({ ...image, src: localizeImage(image.src, image.id) }));
  writeJson(output, 'images.json', { loadingManifest, imageSetting, textureSettings: requireData(70344).A, localeTextureKeys });

  const spineIds = new Set();
  walkData(layoutData.sceneList, node => { if (node.spine?.id) spineIds.add(node.spine.id); });
  const spineSetting = Object.fromEntries(Object.entries(registries.WC).filter(([name]) => spineIds.has(name)));
  writeJson(output, 'spines.json', spineSetting);
  for (const [name, spine] of Object.entries(spineSetting)) {
    writeJson(output, `spines/${name}.json`, spine.json);
    fs.writeFileSync(path.join(output, `spines/${name}.atlas`), spine.atlas);
  }

  const materialDefinitions = requireData(1924).A;
  for (const [name, material] of Object.entries(materialDefinitions)) {
    const basename = name.toLowerCase().replaceAll('_', '-');
    fs.mkdirSync(path.join(output, 'shaders'), { recursive: true });
    for (const [field, suffix] of [['vertexShader', 'vert'], ['fragmentShader', 'frag']]) {
      const filename = `shaders/${basename}.${suffix}.glsl`;
      fs.writeFileSync(path.join(output, filename), material[field]);
      material[field] = `/data/${filename}`;
    }
  }
  writeJson(output, 'materials.json', materialDefinitions);

  const wordNames = ['click_to_start', 'loading_number', 'loading_text', 'loading_tip', 'login', 'rules_title', 'rules_content',
    'loading_hint_0', 'loading_hint_1', 'moon_text_0', 'moon_text_1', 'moon_text_2', 'moon_text_3', 'wheel_hint', 'touch_hint',
    'sea_copyright', 'sea_privacy', 'sea_user_contract'];
  writeJson(output, 'words.zh-cn.json', Object.fromEntries(wordNames.map(name => [name, originalWords[name]])));
  const assetNames = ['site_logo', 'music_play_icon', 'music_play_hover_icon', 'music_mute_icon', 'music_mute_hover_icon'];
  const uiAssets = Object.fromEntries(assetNames.map(name => [name, localizeImage(originalWords[name], name)]));
  const soundAssets = Object.fromEntries([...resources.byOriginal.values()].filter(record => /sound.*\.mp3$/.test(record.filePath))
    .map(record => [path.basename(record.filePath).split('.')[0], record.localUrl]));
  soundAssets.background = [...resources.byOriginal.values()].find(record => /kathisma_chrysopoleos.*\.mp3$/.test(record.filePath)).localUrl;
  writeJson(output, 'assets.json', { uiAssets, soundAssets });
  const fontRecord = [...resources.byOriginal.values()].find(record => record.originalUrl.endsWith('m20250409hy4c4vnwg0_hk4e_cn_zh-cn_3nc4ar.woff2'));
  writeJson(output, 'font.json', { family: 'fontLink', src: fontRecord.localUrl, weight: 'normal', style: 'normal' });
  writeJson(output, 'extraction.json', {
    source: path.relative(ROOT, source), sha256: crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),
    sourceModules: { layout: 50440, timelines: 1398, imagesAndSpines: 20444, materials: 1924 },
    scenes: [...SCENES], timelineNames: Object.keys(timelineSetting),
    embeddedTextures: inlineUrls.size, imageSources: imageSetting.length, spineNames: Object.keys(spineSetting),
  });
  return { scenes: layoutData.sceneList.length, tracks: Object.keys(timelineSetting).length, images: imageSetting.length, output };
}

function walkData(value, visit) {
  if (!value || typeof value !== 'object') return;
  visit(value);
  for (const child of Object.values(value)) walkData(child, visit);
}

if (require.main === module) console.log(extractSceneData());
module.exports = { extractSceneData, parseJsonGroups, loadFactories };
