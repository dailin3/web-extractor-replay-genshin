const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createResourceMap } = require('../replay/resource-map');

const ENTRY_URL = 'https://ys.mihoyo.com/moon';
const OUTPUT_PATH = path.resolve(__dirname, '../artifacts/live-source.json');
const TEXTURE_NAMES = ['moon_a_tex', 'moon_b_tex', 'p3_moon', 'xingyun_a'];

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function normalizeMetadata(html) {
  const cosmeticNames = new Set(['description', 'keywords', 'robots', 'copyright']);
  const iconRelations = new Set(['icon', 'shortcut icon', 'apple-touch-icon', 'apple-touch-icon-precomposed']);
  function attributes(tag) {
    const values = new Map();
    for (const match of tag.matchAll(/\s([a-z][\w:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gi)) {
      const name = match[1].toLowerCase();
      if (!values.has(name)) values.set(name, match[2] ?? match[3] ?? match[4] ?? '');
    }
    return values;
  }
  // Ignore only known cosmetic metadata. Encoding, viewport, policies, and unknown tags remain exact.
  return html
    .replace(/<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, tag => {
      const values = attributes(tag);
      if (values.has('charset') || values.has('http-equiv')) return tag;
      const names = [values.get('name'), values.get('property')].filter(Boolean).map(name => name.toLowerCase());
      const cosmetic = names.length && names.every(name => cosmeticNames.has(name) || /^(?:og|twitter):/.test(name));
      return cosmetic ? '' : tag;
    })
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<link\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, tag => {
      const relation = (attributes(tag).get('rel') || '').toLowerCase().trim().replace(/\s+/g, ' ');
      return iconRelations.has(relation) ? '' : tag;
    });
}

function resourceReferences(html, baseUrl) {
  return [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["'][^>]*>/gi)]
    .map(match => new URL(match[1], baseUrl).href);
}

function findReference(references, expression) {
  const reference = references.find(url => expression.test(path.posix.basename(new URL(url).pathname)));
  if (!reference) throw new Error(`Live entry has no reference matching ${expression}`);
  return reference;
}

function currentTextureUrl(indexSource, name, runtimeBase) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = indexSource.match(new RegExp(`"(images/${escapedName}\\.[^"/]+\\.png)"`));
  if (!match) throw new Error(`Live index has no external texture named ${name}`);
  return new URL(match[1], runtimeBase).href;
}

async function fetchBytes(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(30_000),
    headers: { 'User-Agent': 'Moon-local-replay-source-verification/1.0' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${response.url}`);
  return { bytes: Buffer.from(await response.arrayBuffer()), finalUrl: response.url, status: response.status };
}

async function compareSource(label, record, liveUrl, downloaded) {
  const localBytes = fs.readFileSync(record.filePath);
  const result = {
    label,
    capturedUrl: record.originalUrl,
    liveUrl,
    localPath: path.relative(path.resolve(__dirname, '..'), record.filePath),
    localBytes: localBytes.length,
    localSha256: sha256(localBytes),
  };
  try {
    const live = downloaded || await fetchBytes(liveUrl);
    result.finalUrl = live.finalUrl;
    result.httpStatus = live.status;
    result.liveBytes = live.bytes.length;
    result.liveSha256 = sha256(live.bytes);
    result.byteIdentical = result.liveSha256 === result.localSha256;
    result.status = result.byteIdentical ? 'match' : 'different';
    if (label === 'entry HTML' && !result.byteIdentical) {
      result.metadataOnlyDifference = normalizeMetadata(localBytes.toString('utf8')) === normalizeMetadata(live.bytes.toString('utf8'));
      if (result.metadataOnlyDifference) result.status = 'metadata-only';
    }
  } catch (error) {
    result.status = 'unavailable';
    result.error = error.message;
  }
  return result;
}

async function verifyLiveSource() {
  const resources = createResourceMap();
  const records = [...resources.byOriginal.values()];
  const recordNamed = expression => {
    const record = records.find(item => expression.test(path.basename(item.filePath)));
    if (!record) throw new Error(`Captured source has no file matching ${expression}`);
    return record;
  };
  const report = {
    checkedAt: new Date().toISOString(),
    entryUrl: ENTRY_URL,
    scope: 'Entry, visual bundles, Chinese locale, generated font, and four opening/first-scene textures; no account/authentication APIs.',
    sources: [],
  };

  try {
    const entry = await fetchBytes(ENTRY_URL);
    report.sources.push(await compareSource('entry HTML', resources.entry, ENTRY_URL, entry));
    const html = entry.bytes.toString('utf8');
    const references = resourceReferences(html, entry.finalUrl);
    const bundles = [
      ['vendor JS', /^vendors_[\w]+\.js$/],
      ['scene JS', /^index_[\w]+\.js$/],
      ['styles JS', /^styles_[\w]+\.js$/],
      ['styles CSS', /^styles_[\w]+\.css$/],
    ];
    let liveIndex;
    let liveIndexUrl;
    // Keep requests sequential so the verification places little load on the live site.
    for (const [label, expression] of bundles) {
      const record = recordNamed(expression);
      const liveUrl = findReference(references, expression);
      try {
        const live = await fetchBytes(liveUrl);
        report.sources.push(await compareSource(label, record, liveUrl, live));
        if (label === 'scene JS') {
          liveIndex = live.bytes.toString('utf8');
          liveIndexUrl = live.finalUrl;
        }
      } catch (error) {
        report.sources.push({ label, capturedUrl: record.originalUrl, liveUrl, status: 'unavailable', error: error.message });
      }
    }

    const locale = records.find(record => /\/mi18n\/hk4e_cn\//.test(record.originalUrl) && /-zh-cn\.json$/.test(record.originalUrl));
    if (!locale) throw new Error('Captured Chinese locale is missing');
    report.sources.push(await compareSource('Chinese locale JSON', locale, locale.originalUrl));

    const fontConfig = records.find(record => /\.fontConfig\.json$/.test(record.originalUrl));
    const font = recordNamed(/\.woff2$/);
    if (!fontConfig) throw new Error('Captured generated-font configuration is missing');
    const liveConfig = await fetchBytes(fontConfig.originalUrl);
    report.sources.push(await compareSource('font configuration JSON', fontConfig, fontConfig.originalUrl, liveConfig));
    const configuration = JSON.parse(liveConfig.bytes.toString('utf8'));
    const fileName = configuration.fontList?.fontLink?.['zh-cn']?.fileName;
    if (!fileName) throw new Error('Live generated-font configuration has no Chinese fileName');
    const liveFontUrl = new URL(`${fileName}.woff2`, fontConfig.originalUrl).href;
    report.sources.push(await compareSource('Chinese WOFF2', font, liveFontUrl));

    if (liveIndex) {
      const publicPath = html.match(/\w\.p=["'](https?:\/\/[^"']+)["']/)?.[1];
      const runtimeBase = publicPath || new URL('./', liveIndexUrl).href;
      for (const name of TEXTURE_NAMES) {
        const record = recordNamed(new RegExp(`^${name}\\.[^.]+\\.\\.png$`));
        const liveUrl = currentTextureUrl(liveIndex, name, runtimeBase);
        report.sources.push(await compareSource(`texture ${name}`, record, liveUrl));
      }
    } else {
      report.error = 'Live scene JS is unavailable; its current texture references could not be checked.';
    }
  } catch (error) {
    report.error = error.message;
  }

  report.summary = {
    checked: report.sources.length,
    byteIdentical: report.sources.filter(source => source.status === 'match').length,
    metadataOnly: report.sources.filter(source => source.status === 'metadata-only').length,
    different: report.sources.filter(source => source.status === 'different').length,
    unavailable: report.sources.filter(source => source.status === 'unavailable').length,
  };
  report.currentVisualSourcesVerified = !report.error && report.sources.length === 12 &&
    report.sources.every(source => source.status === 'match' || source.status === 'metadata-only');
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2) + '\n');
  for (const source of report.sources) console.log(`${source.status}: ${source.label}`);
  if (report.error) console.error(report.error);
  console.log(JSON.stringify(report.summary));
  console.log(`Report: ${OUTPUT_PATH}`);
  return report;
}

if (require.main === module) {
  verifyLiveSource().then(report => {
    if (!report.currentVisualSourcesVerified) process.exitCode = 1;
  }).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { sha256, normalizeMetadata, resourceReferences, findReference, currentTextureUrl, compareSource, verifyLiveSource };
