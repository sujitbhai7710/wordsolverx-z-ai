import allowedWordsJson from './dordle-data/allowed_words.json';
import answersWordsJson from './dordle-data/answers_words.json';

export const ANSWER_WORDS: string[] = (answersWordsJson as string[]).map(w => w.toLowerCase());
export const ALLOWED_WORDS: string[] = (allowedWordsJson as string[]).map(w => w.toLowerCase());

export const ANSWER_WORDS_SET = new Set(ANSWER_WORDS);
export const ALLOWED_WORDS_SET = new Set(ALLOWED_WORDS);

export function isValidWord(word: string): boolean {
  return ALLOWED_WORDS_SET.has(word.toLowerCase()) || ANSWER_WORDS_SET.has(word.toLowerCase());
}

export function isPossibleAnswer(word: string): boolean {
  return ANSWER_WORDS_SET.has(word.toLowerCase());
}

export function getRandomAnswer(): string {
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
}

export const WORD_STATS = {
  totalAllowedWords: ALLOWED_WORDS.length,
  totalAnswerWords: ANSWER_WORDS.length,
};
