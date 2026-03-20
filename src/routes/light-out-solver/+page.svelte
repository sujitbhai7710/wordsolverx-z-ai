<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import LightsOutSolverClient from '$lib/components/lightsout/LightsOutSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema
  } from '$lib/seo';

  const pageTitle = 'Light Out Solver - Free Online Lights Out Puzzle Solver | WordSolverX';
  const pageDescription =
    'Use this Light Out solver online to build any 2x2 to 5x5 puzzle, switch between linked and edit modes, and generate the exact optimal solve path in your browser.';
  const pageUrl = 'https://wordsolverx.com/light-out-solver';

  const faqs = [
    {
      question: 'How does this Light Out solver work?',
      answer:
        'The solver uses the same Gaussian-elimination logic from the original Light Out project to find an optimal move sequence whenever a solution exists.'
    },
    {
      question: 'What is the difference between Linked Toggle and Edit Puzzle?',
      answer:
        'Linked Toggle behaves like the real game and flips the clicked light plus its neighbors. Edit Puzzle lets you set up any custom board one light at a time.'
    },
    {
      question: 'Can I solve random puzzles and manual board setups?',
      answer:
        'Yes. You can generate random boards, recreate a puzzle you already have, then solve it and review every step as a mini-board sequence.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Light Out solver', [
      { name: 'Choose a board size', text: 'Pick a size from 2 by 2 up to 5 by 5.' },
      { name: 'Build or randomize the board', text: 'Use linked play or edit mode to create the puzzle state you want to solve.' },
      { name: 'Run the solver', text: 'Click Solve board to get the exact optimal move sequence and follow the step cards.' }
    ]),
    {
      ...generateSoftwareApplicationSchema('Light Out Solver', 'GameApplication'),
      keywords: ['light out solver', 'lights out solver', 'lights out puzzle solver']
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Solver', url: 'https://wordsolverx.com/solver' },
      { name: 'Light Out Solver', url: pageUrl }
    ]),
    generateWebPageSchema('Light Out Solver', pageDescription, pageUrl)
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="light out solver, lights out solver, lights out puzzle, online lights out solver, optimal lights out solution"
  />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <link rel="canonical" href={pageUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-white">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <LightsOutSolverClient />

  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <article class="grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl">
        <h2 class="text-2xl font-bold text-slate-900">Why use a Light Out solver?</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600">
          Light Out puzzles can look simple, but larger boards quickly become hard to reason about by hand. A solver helps you understand whether a board is solvable and gives you the shortest path instead of trial-and-error tapping.
        </p>
      </section>

      <section class="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">
        <h2 class="text-2xl font-bold text-slate-900">What stays the same from the original project?</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600">
          The board logic, random puzzle generation, solution animation, and exact optimal solving behavior are preserved. The main change here is a brighter, more mobile-friendly WordSolverX presentation.
        </p>
      </section>
    </article>

    <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
      <FAQSection class="py-0" {faqs} title="Light Out Solver FAQs" />
    </div>
  </div>
</main>
