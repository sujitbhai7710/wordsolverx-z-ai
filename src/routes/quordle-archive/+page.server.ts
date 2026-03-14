import type { PageServerLoad } from './$types';
import { parseArchiveDateKey, isArchiveDateInRange, toArchiveDateKey } from '$lib/archive-page';
import { getQuordleDataForDate } from '$lib/quordle';
import { getJSTToday } from '$lib/utils';

const QUORDLE_START_DATE = new Date(2022, 0, 30);

export const load: PageServerLoad = async ({ url }) => {
	const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
	const today = getJSTToday();

	if (!selectedDate || !isArchiveDateInRange(selectedDate, QUORDLE_START_DATE, today)) {
		return {
			selectedDateKey: null,
			selectedQuordle: null
		};
	}

	return {
		selectedDateKey: toArchiveDateKey(selectedDate),
		selectedQuordle: getQuordleDataForDate(selectedDate)
	};
};
