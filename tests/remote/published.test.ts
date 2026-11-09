import { readFileSync } from 'node:fs';
import { REMOTE_MAX_BYTES } from '../../src/config';
import paletteMapJson from '../../src/data/palette-map.json';
import { parseRemote } from '../../src/remote/schema';
// @ts-expect-error -- plain ESM build script without type declarations
import { buildRemote } from '../../tools/build-remote.mjs';

const published = () => readFileSync('data/remote.json', 'utf8');
const withoutVersion = (data: Record<string, unknown>) => ({ ...data, dataVersion: undefined });

test('the published remote.json is what the build script makes from src/data', () => {
  expect(withoutVersion(JSON.parse(published()))).toEqual(withoutVersion((buildRemote as (o: object) => Record<string, unknown>)({})));
});

test('the published remote.json passes the extension’s own validation', () => {
  expect(() => parseRemote(published(), '1.0.0')).not.toThrow();
  expect(new TextEncoder().encode(published()).length).toBeLessThan(REMOTE_MAX_BYTES);
});

test('the palette map version moved past the one cached by earlier builds', () => {
  expect(paletteMapJson.version).toBe(2);
});
