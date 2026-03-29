import { getColordleToday, getColordleYesterday, getColordleDataForDate } from '$lib/colordle-date';
import { subDays } from 'date-fns';
import { getPuzzleDateForGame } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getPuzzleDateForGame('colordle');
    const todayData = getColordleToday();

    if (!todayData) {
        return { error: true };
    }

	const { color, dayNum, formattedDate } = todayData;
	const yesterdayData = getColordleYesterday();
	const featuredImage = '/colordle-answer-today.webp';
	const pageTitle = `Colordle Answer Today (${formattedDate}) | Yesterday & Archive`;
	const pageDescription = `Today's Colordle answer for ${formattedDate}, yesterday's answer, and a 100-day archive of Colordle color solutions with fast search links.`;
	const pageKeywords = `colordle answer today, colordle answer yesterday, colordle archive, colordle color answers, colordle search, last 100 days, colordle hex code`;

	const last100Days = Array.from({ length: 100 }, (_, i) => {
		const date = subDays(today, i);
		return getColordleDataForDate(date);
	}).filter(Boolean);

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
		{ '@type': 'Question', name: 'How is the Colordle answer calculated?', acceptedAnswer: { '@type': 'Answer', text: 'Colordle uses an algorithm based on the CIEDE2000 color difference formula.' } },
		{ '@type': 'Question', name: 'When does the new color release?', acceptedAnswer: { '@type': 'Answer', text: 'A new Colordle puzzle is released every day at midnight JST.' } },
	];

    const jsonLd = JSON.stringify([
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems },
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
			headline: pageTitle,
			datePublished: today.toISOString(),
			dateModified: today.toISOString(),
            author: { '@type': 'Person', name: 'Preston Hayes', image: 'https://wordsolver.tech/auther-wordsolverx.webp', url: 'https://wordsolver.tech/about#preston-hayes' },
			publisher: { '@type': 'Organization', name: 'WordSolverX' },
			mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolver.tech/colordle-answer-today' },
            description: pageDescription,
            image: [featuredImage]
        },
    ]);

    return {
		color,
		dayNum,
		formattedDate,
		yesterdayData,
		last100Days,
		schemas: jsonLd,
		meta: {
			title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
            featuredImage
        }
    };
};
