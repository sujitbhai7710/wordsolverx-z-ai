import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { solveNerdle, type GameMode, type GuessRow } from '$lib/server/nerdle-solver';

const VALID_MODES: GameMode[] = ['micro', 'mini', 'midi', 'classic', 'maxi'];

export const POST: RequestHandler = async ({ request, fetch, url }) => {
	try {
		const body = (await request.json()) as {
			mode?: GameMode;
			guesses?: GuessRow[];
		};

		const mode = body.mode;
		if (!mode || !VALID_MODES.includes(mode)) {
			return json({ success: false, error: 'Invalid mode' }, { status: 400 });
		}

		const guesses = Array.isArray(body.guesses) ? body.guesses : [];
		const result = await solveNerdle(fetch, url.origin, mode, guesses);

		return json({
			success: true,
			total: result.total,
			remaining: result.remaining,
			suggestions: result.suggestions
		});
	} catch (error) {
		console.error('Nerdle solver API error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Internal server error'
			},
			{ status: 500 }
		);
	}
};

export const GET: RequestHandler = async ({ fetch, url }) => {
	try {
		const loaded = await Promise.all(
			VALID_MODES.map(async (mode) => {
				const result = await solveNerdle(fetch, url.origin, mode, []);
				return [mode, result.remaining] as const;
			})
		);

		return json({
			success: true,
			loaded: Object.fromEntries(loaded)
		});
	} catch (error) {
		console.error('Nerdle solver status error:', error);
		return json({ success: false, error: 'Failed to load Nerdle equation counts' }, { status: 500 });
	}
};
