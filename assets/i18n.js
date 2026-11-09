const messages = {
  pageTitle: ['UpdateMods — Minecraft Java', 'UpdateMods — Minecraft Java'],
  description: [
    'Encontra os teus mods de Minecraft Java na versão certa e descarrega tudo num ZIP.',
    'Find the right versions of your Minecraft Java mods and download them as a ZIP.',
  ],
  language: ['Idioma', 'Language'],
  heroTag: ['PARA MINECRAFT JAVA', 'FOR MINECRAFT JAVA'],
  heroLineOne: ['Os teus mods,', 'Your mods,'],
  heroLineTwo: ['na versão certa.', 'ready to go.'],
  intro: [
    'Mudaste de versão? Descobre que mods podes levar contigo e descarrega-os num só ZIP.',
    'Switching versions? Find out which mods you can bring along and download them in one ZIP.',
  ],
  heroAction: ['Atualizar os meus mods', 'Update my mods'],
  setupAria: ['Configurar pesquisa de mods', 'Set up mod search'],
  setupLabel: ['PREPARAR MODS', 'SET UP YOUR MODS'],
  addMods: ['Adiciona os teus mods', 'Add your mods'],
  addDescription: ['Escolhe os ficheiros da tua pasta de mods.', 'Choose files from your mods folder.'],
  dragFiles: ['Arrasta os teus mods para aqui', 'Drop your mods here'],
  or: ['ou', 'or'],
  selectFiles: ['seleciona ficheiros', 'choose files'],
  onComputer: ['no computador', 'on your computer'],
  addByLink: ['Adicionar por link do Modrinth', 'Add from a Modrinth link'],
  projectInput: ['Link ou nome curto do mod no Modrinth', 'Modrinth project link or slug'],
  add: ['Adicionar', 'Add'],
  clear: ['Limpar tudo', 'Clear all'],
  target: ['Escolhe a versão de destino', 'Choose a target version'],
  targetDescription: ['Configura o Minecraft onde vais jogar.', 'Choose the Minecraft setup you want to play on.'],
  gameVersion: ['Versão do Minecraft', 'Minecraft version'],
  versionsLoading: ['A carregar versões…', 'Loading versions…'],
  retryVersions: ['Voltar a carregar', 'Reload versions'],
  loader: ['Loader de mods', 'Mod loader'],
  chooseLoader: ['Seleciona um loader', 'Select a loader'],
  loaderHint: ['Usa o mesmo loader do teu perfil do Minecraft.', 'Use the same loader as your Minecraft profile.'],
  privacy: ['Os teus ficheiros ficam protegidos e não vão ser partilhados.', 'Your files are kept safe and won’t be shared.'],
  search: ['Procurar versões', 'Find versions'],
  results: ['RESULTADOS', 'RESULTS'],
  resultHeading: ['As versões dos teus mods', 'Your mod versions'],
  saveLinks: ['Guardar lista de links', 'Save download links'],
  prepareZip: ['Preparar ZIP', 'Prepare ZIP'],
  downloadZip: ['Descarregar ZIP', 'Download ZIP'],
  zipProgress: ['Progresso da preparação do ZIP', 'ZIP preparation progress'],
  resultFoot: [
    'O ZIP inclui os mods compatíveis da tua lista. Confirma no Modrinth se precisam de dependências adicionais.',
    'The ZIP includes the compatible mods on your list. Check Modrinth for any additional dependencies.',
  ],
  noscript: [
    'Ativa o JavaScript no browser para procurar versões e preparar o ZIP.',
    'Enable JavaScript in your browser to find versions and prepare the ZIP.',
  ],
  credit: ['Desenvolvido por LExtremeTY', 'Developed by LExtremeTY'],
  available: ['Disponível', 'Available'],
  unavailable: ['Versão indisponível', 'Version unavailable'],
  unknown: ['Não identificado', 'Unidentified'],
  error: ['Erro na consulta', 'Lookup failed'],
  selectedOne: ['1 mod adicionado', '1 mod added'],
  selectedMany: ['{count} mods adicionados', '{count} mods added'],
  remove: ['Remover', 'Remove'],
  removeFile: ['Remover {file}', 'Remove {file}'],
  ignoredFiles: [
    'Alguns ficheiros foram ignorados. São aceites até 100 ficheiros .jar de até 200 MiB cada.',
    'Some files were skipped. You can add up to 100 .jar files of up to 200 MiB each.',
  ],
  selectionFull: ['A lista já tem 100 mods.', 'The list already has 100 mods.'],
  invalidProject: [
    'Introduz um link de um mod no Modrinth ou o nome curto que aparece no link.',
    'Enter a Modrinth project link or the slug shown in the link.',
  ],
  officialVersions: ['Versões oficiais', 'Official releases'],
  olderVersions: ['Snapshots e versões antigas', 'Snapshots and older versions'],
  chooseVersion: ['Seleciona uma versão', 'Select a version'],
  offlineVersions: [
    'A mostrar a lista de reserva. Podes voltar a tentar a ligação ao Modrinth.',
    'Showing the backup list. You can retry the connection to Modrinth.',
  ],
  versionsFailed: ['Não foi possível carregar as versões', 'Could not load versions'],
  secureOrigin: [
    'Para identificar ficheiros .jar, abre o site por HTTPS ou através de localhost.',
    'Open the site over HTTPS or on localhost to identify .jar files.',
  ],
  hashing: ['A identificar ficheiros · {current}/{total}', 'Identifying files · {current}/{total}'],
  searching: ['A procurar versões no Modrinth…', 'Looking for versions on Modrinth…'],
  searchFailed: ['Não foi possível concluir a pesquisa.', 'Could not complete the search.'],
  noCompatibleVersion: [
    'Sem versão disponível para Minecraft {game} com {loader}.',
    'No version available for Minecraft {game} with {loader}.',
  ],
  projectNotFound: ['Projeto não encontrado no Modrinth.', 'Project not found on Modrinth.'],
  fileNotFound: ['O Modrinth não reconheceu este ficheiro.', 'Modrinth did not recognise this file.'],
  identifyFailed: [
    'Não foi possível identificar este ficheiro. Tenta novamente ou indica o link.',
    'Could not identify this file. Try again or provide the project link.',
  ],
  provideLink: ['Indicar link do mod', 'Provide the mod link'],
  linkExample: ['ex. modrinth.com/mod/sodium', 'e.g. modrinth.com/mod/sodium'],
  linkForMod: ['Link do mod {file}', 'Link for {file}'],
  verify: ['Verificar', 'Check'],
  invalidRecoveryLink: [
    'Introduz um link ou nome curto válido do Modrinth.',
    'Enter a valid Modrinth link or project slug.',
  ],
  downloadJar: ['Descarregar .jar ↗', 'Download .jar ↗'],
  zipTooLarge: [
    'Este ZIP ultrapassa 200 MiB. Guarda a lista de links ou prepara os mods em grupos mais pequenos.',
    'This ZIP exceeds 200 MiB. Save the links or prepare your mods in smaller batches.',
  ],
  zipping: ['A preparar o ZIP · {current}/{total} · {file}', 'Preparing ZIP · {current}/{total} · {file}'],
  zipReadyOne: ['ZIP pronto com 1 mod.', 'ZIP ready with 1 mod.'],
  zipReadyMany: ['ZIP pronto com {count} mods.', 'ZIP ready with {count} mods.'],
  skippedOne: ['Ficou de fora 1 mod da lista.', '1 mod from your list was left out.'],
  skippedMany: ['Ficaram de fora {count} mods da lista.', '{count} mods from your list were left out.'],
  zipFailed: ['Não foi possível preparar o ZIP.', 'Could not prepare the ZIP.'],
  zipRetry: ['Podes tentar outra vez ou guardar a lista de links.', 'Try again or save the download links.'],
  rateLimited: [
    'O Modrinth está a limitar os pedidos. Tenta novamente daqui a um minuto.',
    'Modrinth is limiting requests. Try again in a minute.',
  ],
  apiFailed: ['Não foi possível consultar o Modrinth. Tenta novamente.', 'Could not reach Modrinth. Try again.'],
  apiUnreachable: [
    'O Modrinth não respondeu. Verifica a ligação e tenta novamente.',
    'Modrinth did not respond. Check your connection and try again.',
  ],
  jarUnavailable: ['Não foi possível descarregar {file}.', 'Could not download {file}.'],
  zipLimit: ['O ZIP ultrapassa o limite de 200 MiB.', 'The ZIP exceeds the 200 MiB limit.'],
  jarIntegrity: ['O ficheiro {file} não passou a verificação de integridade.', '{file} failed the integrity check.'],
  jarNetwork: ['A transferência de {file} falhou.', 'The download of {file} failed.'],
};

const storageKey = 'updatemods-language';
let language = 'pt';

export function t(key, values = {}) {
  const text = messages[key][language === 'pt' ? 0 : 1];
  return text.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
}

export class AppError extends Error {
  constructor(key, values = {}) {
    super(key);
    this.values = values;
  }
}

export function errorText(error, fallback) {
  return error instanceof AppError ? t(error.message, error.values) : t(fallback);
}

export function savedLanguage() {
  try {
    return localStorage.getItem(storageKey) === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
}

export function setLanguage(next) {
  language = next === 'en' ? 'en' : 'pt';
  document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en';
  document.title = t('pageTitle');
  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll('[data-i18n-label]')) {
    node.setAttribute('aria-label', t(node.dataset.i18nLabel));
  }
  for (const node of document.querySelectorAll('[data-i18n-content]')) {
    node.setAttribute('content', t(node.dataset.i18nContent));
  }
  for (const button of document.querySelectorAll('[data-language]')) {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // A mudança de idioma continua disponível sem armazenamento local.
  }
}
