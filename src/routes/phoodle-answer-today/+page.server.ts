import { getJSTToday } from '$lib/utils';
import { getPhoodleToday, getPhoodleDataForDate } from '$lib/phoodle';
import { subDays, format } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const data = await getPhoodleToday();

    if (!data) {
        return { error: true, formattedDate: format(today, 'MMMM d, yyyy') };
    }

    const { word, description, recipe_name, formattedDate } = data;
    const upperWord = word.toUpperCase();

    // Fetch last 10 days for FAQs
    const last10DaysDates = Array.from({ length: 10 }, (_, i) => subDays(today, i + 1));
    const last10DaysPromises = last10DaysDates.map((date) => getPhoodleDataForDate(date));
    const last10DaysResults = await Promise.all(last10DaysPromises);
    const last10Days = last10DaysResults.filter(Boolean);

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
            title: `Phoodle Answer Today (${formattedDate}) - ${upperWord} | WordSolverX`,
            description: `Today's Phoodle answer is ${upperWord}. Get the daily food-themed word puzzle solution for ${formattedDate}.`,
        },
    };
};
