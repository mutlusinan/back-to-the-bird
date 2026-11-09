import type { ToBackground } from './messages';

/**
 * Content side of CSS injection. Prefers the background's scripting.insertCSS
 * (unaffected by the page's CSP); if that is refused or the extension context
 * is gone, switches for good to one <style data-ot> element.
 */
export function createInjector(
  doc: Document,
  send: (m: ToBackground) => Promise<{ ok: boolean } | undefined>,
): (css: string) => Promise<void> {
  let fallback: HTMLStyleElement | undefined;

  return async (css) => {
    if (!fallback) {
      try {
        const response = await send({ type: 'ot:css', css });
        if (response?.ok) return;
      } catch {
        // extension reloaded or background unavailable
      }
      fallback = doc.createElement('style');
      fallback.setAttribute('data-ot', '');
      (doc.head ?? doc.documentElement).appendChild(fallback);
    }
    fallback.textContent = css;
  };
}
