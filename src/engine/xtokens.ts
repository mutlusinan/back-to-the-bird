import type { PaletteMap, Theme } from './palette-map';

const THEMES: readonly Theme[] = ['light', 'night'];
const FONT_TOKEN = 'font';

/**
 * Re-points X's own design tokens (`--x-…` on <html>) at ours. Color tokens are
 * scoped by theme under the palette feature; the font token is theme-independent
 * and belongs to the font feature.
 */
export function renderXTokenOverrides(map: PaletteMap): string {
  const lines: string[] = [];
  const fontDone = new Set<string>();
  for (const theme of THEMES) {
    const colors: string[] = [];
    const fonts: string[] = [];
    for (const [name, token] of Object.entries(map.xTokens[theme])) {
      if (token === FONT_TOKEN) {
        if (!fontDone.has(name)) fonts.push(`${name}:var(--ot-${token})`);
        fontDone.add(name);
      } else {
        colors.push(`${name}:var(--ot-${token})`);
      }
    }
    if (colors.length > 0) lines.push(`html[data-ot-f-palette][data-ot-theme="${theme}"]{${colors.join(';')}}`);
    if (fonts.length > 0) lines.push(`html[data-ot-f-font]{${fonts.join(';')}}`);
  }
  return lines.join('\n');
}

/** Names in the current theme's table that X no longer defines. */
export function missingXTokens(map: PaletteMap, theme: Theme, read: (name: string) => string): string[] {
  return Object.keys(map.xTokens[theme]).filter((name) => read(name).trim() === '');
}
