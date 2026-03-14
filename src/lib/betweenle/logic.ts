import { BETWEENLE_DAILY_WORDS, BETWEENLE_WORDS } from './data';
import { getPuzzleDateForGame } from '$lib/puzzle-window';
import type {
  BetweenleDailyAnswer,
  BetweenleGameMode,
  BetweenleGameSetup,
  BetweenleSolverResult,
} from './types';

export const BETWEENLE_START_DATE = new Date('2023-03-17T00:00:00');
export const BETWEENLE_FIRST_WORD = 'aaaaa';
export const BETWEENLE_LAST_WORD = 'zzzzz';
const BETWEENLE_WORD_INDEX = new Map(BETWEENLE_WORDS.map((word, index) => [word, index]));

export function parseDistance(distance: string): number {
  if (!distance || distance.trim() === '') return -1;
  const value = parseFloat(distance);
  return Number.isNaN(value) ? -1 : value;
}

export function getWordIndex(word: string): number {
  if (!word || word.trim() === '') return -1;
  return BETWEENLE_WORD_INDEX.get(word.trim().toLowerCase()) ?? -1;
}

export function sanitizeBetweenleWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5);
}

export function isBetweenleWord(word: string): boolean {
  return getWordIndex(word) >= 0;
}

export function getBetweenleWordPosition(word: string): number {
  const normalizedWord = sanitizeBetweenleWord(word);
  if (!normalizedWord) return 0;

  const exactIndex = BETWEENLE_WORD_INDEX.get(normalizedWord);
  if (exactIndex !== undefined) {
    return exactIndex;
  }

  let low = 0;
  let high = BETWEENLE_WORDS.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (BETWEENLE_WORDS[mid] < normalizedWord) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return Math.max(0, low);
}

export function formatBetweenleDistance(wordDistance: number, totalWords: number): string {
  if (wordDistance === 0) return '0.0';

  const rawPercent = (wordDistance / totalWords) * 100;
  if (rawPercent < 0.1) {
    return rawPercent.toFixed(2);
  }

  return (Math.round(rawPercent * 10) / 10).toFixed(1);
}

export function computeBetweenleSuggestion(
  topWord: string,
  bottomWord: string,
  topDistance: string,
  bottomDistance: string
): BetweenleSolverResult {
  const totalWords = BETWEENLE_WORDS.length;
  const normalizedTopWord = topWord.trim().toLowerCase();
  const normalizedBottomWord = bottomWord.trim().toLowerCase();
  const topIdx = getWordIndex(normalizedTopWord);
  const bottomIdx = getWordIndex(normalizedBottomWord);
  const topDist = parseDistance(topDistance);
  const bottomDist = parseDistance(bottomDistance);

  let boundTopIdx = 0;
  let boundBottomIdx = totalWords - 1;
  let effectiveTopWord = BETWEENLE_FIRST_WORD;
  let effectiveBottomWord = BETWEENLE_LAST_WORD;

  if (topIdx >= 0 && bottomIdx < 0) {
    boundTopIdx = topIdx + 1;
    boundBottomIdx = totalWords - 2;
    effectiveTopWord = normalizedTopWord;
  } else if (topIdx < 0 && bottomIdx >= 0) {
    boundTopIdx = 1;
    boundBottomIdx = bottomIdx - 1;
    effectiveBottomWord = normalizedBottomWord;
  } else if (topIdx >= 0 && bottomIdx >= 0) {
    boundTopIdx = topIdx + 1;
    boundBottomIdx = bottomIdx - 1;
    effectiveTopWord = normalizedTopWord;
    effectiveBottomWord = normalizedBottomWord;

    if (boundTopIdx > boundBottomIdx) {
      [boundTopIdx, boundBottomIdx] = [boundBottomIdx, boundTopIdx];
      [effectiveTopWord, effectiveBottomWord] = [effectiveBottomWord, effectiveTopWord];
    }
  }

  const remaining = Math.max(0, boundBottomIdx - boundTopIdx + 1);
  const binaryIdx = Math.floor((boundTopIdx + boundBottomIdx) / 2);

  let closerTo: 'top' | 'bottom' | '' = '';
  if (topDist >= 0 && bottomDist >= 0) {
    closerTo = topDist < bottomDist ? 'top' : 'bottom';
  } else if (topDist >= 0) {
    closerTo = 'top';
  } else if (bottomDist >= 0) {
    closerTo = 'bottom';
  }

  const actualTopIdx = topIdx >= 0 ? topIdx : 0;
  const actualBottomIdx = bottomIdx >= 0 ? bottomIdx : totalWords - 1;

  let fromTopIdx = -1;
  let fromBottomIdx = -1;
  let calculatedIdx = -1;
  let useDistance = false;

  if (topDist >= 0) {
    fromTopIdx = Math.round(actualTopIdx + (topDist / 100) * totalWords);
    useDistance = true;
  }

  if (bottomDist >= 0) {
    fromBottomIdx = Math.round(actualBottomIdx - (bottomDist / 100) * totalWords);
    useDistance = true;
  }

  const distanceConflict =
    fromTopIdx >= 0 && fromBottomIdx >= 0 ? Math.abs(fromTopIdx - fromBottomIdx) > 20 : false;
  const wouldLandOnBound =
    fromTopIdx >= 0 &&
    fromBottomIdx >= 0 &&
    (Math.round((fromTopIdx + fromBottomIdx) / 2) === topIdx ||
      Math.round((fromTopIdx + fromBottomIdx) / 2) === bottomIdx);

  if (fromTopIdx >= 0 && fromBottomIdx >= 0 && !distanceConflict && !wouldLandOnBound) {
    calculatedIdx = Math.round((fromTopIdx + fromBottomIdx) / 2);
  } else if (fromTopIdx >= 0 && fromBottomIdx >= 0 && (distanceConflict || wouldLandOnBound)) {
    calculatedIdx = closerTo === 'top' ? fromTopIdx : fromBottomIdx;
  } else if (fromTopIdx >= 0) {
    calculatedIdx = fromTopIdx;
  } else if (fromBottomIdx >= 0) {
    calculatedIdx = fromBottomIdx;
  }

  if (calculatedIdx >= 0) {
    calculatedIdx = Math.max(boundTopIdx, Math.min(boundBottomIdx, calculatedIdx));
  }

  const suggestionIdx = calculatedIdx >= 0 ? calculatedIdx : binaryIdx;
  const suggestionWord = BETWEENLE_WORDS[suggestionIdx] ?? '';
  const isSolved = remaining <= 1;

  return {
    boundTopIdx,
    boundBottomIdx,
    effectiveTopWord,
    effectiveBottomWord,
    remaining,
    suggestionIdx,
    suggestionWord,
    isSolved,
    useDistance,
    closerTo,
    topDist,
    bottomDist,
  };
}

