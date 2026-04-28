<script lang="ts">
	import { onMount, tick } from 'svelte';
	import GuessTiles from './GuessTiles.svelte';
	import {
		buildAnalyzerSearchParams,
		buildAnalyzerShareText,
		parseAnalyzerSearchParams
	} from '$lib/wordle-analyzer/share';
	import type {
		RemainingPreview,
		WordleAnalyzerResult,
		WordleAnalyzerWorkerResponse
	} from '$lib/wordle-analyzer/types';

	type NoticeTone = 'info' | 'success' | 'error' | 'warning';
	type HistoryMode = 'none' | 'replace';

	interface PendingAnalysis {
		enteredWords: string[];
		guesses: string[];
		answer: string;
		hardMode: boolean;
		historyMode: HistoryMode;
	}

	const MAX_GUESSES = 6;
	const PAGE_URL = 'https://wordsolverx.com/wordle-analyzer';
	const INPUT_LABELS = ['Guess 1', 'Guess 2', 'Guess 3', 'Guess 4', 'Guess 5', 'Guess 6', 'Answer'];
	const EXAMPLE_INPUTS = ['slate', 'crane', '', '', '', '', 'trace'];

	const pendingRequests = new Map<number, PendingAnalysis>();

	let worker = $state<Worker | null>(null);
	let workerReady = $state(false);
	let guessInputs = $state(createBlankInputs());
	let hardModeInput = $state(false);
	let loading = $state(false);
	let progressMessage = $state('');
	let analysisError = $state('');
	let noticeMessage = $state('');
	let noticeTone = $state<NoticeTone>('info');
	let analysisResult = $state<WordleAnalyzerResult | null>(null);
	let activeShareUrl = $state(PAGE_URL);
	let showSpoilerWarning = $state(false);
	let resultsSection = $state<HTMLElement | null>(null);

	let nextRequestId = 0;
	let activeRequestId = 0;
	let queuedAnalysis: PendingAnalysis | null = null;
	let noticeTimer: ReturnType<typeof setTimeout> | null = null;

	function createBlankInputs() {
		return Array.from({ length: MAX_GUESSES + 1 }, () => '');
	}

	function getBaseUrl() {
		if (typeof window === 'undefined') {
			return PAGE_URL;
		}

		return `${window.location.origin}${window.location.pathname}`;
	}

	function clearNoticeTimer() {
		if (noticeTimer) {
			clearTimeout(noticeTimer);
			noticeTimer = null;
		}
	}

	function setNotice(message: string, tone: NoticeTone = 'info', persist = false) {
		clearNoticeTimer();
		noticeMessage = message;
		noticeTone = tone;

		if (!persist) {
			noticeTimer = setTimeout(() => {
				noticeMessage = '';
			}, 3200);
		}
	}

	function getNoticeClasses(tone: NoticeTone) {
		if (tone === 'success') {
			return 'border-teal-200 bg-teal-50 text-teal-800';
		}

		if (tone === 'warning') {
			return 'border-amber-200 bg-amber-50 text-amber-800';
		}

		if (tone === 'error') {
			return 'border-rose-200 bg-rose-50 text-rose-800';
		}

		return 'border-sky-200 bg-sky-50 text-sky-800';
	}

	function normalizeWordInput(value: string) {
		return value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5);
	}

	function updateInput(index: number, value: string) {
		const next = [...guessInputs];
		next[index] = normalizeWordInput(value);
		guessInputs = next;
	}

	function setInputsFromWords(guesses: string[], answer: string) {
		const next = createBlankInputs();

		for (let index = 0; index < MAX_GUESSES; index += 1) {
			next[index] = guesses[index] ?? '';
		}

		next[MAX_GUESSES] = answer;
		guessInputs = next;
	}

	function resetAnalyzerState() {
		pendingRequests.clear();
		queuedAnalysis = null;
		activeRequestId = 0;
		loading = false;
		progressMessage = '';
		analysisError = '';
		analysisResult = null;
		showSpoilerWarning = false;
		guessInputs = createBlankInputs();
		hardModeInput = false;
		activeShareUrl = getBaseUrl();
	}

	function resetToBlankPage() {
		resetAnalyzerState();

		if (typeof window !== 'undefined') {
			window.history.replaceState({}, '', window.location.pathname);
		}
	}

	function collectAnalysisInput() {
		const normalizedGuesses = guessInputs
			.slice(0, MAX_GUESSES)
			.map((value) => normalizeWordInput(value));
		const normalizedAnswer = normalizeWordInput(guessInputs[MAX_GUESSES] ?? '');
		const normalizedInputs = [...normalizedGuesses, normalizedAnswer];

		guessInputs = normalizedInputs;

		if (!normalizedAnswer || normalizedAnswer.length !== 5) {
			analysisError = 'Add the final answer in the last row so the analyzer can replay the game.';
			return null;
		}

		let lastGuessIndex = -1;
		for (let index = 0; index < normalizedGuesses.length; index += 1) {
			if (normalizedGuesses[index]) {
				lastGuessIndex = index;
			}
		}

		if (lastGuessIndex < 0) {
			analysisError = 'Enter at least one guess before the answer.';
			return null;
		}

		for (let index = 0; index <= lastGuessIndex; index += 1) {
			if (!normalizedGuesses[index]) {
				analysisError = 'Fill guess rows in order with no empty gaps between them.';
				return null;
			}

			if (normalizedGuesses[index].length !== 5) {
				analysisError = 'Each guess must be exactly 5 letters.';
				return null;
			}
		}

		return {
			guesses: normalizedGuesses.slice(0, lastGuessIndex + 1),
			answer: normalizedAnswer
		};
	}

	function applyShareUrl(enteredWords: string[], hardMode: boolean) {
		if (typeof window === 'undefined') {
			return;
		}

		const params = buildAnalyzerSearchParams(enteredWords, hardMode);
		const nextUrl = `${window.location.pathname}?${params.toString()}`;

		window.history.replaceState({}, '', nextUrl);
		activeShareUrl = `${getBaseUrl()}?${params.toString()}`;
	}

	function queueAnalysis(pending: PendingAnalysis) {
		analysisError = '';
		analysisResult = null;
		loading = true;
		progressMessage = workerReady
			? 'Starting the Wordle analysis...'
			: 'Loading the Wordle analyzer dictionary...';
		queuedAnalysis = pending;

		if (workerReady) {
			flushQueuedAnalysis();
		}
	}

	function flushQueuedAnalysis() {
		if (!worker || !workerReady || !queuedAnalysis) {
			return;
		}

		const pending = queuedAnalysis;
		queuedAnalysis = null;

		const requestId = ++nextRequestId;
		activeRequestId = requestId;
		pendingRequests.set(requestId, pending);
		progressMessage = 'Calculating turn-by-turn analysis...';

		worker.postMessage({
			type: 'analyze',
			requestId,
			guesses: pending.guesses,
			answer: pending.answer,
			hardMode: pending.hardMode
		});
	}

	function analyzeCurrentInputs(historyMode: HistoryMode) {
		const input = collectAnalysisInput();
		if (!input) {
			setNotice(analysisError, 'error');
			return;
		}

		showSpoilerWarning = false;

		queueAnalysis({
			enteredWords: [...input.guesses, input.answer],
			guesses: input.guesses,
			answer: input.answer,
			hardMode: hardModeInput,
			historyMode
		});
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		analyzeCurrentInputs('replace');
	}

	function loadExample() {
		guessInputs = [...EXAMPLE_INPUTS];
		hardModeInput = false;
		showSpoilerWarning = false;
		analyzeCurrentInputs('replace');
	}

	function revealSharedAnalysis() {
		showSpoilerWarning = false;
		analyzeCurrentInputs('none');
	}

	function syncFromLocation() {
		if (typeof window === 'undefined') {
			return;
		}

		pendingRequests.clear();
		queuedAnalysis = null;
		activeRequestId = 0;
		loading = false;
		progressMessage = '';
		analysisError = '';
		analysisResult = null;
		activeShareUrl = getBaseUrl();

		const parsed = parseAnalyzerSearchParams(new URLSearchParams(window.location.search));

		if (!parsed) {
			showSpoilerWarning = false;
			guessInputs = createBlankInputs();
			hardModeInput = false;
			return;
		}

		setInputsFromWords(parsed.guesses, parsed.answer);
		hardModeInput = parsed.hardMode;
		showSpoilerWarning = true;
		activeShareUrl = window.location.href;
	}

	function didUserSolve(result: WordleAnalyzerResult) {
		return result.guesses.at(-1) === result.answer;
	}

	function getUserSolvedTurn(result: WordleAnalyzerResult) {
		const solvedIndex = result.guesses.findIndex((guess) => guess === result.answer);
		return solvedIndex >= 0 ? solvedIndex + 1 : null;
	}

	function getAiSolvedTurn(result: WordleAnalyzerResult) {
		const solvedTurn = result.aiTurns.find((turn) => turn.play.guess === result.answer);
		return solvedTurn ? solvedTurn.turn + 1 : null;
	}

	function getAverageQuality(result: WordleAnalyzerResult) {
		const values = result.guessTurns
			.map((turn) => turn.user.guessQuality)
			.filter((value): value is number => typeof value === 'number');

		if (values.length === 0) {
			return null;
		}

		return (values.reduce((sum, value) => sum + value, 0) / values.length) * 100;
	}

	function getHardModeBreakCount(result: WordleAnalyzerResult) {
		return result.guessTurns.filter((turn) => !turn.user.hardModeValid).length;
	}

	function formatAverage(value?: number) {
		return typeof value === 'number' ? value.toFixed(1) : 'n/a';
	}

	function formatPercent(value?: number | null) {
		return typeof value === 'number' ? `${Math.round(value)}%` : 'n/a';
	}

	function getRemainingPreviewWords(preview: RemainingPreview) {
		return [
			...preview.common.map((word) => ({ word, type: 'common' as const })),
			...preview.other.map((word) => ({ word, type: 'other' as const }))
		];
	}

	function getBestPlayLabel(bestPlay: 'user' | 'ai' | 'same' | 'unknown') {
		if (bestPlay === 'user') return 'Your line gained more information';
		if (bestPlay === 'ai') return 'The AI line kept more possibilities out';
		if (bestPlay === 'same') return 'Both lines were equally strong';
		return 'The turn was effectively a draw';
	}

	async function copyShareLink() {
		if (!analysisResult) {
			return;
		}

		try {
			await navigator.clipboard.writeText(activeShareUrl);
			setNotice('Share link copied.', 'success');
		} catch {
			setNotice('Copy failed in this browser. Please copy the URL manually.', 'error');
		}
	}

	async function copyEmojiRecap() {
		if (!analysisResult) {
			return;
		}

		try {
			await navigator.clipboard.writeText(
				buildAnalyzerShareText(
					analysisResult.guessColors,
					didUserSolve(analysisResult),
					activeShareUrl
				)
			);
			setNotice('Emoji recap copied.', 'success');
		} catch {
			setNotice('Copy failed in this browser. Please copy the results manually.', 'error');
		}
	}

	onMount(() => {
		syncFromLocation();

		const workerInstance = new Worker(
			new URL('../../workers/wordle-analyzer.worker.ts', import.meta.url),
			{ type: 'classic' }
		);
		worker = workerInstance;

		const handleMessage = async (
			event: MessageEvent<WordleAnalyzerWorkerResponse>
		) => {
			const data = event.data;

			if (data?.type === 'ready') {
				workerReady = true;
				progressMessage = '';
				if (!noticeMessage) {
					setNotice('Analyzer ready. Paste a finished game or load the example.', 'info');
				}
				flushQueuedAnalysis();
				return;
			}

			if (data?.type === 'progress') {
				if (data.requestId === activeRequestId) {
					progressMessage = data.progress.message;
				}
				return;
			}

			if (data?.type === 'error' && data.requestId === undefined) {
				workerReady = false;
				loading = false;
				progressMessage = '';
				analysisError = data.error;
				setNotice(data.error, 'error', true);
				return;
			}

			if (data?.type !== 'result' && data?.type !== 'error') {
				return;
			}

			const requestId = data.requestId;
			if (!requestId || requestId !== activeRequestId) {
				pendingRequests.delete(requestId ?? -1);
				return;
			}

			const pending = pendingRequests.get(requestId);
			pendingRequests.delete(requestId);
			loading = false;
			progressMessage = '';

			if (!pending) {
				return;
			}

			if (data.type === 'error') {
				analysisError = data.error;
				setNotice(data.error, 'error');
				return;
			}

			analysisResult = data.result;
			analysisError = '';
			activeShareUrl = getBaseUrl();

			if (pending.historyMode === 'replace') {
				applyShareUrl(pending.enteredWords, pending.hardMode);
			} else if (typeof window !== 'undefined') {
				activeShareUrl = window.location.href;
			}

			await tick();
			resultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		};

		const handleWorkerError = (event: ErrorEvent) => {
			workerReady = false;
			loading = false;
			progressMessage = '';
			analysisError = event.message || 'The analyzer worker failed to load.';
			setNotice(analysisError, 'error', true);
		};

		const handlePopState = () => {
			syncFromLocation();
		};

		workerInstance.addEventListener('message', handleMessage);
		workerInstance.addEventListener('error', handleWorkerError);
		workerInstance.postMessage({ type: 'init' });
		window.addEventListener('popstate', handlePopState);

		return () => {
			clearNoticeTimer();
			pendingRequests.clear();
			window.removeEventListener('popstate', handlePopState);
			workerInstance.removeEventListener('message', handleMessage);
			workerInstance.removeEventListener('error', handleWorkerError);
			workerInstance.terminate();
		};
	});
