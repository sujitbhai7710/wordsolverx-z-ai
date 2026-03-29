import { getSearchlePuzzleForDate } from '$lib/searchle/daily';
import { getPuzzleDateForGame } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	dailyPuzzle: getSearchlePuzzleForDate(getPuzzleDateForGame('searchle'))
});
