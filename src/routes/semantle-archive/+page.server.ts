import type { PageServerLoad } from './$types';
import { parseArchiveDateKey, isArchiveDateInRange, toArchiveDateKey } from '$lib/archive-page';
import { getSemantleDataForDate } from '$lib/semantle';
import { getJSTToday } from '$lib/utils';

const SEMANTLE_START_DATE = new Date(2022, 0, 29);

export const load: PageServerLoad = async ({ url }) => {
	const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
	const today = getJSTToday();

	if (!selectedDate || !isArchiveDateInRange(selectedDate, SEMANTLE_START_DATE, today)) {
		return {
			selectedDateKey: null,
			selectedSemantle: null
		};
	}

	return {
		selectedDateKey: toArchiveDateKey(selectedDate),
		selectedSemantle: getSemantleDataForDate(selectedDate)
	};
};
