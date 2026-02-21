<script lang="ts">
	import { onMount } from 'svelte';
	import WordGrid from './WordGrid.svelte';
	import WordLengthSelector from './WordLengthSelector.svelte';
	import Suggestions from './Suggestions.svelte';

	interface SolverSuggestion {
		word: string;
		score: number;
		expected_guesses?: number;
	}

	interface SolverResponse {
		error?: string;
		suggestions?: SolverSuggestion[];
		possibilities?: number;
	}

	const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
		const toast = document.createElement('div');
		toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
			type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
		}`;
		toast.textContent = message;
		document.body.appendChild(toast);
		setTimeout(() => toast.remove(), 3000);
	};

	let currentWord = $state('');
	let history = $state<string[]>([]);
	let correctness = $state<number[]>([]);
	let currentSelection = $state(0);
	let suggestion = $state<string | null>(null);
	let suggestions = $state<SolverSuggestion[]>([]);
	let possibilities = $state(0);
	let loading = $state(false);
	let showResult = $state(false);
	let solverInitializing = $state(true);
	let wordLength = $state(5);
	let isHardMode = $state(false);
	let useLimitNYT = $state(true);
	let worker = $state<Worker | null>(null);

	let suggestionsRef = $state<HTMLDivElement | null>(null);
	let gameAreaRef = $state<HTMLDivElement | null>(null);

	function resetState() {
		currentWord = '';
		history = [];
		correctness = Array(wordLength).fill(1);
		currentSelection = 0;
		suggestion = null;
		suggestions = [];
		showResult = false;
	}

	function handleWordLengthChange(length: number) {
		wordLength = length;
		localStorage.setItem('wordLength', length.toString());
		localStorage.setItem('useLimitNYT', useLimitNYT.toString());
		resetState();
	}

	function toggleHardMode() {
		isHardMode = !isHardMode;
		localStorage.setItem('isHardMode', isHardMode.toString());
	}

	function handleCellTap(index: number) {
		currentSelection = index;
	}

	function handleCellStateChange(index: number, state: number) {
		const next = [...correctness];
		next[index] = state;
		correctness = next;
	}

	function submitGuess() {
		if (currentWord.length !== wordLength) {
			showToast(`Please enter a ${wordLength}-letter word`, 'error');
			return;
		}

		if (correctness.every((c) => c === 3)) {
			showToast("You've solved the puzzle!", 'success');
			showResult = true;
			return;
		}

		if (!worker) {
			showToast('Solver is still initializing, please wait', 'error');
			return;
		}

		loading = true;
		const guessInfo = `${currentWord}:${correctness.join('')}`;
		const newHistory = [...history, guessInfo];
		const payload = newHistory.join(',');

		worker.onmessage = (event: MessageEvent<SolverResponse | string>) => {
			const data = event.data;
			if (typeof data !== 'string' && data && data.error) {
				showToast(data.error, 'error');
				loading = false;
				return;
			}

			loading = false;
			history = newHistory;
			correctness = Array(wordLength).fill(1);
			currentWord = '';
			currentSelection = 0;

			if (typeof data === 'string') {
				suggestion = data;
				suggestions = [];
				possibilities = 0;
			} else if (data?.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
				suggestions = data.suggestions;
				possibilities = data.possibilities || 0;
				suggestion = data.suggestions[0].word;
			} else {
				suggestion = null;
				suggestions = [];
				possibilities = 0;
			}

			showResult = true;
		};

		worker.postMessage({
			state: payload,
			isHardMode,
			useLimitNYT
		});
	}

	function useSuggestion(selectedWord?: string) {
		const wordToUse = typeof selectedWord === 'string' ? selectedWord : suggestion;
		if (!wordToUse) return;

		currentWord = wordToUse;
		correctness = Array(wordLength).fill(1);
		currentSelection = 0;
		showResult = false;
		suggestion = null;
		suggestions = [];

		setTimeout(() => {
			gameAreaRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 100);
	}

	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value.toLowerCase().replace(/[^a-z]/g, '');
		if (value.length <= wordLength) {
			currentWord = value;
			if (value.length === wordLength) {
				correctness = Array(wordLength).fill(1);
			}
		}
	}

	function clearInput() {
		currentWord = '';
		correctness = Array(wordLength).fill(1);
	}

	function goBack() {
		if (history.length === 0) return;

		const newHistory = [...history];
		const lastGuess = newHistory.pop();
		if (!lastGuess) return;

		history = newHistory;
		const [word, corr] = lastGuess.split(':');
		currentWord = word ?? '';
		correctness = (corr ?? '').split('').map((c) => Number.parseInt(c, 10));
		showResult = false;
		suggestion = null;
		suggestions = [];
	}

	$effect(() => {
		if (showResult && suggestions.length > 0 && suggestionsRef) {
			const timer = setTimeout(() => {
				suggestionsRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
			return () => clearTimeout(timer);
		}
	});

	onMount(() => {
		const savedLength = localStorage.getItem('wordLength');
		if (savedLength) {
			const parsed = Number.parseInt(savedLength, 10);
			if (!Number.isNaN(parsed)) {
				wordLength = parsed;
			}
		}

		if (localStorage.getItem('useLimitNYT')) {
			useLimitNYT = localStorage.getItem('useLimitNYT') === 'true';
		}

		const savedHardMode = localStorage.getItem('isHardMode');
		if (savedHardMode) {
			isHardMode = savedHardMode === 'true';
		}

		resetState();

		let workerInstance: Worker | null = null;
		try {
			workerInstance = new Worker(new URL('../../workers/solver.worker.ts', import.meta.url), {
				type: 'classic'
			});
			solverInitializing = true;

			workerInstance.postMessage(null);
			workerInstance.onmessage = (event: MessageEvent<unknown>) => {
				if (event.data === null) {
					worker = workerInstance;
					solverInitializing = false;
				}
			};

			workerInstance.onerror = (error: ErrorEvent) => {
				showToast(`Failed to initialize solver: ${error.message}`, 'error');
				solverInitializing = false;
			};
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			showToast(`Failed to initialize solver: ${message}`, 'error');
			solverInitializing = false;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (showResult || solverInitializing) return;

			if (
				event.key === 'Enter' ||
				event.key === 'Backspace' ||
				/^[a-zA-Z]$/.test(event.key)
			) {
				event.preventDefault();
			}

			if (event.key === 'Enter') {
				submitGuess();
			} else if (event.key === 'Backspace') {
				currentWord = currentWord.slice(0, -1);
			} else if (/^[a-zA-Z]$/.test(event.key) && currentWord.length < wordLength) {
				currentWord = `${currentWord}${event.key.toLowerCase()}`;
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			workerInstance?.terminate();
		};
	});
</script>

<div class="flex-1 container mx-auto px-4 py-8">
	<main class="max-w-2xl mx-auto">
		<div class="text-center mb-10">
			<h2
				class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent mb-3"
			>
				Wordle Solver Pro
			</h2>
			<p class="text-gray-600 text-lg">Find the solution with fewest attempts</p>
		</div>

		{#if history.length === 0}
			<div class="mb-8 space-y-6">
				<div class="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
					<div class="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
						&#x1F4CF; Word Length
					</div>
					<div class="flex justify-center">
						<WordLengthSelector currentLength={wordLength} onChange={handleWordLengthChange} />
					</div>
				</div>

				<div class="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200">
					<div class="block text-sm font-bold text-blue-800 uppercase tracking-wider mb-4">
						&#x1F3AF; Answer Set
					</div>
					<div class="flex bg-blue-100 p-1.5 rounded-xl shadow-inner">
						<button
							onclick={() => {
								useLimitNYT = true;
								localStorage.setItem('useLimitNYT', useLimitNYT.toString());
							}}
							class="flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all duration-200 transform {useLimitNYT
								? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105'
								: 'text-gray-600 hover:text-gray-800 hover:bg-white/50'}"
						>
							Limited Words List
						</button>
						<button
							onclick={() => {
								useLimitNYT = false;
								localStorage.setItem('useLimitNYT', useLimitNYT.toString());
							}}
							class="flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all duration-200 transform {!useLimitNYT
								? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105'
								: 'text-gray-600 hover:text-gray-800 hover:bg-white/50'}"
						>
							All Words
						</button>
					</div>
				</div>

				<div class="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border border-purple-200">
					<div class="flex justify-center">
						<label class="flex items-center cursor-pointer group">
							<div class="relative">
				<input
					type="checkbox"
					class="sr-only"
					checked={isHardMode}
					onchange={toggleHardMode}
								/>
								<div
									class="block w-14 h-7 rounded-full transition-all duration-300 shadow-inner {isHardMode
										? 'bg-gradient-to-r from-orange-400 to-red-500'
										: 'bg-gray-300'}"
								></div>
								<div
									class="dot absolute left-1 top-0.5 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md {isHardMode
										? 'transform translate-x-7'
										: ''}"
								></div>
							</div>
							<div class="ml-4 text-base font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
								&#x1F525; Hard Mode
							</div>
						</label>
					</div>
				</div>
			</div>
		{/if}

		<div class="mb-8" bind:this={gameAreaRef}>
			<div class="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 text-center">
				&#x270D;&#xFE0F; Type Your Guess
			</div>
			<div class="relative w-full max-w-md mx-auto">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					value={currentWord}
					oninput={handleInputChange}
					placeholder="Enter your word..."
					class="w-full px-6 py-4 text-center text-3xl font-black uppercase tracking-widest bg-gradient-to-br from-white to-gray-50 rounded-2xl border-3 border-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all shadow-lg hover:shadow-xl text-gray-900"
					maxlength={wordLength}
					autofocus
				/>
				<button
					onclick={clearInput}
					class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-2xl hover:scale-110 transform"
					title="Clear"
				>
					&#x2715;
				</button>
			</div>
		</div>

		{#if history.length > 0}
			<div class="w-full mb-6">
				<h3 class="text-sm font-medium mb-3 text-gray-700 sr-only">Previous Guesses:</h3>
				<div class="flex flex-col gap-2">
					{#each history as item}
						{@const [word, pattern] = item.split(':')}
						<div class="flex justify-center gap-1">
							{#each (word ?? '').split('') as letter, i}
								{@const state = Number.parseInt(pattern?.[i] ?? '1', 10)}
								{@const cellClass = state === 1
									? 'bg-gray-400 border-gray-500 text-white'
									: state === 2
										? 'bg-yellow-400 border-yellow-500 text-white'
										: state === 3
											? 'bg-green-500 border-green-600 text-white'
											: 'bg-gray-200 border-gray-300'}
								<div
									class="flex items-center justify-center font-bold rounded-md border-2 {cellClass} {wordLength > 8
										? 'w-8 h-8 text-sm'
										: wordLength > 6
											? 'w-10 h-10 text-base'
											: 'w-12 h-12 text-lg'}"
								>
									{letter.toUpperCase()}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if !showResult}
			<div class="w-full mb-6">
				<WordGrid
					word={currentWord}
					wordLength={wordLength}
					correctness={correctness}
					currentSelection={currentSelection}
					onTap={handleCellTap}
					onDoubleTap={handleCellStateChange}
				/>
			</div>
		{/if}

		{#if history.length > 0}
			<div class="flex justify-center mb-6">
				<button
					onclick={goBack}
					class="flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-xl border-2 border-gray-300 transition-all shadow-sm hover:shadow-md"
				>
					<span>&larr;</span>
					<span>Remove Last Entry</span>
				</button>
			</div>
		{/if}

		<div class="mb-8">
			<button
				onclick={submitGuess}
				disabled={loading || currentWord.length !== wordLength}
				class="w-full max-w-md mx-auto block py-5 px-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-black text-2xl rounded-2xl shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-4"
			>
				{#if loading}
					<div class="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
				{:else}
					<span>Calculate Next Guess</span>
					<span class="text-3xl">&rarr;</span>
				{/if}
			</button>
		</div>

		{#if showResult}
			<div bind:this={suggestionsRef}>
				<Suggestions {suggestions} {possibilities} onSelectWord={useSuggestion} />
			</div>
		{/if}
	</main>
</div>
