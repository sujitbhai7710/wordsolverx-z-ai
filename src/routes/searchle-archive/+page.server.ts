import { isArchiveDateInRange, parseArchiveDateKey, toArchiveDateKey } from '$lib/archive-page';
import { getSearchlePuzzleForDate } from '$lib/searchle/searchleSolver';
import { getISTToday } from '$lib/utils';
import type { PageServerLoad } from './$types';

const SEARCHLE_START_DATE = new Date(2023, 5, 22);

export const load: PageServerLoad = async ({ url }) => {
  const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
  const today = getISTToday();

  if (!selectedDate || !isArchiveDateInRange(selectedDate, SEARCHLE_START_DATE, today)) {
    return {
      selectedDateKey: null,
      selectedPuzzle: null,
    };
  }

  const selectedDateKey = toArchiveDateKey(selectedDate);

  return {
    selectedDateKey,
    selectedPuzzle: getSearchlePuzzleForDate(new Date(`${selectedDateKey}T12:00:00`)),
  };
};
