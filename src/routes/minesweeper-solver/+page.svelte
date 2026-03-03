<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import MinesweeperSolverClient from '$lib/components/minesweeper/MinesweeperSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebApplicationSchema,
    generateWebPageSchema,
  } from '$lib/seo';

  const pageTitle = 'Minesweeper Solver - Free Online Safe Move Finder | WordSolverX';
  const pageDescription =
    'Use this free Minesweeper solver to find safe moves, mark likely mines, and analyze custom boards online. Built for fast puzzle solving with a visual board editor and smart probability hints.';
  const pageUrl = 'https://wordsolverx.com/minesweeper-solver';

  const faqs = [
    {
      question: 'How do I use this Minesweeper solver?',
      answer:
        'Match the board size and mine count to your game, enter the revealed numbers and flagged mines, then click Find Next Move. The Minesweeper solver marks forced safe cells and forced mine cells directly on the board.',
    },
    {
      question: 'What do the green and red markers mean?',
      answer:
        'Green markers are safe squares the solver says can be clicked safely. Red markers are mine locations the solver can prove. If there is no forced move, the solver marks the safest candidates with a question mark.',
    },
    {
      question: 'Can this Minesweeper solver handle custom board sizes?',
      answer:
        'Yes. You can change the width, height, and total mine count before resetting the board. That makes the tool useful for beginner, intermediate, expert, and custom Minesweeper layouts.',
    },
    {
      question: 'Does this Minesweeper solver work on mobile?',
      answer:
        'Yes. The board editor and solver controls are responsive, so you can use the Minesweeper solver on desktop and mobile browsers without installing anything.',
    },
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Minesweeper solver', [
      {
        name: 'Match your puzzle setup',
        text: 'Set the board width, height, and total mine count so the solver matches your real Minesweeper game.',
      },
      {
        name: 'Enter the visible board',
        text: 'Use the number and flag tools to fill in revealed clues and known mines on the board.',
      },
      {
        name: 'Analyze the next move',
        text: 'Click Find Next Move or Find All Moves to let the Minesweeper solver mark safe cells, mines, and the best fallback guesses.',
      },
    ]),
    {
      ...generateSoftwareApplicationSchema('Minesweeper Solver', 'GameApplication'),
      keywords: ['minesweeper solver', 'online minesweeper solver', 'minesweeper helper'],
    },
    generateWebApplicationSchema('Minesweeper Solver', pageDescription),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Solver', url: 'https://wordsolverx.com/solver' },
      { name: 'Minesweeper Solver', url: pageUrl },
    ]),
    generateWebPageSchema('Minesweeper Solver', pageDescription, pageUrl),
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="minesweeper solver, online minesweeper solver, minesweeper helper, minesweeper safe move finder, minesweeper probability solver, minesweeper board analyzer"
  />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://wordsolverx.com/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <link rel="canonical" href={pageUrl} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-950">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <section class="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
    <div class="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-6 py-8 text-white shadow-2xl shadow-indigo-500/10 sm:px-8 sm:py-10">
      <p class="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
        Puzzle solver tool
      </p>
      <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Minesweeper Solver</h1>
      <p class="mt-4 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
        This Minesweeper solver helps you map your board, identify safe clicks, and flag forced mines without leaving the browser. Enter your current puzzle, run the analysis, and use the highlighted next moves to solve faster.
      </p>
    </div>
  </section>

  <MinesweeperSolverClient />

  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <article class="grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-white">Why use a Minesweeper solver?</h2>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          A good Minesweeper solver reduces guesswork. Instead of scanning every pattern manually, you can enter the board once and let the solver check local constraints, subset relationships, and remaining mine counts for you.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          This makes the tool useful when you want a quick safe move, when you are stuck in an advanced puzzle, or when you want to study how strong Minesweeper logic works in real positions.
        </p>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-white">What this Minesweeper solver checks</h2>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          The solver looks for guaranteed safe cells, guaranteed mine cells, and strong probability candidates when no forced move exists. It can also iterate repeatedly to reveal every currently available logical move with one click.
        </p>
        <p class="mt-4 text-sm leading-8 text-slate-300">
          Because the board is fully editable, it works as an online Minesweeper helper for standard 9x9, 16x16, 30x16, and custom puzzle sizes too.
        </p>
      </section>
    </article>

    <section class="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
      <h2 class="text-2xl font-bold text-white">How to get the best results</h2>
      <div class="mt-5 grid gap-5 md:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 class="text-lg font-bold text-white">Enter clues carefully</h3>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            The Minesweeper solver is only as accurate as the board you enter. Double-check your revealed numbers and flagged mines before solving.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 class="text-lg font-bold text-white">Use Find All Moves</h3>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            If one safe move unlocks more logic, the all-moves option keeps iterating to surface every forced move from the current state.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 class="text-lg font-bold text-white">Clear after each step</h3>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            After applying the suggested moves in your real game, clear the temporary solver marks, enter the new numbers, and analyze again.
          </p>
        </div>
      </div>
    </section>

    <div class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-2 shadow-xl backdrop-blur-sm">
      <FAQSection class="py-0" {faqs} title="Minesweeper Solver FAQs" />
    </div>
  </div>
</main>
