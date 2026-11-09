import { compatibleFile, findByHashes, gameVersions, projectSlug, projectVersions, sha512 } from './modrinth.js';
import { makeModsZip, maxZipBytes } from './zip.js';
import { errorText, savedLanguage, setLanguage, t } from './i18n.js';

const byId = id => document.getElementById(id);
const form = byId('resolver');
const game = byId('game');
const loader = byId('loader');
const fileInput = byId('files');
const drop = byId('drop');
const projectInput = byId('project-input');
const zipButton = byId('prepare-zip');
const zipLink = byId('download-zip');
const zipProgress = byId('zip-progress');
const zipMeter = byId('zip-meter');
const limit = 100;
const maxFileBytes = 200 * 1024 * 1024;
const fileHashes = new WeakMap();
const selected = [];
const statuses = ['available', 'unavailable', 'unknown', 'error'];
const languageButtons = document.querySelectorAll('[data-language]');
const notices = new Map();
let versionMenuLabel = 'versionsLoading';

let working = false;
let activeResults = null;
let zipUrl = null;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function paintNotice(id) {
  const { content, error } = notices.get(id);
  const node = byId(id);
  node.textContent = typeof content === 'function' ? content() : content && t(content);
  node.hidden = !content;
  node.classList.toggle('error', error);
}

function notice(id, content = '', error = false) {
  notices.set(id, { content, error });
  paintNotice(id);
}

function localizeVersionMenu() {
  if (game.options[0]) game.options[0].textContent = t(versionMenuLabel);
  const [releases, older] = game.querySelectorAll('optgroup');
  if (releases) releases.label = t('officialVersions');
  if (older) older.label = t('olderVersions');
}

function changeLanguage(language) {
  setLanguage(language);
  localizeVersionMenu();
  renderSelection();
  if (activeResults) renderResults(false);
  for (const id of notices.keys()) paintNotice(id);
}

function refreshControls() {
  for (const node of form.querySelectorAll('input, button, select')) node.disabled = working;
  for (const button of languageButtons) button.disabled = working;
  game.disabled = working || game.options.length < 2;
  byId('resolve').disabled = working || !selected.length || !game.value || !loader.value;
  drop.classList.toggle('disabled', working);
  zipButton.disabled = working || !activeResults?.rows.some(row => row.status === 'available');
  for (const node of byId('result-list').querySelectorAll('button, input')) node.disabled = working;
}

function resetZip() {
  if (zipUrl) URL.revokeObjectURL(zipUrl);
  zipUrl = null;
  zipLink.hidden = true;
  zipLink.removeAttribute('href');
  zipLink.removeAttribute('download');
  zipButton.hidden = false;
  zipProgress.hidden = true;
  notice('zip-note');
}

function hideResults() {
  activeResults = null;
  resetZip();
  byId('results').hidden = true;
  notice('resolve-note');
}

function renderSelection() {
  byId('selection').hidden = !selected.length;
  byId('selection-count').textContent = t(selected.length === 1 ? 'selectedOne' : 'selectedMany', { count: selected.length });
  const rows = selected.map((item, index) => {
    const row = element('li');
    const name = element('span', item.name);
    name.title = item.name;
    const remove = element('button', t('remove'), 'text-button');
    remove.type = 'button';
    remove.setAttribute('aria-label', t('removeFile', { file: item.name }));
    remove.addEventListener('click', () => {
      selected.splice(index, 1);
      hideResults();
      notice('file-note');
      renderSelection();
    });
    row.append(name, remove);
    return row;
  });
  byId('selection-list').replaceChildren(...rows);
  refreshControls();
}

function addFiles(files) {
  if (working) return;
  let ignored = 0;
  const before = selected.length;
  for (const file of files) {
    if (!/\.jar$/i.test(file.name) || !file.size || file.size > maxFileBytes || selected.length >= limit) {
      ignored++;
      continue;
    }
    const duplicate = selected.some(item => item.file?.name === file.name &&
      item.file.size === file.size && item.file.lastModified === file.lastModified);
    if (!duplicate) selected.push({ file, name: file.name });
  }
  if (selected.length !== before) hideResults();
  notice('file-note', ignored ? 'ignoredFiles' : '', !!ignored);
  renderSelection();
}

function addProject() {
  const project = projectSlug(projectInput.value);
  if (!project || selected.length >= limit) {
    notice('file-note', project ? 'selectionFull' : 'invalidProject', true);
    return;
  }
  if (!selected.some(item => item.project === project)) {
    selected.push({ project, name: project });
    hideResults();
  }
  projectInput.value = '';
  notice('file-note');
  renderSelection();
}

