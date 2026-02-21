import { getJSTToday } from '$lib/utils';
import { getSemantleDataForDate } from '$lib/semantle';
import { subDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const yesterday = subDays(getJSTToday(), 1);
    const data = getSemantleDataForDate(yesterday);
    if (!data) return { error: true };

    const { word, puzzleNumber, formattedDate } = data;
    const schemas = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: `Semantle Answer Yesterday - ${word}`, datePublished: formattedDate, author: { '@type': 'Organization', name: 'WordSolverX' } });

    return { word, puzzleNumber, formattedDate, schemas, meta: { title: `Semantle Answer Yesterday - ${word} (Puzzle #${puzzleNumber})`, description: `Yesterday's Semantle answer was ${word}. Puzzle #${puzzleNumber}.` } };
};
