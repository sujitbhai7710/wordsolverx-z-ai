import type { PageServerLoad } from './$types';
import { getPhoodleYesterday } from '$lib/phoodle';

export const load: PageServerLoad = async () => {
    const data = await getPhoodleYesterday();
    if (!data) return { error: true };

    const { id: dateId, word, description, recipe_name, formattedDate } = data;
    const upperWord = word.toUpperCase();

    const schemas = JSON.stringify([
        {
            '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
                { '@type': 'Question', name: "What was yesterday's Phoodle answer?", acceptedAnswer: { '@type': 'Answer', text: `Yesterday's Phoodle answer (${formattedDate}) was "${upperWord}".` } },
                { '@type': 'Question', name: 'What is Phoodle?', acceptedAnswer: { '@type': 'Answer', text: 'Phoodle is a daily word puzzle game where players guess a food-related five-letter word in six attempts.' } },
            ]
        },
        { '@context': 'https://schema.org', '@type': 'Article', headline: `Phoodle Answer Yesterday - ${upperWord}`, datePublished: dateId, dateModified: dateId, author: { '@type': 'Organization', name: 'WordSolverX' } },
    ]);

    return {
        word, upperWord, formattedDate, description, recipe_name, schemas,
        meta: {
            title: `Phoodle Answer Yesterday (${formattedDate}) - ${upperWord} | WordSolverX`,
            description: `Yesterday's Phoodle answer was ${upperWord}. Find the previous day's food-themed word puzzle solution.`,
        },
    };
};
