import type { Feature } from '../types';

/** Gray page background with white cards; purely CSS (style.css). */
export const surfaces: Feature = {
  id: 'surfaces',
  requires: [],
  optional: ['primaryColumn', 'sidebarColumn', 'sidebarBox'],
  apply: () => {},
  cleanup: () => {},
};
