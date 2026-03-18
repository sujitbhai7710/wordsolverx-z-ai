import { getDailyPuzzle } from './searchleData';
import rawAllSearches from './allsearches.json';

export interface SearchleSuggestion {
  word: string;
  score: number;
  entropy: number;
  category: string;
}

export type SearchleFeedback = 'correct' | 'partial' | 'absent' | 'unknown';

export interface SearchleGuess {
  word: string;
  feedback: SearchleFeedback[];
}

export interface SearchleDailyPuzzle {
  date: string;
  prompt: string;
  answer: string;
  luckyGuess?: string;
}

interface SearchleSolverPuzzle {
  text: string;
  answer: string;
  luckyGuess: string;
  guesses?: string[];
}

const SEARCHLE_SOLVER_PUZZLES: SearchleSolverPuzzle[] = (rawAllSearches as SearchleSolverPuzzle[]).map(
  (entry) => ({
    text: entry.text,
    answer: entry.answer,
    luckyGuess: entry.luckyGuess,
    guesses: Array.isArray(entry.guesses) ? entry.guesses : []
  })
);

export const SEARCHLE_SOLVER_PUZZLE_COUNT = SEARCHLE_SOLVER_PUZZLES.length;

export function formatSearchleDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

export function getSearchlePuzzleForDate(date: Date): SearchleDailyPuzzle {
  const puzzle = getDailyPuzzle(date);
  return {
    date: formatSearchleDate(date),
    prompt: `${puzzle.text}...`,
    answer: puzzle.answer,
    luckyGuess: puzzle.luckyGuess
  };
}

export function getSearchleArchive(baseDate: Date, days: number = 7): SearchleDailyPuzzle[] {
  const archive: SearchleDailyPuzzle[] = [];
  for (let i = 1; i <= days; i += 1) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    archive.push(getSearchlePuzzleForDate(date));
  }
  return archive;
}

export function getSearchleMonthPuzzles(year: number, monthIndex: number): SearchleDailyPuzzle[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const puzzles: SearchleDailyPuzzle[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    puzzles.push(getSearchlePuzzleForDate(new Date(year, monthIndex, day)));
  }
  return puzzles;
}

function normalizeSearchlePrompt(value: string): string {
  return value.toLowerCase().replace(/\.\.\./g, '').trim().replace(/\s+/g, ' ');
}

export function getSearchlePromptSuggestions(partialPrompt: string, limit = 8): string[] {
  const normalizedPrompt = normalizeSearchlePrompt(partialPrompt);
  if (!normalizedPrompt) return [];

  const rankedMatches = SEARCHLE_SOLVER_PUZZLES
    .map((puzzle) => {
      const normalizedText = normalizeSearchlePrompt(puzzle.text);
      let rank = -1;

      if (normalizedText === normalizedPrompt) {
        rank = 0;
      } else if (normalizedText.startsWith(normalizedPrompt)) {
        rank = 1;
      } else if (normalizedPrompt.startsWith(normalizedText)) {
        rank = 2;
      } else if (normalizedText.includes(normalizedPrompt)) {
        rank = 3;
      }

      return rank === -1
        ? null
        : {
            prompt: `${puzzle.text}...`,
            rank,
            lengthDiff: Math.abs(normalizedText.length - normalizedPrompt.length)
          };
    })
    .filter((entry): entry is { prompt: string; rank: number; lengthDiff: number } => entry !== null)
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.lengthDiff !== b.lengthDiff) return a.lengthDiff - b.lengthDiff;
      return a.prompt.localeCompare(b.prompt);
    });

  const seen = new Set<string>();
  const suggestions: string[] = [];

  for (const entry of rankedMatches) {
    const normalizedSuggestion = entry.prompt.toLowerCase();
    if (seen.has(normalizedSuggestion)) continue;
    seen.add(normalizedSuggestion);
    suggestions.push(entry.prompt);
    if (suggestions.length >= limit) break;
  }

  return suggestions;
}

function getOrderedPuzzleWords(puzzle: SearchleSolverPuzzle): string[] {
  const orderedWords = [puzzle.answer, puzzle.luckyGuess, ...(puzzle.guesses ?? [])];
  const seen = new Set<string>();

  return orderedWords
    .map((word) => word.trim().toLowerCase())
    .filter((word) => {
      if (!word || seen.has(word)) return false;
      seen.add(word);
      return true;
    });
}

function getPromptMatchOrdering(
  partialPrompt: string,
  matchingPuzzles: SearchleSolverPuzzle[]
): Map<string, number> {
  const normalizedPrompt = normalizeSearchlePrompt(partialPrompt);
  const exactMatches = matchingPuzzles.filter(
    (puzzle) => normalizeSearchlePrompt(puzzle.text) === normalizedPrompt
  );
  const orderedPuzzles = exactMatches.length > 0 ? exactMatches : matchingPuzzles;
  const ordering = new Map<string, number>();
  let nextIndex = 0;

  for (const puzzle of orderedPuzzles) {
    for (const word of getOrderedPuzzleWords(puzzle)) {
      if (ordering.has(word)) continue;
      ordering.set(word, nextIndex);
      nextIndex += 1;
    }
  }

  return ordering;
}

