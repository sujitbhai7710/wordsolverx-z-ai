import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	NERDLE_START_DATE_KEY,
	getNerdleDateKeyFromPuzzleNumber,
	getNerdlePuzzleNumber,
	isValidNerdleDateKey,
	getNerdleTodayDateKey,
	isNerdleDateKeyAfterToday
} from '$lib/nerdle';
import {
	getNerdleAllModeAnswerForDate,
	getNerdleAllModeAnswerForToday,
	type NerdleAnswerFetchOptions
} from '$lib/nerdle-answers';

export const GET: RequestHandler = async ({ url, platform, fetch }) => {
	const dateParam = url.searchParams.get('date');
	const puzzleNumberParam = url.searchParams.get('num');
	const rangeParam = url.searchParams.get('range');
	const todayDateKey = getNerdleTodayDateKey();
	const fetchOptions: NerdleAnswerFetchOptions = {
		platform,
		fetchImpl: fetch
	};

	try {
		if (rangeParam) {
			const range = Number.parseInt(rangeParam, 10);
			if (Number.isNaN(range) || range < 1) {
				return json({ success: false, error: 'Invalid range. Must be a positive number.' }, { status: 400 });
			}

			const endDateKey = dateParam && isValidNerdleDateKey(dateParam) ? dateParam : todayDateKey;
			if (isNerdleDateKeyAfterToday(endDateKey)) {
				return json({ success: false, error: 'Cannot fetch future Nerdle answers.' }, { status: 400 });
			}

			const startDate = new Date(`${endDateKey}T00:00:00Z`);
			const dates: string[] = [];
			for (let offset = 0; offset < Math.min(range, 30); offset++) {
				const date = new Date(startDate);
				date.setUTCDate(startDate.getUTCDate() - offset);
				const dateKey = date.toISOString().slice(0, 10);
				if (dateKey < NERDLE_START_DATE_KEY) {
					break;
				}
				dates.push(dateKey);
			}

			const records = await Promise.all(
				dates.map((dateKey) => getNerdleAllModeAnswerForDate(dateKey, fetchOptions))
			);
			return json({
				success: true,
				data: records.filter((record) => record !== null)
			});
		}

		if (puzzleNumberParam !== null) {
			const puzzleNumber = Number.parseInt(puzzleNumberParam, 10);
			if (Number.isNaN(puzzleNumber) || puzzleNumber < 1) {
				return json({ success: false, error: 'Invalid puzzle number. Must be >= 1.' }, { status: 400 });
			}
			const latestPuzzleNumber = getNerdlePuzzleNumber(todayDateKey);
			if (puzzleNumber > latestPuzzleNumber) {
				return json({ success: false, error: 'Cannot fetch future Nerdle answers.' }, { status: 400 });
			}

			const data = await getNerdleAllModeAnswerForDate(
				getNerdleDateKeyFromPuzzleNumber(puzzleNumber),
				fetchOptions
			);
			if (!data) {
				return json({ success: false, error: 'No stored data for this puzzle number.' }, { status: 404 });
			}
			return json({ success: true, data });
		}

		if (dateParam) {
			if (!isValidNerdleDateKey(dateParam)) {
				return json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
			}
			if (isNerdleDateKeyAfterToday(dateParam)) {
				return json({ success: false, error: 'Cannot fetch future Nerdle answers.' }, { status: 400 });
			}

			if (getNerdlePuzzleNumber(dateParam) < 1) {
				return json(
					{ success: false, error: 'Date is before Nerdle launch (January 20, 2022).' },
					{ status: 400 }
				);
			}

			const data = await getNerdleAllModeAnswerForDate(dateParam, fetchOptions);
			if (!data) {
				return json({ success: false, error: `No stored data for ${dateParam}.` }, { status: 404 });
			}
			return json({ success: true, data });
		}

		const data = await getNerdleAllModeAnswerForToday(fetchOptions);
		if (!data) {
			return json({ success: false, error: 'No stored data for today.' }, { status: 404 });
		}
		return json({ success: true, data });
	} catch (error) {
		console.error('Error in Nerdle answers API:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
