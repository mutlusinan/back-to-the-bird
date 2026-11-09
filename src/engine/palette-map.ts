import { normalizeColor } from './color';

export type Theme = 'light' | 'night';
export type ColorProperty = 'color' | 'background-color' | 'border-color';

export interface PaletteMap {
  version: number;
  /** Normalized color → token name. */
  light: Partial<Record<ColorProperty, Record<string, string>>>;
  night: Partial<Record<ColorProperty, Record<string, string>>>;
  /** Substring searched for inside the declared value → token name. */
  'font-family': Record<string, string>;
  'font-size': Record<string, string>;
  'border-radius': Record<string, string>;
  /** X design token name (`--x-…`) → token name, per theme. */
  xTokens: Record<Theme, Record<string, string>>;
}

export class PaletteMapError extends Error {}

const COLOR_PROPERTIES: readonly ColorProperty[] = ['color', 'background-color', 'border-color'];
const TOP_LEVEL = ['version', 'light', 'night', 'font-family', 'font-size', 'border-radius', 'xTokens'];
const THEMES: readonly Theme[] = ['light', 'night'];

/** Validates an untrusted palette map and normalizes its color keys. */
export function parsePaletteMap(json: unknown): PaletteMap {
  const root = asRecord(json, 'palette map');
  for (const key of Object.keys(root)) {
    if (!TOP_LEVEL.includes(key)) throw new PaletteMapError(`unknown field: ${key}`);
  }
  if (typeof root.version !== 'number' || !Number.isInteger(root.version) || root.version < 1) {
    throw new PaletteMapError('version must be a positive integer');
  }
  return {
    version: root.version,
    light: parseTheme(root.light, 'light'),
    night: parseTheme(root.night, 'night'),
    'font-family': parseTokens(root['font-family'], 'font-family'),
    'font-size': parseTokens(root['font-size'], 'font-size'),
    'border-radius': parseTokens(root['border-radius'], 'border-radius'),
    xTokens: parseXTokens(root.xTokens),
  };
}

function parseXTokens(value: unknown): PaletteMap['xTokens'] {
  const themes = asRecord(value, 'xTokens');
  for (const key of Object.keys(themes)) {
    if (!THEMES.includes(key as Theme)) throw new PaletteMapError(`unknown theme: xTokens.${key}`);
  }
  const out = {} as PaletteMap['xTokens'];
  for (const theme of THEMES) {
    const tokens = parseTokens(themes[theme], `xTokens.${theme}`);
    for (const name of Object.keys(tokens)) {
      if (!/^--x-[a-z0-9-]+$/.test(name)) throw new PaletteMapError(`not an X token: xTokens.${theme}.${name}`);
    }
    out[theme] = tokens;
  }
  return out;
}

function parseTheme(value: unknown, path: string): PaletteMap['light'] {
  const theme = asRecord(value, path);
  const out: PaletteMap['light'] = {};
  for (const [property, entries] of Object.entries(theme)) {
    if (!COLOR_PROPERTIES.includes(property as ColorProperty)) {
      throw new PaletteMapError(`unknown property ${path}.${property}`);
    }
    const tokens: Record<string, string> = {};
    for (const [color, token] of Object.entries(parseTokens(entries, `${path}.${property}`))) {
      const normalized = normalizeColor(color);
      if (normalized === null) throw new PaletteMapError(`not a color: ${path}.${property}.${color}`);
      tokens[normalized] = token;
    }
    out[property as ColorProperty] = tokens;
  }
  return out;
}

function parseTokens(value: unknown, path: string): Record<string, string> {
  const record = asRecord(value, path);
  for (const [key, token] of Object.entries(record)) {
    if (typeof token !== 'string' || !/^[a-z0-9-]+$/.test(token)) {
      throw new PaletteMapError(`invalid token at ${path}.${key}`);
    }
  }
  return record as Record<string, string>;
}

function asRecord(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new PaletteMapError(`${path} must be an object`);
  }
  return value as Record<string, unknown>;
}
