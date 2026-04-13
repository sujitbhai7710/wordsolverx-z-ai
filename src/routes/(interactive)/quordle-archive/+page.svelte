<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import QuordleAnswerCard from '$lib/components/QuordleAnswerCard.svelte';
  import type { QuordleData } from '$lib/quordle';

  interface QuordleArchivePayload {
    selectedDateKey: string | null;
    selectedQuordle: QuordleData | null;
  }

  let data = $state<QuordleArchivePayload>({
    selectedDateKey: null,
    selectedQuordle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2022, 0, 30);
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
      data.selectedQuordle = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<QuordleArchivePayload>('quordle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedQuordle = payload.selectedQuordle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedQuordle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Quordle archive entry.';
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
  <title>Quordle Archive - Complete Four-Word Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Quordle answers. Calendar view with search and direct links to every past four-word puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/quordle-archive" />
  <meta property="og:title" content="Quordle Archive - All Past Four-Word Answers" />
  <meta property="og:description" content="Complete history of every Quordle answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/quordle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Quordle Archive",
    "description": "Complete archive of all Quordle daily four-word puzzle answers.",
    "url": "https://wordsolver.tech/quordle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Quordle"
  gameColor="blue"
  gameIcon="4??"
  {startDate}
  basePath="/quordle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Quordle four-word puzzle answer. Browse the complete daily challenge history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedQuordle}
    <div class="mb-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Quordle answer for {data.selectedQuordle.formattedDate}
        </h2>
      </div>
      <QuordleAnswerCard date={new Date(`${data.selectedDateKey}T00:00:00Z`)} />
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Quordle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Quordle archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected four-word answer set into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Select any Quordle date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The full answer and hint section will appear here on the archive page without opening a separate dated URL.
      </p>
    </div>
  {/if}
</section>





