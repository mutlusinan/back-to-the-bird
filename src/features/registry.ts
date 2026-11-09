import type { FeatureId } from '../config';
import { tagAnchors } from '../core/anchors';
import { avatar } from './avatar';
import { branding } from './branding';
import { buttons } from './buttons';
import { hideGrok, hidePremium, hideViewCounts } from './hide';
import { icons } from './icons';
import { radius } from './radius';
import { surfaces } from './surfaces';
import { wording } from './wording';
import type { Feature, FeatureContext } from './types';

export const DOM_FEATURES: readonly Feature[] = [
  surfaces,
  branding,
  radius,
  icons,
  avatar,
  buttons,
  wording,
  hideGrok,
  hidePremium,
  hideViewCounts,
];

/** Features that threw during this page session stay off until reload. */
const failed = new Set<FeatureId>();
/** Features already cleaned up after being switched off; cleanup is not repeated every tick. */
const cleanedUp = new Set<FeatureId>();

/**
 * Tags each enabled feature's anchors and applies it when its required anchors
 * exist. Returns the features that are active. Health detail for a missing
 * required anchor is the anchor names; the popup words it.
 */
export function runFeatures(ctx: FeatureContext, enabled: ReadonlySet<FeatureId>): ReadonlySet<FeatureId> {
  const active = new Set<FeatureId>();
  for (const feature of DOM_FEATURES) {
    if (failed.has(feature.id)) continue;
    try {
      if (!enabled.has(feature.id)) {
        if (!cleanedUp.has(feature.id)) feature.cleanup(ctx);
        cleanedUp.add(feature.id);
        ctx.health.setFeature(feature.id, 'off');
        continue;
      }
      cleanedUp.delete(feature.id);
      const reason = feature.unavailable?.(ctx) ?? null;
      if (reason !== null) {
        feature.cleanup(ctx);
        ctx.health.setFeature(feature.id, 'unavailable', reason);
        continue;
      }
      const found = tagAnchors(ctx.table, [...feature.requires, ...feature.optional], ctx.doc);
      const missing = feature.requires.filter((name) => !found.has(name));
      if (missing.length > 0) {
        feature.cleanup(ctx);
        ctx.health.setFeature(feature.id, 'warn', missing.join(', '));
        continue;
      }
      feature.apply(ctx);
      active.add(feature.id);
      ctx.health.setFeature(feature.id, 'ok');
    } catch (err) {
      failed.add(feature.id);
      ctx.health.error(feature.id, err);
    }
  }
  return active;
}
