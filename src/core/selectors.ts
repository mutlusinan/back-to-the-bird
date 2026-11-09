export type AnchorName =
  | 'sideNavLogo'
  | 'primaryColumn'
  | 'sidebarColumn'
  | 'sidebarBox'
  | 'radiusKeep'
  | 'navHome'
  | 'navExplore'
  | 'navNotifications'
  | 'navMessages'
  | 'navProfile'
  | 'navMore'
  | 'actionReply'
  | 'actionRetweet'
  | 'actionLike'
  | 'actionLiked'
  | 'actionBookmark'
  | 'avatar'
  | 'followButton'
  | 'unfollowButton'
  | 'composeButton'
  | 'composeSubmit'
  | 'grokNav'
  | 'grokDrawer'
  | 'grokTweetButton'
  | 'premiumNav'
  | 'premiumSidebar'
  | 'viewCount'
  | 'wordComposeButton'
  | 'wordComposeSubmit'
  | 'wordRepostAction'
  | 'wordUndoRepostAction'
  | 'wordQuoteAction'
  | 'wordRepostsLabel'
  | 'wordQuotesLabel'
  | 'wordLikesLabel'
  | 'wordProfilePostsTab';

/** Anchor name → selectors in priority order. */
export type SelectorTable = Record<AnchorName, string[]>;

export const ANCHOR_NAMES: readonly AnchorName[] = [
  'sideNavLogo',
  'primaryColumn',
  'sidebarColumn',
  'sidebarBox',
  'radiusKeep',
  'navHome',
  'navExplore',
  'navNotifications',
  'navMessages',
  'navProfile',
  'navMore',
  'actionReply',
  'actionRetweet',
  'actionLike',
  'actionLiked',
  'actionBookmark',
  'avatar',
  'followButton',
  'unfollowButton',
  'composeButton',
  'composeSubmit',
  'grokNav',
  'grokDrawer',
  'grokTweetButton',
  'premiumNav',
  'premiumSidebar',
  'viewCount',
  'wordComposeButton',
  'wordComposeSubmit',
  'wordRepostAction',
  'wordUndoRepostAction',
  'wordQuoteAction',
  'wordRepostsLabel',
  'wordQuotesLabel',
  'wordLikesLabel',
  'wordProfilePostsTab',
];

/** Validates an untrusted selector table; selectors this browser cannot parse are dropped. */
export function parseSelectorTable(json: unknown): SelectorTable {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    throw new Error('selector table must be an object');
  }
  const record = json as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ANCHOR_NAMES.includes(key as AnchorName)) throw new Error(`unknown anchor: ${key}`);
  }
  const table = {} as SelectorTable;
  for (const name of ANCHOR_NAMES) table[name] = usableSelectors(name, record[name]);
  return table;
}

/**
 * One anchor's selector list: a non-empty array of strings, else it throws. A selector this
 * browser cannot parse (newer syntax, or a typo in remote data) is dropped on its own: the
 * anchor falls back to its other selectors and every other anchor keeps working.
 */
export function usableSelectors(name: string, list: unknown): string[] {
  if (!Array.isArray(list) || list.length === 0) throw new Error(`anchor ${name} needs selectors`);
  for (const selector of list) {
    if (typeof selector !== 'string') throw new Error(`anchor ${name}: selector must be a string`);
  }
  const probe = document.createDocumentFragment();
  return (list as string[]).filter((selector) => {
    try {
      probe.querySelector(selector);
      return true;
    } catch {
      return false;
    }
  });
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