</script>

<section class="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
	<div class="overflow-hidden rounded-[2rem] border border-teal-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_42%),linear-gradient(135deg,#f8fffc_0%,#f0fdf9_45%,#eff6ff_100%)] p-8 shadow-[0_28px_90px_-42px_rgba(15,118,110,0.45)]">
		<div class="max-w-3xl">
			<p class="text-sm font-black uppercase tracking-[0.3em] text-teal-700">Wordle Analyzer</p>
			<h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
				Replay a finished Wordle and grade every move.
			</h1>
			<p class="mt-4 text-lg leading-8 text-slate-600">
				Paste your guesses and the final answer to compare each turn against an AI line,
				check hard mode discipline, and see how many answers survived after every play.
			</p>
			<div class="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
				<span class="rounded-full border border-teal-200 bg-white/80 px-4 py-2">Spoiler-safe share links</span>
				<span class="rounded-full border border-sky-200 bg-white/80 px-4 py-2">AI turn comparison</span>
				<span class="rounded-full border border-amber-200 bg-white/80 px-4 py-2">Hard mode rule checks</span>
			</div>
		</div>
	</div>

	{#if noticeMessage}
		<div class={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${getNoticeClasses(noticeTone)}`}>
			{noticeMessage}
		</div>
	{/if}

	{#if !showSpoilerWarning}
		<form onsubmit={handleSubmit} class="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each INPUT_LABELS as label, index}
					<label class={index === MAX_GUESSES ? 'xl:col-span-2' : ''}>
						<span class="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
							{label}
						</span>
						<input
							type="text"
							value={guessInputs[index]}
							oninput={(event) => updateInput(index, (event.currentTarget as HTMLInputElement).value)}
							placeholder={index === MAX_GUESSES ? 'final answer' : 'guess'}
							maxlength="5"
							autocomplete="off"
							spellcheck="false"
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-black uppercase tracking-[0.35em] text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
						/>
					</label>
				{/each}
			</div>

			<div class="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<label class="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
					<input
						type="checkbox"
						checked={hardModeInput}
						onchange={() => {
							hardModeInput = !hardModeInput;
						}}
						class="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
					/>
					This game used hard mode
				</label>

				<div class="flex flex-wrap gap-3">
					<button type="submit" class="rounded-full bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-teal-700">
						Analyze Game
					</button>
					<button type="button" onclick={loadExample} class="rounded-full border border-slate-200 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-sky-300 hover:bg-sky-50">
						Load Example
					</button>
					<button type="button" onclick={resetToBlankPage} class="rounded-full border border-slate-200 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-rose-300 hover:bg-rose-50">
						Clear
					</button>
				</div>
			</div>

			{#if loading || analysisError}
				<div class={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${analysisError ? getNoticeClasses('error') : getNoticeClasses('info')}`}>
					{analysisError || progressMessage}
				</div>
			{/if}
		</form>
	{:else}
		<div class="mt-8 rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-7 shadow-xl shadow-amber-100/50">
			<p class="text-sm font-black uppercase tracking-[0.25em] text-amber-700">Spoiler Warning</p>
			<h2 class="mt-2 text-3xl font-black text-slate-900">This shared link contains a finished Wordle.</h2>
			<p class="mt-3 max-w-2xl text-base leading-7 text-slate-700">
				Reveal it only if you want to see the final answer and full turn-by-turn analysis.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<button onclick={revealSharedAnalysis} class="rounded-full bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-teal-700">
					Reveal Analysis
				</button>
				<button onclick={resetToBlankPage} class="rounded-full border border-amber-300 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-700 transition hover:bg-amber-100">
					Start Fresh
				</button>
			</div>
		</div>
	{/if}

	{#if analysisResult}
		{@const userSolvedTurn = getUserSolvedTurn(analysisResult)}
		{@const aiSolvedTurn = getAiSolvedTurn(analysisResult)}
		{@const averageQuality = getAverageQuality(analysisResult)}
		{@const hardModeBreaks = getHardModeBreakCount(analysisResult)}

		<div bind:this={resultsSection} class="mt-10 space-y-8">
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg">
					<p class="text-sm font-black uppercase tracking-[0.25em] text-slate-500">Outcome</p>
					<p class="mt-3 text-3xl font-black text-slate-900">
						{userSolvedTurn ? `Solved in ${userSolvedTurn}` : 'Missed in 6'}
					</p>
					<p class="mt-2 text-sm text-slate-600">Answer: {analysisResult.answer.toUpperCase()}</p>
				</div>
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg">
					<p class="text-sm font-black uppercase tracking-[0.25em] text-slate-500">AI Result</p>
					<p class="mt-3 text-3xl font-black text-slate-900">
						{aiSolvedTurn ? `Solved in ${aiSolvedTurn}` : 'Needed more turns'}
					</p>
					<p class="mt-2 text-sm text-slate-600">Best line recalculated from your live clue state.</p>
				</div>
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg">
					<p class="text-sm font-black uppercase tracking-[0.25em] text-slate-500">Hard Mode</p>
					<p class="mt-3 text-3xl font-black text-slate-900">
						{analysisResult.hardMode ? (hardModeBreaks === 0 ? 'Valid' : `${hardModeBreaks} break${hardModeBreaks === 1 ? '' : 's'}`) : 'Off'}
					</p>
					<p class="mt-2 text-sm text-slate-600">Checks whether each guess obeyed every locked clue.</p>
				</div>
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg">
					<p class="text-sm font-black uppercase tracking-[0.25em] text-slate-500">Average Quality</p>
					<p class="mt-3 text-3xl font-black text-slate-900">{formatPercent(averageQuality)}</p>
					<p class="mt-2 text-sm text-slate-600">Higher means your choices stayed closer to the best-ranked plays.</p>
				</div>
			</div>

			<div class="flex flex-wrap gap-3">
				<button onclick={copyShareLink} class="rounded-full bg-teal-600 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-teal-700">
					Copy Link
				</button>
				<button onclick={copyEmojiRecap} class="rounded-full border border-slate-200 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-sky-300 hover:bg-sky-50">
					Copy Emoji Recap
				</button>
				<button onclick={resetToBlankPage} class="rounded-full border border-slate-200 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-rose-300 hover:bg-rose-50">
					New Analysis
				</button>
			</div>

			<section class="space-y-5">
				<h2 class="text-3xl font-black tracking-tight text-slate-900">Turn-by-turn comparison</h2>

				{#each analysisResult.guessTurns as turn}
					<article class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
						<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
							<div>
								<p class="text-sm font-black uppercase tracking-[0.25em] text-slate-500">Turn {turn.turn + 1}</p>
								<h3 class="mt-2 text-2xl font-black text-slate-900">{getBestPlayLabel(turn.bestPlay)}</h3>
							</div>
							<div class="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
								<span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
									{turn.beforeRemainingCounts.total} remaining
								</span>
								<span class="rounded-full border border-sky-200 bg-sky-50 px-3 py-2">
									{turn.strategyLabel}
								</span>
							</div>
						</div>

						<div class="mt-6 grid gap-6 xl:grid-cols-2">
							<div class="rounded-[1.5rem] border border-teal-200 bg-teal-50/60 p-5">
								<p class="text-sm font-black uppercase tracking-[0.2em] text-teal-700">You Played</p>
								<div class="mt-4">
									<GuessTiles word={turn.user.guess} colors={turn.user.colors} />
								</div>
								<div class="mt-4 grid gap-2 text-sm text-slate-700">
									<p><span class="font-bold text-slate-900">Avg remaining:</span> {formatAverage(turn.user.averageRemaining?.common)} common / {formatAverage(turn.user.averageRemaining?.all)} all</p>
									<p><span class="font-bold text-slate-900">Guess quality:</span> {formatPercent(typeof turn.user.guessQuality === 'number' ? turn.user.guessQuality * 100 : null)}</p>
									<p><span class="font-bold text-slate-900">Remaining after:</span> {turn.user.remainingAfter.total} total</p>
									{#if turn.user.luck}
										<p><span class="font-bold text-slate-900">Luck:</span> {turn.user.luck.label}</p>
									{/if}
									{#if analysisResult.hardMode}
										<p><span class="font-bold text-slate-900">Hard mode:</span> {turn.user.hardModeValid ? 'Valid' : 'Broken'}</p>
									{/if}
								</div>

								{#if turn.user.hardModeViolations.length > 0}
									<div class="mt-4 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700">
										<p class="font-bold text-rose-900">Hard mode violations</p>
										<p class="mt-2">{turn.user.hardModeViolations.join(' | ')}</p>
									</div>
								{/if}

								{#if turn.user.unusedClues.length > 0}
									<div class="mt-4 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-amber-800">
										<p class="font-bold text-amber-900">Unused clue pressure</p>
										<p class="mt-2">{turn.user.unusedClues.join(' | ')}</p>
									</div>
								{/if}

								{#if turn.user.remainingPreview}
									<div class="mt-4">
										<p class="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Remaining words preview</p>
										<div class="mt-3 flex flex-wrap gap-2">
											{#each getRemainingPreviewWords(turn.user.remainingPreview) as entry}
												<span class={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${entry.type === 'common' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
													{entry.word}
												</span>
											{/each}
										</div>
									</div>
								{/if}
							</div>

							<div class="rounded-[1.5rem] border border-sky-200 bg-sky-50/60 p-5">
								<p class="text-sm font-black uppercase tracking-[0.2em] text-sky-700">AI Would Play</p>
								<div class="mt-4">
									<GuessTiles word={turn.ai.guess} colors={turn.ai.colors} />
								</div>
								<div class="mt-4 grid gap-2 text-sm text-slate-700">
									<p><span class="font-bold text-slate-900">Avg remaining:</span> {formatAverage(turn.ai.averageRemaining?.common)} common / {formatAverage(turn.ai.averageRemaining?.all)} all</p>
									<p><span class="font-bold text-slate-900">Guess quality:</span> {formatPercent(typeof turn.ai.guessQuality === 'number' ? turn.ai.guessQuality * 100 : null)}</p>
									<p><span class="font-bold text-slate-900">Remaining after:</span> {turn.ai.remainingAfter.total} total</p>
									{#if turn.ai.luck}
										<p><span class="font-bold text-slate-900">Luck:</span> {turn.ai.luck.label}</p>
									{/if}
									<p><span class="font-bold text-slate-900">Common answer:</span> {turn.ai.commonWord ? 'Yes' : 'No'}</p>
								</div>
							</div>
						</div>
					</article>
				{/each}
			</section>

			<section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
				<h2 class="text-3xl font-black tracking-tight text-slate-900">Full AI solution path</h2>
				<p class="mt-3 max-w-3xl text-base leading-7 text-slate-600">
					This is the AI line if it had played the entire puzzle itself from the opening clue state.
				</p>

				<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{#each analysisResult.aiTurns as turn}
						<div class="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
							<p class="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Turn {turn.turn + 1}</p>
							<p class="mt-2 text-sm font-semibold text-slate-600">{turn.strategyLabel}</p>
							<div class="mt-4">
								<GuessTiles word={turn.play.guess} colors={turn.play.colors} size="sm" />
							</div>
							<p class="mt-4 text-sm text-slate-700">
								<span class="font-bold text-slate-900">Remaining after:</span> {turn.play.remainingAfter.total}
							</p>
						</div>
					{/each}
				</div>
			</section>
		</div>
	{/if}
</section>
