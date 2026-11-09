import { browser } from 'wxt/browser';
import { createCssInjector } from '../core/css-injector';
import type { ToBackground } from '../core/messages';
import { refreshRemote } from '../remote/fetch';
import { ensureRemoteAlarm, REMOTE_ALARM } from '../remote/schedule';

const BADGE_COLORS = { warn: '#FFAD1F', error: '#E0245E' } as const;

export default defineBackground(() => {
  const injector = createCssInjector({
    insertCSS: ({ tabId, frameId, css }) =>
      browser.scripting.insertCSS({ target: { tabId, frameIds: [frameId] }, css, origin: 'AUTHOR' }),
    removeCSS: ({ tabId, frameId, css }) =>
      browser.scripting.removeCSS({ target: { tabId, frameIds: [frameId] }, css, origin: 'AUTHOR' }),
  });

  browser.runtime.onMessage.addListener((message: ToBackground, sender, sendResponse) => {
    const tabId = sender.tab?.id;
    if (tabId === undefined) return undefined;
    if (message?.type === 'ot:css') {
      void injector.handle(tabId, sender.frameId ?? 0, message.css, message.previous).then(sendResponse);
      return true; // keeps sendResponse alive for the async reply
    }
    if (message?.type === 'ot:badge') {
      const text = message.level === 'ok' ? '' : '!';
      void browser.action.setBadgeText({ tabId, text });
      if (message.level !== 'ok') {
        void browser.action.setBadgeBackgroundColor({ tabId, color: BADGE_COLORS[message.level] });
      }
    }
    return undefined;
  });

  browser.tabs.onRemoved.addListener((tabId) => injector.forget(tabId));

  // Remote data (spec §12): on install, on browser start and once a day. Failures keep the stored data.
  const refresh = () =>
    void refreshRemote({
      fetch: (url, init) => fetch(url, init),
      store: {
        get: async (k) => (await browser.storage.local.get(k))[k],
        set: (k, v) => browser.storage.local.set({ [k]: v }),
      },
      now: Date.now,
      version: browser.runtime.getManifest().version,
    });
  browser.runtime.onInstalled.addListener(refresh);
  browser.runtime.onStartup.addListener(refresh);
  browser.alarms.onAlarm.addListener((alarm) => alarm.name === REMOTE_ALARM && refresh());
  void ensureRemoteAlarm(browser.alarms);
});
