import { findAll, type AnchorName, type SelectorTable } from './selectors';

/**
 * Rebuilds one element's data-ot list after X changed its state: of the given
 * names, keeps those whose selectors match the element now and drops the rest;
 * names outside the given list are left alone. Returns the matching names.
 */
export function retagElement(table: SelectorTable, names: readonly AnchorName[], el: Element): Set<AnchorName> {
  const matching = new Set(names.filter((name) => table[name].some((selector) => el.matches(selector))));
  const others = (el.getAttribute('data-ot') ?? '').split(' ').filter((n) => n && !names.includes(n as AnchorName));
  const next = [...others, ...matching];
  if (next.length > 0) el.setAttribute('data-ot', next.join(' '));
  else el.removeAttribute('data-ot');
  return matching;
}

/** Tags anchors only inside newly added elements (cheap per-frame path); returns the names found. */
export function tagAdded(table: SelectorTable, names: readonly AnchorName[], roots: readonly Node[]): Set<AnchorName> {
  const found = new Set<AnchorName>();
  for (const root of roots) {
    if (root.nodeType !== Node.ELEMENT_NODE) continue;
    for (const name of tagAnchors(table, names, root as Element)) found.add(name);
  }
  return found;
}

/** Adds each found anchor's name to its `data-ot` list; returns the names found. */
export function tagAnchors(table: SelectorTable, names: readonly AnchorName[], root: ParentNode): Set<AnchorName> {
  const found = new Set<AnchorName>();
  for (const name of names) {
    const elements = findAll(table, name, root);
    if (elements.length === 0) continue;
    found.add(name);
    for (const element of elements) {
      const current = (element.getAttribute('data-ot') ?? '').split(' ').filter(Boolean);
      if (!current.includes(name)) element.setAttribute('data-ot', [...current, name].join(' '));
    }
  }
  return found;
}
