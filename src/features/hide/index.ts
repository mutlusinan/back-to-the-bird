import type { Feature } from '../types';

const cssOnly = { requires: [], apply: () => {}, cleanup: () => {} } as const;

/** Things that did not exist in the era are hidden with display:none (style.css); nothing is removed. */
export const hideGrok: Feature = { ...cssOnly, id: 'hideGrok', optional: ['grokNav', 'grokDrawer', 'grokTweetButton'] };
export const hidePremium: Feature = { ...cssOnly, id: 'hidePremium', optional: ['premiumNav', 'premiumSidebar'] };
export const hideViewCounts: Feature = { ...cssOnly, id: 'hideViewCounts', optional: ['viewCount'] };
