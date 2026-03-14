import { format } from 'date-fns';

const ARCHIVE_DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toArchiveDateKey(date: Date): string {
	return format(date, 'yyyy-MM-dd');
}

export function parseArchiveDateKey(dateKey: string | null): Date | null {
	if (!dateKey || !ARCHIVE_DATE_KEY_PATTERN.test(dateKey)) {
		return null;
	}

	const [yearString, monthString, dayString] = dateKey.split('-');
	const year = Number(yearString);
	const monthIndex = Number(monthString) - 1;
	const day = Number(dayString);
	const date = new Date(Date.UTC(year, monthIndex, day));

	if (
		Number.isNaN(date.getTime()) ||
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== monthIndex ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	return date;
}

export function isArchiveDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
	const selected = toArchiveDateKey(date);
	const start = toArchiveDateKey(startDate);
	const end = toArchiveDateKey(endDate);

	return selected >= start && selected <= end;
}
