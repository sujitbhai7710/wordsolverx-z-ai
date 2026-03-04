import { getGlobleDataForDate } from '$lib/globle-date';
import { getJSTToday } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const data = await getGlobleDataForDate(today);

    if (!data) {
        redirect(302, '/globle-archive');
    }

    const { country, formattedDate } = data;
    const featuredImage = 'https://wordsolverx.com/globle-answer-today.webp';
    const pageTitle = `Globle Hints and Answer for Today (${formattedDate})`;
    const pageDescription = `Get Globle hints and the confirmed Globle answer for today, ${formattedDate}. Today's country is ${country.name}, with continent, subregion, flag, and map clues plus the full Globle answer for ${formattedDate}.`;
    const pageKeywords = `globle answer today, globle answer, globle hint, globle hint today, globle answer for ${formattedDate}`;
    const faqItems = [
        { '@type': 'Question', name: `What is the Globle answer for today, ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Globle answer for ${formattedDate} is ${country.name}.` } },
        { '@type': 'Question', name: `What are the Globle hints for today, ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `Today's Globle hints include the country flag, continent, subregion, and map-distance clues that lead to ${country.name}.` } },
        { '@type': 'Question', name: 'When does the Globle answer update?', acceptedAnswer: { '@type': 'Answer', text: 'This page updates on the Tokyo/JST day boundary at midnight JST.' } }
    ];

    const jsonLd = JSON.stringify([
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems },
        {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: pageTitle,
            datePublished: new Date(formattedDate).toISOString(),
            dateModified: new Date(formattedDate).toISOString(),
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
