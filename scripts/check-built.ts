import assert from 'node:assert/strict';
import { FileSystemConfigLoader, HtmlValidate } from 'html-validate';
import { publicPage } from '../src/lib/site.ts';
import {
  digest,
  message,
  parseJson,
  readLocal,
  record,
  repositoryRoot,
  text,
  writeOutput,
} from './local.ts';

try {
  const source = (await readLocal(repositoryRoot, 'dist/index.html')).toString(
    'utf8',
  );
  const validator = new HtmlValidate(new FileSystemConfigLoader());
  const result = await validator.validateString(source, 'dist/index.html');
  assert(
    result.valid,
    JSON.stringify(
      result.results.flatMap((item) => item.messages),
      null,
      2,
    ),
  );
  const expected = publicPage(
    new URL(process.env['SITE_URL'] ?? 'https://vinasig.github.io'),
    process.env['BASE_PATH'] ?? '/favicon-forge',
  ).href;
  assert(source.includes(`href="${expected}"`), 'Missing canonical URL');
  assert(
    source.includes('application/ld+json') && source.includes('WebApplication'),
    'Missing application metadata',
  );
  const xml = (await readLocal(repositoryRoot, 'dist/sitemap.xml')).toString(
    'utf8',
  );
  assert(
    xml.includes(`<loc>${expected}</loc>`),
    'Sitemap and canonical differ',
  );
  const manifest = record(
    parseJson(await readLocal(repositoryRoot, 'docs/asset-manifest.json')),
  );
  const assets = Object.entries(record(manifest['files']));
  assert.equal(assets.length, 10);
  for (const [file, expectedDigest] of assets) {
    assert(
      file.startsWith('public/'),
      'Asset path leaves the public directory',
    );
    const bytes = await readLocal(repositoryRoot, file);
    assert.equal(
      digest(bytes),
      text(expectedDigest),
      `Changed preserved asset: ${file}`,
    );
    assert.deepEqual(
      await readLocal(repositoryRoot, `dist/${file.slice(7)}`),
      bytes,
      `Published asset differs: ${file}`,
    );
  }
  await writeOutput(
    repositoryRoot,
    'output/checks/built.json',
    `${JSON.stringify({ status: 'PASS', canonical: expected, htmlValidation: 'PASS', sitemap: 'PASS', preservedAssets: assets.length }, null, 2)}\n`,
  );
  console.log(
    `Built HTML, sitemap and ${String(assets.length)} preserved assets passed.`,
  );
} catch (error) {
  console.error(`Built-site checks failed: ${message(error)}`);
  process.exitCode = 1;
}
