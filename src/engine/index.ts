import { renderInlineOverrides } from './inline';
import type { PaletteMap } from './palette-map';
import { remapRule, renderOverrides, type EngineFeature, type RemapEntry, type RuleLike } from './remap';
import type { ScanResult } from './scan';
import { renderXTokenOverrides } from './xtokens';

export interface EngineDeps {
  map: PaletteMap;
  scan: () => ScanResult;
  applyCss: (css: string) => Promise<void>;
  cache: { get(key: string): Promise<string | undefined>; set(key: string, v: string): Promise<void> };
  now: () => number;
  budgetMs: number;
  /** Engine features that are implemented; entries of other features are not generated. */
  features: ReadonlySet<EngineFeature>;
}

export interface Engine {
  /** Applies the CSS cached by an earlier page load, before any scanning. */
  start(): Promise<void>;
  /** Processes new rules within the time budget; true when work remains. */
  tick(): Promise<boolean>;
  matchedKeys(): ReadonlySet<string>;
  sheetStats(): { readable: number; unreadable: number };
}

const BUDGET_CHECK_EVERY = 100;

export function createEngine(deps: EngineDeps): Engine {
  const cacheKey = `ot:engineCss:v${deps.map.version}`;
  const base = [renderXTokenOverrides(deps.map), renderInlineOverrides(deps.map)].filter(Boolean).join('\n');
  const entries = new Map<string, RemapEntry>();
  const matched = new Set<string>();
  const queue: RuleLike[] = [];
  let stats = { readable: 0, unreadable: 0 };
  let applied: string | undefined;
  let rendered = false;

  async function apply(css: string): Promise<void> {
    if (css === applied) return;
    await deps.applyCss(css);
    applied = css;
    await deps.cache.set(cacheKey, css);
  }

  return {
    async start() {
      const cached = await deps.cache.get(cacheKey);
      if (cached === undefined) return;
      await deps.applyCss(cached);
      applied = cached;
    },

    async tick() {
      const scanned = deps.scan();
      stats = { readable: scanned.readable, unreadable: scanned.unreadable };
      queue.push(...scanned.rules);
      // Most ticks (scrolling) bring no new rules: skip the render entirely.
      if (queue.length === 0 && rendered) return false;
      const started = deps.now();
      let processed = 0;
      while (queue.length > 0) {
        for (const entry of remapRule(queue.shift()!, deps.map)) {
          if (!deps.features.has(entry.feature)) continue;
          entries.set(`${entry.feature}|${entry.theme}|${entry.media ?? ''}|${entry.selector}|${entry.property}`, entry);
          matched.add(entry.key);
        }
        if (++processed % BUDGET_CHECK_EVERY === 0 && deps.now() - started >= deps.budgetMs) break;
      }
      rendered = true;
      const overrides = renderOverrides(entries.values());
      await apply(overrides ? `${base}\n${overrides}` : base);
      return queue.length > 0;
    },

    matchedKeys: () => matched,
    sheetStats: () => stats,
  };
}
