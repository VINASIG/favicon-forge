// @ts-nocheck - This script checks both the Node process and the browser's DOM context.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'astro';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/responsive', `regression-${randomUUID()}`);
const logo = await readFile(path.join(root, 'public/favicon.svg'));
const viewports = [[360,800], [390,844], [768,1024], [1024,768], [1440,900], ...[320,519,520,521,600,719,720,721,900,1280].map(width => [width,900])];
const failures = [];
let checks = 0;

await mkdir(output, { recursive: true });
await build({ root, logLevel: 'error' });
const server = await preview({ root, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
const url = `http://127.0.0.1:${server.port}/favicon-forge/`;
console.log(`Checking the fresh build at ${url}`);
let browser;

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.allSettled(document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity).map(animation => animation.finished));
  });
}

async function checkLayout(page, name, expectedColumns) {
  await settle(page);
  const problems = await page.evaluate(expectedColumns => {
    const problems = [];
    const fits = (child, parent) => child.left >= parent.left - 1 && child.right <= parent.right + 1;
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) problems.push('Document overflows horizontally');
    const source = document.querySelector('.source-link').getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.product-name'));
    if ([...range.getClientRects()].some(box => box.left < source.right && box.right > source.left && box.top < source.bottom && box.bottom > source.top)) problems.push('Header title overlaps View source');
    const cards = [...document.querySelectorAll('.preview-card')];
    if (!document.querySelector('#result-panel').hidden) {
      if (cards.length !== 6) problems.push('A preview size is missing');
      for (const [index, card] of cards.entries()) {
        const box = card.getBoundingClientRect();
        const image = card.querySelector('img').getBoundingClientRect();
        const label = card.querySelector('span').getBoundingClientRect();
        if (!fits(image, box) || !fits(label, box)) problems.push(`Preview ${index + 1} exceeds its card`);
        if (image.width !== 80 || image.height !== 80) problems.push(`Preview ${index + 1} was resized`);
      }
      if (expectedColumns && cards.filter(card => Math.abs(card.getBoundingClientRect().top - cards[0].getBoundingClientRect().top) < 1).length !== expectedColumns) problems.push('Default preview column count changed');
      const button = document.querySelector('#download-button');
      for (const child of button.children) {
        if (child.getClientRects().length && !fits(child.getBoundingClientRect(), button.getBoundingClientRect())) problems.push('Download content exceeds its button');
      }
      const spinner = document.querySelector('.spinner');
      if (!spinner.hidden) {
        const style = getComputedStyle(spinner);
        if (style.width !== '20px' || style.height !== '20px') problems.push(`Loading spinner shrank to ${style.width} by ${style.height}`);
      }
      for (const selector of ['#drop-zone', '#download-button']) {
        if (document.querySelector(selector).getBoundingClientRect().height < 44) problems.push(`${selector} has a small hit target`);
      }
    }
    return problems;
  }, expectedColumns);
  checks++;
  if (problems.length) {
    const screenshot = path.join(output, `${name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    failures.push({ name, problems, screenshot });
  }
}

try {
  browser = await chromium.launch({ headless: true });
  for (const [width, height] of viewports) {
    for (const fontPercent of [100, 200]) {
      const name = `index--${width}x${height}--text-${fontPercent}`;
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 390, isMobile: width <= 390, acceptDownloads: true, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => failures.push({ name, problems: [error.message] }));
      await page.goto(url);
      await page.evaluate(percent => { document.documentElement.style.fontSize = `${percent}%`; }, fontPercent);
      await checkLayout(page, `${name}--empty`);
      const chooserEvent = page.waitForEvent('filechooser');
      if (width <= 390) await page.locator('#drop-zone').tap();
      else { await page.locator('#drop-zone').focus(); await page.keyboard.press('Enter'); }
      await (await chooserEvent).setFiles({ name: `${'x'.repeat(220)}.svg`, mimeType: 'image/svg+xml', buffer: logo });
      await page.locator('#result-panel').waitFor({ state: 'visible' });
      await checkLayout(page, `${name}--uploaded`, fontPercent === 100 ? width <= 520 ? 2 : 3 : undefined);
      await page.evaluate(() => {
        const original = HTMLCanvasElement.prototype.toBlob;
        let release;
        const gate = new Promise(resolve => { release = resolve; });
        HTMLCanvasElement.prototype.toBlob = function (callback, ...args) { original.call(this, blob => gate.then(() => callback(blob)), ...args); };
        window.releaseResponsiveCanvas = () => { HTMLCanvasElement.prototype.toBlob = original; release(); };
      });
      const downloadEvent = page.waitForEvent('download');
      await page.locator('#download-button').click();
      try {
        assert.equal(await page.locator('#download-button').getAttribute('aria-busy'), 'true');
        assert.equal(await page.locator('#drop-zone').isDisabled(), true);
        await checkLayout(page, `${name}--creating-package`);
      } finally { await page.evaluate(() => window.releaseResponsiveCanvas()); }
      assert.equal((await downloadEvent).suggestedFilename(), 'favicon-package.zip');
      await page.locator('#download-button:not([disabled])').waitFor();
      assert.equal(await page.locator('#download-button').getAttribute('aria-busy'), null);
      assert.equal(await page.locator('#drop-zone').isEnabled(), true);
      await page.locator('#file-input').setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('test fixture') });
      assert.equal(await page.getByRole('alert').textContent(), 'Please choose an image file.');
      await checkLayout(page, `${name}--validation-error`);
      await context.close();
    }
  }
} finally {
  await browser?.close();
  await server.stop();
  await writeFile(path.join(output, 'results.json'), JSON.stringify({ url, checks, failures }, null, 2));
}
console.log(`${checks} responsive states checked; ${failures.length} failures. Report: ${output}`);
for (const failure of failures) console.error(`${failure.name}: ${failure.problems.join('; ')}`);
assert.equal(failures.length, 0, 'Responsive regressions found; see the report and failure screenshots above.');
