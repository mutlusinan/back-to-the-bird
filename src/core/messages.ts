import type { HealthSnapshot } from './health';
import type { ReportMeta } from './report';

/** Content script → background. */
export type ToBackground =
  | { type: 'ot:css'; css: string }
  | { type: 'ot:badge'; level: 'ok' | 'warn' | 'error' };

/** Popup → content script (top frame only). */
export type ToContent = { type: 'ot:getHealth' };

export interface HealthResponse {
  snapshot: HealthSnapshot;
  meta: ReportMeta;
}

/** Port the popup holds open while "show original" is pressed; message: { hold: boolean }. */
export const SHOW_ORIGINAL_PORT = 'ot:showOriginal';
