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

// happy-dom cannot evaluate the wording selectors (:has with :not(:empty)); this checks them in Chrome.
for (const era of ['2014', '2017'] as const) {
  test(`wording relabels Post as Tweet in Chrome (${era})`, async ({ page }) => {
    await page.goto(pathToFileURL(resolve('tests/fixtures/x-home-light.html')).href);
    await page.addScriptTag({ content: `${preview}\nwindow.OTPreview = OTPreview;` });
    const seen = await page.evaluate(
      async ({ css, era }) => {
        // Live X shapes (2026-11-09): nested text spans in the post dialog, a div[dir] holder in menus.
        document.body.insertAdjacentHTML(
          'beforeend',
          `<div role="dialog"><button data-testid="tweetButton"><div dir="ltr"><div><span><span>Post</span></span></div></div></button></div>
           <div role="menu"><div role="menuitem" data-testid="retweetConfirm"><div><svg></svg></div><div><div dir="ltr"><span>Repost</span></div></div></div></div>`,
        );
        await (window as unknown as { OTPreview: { run(c: string, o: { era: string }): Promise<unknown> } }).OTPreview.run(css, { era });
        const read = (testid: string) => {
          const control = document.querySelector(`[data-testid="${testid}"]`)!;
          const leaf = control.querySelector('span:not(:has(*))')!;
          const holder = leaf.parentElement!;
          const others = [control, ...control.querySelectorAll('*')].filter(
            (el) => el !== holder && getComputedStyle(el, '::before').content !== 'none',
          );
          return { word: getComputedStyle(holder, '::before').content, leafSize: getComputedStyle(leaf).fontSize, others: others.length };
        };
        return {
          compose: read('SideNav_NewTweet_Button'),
          submit: read('tweetButtonInline'),
          dialog: read('tweetButton'),
          repost: read('retweetConfirm'),
        };
      },
      { css, era },
    );
    expect(seen.compose).toEqual({ word: '"Tweet" / ""', leafSize: '0px', others: 0 });
    expect(seen.submit).toEqual({ word: '"Tweet" / ""', leafSize: '0px', others: 0 });
    expect(seen.dialog).toEqual({ word: '"Tweet" / ""', leafSize: '0px', others: 0 });
    expect(seen.repost).toEqual({ word: '"Retweet" / ""', leafSize: '0px', others: 0 });
  });
}
