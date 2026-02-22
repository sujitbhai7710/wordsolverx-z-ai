import seedrandom from 'seedrandom';
import type { WordData } from './types';
import { getYear, format } from 'date-fns';
import { getGameNumber } from './helpers';

const wordListCache = new Map<number, Promise<WordData>>();
const validationSetCache = new Map<number, Set<string>>();

const loadWordList = async (numLetters: number): Promise<WordData> => {
  const cached = wordListCache.get(numLetters);
  if (cached) {
    return cached;
  }

  const loader = (async () => {
    if (numLetters === 4) {
      const module = await import('./data/4letterwords.json');
      return module.default as unknown as WordData;
    }
    if (numLetters === 5) {
      const module = await import('./words_5_wordlev7');
      return module.default as WordData;
    }
    if (numLetters === 6) {
      const module = await import('./data/6letterwords.json');
      return module.default as unknown as WordData;
    }
    if (numLetters === 7) {
      const module = await import('./data/7letterwords.json');
      return module.default as unknown as WordData;
    }
    if (numLetters === 8) {
      const module = await import('./data/8letterwords.json');
      return module.default as unknown as WordData;
    }
    if (numLetters === 9) {
      const module = await import('./data/9letterwords.json');
      return module.default as unknown as WordData;
    }
    if (numLetters === 10) {
      const module = await import('./data/10letterwords.json');
      return module.default as unknown as WordData;
    }
    if (numLetters === 11) {
      const module = await import('./data/11letterwords.json');
      return module.default as unknown as WordData;
    }
    if (numLetters === 12) {
      const module = await import('./data/12letterwords.json');
      return module.default as unknown as WordData;
    }
    throw new Error(`Word list for ${numLetters}-letter words is not available.`);
  })();

  wordListCache.set(numLetters, loader);
  return loader;
};

/**
 * Returns the word list (solutions and valid guesses) for a given number of letters.
 * @param numLetters The number of letters in the words (e.g., 5 or 6).
 * @returns WordData object containing solution words and valid guess words.
 * @throws Error if an unsupported number of letters is requested.
 */
export const getWordList = async (numLetters: number): Promise<WordData> => {
  return await loadWordList(numLetters);
};

/**
 * Returns a random word for a given number of letters.
 */
export const getRandomWord = async (numLetters: number): Promise<string | null> => {
  try {
    const list = await getWordList(numLetters);
    const words = list.words || [];
    if (words.length === 0) return null;
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
  } catch {
    return null;
  }
};

/**
 * Generates a deterministic seed string based on the game date and mode (daily, weekly).
 * For daily mode, we use the local date components to create a consistent seed
 * across all timezones for the same calendar date in their local time.
 */
const generateDateSeed = (
  gameDate: Date,
  gameMode: 'daily' | 'weekly' | 'archive' | 'infinity',
  numLetters: number
): string => {
  if (gameMode === 'daily') {
    // Use year, month, day components to make a consistent seed
    // regardless of timezone, so users will get the same puzzle
    // for their local date
    const year = gameDate.getFullYear();
    const month = gameDate.getMonth() + 1; // 1-12
    const day = gameDate.getDate(); // 1-31
    return `daily-${numLetters}-${year}-${month}-${day}`;
  }
  if (gameMode === 'weekly') {
    const gameNum = getGameNumber(gameDate, gameMode);
    // Use game number and year for consistent seeding across years for the same day/week number
    return `${gameMode}-${numLetters}-game${gameNum}-${getYear(gameDate)}`;
  }
  if (gameMode === 'archive') {
    return `archive-${format(gameDate, 'yyyy-MM-dd')}-${numLetters}`;
  }
  // Infinity mode: use a more random seed
  return `infinity-${gameDate.toISOString()}-${numLetters}-${Math.random()}`;
};

export const getSolution = async (gameDate: Date, numLetters: number, gameMode: 'daily' | 'weekly' | 'archive' | 'infinity' = 'daily'): Promise<string> => {
  const wordList = await getWordList(numLetters);
  if (!wordList) {
    console.error(`Word list could not be loaded for ${numLetters} letters.`);
    throw new Error(`Word list unavailable for ${numLetters} letters.`);
  }
  const { words: solutions } = wordList;

  if (!solutions || solutions.length === 0) {
    console.error(`No solutions found for ${numLetters}-letter words.`);
    return 'ERROR';
  }

  const seed = generateDateSeed(gameDate, gameMode, numLetters);
  const rng = seedrandom(seed);
  const index = Math.floor(rng() * solutions.length);
  const solution = solutions[index];
  if (!solution || solution.length !== numLetters) {
    console.error(`Solution generation error: Expected ${numLetters}, got ${solution?.length}. Word: "${solution}" from list for ${numLetters} letters. Seed: ${seed}, Index: ${index}`);
    const fallback = solutions.find(w => w.length === numLetters);
    if (fallback) return fallback.toUpperCase();
    throw new Error(`Could not find a valid ${numLetters}-letter solution. Please check word lists.`);
  }
  return solution.toUpperCase();
};

export const isValidGuess = async (guess: string, numLetters: number): Promise<boolean> => {
  const wordData = await getWordList(numLetters);
  if (!wordData || (!wordData.words && !wordData.valid) || (wordData.words.length === 0 && (!wordData.valid || wordData.valid.length === 0))) {
    return false;
  }

  const processedGuess = guess.toLowerCase().trim();
  let wordSet = validationSetCache.get(numLetters);

  if (!wordSet) {
    wordSet = new Set<string>();
    for (const w of wordData.words || []) {
      wordSet.add(String(w || '').toLowerCase().trim());
    }
    for (const w of wordData.valid || []) {
      wordSet.add(String(w || '').toLowerCase().trim());
    }
    validationSetCache.set(numLetters, wordSet);
  }

  return wordSet.has(processedGuess);
}; 
