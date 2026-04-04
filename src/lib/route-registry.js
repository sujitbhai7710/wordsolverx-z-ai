export const TODAY_STATIC_ROUTES = [
  '/today',
  '/betweenle-answer-today',
  '/colorfle-answer-today',
  '/colordle-answer-today',
  '/contexto-answer-today',
  '/countryle-answer-today',
  '/dotadle-answer-today',
  '/framed-answer-today',
  '/globle-answer-today',
  '/loldle-answer-today',
  '/narutodle-answer-today',
  '/nerdle-answer-today',
  '/onepiecedle-answer-today',
  '/phoodle-answer-today',
  '/phrazle-answer-today',
  '/pokedle-answer-today',
  '/quordle-answer-today',
  '/searchle-answer-today',
  '/semantle-answer-today',
  '/smashdle-answer-today',
  '/spotle-answer-today',
  '/waffle-answer-today',
  '/wordle-answer-today',
  '/worldle-answer-today'
];

export const EVERGREEN_STATIC_ROUTES = [
  '/',
  '/about',
  '/archive',
  '/betweenle-solver',
  '/betweenle-unlimited',
  '/boggle-solver',
  '/colorfle-solver',
  '/colordle-solver',
  '/contact',
  '/countryle-solver',
  '/create-custom-wordle',
  '/disclaimer',
  '/dotadle-solver',
  '/guides',
  '/hangman-solver',
  '/kanoodle-solver',
  '/light-out-solver',
  '/loldle-solver',
  '/minesweeper-solver',
  '/multidle',
  '/narutodle-solver',
  '/nerdle-solver',
  '/onepiecedle-solver',
  '/phoodle-solver',
  '/pokedle-solver',
  '/privacy-policy',
  '/quordle-solver',
  '/searchle-solver',
  '/smashdle-solver',
  '/solver',
  '/soundmap-solver',
  '/spotle-solver',
  '/squaredle-solver',
  '/terms-of-service',
  '/waffle-solver',
  '/weaver-solver',
  '/word-ladder-solver',
  '/wordle-solver',
  '/worldle-solver',
  '/3-letter-wordle',
  '/4-letter-wordle',
  '/5-letter-wordle',
  '/6-letter-wordle',
  '/7-letter-wordle',
  '/8-letter-wordle',
  '/9-letter-wordle',
  '/10-letter-wordle',
  '/11-letter-wordle',
  '/12-letter-wordle'
];

export const ARCHIVE_STATIC_ROUTES = [
  '/colorfle-archive',
  '/colordle-archive',
  '/contexto-archive',
  '/countryle-archive',
  '/framed-archive',
  '/globle-archive',
  '/nerdle-archive',
  '/phoodle-archive',
  '/phrazle-archive',
  '/quordle-archive',
  '/searchle-archive',
  '/semantle-archive',
  '/spotle-archive',
  '/waffle-archive',
  '/wordle-answer-archive',
  '/worldle-archive'
];

export const API_RUNTIME_ROUTES = [
  '/api/*',
  '/sitemap.xml'
];

export const PAGES_FUNCTION_INCLUDE_ROUTES = [...new Set([...API_RUNTIME_ROUTES])];

export const PRERENDER_ENTRIES = [
  ...new Set([...EVERGREEN_STATIC_ROUTES, ...TODAY_STATIC_ROUTES, ...ARCHIVE_STATIC_ROUTES])
];
