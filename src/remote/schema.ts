import { ALL_FEATURES, REMOTE_MAX_BYTES, type FeatureId } from '../config';
import { ANCHOR_NAMES, usableSelectors, type AnchorName } from '../core/selectors';
import { parsePaletteMap, type PaletteMap } from '../engine/palette-map';
import { parseWordingTable, type WordingTable } from '../wording/table';
import { compareVersions, isVersion } from './version';

/** Data the extension can receive without a new release (spec §12). */
export interface RemoteData {
  schemaVersion: 1;
  dataVersion: string;
  minExtensionVersion: string;
  maxExtensionVersion: string | null;
  /** Extra selectors per anchor, tried before the built-in ones. */
  selectors: Partial<Record<AnchorName, string[]>>;
  /** A complete palette map replacing the built-in one, or null. */
  paletteMap: PaletteMap | null;
  /** Complete tables by language code, replacing or adding languages. */
  wording: Record<string, WordingTable>;
  /** Features switched off regardless of the user's settings. */
  disabledFeatures: FeatureId[];
}

export class RemoteError extends Error {}

const FIELDS = [
  'schemaVersion',
  'dataVersion',
  'minExtensionVersion',
  'maxExtensionVersion',
  'selectors',
  'paletteMap',
  'wording',
  'disabledFeatures',
] as const;
const DATA_VERSION = /^\d{4}-\d{2}-\d{2}\.\d+$/;
const LANG = /^[a-z]{2,3}(-[a-z]{2})?$/;

/**
 * Validates the raw file. Anything off — size, JSON, an unknown or missing field, a version
 * range that excludes this extension, a bad table — rejects the whole file (built-in data is
 * used). Selector texts are only ever handed to querySelector; nothing in the file is run.
 */
export function parseRemote(text: string, extensionVersion: string): RemoteData {
  if (new TextEncoder().encode(text).length > REMOTE_MAX_BYTES) throw new RemoteError('remote data is over 256 KB');
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new RemoteError('remote data is not JSON');
  }
  const obj = record(raw, 'remote data');
  for (const key of Object.keys(obj)) {
    if (!(FIELDS as readonly string[]).includes(key)) throw new RemoteError(`unknown field: ${key}`);
  }
  for (const key of FIELDS) if (!(key in obj)) throw new RemoteError(`missing field: ${key}`);

  if (obj.schemaVersion !== 1) throw new RemoteError('unsupported schemaVersion');
  if (typeof obj.dataVersion !== 'string' || !DATA_VERSION.test(obj.dataVersion)) throw new RemoteError('bad dataVersion');
  if (!isVersion(obj.minExtensionVersion)) throw new RemoteError('bad minExtensionVersion');
  if (obj.maxExtensionVersion !== null && !isVersion(obj.maxExtensionVersion)) throw new RemoteError('bad maxExtensionVersion');
  if (compareVersions(extensionVersion, obj.minExtensionVersion) < 0) throw new RemoteError('extension older than the data');
  if (obj.maxExtensionVersion !== null && compareVersions(extensionVersion, obj.maxExtensionVersion) > 0) {
    throw new RemoteError('extension newer than the data');
  }

  const selectors: Partial<Record<AnchorName, string[]>> = {};
  for (const [name, list] of Object.entries(record(obj.selectors, 'selectors'))) {
    if (!(ANCHOR_NAMES as readonly string[]).includes(name)) throw new RemoteError(`unknown anchor: ${name}`);
    selectors[name as AnchorName] = wrap(() => usableSelectors(name, list));
  }

  const paletteMap = obj.paletteMap === null ? null : wrap(() => parsePaletteMap(obj.paletteMap));

  const wording: Record<string, WordingTable> = {};
  for (const [lang, table] of Object.entries(record(obj.wording, 'wording'))) {
    if (!LANG.test(lang)) throw new RemoteError(`bad language code: ${lang}`);
    wording[lang] = wrap(() => parseWordingTable(table, lang));
  }

  if (!Array.isArray(obj.disabledFeatures)) throw new RemoteError('disabledFeatures must be a list');
  for (const id of obj.disabledFeatures) {
    if (!(ALL_FEATURES as readonly unknown[]).includes(id)) throw new RemoteError(`unknown feature: ${String(id)}`);
  }

  return {
    schemaVersion: 1,
    dataVersion: obj.dataVersion,
    minExtensionVersion: obj.minExtensionVersion,
    maxExtensionVersion: obj.maxExtensionVersion,
    selectors,
    paletteMap,
    wording,
    disabledFeatures: [...(obj.disabledFeatures as FeatureId[])],
  };
}

function record(value: unknown, what: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new RemoteError(`${what} must be an object`);
  return value as Record<string, unknown>;
}

function wrap<T>(parse: () => T): T {
  try {
    return parse();
  } catch (err) {
    throw new RemoteError(err instanceof Error ? err.message : String(err));
  }
}
