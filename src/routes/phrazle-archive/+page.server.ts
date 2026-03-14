import { isArchiveDateInRange, parseArchiveDateKey, toArchiveDateKey } from '$lib/archive-page';
import { REFERENCE_DATE, getAnswerForDate } from '$lib/phrazle/phrases';
import { getISTToday } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
  const today = getISTToday();

  if (!selectedDate || !isArchiveDateInRange(selectedDate, REFERENCE_DATE, today)) {
    return {
      selectedDateKey: null,
      selectedAnswers: null,
    };
  }

  const selectedDateKey = toArchiveDateKey(selectedDate);
  const activeDate = new Date(`${selectedDateKey}T12:00:00`);

  return {
    selectedDateKey,
    selectedAnswers: {
      morning: getAnswerForDate(activeDate, 'morning'),
      afternoon: getAnswerForDate(activeDate, 'afternoon'),
    },
  };
};
