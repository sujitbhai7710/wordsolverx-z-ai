<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import type { SearchleDailyPuzzle } from '$lib/searchle/daily';

  interface SearchleArchivePayload {
    selectedDateKey: string | null;
    selectedPuzzle: SearchleDailyPuzzle | null;
  }

  let data = $state<SearchleArchivePayload>({
    selectedDateKey: null,
    selectedPuzzle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2023, 5, 22);
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
      data.selectedPuzzle = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<SearchleArchivePayload>('searchle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedPuzzle = payload.selectedPuzzle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedPuzzle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Searchle archive entry.';
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
  <title>Searchle Archive - Complete Prompt Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Searchle answers. Calendar view with direct access to past autocomplete prompts and confirmed answers." />
  <link rel="canonical" href="https://wordsolver.tech/searchle-archive" />
  <meta property="og:title" content="Searchle Archive - All Past Answers" />
  <meta property="og:description" content="Complete history of every Searchle answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/searchle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Searchle Archive",
    "description": "Complete archive of all Searchle daily autocomplete answers.",
    "url": "https://wordsolver.tech/searchle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Searchle"
  gameColor="purple"
  gameIcon="Sr"
  {startDate}
  basePath="/searchle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Searchle prompt and answer. Browse the full autocomplete puzzle history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedPuzzle}
    <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div class="text-center mb-8">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-purple-600 dark:text-purple-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-white">
          Searchle answer for {data.selectedDateKey}
        </h2>
      </div>
      <div class="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center dark:border-purple-900/30 dark:from-purple-950/30 dark:to-pink-950/20">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">Prompt</p>
        <p class="mt-4 text-xl italic text-slate-700 dark:text-slate-200">
          "{data.selectedPuzzle.prompt}"
        </p>
        <p class="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">Answer</p>
        <p class="mt-4 font-mono text-4xl font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
          {data.selectedPuzzle.answer}
        </p>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Searchle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Searchle archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected prompt and answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pick a Searchle date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The archived prompt and answer will render here on the same page.
      </p>
    </div>
  {/if}
</section>





