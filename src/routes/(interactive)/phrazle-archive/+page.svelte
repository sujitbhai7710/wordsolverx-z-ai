<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { REFERENCE_DATE } from '$lib/phrazle/phrases';

  interface PhrazleArchivePayload {
    selectedDateKey: string | null;
    selectedAnswers: {
      morning: { phrase: string; index: number };
      afternoon: { phrase: string; index: number };
    } | null;
  }

  let data = $state<PhrazleArchivePayload>({
    selectedDateKey: null,
    selectedAnswers: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = REFERENCE_DATE;
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
      data.selectedAnswers = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<PhrazleArchivePayload>('phrazle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedAnswers = payload.selectedAnswers;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedAnswers = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Phrazle archive entry.';
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
  <title>Phrazle Archive - Complete Phrase Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Phrazle answers. Calendar view with direct access to both the morning and afternoon phrase for each date." />
  <link rel="canonical" href="https://wordsolverx.com/phrazle-archive" />
  <meta property="og:title" content="Phrazle Archive - All Past Answers" />
  <meta property="og:description" content="Complete history of every Phrazle phrase pair. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/phrazle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Phrazle Archive",
    "description": "Complete archive of all Phrazle morning and afternoon answers.",
    "url": "https://wordsolverx.com/phrazle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Phrazle"
  gameColor="teal"
  gameIcon="Pz"
  {startDate}
  basePath="/phrazle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Phrazle morning and afternoon answer. Browse the full phrase history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedAnswers}
    <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
          Phrazle answers for {data.selectedDateKey}
        </h2>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-xl border border-amber-200 bg-amber-50/70 p-6 dark:border-amber-800/40 dark:bg-amber-950/20">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">Morning</p>
          <p class="mt-4 font-mono text-2xl font-black uppercase text-amber-700 dark:text-amber-300">
            {data.selectedAnswers.morning.phrase}
          </p>
          <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Phrase #{data.selectedAnswers.morning.index}</p>
        </div>
        <div class="rounded-xl border border-teal-200 bg-teal-50/70 p-6 dark:border-teal-800/40 dark:bg-teal-950/20">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">Afternoon</p>
          <p class="mt-4 font-mono text-2xl font-black uppercase text-teal-700 dark:text-teal-300">
            {data.selectedAnswers.afternoon.phrase}
          </p>
          <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Phrase #{data.selectedAnswers.afternoon.index}</p>
        </div>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Phrazle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Phrazle archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected morning and afternoon phrases into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose a Phrazle date above</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        The morning and afternoon phrase answers will load here for the selected date.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Phrazle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Phrazle archive is a comprehensive record of phrase-guessing puzzle answers, uniquely offering two daily challenges with separate morning and afternoon solutions. This dual-puzzle format makes the Phrazle archive particularly rich, as each date contains two distinct phrase answers that test different aspects of language knowledge, from common idioms and proverbs to pop culture references and well-known quotations.
      </p>
      <p>
        Studying the Phrazle archive helps players understand the types of phrases that appear most frequently in the game's answer pool. Unlike word-based puzzles where individual letters are the focus, Phrazle challenges players to think at the phrase level, considering word patterns, common collocations, and the structural conventions of idiomatic English. The archive reveals which categories of phrases recur, helping players develop better intuition for their daily guesses.
      </p>
      <p>
        The archive is also a valuable language learning resource. Each entry represents a recognized phrase in the English language, and browsing through past answers exposes players to idiomatic expressions, common sayings, and familiar quotations they might not encounter in everyday conversation. This makes the archive useful for English language learners, writers seeking inspiration, and anyone who appreciates the richness of phrase-based communication.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Phrazle Answers Work</h3>
      <p>
        Phrazle extends the Wordle concept to full phrases and idioms. Instead of guessing individual words letter by letter, players guess entire phrases, receiving color-coded feedback on each letter of each word. Green indicates a correct letter in the correct position, yellow shows a correct letter in the wrong position, and gray means the letter is not in the phrase at all. This creates a more complex deduction challenge that requires thinking about multiple words simultaneously.
      </p>
      <p>
        Each Phrazle date features two separate puzzles: a morning phrase and an afternoon phrase. Both are drawn from the game's curated phrase pool and are independent of each other, meaning they test different phrases and provide twice the daily challenge. The archive records both answers for each date, along with the phrase index number that tracks the sequence of all phrases used in the game's history.
      </p>
      <p>
        The answer pool includes idioms, proverbs, common expressions, famous quotations, and well-known phrases from literature, media, and everyday language. Each phrase is selected deterministically from this pool, ensuring the archive is a complete and reliable record of every past solution. The dual-puzzle format means the archive contains approximately twice as many entries as a standard daily puzzle archive.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Phrazle Answers</h3>
      <p>
        The Phrazle archive contains many memorable phrases that sparked recognition and enjoyment among players. Classic idioms like "a penny saved is a penny earned" and "the early bird catches the worm" appear alongside more modern expressions and pop culture references. The variety of phrase types keeps the game fresh and ensures that players encounter diverse linguistic challenges as they browse the archive.
      </p>
      <p>
        Particularly challenging entries often involve phrases with unusual spelling, uncommon words, or non-standard grammar structures. Phrases borrowed from other languages, archaic expressions, and regionally specific idioms can stump even experienced players, making these entries both frustrating and educational in equal measure.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Phrazle Archive</h3>
      <p>
        Navigate to any date using the calendar above to view both the morning and afternoon Phrazle answers. Each entry displays the complete phrase and its index number. Study the archive to build familiarity with common phrase patterns, discover idioms you didn't know, and improve your phrase-guessing intuition for future daily puzzles.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Why does Phrazle have two puzzles per day?</h4>
      <p>
        Phrazle offers a morning puzzle and an afternoon puzzle to double the daily challenge and provide variety. The two puzzles are independently selected from the answer pool, so they test completely different phrases. This dual format gives players two chances to solve each day and makes the archive especially rich.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What types of phrases appear in Phrazle?</h4>
      <p>
        Phrazle draws from a curated pool that includes idioms, proverbs, common sayings, famous quotations, and well-known expressions from various sources. The archive reflects this diversity, with entries spanning literary quotes, colloquial expressions, and familiar cultural references.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive include both morning and afternoon answers?</h4>
      <p>
        Yes. Every date in the archive shows both the morning and afternoon phrase answers, along with their respective phrase index numbers. This complete coverage ensures you can check either puzzle for any past date.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can the Phrazle archive help me learn English idioms?</h4>
      <p>
        Absolutely. The archive is an excellent resource for English language learners because it exposes you to a wide variety of idiomatic expressions in context. Browsing past answers and looking up unfamiliar phrases is a natural and engaging way to expand your knowledge of English idioms and common sayings.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does Phrazle's feedback system differ from Wordle?</h4>
      <p>
        Phrazle applies the same green-yellow-gray letter feedback as Wordle, but across entire phrases with multiple words. This means you need to consider letter positions across word boundaries, making the deduction process more complex. The phrase index numbers in the archive help track the sequence of all solutions.
      </p>
    </div>
  </div>
</article>
