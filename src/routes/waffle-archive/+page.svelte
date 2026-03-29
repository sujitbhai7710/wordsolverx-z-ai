<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import WaffleAnswerCard from '$lib/components/WaffleAnswerCard.svelte';
  import type { WaffleDayData } from '$lib/waffle';

  interface WaffleArchivePayload {
    selectedDateKey: string | null;
    selectedWaffle: WaffleDayData | null;
  }

  let data = $state<WaffleArchivePayload>({
    selectedDateKey: null,
    selectedWaffle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2022, 0, 1);
  let selectedDateParam = $derived(browser ? page.url.searchParams.get('date') : null);

  async function loadArchive(dateKey: string | null): Promise<void> {
    if (!dateKey) {
      data.selectedDateKey = null;
      data.selectedWaffle = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<WaffleArchivePayload>('waffle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedWaffle = payload.selectedWaffle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedWaffle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Waffle archive entry.';
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
  <title>Waffle Archive - Complete Waffle Puzzle Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Waffle puzzle answers. Calendar view with search and direct links to every past waffle grid solution." />
  <link rel="canonical" href="https://wordsolver.tech/waffle-archive" />
  <meta property="og:title" content="Waffle Archive - All Past Waffle Answers" />
  <meta property="og:description" content="Complete history of every Waffle puzzle answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/waffle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Waffle Archive",
    "description": "Complete archive of all Waffle daily puzzle answers.",
    "url": "https://wordsolver.tech/waffle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Waffle"
  gameColor="amber"
  gameIcon="??"
  {startDate}
  basePath="/waffle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Waffle puzzle answer. Browse the daily grid puzzle history."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedWaffle}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Waffle answer for {data.selectedWaffle.formattedDate}
        </h2>
      </div>
      <WaffleAnswerCard
        puzzle={data.selectedWaffle.puzzle}
        solution={data.selectedWaffle.solution}
        date={new Date(data.selectedWaffle.date)}
      />

      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Across words</h3>
          <div class="space-y-3">
            {#each data.selectedWaffle.words.slice(0, 3) as word}
              {@const definition = data.selectedWaffle.definitions.find((entry) => entry.word.toLowerCase() === word.toLowerCase())}
              <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                <div class="font-black uppercase tracking-wide text-gray-900 dark:text-white">{word}</div>
                <div class="mt-1 text-sm text-gray-600 dark:text-gray-300">{definition?.definition ?? 'No definition available.'}</div>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Down words</h3>
          <div class="space-y-3">
            {#each data.selectedWaffle.words.slice(3, 6) as word}
              {@const definition = data.selectedWaffle.definitions.find((entry) => entry.word.toLowerCase() === word.toLowerCase())}
              <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                <div class="font-black uppercase tracking-wide text-gray-900 dark:text-white">{word}</div>
                <div class="mt-1 text-sm text-gray-600 dark:text-gray-300">{definition?.definition ?? 'No definition available.'}</div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Waffle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Waffle archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected grid answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pick a Waffle date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The solved grid and word definitions for the selected archive date will render here on the archive page.
      </p>
    </div>
  {/if}
</section>


