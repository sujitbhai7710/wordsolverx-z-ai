import { getJSTToday, getWordleNumber, formatDate } from '$lib/utils';
import { getTodayWordle } from '$lib/api';
import type { WordleAnswer } from '$lib/api';
import { getAuthorForGame, getAuthorProfileUrl } from '$lib/authors';
import { generatePersonAuthorSchema } from '$lib/seo';
import type { PageServerLoad } from './$types';

interface TodayApiResponse extends WordleAnswer {
    today_jst?: string;
    recent_answers?: WordleAnswer[];
}

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const fallbackNumber = getWordleNumber(today);
    const fallbackDate = formatDate(today);

    let wordleData: TodayApiResponse | null = null;
    try {
        wordleData = (await getTodayWordle()) as TodayApiResponse;
    } catch (error) {
        console.error("Error fetching today's Wordle:", error);
    }

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
        '@type': 'NewsArticle',
        headline: `NYT Wordle Answer Today - ${formattedDate}`,
        datePublished: new Date(wordleData?.date || today).toISOString(),
        dateModified: new Date(wordleData?.date || today).toISOString(),
        author: generatePersonAuthorSchema(getAuthorForGame('Wordle'), getAuthorProfileUrl(getAuthorForGame('Wordle'))),
        publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } },
        description: `Get the NYT Wordle answer for today, ${formattedDate}. Hints, clues, and the solution for Wordle #${wordleNumber}.`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/wordle-answer-today' },
    };

    const socialImageUrl = wordleData?.social_image || 'https://wordsolverx.com/logo.png';

    return {
        wordleData,
        wordleWord,
        wordleNumber,
        formattedDate,
        recentAnswers,
        hintFaqs,
        schemas: JSON.stringify([faqSchema, articleSchema]),
        meta: {
            title: `NYT Wordle Answer Today (${formattedDate})`,
            description: `Check the NYT Wordle answer for today, ${formattedDate}. Get hints, clues, and the full solution for Wordle #${wordleNumber}.`,
            socialImage: socialImageUrl,
        },
    };
};
