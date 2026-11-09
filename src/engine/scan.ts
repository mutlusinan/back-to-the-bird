import type { RuleLike } from './remap';

export interface ScanResult {
  /** Style rules not returned by any earlier scan. */
  rules: RuleLike[];
  readable: number;
  unreadable: number;
}

/**
 * Reads the page's stylesheets incrementally. Rules are tracked by identity,
 * not by position: react-native-web inserts new rules inside their group, not
 * only at the end of the sheet.
 */
export class SheetScanner {
  private readonly seen = new WeakSet<CSSRule>();
  private readonly lengths = new WeakMap<CSSStyleSheet, number>();

  constructor(private readonly doc: Document) {}

  scanNew(): ScanResult {
    const rules: RuleLike[] = [];
    let readable = 0;
    let unreadable = 0;
    const own = new Set(Array.from(this.doc.querySelectorAll<HTMLStyleElement>('style[data-ot]'), (el) => el.sheet));
    for (const sheet of Array.from(this.doc.styleSheets)) {
      if (own.has(sheet)) continue;
      let list: CSSRuleList;
      try {
        list = sheet.cssRules;
      } catch {
        unreadable++;
        continue;
      }
      readable++;
      if (this.lengths.get(sheet) === list.length) continue;
      this.lengths.set(sheet, list.length);
      this.collect(list, undefined, rules);
    }
    return { rules, readable, unreadable };
  }

  private collect(list: CSSRuleList, media: string | undefined, out: RuleLike[]): void {
    for (const rule of Array.from(list)) {
      if ('selectorText' in rule && 'style' in rule) {
        if (this.seen.has(rule)) continue;
        this.seen.add(rule);
        const style = (rule as CSSStyleRule).style;
        const selectorText = (rule as CSSStyleRule).selectorText;
        out.push(media === undefined ? { selectorText, style } : { selectorText, style, media });
      } else if ('cssRules' in rule) {
        // @media keeps its condition; other grouping rules (@supports, @layer, @container) are flattened.
        const condition = 'media' in rule ? (rule as CSSMediaRule).media.mediaText : media;
        this.collect((rule as CSSGroupingRule).cssRules, condition, out);
      }
    }
  }
}
