<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import WorldleCountryCard from '$lib/components/worldle/WorldleCountryCard.svelte';
  import type { WorldleAnswer } from '$lib/worldle/types';

  interface WorldleArchivePayload {
    selectedDateKey: string | null;
    selectedAnswer: WorldleAnswer | null;
    formattedSelectedDate: string | null;
  }

  let data = $state<WorldleArchivePayload>({
    selectedDateKey: null,
    selectedAnswer: null,
    formattedSelectedDate: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2022, 0, 21);
  let selectedDateParam = $derived(browser ? page.url.searchParams.get('date') : null);

  async function loadArchive(dateKey: string | null): Promise<void> {
    if (!dateKey) {
      data.selectedDateKey = null;
      data.selectedAnswer = null;
      data.formattedSelectedDate = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<WorldleArchivePayload>('worldle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedAnswer = payload.selectedAnswer;
      data.formattedSelectedDate = payload.formattedSelectedDate;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedAnswer = null;
      data.formattedSelectedDate = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Worldle archive entry.';
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
  <title>Worldle Archive - Complete Country Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Worldle answers. Calendar view with direct access to every past country silhouette puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/worldle-archive" />
  <meta property="og:title" content="Worldle Archive - All Past Country Answers" />
  <meta property="og:description" content="Complete history of every Worldle country answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/worldle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Worldle Archive",
    "description": "Complete archive of all Worldle daily country answers.",
    "url": "https://wordsolver.tech/worldle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Worldle"
  gameColor="sky"
  gameIcon="WL"
  {startDate}
  basePath="/worldle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Worldle country answer. Browse the full country silhouette puzzle history."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedAnswer}
    <WorldleCountryCard
      answer={data.selectedAnswer}
      headline="Selected archive date"
      subheadline={`Showing the Worldle answer for ${data.formattedSelectedDate}.`}
    />
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Worldle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Worldle archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected country answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose a Worldle date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The selected country answer and details will load here on the archive page.
      </p>
    </div>
  {/if}
</section>


