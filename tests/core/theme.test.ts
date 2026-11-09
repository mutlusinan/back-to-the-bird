import { detectTheme, watchTheme } from '../../src/core/theme';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.removeAttribute('style');
});

test.each([
  ['#FFFFFF', 'light'],
  ['rgb(0, 0, 0)', 'night'],
  ['rgb(21, 32, 43)', 'night'],
])('detectTheme with inline background %s → %s', (bg, theme) => {
  document.body.style.backgroundColor = bg;
  expect(detectTheme(document.body)).toBe(theme);
});

test('detectTheme returns null without an inline background', () => {
  expect(detectTheme(document.body)).toBeNull();
});

test('detectTheme reads the inline value, not the computed one', () => {
  document.head.innerHTML = '<style>body{background:red !important}</style>';
  document.body.style.backgroundColor = '#FFFFFF';
  expect(detectTheme(document.body)).toBe('light');
});

test('watchTheme reports a switch to night once', async () => {
  document.body.style.backgroundColor = '#FFFFFF';
  const seen: string[] = [];
  const stop = watchTheme(document.body, (t) => seen.push(t));
  document.body.style.backgroundColor = 'rgb(0, 0, 0)';
  await flush();
  document.body.style.backgroundColor = 'rgb(0, 0, 0)';
  await flush();
  stop();
  expect(seen).toEqual(['night']);
});
