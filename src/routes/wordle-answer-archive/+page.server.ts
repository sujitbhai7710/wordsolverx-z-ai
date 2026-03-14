import type { PageServerLoad } from './$types';
import { parseArchiveDateKey, isArchiveDateInRange, toArchiveDateKey } from '$lib/archive-page';
import { getWordleByDate } from '$lib/api';
import { getJSTToday } from '$lib/utils';

const WORDLE_START_DATE = new Date(2021, 5, 19);

export const load: PageServerLoad = async ({ url }) => {
	const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
	const today = getJSTToday();

	if (!selectedDate || !isArchiveDateInRange(selectedDate, WORDLE_START_DATE, today)) {
		return {
			selectedDateKey: null,
			selectedWordle: null
		};
	}

	const selectedWordle = await getWordleByDate(toArchiveDateKey(selectedDate)).catch(() => null);

	return {
		selectedDateKey: toArchiveDateKey(selectedDate),
		selectedWordle: selectedWordle && selectedWordle.solution ? selectedWordle : null
	};
};
