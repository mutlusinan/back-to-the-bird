import { createHealth } from '../../src/core/health';
import { parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';
import { DOM_FEATURES, runFeatures } from '../../src/features/registry';

test('a switched-off feature is cleaned up once, not on every call', () => {
  const branding = DOM_FEATURES.find((f) => f.id === 'branding')!;
  const spy = vi.spyOn(branding, 'cleanup');
  const ctx = { table: parseSelectorTable(selectorsJson), doc: document, health: createHealth({ get: async () => undefined, set: async () => undefined }) };
  runFeatures(ctx, new Set());
  runFeatures(ctx, new Set());
  expect(spy).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});
