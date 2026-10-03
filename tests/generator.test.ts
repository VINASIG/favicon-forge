import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  createIco,
  errorMessage,
  fileNameToSiteName,
  fitBounds,
  formatBytes,
  makeManifest,
  makeReadme,
  makeSnippet,
  MAX_FILE_SIZE,
  OUTPUT_SIZES,
  validateDimensions,
  validateFile,
} from '../src/lib/generator.ts';
import { publicPage, sitemap } from '../src/lib/site.ts';
import { verifyStandards } from '../scripts/check-standards.ts';

await test('supported files remain browser-local input formats', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
    validateFile({ type, size: MAX_FILE_SIZE });
  assert.throws(() => {
    validateFile({ type: 'text/plain', size: 2 });
  }, /choose an image/);
  assert.throws(() => {
    validateFile({ type: 'image/gif', size: 2 });
  }, /PNG, JPG, WebP or SVG/);
  assert.throws(() => {
    validateFile({ type: 'image/png', size: MAX_FILE_SIZE + 1 });
  }, /too large/);
});
await test('image dimensions are checked before allocating a source canvas', () => {
  validateDimensions(4000, 4000);
  for (const [width, height] of [
    [0, 1],
    [1, -1],
    [1.5, 2],
    [Number.NaN, 2],
    [4001, 4000],
  ])
    assert.throws(() => {
      validateDimensions(width ?? 0, height ?? 0);
    });
});
await test('filename inference preserves the user site identity', () => {
  assert.equal(fileNameToSiteName('my_website-logo.svg'), 'my website logo');
  assert.equal(fileNameToSiteName('.svg'), 'My Website');
  assert.equal(fileNameToSiteName('Siêu_trí_tuệ.png'), 'Siêu trí tuệ');
});
await test('byte formatting retains useful units', () => {
  assert.equal(formatBytes(20), '20 B');
  assert.equal(formatBytes(2048), '2.0 KB');
  assert.equal(formatBytes(2 * 1024 * 1024), '2.0 MB');
});
await test('ordinary icons preserve aspect ratio and the existing output sizes', () => {
  assert.deepEqual(OUTPUT_SIZES, [16, 32, 48, 180, 192, 512]);
  assert.deepEqual(fitBounds(32, { x: 0, y: 0, width: 200, height: 100 }), {
    x: 0,
    y: 8,
    width: 32,
    height: 16,
  });
});
await test('every maskable rectangle corner fits the 40 percent safe circle', () => {
  for (const [width, height] of [
    [512, 512],
    [1000, 100],
    [100, 1000],
    [1, 4000],
    [4000, 1],
  ]) {
    assert(width && height);
    const rect = fitBounds(512, { x: 0, y: 0, width, height }, true);
    for (const x of [rect.x, rect.x + rect.width])
      for (const y of [rect.y, rect.y + rect.height])
        assert(Math.hypot(x - 256, y - 256) <= 512 * 0.4);
  }
});
await test('invalid icon geometry fails explicitly', () => {
  assert.throws(() => fitBounds(0, { x: 0, y: 0, width: 1, height: 1 }));
  assert.throws(() =>
    fitBounds(32, { x: 0, y: 0, width: Number.NaN, height: 1 }),
  );
  assert.throws(() => fitBounds(32, { x: 0, y: 0, width: 0, height: 1 }));
});
await test('ICO offsets and sizes match all packed image bytes', async () => {
  const entries = [16, 32, 48].map((size) => ({
    size,
    bytes: new Uint8Array([size, 1, 2, 3]),
  }));
  const data = await createIco(entries).arrayBuffer();
  const view = new DataView(data);
  assert.equal(view.getUint16(2, true), 1);
  assert.equal(view.getUint16(4, true), 3);
  for (const [index, entry] of entries.entries()) {
    const offset = 6 + 16 * index;
    assert.equal(view.getUint8(offset), entry.size);
    assert.equal(view.getUint32(offset + 8, true), 4);
    assert.equal(view.getUint32(offset + 12, true), 54 + index * 4);
  }
  assert.equal(data.byteLength, 66);
});
await test('ICO represents 256 pixels with the specified zero-byte convention', async () => {
  const data = await createIco([
    { size: 256, bytes: new Uint8Array([1]) },
  ]).arrayBuffer();
  assert.equal(new DataView(data).getUint8(6), 0);
});
await test('empty, missing-byte and invalid-size ICO entries are rejected', () => {
  assert.throws(() => createIco([]));
  assert.throws(() => createIco([{ size: 16, bytes: new Uint8Array() }]));
  assert.throws(() => createIco([{ size: 257, bytes: new Uint8Array([1]) }]));
});
await test('manifest JSON remains valid for punctuation and long filenames', () => {
  const name = 'A "quoted" website <test> with a long name';
  const manifest = JSON.parse(makeManifest(name)) as {
    name: string;
    short_name: string;
    icons: { src: string; purpose: string }[];
  };
  assert.equal(manifest.name, name);
  assert.equal(manifest.short_name.length, 20);
  const maskable = manifest.icons[2];
  assert(maskable);
  assert.equal(maskable.purpose, 'maskable');
  assert.equal(maskable.src, './android-chrome-512x512-maskable.png');
});
await test('setup instructions reference VINASIG without changing the generated site identity', () => {
  assert(makeSnippet().includes('rel="manifest"'));
  assert(makeReadme().includes('Generated locally in your browser.'));
});
await test('unknown errors have an explicit fallback message', () => {
  assert.equal(errorMessage(new Error('fixture')), 'fixture');
  assert.equal(errorMessage(null), 'An unexpected error occurred.');
});
await test('canonical and sitemap honor a project base and a root custom domain', () => {
  assert.equal(
    publicPage(new URL('https://vinasig.github.io'), '/favicon-forge').href,
    'https://vinasig.github.io/favicon-forge/',
  );
  assert.equal(
    publicPage(new URL('https://favicon.vinasig.io.vn'), '/').href,
    'https://favicon.vinasig.io.vn/',
  );
  assert(
    sitemap(new URL('https://example.org'), '/tools').includes(
      '<loc>https://example.org/tools/</loc>',
    ),
  );
  assert.throws(() => publicPage(undefined, '/tools'));
});
await test('the reviewed web profile and all managed snapshot files pass', async () => {
  const report = await verifyStandards();
  // The reviewed snapshot adds nine required licensing files to the existing 38.
  assert.equal(report.files, 47);
  for (const file of [
    'LICENSE',
    'LICENSES.md',
    'LICENSES/CC-BY-SA-4.0.txt',
    'BRAND_POLICY.md',
    'docs/audits/licensing-2026-10-04.md',
    'docs/license-text-sources.json',
    'policies/licensing.md',
    'templates/check-licenses.mjs',
    'templates/license-review.md',
  ])
    assert(
      (
        await readFile(
          new URL('../.vinasig/standards/' + file, import.meta.url),
        )
      ).length > 0,
    );
  assert.equal(report.runtimeDiscovery, 'NOT_RUN');
});
await test('production source and regression scripts do not suppress type checking', async () => {
  for (const file of [
    'src/pages/index.astro',
    'src/scripts/generator.ts',
    'src/lib/generator.ts',
    'src/lib/images.ts',
    'scripts/check-responsive.mjs',
  ]) {
    const source = await readFile(
      new URL(`../${file}`, import.meta.url),
      'utf8',
    );
    assert(!source.includes('@ts-' + 'nocheck'), `Suppressed source: ${file}`);
  }
});
