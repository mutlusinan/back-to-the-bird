import { createCssInjector } from '../../src/core/css-injector';

function fakeApi(failInsert = false) {
  const calls: string[] = [];
  return {
    calls,
    api: {
      insertCSS: async (t: { tabId: number; frameId: number; css: string }) => {
        calls.push(`insert ${t.tabId}:${t.frameId} ${t.css}`);
        if (failInsert) throw new Error('no access');
      },
      removeCSS: async (t: { tabId: number; frameId: number; css: string }) => void calls.push(`remove ${t.tabId}:${t.frameId} ${t.css}`),
    },
  };
}

test('the first css is inserted', async () => {
  const { api, calls } = fakeApi();
  expect(await createCssInjector(api).handle(1, 0, 'A')).toEqual({ ok: true });
  expect(calls).toEqual(['insert 1:0 A']);
});

test('a later css replaces the earlier one in the same frame', async () => {
  const { api, calls } = fakeApi();
  const injector = createCssInjector(api);
  await injector.handle(1, 0, 'A');
  await injector.handle(1, 0, 'B');
  expect(calls).toEqual(['insert 1:0 A', 'remove 1:0 A', 'insert 1:0 B']);
});

test('frames are tracked separately', async () => {
  const { api, calls } = fakeApi();
  const injector = createCssInjector(api);
  await injector.handle(1, 0, 'A');
  await injector.handle(1, 7, 'B');
  expect(calls).toEqual(['insert 1:0 A', 'insert 1:7 B']);
});

test('a failed insert reports not ok', async () => {
  const { api } = fakeApi(true);
  expect(await createCssInjector(api).handle(1, 0, 'A')).toEqual({ ok: false });
});

test('forget drops a closed tab', async () => {
  const { api, calls } = fakeApi();
  const injector = createCssInjector(api);
  await injector.handle(1, 0, 'A');
  injector.forget(1);
  await injector.handle(1, 0, 'B');
  expect(calls).toEqual(['insert 1:0 A', 'insert 1:0 B']);
});

test('concurrent calls for one frame run in order', async () => {
  const { api, calls } = fakeApi();
  const injector = createCssInjector(api);
  await Promise.all([injector.handle(1, 0, 'A'), injector.handle(1, 0, 'B')]);
  expect(calls).toEqual(['insert 1:0 A', 'remove 1:0 A', 'insert 1:0 B']);
});
