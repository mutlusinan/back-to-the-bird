import { tagAdded, tagAnchors } from '../../src/core/anchors';
import type { SelectorTable } from '../../src/core/selectors';

const table: SelectorTable = {
  sideNavLogo: ['[data-testid="logo"]'],
  primaryColumn: ['[data-testid="primaryColumn"]'],
  sidebarColumn: ['[data-testid="sidebarColumn"]'],
  sidebarBox: ['.box'],
};

beforeEach(() => {
  document.body.innerHTML = '';
});

test('tags found elements and returns the found names', () => {
  document.body.innerHTML = '<div data-testid="logo" id="l"></div>';
  const found = tagAnchors(table, ['sideNavLogo', 'primaryColumn'], document);
  expect([...found]).toEqual(['sideNavLogo']);
  expect(document.getElementById('l')!.getAttribute('data-ot')).toBe('sideNavLogo');
});

test('an element matching two names carries both', () => {
  document.body.innerHTML = '<div data-testid="primaryColumn" class="box" id="p"></div>';
  tagAnchors(table, ['primaryColumn', 'sidebarBox'], document);
  expect(document.getElementById('p')!.getAttribute('data-ot')).toBe('primaryColumn sidebarBox');
});

test('tagging twice does not duplicate a name', () => {
  document.body.innerHTML = '<div data-testid="logo" id="l"></div>';
  tagAnchors(table, ['sideNavLogo'], document);
  tagAnchors(table, ['sideNavLogo'], document);
  expect(document.getElementById('l')!.getAttribute('data-ot')).toBe('sideNavLogo');
});

test('tagAdded searches only the added elements and their subtrees', () => {
  document.body.innerHTML = '<div data-testid="primaryColumn" id="old"></div>';
  const fresh = document.createElement('section');
  fresh.innerHTML = '<div data-testid="logo" id="l"></div>';
  document.body.append(fresh);
  const found = tagAdded(table, ['sideNavLogo', 'primaryColumn'], [document.createTextNode('x'), fresh]);
  expect([...found]).toEqual(['sideNavLogo']);
  expect(document.getElementById('l')!.getAttribute('data-ot')).toBe('sideNavLogo');
  expect(document.getElementById('old')!.hasAttribute('data-ot')).toBe(false);
});
