<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { formatBetweenleDate, parseDateKey } from '$lib/betweenle/logic';
  import type { BetweenleDailyAnswer } from '$lib/betweenle/types';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateWebPageSchema,
  } from '$lib/seo';

  let { data } = $props();

  const faqs = [
    {
      question: 'What is the Betweenle answer today?',
      answer:
        'The Betweenle answer today is shown at the top of this page. It updates automatically with the current daily puzzle word.',
    },
    {
      question: 'Can I check old Betweenle answers?',
      answer:
        'Yes. Use the calendar archive on this page to select any available Betweenle date and reveal that day’s answer below the calendar.',
    },
    {
      question: 'How is the Betweenle puzzle number calculated?',
      answer:
        'The puzzle number increases by one each day starting from the first Betweenle daily puzzle. Each archive answer on this page includes its matching puzzle number.',
    },
    {
      question: 'Does the Betweenle answer page include the daily archive?',
      answer:
        'Yes. This page works as both a Betweenle answer today page and a full Betweenle archive browser with date-based lookup.',
    },
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Betweenle answer archive', [
      {
        name: 'Check the answer at the top',
        text: 'The current Betweenle answer is displayed first so you can see today’s puzzle word immediately.',
      },
      {
        name: 'Read the FAQs',
        text: 'The FAQ section explains how the Betweenle archive and daily answer logic work.',
      },
      {
        name: 'Browse the calendar',
        text: 'Select any available day in the calendar to reveal that archived Betweenle answer below.',
      },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Betweenle Answer Today',
      description: data.meta.description,
      mainEntityOfPage: data.meta.canonical,
      datePublished: `${data.todayAnswer.date}T00:00:00Z`,
      dateModified: `${data.todayAnswer.date}T00:00:00Z`,
      author: {
        '@type': 'Organization',
        name: 'WordSolverX',
      },
      publisher: {
        '@type': 'Organization',
        name: 'WordSolverX',
      },
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Today', url: 'https://wordsolverx.com/today' },
      { name: 'Betweenle Answer Today', url: data.meta.canonical },
    ]),
    generateWebPageSchema('Betweenle Answer Today', data.meta.description, data.meta.canonical),
  ]);

  let selectedDate = $state<string | null>(null);
  let currentMonth = $state<Date>(parseDateKey(data.todayAnswer.date));

  const archive = data.archive as BetweenleDailyAnswer[];

  let selectedAnswer = $derived.by(() =>
    selectedDate ? archive.find((entry) => entry.date === selectedDate) ?? null : null
  );

  let days = $derived.by(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dayCount = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const entries: Array<{
      date: string;
      day: number;
      hasAnswer: boolean;
      isToday: boolean;
      isFuture: boolean;
    }> = [];

    for (let i = 0; i < startingDay; i += 1) {
      entries.push({ date: '', day: 0, hasAnswer: false, isToday: false, isFuture: false });
    }

    for (let day = 1; day <= dayCount; day += 1) {
      const date = new Date(year, month, day);
      const dateKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');

      entries.push({
        date: dateKey,
        day,
        hasAnswer: archive.some((entry) => entry.date === dateKey),
        isToday: dateKey === data.todayAnswer.date,
        isFuture: dateKey > data.todayAnswer.date,
      });
    }

    return entries;
  });

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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function previousMonth(): void {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  }

  function nextMonth(): void {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }

  async function copyToClipboard(word: string): Promise<void> {
    await navigator.clipboard.writeText(word.toUpperCase());
  }
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta
    name="keywords"
    content="betweenle answer today, betweenle today answer, betweenle archive, betweenle calendar answer, betweenle daily answer"
  />
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={data.meta.canonical} />
  <meta property="og:image" content="https://wordsolverx.com/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <section class="mx-auto mt-6 max-w-4xl px-4 sm:px-6 lg:px-8">
    <div class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div class="bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-900 px-6 py-10 text-white sm:px-8">
        <span class="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
          Betweenle Answer Today
        </span>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{data.todayAnswer.word.toUpperCase()}</h1>
        <p class="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
          {data.todayLabel} • Puzzle #{data.todayAnswer.puzzleNumber}
        </p>
        <button
          class="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:scale-[1.02]"
          onclick={() => copyToClipboard(data.todayAnswer.word)}
          type="button"
        >
          Copy Today’s Answer
        </button>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <FAQSection class="py-0" {faqs} title="Betweenle Answer FAQs" />
    </div>
  </section>

  <section class="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
    <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <div class="mb-6 flex items-center justify-between gap-4">
        <button
          class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          onclick={previousMonth}
          type="button"
        >
          &lt;
        </button>
        <div class="text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Betweenle Archive</p>
          <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </p>
        </div>
        <button
          class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          onclick={nextMonth}
          type="button"
        >
          &gt;
        </button>
      </div>

      <div class="grid grid-cols-7 gap-2">
        {#each weekDays as day}
          <div class="py-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{day}</div>
        {/each}

        {#each days as day}
          {#if day.day === 0}
            <div class="h-12 rounded-2xl"></div>
          {:else}
            <button
              class={`relative h-12 rounded-2xl text-sm font-bold transition-all ${
                day.isToday
                  ? 'bg-indigo-600 text-white'
                  : day.isFuture
                    ? 'cursor-not-allowed bg-slate-50 text-slate-300 dark:bg-slate-800/40 dark:text-slate-600'
                    : day.hasAnswer
                      ? 'border border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
                      : 'bg-slate-50 text-slate-400 dark:bg-slate-800/40 dark:text-slate-500'
              } ${selectedDate === day.date ? 'ring-2 ring-indigo-300 dark:ring-indigo-700' : ''}`}
              disabled={!day.hasAnswer || day.isFuture}
              onclick={() => (selectedDate = day.date)}
              type="button"
            >
              {day.day}
              {#if day.hasAnswer && !day.isToday && !day.isFuture}
                <span class="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-indigo-500"></span>
              {/if}
            </button>
          {/if}
        {/each}
      </div>

      {#if selectedAnswer && selectedDate !== data.todayAnswer.date}
        <div class="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Selected Archive Answer</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{formatBetweenleDate(selectedAnswer.date)}</p>
            </div>
            <span class="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Puzzle #{selectedAnswer.puzzleNumber}
            </span>
          </div>
          <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-3xl font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">
              {selectedAnswer.word}
            </p>
            <button
              class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              onclick={() => copyToClipboard(selectedAnswer.word)}
              type="button"
            >
              Copy Answer
            </button>
          </div>
        </div>
      {/if}

      <div class="mt-8 text-center">
        <span class="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {archive.length} puzzles archived
        </span>
      </div>
    </div>
  </section>
</main>
