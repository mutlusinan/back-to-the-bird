import { WORDING_KEYS, wordingAnchor } from '../../wording/keys';
import { normalizeLang } from '../../wording/table';
import { WORDING_TABLES } from '../../wording/tables';
import type { Feature } from '../types';

/**
 * Marks the controls whose labels change. The words themselves are generated
 * CSS per language (content script, `wordingCss`); this feature only decides
 * whether X's interface language has a table.
 */
export const wording: Feature = {
  id: 'wording',
  requires: [],
  optional: WORDING_KEYS.map(wordingAnchor),
  unavailable: (ctx) => {
    const lang = normalizeLang(ctx.doc.documentElement.lang);
    return (ctx.wording ?? WORDING_TABLES).has(lang) ? null : lang || '-';
  },
  apply: () => {},
  cleanup: () => {},
};
