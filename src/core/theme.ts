import { normalizeColor } from '../engine/color';
import type { Theme } from '../engine/palette-map';

/**
 * Reads the theme from the background X writes inline on <body>. The computed
 * color is not used: the surfaces feature repaints the body, so it would
 * report our own color back.
 */
export function detectTheme(body: HTMLElement): Theme | null {
  const color = normalizeColor(body.style.backgroundColor);
  if (color === null) return null;
  return color === 'rgb(255, 255, 255)' ? 'light' : 'night';
}

/** Calls `cb` whenever the detected theme changes; returns a stop function. */
export function watchTheme(body: HTMLElement, cb: (t: Theme) => void): () => void {
  let last = detectTheme(body);
  const observer = new MutationObserver(() => {
    const next = detectTheme(body);
    if (next !== null && next !== last) {
      last = next;
      cb(next);
    }
  });
  observer.observe(body, { attributes: true, attributeFilter: ['style'] });
  return () => observer.disconnect();
}
