import type { PageServerLoad } from './$types';
import { getNerdleAnswerForToday } from '$lib/nerdle';

function formatDateLabel(dateKey: string): string {
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

export const load: PageServerLoad = async ({ setHeaders }) => {
	const answerData = await getNerdleAnswerForToday();
	const formattedDate = formatDateLabel(answerData.date);

	setHeaders({
		'X-Puzzle-Date': answerData.date
	});

	const pageTitle = `Nerdle Answer Today ( ${formattedDate} )`;
	const pageDescription = `Get the official Nerdle answer for ${formattedDate}, including puzzle #${answerData.puzzleNumber}, equation tiles, and quick links to the Nerdle archive.`;
	const schemas = JSON.stringify([
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: pageTitle,
			description: pageDescription,
			datePublished: `${answerData.date}T00:00:00+05:30`,
			dateModified: `${answerData.date}T00:00:00+05:30`,
			mainEntityOfPage: 'https://wordsolverx.com/nerdle-answer-today',
			author: {
				'@type': 'Organization',
				name: 'WordSolverX'
			},
			publisher: {
				'@type': 'Organization',
				name: 'WordSolverX',
				logo: {
					'@type': 'ImageObject',
					url: 'https://wordsolverx.com/wordsolverx.webp'
				}
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wordsolverx.com' },
				{ '@type': 'ListItem', position: 2, name: 'Today', item: 'https://wordsolverx.com/today' },
				{
					'@type': 'ListItem',
					position: 3,
					name: 'Nerdle Answer Today',
					item: 'https://wordsolverx.com/nerdle-answer-today'
				}
			]
		}
	]);

	return {
		answerData,
		formattedDate,
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: `nerdle answer today, nerdle answer, nerdle today answer, nerdle archive, nerdle answer ${formattedDate}`,
			canonical: 'https://wordsolverx.com/nerdle-answer-today'
		},
		schemas
	};
};
