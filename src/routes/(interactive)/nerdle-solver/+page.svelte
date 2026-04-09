<script lang="ts">
	import { onMount } from 'svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	type GameMode = 'micro' | 'mini' | 'midi' | 'classic' | 'maxi';
	type Feedback = 0 | 1 | 2;

	interface GuessRow {
		equation: string;
		feedback: Feedback[];
	}

	interface Suggestion {
		eq: string;
		entropy: number;
	}

	const NERDLE_SOLVER_API_URL = 'https://solver.nerdle.workers.dev';
	const SUPERSCRIPT_2 = '\u00B2';
	const SUPERSCRIPT_3 = '\u00B3';

	const MODE_CONFIG = {
		micro: { length: 5, name: 'Micro', example: '2+1=3', guesses: 6 },
		mini: { length: 6, name: 'Mini', example: '4*7=28', guesses: 6 },
		midi: { length: 7, name: 'Midi', example: '6-1*4=2', guesses: 6 },
		classic: { length: 8, name: 'Classic', example: '43-28=15', guesses: 6 },
		maxi: { length: 10, name: 'Maxi', example: '239-171=68', guesses: 6 }
	} as const;

	const FEEDBACK_STYLES = {
		2: 'bg-green-500 border-green-600 text-white',
		1: 'bg-yellow-400 border-yellow-500 text-slate-950',
		0: 'bg-gray-400 border-gray-500 text-white'
	} as const;

	const VALID_CHARS_BASIC = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '='];
	const VALID_CHARS_MAXI = [...VALID_CHARS_BASIC, '(', ')', SUPERSCRIPT_2, SUPERSCRIPT_3];
	const MODE_ENTRIES = Object.entries(MODE_CONFIG) as Array<
		[GameMode, (typeof MODE_CONFIG)[GameMode]]
	>;

	let mode = $state<GameMode>('classic');
	let guesses = $state<GuessRow[]>([]);
	let currentInput = $state('');
	let copiedEq = $state<string | null>(null);
	let suggestions = $state<Suggestion[]>([]);
	let remaining = $state(0);
	let totalCount = $state(0);
	let isLoading = $state(true);
	let isCalculating = $state(false);
	let isCheckingGuess = $state(false);
	let loadError = $state<string | null>(null);
	let requestToken = 0;

	const currentMode = $derived(MODE_CONFIG[mode]);
	const targetLength = $derived(currentMode.length);
	const validChars = $derived(mode === 'maxi' ? VALID_CHARS_MAXI : VALID_CHARS_BASIC);
	const topSuggestion = $derived(suggestions[0] ?? null);
	const moreSuggestions = $derived(suggestions.slice(1));
	const isDuplicateGuess = $derived(
		currentInput.length > 0 && guesses.some((guess) => guess.equation === currentInput)
	);
	const canAddGuess = $derived(currentInput.length === targetLength && !isDuplicateGuess);
	const modeSelectDisabled = $derived(guesses.length > 0 || isLoading || isCalculating);
	const keypadRows = $derived(
		mode === 'maxi'
			? [
					['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
					['+', '-', '*', '/', '=', '(', ')', SUPERSCRIPT_2, SUPERSCRIPT_3]
				]
			: [
					['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
					['+', '-', '*', '/', '=']
				]
	);
	const inputMessage = $derived.by(() => {
		if (currentInput.length === 0) {
			return { tone: 'info', text: `Enter a ${targetLength}-character equation.` };
		}

		if (currentInput.length < targetLength) {
			return {
				tone: 'info',
				text: `${targetLength - currentInput.length} more character${targetLength - currentInput.length === 1 ? '' : 's'} needed.`
			};
		}

		if (isCheckingGuess) {
			return { tone: 'info', text: 'Checking this equation with the solver...' };
		}

		if (isDuplicateGuess) {
			return { tone: 'warning', text: 'This equation is already in your guess list.' };
		}

		return { tone: 'success', text: 'Ready to add. Press Enter or tap Add Guess.' };
	});

	function getInputTileClass(length: number, filled: boolean): string {
		const size = length <= 6 ? 'w-12 h-14 text-2xl' : length <= 8 ? 'w-11 h-12 text-xl' : 'w-9 h-11 text-base';
		return `${size} rounded-lg border-2 font-bold flex items-center justify-center ${
			filled ? 'bg-white border-green-400 text-gray-900 shadow-sm' : 'bg-gray-100 border-gray-300 text-gray-300'
		}`;
	}

	function getGuessTileClass(length: number, feedback: Feedback): string {
		const size = length <= 6 ? 'w-11 h-12 text-xl' : length <= 8 ? 'w-10 h-11 text-lg' : 'w-9 h-10 text-base';
		return `${size} rounded-md border-2 font-bold flex items-center justify-center ${FEEDBACK_STYLES[feedback]}`;
	}

	function getSuggestionTileClass(length: number): string {
		const size = length <= 6 ? 'w-9 h-10 text-lg' : length <= 8 ? 'w-8 h-9 text-base' : 'w-7 h-8 text-sm';
		return `${size} rounded-md border-2 border-gray-300 bg-white text-gray-900 font-bold flex items-center justify-center`;
	}

	function normalizeEquationInput(value: string): string {
		return Array.from(value)
			.filter((character) => validChars.includes(character))
			.slice(0, targetLength)
			.join('');
	}

	function cycleFeedback(value: Feedback): Feedback {
		if (value === 0) return 2;
		if (value === 2) return 1;
		return 0;
	}

	function feedbackLabel(value: Feedback): string {
		if (value === 2) return 'Correct';
		if (value === 1) return 'Present';
		return 'Absent';
	}

	async function fetchSuggestions(currentGuesses: GuessRow[], nextMode: GameMode, token: number) {
		isCalculating = true;

		try {
			const response = await fetch(`${NERDLE_SOLVER_API_URL}/solve`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mode: nextMode, guesses: currentGuesses })
			});
			const data = await response.json().catch(() => null);

			if (token !== requestToken || nextMode !== mode) {
				return;
			}

			if (!response.ok || !data?.success) {
				throw new Error(data?.error ?? data?.message ?? 'Failed to calculate suggestions.');
			}

			suggestions = data.suggestions ?? [];
			remaining = data.remaining ?? 0;
			totalCount = data.total ?? 0;
			loadError = null;
		} catch (error) {
			if (token !== requestToken || nextMode !== mode) {
				return;
			}

			suggestions = [];
			remaining = 0;
			loadError = error instanceof Error ? error.message : 'Failed to calculate suggestions.';
		} finally {
			if (token === requestToken && nextMode === mode) {
				isCalculating = false;
			}
		}
	}

	async function validateEquation(nextMode: GameMode, equation: string) {
		const response = await fetch(`${NERDLE_SOLVER_API_URL}/validate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ mode: nextMode, equation })
		});
		const data = await response.json().catch(() => null);

		if (!response.ok || !data?.success) {
			throw new Error(data?.error ?? data?.message ?? 'Failed to validate the equation.');
		}

		return Boolean(data.valid);
	}

	async function loadModeData(nextMode: GameMode) {
		const token = ++requestToken;
		isLoading = true;
		loadError = null;
		currentInput = '';
		guesses = [];
		suggestions = [];
		remaining = 0;
		totalCount = 0;

		try {
			await fetchSuggestions([], nextMode, token);
		} catch (error) {
			if (token === requestToken && nextMode === mode) {
				loadError = error instanceof Error ? error.message : 'Failed to load mode data.';
			}
		} finally {
			if (token === requestToken && nextMode === mode) {
				isLoading = false;
			}
		}
	}

	function handleModeChange(value: string) {
		const nextMode = value as GameMode;
		if (nextMode === mode || modeSelectDisabled) {
			return;
		}

		mode = nextMode;
		void loadModeData(nextMode);
	}

	function handleModeSelectChange(event: Event) {
		handleModeChange((event.target as HTMLSelectElement).value);
	}

	function handleEquationInput(value: string) {
		currentInput = normalizeEquationInput(value);
		loadError = null;
	}

	function handleEquationTextInput(event: Event) {
		handleEquationInput((event.target as HTMLInputElement).value);
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && canAddGuess && !isCheckingGuess) {
			event.preventDefault();
			void addGuess(currentInput);
		}
	}

	async function addGuess(
		equation: string = currentInput,
		options: { skipValidation?: boolean } = {}
	) {
		const nextMode = mode;
		const nextLength = targetLength;

		if (equation.length !== nextLength || guesses.some((guess) => guess.equation === equation)) {
			return;
		}

		try {
			if (!options.skipValidation) {
				isCheckingGuess = true;
				const valid = await validateEquation(nextMode, equation);
				if (!valid) {
					loadError = `"${equation}" is not a valid ${MODE_CONFIG[nextMode].name} equation.`;
					return;
				}
			}

			if (mode !== nextMode || guesses.some((guess) => guess.equation === equation)) {
				return;
			}

			guesses = [
				...guesses,
				{ equation, feedback: new Array(nextLength).fill(0) as Feedback[] }
			];
			currentInput = '';
			loadError = null;
		} catch (error) {
			loadError = error instanceof Error ? error.message : 'Failed to validate the equation.';
		} finally {
			isCheckingGuess = false;
		}
	}

	function toggleFeedback(guessIndex: number, charIndex: number) {
		guesses = guesses.map((guess, index) => {
			if (index !== guessIndex) return guess;
			const nextFeedback = [...guess.feedback];
			nextFeedback[charIndex] = cycleFeedback(nextFeedback[charIndex]);
			return { ...guess, feedback: nextFeedback };
		});
	}

	function clearInput() {
		currentInput = '';
	}

	function handleBackspace() {
		currentInput = currentInput.slice(0, -1);
	}

	function handleKeypadPress(character: string) {
		if (currentInput.length >= targetLength) {
			return;
		}

		handleEquationInput(`${currentInput}${character}`);
	}

	function removeLastGuess() {
		if (guesses.length === 0) return;
		guesses = guesses.slice(0, -1);
	}

	function resetSolver() {
		guesses = [];
		currentInput = '';
		loadError = null;
		void fetchSuggestions([], mode, requestToken);
	}

	function refreshSolver() {
		loadError = null;
		void fetchSuggestions(guesses, mode, requestToken);
	}

	function addCurrentGuess() {
		void addGuess(currentInput);
	}

	function addSuggestedGuess(equation: string) {
		void addGuess(equation, { skipValidation: true });
	}

	function getInputMessageClass(tone: 'info' | 'warning' | 'success'): string {
		if (tone === 'success') return 'mt-3 text-center text-sm text-green-700';
		if (tone === 'warning') return 'mt-3 text-center text-sm text-amber-700';
		return 'mt-3 text-center text-sm text-gray-600';
	}

	async function copyEquation(equation: string) {
		try {
			await navigator.clipboard.writeText(equation);
			copiedEq = equation;
			window.setTimeout(() => {
				if (copiedEq === equation) copiedEq = null;
			}, 1500);
		} catch {
			copiedEq = null;
		}
	}

	onMount(() => {
		void loadModeData(mode);

		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement ||
				event.ctrlKey ||
				event.metaKey ||
				event.altKey
			) {
				return;
			}

			if (event.key === 'Enter' && canAddGuess && !isCheckingGuess) {
				void addGuess(currentInput);
				return;
			}

			if (event.key === 'Backspace') {
				handleBackspace();
				return;
			}

			if (validChars.includes(event.key) && currentInput.length < targetLength) {
				handleEquationInput(`${currentInput}${event.key}`);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebApplication',
				name: 'Nerdle Solver',
				description:
					'Nerdle solver for Micro, Mini, Midi, Classic, and Maxi with direct worker solving and a Wordle-style interface.',
				url: 'https://wordsolver.tech/nerdle-solver',
				applicationCategory: 'GameApplication',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
			}
		]
	});
	const jsonLdScript = `<script type="application/ld+json">${jsonLd}<\/script>`;
</script>

<svelte:head>
	<title>Nerdle Solver All Modes | Micro, Mini, Midi, Classic And Maxi</title>
	<meta
		name="description"
		content="Use the WordSolverX Nerdle Solver for Micro, Mini, Midi, Classic, and Maxi with direct worker solving and a cleaner Wordle-style interface."
	/>
	<link rel="canonical" href="https://wordsolver.tech/nerdle-solver" />
	<meta property="og:title" content="Nerdle Solver All Modes" />
	<meta
		property="og:description"
		content="Solve every Nerdle mode with the original logic and a cleaner Wordle-style layout."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://wordsolver.tech/nerdle-solver" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Nerdle Solver All Modes" />
	<meta
		name="twitter:description"
		content="Solve Nerdle equations with direct worker requests and a cleaner Wordle-style UI."
	/>
	{@html jsonLdScript}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
	<section class="bg-gradient-to-r from-green-600 to-emerald-600 py-14 shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<h1 class="text-4xl font-extrabold text-white sm:text-6xl tracking-tight">Nerdle Solver</h1>
			<p class="mt-5 max-w-3xl mx-auto text-xl text-white/95 font-medium leading-relaxed">
				Solve Micro, Mini, Midi, Classic, and Maxi Nerdle with the same original logic, direct worker requests, and a layout that matches the Wordle solver more closely.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-4 text-sm font-bold text-green-100">
				<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">5 Modes</span>
				<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">Direct Worker Solve</span>
				<span class="bg-white/10 px-4 py-2 rounded-full border border-white/20">No Frontend Equation Lists</span>
			</div>
		</div>
	</section>

	<div class="max-w-7xl mx-auto py-12 px-4">
		<main class="max-w-2xl mx-auto">
			<div class="mb-6">
				<Breadcrumbs />
			</div>

			<div class="text-center mb-10">
				<h2 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent mb-3">
					Nerdle Solver
				</h2>
				<p class="text-gray-600 text-lg">
					Choose a mode, enter an equation, then tap the tiles to match the feedback from
					Nerdle.
				</p>
			</div>

			{#if loadError}
				<div class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
					<p class="font-bold">Something needs attention</p>
					<p class="mt-1 text-sm">{loadError}</p>
				</div>
			{/if}

			{#if isLoading}
				<div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
					<div class="w-10 h-10 mx-auto border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
					<p class="mt-4 text-lg font-semibold text-gray-800">Loading {currentMode.name} mode...</p>
					<p class="mt-1 text-gray-600">Getting the opening suggestions from the solver worker.</p>
				</div>
			{:else}
				{#if guesses.length === 0}
					<div class="mb-8">
						<div class="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200">
							<div class="block text-sm font-bold text-blue-800 uppercase tracking-wider mb-4">
								Puzzle Mode
							</div>
							<div class="rounded-2xl bg-blue-100/90 p-1.5">
								<div class="rounded-xl border border-blue-200 bg-white px-4 py-4">
									<label
										for="nerdle-mode"
										class="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2"
									>
										Select mode
									</label>
									<select
										id="nerdle-mode"
										class="w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-base font-bold text-gray-800 shadow-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200"
										value={mode}
										onchange={handleModeSelectChange}
										disabled={modeSelectDisabled}
									>
										{#each MODE_ENTRIES as [modeKey, config]}
											<option value={modeKey}>{config.name} ({config.length} chars)</option>
										{/each}
									</select>
								</div>
							</div>
							<div class="mt-4 grid gap-3 sm:grid-cols-3">
								<div class="rounded-xl border border-blue-100 bg-white px-4 py-4 text-center">
									<p class="text-xs font-bold uppercase tracking-wide text-gray-500">Current Mode</p>
									<p class="mt-2 text-xl font-black text-gray-900">{currentMode.name}</p>
								</div>
								<div class="rounded-xl border border-blue-100 bg-white px-4 py-4 text-center">
									<p class="text-xs font-bold uppercase tracking-wide text-gray-500">Equation Length</p>
									<p class="mt-2 text-xl font-black text-gray-900">{targetLength} chars</p>
								</div>
								<div class="rounded-xl border border-blue-100 bg-white px-4 py-4 text-center">
									<p class="text-xs font-bold uppercase tracking-wide text-gray-500">Equation Pool</p>
									<p class="mt-2 text-xl font-black text-gray-900">{totalCount.toLocaleString()}</p>
								</div>
							</div>
							<div class="mt-4 rounded-xl border border-blue-100 bg-white/80 px-4 py-3 text-sm text-gray-600">
								Start with an equation like
								<span class="font-mono font-bold text-gray-900">{currentMode.example}</span>
								and the worker will return ranked next guesses for the selected mode.
							</div>
						</div>
					</div>
				{/if}

				<div class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
					<div class="flex flex-wrap items-start justify-between gap-4 mb-5">
						<div>
							<div class="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">
								Enter Equation
							</div>
							<p class="text-sm text-gray-600">
								Type or tap characters below, then add the equation to your board.
							</p>
						</div>
						<div class="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
							<span class="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-green-700">
								{currentMode.name}
							</span>
							<span class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700">
								{targetLength} chars
							</span>
							<span class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700">
								{remaining.toLocaleString()} remaining
							</span>
						</div>
					</div>

					<div class="relative w-full max-w-md mx-auto">
						<input
							type="text"
							value={currentInput}
							oninput={handleEquationTextInput}
							placeholder={currentMode.example}
							class="w-full px-6 py-4 text-center text-3xl font-black tracking-widest bg-gradient-to-br from-white to-gray-50 rounded-2xl border-[3px] border-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all shadow-lg hover:shadow-xl text-gray-900 font-mono"
							maxlength={targetLength}
							autocomplete="off"
							autocorrect="off"
							autocapitalize="off"
							spellcheck="false"
							onkeydown={handleInputKeydown}
						/>
						<button
							type="button"
							aria-label="Clear equation input"
							onclick={clearInput}
							class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
						>
							Clear
						</button>
					</div>
					<div class={getInputMessageClass(inputMessage.tone)}>
						{inputMessage.text}
					</div>
					<div class="mt-5 flex justify-center">
						<div class="flex flex-wrap justify-center gap-1.5 rounded-2xl bg-gray-50 px-4 py-4 border border-gray-200">
							{#each Array.from({ length: targetLength }) as _, index}
								<div class={getInputTileClass(targetLength, Boolean(currentInput[index]))}>
									{currentInput[index] || ''}
								</div>
							{/each}
						</div>
					</div>

					<div class="mt-6 space-y-2">
					{#each keypadRows as row, rowIndex}
						<div class="flex flex-wrap justify-center gap-2">
							{#each row as key}
								<button
									type="button"
									onclick={() => handleKeypadPress(key)}
									class={`min-w-12 rounded-xl border-2 px-3 py-3 text-sm font-bold shadow-sm transition-all ${
										key === '='
											? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
											: 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
									}`}
								>
									{key === SUPERSCRIPT_2 ? 'x^2' : key === SUPERSCRIPT_3 ? 'x^3' : key}
								</button>
							{/each}
							{#if rowIndex === keypadRows.length - 1}
								<button
									type="button"
									onclick={handleBackspace}
									class="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-sm hover:bg-red-100"
								>
									DEL
								</button>
							{/if}
						</div>
					{/each}
					</div>

					<div class="mt-6 flex justify-center gap-3 flex-wrap">
					<button
						onclick={addCurrentGuess}
						disabled={!canAddGuess || isCheckingGuess}
						class="flex items-center space-x-2 px-5 py-3 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span>{isCheckingGuess ? 'Checking...' : 'Add Guess'}</span>
					</button>
					<button
						onclick={resetSolver}
						class="flex items-center space-x-2 px-5 py-3 text-sm font-bold text-red-600 hover:text-red-700 bg-white hover:bg-red-50 rounded-xl border-2 border-red-200 transition-all shadow-sm hover:shadow-md"
					>
						<span>Reset Solver</span>
					</button>
					</div>
				</div>

				{#if guesses.length > 0}
					<div class="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 p-6 shadow-lg">
						<div class="flex flex-wrap items-start justify-between gap-3 mb-5">
							<div>
								<div class="block text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">
									Set Nerdle Feedback
								</div>
								<p class="text-sm text-gray-600">
									Tap each tile until it matches the result from the game.
								</p>
							</div>
							<button
								onclick={removeLastGuess}
								class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
							>
								Remove Last Entry
							</button>
						</div>
						<div class="space-y-4">
							{#each guesses as guess, guessIndex}
								<div class="rounded-2xl border border-amber-100 bg-white/90 p-4">
									<div class="flex justify-center gap-1.5 flex-wrap">
										{#each guess.equation.split('') as char, charIndex}
											<button
												type="button"
												onclick={() => toggleFeedback(guessIndex, charIndex)}
												class={getGuessTileClass(targetLength, guess.feedback[charIndex])}
											>
												{char}
											</button>
										{/each}
									</div>
									<div class="mt-2 text-center text-xs text-gray-500">
										{#each guess.feedback as value, feedbackIndex}
											<span class="inline-block mx-1">{feedbackIndex + 1}: {feedbackLabel(value)}</span>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="mb-8">
					<button
						onclick={refreshSolver}
						disabled={isCalculating}
						class="w-full max-w-md mx-auto block py-5 px-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-black text-2xl rounded-2xl shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						{isCalculating ? 'Calculating...' : guesses.length > 0 ? 'Calculate Best Equation' : 'Get Opening Suggestions'}
					</button>
				</div>

				<div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
					<div class="flex flex-wrap items-center justify-between gap-3 mb-5">
						<div>
							<h3 class="text-2xl font-black text-gray-900">Solver Suggestions</h3>
							<p class="text-gray-600 mt-1">{suggestions.length} shown - {remaining.toLocaleString()} possible equations</p>
						</div>
						<div class="grid grid-cols-2 gap-2 text-center">
							<div class="rounded-xl bg-gray-50 px-4 py-3 border border-gray-200">
								<p class="text-xs font-bold uppercase tracking-wide text-gray-500">Remaining</p>
								<p class="mt-1 text-xl font-black text-gray-900">{remaining.toLocaleString()}</p>
							</div>
							<div class="rounded-xl bg-gray-50 px-4 py-3 border border-gray-200">
								<p class="text-xs font-bold uppercase tracking-wide text-gray-500">Pool</p>
								<p class="mt-1 text-xl font-black text-gray-900">{totalCount.toLocaleString()}</p>
							</div>
						</div>
					</div>

					{#if topSuggestion}
						<div class="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 mb-4">
							<div class="flex items-center justify-between gap-3 mb-4">
								<div>
									<p class="text-sm font-bold uppercase tracking-wide text-green-700">Top Pick</p>
									<p class="text-xl font-black text-gray-900 mt-1">{topSuggestion.eq}</p>
									<p class="mt-1 text-sm text-gray-600">Best next guess for the current board.</p>
								</div>
								<div class="rounded-xl bg-white border border-green-100 px-4 py-2 text-right">
									<p class="text-xs font-bold uppercase tracking-wide text-gray-500">Entropy</p>
									<p class="text-lg font-black text-gray-900 mt-1">{topSuggestion.entropy.toFixed(2)}</p>
								</div>
							</div>
							<div class="flex justify-center gap-1 mb-4">
								{#each topSuggestion.eq.split('') as char}
									<div class={getSuggestionTileClass(targetLength)}>{char}</div>
								{/each}
							</div>
							<div class="grid gap-3 sm:grid-cols-2">
								<button
									onclick={() => addSuggestedGuess(topSuggestion.eq)}
									class="rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 transition-all"
								>
									Use This Guess
								</button>
								<button
									onclick={() => void copyEquation(topSuggestion.eq)}
									class="rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-3 transition-all"
								>
									{copiedEq === topSuggestion.eq ? 'Copied' : 'Copy Equation'}
								</button>
							</div>
						</div>

						{#if moreSuggestions.length > 0}
							<div class="space-y-3">
								{#each moreSuggestions as item, index}
									<div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
										<div class="flex items-center gap-3">
											<div class="w-10 text-center text-sm font-black text-gray-500">#{index + 2}</div>
											<div class="flex flex-1 flex-wrap items-center justify-center gap-1">
												{#each item.eq.split('') as char}
													<div class={getSuggestionTileClass(targetLength)}>{char}</div>
												{/each}
											</div>
										</div>
										<div class="mt-3 flex flex-wrap items-center justify-between gap-3">
											<div class="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
												Entropy {item.entropy.toFixed(2)}
											</div>
											<div class="flex gap-2">
												<button
													onclick={() => addSuggestedGuess(item.eq)}
													class="rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
												>
													Use
												</button>
												<button
													onclick={() => void copyEquation(item.eq)}
													class="rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
												>
													{copiedEq === item.eq ? 'Copied' : 'Copy'}
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					{:else}
						<div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
							<p class="text-lg font-bold text-gray-900">No suggestions yet</p>
							<p class="text-gray-600 mt-2">Get the opening suggestions or add feedback to narrow the equation pool.</p>
						</div>
					{/if}
				</div>
			{/if}
		</main>
	</div>
</div>
