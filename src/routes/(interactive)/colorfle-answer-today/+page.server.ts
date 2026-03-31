import { getDayInfoForDateKey, getPuzzleAnswerForDateKey } from '$lib/colorfle';
import { getPuzzleWindow, parsePuzzleDateKey } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const window = getPuzzleWindow('colorfle');
	const dateKey = window.effectivePuzzleDate;
	const answer = getPuzzleAnswerForDateKey(dateKey);
	const dayInfo = {
		...getDayInfoForDateKey(dateKey),
		nextResetTime: window.nextInvalidationAt.getTime()
	};
	const formattedDate = parsePuzzleDateKey(dateKey).toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});

	const pageTitle = `Colorfle Hints and Answer for Today (${formattedDate})`;
	const pageDescription = `Today's Colorfle answer for puzzle #${dayInfo.puzzleNumber} on ${formattedDate}. Get hints, the 3 color answers with hex codes, and weight percentages (50%, 34%, 16%).`;
	const pageKeywords = `colorfle answer today, colorfle hints, colorfle puzzle #${dayInfo.puzzleNumber}, color mixing puzzle answer, colorfle daily, colorfle solution`;

	const faqItems = [
		{
			'@type': 'Question',
			name: `What is the Colorfle answer for today, ${formattedDate}?`,
			acceptedAnswer: {
				'@type': 'Answer',
				text: `Today's Colorfle answer (puzzle #${dayInfo.puzzleNumber}) uses three colors mixed in proportions 50%, 34%, and 16%. The target mixed color is ${answer.targetHex}.`
			}
		},
		{
			'@type': 'Question',
			name: 'What colors are in today\'s Colorfle answer?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: `The three colors for today's Colorfle are ${answer.colorNames[0]} (${answer.colorHexes[0]}), ${answer.colorNames[1]} (${answer.colorHexes[1]}), and ${answer.colorNames[2]} (${answer.colorHexes[2]}), mixed at 50%, 34%, and 16% respectively.`
			}
		},
		{
			'@type': 'Question',
			name: 'When does the Colorfle puzzle reset?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: `A new Colorfle puzzle is released daily. The next reset is at ${new Date(dayInfo.nextResetTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`
			}
		},
		{
			'@type': 'Question',
			name: 'How does Colorfle color mixing work?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Colorfle mixes three colors with weighted proportions: 50% for the first color, 34% for the second, and 16% for the third. The mixing algorithm uses a combination of YCC and RGB color spaces to produce the final blended color.'
			}
		},
		{
			'@type': 'Question',
			name: 'What do the feedback colors mean in Colorfle?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Green means the color is correct and in the right position. Yellow means the color is in the answer but in a different position. Gray means the color is not part of today\'s answer.'
			}
		}
	];

	const schemas = JSON.stringify([
		{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems },
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: pageTitle,
			datePublished: `${dateKey}T00:00:00Z`,
			dateModified: `${dateKey}T00:00:00Z`,
			author: {
				'@type': 'Person',
				name: 'Preston Hayes',
				image: 'https://wordsolver.tech/auther-wordsolverx.webp',
				url: 'https://wordsolver.tech/about#preston-hayes'
			},
			publisher: { '@type': 'Organization', name: 'WordSolverX' },
			mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolver.tech/colorfle-answer-today' },
			description: pageDescription
		}
	]);

	setHeaders({ 'X-Puzzle-Date': dayInfo.date });

	return {
		answer,
		dayInfo,
		formattedDate,
		schemas,
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: pageKeywords
		}
	};
};