function calculateEntropy(word: string, allWords: string[]): number {
  if (allWords.length <= 1) return 0;

  const letterFreq: Record<string, number> = {};

  for (const w of allWords) {
    const letters = new Set(w.toLowerCase().split(''));
    for (const letter of letters) {
      letterFreq[letter] = (letterFreq[letter] || 0) + 1;
    }
  }

  let entropy = 0;
  const wordLetters = new Set(word.toLowerCase().split(''));

  for (const letter of wordLetters) {
    const p = (letterFreq[letter] || 0) / allWords.length;
    if (p > 0 && p < 1) {
      entropy -= p * Math.log2(p);
    }
  }

  return entropy;
}

function findMatchingPuzzles(partialPrompt: string): SearchleSolverPuzzle[] {
  const promptLower = normalizeSearchlePrompt(partialPrompt);
  if (!promptLower) return [];

  return SEARCHLE_SOLVER_PUZZLES.filter((puzzle) => {
    const textLower = normalizeSearchlePrompt(puzzle.text);
    return (
      textLower.startsWith(promptLower) ||
      promptLower.startsWith(textLower) ||
      textLower.includes(promptLower)
    );
  }).slice(0, 50);
}

function getPossibleAnswers(partialPrompt: string): string[] {
  const matches = findMatchingPuzzles(partialPrompt);
  const answers = new Set<string>();
  for (const puzzle of matches) {
    for (const word of getOrderedPuzzleWords(puzzle)) {
      answers.add(word);
    }
  }
  return Array.from(answers);
}

function filterWordsByFeedback(
  words: string[],
  guess: string,
  feedback: SearchleFeedback[]
): string[] {
  return words.filter((word) => {
    const wordLower = word.toLowerCase();
    const guessLower = guess.toLowerCase();

    for (let i = 0; i < feedback.length; i += 1) {
      if (i >= guessLower.length) continue;
      const letter = guessLower[i];
      const state = feedback[i];

      if (state === 'correct') {
        if (!wordLower.includes(letter)) return false;
      } else if (state === 'absent') {
        if (wordLower.includes(letter)) return false;
      } else if (state === 'partial') {
        if (!wordLower.includes(letter)) return false;
      }
    }
    return true;
  });
}

export function solveSearchle(
  prompt: string,
  previousGuesses: SearchleGuess[]
): { suggestions: SearchleSuggestion[]; totalWords: number; matchingPuzzlesFound: number } {
  const guessedWords = new Set(previousGuesses.map((g) => g.word.toLowerCase()));
  const matchingPuzzles = findMatchingPuzzles(prompt);
  const promptOrdering = getPromptMatchOrdering(prompt, matchingPuzzles);

  let possibleAnswers = getPossibleAnswers(prompt);

  if (possibleAnswers.length === 0) {
    const promptWords = prompt
      .toLowerCase()
      .replace('...', '')
      .split(' ')
      .filter((word) => word.length > 2);

    for (const word of promptWords) {
      const wordMatches = SEARCHLE_SOLVER_PUZZLES.filter(
        (puzzle) =>
          puzzle.text.toLowerCase().includes(word) || puzzle.answer.toLowerCase().includes(word)
      ).slice(0, 30);

      for (const match of wordMatches) {
        possibleAnswers.push(...getOrderedPuzzleWords(match));
      }
    }
  }

  possibleAnswers = [...new Set(possibleAnswers)].filter((w) => !guessedWords.has(w));

  for (const guess of previousGuesses) {
    possibleAnswers = filterWordsByFeedback(possibleAnswers, guess.word, guess.feedback);
  }

  const promptCategory = (word: string): string => {
    const normalizedWord = word.toLowerCase();

    for (const puzzle of matchingPuzzles) {
      if (puzzle.answer.toLowerCase() === normalizedWord) return 'answer';
      if (puzzle.luckyGuess.toLowerCase() === normalizedWord) return 'lucky_guess';
      if ((puzzle.guesses ?? []).some((guess) => guess.toLowerCase() === normalizedWord)) {
        return 'extra_guess';
      }
    }

    return 'similar';
  };

  const suggestions: SearchleSuggestion[] = possibleAnswers.map((word, idx) => {
    const category = promptCategory(word);
    const baseScore = category === 'answer' ? 100 : category === 'lucky_guess' ? 95 : 85;

    return {
      word,
      score: Math.max(baseScore - idx * 2, 10),
      entropy: calculateEntropy(word, possibleAnswers),
      category
    };
  });

  const categoryRank: Record<string, number> = {
    answer: 0,
    lucky_guess: 1,
    extra_guess: 2,
    similar: 3
  };

  suggestions.sort((a, b) => {
    const rankDifference = (categoryRank[a.category] ?? 99) - (categoryRank[b.category] ?? 99);
    if (rankDifference !== 0) return rankDifference;

    const promptOrderDifference =
      (promptOrdering.get(a.word.toLowerCase()) ?? Number.MAX_SAFE_INTEGER) -
      (promptOrdering.get(b.word.toLowerCase()) ?? Number.MAX_SAFE_INTEGER);
    if (promptOrderDifference !== 0) return promptOrderDifference;

    return b.entropy - a.entropy;
  });

  suggestions.forEach((s, idx) => {
    s.score = Math.max(100 - idx * 5, 10);
  });

  return {
    suggestions,
    totalWords: possibleAnswers.length,
    matchingPuzzlesFound: matchingPuzzles.length
  };
}
