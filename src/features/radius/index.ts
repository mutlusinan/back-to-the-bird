import type { Feature } from '../types';

/**
 * The DOM half of the radius feature: the engine maps X's corner values to era
 * tokens, and this keeps the things that must stay round (search box, switches)
 * round when the era squares the corners (style.css).
 */
export const radius: Feature = {
  id: 'radius',
  requires: [],
  optional: ['radiusKeep'],
  apply: () => {},
  cleanup: () => {},
};
