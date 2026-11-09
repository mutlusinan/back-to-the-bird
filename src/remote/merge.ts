import type { FeatureId } from '../config';
import { ANCHOR_NAMES, type SelectorTable } from '../core/selectors';
import type { PaletteMap } from '../engine/palette-map';
import type { WordingTable } from '../wording/table';
import type { RemoteData } from './schema';

export interface BuiltInData {
  table: SelectorTable;
  map: PaletteMap;
  wording: ReadonlyMap<string, WordingTable>;
}

/** The data a page runs with: built-in data, overlaid by valid remote data if there is any. */
export interface DataSet extends BuiltInData {
  disabled: ReadonlySet<FeatureId>;
  source: 'built-in' | 'remote';
  dataVersion: string | null;
}

export function mergeData(builtIn: BuiltInData, remote: RemoteData | null): DataSet {
  if (!remote) return { ...builtIn, disabled: new Set(), source: 'built-in', dataVersion: null };
  const table = {} as SelectorTable;
  for (const name of ANCHOR_NAMES) table[name] = [...new Set([...(remote.selectors[name] ?? []), ...builtIn.table[name]])];
  const wording = new Map(builtIn.wording);
  for (const [lang, words] of Object.entries(remote.wording)) wording.set(lang, words);
  return {
    table,
    map: remote.paletteMap ?? builtIn.map,
    wording,
    disabled: new Set(remote.disabledFeatures),
    source: 'remote',
    dataVersion: remote.dataVersion,
  };
}
