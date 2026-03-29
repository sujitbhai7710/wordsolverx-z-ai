<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import ColorClues from '$lib/components/ColorClues.svelte';
  import type { ColordleDayData } from '$lib/colordle-date';
  import { onMount } from 'svelte';

  interface ColordleArchivePayload {
    selectedDateKey: string | null;
    selectedColordle: ColordleDayData | null;
  }

  let data = $state<ColordleArchivePayload>({
    selectedDateKey: null,
    selectedColordle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2023, 7, 7);
  let selectedDateParam = $state<string | null>(null);

  function getSelectedDateParam(): string | null {
    if (!browser) {
      return null;
    }

    return new URL(window.location.href).searchParams.get('date');
  }

  function syncArchiveFromUrl(): void {
    selectedDateParam = getSelectedDateParam();
    void loadArchive(selectedDateParam);
  }

  async function loadArchive(dateKey: string | null): Promise<void> {
    if (!dateKey) {
      data.selectedDateKey = null;
      data.selectedColordle = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<ColordleArchivePayload>('colordle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedColordle = payload.selectedColordle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedColordle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Colordle archive entry.';
    } finally {
      if (selectedDateParam === requestDateKey) {
        isLoading = false;
      }
    }
  }

  onMount(() => {
    syncArchiveFromUrl();
  });

  afterNavigate(() => {
    syncArchiveFromUrl();
  });
</script>

<svelte:head>
  <title>Colordle Archive - Complete Color Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Colordle color answers. Calendar view with search and direct links to every past color puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/colordle-archive" />
  <meta property="og:title" content="Colordle Archive - All Past Color Answers" />
  <meta property="og:description" content="Complete history of every Colordle color answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/colordle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Colordle Archive",
    "description": "Complete archive of all Colordle daily color answers.",
    "url": "https://wordsolver.tech/colordle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Colordle"
  gameColor="indigo"
  gameIcon="??"
  {startDate}
  basePath="/colordle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Colordle color answer. Find any past hex code solution instantly."
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedColordle}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Colordle answer for {data.selectedColordle.formattedDate}
        </h2>
      </div>
      <ColorClues colorName={data.selectedColordle.color.name} colorHex={data.selectedColordle.color.hex} />
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Colordle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Colordle archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected color answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose a color date from the archive</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        When you select a day, the Colordle answer card for that date will render below the calendar on this same page.
      </p>
    </div>
  {/if}
</section>


