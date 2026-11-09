import { readdirSync, readFileSync } from 'node:fs';
import { tagAnchors } from '../../src/core/anchors';
import { createHealth } from '../../src/core/health';
import { ANCHOR_NAMES, parseSelectorTable } from '../../src/core/selectors';
import paletteMapJson from '../../src/data/palette-map.json';
import selectorsJson from '../../src/data/selectors.json';
import { createEngine } from '../../src/engine';
import { parsePaletteMap } from '../../src/engine/palette-map';
import { SheetScanner } from '../../src/engine/scan';
import { DOM_FEATURES, runFeatures } from '../../src/features/registry';
import type { FeatureId } from '../../src/config';

const table = parseSelectorTable(selectorsJson);
const map = parsePaletteMap(paletteMapJson);
/** Controls that never exist on the home page: menus open on demand, tabs live on profile and engagement pages. */
const OFF_HOME = new Set<string>([
  'wordRepostAction',
  'wordUndoRepostAction',
  'wordQuoteAction',
  'wordRepostsLabel',
  'wordQuotesLabel',
  'wordLikesLabel',
  'wordProfilePostsTab',
]);
const DOM_ANCHORS = [...new Set(DOM_FEATURES.flatMap((f) => [...f.requires, ...f.optional]))].filter((a) => !OFF_HOME.has(a));

function load(file: string, dir: 'ltr' | 'rtl' = 'ltr'): void {
  const html = readFileSync(`tests/fixtures/${file}`, 'utf8');
  document.documentElement.innerHTML = /<html[^>]*>([\s\S]*)<\/html>/.exec(html)![1]!;
  document.documentElement.setAttribute('lang', 'en');
  document.documentElement.setAttribute('dir', dir);
}

const FIXTURES = [
  ['x-home-light.html', 'light'],
  ['x-home-night.html', 'night'],
] as const;

describe.each(FIXTURES)('%s', (file, theme) => {
  test('every anchor a DOM feature uses is found', () => {
    load(file);
    const found = tagAnchors(table, ANCHOR_NAMES, document);
    expect(DOM_ANCHORS.filter((a) => !found.has(a))).toEqual([]);
  });

  test('every DOM feature becomes active', () => {
    load(file);
    const health = createHealth({ get: async () => undefined, set: async () => undefined });
    const ids = DOM_FEATURES.map((f) => f.id);
    const active = runFeatures({ table, doc: document, health }, new Set<FeatureId>(ids));
    expect([...active].sort()).toEqual([...ids].sort());
  });

  test(`the engine matches the ${theme} palette in the fixture stylesheet`, async () => {
    load(file);
    const scanner = new SheetScanner(document);
    const engine = createEngine({
      map,
      scan: () => scanner.scanNew(),
      applyCss: async () => {},
      cache: { get: async () => undefined, set: async () => {} },
      now: () => 0,
      budgetMs: 1_000,
      features: new Set(['palette', 'font', 'typeScale', 'radius'] as const),
    });
    while (await engine.tick());
    for (const key of [`${theme}:color:text`, `${theme}:color:text-2`, `${theme}:border-color:border`, `${theme}:color:like-active`, 'font-family:font']) {
      expect(engine.matchedKeys().has(key), key).toBe(true);
    }
  });

  test('right-to-left pages find the same anchors', () => {
    load(file, 'rtl');
    const found = tagAnchors(table, ANCHOR_NAMES, document);
    expect(DOM_ANCHORS.filter((a) => !found.has(a))).toEqual([]);
  });
});

test('no feature stylesheet uses physical left/right properties', () => {
  for (const dir of readdirSync('src/features')) {
    let css = '';
    try {
      css = readFileSync(`src/features/${dir}/style.css`, 'utf8');
    } catch {
      continue;
    }
    expect(css, dir).not.toMatch(/\b(left|right)\b/);
  }
});
