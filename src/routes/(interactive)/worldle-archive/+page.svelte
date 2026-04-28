<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
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
  <link rel="canonical" href="https://wordsolverx.com/worldle-archive" />
  <meta property="og:title" content="Worldle Archive - All Past Country Answers" />
  <meta property="og:description" content="Complete history of every Worldle country answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/worldle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Worldle Archive",
    "description": "Complete archive of all Worldle daily country answers.",
    "url": "https://wordsolverx.com/worldle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Worldle"
  gameColor="teal"
  gameIcon="WL"
  {startDate}
  basePath="/worldle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Worldle country answer. Browse the full country silhouette puzzle history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedAnswer}
    <WorldleCountryCard
      answer={data.selectedAnswer}
      headline="Selected archive date"
      subheadline={`Showing the Worldle answer for ${data.formattedSelectedDate}.`}
    />
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Worldle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Worldle archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected country answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose a Worldle date above</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        The selected country answer and details will load here on the archive page.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Worldle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Worldle archive preserves the complete history of daily country silhouette puzzles from January 2022 to the present. Worldle challenges players to identify a mystery country based on its shape or silhouette, combined with distance and direction clues for incorrect guesses. The archive captures every past answer along with detailed country information, making it an essential resource for geography enthusiasts and daily puzzle players alike.
      </p>
      <p>
        The archive is particularly valuable because Worldle tests a specific type of geographic knowledge that differs from what other geography puzzle games emphasize. While games like Globle use distance-based map feedback and Countryle provides direct distance clues, Worldle focuses on country shape recognition, a skill that requires familiarity with the outlines and borders of the world's nations. The archive allows players to review which countries they should have recognized from their silhouettes, building this specialized form of geographic literacy over time.
      </p>
      <p>
        For students and educators, the Worldle archive is a powerful geography teaching tool. Each entry pairs a country name with its complete profile, including continent, capital, population, and geographic coordinates. Browsing through past answers provides a structured tour of world geography that can supplement traditional classroom materials and engage students through the familiar puzzle game format they already enjoy.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Worldle Answers Work</h3>
      <p>
        Worldle presents players with the silhouette of a mystery country and challenges them to identify it by name. After each incorrect guess, the game reveals how far the guessed country is from the answer in kilometers, along with a directional arrow indicating whether the correct country is north, south, east, or west of the guess. This feedback system allows players to use geographic reasoning to narrow down the possibilities.
      </p>
      <p>
        The answer pool includes all recognized sovereign nations and some territories. Each daily puzzle selects one country deterministically, and the archive records the complete dataset for each entry. The WorldleCountryCard component used in the archive displays the country name, capital, continent, and other geographical metadata, providing comprehensive information for each past solution.
      </p>
      <p>
        Worldle operates on a daily cycle with a fixed mapping between dates and answers. Every player worldwide receives the same country silhouette on the same date, and the archive preserves this shared experience. The deterministic system ensures that the archive is perfectly reliable as a reference for any past date since the game's launch.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Worldle Answers</h3>
      <p>
        The Worldle archive contains answers spanning every inhabited continent and region of the world. Particularly challenging entries include countries with distinctive but unfamiliar shapes, small island nations whose silhouettes are hard to distinguish from their neighbors, and landlocked countries in regions with many similarly shaped borders. These difficult entries often generate the most educational moments when players review them in the archive and learn to recognize shapes they initially missed.
      </p>
      <p>
        The archive shows that Worldle provides balanced coverage across continents, ensuring players encounter countries from all major world regions over time. Countries with highly distinctive shapes like Italy, Chile, and Japan tend to be easier to identify, while countries with more conventional rectangular or irregular shapes that share borders with similarly shaped neighbors provide greater challenges. Recognizing these patterns through archive study directly improves silhouette recognition skills.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Worldle Archive</h3>
      <p>
        Use the calendar above to navigate to any past date and view the Worldle country answer for that day. Each entry displays the country details through the WorldleCountryCard component, which shows the country name, capital, continent, and other geographic metadata. Study the archive regularly to build your country shape recognition skills and expand your knowledge of world geography.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does Worldle differ from Globle and Countryle?</h4>
      <p>
        Worldle focuses on country shape recognition using silhouettes, while Globle uses an interactive color-coded map showing proximity, and Countryle provides distance and direction clues without a visual map. Each game tests different aspects of geographic knowledge, and the Worldle archive specifically preserves the silhouette-based puzzle format.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What information is included for each archive entry?</h4>
      <p>
        Each Worldle archive entry displays the country name, capital city, continent, population, and other geographic metadata through the WorldleCountryCard component. This comprehensive information makes each entry useful as both a puzzle reference and a standalone geography fact sheet.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to improve my country shape recognition?</h4>
      <p>
        Yes. Review past answers and honestly assess whether you would have recognized the country from its silhouette. For countries you missed, study their shape and geographic context to build your recognition skills. Over time, this targeted review significantly improves your ability to identify countries from their outlines.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the Worldle archive go?</h4>
      <p>
        The archive covers Worldle answers from January 21, 2022 through the present day. New entries are added daily as new puzzles are released, maintaining a complete and current record of all past country silhouette solutions.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are Worldle answers the same for all players on a given day?</h4>
      <p>
        Yes. Worldle serves the same country silhouette to all players on each date. The archive reflects the universally shared answer for every day since the game launched, ensuring consistency for streak tracking and community discussion.
      </p>
    </div>
  </div>
</article>
