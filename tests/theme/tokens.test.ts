import { readFileSync } from 'node:fs';
const tokensCss = readFileSync('src/theme/tokens.css', 'utf8');
import paletteMapJson from '../../src/data/palette-map.json';
import { parsePaletteMap } from '../../src/engine/palette-map';

const map = parsePaletteMap(paletteMapJson);

function usedTokens(): Set<string> {
  const tokens = new Set<string>(['bg-page']);
  for (const theme of ['light', 'night'] as const) {
    for (const table of Object.values(map[theme])) for (const t of Object.values(table ?? {})) tokens.add(t);
    for (const t of Object.values(map.xTokens[theme])) tokens.add(t);
  }
  for (const key of ['font-family', 'font-size', 'border-radius'] as const) {
    for (const t of Object.values(map[key])) tokens.add(t);
  }
  return tokens;
}

function block(theme: 'light' | 'night'): string {
  const start = tokensCss.indexOf(`html[data-ot-era="2017"][data-ot-theme="${theme}"]`);
  expect(start).toBeGreaterThanOrEqual(0);
  return tokensCss.slice(start, tokensCss.indexOf('}', start));
}

test.each(['light', 'night'] as const)('every token the data uses is defined for 2017 %s', (theme) => {
  const css = block(theme);
  const missing = [...usedTokens()].filter((t) => !css.includes(`--ot-${t}:`));
  expect(missing).toEqual([]);
});
