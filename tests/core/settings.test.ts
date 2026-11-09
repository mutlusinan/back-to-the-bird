import { fakeBrowser } from 'wxt/testing/fake-browser';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, watchSettings } from '../../src/core/settings';

beforeEach(() => fakeBrowser.reset());

test('defaults when nothing is stored', async () => {
  expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  expect(DEFAULT_SETTINGS.era).toBe('2017');
  expect(Object.values(DEFAULT_SETTINGS.features).every(Boolean)).toBe(true);
});

test('stored values merge over defaults and unknown features are dropped', async () => {
  await fakeBrowser.storage.sync.set({ 'ot:settings': { era: '2017', features: { branding: false, unknown: true } } });
  const s = await loadSettings();
  expect(s.features.branding).toBe(false);
  expect(s.features.palette).toBe(true);
  expect('unknown' in s.features).toBe(false);
});

test('an unknown era falls back to 2017', async () => {
  await fakeBrowser.storage.sync.set({ 'ot:settings': { era: '1999', features: {} } });
  expect((await loadSettings()).era).toBe('2017');
});

test('watchSettings reports saved settings', async () => {
  const seen: boolean[] = [];
  const stop = watchSettings((s) => seen.push(s.features.font));
  await saveSettings({ ...DEFAULT_SETTINGS, features: { ...DEFAULT_SETTINGS.features, font: false } });
  stop();
  expect(seen).toEqual([false]);
});

test('a stored 2014 era is kept', async () => {
  await fakeBrowser.storage.sync.set({ 'ot:settings': { era: '2014', features: {} } });
  expect((await loadSettings()).era).toBe('2014');
});
