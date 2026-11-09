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

export const IMPLEMENTED_FEATURES: readonly FeatureId[] = ['palette', 'font', 'typeScale', 'radius', 'surfaces', 'branding', 'icons', 'avatar'];

export type Era = '2014' | '2017';

export const AVAILABLE_ERAS: readonly Era[] = ['2014', '2017'];

export const ENGINE_BUDGET_MS = 4;

export const PALETTE_MISS_THRESHOLD = 3;
