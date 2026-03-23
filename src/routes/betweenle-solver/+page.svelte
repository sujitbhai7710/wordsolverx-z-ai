<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import BetweenleSolverClient from '$lib/components/betweenle/BetweenleSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema,
  } from '$lib/seo';

  const pageTitle = 'Betweenle Solver - Free Online Betweenle Helper | WordSolverX';
  const pageDescription =
    'Use this free Betweenle solver to enter your top and bottom bounds, add distance percentages, and get the best next word to guess. Built for fast Betweenle solving with real dictionary logic.';
  const pageUrl = 'https://wordsolver.tech/betweenle-solver';

  const faqs = [
    {
      question: 'How do I use the Betweenle solver?',
      answer:
        'Enter the current top and bottom bound words from your Betweenle game, add the distance percentages shown by the puzzle, then click Solve. The Betweenle solver calculates the strongest next guess from the remaining alphabetical range.',
    },
    {
      question: 'Does the Betweenle solver use the same game logic?',
      answer:
        'Yes. This Betweenle solver uses the same word ordering and bound logic, then combines it with the percentage clues to estimate the best next word.',
    },
    {
      question: 'Can I use the Betweenle solver with only one bound?',
      answer:
        'Yes. If you only know the top word or the bottom word, leave the other side blank. The solver still narrows the range and gives you a smart next guess.',
    },
    {
      question: 'Is this Betweenle solver mobile friendly?',
      answer:
        'Yes. The solver works on phones, tablets, and desktop browsers, and you can copy suggested words directly from the page.',
    },
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Betweenle solver', [
      {
        name: 'Enter your current bounds',
        text: 'Add the top and bottom words currently shown in your Betweenle game.',
      },
      {
        name: 'Add distance percentages',
        text: 'Type the percentages shown next to those bounds so the solver can estimate the next best area.',
      },
      {
        name: 'Copy the suggested word',
        text: 'Click Solve, copy the recommended guess, and repeat until the Betweenle answer is found.',
      },
    ]),
    {
      ...generateSoftwareApplicationSchema('Betweenle Solver', 'GameApplication'),
      keywords: ['betweenle solver', 'betweenle helper', 'betweenle answer solver'],
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Betweenle Solver', url: pageUrl },
    ]),
    generateWebPageSchema('Betweenle Solver', pageDescription, pageUrl),
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="betweenle solver, betweenle helper, betweenle answer solver, betweenle word finder, betweenle clue solver"
  />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <section class="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
    <BetweenleSolverClient />
  </section>

  <section class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Why this Betweenle solver works</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          Betweenle is really a range-narrowing puzzle. Every guess tells you whether the answer is alphabetically above or below your word, and the percentages reveal how close the answer is to each bound. This solver combines both pieces of information to make smarter guesses than a plain middle-word strategy.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          When the remaining range gets small, the page also shows the possible words directly so you can finish the puzzle quickly without guesswork.
        </p>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">When to use the solver</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          The Betweenle solver is most useful when your bounds are set but the remaining alphabetical gap still feels too large. It is also helpful when the percentages disagree slightly and you want a cleaner next move than manual estimation.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          Use it as a quick assistant, or use it as a way to learn the optimal search pattern so you can get better at solving Betweenle on your own.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          If you want to practice the same logic directly, try the <a class="font-semibold text-indigo-600 dark:text-indigo-300" href="/betweenle-unlimited">Betweenle Unlimited game</a> and switch between unlimited, archive, and custom Betweenle modes.
        </p>
      </article>
    </div>

    <div class="mt-10 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <FAQSection class="py-0" {faqs} title="Betweenle Solver FAQs" />
    </div>
  </section>
</main>
