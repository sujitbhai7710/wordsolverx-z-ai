import { fetchCanuckleAnswerByDateKey, fetchLatestCanuckleAnswer } from '$lib/canuckle';
import { getPuzzleWindow, parsePuzzleDateKey } from '$lib/puzzle-window';
import { generatePersonAuthorSchema } from '$lib/seo';
import { format } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const window = getPuzzleWindow('canuckle');
	const targetDateKey = window.effectivePuzzleDate;
	const targetAnswer = await fetchCanuckleAnswerByDateKey(targetDateKey);
	const answer = targetAnswer ?? (await fetchLatestCanuckleAnswer());

	if (!answer) {
		return {
			error: true,
			meta: {
				title: 'Canuckle Answer Today - Unable to Load',
				description: "Could not retrieve today's Canuckle answer. Please try again later.",
				keywords: 'canuckle answer today, canuckle hint, canadian wordle answer'
			},
			schemas: '[]'
		};
	}

	const isCurrent = answer.dateKey === targetDateKey;
	const formattedDate = format(parsePuzzleDateKey(answer.dateKey), 'MMMM d, yyyy');
	const pageTitle = `Canuckle Answer Today (${formattedDate}) - WordSolverX`;
	const pageDescription = answer.hintText
		? `Today's Canuckle answer for ${formattedDate}: ${answer.word}. ${answer.hintText}`
		: `Today's Canuckle answer for ${formattedDate}: ${answer.word}. See the answer and the daily Canadian fun fact.`;
	const pageKeywords = `canuckle answer today, canuckle answer, canuckle hint, canadian wordle, canuckle ${formattedDate}`;

	const faqEntities = [
		{
			'@type': 'Question',
			name: `What is the Canuckle answer for ${formattedDate}?`,
			acceptedAnswer: {
				'@type': 'Answer',
				text: `The Canuckle answer for ${formattedDate} is ${answer.word}.`
			}
		},
		{
			'@type': 'Question',
			name: 'What hint does Canuckle give today?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: answer.hintTitle && answer.hintText
					? `${answer.hintTitle}: ${answer.hintText}`
					: 'Canuckle uses a daily Canadian-themed clue together with the five-letter answer.'
			}
		},
		{
			'@type': 'Question',
			name: 'What is Canuckle?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Canuckle is a Canadian-themed Wordle game where each daily answer is a five-letter word tied to Canada.'
			}
		}
	];

	const articleSchema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: pageTitle,
		datePublished: `${answer.dateKey}T00:00:00Z`,
		dateModified: `${answer.dateKey}T00:00:00Z`,
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

	setHeaders({
		'X-Puzzle-Date': answer.dateKey,
		'X-Edge-Cache-Bypass': isCurrent ? '0' : '1'
	});

	return {
		answer,
		schemas: JSON.stringify([
			{
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqEntities
			},
			articleSchema
		]),
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: pageKeywords
		}
	};
};
