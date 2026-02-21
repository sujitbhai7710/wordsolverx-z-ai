import type { PageServerLoad } from './$types';

const PHOODLE_API = 'https://phoodle-worker.pinpoints.workers.dev';

async function getPhoodleData(endpoint: string) {
    try {
        const res = await fetch(`${PHOODLE_API}/${endpoint}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.data : null;
    } catch {
        return null;
    }
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export const load: PageServerLoad = async () => {
    const data = await getPhoodleData('yesterday');
    if (!data) return { error: true };

    const { id: dateId, word, description, recipe_name } = data;
    const formattedDate = formatDate(dateId);
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
