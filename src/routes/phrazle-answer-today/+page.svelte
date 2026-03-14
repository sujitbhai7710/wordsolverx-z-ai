<script lang="ts">
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { TOTAL_PHRASES, getAnswerForDate } from '$lib/phrazle/phrases';
  import { generateFAQSchema, generateHowToSchema, generateWebPageSchema } from '$lib/seo';
  import { getISTToday } from '$lib/utils';

  interface PhrazleAnswer {
    phrase: string;
    index: number;
  }

  interface PhrazleDayAnswers {
    date: string;
    morning: PhrazleAnswer;
    afternoon: PhrazleAnswer;
  }

  const today = getISTToday();
  let showMorningAnswer = $state(true);
  let showAfternoonAnswer = $state(true);
  let copiedWord = $state<string | null>(null);

  function formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function getDayAnswers(date: Date): PhrazleDayAnswers {
    const morning = getAnswerForDate(date, 'morning');
    const afternoon = getAnswerForDate(date, 'afternoon');
    return {
      date: formatDateKey(date),
      morning: {
        phrase: morning.phrase,
        index: morning.index
      },
      afternoon: {
        phrase: afternoon.phrase,
        index: afternoon.index
      }
    };
  }

  const todayAnswers: PhrazleDayAnswers = getDayAnswers(today);

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

  const todayLabel = formatDisplayDate(todayAnswers.date);
  const pageTitle = `Phrazle Hints and Answers for Today (${todayLabel})`;
  const pageDescription = `Get Phrazle hints and the confirmed morning and afternoon Phrazle answers for today, ${todayLabel}. Use the dedicated archive page for older phrase pairs.`;
  const pageKeywords = `phrazle answer today, phrazle answer, phrazle hint, phrazle hint today, phrazle answer for ${todayLabel}`;

  const faqs = [
    {
      question: 'What is Phrazle?',
      answer:
        'Phrazle is a daily phrase guessing game with two puzzles each day, a morning puzzle and an afternoon puzzle.'
    },
    {
      question: 'How are Phrazle answers calculated?',
      answer:
        'Answers are mapped by date using the official Phrazle phrase list and the game schedule.'
    },
    {
      question: 'Can I view previous Phrazle answers?',
      answer:
        'Yes. Use the Phrazle archive page to see both the morning and afternoon answers for older dates.'
    },
    {
      question: 'Why are there two puzzles?',
      answer:
        'Phrazle releases two puzzles per day, so each date has a morning phrase and an afternoon phrase.'
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const howToSchema = generateHowToSchema('How to use the Phrazle answer page', [
    { name: 'Check both puzzles', text: 'Review the morning and afternoon answer cards for today’s date.' },
    { name: 'Reveal or copy', text: 'Use the buttons to hide, reveal, or copy either phrase.' },
    { name: 'Open the archive', text: 'Use the dedicated archive page when you need an older Phrazle answer pair.' }
  ]);
  const webPageSchema = generateWebPageSchema(
    pageTitle,
    pageDescription,
    'https://wordsolverx.com/phrazle-answer-today'
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolverx.com/phrazle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <link rel="canonical" href="https://wordsolverx.com/phrazle-answer-today" />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
        <span>{TOTAL_PHRASES.toLocaleString('en-US')} Phrase Library</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Phrazle Hints and Answers for Today ({todayLabel})
      </h1>
      <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        Two puzzles every day, with archive browsing moved to the dedicated Phrazle archive page.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-amber-400 to-orange-400"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-amber-600 mb-2">Morning Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{todayAnswers.date}</div>
          {#if showMorningAnswer}
            <div class="font-mono text-3xl font-bold text-amber-600 uppercase mb-2">
              {todayAnswers.morning.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{todayAnswers.morning.index}</div>
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
                onclick={() => copyToClipboard(todayAnswers.morning.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-amber-200 text-sm"
              >
                {copiedWord === todayAnswers.morning.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-indigo-600 mb-2">Afternoon Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{todayAnswers.date}</div>
          {#if showAfternoonAnswer}
            <div class="font-mono text-3xl font-bold text-indigo-600 uppercase mb-2">
              {todayAnswers.afternoon.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{todayAnswers.afternoon.index}</div>
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
                onclick={() => copyToClipboard(todayAnswers.afternoon.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-indigo-200 text-sm"
              >
                {copiedWord === todayAnswers.afternoon.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white">Need an older Phrazle answer?</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-400">
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
  </main>

  <FAQSection {faqs} />
</div>