export function toDateKey(date: Date): string {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, '0');
  const day = String(normalized.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00Z`);
}

export function getBetweenlePuzzleNumber(date: Date): number {
  const startDate = new Date(BETWEENLE_START_DATE);
  startDate.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff + 1;
}

export function getBetweenleAnswerForDate(date: Date): BetweenleDailyAnswer {
  const puzzleNumber = getBetweenlePuzzleNumber(date);
  const wordIndex =
    BETWEENLE_DAILY_WORDS.length > 0 ? (puzzleNumber - 1) % BETWEENLE_DAILY_WORDS.length : 0;

  return {
    date: toDateKey(date),
    word: BETWEENLE_DAILY_WORDS[wordIndex] ?? '',
    puzzleNumber,
  };
}

export function getRandomBetweenleWord(randomFn: () => number = Math.random): string {
  const source = BETWEENLE_DAILY_WORDS.length > 0 ? BETWEENLE_DAILY_WORDS : BETWEENLE_WORDS;
  const index = Math.floor(randomFn() * source.length);
  return source[index] ?? source[0] ?? '';
}

export function createBetweenleGameSetup(
  mode: BetweenleGameMode,
  options: { date?: Date; customWord?: string; randomFn?: () => number } = {}
): BetweenleGameSetup {
  if (mode === 'daily') {
    const answer = getBetweenleAnswerForDate(options.date ?? new Date());
    return {
      mode,
      word: answer.word,
      secretPosition: getBetweenleWordPosition(answer.word),
      puzzleNumber: answer.puzzleNumber,
      date: answer.date,
    };
  }

  if (mode === 'custom') {
    const word = sanitizeBetweenleWord(options.customWord ?? '');
    return {
      mode,
      word,
      secretPosition: getBetweenleWordPosition(word),
      puzzleNumber: null,
      date: null,
    };
  }

  const word = getRandomBetweenleWord(options.randomFn);
  return {
    mode,
    word,
    secretPosition: getBetweenleWordPosition(word),
    puzzleNumber: null,
    date: null,
  };
}

export function getBetweenleTodayAnswer(): BetweenleDailyAnswer {
  return getBetweenleAnswerForDate(getPuzzleDateForGame('betweenle'));
}

export function getBetweenleArchive(endDate: Date = getPuzzleDateForGame('betweenle')): BetweenleDailyAnswer[] {
  const archive: BetweenleDailyAnswer[] = [];
  const cursor = new Date(BETWEENLE_START_DATE);
  cursor.setHours(0, 0, 0, 0);

  const normalizedEnd = new Date(endDate);
  normalizedEnd.setHours(0, 0, 0, 0);

  while (cursor <= normalizedEnd) {
    archive.push(getBetweenleAnswerForDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return archive;
}

export function formatBetweenleDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
