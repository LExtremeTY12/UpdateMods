import { AppError } from './i18n.js';
import { crc32 } from './zip-format.js';

export const maxProjectZip = 64 * 1024 * 1024;
const maxExpandedBytes = 128 * 1024 * 1024;
const maxEntries = 2500;
const decoder = new TextDecoder('utf-8', { fatal: true });

function invalid() {
  return new AppError('projectZipInvalid');
}

function zipPath(bytes) {
  let path;
  try {
    path = decoder.decode(bytes);
  } catch {
    throw invalid();
  }
  const components = path.replace(/\/$/, '').split('/');
  if (!path || path.length > 1024 || /[\\:\x00-\x1f\x7f]/.test(path) ||
      components.some(part => !part || /[ .]$/.test(part) ||
        /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) {
    throw invalid();
  }
  return path;
}

function centralDirectory(view) {
  const u16 = at => view.getUint16(at, true);
  const u32 = at => view.getUint32(at, true);
  const min = Math.max(0, view.byteLength - 22 - 65535);
  for (let end = view.byteLength - 22; end >= min; end--) {
    if (u32(end) !== 0x06054b50 || end + 22 + u16(end + 20) !== view.byteLength) continue;
    const entries = u16(end + 10);
    const size = u32(end + 12);
    const start = u32(end + 16);
    if (u16(end + 4) || u16(end + 6) || u16(end + 8) !== entries || start + size !== end) throw invalid();
    if (entries > maxEntries) throw new AppError('projectZipTooLarge');
    return { entries, start, end };
  }
  throw invalid();
}

async function inflate(data, expected) {
  let stream;
  try {
    stream = new DecompressionStream('deflate-raw');
  } catch {
    throw new AppError('projectBrowserUnsupported');
  }
  const reader = new Blob([data]).stream().pipeThrough(stream).getReader();
  const output = new Uint8Array(expected);
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (length + value.length > output.length) {
        await reader.cancel();
        throw invalid();
      }
      output.set(value, length);
      length += value.length;
    }
  } catch {
    throw invalid();
  }
  if (length !== expected) throw invalid();
  return output;
}

export async function readProjectZip(file) {
  if (!file.size || file.size > maxProjectZip) throw new AppError('projectZipTooLarge');
  const buffer = await file.arrayBuffer();
  const archive = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const u16 = at => view.getUint16(at, true);
  const u32 = at => view.getUint32(at, true);
  const directory = centralDirectory(view);
  const entries = [];
  const paths = new Map();
  let offset = directory.start;
  let expanded = 0;

  for (let index = 0; index < directory.entries; index++) {
    if (offset + 46 > directory.end || u32(offset) !== 0x02014b50) throw invalid();
    const flags = u16(offset + 8);
    const method = u16(offset + 10);
    const time = u16(offset + 12);
    const date = u16(offset + 14);
    const checksum = u32(offset + 16);
    const compressedSize = u32(offset + 20);
    const size = u32(offset + 24);
    const nameLength = u16(offset + 28);
    const next = offset + 46 + nameLength + u16(offset + 30) + u16(offset + 32);
    const local = u32(offset + 42);
    if (next > directory.end || local + 30 > directory.start || u16(offset + 34) ||
        (flags & 0x41) || ![0, 8].includes(method) || u32(local) !== 0x04034b50) throw invalid();

    const filename = zipPath(archive.subarray(offset + 46, offset + 46 + nameLength));
    const isFolder = filename.endsWith('/');
    const key = filename.replace(/\/$/, '').normalize('NFC').toLowerCase();
    if (paths.has(key) || (isFolder && size !== 0)) throw invalid();
    paths.set(key, isFolder);

    const attrs = u32(offset + 38);
    const unixMode = (u16(offset + 4) >> 8) === 3 ? attrs >>> 16 : 0;
    const type = unixMode & 0o170000;
    if (type && type !== (isFolder ? 0o040000 : 0o100000)) throw invalid();
    const mode = unixMode ? (unixMode & 0o777) | type : undefined;

    const localName = local + 30;
    const localNameEnd = localName + u16(local + 26);
    const dataStart = localNameEnd + u16(local + 28);
    if (dataStart + compressedSize > directory.start || u16(local + 8) !== method ||
        (u16(local + 6) & 0x41) || zipPath(archive.subarray(localName, localNameEnd)) !== filename) {
      throw invalid();
    }
    expanded += size;
    if (expanded > maxExpandedBytes) throw new AppError('projectZipTooLarge');
    const data = archive.subarray(dataStart, dataStart + compressedSize);
    const bytes = method === 0 ? data : await inflate(data, size);
    if (bytes.length !== size || crc32(bytes) !== checksum) throw invalid();
    entries.push({ filename, bytes, packed: { method, data }, mode, date, time });
    offset = next;
  }
  if (offset !== directory.end) throw invalid();

  for (const key of paths.keys()) {
    const parts = key.split('/');
    for (let depth = 1; depth < parts.length; depth++) {
      if (paths.get(parts.slice(0, depth).join('/')) === false) throw invalid();
    }
  }
  return entries;
}
