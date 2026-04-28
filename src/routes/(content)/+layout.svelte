<script lang="ts">
        import '../../content.css';
        import { browser } from '$app/environment';
        import { tick } from 'svelte';
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
        let pageContentEl: HTMLElement | null = null;
        let generatedArticleEl: HTMLDivElement | null = null;
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

        $effect(() => {
                void placeGeneratedArticleBlock();
        });
</script>

<SiteDefaultsHead />

<div class="site-shell min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <ContentNavigation />
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
</div>
