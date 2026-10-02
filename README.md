# VINASIG Favicon Forge

Generate a complete favicon package from one logo. Choose or drop an image, review the output sizes, and download a ZIP. Image decoding, resizing and packaging happen in your browser. The application does not upload your logo or require an account.

- [Open Favicon Forge](https://vinasig.github.io/favicon-forge/)
- [Source repository](https://github.com/VINASIG/favicon-forge)
- [VINASIG](https://github.com/VINASIG)

## Project context

The application uses Astro for a static page, Canvas for local image processing, and JSZip for packaging. VINASIG's supplied logo exports, Space Grotesk font, identity colors and Lucide interface icons define the website's visual direction. See [the brand integration record](docs/BRAND.md) and [the project guide for SI agents](AGENTS.md).

VINASIG uses **Super Intelligence (SI)** and **SI agents** in project-authored guidance. This is a naming convention. Preserve the original wording of external source titles, official names, quotations and technical identifiers.

## Local development

Use Node 24 as recorded in `.node-version` and install the locked dependencies.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/favicon-forge/`. The default base path matches the published project site.

```sh
npm run check
npm run build
npm run preview
```

The production build is written to `dist/`. Local inspection files belong in ignored `output/`.

## GitHub Pages

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) checks, builds and deploys every push to `main`. The Pages source must be **GitHub Actions**.

The workflow derives `SITE_URL` from the current repository owner and `BASE_PATH` from the repository name. The VINASIG deployment uses `https://vinasig.github.io/favicon-forge/`. Asset paths, the local font and canonical metadata respect the deployment base path.

For a custom domain, set `SITE_URL` to its origin and `BASE_PATH` to an empty string before building. Keep preview configuration consistent with the build configuration.

## Generated package

- `favicon.ico` containing 16 × 16, 32 × 32 and 48 × 48 images.
- `favicon-16x16.png` and `favicon-32x32.png`.
- `apple-touch-icon.png` at 180 × 180.
- `android-chrome-192x192.png` and `android-chrome-512x512.png`.
- `android-chrome-512x512-maskable.png`.
- `site.webmanifest`.
- `favicon-snippet.html` and `README.txt` setup instructions.

The generated images come from the uploaded logo. The manifest derives its site name from the filename. Adjust its name, colors and start URL for the consuming website. VINASIG attribution appears in the setup instructions, without adding VINASIG artwork to generated icons.

## Licenses

VINASIG logo artwork has no additional license granted by this repository. Space Grotesk's SIL Open Font License is included at [`public/fonts/OFL.txt`](public/fonts/OFL.txt). The published site also includes the existing [Lucide notices](public/licenses/lucide.txt) and [JSZip license text](public/licenses/jszip.txt). These files apply to their respective dependencies.
