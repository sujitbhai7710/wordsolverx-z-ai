import { redirect, type Handle } from '@sveltejs/kit';
import { format } from 'date-fns';
import { parseArchiveDateKey } from '$lib/archive-page';
import { getJSTToday } from '$lib/utils';

const RETIRED_SOLVER_PATH = /^\/(leddle-solver)\/?$/;
const LEGACY_SITEMAP_PATH = /^\/(sitemap-index|sitemap-today|sitemap-yesterday|sitemap-solvers|sitemap-games|sitemap-archive|newssitemap)\.xml\/?$/;
const LEGACY_DATED_SLUG_PATH = /^\/(?<slug>(?<game>wordle|quordle|phoodle|semantle|colordle|globle|waffle)-answer-for-(?<legacyDate>[a-z]+-\d{1,2}-\d{4}))\/?$/i;
const LEGACY_GAME_DATE_PATH = /^\/(?<game>wordle|quordle|phoodle|semantle|colordle|globle|waffle)\/(?<isoDate>\d{4}-\d{2}-\d{2})\/?$/i;
const YESTERDAY_REDIRECTS = {
	'/yesterday': '/today',
	'/wordle-answer-yesterday': '/wordle-answer-today',
	'/phoodle-answer-yesterday': '/phoodle-answer-today',
	'/semantle-answer-yesterday': '/semantle-answer-today',
	'/colordle-answer-yesterday': '/colordle-answer-today'
} as const;

const GAME_ROUTE_MAP = {
	wordle: { today: '/wordle-answer-today', archive: '/wordle-answer-archive' },
	quordle: { today: '/quordle-answer-today', archive: '/quordle-archive' },
	phoodle: { today: '/phoodle-answer-today', archive: '/phoodle-archive' },
	semantle: { today: '/semantle-answer-today', archive: '/semantle-archive' },
	colordle: { today: '/colordle-answer-today', archive: '/colordle-archive' },
	globle: { today: '/globle-answer-today', archive: '/globle-archive' },
	waffle: { today: '/waffle-answer-today', archive: '/waffle-archive' }
} as const;

type SupportedArchiveGame = keyof typeof GAME_ROUTE_MAP;

function parseLegacyMonthDate(input: string): string | null {
	const match = /^(?<month>[a-z]+)-(?<day>\d{1,2})-(?<year>\d{4})$/i.exec(input);
	if (!match?.groups) {
		return null;
	}

	const monthMap: Record<string, number> = {
		january: 0,
		february: 1,
		march: 2,
		april: 3,
		may: 4,
		june: 5,
		july: 6,
		august: 7,
		september: 8,
		october: 9,
		november: 10,
		december: 11
	};

	const monthIndex = monthMap[match.groups.month.toLowerCase()];
	const day = Number(match.groups.day);
	const year = Number(match.groups.year);

	if (monthIndex === undefined || Number.isNaN(day) || Number.isNaN(year)) {
		return null;
	}

	const date = new Date(Date.UTC(year, monthIndex, day));
	if (
		Number.isNaN(date.getTime()) ||
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== monthIndex ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	return format(date, 'yyyy-MM-dd');
}

function getArchiveRedirect(game: SupportedArchiveGame, dateKey: string): string {
	const routes = GAME_ROUTE_MAP[game];
	const latestDateKey = format(getJSTToday(), 'yyyy-MM-dd');

	if (dateKey === latestDateKey) {
		return routes.today;
	}

	return `${routes.archive}?date=${dateKey}`;
}

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const normalizedPathname =
		pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

	if (normalizedPathname in YESTERDAY_REDIRECTS) {
		throw redirect(301, YESTERDAY_REDIRECTS[normalizedPathname as keyof typeof YESTERDAY_REDIRECTS]);
	}

	if (RETIRED_SOLVER_PATH.test(normalizedPathname)) {
		throw redirect(301, '/');
	}

	if (LEGACY_SITEMAP_PATH.test(normalizedPathname)) {
		throw redirect(301, '/sitemap.xml');
	}

	const datedSlugMatch = LEGACY_DATED_SLUG_PATH.exec(normalizedPathname);
	if (datedSlugMatch?.groups?.game && datedSlugMatch.groups.legacyDate) {
		const game = datedSlugMatch.groups.game.toLowerCase() as SupportedArchiveGame;
		const dateKey = parseLegacyMonthDate(datedSlugMatch.groups.legacyDate);
		if (game in GAME_ROUTE_MAP && dateKey) {
			throw redirect(301, getArchiveRedirect(game, dateKey));
		}
	}

	const gameDateMatch = LEGACY_GAME_DATE_PATH.exec(normalizedPathname);
	if (gameDateMatch?.groups?.game && gameDateMatch.groups.isoDate) {
		const game = gameDateMatch.groups.game.toLowerCase() as SupportedArchiveGame;
		const parsedDate = parseArchiveDateKey(gameDateMatch.groups.isoDate);
		if (game in GAME_ROUTE_MAP && parsedDate) {
			throw redirect(301, getArchiveRedirect(game, gameDateMatch.groups.isoDate));
		}
	}

	const response = await resolve(event);
	const contentType = response.headers.get('content-type') ?? '';

	// Keep HTML fresh without fully disabling caching. This preserves crawl efficiency
	// and performance while still encouraging edges to revalidate often.
	if (contentType.includes('text/html')) {
		response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=900, stale-while-revalidate=86400');
	}

	return response;
};
