import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import JSZip from 'jszip';
import { chromium, firefox, webkit } from 'playwright';
import type { Page } from 'playwright';
import { inspectInterface } from '../.vinasig/standards/templates/web/interface.mjs';
import {
  repositoryRoot,
  parseJson,
  record,
  writeOutput,
} from '../scripts/local.ts';
import { startPreview } from './helpers/preview.ts';
import { faviconQuestions } from '../src/lib/help.ts';

const launchers = { chromium, firefox, webkit };
const engineNames = Object.keys(launchers);
const requestedEngines = (
  process.env['BROWSER_ENGINES'] ?? engineNames.join(',')
)
  .split(',')
  .map((engine) => engine.trim());
assert(
  requestedEngines.length > 0 &&
    new Set(requestedEngines).size === requestedEngines.length &&
    requestedEngines.every((engine) => engineNames.includes(engine)),
  'BROWSER_ENGINES must name distinct supported engines: chromium,firefox,webkit',
);
assert(
  !process.env['CI'] || requestedEngines.length === engineNames.length,
  'CI requires every browser engine; a local selection must not narrow publication gates',
);
const expectedCases = requestedEngines.length * 4;
let completed = false;

const output = path.join(
  repositoryRoot,
  'output/responsive',
  `flows-${randomUUID()}`,
);
await mkdir(output, { recursive: true });
const server = await startPreview();
const fixture = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#21497b"/></svg>',
);
const results: {
  name: string;
  accessibilityScans: number;
  screenshots: string[];
  noLogoUpload: boolean;
  packageFiles: number;
  motion: string;
  helpQuestions: number;
}[] = [];
const staticHelpChecks: {
  engine: string;
  questions: number;
  screenshot: string;
  axe: 'NOT_RUN';
}[] = [];

