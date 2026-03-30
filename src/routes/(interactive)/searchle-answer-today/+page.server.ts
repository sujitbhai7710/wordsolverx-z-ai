import { SEARCHLE_PUZZLES } from '$lib/searchle/searchleData';
import { getSearchlePuzzleForDate } from '$lib/searchle/daily';
import { getPuzzleDateForGame } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	totalPuzzles: SEARCHLE_PUZZLES.length,
	todayPuzzle: getSearchlePuzzleForDate(getPuzzleDateForGame('searchle'))
});
