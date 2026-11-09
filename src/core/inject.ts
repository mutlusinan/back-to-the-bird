import type { ToBackground } from './messages';

/**
 * Content side of CSS injection. Prefers the background's scripting.insertCSS
 * (unaffected by the page's CSP) and names the CSS each message replaces; if
 * the background refuses, switches for good to one <style data-ot> element.
 */
export function createInjector(
  doc: Document,
  send: (m: ToBackground) => Promise<{ ok: boolean } | undefined>,
): (css: string) => Promise<void> {
  let fallback: HTMLStyleElement | undefined;
  let inserted: string | undefined;

  return async (css) => {
    if (!fallback) {
      try {
        const message: ToBackground = inserted === undefined ? { type: 'ot:css', css } : { type: 'ot:css', css, previous: inserted };
        const response = await send(message);
        if (response?.ok) {
          inserted = css;
          return;
        }
      } catch {
        // background unavailable
      }
      fallback = doc.createElement('style');
      fallback.setAttribute('data-ot', '');
      (doc.head ?? doc.documentElement).appendChild(fallback);
    }
    fallback.textContent = css;
  };
}
