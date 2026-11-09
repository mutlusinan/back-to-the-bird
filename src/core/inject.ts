import type { ToBackground } from './messages';

/** True for the error an orphaned content script gets after the extension is reloaded or updated. */
export function isDeadContext(err: unknown): boolean {
  return /context invalidated/i.test(err instanceof Error ? err.message : String(err));
}

/**
 * Content side of CSS injection. Prefers the background's scripting.insertCSS
 * (unaffected by the page's CSP) and names the CSS each message replaces; if
 * the background refuses, switches for good to one <style data-ot> element.
 * A dead extension context is not a refusal: the browser has already removed
 * our stylesheets, so `onDead` lets the caller hand the page back to X.
 */
export function createInjector(
  doc: Document,
  send: (m: ToBackground) => Promise<{ ok: boolean } | undefined>,
  onDead: () => void = () => {},
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
      } catch (err) {
        if (isDeadContext(err)) {
          onDead();
          return;
        }
      }
      fallback = doc.createElement('style');
      fallback.setAttribute('data-ot', '');
      (doc.head ?? doc.documentElement).appendChild(fallback);
    }
    fallback.textContent = css;
  };
}
