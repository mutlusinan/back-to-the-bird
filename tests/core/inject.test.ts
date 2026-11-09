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

test('falls back to one style element when the background says no', async () => {
  const inject = createInjector(document, async () => ({ ok: false }));
  await inject('A');
  await inject('B');
  expect(ownStyles()).toHaveLength(1);
  expect(ownStyles()[0]!.textContent).toBe('B');
});

test('a dead extension context falls back without throwing', async () => {
  const inject = createInjector(document, async () => {
    throw new Error('Extension context invalidated.');
  });
  await expect(inject('A')).resolves.toBeUndefined();
  expect(ownStyles()[0]!.textContent).toBe('A');
});

test('after falling back it stops messaging the background', async () => {
  let calls = 0;
  const inject = createInjector(document, async () => (calls++, { ok: false }));
  await inject('A');
  await inject('B');
  expect(calls).toBe(1);
});
