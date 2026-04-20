export interface WorgleArchiveEntry {
	date: string;
	word: string;
	puzzle: number;
}

const WORGLE_EPOCH_UTC_MS = Date.UTC(2021, 5, 19);
const WORGLE_INDEX_OFFSET = 207;

export function formatWorgleDateKey(date: Date): string {
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
		date.getUTCDate()
	).padStart(2, '0')}`;
}

export function parseWorgleDateKey(dateKey: string): Date {
	return new Date(`${dateKey}T12:00:00Z`);
}

export function getWorgleAnswerForDateKey(dateKey: string, solutions: string[]): string {
	const target = parseWorgleDateKey(dateKey);
	const targetUtcMs = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
	const dayOffset = Math.round((targetUtcMs - WORGLE_EPOCH_UTC_MS) / 86_400_000);
	const rawIndex = dayOffset - WORGLE_INDEX_OFFSET;
	const index = ((rawIndex % solutions.length) + solutions.length) % solutions.length;

	return solutions[index] ?? '';
}

export function getWorglePuzzleNumberForDateKey(dateKey: string): number {
	const target = parseWorgleDateKey(dateKey);
	const targetUtcMs = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
	const dayOffset = Math.round((targetUtcMs - WORGLE_EPOCH_UTC_MS) / 86_400_000);

	return dayOffset - 206;
}

export function getWorgleEntryForDateKey(
	dateKey: string,
	archive: WorgleArchiveEntry[],
	solutions: string[]
): WorgleArchiveEntry {
	return (
		archive.find((entry) => entry.date === dateKey) ?? {
			date: dateKey,
			word: getWorgleAnswerForDateKey(dateKey, solutions),
			puzzle: getWorglePuzzleNumberForDateKey(dateKey)
		}
	);
}
