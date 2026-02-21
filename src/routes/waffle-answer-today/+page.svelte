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
  <link rel="canonical" href="https://wordsolverx.com/waffle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="max-w-3xl mx-auto px-4 py-8">
  <div class="mb-8">
    <a href="/" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to Home</a>
    <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
      <a href="/waffle-archive" class="hover:underline">Waffle Archive</a>
      <span>&bull;</span>
      <span>{data.formattedDate}</span>
    </div>

    <div class="flex items-center gap-3 mb-2">
      <h1 class="text-4xl font-bold text-gray-900">Waffle Answer Today</h1>
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

  <InternalLinkSection currentGame="Waffle" />
</main>
