import { getPuzzleDateForGame } from '$lib/puzzle-window';
import { getPuzzleAnswerByNumber, getPuzzleNumber } from '$lib/colorfle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const activeDate = getPuzzleDateForGame('colorfle');
  const currentPuzzleNumber = getPuzzleNumber(activeDate);
  const archiveEntries = [];

  for (let puzzleNumber = currentPuzzleNumber; puzzleNumber > Math.max(0, currentPuzzleNumber - 99); puzzleNumber -= 1) {
    archiveEntries.push(getPuzzleAnswerByNumber(puzzleNumber));
  }

  return {
    currentPuzzleNumber,
    archiveEntries
  };
};
