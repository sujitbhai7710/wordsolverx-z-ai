import type { PageServerLoad } from './$types';
import { parseArchiveDateKey, isArchiveDateInRange, toArchiveDateKey } from '$lib/archive-page';
import { getWaffleDataForDate } from '$lib/waffle';
import { getPuzzleDateForGame } from '$lib/puzzle-window';

const WAFFLE_START_DATE = new Date(2022, 0, 1);

export const load: PageServerLoad = async ({ url }) => {
	const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
	const today = getPuzzleDateForGame('waffle');

	if (!selectedDate || !isArchiveDateInRange(selectedDate, WAFFLE_START_DATE, today)) {
		return {
			selectedDateKey: null,
			selectedWaffle: null
		};
	}

	return {
		selectedDateKey: toArchiveDateKey(selectedDate),
		selectedWaffle: await getWaffleDataForDate(selectedDate)
	};
};
