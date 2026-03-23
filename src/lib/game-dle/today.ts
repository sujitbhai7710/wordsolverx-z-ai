import { getPuzzleWindow } from '$lib/puzzle-window';
import { formatAnswerDate, pickLatestAnswerDate, type AnswerDateLike } from './answer-date';

const GAME_DLE_WORKER_URL = 'https://narutodle-worker.narutodle.workers.dev';

export type GameDlePuzzle = 'dotadle' | 'loldle' | 'narutodle' | 'onepiecedle' | 'pokedle' | 'smashdle';

export interface GameDleAnswer extends AnswerDateLike {
	game: string;
	date: string;
	mode: string;
	region: string;
	game_id: number;
	json_content: string;
}

export interface GameDleTodayResult {
	answers: GameDleAnswer[];
	dateStr: string;
	latestDate: string | null;
	error: string | null;
}

export async function loadGameDleToday({
	fetchFn,
	setHeaders,
	game,
	gameTitle
}: {
	fetchFn: typeof fetch;
	setHeaders: (headers: Record<string, string>) => void;
	game: GameDlePuzzle;
	gameTitle: string;
}): Promise<GameDleTodayResult> {
	try {
		const response = await fetchFn(`${GAME_DLE_WORKER_URL}/today?game=${game}`);
		const answers = response.ok ? ((await response.json()) as GameDleAnswer[]) : [];
		const latestDate = pickLatestAnswerDate(answers);

		if (!response.ok || !answers.length) {
			return {
				answers: [],
				dateStr: '',
				latestDate,
				error: `Today's ${gameTitle} answers are not available yet. Please check again soon.`
			};
		}

		setHeaders({
			'X-Puzzle-Date': latestDate ?? getPuzzleWindow(game).effectivePuzzleDate
		});

		return {
			answers,
			dateStr: formatAnswerDate(answers) ?? '',
			latestDate,
			error: null
		};
	} catch (error) {
		console.error(`Error fetching ${gameTitle} data:`, error);

		return {
			answers: [],
			dateStr: '',
			latestDate: null,
			error: `Failed to load ${gameTitle} answers`
		};
	}
}
