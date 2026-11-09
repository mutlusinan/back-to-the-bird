import { parsePaletteMap } from '../../src/engine/palette-map';
import { remapRule, renderOverrides, type RuleLike } from '../../src/engine/remap';

const map = parsePaletteMap({
  version: 1,
  light: { color: { 'rgb(29, 155, 240)': 'accent' }, 'border-color': { 'rgb(239, 243, 244)': 'border' } },
  night: { color: { 'rgb(29, 155, 240)': 'accent' } },
  'font-family': { TwitterChirp: 'font' },
  'font-size': { '15px': 'fs-body' },
  'border-radius': { '9999px': 'radius-pill' },
  xTokens: { light: {}, night: {} },
});

const rule = (selectorText: string, props: Record<string, string>, media?: string): RuleLike => ({
  selectorText,
  media,
  style: { getPropertyValue: (p) => props[p] ?? '' },
});

test('accent color maps for both themes', () => {
  const css = renderOverrides(remapRule(rule('.r-a', { color: 'rgba(29,155,240,1.00)' }), map));
  expect(css).toBe(
    'html[data-ot-f-palette][data-ot-theme="light"] .r-a{color:var(--ot-accent)}\n' +
      'html[data-ot-f-palette][data-ot-theme="night"] .r-a{color:var(--ot-accent)}',
  );
});

test('border longhands map through border-color entry', () => {
  const e = remapRule(rule('.r-b', { 'border-bottom-color': 'rgba(239,243,244,1.00)' }), map);
  expect(e).toHaveLength(1);
  expect(e[0]).toMatchObject({ property: 'border-bottom-color', token: 'border', key: 'light:border-color:border' });
});

test('selector lists are scoped per part', () => {
  expect(renderOverrides(remapRule(rule('.a,.b:hover', { color: 'rgb(29, 155, 240)' }), map)).split('\n')[0]).toBe(
    'html[data-ot-f-palette][data-ot-theme="light"] .a,html[data-ot-f-palette][data-ot-theme="light"] .b:hover{color:var(--ot-accent)}',
  );
});

test('media rules are wrapped', () => {
  expect(renderOverrides(remapRule(rule('.c', { color: 'rgb(29, 155, 240)' }, '(min-width: 500px)'), map))).toMatch(
    /^@media \(min-width: 500px\)\{html\[data-ot-f-palette\]\[data-ot-theme="light"\] \.c\{color:var\(--ot-accent\)\}/,
  );
});

test('font family matches by substring, size and radius exactly', () => {
  const e = remapRule(
    rule('.d', {
      'font-family': 'TwitterChirp, -apple-system, sans-serif',
      'font-size': '15px',
      'border-top-left-radius': '9999px',
    }),
    map,
  );
  expect(e.map((x) => [x.feature, x.property, x.token])).toEqual([
    ['font', 'font-family', 'font'],
    ['typeScale', 'font-size', 'fs-body'],
    ['radius', 'border-top-left-radius', 'radius-pill'],
  ]);
  expect(renderOverrides(e)).toContain('html[data-ot-f-font] .d{font-family:var(--ot-font)}');
});

test('unmapped values produce nothing', () => {
  expect(remapRule(rule('.e', { color: 'rgb(1, 2, 3)' }), map)).toEqual([]);
});

test('duplicate entries render once', () => {
  const e = remapRule(rule('.f', { color: 'rgb(29, 155, 240)' }), map);
  expect(renderOverrides([...e, ...e]).split('\n')).toHaveLength(2);
});
