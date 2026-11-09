import { fakeBrowser } from 'wxt/testing/fake-browser';
import { DEFAULT_SETTINGS, saveSettings } from '../../src/core/settings';
import type { ToBackground } from '../../src/core/messages';
import { main } from '../../src/entrypoints/content/main';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const html = () => document.documentElement;
let sent: ToBackground[];
let running: { stop(): void } | undefined;

beforeEach(() => {
  fakeBrowser.reset();
  sent = [];
  vi.spyOn(fakeBrowser.runtime, 'sendMessage').mockImplementation((async (m: ToBackground) => {
    sent.push(m);
    return { ok: true };
  }) as never);
  for (const name of html().getAttributeNames()) if (name.startsWith('data-ot')) html().removeAttribute(name);
  document.head.innerHTML = '<style>.r-a{color:rgba(29,155,240,1.00)}</style>';
  document.body.setAttribute('style', 'background-color: #FFFFFF');
  document.body.innerHTML =
    '<header role="banner"><h1><a href="/home"><svg></svg></a></h1></header><div data-testid="primaryColumn"></div>';
});

afterEach(() => {
  running?.stop();
  running = undefined;
  vi.restoreAllMocks();
});

test('sets era, theme and feature attributes and sends the engine css', async () => {
  running = await main({ doc: document, win: window });
  await sleep(80);
  expect(html().getAttribute('data-ot-era')).toBe('2017');
  expect(html().getAttribute('data-ot-theme')).toBe('light');
  for (const id of ['palette', 'font', 'surfaces', 'branding']) expect(html().hasAttribute(`data-ot-f-${id}`)).toBe(true);
  const css = sent.find((m) => m.type === 'ot:css');
  expect(css && css.type === 'ot:css' && css.css).toContain('.r-a{color:var(--ot-accent)}');
});

test('a feature switched off in settings gets no attribute', async () => {
  await saveSettings({ ...DEFAULT_SETTINGS, features: { ...DEFAULT_SETTINGS.features, branding: false } });
  running = await main({ doc: document, win: window });
  await sleep(80);
  expect(html().hasAttribute('data-ot-f-branding')).toBe(false);
  expect(html().hasAttribute('data-ot-f-surfaces')).toBe(true);
});

test('a settings change applies without reload', async () => {
  running = await main({ doc: document, win: window });
  await sleep(80);
  await saveSettings({ ...DEFAULT_SETTINGS, features: { ...DEFAULT_SETTINGS.features, surfaces: false } });
  await sleep(80);
  expect(html().hasAttribute('data-ot-f-surfaces')).toBe(false);
  expect(html().hasAttribute('data-ot-f-palette')).toBe(true);
});

test('a theme switch on X flips the theme attribute', async () => {
  running = await main({ doc: document, win: window });
  await sleep(80);
  document.body.style.backgroundColor = 'rgb(0, 0, 0)';
  await sleep(20);
  expect(html().getAttribute('data-ot-theme')).toBe('night');
});

test('a subframe runs only the engine features and sends no badge', async () => {
  running = await main({ doc: document, win: { top: {} } as unknown as Window });
  await sleep(80);
  expect(html().hasAttribute('data-ot-f-palette')).toBe(true);
  expect(html().hasAttribute('data-ot-f-surfaces')).toBe(false);
  expect(sent.some((m) => m.type === 'ot:badge')).toBe(false);
});
