import { REMOTE_URL } from '../../src/config';
import { loadRemote, REMOTE_KEY, refreshRemote } from '../../src/remote/fetch';
import { WORDING_KEYS } from '../../src/wording/keys';

const file = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    schemaVersion: 1,
    dataVersion: '2026-11-10.1',
    minExtensionVersion: '1.0.0',
    maxExtensionVersion: null,
    selectors: {},
    paletteMap: null,
    wording: { nl: { ...Object.fromEntries(WORDING_KEYS.map((k) => [k, null])), composeButton: 'Tweeten' } },
    disabledFeatures: [],
    ...over,
  });

function memoryStore(initial?: unknown) {
  const map = new Map<string, unknown>(initial === undefined ? [] : [[REMOTE_KEY, initial]]);
  return { map, get: async (k: string) => map.get(k), set: async (k: string, v: unknown) => void map.set(k, v) };
}

const old = { text: file({ dataVersion: '2026-11-01.1' }), fetchedAt: 1 };

test('a valid response is stored with the time it was fetched', async () => {
  const store = memoryStore();
  const result = await refreshRemote({ fetch: async () => new Response(file()), store, now: () => 42, version: '1.0.0' });
  expect(result).toBe('updated');
  expect(store.map.get(REMOTE_KEY)).toEqual({ text: file(), fetchedAt: 42 });
});

test('only the public data file is requested, without credentials', async () => {
  const calls: [string, RequestInit | undefined][] = [];
  await refreshRemote({
    fetch: async (url, init) => {
      calls.push([String(url), init]);
      return new Response(file());
    },
    store: memoryStore(),
    now: () => 0,
    version: '1.0.0',
  });
  expect(calls).toHaveLength(1);
  expect(calls[0]![0]).toBe(REMOTE_URL);
  expect(calls[0]![1]?.credentials).toBe('omit');
});

test.each([
  ['the network fails', async () => Promise.reject(new TypeError('Failed to fetch'))],
  ['the file is missing', async () => new Response('Not Found', { status: 404 })],
  ['the file is not valid', async () => new Response('{"schemaVersion": 1')],
  ['the file needs a newer extension', async () => new Response(file({ minExtensionVersion: '9.0.0' }))],
])('the stored data is kept when %s', async (_name, fetchImpl) => {
  const store = memoryStore(old);
  const result = await refreshRemote({ fetch: fetchImpl as typeof fetch, store, now: () => 99, version: '1.0.0' });
  expect(result).toBe('kept');
  expect(store.map.get(REMOTE_KEY)).toEqual(old);
});

test('a request that hangs is abandoned after the timeout', async () => {
  const store = memoryStore(old);
  const hanging: typeof fetch = (_url, init) =>
    new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
  const result = await refreshRemote({ fetch: hanging, store, now: () => 0, version: '1.0.0', timeoutMs: 20 });
  expect(result).toBe('kept');
  expect(store.map.get(REMOTE_KEY)).toEqual(old);
});

test('stored data is re-validated for the running extension version', async () => {
  expect((await loadRemote(memoryStore({ text: file(), fetchedAt: 1 }), '1.0.0'))?.dataVersion).toBe('2026-11-10.1');
  expect(await loadRemote(memoryStore({ text: file({ maxExtensionVersion: '1.0.0' }), fetchedAt: 1 }), '1.1.0')).toBeNull();
  expect(await loadRemote(memoryStore({ text: 'garbage', fetchedAt: 1 }), '1.0.0')).toBeNull();
  expect(await loadRemote(memoryStore(), '1.0.0')).toBeNull();
});
