import type { Era } from '../config';
import type { Theme } from '../engine/palette-map';
import type { HealthSnapshot } from './health';
import type { PageType } from './route';

export interface ReportMeta {
  extensionVersion: string;
  paletteMapVersion: number;
  /** Whether valid remote data was in use, and its version. */
  dataSource: 'built-in' | 'remote';
  dataVersion: string | null;
  xBuild: string | null;
  lang: string;
  theme: Theme;
  era: Era;
  pageType: PageType;
}

/** The text "Copy report" puts on the clipboard. Holds no URL, username or content. */
export function buildReport(h: HealthSnapshot, meta: ReportMeta): string {
  return JSON.stringify({ meta, health: h }, null, 2);
}
