<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { formatBetweenleDate } from '$lib/betweenle/logic';
  import type { BetweenleDailyAnswer } from '$lib/betweenle/types';
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
        image: 'https://wordsolver.tech/wordsolverx.webp',
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
            url: 'https://wordsolver.tech/wordsolverx.webp',
          },
        },
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: 'https://wordsolver.tech' },
        { name: 'Today', url: 'https://wordsolver.tech/today' },
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
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
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
            class="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
            onclick={() => (showAnswer = true)}
            type="button"
          >
            Reveal Today&apos;s Answer
          </button>
        {:else}
          <div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Official Betweenle answer</p>
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
          class="rounded-2xl bg-slate-900 px-5 py-4 text-center text-sm font-bold text-white transition-colors hover:bg-slate-800"
        >
          Betweenle Solver
        </a>
        <a
          href="/betweenle-unlimited"
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
</main>
