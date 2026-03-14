import type { PageServerLoad } from './$types';
import { parseArchiveDateKey, isArchiveDateInRange, toArchiveDateKey } from '$lib/archive-page';
import { getGlobleDataForDate } from '$lib/globle-date';
import { getJSTToday } from '$lib/utils';

const GLOBLE_START_DATE = new Date(2022, 0, 1);

export const load: PageServerLoad = async ({ url }) => {
	const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
	const today = getJSTToday();

	if (!selectedDate || !isArchiveDateInRange(selectedDate, GLOBLE_START_DATE, today)) {
		return {
			selectedDateKey: null,
			selectedGloble: null
		};
	}

	return {
		selectedDateKey: toArchiveDateKey(selectedDate),
		selectedGloble: await getGlobleDataForDate(selectedDate)
	};
};
