import { WORDING_KEYS, wordingAnchor } from '../../src/wording/keys';
import { normalizeLang, parseWordingTable, type WordingTable } from '../../src/wording/table';

const full = (): Record<string, unknown> => Object.fromEntries(WORDING_KEYS.map((k) => [k, null]));

test('the v1 keys are the nine relabelled controls', () => {
  expect(WORDING_KEYS).toEqual([
    'composeButton',
    'composeSubmit',
    'repostAction',
    'undoRepostAction',
    'quoteAction',
    'repostsLabel',
    'quotesLabel',
    'likesLabel',
    'profilePostsTab',
  ]);
  expect(wordingAnchor('composeButton')).toBe('wordComposeButton');
  expect(wordingAnchor('profilePostsTab')).toBe('wordProfilePostsTab');
});

test('a table with every key passes unchanged', () => {
  const raw = { ...full(), composeButton: 'Tweet', likesLabel: { '2014': 'Favorites', '2017': 'Likes' } };
  expect(parseWordingTable(raw, 'en')).toEqual(raw as WordingTable);
});

test.each([
  ['a missing key', () => { const t = full(); delete t.quoteAction; return t; }, /quoteAction/],
  ['an unknown key', () => ({ ...full(), shareAction: 'Share' }), /shareAction/],
  ['a value longer than 40 characters', () => ({ ...full(), composeButton: 'x'.repeat(41) }), /composeButton/],
  ['an empty value', () => ({ ...full(), composeButton: '' }), /composeButton/],
  ['a line break', () => ({ ...full(), composeButton: 'Twe\net' }), /composeButton/],
  ['an era object with an unknown era', () => ({ ...full(), likesLabel: { '2014': 'Favorites', '2020': 'Likes' } }), /likesLabel/],
  ['an era object missing an era', () => ({ ...full(), likesLabel: { '2014': 'Favorites' } }), /likesLabel/],
  ['a number', () => ({ ...full(), composeButton: 7 }), /composeButton/],
  ['an array', () => [], /object/],
])('rejects %s', (_name, make, message) => {
  expect(() => parseWordingTable(make(), 'xx')).toThrow(message);
});

test.each([
  ['en', 'en'],
  ['en-GB', 'en'],
  ['PT-br', 'pt'],
  ['zh-CN', 'zh-cn'],
  ['zh-TW', 'zh-tw'],
  ['zh', 'zh'],
  ['ar-x-fm', 'ar'],
  ['', ''],
  ['  ', ''],
])('normalizes %j to %j', (input, expected) => {
  expect(normalizeLang(input)).toBe(expected);
});
