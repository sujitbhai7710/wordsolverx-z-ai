import seedrandom from 'seedrandom';
// Import directly from the new word list files using default import
import words5DataDefault from './words_5_wordlev7';

import words4Data from './data/4letterwords.json';
import words6Data from './data/6letterwords.json';
import words7Data from './data/7letterwords.json';
import words8Data from './data/8letterwords.json';
import words9Data from './data/9letterwords.json';
import words10Data from './data/10letterwords.json';
import words11Data from './data/11letterwords.json';
import words12Data from './data/12letterwords.json';

import type { WordData } from './types';
import { getWeek, getYear, format } from 'date-fns';
import { getGameNumber } from './helpers';

// Make sure the imported default data conforms to WordData structure
const words5: WordData = words5DataDefault as WordData;
const words6: WordData = words6Data as unknown as WordData;
const words4: WordData = words4Data as unknown as WordData;
const words7: WordData = words7Data as unknown as WordData;
const words8: WordData = words8Data as unknown as WordData;
const words9: WordData = words9Data as unknown as WordData;
const words10: WordData = words10Data as unknown as WordData;
const words11: WordData = words11Data as unknown as WordData;
const words12: WordData = words12Data as unknown as WordData;

/**
 * Returns the word list (solutions and valid guesses) for a given number of letters.
 * @param numLetters The number of letters in the words (e.g., 5 or 6).
 * @returns WordData object containing solution words and valid guess words.
 * @throws Error if an unsupported number of letters is requested.
 */
export const getWordList = (numLetters: number): WordData => {
  if (numLetters === 5) return words5;
  if (numLetters === 6) return words6;
  if (numLetters === 4) return words4;
  if (numLetters === 7) return words7;
  if (numLetters === 8) return words8;
  if (numLetters === 9) return words9;
  if (numLetters === 10) return words10;
  if (numLetters === 11) return words11;
  if (numLetters === 12) return words12;

  throw new Error(`Word list for ${numLetters}-letter words is not available.`);
};

/**
 * Returns a random word for a given number of letters.
 */
export const getRandomWord = (numLetters: number): string | null => {
  try {
    const list = getWordList(numLetters);
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

export const getSolution = (gameDate: Date, numLetters: number, gameMode: 'daily' | 'weekly' | 'archive' | 'infinity' = 'daily'): string => {
  const wordList = getWordList(numLetters);
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

export const isValidGuess = (guess: string, numLetters: number): boolean => {
  const wordData = getWordList(numLetters);
  if (!wordData || (!wordData.words && !wordData.valid) || (wordData.words.length === 0 && (!wordData.valid || wordData.valid.length === 0))) {
    return false;
  }

  const processedGuess = guess.toLowerCase().trim();

  // Combine solutions and valid guesses into one lookup set for O(1) checks
  const allWords = wordData.words || [];
  const allValidGuesses = wordData.valid || [];

  // Use a Set for efficient lookup
  const wordSet = new Set<string>();
  for (const w of allWords) {
    wordSet.add(String(w || '').toLowerCase().trim());
  }
  for (const w of allValidGuesses) {
    wordSet.add(String(w || '').toLowerCase().trim());
  }

  return wordSet.has(processedGuess);
}; 