import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getNerdleAllModeAnswerForToday,
	type NerdleAllModeAnswerData,
	type NerdleAnswerFetchOptions
} from '$lib/nerdle-answers';
import { getNerdleTodayDateKey } from '$lib/nerdle';

const NERDLE_TODAY_PAGE_VERSION = '3';

function formatDateLabel(dateKey: string): string {
	const date = new Date(`${dateKey}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) {
		return dateKey;
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'Asia/Tokyo'
	});
}

export const load: PageServerLoad = async ({ url, setHeaders, platform, fetch }) => {
	if (!url.searchParams.has('v')) {
		const searchParams = new URLSearchParams(url.searchParams);
		searchParams.set('v', NERDLE_TODAY_PAGE_VERSION);
		throw redirect(302, `${url.pathname}?${searchParams.toString()}`);
	}

	const fetchOptions: NerdleAnswerFetchOptions = {
		platform,
		fetchImpl: fetch
	};
	const fallbackDate = getNerdleTodayDateKey();
	const answerData =
		(await getNerdleAllModeAnswerForToday(fetchOptions)) ??
		({
			date: fallbackDate,
			classicPuzzleNumber: Number.NaN,
			modes: []
		} satisfies NerdleAllModeAnswerData);
	const formattedDate = formatDateLabel(answerData.date);
	const hasValidTodayData =
		Number.isFinite(answerData.classicPuzzleNumber) &&
		Array.isArray(answerData.modes) &&
		answerData.modes.length > 0;
	const fallbackCacheTtlSeconds = 60;

	setHeaders({
		'X-Puzzle-Date': answerData.date,
		'X-Edge-Cache-Bypass': '0',
		...(hasValidTodayData ? {} : { 'X-Edge-Cache-TTL': String(fallbackCacheTtlSeconds) }),
		'Cache-Control': hasValidTodayData
			? 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600'
			: `public, max-age=0, s-maxage=${fallbackCacheTtlSeconds}, stale-while-revalidate=300`
	});

	const pageTitle = `Nerdle Answer Today ( ${formattedDate} )`;
	const pageDescription = `Get all Nerdle answers for ${formattedDate}: Classic, Micro, Mini, Midi, Maxi, Mini Bi, Quad, Speed, and Instant.`;
	const schemas = JSON.stringify([
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: pageTitle,
			description: pageDescription,
			datePublished: `${answerData.date}T00:00:00+09:00`,
			dateModified: `${answerData.date}T00:00:00+09:00`,
			mainEntityOfPage: 'https://wordsolver.tech/nerdle-answer-today',
			author: {
				'@type': 'Organization',
				name: 'WordSolverX'
			},
			publisher: {
				'@type': 'Organization',
				name: 'WordSolverX',
				logo: {
					'@type': 'ImageObject',
					url: 'https://wordsolver.tech/wordsolverx.webp'
				}
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wordsolver.tech' },
				{ '@type': 'ListItem', position: 2, name: 'Today', item: 'https://wordsolver.tech/today' },
				{
					'@type': 'ListItem',
					position: 3,
					name: 'Nerdle Answer Today',
					item: 'https://wordsolver.tech/nerdle-answer-today'
				}
			]
		}
	]);

	return {
		answerData,
		formattedDate,
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: `nerdle answer today, nerdle all modes answer, nerdle classic micro mini midi maxi quad speed instant, nerdle archive, nerdle answer ${formattedDate}`,
			canonical: 'https://wordsolver.tech/nerdle-answer-today'
		},
		schemas
	};
};
