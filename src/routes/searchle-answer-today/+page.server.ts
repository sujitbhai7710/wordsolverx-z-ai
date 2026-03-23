import { SEARCHLE_PUZZLES } from '$lib/searchle/searchleData';
import { getSearchlePuzzleForDate } from '$lib/searchle/daily';
import { getISTToday } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	totalPuzzles: SEARCHLE_PUZZLES.length,
	todayPuzzle: getSearchlePuzzleForDate(getISTToday())
});
