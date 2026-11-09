import { AppError } from './i18n.js';

const API = 'https://api.modrinth.com/v2';
const CDN = 'https://cdn.modrinth.com';
const projectPattern = /^[a-z0-9_-]{1,64}$/i;

async function request(path, data, missingAllowed = false) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(API + path, {
      credentials: 'omit',
      signal: controller.signal,
      ...(data && {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    });
    if (response.status === 404 && missingAllowed) return null;
    if (response.status === 429) {
      throw new AppError('rateLimited');
    }
    if (!response.ok) throw new AppError('apiFailed');
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError || error.name === 'AbortError' || error instanceof SyntaxError) {
      throw new AppError('apiUnreachable');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function gameVersions() {
  try {
    const versions = await request('/tag/game_version');
    if (Array.isArray(versions) && versions.length) return { versions, offline: false };
  } catch {
    // A lista de reserva mantém o seletor disponível quando a API falha.
  }
  const response = await fetch(new URL('./game-versions.json', import.meta.url));
  if (!response.ok) throw new AppError('versionsFailed');
  const versions = await response.json();
  if (!Array.isArray(versions) || !versions.length) throw new AppError('versionsFailed');
  return { versions, offline: true };
}

export function projectSlug(value) {
  const input = value.trim();
  if (projectPattern.test(input)) return input;
  try {
    const url = new URL(input.includes('://') ? input : 'https://' + input);
    const [, type, slug] = url.pathname.split('/');
    if (url.origin === 'https://modrinth.com' && ['mod', 'project'].includes(type) && projectPattern.test(slug)) {
      return slug;
    }
  } catch {
    return null;
  }
  return null;
}

export async function sha512(bytes) {
  const hash = await crypto.subtle.digest('SHA-512', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function findByHashes(hashes, target) {
  const payload = { hashes, algorithm: 'sha512' };
  return Promise.all([
    request('/version_files', payload),
    request('/version_files/update', {
      ...payload,
      game_versions: [target.game],
      loaders: [target.loader],
    }),
  ]);
}

export function projectVersions(project, target) {
  const query = new URLSearchParams({
    game_versions: JSON.stringify([target.game]),
    loaders: JSON.stringify([target.loader]),
    include_changelog: 'false',
  });
  return request('/project/' + encodeURIComponent(project) + '/version?' + query, undefined, true);
}

export function compatibleFile(version, target) {
  if (!version?.game_versions?.includes(target.game) || !version.loaders?.includes(target.loader)) return null;
  const files = (version.files || []).filter(file => {
    if (typeof file.filename !== 'string' || !/\.jar$/i.test(file.filename)) return false;
    if (file.file_type && file.file_type !== 'unknown') return false;
    try {
      return new URL(file.url).origin === CDN;
    } catch {
      return false;
    }
  });
  return files.find(file => file.primary) || files[0] || null;
}
