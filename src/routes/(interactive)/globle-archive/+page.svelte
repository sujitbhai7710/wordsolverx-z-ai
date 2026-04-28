<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import GlobleCluesSection from '$lib/components/GlobleCluesSection.svelte';
  import type { GlobleDayData } from '$lib/globle-date';

  interface GlobleArchivePayload {
    selectedDateKey: string | null;
    selectedGloble: GlobleDayData | null;
  }

  let data = $state<GlobleArchivePayload>({
    selectedDateKey: null,
    selectedGloble: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2022, 0, 1);
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
      data.selectedGloble = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<GlobleArchivePayload>('globle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedGloble = payload.selectedGloble;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedGloble = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Globle archive entry.';
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
  <title>Globle Archive - Complete Country Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Globle country answers. Calendar view with search and direct links to every past geography puzzle solution." />
  <link rel="canonical" href="https://wordsolverx.com/globle-archive" />
  <meta property="og:title" content="Globle Archive - All Past Country Answers" />
  <meta property="og:description" content="Complete history of every Globle country answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/globle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Globle Archive",
    "description": "Complete archive of all Globle daily country answers.",
    "url": "https://wordsolverx.com/globle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Globle"
  gameColor="teal"
  gameIcon="??"
  {startDate}
  basePath="/globle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Globle daily country answer. Find any past geography puzzle solution."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedGloble}
    <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
          Globle answer for {data.selectedGloble.formattedDate}
        </h2>
      </div>
      <GlobleCluesSection country={data.selectedGloble.country} date={data.selectedGloble.formattedDate}>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
          <div class="p-8 text-center">
            <div class="mb-6">
              <span class="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">ANSWER</span>
            </div>
            <h3 class="mb-8 text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{data.selectedGloble.country.name}</h3>
            <div class="grid gap-4 text-left md:grid-cols-2">
              <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Continent</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.selectedGloble.country.continent}</div>
              </div>
              <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Subregion</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.selectedGloble.country.subregion}</div>
              </div>
              <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Country Code</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.selectedGloble.country.code}</div>
              </div>
              <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Coordinates</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">
                  {data.selectedGloble.country.latitude.toFixed(2)}°, {data.selectedGloble.country.longitude.toFixed(2)}°
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlobleCluesSection>
    </div>
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Globle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Globle archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected country answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose a country date from the archive</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        The selected Globle answer and clue section will appear here without sending users to a thin dated page.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Globle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Globle archive preserves the complete history of daily country-guessing challenges from January 2022 to the present. Globle distinguishes itself from other geography puzzle games through its interactive map-based feedback system, where players guess countries and see a color-coded proximity indicator that reveals how close their guess is to the correct answer. The archive captures not just the daily answer but also the geographical context, including continent, subregion, country code, and precise coordinates.
      </p>
      <p>
        For geography enthusiasts, the archive is an extraordinary learning resource. Each entry represents a country with its full geographical metadata, and browsing through past answers is like taking a guided tour of the world's nations in chronological order. The archive reveals how Globle balances its country selection across continents and regions, ensuring players encounter the full diversity of global geography over time. This balanced approach makes the archive particularly valuable for identifying gaps in your own geographical knowledge.
      </p>
      <p>
        The interactive clues section available for each archive entry provides additional context beyond the raw answer. Players can review not just which country was the answer, but understand the geographical reasoning that would lead to that answer. This transforms the archive from a simple answer list into a genuine geography learning tool that builds spatial awareness and factual knowledge simultaneously.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Globle Answers Work</h3>
      <p>
        Globle presents players with a blank world map and challenges them to identify a mystery country. After each guess, the guessed country is colored on the map based on its proximity to the answer: warmer colors like red and orange indicate countries that are close, while cooler colors indicate greater distance. This visual feedback system allows players to use geographical reasoning to narrow down the answer through successive guesses.
      </p>
      <p>
        The answer pool includes all recognized sovereign nations. Each daily puzzle selects one country deterministically, and the archive records this selection along with full geographical metadata. The continent, subregion, and coordinates stored with each entry help players understand not just what the answer was, but where it sits in the broader context of world geography.
      </p>
      <p>
        Globle's proximity-based feedback system means that players with strong geographical intuition can often solve the puzzle in just a few guesses by starting with a strategically located country and reading the color gradients to determine the direction and approximate distance to the answer. The archive allows players to replay past puzzles mentally and evaluate whether their strategy would have worked.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Globle Answers</h3>
      <p>
        The Globle archive contains answers from every inhabited continent, with particularly interesting entries including small island nations, landlocked countries in complex regions, and nations with unusual geographical characteristics. Countries that are geographically isolated or located in regions with many small neighboring states tend to produce the most challenging puzzles and the most educational archive entries.
      </p>
      <p>
        The archive shows that Globle provides good coverage of all world regions, with entries from Africa, Asia, Europe, the Americas, and Oceania appearing regularly. This geographic diversity ensures that dedicated archive browsers develop a well-rounded understanding of global geography over time.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Globle Archive</h3>
      <p>
        Use the calendar above to navigate to any date and view the Globle answer for that day. Each entry displays the country name, continent, subregion, country code, and coordinates. The clues section provides additional geographical context. Study the archive regularly to build familiarity with countries you might not encounter in daily life.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does Globle's color-coded proximity system work?</h4>
      <p>
        After each guess, Globle colors the guessed country on the world map based on its distance from the correct answer. Red indicates very close proximity, orange and yellow indicate moderate distance, and blue and green indicate that the guess is far from the answer. This gradient system gives players visual guidance for their next guess.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Is the Globle archive different from the Worldle or Countryle archives?</h4>
      <p>
        Yes. While all three games involve country guessing, Globle uses a unique map-based proximity feedback system. The Globle archive preserves the specific geographical metadata and clue structure unique to Globle's gameplay format, distinguishing it from the other geography puzzle archives.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive include coordinates for every answer?</h4>
      <p>
        Yes. Every entry in the Globle archive includes the latitude and longitude coordinates of the answer country's geographic center. This allows players to locate each country precisely on a map and understand its spatial relationship to neighboring nations.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to practice my Globle strategy?</h4>
      <p>
        Absolutely. Review past answers and think about what your opening guess would have been and how the color feedback would have guided your subsequent guesses. This mental rehearsal helps refine your strategic approach and improves your geographical reasoning skills.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the Globle archive go?</h4>
      <p>
        The archive covers Globle answers from January 2022 to the present day, providing a complete record of the game's entire history. New entries are added daily as new puzzles are released.
      </p>
    </div>
  </div>
</article>
