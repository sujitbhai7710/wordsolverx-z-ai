<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { getContextoDateFromGameNumber } from '$lib/contexto';

  interface ContextoAnswerResponse {
    success: boolean;
    gameNumber: number;
    date: string;
    answer?: string;
    error?: string;
  }

  interface ContextoArchivePayload {
    selectedDateKey: string | null;
    selectedContexto: ContextoAnswerResponse | null;
  }

  let data = $state<ContextoArchivePayload>({
    selectedDateKey: null,
    selectedContexto: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = getContextoDateFromGameNumber(1);
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
      data.selectedContexto = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<ContextoArchivePayload>('contexto', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedContexto = payload.selectedContexto;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedContexto = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Contexto archive entry.';
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
  <title>Contexto Archive - Complete Secret Word History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Contexto answers. Calendar view with direct access to past secret words and game numbers." />
  <link rel="canonical" href="https://wordsolver.tech/contexto-archive" />
  <meta property="og:title" content="Contexto Archive - All Past Answers" />
  <meta property="og:description" content="Complete history of every Contexto answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/contexto-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Contexto Archive",
    "description": "Complete archive of all Contexto daily answer words.",
    "url": "https://wordsolver.tech/contexto-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Contexto"
  gameColor="purple"
  gameIcon="Cx"
  {startDate}
  basePath="/contexto-archive"
  selectedDate={data.selectedDateKey}
  description="Every Contexto answer word. Browse the full semantic puzzle history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedContexto}
    <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-white">
          Contexto answer for {data.selectedContexto.date}
        </h2>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
        <div class="rounded-3xl border border-violet-200 bg-violet-50/70 p-8 dark:border-violet-800/40 dark:bg-violet-950/20">
          <p class="text-sm text-slate-500 mb-3">Game #{data.selectedContexto.gameNumber}</p>
          <p class="text-4xl md:text-6xl font-black tracking-tight text-violet-700 dark:text-violet-300 capitalize">
            {data.selectedContexto.answer}
          </p>
        </div>
        <div class="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-6 text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Archive lookup</p>
          <p class="mt-4 text-lg font-bold">Semantic answer confirmed</p>
          <p class="mt-3 text-sm leading-6 text-violet-100">
            This archive view reveals the exact secret word for the selected Contexto day without sending users to separate dated URLs.
          </p>
        </div>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Contexto date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Contexto archive entry...</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        Pulling the selected semantic answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Select a Contexto date above</h2>
      <p class="mt-3 text-gray-600 dark:text-gray-300">
        The selected game number and answer word will appear here on the archive page.
      </p>
    </div>
  {/if}
</section>





