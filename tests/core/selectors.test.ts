import { ANCHOR_NAMES, findAll, parseSelectorTable, type SelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';

// Every anchor gets a harmless default; the ones under test are spelled out.
const table = (): SelectorTable => ({
  ...(Object.fromEntries(ANCHOR_NAMES.map((n) => [n, [`[data-anchor="${n}"]`]])) as SelectorTable),
  sideNavLogo: ['[data-testid="logo"]', 'header h1 a'],
  primaryColumn: ['[data-testid="primaryColumn"]'],
  sidebarColumn: ['[data-testid="sidebarColumn"]'],
  sidebarBox: ['[data-testid="sidebarColumn"] section'],
});

beforeEach(() => {
  document.body.innerHTML = '';
});

test('findAll falls back to the next selector when the first matches nothing', () => {
  document.body.innerHTML = '<header><h1><a id="l">x</a></h1></header>';
  expect(findAll(table(), 'sideNavLogo', document).map((e) => e.id)).toEqual(['l']);
});

test('findAll returns every match of the first selector that matches', () => {
  document.body.innerHTML =
    '<div data-testid="logo" id="a"></div><div data-testid="logo" id="b"></div><header><h1><a id="c"></a></h1></header>';
  expect(findAll(table(), 'sideNavLogo', document).map((e) => e.id)).toEqual(['a', 'b']);
});

test('findAll returns an empty list when nothing matches', () => {
  expect(findAll(table(), 'primaryColumn', document)).toEqual([]);
});

test('findAll includes the root element itself when it matches', () => {
  const root = document.createElement('div');
  root.setAttribute('data-testid', 'primaryColumn');
  expect(findAll(table(), 'primaryColumn', root)).toEqual([root]);
});

test('parseSelectorTable accepts a complete table', () => {
  expect(parseSelectorTable(table())).toEqual(table());
});

test('parseSelectorTable rejects a missing name', () => {
  const { sidebarBox: _sidebarBox, ...rest } = table();
  expect(() => parseSelectorTable(rest)).toThrow();
});

test('parseSelectorTable rejects an unknown name', () => {
  expect(() => parseSelectorTable({ ...table(), other: ['div'] })).toThrow();
});

test('parseSelectorTable rejects an empty list', () => {
  expect(() => parseSelectorTable({ ...table(), primaryColumn: [] })).toThrow();
});

test('a selector this browser cannot parse is dropped and the rest of its anchor is kept', () => {
  const parsed = parseSelectorTable({ ...table(), primaryColumn: ['div[[', 'main'] });
  expect(parsed.primaryColumn).toEqual(['main']);
  expect(parsed.sidebarColumn).toEqual(table().sidebarColumn);
});

test('an anchor whose every selector fails to parse finds nothing instead of stopping the skin', () => {
  const parsed = parseSelectorTable({ ...table(), primaryColumn: ['div[['] });
  expect(parsed.primaryColumn).toEqual([]);
  document.body.innerHTML = '<main></main>';
  expect(findAll(parsed, 'primaryColumn', document)).toEqual([]);
});

test('parseSelectorTable rejects a selector that is not a string', () => {
  expect(() => parseSelectorTable({ ...table(), primaryColumn: [7] })).toThrow();
});

test('the bundled selector table parses', () => {
  expect(() => parseSelectorTable(selectorsJson)).not.toThrow();
});
