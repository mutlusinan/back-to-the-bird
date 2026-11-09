import type { Feature } from '../types';

/** Era Follow / Following and Tweet buttons; purely CSS (style.css) over X's inline button colors. */
export const buttons: Feature = {
  id: 'followButton',
  requires: [],
  optional: ['followButton', 'unfollowButton', 'composeButton', 'composeSubmit'],
  apply: () => {},
  cleanup: () => {},
};
