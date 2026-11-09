import type { FeatureId } from '../../src/config';
import { createHealth } from '../../src/core/health';
import { parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';
import { runFeatures } from '../../src/features/registry';
import { wordingTableFor } from '../../src/wording/tables';

const run = () => {
  const health = createHealth({ get: async () => undefined, set: async () => undefined });
  const active = runFeatures({ table: parseSelectorTable(selectorsJson), doc: document, health }, new Set<FeatureId>(['wording']));
  return { active, state: health.snapshot().features.wording };
};

afterEach(() => document.documentElement.removeAttribute('lang'));

test('an interface language without a table leaves X’s words and says which language', () => {
  document.documentElement.lang = 'xx';
  const { active, state } = run();
  expect(active.has('wording')).toBe(false);
  expect(state).toEqual({ status: 'unavailable', detail: 'xx' });
});

test('a supported interface language turns wording on, whatever its region subtag', () => {
  document.documentElement.lang = 'en-GB';
  const { active, state } = run();
  expect(active.has('wording')).toBe(true);
  expect(state).toEqual({ status: 'ok' });
});

test('tables are looked up by normalized language', () => {
  expect(wordingTableFor('EN')).not.toBeNull();
  expect(wordingTableFor('xx')).toBeNull();
  expect(wordingTableFor('')).toBeNull();
});
