<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import SemantleClues from '$lib/components/SemantleClues.svelte';
  import type { SemantleData } from '$lib/semantle';

  interface SemantleArchivePayload {
    selectedDateKey: string | null;
    selectedSemantle: SemantleData | null;
  }

  let data = $state<SemantleArchivePayload>({
    selectedDateKey: null,
    selectedSemantle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2022, 0, 29);
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
      data.selectedSemantle = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<SemantleArchivePayload>('semantle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedSemantle = payload.selectedSemantle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedSemantle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Semantle archive entry.';
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
  <title>Semantle Archive - Complete Secret Word Answer History | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Semantle secret word answers. Calendar view with search and direct links to every past semantic puzzle solution." />
  <link rel="canonical" href="https://wordsolver.tech/semantle-archive" />
  <meta property="og:title" content="Semantle Archive - All Past Secret Word Answers" />
  <meta property="og:description" content="Complete history of every Semantle secret word. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolver.tech/semantle-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Semantle Archive",
    "description": "Complete archive of all Semantle daily secret word answers.",
    "url": "https://wordsolver.tech/semantle-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolver.tech" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Semantle"
  gameColor="teal"
  gameIcon="??"
  {startDate}
  basePath="/semantle-archive"
  selectedDate={data.selectedDateKey}
  description="Every Semantle secret word answer. Find any past semantic puzzle solution instantly."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedSemantle}
    <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
          Semantle answer for {data.selectedSemantle.formattedDate}
        </h2>
      </div>
      <SemantleClues word={data.selectedSemantle.word} puzzleNumber={data.selectedSemantle.puzzleNumber} />
    </div>
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Semantle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Semantle archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected semantic answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Pick a Semantle archive date above</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        The selected puzzle's clue-and-reveal block will load here, so the archive page itself becomes the answer page.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Semantle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Semantle archive is one of the most intellectually stimulating puzzle reference tools available, preserving the complete history of AI-powered semantic word puzzles since January 2022. Semantle challenges players to find a secret word based on semantic similarity scores, requiring an understanding of how words relate in meaning rather than how they are spelled. The archive captures every past secret word along with puzzle numbers, creating a unique dataset that spans hundreds of word associations as interpreted by machine learning models.
      </p>
      <p>
        What makes the Semantle archive particularly valuable is its insight into how natural language processing models understand word relationships. Each past answer represents a point in a high-dimensional semantic space, and studying the archive reveals how the model clusters related concepts, which words it considers close in meaning, and where human intuition about word relationships diverges from computational analysis. This makes the archive fascinating not just for puzzle players but for linguists, AI researchers, and anyone interested in how machines process language.
      </p>
      <p>
        For dedicated Semantle players, the archive is an essential strategic tool. Because the game relies on semantic proximity rather than letter patterns, traditional word-guessing strategies don't apply. By studying past answers, players develop a more refined sense of which directions to explore when approaching a new puzzle, learning to identify semantic neighborhoods that the model tends to favor and understanding how abstract concepts, concrete nouns, and action words map to different regions of the semantic space.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Semantle Answers Work</h3>
      <p>
        Semantle uses word2vec-based embeddings to measure the semantic similarity between any guessed word and the secret answer. When players type a guess, they receive a similarity score, typically ranging from negative values for completely unrelated words to values approaching 100 for words that are very close in meaning to the secret word. The game provides a "warmth" indicator that helps players understand whether they are moving closer to or further from the answer.
      </p>
      <p>
        The secret words are drawn from a large vocabulary of English words and assigned deterministically by puzzle number. Each puzzle number maps to exactly one secret word, and the mapping between dates and puzzle numbers is fixed. This deterministic system means the archive is perfectly reliable as a lookup tool. The answer list includes words of various lengths and parts of speech, from common everyday terms to more abstract concepts.
      </p>
      <p>
        Unlike Wordle, Semantle has no limit on the number of guesses, but the challenge lies in efficiently navigating the semantic space to find the answer. The model's word associations sometimes surprise players, as words that seem logically related may receive low similarity scores while seemingly unrelated words rank highly due to statistical co-occurrence patterns in the training data.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Semantle Answers</h3>
      <p>
        The Semantle archive contains many answers that challenged and surprised players. Words with multiple meanings, abstract concepts that have few direct synonyms, and technical terms that exist at the boundary of everyday vocabulary tend to be the most challenging. These difficult entries often reveal interesting aspects of how the model processes language and provide excellent learning opportunities for players studying the archive.
      </p>
      <p>
        The archive shows that certain categories of words appear more frequently as answers. Common nouns related to everyday life, emotions, and natural phenomena recur regularly, while highly specialized or domain-specific terms appear less often. Understanding these frequency patterns helps players develop better intuitions about where to begin their search in the semantic space when approaching a new puzzle.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Semantle Archive</h3>
      <p>
        Use the calendar above to navigate to any past date and view the Semantle answer for that day. Each entry displays the secret word and puzzle number, along with a clues section that provides semantic context. Review past answers to understand the types of words Semantle selects, and use this knowledge to develop more effective guessing strategies for your daily puzzles.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What technology does Semantle use?</h4>
      <p>
        Semantle uses word2vec word embeddings trained on a large corpus of text to measure semantic similarity between words. Each word is represented as a vector in a high-dimensional space, and the cosine similarity between vectors determines how closely related two words are according to the model.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How is Semantle different from Contexto?</h4>
      <p>
        Both games use semantic similarity to create puzzles, but they use different embedding models and scoring systems. Semantle uses word2vec with a continuous similarity score, while Contexto uses its own model with a different interface and scoring approach. The archives are independent and reflect the distinct answer lists used by each game.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Why do some Semantle scores seem counterintuitive?</h4>
      <p>
        The model captures statistical patterns from large text corpora, which may not always align with human intuition about word relationships. Words that co-occur frequently in certain contexts may have high similarity scores even if humans wouldn't immediately connect them, while truly synonymous words might score lower if they tend to appear in different contexts.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive help me understand how AI processes language?</h4>
      <p>
        Yes. The archive is an excellent resource for understanding word embeddings and semantic similarity in practice. By reviewing past answers and the scores they would receive for various guesses, you develop an intuitive sense of how machine learning models organize and relate concepts in language.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I play Semantle without a guess limit?</h4>
      <p>
        Yes. Unlike Wordle, Semantle does not limit the number of guesses. The challenge comes from efficiently navigating the semantic space rather than working within a strict guess budget. The archive helps players develop more efficient navigation strategies.
      </p>
    </div>
  </div>
</article>
