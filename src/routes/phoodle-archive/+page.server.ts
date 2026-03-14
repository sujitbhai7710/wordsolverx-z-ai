import type { PageServerLoad } from './$types';
import { getAllPhoodleDates, getPhoodleDataForDate } from '$lib/phoodle';
import { parseArchiveDateKey, toArchiveDateKey } from '$lib/archive-page';

export const load: PageServerLoad = async ({ url }) => {
	const availableDateStrings = await getAllPhoodleDates();
	const availableDateSet = new Set(availableDateStrings);
	const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));
	const selectedDateKey = selectedDate ? toArchiveDateKey(selectedDate) : null;

	return {
		availableDateStrings,
		selectedDateKey: selectedDateKey && availableDateSet.has(selectedDateKey) ? selectedDateKey : null,
		selectedPhoodle:
			selectedDate && selectedDateKey && availableDateSet.has(selectedDateKey)
				? await getPhoodleDataForDate(selectedDate)
				: null
	};
};
