import { readFileSync } from 'node:fs';
import paletteMapJson from '../../src/data/palette-map.json';
import { parsePaletteMap } from '../../src/engine/palette-map';

const tokensCss = readFileSync('src/theme/tokens.css', 'utf8');
const map = parsePaletteMap(paletteMapJson);
const ERAS = ['2014', '2017'] as const;
const THEMES = ['light', 'night'] as const;

function usedTokens(): Set<string> {
  const tokens = new Set<string>(['bg-page']);
  for (const theme of THEMES) {
    for (const table of Object.values(map[theme])) for (const t of Object.values(table ?? {})) tokens.add(t);
    for (const t of Object.values(map.xTokens[theme])) tokens.add(t);
  }
  for (const key of ['font-family', 'font-size', 'border-radius'] as const) {
    for (const t of Object.values(map[key])) tokens.add(t);
  }
  return tokens;
}

function block(era: string, theme: string): string {
  const start = tokensCss.indexOf(`html[data-ot-era="${era}"][data-ot-theme="${theme}"]`);
  expect(start).toBeGreaterThanOrEqual(0);
  return tokensCss.slice(start, tokensCss.indexOf('}', start));
}

const cases = ERAS.flatMap((era) => THEMES.map((theme) => [era, theme] as const));

test.each(cases)('every token the data uses is defined for %s %s', (era, theme) => {
  const css = block(era, theme);
  const missing = [...usedTokens()].filter((t) => !css.includes(`--ot-${t}:`));
  expect(missing).toEqual([]);
});

test('2014 light carries the October 2015 values', () => {
  const css = block('2014', 'light');
  for (const decl of ['--ot-accent:#55ACEE', '--ot-text:#292F33', '--ot-radius-pill:4px', '--ot-avatar-radius:5px', '--ot-bg-page:#F5F8FA']) {
    expect(css).toContain(decl);
  }
});

test('2014 night takes 2017 night colors and 2014 shapes', () => {
  const css = block('2014', 'night');
  expect(css).toContain('--ot-bg-card:#1B2836');
  expect(css).toContain('--ot-radius-pill:4px');
  expect(css).toContain('--ot-avatar-radius:5px');
});

test.each(cases)('every token the feature CSS uses is defined for %s %s', (era, theme) => {
  const dirs = ['surfaces', 'branding', 'radius', 'icons', 'avatar', 'buttons', 'hide'];
  const featureCss = dirs.map((d) => {
    try {
      return readFileSync(`src/features/${d}/style.css`, 'utf8');
    } catch {
      return '';
    }
  });
  const used = new Set([...[...featureCss, tokensCss].join('\n').matchAll(/var\(--ot-([a-z0-9-]+)\)/g)].map((m) => m[1]!));
  const css = block(era, theme);
  expect([...used].filter((t) => !css.includes(`--ot-${t}:`))).toEqual([]);
});
