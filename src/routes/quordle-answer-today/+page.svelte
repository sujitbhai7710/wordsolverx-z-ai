<script lang="ts">
  import QuordleAnswerCard from '$lib/components/QuordleAnswerCard.svelte';
  import QuordleClues from '$lib/components/QuordleClues.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <link rel="canonical" href="https://wordsolverx.com/quordle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <header class="text-center mb-12">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4">
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Updated Daily
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Quordle Answer Today
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        <span class="font-semibold text-gray-900 dark:text-white">{data.formattedDate}</span> — Get hints and solutions for
        <span class="text-emerald-600 font-bold">Classic</span>,
        <span class="text-blue-600 font-bold">Chill</span>,
        <span class="text-red-600 font-bold">Extreme</span>,
        <span class="text-violet-600 font-bold">Sequence</span>,
        <span class="text-amber-600 font-bold">Rescue</span>, and
        <span class="text-pink-600 font-bold">Weekly</span>.
      </p>
    </header>

    <div class="flex flex-wrap justify-center gap-3 mb-12">
      <a href="/quordle-archive" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
        Browse Archive
      </a>
    </div>

    {#if data.todayData}
      <div class="mb-12">
        <QuordleClues words={data.todayData.d} mode="Classic" />
      </div>
    {/if}

    <div class="mb-16">
      <QuordleAnswerCard date={data.today} />
    </div>

    <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <details class="group bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 overflow-hidden" open>
          <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-emerald-100/50 dark:hover:bg-emerald-800/20 transition-colors">
            <span>What is the Quordle answer for today, {data.formattedDate}?</span>
            <FiChevronDown class="text-emerald-600 dark:text-emerald-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
            The Quordle answer for today, {data.formattedDate}, is <span class="font-bold text-gray-900 dark:text-white uppercase">{data.todayWords}</span>.
          </div>
        </details>
        <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
          <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <span>When does Quordle reset?</span>
            <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
            Quordle resets every day at midnight JST for Daily modes. The Weekly puzzle resets every Monday.
          </div>
        </details>

        <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Recent Quordle Answers</h3>
        {#each data.last10Days as d}
          {#if d}
            <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <span>What was the Quordle answer for {d.formattedDate}?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
                The Quordle answer for {d.formattedDate} was <span class="font-bold text-gray-900 dark:text-white uppercase">{d.d.join(', ').replace(/, ([^,]*)$/, ', and $1')}</span>.
              </div>
            </details>
          {/if}
        {/each}
      </div>
    </article>

    <div class="mt-16">
      <InternalLinkSection currentGame="Quordle" />
    </div>
  </div>
</div>
