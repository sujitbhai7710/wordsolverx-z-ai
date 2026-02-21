import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getColordleDataForDate, parseSlugDate, formatDateForSlug } from '$lib/colordle-date';
import { getSemantleDataForDate, parseSemantleSlugDate, formatSemantleDateForSlug } from '$lib/semantle';
import { getPhoodleDataForDate, parsePhoodleSlugDate, formatPhoodleDateForSlug } from '$lib/phoodle';
import { getGlobleDataForDate, parseGlobleSlugDate, formatGlobleDateForSlug } from '$lib/globle-date';
import { getWaffleDataForDate, parseWaffleSlugDate, formatWaffleDateForSlug } from '$lib/waffle';
import { getQuordleDataForDate } from '$lib/quordle';
import { getWordleByDate } from '$lib/api';
import { formatDate, getWordleNumber, getJSTToday } from '$lib/utils';
import { addDays, subDays, format, startOfDay, isBefore } from 'date-fns';

const COLORDLE_PREFIX = 'colordle-answer-for-';
const SEMANTLE_PREFIX = 'semantle-answer-for-';
const PHOODLE_PREFIX = 'phoodle-answer-for-';
const QUORDLE_PREFIX = 'quordle-answer-for-';
const WORDLE_PREFIX = 'wordle-answer-for-';
const GLOBLE_PREFIX = 'globle-answer-for-';
const WAFFLE_PREFIX = 'waffle-answer-for-';

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.slug;

    // ===== COLORDLE =====
    if (slug.startsWith(COLORDLE_PREFIX)) {
        const dateSlug = slug.replace(COLORDLE_PREFIX, '');
        const date = parseSlugDate(dateSlug);
        const data = date ? getColordleDataForDate(date) : null;
        if (!data) error(404, 'Colordle Answer Not Found');

        const prevSlug = `/colordle-answer-for-${formatDateForSlug(subDays(data.date, 1))}`;
        const nextSlug = `/colordle-answer-for-${formatDateForSlug(addDays(data.date, 1))}`;

        const last5Days = Array.from({ length: 5 }, (_, i) => getColordleDataForDate(subDays(data.date, i + 1))).filter(Boolean);

        const schemas = JSON.stringify([
            { '@context': 'https://schema.org', '@type': 'Game', name: 'Colordle', description: `Colordle Answer for ${data.formattedDate}` },
            {
                '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
                    { '@type': 'Question', name: `What was the Colordle answer on ${data.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Colordle answer for ${data.formattedDate} was ${data.color.name} with hex code ${data.color.hex}.` } },
                    ...last5Days.map(d => ({ '@type': 'Question', name: `What was the Colordle answer for ${d!.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Colordle answer for ${d!.formattedDate} was ${d!.color.name} (${d!.color.hex}).` } })),
                ]
            },
        ]);

        return {
            gameType: 'colordle' as const, slug,
            color: data.color, dayNum: data.dayNum, formattedDate: data.formattedDate,
            prevSlug, nextSlug, last5Days, schemas,
            meta: { title: `Colordle Answer for ${data.formattedDate} - Solution #${data.dayNum}`, description: `The correct Colordle answer for ${data.formattedDate} is ${data.color.name} (${data.color.hex}).` },
        };
    }

    // ===== SEMANTLE =====
    if (slug.startsWith(SEMANTLE_PREFIX)) {
        const dateSlug = slug.replace(SEMANTLE_PREFIX, '');
        const date = parseSemantleSlugDate(dateSlug);
        const data = date ? getSemantleDataForDate(date) : null;
        if (!data) error(404, 'Semantle Answer Not Found');

        const prevSlug = `/semantle-answer-for-${formatSemantleDateForSlug(subDays(data.date, 1))}`;
        const nextSlug = `/semantle-answer-for-${formatSemantleDateForSlug(addDays(data.date, 1))}`;

        const last5Days = Array.from({ length: 5 }, (_, i) => getSemantleDataForDate(subDays(data.date, i + 1))).filter(Boolean);

        const schemas = JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
                { '@type': 'Question', name: `What was the Semantle answer for ${data.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Semantle answer for ${data.formattedDate} was "${data.word}" (Puzzle #${data.puzzleNumber}).` } },
                ...last5Days.map(d => ({ '@type': 'Question', name: `What was the Semantle answer for ${d!.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Semantle answer for ${d!.formattedDate} was "${d!.word}" (Puzzle #${d!.puzzleNumber}).` } })),
            ]
        });

        return {
            gameType: 'semantle' as const, slug,
            word: data.word, puzzleNumber: data.puzzleNumber, formattedDate: data.formattedDate,
            prevSlug, nextSlug, last5Days, schemas,
            meta: { title: `Semantle Answer for ${data.formattedDate} - Puzzle #${data.puzzleNumber}`, description: `The Semantle answer for ${data.formattedDate} was "${data.word}". Puzzle #${data.puzzleNumber}.` },
        };
    }

    // ===== PHOODLE =====
    if (slug.startsWith(PHOODLE_PREFIX)) {
        const dateSlug = slug.replace(PHOODLE_PREFIX, '');
        const date = parsePhoodleSlugDate(dateSlug);
        const data = date ? await getPhoodleDataForDate(date) : null;
        if (!data) error(404, 'Phoodle Answer Not Found');

        const upperWord = data.word.toUpperCase();
        const prevSlug = `/phoodle-answer-for-${formatPhoodleDateForSlug(subDays(data.date, 1))}`;
        const nextSlug = `/phoodle-answer-for-${formatPhoodleDateForSlug(addDays(data.date, 1))}`;

        const schemas = JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
                { '@type': 'Question', name: `What was the Phoodle answer for ${data.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Phoodle answer for ${data.formattedDate} was "${upperWord}".` } },
            ]
        });

        return {
            gameType: 'phoodle' as const, slug,
            word: data.word, upperWord, formattedDate: data.formattedDate,
            description: data.description, recipe_name: data.recipe_name,
            prevSlug, nextSlug, schemas,
            meta: { title: `Phoodle Answer for ${data.formattedDate} - ${upperWord}`, description: `The Phoodle answer for ${data.formattedDate} was ${upperWord}.` },
        };
    }

    // ===== QUORDLE =====
    if (slug.startsWith(QUORDLE_PREFIX)) {
        const dateSlug = slug.replace(QUORDLE_PREFIX, '');
        const date = parseSlugDate(dateSlug);
        if (!date) error(404, 'Quordle Answer Not Found');

        const formattedDate = format(date, 'MMMM d, yyyy');
        const prevSlug = `/quordle-answer-for-${formatDateForSlug(subDays(date, 1))}`;
        const nextSlug = `/quordle-answer-for-${formatDateForSlug(addDays(date, 1))}`;
        const showNext = addDays(date, 1) <= new Date();

        const quordleData = getQuordleDataForDate(date);
        const todayWords = quordleData ? quordleData.d.join(', ').replace(/, ([^,]*)$/, ', and $1') : '';

        const last5Days = Array.from({ length: 5 }, (_, i) => getQuordleDataForDate(subDays(date, i + 1))).filter(Boolean);

        const schemas = JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
                { '@type': 'Question', name: `What was the Quordle answer for ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Quordle answer for ${formattedDate} was ${todayWords}.` } },
                ...last5Days.map((d: any) => ({ '@type': 'Question', name: `What was the Quordle answer for ${d.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Quordle answer for ${d.formattedDate} was ${d.d.join(', ').replace(/, ([^,]*)$/, ', and $1')}.` } })),
            ]
        });

        return {
            gameType: 'quordle' as const, slug,
            quordleData, formattedDate, todayWords, showNext,
            prevSlug, nextSlug, last5Days, schemas, date: date.toISOString(),
            meta: { title: `Quordle Answer for ${formattedDate} - Solutions & Hints`, description: `Check the Quordle answer for ${formattedDate}. Full solutions and helpful hints.` },
        };
    }

    // ===== WORDLE =====
    if (slug.startsWith(WORDLE_PREFIX)) {
        const dateSlug = slug.replace(WORDLE_PREFIX, '');
        const date = parseSlugDate(dateSlug);
        if (!date) error(404, 'Wordle Answer Not Found');

        const formattedDateForApi = format(date, 'yyyy-MM-dd');
        const wordleData = await getWordleByDate(formattedDateForApi).catch(() => null);
        const formattedDisplayDate = formatDate(date);

        if (!wordleData) {
            return {
                gameType: 'wordle' as const, slug,
                wordleError: true, formattedDate: formattedDisplayDate,
                meta: { title: `Wordle Answer for ${formattedDisplayDate}`, description: `The Wordle answer for ${formattedDisplayDate} is being processed.` },
            };
        }

        const wordleWord = wordleData.solution || '';
        const wordleNumber = wordleData.id || getWordleNumber(date);
        const today = new Date();
        const yesterday = subDays(today, 1);
        const dateStr = format(date, 'yyyy-MM-dd');
        const isToday = dateStr === format(today, 'yyyy-MM-dd');
        const isYesterday = dateStr === format(yesterday, 'yyyy-MM-dd');
        let pageContext: 'today' | 'yesterday' | 'archive' = 'archive';
        if (isToday) pageContext = 'today';
        else if (isYesterday) pageContext = 'yesterday';

        const vowelCount = wordleWord.toLowerCase().split('').filter((c: string) => 'aeiou'.includes(c)).length;
        const hasDouble = wordleWord.toLowerCase().split('').some((c: string, i: number, a: string[]) => a.indexOf(c) !== a.lastIndexOf(c));

        const schemas = JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
                { '@type': 'Question', name: `How many vowels are in the Wordle answer for ${formattedDisplayDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Wordle answer for ${formattedDisplayDate} contains ${vowelCount} vowels.` } },
                { '@type': 'Question', name: `Are there any double letters in the Wordle answer for ${formattedDisplayDate}?`, acceptedAnswer: { '@type': 'Answer', text: hasDouble ? `Yes, the answer has at least one double letter.` : `No, the answer does not contain repeated letters.` } },
                { '@type': 'Question', name: `What is the Wordle answer for ${formattedDisplayDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Wordle answer for ${formattedDisplayDate} is ${wordleWord.toUpperCase()}.` } },
            ]
        });

        return {
            gameType: 'wordle' as const, slug,
            wordleData, wordleWord, wordleNumber, formattedDate: formattedDisplayDate,
            pageContext, schemas,
            contentGuide: wordleData?.content_guide, socialImage: wordleData?.social_image, youtubeVideoUrl: wordleData?.youtube_video_url,
            meta: {
                title: isToday ? `NYT Wordle Answer Today (${formattedDisplayDate})` : `Wordle Answer for ${formattedDisplayDate} - Solutions & Hints`,
                description: `Check the NYT Wordle answer for ${formattedDisplayDate}. Full solutions and helpful hints.`,
            },
        };
    }

    // ===== GLOBLE =====
    if (slug.startsWith(GLOBLE_PREFIX)) {
        const dateSlug = slug.replace(GLOBLE_PREFIX, '');
        const date = parseGlobleSlugDate(dateSlug);
        const data = date ? await getGlobleDataForDate(date) : null;
        if (!data) error(404, 'Globle Answer Not Found');

        const prevSlug = `/globle-answer-for-${formatGlobleDateForSlug(subDays(data.date, 1))}`;
        const nextSlug = `/globle-answer-for-${formatGlobleDateForSlug(addDays(data.date, 1))}`;

        const schemas = JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
                { '@type': 'Question', name: `What was the Globle answer for ${data.formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `The Globle answer for ${data.formattedDate} was ${data.country.name}.` } },
            ]
        });

        return {
            gameType: 'globle' as const, slug,
            country: data.country, formattedDate: data.formattedDate,
            prevSlug, nextSlug, schemas,
            meta: { title: `Globle Answer for ${data.formattedDate} - Daily Country Solution`, description: `The Globle answer for ${data.formattedDate} was ${data.country.name}.` },
        };
    }

    // ===== WAFFLE =====
    if (slug.startsWith(WAFFLE_PREFIX)) {
        const dateSlug = slug.replace(WAFFLE_PREFIX, '');
        const date = parseWaffleSlugDate(dateSlug);
        const data = date ? await getWaffleDataForDate(date) : null;
        if (!data) error(404, 'Waffle Answer Not Found');

        const prevSlug = `/waffle-answer-for-${formatWaffleDateForSlug(subDays(data.date, 1))}`;
        const nextSlug = `/waffle-answer-for-${formatWaffleDateForSlug(addDays(data.date, 1))}`;
        const showNext = isBefore(startOfDay(addDays(data.date, 1)), addDays(startOfDay(new Date()), 1));

        return {
            gameType: 'waffle' as const, slug,
            formattedDate: data.formattedDate, puzzle: data.puzzle, solution: data.solution,
            words: data.words, definitions: data.definitions, number: data.number,
            date: data.date.toISOString(), prevSlug, nextSlug, showNext,
            meta: { title: `Waffle Answer for ${data.formattedDate} - Daily Puzzle Solution`, description: `Check the Waffle answer for ${data.formattedDate}. View the solved grid and word definitions.` },
        };
    }

    error(404, 'Page Not Found');
};