async function loadVersions() {
  const retry = byId('retry-versions');
  const previousVersion = game.value;
  retry.hidden = true;
  notice('catalog-note');
  versionMenuLabel = 'versionsLoading';
  game.replaceChildren(new Option(t(versionMenuLabel), ''));
  refreshControls();
  try {
    const { versions, offline } = await gameVersions();
    const releases = element('optgroup');
    const other = element('optgroup');
    const seen = new Set();
    const ordered = [...versions].sort((a, b) => b.date.localeCompare(a.date));
    for (const version of ordered) {
      if (seen.has(version.version)) continue;
      seen.add(version.version);
      const group = version.version_type === 'release' ? releases : other;
      group.append(new Option(version.version, version.version));
    }
    versionMenuLabel = 'chooseVersion';
    game.replaceChildren(new Option(t(versionMenuLabel), ''), releases, other);
    localizeVersionMenu();
    if (seen.has(previousVersion)) game.value = previousVersion;
    if (offline) {
      notice('catalog-note', 'offlineVersions');
      retry.hidden = false;
    }
  } catch {
    versionMenuLabel = 'versionsFailed';
    game.replaceChildren(new Option(t(versionMenuLabel), ''));
    retry.hidden = false;
  }
  refreshControls();
}

function available(item, version, file) {
  return { ...item, status: 'available', version, download: file };
}

async function findProject(item, project, target) {
  const versions = await projectVersions(project, target);
  if (!versions) return { ...item, status: 'unknown' };
  for (const version of [...versions].sort((a, b) => b.date_published.localeCompare(a.date_published))) {
    const file = compatibleFile(version, target);
    if (file) return available(item, version, file);
  }
  return { ...item, status: 'unavailable' };
}

async function resolveMods(event) {
  event.preventDefault();
  if (working || !selected.length || !game.value || !loader.value) return;
  if (!crypto.subtle && selected.some(item => item.file && !item.project)) {
    notice('resolve-note', 'secureOrigin', true);
    return;
  }
  const target = { game: game.value, loader: loader.value, loaderName: loader.selectedOptions[0].textContent };
  hideResults();
  working = true;
  refreshControls();
  try {
    const hashed = [];
    const jars = selected.filter(item => item.file && !item.project);
    for (const [index, item] of jars.entries()) {
      notice('resolve-note', () => t('hashing', { current: index + 1, total: jars.length }));
      try {
        let hash = fileHashes.get(item.file);
        if (!hash) {
          hash = await sha512(await item.file.arrayBuffer());
          fileHashes.set(item.file, hash);
        }
        hashed.push([item, hash]);
      } catch {
        hashed.push([item, null]);
      }
    }
    notice('resolve-note', 'searching');
    const hashes = [...new Set(hashed.map(([, hash]) => hash).filter(Boolean))];
    const rows = new Map();
    if (hashes.length) {
      const [original, matches] = await findByHashes(hashes, target);
      for (const [item, hash] of hashed) {
        const version = matches[hash];
        const file = compatibleFile(version, target);
        const status = !hash ? 'error' : original[hash] ? 'unavailable' : 'unknown';
        rows.set(item, file ? available(item, version, file) : { ...item, status });
      }
    } else {
      for (const [item] of hashed) rows.set(item, { ...item, status: 'error' });
    }
    const projects = selected.filter(item => item.project);
    for (let offset = 0; offset < projects.length; offset += 4) {
      await Promise.all(projects.slice(offset, offset + 4).map(async item => {
        try {
          rows.set(item, await findProject(item, item.project, target));
        } catch (error) {
          rows.set(item, { ...item, status: 'error', error });
        }
      }));
    }
    activeResults = { target, rows: selected.map(item => rows.get(item)) };
    renderResults();
    byId('result-heading').focus({ preventScroll: true });
    byId('results').scrollIntoView({ block: 'nearest' });
    notice('resolve-note');
  } catch (error) {
    notice('resolve-note', () => errorText(error, 'searchFailed'), true);
  } finally {
    working = false;
    refreshControls();
  }
}

function rowDescription(row, target) {
  switch (row.status) {
    case 'available':
      return row.version.version_number + (row.version.version_type === 'release' ? '' : ' · ' + row.version.version_type) +
        ' · ' + row.download.filename;
    case 'unavailable':
      return t('noCompatibleVersion', { game: target.game, loader: target.loaderName });
    case 'unknown':
      return t(row.project ? 'projectNotFound' : 'fileNotFound');
    default:
      return errorText(row.error, 'identifyFailed');
  }
}

function projectRecovery(row, index) {
  const details = element('details', '', 'add-project');
  const summary = element('summary', t('provideLink'));
  const entry = element('div', '', 'link-entry');
  const input = element('input');
  input.type = 'text';
  input.placeholder = t('linkExample');
  input.setAttribute('aria-label', t('linkForMod', { file: row.name }));
  const button = element('button', t('verify'), 'button secondary compact');
  button.type = 'button';
  const feedback = element('p', '', 'notice error');
  feedback.hidden = true;
  feedback.setAttribute('role', 'status');
  async function lookup() {
    if (working) return;
    const project = projectSlug(input.value);
    feedback.hidden = !!project;
    feedback.textContent = t('invalidRecoveryLink');
    if (!project) return;
    working = true;
    refreshControls();
    try {
      const updated = await findProject({ ...row, project, error: undefined }, project, activeResults.target);
      activeResults.rows[index] = updated;
      const selectedItem = selected[index];
      if (updated.status !== 'unknown') selectedItem.project = project;
      renderResults();
      byId('result-heading').focus({ preventScroll: true });
    } catch (error) {
      feedback.textContent = errorText(error, 'searchFailed');
      feedback.hidden = false;
    } finally {
      working = false;
      refreshControls();
    }
  }
  button.addEventListener('click', lookup);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') lookup();
  });
  entry.append(input, button);
  details.append(summary, entry, feedback);
  return details;
}

