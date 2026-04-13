<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { REFERENCE_DATE } from '$lib/phrazle/phrases';

  interface PhrazleArchivePayload {
    selectedDateKey: string | null;
    selectedAnswers: {
      morning: { phrase: string; index: number };
      afternoon: { phrase: string; index: number };
    } | null;
  }

  let data = $state<PhrazleArchivePayload>({
    selectedDateKey: null,
    selectedAnswers: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = REFERENCE_DATE;
  let selectedDateParam = $state<string | null>(browser ? new URL(window.location.href).searchParams.get('date') : null);

  onMount(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    }
  });

  function handleDateSelect(dateKey: string): void {
    selectedDateParam = dateKey;
  }

  async function loadArchive(dateKey: string | null): Promise<void> {
    if (!dateKey) {
      data.selectedDateKey = null;
      data.selectedAnswers = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<PhrazleArchivePayload>('phrazle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedAnswers = payload.selectedAnswers;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedAnswers = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Phrazle archive entry.';
    } finally {
      if (selectedDateParam === requestDateKey) {
        isLoading = false;
      }
    }
  }

  $effect(() => {
    if (!browser) {
      return;
    }

    void loadArchive(selectedDateParam);
  });
</script>

<svelte:head>
  <title>Phrazle Archive - Complete Phrase Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Phrazle answers. Calendar view with direct access to both the morning and afternoon phrase for each date." />
  <link rel="canonical" href="https://wordsolver.tech/phrazle-archive" />
  <meta property="og:title" content="Phrazle Archive - All Past Answers" />
  <meta property="og:description" content="Complete history of every Phrazle phrase pair. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/phrazle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Phrazle Archive",
    "description": "Complete archive of all Phrazle morning and afternoon answers.",
    "url": "https://wordsolver.tech/phrazle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Phrazle"
  gameColor="emerald"
  gameIcon="Pz"
  {startDate}
  basePath="/phrazle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Phrazle morning and afternoon answer. Browse the full phrase history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedAnswers}
    <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-white">
          Phrazle answers for {data.selectedDateKey}
        </h2>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 dark:border-amber-800/40 dark:bg-amber-950/20">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">Morning</p>
          <p class="mt-4 font-mono text-2xl font-black uppercase text-amber-700 dark:text-amber-300">
            {data.selectedAnswers.morning.phrase}
          </p>
          <p class="mt-3 text-sm text-slate-500">Phrase #{data.selectedAnswers.morning.index}</p>
        </div>
        <div class="rounded-3xl border border-indigo-200 bg-indigo-50/70 p-6 dark:border-indigo-800/40 dark:bg-indigo-950/20">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Afternoon</p>
          <p class="mt-4 font-mono text-2xl font-black uppercase text-indigo-700 dark:text-indigo-300">
            {data.selectedAnswers.afternoon.phrase}
          </p>
          <p class="mt-3 text-sm text-slate-500">Phrase #{data.selectedAnswers.afternoon.index}</p>
        </div>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Phrazle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Phrazle archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected morning and afternoon phrases into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose a Phrazle date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The morning and afternoon phrase answers will load here for the selected date.
      </p>
    </div>
  {/if}
</section>





