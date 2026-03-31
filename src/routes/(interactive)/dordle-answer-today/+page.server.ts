import { getDailyAnswers, getCurrentSeed, formatDate, getDateFromSeed, getTimeUntilNextDaily } from '$lib/dordle';
import { ANSWER_WORDS } from '$lib/dordle-words';
import { generatePersonAuthorSchema } from '$lib/seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const seed = getCurrentSeed();
	const [answer1, answer2] = getDailyAnswers(seed, ANSWER_WORDS);
	const date = getDateFromSeed(seed);
	const formattedDate = formatDate(date);
	const countdown = getTimeUntilNextDaily();

	const pageTitle = `Dordle Answer for Today (${formattedDate}) - #${seed}`;
	const pageDescription = `Today's Dordle answers for ${formattedDate} (Puzzle #${seed}). The two words are revealed here along with a countdown to the next daily puzzle.`;
	const pageKeywords = `dordle answer today, dordle answer, dordle #${seed}, dordle solution ${formattedDate}, daily dordle answer, dordle hints today`;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'FAQPage',
				mainEntity: [
					{
						'@type': 'Question',
						name: `What is the Dordle answer for today, ${formattedDate}?`,
						acceptedAnswer: {
							'@type': 'Answer',
							text: `The Dordle answers for today, ${formattedDate} (Puzzle #${seed}), are "${answer1.toUpperCase()}" and "${answer2.toUpperCase()}".`
						}
					},
					{
						'@type': 'Question',
						name: 'When does Dordle reset?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Dordle resets every day at midnight IST (Indian Standard Time). A new pair of words is selected using a deterministic seed algorithm.'
						}
					},
					{
						'@type': 'Question',
						name: 'How many guesses do you get in Dordle?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'You get 7 guesses to solve both five-letter words in Dordle. Each guess applies to both boards simultaneously.'
						}
					}
				]
			},
			{
				'@type': 'Article',
				headline: pageTitle,
				datePublished: date.toISOString(),
				dateModified: date.toISOString(),
				author: generatePersonAuthorSchema(
					'Preston Hayes',
					'https://wordsolver.tech/about#preston-hayes',
					'https://wordsolver.tech/auther-wordsolverx.webp'
				),
				publisher: { '@type': 'Organization', name: 'WordSolverX' },
				description: pageDescription,
				mainEntityOfPage: {
					'@type': 'WebPage',
					'@id': 'https://wordsolver.tech/dordle-answer-today'
				}
			}
		]
	};

	return {
		seed,
		answer1,
		answer2,
		formattedDate,
		date: date.toISOString(),
		countdown,
		schemas: JSON.stringify(jsonLd),
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: pageKeywords
		}
	};
};
