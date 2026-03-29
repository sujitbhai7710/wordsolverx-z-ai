import { format } from 'date-fns';
import { getPuzzleDateForGame } from '$lib/puzzle-window';

export const prerender = true;

export const load = () => ({
	todayStr: format(getPuzzleDateForGame('wordle'), 'MMMM d, yyyy')
});
