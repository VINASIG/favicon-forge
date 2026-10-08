# VINASIG brand integration

Integration date: 2 October 2026.

## Project decision

Favicon Forge is a VINASIG project. Its website title is "VINASIG Favicon Forge", and its maintainer, repository links and deployment address identify VINASIG.

This integration selects the shared design system's Bright Playful Minimalism direction for this application. It does not change the draft status of other design-system proposals.

## Asset sources

The original website assets come from [`VINASIG/web-design-system`](https://github.com/VINASIG/web-design-system/tree/eade1ba182810bb3ae72e3fc6a314ce3ac0af7e2), using its 2 October 2026 snapshot. That repository records its logo exports as byte-for-byte copies from [`VINASIG/vinasig-brand-assets`](https://github.com/VINASIG/vinasig-brand-assets). Editable artwork stays in the brand archive. The additional Reversed export follows the 4 October interface decision below.

| Local asset                                       | Design-system source                              |
| ------------------------------------------------- | ------------------------------------------------- |
| `public/brand/primary-color.svg`                  | `public/brand/lockups/primary-color.svg`          |
| `public/brand/reversed.svg`                       | `public/brand/lockups/reversed.svg`               |
| `public/favicon.svg`                              | `public/brand/marks/primary-mark.svg`             |
| `public/brand/favicon-16.png`                     | `public/brand/favicons/favicon-16.png`            |
| `public/brand/favicon-32.png`                     | `public/brand/favicons/favicon-32.png`            |
| `public/brand/favicon-48.png`                     | `public/brand/favicons/favicon-48.png`            |
| `public/fonts/SpaceGrotesk-VariableFont_wght.ttf` | `public/fonts/SpaceGrotesk-VariableFont_wght.ttf` |
| `public/fonts/OFL.txt`                            | `public/fonts/OFL.txt`                            |

SHA-256 hashes of the seven files copied on 2 October matched their source files at integration time. The SVGs and PNGs are unchanged. The font is served locally with its existing license.

## Design tokens

`src/styles/tokens.css` copies the shared system's `:root` token definitions. Its original absolute font URL is replaced by the base-aware font loader in `public/fonts/font.css`.

The identity anchors remain Scout Blue `#21497b`, Thinker Orange `#eb7114`, Builder Green `#47a036`, Auditor Red `#971607` and Core Graphite `#443a3b`. The application uses neutral canvas and text tokens, Scout Blue for its primary action, and semantic error and success colors. The transparency checkerboard is a preview aid.

When updating these tokens, compare with the shared source, preserve identity values and inspect the product's contrast and responsive layout. Treat a new shared proposal as a separate adoption decision.

## Motion

Use brief, softly eased reveals when the page and generated previews appear. Entrance movement is 2 to 6 px, with durations of 240 to 440 ms and short staggered delays. Control feedback moves icons or buttons by 1 to 2 px. Keep reveal effects on opacity and transforms, with content available immediately and no added animation dependency. Respect `prefers-reduced-motion` by showing the final state directly and disabling animation and transitions, including the loading spinner.

## Generated output

Branding applies to the generator's interface and setup attribution. Generated icons use the user's own logo. Manifest names come from the uploaded filename. The default output colors remain neutral and can be edited for the user's website.

## Licenses

The font's OFL file and dependency license records remain applicable. Existing Lucide and JSZip license texts are also copied into `public/licenses/` for the published site.

## Initial header review on 4 October 2026

The initial interface kept its light canvas for both system color preferences. The transparent Primary Color lockup was correct on that surface. The owner subsequently authorized the interface replacement below, which supersedes the light-only behavior.

## Tool interface alignment on 4 October 2026

The owner requested a replacement interface aligned with VINASIG's Unphar, QR Generator and two BMI tools. The application adopts the QR/adult-BMI page shell, typography, workspace, footer and system-theme behavior. Its layout separates logo selection from icon previews and the package download. A 832 px breakpoint keeps enough intrinsic space for three 80 px previews per row on the two-column layout. The 520 px preview breakpoint and the automatic grid minimum retain usable images and labels when text is enlarged.

Light mode retains the shared neutral canvas and Primary Color header export. Dark mode uses the existing QR/adult-BMI semantic colors and the transparent Reversed export. Both variants are selected by CSS and a picture source before client scripts run, and react to changes in the system preference. No logo background, frame, filter, redraw or rounded crop is added.

The added Reversed asset is copied unchanged from web-design-system commit `6ab0a23442b6bcbfd9815d0e6549b1a004095241`. Its SHA-256 is `98ceaaace06835138856d3710b4fed38714528573f78b19e710db796aea53d07`. All ten earlier public assets remain unchanged. The asset manifest checks all eleven assets in source and the built publication.

The generator keeps image decoding, geometry, ICO construction, manifest/snippet creation and ZIP contents independent of the interface theme. The file-picker button is enabled only after its local handlers are attached. The disabled download and empty preview explain the initial state. CSS motion is brief, at most 360 ms with 4 px entrance movement, and has an immediate reduced-motion state.

## Appearance control approved on 5 October 2026

The owner selected the existing TOTP and QR Scanner appearance pattern for VINASIG websites. Use decorative Lucide Sun and Moon SVGs at 20 CSS px inside a button with a target of at least 44 CSS px. Light mode shows Moon to offer dark mode. Dark mode shows Sun to offer light mode. Keep a localized action name, pressed state, visible keyboard focus and the unchanged language link. Do not replace these recognizable icons with filled squares. Regression checks inspect both icons, their visibility and dimensions before and after toggling, persistence and blocked storage.

## Neutral appearance approved on 8 October 2026

Read [the shared theme adoption](THEME.md) before changing interface colors. The approved Radix Gray canvas, text and control roles supersede historical warm interface neutrals. Earlier source and artwork records remain intact.
