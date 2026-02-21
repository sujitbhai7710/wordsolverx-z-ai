import { getJSTToday } from '$lib/utils';
import { getWaffleDataForDate } from '$lib/waffle';
import { format, subDays, addDays, startOfDay, isBefore } from 'date-fns';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const data = await getWaffleDataForDate(today);

    if (!data) {
        error(404, 'Waffle answer not found');
    }

    const { formattedDate, puzzle, solution, words, definitions, number } = data;
    const prevDate = subDays(data.date, 1);
    const nextDate = addDays(data.date, 1);

    const formatSlug = (d: Date) => format(d, 'MMMM-dd-yyyy').toLowerCase();
    const prevSlug = `/waffle-answer-for-${formatSlug(prevDate)}`;
    const nextSlug = `/waffle-answer-for-${formatSlug(nextDate)}`;
    const showNext = isBefore(startOfDay(nextDate), addDays(startOfDay(new Date()), 1));

    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: `Waffle Answer Today - ${formattedDate}`, datePublished: new Date(today).toISOString(), author: { '@type': 'Organization', name: 'WordSolverX' } });

    return {
        formattedDate, puzzle, solution, words, definitions, number,
        prevSlug, nextSlug, showNext, date: data.date,
        schemas: jsonLd,
        meta: {
            title: `Waffle Answer Today (${formattedDate}) - Daily Puzzle Solution`,
            description: `Check the Waffle answer for today, ${formattedDate}. View the solved grid and word definitions.`,
        },
    };
};
