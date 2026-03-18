export type PuzzleTimezone = 'JST' | 'IST' | 'UTC' | 'worker-latest';
export type PuzzleSourceReadiness = 'deterministic' | 'latest-payload';

export type PuzzleGame =
	| 'wordle'
	| 'quordle'
	| 'phoodle'
	| 'semantle'
	| 'colordle'
	| 'globle'
	| 'waffle'
	| 'worldle'
	| 'betweenle'
	| 'contexto'
	| 'searchle'
	| 'phrazle'
	| 'spotle'
	| 'dotadle'
	| 'loldle'
	| 'narutodle'
	| 'onepiecedle'
	| 'pokedle'
	| 'smashdle'
	| 'nerdle';

export interface PuzzleWindow {
	group: string;
	timezone: PuzzleTimezone;
	effectivePuzzleDate: string;
	nextInvalidationAt: Date;
	ttlSeconds: number;
	sourceReadiness: PuzzleSourceReadiness;
	fallbackPuzzleDate?: string | null;
}

interface PuzzleWindowConfig {
	group: string;
	timezone: PuzzleTimezone;
	sourceReadiness: PuzzleSourceReadiness;
	boundaryHourUtc?: number;
	boundaryMinuteUtc?: number;
}

const OFFSET_MINUTES = {
	JST: 9 * 60,
	IST: 5.5 * 60,
	UTC: 0
} as const;

export const PUZZLE_WINDOW_CONFIG: Record<PuzzleGame, PuzzleWindowConfig> = {
	wordle: { group: 'wordle', timezone: 'JST', sourceReadiness: 'deterministic' },
	quordle: { group: 'quordle', timezone: 'JST', sourceReadiness: 'deterministic' },
	phoodle: {
		group: 'phoodle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 15,
		boundaryMinuteUtc: 0
	},
	semantle: { group: 'semantle', timezone: 'JST', sourceReadiness: 'deterministic' },
	colordle: { group: 'colordle', timezone: 'JST', sourceReadiness: 'deterministic' },
	globle: { group: 'globle', timezone: 'JST', sourceReadiness: 'deterministic' },
	waffle: {
		group: 'waffle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 0,
		boundaryMinuteUtc: 1
	},
	worldle: { group: 'worldle', timezone: 'UTC', sourceReadiness: 'deterministic' },
	betweenle: { group: 'betweenle', timezone: 'IST', sourceReadiness: 'deterministic' },
	nerdle: { group: 'nerdle', timezone: 'IST', sourceReadiness: 'deterministic' },
	contexto: { group: 'contexto', timezone: 'IST', sourceReadiness: 'deterministic' },
	searchle: { group: 'searchle', timezone: 'IST', sourceReadiness: 'deterministic' },
	phrazle: { group: 'phrazle', timezone: 'IST', sourceReadiness: 'deterministic' },
	spotle: { group: 'spotle', timezone: 'JST', sourceReadiness: 'deterministic' },
	dotadle: {
		group: 'gamedle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 6,
		boundaryMinuteUtc: 0
	},
	loldle: {
		group: 'gamedle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 6,
		boundaryMinuteUtc: 0
	},
	narutodle: {
		group: 'gamedle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 6,
		boundaryMinuteUtc: 0
	},
	onepiecedle: {
		group: 'gamedle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 6,
		boundaryMinuteUtc: 0
	},
	pokedle: {
		group: 'gamedle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 6,
		boundaryMinuteUtc: 0
	},
	smashdle: {
		group: 'gamedle',
		timezone: 'worker-latest',
		sourceReadiness: 'latest-payload',
		boundaryHourUtc: 6,
		boundaryMinuteUtc: 0
	}
};

export const TODAY_ROUTE_GAME_MAP: Record<string, PuzzleGame> = {
	'/wordle-answer-today': 'wordle',
	'/quordle-answer-today': 'quordle',
	'/phoodle-answer-today': 'phoodle',
	'/semantle-answer-today': 'semantle',
	'/colordle-answer-today': 'colordle',
	'/globle-answer-today': 'globle',
	'/waffle-answer-today': 'waffle',
	'/worldle-answer-today': 'worldle',
	'/betweenle-answer-today': 'betweenle',
	'/nerdle-answer-today': 'nerdle',
	'/contexto-answer-today': 'contexto',
	'/searchle-answer-today': 'searchle',
	'/phrazle-answer-today': 'phrazle',
	'/spotle-answer-today': 'spotle',
	'/dotadle-answer-today': 'dotadle',
	'/loldle-answer-today': 'loldle',
	'/narutodle-answer-today': 'narutodle',
	'/onepiecedle-answer-today': 'onepiecedle',
	'/pokedle-answer-today': 'pokedle',
	'/smashdle-answer-today': 'smashdle'
};

export const ARCHIVE_ROUTE_GAME_MAP: Record<string, PuzzleGame> = {
	'/wordle-answer-archive': 'wordle',
	'/quordle-archive': 'quordle',
	'/phoodle-archive': 'phoodle',
	'/semantle-archive': 'semantle',
	'/colordle-archive': 'colordle',
	'/globle-archive': 'globle',
	'/waffle-archive': 'waffle',
	'/worldle-archive': 'worldle',
	'/nerdle-archive': 'nerdle',
	'/contexto-archive': 'contexto',
	'/searchle-archive': 'searchle',
	'/phrazle-archive': 'phrazle',
	'/spotle-archive': 'spotle'
};

