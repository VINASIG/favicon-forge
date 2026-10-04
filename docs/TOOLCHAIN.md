# Verified toolchain

Selection date: 3 October 2026. Versions and runtime/peer ranges were read from the official npm registry. CI action releases and their commit refs were read from the official action repositories. The lockfile pins the resolved dependency graph.

| Tool                        | Latest stable checked                            | Selected  |
| --------------------------- | ------------------------------------------------ | --------- |
| Node 24 LTS                 | `24.21.0` within supported major 24              | `24.21.0` |
| npm                         | `12.2.0`                                         | `12.2.0`  |
| Astro                       | `7.3.5`                                          | `7.3.5`   |
| Astro checker               | `0.9.10`                                         | `0.9.10`  |
| Lucide Astro                | `1.50.0`                                         | `1.50.0`  |
| JSZip                       | `3.10.2`                                         | `3.10.2`  |
| Playwright                  | `1.63.0`                                         | `1.63.0`  |
| axe Playwright              | `4.13.0`                                         | `4.13.0`  |
| TypeScript                  | `7.0.2`                                          | `6.0.3`   |
| typescript-eslint           | `8.71.0`                                         | `8.71.0`  |
| ESLint / JS rules           | `10.11.0` / `10.0.1`                             | Same      |
| Astro ESLint adapter        | `3.2.1`                                          | `3.2.1`   |
| Prettier / Astro plugin     | `3.9.9` / `1.1.0`                                | Same      |
| Stylelint / standard config | `17.16.0` / `40.0.0`                             | Same      |
| HTML-validate               | `11.16.1`                                        | `11.16.1` |
| Node types                  | Latest major `26.6.4`; latest major 24 `24.19.1` | `24.19.1` |

TypeScript 7.0.2 is outside both typed ESLint's verified `>=4.8.4 <6.1.0` peer range and the Astro checker's `^5.0.0 || ^6.0.0` range. Version 6.0.3 retains strict enforcement with compatible peers. The Astro ESLint adapter requires ESLint 10 and Node `^24.16.0` within this runtime line; the selected stack satisfies both. Newest compatible versions are recorded explicitly rather than forcing incompatible peers.

Node and npm are project-scoped. Normal execution and CI pin npm 12.2.0, with no floating `@latest` and no global tool change. Simple Icons is the standard for future third-party brand marks; this product currently needs only Lucide controls and supplied VINASIG artwork, so it adds no unused icon runtime. Existing CSS handles its motion.

## CI action pins

| Action                          | Release  | Commit                                     |
| ------------------------------- | -------- | ------------------------------------------ |
| `actions/checkout`              | `v7.0.1` | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node`            | `v7.0.0` | `820762786026740c76f36085b0efc47a31fe5020` |
| `actions/upload-artifact`       | `v7.0.1` | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` |
| `actions/upload-pages-artifact` | `v5.0.0` | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| `actions/deploy-pages`          | `v5.0.1` | `368f82528645a54fb793d4d04e342629a3f51346` |

[Dependabot](../.github/dependabot.yml) proposes npm/action updates for review. It does not merge updates automatically. Rerun source, unit, built-site and browser gates before accepting a version change.

Primary lookup sources: [npm registry](https://registry.npmjs.org/), [Node release index](https://nodejs.org/dist/index.json), [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/), [Astro ESLint adapter](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) and the official action repositories linked in the workflow.

## Bilingual regression

Read docs/LOCALIZATION.md. Language and appearance regression tests run through the existing browser command. They cover both built locales, native navigation without scripts, metadata, localized guidance, keyboard controls, theme persistence and blocked storage. Authored textarea guidance is translated while its content remains literal. The original core and responsive assertions remain enabled.
