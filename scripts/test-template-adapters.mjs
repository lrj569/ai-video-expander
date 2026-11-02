import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import { test } from 'node:test';

function load(relative) {
  const source = readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8');
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, URL });
  return exports;
}

const { pageCanonical, socialImageValues } = load('../src/lib/page-metadata/values.ts');
const { normalizeLockedCopy } = load('../src/lib/locked-copy.ts');

test('domain-free Home and Guide retain nonempty canonical paths, including empty overrides', () => {
  for (const explicit of [undefined, null, '', '   ']) {
    assert.equal(pageCanonical('', '/', explicit), '/');
    assert.equal(pageCanonical('', '/guide', explicit), '/guide');
  }
});

test('configured origins and explicit metadata preserve the intended public URL', () => {
  assert.equal(pageCanonical(' https://site.test/ ', '/'), 'https://site.test');
  assert.equal(pageCanonical('https://site.test/', '/guide'), 'https://site.test/guide');
  assert.equal(pageCanonical('https://site.test', '/guide', 'https://other.test/article'), 'https://other.test/article');
  assert.equal(pageCanonical('', '/guide', new URL('https://site.test/guide')), 'https://site.test/guide');
});

test('numeric social dimensions become HTML strings and optional fields survive', () => {
  const image = socialImageValues({ url: '/share.png', width: 1200, height: '630', alt: 'Portrait', type: 'image/png' }, '/fallback.png');
  assert.equal(image.width, '1200');
  assert.equal(image.height, '630');
  assert.equal(image.alt, 'Portrait');
  assert.equal(image.type, 'image/png');
});

test('image URL forms and invalid dimensions do not leak objects or invalid meta values', () => {
  assert.equal(socialImageValues(undefined, '/fallback.png').url, '/fallback.png');
  assert.equal(socialImageValues('/share.png', '/fallback.png').url, '/share.png');
  assert.equal(socialImageValues(new URL('https://site.test/share.png'), '/fallback.png').url, 'https://site.test/share.png');
  for (const invalid of ['', 'auto', -1, 0, NaN, Infinity, 1.5]) {
    assert.equal(socialImageValues({ width: invalid, height: invalid }, '/fallback.png').width, undefined);
    assert.equal(socialImageValues({ width: invalid, height: invalid }, '/fallback.png').height, undefined);
  }
});

test('locked module parsing is identical for LF, CRLF, CR and BOM; public heading is not duplicated', () => {
  const document = '## Internal slot\n\n## Public heading\n\n### Step\nKeep this exact sentence.\n';
  for (const source of [document, document.replaceAll('\n', '\r\n'), document.replaceAll('\n', '\r'), '\uFEFF' + document]) {
    const normalized = normalizeLockedCopy(source);
    assert.equal(normalized, document);
    const raw = normalized.trim().replace(/^## [^\n]+\n+/, '');
    assert.equal(raw.match(/^## (.+)$/m)[1], 'Public heading');
    const body = raw.replace(/^## [^\n]+\n+/, '');
    assert.ok(body.startsWith('### Step\n'));
    assert.ok(!body.includes('## Public heading'));
    assert.ok(body.includes('Keep this exact sentence.'));
  }
});
