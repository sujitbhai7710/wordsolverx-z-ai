<script lang="ts">
  import ColorClues from '$lib/components/ColorClues.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta?.title ?? 'Colordle Answer Today'}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.color}
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h1>
      <p class="text-gray-500">Could not retrieve today's Colordle answer.</p>
    </div>
  </div>
{:else}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Colordle Answer Today
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          The official solution for <span class="font-semibold text-indigo-600 dark:text-indigo-400">{data.formattedDate}</span>
        </p>
      </header>

      <div class="mb-12">
        <ColorClues colorName={data.color.name} colorHex={data.color.hex} />
      </div>

      <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Today's Puzzle</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Today's Colordle puzzle number is <strong class="text-indigo-600 dark:text-indigo-400">#{data.dayNum}</strong>. The solution color is <strong class="text-gray-900 dark:text-white">{data.color.name}</strong> with the hex code <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">{data.color.hex}</code>.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 overflow-hidden">
            <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white">
              <span>What is the Colordle answer for today, {data.formattedDate}?</span>
              <FiChevronDown class="text-purple-600 dark:text-purple-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
              The Colordle answer for today is <span class="font-bold text-gray-900 dark:text-white">{data.color.name}</span> with hex code <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{data.color.hex}</span>.
            </div>
          </details>

          <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Recent Colordle Answers</h3>
          {#each data.last10Days as d}
            {#if d}
              <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <span>What was the Colordle answer for {d.formattedDate}?</span>
                  <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600 flex-shrink-0" style="background-color: {d.color.hex}"></div>
                  <span>The answer was <span class="font-bold text-gray-900 dark:text-white">{d.color.name}</span> <span class="font-mono text-indigo-600 dark:text-indigo-400">({d.color.hex})</span>.</span>
                </div>
              </details>
            {/if}
          {/each}
        </div>
      </article>

      <div class="mt-16">
        <InternalLinkSection currentGame="Colordle" />
      </div>
    </div>
  </div>
{/if}
