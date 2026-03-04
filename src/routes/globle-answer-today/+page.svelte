<script lang="ts">
  import GlobleCluesSection from '$lib/components/GlobleCluesSection.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="news_keywords" content={data.meta.keywords ?? 'globle answer today, globle answer, globle hint, globle hint today'} />
  <link rel="canonical" href="https://wordsolverx.com/globle-answer-today" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolverx.com/globle-answer-today" />
  <meta property="og:image" content={data.meta.featuredImage ?? 'https://wordsolverx.com/wordsolverx.webp'} />
  <meta property="og:image:alt" content={`Globle hints and answer for ${data.formattedDate}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.meta.featuredImage ?? 'https://wordsolverx.com/wordsolverx.webp'} />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Globle Hints and Answer for Today ({data.formattedDate})</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300">Verified Globle hints and the solution for {data.formattedDate}</p>
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
  </GlobleCluesSection>

  <!-- SEO Content Section -->
  <article class="mt-12 space-y-8">
    <section class="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        What is Globle?
      </h2>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Globle is a daily geography game that challenges you to find a mystery country on a 3D globe. Unlike word games where you're guessing letters or words, Globle is all about location. Each day, there's a new country to identify, and you get unlimited guesses to find it.
      </p>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        The game uses a color-coded hint system. When you guess a country, it lights up on the globe with a color that tells you how close you are. The hotter the color (red being the hottest), the closer you are to the mystery country. White or pale colors mean you're far away. It's like playing "hot or cold" with countries.
      </p>
      <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        What makes Globle addictive is that it teaches you geography while you play. You might start by guessing major countries, but as you narrow down the region, you'll find yourself learning about countries you never knew existed. It's educational without feeling like a lesson.
      </p>
    </section>

    <section class="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        How to Play Globle
      </h2>
      <div class="space-y-6 text-lg text-slate-600 dark:text-slate-300">
        <p class="leading-relaxed">
          Playing Globle is simple to learn but can be challenging to master:
        </p>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 1: Make Your First Guess</h3>
          <p class="text-slate-600 dark:text-slate-300">
            Start by guessing any country. Many players start with a large country they know well, like the United States, Russia, or Brazil. This gives you a reference point on the globe.
          </p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 2: Read the Color Hints</h3>
          <p class="text-slate-600 dark:text-slate-300">
            After each guess, pay attention to the color. Red means you're very close — within a few hundred kilometers. Orange and yellow mean moderate distance. White or pale pink means you're far away, possibly on the other side of the world.
          </p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 3: Narrow Down the Region</h3>
          <p class="text-slate-600 dark:text-slate-300">
            Use your guesses to triangulate. If a guess in Europe is red but a guess in Asia is white, the answer is probably in Europe. Keep narrowing until you've isolated the specific region.
          </p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 4: Identify the Country</h3>
          <p class="text-slate-600 dark:text-slate-300">
            Once you know the region, start guessing countries in that area. The color hints will guide you to the exact country. When you guess correctly, the game celebrates your success!
          </p>
        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Tips for Getting Better at Globle
      </h2>
      <div class="space-y-6 text-lg text-slate-600 dark:text-slate-300">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Know Your Continents</h3>
            <p class="text-slate-600 dark:text-slate-300">
              Start by figuring out which continent the country is on. Guess one country per continent to quickly eliminate large areas of the globe.
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Learn Country Locations</h3>
            <p class="text-slate-600 dark:text-slate-300">
              The more you know about where countries are located, the faster you'll solve each puzzle. Spend time studying maps and you'll see improvement.
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Use Strategic Guesses</h3>
            <p class="text-slate-600 dark:text-slate-300">
              Don't guess randomly. Each guess should help you eliminate a region or confirm a suspicion. Think about what information each guess will give you.
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Practice with Smaller Countries</h3>
            <p class="text-slate-600 dark:text-slate-300">
              Small countries are often the hardest to find. Practice by learning the locations of smaller nations — they're frequently the mystery country.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800/30">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Why Geography Games Matter
      </h2>
      <div class="space-y-4 text-lg text-slate-600 dark:text-slate-300">
        <p class="leading-relaxed">
          Games like Globle do more than entertain — they actually teach you about the world. Many people can name dozens of countries but would struggle to point to them on a map. Globle fixes that by making you actively think about where countries are located.
        </p>
        <p class="leading-relaxed">
          Regular players often find themselves getting better not just at the game, but at understanding world geography in general. You start to remember that Mongolia is between Russia and China, that Namibia is on the southwest coast of Africa, or that the Philippines is an archipelago in Southeast Asia.
        </p>
        <p class="leading-relaxed">
          Plus, there's something satisfying about spinning a 3D globe and watching countries light up. It's a tactile, visual way to learn that sticks with you better than memorizing lists or reading textbooks.
        </p>
      </div>
    </section>
  </article>
</div>
