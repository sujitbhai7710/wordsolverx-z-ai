<script lang="ts">
  import ColorClues from '$lib/components/ColorClues.svelte';
  import FiClock from '$lib/components/icons/FiClock.svelte';
  import FiCalendar from '$lib/components/icons/FiCalendar.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta?.title ?? "Colordle Answer Yesterday"}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  {#if data.schemas}{@html `<script type="application/ld+json">${data.schemas}</script>`}{/if}
</svelte:head>

{#if data.error || !data.color}
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900"><div class="text-center"><h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h1><p class="text-gray-500">Could not retrieve yesterday's Colordle answer.</p></div></div>
{:else}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">Colordle Answer Yesterday</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400"><span class="font-semibold text-indigo-600 dark:text-indigo-400">{data.formattedDate}</span> · Puzzle #{data.dayNum}</p>
      </header>
      <div class="mb-12"><ColorClues colorName={data.color.name} colorHex={data.color.hex} /></div>
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <a href="/colordle-answer-today" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"><FiClock class="w-5 h-5" /> Today's Answer</a>
        <a href="/colordle-archive" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"><FiCalendar class="w-5 h-5" /> Browse Archive</a>
      </div>
    </div>
  </div>
{/if}
