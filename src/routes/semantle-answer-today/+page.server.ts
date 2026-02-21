import { getJSTToday } from '$lib/utils';
import { getTodaySemantleData, getSemantleDataForDate } from '$lib/semantle';
import { subDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const data = getTodaySemantleData();

    if (!data) {
        return { error: true };
    }

    const { word, puzzleNumber, formattedDate } = data;

    const last10Days = Array.from({ length: 10 }, (_, i) => {
        const date = subDays(today, i + 1);
        return getSemantleDataForDate(date);
    }).filter(Boolean);

    const faqItems = [
        { '@type': 'Question', name: `What is the Semantle answer for today, ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Semantle answer for today, ${formattedDate}, is "${word}". Puzzle #${puzzleNumber}.` } },
        { '@type': 'Question', name: 'What is Semantle?', acceptedAnswer: { '@type': 'Answer', text: 'Semantle is a word-guessing game based on semantic similarity.' } },
        ...last10Days.map(d => ({ '@type': 'Question', name: `What was the Semantle answer for ${d!.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The answer was "${d!.word}" (Puzzle #${d!.puzzleNumber}).` } })),
    ];

    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'FAQPage', mainEntity: faqItems }, { '@type': 'Article', headline: `Semantle Answer Today - ${word}`, datePublished: new Date(formattedDate).toISOString(), author: { '@type': 'Organization', name: 'WordSolverX' } }] });

    return { word, puzzleNumber, formattedDate, last10Days, schemas: jsonLd, meta: { title: "Today's Semantle Answer - Daily Secret Word Solution", description: `Today's Semantle answer is ${word}. Puzzle #${puzzleNumber}.` } };
};
