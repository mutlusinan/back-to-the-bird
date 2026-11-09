import { createScheduler, type TickInfo } from '../../src/core/scheduler';

const FAKED = [
  'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'requestAnimationFrame', 'cancelAnimationFrame', 'Date',
] as const;

let scheduler: { start(): void; stop(): void; poke(): void } | undefined;
let ticks: TickInfo[];

function start(onTick: (info: TickInfo) => boolean | Promise<boolean> = () => false, early = { ms: 500, duration: 0 }) {
  scheduler = createScheduler({
    root: document.body,
    onTick: (info) => {
      ticks.push(info);
      return onTick(info);
    },
    earlyPollMs: early.ms,
    earlyPollDurationMs: early.duration,
  });
  scheduler.start();
}

const add = () => document.body.appendChild(document.createElement('div'));

beforeEach(() => {
  vi.useFakeTimers({ toFake: [...FAKED] });
  document.body.innerHTML = '';
  ticks = [];
});

afterEach(() => {
  scheduler?.stop();
  vi.useRealTimers();
});

test('nodes added in the same frame produce one tick', async () => {
  start();
  add();
  add();
  add();
  await vi.advanceTimersByTimeAsync(50);
  expect(ticks).toHaveLength(1);
  expect(ticks[0]!.added).toHaveLength(3);
});

test('a route change is reported once', async () => {
  start();
  history.pushState({}, '', '/x');
  add();
  await vi.advanceTimersByTimeAsync(50);
  add();
  await vi.advanceTimersByTimeAsync(50);
  expect(ticks.map((t) => t.routeChanged)).toEqual([true, false]);
});

test('popstate triggers a tick', async () => {
  start();
  window.dispatchEvent(new PopStateEvent('popstate'));
  await vi.advanceTimersByTimeAsync(50);
  expect(ticks).toHaveLength(1);
});

test('early polling ticks every 500 ms for 10 s, then stops', async () => {
  start(undefined, { ms: 500, duration: 10_000 });
  await vi.advanceTimersByTimeAsync(10_000);
  const during = ticks.length;
  expect(during).toBeGreaterThanOrEqual(19);
  expect(during).toBeLessThanOrEqual(20);
  await vi.advanceTimersByTimeAsync(5_000);
  expect(ticks).toHaveLength(during);
});

test('a tick that reports more work schedules another tick without mutations', async () => {
  let remaining = 2;
  start(() => --remaining > 0);
  add();
  await vi.advanceTimersByTimeAsync(100);
  expect(ticks).toHaveLength(2);
  expect(ticks[1]!.added).toEqual([]);
});

test('added text nodes still tick but are not passed on', async () => {
  start();
  document.body.appendChild(document.createTextNode('x'));
  await vi.advanceTimersByTimeAsync(50);
  expect(ticks).toHaveLength(1);
  expect(ticks[0]!.added).toEqual([]);
});

test('a data-testid change is reported as changed', async () => {
  const el = document.createElement('button');
  el.setAttribute('data-testid', 'like');
  document.body.appendChild(el);
  start();
  el.setAttribute('data-testid', 'unlike');
  await vi.advanceTimersByTimeAsync(50);
  expect(ticks).toHaveLength(1);
  expect(ticks[0]!.changed).toEqual([el]);
  expect(ticks[0]!.added).toEqual([]);
});

test('poke requests a tick without any mutation', async () => {
  start();
  scheduler!.poke();
  await vi.advanceTimersByTimeAsync(50);
  expect(ticks).toHaveLength(1);
  expect(ticks[0]!.added).toEqual([]);
});

test('no ticks run after stop', async () => {
  start(undefined, { ms: 500, duration: 10_000 });
  scheduler!.stop();
  add();
  await vi.advanceTimersByTimeAsync(2_000);
  expect(ticks).toEqual([]);
});
