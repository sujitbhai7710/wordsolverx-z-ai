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
  <link rel="canonical" href="https://wordsolverx.com/quordle-archive" />
  <meta property="og:title" content="Quordle Archive - All Past Four-Word Answers" />
  <meta property="og:description" content="Complete history of every Quordle answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/quordle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Quordle Archive",
    "description": "Complete archive of all Quordle daily four-word puzzle answers.",
    "url": "https://wordsolverx.com/quordle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Quordle"
  gameColor="teal"
  gameIcon="4??"
  {startDate}
  basePath="/quordle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Quordle four-word puzzle answer. Browse the complete daily challenge history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedQuordle}
    <div class="mb-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
          Quordle answer for {data.selectedQuordle.formattedDate}
        </h2>
      </div>
      <QuordleAnswerCard date={new Date(`${data.selectedDateKey}T00:00:00Z`)} />
    </div>
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Quordle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Quordle archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected four-word answer set into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Select any Quordle date above</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        The full answer and hint section will appear here on the archive page without opening a separate dated URL.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Quordle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Quordle archive is a comprehensive record of daily four-word puzzle solutions from January 2022 to the present. Quordle elevates the Wordle concept by challenging players to solve four five-letter words simultaneously, sharing guesses across all four grids. This multi-puzzle format creates a uniquely demanding solving experience where strategy, vocabulary breadth, and efficient letter usage all converge. The archive preserves every daily quartet, making it an essential reference for dedicated solvers.
      </p>
      <p>
        Studying the Quordle archive reveals patterns that are invisible when playing day to day. Because players share guesses across four grids simultaneously, each guess needs to maximize information gain across all four words. The archive shows which letter combinations and word patterns appear most frequently in the four-word sets, helping players identify effective opening strategies that provide broad coverage across the alphabet. Over time, archive study can meaningfully improve your average solve rate and reduce the number of guesses needed for each daily challenge.
      </p>
      <p>
        The archive also provides a fascinating window into how the Quordle team constructs its daily puzzles. The four words for each day are not randomly selected; they are curated to provide a balanced challenge, often with complementary letter patterns that reward strategic thinking. By reviewing past quartets, players can see how the game balances common and uncommon words, avoids too much letter overlap between the four solutions, and ensures the daily puzzle is solvable within the nine allowed guesses.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Quordle Answers Work</h3>
      <p>
        Quordle presents four Wordle-style grids simultaneously, each containing a different five-letter word. Players type one guess at a time, and that guess is applied to all four grids, with each grid independently showing green, yellow, or gray feedback for the letters. Players have nine guesses to solve all four words, creating intense pressure to manage information efficiently across multiple puzzles at once.
      </p>
      <p>
        The four daily answers are predetermined and drawn from Quordle's curated answer list. Each date maps to a specific set of four words, and the archive records this set completely. The answers are drawn from a similar pool to Wordle, consisting of common five-letter English words that would be recognized by most players. The deterministic selection process ensures the archive is perfectly accurate for every past date.
      </p>
      <p>
        Quordle's increased difficulty compared to standard Wordle comes from the shared guess constraint. A letter that appears in the correct position on one grid might appear in the wrong position on another, and managing these competing constraints requires careful deduction. The archive allows players to review past puzzles and evaluate whether their approach would have worked, refining their multi-grid strategy over time.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Quordle Answers</h3>
      <p>
        The Quordle archive contains many memorable daily quartets that pushed players to their limits. Particularly challenging days feature four words with minimal letter overlap, making it difficult to gain information from shared guesses. Other memorable entries include days where all four words shared certain letter patterns, creating deceptive feedback that initially seemed more helpful than it actually was.
      </p>
      <p>
        Patterns in the archive show that Quordle tends to select four words that collectively use a broad range of letters, ensuring that common opening guesses provide useful feedback across multiple grids. Days where one or more of the four words are unusual or use uncommon letter combinations tend to produce the highest failure rates and the most community discussion.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Quordle Archive</h3>
      <p>
        Use the calendar interface above to navigate to any past date and view the complete set of four Quordle answers. Each entry displays all four words for the selected date, along with formatted date information. Study the archive to analyze word patterns, develop better opening strategies, and verify answers you might have missed on busy days.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How is Quordle different from playing four separate Wordles?</h4>
      <p>
        The key difference is that in Quordle, each guess is applied to all four grids simultaneously. This means you have to think about how each guess affects all four puzzles at once, making it fundamentally more challenging than solving four independent Wordles. You only get nine total guesses for all four words.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the Quordle archive show all four daily words?</h4>
      <p>
        Yes. Every entry in the archive displays the complete set of four words for that date, along with the formatted date and any additional context. You can see all four answers at once or review them individually.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What's the best strategy for solving Quordle?</h4>
      <p>
        Effective Quordle strategy involves selecting opening guesses that maximize letter coverage across the alphabet. Studying the archive helps you understand which letters appear most frequently across the four daily words, allowing you to choose openings that provide the most useful feedback across all four grids simultaneously.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to practice Quordle strategies?</h4>
      <p>
        Yes. Review past daily quartets and think about what your first few guesses would have been. Evaluate how the shared feedback from those guesses would have guided your subsequent choices. This mental practice is an excellent way to refine your multi-grid deduction skills.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the Quordle archive go?</h4>
      <p>
        The archive covers every Quordle puzzle from the game's launch on January 30, 2022 through the present day. New entries are added daily as new four-word challenges are released.
      </p>
    </div>
  </div>
</article>
