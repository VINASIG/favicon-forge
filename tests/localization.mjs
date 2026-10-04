import { checkVietnameseFlow } from './localized-flow.ts';
import { chromium, firefox, webkit } from 'playwright';
import { checkLocalization } from './helpers/localization.ts';
import { startPreview } from './helpers/preview.ts';
/** @type {Record<string, import("playwright").BrowserType>} */
const engines = { chromium, firefox, webkit };
const names = (
  process.env.BROWSER_ENGINES ||
  process.env.RESPONSIVE_ENGINE ||
  'chromium,firefox,webkit'
).split(',');
for (const name of names)
  if (!Object.hasOwn(engines, name)) throw new Error('Unsupported engine');
const app = await startPreview();
try {
  for (const name of names) {
    const launcher = engines[name];
    if (!launcher) throw new Error('Missing engine');
    const browser = await launcher.launch();
    try {
      await checkLocalization(
        browser,
        app.url,
        'output/responsive/localization/' + name,
        {
          defaultLanguage: 'en',
          routes: [''],
          dictionary: 'src/locales/vi.json',
        },
      );
      await checkVietnameseFlow(
        browser,
        app.url,
        'output/responsive/localization/' + name,
      );
      console.log('PASS localization ' + name);
    } finally {
      await browser.close();
    }
  }
} finally {
  await app.stop();
}
