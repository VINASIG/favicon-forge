import { defineConfig } from 'astro/config';

// Production uses the verified VINASIG custom domain at the origin root.
// Environment overrides remain available for an explicitly reviewed deployment.
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://favicon.vinasig.io.vn',
  base: process.env.BASE_PATH ?? '/',
});
