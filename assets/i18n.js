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
  converterTitle: ['Converter JAR — UpdateMods', 'Convert JAR — UpdateMods'],
  converterDescription: [
    'Converte receitas e tags de mods Fabric e descarrega um novo JAR.',
    'Convert recipes and tags in Fabric mods and download a new JAR.',
  ],
  converterNav: ['Converter JAR', 'Convert JAR'],
  converterLookupNav: ['Procurar mods', 'Find mods'],
  converterBadge: ['FABRIC · CONVERSÃO EXPERIMENTAL', 'FABRIC · EXPERIMENTAL CONVERSION'],
  converterHeroFirst: ['Um mod antigo,', 'An old mod,'],
  converterHeroSecond: ['um novo JAR.', 'a new JAR.'],
  converterIntro: [
    'Adiciona o mod antigo e escolhe o destino. Para os formatos suportados, o UpdateMods adapta os dados e prepara outro .jar.',
    'Add the old mod and choose the target version. For supported formats, UpdateMods migrates the data and prepares a new .jar.',
  ],
  converterSection: ['CONVERTER MOD', 'CONVERT MOD'],
  converterFileHeading: ['Adiciona o mod antigo', 'Add the old mod'],
  converterFileHint: ['Um .jar Fabric ou um ZIP com um único .jar.', 'A Fabric .jar or a ZIP containing one .jar.'],
  converterDrag: ['Arrasta o ficheiro para aqui', 'Drop the file here'],
  converterChoose: ['ou escolhe um ficheiro no computador', 'or choose a file on your computer'],
  converterTargetHint: ['As opções dependem dos dados encontrados no mod.', 'The options depend on the data found in the mod.'],
  converterSelectFile: ['Adiciona primeiro um mod', 'Add a mod first'],
  converterScope: [
    'Suporta mods Fabric de receitas e tags, sem classes Java, da 1.20.6, 1.21 ou 1.21.1 para destinos até à 1.21.4.',
    'Supports Fabric recipe and tag mods without Java classes, from 1.20.6, 1.21, or 1.21.1 to targets up to 1.21.4.',
  ],
  converterReady: ['JAR experimental pronto', 'Experimental JAR ready'],
  converterDownload: ['Descarregar JAR', 'Download JAR'],
  converterResultHint: [
    'Usa o JAR com Fabric Loader e Fabric API para a versão de destino. A ferramenta adapta os dados do mod. O arranque no jogo fica por verificar.',
    'Use the JAR with Fabric Loader and Fabric API for the target version. The converter migrated the mod data. In-game startup remains unverified.',
  ],
  converterNoscript: ['Ativa o JavaScript para converter o ficheiro.', 'Enable JavaScript to convert the file.'],
  converterReading: ['A ler o ficheiro…', 'Reading the file…'],
  converterDetected: ['{file} · Minecraft {version} · Fabric', '{file} · Minecraft {version} · Fabric'],
  converterFailed: ['Não foi possível converter este mod.', 'Could not convert this mod.'],
  converterFileType: ['Seleciona um .jar ou um ZIP com um único .jar.', 'Select a .jar or a ZIP containing one .jar.'],
  converterOneJar: ['O ZIP deve conter exatamente um ficheiro .jar.', 'The ZIP must contain exactly one .jar file.'],
  converterFabric: ['O ficheiro não contém o manifesto fabric.mod.json de um mod Fabric.', 'The archive does not contain a Fabric mod’s fabric.mod.json manifest.'],
  converterCode: [
    'Este mod tem código Java, Mixins ou mods incorporados. A conversão disponível suporta receitas e tags.',
    'This mod includes Java code, Mixins, or embedded mods. The available converter supports recipes and tags.',
  ],
  converterSigned: ['Este JAR tem uma assinatura digital. A conversão não está disponível para ficheiros assinados.', 'This JAR is digitally signed. Conversion is unavailable for signed files.'],
  converterFormat: ['O formato ou as regras de compatibilidade deste mod ficam fora das conversões suportadas.', 'This mod’s format or compatibility rules fall outside the supported conversions.'],
  converterDependencies: ['O mod declara dependências ou restrições que exigem uma adaptação específica.', 'The mod declares dependencies or constraints that require a dedicated port.'],
  converterSource: [
    'O manifesto precisa de declarar uma origem suportada: Minecraft 1.20.6, 1.21 ou 1.21.1.',
    'The manifest must declare a supported source: Minecraft 1.20.6, 1.21, or 1.21.1.',
  ],
  converterData: ['Este ficheiro requer uma adaptação específica: {file}', 'This file requires a dedicated migration: {file}'],
  converterNoData: ['O JAR não tem receitas ou tags que esta ferramenta consiga converter.', 'The JAR has no recipes or tags this tool can convert.'],
  converterNoTargets: ['Os dados encontrados não têm uma conversão disponível para os destinos desta ferramenta.', 'The detected data has no supported conversion to this tool’s target versions.'],
  converterTarget: ['Escolhe um dos destinos disponíveis para este mod.', 'Choose one of the available targets for this mod.'],
  converterMovedOne: ['1 ficheiro movido para o caminho novo', '1 file moved to the new path'],
  converterMovedMany: ['{count} ficheiros movidos para os caminhos novos', '{count} files moved to the new paths'],
  converterRecipeOne: ['1 receita adaptada ao formato novo', '1 recipe migrated to the new format'],
  converterRecipeMany: ['{count} receitas adaptadas ao formato novo', '{count} recipes migrated to the new format'],
  archiveInvalid: ['Não foi possível ler o arquivo. Usa um JAR ou ZIP normal, sem palavra-passe, com nomes UTF-8.', 'Could not read the archive. Use a standard, unencrypted JAR or ZIP with UTF-8 file names.'],
  archiveTooLarge: ['O arquivo deve ter conteúdo, até 64 MiB comprimidos, 128 MiB extraídos e 2 500 entradas.', 'Use a nonempty archive with up to 64 MiB compressed, 128 MiB extracted, and 2,500 entries.'],
  archiveBrowser: ['Este browser não consegue descomprimir o arquivo. Tenta num browser recente.', 'This browser cannot decompress the archive. Try an up-to-date browser.'],
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
