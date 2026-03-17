import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getNerdleAnswerForDateKey,
	getNerdleAnswerForToday,
	getNerdleAnswerRange,
	getNerdleDateKeyFromPuzzleNumber,
	fetchNerdleAnswerByPuzzleNumber,
	getNerdlePuzzleNumber,
	isValidNerdleDateKey,
	getNerdleTodayDateKey,
	isNerdleDateKeyAfterToday
} from '$lib/nerdle';

export const GET: RequestHandler = async ({ url }) => {
	const dateParam = url.searchParams.get('date');
	const puzzleNumberParam = url.searchParams.get('num');
	const rangeParam = url.searchParams.get('range');
	const todayDateKey = getNerdleTodayDateKey();
	const latestPuzzleNumber = getNerdlePuzzleNumber(todayDateKey);

	try {
		if (rangeParam) {
			const range = Number.parseInt(rangeParam, 10);
			if (Number.isNaN(range) || range < 1) {
				return json({ success: false, error: 'Invalid range. Must be a positive number.' }, { status: 400 });
			}

			const startDateKey = dateParam && isValidNerdleDateKey(dateParam) ? dateParam : undefined;
			if (startDateKey && isNerdleDateKeyAfterToday(startDateKey)) {
				return json({ success: false, error: 'Cannot fetch future Nerdle answers.' }, { status: 400 });
			}

			const data = await getNerdleAnswerRange(range, startDateKey);
			return json({ success: true, data: data.filter((entry) => entry.date <= todayDateKey) });
		}

		if (puzzleNumberParam !== null) {
			const puzzleNumber = Number.parseInt(puzzleNumberParam, 10);
			if (Number.isNaN(puzzleNumber) || puzzleNumber < 0) {
				return json({ success: false, error: 'Invalid puzzle number. Must be >= 0.' }, { status: 400 });
			}
			if (puzzleNumber > latestPuzzleNumber) {
				return json({ success: false, error: 'Cannot fetch future Nerdle answers.' }, { status: 400 });
			}

			const answer = await fetchNerdleAnswerByPuzzleNumber(puzzleNumber);
			return json({
				success: true,
				data: {
					date: getNerdleDateKeyFromPuzzleNumber(puzzleNumber),
					puzzleNumber,
					answer
				}
			});
		}

		if (dateParam) {
			if (!isValidNerdleDateKey(dateParam)) {
				return json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
			}
			if (isNerdleDateKeyAfterToday(dateParam)) {
				return json({ success: false, error: 'Cannot fetch future Nerdle answers.' }, { status: 400 });
			}

			const puzzleNumber = getNerdlePuzzleNumber(dateParam);
			if (puzzleNumber < 0) {
				return json(
					{ success: false, error: 'Date is before Nerdle launch (January 20, 2022).' },
					{ status: 400 }
				);
			}

			const data = await getNerdleAnswerForDateKey(dateParam);
			return json({ success: true, data });
		}

		const data = await getNerdleAnswerForToday();
		return json({ success: true, data });
	} catch (error) {
		console.error('Error in Nerdle answers API:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
