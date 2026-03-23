<script lang="ts">
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

  let pageTitle = $derived(`Contexto Hints and Answer for Today (${activeLabel})`);
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
        'Contexto is a daily word guessing game where you find the secret word based on semantic closeness.'
    },
    {
      question: 'How is the game number calculated?',
      answer:
        'Contexto game numbers increment by one each day based on the official release schedule.'
    },
    {
      question: 'Can I view previous Contexto answers?',
      answer:
        'Yes. Use the Contexto archive page to browse older dates and reveal the answer for that day.'
    },
    {
      question: 'Where does the data come from?',
      answer:
        'Answers are fetched directly from the official Contexto API.'
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
      pageTitle,
      pageDescription,
      'https://wordsolver.tech/contexto-answer-today'
    )
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/contexto-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <link rel="canonical" href="https://wordsolver.tech/contexto-answer-today" />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
        <span>Daily Contexto Answers</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Contexto Hints and Answer for Today ({activeLabel})
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        A focused today page for the current Contexto answer, with archive lookups moved to the dedicated archive page.
      </p>
    </div>

    <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden mb-10">
      <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-6 text-white">
        <p class="text-sm uppercase tracking-[0.2em] text-violet-100 mb-2">Answer Today</p>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-sm">
            Game #{activeGameNumber}
          </span>
          <span class="text-sm text-violet-100">
            {activeDate}
          </span>
        </div>
      </div>

      <div class="p-6 md:p-8">
        {#if data.error}
          <div class="text-center py-6">
            <p class="text-red-500">{data.error}</p>
          </div>
        {:else if data.initialAnswer?.success}
          <div class="grid lg:grid-cols-[1.4fr_0.9fr] gap-6 items-start">
            <div>
              <div class={`rounded-3xl border-2 transition-all p-6 md:p-8 ${showAnswer ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700' : 'bg-slate-50 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700'}`}>
                <p class="text-sm text-slate-500 mb-3">The Contexto answer for this day</p>
                {#if showAnswer}
                  <p class="text-4xl md:text-6xl font-black tracking-tight text-violet-600 dark:text-violet-300 capitalize">
                    {data.initialAnswer.answer}
                  </p>
                {:else}
                  <p class="text-2xl md:text-4xl font-bold text-slate-400">Answer hidden</p>
                {/if}
              </div>

              <div class="flex gap-3 flex-wrap mt-5">
                <button
                  type="button"
                  onclick={() => (showAnswer = !showAnswer)}
                  class={`px-5 py-3 rounded-xl text-white font-medium ${showAnswer ? 'bg-slate-600 hover:bg-slate-700' : 'bg-violet-600 hover:bg-violet-700'}`}
                >
                  {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                </button>
                <a
                  href="/contexto-archive"
                  class="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Browse Archive
                </a>
              </div>
            </div>

            <div class="space-y-4">
              <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-5">
                <h2 class="text-base font-semibold mb-3">Need an older Contexto answer?</h2>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Older Contexto dates and game-number lookups now live on the dedicated archive page.
                </p>
                <a
                  href="/contexto-archive"
                  class="mt-4 inline-flex px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
                >
                  Open Contexto Archive
                </a>
              </div>

              <div class="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white p-5">
                <p class="font-semibold mb-1">Play Contexto</p>
                <p class="text-sm text-purple-100 mb-4">Open the official puzzle after checking the answer.</p>
                <a
                  href="https://contexto.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex px-4 py-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/20"
                >
                  Open contexto.me
                </a>
              </div>
            </div>
          </div>
        {:else}
          <div class="text-center py-6 text-slate-500">Unable to load today&apos;s answer right now.</div>
        {/if}
      </div>
    </section>

    <FAQSection title="Contexto Answer FAQ" {faqs} class="pb-0" />
  </main>
</div>
