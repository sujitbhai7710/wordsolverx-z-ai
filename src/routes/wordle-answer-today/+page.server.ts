import { format } from 'date-fns';
import { getJSTToday, getWordleNumber, formatDate } from '$lib/utils';
import type { WordleAnswer } from '$lib/api';
import { generatePersonAuthorSchema } from '$lib/seo';
import type { PageServerLoad } from './$types';

interface TodayApiResponse extends WordleAnswer {
    today_jst?: string;
    recent_answers?: WordleAnswer[];
}

export const load: PageServerLoad = async ({ setHeaders }) => {
    const today = getJSTToday();
    const todayKey = format(today, 'yyyy-MM-dd');
    const fallbackNumber = getWordleNumber(today);
    const fallbackDate = formatDate(today);

    let wordleData: TodayApiResponse | null = null;
    try {
        wordleData = await getWordleDataWithFallback(todayKey, fallbackNumber);
    } catch (error) {
        console.error("Error fetching today's Wordle:", error);
    }

    const isCacheReady = Boolean(
        wordleData?.date === todayKey && wordleData?.content_guide && wordleData?.social_image
    );
    setHeaders({
        'X-Puzzle-Date': wordleData?.date ?? todayKey,
        'X-Edge-Cache-Bypass': isCacheReady ? '0' : '1'
    });

    const wordleWord = wordleData?.solution || '';
    const wordleNumber = wordleData?.id || fallbackNumber;
    const formattedDate = wordleData?.date ? formatDate(new Date(wordleData.date)) : fallbackDate;
    const recentAnswers = wordleData?.recent_answers || [];

    // Hints for SEO schema
    const vowelCount = wordleWord.toLowerCase().split('').filter((c: string) => 'aeiou'.includes(c)).length;
    const hasDouble = wordleWord.toLowerCase().split('').some((c: string, i: number, a: string[]) => a.indexOf(c) !== a.lastIndexOf(c));
    const startLetter = wordleWord[0]?.toUpperCase() || '';
    const endLetter = wordleWord[wordleWord.length - 1]?.toUpperCase() || '';

    const hintFaqs = [
        { question: `What is the Wordle answer for today, ${formattedDate}?`, answer: `The Wordle answer for today, ${formattedDate}, is ${wordleWord.toUpperCase()}. This is Wordle #${wordleNumber}.` },
        { question: `How many vowels are in today's Wordle answer?`, answer: `Today's Wordle answer contains ${vowelCount} vowels.` },
        { question: `Does today's Wordle have any repeating letters?`, answer: hasDouble ? "Yes, today's Wordle has at least one repeating letter." : "No, today's Wordle does not contain any repeated letters." },
        { question: `What letter does Wordle #${wordleNumber} start with?`, answer: `Today's Wordle answer starts with the letter ${startLetter}.` },
        { question: `What is the last letter of today's Wordle?`, answer: `The Wordle answer for ${formattedDate} ends with the letter ${endLetter}.` },
    ];

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: hintFaqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Wordle Hints and Answer for Today (${formattedDate})`,
        datePublished: new Date(wordleData?.date || today).toISOString(),
        dateModified: new Date(wordleData?.date || today).toISOString(),
        author: generatePersonAuthorSchema('Preston Hayes', 'https://wordsolver.tech/about#preston-hayes', 'https://wordsolver.tech/auther-wordsolverx.webp'),
        publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolver.tech/wordsolverx.webp' } },
        description: `Get Wordle hints and the confirmed Wordle answer for today, ${formattedDate}. Hints, clues, and the solution for Wordle #${wordleNumber}.`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolver.tech/wordle-answer-today' },
    };

    const socialImageUrl = wordleData?.social_image || 'https://wordsolver.tech/wordsolverx.webp';
    const pageTitle = `Wordle Hints and Answer for Today (${formattedDate})`;
    const pageDescription = `Get Wordle hints and the confirmed Wordle answer for today, ${formattedDate}. See the full solution for Wordle #${wordleNumber}, plus clue details and recent answers.`;
    const pageKeywords = `wordle answer today, wordle answer, wordle hint, wordle hint today, wordle answer for ${formattedDate}`;

    return {
        wordleData,
        wordleWord,
        wordleNumber,
        formattedDate,
        recentAnswers,
        hintFaqs,
        schemas: JSON.stringify([faqSchema, articleSchema]),
        meta: {
            title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
            socialImage: socialImageUrl,
        },
    };
};

async function getWordleDataWithFallback(todayKey: string, fallbackNumber: number): Promise<TodayApiResponse | null> {
    const todayResponse = await fetch('https://api.wordsolverx.workers.dev/api/today');
    const todayPayload = (await todayResponse.json()) as TodayApiResponse & { error?: string };

    if (todayResponse.ok && todayPayload?.solution) {
        return todayPayload;
    }

    const recentAnswers = Array.isArray(todayPayload?.recent_answers) ? todayPayload.recent_answers : [];

    try {
        const nytResponse = await fetch(`https://www.nytimes.com/svc/wordle/v2/${todayKey}.json`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 WordSolverX'
            }
        });

        if (nytResponse.ok) {
            const nytPayload = await nytResponse.json() as {
                solution?: string;
                days_since_launch?: number;
                editor?: string;
            };

            if (nytPayload.solution) {
                return {
                    id: nytPayload.days_since_launch ?? fallbackNumber,
                    date: todayKey,
                    solution: nytPayload.solution,
                    days_since_launch: nytPayload.days_since_launch,
                    editor: nytPayload.editor,
                    recent_answers: recentAnswers
                };
            }
        }
    } catch (error) {
        console.error('Error fetching NYT Wordle fallback:', error);
    }

    return null;
}
