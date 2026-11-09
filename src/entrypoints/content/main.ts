import { browser } from 'wxt/browser';
import { ENGINE_BUDGET_MS, IMPLEMENTED_FEATURES, type FeatureId } from '../../config';
import { applyHtmlAttributes, clearHtmlAttributes } from '../../core/attributes';
import { createHealth, type Health, type HealthStore } from '../../core/health';
import { createInjector } from '../../core/inject';
import { SHOW_ORIGINAL_PORT, type HealthResponse, type ToBackground } from '../../core/messages';
import { classifyRoute } from '../../core/route';
import { takeSnapshot } from '../../core/snapshot';
import { createScheduler } from '../../core/scheduler';
import { parseSelectorTable, type SelectorTable } from '../../core/selectors';
import { loadSettings, watchSettings, type Settings } from '../../core/settings';
import { detectTheme, watchTheme } from '../../core/theme';
import paletteMapJson from '../../data/palette-map.json';
import selectorsJson from '../../data/selectors.json';
import { createEngine, type Engine } from '../../engine';
import { parsePaletteMap, type PaletteMap, type Theme } from '../../engine/palette-map';
import type { EngineFeature } from '../../engine/remap';
import { SheetScanner } from '../../engine/scan';
import { missingXTokens } from '../../engine/xtokens';
import { retagElement, tagAdded } from '../../core/anchors';
import { removeFavicon } from '../../features/branding/favicon';
import { DOM_FEATURES, runFeatures } from '../../features/registry';

const ENGINE_FEATURES: readonly FeatureId[] = ['palette', 'font', 'typeScale', 'radius'];
const LAST_THEME_KEY = 'ot:lastTheme';
const HEALTH_DELAY_MS = 10_000;
const DOM_ANCHORS = [...new Set(DOM_FEATURES.flatMap((f) => [...f.requires, ...f.optional]))];

/** Minimal port surface the "show original" handler needs. */
export interface PortLike {
  name: string;
  onMessage: { addListener(cb: (m: unknown) => void): void };
  onDisconnect: { addListener(cb: () => void): void };
}

export interface ContentController {
  stop(): void;
  /** True while the popup's "show original" is held. */
  setShowOriginal(hold: boolean): void;
}

const localStore: HealthStore & { get(k: string): Promise<unknown> } = {
  get: async (k) => (await browser.storage.local.get(k))[k],
  set: async (k, v) => browser.storage.local.set({ [k]: v }),
};

/** Wires a popup port to the controller; letting go or closing the popup restores the skin. */
export function attachShowOriginalPort(port: PortLike, set: (hold: boolean) => void): void {
  port.onMessage.addListener((m) => set(Boolean((m as { hold?: unknown } | null)?.hold)));
  port.onDisconnect.addListener(() => set(false));
}

/**
 * Content script entry. The top frame runs everything; subframes (X's chat
 * iframe) run only the engine features, so they never report missing anchors.
 */