export const LONG_CACHE_STATIC_PATHS = new Set([
	'/about',
	'/archive',
	'/contact',
	'/create-custom-wordle',
	'/disclaimer',
	'/guides',
	'/multidle',
	'/privacy-policy',
	'/solver',
	'/terms-of-service',
	'/wordle-solver',
	'/quordle-solver',
	'/phoodle-solver',
	'/waffle-solver',
	'/colordle-solver',
	'/lewdle-solver',
	'/searchle-solver',
	'/soundmap-solver',
	'/spotle-solver',
	'/weaver-solver',
	'/worldle-solver',
	'/betweenle-solver',
	'/betweenle-unlimited',
	'/kanoodle-solver',
	'/minesweeper-solver',
	'/dotadle-solver',
	'/loldle-solver',
	'/narutodle-solver',
	'/onepiecedle-solver',
	'/smashdle-solver',
	'/pokedle-solver',
	'/phoodle-solver',
	'/colordle-solver'
]);

function formatDateKeyFromUtcParts(year: number, month: number, day: number): string {
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDateKeyFromFixedOffset(offsetMinutes: number, now: Date): string {
	const localMs = now.getTime() + offsetMinutes * 60_000;
	const local = new Date(localMs);
	return formatDateKeyFromUtcParts(
		local.getUTCFullYear(),
		local.getUTCMonth() + 1,
		local.getUTCDate()
	);
}

function getNextFixedOffsetInvalidation(offsetMinutes: number, now: Date): Date {
	const localMs = now.getTime() + offsetMinutes * 60_000;
	const local = new Date(localMs);
	const nextMidnightUtcMs =
		Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1, 0, 0, 0) -
		offsetMinutes * 60_000;
	return new Date(nextMidnightUtcMs);
}

function getWorkerLatestDates(config: PuzzleWindowConfig, now: Date) {
	const hour = config.boundaryHourUtc ?? 0;
	const minute = config.boundaryMinuteUtc ?? 0;
	const currentBoundary = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		hour,
		minute,
		0,
		0
	);

	if (now.getTime() >= currentBoundary) {
		const currentKey = formatDateKeyFromUtcParts(
			now.getUTCFullYear(),
			now.getUTCMonth() + 1,
			now.getUTCDate()
		);
		const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
		return {
			effectivePuzzleDate: currentKey,
			fallbackPuzzleDate: formatDateKeyFromUtcParts(
				previous.getUTCFullYear(),
				previous.getUTCMonth() + 1,
				previous.getUTCDate()
			),
			nextInvalidationAt: new Date(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, hour, minute, 0, 0)
			)
		};
	}

	const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
	return {
		effectivePuzzleDate: formatDateKeyFromUtcParts(
			previous.getUTCFullYear(),
			previous.getUTCMonth() + 1,
			previous.getUTCDate()
		),
		fallbackPuzzleDate: formatDateKeyFromUtcParts(
			now.getUTCFullYear(),
			now.getUTCMonth() + 1,
			now.getUTCDate() - 2
		),
		nextInvalidationAt: new Date(currentBoundary)
	};
}

export function parsePuzzleDateKey(dateKey: string): Date {
	return new Date(`${dateKey}T12:00:00Z`);
}

export function formatPuzzleDateKey(date: Date): string {
	return formatDateKeyFromUtcParts(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function getPuzzleDateForGame(game: PuzzleGame, now: Date = new Date()): Date {
	return parsePuzzleDateKey(getPuzzleWindow(game, { now }).effectivePuzzleDate);
}

export function getPuzzleWindow(
	game: PuzzleGame,
	options: { now?: Date; payloadDate?: string | null } = {}
): PuzzleWindow {
	const config = PUZZLE_WINDOW_CONFIG[game];
	const now = options.now ?? new Date();
	const payloadDate = options.payloadDate ?? null;

	if (config.timezone === 'worker-latest') {
		const latestDates = getWorkerLatestDates(config, now);
		const effectivePuzzleDate = payloadDate ?? latestDates.effectivePuzzleDate;
		const ttlSeconds = Math.max(
			60,
			Math.floor((latestDates.nextInvalidationAt.getTime() - now.getTime()) / 1000)
		);

		return {
			group: config.group,
			timezone: config.timezone,
			effectivePuzzleDate,
			nextInvalidationAt: latestDates.nextInvalidationAt,
			ttlSeconds,
			sourceReadiness: config.sourceReadiness,
			fallbackPuzzleDate: latestDates.fallbackPuzzleDate
		};
	}

	const offsetMinutes = OFFSET_MINUTES[config.timezone];
	const effectivePuzzleDate = getDateKeyFromFixedOffset(offsetMinutes, now);
	const nextInvalidationAt = getNextFixedOffsetInvalidation(offsetMinutes, now);
	const ttlSeconds = Math.max(60, Math.floor((nextInvalidationAt.getTime() - now.getTime()) / 1000));

	return {
		group: config.group,
		timezone: config.timezone,
		effectivePuzzleDate,
		nextInvalidationAt,
		ttlSeconds,
		sourceReadiness: config.sourceReadiness
	};
}

export function isLongCacheStaticPath(pathname: string): boolean {
	if (LONG_CACHE_STATIC_PATHS.has(pathname)) {
		return true;
	}

	if (/^\/\d+-letter-wordle$/.test(pathname)) {
		return true;
	}

	return false;
}
