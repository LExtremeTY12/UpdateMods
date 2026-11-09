import { AppError } from './i18n.js';
import { projectVersions } from './modrinth.js';

const fabricMeta = 'https://meta.fabricmc.net/v2/versions/';
const gamePattern = /^1\.21(?:\.(?:[1-9]|1[01]))?$/;
const versionValue = /^[a-z0-9][a-z0-9.+_-]{0,79}$/i;
const propertiesPath = 'gradle.properties';
const manifestPath = 'src/main/resources/fabric.mod.json';
const apiProperties = ['fabric_version', 'fabric_api_version'];
const gradleProperties = new Set(['minecraft_version', 'loader_version', 'yarn_mappings', ...apiProperties]);
const decoder = new TextDecoder('utf-8', { fatal: true });
const encoder = new TextEncoder();

function unsupported() {
  return new AppError('projectUnsupported');
}

function readText(entry) {
  if (entry.bytes.length > 512 * 1024) throw unsupported();
  try {
    return decoder.decode(entry.bytes);
  } catch {
    throw unsupported();
  }
}

function readProperties(text) {
  const lines = text.split(/(\r\n|\n|\r)/);
  const values = new Map();
  for (const [index, line] of lines.entries()) {
    const key = /^[ \t]*([a-z_]+)(?=[ \t=:]|$)/.exec(line)?.[1];
    if (!gradleProperties.has(key)) continue;
    const match = /^([ \t]*)([a-z_]+)([ \t]*[=:][ \t]*|[ \t]+)([^ \t]+)([ \t]*)$/.exec(line);
    if (!match) throw unsupported();
    const [, padding, name, separator, value, tail] = match;
    if (values.has(name) || !versionValue.test(value)) throw unsupported();
    values.set(name, { index, padding, separator, value, tail });
  }
  return { lines, values };
}

function readManifest(entry) {
  const text = readText(entry);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AppError('projectInvalidManifest');
  }
  if (!data || typeof data !== 'object' || Array.isArray(data) ||
      typeof data.id !== 'string' || !data.depends || Array.isArray(data.depends) ||
      typeof data.depends !== 'object') throw new AppError('projectInvalidManifest');
  return { data, text };
}

function propertyReference(lines, coordinate, name) {
  const reference = new RegExp('\\b' + name + '\\b');
  return lines.some(line => line.includes(coordinate) && reference.test(line));
}

export function inspectProject(entries) {
  const files = new Map(entries.map(entry => [entry.filename, entry]));
  const roots = [];
  for (const name of files.keys()) {
    if (name !== propertiesPath && !name.endsWith('/' + propertiesPath)) continue;
    const root = name.slice(0, -propertiesPath.length);
    if (files.has(root + manifestPath) && (files.has(root + 'build.gradle') || files.has(root + 'build.gradle.kts'))) {
      roots.push(root);
    }
  }
  if (roots.length !== 1) throw unsupported();
  const [root] = roots;
  const source = entries.filter(entry => entry.filename.startsWith(root + 'src/'));
  if (!source.some(entry => entry.filename.endsWith('.java')) ||
      source.some(entry => entry.filename.endsWith('.kt'))) throw unsupported();

  const properties = files.get(root + propertiesPath);
  const { lines, values } = readProperties(readText(properties));
  const build = readText(files.get(root + 'build.gradle') || files.get(root + 'build.gradle.kts'))
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const declarations = build.split(/\r?\n/).filter(line => !line.trimStart().startsWith('//'));
  const used = (coordinate, key) => values.has(key) && propertyReference(declarations, coordinate, key);
  if (!used('com.mojang:minecraft', 'minecraft_version') ||
      !used('net.fabricmc:fabric-loader', 'loader_version')) throw unsupported();

  const sourceVersion = values.get('minecraft_version').value;
  if (!gamePattern.test(sourceVersion)) throw new AppError('projectUnsupportedVersion');
  const yarnCoordinate = 'net.fabricmc:yarn';
  const yarn = declarations.some(line => line.includes(yarnCoordinate));
  if (yarn ? !used(yarnCoordinate, 'yarn_mappings') :
      !declarations.some(line => line.includes('officialMojangMappings'))) throw unsupported();

  const apiCoordinate = 'net.fabricmc.fabric-api:fabric-api';
  const api = apiProperties.filter(key => used(apiCoordinate, key));
  const usesFabricApi = declarations.some(line => line.includes(apiCoordinate));
  if (usesFabricApi && api.length !== 1) throw unsupported();

  const manifest = files.get(root + manifestPath);
  const { data, text } = readManifest(manifest);
  return { root, sourceVersion, properties, lines, values, manifest, metadata: data, metadataText: text, yarn, apiKey: usesFabricApi ? api[0] : null };
}

