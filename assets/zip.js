import { AppError } from './i18n.js';
import { sha512 } from './modrinth.js';
import { writeZip } from './zip-format.js';

// Os JAR já estão comprimidos. Guardá-los sem recompressão poupa tempo.
export const maxZipBytes = 200 * 1024 * 1024;

const encoder = new TextEncoder();

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

  return writeZip(entries);
}
