import type { FeatureId } from '../config';
import type { Health } from '../core/health';
import type { AnchorName, SelectorTable } from '../core/selectors';

export interface FeatureContext {
  table: SelectorTable;
  doc: Document;
  health: Health;
}

/** A DOM feature: tags anchors, styles them from static CSS, never moves X's nodes. */
export interface Feature {
  id: FeatureId;
  /** Without these the feature is not applied (health: warn). */
  requires: readonly AnchorName[];
  /** Tagged when present; their absence is normal on some pages. */
  optional: readonly AnchorName[];
  /** A reason the feature cannot run on this page (health: unavailable), or null. */
  unavailable?(ctx: FeatureContext): string | null;
  apply(ctx: FeatureContext): void;
  cleanup(ctx: FeatureContext): void;
}
