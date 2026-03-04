<script lang="ts">
  import { onMount } from 'svelte';
  import { BETWEENLE_DAILY_WORDS, BETWEENLE_WORDS } from '$lib/betweenle/data';
  import {
    BETWEENLE_FIRST_WORD,
    BETWEENLE_LAST_WORD,
    BETWEENLE_START_DATE,
    createBetweenleGameSetup,
    formatBetweenleDate,
    formatBetweenleDistance,
    getBetweenleWordPosition,
    isBetweenleWord,
    sanitizeBetweenleWord,
    toDateKey,
  } from '$lib/betweenle/logic';
  import type { BetweenleGameMode, BetweenleGameSetup, BetweenleGuess } from '$lib/betweenle/types';

  type BetweenleScreen = 'menu' | 'calendar' | 'game';

  const totalWords = BETWEENLE_WORDS.length;
  const maxGuessMarkers = 14;
  const dayMs = 24 * 60 * 60 * 1000;
  const startDate = normalizeDate(BETWEENLE_START_DATE);
  const customWordBits = 15;
  const customSaltBits = 7;
  const customHalfBits = 11;
  const customHalfMask = (1 << customHalfBits) - 1;
  const customBlockMask = (1 << (customWordBits + customSaltBits)) - 1;
  const customWordMask = (1 << customWordBits) - 1;
  const customRoundKeys = [0x13f, 0x2bd, 0x4f1, 0x69d];
  const wordIndexMap = new Map(BETWEENLE_WORDS.map((word, index) => [word, index]));
  const modeLabels: Record<BetweenleGameMode, string> = {
    daily: 'Daily',
    unlimited: 'Unlimited',
    custom: 'Custom',
  };

  function normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  function getTodayDate(): Date {
    return normalizeDate(new Date());
  }

  function isSameDay(a: Date, b: Date): boolean {
    return normalizeDate(a).getTime() === normalizeDate(b).getTime();
  }

  function lettersFor(word: string): string[] {
    return word.toUpperCase().padEnd(5, ' ').split('');
  }

  const initialSelectedDate = getTodayDate();
  let screen = $state<BetweenleScreen>('menu');
  let mode = $state<BetweenleGameMode>('unlimited');
  let selectedDate = $state<Date>(initialSelectedDate);
  let viewMonth = $state<Date>(
    new Date(initialSelectedDate.getFullYear(), initialSelectedDate.getMonth(), 1)
  );
  let setup = $state<BetweenleGameSetup | null>(null);
  let guesses = $state<BetweenleGuess[]>([]);
  let input = $state('');
  let topWord = $state(BETWEENLE_FIRST_WORD);
  let bottomWord = $state(BETWEENLE_LAST_WORD);
  let topPos = $state(0);
  let bottomPos = $state(totalWords - 1);
  let error = $state('');
  let copiedNotice = $state('');
  let showCustomForm = $state(false);
  let customWordInput = $state('');
  let customWordError = $state('');
  let customToken = $state('');
  let customShareLink = $state('');
  let customShareNotice = $state('');

  let todayDate = $derived(getTodayDate());
  let lastGuess = $derived(guesses.length > 0 ? guesses[guesses.length - 1] : null);
  let hasWon = $derived(lastGuess?.direction === 'match');
  let gameFinished = $derived(hasWon);
  let activeWord = $derived(setup?.word ?? '');
  let barValues = $derived.by(() => {
    if (!setup || guesses.length === 0) {
      return { top: '?', bottom: '?', closerTo: null as 'top' | 'bottom' | null };
    }

    const topDistance = Math.abs(setup.secretPosition - topPos);
    const bottomDistance = Math.abs(setup.secretPosition - bottomPos);

    return {
      top: formatBetweenleDistance(topDistance, totalWords),
      bottom: formatBetweenleDistance(bottomDistance, totalWords),
      closerTo: topDistance <= bottomDistance ? 'top' : 'bottom',
    };
  });
  let showLastGuessRow = $derived(
    Boolean(lastGuess && !hasWon && lastGuess.word !== topWord && lastGuess.word !== bottomWord)
  );
  let calendarDays = $derived.by(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const entries: Array<{
      date: Date | null;
      day: number;
      disabled: boolean;
      isToday: boolean;
      isSelected: boolean;
    }> = [];

    for (let index = 0; index < startingDay; index += 1) {
      entries.push({
        date: null,
        day: 0,
        disabled: true,
        isToday: false,
        isSelected: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = normalizeDate(new Date(year, month, day));
      const beforeStart = date < startDate;
      const afterToday = date > todayDate;

      entries.push({
        date,
        day,
        disabled: beforeStart || afterToday,
        isToday: isSameDay(date, todayDate),
        isSelected: isSameDay(date, selectedDate),
      });
    }

    return entries;
  });
  let canGoForwardMonth = $derived(
    viewMonth.getFullYear() < todayDate.getFullYear() ||
      (viewMonth.getFullYear() === todayDate.getFullYear() &&
        viewMonth.getMonth() < todayDate.getMonth())
  );
  let selectedDateLabel = $derived(
    setup?.date
      ? formatBetweenleDate(setup.date)
      : formatBetweenleDate(toDateKey(selectedDate))
  );

  const monthNames = [
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
    'December',
  ];

  function clearCopiedNotice(): void {
    window.setTimeout(() => {
      copiedNotice = '';
    }, 1800);
  }

  async function copyText(value: string, message: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      copiedNotice = message;
      clearCopiedNotice();
    } catch {
      copiedNotice = 'Copy failed on this browser.';
      clearCopiedNotice();
    }
  }

  function resetRound(nextSetup: BetweenleGameSetup): void {
    setup = nextSetup;
    guesses = [];
    input = '';
    topWord = BETWEENLE_FIRST_WORD;
    bottomWord = BETWEENLE_LAST_WORD;
    topPos = 0;
    bottomPos = totalWords - 1;
    error = '';
    copiedNotice = '';
    screen = 'game';
  }

  function createDailySetup(date: Date): BetweenleGameSetup {
    const normalizedDate = normalizeDate(date);
    const offsetFromToday = Math.max(
      0,
      Math.floor((todayDate.getTime() - normalizedDate.getTime()) / dayMs)
    );
    const wordIndex =
      BETWEENLE_DAILY_WORDS.length > 0 ? offsetFromToday % BETWEENLE_DAILY_WORDS.length : 0;
    const word = BETWEENLE_DAILY_WORDS[wordIndex] ?? BETWEENLE_WORDS[0] ?? '';

    return {
      mode: 'daily',
      word,
      secretPosition: getBetweenleWordPosition(word),
      puzzleNumber: offsetFromToday + 1,
      date: toDateKey(normalizedDate),
    };
  }

  function customFeistelEncrypt(block: number): number {
    let left = (block >> customHalfBits) & customHalfMask;
    let right = block & customHalfMask;

    for (let round = 0; round < customRoundKeys.length; round += 1) {
      const mixed =
        (Math.imul(right, 1103 + round * 2) + customRoundKeys[round]) & customHalfMask;
      [left, right] = [right, (left ^ mixed) & customHalfMask];
    }

    return ((left << customHalfBits) | right) & customBlockMask;
  }

  function customFeistelDecrypt(block: number): number {
    let left = (block >> customHalfBits) & customHalfMask;
    let right = block & customHalfMask;

    for (let round = customRoundKeys.length - 1; round >= 0; round -= 1) {
      const previousRight = left;
      const mixed =
        (Math.imul(previousRight, 1103 + round * 2) + customRoundKeys[round]) & customHalfMask;
      const previousLeft = (right ^ mixed) & customHalfMask;
      left = previousLeft;
      right = previousRight;
    }

    return ((left << customHalfBits) | right) & customBlockMask;
  }

  function encodeCustomToken(word: string): string | null {
    const index = wordIndexMap.get(word);
    if (index === undefined || index > customWordMask) return null;

    const salt = Math.floor(Math.random() * (1 << customSaltBits));
    const payload = ((salt << customWordBits) | index) & customBlockMask;
    const cipher = customFeistelEncrypt(payload);
    const checksum = (Math.imul(cipher, 97) + 13) % 100;

    return `${String(cipher).padStart(7, '0')}${String(checksum).padStart(2, '0')}`;
  }

  function decodeCustomToken(token: string): string | null {
    if (!/^\d{9}$/.test(token)) return null;

    const cipher = Number(token.slice(0, 7));
    const checksum = Number(token.slice(7));
    if (cipher > customBlockMask) return null;
    const expectedChecksum = (Math.imul(cipher, 97) + 13) % 100;
    if (checksum !== expectedChecksum) return null;

    const payload = customFeistelDecrypt(cipher);
    const wordIndex = payload & customWordMask;
    const word = BETWEENLE_WORDS[wordIndex];

    return word ?? null;
  }

  function updateUrlParams(params: { customToken?: string | null; dailyDate?: string | null }): void {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);

    if (params.customToken !== undefined) {
      if (params.customToken) {
        url.searchParams.set('c', params.customToken);
      } else {
        url.searchParams.delete('c');
      }
    }

    if (params.dailyDate !== undefined) {
      if (params.dailyDate) {
        url.searchParams.set('d', params.dailyDate);
      } else {
        url.searchParams.delete('d');
      }
    }

    if (params.customToken) {
      url.searchParams.delete('d');
    }

    if (params.dailyDate) {
      url.searchParams.delete('c');
    }

    const query = url.searchParams.toString();
    const nextUrl = `${url.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }

  function updateCustomParam(token: string | null): void {
    updateUrlParams({ customToken: token });
  }

  function parseDailyDateParam(dateValue: string | null): Date | null {
    if (!dateValue || !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null;

    const parsedDate = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return null;

    const normalizedDate = normalizeDate(parsedDate);
    if (normalizedDate < startDate || normalizedDate > todayDate) return null;

    return normalizedDate;
  }

  async function copyCustomLink(): Promise<void> {
    if (!customToken || typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('c', customToken);
    await copyText(url.toString(), 'Custom game link copied.');
  }

  function startDailyGame(date: Date): void {
    selectedDate = normalizeDate(date);
    mode = 'daily';
    customToken = '';
    updateUrlParams({ customToken: null, dailyDate: toDateKey(selectedDate) });
    resetRound(createDailySetup(selectedDate));
  }

  function startUnlimitedGame(): void {
    mode = 'unlimited';
    customToken = '';
    updateUrlParams({ customToken: null, dailyDate: null });
    resetRound(createBetweenleGameSetup('unlimited'));
  }

  function startCustomGame(): void {
    const normalizedWord = sanitizeBetweenleWord(customWordInput);

    if (normalizedWord.length !== 5) {
      customWordError = 'Enter exactly 5 letters.';
      return;
    }

    if (!isBetweenleWord(normalizedWord)) {
      customWordError = 'Use a valid 5-letter word from the Betweenle dictionary.';
      return;
    }

    customWordInput = normalizedWord;
    customWordError = '';
    const token = encodeCustomToken(normalizedWord);
    customToken = token ?? '';
    updateUrlParams({ customToken: customToken || null, dailyDate: null });
    mode = 'custom';
    resetRound(createBetweenleGameSetup('custom', { customWord: normalizedWord }));
  }

  function returnToMenu(): void {
    screen = 'menu';
    error = '';
    input = '';
  }

  function playAgain(): void {
    if (!setup) return;

    if (setup.mode === 'daily') {
      startDailyGame(selectedDate);
      return;
    }

    if (setup.mode === 'custom') {
      customWordInput = setup.word;
      startCustomGame();
      return;
    }

    startUnlimitedGame();
  }

  function handleTextInput(event: Event): void {
    input = sanitizeBetweenleWord((event.currentTarget as HTMLInputElement).value);
    error = '';
  }

  function handleCustomInput(event: Event): void {
    customWordInput = sanitizeBetweenleWord((event.currentTarget as HTMLInputElement).value);
    customWordError = '';
    customShareNotice = '';
    customShareLink = '';
  }

  function handleGuessInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();
    submitGuess();
  }

  function handleCustomInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();
    void createCustomShareLink();
  }

  async function createCustomShareLink(): Promise<void> {
    const normalizedWord = sanitizeBetweenleWord(customWordInput);

    if (normalizedWord.length !== 5) {
      customWordError = 'Enter exactly 5 letters.';
      customShareNotice = '';
      customShareLink = '';
      return;
    }

    if (!isBetweenleWord(normalizedWord)) {
      customWordError = 'Use a valid 5-letter word from the Betweenle dictionary.';
      customShareNotice = '';
      customShareLink = '';
      return;
    }

    const token = encodeCustomToken(normalizedWord);
    if (!token || typeof window === 'undefined') {
      customWordError = 'Could not generate custom link.';
      customShareNotice = '';
      customShareLink = '';
      return;
    }

    customWordInput = normalizedWord;
    customWordError = '';
    customToken = token;

    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('c', token);
    shareUrl.searchParams.delete('d');
    customShareLink = shareUrl.toString();

    try {
      await navigator.clipboard.writeText(customShareLink);
      customShareNotice = 'Custom link copied. Share it.';
    } catch {
      customShareNotice = 'Copy failed. Use the link below.';
    }
  }

  function appendKey(key: string): void {
    if (!setup || gameFinished) return;

    if (key === 'ENTER') {
      submitGuess();
      return;
    }

    if (key === 'BACKSPACE') {
      input = input.slice(0, -1);
      error = '';
      return;
    }

    if (/^[A-Z]$/.test(key) && input.length < 5) {
      input = `${input}${key.toLowerCase()}`;
      error = '';
    }
  }

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (screen !== 'game') return;

    if (event.key === 'Enter') {
      event.preventDefault();
      appendKey('ENTER');
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      appendKey('BACKSPACE');
      return;
    }

    appendKey(event.key.toUpperCase());
  }

  function submitGuess(): void {
    if (!setup || gameFinished) return;

    const guess = sanitizeBetweenleWord(input);

    if (guess.length !== 5) {
      error = 'Enter a 5-letter word.';
      return;
    }

    if (!isBetweenleWord(guess)) {
      error = 'Use a valid Betweenle word.';
      return;
    }

    const guessPosition = BETWEENLE_WORDS.indexOf(guess);
    if (guessPosition === -1) {
      error = 'Use a valid Betweenle word.';
      return;
    }

    const won = guess === setup.word;
    const direction = won
      ? 'match'
      : setup.secretPosition > guessPosition
        ? 'after'
        : 'before';

    let nextTopWord = topWord;
    let nextBottomWord = bottomWord;
    let nextTopPos = topPos;
    let nextBottomPos = bottomPos;

    if (direction === 'after') {
      nextTopWord = guess;
      nextTopPos = guessPosition;
    } else if (direction === 'before') {
      nextBottomWord = guess;
      nextBottomPos = guessPosition;
    }

    const distanceToTop = Math.abs(setup.secretPosition - nextTopPos);
    const distanceToBottom = Math.abs(setup.secretPosition - nextBottomPos);

    guesses = [
      ...guesses,
      {
        word: guess,
        position: guessPosition,
        direction,
        closerTo: distanceToTop <= distanceToBottom ? 'top' : 'bottom',
      },
    ];

    topWord = nextTopWord;
    bottomWord = nextBottomWord;
    topPos = nextTopPos;
    bottomPos = nextBottomPos;
    input = '';
    error = '';
  }

  function openCalendar(): void {
    viewMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    screen = 'calendar';
  }

  function previousMonth(): void {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
  }

  function nextMonth(): void {
    if (!canGoForwardMonth) return;
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
  }

  onMount(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const token = url.searchParams.get('c');
    if (token) {
      const decodedWord = decodeCustomToken(token);
      if (!decodedWord) {
        updateCustomParam(null);
        return;
      }

      customWordInput = decodedWord;
      customToken = token;
      mode = 'custom';
      resetRound(createBetweenleGameSetup('custom', { customWord: decodedWord }));
      return;
    }

    const dailyDate = parseDailyDateParam(url.searchParams.get('d'));
    if (dailyDate) {
      startDailyGame(dailyDate);
    }
  });
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<section class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
  <div class="border-b border-slate-200 bg-slate-100 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/70 sm:px-6">
    <h2 class="text-lg font-black uppercase tracking-[0.12em] text-slate-900 dark:text-white sm:text-xl">
      Betweenle Unlimited Game
    </h2>
  </div>

  {#if screen === 'menu'}
    <section class="px-4 py-8 sm:px-8 sm:py-10">
      <div class="mx-auto max-w-lg">
        <div class="grid grid-cols-2 gap-3">
          <button
            class="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg"
            onclick={() => startDailyGame(todayDate)}
            type="button"
          >
            Play Daily
          </button>
          <button
            class="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-700 px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg"
            onclick={startUnlimitedGame}
            type="button"
          >
            Unlimited
          </button>
          <button
            class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onclick={openCalendar}
            type="button"
          >
            Old Archive
          </button>
          <button
            class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onclick={() => (showCustomForm = !showCustomForm)}
            type="button"
          >
            Custom
          </button>
        </div>

        {#if showCustomForm}
          <div class="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div class="space-y-3">
              <input
                aria-label="Custom Betweenle secret word"
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-lg uppercase outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                maxlength="5"
                placeholder="Enter 5 letters"
                value={customWordInput}
                oninput={handleCustomInput}
                onkeydown={handleCustomInputKeydown}
              />
              <button
                class="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white"
                onclick={() => void createCustomShareLink()}
                type="button"
              >
                Get Share Link
              </button>
              {#if customShareNotice}
                <p class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {customShareNotice}
                </p>
              {/if}
              {#if customShareLink}
                <input
                  aria-label="Custom Betweenle share link"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  readonly
                  value={customShareLink}
                />
              {/if}
              {#if customWordError}
                <p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                  {customWordError}
                </p>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </section>
  {:else if screen === 'calendar'}
    <section class="px-4 py-8 sm:px-8 sm:py-10">
      <div class="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-6">
        <div class="mb-6 flex items-center justify-between gap-3">
          <button
            class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onclick={returnToMenu}
            type="button"
          >
            Back
          </button>
          <div class="text-center">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Choose a Date</p>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </p>
          </div>
          <div class="w-16"></div>
        </div>

        <div class="mb-4 flex items-center justify-between">
          <button
            class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onclick={previousMonth}
            type="button"
          >
            Prev
          </button>
          <button
            class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            disabled={!canGoForwardMonth}
            onclick={nextMonth}
            type="button"
          >
            Next
          </button>
        </div>

        <div class="grid grid-cols-7 gap-2">
          {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as weekDay}
            <div class="py-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {weekDay}
            </div>
          {/each}

          {#each calendarDays as day}
            {#if day.date}
              <button
                class={`relative h-12 rounded-2xl text-sm font-bold transition-all ${
                  day.disabled
                    ? 'cursor-not-allowed bg-slate-100 text-slate-300 dark:bg-slate-900/50 dark:text-slate-600'
                    : day.isToday
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
                } ${day.isSelected && !day.disabled ? 'ring-2 ring-indigo-300 dark:ring-indigo-700' : ''}`}
                disabled={day.disabled}
                onclick={() => day.date && startDailyGame(day.date)}
                type="button"
              >
                {day.day}
                {#if day.isToday && !day.disabled}
                  <span class="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white"></span>
                {/if}
              </button>
            {:else}
              <div class="h-12 rounded-2xl"></div>
            {/if}
          {/each}
        </div>

        <p class="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Available archive dates begin on {BETWEENLE_START_DATE.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}.
        </p>
      </div>
    </section>
  {:else if setup}
    <section class="px-4 py-8 sm:px-8 sm:py-10">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <button
          class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          onclick={returnToMenu}
          type="button"
        >
          Change Mode
        </button>
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
            {modeLabels[setup.mode]}
          </span>
          {#if setup.puzzleNumber}
            <span class="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Puzzle #{setup.puzzleNumber}
            </span>
          {/if}
        </div>
      </div>

      {#if setup.mode === 'custom' && customToken}
        <div class="mt-3 flex justify-end">
          <button
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onclick={copyCustomLink}
            type="button"
          >
            Copy Custom Link
          </button>
        </div>
      {/if}

      <div class="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p class="font-semibold text-slate-700 dark:text-slate-200">
            {setup.mode === 'daily' ? selectedDateLabel : `${modeLabels[setup.mode]} practice round`}
          </p>
          <p class="text-slate-500 dark:text-slate-400">Guess {guesses.length} / {maxGuessMarkers}</p>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          {#each Array.from({ length: maxGuessMarkers }) as _, index}
            <span
              class={`h-2.5 w-8 rounded-full ${
                index < Math.min(guesses.length, maxGuessMarkers)
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            ></span>
          {/each}
        </div>
      </div>

      <div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div class="flex items-stretch gap-3 sm:gap-6">
            <div class="flex w-12 shrink-0 flex-col items-center sm:w-16">
              <div class="rounded-2xl bg-indigo-600 px-2 py-2 text-xs font-black text-white sm:px-3 sm:text-sm">
                {barValues.top}{#if barValues.top !== '?'}%{/if}
              </div>
              <div class="relative my-2 w-1.5 flex-1 rounded-full bg-gradient-to-b from-indigo-500 via-slate-300 to-indigo-500 sm:my-3 sm:w-2">
                {#if barValues.closerTo === 'top'}
                  <span class="absolute left-1/2 top-5 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-orange-400 shadow-lg sm:h-6 sm:w-6"></span>
                {:else if barValues.closerTo === 'bottom'}
                  <span class="absolute bottom-5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-orange-400 shadow-lg sm:h-6 sm:w-6"></span>
                {:else}
                  <span class="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300"></span>
                {/if}
              </div>
              <div class="rounded-2xl bg-indigo-600 px-2 py-2 text-xs font-black text-white sm:px-3 sm:text-sm">
                {barValues.bottom}{#if barValues.bottom !== '?'}%{/if}
              </div>
            </div>

            <div class="min-w-0 flex-1 space-y-3 sm:space-y-4">
              <div class="space-y-2">
                <div class="flex justify-center gap-1 sm:gap-2">
                  {#each lettersFor(topWord) as letter}
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-lg font-black text-white shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                      {letter}
                    </div>
                  {/each}
                </div>
                {#if lastGuess?.direction === 'after' && !hasWon}
                  <p class="text-center text-[10px] font-bold uppercase tracking-[0.08em] text-indigo-600 dark:text-indigo-300 sm:text-xs sm:tracking-[0.16em]">
                    Secret is after this guess
                  </p>
                {/if}
              </div>

              {#if showLastGuessRow && lastGuess}
                <div class="space-y-2">
                  <div class="flex justify-center gap-1 sm:gap-2">
                    {#each lettersFor(lastGuess.word) as letter}
                      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-lg font-black text-white shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                        {letter}
                      </div>
                    {/each}
                  </div>
                  <p class="text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 sm:text-xs sm:tracking-[0.16em]">
                    Last guess
                  </p>
                </div>
              {/if}

              {#if !gameFinished}
                <div class="space-y-2">
                  <div class="flex justify-center gap-1 sm:gap-2">
                    {#each lettersFor(input) as letter}
                      <div
                        class={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl ${
                          input.length === 5
                            ? 'border-2 border-indigo-400 bg-white text-indigo-700 dark:bg-slate-950 dark:text-white'
                            : 'border-2 border-slate-200 bg-slate-50 text-slate-300 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-600'
                        }`}
                      >
                        {letter}
                      </div>
                    {/each}
                  </div>
                  <input
                    aria-label="Current guess"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-center font-mono text-base uppercase outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:px-4 sm:py-3 sm:text-lg"
                    maxlength="5"
                    placeholder="Type your guess"
                    value={input}
                    oninput={handleTextInput}
                    onkeydown={handleGuessInputKeydown}
                  />
                </div>
              {/if}

              <div class="space-y-2">
                <div class="flex justify-center gap-1 sm:gap-2">
                  {#each lettersFor(bottomWord) as letter}
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-lg font-black text-white shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                      {letter}
                    </div>
                  {/each}
                </div>
                {#if lastGuess?.direction === 'before' && !hasWon}
                  <p class="text-center text-[10px] font-bold uppercase tracking-[0.08em] text-indigo-600 dark:text-indigo-300 sm:text-xs sm:tracking-[0.16em]">
                    Secret is before this guess
                  </p>
                {/if}
              </div>
            </div>
          </div>

          {#if error}
            <p class="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </p>
          {/if}

          {#if copiedNotice}
            <p class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              {copiedNotice}
            </p>
          {/if}

          {#if hasWon}
            <div class="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Solved</p>
              <p class="mt-3 text-4xl font-black uppercase tracking-[0.22em] text-slate-900 dark:text-white">
                {activeWord}
              </p>
              <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
                You found the word in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}.
              </p>
              <div class="mt-5 flex flex-wrap gap-3">
                <button
                  class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white"
                  onclick={() => copyText(activeWord.toUpperCase(), 'Answer copied.')}
                  type="button"
                >
                  Copy Answer
                </button>
                <button
                  class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  onclick={playAgain}
                  type="button"
                >
                  Play Again
                </button>
              </div>
            </div>
          {/if}
        </div>

        <aside class="space-y-5">
          <div class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-5">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">On-screen keyboard</p>
            <div class="mt-4 space-y-2">
              {#each ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'] as row, rowIndex}
                <div class="flex justify-center gap-1 sm:gap-1.5">
                  {#if rowIndex === 2}
                    <button
                      class="rounded-xl bg-slate-900 px-2 py-2.5 text-[9px] font-bold text-white dark:bg-slate-950 sm:px-3 sm:py-3 sm:text-xs"
                      onclick={() => appendKey('ENTER')}
                      type="button"
                    >
                      ENTER
                    </button>
                  {/if}
                  {#each row.split('') as key}
                    <button
                      class="flex h-9 w-6 items-center justify-center rounded-xl bg-white text-[11px] font-bold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200 sm:h-11 sm:w-8 sm:text-sm"
                      onclick={() => appendKey(key)}
                      type="button"
                    >
                      {key}
                    </button>
                  {/each}
                  {#if rowIndex === 2}
                    <button
                      class="rounded-xl bg-slate-900 px-2 py-2.5 text-[9px] font-bold text-white dark:bg-slate-950 sm:px-3 sm:py-3 sm:text-xs"
                      onclick={() => appendKey('BACKSPACE')}
                      type="button"
                    >
                      DEL
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Guess log</p>
            {#if guesses.length === 0}
              <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Start with a strong middle word, then keep splitting the alphabetical range.
              </p>
            {:else}
              <div class="mt-4 space-y-3">
                {#each [...guesses].reverse() as guess}
                  <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                    <div class="flex items-center justify-between gap-3">
                      <span class="font-mono text-base font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                        {guess.word}
                      </span>
                      <span class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {guess.direction === 'match'
                          ? 'Match'
                          : guess.direction === 'after'
                            ? 'Secret After'
                            : 'Secret Before'}
                      </span>
                    </div>
                    {#if guess.direction !== 'match'}
                      <p class="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Closer bound: {guess.closerTo}
                      </p>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </aside>
      </div>
    </section>
  {/if}

</section>
