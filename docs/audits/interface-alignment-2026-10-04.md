# Tool interface alignment

Review date is 4 October 2026. This record covers the local implementation and its verification before publication.

## Owner request and references

The owner requested replacement of Favicon Forge's interface while preserving its processing core. The reference applications are VINASIG's Unphar, QR Generator, adult BMI and military-service BMI tools. Their live interfaces and local source were inspected. The QR/adult-BMI shell provides the shared typography, spacious workspace, footer and system-theme behavior. Favicon-specific previews and the short choose, review and download flow remain intact.

The previous interface used a narrower page shell, a duplicate header product label, a smaller title and a vertical generator layout. It kept the light canvas under a dark system preference. Baseline screenshots include all five tools at the five standard viewports in both preferences, plus Favicon Forge with a selected sample logo.

## Implementation

- Replace the product layout with the shared 72 rem shell and a two-column workspace. Stack the workspace at 832 px to preserve the intrinsic width of three 80 px previews. Preview cards adapt at 520 px and with enlarged text.
- Use existing semantic tokens for neutral light surfaces and the QR/adult-BMI dark palette. CSS follows the system preference, including changes while the page is open.
- Select the original transparent Primary Color or Reversed header export through a picture source. Both themes work before JavaScript runs. The added export is copied unchanged from the design-system source identified in `docs/BRAND.md`.
- Show an empty preview and a disabled download before a logo is ready. Enable the logo picker after its local handlers attach. Preserve understandable replacement, reading, packaging and validation states.
- Retain the static setup guide, all five native question disclosures, canonical metadata, structured data, local font and license notices.
- Use brief opacity and transform motion with an immediate reduced-motion state. Add no dependency.

## Processing and assets

SHA-256 comparison against the pre-change snapshot confirms that `src/lib/generator.ts`, `images.ts`, `help.ts` and `site.ts` are unchanged. The client script only connects the new presentation states and copy. Its `buildZip` function is unchanged. The ten earlier public assets remain byte-identical. The eleventh asset is the supplied Reversed logo, with its digest recorded in `docs/asset-manifest.json` and checked in source and built output.

Browser regressions inspect all ten downloaded package entries, ICO sizes and maskable safe-zone pixels. In each engine, changing from light to dark after selecting a logo retains all six preview image sources, the selected filename and every uncompressed package entry byte. Requests are observed to reject remote processing or uploads.

## Verification

| Check                       | Result | Evidence                                                              |
| --------------------------- | ------ | --------------------------------------------------------------------- |
| Astro and TypeScript        | PASS   | 0 errors, warnings or hints                                           |
| Typed ESLint and Stylelint  | PASS   | No warnings                                                           |
| Prettier                    | PASS   | Repository formatting gate                                            |
| Standards and licenses      | PASS   | 47 owned snapshot files and source license scopes                     |
| Unit tests                  | PASS   | 19 tests                                                              |
| Browser flows               | PASS   | 24 cases across Chromium, Firefox and WebKit                          |
| Accessibility               | PASS   | 99 axe scans of interactive states                                    |
| Static help and theme logos | PASS   | Both themes without JavaScript in all three engines                   |
| Responsive                  | PASS   | 360 states, zero failures                                             |
| Build and asset integrity   | PASS   | HTML, public URLs, static help, license delivery and 11 asset digests |

Responsive coverage includes 360 by 800, 390 by 844, 768 by 1024, 1024 by 768 and 1440 by 900. Additional widths are 320, 519, 520, 521, 600, 719, 720, 721, 831, 832, 833, 900 and 1280 px. Both themes and text at 100% and 200% are exercised in empty, help-open, uploaded long-filename, packaging and validation-error states. Full-page captures scroll through the page. Header, workspace, preview, label, focus, button and footer bounds are checked alongside screenshots.

Two issues found during iteration were corrected in source. Native question disclosures retain an explicit focus outline in Firefox after touch followed by keyboard use. Answer spacing uses the existing 12 px token so the outline has room. The theme test waits for the picture source to load before checking its exact filename, keeping the same strict theme assertions.

Representative screenshots were opened and inspected for every standard viewport, both appearances, expanded help, loading and error states, long names, 320 px, enlarged text, breakpoint neighbors, normal motion, static help and all three browser engines. No page-level overflow clipping or reduced assertions were used.

## Local evidence and limits

- Baseline, selected before/after views, iteration logs and core digest evidence are in ignored `output/responsive/interface-2026-10-04/`.
- Final browser screenshots, ZIP packages and motion captures are in `output/responsive/flows-fa6c72d5-ef9a-4733-a306-c144f2ab1e18/`.
- Final responsive screenshots and bounds results are in `output/responsive/regression-1200ba4f-8a1c-4876-a1c8-29b33392d925/`.
- Machine-readable reports are in `output/checks/browser-flows.json` and `output/checks/responsive.json`.

These checks use browser emulation. Physical devices, a screen reader, field animation performance and independent SI-agent trials are NOT_RUN. The connected Chrome extension cannot attach local files without its file-URL permission. The existing Playwright harness performed the local file-picker and download flows without changing that permission. Source inspection and an open Chrome page provided additional interface evidence.

The existing publication workflow requires the same source, unit, build, browser and responsive gates on both Windows and Linux before deploying `main`. Hosted verification is separate from this local review.
