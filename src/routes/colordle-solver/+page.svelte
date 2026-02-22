<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import { getAllColors, getUniqueTargetColors, findBestCandidates, type ColorData } from '$lib/colordle';

  // State
  let allColors = $state<ColorData[]>([]);
  let candidates = $state<ColorData[]>([]);
  let history = $state<{ guess: ColorData; percent: number }[]>([]);

  let guessInput = $state('');
  let percentageInput = $state('');
  let loading = $state(true);
  let processing = $state(false);

  let selectedGuess = $state<ColorData | null>(null);
  let displayLimit = $state(12);

  onMount(() => {
    const colors = getAllColors();
    const targets = getUniqueTargetColors();
    allColors = colors;
    candidates = targets;
    loading = false;
  });

  let suggestions = $derived.by(() => {
    if (guessInput.length < 2 || selectedGuess?.name === guessInput) return [];
    const lowerInput = guessInput.toLowerCase();
    const matches: ColorData[] = [];
    for (const c of allColors) {
      if (c.name.toLowerCase().includes(lowerInput)) {
        matches.push(c);
        if (matches.length >= 20) break;
      }
    }
    return matches;
  });

  function handleAddStep() {
    if (!selectedGuess || !percentageInput) return;
    const percent = parseFloat(percentageInput);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      alert('Please enter a valid percentage (0-100)');
      return;
    }
    processing = true;
    const newHistoryItem = { guess: selectedGuess, percent };
    history = [...history, newHistoryItem];
    const allTargets = getUniqueTargetColors();
    candidates = findBestCandidates(allTargets, history);
    guessInput = '';
    percentageInput = '';
    selectedGuess = null;
    processing = false;
    displayLimit = 12;
  }

  function handleReset() {
    history = [];
    candidates = getUniqueTargetColors();
    guessInput = '';
    percentageInput = '';
    selectedGuess = null;
    displayLimit = 12;
  }

  function handleSelectFromSuggestion(color: ColorData) {
    selectedGuess = color;
    guessInput = color.name;
  }

  function handleRemoveHistoryItem(idx: number) {
    history = history.filter((_: any, i: number) => i !== idx);
    const allTargets = getUniqueTargetColors();
    if (history.length === 0) {
      candidates = allTargets;
    } else {
      candidates = findBestCandidates(allTargets, history);
    }
  }

  function handleGuessInput(value: string) {
    guessInput = value;
    if (selectedGuess && value !== selectedGuess.name) selectedGuess = null;
  }

  const faqs = [
    { question: 'What is the Colordle Solver?', answer: 'The Colordle Solver is a tool designed to help you solve the daily color-guessing game more efficiently. By entering your guesses and the similarity percentages you receive, the solver filters through a database of named colors to find the most likely answers.' },
    { question: 'How accurate is the percentage calculation?', answer: 'Our solver uses the Delta E (CIE2000) standard in the LAB color space, which is the most widely accepted method for measuring color difference as perceived by the human eye. This matches the logic used in modern Colordle implementations.' },
    { question: 'Is this solver cheating?', answer: "It's a utility for those who are stuck or simply want to learn more about how colors relate to each other. Many players use it as a learning tool to better understand hex codes and color similarities." },
    { question: 'Where do you get the list of color names?', answer: 'We use an extensive open-source library of named colors, ensuring that most common and scientific color names used in games are accounted for.' },
    { question: 'Can I use this solver on mobile?', answer: 'Yes! The Colordle Solver is fully responsive and works great on mobile devices, tablets, and desktops. The color cards and input fields are optimized for touch interactions.' },
    { question: 'How many guesses does it usually take?', answer: 'With our solver, most users can find the answer in 2-4 guesses. The key is entering accurate percentage scores — even small decimal differences help the algorithm narrow down the correct color significantly.' },
  ];

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'Colordle Solver',
        description: 'Professional solver for the Colordle color-guessing game.',
        url: 'https://wordsolverx.com/colordle-solver',
        areaServed: 'Worldwide',
        serviceType: 'Puzzle Solving Service',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  });

  const steps = [
    { label: 'Step 1', text: 'Search and select a color name from the game' },
    { label: 'Step 2', text: 'Enter the similarity % score you received' },
    { label: 'Step 3', text: 'Find the answer from filtered results' },
  ];

  const stepIcons = ['🔍', '⚡', '✓'];

  const howToSteps = [
    { num: '1', text: 'Enter a color name like "Sky Blue" or a hex code like #87CEEB' },
    { num: '2', text: 'Review the % similarity score — higher is closer to the target' },
    { num: '3', text: 'Input your guesses into this solver to filter thousands of colors' },
    { num: '4', text: 'Continue refining until you find the exact match!' },
  ];

  const moreLinks = [
    { href: '/colordle-answer-today', label: "Today's Answer" },
    { href: '/colordle-answer-yesterday', label: "Yesterday's Answer" },
    { href: '/colordle-archive', label: 'Full Archive' },
  ];
