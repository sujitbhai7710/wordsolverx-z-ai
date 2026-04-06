import { format } from 'date-fns';
import { getPuzzleDateForGame } from '$lib/puzzle-window';

export function getMainDailyDate(now: Date = new Date()): Date {
	return getPuzzleDateForGame('wordle', now);
}

export function getMainDailyDateKey(now: Date = new Date()): string {
	return format(getMainDailyDate(now), 'yyyy-MM-dd');
}

export function getMainDailyDateLabel(now: Date = new Date()): string {
	return format(getMainDailyDate(now), 'MMMM d, yyyy');
}
