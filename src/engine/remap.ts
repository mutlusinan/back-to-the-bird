import { normalizeColor } from './color';
import type { ColorProperty, PaletteMap, Theme } from './palette-map';

export interface RuleLike {
  selectorText: string;
  style: { getPropertyValue(p: string): string };
  /** Condition text of the enclosing @media rule, if any. */
  media?: string;
}

export type EngineFeature = 'palette' | 'font' | 'typeScale' | 'radius';

export interface RemapEntry {
  feature: EngineFeature;
  theme: Theme | null;
  selector: string;
  property: string;
  token: string;
  media?: string;
  /** The palette-map entry that matched, e.g. "light:color:accent" or "font-family:font". */
  key: string;
}

const THEMES: readonly Theme[] = ['light', 'night'];

/** Every CSS property inspected for colors, with the palette-map table it uses. */
export const COLOR_PROPERTIES: readonly (readonly [string, ColorProperty])[] = [
  ['color', 'color'],
  ['background-color', 'background-color'],
  ...[
    'border-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
    'border-block-start-color', 'border-block-end-color', 'border-inline-start-color', 'border-inline-end-color',
  ].map((p) => [p, 'border-color'] as const),
];

const RADIUS_PROPERTIES = [
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-right-radius', 'border-bottom-left-radius',
];

/** Lists the token substitutions one stylesheet rule needs. */
export function remapRule(rule: RuleLike, map: PaletteMap): RemapEntry[] {
  const entries: RemapEntry[] = [];
  const push = (e: Omit<RemapEntry, 'selector' | 'media'>) =>
    entries.push(rule.media === undefined ? { ...e, selector: rule.selectorText } : { ...e, selector: rule.selectorText, media: rule.media });

  for (const theme of THEMES) {
    for (const [property, table] of COLOR_PROPERTIES) {
      const color = normalizeColor(rule.style.getPropertyValue(property));
      const token = color === null ? undefined : map[theme][table]?.[color];
      if (token) push({ feature: 'palette', theme, property, token, key: `${theme}:${table}:${token}` });
    }
  }

  const family = rule.style.getPropertyValue('font-family');
  const familyMatch = family && Object.entries(map['font-family']).find(([needle]) => family.includes(needle));
  if (familyMatch) push({ feature: 'font', theme: null, property: 'font-family', token: familyMatch[1], key: `font-family:${familyMatch[1]}` });

  const size = map['font-size'][rule.style.getPropertyValue('font-size').trim()];
  if (size) push({ feature: 'typeScale', theme: null, property: 'font-size', token: size, key: `font-size:${size}` });

  for (const property of RADIUS_PROPERTIES) {
    const token = map['border-radius'][rule.style.getPropertyValue(property).trim()];
    if (token) push({ feature: 'radius', theme: null, property, token, key: `border-radius:${token}` });
  }
  return entries;
}

/** Renders entries as CSS, scoped by feature (and theme for colors), grouped by @media. */
export function renderOverrides(entries: Iterable<RemapEntry>): string {
  const seen = new Set<string>();
  const plain: string[] = [];
  const byMedia = new Map<string, string[]>();
  for (const e of entries) {
    const id = `${e.feature}|${e.theme}|${e.media ?? ''}|${e.selector}|${e.property}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const scope = scopeFor(e.feature, e.theme);
    const selectors = splitSelectors(e.selector).map((part) => `${scope} ${part}`).join(',');
    const line = `${selectors}{${e.property}:var(--ot-${e.token})}`;
    if (e.media === undefined) plain.push(line);
    else byMedia.set(e.media, [...(byMedia.get(e.media) ?? []), line]);
  }
  const media = [...byMedia].map(([condition, lines]) => `@media ${condition}{${lines.join('')}}`);
  return [...plain, ...media].join('\n');
}

export function scopeFor(feature: EngineFeature, theme: Theme | null): string {
  return feature === 'palette' ? `html[data-ot-f-palette][data-ot-theme="${theme}"]` : `html[data-ot-f-${feature}]`;
}

/** Splits a selector list on top-level commas (not those inside :is(), :not(), attribute values). */
function splitSelectors(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote = '';
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    if (quote) {
      if (ch === quote) quote = '';
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(list.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(list.slice(start).trim());
  return parts.filter(Boolean);
}
