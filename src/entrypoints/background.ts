import { browser } from 'wxt/browser';
import { createCssInjector } from '../core/css-injector';
import type { ToBackground } from '../core/messages';

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
      void injector.handle(tabId, sender.frameId ?? 0, message.css).then(sendResponse);
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
});
