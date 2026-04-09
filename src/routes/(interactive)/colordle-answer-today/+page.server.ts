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
	const pageTitle = `Colordle Answer Today (${formattedDate}) - Daily Color Puzzle Solution & Tips | WordSolver`;
	const pageDescription = `Today's Colordle answer for ${formattedDate} with hex code, scoring breakdown, strategy tips, and a full answer archive. Updated daily by real players.`;
	const pageKeywords = `colordle answer today, colordle color puzzle, daily color solution, colordle hex code, colordle tips, colordle archive`;

	const faqItems = [
		{
			'@type': 'Question',
			name: `What is the Colordle answer for today, ${formattedDate}?`,
			acceptedAnswer: {
				'@type': 'Answer',
				text: `For ${formattedDate}, the daily color is ${color.name} with hex code ${color.hex}.`
			}
		},
		{
			'@type': 'Question',
			name: 'What was the Colordle answer for yesterday?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: yesterdayData
					? `The previous daily color was ${yesterdayData.color.name} with hex code ${yesterdayData.color.hex} on ${yesterdayData.formattedDate}.`
					: 'Yesterday Colordle data is not available right now.'
			}
		},
		{
			'@type': 'Question',
			name: 'How do you play Colordle?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'You see a target color and guess a named color. After each guess the game gives you a percentage score showing how close your pick is to the target. You keep guessing until you land on the exact match. There is no guess limit.'
			}
		},
		{
			'@type': 'Question',
			name: 'How many guesses do you get in Colordle?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'There is no hard limit on guesses. You can keep trying until you hit 100%. Most players aim to solve it in under six guesses.'
			}
		},
		{
			'@type': 'Question',
			name: 'What does the percentage score mean in Colordle?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'The percentage reflects how visually similar your guess is to the target color. It is calculated using the CIEDE2000 color-difference formula in LAB color space. A score of 100 means an exact match.'
			}
		},
		{
			'@type': 'Question',
			name: 'When does the new daily color release?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'A new Colordle puzzle is released every day at midnight JST (Japan Standard Time), which is 3 PM GMT or 11 AM Eastern Time.'
			}
		},
		{
			'@type': 'Question',
			name: 'What is a hex code?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'A hex code is a 6-character code like #FF5733 representing a specific color. The first 2 characters = red, next 2 = green, last 2 = blue values in the RGB spectrum.'
			}
		},
		{
			'@type': 'Question',
			name: 'How can I browse earlier Colordle daily colors?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Use the built-in search on this page to scan recent entries by date, color name, or hex code. For the full calendar view, visit the Colordle archive page.'
			}
		}
	];

	const jsonLd = JSON.stringify([
		{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems },
		{
			'@context': 'https://schema.org',
			'@type': 'HowTo',
			name: 'How to Play Colordle',
			description: 'Step-by-step guide for the daily color guessing game Colordle.',
			step: [
				{ '@type': 'HowToStep', position: 1, text: 'Visit colordle.ryantanen.com and look at the target color on screen.' },
				{ '@type': 'HowToStep', position: 2, text: 'Type a color name as your first guess. Start with something broad like "blue" or "red" to gauge direction.' },
				{ '@type': 'HowToStep', position: 3, text: 'Review the percentage feedback. A higher score means your guess is perceptually closer to the target.' },
				{ '@type': 'HowToStep', position: 4, text: 'Adjust one property at a time — brightness, hue family, or warmth — based on the feedback.' },
				{ '@type': 'HowToStep', position: 5, text: 'Continue refining with more specific names until you reach a 100% match.' }
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wordsolver.tech' },
				{ '@type': 'ListItem', position: 2, name: 'Game Answers', item: 'https://wordsolver.tech/game-answers' },
				{ '@type': 'ListItem', position: 3, name: 'Colordle Answer Today', item: 'https://wordsolver.tech/colordle-answer-today' }
			]
		},
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
