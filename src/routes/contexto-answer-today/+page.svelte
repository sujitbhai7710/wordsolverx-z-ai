<script lang="ts">
  import { onMount } from 'svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    formatContextoDate,
    getContextoDateFromGameNumber,
    getContextoGameNumber
  } from '$lib/contexto';
  import {
    generateFAQSchema,
    generateHowToSchema,
    generateWebPageSchema
  } from '$lib/seo';
  import { getUTCToday } from '$lib/utils';

  interface ContextoAnswer {
    success: boolean;
    gameNumber: number;
    date: string;
    answer?: string;
    error?: string;
  }

  let { data }: { data: { initialAnswer: ContextoAnswer | null; latestDate: string | null; error: string | null } } = $props();

  function parseDateKey(dateKey: string): Date {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const latestAvailableDate = data?.latestDate ? parseDateKey(data.latestDate) : getUTCToday();
  let selectedDate = $state(new Date(latestAvailableDate.getFullYear(), latestAvailableDate.getMonth(), latestAvailableDate.getDate()));
  let currentMonth = $state(new Date(latestAvailableDate.getFullYear(), latestAvailableDate.getMonth(), 1));
  let answer = $state<ContextoAnswer | null>(data?.initialAnswer ?? null);
  let isLoading = $state(false);
  let showAnswer = $state(false);
  let gameNumberInput = $state('');
  let error = $state<string | null>(data?.error ?? null);

  if (data?.initialAnswer?.date) {
    const [year, month, day] = data.initialAnswer.date.split('-').map(Number);
    selectedDate = new Date(year, month - 1, day);
    currentMonth = new Date(year, month - 1, 1);
  }

  async function fetchAnswer(date: Date) {
    isLoading = true;
    error = null;
    showAnswer = false;

    const dateStr = formatContextoDate(date);
    try {
      const response = await fetch(`/api/contexto/daily?date=${dateStr}`);
      const payload: ContextoAnswer = await response.json();
      if (!payload.success) {
        answer = null;
        error = payload.error || 'Failed to fetch answer';
      } else {
        answer = payload;
      }
    } catch (err) {
      error = 'Failed to fetch answer. Please try again.';
      answer = null;
    } finally {
      isLoading = false;
    }
  }

  async function fetchByGameNumber() {
    const gameNum = Number.parseInt(gameNumberInput, 10);
    if (Number.isNaN(gameNum) || gameNum < 1) {
      error = 'Please enter a valid game number';
      return;
    }

    isLoading = true;
    error = null;
    showAnswer = false;

    try {
      const response = await fetch(`/api/contexto/daily?game=${gameNum}`);
      const payload: ContextoAnswer = await response.json();

      if (payload.success) {
        answer = payload;
        const date = getContextoDateFromGameNumber(gameNum);
        selectedDate = date;
        currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      } else {
        answer = null;
        error = payload.error || 'Game not found';
      }
    } catch (err) {
      error = 'Failed to fetch answer. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    if (!answer && !error) {
      void fetchAnswer(selectedDate);
    }
  });

  function generateCalendarDays(): (Date | null)[] {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startDay; i += 1) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  function prevMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  }

  function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }

  function isToday(date: Date) {
    return date.toDateString() === latestAvailableDate.toDateString();
  }

  function isSelected(date: Date) {
    return date.toDateString() === selectedDate.toDateString();
  }

  function isFuture(date: Date) {
    return date > latestAvailableDate;
  }

  function handleDateClick(date: Date) {
    if (isFuture(date)) return;
    selectedDate = date;
    void fetchAnswer(date);
  }

  function goToToday() {
    selectedDate = new Date(latestAvailableDate.getFullYear(), latestAvailableDate.getMonth(), latestAvailableDate.getDate());
    currentMonth = new Date(latestAvailableDate.getFullYear(), latestAvailableDate.getMonth(), 1);
    void fetchAnswer(latestAvailableDate);
  }

  function calendarButtonClass(date: Date) {
    const classes = ['w-full', 'h-full', 'flex', 'items-center', 'justify-center', 'rounded-lg', 'text-sm', 'transition-all'];
    if (isSelected(date)) {
      classes.push('bg-purple-500', 'text-white');
    } else if (isToday(date)) {
      classes.push('bg-purple-100', 'dark:bg-purple-900/30', 'text-purple-600', 'dark:text-purple-400');
    } else if (isFuture(date)) {
      classes.push('text-slate-300', 'dark:text-slate-700', 'cursor-not-allowed');
    } else {
      classes.push('hover:bg-slate-100', 'dark:hover:bg-slate-800');
    }
    return classes.join(' ');
  }

  const calendarDays = $derived(generateCalendarDays());
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function formatDisplayDate(dateKey: string): string {
    return new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  let metaDateLabel = $derived(answer?.date ? formatDisplayDate(answer.date) : formatDisplayDate(formatContextoDate(selectedDate)));
  let pageTitle = $derived(`Contexto Hints and Answer for Today (${metaDateLabel})`);
  let pageDescription = $derived(`Get Contexto hints and the confirmed Contexto answer for today, ${metaDateLabel}. Use the game-number lookup and calendar to browse past Contexto answers too.`);
  let pageKeywords = $derived(`contexto answer today, contexto answer, contexto hint, contexto hint today, contexto answer for ${metaDateLabel}`);

  const faqs = [
    {
      question: 'What is Contexto?',
      answer:
        'Contexto is a daily word guessing game where you find the secret word based on semantic closeness.'
    },
    {
      question: 'How is the game number calculated?',
      answer:
        'Contexto game numbers increment by one each day. Enter a game number to jump directly to that date.'
    },
    {
      question: 'Can I view previous Contexto answers?',
      answer:
        'Yes. Use the calendar to pick any past date and reveal the answer for that day.'
    },
    {
      question: 'Where does the data come from?',
      answer:
        'Answers are fetched directly from the official Contexto API.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const howToSchema = generateHowToSchema('How to use the Contexto answer calendar', [
    { name: 'Choose a date', text: 'Select any past day from the calendar grid.' },
    { name: 'Reveal the answer', text: 'Tap reveal to show the Contexto answer.' },
    { name: 'Search by game number', text: 'Enter a game number to jump to that exact date.' }
  ]);
  let webPageSchema = $derived(generateWebPageSchema(pageTitle, pageDescription, 'https://wordsolverx.com/contexto-answer-today'));
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolverx.com/contexto-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <link rel="canonical" href="https://wordsolverx.com/contexto-answer-today" />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
        <span>Daily Contexto Answers</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Contexto Hints and Answer for Today ({metaDateLabel})
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        A cleaner daily answer page with quick lookup first and archive browsing second.
      </p>
    </div>

    <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden mb-10">
      <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-6 text-white">
        <p class="text-sm uppercase tracking-[0.2em] text-violet-100 mb-2">Answer Today</p>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-sm">
            Game #{answer?.gameNumber ?? getContextoGameNumber(selectedDate)}
          </span>
          <span class="text-sm text-violet-100">
            {answer?.date ?? formatContextoDate(selectedDate)}
          </span>
        </div>
      </div>

      <div class="p-6 md:p-8">
        {#if isLoading}
          <div class="text-center py-12 text-slate-500">Loading...</div>
        {:else if error}
          <div class="text-center py-6">
            <p class="text-red-500">{error}</p>
            <button
              type="button"
              on:click={() => fetchAnswer(selectedDate)}
              class="mt-4 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              Retry
            </button>
          </div>
        {:else if answer?.success}
          <div class="grid lg:grid-cols-[1.4fr_0.9fr] gap-6 items-start">
            <div>
              <div class={`rounded-3xl border-2 transition-all p-6 md:p-8 ${showAnswer ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700' : 'bg-slate-50 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700'}`}>
                <p class="text-sm text-slate-500 mb-3">The Contexto answer for this day</p>
                {#if showAnswer}
                  <p class="text-4xl md:text-6xl font-black tracking-tight text-violet-600 dark:text-violet-300 capitalize">
                    {answer.answer}
                  </p>
                {:else}
                  <p class="text-2xl md:text-4xl font-bold text-slate-400">Answer hidden</p>
                {/if}
              </div>

              <div class="flex gap-3 flex-wrap mt-5">
                <button
                  type="button"
                  on:click={() => (showAnswer = !showAnswer)}
                  class={`px-5 py-3 rounded-xl text-white font-medium ${showAnswer ? 'bg-slate-600 hover:bg-slate-700' : 'bg-violet-600 hover:bg-violet-700'}`}
                >
                  {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                </button>
                <button
                  type="button"
                  on:click={goToToday}
                  class="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Jump to Today
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-5">
                <h2 class="text-base font-semibold mb-3">Search by Game Number</h2>
                <div class="flex gap-2">
                  <input
                    type="number"
                    value={gameNumberInput}
                    on:input={(event) => (gameNumberInput = (event.currentTarget as HTMLInputElement).value)}
                    placeholder="Enter game number"
                    class="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3"
                  />
                  <button
                    type="button"
                    on:click={fetchByGameNumber}
                    disabled={!gameNumberInput || isLoading}
                    class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Go
                  </button>
                </div>
                <p class="text-xs text-slate-500 mt-3">
                  Game #{getContextoGameNumber(selectedDate)} matches
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div class="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white p-5">
                <p class="font-semibold mb-1">Play Contexto</p>
                <p class="text-sm text-purple-100 mb-4">Open the official puzzle after checking the answer.</p>
                <a
                  href="https://contexto.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex px-4 py-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/20"
                >
                  Open contexto.me
                </a>
              </div>
            </div>
          </div>
        {:else}
          <div class="text-center py-6 text-slate-500">Select a date to view the answer</div>
        {/if}
      </div>
    </section>

    <FAQSection title="Contexto Archive FAQ" {faqs} class="pb-0" />

    <section class="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg overflow-hidden">
      <div class="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold">Browse Older Answers</h2>
          <p class="text-xs text-slate-300">Compact archive calendar</p>
        </div>
        <button
          type="button"
          on:click={goToToday}
          class="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/20"
        >
          Today
        </button>
      </div>

      <div class="p-5">
        <div class="flex items-center justify-between mb-4">
          <button type="button" on:click={prevMonth} class="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            &lt;
          </button>
          <h3 class="font-semibold text-sm">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            type="button"
            on:click={nextMonth}
            class="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            disabled={currentMonth.getMonth() === latestAvailableDate.getMonth() && currentMonth.getFullYear() === latestAvailableDate.getFullYear()}
          >
            &gt;
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          {#each weekDays as day}
            <div class="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400 py-1">{day}</div>
          {/each}
        </div>

        <div class="grid grid-cols-7 gap-1">
          {#each calendarDays as date}
            <div class="aspect-square">
              {#if date}
                <button
                  type="button"
                  on:click={() => handleDateClick(date)}
                  disabled={isFuture(date)}
                  class={`${calendarButtonClass(date)} border ${isSelected(date) ? 'border-violet-300 dark:border-violet-600' : 'border-transparent'} text-sm`}
                >
                  {date.getDate()}
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </section>
  </main>
</div>
