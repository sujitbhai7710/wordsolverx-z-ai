<script lang="ts">
	import '../../content.css';
	import SiteDefaultsHead from '$lib/components/SiteDefaultsHead.svelte';
	import ContentNavigation from '$lib/components/ContentNavigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<SiteDefaultsHead />

<div class="site-shell min-h-screen flex flex-col bg-white">
	<ContentNavigation />
	<main class="site-main flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>
