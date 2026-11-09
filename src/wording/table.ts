import type { Era } from '../config';
import { WORDING_KEYS, type WordingKey } from './keys';

/** A word for both eras, one per era, or null: X's own text stays. */
export type WordingValue = string | null | Record<Era, string | null>;
export type WordingTable = Record<WordingKey, WordingValue>;

export class WordingError extends Error {}

const ERAS: readonly Era[] = ['2014', '2017'];
const MAX_LENGTH = 40;
const CONTROL = /[\u0000-\u001f\u007f]/;

/** Validates one language's table: every key present (null allowed), nothing unknown. */
export function parseWordingTable(raw: unknown, label: string): WordingTable {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new WordingError(`${label}: wording table must be an object`);
  }
  const obj = raw as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!(WORDING_KEYS as readonly string[]).includes(key)) throw new WordingError(`${label}: unknown key ${key}`);
  }
  const table = {} as WordingTable;
  for (const key of WORDING_KEYS) {
    if (!(key in obj)) throw new WordingError(`${label}: missing key ${key}`);
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const eras = Object.keys(value);
      if (eras.length !== ERAS.length || !ERAS.every((era) => eras.includes(era))) {
        throw new WordingError(`${label}: ${key} needs exactly the eras ${ERAS.join(' and ')}`);
      }
      const perEra = value as Record<string, unknown>;
      table[key] = { '2014': word(perEra['2014'], `${label}.${key}.2014`), '2017': word(perEra['2017'], `${label}.${key}.2017`) };
    } else {
      table[key] = word(value, `${label}.${key}`);
    }
  }
  return table;
}

function word(value: unknown, at: string): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') throw new WordingError(`${at}: must be a string or null`);
  const length = [...value].length;
  if (length === 0 || length > MAX_LENGTH || CONTROL.test(value)) {
    throw new WordingError(`${at}: must be 1–${MAX_LENGTH} characters without control characters`);
  }
  return value;
}

/** X's `html[lang]` → table key: primary subtag, except the two Chinese scripts (spec §11). */
export function normalizeLang(lang: string): string {
  const tag = lang.trim().toLowerCase();
  if (tag === 'zh-cn' || tag === 'zh-tw') return tag;
  return tag.split('-')[0] ?? '';
}
