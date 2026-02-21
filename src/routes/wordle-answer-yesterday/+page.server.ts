import { getJSTToday, getWordleNumber, formatDate } from '$lib/utils';
import { getYesterdayWordle } from '$lib/api';
import type { WordleAnswer } from '$lib/api';
import { getAuthorForGame, getAuthorProfileUrl } from '$lib/authors';
import { generatePersonAuthorSchema } from '$lib/seo';
import { subDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const today = getJSTToday();
    const yesterday = subDays(today, 1);
    const fallbackNumber = getWordleNumber(yesterday);
    const fallbackDate = formatDate(yesterday);

    let wordleData: WordleAnswer | null = null;
    try {
        wordleData = await getYesterdayWordle();
    } catch (error) {
        console.error("Error fetching yesterday's Wordle:", error);
    }

    const wordleWord = wordleData?.solution || '';
    const wordleNumber = wordleData?.id || fallbackNumber;
    const formattedDate = wordleData?.date ? formatDate(new Date(wordleData.date)) : fallbackDate;

    const socialImageUrl = wordleData?.social_image || 'https://wordsolverx.com/logo.png';

    return {
        wordleData,
        wordleWord,
        wordleNumber,
        formattedDate,
        meta: {
            title: `NYT Wordle Answer Yesterday (${formattedDate})`,
            description: `Check yesterday's NYT Wordle answer for ${formattedDate}. The solution for Wordle #${wordleNumber}.`,
            socialImage: socialImageUrl,
        },
    };
};