async function settle(page: Page): Promise<void> {
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

async function screenshot(
  page: Page,
  name: string,
  scriptsEnabled = true,
): Promise<string> {
  if (scriptsEnabled) await settle(page);
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  const file = path.join(output, `${name}.png`);
  await page.screenshot({
    path: file,
    fullPage: true,
    animations: scriptsEnabled ? 'allow' : 'disabled',
    timeout: 30_000,
  });
  assert.deepEqual(await page.evaluate(inspectInterface), [], name);
  return path.relative(repositoryRoot, file);
}

async function accessibility(page: Page): Promise<void> {
  await settle(page);
  const report = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  assert.deepEqual(
    report.violations,
    [],
    JSON.stringify(report.violations, null, 2),
  );
}

async function openHelp(page: Page, touch: boolean): Promise<void> {
  const setup = (await page.locator('.setup-steps').innerText()).replace(
    /\s+/g,
    ' ',
  );
  assert(setup.includes('icons and site.webmanifest into your'));
  assert(setup.includes('markup from favicon-snippet.html into your'));
  assert(setup.includes('scope in site.webmanifest for your website'));
  assert.equal(
    await page.locator('.help details').count(),
    faviconQuestions.length,
  );
  for (const item of faviconQuestions) {
    const detail = page.locator(`#${item.id}`);
    const summary = detail.getByText(item.question, { exact: true });
    assert.equal(await detail.getAttribute('open'), null);
    if (touch) await summary.tap();
    else {
      await summary.focus();
      await page.keyboard.press('Enter');
    }
    assert.equal(await detail.getAttribute('open'), '');
    assert.equal(
      await detail.getByText(item.answer, { exact: true }).isVisible(),
      true,
    );
    const [summaryBox, answerBox] = await Promise.all([
      summary.boundingBox(),
      detail.getByText(item.answer, { exact: true }).boundingBox(),
    ]);
    assert(summaryBox && answerBox);
    assert(
      answerBox.y >= summaryBox.y + summaryBox.height + 8,
      'Help answers must leave room for the summary focus outline',
    );
  }
}

async function closeHelp(page: Page): Promise<void> {
  for (const item of faviconQuestions) {
    const detail = page.locator(`#${item.id}`);
    const summary = detail.getByText(item.question, { exact: true });
    await summary.focus();
    await page.keyboard.press('Space');
    assert.equal(await detail.getAttribute('open'), null);
    assert.equal(
      await summary.evaluate((element) => element === document.activeElement),
      true,
    );
    assert.equal(
      await summary.evaluate(
        (element) => getComputedStyle(element).outlineStyle,
      ),
      'solid',
    );
  }
}

async function selectionRace(page: Page): Promise<void> {
  await page.evaluate(() => {
    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src',
    );
    if (!descriptor?.set) throw new Error('Missing image source setter');
    const setter = Reflect.get(descriptor, 'set') as (
      this: HTMLImageElement,
      value: string,
    ) => void;
    const hooks = window as Window & {
      releaseTestImage: () => void;
      testImageFinished: boolean;
    };
    hooks.testImageFinished = false;
    let pending: { image: HTMLImageElement; value: string } | undefined;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      ...descriptor,
      set(this: HTMLImageElement, value: string) {
        if (!pending && value.startsWith('blob:')) {
          pending = { image: this, value };
          this.addEventListener(
            'load',
            () => {
              hooks.testImageFinished = true;
            },
            { once: true },
          );
        } else setter.call(this, value);
      },
    });
    hooks.releaseTestImage = () => {
      Object.defineProperty(HTMLImageElement.prototype, 'src', descriptor);
      if (!pending) throw new Error('No delayed image');
      setter.call(pending.image, pending.value);
    };
  });
  await page.locator('#file-input').setInputFiles({
    name: 'older-slow.svg',
    mimeType: 'image/svg+xml',
    buffer: fixture,
  });
  assert.equal(
    await page.getByRole('button', { name: 'Download package' }).isDisabled(),
    true,
  );
  await page.locator('#file-input').setInputFiles({
    name: 'newer-fast.svg',
    mimeType: 'image/svg+xml',
    buffer: fixture,
  });
  await page.getByText(/newer-fast\.svg/).waitFor();
  await page.evaluate(() => {
    (window as Window & { releaseTestImage: () => void }).releaseTestImage();
  });
  await page.waitForFunction(
    () => (window as Window & { testImageFinished: boolean }).testImageFinished,
  );
  await settle(page);
  assert.match(await page.locator('#file-meta').innerText(), /newer-fast\.svg/);
  assert.equal(
    await page.getByRole('button', { name: 'Download package' }).isEnabled(),
    true,
  );
}