</script>

<svelte:head>
  <title>Colordle Solver - Daily Color Puzzle Helper | WordSolverX</title>
  <meta name="description" content="Crack the daily Colordle puzzle with our free solver. Enter guesses, input similarity percentages, and find the exact color match." />
  <meta name="keywords" content="Colordle Solver, Colordle Answer, Color Puzzle, Colordle Help, Colordle Cheat" />
  <link rel="canonical" href="https://wordsolverx.com/colordle-solver" />
  <meta property="og:title" content="Colordle Solver - Daily Color Puzzle Helper" />
  <meta property="og:description" content="Solve the daily Colordle puzzle instantly using our color solver." />
  <meta property="og:url" content="https://wordsolverx.com/colordle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colordle Solver" />
  <meta name="twitter:description" content="Find today's Colordle answer with pinpoint accuracy." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 pt-16 pb-20">
    <div class="absolute inset-0">
      <div class="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px]"></div>
      <div class="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[110px]"></div>
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Breadcrumbs />
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
        <span class="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
        <span class="text-sm font-medium text-pink-300">Daily Color Puzzle Solver</span>
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">Colordle</span> Solver
      </h1>
      <p class="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
        Crack the daily color code with pinpoint accuracy. Enter your guesses, input the similarity percentage, and watch the solver narrow down the exact match.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {#each steps as step, i}
          <div class="flex flex-col items-center p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-pink-400 text-lg mb-2">
              {stepIcons[i]}
            </div>
            <span class="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">{step.label}</span>
            <p class="text-sm text-gray-400">{step.text}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Main Solver Area -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20 pb-12">
    {#if loading}
      <div class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    {:else}
      <div class="grid lg:grid-cols-12 gap-6">
        <!-- Left Panel: Input + History -->
        <div class="lg:col-span-5 space-y-5">
          <!-- Input Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
                🔍
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Enter Guess Data</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400">Search a color, then enter the % score</p>
              </div>
            </div>

            <div class="space-y-4">
              <!-- Color Name Input -->
              <div class="relative">
                <label for="colorNameInput" class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Color Name</label>
                <div class="relative">
                  <input
                    id="colorNameInput"
                    type="text"
                    value={guessInput}
                    oninput={(e) => handleGuessInput((e.target as HTMLInputElement).value)}
                    placeholder="e.g. Flax, Sky Blue, Coral"
                    class="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                  />
                  {#if selectedGuess}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <div
                        class="w-7 h-7 rounded-lg border-2 border-white dark:border-gray-600 shadow-sm"
                        style="background-color: {selectedGuess.hex}"
                      ></div>
                      <span class="text-green-500">✓</span>
                    </div>
                  {/if}
                </div>

                <!-- Suggestions Dropdown -->
                {#if suggestions.length > 0}
                  <div class="absolute z-30 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {#each suggestions as s}
                      <button
                        onclick={() => handleSelectFromSuggestion(s)}
                        class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                      >
                        <div
                          class="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 shrink-0 shadow-sm"
                          style="background-color: {s.hex}"
                        ></div>
                        <div class="flex-1 min-w-0">
                          <span class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block">{s.name}</span>
                          <span class="text-xs text-gray-400 font-mono">{s.hex}</span>
                        </div>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>

              <!-- Percentage Input -->
              <div>
                <label for="similarityInput" class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Similarity %</label>
                <input
                  id="similarityInput"
                  type="number"
                  step="0.01"
                  value={percentageInput}
                  oninput={(e) => (percentageInput = (e.target as HTMLInputElement).value)}
                  placeholder="e.g. 50.18"
                  class="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 font-mono transition-all"
                  onkeydown={(e) => { if ((e as KeyboardEvent).key === 'Enter') handleAddStep(); }}
                />
              </div>

              <!-- Submit Button -->
              <button
                onclick={handleAddStep}
                disabled={!selectedGuess || !percentageInput || processing}
                class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {#if processing}
                  <span class="flex items-center gap-2"><span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Calculating...</span>
                {:else}
                  Filter Results →
                {/if}
              </button>
            </div>
          </div>

          <!-- Guess History -->
          {#if history.length > 0}
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  📚 Guess History
                </h3>
                <button onclick={handleReset} class="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  ↻ Reset All
                </button>
              </div>
              <div class="space-y-2">
                {#each history as item, idx}
                  <div class="bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex items-center justify-between group">
                    <div class="flex items-center gap-3">
                      <div class="relative">
                        <div
                          class="w-9 h-9 rounded-lg border-2 border-white dark:border-gray-600 shadow-sm"
                          style="background-color: {item.guess.hex}"
                        ></div>
                        <span class="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gray-700 text-white text-[10px] font-bold flex items-center justify-center">{idx + 1}</span>
                      </div>
                      <div>
                        <div class="font-semibold text-sm text-gray-900 dark:text-white">{item.guess.name}</div>
                        <div class="text-xs text-gray-400 font-mono">{item.guess.hex}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-sm font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2.5 py-1 rounded-lg">{item.percent}%</span>
                      <button onclick={() => handleRemoveHistoryItem(idx)} class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1" title="Remove">
                        ✕
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Right Panel: Candidates -->
        <div class="lg:col-span-7">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900 dark:text-white">Possible Solutions</h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Click any color to use it as your next guess</p>
                </div>
              </div>
              <span class="px-3 py-1.5 rounded-full text-sm font-bold font-mono {candidates.length <= 10
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}">
                {candidates.length}
              </span>
            </div>

            <div class="flex-1 overflow-y-auto max-h-[700px] pr-1">
              {#if candidates.length === 0}
                <div class="h-48 flex flex-col items-center justify-center text-center">
                  <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl mb-4">🎨</div>
                  <p class="text-gray-500 dark:text-gray-400 font-medium">No matching colors found</p>
                  <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Double-check your percentages or reset to start over</p>
                  <button onclick={handleReset} class="mt-4 text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1">
                    ↻ Reset Solver
                  </button>
                </div>
              {:else}
                <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {#each candidates.slice(0, displayLimit) as c}
                    <button
                      onclick={() => handleSelectFromSuggestion(c)}
                      class="group bg-white dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500 rounded-xl p-3 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 text-left"
                    >
                      <div
                        class="w-full aspect-square rounded-lg mb-2.5 shadow-inner border border-black/5 group-hover:shadow-md transition-shadow"
                        style="background-color: {c.hex}"
                      ></div>
                      <div class="text-sm font-semibold truncate text-center text-gray-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {c.name}
                      </div>
                      <div class="text-xs text-center text-gray-400 font-mono mt-0.5">
                        {c.hex}
                      </div>
                    </button>
                  {/each}
                </div>

                {#if displayLimit < candidates.length}
                  <div class="mt-6 flex justify-center">
                    <button
                      onclick={() => (displayLimit += 20)}
                      class="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-semibold text-sm transition-all group"
                    >
                      ▼ Show More ({candidates.length - displayLimit} remaining)
                    </button>
                  </div>
                {/if}
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Featured Image -->
  <div class="flex justify-center px-4 py-8">
    <img
      src="/colordle-solver.webp"
      alt="Colordle Solver in Action showing color matching interface"
      width="800"
      height="450"
      class="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      loading="lazy"
    />
  </div>

  <!-- Content Sections -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    <!-- What Is & How To Play -->
    <div class="grid md:grid-cols-2 gap-10">
      <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
            ℹ️
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">What is Colordle?</h2>
        </div>
        <div class="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            <strong class="text-gray-900 dark:text-white">Colordle</strong> is a minimalist daily color-guessing game that challenges players to identify a secret hex code. Inspired by the Wordle format, it replaces letters with colors.
          </p>
          <p>
            Every day, a new mystery color is selected and your goal is to guess its exact shade by entering color names. After each guess, the game gives you a <strong class="text-gray-900 dark:text-white">percentage score</strong> indicating how close your choice is — <strong class="text-pink-600 dark:text-pink-400">100%</strong> means you've cracked the code!
          </p>
        </div>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            📚
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">How to Play</h2>
        </div>
        <ul class="space-y-3 text-gray-600 dark:text-gray-400">
          {#each howToSteps as step}
            <li class="flex gap-3 items-start">
              <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{step.num}</span>
              <span>{step.text}</span>
            </li>
          {/each}
        </ul>
      </section>
    </div>

    <!-- Why Use Section -->
    <section class="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border border-pink-100 dark:border-gray-700 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        ❓ Why Use a Colordle Helper?
      </h2>
      <div class="text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
        <p>
          With over <strong class="text-gray-900 dark:text-white">30,000 named colors</strong> in modern digital palettes, finding the exact hex code manually is nearly impossible. Our solver uses the <strong class="text-gray-900 dark:text-white">Delta E (CIE2000)</strong> algorithm — the gold standard for measuring perceptual color difference — to compute visual distance and eliminate wrong answers instantly.
        </p>
        <p>
          Whether you want daily help or want to improve your color theory knowledge, this is the most accurate Colordle solver available online.
        </p>
      </div>
    </section>

    <!-- Internal Links CTA -->
    <div class="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      <div class="relative z-10">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2">More Colordle Tools</h2>
        <p class="text-white/80 mb-6">Get today's answer, review past colors, or browse the full archive.</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {#each moreLinks as link}
            <a href={link.href} class="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl font-semibold transition-all text-center border border-white/10 hover:border-white/20">
              {link.label}
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <FAQSection title="Colordle Solver FAQ" {faqs} />

    <!-- SEO Content Section -->
    <section class="space-y-12">
      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">How Color Distance Calculation Works</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            Color perception is surprisingly complex. Two colors might look identical to one person but different to another. That's why Colordle and our solver use the Delta E (CIE2000) algorithm — a sophisticated formula that measures how different two colors appear to the human eye.
          </p>
          <p class="mb-6 leading-relaxed">
            The calculation happens in the LAB color space, which was designed to be perceptually uniform. This means that a Delta E of 2.0 represents the same visual difference regardless of which colors you're comparing. The RGB and HEX color spaces we use on screens don't have this property — a small RGB change might be very visible in one color but invisible in another.
          </p>
          <p class="leading-relaxed">
            When you enter a percentage score from Colordle, our solver converts it to a Delta E value and filters the color database to find colors that would produce similar scores. This mathematical approach is far more accurate than guessing based on color names or categories alone.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at Colordle</h2>
        <div class="space-y-6 text-lg text-gray-600">
          <p class="leading-relaxed">
            Colordle rewards color knowledge and strategic guessing. Here are tips to improve your game:
          </p>
          <ul class="space-y-4 ml-4">
            <li class="leading-relaxed">
              <strong class="text-gray-900">Start with primary and secondary colors</strong> — Colors like Red, Blue, Yellow, Green, Orange, and Purple are good starting points. They're evenly distributed around the color wheel and give you broad information.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Pay attention to saturation and brightness</strong> — A 50% match might mean you have the right hue but wrong saturation. Try brighter and darker versions of similar colors.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Learn color families</strong> — Colors cluster into families: warm (reds, oranges, yellows), cool (blues, greens, purples), neutrals (grays, browns, whites). Identify the family first, then narrow down.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Use the percentage strategically</strong> — A score above 70% means you're very close. A score below 30% means you're far away. Use this to decide whether to refine your current guess or try a completely different color.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Learn color names</strong> — The more color names you know, the better. Colors like "Cerulean", "Chartreuse", "Burgundy", and "Teal" are common in Colordle and have specific hex values.
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-pink-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Understanding Hex Color Codes</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            Every color in Colordle is represented by a hex code — a 6-character string like #FF5733 that defines the exact color. Understanding hex codes can help you make better guesses.
          </p>
          <div class="grid md:grid-cols-3 gap-6 not-prose mb-6">
            <div class="bg-white p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">First 2 Characters (Red)</h3>
              <p class="text-gray-600 text-sm">The first two characters control the red component. 00 is no red, FF is maximum red. Higher values mean more red in the color.</p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">Middle 2 Characters (Green)</h3>
              <p class="text-gray-600 text-sm">The middle two characters control green. 00 is no green, FF is maximum green. This affects how "warm" or "cool" a color appears.</p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">Last 2 Characters (Blue)</h3>
              <p class="text-gray-600 text-sm">The last two characters control blue. 00 is no blue, FF is maximum blue. Blue values strongly affect whether a color feels "warm" or "cool".</p>
            </div>
          </div>
          <p class="leading-relaxed">
            For example, #FF0000 is pure red, #00FF00 is pure green, #0000FF is pure blue, #FFFFFF is white, and #000000 is black. Colors like #FF5733 (a reddish-orange) have high red, moderate green, and low blue values.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Common Colordle Color Categories</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            Colordle answers tend to fall into several categories. Knowing these can help you make educated guesses:
          </p>
          <div class="grid md:grid-cols-2 gap-6 not-prose">
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">🎨 Named Colors</h3>
              <p class="text-gray-600 text-sm">Common color names like Crimson, Navy, Teal, Coral, Olive. These are everyday colors most people recognize.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">🌸 Nature Colors</h3>
              <p class="text-gray-600 text-sm">Colors named after natural things: Sky Blue, Forest Green, Sunset, Ocean, Sand. These often have specific, recognizable shades.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">🍇 Food Colors</h3>
              <p class="text-gray-600 text-sm">Colors named after foods: Cherry, Lemon, Lime, Chocolate, Coffee. These evoke specific visual associations.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">💎 Gem Colors</h3>
              <p class="text-gray-600 text-sm">Colors named after gems and minerals: Ruby, Sapphire, Emerald, Amber, Jade. These tend to be rich, saturated colors.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>
