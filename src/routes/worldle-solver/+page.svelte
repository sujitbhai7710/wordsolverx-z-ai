<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema,
  } from '$lib/seo';
  import WorldleSolverClient from '$lib/components/worldle/WorldleSolverClient.svelte';

  const faqs = [
    {
      question: 'How does the Worldle solver narrow down countries?',
      answer:
        'It compares each candidate country against the distance and direction clues you enter from your guesses. Countries that fail both checks for any hint are removed, and the rest are ranked by how closely they match all clues.',
    },
    {
      question: 'What clues should I enter from the Worldle game?',
      answer:
        'Add the country you guessed, the distance shown by Worldle, and the compass direction arrow from your guess to the answer. If you want, you can also include the proximity percentage as an extra ranking signal.',
    },
    {
      question: 'Does the solver run on the server?',
      answer:
        'No. This tool runs entirely in your browser, so results update locally as you add or remove hints.',
    },
    {
      question: 'Why are there still multiple possible answers sometimes?',
      answer:
        'Worldle clues can overlap. One hint often leaves many countries that are close enough, so adding a second or third hint usually collapses the list quickly.',
    },
  ];

  const pageTitle = 'Worldle Solver - Solve Worldle With Distance And Direction Clues | WordSolverX';
  const pageDescription =
    'Use the WordSolverX Worldle Solver to filter countries by distance, direction, and proximity clues. This Worldle helper runs instantly in your browser.';
  const pageUrl = 'https://wordsolverx.com/worldle-solver';

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Worldle solver', [
      {
        name: 'Choose a guessed country',
        text: 'Search for the country you guessed in the Worldle game and select it from the suggestion list.',
      },
      {
        name: 'Enter the clue values',
        text: 'Add the distance in kilometers, choose the direction arrow, and optionally include the proximity percentage.',
      },
      {
        name: 'Review ranked matches',
        text: 'Add more clues as needed until the ranked candidate list narrows to the most likely country.',
      },
    ]),
    generateSoftwareApplicationSchema('Worldle Solver', 'UtilitiesApplication'),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Solver', url: 'https://wordsolverx.com/solver' },
      { name: 'Worldle Solver', url: pageUrl },
    ]),
    generateWebPageSchema('Worldle Solver', pageDescription, pageUrl),
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="worldle solver, worldle helper, worldle clue solver, worldle country solver, worldle distance solver, worldle direction solver"
  />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://wordsolverx.com/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 rounded-[2rem] bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900 px-6 py-8 text-white shadow-2xl shadow-slate-900/20 sm:px-8 sm:py-10">
      <div class="max-w-4xl">
        <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
          Interactive tool
        </p>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Worldle Solver</h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-sky-50/90 sm:text-lg">
          Solve the geography puzzle by entering the same clues Worldle gives you: guessed country, distance, and direction. The tool filters the candidate list live in your browser, so you can refine guesses without waiting on a server request.
        </p>
      </div>
    </section>

    <div class="mt-8">
      <WorldleSolverClient {faqs} />
    </div>

    <article class="mt-10 grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Why use it</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Turn raw Worldle clues into a ranked shortlist</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Worldle only gives you directional and distance feedback, which can still leave a lot of possible countries after one guess. This solver applies the same geographic math to every country in the dataset, then ranks the best fits so you can focus on the strongest candidates first.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Because the filtering happens on the client, the experience feels immediate. You can add, remove, and reset clues without page reloads, which makes it practical while the actual puzzle is open in another tab.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Best workflow</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Use at least two clues for stronger matches</h2>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          One clue often leaves several countries that fit the same rough band. After your next Worldle guess, add that second clue here and the list usually drops much faster. If the results look wrong, check whether the arrow was read in the correct direction from your guess to the hidden country.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          If you decide you would rather reveal the answer than solve it, the <a class="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 dark:text-sky-300" href="/worldle-answer-today">Worldle Answer Today</a> page gives you the current country plus a server-rendered date lookup for past puzzles.
        </p>
      </section>
    </article>
  </div>
</main>
