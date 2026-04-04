<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    COLORS,
    COLOR_NAMES,
    checkGuess,
    getAllCombinations,
    getCombinationTargetColor,
    getContrastColor,
    isValidHex,
    normalizeHex,
    solveFromHexTopN,
    type SolveResult
  } from '$lib/colorfle';

  type Feedback = 'green' | 'yellow' | 'gray';

  interface GuessState {
    colors: number[];
    feedback: Array<Feedback | null>;
  }

  let hexInput = $state('');
  let errorMessage = $state('');
  let suggestions = $state<SolveResult[]>([]);
  let guesses = $state<GuessState[]>([]);
  let solved = $state(false);

  const faqs = [
    {
      question: 'How does the Colorfle solver work?',
      answer: 'The Colorfle solver supports both directions: start from a visible target hex to find the best matching source colors, or enter feedback from your guesses to narrow the remaining combinations.'
    },
    {
      question: 'Does the solver use the same Colorfle mixing logic?',
      answer: 'Yes. The solver uses the same color list, weighted mixing model, and feedback filtering logic from the source Colorfle project.'
    },
    {
      question: 'Can I solve Colorfle without revealing today\'s answer?',
      answer: 'Yes. Use the solver first, then visit the Colorfle answer today page only when you want to confirm the result.'
    }
  ];

  function handleSolveHex() {
    if (!isValidHex(hexInput)) {
      errorMessage = 'Enter a valid hex color such as #8ce874.';
      return;
    }

    errorMessage = '';
    suggestions = solveFromHexTopN(normalizeHex(hexInput), 5);
    guesses = [];
    solved = false;
  }

  function useSuggestion(result: SolveResult) {
    if (solved) return;
    guesses = [...guesses, { colors: result.colors, feedback: [null, null, null] }];
    suggestions = [];
  }

  function cycleFeedback(guessIndex: number, colorIndex: number) {
    const updated = guesses.map((guess, index) => {
      if (index !== guessIndex) return guess;

      const feedback = [...guess.feedback];
      const current = feedback[colorIndex];
      feedback[colorIndex] = current === null ? 'green' : current === 'green' ? 'yellow' : current === 'yellow' ? 'gray' : null;

      return {
        ...guess,
        feedback
      };
    });

    guesses = updated;
    const latest = updated[guessIndex];
    if (latest.feedback.every((value) => value === 'green')) {
      solved = true;
    }
  }

  function refineSuggestions() {
    if (solved || guesses.length === 0 || guesses.some((guess) => guess.feedback.some((value) => value === null))) {
      return;
    }

    const possibilities = getAllCombinations(0).filter((candidate) =>
      guesses.every((guess) => checkGuess(guess.colors, candidate, guess.feedback as Feedback[]))
    );

    if (possibilities.length === 0) {
      errorMessage = 'No combinations matched the selected feedback. Double-check your colors and feedback.';
      suggestions = [];
      return;
    }

    errorMessage = '';
    suggestions = possibilities.slice(0, 5).map((colors) => {
      const target = getCombinationTargetColor(colors, 0);
      return {
        colors,
        colorNames: colors.map((index) => COLOR_NAMES[index]),
        colorHexes: colors.map((index) => COLORS[index]),
        targetColor: target.rgb,
        targetHex: target.hex,
        similarity: 0
      };
    });
  }

  function resetSolver() {
    hexInput = '';
    errorMessage = '';
    suggestions = [];
    guesses = [];
    solved = false;
  }

  function feedbackLabel(value: Feedback | null) {
    if (value === 'green') return 'Green';
    if (value === 'yellow') return 'Yellow';
    if (value === 'gray') return 'Gray';
    return 'Unset';
  }
</script>

