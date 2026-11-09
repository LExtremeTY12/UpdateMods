import { AppError, errorText, savedLanguage, setLanguage, t } from './i18n.js';
import { convertJar, inspectJar } from './convert-jar.js';

const byId = id => document.getElementById(id);
const form = byId('converter-form');
const input = byId('converter-file');
const drop = byId('converter-drop');
const target = byId('converter-target');
const button = byId('convert');
const result = byId('converter-result');
const download = byId('converter-download');
const notices = new Map();

let busy = false;
let current;
let archiveUrl;
let summary;
let menuLabel = 'converterSelectFile';

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

function controls() {
  input.disabled = busy;
  drop.classList.toggle('disabled', busy);
  target.disabled = busy || !current;
  button.disabled = busy || !current || !target.value;
}

function showOptions(label, versions = []) {
  menuLabel = label;
  target.replaceChildren(new Option(t(label), ''), ...versions.map(version => new Option(version, version)));
}

function clearResult() {
  if (archiveUrl) URL.revokeObjectURL(archiveUrl);
  archiveUrl = undefined;
  summary = undefined;
  result.hidden = true;
  download.removeAttribute('href');
  download.removeAttribute('download');
  notice('converter-run-note');
}

async function selectFile(files) {
  if (busy || !files.length) return;
  current = undefined;
  clearResult();
  showOptions('converterSelectFile');
  busy = true;
  controls();
  notice('converter-file-note', 'converterReading');
  try {
    if (files.length !== 1) throw new AppError('converterFileType');
    current = await inspectJar(files[0]);
    const { filename, source, targets } = current;
    notice('converter-file-note', () => t('converterDetected', { file: filename, version: source }));
    showOptions('chooseVersion', targets);
  } catch (error) {
    notice('converter-file-note', () => errorText(error, 'converterFailed'), true);
  } finally {
    busy = false;
    controls();
  }
}

function renderSummary() {
  const messages = [];
  if (summary.moved) messages.push(t(summary.moved === 1 ? 'converterMovedOne' : 'converterMovedMany', { count: summary.moved }));
  if (summary.recipes) messages.push(t(summary.recipes === 1 ? 'converterRecipeOne' : 'converterRecipeMany', { count: summary.recipes }));
  byId('converter-summary').replaceChildren(...messages.map(message => {
    const tag = document.createElement('span');
    tag.className = 'tag available';
    tag.textContent = message;
    return tag;
  }));
}

function prepare(event) {
  event.preventDefault();
  if (busy || !current || !target.value) return;
  clearResult();
  try {
    const { archive, filename, moved, recipes } = convertJar(current, target.value);
    archiveUrl = URL.createObjectURL(archive);
    download.href = archiveUrl;
    download.download = filename;
    summary = { moved, recipes };
    renderSummary();
    byId('converter-result-versions').textContent = 'Minecraft ' + current.source + ' → ' + target.value + ' · Fabric';
    result.hidden = false;
    byId('converter-result-heading').focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest' });
  } catch (error) {
    notice('converter-run-note', () => errorText(error, 'converterFailed'), true);
  }
}

function changeLanguage(language) {
  setLanguage(language, 'converterTitle');
  target.options[0].textContent = t(menuLabel);
  for (const id of notices.keys()) paintNotice(id);
  if (summary) renderSummary();
}

input.addEventListener('change', () => {
  const files = Array.from(input.files);
  input.value = '';
  selectFile(files);
});
drop.addEventListener('dragover', event => {
  event.preventDefault();
  if (!busy) drop.classList.add('dragging');
});
drop.addEventListener('dragleave', () => drop.classList.remove('dragging'));
drop.addEventListener('drop', event => {
  event.preventDefault();
  drop.classList.remove('dragging');
  selectFile(event.dataTransfer.files);
});
target.addEventListener('change', () => {
  clearResult();
  controls();
});
form.addEventListener('submit', prepare);
for (const button of document.querySelectorAll('[data-language]')) {
  button.addEventListener('click', () => changeLanguage(button.dataset.language));
}
changeLanguage(savedLanguage());
controls();
