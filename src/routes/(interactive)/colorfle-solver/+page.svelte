<script lang="ts">
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    COLORS,
    COLOR_NAMES,
    solveFromHexTopN,
    hexToRgb,
    rgbToHex,
    type SolveResult
  } from '$lib/colorfle';
  import {
    generateWebPageSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateWebApplicationSchema
  } from '$lib/seo';

  let hexInput = $state('#E6BEFF');
  let results = $state<SolveResult[]>([]);
  let solved = $state(false);
  let feedbackSlots = $state<string[][]>([[], [], []]);

  const colorPickerValue = $derived(hexInput.length === 7 && hexInput.startsWith('#') ? hexInput : '#000000');

  function handleSolve() {
    const hex = hexInput.trim();
    if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) return;
    const normalizedHex = hex.startsWith('#') ? hex : `#${hex}`;
    hexInput = normalizedHex;
    results = solveFromHexTopN(normalizedHex, 5);
    solved = true;
    feedbackSlots = [[], [], []];
  }

  function toggleFeedback(slotIndex: number, color: string) {
    const slot = feedbackSlots[slotIndex];
    const idx = slot.indexOf(color);
    if (idx === -1) {
      feedbackSlots[slotIndex] = [...slot, color];
    } else {
      feedbackSlots[slotIndex] = slot.filter((_, i) => i !== idx);
    }
    feedbackSlots = [...feedbackSlots];
  }

  const feedbackColors = [
    { label: 'Green', value: 'green', bg: 'bg-green-500', ring: 'ring-green-400' },
    { label: 'Yellow', value: 'yellow', bg: 'bg-yellow-400', ring: 'ring-yellow-300' },
    { label: 'Gray', value: 'gray', bg: 'bg-gray-400', ring: 'ring-gray-300' }
  ];

  const faqs = [
    { question: 'What is the Colorfle Solver?', answer: 'The Colorfle Solver is a free tool that helps you find the best color combination for the Colorfle mixing puzzle. Enter any hex color code, and the solver will return the top 5 color combinations that produce the closest match when mixed.' },
    { question: 'How does color mixing work in Colorfle?', answer: 'Colorfle mixes three colors with weighted proportions (50%, 34%, 16%). The mixing algorithm operates in the YCC color space and averages with an RGB blend to produce a visually accurate result that matches how the game computes its target color.' },
    { question: 'What is a hex color code?', answer: 'A hex color code is a 6-character string starting with # that represents a specific color using the RGB model. For example, #FF0000 is pure red, #00FF00 is pure green, and #0000FF is pure blue. You can use any online color picker to find the hex code for a color.' },
    { question: 'How accurate is the solver?', answer: 'The solver checks every possible permutation of 3 colors from a palette of 20, calculating the exact mixed result for each combination. It ranks them by visual similarity using a YCC-based color distance metric, giving you the most accurate matches first.' },
    { question: 'Can I use the solver on mobile?', answer: 'Yes! The Colorfle Solver is fully responsive and works on all devices. The color picker and results grid adapt to your screen size for the best experience.' },
    { question: 'What do the feedback slots mean?', answer: 'The feedback slots let you track your Colorfle guesses. Green means the color is correct and in the right position. Yellow means the color is in the answer but in a different position. Gray means the color is not in the answer at all.' }
  ];

  const schemas = $derived.by(() =>
    JSON.stringify([
      generateWebPageSchema(
        'Colorfle Solver',
        'Free online Colorfle solver. Enter a hex color and find the best 3-color combinations that match the target when mixed.',
        'https://wordsolver.tech/colorfle-solver'
      ),
      generateFAQSchema(faqs),
      generateHowToSchema('How to Use the Colorfle Solver', [
        { name: 'Enter a Color', text: 'Type a hex color code (e.g. #E6BEFF) or use the color picker to select your target color.' },
        { name: 'Click Solve', text: 'Press the Solve button to find the top 5 color combinations that produce the closest match.' },
        { name: 'Review Results', text: 'Check the results grid to see color swatches, names, hex values, and similarity percentages.' },
        { name: 'Track Feedback', text: 'Use the feedback slots to mark which colors are correct (green), misplaced (yellow), or absent (gray).' }
      ]),
      generateWebApplicationSchema(
        'Colorfle Solver',
        'Free online tool to solve Colorfle color mixing puzzles by finding the best matching color combinations.'
      )
    ])
  );
</script>

