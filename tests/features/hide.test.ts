import { readFileSync } from 'node:fs';
import { createHealth } from '../../src/core/health';
import { findAll, parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';
import { runFeatures } from '../../src/features/registry';
import type { FeatureId } from '../../src/config';

const css = () => readFileSync('src/features/hide/style.css', 'utf8');
const table = () => parseSelectorTable(selectorsJson);
const ids = (name: Parameters<typeof findAll>[1]) => findAll(table(), name, document).map((e) => e.id);

test('each hide feature removes its anchors with display none', () => {
  expect(css()).toContain(
    'html[data-ot-f-hideGrok] :is([data-ot~="grokNav"],[data-ot~="grokDrawer"],[data-ot~="grokTweetButton"]){display:none !important}',
  );
  expect(css()).toContain('html[data-ot-f-hidePremium] :is([data-ot~="premiumNav"],[data-ot~="premiumSidebar"]){display:none !important}');
  expect(css()).toContain('html[data-ot-f-hideViewCounts] div:has(> [data-ot~="viewCount"]){display:none !important}');
});

test('the tweet Grok button is found by structure, not by its translated label', () => {
  document.body.innerHTML =
    '<article><div><div><button id="grok" aria-label="Grok eylemleri"></button></div><div><button data-testid="caret" id="caret"></button></div></div></article>';
  expect(ids('grokTweetButton')).toEqual(['grok']);
});

test('Premium, Grok nav and view count anchors are found', () => {
  document.body.innerHTML = `
    <header role="banner"><nav><a href="/i/grok" id="gn"></a></nav></header>
    <div data-testid="premium-signup-tab" id="pn"></div>
    <div data-testid="sidebarColumn"><aside id="ps"><a href="/i/premium_sign_up"></a></aside><aside id="other"></aside></div>
    <article><div role="group"><div><a href="/user/status/1/analytics" id="vc"></a></div></div></article>`;
  expect(ids('grokNav')).toEqual(['gn']);
  expect(ids('premiumNav')).toEqual(['pn']);
  expect(ids('premiumSidebar')).toEqual(['ps']);
  expect(ids('viewCount')).toEqual(['vc']);
});

test('hide features are active even when nothing is there to hide', () => {
  document.body.innerHTML = '';
  const health = createHealth({ get: async () => undefined, set: async () => undefined });
  const active = runFeatures(
    { table: table(), doc: document, health },
    new Set<FeatureId>(['hideGrok', 'hidePremium', 'hideViewCounts']),
  );
  expect([...active].sort()).toEqual(['hideGrok', 'hidePremium', 'hideViewCounts']);
});
