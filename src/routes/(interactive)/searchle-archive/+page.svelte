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
  gameColor="teal"
  gameIcon="Sr"
  {startDate}
  basePath="/searchle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Searchle prompt and answer. Browse the full autocomplete puzzle history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedPuzzle}
    <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <div class="text-center mb-8">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
          Searchle answer for {data.selectedDateKey}
        </h2>
      </div>
      <div class="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100/50 p-8 text-center dark:border-teal-800/40 dark:from-teal-950/30 dark:to-teal-900/20">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">Prompt</p>
        <p class="mt-4 text-xl italic text-slate-700 dark:text-slate-200">
          "{data.selectedPuzzle.prompt}"
        </p>
        <p class="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">Answer</p>
        <p class="mt-4 font-mono text-4xl font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
          {data.selectedPuzzle.answer}
        </p>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Searchle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Searchle archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected prompt and answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Pick a Searchle date above</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        The archived prompt and answer will render here on the same page.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Searchle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Searchle archive captures a unique form of daily puzzle entertainment based on Google autocomplete predictions. Unlike traditional word or number games, Searchle challenges players to guess what Google's autocomplete algorithm suggests for a given search prompt. This makes each puzzle a window into collective search behavior and popular culture, and the archive preserves this fascinating data for retrospective study and analysis.
      </p>
      <p>
        The archive is valuable because Searchle answers reflect real-time trends in what people search for online. Each past answer represents the most popular autocomplete suggestion at the time the puzzle was created, providing a snapshot of cultural interests, trending topics, and collective curiosity. Over time, the archive becomes a chronological record of how search trends evolve, making it interesting not just for puzzle enthusiasts but also for anyone curious about internet culture and information-seeking behavior.
      </p>
      <p>
        For regular Searchle players, the archive helps develop an intuitive understanding of how autocomplete algorithms work. By studying past prompt-answer pairs, players learn to anticipate which completions Google tends to favor, which categories of suggestions appear most frequently, and how the autocomplete system handles ambiguous or open-ended prompts. This pattern recognition skill directly translates to improved performance on future daily puzzles.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Searchle Answers Work</h3>
      <p>
        Searchle presents players with a partial search prompt, typically a phrase that could be completed in multiple ways. The challenge is to guess what Google's autocomplete feature suggests as the most likely completion. Players have a limited number of guesses, and the game provides feedback to help narrow down the possibilities. The correct answer is the autocomplete suggestion that Google's algorithm ranks highest for the given prompt.
      </p>
      <p>
        The answer for each day is captured at the time the puzzle is created and remains fixed for that date. Google's autocomplete suggestions can change over time as search trends evolve, but the Searchle archive preserves the answer that was correct on the specific day the puzzle was active. This temporal accuracy makes the archive a genuine historical record rather than a real-time reflection of current autocomplete behavior.
      </p>
      <p>
        Each archive entry records both the prompt and the confirmed answer. The prompt gives context for what players were asked to predict, while the answer shows what Google's autocomplete actually suggested. This paired format makes the archive self-contained and informative even without access to the live game interface.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Searchle Answers</h3>
      <p>
        The Searchle archive contains many memorable prompt-answer pairs that surprised players with unexpected or amusing autocomplete suggestions. Puzzles with ambiguous prompts that could plausibly complete in multiple directions tend to be the most challenging, as players must predict which direction Google's algorithm will favor. Answers that reveal surprising popular search trends or unexpected cultural preferences often generate the most community discussion.
      </p>
      <p>
        Seasonal and event-driven patterns are visible throughout the archive. During holidays, sporting events, or cultural moments, the autocomplete suggestions tend to shift to reflect the topics people are actively searching for. This temporal variation makes the archive a unique record of how collective attention flows across different topics throughout the year.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Searchle Archive</h3>
      <p>
        Navigate the archive using the calendar above to view any past Searchle prompt and its corresponding autocomplete answer. Each entry displays the full prompt text and the confirmed answer. Study the archive to develop a sense for how Google autocomplete tends to complete various types of prompts, and use this knowledge to improve your prediction accuracy on future puzzles.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does Searchle get its autocomplete answers?</h4>
      <p>
        Searchle captures Google's autocomplete suggestions at the time each puzzle is created. The answers reflect what Google's algorithm predicted as the most likely search completion for the given prompt on that specific date.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Do Searchle answers change over time?</h4>
      <p>
        The archive records the answer that was correct on the specific day the puzzle was active. Google's actual autocomplete suggestions may change over time, but the archived answer remains fixed, making it a historical record of what was correct when the puzzle was live.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to predict future Searchle answers?</h4>
      <p>
        You can use the archive to understand patterns in autocomplete behavior, but Searchle answers are ultimately determined by real-time search trends that are difficult to predict. The archive is best used to develop general intuition about autocomplete rather than as a prediction tool for specific future puzzles.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What makes Searchle different from other daily puzzle games?</h4>
      <p>
        Searchle uniquely tests knowledge of internet culture and search behavior rather than vocabulary, math, or geography. The answers reflect collective online behavior rather than fixed answer lists, making each puzzle a small window into what the internet is thinking about.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the Searchle archive go?</h4>
      <p>
        The archive covers Searchle answers from the game's launch in June 2023 through the present day. New entries are added daily as new puzzles are released.
      </p>
    </div>
  </div>
</article>