<svelte:head>
  <title>Colorfle Solver - Free Color Mixing Puzzle Solver | WordSolverX</title>
  <meta name="description" content="Free online Colorfle solver. Enter any hex color code and instantly find the best 3-color combinations that match the target when mixed. Solve Colorfle puzzles fast." />
  <meta name="keywords" content="colorfle solver, colorfle cheat, color mixing puzzle solver, colorfle help, colorfle answer, hex color solver, colorfle tool, free colorfle solver" />
  <link rel="canonical" href="https://wordsolver.tech/colorfle-solver" />
  <meta property="og:title" content="Colorfle Solver - Free Color Mixing Puzzle Solver" />
  <meta property="og:description" content="Enter any hex color and find the best 3-color combinations for the Colorfle puzzle. Free, fast, and accurate." />
  <meta property="og:url" content="https://wordsolver.tech/colorfle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colorfle Solver - Free Color Mixing Puzzle Solver" />
  <meta name="twitter:description" content="Solve Colorfle color mixing puzzles instantly. Enter a hex code and get the top matching color combinations." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-600 pt-16 pb-20">
    <div class="absolute inset-0">
      <div class="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-yellow-400/10 blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-green-400/10 blur-[100px]"></div>
      <div class="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-red-400/10 blur-[110px]"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-sm font-medium text-white/90">Color Mixing Puzzle Solver</span>
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300">Colorfle</span> Solver
      </h1>
      <p class="max-w-2xl mx-auto text-lg text-white/80 mb-10">
        Enter a target hex color and instantly find the best 3-color combinations that produce the closest match when mixed.
      </p>
    </div>
  </section>

  <!-- Main Solver Area -->
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20 pb-12">
    <!-- Input Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-lg">
          🎨
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Enter Target Color</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Type a hex code or use the color picker</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label for="hexInput" class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Hex Color Code</label>
          <div class="relative">
            <input
              id="hexInput"
              type="text"
              bind:value={hexInput}
              placeholder="#E6BEFF"
              maxlength="7"
              class="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 font-mono uppercase transition-all"
              onkeydown={(e) => { if ((e as KeyboardEvent).key === 'Enter') handleSolve(); }}
            />
            <div
              class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border-2 border-white dark:border-gray-600 shadow-sm"
              style="background-color: {colorPickerValue}"
            ></div>
          </div>
        </div>

        <div class="sm:w-28 flex flex-col">
          <label for="colorPicker" class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Picker</label>
          <input
            id="colorPicker"
            type="color"
            bind:value={hexInput}
            class="w-full h-[50px] rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer"
          />
        </div>

        <div class="sm:w-32 flex flex-col">
          <span class="text-xs font-bold uppercase tracking-wider text-transparent mb-1.5 block">Solve</span>
          <button
            onclick={handleSolve}
            class="w-full h-[50px] bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
          >
            Solve
          </button>
        </div>
      </div>
    </div>

    <!-- Results Grid -->
    {#if solved && results.length > 0}
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg">
            ✓
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Top 5 Matches</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Best color combinations ranked by similarity</p>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {#each results as result, i}
            <div class="group bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-purple-300 dark:hover:border-purple-500 transition-all hover:shadow-lg">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">#{i + 1}</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  {result.similarity}%
                </span>
              </div>

              <div class="flex gap-1.5 mb-3">
                {#each result.colorHexes as hex}
                  <div
                    class="flex-1 aspect-square rounded-lg shadow-inner border border-black/5"
                    style="background-color: {hex}"
                    title={hex}
                  ></div>
                {/each}
              </div>

              <div class="space-y-1.5">
                {#each result.colorNames as name, ci}
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded shrink-0 border border-black/10" style="background-color: {result.colorHexes[ci]}"></div>
                    <span class="text-xs text-gray-600 dark:text-gray-300 truncate">{name}</span>
                    <span class="text-[10px] text-gray-400 font-mono ml-auto">{result.colorHexes[ci]}</span>
                  </div>
                {/each}
              </div>

              <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg shadow-inner border border-black/10"
                    style="background-color: {result.targetHex}"
                  ></div>
                  <div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mixed</p>
                    <p class="text-xs font-mono font-semibold text-gray-700 dark:text-gray-200">{result.targetHex}</p>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Feedback System -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg">
            🎯
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Feedback Tracker</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Toggle green, yellow, or gray for each color slot</p>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          {#each [0, 1, 2] as slotIdx}
            <div class="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Color Slot {slotIdx + 1}</h3>
              <div class="flex gap-2">
                {#each feedbackColors as fc}
                  <button
                    onclick={() => toggleFeedback(slotIdx, fc.value)}
                    class="flex-1 py-2 rounded-lg text-xs font-bold transition-all border-2 {feedbackSlots[slotIdx].includes(fc.value)
                      ? `${fc.bg} text-white border-transparent shadow-md`
                      : 'bg-white dark:bg-gray-600 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-500 hover:border-gray-400'}"
                  >
                    {fc.label}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Info Sections -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 text-lg">
            ℹ️
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">What is Colorfle?</h2>
        </div>
        <div class="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            <strong class="text-gray-900 dark:text-white">Colorfle</strong> is a daily color mixing puzzle where you must figure out which three colors, mixed in specific proportions (50%, 34%, 16%), produce a given target color.
          </p>
          <p>
            You pick three colors from a palette of 20, and the game tells you how close you are. Green means correct color in the correct slot, yellow means the color is used but in a different position, and gray means the color isn't in the answer.
          </p>
        </div>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg">
            📚
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">How to Use the Solver</h2>
        </div>
        <ul class="space-y-3 text-gray-600 dark:text-gray-400">
          <li class="flex gap-3 items-start">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Enter the target hex color code or pick a color with the color picker.</span>
          </li>
          <li class="flex gap-3 items-start">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Click "Solve" to find the top 5 color combinations ranked by similarity.</span>
          </li>
          <li class="flex gap-3 items-start">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Use the feedback tracker to mark which colors are correct, misplaced, or absent.</span>
          </li>
        </ul>
      </section>
    </div>

    <!-- FAQ Section -->
    <FAQSection title="Colorfle Solver FAQs" {faqs} />
  </div>
</div>
