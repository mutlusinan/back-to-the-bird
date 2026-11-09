import { AVAILABLE_ERAS, IMPLEMENTED_FEATURES, type Era, type FeatureId } from '../../config';
import type { FeatureStatus } from '../../core/health';
import type { HealthResponse } from '../../core/messages';
import type { Settings } from '../../core/settings';

export interface ToggleRow {
  id: FeatureId;
  labelKey: string;
  checked: boolean;
}

export interface HealthRow {
  labelKey: string;
  status: FeatureStatus | 'n/a';
  detail?: string;
}

const labelKey = (id: FeatureId) => `feature${id[0]!.toUpperCase()}${id.slice(1)}`;

export function toggleRows(s: Settings): ToggleRow[] {
  return IMPLEMENTED_FEATURES.map((id) => ({ id, labelKey: labelKey(id), checked: s.features[id] }));
}

export function withFeature(s: Settings, id: FeatureId, on: boolean): Settings {
  return { ...s, features: { ...s.features, [id]: on } };
}

export interface EraOption {
  era: Era;
  labelKey: string;
  selected: boolean;
}

export function eraOptions(s: Settings): EraOption[] {
  return AVAILABLE_ERAS.map((era) => ({ era, labelKey: `era${era}`, selected: s.era === era }));
}

export function withEra(s: Settings, era: Era): Settings {
  return { ...s, era };
}

/** The style engine itself: errors outside any feature, or no readable stylesheet at all. */
function coreRow(r: HealthResponse): HealthRow {
  const error = r.snapshot.errors.find((e) => e.feature === 'core');
  if (error) return { labelKey: 'coreStatus', status: 'error', detail: error.message };
  const { readable, unreadable } = r.snapshot.sheets;
  if (unreadable > 0 && readable === 0) return { labelKey: 'coreStatus', status: 'error', detail: 'unreadableSheets' };
  return { labelKey: 'coreStatus', status: 'ok' };
}

/** The engine row, then one row per implemented feature; null means the active tab is not x.com. */
export function healthRows(r: HealthResponse | null): HealthRow[] {
  if (r === null) return [{ labelKey: 'notOnX', status: 'n/a' }];
  return [coreRow(r), ...featureRows(r)];
}

function featureRows(r: HealthResponse): HealthRow[] {
  return IMPLEMENTED_FEATURES.map((id): HealthRow => {
    const error = r.snapshot.errors.find((e) => e.feature === id);
    if (error) return { labelKey: labelKey(id), status: 'error', detail: error.message };
    const state = r.snapshot.features[id];
    if (state && state.status !== 'ok') {
      return state.detail === undefined ? { labelKey: labelKey(id), status: state.status } : { labelKey: labelKey(id), ...state };
    }
    if (id === 'palette' && r.snapshot.paletteMisses.length > 0) {
      return { labelKey: labelKey(id), status: 'warn', detail: r.snapshot.paletteMisses.join(', ') };
    }
    return { labelKey: labelKey(id), status: 'ok' };
  });
}

export function showEraSelector(): boolean {
  return AVAILABLE_ERAS.length > 1;
}
