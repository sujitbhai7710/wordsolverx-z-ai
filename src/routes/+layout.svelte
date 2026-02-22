<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import { PerformanceMonitor, AnalyticsTracker } from '$lib/utils/performance';
    import { page } from '$app/stores';
	import { generateOrganizationSchema } from '$lib/seo';

	let { children } = $props();

	// Initialize performance tracking on mount
	onMount(() => {
        PerformanceMonitor.init();
	});

    // Track page views when the route changes
    $effect(() => {
        if ($page.url.pathname) {
            AnalyticsTracker.trackPageView($page.url.pathname);
        }
    });

	// Generate Organization schema for global layout
	const organizationSchema = generateOrganizationSchema();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>WordSolverX | Wordle & Puzzle Solvers</title>
	<meta name="description" content="Play Wordle variants, get daily answers, and solve puzzle games with fast, accurate tools on WordSolverX." />
	<!-- Theme color for mobile browsers -->
	<meta name="theme-color" content="#10b981" />
	<!-- Default Open Graph tags -->
	<meta property="og:site_name" content="WordSolverX" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content="https://wordsolverx.com/wordsolverx.webp" />
	<meta name="robots" content="index, follow" />
	<!-- Apple touch icon -->
	<link rel="apple-touch-icon" href="/wordsolverx.webp" />
	<!-- Organization Schema -->
	{@html `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>`}
</svelte:head>

<div class="min-h-screen flex flex-col bg-white">
    <ErrorBoundary>
        <Navigation />
        <main class="flex-grow">
            {@render children()}
        </main>
        <Footer />
    </ErrorBoundary>
</div>
