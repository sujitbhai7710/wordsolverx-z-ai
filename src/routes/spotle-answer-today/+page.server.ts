import type { PageServerLoad } from './$types';
import { format, subDays } from 'date-fns';
import {
	COUNTRY_NAMES,
	GENDER_NAMES,
	formatSpotleDate,
	type SpotleAnswer,
	type SpotleArtist,
	type SpotleData
} from '$lib/spotle';

interface SpotleDay {
	date: string;
	dayNumber: number;
	artistName: string;
	artist: SpotleArtist | null;
}

export const load: PageServerLoad = async ({ fetch }) => {
	let data: SpotleData | null = null;

	try {
		const response = await fetch('/spotle_data.json');
		if (!response.ok) {
			throw new Error(`Spotle data fetch failed: ${response.status}`);
		}
		data = (await response.json()) as SpotleData;
	} catch (error) {
		console.error('Spotle data load failed', error);
		data = null;
	}

	const artists = data?.artists ?? [];
	const answers = data?.answers ?? [];

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayStr = formatSpotleDate(today);

	const todayAnswer = answers.find((answer) => answer.date === todayStr) ?? null;
	const todayArtist =
		todayAnswer?.artist
			? artists.find((artist) => artist.artist.toLowerCase() === todayAnswer.artist.toLowerCase()) ??
			  null
			: null;

	const last30Days: SpotleDay[] = [];
	for (let i = 0; i < 30; i += 1) {
		const date = subDays(today, i);
		const dateStr = formatSpotleDate(date);
		const answer = answers.find((entry) => entry.date === dateStr);
		if (!answer) {
			continue;
		}
		const artist =
			artists.find((entry) => entry.artist.toLowerCase() === answer.artist.toLowerCase()) ?? null;
		last30Days.push({
			date: dateStr,
			dayNumber: answer.dayNumber,
			artistName: answer.artist,
			artist
		});
	}

	const faqItems = last30Days.map((entry) => {
		const formattedDate = format(new Date(entry.date), 'MMMM d, yyyy');
		return {
			question: `What was the Spotle answer on ${formattedDate}?`,
			answer: `The Spotle answer for ${formattedDate} was ${entry.artistName}. This was Day #${entry.dayNumber}.`
		};
	});

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqItems.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	};

	const todayFormatted = format(today, 'MMMM d, yyyy');
	const metaTitle = `Spotle Answer Today (${todayFormatted}) | WordSolverX`;
	const metaDescription =
		"Today's Spotle answer, plus the last 30 days of answers with a calendar archive.";

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: 'https://wordsolverx.com'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Today',
				item: 'https://wordsolverx.com/today'
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: 'Spotle Answer Today',
				item: 'https://wordsolverx.com/spotle-answer-today'
			}
		]
	};

	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: metaTitle,
		description: metaDescription,
		url: 'https://wordsolverx.com/spotle-answer-today',
		inLanguage: 'en',
		isPartOf: {
			'@type': 'WebSite',
			name: 'WordSolverX',
			url: 'https://wordsolverx.com'
		}
	};

	return {
		todayStr,
		todayFormatted,
		todayAnswer,
		todayArtist,
		artists,
		answers,
		last30Days,
		faqItems,
		schemaJson: JSON.stringify([webPageSchema, breadcrumbSchema, faqSchema]),
		meta: {
			title: metaTitle,
			description: metaDescription
		},
		labels: {
			countryNames: COUNTRY_NAMES,
			genderNames: GENDER_NAMES
		}
	};
};
