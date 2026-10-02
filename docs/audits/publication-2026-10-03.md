# Publication preparation: 3 October 2026

## Scope and baseline

This task standardizes `VINASIG/favicon-forge` on its existing `main` branch. The repository was already public. The initial checkout was clean and matched remote commit `b6b4b3bedbf1bb4497220f170007394eee0d51ae`. This record describes local preparation; the subsequent exact-commit GitHub Actions run and Pages deployment are separate publication evidence.

The application has one HTML route, `/favicon-forge/`, plus the new static `/favicon-forge/sitemap.xml` endpoint. Processing uses Canvas and JSZip in the browser. There are no accounts, server uploads, payments, menus, modals or multi-page layouts in this product.

## Changes and reproduced defects

- Adopt the approved shared `web-typescript` snapshot at `c9d33c73a89edaf1773fa4d31f1c7258e549b7b1`, with 37 managed payload files, provenance and a local integrity gate. Owner guidance remains outside the managed block.
- Pin the supported runtime/package manager and current compatible dependencies. Add strict source checks, typed lint, CSS/HTML checks, one formatter and reviewable update proposals.
- Separate unchecked inline processing into typed modules while preserving the established product flow, visual tokens, local Space Grotesk, Lucide controls and supplied artwork.
- Reproduce an older delayed image decode overwriting the newest selection at 390 × 844. A selection counter now ignores stale completions, and download stays disabled while a replacement is being read. Invalid replacement retains the last valid result.
- Reproduce a maskable PNG that was byte-identical to the ordinary icon. The generated maskable icon now has an opaque white background and fits all content inside the 40% radius [manifest safe circle](https://www.w3.org/TR/appmanifest/#icon-masks-and-safe-zone). Pixel and geometry assertions verify that boundary.
- Check dimensions before source canvas allocation and enforce the 16 million pixel input limit. Add correct base-aware sitemap/application metadata and a JavaScript-required fallback.
- Preserve all ten public files byte for byte, including original asset and dependency notices. Git attributes protect these files and the managed snapshot against line-ending conversion. Public access grants no new source or artwork license.

No new responsive defect was reproduced in the baseline. Existing breakpoint and motion behavior is retained. CSS changes normalize formatting and resolve rule ordering; they do not redesign the page or conceal overflow.

## Local evidence

| Check                                           | Result                    | Evidence                                                                                                                                                           |
| ----------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Baseline build and five viewport review         | PASS                      | `output/responsive/before-standardization-2026-10-03/`: 16 full-page images, all opened before implementation                                                      |
| Strict Astro/TypeScript check                   | PASS                      | 17 checked files, zero errors, warnings or hints                                                                                                                   |
| Typed ESLint, Stylelint and Prettier            | PASS                      | `npm run check`, zero lint warnings                                                                                                                                |
| Shared snapshot integrity                       | PASS                      | `output/checks/standards.json`: 37 payload files, managed block, provenance and instruction budget                                                                 |
| Unit regressions                                | PASS                      | `npm test`: 16 tests, zero failures or skipped tests                                                                                                               |
| Generated HTML, sitemap and asset preservation  | PASS                      | `output/checks/built.json`: one HTML page, matching canonical/sitemap and ten original public files                                                                |
| Locked installation replay                      | PASS                      | Fresh ignored `output/lockfile-replay-01882a68-30c6-4d94-be0e-79d21b5314bf/`, `npm ci --ignore-scripts`                                                            |
| Dependency audit                                | PASS                      | `output/publication/dependency-audit.json`: zero known npm vulnerabilities at lookup time                                                                          |
| Responsive assertions                           | PASS                      | `output/responsive/regression-ad3a1931-a92f-4afb-af20-ba685bbc6fd7/`: 120 states, zero failures                                                                    |
| Chromium and WebKit flows                       | PASS for selected engines | `output/responsive/flows-ee99c781-b280-4179-b32e-61f13452dde5/`: eight cases, 24 axe scans with zero violations, downloaded ZIP inspection and request observation |
| Local Firefox                                   | NOT_RUN                   | Launch fails before a page opens; reinstalling Playwright Firefox 1543 did not resolve Windows SideBySide event 33, missing dependent assembly `mozglue`           |
| Workflow structure                              | PASS                      | YAML parse, both OS matrix entries, pull request trigger and deployment dependency reviewed                                                                        |
| Exact-commit hosted CI and new Pages deployment | NOT_RUN at preparation    | Must be inspected after the authorized push; local engine selection cannot omit any engine in CI                                                                   |

The responsive suite covers 360 × 800, 390 × 844, 768 × 1024, 1024 × 768 and 1440 × 900; 320, 519, 520, 521, 600, 719, 720, 721, 900 and 1280 px widths use 900 px height. Every width runs at 100% and 200% text size in empty, uploaded, packaging and validation-error states. Full-page captures accompany DOM/computed style/bounds checks, full scrolling, long filenames, touch/keyboard file selection, disabled/loading controls and restored download behavior. Original before images are retained separately.

Manual screenshot inspection includes all four states at the five required viewports and both text sizes, 320 px reflow, actual breakpoint neighbors and representative intermediate widths. Browser flow images and normal/reduced motion frames are reviewed separately from assertions. The finite reveal/font settling step prevents transient-opacity contrast measurement; axe rules and responsive assertions remain active.

## Publication contract and limits

The workflow installs the locked graph and checks source, unit tests, built HTML, all three browser engines and responsive states on both Windows and Linux. CI rejects a narrowed `BROWSER_ENGINES` setting. Pages depends on both operating systems passing, uses the Ubuntu build and retains reports/screenshots for 14 days.

Viewport/touch emulation does not prove physical-device or installed Safari behavior. Screen readers, fresh Codex runtime discovery, an independent SI agent trial, repeated Lighthouse/performance traces, field Core Web Vitals, external structured-data tools and search-account dashboards are `NOT_RUN`. Axe provides partial automated accessibility evidence. Metadata/sitemap correctness does not establish indexing, rankings or answer-engine citations. This project cannot control the origin-root `robots.txt` of the shared GitHub Pages host.

Source preparation does not claim a deployed result. The exact pushed commit, hosted check run, Pages deployment and anonymous repository/site checks must be included in the publication handoff.
