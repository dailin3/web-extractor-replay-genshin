/** Load declarative scene resources. No original application JavaScript is executed. */
export async function loadSceneData({ THREE, utils, fetch: fetchResource = globalThis.fetch } = {}) {
  async function readJson(filename) {
    const response = await fetchResource(new URL(filename, import.meta.url));
    if (!response.ok) throw new Error(`Cannot load scene data ${filename}: ${response.status}`);
    return response.json();
  }

  const [layoutData, timelineSetting, images, spineSetting, materials, words, font, assets] =
    await Promise.all(['layout.json', 'timelines.json', 'images.json', 'spines.json', 'materials.json',
      'words.zh-cn.json', 'font.json', 'assets.json'].map(readJson));
  await Promise.all(Object.values(materials).flatMap(material => ['vertexShader', 'fragmentShader'].map(async field => {
    const response = await fetchResource(material[field]);
    if (!response.ok) throw new Error(`Cannot load shader ${material[field]}: ${response.status}`);
    material[field] = await response.text();
  })));

  return {
    layoutData,
    timelineSetting,
    imageManifest: images.imageSetting,
    imageSetting: images.textureSettings,
    loadingManifest: images.loadingManifest,
    localeTextureKeys: images.localeTextureKeys,
    spineSetting,
    shaderSetting: THREE ? createShaderSetting(THREE, utils, materials) : materials,
    words,
    font,
    ...assets,
  };
}

/** Reconstitute typed uniforms and native material defaults from named data. */
export function createShaderSetting(THREE, utils, materials) {
  function createValue(value) {
    if (!value || typeof value !== 'object') return value;
    if (value.$type === 'GradientTexture') return utils.createGradientTexture(value.config);
    if (value.$type) return new THREE[value.$type](...value.args);
    if (Array.isArray(value)) return value.map(createValue);
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, createValue(child)]));
  }
  return Object.fromEntries(Object.entries(materials).map(([name, material]) =>
    [name, new THREE.ShaderMaterial(createValue(material))]));
}
