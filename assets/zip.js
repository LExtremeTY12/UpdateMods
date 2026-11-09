import { AppError } from './i18n.js';
import { sha512 } from './modrinth.js';

// Os JAR já estão comprimidos. Guardá-los sem recompressão poupa tempo.
export const maxZipBytes = 200 * 1024 * 1024;

const encoder = new TextEncoder();
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? (value >>> 1) ^ 0xedb88320 : value >>> 1;
  return value;
});

function crc32(bytes) {
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

function zipStore(entries) {
  const files = [];
  const directory = [];
  let offset = 0;
  let directorySize = 0;
  for (const { filename, bytes } of entries) {
    const name = encoder.encode(filename);
    const crc = crc32(bytes);
    const file = header(30, 0x04034b50);
    file.u16(4, 20);
    file.u16(6, 0x800);
    file.u16(12, 0x21);
    file.u32(14, crc);
    file.u32(18, bytes.length);
    file.u32(22, bytes.length);
    file.u16(26, name.length);
    files.push(file.buffer, name, bytes);

    const entry = header(46, 0x02014b50);
    entry.u16(4, 20);
    entry.u16(6, 20);
    entry.u16(8, 0x800);
    entry.u16(14, 0x21);
    entry.u32(16, crc);
    entry.u32(20, bytes.length);
    entry.u32(24, bytes.length);
    entry.u16(28, name.length);
    entry.u32(42, offset);
    directory.push(entry.buffer, name);

    offset += file.buffer.byteLength + name.length + bytes.length;
    directorySize += entry.buffer.byteLength + name.length;
  }
  const end = header(22, 0x06054b50);
  end.u16(8, entries.length);
  end.u16(10, entries.length);
  end.u32(12, directorySize);
  end.u32(16, offset);
  return new Blob([...files, ...directory, end.buffer], { type: 'application/zip' });
}

function archiveFilename(name, used) {
  const clean = name.normalize('NFC').replace(/[^\p{L}\p{N}._+() -]/gu, '_');
  let base = clean.replace(/^\.+/, '').replace(/\.jar$/i, '').replace(/[ .]+$/, '') || 'mod';
  if (/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(base)) base = '_' + base;
  while (encoder.encode(base).length > 180) base = Array.from(base).slice(0, -1).join('');

  let candidate = base + '.jar';
  for (let suffix = 2; used.has(candidate.toLowerCase()); suffix++) {
    candidate = base + '-' + suffix + '.jar';
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

async function downloadJar(file, remaining, onProgress) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  try {
    const response = await fetch(file.url, { credentials: 'omit', signal: controller.signal });
    if (!response.ok || !response.body) throw new AppError('jarUnavailable', { file: file.filename });

    const reader = response.body.getReader();
    const chunks = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > remaining) {
        await reader.cancel();
        throw new AppError('zipLimit');
      }
      chunks.push(value);
      if (file.size > 0) onProgress(Math.min(length / file.size, 1));
    }

    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    if (!file.hashes?.sha512 || await sha512(bytes) !== file.hashes.sha512) {
      throw new AppError('jarIntegrity', { file: file.filename });
    }
    return bytes;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) {
      throw new AppError('jarNetwork', { file: file.filename });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function makeModsZip(files, onProgress) {
  const used = new Set();
  const entries = [];
  let remaining = maxZipBytes;

  for (const [index, file] of files.entries()) {
    onProgress({ done: index, fraction: 0, filename: file.filename });
    const bytes = await downloadJar(file, remaining, fraction => {
      onProgress({ done: index, fraction, filename: file.filename });
    });
    remaining -= bytes.length;
    entries.push({ filename: archiveFilename(file.filename, used), bytes });
  }

  return zipStore(entries);
}