export async function main({
  doc,
  win,
  graceMs = HEALTH_DELAY_MS,
}: {
  doc: Document;
  win: Window;
  /** Startup period in which X is still rendering: no badge and no palette verdict yet. */
  graceMs?: number;
}): Promise<ContentController> {
  const isTop = win.top === win;
  const frameKind = isTop ? 'top' : 'sub';
  const html = doc.documentElement;
  const health = createHealth(localStore);
  const cleanups: (() => void)[] = [];
  const noop: ContentController = { stop: () => {}, setShowOriginal: () => {} };

  let map: PaletteMap;
  let table: SelectorTable;
  let settings: Settings;
  let theme: Theme;
  try {
    map = parsePaletteMap(paletteMapJson);
    table = parseSelectorTable(selectorsJson);
    const [loaded, lastTheme] = await Promise.all([loadSettings(), localStore.get(LAST_THEME_KEY)]);
    settings = loaded;
    theme = (doc.body && detectTheme(doc.body)) ?? (lastTheme === 'night' ? 'night' : 'light');
  } catch (err) {
    health.error('core', err);
    return noop; // bad data or a dead extension context: leave X untouched
  }

  let domActive: ReadonlySet<FeatureId> = new Set();
  let showingOriginal = false;
  let stopped = false;

  const enabled = (): Set<FeatureId> => new Set(IMPLEMENTED_FEATURES.filter((id) => settings.features[id]));
  const active = (): Set<FeatureId> =>
    new Set([...IMPLEMENTED_FEATURES.filter((id) => ENGINE_FEATURES.includes(id)), ...domActive]);
  const applyAttributes = () => {
    if (!showingOriginal && !stopped) applyHtmlAttributes(html, settings, theme, active());
  };
  const send = async (m: ToBackground) => (await browser.runtime.sendMessage(m)) as { ok: boolean } | undefined;
  const sendQuietly = (m: ToBackground) => void send(m).catch(() => {});
  const stopAll = () => {
    stopped = true;
    for (const cleanup of cleanups.splice(0)) cleanup();
  };
  // The extension was reloaded or updated: the browser already dropped our stylesheets,
  // so remove everything else of ours and leave the page exactly as X draws it.
  const handOver = () => {
    if (stopped) return;
    stopAll();
    clearHtmlAttributes(html);
    for (const el of doc.querySelectorAll('style[data-ot]')) el.remove();
    if (doc.head) removeFavicon(doc.head);
  };

  applyAttributes();

  const scanner = new SheetScanner(doc);
  const engine = createEngine({
    map,
    scan: () => scanner.scanNew(),
    applyCss: createInjector(doc, send, handOver),
    // Frames see different rule sets (X's chat iframe vs the page); one shared key would let
    // the iframe's CSS be the page's startup CSS after visiting Messages.
    cache: {
      get: async (k) => {
        const v = await localStore.get(`${k}:${frameKind}`).catch(() => undefined);
        return typeof v === 'string' ? v : undefined;
      },
      set: (k, v) => localStore.set(`${k}:${frameKind}`, v).catch(() => {}),
    },
    now: () => performance.now(),
    budgetMs: ENGINE_BUDGET_MS,
    features: new Set(IMPLEMENTED_FEATURES.filter((id) => ENGINE_FEATURES.includes(id)) as EngineFeature[]),
  });
  await engine.start().catch((err) => health.error('core', err));

  const setTheme = (next: Theme) => {
    if (next === theme) return;
    theme = next;
    applyAttributes();
    void localStore.set(LAST_THEME_KEY, next).catch(() => {});
  };
  const bindTheme = () => {
    const detected = detectTheme(doc.body);
    if (detected) setTheme(detected);
    cleanups.push(watchTheme(doc.body, setTheme));
  };
  if (doc.body) bindTheme();
  else {
    const waitBody = new MutationObserver(() => {
      if (!doc.body) return;
      waitBody.disconnect();
      bindTheme();
    });
    waitBody.observe(html, { childList: true });
    cleanups.push(() => waitBody.disconnect());
  }

  let lastLevel: string | undefined;
  let graceOver = false;
  let featuresDirty = true;
  const scheduler = createScheduler({
    root: html,
    onTick: async ({ added, changed, routeChanged }) => {
      if (!browser.runtime?.id) {
        handOver();
        return false;
      }
      if (isTop) {
        // Document-wide pass only when the page or settings changed; otherwise just tag
        // anchors inside the new elements, and re-run features if one of them can now start.
        let rerun = featuresDirty || routeChanged;
        if (!rerun && (added.length > 0 || changed.length > 0)) {
          const found = tagAdded(table, DOM_ANCHORS, added);
          for (const el of changed) for (const name of retagElement(table, DOM_ANCHORS, el)) found.add(name);
          const on = enabled();
          rerun = DOM_FEATURES.some((f) => on.has(f.id) && !domActive.has(f.id) && f.requires.some((a) => found.has(a)));
        }
        if (rerun) {
          featuresDirty = false;
          domActive = runFeatures({ table, doc, health }, enabled());
          applyAttributes();
        }
      }
      let more = false;
      try {
        more = await engine.tick();
      } catch (err) {
        health.error('core', err);
      }
      health.setSheets(engine.sheetStats());
      if (isTop && graceOver) {
        const level = health.level();
        if (level !== lastLevel) {
          lastLevel = level;
          sendQuietly({ type: 'ot:badge', level });
        }
      }
      return more;
    },
  });
  scheduler.start();
  scheduler.poke();
  cleanups.push(() => scheduler.stop());

  cleanups.push(
    watchSettings((next) => {
      settings = next;
      featuresDirty = true;
      applyAttributes();
      scheduler.poke();
    }),
  );

  const setShowOriginal = (hold: boolean) => {
    showingOriginal = hold;
    if (hold) {
      clearHtmlAttributes(html);
      if (doc.head) removeFavicon(doc.head);
    } else {
      if (isTop) domActive = runFeatures({ table, doc, health }, enabled());
      applyAttributes();
    }
  };

  if (isTop) {
    const timer = setTimeout(() => {
      graceOver = true;
      void checkPalette(health, engine, map, theme, html).then(() => scheduler.poke());
    }, graceMs);
    cleanups.push(() => clearTimeout(timer));

    // sendResponse rather than a returned Promise: Chrome does not honour promise returns here.
    const onMessage = (m: unknown, _sender: unknown, sendResponse: (r: HealthResponse | string) => void) => {
      const type = (m as { type?: string } | null)?.type;
      if (type === 'ot:getHealth') sendResponse(healthResponse(health, map, settings, theme, doc));
      // Development builds only: fixture capture for tests (personal data removed).
      else if (type === 'ot:snapshot' && import.meta.env.DEV) sendResponse(takeSnapshot(doc));
      return undefined;
    };
    const onConnect = (port: PortLike) => {
      if (port.name === SHOW_ORIGINAL_PORT) attachShowOriginalPort(port, setShowOriginal);
    };
    try {
      browser.runtime.onMessage.addListener(onMessage);
      browser.runtime.onConnect.addListener(onConnect as never);
      cleanups.push(() => {
        browser.runtime.onMessage.removeListener(onMessage);
        browser.runtime.onConnect.removeListener(onConnect as never);
      });
    } catch {
      // not available (tests or a dead extension context)
    }
  }

  return { stop: stopAll, setShowOriginal };
}

async function checkPalette(health: Health, engine: Engine, map: PaletteMap, theme: Theme, html: HTMLElement) {
  await health.recordPalette(theme, engine.matchedKeys(), map, engine.sheetStats().rules).catch(() => []);
  const missing = missingXTokens(map, theme, (name) => getComputedStyle(html).getPropertyValue(name));
  if (missing.length > 0) health.setFeature('palette', 'warn', missing.join(', '));
}

function healthResponse(health: Health, map: PaletteMap, settings: Settings, theme: Theme, doc: Document): HealthResponse {
  const main = doc.querySelector<HTMLScriptElement>('script[src*="/main."]');
  const build = main ? /main\.([a-z0-9]+)\.js/.exec(main.src) : null;
  return {
    snapshot: health.snapshot(),
    meta: {
      extensionVersion: browser.runtime.getManifest().version,
      paletteMapVersion: map.version,
      xBuild: build?.[1] ?? null,
      lang: doc.documentElement.lang,
      theme,
      era: settings.era,
      pageType: classifyRoute(doc.location.pathname),
    },
  };
}
