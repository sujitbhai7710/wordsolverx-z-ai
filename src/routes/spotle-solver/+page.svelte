<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import { onMount } from 'svelte';
	import {
		COUNTRY_NAMES,
		GENDER_NAMES,
		SPOTLE_ATTRIBUTES,
		filterSpotleCandidates,
		getDefaultSpotleFeedback,
		getNextSpotleArrow,
		getNextSpotleFeedback,
		type SpotleArtist,
		type SpotleGuess
	} from '$lib/spotle';

	let dataLoaded = $state(false);
	let artists = $state<SpotleArtist[]>([]);
	let searchQuery = $state('');
	let showDropdown = $state(false);
	let selectedArtist = $state<SpotleArtist | null>(null);
	let guesses = $state<SpotleGuess[]>([]);
	let currentFeedback = $state(getDefaultSpotleFeedback());

	async function loadSpotleData() {
		try {
			const response = await fetch('/spotle_data.json');
			if (!response.ok) {
				throw new Error(`Spotle data fetch failed: ${response.status}`);
			}
			const payload = await response.json();
			artists = payload.artists ?? [];
			dataLoaded = true;
		} catch (error) {
			console.error('Spotle data load error', error);
			dataLoaded = true;
		}
	}

	onMount(() => {
		void loadSpotleData();
	});

	const searchResults = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return [];
		return artists
			.filter((artist) => artist.artist.toLowerCase().includes(query))
			.slice(0, 8);
	});

	const remainingCandidates = $derived(filterSpotleCandidates(artists, guesses));

	function selectArtist(artist: SpotleArtist) {
		selectedArtist = artist;
		searchQuery = artist.artist;
		showDropdown = false;
	}

	function addGuess() {
		if (!selectedArtist) return;
		if (guesses.some((guess) => guess.artist.artist === selectedArtist?.artist)) {
			return;
		}
		guesses = [...guesses, { artist: selectedArtist, feedback: { ...currentFeedback } }];
		selectedArtist = null;
		searchQuery = '';
		showDropdown = false;
		currentFeedback = getDefaultSpotleFeedback();
	}

	function resetAll() {
		guesses = [];
		selectedArtist = null;
		searchQuery = '';
		showDropdown = false;
		currentFeedback = getDefaultSpotleFeedback();
	}
</script>

