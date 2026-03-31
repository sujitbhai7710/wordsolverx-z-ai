import { getPuzzleWindow } from '$lib/puzzle-window';
import { fetchCountryleAnswerForDateKey, fetchRecentCountryleAnswers } from '$lib/countryle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  const window = getPuzzleWindow('countryle');
  const targetDateKey = window.effectivePuzzleDate;
  const activeAnswer =
    (await fetchCountryleAnswerForDateKey(targetDateKey)) ??
    (window.fallbackPuzzleDate ? await fetchCountryleAnswerForDateKey(window.fallbackPuzzleDate) : null);

  const archiveEntries = activeAnswer ? await fetchRecentCountryleAnswers(45, activeAnswer.dateKey) : [];

  if (activeAnswer) {
    setHeaders({
      'X-Puzzle-Date': activeAnswer.dateKey,
      'X-Edge-Cache-Bypass': activeAnswer.dateKey === targetDateKey ? '0' : '1'
    });
  }

  return {
    archiveEntries,
    activeDateKey: activeAnswer?.dateKey ?? targetDateKey
  };
};
