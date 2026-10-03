import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { startPreview } from '../tests/helpers/preview.ts';
import { repositoryRoot } from './local.ts';

const output = path.join(
  repositoryRoot,
  'output/responsive',
  `regression-${randomUUID()}`,
);
const logo = await readFile(path.join(repositoryRoot, 'public/favicon.svg'));
/** @type {[number, number][]} */
const viewports = [
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  ...[320, 519, 520, 521, 600, 719, 720, 721, 900, 1280].map(
    /** @returns {[number, number]} */ (width) => [width, 900],
  ),
];
/** @type {{name: string, problems: string[], screenshot?: string}[]} */
const failures = [];
let checks = 0;
await mkdir(output, { recursive: true });
const server = await startPreview();
console.log(`Checking the fresh build at ${server.url}`);
/** @type {import('playwright').Browser | undefined} */
let browser;

/** @param {import('playwright').Page} page */
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.allSettled(
      document
        .getAnimations()
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished),
    );
  });
}

/** @param {import('playwright').Page} page
 * @param {string} name
 * @param {number | undefined} [expectedColumns]
 */
async function checkLayout(page, name, expectedColumns) {
  await settle(page);
  const problems = await page.evaluate((expected) => {
    /** @param {string} selector
     * @param {Document | HTMLElement} [parent]
     */
    function element(selector, parent = document) {
      const result = parent.querySelector(selector);
      if (!(result instanceof HTMLElement))
        throw new Error(`Missing layout element: ${selector}`);
      return result;
    }
    /** @param {DOMRect} child @param {DOMRect} parent */
    const fits = (child, parent) =>
      child.left >= parent.left - 1 && child.right <= parent.right + 1;
    const problems = [];
    if (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1
    )
      problems.push('Document overflows horizontally');
    const source = element('.source-link').getBoundingClientRect();
    const help = element('.help').getBoundingClientRect();
    const summaries = [...document.querySelectorAll('.help summary')];
    if (summaries.length !== 5) problems.push('A help question is missing');
    for (const summary of summaries) {
      const box = summary.getBoundingClientRect();
      if (!fits(box, help))
        problems.push('A help question exceeds its section');
      if (box.height < 44)
        problems.push('A help question has a small hit target');
    }
    const range = document.createRange();
    range.selectNodeContents(element('.product-name'));
    if (
      [...range.getClientRects()].some(
        (box) =>
          box.left < source.right &&
          box.right > source.left &&
          box.top < source.bottom &&
          box.bottom > source.top,
      )
    )
      problems.push('Header title overlaps View source');
    const cards = [...document.querySelectorAll('.preview-card')].filter(
      (card) => card instanceof HTMLElement,
    );
    if (!element('#result-panel').hidden) {
      if (cards.length !== 6) problems.push('A preview size is missing');
      for (const [index, card] of cards.entries()) {
        const box = card.getBoundingClientRect();
        const image = element('img', card).getBoundingClientRect();
        const label = element('span', card).getBoundingClientRect();
        if (!fits(image, box) || !fits(label, box))
          problems.push(`Preview ${String(index + 1)} exceeds its card`);
        if (image.width !== 80 || image.height !== 80)
          problems.push(`Preview ${String(index + 1)} was resized`);
      }
      const first = cards[0];
      if (
        expected &&
        first &&
        cards.filter(
          (card) =>
            Math.abs(
              card.getBoundingClientRect().top -
                first.getBoundingClientRect().top,
            ) < 1,
        ).length !== expected
      )
        problems.push('Default preview column count changed');
      const button = element('#download-button');
      for (const child of button.children) {
        if (
          child.getClientRects().length &&
          !fits(child.getBoundingClientRect(), button.getBoundingClientRect())
        )
          problems.push('Download content exceeds its button');
      }
      const spinner = element('.spinner');
      if (!spinner.hidden) {
        const style = getComputedStyle(spinner);
        if (style.width !== '20px' || style.height !== '20px')
          problems.push(
            `Loading spinner shrank to ${style.width} by ${style.height}`,
          );
      }
      for (const selector of ['#drop-zone', '#download-button'])
        if (element(selector).getBoundingClientRect().height < 44)
          problems.push(`${selector} has a small hit target`);
    }
    return problems;
  }, expectedColumns);
  checks++;
  const screenshot = path.join(output, `${name}.png`);
  // Successful screenshots are retained for explicit visual review, not auto-approved baselines.
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: screenshot, fullPage: true });
  if (problems.length) failures.push({ name, problems, screenshot });
}

