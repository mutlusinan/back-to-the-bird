export type AnchorName = 'sideNavLogo' | 'primaryColumn' | 'sidebarColumn' | 'sidebarBox' | 'radiusKeep';

/** Anchor name → selectors in priority order. */
export type SelectorTable = Record<AnchorName, string[]>;

export const ANCHOR_NAMES: readonly AnchorName[] = ['sideNavLogo', 'primaryColumn', 'sidebarColumn', 'sidebarBox', 'radiusKeep'];

/** Validates an untrusted selector table; every selector must parse. */
export function parseSelectorTable(json: unknown): SelectorTable {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    throw new Error('selector table must be an object');
  }
  const record = json as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ANCHOR_NAMES.includes(key as AnchorName)) throw new Error(`unknown anchor: ${key}`);
  }
  const probe = document.createDocumentFragment();
  const table = {} as SelectorTable;
  for (const name of ANCHOR_NAMES) {
    const list = record[name];
    if (!Array.isArray(list) || list.length === 0) throw new Error(`anchor ${name} needs selectors`);
    for (const selector of list) {
      if (typeof selector !== 'string') throw new Error(`anchor ${name}: selector must be a string`);
      probe.querySelector(selector); // throws on invalid syntax
    }
    table[name] = [...(list as string[])];
  }
  return table;
}

/**
 * Returns every element under `root` (including `root` itself) matched by the
 * first selector of `name` that matches anything.
 */
export function findAll(table: SelectorTable, name: AnchorName, root: ParentNode): Element[] {
  for (const selector of table[name]) {
    const found = [...root.querySelectorAll(selector)];
    if (root instanceof Element && root.matches(selector)) found.unshift(root);
    if (found.length > 0) return found;
  }
  return [];
}
