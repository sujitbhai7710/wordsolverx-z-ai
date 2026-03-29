<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import PhoodleAnswerCard from '$lib/components/PhoodleAnswerCard.svelte';
  import { parseApiDate, PHOODLE_START_DATE, type PhoodleDayData } from '$lib/phoodle';

  interface PhoodleArchivePayload {
    availableDateStrings: string[];
    selectedDateKey: string | null;
    selectedPhoodle: PhoodleDayData | null;
  }

  let data = $state<PhoodleArchivePayload>({
    availableDateStrings: [],
    selectedDateKey: null,
    selectedPhoodle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  let availableDates = $derived((data.availableDateStrings ?? []).map(parseApiDate));
  let startDate = $derived(availableDates.at(-1) ?? PHOODLE_START_DATE);
  let selectedDateParam = $derived(browser ? page.url.searchParams.get('date') : null);

  async function loadArchive(dateKey: string | null): Promise<void> {
    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<PhoodleArchivePayload>('phoodle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.availableDateStrings = payload.availableDateStrings ?? [];
      data.selectedDateKey = payload.selectedDateKey;
      data.selectedPhoodle = payload.selectedPhoodle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedPhoodle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Phoodle archive entry.';
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
  <title>Phoodle Archive - Complete Food Word Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Phoodle food word answers. Calendar view with search and direct links to every past food puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/phoodle-archive" />
  <meta property="og:title" content="Phoodle Archive - All Past Food Word Answers" />
  <meta property="og:description" content="Complete history of every Phoodle food word answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/phoodle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Phoodle Archive",
    "description": "Complete archive of all Phoodle daily food word answers.",
    "url": "https://wordsolver.tech/phoodle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Phoodle"
  gameColor="orange"
  gameIcon="Ph"
  {startDate}
  {availableDates}
  basePath="/phoodle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Phoodle food word answer. Browse the complete daily food puzzle history."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedPhoodle}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600 dark:text-orange-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Phoodle answer for {data.selectedPhoodle.formattedDate}
        </h2>
      </div>
      <PhoodleAnswerCard
        word={data.selectedPhoodle.word}
        date={data.selectedPhoodle.formattedDate}
        description={data.selectedPhoodle.description}
        recipe_name={data.selectedPhoodle.recipe_name}
      />
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Phoodle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Phoodle archive data...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Preparing the archive calendar and selected food answer for this page.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Select a Phoodle day to reveal it here</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Older answers now open directly inside the archive page instead of using separate dated permalink pages.
      </p>
    </div>
  {/if}
</section>


