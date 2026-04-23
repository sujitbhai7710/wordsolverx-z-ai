<script lang="ts">
        import { onDestroy, onMount } from 'svelte';
        import WordlebotSkeleton from './WordlebotSkeleton.svelte';
        import type { WordlebotAppPageConfig } from '$lib/wordlebot-wasm/types';

        let { config }: { config: WordlebotAppPageConfig } = $props();

        let host: HTMLDivElement | null = null;
        let isStarted = $state(false);
        let isLoading = $state(false);
        let errorMessage = $state('');
        let cleanup: (() => void) | undefined;

        function buildShadowStyles(css: string) {
                return (
                        css
                                .replace(':root {', ':host {')
                                .replace(/html,\s*body\s*\{/, ':host {')
                                .replace(/body\s*\{/, '.shadow-body {') +
                        `
:host {
  display: block;
  width: 100%;
}
`
                );
        }

        async function start() {
                if (!host || isStarted) return;

                isStarted = true;
                isLoading = true;
                errorMessage = '';
                cleanup?.();

                try {
                        const [{ default: rawStyles }, { mountWordlebotApp }] = await Promise.all([
                                import('$lib/wordlebot-wasm/styles.css?raw'),
                                import('$lib/wordlebot-wasm/app')
                        ]);

                        const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
                        shadowRoot.innerHTML = '';

                        const style = document.createElement('style');
                        style.textContent = buildShadowStyles(rawStyles);

                        const body = document.createElement('div');
                        body.className = 'shadow-body';

                        const appTarget = document.createElement('div');
                        body.appendChild(appTarget);

                        shadowRoot.append(style, body);

                        cleanup = mountWordlebotApp(appTarget, config);
                } catch (error) {
                        errorMessage =
                                error instanceof Error ? error.message : 'The solver engine could not load.';
                        isStarted = false;
                } finally {
                        isLoading = false;
                }
        }

        onMount(() => {
                if (typeof window === 'undefined') return;

                // Auto-start when the solver area scrolls into view
                const observer = new IntersectionObserver(
                        (entries) => {
                                for (const entry of entries) {
                                        if (entry.isIntersecting && !isStarted && !isLoading) {
                                                start();
                                        }
                                }
                        },
                        { rootMargin: '200px', threshold: 0.05 }
                );

                if (host) observer.observe(host);

                return () => {
                        observer.disconnect();
                };
        });

        onDestroy(() => {
                cleanup?.();
        });
</script>

{#if !isStarted}
        <WordlebotSkeleton {config} />
{/if}

{#if errorMessage}
        <div class="mx-auto w-full max-w-5xl px-4 py-6 text-center sm:px-6 lg:px-8">
                <div class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {errorMessage}
                        <button
                                type="button"
                                class="ml-2 font-semibold underline"
                                onclick={start}
                        >
                                Retry
                        </button>
                </div>
        </div>
{/if}

<div
        bind:this={host}
        class="solver-host block w-full"
        style="min-height: 280px;"
        class:opacity-0={!isStarted}
        class:opacity-100={isStarted}
        class:transition-opacity={isStarted}
        class:duration-500={isStarted}
></div>

<style>
        .solver-host {
                transition: opacity 400ms ease;
        }
</style>
