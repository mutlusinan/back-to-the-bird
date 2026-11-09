import type { Feature } from '../types';

/** Era avatar corners (2014: 5px rounded square, 2017: circle); purely CSS (style.css). */
export const avatar: Feature = {
  id: 'avatar',
  requires: [],
  optional: ['avatar'],
  apply: () => {},
  cleanup: () => {},
};
