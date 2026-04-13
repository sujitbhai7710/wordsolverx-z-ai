<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { getPuzzleDateForGame } from '$lib/puzzle-window';
  import { COUNTRY_NAMES, GENDER_NAMES, formatSpotleDate, parseSpotleDate, type SpotleData } from '$lib/spotle';
  import spotleData from '../../../../static/spotle_data.json';

  interface SpotleArchivePayload {
    availableDateStrings: string[];
    selectedDateKey: string | null;
    selectedSpotle: any;
  }

  const localSpotleData = spotleData as SpotleData;
  const todayKey = formatSpotleDate(getPuzzleDateForGame('spotle'));
  const localAvailableDateStrings = (localSpotleData.answers ?? [])
    .map((entry) => entry.date)
    .filter((dateString) => dateString <= todayKey)
    .sort();

  let data = $state<SpotleArchivePayload>({
    availableDateStrings: localAvailableDateStrings,
    selectedDateKey: null,
    selectedSpotle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  let availableDates = $derived((data.availableDateStrings ?? []).map((dateString: string) => new Date(`${dateString}T12:00:00`)));
  let startDate = $derived(availableDates[0] ?? new Date());
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
      data.selectedSpotle = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<SpotleArchivePayload>('spotle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.availableDateStrings = payload.availableDateStrings ?? localAvailableDateStrings;
      data.selectedDateKey = payload.selectedDateKey;
      data.selectedSpotle = payload.selectedSpotle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedSpotle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Spotle archive entry.';
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
  <title>Spotle Archive - Complete Artist Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Spotle answers. Calendar view with direct access to every past Spotify artist puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/spotle-archive" />
  <meta property="og:title" content="Spotle Archive - All Past Artist Answers" />
  <meta property="og:description" content="Complete history of every Spotle answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/spotle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Spotle Archive",
    "description": "Complete archive of all Spotle daily artist answers.",
    "url": "https://wordsolver.tech/spotle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Spotle"
  gameColor="emerald"
  gameIcon="Sp"
  {startDate}
  {availableDates}
  basePath="/spotle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Spotle artist answer. Browse the full music puzzle history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedSpotle}
    <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-white">
          Spotle answer for {data.selectedSpotle.formattedDate}
        </h2>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
        <div class="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-8 dark:border-emerald-800/40 dark:bg-emerald-950/20">
          <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Day #{data.selectedSpotle.dayNumber}</p>
          <p class="mt-3 text-4xl font-black text-slate-900 dark:text-white">{data.selectedSpotle.artistName}</p>
          {#if data.selectedSpotle.artist}
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
                <p class="text-xs text-slate-500">Country</p>
                <p class="mt-2 font-semibold text-slate-900 dark:text-white">
                  {COUNTRY_NAMES[data.selectedSpotle.artist.country] ?? data.selectedSpotle.artist.country.toUpperCase()}
                </p>
              </div>
              <div class="rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
                <p class="text-xs text-slate-500">Genre</p>
                <p class="mt-2 font-semibold text-slate-900 dark:text-white">{data.selectedSpotle.artist.genre}</p>
              </div>
              <div class="rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
                <p class="text-xs text-slate-500">Debut</p>
                <p class="mt-2 font-semibold text-slate-900 dark:text-white">{data.selectedSpotle.artist.debut_album_year}</p>
              </div>
              <div class="rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
                <p class="text-xs text-slate-500">Gender</p>
                <p class="mt-2 font-semibold text-slate-900 dark:text-white">
                  {GENDER_NAMES[data.selectedSpotle.artist.gender] ?? data.selectedSpotle.artist.gender}
                </p>
              </div>
            </div>
          {/if}
        </div>
        <div class="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Artist profile</p>
          {#if data.selectedSpotle.artist}
            <p class="mt-4 text-sm leading-6 text-emerald-50">
              Rank #{data.selectedSpotle.artist.index + 1}, {data.selectedSpotle.artist.group_size === 1 ? 'solo act' : `${data.selectedSpotle.artist.group_size} members`}.
            </p>
          {:else}
            <p class="mt-4 text-sm leading-6 text-emerald-50">
              Archived artist details will appear here when available in the dataset.
            </p>
          {/if}
        </div>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Spotle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Spotle archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected artist answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Choose a Spotle date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The selected artist answer and details will render here on the archive page.
      </p>
    </div>
  {/if}
</section>