<svelte:head>
  <title>Colorfle Solver - Free Colorfle Helper Tool | WordSolverX</title>
  <meta name="description" content="Use the Colorfle solver to match target hex colors, test Colorfle feedback, and narrow the correct three-color combination fast." />
  <meta name="keywords" content="colorfle solver, colorfle helper, colorfle answer, colorfle color solver" />
  <link rel="canonical" href="https://wordsolver.tech/colorfle-solver" />
  <meta property="og:title" content="Colorfle Solver - Free Colorfle Helper Tool" />
  <meta property="og:description" content="Match Colorfle target hex values or refine guesses with Colorfle-style feedback filtering." />
  <meta property="og:url" content="https://wordsolver.tech/colorfle-solver" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colorfle Solver" />
  <meta name="twitter:description" content="A static Colorfle solver for target hex matching and feedback-based elimination." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Colorfle Solver',
        description: 'Solve Colorfle with target hex matching and combination elimination.',
        url: 'https://wordsolver.tech/colorfle-solver'
      },
      {
        '@type': 'WebApplication',
        name: 'Colorfle Solver',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } }))
      }
    ]
  })}</script>`}
</svelte:head>

<div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <section class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-pink-600 dark:text-pink-300">Colorfle Solver</p>
          <h1 class="mt-3 text-4xl font-black text-gray-900 dark:text-white">Solve Colorfle by Hex or Feedback</h1>
          <p class="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            Paste a Colorfle target hex to get the best matching three-color combination, then refine your guesses with green, yellow, and gray feedback.
          </p>
        </div>

        <button type="button" class="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" onclick={resetSolver}>Reset Solver</button>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8 space-y-5">
        <div>
          <label for="colorfle-target-hex" class="block text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Target hex</label>
          <div class="mt-3 flex gap-3">
            <input id="colorfle-target-hex" class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" bind:value={hexInput} placeholder="#8ce874" />
            <button type="button" class="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-500" onclick={handleSolveHex}>Solve</button>
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">You can enter a hex with or without the leading #.</p>
          {#if errorMessage}
            <p class="mt-3 text-sm font-medium text-rose-600 dark:text-rose-300">{errorMessage}</p>
          {/if}
        </div>

        {#if guesses.length > 0}
          <div class="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div class="flex items-center justify-between gap-4">
              <h2 class="text-xl font-black text-gray-900 dark:text-white">Guesses</h2>
              {#if !solved && guesses.length > 0 && guesses.every((guess) => guess.feedback.every((value) => value !== null))}
                <button type="button" class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500" onclick={refineSuggestions}>Refine</button>
              {/if}
            </div>

            {#each guesses as guess, guessIndex}
              <div class="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                <div class="grid grid-cols-3 gap-4">
                  {#each guess.colors as colorIndex, colorIndexPosition}
                    <button type="button" class="rounded-2xl border border-gray-200 p-3 text-center dark:border-gray-700" onclick={() => cycleFeedback(guessIndex, colorIndexPosition)}>
                      <div class="mx-auto h-16 w-16 rounded-2xl border border-gray-200 dark:border-gray-700" style={`background:${COLORS[colorIndex]}`}></div>
                      <p class="mt-3 font-semibold text-gray-900 dark:text-white">{COLOR_NAMES[colorIndex]}</p>
                      <p class="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">{feedbackLabel(guess.feedback[colorIndexPosition])}</p>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if solved}
          <div class="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/20">
            <p class="text-lg font-black text-emerald-800 dark:text-emerald-300">Solved.</p>
            <p class="mt-2 text-sm text-emerald-700 dark:text-emerald-200">The latest feedback indicates the current suggestion is the exact Colorfle answer.</p>
          </div>
        {/if}
      </article>

      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-8">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Suggestions</h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">{suggestions.length} shown</span>
        </div>

        {#if suggestions.length === 0}
          <p class="mt-6 text-gray-600 dark:text-gray-300">Start by entering a target hex above. After that, you can use the feedback cycle to refine the remaining Colorfle combinations.</p>
        {:else}
          <div class="mt-6 space-y-4">
            {#each suggestions as suggestion}
              <div class="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="grid gap-4 p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                  <div class="h-20 w-20 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-mono font-bold" style={`background:${suggestion.targetHex}; color:${getContrastColor(suggestion.targetHex)}`}>
                    {suggestion.targetHex}
                  </div>
                  <div>
                    <div class="flex flex-wrap gap-3">
                      {#each suggestion.colors as colorIndex, index}
                        <div class="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-950">
                          <span class="h-8 w-8 rounded-lg border border-gray-200 dark:border-gray-700" style={`background:${COLORS[colorIndex]}`}></span>
                          <div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">{COLOR_NAMES[colorIndex]}</p>
                            <p class="text-xs font-mono text-gray-500 dark:text-gray-400">{suggestion.colorHexes[index]}</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                    {#if suggestion.similarity > 0}
                      <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Similarity {suggestion.similarity.toFixed(1)}%</p>
                    {/if}
                  </div>
                  <button type="button" class="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500" onclick={() => useSuggestion(suggestion)}>Use This</button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </article>
    </section>

    <FAQSection title="Colorfle Solver FAQ" {faqs} />
  </div>
</div>
