import { getColordleYesterday } from '$lib/colordle-date';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const data = getColordleYesterday();
    if (!data) return { error: true };

    const { color, dayNum, formattedDate } = data;

    const schemas = JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: `Colordle Answer Yesterday - ${color.name}`, datePublished: formattedDate, author: { '@type': 'Organization', name: 'WordSolverX' } });

    return { color, dayNum, formattedDate, schemas, meta: { title: `Colordle Answer Yesterday - ${color.name} (${color.hex})`, description: `Yesterday's Colordle answer was ${color.name} with hex ${color.hex}.` } };
};
