export type FeatureId =
  | 'palette'
  | 'font'
  | 'typeScale'
  | 'radius'
  | 'surfaces'
  | 'branding'
  | 'icons'
  | 'avatar'
  | 'followButton'
  | 'wording'
  | 'hideGrok'
  | 'hidePremium'
  | 'hideViewCounts';

export const ALL_FEATURES: readonly FeatureId[] = [
  'palette',
  'font',
  'typeScale',
  'radius',
  'surfaces',
  'branding',
  'icons',
  'avatar',
  'followButton',
  'wording',
  'hideGrok',
  'hidePremium',
  'hideViewCounts',
];

export const IMPLEMENTED_FEATURES: readonly FeatureId[] = [
  'palette',
  'font',
  'typeScale',
  'radius',
  'surfaces',
  'branding',
  'icons',
  'avatar',
  'followButton',
  'wording',
  'hideGrok',
  'hidePremium',
  'hideViewCounts',
];

export type Era = '2014' | '2017';

export const AVAILABLE_ERAS: readonly Era[] = ['2014', '2017'];

export const ENGINE_BUDGET_MS = 4;

/** The one network request the extension makes (spec §12): public data on the default branch. */
export const REMOTE_URL = 'https://raw.githubusercontent.com/mutlusinan/back-to-the-bird/main/data/remote.json';

export const REMOTE_MAX_BYTES = 262_144;

export const PALETTE_MISS_THRESHOLD = 3;
