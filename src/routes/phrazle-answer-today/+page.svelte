<script lang="ts">
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { REFERENCE_DATE, TOTAL_PHRASES, getAnswerForDate } from '$lib/phrazle/phrases';
  import { generateFAQSchema, generateHowToSchema, generateWebPageSchema } from '$lib/seo';

  interface PhrazleAnswer {
    phrase: string;
    index: number;
    wordCount: number;
  }

  interface PhrazleDayAnswers {
    date: string;
    morning: PhrazleAnswer;
    afternoon: PhrazleAnswer;
  }

  const today = new Date();
  const referenceDate = REFERENCE_DATE;

  let selectedDate = $state(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  let currentMonth = $state(new Date(today.getFullYear(), today.getMonth(), 1));

  let showMorningAnswer = $state(true);
  let showAfternoonAnswer = $state(true);
  let copiedWord = $state<string | null>(null);

  function formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function getDayAnswers(date: Date): PhrazleDayAnswers {
    const morning = getAnswerForDate(date, 'morning');
    const afternoon = getAnswerForDate(date, 'afternoon');
    return {
      date: formatDateKey(date),
      morning: {
        phrase: morning.phrase,
        index: morning.index,
        wordCount: morning.phrase.split(' ').length
      },
      afternoon: {
        phrase: afternoon.phrase,
        index: afternoon.index,
        wordCount: afternoon.phrase.split(' ').length
      }
    };
  }

  let todayAnswers: PhrazleDayAnswers = getDayAnswers(today);
  let selectedAnswers = $state<PhrazleDayAnswers>(getDayAnswers(selectedDate));

  $effect(() => {
    selectedAnswers = getDayAnswers(selectedDate);
  });

  function getRecentAnswers(count: number): PhrazleDayAnswers[] {
    const recent: PhrazleDayAnswers[] = [];
    for (let i = 1; i <= count; i += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (date < referenceDate) break;
      recent.push(getDayAnswers(date));
    }
    return recent;
  }

  const recentAnswers = getRecentAnswers(6);

  const currentYear = $derived(currentMonth.getFullYear());
  const currentMonthIndex = $derived(currentMonth.getMonth());

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function isSameDate(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function isToday(date: Date) {
    return isSameDate(date, today);
  }

  function isSelected(date: Date) {
    return isSameDate(date, selectedDate);
  }

  function isFuture(date: Date) {
    const check = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayCheck = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return check > todayCheck;
  }

  function isBeforeReference(date: Date) {
    return date < new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  }

  function isValidDate(date: Date) {
    return !isFuture(date) && !isBeforeReference(date);
  }

  function prevMonth() {
    currentMonth = new Date(currentYear, currentMonthIndex - 1, 1);
  }

  function nextMonth() {
    currentMonth = new Date(currentYear, currentMonthIndex + 1, 1);
  }

  function handleDateClick(date: Date) {
    if (!isValidDate(date)) return;
    selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    showMorningAnswer = true;
    showAfternoonAnswer = true;
  }

  async function copyToClipboard(text: string) {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(text);
    copiedWord = text;
    setTimeout(() => {
      copiedWord = null;
    }, 2000);
  }

  const calendarDays = $derived.by(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonthIndex);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i += 1) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(day);
    }
    return days;
  });

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const faqs = [
    {
      question: 'What is Phrazle?',
      answer:
        'Phrazle is a daily phrase guessing game with two puzzles each day, a morning puzzle and an afternoon puzzle.'
    },
    {
      question: 'How are Phrazle answers calculated?',
      answer:
        'Answers are mapped by date using the official Phrazle phrase list and the game schedule that starts on April 18, 2022.'
    },
    {
      question: 'Can I view previous Phrazle answers?',
      answer:
        'Yes. Use the calendar to select any past date and see both the morning and afternoon answers.'
    },
    {
      question: 'Why are there two puzzles?',
      answer:
        'Phrazle releases two puzzles per day, so each date has a morning phrase and an afternoon phrase.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const howToSchema = generateHowToSchema('How to use the Phrazle answer calendar', [
    { name: 'Choose a date', text: 'Select any past date from the calendar grid.' },
    { name: 'View the answers', text: 'See both the morning and afternoon phrases for that day.' },
    { name: 'Copy an answer', text: 'Use the copy button to save a phrase.' }
  ]);
  const webPageSchema = generateWebPageSchema(
    'Phrazle Answer Today',
    'Today\'s Phrazle answers plus an archive calendar for previous morning and afternoon puzzles.',
    'https://wordsolverx.com/phrazle-answer-today'
  );
</script>

