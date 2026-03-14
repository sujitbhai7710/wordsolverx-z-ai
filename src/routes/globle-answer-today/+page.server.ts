import { getGlobleDataForDate } from '$lib/globle-date';
import { getJSTToday } from '$lib/utils';
import { format, subDays } from 'date-fns';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const data = await getLatestAvailableGlobleData(today);

    if (!data) {
        throw redirect(302, '/globle-archive');
    }

    const { country, formattedDate, date } = data;
    const isFallbackDate = format(date, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
    const featuredImage = 'https://wordsolverx.com/globle-answer-today.webp';
    const pageTitle = isFallbackDate
        ? `Globle Hints and Latest Available Answer (${formattedDate})`
        : `Globle Hints and Answer for Today (${formattedDate})`;
    const pageDescription = isFallbackDate
        ? `The official Globle answer for ${format(today, 'MMMM d, yyyy')} is not available yet, so this page is showing the latest confirmed answer from ${formattedDate}. The country is ${country.name}, with continent, subregion, flag, and map clues included.`
        : `Get Globle hints and the confirmed Globle answer for today, ${formattedDate}. Today's country is ${country.name}, with continent, subregion, flag, and map clues plus the full Globle answer for ${formattedDate}.`;
    const pageKeywords = isFallbackDate
        ? `globle answer, globle latest answer, globle archive, globle answer for ${formattedDate}`
        : `globle answer today, globle answer, globle hint, globle hint today, globle answer for ${formattedDate}`;
    const faqItems = [
        { '@type': 'Question', name: `What is the Globle answer for ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Globle answer for ${formattedDate} is ${country.name}.` } },
        { '@type': 'Question', name: `What are the Globle hints for ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Globle hints include the country flag, continent, subregion, and map-distance clues that lead to ${country.name}.` } },
        { '@type': 'Question', name: 'When does the Globle answer update?', acceptedAnswer: { '@type': 'Answer', text: 'This page updates on the Tokyo/JST day boundary at midnight JST.' } }
    ];

    const jsonLd = JSON.stringify([
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems },
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: pageTitle,
            datePublished: new Date(date).toISOString(),
            dateModified: new Date(date).toISOString(),
            author: { '@type': 'Organization', name: 'WordSolverX' },
            publisher: { '@type': 'Organization', name: 'WordSolverX' },
            description: pageDescription,
            image: [featuredImage],
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/globle-answer-today' }
        }
    ]);

    return {
        country,
        formattedDate,
        schemas: jsonLd,
        meta: {
            title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
            featuredImage
        }
    };
};

async function getLatestAvailableGlobleData(baseDate: Date) {
    for (let offset = 0; offset < 7; offset += 1) {
        const candidate = subDays(baseDate, offset);
        const data = await getGlobleDataForDate(candidate);
        if (data) {
            return data;
        }
    }

    return null;
}
