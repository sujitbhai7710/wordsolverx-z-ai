import { getSearchlePuzzleForDate } from '$lib/searchle/daily';
import { getISTToday } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	dailyPuzzle: getSearchlePuzzleForDate(getISTToday())
});
