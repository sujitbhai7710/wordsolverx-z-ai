import type { PageServerLoad } from './$types';
import { formatAnswerDate } from '$lib/game-dle/answer-date';

interface GameAnswer {
    game: string;
    date: string;
    mode: string;
    region: string;
    game_id: number;
    json_content: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const response = await fetch('https://narutodle-worker.narutodle.workers.dev/latest?game=loldle');

        if (!response.ok) {
            throw new Error('Failed to fetch LoLdle data');
        }

        const answers: GameAnswer[] = await response.json();

        return {
            answers,
            dateStr: formatAnswerDate(answers) ?? '',
            error: null
        };
    } catch (err) {
        console.error('Error fetching LoLdle data:', err);
        return {
            answers: [],
            dateStr: '',
            error: err instanceof Error ? err.message : 'Failed to load LoLdle answers'
        };
    }
};
