<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import WordlebotWasmClient from '$lib/components/wordlebot/WordlebotWasmClient.svelte';
	import { getWordlebotStructuredData } from '$lib/wordlebot-wasm/route-config';
	import type { WordlebotPageConfig } from '$lib/wordlebot-wasm/types';

	let { config }: { config: WordlebotPageConfig } = $props();

	let structuredData = $derived(getWordlebotStructuredData(config));
</script>

<svelte:head>
	<title>{config.title} | WordSolverX</title>
	<meta name="description" content={config.description} />
	<meta name="keywords" content={config.keywords.join(', ')} />
	<meta property="og:title" content={`${config.title} | WordSolverX`} />
	<meta property="og:description" content={config.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={config.pageUrl} />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${config.title} | WordSolverX`} />
	<meta name="twitter:description" content={config.description} />
	<link rel="canonical" href={config.pageUrl} />
	{@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

<main class="min-h-screen bg-[linear-gradient(180deg,#f7fbf8_0%,#ffffff_36%,#f7f4eb_100%)]">
	<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
		<Breadcrumbs />

		<section class="mb-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f7fbf8_45%,#f8f1e5_100%)] p-6 shadow-[0_28px_80px_rgba(16,185,129,0.08)] sm:p-8">
			<div class="flex flex-wrap items-start justify-between gap-6">
				<div class="max-w-3xl">
					<p class="inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
						{config.eyebrow}
					</p>
					<h1 class="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
						{config.title}
					</h1>
					<p class="mt-4 max-w-2xl text-base leading-8 text-slate-600">
						{config.description}
					</p>

					{#if config.cta}
						<a
							class="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
							href={config.cta.href}
						>
							{config.cta.label}
						</a>
					{/if}
				</div>

				<div class="flex flex-wrap gap-2">
					{#each config.chips as chip}
						<span class="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">
							{chip}
						</span>
					{/each}
				</div>
			</div>
		</section>
	</div>

	<div class="pb-10">
		<WordlebotWasmClient config={config.appConfig} />
	</div>

	<div class="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
		<div class="rounded-[2rem] border border-slate-200 bg-white/85 p-2 shadow-[0_24px_70px_rgba(148,163,184,0.12)]">
			<FAQSection class="py-0" title={config.faqTitle} faqs={config.faqs} />
		</div>

		<article class="mt-10 space-y-8">
			{#each config.sections as section}
				<section class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(148,163,184,0.10)]">
					<h2 class="text-2xl font-black tracking-tight text-slate-900">{section.title}</h2>
					<div class="mt-4 space-y-4 text-base leading-8 text-slate-600">
						{#each section.paragraphs as paragraph}
							<p>{paragraph}</p>
						{/each}
					</div>
				</section>
			{/each}
		</article>
	</div>
</main>
