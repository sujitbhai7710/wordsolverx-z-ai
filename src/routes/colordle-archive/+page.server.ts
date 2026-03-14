import type { PageServerLoad } from './$types';
import { parseArchiveDateKey, isArchiveDateInRange, toArchiveDateKey } from '$lib/archive-page';
import { getColordleDataForDate } from '$lib/colordle-date';
import { getJSTToday } from '$lib/utils';

const COLORDLE_START_DATE = new Date(2023, 7, 7);

export const load: PageServerLoad = async ({ url }) => {
	const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
	const today = getJSTToday();

	if (!selectedDate || !isArchiveDateInRange(selectedDate, COLORDLE_START_DATE, today)) {
		return {
			selectedDateKey: null,
			selectedColordle: null
		};
	}

	return {
		selectedDateKey: toArchiveDateKey(selectedDate),
		selectedColordle: getColordleDataForDate(selectedDate)
	};
};
