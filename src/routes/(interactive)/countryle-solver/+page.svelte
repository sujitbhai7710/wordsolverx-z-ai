<script lang="ts">
	import { onMount } from 'svelte';
	import { generateClues, getAllCountries, type Country, type GameClue } from '$lib/countryle';

	let { data } = $props();

	interface GuessResult {
		guess: Country;
		answer: { id: number; name: string };
		clues: GameClue[];
		isCorrect: boolean;
	}

	const countries = [...getAllCountries()].sort((a, b) => a.country.localeCompare(b.country));

	let searchTerm = $state('');
	let selectedCountry = $state<Country | null>(null);
	let guesses = $state<GuessResult[]>([]);
	let showDropdown = $state(false);
	let won = $state(false);
	let errorMessage = $state('');
	let dropdownRef = $state<HTMLDivElement | null>(null);

	const answerCountry = $derived.by(() =>
		data.answerId ? countries.find((country) => country.id === data.answerId) ?? null : null
	);

	const filteredCountries = $derived.by(() =>
		countries
			.filter((country) => country.country.toLowerCase().includes(searchTerm.toLowerCase()))
			.slice(0, 10)
	);

	function handleInputChange(value: string) {
		searchTerm = value;
		showDropdown = value.length > 0;
		errorMessage = '';
	}

	function handleCountrySelect(country: Country) {
		selectedCountry = country;
		searchTerm = country.country;
		showDropdown = false;
		errorMessage = '';
	}

	function handleGuess() {
		if (!selectedCountry || won) {
			return;
		}
		if (!answerCountry) {
			errorMessage = 'Could not load the daily Countryle answer for this build.';
			return;
		}

		const clueSet = generateClues(selectedCountry, answerCountry);
		const result: GuessResult = {
			guess: selectedCountry,
			answer: {
				id: answerCountry.id,
				name: answerCountry.country
			},
			clues: clueSet,
			isCorrect: selectedCountry.id === answerCountry.id
		};

		guesses = [result, ...guesses];
		searchTerm = '';
		selectedCountry = null;
		showDropdown = false;
		won = result.isCorrect;
	}

	function resetGame() {
		guesses = [];
		won = false;
		searchTerm = '';
		selectedCountry = null;
		showDropdown = false;
		errorMessage = '';
	}

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				showDropdown = false;
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});
</script>

<svelte:head>
	<title>Countryle Solver - Daily Country Helper | WordSolverX</title>
	<meta
		name="description"
		content="Play the migrated Countryle solver with the same daily-guess workflow, search dropdown, and clue card layout as the original helper."
	/>
	<link rel="canonical" href="https://wordsolver.tech/countryle-solver" />
</svelte:head>

