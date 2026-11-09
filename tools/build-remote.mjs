// Builds data/remote.json (spec §12) from the extension's built-in data in src/data.
// Publishing a fix: edit src/data, run `npm run remote`, push to the default branch.
// dataVersion moves only when the content changes: <today>.<n>.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Paths are relative to the repository root (npm scripts and the test runner both run there).
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const OUT = 'data/remote.json';

export function buildRemote({ dataVersion = null } = {}) {
  const wording = {};
  for (const file of readdirSync('src/data/wording').filter((f) => f.endsWith('.json')).sort()) {
    wording[file.slice(0, -5)] = read(`src/data/wording/${file}`);
  }
  return {
    schemaVersion: 1,
    dataVersion,
    minExtensionVersion: '1.0.0',
    maxExtensionVersion: null,
    selectors: read('src/data/selectors.json'),
    paletteMap: read('src/data/palette-map.json'),
    wording,
    disabledFeatures: [],
  };
}

function nextVersion(previous) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, n] = (previous ?? '').split('.');
  return date === today ? `${today}.${Number(n) + 1}` : `${today}.1`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
  const next = buildRemote();
  const same = previous && JSON.stringify({ ...previous, dataVersion: null }) === JSON.stringify(next);
  next.dataVersion = same ? previous.dataVersion : nextVersion(previous?.dataVersion);
  writeFileSync(OUT, `${JSON.stringify(next, null, 2)}\n`);
  console.log(same ? `data/remote.json unchanged (${next.dataVersion})` : `wrote data/remote.json ${next.dataVersion}`);
}
