import { parsePaletteMap } from '../../src/engine/palette-map';
import { missingXTokens, renderXTokenOverrides } from '../../src/engine/xtokens';

const map = parsePaletteMap({
  version: 1,
  light: {},
  night: {},
  'font-family': {},
  'font-size': {},
  'border-radius': {},
  xTokens: {
    light: { '--x-fg-primary': 'text', '--x-font-sans': 'font' },
    night: { '--x-fg-primary': 'text' },
  },
});

test('token overrides are scoped by theme, the font token by the font feature', () => {
  expect(renderXTokenOverrides(map)).toBe(
    'html[data-ot-f-palette][data-ot-theme="light"]{--x-fg-primary:var(--ot-text)}\n' +
      'html[data-ot-f-font]{--x-font-sans:var(--ot-font)}\n' +
      'html[data-ot-f-palette][data-ot-theme="night"]{--x-fg-primary:var(--ot-text)}',
  );
});

test('missingXTokens reports names X no longer defines for the current theme', () => {
  expect(missingXTokens(map, 'light', (n) => (n === '--x-fg-primary' ? '' : '#000'))).toEqual(['--x-fg-primary']);
  expect(missingXTokens(map, 'light', () => '#000')).toEqual([]);
});

test('missingXTokens ignores the other theme', () => {
  const read = (n: string) => (n === '--x-font-sans' ? 'TwitterChirp' : '');
  expect(missingXTokens(map, 'night', read)).toEqual(['--x-fg-primary']);
});