<main class="min-h-screen bg-slate-950 p-4 text-white md:p-8">
	<div class="mx-auto max-w-4xl">
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-4xl font-bold md:text-5xl">
				<span class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
					Countryle
				</span>
				Helper
			</h1>
			<p class="text-slate-400">Your ultimate companion for the Countryle guessing game</p>
			<div class="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
				<span class="rounded-full bg-slate-800 px-3 py-1">
					{data.displayDate}
				</span>
				{#if data.gameNumber}
					<span class="rounded-full bg-slate-800 px-3 py-1">Game #{data.gameNumber}</span>
				{/if}
			</div>
		</div>

		<div class="mb-8 flex flex-wrap justify-center gap-2">
			<a
				class="flex items-center gap-2 rounded-xl bg-slate-700/50 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-600/50 hover:text-white"
				href="/countryle-answer-today"
			>
				Today
			</a>
			<a
				class="flex items-center gap-2 rounded-xl bg-slate-700/50 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-600/50 hover:text-white"
				href="/countryle-archive"
			>
				Archive
			</a>
			<a
				class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25"
				href="/countryle-solver"
			>
				Solver
			</a>
		</div>

		<div class="animate-fade-in">
			<div class="mb-6">
				<h2 class="mb-2 text-2xl font-bold text-white">Countryle Solver</h2>
				<p class="text-sm text-slate-400">Make guesses and get hints to find today's country.</p>
			</div>

			<div class="mb-6 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
				<div class="flex flex-col gap-4 md:flex-row">
					<div bind:this={dropdownRef} class="relative flex-1">
						<input
							class="w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-emerald-500"
							disabled={won}
							placeholder="Type a country name..."
							type="text"
							value={searchTerm}
							onfocus={() => (showDropdown = true)}
							oninput={(event) => handleInputChange((event.currentTarget as HTMLInputElement).value)}
						/>

						{#if showDropdown && searchTerm && !won}
							<div class="absolute left-0 right-0 top-full z-10 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-600 bg-slate-700 shadow-xl">
								{#if filteredCountries.length > 0}
									{#each filteredCountries as country}
										<button
											class="flex w-full items-center justify-between px-4 py-3 text-left text-white transition hover:bg-slate-600"
											type="button"
											onclick={() => handleCountrySelect(country)}
										>
											<span>{country.country}</span>
											<span class="text-sm text-slate-400">{country.continent}</span>
										</button>
									{/each}
								{:else}
									<div class="px-4 py-3 text-slate-400">No countries found</div>
								{/if}
							</div>
						{/if}
					</div>

					<button
						class={`rounded-xl px-6 py-3 font-semibold transition-all ${
							won
								? 'cursor-not-allowed bg-slate-600 text-slate-400'
								: selectedCountry
									? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
									: 'cursor-not-allowed bg-slate-600 text-slate-400'
						}`}
						disabled={!selectedCountry || won}
						type="button"
						onclick={handleGuess}
					>
						{won ? 'Won!' : 'Guess'}
					</button>
				</div>

				{#if selectedCountry && !won}
					<div class="mt-3 text-sm text-slate-400">
						Selected: <span class="font-semibold text-white">{selectedCountry.country}</span>
					</div>
				{/if}

				{#if errorMessage}
					<div class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
						{errorMessage}
					</div>
				{/if}
			</div>

			{#if won && guesses.length > 0 && guesses[0]?.answer}
				<div class="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-6 text-center">
					<div class="mb-3 text-4xl">Solved</div>
					<h3 class="mb-2 text-2xl font-bold text-white">Congratulations!</h3>
					<p class="text-emerald-300">
						You found today's country: <strong>{guesses[0].answer.name}</strong>
					</p>
					<p class="mt-2 text-slate-400">
						Solved in {guesses.length} guess{guesses.length > 1 ? 'es' : ''}.
					</p>
					<button
						class="mt-4 rounded-lg bg-emerald-500/20 px-6 py-2 text-emerald-300 transition hover:bg-emerald-500/30"
						type="button"
						onclick={resetGame}
					>
						Play Again
					</button>
				</div>
			{/if}

			{#if guesses.length > 0}
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-white">Your Guesses ({guesses.length})</h3>

					{#each guesses as guess, index}
						<div
							class={`overflow-hidden rounded-2xl border bg-slate-800/50 ${
								guess.isCorrect ? 'border-emerald-500' : 'border-slate-700/50'
							}`}
						>
							<div class="flex items-center justify-between bg-slate-700/30 px-6 py-4">
								<div class="flex items-center gap-3">
									<span class="text-sm text-slate-400">#{guesses.length - index}</span>
									<span class="text-xl font-bold text-white">{guess.guess.country}</span>
								</div>
								{#if guess.isCorrect}
									<span class="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">
										Correct!
									</span>
								{/if}
							</div>

							<div class="grid grid-cols-1 gap-px bg-slate-700/30 md:grid-cols-2 lg:grid-cols-3">
								{#each guess.clues as clue}
									<div class="bg-slate-800/50 px-4 py-3">
										<div class="mb-1 text-xs text-slate-400">{clue.property}</div>
										<div class="flex items-center justify-between gap-3">
											<span class="text-sm text-white">{clue.guessValue}</span>
											<span class={`text-sm font-medium ${clue.isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
												{clue.result}
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<div class="mt-8 rounded-xl border border-slate-700/30 bg-slate-800/30 p-6">
				<h4 class="mb-3 font-semibold text-white">How to Play</h4>
				<ul class="space-y-2 text-sm text-slate-400">
					<li>Type a country name and click Guess to make a guess.</li>
					<li>Each guess gives you clues about how close you are.</li>
					<li>Green clues mean you got that category right.</li>
					<li>Yellow clues show whether you need to go higher, lower, or elsewhere.</li>
					<li>Use the clues to narrow down the correct country.</li>
				</ul>
			</div>
		</div>

		<footer class="mt-12 text-center text-sm text-slate-500">
			<p>Countryle Helper is not affiliated with countryle.com</p>
			<p class="mt-1">This solver page is statically rebuilt with the daily answer window.</p>
		</footer>
	</div>
</main>
