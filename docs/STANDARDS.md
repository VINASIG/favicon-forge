# Shared SI agent standards

Favicon Forge adopts the reviewed `web-typescript` profile from [VINASIG Agent Standards](https://github.com/VINASIG/agent-standards/tree/59c4b39cfd5f6aa90050da529af1d9894cfe41fb).

| Record            | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Standards version | `0.1.0`, public preview                                            |
| Source commit     | `59c4b39cfd5f6aa90050da529af1d9894cfe41fb`                         |
| Bundle SHA-256    | `e6cd21c55a61f02466f767029f05a2d23898fed5a6fd386f08f733dcbbbf6439` |
| Profile           | `web-typescript`                                                   |
| Managed files     | 47, plus the marked instruction block and manifest                 |
| Owner provenance  | [`.vinasig/provenance.json`](../.vinasig/provenance.json)          |

The source checkout and remote commit matched before bundling. The explicit-target install plan was reviewed before applying it. The installed skills cover workflow, dependencies, responsive/accessibility, motion, search, performance and browser-agent usability. Their paths are instructions to read; they do not register remote tools or automatically start a browser.

The standard's historical source/tool records retain their original wording and lookup dates. The current design system and brand asset repositories are public. Product-specific adoption and rights remain documented in [BRAND.md](BRAND.md) and [LICENSE_STATUS.md](../LICENSE_STATUS.md).

## Actual quality gates

- Astro's strictest checker covers the page, typed client modules and checked JavaScript scripts. Production code has no `@ts-nocheck` suppression. `output/` contains temporary evidence and is outside the source project.
- Typed ESLint covers TypeScript and checked JavaScript; the official Astro adapter covers templates. Stylelint checks actual CSS and HTML-validate checks generated HTML with the filesystem configuration loader.
- The local integrity gate checks provenance, every managed file digest, the marked block, a shadowing root override and the 8 KiB instruction budget.
- Unit tests cover image limits, geometry, ICO bytes, manifests and URL/base-path behavior. Playwright uses role/name based interactions, axe, ZIP inspection, request observation, rapid replacement and viewport assertions.
- Motion tests separate opacity/transform reveals from short control color feedback. Axe scans run after finite reveals and font loading settle; frame captures inspect the transient motion separately. This corrects test timing without disabling contrast assertions or changing the established animation design.

## Verification boundaries

Structural checks pass independently of Codex runtime discovery. A fresh Codex session in this consumer must verify actual skill and instruction discovery; that trial is `NOT_RUN` in the preparation report.

Chromium, Firefox and WebKit are desktop browser engines with viewport/touch emulation. They do not prove behavior on a physical phone or Safari installation. Axe and deterministic role/name flows are partial accessibility and agent-usability evidence. Screen readers and an independent agent given only a URL and goal are separate unrun checks.

Search metadata and the base-aware sitemap are checked locally and after deployment. The canonical custom-domain deployment publishes its own origin-root robots.txt and sitemap. The owner separately authorized DNS verification and Search Console setup on 4 October 2026. No analytics or input telemetry is introduced. External ranking, answer-engine citations, field Core Web Vitals and repeated Lighthouse performance measurements remain separate evidence.

## Interface rules approved on 3 October 2026

The owner requested this standards update across VINASIG. LANG-004 requires natural punctuation, sentence case and custom list markers in authored interfaces. LANG-005 requires ordinary-reader language and limits parenthetical labels. Required code, URLs, times, regulatory identifiers, official names and user input retain their correct syntax.

WEB-008 requires matching closed and opened dropdown, calendar, color and slider controls. Operating-system popups do not satisfy the requirement. The snapshot includes `templates/web/interface.mjs` for rendered-copy and control regressions. Consumer tests exercise real routes and dynamic states. Visual, keyboard and ordinary-language review remain necessary.

## Header rules approved on 4 October 2026

The owner approved original transparent horizontal logos selected for the actual header surface under WEB-001. Keep the source asset bytes, proportions and internal artwork. Avoid white panels, padded or rounded cards and artwork effects. Maintain the accessible logo link and its usable target independently of image size.

This reviewed snapshot adds `inspectHeaderBrand` to `templates/web/interface.mjs`. The consumer browser regressions check the real header alongside rendered copy. Asset integrity, screenshot review and script-unavailable states remain separate checks.

## Licensing adopted on 4 October 2026

The reviewed snapshot includes the licensing policy, LIC-001 through LIC-004, full GPL/CC texts, material map, brand policy, review template and license checker. It retains its own software/prose grants rather than setting this project's primary license. The owner separately selected this project's scopes in LICENSES.md. Use npm run check:licenses for source metadata/text verification. Web builds also verify published legal text and source notices. Original assets and existing gates remain required.
