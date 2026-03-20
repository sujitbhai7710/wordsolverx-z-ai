import { json } from '@sveltejs/kit';
import { parsePuzzleConfig } from '$lib/squaredle/puzzle-decoder';

let cachedPuzzle:
  | {
      grid: string[][];
      words: string[];
      bonusWords: string[];
      date: string;
      fetchedAt: number;
    }
  | null = null;

const CACHE_TTL_MS = 60 * 60 * 1000;

export async function GET() {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const cacheIsValid =
    cachedPuzzle &&
    cachedPuzzle.date === todayDateStr &&
    Date.now() - cachedPuzzle.fetchedAt < CACHE_TTL_MS;

  if (cacheIsValid) {
    const puzzle = cachedPuzzle!;
    return json({
      success: true,
      grid: puzzle.grid,
      words: puzzle.words,
      bonusWords: puzzle.bonusWords,
      date: puzzle.date,
      source: 'squaredle.app',
      puzzleType: 'daily',
      cached: true
    });
  }

  try {
    const response = await fetch('https://squaredle.app/api/today-puzzle-config.js', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: '*/*',
        Referer: 'https://squaredle.app/'
      }
    });

    if (!response.ok) {
      throw new Error(`Squaredle responded with ${response.status}`);
    }

    const configText = await response.text();
    const { dateStr, mainPuzzle } = parsePuzzleConfig(configText);

    if (!mainPuzzle) {
      throw new Error('Could not decode today puzzle config');
    }

    cachedPuzzle = {
      grid: mainPuzzle.board,
      words: mainPuzzle.words,
      bonusWords: mainPuzzle.bonusWords,
      date: dateStr || todayDateStr,
      fetchedAt: Date.now()
    };

    return json({
      success: true,
      grid: cachedPuzzle.grid,
      words: cachedPuzzle.words,
      bonusWords: cachedPuzzle.bonusWords,
      date: cachedPuzzle.date,
      source: 'squaredle.app',
      puzzleType: 'daily',
      cached: false,
      wordCount: cachedPuzzle.words.length,
      bonusCount: cachedPuzzle.bonusWords.length
    });
  } catch (error) {
    return json({
      success: true,
      grid: [
        ['r', 'c', 'e', 'r'],
        ['g', 'a', 'f', 'l'],
        ['j', 'u', 'a', 'u'],
        ['y', 'r', 'r', 'd']
      ],
      words: [],
      bonusWords: [],
      date: todayDateStr,
      source: 'fallback',
      puzzleType: 'daily',
      message:
        error instanceof Error
          ? `Could not fetch today puzzle. Using a sample grid instead: ${error.message}`
          : 'Could not fetch today puzzle. Using a sample grid instead.'
    });
  }
}
