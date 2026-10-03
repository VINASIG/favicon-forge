# Favicon setup and search-content review

Reviewed on 3 October 2026 for the owner's question about missing supporting content below Favicon Forge.

## Baseline and decision

The clean `main` checkout matched remote commit `4c120b8cfb22681b8a0d28960c10e548f7b40257`. The public page already had a meaningful title and description, canonical URL, Open Graph and Twitter metadata, a base-aware sitemap and truthful `WebApplication` JSON-LD. It ended after the generator and lacked the useful setup, limitations and question disclosures present in the sibling Unphar and BMI tools.

The project guide explicitly keeps the choose/preview/download flow short. It does not record a decision to omit all explanatory content. This change addresses that content gap with a secondary static setup guide and five native disclosures below the generator. Primary browser/search documentation supports general icon behavior; product-specific limits, formats, privacy and package details come from the implementation and its existing package tests.

## Search and content choices

- Keep the established English product language, public URL, brand assets, local Space Grotesk and generation behavior.
- Explain installation, supported images, package contents, local processing, maskable icons and favicon troubleshooting. Keep the setup steps visible and questions collapsed by default. Native disclosure works with touch and keyboard without client JavaScript.
- Render all explanatory text in Astro's static HTML. Keep the application description in visible content and metadata, with a single shared source for copy and input limits derived from the generator constants.
- Retain the relevant `WebApplication` vocabulary and add its factual description. Do not fabricate ratings, reviews, author identities or Google rich-result eligibility.
- Do not add FAQ or HowTo markup solely to seek a Google rich result. Google's current [documentation changelog](https://developers.google.com/search/updates#may-2026) says FAQ rich results stopped appearing on 7 May 2026 and the FAQ feature documentation was removed on 15 June 2026. Visible useful answers remain worthwhile independently of that retired display feature.
- Google's [generative-search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) and [AI features guide](https://developers.google.com/search/docs/appearance/ai-features) describe foundational SEO and useful content. No special AI schema or `llms.txt` is required for Google's AI features. No separate consumer needing such a file was identified here.
- Google Search uses one favicon per hostname and has its own crawl/display rules. The setup help links to [Google's favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search), [MDN favicon links](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel#icon) and [MDN app icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons#support_masking).

## Regression coverage and verification evidence

The build gate parses JSON-LD rather than checking only a type-name substring, checks the application URL and description against visible HTML, and requires every question and answer in static output. New unit tests cover question anchors, input-limit copy and primary documentation references.

Existing browser and responsive suites retain their original generator, download, privacy, race, motion and error assertions. Added cases open/close all questions, verify visible keyboard focus, scan open help with axe, and exercise help without JavaScript. The responsive suite adds open-help coverage at all 15 viewport settings with ordinary and enlarged text, increasing its states from 120 to 150.

Screenshot review caught Astro whitespace trimming around inline filenames in the setup steps. Explicit spaces preserve natural text, and browser assertions now check the rendered sentences. A diagnostic axe scan stalled in a JavaScript-disabled context. That context is inspected through static HTML, native interaction and screenshots; its axe status is `NOT_RUN` because the injected analyzer needs script execution. All original axe gates and the new open-help scan remain enabled in ordinary contexts.

Keyboard screenshots also showed the summary focus outline close to the first answer line. An existing 8 px spacing token now separates the answer from the summary, with a browser bounding-box regression to keep the focus outline clear of text.

The first publication checks on Linux and Windows caught a Firefox native focus difference after touch followed by keyboard activation: the focused summary did not match `:focus-visible`. The disclosure outline now uses `:focus` so an active question stays visibly focused across input methods and platforms. The original browser assertion requiring the focus outline remains enabled.

Before/after public and local screenshots and structured checks are kept under ignored `output/responsive/search-2026-10-03/`. The first comparison helper attempted to open Unphar's intentionally hidden archive-contents disclosure; its captures were preserved, and a fresh baseline opens only visible disclosures without changing the application. This was a comparison-driver error, not a Favicon Forge defect.

Final source, browser, CI, publication and public-page receipts are recorded separately after the reviewed source candidate. This document cannot contain its own final commit hash.

## Limits

Technical/content checks do not establish indexing, ranking, answer-engine citations or field performance. Search Console/Bing property dashboards and independent SI-agent search trials are not part of this change. The project cannot change the shared GitHub Pages hostname's origin-root crawler policy. Real-device and screen-reader checks remain separate evidence. Existing unpatched dependency advisories are tracked in the [dependency audit](dependencies-2026-10-03.md); this content change does not resolve them.
