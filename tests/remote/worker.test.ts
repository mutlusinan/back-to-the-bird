// @vitest-environment node
// The background is an MV3 service worker: no `document`. Remote data is validated there.
import { readFileSync } from 'node:fs';
import { REMOTE_KEY, refreshRemote } from '../../src/remote/fetch';
import { parseRemote } from '../../src/remote/schema';

const published = readFileSync('data/remote.json', 'utf8');

test('the published remote data validates without a DOM', () => {
  expect(typeof document).toBe('undefined');
  const data = parseRemote(published, '1.0.0');
  expect(data.selectors.primaryColumn?.length).toBeGreaterThan(0);
});

test('the background stores a remote file that has selectors', async () => {
  const map = new Map<string, unknown>();
  const result = await refreshRemote({
    fetch: async () => new Response(published),
    store: { get: async (k) => map.get(k), set: async (k, v) => void map.set(k, v) },
    now: () => 1,
    version: '1.0.0',
  });
  expect(result).toBe('updated');
  expect(map.get(REMOTE_KEY)).toEqual({ text: published, fetchedAt: 1 });
});
