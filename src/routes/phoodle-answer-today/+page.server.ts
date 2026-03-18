import { getPhoodleToday, getRecentPhoodleHistory } from '$lib/phoodle';
import { getPuzzleWindow, parsePuzzleDateKey } from '$lib/puzzle-window';
import { format } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
    const window = getPuzzleWindow('phoodle');
    const data = await getPhoodleToday();

    if (!data) {
        setHeaders({
            'X-Edge-Cache-Bypass': '1'
        });

        return {
            error: true,
            formattedDate: format(parsePuzzleDateKey(window.effectivePuzzleDate), 'MMMM d, yyyy')
        };
    }

    const { word, description, recipe_name, formattedDate } = data;
    const upperWord = word.toUpperCase();

    setHeaders({
        'X-Puzzle-Date': data.date.toISOString().split('T')[0]
    });

    // Fetch last 10 available days for FAQs (Phoodle can have gaps in dates)
    const last10Days = await getRecentPhoodleHistory(data.date, 10);
    const pageTitle = `Phoodle Hints and Answer for Today (${formattedDate})`;
    const pageDescription = `Get Phoodle hints and the confirmed Phoodle answer for today, ${formattedDate}. Today's food word is ${upperWord}, with recent answers and recipe context.`;
    const pageKeywords = `phoodle answer today, phoodle answer, phoodle hint, phoodle hint today, phoodle answer for ${formattedDate}`;

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
            title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
        },
    };
};
