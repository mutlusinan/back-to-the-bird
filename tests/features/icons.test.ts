import { readdirSync, readFileSync } from 'node:fs';
import { createHealth } from '../../src/core/health';
import { findAll, parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';
import { runFeatures } from '../../src/features/registry';
import type { FeatureId } from '../../src/config';

const css = readFileSync('src/features/icons/style.css', 'utf8');
const SVG_DIR = 'src/features/icons/svg';
const svg = (name: string) => readFileSync(`${SVG_DIR}/${name}.svg`, 'utf8').trim();
const store = { get: async () => undefined, set: async () => undefined };

const PLAIN: [string, string][] = [
  ['navHome', 'home'],
  ['navExplore', 'explore'],
  ['navNotifications', 'notifications'],
  ['navMessages', 'messages'],
  ['navProfile', 'profile'],
  ['navMore', 'more'],
  ['actionReply', 'reply'],
  ['actionRetweet', 'retweet'],
  ['actionBookmark', 'bookmark'],
];

function maskFor(selectorStart: string): string {
  const line = css.split('\n').find((l) => l.startsWith(selectorStart) && l.includes('mask:url('));
  expect(line, selectorStart).toBeDefined();
  const encoded = /mask:url\("data:image\/svg\+xml,([^"]+)"\)/.exec(line!)![1]!;
  return decodeURIComponent(encoded);
}

test.each(PLAIN)('%s is masked with %s.svg and its own paths are hidden', (anchor, file) => {
  expect(maskFor(`html[data-ot-f-icons] [data-ot~="${anchor}"] svg{`)).toBe(svg(file));
  expect(css).toContain(`html[data-ot-f-icons] [data-ot~="${anchor}"] svg>*{opacity:0}`);
});

test.each([
  ['actionLike', '2014', 'star'],
  ['actionLike', '2017', 'heart'],
  ['actionLiked', '2014', 'star-filled'],
  ['actionLiked', '2017', 'heart-filled'],
])('%s in %s uses %s.svg', (anchor, era, file) => {
  expect(maskFor(`html[data-ot-f-icons][data-ot-era="${era}"] [data-ot~="${anchor}"] svg{`)).toBe(svg(file));
});

test('every icon is a small single-color 24px drawing', () => {
  for (const file of readdirSync(SVG_DIR)) {
    const text = readFileSync(`${SVG_DIR}/${file}`, 'utf8');
    expect(text, file).toContain('viewBox="0 0 24 24"');
    const colors = [...text.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1]);
    expect(colors.every((c) => c === '#000' || c === 'none'), file).toBe(true);
    expect(text.length, file).toBeLessThan(2048);
  }
});

test('icons is active without any of its anchors', () => {
  document.body.innerHTML = '';
  const health = createHealth(store);
  const active = runFeatures({ table: parseSelectorTable(selectorsJson), doc: document, health }, new Set<FeatureId>(['icons']));
  expect(active.has('icons')).toBe(true);
});

test('liked and unliked buttons map to different anchors', () => {
  document.body.innerHTML =
    '<article><button data-testid="like" id="a"></button><button data-testid="unlike" id="b"></button></article>';
  const table = parseSelectorTable(selectorsJson);
  expect(findAll(table, 'actionLike', document).map((e) => e.id)).toEqual(['a']);
  expect(findAll(table, 'actionLiked', document).map((e) => e.id)).toEqual(['b']);
});
