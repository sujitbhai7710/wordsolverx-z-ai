<script lang="ts">
  import SemantleClues from '$lib/components/SemantleClues.svelte';
  import FiClock from '$lib/components/icons/FiClock.svelte';
  import FiCalendar from '$lib/components/icons/FiCalendar.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta?.title ?? "Semantle Answer Yesterday"}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  <link rel="canonical" href="https://wordsolverx.com/semantle-answer-yesterday" />
  <meta name="robots" content="noindex, follow" />
  {#if data.schemas}{@html `<script type="application/ld+json">${data.schemas}</script>`}{/if}
</svelte:head>

{#if data.error || !data.word || !data.puzzleNumber}
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div class="text-center"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Semantle Answer Not Available</h1><p class="text-gray-500">Unable to load yesterday's puzzle.</p></div></div>
{:else}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">Semantle Answer Yesterday</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">{data.formattedDate} · Puzzle <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">#{data.puzzleNumber}</span></p>
      </header>
      <div class="mb-12"><SemantleClues word={data.word} puzzleNumber={data.puzzleNumber} /></div>
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <a href="/semantle-answer-today" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"><FiClock class="w-5 h-5" /> Today's Answer</a>
        <a href="/semantle-archive" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"><FiCalendar class="w-5 h-5" /> Browse Archive</a>
      </div>
    </div>
  </div>
{/if}
