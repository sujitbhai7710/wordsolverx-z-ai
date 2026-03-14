<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import type { SpotleArtist, SpotleAnswer } from '$lib/spotle';

	let { data }: {
		data: {
			todayStr: string;
			todayFormatted: string;
			todayAnswer: SpotleAnswer | null;
			todayArtist: SpotleArtist | null;
			artists: SpotleArtist[];
			answers: SpotleAnswer[];
			faqItems: { question: string; answer: string }[];
			schemaJson: string;
			meta: { title: string; description: string; keywords?: string };
			labels: { countryNames: Record<string, string>; genderNames: Record<string, string> };
		};
	} = $props();

	const todayFormatted = $derived(data.todayFormatted);
	const todayAnswer = $derived(data.todayAnswer);
	const todayArtist = $derived(data.todayArtist);
	const artists = $derived(data.artists);
	const answers = $derived(data.answers);
	const faqItems = $derived(data.faqItems);
	const schemaJson = $derived(data.schemaJson);
	const meta = $derived(data.meta);
	const labels = $derived(data.labels);
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<meta name="keywords" content={meta.keywords ?? 'spotle answer today, spotle answer, spotle hint, spotle hint today'} />
	<link rel="canonical" href="https://wordsolverx.com/spotle-answer-today" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolverx.com/spotle-answer-today" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	{@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
	<div class="max-w-6xl mx-auto">
		<Breadcrumbs />

		<header class="text-center mb-10">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Spotle Answer</p>
			<h1 class="text-4xl sm:text-5xl font-black text-gray-900 mt-3">
				Spotle Hints and Answer for Today ({todayFormatted})
			</h1>
			<p class="text-lg text-gray-500 mt-3">{todayFormatted}</p>
		</header>

		<section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
			<div class="lg:col-span-2 bg-white border border-gray-200 rounded-3xl shadow-lg p-6">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">Today&apos;s Artist</h2>
				{#if todayArtist}
					<div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
						<div class="flex-1">
							<p class="text-sm font-semibold text-emerald-600">Day #{todayAnswer?.dayNumber}</p>
							<h3 class="text-3xl font-black text-gray-900 mt-2">{todayArtist.artist}</h3>
							<p class="text-gray-500 mt-1">
								{labels.countryNames[todayArtist.country] ?? todayArtist.country.toUpperCase()} - {todayArtist.genre}
							</p>
							<div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm">
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Rank</p>
									<p class="font-semibold text-gray-900">#{todayArtist.index + 1}</p>
								</div>
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Debut</p>
									<p class="font-semibold text-gray-900">{todayArtist.debut_album_year}</p>
								</div>
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Group</p>
									<p class="font-semibold text-gray-900">
										{todayArtist.group_size === 1 ? 'Solo' : `${todayArtist.group_size} members`}
									</p>
								</div>
								<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
									<p class="text-xs text-gray-500">Gender</p>
									<p class="font-semibold text-gray-900">
										{labels.genderNames[todayArtist.gender] ?? todayArtist.gender}
									</p>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="text-gray-500">
						Answer not available for today right now. Please check back later.
					</div>
				{/if}
			</div>

			<div class="bg-white border border-gray-200 rounded-3xl shadow-lg p-6">
				<h3 class="text-xl font-bold text-gray-900 mb-3">Quick Stats</h3>
				<div class="space-y-3 text-sm text-gray-600">
					<div class="flex items-center justify-between">
						<span>Total Artists</span>
						<span class="font-semibold text-gray-900">{artists.length}</span>
					</div>
					<div class="flex items-center justify-between">
						<span>Total Answers</span>
						<span class="font-semibold text-gray-900">{answers.length}</span>
					</div>
					<div class="flex items-center justify-between">
						<span>Latest Day</span>
						<span class="font-semibold text-gray-900">#{todayAnswer?.dayNumber ?? '-'}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 mb-12">
			<h2 class="text-2xl font-bold text-gray-900">Need an older Spotle answer?</h2>
			<p class="mt-3 text-gray-600">
				Older artist answers now live on the dedicated Spotle archive page instead of this today page.
			</p>
			<div class="mt-5 flex flex-wrap gap-3">
				<a
					href="/spotle-archive"
					class="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
				>
					Open Spotle Archive
				</a>
				<a
					href="/spotle-solver"
					class="inline-flex items-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
				>
					Open Spotle Solver
				</a>
			</div>
		</section>

		<FAQSection title="Spotle Answers FAQ (Last 30 Days)" faqs={faqItems} />
	</div>
</div>
