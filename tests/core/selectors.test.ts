import { findAll, parseSelectorTable, type SelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';

const table = (): SelectorTable => ({
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

test('parseSelectorTable rejects an invalid selector', () => {
  expect(() => parseSelectorTable({ ...table(), primaryColumn: ['div[['] })).toThrow();
});

test('the bundled selector table parses', () => {
  expect(() => parseSelectorTable(selectorsJson)).not.toThrow();
});
