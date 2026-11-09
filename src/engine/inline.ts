import type { PaletteMap, Theme } from './palette-map';
import { COLOR_PROPERTIES, scopeFor } from './remap';

const THEMES: readonly Theme[] = ['light', 'night'];

/**
 * Overrides colors X writes in `style` attributes. Matching is by attribute
 * text, so each property is matched only at the start of the attribute or
 * after "; " — never as the tail of a longer name (`background-color` must not
 * match a `color` rule). Inline styles can only be beaten with !important.
 */
export function renderInlineOverrides(map: PaletteMap): string {
  const lines: string[] = [];
  for (const theme of THEMES) {
    const scope = scopeFor('palette', theme);
    for (const [property, table] of COLOR_PROPERTIES) {
      for (const [color, token] of Object.entries(map[theme][table] ?? {})) {
        const declaration = `${property}: ${color}`;
        lines.push(
          `${scope} [style^="${declaration}"],${scope} [style*="; ${declaration}"]` +
            `{${property}:var(--ot-${token}) !important}`,
        );
      }
    }
  }
  return lines.join('\n');
}