try {
  browser = await chromium.launch({ headless: true });
  for (const [width, height] of viewports) {
    for (const fontPercent of [100, 200]) {
      const name = `index--${String(width)}x${String(height)}--text-${String(fontPercent)}`;
      const context = await browser.newContext({
        viewport: { width, height },
        hasTouch: width <= 390,
        isMobile: width <= 390,
        acceptDownloads: true,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      page.on('pageerror', (error) =>
        failures.push({ name, problems: [error.message] }),
      );
      await page.goto(server.url);
      await page.evaluate((percent) => {
        document.documentElement.style.fontSize = `${String(percent)}%`;
      }, fontPercent);
      await checkLayout(page, `${name}--empty`);
      const summaries = await page.locator('.help summary').all();
      for (const summary of summaries) {
        if (width <= 390) await summary.tap();
        else {
          await summary.focus();
          await page.keyboard.press('Enter');
        }
      }
      assert.equal(await page.locator('.help details[open]').count(), 5);
      await checkLayout(page, `${name}--help-open`);
      for (const summary of summaries) {
        await summary.focus();
        await page.keyboard.press('Space');
      }
      assert.equal(await page.locator('.help details[open]').count(), 0);
      const chooserEvent = page.waitForEvent('filechooser');
      if (width <= 390) await page.locator('#drop-zone').tap();
      else {
        await page.locator('#drop-zone').focus();
        await page.keyboard.press('Enter');
      }
      await (
        await chooserEvent
      ).setFiles({
        name: `${'x'.repeat(220)}.svg`,
        mimeType: 'image/svg+xml',
        buffer: logo,
      });
      await page.locator('#result-panel').waitFor({ state: 'visible' });
      await checkLayout(
        page,
        `${name}--uploaded`,
        fontPercent === 100 ? (width <= 520 ? 2 : 3) : undefined,
      );
      await page.evaluate(() => {
        const original = /** @type {HTMLCanvasElement['toBlob']} */ (
          Reflect.get(HTMLCanvasElement.prototype, 'toBlob')
        );
        let release = () => {};
        /** @type {Promise<void>} */
        const gate = new Promise((resolve) => {
          release = resolve;
        });
        /** @param {BlobCallback} callback
         * @param {string} [type]
         * @param {number} [quality]
         * @this {HTMLCanvasElement}
         */
        HTMLCanvasElement.prototype.toBlob = function (
          callback,
          type,
          quality,
        ) {
          original.call(
            this,
            (blob) => {
              void gate.then(() => {
                callback(blob);
              });
            },
            type,
            quality,
          );
        };
        const hooks =
          /** @type {Window & {releaseResponsiveCanvas:()=>void}} */ (window);
        hooks.releaseResponsiveCanvas = () => {
          HTMLCanvasElement.prototype.toBlob = original;
          release();
        };
      });
      const downloadEvent = page.waitForEvent('download');
      await page.locator('#download-button').click();
      try {
        assert.equal(
          await page.locator('#download-button').getAttribute('aria-busy'),
          'true',
        );
        assert.equal(await page.locator('#drop-zone').isDisabled(), true);
        await checkLayout(page, `${name}--creating-package`);
      } finally {
        await page.evaluate(() => {
          const hooks =
            /** @type {Window & {releaseResponsiveCanvas:()=>void}} */ (window);
          hooks.releaseResponsiveCanvas();
        });
      }
      assert.equal(
        (await downloadEvent).suggestedFilename(),
        'favicon-package.zip',
      );
      await page.locator('#download-button:not([disabled])').waitFor();
      assert.equal(
        await page.locator('#download-button').getAttribute('aria-busy'),
        null,
      );
      assert.equal(await page.locator('#drop-zone').isEnabled(), true);
      await page.locator('#file-input').setInputFiles({
        name: 'notes.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('test fixture'),
      });
      assert.equal(
        await page.getByRole('alert').textContent(),
        'Please choose an image file.',
      );
      await checkLayout(page, `${name}--validation-error`);
      await context.close();
    }
  }
} finally {
  await browser?.close();
  await server.stop();
  await writeFile(
    path.join(output, 'results.json'),
    JSON.stringify({ url: server.url, checks, failures }, null, 2) + '\n',
  );
  await mkdir(path.join(repositoryRoot, 'output/checks'), { recursive: true });
  await writeFile(
    path.join(repositoryRoot, 'output/checks/responsive.json'),
    JSON.stringify(
      {
        status: failures.length ? 'FAIL' : 'PASS',
        engine: 'Chromium',
        checks,
        failures,
        screenshots: path.relative(repositoryRoot, output),
      },
      null,
      2,
    ) + '\n',
  );
}
console.log(
  `${String(checks)} responsive states checked; ${String(failures.length)} failures. Report: ${output}`,
);
for (const failure of failures)
  console.error(`${failure.name}: ${failure.problems.join('; ')}`);
assert.equal(
  failures.length,
  0,
  'Responsive regressions found; see the report and screenshots.',
);
