import { createHealth } from '../../src/core/health';
import { parsePaletteMap } from '../../src/engine/palette-map';

const map = parsePaletteMap({
  version: 1,
  light: { color: { 'rgb(29, 155, 240)': 'accent', 'rgb(15, 20, 25)': 'text' } },
  night: { color: { 'rgb(231, 233, 234)': 'text' } },
  'font-family': {},
  'font-size': {},
  'border-radius': {},
  xTokens: { light: {}, night: {} },
});

function memoryStore() {
  const data = new Map<string, unknown>();
  return {
    get: async (k: string) => data.get(k),
    set: async (k: string, v: unknown) => void data.set(k, v),
  };
}

test('a key unmatched on three consecutive loads is reported on the third', async () => {
  const store = memoryStore();
  const matched = new Set(['light:color:text']);
  expect(await createHealth(store).recordPalette('light', matched, map, 1000)).toEqual([]);
  expect(await createHealth(store).recordPalette('light', matched, map, 1000)).toEqual([]);
  const third = createHealth(store);
  expect(await third.recordPalette('light', matched, map, 1000)).toEqual(['light:color:accent']);
  expect(third.snapshot().paletteMisses).toEqual(['light:color:accent']);
});

test('one match in between resets the counter', async () => {
  const store = memoryStore();
  const none = new Set<string>();
  await createHealth(store).recordPalette('light', none, map, 1000);
  await createHealth(store).recordPalette('light', new Set(['light:color:accent', 'light:color:text']), map, 1000);
  await createHealth(store).recordPalette('light', none, map, 1000);
  expect(await createHealth(store).recordPalette('light', none, map, 1000)).toEqual([]);
});

test('keys of the other theme are not counted', async () => {
  const store = memoryStore();
  const all = new Set(['light:color:accent', 'light:color:text']);
  for (let i = 0; i < 3; i++) expect(await createHealth(store).recordPalette('light', all, map, 1000)).toEqual([]);
});

test('level is error for any error or when no stylesheet is readable', () => {
  const h = createHealth(memoryStore());
  h.setSheets({ readable: 0, unreadable: 2 });
  expect(h.level()).toBe('error');
  const h2 = createHealth(memoryStore());
  h2.error('core', new Error('boom'));
  expect(h2.level()).toBe('error');
  expect(h2.snapshot().errors).toEqual([{ feature: 'core', message: 'boom' }]);
});

test('level is warn for a warning feature', () => {
  const h = createHealth(memoryStore());
  h.setFeature('branding', 'warn', 'sideNavLogo bulunamadı');
  expect(h.level()).toBe('warn');
  expect(h.snapshot().features.branding).toEqual({ status: 'warn', detail: 'sideNavLogo bulunamadı' });
});

test('a feature reported ok with optional anchors missing keeps level ok', () => {
  const h = createHealth(memoryStore());
  h.setSheets({ readable: 1, unreadable: 1 });
  h.setFeature('surfaces', 'ok');
  expect(h.level()).toBe('ok');
});


test('sparse pages are not counted', async () => {
  const store = memoryStore();
  for (let i = 0; i < 3; i++) expect(await createHealth(store).recordPalette('light', new Set(), map, 20)).toEqual([]);
  expect(await store.get('ot:paletteMisses:light')).toBeUndefined();
});

test('misses are stored per theme', async () => {
  const store = memoryStore();
  await createHealth(store).recordPalette('light', new Set(), map, 1000);
  expect(await store.get('ot:paletteMisses:light')).toEqual({ 'light:color:accent': 1, 'light:color:text': 1 });
  expect(await store.get('ot:paletteMisses:night')).toBeUndefined();
});
