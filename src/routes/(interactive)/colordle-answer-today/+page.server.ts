import {
	getColordleTodayPayload,
	type ColordleTodayPayload
} from '$lib/colordle-date';
import { format } from 'date-fns';
import { getPuzzleDateForGame } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const today = getPuzzleDateForGame('colordle');
	const requestedFormattedDate = format(today, 'MMMM d, yyyy');
	let todayData: ColordleTodayPayload | null = null;

	try {
		const response = await fetch('/api/colordle/today');
		const payload = (await response.json().catch(() => null)) as
			| ({ success?: boolean } & Partial<ColordleTodayPayload>)
			| null;

		if (response.ok && payload?.success && payload.color && payload.formattedDate) {
			todayData = payload as ColordleTodayPayload;
			const puzzleDateHeader = response.headers.get('X-Puzzle-Date');
			if (puzzleDateHeader) {
				setHeaders({
					'X-Puzzle-Date': puzzleDateHeader
				});
			}
		}
	} catch (error) {
		console.warn('Colordle today API request failed, using local dataset fallback:', error);
	}

	todayData ??= getColordleTodayPayload(today);

	if (!todayData) {
		return {
			error: true,
			color: null,
			dayNum: null,
			formattedDate: requestedFormattedDate,
			requestedFormattedDate,
			isFallback: false,
			availableThroughFormattedDate: null,
			yesterdayData: null,
			last100Days: [],
			schemas: null,
			meta: {
				title: 'Colordle Answer Today',
				description: '',
				keywords: 'colordle answer today, colordle answer, colordle hint, colordle hint today',
				featuredImage: '/colordle-answer-today.webp'
			}
		};
	}

	const {
		color,
		dayNum,
		formattedDate,
		isFallback,
		availableThroughFormattedDate,
		yesterdayData,
		last100Days,
		actualDateKey
	} = todayData;

	setHeaders({
		'X-Puzzle-Date': actualDateKey
	});

	const currentMonth = format(today, 'MMMM');
	const pageTitle = `Colordle Answer Today - ${currentMonth} - Updated`;
	const pageDescription = `Today's Colordle answer for ${formattedDate}, yesterday's answer, and a 100-day archive of Colordle color solutions with fast search links.`;
	const pageKeywords = `colordle answer today, colordle answer yesterday, colordle archive, colordle color answers, colordle search, last 100 days, colordle hex code`;

	const faqItems = [
		{
			'@type': 'Question',
			name: `What is the Colordle answer for today, ${formattedDate}?`,
			acceptedAnswer: {
				'@type': 'Answer',
				text: `The Colordle answer for today, ${formattedDate}, is ${color.name} with hex code ${color.hex}.`
			}
		},
		{
			'@type': 'Question',
			name: 'What was the Colordle answer for yesterday?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: yesterdayData
					? `The Colordle answer for yesterday, ${yesterdayData.formattedDate}, was ${yesterdayData.color.name} with hex code ${yesterdayData.color.hex}.`
					: 'Yesterday Colordle data is not available right now.'
			}
		},
		{
			'@type': 'Question',
			name: 'How can I search previous Colordle answers?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Use the Colordle archive page to browse previous answers by date and open any past solution instantly.'
			}
		},
		{
			'@type': 'Question',
			name: 'How is the Colordle answer calculated?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Colordle uses an algorithm based on the CIEDE2000 color difference formula.'
			}
		},
		{
			'@type': 'Question',
			name: 'When does the new color release?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'A new Colordle puzzle is released every day at midnight JST.'
			}
		}
	];

	const jsonLd = JSON.stringify([
		{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems },
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: pageTitle,
			datePublished: `${todayData.actualDateKey}T00:00:00.000Z`,
			dateModified: today.toISOString(),
			author: {
				'@type': 'Person',
				name: 'Preston Hayes',
				image: 'https://wordsolver.tech/auther-wordsolverx.webp',
				url: 'https://wordsolver.tech/about#preston-hayes'
			},
			publisher: { '@type': 'Organization', name: 'WordSolverX' },
			mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolver.tech/colordle-answer-today' },
			description: pageDescription,
			image: ['/colordle-answer-today.webp']
		}
	]);

	return {
		error: false,
		color,
		dayNum,
		formattedDate,
		requestedFormattedDate,
		isFallback,
		availableThroughFormattedDate,
		yesterdayData,
		last100Days,
		schemas: jsonLd,
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: pageKeywords,
			featuredImage: '/colordle-answer-today.webp'
		}
	};
};
