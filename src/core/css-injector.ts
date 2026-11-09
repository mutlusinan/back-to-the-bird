export interface CssApi {
  insertCSS(t: { tabId: number; frameId: number; css: string }): Promise<void>;
  removeCSS(t: { tabId: number; frameId: number; css: string }): Promise<void>;
}

/**
 * Background side of CSS injection. Holds no stylesheet state: the content
 * script names the CSS it replaces (`previous`), so an MV3 service-worker
 * restart cannot leave stale sheets behind. Calls for one frame are serialized
 * so a remove never races the insert it follows.
 */
export function createCssInjector(api: CssApi): {
  handle(tabId: number, frameId: number, css: string, previous?: string): Promise<{ ok: boolean }>;
  forget(tabId: number): void;
} {
  const chains = new Map<string, Promise<unknown>>();

  return {
    handle(tabId, frameId, css, previous) {
      const key = `${tabId}:${frameId}`;
      const run = async (): Promise<{ ok: boolean }> => {
        if (previous !== undefined) await api.removeCSS({ tabId, frameId, css: previous }).catch(() => {});
        try {
          await api.insertCSS({ tabId, frameId, css });
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
      for (const key of [...chains.keys()]) if (key.startsWith(`${tabId}:`)) chains.delete(key);
    },
  };
}
