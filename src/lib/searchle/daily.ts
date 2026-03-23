import { getDailyPuzzle } from './searchleData';

export interface SearchleDailyPuzzle {
	date: string;
	prompt: string;
	answer: string;
	luckyGuess?: string;
}

export function formatSearchleDate(date: Date): string {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
		date.getDate()
	).padStart(2, '0')}`;
}

export function getSearchlePuzzleForDate(date: Date): SearchleDailyPuzzle {
	const puzzle = getDailyPuzzle(date);
	return {
		date: formatSearchleDate(date),
		prompt: `${puzzle.text}...`,
		answer: puzzle.answer,
		luckyGuess: puzzle.luckyGuess
	};
}

export function getSearchleArchive(baseDate: Date, days: number = 7): SearchleDailyPuzzle[] {
	const archive: SearchleDailyPuzzle[] = [];
	for (let i = 1; i <= days; i += 1) {
		const date = new Date(baseDate);
		date.setDate(date.getDate() - i);
		archive.push(getSearchlePuzzleForDate(date));
	}
	return archive;
}

export function getSearchleMonthPuzzles(year: number, monthIndex: number): SearchleDailyPuzzle[] {
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
	const puzzles: SearchleDailyPuzzle[] = [];
	for (let day = 1; day <= daysInMonth; day += 1) {
		puzzles.push(getSearchlePuzzleForDate(new Date(year, monthIndex, day)));
	}
	return puzzles;
}
