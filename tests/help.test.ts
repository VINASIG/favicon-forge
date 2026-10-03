import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_FILE_SIZE, MAX_IMAGE_PIXELS } from '../src/lib/generator.ts';
import { description, faviconQuestions } from '../src/lib/help.ts';

await test('help has distinct anchors for the five supported questions', () => {
  assert.deepEqual(
    faviconQuestions.map((item) => item.id),
    [
      'supported-images',
      'package-files',
      'local-processing',
      'maskable-icon',
      'favicon-cache',
    ],
  );
  assert.equal(new Set(faviconQuestions.map((item) => item.id)).size, 5);
  for (const item of faviconQuestions) {
    assert(item.question.endsWith('?'));
    assert(item.answer.length > 0);
  }
});

await test('input guidance follows the generator limits and output formats', () => {
  const input = faviconQuestions[0].answer;
  assert(input.includes(`${String(MAX_FILE_SIZE / (1024 * 1024))} MB`));
  assert(
    input.includes(
      `${String(MAX_IMAGE_PIXELS / 1_000_000)} million decoded pixels`,
    ),
  );
  assert(input.includes('SVG input is rasterized into ICO and PNG output'));
  assert(description.includes('ICO and PNG favicons'));
});

await test('technical help references primary documentation over HTTPS', () => {
  const references = faviconQuestions.flatMap((item) =>
    item.reference ? [item.reference] : [],
  );
  assert.equal(references.length, 2);
  for (const reference of references) {
    const url = new URL(reference.href);
    assert.equal(url.protocol, 'https:');
    assert(
      ['developer.mozilla.org', 'developers.google.com'].includes(url.hostname),
    );
  }
});
