/** X controls whose label the `wording` feature replaces (spec §10.6), in table order. */
export const WORDING_KEYS = [
  'composeButton',
  'composeSubmit',
  'repostAction',
  'undoRepostAction',
  'quoteAction',
  'repostsLabel',
  'quotesLabel',
  'likesLabel',
  'profilePostsTab',
] as const;

export type WordingKey = (typeof WORDING_KEYS)[number];

/** Anchor that marks the control whose label `key` replaces. */
export type WordingAnchor = `word${Capitalize<WordingKey>}`;

export function wordingAnchor(key: WordingKey): WordingAnchor {
  return `word${key[0]!.toUpperCase()}${key.slice(1)}` as WordingAnchor;
}
