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

test('top frame and subframes cache their css under separate keys', async () => {
  running = await main({ doc: document, win: window });
  await sleep(80);
  running.stop();
  running = await main({ doc: document, win: { top: {} } as unknown as Window });
  await sleep(80);
  const keys = Object.keys(await fakeBrowser.storage.local.get(null)).filter((k) => k.startsWith('ot:engineCss'));
  expect(keys.sort()).toEqual(['ot:engineCss:v1:sub', 'ot:engineCss:v1:top']);
});

test('a dead extension context leaves the page in X state', async () => {
  vi.spyOn(fakeBrowser.runtime, 'sendMessage').mockImplementation((async () => {
    throw new Error('Extension context invalidated.');
  }) as never);
  running = await main({ doc: document, win: window });
  await sleep(80);
  expect(html().getAttributeNames().filter((n) => n.startsWith('data-ot'))).toEqual([]);
  expect(document.querySelectorAll('style[data-ot], link[data-ot]')).toHaveLength(0);
});

test('a subframe runs only the engine features and sends no badge', async () => {
  running = await main({ doc: document, win: { top: {} } as unknown as Window });
  await sleep(80);
  expect(html().hasAttribute('data-ot-f-palette')).toBe(true);
  expect(html().hasAttribute('data-ot-f-surfaces')).toBe(false);
  expect(sent.some((m) => m.type === 'ot:badge')).toBe(false);
});

test('a logo rendered after startup activates branding', async () => {
  document.body.innerHTML = '<div data-testid="primaryColumn"></div>';
  running = await main({ doc: document, win: window });
  await sleep(80);
  expect(html().hasAttribute('data-ot-f-branding')).toBe(false);
  const header = document.createElement('header');
  header.setAttribute('role', 'banner');
  header.innerHTML = '<h1><a href="/home"><svg></svg></a></h1>';
  document.body.prepend(header);
  await sleep(80);
  expect(html().hasAttribute('data-ot-f-branding')).toBe(true);
});

test('no badge is sent while the page is still rendering', async () => {
  document.body.innerHTML = '';
  running = await main({ doc: document, win: window });
  await sleep(80);
  expect(sent.some((m) => m.type === 'ot:badge')).toBe(false);
});

test('after the grace period a missing anchor shows on the badge', async () => {
  document.body.innerHTML = '';
  running = await main({ doc: document, win: window, graceMs: 30 });
  await sleep(120);
  expect(sent).toContainEqual({ type: 'ot:badge', level: 'warn' });
});

test('an era change in the popup applies without reload', async () => {
  running = await main({ doc: document, win: window });
  await sleep(80);
  await saveSettings({ ...DEFAULT_SETTINGS, era: '2014' });
  await sleep(40);
  expect(html().getAttribute('data-ot-era')).toBe('2014');
});
