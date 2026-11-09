import { readFileSync } from 'node:fs';
const brandingCss = readFileSync('src/features/branding/style.css', 'utf8');
import birdSvg from '../../src/features/branding/bird.svg?raw';
import { createHealth } from '../../src/core/health';
import { parseSelectorTable } from '../../src/core/selectors';
import { ensureFavicon, removeFavicon } from '../../src/features/branding/favicon';
import { runFeatures } from '../../src/features/registry';
import selectorsJson from '../../src/data/selectors.json';
import type { FeatureId } from '../../src/config';

const store = { get: async () => undefined, set: async () => undefined };
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const ours = () => document.head.querySelectorAll('link[rel="icon"][data-ot]');

beforeEach(() => {
  removeFavicon(document.head);
  document.head.innerHTML = '<link rel="icon" href="https://abs.twimg.com/favicons/x.ico">';
  document.body.innerHTML = '';
});

test('branding warns when the logo anchor is missing', () => {
  const health = createHealth(store);
  const active = runFeatures({ table: parseSelectorTable(selectorsJson), doc: document, health }, new Set<FeatureId>(['branding']));
  expect(active.has('branding')).toBe(false);
  expect(health.snapshot().features.branding).toEqual({ status: 'warn', detail: 'sideNavLogo' });
});

test('branding is active and adds the favicon when the logo exists', () => {
  document.body.innerHTML = '<header role="banner"><h1><a href="/home"><svg></svg></a></h1></header>';
  const health = createHealth(store);
  const active = runFeatures({ table: parseSelectorTable(selectorsJson), doc: document, health }, new Set<FeatureId>(['branding']));
  expect(active.has('branding')).toBe(true);
  expect(document.querySelector('a[href="/home"]')!.getAttribute('data-ot')).toBe('sideNavLogo');
  expect(ours()).toHaveLength(1);
});

test('ensureFavicon adds one link, last, with the bird as a data URL', () => {
  ensureFavicon(document.head, 'data:image/svg+xml,abc');
  ensureFavicon(document.head, 'data:image/svg+xml,abc');
  expect(ours()).toHaveLength(1);
  expect(document.head.lastElementChild).toBe(ours()[0]);
});

test('ours moves back to the end when X adds an icon, and X links stay untouched', async () => {
  ensureFavicon(document.head, 'data:image/svg+xml,abc');
  const xLink = document.createElement('link');
  xLink.rel = 'icon';
  xLink.href = 'https://abs.twimg.com/favicons/x-badge.ico';
  document.head.appendChild(xLink);
  await flush();
  expect(document.head.lastElementChild).toBe(ours()[0]);
  const xHrefs = [...document.head.querySelectorAll('link[rel="icon"]:not([data-ot])')].map((l) => l.getAttribute('href'));
  expect(xHrefs).toEqual(['https://abs.twimg.com/favicons/x.ico', 'https://abs.twimg.com/favicons/x-badge.ico']);
});

test('removeFavicon removes only ours', () => {
  ensureFavicon(document.head, 'data:image/svg+xml,abc');
  removeFavicon(document.head);
  expect(ours()).toHaveLength(0);
  expect(document.head.querySelectorAll('link[rel="icon"]')).toHaveLength(1);
});

test('the logo css hides X logo and masks the bird in the accent color', () => {
  expect(brandingCss).toContain('html[data-ot-f-branding] [data-ot~="sideNavLogo"] svg{visibility:hidden}');
  expect(brandingCss).toContain('html[data-ot-f-branding] [data-ot~="sideNavLogo"]::before');
  expect(brandingCss).toContain('background-color:var(--ot-accent)');
  const mask = /mask-image:url\("data:image\/svg\+xml,([^"]+)"\)/.exec(brandingCss);
  expect(mask).not.toBeNull();
  expect(decodeURIComponent(mask![1]!)).toBe(birdSvg.trim());
});
