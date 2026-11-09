import { buildReport, type ReportMeta } from '../../src/core/report';
import type { HealthSnapshot } from '../../src/core/health';

const snapshot: HealthSnapshot = {
  features: { branding: { status: 'warn', detail: 'sideNavLogo bulunamadı' } },
  paletteMisses: ['light:color:accent'],
  sheets: { readable: 1, unreadable: 0 },
  errors: [],
};

const meta: ReportMeta = {
  extensionVersion: '0.1.0',
  paletteMapVersion: 1,
  xBuild: 'abc123',
  lang: 'tr',
  theme: 'light',
  era: '2017',
  pageType: 'profile',
};

test('the report carries meta and health but no location', () => {
  history.pushState({}, '', '/jack');
  const text = buildReport(snapshot, meta);
  const parsed = JSON.parse(text);
  expect(parsed.meta).toEqual(meta);
  expect(parsed.health).toEqual(snapshot);
  expect(text).not.toContain('/jack');
  expect(text).not.toMatch(/pathname|href|location/);
  expect(text).toBe(JSON.stringify({ meta, health: snapshot }, null, 2));
});
