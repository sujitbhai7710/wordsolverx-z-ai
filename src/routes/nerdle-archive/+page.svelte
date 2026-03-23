<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();

	interface AnswerData {
		date: string;
		puzzleNumber: number;
		answer: string | null;
	}

	type AnswerRange = AnswerData;
	type ViewMode = 'calendar' | 'list';

	const NERDLE_START_UTC_MS = Date.UTC(2022, 0, 20);
	const DAY_MS = 24 * 60 * 60 * 1000;
	const NERDLE_START_DATE = new Date(2022, 0, 20);
	const MONTH_NAMES = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function formatDateKey(date: Date): string {
		return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().slice(0, 10);
	}

	function parseDateKey(dateKey: string | null): Date | null {
		if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
			return null;
		}

		const [yearString, monthString, dayString] = dateKey.split('-');
		const year = Number(yearString);
		const month = Number(monthString) - 1;
		const day = Number(dayString);
		const utc = Date.UTC(year, month, day);
		const parsed = new Date(utc);
		if (
			Number.isNaN(utc) ||
			parsed.getUTCFullYear() !== year ||
			parsed.getUTCMonth() !== month ||
			parsed.getUTCDate() !== day
		) {
			return null;
		}

		return new Date(year, month, day);
	}

	function isNerdleDate(date: Date): boolean {
		const utcDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
		return utcDay >= NERDLE_START_UTC_MS;
	}

	function getPuzzleNumber(date: Date): number {
		const utcDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
		return Math.floor((utcDay - NERDLE_START_UTC_MS) / DAY_MS);
	}

	function tileStyle(char: string, index: number): string {
		const isOperator = ['+', '-', '*', '/', '='].includes(char);
		const isEquals = char === '=';
		const background = isEquals
			? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
			: isOperator
				? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
				: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)';
		return `width: 2.5rem; height: 3rem; font-size: 1.25rem; animation-delay: ${index * 50}ms; background: ${background};`;
	}

	function getTodayDateFromData(): Date {
		return parseDateKey(data.todayDateKey) ?? new Date();
	}

	let selectedDate = $state(new Date());
	let currentMonth = $state(new Date());
	let selectedAnswer = $state<AnswerData | null>(null);
	let loadedAnswers = $state(new Map<string, string>());
	let isLoading = $state(false);
	let viewMode = $state<ViewMode>('calendar');
	let rangeAnswers = $state<AnswerRange[]>([]);

	function isFutureDate(date: Date): boolean {
		return formatDateKey(date) > formatDateKey(getTodayDateFromData());
	}

	function isSelected(day: number): boolean {
		return (
			selectedDate.getFullYear() === currentMonth.getFullYear() &&
			selectedDate.getMonth() === currentMonth.getMonth() &&
			selectedDate.getDate() === day
		);
	}

	function isToday(day: number): boolean {
		const todayDate = getTodayDateFromData();
		return (
			todayDate.getFullYear() === currentMonth.getFullYear() &&
			todayDate.getMonth() === currentMonth.getMonth() &&
			todayDate.getDate() === day
		);
	}

	function isCurrentMonthOrPast(): boolean {
		const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
		const todayDate = getTodayDateFromData();
		const todayMonthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
		return monthStart.getTime() < todayMonthStart.getTime();
	}

	async function fetchAnswer(date: Date): Promise<void> {
		const dateStr = formatDateKey(date);
		isLoading = true;
		try {
			const res = await fetch(`/api/nerdle-answer?date=${dateStr}`);
			const payload = (await res.json()) as { success?: boolean; data?: AnswerData };
			if (payload.success && payload.data) {
				selectedAnswer = payload.data;
				if (payload.data.answer) {
					const next = new Map(loadedAnswers);
					next.set(dateStr, payload.data.answer);
					loadedAnswers = next;
				}
			}
		} catch (error) {
			console.error('Error fetching Nerdle answer:', error);
		} finally {
			isLoading = false;
		}
	}

	async function fetchRange(anchorDate: Date, days: number): Promise<void> {
		isLoading = true;
		try {
			const rangeDays = Math.max(1, Math.min(days, 30));
			const startDate = new Date(anchorDate);
			startDate.setDate(anchorDate.getDate() - (rangeDays - 1));
			const clampedStart = startDate < NERDLE_START_DATE ? NERDLE_START_DATE : startDate;
			const startDateKey = formatDateKey(clampedStart);

			const res = await fetch(`/api/nerdle-answer?range=${rangeDays}&date=${startDateKey}`);
			const payload = (await res.json()) as { success?: boolean; data?: AnswerRange[] };
			if (payload.success && payload.data) {
				const todayDate = getTodayDateFromData();
				const filtered = payload.data
					.filter((item) => item.date <= formatDateKey(todayDate))
					.sort((a, b) => b.date.localeCompare(a.date));
				rangeAnswers = filtered;
				const next = new Map(loadedAnswers);
				for (const item of filtered) {
					if (item.answer) {
						next.set(item.date, item.answer);
					}
				}
				loadedAnswers = next;
			}
		} catch (error) {
			console.error('Error fetching Nerdle range answers:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleSelectDate(date: Date): Promise<void> {
		if (!isNerdleDate(date) || isFutureDate(date)) {
			return;
		}

		selectedDate = date;
		if (typeof window !== 'undefined') {
			const dateKey = formatDateKey(date);
			window.history.replaceState(window.history.state, '', `/nerdle-archive?date=${dateKey}`);
		}
		await fetchAnswer(date);
		await fetchRange(date, 10);
	}

	async function goToPrev(): Promise<void> {
		const prev = new Date(selectedDate);
		prev.setDate(prev.getDate() - 1);
		if (isNerdleDate(prev)) {
			await handleSelectDate(prev);
		}
	}

	async function goToNext(): Promise<void> {
		const next = new Date(selectedDate);
		next.setDate(next.getDate() + 1);
		if (!isFutureDate(next)) {
			await handleSelectDate(next);
		}
	}

	async function goToToday(): Promise<void> {
		await handleSelectDate(getTodayDateFromData());
	}

	function prevMonth(): void {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth(): void {
		if (!isCurrentMonthOrPast()) {
			return;
		}
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	let daysInMonth = $derived(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate());
	let firstDayOfMonth = $derived(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay());
	let monthLabel = $derived(`${MONTH_NAMES[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`);

	onMount(async () => {
		const todayDate = getTodayDateFromData();
		const params = new URLSearchParams(window.location.search);
		const dateParam = params.get('date');
		const fromUrl = parseDateKey(dateParam);
		const fromServer = parseDateKey(data.selectedDateKey ?? null);
		const initialFromServer = fromServer && isNerdleDate(fromServer) && !isFutureDate(fromServer) ? fromServer : null;
		const safeDate =
			fromUrl && isNerdleDate(fromUrl) && !isFutureDate(fromUrl)
				? fromUrl
				: initialFromServer ?? todayDate;

		selectedDate = safeDate;
		currentMonth = new Date(safeDate.getFullYear(), safeDate.getMonth(), 1);

		await fetchAnswer(safeDate);
		await fetchRange(safeDate, 10);
	});
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords} />
	<link rel="canonical" href={data.meta.canonical} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:url" content={data.meta.canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="WordSolverX" />
	<meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	<meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
	{@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<header class="flex items-center justify-between mb-8 gap-3">
			<div>
				<h1 class="text-3xl sm:text-4xl font-black">Nerdle Archive</h1>
				<p class="text-slate-600 mt-2">Browse all Nerdle puzzles since January 20, 2022</p>
			</div>
			<div class="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
				<button
					onclick={() => (viewMode = 'calendar')}
					type="button"
					class={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						viewMode === 'calendar' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
					}`}
				>
					Calendar
				</button>
				<button
					onclick={() => (viewMode = 'list')}
					type="button"
					class={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
					}`}
				>
					List
				</button>
			</div>
		</header>

		<div class="grid lg:grid-cols-3 gap-8">
			<div class="lg:col-span-1">
				{#if viewMode === 'calendar'}
					<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<div class="flex items-center justify-between mb-4">
							<button aria-label="Previous month" onclick={prevMonth} type="button" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<h2 class="text-lg font-semibold">{monthLabel}</h2>
							<button
								aria-label="Next month"
								onclick={nextMonth}
								type="button"
								disabled={!isCurrentMonthOrPast()}
								class="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>

						<div class="grid grid-cols-7 gap-1 mb-2">
							{#each DAY_NAMES as dayName}
								<div class="text-center text-xs text-slate-500 py-2">{dayName}</div>
							{/each}
						</div>

						<div class="grid grid-cols-7 gap-1">
							{#each Array(firstDayOfMonth) as _}
								<div class="h-10" aria-hidden="true"></div>
							{/each}

							{#each Array(daysInMonth) as _, idx}
								{@const day = idx + 1}
								{@const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)}
								{@const dateStr = formatDateKey(dateObj)}
								{@const hasAnswer = loadedAnswers.has(dateStr)}
								{@const future = isFutureDate(dateObj)}
								{#if !isNerdleDate(dateObj)}
									<div class="h-10 flex items-center justify-center text-slate-300 text-sm">{day}</div>
								{:else}
									<button
										onclick={() => handleSelectDate(dateObj)}
										type="button"
										disabled={future}
										class={`h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
											future
												? 'text-slate-300 bg-slate-50 cursor-not-allowed'
												: isSelected(day)
													? 'bg-emerald-600 text-white font-bold'
													: isToday(day)
														? 'bg-violet-100 text-violet-700 font-medium hover:bg-violet-200'
														: hasAnswer
															? 'bg-slate-100 hover:bg-slate-200'
															: 'hover:bg-slate-100'
										}`}
									>
										{day}
									</button>
								{/if}
							{/each}
						</div>

						<div class="flex gap-4 mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
							<div class="flex items-center gap-1">
								<div class="w-3 h-3 rounded bg-emerald-600"></div>
								<span>Selected</span>
							</div>
							<div class="flex items-center gap-1">
								<div class="w-3 h-3 rounded bg-violet-200"></div>
								<span>Today</span>
							</div>
						</div>
					</div>
				{:else}
					<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<h2 class="text-lg font-semibold mb-4">Recent Puzzles</h2>
						<div class="space-y-2 max-h-96 overflow-y-auto">
							{#each rangeAnswers as item}
								<button
									onclick={() => handleSelectDate(parseDateKey(item.date) ?? new Date(item.date))}
									type="button"
									class={`w-full p-3 rounded-lg text-left transition-colors ${
										formatDateKey(selectedDate) === item.date
											? 'bg-emerald-50 border border-emerald-300'
											: 'hover:bg-slate-50 border border-slate-100'
									}`}
								>
									<div class="flex justify-between items-center">
										<div>
											<div class="text-sm text-slate-500">#{item.puzzleNumber}</div>
											<div class="text-slate-900 font-medium">{item.date}</div>
										</div>
										{#if item.answer}
											<div class="text-emerald-700 font-mono">{item.answer}</div>
										{/if}
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<div class="mt-4 flex gap-2">
					<button onclick={goToToday} type="button" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
						Today
					</button>
					<button onclick={() => handleSelectDate(new Date(2022, 0, 20))} type="button" class="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
						First Puzzle
					</button>
				</div>
			</div>

			<div class="lg:col-span-2">
				<div class="flex items-center justify-between mb-6 gap-2">
					<button
						onclick={goToPrev}
						disabled={!isNerdleDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1))}
						type="button"
						class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
						Previous
					</button>

					<div class="text-center">
						<div class="text-2xl font-black text-slate-900">{formatDateKey(selectedDate)}</div>
						<div class="text-sm text-slate-600">Puzzle #{selectedAnswer?.puzzleNumber ?? getPuzzleNumber(selectedDate)}</div>
					</div>

					<button
						onclick={goToNext}
						type="button"
						disabled={isFutureDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1))}
						class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
					{#if isLoading}
						<div class="text-center py-12">
							<div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
							<p class="text-slate-600">Loading answer...</p>
						</div>
					{:else if selectedAnswer?.answer}
						<div>
							<div class="flex justify-center gap-2 mb-6">
								{#each selectedAnswer.answer.split('') as char, index}
									<div class="rounded flex items-center justify-center font-bold text-white transition-all duration-200 hover:scale-105" style={tileStyle(char, index)}>
										{char}
									</div>
								{/each}
							</div>

							<div class="grid grid-cols-2 gap-4 text-sm border-t border-slate-200 pt-6">
								<div>
									<span class="text-slate-600">Date:</span>
									<p class="text-slate-900 font-medium mt-1">{selectedAnswer.date}</p>
								</div>
								<div>
									<span class="text-slate-600">Puzzle Number:</span>
									<p class="text-slate-900 font-medium mt-1">#{selectedAnswer.puzzleNumber}</p>
								</div>
								<div>
									<span class="text-slate-600">Equation:</span>
									<p class="text-slate-900 font-mono mt-1">{selectedAnswer.answer}</p>
								</div>
								<div>
									<span class="text-slate-600">Days since launch:</span>
									<p class="text-slate-900 font-medium mt-1">{selectedAnswer.puzzleNumber} days</p>
								</div>
							</div>
						</div>
					{:else}
						<div class="text-center py-12">
							<p class="text-slate-600">No answer available for this date</p>
						</div>
					{/if}
				</div>

				<div class="mt-6 flex justify-center gap-4 text-sm">
					<a href="/nerdle-answer-today" class="text-emerald-700 hover:text-emerald-600 font-medium transition-colors">View Today&apos;s Answer -></a>
					<a href="https://www.nerdlegame.com/" target="_blank" rel="noopener noreferrer" class="text-slate-700 hover:text-slate-900 transition-colors">Play on Nerdle -></a>
				</div>
			</div>
		</div>
	</div>
</main>
