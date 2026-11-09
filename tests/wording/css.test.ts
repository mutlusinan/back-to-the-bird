import { WORDING_KEYS } from '../../src/wording/keys';
import { cssString, wordingCss } from '../../src/wording/css';
import type { WordingTable } from '../../src/wording/table';

const table = (over: Partial<WordingTable>): WordingTable =>
  ({ ...Object.fromEntries(WORDING_KEYS.map((k) => [k, null])), ...over }) as WordingTable;

const ruleCount = (css: string) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet.cssRules.length;
};

test('a CSS string escapes quotes, backslashes and line breaks', () => {
  expect(cssString('a"b\\c\nd')).toBe('"a\\"b\\\\c\\a d"');
  expect(cssString('Tweet')).toBe('"Tweet"');
  expect(cssString('ツイート')).toBe('"ツイート"');
});

test('a word for both eras hides the text leaf and draws the word before it', () => {
  const css = wordingCss(table({ composeButton: 'Tweet' }));
  expect(css).toContain(
    'html[data-ot-f-wording] [data-ot~="wordComposeButton"] span:not(:has(*)){font-size:0 !important}',
  );
  expect(css).toContain(
    'html[data-ot-f-wording] [data-ot~="wordComposeButton"] :has(> span:not(:has(*)):not(:empty))::before{content:"Tweet";content:"Tweet" / ""}',
  );
});

test('an empty text leaf (collapsed menu) gets no word', () => {
  // The ::before parent must have a non-empty leaf child; a bare icon button keeps no label.
  expect(wordingCss(table({ composeButton: 'Tweet' }))).toContain(':not(:empty))::before');
});

test('an era-specific word is scoped to its era and a null era gets no rule', () => {
  const css = wordingCss(table({ likesLabel: { '2014': 'Favorites', '2017': null } }));
  expect(css).toContain('html[data-ot-f-wording][data-ot-era="2014"] [data-ot~="wordLikesLabel"] span:not(:has(*))');
  expect(css).toContain('content:"Favorites"');
  expect(css).not.toContain('data-ot-era="2017"');
});

test('a null key gets no rule at all, so X keeps its text', () => {
  expect(wordingCss(table({}))).toBe('');
  expect(wordingCss(table({ repostAction: 'Retweet' }))).not.toContain('wordComposeButton');
});

test('a word with CSS syntax in it stays inside its string', () => {
  const plain = wordingCss(table({ composeButton: 'Tweet' }));
  const hostile = wordingCss(table({ composeButton: 'a"}html{display:none}' }));
  expect(ruleCount(hostile)).toBe(ruleCount(plain));
  expect(hostile).toContain('content:"a\\"\\7d html\\7b display:none\\7d "');
  expect(cssString('{;}')).toBe('"\\7b \\3b \\7d "');
});
