import { fetchCountryleAnswerForDateKey } from '$lib/countryle';
import { getPuzzleWindow } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const window = getPuzzleWindow('countryle');
	const targetDateKey = window.effectivePuzzleDate;
	const answer =
		(await fetchCountryleAnswerForDateKey(targetDateKey)) ??
		(window.fallbackPuzzleDate
			? await fetchCountryleAnswerForDateKey(window.fallbackPuzzleDate)
			: null);

	setHeaders({
		'X-Puzzle-Date': answer?.dateKey ?? targetDateKey,
		'X-Edge-Cache-Bypass': answer?.dateKey === targetDateKey ? '0' : '1'
	});

	return {
		answerId: answer?.country.id ?? null,
		answerName: answer?.country.country ?? null,
		dateKey: answer?.dateKey ?? targetDateKey,
		displayDate:
			answer?.displayDate ??
			new Date(`${targetDateKey}T12:00:00Z`).toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC'
			}),
		gameNumber: answer?.gameNumber ?? null
	};
};
