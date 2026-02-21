<script lang="ts">
  import GlobleCluesSection from '$lib/components/GlobleCluesSection.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <link rel="canonical" href="https://wordsolverx.com/globle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Globle Answer Today</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300">The solution for {data.formattedDate}</p>
  </div>

  <GlobleCluesSection country={data.country} date={data.formattedDate}>
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <div class="p-8 text-center">
        <div class="mb-6">
          <span class="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium tracking-wide">
            TODAY'S ANSWER
          </span>
        </div>

        <h2 class="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">{data.country.name}</h2>

        <div class="flex justify-center mb-8">
          <div class="relative">
            <img
              src="https://flagcdn.com/w320/{data.country.code.toLowerCase()}.png"
              srcset="https://flagcdn.com/w640/{data.country.code.toLowerCase()}.png 2x"
              width="200"
              alt="Flag of {data.country.name}"
              class="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm shadow-lg">
              {data.country.latitude.toFixed(2)}°, {data.country.longitude.toFixed(2)}°
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Continent</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.continent}</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Subregion</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.subregion}</div>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Country Code</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.code}</div>
          </div>
          <div class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Name Length</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.name.length} letters</div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <a href="/globle-archive" class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors group">
            View All Past Answers
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="mt-12 prose dark:prose-invert mx-auto max-w-3xl">
      <h2>About Globle - The Daily Geography Game</h2>
      <p>Globle is an addictive daily geography puzzle game that challenges players to identify a mystery country using color-coded proximity hints on an interactive 3D globe.</p>
      <h3>How to Play Globle</h3>
      <p>Guess any country in the world, and the game will highlight your guess with a color from red (close) to white (far).</p>
    </div>
  </GlobleCluesSection>
</div>
