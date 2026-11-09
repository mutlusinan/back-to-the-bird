import { readFileSync } from 'node:fs';
const surfacesCss = readFileSync('src/features/surfaces/style.css', 'utf8');
import { createHealth } from '../../src/core/health';
import { parseSelectorTable } from '../../src/core/selectors';
import { runFeatures } from '../../src/features/registry';
import selectorsJson from '../../src/data/selectors.json';
import type { FeatureId } from '../../src/config';

const store = { get: async () => undefined, set: async () => undefined };

test('surfaces is active and ok with none of its optional anchors', () => {
  document.body.innerHTML = '';
  const health = createHealth(store);
  const active = runFeatures(
    { table: parseSelectorTable(selectorsJson), doc: document, health },
    new Set<FeatureId>(['surfaces']),
  );
  expect(active.has('surfaces')).toBe(true);
  expect(health.snapshot().features.surfaces).toEqual({ status: 'ok' });
  expect(health.level()).toBe('ok');
});

test('surfaces paints the page and cards through tokens', () => {
  // X writes the page color inline on <body>; the engine's inline-color rule for that value is
  // `html[…][…] [style^=…]` (0,3,1). `:is(body,#ot-page)` lifts the body rule to (1,1,2) so the page
  // color wins (found in the live check: the body showed the card color).
  expect(surfacesCss).toContain('html[data-ot-f-surfaces] body:is(body,#ot-page){background-color:var(--ot-bg-page) !important}');
  expect(surfacesCss).toContain('html[data-ot-f-surfaces] [data-ot~="primaryColumn"]');
  expect(surfacesCss).toContain('html[data-ot-f-surfaces] [data-ot~="sidebarBox"]');
  expect(surfacesCss).toContain('background-color:var(--ot-bg-card)');
  expect(surfacesCss).toContain('var(--ot-border)');
});

test('surfaces uses no physical direction properties', () => {
  expect(surfacesCss).not.toMatch(/\b(left|right)\b/);
});
