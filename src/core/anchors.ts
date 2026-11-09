import { findAll, type AnchorName, type SelectorTable } from './selectors';

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
