import assert from 'node:assert/strict';
import { FileSystemConfigLoader, HtmlValidate } from 'html-validate';
import { publicPage } from '../src/lib/site.ts';
import { description, faviconQuestions } from '../src/lib/help.ts';
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
  const schemas = [
    ...source.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => record(parseJson(Buffer.from(match[1] ?? ''))));
  assert.equal(schemas.length, 1, 'Expected one application description');
  const application = schemas[0];
  assert(application);
  assert.equal(application['@type'], 'WebApplication');
  assert.equal(application['url'], expected);
  assert.equal(application['description'], description);
  assert.equal(application['isAccessibleForFree'], true);
  assert(
    source.includes(description),
    'Application description must be visible',
  );
  assert(source.includes('id="setup-heading"'), 'Missing static setup guide');
  for (const item of faviconQuestions) {
    assert(
      source.includes(`id="${item.id}"`),
      `Missing help anchor: ${item.id}`,
    );
    assert(
      source.includes(item.question),
      `Missing static question: ${item.id}`,
    );
    assert(source.includes(item.answer), `Missing static answer: ${item.id}`);
  }
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
    `${JSON.stringify({ status: 'PASS', canonical: expected, htmlValidation: 'PASS', sitemap: 'PASS', applicationMetadata: 'PASS', staticHelpQuestions: faviconQuestions.length, preservedAssets: assets.length }, null, 2)}\n`,
  );
  console.log(
    `Built HTML, sitemap and ${String(assets.length)} preserved assets passed.`,
  );
} catch (error) {
  console.error(`Built-site checks failed: ${message(error)}`);
  process.exitCode = 1;
}
