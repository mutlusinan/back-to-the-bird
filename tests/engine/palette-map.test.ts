import { parsePaletteMap, PaletteMapError } from '../../src/engine/palette-map';
import paletteMapJson from '../../src/data/palette-map.json';

const valid = () => ({
  version: 1,
  light: { color: { 'rgba(29,155,240,1.00)': 'accent' }, 'border-color': { '#EFF3F4': 'border' } },
  night: { 'background-color': { 'rgb(0, 0, 0)': 'bg-card' } },
  'font-family': { TwitterChirp: 'font' },
  'font-size': { '15px': 'fs-body' },
  'border-radius': { '9999px': 'radius-pill' },
  xTokens: { light: { '--x-fg-primary': 'text' }, night: { '--x-fg-primary': 'text' } },
});

test('xTokens are kept per theme', () => {
  expect(parsePaletteMap(valid()).xTokens).toEqual({
    light: { '--x-fg-primary': 'text' },
    night: { '--x-fg-primary': 'text' },
  });
});

test('rejects missing xTokens', () => {
  const { xTokens: _xTokens, ...rest } = valid();
  expect(() => parsePaletteMap(rest)).toThrow(PaletteMapError);
});

test('rejects an xTokens name that is not an X token', () => {
  const bad = { ...valid(), xTokens: { light: { '--other': 'text' }, night: {} } };
  expect(() => parsePaletteMap(bad)).toThrow(PaletteMapError);
});

test('rejects an unknown xTokens theme', () => {
  const bad = { ...valid(), xTokens: { light: {}, night: {}, dim: {} } };
  expect(() => parsePaletteMap(bad)).toThrow(PaletteMapError);
});

test('returns a valid map with normalized color keys', () => {
  const map = parsePaletteMap(valid());
  expect(map.version).toBe(1);
  expect(map.light.color).toEqual({ 'rgb(29, 155, 240)': 'accent' });
  expect(map.light['border-color']).toEqual({ 'rgb(239, 243, 244)': 'border' });
  expect(map.night['background-color']).toEqual({ 'rgb(0, 0, 0)': 'bg-card' });
  expect(map['font-family']).toEqual({ TwitterChirp: 'font' });
  expect(map['font-size']).toEqual({ '15px': 'fs-body' });
  expect(map['border-radius']).toEqual({ '9999px': 'radius-pill' });
});

test('rejects an unknown top-level field', () => {
  expect(() => parsePaletteMap({ ...valid(), extra: {} })).toThrow(PaletteMapError);
});

test('rejects a missing version', () => {
  const { version: _version, ...rest } = valid();
  expect(() => parsePaletteMap(rest)).toThrow(PaletteMapError);
});

test('rejects a non-string token', () => {
  const bad = valid();
  (bad.light.color as Record<string, unknown>)['rgb(1, 2, 3)'] = 5;
  expect(() => parsePaletteMap(bad)).toThrow(PaletteMapError);
});

test('rejects an unknown property under a theme', () => {
  const bad = { ...valid(), light: { ...valid().light, fill: { 'rgb(1, 2, 3)': 'text' } } };
  expect(() => parsePaletteMap(bad)).toThrow(PaletteMapError);
});

test('rejects a color key that is not a color', () => {
  const bad = { ...valid(), light: { color: { 'var(--x)': 'text' } } };
  expect(() => parsePaletteMap(bad)).toThrow(PaletteMapError);
});

test('rejects a non-object input', () => {
  expect(() => parsePaletteMap(null)).toThrow(PaletteMapError);
  expect(() => parsePaletteMap('x')).toThrow(PaletteMapError);
});

test('the bundled palette map parses', () => {
  expect(() => parsePaletteMap(paletteMapJson)).not.toThrow();
});