function renderResults(resetArchive = true) {
  const { target, rows } = activeResults;
  byId('result-target').textContent = 'Minecraft ' + target.game + ' · ' + target.loaderName;
  const counts = statuses.map(status => {
    const total = rows.filter(row => row.status === status).length;
    return total ? element('span', total + ' · ' + t(status), 'tag ' + status) : null;
  }).filter(Boolean);
  byId('counts').replaceChildren(...counts);
  byId('result-list').replaceChildren(...rows.map((row, index) => {
    const item = element('li', '', 'result-row');
    const title = element('div');
    title.append(element('strong', row.name), element('small', rowDescription(row, target)));
    const meta = element('div', '', 'result-meta');
    meta.append(element('span', t(row.status), 'tag ' + row.status));
    if (row.download) {
      const link = element('a', t('downloadJar'));
      link.href = row.download.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      meta.append(link);
    }
    item.append(title, meta);
    if (row.status === 'unknown' || row.status === 'error') item.append(projectRecovery(row, index));
    return item;
  }));
  if (resetArchive) resetZip();
  byId('results').hidden = false;
  refreshControls();
}

function saveFile(blob, name) {
  const link = element('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function exportName(target) {
  return 'mods-' + target.game + '-' + target.loader;
}

function exportLinks() {
  const { target, rows } = activeResults;
  const lines = ['UpdateMods', 'Minecraft ' + target.game + ' · ' + target.loaderName, ''];
  for (const row of rows) {
    lines.push(row.name + ' — ' + t(row.status), rowDescription(row, target));
    if (row.download) lines.push(row.download.url);
    lines.push('');
  }
  saveFile(new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' }), exportName(target) + '.txt');
}

async function prepareZip() {
  if (working || !activeResults) return;
  const { target, rows } = activeResults;
  const mods = new Map();
  for (const row of rows) {
    if (!row.download) continue;
    const id = row.version.project_id || row.download.url;
    if (!mods.has(id)) mods.set(id, row.download);
  }
  const files = [...mods.values()];
  if (!files.length) return;
  if (files.reduce((total, file) => total + (file.size || 0), 0) > maxZipBytes) {
    notice('zip-note', 'zipTooLarge', true);
    return;
  }
  resetZip();
  working = true;
  zipMeter.max = files.length;
  zipMeter.value = 0;
  zipProgress.hidden = false;
  refreshControls();
  try {
    let currentFile = -1;
    const archive = await makeModsZip(files, ({ done, fraction, filename }) => {
      zipMeter.value = done + fraction;
      if (done !== currentFile) {
        currentFile = done;
        notice('zip-note', () => t('zipping', { current: done + 1, total: files.length, file: filename }));
      }
    });
    zipUrl = URL.createObjectURL(archive);
    zipLink.href = zipUrl;
    zipLink.download = exportName(target) + '.zip';
    zipLink.hidden = false;
    zipButton.hidden = true;
    const skipped = rows.filter(row => !row.download).length;
    notice('zip-note', () => {
      const ready = t(files.length === 1 ? 'zipReadyOne' : 'zipReadyMany', { count: files.length });
      if (!skipped) return ready;
      return ready + ' ' + t(skipped === 1 ? 'skippedOne' : 'skippedMany', { count: skipped });
    });
    zipLink.focus({ preventScroll: true });
  } catch (error) {
    notice('zip-note', () => errorText(error, 'zipFailed') + ' ' + t('zipRetry'), true);
  } finally {
    zipProgress.hidden = true;
    working = false;
    refreshControls();
  }
}

fileInput.addEventListener('change', () => {
  addFiles(fileInput.files);
  fileInput.value = '';
});
drop.addEventListener('dragover', event => {
  event.preventDefault();
  if (!working) drop.classList.add('dragging');
});
drop.addEventListener('dragleave', () => drop.classList.remove('dragging'));
drop.addEventListener('drop', event => {
  event.preventDefault();
  drop.classList.remove('dragging');
  addFiles(event.dataTransfer.files);
});
byId('clear').addEventListener('click', () => {
  selected.length = 0;
  hideResults();
  notice('file-note');
  renderSelection();
});
byId('add-project').addEventListener('click', addProject);
projectInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addProject();
  }
});
for (const control of [game, loader]) {
  control.addEventListener('change', () => {
    hideResults();
    refreshControls();
  });
}
byId('retry-versions').addEventListener('click', loadVersions);
form.addEventListener('submit', resolveMods);
byId('links').addEventListener('click', exportLinks);
zipButton.addEventListener('click', prepareZip);
for (const button of languageButtons) {
  button.addEventListener('click', () => changeLanguage(button.dataset.language));
}
changeLanguage(savedLanguage());
loadVersions();
