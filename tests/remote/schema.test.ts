import paletteMapJson from '../../src/data/palette-map.json';
import { compareVersions } from '../../src/remote/version';
import { parseRemote } from '../../src/remote/schema';
import { WORDING_KEYS } from '../../src/wording/keys';

const words = (over: Record<string, unknown> = {}) => ({ ...Object.fromEntries(WORDING_KEYS.map((k) => [k, null])), ...over });

const valid = (over: Record<string, unknown> = {}) => ({
  schemaVersion: 1,
  dataVersion: '2026-11-09.1',
  minExtensionVersion: '1.0.0',
  maxExtensionVersion: null,
  selectors: { primaryColumn: ['main[data-new]'] },
  paletteMap: null,
  wording: { tr: words({ composeButton: 'Tweetle' }) },
  disabledFeatures: ['hideGrok'],
  ...over,
});
const text = (over: Record<string, unknown> = {}) => JSON.stringify(valid(over));

test('versions compare by their numeric parts', () => {
  expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  expect(compareVersions('1.2.0', '1.10.0')).toBe(-1);
  expect(compareVersions('2.0.0', '1.99.99')).toBe(1);
  expect(() => compareVersions('1.0', '1.0.0')).toThrow();
});

test('a valid file is accepted as is', () => {
  const data = parseRemote(text(), '1.0.0');
  expect(data.selectors).toEqual({ primaryColumn: ['main[data-new]'] });
  expect(data.wording.tr?.composeButton).toBe('Tweetle');
  expect(data.disabledFeatures).toEqual(['hideGrok']);
  expect(data.paletteMap).toBeNull();
});

test('a full palette map is accepted', () => {
  expect(parseRemote(text({ paletteMap: paletteMapJson }), '1.0.0').paletteMap?.version).toBe(paletteMapJson.version);
});

test('a remote selector this browser cannot parse is dropped, not the file', () => {
  expect(parseRemote(text({ selectors: { primaryColumn: ['div[[', 'main'] } }), '1.0.0').selectors.primaryColumn).toEqual(['main']);
});

test.each([
  ['broken JSON', () => '{"schemaVersion": 1,'],
  ['an unknown field', () => text({ script: 'alert(1)' })],
  ['a missing field', () => JSON.stringify((({ disabledFeatures: _d, ...rest }) => rest)(valid()))],
  ['another schema version', () => text({ schemaVersion: 2 })],
  ['an extension too old for the data', () => text({ minExtensionVersion: '1.0.1' })],
  ['an extension too new for the data', () => text({ minExtensionVersion: '0.9.0', maxExtensionVersion: '0.9.9' })],
  ['a bad data version', () => text({ dataVersion: 'latest' })],
  ['an unknown anchor', () => text({ selectors: { somethingElse: ['div'] } })],
  ['a selector that is not a string', () => text({ selectors: { primaryColumn: [1] } })],
  ['a bad palette map', () => text({ paletteMap: { version: 'x' } })],
  ['a bad language code', () => text({ wording: { 'not a lang': words() } })],
  ['a wording table missing a key', () => text({ wording: { tr: { composeButton: 'Tweet' } } })],
  ['a word with a line break', () => text({ wording: { tr: words({ composeButton: 'a\nb' }) } })],
  ['an unknown feature to disable', () => text({ disabledFeatures: ['everything'] })],
])('rejects %s', (_name, make) => {
  expect(() => parseRemote(make(), '1.0.0')).toThrow();
});

test('a file over 256 KB is rejected even when it is otherwise valid', () => {
  const padded = (n: number) => text({ selectors: { primaryColumn: [`main${' '.repeat(n)}`] } });
  expect(() => parseRemote(padded(1_000), '1.0.0')).not.toThrow();
  expect(() => parseRemote(padded(262_144), '1.0.0')).toThrow(/256/);
});
