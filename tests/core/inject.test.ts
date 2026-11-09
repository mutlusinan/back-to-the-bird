import { createInjector } from '../../src/core/inject';
import type { ToBackground } from '../../src/core/messages';

const ownStyles = () => document.querySelectorAll('style[data-ot]');

beforeEach(() => {
  document.head.innerHTML = '';
});

test('no style element when the background inserts the css', async () => {
  const sent: ToBackground[] = [];
  const inject = createInjector(document, async (m) => (sent.push(m), { ok: true }));
  await inject('A');
  expect(sent).toEqual([{ type: 'ot:css', css: 'A' }]);
  expect(ownStyles()).toHaveLength(0);
});

test('each message names the css inserted before it', async () => {
  const sent: ToBackground[] = [];
  const inject = createInjector(document, async (m) => (sent.push(m), { ok: true }));
  await inject('A');
  await inject('B');
  expect(sent).toEqual([
    { type: 'ot:css', css: 'A' },
    { type: 'ot:css', css: 'B', previous: 'A' },
  ]);
});

test('falls back to one style element when the background says no', async () => {
  const inject = createInjector(document, async () => ({ ok: false }));
  await inject('A');
  await inject('B');
  expect(ownStyles()).toHaveLength(1);
  expect(ownStyles()[0]!.textContent).toBe('B');
});

test('a dead extension context reports death and adds no style', async () => {
  let dead = 0;
  const inject = createInjector(
    document,
    async () => {
      throw new Error('Extension context invalidated.');
    },
    () => dead++,
  );
  await expect(inject('A')).resolves.toBeUndefined();
  expect(dead).toBe(1);
  expect(ownStyles()).toHaveLength(0);
});

test('an unreachable background still falls back', async () => {
  const inject = createInjector(document, async () => {
    throw new Error('Could not establish connection. Receiving end does not exist.');
  });
  await inject('A');
  expect(ownStyles()[0]!.textContent).toBe('A');
});

test('after falling back it stops messaging the background', async () => {
  let calls = 0;
  const inject = createInjector(document, async () => (calls++, { ok: false }));
  await inject('A');
  await inject('B');
  expect(calls).toBe(1);
});
