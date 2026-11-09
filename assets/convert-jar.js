import { readArchive } from './archive.js';
import { AppError } from './i18n.js';
import { writeZip } from './zip-format.js';

const versions = new Map([
  ['1.20.6', 41], ['1.21', 48], ['1.21.1', 48], ['1.21.2', 57], ['1.21.3', 57], ['1.21.4', 61],
]);
const tagFolders = new Map([
  ['items', 'item'], ['blocks', 'block'], ['entity_types', 'entity_type'],
  ['fluids', 'fluid'], ['game_events', 'game_event'],
]);
const recipeTypes = ['minecraft:crafting_shaped', 'minecraft:crafting_shapeless'];
const categories = ['building', 'redstone', 'equipment', 'misc'];
const id = /^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/;
const decoder = new TextDecoder('utf-8', { fatal: true });
const encoder = new TextEncoder();

const object = value => value && typeof value === 'object' && !Array.isArray(value);
const validId = value => typeof value === 'string' && id.test(value);
const removedTag = value => /^(?:minecraft:)?music_discs$/.test(value);
const keysIn = (value, keys) => object(value) && Object.keys(value).every(key => keys.includes(key));

function dataError(file) {
  return new AppError('converterData', { file });
}

function json(entry) {
  try {
    if (entry.bytes.length > 512 * 1024) throw dataError(entry.filename);
    const value = JSON.parse(decoder.decode(entry.bytes));
    if (!object(value)) throw dataError(entry.filename);
    return value;
  } catch {
    throw dataError(entry.filename);
  }
}

function jsonEntry(entry, value, filename = entry.filename) {
  return { ...entry, filename, packed: undefined, bytes: encoder.encode(JSON.stringify(value, null, 2) + '\n') };
}

function readSource(requirement) {
  if (typeof requirement !== 'string') return null;
  return /^(?:[=~]|>=\s*)?(1\.20\.6|1\.21(?:\.1)?)(?:\s+<\s*1\.21(?:\.2)?)?$/.exec(requirement.trim())?.[1] || null;
}

function ingredient(value, file) {
  if (keysIn(value, ['item']) && validId(value.item)) return value.item;
  if (keysIn(value, ['tag']) && validId(value.tag) && !removedTag(value.tag)) return '#' + value.tag;
  if (!Array.isArray(value) || !value.length || value.length > 64) throw dataError(file);
  const alternatives = value.map(part => {
    if (Array.isArray(part)) throw dataError(file);
    return ingredient(part, file);
  });
  if (alternatives.length === 1) return alternatives[0];
  if (alternatives.some(part => part.startsWith('#'))) return null;
  return alternatives;
}

function recipe(entry) {
  const value = json(entry);
  const name = typeof value.type === 'string' && !value.type.includes(':') ? 'minecraft:' + value.type : value.type;
  const shaped = name === recipeTypes[0];
  const extra = shaped ? ['pattern', 'key'] : ['ingredients'];
  if (!recipeTypes.includes(name) ||
      !keysIn(value, ['type', 'category', 'group', 'show_notification', 'result', ...extra]) ||
      (value.category !== undefined && !categories.includes(value.category)) ||
      (value.group !== undefined && typeof value.group !== 'string') ||
      (value.show_notification !== undefined && typeof value.show_notification !== 'boolean') ||
      !keysIn(value.result, ['id', 'count']) || !validId(value.result.id) ||
      (value.result.count !== undefined && (!Number.isInteger(value.result.count) || value.result.count < 1 || value.result.count > 64))) {
    throw dataError(entry.filename);
  }

  if (!shaped) {
    if (!Array.isArray(value.ingredients) || value.ingredients.length < 1 || value.ingredients.length > 9) {
      throw dataError(entry.filename);
    }
    const converted = value.ingredients.map(part => ingredient(part, entry.filename));
    return { converted: converted.includes(null) ? null : { ...value, ingredients: converted } };
  }

  const rows = value.pattern;
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > 3 || !object(value.key) ||
      !rows.every(row => typeof row === 'string' && row.length >= 1 && row.length <= 3 && row.length === rows[0].length)) {
    throw dataError(entry.filename);
  }
  const symbols = new Set(rows.join('').replace(/ /g, ''));
  const pairs = Object.entries(value.key);
  if (!symbols.size || pairs.length !== symbols.size || pairs.some(([symbol]) => !symbols.has(symbol))) {
    throw dataError(entry.filename);
  }
  const converted = pairs.map(([symbol, part]) => [symbol, ingredient(part, entry.filename)]);
  return { converted: converted.some(([, part]) => part === null) ? null : { ...value, key: Object.fromEntries(converted) } };
}