function patch(version) {
  return Number(version.split('.')[2] || 0);
}

export function targetVersions(versions, source) {
  return [...new Set(versions
    .filter(item => item.version_type === 'release' && gamePattern.test(item.version) && patch(item.version) > patch(source))
    .map(item => item.version))]
    .sort((a, b) => patch(b) - patch(a));
}

async function fabricVersions(component, target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(fabricMeta + component + '/' + encodeURIComponent(target), {
      credentials: 'omit', signal: controller.signal,
    });
    if (!response.ok) throw new AppError('projectFabricUnavailable');
    const data = await response.json();
    if (!Array.isArray(data)) throw new AppError('projectFabricUnavailable');
    return data;
  } catch {
    throw new AppError('projectFabricUnavailable');
  } finally {
    clearTimeout(timer);
  }
}

async function dependencies(project, target) {
  const [loaders, yarn, api] = await Promise.all([
    fabricVersions('loader', target),
    project.yarn ? fabricVersions('yarn', target) : [],
    project.apiKey ? projectVersions('fabric-api', { game: target, loader: 'fabric' }) : [],
  ]);
  const loader = loaders.find(item => item.loader?.stable)?.loader.version;
  const mappings = yarn.find(item => item.gameVersion === target && versionValue.test(item.version))?.version;
  const fabricApi = api?.find(item => item.version_type === 'release' &&
    item.game_versions?.includes(target) && item.loaders?.includes('fabric') &&
    versionValue.test(item.version_number))?.version_number;

  if (!loader || !versionValue.test(loader) || (project.yarn && !mappings) || (project.apiKey && !fabricApi)) {
    throw new AppError('projectDependencyMissing');
  }
  return new Map([
    ['minecraft_version', target],
    ['loader_version', loader],
    ...(project.yarn ? [['yarn_mappings', mappings]] : []),
    ...(project.apiKey ? [[project.apiKey, fabricApi]] : []),
  ]);
}

function replaceText(entry, value) {
  return { ...entry, packed: undefined, bytes: encoder.encode(value) };
}

function manifestText(data, original) {
  const indentation = /^(\t+| +)"/m.exec(original)?.[1] || '  ';
  const newline = original.includes('\r\n') ? '\r\n' : '\n';
  const text = JSON.stringify(data, null, indentation).replace(/\n/g, newline);
  return /[\r\n]$/.test(original) ? text + newline : text;
}

export async function updateProject(entries, project, target) {
  if (!gamePattern.test(target) || patch(target) <= patch(project.sourceVersion)) {
    throw new AppError('projectInvalidTarget');
  }
  const updates = await dependencies(project, target);
  const lines = [...project.lines];
  const changes = [];
  for (const [name, value] of updates) {
    const { index, padding, separator, value: before, tail } = project.values.get(name);
    if (value === before) continue;
    lines[index] = padding + name + separator + value + tail;
    changes.push({ file: propertiesPath, key: name, before, after: value });
  }

  const { depends: original } = project.metadata;
  const depends = { ...original, minecraft: target, fabricloader: '>=' + updates.get('loader_version') };
  if (project.apiKey && Object.hasOwn(original, 'fabric-api') && original['fabric-api'] !== '*') {
    depends['fabric-api'] = updates.get(project.apiKey);
  }
  for (const key of ['minecraft', 'fabricloader', 'fabric-api']) {
    if (original[key] === depends[key]) continue;
    changes.push({ file: manifestPath, key: 'depends.' + key, before: original[key], after: depends[key] });
  }
  const files = new Map([
    [project.properties.filename, replaceText(project.properties, lines.join(''))],
    [project.manifest.filename, replaceText(project.manifest,
      manifestText({ ...project.metadata, depends }, project.metadataText))],
  ]);
  return { entries: entries.map(entry => files.get(entry.filename) || entry), changes };
}
