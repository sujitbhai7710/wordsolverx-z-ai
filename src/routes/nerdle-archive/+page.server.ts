import type { PageServerLoad } from './$types';
import {
	NERDLE_START_DATE_KEY,
	getNerdleTodayDateKey,
	isValidNerdleDateKey,
	isNerdleDateKeyAfterToday
} from '$lib/nerdle';
import { getNerdleAllModeAnswerForToday, type NerdleAnswerFetchOptions } from '$lib/nerdle-answers';

function formatSeoDate(dateKey: string): string {
	const date = new Date(`${dateKey}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) {
		return dateKey;
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'Asia/Tokyo'
	});
}

export const load: PageServerLoad = async ({ url, platform, fetch }) => {
	const fetchOptions: NerdleAnswerFetchOptions = {
		platform,
		fetchImpl: fetch
	};
	const dateParam = url.searchParams.get('date');
	const todayPayload = await getNerdleAllModeAnswerForToday(fetchOptions);
	const todayDateKey = todayPayload?.date ?? getNerdleTodayDateKey();

	let selectedDateKey: string | null = null;
	if (
		dateParam &&
		isValidNerdleDateKey(dateParam) &&
		dateParam >= NERDLE_START_DATE_KEY &&
		!isNerdleDateKeyAfterToday(dateParam)
	) {
		selectedDateKey = dateParam;
	}

	const selectedDateLabel = selectedDateKey ? formatSeoDate(selectedDateKey) : null;
	const title = selectedDateLabel
		? `Nerdle Archive ( ${selectedDateLabel} )`
		: 'Nerdle Archive - All Modes Answers by Date';
	const description = selectedDateLabel
		? `View all Nerdle mode answers for ${selectedDateLabel}, including Classic, Micro, Mini, Midi, Maxi, Mini Bi, Quad, Speed, and Instant.`
		: 'Browse stored Nerdle answers by date for all modes: Classic, Micro, Mini, Midi, Maxi, Mini Bi, Quad, Speed, and Instant.';

	const schemas = JSON.stringify([
		{
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: 'Nerdle Archive',
			description,
			url: 'https://wordsolver.tech/nerdle-archive'
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wordsolver.tech' },
				{ '@type': 'ListItem', position: 2, name: 'Archive', item: 'https://wordsolver.tech/archive' },
				{ '@type': 'ListItem', position: 3, name: 'Nerdle Archive', item: 'https://wordsolver.tech/nerdle-archive' }
			]
		}
	]);

	return {
		selectedDateKey,
		todayDateKey,
		meta: {
			title,
			description,
			keywords:
				'nerdle archive, nerdle all modes archive, nerdle classic micro mini midi maxi quad speed instant answers, nerdle previous answers',
			canonical: 'https://wordsolver.tech/nerdle-archive'
		},
		schemas
	};
};
