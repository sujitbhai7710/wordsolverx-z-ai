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
  <link rel="canonical" href="https://wordsolverx.com/contexto-archive" />
  <meta property="og:title" content="Contexto Archive - All Past Answers" />
  <meta property="og:description" content="Complete history of every Contexto answer. Browse by calendar or search." />
  <meta property="og:url" content="https://wordsolverx.com/contexto-archive" />
  <meta property="og:type" content="website" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Contexto Archive",
    "description": "Complete archive of all Contexto daily answer words.",
    "url": "https://wordsolverx.com/contexto-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Contexto"
  gameColor="teal"
  gameIcon="Cx"
  {startDate}
  basePath="/contexto-archive"
  selectedDate={data.selectedDateKey}
  description="Every Contexto answer word. Browse the full semantic puzzle history."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedContexto}
    <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
        <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
          Contexto answer for {data.selectedContexto.date}
        </h2>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
        <div class="rounded-xl border border-teal-200 bg-teal-50/70 p-8 dark:border-teal-800/40 dark:bg-teal-950/20">
          <p class="text-sm text-slate-500 mb-3">Game #{data.selectedContexto.gameNumber}</p>
          <p class="text-4xl md:text-6xl font-black tracking-tight text-teal-700 dark:text-teal-300 capitalize">
            {data.selectedContexto.answer}
          </p>
        </div>
        <div class="rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Archive lookup</p>
          <p class="mt-4 text-lg font-bold">Semantic answer confirmed</p>
          <p class="mt-3 text-sm leading-6 text-teal-100">
            This archive view reveals the exact secret word for the selected Contexto day without sending users to separate dated URLs.
          </p>
        </div>
      </div>
    </div>
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Contexto date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Contexto archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected semantic answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Select a Contexto date above</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        The selected game number and answer word will appear here on the archive page.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Contexto Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Contexto archive is one of the most unique puzzle reference tools available online because Contexto itself operates on a fundamentally different principle than traditional word games. Instead of letter patterns or color matching, Contexto uses AI-powered semantic analysis to rank how closely words relate to a hidden secret word. This means that understanding the archive requires an appreciation for how language models process meaning, association, and contextual similarity between words.
      </p>
      <p>
        The archive is essential because Contexto's scoring system can be unintuitive at first glance. Words that seem closely related to the answer might receive surprisingly low scores, while seemingly unrelated words can rank highly due to statistical co-occurrence patterns in training data. By studying the archive, players develop an intuitive sense for how the AI evaluates semantic proximity, which is a genuinely useful skill that transfers to other contexts involving language models and natural language processing.
      </p>
      <p>
        For linguists, educators, and AI enthusiasts, the Contexto archive provides a fascinating dataset of word associations as interpreted by machine learning. Each answer paired with its game number tells a story about how the model maps the English language into a high-dimensional semantic space. Over hundreds of puzzles, patterns emerge that reveal the model's biases, strengths, and blind spots in understanding human language.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Contexto Answers Work</h3>
      <p>
        Contexto uses a pre-trained word embedding model to determine how semantically close any guessed word is to the secret answer. Each day, a new secret word is selected, and players type words to receive a numerical score indicating proximity. A score near 1.0 means the word is very close to the answer, while a score near 0.0 means it is semantically distant. The game is won when a player guesses the exact secret word, which receives a perfect score.
      </p>
      <p>
        The secret words are drawn from a large vocabulary of English words. Unlike Wordle, which limits answers to a curated list of five-letter words, Contexto can select words of any length from a much broader pool. This means that past answers range from common short words to longer, more specific terms. The archive reflects this diversity, offering a rich cross-section of the English language as understood by the underlying AI model.
      </p>
      <p>
        Contexto answers are deterministic and assigned sequentially by game number. Each game number maps to exactly one secret word, and the relationship between date and game number is fixed. This means the archive is perfectly reliable as a lookup tool for any past puzzle. The calendar interface above allows you to navigate to any date and instantly see the answer word and game number for that day.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Contexto Answers</h3>
      <p>
        The Contexto archive contains many answers that surprised players with their semantic relationships. Words that scored highly for unexpected secret answers often reveal interesting connections in how the AI model processes language. For example, abstract concepts might be closely associated with concrete nouns, or technical terms might rank near everyday words due to shared usage patterns in the training data.
      </p>
      <p>
        Players who study the archive often notice that certain categories of words appear more frequently as answers. Common nouns related to everyday life, emotions, and natural phenomena tend to recur, while highly specialized technical vocabulary appears less often. Understanding these distribution patterns helps players make more informed guesses when approaching new daily puzzles.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Contexto Archive</h3>
      <p>
        Navigate to any date using the calendar above to reveal the Contexto answer for that day. Each entry displays the game number and the secret word. To use the archive strategically, review recent answers and think about which words you would have guessed first. Compare your intuition against the actual answer to calibrate your sense of semantic proximity. Over time, this practice will sharpen your ability to find the right search direction in new puzzles.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What AI model does Contexto use?</h4>
      <p>
        Contexto uses a pre-trained word embedding model based on a large corpus of text. The exact model has evolved over time, but the core approach involves representing each word as a vector in a high-dimensional space and measuring cosine similarity between the guess vector and the secret word vector.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Why do some Contexto answers seem unrelated to high-scoring guesses?</h4>
      <p>
        This happens because the AI model captures statistical patterns from large text corpora, which may not always align with human intuition about word relationships. Two words might co-occur frequently in certain contexts, giving them high similarity scores, even if a human wouldn't immediately connect them.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does Contexto use the same answer for all players?</h4>
      <p>
        Yes. Like most daily puzzle games, Contexto serves the same secret word to all players on the same date. The archive reflects this universally shared answer for each game number and date.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I search the Contexto archive by game number instead of date?</h4>
      <p>
        Currently, the archive is organized by date through the calendar interface. However, since each date maps to a specific game number, you can find any game number's answer by converting it to the corresponding date using the known start date of the game.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does Contexto differ from Semantle?</h4>
      <p>
        Both games use semantic word similarity to create puzzles, but they differ in their specific implementations. Contexto uses its own embedding model and scoring system, while Semantle uses a different model with a different interface. The archive for each game is independent and reflects the distinct answer lists used by each.
      </p>
    </div>
  </div>
</article>
