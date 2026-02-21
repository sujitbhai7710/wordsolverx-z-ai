import { getJSTToday } from '$lib/utils';
import { getQuordleToday, getQuordleDataForDate } from '$lib/quordle';
import { getAuthorForGame, getAuthorProfileUrl } from '$lib/authors';
import { generatePersonAuthorSchema } from '$lib/seo';
import { format, subDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const formattedDate = format(today, 'MMMM d, yyyy');
    const todayData = getQuordleToday();
    const todayWords = todayData ? todayData.d.join(', ').replace(/, ([^,]*)$/, ', and $1') : '';

    const last10Days = Array.from({ length: 10 }, (_, i) => {
        const date = subDays(today, i + 1);
        return getQuordleDataForDate(date);
    }).filter(Boolean);

    const faqItems = [
        { '@type': 'Question', name: `What is the Quordle answer for today, ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Quordle answer for today, ${formattedDate}, is ${todayWords}.` } },
        { '@type': 'Question', name: `How many vowels are in today's Quordle words for ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Quordle words for today contain multiple vowels. Check the hints section for exact counts.` } },
        { '@type': 'Question', name: 'When does Quordle reset?', acceptedAnswer: { '@type': 'Answer', text: 'Quordle resets every day at midnight JST for Daily modes. The Weekly puzzle resets every Monday.' } },
        ...last10Days.map(d => ({ '@type': 'Question', name: `What was the Quordle answer for ${d!.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Quordle answer for ${d!.formattedDate} was ${d!.d.join(', ').replace(/, ([^,]*)$/, ', and $1')}.` } })),
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'FAQPage', mainEntity: faqItems },
            {
                '@type': 'Article',
                headline: `Quordle Answer Today - ${formattedDate}`,
                datePublished: new Date(today).toISOString(),
                dateModified: new Date(today).toISOString(),
                author: generatePersonAuthorSchema(getAuthorForGame('Quordle'), getAuthorProfileUrl(getAuthorForGame('Quordle'))),
                publisher: { '@type': 'Organization', name: 'WordSolverX' },
                description: `The Quordle answers for ${formattedDate} are ${todayWords}.`,
                mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/quordle-answer-today' },
            },
        ],
    };

    return {
        today,
        formattedDate,
        todayData,
        todayWords,
        last10Days,
        schemas: JSON.stringify(jsonLd),
        meta: {
            title: `Quordle Answer for ${formattedDate} - Solutions & Hints for All Modes`,
            description: `Struggling with the Quordle for ${formattedDate}? Get instant answers and helpful hints for Daily Quordle Classic, Chill, Extreme, Sequence, Rescue, and Weekly modes.`,
        },
    };
};
