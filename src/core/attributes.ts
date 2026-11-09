import { ALL_FEATURES, type FeatureId } from '../config';
import type { Theme } from '../engine/palette-map';
import type { Settings } from './settings';

/**
 * Writes era, theme and one `data-ot-f-<id>` per feature that is both active
 * (its anchors were found) and switched on; removes the rest.
 */
export function applyHtmlAttributes(html: HTMLElement, s: Settings, theme: Theme, active: ReadonlySet<FeatureId>): void {
  html.setAttribute('data-ot-era', s.era);
  html.setAttribute('data-ot-theme', theme);
  for (const id of ALL_FEATURES) {
    const name = `data-ot-f-${id}`;
    if (active.has(id) && s.features[id]) html.setAttribute(name, '');
    else html.removeAttribute(name);
  }
}

export function clearHtmlAttributes(html: HTMLElement): void {
  for (const name of html.getAttributeNames()) {
    if (name.startsWith('data-ot-')) html.removeAttribute(name);
  }
}
