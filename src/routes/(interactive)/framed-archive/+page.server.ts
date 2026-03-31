import { VALID_MODES, fetchRecentFramedAnswers } from '$lib/framed';
import { getPuzzleWindow } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  const window = getPuzzleWindow('framed');
  const targetDateKey = window.effectivePuzzleDate;

  const archiveEntriesByMode = Object.fromEntries(
    await Promise.all(
      VALID_MODES.map(async (mode) => [mode, await fetchRecentFramedAnswers(30, mode, targetDateKey)])
    )
  );

  setHeaders({
    'X-Puzzle-Date': targetDateKey
  });

  return {
    archiveEntriesByMode,
    targetDateKey
  };
};
