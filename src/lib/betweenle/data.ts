import dailyWordsText from '$lib/data/betweenle/daily-words.txt?raw';
import wordsText from '$lib/data/betweenle/words.txt?raw';

function parseWordList(source: string): string[] {
  return source
    .trim()
    .split('\n')
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);
}

export const BETWEENLE_WORDS = parseWordList(wordsText);
export const BETWEENLE_DAILY_WORDS = parseWordList(dailyWordsText);
