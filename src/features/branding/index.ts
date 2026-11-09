import birdSvg from './bird.svg?raw';
import { ensureFavicon, removeFavicon } from './favicon';
import type { Feature } from '../types';

const FAVICON = `data:image/svg+xml,${encodeURIComponent(birdSvg.trim().replace('fill="#000"', 'fill="#1DA1F2"'))}`;

/** Bird logo (CSS mask over the side-nav logo) and bird favicon. */
export const branding: Feature = {
  id: 'branding',
  requires: ['sideNavLogo'],
  optional: [],
  apply: (ctx) => ensureFavicon(ctx.doc.head, FAVICON),
  cleanup: (ctx) => removeFavicon(ctx.doc.head),
};
