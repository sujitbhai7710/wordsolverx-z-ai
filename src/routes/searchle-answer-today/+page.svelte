<script lang="ts">
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    getSearchleArchive,
    getSearchleMonthPuzzles,
    getSearchlePuzzleForDate
  } from '$lib/searchle/searchleSolver';
  import { SEARCHLE_PUZZLES } from '$lib/searchle/searchleData';
  import {
    generateFAQSchema,
    generateHowToSchema,
    generateWebPageSchema
  } from '$lib/seo';
  import { getISTToday } from '$lib/utils';

  interface DailyPuzzle {
    date: string;
    prompt: string;
    answer: string;
  }

  const today = getISTToday();
  const totalPuzzles = SEARCHLE_PUZZLES.length;
  let currentDate = $state(new Date(today.getFullYear(), today.getMonth(), 1));
  let revealedAnswers = $state<Set<string>>(new Set());
  let copiedWord = $state<string | null>(null);

  let todayPuzzle: DailyPuzzle = getSearchlePuzzleForDate(today);
  let archive: DailyPuzzle[] = getSearchleArchive(today, 7).map((p) => ({
    date: p.date,
    prompt: p.prompt,
    answer: p.answer
  }));

  const currentYear = $derived(currentDate.getFullYear());
  const currentMonth = $derived(currentDate.getMonth());
  const monthPuzzles = $derived.by((): DailyPuzzle[] =>
    getSearchleMonthPuzzles(currentYear, currentMonth)
  );

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function formatDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function getPuzzleForDate(dateKey: string): DailyPuzzle | null {
    if (todayPuzzle && todayPuzzle.date === dateKey) return todayPuzzle;
    const archivePuzzle = archive.find((a) => a.date === dateKey);
    if (archivePuzzle) return archivePuzzle;
    return monthPuzzles.find((p) => p.date === dateKey) || null;
  }

  function prevMonth() {
    currentDate = new Date(currentYear, currentMonth - 1, 1);
  }

  function nextMonth() {
    currentDate = new Date(currentYear, currentMonth + 1, 1);
  }

  function toggleReveal(dateKey: string) {
    const next = new Set(revealedAnswers);
    if (next.has(dateKey)) {
      next.delete(dateKey);
    } else {
      next.add(dateKey);
    }
    revealedAnswers = next;
  }

  async function copyToClipboard(text: string) {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(text);
    copiedWord = text;
    setTimeout(() => {
      copiedWord = null;
    }, 2000);
  }

  function formatDisplayDate(dateKey: string): string {
    return new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const todayLabel = $derived(formatDisplayDate(todayPuzzle.date));
  const pageTitle = $derived(`Searchle Hints and Answer for Today (${todayLabel})`);
  const pageDescription = $derived(`Get Searchle hints and the confirmed Searchle answer for today, ${todayLabel}. Browse past Searchle puzzles with the calendar and copy answers instantly.`);
  const pageKeywords = $derived(`searchle answer today, searchle answer, searchle hint, searchle hint today, searchle answer for ${todayLabel}`);

  const calendarDays = $derived.by(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i += 1) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(day);
    }
    return days;
  });

  const faqs = [
    {
      question: 'What is Searchle?',
      answer:
        'Searchle is a daily puzzle where you guess the missing word in a Google autocomplete prompt.'
    },
    {
      question: 'How are Searchle answers calculated?',
      answer:
        'Searchle answers are mapped by date from the original Searchle puzzle list and update daily.'
    },
    {
      question: 'Can I see past Searchle answers?',
      answer:
        'Yes. Use the calendar to browse any previous day and reveal its answer.'
    },
    {
      question: 'Where does the data come from?',
      answer:
        'The answer list is based on the real Searchle puzzle dataset.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const howToSchema = generateHowToSchema('How to use the Searchle answer calendar', [
    { name: 'Open the calendar', text: 'Navigate month by month to find a puzzle date.' },
    { name: 'Select a day', text: 'Click a date to reveal the answer for that day.' },
    { name: 'Copy the answer', text: 'Use the copy button for quick sharing.' }
  ]);
  const webPageSchema = $derived(
    generateWebPageSchema(pageTitle, pageDescription, 'https://wordsolverx.com/searchle-answer-today')
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolverx.com/searchle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://wordsolverx.com/searchle-answer-today" />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
        <span>{totalPuzzles.toLocaleString('en-US')} Real Puzzles from Searchle</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Searchle Hints and Answer for Today ({todayLabel})
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        Today&apos;s answer and past puzzles with calendar navigation.
      </p>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8">
      <div class="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <div class="p-6 text-center">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-sm font-semibold">Today&apos;s Searchle</span>
          <span class="text-xs px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {todayPuzzle.date}
          </span>
        </div>
        <div class="text-lg text-slate-600 dark:text-slate-400 mb-4 italic">
          "{todayPuzzle.prompt}"
        </div>
        <div class="font-mono text-5xl font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-6">
          {todayPuzzle.answer}
        </div>
        <div class="flex justify-center gap-3 flex-wrap">
          <button
            type="button"
            on:click={() => copyToClipboard(todayPuzzle.answer.toUpperCase())}
            class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm"
          >
            {copiedWord === todayPuzzle.answer.toUpperCase() ? 'Copied' : 'Copy Answer'}
          </button>
          <a
            href="/searchle-solver"
            class="px-3 py-2 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-600"
          >
            Open Solver
          </a>
        </div>
      </div>
    </div>

    {#if archive.length > 0}
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl mb-6">
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-base font-semibold">Recent Answers</h2>
        </div>
        <div class="px-6 pb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {#each archive.slice(0, 8) as puzzle}
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div class="text-xs text-slate-500 mb-1">{puzzle.date}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400 truncate mb-1">
                {puzzle.prompt.replace('...', '')}...
              </div>
              <div class="font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                {puzzle.answer}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg">
      <div class="px-6 pt-6 pb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">Browse by Date</h2>
        <div class="flex items-center gap-2">
          <button type="button" on:click={prevMonth} class="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg">
            &lt;
          </button>
          <span class="font-medium min-w-[140px] text-center">
            {MONTHS[currentMonth]} {currentYear}
          </span>
          <button type="button" on:click={nextMonth} class="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg">
            &gt;
          </button>
        </div>
      </div>
      <div class="px-6 pb-6">
        <div class="grid grid-cols-7 gap-1 mb-2">
          {#each DAYS as day}
            <div class="text-center text-xs font-medium text-slate-500 py-2">{day}</div>
          {/each}
        </div>
        <div class="grid grid-cols-7 gap-1">
          {#each calendarDays as day}
            {#if day === null}
              <div class="h-24" />
            {:else}
              {@const dateKey = formatDateKey(currentYear, currentMonth, day)}
              {@const puzzle = getPuzzleForDate(dateKey)}
              {@const isToday = dateKey === todayKey}
              {@const isRevealed = revealedAnswers.has(dateKey)}
              {@const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())}
              <button
                type="button"
                on:click={() => puzzle && toggleReveal(dateKey)}
                disabled={!puzzle}
                class={`h-24 rounded-lg border-2 p-1.5 transition-all text-left ${isToday ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'border-transparent'} ${puzzle ? 'hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer' : 'opacity-50 cursor-default'}`}
              >
                <div class={`text-xs font-medium mb-1 ${isToday ? 'text-purple-600' : 'text-slate-500'}`}>{day}</div>
                {#if puzzle}
                  <div class="flex-1 overflow-hidden">
                    {#if isRevealed || isPast}
                      <div class="space-y-0.5">
                        <div class="text-[9px] text-slate-400 truncate">
                          {puzzle.prompt.replace('...', '')}
                        </div>
                        <div class="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase truncate">
                          {puzzle.answer}
                        </div>
                      </div>
                    {:else}
                      <div class="flex items-center justify-center h-12 text-slate-300">Hidden</div>
                    {/if}
                  </div>
                {/if}
              </button>
            {/if}
          {/each}
        </div>
        <div class="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded bg-purple-500" />
            <span>Searchle Answer</span>
          </div>
          <div class="flex items-center gap-2">
            <span>Hidden until revealed</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <a href="/searchle-solver" class="block">
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg rounded-2xl p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">Solver</div>
          <div class="flex-1">
            <h3 class="font-bold text-lg">Try the Solver</h3>
            <p class="text-purple-100 text-sm">Use the solver to crack any Searchle puzzle</p>
          </div>
          <span>&gt;</span>
        </div>
      </a>
    </div>
  </main>

  <FAQSection {faqs} />
</div>
