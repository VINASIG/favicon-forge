import { chromium, firefox, webkit } from 'playwright';
import { startPreview } from './helpers/preview.ts';
import { checkSharedPreferences } from '../.vinasig/standards/templates/web/shared-preferences.mjs';
const app = await startPreview();
try {
  for (const engine of [chromium, firefox, webkit]) {
    const browser = await engine.launch();
    try {
      await checkSharedPreferences(browser, app.url);
    } finally {
      await browser.close();
    }
  }
} finally {
  await app.stop();
}
