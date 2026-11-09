import { PALETTE_MISS_THRESHOLD, type FeatureId } from '../config';
import type { PaletteMap, Theme } from '../engine/palette-map';

export type FeatureStatus = 'ok' | 'warn' | 'error' | 'off' | 'unavailable';

export interface HealthSnapshot {
  features: Partial<Record<FeatureId, { status: FeatureStatus; detail?: string }>>;
  paletteMisses: string[];
  sheets: { readable: number; unreadable: number };
  errors: { feature: FeatureId | 'core'; message: string }[];
}

export interface Health {
  setFeature(id: FeatureId, status: FeatureStatus, detail?: string): void;
  error(feature: FeatureId | 'core', err: unknown): void;
  setSheets(s: { readable: number; unreadable: number }): void;
  /**
   * Counts consecutive page loads each palette entry of `theme` went unmatched; returns entries at
   * the threshold. Pages with fewer than MIN_RULES scanned rules (login flows, sparse pages) are skipped.
   */
  recordPalette(theme: Theme, matched: ReadonlySet<string>, map: PaletteMap, readableRules: number): Promise<string[]>;
  snapshot(): HealthSnapshot;
  level(): 'ok' | 'warn' | 'error';
}

export interface HealthStore {
  get(k: string): Promise<unknown>;
  set(k: string, v: unknown): Promise<void>;
}

const MISSES_KEY = 'ot:paletteMisses';
const MIN_RULES = 500;

export function createHealth(store: HealthStore): Health {
  const state: HealthSnapshot = { features: {}, paletteMisses: [], sheets: { readable: 0, unreadable: 0 }, errors: [] };

  return {
    setFeature(id, status, detail) {
      state.features[id] = detail === undefined ? { status } : { status, detail };
    },
    error(feature, err) {
      state.errors.push({ feature, message: err instanceof Error ? err.message : String(err) });
    },
    setSheets(s) {
      state.sheets = { ...s };
    },
    async recordPalette(theme, matched, map, readableRules) {
      if (readableRules < MIN_RULES) return [];
      const storeKey = `${MISSES_KEY}:${theme}`;
      const counts = { ...((await store.get(storeKey)) as Record<string, number> | undefined) };
      const misses: string[] = [];
      for (const [property, entries] of Object.entries(map[theme])) {
        for (const token of new Set(Object.values(entries ?? {}))) {
          const key = `${theme}:${property}:${token}`;
          counts[key] = matched.has(key) ? 0 : (counts[key] ?? 0) + 1;
          if (counts[key]! >= PALETTE_MISS_THRESHOLD) misses.push(key);
        }
      }
      await store.set(storeKey, counts);
      state.paletteMisses = misses;
      return misses;
    },
    snapshot() {
      return structuredClone(state);
    },
    level() {
      const statuses = Object.values(state.features).map((f) => f.status);
      const noReadableSheets = state.sheets.unreadable > 0 && state.sheets.readable === 0;
      if (state.errors.length > 0 || statuses.includes('error') || noReadableSheets) return 'error';
      if (statuses.includes('warn') || state.paletteMisses.length > 0) return 'warn';
      return 'ok';
    },
  };
}
