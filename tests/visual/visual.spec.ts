import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Built by `npm run test:visual` before Playwright starts.
const css = readFileSync('.output/chrome-mv3/content-scripts/content.css', 'utf8');
const preview = readFileSync('.output/preview/preview.js', 'utf8');

for (const theme of ['light', 'night'] as const) {
  for (const era of ['2014', '2017'] as const) {
    test(`home ${theme} ${era}`, async ({ page }) => {
      await page.goto(pathToFileURL(resolve(`tests/fixtures/x-home-${theme}.html`)).href);
      await page.addScriptTag({ content: `${preview}\nwindow.OTPreview = OTPreview;` });
      await page.evaluate(
        async ({ css, era }) => {
          await (window as unknown as { OTPreview: { run(c: string, o: { era: string }): Promise<unknown> } }).OTPreview.run(css, { era });
        },
        { css, era },
      );
      await expect(page).toHaveScreenshot(`home-${theme}-${era}.png`);
    });
  }
}
