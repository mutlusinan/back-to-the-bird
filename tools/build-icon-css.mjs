// Generates src/features/icons/style.css from src/features/icons/svg/*.svg.
// Each anchor's <svg> keeps X's color (currentColor) and gets our drawing as a mask;
// X's own paths are hidden. Run: npm run icons
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'src/features/icons';
const ICONS = [
  ['navHome', 'home'],
  ['navExplore', 'explore'],
  ['navNotifications', 'notifications'],
  ['navMessages', 'messages'],
  ['navProfile', 'profile'],
  ['navMore', 'more'],
  ['actionReply', 'reply'],
  ['actionRetweet', 'retweet'],
  ['actionBookmark', 'bookmark'],
  ['actionLike', { 2014: 'star', 2017: 'heart' }],
  ['actionLiked', { 2014: 'star-filled', 2017: 'heart-filled' }],
];

const mask = (file) => {
  const url = `url("data:image/svg+xml,${encodeURIComponent(readFileSync(`${DIR}/svg/${file}.svg`, 'utf8').trim())}")`;
  return `-webkit-mask:${url} center/contain no-repeat;mask:${url} center/contain no-repeat;background-color:currentColor`;
};

const lines = [];
for (const [anchor, files] of ICONS) {
  const target = `[data-ot~="${anchor}"] svg`;
  if (typeof files === 'string') {
    lines.push(`html[data-ot-f-icons] ${target}{${mask(files)}}`);
  } else {
    for (const [era, file] of Object.entries(files)) {
      lines.push(`html[data-ot-f-icons][data-ot-era="${era}"] ${target}{${mask(file)}}`);
    }
  }
  lines.push(`html[data-ot-f-icons] ${target}>*{opacity:0}`);
}
writeFileSync(`${DIR}/style.css`, `${lines.join('\n')}\n`);
console.log(`wrote ${DIR}/style.css (${ICONS.length} anchors)`);
