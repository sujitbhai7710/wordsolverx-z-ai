import { SEARCHLE_PUZZLES, getDailyPuzzle } from './searchleData';

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

function findMatchingPuzzles(partialPrompt: string): Array<{ text: string; answer: string; luckyGuess: string }> {
  const promptLower = partialPrompt.toLowerCase().replace('...', '').trim();
  if (!promptLower) return [];

  return SEARCHLE_PUZZLES.filter((puzzle) => {
    const textLower = puzzle.text.toLowerCase();
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
    answers.add(puzzle.answer.toLowerCase());
    answers.add(puzzle.luckyGuess.toLowerCase());
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

  let possibleAnswers = getPossibleAnswers(prompt);

  if (possibleAnswers.length === 0) {
    const promptWords = prompt
      .toLowerCase()
      .replace('...', '')
      .split(' ')
      .filter((word) => word.length > 2);

    for (const word of promptWords) {
      const wordMatches = SEARCHLE_PUZZLES.filter(
        (puzzle) =>
          puzzle.text.toLowerCase().includes(word) || puzzle.answer.toLowerCase().includes(word)
      ).slice(0, 30);

      for (const match of wordMatches) {
        possibleAnswers.push(match.answer.toLowerCase());
        possibleAnswers.push(match.luckyGuess.toLowerCase());
      }
    }
  }

  possibleAnswers = [...new Set(possibleAnswers)].filter((w) => !guessedWords.has(w));

  for (const guess of previousGuesses) {
    possibleAnswers = filterWordsByFeedback(possibleAnswers, guess.word, guess.feedback);
  }

  const matchingAnswers = matchingPuzzles.map((p) => p.answer.toLowerCase());

  const suggestions: SearchleSuggestion[] = possibleAnswers.slice(0, 50).map((word, idx) => {
    const isExactMatch = matchingAnswers.includes(word);
    const baseScore = isExactMatch ? 100 : 80;

    return {
      word,
      score: Math.max(baseScore - idx * 2, 10),
      entropy: calculateEntropy(word, possibleAnswers),
      category: isExactMatch ? 'exact_match' : 'similar'
    };
  });

  if (previousGuesses.length === 0) {
    suggestions.sort((a, b) => {
      if (a.category === 'exact_match' && b.category !== 'exact_match') return -1;
      if (b.category === 'exact_match' && a.category !== 'exact_match') return 1;
      return b.entropy - a.entropy;
    });
  }

  suggestions.forEach((s, idx) => {
    s.score = Math.max(100 - idx * 5, 10);
  });

  return {
    suggestions: suggestions.slice(0, 10),
    totalWords: possibleAnswers.length,
    matchingPuzzlesFound: matchingPuzzles.length
  };
}
