<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import WorldleCountryCard from '$lib/components/worldle/WorldleCountryCard.svelte';
  import WorldleDateCalendar from '$lib/components/worldle/WorldleDateCalendar.svelte';
  import { getDisplayDateLabel } from '$lib/worldle/logic';
  import type { WorldleAnswer } from '$lib/worldle/types';

  let { data } = $props();

  let selectedDate = $state<string | null>(data.selectedDate);
  let selectedAnswer = $state<WorldleAnswer | null>(data.selectedAnswer);
  let selectedLabel = $state<string | null>(data.formattedSelectedDate);
  let displayMonth = $state<Date>(new Date(data.displayMonth));
  let isArchiveLoading = $state(false);
  let archiveError = $state('');

  async function selectArchiveDate(date: string): Promise<void> {
    isArchiveLoading = true;
    archiveError = '';

    try {
      const response = await fetch(`/api/worldle-answer?date=${date}`);
      const payload = await response.json();

      if (!response.ok) {
        archiveError = payload?.error || 'Failed to load the selected Worldle answer.';
        return;
      }

      selectedDate = date;
      selectedAnswer = payload.answer as WorldleAnswer;
      selectedLabel = getDisplayDateLabel(date);
    } catch {
      archiveError = 'Failed to load the selected Worldle answer.';
    } finally {
      isArchiveLoading = false;
    }
  }

  function jumpMonth(month: Date): void {
    displayMonth = new Date(month);
  }

  function jumpToRecent(date: string): void {
    jumpMonth(new Date(`${date}T00:00:00`));
    void selectArchiveDate(date);
  }
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta
    name="keywords"
    content="worldle answer today, worldle today answer, worldle answer, worldle archive answers, worldle calendar answer, worldle country today"
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
  <meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900 px-6 py-8 text-white shadow-2xl shadow-sky-500/20 sm:px-8 sm:py-10">
      <div class="max-w-4xl">
        <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
          Server-rendered Worldle answer page
        </p>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Worldle Answer Today
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-sky-50/90 sm:text-lg">
          Check the verified Worldle country for {data.formattedTodayDate}, review the last 10 answers, and use the archive calendar below to load any past Worldle date on the server.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <img
              alt={`Flag of ${data.todayAnswer.country.name}`}
              class="h-6 w-8 rounded-md border border-white/20 object-cover"
              height="24"
              loading="lazy"
              src={`https://flagcdn.com/w40/${data.todayAnswer.country.code.toLowerCase()}.png`}
              width="32"
            />
            <span>{data.todayAnswer.country.name}</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <span>Worldle #{data.todayAnswer.worldleNumber}</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <span>Updates at 00:00 UTC</span>
          </div>
        </div>
      </div>
    </section>

    <div class="mt-8">
      <WorldleCountryCard
        answer={data.todayAnswer}
        headline="Today's Worldle answer"
        subheadline={`This page is refreshed automatically for the active Worldle day. Today is ${data.formattedTodayDate}.`}
      />
    </div>

    <section class="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Last 10 days</p>
          <h2 class="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Recent Worldle answers</h2>
        </div>
        <a
          class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-500"
          href="/worldle-solver"
        >
          Open Worldle solver
        </a>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {#each data.recentAnswers as answer}
          <button
            class={`rounded-3xl border px-4 py-4 transition ${
              answer.date === (selectedDate ?? data.todayDate)
                ? 'border-sky-500 bg-sky-50 shadow-lg shadow-sky-500/10 dark:border-sky-400 dark:bg-sky-900/20'
                : 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-sky-500 dark:hover:bg-slate-900'
            }`}
            onclick={() => jumpToRecent(answer.date)}
            type="button"
          >
            <div class="flex items-center gap-3">
              <img
                alt={`Flag of ${answer.country.name}`}
                class="h-9 w-12 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                height="36"
                loading="lazy"
                src={`https://flagcdn.com/w80/${answer.country.code.toLowerCase()}.png`}
                width="48"
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{answer.country.name}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{getDisplayDateLabel(answer.date)}</p>
              </div>
            </div>
            <p class="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
              Worldle #{answer.worldleNumber}
            </p>
          </button>
        {/each}
      </div>
    </section>

    <div class="mt-10 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <FAQSection faqs={data.faqEntries} title="Worldle Answers For The Last 10 Days" />
    </div>

    <section class="mt-10 grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div>
        <div class="mb-5">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Calendar lookup</p>
          <h2 class="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Select any Worldle date</h2>
          <p class="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            The calendar below loads answers directly from the server. Click any available day from January 21, 2022 through today to reveal that date&apos;s Worldle answer underneath.
          </p>
        </div>
        <WorldleDateCalendar
          {displayMonth}
          minDate="2022-01-21"
          onSelectDate={selectArchiveDate}
          onSelectMonth={jumpMonth}
          {selectedDate}
          todayDate={data.todayDate}
        />
      </div>

      <div>
        {#if isArchiveLoading}
          <section class="flex min-h-[24rem] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
            <div class="max-w-md">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Loading</p>
              <h3 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Fetching archive answer</h3>
              <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Pulling the selected Worldle answer from the server now.
              </p>
            </div>
          </section>
        {:else if selectedAnswer}
          <WorldleCountryCard
            answer={selectedAnswer}
            headline="Selected archive date"
            subheadline={`Showing the Worldle answer for ${selectedLabel}.`}
          />
          {#if archiveError}
            <p class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              {archiveError}
            </p>
          {/if}
        {:else}
          <section class="flex min-h-[24rem] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xl shadow-slate-200/60 dark:border-slate-600 dark:bg-slate-800 dark:shadow-none">
            <div class="max-w-md">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Archive preview</p>
              <h3 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Choose a date to reveal that answer</h3>
              <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Pick a day from the calendar and the answer will load right here, including its capital, region, neighbors, and key stats.
              </p>
            </div>
          </section>
          {#if archiveError}
            <p class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
              {archiveError}
            </p>
          {/if}
        {/if}
      </div>
    </section>

    <article class="mt-10 grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">How Worldle works</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">A geography puzzle with daily country clues</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Worldle gives you a country silhouette each day and asks you to guess the hidden country. Every incorrect guess returns a distance in kilometers, a direction arrow, and a proximity percentage. Those clues tell you how far your guess is from the target and in which direction to move next.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          This page helps in two ways: it shows today&apos;s answer once you are ready to reveal it, and it lets you inspect past dates so you can study patterns, check missed puzzles, or confirm an older answer quickly.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Why this page helps</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Use the answer page without leaving WordSolverX</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          The Worldle answer page is built into the same WordSolverX layout as the rest of the site, so it uses your normal navigation, shared header, and footer. It is designed like an article for search visibility, but it still behaves like a practical tool with a fast server-rendered date lookup.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          If you want to solve the puzzle instead of revealing it, use the Worldle Solver. It runs in the browser and filters countries from the exact same base dataset used here for the answer and archive views.
        </p>
      </section>
    </article>
  </div>
</main>
