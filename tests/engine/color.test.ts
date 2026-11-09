import { normalizeColor } from '../../src/engine/color';

test.each([
  ['rgba(239,243,244,1.00)', 'rgb(239, 243, 244)'],
  ['rgb(29, 155, 240)', 'rgb(29, 155, 240)'],
  ['#1D9BF0', 'rgb(29, 155, 240)'],
  ['#fff', 'rgb(255, 255, 255)'],
  ['#1d9bf01a', 'rgba(29, 155, 240, 0.102)'],
  ['rgba(29, 155, 240, 0.1)', 'rgba(29, 155, 240, 0.1)'],
  ['rgba(29,155,240,0.10)', 'rgba(29, 155, 240, 0.1)'],
  ['rgb(29 155 240 / 10%)', 'rgba(29, 155, 240, 0.1)'],
  ['transparent', 'rgba(0, 0, 0, 0)'],
  [' RGB(0,0,0) ', 'rgb(0, 0, 0)'],
])('normalizeColor(%s) → %s', (input, out) => expect(normalizeColor(input)).toBe(out));

test.each(['currentcolor', 'var(--x)', 'inherit', '', 'red', '#12'])('normalizeColor(%s) → null', (v) =>
  expect(normalizeColor(v)).toBeNull());
