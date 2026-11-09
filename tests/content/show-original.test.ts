import { fakeBrowser } from 'wxt/testing/fake-browser';
import { SHOW_ORIGINAL_PORT } from '../../src/core/messages';
import { attachShowOriginalPort, main, type ContentController, type PortLike } from '../../src/entrypoints/content/main';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const otAttributes = () => document.documentElement.getAttributeNames().filter((n) => n.startsWith('data-ot'));
let controller: ContentController | undefined;

function fakePort() {
  const onMessage: ((m: unknown) => void)[] = [];
  const onDisconnect: (() => void)[] = [];
  const port: PortLike = {
    name: SHOW_ORIGINAL_PORT,
    onMessage: { addListener: (cb) => onMessage.push(cb) },
    onDisconnect: { addListener: (cb) => onDisconnect.push(cb) },
  };
  return {
    port,
    send: (m: unknown) => onMessage.forEach((cb) => cb(m)),
    disconnect: () => onDisconnect.forEach((cb) => cb()),
  };
}

beforeEach(async () => {
  fakeBrowser.reset();
  vi.spyOn(fakeBrowser.runtime, 'sendMessage').mockImplementation((async () => ({ ok: true })) as never);
  for (const name of otAttributes()) document.documentElement.removeAttribute(name);
  document.body.setAttribute('style', 'background-color: #FFFFFF');
  document.body.innerHTML = '';
  controller = await main({ doc: document, win: window });
  await sleep(60);
});

afterEach(() => {
  controller?.stop();
  vi.restoreAllMocks();
});

test('holding removes every data-ot attribute and letting go restores them', () => {
  const p = fakePort();
  attachShowOriginalPort(p.port, controller!.setShowOriginal);
  expect(otAttributes().length).toBeGreaterThan(0);
  p.send({ hold: true });
  expect(otAttributes()).toEqual([]);
  p.send({ hold: false });
  expect(otAttributes()).toContain('data-ot-f-palette');
});

test('closing the popup while holding restores the skin', () => {
  const p = fakePort();
  attachShowOriginalPort(p.port, controller!.setShowOriginal);
  p.send({ hold: true });
  p.disconnect();
  expect(otAttributes()).toContain('data-ot-f-palette');
});

test('the bird favicon goes away while held and comes back', async () => {
  document.body.insertAdjacentHTML('afterbegin', '<header role="banner"><h1><a href="/home"><svg></svg></a></h1></header>');
  await sleep(80);
  expect(document.querySelector('link[rel="icon"][data-ot]')).not.toBeNull();
  const p = fakePort();
  attachShowOriginalPort(p.port, controller!.setShowOriginal);
  p.send({ hold: true });
  expect(document.querySelector('link[rel="icon"][data-ot]')).toBeNull();
  p.send({ hold: false });
  expect(document.querySelector('link[rel="icon"][data-ot]')).not.toBeNull();
});
