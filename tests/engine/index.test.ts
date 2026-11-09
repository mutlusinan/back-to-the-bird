import { createEngine, type EngineDeps } from '../../src/engine/index';
import { parsePaletteMap } from '../../src/engine/palette-map';
import type { RuleLike } from '../../src/engine/remap';
import type { ScanResult } from '../../src/engine/scan';

const map = parsePaletteMap({
  version: 3,
  light: { color: { 'rgb(29, 155, 240)': 'accent' } },
  night: { color: { 'rgb(29, 155, 240)': 'accent' } },
  'font-family': {},
  'font-size': {},
  'border-radius': {},
  xTokens: { light: { '--x-fg-brand': 'accent' }, night: {} },
});

const rule = (selectorText: string): RuleLike => ({
  selectorText,
  style: { getPropertyValue: (p) => (p === 'color' ? 'rgba(29,155,240,1.00)' : '') },
});

function setup(batches: RuleLike[][], over: Partial<EngineDeps> = {}) {
  const applied: string[] = [];
  const store = new Map<string, string>();
  let clock = 0;
  const deps: EngineDeps = {
    map,
    scan: (): ScanResult => ({ rules: batches.shift() ?? [], readable: 1, unreadable: 0 }),
    applyCss: async (css) => void applied.push(css),
    cache: { get: async (k) => store.get(k), set: async (k, v) => void store.set(k, v) },
    now: () => clock,
    budgetMs: 4,
    ...over,
  };
  return { engine: createEngine(deps), applied, store, tickClock: (ms: number) => (clock += ms) };
}

test('start applies the cached css once', async () => {
  const { engine, applied, store } = setup([]);
  store.set('ot:engineCss:v3', 'CACHED');
  await engine.start();
  expect(applied).toEqual(['CACHED']);
});

test('start applies nothing without a cache', async () => {
  const { engine, applied } = setup([]);
  await engine.start();
  expect(applied).toEqual([]);
});

test('a matching rule is applied, cached and recorded', async () => {
  const { engine, applied, store } = setup([[rule('.r-a')]]);
  await engine.tick();
  expect(applied).toHaveLength(1);
  expect(applied[0]).toContain('.r-a{color:var(--ot-accent)}');
  expect(applied[0]).toContain('--x-fg-brand:var(--ot-accent)');
  expect(applied[0]).toContain('!important');
  expect(store.get('ot:engineCss:v3')).toBe(applied[0]);
  expect(engine.matchedKeys().has('light:color:accent')).toBe(true);
  expect(engine.sheetStats()).toEqual({ readable: 1, unreadable: 0 });
});

test('a tick without new rules applies nothing', async () => {
  const { engine, applied } = setup([[rule('.r-a')], []]);
  await engine.tick();
  await engine.tick();
  expect(applied).toHaveLength(1);
});

test('work beyond the budget continues on later ticks', async () => {
  const rules = Array.from({ length: 10_000 }, (_, i) => rule(`.r-${i}`));
  let clock = 0;
  const { engine, applied } = setup([rules], { now: () => clock++ });
  const processed = () => (applied.at(-1)?.match(/\.r-\d+\{color/g)?.length ?? 0) / 2;
  expect(await engine.tick()).toBe(true);
  expect(processed()).toBeGreaterThan(0);
  expect(processed()).toBeLessThan(500);
  while (await engine.tick());
  expect(processed()).toBe(10_000);
});

test('a failing applyCss is reported to the caller', async () => {
  const { engine } = setup([[rule('.r-a')]], { applyCss: async () => Promise.reject(new Error('gone')) });
  await expect(engine.tick()).rejects.toThrow('gone');
});
