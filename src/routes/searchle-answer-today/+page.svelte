<script lang="ts">
  import FAQSection from '$lib/components/FAQSection.svelte';
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import type { SearchleDailyPuzzle } from '$lib/searchle/daily';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';
  import {
    generateFAQSchema,
    generateHowToSchema,
    generatePersonAuthorSchema,
    generateWebPageSchema
  } from '$lib/seo';

  let { data } = $props<{
    data: {
      totalPuzzles: number;
      todayPuzzle: SearchleDailyPuzzle;
    };
  }>();

  let copiedWord = $state<string | null>(null);
  const totalPuzzles = $derived(data.totalPuzzles);
  const todayPuzzle = $derived(data.todayPuzzle);

  async function copyToClipboard(text: string) {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(text);
    copiedWord = text;
    setTimeout(() => {
      copiedWord = null;
    }, 2000);
  }

  function formatDisplayDate(dateKey: string): string {
    return new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const todayLabel = $derived(formatDisplayDate(data.todayPuzzle.date));
  const pageTitle = $derived(`Searchle Hints and Answer for Today (${todayLabel})`);
  const pageDescription = $derived(
    `Get Searchle hints and the confirmed Searchle answer for today, ${todayLabel}. Use the dedicated archive page for older Searchle prompts and answers.`
  );
  const pageKeywords = $derived(
    `searchle answer today, searchle answer, searchle hint, searchle hint today, searchle answer for ${todayLabel}`
  );

  const faqs = [
    {
      question: 'What is Searchle?',
      answer:
        'Searchle is a daily puzzle where you guess the missing word in a Google autocomplete prompt.'
    },
    {
      question: 'How are Searchle answers calculated?',
      answer:
        'Searchle answers are mapped by date from the original Searchle puzzle list and update daily.'
    },
    {
      question: 'Can I view previous Searchle answers?',
      answer:
        'Yes. Use the Searchle archive page to browse any previous day and reveal its answer.'
    },
    {
      question: 'Where does the data come from?',
      answer:
        'The answer list is based on the real Searchle puzzle dataset.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const howToSchema = generateHowToSchema('How to use the Searchle answer page', [
    { name: 'Read the prompt', text: 'Check todayâ€™s Searchle prompt before revealing the answer.' },
    { name: 'Reveal or copy the answer', text: 'Use the answer card tools to confirm the solution quickly.' },
    { name: 'Open the archive', text: 'Use the dedicated archive page when you need an older Searchle answer.' }
  ]);
  const webPageSchema = $derived({
    ...generateWebPageSchema(
      pageTitle,
      pageDescription,
      'https://wordsolver.tech/searchle-answer-today'
    ),
    author: generatePersonAuthorSchema(
      'Preston Hayes',
      'https://wordsolver.tech/about#preston-hayes',
      'https://wordsolver.tech/auther-wordsolverx.webp'
    )
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/searchle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://wordsolver.tech/searchle-answer-today" />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
        <span>{totalPuzzles.toLocaleString('en-US')} Real Puzzles from Searchle</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Searchle Hints and Answer for Today ({todayLabel})
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        Today&apos;s Searchle prompt and answer, with a dedicated archive page for older puzzles.
      </p>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8">
      <div class="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <div class="p-6 text-center">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-sm font-semibold">Today&apos;s Searchle</span>
          <span class="text-xs px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {todayPuzzle.date}
          </span>
        </div>
        <div class="text-lg text-slate-600 dark:text-slate-400 mb-4 italic">
          "{todayPuzzle.prompt}"
        </div>
        <div class="font-mono text-5xl font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-6">
          {todayPuzzle.answer}
        </div>
        <div class="flex justify-center gap-3 flex-wrap">
          <button
            type="button"
            onclick={() => copyToClipboard(todayPuzzle.answer.toUpperCase())}
            class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm"
          >
            {copiedWord === todayPuzzle.answer.toUpperCase() ? 'Copied' : 'Copy Answer'}
          </button>
          <a
            href="/searchle-archive"
            class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Browse Archive
          </a>
          <a
            href="/searchle-solver"
            class="px-3 py-2 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-600"
          >
            Open Solver
          </a>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white">Need an older Searchle answer?</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-400">
        Older Searchle prompts and answers now live on the dedicated archive page instead of this today page.
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <a
          href="/searchle-archive"
          class="inline-flex items-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-purple-600 dark:hover:bg-purple-500"
        >
          Open Searchle Archive
        </a>
        <a
          href="/searchle-solver"
          class="inline-flex items-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Try the Solver
        </a>
      </div>
    </div>


    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>
</main>

  <FAQSection {faqs} />
</div>


