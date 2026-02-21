import { getJSTToday } from '$lib/utils';
import { getColordleToday, getColordleDataForDate } from '$lib/colordle-date';
import { subDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const todayData = getColordleToday();

    if (!todayData) {
        return { error: true };
    }

    const { color, dayNum, formattedDate } = todayData;

    const last10Days = Array.from({ length: 10 }, (_, i) => {
        const date = subDays(today, i + 1);
        return getColordleDataForDate(date);
    }).filter(Boolean);

    const faqItems = [
        { '@type': 'Question', name: `What is the Colordle answer for today, ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Colordle answer for today, ${formattedDate}, is ${color.name} with hex code ${color.hex}.` } },
        { '@type': 'Question', name: 'How is the Colordle answer calculated?', acceptedAnswer: { '@type': 'Answer', text: 'Colordle uses an algorithm based on the CIEDE2000 color difference formula.' } },
        { '@type': 'Question', name: 'When does the new color release?', acceptedAnswer: { '@type': 'Answer', text: 'A new Colordle puzzle is released every day at midnight JST.' } },
        ...last10Days.map(d => ({ '@type': 'Question', name: `What was the Colordle answer for ${d!.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Colordle answer for ${d!.formattedDate} was ${d!.color.name} with hex code ${d!.color.hex}.` } })),
    ];

    const jsonLd = JSON.stringify([
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems },
        { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: `Colordle Answer Today - ${formattedDate}`, datePublished: new Date(formattedDate).toISOString(), dateModified: new Date(formattedDate).toISOString(), author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX' }, description: `Colordle answer: ${color.name} (${color.hex}).` },
    ]);

    return { color, dayNum, formattedDate, last10Days, schemas: jsonLd, meta: { title: 'Colordle Answer Today - Daily Solution & Hints', description: `Today's Colordle answer is ${color.name} (${color.hex}).` } };
};
