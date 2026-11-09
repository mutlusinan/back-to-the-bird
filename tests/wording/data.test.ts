import { readdirSync, readFileSync } from 'node:fs';
import type { Era } from '../../src/config';
import { WORDING_KEYS } from '../../src/wording/keys';
import { parseWordingTable } from '../../src/wording/table';
import { WORDING_TABLES } from '../../src/wording/tables';

const LANGS = ['ar', 'de', 'en', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'pt', 'ru', 'tr'];
const ERAS: readonly Era[] = ['2014', '2017'];
const wordAt = (lang: string, key: (typeof WORDING_KEYS)[number], era: Era) => {
  const value = WORDING_TABLES.get(lang)![key];
  return value === null || typeof value === 'string' ? value : value[era];
};

test('the first wave is exactly the twelve languages of spec §11', () => {
  expect(readdirSync('src/data/wording').map((f) => f.replace(/\.json$/, '')).sort()).toEqual(LANGS);
  expect([...WORDING_TABLES.keys()].sort()).toEqual(LANGS);
});

test.each(LANGS)('%s passes the schema and relabels something', (lang) => {
  const raw = JSON.parse(readFileSync(`src/data/wording/${lang}.json`, 'utf8'));
  expect(() => parseWordingTable(raw, lang)).not.toThrow();
  const filled = WORDING_KEYS.flatMap((key) => ERAS.map((era) => wordAt(lang, key, era))).filter((w) => w !== null);
  expect(filled.length).toBeGreaterThan(0);
});

test('English uses the words the spec names', () => {
  expect(wordAt('en', 'composeButton', '2017')).toBe('Tweet');
  expect(wordAt('en', 'repostAction', '2017')).toBe('Retweet');
  expect(wordAt('en', 'likesLabel', '2014')).toBe('Favorites');
  expect(wordAt('en', 'likesLabel', '2017')).toBe('Likes');
  expect(wordAt('en', 'profilePostsTab', '2014')).toBe('Tweets');
});

test('every word has a row in docs/wording-sources.md', () => {
  const doc = readFileSync('docs/wording-sources.md', 'utf8');
  const missing: string[] = [];
  for (const lang of LANGS) {
    for (const key of WORDING_KEYS) {
      for (const era of ERAS) {
        const word = wordAt(lang, key, era);
        if (word !== null && !doc.includes(`| ${lang} | ${key} | ${era} | ${word} |`)) missing.push(`${lang}.${key}.${era}`);
      }
    }
  }
  expect(missing).toEqual([]);
});
