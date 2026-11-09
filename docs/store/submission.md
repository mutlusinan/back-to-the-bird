# Submitting 1.0.0

Everything in this file needs the repository owner's accounts; the code side is
ready.

## Before submitting

1. Merge the release branch into `main` and push, so that
   `data/remote.json` is served from `raw.githubusercontent.com` (the extension
   works without it, using its built-in data).
2. Run the manual checklist (`docs/manual-checklist.md`) in Chrome and Firefox,
   including the open items (real like/unlike, 2014 settings controls, Firefox
   Android).
3. Build the packages:

   ```bash
   npm ci
   npm test
   npm run zip
   npm run zip:firefox
   ```

   Output in `.output/`: `back-to-the-bird-1.0.0-chrome.zip`,
   `back-to-the-bird-1.0.0-firefox.zip`, `back-to-the-bird-1.0.0-sources.zip`.
   CI builds the same zips on every push (artifact "extension-zips").
4. Screenshots: 1280×800 PNGs of x.com with the extension on — light and dark,
   2014 and 2017 — taken on your own profile so no one else's posts appear.
   Store tile: 440×280 from `public/icon/128.png` on a plain background.

## Chrome Web Store

1. Developer account (one-time US$5 fee) at
   https://chrome.google.com/webstore/devconsole, in the owner's name.
2. New item → upload `…-chrome.zip`.
3. Listing: texts from `docs/store/listing.md` (English default, Turkish
   added), category, screenshots, privacy policy URL
   `https://github.com/mutlusinan/back-to-the-bird/blob/main/PRIVACY.md`.
4. Privacy practices: single purpose and permission justifications from
   `listing.md`; "does not collect user data"; no remote code.
5. Submit for review.

## Firefox Add-ons (AMO)

1. Account at https://addons.mozilla.org/developers/.
2. Submit a new add-on → "On this site" → upload `…-firefox.zip`.
3. Source code: upload `…-sources.zip`; build instructions: "Node 22,
   `npm ci`, `npm run zip:firefox`" (also in README).
4. The manifest already declares `data_collection_permissions: none` and
   Firefox 128 as the minimum.
5. Listing texts and privacy policy as above.

## After publishing

- To fix breakage when X changes: edit `src/data/*`, run `npm run remote`,
  push to `main`. Installed copies pick it up within a day.
- To switch a broken feature off remotely: add its id to `disabledFeatures` in
  `tools/build-remote.mjs`, run `npm run remote`, push.
