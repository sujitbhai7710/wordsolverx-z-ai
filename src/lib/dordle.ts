import { MersenneTwister } from './dordle-mersenne';

const IST_OFFSET_HOURS = 5;
const IST_OFFSET_MINUTES = 30;
const START_DATE = new Date('2022-01-24T12:00:00Z');

function getCurrentISTDate(): { year: number; month: number; day: number; hour: number; minute: number } {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const istMs = utcMs + (IST_OFFSET_HOURS * 60 * 60 * 1000) + (IST_OFFSET_MINUTES * 60 * 1000);
  const istDate = new Date(istMs);
  return {
    year: istDate.getUTCFullYear(),
    month: istDate.getUTCMonth() + 1,
    day: istDate.getUTCDate(),
    hour: istDate.getUTCHours(),
    minute: istDate.getUTCMinutes()
  };
}

export function getCurrentSeed(): number {
  const ist = getCurrentISTDate();
  const istNoonUTC = new Date(`${ist.year}-${String(ist.month).padStart(2, '0')}-${String(ist.day).padStart(2, '0')}T12:00:00Z`);
  const diffTime = istNoonUTC.getTime() - START_DATE.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getSeedForDate(date: Date): number {
  const noonDate = new Date(date);
  noonDate.setHours(12, 0, 0, 0);
  const diffTime = noonDate.getTime() - START_DATE.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getDateFromSeed(seed: number): Date {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + seed);
  return date;
}

export function getDailyAnswers(seed: number, answers: string[]): [string, string] {
  if (seed === 67) return ['hapax', 'prank'];
  const rng = new MersenneTwister(seed);
  rng.genrand_int31();
  rng.genrand_int31();

  let answer1: string;
  let answer2: string;
  do {
    answer1 = answers[rng.genrand_int31() % answers.length];
    answer2 = answers[rng.genrand_int31() % answers.length];
  } while (answer1 === answer2);

  return [answer1, answer2];
}

export function checkGuess(guess: string, answer: string): number[] {
  const result: number[] = [0, 0, 0, 0, 0];
  const answerChars = answer.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');
  const used: boolean[] = [false, false, false, false, false];

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 2;
      used[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === 0) {
      for (let j = 0; j < 5; j++) {
        if (!used[j] && guessChars[i] === answerChars[j]) {
          result[i] = 1;
          used[j] = true;
          break;
        }
      }
    }
  }

  return result;
}

export function getPatternKey(pattern: number[]): string {
  return pattern.map(p => p === 2 ? 'G' : p === 1 ? 'Y' : 'B').join('');
}

