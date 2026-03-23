<script lang="ts">
  import WaffleAnswerCard from '$lib/components/WaffleAnswerCard.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import FiArrowRight from '$lib/components/icons/FiArrowRight.svelte';
  import FiHash from '$lib/components/icons/FiHash.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="news_keywords" content={data.meta.keywords ?? 'waffle answer today, waffle answer, waffle hint, waffle hint today'} />
  <link rel="canonical" href="https://wordsolver.tech/waffle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

{#if data.error || !data.puzzle}
<main class="max-w-3xl mx-auto px-4 py-12">
  <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
    <h1 class="mb-4 text-3xl font-bold text-gray-900">Unable to Load Waffle Right Now</h1>
    <p class="text-gray-600">Please refresh in a moment.</p>
  </div>
</main>
{:else}
<main class="max-w-3xl mx-auto px-4 py-8">
  <div class="mb-8">
    <a href="/" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to Home</a>
    <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
      <a href="/waffle-archive" class="hover:underline">Waffle Archive</a>
      <span>&bull;</span>
      <span>{data.formattedDate}</span>
    </div>

    <div class="flex items-center gap-3 mb-2">
      <h1 class="text-4xl font-bold text-gray-900">Waffle Hints and Answer for Today ({data.formattedDate})</h1>
      <div class="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg font-bold text-sm">
        <FiHash class="w-3.5 h-3.5" />
        <span>#{data.number}</span>
      </div>
    </div>
    <p class="text-xl text-gray-600">Here are the solutions for today's Waffle puzzle ({data.formattedDate}).</p>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 mb-8">
    <WaffleAnswerCard puzzle={data.puzzle} solution={data.solution} date={data.date} />

    <div class="mt-8">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-amber-200 dark:border-amber-800 pb-2 mb-6 flex items-center gap-2">
        <FiHash class="text-amber-500" />
        Word Definitions
      </h3>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Across Section -->
        <div>
          <h4 class="flex items-center gap-2 text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4">
            <FiArrowRight class="w-4 h-4" /> Across
          </h4>
          <div class="space-y-4">
            {#each data.words.slice(0, 3) as word}
              {@const def = data.definitions.find((d: any) => d.word.toLowerCase() === word.toLowerCase())}
              <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{word}</span>
                  {#if def?.type}
                    <span class="text-[10px] font-bold text-amber-500 italic">({def.type})</span>
                  {/if}
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-snug">{def?.definition || 'No definition available.'}</p>
              </div>
            {/each}
          </div>
        </div>

        <!-- Down Section -->
        <div>
          <h4 class="flex items-center gap-2 text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4">
            <FiArrowRight class="rotate-90 w-4 h-4" /> Down
          </h4>
          <div class="space-y-4">
            {#each data.words.slice(3, 6) as word}
              {@const def = data.definitions.find((d: any) => d.word.toLowerCase() === word.toLowerCase())}
              <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{word}</span>
                  {#if def?.type}
                    <span class="text-[10px] font-bold text-amber-500 italic">({def.type})</span>
                  {/if}
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-snug">{def?.definition || 'No definition available.'}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-between items-center mb-12">
    <a href={data.prevSlug} class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
      &larr; Previous Waffle
    </a>
    {#if data.showNext}
      <a href={data.nextSlug} class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        Next Waffle &rarr;
      </a>
    {/if}
  </div>

  <!-- SEO Content Section -->
  <article class="space-y-8 mb-12">
    <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        What is Waffle?
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        Waffle is a word puzzle that gives you all the letters upfront — but they're scrambled. Your job is to swap letters around until you've formed six correct words: three across and three down, crossword-style. The grid is shaped like a waffle, which is where the game gets its name.
      </p>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        Unlike Wordle where you're guessing from scratch, Waffle gives you everything you need to solve the puzzle right from the start. The challenge isn't figuring out what letters to use — it's figuring out where each letter belongs. Some letters are already in the correct position (shown in green), while others need to be swapped.
      </p>
      <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        The game tracks how many swaps you make, and the goal is to solve it in 15 moves or fewer. Every puzzle is solvable within that limit, but finding the optimal path requires careful thinking about which letters go where.
      </p>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        How to Play Waffle
      </h2>
      <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
        <p class="leading-relaxed">
          Playing Waffle is straightforward once you understand the basics:
        </p>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 1: Analyze the Grid</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Look at the starting grid. Green letters are already correct — don't move these. Yellow letters are in the word but wrong position. Gray letters don't belong in that word at all.
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 2: Identify Fixed Letters</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Green letters are your anchors. They tell you exactly which letters belong in which positions. Use these as your starting point for figuring out the rest of the words.
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 3: Plan Your Swaps</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Before making any moves, think through which letters need to go where. Each swap affects two positions, so consider the ripple effects. Sometimes the obvious swap isn't the best one.
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 4: Solve Efficiently</h3>
          <p class="text-gray-600 dark:text-gray-300">
            The goal is 15 swaps or fewer. If you're careful, most puzzles can be solved in 10-12 moves. Rush and you might find yourself running out of moves.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Tips for Solving Waffle Faster
      </h2>
      <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Start with Crossings</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Letters that appear in both across and down words are crucial. Getting these right helps you solve two words at once. Focus on intersection points first.
            </p>
          </div>
          <div class="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Think Crossword-Style</h3>
            <p class="text-gray-600 dark:text-gray-300">
              The words interlock like a mini crossword. If you're stuck on one word, try solving a crossing word instead. Sometimes the answer reveals itself through the intersections.
            </p>
          </div>
          <div class="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Avoid Unnecessary Swaps</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Every swap counts. Don't move letters just to see what happens. Plan ahead and make each swap purposeful. The best solvers think several moves ahead.
            </p>
          </div>
          <div class="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Use Our Waffle Solver</h3>
            <p class="text-gray-600 dark:text-gray-300">
              If you're completely stuck, our Waffle Solver can show you the solution. It's great for learning how the pieces fit together and improving your solving skills.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-3xl p-8 border border-amber-100 dark:border-amber-800/30">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Why Waffle is So Satisfying
      </h2>
      <div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
        <p class="leading-relaxed">
          There's something deeply satisfying about watching a scrambled grid transform into perfect words. Each swap brings you closer to the solution, and when the last letter clicks into place, it feels like completing a puzzle where everything just makes sense.
        </p>
        <p class="leading-relaxed">
          The game also rewards careful thinking over quick guessing. You can stare at the grid for five minutes before making your first move, and that's perfectly fine. In fact, the best players often spend more time thinking than swapping.
        </p>
        <p class="leading-relaxed">
          Plus, Waffle has a unique visual appeal. The grid looks like a crossword, but the swapping mechanic makes it feel more like a sliding puzzle. It's a word game that also satisfies that urge to organize and arrange things perfectly.
        </p>
      </div>
    </section>
  </article>

  <InternalLinkSection currentGame="Waffle" />
</main>
{/if}
