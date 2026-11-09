# Back to the Bird

A browser extension for Chrome and Firefox that restyles x.com as if Twitter's
2014–2016 or 2017–2019 design tokens were still in use: colors, font, corner
radii, icons, logo and wording change, while X's current layout stays as it is.
It makes no requests to X and sends no data anywhere.

```bash
npm i            # install dev dependencies
npm run dev      # run in a development browser with live reload
npm test         # run the test suite
```

The design is described in `docs/superpowers/specs/2026-11-09-back-to-the-bird-design.md`.

## Build for the stores

```bash
npm ci
npm run zip           # .output/back-to-the-bird-<version>-chrome.zip
npm run zip:firefox   # …-firefox.zip and …-sources.zip (for AMO review)
```

Node 22 or later. CI (`.github/workflows/ci.yml`) runs the type check, the tests
and both builds on every push. Submission steps: `docs/store/submission.md`.

## Data that can change without a release

Selectors, colours and wording live in `src/data/`. `npm run remote` copies them
into `data/remote.json`; pushed to `main`, installed copies pick it up within a
day (validated, data only — see spec §12). Visual tests: `npm run test:visual`
(Chrome, Windows baselines).

## Privacy

No data is collected or sent; see [PRIVACY.md](PRIVACY.md).

Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
