import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to create a PNG buffer given width, height, and a pixel generator function(x, y) returning [r, g, b, a]
function createPng(width, height, getPixel) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // Helper to construct chunks with length, type, data, and CRC32
  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const typeAndData = Buffer.concat([typeBuf, data]);
    const crc = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // Simple CRC32 table & function
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);  // Bit depth
  ihdr.writeUInt8(6, 9);  // Color type (RGBA)
  ihdr.writeUInt8(0, 10); // Compression
  ihdr.writeUInt8(0, 11); // Filter
  ihdr.writeUInt8(0, 12); // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw Image Data (Filter byte 0 + RGBA pixels per row)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate ScholarConnect Brand Icon Pixel ([R, G, B, A])
function generateScholarConnectIconPixel(x, y, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  // Background: Rounded Navy Square / Circle (#1a3a8f -> RGB 26, 58, 143)
  const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  
  // Outer Navy Circle / Background
  if (distFromCenter > radius) {
    return [255, 255, 255, 0]; // Transparent outer padding
  }

  // Base Navy Fill: #1a3a8f
  let r = 26;
  let g = 58;
  let b = 143;

  // Gold Ring (#f7941d -> RGB 247, 148, 29)
  const ringInner = radius * 0.88;
  const ringOuter = radius * 0.96;
  if (distFromCenter >= ringInner && distFromCenter <= ringOuter) {
    r = 247;
    g = 148;
    b = 29;
  }

  // Draw Graduation Cap / Logo Symbol in Center
  // Cap Diamond (Top)
  const nx = (x - cx) / (width * 0.25);
  const ny = (y - (cy - height * 0.05)) / (height * 0.18);
  if (Math.abs(nx) + Math.abs(ny) <= 1.0) {
    // White Cap Top
    r = 255;
    g = 255;
    b = 255;
  }

  // Cap Base / Skullcap
  const bx = (x - cx) / (width * 0.14);
  const by = (y - (cy + height * 0.08)) / (height * 0.08);
  if (bx * bx + by * by <= 1.0 && y >= cy + height * 0.05) {
    r = 247;
    g = 148;
    b = 29;
  }

  // Tassel Hanging Right
  const tx = (x - (cx + width * 0.22)) / (width * 0.03);
  const ty = (y - (cy + height * 0.08)) / (height * 0.12);
  if (tx * tx + ty * ty <= 1.0) {
    r = 247;
    g = 148;
    b = 29;
  }

  return [r, g, b, 255];
}

// Ensure public directory exists
const publicDir = path.resolve('c:/Users/Vinayak.B.Amasi/OneDrive/Projects/Scholarship Portal/client/public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192 PNG
const png192 = createPng(192, 192, (x, y) => generateScholarConnectIconPixel(x, y, 192, 192));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
console.log('Generated pwa-192x192.png');

// Generate 512x512 PNG
const png512 = createPng(512, 512, (x, y) => generateScholarConnectIconPixel(x, y, 512, 512));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png512);
console.log('Generated pwa-512x512.png & apple-touch-icon.png');

// Generate 64x64 favicon.ico (as PNG icon)
const png64 = createPng(64, 64, (x, y) => generateScholarConnectIconPixel(x, y, 64, 64));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png64);
console.log('Generated favicon.ico');
