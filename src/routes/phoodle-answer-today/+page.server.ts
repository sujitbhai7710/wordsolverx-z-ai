import { getJSTToday } from '$lib/utils';
import { getPhoodleToday, getRecentPhoodleHistory } from '$lib/phoodle';
import { format } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const data = await getPhoodleToday();

    if (!data) {
        return { error: true, formattedDate: format(today, 'MMMM d, yyyy') };
    }

    const { word, description, recipe_name, formattedDate } = data;
    const upperWord = word.toUpperCase();

    // Fetch last 10 available days for FAQs (Phoodle can have gaps in dates)
    const last10Days = await getRecentPhoodleHistory(data.date, 10);

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            { '@type': 'Question', name: `What is the Phoodle answer for today, ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Phoodle answer for today, ${formattedDate}, is "${upperWord}".` } },
            { '@type': 'Question', name: 'What is Phoodle?', acceptedAnswer: { '@type': 'Answer', text: 'Phoodle is a daily word puzzle game where players guess a food-related five-letter word in six attempts.' } },
            { '@type': 'Question', name: 'When does the Phoodle puzzle reset?', acceptedAnswer: { '@type': 'Answer', text: 'A new Phoodle puzzle is available every day at midnight JST.' } },
            ...last10Days.map(d => ({ '@type': 'Question', name: `What was the Phoodle answer for ${d!.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Phoodle answer for ${d!.formattedDate} was "${d!.word.toUpperCase()}".` } })),
        ],
    };

    return {
        word,
        upperWord,
        description,
        recipe_name,
        formattedDate,
        last10Days,
        schemas: JSON.stringify([faqSchema]),
        meta: {
            title: `Phoodle Answer Today: ${upperWord} (${formattedDate})`,
            description: `Today's Phoodle answer is ${upperWord}. Get the daily food-themed word puzzle solution for ${formattedDate}.`,
        },
    };
};
