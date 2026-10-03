# Contributing

Favicon Forge is a static VINASIG application. Image processing and ZIP generation stay in the user's browser. Read [AGENTS.md](AGENTS.md), [the brand record](docs/BRAND.md) and [the shared standards integration](docs/STANDARDS.md) before making a change.

Use Node 24.21.0 and npm 12.2.0. Install the lockfile, then run the applicable gates:

```sh
npx --yes npm@12.2.0 ci --ignore-scripts
npx --yes npm@12.2.0 exec -- playwright install chromium firefox webkit
npx --yes npm@12.2.0 run check
npx --yes npm@12.2.0 test
npx --yes npm@12.2.0 run build
npx --yes npm@12.2.0 run test:browser
npx --yes npm@12.2.0 run test:responsive
```

Keep source and public technical documentation in English. Preserve the established product flow, local Space Grotesk, Lucide controls, identity anchors and supplied brand artwork. Tests use local fixtures. Never upload a user's logo to a remote service, invent a license grant or replace the source with unchecked code.

Browser checks start a fresh production preview on an available port and stop only that preview. Open retained screenshots and inspect the full page; an automated assertion is not visual approval. Include positive and failure cases for image processing, replacement, errors and package contents. A missing browser or real device is an explicit unrun check.

The marked `AGENTS.md` block, `.agents/skills/` and `.vinasig/standards/` are managed snapshot bytes. Update them through a reviewed standards bundle and installer. Local project configuration and [provenance](.vinasig/provenance.json) belong to this repository. See [the toolchain record](docs/TOOLCHAIN.md) before changing dependencies or CI actions.

Submit sensitive findings through [private reporting](SECURITY.md). Use repository issues for public, non-sensitive product defects with reproduction steps and the affected commit.

## Contribution licensing

Read [LICENSES.md](LICENSES.md) before submitting material. New contributions use the applicable software, documentation or data scope unless a different compatible license is explicitly identified and accepted. Preserve authorship and third-party notices. Submit only material you have authority to license. This does not require a blanket copyright assignment or grant permission to redesign the official identity assets.
