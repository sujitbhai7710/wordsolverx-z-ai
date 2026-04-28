<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
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
  <link rel="canonical" href="https://wordsolverx.com/phoodle-archive" />
  <meta property="og:title" content="Phoodle Archive - All Past Food Word Answers" />
  <meta property="og:description" content="Complete history of every Phoodle food word answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/phoodle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Phoodle Archive",
    "description": "Complete archive of all Phoodle daily food word answers.",
    "url": "https://wordsolverx.com/phoodle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Phoodle"
  gameColor="teal"
  gameIcon="Ph"
  {startDate}
  {availableDates}
  basePath="/phoodle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Phoodle food word answer. Browse the complete daily food puzzle history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedPhoodle}
    <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
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
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Phoodle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Phoodle archive data...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Preparing the archive calendar and selected food answer for this page.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Select a Phoodle day to reveal it here</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Older answers now open directly inside the archive page instead of using separate dated permalink pages.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Phoodle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Phoodle archive is a unique and delicious puzzle reference that captures the complete history of food-themed word challenges. Unlike standard Wordle, which draws from a general English vocabulary, Phoodle restricts its answers to food-related words, creating a specialized puzzle experience that rewards culinary knowledge alongside standard word-guessing skills. The archive preserves every past solution along with descriptions and recipe references, making it both a puzzle tool and a culinary exploration resource.
      </p>
      <p>
        For food enthusiasts and home cooks, the Phoodle archive doubles as an educational vocabulary builder. Each answer represents a food-related term, and many entries include descriptions that explain the word's culinary significance. By browsing the archive regularly, players expand their food vocabulary, discover new ingredients, learn cooking terminology, and develop a richer understanding of global cuisine. This makes the archive particularly valuable for culinary students, food bloggers, and anyone who wants to deepen their gastronomic knowledge.
      </p>
      <p>
        The archive also reveals patterns in Phoodle's answer selection. Studying past answers helps players identify which types of food words appear most frequently, whether certain cuisines are overrepresented, and how the game balances common terms like "bread" and "sauce" with more specialized vocabulary like "ramekin" or "bisque." This pattern analysis directly translates to improved puzzle performance and a more enjoyable daily solving experience.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Phoodle Answers Work</h3>
      <p>
        Phoodle follows the Wordle format but limits its answer pool to food-related five-letter words. Players have six attempts to guess the daily food word, with the standard green, yellow, and gray feedback indicating correct letters in correct positions, correct letters in wrong positions, and absent letters. The game operates on a daily cycle with one new puzzle per day, and every player worldwide receives the same answer on the same date.
      </p>
      <p>
        The answer list is curated by the Phoodle development team, who maintain a carefully selected pool of food-related terms. This list includes ingredients, cooking methods, kitchen equipment, culinary techniques, dish names, and food descriptors from various world cuisines. Each archive entry records the answer word, the date, and often includes a brief description and an associated recipe name that connects the word to a specific dish or preparation.
      </p>
      <p>
        Phoodle answers are deterministic and assigned in sequence. Each date maps to exactly one answer from the curated food word list, ensuring the archive is perfectly reliable. The available dates section tracks which dates have corresponding answers, allowing the calendar to show only valid puzzle dates.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Phoodle Answers</h3>
      <p>
        The Phoodle archive contains many answers that delighted food lovers and stumped word puzzle enthusiasts. Unusual ingredients from specific culinary traditions, specialized cooking equipment terms, and words borrowed from other languages through food culture have all appeared as memorable Phoodle solutions. Entries with strong recipe associations tend to generate extra excitement, as players enjoy the direct connection between the puzzle word and an actual dish they can prepare.
      </p>
      <p>
        Seasonal patterns are visible in the archive, with certain food terms appearing more frequently during relevant times of year. Holiday-related ingredients, seasonal produce, and weather-appropriate dishes tend to cluster around their natural calendar positions, creating a subtle thematic rhythm that attentive players can leverage when approaching their daily solve.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Phoodle Archive</h3>
      <p>
        Use the calendar interface above to navigate to any date and view the Phoodle answer for that day. Each entry includes the food word, a description, and often an associated recipe. Browse past entries to build your food vocabulary, discover new recipes, or simply check answers you might have missed. The archive is an excellent companion for anyone who enjoys both word games and cooking.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What types of words does Phoodle use?</h4>
      <p>
        Phoodle uses five-letter words related to food and cooking. This includes ingredients, cooking methods, kitchen tools, dish names, culinary terms, and food descriptors from various world cuisines. The curated answer list ensures all words are recognizable to food enthusiasts while still providing a challenging puzzle experience.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the Phoodle archive include recipe information?</h4>
      <p>
        Many archive entries include a brief description of the food word and an associated recipe name. This extra culinary context makes the Phoodle archive uniquely informative compared to other puzzle answer databases, turning each entry into a mini cooking lesson.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can studying the archive help me cook better?</h4>
      <p>
        Indirectly, yes. Regular exposure to food terminology through the archive expands your culinary vocabulary and introduces you to ingredients and techniques you might not encounter in your everyday cooking. Many players report discovering new dishes and ingredients through Phoodle that they later incorporate into their own cooking.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Is Phoodle harder than regular Wordle?</h4>
      <p>
        Phoodle can be more challenging for players without strong food vocabulary, but easier for those who cook regularly. The restricted answer pool actually provides a strategic advantage because the possible solutions are more predictable than in standard Wordle. Studying the archive helps level the playing field by familiarizing all players with the food word pool.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the Phoodle archive go?</h4>
      <p>
        The archive covers every Phoodle answer from the game's launch date to the present day. New entries are added daily as new puzzles are released, maintaining a complete and current record of all past solutions.
      </p>
    </div>
  </div>
</article>
