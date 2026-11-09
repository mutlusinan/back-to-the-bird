// Development-only preview: runs the extension's real engine and DOM features
// in a page without extension APIs (CSS goes into a <style data-ot>). Built by
// tools/preview/vite.config.ts; used by the visual tests and for live checks.
import { ALL_FEATURES, IMPLEMENTED_FEATURES, type Era, type FeatureId } from '../../src/config';
import { applyHtmlAttributes, clearHtmlAttributes } from '../../src/core/attributes';
import { createHealth } from '../../src/core/health';
import { parseSelectorTable } from '../../src/core/selectors';
import type { Settings } from '../../src/core/settings';
import { detectTheme } from '../../src/core/theme';
import paletteMapJson from '../../src/data/palette-map.json';
import selectorsJson from '../../src/data/selectors.json';
import { createEngine } from '../../src/engine';
import { parsePaletteMap } from '../../src/engine/palette-map';
import type { EngineFeature } from '../../src/engine/remap';
import { SheetScanner } from '../../src/engine/scan';
import { DOM_FEATURES, runFeatures } from '../../src/features/registry';
import { wordingCss } from '../../src/wording/css';
import { wordingTableFor } from '../../src/wording/tables';

const ENGINE_FEATURES: readonly EngineFeature[] = ['palette', 'font', 'typeScale', 'radius'];
const map = parsePaletteMap(paletteMapJson);
const table = parseSelectorTable(selectorsJson);
const scanner = new SheetScanner(document);
let style: HTMLStyleElement | undefined;
const engine = createEngine({
  map,
  scan: () => scanner.scanNew(),
  applyCss: async (css) => {
    style ??= Object.assign(document.createElement('style'), { textContent: '' });
    style.setAttribute('data-ot', 'engine');
    document.head.append(style);
    style.textContent = css;
  },
  cache: { get: async () => undefined, set: async () => {} },
  now: () => performance.now(),
  budgetMs: 1_000,
  features: new Set(ENGINE_FEATURES),
});

export async function run(staticCss: string, opts: { era?: Era } = {}) {
  let base = document.querySelector<HTMLStyleElement>('style[data-ot="static"]');
  if (!base) {
    base = document.createElement('style');
    base.setAttribute('data-ot', 'static');
    document.head.append(base);
  }
  base.textContent = staticCss;
  const settings: Settings = {
    era: opts.era ?? '2017',
    features: Object.fromEntries(ALL_FEATURES.map((id) => [id, true])) as Record<FeatureId, boolean>,
  };
  const health = createHealth({ get: async () => undefined, set: async () => {} });
  const theme = detectTheme(document.body) ?? 'light';
  const domActive = runFeatures({ table, doc: document, health }, new Set(DOM_FEATURES.map((f) => f.id)));
  const engineActive = IMPLEMENTED_FEATURES.filter((id) => (ENGINE_FEATURES as readonly string[]).includes(id));
  applyHtmlAttributes(document.documentElement, settings, theme, new Set<FeatureId>([...engineActive, ...domActive]));
  let words = document.querySelector<HTMLStyleElement>('style[data-ot="wording"]');
  if (!words) {
    words = document.createElement('style');
    words.setAttribute('data-ot', 'wording');
    document.head.append(words);
  }
  const wordTable = wordingTableFor(document.documentElement.lang);
  words.textContent = domActive.has('wording') && wordTable ? wordingCss(wordTable) : '';
  while (await engine.tick());
  return { theme, active: [...domActive], health: health.snapshot(), cssChars: style?.textContent?.length ?? 0, matched: [...engine.matchedKeys()] };
}

export function off() {
  clearHtmlAttributes(document.documentElement);
}