<svelte:head>
  <title>Phrazle Answer Today - Daily Phrazle Phrases | WordSolverX</title>
  <meta
    name="description"
    content="Get today's Phrazle answers for both morning and afternoon puzzles, plus browse past phrases with the Phrazle calendar."
  />
  <meta
    name="keywords"
    content="phrazle answer today, phrazle answers, phrazle daily, phrazle archive, phrazle calendar"
  />
  <meta property="og:title" content="Phrazle Answer Today - Daily Phrazle Phrases" />
  <meta
    property="og:description"
    content="View today's Phrazle answers and browse previous phrases using the calendar."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolverx.com/phrazle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Phrazle Answer Today - Daily Phrazle Phrases" />
  <meta
    name="twitter:description"
    content="See both Phrazle answers for today and browse older phrase answers with the compact archive calendar."
  />
  <link rel="canonical" href="https://wordsolverx.com/phrazle-answer-today" />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
        <span>{TOTAL_PHRASES.toLocaleString('en-US')} Phrase Library</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Phrazle Answers Today
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        Two puzzles every day. Morning and afternoon answers with a full archive calendar.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-amber-400 to-orange-400"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-amber-600 mb-2">Morning Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{todayAnswers.date}</div>
          {#if showMorningAnswer}
            <div class="font-mono text-3xl font-bold text-amber-600 uppercase mb-2">
              {todayAnswers.morning.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{todayAnswers.morning.index}</div>
          <div class="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              on:click={() => (showMorningAnswer = !showMorningAnswer)}
              class="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600"
            >
              {showMorningAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {#if showMorningAnswer}
              <button
                type="button"
                on:click={() => copyToClipboard(todayAnswers.morning.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-amber-200 text-sm"
              >
                {copiedWord === todayAnswers.morning.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-indigo-600 mb-2">Afternoon Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{todayAnswers.date}</div>
          {#if showAfternoonAnswer}
            <div class="font-mono text-3xl font-bold text-indigo-600 uppercase mb-2">
              {todayAnswers.afternoon.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{todayAnswers.afternoon.index}</div>
          <div class="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              on:click={() => (showAfternoonAnswer = !showAfternoonAnswer)}
              class="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600"
            >
              {showAfternoonAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {#if showAfternoonAnswer}
              <button
                type="button"
                on:click={() => copyToClipboard(todayAnswers.afternoon.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-indigo-200 text-sm"
              >
                {copiedWord === todayAnswers.afternoon.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>

    {#if recentAnswers.length > 0}
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl mb-8">
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-base font-semibold">Recent Phrazle Answers</h2>
          <p class="text-xs text-slate-500">Last {recentAnswers.length} days</p>
        </div>
        <div class="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {#each recentAnswers as day}
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div class="text-xs text-slate-500 mb-2">{day.date}</div>
              <div class="text-sm text-amber-600 font-semibold uppercase truncate mb-1">
                {day.morning.phrase}
              </div>
              <div class="text-sm text-indigo-600 font-semibold uppercase truncate">
                {day.afternoon.phrase}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg overflow-hidden mb-8">
      <div class="px-5 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 text-white flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold">Archive Calendar</h2>
          <p class="text-xs text-emerald-100">Compact browser for past phrase pairs</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" on:click={prevMonth} class="h-8 w-8 rounded-full bg-white/10 border border-white/10 hover:bg-white/20">
            &lt;
          </button>
          <span class="text-sm font-semibold min-w-[120px] text-center">
            {MONTHS[currentMonthIndex]} {currentYear}
          </span>
          <button type="button" on:click={nextMonth} class="h-8 w-8 rounded-full bg-white/10 border border-white/10 hover:bg-white/20">
            &gt;
          </button>
        </div>
      </div>
      <div class="px-5 py-5">
        <div class="grid grid-cols-7 gap-1.5 mb-2">
          {#each DAYS as day}
            <div class="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400 py-1">{day}</div>
          {/each}
        </div>
        <div class="grid grid-cols-7 gap-1.5">
          {#each calendarDays as day}
            {#if day === null}
              <div class="h-14" />
            {:else}
              {@const date = new Date(currentYear, currentMonthIndex, day)}
              {@const valid = isValidDate(date)}
              <button
                type="button"
                disabled={!valid}
                on:click={() => handleDateClick(date)}
                class={`h-14 rounded-2xl border p-1 transition-all text-center ${isSelected(date) ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-200/60 dark:ring-emerald-800/40' : 'border-slate-200 dark:border-slate-800'} ${valid ? 'hover:border-emerald-300 hover:-translate-y-0.5 cursor-pointer' : 'opacity-40 cursor-default bg-slate-50 dark:bg-slate-950'}`}
              >
                <div class={`text-sm font-semibold ${isToday(date) ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'}`}>{day}</div>
                {#if valid}
                  <div class="text-[9px] text-slate-400">AM PM</div>
                {/if}
              </button>
            {/if}
          {/each}
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8">
      <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 class="text-lg font-semibold">Selected Date Answers</h2>
        <div class="text-sm text-slate-500">{formatDateKey(selectedDate)}</div>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="rounded-xl border border-amber-200 dark:border-amber-800/40 p-4 bg-amber-50/60 dark:bg-amber-900/10">
          <div class="text-xs uppercase text-amber-600 mb-2">Morning</div>
          <div class="font-mono text-lg font-bold text-amber-700 uppercase mb-1">
            {selectedAnswers.morning.phrase}
          </div>
          <div class="text-xs text-slate-500">Phrase #{selectedAnswers.morning.index}</div>
          <button
            type="button"
            on:click={() => copyToClipboard(selectedAnswers.morning.phrase.toUpperCase())}
            class="mt-3 px-3 py-1.5 rounded-lg border border-amber-200 text-xs"
          >
            {copiedWord === selectedAnswers.morning.phrase.toUpperCase() ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div class="rounded-xl border border-indigo-200 dark:border-indigo-800/40 p-4 bg-indigo-50/60 dark:bg-indigo-900/10">
          <div class="text-xs uppercase text-indigo-600 mb-2">Afternoon</div>
          <div class="font-mono text-lg font-bold text-indigo-700 uppercase mb-1">
            {selectedAnswers.afternoon.phrase}
          </div>
          <div class="text-xs text-slate-500">Phrase #{selectedAnswers.afternoon.index}</div>
          <button
            type="button"
            on:click={() => copyToClipboard(selectedAnswers.afternoon.phrase.toUpperCase())}
            class="mt-3 px-3 py-1.5 rounded-lg border border-indigo-200 text-xs"
          >
            {copiedWord === selectedAnswers.afternoon.phrase.toUpperCase() ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  </main>

  <FAQSection {faqs} />
</div>