<svelte:head>
	<title>Spotle Solver - Spotify Artist Guess Helper | WordSolverX</title>
	<meta
		name="description"
		content="Solve Spotle faster with our Spotify artist solver. Match rank, debut year, genre, country, and more using precise feedback filters."
	/>
	<link rel="canonical" href="https://wordsolverx.com/spotle-solver" />
	<meta property="og:title" content="Spotle Solver - Spotify Artist Guess Helper" />
	<meta
		property="og:description"
		content="Use smart feedback filters to narrow Spotle answers by rank, debut year, genre, country, group size, and gender."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolverx.com/spotle-solver" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
	<div class="max-w-7xl mx-auto px-4 py-8">
		<Breadcrumbs />

		<header class="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 md:p-8 mb-8">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<p class="text-xs uppercase tracking-[0.2em] text-emerald-400">Spotify Daily Game</p>
					<h1 class="text-4xl md:text-5xl font-black mt-2">Spotle Solver</h1>
					<p class="text-gray-400 mt-2 max-w-2xl">
						Search an artist, match the feedback colors and arrows, and filter the remaining candidates
						in real time.
					</p>
				</div>
				<a
					href="/spotle-answer-today"
					class="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400"
				>
					View Today&apos;s Answer
				</a>
			</div>
		</header>

		{#if !dataLoaded}
			<div class="h-48 flex items-center justify-center text-gray-400">Loading Spotle data...</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<section class="lg:col-span-4 space-y-6">
					<div class="bg-gray-900/70 border border-gray-800 rounded-3xl p-5">
						<h2 class="text-lg font-semibold mb-4">Make a Guess</h2>
						<div class="relative mb-3">
							<input
								type="text"
								placeholder="Search artist..."
								value={searchQuery}
								oninput={(event) => {
									searchQuery = (event.currentTarget as HTMLInputElement).value;
									showDropdown = true;
								}}
								onfocus={() => (showDropdown = true)}
								onblur={() => setTimeout(() => (showDropdown = false), 200)}
								class="w-full h-11 rounded-xl bg-gray-800 border border-gray-700 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							{#if showDropdown && searchResults.length > 0}
								<div class="absolute z-20 w-full mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
									{#each searchResults as artist}
										<button
											type="button"
											onmousedown={(event) => {
												event.preventDefault();
												selectArtist(artist);
											}}
											class="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-800 text-left"
										>
											<div class="min-w-0">
												<p class="text-sm font-semibold truncate">{artist.artist}</p>
												<p class="text-xs text-gray-400">#{artist.index + 1} - {artist.genre}</p>
											</div>
										</button>
									{/each}
								</div>
							{/if}
						</div>

						{#if selectedArtist}
							<div class="bg-gray-800/80 border border-gray-700 rounded-2xl p-4 space-y-3">
								<div class="flex items-center gap-3">
									<div>
										<p class="font-semibold">{selectedArtist.artist}</p>
										<p class="text-xs text-gray-400">Tap colors to match your game</p>
									</div>
								</div>

								<div class="grid grid-cols-3 gap-2 text-xs">
									{#each SPOTLE_ATTRIBUTES as attr}
										<div class="bg-gray-900/70 border border-gray-700 rounded-xl p-2 text-center">
											<p class="text-gray-400">{attr.shortLabel}</p>
											<p class="font-semibold truncate">{attr.getDisplayValue(selectedArtist)}</p>
											<button
												type="button"
												onclick={() => {
													currentFeedback = {
														...currentFeedback,
														[attr.key]: getNextSpotleFeedback(currentFeedback[attr.key] as any)
													};
												}}
												class={`mt-1 w-full h-6 rounded-lg text-[10px] font-bold ${
													currentFeedback[attr.key] === 'green'
														? 'bg-emerald-500 text-black'
														: currentFeedback[attr.key] === 'yellow'
															? 'bg-amber-400 text-black'
															: 'bg-gray-700 text-gray-200'
												}`}
											>
												{currentFeedback[attr.key] === 'green'
													? 'Match'
													: currentFeedback[attr.key] === 'yellow'
														? 'Close'
														: 'Wrong'}
											</button>
											{#if attr.hasArrow}
												<button
													type="button"
													onclick={() => {
														currentFeedback = {
															...currentFeedback,
															[attr.arrowKey!]: getNextSpotleArrow(
																currentFeedback[attr.arrowKey!] as any
															)
														};
													}}
													class={`mt-1 w-full h-5 rounded-lg text-[10px] font-semibold ${
														currentFeedback[attr.arrowKey!] === 'up'
															? 'bg-sky-500 text-black'
															: currentFeedback[attr.arrowKey!] === 'down'
																? 'bg-orange-500 text-black'
																: 'bg-gray-700 text-gray-200'
													}`}
												>
													{currentFeedback[attr.arrowKey!] === 'up'
														? 'Higher'
														: currentFeedback[attr.arrowKey!] === 'down'
															? 'Lower'
															: 'Same'}
												</button>
											{/if}
										</div>
									{/each}
								</div>

								<button
									type="button"
									onclick={addGuess}
									class="w-full rounded-xl bg-emerald-500 text-black font-semibold py-2 hover:bg-emerald-400"
								>
									Add Guess
								</button>
							</div>
						{/if}

						<div class="mt-4 flex items-center justify-between text-xs text-gray-400">
							<span>Guesses: {guesses.length}</span>
							<button
								type="button"
								onclick={resetAll}
								class="text-emerald-400 hover:text-emerald-300"
							>
								Reset
							</button>
						</div>
					</div>

					<div class="bg-gray-900/70 border border-gray-800 rounded-3xl p-5">
						<h3 class="text-sm font-semibold text-gray-300 mb-3">Quick Picks</h3>
						<div class="flex flex-wrap gap-2 text-xs">
							{#each ['Drake', 'Taylor Swift', 'Bad Bunny', 'The Weeknd', 'Ed Sheeran', 'Beyonce'] as name}
								{@const artist = artists.find((a) => a.artist === name)}
								{#if artist}
									<button
										type="button"
										onclick={() => selectArtist(artist)}
										class="px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800 hover:bg-gray-700"
									>
										{name.split(' ')[0]}
									</button>
								{/if}
							{/each}
						</div>
					</div>
				</section>

				<section class="lg:col-span-4 space-y-6">
					<div class="bg-gray-900/70 border border-gray-800 rounded-3xl p-5">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-lg font-semibold">Your Guesses</h2>
							{#if guesses.length > 0}
								<button
									type="button"
									onclick={resetAll}
									class="text-xs text-red-400 hover:text-red-300"
								>
									Clear All
								</button>
							{/if}
						</div>
						{#if guesses.length === 0}
							<p class="text-sm text-gray-400">Add guesses to start filtering.</p>
						{:else}
							<div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
								{#each guesses as guess, index}
									<div class="bg-gray-800/80 border border-gray-700 rounded-2xl p-3">
										<div class="flex items-center justify-between mb-2">
											<div class="flex items-center gap-2">
												<div>
													<p class="text-sm font-semibold">{guess.artist.artist}</p>
													<p class="text-[10px] text-gray-400">#{guess.artist.index + 1}</p>
												</div>
											</div>
											<button
												type="button"
												onclick={() => (guesses = guesses.filter((_, i) => i !== index))}
												class="text-xs text-red-400 hover:text-red-300"
											>
												Remove
											</button>
										</div>
										<div class="grid grid-cols-3 gap-2 text-[10px]">
											{#each SPOTLE_ATTRIBUTES as attr}
												<div class="bg-gray-900/70 border border-gray-700 rounded-lg p-2 text-center">
													<p class="text-gray-400">{attr.shortLabel}</p>
													<p class="font-semibold">{attr.getDisplayValue(guess.artist)}</p>
													<p class="mt-1 text-gray-300">
														{guess.feedback[attr.key]}
														{#if attr.hasArrow}
															({guess.feedback[attr.arrowKey!]})
														{/if}
													</p>
												</div>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>

				<section class="lg:col-span-4 space-y-6">
					<div class="bg-gray-900/70 border border-gray-800 rounded-3xl p-5">
						<h2 class="text-lg font-semibold mb-4">Best Suggestions</h2>
						{#if remainingCandidates.length === 0}
							<p class="text-sm text-gray-400">No matches found.</p>
						{:else}
							<div class="space-y-2">
								{#each remainingCandidates.slice(0, 5) as artist, i}
									<button
										type="button"
										onclick={() => selectArtist(artist)}
										class="w-full flex items-center gap-3 bg-gray-800/80 border border-gray-700 rounded-2xl p-3 hover:bg-gray-700"
									>
										<div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
											{i + 1}
										</div>
										<div class="min-w-0 text-left">
											<p class="text-sm font-semibold truncate">{artist.artist}</p>
											<p class="text-xs text-gray-400">
												#{artist.index + 1} - {artist.genre}
											</p>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<div class="bg-gray-900/70 border border-gray-800 rounded-3xl p-5">
						<h3 class="text-sm font-semibold text-gray-300 mb-3">Remaining Candidates</h3>
						{#if remainingCandidates.length <= 15}
							<div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
								{#each remainingCandidates as artist}
									<button
										type="button"
										onclick={() => selectArtist(artist)}
										class="w-full flex items-center gap-2 bg-gray-800/70 border border-gray-700 rounded-xl p-2 hover:bg-gray-700"
									>
										<span class="text-xs font-medium truncate flex-1 text-left">{artist.artist}</span>
										<span class="text-[10px] text-gray-400">#{artist.index + 1}</span>
									</button>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-gray-400">{remainingCandidates.length} candidates remaining.</p>
						{/if}
					</div>
				</section>
			</div>
		{/if}
	</div>
</div>
