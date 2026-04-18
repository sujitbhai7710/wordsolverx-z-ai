<script lang="ts">
	import '../../content.css';
	import { page } from '$app/stores';
	import GeneratedTodayArticle from '$lib/components/GeneratedTodayArticle.svelte';
	import SiteDefaultsHead from '$lib/components/SiteDefaultsHead.svelte';
	import ContentNavigation from '$lib/components/ContentNavigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		TODAY_ROUTE_GAME_MAP,
		formatPuzzleDateKey,
		getPuzzleDateForGame
	} from '$lib/puzzle-window';
	import type { TodayArticleKey } from '$lib/daily-article-content';

	let { children } = $props();
	const layoutArticleKey = $derived.by(() => {
		const pathname = $page.url.pathname.replace(/^\//, '');
		if (!pathname.endsWith('answer-today')) {
			return null;
		}
		return pathname as TodayArticleKey;
	});

	const layoutArticleDate = $derived.by(() => {
		const pathname = $page.url.pathname;
		const mappedGame = TODAY_ROUTE_GAME_MAP[pathname];

		if (!mappedGame) {
			return null;
		}

		return formatPuzzleDateKey(getPuzzleDateForGame(mappedGame));
	});
</script>

<SiteDefaultsHead />

<div class="site-shell min-h-screen flex flex-col bg-white">
	<ContentNavigation />
	<main class="site-main flex-grow">
		{@render children()}
		{#if layoutArticleKey && layoutArticleDate}
			<div class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
				<GeneratedTodayArticle articleKey={layoutArticleKey} articleDate={layoutArticleDate} />
			</div>
		{/if}
	</main>
	<Footer />
</div>
