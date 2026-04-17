<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { generateBreadcrumbSchema } from '$lib/seo';
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
  let showColorPicker = $state(false);
  let pickerColor = $state('#ff0000');

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
    },
    {
      question: 'What do the green, yellow, and gray feedback colors mean in Colorfle?',
      answer: 'Green means the color channel matches exactly — you have the right value. Yellow means you are close but not exact — the correct value is nearby. Gray means you are far off on that channel. Click each color swatch in the guess row to cycle through feedback states.'
    },
    {
      question: 'How many guesses do I get in Colorfle?',
      answer: 'Colorfle gives you 6 guesses to find the correct three-color combination. Each guess consists of three source colors that mix together to produce a target color. The solver can typically narrow the answer within 2-3 guesses.'
    },
    {
      question: 'Can I use the color picker instead of typing a hex code?',
      answer: 'Yes. Click "Pick a Color Instead" below the hex input to open a visual color picker. Select any color, then click "Use This Color" to submit it as your target hex. This is useful when you can see the target color on screen but do not know its hex value.'
    },
    {
      question: 'Why does the solver show multiple suggestions instead of one answer?',
      answer: 'Colorfle uses three source colors that mix together, so multiple combinations can produce similar target colors. The solver shows the top 5 matches ranked by similarity. Use the feedback from each guess to refine the list and converge on the exact answer.'
    }
  ];

  const solverLinks = [
    { href: '/colorfle-answer-today', label: 'Colorfle Answer Today' },
    { href: '/colorfle-archive', label: 'Colorfle Archive' },
    { href: '/colordle-solver', label: 'Colordle Solver' },
    { href: '/wordle-solver', label: 'Wordle Solver' },
    { href: '/nerdle-solver', label: 'Nerdle Solver' },
    { href: '/spotle-solver', label: 'Spotle Solver' }
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

  function applyPickerColor() {
    hexInput = pickerColor;
    showColorPicker = false;
    handleSolveHex();
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
    showColorPicker = false;
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
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: 'https://wordsolver.tech' },
        { name: 'Solver', url: 'https://wordsolver.tech/solver' },
        { name: 'Colorfle Solver', url: 'https://wordsolver.tech/colorfle-solver' }
      ]),
      {
        '@type': 'HowTo',
        name: 'How to use the Colorfle solver',
        step: [
          { '@type': 'HowToStep', name: 'Enter the target hex', text: 'Type or paste the target hex code from Colorfle into the input field, or use the color picker to select it visually.', position: 1 },
          { '@type': 'HowToStep', name: 'Review suggestions', text: 'Click Solve to see the top 5 three-color combinations that produce the closest match to your target.', position: 2 },
          { '@type': 'HowToStep', name: 'Use a suggestion as a guess', text: 'Click "Use This" on any suggestion to add it as a guess. Then set the feedback colors (green, yellow, gray) for each source color by clicking the swatches.', position: 3 },
          { '@type': 'HowToStep', name: 'Refine with feedback', text: 'After setting feedback on all three colors, click Refine. The solver filters out combinations that contradict your feedback and shows updated suggestions.', position: 4 }
        ]
      }
    ]
  })}</script>`}
</svelte:head>

<main class="min-h-screen bg-pink-50">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <!-- Hero Banner -->
  <section class="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
    <div class="rounded-[2rem] border border-white/10 bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 px-6 py-8 shadow-2xl text-center space-y-4">
      <p class="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">Color Puzzle Solver</p>
      <h1 class="text-4xl font-black text-white sm:text-5xl">Colorfle Solver</h1>
      <p class="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">Paste your target hex or use the color picker to get matching three-color combinations. Refine with green, yellow, and gray feedback.</p>
    </div>
  </section>

  <!-- Interactive Component -->
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

    <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8 space-y-5">
        <div>
          <label for="colorfle-target-hex" class="block text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Target hex</label>
          <div class="mt-3 flex gap-3">
            <input id="colorfle-target-hex" class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-gray-900" bind:value={hexInput} placeholder="#8ce874" />
            <button type="button" class="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-500" onclick={handleSolveHex}>Solve</button>
          </div>
          <p class="mt-2 text-sm text-gray-500">You can enter a hex with or without the leading #.</p>
          {#if errorMessage}
            <p class="mt-3 text-sm font-medium text-rose-600">{errorMessage}</p>
          {/if}
        </div>

        <!-- Color Picker Panel -->
        <div class="border-t border-gray-200 pt-5">
          <button
            type="button"
            class="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
            onclick={() => showColorPicker = !showColorPicker}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            {showColorPicker ? 'Hide Color Picker' : 'Pick a Color Instead'}
            <svg class="w-4 h-4 transition-transform {showColorPicker ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {#if showColorPicker}
            <div class="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
              <div class="flex flex-col sm:flex-row items-center gap-4">
                <div class="relative">
                  <input
                    type="color"
                    bind:value={pickerColor}
                    class="w-24 h-24 rounded-xl border-2 border-gray-300 cursor-pointer shadow-sm"
                    style="padding: 0;"
                  />
                </div>
                <div class="flex-1 space-y-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Selected Color</p>
                    <div class="mt-1 flex items-center gap-3">
                      <div class="h-10 w-10 rounded-lg border border-gray-200 shadow-sm" style="background: {pickerColor}"></div>
                      <span class="font-mono text-lg font-bold text-gray-900">{pickerColor}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="w-full sm:w-auto rounded-xl bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-pink-500 transition-colors shadow-sm"
                    onclick={applyPickerColor}
                  >
                    Use This Color
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>

        {#if guesses.length > 0}
          <div class="space-y-4 border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between gap-4">
              <h2 class="text-xl font-black text-gray-900">Guesses</h2>
              {#if !solved && guesses.length > 0 && guesses.every((guess) => guess.feedback.every((value) => value !== null))}
                <button type="button" class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500" onclick={refineSuggestions}>Refine</button>
              {/if}
            </div>

            {#each guesses as guess, guessIndex}
              <div class="rounded-2xl border border-gray-200 p-4">
                <div class="grid grid-cols-3 gap-4">
                  {#each guess.colors as colorIndex, colorIndexPosition}
                    <button type="button" class="rounded-2xl border border-gray-200 p-3 text-center" onclick={() => cycleFeedback(guessIndex, colorIndexPosition)}>
                      <div class="mx-auto h-16 w-16 rounded-2xl border border-gray-200" style={`background:${COLORS[colorIndex]}`}></div>
                      <p class="mt-3 font-semibold text-gray-900">{COLOR_NAMES[colorIndex]}</p>
                      <p class="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">{feedbackLabel(guess.feedback[colorIndexPosition])}</p>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if solved}
          <div class="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
            <p class="text-lg font-black text-emerald-800">Solved.</p>
            <p class="mt-2 text-sm text-emerald-700">The latest feedback indicates the current suggestion is the exact Colorfle answer.</p>
          </div>
        {/if}
      </article>

      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-2xl font-black text-gray-900">Suggestions</h2>
          <span class="text-sm text-gray-500">{suggestions.length} shown</span>
        </div>

        {#if suggestions.length === 0}
          <p class="mt-6 text-gray-600">Start by entering a target hex above or use the color picker. After that, you can use the feedback cycle to refine the remaining Colorfle combinations.</p>
        {:else}
          <div class="mt-6 space-y-4">
            {#each suggestions as suggestion}
              <div class="rounded-2xl border border-gray-200 overflow-hidden">
                <div class="grid gap-4 p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                  <div class="h-20 w-20 rounded-2xl border border-gray-200 flex items-center justify-center text-xs font-mono font-bold" style={`background:${suggestion.targetHex}; color:${getContrastColor(suggestion.targetHex)}`}>
                    {suggestion.targetHex}
                  </div>
                  <div>
                    <div class="flex flex-wrap gap-3">
                      {#each suggestion.colors as colorIndex, index}
                        <div class="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                          <span class="h-8 w-8 rounded-lg border border-gray-200" style={`background:${COLORS[colorIndex]}`}></span>
                          <div>
                            <p class="text-sm font-semibold text-gray-900">{COLOR_NAMES[colorIndex]}</p>
                            <p class="text-xs font-mono text-gray-500">{suggestion.colorHexes[index]}</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                    {#if suggestion.similarity > 0}
                      <p class="mt-3 text-sm text-gray-500">Similarity {suggestion.similarity.toFixed(1)}%</p>
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

    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
      <FAQSection class="py-0" title="Colorfle Solver FAQ" {faqs} />
    </div>

    <section class="rounded-3xl bg-slate-100 p-8 text-center space-y-6">
      <h2 class="text-2xl font-bold text-slate-900">More Solvers</h2>
      <div class="flex flex-wrap justify-center gap-3">
        {#each solverLinks as link}
          <a href={link.href} class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">{link.label}</a>
        {/each}
      </div>
    </section>
  </div>
</main>
