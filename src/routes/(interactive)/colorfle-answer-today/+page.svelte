<script lang="ts">
  import FAQSection from '$lib/components/FAQSection.svelte';

  let { data } = $props();

  let showAnswer = $state(false);
  let countdown = $state('');
  let intervalId: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    function updateCountdown() {
      const now = Date.now();
      const diff = data.dayInfo.nextResetTime - now;
      if (diff <= 0) {
        countdown = '00:00:00';
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      countdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });

  const weightLabels = ['50%', '34%', '16%'];

  const faqs = $derived([
    { question: `What is the Colorfle answer for today, ${data.formattedDate}?`, answer: `Today's Colorfle answer for puzzle #${data.dayInfo.puzzleNumber} uses three colors mixed at 50%, 34%, and 16%. The target mixed color is ${data.answer.targetHex}.` },
    { question: 'How does Colorfle color mixing work?', answer: 'Colorfle mixes three colors with weighted proportions: 50% for the first color, 34% for the second, and 16% for the third. The algorithm blends in both YCC and RGB color spaces for a visually accurate result.' },
    { question: 'When does the Colorfle puzzle reset?', answer: 'A new Colorfle puzzle is released every day. The countdown timer on this page shows exactly when the next puzzle will be available.' },
    { question: 'What do the feedback colors mean?', answer: 'Green means the color is correct and in the right position. Yellow means the color is in the answer but in a different slot. Gray means the color is not in today\'s answer at all.' },
    { question: 'Can I play past Colorfle puzzles?', answer: 'Yes! Visit the Colorfle archive page to browse and play previous puzzles. Each puzzle has a unique number and a unique combination of colors.' }
  ]);
</script>

<svelte:head>
  <title>{data.meta?.title ?? 'Colorfle Answer Today'}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  <meta name="keywords" content={data.meta?.keywords ?? 'colorfle answer today, colorfle hints'} />
  <link rel="canonical" href="https://wordsolver.tech/colorfle-answer-today" />
  <meta property="og:title" content={data.meta?.title ?? 'Colorfle Answer Today'} />
  <meta property="og:description" content={data.meta?.description ?? ''} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/colorfle-answer-today" />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta?.title ?? 'Colorfle Answer Today'} />
  <meta name="twitter:description" content={data.meta?.description ?? ''} />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

<div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
        Colorfle Answer for Today
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Puzzle <span class="font-semibold text-purple-600 dark:text-purple-400">#{data.dayInfo.puzzleNumber}</span> &mdash;
        <span class="font-semibold text-gray-700 dark:text-gray-300">{data.formattedDate}</span>
      </p>
    </header>

    <!-- Target Color Preview -->
    <div class="mb-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
      <h2 class="text-sm font-bold uppercase tracking-[0.24em] text-purple-600 dark:text-purple-300 mb-4">Target Mixed Color</h2>
      <div
        class="w-32 h-32 mx-auto rounded-2xl shadow-inner border-4 border-white dark:border-gray-600 mb-4"
        style="background-color: {data.answer.targetHex}"
      ></div>
      <p class="font-mono text-xl font-bold text-gray-900 dark:text-white">{data.answer.targetHex}</p>
    </div>

    <!-- Answer Colors -->
    <div class="mb-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Answer Colors</h2>
        <button
          onclick={() => (showAnswer = !showAnswer)}
          class="px-4 py-2 rounded-full text-sm font-semibold transition-all {showAnswer
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
        >
          {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </button>
      </div>

      {#if showAnswer}
        <div class="grid gap-4 sm:grid-cols-3">
          {#each data.answer.colorNames as name, i}
            <div class="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 text-center">
              <div
                class="w-20 h-20 mx-auto rounded-xl shadow-inner border-4 border-white dark:border-gray-600 mb-4"
                style="background-color: {data.answer.colorHexes[i]}"
              ></div>
              <p class="font-bold text-gray-900 dark:text-white text-lg mb-1">{name}</p>
              <p class="font-mono text-sm text-purple-600 dark:text-purple-400 mb-2">{data.answer.colorHexes[i]}</p>
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                {weightLabels[i]} weight
              </span>
            </div>
          {/each}
        </div>
      {:else}
        <div class="grid gap-4 sm:grid-cols-3">
          {#each [0, 1, 2] as i}
            <div class="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 text-center">
              <div class="w-20 h-20 mx-auto rounded-xl bg-gray-200 dark:bg-gray-600 mb-4 flex items-center justify-center">
                <span class="text-3xl">?</span>
              </div>
              <p class="font-bold text-gray-400 dark:text-gray-500 text-lg mb-1">Color {i + 1}</p>
              <p class="font-mono text-sm text-gray-400 dark:text-gray-500 mb-2">??????</p>
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
                {weightLabels[i]} weight
              </span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Countdown Timer -->
    <div class="mb-10 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl p-8 text-center text-white shadow-xl">
      <h2 class="text-sm font-bold uppercase tracking-[0.24em] text-white/70 mb-2">Next Puzzle In</h2>
      <p class="text-5xl font-mono font-extrabold tracking-wider">{countdown}</p>
      <p class="mt-3 text-white/70 text-sm">A new Colorfle puzzle resets daily</p>
    </div>

    <!-- Quick Actions -->
    <div class="mb-10 rounded-3xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-gray-800 p-6 shadow-lg">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-purple-600 dark:text-purple-300">Quick Actions</p>
          <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">More Colorfle Tools</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Use the solver to find color combinations, or browse the archive for past puzzles.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            href="/colorfle-solver"
            class="inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/25 transition hover:bg-purple-700 hover:shadow-lg"
          >
            Colorfle Solver
          </a>
          <a
            href="/colorfle-archive"
            class="inline-flex items-center justify-center rounded-full border border-purple-200 px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20"
          >
            View Archive
          </a>
        </div>
      </div>
    </div>

    <!-- SEO Content -->
    <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Today's Colorfle</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        Today's Colorfle puzzle is <strong class="text-gray-900 dark:text-white">#{data.dayInfo.puzzleNumber}</strong>.
        The target color to match is <strong class="text-gray-900 dark:text-white">{data.answer.targetHex}</strong>,
        which is produced by mixing three colors from the palette at specific weight percentages.
        The first color contributes <strong>50%</strong>, the second <strong>34%</strong>, and the third <strong>16%</strong> of the final blend.
      </p>
      <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
        Use the "Reveal Answer" button above to see the three colors, or try solving it yourself with the
        <a href="/colorfle-solver" class="text-purple-600 dark:text-purple-400 hover:underline font-semibold">Colorfle Solver</a>
        if you need help narrowing down the possibilities.
      </p>
    </article>

    <!-- FAQ Section -->
    <FAQSection title="Colorfle Answer FAQs" {faqs} />
  </div>
</div>
