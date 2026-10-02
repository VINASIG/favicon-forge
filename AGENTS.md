# VINASIG Favicon Forge project guide

## Context and scope

This repository is VINASIG's static, browser-only favicon generator. Read `README.md` and `docs/BRAND.md` before changing its interface, deployment or brand assets.

Keep the main flow short. A user chooses or drops one logo, reviews the output sizes, and downloads a package. Image processing and ZIP generation stay in the browser. Add server processing, accounts or remote uploads only when a user explicitly requests that change.

## VINASIG terminology

Use **Super Intelligence (SI)** and **SI agents** in new VINASIG-authored copy. This is the project's naming convention and does not certify a model's capabilities. Preserve external source titles, quotations, official names, code identifiers and existing author credits.

## Interface direction

This project adopts the VINASIG design system's Bright Playful Minimalism direction. Use light neutral surfaces, restrained identity colors, clear typography and a focused workspace. This project decision does not approve all draft design-system rules for the entire organization.

- Use `src/styles/tokens.css` for identity anchors and semantic interface colors. Read `docs/BRAND.md` before syncing tokens from the shared system.
- Load Space Grotesk from `public/fonts/` with base-aware URLs. Keep its OFL file. Do not add a remote font service.
- Use Lucide SVGs through `@lucide/astro` for interface icons. Do not use pictographic Unicode characters as controls.
- Keep the supplied VINASIG logo and favicon exports unchanged. Do not redraw, recolor or retypeset them.
- Configure the supplied 16, 32 and 48 px favicon exports in the document head. Check their paths at `/favicon-forge/`.
- Keep body text near 1rem and supporting text at least 0.875rem. Use English, sentence case, straight quotes and concise copy.
- Give controls native semantics, accessible names and visible keyboard focus. Keep loading, error and replacement states understandable.
- Fix layout sizing and wrapping when content overflows. Do not clip the whole page to conceal a problem.
- Keep a user's generated icons and manifest tied to their logo and website. Do not inject VINASIG artwork or a VINASIG site name into their output.

## Source map

- `src/pages/index.astro` holds the page and local generation flow.
- `src/styles/app.css` holds product layout and control styles.
- `src/styles/tokens.css` records the adopted design-system tokens.
- `public/brand/` and `public/favicon.svg` contain the supplied VINASIG exports.
- `public/fonts/` holds the local font, its CSS loader and license.
- `.github/workflows/deploy.yml` checks, builds and publishes the static GitHub Pages site.

Use `npm ci`, `npm run check` and `npm run build` for development. Before publishing interface changes, inspect the built page at wide and narrow widths, including 320 CSS px where practical. Review file selection, keyboard operation, replacement, error and download states. Keep local screenshots and packages in ignored `output/`. Preserve Git history and existing license records.
