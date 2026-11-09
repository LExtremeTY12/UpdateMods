const encoder = new TextEncoder();
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? (value >>> 1) ^ 0xedb88320 : value >>> 1;
  return value;
});

export function crc32(bytes) {
  let value = 0xffffffff;
  for (let index = 0; index < bytes.length; index++) {
    value = (value >>> 8) ^ crcTable[(value ^ bytes[index]) & 255];
  }
  return (value ^ 0xffffffff) >>> 0;
}

function header(length, magic) {
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  view.setUint32(0, magic, true);
  return {
    buffer,
    u16: (at, value) => view.setUint16(at, value, true),
    u32: (at, value) => view.setUint32(at, value, true),
  };
}

export function writeZip(entries) {
  const files = [];
  const directory = [];
  let offset = 0;
  let directorySize = 0;
  for (const { filename, bytes, packed, mode, date = 0x21, time = 0 } of entries) {
    const name = encoder.encode(filename);
    const data = packed?.data ?? bytes;
    const method = packed?.method ?? 0;
    const crc = crc32(bytes);
    const file = header(30, 0x04034b50);
    file.u16(4, 20);
    file.u16(6, 0x800);
    file.u16(8, method);
    file.u16(10, time);
    file.u16(12, date);
    file.u32(14, crc);
    file.u32(18, data.length);
    file.u32(22, bytes.length);
    file.u16(26, name.length);
    files.push(file.buffer, name, data);

    const entry = header(46, 0x02014b50);
    entry.u16(4, mode === undefined ? 20 : 0x0314);
    entry.u16(6, 20);
    entry.u16(8, 0x800);
    entry.u16(10, method);
    entry.u16(12, time);
    entry.u16(14, date);
    entry.u32(16, crc);
    entry.u32(20, data.length);
    entry.u32(24, bytes.length);
    entry.u16(28, name.length);
    entry.u32(38, ((mode ?? 0) << 16) | (filename.endsWith('/') ? 0x10 : 0));
    entry.u32(42, offset);
    directory.push(entry.buffer, name);

    offset += file.buffer.byteLength + name.length + data.length;
    directorySize += entry.buffer.byteLength + name.length;
  }
  const end = header(22, 0x06054b50);
  end.u16(8, entries.length);
  end.u16(10, entries.length);
  end.u32(12, directorySize);
  end.u32(16, offset);
  return new Blob([...files, ...directory, end.buffer], { type: 'application/zip' });
}

