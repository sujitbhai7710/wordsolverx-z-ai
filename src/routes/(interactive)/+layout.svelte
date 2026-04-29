<script lang="ts">
        import '../../interactive.css';
        import { browser } from '$app/environment';
        import { onMount } from 'svelte';
        import { tick } from 'svelte';
        import { page } from '$app/stores';
        import Navigation from '$lib/components/Navigation.svelte';
        import Footer from '$lib/components/Footer.svelte';
        import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
        import GeneratedTodayArticle from '$lib/components/GeneratedTodayArticle.svelte';
        import SiteDefaultsHead from '$lib/components/SiteDefaultsHead.svelte';
        import { getMainDailyDateKey } from '$lib/main-daily-date';
        import {
                TODAY_ROUTE_GAME_MAP,
                formatPuzzleDateKey,
                getPuzzleDateForGame
        } from '$lib/puzzle-window';
        import { PerformanceMonitor, AnalyticsTracker } from '$lib/utils/performance';
        import type { TodayArticleKey } from '$lib/daily-article-content';

        let { children } = $props();
        let pageContentEl = $state<HTMLElement | null>(null);
        let generatedArticleEl = $state<HTMLDivElement | null>(null);
        const handledInline = new Set(['wordle-answer-today', 'colordle-answer-today']);
        const mainScheduleRoutes = new Set([
                'canuckle-answer-today',
                'colorfle-answer-today',
                'countryle-answer-today',
                'framed-answer-today',
                'sportle-answer-today'
        ]);

        const layoutArticleKey = $derived.by(() => {
                const pathname = $page.url.pathname.replace(/^\//, '');
                if (!pathname.endsWith('answer-today') || handledInline.has(pathname)) {
                        return null;
                }
                return pathname as TodayArticleKey;
        });

        const layoutArticleDate = $derived.by(() => {
                const pathname = $page.url.pathname;
                const routeKey = pathname.replace(/^\//, '');

                if (!routeKey.endsWith('answer-today') || handledInline.has(routeKey)) {
                        return null;
                }

                const mappedGame = TODAY_ROUTE_GAME_MAP[pathname];
                if (mappedGame) {
                        return formatPuzzleDateKey(getPuzzleDateForGame(mappedGame));
                }

                if (mainScheduleRoutes.has(routeKey)) {
                        return getMainDailyDateKey();
                }

                return null;
        });

        async function placeGeneratedArticleBlock() {
                if (!browser || !layoutArticleKey || !layoutArticleDate || !pageContentEl || !generatedArticleEl) {
                        return;
                }

                await tick();

                const firstStaticArticle = pageContentEl.querySelector('article');
                const authorSection = pageContentEl.querySelector('section[aria-labelledby="author-heading"]');
                const anchor = firstStaticArticle ?? authorSection;

                if (anchor?.parentElement) {
                        anchor.parentElement.insertBefore(generatedArticleEl, anchor);
                        return;
                }

                pageContentEl.appendChild(generatedArticleEl);
        }

        onMount(() => {
                if (import.meta.env.DEV || $page.url.searchParams.has('perfDebug')) {
                        PerformanceMonitor.init();
                }
        });

        $effect(() => {
                if ($page.url.pathname) {
                        AnalyticsTracker.trackPageView($page.url.pathname);
                }
        });

        $effect(() => {
                void placeGeneratedArticleBlock();
        });
</script>

<SiteDefaultsHead />

<div class="site-shell min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <ErrorBoundary>
                <Navigation />
                <main class="site-main flex-grow">
                        <div bind:this={pageContentEl}>
                                {@render children()}
                        </div>
                        {#if layoutArticleKey && layoutArticleDate}
                                <div bind:this={generatedArticleEl} class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                                        <GeneratedTodayArticle articleKey={layoutArticleKey} articleDate={layoutArticleDate} />
                                </div>
                        {/if}
                </main>
                <Footer />
        </ErrorBoundary>
</div>
