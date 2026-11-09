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
  projectPageTitle: ['Atualizar projeto ZIP — UpdateMods', 'Update project ZIP — UpdateMods'],
  projectDescription: [
    'Atualiza as configurações de um projeto Fabric para outra versão do Minecraft.',
    'Update a Fabric project’s configuration for a different Minecraft version.',
  ],
  projectNav: ['Projeto ZIP', 'Project ZIP'],
  modsNav: ['Mods .jar', '.jar mods'],
  projectTitleFirst: ['O teu projeto,', 'Your project,'],
  projectTitleSecond: ['noutra versão.', 'a new version.'],
  projectIntro: [
    'Adiciona o ZIP do teu projeto Fabric e escolhe uma versão mais recente da série 1.21. Recebes o projeto com a configuração atualizada.',
    'Add your Fabric project ZIP and choose a newer Minecraft 1.21 release. Get the project back with its configuration updated.',
  ],
  projectForm: ['Atualizar projeto ZIP', 'Update project ZIP'],
  projectSection: ['ATUALIZAR PROJETO ZIP', 'UPDATE PROJECT ZIP'],
  projectFileHeading: ['Adiciona o ZIP do projeto', 'Add the project ZIP'],
  projectFileHint: [
    'Inclui a pasta src, o build do Gradle e o gradle.properties.',
    'Include the src folder, the Gradle build script, and gradle.properties.',
  ],
  projectDrag: ['Arrasta o ZIP do projeto para aqui', 'Drop the project ZIP here'],
  projectChoose: ['ou escolhe um ficheiro no computador', 'or choose a file on your computer'],
  projectTargetHint: [
    'A lista mostra as versões mais recentes da mesma série.',
    'The list shows newer releases from the same version series.',
  ],
  projectSelectFile: ['Adiciona primeiro um ZIP', 'Add a ZIP first'],
  projectScope: [
    'Esta ferramenta atualiza a configuração do Fabric. As mudanças no código Java e a compilação ficam a teu cargo.',
    'This tool updates the Fabric configuration. Review the Java code and build the project separately.',
  ],
  projectPrepare: ['Atualizar projeto ZIP', 'Update project ZIP'],
  projectReady: ['ZIP do projeto pronto', 'Project ZIP ready'],
  projectReportHint: [
    'O ZIP inclui um relatório das alterações. Antes de compilar, revê as APIs usadas pelo mod e as versões do Gradle, do Loom e das restantes dependências.',
    'The ZIP includes a change report. Before building, review the APIs used by the mod and the Gradle, Loom, and other dependency versions.',
  ],
  projectNoscript: [
    'Ativa o JavaScript no browser para atualizar o projeto.',
    'Enable JavaScript in your browser to update the project.',
  ],
  projectZipInvalid: [
    'Não foi possível ler o ZIP. Usa um arquivo ZIP normal, sem palavra-passe, com nomes de ficheiro em UTF-8.',
    'Could not read the archive. Use a standard, unencrypted ZIP with UTF-8 file names.',
  ],
  projectZipTooLarge: [
    'O ZIP deve ter conteúdo, até 64 MiB comprimidos, 128 MiB extraídos e 2 500 entradas.',
    'Use a nonempty ZIP with up to 64 MiB compressed, 128 MiB extracted, and 2,500 entries.',
  ],
  projectBrowserUnsupported: [
    'Este browser não consegue descomprimir o ZIP. Tenta num browser recente.',
    'This browser cannot decompress the ZIP. Try an up-to-date browser.',
  ],
  projectUnsupported: [
    'Usa um único projeto Fabric em Java com o formato habitual do Gradle e as versões declaradas em gradle.properties.',
    'Use a single Fabric Java project with a standard Gradle layout and versions declared in gradle.properties.',
  ],
  projectInvalidManifest: [
    'Confirma que src/main/resources/fabric.mod.json contém um manifesto Fabric válido com id e depends.',
    'Check that src/main/resources/fabric.mod.json is a valid Fabric manifest with id and depends.',
  ],
  projectUnsupportedVersion: [
    'Esta versão da ferramenta aceita projetos Minecraft Java da série 1.21.x.',
    'This version of the tool accepts Minecraft Java projects from the 1.21.x series.',
  ],
  projectFabricUnavailable: [
    'Não foi possível consultar as versões do Fabric. Tenta novamente.',
    'Could not fetch Fabric versions. Try again.',
  ],
  projectDependencyMissing: [
    'Falta uma versão compatível de uma dependência do Fabric para este destino.',
    'A compatible Fabric dependency version is missing for this target.',
  ],
  projectInvalidTarget: [
    'Escolhe uma versão mais recente da série 1.21.x.',
    'Choose a newer release from the 1.21.x series.',
  ],
  projectFileType: ['Seleciona um ficheiro .zip.', 'Select a .zip file.'],
  projectReading: ['A ler o ZIP do projeto…', 'Reading the project ZIP…'],
  projectSource: ['{file} · Minecraft {version} · Fabric', '{file} · Minecraft {version} · Fabric'],
  projectNoTargets: [
    'Este projeto já está na versão mais recente da série 1.21.x.',
    'This project is already on the newest supported 1.21.x release.',
  ],
  projectChecking: ['A consultar as dependências do Fabric…', 'Looking up Fabric dependencies…'],
  projectPacking: ['A preparar o ZIP atualizado…', 'Preparing the updated ZIP…'],
  projectFailed: ['Não foi possível atualizar o projeto.', 'Could not update the project.'],
  projectReportTitle: ['UpdateMods — Relatório de atualização', 'UpdateMods — Project update report'],
  projectNotSet: ['por definir', 'not set'],
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

export function setLanguage(next, title = 'pageTitle') {
  language = next === 'en' ? 'en' : 'pt';
  document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en';
  document.title = t(title);
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
