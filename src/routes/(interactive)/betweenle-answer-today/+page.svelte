<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { formatBetweenleDate } from '$lib/betweenle/logic';
  import type { BetweenleDailyAnswer } from '$lib/betweenle/types';
  import { WORD_GAMES_BETWEENLE_UNLIMITED_URL } from '$lib/word-games-links';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateWebPageSchema,
  } from '$lib/seo';

  let { data } = $props();

  let archive = $derived(data.archive as BetweenleDailyAnswer[]);
  let previousAnswers = $derived(archive.slice(-6, -1).reverse());
  let answerWord = $derived(data.todayAnswer.word.toUpperCase());
  let wordLetters = $derived(data.todayAnswer.word.toUpperCase().split(''));
  let vowelCount = $derived(wordLetters.filter((letter) => 'AEIOU'.includes(letter)).length);
  let hasRepeatLetter = $derived(new Set(wordLetters).size !== wordLetters.length);

  let faqs = $derived.by(() => [
    {
      question: 'What is the Betweenle answer today?',
      answer:
        'Use the reveal answer button on this page to show the official Betweenle answer for today after checking the clue cards first.',
    },
    {
      question: "What was yesterday's Betweenle answer?",
      answer: previousAnswers[0]
        ? `Yesterday's Betweenle answer for ${formatBetweenleDate(previousAnswers[0].date)} was ${previousAnswers[0].word.toUpperCase()}.`
        : "Yesterday's Betweenle answer is not available right now.",
    },
    {
      question: 'Can I check older Betweenle answers?',
      answer:
        'Yes. Use the archive link on this page to browse older puzzle answer pages and the main archive hub for more daily games.',
    },
    {
      question: 'How should I use the clues before revealing the answer?',
      answer:
        'Start with the word length, first letter, last letter, vowels, and letter pattern clues. That gives you a quick way to test your guess before opening the final answer.',
    },
    {
      question: 'What time does the new Betweenle puzzle reset each day?',
      answer:
        'Betweenle follows the standard daily puzzle schedule and resets at midnight local time, similar to Wordle and most other daily word games. A new puzzle number is assigned each day — today is puzzle #' + data.todayAnswer.puzzleNumber + ', so tomorrow will be #' + (data.todayAnswer.puzzleNumber + 1) + '. The archive on this page automatically updates to show the latest answers.',
    },
    {
      question: 'How is Betweenle different from Wordle?',
      answer:
        'Wordle gives you six guesses with color-coded letter feedback after each one. Betweenle takes a completely different approach — it shows you two boundary words that sit immediately before and after the answer alphabetically, and you have to figure out the word that fits between them. There are no intermediate guesses or color tiles. Betweenle rewards vocabulary depth and alphabetical awareness, while Wordle rewards letter frequency analysis and pattern recognition.',
    },
    {
      question: 'Does Betweenle repeat answers?',
      answer:
        'Yes. Betweenle draws from a fixed answer pool, so words do eventually cycle back around. The recent answers section on this page shows the last five daily words, which helps you spot whether a word has appeared recently. Certain common words like CREAM, FLAME, and GRAPE tend to show up more often simply because they sit in frequently-occurring alphabetical gaps.',
    },
  ]);

  let schemas = $derived.by(() =>
    JSON.stringify([
      generateFAQSchema(faqs),
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.meta.title,
        description: data.meta.description,
        mainEntityOfPage: data.meta.canonical,
        image: 'https://wordsolverx.com/images/betweenle-answer-today.webp',
        keywords: data.meta.keywords,
        datePublished: `${data.todayAnswer.date}T00:00:00Z`,
        dateModified: `${data.todayAnswer.date}T00:00:00Z`,
        author: {
          '@type': 'Organization',
          name: 'WordSolverX',
        },
        publisher: {
          '@type': 'Organization',
          name: 'WordSolverX',
          logo: {
            '@type': 'ImageObject',
            url: 'https://wordsolverx.com/images/betweenle-answer-today.webp',
          },
        },
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: 'https://wordsolverx.com' },
        { name: 'Today', url: 'https://wordsolverx.com/today' },
        { name: 'Betweenle Answer Today', url: data.meta.canonical },
      ]),
      generateWebPageSchema(data.meta.title, data.meta.description, data.meta.canonical),
    ])
  );

  let showAnswer = $state(false);

  let clueCards = $derived([
    { label: 'Word Length', value: `${data.todayAnswer.word.length} letters` },
    { label: 'Starts With', value: wordLetters[0] ?? '-' },
    { label: 'Ends With', value: wordLetters[wordLetters.length - 1] ?? '-' },
    { label: 'Vowels', value: `${vowelCount}` },
    { label: 'Repeat Letters', value: hasRepeatLetter ? 'Yes' : 'No' },
  ]);
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta
    name="keywords"
    content={data.meta.keywords ?? 'betweenle answer today, betweenle answer, betweenle hint, betweenle hint today'}
  />
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={data.meta.canonical} />
  <meta property="og:image" content="https://wordsolverx.com/images/betweenle-answer-today.webp" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content="https://wordsolverx.com/images/betweenle-answer-today.webp" />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-900">
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />

    <section class="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
      <div class="inline-flex rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
        Betweenle Answer Today
      </div>
      <h1 class="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
        Betweenle Hints and Answer Today ({data.todaySeoDate})
      </h1>
      <p class="mt-5 max-w-3xl text-base leading-8 text-slate-600">
        Check the clue cards first, then reveal the official Betweenle answer for puzzle
        <strong class="font-bold text-slate-900">#{data.todayAnswer.puzzleNumber}</strong> when you are ready.
      </p>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Today</p>
          <p class="mt-2 text-lg font-black text-slate-900">{data.todayLabel}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Puzzle Number</p>
          <p class="mt-2 text-lg font-black text-slate-900">#{data.todayAnswer.puzzleNumber}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Word Length</p>
          <p class="mt-2 text-lg font-black text-slate-900">{data.todayAnswer.word.length} letters</p>
        </div>
      </div>
    </section>

    <section class="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Clues First</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900">Today&apos;s Betweenle clues</h2>
        </div>
        <a
          href="/betweenle-solver"
          class="inline-flex items-center rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700 transition-colors hover:bg-violet-100"
        >
          Open Betweenle Solver
        </a>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each clueCards as clue}
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{clue.label}</p>
            <p class="mt-3 text-2xl font-black text-slate-900">{clue.value}</p>
          </div>
        {/each}
      </div>

      <div class="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Final answer</p>
        <p class="mt-3 text-base leading-7 text-slate-600">
          Try the clues first. When you want the official word, use the reveal button below.
        </p>

        {#if !showAnswer}
          <button
            class="mt-5 inline-flex items-center justify-center rounded-2xl bg-teal-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-500  "
            onclick={() => (showAnswer = true)}
            type="button"
          >
            Reveal Today&apos;s Answer
          </button>
        {:else}
          <div class="mt-5 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-6">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Official Betweenle answer</p>
            <p class="mt-3 text-4xl font-black uppercase tracking-[0.18em] text-slate-900 sm:text-5xl">
              {answerWord}
            </p>
            <p class="mt-3 text-sm text-slate-600">
              Answer for {data.todayLabel} and Betweenle puzzle #{data.todayAnswer.puzzleNumber}.
            </p>
          </div>
        {/if}
      </div>
    </section>

    <section class="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Previous Answers</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900">Recent Betweenle answers</h2>
          <p class="mt-3 text-base leading-8 text-slate-600">
            A quick look at the most recent Betweenle answers before today.
          </p>
        </div>
        <a
          href="/archive"
          class="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
        >
          Browse Archive Hub
        </a>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        {#each previousAnswers as item}
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{formatBetweenleDate(item.date)}</p>
            <p class="mt-3 text-2xl font-black uppercase tracking-[0.14em] text-slate-900">
              {item.word}
            </p>
            <p class="mt-2 text-sm text-slate-600">Puzzle #{item.puzzleNumber}</p>
          </article>
        {/each}
      </div>

      <div class="mt-8 grid gap-3 sm:grid-cols-3">
        <a
          href="/betweenle-solver"
          class="rounded-2xl bg-teal-600 px-5 py-4 text-center text-sm font-bold text-white transition-colors hover:bg-teal-500  "
        >
          Betweenle Solver
        </a>
        <a
          href={WORD_GAMES_BETWEENLE_UNLIMITED_URL}
          class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
        >
          Play Betweenle Unlimited
        </a>
        <a
          href="/today"
          class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
        >
          More Today Answers
        </a>
      </div>
    </section>
  </div>

  <section class="pb-12">
    <FAQSection {faqs} title="Betweenle Answer FAQs" />
  </section>

  <article class="space-y-8">
    <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      <h2 class="text-3xl font-black tracking-tight text-slate-900">What is Betweenle?</h2>
      <p class="mt-4 text-lg leading-8 text-slate-600">
          Betweenle is a daily word puzzle where the game picks a secret word from a predefined list and shows you two boundary words — one that comes just before it alphabetically and one that comes just after it. Your job is to figure out the word that sits between those two boundaries.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          It sounds simple at first, but once you realize how many words share the same alphabetical neighborhood, the challenge becomes real.
        </p>
      <p class="mt-4 text-lg leading-8 text-slate-600">
          The game was created as a spin on the Wordle formula, but instead of letter-by-letter deduction, Betweenle tests your vocabulary and your sense of where words sit in the dictionary.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          You do not get color tiles telling you which letters are correct. You get two anchor words and the gap between them — and the answer is hiding somewhere in that gap.
        </p>
      <p class="mt-4 text-lg leading-8 text-slate-600">
          Betweenle has built a steady following since launch, partly because the daily format keeps players coming back, and partly because the game is genuinely hard in a satisfying way. There is no substitute for actually knowing words and understanding alphabetical ordering.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          You cannot brute-force your way through it the way you can with some other word games.
        </p>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      <h2 class="text-3xl font-black tracking-tight text-slate-900">How Betweenle Works</h2>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        Each day, Betweenle selects one word from its answer list. The game then identifies the two words that sit immediately before and after the answer in alphabetical order. Those boundary words are displayed on screen, and you have to type the word that fits between them.
      </p>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        The daily cycle resets at midnight, matching the standard Wordle schedule for most players. There is one puzzle per day, which keeps the format focused and prevents binge-playing. Every puzzle is assigned a sequential puzzle number, so you can track how far along you are in the archive.
      </p>
      <p class="mt-4 text-lg leading-8 text-slate-600">
          Unlike games where you submit multiple guesses and get feedback after each one, Betweenle is more of a single-shot challenge. You see the boundaries, you think about what word could fit, and you submit your answer.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The feedback is binary — right or wrong. That means preparation and vocabulary knowledge matter more than raw guessing speed.
        </p>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        The answer pool is drawn from common English words, typically between five and eight letters. The boundaries themselves are real words from the same pool, which means the gap you are trying to fill is always a real alphabetical space in the dictionary, not an artificial puzzle construction.
      </p>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      <h2 class="text-3xl font-black tracking-tight text-slate-900">Today&apos;s Betweenle Answer — How This Page Works</h2>
      <p class="mt-4 text-lg leading-8 text-slate-600">
          This page tracks the daily Betweenle puzzle automatically. The clue cards at the top show you the word length, first letter, last letter, vowel count, and whether the answer has repeating letters — all without revealing the word itself.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          That is enough information to make an educated guess if you want to try solving it yourself before looking at the answer.
        </p>
      <p class="mt-4 text-lg leading-8 text-slate-600">
          Puzzle numbers increment daily, starting from the game&apos;s launch. If today is puzzle #{data.todayAnswer.puzzleNumber}, yesterday was #{data.todayAnswer.puzzleNumber - 1} and tomorrow will be #{data.todayAnswer.puzzleNumber + 1}.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The archive section on this page shows the five most recent answers in reverse chronological order, so you can spot patterns or check whether a word you were thinking of has appeared recently.
        </p>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        The Betweenle solver link at the top of the page opens a separate tool where you can enter the boundary words and filter the answer list. That is useful when you want to narrow down candidates without just reading the answer here.
      </p>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      <h2 class="text-3xl font-black tracking-tight text-slate-900">Strategy Tips for Betweenle</h2>
      <div class="mt-6 space-y-6">
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-xl font-bold text-slate-900">Memorize common alphabetical neighbors</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            Most Betweenle answers come from common words. If you see CRANE and CREATE as boundaries, the answer is CREAM — and that kind of pattern shows up often. The more you play, the more you will recognize recurring gaps. Keep a mental list of three-letter middle sections that fill common alphabetical spaces.
          </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-xl font-bold text-slate-900">Start with the first and last letters</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            The boundary words share either the same starting letters or sit very close together. If both boundaries start with the same three letters, the answer almost certainly starts with those three letters too. The clue card on this page tells you the first and last letter directly, which narrows the search dramatically.
          </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-xl font-bold text-slate-900">Count the letters in the gap</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
          If the left boundary is APPLE and the right boundary is APPLY, there is exactly one word that fits (APPLQ is not a word, but APPLY already tells you the answer length).
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          When the gap is wide — say, between DANCE and DRAKE — you need to think about all five- and six-letter words starting with D that fall between those two endpoints alphabetically.
        </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-xl font-bold text-slate-900">Think about prefixes and suffixes</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            Many Betweenle answers share a prefix or suffix with one of the boundary words. If the boundaries are PLAYING and POINTED, the answer likely starts with PL or PO and shares the -ING or -ED ending structure. Pay attention to the morphological patterns, not just the raw alphabetical order.
          </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-xl font-bold text-slate-900">Use the solver for hard puzzles</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            When the gap between the two boundary words is large and you cannot think of anything that fits, the Betweenle solver on WordSolverX can filter candidates by letter count, starting letter, and alphabetical position. It is faster than scrolling through a dictionary and teaches you which words sit in common gaps.
          </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-xl font-bold text-slate-900">Check recent answers for repeats</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            Betweenle&apos;s answer pool is finite, so words do eventually repeat. The recent answers section on this page shows the last five days. If you have been playing for a while, you may recognize a pattern — certain words like CREAM, GRAPE, and FLAME show up more often than you would expect.
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      <h2 class="text-3xl font-black tracking-tight text-slate-900">Betweenle vs Similar Word Games</h2>
      <div class="mt-6 grid gap-6 sm:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-lg font-bold text-slate-900">Betweenle vs Wordle</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
          Wordle gives you six guesses with letter-by-letter color feedback. Betweenle gives you two boundary words and no intermediate feedback. Wordle rewards pattern recognition and letter frequency analysis.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          Betweenle rewards vocabulary depth and alphabetical awareness. If you are good at Wordle, Betweenle will still challenge you because the skill set is different.
        </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-lg font-bold text-slate-900">Betweenle vs Absurdle</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            Absurdle actively works against you, changing the target word as you guess. Betweenle is more straightforward — the target word is fixed from the start, and the boundaries do not change. Absurdle can feel adversarial, while Betweenle feels like a fair puzzle where the challenge comes from the word itself.
          </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-lg font-bold text-slate-900">Betweenle vs Contexto</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            Contexto uses word embeddings to show you how semantically close your guesses are to the target. Betweenle uses pure alphabetical ordering. Contexto is about meaning; Betweenle is about spelling order. Both are daily games, but they test completely different mental skills.
          </p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-6">
          <h3 class="text-lg font-bold text-slate-900">Betweenle vs Weaver</h3>
          <p class="mt-2 text-base leading-7 text-slate-600">
            Weaver gives you a starting word and a target word, and you change one letter at a time to get from one to the other. Betweenle instead gives you two adjacent words and asks you to find what sits between them. Weaver is about letter transformation chains; Betweenle is about alphabetical proximity and vocabulary.
          </p>
        </div>
      </div>
    </section>
  </article>

    <div class="mx-auto mt-12 max-w-4xl px-4 sm:px-6 lg:px-8">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>
</main>


