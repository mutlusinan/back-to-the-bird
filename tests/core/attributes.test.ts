import { applyHtmlAttributes, clearHtmlAttributes } from '../../src/core/attributes';
import { DEFAULT_SETTINGS } from '../../src/core/settings';
import type { FeatureId } from '../../src/config';

const html = () => document.documentElement;
const otAttributes = () => html().getAttributeNames().filter((n) => n.startsWith('data-ot')).sort();

beforeEach(() => {
  for (const name of html().getAttributeNames()) html().removeAttribute(name);
});

test('sets era, theme and attributes for active features that are switched on', () => {
  const settings = { ...DEFAULT_SETTINGS, features: { ...DEFAULT_SETTINGS.features, branding: false } };
  applyHtmlAttributes(html(), settings, 'night', new Set<FeatureId>(['palette', 'branding']));
  expect(html().getAttribute('data-ot-era')).toBe('2017');
  expect(html().getAttribute('data-ot-theme')).toBe('night');
  expect(otAttributes()).toEqual(['data-ot-era', 'data-ot-f-palette', 'data-ot-theme']);
});

test('a feature switched off later loses its attribute', () => {
  applyHtmlAttributes(html(), DEFAULT_SETTINGS, 'light', new Set<FeatureId>(['palette', 'font']));
  const off = { ...DEFAULT_SETTINGS, features: { ...DEFAULT_SETTINGS.features, font: false } };
  applyHtmlAttributes(html(), off, 'light', new Set<FeatureId>(['palette', 'font']));
  expect(html().hasAttribute('data-ot-f-font')).toBe(false);
  expect(html().hasAttribute('data-ot-f-palette')).toBe(true);
});

test('clearHtmlAttributes removes only data-ot attributes', () => {
  html().setAttribute('lang', 'tr');
  applyHtmlAttributes(html(), DEFAULT_SETTINGS, 'light', new Set<FeatureId>(['palette']));
  clearHtmlAttributes(html());
  expect(otAttributes()).toEqual([]);
  expect(html().getAttribute('lang')).toBe('tr');
});
