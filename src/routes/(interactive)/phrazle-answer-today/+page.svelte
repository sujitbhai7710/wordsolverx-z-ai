<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  interface PhrazleAnswer {
    phrase: string;
    index: number;
  }

  interface PhrazleDayAnswers {
    date: string;
    morning: PhrazleAnswer;
    afternoon: PhrazleAnswer;
  }

  let {
    data
  }: {
    data: {
      totalPhrases: number;
      todayAnswers: PhrazleDayAnswers;
      todayLabel: string;
      pageTitle: string;
      metaTitle: string;
      pageDescription: string;
      pageKeywords: string;
      faqs: { question: string; answer: string }[];
      schemas: string;
    };
  } = $props();

  let showMorningAnswer = $state(true);
  let showAfternoonAnswer = $state(true);
  let copiedWord = $state<string | null>(null);

  async function copyToClipboard(text: string) {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(text);
    copiedWord = text;
    setTimeout(() => {
      copiedWord = null;
    }, 2000);
  }
</script>

<svelte:head>
  <title>{data.metaTitle}</title>
  <meta name="description" content={data.pageDescription} />
  <meta name="keywords" content={data.pageKeywords} />
  <meta property="og:title" content={data.metaTitle} />
  <meta property="og:description" content={data.pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/phrazle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.metaTitle} />
  <meta name="twitter:description" content={data.pageDescription} />
  <link rel="canonical" href="https://wordsolver.tech/phrazle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
        <span>{data.totalPhrases.toLocaleString('en-US')} Phrase Library</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        Phrazle Answer Today ({data.todayLabel})
      </h1>
      <p class="text-slate-600 max-w-xl mx-auto">
        Two puzzles every day, with archive browsing moved to the dedicated Phrazle archive page.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-amber-400 to-orange-400"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-amber-600 mb-2">Morning Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{data.todayAnswers.date}</div>
          {#if showMorningAnswer}
            <div class="font-mono text-3xl font-bold text-amber-600 uppercase mb-2">
              {data.todayAnswers.morning.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{data.todayAnswers.morning.index}</div>
          <div class="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              onclick={() => (showMorningAnswer = !showMorningAnswer)}
              class="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600"
            >
              {showMorningAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {#if showMorningAnswer}
              <button
                type="button"
                onclick={() => copyToClipboard(data.todayAnswers.morning.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-amber-200 text-sm"
              >
                {copiedWord === data.todayAnswers.morning.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-indigo-600 mb-2">Afternoon Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{data.todayAnswers.date}</div>
          {#if showAfternoonAnswer}
            <div class="font-mono text-3xl font-bold text-indigo-600 uppercase mb-2">
              {data.todayAnswers.afternoon.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{data.todayAnswers.afternoon.index}</div>
          <div class="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              onclick={() => (showAfternoonAnswer = !showAfternoonAnswer)}
              class="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600"
            >
              {showAfternoonAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {#if showAfternoonAnswer}
              <button
                type="button"
                onclick={() => copyToClipboard(data.todayAnswers.afternoon.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-indigo-200 text-sm"
              >
                {copiedWord === data.todayAnswers.afternoon.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
      <h2 class="text-xl font-bold text-slate-900">Need an older Phrazle answer?</h2>
      <p class="mt-3 text-slate-600">
        Past morning and afternoon phrase pairs now live on the dedicated archive page instead of this today page.
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <a
          href="/phrazle-archive"
          class="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Open Phrazle Archive
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

  <FAQSection faqs={data.faqs} />
</div>