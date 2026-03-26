<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import KanoodleGame from '$lib/components/kanoodle/KanoodleGame.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema,
  } from '$lib/seo';

  const faqs = [
    {
      question: 'What is the Kanoodle solver and how do you use it?',
      answer:
        'The Kanoodle solver is an online tool and playable board that helps you solve the 12-piece Kanoodle puzzle. Drag or click a piece, rotate or flip it, then place it on the 5 by 11 board until every cell is filled.',
    },
    {
      question: 'Does this noodle solver find real Kanoodle solutions?',
      answer:
        'Yes. This noodle solver uses the copied Kanoodle solver logic from the original implementation to test solvability, reveal hints, solve the board, and count multiple valid solutions.',
    },
    {
      question: 'Can I generate easier or harder Kanoodle puzzles?',
      answer:
        'Yes. Use the New Puzzle controls to start a board with 1 to 6 pieces already placed. Fewer pre-placed pieces means a harder puzzle.',
    },
    {
      question: 'Does this Kanoodle solver work on mobile?',
      answer:
        'Yes. The layout is responsive and supports tap-to-select plus tap-to-place if dragging is less convenient on your device.',
    },
  ];

  const pageTitle = 'Best Kanoodle Solver and player';
  const pageDescription =
    'Use the Kanoodle solver online with full board controls, hints, challenge mode, and copied solver logic. This noodle solver helps you fit 12 pieces onto a 5x11 grid directly in your browser.';
  const pageUrl = 'https://wordsolver.tech/kanoodle-solver';

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to solve Kanoodle online', [
      {
        name: 'Select a piece',
        text: 'Choose one of the remaining Kanoodle pieces, then rotate or flip it if needed.',
      },
      {
        name: 'Place it on the board',
        text: 'Drag the piece onto the board or tap a board cell after selecting the piece.',
      },
      {
        name: 'Use solver tools',
        text: 'Check the board, ask for a hint, quick solve it, or count all possible solutions whenever you need help.',
      },
    ]),
    {
      ...generateSoftwareApplicationSchema('Kanoodle Solver', 'GameApplication'),
      alternateName: ['Noodle Solver', 'Kanoodle Puzzle Solver'],
      keywords: ['kanoodle solver', 'noodle solver', 'kanoodle puzzle solver'],
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Kanoodle Solver', url: pageUrl },
    ]),
    {
      ...generateWebPageSchema('Kanoodle Solver', pageDescription, pageUrl),
      about: ['kanoodle solver', 'noodle solver', 'spatial puzzle solver'],
    },
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="kanoodle solver, noodle solver, kanoodle online, kanoodle puzzle game, kanoodle hints, kanoodle solution finder, kanoodle puzzle solver, shape puzzle solver, spatial puzzle"
  />
  <meta name="news_keywords" content="kanoodle solver, noodle solver, kanoodle puzzle solver" />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://wordsolver.tech/kanoodle-og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content="https://wordsolver.tech/kanoodle-og.png" />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-white">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <section class="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
    <div class="rounded-[2rem] bg-gradient-to-br from-emerald-600 via-sky-600 to-fuchsia-700 px-6 py-8 text-white shadow-2xl shadow-emerald-500/20 sm:px-8 sm:py-10">
      <p class="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50">
        Online puzzle tool
      </p>
      <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Kanoodle Solver</h1>
      <p class="mt-4 max-w-3xl text-base leading-8 text-emerald-50/90 sm:text-lg">
        This Kanoodle solver is built for players who want a fast way to test placements, get hints, and solve the full 12-piece board online. If you searched for a noodle solver, this page gives you the same practical tool experience with a playable board and instant solver actions.
      </p>
    </div>
  </section>

  <KanoodleGame />

  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <article class="mb-10 grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Why this Kanoodle solver is useful</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          The main value of a Kanoodle solver is speed. Instead of guessing randomly, you can check whether your current board is solvable, reveal one useful hint, or instantly solve the full puzzle. That makes it useful both for learning the puzzle and for getting unstuck when a board feels impossible.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          Because the game board is interactive, this page works as both a playable Kanoodle board and a solver tool. You do not need to switch between a game page and a separate helper page.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Looking for a noodle solver?</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          Many people search for a noodle solver when they mean a Kanoodle solver. This page is optimized for that intent too, with the same piece-placement logic, hint actions, solution counting, and full board solving built into one browser-based tool.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
          Use the controls to generate easier boards, practice harder setups, and learn how different shapes lock together across the 5 by 11 grid.
        </p>
      </section>
    </article>

    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <FAQSection class="py-0" {faqs} title="Kanoodle Solver FAQs" />
    </div>
  </div>
</main>