export function matchesPattern(word: string, guess: string, pattern: number[]): boolean {
  const wordChars = word.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');
  const used: boolean[] = [false, false, false, false, false];

  for (let i = 0; i < 5; i++) {
    if (pattern[i] === 2) {
      if (wordChars[i] !== guessChars[i]) return false;
      used[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (pattern[i] === 1) {
      let found = false;
      for (let j = 0; j < 5; j++) {
        if (!used[j] && wordChars[j] === guessChars[i]) {
          found = true;
          used[j] = true;
          break;
        }
      }
      if (!found) return false;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (pattern[i] === 0) {
      let markedCount = 0;
      for (let j = 0; j < 5; j++) {
        if (guessChars[j] === guessChars[i] && pattern[j] > 0) markedCount++;
      }
      let wordCount = 0;
      for (let j = 0; j < 5; j++) {
        if (wordChars[j] === guessChars[i]) wordCount++;
      }
      if (wordCount > markedCount) return false;
    }
  }

  return true;
}

export function filterPossibleAnswers(
  answers: string[],
  guesses: Array<{ guess: string; pattern: number[] }>
): string[] {
  return answers.filter(word => {
    return guesses.every(({ guess, pattern }) => matchesPattern(word, guess, pattern));
  });
}

export function calculateWordleBotScore(
  guess: string,
  possibleAnswers: string[]
): { weighted: number; threes: number; adjusted: number } {
  const patternCounts: Map<string, number> = new Map();
  const n = possibleAnswers.length;

  for (const answer of possibleAnswers) {
    const pattern = checkGuess(guess, answer);
    const key = getPatternKey(pattern);
    patternCounts.set(key, (patternCounts.get(key) || 0) + 1);
  }

  let weighted = 0;
  let threes = 1;

  for (const freq of patternCounts.values()) {
    weighted += (freq / n) * freq - ((freq - 1) / n) * (freq - 1);
    if (freq > 1) threes -= 1 / n;
  }

  const adjusted = (1 - threes) * weighted;
  return { weighted, threes, adjusted };
}

function calculateExpectedGuesses(
  guess: string,
  possibleAnswers: string[],
  _allWords: string[],
  depth: number = 0
): number {
  if (possibleAnswers.length === 0) return 0;
  if (possibleAnswers.length === 1) return depth + 1;
  if (possibleAnswers.length === 2) return depth + 1.5;

  const patternGroups: Map<string, string[]> = new Map();
  for (const answer of possibleAnswers) {
    const pattern = checkGuess(guess, answer);
    const key = getPatternKey(pattern);
    if (!patternGroups.has(key)) patternGroups.set(key, []);
    patternGroups.get(key)!.push(answer);
  }

  let totalGuesses = 0;
  const n = possibleAnswers.length;

  for (const [_pattern, answers] of patternGroups) {
    const probability = answers.length / n;
    if (_pattern === 'GGGGG') {
      totalGuesses += probability * (depth + 1);
    } else if (answers.length <= 2) {
      totalGuesses += probability * (depth + 1 + (answers.length === 2 ? 1 : 0));
    } else if (depth < 3) {
      const remainingGuesses = Math.log2(answers.length) / 2;
      totalGuesses += probability * (depth + 1 + remainingGuesses);
    } else {
      totalGuesses += probability * (depth + 2);
    }
  }

  return totalGuesses;
}

export function getBestGuesses(
  possibleAnswers: string[],
  allWords: string[],
  topN: number = 10
): Array<{ word: string; entropy: number; isPossibleAnswer: boolean }> {
  const results: Array<{ word: string; score: { weighted: number; threes: number; adjusted: number }; isPossibleAnswer: boolean }> = [];
  const possibleSet = new Set(possibleAnswers.map(w => w.toLowerCase()));

  for (const word of allWords) {
    const score = calculateWordleBotScore(word, possibleAnswers);
    const isPossibleAnswer = possibleSet.has(word.toLowerCase());
    results.push({ word, score, isPossibleAnswer });
  }

  results.sort((a, b) => {
    if (a.score.adjusted !== b.score.adjusted) return a.score.adjusted - b.score.adjusted;
    if (a.isPossibleAnswer && !b.isPossibleAnswer) return -1;
    if (!a.isPossibleAnswer && b.isPossibleAnswer) return 1;
    return 0;
  });

  const topCandidates = results.slice(0, Math.min(50, results.length));
  const finalResults: Array<{ word: string; entropy: number; isPossibleAnswer: boolean }> = [];

  for (const candidate of topCandidates) {
    const avgGuesses = calculateExpectedGuesses(candidate.word, possibleAnswers, allWords);
    finalResults.push({ word: candidate.word, entropy: avgGuesses, isPossibleAnswer: candidate.isPossibleAnswer });
  }

  finalResults.sort((a, b) => {
    if (a.entropy !== b.entropy) return a.entropy - b.entropy;
    if (a.isPossibleAnswer && !b.isPossibleAnswer) return -1;
    if (!a.isPossibleAnswer && b.isPossibleAnswer) return 1;
    return 0;
  });

  return finalResults.slice(0, topN);
}

export function formatSeed(seed: number): string {
  return seed.toString().padStart(4, '0');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export function getTimeUntilNextDaily(): { hours: number; minutes: number; seconds: number } {
  const ist = getCurrentISTDate();
  const hours = 23 - ist.hour;
  const minutes = 59 - ist.minute;
  const seconds = 59 - new Date().getSeconds();
  return { hours: Math.max(0, hours), minutes: Math.max(0, minutes), seconds: Math.max(0, seconds) };
}

export function getCurrentISTDateString(): string {
  const ist = getCurrentISTDate();
  const date = new Date(`${ist.year}-${String(ist.month).padStart(2, '0')}-${String(ist.day).padStart(2, '0')}T12:00:00Z`);
  return formatDate(date);
}
