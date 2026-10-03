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

- `src/pages/index.astro` holds the page and metadata; `src/scripts/generator.ts` holds the local generation flow. `src/lib/` contains checked image, ICO, manifest and public URL helpers.
- `src/styles/app.css` holds product layout and control styles.
- `src/styles/tokens.css` records the adopted design-system tokens.
- `public/brand/` and `public/favicon.svg` contain the supplied VINASIG exports.
- `public/fonts/` holds the local font, its CSS loader and license.
- `.github/workflows/deploy.yml` checks, builds and publishes the static GitHub Pages site.

Use the pinned Node and npm versions. Run `npm run check`, `npm test` and `npm run build` for development. Before publishing interface changes, run `npm run test:browser` and `npm run test:responsive`, inspect screenshots and review file selection, keyboard/touch operation, replacement, errors and downloaded ZIP contents. Include the five standard viewports, 320 CSS px, actual breakpoint neighbors and enlarged text. Keep local screenshots and packages in ignored `output/`. Preserve Git history and existing license records.

Read `docs/STANDARDS.md`, `docs/TOOLCHAIN.md` and `CONTRIBUTING.md` for adoption and ownership boundaries. Keep generated user icons free of VINASIG artwork. Respect the 10 MB file limit and the 16 million pixel rasterization limit. A pending image must not change a download or replace a newer successful selection. Keep maskable content inside its safe circle with a neutral background. Do not suppress type checking or relax a gate to accept a defect. Use Simple Icons only when a third-party brand mark is actually needed.
<!-- VINASIG STANDARDS BEGIN -->
## VINASIG SI agent standards 0.1.0

Read `.vinasig/standards/policies/core.md` and `language.md` before repository work. Respect platform instructions, current user authorization and local project guidance. Preserve unrelated changes. Never invent verification or weaken a quality gate to pass.

Active profile is `web-typescript`. Read `.vinasig/standards/profiles/web-typescript.md` and the task-relevant policies. Core is valid for CLI and documentation projects and installs no browser dependencies.

Use `$vinasig-workflow` for implementation work and `$vinasig-dependencies` when adding or upgrading dependencies. Report PASS, FAIL, NOT_RUN or NOT_APPLICABLE with evidence and reasons. Commit, push and publish only within the task authorization.

For UI changes read `policies/web.md` inside the snapshot. Apply LANG-004/LANG-005 to all visible copy and locales. WEB-001 requires original transparent header logos matched to the actual surface, without a padded or rounded logo card. WEB-008 requires styled open dropdowns, calendars, color choosers and sliders, including safe initial HTML before scripts load. Use `$vinasig-responsive` for layout/accessibility, `$vinasig-motion` for movement, `$vinasig-search` for SEO/AEO/GEO, `$vinasig-performance` for speed, and `$vinasig-agent-readiness` for browser-agent tasks. Space Grotesk, Lucide and Simple Icons follow their separate roles. Open and inspect real screenshots.

The local manifest pins the approved snapshot. A Markdown path is a reading instruction, not an automatic import. Stop and report unresolved conflicts with mandatory policy. Record approved exceptions with owner, reason and review date.
<!-- VINASIG STANDARDS END -->
