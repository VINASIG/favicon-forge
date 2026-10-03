# VINASIG Favicon Forge

Generate a complete favicon package from one logo. Choose or drop an image, review the output sizes, and download a ZIP. Image decoding, resizing and packaging happen in your browser. The application does not upload your logo or require an account.

- [Open Favicon Forge](https://vinasig.github.io/favicon-forge/)
- [Source repository](https://github.com/VINASIG/favicon-forge)
- [VINASIG](https://github.com/VINASIG)

## Project context

The application uses Astro for a static page, Canvas for local image processing, and JSZip for packaging. VINASIG's supplied logo exports, Space Grotesk font, identity colors and Lucide interface icons define the website's visual direction. See [the brand integration record](docs/BRAND.md), [the project guide for SI agents](AGENTS.md) and [the adopted shared standards](docs/STANDARDS.md).

VINASIG uses **Super Intelligence (SI)** and **SI agents** in project-authored guidance. This is a naming convention. Preserve the original wording of external source titles, official names, quotations and technical identifiers.

## Local development

Use Node **24.21.0** from `.node-version` and npm **12.2.0** from `packageManager`. [The toolchain record](docs/TOOLCHAIN.md) documents verified versions and compatibility choices. These commands use the pinned npm without changing a global installation:

```sh
npx --yes npm@12.2.0 ci --ignore-scripts
npx --yes npm@12.2.0 run dev
```

Open the URL printed by Astro. The default is `http://localhost:4321/favicon-forge/`; Astro may choose another port when that port is occupied. The base path matches the published project site.

```sh
npx --yes npm@12.2.0 run check
npx --yes npm@12.2.0 test
npx --yes npm@12.2.0 run build
npx --yes npm@12.2.0 run preview
```

The production build is written to `dist/`. Local inspection files belong in ignored `output/`.

`check` runs strict Astro/TypeScript checking, typed ESLint, Stylelint, formatting and the shared snapshot integrity gate. `build` validates generated HTML, public URLs and the ten preserved public assets. See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete contributor workflow.

### Browser and responsive checks

Install the project-pinned browser engines, then run the browser and responsive checks. On Linux, `--with-deps` installs the required browser libraries in an authorized development environment:

```sh
npx --yes npm@12.2.0 exec -- playwright install chromium firefox webkit
npx --yes npm@12.2.0 run test:browser
npx --yes npm@12.2.0 run test:responsive
```

Each check builds the current source, starts its own preview on an available port, and stops that preview when finished. Browser flows cover Chromium, Firefox and WebKit at 390 × 844 and 1440 × 900, with normal/reduced motion, axe scans, touch/keyboard file selection, downloaded ZIP contents, maskable pixels, invalid images and out-of-order image decoding. Request observation checks that the logo stays local.

For a scoped local diagnosis, `BROWSER_ENGINES=chromium,webkit` selects those engines and records Firefox as unrun in the report. The default always selects all three. CI rejects any selection that omits an engine, so a local environment blocker cannot turn into a narrower publication gate.

The responsive check covers 150 states across the five standard viewports, 320 CSS px, both sides of the 520 and 720 px breakpoints, intermediate widths and text enlarged to 200%. Assertions check horizontal overflow, header text collisions, help disclosures, preview images and labels, loading controls, file selection and validation. Browser flows also open and close help with keyboard/touch and inspect it without JavaScript in each engine. Inspect full-page screenshots alongside these checks. Reports are saved in `output/checks/`, with images and packages in `output/responsive/flows-*/` and `output/responsive/regression-*/`. These checks use browser emulation; physical devices, screen readers and independent agent trials need separate evidence.

## GitHub Pages

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs source, unit, build and all browser/responsive gates on **Windows and Linux** for pull requests and pushes to `main`. It retains reports/screenshots for 14 days. Pages deploys only after both operating systems pass, on `main`; pull requests do not deploy. The Pages source must be **GitHub Actions**.

The workflow derives `SITE_URL` from the current repository owner and `BASE_PATH` from the repository name. The VINASIG deployment uses `https://vinasig.github.io/favicon-forge/`. Asset paths, the local font and canonical metadata respect the deployment base path.

For a custom domain, set `SITE_URL` to its origin and `BASE_PATH` to an empty string before building. Keep preview configuration consistent with the build configuration.

## Generated package

The page includes a static setup guide and five native disclosures about input limits, package contents, local processing, maskable icons and favicon troubleshooting. Help is available without JavaScript and uses primary browser/search documentation where relevant. The generator still requires JavaScript for local image processing.

- `favicon.ico` containing 16 × 16, 32 × 32 and 48 × 48 images.
- `favicon-16x16.png` and `favicon-32x32.png`.
- `apple-touch-icon.png` at 180 × 180.
- `android-chrome-192x192.png` and `android-chrome-512x512.png`.
- `android-chrome-512x512-maskable.png`.
- `site.webmanifest`.
- `favicon-snippet.html` and `README.txt` setup instructions.

The generated images come from the uploaded logo. The maskable icon uses an opaque white background and keeps the logo inside its circular safe zone. The manifest derives its site name from the filename. Adjust its name, colors and start URL for the consuming website. VINASIG attribution appears in the setup instructions, without adding VINASIG artwork to generated icons. Input is limited to 10 MB and 16 million decoded pixels before canvas allocation.

## Licenses

VINASIG-authored application code uses AGPL-3.0-or-later and authored documentation uses CC-BY-SA-4.0. Logo artwork follows [the separate brand policy](BRAND_POLICY.md). Space Grotesk's SIL Open Font License is included at [`public/fonts/OFL.txt`](public/fonts/OFL.txt). The published site includes the existing [Lucide notices](public/licenses/lucide.txt) and [JSZip license text](public/licenses/jszip.txt), unchanged for their respective dependencies.

See [LICENSES.md](LICENSES.md) for the current grant and exclusions, [LICENSE_STATUS.md](LICENSE_STATUS.md) for the rights record and [SECURITY.md](SECURITY.md) for private vulnerability reporting.

## License scopes

VINASIG-authored software uses **AGPL-3.0-or-later**. Authored documentation uses **CC-BY-SA-4.0**. Commercial use is allowed under those standard licenses. Fonts and third-party components retain their original terms. Official VINASIG identity assets follow the separate brand policy.

Read [LICENSE](LICENSE), [LICENSES.md](LICENSES.md), [VINASIG Brand Usage Policy](BRAND_POLICY.md) and [the licensing review](docs/audits/licensing-2026-10-04.md) for exact scopes, rationale and remaining review.
