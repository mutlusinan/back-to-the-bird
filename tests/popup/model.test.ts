import { DEFAULT_SETTINGS } from '../../src/core/settings';
import type { HealthResponse } from '../../src/core/messages';
import { eraOptions, healthRows, showEraSelector, toggleRows, withEra, withFeature } from '../../src/entrypoints/popup/model';

const response = (over: Partial<HealthResponse['snapshot']> = {}): HealthResponse => ({
  snapshot: { features: {}, paletteMisses: [], sheets: { readable: 1, unreadable: 0 }, errors: [], ...over },
  meta: { extensionVersion: '0.1.0', paletteMapVersion: 1, xBuild: null, lang: 'en', theme: 'light', era: '2017', pageType: 'home' },
});

test('toggle rows list the implemented features in order', () => {
  expect(toggleRows(DEFAULT_SETTINGS)).toEqual([
    { id: 'palette', labelKey: 'featurePalette', checked: true },
    { id: 'font', labelKey: 'featureFont', checked: true },
    { id: 'surfaces', labelKey: 'featureSurfaces', checked: true },
    { id: 'branding', labelKey: 'featureBranding', checked: true },
  ]);
});

test('withFeature returns a new settings object', () => {
  const next = withFeature(DEFAULT_SETTINGS, 'font', false);
  expect(next.features.font).toBe(false);
  expect(DEFAULT_SETTINGS.features.font).toBe(true);
  expect(next).not.toBe(DEFAULT_SETTINGS);
});

test('no response means the tab is not x.com', () => {
  expect(healthRows(null)).toEqual([{ labelKey: 'notOnX', status: 'n/a' }]);
});

test('a feature with an error carries the message', () => {
  const rows = healthRows(response({ errors: [{ feature: 'branding', message: 'boom' }] }));
  expect(rows.find((r) => r.labelKey === 'featureBranding')).toEqual({ labelKey: 'featureBranding', status: 'error', detail: 'boom' });
});

test('a warning feature carries its detail and others default to ok', () => {
  const rows = healthRows(response({ features: { branding: { status: 'warn', detail: 'sideNavLogo' } } }));
  expect(rows.find((r) => r.labelKey === 'featureBranding')).toEqual({ labelKey: 'featureBranding', status: 'warn', detail: 'sideNavLogo' });
  expect(rows.find((r) => r.labelKey === 'featurePalette')).toEqual({ labelKey: 'featurePalette', status: 'ok' });
});

test('palette misses make the palette row warn', () => {
  const rows = healthRows(response({ paletteMisses: ['light:color:accent'] }));
  expect(rows.find((r) => r.labelKey === 'featurePalette')).toEqual({ labelKey: 'featurePalette', status: 'warn', detail: 'light:color:accent' });
});

test('the era selector is shown once two eras exist', () => {
  expect(showEraSelector()).toBe(true);
});

test('era options mark the current era', () => {
  expect(eraOptions(DEFAULT_SETTINGS)).toEqual([
    { era: '2014', labelKey: 'era2014', selected: false },
    { era: '2017', labelKey: 'era2017', selected: true },
  ]);
});

test('withEra returns a new settings object', () => {
  const next = withEra(DEFAULT_SETTINGS, '2014');
  expect(next.era).toBe('2014');
  expect(DEFAULT_SETTINGS.era).toBe('2017');
});

test('the first row reports the style engine itself', () => {
  expect(healthRows(response())[0]).toEqual({ labelKey: 'coreStatus', status: 'ok' });
});

test('a core error shows on the engine row', () => {
  expect(healthRows(response({ errors: [{ feature: 'core', message: 'bad data' }] }))[0]).toEqual({
    labelKey: 'coreStatus',
    status: 'error',
    detail: 'bad data',
  });
});

test('unreadable stylesheets show on the engine row', () => {
  expect(healthRows(response({ sheets: { readable: 0, unreadable: 2 } }))[0]).toEqual({
    labelKey: 'coreStatus',
    status: 'error',
    detail: 'unreadableSheets',
  });
});
