# VINASIG brand integration

Integration date: 2 October 2026.

## Project decision

Favicon Forge is a VINASIG project. Its website title is "VINASIG Favicon Forge", and its maintainer, repository links and deployment address identify VINASIG.

This integration selects the shared design system's Bright Playful Minimalism direction for this application. It does not change the draft status of other design-system proposals.

## Asset sources

The copied website assets come from [`VINASIG/web-design-system`](https://github.com/VINASIG/web-design-system/tree/eade1ba182810bb3ae72e3fc6a314ce3ac0af7e2), using its 2 October 2026 snapshot. That repository records its logo exports as byte-for-byte copies from [`VINASIG/vinasig-brand-assets`](https://github.com/VINASIG/vinasig-brand-assets). Editable artwork stays in the brand archive.

| Local asset | Design-system source |
| --- | --- |
| `public/brand/primary-color.svg` | `public/brand/lockups/primary-color.svg` |
| `public/favicon.svg` | `public/brand/marks/primary-mark.svg` |
| `public/brand/favicon-16.png` | `public/brand/favicons/favicon-16.png` |
| `public/brand/favicon-32.png` | `public/brand/favicons/favicon-32.png` |
| `public/brand/favicon-48.png` | `public/brand/favicons/favicon-48.png` |
| `public/fonts/SpaceGrotesk-VariableFont_wght.ttf` | `public/fonts/SpaceGrotesk-VariableFont_wght.ttf` |
| `public/fonts/OFL.txt` | `public/fonts/OFL.txt` |

SHA-256 hashes of all seven copied files matched their source files at integration time. The SVGs and PNGs are unchanged. The font is served locally with its existing license.

## Design tokens

`src/styles/tokens.css` copies the shared system's `:root` token definitions. Its original absolute font URL is replaced by the base-aware font loader in `public/fonts/font.css`.

The identity anchors remain Scout Blue `#21497b`, Thinker Orange `#eb7114`, Builder Green `#47a036`, Auditor Red `#971607` and Core Graphite `#443a3b`. The application uses neutral canvas and text tokens, Scout Blue for its primary action, and semantic error and success colors. The transparency checkerboard is a preview aid.

When updating these tokens, compare with the shared source, preserve identity values and inspect the product's contrast and responsive layout. Treat a new shared proposal as a separate adoption decision.

## Generated output

Branding applies to the generator's interface and setup attribution. Generated icons use the user's own logo. Manifest names come from the uploaded filename. The default output colors remain neutral and can be edited for the user's website.

## Licenses

The font's OFL file and dependency license records remain applicable. Existing Lucide and JSZip license texts are also copied into `public/licenses/` for the published site.
