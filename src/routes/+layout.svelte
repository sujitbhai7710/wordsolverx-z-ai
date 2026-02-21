<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { themeStore } from '$lib/theme';
	import { getThemeInitScript } from '$lib/theme/init';
	import { onMount } from 'svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import { PerformanceMonitor, AnalyticsTracker } from '$lib/utils/performance';
    import { page } from '$app/stores';

	let { children } = $props();

	// Initialize theme store and performance tracking on mount
	onMount(() => {
        PerformanceMonitor.init();
		return themeStore.init();
	});

    // Track page views when the route changes
    $effect(() => {
        if ($page.url.pathname) {
            AnalyticsTracker.trackPageView($page.url.pathname);
        }
    });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Initialize theme before render to prevent FOUC -->
	{@html `<script>${getThemeInitScript()}</script>`}
</svelte:head>

<div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <ErrorBoundary>
        <Navigation />
        <main class="flex-grow">
            {@render children()}
        </main>
        <Footer />
    </ErrorBoundary>
</div>
