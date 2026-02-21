<script lang="ts">
  import SemantleClues from '$lib/components/SemantleClues.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta?.title ?? 'Semantle Answer Today'}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.word || !data.puzzleNumber}
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Semantle Answer Not Available</h2>
      <p class="text-gray-500">Unable to load today's puzzle. Please try again later.</p>
    </div>
  </div>
{:else}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
          Semantle Answer Today
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {data.formattedDate} • Puzzle <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">#{data.puzzleNumber}</span>
        </p>
      </header>

      <div class="mb-12">
        <SemantleClues word={data.word} puzzleNumber={data.puzzleNumber} />
      </div>

      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <a href="/semantle-answer-yesterday" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all">
          Yesterday's Answer
        </a>
        <a href="/semantle-archive" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all">
          Browse Archive
        </a>
      </div>

      <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Today's Puzzle</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Today's Semantle puzzle number is <strong class="text-indigo-600 dark:text-indigo-400">#{data.puzzleNumber}</strong>.
          The secret word is <strong class="text-gray-900 dark:text-white uppercase">{data.word}</strong>.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 overflow-hidden">
            <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white">
              <span>What is the Semantle answer for today, {data.formattedDate}?</span>
              <FiChevronDown class="text-purple-600 dark:text-purple-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
              The Semantle answer for today is <span class="font-bold text-gray-900 dark:text-white uppercase">{data.word}</span> (Puzzle #{data.puzzleNumber}).
            </div>
          </details>

          <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Recent Semantle Answers</h3>
          {#each data.last10Days as d}
            {#if d}
              <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <span>What was the Semantle answer for {d.formattedDate}?</span>
                  <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
                  The answer was <span class="font-bold text-gray-900 dark:text-white uppercase">{d.word}</span> (Puzzle #{d.puzzleNumber}).
                </div>
              </details>
            {/if}
          {/each}
        </div>
      </article>

      <div class="mt-16">
        <InternalLinkSection currentGame="Semantle" />
      </div>
    </div>
  </div>
{/if}
