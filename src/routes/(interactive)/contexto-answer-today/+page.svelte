<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    formatContextoDate,
    getContextoGameNumber,
    getContextoTodayDate
  } from '$lib/contexto';
  import {
    generateFAQSchema,
    generateHowToSchema,
    generateWebPageSchema
  } from '$lib/seo';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  interface ContextoAnswer {
    success: boolean;
    gameNumber: number;
    date: string;
    answer?: string;
    error?: string;
  }

  let {
    data
  }: {
    data: { initialAnswer: ContextoAnswer | null; latestDate: string | null; error: string | null };
  } = $props();

  let showAnswer = $state(false);

  function formatDisplayDate(dateKey: string): string {
    return new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const activeDate = $derived(
    data.initialAnswer?.date ?? data.latestDate ?? formatContextoDate(getContextoTodayDate())
  );
  const activeLabel = $derived(formatDisplayDate(activeDate));
  const activeGameNumber = $derived(
    data.initialAnswer?.gameNumber ?? getContextoGameNumber(new Date(`${activeDate}T12:00:00`))
  );

  const currentMonth = $derived(new Date(`${activeDate}T12:00:00`).toLocaleDateString('en-US', { month: 'long' }));
  let metaTitle = $derived(`Contexto Answer Today - ${currentMonth} - Updated`);
  let pageTitle = $derived(`Contexto Answer Today (${activeLabel})`);
  let pageDescription = $derived(
    `Get Contexto hints and the confirmed Contexto answer for today, ${activeLabel}. Use the dedicated archive page when you need an older Contexto answer.`
  );
  let pageKeywords = $derived(
    `contexto answer today, contexto answer, contexto hint, contexto hint today, contexto answer for ${activeLabel}`
  );

  const faqs = [
    {
      question: 'What is Contexto?',
      answer:
        'Contexto is a daily word guessing game where you find the secret word based on semantic closeness. Instead of letter-based clues like Wordle, Contexto uses AI-powered word embeddings to rank how similar your guesses are to the secret word. The game was created by an independent developer and launched in 2022.'
    },
    {
      question: 'How is the game number calculated?',
      answer:
        'Contexto game numbers increment by one each day based on the official release schedule. The game launched with puzzle #1 and has been counting up since. The game number is tied to the date, not to your local timezone — it follows the official server time.'
    },
    {
      question: 'Can I view previous Contexto answers?',
      answer:
        'Yes. Use the Contexto archive page to browse older dates and reveal the answer for that day. We maintain a complete archive going back to the earliest Contexto puzzles. You can search by date or game number.'
    },
    {
      question: 'Where does the data come from?',
      answer:
        'Answers are fetched directly from the official Contexto API. The game uses a word embedding model trained on large text corpora to determine semantic similarity between words. The same model powers the hint system.'
    },
    {
      question: 'How does Contexto scoring work?',
      answer:
        'Contexto ranks every guess from closest (rank 1) to farthest (rank ~15,000+). A rank of 1 means you guessed the exact word. Ranks under 100 are very close semantically. Ranks between 100-1,000 suggest moderate similarity. Anything above 1,000 means you are conceptually far from the answer.'
    },
    {
      question: 'What is a good Contexto strategy?',
      answer:
        'Start with broad category words like "person," "place," "thing," or "emotion" to find which conceptual area the answer lives in. Then narrow down by exploring related words. If "animal" ranks 500, try specific animals and see which direction moves you closer.'
    },
    {
      question: 'Does Contexto have a guess limit?',
      answer:
        'No. Contexto has unlimited guesses. You can guess as many words as you want until you find the answer. The challenge is conceptual navigation, not guess management.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const howToSchema = generateHowToSchema('How to use the Contexto answer page', [
    { name: 'Check the current game', text: 'See the active Contexto date and puzzle number at the top of the page.' },
    { name: 'Reveal the answer', text: 'Use the reveal button when you are ready to confirm the secret word.' },
    { name: 'Open the archive', text: 'Use the archive page for older Contexto answers instead of browsing them here.' }
  ]);
  let webPageSchema = $derived(
    generateWebPageSchema(
      metaTitle,
      pageDescription,
      'https://wordsolver.tech/contexto-answer-today'
    )
  );
</script>

<svelte:head>
  <title>{metaTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <meta property="og:title" content={metaTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/contexto-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={metaTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <link rel="canonical" href="https://wordsolver.tech/contexto-answer-today" />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-800/30">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium mb-4">
        <span>Daily Contexto Answers</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
        Contexto Answer Today ({activeLabel})
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        A focused today page for the current Contexto answer, with archive lookups moved to the dedicated archive page.
      </p>
    </div>

    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] overflow-hidden mb-10">
      <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-6 text-white">
        <p class="text-sm uppercase tracking-[0.2em] text-teal-100 mb-2">Answer Today</p>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-sm">
            Game #{activeGameNumber}
          </span>
          <span class="text-sm text-teal-100">
            {activeDate}
          </span>
        </div>
      </div>

      <div class="p-6 md:p-8">
        {#if data.error}
          <div class="text-center py-6">
            <p class="text-red-500 dark:text-red-400">{data.error}</p>
          </div>
        {:else if data.initialAnswer?.success}
          <div class="grid lg:grid-cols-[1.4fr_0.9fr] gap-6 items-start">
            <div>
              <div class={`rounded-2xl border-2 transition-all p-6 md:p-8 ${showAnswer ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-600' : 'bg-slate-50 dark:bg-slate-700/50 border-dashed border-slate-300 dark:border-slate-600'}`}>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">The Contexto answer for this day</p>
                {#if showAnswer}
                  <p class="text-4xl md:text-6xl font-black tracking-tight text-teal-700 dark:text-teal-300 capitalize">
                    {data.initialAnswer.answer}
                  </p>
                {:else}
                  <p class="text-2xl md:text-4xl font-bold text-slate-400 dark:text-slate-500">Answer hidden</p>
                {/if}
              </div>

              <div class="flex gap-3 flex-wrap mt-5">
                <button
                  type="button"
                  onclick={() => (showAnswer = !showAnswer)}
                  class={`px-5 py-3 rounded-xl text-white font-medium ${showAnswer ? 'bg-slate-600 hover:bg-slate-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                  {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                </button>
                <a
                  href="/contexto-archive"
                  class="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Browse Archive
                </a>
              </div>
            </div>

            <div class="space-y-4">
              <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 p-5">
                <h2 class="text-base font-semibold mb-3 text-slate-900 dark:text-slate-100">Need an older Contexto answer?</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  Older Contexto dates and game-number lookups now live on the dedicated archive page.
                </p>
                <a
                  href="/contexto-archive"
                  class="mt-4 inline-flex px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium"
                >
                  Open Contexto Archive
                </a>
              </div>

              <div class="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5">
                <p class="font-semibold mb-1">Play Contexto</p>
                <p class="text-sm text-amber-100 mb-4">Open the official puzzle after checking the answer.</p>
                <a
                  href="https://contexto.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex px-4 py-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/20 font-medium"
                >
                  Open contexto.me
                </a>
              </div>
            </div>
          </div>
        {:else}
          <div class="text-center py-6 text-slate-500 dark:text-slate-400">Unable to load today&apos;s answer right now.</div>
        {/if}
      </div>
    </section>

    <FAQSection title="Contexto Answer FAQ" {faqs} class="pb-0" />

    <!-- Comprehensive SEO Article -->
    <article class="mt-12 space-y-8 max-w-5xl mx-auto">
      <!-- What is Contexto? -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          What Is Contexto?
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Contexto is a daily word game that measures meaning, not spelling. You guess words and the game tells you how semantically close your guess is to the secret word using a numerical ranking system. Rank 1 means you found it. Rank 500 means you're in the right general area. Rank 10,000 means you're conceptually miles away. There are no letter clues, no color tiles, no word-length hints — just pure semantic similarity.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The game launched in 2022 and was developed by an independent creator who built it around word embedding models — the same technology that powers language AI systems like GPT. Word embeddings map every word to a point in a high-dimensional space where words with similar meanings cluster together. "Dog" and "puppy" are close neighbors. "Dog" and "stock market" are far apart. Contexto uses these spatial relationships to rank your guesses.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Contexto has attracted a dedicated player base among people who find letter-based word games too constraining. In Wordle, you need spelling knowledge. In Contexto, you need vocabulary breadth and an intuitive sense of how concepts relate. The game appeals to language enthusiasts, puzzle solvers, and anyone who enjoys exploring the hidden structure of meaning in language.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The game has no official mobile app — it runs as a web app at contexto.me. Each day's puzzle gets a game number that increments by one, and the game has been running continuously since launch. As of mid-2025, the game numbers are well into the hundreds, reflecting hundreds of daily puzzles.
        </p>
      </section>

      <!-- How Contexto Works -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          How Contexto Works: The Mechanics Behind Semantic Guessing
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          When you type a guess into Contexto, the game compares it against every word in its vocabulary using a pre-computed word embedding model. The model assigns each word a numerical vector — a list of hundreds of numbers that capture the word's meaning. Words with similar meanings have vectors that point in similar directions. The game calculates the distance between your guess's vector and the secret word's vector, then ranks all possible words by that distance.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The ranking system is intuitive: a lower number means closer. Rank 1 is the answer itself. The top 500 words are typically strong synonyms or directly related concepts. Words ranked 500-2,000 share a general category or domain with the answer. Words ranked above 5,000 are usually only tangentially related — they might share a grammatical category or a very loose association.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Contexto has no guess limit. You can guess as many times as you want. The daily puzzle resets based on the server's timezone. Unlike Wordle, which resets at midnight local time, Contexto follows a fixed server-side schedule. This means the new puzzle appears at the same universal time for everyone, regardless of their location.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          One important mechanic: Contexto ranks the top 15,000+ words in its vocabulary, not just a curated answer list. This means you can guess common words ("happy," "water," "run") or obscure words ("sesquipedalian," "syzygy") and get a meaningful ranking for both. The game accepts essentially any English word in its dictionary.
        </p>
      </section>

      <!-- Today's Contexto Answer -->
      <section class="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-xl p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Today's Contexto Answer: How to Find It
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The current Contexto answer is displayed at the top of this page. Click the "Reveal Answer" button to see it, or use the "Hide Answer" button if you changed your mind. The answer card shows the game number and date so you know exactly which puzzle you're looking at.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          We fetch the answer from the official Contexto API, so it's always accurate and synchronized with the game. If the API is temporarily unavailable, the page will show an error message and you can try again in a few minutes. The game number and date are calculated from Contexto's own numbering system, which has been counting up since the game launched.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          For older puzzles, visit our Contexto Archive page. The archive lets you browse by date or game number and reveal the answer for any historical puzzle. We maintain a complete record of every Contexto puzzle since the game's early days.
        </p>
      </section>

      <!-- Past Contexto Answers -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Past Contexto Answers: Archives and Word Patterns
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Contexto answers span the full range of English vocabulary — from common words like "happy," "dog," and "money" to more abstract concepts like "silence," "justice," and "possibility." Unlike Wordle, which restricts answers to a curated 2,300-word list, Contexto can theoretically use any word in its vocabulary as a daily answer.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Looking at historical Contexto answers, there's a noticeable bias toward concrete nouns and common adjectives. Abstract concepts appear regularly but not as frequently as tangible things. Verbs are less common as answers compared to Wordle, where every answer is a verb-able word. This pattern reflects the word embedding model's training data — words that appear frequently in diverse contexts tend to be more "central" in the semantic space and thus more likely to be selected.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Our Contexto archive is the most comprehensive collection of historical answers available. You can use it to study which types of words appear most frequently, or just to look up a puzzle you missed. The archive is searchable by both date and game number.
        </p>
      </section>

      <!-- Tips for Contexto -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Contexto Strategy: How to Solve Puzzles Faster
        </h2>
        <div class="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Start with broad categories</h3>
            <p class="leading-relaxed">
              Your first 3-5 guesses should be broad category words: "person," "place," "thing," "action," "feeling," "animal," "food," "color." These give you a rapid survey of the semantic landscape. If "animal" ranks 200 and "feeling" ranks 8,000, you know the answer is likely related to living things, not emotions. This narrows your search space dramatically.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Follow the semantic trail</h3>
            <p class="leading-relaxed">
              When a word ranks well (under 1,000), explore its semantic neighborhood. If "music" ranks 300, try "song," "instrument," "melody," "rhythm," "band," "concert." Each follow-up guess either moves you closer or tells you you've gone down the wrong branch. This systematic exploration is more effective than random guessing.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Pay attention to ranking jumps</h3>
            <p class="leading-relaxed">
              If your ranking drops from 5,000 to 200 in a single guess, you've found a major semantic landmark. That word and the answer share a strong conceptual connection. Use that word as a springboard for your next guesses. If the jump is small (say, 5,000 to 4,800), you're moving in the right direction but haven't found the right domain yet.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Think about word relationships, not just synonyms</h3>
            <p class="leading-relaxed">
              Contexto understands more than synonyms. Antonyms ("hot" and "cold"), category members ("apple" and "orange"), associated concepts ("doctor" and "hospital"), and even cultural associations ("football" and "Sunday") all influence the ranking. If you're stuck, try guessing words that are related to the answer by association rather than similarity.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Consider word frequency and concreteness</h3>
            <p class="leading-relaxed">
              Contexto answers tend to be relatively common words. Obscure scientific terms, archaic words, and highly technical jargon are unlikely to be the answer. If you've narrowed the domain to "medical terms" but none of your medical guesses rank well, the answer might be a more common health-related word like "pain" or "sleep" rather than a specific condition.
            </p>
          </div>
        </div>
      </section>

      <!-- Contexto Statistics -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Contexto Statistics: What We Know
        </h2>
        <div class="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <div class="grid sm:grid-cols-2 gap-6 my-6">
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">Unlimited</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Guesses allowed per puzzle</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">No guess limit means difficulty is purely conceptual</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~15,000+</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Words ranked per puzzle</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Every guess gets a position in the ranked list</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~30-100</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Average guesses to solve</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Varies widely by player experience and word difficulty</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~60%</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Concrete nouns in answers</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Tangible things appear more often than abstract concepts</p>
            </div>
          </div>
          <p class="leading-relaxed">
            Contexto doesn't publish official player statistics, but community data from Reddit and Discord suggests that the average player solves each puzzle in 30-100 guesses. Experienced players who know the system well can often solve in under 30 guesses by starting with efficient category words. The hardest puzzles tend to be abstract concepts like "silence," "nothing," or "time" — words that are semantically connected to many different domains but don't belong strongly to any single one.
          </p>
          <p class="leading-relaxed">
            The word embedding model that Contexto uses is trained on large-scale text corpora. This means the model reflects common usage patterns in English. Words that appear frequently in similar contexts (like "coffee" and "morning") will rank close to each other. Words that appear in very different contexts (like "quantum" and "recipe") will rank far apart. Understanding these patterns is the key to improving your Contexto game.
          </p>
        </div>
      </section>
    </article>

    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>
  </main>
</div>