function checkTag(entry) {
  const value = json(entry);
  const tagId = value => typeof value === 'string' && validId(value.replace(/^#/, ''));
  if (!keysIn(value, ['replace', 'values']) || (value.replace !== undefined && typeof value.replace !== 'boolean') ||
      !Array.isArray(value.values) || value.values.some(part => !tagId(part) &&
        !(keysIn(part, ['id', 'required']) && tagId(part.id) && typeof part.required === 'boolean'))) {
    throw dataError(entry.filename);
  }
  if (value.values.some(part => {
    const reference = typeof part === 'string' ? part : part.id;
    return reference.startsWith('#') && removedTag(reference.slice(1));
  })) {
    throw dataError(entry.filename);
  }
}

function dataFile(entry, legacy) {
  const file = entry.filename;
  const parts = file.split('/');
  if (!parts.every(part => /^[a-z0-9_.-]+$/.test(part)) || !file.endsWith('.json')) throw dataError(file);
  if (parts.length >= 4 && parts[2] === (legacy ? 'recipes' : 'recipe')) {
    parts[2] = 'recipe';
    return { entry, filename: parts.join('/'), type: 'recipe', ...recipe(entry) };
  }
  if (parts.length >= 5 && parts[2] === 'tags') {
    const tag = legacy ? tagFolders.get(parts[3]) : [...tagFolders.values()].find(folder => folder === parts[3]);
    if (tag) {
      parts[3] = tag;
      checkTag(entry);
      return { entry, filename: parts.join('/'), type: 'tag' };
    }
  }
  throw dataError(file);
}

function checkMetadata(metadata, entries) {
  const hasEntries = key => metadata[key] !== undefined &&
    (!metadata[key] || typeof metadata[key] !== 'object' || Object.keys(metadata[key]).length > 0);
  if (entries.some(entry => /\.(?:class|jar)$/i.test(entry.filename)) ||
      ['entrypoints', 'mixins', 'jars', 'accessWidener', 'languageAdapters'].some(hasEntries)) {
    throw new AppError('converterCode');
  }
  if (entries.some(entry => /^META-INF\/[^/]+\.(?:SF|RSA|DSA|EC)$/i.test(entry.filename))) {
    throw new AppError('converterSigned');
  }
  if (metadata.schemaVersion !== 1 || !/^[a-z][a-z0-9_-]{1,63}$/.test(metadata.id ?? '') ||
      !object(metadata.depends) || ![undefined, '*', 'server'].includes(metadata.environment) ||
      ['breaks', 'conflicts'].some(hasEntries)) {
    throw new AppError('converterFormat');
  }
  const { depends } = metadata;
  const minimum = value => value === undefined || value === '*' || /^>=\d+(?:\.\d+)*$/.test(value);
  if (!keysIn(depends, ['minecraft', 'fabricloader', 'java', 'fabric-api']) ||
      !minimum(depends.fabricloader) || !minimum(depends.java) ||
      ![undefined, '*'].includes(depends['fabric-api'])) {
    throw new AppError('converterDependencies');
  }
}

export async function inspectJar(file) {
  if (!/\.(?:jar|zip)$/i.test(file.name)) throw new AppError('converterFileType');
  let entries = await readArchive(file);
  let filename = file.name;
  if (/\.zip$/i.test(filename)) {
    const jars = entries.filter(entry => !entry.filename.startsWith('__MACOSX/') && /\.jar$/i.test(entry.filename));
    if (jars.length !== 1) throw new AppError('converterOneJar');
    filename = jars[0].filename.split('/').at(-1);
    entries = await readArchive(new Blob([jars[0].bytes]));
  }

  const manifest = entries.find(entry => entry.filename === 'fabric.mod.json');
  if (!manifest) throw new AppError('converterFabric');
  const metadata = json(manifest);
  checkMetadata(metadata, entries);
  const source = readSource(metadata.depends.minecraft);
  if (!source) throw new AppError('converterSource');

  const icon = typeof metadata.icon === 'string' ? [metadata.icon] : Object.values(metadata.icon || {});
  const asset = entries.find(entry => /^assets\//.test(entry.filename) &&
    !entry.filename.endsWith('/') && !icon.includes(entry.filename));
  if (asset) throw dataError(asset.filename);

  const packEntry = entries.find(entry => entry.filename === 'pack.mcmeta');
  const pack = packEntry ? json(packEntry) : null;
  if (pack && (!object(pack.pack) || pack.pack.pack_format !== versions.get(source) ||
      ['overlays', 'filter', 'features'].some(key => Object.hasOwn(pack, key)))) throw dataError('pack.mcmeta');

  const data = entries.filter(entry => entry.filename.startsWith('data/') && !entry.filename.endsWith('/'))
    .map(entry => dataFile(entry, source === '1.20.6'));
  if (!data.length) throw new AppError('converterNoData');
  const targets = [...versions].filter(([, format]) =>
    format > versions.get(source) &&
    (format < 57 || data.every(item => item.type !== 'recipe' || item.converted !== null)) &&
    (source === '1.20.6' || data.some(item => item.type === 'recipe'))
  ).map(([version]) => version);
  if (!targets.length) throw new AppError('converterNoTargets');

  return { filename, entries, manifest, metadata, source, packEntry, pack, data, targets };
}

export function convertJar(mod, version) {
  if (!mod.targets.includes(version)) throw new AppError('converterTarget');
  const format = versions.get(version);
  const changed = new Map();
  let moved = 0;
  let recipes = 0;
  for (const item of mod.data) {
    const rewrite = format >= 57 && item.type === 'recipe';
    if (item.filename !== item.entry.filename) moved++;
    if (rewrite) recipes++;
    changed.set(item.entry.filename, rewrite ? jsonEntry(item.entry, item.converted, item.filename) :
      { ...item.entry, filename: item.filename });
  }
  changed.set(mod.manifest.filename, jsonEntry(mod.manifest, {
    ...mod.metadata,
    depends: { ...mod.metadata.depends, minecraft: version, 'fabric-api': '*' },
  }));

  if (mod.packEntry) {
    const { supported_formats, ...pack } = mod.pack.pack;
    changed.set(mod.packEntry.filename, jsonEntry(mod.packEntry, { ...mod.pack, pack: { ...pack, pack_format: format } }));
  }
  const entries = mod.entries.filter(entry => !entry.filename.startsWith('data/') || !entry.filename.endsWith('/'))
    .map(entry => changed.get(entry.filename) || entry);
  if (new Set(entries.map(entry => entry.filename.toLowerCase())).size !== entries.length) {
    throw new AppError('converterFormat');
  }
  return {
    archive: new Blob([writeZip(entries)], { type: 'application/java-archive' }),
    filename: mod.filename.replace(/\.jar$/i, '') + '-mc-' + version + '-experimental.jar',
    moved,
    recipes,
  };
}
