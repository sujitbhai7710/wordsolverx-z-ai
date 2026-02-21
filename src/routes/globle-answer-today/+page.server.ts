import { getGlobleDataForDate } from '$lib/globle-date';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const data = await getGlobleDataForDate(today);

    if (!data) {
        redirect(302, '/globle-archive');
    }

    const { country, formattedDate } = data;

    const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: `Globle Answer Today - ${formattedDate}`,
        datePublished: new Date(formattedDate).toISOString(),
        dateModified: new Date(formattedDate).toISOString(),
        author: { '@type': 'Organization', name: 'WordSolverX' },
        publisher: { '@type': 'Organization', name: 'WordSolverX' },
        description: `Get the verified Globle answer for today, ${formattedDate}.`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/globle-answer-today' },
    });

    return { country, formattedDate, schemas: jsonLd, meta: { title: 'Globle Answer Today - Daily Solution & Hints', description: `Get the Globle answer for today. See the solution country.` } };
};
