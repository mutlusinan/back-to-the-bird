import { parseSelectorTable } from '../../src/core/selectors';
import paletteMapJson from '../../src/data/palette-map.json';
import selectorsJson from '../../src/data/selectors.json';
import { parsePaletteMap } from '../../src/engine/palette-map';
import { mergeData } from '../../src/remote/merge';
import type { RemoteData } from '../../src/remote/schema';
import { WORDING_KEYS } from '../../src/wording/keys';
import type { WordingTable } from '../../src/wording/table';

const words = (over: Partial<WordingTable> = {}) => ({ ...Object.fromEntries(WORDING_KEYS.map((k) => [k, null])), ...over }) as WordingTable;
const builtIn = () => ({
  table: parseSelectorTable(selectorsJson),
  map: parsePaletteMap(paletteMapJson),
  wording: new Map([['en', words({ composeButton: 'Tweet' })], ['tr', words({ composeButton: 'Tweet' })]]),
});
const remote = (over: Partial<RemoteData> = {}): RemoteData => ({
  schemaVersion: 1,
  dataVersion: '2026-11-10.1',
  minExtensionVersion: '1.0.0',
  maxExtensionVersion: null,
  selectors: {},
  paletteMap: null,
  wording: {},
  disabledFeatures: [],
  ...over,
});

test('without remote data the built-in data is used and says so', () => {
  const data = mergeData(builtIn(), null);
  expect(data.source).toBe('built-in');
  expect(data.dataVersion).toBeNull();
  expect(data.table).toEqual(builtIn().table);
  expect(data.disabled.size).toBe(0);
});

test('remote selectors are tried before the built-in ones of the same anchor', () => {
  const data = mergeData(builtIn(), remote({ selectors: { primaryColumn: ['main[data-new]'] } }));
  expect(data.table.primaryColumn).toEqual(['main[data-new]', ...builtIn().table.primaryColumn]);
  expect(data.table.sidebarColumn).toEqual(builtIn().table.sidebarColumn);
  expect(data.source).toBe('remote');
  expect(data.dataVersion).toBe('2026-11-10.1');
});

test('a remote palette map replaces the built-in one', () => {
  const map = { ...parsePaletteMap(paletteMapJson), version: 99 };
  expect(mergeData(builtIn(), remote({ paletteMap: map })).map.version).toBe(99);
});

test('remote wording replaces one language and adds new ones', () => {
  const data = mergeData(builtIn(), remote({ wording: { tr: words({ composeButton: 'Tweetle' }), nl: words({ repostAction: 'Retweeten' }) } }));
  expect(data.wording.get('tr')?.composeButton).toBe('Tweetle');
  expect(data.wording.get('en')?.composeButton).toBe('Tweet');
  expect(data.wording.get('nl')?.repostAction).toBe('Retweeten');
});

test('remotely disabled features are listed', () => {
  expect([...mergeData(builtIn(), remote({ disabledFeatures: ['icons'] })).disabled]).toEqual(['icons']);
});
