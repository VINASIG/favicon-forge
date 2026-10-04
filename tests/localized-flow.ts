import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
import type { Browser } from 'playwright';
export async function checkVietnameseFlow(
  browser: Browser,
  base: string,
  output: string,
): Promise<void> {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    acceptDownloads: true,
  });
  try {
    const page = await context.newPage();
    await page.goto(new URL('vi/', base).href);
    const requests: string[] = [];
    page.on('request', (request) => {
      if (
        !/^(?:blob:|data:)/.test(request.url()) &&
        !['brand/reversed.svg', 'brand/primary-color.svg'].some(
          (asset) => request.url() === new URL(asset, base).href,
        )
      )
        requests.push(request.url());
    });
    await page.locator('#file-input').setInputFiles({
      name: 'agency-logo.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#21497b"/></svg>',
      ),
    });
    await page.locator('#result-panel').waitFor({ state: 'visible' });
    assert(
      await page
        .getByRole('button', { name: 'Tải gói biểu tượng', exact: true })
        .isEnabled(),
    );
    await page.locator('[data-theme-toggle]').click();
    assert(await page.locator('#result-panel').isVisible());
    const downloading = page.waitForEvent('download');
    await page.locator('#download-button').click();
    const file = await (await downloading).path();
    assert(file);
    const zip = await JSZip.loadAsync(await readFile(file));
    assert.equal(Object.keys(zip.files).length, 10);
    const manifest = zip.file('site.webmanifest');
    assert(manifest);
    assert.match(await manifest.async('string'), /agency logo/);
    const ico = zip.file('favicon.ico');
    assert(ico);
    const bytes = await ico.async('nodebuffer');
    assert.equal(bytes.readUInt16LE(4), 3);
    for (const name of ['favicon-16x16.png', 'favicon-32x32.png'])
      assert(zip.file(name));
    await page.screenshot({
      path: path.join(output, 'vi-generated-package.png'),
      fullPage: true,
    });
    assert.deepEqual(requests, []);
  } finally {
    await context.close();
  }
}
