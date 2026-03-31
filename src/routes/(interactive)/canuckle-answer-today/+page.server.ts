import { fetchTodayAnswer } from '$lib/canuckle';
import { generatePersonAuthorSchema } from '$lib/seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = fetchTodayAnswer();

	if (!response.success || !response.data) {
		return {
			error: true,
			meta: {
				title: 'Canuckle Answer Today - Unable to Load',
				description: 'Could not retrieve today\'s Canuckle answer. Please try again later.',
				keywords: 'canuckle answer today, canuckle hint, canadian wordle answer'
			},
			schemas: '[]'
		};
	}

	const { puzzleNumber, date, word, avgGuesses, funFact } = response.data;

	const pageTitle = `Canuckle Answer Today (${date}) - Puzzle #${puzzleNumber}`;
	const pageDescription = `Today's Canuckle answer for ${date}: Puzzle #${puzzleNumber}. Get the solution, fun fact about Canada, and average guesses. Updated daily.`;
	const pageKeywords = `canuckle answer today, canuckle answer, canuckle hint, canadian wordle, canuckle puzzle ${puzzleNumber}, canuckle ${date}`;

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: `What is the Canuckle answer for today, ${date}?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: `The Canuckle answer for today, ${date}, is ${word}. This is Canuckle puzzle #${puzzleNumber}.`
				}
			},
			{
				'@type': 'Question',
				name: 'How many guesses does it take on average to solve Canuckle?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: `The average number of guesses for today\'s Canuckle puzzle is ${avgGuesses}.`
				}
			},
			{
				'@type': 'Question',
				name: 'What is Canuckle?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Canuckle is a Canadian-themed Wordle variant where each answer is a five-letter word related to Canada. A new puzzle is released daily with a fun fact about Canadian culture, geography, or history.'
				}
			}
		]
	};

	const articleSchema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: pageTitle,
		datePublished: new Date().toISOString(),
		dateModified: new Date().toISOString(),
		author: generatePersonAuthorSchema(
			'Preston Hayes',
			'https://wordsolver.tech/about#preston-hayes',
			'https://wordsolver.tech/auther-wordsolverx.webp'
		),
		publisher: {
			'@type': 'Organization',
			name: 'WordSolverX',
			logo: { '@type': 'ImageObject', url: 'https://wordsolver.tech/wordsolverx.webp' }
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': 'https://wordsolver.tech/canuckle-answer-today'
		},
		description: pageDescription
	};

	return {
		answer: response.data,
		schemas: JSON.stringify([faqSchema, articleSchema]),
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: pageKeywords
		}
	};
};
