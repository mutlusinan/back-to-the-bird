import type { Era } from '../config';
import { WORDING_KEYS, wordingAnchor, type WordingKey } from './keys';
import type { WordingTable } from './table';

const ERAS: readonly Era[] = ['2014', '2017'];

/**
 * A double-quoted CSS string; the word can never end the string or the rule.
 * Braces and semicolons are hex-escaped too, so even a naive parser that ignores
 * string boundaries cannot end the rule (wording may come from remote data).
 */
export function cssString(s: string): string {
  const escaped = s
    .replace(/[\\"]/g, (c) => `\\${c}`)
    .replace(/[\u0000-\u001f\u007f{};]/g, (c) => `\\${c.charCodeAt(0).toString(16)} `);
  return `"${escaped}"`;
}

/**
 * Rules for one language. Each non-null word hides the text leaf of its anchored
 * control (font-size 0 keeps it for screen readers) and draws the word in the
 * leaf's parent `::before`. An empty leaf (collapsed menu) gets no word. Era
 * differences are attribute-scoped, so switching era needs no new CSS.
 */
export function wordingCss(table: WordingTable): string {
  const rules: string[] = [];
  for (const key of WORDING_KEYS) {
    const value = table[key];
    if (value === null) continue;
    if (typeof value === 'string') rules.push(...keyRules(key, value));
    else for (const era of ERAS) if (value[era] !== null) rules.push(...keyRules(key, value[era]!, era));
  }
  return rules.join('\n');
}

function keyRules(key: WordingKey, word: string, era?: Era): string[] {
  const scope = era === undefined ? 'html[data-ot-f-wording]' : `html[data-ot-f-wording][data-ot-era="${era}"]`;
  const anchor = `${scope} [data-ot~="${wordingAnchor(key)}"]`;
  const content = cssString(word);
  // The leaf's parent: a non-empty span child that holds no element itself. :has() cannot nest,
  // so "leaf" is spelled as a negated :has() beside it rather than inside it.
  const parent = ':has(> span:not(:empty)):not(:has(> span > *))::before';
  return [
    `${anchor} span:not(:has(*)){font-size:0 !important}`,
    `${anchor}${parent},${anchor} ${parent}{content:${content};content:${content} / ""}`,
  ];
}
