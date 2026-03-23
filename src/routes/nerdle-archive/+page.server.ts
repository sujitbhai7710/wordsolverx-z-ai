import type { PageServerLoad } from './$types';
import {
	NERDLE_START_DATE_KEY,
	getNerdleTodayDateKey,
	isValidNerdleDateKey,
	isNerdleDateKeyAfterToday
} from '$lib/nerdle';

function formatSeoDate(dateKey: string): string {
	const date = new Date(`${dateKey}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) {
		return dateKey;
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'Asia/Kolkata'
	});
}

export const load: PageServerLoad = async ({ url }) => {
	const dateParam = url.searchParams.get('date');
	const todayDateKey = getNerdleTodayDateKey();

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
		: 'Nerdle Archive - All Past Nerdle Answers by Date';
	const description = selectedDateLabel
		? `View the Nerdle answer for ${selectedDateLabel}, plus full equation history and date navigation in the Nerdle archive.`
		: 'Browse the complete Nerdle archive by date. Check past Nerdle equations, puzzle numbers, and answer history with calendar navigation.';

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
				'nerdle archive, nerdle past answers, nerdle answer history, nerdle calendar, nerdle previous answers',
			canonical: 'https://wordsolver.tech/nerdle-archive'
		},
		schemas
	};
};
