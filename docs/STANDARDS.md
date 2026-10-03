# Shared SI agent standards

Favicon Forge adopts the reviewed `web-typescript` profile from [VINASIG Agent Standards](https://github.com/VINASIG/agent-standards/tree/76901601b193c963b849b253d11f51363b447ffe).

| Record            | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Standards version | `0.1.0`, public preview                                            |
| Source commit     | `76901601b193c963b849b253d11f51363b447ffe`                         |
| Bundle SHA-256    | `bb555aad2e5c66da8ba2cdd5530446ca95c1235bb28706cb82066222adcb61f1` |
| Profile           | `web-typescript`                                                   |
| Managed files     | 37, plus the marked instruction block and manifest                 |
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

Search metadata and the base-aware sitemap are checked locally and after deployment. GitHub project Pages cannot set the origin-root `robots.txt` from this repository. No crawler policy, indexing submission, account dashboard or telemetry collection is introduced. External ranking, answer-engine citations, field Core Web Vitals and repeated Lighthouse performance measurements remain separate evidence.

## Interface rules approved on 3 October 2026

The owner requested this standards update across VINASIG. LANG-004 requires natural punctuation, sentence case and custom list markers in authored interfaces. LANG-005 requires ordinary-reader language and limits parenthetical labels. Required code, URLs, times, regulatory identifiers, official names and user input retain their correct syntax.

WEB-008 requires matching closed and opened dropdown, calendar, color and slider controls. Operating-system popups do not satisfy the requirement. The snapshot includes `templates/web/interface.mjs` for rendered-copy and control regressions. Consumer tests exercise real routes and dynamic states. Visual, keyboard and ordinary-language review remain necessary.
