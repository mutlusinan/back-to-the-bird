import { SheetScanner } from '../../src/engine/scan';

function addStyle(css: string, attrs: Record<string, string> = {}): HTMLStyleElement {
  const el = document.createElement('style');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.textContent = css;
  document.head.appendChild(el);
  return el;
}

beforeEach(() => {
  document.head.innerHTML = '';
});

test('the first scan returns every rule of a readable sheet', () => {
  addStyle('.a{color:red}.b{color:blue}');
  const result = new SheetScanner(document).scanNew();
  expect(result.rules.map((r) => r.selectorText)).toEqual(['.a', '.b']);
  expect(result.readable).toBe(1);
  expect(result.unreadable).toBe(0);
});

test('a rule appended later is returned alone', () => {
  const el = addStyle('.a{color:red}.b{color:blue}');
  const scanner = new SheetScanner(document);
  scanner.scanNew();
  el.sheet!.insertRule('.x{color:red}', 2);
  expect(scanner.scanNew().rules.map((r) => r.selectorText)).toEqual(['.x']);
});

test('a rule inserted in the middle is returned alone', () => {
  const el = addStyle('.a{color:red}.b{color:blue}');
  const scanner = new SheetScanner(document);
  scanner.scanNew();
  el.sheet!.insertRule('.mid{color:red}', 1);
  expect(scanner.scanNew().rules.map((r) => r.selectorText)).toEqual(['.mid']);
});

test('nothing new means no rules', () => {
  addStyle('.a{color:red}');
  const scanner = new SheetScanner(document);
  scanner.scanNew();
  expect(scanner.scanNew().rules).toEqual([]);
});

test('rules inside @media carry the condition', () => {
  addStyle('@media (min-width: 500px){ .m{color:red} }');
  const [rule] = new SheetScanner(document).scanNew().rules;
  expect(rule!.selectorText).toBe('.m');
  expect(rule!.media).toBe('(min-width: 500px)');
});

test('an unreadable sheet is counted and does not throw', () => {
  const el = addStyle('.a{color:red}');
  Object.defineProperty(el.sheet!, 'cssRules', {
    get() {
      throw new DOMException('blocked', 'SecurityError');
    },
  });
  const result = new SheetScanner(document).scanNew();
  expect(result.unreadable).toBe(1);
  expect(result.readable).toBe(0);
  expect(result.rules).toEqual([]);
});

test('our own sheets are skipped', () => {
  addStyle('.own{color:red}', { 'data-ot': '' });
  expect(new SheetScanner(document).scanNew().rules).toEqual([]);
});

test('rules inside any grouping rule (@supports) are returned', () => {
  addStyle('@supports (display: grid) { .s{color:red} }');
  const [rule] = new SheetScanner(document).scanNew().rules;
  expect(rule!.selectorText).toBe('.s');
});
