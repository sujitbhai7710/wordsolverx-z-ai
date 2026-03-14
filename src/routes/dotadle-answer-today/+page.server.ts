import type { PageServerLoad } from './$types';
import { formatAnswerDate, pickLatestAnswerDate } from '$lib/game-dle/answer-date';

interface GameAnswer {
    game: string;
    date: string;
    mode: string;
    region: string;
    game_id: number;
    json_content: string;
}

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
    try {
        const response = await fetch('https://narutodle-worker.narutodle.workers.dev/latest?game=dotadle');

        if (!response.ok) {
            throw new Error('Failed to fetch Dotadle data');
        }

        const answers: GameAnswer[] = await response.json();
        const latestDate = pickLatestAnswerDate(answers);

        if (latestDate) {
            setHeaders({ 'X-Puzzle-Date': latestDate });
        }

        return {
            answers,
            dateStr: formatAnswerDate(answers) ?? '',
            error: null
        };
    } catch (err) {
        console.error('Error fetching Dotadle data:', err);
        return {
            answers: [],
            dateStr: '',
            error: err instanceof Error ? err.message : 'Failed to load Dotadle answers'
        };
    }
};
