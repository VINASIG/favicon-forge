import { defineConfig } from 'astro/config';

// The workflow supplies the current owner and repository path at build time.
// Set BASE_PATH to an empty string for a custom domain or organization root site.
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://vinasig.github.io',
  base: process.env.BASE_PATH ?? '/favicon-forge',
});
