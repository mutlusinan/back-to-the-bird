// Renders the extension icon (white "rewind" mark on a blue rounded square)
// to public/icon/{16,32,48,128}.png using only Node built-ins.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const BLUE = [0x1d, 0xa1, 0xf2];
const SIZES = [16, 32, 48, 128];
const SAMPLES = 4; // supersampling per axis

// Shapes in a 0..1 unit square.
const RADIUS = 0.22;
const TRIANGLES = [
  [[0.18, 0.5], [0.5, 0.28], [0.5, 0.72]],
  [[0.46, 0.5], [0.78, 0.28], [0.78, 0.72]],
];

function inRoundedSquare(x, y) {
  const cx = Math.min(Math.max(x, RADIUS), 1 - RADIUS);
  const cy = Math.min(Math.max(y, RADIUS), 1 - RADIUS);
  return (x - cx) ** 2 + (y - cy) ** 2 <= RADIUS ** 2;
}

function inTriangle(x, y, [a, b, c]) {
  const side = (p, q) => (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]);
  const d1 = side(a, b), d2 = side(b, c), d3 = side(c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

function render(size) {
  const rows = [];
  for (let py = 0; py < size; py++) {
    const row = [0]; // PNG filter type: none
    for (let px = 0; px < size; px++) {
      let bg = 0, fg = 0;
      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const x = (px + (sx + 0.5) / SAMPLES) / size;
          const y = (py + (sy + 0.5) / SAMPLES) / size;
          if (!inRoundedSquare(x, y)) continue;
          if (TRIANGLES.some((t) => inTriangle(x, y, t))) fg++;
          else bg++;
        }
      }
      const cover = (bg + fg) / SAMPLES ** 2;
      const white = fg / Math.max(bg + fg, 1);
      const rgb = BLUE.map((c) => Math.round(c + (255 - c) * white));
      row.push(...rgb, Math.round(cover * 255));
    }
    rows.push(Buffer.from(row));
  }
  return png(size, Buffer.concat(rows));
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size, raw) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icon', { recursive: true });
for (const size of SIZES) writeFileSync(`public/icon/${size}.png`, render(size));
console.log(`wrote ${SIZES.map((s) => `${s}.png`).join(', ')}`);
