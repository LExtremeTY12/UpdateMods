import { AppError, errorText, savedLanguage, setLanguage, t } from './i18n.js';
import { gameVersions } from './modrinth.js';
import { inspectProject, targetVersions, updateProject } from './fabric-project.js';
import { readProjectZip } from './project-archive.js';
import { writeZip } from './zip-format.js';

const byId = id => document.getElementById(id);
const form = byId('project-form');
const input = byId('project-file');
const drop = byId('project-drop');
const target = byId('project-target');
const prepare = byId('update-project');
const result = byId('project-result');
const download = byId('project-download');
const notices = new Map();
const encoder = new TextEncoder();

let busy = false;
let current = null;
let catalog;
let downloadUrl;
let menuLabel = 'projectSelectFile';
let resultChanges = [];

function renderNotice(id) {
  const { content, error } = notices.get(id);
  const node = byId(id);
  node.hidden = !content;
  node.textContent = typeof content === 'function' ? content() : content && t(content);
  node.classList.toggle('error', error);
}

function notice(id, content = '', error = false) {
  notices.set(id, { content, error });
  renderNotice(id);
}

function controls() {
  input.disabled = busy;
  drop.classList.toggle('disabled', busy);
  target.disabled = busy || target.options.length < 2;
  prepare.disabled = busy || !current || !target.value;
}

function updateMenu(label, options = []) {
  menuLabel = label;
  target.replaceChildren(new Option(t(label), ''), ...options.map(version => new Option(version, version)));
}

function resetResult() {
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = undefined;
  download.removeAttribute('href');
  download.removeAttribute('download');
  result.hidden = true;
  resultChanges = [];
  notice('project-run-note');
}

async function addFile(files) {
  if (busy || !files.length) return;
  current = null;
  resetResult();
  updateMenu('projectSelectFile');
  busy = true;
  controls();
  try {
    const [file] = files;
    if (files.length !== 1 || !/\.zip$/i.test(file.name)) throw new AppError('projectFileType');
    notice('project-file-note', 'projectReading');
    const entries = await readProjectZip(file);
    const project = inspectProject(entries);
    catalog ??= (await gameVersions()).versions;
    const options = targetVersions(catalog, project.sourceVersion);
    current = { file, entries, project };
    notice('project-file-note', () => t('projectSource', { file: file.name, version: project.sourceVersion }));
    updateMenu(options.length ? 'chooseVersion' : 'projectNoTargets', options);
  } catch (error) {
    notice('project-file-note', () => errorText(error, 'projectFailed'), true);
  } finally {
    busy = false;
    controls();
  }
}

function display(value) {
  if (value === undefined) return t('projectNotSet');
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function changeLine(change) {
  return display(change.before) + ' → ' + display(change.after);
}

function renderChanges() {
  const rows = resultChanges.map(change => {
    const row = document.createElement('li');
    row.className = 'result-row';
    const title = document.createElement('div');
    const key = document.createElement('code');
    key.textContent = change.key;
    const file = document.createElement('small');
    file.textContent = change.file;
    title.append(key, file);
    const value = document.createElement('span');
    value.className = 'result-meta';
    value.textContent = changeLine(change);
    row.append(title, value);
    return row;
  });
  byId('project-changes').replaceChildren(...rows);
}

function reportEntry(entries, project, version, changes) {
  const used = new Set(entries.map(entry => entry.filename.replace(/\/$/, '').normalize('NFC').toLowerCase()));
  const base = project.root + 'UPDATEMODS-REPORT';
  let filename = base + '.txt';
  for (let suffix = 2; used.has(filename.normalize('NFC').toLowerCase()); suffix++) {
    filename = base + '-' + suffix + '.txt';
  }
  const report = [
    t('projectReportTitle'),
    'Minecraft ' + project.sourceVersion + ' → ' + version + ' · Fabric',
    '',
    ...changes.map(change => change.file + ' · ' + change.key + ': ' + changeLine(change)),
    '',
    t('projectScope'),
    t('projectReportHint'),
    '',
  ];
  return { filename, bytes: encoder.encode(report.join('\r\n')), mode: 0o100644 };
}

async function prepareProject(event) {
  event.preventDefault();
  if (busy || !current || !target.value) return;
  const version = target.value;
  const { file, entries, project } = current;
  resetResult();
  busy = true;
  controls();
  try {
    notice('project-run-note', 'projectChecking');
    const updated = await updateProject(entries, project, version);
    notice('project-run-note', 'projectPacking');
    const archive = writeZip([...updated.entries, reportEntry(updated.entries, project, version, updated.changes)]);
    downloadUrl = URL.createObjectURL(archive);
    download.href = downloadUrl;
    download.download = file.name.replace(/\.zip$/i, '') + '-mc-' + version + '.zip';
    byId('project-result-versions').textContent = 'Minecraft ' + project.sourceVersion + ' → ' + version + ' · Fabric';
    resultChanges = updated.changes;
    renderChanges();
    result.hidden = false;
    notice('project-run-note');
    byId('project-result-heading').focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest' });
  } catch (error) {
    notice('project-run-note', () => errorText(error, 'projectFailed'), true);
  } finally {
    busy = false;
    controls();
  }
}

function changeLanguage(language) {
  setLanguage(language, 'projectPageTitle');
  target.options[0].textContent = t(menuLabel);
  for (const id of notices.keys()) renderNotice(id);
  if (!result.hidden) renderChanges();
}

input.addEventListener('change', () => {
  const files = Array.from(input.files);
  input.value = '';
  addFile(files);
});
drop.addEventListener('dragover', event => {
  event.preventDefault();
  if (!busy) drop.classList.add('dragging');
});
drop.addEventListener('dragleave', () => drop.classList.remove('dragging'));
drop.addEventListener('drop', event => {
  event.preventDefault();
  drop.classList.remove('dragging');
  addFile(event.dataTransfer.files);
});
target.addEventListener('change', () => {
  resetResult();
  controls();
});
form.addEventListener('submit', prepareProject);
for (const button of document.querySelectorAll('[data-language]')) {
  button.addEventListener('click', () => changeLanguage(button.dataset.language));
}
changeLanguage(savedLanguage());
controls();
