// Generates the PWA icons (no dependencies — hand-rolled PNG encoder).
// Theme: near-black canvas (#0a0a0a), signal red (#ec2c2c) barbell mark.
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const BG = [10, 10, 10];
const RED = [236, 44, 44];

// --- PNG encoding -----------------------------------------------------------
const crcTable = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = ~0;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(size, rgb) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor RGB
  const stride = size * 3;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    Buffer.from(rgb.buffer, y * stride, stride).copy
      ? raw.set(Buffer.from(rgb.buffer, y * stride, stride), y * (stride + 1) + 1)
      : null;
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- drawing ----------------------------------------------------------------
// Draws at 2x and box-downsamples for antialiasing.
function makeIcon(size, { maskable = false } = {}) {
  const scale = 2;
  const S = size * scale;
  const px = new Uint8Array(S * S * 3);
  const set = (x, y, [r, g, b]) => {
    const i = (y * S + x) * 3;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
  };
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) set(x, y, BG);

  // content box (maskable keeps everything inside the central 80% safe zone)
  const m = maskable ? 0.1 : 0.06;
  const x0 = m * S, y0 = m * S, w = (1 - 2 * m) * S;
  const cx = S / 2, cy = S / 2;
  const barHalf = 0.32 * w, barT = 0.055 * w, plateR = 0.155 * w, plateX = 0.24 * w;

  const inPlate = (x, y, dir) => {
    const dx = x - (cx + dir * plateX), dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    return plateR - d; // >0 inside
  };
  for (let y = Math.floor(y0); y < S - y0; y++) {
    for (let x = Math.floor(x0); x < S - x0; x++) {
      const onBar = Math.abs(y - cy) <= barT && Math.abs(x - cx) <= barHalf + plateR * 0.6;
      const dPlate = Math.max(inPlate(x, y, -1), inPlate(x, y, 1));
      if (onBar || dPlate > 0) {
        // subtle inner ring cutout on the plates for depth
        const ring = Math.max(inPlate(x, y, -1), inPlate(x, y, 1));
        const isRing = ring > 0 && ring < 0.045 * w;
        set(x, y, isRing && !onBar ? [180, 20, 20] : RED);
      }
    }
  }

  // downsample 2x
  const out = new Uint8Array(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      for (let c = 0; c < 3; c++) {
        out[(y * size + x) * 3 + c] =
          (px[(2 * y * S + 2 * x) * 3 + c] +
            px[(2 * y * S + 2 * x + 1) * 3 + c] +
            px[((2 * y + 1) * S + 2 * x) * 3 + c] +
            px[((2 * y + 1) * S + 2 * x + 1) * 3 + c]) / 4;
      }
    }
  }
  return encodePng(size, out);
}

mkdirSync(new URL("../public/icons", import.meta.url), { recursive: true });
const out = (name, buf) => {
  writeFileSync(new URL(`../public/icons/${name}`, import.meta.url), buf);
  console.log(`public/icons/${name} (${buf.length} bytes)`);
};
out("icon-192.png", makeIcon(192));
out("icon-512.png", makeIcon(512));
out("icon-maskable-512.png", makeIcon(512, { maskable: true }));
out("apple-touch-icon.png", makeIcon(180));
