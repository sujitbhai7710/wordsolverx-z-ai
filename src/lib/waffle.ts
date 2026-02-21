
import { format, differenceInDays, startOfDay } from 'date-fns';
import { getJSTToday } from '$lib/utils';

export interface WaffleDayData {
    date: Date;
    formattedDate: string;
    puzzle: string;
    solution: string;
    words: string[];
    definitions: {
        type: string;
        definition: string;
        example: string;
        phonetic: string;
        word: string;
    }[];
    number: number;
}

const WAFFLE_WORKER_URL = 'https://api.wafflegame.workers.dev';

export async function getWaffleDataForDate(date: Date): Promise<WaffleDayData | null> {
    const todayJST = getJSTToday();
    const todayJSTStr = format(todayJST, 'yyyy-MM-dd');
    const dateStr = format(date, 'yyyy-MM-dd');

    // Choose endpoint: Use /today for the dedicated route or if dates match
    const isToday = dateStr === todayJSTStr;
    const endpoint = isToday ? '/today' : `/date/${dateStr}`;

    try {
        const url = `${WAFFLE_WORKER_URL}${endpoint}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // next: { revalidate: 3600 } // Removed for SvelteKit
        });

        if (response.ok) {
            const data = await response.json();
            if (!data || data.error) return null;

            const puzzleDate = data.date ? new Date(data.date) : date;

            return {
                date: puzzleDate,
                formattedDate: format(puzzleDate, 'MMMM d, yyyy'),
                puzzle: data.puzzle,
                solution: data.solution,
                words: data.words,
                definitions: data.definitions,
                number: data.number
            };
        }
    } catch (err) {
        console.error("Worker fetch error:", err);
    }

    return null;
}

export const parseWaffleSlugDate = (slug: string): Date | null => {
    try {
        const parts = slug.split('-');
        if (parts.length !== 3) return null;
        const monthStr = parts[0];
        const dayStr = parts[1];
        const yearStr = parts[2];
        const dateStr = `${monthStr} ${dayStr}, ${yearStr}`;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date;
    } catch (e) {
        return null;
    }
};

export const formatWaffleDateForSlug = (date: Date): string => {
    return format(date, 'MMMM-dd-yyyy').toLowerCase();
};
