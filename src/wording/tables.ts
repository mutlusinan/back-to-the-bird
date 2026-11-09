import { normalizeLang, parseWordingTable, type WordingTable } from './table';

const files = import.meta.glob('../data/wording/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

/** Built-in tables by language code (file name), validated at load. */
export const WORDING_TABLES: ReadonlyMap<string, WordingTable> = new Map(
  Object.entries(files).map(([path, raw]) => {
    const lang = /([^/]+)\.json$/.exec(path)![1]!;
    return [lang, parseWordingTable(raw, lang)];
  }),
);

/** The table for X's `html[lang]`, or null when the language has none. */
export function wordingTableFor(lang: string): WordingTable | null {
  return WORDING_TABLES.get(normalizeLang(lang)) ?? null;
}
