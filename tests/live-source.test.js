const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { normalizeMetadata, compareSource } = require('../scripts/verify-live-source.cjs');

test('normalization ignores only SEO, sharing, copyright, title, and icon metadata', () => {
  const content = '<script>startScene()</script><link rel="stylesheet" href="scene.css">';
  const metadata = [
    '<meta name="description" content="A moon">',
    '<meta content="moon, stars" NAME=keywords>',
    '<meta property="og:title" content="A moon">',
    '<meta name="twitter:card" content="summary">',
    '<meta name="Copyright" content="miHoYo">',
    '<title>Moon</title>',
    '<link href="old.ico" rel="icon">',
    '<link rel="shortcut icon" href="old.ico">',
    '<link rel="apple-touch-icon-precomposed" href="old.png">',
  ];
  assert.equal(normalizeMetadata(metadata.join('') + content), content);
});

test('normalization preserves viewport, encodings, CSP, and other runtime metadata', () => {
  const tags = [
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta charset="utf-8">',
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">',
    '<meta http-equiv="Content-Security-Policy" content="script-src self">',
    '<meta http-equiv="refresh" content="0;url=/new">',
    '<meta name="renderer" content="webkit">',
    '<meta name="theme-color" content="#000000">',
    '<meta name="scene-setting" content="moon">',
    '<meta charset="utf-8" name="description" content="Keep encoding">',
    '<meta http-equiv="refresh" name="description" content="0">',
  ];
  for (const tag of tags) assert.equal(normalizeMetadata(tag), tag, tag);
});

test('metadata-like custom attributes and stylesheet/preload links remain significant', () => {
  const tags = [
    '<meta data-name="description" content="used by scene">',
    '<link rel="stylesheet" href="scene.css">',
    '<link rel="preload" as="font" href="scene.woff2">',
    '<script>const viewport = 1920;</script>',
  ];
  for (const tag of tags) assert.equal(normalizeMetadata(tag), tag, tag);
});

test('source comparison cannot label a changed viewport, charset, or CSP as metadata-only', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'moon-live-source-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, 'entry.html');
  const original = '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="Content-Security-Policy" content="script-src self"><title>Old</title></head>';
  fs.writeFileSync(filePath, original);
  const record = { filePath, originalUrl: 'https://example.test/moon' };
  const compare = html => compareSource('entry HTML', record, record.originalUrl, {
    bytes: Buffer.from(html), finalUrl: record.originalUrl, status: 200,
  });
  for (const changed of [
    original.replace('utf-8', 'utf-16'),
    original.replace('width=device-width', 'width=1920'),
    original.replace('script-src self', 'script-src none'),
  ]) {
    const result = await compare(changed);
    assert.equal(result.status, 'different');
    assert.equal(result.metadataOnlyDifference, false);
  }
  const titleChange = await compare(original.replace('Old', 'New'));
  assert.equal(titleChange.status, 'metadata-only');
  assert.equal(titleChange.metadataOnlyDifference, true);
});
