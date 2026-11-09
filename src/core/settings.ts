import { browser } from 'wxt/browser';
import { ALL_FEATURES, AVAILABLE_ERAS, type Era, type FeatureId } from '../config';

export interface Settings {
  era: Era;
  features: Record<FeatureId, boolean>;
}

const KEY = 'ot:settings';

export const DEFAULT_SETTINGS: Settings = {
  era: '2017',
  features: Object.fromEntries(ALL_FEATURES.map((id) => [id, true])) as Record<FeatureId, boolean>,
};

export async function loadSettings(): Promise<Settings> {
  const stored = await browser.storage.sync.get(KEY);
  return sanitize(stored[KEY]);
}

export async function saveSettings(s: Settings): Promise<void> {
  await browser.storage.sync.set({ [KEY]: s });
}

export function watchSettings(cb: (s: Settings) => void): () => void {
  const listener = (changes: Record<string, { newValue?: unknown }>, area: string) => {
    if (area === 'sync' && KEY in changes) cb(sanitize(changes[KEY]!.newValue));
  };
  browser.storage.onChanged.addListener(listener);
  return () => browser.storage.onChanged.removeListener(listener);
}

/** Merges an untrusted stored value over the defaults. */
function sanitize(value: unknown): Settings {
  const stored = (typeof value === 'object' && value !== null ? value : {}) as Partial<Record<string, unknown>>;
  const era = AVAILABLE_ERAS.includes(stored.era as Era) ? (stored.era as Era) : DEFAULT_SETTINGS.era;
  const features = { ...DEFAULT_SETTINGS.features };
  const storedFeatures = (typeof stored.features === 'object' && stored.features !== null ? stored.features : {}) as Record<string, unknown>;
  for (const id of ALL_FEATURES) {
    if (typeof storedFeatures[id] === 'boolean') features[id] = storedFeatures[id] as boolean;
  }
  return { era, features };
}
