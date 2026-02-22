import type { PageServerLoad } from './$types';

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
        const response = await fetch('https://narutodle-worker.narutodle.workers.dev/today?game=smashdle');

        if (!response.ok) {
            throw new Error('Failed to fetch Smashdle data');
        }

        const answers: GameAnswer[] = await response.json();

        return {
            answers,
            dateStr: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            error: null
        };
    } catch (err) {
        console.error('Error fetching Smashdle data:', err);
        return {
            answers: [],
            dateStr: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            error: err instanceof Error ? err.message : 'Failed to load Smashdle answers'
        };
    }
};
