export interface CssApi {
  insertCSS(t: { tabId: number; frameId: number; css: string }): Promise<void>;
  removeCSS(t: { tabId: number; frameId: number; css: string }): Promise<void>;
}

/**
 * Background side of CSS injection: keeps one inserted stylesheet per frame and
 * replaces it when the content script sends a new one. Calls for one frame are
 * serialized so a remove never races the insert it follows.
 */
export function createCssInjector(api: CssApi): {
  handle(tabId: number, frameId: number, css: string): Promise<{ ok: boolean }>;
  forget(tabId: number): void;
} {
  const current = new Map<string, string>();
  const chains = new Map<string, Promise<unknown>>();

  return {
    handle(tabId, frameId, css) {
      const key = `${tabId}:${frameId}`;
      const run = async (): Promise<{ ok: boolean }> => {
        const previous = current.get(key);
        if (previous !== undefined) {
          current.delete(key);
          await api.removeCSS({ tabId, frameId, css: previous }).catch(() => {});
        }
        try {
          await api.insertCSS({ tabId, frameId, css });
          current.set(key, css);
          return { ok: true };
        } catch {
          return { ok: false };
        }
      };
      const result = (chains.get(key) ?? Promise.resolve()).then(run);
      chains.set(key, result);
      return result;
    },
    forget(tabId) {
      for (const key of [...current.keys(), ...chains.keys()]) {
        if (key.startsWith(`${tabId}:`)) {
          current.delete(key);
          chains.delete(key);
        }
      }
    },
  };
}
