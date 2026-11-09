const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
const FUNCTIONAL = /^rgba?\((.*)\)$/;

/**
 * Converts a CSS color to one canonical spelling — `rgb(r, g, b)` or
 * `rgba(r, g, b, a)` with alpha rounded to 3 decimals — so values written by
 * different sources compare equal. Returns null for anything that is not a
 * concrete rgb/hex color (keywords, variables, named colors).
 */
export function normalizeColor(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (v === 'transparent') return format(0, 0, 0, 0);
  const hex = HEX.exec(v);
  if (hex) return fromHex(hex[1]!);
  const fn = FUNCTIONAL.exec(v);
  if (fn) return fromFunctional(fn[1]!);
  return null;
}

function fromHex(digits: string): string {
  const full = digits.length <= 4 ? [...digits].map((d) => d + d).join('') : digits;
  const channel = (i: number) => parseInt(full.slice(i * 2, i * 2 + 2), 16);
  const alpha = full.length === 8 ? channel(3) / 255 : 1;
  return format(channel(0), channel(1), channel(2), alpha);
}

function fromFunctional(inner: string): string | null {
  let parts: string[];
  if (inner.includes(',')) {
    parts = inner.split(',').map((p) => p.trim());
  } else {
    const [rgb, alpha] = inner.split('/').map((p) => p.trim());
    parts = (rgb ?? '').split(/\s+/);
    if (alpha !== undefined) parts.push(alpha);
  }
  if (parts.length !== 3 && parts.length !== 4) return null;
  const [r, g, b] = parts.slice(0, 3).map(parseChannel);
  const a = parts[3] === undefined ? 1 : parseAlpha(parts[3]);
  if (r === null || g === null || b === null || a === null) return null;
  if (r === undefined || g === undefined || b === undefined) return null;
  return format(r, g, b, a);
}

function parseChannel(part: string): number | null {
  if (!/^\d+(\.\d+)?$/.test(part)) return null;
  const n = Math.round(Number(part));
  return n <= 255 ? n : null;
}

function parseAlpha(part: string): number | null {
  const percent = part.endsWith('%');
  const body = percent ? part.slice(0, -1) : part;
  if (!/^(\d+(\.\d+)?|\.\d+)$/.test(body)) return null;
  const n = Number(body) / (percent ? 100 : 1);
  return n <= 1 ? n : null;
}

function format(r: number, g: number, b: number, alpha: number): string {
  const a = Number(alpha.toFixed(3));
  return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}