try {
  for (const [engine, launcher] of Object.entries(launchers)) {
    if (!requestedEngines.includes(engine)) continue;
    const browser = await launcher.launch({ headless: true });
    try {
      for (const [width, height] of [
        [390, 844],
        [1440, 900],
      ] as const) {
        for (const reducedMotion of ['reduce', 'no-preference'] as const) {
          const name = `index-${engine}-${String(width)}x${String(height)}-${reducedMotion}`;
          const context = await browser.newContext({
            viewport: { width, height },
            hasTouch: width === 390,
            acceptDownloads: true,
            reducedMotion,
          });
          const page = await context.newPage();
          const errors: string[] = [];
          const networkViolations: string[] = [];
          const shots: string[] = [];
          page.on('pageerror', (reason) => errors.push(reason.message));
          page.on('request', (request) => {
            if (
              /^https?:/.test(request.url()) &&
              (request.method() !== 'GET' ||
                new URL(request.url()).origin !== new URL(server.url).origin)
            )
              networkViolations.push(`${request.method()} ${request.url()}`);
          });
          assert.equal((await page.goto(server.url))?.status(), 200);
          await accessibility(page);
          shots.push(await screenshot(page, `${name}-empty`));
          await openHelp(page, width === 390);
          await accessibility(page);
          shots.push(await screenshot(page, `${name}-help-open`));
          await closeHelp(page);
          if (width === 1440 && reducedMotion === 'reduce') {
            console.log(`${name}: checking native help without JavaScript`);
            const staticContext = await browser.newContext({
              viewport: { width, height },
              javaScriptEnabled: false,
            });
            try {
              const staticPage = await staticContext.newPage();
              assert.equal((await staticPage.goto(server.url))?.status(), 200);
              await staticPage
                .getByText(
                  /JavaScript is required to create a favicon package locally/,
                )
                .waitFor();
              await openHelp(staticPage, false);
              console.log(
                `${name}: native questions passed; capturing static help`,
              );
              staticHelpChecks.push({
                engine,
                questions: faviconQuestions.length,
                // Axe needs JavaScript execution; the same open content is scanned above.
                axe: 'NOT_RUN',
                screenshot: await screenshot(
                  staticPage,
                  `${name}-help-no-javascript`,
                  false,
                ),
              });
              console.log(`${name}: static help screenshot saved`);
            } finally {
              await staticContext.close();
            }
          }
          const chooser = page.waitForEvent('filechooser');
          const choose = page.getByRole('button', {
            name: 'Choose or drop a logo',
          });
          if (width === 390) await choose.tap();
          else {
            await choose.focus();
            await page.keyboard.press('Enter');
          }
          await (
            await chooser
          ).setFiles({
            name: 'agency-logo.svg',
            mimeType: 'image/svg+xml',
            buffer: fixture,
          });
          await page.getByRole('heading', { name: 'Preview' }).waitFor();
          if (
            engine === 'chromium' &&
            width === 390 &&
            reducedMotion === 'no-preference'
          ) {
            const animations = await page.evaluate(() => {
              const list = document
                .getAnimations()
                .filter(
                  (animation) => animation.effect instanceof KeyframeEffect,
                );
              return list.map((animation) => {
                const effect = animation.effect as KeyframeEffect;
                return {
                  kind: animation.constructor.name,
                  duration: effect.getTiming().duration,
                  properties: [
                    ...new Set(
                      effect
                        .getKeyframes()
                        .flatMap((frame) =>
                          Object.keys(frame).filter(
                            (key) =>
                              ![
                                'offset',
                                'computedOffset',
                                'easing',
                                'composite',
                              ].includes(key),
                          ),
                        ),
                    ),
                  ],
                };
              });
            });
            await writeFile(
              path.join(output, 'motion-properties.json'),
              JSON.stringify(animations, null, 2) + '\n',
            );
            for (const animation of animations) {
              const allowed =
                animation.kind === 'CSSAnimation'
                  ? ['opacity', 'transform']
                  : [
                      'opacity',
                      'transform',
                      'backgroundColor',
                      'borderTopColor',
                      'borderRightColor',
                      'borderBottomColor',
                      'borderLeftColor',
                    ];
              assert(
                animation.properties.every((property) =>
                  allowed.includes(property),
                ),
              );
              assert(
                typeof animation.duration === 'number' &&
                  animation.duration <= 440,
              );
            }
            await page.screenshot({
              path: path.join(output, `${name}-motion-start.png`),
              fullPage: true,
            });
            await page.waitForTimeout(120);
            await page.screenshot({
              path: path.join(output, `${name}-motion-120ms.png`),
              fullPage: true,
            });
            await writeFile(
              path.join(output, 'motion-frames.json'),
              JSON.stringify(animations, null, 2) + '\n',
            );
          }
          await accessibility(page);
          shots.push(await screenshot(page, `${name}-uploaded`));
          const animationName = await page
            .locator('.preview-card')
            .first()
            .evaluate((element) => getComputedStyle(element).animationName);
          assert.equal(
            animationName,
            reducedMotion === 'reduce' ? 'none' : 'reveal',
          );
          const downloadEvent = page.waitForEvent('download');
          await page.getByRole('button', { name: 'Download package' }).click();
          const download = await downloadEvent;
          assert.equal(download.suggestedFilename(), 'favicon-package.zip');
          const file = path.join(output, `${name}-package.zip`);
          await download.saveAs(file);
          const zip = await JSZip.loadAsync(await readFile(file));
          assert.equal(Object.keys(zip.files).length, 10);
          async function packed(name: string): Promise<Buffer> {
            const entry = zip.file(name);
            assert(entry, `Missing ZIP file: ${name}`);
            return entry.async('nodebuffer');
          }
          const manifest = record(parseJson(await packed('site.webmanifest')));
          assert.equal(manifest['name'], 'agency logo');
          const ico = await packed('favicon.ico');
          assert.equal(ico.readUInt16LE(2), 1);
          assert.equal(ico.readUInt16LE(4), 3);
          for (const [index, size] of [16, 32, 48].entries())
            assert.equal(ico.readUInt8(6 + index * 16), size);
          const normal = await packed('android-chrome-512x512.png');
          const maskable = await packed('android-chrome-512x512-maskable.png');
          assert(
            !normal.equals(maskable),
            'Maskable icon still duplicates the ordinary icon',
          );
          const pixels = await page.evaluate(async (encoded) => {
            const image = new Image();
            image.src = `data:image/png;base64,${encoded}`;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Missing canvas');
            context.drawImage(image, 0, 0);
            const data = context.getImageData(0, 0, 512, 512).data;
            let opaque = true,
              maximumRadius = 0,
              contentPixels = 0;
            for (let y = 0; y < 512; y++)
              for (let x = 0; x < 512; x++) {
                const index = (y * 512 + x) * 4;
                if (data[index + 3] !== 255) opaque = false;
                if (
                  data[index] !== 255 ||
                  data[index + 1] !== 255 ||
                  data[index + 2] !== 255
                ) {
                  contentPixels++;
                  maximumRadius = Math.max(
                    maximumRadius,
                    Math.hypot(x + 0.5 - 256, y + 0.5 - 256),
                  );
                }
              }
            return { opaque, maximumRadius, contentPixels };
          }, maskable.toString('base64'));
          assert(
            pixels.opaque &&
              pixels.contentPixels > 0 &&
              pixels.maximumRadius <= 512 * 0.4,
            JSON.stringify(pixels),
          );
          await page.locator('#file-input').setInputFiles({
            name: 'notes.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('test fixture'),
          });
          assert.equal(
            await page.getByRole('alert').innerText(),
            'Please choose an image file.',
          );
          await accessibility(page);
          shots.push(await screenshot(page, `${name}-validation-error`));
          await page.locator('#file-input').setInputFiles({
            name: 'broken.png',
            mimeType: 'image/png',
            buffer: Buffer.from('invalid PNG fixture'),
          });
          await page
            .getByRole('alert')
            .filter({ hasText: 'could not be read' })
            .waitFor();
          assert.equal(
            await page
              .getByRole('button', { name: 'Download package' })
              .isEnabled(),
            true,
          );
          await selectionRace(page);
          shots.push(await screenshot(page, `${name}-selection-race`));
          assert.deepEqual(
            networkViolations,
            [],
            'The browser uploaded data or requested a remote service',
          );
          assert.deepEqual(errors, []);
          results.push({
            name,
            accessibilityScans: 4,
            screenshots: shots,
            noLogoUpload: true,
            packageFiles: 10,
            motion: animationName,
            helpQuestions: faviconQuestions.length,
          });
          await context.close();
        }
      }
    } finally {
      await browser.close();
    }
  }
  assert.equal(results.length, expectedCases);
  assert.equal(staticHelpChecks.length, requestedEngines.length);
  completed = true;
} finally {
  await server.stop();
  await writeOutput(
    repositoryRoot,
    'output/checks/browser-flows.json',
    JSON.stringify(
      {
        status: completed ? 'PASS' : 'FAIL',
        requestedEngines,
        notRunEngines: engineNames.filter(
          (engine) => !requestedEngines.includes(engine),
        ),
        expectedCases,
        cases: results.length,
        results,
        staticHelpChecks,
        independentAgentTrial: 'NOT_RUN',
        realDevicesAndScreenReader: 'NOT_RUN',
      },
      null,
      2,
    ) + '\n',
  );
}
console.log(
  `${String(results.length)} cross-browser cases passed with axe, local ZIP inspection, safe-zone pixels and rapid replacement.`,
);
